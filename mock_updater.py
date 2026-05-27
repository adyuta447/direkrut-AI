content = """import { Job, Application } from "./types";

export const mockJobs: Job[] = [
  {
    id: "1",
    title: "Relationship Manager",
    company: "PT Bank Central Asia Tbk",
    location: "Jakarta Selatan, Jakarta Raya",
    type: "Full-time",
    department: "Corporate Banking",
    industry: "Perbankan / Jasa Finansial",
    salaryRange: "Rp 12.000.000 – Rp 18.000.000 per month",
    description: "Memelihara dan mengembangkan portofolio nasabah korporat, menganalisis kebutuhan finansial nasabah, serta menawarkan solusi perbankan yang tepat untuk mendukung pertumbuhan bisnis nasabah dan bank.",
    requirements: ["Finance", "Banking", "Credit Analysis", "B2B Sales", "Communication"],
    detailedQualifications: [
      "Pendidikan min S1 (Manajemen/Ekonomi/Akuntansi/Keuangan)",
      "Pengalaman sebagai Relationship Manager minimal 3 tahun di perbankan korporasi",
      "Memiliki pemahaman kuat tentang analisa kredit dan laporan keuangan",
      "Kemampuan negosiasi dan presentasi yang sangat baik",
      "Fasih berbahasa Inggris (lisan dan tulisan)",
      "Berorientasi pada target dan mampu bekerja di bawah tekanan"
    ],
    questions: [
      "Berapa gaji bulanan yang Anda harapkan?",
      "Berapa tahun pengalaman Anda dalam menangani nasabah korporasi (B2B)?",
      "Sebutkan skala portofolio kredit terbesar yang pernah Anda tangani.",
      "Bagaimana strategi Anda dalam mengakuisisi nasabah korporat baru?"
    ],
    posted: "1 hari yang lalu",
    applicantCount: 145
  },
  {
    id: "2",
    title: "Brand Marketing Executive",
    company: "PT Indofood CBP Sukses Makmur Tbk",
    location: "Jakarta Pusat, Jakarta Raya",
    type: "Full-time",
    department: "Marketing",
    industry: "FMCG / Retail",
    salaryRange: "Rp 8.000.000 – Rp 12.000.000 per month",
    description: "Bertanggung jawab atas pengembangan dan pelaksanaan strategi pemasaran produk, mengelola kampanye merek secara nasional, dan menganalisis tren pasar konsumen.",
    requirements: ["Brand Management", "Digital Marketing", "Market Research", "Campaign Strategy", "FMCG"],
    detailedQualifications: [
      "Pendidikan min S1 (Ilmu Komunikasi/Manajemen Pemasaran)",
      "Pengalaman minimal 2 tahun di bidang Brand Management, diutamakan dari industri FMCG",
      "Memahami proses pembuatan kampanye 360 derajat (Digital & ATL/BTL)",
      "Mampu menganalisis data pasar dan consumer behavior",
      "Kreatif, inovatif, dan mampu bekerja sama dengan creative agency",
      "Memiliki kemampuan manajemen proyek yang baik"
    ],
    questions: [
      "Berapa gaji bulanan yang Anda harapkan?",
      "Ceritakan kampanye pemasaran paling sukses yang pernah Anda kelola.",
      "Berapa tahun pengalaman Anda di industri FMCG?",
      "Tools digital marketing apa saja yang Anda kuasai?"
    ],
    posted: "3 hari yang lalu",
    applicantCount: 320
  },
  {
    id: "3",
    title: "HR Business Partner (HRBP)",
    company: "PT Astra International Tbk",
    location: "Jakarta Utara, Jakarta Raya",
    type: "Full-time",
    department: "Human Resources",
    industry: "Otomotif / Konglomerat",
    salaryRange: "Rp 15.000.000 – Rp 25.000.000 per month",
    description: "Bermitra dengan pimpinan departemen bisnis untuk merancang strategi SDM, mengelola siklus rekrutmen, retensi, evaluasi kinerja, serta pengembangan organisasi.",
    requirements: ["HR Strategy", "Talent Acquisition", "Employee Relations", "Performance Management", "Labor Law"],
    detailedQualifications: [
      "Pendidikan min S1/S2 (Psikologi/Manajemen SDM/Hukum)",
      "Pengalaman minimal 5 tahun sebagai HRBP di perusahaan skala besar",
      "Memahami regulasi ketenagakerjaan (UU Cipta Kerja & Disnaker)",
      "Berpengalaman menangani resolusi konflik dan industrial relations",
      "Memiliki kemampuan coaching dan konseling yang kuat",
      "Strategis namun bersedia turun tangan secara operasional"
    ],
    questions: [
      "Berapa gaji bulanan yang Anda harapkan?",
      "Berapa tahun pengalaman Anda menangani Industrial Relations?",
      "Bagaimana Anda menangani manajer divisi yang menolak kebijakan SDM baru?",
      "Apakah Anda pernah merancang sistem Performance Management? Jelaskan singkat."
    ],
    posted: "Diposting 5 jam yang lalu",
    applicantCount: 89
  },
  {
    id: "4",
    title: "Supply Chain Analyst",
    company: "PT Unilever Indonesia Tbk",
    location: "Cikarang, Jawa Barat",
    type: "Full-time",
    department: "Supply Chain & Logistics",
    industry: "Manufaktur / FMCG",
    salaryRange: "Rp 7.500.000 – Rp 11.000.000 per month",
    description: "Menganalisis data rantai pasok untuk mengoptimalkan efisiensi logistik, mengurangi biaya inventaris, dan memastikan ketersediaan produk di gudang secara nasional.",
    requirements: ["Supply Chain", "Data Analysis", "SAP ERP", "Logistics", "Inventory Management"],
    detailedQualifications: [
      "Pendidikan min S1 (Teknik Industri/Manajemen Operasional/Statistika)",
      "Pengalaman 1-3 tahun di bidang rantai pasok atau logistik",
      "Mahir menggunakan software ERP (khususnya SAP MM/SD)",
      "Kemampuan mengolah data besar menggunakan Excel tingkat lanjut atau SQL",
      "Pemahaman kuat mengenai konsep Lean Manufacturing dan Just-in-Time",
      "Bersedia ditempatkan di Cikarang"
    ],
    questions: [
      "Berapa gaji bulanan yang Anda harapkan?",
      "Software ERP apa saja yang Anda kuasai (misal: SAP, Oracle)?",
      "Berapa tahun pengalaman Anda dalam manajemen inventaris?",
      "Jelaskan satu inisiatif Anda yang berhasil menekan biaya operasional logistik."
    ],
    posted: "1 minggu yang lalu",
    applicantCount: 412
  }
];

export const mockApplications: Application[] = [
  {
    id: "app1",
    applicantId: "user1",
    applicantName: "Budi Santoso",
    jobId: "1",
    jobTitle: "Relationship Manager",
    resumeLink: "https://example.com/cv/budi-santoso.pdf",
    cvSummary: "Pengalaman 4 tahun sebagai analis kredit korporat di Bank Mandiri, memahami analisis laporan keuangan dan memiliki portfolio nasabah manufaktur.",
    validationStatus: "completed",
    recommendationScore: 92,
    status: "under-review",
    appliedDate: "2024-11-05",
    authenticityScore: {
      authentic: 85,
      generic: 10,
      aiGenerated: 5,
    },
    validationResponses: [
      {
        question: "Berapa gaji bulanan yang Anda harapkan?",
        answer: "Sekitar Rp 14.000.000 menyesuaikan dengan tanggung jawab.",
      },
      {
        question: "Sebutkan skala portofolio kredit terbesar yang pernah Anda tangani.",
        answer: "Portofolio sindikasi untuk perusahaan manufaktur sebesar Rp 500 Miliar.",
      },
    ],
  },
  {
    id: "app2",
    applicantId: "user2",
    applicantName: "Siti Rahayu",
    jobId: "2",
    jobTitle: "Brand Marketing Executive",
    resumeLink: "https://example.com/cv/siti-rahayu.pdf",
    cvSummary: "3 tahun pengalaman di digital agency menangani klien FMCG. Spesialis dalam campaign 360 dan social media analytics.",
    validationStatus: "completed",
    recommendationScore: 88,
    status: "interview",
    appliedDate: "2024-11-04",
    authenticityScore: {
      authentic: 90,
      generic: 7,
      aiGenerated: 3,
    },
    validationResponses: [],
  }
];

export const validationQuestions = [
  "Ceritakan pengalaman Anda yang paling relevan dengan deskripsi pekerjaan ini.",
  "Bagaimana cara Anda menyelesaikan target yang sangat ketat?",
  "Alat/Tools profesional apa yang paling Anda kuasai sesuai posisi ini?",
  "Ceritakan tantangan terbesar dalam pekerjaan sebelumnya dan solusinya.",
];
"""

with open('src/mockData.ts', 'w', encoding='utf-8') as f:
    f.write(content)
