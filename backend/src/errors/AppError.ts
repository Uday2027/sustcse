/**
 * Custom application error class.
 * All operational errors should use this class so the error handler
 * can produce specific, consistent error messages.
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly errorCode: string;
  public readonly isOperational: boolean;

  constructor(statusCode: number, message: string, errorCode: string = 'INTERNAL_ERROR') {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.isOperational = true;
    // Maintain proper stack trace in V8
    Error.captureStackTrace(this, this.constructor);
  }
}

// ─── Named factory helpers ───────────────────────────────────────────────────

export const notFound = (resource = 'Resource') =>
  new AppError(404, `${resource} not found`, 'NOT_FOUND');

export const unauthorized = (msg = 'Authentication required') =>
  new AppError(401, msg, 'UNAUTHORIZED');

export const forbidden = (msg = 'You do not have permission to perform this action') =>
  new AppError(403, msg, 'FORBIDDEN');

export const badRequest = (msg: string) =>
  new AppError(400, msg, 'BAD_REQUEST');

export const conflict = (msg: string) =>
  new AppError(409, msg, 'CONFLICT');

export const internalError = (msg = 'Internal server error') =>
  new AppError(500, msg, 'INTERNAL_ERROR');

/**
 * General-purpose factory used throughout services.
 * Prefer the named helpers above when possible for clarity.
 */
export const createError = (statusCode: number, message: string, errorCode?: string): AppError =>
  new AppError(statusCode, message, errorCode);
