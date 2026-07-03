"use client";

import { useCrossRoleRecommendations } from "../../../lib/hrd/useCrossRoleRecommendations";
import { CrossRoleIntro } from "../../../components/molecules/hrd/CrossRoleIntro";
import { CrossRoleSearchBar } from "../../../components/molecules/hrd/CrossRoleSearchBar";
import { CrossRoleTable } from "../../../components/organisms/hrd/CrossRoleTable";

export default function CrossRolePage() {
  const cr = useCrossRoleRecommendations();

  return (
    <div className="p-6 lg:p-8 space-y-6 font-sans bg-canvas min-h-full">
      <CrossRoleIntro />

      <CrossRoleSearchBar searchTerm={cr.searchTerm} onSearchTermChange={cr.setSearchTerm} />

      <CrossRoleTable
        items={cr.paginatedList}
        filteredCount={cr.filteredList.length}
        page={cr.page}
        totalPages={cr.totalPages}
        itemsPerPage={cr.itemsPerPage}
        onPageChange={cr.setPage}
        expandedRecId={cr.expandedRecId}
        onToggleExpand={cr.toggleExpand}
      />
    </div>
  );
}
