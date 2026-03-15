export interface Achievement {
  id: string;
  title: string;
  description: string;
  achievement_date?: string;
  category?: string;
  image_urls: string[];
  link?: string;
  achieved_by?: string;
  created_by: string;
  is_featured: boolean;
  created_at: string;
}
