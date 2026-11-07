import express from "express";
import {
  createSeeker,
  getSeeker,
  getSeekerById,
  getAllSeekers,
  updateSeeker,
  getActivities,
} from "./seeker.controller";
import { authMiddleware, requireRoles } from "../../middlewares/auth.middleware";
import validate from "../../middlewares/validation.middleware";
import seekerValidation from "./seeker.validation";

const router = express.Router();

router.get("/activities", authMiddleware, getActivities);
router.post(
  "/",
  authMiddleware,
  requireRoles("seeker"),
  validate(seekerValidation.createSeekerValidation),
  createSeeker,
);
router.get("/profile", authMiddleware, requireRoles("seeker"), getSeeker); // Get authenticated user's seeker profile
router.get("/all", getAllSeekers); // Get all seekers
router.get("/:id", getSeekerById); // Get seeker by ID
router.put(
  "/",
  authMiddleware,
  requireRoles("seeker"),
  validate(seekerValidation.updateSeekerValidation),
  updateSeeker,
); // Update authenticated user's seeker profile

export default router;
