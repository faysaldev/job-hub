import { Router } from "express";
import applicationController from "./application.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import userFileUploadMiddleware from "../../middlewares/fileUpload.middleware";

const router = Router();
const USER_RESUME = "../../../public/uploads/";

// Protected routes for applications (authentication required)
router.post(
  "/",
  authMiddleware,
  // userFileUploadMiddleware(USER_RESUME).single("resume"),
  applicationController.createApplication
); // Create a new application
router.get("/", authMiddleware, applicationController.getUserApplications); // Get user's applications
router.put(
  "/:applicationId/status",
  authMiddleware,
  applicationController.updateApplicationStatus
); // Update application status
router.delete(
  "/:applicationId",
  authMiddleware,
  applicationController.deleteApplication
); // Delete an application

export default router;
