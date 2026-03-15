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
