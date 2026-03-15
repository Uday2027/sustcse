import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import * as alumniService from '../services/alumni.service';

/**
 * GET /api/alumni
 * Retrieve a paginated list of alumni with optional session and year filters.
 */
export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const session = req.query.session as string | undefined;
    const year = req.query.year as string | undefined;

    const result = await alumniService.getAlumni(page, limit, session, year);

    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/alumni/:id
 * Retrieve a single alumni record by ID.
 */
export const getById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await alumniService.getAlumniById(req.params.id);

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/alumni
 * Create a new alumni record. Requires authentication.
 */
export const create = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const data = await alumniService.createAlumni(req.body);

    res.status(201).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/alumni/:id
 * Update an existing alumni record. Requires authentication.
 */
export const update = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const data = await alumniService.updateAlumni(req.params.id, req.body);

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/alumni/:id
 * Delete an alumni record. Requires authentication.
 */
export const remove = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await alumniService.deleteAlumni(req.params.id);

    res.json({ success: true, message: 'Alumni record deleted successfully' });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/alumni/auto-add
 * Bulk-add alumni from a graduated session. Requires authentication.
 */
export const autoAdd = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: 'sessionId is required',
      });
    }

    const result = await alumniService.autoAddAlumni(sessionId);

    res.status(201).json({
      success: true,
      message: `Added ${result.added} alumni, skipped ${result.skipped} (already exist or no new students)`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
