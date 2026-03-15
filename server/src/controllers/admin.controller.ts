import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import * as adminService from '../services/admin.service';
import * as emailService from '../services/email.service';

// =====================
// Permissions
// =====================

/**
 * GET /api/admin/permissions
 * Retrieve all admin permissions, optionally filtered by userId.
 */
export const getPermissions = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.query.userId as string | undefined;
    const data = await adminService.getPermissions(userId);

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/admin/permissions
 * Create or update an admin permission entry.
 */
export const setPermission = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { userId, section, permissions } = req.body;

    if (!userId || !section || !permissions) {
      return res.status(400).json({
        success: false,
        message: 'userId, section, and permissions are required',
      });
    }

    const data = await adminService.setPermission(
      userId,
      section,
      permissions,
      req.user!.id
    );

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

// =====================
// Sessions Config
// =====================

/**
 * GET /api/admin/sessions
 * Retrieve all session configurations.
 */
export const getSessions = async (_req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const data = await adminService.getSessions();

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/admin/sessions
 * Create a new session configuration.
 */
export const createSession = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const data = await adminService.createSession(req.body);

    res.status(201).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/admin/sessions/:id
 * Update an existing session configuration.
 */
export const updateSession = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const data = await adminService.updateSession(req.params.id, req.body);

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

// =====================
// Email Logs
// =====================

export const getEmailLogs = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const status = req.query.status as string | undefined;
    const context = req.query.context as string | undefined;

    const result = await adminService.getEmailLogs(page, limit, status, context);
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

// =====================
// Send Email
// =====================

export const sendEmail = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { to, subject, template, data } = req.body;

    if (!to || !subject || !template) {
      return res.status(400).json({
        success: false,
        message: '"to", "subject", and "template" are required',
      });
    }

    if (Array.isArray(to)) {
      const result = await emailService.sendBulkEmail(to, subject, template, data || {}, req.user!.id);
      return res.json({ success: true, message: `Sent ${result.sent} of ${result.total} emails`, data: result });
    }

    const logEntry = await emailService.sendEmail({ to, subject, template, data: data || {}, sentBy: req.user!.id });
    res.json({ success: true, data: logEntry });
  } catch (error) {
    next(error);
  }
};
