"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { SiteHeader } from "../../components/organisms/shared/SiteHeader";
import { SiteFooter } from "../../components/organisms/shared/SiteFooter";
import { CtaBanner } from "../../components/organisms/landing/CtaBanner";
import { CompanyCard, CompanySummary } from "../../components/molecules/companies/CompanyCard";
import { FooterRevealBody } from "../../components/atoms/shared/FooterRevealBody";

export default function CompaniesPage() {
  const { jobs } = useApp();
  const [searchTerm, setSearchTerm] = useState("");

  const companies = useMemo<CompanySummary[]>(() => {
    const byName = new Map<string, CompanySummary>();
    for (const job of jobs) {
      const entry = byName.get(job.company) ?? {
        name: job.company,
        jobCount: 0,
        industries: [],
        locations: [],
      };
      entry.jobCount += 1;
      if (!entry.industries.includes(job.industry)) entry.industries.push(job.industry);
      if (!entry.locations.includes(job.location)) entry.locations.push(job.location);
      byName.set(job.company, entry);
    }
    return [...byName.values()].sort((a, b) => b.jobCount - a.jobCount);
  }, [jobs]);

  const filteredCompanies = companies.filter((company) =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-canvas text-ink font-sans overflow-x-clip">
      <FooterRevealBody>
      <SiteHeader />

      <section className="pt-14 pb-10 px-6 lg:px-10 max-w-[1584px] mx-auto border-b border-hairline">
        <p className="flex items-center gap-3 text-[12px] font-medium text-ink-muted uppercase tracking-[0.2em] mb-6">
          Direktori Perusahaan
        </p>
        <h1 className="text-[clamp(40px,5vw,68px)] font-light leading-[1.05] tracking-[-0.02em] mb-6 text-ink max-w-3xl">
          Kenalan dulu sama calon tempat kerjamu
        </h1>
        <p className="text-[17px] text-ink-muted leading-[1.6] max-w-2xl mb-10">
          Cek profil mitra kami, dari bidang industri, lokasi kerja, sampai semua lowongan yang
          lagi buka. Biar kamu nggak salah pilih tempat berkarier.
        </p>

        <label className="flex items-center max-w-xl bg-canvas border border-hairline rounded-full px-6 py-4 focus-within:border-primary">
          <Search className="w-5 h-5 text-ink-muted flex-shrink-0" strokeWidth={1.5} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nama perusahaan..."
            className="w-full bg-transparent pl-3 text-[15px] text-ink placeholder-ink-muted focus:outline-none"
          />
        </label>
        <p className="text-[14px] text-ink-muted mt-4">
          <span className="text-ink font-medium">{filteredCompanies.length}</span> perusahaan siap kamu eksplor
        </p>
      </section>

      <section className="py-16 px-6 lg:px-10 max-w-[1584px] mx-auto">
        {filteredCompanies.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCompanies.map((company) => (
              <CompanyCard key={company.name} company={company} />
            ))}
          </div>
        ) : (
          <div className="py-24 text-center rounded-[32px] bg-surface-1">
            <p className="text-[24px] font-light text-ink mb-4">
              Perusahaan yang kamu cari belum ada di sini
            </p>
            <button onClick={() => setSearchTerm("")} className="btn-primary">
              Hapus Pencarian
            </button>
          </div>
        )}
      </section>

      <CtaBanner />
      </FooterRevealBody>
      <SiteFooter />
    </div>
  );
}
