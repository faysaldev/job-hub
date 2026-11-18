import Follow from "./company-follow.model";
import Company from "../Company/company.model";
import Job from "../Jobs/job.model";
import User from "../User/user.model";
import { publicJobFilter } from "../Jobs/job.lifecycle";
import { createNotification } from "../Notifications/notifications.service";
import { AppError } from "../../lib/errors";
import { assertId } from "../../lib/query";

export const listFollowedCompanies = async (userId: string) =>
  (await Follow.find({ userId }).select("companyId").limit(1000).lean()).map((row) => String(row.companyId));

export const setCompanyFollow = async (userId: string, companyId: string, following: boolean) => {
  const id = assertId(companyId, "company ID");
  if (!following) {
    await Follow.deleteOne({ userId, companyId: id });
    return { companyId, following: false };
  }
  const company = await Company.findById(id).select("_id userId").lean();
  if (!company || !(await User.exists({ _id: company.userId, role: "recruiter", isDeleted: { $ne: true },
    isEmailVerified: true }))) throw new AppError("Employer unavailable", 404);
  // Unique-index protected and idempotent, preserves the original follow timestamp.
  try {
    await Follow.updateOne({ userId, companyId: id }, { $setOnInsert: { userId, companyId: id,
      lastCheckedAt: new Date() } }, { upsert: true });
  } catch (error: any) { if (error?.code !== 11000) throw error; }
  return { companyId, following: true };
};

/** Called by the existing private scheduler, never exposed as a public API. */
export const runCompanyFollowAlerts = async () => {
  let checked = 0, alerts = 0;
  const now = new Date();
  const lookback = new Date(now.getTime() - 5 * 60_000);
  // Avoid scanning on every 5-minute heartbeat for historical follows checked recently.
  for await (const follow of Follow.find({ lastCheckedAt: { $lte: lookback } }).limit(2000).cursor()) {
    const claimed = await Follow.findOneAndUpdate({ _id: follow._id, lastCheckedAt: follow.lastCheckedAt },
      { $set: { lastCheckedAt: now } }, { new: true });
    if (!claimed) continue;
    checked++;
    try {
      const company = await Company.findById(follow.companyId).select("companyName userId").lean();
      if (!company || !(await User.exists({ _id: follow.userId, role: "seeker", isEmailVerified: true, isDeleted: { $ne: true } }))) continue;
      const jobs = await Job.find({ ...publicJobFilter(now), $or: [
        { companyId: company._id }, { author: company.userId }],
        publishedAt: { $gt: follow.lastCheckedAt, $lte: now },
      }).select("_id title").sort({ publishedAt: -1 }).limit(10).lean();
      if (!jobs.length) continue;
      await createNotification({ title: `${company.companyName || "A followed employer"} published ${jobs.length}${jobs.length === 10 ? "+" : ""} new job${jobs.length === 1 ? "" : "s"}`,
        sender: company.userId, receiver: follow.userId, link: `/company/${company._id}`,
        dedupeKey: `follow:${follow._id}:${jobs[0]._id}` });
      alerts++;
    } catch (error) {
      await Follow.updateOne({ _id: follow._id, lastCheckedAt: now }, { $set: { lastCheckedAt: follow.lastCheckedAt } });
      console.error("Company follow alert failed", error);
    }
  }
  return { checked, alerts };
};
