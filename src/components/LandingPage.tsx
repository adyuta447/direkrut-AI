import { useApp } from "../context/AppContext";
import { Sun, Moon, ArrowRight, ArrowUpRight, BrainCircuit, GitMerge, ShieldCheck, Mic2, CalendarDays, TrendingUp } from "lucide-react";
import { useRef, useEffect } from "react";
import gsap from "gsap";

const MARQUEE_ITEMS = [
  "CV Analysis",
  "Skill Validation",
  "AI Interviewer",
  "Gap Analysis",
  "Cross-Role Matching",
  "Scheduling",
  "Authenticity Detection",
  "HRD Dashboard",
];

function MarqueeStrip() {
  const trackRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    // Wait one frame so the DOM has laid out and we can read the real width
    const raf = requestAnimationFrame(() => {
      // Each "set" is the items once; we cloned 4 sets → scrolling totalW/4 feels seamless
      const totalW = track.scrollWidth / 4;

      tweenRef.current = gsap.to(track, {
        x: `-=${totalW}`,
        duration: 28,
        ease: "none",
        repeat: -1,
        modifiers: {
          x: gsap.utils.unitize((x) => parseFloat(x) % totalW),
        },
      });
    });

    return () => {
      cancelAnimationFrame(raf);
      tweenRef.current?.kill();
    };
  }, []);

  const pause = () => tweenRef.current && gsap.to(tweenRef.current, { timeScale: 0, duration: 0.4, ease: "power2.out" });
  const resume = () => tweenRef.current && gsap.to(tweenRef.current, { timeScale: 1, duration: 0.6, ease: "power2.inOut" });

  // Render 4 copies so there's always content filling the strip while GSAP loops
  const repeated = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

  return (
    <div
      className="border-b border-zinc-100 dark:border-zinc-800 py-4 overflow-hidden bg-zinc-50 dark:bg-zinc-900/40 cursor-default select-none"
      onMouseEnter={pause}
      onMouseLeave={resume}
    >
      <div ref={trackRef} className="flex whitespace-nowrap will-change-transform">
        {repeated.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-10 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-600 flex-shrink-0 px-5"
          >
            {item}
            <span className="text-zinc-200 dark:text-zinc-800 text-base leading-none">·</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function LandingPage() {
  const { setCurrentPage, jobs, darkMode, toggleDarkMode } = useApp();
  const featuredJobs = jobs.slice(0, 4);

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white font-sans overflow-x-hidden">

      {/* ── NAV ───────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-100 dark:border-zinc-800/50">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-10 py-4 flex justify-between items-center">
          <span className="text-sm font-bold tracking-tight">DirekrutAI</span>
          <div className="flex items-center gap-6">
            <button
              onClick={() => setCurrentPage("jobs")}
              className="text-xs font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors tracking-wide uppercase"
            >
              Browse Jobs
            </button>
            <button
              onClick={toggleDarkMode}
              className="w-8 h-8 flex items-center justify-center rounded-xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
            >
              {darkMode ? <Sun className="w-3.5 h-3.5 text-zinc-400" /> : <Moon className="w-3.5 h-3.5 text-zinc-500" />}
            </button>
            <button
              onClick={() => setCurrentPage("auth")}
              className="text-xs font-semibold bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-4 py-2.5 rounded-xl hover:opacity-80 transition-opacity tracking-wide"
            >
              Sign In
            </button>
          </div>
        </div>
      </nav>

      {/* ── HERO ──────────────────────────────────────────── */}
      <section className="pt-36 pb-0 px-6 lg:px-10 max-w-screen-xl mx-auto">

        {/* Eyebrow */}
        <div className="flex items-center gap-3 mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
            AI-Powered Talent Intelligence
          </p>
        </div>

        {/* Massive headline */}
        <h1 className="text-[clamp(3.5rem,12vw,10rem)] font-black leading-[0.9] tracking-tighter mb-8 uppercase">
          Hire<br />
          <span className="text-zinc-300 dark:text-zinc-700">Smarter.</span>
        </h1>

        {/* Divider row with CTA */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-16 border-b border-zinc-100 dark:border-zinc-800">
          <p className="text-base lg:text-lg text-zinc-500 dark:text-zinc-400 max-w-lg leading-relaxed">
            Transform your recruitment process with intelligent CV analysis,
            automated skill validation, and AI-powered candidate interviews.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
            <button
              onClick={() => setCurrentPage("auth")}
              className="inline-flex items-center gap-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-6 py-3.5 rounded-xl font-semibold text-sm hover:opacity-80 transition-opacity"
            >
              Apply as Candidate
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage("auth")}
              className="inline-flex items-center gap-2 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 px-6 py-3.5 rounded-xl font-semibold text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
            >
              HRD Portal
            </button>
          </div>
        </div>
      </section>

      {/* ── MARQUEE STRIP ─────────────────────────────────── */}
      <MarqueeStrip />

      {/* ── STATS ─────────────────────────────────────────── */}
      <section className="border-b border-zinc-100 dark:border-zinc-800">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-10 grid grid-cols-2 md:grid-cols-4">
          {[
            { value: "10k+", label: "Candidates Placed" },
            { value: "98%", label: "Satisfaction Rate" },
            { value: "3×", label: "Faster Hiring" },
            { value: "500+", label: "Companies" },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className={`py-10 px-6 ${i < 3 ? "border-r border-zinc-100 dark:border-zinc-800" : ""}`}
            >
              <p className="text-5xl font-black tracking-tight mb-1">{stat.value}</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-500 uppercase tracking-widest font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ──────────────────────────────────────── */}
      <section className="py-28 px-6 lg:px-10 max-w-screen-xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-16">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-zinc-400 mb-4">Capabilities</p>
            <h2 className="text-5xl lg:text-7xl font-black tracking-tighter leading-tight uppercase">
              Built for<br />precision.
            </h2>
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-sm leading-relaxed lg:text-right">
            Every feature is designed to remove noise from your hiring pipeline
            and surface only what matters.
          </p>
        </div>

        {/* Feature grid — editorial layout */}
        <div className="grid md:grid-cols-3 border border-zinc-100 dark:border-zinc-800 rounded-2xl overflow-hidden">
          {[
            {
              title: "AI Skill Validation",
              desc: "Automated conversational analysis that validates real skills beyond what's written on the CV.",
              tag: "01",
              icon: BrainCircuit,
            },
            {
              title: "Smart Matching",
              desc: "Precise recommendation scores and cross-role suggestions powered by comprehensive skill mapping.",
              tag: "02",
              icon: GitMerge,
            },
            {
              title: "Authenticity Detection",
              desc: "Detect generic or AI-generated responses to ensure you're evaluating genuine candidate experience.",
              tag: "03",
              icon: ShieldCheck,
            },
            {
              title: "AI Interviewer",
              desc: "Shortlisted candidates complete an AI-powered first-round interview, saving hours of screening time.",
              tag: "04",
              icon: Mic2,
            },
            {
              title: "Flexible Scheduling",
              desc: "When technical interviews are needed, candidates book slots directly — seamlessly integrated.",
              tag: "05",
              icon: CalendarDays,
            },
            {
              title: "Gap & Growth Analysis",
              desc: "Understand skill gaps, project growth trajectories, and build development plans for each candidate.",
              tag: "06",
              icon: TrendingUp,
            },
          ].map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className={`p-8 group hover:bg-zinc-50 dark:hover:bg-zinc-900/60 transition-colors cursor-default
                  ${i % 3 !== 2 ? "border-r border-zinc-100 dark:border-zinc-800" : ""}
                  ${i < 3 ? "border-b border-zinc-100 dark:border-zinc-800" : ""}
                `}
              >
                <div className="flex items-start justify-between mb-8">
                  <span className="text-xs font-mono text-zinc-300 dark:text-zinc-700">{feature.tag}</span>
                  <Icon
                    strokeWidth={1.5}
                    size={16}
                    className="text-zinc-200 dark:text-zinc-700 group-hover:text-zinc-500 dark:group-hover:text-zinc-400 transition-colors duration-300"
                  />
                </div>
                <h3 className="text-lg font-bold tracking-tight mb-3">{feature.title}</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{feature.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── PROCESS ───────────────────────────────────────── */}
      <section className="border-t border-zinc-100 dark:border-zinc-800 py-28 px-6 lg:px-10">
        <div className="max-w-screen-xl mx-auto">
          <div className="mb-16">
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-zinc-400 mb-4">Process</p>
            <h2 className="text-5xl lg:text-7xl font-black tracking-tighter leading-tight uppercase">
              How it<br />works.
            </h2>
          </div>

          <div className="grid md:grid-cols-4 border border-zinc-100 dark:border-zinc-800 rounded-2xl overflow-hidden">
            {[
              { step: "01", title: "Apply & Upload", desc: "Candidate submits CV and selects a role in under 2 minutes." },
              { step: "02", title: "AI Validation", desc: "Skills validated through AI-powered conversational analysis." },
              { step: "03", title: "AI Interview", desc: "Shortlisted candidates complete a structured AI interview." },
              { step: "04", title: "Human Review", desc: "HRD reviews AI insights and books final interviews with one click." },
            ].map((item, i) => (
              <div
                key={item.step}
                className={`p-8 ${i < 3 ? "border-r border-zinc-100 dark:border-zinc-800" : ""}`}
              >
                <p className="text-7xl font-black text-zinc-100 dark:text-zinc-800 tracking-tighter mb-6 leading-none">
                  {item.step}
                </p>
                <h3 className="text-base font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED JOBS ─────────────────────────────────── */}
      <section className="py-28 px-6 lg:px-10 max-w-screen-xl mx-auto">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-zinc-400 mb-4">Open Roles</p>
            <h2 className="text-5xl lg:text-6xl font-black tracking-tighter leading-tight uppercase">
              Featured<br />Positions.
            </h2>
          </div>
          <button
            onClick={() => setCurrentPage("jobs")}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors group uppercase tracking-widest"
          >
            View all
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>

        <div className="border border-zinc-100 dark:border-zinc-800 rounded-2xl overflow-hidden divide-y divide-zinc-100 dark:divide-zinc-800">
          {featuredJobs.map((job, idx) => (
            <div
              key={job.id}
              onClick={() => setCurrentPage("jobs")}
              className="group flex flex-col sm:flex-row sm:items-center justify-between px-6 py-5 hover:bg-zinc-50 dark:hover:bg-zinc-900/60 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-6">
                <span className="text-xs font-mono text-zinc-300 dark:text-zinc-700 w-5 flex-shrink-0">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-bold text-sm">{job.title}</h3>
                  <p className="text-xs text-zinc-400 mt-0.5">{job.company} · {job.location}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-3 sm:mt-0 pl-11 sm:pl-0">
                <span className="text-xs border border-zinc-200 dark:border-zinc-700 px-2.5 py-1 rounded-lg text-zinc-500 dark:text-zinc-400 font-medium">
                  {job.type}
                </span>
                <span className="text-xs text-zinc-400 tabular-nums">{job.posted}</span>
                <ArrowUpRight className="w-4 h-4 text-zinc-200 dark:text-zinc-700 group-hover:text-zinc-500 dark:group-hover:text-zinc-400 transition-colors" />
              </div>
            </div>
          ))}
          {featuredJobs.length === 0 && (
            <div className="text-center py-16 text-sm text-zinc-400">No open positions yet.</div>
          )}
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────── */}
      <section className="px-6 lg:px-8 pb-28">
        <div className="max-w-screen-xl mx-auto">
          <div className="bg-zinc-950 dark:bg-white rounded-3xl overflow-hidden">
            <div className="px-10 lg:px-16 py-16 lg:py-14 grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] items-center gap-10 lg:gap-6">

              {/* Left — Eyebrow + Headline */}
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-zinc-500 mb-6">Get Started</p>
                <h2 className="text-5xl lg:text-6xl font-black text-white dark:text-zinc-900 tracking-tighter leading-none uppercase">
                  Ready to<br />hire right?
                </h2>
              </div>

              {/* Center — Image + floating badges */}
              <div className="relative group mx-auto">
                <div className="absolute inset-0 bg-white/5 dark:bg-zinc-900/10 blur-2xl scale-110 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                <img
                  src="/cta.svg"
                  alt="AI recruitment illustration"
                  width={420}
                  height={400}
                  className="relative w-[300px] h-[300px] lg:w-[400px] lg:h-[400px] object-contain opacity-90 group-hover:opacity-100 group-hover:scale-[1.02] transition-all duration-500 ease-out"
                />

                {/* Floating badge — company count, bottom-left */}
                <div className="absolute -bottom-3 -left-4 bg-zinc-900 dark:bg-white/90 backdrop-blur-sm border border-white/10 dark:border-zinc-200 rounded-xl px-3.5 py-2 flex items-center gap-2 shadow-xl">
                  <span className="text-white dark:text-zinc-900 font-black text-sm tabular-nums">500+</span>
                  <span className="text-zinc-400 dark:text-zinc-500 text-xs">companies</span>
                </div>

                {/* Floating pills — features, top-right */}
                <div className="absolute -top-3 -right-4 flex flex-col gap-1.5 items-end">
                  {["AI Validation", "Smart Matching", "Auto-Scheduling"].map((f) => (
                    <span
                      key={f}
                      className="bg-white/10 dark:bg-zinc-900/80 backdrop-blur-sm border border-white/10 dark:border-zinc-200 text-white/70 dark:text-zinc-600 text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-lg"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right — Buttons */}
              <div className="flex flex-row gap-3 lg:justify-end flex-wrap">
                <button
                  onClick={() => setCurrentPage("auth")}
                  className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white px-8 py-3.5 rounded-xl font-semibold text-sm hover:opacity-80 transition-opacity w-full lg:w-auto"
                >
                  Start Hiring
                </button>
                <button
                  onClick={() => setCurrentPage("jobs")}
                  className="border border-zinc-700 dark:border-zinc-300 text-zinc-400 dark:text-zinc-500 px-8 py-3.5 rounded-xl font-semibold text-sm hover:border-zinc-500 dark:hover:border-zinc-400 transition-colors w-full lg:w-auto"
                >
                  Browse Jobs
                </button>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────── */}
      <footer className="border-t border-zinc-100 dark:border-zinc-800 py-8 px-6 lg:px-10">
        <div className="max-w-screen-xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-sm font-black tracking-tight uppercase">DirekrutAI</span>
          <p className="text-xs text-zinc-400">© 2024 DirekrutAI — Revolutionizing recruitment with AI</p>
          <div className="flex gap-5">
            {["Privacy", "Terms", "Contact"].map((link) => (
              <button key={link} className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors uppercase tracking-widest font-medium">
                {link}
              </button>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
