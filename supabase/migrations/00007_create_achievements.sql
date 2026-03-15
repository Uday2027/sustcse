CREATE TABLE achievements (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title            VARCHAR(500) NOT NULL,
    description      TEXT NOT NULL,
    achievement_date DATE,
    category         VARCHAR(100),
    image_urls       JSONB DEFAULT '[]',
    link             VARCHAR(500),
    achieved_by      VARCHAR(300),
    created_by       UUID NOT NULL REFERENCES profiles(id),
    is_featured      BOOLEAN DEFAULT FALSE,
    created_at       TIMESTAMPTZ DEFAULT NOW(),
    updated_at       TIMESTAMPTZ DEFAULT NOW()
);
