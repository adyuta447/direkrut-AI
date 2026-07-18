package db

import (
	"context"
	"fmt"
	"time"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

func Connect(databaseURL string) (*gorm.DB, error) {
	gdb, err := gorm.Open(postgres.Open(databaseURL), &gorm.Config{
		PrepareStmt:    true,
		TranslateError: true, // biar unique-violation dsb muncul sbg gorm.ErrDuplicatedKey, bukan pgconn error mentah
		Logger:         logger.Default.LogMode(logger.Warn),
	})
	if err != nil {
		return nil, fmt.Errorf("db: connect: %w", err)
	}

	sqlDB, err := gdb.DB()
	if err != nil {
		return nil, fmt.Errorf("db: underlying sql.DB: %w", err)
	}
	sqlDB.SetMaxOpenConns(20)
	sqlDB.SetMaxIdleConns(10)
	sqlDB.SetConnMaxLifetime(30 * time.Minute)

	return gdb, nil
}

func Ping(ctx context.Context, gdb *gorm.DB) error {
	sqlDB, err := gdb.DB()
	if err != nil {
		return err
	}
	return sqlDB.PingContext(ctx)
}
