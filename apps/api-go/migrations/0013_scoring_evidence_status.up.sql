ALTER TABLE scoring_results
    ADD COLUMN eligibility_status    TEXT,
    ADD COLUMN match_score           NUMERIC,
    ADD COLUMN recommendation_status TEXT,
    ADD COLUMN evidence_coverage     TEXT,
    ADD COLUMN key_gaps_json         JSONB;
