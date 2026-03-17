import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import * as emailService from '../services/email.service';
import { createError } from '../middleware/errorHandler';

/**
 * POST /api/admin/email
 *
 * Send an email (single or bulk) using a template. Admin only.
 *
 * Body:
 * - to: string | string[]   (single recipient or array for bulk)
 * - subject: string
 * - template: string         (template name without .hbs extension)
 * - data: object             (template variables)
 */
export const sendEmail = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw createError(401, 'Authentication required');
    }

    const { to, subject, template, data } = req.body;

    if (!to || !subject || !template) {
      throw createError(400, 'Fields "to", "subject", and "template" are required');
    }

    // Bulk send if `to` is an array
    if (Array.isArray(to)) {
      if (to.length === 0) {
        throw createError(400, 'At least one recipient is required');
      }

      if (to.length > 500) {
        throw createError(400, 'Maximum 500 recipients allowed per bulk send');
      }

      const result = await emailService.sendBulkEmail(
        to,
        subject,
        template,
        data || {},
        req.user.id
      );

      return res.json({
        success: true,
        message: `Sent ${result.sent} of ${result.total} emails`,
        data: result,
      });
    }

    // Single send
    const logEntry = await emailService.sendEmail({
      to,
      subject,
      template,
      data: data || {},
      sentBy: req.user.id,
    });

    res.json({
      success: true,
      message: logEntry.status === 'sent' ? 'Email sent successfully' : 'Email sending failed',
      data: logEntry,
    });
  } catch (error) {
    next(error);
  }
};
