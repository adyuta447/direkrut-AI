ALTER TABLE scoring_results
DROP COLUMN IF EXISTS category,
DROP COLUMN IF EXISTS candidate_track,
DROP COLUMN IF EXISTS reasoning,
DROP COLUMN IF EXISTS quotes_json;
