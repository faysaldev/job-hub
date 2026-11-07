import { AppError } from "./errors";
import { Types } from "mongoose";

export const assertId = (value: unknown, label = "ID"): string => {
  if (typeof value !== "string" || !Types.ObjectId.isValid(value)) throw new AppError(`Invalid ${label}`, 400);
  return value;
};
export const escapeRegex = (value: unknown, maxLength = 100) => {
  if (typeof value !== "string" || value.length > maxLength) throw new AppError("Invalid search term", 400);
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};
export const paging = (input: Record<string, unknown>, maximum = 50) => {
  const parse = (key: string, fallback: number) => {
    const raw = input[key];
    if (raw === undefined) return fallback;
    const value = Number(raw);
    if (!Number.isSafeInteger(value) || value < 1) throw new AppError(`Invalid ${key}`, 400);
    return value;
  };
  return { page: Math.min(parse("page", 1), 10000), limit: Math.min(parse("limit", 10), maximum) };
};
