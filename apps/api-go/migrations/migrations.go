package migrations

import (
	"database/sql"
	"embed"
	"errors"
	"fmt"
	"log"

	"github.com/golang-migrate/migrate/v4"
	"github.com/golang-migrate/migrate/v4/database/postgres"
	"github.com/golang-migrate/migrate/v4/source/iofs"
)

//go:embed *.sql
var fs embed.FS

// RunAutoMigrate runs all embedded SQL migrations against the provided database.
func RunAutoMigrate(db *sql.DB) error {
	sourceDriver, err := iofs.New(fs, ".")
	if err != nil {
		return fmt.Errorf("failed to create migration source driver: %w", err)
	}

	dbDriver, err := postgres.WithInstance(db, &postgres.Config{})
	if err != nil {
		return fmt.Errorf("failed to create migration database driver: %w", err)
	}

	m, err := migrate.NewWithInstance(
		"iofs",
		sourceDriver,
		"postgres",
		dbDriver,
	)
	if err != nil {
		return fmt.Errorf("failed to initialize migrate instance: %w", err)
	}

	log.Println("Running database migrations...")
	if err := m.Up(); err != nil {
		if errors.Is(err, migrate.ErrNoChange) {
			log.Println("Database migrations are already up to date.")
			return nil
		}
		return fmt.Errorf("migration failed: %w", err)
	}

	log.Println("Database migrations completed successfully.")
	return nil
}
