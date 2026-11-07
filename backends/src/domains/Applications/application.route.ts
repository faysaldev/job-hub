import { Router } from "express";
import controller from "./application.controller";
import { authMiddleware, requireRoles } from "../../middlewares/auth.middleware";
import validate from "../../middlewares/validation.middleware";
import { createApplicationValidation, applicationStatusValidation, atsActionValidation } from "./application.validation";

const router = Router();
router.post("/", authMiddleware, requireRoles("seeker"), validate(createApplicationValidation), controller.createApplication);
router.get("/", authMiddleware, requireRoles("seeker"), controller.getUserApplications);
router.get("/recruiter", authMiddleware, requireRoles("recruiter", "admin"), controller.getRecruiterApplications);
router.patch("/:applicationId", authMiddleware, validate(atsActionValidation), controller.updateATS);
router.put("/:applicationId/status", authMiddleware, requireRoles("recruiter", "admin"), validate(applicationStatusValidation), controller.updateApplicationStatus);
router.delete("/:applicationId", authMiddleware, requireRoles("seeker"), controller.deleteApplication);
export default router;
