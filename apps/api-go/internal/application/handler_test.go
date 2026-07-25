package application

import "testing"

func TestShouldMoveToReviewAfterAIInterview(t *testing.T) {
	t.Parallel()

	tests := []struct {
		name   string
		status string
		want   bool
	}{
		{name: "new application", status: "submitted", want: true},
		{name: "legacy screened application", status: "screened", want: true},
		{name: "already under review", status: "under-review", want: false},
		{name: "technical interview", status: "interview", want: false},
		{name: "accepted is final", status: "accepted", want: false},
		{name: "rejected is final", status: "rejected", want: false},
	}

	for _, tt := range tests {
		tt := tt
		t.Run(tt.name, func(t *testing.T) {
			t.Parallel()
			if got := shouldMoveToReviewAfterAIInterview(tt.status); got != tt.want {
				t.Fatalf("shouldMoveToReviewAfterAIInterview(%q) = %v, want %v", tt.status, got, tt.want)
			}
		})
	}
}
