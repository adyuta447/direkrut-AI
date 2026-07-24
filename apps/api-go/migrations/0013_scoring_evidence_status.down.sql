ALTER TABLE scoring_results
    DROP COLUMN eligibility_status,
    DROP COLUMN match_score,
    DROP COLUMN recommendation_status,
    DROP COLUMN evidence_coverage,
    DROP COLUMN key_gaps_json;
