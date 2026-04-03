import { useState } from "react";
import { ArrowLeft, Sun, Moon, ArrowRight } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function AuthPage() {
  const { setCurrentUser, setCurrentPage, darkMode, toggleDarkMode } = useApp();
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<"applicant" | "hrd">("applicant");
  const [formData, setFormData] = useState({ name: "", email: "", password: "", company: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name || formData.email.split("@")[0],
      email: formData.email,
      role,
    };
    setCurrentUser(user);
    setCurrentPage(role === "applicant" ? "applicant-dashboard" : "hrd-dashboard");
  };

  const handleQuickAccess = () => {
    const user = {
      id: Math.random().toString(36).substr(2, 9),
      name: "Demo User",
      email: "demo@example.com",
      role,
    };
    setCurrentUser(user);
    setCurrentPage(role === "applicant" ? "applicant-dashboard" : "hrd-dashboard");
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white flex flex-col lg:flex-row">

      {/* ── LEFT PANEL — editorial dark ───────────────────── */}
      <div className="hidden lg:flex flex-col justify-between w-[52%] flex-shrink-0 bg-zinc-950 dark:bg-zinc-900 p-10 xl:p-14">

        {/* Brand */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-black text-white tracking-tight uppercase">DirekrutAI</span>
          <button
            onClick={() => setCurrentPage("landing")}
            className="flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-300 transition-colors uppercase tracking-widest"
          >
            <ArrowLeft className="w-3 h-3" />
            Back
          </button>
        </div>

        {/* Big type */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-zinc-500 mb-6">For recruiters & candidates</p>
          <h2 className="text-5xl xl:text-6xl font-black text-white tracking-tighter leading-none uppercase mb-8">
            The future<br />
            of hiring<br />
            <span className="text-zinc-600">is here.</span>
          </h2>
          <blockquote className="border-l-2 border-zinc-700 pl-5">
            <p className="text-sm text-zinc-400 leading-relaxed mb-4">
              "The AI validation process saved us 40+ hours per hire. We now only speak to candidates who are truly qualified."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400 font-bold text-xs">
                RK
              </div>
              <div>
                <p className="text-white text-xs font-semibold">Rika Kusuma</p>
                <p className="text-zinc-600 text-[10px]">Head of Talent, TechCorp Indonesia</p>
              </div>
            </div>
          </blockquote>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 border border-zinc-800 rounded-2xl overflow-hidden">
          {[
            { v: "500+", l: "Companies" },
            { v: "10k+", l: "Placed" },
            { v: "98%", l: "Satisfaction" },
          ].map((s, i) => (
            <div key={s.l} className={`p-5 ${i < 2 ? "border-r border-zinc-800" : ""}`}>
              <p className="text-white text-2xl font-black tracking-tight">{s.v}</p>
              <p className="text-zinc-600 text-xs mt-1 uppercase tracking-widest font-medium">{s.l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── RIGHT PANEL — form ────────────────────────────── */}
      <div className="flex-1 flex flex-col min-h-screen lg:min-h-0">

        {/* Mobile nav */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 lg:border-b-0">
          <button
            onClick={() => setCurrentPage("landing")}
            className="flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors uppercase tracking-widest"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back
          </button>
          <span className="text-sm font-black uppercase tracking-tight lg:hidden">DirekrutAI</span>
          <button
            onClick={toggleDarkMode}
            className="w-8 h-8 flex items-center justify-center rounded-xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
          >
            {darkMode ? <Sun className="w-3.5 h-3.5 text-zinc-400" /> : <Moon className="w-3.5 h-3.5 text-zinc-500" />}
          </button>
        </div>

        {/* Centered form */}
        <div className="flex-1 flex items-center justify-center px-6 py-10">
          <div className="w-full max-w-[360px]">

            {/* Header */}
            <div className="mb-8">
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-zinc-400 mb-3">
                {isLogin ? "Welcome back" : "Get started"}
              </p>
              <h1 className="text-3xl font-black tracking-tighter leading-tight">
                {isLogin ? "Sign in to\nDirekrutAI." : "Create your\naccount."}
              </h1>
            </div>

            {/* Role toggle */}
            <div className="flex border border-zinc-200 dark:border-zinc-700 rounded-xl overflow-hidden mb-6">
              {(["applicant", "hrd"] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`flex-1 py-2.5 text-xs font-semibold tracking-widest uppercase transition-all ${
                    role === r
                      ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900"
                      : "text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"
                  }`}
                >
                  {r === "applicant" ? "Candidate" : "HRD"}
                </button>
              ))}
            </div>

            {/* Quick / Google access */}
            <button
              onClick={handleQuickAccess}
              className="w-full flex items-center justify-center gap-2.5 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 py-3 rounded-xl text-xs font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors mb-5 uppercase tracking-wide"
            >
              <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" aria-hidden>
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </button>

            {/* Divider */}
            <div className="relative flex items-center gap-3 mb-5">
              <div className="flex-1 h-px bg-zinc-100 dark:bg-zinc-800" />
              <span className="text-[10px] text-zinc-400 uppercase tracking-widest">or</span>
              <div className="flex-1 h-px bg-zinc-100 dark:bg-zinc-800" />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              {!isLogin && (
                <div>
                  <label className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400 block mb-1.5">Full Name</label>
                  <input
                    type="text"
                    required={!isLogin}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Jane Doe"
                    className="w-full px-3.5 py-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm placeholder-zinc-400 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-500 transition-colors"
                  />
                </div>
              )}

              {!isLogin && role === "hrd" && (
                <div>
                  <label className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400 block mb-1.5">Company</label>
                  <input
                    type="text"
                    required={!isLogin && role === "hrd"}
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="PT Teknologi Indonesia"
                    className="w-full px-3.5 py-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm placeholder-zinc-400 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-500 transition-colors"
                  />
                </div>
              )}

              <div>
                <label className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400 block mb-1.5">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="you@example.com"
                  className="w-full px-3.5 py-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm placeholder-zinc-400 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-500 transition-colors"
                />
              </div>

              <div>
                <label className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400 block mb-1.5">Password</label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm placeholder-zinc-400 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-500 transition-colors"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 py-3.5 rounded-xl font-semibold text-sm hover:opacity-80 transition-opacity mt-1"
              >
                {isLogin ? "Sign In" : "Create Account"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Switch mode */}
            <p className="text-center text-xs text-zinc-400 mt-6">
              {isLogin ? "No account? " : "Already have one? "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="font-semibold text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors underline underline-offset-2"
              >
                {isLogin ? "Sign up" : "Sign in"}
              </button>
            </p>

            {/* Role hint */}
            <p className="text-center text-[10px] text-zinc-300 dark:text-zinc-700 mt-3">
              Signing in as <span className="font-semibold">{role === "applicant" ? "Candidate" : "HRD"}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
