"use client";

import { useState, useMemo } from "react";
import { useApp } from "../../context/AppContext";
import { computeCrossRoleList } from "./crossRoleRecommendations";

const ITEMS_PER_PAGE = 5;

export function useCrossRoleRecommendations() {
  const { applications, jobs } = useApp();
  const [searchTermState, setSearchTermState] = useState("");
  const [page, setPage] = useState(1);
  const [expandedRecId, setExpandedRecId] = useState<string | null>(null);

  const crossRoleList = useMemo(() => computeCrossRoleList(applications, jobs), [applications, jobs]);

  const setSearchTerm = (value: string) => {
    setSearchTermState(value);
    setPage(1);
  };

  // Filter based on search term
  const filteredList = crossRoleList.filter(
    (item) =>
      item.candidateName.toLowerCase().includes(searchTermState.toLowerCase()) ||
      item.suggestedRole.toLowerCase().includes(searchTermState.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredList.length / ITEMS_PER_PAGE);
  const paginatedList = filteredList.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const toggleExpand = (id: string) => setExpandedRecId((prev) => (prev === id ? null : id));

  return {
    searchTerm: searchTermState,
    setSearchTerm,
    page,
    setPage,
    totalPages,
    itemsPerPage: ITEMS_PER_PAGE,
    filteredList,
    paginatedList,
    expandedRecId,
    toggleExpand,
  };
}
