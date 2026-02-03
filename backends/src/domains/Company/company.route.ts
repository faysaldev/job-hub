import express from "express";
import {
  createCompany,
  getCompany,
  getAllCompanies,
  updateCompany,
} from "./company.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = express.Router();

router.post("/", authMiddleware, createCompany);
router.get("/", authMiddleware, getCompany);  // Get authenticated user's company profile
router.get("/all", authMiddleware, getAllCompanies);  // Get all companies
router.put("/", authMiddleware, updateCompany);  // Update authenticated user's company profile

export default router;
