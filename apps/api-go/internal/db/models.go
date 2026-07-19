package db

import (
	"encoding/json"
	"time"

	"gorm.io/gorm"
)

type User struct {
	ID           string         `gorm:"column:id;primaryKey"`
	Email        string         `gorm:"column:email"`
	PasswordHash string         `gorm:"column:password_hash"`
	Role         string         `gorm:"column:role"`
	Status       string         `gorm:"column:status"`
	CreatedAt    time.Time      `gorm:"column:created_at"`
	UpdatedAt    time.Time      `gorm:"column:updated_at"`
	DeletedAt    gorm.DeletedAt `gorm:"column:deleted_at;index"`
}

func (User) TableName() string { return "users" }

func (u *User) BeforeCreate(tx *gorm.DB) error {
	if u.ID == "" {
		u.ID = newUUIDv4()
	}
	return nil
}

type RefreshToken struct {
	ID        string     `gorm:"column:id;primaryKey"`
	UserID    string     `gorm:"column:user_id"`
	TokenHash string     `gorm:"column:token_hash"`
	ExpiresAt time.Time  `gorm:"column:expires_at"`
	RevokedAt *time.Time `gorm:"column:revoked_at"`
	CreatedAt time.Time  `gorm:"column:created_at"`
}

func (RefreshToken) TableName() string { return "refresh_tokens" }

func (r *RefreshToken) BeforeCreate(tx *gorm.DB) error {
	if r.ID == "" {
		r.ID = newUUIDv4()
	}
	return nil
}

type Company struct {
	ID        string    `gorm:"column:id;primaryKey"`
	Name      string    `gorm:"column:name"`
	Industry  *string   `gorm:"column:industry"`
	LogoURL   *string   `gorm:"column:logo_url"`
	CreatedAt time.Time `gorm:"column:created_at"`
	UpdatedAt time.Time `gorm:"column:updated_at"`
}

func (Company) TableName() string { return "companies" }

func (c *Company) BeforeCreate(tx *gorm.DB) error {
	if c.ID == "" {
		c.ID = newUUIDv4()
	}
	return nil
}

type HrdUser struct {
	ID        string    `gorm:"column:id;primaryKey"`
	UserID    string    `gorm:"column:user_id"`
	CompanyID string    `gorm:"column:company_id"`
	JobTitle  *string   `gorm:"column:job_title"`
	CreatedAt time.Time `gorm:"column:created_at"`
}

func (HrdUser) TableName() string { return "hrd_users" }

func (h *HrdUser) BeforeCreate(tx *gorm.DB) error {
	if h.ID == "" {
		h.ID = newUUIDv4()
	}
	return nil
}

type Candidate struct {
	ID        string  `gorm:"column:id;primaryKey"`
	UserID    string  `gorm:"column:user_id"`
	FullName  string  `gorm:"column:full_name"`
	Phone     *string `gorm:"column:phone"`
	Headline  *string `gorm:"column:headline"`
	Location  *string `gorm:"column:location"`
	CvFileURL *string `gorm:"column:cv_file_url"`

	Age      *int    `gorm:"column:age"`
	Gender   *string `gorm:"column:gender"`
	About    *string `gorm:"column:about"`
	PhotoURL *string `gorm:"column:photo_url"`
	CoverURL *string `gorm:"column:cover_url"`
	// Riwayat kerja/pendidikan/tautan sosial disimpan sebagai JSONB, bukan
	// tabel relasional terpisah -- data ini murni buat ditampilin di profil,
	// gak pernah di-query/di-filter lintas kandidat (beda sama skills yang
	// emang butuh dicari, makanya skills tetap pakai candidate_skills/skills
	// yang udah ada). Upgrade ke tabel sendiri kalau nanti butuh search by
	// pengalaman/pendidikan.
	// default:'[]' bukan cuma dokumentasi -- ini yang bikin GORM OMIT kolom
	// ini dari INSERT pas value Go-nya nil (bukan nulis literal NULL, yang
	// bakal ditolak kolom NOT NULL), jadi DEFAULT '[]'::jsonb di Postgres
	// yang kepake. Tanpa tag ini, register kandidat gagal 500 (kejadian
	// nyata pas verifikasi).
	Experience json.RawMessage `gorm:"column:experience;type:jsonb;default:'[]'"`
	Education  json.RawMessage `gorm:"column:education;type:jsonb;default:'[]'"`
	Links      json.RawMessage `gorm:"column:links;type:jsonb;default:'[]'"`

	CreatedAt time.Time `gorm:"column:created_at"`
	UpdatedAt time.Time `gorm:"column:updated_at"`

	// Belongs-to buat Preload("Candidate.User") pas butuh email kandidat
	// (mis. kirim notifikasi keputusan HRD) -- cuma dibaca, gak pernah
	// di-set saat Create/Update Candidate.
	User *User `gorm:"foreignKey:UserID;references:ID"`
}

func (Candidate) TableName() string { return "candidates" }

func (c *Candidate) BeforeCreate(tx *gorm.DB) error {
	if c.ID == "" {
		c.ID = newUUIDv4()
	}
	return nil
}

type Skill struct {
	ID       string  `gorm:"column:id;primaryKey"`
	Name     string  `gorm:"column:name"`
	Category *string `gorm:"column:category"`
}

func (Skill) TableName() string { return "skills" }

func (s *Skill) BeforeCreate(tx *gorm.DB) error {
	if s.ID == "" {
		s.ID = newUUIDv4()
	}
	return nil
}

type CandidateSkill struct {
	CandidateID string `gorm:"column:candidate_id;primaryKey"`
	SkillID     string `gorm:"column:skill_id;primaryKey"`
	Proficiency string `gorm:"column:proficiency"`
}

func (CandidateSkill) TableName() string { return "candidate_skills" }

type Notification struct {
	ID        string    `gorm:"column:id;primaryKey"`
	UserID    string    `gorm:"column:user_id"`
	Type      string    `gorm:"column:type"`
	Title     string    `gorm:"column:title"`
	Body      *string   `gorm:"column:body"`
	IsRead    bool      `gorm:"column:is_read"`
	CreatedAt time.Time `gorm:"column:created_at"`
}

func (Notification) TableName() string { return "notifications" }

func (n *Notification) BeforeCreate(tx *gorm.DB) error {
	if n.ID == "" {
		n.ID = newUUIDv4()
	}
	return nil
}

type Application struct {
	ID          string    `gorm:"column:id;primaryKey"`
	JobID       string    `gorm:"column:job_id"`
	CandidateID string    `gorm:"column:candidate_id"`
	Status      string    `gorm:"column:status"`
	AppliedAt   time.Time `gorm:"column:applied_at"`
	UpdatedAt   time.Time `gorm:"column:updated_at"`

	Job       *Job       `gorm:"foreignKey:JobID;references:ID"`
	Candidate *Candidate `gorm:"foreignKey:CandidateID;references:ID"`
}

func (Application) TableName() string { return "applications" }

func (a *Application) BeforeCreate(tx *gorm.DB) error {
	if a.ID == "" {
		a.ID = newUUIDv4()
	}
	return nil
}

type ApplicationStatusHistory struct {
	ID            string    `gorm:"column:id;primaryKey"`
	ApplicationID string    `gorm:"column:application_id"`
	ChangedBy     *string   `gorm:"column:changed_by"`
	FromStatus    *string   `gorm:"column:from_status"`
	ToStatus      string    `gorm:"column:to_status"`
	Note          *string   `gorm:"column:note"`
	CreatedAt     time.Time `gorm:"column:created_at"`
}

func (ApplicationStatusHistory) TableName() string { return "application_status_history" }

func (a *ApplicationStatusHistory) BeforeCreate(tx *gorm.DB) error {
	if a.ID == "" {
		a.ID = newUUIDv4()
	}
	return nil
}

type Job struct {
	ID             string     `gorm:"column:id;primaryKey"`
	CompanyID      string     `gorm:"column:company_id"`
	CreatedBy      string     `gorm:"column:created_by"`
	Title          string     `gorm:"column:title"`
	Description    string     `gorm:"column:description"`
	Requirements   *string    `gorm:"column:requirements"`
	Location       *string    `gorm:"column:location"`
	EmploymentType string     `gorm:"column:employment_type"`
	SalaryMin      *int64     `gorm:"column:salary_min"`
	SalaryMax      *int64     `gorm:"column:salary_max"`
	Status         string     `gorm:"column:status"`
	PublishedAt    *time.Time `gorm:"column:published_at"`
	CreatedAt      time.Time  `gorm:"column:created_at"`
	UpdatedAt      time.Time  `gorm:"column:updated_at"`

	// Belongs-to buat Preload("Company") di listing/detail -- konsumen
	// (apps/web) butuh nama & industri perusahaan, bukan cuma company_id.
	// Cuma dibaca (Preload), gak pernah di-set saat Create/Update Job,
	// jadi aman gak nyenggol jalur tulis yang udah ada.
	Company *Company `gorm:"foreignKey:CompanyID;references:ID"`
}

func (Job) TableName() string { return "jobs" }

func (j *Job) BeforeCreate(tx *gorm.DB) error {
	if j.ID == "" {
		j.ID = newUUIDv4()
	}
	return nil
}
