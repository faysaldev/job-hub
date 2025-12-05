import { Request, Response } from 'express';
import { 
  createCompanyService, 
  getCompanyService, 
  getAllCompaniesService, 
  updateCompanyService 
} from './company.services';
import { Types } from 'mongoose';

export const createCompany = async (req: Request, res: Response) => {
  try {
    const companyData = req.body;
    const company = await createCompanyService(companyData);
    res.status(201).json({ success: true, data: company });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

export const getCompany = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid company ID' });
    }
    
    const company = await getCompanyService(id);
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
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
    const { id } = req.params;
    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid company ID' });
    }
    
    const companyData = req.body;
    const updatedCompany = await updateCompanyService(id, companyData);
    
    if (!updatedCompany) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }
    
    res.status(200).json({ success: true, data: updatedCompany });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};