export interface Notice {
  id: string;
  title: string;
  content: string;
  category?: string;
  is_pinned: boolean;
  attachment_urls: string[];
  published_by: string;
  publisher_name?: string;
  email_sent: boolean;
  email_toggle: boolean;
  published_at: string;
  expires_at?: string;
  created_at: string;
}
