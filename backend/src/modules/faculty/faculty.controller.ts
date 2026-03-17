import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth';
import * as facultyService from './faculty.service';

/**
 * GET /api/faculty
 * Retrieve all faculty members ordered by sort_order.
 */
export const getAll = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await facultyService.getFaculty();

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/faculty/:id
 * Retrieve a single faculty member by ID.
 */
export const getById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await facultyService.getFacultyById(req.params.id);

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/faculty
 * Create a new faculty member. Requires authentication.
 */
export const create = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const data = await facultyService.createFaculty(req.body);

    res.status(201).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/faculty/:id
 * Update an existing faculty member. Requires authentication.
 */
export const update = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const data = await facultyService.updateFaculty(req.params.id, req.body);

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/faculty/:id
 * Delete a faculty member. Requires authentication.
 */
export const remove = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await facultyService.deleteFaculty(req.params.id);

    res.json({ success: true, message: 'Faculty member deleted successfully' });
  } catch (error) {
    next(error);
  }
};


