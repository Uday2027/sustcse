import { Router } from 'express';
import { auth } from '../middleware/auth';
import { rbac } from '../middleware/rbac';
import { sectionAccess } from '../middleware/sectionAccess';
import * as facultyController from '../controllers/faculty.controller';

const router = Router();

// --- Public routes ---

// GET / - List all faculty members (public)
router.get('/', facultyController.getAll);

// GET /:id - Get faculty member by ID (public)
router.get('/:id', facultyController.getById);

// --- Admin routes ---

// POST / - Create a new faculty member (admin only)
router.post(
  '/',
  auth,
  rbac('admin', 'super_admin'),
  sectionAccess('faculty', 'create'),
  facultyController.create
);

// PATCH /:id - Update a faculty member (admin only)
router.patch(
  '/:id',
  auth,
  rbac('admin', 'super_admin'),
  sectionAccess('faculty', 'update'),
  facultyController.update
);

// DELETE /:id - Delete a faculty member (admin only)
router.delete(
  '/:id',
  auth,
  rbac('admin', 'super_admin'),
  sectionAccess('faculty', 'delete'),
  facultyController.remove
);

export default router;
