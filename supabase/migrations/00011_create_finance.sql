CREATE TABLE fiscal_years (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(50) NOT NULL UNIQUE,
    start_date      DATE NOT NULL,
    end_date        DATE NOT NULL,
    status          fiscal_year_status DEFAULT 'active',
    opening_balance DECIMAL(12,2) DEFAULT 0,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE bank_statements (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fiscal_year_id UUID NOT NULL REFERENCES fiscal_years(id),
    statement_date DATE NOT NULL,
    description    VARCHAR(500),
    file_url       TEXT NOT NULL,
    uploaded_by    UUID NOT NULL REFERENCES profiles(id),
    created_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE approver_config (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    level          VARCHAR(5) NOT NULL CHECK (level IN ('L1', 'L2')),
    user_id        UUID NOT NULL REFERENCES profiles(id),
    fiscal_year_id UUID NOT NULL REFERENCES fiscal_years(id),
    is_active      BOOLEAN DEFAULT TRUE,
    assigned_by    UUID NOT NULL REFERENCES profiles(id),
    assigned_at    TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(level, user_id, fiscal_year_id)
);

CREATE TABLE cost_requests (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fiscal_year_id   UUID NOT NULL REFERENCES fiscal_years(id),
    title            VARCHAR(500) NOT NULL,
    description      TEXT,
    amount           DECIMAL(12,2) NOT NULL,
    category         VARCHAR(100),
    proof_urls       JSONB DEFAULT '[]',
    status           cost_status DEFAULT 'draft',
    requested_by     UUID NOT NULL REFERENCES profiles(id),
    l1_approver_id   UUID REFERENCES profiles(id),
    l1_approved_at   TIMESTAMPTZ,
    l1_remarks       TEXT,
    l2_approver_id   UUID REFERENCES profiles(id),
    l2_approved_at   TIMESTAMPTZ,
    l2_remarks       TEXT,
    check_number     VARCHAR(100),
    check_date       DATE,
    rejection_reason TEXT,
    rejected_by      UUID REFERENCES profiles(id),
    rejected_at      TIMESTAMPTZ,
    created_at       TIMESTAMPTZ DEFAULT NOW(),
    updated_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_cost_status ON cost_requests(status);
CREATE INDEX idx_cost_fiscal ON cost_requests(fiscal_year_id);

CREATE TABLE cost_approval_log (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cost_request_id   UUID NOT NULL REFERENCES cost_requests(id) ON DELETE CASCADE,
    action            VARCHAR(50) NOT NULL,
    actor_id          UUID NOT NULL REFERENCES profiles(id),
    actor_name        VARCHAR(200) NOT NULL,
    actor_designation VARCHAR(200),
    remarks           TEXT,
    created_at        TIMESTAMPTZ DEFAULT NOW()
);
