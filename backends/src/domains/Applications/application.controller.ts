import { Response } from "express";
import service from "./application.services";
import { asyncHandler } from "../../lib/errorsHandle";
import { response } from "../../lib/response";
import { ProtectedRequest } from "../../types/protected-request";
import { createNotification } from "../Notifications/notifications.service";
import { addActivityLogService } from "../Seeker/seeker.services";
import { createBoostSession } from "../Stripe/stripe.controller";

const success = (res: Response, message: string, data: any, code = 200) => res.status(code).json(
  response({ message, status: "OK", statusCode: code, data }));
const createApplication = asyncHandler(async (req: ProtectedRequest, res: Response) => {
  const { application, job } = await service.createApplication({ ...req.body, applicant: req.user!._id });
  // Side effects must not turn an already-saved application into a client-visible failure.
  await Promise.allSettled([
    createNotification({ title: `New application for "${job.title}"`, link: "/recruiter/applicants",
      sender: req.user!._id, receiver: job.author.toString() }),
    addActivityLogService(req.user!._id, `Applied for ${job.title}`),
  ]);
  let checkoutData = null;
  let paymentUnavailable = false;
  if (req.body.boost) {
    try { checkoutData = await createBoostSession(application._id.toString(), req.user!._id); }
    catch { paymentUnavailable = true; }
  }
  success(res, "Application submitted", { application, checkoutData, paymentUnavailable }, 201);
});
const getUserApplications = asyncHandler(async (req: ProtectedRequest, res: Response) =>
  success(res, "Applications retrieved", await service.getApplicationsByApplicant(req.user!._id)));
const getRecruiterApplications = asyncHandler(async (req: ProtectedRequest, res: Response) =>
  success(res, "Recruiter applications retrieved", await service.getRecruiterApplications(req.user!._id, req.query, req.user!.role === "admin")));
const updateApplicationStatus = asyncHandler(async (req: ProtectedRequest, res: Response) => {
  const updated = await service.updateApplicationStatus(req.params.applicationId, req.user!._id,
    req.body.status, req.body.rejection_note, req.user!.role === "admin");
  success(res, "Application status updated", updated);
});
const deleteApplication = asyncHandler(async (req: ProtectedRequest, res: Response) => {
  const deleted = await service.deleteApplication(req.params.applicationId, req.user!._id);
  success(res, "Application withdrawn", deleted);
});
const updateATS = asyncHandler(async (req: ProtectedRequest, res: Response) => {
  const updated = await service.atsAction(req.params.applicationId, req.user!._id, req.user!.role, req.body);
  success(res, "Application updated", updated);
});
export default { createApplication, getUserApplications, getRecruiterApplications, updateApplicationStatus, updateATS, deleteApplication };
