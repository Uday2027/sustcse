CREATE TABLE alumni (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name        VARCHAR(200) NOT NULL,
    student_id       VARCHAR(20),
    session_id       UUID REFERENCES sessions_config(id),
    graduation_year  INTEGER,
    email            VARCHAR(255),
    phone            VARCHAR(20),
    current_company  VARCHAR(300),
    current_position VARCHAR(300),
    location         VARCHAR(200),
    linkedin_url     VARCHAR(500),
    avatar_url       TEXT,
    bio              TEXT,
    added_by         UUID REFERENCES profiles(id),
    auto_added       BOOLEAN DEFAULT FALSE,
    linked_user_id   UUID REFERENCES profiles(id),
    created_at       TIMESTAMPTZ DEFAULT NOW(),
    updated_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_alumni_session ON alumni(session_id);
CREATE INDEX idx_alumni_grad_year ON alumni(graduation_year);
