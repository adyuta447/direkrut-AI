"use client";

import { useState } from "react";
import { useApp } from "../../context/AppContext";
import { generateGapAnalysis, GapAnalysisResult } from "./gapAnalysisMocks";

export function useGapAnalysis() {
  const { applications } = useApp();
  const [selectedCandidate, setSelectedCandidate] = useState("");
  const [analysis, setAnalysis] = useState<GapAnalysisResult | null>(null);

  const selectCandidate = (id: string) => {
    setSelectedCandidate(id);
    setAnalysis(null);
  };

  const handleAnalyze = () => {
    if (!selectedCandidate) return;
    const candidate = applications.find((app) => app.id === selectedCandidate);
    if (!candidate) return;
    setAnalysis(generateGapAnalysis(candidate));
  };

  return { applications, selectedCandidate, selectCandidate, analysis, handleAnalyze };
}
