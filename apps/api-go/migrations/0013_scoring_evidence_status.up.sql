ALTER TABLE scoring_results
    ADD COLUMN IF NOT EXISTS eligibility_status    TEXT,
    ADD COLUMN IF NOT EXISTS match_score           NUMERIC,
    ADD COLUMN IF NOT EXISTS recommendation_status TEXT,
    ADD COLUMN IF NOT EXISTS evidence_coverage     TEXT,
    ADD COLUMN IF NOT EXISTS key_gaps_json         JSONB;
