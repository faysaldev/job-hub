import Job from "../Jobs/job.model";
import SavedSearch from "./savedsearch.model";
import { createNotification } from "../Notifications/notifications.service";
import { escapeRegex } from "../../lib/query";
import User from "../User/user.model";

/** Scheduled, resumable in-app alerts; never triggered from a public HTTP request. */
export const runJobAlerts = async () => {
  let processed = 0, notifications = 0;
  const now = new Date();
  for await (const search of SavedSearch.find({ alertsEnabled: true }).cursor()) {
    // Alert runs are idempotent across concurrent schedulers through the atomic claim below.
    const interval = search.frequency === "weekly" ? 7 * 86400000 : 86400000;
    if (search.lastCheckedAt && now.getTime() - search.lastCheckedAt.getTime() < interval) continue;
    const claimed = await SavedSearch.findOneAndUpdate({ _id: search._id,
      $or: [{ lastCheckedAt: { $exists: false } }, { lastCheckedAt: { $lt: new Date(now.getTime() - interval) } }] },
      { $set: { lastCheckedAt: now } }, { new: true });
    if (!claimed) continue;
    processed++;
    const since = search.lastCheckedAt || new Date(now.getTime() - interval);
    const match: Record<string, any> = { status: "published", isActive: true, isDeleted: { $ne: true },
      publishedAt: { $gt: since, $lte: now }, applicationDeadline: { $gt: now } };
    if (search.filters?.q) match.$or = ["title", "description", "skills"].map((k) => ({
      [k]: new RegExp(escapeRegex(search.filters.q), "i") }));
    if (search.filters?.location) match.location = new RegExp(escapeRegex(search.filters.location), "i");
    if (search.filters?.category) match.category = search.filters.category;
    if (search.filters?.type) match.type = search.filters.type;
    if (search.filters?.locationType) match.locationType = search.filters.locationType;
    try {
      const [jobs, user] = await Promise.all([Job.find(match).select("_id title author").limit(10).lean(),
        User.findOne({ _id: search.userId, role: "seeker", isDeleted: { $ne: true }, isEmailVerified: true }).select("_id").lean()]);
      if (jobs.length && user) {
        await createNotification({ sender: jobs[0].author, receiver: search.userId,
          title: `${jobs.length}${jobs.length === 10 ? "+" : ""} new jobs match your saved search: ${search.name}`,
          link: "/job-seeker/search-alerts" });
        notifications++;
      }
    } catch (error) {
      // Roll back the claim on failure, so the next scheduled pass retries safely.
      await SavedSearch.updateOne({ _id: search._id, lastCheckedAt: now },
        search.lastCheckedAt ? { $set: { lastCheckedAt: search.lastCheckedAt } } : { $unset: { lastCheckedAt: "" } });
      console.error("Job alert delivery failed", error);
    }
  }
  return { processed, notifications };
};
