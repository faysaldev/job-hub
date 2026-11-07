import { Router } from "express";
import userController from "./user.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { legacyImageUpload } from "../../middlewares/fileUpload.middleware";
import { uploadLegacyImage } from "../Asset/asset.services";
import { asyncHandler } from "../../lib/errorsHandle";
import { ProtectedRequest } from "../../types/protected-request";
import validate from "../../middlewares/validation.middleware";
import userValidator from "./user.validation";

const router = Router();

router.get("/self/in", authMiddleware, userController.userDetails);
router.patch(
  "/update",
  authMiddleware,
  legacyImageUpload.single("image"),
  asyncHandler(async (req: ProtectedRequest, _res, next) => {
    if (req.file) req.body.image = (await uploadLegacyImage(req.user!._id, "avatar", req.file)).url;
    next();
  }),
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
