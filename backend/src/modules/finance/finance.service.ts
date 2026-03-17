import { supabaseAdmin } from '../../config/supabase';
import { getPagination, formatPaginatedResponse } from '../../utils/pagination';
import { createError } from '../../middleware/errorHandler';

// =====================
// Fiscal Years
// =====================

/**
 * Fetch all fiscal years ordered by start_date descending.
 */
export const getFiscalYears = async () => {
  const { data, error } = await supabaseAdmin
    .from('fiscal_years')
    .select('*')
    .order('start_date', { ascending: false });

  if (error) {
    throw createError(500, `Failed to fetch fiscal years: ${error.message}`);
  }

  return data || [];
};

/**
 * Fetch a single fiscal year by ID.
 */
export const getFiscalYearById = async (id: string) => {
  const { data, error } = await supabaseAdmin
    .from('fiscal_years')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw createError(404, 'Fiscal year not found');
  }

  return data;
};

/**
 * Create a new fiscal year and return it.
 */
export const createFiscalYear = async (data: Record<string, unknown>) => {
  const { data: fiscalYear, error } = await supabaseAdmin
    .from('fiscal_years')
    .insert(data)
    .select()
    .single();

  if (error) {
    throw createError(500, `Failed to create fiscal year: ${error.message}`);
  }

  return fiscalYear;
};

/**
 * Update a fiscal year by ID and return the updated record.
 */
export const updateFiscalYear = async (
  id: string,
  data: Record<string, unknown>
) => {
  const { data: fiscalYear, error } = await supabaseAdmin
    .from('fiscal_years')
    .update(data)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw createError(500, `Failed to update fiscal year: ${error.message}`);
  }

  if (!fiscalYear) {
    throw createError(404, 'Fiscal year not found');
  }

  return fiscalYear;
};

/**
 * Delete a fiscal year by ID.
 */
export const deleteFiscalYear = async (id: string) => {
  const { error } = await supabaseAdmin
    .from('fiscal_years')
    .delete()
    .eq('id', id);

  if (error) {
    throw createError(500, `Failed to delete fiscal year: ${error.message}`);
  }
};

// =====================
// Bank Statements
// =====================

/**
 * Fetch bank statements, optionally filtered by fiscal year.
 */
export const getBankStatements = async (
  page: number = 1,
  limit: number = 10,
  fiscalYearId?: string
) => {
  const { from, to } = getPagination(page, limit);

  let query = supabaseAdmin
    .from('bank_statements')
    .select('*', { count: 'exact' })
    .order('statement_date', { ascending: false })
    .range(from, to);

  if (fiscalYearId) {
    query = query.eq('fiscal_year_id', fiscalYearId);
  }

  const { data, error, count } = await query;

  if (error) {
    throw createError(500, `Failed to fetch bank statements: ${error.message}`);
  }

  return formatPaginatedResponse(data || [], count || 0, page, limit);
};

/**
 * Fetch a single bank statement by ID.
 */
export const getBankStatementById = async (id: string) => {
  const { data, error } = await supabaseAdmin
    .from('bank_statements')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw createError(404, 'Bank statement not found');
  }

  return data;
};

/**
 * Create a new bank statement and return it.
 */
export const createBankStatement = async (data: Record<string, unknown>) => {
  const { data: statement, error } = await supabaseAdmin
    .from('bank_statements')
    .insert(data)
    .select()
    .single();

  if (error) {
    throw createError(500, `Failed to create bank statement: ${error.message}`);
  }

  return statement;
};

/**
 * Update a bank statement by ID and return the updated record.
 */
export const updateBankStatement = async (
  id: string,
  data: Record<string, unknown>
) => {
  const { data: statement, error } = await supabaseAdmin
    .from('bank_statements')
    .update(data)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw createError(500, `Failed to update bank statement: ${error.message}`);
  }

  if (!statement) {
    throw createError(404, 'Bank statement not found');
  }

  return statement;
};

/**
 * Delete a bank statement by ID.
 */
export const deleteBankStatement = async (id: string) => {
  const { error } = await supabaseAdmin
    .from('bank_statements')
    .delete()
    .eq('id', id);

  if (error) {
    throw createError(500, `Failed to delete bank statement: ${error.message}`);
  }
};

// =====================
// Cost Requests
// =====================

/**
 * Fetch cost requests with optional fiscal year and status filters.
 * Joins the requester profile for display name.
 */
export const getCostRequests = async (
  page: number = 1,
  limit: number = 10,
  fiscalYearId?: string,
  status?: string
) => {
  const { from, to } = getPagination(page, limit);

  let query = supabaseAdmin
    .from('cost_requests')
    .select(
      '*, requester:profiles!cost_requests_requested_by_fkey(id, full_name, avatar_url)',
      { count: 'exact' }
    )
    .order('created_at', { ascending: false })
    .range(from, to);

  if (fiscalYearId) {
    query = query.eq('fiscal_year_id', fiscalYearId);
  }

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error, count } = await query;

  if (error) {
    throw createError(500, `Failed to fetch cost requests: ${error.message}`);
  }

  return formatPaginatedResponse(data || [], count || 0, page, limit);
};

/**
 * Fetch a single cost request by ID with requester info.
 */
export const getCostRequestById = async (id: string) => {
  const { data, error } = await supabaseAdmin
    .from('cost_requests')
    .select(
      '*, requester:profiles!cost_requests_requested_by_fkey(id, full_name, avatar_url)'
    )
    .eq('id', id)
    .single();

  if (error) {
    throw createError(404, 'Cost request not found');
  }

  return data;
};

/**
 * Create a new cost request and return it.
 */
export const createCostRequest = async (
  data: Record<string, unknown>,
  userId: string
) => {
  const { data: costRequest, error } = await supabaseAdmin
    .from('cost_requests')
    .insert({
      ...data,
      requested_by: userId,
      status: 'pending',
    })
    .select()
    .single();

  if (error) {
    throw createError(500, `Failed to create cost request: ${error.message}`);
  }

  return costRequest;
};

/**
 * Update a cost request by ID and return the updated record.
 */
export const updateCostRequest = async (
  id: string,
  data: Record<string, unknown>
) => {
  const { data: costRequest, error } = await supabaseAdmin
    .from('cost_requests')
    .update(data)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw createError(500, `Failed to update cost request: ${error.message}`);
  }

  if (!costRequest) {
    throw createError(404, 'Cost request not found');
  }

  return costRequest;
};

/**
 * Delete a cost request by ID.
 */
export const deleteCostRequest = async (id: string) => {
  const { error } = await supabaseAdmin
    .from('cost_requests')
    .delete()
    .eq('id', id);

  if (error) {
    throw createError(500, `Failed to delete cost request: ${error.message}`);
  }
};

// =====================
// Approval Workflow Helpers
// =====================

/**
 * Fetch the actor (approver) profile for logging approval actions.
 */
const getActorProfile = async (actorId: string) => {
  const { data: actor, error } = await supabaseAdmin
    .from('profiles')
    .select('id, full_name, role')
    .eq('id', actorId)
    .single();

  if (error || !actor) {
    throw createError(404, 'Approver profile not found');
  }

  return actor;
};

/**
 * Insert a record into the cost_approval_log table.
 */
const logApprovalAction = async (log: {
  cost_request_id: string;
  action: string;
  actor_id: string;
  actor_name: string;
  actor_designation: string;
  remarks?: string;
}) => {
  const { error } = await supabaseAdmin
    .from('cost_approval_log')
    .insert({
      ...log,
      created_at: new Date().toISOString(),
    });

  if (error) {
    throw createError(500, `Failed to log approval action: ${error.message}`);
  }
};

// =====================
// Approval Operations
// =====================

/**
 * Level 1 approval: update the cost request status to l1_approved and log the action.
 */
export const approveL1 = async (
  costId: string,
  approverId: string,
  remarks?: string
) => {
  const actor = await getActorProfile(approverId);

  const { data: costRequest, error } = await supabaseAdmin
    .from('cost_requests')
    .update({
      status: 'l1_approved',
      l1_approver_id: approverId,
      l1_approved_at: new Date().toISOString(),
    })
    .eq('id', costId)
    .eq('status', 'pending')
    .select()
    .single();

  if (error || !costRequest) {
    throw createError(400, 'Cost request not found or not in pending status');
  }

  await logApprovalAction({
    cost_request_id: costId,
    action: 'l1_approved',
    actor_id: approverId,
    actor_name: actor.full_name,
    actor_designation: actor.role,
    remarks,
  });

  return costRequest;
};

/**
 * Level 2 approval: update the cost request status to l2_approved and log the action.
 */
export const approveL2 = async (
  costId: string,
  approverId: string,
  remarks?: string
) => {
  const actor = await getActorProfile(approverId);

  const { data: costRequest, error } = await supabaseAdmin
    .from('cost_requests')
    .update({
      status: 'l2_approved',
      l2_approver_id: approverId,
      l2_approved_at: new Date().toISOString(),
    })
    .eq('id', costId)
    .eq('status', 'l1_approved')
    .select()
    .single();

  if (error || !costRequest) {
    throw createError(400, 'Cost request not found or not in l1_approved status');
  }

  await logApprovalAction({
    cost_request_id: costId,
    action: 'l2_approved',
    actor_id: approverId,
    actor_name: actor.full_name,
    actor_designation: actor.role,
    remarks,
  });

  return costRequest;
};

/**
 * Reject a cost request: mark as rejected, store the reason, and log the action.
 */
export const rejectCost = async (
  costId: string,
  rejectedBy: string,
  reason?: string
) => {
  const actor = await getActorProfile(rejectedBy);

  const { data: costRequest, error } = await supabaseAdmin
    .from('cost_requests')
    .update({
      status: 'rejected',
      rejected_by: rejectedBy,
      rejected_at: new Date().toISOString(),
      rejection_reason: reason || null,
    })
    .eq('id', costId)
    .select()
    .single();

  if (error || !costRequest) {
    throw createError(400, 'Cost request not found');
  }

  await logApprovalAction({
    cost_request_id: costId,
    action: 'rejected',
    actor_id: rejectedBy,
    actor_name: actor.full_name,
    actor_designation: actor.role,
    remarks: reason,
  });

  return costRequest;
};

/**
 * Add a check number to a fully approved cost request, marking it as completed.
 */
export const addCheckNumber = async (
  costId: string,
  checkNumber: string,
  checkDate: string,
  actorId: string
) => {
  const actor = await getActorProfile(actorId);

  const { data: costRequest, error } = await supabaseAdmin
    .from('cost_requests')
    .update({
      status: 'completed',
      check_number: checkNumber,
      check_date: checkDate,
    })
    .eq('id', costId)
    .eq('status', 'l2_approved')
    .select()
    .single();

  if (error || !costRequest) {
    throw createError(400, 'Cost request not found or not in l2_approved status');
  }

  await logApprovalAction({
    cost_request_id: costId,
    action: 'completed',
    actor_id: actorId,
    actor_name: actor.full_name,
    actor_designation: actor.role,
    remarks: `Check #${checkNumber} issued on ${checkDate}`,
  });

  return costRequest;
};

// =====================
// Approvers
// =====================

/**
 * Fetch the list of configured approvers for a fiscal year, including user names.
 */
export const getApprovers = async (fiscalYearId?: string) => {
  let query = supabaseAdmin
    .from('approver_config')
    .select('*, user:profiles!approver_config_user_id_fkey(id, full_name, email, avatar_url)')
    .order('created_at', { ascending: true });

  if (fiscalYearId) {
    query = query.eq('fiscal_year_id', fiscalYearId);
  }

  const { data, error } = await query;

  if (error) {
    throw createError(500, `Failed to fetch approvers: ${error.message}`);
  }

  return data || [];
};

