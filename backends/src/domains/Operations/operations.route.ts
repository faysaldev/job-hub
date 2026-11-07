import { Router } from "express";
import { authMiddleware, requireRoles } from "../../middlewares/auth.middleware";
import { rateLimit } from "../../middlewares/rateLimit.middleware";
import controller from "./operations.controller";

const router = Router();
router.use(authMiddleware);
// Public accounts can flag an abusive job/company/account; report content is private to staff.
router.post("/reports", requireRoles("seeker", "recruiter"), rateLimit(6, 3600, "report"), controller.report);
router.get("/recruiter/analytics", requireRoles("recruiter"), controller.recruiter);
router.use(requireRoles("admin"));
router.get("/overview", controller.overview);
router.get("/records", controller.records);
router.post("/actions", rateLimit(30, 60, "admin-action"), controller.action);
export default router;
