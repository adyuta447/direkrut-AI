const fs = require('fs');

const industries = [
    "Akuntansi", "Administrasi & Dukungan Perkantoran", "Periklanan, Seni & Media", 
    "Perbankan & Layanan Finansial", "Call Center & Layanan Konsumen", "CEO & Manajemen Umum", 
    "Layanan & Pengembangan Masyarakat", "Konstruksi", "Konsultasi & Strategi", "Desain & Arsitektur", 
    "Pendidikan & Pelatihan", "Teknik", "Pertanian, Hewan & Konservasi", "Pemerintahan & Pertahanan", 
    "Kesehatan & Medis", "Hospitaliti & Pariwisata", "Sumber Daya Manusia & Perekrutan", 
    "Teknologi Informasi & Komunikasi", "Asuransi & Dana Pensiun", "Hukum", 
    "Manufaktur, Transportasi & Logistik", "Pemasaran & Komunikasi", "Pertambangan, Sumber Daya Alam & Energi", 
    "Real Estat & Properti", "Ritel & Produk Konsumen", "Penjualan", "Sains & Teknologi", 
    "Pekerjaan Lepas", "Olahraga & Rekreasi", "Keterampilan & Jasa"
];

const industry_job_templates = {
    "Akuntansi": [
        {title: "Senior Akuntan", reqs: ["CPA", "Laporan Keuangan", "Audit", "Pajak"], desc: "Mengelola laporan keuangan tahunan dan audit."},
        {title: "Analis Keuangan", reqs: ["Forecasting", "Financial Modeling", "Excel", "Analisis Data"], desc: "Memberikan pandangan strategis terkait budget dan forecasting."}
    ],
    "Administrasi & Dukungan Perkantoran": [
        {title: "Office Manager", reqs: ["Manajemen Inventaris", "Komunikasi", "Penjadwalan"], desc: "Memastikan operasional kantor berjalan lancar setiap hari."},
        {title: "Asisten Eksekutif", reqs: ["Manajemen Kalender", "Travel Booking", "Notulensi"], desc: "Mendukung direktur utama dalam administrasi harian."}
    ],
    "Periklanan, Seni & Media": [
        {title: "Art Director", reqs: ["Photoshop", "Illustrator", "Creative Direction"], desc: "Memimpin arahan visual untuk kampanye klien besar."},
        {title: "Copywriter", reqs: ["Menulis Kreatif", "SEO", "Copywriting"], desc: "Membuat teks persuasif untuk iklan digital."}
    ],
    "Perbankan & Layanan Finansial": [
        {title: "Credit Analyst", reqs: ["Analisis Risiko", "Hukum Perbankan", "Penilaian Kredit"], desc: "Mengevaluasi kelayakan kredit nasabah perusahaan."},
        {title: "Wealth Manager", reqs: ["Portofolio Investasi", "Perencana Keuangan", "Sales"], desc: "Membantu nasabah prioritas mengelola investasi mereka."}
    ],
    "Call Center & Layanan Konsumen": [
        {title: "Customer Success Manager", reqs: ["Resolusi Konflik", "CRM", "Komunikasi"], desc: "Menjaga retensi dan kepuasan klien B2B."},
        {title: "Customer Service Rep", reqs: ["Telepon", "Empati", "Penyelesaian Masalah"], desc: "Menjawab pertanyaan dan keluhan pelanggan via telepon."}
    ],
    "Konstruksi": [
        {title: "Manajer Proyek Konstruksi", reqs: ["Manajemen Proyek", "K3", "AutoCAD"], desc: "Mengawasi proyek pembangunan gedung dari awal hingga akhir."},
        {title: "Estimator", reqs: ["Perhitungan RAB", "Analisis Biaya", "Material Konstruksi"], desc: "Menghitung estimasi biaya dan material untuk proyek baru."}
    ],
    "Pendidikan & Pelatihan": [
        {title: "Guru Matematika SMA", reqs: ["Pedagogi", "Matematika", "Manajemen Kelas"], desc: "Mengajar siswa SMA dan menyusun kurikulum matematika."},
        {title: "Corporate Trainer", reqs: ["Presentasi", "Pelatihan SDM", "Modul Pembelajaran"], desc: "Melatih karyawan baru mengenai standar operasional perusahaan."}
    ],
    "Teknologi Informasi & Komunikasi": [
        {title: "Software Engineer (Backend)", reqs: ["Golang", "Microservices", "PostgreSQL", "Docker"], desc: "Membangun sistem backend yang skalabel dan aman."},
        {title: "Data Scientist", reqs: ["Python", "Machine Learning", "SQL", "Statistika"], desc: "Menganalisis data besar untuk memberikan wawasan bisnis."}
    ],
    "Pemasaran & Komunikasi": [
        {title: "Digital Marketing Manager", reqs: ["SEO", "Google Ads", "Analitik Web", "Manajemen Kampanye"], desc: "Mengelola strategi pemasaran digital perusahaan."},
        {title: "Social Media Specialist", reqs: ["Content Creation", "Instagram", "TikTok", "Copywriting"], desc: "Membuat dan mengelola konten di berbagai platform media sosial."}
    ],
    "Kesehatan & Medis": [
        {title: "Perawat Klinis", reqs: ["STR Aktif", "Asuhan Keperawatan", "Komunikasi Pasien"], desc: "Memberikan pelayanan medis langsung kepada pasien di rumah sakit."},
        {title: "Apoteker", reqs: ["Farmakologi", "Izin Apoteker", "Manajemen Stok Obat"], desc: "Mengelola ketersediaan dan pemberian resep obat."}
    ]
};

function get_job_template(industry) {
    if (industry_job_templates[industry]) {
        const templates = industry_job_templates[industry];
        return templates[Math.floor(Math.random() * templates.length)];
    }
    return {title: `Spesialis ${industry}`, reqs: ["Analisis", "Manajemen", "Komunikasi"], desc: `Posisi profesional di bidang ${industry}.`};
}

const indonesian_names = ["Budi Santoso", "Siti Aminah", "Andi Pratama", "Dewi Lestari", "Agus Setiawan", "Ayu Wandira", "Rizky Fauzi", "Putri Maharani", "Hendra Gunawan", "Maya Sari", "Reza Rahadian", "Dina Fitriani", "Fajar Nugraha", "Rina Amelia", "Eko Prasetyo", "Nita Anggraini", "Doni Saputra", "Lia Yuliana", "Arif Rahman", "Santi Susanti", "Bima Arya", "Ratih Purwasih", "Dedi Haryanto", "Fitriani", "Joko Widodo", "Tuti Handayani", "Anton Syahputra", "Wati Kurnia", "Iwan Fals", "Yuni Shara", "Irfan Hakim", "Rossa", "Raffi Ahmad", "Nagita Slavina", "Luna Maya", "Ariel Noah", "Agnez Mo", "Tulus", "Raisa Andriana", "Afgan Syahreza"];

const companies = ["PT Nusantara Jaya", "Grup Merdeka", "Solusi Bangsa", "TechIndo Makmur", "Maju Bersama Tbk", "Karya Cipta", "Bintang Sejahtera"];
const locations = ["Jakarta", "Surabaya", "Bandung", "Medan", "Semarang", "Remote"];
const job_types = ["Penuh Waktu", "Paruh Waktu", "Kontrak", "Magang"];

const jobs = [];
const applications = [];

let job_id_counter = 100;
let app_id_counter = 500;

for (let i = 0; i < 30; i++) {
    const industry = industries[Math.floor(Math.random() * industries.length)];
    const template = get_job_template(industry);
    
    const job_id = `job-${job_id_counter}`;
    job_id_counter++;
    
    const job = {
        id: job_id,
        title: template.title,
        company: companies[Math.floor(Math.random() * companies.length)],
        location: locations[Math.floor(Math.random() * locations.length)],
        type: job_types[Math.floor(Math.random() * job_types.length)],
        description: template.desc,
        department: industry,
        requirements: template.reqs,
        detailedQualifications: [
            "Pengalaman kerja relevan minimal 2 tahun.",
            "Kemampuan problem-solving yang kuat.",
            "Bisa bekerja dalam tim maupun individu."
        ],
        salaryRange: `Rp ${Math.floor(Math.random() * 11) + 5}.000.000 - Rp ${Math.floor(Math.random() * 15) + 16}.000.000`,
        industry: industry,
        questions: [
            "Ceritakan pengalaman terbesar Anda di bidang ini.",
            "Bagaimana cara Anda menyelesaikan konflik di tempat kerja?"
        ],
        posted: `${Math.floor(Math.random() * 14) + 1} hari yang lalu`,
        applicantCount: Math.floor(Math.random() * 46) + 5
    };
    jobs.push(job);

    const numApps = Math.floor(Math.random() * 3) + 3; // 3 to 5
    for (let j = 0; j < numApps; j++) {
        const app_id = `app-${app_id_counter}`;
        app_id_counter++;
        const applicant_name = indonesian_names[Math.floor(Math.random() * indonesian_names.length)];
        
        const score = Math.floor(Math.random() * 44) + 55; // 55 to 98
        
        const reqs = template.reqs;
        const numReqs = Math.min(reqs.length, Math.floor(Math.random() * reqs.length) + 1);
        const has_reqs = reqs.slice(0, numReqs); // just take first N for simplicity
        const reqs_str = has_reqs.join(", ");
        
        const cv_summary = `Kandidat memiliki pengalaman 3 tahun di bidang ${industry}. Sangat menguasai ${reqs_str} dan memiliki rekam jejak yang baik dalam ${template.title.toLowerCase()}.`;
        
        const statuses = ["submitted", "under-review", "interview", "rejected"];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        
        let cvViewed = false;
        if (["under-review", "interview", "rejected"].includes(status)) {
            cvViewed = true;
        } else if (status === "submitted") {
            cvViewed = Math.random() > 0.5;
        }
            
        const app = {
            id: app_id,
            applicantId: applicant_name.toLowerCase().replace(/ /g, "") + (Math.floor(Math.random() * 90) + 10),
            applicantName: applicant_name,
            jobId: job_id,
            jobTitle: template.title,
            cvSummary: cv_summary,
            validationStatus: "completed",
            validationResponses: [
                {
                    question: "Ceritakan pengalaman terbesar Anda di bidang ini.",
                    answer: `Saya telah bekerja sebagai ${template.title} selama 3 tahun, fokus pada ${reqs_str}.`
                },
                {
                    question: "Mengapa Anda tertarik dengan posisi ini?",
                    answer: "Saya melihat visi perusahaan ini sejalan dengan minat dan keahlian saya."
                }
            ],
            recommendationScore: score,
            status: status,
            appliedDate: `${Math.floor(Math.random() * 10) + 1} hari yang lalu`,
            cvViewed: cvViewed,
            authenticityScore: {
                authentic: Math.floor(Math.random() * 26) + 70,
                generic: Math.floor(Math.random() * 16) + 5,
                aiGenerated: Math.floor(Math.random() * 11)
            },
            email: `${applicant_name.toLowerCase().replace(/ /g, "")}@email.com`,
            phone: `0812${Math.floor(Math.random() * 90000000) + 10000000}`,
            resumeLink: "https://example.com/cv.pdf"
        };
        applications.push(app);
    }
}

const ts_content = `import { Job, Application, User } from "./types";

export const mockUser: User = {
  id: "user-1",
  name: "Budi HRD",
  email: "budi@direkrutai.com",
  role: "hrd",
};

export const mockJobs: Job[] = ${JSON.stringify(jobs, null, 2)};

export const mockApplications: Application[] = ${JSON.stringify(applications, null, 2)};
`;

fs.writeFileSync("src/mockData.ts", ts_content);
console.log("Successfully generated src/mockData.ts");
