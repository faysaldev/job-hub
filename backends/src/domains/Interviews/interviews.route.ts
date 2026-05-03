import { Router } from "express";
import interviewController from "./interviews.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

router.post("/", authMiddleware, interviewController.scheduleInterview);
router.get("/my", authMiddleware, interviewController.getMyInterviews);
router.put("/:interviewId/status", authMiddleware, interviewController.updateStatus);

export default router;
