import { Router } from "express";
import userRoutes from "../domains/User/user.route";

// Initialize the router
const router = Router();

router.use("/users", userRoutes);
export default router;
