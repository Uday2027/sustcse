import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';
import { logger } from '../utils/logger';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  // Operational errors: use AppError fields directly
  if (err instanceof AppError) {
    logger.warn(`[${err.errorCode}] ${err.statusCode} - ${err.message}`, {
      path: req.path,
      method: req.method,
    });

    return res.status(err.statusCode).json({
      success: false,
      errorCode: err.errorCode,
      message: err.message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
  }

  // Unexpected (programmer) errors: log full stack and return generic message
  logger.error(`[UNHANDLED] ${err.message}`, {
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  return res.status(500).json({
    success: false,
    errorCode: 'INTERNAL_ERROR',
    message: 'An unexpected error occurred. Please try again later.',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

// Re-export createError for backward compatibility
export { AppError, createError } from '../errors/AppError';
