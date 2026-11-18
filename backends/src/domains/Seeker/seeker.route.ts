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
import { asyncHandler } from "../../lib/errorsHandle";
import { response } from "../../lib/response";
import { z } from "zod";
import * as engagement from "./candidate-engagement.services";
import { ProtectedRequest } from "../../types/protected-request";

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
// Two compact actions for the company talent list. ATS stage actions stay on /applications/:id.
router.get("/:id/engagement", authMiddleware, requireRoles("recruiter"), asyncHandler(async (req: ProtectedRequest, res) => {
  const data = await engagement.getCandidateEngagement(req.params.id, req.user!._id);
  res.json(response({ message: "Candidate engagement", status: "OK", statusCode: 200, data }));
}));
router.patch("/:id/engagement", authMiddleware, requireRoles("recruiter"), validate(z.object({
  action: z.enum(["save", "shortlist", "remove"]),
})), asyncHandler(async (req: ProtectedRequest, res) => {
  const data = await engagement.updateCandidateEngagement(req.params.id, req.user!._id, req.body.action);
  res.json(response({ message: "Candidate engagement updated", status: "OK", statusCode: 200, data }));
}));
router.get("/:id", getSeekerById); // Get seeker by ID
router.put(
  "/",
  authMiddleware,
  requireRoles("seeker"),
  validate(seekerValidation.updateSeekerValidation),
  updateSeeker,
); // Update authenticated user's seeker profile

export default router;
