import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import * as eventService from '../services/event.service';

/**
 * GET /api/events
 * Retrieve a paginated list of events with optional filters.
 */
export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const upcoming = req.query.upcoming === 'true';
    const type = req.query.type as string | undefined;

    const result = await eventService.getEvents(page, limit, upcoming || undefined, type);

    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/events/:id
 * Retrieve a single event by ID.
 */
export const getById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await eventService.getEventById(req.params.id);

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/events
 * Create a new event. Requires authentication.
 */
export const create = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const data = await eventService.createEvent(req.body);

    res.status(201).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/events/:id
 * Update an existing event. Requires authentication.
 */
export const update = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const data = await eventService.updateEvent(req.params.id, req.body);

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/events/:id
 * Delete an event. Requires authentication.
 */
export const remove = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await eventService.deleteEvent(req.params.id);

    res.json({ success: true, message: 'Event deleted successfully' });
  } catch (error) {
    next(error);
  }
};
