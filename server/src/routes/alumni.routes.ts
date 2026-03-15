import { Router } from 'express';
import { auth } from '../middleware/auth';
import { rbac } from '../middleware/rbac';
import { sectionAccess } from '../middleware/sectionAccess';
import * as alumniController from '../controllers/alumni.controller';

const router = Router();

// --- Public routes ---

// GET / - List all alumni (public)
router.get('/', alumniController.getAll);

// GET /:id - Get alumni by ID (public)
router.get('/:id', alumniController.getById);

// --- Admin routes ---

// POST /auto-add - Auto-add alumni from graduated students (admin only)
// NOTE: This must be registered before POST / to avoid route conflicts
router.post(
  '/auto-add',
  auth,
  rbac('admin', 'super_admin'),
  sectionAccess('alumni', 'create'),
  alumniController.autoAdd
);

// POST / - Create a new alumni record (admin only)
router.post(
  '/',
  auth,
  rbac('admin', 'super_admin'),
  sectionAccess('alumni', 'create'),
  alumniController.create
);

// PATCH /:id - Update an alumni record (admin only)
router.patch(
  '/:id',
  auth,
  rbac('admin', 'super_admin'),
  sectionAccess('alumni', 'update'),
  alumniController.update
);

// DELETE /:id - Delete an alumni record (admin only)
router.delete(
  '/:id',
  auth,
  rbac('admin', 'super_admin'),
  sectionAccess('alumni', 'delete'),
  alumniController.remove
);

export default router;
