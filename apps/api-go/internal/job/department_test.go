package job

import (
	"context"
	"testing"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func TestRenameDepartmentJobsIsScopedToCompany(t *testing.T) {
	gdb, err := gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
	if err != nil {
		t.Fatalf("open sqlite: %v", err)
	}
	sqlDB, err := gdb.DB()
	if err != nil {
		t.Fatalf("get sql db: %v", err)
	}
	sqlDB.SetMaxOpenConns(1)

	if err := gdb.Exec(`
		CREATE TABLE jobs (
			id TEXT PRIMARY KEY,
			company_id TEXT NOT NULL,
			department TEXT NOT NULL,
			updated_at DATETIME
		)
	`).Error; err != nil {
		t.Fatalf("create jobs table: %v", err)
	}
	for _, row := range []struct {
		id         string
		companyID  string
		department string
	}{
		{id: "job-a", companyID: "company-1", department: "Engineering"},
		{id: "job-b", companyID: "company-1", department: "Engineering"},
		{id: "job-c", companyID: "company-2", department: "Engineering"},
		{id: "job-d", companyID: "company-1", department: "Product"},
	} {
		if err := gdb.Exec(
			"INSERT INTO jobs (id, company_id, department) VALUES (?, ?, ?)",
			row.id,
			row.companyID,
			row.department,
		).Error; err != nil {
			t.Fatalf("insert %s: %v", row.id, err)
		}
	}

	jobIDs, err := renameDepartmentJobs(
		context.Background(),
		gdb,
		"company-1",
		"Engineering",
		"Technology",
	)
	if err != nil {
		t.Fatalf("rename department: %v", err)
	}
	if len(jobIDs) != 2 {
		t.Fatalf("updated IDs = %v, want 2 jobs", jobIDs)
	}

	var rows []struct {
		ID         string
		Department string
	}
	if err := gdb.Table("jobs").Order("id").Find(&rows).Error; err != nil {
		t.Fatalf("read jobs: %v", err)
	}
	want := map[string]string{
		"job-a": "Technology",
		"job-b": "Technology",
		"job-c": "Engineering",
		"job-d": "Product",
	}
	for _, row := range rows {
		if row.Department != want[row.ID] {
			t.Errorf("%s department = %q, want %q", row.ID, row.Department, want[row.ID])
		}
	}
}
