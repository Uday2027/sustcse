import { Router } from 'express';
import { auth } from '../../middleware/auth';
import { rbac } from '../../middleware/rbac';
import { sectionAccess } from '../../middleware/sectionAccess';
import * as achievementController from './achievement.controller';

const router = Router();

router.get('/', achievementController.getAll);
router.get('/:id', achievementController.getById);
router.post('/', auth, rbac('admin', 'super_admin'), sectionAccess('achievements', 'create'), achievementController.create);
router.patch('/:id', auth, rbac('admin', 'super_admin'), sectionAccess('achievements', 'update'), achievementController.update);
router.delete('/:id', auth, rbac('admin', 'super_admin'), sectionAccess('achievements', 'delete'), achievementController.remove);

export default router;

