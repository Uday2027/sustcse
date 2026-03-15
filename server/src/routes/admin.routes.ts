import { Router } from 'express';
import { auth } from '../middleware/auth';
import { rbac } from '../middleware/rbac';
import * as adminController from '../controllers/admin.controller';

const router = Router();

// All admin routes require authentication and super_admin role

// =====================
// Permissions
// =====================

// GET /permissions - List all admin permissions
router.get(
  '/permissions',
  auth,
  rbac('super_admin'),
  adminController.getPermissions
);

// POST /permissions - Create or update admin permissions
router.post(
  '/permissions',
  auth,
  rbac('super_admin'),
  adminController.setPermission
);

// =====================
// Email Logs
// =====================

// GET /email-logs - List all email logs
router.get(
  '/email-logs',
  auth,
  rbac('admin', 'super_admin'),
  adminController.getEmailLogs
);

// =====================
// Send Email
// =====================

// POST /send-email - Send an email
router.post(
  '/send-email',
  auth,
  rbac('admin', 'super_admin'),
  adminController.sendEmail
);

// =====================
// Sessions
// =====================

// GET /sessions - List all session configurations
router.get(
  '/sessions',
  auth,
  rbac('super_admin'),
  adminController.getSessions
);

// POST /sessions - Create a new session configuration
router.post(
  '/sessions',
  auth,
  rbac('super_admin'),
  adminController.createSession
);

// PATCH /sessions/:id - Update a session configuration
router.patch(
  '/sessions/:id',
  auth,
  rbac('super_admin'),
  adminController.updateSession
);

export default router;
