import { Router } from 'express';
import { auth } from '../../middleware/auth';
import { rbac } from '../../middleware/rbac';
import * as adminController from './admin.controller';

const router = Router();

// ── Permissions ────────────────────────────────────────────────────────────
// GET  /permissions      — List all admin permissions (super_admin only)
router.get('/permissions', auth, rbac('super_admin'), adminController.getPermissions);
// POST /permissions      — Create or update an admin permission (super_admin only)
router.post('/permissions', auth, rbac('super_admin'), adminController.setPermission);
// DELETE /permissions   — Remove a permission entry (super_admin only)
router.delete('/permissions', auth, rbac('super_admin'), adminController.removePermission);

// ── Email Logs ─────────────────────────────────────────────────────────────
// GET  /email-logs       — List all email logs
router.get('/email-logs', auth, rbac('admin', 'super_admin'), adminController.getEmailLogs);

// ── Send Email ─────────────────────────────────────────────────────────────
// POST /send-email       — Send an email (single or bulk)
router.post('/send-email', auth, rbac('admin', 'super_admin'), adminController.sendEmail);

// ── Sessions Config ────────────────────────────────────────────────────────
// GET    /sessions       — List all sessions
router.get('/sessions', auth, rbac('super_admin'), adminController.getSessions);
// POST   /sessions       — Create a new session
router.post('/sessions', auth, rbac('super_admin'), adminController.createSession);
// PATCH  /sessions/:id   — Update a session
router.patch('/sessions/:id', auth, rbac('super_admin'), adminController.updateSession);

export default router;

