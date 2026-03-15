CREATE TABLE important_data (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title       VARCHAR(500) NOT NULL,
    description TEXT,
    category    VARCHAR(100),
    file_type   VARCHAR(10) NOT NULL,
    file_url    TEXT NOT NULL,
    file_size   BIGINT,
    uploaded_by UUID NOT NULL REFERENCES profiles(id),
    is_public   BOOLEAN DEFAULT TRUE,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);
