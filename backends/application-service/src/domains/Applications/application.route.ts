import { Router } from "express";
import userController from "./application.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import userFileUploadMiddleware from "../../middlewares/fileUpload.middleware";

const router = Router();

const USER_PICTURES = "../../../public/uploads/users";

router.get("/", authMiddleware, userController.userDetails);

export default router;
