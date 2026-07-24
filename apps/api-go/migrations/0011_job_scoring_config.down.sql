DROP TABLE IF EXISTS job_scoring_weight_configs;
DROP TABLE IF EXISTS scoring_weight_configs;

ALTER TABLE scoring_results
    DROP COLUMN IF EXISTS component_scores,
    DROP COLUMN IF EXISTS weights_used;

ALTER TABLE jobs
    DROP COLUMN IF EXISTS required_skills,
    DROP COLUMN IF EXISTS preferred_skills,
    DROP COLUMN IF EXISTS key_responsibilities,
    DROP COLUMN IF EXISTS min_experience_years,
    DROP COLUMN IF EXISTS education_requirement,
    DROP COLUMN IF EXISTS candidate_type;
