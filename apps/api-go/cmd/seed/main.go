// cmd/seed insert data contoh (companies, akun HRD, lowongan) ke database
// lokal, biar dashboard HRD & pencarian lowongan di apps/web ada isinya
// buat gambaran begitu dihubungkan ke apps/api-go.
//
// Idempotent: tiap company di-skip kalau akun HRD-nya (dicek by email)
// udah ada, jadi aman dijalanin berkali-kali (mis. abis restart docker
// compose) tanpa bikin data dobel.
//
// Jalanin dengan: go run ./cmd/seed (env yang sama dengan cmd/server).
package main

import (
	"log"
	"time"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"

	"github.com/adyuta447/direkrut-ai/api-go/internal/config"
	appdb "github.com/adyuta447/direkrut-ai/api-go/internal/db"
)

// Password sama buat semua akun HRD contoh -- cuma buat lokal/demo, jangan
// dipakai polanya buat kredensial sungguhan.
const seedPassword = "Password123!"

type seedJob struct {
	title                string
	description          string
	requirements         string
	location             string
	employmentType       string
	salaryMin            int64
	salaryMax            int64
	requiredSkills       *string
	preferredSkills      *string
	keyResponsibilities  *string
	minExperienceYears   *int
	educationRequirement *string
	candidateType        string
}

func ptrStr(s string) *string { return &s }
func ptrInt(i int) *int       { return &i }


type seedCompany struct {
	name     string
	industry string
	hrdEmail string
	hrdName  string
	jobTitle string
	jobs     []seedJob
}

var seedCompanies = []seedCompany{
	{
		name:     "PT Konsultan Bisnis Global",
		industry: "Konsultan & Layanan Profesional",
		hrdEmail: "hrd@konsultanglobal.example.com",
		hrdName:  "Sarah Salsabila",
		jobTitle: "Talent Acquisition",
		jobs: []seedJob{
			{
				title:          "Associate - IT Service Group",
				description:    "PT Konsultan Bisnis Global is an inclusive and equal-opportunity employer that does not discriminate based on physical disabilities, gender, race, religion, or age. Your application will be treated fairly and assessed solely based on job requirements and competencies.\n\nThis group provides services to 3,000+ staff and partners for end-to-end IT solutions. Our goal is to have great relationships with our users and provide services that exceed today’s best IT Industry standards. You will be challenged to handle various tasks with various IT problem levels and users. You will experience new knowledge of IT troubleshooting and new technologies.\n\nKey Responsibilities:\n- Act as the first point of contact for employees seeking technical support at the service desk.\n- Diagnose and resolve hardware, software, and network issues across desktops, laptops, and mobile devices.\n- Log and track service requests using IT Service Management platforms (e.g., ServiceNow).\n- Maintain accurate records of service desk interactions and IT equipment handovers.\n- Ensure the service desk area is organized, secure, and equipped for efficient support.\n- Follow IT security protocols and company policies in all support activities.\n- Provide basic hospitality support when required.",
				requirements:   "- Candidate must possess minimum Diploma 3 degree, preferably from information system, computer science, hospitality management, communication study. Fresh graduates are welcome to apply.\n- Minimum GPA of 2.85 out of 4.00.\n- Good communication skills and strong client-service attitude.\n- Capabilities to work under pressure with team or minimum supervision.\n- Good analytical and logical skills in understanding user requirements and application design concept.\n- Fluent in English and Bahasa Indonesia.",
				location:             "Yogyakarta, DI Yogyakarta",
				employmentType:       "full-time",
				salaryMin:            6000000,
				salaryMax:            10000000,
				requiredSkills:       ptrStr(`["IT Support", "Troubleshooting", "Hardware", "Software"]`),
				preferredSkills:      ptrStr(`["ServiceNow", "English", "Communication"]`),
				keyResponsibilities:  ptrStr("Act as the first point of contact for employees seeking technical support.\nDiagnose and resolve hardware/software issues."),
				minExperienceYears:   ptrInt(0),
				educationRequirement: ptrStr("Minimum Diploma 3 degree in IT"),
				candidateType:        "fresh_graduate",
			},
			{
				title:          "Senior Associate - Assurance (Audit)",
				description:    "Join our Assurance practice and help organizations navigate regulatory complexity and strengthen trust and transparency. You will be part of a team providing a range of audit and advisory services to a diverse client base across various industries.",
				requirements:   "- Bachelor's degree in Accounting, Finance, or related field.\n- Minimum GPA of 3.00 out of 4.00.\n- At least 3 years of experience in public accounting or external audit.\n- CPA or equivalent professional qualification is highly preferred.\n- Strong knowledge of PSAK and IFRS.\n- Excellent analytical and problem-solving skills.\n- Fluency in English (both written and spoken).",
				location:             "Jakarta Pusat",
				employmentType:       "full-time",
				salaryMin:            15000000,
				salaryMax:            25000000,
				requiredSkills:       ptrStr(`["Audit", "Accounting", "PSAK", "IFRS"]`),
				preferredSkills:      ptrStr(`["CPA", "Advisory", "English"]`),
				keyResponsibilities:  ptrStr("Provide a range of audit and advisory services to a diverse client base."),
				minExperienceYears:   ptrInt(3),
				educationRequirement: ptrStr("Bachelor's degree in Accounting or Finance"),
				candidateType:        "professional",
			},
		},
	},
	{
		name:     "PT Makmur Finansial Nusantara (MFN)",
		industry: "Keuangan & Pembiayaan",
		hrdEmail: "recruitment@mfn-finance.example.com",
		hrdName:  "Budi Santoso",
		jobTitle: "HR Recruitment",
		jobs: []seedJob{
			{
				title:          "Program Management Trainee",
				description:    "Dalam Program Management Trainee ini, kamu akan dipersiapkan menjadi future leader di MFN dalam waktu 9 bulan melalui in class training dan on the job training. Jadilah bagian dari inovasi masa depan industri pembiayaan bersama perusahaan kami.",
				requirements:   "- Fresh graduate dan terbuka untuk semua jurusan.\n- Minimal pendidikan S1 dengan IPK minimal 3.00.\n- Memiliki pengalaman dalam memimpin suatu organisasi.\n- Memiliki kemampuan konseptual dan negosiasi yang baik.\n- Memiliki daya analisa dan perencanaan yang kuat.\n- Bersedia ditempatkan di seluruh wilayah Indonesia.\n- Usia maksimal 25 tahun.",
				location:             "Seluruh Indonesia (Rotasi)",
				employmentType:       "full-time",
				salaryMin:            8000000,
				salaryMax:            12000000,
				requiredSkills:       ptrStr(`["Leadership", "Negotiation", "Analytical"]`),
				preferredSkills:      ptrStr(`["Conceptual Thinking"]`),
				keyResponsibilities:  ptrStr("Ikut serta dalam in class training dan on the job training selama 9 bulan.\nMempersiapkan diri sebagai future leader."),
				minExperienceYears:   ptrInt(0),
				educationRequirement: ptrStr("S1 semua jurusan, IPK min 3.00"),
				candidateType:        "fresh_graduate",
			},
			{
				title:          "Recruitment Officer",
				description:    "Sebagai Recruitment Officer di Head Office, Anda akan bertanggung jawab untuk mencari dan merekrut talenta-talenta terbaik untuk bergabung dengan MFN. Anda akan terlibat dalam seluruh siklus rekrutmen dari sourcing, seleksi, hingga onboarding karyawan baru.",
				requirements:   "- Pendidikan minimal S1 dari semua jurusan, diutamakan Psikologi atau Manajemen SDM.\n- Berdomisili di area Jakarta dan sekitarnya.\n- Memiliki integritas tinggi dalam bekerja dan menjaga rahasia perusahaan.\n- Customer focus oriented dan memiliki kemampuan komunikasi yang luar biasa.\n- Pengalaman minimal 1 tahun di bidang rekrutmen (Fresh graduate dipersilakan melamar jika memiliki pengalaman magang terkait).\n- Mampu mengoperasikan alat tes psikologi dasar adalah nilai tambah.",
				location:             "Jakarta Selatan (Head Office)",
				employmentType:       "full-time",
				salaryMin:            6000000,
				salaryMax:            9000000,
				requiredSkills:       ptrStr(`["Recruitment", "Interviewing", "Communication"]`),
				preferredSkills:      ptrStr(`["Psychological Tools", "Sourcing"]`),
				keyResponsibilities:  ptrStr("Mencari dan merekrut talenta terbaik.\nTerlibat dalam siklus rekrutmen (sourcing, seleksi, onboarding)."),
				minExperienceYears:   ptrInt(1),
				educationRequirement: ptrStr("S1 Psikologi atau Manajemen SDM"),
				candidateType:        "any",
			},
		},
	},
	{
		name:     "Grup Konglomerasi Sentosa",
		industry: "Otomotif & Konglomerat",
		hrdEmail: "hr.hq@sentosagroup.example.com",
		hrdName:  "Ardiansyah",
		jobTitle: "Head of IT Recruitment",
		jobs: []seedJob{
			{
				title:          "IT Business Solution Lead",
				description:    "Membangun hubungan yang kuat dengan pengguna bisnis, dan secara berkala mengkomunikasikan roadmap produk serta pengembangan kepada Eksekutif.\nMelakukan riset tentang tren Bisnis Digital & Teknologi, mengusulkan Inovasi Digital dengan Value Proposition yang kuat dan Diferensiasi Utama.\nMengembangkan roadmap produk dan strategi deliverables MVP yang selaras dengan prioritas bisnis yang berkembang.\nMendefinisikan User Story/Customer Journey, User Personas, dan membuat wireframe UI/UX bersama dengan tim UI/UX.\nMenganalisis & Merancang Kebutuhan Bisnis/Fungsional (BPS/FSD) agar selaras dengan Digital Product Roadmap.\nBekerja sama dengan anggota tim lain sebagai satu tim Agile: Scrum Master, desainer UI/UX, Developer, QA/Tester, dan Operasional Support.",
				requirements:   "- Gelar Sarjana dari jurusan: Ilmu Komputer / Sistem Informasi / Teknik / Manajemen Bisnis (Gelar Magister akan menjadi nilai tambah).\n- Pengalaman minimal 5 tahun sebagai praktisi IT dengan 2-3 tahun sebagai konsultan IT dari perusahaan konsultan IT terkemuka dengan 2-3 siklus proyek atau klien yang berbeda dalam memberikan solusi IT.\n- Berpengalaman dalam melakukan riset kepada level eksekutif dan tim operasional untuk mengumpulkan dan memformulasikan kebutuhan bisnis strategis.\n- Memiliki wawasan bisnis yang kuat dan mampu mendefinisikan serta merancang solusi menggunakan kerangka kerja umum seperti VPC, BMC, Customer Journey Map, Analisis Biaya-Manfaat (CBA), Proof-of-Concept, dll.\n- Berpengalaman dalam lingkungan kerja Agile (Scrum, Kanban, dll.) pada Produk Digital.\n- Memiliki keterampilan komunikasi dan presentasi yang sangat baik (misalnya pitch deck, infografis, dll).",
				location:       "Jakarta Utara (Head Office)",
				employmentType: "full-time",
				salaryMin:      20000000,
				salaryMax:      35000000,
			},
		},
	},
	{
		name:     "Nusantara Tech Solutions",
		industry: "Teknologi & Software",
		hrdEmail: "hrd@nusantaratech.example.com",
		hrdName:  "Rina Melati",
		jobTitle: "Technical Recruiter",
		jobs: []seedJob{
			{
				title:          "Senior Backend Engineer (Golang)",
				description:    "Rancang dan bangun arsitektur sistem backend skala besar. Anda akan memimpin tim backend dalam mengimplementasikan microservices dan memastikan performa tinggi serta ketersediaan sistem 24/7.",
				requirements:   "- Gelar S1 di bidang Ilmu Komputer atau setara.\n- Pengalaman profesional minimal 4 tahun dalam pengembangan backend.\n- Pengalaman mendalam menggunakan Golang (Go) minimal 2 tahun di production.\n- Mahir dengan arsitektur microservices, gRPC, RESTful API, dan message brokers (Kafka/RabbitMQ).\n- Berpengalaman menggunakan Kubernetes dan Docker.\n- Pemahaman kuat tentang optimasi database PostgreSQL dan caching dengan Redis.\n- Memiliki kemampuan problem-solving yang sangat baik.",
				location:       "Remote",
				employmentType: "full-time",
				salaryMin:      18000000,
				salaryMax:      30000000,
			},
			{
				title:          "Business Development Manager",
				description:    "Pimpin strategi pertumbuhan perusahaan dengan mengidentifikasi peluang pasar baru, menjalin kemitraan strategis, dan memimpin tim sales dalam mencapai target kuartalan.",
				requirements:   "- Pengalaman minimal 5 tahun di bidang B2B Sales atau Business Development di industri Tech/SaaS.\n- Track record terbukti dalam mencapai dan melampaui target sales.\n- Jaringan luas di kalangan eksekutif tingkat C (C-level network) di Indonesia.\n- Keterampilan negosiasi tingkat lanjut dan kemampuan membuat proposal bisnis yang meyakinkan.\n- Kemampuan memimpin dan mementor tim sales junior.\n- Bahasa Inggris fasih adalah keharusan.",
				location:             "Jakarta Selatan",
				employmentType:       "full-time",
				salaryMin:            25000000,
				salaryMax:            40000000,
				requiredSkills:       ptrStr(`["B2B Sales", "Business Development", "Negotiation", "Leadership"]`),
				preferredSkills:      ptrStr(`["SaaS", "C-Level Network", "English"]`),
				keyResponsibilities:  ptrStr("Pimpin strategi pertumbuhan perusahaan.\nIdentifikasi peluang pasar baru.\nJalin kemitraan strategis."),
				minExperienceYears:   ptrInt(5),
				educationRequirement: ptrStr("S1 Bisnis atau terkait"),
				candidateType:        "professional",
			},
		},
	},
}

func main() {
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("config: %v", err)
	}

	gdb, err := appdb.Connect(cfg.DatabaseURL)
	if err != nil {
		log.Fatalf("db: %v", err)
	}

	passwordHash, err := bcrypt.GenerateFromPassword([]byte(seedPassword), bcrypt.DefaultCost)
	if err != nil {
		log.Fatalf("bcrypt: %v", err)
	}

	log.Println("Mereset data HRD, Perusahaan, dan Lowongan Pekerjaan lama...")
	// Hapus history aplikasi dulu agar foreign key aman
	gdb.Exec("DELETE FROM assessment_items")
	gdb.Exec("DELETE FROM assessments")
	gdb.Exec("DELETE FROM application_status_history")
	gdb.Exec("DELETE FROM scoring_results")
	gdb.Exec("DELETE FROM cv_parse_results") // mungkin tidak terkait jobs, tapi amankan saja
	gdb.Exec("DELETE FROM applications")
	gdb.Exec("DELETE FROM jobs")
	gdb.Exec("DELETE FROM hrd_users")
	gdb.Exec("DELETE FROM companies")
	gdb.Exec("DELETE FROM refresh_tokens WHERE user_id IN (SELECT id FROM users WHERE role = 'hrd')")
	gdb.Exec("DELETE FROM notifications WHERE user_id IN (SELECT id FROM users WHERE role = 'hrd')")
	gdb.Exec("DELETE FROM users WHERE role = 'hrd'")
	log.Println("Data lama berhasil dihapus. Mulai proses seeding...")

	seededCompanies, seededJobs := 0, 0

	for _, sc := range seedCompanies {
		jobTitle := sc.jobTitle
		industry := sc.industry

		txErr := gdb.Transaction(func(tx *gorm.DB) error {
			user := appdb.User{Email: sc.hrdEmail, PasswordHash: string(passwordHash), Role: "hrd", Status: "active"}
			if err := tx.Create(&user).Error; err != nil {
				return err
			}

			company := appdb.Company{Name: sc.name, Industry: &industry}
			if err := tx.Create(&company).Error; err != nil {
				return err
			}

			hrdUser := appdb.HrdUser{UserID: user.ID, CompanyID: company.ID, JobTitle: &jobTitle}
			if err := tx.Create(&hrdUser).Error; err != nil {
				return err
			}

			now := time.Now()
			for _, j := range sc.jobs {
				req, loc, empType := j.requirements, j.location, j.employmentType
				salaryMin, salaryMax := j.salaryMin, j.salaryMax
				job := appdb.Job{
					CompanyID:      company.ID,
					CreatedBy:      hrdUser.ID,
					Title:          j.title,
					Description:    j.description,
					Requirements:   &req,
					Location:       &loc,
					EmploymentType: empType,
					SalaryMin:      &salaryMin,
					SalaryMax:      &salaryMax,
					Status:         "published",
					PublishedAt:    &now,
					RequiredSkills:       j.requiredSkills,
					PreferredSkills:      j.preferredSkills,
					KeyResponsibilities:  j.keyResponsibilities,
					MinExperienceYears:   j.minExperienceYears,
					EducationRequirement: j.educationRequirement,
					CandidateType:        j.candidateType,
				}
				if err := tx.Create(&job).Error; err != nil {
					return err
				}
				seededJobs++
			}

			return nil
		})
		if txErr != nil {
			log.Fatalf("seed %s: %v", sc.name, txErr)
		}

		seededCompanies++
		log.Printf("seeded %s (%d lowongan) -- login HRD: %s / %s", sc.name, len(sc.jobs), sc.hrdEmail, seedPassword)
	}

	log.Printf("done -- %d company baru, %d lowongan baru", seededCompanies, seededJobs)
}
