export interface Faculty {
  id: string;
  full_name: string;
  designation: string;
  email?: string;
  phone?: string;
  office_room?: string;
  research_areas: string[];
  qualifications: { degree: string; institution: string; year?: string }[];
  publications: { title: string; journal?: string; year?: string; url?: string }[];
  avatar_url?: string;
  personal_website?: string;
  joining_date?: string;
  is_on_leave: boolean;
  sort_order: number;
}
