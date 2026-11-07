import { Router } from "express";
import assetController from "./asset.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { rateLimit } from "../../middlewares/rateLimit.middleware";
import {
  cloudinaryFileUploadMiddleware,
  processCloudinarySingleUpload,
} from "../../middlewares/fileUpload.middleware";

const router = Router();

router.post(
  "/upload",
  authMiddleware,
  rateLimit(60, 60 * 60, "uploads"),
  cloudinaryFileUploadMiddleware().single("file"),
  processCloudinarySingleUpload("assets", "file"),
  assetController.uploadAsset,
);

export default router;
