import Company, { ICompany } from "./company.model";
import CompanyMember, { TeamRole } from "./company.member.model";
import Job, { IJob } from "../Jobs/job.model";
import { AppError } from "../../lib/errors";
import { assertId } from "../../lib/query";

export type TeamPermission = "view" | "jobs" | "applications" | "interviews" | "company" | "team";
const allowed: Record<TeamPermission, TeamRole[]> = {
  view: ["owner", "admin", "recruiter", "interviewer"],
  jobs: ["owner", "admin", "recruiter"],
  applications: ["owner", "admin", "recruiter"],
  interviews: ["owner", "admin", "recruiter", "interviewer"],
  company: ["owner", "admin"], team: ["owner", "admin"],
};
export const companyForActor = async (userId: string, permission: TeamPermission = "view") => {
  assertId(userId, "account ID");
  const own = await Company.findOne({ userId });
  if (own) return { company: own, teamRole: "owner" as TeamRole };
  const member = await CompanyMember.findOne({ userId, status: "active" }).sort({ joinedAt: -1 });
  if (!member) throw new AppError("Create or join a company workspace first", 403);
  const company = await Company.findById(member.companyId);
  if (!company) throw new AppError("Company workspace unavailable", 404);
  if (!allowed[permission].includes(member.role)) throw new AppError("Not permitted in this company workspace", 403);
  return { company, teamRole: member.role as TeamRole };
};
export const jobForActor = async (jobId: string, userId: string, permission: TeamPermission = "view") => {
  const job = await Job.findOne({ _id: assertId(jobId, "job ID"), isDeleted: { $ne: true } });
  if (!job) throw new AppError("Job not found", 404);
  const { company, teamRole } = await companyForActor(userId, permission);
  // Legacy jobs have no companyId; their author is the company owner.
  const matches = job.companyId ? job.companyId.toString() === company._id.toString() :
    job.author.toString() === company.userId.toString();
  if (!matches) throw new AppError("Job not found", 404);
  return { job: job as IJob, company: company as ICompany, teamRole };
};
export const requireCompany = async (userId: string, permission: TeamPermission) =>
  companyForActor(userId, permission);
