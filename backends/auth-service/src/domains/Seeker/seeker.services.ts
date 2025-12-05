import Seeker, { ISeeker } from './seeker.model';
import { Types } from 'mongoose';

export const createSeekerService = async (seekerData: Partial<ISeeker>): Promise<ISeeker> => {
  const seeker = new Seeker(seekerData);
  return await seeker.save();
};

export const getSeekerService = async (id: string): Promise<ISeeker | null> => {
  return await Seeker.findById(id).populate('userId', '-password');
};

export const getAllSeekersService = async (): Promise<ISeeker[]> => {
  return await Seeker.find().populate('userId', '-password');
};

export const updateSeekerService = async (id: string, seekerData: Partial<ISeeker>): Promise<ISeeker | null> => {
  return await Seeker.findByIdAndUpdate(
    id,
    { ...seekerData },
    { new: true, runValidators: true }
  ).populate('userId', '-password');
};