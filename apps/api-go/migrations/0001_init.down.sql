-- Rollback migrasi awal: drop seluruh tabel dalam urutan kebalikan dari
-- dependency FK-nya. Extension (pgcrypto, vector) sengaja gak di-drop krn
-- bisa dipakai migrasi lain / masih nempel ke cluster.

DROP TABLE IF EXISTS audit_logs;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS chat_messages;
DROP TABLE IF EXISTS chat_conversations;
DROP TABLE IF EXISTS decisions;
DROP TABLE IF EXISTS interview_transcripts;
DROP TABLE IF EXISTS interviews;
DROP TABLE IF EXISTS assessment_items;
DROP TABLE IF EXISTS assessments;
DROP TABLE IF EXISTS scoring_results;
DROP TABLE IF EXISTS cv_parse_results;
DROP TABLE IF EXISTS application_status_history;
DROP TABLE IF EXISTS applications;
DROP TABLE IF EXISTS candidate_embeddings;
DROP TABLE IF EXISTS candidate_skills;
DROP TABLE IF EXISTS candidates;
DROP TABLE IF EXISTS job_embeddings;
DROP TABLE IF EXISTS job_skills;
DROP TABLE IF EXISTS jobs;
DROP TABLE IF EXISTS skills;
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS subscriptions;
DROP TABLE IF EXISTS subscription_plans;
DROP TABLE IF EXISTS hrd_users;
DROP TABLE IF EXISTS companies;
DROP TABLE IF EXISTS refresh_tokens;
DROP TABLE IF EXISTS users;
