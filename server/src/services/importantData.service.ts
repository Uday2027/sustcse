import { supabaseAdmin } from '../config/supabase';
import { getPagination, formatPaginatedResponse } from '../utils/pagination';
import { createError } from '../middleware/errorHandler';

/**
 * Fetch a paginated list of important data entries with optional category filter.
 */
export const getAll = async (
  page: number = 1,
  limit: number = 10,
  category?: string
) => {
  const { from, to } = getPagination(page, limit);

  let query = supabaseAdmin
    .from('important_data')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  if (category) {
    query = query.eq('category', category);
  }

  const { data, error, count } = await query;

  if (error) {
    throw createError(500, `Failed to fetch important data: ${error.message}`);
  }

  return formatPaginatedResponse(data || [], count || 0, page, limit);
};

/**
 * Fetch a single important data entry by its ID.
 */
export const getById = async (id: string) => {
  const { data, error } = await supabaseAdmin
    .from('important_data')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw createError(404, 'Important data entry not found');
  }

  return data;
};

/**
 * Create a new important data entry and return the created record.
 */
export const create = async (data: Record<string, unknown>) => {
  const { data: entry, error } = await supabaseAdmin
    .from('important_data')
    .insert(data)
    .select()
    .single();

  if (error) {
    throw createError(500, `Failed to create important data entry: ${error.message}`);
  }

  return entry;
};

/**
 * Update an existing important data entry by ID and return the updated record.
 */
export const update = async (id: string, data: Record<string, unknown>) => {
  const { data: entry, error } = await supabaseAdmin
    .from('important_data')
    .update(data)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw createError(500, `Failed to update important data entry: ${error.message}`);
  }

  if (!entry) {
    throw createError(404, 'Important data entry not found');
  }

  return entry;
};

/**
 * Delete an important data entry by ID.
 */
export const remove = async (id: string) => {
  const { error } = await supabaseAdmin
    .from('important_data')
    .delete()
    .eq('id', id);

  if (error) {
    throw createError(500, `Failed to delete important data entry: ${error.message}`);
  }
};
