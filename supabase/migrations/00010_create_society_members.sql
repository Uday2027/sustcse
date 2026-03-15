CREATE TABLE society_members (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id        UUID REFERENCES profiles(id),
    full_name      VARCHAR(200) NOT NULL,
    position       VARCHAR(200) NOT NULL,
    committee_year VARCHAR(20) NOT NULL,
    member_status  society_member_status DEFAULT 'current',
    avatar_url     TEXT,
    student_id     VARCHAR(20),
    email          VARCHAR(255),
    phone          VARCHAR(20),
    bio            TEXT,
    sort_order     INTEGER DEFAULT 0,
    created_by     UUID REFERENCES profiles(id),
    created_at     TIMESTAMPTZ DEFAULT NOW(),
    updated_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_society_year ON society_members(committee_year);
CREATE INDEX idx_society_status ON society_members(member_status);
