import { Router, Request, Response, NextFunction } from 'express';
import * as authController from '../controllers/auth.controller.js';
import { supabaseAdmin } from '../config/supabase.js';
import { createError } from '../middleware/errorHandler.js';
import { logger } from '../utils/logger.js';
import { env } from '../config/env.js';
import * as emailService from '../services/email.service.js';
import { auth, AuthRequest } from '../middleware/auth.js';

const router = Router();

router.post('/register', authController.register);
router.post('/login', authController.login);

router.post('/verify-email', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token_hash, type } = req.body;
    if (!token_hash) throw createError(400, 'Verification token is required');

    const { error } = await supabaseAdmin.auth.verifyOtp({
      token_hash,
      type: type || 'email',
    });

    if (error) throw createError(400, error.message);

    res.json({ success: true, message: 'Email verified successfully' });
  } catch (error) {
    next(error);
  }
});

router.post('/forgot-password', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;
    if (!email) throw createError(400, 'Email is required');

    const { error } = await supabaseAdmin.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.CLIENT_URL}/reset-password`,
    });

    if (error) {
      logger.error('Password reset request failed', { email, error: error.message });
      throw createError(400, error.message);
    }

    res.json({ success: true, message: 'Password reset email sent. Check your inbox.' });
  } catch (error) {
    next(error);
  }
});

router.post('/reset-password', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { access_token, new_password } = req.body;
    if (!access_token || !new_password) {
      throw createError(400, 'Access token and new password are required');
    }
    if (new_password.length < 6) {
      throw createError(400, 'Password must be at least 6 characters');
    }

    // Use the access_token to identify the user
    const { data: { user }, error: getUserError } = await supabaseAdmin.auth.getUser(access_token);
    if (getUserError || !user) {
      throw createError(401, 'Invalid or expired reset token');
    }

    const { error } = await supabaseAdmin.auth.admin.updateUserById(user.id, {
      password: new_password,
    });

    if (error) throw createError(400, error.message);

    res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    next(error);
  }
});

router.post('/resend-verification', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;
    if (!email) throw createError(400, 'Email is required');

    // Check that the user exists and email is not already confirmed
    const { data: users, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    if (listError) throw createError(500, 'Failed to check user status');

    const authUser = users.users.find((u) => u.email === email);
    if (!authUser) throw createError(404, 'No account found with this email');

    if (authUser.email_confirmed_at) {
      return res.json({ success: true, message: 'Email is already verified. You can log in.' });
    }

    // Generate a new magic link
    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email,
    });

    if (linkError) {
      logger.error('Failed to generate verification link', { email, error: linkError.message });
      throw createError(400, linkError.message);
    }

    // Get user profile for the name
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('full_name')
      .eq('email', email)
      .single();

    const verificationUrl = `${env.CLIENT_URL}/verify-email?token=${linkData.properties?.hashed_token}&type=magiclink&email=${encodeURIComponent(email)}`;

    await emailService.sendEmail({
      to: email,
      subject: 'Verify Your Email — CSE SUST',
      template: 'verification',
      data: {
        name: profile?.full_name || 'User',
        verificationUrl,
      },
    });

    logger.info('Verification email resent', { email });
    res.json({ success: true, message: 'Verification email sent. Check your inbox.' });
  } catch (error) {
    next(error);
  }
});

router.post('/change-password', auth, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { current_password, new_password } = req.body;
    if (!current_password || !new_password) {
      throw createError(400, 'Current password and new password are required');
    }
    if (new_password.length < 6) {
      throw createError(400, 'New password must be at least 6 characters');
    }

    // Re-authenticate with current password
    const { error: signInError } = await supabaseAdmin.auth.signInWithPassword({
      email: req.user!.email,
      password: current_password,
    });
    if (signInError) {
      throw createError(401, 'Current password is incorrect');
    }

    // Update password
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(req.user!.id, {
      password: new_password,
    });
    if (updateError) throw createError(400, updateError.message);

    res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
