package jwtutil

import (
	"crypto/rand"
	"crypto/sha256"
	"encoding/hex"
	"errors"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

const (
	AccessTokenTTL  = 15 * time.Minute
	RefreshTokenTTL = 7 * 24 * time.Hour
)

type Claims struct {
	UserID    string `json:"sub"`
	Role      string `json:"role"`
	CompanyID string `json:"company_id,omitempty"`
	HrdUserID string `json:"hrd_user_id,omitempty"`
	jwt.RegisteredClaims
}

type Issuer struct {
	accessSecret []byte
}

func NewIssuer(accessSecret string) *Issuer {
	return &Issuer{accessSecret: []byte(accessSecret)}
}

func (i *Issuer) IssueAccessToken(userID, role, companyID, hrdUserID string) (string, error) {
	now := time.Now()
	claims := Claims{
		UserID:    userID,
		Role:      role,
		CompanyID: companyID,
		HrdUserID: hrdUserID,
		RegisteredClaims: jwt.RegisteredClaims{
			IssuedAt:  jwt.NewNumericDate(now),
			ExpiresAt: jwt.NewNumericDate(now.Add(AccessTokenTTL)),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(i.accessSecret)
}

func (i *Issuer) VerifyAccessToken(tokenStr string) (*Claims, error) {
	claims := &Claims{}
	token, err := jwt.ParseWithClaims(tokenStr, claims, func(t *jwt.Token) (any, error) {
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("jwtutil: unexpected signing method")
		}
		return i.accessSecret, nil
	})
	if err != nil || !token.Valid {
		return nil, errors.New("jwtutil: invalid access token")
	}
	return claims, nil
}

func NewRefreshToken() (raw string, hash string, err error) {
	b := make([]byte, 32)
	if _, err = rand.Read(b); err != nil {
		return "", "", err
	}
	raw = hex.EncodeToString(b)
	return raw, HashRefreshToken(raw), nil
}

func HashRefreshToken(raw string) string {
	sum := sha256.Sum256([]byte(raw))
	return hex.EncodeToString(sum[:])
}
