// Package middleware berisi middleware lintas-domain: auth JWT, RBAC,
// security header, batas ukuran body, dan rate limiter berbasis Redis.
package middleware

import (
	"context"
	"net"
	"net/http"
	"time"

	"github.com/adyuta447/direkrut-ai/api-go/internal/cache"
	"github.com/adyuta447/direkrut-ai/api-go/internal/httpx"
	"github.com/adyuta447/direkrut-ai/api-go/internal/jwtutil"
)

type ctxKey string

const claimsCtxKey ctxKey = "claims"

// RequireAuth memverifikasi Bearer access token dan menaruh klaimnya di
// context request, buat dipakai handler/middleware berikutnya (mis.
// RequireRole, atau ownership check di internal/job).
func RequireAuth(issuer *jwtutil.Issuer) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			const prefix = "Bearer "
			authHeader := r.Header.Get("Authorization")
			if len(authHeader) <= len(prefix) || authHeader[:len(prefix)] != prefix {
				httpx.WriteError(w, http.StatusUnauthorized, "unauthorized", "missing or malformed Authorization header")
				return
			}
			claims, err := issuer.VerifyAccessToken(authHeader[len(prefix):])
			if err != nil {
				httpx.WriteError(w, http.StatusUnauthorized, "unauthorized", "invalid or expired token")
				return
			}
			ctx := context.WithValue(r.Context(), claimsCtxKey, claims)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}

func ClaimsFromContext(ctx context.Context) (*jwtutil.Claims, bool) {
	claims, ok := ctx.Value(claimsCtxKey).(*jwtutil.Claims)
	return claims, ok
}

// RequireRole harus dipasang SETELAH RequireAuth di chain.
func RequireRole(roles ...string) func(http.Handler) http.Handler {
	allowed := make(map[string]struct{}, len(roles))
	for _, r := range roles {
		allowed[r] = struct{}{}
	}
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			claims, ok := ClaimsFromContext(r.Context())
			if !ok {
				httpx.WriteError(w, http.StatusUnauthorized, "unauthorized", "missing auth context")
				return
			}
			if _, ok := allowed[claims.Role]; !ok {
				httpx.WriteError(w, http.StatusForbidden, "forbidden", "insufficient role for this action")
				return
			}
			next.ServeHTTP(w, r)
		})
	}
}

func SecurityHeaders(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("X-Content-Type-Options", "nosniff")
		w.Header().Set("X-Frame-Options", "DENY")
		w.Header().Set("Referrer-Policy", "strict-origin-when-cross-origin")
		next.ServeHTTP(w, r)
	})
}

// MaxBodyBytes membatasi ukuran body request -- pertahanan murah terhadap
// body raksasa yang sengaja/gak sengaja bikin handler kehabisan memory.
func MaxBodyBytes(n int64) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			r.Body = http.MaxBytesReader(w, r.Body, n)
			next.ServeHTTP(w, r)
		})
	}
}

// RateLimit membatasi request per-IP dalam satu window waktu, disimpan di
// Redis (bukan in-memory) biar konsisten lintas replica begitu di-scale
// horizontal. Dipakai ketat di /auth/login & /auth/register buat
// menghambat brute-force/credential-stuffing.
func RateLimit(c *cache.Cache, keyPrefix string, limit int64, window time.Duration) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			key := keyPrefix + ":" + clientIP(r)
			n, err := c.IncrWithExpiry(r.Context(), key, window)
			if err == nil && n > limit {
				httpx.WriteError(w, http.StatusTooManyRequests, "rate_limited", "too many requests, coba lagi sebentar lagi")
				return
			}
			next.ServeHTTP(w, r)
		})
	}
}

// clientIP mengasumsikan chi middleware.RealIP sudah jalan lebih dulu di
// chain (sudah dipasang di cmd/server/main.go), jadi r.RemoteAddr di sini
// udah IP asli klien, bukan IP load balancer/proxy.
func clientIP(r *http.Request) string {
	host, _, err := net.SplitHostPort(r.RemoteAddr)
	if err != nil {
		return r.RemoteAddr
	}
	return host
}
