import { Router } from "express";
import interviewController from "./interviews.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

router.post("/", authMiddleware, interviewController.scheduleInterview);
router.post("/hire", authMiddleware, interviewController.hireCandidate);
router.get("/my", authMiddleware, interviewController.getMyInterviews);
router.put("/:interviewId/status", authMiddleware, interviewController.updateStatus);
router.patch("/:interviewId/reschedule", authMiddleware, interviewController.rescheduleInterview);

export default router;
