-- ===== SUST CSE Department Website - Complete Database Schema =====
-- Run this migration against your Supabase PostgreSQL database

-- ===== 1. Custom Enum Types =====
CREATE TYPE user_role AS ENUM ('student', 'teacher', 'admin', 'super_admin');
CREATE TYPE approval_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE cost_status AS ENUM ('draft', 'pending_l1', 'l1_approved', 'pending_l2', 'l2_approved', 'rejected', 'completed');
CREATE TYPE priority_level AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE assignment_status AS ENUM ('pending', 'in_progress', 'completed', 'overdue');
CREATE TYPE email_status AS ENUM ('queued', 'sent', 'failed');
CREATE TYPE society_member_status AS ENUM ('current', 'former');
CREATE TYPE fiscal_year_status AS ENUM ('active', 'closed');


-- ===== 2. Sessions Config =====
CREATE TABLE sessions_config (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_name    VARCHAR(50) NOT NULL UNIQUE,
    start_year      INTEGER NOT NULL,
    end_year        INTEGER NOT NULL,
    is_graduated    BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);


-- ===== 3. Profiles (extends Supabase auth.users) =====
CREATE TABLE profiles (
    id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name       VARCHAR(200) NOT NULL,
    student_id      VARCHAR(20) UNIQUE,
    email           VARCHAR(255) NOT NULL UNIQUE,
    phone           VARCHAR(20),
    whatsapp        VARCHAR(20),
    session_id      UUID REFERENCES sessions_config(id),
    role            user_role DEFAULT 'student',
    approval_status approval_status DEFAULT 'pending',
    is_sust_email   BOOLEAN DEFAULT FALSE,
    avatar_url      TEXT,
    bio             TEXT,
    designation     VARCHAR(200),
    is_active       BOOLEAN DEFAULT TRUE,
    approved_by     UUID REFERENCES profiles(id),
    approved_at     TIMESTAMPTZ,
    rejection_reason TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_approval ON profiles(approval_status);
CREATE INDEX idx_profiles_session ON profiles(session_id);
CREATE INDEX idx_profiles_student_id ON profiles(student_id);


-- ===== 4. Student Profiles (LinkedIn-like) =====
CREATE TABLE student_profiles (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
    headline        VARCHAR(300),
    about           TEXT,
    cgpa            DECIMAL(3,2),
    github_url      VARCHAR(500),
    linkedin_url    VARCHAR(500),
    portfolio_url   VARCHAR(500),
    resume_url      TEXT,
    skills          JSONB DEFAULT '[]',
    experience      JSONB DEFAULT '[]',
    projects        JSONB DEFAULT '[]',
    education       JSONB DEFAULT '[]',
    certifications  JSONB DEFAULT '[]',
    languages       JSONB DEFAULT '[]',
    is_looking_for_job BOOLEAN DEFAULT FALSE,
    job_preferences JSONB DEFAULT '{}',
    visibility      VARCHAR(20) DEFAULT 'public',
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);


-- ===== 5. Notices =====
CREATE TABLE notices (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title           VARCHAR(500) NOT NULL,
    content         TEXT NOT NULL,
    category        VARCHAR(100),
    is_pinned       BOOLEAN DEFAULT FALSE,
    attachment_urls JSONB DEFAULT '[]',
    published_by    UUID NOT NULL REFERENCES profiles(id),
    email_sent      BOOLEAN DEFAULT FALSE,
    email_toggle    BOOLEAN DEFAULT FALSE,
    published_at    TIMESTAMPTZ DEFAULT NOW(),
    expires_at      TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notices_published ON notices(published_at DESC);
CREATE INDEX idx_notices_category ON notices(category);


-- ===== 6. Events =====
CREATE TABLE events (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title           VARCHAR(500) NOT NULL,
    description     TEXT NOT NULL,
    event_type      VARCHAR(100),
    venue           VARCHAR(300),
    start_date      TIMESTAMPTZ NOT NULL,
    end_date        TIMESTAMPTZ,
    registration_url VARCHAR(500),
    cover_image_url TEXT,
    attachment_urls JSONB DEFAULT '[]',
    organized_by    VARCHAR(200) DEFAULT 'CSE Society',
    created_by      UUID NOT NULL REFERENCES profiles(id),
    email_sent      BOOLEAN DEFAULT FALSE,
    email_toggle    BOOLEAN DEFAULT FALSE,
    is_published    BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_events_start ON events(start_date DESC);


-- ===== 7. Achievements =====
CREATE TABLE achievements (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title           VARCHAR(500) NOT NULL,
    description     TEXT NOT NULL,
    achievement_date DATE,
    category        VARCHAR(100),
    image_urls      JSONB DEFAULT '[]',
    link            VARCHAR(500),
    achieved_by     VARCHAR(300),
    created_by      UUID NOT NULL REFERENCES profiles(id),
    is_featured     BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);


-- ===== 8. Alumni =====
CREATE TABLE alumni (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name       VARCHAR(200) NOT NULL,
    student_id      VARCHAR(20),
    session_id      UUID REFERENCES sessions_config(id),
    graduation_year INTEGER,
    email           VARCHAR(255),
    phone           VARCHAR(20),
    current_company VARCHAR(300),
    current_position VARCHAR(300),
    location        VARCHAR(200),
    linkedin_url    VARCHAR(500),
    avatar_url      TEXT,
    bio             TEXT,
    added_by        UUID REFERENCES profiles(id),
    auto_added      BOOLEAN DEFAULT FALSE,
    linked_user_id  UUID REFERENCES profiles(id),
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_alumni_session ON alumni(session_id);
CREATE INDEX idx_alumni_grad_year ON alumni(graduation_year);


-- ===== 9. Faculty =====
CREATE TABLE faculty (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name       VARCHAR(200) NOT NULL,
    designation     VARCHAR(100) NOT NULL,
    email           VARCHAR(255),
    phone           VARCHAR(20),
    office_room     VARCHAR(50),
    research_areas  JSONB DEFAULT '[]',
    qualifications  JSONB DEFAULT '[]',
    publications    JSONB DEFAULT '[]',
    avatar_url      TEXT,
    personal_website VARCHAR(500),
    joining_date    DATE,
    is_on_leave     BOOLEAN DEFAULT FALSE,
    sort_order      INTEGER DEFAULT 0,
    linked_user_id  UUID REFERENCES profiles(id),
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);


-- ===== 10. Society Members =====
CREATE TABLE society_members (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID REFERENCES profiles(id),
    full_name       VARCHAR(200) NOT NULL,
    position        VARCHAR(200) NOT NULL,
    committee_year  VARCHAR(20) NOT NULL,
    member_status   society_member_status DEFAULT 'current',
    avatar_url      TEXT,
    student_id      VARCHAR(20),
    email           VARCHAR(255),
    phone           VARCHAR(20),
    bio             TEXT,
    sort_order      INTEGER DEFAULT 0,
    created_by      UUID REFERENCES profiles(id),
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_society_year ON society_members(committee_year);
CREATE INDEX idx_society_status ON society_members(member_status);


-- ===== 11. Financial System =====

-- Fiscal Years
CREATE TABLE fiscal_years (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(50) NOT NULL UNIQUE,
    start_date      DATE NOT NULL,
    end_date        DATE NOT NULL,
    status          fiscal_year_status DEFAULT 'active',
    opening_balance DECIMAL(12,2) DEFAULT 0,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Bank Statements
CREATE TABLE bank_statements (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fiscal_year_id  UUID NOT NULL REFERENCES fiscal_years(id),
    statement_date  DATE NOT NULL,
    description     VARCHAR(500),
    file_url        TEXT NOT NULL,
    uploaded_by     UUID NOT NULL REFERENCES profiles(id),
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Approver Configuration
CREATE TABLE approver_config (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    level           VARCHAR(5) NOT NULL CHECK (level IN ('L1', 'L2')),
    user_id         UUID NOT NULL REFERENCES profiles(id),
    fiscal_year_id  UUID NOT NULL REFERENCES fiscal_years(id),
    is_active       BOOLEAN DEFAULT TRUE,
    assigned_by     UUID NOT NULL REFERENCES profiles(id),
    assigned_at     TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(level, user_id, fiscal_year_id)
);

-- Cost Requests
CREATE TABLE cost_requests (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fiscal_year_id  UUID NOT NULL REFERENCES fiscal_years(id),
    title           VARCHAR(500) NOT NULL,
    description     TEXT,
    amount          DECIMAL(12,2) NOT NULL,
    category        VARCHAR(100),
    proof_urls      JSONB DEFAULT '[]',
    status          cost_status DEFAULT 'draft',
    requested_by    UUID NOT NULL REFERENCES profiles(id),

    l1_approver_id  UUID REFERENCES profiles(id),
    l1_approved_at  TIMESTAMPTZ,
    l1_remarks      TEXT,

    l2_approver_id  UUID REFERENCES profiles(id),
    l2_approved_at  TIMESTAMPTZ,
    l2_remarks      TEXT,

    check_number    VARCHAR(100),
    check_date      DATE,

    rejection_reason TEXT,
    rejected_by     UUID REFERENCES profiles(id),
    rejected_at     TIMESTAMPTZ,

    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_cost_status ON cost_requests(status);
CREATE INDEX idx_cost_fiscal ON cost_requests(fiscal_year_id);

-- Cost Approval Audit Trail
CREATE TABLE cost_approval_log (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cost_request_id UUID NOT NULL REFERENCES cost_requests(id) ON DELETE CASCADE,
    action          VARCHAR(50) NOT NULL,
    actor_id        UUID NOT NULL REFERENCES profiles(id),
    actor_name      VARCHAR(200) NOT NULL,
    actor_designation VARCHAR(200),
    remarks         TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);


-- ===== 12. Important Data =====
CREATE TABLE important_data (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title           VARCHAR(500) NOT NULL,
    description     TEXT,
    category        VARCHAR(100),
    file_type       VARCHAR(10) NOT NULL,
    file_url        TEXT NOT NULL,
    file_size       BIGINT,
    uploaded_by     UUID NOT NULL REFERENCES profiles(id),
    is_public       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);


-- ===== 13. Work Assignments =====
CREATE TABLE work_assignments (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title           VARCHAR(500) NOT NULL,
    description     TEXT,
    priority        priority_level DEFAULT 'medium',
    status          assignment_status DEFAULT 'pending',
    assigned_to     UUID NOT NULL REFERENCES profiles(id),
    assigned_by     UUID NOT NULL REFERENCES profiles(id),
    due_date        TIMESTAMPTZ,
    completed_at    TIMESTAMPTZ,
    attachments     JSONB DEFAULT '[]',
    notes           TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_assignments_assignee ON work_assignments(assigned_to);
CREATE INDEX idx_assignments_status ON work_assignments(status);
CREATE INDEX idx_assignments_priority ON work_assignments(priority);


-- ===== 14. Email Logs =====
CREATE TABLE email_logs (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_email VARCHAR(255) NOT NULL,
    recipient_name  VARCHAR(200),
    subject         VARCHAR(500) NOT NULL,
    template        VARCHAR(100),
    context         VARCHAR(100),
    reference_id    UUID,
    status          email_status DEFAULT 'queued',
    error_message   TEXT,
    error_code      VARCHAR(50),
    retry_count     INTEGER DEFAULT 0,
    sent_at         TIMESTAMPTZ,
    sent_by         UUID REFERENCES profiles(id),
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_email_status ON email_logs(status);
CREATE INDEX idx_email_context ON email_logs(context);
CREATE INDEX idx_email_created ON email_logs(created_at DESC);


-- ===== 15. Admin Permissions =====
CREATE TABLE admin_permissions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    section         VARCHAR(100) NOT NULL,
    can_create      BOOLEAN DEFAULT FALSE,
    can_read        BOOLEAN DEFAULT TRUE,
    can_update      BOOLEAN DEFAULT FALSE,
    can_delete      BOOLEAN DEFAULT FALSE,
    granted_by      UUID NOT NULL REFERENCES profiles(id),
    granted_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, section)
);

CREATE INDEX idx_admin_perms_user ON admin_permissions(user_id);


-- ===== 16. Triggers =====

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_student_profiles_updated_at BEFORE UPDATE ON student_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_notices_updated_at BEFORE UPDATE ON notices FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_achievements_updated_at BEFORE UPDATE ON achievements FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_alumni_updated_at BEFORE UPDATE ON alumni FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_faculty_updated_at BEFORE UPDATE ON faculty FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_society_members_updated_at BEFORE UPDATE ON society_members FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_cost_requests_updated_at BEFORE UPDATE ON cost_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_important_data_updated_at BEFORE UPDATE ON important_data FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_work_assignments_updated_at BEFORE UPDATE ON work_assignments FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'student')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();
