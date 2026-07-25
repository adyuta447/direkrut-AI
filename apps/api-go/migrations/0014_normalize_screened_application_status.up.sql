-- "screened" pernah dipakai sebagai status internal setelah CV screening,
-- tetapi bukan bagian dari pipeline status aplikasi yang didukung API/web.
-- Pulihkan data lama: interview AI yang sudah selesai masuk review HRD,
-- sedangkan kandidat yang belum selesai interview kembali tetap submitted.
INSERT INTO application_status_history (application_id, from_status, to_status, note)
SELECT
    a.id,
    'screened',
    CASE
        WHEN EXISTS (
            SELECT 1
            FROM assessments ass
            WHERE ass.application_id = a.id
              AND ass.track_type = 'ai_interview'
              AND ass.status = 'completed'
        ) THEN 'under-review'
        ELSE 'submitted'
    END,
    'Normalisasi status legacy setelah perbaikan alur AI screening'
FROM applications a
WHERE a.status = 'screened';

UPDATE applications a
SET
    status = CASE
        WHEN EXISTS (
            SELECT 1
            FROM assessments ass
            WHERE ass.application_id = a.id
              AND ass.track_type = 'ai_interview'
              AND ass.status = 'completed'
        ) THEN 'under-review'
        ELSE 'submitted'
    END,
    updated_at = now()
WHERE a.status = 'screened';
