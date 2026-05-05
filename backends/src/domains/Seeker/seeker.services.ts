import Seeker, { ISeeker } from "./seeker.model";
import { Types } from "mongoose";

export const createSeekerService = async (
  seekerData: Partial<ISeeker>,
): Promise<ISeeker> => {
  const seeker = new Seeker(seekerData);
  return await seeker.save();
};

export const getSeekerService = async (id: string): Promise<ISeeker | null> => {
  return await Seeker.findById(id).populate(
    "userId",
    "name email image role phoneNumber",
  );
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
  const { search, skills, location, page = 1, limit = 10 } = query;

  const filters: any = {};

  if (search) {
    filters.$or = [
      { designation: { $regex: search, $options: "i" } },
      { aboutMe: { $regex: search, $options: "i" } },
    ];
  }

  if (skills) {
    const skillsArray = Array.isArray(skills)
      ? skills
      : skills.split(",").map((s: string) => s.trim());
    filters.skills = { $all: skillsArray };
  }

  if (location) {
    filters.userLocation = { $regex: location, $options: "i" };
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [seekers, total] = await Promise.all([
    Seeker.find(filters)
      .select("userId userLocation designation aboutMe skills resume portfolio")
      .populate("userId", "name email image role phoneNumber")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    Seeker.countDocuments(filters),
  ]);

  return {
    seekers,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
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
    { ...seekerData },
    { new: true, runValidators: true },
  );
};
