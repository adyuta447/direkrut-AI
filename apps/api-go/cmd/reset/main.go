package main

import (
	"fmt"
	"log"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func main() {
	dbURL := "postgres://direkrut:direkrut@127.0.0.1:5433/direkrut_ai?sslmode=disable"
	db, err := gorm.Open(postgres.Open(dbURL), &gorm.Config{})
	if err != nil {
		log.Fatalf("Gagal konek DB: %v", err)
	}

	fmt.Println("Resetting applications table...")
	// We delete from assessment_items, assessments, notification to avoid foreign key issues
	db.Exec("DELETE FROM assessment_items")
	db.Exec("DELETE FROM assessments")
	db.Exec("DELETE FROM notifications WHERE type IN ('application_status', 'application_email')")
	db.Exec("DELETE FROM application_status_history")
	db.Exec("DELETE FROM cv_parse_results")
	db.Exec("DELETE FROM scoring_results")
	db.Exec("DELETE FROM applications")

	fmt.Println("Reset done.")
}
