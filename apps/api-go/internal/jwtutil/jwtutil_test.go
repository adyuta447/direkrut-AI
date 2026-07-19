package jwtutil

import "testing"

func TestIssueAndVerifyAccessToken(t *testing.T) {
	issuer := NewIssuer("test-secret")

	token, err := issuer.IssueAccessToken("user-1", "hrd", "company-1", "hrduser-1", "")
	if err != nil {
		t.Fatalf("IssueAccessToken: %v", err)
	}

	claims, err := issuer.VerifyAccessToken(token)
	if err != nil {
		t.Fatalf("VerifyAccessToken: %v", err)
	}
	if claims.UserID != "user-1" || claims.Role != "hrd" || claims.CompanyID != "company-1" || claims.HrdUserID != "hrduser-1" {
		t.Fatalf("unexpected claims: %+v", claims)
	}
}

func TestVerifyAccessTokenRejectsWrongSecret(t *testing.T) {
	issued := NewIssuer("secret-a")
	verifier := NewIssuer("secret-b")

	token, err := issued.IssueAccessToken("user-1", "candidate", "", "", "")
	if err != nil {
		t.Fatalf("IssueAccessToken: %v", err)
	}

	if _, err := verifier.VerifyAccessToken(token); err == nil {
		t.Fatal("expected verification to fail with a different secret, got nil error")
	}
}

func TestRefreshTokenHashIsDeterministicAndRawNeverMatchesHash(t *testing.T) {
	raw, hash, err := NewRefreshToken()
	if err != nil {
		t.Fatalf("NewRefreshToken: %v", err)
	}
	if raw == hash {
		t.Fatal("raw refresh token must never equal its own hash")
	}
	if HashRefreshToken(raw) != hash {
		t.Fatal("HashRefreshToken(raw) must match the hash returned by NewRefreshToken")
	}
}
