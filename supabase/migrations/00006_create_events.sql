CREATE TABLE events (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title             VARCHAR(500) NOT NULL,
    description       TEXT NOT NULL,
    event_type        VARCHAR(100),
    venue             VARCHAR(300),
    start_date        TIMESTAMPTZ NOT NULL,
    end_date          TIMESTAMPTZ,
    registration_url  VARCHAR(500),
    cover_image_url   TEXT,
    attachment_urls   JSONB DEFAULT '[]',
    organized_by      VARCHAR(200) DEFAULT 'CSE Society',
    created_by        UUID NOT NULL REFERENCES profiles(id),
    email_sent        BOOLEAN DEFAULT FALSE,
    email_toggle      BOOLEAN DEFAULT FALSE,
    is_published      BOOLEAN DEFAULT TRUE,
    created_at        TIMESTAMPTZ DEFAULT NOW(),
    updated_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_events_start ON events(start_date DESC);
