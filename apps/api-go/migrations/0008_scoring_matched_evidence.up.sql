-- Bukti kecocokan CV (bullet points hasil AI matching) sebelumnya cuma
-- dibalikin langsung dari respons POST /screen yang baru ngitung, gak pernah
-- disimpen -- jadi ilang begitu halaman di-reload. Kolom ini bikin dia
-- persisten kayak overall_score.
ALTER TABLE scoring_results
    ADD COLUMN matched_evidence JSONB;
