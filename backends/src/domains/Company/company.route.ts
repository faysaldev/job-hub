import express from "express";
import {
  createCompany,
  getCompany,
  getCompanyById,
  getAllCompanies,
  updateCompany,
} from "./company.controller";
import { authMiddleware, requireRoles } from "../../middlewares/auth.middleware";
import validate from "../../middlewares/validation.middleware";
import companyValidator from "./company.validation";
import workspace from "./company.workspace";
import { z } from "zod";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  requireRoles("recruiter"),
  validate(companyValidator.createCompanyValidation),
  createCompany,
);
// One compact team resource for invitation, membership and access management.
router.get("/team", authMiddleware, requireRoles("recruiter"), workspace.members);
router.post("/team", authMiddleware, requireRoles("recruiter"), validate(z.object({
  email: z.email().max(254), role: z.enum(["admin", "recruiter", "interviewer"])
})), workspace.invite);
router.patch("/team/:id", authMiddleware, requireRoles("recruiter"), validate(z.discriminatedUnion("action", [
  z.object({ action: z.literal("accept") }),
  z.object({ action: z.literal("remove") }),
  z.object({ action: z.literal("role"), role: z.enum(["admin", "recruiter", "interviewer"]) }),
])), workspace.manageMember);
router.post("/verification-request", authMiddleware, requireRoles("recruiter"), workspace.requestVerification);
router.patch("/:id/verification", authMiddleware, requireRoles("admin"), validate(z.object({
  status: z.enum(["verified", "rejected"]), reason: z.string().max(1000).optional(),
})), workspace.reviewVerification);
router.get("/careers/:slug", workspace.careersPage);
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
