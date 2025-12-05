import express from 'express';
import {
  createCompany,
  getCompany,
  getAllCompanies,
  updateCompany,
} from './company.controller';

const router = express.Router();

router.post('/', createCompany);
router.get('/:id', getCompany);
router.get('/', getAllCompanies);
router.put('/:id', updateCompany);

export default router;