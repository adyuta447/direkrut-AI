package main

import (
	"log"
	"net/http"
	"os"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"

	"github.com/adyuta447/direkrut-ai/api-go/internal/auth"
	"github.com/adyuta447/direkrut-ai/api-go/internal/job"
	"github.com/adyuta447/direkrut-ai/api-go/internal/notification"
	"github.com/adyuta447/direkrut-ai/api-go/internal/payment"
	"github.com/adyuta447/direkrut-ai/api-go/internal/subscription"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	r := chi.NewRouter()
	r.Use(middleware.RequestID)
	r.Use(middleware.RealIP)
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(middleware.Timeout(30 * time.Second))
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{os.Getenv("WEB_ORIGIN")},
		AllowedMethods:   []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Content-Type", "Authorization"},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	r.Get("/healthz", healthCheck)

	r.Route("/v1", func(v1 chi.Router) {
		v1.Mount("/auth", auth.Router())
		v1.Mount("/jobs", job.Router())
		v1.Mount("/subscriptions", subscription.Router())
		v1.Mount("/payments", payment.Router())
		v1.Mount("/notifications", notification.Router())
	})

	log.Printf("api-go listening on :%s", port)
	if err := http.ListenAndServe(":"+port, r); err != nil {
		log.Fatal(err)
	}
}

func healthCheck(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	_, _ = w.Write([]byte(`{"status":"ok","service":"api-go"}`))
}
