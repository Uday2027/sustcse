import { supabaseAdmin } from '../../config/supabase';
import { SUST_EMAIL_REGEX } from '../../config/constants';
import { createError } from '../../middleware/errorHandler';
import { logger } from '../../utils/logger';
import { env } from '../../config/env';
import * as emailService from '../../services/email.service';

interface RegisterData {
  full_name: string;
  email: string;
  password: string;
  type: 'student' | 'teacher';
  student_id?: string;
  session_id?: string;
  phone?: string;
  whatsapp?: string;
}

interface RegisterResult {
  user: Record<string, unknown>;
  requiresApproval: boolean;
}

/**
 * Register a new user via Supabase Auth and configure their profile.
 *
 * SUST student emails matching the institutional pattern are auto-approved.
 * All other accounts (non-SUST emails, teachers) require manual approval.
 */
export const register = async (data: RegisterData): Promise<RegisterResult> => {
  const { full_name, email, password, type, student_id, session_id, phone, whatsapp } = data;

  const isSustEmail = SUST_EMAIL_REGEX.test(email);
  const role = type === 'teacher' ? 'teacher' : 'student';

  // Check for existing student_id before creating auth user
  if (student_id) {
    const { data: existing } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('student_id', student_id)
      .maybeSingle();

    if (existing) {
      throw createError(400, 'A user with this student ID already exists');
    }
  }

  // Create user in Supabase Auth
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: false, // All users must verify email
    user_metadata: {
      full_name,
      role,
      student_id,
      session_id,
      phone,
    },
  });

  if (authError) {
    logger.error('Auth signup failed', { email, error: authError.message, code: authError.code, status: authError.status });
    throw createError(400, authError.message);
  }

  if (!authData.user) {
    throw createError(500, 'User creation failed unexpectedly');
  }

  const userId = authData.user.id;
  // In development, auto-approve all accounts. In production, only SUST emails.
  const approvalStatus = (env.NODE_ENV === 'development' || isSustEmail) ? 'approved' : 'pending';

  // Create the profile record directly (no trigger dependency)
  const { error: profileError } = await supabaseAdmin
    .from('profiles')
    .upsert({
      id: userId,
      email,
      full_name,
      role,
      student_id: student_id || null,
      phone: phone || null,
      session_id: session_id || null,
      whatsapp: whatsapp || null,
      is_sust_email: isSustEmail,
      approval_status: approvalStatus,
      ...(isSustEmail && {
        approved_at: new Date().toISOString(),
      }),
    }, { onConflict: 'id' });

  if (profileError) {
    logger.error('Profile update failed after signup', {
      userId,
      error: profileError.message,
    });
    // Rollback: delete the auth user since profile setup failed
    await supabaseAdmin.auth.admin.deleteUser(userId);
    throw createError(500, 'Failed to set up user profile');
  }

  logger.info('User registered successfully', {
    userId,
    email,
    role,
    approvalStatus,
  });

  // Send verification email to ALL users (non-blocking)
  try {
    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email,
    });

    if (linkError) {
      logger.error('Failed to generate verification link', { email, error: linkError.message });
    } else {
      const verificationUrl = `${env.CLIENT_URL}/verify-email?token=${linkData.properties?.hashed_token}&type=magiclink&email=${encodeURIComponent(email)}`;

      logger.info('Sending verification email', { email, verificationUrl });

      await emailService.sendEmail({
        to: email,
        subject: 'Verify Your Email — CSE SUST',
        template: 'verification',
        data: {
          name: full_name,
          verificationUrl,
        },
      });
    }
  } catch (emailErr) {
    logger.error('Post-registration email failed to send', {
      email,
      error: emailErr instanceof Error ? emailErr.message : 'Unknown error',
    });
  }

  return {
    user: {
      id: userId,
      email,
      full_name,
      role,
      approval_status: approvalStatus,
    },
    requiresApproval: approvalStatus === 'pending',
  };
};

/**
 * Authenticate a user with email and password.
 *
 * Checks that the account is active and approved before returning the session.
 */
export const login = async (
  email: string,
  password: string
): Promise<{ user: Record<string, unknown>; session: Record<string, unknown> }> => {
  const { data: authData, error: authError } = await supabaseAdmin.auth.signInWithPassword({
    email,
    password,
  });

  if (authError) {
    logger.warn('Login failed', { email, error: authError.message });
    throw createError(401, 'Invalid email or password');
  }

  if (!authData.user || !authData.session) {
    throw createError(401, 'Authentication failed');
  }

  // Check if email is verified
  if (!authData.user.email_confirmed_at) {
    throw createError(403, 'Please verify your email before logging in.');
  }

  // Fetch the profile to check approval and active status
  const { data: profile, error: profileError } = await supabaseAdmin
    .from('profiles')
    .select('id, email, full_name, role, approval_status, is_active, avatar_url')
    .eq('id', authData.user.id)
    .single();

  if (profileError || !profile) {
    throw createError(401, 'User profile not found');
  }

  if (!profile.is_active) {
    throw createError(403, 'Your account has been deactivated. Please contact an administrator.');
  }

  if (env.NODE_ENV !== 'development' && profile.approval_status === 'pending') {
    throw createError(403, 'Your account is pending approval. Please wait for an administrator to approve your registration.');
  }

  if (profile.approval_status === 'rejected') {
    throw createError(403, 'Your account registration was rejected. Please contact an administrator for more information.');
  }

  logger.info('User logged in', { userId: profile.id, email });

  return {
    user: {
      id: profile.id,
      email: profile.email,
      full_name: profile.full_name,
      role: profile.role,
      avatar_url: profile.avatar_url,
      approval_status: profile.approval_status,
    },
    session: {
      access_token: authData.session.access_token,
      refresh_token: authData.session.refresh_token,
      expires_at: authData.session.expires_at,
    },
  };
};

/**
 * Approve a pending user registration.
 */
export const approveUser = async (userId: string, approvedBy: string): Promise<void> => {
  // Verify the target user exists and is pending
  const { data: profile, error: fetchError } = await supabaseAdmin
    .from('profiles')
    .select('id, approval_status, email, full_name')
    .eq('id', userId)
    .single();

  if (fetchError || !profile) {
    throw createError(404, 'User not found');
  }

  if (profile.approval_status === 'approved') {
    throw createError(400, 'User is already approved');
  }

  const { error: updateError } = await supabaseAdmin
    .from('profiles')
    .update({
      approval_status: 'approved',
      approved_by: approvedBy,
      approved_at: new Date().toISOString(),
    })
    .eq('id', userId);

  if (updateError) {
    logger.error('Failed to approve user', { userId, error: updateError.message });
    throw createError(500, 'Failed to approve user');
  }

  logger.info('User approved', { userId, approvedBy });
};

/**
 * Reject a pending user registration with an optional reason.
 */
export const rejectUser = async (
  userId: string,
  rejectedBy: string,
  reason?: string
): Promise<void> => {
  const { data: profile, error: fetchError } = await supabaseAdmin
    .from('profiles')
    .select('id, approval_status, email, full_name')
    .eq('id', userId)
    .single();

  if (fetchError || !profile) {
    throw createError(404, 'User not found');
  }

  if (profile.approval_status === 'rejected') {
    throw createError(400, 'User is already rejected');
  }

  const { error: updateError } = await supabaseAdmin
    .from('profiles')
    .update({
      approval_status: 'rejected',
      approved_by: rejectedBy,
      approved_at: new Date().toISOString(),
      rejection_reason: reason || null,
    })
    .eq('id', userId);

  if (updateError) {
    logger.error('Failed to reject user', { userId, error: updateError.message });
    throw createError(500, 'Failed to reject user');
  }

  logger.info('User rejected', { userId, rejectedBy, reason });
};

