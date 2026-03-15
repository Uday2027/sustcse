export interface Alumni {
  id: string;
  full_name: string;
  student_id?: string;
  session_id?: string;
  session_name?: string;
  graduation_year?: number;
  email?: string;
  phone?: string;
  current_company?: string;
  current_position?: string;
  location?: string;
  linkedin_url?: string;
  avatar_url?: string;
  bio?: string;
  auto_added: boolean;
  created_at: string;
}
