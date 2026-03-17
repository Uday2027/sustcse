import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth';
import * as workAssignmentService from './workAssignment.service';

/**
 * GET /api/work-assignments
 * Retrieve a paginated list of work assignments with optional filters.
 */
export const getAll = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const status = req.query.status as string | undefined;
    const priority = req.query.priority as string | undefined;
    const assignedTo = req.query.assignedTo as string | undefined;

    const result = await workAssignmentService.getAssignments(
      page,
      limit,
      status,
      priority,
      assignedTo
    );

    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/work-assignments/:id
 * Retrieve a single work assignment by ID.
 */
export const getById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const data = await workAssignmentService.getAssignmentById(req.params.id);

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/work-assignments
 * Create a new work assignment.
 */
export const create = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const data = await workAssignmentService.createAssignment(req.body, req.user!.id);

    res.status(201).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/work-assignments/:id
 * Update an existing work assignment.
 */
export const update = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const data = await workAssignmentService.updateAssignment(req.params.id, req.body);

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/work-assignments/:id
 * Delete a work assignment.
 */
export const remove = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await workAssignmentService.deleteAssignment(req.params.id);

    res.json({ success: true, message: 'Work assignment deleted successfully' });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/work-assignments/:id/complete
 * Mark a work assignment as completed.
 */
export const markComplete = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const data = await workAssignmentService.updateAssignment(req.params.id, { status: 'completed' });

    res.json({ success: true, message: 'Work assignment marked as completed', data });
  } catch (error) {
    next(error);
  }
};


