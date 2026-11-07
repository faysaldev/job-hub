import Application from "./application.model";
import Job from "../Jobs/job.model";
import conversationService from "../Conversations/conversations.services";
import { createNotification } from "../Notifications/notifications.service";
import { AppError } from "../../lib/errors";
import { assertId, paging } from "../../lib/query";
import { assertOwnedResume } from "../Asset/asset.services";

const createApplication = async (data: { cover_letter?: string; resume_url: string; applicant: string; job_id: string }) => {
  assertId(data.job_id, "job ID");
  await assertOwnedResume(data.resume_url, data.applicant);
  const job = await Job.findOne({ _id: data.job_id, isActive: true, isDeleted: { $ne: true },
    applicationDeadline: { $gte: new Date() } }).select("title author");
  if (!job) throw new AppError("Job is not accepting applications", 404);
  if (job.author.toString() === data.applicant) throw new AppError("Cannot apply to your own job", 403);
  if (await Application.exists({ job_id: data.job_id, applicant: data.applicant })) {
    throw new AppError("You have already applied to this job", 409);
  }
  try {
    const application = await Application.create({ job_id: data.job_id, applicant: data.applicant,
      resume_url: data.resume_url, cover_letter: data.cover_letter, paid_amount: 0 });
    return { application, job };
  } catch (error: any) {
    if (error?.code === 11000) throw new AppError("You have already applied to this job", 409);
    throw error;
  }
};

const getApplicationsByApplicant = async (applicantId: string) => Application.find({
  applicant: applicantId, isWithdrawn: { $ne: true } }).populate({
    path: "job_id", select: "title type author location", populate: { path: "company", select: "companyName companyLogo" }
  }).sort({ createdAt: -1 }).limit(300).lean();

const getRecruiterApplications = async (recruiterId: string, filters: any = {}, isAdmin = false) => {
  const bounds = paging(filters, 200);
  const statuses = ["applied", "under_review", "interview", "rejected", "hired"];
  if (filters.status && !statuses.includes(filters.status)) throw new AppError("Invalid status", 400);
  const jobIds = isAdmin ? null : await Job.distinct("_id", { author: recruiterId });
  const query: Record<string, unknown> = { isWithdrawn: { $ne: true } };
  if (jobIds) query.job_id = { $in: jobIds };
  if (filters.status) query.status = filters.status;
  return Application.find(query).populate("applicant", "name email image")
    .populate("job_id", "title location type author").sort({ createdAt: -1 })
    .skip((bounds.page - 1) * bounds.limit).limit(bounds.limit).lean();
};

const updateApplicationStatus = async (id: string, actorId: string, status: string,
  rejectionNote?: string, isAdmin = false) => {
  assertId(id, "application ID");
  const application = await Application.findOne({ _id: id, isWithdrawn: { $ne: true } });
  if (!application) throw new AppError("Application not found", 404);
  const job = await Job.findOne({ _id: application.job_id, ...(isAdmin ? {} : { author: actorId }) }).select("author title");
  if (!job) throw new AppError("Application not found", 404);
  if (application.status === "hired" && status !== "hired") throw new AppError("Cannot change a hired application", 409);
  const updated = await Application.findOneAndUpdate({ _id: id, job_id: job._id, isWithdrawn: { $ne: true } },
    { $set: { status, ...(rejectionNote !== undefined ? { rejection_note: rejectionNote } : {}) } },
    { new: true, runValidators: true })
    .populate("applicant", "name email image").populate("job_id", "title author");
  if (!updated) throw new AppError("Application not found", 404);
  const applicantId = application.applicant.toString();
  if (status === "under_review") {
    // Conversation creation is idempotent. Never attach metadata to a conversation owned by others.
    try {
      await conversationService.createConversationService([applicantId, job.author.toString()], job.author.toString(),
        { status, role: job.title, job_id: job._id.toString() });
    } catch (error) { console.error("Failed to create application conversation", error); }
  }
  try {
    await createNotification({ title: `Application for "${job.title}" updated to ${status}`,
      link: "/job-seeker/applications", sender: actorId, receiver: applicantId });
  } catch (error) { console.error("Failed to notify applicant", error); }
  return updated;
};

const deleteApplication = async (id: string, applicantId: string) => {
  assertId(id, "application ID");
  const result = await Application.findOneAndUpdate({ _id: id, applicant: applicantId, isWithdrawn: { $ne: true },
    status: { $ne: "hired" } }, { $set: { isWithdrawn: true, withdrawnAt: new Date() } }, { new: true });
  if (!result) throw new AppError("Application not found or cannot be withdrawn", 404);
  return { _id: result._id, withdrawn: true };
};
export default { createApplication, getApplicationsByApplicant, getRecruiterApplications,
  updateApplicationStatus, deleteApplication };
