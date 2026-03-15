import { Router } from 'express';
import { auth } from '../middleware/auth';
import { rbac } from '../middleware/rbac';
import { sectionAccess } from '../middleware/sectionAccess';
import * as societyController from '../controllers/society.controller';

const router = Router();

// --- Public routes ---

// GET / - List all society members (public)
router.get('/', societyController.getAll);

// GET /:id - Get society member by ID (public)
router.get('/:id', societyController.getById);

// --- Admin routes ---

// POST / - Create a new society member (admin only)
router.post(
  '/',
  auth,
  rbac('admin', 'super_admin'),
  sectionAccess('society', 'create'),
  societyController.create
);

// PATCH /:id - Update a society member (admin only)
router.patch(
  '/:id',
  auth,
  rbac('admin', 'super_admin'),
  sectionAccess('society', 'update'),
  societyController.update
);

// DELETE /:id - Delete a society member (admin only)
router.delete(
  '/:id',
  auth,
  rbac('admin', 'super_admin'),
  sectionAccess('society', 'delete'),
  societyController.remove
);

export default router;
