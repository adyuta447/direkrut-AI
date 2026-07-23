CREATE UNIQUE INDEX IF NOT EXISTS users_email_lower_active_idx
    ON users (LOWER(email))
    WHERE deleted_at IS NULL;
