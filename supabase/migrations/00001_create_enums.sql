-- Custom enum types
CREATE TYPE user_role AS ENUM ('student', 'teacher', 'admin', 'super_admin');
CREATE TYPE approval_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE cost_status AS ENUM ('draft', 'pending_l1', 'l1_approved', 'pending_l2', 'l2_approved', 'rejected', 'completed');
CREATE TYPE priority_level AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE assignment_status AS ENUM ('pending', 'in_progress', 'completed', 'overdue');
CREATE TYPE email_status AS ENUM ('queued', 'sent', 'failed');
CREATE TYPE society_member_status AS ENUM ('current', 'former');
CREATE TYPE fiscal_year_status AS ENUM ('active', 'closed');
