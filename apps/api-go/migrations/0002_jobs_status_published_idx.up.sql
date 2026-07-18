-- Query listing publik yang sebenarnya jalan: WHERE status='published'
-- ORDER BY published_at DESC. Index di 0001_init cuma nutupin kolom FK
-- (company_id, created_by), jadi query ini masih full-scan tanpa index ini.
-- Composite index ini yang bikin CACHE MISS tetap murah, bukan cuma cache
-- hit-nya doang.
CREATE INDEX IF NOT EXISTS jobs_status_published_at_idx
    ON jobs (status, published_at DESC);
