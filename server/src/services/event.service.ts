import { supabaseAdmin } from '../config/supabase';
import { getPagination, formatPaginatedResponse } from '../utils/pagination';
import { createError } from '../middleware/errorHandler';

/**
 * Fetch a paginated list of events with optional filters.
 * When upcoming is true, only events with a future start_date are returned.
 */
export const getEvents = async (
  page: number = 1,
  limit: number = 10,
  upcoming?: boolean,
  type?: string
) => {
  const { from, to } = getPagination(page, limit);

  let query = supabaseAdmin
    .from('events')
    .select('*', { count: 'exact' })
    .order('start_date', { ascending: false })
    .range(from, to);

  if (upcoming) {
    query = query.gte('start_date', new Date().toISOString());
  }

  if (type) {
    query = query.eq('type', type);
  }

  const { data, error, count } = await query;

  if (error) {
    throw createError(500, `Failed to fetch events: ${error.message}`);
  }

  return formatPaginatedResponse(data || [], count || 0, page, limit);
};

/**
 * Fetch a single event by its ID.
 */
export const getEventById = async (id: string) => {
  const { data, error } = await supabaseAdmin
    .from('events')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw createError(404, 'Event not found');
  }

  return data;
};

/**
 * Create a new event and return the created record.
 */
export const createEvent = async (data: Record<string, unknown>) => {
  const { data: event, error } = await supabaseAdmin
    .from('events')
    .insert(data)
    .select()
    .single();

  if (error) {
    throw createError(500, `Failed to create event: ${error.message}`);
  }

  return event;
};

/**
 * Update an existing event by ID and return the updated record.
 */
export const updateEvent = async (
  id: string,
  data: Record<string, unknown>
) => {
  const { data: event, error } = await supabaseAdmin
    .from('events')
    .update(data)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw createError(500, `Failed to update event: ${error.message}`);
  }

  if (!event) {
    throw createError(404, 'Event not found');
  }

  return event;
};

/**
 * Delete an event by ID.
 */
export const deleteEvent = async (id: string) => {
  const { error } = await supabaseAdmin
    .from('events')
    .delete()
    .eq('id', id);

  if (error) {
    throw createError(500, `Failed to delete event: ${error.message}`);
  }
};
