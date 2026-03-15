import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import * as societyService from '../services/society.service';

/**
 * GET /api/society
 * Retrieve a paginated list of society members with optional filters.
 */
export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const status = req.query.status as string | undefined;
    const year = req.query.year as string | undefined;

    const result = await societyService.getMembers(page, limit, status, year);

    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/society/:id
 * Retrieve a single society member by ID.
 */
export const getById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await societyService.getMemberById(req.params.id);

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/society
 * Create a new society member. Requires authentication.
 */
export const create = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const data = await societyService.createMember(req.body);

    res.status(201).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/society/:id
 * Update an existing society member. Requires authentication.
 */
export const update = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const data = await societyService.updateMember(req.params.id, req.body);

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/society/:id
 * Delete a society member. Requires authentication.
 */
export const remove = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await societyService.deleteMember(req.params.id);

    res.json({ success: true, message: 'Society member deleted successfully' });
  } catch (error) {
    next(error);
  }
};
