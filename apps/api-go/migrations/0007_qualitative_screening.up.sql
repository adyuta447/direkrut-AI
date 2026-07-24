ALTER TABLE scoring_results
ADD COLUMN category VARCHAR(100),
ADD COLUMN candidate_track VARCHAR(50),
ADD COLUMN reasoning TEXT,
ADD COLUMN quotes_json JSONB;
