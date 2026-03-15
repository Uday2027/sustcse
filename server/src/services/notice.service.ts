import { supabaseAdmin } from '../config/supabase';
import { getPagination, formatPaginatedResponse } from '../utils/pagination';
import { createError } from '../middleware/errorHandler';

/**
 * Fetch a paginated list of notices with optional category and search filters.
 * Results are ordered by pinned status first, then by published date descending.
 */
export const getNotices = async (
  page: number = 1,
  limit: number = 10,
  category?: string,
  search?: string
) => {
  const { from, to } = getPagination(page, limit);

  let query = supabaseAdmin
    .from('notices')
    .select(
      '*, publisher:profiles!notices_published_by_fkey(id, full_name, avatar_url)',
      { count: 'exact' }
    )
    .order('is_pinned', { ascending: false })
    .order('published_at', { ascending: false })
    .range(from, to);

  if (category) {
    query = query.eq('category', category);
  }

  if (search) {
    query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`);
  }

  const { data, error, count } = await query;

  if (error) {
    throw createError(500, `Failed to fetch notices: ${error.message}`);
  }

  return formatPaginatedResponse(data || [], count || 0, page, limit);
};

/**
 * Fetch a single notice by its ID, including the publisher profile.
 */
export const getNoticeById = async (id: string) => {
  const { data, error } = await supabaseAdmin
    .from('notices')
    .select(
      '*, publisher:profiles!notices_published_by_fkey(id, full_name, avatar_url)'
    )
    .eq('id', id)
    .single();

  if (error) {
    throw createError(404, 'Notice not found');
  }

  return data;
};

/**
 * Create a new notice and return the created record.
 */
export const createNotice = async (
  data: Record<string, unknown>,
  userId: string
) => {
  const { data: notice, error } = await supabaseAdmin
    .from('notices')
    .insert({
      ...data,
      published_by: userId,
      published_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    throw createError(500, `Failed to create notice: ${error.message}`);
  }

  return notice;
};

/**
 * Update an existing notice by ID and return the updated record.
 */
export const updateNotice = async (
  id: string,
  data: Record<string, unknown>
) => {
  const { data: notice, error } = await supabaseAdmin
    .from('notices')
    .update(data)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw createError(500, `Failed to update notice: ${error.message}`);
  }

  if (!notice) {
    throw createError(404, 'Notice not found');
  }

  return notice;
};

/**
 * Delete a notice by ID.
 */
export const deleteNotice = async (id: string) => {
  const { error } = await supabaseAdmin
    .from('notices')
    .delete()
    .eq('id', id);

  if (error) {
    throw createError(500, `Failed to delete notice: ${error.message}`);
  }
};
