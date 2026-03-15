import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { rbac } from '../middleware/rbac.js';
import { sectionAccess } from '../middleware/sectionAccess.js';
import * as eventController from '../controllers/event.controller.js';

const router = Router();

router.get('/', eventController.getAll);
router.get('/:id', eventController.getById);
router.post('/', auth, rbac('admin', 'super_admin'), sectionAccess('events', 'create'), eventController.create);
router.patch('/:id', auth, rbac('admin', 'super_admin'), sectionAccess('events', 'update'), eventController.update);
router.delete('/:id', auth, rbac('admin', 'super_admin'), sectionAccess('events', 'delete'), eventController.remove);

export default router;
