import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';
import { supabaseAdmin } from '../config/supabase';
import { createError } from './errorHandler';

/**
 * sectionAccess middleware.
 *
 * Access logic:
 *  - super_admin → always allowed
 *  - admin       → must have an admin_permissions row for the section + operation
 *  - regular user→ must also have an admin_permissions row (admin can delegate
 *                  specific operations to any user, e.g. finance.can_create for
 *                  cost requests, notices.can_create for notice posting)
 */
export const sectionAccess = (section: string, operation: 'create' | 'read' | 'update' | 'delete' = 'read') => {
  return async (req: AuthRequest, _res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return next(createError(401, 'Authentication required', 'UNAUTHORIZED'));
      }

      // Super admins bypass all section checks
      if (req.user.role === 'super_admin') {
        return next();
      }

      // All other roles (admin, teacher, student, etc.) must have an explicit permission row
      const { data: permission } = await supabaseAdmin
        .from('admin_permissions')
        .select('can_create, can_read, can_update, can_delete')
        .eq('user_id', req.user.id)
        .eq('section', section)
        .single();

      if (!permission) {
        return next(
          createError(
            403,
            `You do not have access to the '${section}' section`,
            'FORBIDDEN'
          )
        );
      }

      const operationField = `can_${operation}` as keyof typeof permission;
      if (!permission[operationField]) {
        return next(
          createError(
            403,
            `You do not have '${operation}' permission for '${section}'`,
            'FORBIDDEN'
          )
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
