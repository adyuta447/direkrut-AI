package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"time"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"

	"github.com/adyuta447/direkrut-ai/api-go/internal/aiengine"
	"github.com/adyuta447/direkrut-ai/api-go/internal/application"
	appdb "github.com/adyuta447/direkrut-ai/api-go/internal/db"
)

// One-off repair for a single application stuck by the nil-slice bug
// (now fixed in internal/aiengine/client.go): the ai_interview assessment
// stuck at status=in_progress, and/or a missing scoring_results row.
func main() {
	applicationID := os.Getenv("REPAIR_APPLICATION_ID")
	if applicationID == "" {
		log.Fatal("set REPAIR_APPLICATION_ID")
	}

	gdb, err := gorm.Open(postgres.Open(os.Getenv("DATABASE_URL")), &gorm.Config{})
	if err != nil {
		log.Fatal(err)
	}
	client := aiengine.NewClient(os.Getenv("AI_ENGINE_BASE_URL"), os.Getenv("INTERNAL_API_KEY"))

	// --- Interview (ai_interview assessment) repair ---
	var assessment appdb.Assessment
	if err := gdb.Where("application_id = ? AND track_type = ?", applicationID, "ai_interview").First(&assessment).Error; err != nil {
		log.Fatal("assessment not found: ", err)
	}
	if assessment.Status == "completed" {
		fmt.Println("assessment already completed, skipping interview repair")
	} else {
		var items []appdb.AssessmentItem
		gdb.Where("assessment_id = ?", assessment.ID).Order("order_index ASC").Find(&items)
		if len(items) == 0 {
			log.Fatal("no items found")
		}

		var appRow appdb.Application
		if err := gdb.Preload("Job").First(&appRow, "id = ?", applicationID).Error; err != nil {
			log.Fatal("application not found: ", err)
		}

		responses := make([]aiengine.ValidationAnswer, 0, len(items))
		for _, it := range items {
			answer := ""
			if it.CandidateAnswer != nil {
				answer = *it.CandidateAnswer
			}
			responses = append(responses, aiengine.ValidationAnswer{Question: it.QuestionText, Answer: answer})
		}

		var competencies []string
		if appRow.Job != nil {
			if appRow.Job.RequiredSkills != nil {
				var reqSkills []string
				if err := json.Unmarshal([]byte(*appRow.Job.RequiredSkills), &reqSkills); err == nil {
					competencies = append(competencies, reqSkills...)
				}
			}
			if appRow.Job.PreferredSkills != nil {
				var prefSkills []string
				if err := json.Unmarshal([]byte(*appRow.Job.PreferredSkills), &prefSkills); err == nil {
					competencies = append(competencies, prefSkills...)
				}
			}
		}

		scoreResp, err := client.ScoreValidation(context.Background(), aiengine.ScoreValidationRequest{
			ApplicationID: applicationID,
			Responses:     responses,
			Competencies:  competencies,
		})
		if err != nil {
			log.Fatal("score validation failed: ", err)
		}

		compScoresJSON, _ := json.Marshal(scoreResp.CompetencyScores)
		now := time.Now()
		if err := gdb.Model(&assessment).Updates(map[string]any{
			"score":               scoreResp.RecommendationScore,
			"status":              "completed",
			"completed_at":        now,
			"competency_scores":   string(compScoresJSON),
			"evidence_confidence": scoreResp.EvidenceConfidence,
		}).Error; err != nil {
			log.Fatal("update failed: ", err)
		}

		fmt.Printf("repaired assessment %s for application %s: score=%.2f evidence_confidence=%s\n",
			assessment.ID, applicationID, scoreResp.RecommendationScore, scoreResp.EvidenceConfidence)
	}

	// --- Screening (CV match score) repair: same root cause, separate table ---
	var existingScore appdb.ScoringResult
	if err := gdb.Where("application_id = ?", applicationID).First(&existingScore).Error; err == nil {
		fmt.Println("scoring_results already exists, skipping screening repair")
		return
	}

	var appForScreen appdb.Application
	if err := gdb.Preload("Job.Company").Preload("Candidate").First(&appForScreen, "id = ?", applicationID).Error; err != nil {
		log.Fatal("reload application for screening failed: ", err)
	}

	appHandler := application.NewHandler(gdb, nil, nil, client, nil, nil)
	if _, err := appHandler.RunScreeningRepair(context.Background(), &appForScreen, false); err != nil {
		log.Fatal("screening repair failed: ", err)
	}
	fmt.Println("repaired scoring_results for application", applicationID)
}
