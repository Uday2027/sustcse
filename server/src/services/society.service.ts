import { supabaseAdmin } from '../config/supabase';
import { getPagination, formatPaginatedResponse } from '../utils/pagination';
import { createError } from '../middleware/errorHandler';

/**
 * Fetch society members with optional status and year filters.
 */
export const getMembers = async (
  page: number = 1,
  limit: number = 10,
  status?: string,
  year?: string
) => {
  const { from, to } = getPagination(page, limit);

  let query = supabaseAdmin
    .from('society_members')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  if (status) {
    query = query.eq('member_status', status);
  }

  if (year) {
    query = query.eq('committee_year', year);
  }

  const { data, error, count } = await query;

  if (error) {
    throw createError(500, `Failed to fetch society members: ${error.message}`);
  }

  return formatPaginatedResponse(data || [], count || 0, page, limit);
};

/**
 * Fetch a single society member by ID.
 */
export const getMemberById = async (id: string) => {
  const { data, error } = await supabaseAdmin
    .from('society_members')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw createError(404, 'Society member not found');
  }

  return data;
};

/**
 * Create a new society member record and return it.
 */
export const createMember = async (data: Record<string, unknown>) => {
  const { data: member, error } = await supabaseAdmin
    .from('society_members')
    .insert(data)
    .select()
    .single();

  if (error) {
    throw createError(500, `Failed to create society member: ${error.message}`);
  }

  return member;
};

/**
 * Update an existing society member by ID and return the updated record.
 */
export const updateMember = async (
  id: string,
  data: Record<string, unknown>
) => {
  const { data: member, error } = await supabaseAdmin
    .from('society_members')
    .update(data)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw createError(500, `Failed to update society member: ${error.message}`);
  }

  if (!member) {
    throw createError(404, 'Society member not found');
  }

  return member;
};

/**
 * Delete a society member by ID.
 */
export const deleteMember = async (id: string) => {
  const { error } = await supabaseAdmin
    .from('society_members')
    .delete()
    .eq('id', id);

  if (error) {
    throw createError(500, `Failed to delete society member: ${error.message}`);
  }
};
