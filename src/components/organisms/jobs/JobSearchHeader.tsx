import { Search, MapPin, Clock, Briefcase, DollarSign, X } from "lucide-react";
import { TextFilterField } from "../../atoms/jobs/TextFilterField";
import { SelectFilterField } from "../../atoms/jobs/SelectFilterField";
import { useJobFilters } from "../../../lib/jobs/useJobFilters";

interface JobSearchHeaderProps {
  filters: ReturnType<typeof useJobFilters>;
  resultCount: number;
}

export function JobSearchHeader({ filters, resultCount }: JobSearchHeaderProps) {
  return (
    <div className="bg-canvas border-b border-hairline pt-12 pb-8 px-6 lg:px-10">
      <div className="max-w-[1584px] mx-auto">
        <h1 className="text-[42px] font-light leading-[1.2] mb-6 text-ink">
          Temukan peluang karir Anda selanjutnya
        </h1>

        <div className="flex flex-wrap gap-4 items-center">
          <TextFilterField
            icon={Search}
            placeholder="Cari posisi atau perusahaan..."
            value={filters.searchTerm}
            onChange={filters.setSearchTerm}
          />
          <TextFilterField
            icon={MapPin}
            placeholder="Tempat Kerja (Kota/WFH)"
            value={filters.locationFilter}
            onChange={filters.setLocationFilter}
            wrapperClassName="relative min-w-[200px]"
          />
          <SelectFilterField
            icon={Clock}
            value={filters.typeFilter}
            onChange={filters.setTypeFilter}
            placeholderOption="Jenis Pekerjaan"
            options={filters.uniqueTypes}
          />
          <SelectFilterField
            icon={Briefcase}
            value={filters.industryFilter}
            onChange={filters.setIndustryFilter}
            placeholderOption="Semua Bidang"
            options={filters.uniqueIndustries}
          />
          <SelectFilterField
            icon={DollarSign}
            value={filters.salaryFilter}
            onChange={filters.setSalaryFilter}
            placeholderOption="Rentang Gaji"
            options={filters.uniqueSalaries}
          />
          {filters.hasFilters && (
            <button
              onClick={filters.clearFilters}
              className="flex items-center gap-2 text-[14px] text-primary hover:underline px-4 transition-none"
            >
              <X className="w-4 h-4" />
              Hapus filter
            </button>
          )}
        </div>
        <p className="text-[14px] text-ink-muted mt-4">{resultCount} posisi tersedia</p>
      </div>
    </div>
  );
}
