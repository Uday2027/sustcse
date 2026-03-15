export interface SocietyMember {
  id: string;
  user_id?: string;
  full_name: string;
  position: string;
  committee_year: string;
  member_status: 'current' | 'former';
  avatar_url?: string;
  student_id?: string;
  email?: string;
  phone?: string;
  bio?: string;
  sort_order: number;
  created_at: string;
}
