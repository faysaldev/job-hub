import { Types } from "mongoose";
import User from "../User/user.model";
import Seeker, { ISeeker } from "./seeker.model";
import ActivityLog from "./activity.model";
import { assertId, escapeRegex, paging } from "../../lib/query";

export const createSeekerService = async (
  seekerData: Partial<ISeeker>,
): Promise<ISeeker> => {
  const existing = await Seeker.exists({ userId: seekerData.userId });
  if (existing) throw new Error("Seeker profile already exists");
  const seeker = new Seeker(seekerData);
  return await seeker.save();
};

export const getSeekerService = async (id: string): Promise<ISeeker | null> => {
  assertId(id);
  // Public candidate pages do not reveal email, phone or resume URLs.
  const seeker = await Seeker.findById(id)
    .select("-resume -profileStrength")
    .populate({ path: "userId", select: "name image role",
      match: { isDeleted: { $ne: true }, isEmailVerified: true, role: "seeker" } });
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

export const getAllSeekersService = async (query: any = {}) => {
  const {
    search,
    skills,
    location,
    experienceLevel,
    jobType,
    availability,
    totalExperience,
    page = 1,
    limit = 10,
  } = query;

  const filters: any = {};

  if (search) {
    // Find matching users by name first to include in search
    const matchingUsers = await User.find({
      name: { $regex: escapeRegex(search), $options: "i" },
    }).select("_id");
    const userIds = matchingUsers.map((u: any) => u._id);

    filters.$or = [
      { designation: { $regex: escapeRegex(search), $options: "i" } },
      { aboutMe: { $regex: escapeRegex(search), $options: "i" } },
      { skills: { $in: [new RegExp(escapeRegex(search), "i")] } },
      { userId: { $in: userIds } },
    ];
  }

  if (skills) {
    const skillsArray = Array.isArray(skills)
      ? skills
      : skills.split(",").map((s: string) => s.trim());
    filters.skills = { $all: skillsArray };
  }

  if (location) {
    filters.userLocation = { $regex: escapeRegex(location), $options: "i" };
  }

  if (experienceLevel) {
    filters.experienceLevel = experienceLevel;
  }

  if (jobType) {
    filters.jobType = jobType;
  }

  if (availability) {
    filters.availability = availability;
  }

  if (totalExperience) {
    filters.totalExperience = { $regex: escapeRegex(totalExperience), $options: "i" };
  }

  const bounds = paging({ page, limit });
  const skip = (bounds.page - 1) * bounds.limit;

  const [seekers, total] = await Promise.all([
    Seeker.find(filters)
      .select(
        "userId userLocation designation aboutMe skills portfolio experienceLevel availability jobType totalExperience",
      )
      .populate({ path: "userId", select: "name image role",
        match: { isDeleted: { $ne: true }, isEmailVerified: true, role: "seeker" } })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(bounds.limit)
      .lean(),
    Seeker.countDocuments(filters),
  ]);

  return {
    seekers: seekers.filter((seeker) => !!seeker.userId),
    pagination: {
      total,
      page: bounds.page,
      limit: bounds.limit,
      totalPages: Math.ceil(total / bounds.limit),
    },
  };
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
