import express from "express";
import {
  createSeeker,
  getSeeker,
  getSeekerById,
  getAllSeekers,
  updateSeeker,
} from "./seeker.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import validate from "../../middlewares/validation.middleware";
import seekerValidation from "./seeker.validation";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  validate(seekerValidation.createSeekerValidation),
  createSeeker,
);
router.get("/profile", authMiddleware, getSeeker); // Get authenticated user's seeker profile
router.get("/all", getAllSeekers); // Get all seekers
router.get("/:id", getSeekerById); // Get seeker by ID
router.put(
  "/",
  authMiddleware,
  validate(seekerValidation.updateSeekerValidation),
  updateSeeker,
); // Update authenticated user's seeker profile

export default router;
