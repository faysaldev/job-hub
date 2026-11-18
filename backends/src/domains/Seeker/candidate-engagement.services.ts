import Seeker from "./seeker.model";
import CompanyCandidate from "./company-candidate.model";
import Application from "../Applications/application.model";
import Job from "../Jobs/job.model";
import User from "../User/user.model";
import { companyForActor } from "../Company/company.access";
import { AppError } from "../../lib/errors";
import { assertId } from "../../lib/query";

/** A recruiter can only bookmark a visible, searchable candidate. Do not reveal private resumes. */
const candidateContext = async (candidateId: string, actorId: string) => {
  const [{ company }, seeker] = await Promise.all([
    companyForActor(actorId, "applications"),
    Seeker.findOne({ _id: assertId(candidateId, "candidate ID"),
      "privacy.profileVisibility": "public", "privacy.searchable": true }).select("userId privacy").lean(),
  ]);
  if (!seeker || !(await User.exists({ _id: seeker.userId, role: "seeker", isDeleted: { $ne: true },
    isEmailVerified: true, suspendedAt: { $exists: false } }))) throw new AppError("Candidate not available", 404);
  return { company, seeker };
};

export const getCandidateEngagement = async (candidateId: string, actorId: string) => {
  const { company, seeker } = await candidateContext(candidateId, actorId);
  const [bookmark, jobs] = await Promise.all([
    CompanyCandidate.findOne({ companyId: company._id, seekerId: seeker._id }).select("status").lean(),
    Job.distinct("_id", { $or: [{ companyId: company._id }, { author: company.userId }] }),
  ]);
  const application = jobs.length ? await Application.findOne({ applicant: seeker.userId,
    job_id: { $in: jobs }, isWithdrawn: { $ne: true } }).sort({ createdAt: -1 })
    .select("_id status job_id").lean() : null;
  // A public profile alone never grants access to private messages. An existing application AND
  // explicit contact preference are required for recruiter-initiated contact from this page.
  const canMessage = Boolean(seeker.privacy?.allowContact && application);
  return { status: bookmark?.status || "none", application: application ? {
    id: String(application._id), status: application.status, jobId: String(application.job_id),
  } : null, canMessage, ...(canMessage ? { userId: String(seeker.userId) } : {}) };
};

export const updateCandidateEngagement = async (candidateId: string, actorId: string,
  action: "save" | "shortlist" | "remove") => {
  const { company, seeker } = await candidateContext(candidateId, actorId);
  const key = { companyId: company._id, seekerId: seeker._id };
  if (action === "remove") {
    await CompanyCandidate.deleteOne(key);
    return { status: "none" };
  }
  const status = action === "shortlist" ? "shortlisted" : "saved";
  // Upsert is idempotent thanks to the unique company+candidate index.
  try {
    await CompanyCandidate.findOneAndUpdate(key, { $set: { status, updatedBy: actorId },
      $setOnInsert: { ...key, createdBy: actorId } }, { upsert: true, new: true, runValidators: true });
  } catch (error: any) {
    if (error?.code !== 11000) throw error;
    await CompanyCandidate.updateOne(key, { $set: { status, updatedBy: actorId } });
  }
  return { status };
};
