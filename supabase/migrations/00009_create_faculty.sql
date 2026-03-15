CREATE TABLE faculty (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name        VARCHAR(200) NOT NULL,
    designation      VARCHAR(100) NOT NULL,
    email            VARCHAR(255),
    phone            VARCHAR(20),
    office_room      VARCHAR(50),
    research_areas   JSONB DEFAULT '[]',
    qualifications   JSONB DEFAULT '[]',
    publications     JSONB DEFAULT '[]',
    avatar_url       TEXT,
    personal_website VARCHAR(500),
    joining_date     DATE,
    is_on_leave      BOOLEAN DEFAULT FALSE,
    sort_order       INTEGER DEFAULT 0,
    linked_user_id   UUID REFERENCES profiles(id),
    created_at       TIMESTAMPTZ DEFAULT NOW(),
    updated_at       TIMESTAMPTZ DEFAULT NOW()
);
