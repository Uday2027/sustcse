export interface NotificationPreferences {
  notices: boolean;
  events: boolean;
  achievements: boolean;
}

export interface User {
  id: string;
  full_name: string;
  student_id?: string;
  email: string;
  phone?: string;
  whatsapp?: string;
  session_id?: string;
  session_name?: string;
  role: 'student' | 'teacher' | 'admin' | 'super_admin';
  approval_status: 'pending' | 'approved' | 'rejected';
  is_sust_email: boolean;
  avatar_url?: string;
  bio?: string;
  is_active: boolean;
  notification_preferences: NotificationPreferences;
  created_at: string;
  updated_at: string;
}
