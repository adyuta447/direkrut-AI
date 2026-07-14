export interface SkillMatch {
  skill: string;
  matchLevel: "Tinggi" | "Menengah" | "Rendah";
  evidence: string;
}

export interface GapAnalysisResult {
  matches: SkillMatch[];
  overallAssessment: string;
  recommendations: string[];
}
