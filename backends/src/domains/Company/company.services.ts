import Company, { ICompany } from "./company.model";
import { Types } from "mongoose";
import { assertId, escapeRegex, paging } from "../../lib/query";
import { assertOwnedPublicImage } from "../Asset/asset.services";
import jobService from "../Jobs/job.services";
import { companyForActor } from "./company.access";
import { AppError } from "../../lib/errors";
import CompanyMember from "./company.member.model";

export const createCompanyService = async (
  companyData: Partial<ICompany>,
): Promise<ICompany> => {
  if (await Company.exists({ userId: companyData.userId })) throw new AppError("Company already exists", 409);
  if (await CompanyMember.exists({ userId: companyData.userId, status: "active" })) throw new AppError("Leave your existing team before creating a company", 409);
  if (companyData.companyLogo) await assertOwnedPublicImage(companyData.companyLogo, String(companyData.userId), "company-logo");
  const name = String(companyData.companyName || "company");
  const slug = name.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 48) || "company";
  const proposed = companyData.careersSlug || `${slug}-${String(companyData.userId).slice(-6).toLowerCase()}`;
  if (await Company.exists({ careersSlug: proposed })) throw new AppError("Career-page address already taken", 409);
  const company = new Company({ ...companyData, careersSlug: proposed });
  const created = await company.save();
  await jobService.clearJobCache();
  return created;
};

export const getCompanyService = async (
  id: string,
): Promise<ICompany | null> => {
  assertId(id);
  const company = await Company.findById(id)
    .populate({ path: "userId", select: "name image",
      match: { isDeleted: { $ne: true }, isEmailVerified: true, role: "recruiter" } })
    .populate({
      path: "jobs",
      match: { isActive: true, isDeleted: { $ne: true }, applicationDeadline: { $gte: new Date() } },
      select:
        "title type location locationType salaryMax salaryMin salaryPeriod",
    });
  if (!company?.userId) return null;
  // Public company pages expose verification status, not internal reviewer notes.
  const result = company.toObject();
  if (result.verification) result.verification = { status: result.verification.status };
  return result as ICompany;
};

export const getCompanyByUserIdService = async (
  userId: string,
): Promise<ICompany | null> => {
  try {
    const { company } = await companyForActor(userId);
    return await Company.findById(company._id).populate("userId", "name email image role phoneNumber");
  } catch (error) {
    if (error instanceof AppError && error.statusCode === 403) return null;
    throw error;
  }
};

/** Single aggregate and facet: no inaccurate count after populate removes inactive accounts. */
export const getAllCompaniesService = async (query: any = {}): Promise<any> => {
  const { search, industries, companySize, location } = query;
  const filters: any = {};
  if (search) {
    const pattern = new RegExp(escapeRegex(search), "i");
    filters.$or = [{ companyName: pattern }, { companyLocation: pattern }, { description: pattern }];
  }
  if (industries) filters.industries = new RegExp(escapeRegex(industries), "i");
  if (companySize) filters.companySize = companySize;
  if (location) filters.companyLocation = new RegExp(escapeRegex(location), "i");
  const bounds = paging(query);
  const skip = (bounds.page - 1) * bounds.limit;
  const result = await Company.aggregate([
    { $match: filters },
    { $lookup: { from: "users", localField: "userId", foreignField: "_id", as: "activeUser", pipeline: [
      { $match: { isDeleted: { $ne: true }, isEmailVerified: true, role: "recruiter" } },
      { $project: { name: 1, image: 1, role: 1 } },
    ] } },
    { $unwind: "$activeUser" },
    { $sort: { createdAt: -1 } },
    { $facet: {
      rows: [{ $skip: skip }, { $limit: bounds.limit }, { $set: { userId: "$activeUser" } },
        { $project: { companyName: 1, companyLogo: 1, companySize: 1, industries: 1,
          companyLocation: 1, website: 1, description: 1, careersSlug: 1,
          careersEnabled: 1, createdAt: 1, userId: 1, "verification.status": 1 } }],
      meta: [{ $count: "total" }],
    } },
  ]);
  const total = result[0]?.meta?.[0]?.total || 0;
  return { companies: result[0]?.rows || [], pagination: {
    total, page: bounds.page, limit: bounds.limit, totalPages: Math.ceil(total / bounds.limit),
  } };
};

export const updateCompanyService = async (
  id: string,
  companyData: Partial<ICompany>,
): Promise<ICompany | null> => {
  return await Company.findByIdAndUpdate(
    id,
    { $set: companyData },
    { new: true, runValidators: true },
  ).populate("userId", "name email image role phoneNumber");
};

export const updateCompanyByUserIdService = async (
  userId: string,
  companyData: Partial<ICompany>,
): Promise<ICompany | null> => {
  const { company } = await companyForActor(userId, "company");
  if (companyData.companyLogo) await assertOwnedPublicImage(companyData.companyLogo, userId, "company-logo");
  if (companyData.careersSlug && companyData.careersSlug !== company.careersSlug &&
      await Company.exists({ careersSlug: companyData.careersSlug })) throw new AppError("Career-page address already taken", 409);
  const result = await Company.findOneAndUpdate(
    { _id: company._id },
    { $set: companyData },
    { new: true, runValidators: true },
  ).populate("userId", "name email image role phoneNumber");
  if (result) await jobService.clearJobCache();
  return result;
};
