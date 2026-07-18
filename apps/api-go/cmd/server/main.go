package main

import (
	"context"
	"log"
	"net/http"
	"os/signal"
	"syscall"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"gorm.io/gorm"

	"github.com/adyuta447/direkrut-ai/api-go/internal/auth"
	appcache "github.com/adyuta447/direkrut-ai/api-go/internal/cache"
	"github.com/adyuta447/direkrut-ai/api-go/internal/config"
	appdb "github.com/adyuta447/direkrut-ai/api-go/internal/db"
	"github.com/adyuta447/direkrut-ai/api-go/internal/httpx"
	"github.com/adyuta447/direkrut-ai/api-go/internal/job"
	"github.com/adyuta447/direkrut-ai/api-go/internal/jwtutil"
	appmw "github.com/adyuta447/direkrut-ai/api-go/internal/middleware"
	"github.com/adyuta447/direkrut-ai/api-go/internal/notification"
	"github.com/adyuta447/direkrut-ai/api-go/internal/payment"
	"github.com/adyuta447/direkrut-ai/api-go/internal/storage"
	"github.com/adyuta447/direkrut-ai/api-go/internal/subscription"
)

func main() {
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("config: %v", err)
	}

	gdb, err := appdb.Connect(cfg.DatabaseURL)
	if err != nil {
		log.Fatalf("db: %v", err)
	}

	redisCache, err := appcache.New(cfg.RedisURL)
	if err != nil {
		log.Fatalf("cache: %v", err)
	}

	storageClient, err := storage.New(context.Background(), cfg.ObjectStorageEndpoint,
		cfg.ObjectStorageAccessKey, cfg.ObjectStorageSecretKey, cfg.ObjectStorageBucket, cfg.ObjectStorageUsePathStyle)
	if err != nil {
		log.Fatalf("storage: %v", err)
	}

	issuer := jwtutil.NewIssuer(cfg.JWTAccessSecret)
	requireAuth := appmw.RequireAuth(issuer)
	authRateLimit := appmw.RateLimit(redisCache, "ratelimit:auth", 10, time.Minute)

	authHandler := auth.NewHandler(gdb, issuer, authRateLimit)
	jobHandler := job.NewHandler(gdb, redisCache, storageClient, requireAuth)

	r := chi.NewRouter()
	r.Use(middleware.RequestID)
	r.Use(middleware.RealIP)
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(middleware.Timeout(30 * time.Second))
	r.Use(middleware.Compress(5))
	r.Use(appmw.SecurityHeaders)
	r.Use(appmw.MaxBodyBytes(1 << 20)) // 1MB -- cukup buat JSON, upload file lewat presigned URL langsung ke storage
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{cfg.WebOrigin},
		AllowedMethods:   []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Content-Type", "Authorization"},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	r.Get("/healthz", healthCheck)
	r.Get("/readyz", readyCheck(gdb, redisCache))

	r.Route("/v1", func(v1 chi.Router) {
		v1.Mount("/auth", authHandler.Router())
		v1.Mount("/jobs", jobHandler.Router())
		v1.Mount("/subscriptions", subscription.Router())
		v1.Mount("/payments", payment.Router())
		v1.Mount("/notifications", notification.Router())
	})

	srv := &http.Server{
		Addr:              ":" + cfg.Port,
		Handler:           r,
		ReadHeaderTimeout: 10 * time.Second,
	}

	// Graceful shutdown: tunggu SIGTERM/SIGINT, drain request yang lagi
	// jalan sebelum keluar -- tanpa ini, tiap deploy/autoscale-down bisa
	// motong request di tengah jalan.
	ctx, stop := signal.NotifyContext(context.Background(), syscall.SIGTERM, syscall.SIGINT)
	defer stop()

	go func() {
		log.Printf("api-go listening on :%s", cfg.Port)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("server: %v", err)
		}
	}()

	<-ctx.Done()
	log.Println("shutting down, draining in-flight requests...")

	shutdownCtx, cancel := context.WithTimeout(context.Background(), 15*time.Second)
	defer cancel()
	if err := srv.Shutdown(shutdownCtx); err != nil {
		log.Printf("graceful shutdown failed: %v", err)
	}
}

// healthCheck adalah pure liveness check -- selalu 200 selama proses hidup,
// gak cek dependency apa pun. Buat itu, pakai /readyz.
func healthCheck(w http.ResponseWriter, r *http.Request) {
	httpx.WriteJSON(w, http.StatusOK, map[string]string{"status": "ok", "service": "api-go"})
}

// readyCheck beneran nge-ping Postgres & Redis -- ini yang harus dipoll
// load balancer/orchestrator buat tau instance ini siap nerima traffic
// atau nggak, bukan /healthz.
func readyCheck(gdb *gorm.DB, redisCache *appcache.Cache) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		ctx, cancel := context.WithTimeout(r.Context(), 3*time.Second)
		defer cancel()

		if err := appdb.Ping(ctx, gdb); err != nil {
			httpx.WriteJSON(w, http.StatusServiceUnavailable, map[string]string{"status": "db_unavailable"})
			return
		}
		if err := redisCache.Ping(ctx); err != nil {
			httpx.WriteJSON(w, http.StatusServiceUnavailable, map[string]string{"status": "redis_unavailable"})
			return
		}
		httpx.WriteJSON(w, http.StatusOK, map[string]string{"status": "ready"})
	}
}
