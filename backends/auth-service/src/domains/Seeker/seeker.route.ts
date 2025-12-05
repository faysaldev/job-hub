import express from 'express';
import {
  createSeeker,
  getSeeker,
  getAllSeekers,
  updateSeeker,
} from './seeker.controller';

const router = express.Router();

router.post('/', createSeeker);
router.get('/:id', getSeeker);
router.get('/', getAllSeekers);
router.put('/:id', updateSeeker);

export default router;