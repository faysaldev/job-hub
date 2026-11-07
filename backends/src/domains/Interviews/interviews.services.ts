import Interview, { IInterview } from "./interviews.model";
import Application from "../Applications/application.model";
import Conversation from "../Conversations/conversations.model";
import { createNotification } from "../Notifications/notifications.service";
import Job from "../Jobs/job.model";
import { AppError } from "../../lib/errors";
import { assertId } from "../../lib/query";

const assertOwnedInterview = async (interviewId: string, recruiterId: string) => {
  assertId(interviewId, "interview ID");
  const interview = await Interview.findById(interviewId);
  if (!interview) throw new AppError("Interview not found", 404);
  const owned = await Job.exists({ _id: interview.job_id, author: recruiterId });
  if (!owned || interview.interviewer.toString() !== recruiterId) throw new AppError("Interview not found", 404);
  return interview;
};
const scheduleInterview = async (data: Partial<IInterview>) => {
  if (!data.application_id || !data.job_id || !data.interviewee || !data.interviewer) throw new AppError("Missing interview fields", 400);
  const job = await Job.findOne({ _id: data.job_id, author: data.interviewer,
    isDeleted: { $ne: true } }).select("title author");
  if (!job) throw new AppError("Job not found or permission denied", 404);
  const application = await Application.findOne({ _id: data.application_id, job_id: job._id,
    applicant: data.interviewee, isWithdrawn: { $ne: true }, status: { $nin: ["hired", "rejected"] } });
  if (!application) throw new AppError("Application does not match this candidate and job", 400);
  const interview = await Interview.create(data);
  await Application.updateOne({ _id: application._id }, { $set: { status: "interview" } });
  await Conversation.updateOne({ job_id: job._id, participants: { $all: [data.interviewee, data.interviewer] } },
    { $set: { status: "interview" } });
  try { await createNotification({ title: `Interview scheduled for ${job.title}`,
    link: "/job-seeker/interviews", sender: job.author, receiver: application.applicant }); }
  catch (error) { console.error("Failed to send interview notice", error); }
  return interview;
};
const getInterviewsForUser = async (userId: string, role: "interviewer" | "interviewee") => {
  const interviews = await Interview.find({ [role]: userId }).populate("application_id", "status job_id applicant")
    .populate("job_id", "title").sort({ date: 1, start_time: 1 }).limit(300);
  return Interview.populate(interviews, { path: role === "interviewer" ? "interviewee" : "interviewer",
    select: "name email image" });
};
const updateInterviewStatus = async (id: string, status: "scheduled" | "completed" | "cancelled", userId: string) => {
  await assertOwnedInterview(id, userId);
  const updated = await Interview.findOneAndUpdate({ _id: id, interviewer: userId },
    { $set: { status } }, { new: true, runValidators: true });
  if (!updated) throw new AppError("Interview not found", 404);
  return updated;
};
const hireCandidate = async (jobId: string, applicantId: string, userId: string) => {
  const job = await Job.findOne({ _id: assertId(jobId), author: userId, isDeleted: { $ne: true } }).select("title");
  if (!job) throw new AppError("Job not found", 404);
  const updated = await Application.findOneAndUpdate({ job_id: job._id, applicant: assertId(applicantId),
    isWithdrawn: { $ne: true }, status: { $ne: "rejected" } }, { $set: { status: "hired" } }, { new: true });
  if (!updated) throw new AppError("Candidate has no eligible application", 404);
  await Promise.all([
    Conversation.updateOne({ job_id: job._id, participants: { $all: [applicantId, userId] } }, { $set: { status: "hired" } }),
    Interview.updateMany({ job_id: job._id, interviewee: applicantId, interviewer: userId, status: "scheduled" }, { $set: { status: "completed" } }),
  ]);
  try { await createNotification({ title: `You have been hired for ${job.title}`, link: "/job-seeker/applications", sender: userId, receiver: applicantId }); }
  catch (error) { console.error("Failed to send hire notification", error); }
  return { success: true };
};
const rescheduleInterview = async (id: string, data: { date: string; start_time: string; end_time: string }, userId: string) => {
  await assertOwnedInterview(id, userId);
  const interview = await Interview.findOneAndUpdate({ _id: id, interviewer: userId, status: "scheduled" },
    { $set: { date: data.date, start_time: data.start_time, end_time: data.end_time } }, { new: true, runValidators: true });
  if (!interview) throw new AppError("Cannot reschedule a finished interview", 409);
  try { await createNotification({ title: "Interview rescheduled", link: "/job-seeker/interviews",
    sender: userId, receiver: interview.interviewee }); }
  catch (error) { console.error("Failed to send reschedule notification", error); }
  return interview;
};
export default { scheduleInterview, getInterviewsForUser, updateInterviewStatus, hireCandidate, rescheduleInterview };
