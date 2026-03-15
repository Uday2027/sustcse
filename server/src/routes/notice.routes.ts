import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { rbac } from '../middleware/rbac.js';
import { sectionAccess } from '../middleware/sectionAccess.js';
import * as noticeController from '../controllers/notice.controller.js';

const router = Router();

router.get('/', noticeController.getAll);
router.get('/:id', noticeController.getById);
router.post('/', auth, rbac('admin', 'super_admin'), sectionAccess('notices', 'create'), noticeController.create);
router.patch('/:id', auth, rbac('admin', 'super_admin'), sectionAccess('notices', 'update'), noticeController.update);
router.delete('/:id', auth, rbac('admin', 'super_admin'), sectionAccess('notices', 'delete'), noticeController.remove);

export default router;
