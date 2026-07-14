"use client";

import { useState, useMemo } from "react";
import { useApp } from "../../context/AppContext";
import { useHrdSearch } from "./HrdSearchContext";
import { getScoreLabel } from "./scoring";
import {
  computeStatCards,
  computeStatusDistribution,
  computeTrendData,
  computeScoreDistribution,
  computePotentialCandidates,
} from "./candidateStats";

const ITEMS_PER_PAGE = 5;

export function useCandidateTable() {
  const { applications, jobs } = useApp();
  const { searchTerm: topbarSearchTerm } = useHrdSearch();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [jobFilter, setJobFilter] = useState("");
  const [scoreFilter, setScoreFilterState] = useState("");
  const [page, setPage] = useState(1);

  const activeSearchTerm = topbarSearchTerm || searchTerm;

  const setScoreFilter = (value: string) => {
    setScoreFilterState(value);
    setPage(1); // Reset page on filter
  };

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.applicantName.toLowerCase().includes(activeSearchTerm.toLowerCase()) ||
      app.jobTitle.toLowerCase().includes(activeSearchTerm.toLowerCase());
    const matchesStatus = !statusFilter || app.status === statusFilter;
    const matchesJob = !jobFilter || app.jobId === jobFilter;
    const scoreLabel = getScoreLabel(app.recommendationScore).label;
    const matchesScore = !scoreFilter || scoreLabel === scoreFilter;
    return matchesSearch && matchesStatus && matchesJob && matchesScore;
  });

  const totalPages = Math.ceil(filteredApplications.length / ITEMS_PER_PAGE);
  const paginatedApplications = filteredApplications.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const potentialCandidates = useMemo(() => computePotentialCandidates(applications), [applications]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const trendData = useMemo(() => computeTrendData(applications), [applications.length]);

  return {
    jobs,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    jobFilter,
    setJobFilter,
    scoreFilter,
    setScoreFilter,
    page,
    setPage,
    totalPages,
    itemsPerPage: ITEMS_PER_PAGE,
    filteredApplications,
    paginatedApplications,
    potentialCandidates,
    trendData,
    statCards: computeStatCards(applications),
    statusDistribution: computeStatusDistribution(applications),
    scoreDistributionData: computeScoreDistribution(applications),
  };
}
