import Company, { ICompany } from "./company.model";
import { Types } from "mongoose";

export const createCompanyService = async (
  companyData: Partial<ICompany>,
): Promise<ICompany> => {
  const company = new Company(companyData);
  return await company.save();
};

export const getCompanyService = async (
  id: string,
): Promise<ICompany | null> => {
  return await Company.findById(id).populate("userId", "name email image role");
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
      { companyName: { $regex: search, $options: "i" } },
      { companyLocation: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  if (industries) {
    filters.industries = { $regex: industries, $options: "i" };
  }

  if (companySize) {
    filters.companySize = companySize;
  }

  if (location) {
    filters.companyLocation = { $regex: location, $options: "i" };
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [companies, total] = await Promise.all([
    Company.find(filters)
      .populate("userId", "name email image role phoneNumber")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    Company.countDocuments(filters),
  ]);

  return {
    companies,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    },
  };
};

export const updateCompanyService = async (
  id: string,
  companyData: Partial<ICompany>,
): Promise<ICompany | null> => {
  return await Company.findByIdAndUpdate(
    id,
    { ...companyData },
    { new: true, runValidators: true },
  ).populate("userId", "name email image role phoneNumber");
};

export const updateCompanyByUserIdService = async (
  userId: string,
  companyData: Partial<ICompany>,
): Promise<ICompany | null> => {
  return await Company.findOneAndUpdate(
    { userId: new Types.ObjectId(userId) },
    { ...companyData },
    { new: true, runValidators: true },
  ).populate("userId", "name email image role phoneNumber");
};
