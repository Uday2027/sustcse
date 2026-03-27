import { Router } from 'express';
import { auth } from '../../middleware/auth';
import * as approvalController from './approval.controller';

const router = Router({ mergeParams: true });

router.use(auth);

/**
 * @route PATCH /api/applications/:id/admin-review
 * @desc Admin reviews and assigns chain
 * @access Admin
 */
router.patch('/admin-review', approvalController.adminReview);

/**
 * @route POST /api/applications/:id/approve/:stepId
 * @desc Teacher signs and approves a step
 * @access Teacher
 */
router.post('/approve/:stepId', approvalController.approveStep);

/**
 * @route POST /api/applications/:id/reject/:stepId
 * @desc Teacher rejects a step
 * @access Teacher
 */
router.post('/reject/:stepId', approvalController.rejectStep);

export default router;
