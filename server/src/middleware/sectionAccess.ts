import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';
import { supabaseAdmin } from '../config/supabase';
import { createError } from './errorHandler';

export const sectionAccess = (section: string, operation: 'create' | 'read' | 'update' | 'delete' = 'read') => {
  return async (req: AuthRequest, _res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return next(createError(401, 'Authentication required'));
      }

      // Super admins bypass section checks
      if (req.user.role === 'super_admin') {
        return next();
      }

      // Regular admins have full access
      if (req.user.role === 'admin') {
        const { data: permission } = await supabaseAdmin
          .from('admin_permissions')
          .select('*')
          .eq('user_id', req.user.id)
          .eq('section', section)
          .single();

        if (!permission) {
          return next(createError(403, `No access to ${section} section`));
        }

        const operationField = `can_${operation}` as keyof typeof permission;
        if (!permission[operationField]) {
          return next(createError(403, `No ${operation} permission for ${section}`));
        }
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
