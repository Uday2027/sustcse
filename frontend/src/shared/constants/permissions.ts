export const ADMIN_SECTIONS = [
  'notices',
  'events',
  'achievements',
  'alumni',
  'faculty',
  'society',
  'students',
  'finance',
  'important_data',
  'work_assignments',
  'users',
  'email',
  'sessions',
] as const;

export type AdminSection = (typeof ADMIN_SECTIONS)[number];
