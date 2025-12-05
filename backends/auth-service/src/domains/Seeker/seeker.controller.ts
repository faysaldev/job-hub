import { Request, Response } from 'express';
import { 
  createSeekerService, 
  getSeekerService, 
  getAllSeekersService, 
  updateSeekerService 
} from './seeker.services';
import { Types } from 'mongoose';

export const createSeeker = async (req: Request, res: Response) => {
  try {
    const seekerData = req.body;
    const seeker = await createSeekerService(seekerData);
    res.status(201).json({ success: true, data: seeker });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

export const getSeeker = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid seeker ID' });
    }
    
    const seeker = await getSeekerService(id);
    if (!seeker) {
      return res.status(404).json({ success: false, message: 'Seeker not found' });
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
    const { id } = req.params;
    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid seeker ID' });
    }
    
    const seekerData = req.body;
    const updatedSeeker = await updateSeekerService(id, seekerData);
    
    if (!updatedSeeker) {
      return res.status(404).json({ success: false, message: 'Seeker not found' });
    }
    
    res.status(200).json({ success: true, data: updatedSeeker });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};