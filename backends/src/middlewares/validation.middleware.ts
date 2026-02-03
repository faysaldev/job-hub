import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import { AppError } from "../lib/errors";
import httpStatus from "http-status";

/**
 * Validation middleware using Zod
 * Validates request body against a Zod schema
 */
const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        }));
        const appError = new AppError("Validation failed", httpStatus.BAD_REQUEST, true, errors);
        next(appError);
      } else {
        next(error);
      }
    }
  };
};

/**
 * Validate query parameters
 */
export const validateQuery = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.query);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        }));
        const appError = new AppError("Query validation failed", httpStatus.BAD_REQUEST, true, errors);
        next(appError);
      } else {
        next(error);
      }
    }
  };
};

/**
 * Validate URL parameters
 */
export const validateParams = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.params);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        }));
        const appError = new AppError("Parameter validation failed", httpStatus.BAD_REQUEST, true, errors);
        next(appError);
      } else {
        next(error);
      }
    }
  };
};

export default validate;
