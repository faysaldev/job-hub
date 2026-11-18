/** Shared, time-aware job policy. Keep every public query and billing slot check aligned. */
export type JobLifecycleStatus = "draft" | "scheduled" | "published" | "closed";
export type CompanyJobOwner = { _id: unknown; userId: unknown };

export const jobOwnerFilter = (company: CompanyJobOwner) => ({
  $or: [{ companyId: company._id }, { author: company.userId }],
});

/** A public job is published, not moderated, not archived, active and unexpired.
 * Older jobs with no status are treated as published only while isActive=true. */
export const publicJobFilter = (now: Date = new Date()) => ({
  isDeleted: { $ne: true },
  "moderation.status": { $ne: "blocked" },
  status: { $in: ["published", null] },
  isActive: true,
  applicationDeadline: { $gt: now },
});

/** Both live and scheduled jobs reserve a plan slot. Drafts/closed/expired,
 * blocked and archived jobs never consume quota. */
export const quotaJobFilter = (company: CompanyJobOwner, now: Date = new Date()) => ({
  ...jobOwnerFilter(company),
  isDeleted: { $ne: true },
  "moderation.status": { $ne: "blocked" },
  applicationDeadline: { $gt: now },
  $and: [{ $or: [
    { status: "scheduled" },
    { status: "published", isActive: true },
    { status: null, isActive: true },
  ] }],
});

/** Whether a record reserves a slot (used for transitions under the company lock). */
export const reservesJobSlot = (job: Record<string, any>, now: Date = new Date()) =>
  job.isDeleted !== true && job.moderation?.status !== "blocked" &&
  !!job.applicationDeadline && new Date(job.applicationDeadline).getTime() > now.getTime() &&
  (job.status === "scheduled" ||
    ((job.status === "published" || job.status == null) && job.isActive === true));
