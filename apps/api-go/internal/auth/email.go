package auth

import (
	"errors"
	"strings"
)

var errSuspiciousEmailDomain = errors.New("auth: suspicious email domain")

func normalizeEmail(raw string) (string, error) {
	email := strings.ToLower(strings.TrimSpace(raw))
	at := strings.LastIndexByte(email, '@')
	if at < 1 || at == len(email)-1 {
		return "", errSuspiciousEmailDomain
	}

	domain := email[at+1:]
	dot := strings.LastIndexByte(domain, '.')
	if dot < 1 || dot == len(domain)-1 {
		return "", errSuspiciousEmailDomain
	}

	// ponytail: ASCII TLD only; add IDN/punycode support when product needs it.
	for _, r := range domain[dot+1:] {
		if r < 'a' || r > 'z' {
			return "", errSuspiciousEmailDomain
		}
	}
	return email, nil
}
