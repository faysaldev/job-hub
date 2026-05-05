import express from "express";
import {
  createCompany,
  getCompany,
  getCompanyById,
  getAllCompanies,
  updateCompany,
} from "./company.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
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
  validate(companyValidator.createCompanyValidation),
  createCompany,
);
router.get("/profile", authMiddleware, getCompany); // Get authenticated user's company profile
router.get("/all", authMiddleware, getAllCompanies); // Get all companies
router.get("/:id", authMiddleware, getCompanyById); // Get company by ID
router.put(
  "/",
  authMiddleware,
  validate(companyValidator.updateCompanyValidation),
  updateCompany,
); // Update authenticated user's company profile

export default router;
