import { Types } from "mongoose";
import Seeker, { ISeeker } from "./seeker.model";
import ActivityLog from "./activity.model";
import { assertId, escapeRegex, paging } from "../../lib/query";
import { assertOwnedResume } from "../Asset/asset.services";

export const createSeekerService = async (
  seekerData: Partial<ISeeker>,
): Promise<ISeeker> => {
  const existing = await Seeker.exists({ userId: seekerData.userId });
  if (existing) throw new Error("Seeker profile already exists");
  if (seekerData.resume?.resumeLink) await assertOwnedResume(seekerData.resume.resumeLink, String(seekerData.userId));
  const seeker = new Seeker(seekerData);
  return await seeker.save();
};

export const getSeekerService = async (id: string): Promise<ISeeker | null> => {
  assertId(id);
  // Public candidate pages do not reveal email, phone or resume URLs.
  const seeker = await Seeker.findOne({ _id: id, "privacy.profileVisibility": "public" })
    .select("-resume -profileStrength -preferences")
    .populate({ path: "userId", select: "name image role",
      match: { isDeleted: { $ne: true }, suspendedAt: { $exists: false }, isEmailVerified: true, role: "seeker" } });
  return seeker?.userId ? seeker : null;
};

export const getSeekerByUserIdService = async (
  userId: string,
): Promise<ISeeker | null> => {
  return await Seeker.findOne({ userId: new Types.ObjectId(userId) }).populate(
    "userId",
    "name email image role phoneNumber",
  );
};

/** Stable count + page over only active, verified candidate accounts. */
export const getAllSeekersService = async (query: any = {}) => {
  const { search, skills, location, experienceLevel, jobType, availability, totalExperience } = query;
  const filters: any = { "privacy.profileVisibility": "public", "privacy.searchable": true };
  if (skills) {
    const names = Array.isArray(skills) ? skills : String(skills).split(",").slice(0, 20).map((item) => item.trim());
    filters.skills = { $all: names };
  }
  if (location) filters.userLocation = new RegExp(escapeRegex(location), "i");
  if (experienceLevel) filters.experienceLevel = experienceLevel;
  if (jobType) filters.jobType = jobType;
  if (availability) filters.availability = availability;
  if (totalExperience) filters.totalExperience = new RegExp(escapeRegex(totalExperience), "i");
  const bounds = paging(query);
  const skip = (bounds.page - 1) * bounds.limit;
  const pipeline: any[] = [
    { $match: filters },
    { $lookup: { from: "users", localField: "userId", foreignField: "_id", as: "candidate", pipeline: [
      { $match: { isDeleted: { $ne: true }, suspendedAt: { $exists: false }, isEmailVerified: true, role: "seeker" } },
      { $project: { name: 1, image: 1, role: 1 } },
    ] } },
    { $unwind: "$candidate" },
  ];
  if (search) {
    const pattern = new RegExp(escapeRegex(search), "i");
    pipeline.push({ $match: { $or: [
      { designation: pattern }, { aboutMe: pattern }, { skills: pattern }, { "candidate.name": pattern },
    ] } });
  }
  pipeline.push({ $sort: { createdAt: -1 } }, { $facet: {
    rows: [ { $skip: skip }, { $limit: bounds.limit },
      { $project: { userId: "$candidate", userLocation: 1, designation: 1, aboutMe: 1, skills: 1,
        portfolio: 1, experienceLevel: 1, availability: 1, jobType: 1, totalExperience: 1 } } ],
    meta: [{ $count: "total" }],
  } });
  const result = await Seeker.aggregate(pipeline);
  const total = result[0]?.meta?.[0]?.total || 0;
  return { seekers: result[0]?.rows || [], pagination: {
    total, page: bounds.page, limit: bounds.limit, totalPages: Math.ceil(total / bounds.limit),
  } };
};

export const updateSeekerService = async (
  id: string,
  seekerData: Partial<ISeeker>,
): Promise<ISeeker | null> => {
  return await Seeker.findByIdAndUpdate(
    id,
    { ...seekerData },
    { new: true, runValidators: true },
  ).populate("userId", "name email image role phoneNumber");
};

export const updateSeekerByUserIdService = async (
  userId: string,
  seekerData: Partial<ISeeker>,
): Promise<ISeeker | null> => {
  if (seekerData.resume?.resumeLink) await assertOwnedResume(seekerData.resume.resumeLink, userId);
  if (seekerData.preferences?.expectedSalaryMin !== undefined && seekerData.preferences?.expectedSalaryMax !== undefined &&
      seekerData.preferences.expectedSalaryMin > seekerData.preferences.expectedSalaryMax) throw new Error("Minimum expected salary exceeds maximum");
  return await Seeker.findOneAndUpdate(
    { userId: new Types.ObjectId(userId) },
    { $set: seekerData },
    { new: true, runValidators: true },
  );
};

export const addActivityLogService = async (
  userId: string,
  activityTitle: string,
) => {
  const log = new ActivityLog({
    userId: new Types.ObjectId(userId),
    activityTitle,
    date: new Date(),
  });
  return await log.save();
};

export const getActivityLogsService = async (userId: string) => {
  return await ActivityLog.find({ userId: new Types.ObjectId(userId) })
    .sort({ date: -1 })
    .limit(5)
    .lean();
};
