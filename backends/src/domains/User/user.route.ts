import { Router } from "express";
import userController from "./user.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { cloudinaryUpload } from "../../middlewares/fileUpload.middleware";
import validate from "../../middlewares/validation.middleware";
import userValidator from "./user.validation";

const router = Router();

router.get("/self/in", authMiddleware, userController.userDetails);
router.patch(
  "/update",
  authMiddleware,
  cloudinaryUpload("image", "users"),
  userController.updateUser,
);
router.patch(
  "/change-password",
  authMiddleware,
  validate(userValidator.changePasswordValidation),
  userController.changePassword,
);
router.delete(
  "/delete-profile",
  authMiddleware,
  validate(userValidator.deleteProfileValidation),
  userController.deleteProfile,
);

export default router;
