import { Router } from 'express';
import { auth } from '../../middleware/auth';
import { rbac } from '../../middleware/rbac';
import { upload } from '../../middleware/upload';
import * as userController from './user.controller';

const router = Router();

// ── Own profile ─────────────────────────────────────────────────────────────
router.get('/me', auth, userController.getMe);
router.patch('/me', auth, userController.updateMe);
router.post('/me/avatar', auth, upload.single('avatar'), userController.uploadAvatar);

// ── Admin — user management ─────────────────────────────────────────────────
router.get('/', auth, rbac('admin', 'super_admin'), userController.getAll);
router.post('/bulk', auth, rbac('admin', 'super_admin'), userController.bulkCreate);
router.get('/:id', auth, rbac('admin', 'super_admin'), userController.getById);
router.patch('/:id', auth, rbac('admin', 'super_admin'), userController.updateUser);
router.post('/:id/approve', auth, rbac('admin', 'super_admin'), userController.approve);
router.post('/:id/reject', auth, rbac('admin', 'super_admin'), userController.reject);

export default router;

