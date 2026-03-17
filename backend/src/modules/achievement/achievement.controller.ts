import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth';
import * as achievementService from './achievement.service';

/**
 * GET /api/achievements
 * Retrieve a paginated list of achievements with optional category filter.
 */
export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const category = req.query.category as string | undefined;

    const result = await achievementService.getAchievements(page, limit, category);

    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/achievements/:id
 * Retrieve a single achievement by ID.
 */
export const getById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await achievementService.getAchievementById(req.params.id);

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/achievements
 * Create a new achievement. Requires authentication.
 */
export const create = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const data = await achievementService.createAchievement(req.body);

    res.status(201).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/achievements/:id
 * Update an existing achievement. Requires authentication.
 */
export const update = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const data = await achievementService.updateAchievement(req.params.id, req.body);

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/achievements/:id
 * Delete an achievement. Requires authentication.
 */
export const remove = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await achievementService.deleteAchievement(req.params.id);

    res.json({ success: true, message: 'Achievement deleted successfully' });
  } catch (error) {
    next(error);
  }
};


