import { Router } from 'express';
import { auth } from '../middleware/auth';
import * as studentController from '../controllers/student.controller';

const router = Router();

// --- Authenticated routes ---

// GET / - List all students (auth required)
router.get('/', auth, studentController.getAll);

// PATCH /profile - Update own student profile (must be before /:id)
router.patch('/profile', auth, studentController.updateProfile);

// GET /:id - Get student by ID (auth required)
router.get('/:id', auth, studentController.getById);

export default router;
