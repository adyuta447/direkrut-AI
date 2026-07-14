"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "../../../context/AppContext";
import { AuthMarketingPanel } from "./AuthMarketingPanel";
import { AuthMobileNav } from "../../molecules/auth/AuthMobileNav";
import { RoleToggle } from "../../molecules/auth/RoleToggle";
import { AuthCredentialsForm, AuthFormData } from "../../molecules/auth/AuthCredentialsForm";
import { AuthFormFooter } from "../../molecules/auth/AuthFormFooter";

type Role = "applicant" | "hrd";

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
  const { setCurrentUser } = useApp();
  const router = useRouter();
  const [role, setRole] = useState<Role>("applicant");
  const [formData, setFormData] = useState<AuthFormData>({
    name: "",
    email: "",
    password: "",
    company: "",
  });

  const goToDashboard = () => router.push(role === "applicant" ? "/applicant/apply" : "/hrd");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentUser({
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name || formData.email.split("@")[0],
      email: formData.email,
      role,
    });
    goToDashboard();
  };

  const handleQuickAccess = () => {
    setCurrentUser({
      id: Math.random().toString(36).substr(2, 9),
      name: "Pengguna Demo",
      email: "demo@example.com",
      role,
    });
    goToDashboard();
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
            <AuthCredentialsForm
              isLogin={isLogin}
              role={role}
              formData={formData}
              onFieldChange={(field, value) => setFormData({ ...formData, [field]: value })}
              onSubmit={handleSubmit}
            />
            <AuthFormFooter isLogin={isLogin} role={role} onQuickAccess={handleQuickAccess} />
          </div>
        </div>
      </div>
    </div>
  );
}
