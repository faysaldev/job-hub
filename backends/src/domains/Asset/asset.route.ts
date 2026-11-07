import { Router } from "express";
import { z } from "zod";
import { authMiddleware } from "../../middlewares/auth.middleware";
import validate from "../../middlewares/validation.middleware";
import { rateLimit } from "../../middlewares/rateLimit.middleware";
import { legacyImageUpload } from "../../middlewares/fileUpload.middleware";
import controller from "./asset.controller";

const router = Router();
router.use(authMiddleware);
// Exactly three operations for all image, resume and messaging-attachment purposes.
router.post("/uploads", rateLimit(100, 60 * 60, "r2-sign"), validate(z.object({
  kind: z.enum(["avatar", "company-logo", "resume", "attachment"]),
  fileName: z.string().trim().min(1).max(255),
  mimeType: z.string().min(1).max(150),
  size: z.number().int().positive().max(10_000_000),
})), controller.initiate);
router.post("/uploads/:id/complete", rateLimit(150, 60 * 60, "r2-confirm"), controller.complete);
router.get("/:id/access", rateLimit(120, 60 * 60, "r2-access"), controller.access);
// One legacy route preserved; new clients PUT bytes directly to R2.
router.post("/upload", rateLimit(30, 60 * 60, "r2-legacy"),
  legacyImageUpload.single("file"), controller.legacyUpload);
export default router;
