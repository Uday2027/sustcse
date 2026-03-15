import { Router } from 'express';
import { auth } from '../middleware/auth';
import { rbac } from '../middleware/rbac';
import { sectionAccess } from '../middleware/sectionAccess';
import * as workAssignmentController from '../controllers/workAssignment.controller';

const router = Router();

// --- Authenticated routes (any logged-in user can view and update status) ---

// GET / - List all work assignments
router.get('/', auth, workAssignmentController.getAll);

// GET /:id - Get work assignment by ID
router.get('/:id', auth, workAssignmentController.getById);

// PATCH /:id - Update a work assignment (status change by assignee, full update by admin)
router.patch('/:id', auth, workAssignmentController.update);

// --- Admin routes ---

// POST / - Create a new work assignment
router.post(
  '/',
  auth,
  rbac('admin', 'super_admin'),
  sectionAccess('work_assignments', 'create'),
  workAssignmentController.create
);

// DELETE /:id - Delete a work assignment
router.delete(
  '/:id',
  auth,
  rbac('admin', 'super_admin'),
  sectionAccess('work_assignments', 'delete'),
  workAssignmentController.remove
);

export default router;
