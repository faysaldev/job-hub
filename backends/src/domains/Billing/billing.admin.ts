import BillingPlan from "./billing.plan.model";
import { AppError } from "../../lib/errors";
import { assertId } from "../../lib/query";
import { assertPlanWrite } from "./billing.service";
import mongoose from "mongoose";

type PlanData = { key: string; name: string; description: string; priceCents: number|null;
  limits: { activeJobs: number; teamSeats: number; monthlyCredits: number }; features: string[]; enterprise: boolean };
const selection = "key version name description priceCents currency limits features published isCurrent enterprise createdAt updatedAt";
export const allPlans = async () => BillingPlan.find().select(selection).sort({ key: 1, version: -1 }).limit(300).lean();
export const createPlan = async (body: PlanData, actorId: string) => {
  assertPlanWrite(body);
  if (await BillingPlan.exists({ key: body.key })) throw new AppError("Plan key already exists", 409);
  return BillingPlan.create({ ...body, version: 1, published: false, isCurrent: false, currency: "usd", createdBy: actorId });
};
export const managePlan = async (id: string, body: { action: "edit"|"publish"|"hide"|"duplicate"; changes?: Partial<PlanData>; newKey?: string; newName?: string }, actorId: string) => {
  const plan = await BillingPlan.findById(assertId(id, "plan ID"));
  if (!plan) throw new AppError("Plan not found", 404);
  if (body.action === "duplicate") {
    if (!body.newKey || !body.newName || await BillingPlan.exists({ key: body.newKey })) throw new AppError("Choose a unique new plan key", 409);
    const clone = plan.toObject();
    return BillingPlan.create({ key: body.newKey, name: body.newName, version: 1,
      description: clone.description, priceCents: clone.priceCents, limits: clone.limits,
      features: clone.features, enterprise: clone.enterprise, published: false, isCurrent: false, createdBy: actorId });
  }
  if (body.action === "hide") {
    if (!plan.isCurrent || !plan.published || plan.key === "free") throw new AppError("Only a visible paid plan can be hidden", 409);
    return BillingPlan.findByIdAndUpdate(plan._id, { $set: { published: false } }, { new: true });
  }
  if (body.action === "edit") {
    if (!body.changes) throw new AppError("Plan edits are required", 400);
    const latest = await BillingPlan.findOne({ key: plan.key }).sort({ version: -1 });
    if (!latest || latest._id.toString() !== plan._id.toString())
      throw new AppError("Edit the latest version rather than an archived version", 409);
    const proposed = { key: plan.key, name: body.changes.name ?? plan.name, description: body.changes.description ?? plan.description,
      priceCents: body.changes.priceCents === undefined ? plan.priceCents : body.changes.priceCents,
      limits: body.changes.limits ?? JSON.parse(JSON.stringify(plan.limits)), features: body.changes.features ?? plan.features,
      enterprise: body.changes.enterprise ?? plan.enterprise };
    assertPlanWrite(proposed);
    if (!plan.published && !plan.isCurrent) {
      return BillingPlan.findByIdAndUpdate(plan._id, { $set: { ...proposed } }, { new: true, runValidators: true });
    }
    // Published versions are immutable; existing subscription snapshots remain unchanged.
    return BillingPlan.create({ ...proposed, version: plan.version + 1, isCurrent: false,
      published: false, currency: "usd", createdBy: actorId });
  }
  if (body.action === "publish") {
    if (plan.enterprise === false && plan.priceCents === null) throw new AppError("Set a plan price before publication", 400);
    const session = await mongoose.startSession();
    try {
      let published;
      await session.withTransaction(async () => {
        const latest = await BillingPlan.findOne({ key: plan.key }).sort({ version: -1 }).session(session);
        if (latest?._id.toString() !== plan._id.toString()) throw new AppError("Only the latest version can be published", 409);
        // Demote an old current version before promoting the new version (unique partial index).
        await BillingPlan.updateMany({ key: plan.key, isCurrent: true, _id: { $ne: plan._id } },
          { $set: { isCurrent: false, published: false } }, { session });
        published = await BillingPlan.findByIdAndUpdate(plan._id,
          { $set: { published: true, isCurrent: true } }, { new: true, session });
      }, { readConcern: { level: "snapshot" }, writeConcern: { w: "majority" } });
      return published;
    } finally { await session.endSession(); }
  }
  throw new AppError("Invalid plan action", 400);
};
