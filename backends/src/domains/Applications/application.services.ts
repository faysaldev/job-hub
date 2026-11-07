import Application from "./application.model";
import Job from "../Jobs/job.model";
import conversationService from "../Conversations/conversations.services";
import { createNotification } from "../Notifications/notifications.service";
import { AppError } from "../../lib/errors";
import { assertId, paging } from "../../lib/query";
import { assertOwnedResume } from "../Asset/asset.services";
import { companyForActor, jobForActor } from "../Company/company.access";

const notify = async (to: string, from: string, title: string) => {
  try { await createNotification({ title, link: "/job-seeker/applications", sender: from, receiver: to }); }
  catch (error) { console.error("ATS notification failed", error); }
};
const createApplication = async (data: { cover_letter?: string; resume_url: string; applicant: string; job_id: string }) => {
  assertId(data.job_id, "job ID");
  await assertOwnedResume(data.resume_url, data.applicant);
  const job = await Job.findOne({ _id: data.job_id, status: { $in: ["published", null] }, isActive: true,
    isDeleted: { $ne: true }, applicationDeadline: { $gte: new Date() } }).select("title author companyId");
  if (!job) throw new AppError("Job is not accepting applications", 404);
  if (job.author.toString() === data.applicant) throw new AppError("Cannot apply to your own job", 403);
  try {
    const application = await Application.create({ ...data, paid_amount: 0,
      stageHistory: [{ to: "applied", actorId: data.applicant, at: new Date() }] });
    return { application, job };
  } catch (error: any) {
    if (error?.code === 11000) throw new AppError("You have already applied to this job", 409);
    throw error;
  }
};
const getApplicationsByApplicant = async (applicantId: string) => Application.find({ applicant: applicantId })
  .select("-internalNotes -stageHistory.note")
  .populate({ path: "job_id", select: "title type author location status", populate: { path: "company", select: "companyName companyLogo" } })
  .sort({ createdAt: -1 }).limit(300).lean();
const getRecruiterApplications = async (actorId: string, filters: any = {}, isAdmin = false) => {
  const bounds = paging(filters, 100);
  const statuses = ["applied", "under_review", "shortlisted", "interview", "offer", "rejected", "hired"];
  if (filters.status && !statuses.includes(filters.status)) throw new AppError("Invalid stage", 400);
  const query: Record<string, unknown> = { isWithdrawn: { $ne: true } };
  if (!isAdmin) {
    const { company } = await companyForActor(actorId, "applications");
    const jobs = await Job.distinct("_id", { $or: [{ companyId: company._id }, { author: company.userId }] });
    query.job_id = { $in: jobs };
  }
  if (filters.status) query.status = filters.status;
  if (filters.jobId) query.job_id = { $eq: assertId(filters.jobId, "job ID"),
    ...(isAdmin ? {} : { $in: (query.job_id as { $in: unknown[] }).$in }) };
  return Application.find(query).populate("applicant", "name email image")
    .populate("job_id", "title location type author companyId").sort({ createdAt: -1 })
    .skip((bounds.page - 1) * bounds.limit).limit(bounds.limit).lean();
};

const transitions: Record<string, string[]> = {
  applied: ["under_review", "shortlisted", "rejected"],
  under_review: ["shortlisted", "interview", "hired", "rejected"],
  shortlisted: ["interview", "hired", "rejected"],
  interview: ["shortlisted", "hired", "rejected"],
  offer: ["hired", "rejected"],
  rejected: [], hired: [],
};
const transition = async (id: string, actorId: string, status: string, note?: string, isAdmin = false) => {
  const application = await Application.findOne({ _id: assertId(id, "application ID"), isWithdrawn: { $ne: true } });
  if (!application) throw new AppError("Application not found", 404);
  const job = isAdmin ? await Job.findById(application.job_id) : (await jobForActor(String(application.job_id), actorId, "applications")).job;
  if (!job) throw new AppError("Application not found", 404);
  const previous = String(application.status);
  if (status === previous) return application;
  if (!transitions[previous]?.includes(status)) throw new AppError(`Cannot move from ${previous} to ${status}`, 409);
  if (status === "hired" && application.offer?.status && application.offer.status !== "accepted")
    throw new AppError("Candidate must accept the offer before hiring", 409);
  const updated = await Application.findOneAndUpdate({ _id: application._id, status: previous, isWithdrawn: { $ne: true } },
    { $set: { status, ...(status === "rejected" ? { rejection_note: note || "" } : {}) },
      $push: { stageHistory: { from: previous, to: status, actorId, at: new Date(), ...(note ? { note } : {}) } } },
    { new: true, runValidators: true });
  if (!updated) throw new AppError("Application was modified; refresh and retry", 409);
  if (status === "under_review") {
    try { await conversationService.createConversationService([String(application.applicant), String(job.author)],
      String(job.author), { status, role: job.title, job_id: String(job._id) }); }
    catch (error) { console.error("Application conversation unavailable", error); }
  }
  await notify(String(application.applicant), actorId, `Application for ${job.title}: ${status.replace(/_/g, " ")}`);
  return updated;
};
const updateApplicationStatus = (id: string, actorId: string, status: string, note?: string, isAdmin = false) =>
  transition(id, actorId, status, note, isAdmin);

const atsAction = async (id: string, actorId: string, role: string, body: any) => {
  assertId(id, "application ID");
  if (body.action === "offer-response") {
    if (role !== "seeker") throw new AppError("Only the candidate may respond", 403);
    const application = await Application.findOne({ _id: id, applicant: actorId, status: "offer", isWithdrawn: { $ne: true },
      "offer.status": "sent", "offer.expiresAt": { $gt: new Date() } });
    if (!application) throw new AppError("No active offer available", 409);
    const decision: "accepted" | "declined" = body.decision;
    const next = decision === "declined" ? "rejected" : "offer";
    const updated = await Application.findOneAndUpdate({ _id: id, applicant: actorId, "offer.status": "sent", "offer.expiresAt": { $gt: new Date() }, status: "offer" },
      { $set: { "offer.status": decision, "offer.respondedAt": new Date(), status: next },
        ...(next === "rejected" ? { $push: { stageHistory: { from: "offer", to: "rejected", actorId, note: "Offer declined", at: new Date() } } } : {}) },
      { new: true, runValidators: true }).select("-internalNotes -stageHistory.note");
    if (!updated) throw new AppError("Offer already answered", 409);
    await notify(String((await Job.findById(application.job_id).select("author"))?.author || actorId), actorId,
      `Candidate ${decision} the offer`);
    return updated;
  }
  if (role !== "recruiter" && role !== "admin") throw new AppError("Recruiter access required", 403);
  const application = await Application.findOne({ _id: id, isWithdrawn: { $ne: true } });
  if (!application) throw new AppError("Application not found", 404);
  const job = role === "admin" ? await Job.findById(application.job_id) :
    (await jobForActor(String(application.job_id), actorId, "applications")).job;
  if (!job) throw new AppError("Application not found", 404);
  if (body.action === "stage") return transition(id, actorId, body.status, body.note, role === "admin");
  if (body.action === "note") {
    const updated = await Application.findOneAndUpdate({ _id: id, isWithdrawn: { $ne: true } },
      { $push: { internalNotes: { text: body.text, authorId: actorId, createdAt: new Date() } } },
      { new: true, runValidators: true });
    return updated;
  }
  if (body.action === "offer") {
    if (!["under_review", "shortlisted", "interview"].includes(String(application.status))) throw new AppError("Screen the application before offering", 409);
    if (body.expiresAt.getTime() <= Date.now()) throw new AppError("Offer expiration must be in the future", 400);
    const updated = await Application.findOneAndUpdate({ _id: id, status: application.status, isWithdrawn: { $ne: true } },
      { $set: { status: "offer", offer: { salary: body.salary, currency: body.currency, message: body.message || "",
        expiresAt: body.expiresAt, status: "sent", sentAt: new Date(), sentBy: actorId } },
        $push: { stageHistory: { from: application.status, to: "offer", actorId, at: new Date() } } },
      { new: true, runValidators: true });
    if (!updated) throw new AppError("Application was modified; refresh and retry", 409);
    await notify(String(application.applicant), actorId, `New offer for ${job.title}`);
    return updated;
  }
  throw new AppError("Unsupported ATS action", 400);
};
const deleteApplication = async (id: string, applicantId: string) => {
  const application = await Application.findOne({ _id: assertId(id, "application ID"), applicant: applicantId,
    isWithdrawn: { $ne: true }, status: { $ne: "hired" } });
  if (!application) throw new AppError("Application not found or cannot be withdrawn", 404);
  const updated = await Application.findOneAndUpdate({ _id: id, applicant: applicantId, isWithdrawn: { $ne: true }, status: application.status },
    { $set: { isWithdrawn: true, withdrawnAt: new Date() },
      $push: { stageHistory: { from: application.status, to: "withdrawn", actorId: applicantId, at: new Date() } } }, { new: true });
  if (!updated) throw new AppError("Application already updated", 409);
  return { _id: updated._id, withdrawn: true };
};
export default { createApplication, getApplicationsByApplicant, getRecruiterApplications,
  updateApplicationStatus, atsAction, deleteApplication };
