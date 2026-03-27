import { Router } from 'express';
import multer from 'multer';
import { auth } from '../../middleware/auth';
import * as applicationController from './application.controller';
import approvalRoutes from '../approval/approval.routes';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// All routes require authentication
router.use(auth);

/**
 * @route POST /api/applications
 * @desc Submit a new application (form data + optional attachments)
 * @access Student
 */
router.post('/', upload.array('attachments', 5), applicationController.submit);

/**
 * @route GET /api/applications
 * @desc List applications (Student: own, Admin: all, Teacher: assigned)
 * @access All
 */
router.get('/', applicationController.list);

/**
 * @route GET /api/applications/:id
 * @desc Get application details, approval chain, and attachments
 * @access All participants
 */
router.get('/:id', applicationController.detail);

// Mount approval sub-routes
router.use('/:id', approvalRoutes);

export default router;
