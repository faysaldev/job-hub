import { Response } from "express";
import { z } from "zod";
import { asyncHandler } from "../../lib/errorsHandle";
import { response } from "../../lib/response";
import { ProtectedRequest } from "../../types/protected-request";
import { AppError } from "../../lib/errors";
import * as billing from "./billing.service";
import * as admin from "./billing.admin";

const ok = (res: Response, data: unknown, message = "OK") => res.status(200).json(response({ message, data: data as object, status: "OK", statusCode: 200 }));
const limits = z.object({ activeJobs: z.number().int().min(0).max(100000),
  teamSeats: z.number().int().min(1).max(100000), monthlyCredits: z.number().int().min(0).max(10000) });
export const planInput = z.object({
  key: z.string().regex(/^[a-z][a-z0-9-]{1,39}$/), name: z.string().min(2).max(80),
  description: z.string().max(500).default(""), priceCents: z.number().int().min(0).max(10000000).nullable(),
  limits, features: z.array(z.string().min(1).max(140)).max(20).default([]), enterprise: z.boolean().default(false),
}).strict();
const actions = z.discriminatedUnion("action", [
  z.object({ action: z.literal("checkout"), planKey: z.string().regex(/^[a-z][a-z0-9-]{1,39}$/) }).strict(),
  z.object({ action: z.literal("portal") }).strict(),
  z.object({ action: z.literal("sponsor"), jobId: z.string().regex(/^[a-fA-F0-9]{24}$/),
    durationDays: z.union([z.literal(7), z.literal(30)]), payment: z.enum(["credit", "stripe"]), requestId: z.uuid() }).strict(),
]);
const adminActions = z.discriminatedUnion("action", [
  z.object({ action: z.literal("edit"), changes: planInput.partial().omit({ key: true }).refine(x => Object.keys(x).length > 0) }).strict(),
  z.object({ action: z.literal("publish") }).strict(),
  z.object({ action: z.literal("hide") }).strict(),
  z.object({ action: z.literal("duplicate"), newKey: planInput.shape.key, newName: planInput.shape.name }).strict(),
]);
const plans = asyncHandler(async (_req: ProtectedRequest, res: Response) => ok(res, { plans: await billing.listPublicPlans() }));
const dashboard = asyncHandler(async (req: ProtectedRequest, res: Response) => ok(res, await billing.billingDashboard(req.user!._id)));
const action = asyncHandler(async (req: ProtectedRequest, res: Response) => {
  const body = actions.parse(req.body);
  if (body.action === "checkout") return ok(res, await billing.subscribeCheckout(req.user!._id, req.user!.email, body.planKey), "Checkout created");
  if (body.action === "portal") return ok(res, await billing.portalSession(req.user!._id), "Portal created");
  return ok(res, await billing.sponsor(req.user!._id, body), "Promotion initiated");
});
const allPlans = asyncHandler(async (_req: ProtectedRequest, res: Response) => ok(res, { plans: await admin.allPlans() }));
const createPlan = asyncHandler(async (req: ProtectedRequest, res: Response) => {
  const value = planInput.parse(req.body);
  const plan = await admin.createPlan(value, req.user!._id);
  res.status(201).json(response({ message: "Draft plan created", status: "OK", statusCode: 201, data: { plan } }));
});
const managePlan = asyncHandler(async (req: ProtectedRequest, res: Response) => {
  const body = adminActions.parse(req.body);
  const plan = await admin.managePlan(req.params.id, body, req.user!._id);
  if (!plan) throw new AppError("Plan update failed", 409);
  ok(res, { plan }, "Plan updated");
});
export default { plans, dashboard, action, allPlans, createPlan, managePlan };
