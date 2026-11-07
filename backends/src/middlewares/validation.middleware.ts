import { Request, Response, NextFunction } from "express";
import { ZodType, ZodError } from "zod";
import { AppError } from "../lib/errors";

const parse = (schema: ZodType, source: "body" | "query" | "params") =>
  (req: Request, _res: Response, next: NextFunction) => {
    try {
      const clean = schema.parse(req[source]);
      // Explicitly use parsed fields: strips unknown/mass-assignment keys.
      if (source === "body") req.body = clean;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next(new AppError("Validation failed", 400, true,
          error.issues.map((issue) => ({ field: issue.path.join("."), message: issue.message }))));
      } else next(error);
    }
  };
export const validateQuery = (schema: ZodType) => parse(schema, "query");
export const validateParams = (schema: ZodType) => parse(schema, "params");
export default (schema: ZodType) => parse(schema, "body");
