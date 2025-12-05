import express from "express";
import {
  createSeeker,
  getSeeker,
  getAllSeekers,
  updateSeeker,
} from "./seeker.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = express.Router();

router.post("/", authMiddleware, createSeeker);
router.get("/:id", authMiddleware, getSeeker);
router.get("/", authMiddleware, getAllSeekers);
router.put("/:id", authMiddleware, updateSeeker);

export default router;
