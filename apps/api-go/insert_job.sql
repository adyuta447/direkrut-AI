INSERT INTO jobs (
  id, 
  company_id, 
  created_by, 
  title, 
  description, 
  requirements, 
  location, 
  employment_type, 
  salary_min, 
  salary_max, 
  status, 
  published_at, 
  required_skills, 
  preferred_skills, 
  key_responsibilities, 
  min_experience_years, 
  education_requirement, 
  candidate_type
) VALUES (
  gen_random_uuid(),
  '9fa7ce52-65d1-44e9-a563-5f7fae921e74',
  '2ed205cb-1d62-431a-b758-e37834fb7409',
  'Senior Software Engineer (Fullstack)',
  'Kami mencari Senior Software Engineer yang berpengalaman untuk bergabung dengan tim inti kami. Anda akan bertanggung jawab untuk membangun dan memelihara aplikasi web skala besar dengan arsitektur modern.',
  'Terbiasa bekerja dengan Agile/Scrum
Kemampuan komunikasi yang baik
Proaktif dan bisa bekerja mandiri',
  'Jakarta (Hybrid)',
  'full-time',
  15000000,
  25000000,
  'published',
  now(),
  '["React.js", "Next.js", "TypeScript", "Golang", "PostgreSQL", "Docker"]',
  '["Kubernetes", "AWS", "CI/CD", "Redis", "Microservices"]',
  '- Merancang dan mengembangkan fitur-fitur baru baik di frontend maupun backend
- Melakukan code review dan mentoring untuk junior engineer
- Mengoptimalkan performa aplikasi dan database
- Berkolaborasi dengan tim product dan UI/UX untuk memastikan kualitas pengiriman',
  5,
  'S1 Ilmu Komputer, Teknik Informatika, atau setara',
  'professional'
);
