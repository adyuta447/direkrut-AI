ALTER TABLE candidates
    ADD COLUMN age INTEGER,
    ADD COLUMN gender TEXT,
    ADD COLUMN about TEXT,
    ADD COLUMN photo_url TEXT,
    ADD COLUMN cover_url TEXT,
    ADD COLUMN experience JSONB NOT NULL DEFAULT '[]'::jsonb,
    ADD COLUMN education JSONB NOT NULL DEFAULT '[]'::jsonb,
    ADD COLUMN links JSONB NOT NULL DEFAULT '[]'::jsonb;
