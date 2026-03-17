import { Request, Response, NextFunction } from 'express';
import * as authService from './auth.service';
import { logger } from '../../utils/logger';

/**
 * POST /api/auth/register
 *
 * Register a new user account. SUST student emails are auto-approved;
 * all other accounts require admin approval.
 */
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { full_name, email, password, type, student_id, session_id, phone, whatsapp } = req.body;

    const result = await authService.register({
      full_name,
      email,
      password,
      type,
      student_id,
      session_id,
      phone,
      whatsapp,
    });

    res.status(201).json({
      success: true,
      message: result.requiresApproval
        ? 'Registration successful. Please verify your email. Your account also requires admin approval.'
        : 'Registration successful. Please check your email to verify your account.',
      data: result.user,
      requiresApproval: result.requiresApproval,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/login
 *
 * Authenticate a user with email and password.
 * Returns user profile and JWT session tokens.
 */
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    const result = await authService.login(email, password);

    logger.info('Login successful', { userId: result.user.id });

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: result.user,
        session: result.session,
      },
    });
  } catch (error) {
    next(error);
  }
};


