import { useState } from "react";
import { ArrowLeft, Sun, Moon } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function AuthPage() {
  const { setCurrentUser, setCurrentPage, darkMode, toggleDarkMode } = useApp();
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<"applicant" | "hrd">("applicant");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    company: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name || formData.email.split("@")[0],
      email: formData.email,
      role: role,
    };
    setCurrentUser(user);
    setCurrentPage(role === "applicant" ? "applicant-dashboard" : "hrd-dashboard");
  };

  const handleGoogleLogin = () => {
    const user = {
      id: Math.random().toString(36).substr(2, 9),
      name: "Demo User",
      email: "demo@example.com",
      role: role,
    };
    setCurrentUser(user);
    setCurrentPage(role === "applicant" ? "applicant-dashboard" : "hrd-dashboard");
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-zinc-950 dark:bg-zinc-900 p-12">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-white tracking-tight">TalentAI</span>
        </div>
        <div>
          <blockquote className="text-2xl font-light text-zinc-300 leading-relaxed mb-6">
            "The AI validation process saved us 40+ hours per hire. We now only
            speak to candidates who are truly qualified."
          </blockquote>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-700 flex items-center justify-center text-white font-bold text-sm">
              RK
            </div>
            <div>
              <p className="text-white font-medium text-sm">Rika Kusuma</p>
              <p className="text-zinc-500 text-xs">Head of Talent, TechCorp Indonesia</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[
            { v: "500+", l: "Companies" },
            { v: "10k+", l: "Placed" },
            { v: "98%", l: "Satisfaction" },
          ].map((s) => (
            <div key={s.l} className="border border-zinc-700 rounded-xl p-4">
              <p className="text-white text-xl font-bold">{s.v}</p>
              <p className="text-zinc-500 text-xs mt-1">{s.l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-zinc-100 dark:border-zinc-800">
          <button
            onClick={() => setCurrentPage("landing")}
            className="flex items-center gap-1.5 text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
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
        </div>

        {/* Form */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-sm">
            <div className="mb-8">
              <h2 className="text-2xl font-bold tracking-tight mb-2">
                {isLogin ? "Welcome back" : "Create account"}
              </h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {isLogin ? "Sign in to continue to TalentAI" : "Start hiring smarter today"}
              </p>
            </div>

            {/* Role toggle */}
            <div className="flex p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl mb-6">
              {(["applicant", "hrd"] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                    role === r
                      ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white"
                      : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"
                  }`}
                >
                  {r === "applicant" ? "Candidate" : "HRD"}
                </button>
              ))}
            </div>

            {/* Google SSO */}
            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-2.5 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 py-3 rounded-xl text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors mb-5"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </button>

            <div className="relative flex items-center gap-3 mb-5">
              <div className="flex-1 h-px bg-zinc-100 dark:bg-zinc-800" />
              <span className="text-xs text-zinc-400">or</span>
              <div className="flex-1 h-px bg-zinc-100 dark:bg-zinc-800" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="label">Full Name</label>
                  <input
                    type="text"
                    required={!isLogin}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input-field"
                    placeholder="John Doe"
                  />
                </div>
              )}

              {!isLogin && role === "hrd" && (
                <div>
                  <label className="label">Company Name</label>
                  <input
                    type="text"
                    required={!isLogin && role === "hrd"}
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="input-field"
                    placeholder="PT Teknologi Indonesia"
                  />
                </div>
              )}

              <div>
                <label className="label">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input-field"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="label">Password</label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="input-field"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 py-3 rounded-xl font-semibold text-sm hover:opacity-80 transition-opacity mt-2"
              >
                {isLogin ? "Sign In" : "Create Account"}
              </button>
            </form>

            <p className="text-center text-xs text-zinc-500 dark:text-zinc-400 mt-6">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="font-medium text-zinc-900 dark:text-white hover:underline"
              >
                {isLogin ? "Sign up" : "Sign in"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
