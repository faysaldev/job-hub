import express from "express";
import {
  createCompany,
  getCompany,
  getCompanyById,
  getAllCompanies,
  updateCompany,
} from "./company.controller";
import { authMiddleware, requireRoles } from "../../middlewares/auth.middleware";
import {
  cloudinaryFileUploadMiddleware,
  processCloudinarySingleUpload,
} from "../../middlewares/fileUpload.middleware";
import validate from "../../middlewares/validation.middleware";
import companyValidator from "./company.validation";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  requireRoles("recruiter"),
  validate(companyValidator.createCompanyValidation),
  createCompany,
);
router.get("/profile", authMiddleware, requireRoles("recruiter"), getCompany); // Get authenticated user's company profile
router.get("/all", getAllCompanies); // Get all companies
router.get("/:id", getCompanyById); // Get company by ID
router.put(
  "/",
  authMiddleware,
  requireRoles("recruiter"),
  validate(companyValidator.updateCompanyValidation),
  updateCompany,
); // Update authenticated user's company profile

export default router;
