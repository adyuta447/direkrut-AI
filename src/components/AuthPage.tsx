import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function AuthPage() {
  const { setCurrentUser, setCurrentPage } = useApp();
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
      name: "Pengguna Demo",
      email: "demo@example.com",
      role,
    };
    setCurrentUser(user);
    setCurrentPage(role === "applicant" ? "applicant-dashboard" : "hrd-dashboard");
  };

  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col lg:flex-row font-sans">

      {/* ── LEFT PANEL — editorial dark ───────────────────── */}
      <div className="hidden lg:flex flex-col justify-between w-[52%] flex-shrink-0 bg-inverse-canvas p-10 xl:p-14">

        {/* Brand */}
        <div className="flex items-center justify-between">
          <span className="text-[16px] font-semibold text-white tracking-tight uppercase">Direkrut AI</span>
        </div>

        {/* Big type */}
        <div>
          <p className="text-[14px] font-semibold uppercase text-[#c6c6c6] mb-6">Untuk Perekrut & Kandidat</p>
          <h2 className="text-[52px] xl:text-[64px] font-light text-white tracking-[-0.5px] leading-[1.1] mb-8 max-w-lg">
            Masa depan rekrutmen ada di sini.
          </h2>
          <blockquote className="border-l-2 border-white pl-6">
            <p className="text-[16px] text-[#e0e0e0] leading-relaxed mb-6">
              "Proses validasi AI ini menghemat lebih dari 40 jam waktu kami untuk setiap rekrutmen. Kami sekarang hanya mewawancarai kandidat yang benar-benar kompeten."
            </p>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-[#393939] flex items-center justify-center text-[#f4f4f4] font-semibold text-[14px]">
                RK
              </div>
              <div>
                <p className="text-white text-[14px] font-semibold">Rika Kusuma</p>
                <p className="text-[#c6c6c6] text-[12px]">Kepala Talent, TechCorp Indonesia</p>
              </div>
            </div>
          </blockquote>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 border-t border-[#393939] pt-8">
          {[
            { v: "500+", l: "Perusahaan" },
            { v: "10rb+", l: "Ditempatkan" },
            { v: "98%", l: "Kepuasan" },
          ].map((s, i) => (
            <div key={s.l} className={`${i < 2 ? "border-r border-[#393939]" : ""} pr-6 pl-${i === 0 ? "0" : "6"}`}>
              <p className="text-white text-[32px] font-light mb-1">{s.v}</p>
              <p className="text-[#c6c6c6] text-[12px] font-semibold uppercase">{s.l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── RIGHT PANEL — form ────────────────────────────── */}
      <div className="flex-1 flex flex-col min-h-screen lg:min-h-0 bg-canvas">

        {/* Mobile nav */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-hairline lg:border-b-0">
          <button
            onClick={() => setCurrentPage("landing")}
            className="flex items-center gap-2 text-[14px] font-semibold text-ink-muted hover:text-ink transition-none"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </button>
          <span className="text-[14px] font-semibold uppercase lg:hidden text-ink">Direkrut AI</span>
          <div className="w-8 h-8 lg:hidden"></div>
        </div>

        {/* Centered form */}
        <div className="flex-1 flex items-center justify-center px-6 py-10">
          <div className="w-full max-w-[400px]">

            {/* Header */}
            <div className="mb-8">
              <p className="text-[14px] font-semibold uppercase text-ink-muted mb-4">
                {isLogin ? "Selamat Datang Kembali" : "Mulai Sekarang"}
              </p>
              <h1 className="text-[32px] font-light leading-[1.25] text-ink">
                {isLogin ? "Masuk ke Direkrut AI" : "Buat Akun Anda"}
              </h1>
            </div>

            {/* Role toggle */}
            <div className="flex border border-hairline mb-8 bg-surface-1">
              {(["applicant", "hrd"] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`flex-1 py-3 text-[14px] font-semibold transition-none ${
                    role === r
                      ? "bg-canvas text-primary border-b-2 border-primary"
                      : "text-ink-muted hover:text-ink hover:bg-canvas border-b-2 border-transparent"
                  }`}
                >
                  {r === "applicant" ? "Kandidat" : "HRD"}
                </button>
              ))}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="text-[14px] font-semibold text-ink block mb-2">Nama Lengkap</label>
                  <input
                    type="text"
                    required={!isLogin}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Masukkan nama lengkap"
                    className="input-field"
                  />
                </div>
              )}

              {!isLogin && role === "hrd" && (
                <div>
                  <label className="text-[14px] font-semibold text-ink block mb-2">Perusahaan</label>
                  <input
                    type="text"
                    required={!isLogin && role === "hrd"}
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="Nama perusahaan Anda"
                    className="input-field"
                  />
                </div>
              )}

              <div>
                <label className="text-[14px] font-semibold text-ink block mb-2">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="anda@email.com"
                  className="input-field"
                />
              </div>

              <div>
                <label className="text-[14px] font-semibold text-ink block mb-2">Kata Sandi</label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="input-field"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-between gap-2 btn-primary mt-6"
              >
                {isLogin ? "Masuk" : "Buat Akun"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick / Google access */}
            <div className="mt-6 border-t border-hairline pt-6">
               <button
                onClick={handleQuickAccess}
                className="w-full flex items-center justify-center gap-3 border border-primary text-primary py-3 text-[14px] font-semibold hover:bg-primary hover:text-white transition-none"
              >
                Masuk Akses Cepat (Demo)
              </button>
            </div>

            {/* Switch mode */}
            <p className="text-[14px] text-ink-muted mt-8">
              {isLogin ? "Belum punya akun? " : "Sudah punya akun? "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary font-semibold hover:underline"
              >
                {isLogin ? "Daftar" : "Masuk"}
              </button>
            </p>

            {/* Role hint */}
            <p className="text-[12px] text-ink-muted mt-2">
              Masuk sebagai <span className="font-semibold text-ink">{role === "applicant" ? "Kandidat" : "HRD"}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
