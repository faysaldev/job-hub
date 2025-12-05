import { Request, Response } from 'express';
import {
  createCompanyService,
  getCompanyService,
  getAllCompaniesService,
  updateCompanyService,
  getCompanyByUserIdService,
  updateCompanyByUserIdService
} from './company.services';
import { Types } from 'mongoose';
import { ProtectedRequest } from '../../types/protected-request';

export const createCompany = async (req: Request, res: Response) => {
  try {
    const companyData = req.body;
    // Add the authenticated user's ID to the company data
    if ((req as ProtectedRequest).user) {
      companyData.userId = (req as ProtectedRequest).user!._id;
    }
    const company = await createCompanyService(companyData);
    res.status(201).json({ success: true, data: company });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

export const getCompany = async (req: Request, res: Response) => {
  try {
    const protectedReq = req as ProtectedRequest;
    if (!protectedReq.user?._id) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const company = await getCompanyByUserIdService(protectedReq.user._id);
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company profile not found' });
    }

    res.status(200).json({ success: true, data: company });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

export const getAllCompanies = async (req: Request, res: Response) => {
  try {
    const companies = await getAllCompaniesService();
    res.status(200).json({ success: true, data: companies });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

export const updateCompany = async (req: Request, res: Response) => {
  try {
    const protectedReq = req as ProtectedRequest;
    if (!protectedReq.user?._id) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const companyData = req.body;
    const updatedCompany = await updateCompanyByUserIdService(protectedReq.user._id, companyData);

    if (!updatedCompany) {
      return res.status(404).json({ success: false, message: 'Company profile not found' });
    }

    res.status(200).json({ success: true, data: updatedCompany });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};