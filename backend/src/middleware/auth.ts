import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../config/supabase';
import { createError } from './errorHandler';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const auth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      throw createError(401, 'No token provided');
    }

    const token = authHeader.split(' ')[1];
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) {
      throw createError(401, 'Invalid or expired token');
    }

    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('id, email, role, approval_status, is_active')
      .eq('id', user.id)
      .single();

    if (!profile) {
      throw createError(401, 'Profile not found');
    }

    if (!profile.is_active) {
      throw createError(403, 'Account is deactivated');
    }

    if (process.env.NODE_ENV !== 'development' && profile.approval_status !== 'approved') {
      throw createError(403, 'Account is not yet approved');
    }

    req.user = {
      id: profile.id,
      email: profile.email,
      role: profile.role,
    };

    next();
  } catch (error) {
    next(error);
  }
};
