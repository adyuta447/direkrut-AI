package httpx

import (
	"errors"
	"testing"

	"github.com/go-playground/validator/v10"
)

type testRegisterRequest struct {
	Email    string `validate:"required,email"`
	Password string `validate:"required,min=8"`
}

func TestValidationMessage_FriendlyText(t *testing.T) {
	v := validator.New()
	err := v.Struct(testRegisterRequest{Email: "not-an-email", Password: "short"})
	if err == nil {
		t.Fatal("expected validation error")
	}

	msg := ValidationMessage(err)
	if msg == err.Error() {
		t.Fatalf("expected friendly message, got raw validator error: %q", msg)
	}
	want := "Email harus berupa email yang valid; Kata sandi minimal 8 karakter"
	if msg != want {
		t.Errorf("ValidationMessage() = %q, want %q", msg, want)
	}
}

func TestValidationMessage_NonValidatorError(t *testing.T) {
	err := errors.New("request body gak valid")
	if got := ValidationMessage(err); got != err.Error() {
		t.Errorf("ValidationMessage() = %q, want passthrough %q", got, err.Error())
	}
}
