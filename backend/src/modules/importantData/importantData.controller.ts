import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth';
import * as importantDataService from './importantData.service';

/**
 * GET /api/important-data
 * Retrieve a paginated list of important data entries.
 */
export const getAll = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const category = req.query.category as string | undefined;

    const result = await importantDataService.getAll(page, limit, category);

    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/important-data/:id
 * Retrieve a single important data entry by ID.
 */
export const getById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const data = await importantDataService.getById(req.params.id);

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/important-data
 * Create a new important data entry. Supports file upload via middleware.
 */
export const create = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const payload: Record<string, unknown> = { ...req.body };

    // If a file was uploaded via multer, attach the file URL
    if (req.file) {
      payload.file_url = (req.file as Express.Multer.File & { path?: string }).path || null;
    }

    const data = await importantDataService.create(payload);

    res.status(201).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/important-data/:id
 * Update an existing important data entry. Supports optional file upload.
 */
export const update = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const payload: Record<string, unknown> = { ...req.body };

    if (req.file) {
      payload.file_url = (req.file as Express.Multer.File & { path?: string }).path || null;
    }

    const data = await importantDataService.update(req.params.id, payload);

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/important-data/:id
 * Delete an important data entry.
 */
export const remove = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await importantDataService.remove(req.params.id);

    res.json({ success: true, message: 'Important data entry deleted successfully' });
  } catch (error) {
    next(error);
  }
};


