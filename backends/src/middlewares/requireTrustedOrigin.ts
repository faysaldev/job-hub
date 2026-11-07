import { Request, Response, NextFunction } from "express";
import { isAllowedOrigin } from "../config/cors";
import { AppError } from "../lib/errors";
/** Prevent cross-site forms from silently rotating or revoking cookie sessions. */
export const requireTrustedOrigin = (req: Request, _res: Response, next: NextFunction) => {
  if (!isAllowedOrigin(req.headers.origin)) return next(new AppError("Untrusted origin", 403));
  next();
};
