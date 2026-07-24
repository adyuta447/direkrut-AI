package main

import (
	"context"
	"fmt"
	"log"

	"direkrut-api/internal/aiengine"
	"direkrut-api/internal/application"
	"direkrut-api/internal/config"
	"direkrut-api/internal/db"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func main() {
	cfg := config.Load()
	gormDB, err := gorm.Open(postgres.Open(cfg.DatabaseURL), &gorm.Config{})
	if err != nil {
		log.Fatal(err)
	}
	aiClient := aiengine.NewClient(cfg.AIEngineURL, cfg.AIEngineAPIKey)
	
	// Create application handler just to call runScreening
    // But runScreening is a private method `runScreening(ctx, appRow, force)`.
    // It's easier to just issue a HTTP request.
}
