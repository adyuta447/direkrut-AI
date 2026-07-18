import { Job, Application, User } from "./types";

export const mockUser: User = {
  id: "user-1",
  name: "Budi HRD",
  email: "budi@direkrutai.com",
  role: "hrd",
};

export const mockJobs: Job[] = [
  {
    "id": "job-100",
    "title": "People Business Partner (Data)",
    "company": "Maju Bersama Tbk",
    "location": "Medan",
    "type": "Paruh Waktu",
    "description": "Posisi profesional di bidang Olahraga & Rekreasi.",
    "department": "Olahraga & Rekreasi",
    "requirements": [
      "Analisis",
      "Manajemen",
      "Komunikasi"
    ],
    "detailedQualifications": [
      "Pengalaman kerja relevan minimal 2 tahun.",
      "Kemampuan problem-solving yang kuat.",
      "Bisa bekerja dalam tim maupun individu."
    ],
    "salaryRange": "Rp 11.000.000 - Rp 30.000.000",
    "industry": "Olahraga & Rekreasi",
    "questions": [
      "Ceritakan pengalaman terbesar Anda di bidang ini.",
      "Bagaimana cara Anda menyelesaikan konflik di tempat kerja?"
    ],
    "posted": "11 hari yang lalu",
    "applicantCount": 45,
    "status": "active",
    "timeline": { "from": "2024-01-01T00:00:00.000Z", "to": "2024-12-31T00:00:00.000Z" }
  },
  {
    "id": "job-101",
    "title": "District Sales Manager",
    "company": "PT Nusantara Jaya",
    "location": "Medan",
    "type": "Kontrak",
    "description": "Posisi profesional di bidang Pertanian, Hewan & Konservasi.",
    "department": "Pertanian, Hewan & Konservasi",
    "requirements": [
      "Analisis",
      "Manajemen",
      "Komunikasi"
    ],
    "detailedQualifications": [
      "Pengalaman kerja relevan minimal 2 tahun.",
      "Kemampuan problem-solving yang kuat.",
      "Bisa bekerja dalam tim maupun individu."
    ],
    "salaryRange": "Rp 9.000.000 - Rp 20.000.000",
    "industry": "Pertanian, Hewan & Konservasi",
    "questions": [
      "Ceritakan pengalaman terbesar Anda di bidang ini.",
      "Bagaimana cara Anda menyelesaikan konflik di tempat kerja?"
    ],
    "posted": "9 hari yang lalu",
    "applicantCount": 50,
    "status": "active",
    "timeline": { "from": "2024-01-01T00:00:00.000Z", "to": "2024-12-31T00:00:00.000Z" }
  },
  {
    "id": "job-102",
    "title": "Software Engineer - Backend",
    "company": "TechIndo Makmur",
    "location": "Bandung",
    "type": "Paruh Waktu",
    "description": "Posisi profesional di bidang Pekerjaan Lepas.",
    "department": "Pekerjaan Lepas",
    "requirements": [
      "Analisis",
      "Manajemen",
      "Komunikasi"
    ],
    "detailedQualifications": [
      "Pengalaman kerja relevan minimal 2 tahun.",
      "Kemampuan problem-solving yang kuat.",
      "Bisa bekerja dalam tim maupun individu."
    ],
    "salaryRange": "Rp 5.000.000 - Rp 25.000.000",
    "industry": "Pekerjaan Lepas",
    "questions": [
      "Ceritakan pengalaman terbesar Anda di bidang ini.",
      "Bagaimana cara Anda menyelesaikan konflik di tempat kerja?"
    ],
    "posted": "9 hari yang lalu",
    "applicantCount": 29,
    "status": "active",
    "timeline": { "from": "2024-01-01T00:00:00.000Z", "to": "2024-12-31T00:00:00.000Z" }
  },
  {
    "id": "job-103",
    "title": "Software Engineer Intern",
    "company": "Maju Bersama Tbk",
    "location": "Medan",
    "type": "Kontrak",
    "description": "Posisi profesional di bidang Teknik.",
    "department": "Teknik",
    "requirements": [
      "Analisis",
      "Manajemen",
      "Komunikasi"
    ],
    "detailedQualifications": [
      "Pengalaman kerja relevan minimal 2 tahun.",
      "Kemampuan problem-solving yang kuat.",
      "Bisa bekerja dalam tim maupun individu."
    ],
    "salaryRange": "Rp 9.000.000 - Rp 21.000.000",
    "industry": "Teknik",
    "questions": [
      "Ceritakan pengalaman terbesar Anda di bidang ini.",
      "Bagaimana cara Anda menyelesaikan konflik di tempat kerja?"
    ],
    "posted": "12 hari yang lalu",
    "applicantCount": 32,
    "status": "active",
    "timeline": { "from": "2024-01-01T00:00:00.000Z", "to": "2024-12-31T00:00:00.000Z" }
  },
  {
    "id": "job-104",
    "title": "Local Language Specialist",
    "company": "Solusi Bangsa",
    "location": "Bandung",
    "type": "Penuh Waktu",
    "description": "Posisi profesional di bidang Sains & Teknologi.",
    "department": "Sains & Teknologi",
    "requirements": [
      "Analisis",
      "Manajemen",
      "Komunikasi"
    ],
    "detailedQualifications": [
      "Pengalaman kerja relevan minimal 2 tahun.",
      "Kemampuan problem-solving yang kuat.",
      "Bisa bekerja dalam tim maupun individu."
    ],
    "salaryRange": "Rp 11.000.000 - Rp 23.000.000",
    "industry": "Sains & Teknologi",
    "questions": [
      "Ceritakan pengalaman terbesar Anda di bidang ini.",
      "Bagaimana cara Anda menyelesaikan konflik di tempat kerja?"
    ],
    "posted": "10 hari yang lalu",
    "applicantCount": 49,
    "status": "active",
    "timeline": { "from": "2024-01-01T00:00:00.000Z", "to": "2024-12-31T00:00:00.000Z" }
  },
  {
    "id": "job-105",
    "title": "Regional Sales Leader",
    "company": "Karya Cipta",
    "location": "Remote",
    "type": "Magang",
    "description": "Posisi profesional di bidang Hukum.",
    "department": "Hukum",
    "requirements": [
      "Analisis",
      "Manajemen",
      "Komunikasi"
    ],
    "detailedQualifications": [
      "Pengalaman kerja relevan minimal 2 tahun.",
      "Kemampuan problem-solving yang kuat.",
      "Bisa bekerja dalam tim maupun individu."
    ],
    "salaryRange": "Rp 9.000.000 - Rp 19.000.000",
    "industry": "Hukum",
    "questions": [
      "Ceritakan pengalaman terbesar Anda di bidang ini.",
      "Bagaimana cara Anda menyelesaikan konflik di tempat kerja?"
    ],
    "posted": "10 hari yang lalu",
    "applicantCount": 10,
    "status": "active",
    "timeline": { "from": "2024-01-01T00:00:00.000Z", "to": "2024-12-31T00:00:00.000Z" }
  },
  {
    "id": "job-106",
    "title": "Legal Manager - Fintech",
    "company": "TechIndo Makmur",
    "location": "Jakarta",
    "type": "Paruh Waktu",
    "description": "Menghitung estimasi biaya dan material untuk proyek baru.",
    "department": "Konstruksi",
    "requirements": [
      "Perhitungan RAB",
      "Analisis Biaya",
      "Material Konstruksi"
    ],
    "detailedQualifications": [
      "Pengalaman kerja relevan minimal 2 tahun.",
      "Kemampuan problem-solving yang kuat.",
      "Bisa bekerja dalam tim maupun individu."
    ],
    "salaryRange": "Rp 8.000.000 - Rp 19.000.000",
    "industry": "Konstruksi",
    "questions": [
      "Ceritakan pengalaman terbesar Anda di bidang ini.",
      "Bagaimana cara Anda menyelesaikan konflik di tempat kerja?"
    ],
    "posted": "13 hari yang lalu",
    "applicantCount": 29,
    "status": "active",
    "timeline": { "from": "2024-01-01T00:00:00.000Z", "to": "2024-12-31T00:00:00.000Z" }
  },
  {
    "id": "job-107",
    "title": "Software Engineer Intern",
    "company": "PT Nusantara Jaya",
    "location": "Surabaya",
    "type": "Paruh Waktu",
    "description": "Posisi profesional di bidang Teknik.",
    "department": "Teknik",
    "requirements": [
      "Analisis",
      "Manajemen",
      "Komunikasi"
    ],
    "detailedQualifications": [
      "Pengalaman kerja relevan minimal 2 tahun.",
      "Kemampuan problem-solving yang kuat.",
      "Bisa bekerja dalam tim maupun individu."
    ],
    "salaryRange": "Rp 6.000.000 - Rp 23.000.000",
    "industry": "Teknik",
    "questions": [
      "Ceritakan pengalaman terbesar Anda di bidang ini.",
      "Bagaimana cara Anda menyelesaikan konflik di tempat kerja?"
    ],
    "posted": "14 hari yang lalu",
    "applicantCount": 49,
    "status": "active",
    "timeline": { "from": "2024-01-01T00:00:00.000Z", "to": "2024-12-31T00:00:00.000Z" }
  },
  {
    "id": "job-108",
    "title": "AI Linguistic Voice Intern",
    "company": "PT Nusantara Jaya",
    "location": "Remote",
    "type": "Kontrak",
    "description": "Posisi profesional di bidang Hospitaliti & Pariwisata.",
    "department": "Hospitaliti & Pariwisata",
    "requirements": [
      "Analisis",
      "Manajemen",
      "Komunikasi"
    ],
    "detailedQualifications": [
      "Pengalaman kerja relevan minimal 2 tahun.",
      "Kemampuan problem-solving yang kuat.",
      "Bisa bekerja dalam tim maupun individu."
    ],
    "salaryRange": "Rp 14.000.000 - Rp 22.000.000",
    "industry": "Hospitaliti & Pariwisata",
    "questions": [
      "Ceritakan pengalaman terbesar Anda di bidang ini.",
      "Bagaimana cara Anda menyelesaikan konflik di tempat kerja?"
    ],
    "posted": "7 hari yang lalu",
    "applicantCount": 48,
    "status": "active",
    "timeline": { "from": "2024-01-01T00:00:00.000Z", "to": "2024-12-31T00:00:00.000Z" }
  },
  {
    "id": "job-109",
    "title": "Senior IT GRC Analyst",
    "company": "Bintang Sejahtera",
    "location": "Semarang",
    "type": "Magang",
    "description": "Posisi profesional di bidang Asuransi & Dana Pensiun.",
    "department": "Asuransi & Dana Pensiun",
    "requirements": [
      "Analisis",
      "Manajemen",
      "Komunikasi"
    ],
    "detailedQualifications": [
      "Pengalaman kerja relevan minimal 2 tahun.",
      "Kemampuan problem-solving yang kuat.",
      "Bisa bekerja dalam tim maupun individu."
    ],
    "salaryRange": "Rp 6.000.000 - Rp 18.000.000",
    "industry": "Asuransi & Dana Pensiun",
    "questions": [
      "Ceritakan pengalaman terbesar Anda di bidang ini.",
      "Bagaimana cara Anda menyelesaikan konflik di tempat kerja?"
    ],
    "posted": "14 hari yang lalu",
    "applicantCount": 27,
    "status": "active",
    "timeline": { "from": "2024-01-01T00:00:00.000Z", "to": "2024-12-31T00:00:00.000Z" }
  },
  {
    "id": "job-110",
    "title": "People Business Partner (Data)",
    "company": "PT Nusantara Jaya",
    "location": "Medan",
    "type": "Paruh Waktu",
    "description": "Posisi profesional di bidang Olahraga & Rekreasi.",
    "department": "Olahraga & Rekreasi",
    "requirements": [
      "Analisis",
      "Manajemen",
      "Komunikasi"
    ],
    "detailedQualifications": [
      "Pengalaman kerja relevan minimal 2 tahun.",
      "Kemampuan problem-solving yang kuat.",
      "Bisa bekerja dalam tim maupun individu."
    ],
    "salaryRange": "Rp 5.000.000 - Rp 29.000.000",
    "industry": "Olahraga & Rekreasi",
    "questions": [
      "Ceritakan pengalaman terbesar Anda di bidang ini.",
      "Bagaimana cara Anda menyelesaikan konflik di tempat kerja?"
    ],
    "posted": "11 hari yang lalu",
    "applicantCount": 50,
    "status": "active",
    "timeline": { "from": "2024-01-01T00:00:00.000Z", "to": "2024-12-31T00:00:00.000Z" }
  },
  {
    "id": "job-111",
    "title": "Lending Risk Analyst",
    "company": "Grup Merdeka",
    "location": "Medan",
    "type": "Magang",
    "description": "Posisi profesional di bidang Konsultasi & Strategi.",
    "department": "Konsultasi & Strategi",
    "requirements": [
      "Analisis",
      "Manajemen",
      "Komunikasi"
    ],
    "detailedQualifications": [
      "Pengalaman kerja relevan minimal 2 tahun.",
      "Kemampuan problem-solving yang kuat.",
      "Bisa bekerja dalam tim maupun individu."
    ],
    "salaryRange": "Rp 8.000.000 - Rp 26.000.000",
    "industry": "Konsultasi & Strategi",
    "questions": [
      "Ceritakan pengalaman terbesar Anda di bidang ini.",
      "Bagaimana cara Anda menyelesaikan konflik di tempat kerja?"
    ],
    "posted": "5 hari yang lalu",
    "applicantCount": 34,
    "status": "active",
    "timeline": { "from": "2024-01-01T00:00:00.000Z", "to": "2024-12-31T00:00:00.000Z" }
  },
  {
    "id": "job-112",
    "title": "Tax Intern",
    "company": "PT Nusantara Jaya",
    "location": "Surabaya",
    "type": "Penuh Waktu",
    "description": "Posisi profesional di bidang Ritel & Produk Konsumen.",
    "department": "Ritel & Produk Konsumen",
    "requirements": [
      "Analisis",
      "Manajemen",
      "Komunikasi"
    ],
    "detailedQualifications": [
      "Pengalaman kerja relevan minimal 2 tahun.",
      "Kemampuan problem-solving yang kuat.",
      "Bisa bekerja dalam tim maupun individu."
    ],
    "salaryRange": "Rp 9.000.000 - Rp 22.000.000",
    "industry": "Ritel & Produk Konsumen",
    "questions": [
      "Ceritakan pengalaman terbesar Anda di bidang ini.",
      "Bagaimana cara Anda menyelesaikan konflik di tempat kerja?"
    ],
    "posted": "13 hari yang lalu",
    "applicantCount": 21,
    "status": "active",
    "timeline": { "from": "2024-01-01T00:00:00.000Z", "to": "2024-12-31T00:00:00.000Z" }
  },
  {
    "id": "job-113",
    "title": "People Business Partner (Data)",
    "company": "Bintang Sejahtera",
    "location": "Jakarta",
    "type": "Paruh Waktu",
    "description": "Posisi profesional di bidang Olahraga & Rekreasi.",
    "department": "Olahraga & Rekreasi",
    "requirements": [
      "Analisis",
      "Manajemen",
      "Komunikasi"
    ],
    "detailedQualifications": [
      "Pengalaman kerja relevan minimal 2 tahun.",
      "Kemampuan problem-solving yang kuat.",
      "Bisa bekerja dalam tim maupun individu."
    ],
    "salaryRange": "Rp 7.000.000 - Rp 23.000.000",
    "industry": "Olahraga & Rekreasi",
    "questions": [
      "Ceritakan pengalaman terbesar Anda di bidang ini.",
      "Bagaimana cara Anda menyelesaikan konflik di tempat kerja?"
    ],
    "posted": "11 hari yang lalu",
    "applicantCount": 34,
    "status": "active",
    "timeline": { "from": "2024-01-01T00:00:00.000Z", "to": "2024-12-31T00:00:00.000Z" }
  },
  {
    "id": "job-114",
    "title": "Regulatory Manager",
    "company": "Solusi Bangsa",
    "location": "Jakarta",
    "type": "Penuh Waktu",
    "description": "Memberikan pelayanan medis langsung kepada pasien di rumah sakit.",
    "department": "Kesehatan & Medis",
    "requirements": [
      "STR Aktif",
      "Asuhan Keperawatan",
      "Komunikasi Pasien"
    ],
    "detailedQualifications": [
      "Pengalaman kerja relevan minimal 2 tahun.",
      "Kemampuan problem-solving yang kuat.",
      "Bisa bekerja dalam tim maupun individu."
    ],
    "salaryRange": "Rp 14.000.000 - Rp 17.000.000",
    "industry": "Kesehatan & Medis",
    "questions": [
      "Ceritakan pengalaman terbesar Anda di bidang ini.",
      "Bagaimana cara Anda menyelesaikan konflik di tempat kerja?"
    ],
    "posted": "2 hari yang lalu",
    "applicantCount": 16,
    "status": "active",
    "timeline": { "from": "2024-01-01T00:00:00.000Z", "to": "2024-12-31T00:00:00.000Z" }
  },
  {
    "id": "job-115",
    "title": "Regulatory Manager",
    "company": "TechIndo Makmur",
    "location": "Bandung",
    "type": "Kontrak",
    "description": "Memberikan pelayanan medis langsung kepada pasien di rumah sakit.",
    "department": "Kesehatan & Medis",
    "requirements": [
      "STR Aktif",
      "Asuhan Keperawatan",
      "Komunikasi Pasien"
    ],
    "detailedQualifications": [
      "Pengalaman kerja relevan minimal 2 tahun.",
      "Kemampuan problem-solving yang kuat.",
      "Bisa bekerja dalam tim maupun individu."
    ],
    "salaryRange": "Rp 14.000.000 - Rp 23.000.000",
    "industry": "Kesehatan & Medis",
    "questions": [
      "Ceritakan pengalaman terbesar Anda di bidang ini.",
      "Bagaimana cara Anda menyelesaikan konflik di tempat kerja?"
    ],
    "posted": "9 hari yang lalu",
    "applicantCount": 26,
    "status": "active",
    "timeline": { "from": "2024-01-01T00:00:00.000Z", "to": "2024-12-31T00:00:00.000Z" }
  },
  {
    "id": "job-116",
    "title": "Media Relations Intern",
    "company": "Grup Merdeka",
    "location": "Remote",
    "type": "Penuh Waktu",
    "description": "Memastikan operasional kantor berjalan lancar setiap hari.",
    "department": "Administrasi & Dukungan Perkantoran",
    "requirements": [
      "Manajemen Inventaris",
      "Komunikasi",
      "Penjadwalan"
    ],
    "detailedQualifications": [
      "Pengalaman kerja relevan minimal 2 tahun.",
      "Kemampuan problem-solving yang kuat.",
      "Bisa bekerja dalam tim maupun individu."
    ],
    "salaryRange": "Rp 15.000.000 - Rp 30.000.000",
    "industry": "Administrasi & Dukungan Perkantoran",
    "questions": [
      "Ceritakan pengalaman terbesar Anda di bidang ini.",
      "Bagaimana cara Anda menyelesaikan konflik di tempat kerja?"
    ],
    "posted": "11 hari yang lalu",
    "applicantCount": 19,
    "status": "active",
    "timeline": { "from": "2024-01-01T00:00:00.000Z", "to": "2024-12-31T00:00:00.000Z" }
  },
  {
    "id": "job-117",
    "title": "Business Strategy Lead",
    "company": "Solusi Bangsa",
    "location": "Jakarta",
    "type": "Penuh Waktu",
    "description": "Menjaga retensi dan kepuasan klien B2B.",
    "department": "Call Center & Layanan Konsumen",
    "requirements": [
      "Resolusi Konflik",
      "CRM",
      "Komunikasi"
    ],
    "detailedQualifications": [
      "Pengalaman kerja relevan minimal 2 tahun.",
      "Kemampuan problem-solving yang kuat.",
      "Bisa bekerja dalam tim maupun individu."
    ],
    "salaryRange": "Rp 6.000.000 - Rp 29.000.000",
    "industry": "Call Center & Layanan Konsumen",
    "questions": [
      "Ceritakan pengalaman terbesar Anda di bidang ini.",
      "Bagaimana cara Anda menyelesaikan konflik di tempat kerja?"
    ],
    "posted": "3 hari yang lalu",
    "applicantCount": 42,
    "status": "active",
    "timeline": { "from": "2024-01-01T00:00:00.000Z", "to": "2024-12-31T00:00:00.000Z" }
  },
  {
    "id": "job-118",
    "title": "Business Continuity Management",
    "company": "Grup Merdeka",
    "location": "Surabaya",
    "type": "Penuh Waktu",
    "description": "Posisi profesional di bidang Sumber Daya Manusia & Perekrutan.",
    "department": "Sumber Daya Manusia & Perekrutan",
    "requirements": [
      "Analisis",
      "Manajemen",
      "Komunikasi"
    ],
    "detailedQualifications": [
      "Pengalaman kerja relevan minimal 2 tahun.",
      "Kemampuan problem-solving yang kuat.",
      "Bisa bekerja dalam tim maupun individu."
    ],
    "salaryRange": "Rp 6.000.000 - Rp 19.000.000",
    "industry": "Sumber Daya Manusia & Perekrutan",
    "questions": [
      "Ceritakan pengalaman terbesar Anda di bidang ini.",
      "Bagaimana cara Anda menyelesaikan konflik di tempat kerja?"
    ],
    "posted": "5 hari yang lalu",
    "applicantCount": 43,
    "status": "active",
    "timeline": { "from": "2024-01-01T00:00:00.000Z", "to": "2024-12-31T00:00:00.000Z" }
  },
  {
    "id": "job-119",
    "title": "Data Scientist",
    "company": "Maju Bersama Tbk",
    "location": "Medan",
    "type": "Penuh Waktu",
    "description": "Mengevaluasi kelayakan kredit nasabah perusahaan.",
    "department": "Perbankan & Layanan Finansial",
    "requirements": [
      "Analisis Risiko",
      "Hukum Perbankan",
      "Penilaian Kredit"
    ],
    "detailedQualifications": [
      "Pengalaman kerja relevan minimal 2 tahun.",
      "Kemampuan problem-solving yang kuat.",
      "Bisa bekerja dalam tim maupun individu."
    ],
    "salaryRange": "Rp 8.000.000 - Rp 26.000.000",
    "industry": "Perbankan & Layanan Finansial",
    "questions": [
      "Ceritakan pengalaman terbesar Anda di bidang ini.",
      "Bagaimana cara Anda menyelesaikan konflik di tempat kerja?"
    ],
    "posted": "1 hari yang lalu",
    "applicantCount": 27,
    "status": "active",
    "timeline": { "from": "2024-01-01T00:00:00.000Z", "to": "2024-12-31T00:00:00.000Z" }
  },
  {
    "id": "job-120",
    "title": "Senior Business Analyst",
    "company": "Karya Cipta",
    "location": "Remote",
    "type": "Paruh Waktu",
    "description": "Menjawab pertanyaan dan keluhan pelanggan via telepon.",
    "department": "Call Center & Layanan Konsumen",
    "requirements": [
      "Telepon",
      "Empati",
      "Penyelesaian Masalah"
    ],
    "detailedQualifications": [
      "Pengalaman kerja relevan minimal 2 tahun.",
      "Kemampuan problem-solving yang kuat.",
      "Bisa bekerja dalam tim maupun individu."
    ],
    "salaryRange": "Rp 15.000.000 - Rp 18.000.000",
    "industry": "Call Center & Layanan Konsumen",
    "questions": [
      "Ceritakan pengalaman terbesar Anda di bidang ini.",
      "Bagaimana cara Anda menyelesaikan konflik di tempat kerja?"
    ],
    "posted": "3 hari yang lalu",
    "applicantCount": 50,
    "status": "active",
    "timeline": { "from": "2024-01-01T00:00:00.000Z", "to": "2024-12-31T00:00:00.000Z" }
  },
  {
    "id": "job-121",
    "title": "Process Improvement Manager",
    "company": "Bintang Sejahtera",
    "location": "Surabaya",
    "type": "Kontrak",
    "description": "Posisi profesional di bidang Pemerintahan & Pertahanan.",
    "department": "Pemerintahan & Pertahanan",
    "requirements": [
      "Analisis",
      "Manajemen",
      "Komunikasi"
    ],
    "detailedQualifications": [
      "Pengalaman kerja relevan minimal 2 tahun.",
      "Kemampuan problem-solving yang kuat.",
      "Bisa bekerja dalam tim maupun individu."
    ],
    "salaryRange": "Rp 13.000.000 - Rp 20.000.000",
    "industry": "Pemerintahan & Pertahanan",
    "questions": [
      "Ceritakan pengalaman terbesar Anda di bidang ini.",
      "Bagaimana cara Anda menyelesaikan konflik di tempat kerja?"
    ],
    "posted": "5 hari yang lalu",
    "applicantCount": 34,
    "status": "active",
    "timeline": { "from": "2024-01-01T00:00:00.000Z", "to": "2024-12-31T00:00:00.000Z" }
  },
  {
    "id": "job-122",
    "title": "Tax Intern",
    "company": "Solusi Bangsa",
    "location": "Bandung",
    "type": "Magang",
    "description": "Posisi profesional di bidang Ritel & Produk Konsumen.",
    "department": "Ritel & Produk Konsumen",
    "requirements": [
      "Analisis",
      "Manajemen",
      "Komunikasi"
    ],
    "detailedQualifications": [
      "Pengalaman kerja relevan minimal 2 tahun.",
      "Kemampuan problem-solving yang kuat.",
      "Bisa bekerja dalam tim maupun individu."
    ],
    "salaryRange": "Rp 10.000.000 - Rp 30.000.000",
    "industry": "Ritel & Produk Konsumen",
    "questions": [
      "Ceritakan pengalaman terbesar Anda di bidang ini.",
      "Bagaimana cara Anda menyelesaikan konflik di tempat kerja?"
    ],
    "posted": "3 hari yang lalu",
    "applicantCount": 8,
    "status": "active",
    "timeline": { "from": "2024-01-01T00:00:00.000Z", "to": "2024-12-31T00:00:00.000Z" }
  },
  {
    "id": "job-123",
    "title": "Business Strategy Lead",
    "company": "TechIndo Makmur",
    "location": "Bandung",
    "type": "Paruh Waktu",
    "description": "Menjaga retensi dan kepuasan klien B2B.",
    "department": "Call Center & Layanan Konsumen",
    "requirements": [
      "Resolusi Konflik",
      "CRM",
      "Komunikasi"
    ],
    "detailedQualifications": [
      "Pengalaman kerja relevan minimal 2 tahun.",
      "Kemampuan problem-solving yang kuat.",
      "Bisa bekerja dalam tim maupun individu."
    ],
    "salaryRange": "Rp 8.000.000 - Rp 30.000.000",
    "industry": "Call Center & Layanan Konsumen",
    "questions": [
      "Ceritakan pengalaman terbesar Anda di bidang ini.",
      "Bagaimana cara Anda menyelesaikan konflik di tempat kerja?"
    ],
    "posted": "8 hari yang lalu",
    "applicantCount": 20,
    "status": "active",
    "timeline": { "from": "2024-01-01T00:00:00.000Z", "to": "2024-12-31T00:00:00.000Z" }
  },
  {
    "id": "job-124",
    "title": "Corporate Secretary",
    "company": "Maju Bersama Tbk",
    "location": "Remote",
    "type": "Kontrak",
    "description": "Posisi profesional di bidang Keterampilan & Jasa.",
    "department": "Keterampilan & Jasa",
    "requirements": [
      "Analisis",
      "Manajemen",
      "Komunikasi"
    ],
    "detailedQualifications": [
      "Pengalaman kerja relevan minimal 2 tahun.",
      "Kemampuan problem-solving yang kuat.",
      "Bisa bekerja dalam tim maupun individu."
    ],
    "salaryRange": "Rp 6.000.000 - Rp 29.000.000",
    "industry": "Keterampilan & Jasa",
    "questions": [
      "Ceritakan pengalaman terbesar Anda di bidang ini.",
      "Bagaimana cara Anda menyelesaikan konflik di tempat kerja?"
    ],
    "posted": "14 hari yang lalu",
    "applicantCount": 49,
    "status": "active",
    "timeline": { "from": "2024-01-01T00:00:00.000Z", "to": "2024-12-31T00:00:00.000Z" }
  },
  {
    "id": "job-125",
    "title": "Category Sourcing Manager",
    "company": "Bintang Sejahtera",
    "location": "Bandung",
    "type": "Magang",
    "description": "Posisi profesional di bidang Layanan & Pengembangan Masyarakat.",
    "department": "Layanan & Pengembangan Masyarakat",
    "requirements": [
      "Analisis",
      "Manajemen",
      "Komunikasi"
    ],
    "detailedQualifications": [
      "Pengalaman kerja relevan minimal 2 tahun.",
      "Kemampuan problem-solving yang kuat.",
      "Bisa bekerja dalam tim maupun individu."
    ],
    "salaryRange": "Rp 7.000.000 - Rp 20.000.000",
    "industry": "Layanan & Pengembangan Masyarakat",
    "questions": [
      "Ceritakan pengalaman terbesar Anda di bidang ini.",
      "Bagaimana cara Anda menyelesaikan konflik di tempat kerja?"
    ],
    "posted": "9 hari yang lalu",
    "applicantCount": 46,
    "status": "active",
    "timeline": { "from": "2024-01-01T00:00:00.000Z", "to": "2024-12-31T00:00:00.000Z" }
  },
  {
    "id": "job-126",
    "title": "Corporate Secretary",
    "company": "Maju Bersama Tbk",
    "location": "Bandung",
    "type": "Penuh Waktu",
    "description": "Posisi profesional di bidang Keterampilan & Jasa.",
    "department": "Keterampilan & Jasa",
    "requirements": [
      "Analisis",
      "Manajemen",
      "Komunikasi"
    ],
    "detailedQualifications": [
      "Pengalaman kerja relevan minimal 2 tahun.",
      "Kemampuan problem-solving yang kuat.",
      "Bisa bekerja dalam tim maupun individu."
    ],
    "salaryRange": "Rp 14.000.000 - Rp 28.000.000",
    "industry": "Keterampilan & Jasa",
    "questions": [
      "Ceritakan pengalaman terbesar Anda di bidang ini.",
      "Bagaimana cara Anda menyelesaikan konflik di tempat kerja?"
    ],
    "posted": "11 hari yang lalu",
    "applicantCount": 38,
    "status": "active",
    "timeline": { "from": "2024-01-01T00:00:00.000Z", "to": "2024-12-31T00:00:00.000Z" }
  },
  {
    "id": "job-127",
    "title": "Lending Risk Analyst",
    "company": "Grup Merdeka",
    "location": "Bandung",
    "type": "Kontrak",
    "description": "Posisi profesional di bidang Konsultasi & Strategi.",
    "department": "Konsultasi & Strategi",
    "requirements": [
      "Analisis",
      "Manajemen",
      "Komunikasi"
    ],
    "detailedQualifications": [
      "Pengalaman kerja relevan minimal 2 tahun.",
      "Kemampuan problem-solving yang kuat.",
      "Bisa bekerja dalam tim maupun individu."
    ],
    "salaryRange": "Rp 10.000.000 - Rp 29.000.000",
    "industry": "Konsultasi & Strategi",
    "questions": [
      "Ceritakan pengalaman terbesar Anda di bidang ini.",
      "Bagaimana cara Anda menyelesaikan konflik di tempat kerja?"
    ],
    "posted": "2 hari yang lalu",
    "applicantCount": 50,
    "status": "active",
    "timeline": { "from": "2024-01-01T00:00:00.000Z", "to": "2024-12-31T00:00:00.000Z" }
  },
  {
    "id": "job-128",
    "title": "Employee Life Cycle Specialist",
    "company": "Karya Cipta",
    "location": "Medan",
    "type": "Paruh Waktu",
    "description": "Mengawasi proyek pembangunan gedung dari awal hingga akhir.",
    "department": "Konstruksi",
    "requirements": [
      "Manajemen Proyek",
      "K3",
      "AutoCAD"
    ],
    "detailedQualifications": [
      "Pengalaman kerja relevan minimal 2 tahun.",
      "Kemampuan problem-solving yang kuat.",
      "Bisa bekerja dalam tim maupun individu."
    ],
    "salaryRange": "Rp 8.000.000 - Rp 22.000.000",
    "industry": "Konstruksi",
    "questions": [
      "Ceritakan pengalaman terbesar Anda di bidang ini.",
      "Bagaimana cara Anda menyelesaikan konflik di tempat kerja?"
    ],
    "posted": "10 hari yang lalu",
    "applicantCount": 25,
    "status": "active",
    "timeline": { "from": "2024-01-01T00:00:00.000Z", "to": "2024-12-31T00:00:00.000Z" }
  },
  {
    "id": "job-129",
    "title": "Collection Admin Supervisor",
    "company": "TechIndo Makmur",
    "location": "Semarang",
    "type": "Kontrak",
    "description": "Posisi profesional di bidang Pertambangan, Sumber Daya Alam & Energi.",
    "department": "Pertambangan, Sumber Daya Alam & Energi",
    "requirements": [
      "Analisis",
      "Manajemen",
      "Komunikasi"
    ],
    "detailedQualifications": [
      "Pengalaman kerja relevan minimal 2 tahun.",
      "Kemampuan problem-solving yang kuat.",
      "Bisa bekerja dalam tim maupun individu."
    ],
    "salaryRange": "Rp 6.000.000 - Rp 19.000.000",
    "industry": "Pertambangan, Sumber Daya Alam & Energi",
    "questions": [
      "Ceritakan pengalaman terbesar Anda di bidang ini.",
      "Bagaimana cara Anda menyelesaikan konflik di tempat kerja?"
    ],
    "posted": "8 hari yang lalu",
    "applicantCount": 31,
    "status": "active",
    "timeline": { "from": "2024-01-01T00:00:00.000Z", "to": "2024-12-31T00:00:00.000Z" }
  }
];

export const mockApplications: Application[] = [
  {
    "id": "app-500",
    "applicantId": "yunishara28",
    "applicantName": "Yuni Shara",
    "jobId": "job-100",
    "jobTitle": "People Business Partner (Data)",
    "cvSummary": "Kandidat memiliki pengalaman 3 tahun di bidang Olahraga & Rekreasi. Sangat menguasai Analisis, Manajemen dan memiliki rekam jejak yang baik dalam spesialis olahraga & rekreasi.",
    "validationStatus": "completed",
    "validationResponses": [
      {
        "question": "Ceritakan pengalaman terbesar Anda di bidang ini.",
        "answer": "Saya telah bekerja sebagai Spesialis Olahraga & Rekreasi selama 3 tahun, fokus pada Analisis, Manajemen."
      },
      {
        "question": "Mengapa Anda tertarik dengan posisi ini?",
        "answer": "Saya melihat visi perusahaan ini sejalan dengan minat dan keahlian saya."
      }
    ],
    "recommendationScore": 66,
    "status": "under-review",
    "appliedDate": "8 hari yang lalu",
    "cvViewed": true,
    "authenticityScore": {
      "authentic": 86,
      "generic": 19,
      "aiGenerated": 5
    },
    "email": "yunishara@email.com",
    "phone": "081237746617",
    "resumeLink": "https://example.com/cv.pdf"
  },
  {
    "id": "app-501",
    "applicantId": "raffiahmad13",
    "applicantName": "Raffi Ahmad",
    "jobId": "job-100",
    "jobTitle": "People Business Partner (Data)",
    "cvSummary": "Kandidat memiliki pengalaman 3 tahun di bidang Olahraga & Rekreasi. Sangat menguasai Analisis, Manajemen, Komunikasi dan memiliki rekam jejak yang baik dalam spesialis olahraga & rekreasi.",
    "validationStatus": "completed",
    "validationResponses": [
      {
        "question": "Ceritakan pengalaman terbesar Anda di bidang ini.",
        "answer": "Saya telah bekerja sebagai Spesialis Olahraga & Rekreasi selama 3 tahun, fokus pada Analisis, Manajemen, Komunikasi."
      },
      {
        "question": "Mengapa Anda tertarik dengan posisi ini?",
        "answer": "Saya melihat visi perusahaan ini sejalan dengan minat dan keahlian saya."
      }
    ],
    "recommendationScore": 83,
    "status": "interview",
    "appliedDate": "10 hari yang lalu",
    "cvViewed": true,
    "authenticityScore": {
      "authentic": 87,
      "generic": 19,
      "aiGenerated": 0
    },
    "email": "raffiahmad@email.com",
    "phone": "081299622710",
    "resumeLink": "https://example.com/cv.pdf"
  },
  {
    "id": "app-502",
    "applicantId": "arielnoah79",
    "applicantName": "Ariel Noah",
    "jobId": "job-100",
    "jobTitle": "People Business Partner (Data)",
    "cvSummary": "Kandidat memiliki pengalaman 3 tahun di bidang Olahraga & Rekreasi. Sangat menguasai Analisis dan memiliki rekam jejak yang baik dalam spesialis olahraga & rekreasi.",
    "validationStatus": "completed",
    "validationResponses": [
      {
        "question": "Ceritakan pengalaman terbesar Anda di bidang ini.",
        "answer": "Saya telah bekerja sebagai Spesialis Olahraga & Rekreasi selama 3 tahun, fokus pada Analisis."
      },
      {
        "question": "Mengapa Anda tertarik dengan posisi ini?",
        "answer": "Saya melihat visi perusahaan ini sejalan dengan minat dan keahlian saya."
      }
    ],
    "recommendationScore": 78,
    "status": "under-review",
    "appliedDate": "10 hari yang lalu",
    "cvViewed": true,
    "authenticityScore": {
      "authentic": 75,
      "generic": 5,
      "aiGenerated": 1
    },
    "email": "arielnoah@email.com",
    "phone": "081294237571",
    "resumeLink": "https://example.com/cv.pdf"
  },
  {
    "id": "app-503",
    "applicantId": "raffiahmad22",
    "applicantName": "Raffi Ahmad",
    "jobId": "job-100",
    "jobTitle": "People Business Partner (Data)",
    "cvSummary": "Kandidat memiliki pengalaman 3 tahun di bidang Olahraga & Rekreasi. Sangat menguasai Analisis, Manajemen dan memiliki rekam jejak yang baik dalam spesialis olahraga & rekreasi.",
    "validationStatus": "completed",
    "validationResponses": [
      {
        "question": "Ceritakan pengalaman terbesar Anda di bidang ini.",
        "answer": "Saya telah bekerja sebagai Spesialis Olahraga & Rekreasi selama 3 tahun, fokus pada Analisis, Manajemen."
      },
      {
        "question": "Mengapa Anda tertarik dengan posisi ini?",
        "answer": "Saya melihat visi perusahaan ini sejalan dengan minat dan keahlian saya."
      }
    ],
    "recommendationScore": 92,
    "status": "under-review",
    "appliedDate": "8 hari yang lalu",
    "cvViewed": true,
    "authenticityScore": {
      "authentic": 81,
      "generic": 15,
      "aiGenerated": 4
    },
    "email": "raffiahmad@email.com",
    "phone": "081262880794",
    "resumeLink": "https://example.com/cv.pdf"
  },
  {
    "id": "app-504",
    "applicantId": "raisaandriana82",
    "applicantName": "Raisa Andriana",
    "jobId": "job-100",
    "jobTitle": "People Business Partner (Data)",
    "cvSummary": "Kandidat memiliki pengalaman 3 tahun di bidang Olahraga & Rekreasi. Sangat menguasai Analisis dan memiliki rekam jejak yang baik dalam spesialis olahraga & rekreasi.",
    "validationStatus": "completed",
    "validationResponses": [
      {
        "question": "Ceritakan pengalaman terbesar Anda di bidang ini.",
        "answer": "Saya telah bekerja sebagai Spesialis Olahraga & Rekreasi selama 3 tahun, fokus pada Analisis."
      },
      {
        "question": "Mengapa Anda tertarik dengan posisi ini?",
        "answer": "Saya melihat visi perusahaan ini sejalan dengan minat dan keahlian saya."
      }
    ],
    "recommendationScore": 64,
    "status": "under-review",
    "appliedDate": "8 hari yang lalu",
    "cvViewed": true,
    "authenticityScore": {
      "authentic": 72,
      "generic": 9,
      "aiGenerated": 7
    },
    "email": "raisaandriana@email.com",
    "phone": "081220986317",
    "resumeLink": "https://example.com/cv.pdf"
  },
  {
    "id": "app-505",
    "applicantId": "arielnoah70",
    "applicantName": "Ariel Noah",
    "jobId": "job-101",
    "jobTitle": "District Sales Manager",
    "cvSummary": "Kandidat memiliki pengalaman 3 tahun di bidang Pertanian, Hewan & Konservasi. Sangat menguasai Analisis dan memiliki rekam jejak yang baik dalam spesialis pertanian, hewan & konservasi.",
    "validationStatus": "completed",
    "validationResponses": [
      {
        "question": "Ceritakan pengalaman terbesar Anda di bidang ini.",
        "answer": "Saya telah bekerja sebagai Spesialis Pertanian, Hewan & Konservasi selama 3 tahun, fokus pada Analisis."
      },
      {
        "question": "Mengapa Anda tertarik dengan posisi ini?",
        "answer": "Saya melihat visi perusahaan ini sejalan dengan minat dan keahlian saya."
      }
    ],
    "recommendationScore": 60,
    "status": "submitted",
    "appliedDate": "2 hari yang lalu",
    "cvViewed": true,
    "authenticityScore": {
      "authentic": 71,
      "generic": 14,
      "aiGenerated": 3
    },
    "email": "arielnoah@email.com",
    "phone": "081285458651",
    "resumeLink": "https://example.com/cv.pdf"
  },
  {
    "id": "app-506",
    "applicantId": "andipratama59",
    "applicantName": "Andi Pratama",
    "jobId": "job-101",
    "jobTitle": "District Sales Manager",
    "cvSummary": "Kandidat memiliki pengalaman 3 tahun di bidang Pertanian, Hewan & Konservasi. Sangat menguasai Analisis dan memiliki rekam jejak yang baik dalam spesialis pertanian, hewan & konservasi.",
    "validationStatus": "completed",
    "validationResponses": [
      {
        "question": "Ceritakan pengalaman terbesar Anda di bidang ini.",
        "answer": "Saya telah bekerja sebagai Spesialis Pertanian, Hewan & Konservasi selama 3 tahun, fokus pada Analisis."
      },
      {
        "question": "Mengapa Anda tertarik dengan posisi ini?",
        "answer": "Saya melihat visi perusahaan ini sejalan dengan minat dan keahlian saya."
      }
    ],
    "recommendationScore": 59,
    "status": "under-review",
    "appliedDate": "2 hari yang lalu",
    "cvViewed": true,
    "authenticityScore": {
      "authentic": 90,
      "generic": 6,
      "aiGenerated": 1
    },
    "email": "andipratama@email.com",
    "phone": "081225447851",
    "resumeLink": "https://example.com/cv.pdf"
  },
  {
    "id": "app-507",
    "applicantId": "fajarnugraha83",
    "applicantName": "Fajar Nugraha",
    "jobId": "job-101",
    "jobTitle": "District Sales Manager",
    "cvSummary": "Kandidat memiliki pengalaman 3 tahun di bidang Pertanian, Hewan & Konservasi. Sangat menguasai Analisis, Manajemen, Komunikasi dan memiliki rekam jejak yang baik dalam spesialis pertanian, hewan & konservasi.",
    "validationStatus": "completed",
    "validationResponses": [
      {
        "question": "Ceritakan pengalaman terbesar Anda di bidang ini.",
        "answer": "Saya telah bekerja sebagai Spesialis Pertanian, Hewan & Konservasi selama 3 tahun, fokus pada Analisis, Manajemen, Komunikasi."
      },
      {
        "question": "Mengapa Anda tertarik dengan posisi ini?",
        "answer": "Saya melihat visi perusahaan ini sejalan dengan minat dan keahlian saya."
      }
    ],
    "recommendationScore": 78,
    "status": "rejected",
    "appliedDate": "8 hari yang lalu",
    "cvViewed": true,
    "authenticityScore": {
      "authentic": 95,
      "generic": 14,
      "aiGenerated": 2
    },
    "email": "fajarnugraha@email.com",
    "phone": "081250206534",
    "resumeLink": "https://example.com/cv.pdf"
  },
  {
    "id": "app-508",
    "applicantId": "agnezmo21",
    "applicantName": "Agnez Mo",
    "jobId": "job-101",
    "jobTitle": "District Sales Manager",
    "cvSummary": "Kandidat memiliki pengalaman 3 tahun di bidang Pertanian, Hewan & Konservasi. Sangat menguasai Analisis dan memiliki rekam jejak yang baik dalam spesialis pertanian, hewan & konservasi.",
    "validationStatus": "completed",
    "validationResponses": [
      {
        "question": "Ceritakan pengalaman terbesar Anda di bidang ini.",
        "answer": "Saya telah bekerja sebagai Spesialis Pertanian, Hewan & Konservasi selama 3 tahun, fokus pada Analisis."
      },
      {
        "question": "Mengapa Anda tertarik dengan posisi ini?",
        "answer": "Saya melihat visi perusahaan ini sejalan dengan minat dan keahlian saya."
      }
    ],
    "recommendationScore": 64,
    "status": "interview",
    "appliedDate": "6 hari yang lalu",
    "cvViewed": true,
    "authenticityScore": {
      "authentic": 90,
      "generic": 15,
      "aiGenerated": 6
    },
    "email": "agnezmo@email.com",
    "phone": "081268925477",
    "resumeLink": "https://example.com/cv.pdf"
  },
  {
    "id": "app-509",
    "applicantId": "rossa57",
    "applicantName": "Rossa",
    "jobId": "job-101",
    "jobTitle": "District Sales Manager",
    "cvSummary": "Kandidat memiliki pengalaman 3 tahun di bidang Pertanian, Hewan & Konservasi. Sangat menguasai Analisis, Manajemen dan memiliki rekam jejak yang baik dalam spesialis pertanian, hewan & konservasi.",
    "validationStatus": "completed",
    "validationResponses": [
      {
        "question": "Ceritakan pengalaman terbesar Anda di bidang ini.",
        "answer": "Saya telah bekerja sebagai Spesialis Pertanian, Hewan & Konservasi selama 3 tahun, fokus pada Analisis, Manajemen."
      },
      {
        "question": "Mengapa Anda tertarik dengan posisi ini?",
        "answer": "Saya melihat visi perusahaan ini sejalan dengan minat dan keahlian saya."
      }
    ],
    "recommendationScore": 94,
    "status": "rejected",
    "appliedDate": "5 hari yang lalu",
    "cvViewed": true,
    "authenticityScore": {
      "authentic": 76,
      "generic": 10,
      "aiGenerated": 1
    },
    "email": "rossa@email.com",
    "phone": "081232626784",
    "resumeLink": "https://example.com/cv.pdf"
  },
  {
    "id": "app-510",
    "applicantId": "bimaarya66",
    "applicantName": "Bima Arya",
    "jobId": "job-102",
    "jobTitle": "Software Engineer - Backend",
    "cvSummary": "Kandidat memiliki pengalaman 3 tahun di bidang Pekerjaan Lepas. Sangat menguasai Analisis, Manajemen, Komunikasi dan memiliki rekam jejak yang baik dalam spesialis pekerjaan lepas.",
    "validationStatus": "completed",
    "validationResponses": [
      {
        "question": "Ceritakan pengalaman terbesar Anda di bidang ini.",
        "answer": "Saya telah bekerja sebagai Spesialis Pekerjaan Lepas selama 3 tahun, fokus pada Analisis, Manajemen, Komunikasi."
      },
      {
        "question": "Mengapa Anda tertarik dengan posisi ini?",
        "answer": "Saya melihat visi perusahaan ini sejalan dengan minat dan keahlian saya."
      }
    ],
    "recommendationScore": 91,
    "status": "submitted",
    "appliedDate": "8 hari yang lalu",
    "cvViewed": false,
    "authenticityScore": {
      "authentic": 74,
      "generic": 12,
      "aiGenerated": 3
    },
    "email": "bimaarya@email.com",
    "phone": "081278768265",
    "resumeLink": "https://example.com/cv.pdf"
  },
  {
    "id": "app-511",
    "applicantId": "santisusanti41",
    "applicantName": "Santi Susanti",
    "jobId": "job-102",
    "jobTitle": "Software Engineer - Backend",
    "cvSummary": "Kandidat memiliki pengalaman 3 tahun di bidang Pekerjaan Lepas. Sangat menguasai Analisis, Manajemen dan memiliki rekam jejak yang baik dalam spesialis pekerjaan lepas.",
    "validationStatus": "completed",
    "validationResponses": [
      {
        "question": "Ceritakan pengalaman terbesar Anda di bidang ini.",
        "answer": "Saya telah bekerja sebagai Spesialis Pekerjaan Lepas selama 3 tahun, fokus pada Analisis, Manajemen."
      },
      {
        "question": "Mengapa Anda tertarik dengan posisi ini?",
        "answer": "Saya melihat visi perusahaan ini sejalan dengan minat dan keahlian saya."
      }
    ],
    "recommendationScore": 63,
    "status": "interview",
    "appliedDate": "10 hari yang lalu",
    "cvViewed": true,
    "authenticityScore": {
      "authentic": 74,
      "generic": 18,
      "aiGenerated": 4
    },
    "email": "santisusanti@email.com",
    "phone": "081266748130",
    "resumeLink": "https://example.com/cv.pdf"
  },
  {
    "id": "app-512",
    "applicantId": "santisusanti96",
    "applicantName": "Santi Susanti",
    "jobId": "job-102",
    "jobTitle": "Software Engineer - Backend",
    "cvSummary": "Kandidat memiliki pengalaman 3 tahun di bidang Pekerjaan Lepas. Sangat menguasai Analisis, Manajemen, Komunikasi dan memiliki rekam jejak yang baik dalam spesialis pekerjaan lepas.",
    "validationStatus": "completed",
    "validationResponses": [
      {
        "question": "Ceritakan pengalaman terbesar Anda di bidang ini.",
        "answer": "Saya telah bekerja sebagai Spesialis Pekerjaan Lepas selama 3 tahun, fokus pada Analisis, Manajemen, Komunikasi."
      },
      {
        "question": "Mengapa Anda tertarik dengan posisi ini?",
        "answer": "Saya melihat visi perusahaan ini sejalan dengan minat dan keahlian saya."
      }
    ],
    "recommendationScore": 69,
    "status": "submitted",
    "appliedDate": "4 hari yang lalu",
    "cvViewed": false,
    "authenticityScore": {
      "authentic": 78,
      "generic": 17,
      "aiGenerated": 7
    },
    "email": "santisusanti@email.com",
    "phone": "081216456650",
    "resumeLink": "https://example.com/cv.pdf"
  },
  {
    "id": "app-513",
    "applicantId": "afgansyahreza37",
    "applicantName": "Afgan Syahreza",
    "jobId": "job-102",
    "jobTitle": "Software Engineer - Backend",
    "cvSummary": "Kandidat memiliki pengalaman 3 tahun di bidang Pekerjaan Lepas. Sangat menguasai Analisis, Manajemen, Komunikasi dan memiliki rekam jejak yang baik dalam spesialis pekerjaan lepas.",
    "validationStatus": "completed",
    "validationResponses": [
      {
        "question": "Ceritakan pengalaman terbesar Anda di bidang ini.",
        "answer": "Saya telah bekerja sebagai Spesialis Pekerjaan Lepas selama 3 tahun, fokus pada Analisis, Manajemen, Komunikasi."
      },
      {
        "question": "Mengapa Anda tertarik dengan posisi ini?",
        "answer": "Saya melihat visi perusahaan ini sejalan dengan minat dan keahlian saya."
      }
    ],
    "recommendationScore": 91,
    "status": "submitted",
    "appliedDate": "4 hari yang lalu",
    "cvViewed": true,
    "authenticityScore": {
      "authentic": 83,
      "generic": 18,
      "aiGenerated": 7
    },
    "email": "afgansyahreza@email.com",
    "phone": "081265060127",
    "resumeLink": "https://example.com/cv.pdf"
  },
  {
    "id": "app-514",
    "applicantId": "antonsyahputra90",
    "applicantName": "Anton Syahputra",
    "jobId": "job-102",
    "jobTitle": "Software Engineer - Backend",
    "cvSummary": "Kandidat memiliki pengalaman 3 tahun di bidang Pekerjaan Lepas. Sangat menguasai Analisis, Manajemen dan memiliki rekam jejak yang baik dalam spesialis pekerjaan lepas.",
    "validationStatus": "completed",
    "validationResponses": [
      {
        "question": "Ceritakan pengalaman terbesar Anda di bidang ini.",
        "answer": "Saya telah bekerja sebagai Spesialis Pekerjaan Lepas selama 3 tahun, fokus pada Analisis, Manajemen."
      },
      {
        "question": "Mengapa Anda tertarik dengan posisi ini?",
        "answer": "Saya melihat visi perusahaan ini sejalan dengan minat dan keahlian saya."
      }
    ],
    "recommendationScore": 88,
    "status": "interview",
    "appliedDate": "2 hari yang lalu",
    "cvViewed": true,
    "authenticityScore": {
      "authentic": 90,
      "generic": 12,
      "aiGenerated": 4
    },
    "email": "antonsyahputra@email.com",
    "phone": "081238016932",
    "resumeLink": "https://example.com/cv.pdf"
  },
  {
    "id": "app-515",
    "applicantId": "antonsyahputra55",
    "applicantName": "Anton Syahputra",
    "jobId": "job-103",
    "jobTitle": "Software Engineer Intern",
    "cvSummary": "Kandidat memiliki pengalaman 3 tahun di bidang Teknik. Sangat menguasai Analisis, Manajemen, Komunikasi dan memiliki rekam jejak yang baik dalam spesialis teknik.",
    "validationStatus": "completed",
    "validationResponses": [
      {
        "question": "Ceritakan pengalaman terbesar Anda di bidang ini.",
        "answer": "Saya telah bekerja sebagai Spesialis Teknik selama 3 tahun, fokus pada Analisis, Manajemen, Komunikasi."
      },
      {
        "question": "Mengapa Anda tertarik dengan posisi ini?",
        "answer": "Saya melihat visi perusahaan ini sejalan dengan minat dan keahlian saya."
      }
    ],
    "recommendationScore": 77,
    "status": "under-review",
    "appliedDate": "2 hari yang lalu",
    "cvViewed": true,
    "authenticityScore": {
      "authentic": 78,
      "generic": 13,
      "aiGenerated": 4
    },
    "email": "antonsyahputra@email.com",
    "phone": "081260224100",
    "resumeLink": "https://example.com/cv.pdf"
  },
  {
    "id": "app-516",
    "applicantId": "lunamaya51",
    "applicantName": "Luna Maya",
    "jobId": "job-103",
    "jobTitle": "Software Engineer Intern",
    "cvSummary": "Kandidat memiliki pengalaman 3 tahun di bidang Teknik. Sangat menguasai Analisis, Manajemen, Komunikasi dan memiliki rekam jejak yang baik dalam spesialis teknik.",
    "validationStatus": "completed",
    "validationResponses": [
      {
        "question": "Ceritakan pengalaman terbesar Anda di bidang ini.",
        "answer": "Saya telah bekerja sebagai Spesialis Teknik selama 3 tahun, fokus pada Analisis, Manajemen, Komunikasi."
      },
      {
        "question": "Mengapa Anda tertarik dengan posisi ini?",
        "answer": "Saya melihat visi perusahaan ini sejalan dengan minat dan keahlian saya."
      }
    ],
    "recommendationScore": 77,
    "status": "under-review",
    "appliedDate": "3 hari yang lalu",
    "cvViewed": true,
    "authenticityScore": {
      "authentic": 93,
      "generic": 15,
      "aiGenerated": 3
    },
    "email": "lunamaya@email.com",
    "phone": "081253567985",
    "resumeLink": "https://example.com/cv.pdf"
  },
  {
    "id": "app-517",
    "applicantId": "rossa40",
    "applicantName": "Rossa",
    "jobId": "job-103",
    "jobTitle": "Software Engineer Intern",
    "cvSummary": "Kandidat memiliki pengalaman 3 tahun di bidang Teknik. Sangat menguasai Analisis dan memiliki rekam jejak yang baik dalam spesialis teknik.",
    "validationStatus": "completed",
    "validationResponses": [
      {
        "question": "Ceritakan pengalaman terbesar Anda di bidang ini.",
        "answer": "Saya telah bekerja sebagai Spesialis Teknik selama 3 tahun, fokus pada Analisis."
      },
      {
        "question": "Mengapa Anda tertarik dengan posisi ini?",
        "answer": "Saya melihat visi perusahaan ini sejalan dengan minat dan keahlian saya."
      }
    ],
    "recommendationScore": 65,
    "status": "rejected",
    "appliedDate": "9 hari yang lalu",
    "cvViewed": true,
    "authenticityScore": {
      "authentic": 74,
      "generic": 6,
      "aiGenerated": 4
    },
    "email": "rossa@email.com",
    "phone": "081236585511",
    "resumeLink": "https://example.com/cv.pdf"
  },
  {
    "id": "app-518",
    "applicantId": "andipratama43",
    "applicantName": "Andi Pratama",
    "jobId": "job-103",
    "jobTitle": "Software Engineer Intern",
    "cvSummary": "Kandidat memiliki pengalaman 3 tahun di bidang Teknik. Sangat menguasai Analisis, Manajemen, Komunikasi dan memiliki rekam jejak yang baik dalam spesialis teknik.",
    "validationStatus": "completed",
    "validationResponses": [
      {
        "question": "Ceritakan pengalaman terbesar Anda di bidang ini.",
        "answer": "Saya telah bekerja sebagai Spesialis Teknik selama 3 tahun, fokus pada Analisis, Manajemen, Komunikasi."
      },
      {
        "question": "Mengapa Anda tertarik dengan posisi ini?",
        "answer": "Saya melihat visi perusahaan ini sejalan dengan minat dan keahlian saya."
      }
    ],
    "recommendationScore": 55,
    "status": "interview",
    "appliedDate": "7 hari yang lalu",
    "cvViewed": true,
    "authenticityScore": {
      "authentic": 77,
      "generic": 16,
      "aiGenerated": 6
    },
    "email": "andipratama@email.com",
    "phone": "081210469034",
    "resumeLink": "https://example.com/cv.pdf"
  },
  {
    "id": "app-519",
    "applicantId": "budisantoso71",
    "applicantName": "Budi Santoso",
    "jobId": "job-104",
    "jobTitle": "Local Language Specialist",
    "cvSummary": "Kandidat memiliki pengalaman 3 tahun di bidang Sains & Teknologi. Sangat menguasai Analisis dan memiliki rekam jejak yang baik dalam spesialis sains & teknologi.",
    "validationStatus": "completed",
    "validationResponses": [
      {
        "question": "Ceritakan pengalaman terbesar Anda di bidang ini.",
        "answer": "Saya telah bekerja sebagai Spesialis Sains & Teknologi selama 3 tahun, fokus pada Analisis."
      },
      {
        "question": "Mengapa Anda tertarik dengan posisi ini?",
        "answer": "Saya melihat visi perusahaan ini sejalan dengan minat dan keahlian saya."
      }
    ],
    "recommendationScore": 84,
    "status": "interview",
    "appliedDate": "4 hari yang lalu",
    "cvViewed": true,
    "authenticityScore": {
      "authentic": 76,
      "generic": 14,
      "aiGenerated": 5
    },
    "email": "budisantoso@email.com",
    "phone": "081276531300",
    "resumeLink": "https://example.com/cv.pdf"
  },
  {
    "id": "app-520",
    "applicantId": "afgansyahreza40",
    "applicantName": "Afgan Syahreza",
    "jobId": "job-104",
    "jobTitle": "Local Language Specialist",
    "cvSummary": "Kandidat memiliki pengalaman 3 tahun di bidang Sains & Teknologi. Sangat menguasai Analisis, Manajemen, Komunikasi dan memiliki rekam jejak yang baik dalam spesialis sains & teknologi.",
    "validationStatus": "completed",
    "validationResponses": [
      {
        "question": "Ceritakan pengalaman terbesar Anda di bidang ini.",
        "answer": "Saya telah bekerja sebagai Spesialis Sains & Teknologi selama 3 tahun, fokus pada Analisis, Manajemen, Komunikasi."
      },
      {
        "question": "Mengapa Anda tertarik dengan posisi ini?",
        "answer": "Saya melihat visi perusahaan ini sejalan dengan minat dan keahlian saya."
      }
    ],
    "recommendationScore": 85,
    "status": "interview",
    "appliedDate": "1 hari yang lalu",
    "cvViewed": true,
    "authenticityScore": {
      "authentic": 91,
      "generic": 16,
      "aiGenerated": 5
    },
    "email": "afgansyahreza@email.com",
    "phone": "081218884346",
    "resumeLink": "https://example.com/cv.pdf"
  },
  {
    "id": "app-521",
    "applicantId": "rinaamelia86",
    "applicantName": "Rina Amelia",
    "jobId": "job-104",
    "jobTitle": "Local Language Specialist",
    "cvSummary": "Kandidat memiliki pengalaman 3 tahun di bidang Sains & Teknologi. Sangat menguasai Analisis, Manajemen dan memiliki rekam jejak yang baik dalam spesialis sains & teknologi.",
    "validationStatus": "completed",
    "validationResponses": [
      {
        "question": "Ceritakan pengalaman terbesar Anda di bidang ini.",
        "answer": "Saya telah bekerja sebagai Spesialis Sains & Teknologi selama 3 tahun, fokus pada Analisis, Manajemen."
      },
      {
        "question": "Mengapa Anda tertarik dengan posisi ini?",
        "answer": "Saya melihat visi perusahaan ini sejalan dengan minat dan keahlian saya."
      }
    ],
    "recommendationScore": 74,
    "status": "rejected",
    "appliedDate": "1 hari yang lalu",
    "cvViewed": true,
    "authenticityScore": {
      "authentic": 80,
      "generic": 14,
      "aiGenerated": 8
    },
    "email": "rinaamelia@email.com",
    "phone": "081284950328",
    "resumeLink": "https://example.com/cv.pdf"
  },
  {
    "id": "app-522",
    "applicantId": "mayasari76",
    "applicantName": "Maya Sari",
    "jobId": "job-104",
    "jobTitle": "Local Language Specialist",
    "cvSummary": "Kandidat memiliki pengalaman 3 tahun di bidang Sains & Teknologi. Sangat menguasai Analisis, Manajemen, Komunikasi dan memiliki rekam jejak yang baik dalam spesialis sains & teknologi.",
    "validationStatus": "completed",
    "validationResponses": [
      {
        "question": "Ceritakan pengalaman terbesar Anda di bidang ini.",
        "answer": "Saya telah bekerja sebagai Spesialis Sains & Teknologi selama 3 tahun, fokus pada Analisis, Manajemen, Komunikasi."
      },
      {
        "question": "Mengapa Anda tertarik dengan posisi ini?",
        "answer": "Saya melihat visi perusahaan ini sejalan dengan minat dan keahlian saya."
      }
    ],
    "recommendationScore": 70,
    "status": "under-review",
    "appliedDate": "2 hari yang lalu",
    "cvViewed": true,
    "authenticityScore": {
      "authentic": 79,
      "generic": 15,
      "aiGenerated": 5
    },
    "email": "mayasari@email.com",
    "phone": "081274061058",
    "resumeLink": "https://example.com/cv.pdf"
  },
  {
    "id": "app-523",
    "applicantId": "rezarahadian34",
    "applicantName": "Reza Rahadian",
    "jobId": "job-105",
    "jobTitle": "Regional Sales Leader",
    "cvSummary": "Kandidat memiliki pengalaman 3 tahun di bidang Hukum. Sangat menguasai Analisis dan memiliki rekam jejak yang baik dalam spesialis hukum.",
    "validationStatus": "completed",
    "validationResponses": [
      {
        "question": "Ceritakan pengalaman terbesar Anda di bidang ini.",
        "answer": "Saya telah bekerja sebagai Spesialis Hukum selama 3 tahun, fokus pada Analisis."
      },
      {
        "question": "Mengapa Anda tertarik dengan posisi ini?",
        "answer": "Saya melihat visi perusahaan ini sejalan dengan minat dan keahlian saya."
      }
    ],
    "recommendationScore": 68,
    "status": "submitted",
    "appliedDate": "4 hari yang lalu",
    "cvViewed": true,
    "authenticityScore": {
      "authentic": 95,
      "generic": 16,
      "aiGenerated": 9
    },
    "email": "rezarahadian@email.com",
    "phone": "081244263302",
    "resumeLink": "https://example.com/cv.pdf"
  },
  {
    "id": "app-524",
    "applicantId": "fajarnugraha22",
    "applicantName": "Fajar Nugraha",
    "jobId": "job-105",
    "jobTitle": "Regional Sales Leader",
    "cvSummary": "Kandidat memiliki pengalaman 3 tahun di bidang Hukum. Sangat menguasai Analisis, Manajemen dan memiliki rekam jejak yang baik dalam spesialis hukum.",
    "validationStatus": "completed",
    "validationResponses": [
      {
        "question": "Ceritakan pengalaman terbesar Anda di bidang ini.",
        "answer": "Saya telah bekerja sebagai Spesialis Hukum selama 3 tahun, fokus pada Analisis, Manajemen."
      },
      {
        "question": "Mengapa Anda tertarik dengan posisi ini?",
        "answer": "Saya melihat visi perusahaan ini sejalan dengan minat dan keahlian saya."
      }
    ],
    "recommendationScore": 81,
    "status": "rejected",
    "appliedDate": "2 hari yang lalu",
    "cvViewed": true,
    "authenticityScore": {
      "authentic": 90,
      "generic": 10,
      "aiGenerated": 0
    },
    "email": "fajarnugraha@email.com",
    "phone": "081218907855",
    "resumeLink": "https://example.com/cv.pdf"
  },
  {
    "id": "app-525",
    "applicantId": "arifrahman25",
    "applicantName": "Arif Rahman",
    "jobId": "job-105",
    "jobTitle": "Regional Sales Leader",
    "cvSummary": "Kandidat memiliki pengalaman 3 tahun di bidang Hukum. Sangat menguasai Analisis, Manajemen, Komunikasi dan memiliki rekam jejak yang baik dalam spesialis hukum.",
    "validationStatus": "completed",
    "validationResponses": [
      {
        "question": "Ceritakan pengalaman terbesar Anda di bidang ini.",
        "answer": "Saya telah bekerja sebagai Spesialis Hukum selama 3 tahun, fokus pada Analisis, Manajemen, Komunikasi."
      },
      {
        "question": "Mengapa Anda tertarik dengan posisi ini?",
        "answer": "Saya melihat visi perusahaan ini sejalan dengan minat dan keahlian saya."
      }
    ],
    "recommendationScore": 84,
    "status": "submitted",
    "appliedDate": "1 hari yang lalu",
    "cvViewed": false,
    "authenticityScore": {
      "authentic": 91,
      "generic": 5,
      "aiGenerated": 5
    },
    "email": "arifrahman@email.com",
    "phone": "081283981361",
    "resumeLink": "https://example.com/cv.pdf"
  },
  {
    "id": "app-526",
    "applicantId": "agnezmo87",
    "applicantName": "Agnez Mo",
    "jobId": "job-106",
    "jobTitle": "Legal Manager - Fintech",
    "cvSummary": "Kandidat memiliki pengalaman 3 tahun di bidang Konstruksi. Sangat menguasai Perhitungan RAB, Analisis Biaya dan memiliki rekam jejak yang baik dalam estimator.",
    "validationStatus": "completed",
    "validationResponses": [
      {
        "question": "Ceritakan pengalaman terbesar Anda di bidang ini.",
        "answer": "Saya telah bekerja sebagai Estimator selama 3 tahun, fokus pada Perhitungan RAB, Analisis Biaya."
      },
      {
        "question": "Mengapa Anda tertarik dengan posisi ini?",
        "answer": "Saya melihat visi perusahaan ini sejalan dengan minat dan keahlian saya."
      }
    ],
    "recommendationScore": 61,
    "status": "interview",
    "appliedDate": "7 hari yang lalu",
    "cvViewed": true,
    "authenticityScore": {
      "authentic": 70,
      "generic": 10,
      "aiGenerated": 4
    },
    "email": "agnezmo@email.com",
    "phone": "081236453162",
    "resumeLink": "https://example.com/cv.pdf"
  },
  {
    "id": "app-527",
    "applicantId": "jokowidodo55",
    "applicantName": "Joko Widodo",
    "jobId": "job-106",
    "jobTitle": "Legal Manager - Fintech",
    "cvSummary": "Kandidat memiliki pengalaman 3 tahun di bidang Konstruksi. Sangat menguasai Perhitungan RAB, Analisis Biaya dan memiliki rekam jejak yang baik dalam estimator.",
    "validationStatus": "completed",
    "validationResponses": [
      {
        "question": "Ceritakan pengalaman terbesar Anda di bidang ini.",
        "answer": "Saya telah bekerja sebagai Estimator selama 3 tahun, fokus pada Perhitungan RAB, Analisis Biaya."
      },
      {
        "question": "Mengapa Anda tertarik dengan posisi ini?",
        "answer": "Saya melihat visi perusahaan ini sejalan dengan minat dan keahlian saya."
      }
    ],
    "recommendationScore": 84,
    "status": "submitted",
    "appliedDate": "2 hari yang lalu",
    "cvViewed": false,
    "authenticityScore": {
      "authentic": 74,
      "generic": 18,
      "aiGenerated": 5
    },
    "email": "jokowidodo@email.com",
    "phone": "081245343009",
    "resumeLink": "https://example.com/cv.pdf"
  },
  {
    "id": "app-528",
    "applicantId": "dinafitriani51",
    "applicantName": "Dina Fitriani",
    "jobId": "job-106",
    "jobTitle": "Legal Manager - Fintech",
    "cvSummary": "Kandidat memiliki pengalaman 3 tahun di bidang Konstruksi. Sangat menguasai Perhitungan RAB dan memiliki rekam jejak yang baik dalam estimator.",
    "validationStatus": "completed",
    "validationResponses": [
      {
        "question": "Ceritakan pengalaman terbesar Anda di bidang ini.",
        "answer": "Saya telah bekerja sebagai Estimator selama 3 tahun, fokus pada Perhitungan RAB."
      },
      {
        "question": "Mengapa Anda tertarik dengan posisi ini?",
        "answer": "Saya melihat visi perusahaan ini sejalan dengan minat dan keahlian saya."
      }
    ],
    "recommendationScore": 61,
    "status": "rejected",
    "appliedDate": "8 hari yang lalu",
    "cvViewed": true,
    "authenticityScore": {
      "authentic": 79,
      "generic": 16,
      "aiGenerated": 6
    },
    "email": "dinafitriani@email.com",
    "phone": "081241730846",
    "resumeLink": "https://example.com/cv.pdf"
  },
  {
    "id": "app-529",
    "applicantId": "irfanhakim78",
    "applicantName": "Irfan Hakim",
    "jobId": "job-106",
    "jobTitle": "Legal Manager - Fintech",
    "cvSummary": "Kandidat memiliki pengalaman 3 tahun di bidang Konstruksi. Sangat menguasai Perhitungan RAB, Analisis Biaya, Material Konstruksi dan memiliki rekam jejak yang baik dalam estimator.",
    "validationStatus": "completed",
    "validationResponses": [
      {
        "question": "Ceritakan pengalaman terbesar Anda di bidang ini.",
        "answer": "Saya telah bekerja sebagai Estimator selama 3 tahun, fokus pada Perhitungan RAB, Analisis Biaya, Material Konstruksi."
      },
      {
        "question": "Mengapa Anda tertarik dengan posisi ini?",
        "answer": "Saya melihat visi perusahaan ini sejalan dengan minat dan keahlian saya."
      }
    ],
    "recommendationScore": 84,
    "status": "submitted",
    "appliedDate": "4 hari yang lalu",
    "cvViewed": true,
    "authenticityScore": {
      "authentic": 80,
      "generic": 5,
      "aiGenerated": 8
    },
    "email": "irfanhakim@email.com",
    "phone": "081228472780",
    "resumeLink": "https://example.com/cv.pdf"
  },
  {
    "id": "app-530",
    "applicantId": "andipratama98",
    "applicantName": "Andi Pratama",
    "jobId": "job-106",
    "jobTitle": "Legal Manager - Fintech",
    "cvSummary": "Kandidat memiliki pengalaman 3 tahun di bidang Konstruksi. Sangat menguasai Perhitungan RAB dan memiliki rekam jejak yang baik dalam estimator.",
    "validationStatus": "completed",
    "validationResponses": [
      {
        "question": "Ceritakan pengalaman terbesar Anda di bidang ini.",
        "answer": "Saya telah bekerja sebagai Estimator selama 3 tahun, fokus pada Perhitungan RAB."
      },
      {
        "question": "Mengapa Anda tertarik dengan posisi ini?",
        "answer": "Saya melihat visi perusahaan ini sejalan dengan minat dan keahlian saya."
      }
    ],
    "recommendationScore": 76,
    "status": "interview",
    "appliedDate": "2 hari yang lalu",
    "cvViewed": true,
    "authenticityScore": {
      "authentic": 92,
      "generic": 11,
      "aiGenerated": 4
    },
    "email": "andipratama@email.com",
    "phone": "081279532221",
    "resumeLink": "https://example.com/cv.pdf"
  },
  {
    "id": "app-531",
    "applicantId": "ayuwandira87",
    "applicantName": "Ayu Wandira",
    "jobId": "job-107",
    "jobTitle": "Software Engineer Intern",
    "cvSummary": "Kandidat memiliki pengalaman 3 tahun di bidang Teknik. Sangat menguasai Analisis, Manajemen, Komunikasi dan memiliki rekam jejak yang baik dalam spesialis teknik.",
    "validationStatus": "completed",
    "validationResponses": [
      {
        "question": "Ceritakan pengalaman terbesar Anda di bidang ini.",
        "answer": "Saya telah bekerja sebagai Spesialis Teknik selama 3 tahun, fokus pada Analisis, Manajemen, Komunikasi."
      },
      {
        "question": "Mengapa Anda tertarik dengan posisi ini?",
        "answer": "Saya melihat visi perusahaan ini sejalan dengan minat dan keahlian saya."
      }
    ],
    "recommendationScore": 56,
    "status": "rejected",
    "appliedDate": "4 hari yang lalu",
    "cvViewed": true,
    "authenticityScore": {
      "authentic": 71,
      "generic": 16,
      "aiGenerated": 0
    },
    "email": "ayuwandira@email.com",
    "phone": "081236554427",
    "resumeLink": "https://example.com/cv.pdf"
  },
  {
    "id": "app-532",
    "applicantId": "agnezmo96",
    "applicantName": "Agnez Mo",
    "jobId": "job-107",
    "jobTitle": "Software Engineer Intern",
    "cvSummary": "Kandidat memiliki pengalaman 3 tahun di bidang Teknik. Sangat menguasai Analisis, Manajemen, Komunikasi dan memiliki rekam jejak yang baik dalam spesialis teknik.",
    "validationStatus": "completed",
    "validationResponses": [
      {
        "question": "Ceritakan pengalaman terbesar Anda di bidang ini.",
        "answer": "Saya telah bekerja sebagai Spesialis Teknik selama 3 tahun, fokus pada Analisis, Manajemen, Komunikasi."
      },
      {
        "question": "Mengapa Anda tertarik dengan posisi ini?",
        "answer": "Saya melihat visi perusahaan ini sejalan dengan minat dan keahlian saya."
      }
    ],
    "recommendationScore": 67,
    "status": "submitted",
    "appliedDate": "1 hari yang lalu",
    "cvViewed": false,
    "authenticityScore": {
      "authentic": 74,
      "generic": 19,
      "aiGenerated": 2
    },
    "email": "agnezmo@email.com",
    "phone": "081219505284",
    "resumeLink": "https://example.com/cv.pdf"
  },
  {
    "id": "app-533",
    "applicantId": "nitaanggraini15",
    "applicantName": "Nita Anggraini",
    "jobId": "job-107",
    "jobTitle": "Software Engineer Intern",
    "cvSummary": "Kandidat memiliki pengalaman 3 tahun di bidang Teknik. Sangat menguasai Analisis dan memiliki rekam jejak yang baik dalam spesialis teknik.",
    "validationStatus": "completed",
    "validationResponses": [
      {
        "question": "Ceritakan pengalaman terbesar Anda di bidang ini.",
        "answer": "Saya telah bekerja sebagai Spesialis Teknik selama 3 tahun, fokus pada Analisis."
      },
      {
        "question": "Mengapa Anda tertarik dengan posisi ini?",
        "answer": "Saya melihat visi perusahaan ini sejalan dengan minat dan keahlian saya."
      }
    ],
    "recommendationScore": 98,
    "status": "submitted",
    "appliedDate": "3 hari yang lalu",
    "cvViewed": false,
    "authenticityScore": {
      "authentic": 86,
      "generic": 10,
      "aiGenerated": 10
    },
    "email": "nitaanggraini@email.com",
    "phone": "081227483963",
    "resumeLink": "https://example.com/cv.pdf"
  },
  {
    "id": "app-534",
    "applicantId": "fitriani14",
    "applicantName": "Fitriani",
    "jobId": "job-107",
    "jobTitle": "Software Engineer Intern",
    "cvSummary": "Kandidat memiliki pengalaman 3 tahun di bidang Teknik. Sangat menguasai Analisis dan memiliki rekam jejak yang baik dalam spesialis teknik.",
    "validationStatus": "completed",
    "validationResponses": [
      {
        "question": "Ceritakan pengalaman terbesar Anda di bidang ini.",
        "answer": "Saya telah bekerja sebagai Spesialis Teknik selama 3 tahun, fokus pada Analisis."
      },
      {
        "question": "Mengapa Anda tertarik dengan posisi ini?",
        "answer": "Saya melihat visi perusahaan ini sejalan dengan minat dan keahlian saya."
      }
    ],
    "recommendationScore": 72,
    "status": "under-review",
    "appliedDate": "9 hari yang lalu",
    "cvViewed": true,
    "authenticityScore": {
      "authentic": 86,
      "generic": 7,
      "aiGenerated": 0
    },
    "email": "fitriani@email.com",
    "phone": "081283026969",
    "resumeLink": "https://example.com/cv.pdf"
  },
  {
    "id": "app-535",
    "applicantId": "ekoprasetyo50",
    "applicantName": "Eko Prasetyo",
    "jobId": "job-108",
    "jobTitle": "AI Linguistic Voice Intern",
    "cvSummary": "Kandidat memiliki pengalaman 3 tahun di bidang Hospitaliti & Pariwisata. Sangat menguasai Analisis dan memiliki rekam jejak yang baik dalam spesialis hospitaliti & pariwisata.",
    "validationStatus": "completed",
    "validationResponses": [
      {
        "question": "Ceritakan pengalaman terbesar Anda di bidang ini.",
        "answer": "Saya telah bekerja sebagai Spesialis Hospitaliti & Pariwisata selama 3 tahun, fokus pada Analisis."
      },
      {
        "question": "Mengapa Anda tertarik dengan posisi ini?",
        "answer": "Saya melihat visi perusahaan ini sejalan dengan minat dan keahlian saya."
      }
    ],
    "recommendationScore": 64,
    "status": "under-review",
    "appliedDate": "9 hari yang lalu",
    "cvViewed": true,
    "authenticityScore": {
      "authentic": 87,
      "generic": 11,
      "aiGenerated": 6
    },
    "email": "ekoprasetyo@email.com",
    "phone": "081248834252",
    "resumeLink": "https://example.com/cv.pdf"
  },
  {
    "id": "app-536",
    "applicantId": "rezarahadian31",
    "applicantName": "Reza Rahadian",
    "jobId": "job-108",
    "jobTitle": "AI Linguistic Voice Intern",
    "cvSummary": "Kandidat memiliki pengalaman 3 tahun di bidang Hospitaliti & Pariwisata. Sangat menguasai Analisis, Manajemen, Komunikasi dan memiliki rekam jejak yang baik dalam spesialis hospitaliti & pariwisata.",
    "validationStatus": "completed",
    "validationResponses": [
      {
        "question": "Ceritakan pengalaman terbesar Anda di bidang ini.",
        "answer": "Saya telah bekerja sebagai Spesialis Hospitaliti & Pariwisata selama 3 tahun, fokus pada Analisis, Manajemen, Komunikasi."
      },
      {
        "question": "Mengapa Anda tertarik dengan posisi ini?",
        "answer": "Saya melihat visi perusahaan ini sejalan dengan minat dan keahlian saya."
      }
    ],
    "recommendationScore": 94,
    "status": "submitted",
    "appliedDate": "6 hari yang lalu",
    "cvViewed": true,
    "authenticityScore": {
      "authentic": 94,
      "generic": 17,
      "aiGenerated": 3
    },
    "email": "rezarahadian@email.com",
    "phone": "081288797876",
    "resumeLink": "https://example.com/cv.pdf"
  },
  {
    "id": "app-537",
    "applicantId": "liayuliana81",
    "applicantName": "Lia Yuliana",
    "jobId": "job-108",
    "jobTitle": "AI Linguistic Voice Intern",
    "cvSummary": "Kandidat memiliki pengalaman 3 tahun di bidang Hospitaliti & Pariwisata. Sangat menguasai Analisis dan memiliki rekam jejak yang baik dalam spesialis hospitaliti & pariwisata.",
    "validationStatus": "completed",
    "validationResponses": [
      {
        "question": "Ceritakan pengalaman terbesar Anda di bidang ini.",
        "answer": "Saya telah bekerja sebagai Spesialis Hospitaliti & Pariwisata selama 3 tahun, fokus pada Analisis."
      },
      {
        "question": "Mengapa Anda tertarik dengan posisi ini?",
        "answer": "Saya melihat visi perusahaan ini sejalan dengan minat dan keahlian saya."
      }
    ],
    "recommendationScore": 64,
    "status": "interview",
    "appliedDate": "2 hari yang lalu",
    "cvViewed": true,
    "authenticityScore": {
      "authentic": 75,
      "generic": 11,
      "aiGenerated": 1
    },
    "email": "liayuliana@email.com",
    "phone": "081296232759",
    "resumeLink": "https://example.com/cv.pdf"
  },
  {
    "id": "app-538",
    "applicantId": "lunamaya25",
    "applicantName": "Luna Maya",
    "jobId": "job-109",
    "jobTitle": "Senior IT GRC Analyst",
    "cvSummary": "Kandidat memiliki pengalaman 3 tahun di bidang Asuransi & Dana Pensiun. Sangat menguasai Analisis, Manajemen dan memiliki rekam jejak yang baik dalam spesialis asuransi & dana pensiun.",
    "validationStatus": "completed",
    "validationResponses": [
      {
        "question": "Ceritakan pengalaman terbesar Anda di bidang ini.",
        "answer": "Saya telah bekerja sebagai Spesialis Asuransi & Dana Pensiun selama 3 tahun, fokus pada Analisis, Manajemen."
      },
      {
        "question": "Mengapa Anda tertarik dengan posisi ini?",
        "answer": "Saya melihat visi perusahaan ini sejalan dengan minat dan keahlian saya."
      }
    ],
    "recommendationScore": 92,
    "status": "interview",
    "appliedDate": "7 hari yang lalu",
    "cvViewed": true,
    "authenticityScore": {
      "authentic": 73,
      "generic": 19,
      "aiGenerated": 9
    },
    "email": "lunamaya@email.com",
    "phone": "081216870457",
    "resumeLink": "https://example.com/cv.pdf"
  },
  {
    "id": "app-539",
    "applicantId": "rezarahadian24",
    "applicantName": "Reza Rahadian",
    "jobId": "job-109",
    "jobTitle": "Senior IT GRC Analyst",
    "cvSummary": "Kandidat memiliki pengalaman 3 tahun di bidang Asuransi & Dana Pensiun. Sangat menguasai Analisis, Manajemen, Komunikasi dan memiliki rekam jejak yang baik dalam spesialis asuransi & dana pensiun.",
    "validationStatus": "completed",
    "validationResponses": [
      {
        "question": "Ceritakan pengalaman terbesar Anda di bidang ini.",
        "answer": "Saya telah bekerja sebagai Spesialis Asuransi & Dana Pensiun selama 3 tahun, fokus pada Analisis, Manajemen, Komunikasi."
      },
      {
        "question": "Mengapa Anda tertarik dengan posisi ini?",
        "answer": "Saya melihat visi perusahaan ini sejalan dengan minat dan keahlian saya."
      }
    ],
    "recommendationScore": 67,
    "status": "interview",
    "appliedDate": "10 hari yang lalu",
    "cvViewed": true,
    "authenticityScore": {
      "authentic": 95,
      "generic": 20,
      "aiGenerated": 3
    },
    "email": "rezarahadian@email.com",
    "phone": "081213202715",
    "resumeLink": "https://example.com/cv.pdf"
  },
  {
    "id": "app-540",
    "applicantId": "nitaanggraini87",
    "applicantName": "Nita Anggraini",
    "jobId": "job-109",
    "jobTitle": "Senior IT GRC Analyst",
    "cvSummary": "Kandidat memiliki pengalaman 3 tahun di bidang Asuransi & Dana Pensiun. Sangat menguasai Analisis, Manajemen, Komunikasi dan memiliki rekam jejak yang baik dalam spesialis asuransi & dana pensiun.",
    "validationStatus": "completed",
    "validationResponses": [
      {
        "question": "Ceritakan pengalaman terbesar Anda di bidang ini.",
        "answer": "Saya telah bekerja sebagai Spesialis Asuransi & Dana Pensiun selama 3 tahun, fokus pada Analisis, Manajemen, Komunikasi."
      },
      {
        "question": "Mengapa Anda tertarik dengan posisi ini?",
        "answer": "Saya melihat visi perusahaan ini sejalan dengan minat dan keahlian saya."
      }
    ],
    "recommendationScore": 73,
    "status": "submitted",
    "appliedDate": "6 hari yang lalu",
    "cvViewed": true,
    "authenticityScore": {
      "authentic": 71,
      "generic": 8,
      "aiGenerated": 5
    },
    "email": "nitaanggraini@email.com",
    "phone": "081270384353",
    "resumeLink": "https://example.com/cv.pdf"
  },
  {
    "id": "app-541",
    "applicantId": "afgansyahreza90",
    "applicantName": "Afgan Syahreza",
    "jobId": "job-109",
    "jobTitle": "Senior IT GRC Analyst",
    "cvSummary": "Kandidat memiliki pengalaman 3 tahun di bidang Asuransi & Dana Pensiun. Sangat menguasai Analisis, Manajemen, Komunikasi dan memiliki rekam jejak yang baik dalam spesialis asuransi & dana pensiun.",
    "validationStatus": "completed",
    "validationResponses": [
      {
        "question": "Ceritakan pengalaman terbesar Anda di bidang ini.",
        "answer": "Saya telah bekerja sebagai Spesialis Asuransi & Dana Pensiun selama 3 tahun, fokus pada Analisis, Manajemen, Komunikasi."
      },
      {
        "question": "Mengapa Anda tertarik dengan posisi ini?",
        "answer": "Saya melihat visi perusahaan ini sejalan dengan minat dan keahlian saya."
      }
    ],
    "recommendationScore": 72,
    "status": "under-review",
    "appliedDate": "1 hari yang lalu",
    "cvViewed": true,
    "authenticityScore": {
      "authentic": 80,
      "generic": 9,
      "aiGenerated": 8
    },
    "email": "afgansyahreza@email.com",
    "phone": "081289692929",
    "resumeLink": "https://example.com/cv.pdf"
  },
  {
    "id": "app-542",
    "applicantId": "jokowidodo52",
    "applicantName": "Joko Widodo",
    "jobId": "job-110",
    "jobTitle": "People Business Partner (Data)",
    "cvSummary": "Kandidat memiliki pengalaman 3 tahun di bidang Olahraga & Rekreasi. Sangat menguasai Analisis, Manajemen, Komunikasi dan memiliki rekam jejak yang baik dalam spesialis olahraga & rekreasi.",
    "validationStatus": "completed",
    "validationResponses": [
      {
        "question": "Ceritakan pengalaman terbesar Anda di bidang ini.",
        "answer": "Saya telah bekerja sebagai Spesialis Olahraga & Rekreasi selama 3 tahun, fokus pada Analisis, Manajemen, Komunikasi."
      },
      {
        "question": "Mengapa Anda tertarik dengan posisi ini?",
        "answer": "Saya melihat visi perusahaan ini sejalan dengan minat dan keahlian saya."
      }
    ],
    "recommendationScore": 83,
    "status": "under-review",
    "appliedDate": "2 hari yang lalu",
    "cvViewed": true,
    "authenticityScore": {
      "authentic": 75,
      "generic": 14,
      "aiGenerated": 3
    },
    "email": "jokowidodo@email.com",
    "phone": "081282628137",
    "resumeLink": "https://example.com/cv.pdf"
  },
  {
    "id": "app-543",
    "applicantId": "ayuwandira30",
    "applicantName": "Ayu Wandira",
    "jobId": "job-110",
    "jobTitle": "People Business Partner (Data)",
    "cvSummary": "Kandidat memiliki pengalaman 3 tahun di bidang Olahraga & Rekreasi. Sangat menguasai Analisis, Manajemen dan memiliki rekam jejak yang baik dalam spesialis olahraga & rekreasi.",
    "validationStatus": "completed",
    "validationResponses": [
      {
        "question": "Ceritakan pengalaman terbesar Anda di bidang ini.",
        "answer": "Saya telah bekerja sebagai Spesialis Olahraga & Rekreasi selama 3 tahun, fokus pada Analisis, Manajemen."
      },
      {
        "question": "Mengapa Anda tertarik dengan posisi ini?",
        "answer": "Saya melihat visi perusahaan ini sejalan dengan minat dan keahlian saya."
      }
    ],
    "recommendationScore": 58,
    "status": "submitted",
    "appliedDate": "6 hari yang lalu",
    "cvViewed": false,
    "authenticityScore": {
      "authentic": 94,
      "generic": 19,
      "aiGenerated": 2
    },
    "email": "ayuwandira@email.com",
    "phone": "081243767698",
    "resumeLink": "https://example.com/cv.pdf"
  },
  {
    "id": "app-544",
    "applicantId": "arielnoah71",
    "applicantName": "Ariel Noah",
    "jobId": "job-110",
    "jobTitle": "People Business Partner (Data)",
    "cvSummary": "Kandidat memiliki pengalaman 3 tahun di bidang Olahraga & Rekreasi. Sangat menguasai Analisis dan memiliki rekam jejak yang baik dalam spesialis olahraga & rekreasi.",
    "validationStatus": "completed",
    "validationResponses": [
      {
        "question": "Ceritakan pengalaman terbesar Anda di bidang ini.",
        "answer": "Saya telah bekerja sebagai Spesialis Olahraga & Rekreasi selama 3 tahun, fokus pada Analisis."
      },
      {
        "question": "Mengapa Anda tertarik dengan posisi ini?",
        "answer": "Saya melihat visi perusahaan ini sejalan dengan minat dan keahlian saya."
      }
    ],
    "recommendationScore": 98,
    "status": "under-review",
    "appliedDate": "8 hari yang lalu",
    "cvViewed": true,
    "authenticityScore": {
      "authentic": 85,
      "generic": 8,
      "aiGenerated": 8
    },
    "email": "arielnoah@email.com",
    "phone": "081276781503",
    "resumeLink": "https://example.com/cv.pdf"
  },
  {
    "id": "app-545",
    "applicantId": "fajarnugraha71",
    "applicantName": "Fajar Nugraha",
    "jobId": "job-111",
    "jobTitle": "Lending Risk Analyst",
    "cvSummary": "Kandidat memiliki pengalaman 3 tahun di bidang Konsultasi & Strategi. Sangat menguasai Analisis dan memiliki rekam jejak yang baik dalam spesialis konsultasi & strategi.",
    "validationStatus": "completed",
    "validationResponses": [
      {
        "question": "Ceritakan pengalaman terbesar Anda di bidang ini.",
        "answer": "Saya telah bekerja sebagai Spesialis Konsultasi & Strategi selama 3 tahun, fokus pada Analisis."
      },
      {
        "question": "Mengapa Anda tertarik dengan posisi ini?",
        "answer": "Saya melihat visi perusahaan ini sejalan dengan minat dan keahlian saya."
      }
    ],
    "recommendationScore": 68,
    "status": "rejected",
    "appliedDate": "2 hari yang lalu",
    "cvViewed": true,
    "authenticityScore": {
      "authentic": 77,
      "generic": 7,
      "aiGenerated": 10
    },
    "email": "fajarnugraha@email.com",
    "phone": "081212833591",
    "resumeLink": "https://example.com/cv.pdf"
  },
  {
    "id": "app-546",
    "applicantId": "jokowidodo96",
    "applicantName": "Joko Widodo",
    "jobId": "job-111",
    "jobTitle": "Lending Risk Analyst",
    "cvSummary": "Kandidat memiliki pengalaman 3 tahun di bidang Konsultasi & Strategi. Sangat menguasai Analisis, Manajemen, Komunikasi dan memiliki rekam jejak yang baik dalam spesialis konsultasi & strategi.",
    "validationStatus": "completed",
    "validationResponses": [
      {
        "question": "Ceritakan pengalaman terbesar Anda di bidang ini.",
        "answer": "Saya telah bekerja sebagai Spesialis Konsultasi & Strategi selama 3 tahun, fokus pada Analisis, Manajemen, Komunikasi."
      },
      {
        "question": "Mengapa Anda tertarik dengan posisi ini?",
        "answer": "Saya melihat visi perusahaan ini sejalan dengan minat dan keahlian saya."
      }
    ],
    "recommendationScore": 73,
    "status": "interview",
    "appliedDate": "9 hari yang lalu",
    "cvViewed": true,
    "authenticityScore": {
      "authentic": 78,
      "generic": 6,
      "aiGenerated": 8
    },
    "email": "jokowidodo@email.com",
    "phone": "081268868699",
    "resumeLink": "https://example.com/cv.pdf"
  },
  {
    "id": "app-547",
    "applicantId": "andipratama67",
    "applicantName": "Andi Pratama",
    "jobId": "job-111",
    "jobTitle": "Lending Risk Analyst",
    "cvSummary": "Kandidat memiliki pengalaman 3 tahun di bidang Konsultasi & Strategi. Sangat menguasai Analisis dan memiliki rekam jejak yang baik dalam spesialis konsultasi & strategi.",
    "validationStatus": "completed",
    "validationResponses": [
      {
        "question": "Ceritakan pengalaman terbesar Anda di bidang ini.",
        "answer": "Saya telah bekerja sebagai Spesialis Konsultasi & Strategi selama 3 tahun, fokus pada Analisis."
      },
      {
        "question": "Mengapa Anda tertarik dengan posisi ini?",
        "answer": "Saya melihat visi perusahaan ini sejalan dengan minat dan keahlian saya."
      }
    ],
    "recommendationScore": 86,
    "status": "rejected",
    "appliedDate": "7 hari yang lalu",
    "cvViewed": true,
    "authenticityScore": {
      "authentic": 84,
      "generic": 19,
      "aiGenerated": 7
    },
    "email": "andipratama@email.com",
    "phone": "081212596188",
    "resumeLink": "https://example.com/cv.pdf"
  },
  {
    "id": "app-548",
    "applicantId": "dinafitriani76",
    "applicantName": "Dina Fitriani",
    "jobId": "job-111",
    "jobTitle": "Lending Risk Analyst",
    "cvSummary": "Kandidat memiliki pengalaman 3 tahun di bidang Konsultasi & Strategi. Sangat menguasai Analisis, Manajemen dan memiliki rekam jejak yang baik dalam spesialis konsultasi & strategi.",
    "validationStatus": "completed",
    "validationResponses": [
      {
        "question": "Ceritakan pengalaman terbesar Anda di bidang ini.",
        "answer": "Saya telah bekerja sebagai Spesialis Konsultasi & Strategi selama 3 tahun, fokus pada Analisis, Manajemen."
      },
      {
        "question": "Mengapa Anda tertarik dengan posisi ini?",
        "answer": "Saya melihat visi perusahaan ini sejalan dengan minat dan keahlian saya."
      }
    ],
    "recommendationScore": 89,
    "status": "under-review",
    "appliedDate": "7 hari yang lalu",
    "cvViewed": true,
    "authenticityScore": {
      "authentic": 72,
      "generic": 20,
      "aiGenerated": 4
    },
    "email": "dinafitriani@email.com",
    "phone": "081260697559",
    "resumeLink": "https://example.com/cv.pdf"
  },
  {
    "id": "app-549",
    "applicantId": "nagitaslavina12",
    "applicantName": "Nagita Slavina",
    "jobId": "job-112",
    "jobTitle": "Tax Intern",
    "cvSummary": "Kandidat memiliki pengalaman 3 tahun di bidang Ritel & Produk Konsumen. Sangat menguasai Analisis, Manajemen, Komunikasi dan memiliki rekam jejak yang baik dalam spesialis ritel & produk konsumen.",
    "validationStatus": "completed",
    "validationResponses": [
      {
        "question": "Ceritakan pengalaman terbesar Anda di bidang ini.",
        "answer": "Saya telah bekerja sebagai Spesialis Ritel & Produk Konsumen selama 3 tahun, fokus pada Analisis, Manajemen, Komunikasi."
      },
      {
        "question": "Mengapa Anda tertarik dengan posisi ini?",
        "answer": "Saya melihat visi perusahaan ini sejalan dengan minat dan keahlian saya."
      }
    ],
    "recommendationScore": 66,
    "status": "interview",
    "appliedDate": "1 hari yang lalu",
    "cvViewed": true,
    "authenticityScore": {
      "authentic": 90,
      "generic": 10,
      "aiGenerated": 9
    },
    "email": "nagitaslavina@email.com",
    "phone": "081272546091",
    "resumeLink": "https://example.com/cv.pdf"
  },
  {
    "id": "app-550",
    "applicantId": "donisaputra52",
    "applicantName": "Doni Saputra",
    "jobId": "job-112",
    "jobTitle": "Tax Intern",
    "cvSummary": "Kandidat memiliki pengalaman 3 tahun di bidang Ritel & Produk Konsumen. Sangat menguasai Analisis, Manajemen dan memiliki rekam jejak yang baik dalam spesialis ritel & produk konsumen.",
    "validationStatus": "completed",
    "validationResponses": [
      {
        "question": "Ceritakan pengalaman terbesar Anda di bidang ini.",
        "answer": "Saya telah bekerja sebagai Spesialis Ritel & Produk Konsumen selama 3 tahun, fokus pada Analisis, Manajemen."
      },
      {
        "question": "Mengapa Anda tertarik dengan posisi ini?",
        "answer": "Saya melihat visi perusahaan ini sejalan dengan minat dan keahlian saya."
      }
    ],
    "recommendationScore": 85,
    "status": "submitted",
    "appliedDate": "3 hari yang lalu",
    "cvViewed": false,
    "authenticityScore": {
      "authentic": 87,
      "generic": 15,
      "aiGenerated": 1
    },
    "email": "donisaputra@email.com",
    "phone": "081224760638",
    "resumeLink": "https://example.com/cv.pdf"
  },
  {
    "id": "app-551",
    "applicantId": "mayasari39",
    "applicantName": "Maya Sari",
    "jobId": "job-112",
    "jobTitle": "Tax Intern",
    "cvSummary": "Kandidat memiliki pengalaman 3 tahun di bidang Ritel & Produk Konsumen. Sangat menguasai Analisis, Manajemen dan memiliki rekam jejak yang baik dalam spesialis ritel & produk konsumen.",
    "validationStatus": "completed",
    "validationResponses": [
      {
        "question": "Ceritakan pengalaman terbesar Anda di bidang ini.",
        "answer": "Saya telah bekerja sebagai Spesialis Ritel & Produk Konsumen selama 3 tahun, fokus pada Analisis, Manajemen."
      },
      {
        "question": "Mengapa Anda tertarik dengan posisi ini?",
        "answer": "Saya melihat visi perusahaan ini sejalan dengan minat dan keahlian saya."
      }
    ],
    "recommendationScore": 69,
    "status": "rejected",
    "appliedDate": "6 hari yang lalu",
    "cvViewed": true,
    "authenticityScore": {
      "authentic": 81,
      "generic": 10,
      "aiGenerated": 1
    },
    "email": "mayasari@email.com",
    "phone": "081211335530",
    "resumeLink": "https://example.com/cv.pdf"
  },
  {
    "id": "app-552",
    "applicantId": "santisusanti65",
    "applicantName": "Santi Susanti",
    "jobId": "job-112",
    "jobTitle": "Tax Intern",
    "cvSummary": "Kandidat memiliki pengalaman 3 tahun di bidang Ritel & Produk Konsumen. Sangat menguasai Analisis dan memiliki rekam jejak yang baik dalam spesialis ritel & produk konsumen.",
    "validationStatus": "completed",
    "validationResponses": [
      {
        "question": "Ceritakan pengalaman terbesar Anda di bidang ini.",
        "answer": "Saya telah bekerja sebagai Spesialis Ritel & Produk Konsumen selama 3 tahun, fokus pada Analisis."
      },
      {
        "question": "Mengapa Anda tertarik dengan posisi ini?",
        "answer": "Saya melihat visi perusahaan ini sejalan dengan minat dan keahlian saya."
      }
    ],
    "recommendationScore": 68,
    "status": "submitted",
    "appliedDate": "8 hari yang lalu",
    "cvViewed": false,
    "authenticityScore": {
      "authentic": 71,
      "generic": 11,
      "aiGenerated": 9
    },
    "email": "santisusanti@email.com",
    "phone": "081245810697",
    "resumeLink": "https://example.com/cv.pdf"
  },
  {
    "id": "app-553",
    "applicantId": "rossa48",
    "applicantName": "Rossa",
    "jobId": "job-112",
    "jobTitle": "Tax Intern",
    "cvSummary": "Kandidat memiliki pengalaman 3 tahun di bidang Ritel & Produk Konsumen. Sangat menguasai Analisis, Manajemen, Komunikasi dan memiliki rekam jejak yang baik dalam spesialis ritel & produk konsumen.",
    "validationStatus": "completed",
    "validationResponses": [
      {
        "question": "Ceritakan pengalaman terbesar Anda di bidang ini.",
        "answer": "Saya telah bekerja sebagai Spesialis Ritel & Produk Konsumen selama 3 tahun, fokus pada Analisis, Manajemen, Komunikasi."
      },
      {
        "question": "Mengapa Anda tertarik dengan posisi ini?",
        "answer": "Saya melihat visi perusahaan ini sejalan dengan minat dan keahlian saya."
      }
    ],
    "recommendationScore": 58,
    "status": "under-review",
    "appliedDate": "7 hari yang lalu",
    "cvViewed": true,
    "authenticityScore": {
      "authentic": 82,
      "generic": 16,
      "aiGenerated": 0
    },
    "email": "rossa@email.com",
    "phone": "081293293601",
    "resumeLink": "https://example.com/cv.pdf"
  },
  {
    "id": "app-554",
    "applicantId": "ekoprasetyo52",
    "applicantName": "Eko Prasetyo",
    "jobId": "job-113",
    "jobTitle": "People Business Partner (Data)",
    "cvSummary": "Kandidat memiliki pengalaman 3 tahun di bidang Olahraga & Rekreasi. Sangat menguasai Analisis dan memiliki rekam jejak yang baik dalam spesialis olahraga & rekreasi.",
    "validationStatus": "completed",
    "validationResponses": [
      {
        "question": "Ceritakan pengalaman terbesar Anda di bidang ini.",
        "answer": "Saya telah bekerja sebagai Spesialis Olahraga & Rekreasi selama 3 tahun, fokus pada Analisis."
      },
      {
        "question": "Mengapa Anda tertarik dengan posisi ini?",
        "answer": "Saya melihat visi perusahaan ini sejalan dengan minat dan keahlian saya."
      }
    ],
    "recommendationScore": 95,
    "status": "interview",
    "appliedDate": "5 hari yang lalu",
    "cvViewed": true,
    "authenticityScore": {
      "authentic": 88,
      "generic": 17,
      "aiGenerated": 5
    },
    "email": "ekoprasetyo@email.com",
    "phone": "081294629984",
    "resumeLink": "https://example.com/cv.pdf"
  },
  {
    "id": "app-555",
    "applicantId": "rinaamelia79",
    "applicantName": "Rina Amelia",
    "jobId": "job-113",
    "jobTitle": "People Business Partner (Data)",
    "cvSummary": "Kandidat memiliki pengalaman 3 tahun di bidang Olahraga & Rekreasi. Sangat menguasai Analisis dan memiliki rekam jejak yang baik dalam spesialis olahraga & rekreasi.",
    "validationStatus": "completed",
    "validationResponses": [
      {
        "question": "Ceritakan pengalaman terbesar Anda di bidang ini.",
        "answer": "Saya telah bekerja sebagai Spesialis Olahraga & Rekreasi selama 3 tahun, fokus pada Analisis."
      },
      {
        "question": "Mengapa Anda tertarik dengan posisi ini?",
        "answer": "Saya melihat visi perusahaan ini sejalan dengan minat dan keahlian saya."
      }
    ],
    "recommendationScore": 56,
    "status": "interview",
    "appliedDate": "5 hari yang lalu",
    "cvViewed": true,
    "authenticityScore": {
      "authentic": 72,
      "generic": 6,
      "aiGenerated": 1
    },
    "email": "rinaamelia@email.com",
    "phone": "081261009184",
    "resumeLink": "https://example.com/cv.pdf"
  },
  {
    "id": "app-556",
    "applicantId": "afgansyahreza41",
    "applicantName": "Afgan Syahreza",
    "jobId": "job-113",
    "jobTitle": "People Business Partner (Data)",
    "cvSummary": "Kandidat memiliki pengalaman 3 tahun di bidang Olahraga & Rekreasi. Sangat menguasai Analisis dan memiliki rekam jejak yang baik dalam spesialis olahraga & rekreasi.",
    "validationStatus": "completed",
    "validationResponses": [
      {
        "question": "Ceritakan pengalaman terbesar Anda di bidang ini.",
        "answer": "Saya telah bekerja sebagai Spesialis Olahraga & Rekreasi selama 3 tahun, fokus pada Analisis."
      },
      {
        "question": "Mengapa Anda tertarik dengan posisi ini?",
        "answer": "Saya melihat visi perusahaan ini sejalan dengan minat dan keahlian saya."
      }
    ],
    "recommendationScore": 84,
    "status": "under-review",
    "appliedDate": "9 hari yang lalu",
    "cvViewed": true,
    "authenticityScore": {
      "authentic": 78,
      "generic": 7,
      "aiGenerated": 1
    },
    "email": "afgansyahreza@email.com",
    "phone": "081261070317",
    "resumeLink": "https://example.com/cv.pdf"
  },
  {
    "id": "app-557",
    "applicantId": "tutihandayani90",
    "applicantName": "Tuti Handayani",
    "jobId": "job-114",
    "jobTitle": "Regulatory Manager",
    "cvSummary": "Kandidat memiliki pengalaman 3 tahun di bidang Kesehatan & Medis. Sangat menguasai STR Aktif, Asuhan Keperawatan dan memiliki rekam jejak yang baik dalam perawat klinis.",
    "validationStatus": "completed",
    "validationResponses": [
      {
        "question": "Ceritakan pengalaman terbesar Anda di bidang ini.",
        "answer": "Saya telah bekerja sebagai Perawat Klinis selama 3 tahun, fokus pada STR Aktif, Asuhan Keperawatan."
      },
      {
        "question": "Mengapa Anda tertarik dengan posisi ini?",
        "answer": "Saya melihat visi perusahaan ini sejalan dengan minat dan keahlian saya."
      }
    ],
    "recommendationScore": 60,
    "status": "submitted",
    "appliedDate": "10 hari yang lalu",
    "cvViewed": true,
    "authenticityScore": {
      "authentic": 79,
      "generic": 7,
      "aiGenerated": 4
    },
    "email": "tutihandayani@email.com",
    "phone": "081216042828",
    "resumeLink": "https://example.com/cv.pdf"
  },
  {
    "id": "app-558",
    "applicantId": "ratihpurwasih26",
    "applicantName": "Ratih Purwasih",
    "jobId": "job-114",
    "jobTitle": "Regulatory Manager",
    "cvSummary": "Kandidat memiliki pengalaman 3 tahun di bidang Kesehatan & Medis. Sangat menguasai STR Aktif dan memiliki rekam jejak yang baik dalam perawat klinis.",
    "validationStatus": "completed",
    "validationResponses": [
      {
        "question": "Ceritakan pengalaman terbesar Anda di bidang ini.",
        "answer": "Saya telah bekerja sebagai Perawat Klinis selama 3 tahun, fokus pada STR Aktif."
      },
      {
        "question": "Mengapa Anda tertarik dengan posisi ini?",
        "answer": "Saya melihat visi perusahaan ini sejalan dengan minat dan keahlian saya."
      }
    ],
    "recommendationScore": 98,
    "status": "rejected",
    "appliedDate": "2 hari yang lalu",
    "cvViewed": true,
    "authenticityScore": {
      "authentic": 90,
      "generic": 12,
      "aiGenerated": 0
    },
    "email": "ratihpurwasih@email.com",
    "phone": "081258114257",
    "resumeLink": "https://example.com/cv.pdf"
  },
  {
    "id": "app-559",
    "applicantId": "irfanhakim45",
    "applicantName": "Irfan Hakim",
    "jobId": "job-114",
    "jobTitle": "Regulatory Manager",
    "cvSummary": "Kandidat memiliki pengalaman 3 tahun di bidang Kesehatan & Medis. Sangat menguasai STR Aktif dan memiliki rekam jejak yang baik dalam perawat klinis.",
    "validationStatus": "completed",
    "validationResponses": [
      {
        "question": "Ceritakan pengalaman terbesar Anda di bidang ini.",
        "answer": "Saya telah bekerja sebagai Perawat Klinis selama 3 tahun, fokus pada STR Aktif."
      },
      {
        "question": "Mengapa Anda tertarik dengan posisi ini?",
        "answer": "Saya melihat visi perusahaan ini sejalan dengan minat dan keahlian saya."
      }
    ],
    "recommendationScore": 93,
    "status": "rejected",
    "appliedDate": "1 hari yang lalu",
    "cvViewed": true,
    "authenticityScore": {
      "authentic": 81,
      "generic": 14,
      "aiGenerated": 9
    },
    "email": "irfanhakim@email.com",
    "phone": "081281312690",
    "resumeLink": "https://example.com/cv.pdf"
  },
  {
    "id": "app-560",
    "applicantId": "rezarahadian35",
    "applicantName": "Reza Rahadian",
    "jobId": "job-114",
    "jobTitle": "Regulatory Manager",
    "cvSummary": "Kandidat memiliki pengalaman 3 tahun di bidang Kesehatan & Medis. Sangat menguasai STR Aktif, Asuhan Keperawatan, Komunikasi Pasien dan memiliki rekam jejak yang baik dalam perawat klinis.",
    "validationStatus": "completed",
    "validationResponses": [
      {
        "question": "Ceritakan pengalaman terbesar Anda di bidang ini.",
        "answer": "Saya telah bekerja sebagai Perawat Klinis selama 3 tahun, fokus pada STR Aktif, Asuhan Keperawatan, Komunikasi Pasien."
      },
      {
        "question": "Mengapa Anda tertarik dengan posisi ini?",
        "answer": "Saya melihat visi perusahaan ini sejalan dengan minat dan keahlian saya."
      }
    ],
    "recommendationScore": 82,
    "status": "interview",
    "appliedDate": "5 hari yang lalu",
    "cvViewed": true,
    "authenticityScore": {
      "authentic": 70,
      "generic": 16,
      "aiGenerated": 10
    },
    "email": "rezarahadian@email.com",
    "phone": "081263501763",
    "resumeLink": "https://example.com/cv.pdf"
  },
  {
    "id": "app-561",
    "applicantId": "bimaarya51",
    "applicantName": "Bima Arya",
    "jobId": "job-114",
    "jobTitle": "Regulatory Manager",
    "cvSummary": "Kandidat memiliki pengalaman 3 tahun di bidang Kesehatan & Medis. Sangat menguasai STR Aktif dan memiliki rekam jejak yang baik dalam perawat klinis.",
    "validationStatus": "completed",
    "validationResponses": [
      {
        "question": "Ceritakan pengalaman terbesar Anda di bidang ini.",
        "answer": "Saya telah bekerja sebagai Perawat Klinis selama 3 tahun, fokus pada STR Aktif."
      },
      {
        "question": "Mengapa Anda tertarik dengan posisi ini?",
        "answer": "Saya melihat visi perusahaan ini sejalan dengan minat dan keahlian saya."
      }
    ],
    "recommendationScore": 64,
    "status": "submitted",
    "appliedDate": "1 hari yang lalu",
    "cvViewed": false,
    "authenticityScore": {
      "authentic": 73,
      "generic": 7,
      "aiGenerated": 9
    },
    "email": "bimaarya@email.com",
    "phone": "081245754282",
    "resumeLink": "https://example.com/cv.pdf"
  },
  {
    "id": "app-562",
    "applicantId": "rizkyfauzi91",
    "applicantName": "Rizky Fauzi",
    "jobId": "job-115",
    "jobTitle": "Regulatory Manager",
    "cvSummary": "Kandidat memiliki pengalaman 3 tahun di bidang Kesehatan & Medis. Sangat menguasai STR Aktif dan memiliki rekam jejak yang baik dalam perawat klinis.",
    "validationStatus": "completed",
    "validationResponses": [
      {
        "question": "Ceritakan pengalaman terbesar Anda di bidang ini.",
        "answer": "Saya telah bekerja sebagai Perawat Klinis selama 3 tahun, fokus pada STR Aktif."
      },
      {
        "question": "Mengapa Anda tertarik dengan posisi ini?",
        "answer": "Saya melihat visi perusahaan ini sejalan dengan minat dan keahlian saya."
      }
    ],
    "recommendationScore": 88,
    "status": "submitted",
    "appliedDate": "7 hari yang lalu",
    "cvViewed": true,
    "authenticityScore": {
      "authentic": 78,
      "generic": 15,
      "aiGenerated": 5
    },
    "email": "rizkyfauzi@email.com",
    "phone": "081298411640",
    "resumeLink": "https://example.com/cv.pdf"
  },
  {
    "id": "app-563",
    "applicantId": "putrimaharani84",
    "applicantName": "Putri Maharani",
    "jobId": "job-115",
    "jobTitle": "Regulatory Manager",
    "cvSummary": "Kandidat memiliki pengalaman 3 tahun di bidang Kesehatan & Medis. Sangat menguasai STR Aktif, Asuhan Keperawatan dan memiliki rekam jejak yang baik dalam perawat klinis.",
    "validationStatus": "completed",
    "validationResponses": [
      {
        "question": "Ceritakan pengalaman terbesar Anda di bidang ini.",
        "answer": "Saya telah bekerja sebagai Perawat Klinis selama 3 tahun, fokus pada STR Aktif, Asuhan Keperawatan."
      },
      {
        "question": "Mengapa Anda tertarik dengan posisi ini?",
        "answer": "Saya melihat visi perusahaan ini sejalan dengan minat dan keahlian saya."
      }
    ],
    "recommendationScore": 89,
    "status": "under-review",
    "appliedDate": "6 hari yang lalu",
    "cvViewed": true,
    "authenticityScore": {
      "authentic": 86,
      "generic": 12,
      "aiGenerated": 9
    },
    "email": "putrimaharani@email.com",
    "phone": "081254909382",
    "resumeLink": "https://example.com/cv.pdf"
  },
  {
    "id": "app-564",
    "applicantId": "jokowidodo54",
    "applicantName": "Joko Widodo",
    "jobId": "job-115",
    "jobTitle": "Regulatory Manager",
    "cvSummary": "Kandidat memiliki pengalaman 3 tahun di bidang Kesehatan & Medis. Sangat menguasai STR Aktif, Asuhan Keperawatan, Komunikasi Pasien dan memiliki rekam jejak yang baik dalam perawat klinis.",
    "validationStatus": "completed",
    "validationResponses": [
      {
        "question": "Ceritakan pengalaman terbesar Anda di bidang ini.",
        "answer": "Saya telah bekerja sebagai Perawat Klinis selama 3 tahun, fokus pada STR Aktif, Asuhan Keperawatan, Komunikasi Pasien."
      },
      {
        "question": "Mengapa Anda tertarik dengan posisi ini?",
        "answer": "Saya melihat visi perusahaan ini sejalan dengan minat dan keahlian saya."
      }
    ],
    "recommendationScore": 62,
    "status": "rejected",
    "appliedDate": "4 hari yang lalu",
    "cvViewed": true,
    "authenticityScore": {
      "authentic": 74,
      "generic": 7,
      "aiGenerated": 6
    },
    "email": "jokowidodo@email.com",
    "phone": "081278060112",
    "resumeLink": "https://example.com/cv.pdf"
  },
  {
    "id": "app-565",
    "applicantId": "santisusanti49",
    "applicantName": "Santi Susanti",
    "jobId": "job-115",
    "jobTitle": "Regulatory Manager",
    "cvSummary": "Kandidat memiliki pengalaman 3 tahun di bidang Kesehatan & Medis. Sangat menguasai STR Aktif, Asuhan Keperawatan, Komunikasi Pasien dan memiliki rekam jejak yang baik dalam perawat klinis.",
    "validationStatus": "completed",
    "validationResponses": [
      {
        "question": "Ceritakan pengalaman terbesar Anda di bidang ini.",
        "answer": "Saya telah bekerja sebagai Perawat Klinis selama 3 tahun, fokus pada STR Aktif, Asuhan Keperawatan, Komunikasi Pasien."
      },
      {
        "question": "Mengapa Anda tertarik dengan posisi ini?",
        "answer": "Saya melihat visi perusahaan ini sejalan dengan minat dan keahlian saya."
      }
    ],
    "recommendationScore": 92,
    "status": "rejected",
    "appliedDate": "6 hari yang lalu",
    "cvViewed": true,
    "authenticityScore": {
      "authentic": 90,
      "generic": 18,
      "aiGenerated": 5
    },
    "email": "santisusanti@email.com",
    "phone": "081277649221",
    "resumeLink": "https://example.com/cv.pdf"
  },
  {
    "id": "app-566",
    "applicantId": "irfanhakim62",
    "applicantName": "Irfan Hakim",
    "jobId": "job-115",
    "jobTitle": "Regulatory Manager",
    "cvSummary": "Kandidat memiliki pengalaman 3 tahun di bidang Kesehatan & Medis. Sangat menguasai STR Aktif dan memiliki rekam jejak yang baik dalam perawat klinis.",
    "validationStatus": "completed",
    "validationResponses": [
      {
        "question": "Ceritakan pengalaman terbesar Anda di bidang ini.",
        "answer": "Saya telah bekerja sebagai Perawat Klinis selama 3 tahun, fokus pada STR Aktif."
      },
      {
        "question": "Mengapa Anda tertarik dengan posisi ini?",
        "answer": "Saya melihat visi perusahaan ini sejalan dengan minat dan keahlian saya."
      }
    ],
    "recommendationScore": 89,
    "status": "submitted",
    "appliedDate": "7 hari yang lalu",
    "cvViewed": false,
    "authenticityScore": {
      "authentic": 95,
      "generic": 15,
      "aiGenerated": 4
    },
    "email": "irfanhakim@email.com",
    "phone": "081269065766",
    "resumeLink": "https://example.com/cv.pdf"
  },
  {
    "id": "app-567",
    "applicantId": "donisaputra68",
    "applicantName": "Doni Saputra",
    "jobId": "job-116",
    "jobTitle": "Media Relations Intern",
    "cvSummary": "Kandidat memiliki pengalaman 3 tahun di bidang Administrasi & Dukungan Perkantoran. Sangat menguasai Manajemen Inventaris, Komunikasi dan memiliki rekam jejak yang baik dalam office manager.",
    "validationStatus": "completed",
    "validationResponses": [
      {
        "question": "Ceritakan pengalaman terbesar Anda di bidang ini.",
        "answer": "Saya telah bekerja sebagai Office Manager selama 3 tahun, fokus pada Manajemen Inventaris, Komunikasi."
      },
      {
        "question": "Mengapa Anda tertarik dengan posisi ini?",
        "answer": "Saya melihat visi perusahaan ini sejalan dengan minat dan keahlian saya."
      }
    ],
    "recommendationScore": 61,
    "status": "under-review",
    "appliedDate": "9 hari yang lalu",
    "cvViewed": true,
    "authenticityScore": {
      "authentic": 93,
      "generic": 8,
      "aiGenerated": 7
    },
    "email": "donisaputra@email.com",
    "phone": "081257010197",
    "resumeLink": "https://example.com/cv.pdf"
  },
  {
    "id": "app-568",
    "applicantId": "iwanfals39",
    "applicantName": "Iwan Fals",
    "jobId": "job-116",
    "jobTitle": "Media Relations Intern",
    "cvSummary": "Kandidat memiliki pengalaman 3 tahun di bidang Administrasi & Dukungan Perkantoran. Sangat menguasai Manajemen Inventaris dan memiliki rekam jejak yang baik dalam office manager.",
    "validationStatus": "completed",
    "validationResponses": [
      {
        "question": "Ceritakan pengalaman terbesar Anda di bidang ini.",
        "answer": "Saya telah bekerja sebagai Office Manager selama 3 tahun, fokus pada Manajemen Inventaris."
      },
      {
        "question": "Mengapa Anda tertarik dengan posisi ini?",
        "answer": "Saya melihat visi perusahaan ini sejalan dengan minat dan keahlian saya."
      }
    ],
    "recommendationScore": 95,
    "status": "under-review",
    "appliedDate": "4 hari yang lalu",
    "cvViewed": true,
    "authenticityScore": {
      "authentic": 75,
      "generic": 12,
      "aiGenerated": 8
    },
    "email": "iwanfals@email.com",
    "phone": "081277229140",
    "resumeLink": "https://example.com/cv.pdf"
  },
  {
    "id": "app-569",
    "applicantId": "iwanfals43",
    "applicantName": "Iwan Fals",
    "jobId": "job-116",
    "jobTitle": "Media Relations Intern",
    "cvSummary": "Kandidat memiliki pengalaman 3 tahun di bidang Administrasi & Dukungan Perkantoran. Sangat menguasai Manajemen Inventaris, Komunikasi, Penjadwalan dan memiliki rekam jejak yang baik dalam office manager.",
    "validationStatus": "completed",
    "validationResponses": [
      {
        "question": "Ceritakan pengalaman terbesar Anda di bidang ini.",
        "answer": "Saya telah bekerja sebagai Office Manager selama 3 tahun, fokus pada Manajemen Inventaris, Komunikasi, Penjadwalan."
      },
      {
        "question": "Mengapa Anda tertarik dengan posisi ini?",
        "answer": "Saya melihat visi perusahaan ini sejalan dengan minat dan keahlian saya."
      }
    ],
    "recommendationScore": 77,
    "status": "under-review",
    "appliedDate": "7 hari yang lalu",
    "cvViewed": true,
    "authenticityScore": {
      "authentic": 76,
      "generic": 6,
      "aiGenerated": 10
    },
    "email": "iwanfals@email.com",
    "phone": "081289509108",
    "resumeLink": "https://example.com/cv.pdf"
  },
  {
    "id": "app-570",
    "applicantId": "dinafitriani40",
    "applicantName": "Dina Fitriani",
    "jobId": "job-117",
    "jobTitle": "Business Strategy Lead",
    "cvSummary": "Kandidat memiliki pengalaman 3 tahun di bidang Call Center & Layanan Konsumen. Sangat menguasai Resolusi Konflik dan memiliki rekam jejak yang baik dalam customer success manager.",
    "validationStatus": "completed",
    "validationResponses": [
      {
        "question": "Ceritakan pengalaman terbesar Anda di bidang ini.",
        "answer": "Saya telah bekerja sebagai Customer Success Manager selama 3 tahun, fokus pada Resolusi Konflik."
      },
      {
        "question": "Mengapa Anda tertarik dengan posisi ini?",
        "answer": "Saya melihat visi perusahaan ini sejalan dengan minat dan keahlian saya."
      }
    ],
    "recommendationScore": 74,
    "status": "rejected",
    "appliedDate": "7 hari yang lalu",
    "cvViewed": true,
    "authenticityScore": {
      "authentic": 88,
      "generic": 7,
      "aiGenerated": 1
    },
    "email": "dinafitriani@email.com",
    "phone": "081288605094",
    "resumeLink": "https://example.com/cv.pdf"
  },
  {
    "id": "app-571",
    "applicantId": "agussetiawan76",
    "applicantName": "Agus Setiawan",
    "jobId": "job-117",
    "jobTitle": "Business Strategy Lead",
    "cvSummary": "Kandidat memiliki pengalaman 3 tahun di bidang Call Center & Layanan Konsumen. Sangat menguasai Resolusi Konflik, CRM, Komunikasi dan memiliki rekam jejak yang baik dalam customer success manager.",
    "validationStatus": "completed",
    "validationResponses": [
      {
        "question": "Ceritakan pengalaman terbesar Anda di bidang ini.",
        "answer": "Saya telah bekerja sebagai Customer Success Manager selama 3 tahun, fokus pada Resolusi Konflik, CRM, Komunikasi."
      },
      {
        "question": "Mengapa Anda tertarik dengan posisi ini?",
        "answer": "Saya melihat visi perusahaan ini sejalan dengan minat dan keahlian saya."
      }
    ],
    "recommendationScore": 68,
    "status": "rejected",
    "appliedDate": "5 hari yang lalu",
    "cvViewed": true,
    "authenticityScore": {
      "authentic": 76,
      "generic": 13,
      "aiGenerated": 6
    },
    "email": "agussetiawan@email.com",
    "phone": "081285809279",
    "resumeLink": "https://example.com/cv.pdf"
  },
  {
    "id": "app-572",
    "applicantId": "irfanhakim32",
    "applicantName": "Irfan Hakim",
    "jobId": "job-117",
    "jobTitle": "Business Strategy Lead",
    "cvSummary": "Kandidat memiliki pengalaman 3 tahun di bidang Call Center & Layanan Konsumen. Sangat menguasai Resolusi Konflik, CRM dan memiliki rekam jejak yang baik dalam customer success manager.",
    "validationStatus": "completed",
    "validationResponses": [
      {
        "question": "Ceritakan pengalaman terbesar Anda di bidang ini.",
        "answer": "Saya telah bekerja sebagai Customer Success Manager selama 3 tahun, fokus pada Resolusi Konflik, CRM."
      },
      {
        "question": "Mengapa Anda tertarik dengan posisi ini?",
        "answer": "Saya melihat visi perusahaan ini sejalan dengan minat dan keahlian saya."
      }
    ],
    "recommendationScore": 94,
    "status": "interview",
    "appliedDate": "7 hari yang lalu",
    "cvViewed": true,
    "authenticityScore": {
      "authentic": 82,
      "generic": 14,
      "aiGenerated": 8
    },
    "email": "irfanhakim@email.com",
    "phone": "081261531230",
    "resumeLink": "https://example.com/cv.pdf"
  },
  {
    "id": "app-573",
    "applicantId": "iwanfals88",
    "applicantName": "Iwan Fals",
    "jobId": "job-117",
    "jobTitle": "Business Strategy Lead",
    "cvSummary": "Kandidat memiliki pengalaman 3 tahun di bidang Call Center & Layanan Konsumen. Sangat menguasai Resolusi Konflik, CRM dan memiliki rekam jejak yang baik dalam customer success manager.",
    "validationStatus": "completed",
    "validationResponses": [
      {
        "question": "Ceritakan pengalaman terbesar Anda di bidang ini.",
        "answer": "Saya telah bekerja sebagai Customer Success Manager selama 3 tahun, fokus pada Resolusi Konflik, CRM."
      },
      {
        "question": "Mengapa Anda tertarik dengan posisi ini?",
        "answer": "Saya melihat visi perusahaan ini sejalan dengan minat dan keahlian saya."
      }
    ],
    "recommendationScore": 86,
    "status": "submitted",
    "appliedDate": "6 hari yang lalu",
    "cvViewed": false,
    "authenticityScore": {
      "authentic": 91,
      "generic": 10,
      "aiGenerated": 9
    },
    "email": "iwanfals@email.com",
    "phone": "081212579271",
    "resumeLink": "https://example.com/cv.pdf"
  },
  {
    "id": "app-574",
    "applicantId": "arifrahman21",
    "applicantName": "Arif Rahman",
    "jobId": "job-118",
    "jobTitle": "Business Continuity Management",
    "cvSummary": "Kandidat memiliki pengalaman 3 tahun di bidang Sumber Daya Manusia & Perekrutan. Sangat menguasai Analisis dan memiliki rekam jejak yang baik dalam spesialis sumber daya manusia & perekrutan.",
    "validationStatus": "completed",
    "validationResponses": [
      {
        "question": "Ceritakan pengalaman terbesar Anda di bidang ini.",
        "answer": "Saya telah bekerja sebagai Spesialis Sumber Daya Manusia & Perekrutan selama 3 tahun, fokus pada Analisis."
      },
      {
        "question": "Mengapa Anda tertarik dengan posisi ini?",
        "answer": "Saya melihat visi perusahaan ini sejalan dengan minat dan keahlian saya."
      }
    ],
    "recommendationScore": 97,
    "status": "rejected",
    "appliedDate": "6 hari yang lalu",
    "cvViewed": true,
    "authenticityScore": {
      "authentic": 89,
      "generic": 14,
      "aiGenerated": 2
    },
    "email": "arifrahman@email.com",
    "phone": "081242222943",
    "resumeLink": "https://example.com/cv.pdf"
  },
  {
    "id": "app-575",
    "applicantId": "arielnoah51",
    "applicantName": "Ariel Noah",
    "jobId": "job-118",
    "jobTitle": "Business Continuity Management",
    "cvSummary": "Kandidat memiliki pengalaman 3 tahun di bidang Sumber Daya Manusia & Perekrutan. Sangat menguasai Analisis dan memiliki rekam jejak yang baik dalam spesialis sumber daya manusia & perekrutan.",
    "validationStatus": "completed",
    "validationResponses": [
      {
        "question": "Ceritakan pengalaman terbesar Anda di bidang ini.",
        "answer": "Saya telah bekerja sebagai Spesialis Sumber Daya Manusia & Perekrutan selama 3 tahun, fokus pada Analisis."
      },
      {
        "question": "Mengapa Anda tertarik dengan posisi ini?",
        "answer": "Saya melihat visi perusahaan ini sejalan dengan minat dan keahlian saya."
      }
    ],
    "recommendationScore": 73,
    "status": "under-review",
    "appliedDate": "6 hari yang lalu",
    "cvViewed": true,
    "authenticityScore": {
      "authentic": 70,
      "generic": 8,
      "aiGenerated": 0
    },
    "email": "arielnoah@email.com",
    "phone": "081299294340",
    "resumeLink": "https://example.com/cv.pdf"
  },
  {
    "id": "app-576",
    "applicantId": "antonsyahputra20",
    "applicantName": "Anton Syahputra",
    "jobId": "job-118",
    "jobTitle": "Business Continuity Management",
    "cvSummary": "Kandidat memiliki pengalaman 3 tahun di bidang Sumber Daya Manusia & Perekrutan. Sangat menguasai Analisis dan memiliki rekam jejak yang baik dalam spesialis sumber daya manusia & perekrutan.",
    "validationStatus": "completed",
    "validationResponses": [
      {
        "question": "Ceritakan pengalaman terbesar Anda di bidang ini.",
        "answer": "Saya telah bekerja sebagai Spesialis Sumber Daya Manusia & Perekrutan selama 3 tahun, fokus pada Analisis."
      },
      {
        "question": "Mengapa Anda tertarik dengan posisi ini?",
        "answer": "Saya melihat visi perusahaan ini sejalan dengan minat dan keahlian saya."
      }
    ],
    "recommendationScore": 92,
    "status": "submitted",
    "appliedDate": "4 hari yang lalu",
    "cvViewed": false,
    "authenticityScore": {
      "authentic": 71,
      "generic": 13,
      "aiGenerated": 10
    },
    "email": "antonsyahputra@email.com",
    "phone": "081215657898",
    "resumeLink": "https://example.com/cv.pdf"
  },
  {
    "id": "app-577",
    "applicantId": "budisantoso11",
    "applicantName": "Budi Santoso",
    "jobId": "job-119",
    "jobTitle": "Data Scientist",
    "cvSummary": "Kandidat memiliki pengalaman 3 tahun di bidang Perbankan & Layanan Finansial. Sangat menguasai Analisis Risiko, Hukum Perbankan, Penilaian Kredit dan memiliki rekam jejak yang baik dalam credit analyst.",
    "validationStatus": "completed",
    "validationResponses": [
      {
        "question": "Ceritakan pengalaman terbesar Anda di bidang ini.",
        "answer": "Saya telah bekerja sebagai Credit Analyst selama 3 tahun, fokus pada Analisis Risiko, Hukum Perbankan, Penilaian Kredit."
      },
      {
        "question": "Mengapa Anda tertarik dengan posisi ini?",
        "answer": "Saya melihat visi perusahaan ini sejalan dengan minat dan keahlian saya."
      }
    ],
    "recommendationScore": 80,
    "status": "interview",
    "appliedDate": "3 hari yang lalu",
    "cvViewed": true,
    "authenticityScore": {
      "authentic": 93,
      "generic": 5,
      "aiGenerated": 2
    },
    "email": "budisantoso@email.com",
    "phone": "081274959277",
    "resumeLink": "https://example.com/cv.pdf"
  },
  {
    "id": "app-578",
    "applicantId": "rossa52",
    "applicantName": "Rossa",
    "jobId": "job-119",
    "jobTitle": "Data Scientist",
    "cvSummary": "Kandidat memiliki pengalaman 3 tahun di bidang Perbankan & Layanan Finansial. Sangat menguasai Analisis Risiko dan memiliki rekam jejak yang baik dalam credit analyst.",
    "validationStatus": "completed",
    "validationResponses": [
      {
        "question": "Ceritakan pengalaman terbesar Anda di bidang ini.",
        "answer": "Saya telah bekerja sebagai Credit Analyst selama 3 tahun, fokus pada Analisis Risiko."
      },
      {
        "question": "Mengapa Anda tertarik dengan posisi ini?",
        "answer": "Saya melihat visi perusahaan ini sejalan dengan minat dan keahlian saya."
      }
    ],
    "recommendationScore": 82,
    "status": "under-review",
    "appliedDate": "3 hari yang lalu",
    "cvViewed": true,
    "authenticityScore": {
      "authentic": 85,
      "generic": 10,
      "aiGenerated": 1
    },
    "email": "rossa@email.com",
    "phone": "081263724473",
    "resumeLink": "https://example.com/cv.pdf"
  },
  {
    "id": "app-579",
    "applicantId": "donisaputra22",
    "applicantName": "Doni Saputra",
    "jobId": "job-119",
    "jobTitle": "Data Scientist",
    "cvSummary": "Kandidat memiliki pengalaman 3 tahun di bidang Perbankan & Layanan Finansial. Sangat menguasai Analisis Risiko, Hukum Perbankan, Penilaian Kredit dan memiliki rekam jejak yang baik dalam credit analyst.",
    "validationStatus": "completed",
    "validationResponses": [
      {
        "question": "Ceritakan pengalaman terbesar Anda di bidang ini.",
        "answer": "Saya telah bekerja sebagai Credit Analyst selama 3 tahun, fokus pada Analisis Risiko, Hukum Perbankan, Penilaian Kredit."
      },
      {
        "question": "Mengapa Anda tertarik dengan posisi ini?",
        "answer": "Saya melihat visi perusahaan ini sejalan dengan minat dan keahlian saya."
      }
    ],
    "recommendationScore": 84,
    "status": "under-review",
    "appliedDate": "1 hari yang lalu",
    "cvViewed": true,
    "authenticityScore": {
      "authentic": 82,
      "generic": 10,
      "aiGenerated": 7
    },
    "email": "donisaputra@email.com",
    "phone": "081239349843",
    "resumeLink": "https://example.com/cv.pdf"
  },
  {
    "id": "app-580",
    "applicantId": "fajarnugraha38",
    "applicantName": "Fajar Nugraha",
    "jobId": "job-120",
    "jobTitle": "Senior Business Analyst",
    "cvSummary": "Kandidat memiliki pengalaman 3 tahun di bidang Call Center & Layanan Konsumen. Sangat menguasai Telepon, Empati, Penyelesaian Masalah dan memiliki rekam jejak yang baik dalam customer service rep.",
    "validationStatus": "completed",
    "validationResponses": [
      {
        "question": "Ceritakan pengalaman terbesar Anda di bidang ini.",
        "answer": "Saya telah bekerja sebagai Customer Service Rep selama 3 tahun, fokus pada Telepon, Empati, Penyelesaian Masalah."
      },
      {
        "question": "Mengapa Anda tertarik dengan posisi ini?",
        "answer": "Saya melihat visi perusahaan ini sejalan dengan minat dan keahlian saya."
      }
    ],
    "recommendationScore": 84,
    "status": "under-review",
    "appliedDate": "5 hari yang lalu",
    "cvViewed": true,
    "authenticityScore": {
      "authentic": 76,
      "generic": 12,
      "aiGenerated": 5
    },
    "email": "fajarnugraha@email.com",
    "phone": "081271769735",
    "resumeLink": "https://example.com/cv.pdf"
  },
  {
    "id": "app-581",
    "applicantId": "ratihpurwasih15",
    "applicantName": "Ratih Purwasih",
    "jobId": "job-120",
    "jobTitle": "Senior Business Analyst",
    "cvSummary": "Kandidat memiliki pengalaman 3 tahun di bidang Call Center & Layanan Konsumen. Sangat menguasai Telepon, Empati dan memiliki rekam jejak yang baik dalam customer service rep.",
    "validationStatus": "completed",
    "validationResponses": [
      {
        "question": "Ceritakan pengalaman terbesar Anda di bidang ini.",
        "answer": "Saya telah bekerja sebagai Customer Service Rep selama 3 tahun, fokus pada Telepon, Empati."
      },
      {
        "question": "Mengapa Anda tertarik dengan posisi ini?",
        "answer": "Saya melihat visi perusahaan ini sejalan dengan minat dan keahlian saya."
      }
    ],
    "recommendationScore": 92,
    "status": "under-review",
    "appliedDate": "2 hari yang lalu",
    "cvViewed": true,
    "authenticityScore": {
      "authentic": 75,
      "generic": 5,
      "aiGenerated": 6
    },
    "email": "ratihpurwasih@email.com",
    "phone": "081255728939",
    "resumeLink": "https://example.com/cv.pdf"
  },
  {
    "id": "app-582",
    "applicantId": "tulus19",
    "applicantName": "Tulus",
    "jobId": "job-120",
    "jobTitle": "Senior Business Analyst",
    "cvSummary": "Kandidat memiliki pengalaman 3 tahun di bidang Call Center & Layanan Konsumen. Sangat menguasai Telepon, Empati dan memiliki rekam jejak yang baik dalam customer service rep.",
    "validationStatus": "completed",
    "validationResponses": [
      {
        "question": "Ceritakan pengalaman terbesar Anda di bidang ini.",
        "answer": "Saya telah bekerja sebagai Customer Service Rep selama 3 tahun, fokus pada Telepon, Empati."
      },
      {
        "question": "Mengapa Anda tertarik dengan posisi ini?",
        "answer": "Saya melihat visi perusahaan ini sejalan dengan minat dan keahlian saya."
      }
    ],
    "recommendationScore": 60,
    "status": "interview",
    "appliedDate": "6 hari yang lalu",
    "cvViewed": true,
    "authenticityScore": {
      "authentic": 76,
      "generic": 18,
      "aiGenerated": 2
    },
    "email": "tulus@email.com",
    "phone": "081231483955",
    "resumeLink": "https://example.com/cv.pdf"
  },
  {
    "id": "app-583",
    "applicantId": "afgansyahreza13",
    "applicantName": "Afgan Syahreza",
    "jobId": "job-120",
    "jobTitle": "Senior Business Analyst",
    "cvSummary": "Kandidat memiliki pengalaman 3 tahun di bidang Call Center & Layanan Konsumen. Sangat menguasai Telepon, Empati, Penyelesaian Masalah dan memiliki rekam jejak yang baik dalam customer service rep.",
    "validationStatus": "completed",
    "validationResponses": [
      {
        "question": "Ceritakan pengalaman terbesar Anda di bidang ini.",
        "answer": "Saya telah bekerja sebagai Customer Service Rep selama 3 tahun, fokus pada Telepon, Empati, Penyelesaian Masalah."
      },
      {
        "question": "Mengapa Anda tertarik dengan posisi ini?",
        "answer": "Saya melihat visi perusahaan ini sejalan dengan minat dan keahlian saya."
      }
    ],
    "recommendationScore": 56,
    "status": "submitted",
    "appliedDate": "7 hari yang lalu",
    "cvViewed": false,
    "authenticityScore": {
      "authentic": 86,
      "generic": 10,
      "aiGenerated": 9
    },
    "email": "afgansyahreza@email.com",
    "phone": "081254444460",
    "resumeLink": "https://example.com/cv.pdf"
  },
  {
    "id": "app-584",
    "applicantId": "nitaanggraini51",
    "applicantName": "Nita Anggraini",
    "jobId": "job-120",
    "jobTitle": "Senior Business Analyst",
    "cvSummary": "Kandidat memiliki pengalaman 3 tahun di bidang Call Center & Layanan Konsumen. Sangat menguasai Telepon dan memiliki rekam jejak yang baik dalam customer service rep.",
    "validationStatus": "completed",
    "validationResponses": [
      {
        "question": "Ceritakan pengalaman terbesar Anda di bidang ini.",
        "answer": "Saya telah bekerja sebagai Customer Service Rep selama 3 tahun, fokus pada Telepon."
      },
      {
        "question": "Mengapa Anda tertarik dengan posisi ini?",
        "answer": "Saya melihat visi perusahaan ini sejalan dengan minat dan keahlian saya."
      }
    ],
    "recommendationScore": 75,
    "status": "interview",
    "appliedDate": "5 hari yang lalu",
    "cvViewed": true,
    "authenticityScore": {
      "authentic": 91,
      "generic": 8,
      "aiGenerated": 5
    },
    "email": "nitaanggraini@email.com",
    "phone": "081228102512",
    "resumeLink": "https://example.com/cv.pdf"
  },
  {
    "id": "app-585",
    "applicantId": "sitiaminah27",
    "applicantName": "Siti Aminah",
    "jobId": "job-121",
    "jobTitle": "Process Improvement Manager",
    "cvSummary": "Kandidat memiliki pengalaman 3 tahun di bidang Pemerintahan & Pertahanan. Sangat menguasai Analisis, Manajemen, Komunikasi dan memiliki rekam jejak yang baik dalam spesialis pemerintahan & pertahanan.",
    "validationStatus": "completed",
    "validationResponses": [
      {
        "question": "Ceritakan pengalaman terbesar Anda di bidang ini.",
        "answer": "Saya telah bekerja sebagai Spesialis Pemerintahan & Pertahanan selama 3 tahun, fokus pada Analisis, Manajemen, Komunikasi."
      },
      {
        "question": "Mengapa Anda tertarik dengan posisi ini?",
        "answer": "Saya melihat visi perusahaan ini sejalan dengan minat dan keahlian saya."
      }
    ],
    "recommendationScore": 95,
    "status": "under-review",
    "appliedDate": "4 hari yang lalu",
    "cvViewed": true,
    "authenticityScore": {
      "authentic": 88,
      "generic": 18,
      "aiGenerated": 0
    },
    "email": "sitiaminah@email.com",
    "phone": "081293202683",
    "resumeLink": "https://example.com/cv.pdf"
  },
  {
    "id": "app-586",
    "applicantId": "santisusanti49",
    "applicantName": "Santi Susanti",
    "jobId": "job-121",
    "jobTitle": "Process Improvement Manager",
    "cvSummary": "Kandidat memiliki pengalaman 3 tahun di bidang Pemerintahan & Pertahanan. Sangat menguasai Analisis dan memiliki rekam jejak yang baik dalam spesialis pemerintahan & pertahanan.",
    "validationStatus": "completed",
    "validationResponses": [
      {
        "question": "Ceritakan pengalaman terbesar Anda di bidang ini.",
        "answer": "Saya telah bekerja sebagai Spesialis Pemerintahan & Pertahanan selama 3 tahun, fokus pada Analisis."
      },
      {
        "question": "Mengapa Anda tertarik dengan posisi ini?",
        "answer": "Saya melihat visi perusahaan ini sejalan dengan minat dan keahlian saya."
      }
    ],
    "recommendationScore": 69,
    "status": "rejected",
    "appliedDate": "4 hari yang lalu",
    "cvViewed": true,
    "authenticityScore": {
      "authentic": 75,
      "generic": 13,
      "aiGenerated": 5
    },
    "email": "santisusanti@email.com",
    "phone": "081251680954",
    "resumeLink": "https://example.com/cv.pdf"
  },
  {
    "id": "app-587",
    "applicantId": "agnezmo28",
    "applicantName": "Agnez Mo",
    "jobId": "job-121",
    "jobTitle": "Process Improvement Manager",
    "cvSummary": "Kandidat memiliki pengalaman 3 tahun di bidang Pemerintahan & Pertahanan. Sangat menguasai Analisis, Manajemen dan memiliki rekam jejak yang baik dalam spesialis pemerintahan & pertahanan.",
    "validationStatus": "completed",
    "validationResponses": [
      {
        "question": "Ceritakan pengalaman terbesar Anda di bidang ini.",
        "answer": "Saya telah bekerja sebagai Spesialis Pemerintahan & Pertahanan selama 3 tahun, fokus pada Analisis, Manajemen."
      },
      {
        "question": "Mengapa Anda tertarik dengan posisi ini?",
        "answer": "Saya melihat visi perusahaan ini sejalan dengan minat dan keahlian saya."
      }
    ],
    "recommendationScore": 66,
    "status": "under-review",
    "appliedDate": "8 hari yang lalu",
    "cvViewed": true,
    "authenticityScore": {
      "authentic": 71,
      "generic": 17,
      "aiGenerated": 4
    },
    "email": "agnezmo@email.com",
    "phone": "081235218696",
    "resumeLink": "https://example.com/cv.pdf"
  },
  {
    "id": "app-588",
    "applicantId": "sitiaminah54",
    "applicantName": "Siti Aminah",
    "jobId": "job-121",
    "jobTitle": "Process Improvement Manager",
    "cvSummary": "Kandidat memiliki pengalaman 3 tahun di bidang Pemerintahan & Pertahanan. Sangat menguasai Analisis, Manajemen dan memiliki rekam jejak yang baik dalam spesialis pemerintahan & pertahanan.",
    "validationStatus": "completed",
    "validationResponses": [
      {
        "question": "Ceritakan pengalaman terbesar Anda di bidang ini.",
        "answer": "Saya telah bekerja sebagai Spesialis Pemerintahan & Pertahanan selama 3 tahun, fokus pada Analisis, Manajemen."
      },
      {
        "question": "Mengapa Anda tertarik dengan posisi ini?",
        "answer": "Saya melihat visi perusahaan ini sejalan dengan minat dan keahlian saya."
      }
    ],
    "recommendationScore": 59,
    "status": "interview",
    "appliedDate": "5 hari yang lalu",
    "cvViewed": true,
    "authenticityScore": {
      "authentic": 94,
      "generic": 19,
      "aiGenerated": 1
    },
    "email": "sitiaminah@email.com",
    "phone": "081266711054",
    "resumeLink": "https://example.com/cv.pdf"
  },
  {
    "id": "app-589",
    "applicantId": "dinafitriani96",
    "applicantName": "Dina Fitriani",
    "jobId": "job-122",
    "jobTitle": "Tax Intern",
    "cvSummary": "Kandidat memiliki pengalaman 3 tahun di bidang Ritel & Produk Konsumen. Sangat menguasai Analisis dan memiliki rekam jejak yang baik dalam spesialis ritel & produk konsumen.",
    "validationStatus": "completed",
    "validationResponses": [
      {
        "question": "Ceritakan pengalaman terbesar Anda di bidang ini.",
        "answer": "Saya telah bekerja sebagai Spesialis Ritel & Produk Konsumen selama 3 tahun, fokus pada Analisis."
      },
      {
        "question": "Mengapa Anda tertarik dengan posisi ini?",
        "answer": "Saya melihat visi perusahaan ini sejalan dengan minat dan keahlian saya."
      }
    ],
    "recommendationScore": 95,
    "status": "submitted",
    "appliedDate": "10 hari yang lalu",
    "cvViewed": false,
    "authenticityScore": {
      "authentic": 84,
      "generic": 8,
      "aiGenerated": 2
    },
    "email": "dinafitriani@email.com",
    "phone": "081275849440",
    "resumeLink": "https://example.com/cv.pdf"
  },
  {
    "id": "app-590",
    "applicantId": "liayuliana45",
    "applicantName": "Lia Yuliana",
    "jobId": "job-122",
    "jobTitle": "Tax Intern",
    "cvSummary": "Kandidat memiliki pengalaman 3 tahun di bidang Ritel & Produk Konsumen. Sangat menguasai Analisis, Manajemen dan memiliki rekam jejak yang baik dalam spesialis ritel & produk konsumen.",
    "validationStatus": "completed",
    "validationResponses": [
      {
        "question": "Ceritakan pengalaman terbesar Anda di bidang ini.",
        "answer": "Saya telah bekerja sebagai Spesialis Ritel & Produk Konsumen selama 3 tahun, fokus pada Analisis, Manajemen."
      },
      {
        "question": "Mengapa Anda tertarik dengan posisi ini?",
        "answer": "Saya melihat visi perusahaan ini sejalan dengan minat dan keahlian saya."
      }
    ],
    "recommendationScore": 55,
    "status": "under-review",
    "appliedDate": "3 hari yang lalu",
    "cvViewed": true,
    "authenticityScore": {
      "authentic": 76,
      "generic": 8,
      "aiGenerated": 1
    },
    "email": "liayuliana@email.com",
    "phone": "081264760253",
    "resumeLink": "https://example.com/cv.pdf"
  },
  {
    "id": "app-591",
    "applicantId": "santisusanti76",
    "applicantName": "Santi Susanti",
    "jobId": "job-122",
    "jobTitle": "Tax Intern",
    "cvSummary": "Kandidat memiliki pengalaman 3 tahun di bidang Ritel & Produk Konsumen. Sangat menguasai Analisis, Manajemen dan memiliki rekam jejak yang baik dalam spesialis ritel & produk konsumen.",
    "validationStatus": "completed",
    "validationResponses": [
      {
        "question": "Ceritakan pengalaman terbesar Anda di bidang ini.",
        "answer": "Saya telah bekerja sebagai Spesialis Ritel & Produk Konsumen selama 3 tahun, fokus pada Analisis, Manajemen."
      },
      {
        "question": "Mengapa Anda tertarik dengan posisi ini?",
        "answer": "Saya melihat visi perusahaan ini sejalan dengan minat dan keahlian saya."
      }
    ],
    "recommendationScore": 82,
    "status": "interview",
    "appliedDate": "2 hari yang lalu",
    "cvViewed": true,
    "authenticityScore": {
      "authentic": 75,
      "generic": 18,
      "aiGenerated": 3
    },
    "email": "santisusanti@email.com",
    "phone": "081215428185",
    "resumeLink": "https://example.com/cv.pdf"
  },
  {
    "id": "app-592",
    "applicantId": "raisaandriana45",
    "applicantName": "Raisa Andriana",
    "jobId": "job-122",
    "jobTitle": "Tax Intern",
    "cvSummary": "Kandidat memiliki pengalaman 3 tahun di bidang Ritel & Produk Konsumen. Sangat menguasai Analisis dan memiliki rekam jejak yang baik dalam spesialis ritel & produk konsumen.",
    "validationStatus": "completed",
    "validationResponses": [
      {
        "question": "Ceritakan pengalaman terbesar Anda di bidang ini.",
        "answer": "Saya telah bekerja sebagai Spesialis Ritel & Produk Konsumen selama 3 tahun, fokus pada Analisis."
      },
      {
        "question": "Mengapa Anda tertarik dengan posisi ini?",
        "answer": "Saya melihat visi perusahaan ini sejalan dengan minat dan keahlian saya."
      }
    ],
    "recommendationScore": 83,
    "status": "interview",
    "appliedDate": "5 hari yang lalu",
    "cvViewed": true,
    "authenticityScore": {
      "authentic": 79,
      "generic": 14,
      "aiGenerated": 9
    },
    "email": "raisaandriana@email.com",
    "phone": "081256355792",
    "resumeLink": "https://example.com/cv.pdf"
  },
  {
    "id": "app-593",
    "applicantId": "ratihpurwasih15",
    "applicantName": "Ratih Purwasih",
    "jobId": "job-122",
    "jobTitle": "Tax Intern",
    "cvSummary": "Kandidat memiliki pengalaman 3 tahun di bidang Ritel & Produk Konsumen. Sangat menguasai Analisis, Manajemen dan memiliki rekam jejak yang baik dalam spesialis ritel & produk konsumen.",
    "validationStatus": "completed",
    "validationResponses": [
      {
        "question": "Ceritakan pengalaman terbesar Anda di bidang ini.",
        "answer": "Saya telah bekerja sebagai Spesialis Ritel & Produk Konsumen selama 3 tahun, fokus pada Analisis, Manajemen."
      },
      {
        "question": "Mengapa Anda tertarik dengan posisi ini?",
        "answer": "Saya melihat visi perusahaan ini sejalan dengan minat dan keahlian saya."
      }
    ],
    "recommendationScore": 96,
    "status": "submitted",
    "appliedDate": "1 hari yang lalu",
    "cvViewed": true,
    "authenticityScore": {
      "authentic": 88,
      "generic": 6,
      "aiGenerated": 0
    },
    "email": "ratihpurwasih@email.com",
    "phone": "081242891439",
    "resumeLink": "https://example.com/cv.pdf"
  },
  {
    "id": "app-594",
    "applicantId": "irfanhakim13",
    "applicantName": "Irfan Hakim",
    "jobId": "job-123",
    "jobTitle": "Business Strategy Lead",
    "cvSummary": "Kandidat memiliki pengalaman 3 tahun di bidang Call Center & Layanan Konsumen. Sangat menguasai Resolusi Konflik dan memiliki rekam jejak yang baik dalam customer success manager.",
    "validationStatus": "completed",
    "validationResponses": [
      {
        "question": "Ceritakan pengalaman terbesar Anda di bidang ini.",
        "answer": "Saya telah bekerja sebagai Customer Success Manager selama 3 tahun, fokus pada Resolusi Konflik."
      },
      {
        "question": "Mengapa Anda tertarik dengan posisi ini?",
        "answer": "Saya melihat visi perusahaan ini sejalan dengan minat dan keahlian saya."
      }
    ],
    "recommendationScore": 61,
    "status": "under-review",
    "appliedDate": "10 hari yang lalu",
    "cvViewed": true,
    "authenticityScore": {
      "authentic": 84,
      "generic": 13,
      "aiGenerated": 6
    },
    "email": "irfanhakim@email.com",
    "phone": "081210457918",
    "resumeLink": "https://example.com/cv.pdf"
  },
  {
    "id": "app-595",
    "applicantId": "ekoprasetyo58",
    "applicantName": "Eko Prasetyo",
    "jobId": "job-123",
    "jobTitle": "Business Strategy Lead",
    "cvSummary": "Kandidat memiliki pengalaman 3 tahun di bidang Call Center & Layanan Konsumen. Sangat menguasai Resolusi Konflik, CRM, Komunikasi dan memiliki rekam jejak yang baik dalam customer success manager.",
    "validationStatus": "completed",
    "validationResponses": [
      {
        "question": "Ceritakan pengalaman terbesar Anda di bidang ini.",
        "answer": "Saya telah bekerja sebagai Customer Success Manager selama 3 tahun, fokus pada Resolusi Konflik, CRM, Komunikasi."
      },
      {
        "question": "Mengapa Anda tertarik dengan posisi ini?",
        "answer": "Saya melihat visi perusahaan ini sejalan dengan minat dan keahlian saya."
      }
    ],
    "recommendationScore": 79,
    "status": "interview",
    "appliedDate": "5 hari yang lalu",
    "cvViewed": true,
    "authenticityScore": {
      "authentic": 73,
      "generic": 11,
      "aiGenerated": 7
    },
    "email": "ekoprasetyo@email.com",
    "phone": "081248153422",
    "resumeLink": "https://example.com/cv.pdf"
  },
  {
    "id": "app-596",
    "applicantId": "ekoprasetyo95",
    "applicantName": "Eko Prasetyo",
    "jobId": "job-123",
    "jobTitle": "Business Strategy Lead",
    "cvSummary": "Kandidat memiliki pengalaman 3 tahun di bidang Call Center & Layanan Konsumen. Sangat menguasai Resolusi Konflik dan memiliki rekam jejak yang baik dalam customer success manager.",
    "validationStatus": "completed",
    "validationResponses": [
      {
        "question": "Ceritakan pengalaman terbesar Anda di bidang ini.",
        "answer": "Saya telah bekerja sebagai Customer Success Manager selama 3 tahun, fokus pada Resolusi Konflik."
      },
      {
        "question": "Mengapa Anda tertarik dengan posisi ini?",
        "answer": "Saya melihat visi perusahaan ini sejalan dengan minat dan keahlian saya."
      }
    ],
    "recommendationScore": 90,
    "status": "interview",
    "appliedDate": "7 hari yang lalu",
    "cvViewed": true,
    "authenticityScore": {
      "authentic": 87,
      "generic": 6,
      "aiGenerated": 8
    },
    "email": "ekoprasetyo@email.com",
    "phone": "081257265327",
    "resumeLink": "https://example.com/cv.pdf"
  },
  {
    "id": "app-597",
    "applicantId": "nagitaslavina14",
    "applicantName": "Nagita Slavina",
    "jobId": "job-123",
    "jobTitle": "Business Strategy Lead",
    "cvSummary": "Kandidat memiliki pengalaman 3 tahun di bidang Call Center & Layanan Konsumen. Sangat menguasai Resolusi Konflik, CRM, Komunikasi dan memiliki rekam jejak yang baik dalam customer success manager.",
    "validationStatus": "completed",
    "validationResponses": [
      {
        "question": "Ceritakan pengalaman terbesar Anda di bidang ini.",
        "answer": "Saya telah bekerja sebagai Customer Success Manager selama 3 tahun, fokus pada Resolusi Konflik, CRM, Komunikasi."
      },
      {
        "question": "Mengapa Anda tertarik dengan posisi ini?",
        "answer": "Saya melihat visi perusahaan ini sejalan dengan minat dan keahlian saya."
      }
    ],
    "recommendationScore": 98,
    "status": "interview",
    "appliedDate": "3 hari yang lalu",
    "cvViewed": true,
    "authenticityScore": {
      "authentic": 75,
      "generic": 6,
      "aiGenerated": 6
    },
    "email": "nagitaslavina@email.com",
    "phone": "081245069270",
    "resumeLink": "https://example.com/cv.pdf"
  },
  {
    "id": "app-598",
    "applicantId": "budisantoso90",
    "applicantName": "Budi Santoso",
    "jobId": "job-124",
    "jobTitle": "Corporate Secretary",
    "cvSummary": "Kandidat memiliki pengalaman 3 tahun di bidang Keterampilan & Jasa. Sangat menguasai Analisis, Manajemen dan memiliki rekam jejak yang baik dalam spesialis keterampilan & jasa.",
    "validationStatus": "completed",
    "validationResponses": [
      {
        "question": "Ceritakan pengalaman terbesar Anda di bidang ini.",
        "answer": "Saya telah bekerja sebagai Spesialis Keterampilan & Jasa selama 3 tahun, fokus pada Analisis, Manajemen."
      },
      {
        "question": "Mengapa Anda tertarik dengan posisi ini?",
        "answer": "Saya melihat visi perusahaan ini sejalan dengan minat dan keahlian saya."
      }
    ],
    "recommendationScore": 71,
    "status": "interview",
    "appliedDate": "3 hari yang lalu",
    "cvViewed": true,
    "authenticityScore": {
      "authentic": 78,
      "generic": 7,
      "aiGenerated": 3
    },
    "email": "budisantoso@email.com",
    "phone": "081261880723",
    "resumeLink": "https://example.com/cv.pdf"
  },
  {
    "id": "app-599",
    "applicantId": "fitriani25",
    "applicantName": "Fitriani",
    "jobId": "job-124",
    "jobTitle": "Corporate Secretary",
    "cvSummary": "Kandidat memiliki pengalaman 3 tahun di bidang Keterampilan & Jasa. Sangat menguasai Analisis dan memiliki rekam jejak yang baik dalam spesialis keterampilan & jasa.",
    "validationStatus": "completed",
    "validationResponses": [
      {
        "question": "Ceritakan pengalaman terbesar Anda di bidang ini.",
        "answer": "Saya telah bekerja sebagai Spesialis Keterampilan & Jasa selama 3 tahun, fokus pada Analisis."
      },
      {
        "question": "Mengapa Anda tertarik dengan posisi ini?",
        "answer": "Saya melihat visi perusahaan ini sejalan dengan minat dan keahlian saya."
      }
    ],
    "recommendationScore": 88,
    "status": "under-review",
    "appliedDate": "3 hari yang lalu",
    "cvViewed": true,
    "authenticityScore": {
      "authentic": 81,
      "generic": 15,
      "aiGenerated": 2
    },
    "email": "fitriani@email.com",
    "phone": "081240621125",
    "resumeLink": "https://example.com/cv.pdf"
  },
  {
    "id": "app-600",
    "applicantId": "budisantoso75",
    "applicantName": "Budi Santoso",
    "jobId": "job-124",
    "jobTitle": "Corporate Secretary",
    "cvSummary": "Kandidat memiliki pengalaman 3 tahun di bidang Keterampilan & Jasa. Sangat menguasai Analisis, Manajemen dan memiliki rekam jejak yang baik dalam spesialis keterampilan & jasa.",
    "validationStatus": "completed",
    "validationResponses": [
      {
        "question": "Ceritakan pengalaman terbesar Anda di bidang ini.",
        "answer": "Saya telah bekerja sebagai Spesialis Keterampilan & Jasa selama 3 tahun, fokus pada Analisis, Manajemen."
      },
      {
        "question": "Mengapa Anda tertarik dengan posisi ini?",
        "answer": "Saya melihat visi perusahaan ini sejalan dengan minat dan keahlian saya."
      }
    ],
    "recommendationScore": 90,
    "status": "interview",
    "appliedDate": "7 hari yang lalu",
    "cvViewed": true,
    "authenticityScore": {
      "authentic": 82,
      "generic": 16,
      "aiGenerated": 7
    },
    "email": "budisantoso@email.com",
    "phone": "081267045700",
    "resumeLink": "https://example.com/cv.pdf"
  },
  {
    "id": "app-601",
    "applicantId": "hendragunawan99",
    "applicantName": "Hendra Gunawan",
    "jobId": "job-124",
    "jobTitle": "Corporate Secretary",
    "cvSummary": "Kandidat memiliki pengalaman 3 tahun di bidang Keterampilan & Jasa. Sangat menguasai Analisis dan memiliki rekam jejak yang baik dalam spesialis keterampilan & jasa.",
    "validationStatus": "completed",
    "validationResponses": [
      {
        "question": "Ceritakan pengalaman terbesar Anda di bidang ini.",
        "answer": "Saya telah bekerja sebagai Spesialis Keterampilan & Jasa selama 3 tahun, fokus pada Analisis."
      },
      {
        "question": "Mengapa Anda tertarik dengan posisi ini?",
        "answer": "Saya melihat visi perusahaan ini sejalan dengan minat dan keahlian saya."
      }
    ],
    "recommendationScore": 87,
    "status": "under-review",
    "appliedDate": "4 hari yang lalu",
    "cvViewed": true,
    "authenticityScore": {
      "authentic": 87,
      "generic": 7,
      "aiGenerated": 4
    },
    "email": "hendragunawan@email.com",
    "phone": "081277184538",
    "resumeLink": "https://example.com/cv.pdf"
  },
  {
    "id": "app-602",
    "applicantId": "jokowidodo77",
    "applicantName": "Joko Widodo",
    "jobId": "job-125",
    "jobTitle": "Category Sourcing Manager",
    "cvSummary": "Kandidat memiliki pengalaman 3 tahun di bidang Layanan & Pengembangan Masyarakat. Sangat menguasai Analisis dan memiliki rekam jejak yang baik dalam spesialis layanan & pengembangan masyarakat.",
    "validationStatus": "completed",
    "validationResponses": [
      {
        "question": "Ceritakan pengalaman terbesar Anda di bidang ini.",
        "answer": "Saya telah bekerja sebagai Spesialis Layanan & Pengembangan Masyarakat selama 3 tahun, fokus pada Analisis."
      },
      {
        "question": "Mengapa Anda tertarik dengan posisi ini?",
        "answer": "Saya melihat visi perusahaan ini sejalan dengan minat dan keahlian saya."
      }
    ],
    "recommendationScore": 70,
    "status": "interview",
    "appliedDate": "9 hari yang lalu",
    "cvViewed": true,
    "authenticityScore": {
      "authentic": 81,
      "generic": 20,
      "aiGenerated": 2
    },
    "email": "jokowidodo@email.com",
    "phone": "081261343181",
    "resumeLink": "https://example.com/cv.pdf"
  },
  {
    "id": "app-603",
    "applicantId": "yunishara86",
    "applicantName": "Yuni Shara",
    "jobId": "job-125",
    "jobTitle": "Category Sourcing Manager",
    "cvSummary": "Kandidat memiliki pengalaman 3 tahun di bidang Layanan & Pengembangan Masyarakat. Sangat menguasai Analisis, Manajemen, Komunikasi dan memiliki rekam jejak yang baik dalam spesialis layanan & pengembangan masyarakat.",
    "validationStatus": "completed",
    "validationResponses": [
      {
        "question": "Ceritakan pengalaman terbesar Anda di bidang ini.",
        "answer": "Saya telah bekerja sebagai Spesialis Layanan & Pengembangan Masyarakat selama 3 tahun, fokus pada Analisis, Manajemen, Komunikasi."
      },
      {
        "question": "Mengapa Anda tertarik dengan posisi ini?",
        "answer": "Saya melihat visi perusahaan ini sejalan dengan minat dan keahlian saya."
      }
    ],
    "recommendationScore": 98,
    "status": "submitted",
    "appliedDate": "3 hari yang lalu",
    "cvViewed": true,
    "authenticityScore": {
      "authentic": 76,
      "generic": 11,
      "aiGenerated": 9
    },
    "email": "yunishara@email.com",
    "phone": "081290926284",
    "resumeLink": "https://example.com/cv.pdf"
  },
  {
    "id": "app-604",
    "applicantId": "dewilestari33",
    "applicantName": "Dewi Lestari",
    "jobId": "job-125",
    "jobTitle": "Category Sourcing Manager",
    "cvSummary": "Kandidat memiliki pengalaman 3 tahun di bidang Layanan & Pengembangan Masyarakat. Sangat menguasai Analisis, Manajemen, Komunikasi dan memiliki rekam jejak yang baik dalam spesialis layanan & pengembangan masyarakat.",
    "validationStatus": "completed",
    "validationResponses": [
      {
        "question": "Ceritakan pengalaman terbesar Anda di bidang ini.",
        "answer": "Saya telah bekerja sebagai Spesialis Layanan & Pengembangan Masyarakat selama 3 tahun, fokus pada Analisis, Manajemen, Komunikasi."
      },
      {
        "question": "Mengapa Anda tertarik dengan posisi ini?",
        "answer": "Saya melihat visi perusahaan ini sejalan dengan minat dan keahlian saya."
      }
    ],
    "recommendationScore": 60,
    "status": "submitted",
    "appliedDate": "5 hari yang lalu",
    "cvViewed": false,
    "authenticityScore": {
      "authentic": 78,
      "generic": 20,
      "aiGenerated": 4
    },
    "email": "dewilestari@email.com",
    "phone": "081272311890",
    "resumeLink": "https://example.com/cv.pdf"
  },
  {
    "id": "app-605",
    "applicantId": "andipratama80",
    "applicantName": "Andi Pratama",
    "jobId": "job-125",
    "jobTitle": "Category Sourcing Manager",
    "cvSummary": "Kandidat memiliki pengalaman 3 tahun di bidang Layanan & Pengembangan Masyarakat. Sangat menguasai Analisis dan memiliki rekam jejak yang baik dalam spesialis layanan & pengembangan masyarakat.",
    "validationStatus": "completed",
    "validationResponses": [
      {
        "question": "Ceritakan pengalaman terbesar Anda di bidang ini.",
        "answer": "Saya telah bekerja sebagai Spesialis Layanan & Pengembangan Masyarakat selama 3 tahun, fokus pada Analisis."
      },
      {
        "question": "Mengapa Anda tertarik dengan posisi ini?",
        "answer": "Saya melihat visi perusahaan ini sejalan dengan minat dan keahlian saya."
      }
    ],
    "recommendationScore": 75,
    "status": "interview",
    "appliedDate": "10 hari yang lalu",
    "cvViewed": true,
    "authenticityScore": {
      "authentic": 85,
      "generic": 14,
      "aiGenerated": 7
    },
    "email": "andipratama@email.com",
    "phone": "081260523780",
    "resumeLink": "https://example.com/cv.pdf"
  },
  {
    "id": "app-606",
    "applicantId": "rezarahadian85",
    "applicantName": "Reza Rahadian",
    "jobId": "job-126",
    "jobTitle": "Corporate Secretary",
    "cvSummary": "Kandidat memiliki pengalaman 3 tahun di bidang Keterampilan & Jasa. Sangat menguasai Analisis, Manajemen, Komunikasi dan memiliki rekam jejak yang baik dalam spesialis keterampilan & jasa.",
    "validationStatus": "completed",
    "validationResponses": [
      {
        "question": "Ceritakan pengalaman terbesar Anda di bidang ini.",
        "answer": "Saya telah bekerja sebagai Spesialis Keterampilan & Jasa selama 3 tahun, fokus pada Analisis, Manajemen, Komunikasi."
      },
      {
        "question": "Mengapa Anda tertarik dengan posisi ini?",
        "answer": "Saya melihat visi perusahaan ini sejalan dengan minat dan keahlian saya."
      }
    ],
    "recommendationScore": 73,
    "status": "interview",
    "appliedDate": "1 hari yang lalu",
    "cvViewed": true,
    "authenticityScore": {
      "authentic": 85,
      "generic": 8,
      "aiGenerated": 10
    },
    "email": "rezarahadian@email.com",
    "phone": "081299581985",
    "resumeLink": "https://example.com/cv.pdf"
  },
  {
    "id": "app-607",
    "applicantId": "sitiaminah39",
    "applicantName": "Siti Aminah",
    "jobId": "job-126",
    "jobTitle": "Corporate Secretary",
    "cvSummary": "Kandidat memiliki pengalaman 3 tahun di bidang Keterampilan & Jasa. Sangat menguasai Analisis dan memiliki rekam jejak yang baik dalam spesialis keterampilan & jasa.",
    "validationStatus": "completed",
    "validationResponses": [
      {
        "question": "Ceritakan pengalaman terbesar Anda di bidang ini.",
        "answer": "Saya telah bekerja sebagai Spesialis Keterampilan & Jasa selama 3 tahun, fokus pada Analisis."
      },
      {
        "question": "Mengapa Anda tertarik dengan posisi ini?",
        "answer": "Saya melihat visi perusahaan ini sejalan dengan minat dan keahlian saya."
      }
    ],
    "recommendationScore": 91,
    "status": "interview",
    "appliedDate": "7 hari yang lalu",
    "cvViewed": true,
    "authenticityScore": {
      "authentic": 94,
      "generic": 6,
      "aiGenerated": 0
    },
    "email": "sitiaminah@email.com",
    "phone": "081247147987",
    "resumeLink": "https://example.com/cv.pdf"
  },
  {
    "id": "app-608",
    "applicantId": "yunishara57",
    "applicantName": "Yuni Shara",
    "jobId": "job-126",
    "jobTitle": "Corporate Secretary",
    "cvSummary": "Kandidat memiliki pengalaman 3 tahun di bidang Keterampilan & Jasa. Sangat menguasai Analisis, Manajemen, Komunikasi dan memiliki rekam jejak yang baik dalam spesialis keterampilan & jasa.",
    "validationStatus": "completed",
    "validationResponses": [
      {
        "question": "Ceritakan pengalaman terbesar Anda di bidang ini.",
        "answer": "Saya telah bekerja sebagai Spesialis Keterampilan & Jasa selama 3 tahun, fokus pada Analisis, Manajemen, Komunikasi."
      },
      {
        "question": "Mengapa Anda tertarik dengan posisi ini?",
        "answer": "Saya melihat visi perusahaan ini sejalan dengan minat dan keahlian saya."
      }
    ],
    "recommendationScore": 98,
    "status": "under-review",
    "appliedDate": "6 hari yang lalu",
    "cvViewed": true,
    "authenticityScore": {
      "authentic": 81,
      "generic": 14,
      "aiGenerated": 0
    },
    "email": "yunishara@email.com",
    "phone": "081211537438",
    "resumeLink": "https://example.com/cv.pdf"
  },
  {
    "id": "app-609",
    "applicantId": "ayuwandira99",
    "applicantName": "Ayu Wandira",
    "jobId": "job-127",
    "jobTitle": "Lending Risk Analyst",
    "cvSummary": "Kandidat memiliki pengalaman 3 tahun di bidang Konsultasi & Strategi. Sangat menguasai Analisis dan memiliki rekam jejak yang baik dalam spesialis konsultasi & strategi.",
    "validationStatus": "completed",
    "validationResponses": [
      {
        "question": "Ceritakan pengalaman terbesar Anda di bidang ini.",
        "answer": "Saya telah bekerja sebagai Spesialis Konsultasi & Strategi selama 3 tahun, fokus pada Analisis."
      },
      {
        "question": "Mengapa Anda tertarik dengan posisi ini?",
        "answer": "Saya melihat visi perusahaan ini sejalan dengan minat dan keahlian saya."
      }
    ],
    "recommendationScore": 71,
    "status": "interview",
    "appliedDate": "5 hari yang lalu",
    "cvViewed": true,
    "authenticityScore": {
      "authentic": 74,
      "generic": 9,
      "aiGenerated": 3
    },
    "email": "ayuwandira@email.com",
    "phone": "081219143576",
    "resumeLink": "https://example.com/cv.pdf"
  },
  {
    "id": "app-610",
    "applicantId": "tulus48",
    "applicantName": "Tulus",
    "jobId": "job-127",
    "jobTitle": "Lending Risk Analyst",
    "cvSummary": "Kandidat memiliki pengalaman 3 tahun di bidang Konsultasi & Strategi. Sangat menguasai Analisis, Manajemen dan memiliki rekam jejak yang baik dalam spesialis konsultasi & strategi.",
    "validationStatus": "completed",
    "validationResponses": [
      {
        "question": "Ceritakan pengalaman terbesar Anda di bidang ini.",
        "answer": "Saya telah bekerja sebagai Spesialis Konsultasi & Strategi selama 3 tahun, fokus pada Analisis, Manajemen."
      },
      {
        "question": "Mengapa Anda tertarik dengan posisi ini?",
        "answer": "Saya melihat visi perusahaan ini sejalan dengan minat dan keahlian saya."
      }
    ],
    "recommendationScore": 80,
    "status": "rejected",
    "appliedDate": "9 hari yang lalu",
    "cvViewed": true,
    "authenticityScore": {
      "authentic": 94,
      "generic": 17,
      "aiGenerated": 7
    },
    "email": "tulus@email.com",
    "phone": "081245444480",
    "resumeLink": "https://example.com/cv.pdf"
  },
  {
    "id": "app-611",
    "applicantId": "arifrahman45",
    "applicantName": "Arif Rahman",
    "jobId": "job-127",
    "jobTitle": "Lending Risk Analyst",
    "cvSummary": "Kandidat memiliki pengalaman 3 tahun di bidang Konsultasi & Strategi. Sangat menguasai Analisis, Manajemen, Komunikasi dan memiliki rekam jejak yang baik dalam spesialis konsultasi & strategi.",
    "validationStatus": "completed",
    "validationResponses": [
      {
        "question": "Ceritakan pengalaman terbesar Anda di bidang ini.",
        "answer": "Saya telah bekerja sebagai Spesialis Konsultasi & Strategi selama 3 tahun, fokus pada Analisis, Manajemen, Komunikasi."
      },
      {
        "question": "Mengapa Anda tertarik dengan posisi ini?",
        "answer": "Saya melihat visi perusahaan ini sejalan dengan minat dan keahlian saya."
      }
    ],
    "recommendationScore": 79,
    "status": "rejected",
    "appliedDate": "10 hari yang lalu",
    "cvViewed": true,
    "authenticityScore": {
      "authentic": 93,
      "generic": 19,
      "aiGenerated": 8
    },
    "email": "arifrahman@email.com",
    "phone": "081257008640",
    "resumeLink": "https://example.com/cv.pdf"
  },
  {
    "id": "app-612",
    "applicantId": "raisaandriana48",
    "applicantName": "Raisa Andriana",
    "jobId": "job-127",
    "jobTitle": "Lending Risk Analyst",
    "cvSummary": "Kandidat memiliki pengalaman 3 tahun di bidang Konsultasi & Strategi. Sangat menguasai Analisis dan memiliki rekam jejak yang baik dalam spesialis konsultasi & strategi.",
    "validationStatus": "completed",
    "validationResponses": [
      {
        "question": "Ceritakan pengalaman terbesar Anda di bidang ini.",
        "answer": "Saya telah bekerja sebagai Spesialis Konsultasi & Strategi selama 3 tahun, fokus pada Analisis."
      },
      {
        "question": "Mengapa Anda tertarik dengan posisi ini?",
        "answer": "Saya melihat visi perusahaan ini sejalan dengan minat dan keahlian saya."
      }
    ],
    "recommendationScore": 60,
    "status": "under-review",
    "appliedDate": "2 hari yang lalu",
    "cvViewed": true,
    "authenticityScore": {
      "authentic": 81,
      "generic": 11,
      "aiGenerated": 2
    },
    "email": "raisaandriana@email.com",
    "phone": "081265102280",
    "resumeLink": "https://example.com/cv.pdf"
  },
  {
    "id": "app-613",
    "applicantId": "tutihandayani28",
    "applicantName": "Tuti Handayani",
    "jobId": "job-128",
    "jobTitle": "Employee Life Cycle Specialist",
    "cvSummary": "Kandidat memiliki pengalaman 3 tahun di bidang Konstruksi. Sangat menguasai Manajemen Proyek, K3, AutoCAD dan memiliki rekam jejak yang baik dalam manajer proyek konstruksi.",
    "validationStatus": "completed",
    "validationResponses": [
      {
        "question": "Ceritakan pengalaman terbesar Anda di bidang ini.",
        "answer": "Saya telah bekerja sebagai Manajer Proyek Konstruksi selama 3 tahun, fokus pada Manajemen Proyek, K3, AutoCAD."
      },
      {
        "question": "Mengapa Anda tertarik dengan posisi ini?",
        "answer": "Saya melihat visi perusahaan ini sejalan dengan minat dan keahlian saya."
      }
    ],
    "recommendationScore": 77,
    "status": "under-review",
    "appliedDate": "2 hari yang lalu",
    "cvViewed": true,
    "authenticityScore": {
      "authentic": 78,
      "generic": 13,
      "aiGenerated": 9
    },
    "email": "tutihandayani@email.com",
    "phone": "081262590468",
    "resumeLink": "https://example.com/cv.pdf"
  },
  {
    "id": "app-614",
    "applicantId": "tutihandayani40",
    "applicantName": "Tuti Handayani",
    "jobId": "job-128",
    "jobTitle": "Employee Life Cycle Specialist",
    "cvSummary": "Kandidat memiliki pengalaman 3 tahun di bidang Konstruksi. Sangat menguasai Manajemen Proyek, K3 dan memiliki rekam jejak yang baik dalam manajer proyek konstruksi.",
    "validationStatus": "completed",
    "validationResponses": [
      {
        "question": "Ceritakan pengalaman terbesar Anda di bidang ini.",
        "answer": "Saya telah bekerja sebagai Manajer Proyek Konstruksi selama 3 tahun, fokus pada Manajemen Proyek, K3."
      },
      {
        "question": "Mengapa Anda tertarik dengan posisi ini?",
        "answer": "Saya melihat visi perusahaan ini sejalan dengan minat dan keahlian saya."
      }
    ],
    "recommendationScore": 96,
    "status": "rejected",
    "appliedDate": "7 hari yang lalu",
    "cvViewed": true,
    "authenticityScore": {
      "authentic": 74,
      "generic": 20,
      "aiGenerated": 7
    },
    "email": "tutihandayani@email.com",
    "phone": "081264618775",
    "resumeLink": "https://example.com/cv.pdf"
  },
  {
    "id": "app-615",
    "applicantId": "antonsyahputra75",
    "applicantName": "Anton Syahputra",
    "jobId": "job-128",
    "jobTitle": "Employee Life Cycle Specialist",
    "cvSummary": "Kandidat memiliki pengalaman 3 tahun di bidang Konstruksi. Sangat menguasai Manajemen Proyek, K3, AutoCAD dan memiliki rekam jejak yang baik dalam manajer proyek konstruksi.",
    "validationStatus": "completed",
    "validationResponses": [
      {
        "question": "Ceritakan pengalaman terbesar Anda di bidang ini.",
        "answer": "Saya telah bekerja sebagai Manajer Proyek Konstruksi selama 3 tahun, fokus pada Manajemen Proyek, K3, AutoCAD."
      },
      {
        "question": "Mengapa Anda tertarik dengan posisi ini?",
        "answer": "Saya melihat visi perusahaan ini sejalan dengan minat dan keahlian saya."
      }
    ],
    "recommendationScore": 57,
    "status": "rejected",
    "appliedDate": "1 hari yang lalu",
    "cvViewed": true,
    "authenticityScore": {
      "authentic": 73,
      "generic": 17,
      "aiGenerated": 2
    },
    "email": "antonsyahputra@email.com",
    "phone": "081261445982",
    "resumeLink": "https://example.com/cv.pdf"
  },
  {
    "id": "app-616",
    "applicantId": "donisaputra32",
    "applicantName": "Doni Saputra",
    "jobId": "job-128",
    "jobTitle": "Employee Life Cycle Specialist",
    "cvSummary": "Kandidat memiliki pengalaman 3 tahun di bidang Konstruksi. Sangat menguasai Manajemen Proyek dan memiliki rekam jejak yang baik dalam manajer proyek konstruksi.",
    "validationStatus": "completed",
    "validationResponses": [
      {
        "question": "Ceritakan pengalaman terbesar Anda di bidang ini.",
        "answer": "Saya telah bekerja sebagai Manajer Proyek Konstruksi selama 3 tahun, fokus pada Manajemen Proyek."
      },
      {
        "question": "Mengapa Anda tertarik dengan posisi ini?",
        "answer": "Saya melihat visi perusahaan ini sejalan dengan minat dan keahlian saya."
      }
    ],
    "recommendationScore": 85,
    "status": "rejected",
    "appliedDate": "9 hari yang lalu",
    "cvViewed": true,
    "authenticityScore": {
      "authentic": 73,
      "generic": 9,
      "aiGenerated": 0
    },
    "email": "donisaputra@email.com",
    "phone": "081259780177",
    "resumeLink": "https://example.com/cv.pdf"
  },
  {
    "id": "app-617",
    "applicantId": "bimaarya13",
    "applicantName": "Bima Arya",
    "jobId": "job-128",
    "jobTitle": "Employee Life Cycle Specialist",
    "cvSummary": "Kandidat memiliki pengalaman 3 tahun di bidang Konstruksi. Sangat menguasai Manajemen Proyek, K3, AutoCAD dan memiliki rekam jejak yang baik dalam manajer proyek konstruksi.",
    "validationStatus": "completed",
    "validationResponses": [
      {
        "question": "Ceritakan pengalaman terbesar Anda di bidang ini.",
        "answer": "Saya telah bekerja sebagai Manajer Proyek Konstruksi selama 3 tahun, fokus pada Manajemen Proyek, K3, AutoCAD."
      },
      {
        "question": "Mengapa Anda tertarik dengan posisi ini?",
        "answer": "Saya melihat visi perusahaan ini sejalan dengan minat dan keahlian saya."
      }
    ],
    "recommendationScore": 80,
    "status": "under-review",
    "appliedDate": "3 hari yang lalu",
    "cvViewed": true,
    "authenticityScore": {
      "authentic": 92,
      "generic": 12,
      "aiGenerated": 8
    },
    "email": "bimaarya@email.com",
    "phone": "081226900240",
    "resumeLink": "https://example.com/cv.pdf"
  },
  {
    "id": "app-618",
    "applicantId": "rinaamelia79",
    "applicantName": "Rina Amelia",
    "jobId": "job-129",
    "jobTitle": "Collection Admin Supervisor",
    "cvSummary": "Kandidat memiliki pengalaman 3 tahun di bidang Pertambangan, Sumber Daya Alam & Energi. Sangat menguasai Analisis dan memiliki rekam jejak yang baik dalam spesialis pertambangan, sumber daya alam & energi.",
    "validationStatus": "completed",
    "validationResponses": [
      {
        "question": "Ceritakan pengalaman terbesar Anda di bidang ini.",
        "answer": "Saya telah bekerja sebagai Spesialis Pertambangan, Sumber Daya Alam & Energi selama 3 tahun, fokus pada Analisis."
      },
      {
        "question": "Mengapa Anda tertarik dengan posisi ini?",
        "answer": "Saya melihat visi perusahaan ini sejalan dengan minat dan keahlian saya."
      }
    ],
    "recommendationScore": 75,
    "status": "interview",
    "appliedDate": "9 hari yang lalu",
    "cvViewed": true,
    "authenticityScore": {
      "authentic": 94,
      "generic": 8,
      "aiGenerated": 1
    },
    "email": "rinaamelia@email.com",
    "phone": "081270229449",
    "resumeLink": "https://example.com/cv.pdf"
  },
  {
    "id": "app-619",
    "applicantId": "rossa60",
    "applicantName": "Rossa",
    "jobId": "job-129",
    "jobTitle": "Collection Admin Supervisor",
    "cvSummary": "Kandidat memiliki pengalaman 3 tahun di bidang Pertambangan, Sumber Daya Alam & Energi. Sangat menguasai Analisis, Manajemen dan memiliki rekam jejak yang baik dalam spesialis pertambangan, sumber daya alam & energi.",
    "validationStatus": "completed",
    "validationResponses": [
      {
        "question": "Ceritakan pengalaman terbesar Anda di bidang ini.",
        "answer": "Saya telah bekerja sebagai Spesialis Pertambangan, Sumber Daya Alam & Energi selama 3 tahun, fokus pada Analisis, Manajemen."
      },
      {
        "question": "Mengapa Anda tertarik dengan posisi ini?",
        "answer": "Saya melihat visi perusahaan ini sejalan dengan minat dan keahlian saya."
      }
    ],
    "recommendationScore": 62,
    "status": "interview",
    "appliedDate": "6 hari yang lalu",
    "cvViewed": true,
    "authenticityScore": {
      "authentic": 76,
      "generic": 11,
      "aiGenerated": 4
    },
    "email": "rossa@email.com",
    "phone": "081277520211",
    "resumeLink": "https://example.com/cv.pdf"
  },
  {
    "id": "app-620",
    "applicantId": "sitiaminah55",
    "applicantName": "Siti Aminah",
    "jobId": "job-129",
    "jobTitle": "Collection Admin Supervisor",
    "cvSummary": "Kandidat memiliki pengalaman 3 tahun di bidang Pertambangan, Sumber Daya Alam & Energi. Sangat menguasai Analisis, Manajemen dan memiliki rekam jejak yang baik dalam spesialis pertambangan, sumber daya alam & energi.",
    "validationStatus": "completed",
    "validationResponses": [
      {
        "question": "Ceritakan pengalaman terbesar Anda di bidang ini.",
        "answer": "Saya telah bekerja sebagai Spesialis Pertambangan, Sumber Daya Alam & Energi selama 3 tahun, fokus pada Analisis, Manajemen."
      },
      {
        "question": "Mengapa Anda tertarik dengan posisi ini?",
        "answer": "Saya melihat visi perusahaan ini sejalan dengan minat dan keahlian saya."
      }
    ],
    "recommendationScore": 61,
    "status": "rejected",
    "appliedDate": "3 hari yang lalu",
    "cvViewed": true,
    "authenticityScore": {
      "authentic": 76,
      "generic": 6,
      "aiGenerated": 4
    },
    "email": "sitiaminah@email.com",
    "phone": "081285019139",
    "resumeLink": "https://example.com/cv.pdf"
  },
  {
    "id": "app-621",
    "applicantId": "andipratama10",
    "applicantName": "Andi Pratama",
    "jobId": "job-129",
    "jobTitle": "Collection Admin Supervisor",
    "cvSummary": "Kandidat memiliki pengalaman 3 tahun di bidang Pertambangan, Sumber Daya Alam & Energi. Sangat menguasai Analisis, Manajemen dan memiliki rekam jejak yang baik dalam spesialis pertambangan, sumber daya alam & energi.",
    "validationStatus": "completed",
    "validationResponses": [
      {
        "question": "Ceritakan pengalaman terbesar Anda di bidang ini.",
        "answer": "Saya telah bekerja sebagai Spesialis Pertambangan, Sumber Daya Alam & Energi selama 3 tahun, fokus pada Analisis, Manajemen."
      },
      {
        "question": "Mengapa Anda tertarik dengan posisi ini?",
        "answer": "Saya melihat visi perusahaan ini sejalan dengan minat dan keahlian saya."
      }
    ],
    "recommendationScore": 92,
    "status": "under-review",
    "appliedDate": "4 hari yang lalu",
    "cvViewed": true,
    "authenticityScore": {
      "authentic": 91,
      "generic": 7,
      "aiGenerated": 8
    },
    "email": "andipratama@email.com",
    "phone": "081241042511",
    "resumeLink": "https://example.com/cv.pdf"
  },
  {
    "id": "app-622",
    "applicantId": "liayuliana38",
    "applicantName": "Lia Yuliana",
    "jobId": "job-129",
    "jobTitle": "Collection Admin Supervisor",
    "cvSummary": "Kandidat memiliki pengalaman 3 tahun di bidang Pertambangan, Sumber Daya Alam & Energi. Sangat menguasai Analisis, Manajemen, Komunikasi dan memiliki rekam jejak yang baik dalam spesialis pertambangan, sumber daya alam & energi.",
    "validationStatus": "completed",
    "validationResponses": [
      {
        "question": "Ceritakan pengalaman terbesar Anda di bidang ini.",
        "answer": "Saya telah bekerja sebagai Spesialis Pertambangan, Sumber Daya Alam & Energi selama 3 tahun, fokus pada Analisis, Manajemen, Komunikasi."
      },
      {
        "question": "Mengapa Anda tertarik dengan posisi ini?",
        "answer": "Saya melihat visi perusahaan ini sejalan dengan minat dan keahlian saya."
      }
    ],
    "recommendationScore": 76,
    "status": "under-review",
    "appliedDate": "5 hari yang lalu",
    "cvViewed": true,
    "authenticityScore": {
      "authentic": 82,
      "generic": 11,
      "aiGenerated": 6
    },
    "email": "liayuliana@email.com",
    "phone": "081290937320",
    "resumeLink": "https://example.com/cv.pdf"
  }
];
