package httpx

import (
	"errors"
	"fmt"
	"reflect"
	"strings"

	"github.com/go-playground/validator/v10"
)

var fieldLabels = map[string]string{
	"Name":            "Nama",
	"Email":           "Email",
	"Password":        "Kata sandi",
	"NewPassword":     "Kata sandi baru",
	"CurrentPassword": "Kata sandi saat ini",
	"NewEmail":        "Email baru",
	"Token":           "Token",
	"Role":            "Role",
	"CompanyName":     "Nama perusahaan",
	"RefreshToken":    "Refresh token",
	"JobID":           "Lowongan",
	"Title":           "Judul",
	"Description":     "Deskripsi",
	"EmploymentType":  "Tipe pekerjaan",
	"Status":          "Status",
	"Note":            "Catatan",
}

func ValidationMessage(err error) string {
	var verrs validator.ValidationErrors
	if !errors.As(err, &verrs) {
		return err.Error()
	}

	messages := make([]string, 0, len(verrs))
	for _, fe := range verrs {
		messages = append(messages, fmt.Sprintf("%s %s", fieldLabel(fe.Field()), tagMessage(fe)))
	}
	return strings.Join(messages, "; ")
}

func fieldLabel(field string) string {
	if label, ok := fieldLabels[field]; ok {
		return label
	}
	var b strings.Builder
	for i, r := range field {
		if i > 0 && r >= 'A' && r <= 'Z' {
			b.WriteByte(' ')
		}
		b.WriteRune(r)
	}
	return b.String()
}

func tagMessage(fe validator.FieldError) string {
	switch fe.Tag() {
	case "required", "required_if":
		return "wajib diisi"
	case "email":
		return "harus berupa email yang valid"
	case "min":
		if fe.Kind() == reflect.String {
			return fmt.Sprintf("minimal %s karakter", fe.Param())
		}
		return fmt.Sprintf("minimal %s", fe.Param())
	case "max":
		if fe.Kind() == reflect.String {
			return fmt.Sprintf("maksimal %s karakter", fe.Param())
		}
		return fmt.Sprintf("maksimal %s", fe.Param())
	case "oneof":
		return fmt.Sprintf("harus salah satu dari: %s", fe.Param())
	default:
		return "tidak valid"
	}
}
