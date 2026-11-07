import { randomUUID } from "node:crypto";
import { Request, Response, NextFunction } from "express";
import logger from "../lib/logger";

/** Bounded metadata only. Never log query strings, auth headers or request bodies. */
const logRequestResponse = (req: Request, res: Response, next: NextFunction) => {
  const supplied = req.get("x-request-id");
  const id = supplied && /^[a-zA-Z0-9_.:-]{1,64}$/.test(supplied) ? supplied : randomUUID();
  res.locals.requestId = id;
  res.setHeader("X-Request-ID", id);
  const start = process.hrtime.bigint();
  res.once("finish", () => {
    const ms = Math.round(Number(process.hrtime.bigint() - start) / 1e6);
    const method = req.method.replace(/[^A-Z]/g, "").slice(0, 8);
    // req.route.path is safe after router matching; req.path excludes query/fragment.
    const path = req.path.slice(0, 160).replace(/[\r\n]/g, "");
    const message = `${method} ${path} status=${res.statusCode} durationMs=${ms} requestId=${id}`;
    if (res.statusCode >= 500 || ms >= 1500) logger.warn(message);
    else logger.info(message);
  });
  next();
};
export default logRequestResponse;
