import { z } from "zod";
import { Types } from "mongoose";
const id = z.string().refine(Types.ObjectId.isValid, "Invalid ID");
export const scheduleValidation = z.object({
  application_id: id, job_id: id, interviewee: id, interviewer: id.optional(),
  date: z.coerce.date(),
  start_time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Use HH:mm 24-hour time"),
  end_time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Use HH:mm 24-hour time"),
  timeZone: z.string().trim().min(2).max(64).optional(),
  meet_link: z.string().url().max(2048).refine(v => v.startsWith("https://"), "Meeting link must use HTTPS").optional().or(z.literal("")),
  type: z.enum(["video", "audio", "in-person"]).default("video"),
  note: z.string().trim().max(3000).optional(),
});
export const statusValidation = z.object({ status: z.enum(["scheduled", "completed", "cancelled"]) });
export const rescheduleValidation = z.object({
  date: z.coerce.date(), start_time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
  end_time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
  timeZone: z.string().trim().min(2).max(64).optional(),
  meet_link: z.string().url().max(2048).refine(v => v.startsWith("https://"), "Meeting link must use HTTPS").optional().or(z.literal("")),
  interviewer: id.optional(),
});
export const hireValidation = z.object({ jobId: id, applicantId: id });

export const scorecardValidation = z.object({
  overall: z.number().int().min(1).max(5),
  recommendation: z.enum(["strong_yes", "yes", "no", "strong_no"]),
  criteria: z.array(z.object({ label: z.string().trim().min(1).max(100), score: z.number().int().min(1).max(5) })).max(12),
  feedback: z.string().trim().max(3000).optional(),
});
