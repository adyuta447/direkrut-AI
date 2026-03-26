import { useApp } from "../context/AppContext";
import { Sun, Moon, ArrowRight, ArrowUpRight } from "lucide-react";

export default function LandingPage() {
  const { setCurrentPage, jobs, darkMode, toggleDarkMode } = useApp();
  const featuredJobs = jobs.slice(0, 3);

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md border-b border-zinc-100 dark:border-zinc-800/60">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4 flex justify-between items-center">
          <span className="text-lg font-bold tracking-tight">TalentAI</span>
          <div className="flex items-center gap-6">
            <button
              onClick={() => setCurrentPage("jobs")}
              className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white font-medium transition-colors"
            >
              Browse Jobs
            </button>
            <button
              onClick={toggleDarkMode}
              className="w-9 h-9 flex items-center justify-center rounded-xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
            >
              {darkMode ? (
                <Sun className="w-4 h-4 text-zinc-400" />
              ) : (
                <Moon className="w-4 h-4 text-zinc-500" />
              )}
            </button>
            <button
              onClick={() => setCurrentPage("auth")}
              className="btn-primary"
            >
              Sign in
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-zinc-200 dark:border-zinc-700 text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            AI-Powered Recruitment Platform
          </div>
          <h1 className="text-6xl lg:text-8xl font-bold tracking-tight leading-none mb-8">
            Hire Smarter,<br />
            <span className="text-zinc-400 dark:text-zinc-500">Not Harder.</span>
          </h1>
          <p className="text-lg text-zinc-500 dark:text-zinc-400 max-w-2xl mb-12 leading-relaxed">
            Transform your recruitment process with intelligent CV analysis,
            automated skill validation, and AI-powered candidate interviews —
            so you can focus on what matters most.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setCurrentPage("auth")}
              className="inline-flex items-center gap-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-7 py-3.5 rounded-xl font-semibold text-sm hover:opacity-80 transition-opacity"
            >
              Apply as Candidate
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage("auth")}
              className="inline-flex items-center gap-2 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 px-7 py-3.5 rounded-xl font-semibold text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
            >
              Login as HRD
            </button>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-zinc-100 dark:border-zinc-800/60 py-10 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: "10k+", label: "Candidates placed" },
            { value: "98%", label: "Satisfaction rate" },
            { value: "3x", label: "Faster hiring" },
            { value: "500+", label: "Companies trust us" },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-3xl font-bold tracking-tight">{stat.value}</p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="mb-16">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-4">Capabilities</p>
          <h2 className="text-4xl lg:text-5xl font-bold tracking-tight">
            Everything you need<br />to hire right.
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-px bg-zinc-100 dark:bg-zinc-800/60 rounded-xl overflow-hidden border border-zinc-100 dark:border-zinc-800/60">
          {[
            {
              title: "AI Skill Validation",
              description:
                "Automated conversational analysis that goes beyond what's written on the CV, validating real skills with precision.",
              tag: "Validation",
            },
            {
              title: "Smart Matching",
              description:
                "Get precise recommendation scores and cross-role suggestions powered by comprehensive candidate skill mapping.",
              tag: "Intelligence",
            },
            {
              title: "Authenticity Detection",
              description:
                "Detect generic or AI-generated responses to ensure you're evaluating genuine candidate capabilities and experience.",
              tag: "Trust",
            },
            {
              title: "AI Interviewer",
              description:
                "Shortlisted candidates undergo an AI-powered interview before speaking to your team, saving hours of screening time.",
              tag: "Interview",
            },
            {
              title: "Flexible Scheduling",
              description:
                "When additional technical interviews are needed, candidates can book slots directly — just like cal.com, seamlessly integrated.",
              tag: "Scheduling",
            },
            {
              title: "Gap & Growth Analysis",
              description:
                "Understand skill gaps, project candidate growth trajectories, and build development plans for long-term success.",
              tag: "Analytics",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="bg-white dark:bg-zinc-950 p-8 group hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
            >
              <span className="inline-block text-xs font-semibold text-zinc-400 border border-zinc-200 dark:border-zinc-700 px-2.5 py-1 rounded-lg mb-5">
                {feature.tag}
              </span>
              <h3 className="text-lg font-semibold mb-3">{feature.title}</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-6 lg:px-8 bg-zinc-50 dark:bg-zinc-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-4">Process</p>
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight">
              How it works.
            </h2>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Apply & Upload", desc: "Candidate submits CV and selects a role" },
              { step: "02", title: "AI Validation", desc: "Skills are validated through AI-powered conversation" },
              { step: "03", title: "AI Interview", desc: "Shortlisted? Our AI Interviewer conducts a first-round interview" },
              { step: "04", title: "Human Review", desc: "HRD reviews AI insights and schedules final interviews" },
            ].map((item, i) => (
              <div key={item.step} className="relative">
                {i < 3 && (
                  <div className="hidden md:block absolute top-4 left-[calc(100%-16px)] w-8 h-px bg-zinc-200 dark:bg-zinc-700 z-10" />
                )}
                <p className="text-5xl font-bold text-zinc-100 dark:text-zinc-800 mb-4">{item.step}</p>
                <h3 className="text-base font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Jobs — teaser */}
      <section className="py-24 px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-4">Opportunities</p>
            <h2 className="text-4xl font-bold tracking-tight">Featured Roles</h2>
          </div>
          <button
            onClick={() => setCurrentPage("jobs")}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors group"
          >
            View all
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
        <div className="space-y-2">
          {featuredJobs.map((job, idx) => (
            <div
              key={job.id}
              className="group flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-xl border border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
              onClick={() => setCurrentPage("jobs")}
            >
              <div className="flex items-center gap-5">
                <span className="text-xs text-zinc-300 dark:text-zinc-600 font-mono w-4">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-semibold text-sm">{job.title}</h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    {job.company} · {job.location}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-3 sm:mt-0 pl-9 sm:pl-0">
                <span className="text-xs border border-zinc-200 dark:border-zinc-700 px-2.5 py-1 rounded-lg text-zinc-500 dark:text-zinc-400">
                  {job.type}
                </span>
                <span className="text-xs text-zinc-400">{job.posted}</span>
                <ArrowUpRight className="w-4 h-4 text-zinc-300 dark:text-zinc-600 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors" />
              </div>
            </div>
          ))}
          {featuredJobs.length === 0 && (
            <div className="text-center py-16 text-sm text-zinc-400">
              No open positions yet.
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-zinc-900 dark:bg-white rounded-2xl p-12 lg:p-16 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-white dark:text-zinc-900 mb-3">
                Ready to find your<br />next hire?
              </h2>
              <p className="text-zinc-400 dark:text-zinc-500 text-sm">
                Join 500+ companies transforming their recruitment with AI.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
              <button
                onClick={() => setCurrentPage("auth")}
                className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white px-7 py-3.5 rounded-xl font-semibold text-sm hover:opacity-80 transition-opacity"
              >
                Get Started
              </button>
              <button
                onClick={() => setCurrentPage("jobs")}
                className="border border-zinc-700 dark:border-zinc-300 text-zinc-300 dark:text-zinc-600 px-7 py-3.5 rounded-xl font-semibold text-sm hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors"
              >
                Browse Jobs
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-100 dark:border-zinc-800/60 py-10 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-sm font-bold tracking-tight">TalentAI</span>
          <p className="text-xs text-zinc-400">
            © 2024 TalentAI. Revolutionizing recruitment with AI.
          </p>
          <div className="flex gap-5">
            {["Privacy", "Terms", "Contact"].map((link) => (
              <button key={link} className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">
                {link}
              </button>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
