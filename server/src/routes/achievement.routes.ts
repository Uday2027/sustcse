import { Router } from 'express';
import { auth } from '../middleware/auth';
import { rbac } from '../middleware/rbac';
import { sectionAccess } from '../middleware/sectionAccess';
import * as achievementController from '../controllers/achievement.controller';

const router = Router();

// --- Public routes ---

// GET / - List all achievements (public)
router.get('/', achievementController.getAll);

// GET /:id - Get achievement by ID (public)
router.get('/:id', achievementController.getById);

// --- Admin routes ---

// POST / - Create a new achievement (admin only)
router.post(
  '/',
  auth,
  rbac('admin', 'super_admin'),
  sectionAccess('achievements', 'create'),
  achievementController.create
);

// PATCH /:id - Update an achievement (admin only)
router.patch(
  '/:id',
  auth,
  rbac('admin', 'super_admin'),
  sectionAccess('achievements', 'update'),
  achievementController.update
);

// DELETE /:id - Delete an achievement (admin only)
router.delete(
  '/:id',
  auth,
  rbac('admin', 'super_admin'),
  sectionAccess('achievements', 'delete'),
  achievementController.remove
);

export default router;
