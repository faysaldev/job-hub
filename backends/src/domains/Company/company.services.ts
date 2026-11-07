import Company, { ICompany } from "./company.model";
import { Types } from "mongoose";
import { assertId, escapeRegex, paging } from "../../lib/query";

export const createCompanyService = async (
  companyData: Partial<ICompany>,
): Promise<ICompany> => {
  if (await Company.exists({ userId: companyData.userId })) throw new Error("Company already exists");
  const company = new Company(companyData);
  return await company.save();
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

export const getAllCompaniesService = async (query: any = {}): Promise<any> => {
  const {
    search,
    industries,
    companySize,
    location,
    page = 1,
    limit = 10,
  } = query;
  const filters: any = {};

  if (search) {
    filters.$or = [
      { companyName: { $regex: escapeRegex(search), $options: "i" } },
      { companyLocation: { $regex: escapeRegex(search), $options: "i" } },
      { description: { $regex: escapeRegex(search), $options: "i" } },
    ];
  }

  if (industries) {
    filters.industries = { $regex: escapeRegex(industries), $options: "i" };
  }

  if (companySize) {
    filters.companySize = companySize;
  }

  if (location) {
    filters.companyLocation = { $regex: escapeRegex(location), $options: "i" };
  }

  const bounds = paging({ page, limit });
  const skip = (bounds.page - 1) * bounds.limit;

  const [companies, total] = await Promise.all([
    Company.find(filters)
      .populate({ path: "userId", select: "name image role",
        match: { isDeleted: { $ne: true }, isEmailVerified: true, role: "recruiter" } })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(bounds.limit)
      .lean(),
    Company.countDocuments(filters),
  ]);

  return {
    companies: companies.filter((company) => !!company.userId),
    pagination: {
      total,
      page: bounds.page,
      limit: bounds.limit,
      totalPages: Math.ceil(total / bounds.limit),
    },
  };
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
  return await Company.findOneAndUpdate(
    { userId: new Types.ObjectId(userId) },
    { $set: companyData },
    { new: true, runValidators: true },
  ).populate("userId", "name email image role phoneNumber");
};
