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
  status: z.enum(["applied", "under_review", "shortlisted", "interview", "offer", "rejected", "hired"]),
  rejection_note: z.string().trim().max(2000).optional(),
});

export const atsActionValidation = z.discriminatedUnion("action", [
  z.object({ action: z.literal("stage"), status: z.enum(["under_review", "shortlisted", "interview", "hired", "rejected"]), note: z.string().trim().max(2000).optional() }),
  z.object({ action: z.literal("note"), text: z.string().trim().min(1).max(3000) }),
  z.object({ action: z.literal("offer"), salary: z.number().finite().nonnegative(), currency: z.string().regex(/^[A-Z]{3}$/),
    message: z.string().trim().max(4000).optional(), expiresAt: z.coerce.date() }),
  z.object({ action: z.literal("offer-response"), decision: z.enum(["accepted", "declined"]) }),
]);
