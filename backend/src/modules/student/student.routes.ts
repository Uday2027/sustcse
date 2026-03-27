import { Router } from 'express';
import { auth } from '../../middleware/auth';
import { rbac } from '../../middleware/rbac';
import { sectionAccess } from '../../middleware/sectionAccess';
import * as studentController from './student.controller';

const router = Router();

router.get('/', auth, studentController.getAll);
router.get('/profile', auth, studentController.getProfile);
router.patch('/profile', auth, studentController.updateProfile);
router.get('/:id', auth, studentController.getById);
export default router;

