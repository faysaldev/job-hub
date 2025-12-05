import Seeker, { ISeeker } from "./seeker.model";
import { Types } from "mongoose";

export const createSeekerService = async (
  seekerData: Partial<ISeeker>
): Promise<ISeeker> => {
  const seeker = new Seeker(seekerData);
  return await seeker.save();
};

export const getSeekerService = async (id: string): Promise<ISeeker | null> => {
  return await Seeker.findById(id).populate("userId", "-password");
};

export const getSeekerByUserIdService = async (
  userId: string
): Promise<ISeeker | null> => {
  return await Seeker.findOne({ userId: new Types.ObjectId(userId) }).populate(
    "userId",
    "-password"
  );
};

export const getAllSeekersService = async (): Promise<ISeeker[]> => {
  return await Seeker.find().populate("userId", "-password");
};

export const updateSeekerService = async (
  id: string,
  seekerData: Partial<ISeeker>
): Promise<ISeeker | null> => {
  return await Seeker.findByIdAndUpdate(
    id,
    { ...seekerData },
    { new: true, runValidators: true }
  ).populate("userId", "-password");
};

export const updateSeekerByUserIdService = async (
  userId: string,
  seekerData: Partial<ISeeker>
): Promise<ISeeker | null> => {
  return await Seeker.findOneAndUpdate(
    { userId: new Types.ObjectId(userId) },
    { ...seekerData },
    { new: true, runValidators: true }
  );
};
