import { supabaseAdmin } from '../config/supabase';
import { getPagination, formatPaginatedResponse } from '../utils/pagination';
import { createError } from '../middleware/errorHandler';

/**
 * Fetch a paginated list of alumni with optional session and graduation year filters.
 * Joins the session configuration for session name display.
 */
export const getAlumni = async (
  page: number = 1,
  limit: number = 10,
  session?: string,
  year?: string
) => {
  const { from, to } = getPagination(page, limit);

  let query = supabaseAdmin
    .from('alumni')
    .select('*, session:sessions_config!alumni_session_id_fkey(id, name)', {
      count: 'exact',
    })
    .order('graduation_year', { ascending: false })
    .range(from, to);

  if (session) {
    query = query.eq('session_id', session);
  }

  if (year) {
    query = query.eq('graduation_year', parseInt(year));
  }

  const { data, error, count } = await query;

  if (error) {
    throw createError(500, `Failed to fetch alumni: ${error.message}`);
  }

  return formatPaginatedResponse(data || [], count || 0, page, limit);
};

/**
 * Fetch a single alumni record by its ID.
 */
export const getAlumniById = async (id: string) => {
  const { data, error } = await supabaseAdmin
    .from('alumni')
    .select('*, session:sessions_config!alumni_session_id_fkey(id, name)')
    .eq('id', id)
    .single();

  if (error) {
    throw createError(404, 'Alumni record not found');
  }

  return data;
};

/**
 * Create a new alumni record and return it.
 */
export const createAlumni = async (data: Record<string, unknown>) => {
  const { data: alumni, error } = await supabaseAdmin
    .from('alumni')
    .insert(data)
    .select()
    .single();

  if (error) {
    throw createError(500, `Failed to create alumni record: ${error.message}`);
  }

  return alumni;
};

/**
 * Update an existing alumni record by ID and return the updated record.
 */
export const updateAlumni = async (
  id: string,
  data: Record<string, unknown>
) => {
  const { data: alumni, error } = await supabaseAdmin
    .from('alumni')
    .update(data)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw createError(500, `Failed to update alumni record: ${error.message}`);
  }

  if (!alumni) {
    throw createError(404, 'Alumni record not found');
  }

  return alumni;
};

/**
 * Delete an alumni record by ID.
 */
export const deleteAlumni = async (id: string) => {
  const { error } = await supabaseAdmin
    .from('alumni')
    .delete()
    .eq('id', id);

  if (error) {
    throw createError(500, `Failed to delete alumni record: ${error.message}`);
  }
};

/**
 * Bulk-add students from a graduated session to the alumni table.
 * Looks up all approved student profiles belonging to the given session and
 * inserts them into the alumni table if they are not already present.
 */
export const autoAddAlumni = async (sessionId: string) => {
  // Fetch the session to get the graduation year
  const { data: session, error: sessionError } = await supabaseAdmin
    .from('sessions_config')
    .select('id, name, graduation_year')
    .eq('id', sessionId)
    .single();

  if (sessionError || !session) {
    throw createError(404, 'Session not found');
  }

  // Fetch all approved students belonging to this session
  const { data: students, error: studentsError } = await supabaseAdmin
    .from('profiles')
    .select('id, full_name, email, student_id, phone')
    .eq('session_id', sessionId)
    .eq('role', 'student')
    .eq('approval_status', 'approved');

  if (studentsError) {
    throw createError(500, `Failed to fetch students: ${studentsError.message}`);
  }

  if (!students || students.length === 0) {
    return { added: 0, skipped: 0 };
  }

  // Fetch existing alumni for this session to avoid duplicates
  const { data: existingAlumni } = await supabaseAdmin
    .from('alumni')
    .select('profile_id')
    .eq('session_id', sessionId);

  const existingProfileIds = new Set(
    (existingAlumni || []).map((a: { profile_id: string }) => a.profile_id)
  );

  // Prepare new alumni records, skipping those already present
  const newAlumni = students
    .filter((s) => !existingProfileIds.has(s.id))
    .map((s) => ({
      profile_id: s.id,
      name: s.full_name,
      email: s.email,
      student_id: s.student_id,
      phone: s.phone,
      session_id: sessionId,
      graduation_year: session.graduation_year,
    }));

  if (newAlumni.length === 0) {
    return { added: 0, skipped: students.length };
  }

  const { error: insertError } = await supabaseAdmin
    .from('alumni')
    .insert(newAlumni);

  if (insertError) {
    throw createError(500, `Failed to auto-add alumni: ${insertError.message}`);
  }

  return {
    added: newAlumni.length,
    skipped: students.length - newAlumni.length,
  };
};
