import { Response } from "express";
import { ProtectedRequest } from "../../types/protected-request";
import { asyncHandler } from "../../lib/errorsHandle";
import { response } from "../../lib/response";
import { AppError } from "../../lib/errors";
import { assertId } from "../../lib/query";
import { sendEmail } from "../../lib/mail.service";
import Company from "./company.model";
import CompanyMember from "./company.member.model";
import { companyForActor } from "./company.access";
import User from "../User/user.model";
import Job from "../Jobs/job.model";
import jobService from "../Jobs/job.services";

const ok = (res: Response, data: unknown, message = "OK") => res.status(200).json(response({ message, status: "OK", statusCode: 200, data: data as object }));
const email = (v: string) => v.toLowerCase().trim();
const members = asyncHandler(async (req: ProtectedRequest, res: Response) => {
  const actor = req.user!;
  const invited = await CompanyMember.find({ email: email(actor.email), status: "invited" })
    .populate("companyId", "companyName careersSlug").sort({ invitedAt: -1 }).limit(20).lean();
  let workspace = null;
  try {
    const { company, teamRole } = await companyForActor(actor._id);
    const team = await CompanyMember.find({ companyId: company._id, status: { $ne: "removed" } })
      .select("email role status userId invitedAt joinedAt").sort({ invitedAt: -1 }).limit(100).lean();
    workspace = { company, teamRole, members: team };
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
  if (await CompanyMember.exists({ companyId: company._id, email: address, status: "active" }))
    throw new AppError("This teammate is already active", 409);
  const record = await CompanyMember.findOneAndUpdate({ companyId: company._id, email: address },
    { $set: { role: req.body.role, status: "invited", invitedBy: req.user!._id, invitedAt: new Date() },
      $unset: { userId: "", joinedAt: "" } }, { upsert: true, new: true, runValidators: true });
  const portal = `${(process.env.FRONTEND_URL || "http://localhost:3000").split(",")[0].replace(/\/$/, "")}/recruiter/team`;
  try { await sendEmail(address, `Invitation to join ${company.companyName || "JobHub"}`, `Sign in as a recruiter to accept your invitation: ${portal}`); }
  catch (error) { console.error("Team invitation email unavailable", error); }
  ok(res, { _id: record._id, email: address, role: record.role, status: record.status }, "Invitation saved");
});
const manageMember = asyncHandler(async (req: ProtectedRequest, res: Response) => {
  const member = await CompanyMember.findById(assertId(req.params.id, "member ID"));
  if (!member || member.status === "removed") throw new AppError("Invitation not found", 404);
  const actor = req.user!;
  if (req.body.action === "accept") {
    if (member.status !== "invited" || member.email !== email(actor.email) || actor.role !== "recruiter") throw new AppError("Invitation not available", 403);
    if (await Company.exists({ userId: actor._id }) || await CompanyMember.exists({ userId: actor._id, status: "active" }))
      throw new AppError("You already belong to a company", 409);
    const accepted = await CompanyMember.findOneAndUpdate({ _id: member._id, status: "invited", email: email(actor.email) },
      { $set: { status: "active", userId: actor._id, joinedAt: new Date() } }, { new: true });
    if (!accepted) throw new AppError("Invitation is no longer available", 409);
    return ok(res, { membership: accepted }, "Invitation accepted");
  }
  const { company, teamRole } = await companyForActor(actor._id, "team");
  if (company._id.toString() !== member.companyId.toString()) throw new AppError("Team member not found", 404);
  if (teamRole !== "owner" && (member.role === "admin" || req.body.role === "admin")) throw new AppError("Only the owner can change admin access", 403);
  const modified = await CompanyMember.findByIdAndUpdate(member._id,
    req.body.action === "remove" ? { $set: { status: "removed" }, $unset: { userId: "", joinedAt: "" } } :
      { $set: { role: req.body.role } }, { new: true, runValidators: true });
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
  const company = await Company.findByIdAndUpdate(assertId(req.params.id, "company ID"),
    { $set: { "verification.status": req.body.status, "verification.reviewedAt": new Date(),
      "verification.reviewedBy": req.user!._id, "verification.reason": req.body.reason || "" } }, { new: true });
  if (!company) throw new AppError("Company not found", 404);
  ok(res, { verification: company.verification }, "Verification reviewed");
});
const careersPage = asyncHandler(async (req: ProtectedRequest, res: Response) => {
  const company = await Company.findOne({ careersSlug: req.params.slug.toLowerCase(), careersEnabled: { $ne: false } })
    .select("companyName companyLogo careersSlug careersHeadline careersDescription companyLocation website verification.status userId").lean();
  if (!company) throw new AppError("Careers page not found", 404);
  const jobs = await Job.find({ $or: [{ companyId: company._id }, { author: company.userId }],
    status: { $in: ["published", null] }, isActive: true, isDeleted: { $ne: true }, applicationDeadline: { $gte: new Date() } })
    .select("title type location locationType salaryMin salaryMax salaryPeriod applicationDeadline experienceLevel createdAt")
    .sort({ createdAt: -1 }).limit(50).lean();
  ok(res, { company, jobs });
});
export default { members, invite, manageMember, requestVerification, reviewVerification, careersPage };
