import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth';
import * as applicationService from './application.service';
import { createError } from '../../middleware/errorHandler';

/**
 * POST /api/applications
 * Student submits application via form (no PDF upload required).
 * Optional file attachments can be uploaded.
 */
export const submit = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { title, to, to_teacher_id, medium_teacher_id, body, department_name } = req.body;

    if (!title || !to || !body) {
      throw createError(400, 'Title, recipient (to), and body are required');
    }

    const files = req.files as Express.Multer.File[] | undefined;
    const attachments = files
      ? files.map(f => ({ buffer: f.buffer, originalname: f.originalname }))
      : [];

    const u = req.user as any;
    const student = {
      id: u.id,
      full_name: u.full_name || u.email,
      student_id: u.student_id,
      session: u.session_id,
    };

    const data = await applicationService.createApplication(
      { 
        title, 
        to, 
        toTeacherId: to_teacher_id, 
        mediumTeacherId: medium_teacher_id, 
        body, 
        departmentName: department_name 
      },
      student,
      attachments
    );

    res.status(201).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/applications
 * List applications filtered by user role.
 */
export const list = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const data = await applicationService.getApplications(req.user!.role, req.user!.id);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/applications/:id
 * Get detailed application view with approval chain and attachments.
 */
export const detail = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const data = await applicationService.getApplicationById(req.params.id);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};
