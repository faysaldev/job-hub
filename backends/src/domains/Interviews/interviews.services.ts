import Interview, { IInterview } from "./interviews.model";
import Application from "../Applications/application.model";
import appService from "../Applications/application.services";
import { createNotification } from "../Notifications/notifications.service";
import Job from "../Jobs/job.model";
import CompanyMember from "../Company/company.member.model";
import { companyForActor, jobForActor } from "../Company/company.access";
import { AppError } from "../../lib/errors";
import { assertId } from "../../lib/query";
import { createInterviewSlot } from "./interviews.slot";

const accessibleInterview = async (id: string, actor: string, requireAssignee = false) => {
  const interview = await Interview.findById(assertId(id, "interview ID"));
  if (!interview) throw new AppError("Interview not found", 404);
  const { teamRole } = await jobForActor(String(interview.job_id), actor, "interviews");
  if (requireAssignee && String(interview.interviewer) !== actor) throw new AppError("Only the assigned interviewer may submit a scorecard", 403);
  if (teamRole === "interviewer" && !requireAssignee && String(interview.interviewer) !== actor)
    throw new AppError("Only assigned interviewers can update their interviews", 403);
  return interview;
};
const assertInterviewer = async (company: any, assignee: string) => {
  if (assignee === String(company.userId)) return;
  const member = await CompanyMember.exists({ companyId: company._id, userId: assertId(assignee, "interviewer ID"),
    status: "active", role: { $in: ["admin", "recruiter", "interviewer"] } });
  if (!member) throw new AppError("Selected interviewer is not an active company member", 403);
};
const slotFrom = (data: { date: Date | string; start_time: string; end_time: string; timeZone?: string }) => {
  try { return createInterviewSlot(data); }
  catch (error) { throw new AppError(error instanceof Error ? error.message : "Invalid appointment", 400); }
};
const checkConflict = async (assignee: string, startAt: Date, endAt: Date, excludeId?: string) => {
  const collision = await Interview.exists({ interviewer: assignee, status: "scheduled",
    startAt: { $lt: endAt }, endAt: { $gt: startAt },
    ...(excludeId ? { _id: { $ne: excludeId } } : {}) });
  if (collision) throw new AppError("Interviewer already has an interview in this time slot", 409);
};
const scheduleInterview = async (data: Partial<IInterview>, actor: string) => {
  if (!data.application_id || !data.job_id || !data.interviewee || !data.date || !data.start_time || !data.end_time)
    throw new AppError("Missing interview fields", 400);
  const { job, company } = await jobForActor(String(data.job_id), actor, "jobs");
  const assignee = data.interviewer ? String(data.interviewer) : actor;
  await assertInterviewer(company, assignee);
  const application = await Application.findOne({ _id: data.application_id, job_id: job._id,
    applicant: data.interviewee, isWithdrawn: { $ne: true }, status: { $in: ["under_review", "shortlisted", "interview"] } });
  if (!application) throw new AppError("Screen this candidate before scheduling an interview", 409);
  const slot = slotFrom({ date: data.date, start_time: data.start_time, end_time: data.end_time, timeZone: data.timeZone });
  await checkConflict(assignee, slot.startAt, slot.endAt);
  const interview = await Interview.create({ ...data, ...slot, application_id: application._id,
    interviewee: application.applicant, job_id: job._id, interviewer: assignee });
  if (application.status !== "interview") {
    try { await appService.updateApplicationStatus(String(application._id), actor, "interview"); }
    catch (error) { await Interview.deleteOne({ _id: interview._id }); throw error; }
  }
  try {
    await createNotification({ title: `Interview scheduled for ${job.title}`, link: "/job-seeker/interviews",
      sender: actor, receiver: String(application.applicant) });
    if (assignee !== actor) await createNotification({ title: `You are assigned an interview for ${job.title}`,
      link: "/recruiter/interviews", sender: actor, receiver: assignee });
  } catch (error) { console.error("Failed to send interview notice", error); }
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
  if (interview.status !== "scheduled" || status === "scheduled")
    throw new AppError("Only scheduled interviews can be completed or cancelled", 409);
  const updated = await Interview.findOneAndUpdate({ _id: interview._id, status: "scheduled" },
    { $set: { status } }, { new: true, runValidators: true });
  if (!updated) throw new AppError("Interview was already updated", 409);
  try { await createNotification({ title: `Interview ${status}`, link: "/job-seeker/interviews",
    sender: actor, receiver: updated.interviewee }); }
  catch (error) { console.error("Interview status notification failed", error); }
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
const rescheduleInterview = async (id: string, data: { date: string | Date; start_time: string;
  end_time: string; timeZone?: string; meet_link?: string; interviewer?: string }, actor: string) => {
  const interview = await accessibleInterview(id, actor);
  if (interview.status !== "scheduled") throw new AppError("Only scheduled interviews can be rescheduled", 409);
  const { company, teamRole } = await jobForActor(String(interview.job_id), actor, "interviews");
  const assignee = data.interviewer || String(interview.interviewer);
  if (teamRole === "interviewer" && assignee !== String(interview.interviewer))
    throw new AppError("Only hiring managers can reassign interviews", 403);
  await assertInterviewer(company, assignee);
  const slot = slotFrom({ date: data.date, start_time: data.start_time, end_time: data.end_time,
    timeZone: data.timeZone || interview.timeZone || "UTC" });
  await checkConflict(assignee, slot.startAt, slot.endAt, String(interview._id));
  const updated = await Interview.findOneAndUpdate({ _id: interview._id, status: "scheduled",
    updatedAt: interview.updatedAt }, { $set: { ...slot, interviewer: assignee,
      ...(data.meet_link !== undefined ? { meet_link: data.meet_link } : {}) } },
    { new: true, runValidators: true });
  if (!updated) throw new AppError("Interview was modified; refresh and retry", 409);
  try {
    await createNotification({ title: "Interview rescheduled", link: "/job-seeker/interviews",
      sender: actor, receiver: updated.interviewee });
    if (assignee !== String(interview.interviewer)) await createNotification({ title: "You are assigned an interview",
      link: "/recruiter/interviews", sender: actor, receiver: assignee });
  } catch (error) { console.error("Interview notification failed", error); }
  return updated;
};
export default { scheduleInterview, getInterviewsForUser, updateInterviewStatus, saveScorecard, hireCandidate, rescheduleInterview };
