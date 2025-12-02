import { Router } from "express";
import applicationRoutes from "../domains/Applications/application.route";

// Initialize the router
const router = Router();

router.use("/applications", applicationRoutes);

export default router;
