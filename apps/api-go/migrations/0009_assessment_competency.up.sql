ALTER TABLE assessments 
ADD COLUMN competency_scores JSONB DEFAULT '{}'::jsonb,
ADD COLUMN evidence_confidence VARCHAR(50);
