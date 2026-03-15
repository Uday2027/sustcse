CREATE TABLE email_logs (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_email VARCHAR(255) NOT NULL,
    recipient_name  VARCHAR(200),
    subject         VARCHAR(500) NOT NULL,
    template        VARCHAR(100),
    context         VARCHAR(100),
    reference_id    UUID,
    status          email_status DEFAULT 'queued',
    error_message   TEXT,
    error_code      VARCHAR(50),
    retry_count     INTEGER DEFAULT 0,
    sent_at         TIMESTAMPTZ,
    sent_by         UUID REFERENCES profiles(id),
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_email_status ON email_logs(status);
CREATE INDEX idx_email_context ON email_logs(context);
CREATE INDEX idx_email_created ON email_logs(created_at DESC);
