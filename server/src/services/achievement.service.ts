import { supabaseAdmin } from '../config/supabase';
import { getPagination, formatPaginatedResponse } from '../utils/pagination';
import { createError } from '../middleware/errorHandler';

/**
 * Fetch a paginated list of achievements with an optional category filter.
 * Results are ordered by achievement_date descending.
 */
export const getAchievements = async (
  page: number = 1,
  limit: number = 10,
  category?: string
) => {
  const { from, to } = getPagination(page, limit);

  let query = supabaseAdmin
    .from('achievements')
    .select('*', { count: 'exact' })
    .order('achievement_date', { ascending: false })
    .range(from, to);

  if (category) {
    query = query.eq('category', category);
  }

  const { data, error, count } = await query;

  if (error) {
    throw createError(500, `Failed to fetch achievements: ${error.message}`);
  }

  return formatPaginatedResponse(data || [], count || 0, page, limit);
};

/**
 * Fetch a single achievement by its ID.
 */
export const getAchievementById = async (id: string) => {
  const { data, error } = await supabaseAdmin
    .from('achievements')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw createError(404, 'Achievement not found');
  }

  return data;
};

/**
 * Create a new achievement and return the created record.
 */
export const createAchievement = async (data: Record<string, unknown>) => {
  const { data: achievement, error } = await supabaseAdmin
    .from('achievements')
    .insert(data)
    .select()
    .single();

  if (error) {
    throw createError(500, `Failed to create achievement: ${error.message}`);
  }

  return achievement;
};

/**
 * Update an existing achievement by ID and return the updated record.
 */
export const updateAchievement = async (
  id: string,
  data: Record<string, unknown>
) => {
  const { data: achievement, error } = await supabaseAdmin
    .from('achievements')
    .update(data)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw createError(500, `Failed to update achievement: ${error.message}`);
  }

  if (!achievement) {
    throw createError(404, 'Achievement not found');
  }

  return achievement;
};

/**
 * Delete an achievement by ID.
 */
export const deleteAchievement = async (id: string) => {
  const { error } = await supabaseAdmin
    .from('achievements')
    .delete()
    .eq('id', id);

  if (error) {
    throw createError(500, `Failed to delete achievement: ${error.message}`);
  }
};
