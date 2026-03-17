import { Router } from 'express';
import { auth } from '../../middleware/auth';
import { rbac } from '../../middleware/rbac';
import { sectionAccess } from '../../middleware/sectionAccess';
import * as facultyController from './faculty.controller';

const router = Router();

router.get('/', facultyController.getAll);
router.get('/:id', facultyController.getById);
router.post('/', auth, rbac('admin', 'super_admin'), sectionAccess('faculty', 'create'), facultyController.create);
router.patch('/:id', auth, rbac('admin', 'super_admin'), sectionAccess('faculty', 'update'), facultyController.update);
router.delete('/:id', auth, rbac('admin', 'super_admin'), sectionAccess('faculty', 'delete'), facultyController.remove);

export default router;

