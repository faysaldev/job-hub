import express from "express";
import {
  createCompany,
  getCompany,
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
  cloudinaryFileUploadMiddleware().single("companyLogo"),
  processCloudinarySingleUpload("company", "companyLogo"),
  validate(companyValidator.createCompanyValidation),
  createCompany,
);
router.get("/", authMiddleware, getCompany); // Get authenticated user's company profile
router.get("/all", authMiddleware, getAllCompanies); // Get all companies
router.put(
  "/",
  authMiddleware,
  cloudinaryFileUploadMiddleware().single("companyLogo"),
  processCloudinarySingleUpload("company", "companyLogo"),
  validate(companyValidator.updateCompanyValidation),
  updateCompany,
); // Update authenticated user's company profile

export default router;
