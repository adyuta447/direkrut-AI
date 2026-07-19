// Package config memuat seluruh env var jadi satu struct yang di-load sekali
// di startup, biar server gagal cepat (fail fast) kalau ada secret yang
// belum di-set, daripada baru ketahuan pas handler tertentu dipanggil.
package config

import (
	"fmt"
	"os"
	"sort"
	"strings"
)

type Config struct {
	Port      string
	WebOrigin string

	DatabaseURL string
	RedisURL    string

	JWTAccessSecret  string
	JWTRefreshSecret string

	AIEngineBaseURL string

	XenditSecretKey     string
	XenditCallbackToken string

	ResendAPIKey     string
	EmailFromAddress string

	ObjectStorageEndpoint     string
	ObjectStorageAccessKey    string
	ObjectStorageSecretKey    string
	ObjectStorageBucket       string
	ObjectStorageUsePathStyle bool
}

func Load() (*Config, error) {
	cfg := &Config{
		Port:      getEnv("PORT", "8080"),
		WebOrigin: os.Getenv("WEB_ORIGIN"),

		DatabaseURL: os.Getenv("DATABASE_URL"),
		RedisURL:    os.Getenv("REDIS_URL"),

		JWTAccessSecret:  os.Getenv("JWT_ACCESS_SECRET"),
		JWTRefreshSecret: os.Getenv("JWT_REFRESH_SECRET"),

		AIEngineBaseURL: os.Getenv("AI_ENGINE_BASE_URL"),

		XenditSecretKey:     os.Getenv("XENDIT_SECRET_KEY"),
		XenditCallbackToken: os.Getenv("XENDIT_CALLBACK_TOKEN"),

		ResendAPIKey:     os.Getenv("RESEND_API_KEY"),
		EmailFromAddress: getEnv("EMAIL_FROM_ADDRESS", "notifikasi@direkrut.ai"),

		ObjectStorageEndpoint:     os.Getenv("OBJECT_STORAGE_ENDPOINT"),
		ObjectStorageAccessKey:    os.Getenv("OBJECT_STORAGE_ACCESS_KEY"),
		ObjectStorageSecretKey:    os.Getenv("OBJECT_STORAGE_SECRET_KEY"),
		ObjectStorageBucket:       os.Getenv("OBJECT_STORAGE_BUCKET"),
		ObjectStorageUsePathStyle: os.Getenv("OBJECT_STORAGE_USE_PATH_STYLE") == "true",
	}

	// Xendit & Resend vars sengaja gak wajib -- payment masih di-defer, dan
	// mailer (lihat internal/mailer) no-op + log kalau RESEND_API_KEY kosong
	// daripada gagalin startup buat fitur yang emang belum wajib di semua env.
	required := map[string]string{
		"WEB_ORIGIN":                cfg.WebOrigin,
		"DATABASE_URL":              cfg.DatabaseURL,
		"REDIS_URL":                 cfg.RedisURL,
		"JWT_ACCESS_SECRET":         cfg.JWTAccessSecret,
		"JWT_REFRESH_SECRET":        cfg.JWTRefreshSecret,
		"OBJECT_STORAGE_ENDPOINT":   cfg.ObjectStorageEndpoint,
		"OBJECT_STORAGE_ACCESS_KEY": cfg.ObjectStorageAccessKey,
		"OBJECT_STORAGE_SECRET_KEY": cfg.ObjectStorageSecretKey,
		"OBJECT_STORAGE_BUCKET":     cfg.ObjectStorageBucket,
	}

	var missing []string
	for k, v := range required {
		if v == "" {
			missing = append(missing, k)
		}
	}
	if len(missing) > 0 {
		sort.Strings(missing)
		return nil, fmt.Errorf("config: missing required env vars: %s", strings.Join(missing, ", "))
	}

	return cfg, nil
}

func (c *Config) WebOrigins() []string {
	parts := strings.Split(c.WebOrigin, ",")
	origins := make([]string, 0, len(parts))
	for _, p := range parts {
		if trimmed := strings.TrimSpace(p); trimmed != "" {
			origins = append(origins, trimmed)
		}
	}
	return origins
}

func getEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}
