CREATE TABLE profiles (
    id               UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name        VARCHAR(200) NOT NULL,
    student_id       VARCHAR(20) UNIQUE,
    email            VARCHAR(255) NOT NULL UNIQUE,
    phone            VARCHAR(20),
    whatsapp         VARCHAR(20),
    session_id       UUID REFERENCES sessions_config(id),
    role             user_role DEFAULT 'student',
    approval_status  approval_status DEFAULT 'pending',
    is_sust_email    BOOLEAN DEFAULT FALSE,
    avatar_url       TEXT,
    bio              TEXT,
    is_active        BOOLEAN DEFAULT TRUE,
    approved_by      UUID REFERENCES profiles(id),
    approved_at      TIMESTAMPTZ,
    rejection_reason TEXT,
    created_at       TIMESTAMPTZ DEFAULT NOW(),
    updated_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_approval ON profiles(approval_status);
CREATE INDEX idx_profiles_session ON profiles(session_id);
CREATE INDEX idx_profiles_student_id ON profiles(student_id);
