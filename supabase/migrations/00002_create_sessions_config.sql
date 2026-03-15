CREATE TABLE sessions_config (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_name VARCHAR(50) NOT NULL UNIQUE,
    start_year   INTEGER NOT NULL,
    end_year     INTEGER NOT NULL,
    is_graduated BOOLEAN DEFAULT FALSE,
    created_at   TIMESTAMPTZ DEFAULT NOW()
);
