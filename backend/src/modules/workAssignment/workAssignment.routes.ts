import { Router } from 'express';
import { auth } from '../../middleware/auth';
import { rbac } from '../../middleware/rbac';
import { sectionAccess } from '../../middleware/sectionAccess';
import * as workAssignmentController from './workAssignment.controller';

const router = Router();

router.get('/', auth, workAssignmentController.getAll);
router.get('/:id', auth, workAssignmentController.getById);
router.post('/', auth, rbac('admin', 'super_admin'), sectionAccess('work_assignments', 'create'), workAssignmentController.create);
router.patch('/:id', auth, rbac('admin', 'super_admin'), sectionAccess('work_assignments', 'update'), workAssignmentController.update);
router.delete('/:id', auth, rbac('admin', 'super_admin'), sectionAccess('work_assignments', 'delete'), workAssignmentController.remove);
router.post('/:id/complete', auth, workAssignmentController.markComplete);

export default router;

