import { Router } from 'express';
import { auth } from '../../middleware/auth';
import { rbac } from '../../middleware/rbac';
import { sectionAccess } from '../../middleware/sectionAccess';
import * as societyController from './society.controller';

const router = Router();

router.get('/', societyController.getAll);
router.get('/:id', societyController.getById);
router.post('/', auth, rbac('admin', 'super_admin'), sectionAccess('society', 'create'), societyController.create);
router.patch('/:id', auth, rbac('admin', 'super_admin'), sectionAccess('society', 'update'), societyController.update);
router.delete('/:id', auth, rbac('admin', 'super_admin'), sectionAccess('society', 'delete'), societyController.remove);

export default router;

