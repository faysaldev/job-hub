import { Router } from "express";
import billing from "./billing.controller";
import { authMiddleware, requireRoles } from "../../middlewares/auth.middleware";
const router = Router();
// Two recruiter reads + one action endpoint keep client request count small.
router.get("/plans", billing.plans);
router.get("/dashboard", authMiddleware, requireRoles("recruiter"), billing.dashboard);
router.post("/actions", authMiddleware, requireRoles("recruiter"), billing.action);
// Plan editing is never available to a recruiter or through client-supplied role claims.
router.get("/admin/plans", authMiddleware, requireRoles("admin"), billing.allPlans);
router.post("/admin/plans", authMiddleware, requireRoles("admin"), billing.createPlan);
router.patch("/admin/plans/:id", authMiddleware, requireRoles("admin"), billing.managePlan);
export default router;
