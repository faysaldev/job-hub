import Interview, { IInterview } from "./interviews.model";
import Application from "../Applications/application.model";
import appService from "../Applications/application.services";
import { createNotification } from "../Notifications/notifications.service";
import Job from "../Jobs/job.model";
import CompanyMember from "../Company/company.member.model";
import { companyForActor, jobForActor } from "../Company/company.access";
import { AppError } from "../../lib/errors";
import { assertId } from "../../lib/query";

const accessibleInterview = async (id: string, actor: string, requireAssignee = false) => {
  const interview = await Interview.findById(assertId(id, "interview ID"));
  if (!interview) throw new AppError("Interview not found", 404);
  const { teamRole } = await jobForActor(String(interview.job_id), actor, "interviews");
  if (requireAssignee && String(interview.interviewer) !== actor) throw new AppError("Only the assigned interviewer may submit a scorecard", 403);
  if (teamRole === "interviewer" && !requireAssignee && String(interview.interviewer) !== actor)
    throw new AppError("Only assigned interviewers can update their interviews", 403);
  return interview;
};
const scheduleInterview = async (data: Partial<IInterview>, actor: string) => {
  if (!data.application_id || !data.job_id || !data.interviewee) throw new AppError("Missing interview fields", 400);
  const { job, company } = await jobForActor(String(data.job_id), actor, "jobs");
  const assignee = data.interviewer ? String(data.interviewer) : actor;
  if (assignee !== String(company.userId)) {
    const teammate = await CompanyMember.exists({ companyId: company._id, userId: assignee, status: "active",
      role: { $in: ["admin", "recruiter", "interviewer"] } });
    if (!teammate) throw new AppError("Selected interviewer does not belong to this company", 403);
  }
  const application = await Application.findOne({ _id: data.application_id, job_id: job._id,
    applicant: data.interviewee, isWithdrawn: { $ne: true }, status: { $in: ["under_review", "shortlisted", "interview"] } });
  if (!application) throw new AppError("Screen this candidate before scheduling an interview", 409);
  const interview = await Interview.create({ ...data, job_id: job._id, interviewer: assignee });
  if (application.status !== "interview") {
    try { await appService.updateApplicationStatus(String(application._id), actor, "interview"); }
    catch (error) {
      await Interview.deleteOne({ _id: interview._id });
      throw error;
    }
  }
  try { await createNotification({ title: `Interview scheduled for ${job.title}`, link: "/job-seeker/interviews",
    sender: actor, receiver: String(application.applicant) });
    if (assignee !== actor) await createNotification({ title: `You are assigned an interview for ${job.title}`,
      link: "/recruiter/interviews", sender: actor, receiver: assignee }); }
  catch (error) { console.error("Failed to send interview notice", error); }
  return interview;
};
const getInterviewsForUser = async (actor: string, role: "interviewer" | "interviewee") => {
  let query: Record<string, unknown> = role === "interviewee" ? { interviewee: actor } : { interviewer: actor };
  if (role === "interviewer") {
    // Team owners/admins/recruiters can see the hiring calendar; interview-only users see assigned sessions.
    // Revoked or removed teammates must not retain access to historical candidate interviews.
    const workspace = await companyForActor(actor, "interviews");
    if (workspace.teamRole !== "interviewer") {
      const jobIds = await Job.distinct("_id", { $or: [
        { companyId: workspace.company._id }, { author: workspace.company.userId }] });
      query = { job_id: { $in: jobIds } };
    } else {
      const ownedJobs = await Job.distinct("_id", { $or: [
        { companyId: workspace.company._id }, { author: workspace.company.userId }] });
      query = { interviewer: actor, job_id: { $in: ownedJobs } };
    }
  }
  const interviews = await Interview.find(query).populate("application_id", "status job_id applicant")
    .populate("job_id", "title").sort({ date: 1, start_time: 1 }).limit(300).lean();
  // Scorecards are private hiring feedback; never expose them to candidates.
  if (role === "interviewee") interviews.forEach((interview: any) => { delete interview.scorecard; });
  return Interview.populate(interviews, { path: role === "interviewer" ? "interviewee" : "interviewer",
    select: "name email image" });
};
const updateInterviewStatus = async (id: string, status: "scheduled" | "completed" | "cancelled", actor: string) => {
  const interview = await accessibleInterview(id, actor);
  const updated = await Interview.findOneAndUpdate({ _id: interview._id, status: { $ne: "cancelled" } },
    { $set: { status } }, { new: true, runValidators: true });
  if (!updated) throw new AppError("Interview cannot be updated", 409);
  return updated;
};
const saveScorecard = async (id: string, actor: string, input: { overall: number; recommendation: string;
  criteria: Array<{ label: string; score: number }>; feedback?: string }) => {
  const interview = await accessibleInterview(id, actor, true);
  if (interview.status === "cancelled") throw new AppError("Cannot score a cancelled interview", 409);
  return Interview.findOneAndUpdate({ _id: interview._id, interviewer: actor, status: { $ne: "cancelled" } },
    { $set: { scorecard: { ...input, submittedAt: new Date(), submittedBy: actor } } }, { new: true, runValidators: true });
};
const hireCandidate = async (jobId: string, candidateId: string, actor: string) => {
  await jobForActor(jobId, actor, "applications");
  const application = await Application.findOne({ job_id: assertId(jobId), applicant: assertId(candidateId),
    isWithdrawn: { $ne: true } });
  if (!application) throw new AppError("Candidate has no eligible application", 404);
  await appService.updateApplicationStatus(String(application._id), actor, "hired");
  await Interview.updateMany({ job_id: jobId, interviewee: candidateId, status: "scheduled" }, { $set: { status: "completed" } });
  return { success: true };
};
const rescheduleInterview = async (id: string, data: { date: string; start_time: string; end_time: string }, actor: string) => {
  const interview = await accessibleInterview(id, actor);
  const updated = await Interview.findOneAndUpdate({ _id: interview._id, status: "scheduled" },
    { $set: { date: data.date, start_time: data.start_time, end_time: data.end_time } }, { new: true, runValidators: true });
  if (!updated) throw new AppError("Cannot reschedule a finished interview", 409);
  try { await createNotification({ title: "Interview rescheduled", link: "/job-seeker/interviews",
    sender: actor, receiver: updated.interviewee }); }
  catch (error) { console.error("Interview notification failed", error); }
  return updated;
};
export default { scheduleInterview, getInterviewsForUser, updateInterviewStatus, saveScorecard, hireCandidate, rescheduleInterview };
