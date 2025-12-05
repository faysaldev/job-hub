import { Request, Response } from "express";
import {
  createSeekerService,
  getSeekerService,
  getAllSeekersService,
  updateSeekerService,
  getSeekerByUserIdService,
  updateSeekerByUserIdService,
} from "./seeker.services";
import { Types } from "mongoose";
import { ProtectedRequest } from "../../types/protected-request";

export const createSeeker = async (req: Request, res: Response) => {
  try {
    const seekerData = req.body;
    // Add the authenticated user's ID to the seeker data
    if ((req as ProtectedRequest).user) {
      seekerData.userId = (req as ProtectedRequest).user!._id;
    }
    const seeker = await createSeekerService(seekerData);
    res.status(201).json({ success: true, data: seeker });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

export const getSeeker = async (req: Request, res: Response) => {
  try {
    const protectedReq = req as ProtectedRequest;
    if (!protectedReq.user?._id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const seeker = await getSeekerByUserIdService(protectedReq.user._id);
    if (!seeker) {
      return res
        .status(404)
        .json({ success: false, message: "Seeker profile not found" });
    }

    res.status(200).json({ success: true, data: seeker });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

export const getAllSeekers = async (req: Request, res: Response) => {
  try {
    const seekers = await getAllSeekersService();
    res.status(200).json({ success: true, data: seekers });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

export const updateSeeker = async (req: Request, res: Response) => {
  try {
    const protectedReq = req as ProtectedRequest;
    if (!protectedReq.user?._id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const seekerData = req.body;
    const updatedSeeker = await updateSeekerByUserIdService(
      protectedReq.user._id,
      seekerData
    );

    if (!updatedSeeker) {
      return res
        .status(404)
        .json({ success: false, message: "Seeker profile not found" });
    }

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};
