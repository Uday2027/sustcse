import { supabaseAdmin } from '../config/supabase';
import { createError } from '../middleware/errorHandler';

// =====================
// Permissions
// =====================

/**
 * Fetch admin permissions, optionally filtered by a specific user.
 * Joins the user profile for display name.
 */
export const getPermissions = async (userId?: string) => {
  let query = supabaseAdmin
    .from('admin_permissions')
    .select('*, user:profiles!admin_permissions_user_id_fkey(id, full_name, email, avatar_url)')
    .order('granted_at', { ascending: true });

  if (userId) {
    query = query.eq('user_id', userId);
  }

  const { data, error } = await query;

  if (error) {
    throw createError(500, `Failed to fetch permissions: ${error.message}`);
  }

  return data || [];
};

/**
 * Create or update (upsert) a permission entry for a user on a given section.
 */
export const setPermission = async (
  userId: string,
  section: string,
  permissions: Record<string, boolean>,
  grantedBy: string
) => {
  const { data, error } = await supabaseAdmin
    .from('admin_permissions')
    .upsert(
      {
        user_id: userId,
        section,
        can_create: permissions.can_create ?? false,
        can_read: permissions.can_read ?? true,
        can_update: permissions.can_update ?? false,
        can_delete: permissions.can_delete ?? false,
        granted_by: grantedBy,
      },
      { onConflict: 'user_id,section' }
    )
    .select()
    .single();

  if (error) {
    throw createError(500, `Failed to set permission: ${error.message}`);
  }

  return data;
};

// =====================
// Sessions Config
// =====================

/**
 * Fetch all session configurations ordered by name.
 */
export const getSessions = async () => {
  const { data, error } = await supabaseAdmin
    .from('sessions_config')
    .select('*')
    .order('session_name', { ascending: true });

  if (error) {
    throw createError(500, `Failed to fetch sessions: ${error.message}`);
  }

  return data || [];
};

/**
 * Create a new session configuration and return it.
 */
export const createSession = async (data: Record<string, unknown>) => {
  const { data: session, error } = await supabaseAdmin
    .from('sessions_config')
    .insert(data)
    .select()
    .single();

  if (error) {
    throw createError(500, `Failed to create session: ${error.message}`);
  }

  return session;
};

/**
 * Update an existing session configuration by ID and return the updated record.
 */
export const updateSession = async (
  id: string,
  data: Record<string, unknown>
) => {
  const { data: session, error } = await supabaseAdmin
    .from('sessions_config')
    .update(data)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw createError(500, `Failed to update session: ${error.message}`);
  }

  if (!session) {
    throw createError(404, 'Session not found');
  }

  return session;
};

// =====================
// Email Logs
// =====================

export const getEmailLogs = async (
  page: number,
  limit: number,
  status?: string,
  context?: string
) => {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabaseAdmin
    .from('email_logs')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  if (status) {
    query = query.eq('status', status);
  }
  if (context) {
    query = query.ilike('context', `%${context}%`);
  }

  const { data, error, count } = await query;

  if (error) {
    throw createError(500, `Failed to fetch email logs: ${error.message}`);
  }

  return {
    data: data || [],
    pagination: {
      page,
      limit,
      total: count || 0,
      totalPages: Math.ceil((count || 0) / limit),
    },
  };
};

// =====================
// Remove Permission
// =====================

export const removePermission = async (userId: string, section: string) => {
  const { error } = await supabaseAdmin
    .from('admin_permissions')
    .delete()
    .eq('user_id', userId)
    .eq('section', section);

  if (error) {
    throw createError(500, `Failed to remove permission: ${error.message}`);
  }
};
