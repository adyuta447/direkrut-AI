package application

import (
	"context"

	appdb "github.com/adyuta447/direkrut-ai/api-go/internal/db"
)

// RunScreeningRepair: temporary exported wrapper so a one-off cmd/ repair
// script can call the real runScreening logic without duplicating it.
// Delete this file once the repair run is done.
func (h *Handler) RunScreeningRepair(ctx context.Context, appRow *appdb.Application, force bool) (*screeningResponse, error) {
	return h.runScreening(ctx, appRow, force)
}
