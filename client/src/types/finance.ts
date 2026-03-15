export interface FiscalYear {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  status: 'active' | 'closed';
  opening_balance: number;
  created_at: string;
}

export interface BankStatement {
  id: string;
  fiscal_year_id: string;
  statement_date: string;
  description?: string;
  file_url: string;
  uploaded_by: string;
  uploader_name?: string;
  created_at: string;
}

export interface ApproverConfig {
  id: string;
  level: 'L1' | 'L2';
  user_id: string;
  user_name?: string;
  user_designation?: string;
  fiscal_year_id: string;
  is_active: boolean;
}

export interface CostRequest {
  id: string;
  fiscal_year_id: string;
  title: string;
  description?: string;
  amount: number;
  category?: string;
  proof_urls: string[];
  status: 'draft' | 'pending_l1' | 'l1_approved' | 'pending_l2' | 'l2_approved' | 'rejected' | 'completed';
  requested_by: string;
  requester_name?: string;

  l1_approver_id?: string;
  l1_approver_name?: string;
  l1_approver_designation?: string;
  l1_approved_at?: string;
  l1_remarks?: string;

  l2_approver_id?: string;
  l2_approver_name?: string;
  l2_approver_designation?: string;
  l2_approved_at?: string;
  l2_remarks?: string;

  check_number?: string;
  check_date?: string;

  rejection_reason?: string;
  rejected_by?: string;

  created_at: string;
  updated_at: string;
}

export interface CostApprovalLog {
  id: string;
  cost_request_id: string;
  action: string;
  actor_id: string;
  actor_name: string;
  actor_designation?: string;
  remarks?: string;
  created_at: string;
}
