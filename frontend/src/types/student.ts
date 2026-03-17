export interface StudentProfile {
  id: string;
  user_id: string;
  headline?: string;
  about?: string;
  cgpa?: number;
  github_url?: string;
  linkedin_url?: string;
  portfolio_url?: string;
  resume_url?: string;
  skills: { name: string; level: string }[];
  experience: { company: string; title: string; start: string; end?: string; description?: string }[];
  projects: { name: string; description?: string; url?: string; tech_stack?: string[] }[];
  education: { institution: string; degree: string; year?: string }[];
  certifications: { name: string; issuer?: string; date?: string; url?: string }[];
  languages: string[];
  is_looking_for_job: boolean;
  job_preferences: { type?: string; location?: string; remote?: boolean };
  visibility: 'public' | 'students_only' | 'private';
  updated_at: string;
}
