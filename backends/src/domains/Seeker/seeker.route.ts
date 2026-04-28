import express from "express";
import {
  createSeeker,
  getSeeker,
  getAllSeekers,
  updateSeeker
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
router.get("/", authMiddleware, getSeeker); // Get authenticated user's seeker profile
router.get("/all", authMiddleware, getAllSeekers); // Get all seekers
router.put(
  "/",
  authMiddleware,
  validate(seekerValidation.updateSeekerValidation),
  updateSeeker,
); // Update authenticated user's seeker profile

export default router;
