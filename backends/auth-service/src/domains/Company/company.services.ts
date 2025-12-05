import Company, { ICompany } from './company.model';
import { Types } from 'mongoose';

export const createCompanyService = async (companyData: Partial<ICompany>): Promise<ICompany> => {
  const company = new Company(companyData);
  return await company.save();
};

export const getCompanyService = async (id: string): Promise<ICompany | null> => {
  return await Company.findById(id).populate('userId', '-password');
};

export const getCompanyByUserIdService = async (userId: string): Promise<ICompany | null> => {
  return await Company.findOne({ userId: new Types.ObjectId(userId) }).populate('userId', '-password');
};

export const getAllCompaniesService = async (): Promise<ICompany[]> => {
  return await Company.find().populate('userId', '-password');
};

export const updateCompanyService = async (id: string, companyData: Partial<ICompany>): Promise<ICompany | null> => {
  return await Company.findByIdAndUpdate(
    id,
    { ...companyData },
    { new: true, runValidators: true }
  ).populate('userId', '-password');
};

export const updateCompanyByUserIdService = async (userId: string, companyData: Partial<ICompany>): Promise<ICompany | null> => {
  return await Company.findOneAndUpdate(
    { userId: new Types.ObjectId(userId) },
    { ...companyData },
    { new: true, runValidators: true }
  ).populate('userId', '-password');
};