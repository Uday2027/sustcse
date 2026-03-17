import { supabaseAdmin } from '../../config/supabase';
import { getPagination, formatPaginatedResponse } from '../../utils/pagination';
import { createError } from '../../middleware/errorHandler';

/**
 * Fetch a paginated list of approved student profiles with optional filters.
 * Only returns users where role='student' and approval_status='approved'.
 * Joins student_profiles for extended data (skills, job-seeking status, etc.).
 */
export const getStudents = async (
  page: number = 1,
  limit: number = 10,
  session?: string,
  skills?: string,
  jobSeeking?: boolean
) => {
  const { from, to } = getPagination(page, limit);

  let query = supabaseAdmin
    .from('profiles')
    .select(
      '*, student_profile:student_profiles!student_profiles_user_id_fkey(*)',
      { count: 'exact' }
    )
    .eq('role', 'student')
    .eq('approval_status', 'approved')
    .order('full_name', { ascending: true })
    .range(from, to);

  if (session) {
    query = query.eq('session_id', session);
  }

  if (skills) {
    // Filter by skills contained in the student_profiles JSONB/array column
    query = query.contains('student_profiles.skills', [skills]);
  }

  if (jobSeeking !== undefined) {
    query = query.eq('student_profiles.is_job_seeking', jobSeeking);
  }

  const { data, error, count } = await query;

  if (error) {
    throw createError(500, `Failed to fetch students: ${error.message}`);
  }

  return formatPaginatedResponse(data || [], count || 0, page, limit);
};

/**
 * Fetch a single student by their profile ID.
 * Returns the profile joined with student_profiles.
 */
export const getStudentById = async (id: string) => {
  const { data, error } = await supabaseAdmin
    .from('profiles')
    .select(
      '*, student_profile:student_profiles!student_profiles_user_id_fkey(*)'
    )
    .eq('id', id)
    .eq('role', 'student')
    .single();

  if (error) {
    throw createError(404, 'Student not found');
  }

  return data;
};

/**
 * Upsert the student_profiles record for a given user.
 * Creates a new record if one does not exist, or updates the existing one.
 */
export const updateStudentProfile = async (
  userId: string,
  data: Record<string, unknown>
) => {
  const { data: profile, error } = await supabaseAdmin
    .from('student_profiles')
    .upsert(
      {
        user_id: userId,
        ...data,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' }
    )
    .select()
    .single();

  if (error) {
    throw createError(500, `Failed to update student profile: ${error.message}`);
  }

  return profile;
};

