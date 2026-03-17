import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth';
import * as userService from './user.service';
import * as authService from '../auth/auth.service';
import * as cloudinaryService from '../../services/cloudinary.service';
import { CLOUDINARY_FOLDERS } from '../../config/constants';
import { createError } from '../../middleware/errorHandler';
import { logger } from '../../utils/logger';

/**
 * GET /api/users/me
 *
 * Return the authenticated user's full profile, including session and student data.
 */
export const getMe = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw createError(401, 'Authentication required');
    }

    const profile = await userService.getUserById(req.user.id);

    res.json({
      success: true,
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/users/me
 *
 * Update the authenticated user's own profile fields.
 */
export const updateMe = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw createError(401, 'Authentication required');
    const updatedProfile = await userService.updateUser(req.user.id, req.body);
    res.json({ success: true, message: 'Profile updated', data: updatedProfile });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/users/me/avatar
 *
 * Upload a new avatar image for the authenticated user.
 */
export const uploadAvatar = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw createError(401, 'Authentication required');
    if (!req.file) throw createError(400, 'No image file provided');

    // Delete old avatar from Cloudinary if exists
    const currentProfile = await userService.getUserById(req.user.id);
    if (currentProfile.avatar_url) {
      try {
        const urlParts = currentProfile.avatar_url.split('/');
        const uploadIdx = urlParts.indexOf('upload');
        if (uploadIdx !== -1) {
          const publicIdWithExt = urlParts.slice(uploadIdx + 2).join('/');
          const publicId = publicIdWithExt.replace(/\.[^/.]+$/, '');
          await cloudinaryService.deleteFile(publicId);
        }
      } catch {
        logger.warn('Failed to delete old avatar', { userId: req.user.id });
      }
    }

    const result = await cloudinaryService.uploadImage(req.file.buffer, CLOUDINARY_FOLDERS.AVATARS);
    await userService.updateUser(req.user.id, { avatar_url: result.secure_url });

    res.json({ success: true, message: 'Avatar uploaded', data: { avatar_url: result.secure_url } });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/users
 *
 * List all users with pagination and filters. Admin only.
 * Query params: page, limit, role, approval_status, session_id, search, is_active
 */
export const getAll = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const {
      page,
      limit,
      role,
      approval_status,
      session_id,
      search,
      is_active,
    } = req.query;

    const result = await userService.getUsers({
      page: page ? parseInt(page as string, 10) : undefined,
      limit: limit ? parseInt(limit as string, 10) : undefined,
      role: role as string | undefined,
      approval_status: approval_status as string | undefined,
      session_id: session_id as string | undefined,
      search: search as string | undefined,
      is_active: is_active !== undefined ? is_active === 'true' : undefined,
    });

    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/users/:id
 *
 * Get a single user by ID. Admin only.
 */
export const getById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const profile = await userService.getUserById(id);

    res.json({
      success: true,
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/users/:id
 *
 * Update user profile fields. Admin only.
 */
export const updateUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const updatedProfile = await userService.updateUser(id, req.body);

    res.json({
      success: true,
      message: 'User updated successfully',
      data: updatedProfile,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/users/:id/approve
 *
 * Approve a pending user registration. Admin only.
 */
export const approve = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw createError(401, 'Authentication required');
    }

    const { id } = req.params;
    await authService.approveUser(id, req.user.id);

    res.json({
      success: true,
      message: 'User approved successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/users/:id/reject
 *
 * Reject a pending user registration. Admin only.
 */
export const reject = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw createError(401, 'Authentication required');
    }

    const { id } = req.params;
    const { reason } = req.body;
    await authService.rejectUser(id, req.user.id, reason);

    res.json({
      success: true,
      message: 'User rejected successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/users/bulk
 *
 * Create multiple users at once via the admin API. Admin only.
 * Body: { users: Array<{ full_name, email, password, type, student_id?, session_id?, phone? }> }
 */
export const bulkCreate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { users } = req.body;

    if (!Array.isArray(users) || users.length === 0) {
      throw createError(400, 'A non-empty array of users is required');
    }

    if (users.length > 100) {
      throw createError(400, 'Maximum 100 users can be created at once');
    }

    const result = await userService.bulkCreateUsers(users);

    res.status(201).json({
      success: true,
      message: `Created ${result.successful.length} of ${users.length} users`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};


