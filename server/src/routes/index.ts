import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import noticeRoutes from './notice.routes';
import eventRoutes from './event.routes';
import achievementRoutes from './achievement.routes';
import alumniRoutes from './alumni.routes';
import facultyRoutes from './faculty.routes';
import studentRoutes from './student.routes';
import societyRoutes from './society.routes';
import financeRoutes from './finance.routes';
import importantDataRoutes from './importantData.routes';
import workAssignmentRoutes from './workAssignment.routes';
import adminRoutes from './admin.routes';
import uploadRoutes from './upload.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/notices', noticeRoutes);
router.use('/events', eventRoutes);
router.use('/achievements', achievementRoutes);
router.use('/alumni', alumniRoutes);
router.use('/faculty', facultyRoutes);
router.use('/students', studentRoutes);
router.use('/society-members', societyRoutes);
router.use('/finance', financeRoutes);
router.use('/important-data', importantDataRoutes);
router.use('/work-assignments', workAssignmentRoutes);
router.use('/admin', adminRoutes);
router.use('/upload', uploadRoutes);

export default router;
