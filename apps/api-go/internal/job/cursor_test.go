package job

import (
	"testing"
	"time"
)

func TestCursorRoundTrip(t *testing.T) {
	want := time.Date(2026, 1, 15, 10, 30, 0, 123456789, time.UTC)
	wantID := "job-abc-123"

	encoded := encodeCursor(want, wantID)

	gotTime, gotID, err := decodeCursor(encoded)
	if err != nil {
		t.Fatalf("decodeCursor: %v", err)
	}
	if !gotTime.Equal(want) {
		t.Fatalf("time mismatch: got %v, want %v", gotTime, want)
	}
	if gotID != wantID {
		t.Fatalf("id mismatch: got %q, want %q", gotID, wantID)
	}
}

func TestDecodeCursorRejectsGarbage(t *testing.T) {
	if _, _, err := decodeCursor("not-valid-base64!!!"); err == nil {
		t.Fatal("expected an error decoding garbage input, got nil")
	}
	if _, _, err := decodeCursor("bm8tdW5kZXJzY29yZS1oZXJl"); err == nil {
		t.Fatal("expected an error for a cursor with no underscore separator, got nil")
	}
}
