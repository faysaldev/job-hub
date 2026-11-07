import { z } from "zod";
import { Types } from "mongoose";
const id = z.string().refine((value) => Types.ObjectId.isValid(value), "Invalid ID");
export const createApplicationValidation = z.object({
  job_id: id,
  resume_url: z.string().max(2048).refine((value) => /^https:\/\/[^\s]+$/i.test(value) || /^asset:[a-f0-9]{24}$/i.test(value), "Invalid resume reference"),
  cover_letter: z.string().trim().min(30).max(5000).optional(),
  boost: z.boolean().optional(), // server determines the fixed price
  // paid_amount deliberately omitted: applicants cannot choose their own charge.
});
export const applicationStatusValidation = z.object({
  status: z.enum(["applied", "under_review", "interview", "rejected", "hired"]),
  rejection_note: z.string().trim().max(2000).optional(),
});
