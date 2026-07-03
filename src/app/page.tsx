"use client";

import { useApp } from "../context/AppContext";
import { SiteHeader } from "../components/organisms/shared/SiteHeader";
import { SiteFooter } from "../components/organisms/shared/SiteFooter";
import { HeroSection } from "../components/organisms/landing/HeroSection";
import { StatsSection } from "../components/organisms/landing/StatsSection";
import { FeaturesSection } from "../components/organisms/landing/FeaturesSection";
import { FeaturedJobsSection } from "../components/organisms/landing/FeaturedJobsSection";
import { CtaBanner } from "../components/organisms/landing/CtaBanner";

export default function HomePage() {
  const { jobs } = useApp();

  return (
    <div className="min-h-screen bg-canvas text-ink font-sans overflow-x-hidden">
      <SiteHeader
        contactLabel="Hubungi Kami"
        jobsLabel="Cari Lowongan"
        otherLabels={["Cari Profil", "Sumber Daya Karir", "Perusahaan", "Komunitas"]}
        registerLabel="Mendaftar"
      />
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <FeaturedJobsSection jobs={jobs} />
      <CtaBanner />
      <SiteFooter />
    </div>
  );
}
