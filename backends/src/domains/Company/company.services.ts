import Company, { ICompany } from "./company.model";
import { Types } from "mongoose";
import { assertId, escapeRegex, paging } from "../../lib/query";
import { assertOwnedPublicImage } from "../Asset/asset.services";
import jobService from "../Jobs/job.services";

export const createCompanyService = async (
  companyData: Partial<ICompany>,
): Promise<ICompany> => {
  if (await Company.exists({ userId: companyData.userId })) throw new Error("Company already exists");
  if (companyData.companyLogo) await assertOwnedPublicImage(companyData.companyLogo, String(companyData.userId), "company-logo");
  const company = new Company(companyData);
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
  return company?.userId ? company : null;
};

export const getCompanyByUserIdService = async (
  userId: string,
): Promise<ICompany | null> => {
  return await Company.findOne({ userId: new Types.ObjectId(userId) }).populate(
    "userId",
    "name email image role phoneNumber",
  );
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
      rows: [{ $skip: skip }, { $limit: bounds.limit }, { $set: { userId: "$activeUser" } }, { $unset: "activeUser" }],
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
  if (companyData.companyLogo) await assertOwnedPublicImage(companyData.companyLogo, userId, "company-logo");
  const result = await Company.findOneAndUpdate(
    { userId: new Types.ObjectId(userId) },
    { $set: companyData },
    { new: true, runValidators: true },
  ).populate("userId", "name email image role phoneNumber");
  if (result) await jobService.clearJobCache();
  return result;
};
