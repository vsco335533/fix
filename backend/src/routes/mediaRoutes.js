import express from 'express';
import { body } from 'express-validator';
import {
  getAllMedia,
  createMedia,
  deleteMedia
} from '../controllers/mediaController.js';
import { authenticate, requireResearcher } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';

const router = express.Router();

router.get('/', getAllMedia);

router.post(
  '/',
  authenticate,
  requireResearcher,
  [
    body('title').trim().notEmpty(),
    body('type').isIn(['video', 'image', 'document']),
    body('url').isURL(),
    validate
  ],
  createMedia
);

router.delete('/:id', authenticate, requireResearcher, deleteMedia);

export default router;
