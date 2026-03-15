CREATE TABLE work_assignments (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title        VARCHAR(500) NOT NULL,
    description  TEXT,
    priority     priority_level DEFAULT 'medium',
    status       assignment_status DEFAULT 'pending',
    assigned_to  UUID NOT NULL REFERENCES profiles(id),
    assigned_by  UUID NOT NULL REFERENCES profiles(id),
    due_date     TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    attachments  JSONB DEFAULT '[]',
    notes        TEXT,
    created_at   TIMESTAMPTZ DEFAULT NOW(),
    updated_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_assignments_assignee ON work_assignments(assigned_to);
CREATE INDEX idx_assignments_status ON work_assignments(status);
CREATE INDEX idx_assignments_priority ON work_assignments(priority);
