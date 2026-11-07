import { Response } from "express";
import service from "./interviews.services";
import { asyncHandler } from "../../lib/errorsHandle";
import { response } from "../../lib/response";
import { ProtectedRequest } from "../../types/protected-request";
import { AppError } from "../../lib/errors";
import { addActivityLogService } from "../Seeker/seeker.services";

const ok = (res: Response, message: string, data: object, code = 200) => res.status(code).json(
  response({ message, status: "OK", statusCode: code, data }));
const scheduleInterview = asyncHandler(async (req: ProtectedRequest, res: Response) => {
  const interview = await service.scheduleInterview(req.body, req.user!._id);
  addActivityLogService(req.body.interviewee, "Interview scheduled for an application").catch(() => {});
  ok(res, "Interview scheduled", interview, 201);
});
const getMyInterviews = asyncHandler(async (req: ProtectedRequest, res: Response) => {
  const role = req.query.role;
  if (role !== undefined && role !== "interviewer" && role !== "interviewee") throw new AppError("Invalid interview role", 400);
  const myRole = req.user!.role;
  const roleToRead = myRole === "seeker" ? "interviewee" : "interviewer";
  if (role && role !== roleToRead) throw new AppError("Permission denied", 403);
  ok(res, "Interviews retrieved", await service.getInterviewsForUser(req.user!._id, roleToRead));
});
const updateStatus = asyncHandler(async (req: ProtectedRequest, res: Response) => {
  const interview = await service.updateInterviewStatus(req.params.interviewId, req.body.status, req.user!._id);
  ok(res, "Interview status updated", interview);
});
const hireCandidate = asyncHandler(async (req: ProtectedRequest, res: Response) => {
  const result = await service.hireCandidate(req.body.jobId, req.body.applicantId, req.user!._id);
  ok(res, "Candidate hired", result);
});
const rescheduleInterview = asyncHandler(async (req: ProtectedRequest, res: Response) => {
  const interview = await service.rescheduleInterview(req.params.interviewId, req.body, req.user!._id);
  ok(res, "Interview rescheduled", interview);
});
const saveScorecard = asyncHandler(async (req: ProtectedRequest, res: Response) => {
  const result = await service.saveScorecard(req.params.interviewId, req.user!._id, req.body);
  ok(res, "Scorecard saved", result!);
});
export default { scheduleInterview, getMyInterviews, updateStatus, hireCandidate, rescheduleInterview, saveScorecard };
