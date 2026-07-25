-- Departemen lowongan sebelumnya hanya hidup di state frontend dan response
-- API selalu menggantinya dengan industri perusahaan. Simpan sebagai atribut
-- lowongan supaya create/update/read menghasilkan kategori yang konsisten.
ALTER TABLE jobs ADD COLUMN department TEXT;

UPDATE jobs AS j
SET department = COALESCE(NULLIF(BTRIM(c.industry), ''), 'Umum')
FROM companies AS c
WHERE c.id = j.company_id;

UPDATE jobs
SET department = 'Umum'
WHERE department IS NULL OR BTRIM(department) = '';

ALTER TABLE jobs
    ALTER COLUMN department SET DEFAULT 'Umum',
    ALTER COLUMN department SET NOT NULL;
