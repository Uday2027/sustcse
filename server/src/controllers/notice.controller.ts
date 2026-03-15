import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import * as noticeService from '../services/notice.service';

/**
 * GET /api/notices
 * Retrieve a paginated list of notices with optional filters.
 */
export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const category = req.query.category as string | undefined;
    const search = req.query.search as string | undefined;

    const result = await noticeService.getNotices(page, limit, category, search);

    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/notices/:id
 * Retrieve a single notice by ID.
 */
export const getById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await noticeService.getNoticeById(req.params.id);

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/notices
 * Create a new notice. Requires authentication.
 */
export const create = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const data = await noticeService.createNotice(req.body, req.user!.id);

    res.status(201).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/notices/:id
 * Update an existing notice. Requires authentication.
 */
export const update = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const data = await noticeService.updateNotice(req.params.id, req.body);

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/notices/:id
 * Delete a notice. Requires authentication.
 */
export const remove = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await noticeService.deleteNotice(req.params.id);

    res.json({ success: true, message: 'Notice deleted successfully' });
  } catch (error) {
    next(error);
  }
};
