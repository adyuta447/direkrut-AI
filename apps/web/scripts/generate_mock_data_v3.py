import json
import random

industries = [
    "Akuntansi", "Administrasi & Dukungan Perkantoran", "Periklanan, Seni & Media", 
    "Perbankan & Layanan Finansial", "Call Center & Layanan Konsumen", "CEO & Manajemen Umum", 
    "Layanan & Pengembangan Masyarakat", "Konstruksi", "Konsultasi & Strategi", "Desain & Arsitektur", 
    "Pendidikan & Pelatihan", "Teknik", "Pertanian, Hewan & Konservasi", "Pemerintahan & Pertahanan", 
    "Kesehatan & Medis", "Hospitaliti & Pariwisata", "Sumber Daya Manusia & Perekrutan", 
    "Teknologi Informasi & Komunikasi", "Asuransi & Dana Pensiun", "Hukum", 
    "Manufaktur, Transportasi & Logistik", "Pemasaran & Komunikasi", "Pertambangan, Sumber Daya Alam & Energi", 
    "Real Estat & Properti", "Ritel & Produk Konsumen", "Penjualan", "Sains & Teknologi", 
    "Pekerjaan Lepas", "Olahraga & Rekreasi", "Keterampilan & Jasa"
]

industry_job_templates = {
    "Akuntansi": [
        {"title": "Senior Akuntan", "reqs": ["CPA", "Laporan Keuangan", "Audit", "Pajak"], "desc": "Mengelola laporan keuangan tahunan dan audit."},
        {"title": "Analis Keuangan", "reqs": ["Forecasting", "Financial Modeling", "Excel", "Analisis Data"], "desc": "Memberikan pandangan strategis terkait budget dan forecasting."}
    ],
    "Administrasi & Dukungan Perkantoran": [
        {"title": "Office Manager", "reqs": ["Manajemen Inventaris", "Komunikasi", "Penjadwalan"], "desc": "Memastikan operasional kantor berjalan lancar setiap hari."},
        {"title": "Asisten Eksekutif", "reqs": ["Manajemen Kalender", "Travel Booking", "Notulensi"], "desc": "Mendukung direktur utama dalam administrasi harian."}
    ],
    "Periklanan, Seni & Media": [
        {"title": "Art Director", "reqs": ["Photoshop", "Illustrator", "Creative Direction"], "desc": "Memimpin arahan visual untuk kampanye klien besar."},
        {"title": "Copywriter", "reqs": ["Menulis Kreatif", "SEO", "Copywriting"], "desc": "Membuat teks persuasif untuk iklan digital."}
    ],
    "Perbankan & Layanan Finansial": [
        {"title": "Credit Analyst", "reqs": ["Analisis Risiko", "Hukum Perbankan", "Penilaian Kredit"], "desc": "Mengevaluasi kelayakan kredit nasabah perusahaan."},
        {"title": "Wealth Manager", "reqs": ["Portofolio Investasi", "Perencana Keuangan", "Sales"], "desc": "Membantu nasabah prioritas mengelola investasi mereka."}
    ],
    "Call Center & Layanan Konsumen": [
        {"title": "Customer Success Manager", "reqs": ["Resolusi Konflik", "CRM", "Komunikasi"], "desc": "Menjaga retensi dan kepuasan klien B2B."},
        {"title": "Customer Service Rep", "reqs": ["Telepon", "Empati", "Penyelesaian Masalah"], "desc": "Menjawab pertanyaan dan keluhan pelanggan via telepon."}
    ],
    "Konstruksi": [
        {"title": "Manajer Proyek Konstruksi", "reqs": ["Manajemen Proyek", "K3", "AutoCAD"], "desc": "Mengawasi proyek pembangunan gedung dari awal hingga akhir."},
        {"title": "Estimator", "reqs": ["Perhitungan RAB", "Analisis Biaya", "Material Konstruksi"], "desc": "Menghitung estimasi biaya dan material untuk proyek baru."}
    ],
    "Pendidikan & Pelatihan": [
        {"title": "Guru Matematika SMA", "reqs": ["Pedagogi", "Matematika", "Manajemen Kelas"], "desc": "Mengajar siswa SMA dan menyusun kurikulum matematika."},
        {"title": "Corporate Trainer", "reqs": ["Presentasi", "Pelatihan SDM", "Modul Pembelajaran"], "desc": "Melatih karyawan baru mengenai standar operasional perusahaan."}
    ],
    "Teknologi Informasi & Komunikasi": [
        {"title": "Software Engineer (Backend)", "reqs": ["Golang", "Microservices", "PostgreSQL", "Docker"], "desc": "Membangun sistem backend yang skalabel dan aman."},
        {"title": "Data Scientist", "reqs": ["Python", "Machine Learning", "SQL", "Statistika"], "desc": "Menganalisis data besar untuk memberikan wawasan bisnis."}
    ],
    "Pemasaran & Komunikasi": [
        {"title": "Digital Marketing Manager", "reqs": ["SEO", "Google Ads", "Analitik Web", "Manajemen Kampanye"], "desc": "Mengelola strategi pemasaran digital perusahaan."},
        {"title": "Social Media Specialist", "reqs": ["Content Creation", "Instagram", "TikTok", "Copywriting"], "desc": "Membuat dan mengelola konten di berbagai platform media sosial."}
    ],
    "Kesehatan & Medis": [
        {"title": "Perawat Klinis", "reqs": ["STR Aktif", "Asuhan Keperawatan", "Komunikasi Pasien"], "desc": "Memberikan pelayanan medis langsung kepada pasien di rumah sakit."},
        {"title": "Apoteker", "reqs": ["Farmakologi", "Izin Apoteker", "Manajemen Stok Obat"], "desc": "Mengelola ketersediaan dan pemberian resep obat."}
    ]
}

# If industry is not in templates, use a generic fallback
def get_job_template(industry):
    if industry in industry_job_templates:
        return random.choice(industry_job_templates[industry])
    return {"title": f"Spesialis {industry}", "reqs": ["Analisis", "Manajemen", "Komunikasi"], "desc": f"Posisi profesional di bidang {industry}."}

indonesian_names = ["Budi Santoso", "Siti Aminah", "Andi Pratama", "Dewi Lestari", "Agus Setiawan", "Ayu Wandira", "Rizky Fauzi", "Putri Maharani", "Hendra Gunawan", "Maya Sari", "Reza Rahadian", "Dina Fitriani", "Fajar Nugraha", "Rina Amelia", "Eko Prasetyo", "Nita Anggraini", "Doni Saputra", "Lia Yuliana", "Arif Rahman", "Santi Susanti", "Bima Arya", "Ratih Purwasih", "Dedi Haryanto", "Fitriani", "Joko Widodo", "Tuti Handayani", "Anton Syahputra", "Wati Kurnia", "Iwan Fals", "Yuni Shara", "Irfan Hakim", "Rossa", "Raffi Ahmad", "Nagita Slavina", "Luna Maya", "Ariel Noah", "Agnez Mo", "Tulus", "Raisa Andriana", "Afgan Syahreza"]

companies = ["PT Nusantara Jaya", "Grup Merdeka", "Solusi Bangsa", "TechIndo Makmur", "Maju Bersama Tbk", "Karya Cipta", "Bintang Sejahtera"]
locations = ["Jakarta", "Surabaya", "Bandung", "Medan", "Semarang", "Remote"]
job_types = ["Penuh Waktu", "Paruh Waktu", "Kontrak", "Magang"]

jobs = []
applications = []

job_id_counter = 100
app_id_counter = 500

for i in range(30):
    industry = random.choice(industries)
    template = get_job_template(industry)
    
    job_id = f"job-{job_id_counter}"
    job_id_counter += 1
    
    job = {
        "id": job_id,
        "title": template["title"],
        "company": random.choice(companies),
        "location": random.choice(locations),
        "type": random.choice(job_types),
        "description": template["desc"],
        "department": industry,
        "requirements": template["reqs"],
        "detailedQualifications": [
            "Pengalaman kerja relevan minimal 2 tahun.",
            "Kemampuan problem-solving yang kuat.",
            "Bisa bekerja dalam tim maupun individu."
        ],
        "salaryRange": f"Rp {random.randint(5, 15)}.000.000 - Rp {random.randint(16, 30)}.000.000",
        "industry": industry,
        "questions": [
            "Ceritakan pengalaman terbesar Anda di bidang ini.",
            "Bagaimana cara Anda menyelesaikan konflik di tempat kerja?"
        ],
        "posted": f"{random.randint(1, 14)} hari yang lalu",
        "applicantCount": random.randint(5, 50)
    }
    jobs.append(job)

    # Generate 3-5 coherent applications for this job
    for _ in range(random.randint(3, 5)):
        app_id = f"app-{app_id_counter}"
        app_id_counter += 1
        applicant_name = random.choice(indonesian_names)
        
        score = random.randint(55, 98)
        
        # Build coherent CV summary based on requirements
        has_reqs = random.sample(template["reqs"], k=min(len(template["reqs"]), random.randint(1, len(template["reqs"]))))
        reqs_str = ", ".join(has_reqs)
        
        cv_summary = f"Kandidat memiliki pengalaman 3 tahun di bidang {industry}. Sangat menguasai {reqs_str} dan memiliki rekam jejak yang baik dalam {template['title'].lower()}."
        
        statuses = ["submitted", "under-review", "interview", "rejected"]
        status = random.choice(statuses)
        
        # cvViewed logic for timeline
        cvViewed = False
        if status in ["under-review", "interview", "rejected"]:
            cvViewed = True
        elif status == "submitted":
            cvViewed = random.choice([True, False])
            
        app = {
            "id": app_id,
            "applicantId": applicant_name.lower().replace(" ", "") + str(random.randint(10,99)),
            "applicantName": applicant_name,
            "jobId": job_id,
            "jobTitle": template["title"],
            "cvSummary": cv_summary,
            "validationStatus": "completed",
            "validationResponses": [
                {
                    "question": "Ceritakan pengalaman terbesar Anda di bidang ini.",
                    "answer": f"Saya telah bekerja sebagai {template['title']} selama 3 tahun, fokus pada {reqs_str}."
                },
                {
                    "question": "Mengapa Anda tertarik dengan posisi ini?",
                    "answer": "Saya melihat visi perusahaan ini sejalan dengan minat dan keahlian saya."
                }
            ],
            "recommendationScore": score,
            "status": status,
            "appliedDate": f"{random.randint(1, 10)} hari yang lalu",
            "cvViewed": cvViewed,
            "authenticityScore": {
                "authentic": random.randint(70, 95),
                "generic": random.randint(5, 20),
                "aiGenerated": random.randint(0, 10)
            },
            "email": f"{applicant_name.lower().replace(' ', '')}@email.com",
            "phone": f"0812{random.randint(10000000, 99999999)}",
            "resumeLink": "https://example.com/cv.pdf"
        }
        applications.append(app)

ts_content = f"""import {{ Job, Application, User }} from "./types";

export const mockUser: User = {{
  id: "user-1",
  name: "Budi HRD",
  email: "budi@direkrutai.com",
  role: "hrd",
}};

export const mockJobs: Job[] = {json.dumps(jobs, indent=2)};

export const mockApplications: Application[] = {json.dumps(applications, indent=2)};
"""

with open("d:/Projek/DirekrutAI/direkrut-AI/src/mockData.ts", "w", encoding="utf-8") as f:
    f.write(ts_content)

print("Successfully generated mockData.ts with coherent Indonesian data.")
