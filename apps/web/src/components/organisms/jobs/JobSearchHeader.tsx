import { Search, MapPin, Clock, Briefcase, DollarSign, X } from "lucide-react";
import { TextFilterField } from "../../atoms/jobs/TextFilterField";
import { SelectFilterField } from "../../atoms/jobs/SelectFilterField";
import { useJobFilters } from "../../../lib/jobs/useJobFilters";

interface JobSearchHeaderProps {
  filters: ReturnType<typeof useJobFilters>;
  resultCount: number;
}

export function JobSearchHeader({
  filters,
  resultCount,
}: JobSearchHeaderProps) {
  return (
    <div className="bg-canvas border-b border-hairline pt-14 pb-10 px-6 lg:px-10">
      <div className="max-w-[1584px] mx-auto">
        <p className="flex items-center gap-3 text-[12px] font-medium text-ink-muted uppercase tracking-[0.2em] mb-6">
          Portal Lowongan
        </p>
        <h1 className="text-[clamp(40px,5vw,68px)] font-light leading-[1.05] tracking-[-0.02em] mb-10 text-ink max-w-3xl">
          Peluang karier selanjutnya buat kamu
        </h1>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            document
              .getElementById("job-results")
              ?.scrollIntoView({ behavior: "smooth" });
          }}
          className="flex flex-col lg:flex-row lg:items-center gap-1 bg-canvas border border-hairline rounded-2xl lg:rounded-full p-2 mb-5 max-w-4xl focus-within:border-primary"
        >
          <TextFilterField
            icon={Search}
            label="Posisi"
            placeholder="Cari posisi atau perusahaan"
            value={filters.searchTerm}
            onChange={filters.setSearchTerm}
            className="flex-1"
          />
          <div className="hidden lg:block w-px h-8 bg-hairline flex-shrink-0" />
          <div className="lg:hidden h-px bg-hairline mx-6" />
          <TextFilterField
            icon={MapPin}
            label="Lokasi"
            placeholder="Kota atau WFH"
            value={filters.locationFilter}
            onChange={filters.setLocationFilter}
            className="flex-1"
          />
          <button
            type="submit"
            className="flex items-center justify-center gap-2 bg-primary text-white rounded-xl lg:rounded-full h-11 lg:h-14 px-9 text-[14px] font-medium hover:bg-primary-strong transition-none flex-shrink-0 mt-1 lg:mt-0"
          >
            <Search className="w-4 h-4" strokeWidth={1.5} />
            Cari
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-2">
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
              className="flex items-center gap-1.5 h-11 px-5 rounded-full border border-hairline text-[13px] text-ink hover:border-primary hover:text-primary transition-none"
            >
              <X className="w-4 h-4" strokeWidth={1.5} />
              Hapus filter
            </button>
          )}
          <p className="text-[14px] text-ink-muted ml-auto">
            <span className="text-ink font-medium">{resultCount}</span> posisi
            lagi buka
          </p>
        </div>
      </div>
    </div>
  );
}
