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
	title          string
	description    string
	requirements   string
	location       string
	employmentType string
	salaryMin      int64
	salaryMax      int64
}

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
		name:     "PT Teknologi Nusantara",
		industry: "Teknologi",
		hrdEmail: "hrd@teknologinusantara.example.com",
		hrdName:  "Dewi Anggraini",
		jobTitle: "Talent Acquisition Manager",
		jobs: []seedJob{
			{
				title:          "Software Engineer - Backend",
				description:    "Bangun dan maintain layanan backend Go & Python buat platform rekrutmen kami. Kerja bareng tim AI engine buat fitur CV parsing dan scoring.",
				requirements:   "Minimal 2 tahun pengalaman Go atau Python\nPaham REST API dan database relasional\nTerbiasa kerja di lingkungan agile",
				location:       "Jakarta Selatan (Hybrid)",
				employmentType: "full-time",
				salaryMin:      12000000,
				salaryMax:      20000000,
			},
			{
				title:          "Product Designer (UI/UX)",
				description:    "Rancang pengalaman pengguna buat dashboard HRD dan portal kandidat, dari riset sampai hi-fi prototype.",
				requirements:   "Portfolio kuat di produk B2B/SaaS\nPaham Figma dan design system\nBiasa kolaborasi lintas fungsi dengan engineer",
				location:       "Jakarta Selatan (Hybrid)",
				employmentType: "full-time",
				salaryMin:      10000000,
				salaryMax:      16000000,
			},
			{
				title:          "DevOps Engineer",
				description:    "Kelola infrastruktur cloud dan pipeline CI/CD buat seluruh layanan monorepo kami.",
				requirements:   "Pengalaman dengan Docker & Kubernetes\nTerbiasa dengan GitHub Actions atau CI/CD sejenis\nPaham dasar keamanan infrastruktur",
				location:       "Remote",
				employmentType: "full-time",
				salaryMin:      14000000,
				salaryMax:      22000000,
			},
		},
	},
	{
		name:     "PT Kreatif Digital Indonesia",
		industry: "Marketing & Kreatif",
		hrdEmail: "hrd@kreatifdigital.example.com",
		hrdName:  "Rangga Pratama",
		jobTitle: "HR Business Partner",
		jobs: []seedJob{
			{
				title:          "Content Marketing Specialist",
				description:    "Rencanain dan eksekusi strategi konten buat berbagai brand klien kami, dari artikel sampai video pendek.",
				requirements:   "Pengalaman menulis konten digital minimal 1 tahun\nPaham dasar SEO\nBisa kerja dengan deadline ketat",
				location:       "Bandung",
				employmentType: "full-time",
				salaryMin:      7000000,
				salaryMax:      11000000,
			},
			{
				title:          "Social Media Manager",
				description:    "Kelola akun media sosial klien, susun kalender konten, dan analisis performa kampanye tiap bulan.",
				requirements:   "Familiar dengan Instagram, TikTok, dan LinkedIn Ads\nPengalaman ngurus multi-akun brand\nKreatif dan komunikatif",
				location:       "Bandung (Hybrid)",
				employmentType: "full-time",
				salaryMin:      6500000,
				salaryMax:      10000000,
			},
		},
	},
	{
		name:     "PT Sehat Sejahtera",
		industry: "Kesehatan",
		hrdEmail: "hrd@sehatsejahtera.example.com",
		hrdName:  "Nurul Hidayah",
		jobTitle: "Recruitment Officer",
		jobs: []seedJob{
			{
				title:          "Perawat Klinik",
				description:    "Berikan pelayanan keperawatan dasar di klinik jaringan kami, termasuk pemeriksaan awal dan pendampingan pasien.",
				requirements:   "Lulusan D3/S1 Keperawatan dengan STR aktif\nPengalaman klinis minimal 1 tahun\nRamah dan komunikatif dengan pasien",
				location:       "Surabaya",
				employmentType: "full-time",
				salaryMin:      5500000,
				salaryMax:      8000000,
			},
			{
				title:          "Admin Rumah Sakit",
				description:    "Kelola pendaftaran pasien, rekam medis, dan koordinasi jadwal dokter di rumah sakit mitra kami.",
				requirements:   "Minimal SMA/SMK, diutamakan D3 Administrasi\nTerbiasa dengan sistem informasi rumah sakit\nTeliti dan sabar",
				location:       "Surabaya",
				employmentType: "full-time",
				salaryMin:      4500000,
				salaryMax:      6500000,
			},
		},
	},
	{
		name:     "PT Finansial Prima",
		industry: "Keuangan",
		hrdEmail: "hrd@finansialprima.example.com",
		hrdName:  "Agus Setiawan",
		jobTitle: "HR Manager",
		jobs: []seedJob{
			{
				title:          "Financial Analyst",
				description:    "Analisis laporan keuangan klien korporat dan susun rekomendasi investasi buat tim advisory.",
				requirements:   "S1 Akuntansi/Keuangan\nMahir Excel dan financial modeling\nDiutamakan yang sedang/sudah CFA level 1",
				location:       "Jakarta Pusat",
				employmentType: "full-time",
				salaryMin:      9000000,
				salaryMax:      15000000,
			},
			{
				title:          "Risk Management Officer",
				description:    "Identifikasi dan mitigasi risiko operasional & kredit buat portofolio klien perusahaan.",
				requirements:   "S1 Manajemen Risiko/Keuangan/terkait\nPengalaman minimal 2 tahun di bidang serupa\nTeliti dan analitis",
				location:       "Jakarta Pusat (Hybrid)",
				employmentType: "full-time",
				salaryMin:      10000000,
				salaryMax:      17000000,
			},
			{
				title:          "Magang Financial Planning",
				description:    "Bantu tim financial planning menyusun proposal perencanaan keuangan buat klien individu.",
				requirements:   "Mahasiswa tingkat akhir Keuangan/Akuntansi\nMau belajar cepat dan proaktif\nBisa komit minimal 3 bulan",
				location:       "Jakarta Pusat",
				employmentType: "internship",
				salaryMin:      2500000,
				salaryMax:      3500000,
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

	seededCompanies, seededJobs := 0, 0

	for _, sc := range seedCompanies {
		var existing appdb.User
		err := gdb.Where("email = ?", sc.hrdEmail).First(&existing).Error
		if err == nil {
			log.Printf("skip %s -- akun HRD %s udah ada", sc.name, sc.hrdEmail)
			continue
		}

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
