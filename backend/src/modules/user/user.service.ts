import { supabaseAdmin } from '../../config/supabase';
import { createError } from '../../middleware/errorHandler';
import { getPagination, formatPaginatedResponse } from '../../utils/pagination';
import { logger } from '../../utils/logger';

/**
 * Fetch a single user by ID with their profile, session, and student profile data.
 */
export const getUserById = async (id: string) => {
  const { data: profile, error } = await supabaseAdmin
    .from('profiles')
    .select(`
      *,
      session:sessions_config (
        id,
        session_name,
        start_year,
        end_year
      ),
      student_profile:student_profiles!student_profiles_user_id_fkey (
        id,
        headline,
        about,
        cgpa,
        github_url,
        linkedin_url,
        portfolio_url,
        resume_url,
        skills,
        is_looking_for_job
      )
    `)
    .eq('id', id)
    .single();

  if (error || !profile) {
    logger.error('Failed to fetch user by ID', { id, error: error?.message });
    throw createError(404, 'User not found');
  }

  return profile;
};

interface GetUsersFilters {
  page?: number;
  limit?: number;
  role?: string;
  approval_status?: string;
  session_id?: string;
  search?: string;
  is_active?: boolean;
}

/**
 * List users with pagination and filtering capabilities.
 */
export const getUsers = async (filters: GetUsersFilters) => {
  const {
    page = 1,
    limit = 10,
    role,
    approval_status,
    session_id,
    search,
    is_active,
  } = filters;

  const { from, to } = getPagination(page, limit);

  let query = supabaseAdmin
    .from('profiles')
    .select(
      'id, email, full_name, role, student_id, phone, avatar_url, approval_status, is_active, is_sust_email, session_id, created_at',
      { count: 'exact' }
    )
    .order('created_at', { ascending: false })
    .range(from, to);

  if (role) {
    query = query.eq('role', role);
  }

  if (approval_status) {
    query = query.eq('approval_status', approval_status);
  }

  if (session_id) {
    query = query.eq('session_id', session_id);
  }

  if (typeof is_active === 'boolean') {
    query = query.eq('is_active', is_active);
  }

  if (search) {
    query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%,student_id.ilike.%${search}%`);
  }

  const { data, error, count } = await query;

  if (error) {
    logger.error('Failed to fetch users', { error: error.message, filters });
    throw createError(500, 'Failed to fetch users');
  }

  return formatPaginatedResponse(data || [], count || 0, page, limit);
};

/**
 * Update profile fields for a user by ID.
 */
export const updateUser = async (id: string, data: Record<string, unknown>) => {
  // Prevent updating sensitive fields directly
  const {
    id: _id,
    email: _email,
    role: _role,
    approval_status: _approvalStatus,
    approved_by: _approvedBy,
    approved_at: _approvedAt,
    ...safeData
  } = data;

  const { data: updatedProfile, error } = await supabaseAdmin
    .from('profiles')
    .update({
      ...safeData,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    logger.error('Failed to update user', { userId: id, error: error.message });
    throw createError(500, 'Failed to update user');
  }

  if (!updatedProfile) {
    throw createError(404, 'User not found');
  }

  logger.info('User updated', { userId: id });

  return updatedProfile;
};

interface BulkCreateUserData {
  full_name: string;
  email: string;
  password: string;
  type: 'student' | 'teacher';
  student_id?: string;
  session_id?: string;
  phone?: string;
}

interface BulkCreateResult {
  successful: Array<{ email: string; id: string }>;
  failed: Array<{ email: string; error: string }>;
}

/**
 * Create multiple users in bulk via the Supabase Admin API.
 *
 * Each user is created independently so that individual failures do not
 * block the remaining users. Results include both successful and failed entries.
 */
export const bulkCreateUsers = async (users: BulkCreateUserData[]): Promise<BulkCreateResult> => {
  const results: BulkCreateResult = {
    successful: [],
    failed: [],
  };

  for (const userData of users) {
    try {
      const isSustEmail = /^20\d{2}331\d{3}@student\.sust\.edu$/.test(userData.email);
      const role = userData.type === 'teacher' ? 'teacher' : 'student';

      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        email_confirm: isSustEmail,
        user_metadata: {
          full_name: userData.full_name,
          type: userData.type,
          student_id: userData.student_id,
          session_id: userData.session_id,
          phone: userData.phone,
        },
      });

      if (authError || !authData.user) {
        results.failed.push({
          email: userData.email,
          error: authError?.message || 'Unknown error during user creation',
        });
        continue;
      }

      const approvalStatus = isSustEmail ? 'approved' : 'pending';

      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .update({
          full_name: userData.full_name,
          role,
          student_id: userData.student_id || null,
          phone: userData.phone || null,
          session_id: userData.session_id || null,
          is_sust_email: isSustEmail,
          approval_status: approvalStatus,
          ...(isSustEmail && {
            approved_at: new Date().toISOString(),
          }),
        })
        .eq('id', authData.user.id);

      if (profileError) {
        // Rollback: clean up the auth user
        await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
        results.failed.push({
          email: userData.email,
          error: `Profile setup failed: ${profileError.message}`,
        });
        continue;
      }

      results.successful.push({
        email: userData.email,
        id: authData.user.id,
      });
    } catch (err) {
      results.failed.push({
        email: userData.email,
        error: err instanceof Error ? err.message : 'Unexpected error',
      });
    }
  }

  logger.info('Bulk user creation completed', {
    total: users.length,
    successful: results.successful.length,
    failed: results.failed.length,
  });

  return results;
};

