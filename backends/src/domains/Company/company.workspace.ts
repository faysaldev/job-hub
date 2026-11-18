import { Response } from "express";
import { ProtectedRequest } from "../../types/protected-request";
import { asyncHandler } from "../../lib/errorsHandle";
import { response } from "../../lib/response";
import { AppError } from "../../lib/errors";
import { assertId } from "../../lib/query";
import { enqueueTeamInvitation, deliverQueuedEmails, cancelPendingTeamInvitation } from "../../lib/mail.outbox";
import Company from "./company.model";
import CompanyMember from "./company.member.model";
import { companyForActor } from "./company.access";
import User from "../User/user.model";
import Job from "../Jobs/job.model";
import { publicJobFilter } from "../Jobs/job.lifecycle";
import jobService from "../Jobs/job.services";
import { requireTeamSeat, withCompanyQuotaLock, currentEntitlement } from "../Billing/billing.entitlements";

const ok = (res: Response, data: unknown, message = "OK") => res.status(200).json(response({ message, status: "OK", statusCode: 200, data: data as object }));
const email = (v: string) => v.toLowerCase().trim();
const members = asyncHandler(async (req: ProtectedRequest, res: Response) => {
  const actor = req.user!;
  const invited = await CompanyMember.find({ email: email(actor.email), status: "invited",
    $or: [{ expiresAt: { $gt: new Date() } }, { expiresAt: { $exists: false }, invitedAt: { $gt: new Date(Date.now() - 7 * 86400_000) } }] })
    .populate("companyId", "companyName careersSlug").sort({ invitedAt: -1 }).limit(20).lean();
  let workspace = null;
  try {
    const { company, teamRole } = await companyForActor(actor._id);
    const team = await CompanyMember.find({ companyId: company._id, status: { $ne: "removed" } })
      .select("email role status userId invitedAt joinedAt expiresAt").sort({ invitedAt: -1 }).limit(100).lean();
    const { entitlement } = await currentEntitlement(String(company._id));
    const reserved = await CompanyMember.countDocuments({ companyId: company._id,
      $or: [{ status: "active" }, { status: "invited", expiresAt: { $gt: new Date() } }] });
    workspace = { company, teamRole, members: team,
      capacity: { teamSeats: reserved + 1, limit: entitlement.limits.teamSeats } };
  } catch (error) {
    if (!(error instanceof AppError) || error.statusCode !== 403) throw error;
  }
  ok(res, { workspace, invitations: invited });
});
const invite = asyncHandler(async (req: ProtectedRequest, res: Response) => {
  const { company, teamRole } = await companyForActor(req.user!._id, "team");
  const address: string = email(req.body.email);
  if (address === req.user!.email.toLowerCase() || address === (await User.findById(company.userId).select("email").lean())?.email) {
    throw new AppError("This account already owns or manages the workspace", 409);
  }
  if (teamRole !== "owner" && req.body.role === "admin") throw new AppError("Only the owner may appoint company admins", 403);
  const user = await User.findOne({ email: address, role: "recruiter", isDeleted: { $ne: true }, isEmailVerified: true });
  if (user && await Company.exists({ userId: user._id })) throw new AppError("A company owner cannot join another workspace", 409);
  if (user && await CompanyMember.exists({ userId: user._id, status: "active" })) throw new AppError("Account already belongs to a team", 409);
  const portal = `${(process.env.FRONTEND_URL || "http://localhost:3000").split(",")[0].replace(/\/$/, "")}/recruiter/team`;
  const record = await withCompanyQuotaLock(String(company._id), async session => {
    const current = await CompanyMember.findOne({ companyId: company._id, email: address }).session(session);
    if (current?.status === "active") throw new AppError("This teammate is already active", 409);
    const now = new Date();
    if (current?.status === "invited" && current.invitedAt > new Date(now.getTime() - 60_000))
      throw new AppError("An invitation was just sent. Wait a minute before resending.", 429);
    const reserved = current?.status === "invited" && current.expiresAt && current.expiresAt > now;
    if (!reserved) await requireTeamSeat(String(company._id), session);
    const invitation = await CompanyMember.findOneAndUpdate({ companyId: company._id, email: address },
      { $set: { role: req.body.role, status: "invited", invitedBy: req.user!._id,
        invitedAt: now, expiresAt: new Date(now.getTime() + 7 * 86400_000) },
        $unset: { userId: "", joinedAt: "" } },
      { upsert: true, new: true, runValidators: true, session });
    if (!invitation) throw new AppError("Invitation could not be saved", 409);
    await enqueueTeamInvitation({ senderId: req.user!._id as any, companyId: company._id, recipient: address,
      companyName: company.companyName || "JobHub", portalUrl: portal, session });
    return invitation;
  });
  // Database commit has completed, so the mail worker may deliver this record.
  void deliverQueuedEmails().catch(() => console.error("[JobHub mail] invitation delivery retry scheduled"));
  ok(res, { _id: record._id, email: address, role: record.role, status: record.status,
    expiresAt: record.expiresAt, delivery: "queued" }, "Invitation queued for delivery");
});
const manageMember = asyncHandler(async (req: ProtectedRequest, res: Response) => {
  const member = await CompanyMember.findById(assertId(req.params.id, "member ID"));
  if (!member || member.status === "removed") throw new AppError("Invitation not found", 404);
  const actor = req.user!;
  if (req.body.action === "accept") {
    const validUntil = member.expiresAt || new Date(member.invitedAt.getTime() + 7 * 86400_000);
    if (member.status !== "invited" || validUntil <= new Date() || member.email !== email(actor.email) || actor.role !== "recruiter")
      throw new AppError("This invitation is unavailable or expired. Ask the company to resend it.", 403);
    if (await Company.exists({ userId: actor._id }) || await CompanyMember.exists({ userId: actor._id, status: "active" }))
      throw new AppError("You already belong to a company", 409);
    const accepted = await CompanyMember.findOneAndUpdate({ _id: member._id, status: "invited", email: email(actor.email),
      $or: [{ expiresAt: { $gt: new Date() } }, { expiresAt: { $exists: false }, invitedAt: { $gt: new Date(Date.now() - 7 * 86400_000) } }] },
      { $set: { status: "active", userId: actor._id, joinedAt: new Date() } }, { new: true });
    if (!accepted) throw new AppError("Invitation is no longer available", 409);
    await cancelPendingTeamInvitation(member.companyId, member.email);
    return ok(res, { membership: accepted }, "Invitation accepted");
  }
  const { company, teamRole } = await companyForActor(actor._id, "team");
  if (company._id.toString() !== member.companyId.toString()) throw new AppError("Team member not found", 404);
  if (teamRole !== "owner" && (member.role === "admin" || req.body.role === "admin")) throw new AppError("Only the owner can change admin access", 403);
  const modified = await CompanyMember.findByIdAndUpdate(member._id,
    req.body.action === "remove" ? { $set: { status: "removed" }, $unset: { userId: "", joinedAt: "" } } :
      { $set: { role: req.body.role } }, { new: true, runValidators: true });
  if (req.body.action === "remove") await cancelPendingTeamInvitation(member.companyId, member.email);
  ok(res, { member: modified }, "Membership updated");
});
const requestVerification = asyncHandler(async (req: ProtectedRequest, res: Response) => {
  const { company } = await companyForActor(req.user!._id, "company");
  if (!company.companyName || !company.website || !company.description) throw new AppError("Complete company name, website and description first", 400);
  if (company.verification?.status === "verified") throw new AppError("Company is already verified", 409);
  const updated = await Company.findByIdAndUpdate(company._id,
    { $set: { "verification.status": "pending", "verification.requestedAt": new Date() },
      $unset: { "verification.reason": "", "verification.reviewedAt": "", "verification.reviewedBy": "" } }, { new: true });
  ok(res, { verification: updated?.verification }, "Verification requested");
});
const reviewVerification = asyncHandler(async (req: ProtectedRequest, res: Response) => {
  const { reviewCompanyVerification } = await import("../Operations/operations.services");
  const result = await reviewCompanyVerification(assertId(req.params.id, "company ID"),
    req.user!._id, req.body.status, req.body.reason || "", req.res?.locals?.requestId);
  ok(res, result, "Verification reviewed");
});
const careersPage = asyncHandler(async (req: ProtectedRequest, res: Response) => {
  const company = await Company.findOne({ careersSlug: req.params.slug.toLowerCase(), careersEnabled: { $ne: false } })
    .select("companyName companyLogo careersSlug careersHeadline careersDescription companyLocation website verification.status userId").lean();
  if (!company) throw new AppError("Careers page not found", 404);
  const jobs = await Job.find({ $or: [{ companyId: company._id }, { author: company.userId }],
    ...publicJobFilter() })
    .select("title type location locationType salaryMin salaryMax salaryPeriod applicationDeadline experienceLevel createdAt")
    .sort({ createdAt: -1 }).limit(50).lean();
  ok(res, { company, jobs });
});
export default { members, invite, manageMember, requestVerification, reviewVerification, careersPage };
