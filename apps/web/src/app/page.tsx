"use client";

import { useDashboard } from "../context/DashboardContext";
import { useLandingAnimations } from "../lib/shared/useLandingAnimations";
import { SiteHeader } from "../components/organisms/shared/SiteHeader";
import { SiteFooter } from "../components/organisms/shared/SiteFooter";
import { HeroSection } from "../components/organisms/landing/HeroSection";
import { TrustedMarquee } from "../components/organisms/landing/TrustedMarquee";
import { StatsSection } from "../components/organisms/landing/StatsSection";
import { HowItWorksSection } from "../components/organisms/landing/HowItWorksSection";
import { FeaturesSection } from "../components/organisms/landing/FeaturesSection";
import { FeaturedJobsSection } from "../components/organisms/landing/FeaturedJobsSection";
import { CtaBanner } from "../components/organisms/landing/CtaBanner";

export default function HomePage() {
  const { jobs } = useDashboard();
  useLandingAnimations();

  return (
    <div className="min-h-screen bg-canvas text-ink font-sans overflow-x-clip">
      <SiteHeader />
      <HeroSection />
      <div className="landing-sheet relative z-10 -mt-10 rounded-t-[28px] sm:rounded-t-[50px] bg-canvas overflow-clip">
        <div className="landing-pin sticky bg-canvas">
          <TrustedMarquee />
          <StatsSection />
          <FeaturedJobsSection jobs={jobs} />
          <HowItWorksSection />
          <FeaturesSection />
          <CtaBanner />
        </div>
        <SiteFooter />
      </div>
    </div>
  );
}
