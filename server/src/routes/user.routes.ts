import { Router } from 'express';
import { auth } from '../middleware/auth';
import { rbac } from '../middleware/rbac';
import { upload } from '../middleware/upload';
import * as userController from '../controllers/user.controller';

const router = Router();

// GET /me - Get current authenticated user's profile (auth only, no rbac)
router.get('/me', auth, userController.getMe);

// PATCH /me - Update own profile (auth only)
router.patch('/me', auth, userController.updateMe);

// POST /me/avatar - Upload avatar (auth only)
router.post('/me/avatar', auth, upload.single('avatar'), userController.uploadAvatar);

// GET / - List all users (admin only)
router.get('/', auth, rbac('admin', 'super_admin'), userController.getAll);

// POST /bulk - Bulk create users (admin only) — must come before /:id
router.post('/bulk', auth, rbac('admin', 'super_admin'), userController.bulkCreate);

// GET /:id - Get user by ID (admin only)
router.get('/:id', auth, rbac('admin', 'super_admin'), userController.getById);

// PATCH /:id - Update user by ID (admin only)
router.patch('/:id', auth, rbac('admin', 'super_admin'), userController.updateUser);

// POST /:id/approve - Approve user registration (admin only)
router.post('/:id/approve', auth, rbac('admin', 'super_admin'), userController.approve);

// POST /:id/reject - Reject user registration (admin only)
router.post('/:id/reject', auth, rbac('admin', 'super_admin'), userController.reject);

export default router;
