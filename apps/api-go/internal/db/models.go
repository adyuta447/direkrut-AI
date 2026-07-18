package db

import (
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
