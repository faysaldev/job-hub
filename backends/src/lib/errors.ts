import httpStatus from "http-status";

export interface ValidationError {
  field: string;
  message: string;
}

export interface ErrorResponse {
  code: number;
  status: string;
  message: string;
  errors?: ValidationError[];
  stack?: string;
}

/**
 * Custom Application Error class
 * Extends the built-in Error class with additional properties
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly status: string;
  public readonly isOperational: boolean;
  public readonly errors?: ValidationError[];

  constructor(
    message: string,
    statusCode: number = httpStatus.INTERNAL_SERVER_ERROR,
    isOperational: boolean = true,
    errors?: ValidationError[]
  ) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = isOperational;
    this.errors = errors;

    // Capture stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Factory functions for common errors
 */
export const createBadRequestError = (message: string, errors?: ValidationError[]) =>
  new AppError(message, httpStatus.BAD_REQUEST, true, errors);

export const createUnauthorizedError = (message: string = "Unauthorized") =>
  new AppError(message, httpStatus.UNAUTHORIZED);

export const createForbiddenError = (message: string = "Forbidden") =>
  new AppError(message, httpStatus.FORBIDDEN);

export const createNotFoundError = (message: string = "Resource not found") =>
  new AppError(message, httpStatus.NOT_FOUND);

export const createConflictError = (message: string) =>
  new AppError(message, httpStatus.CONFLICT);

export const createInternalError = (message: string = "Internal server error") =>
  new AppError(message, httpStatus.INTERNAL_SERVER_ERROR, false);
