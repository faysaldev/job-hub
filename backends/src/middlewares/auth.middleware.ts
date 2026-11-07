import { NextFunction, Response } from "express";
import { AppError } from "../lib/errors";
import { verifyAccess } from "../domains/Auth/auth.token.services";
import { ProtectedRequest } from "../types/protected-request";

export const authMiddleware = async (req: ProtectedRequest, _res: Response, next: NextFunction) => {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) throw new AppError("Authentication required", 401);
    req.user = await verifyAccess(header.slice(7));
    next();
  } catch (error) { next(error); }
};

export const requireRoles = (...roles: Array<"seeker" | "recruiter" | "admin">) =>
  (req: ProtectedRequest, _res: Response, next: NextFunction) => {
    if (!req.user) return next(new AppError("Authentication required", 401));
    if (!roles.includes(req.user.role)) return next(new AppError("Permission denied", 403));
    return next();
  };

/** Public endpoints may display the authenticated owner's private records. */
export const optionalAuth = async (req: ProtectedRequest, _res: Response, next: NextFunction) => {
  try {
    if (req.headers.authorization) {
      const header = req.headers.authorization;
      if (!header.startsWith("Bearer ")) throw new AppError("Invalid authorization", 401);
      req.user = await verifyAccess(header.slice(7));
    }
    next();
  } catch (error) { next(error); }
};
