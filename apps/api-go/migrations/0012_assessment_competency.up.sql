ALTER TABLE assessments 
ADD COLUMN IF NOT EXISTS competency_scores JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS evidence_confidence VARCHAR(50);
