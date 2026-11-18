import mongoose from "mongoose";
import Company from "../Company/company.model";
import CompanyMember from "../Company/company.member.model";
import Job from "../Jobs/job.model";
import { jobOwnerFilter, publicJobFilter, quotaJobFilter } from "../Jobs/job.lifecycle";
import { AppError } from "../../lib/errors";
import BillingAccount from "./billing.account.model";
import CreditGrant from "./billing.credit.model";
import BillingPlan from "./billing.plan.model";
import { PlanLimits } from "./billing.plan.model";

export const FREE_LIMITS: PlanLimits = Object.freeze({ activeJobs: 1, teamSeats: 1, monthlyCredits: 0 });
export const freeEntitlement = () => ({ key: "free", version: 1, name: "Free", limits: FREE_LIMITS, priceCents: 0, currency: "usd" as const });
export const currentEntitlement = async (companyId: string) => {
  const account = await BillingAccount.findOne({ companyId }).lean();
  const valid = !!account?.snapshot && !!account?.paidThrough && account.paidThrough.getTime() > Date.now() &&
    ["active", "past_due"].includes(account.stripeStatus || "");
  const publishedFree = valid ? null : await BillingPlan.findOne({ key: "free", isCurrent: true, published: true }).lean();
  const free = publishedFree ? { key: "free", version: publishedFree.version, name: publishedFree.name,
    priceCents: 0, currency: "usd" as const, limits: publishedFree.limits } : freeEntitlement();
  return { entitlement: valid ? account!.snapshot! : free, account, paid: valid };
};
/** Kept for existing billing call sites. Same predicate as the job service. */
export const activeJobFilter = quotaJobFilter;
export const getUsage = async (company: { _id: any; userId: any }) => {
  const now = new Date();
  const owner = jobOwnerFilter(company);
  const [activeJobs, openJobs, scheduledJobs, publishedJobs, seats, creditRows] = await Promise.all([
    Job.countDocuments(quotaJobFilter(company, now)),
    Job.countDocuments({ ...owner, ...publicJobFilter(now) }),
    Job.countDocuments({ ...owner, status: "scheduled", isDeleted: { $ne: true },
      "moderation.status": { $ne: "blocked" }, applicationDeadline: { $gt: now }, publishAt: { $gt: now } }),
    Job.countDocuments({ ...owner, status: { $in: ["published", null] }, isDeleted: { $ne: true } }),
    CompanyMember.countDocuments({ companyId: company._id, status: { $in: ["invited", "active"] } }),
    CreditGrant.aggregate([{ $match: { companyId: new mongoose.Types.ObjectId(String(company._id)), expiresAt: { $gt: now }, remaining: { $gt: 0 } } },
      { $group: { _id: null, balance: { $sum: "$remaining" } } }]),
  ]);
  return { activeJobs, openJobs, scheduledJobs, publishedJobs, teamSeats: seats + 1, creditBalance: creditRows[0]?.balance || 0 };
};
/** Serialize quota decisions on company row. Requires MongoDB replica set. */
export const withCompanyQuotaLock = async <T>(companyId: string, callback: (session: mongoose.ClientSession) => Promise<T>): Promise<T> => {
  const session = await mongoose.startSession();
  try {
    let output!: T;
    await session.withTransaction(async () => {
      const locked = await Company.findByIdAndUpdate(companyId, { $inc: { billingQuotaRevision: 1 } }, { session, new: true });
      if (!locked) throw new AppError("Company not found", 404);
      output = await callback(session);
    }, { readConcern: { level: "snapshot" }, writeConcern: { w: "majority" } });
    return output;
  } finally { await session.endSession(); }
};
export const requireJobSlot = async (company: { _id: any; userId: any }, session: mongoose.ClientSession) => {
  const { entitlement } = await currentEntitlement(String(company._id));
  const count = await Job.countDocuments(quotaJobFilter(company)).session(session);
  if (count >= entitlement.limits.activeJobs)
    throw new AppError(`Job capacity reached (${count}/${entitlement.limits.activeJobs}, published plus scheduled). Close a listing or upgrade to publish another. Existing listings are preserved.`, 403,
      true, [{ field: "status", message: `Your plan permits ${entitlement.limits.activeJobs} concurrent published/scheduled jobs (${count} reserved).` }]);
};
export const requireTeamSeat = async (companyId: string, session: mongoose.ClientSession) => {
  const { entitlement } = await currentEntitlement(companyId);
  const occupied = await CompanyMember.countDocuments({ companyId, status: { $in: ["invited", "active"] } }).session(session);
  if (occupied + 1 >= entitlement.limits.teamSeats) throw new AppError(`Team seat limit reached (${entitlement.limits.teamSeats}). Upgrade or remove an invitation.`, 403);
};
