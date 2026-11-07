import mongoose from "mongoose";
import Company from "../Company/company.model";
import CompanyMember from "../Company/company.member.model";
import Job from "../Jobs/job.model";
import { AppError } from "../../lib/errors";
import BillingAccount from "./billing.account.model";
import CreditGrant from "./billing.credit.model";
import BillingPlan from "./billing.plan.model";
import { PlanLimits } from "./billing.plan.model";

// Free is a built-in safety fallback: no database seed or client input is required to enforce it.
export const FREE_LIMITS: PlanLimits = Object.freeze({ activeJobs: 1, teamSeats: 1, monthlyCredits: 0 });
export const freeEntitlement = () => ({ key: "free", version: 1, name: "Free", limits: FREE_LIMITS, priceCents: 0, currency: "usd" as const });
export const currentEntitlement = async (companyId: string) => {
  const account = await BillingAccount.findOne({ companyId }).lean();
  const valid = !!account?.snapshot && !!account?.paidThrough && account.paidThrough.getTime() > Date.now() &&
    ["active", "past_due"].includes(account.stripeStatus || "");
  // Free is configurable through the published catalog, with a built-in fallback
  // if the operator has not yet run the plan seed.
  const publishedFree = valid ? null : await BillingPlan.findOne({ key: "free", isCurrent: true, published: true }).lean();
  const free = publishedFree ? { key: "free", version: publishedFree.version, name: publishedFree.name,
    priceCents: 0, currency: "usd" as const, limits: publishedFree.limits } : freeEntitlement();
  return { entitlement: valid ? account!.snapshot! : free, account, paid: valid };
};
export const activeJobFilter = (company: { _id: any; userId: any }) => ({
  isDeleted: { $ne: true }, status: { $in: ["published", "scheduled", null] },
  applicationDeadline: { $gt: new Date() },
  $or: [{ companyId: company._id }, { author: company.userId }],
});
export const getUsage = async (company: { _id: any; userId: any }) => {
  const now = new Date();
  const [activeJobs, seats, creditRows] = await Promise.all([
    Job.countDocuments(activeJobFilter(company)),
    CompanyMember.countDocuments({ companyId: company._id, status: { $in: ["invited", "active"] } }),
    CreditGrant.aggregate([{ $match: { companyId: new mongoose.Types.ObjectId(String(company._id)), expiresAt: { $gt: now }, remaining: { $gt: 0 } } },
      { $group: { _id: null, balance: { $sum: "$remaining" } } }]),
  ]);
  return { activeJobs, teamSeats: seats + 1, creditBalance: creditRows[0]?.balance || 0 };
};
/** Serialize quota decisions on the company row; requires a MongoDB replica set. */
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
  const count = await Job.countDocuments(activeJobFilter(company)).session(session);
  if (count >= entitlement.limits.activeJobs) throw new AppError(`Active-job limit reached (${entitlement.limits.activeJobs}). Upgrade your plan or close an existing listing.`, 403);
};
export const requireTeamSeat = async (companyId: string, session: mongoose.ClientSession) => {
  const { entitlement } = await currentEntitlement(companyId);
  const occupied = await CompanyMember.countDocuments({ companyId, status: { $in: ["invited", "active"] } }).session(session);
  if (occupied + 1 >= entitlement.limits.teamSeats) throw new AppError(`Team seat limit reached (${entitlement.limits.teamSeats}). Upgrade or remove an invitation.`, 403);
};
