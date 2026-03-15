CREATE TABLE admin_permissions (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    section    VARCHAR(100) NOT NULL,
    can_create BOOLEAN DEFAULT FALSE,
    can_read   BOOLEAN DEFAULT TRUE,
    can_update BOOLEAN DEFAULT FALSE,
    can_delete BOOLEAN DEFAULT FALSE,
    granted_by UUID NOT NULL REFERENCES profiles(id),
    granted_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, section)
);

CREATE INDEX idx_admin_perms_user ON admin_permissions(user_id);
