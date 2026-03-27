import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth';
import * as approvalService from './approval.service';
import { createError } from '../../middleware/errorHandler';

/**
 * PATCH /api/applications/:id/admin-review
 */
export const adminReview = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { status, comment, approver_chain } = req.body;
    
    if (req.user!.role !== 'admin') {
      throw createError(403, 'Only admins can assign approval chains');
    }

    const result = await approvalService.adminReview(
      req.params.id,
      req.user!.id,
      status,
      comment,
      approver_chain
    );

    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/applications/:id/approve/:stepId
 */
export const approveStep = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { comment } = req.body;
    const { id: applicationId, stepId } = req.params;

    const result = await approvalService.approveStep(
      applicationId,
      stepId,
      req.user, // full user object with role and potentially designation from profiles
      comment
    );

    res.json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/applications/:id/reject/:stepId
 */
export const rejectStep = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { comment } = req.body;
    const { id: applicationId, stepId } = req.params;

    await approvalService.rejectStep(applicationId, stepId, req.user!.id, comment);

    res.json({ success: true, message: 'Application rejected' });
  } catch (error) {
    next(error);
  }
};
