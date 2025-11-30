import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

const USER_PICTURES = "./public/uploads/users";

router.get("/", authMiddleware);

export default router;
