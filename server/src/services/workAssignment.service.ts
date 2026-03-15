import { supabaseAdmin } from '../config/supabase';
import { getPagination, formatPaginatedResponse } from '../utils/pagination';
import { createError } from '../middleware/errorHandler';

/**
 * Fetch a paginated list of work assignments with optional filters.
 * Joins assignee and assigner profile names.
 */
export const getAssignments = async (
  page: number = 1,
  limit: number = 10,
  status?: string,
  priority?: string,
  assignedTo?: string
) => {
  const { from, to } = getPagination(page, limit);

  let query = supabaseAdmin
    .from('work_assignments')
    .select(
      '*, assignee:profiles!work_assignments_assigned_to_fkey(id, full_name, avatar_url), assigner:profiles!work_assignments_assigned_by_fkey(id, full_name, avatar_url)',
      { count: 'exact' }
    )
    .order('created_at', { ascending: false })
    .range(from, to);

  if (status) {
    query = query.eq('status', status);
  }

  if (priority) {
    query = query.eq('priority', priority);
  }

  if (assignedTo) {
    query = query.eq('assigned_to', assignedTo);
  }

  const { data, error, count } = await query;

  if (error) {
    throw createError(500, `Failed to fetch work assignments: ${error.message}`);
  }

  return formatPaginatedResponse(data || [], count || 0, page, limit);
};

/**
 * Fetch a single work assignment by its ID with assignee and assigner info.
 */
export const getAssignmentById = async (id: string) => {
  const { data, error } = await supabaseAdmin
    .from('work_assignments')
    .select(
      '*, assignee:profiles!work_assignments_assigned_to_fkey(id, full_name, avatar_url), assigner:profiles!work_assignments_assigned_by_fkey(id, full_name, avatar_url)'
    )
    .eq('id', id)
    .single();

  if (error) {
    throw createError(404, 'Work assignment not found');
  }

  return data;
};

/**
 * Create a new work assignment and return the created record.
 */
export const createAssignment = async (
  data: Record<string, unknown>,
  assignedBy: string
) => {
  const { data: assignment, error } = await supabaseAdmin
    .from('work_assignments')
    .insert({
      ...data,
      assigned_by: assignedBy,
    })
    .select()
    .single();

  if (error) {
    throw createError(500, `Failed to create work assignment: ${error.message}`);
  }

  return assignment;
};

/**
 * Update an existing work assignment by ID and return the updated record.
 */
export const updateAssignment = async (
  id: string,
  data: Record<string, unknown>
) => {
  const { data: assignment, error } = await supabaseAdmin
    .from('work_assignments')
    .update(data)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw createError(500, `Failed to update work assignment: ${error.message}`);
  }

  if (!assignment) {
    throw createError(404, 'Work assignment not found');
  }

  return assignment;
};

/**
 * Delete a work assignment by ID.
 */
export const deleteAssignment = async (id: string) => {
  const { error } = await supabaseAdmin
    .from('work_assignments')
    .delete()
    .eq('id', id);

  if (error) {
    throw createError(500, `Failed to delete work assignment: ${error.message}`);
  }
};
