import { z } from "zod";
import { Types } from "mongoose";
const id = z.string().refine(Types.ObjectId.isValid, "Invalid ID");
export const scheduleValidation = z.object({
  application_id: id, job_id: id, interviewee: id,
  date: z.coerce.date(),
  start_time: z.string().trim().min(1).max(50),
  end_time: z.string().trim().min(1).max(50),
  meet_link: z.url().max(2048).optional().or(z.literal("")),
  type: z.enum(["video", "audio", "in-person"]).default("video"),
  note: z.string().trim().max(3000).optional(),
});
export const statusValidation = z.object({ status: z.enum(["scheduled", "completed", "cancelled"]) });
export const rescheduleValidation = z.object({
  date: z.coerce.date(), start_time: z.string().min(1).max(50), end_time: z.string().min(1).max(50)
});
export const hireValidation = z.object({ jobId: id, applicantId: id });
