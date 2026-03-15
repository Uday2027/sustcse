import { Router } from 'express';
import { auth } from '../middleware/auth';
import { rbac } from '../middleware/rbac';
import { sectionAccess } from '../middleware/sectionAccess';
import { upload } from '../middleware/upload';
import * as importantDataController from '../controllers/importantData.controller';

const router = Router();

// --- Authenticated routes (any logged-in user can read) ---

// GET / - List all important data entries
router.get('/', auth, importantDataController.getAll);

// GET /:id - Get important data entry by ID
router.get('/:id', auth, importantDataController.getById);

// --- Admin routes ---

// POST / - Create a new important data entry with file upload
router.post(
  '/',
  auth,
  rbac('admin', 'super_admin'),
  sectionAccess('important_data', 'create'),
  upload.single('file'),
  importantDataController.create
);

// PATCH /:id - Update an important data entry with optional file upload
router.patch(
  '/:id',
  auth,
  rbac('admin', 'super_admin'),
  sectionAccess('important_data', 'update'),
  upload.single('file'),
  importantDataController.update
);

// DELETE /:id - Delete an important data entry
router.delete(
  '/:id',
  auth,
  rbac('admin', 'super_admin'),
  sectionAccess('important_data', 'delete'),
  importantDataController.remove
);

export default router;
