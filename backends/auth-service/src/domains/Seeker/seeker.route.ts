import express from "express";
import {
  createSeeker,
  getSeeker,
  getAllSeekers,
  updateSeeker
} from "./seeker.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = express.Router();

router.post("/", authMiddleware, createSeeker);
router.get("/", authMiddleware, getSeeker);  // Get authenticated user's seeker profile
router.get("/all", authMiddleware, getAllSeekers);  // Get all seekers
router.put("/", authMiddleware, updateSeeker);  // Update authenticated user's seeker profile

export default router;
