export interface WorkAssignment {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  assigned_to: string;
  assignee_name?: string;
  assigned_by: string;
  assigner_name?: string;
  due_date?: string;
  completed_at?: string;
  attachments: string[];
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ImportantData {
  id: string;
  title: string;
  description?: string;
  category?: string;
  file_type: 'image' | 'pdf';
  file_url: string;
  file_size?: number;
  uploaded_by: string;
  uploader_name?: string;
  is_public: boolean;
  created_at: string;
}

export interface EmailLog {
  id: string;
  recipient_email: string;
  recipient_name?: string;
  subject: string;
  template?: string;
  context?: string;
  reference_id?: string;
  status: 'queued' | 'sent' | 'failed';
  error_message?: string;
  error_code?: string;
  retry_count: number;
  sent_at?: string;
  sent_by?: string;
  created_at: string;
}

export interface AdminPermission {
  id: string;
  user_id: string;
  user_name?: string;
  section: string;
  can_create: boolean;
  can_read: boolean;
  can_update: boolean;
  can_delete: boolean;
  granted_by: string;
  granted_at: string;
}

export interface SessionConfig {
  id: string;
  session_name: string;
  start_year: number;
  end_year: number;
  is_graduated: boolean;
  created_at: string;
}
