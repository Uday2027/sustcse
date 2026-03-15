import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';
import { createError } from './errorHandler';

export const rbac = (...allowedRoles: string[]) => {
  return (req: AuthRequest, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(createError(401, 'Authentication required'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(createError(403, 'Insufficient permissions'));
    }

    next();
  };
};
