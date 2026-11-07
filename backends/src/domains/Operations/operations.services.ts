import mongoose, { ClientSession, Types } from "mongoose";
import Stripe from "stripe";
import { AppError } from "../../lib/errors";
import { escapeRegex } from "../../lib/query";
import Company from "../Company/company.model";
import { companyForActor } from "../Company/company.access";
import Job from "../Jobs/job.model";
import jobService from "../Jobs/job.services";
import User from "../User/user.model";
import AuthSession from "../Auth/auth.session.model";
import Application from "../Applications/application.model";
import Interview from "../Interviews/interviews.model";
import BillingAccount from "../Billing/billing.account.model";
import BillingInvoice from "../Billing/billing.invoice.model";
import StripeEvent from "../Billing/billing.webhook.model";
import JobPromotion from "../Billing/billing.promotion.model";
import { processStripeEvent } from "../Billing/billing.webhook";
import Contact from "../Generals/contact.model";
import Audit from "./operations.audit.model";
import Report from "./operations.report.model";
import type { AdminAction, RecordsQuery } from "./operations.validation";

const id = (value: string) => new Types.ObjectId(value);
const monthAgo = () => new Date(Date.now() - 30 * 86400_000);
const companyJobs = (company: { _id: Types.ObjectId; userId: Types.ObjectId }) => ({
  $or: [{ companyId: company._id }, { author: company.userId }], isDeleted: { $ne: true },
});

/** Write only terse state transitions, not full user/job/payment documents. */
export const recordAudit = async (entry: {
  actorId: string; action: string; targetKind: string; targetId: string;
  before?: string; after?: string; reason?: string; requestId?: string;
}, session?: ClientSession) => {
  await Audit.create([{ ...entry, actorId: id(entry.actorId) }], session ? { session } : {});
};

async function transactional<T>(work: (session: ClientSession) => Promise<T>): Promise<T> {
  const session = await mongoose.startSession();
  try {
    let value!: T;
    await session.withTransaction(async () => { value = await work(session); },
      { readConcern: { level: "snapshot" }, writeConcern: { w: "majority" } });
    return value;
  } finally { await session.endSession(); }
}

/** Shared with legacy admin verification endpoint: same audit and transaction. */
export async function reviewCompanyVerification(companyId: string, actorId: string,
  decision: "verified" | "rejected", reason = "", requestId?: string) {
  if (decision === "rejected" && reason.trim().length < 5)
    throw new AppError("Provide a rejection reason", 400);
  return transactional(async session => {
    const company = await Company.findOne({ _id: id(companyId), "verification.status": "pending" }).session(session);
    if (!company) throw new AppError("Pending verification request not found", 409);
    const updated = await Company.findOneAndUpdate({ _id: company._id, "verification.status": "pending" }, {
      $set: { "verification.status": decision, "verification.reason": reason.trim(),
        "verification.reviewedAt": new Date(), "verification.reviewedBy": id(actorId) },
    }, { new: true, runValidators: true, session });
    if (!updated) throw new AppError("Verification changed; refresh and retry", 409);
    await recordAudit({ actorId, action: "company.verification", targetKind: "company", targetId: companyId,
      before: "pending", after: decision, reason, requestId }, session);
    return { companyId, verification: updated.verification };
  });
}

export async function submitReport(actorId: string, body: {
  targetKind: "job"|"company"|"user"; targetId: string; category: string; description: string;
}) {
  if (body.targetKind === "user" && body.targetId === actorId) throw new AppError("Cannot report your own account", 400);
  const exists = body.targetKind === "job" ? await Job.exists({ _id: id(body.targetId), isDeleted: { $ne: true } }) :
    body.targetKind === "company" ? await Company.exists({ _id: id(body.targetId) }) :
      await User.exists({ _id: id(body.targetId), isDeleted: { $ne: true } });
  if (!exists) throw new AppError("Reported item not found", 404);
  const previous = await Report.exists({ reporterId: id(actorId), targetKind: body.targetKind,
    targetId: id(body.targetId), status: { $in: ["open", "reviewing"] } });
  if (previous) throw new AppError("You already have a pending report for this item", 409);
  const record = await Report.create({ ...body, reporterId: id(actorId), targetId: id(body.targetId) });
  return { _id: record._id, status: record.status };
}

export async function adminOverview() {
  const date = monthAgo();
  const [users, companies, jobs, applications, pendingVerification, pendingReports, openSupport,
    failedStripeEvents, pastDue, sponsoredJobs, newUsers, newApplications, trend, paidInvoices] = await Promise.all([
    User.countDocuments({ isDeleted: { $ne: true } }), Company.countDocuments(),
    Job.countDocuments({ isDeleted: { $ne: true } }), Application.countDocuments(),
    Company.countDocuments({ "verification.status": "pending" }),
    Report.countDocuments({ status: { $in: ["open", "reviewing"] } }),
    Contact.countDocuments({ status: { $in: [null, "open", "in_progress"] } }),
    StripeEvent.countDocuments({ status: "failed" }),
    BillingAccount.countDocuments({ stripeStatus: { $in: ["past_due", "unpaid"] } }),
    JobPromotion.countDocuments({ status: "active", endsAt: { $gt: new Date() } }),
    User.countDocuments({ createdAt: { $gte: date }, isDeleted: { $ne: true } }),
    Application.countDocuments({ createdAt: { $gte: date } }),
    Application.aggregate([{ $match: { createdAt: { $gte: date } } },
      { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, value: { $sum: 1 } } },
      { $sort: { _id: 1 } }]),
    BillingInvoice.aggregate([{ $match: { paidAt: { $gte: date }, reversedAt: { $exists: false } } },
      { $group: { _id: null, usdCents: { $sum: { $cond: [{ $eq: ["$currency", "usd"] }, "$amountPaidCents", 0] } },
        invoices: { $sum: 1 } } }]),
  ]);
  return { generatedAt: new Date().toISOString(), totals: { users, companies, jobs, applications },
    attention: { pendingVerification, pendingReports, openSupport, failedStripeEvents, pastDue },
    last30Days: { newUsers, newApplications, paidUsdCents: paidInvoices[0]?.usdCents || 0,
      paidInvoices: paidInvoices[0]?.invoices || 0, sponsoredJobs },
    applicationsPerDay: trend.map((x: { _id: string; value: number }) => ({ day: x._id, count: x.value })) };
}

/** No client-selected collections, sort operators, or unbounded result sets. */
export async function adminRecords(query: RecordsQuery) {
  const skip = (query.page - 1) * query.limit;
  const like = query.search ? new RegExp(escapeRegex(query.search, 80), "i") : null;
  const filters: Record<string, unknown> = {};
  const requireStatus = (values: string[], field: string) => {
    if (query.status) {
      if (!values.includes(query.status)) throw new AppError("Invalid status filter", 400);
      filters[field] = query.status;
    }
  };
  let rows: unknown[]; let total: number;
  switch (query.kind) {
    case "companies": {
      requireStatus(["unverified", "pending", "verified", "rejected"], "verification.status");
      if (like) filters.$or = [{ companyName: like }, { website: like }];
      [rows, total] = await Promise.all([
        Company.find(filters).select("companyName website companyLocation careersSlug userId verification createdAt")
          .populate("userId", "name email role").sort({ createdAt: -1 }).skip(skip).limit(query.limit).lean(),
        Company.countDocuments(filters),
      ]); break;
    }
    case "jobs": {
      requireStatus(["draft", "scheduled", "published", "closed", "blocked"],
        query.status === "blocked" ? "moderation.status" : "status");
      if (like) filters.$or = [{ title: like }, { location: like }];
      filters.isDeleted = { $ne: true };
      [rows, total] = await Promise.all([
        Job.find(filters).select("title status moderation author companyId isActive applicationDeadline sponsoredUntil createdAt")
          .populate("author", "name email").sort({ createdAt: -1 }).skip(skip).limit(query.limit).lean(),
        Job.countDocuments(filters),
      ]); break;
    }
    case "users": {
      requireStatus(["seeker", "recruiter", "admin", "suspended"],
        query.status === "suspended" ? "suspensionState" : "role");
      if (query.status === "suspended") { delete filters.suspensionState; filters.suspendedAt = { $exists: true }; }
      if (like) filters.$or = [{ email: like }, { name: like }];
      filters.isDeleted = { $ne: true };
      [rows, total] = await Promise.all([
        User.find(filters).select("name email image role isEmailVerified suspendedAt suspensionReason createdAt")
          .sort({ createdAt: -1 }).skip(skip).limit(query.limit).lean(),
        User.countDocuments(filters),
      ]); break;
    }
    case "reports": {
      requireStatus(["open", "reviewing", "resolved", "dismissed"], "status");
      [rows, total] = await Promise.all([
        Report.find(filters).select("reporterId targetKind targetId category description status resolutionNote createdAt reviewedAt")
          .sort({ createdAt: -1 }).skip(skip).limit(query.limit).lean(),
        Report.countDocuments(filters),
      ]); break;
    }
    case "support": {
      requireStatus(["open", "in_progress", "resolved"], "status");
      if (!query.status) delete filters.status;
      else if (query.status === "open") { delete filters.status; filters.$or = [{ status: "open" }, { status: { $exists: false } }]; }
      if (like) filters.$and = [{ $or: [{ email: like }, { subject: like }] }];
      [rows, total] = await Promise.all([
        Contact.find(filters).select("fullName email department subject message status resolutionNote createdAt")
          .sort({ createdAt: -1 }).skip(skip).limit(query.limit).lean(),
        Contact.countDocuments(filters),
      ]); break;
    }
    case "subscriptions": {
      requireStatus(["active", "past_due", "unpaid", "canceled", "trialing", "incomplete"], "stripeStatus");
      [rows, total] = await Promise.all([
        BillingAccount.find(filters).select("companyId stripeStatus snapshot paidThrough cancelAtPeriodEnd createdAt")
          .populate("companyId", "companyName").sort({ updatedAt: -1 }).skip(skip).limit(query.limit).lean(),
        BillingAccount.countDocuments(filters),
      ]); break;
    }
    case "invoices": {
      [rows, total] = await Promise.all([
        BillingInvoice.find({}).select("companyId stripeInvoiceId amountPaidCents currency reversedAt paidAt planKey planVersion periodEnd")
          .populate("companyId", "companyName").sort({ paidAt: -1 }).skip(skip).limit(query.limit).lean(),
        BillingInvoice.countDocuments(),
      ]); break;
    }
    case "stripe-events": {
      requireStatus(["processing", "processed", "failed"], "status");
      [rows, total] = await Promise.all([
        StripeEvent.find(filters).select("type status attempts lastError createdAt processedAt")
          .sort({ createdAt: -1 }).skip(skip).limit(query.limit).lean(),
        StripeEvent.countDocuments(filters),
      ]); break;
    }
    case "audit": {
      [rows, total] = await Promise.all([
        Audit.find({}).select("actorId action targetKind targetId before after reason requestId createdAt")
          .sort({ createdAt: -1 }).skip(skip).limit(query.limit).lean(),
        Audit.countDocuments(),
      ]); break;
    }
  }
  return { kind: query.kind, records: rows!, pagination: { total: total!, page: query.page,
    limit: query.limit, totalPages: Math.ceil(total! / query.limit) } };
}

export async function recruiterAnalytics(actorId: string) {
  const { company } = await companyForActor(actorId, "view");
  const jobQuery = companyJobs(company);
  const jobIds = await Job.distinct("_id", jobQuery);
  const filter = { job_id: { $in: jobIds }, isWithdrawn: { $ne: true } };
  const date = monthAgo();
  const [totalJobs, openJobs, applications, stages, applicationsPerDay, interviews,
    promotions, paidPromotions] = await Promise.all([
    Job.countDocuments(jobQuery), Job.countDocuments({ ...jobQuery, status: "published", isActive: true,
      applicationDeadline: { $gt: new Date() } }),
    Application.countDocuments(filter),
    Application.aggregate([{ $match: filter }, { $group: { _id: "$status", count: { $sum: 1 } } }]),
    Application.aggregate([{ $match: { ...filter, createdAt: { $gte: date } } },
      { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } }]),
    Interview.countDocuments({ job_id: { $in: jobIds }, status: "completed" }),
    JobPromotion.countDocuments({ companyId: company._id, status: "active", endsAt: { $gt: new Date() } }),
    JobPromotion.countDocuments({ companyId: company._id, source: "stripe", status: { $in: ["active", "reversed"] } }),
  ]);
  return { companyId: company._id, generatedAt: new Date().toISOString(), windowDays: 30,
    totals: { totalJobs, openJobs, applications, completedInterviews: interviews, activePromotions: promotions, paidPromotions },
    funnel: stages.map((row: { _id: string; count: number }) => ({ stage: row._id, count: row.count })),
    applicationsPerDay: applicationsPerDay.map((row: { _id: string; count: number }) => ({ day: row._id, count: row.count })),
    caveat: "Promotions are counts of placements, not guaranteed attributable applications or impressions." };
}

export async function adminAction(actorId: string, action: AdminAction, requestId?: string) {
  if (action.action === "verify-company") return reviewCompanyVerification(action.companyId, actorId, action.decision, action.reason, requestId);
  if (action.action === "reconcile-invoice") {
    const invoice = await BillingInvoice.findById(id(action.invoiceId)).lean();
    if (!invoice) throw new AppError("Invoice not found", 404);
    if (!process.env.STRIPE_SECRET_KEY) throw new AppError("Stripe is unavailable", 503);
    const remote = await new Stripe(process.env.STRIPE_SECRET_KEY).invoices.retrieve(invoice.stripeInvoiceId);
    return { invoiceId: invoice._id, stripeId: invoice.stripeInvoiceId, recordedPaidCents: invoice.amountPaidCents,
      stripePaidCents: remote.amount_paid, stripeStatus: remote.status, currencyMatches: remote.currency === invoice.currency,
      matches: remote.status === "paid" && remote.amount_paid === invoice.amountPaidCents && remote.currency === invoice.currency,
      note: "Read-only comparison. Financial records are changed only by verified Stripe events." };
  }
  if (action.action === "retry-stripe-event") {
    const failed = await StripeEvent.findOne({ _id: action.eventId, status: "failed" });
    if (!failed) throw new AppError("Failed Stripe event not found", 404);
    if (!process.env.STRIPE_SECRET_KEY) throw new AppError("Stripe is unavailable", 503);
    const verified = await new Stripe(process.env.STRIPE_SECRET_KEY).events.retrieve(action.eventId);
    await processStripeEvent(verified);
    await recordAudit({ actorId, action: "stripe.retry", targetKind: "stripe-event", targetId: action.eventId, requestId });
    return { eventId: action.eventId, status: "processed" };
  }
  return transactional(async session => {
    const stamp = new Date();
    if (action.action === "moderate-job") {
      const old = await Job.findOne({ _id: id(action.jobId), isDeleted: { $ne: true } }).session(session);
      if (!old) throw new AppError("Job not found", 404);
      if (action.decision === "blocked" && action.reason.trim().length < 5) throw new AppError("Explain why the job was blocked", 400);
      const active = action.decision === "restored" && (old.status === "published" || !old.status) &&
        !!old.applicationDeadline && old.applicationDeadline > stamp;
      const next = action.decision === "blocked" ? "blocked" : "clear";
      if (old.moderation?.status === next) throw new AppError("Moderation decision already applied", 409);
      const updated = await Job.findOneAndUpdate({ _id: old._id, isDeleted: { $ne: true },
        "moderation.status": action.decision === "blocked" ? { $ne: "blocked" } : "blocked" },
      { $set: { "moderation.status": next, "moderation.reason": action.reason,
        "moderation.reviewedAt": stamp, "moderation.reviewedBy": id(actorId), isActive: active } },
      { session, new: true, runValidators: true });
      if (!updated) throw new AppError("Job changed; refresh and retry", 409);
      await recordAudit({ actorId, action: "job.moderation", targetKind: "job", targetId: action.jobId,
        before: old.moderation?.status || "clear", after: next, reason: action.reason, requestId }, session);
      return { jobId: updated._id, moderation: updated.moderation, isActive: updated.isActive };
    }
    if (action.action === "user-access") {
      if (action.userId === actorId) throw new AppError("Cannot change your own access", 403);
      if (action.decision === "suspend" && action.reason.trim().length < 5) throw new AppError("Provide a suspension reason", 400);
      const target = await User.findOne({ _id: id(action.userId), role: { $ne: "admin" }, isDeleted: { $ne: true } }).session(session);
      if (!target) throw new AppError("User not found or protected", 404);
      const before = target.suspendedAt ? "suspended" : "active";
      const update = action.decision === "suspend" ? { $set: { suspendedAt: stamp, suspensionReason: action.reason,
        suspendedBy: id(actorId) } } : { $unset: { suspendedAt: "", suspensionReason: "", suspendedBy: "" } };
      await User.updateOne({ _id: target._id, role: { $ne: "admin" } }, update, { session });
      if (action.decision === "suspend") await AuthSession.updateMany({ userId: target._id, revokedAt: { $exists: false } },
        { $set: { revokedAt: stamp } }, { session });
      await recordAudit({ actorId, action: "user.access", targetKind: "user", targetId: action.userId,
        before, after: action.decision === "suspend" ? "suspended" : "active", reason: action.reason, requestId }, session);
      return { userId: target._id, status: action.decision === "suspend" ? "suspended" : "active" };
    }
    if (action.action === "review-report") {
      const before = await Report.findOne({ _id: id(action.reportId), status: { $in: ["open", "reviewing"] } }).session(session);
      if (!before) throw new AppError("Open report not found", 409);
      const next = await Report.findOneAndUpdate({ _id: before._id, status: before.status },
        { $set: { status: action.decision, resolutionNote: action.reason, reviewerId: id(actorId), reviewedAt: stamp } },
        { new: true, runValidators: true, session });
      if (!next) throw new AppError("Report changed; refresh and retry", 409);
      await recordAudit({ actorId, action: "report.review", targetKind: "report", targetId: action.reportId,
        before: before.status, after: action.decision, reason: action.reason, requestId }, session);
      return { reportId: next._id, status: next.status };
    }
    if (action.action === "support") {
      const previous = await Contact.findById(id(action.contactId)).session(session);
      if (!previous) throw new AppError("Support request not found", 404);
      const result = await Contact.findByIdAndUpdate(previous._id, { $set: {
        status: action.decision, resolutionNote: action.reason, reviewedBy: id(actorId), reviewedAt: stamp,
      } }, { new: true, runValidators: true, session });
      await recordAudit({ actorId, action: "support.status", targetKind: "contact", targetId: action.contactId,
        before: previous.status || "open", after: action.decision, reason: action.reason, requestId }, session);
      return { contactId: result?._id, status: result?.status };
    }
    throw new AppError("Unknown administration action", 400);
  }).then(async result => {
    if (action.action === "moderate-job") await jobService.clearJobCache();
    if (action.action === "user-access" && action.decision === "suspend") {
      // Revoke active sockets immediately across instances when the Redis adapter is enabled.
      // The packet middleware independently checks revoked tokens on every event.
      try {
        const { getIO } = await import("../../config/socketio");
        getIO()?.in(`user:${action.userId}`).disconnectSockets(true);
      } catch { /* DB session revocation remains authoritative. */ }
    }
    return result;
  });
}
