"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDashboard } from "@/context/DashboardContext";
import { ApiError } from "@/services/apiClient";
import { AuthMarketingPanel } from "./AuthMarketingPanel";
import { AuthMobileNav } from "../../molecules/auth/AuthMobileNav";
import { RoleToggle } from "../../molecules/auth/RoleToggle";
import { AuthCredentialsForm, AuthFormData } from "../../molecules/auth/AuthCredentialsForm";
import { AuthFormFooter } from "../../molecules/auth/AuthFormFooter";

type Role = "candidate" | "hrd";

interface AuthScreenProps {
  mode: "login" | "register";
}

const COPY = {
  login: {
    kicker: "Selamat datang balik",
    title: "Masuk dan lanjutin progresmu.",
  },
  register: {
    kicker: "Gratis, nggak pake lama",
    title: "Bikin akun, biar AI mulai kerja.",
  },
};

export function AuthScreen({ mode }: AuthScreenProps) {
  const isLogin = mode === "login";
  const { login, register } = useDashboard();
  const router = useRouter();
  const [role, setRole] = useState<Role>("candidate");
  const [formData, setFormData] = useState<AuthFormData>({
    name: "",
    email: "",
    password: "",
    company: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const goToDashboard = () => router.push(role === "candidate" ? "/candidate" : "/hrd");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await register(formData.name, formData.email, formData.password, role, formData.company);
      }
      goToDashboard();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Gagal masuk. Coba lagi sebentar lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickAccess = async () => {
    setError(null);
    setIsSubmitting(true);
    try {
      const demoEmail = `demo-${role}-${Date.now()}@direkrut.ai`;
      await register("Pengguna Demo", demoEmail, "demo12345", role, "Perusahaan Demo");
      goToDashboard();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Gagal masuk demo, coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const copy = COPY[mode];

  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col lg:flex-row font-sans">
      <AuthMarketingPanel />

      <div className="flex-1 flex flex-col min-h-screen lg:min-h-0 bg-canvas">
        <AuthMobileNav />
        <div className="flex-1 flex items-center justify-center px-6 py-10">
          <div className="w-full max-w-[420px]">
            <div className="mb-8">
              <p className="text-[12px] font-medium uppercase tracking-[0.2em] text-ink-muted mb-4">
                {copy.kicker}
              </p>
              <h1 className="text-[clamp(30px,3vw,40px)] font-bold leading-[1.15] tracking-[-0.01em] text-ink">
                {copy.title}
              </h1>
            </div>

            <RoleToggle role={role} onChange={setRole} />
            {error && (
              <p className="mt-4 rounded-2xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                {error}
              </p>
            )}
            <AuthCredentialsForm
              isLogin={isLogin}
              role={role}
              formData={formData}
              onFieldChange={(field, value) => setFormData({ ...formData, [field]: value })}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
            <AuthFormFooter
              isLogin={isLogin}
              role={role}
              onQuickAccess={handleQuickAccess}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
