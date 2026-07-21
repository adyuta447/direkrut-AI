ALTER TABLE assessments
    ADD COLUMN proctoring_flags JSONB NOT NULL DEFAULT '[]'::jsonb;

-- Object key dari rekaman audio tiap jawaban interview -- dibutuhin biar HRD
-- bisa playback lewat presigned GET URL (lihat internal/storage.PresignGetObject).
ALTER TABLE assessment_items
    ADD COLUMN audio_object_key TEXT;
