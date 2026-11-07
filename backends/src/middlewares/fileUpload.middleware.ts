/** Backward compatibility for old multipart profile updates; all new files go to R2. */
import multer from "multer";
import { AppError } from "../lib/errors";
export const legacyImageUpload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5_000_000, files: 1 },
  fileFilter: (_req, file, cb) => {
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.mimetype)) {
      cb(new AppError("Only JPEG, PNG or WebP images are supported", 400));
    } else cb(null, true);
  },
});
