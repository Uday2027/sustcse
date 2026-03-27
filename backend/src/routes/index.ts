import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes';
import userRoutes from '../modules/user/user.routes';
import noticeRoutes from '../modules/notice/notice.routes';
import eventRoutes from '../modules/event/event.routes';
import achievementRoutes from '../modules/achievement/achievement.routes';
import alumniRoutes from '../modules/alumni/alumni.routes';
import facultyRoutes from '../modules/faculty/faculty.routes';
import studentRoutes from '../modules/student/student.routes';
import societyRoutes from '../modules/society/society.routes';
import financeRoutes from '../modules/finance/finance.routes';
import importantDataRoutes from '../modules/importantData/importantData.routes';
import workAssignmentRoutes from '../modules/workAssignment/workAssignment.routes';
import adminRoutes from '../modules/admin/admin.routes';
import applicationRoutes from '../modules/application/application.routes';

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
router.use('/applications', applicationRoutes);

// Deprecated upload route (if the standalone upload routes file still exists).
// The individual modules now handle their own uploads.

export default router;
