ALTER TABLE companies
  ADD COLUMN akta_pendirian_url TEXT,
  ADD COLUMN nib_url TEXT,
  ADD COLUMN npwp_url TEXT,
  ADD COLUMN surat_kuasa_url TEXT,
  ADD COLUMN verification_status TEXT NOT NULL DEFAULT 'pending';
