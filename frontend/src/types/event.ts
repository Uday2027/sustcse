export interface Event {
  id: string;
  title: string;
  description: string;
  type?: string;
  venue?: string;
  start_date: string;
  end_date?: string;
  registration_url?: string;
  cover_image_url?: string;
  attachment_urls: string[];
  organized_by: string;
  created_by: string;
  creator_name?: string;
  email_sent: boolean;
  email_toggle: boolean;
  is_published: boolean;
  created_at: string;
}
