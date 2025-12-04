import { Router } from "express";
import userController from "./conversations.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
const router = Router();
router.get("/self/in", authMiddleware, userController.userDetails);

export default router;
