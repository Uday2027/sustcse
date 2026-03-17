import { supabaseAdmin } from '../../config/supabase';
import { createError } from '../../middleware/errorHandler';

/**
 * Fetch all faculty members ordered by sort_order ascending.
 * No pagination -- faculty lists are typically small enough to return in full.
 */
export const getFaculty = async () => {
  const { data, error } = await supabaseAdmin
    .from('faculty')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) {
    throw createError(500, `Failed to fetch faculty: ${error.message}`);
  }

  return data || [];
};

/**
 * Fetch a single faculty member by their ID.
 */
export const getFacultyById = async (id: string) => {
  const { data, error } = await supabaseAdmin
    .from('faculty')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw createError(404, 'Faculty member not found');
  }

  return data;
};

/**
 * Create a new faculty member and return the created record.
 */
export const createFaculty = async (data: Record<string, unknown>) => {
  const { data: faculty, error } = await supabaseAdmin
    .from('faculty')
    .insert(data)
    .select()
    .single();

  if (error) {
    throw createError(500, `Failed to create faculty member: ${error.message}`);
  }

  return faculty;
};

/**
 * Update an existing faculty member by ID and return the updated record.
 */
export const updateFaculty = async (
  id: string,
  data: Record<string, unknown>
) => {
  const { data: faculty, error } = await supabaseAdmin
    .from('faculty')
    .update(data)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw createError(500, `Failed to update faculty member: ${error.message}`);
  }

  if (!faculty) {
    throw createError(404, 'Faculty member not found');
  }

  return faculty;
};

/**
 * Delete a faculty member by ID.
 */
export const deleteFaculty = async (id: string) => {
  const { error } = await supabaseAdmin
    .from('faculty')
    .delete()
    .eq('id', id);

  if (error) {
    throw createError(500, `Failed to delete faculty member: ${error.message}`);
  }
};

