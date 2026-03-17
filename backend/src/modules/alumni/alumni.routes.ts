import { Router } from 'express';
import { auth } from '../../middleware/auth';
import { rbac } from '../../middleware/rbac';
import { sectionAccess } from '../../middleware/sectionAccess';
import * as alumniController from './alumni.controller';

const router = Router();

router.get('/', alumniController.getAll);
router.get('/:id', alumniController.getById);
router.post('/auto-add', auth, rbac('admin', 'super_admin'), sectionAccess('alumni', 'create'), alumniController.autoAdd);
router.post('/', auth, rbac('admin', 'super_admin'), sectionAccess('alumni', 'create'), alumniController.create);
router.patch('/:id', auth, rbac('admin', 'super_admin'), sectionAccess('alumni', 'update'), alumniController.update);
router.delete('/:id', auth, rbac('admin', 'super_admin'), sectionAccess('alumni', 'delete'), alumniController.remove);

export default router;

