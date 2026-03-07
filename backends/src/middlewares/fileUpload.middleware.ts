import multer from "multer";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
} from "../config/ENV";

// Configure Cloudinary
cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

// Middleware for local file upload
const userFileUploadMiddleware = (uploadFolder: string) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadFolder); // Set the destination folder
    },
    filename: (req, file, cb) => {
      const extname = path.extname(file.originalname);
      const filename = Date.now() + "-" + file.fieldname + extname; // Unique file name
      cb(null, filename); // Set the file name
    },
  });

  return multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // Max file size: 10MB
    fileFilter: (req, file, cb) => {
      const fileTypes = /jpeg|jpg|png/;
      const extname = fileTypes.test(
        path.extname(file.originalname).toLowerCase(),
      );
      const mimetype = fileTypes.test(file.mimetype);

      if (extname && mimetype) {
        return cb(null, true); // If file is valid, allow it
      } else {
        const error: any = new Error("Only image or heic files are allowed!");
        error.code = "INVALID_FILE_TYPE";
        return cb(error, false);
      }
    },
  });
};

// Upload buffer to Cloudinary
const uploadToCloudinary = (
  fileBuffer: Buffer,
  folder: string,
): Promise<{ secure_url: string; public_id: string }> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "image" },
      (error, result) => {
        if (error) return reject(error);
        resolve({
          secure_url: result!.secure_url,
          public_id: result!.public_id,
        });
      },
    );
    stream.end(fileBuffer);
  });
};

// Middleware: multer upload + Cloudinary upload in one step
// Sets req.body[fieldName] to the Cloudinary URL
const cloudinaryUpload = (fieldName: string, folder: string) => {
  const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      const fileTypes = /jpeg|jpg|png/;
      const extname = fileTypes.test(
        path.extname(file.originalname).toLowerCase(),
      );
      const mimetype = fileTypes.test(file.mimetype);

      if (extname && mimetype) {
        return cb(null, true);
      } else {
        const error: any = new Error("Only image files are allowed!");
        error.code = "INVALID_FILE_TYPE";
        return cb(error, false);
      }
    },
  }).single(fieldName);

  return (req: any, res: any, next: any) => {
    upload(req, res, async (err: any) => {
      if (err) return next(err);
      if (!req.file) return next();

      try {
        const result = await uploadToCloudinary(req.file.buffer, folder);
        req.body[fieldName] = result.secure_url;
        next();
      } catch (error) {
        next(error);
      }
    });
  };
};

// Middleware: multer array upload + Cloudinary upload in one step
// Sets req.body[fieldName] to an array of Cloudinary URLs
const cloudinaryUploadArray = (
  fieldName: string,
  maxCount: number,
  folder: string,
) => {
  const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      const fileTypes = /jpeg|jpg|png/;
      const extname = fileTypes.test(
        path.extname(file.originalname).toLowerCase(),
      );
      const mimetype = fileTypes.test(file.mimetype);

      if (extname && mimetype) {
        return cb(null, true);
      } else {
        const error: any = new Error("Only image files are allowed!");
        error.code = "INVALID_FILE_TYPE";
        return cb(error, false);
      }
    },
  }).array(fieldName, maxCount);

  return (req: any, res: any, next: any) => {
    upload(req, res, async (err: any) => {
      if (err) return next(err);
      if (!req.files?.length) return next();

      try {
        const urls = await Promise.all(
          (req.files as Express.Multer.File[]).map((file) =>
            uploadToCloudinary(file.buffer, folder).then((r) => r.secure_url),
          ),
        );
        req.body[fieldName] = urls;
        next();
      } catch (error) {
        next(error);
      }
    });
  };
};

export {
  cloudinaryUpload,
  cloudinaryUploadArray,
  uploadToCloudinary,
  cloudinary,
};
export default userFileUploadMiddleware;

// import multer from "multer";
// import path from "path";
// const userFileUploadMiddleware = (uploadFolder: string) => {
//   const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//       cb(null, uploadFolder); // Set the destination folder
//     },
//     filename: (req, file, cb) => {
//       const extname = path.extname(file.originalname);
//       const filename = Date.now() + "-" + file.fieldname + extname; // Unique file name
//       cb(null, filename); // Set the file name
//     },
//   });

//   return multer({
//     storage,
//     limits: { fileSize: 10 * 1024 * 1024 }, // Max file size: 10MB
//     fileFilter: (req, file, cb) => {
//       const fileTypes = /jpeg|jpg|png/;
//       const extname = fileTypes.test(
//         path.extname(file.originalname).toLowerCase()
//       );
//       const mimetype = fileTypes.test(file.mimetype);

//       if (extname && mimetype) {
//         return cb(null, true); // If file is valid, allow it
//       } else {
//         const error: any = new Error("Only image or heic files are allowed!");
//         error.code = "INVALID_FILE_TYPE";
//         return cb(error, false);
//       }
//     },
//   });
// };

// export default userFileUploadMiddleware;
