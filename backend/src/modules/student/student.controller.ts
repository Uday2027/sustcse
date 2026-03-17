import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth';
import * as studentService from './student.service';

/**
 * GET /api/students
 * Retrieve a paginated list of approved students with optional filters.
 */
export const getAll = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const session = req.query.session as string | undefined;
    const skills = req.query.skills as string | undefined;
    const jobSeeking = req.query.jobSeeking === 'true'
      ? true
      : req.query.jobSeeking === 'false'
        ? false
        : undefined;

    const result = await studentService.getStudents(page, limit, session, skills, jobSeeking);

    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/students/:id
 * Retrieve a single student profile by ID.
 */
export const getById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const data = await studentService.getStudentById(req.params.id);

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/students/profile
 * Update the authenticated user's own student profile.
 */
export const updateProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const data = await studentService.updateStudentProfile(req.user!.id, req.body);

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};


