import { z } from "zod";

export const objectId = z.string().regex(/^[\da-fA-F]{24}$/);
export const adminActions = z.discriminatedUnion("action", [
  z.object({ action: z.literal("verify-company"), companyId: objectId,
    decision: z.enum(["verified", "rejected"]), reason: z.string().trim().max(1000).default("") }).strict(),
  z.object({ action: z.literal("moderate-job"), jobId: objectId,
    decision: z.enum(["blocked", "restored"]), reason: z.string().trim().max(1000).default("") }).strict(),
  z.object({ action: z.literal("user-access"), userId: objectId,
    decision: z.enum(["suspend", "restore"]), reason: z.string().trim().max(1000).default("") }).strict(),
  z.object({ action: z.literal("review-report"), reportId: objectId,
    decision: z.enum(["reviewing", "resolved", "dismissed"]), reason: z.string().trim().max(1000).default("") }).strict(),
  z.object({ action: z.literal("support"), contactId: objectId,
    decision: z.enum(["open", "in_progress", "resolved"]), reason: z.string().trim().max(1000).default("") }).strict(),
  z.object({ action: z.literal("reconcile-invoice"), invoiceId: objectId }).strict(),
  z.object({ action: z.literal("retry-stripe-event"), eventId: z.string().regex(/^evt_[a-zA-Z0-9_]{8,120}$/) }).strict(),
]);
export type AdminAction = z.infer<typeof adminActions>;
export const reportInput = z.object({
  targetKind: z.enum(["job", "company", "user"]), targetId: objectId,
  category: z.enum(["spam", "fraud", "harassment", "misleading", "other"]),
  description: z.string().trim().min(15).max(2000),
}).strict();
export const recordQuery = z.object({
  kind: z.enum(["companies", "jobs", "users", "reports", "support", "subscriptions", "invoices", "stripe-events", "audit"]),
  status: z.string().max(30).optional(), search: z.string().trim().max(80).optional(),
  page: z.coerce.number().int().min(1).max(10000).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
}).strict();
export type RecordsQuery = z.infer<typeof recordQuery>;
