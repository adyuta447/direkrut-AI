"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "../../context/AppContext";
import { AuthMarketingPanel } from "../../components/organisms/auth/AuthMarketingPanel";
import { AuthMobileNav } from "../../components/molecules/auth/AuthMobileNav";
import { AuthForm, AuthFormData } from "../../components/organisms/auth/AuthForm";

type Role = "applicant" | "hrd";

export default function AuthPage() {
  const { setCurrentUser } = useApp();
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<Role>("applicant");
  const [formData, setFormData] = useState<AuthFormData>({ name: "", email: "", password: "", company: "" });

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

  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col lg:flex-row font-sans">
      <AuthMarketingPanel />

      <div className="flex-1 flex flex-col min-h-screen lg:min-h-0 bg-canvas">
        <AuthMobileNav />
        <div className="flex-1 flex items-center justify-center px-6 py-10">
          <AuthForm
            isLogin={isLogin}
            role={role}
            formData={formData}
            onRoleChange={setRole}
            onFieldChange={(field, value) => setFormData({ ...formData, [field]: value })}
            onSubmit={handleSubmit}
            onQuickAccess={handleQuickAccess}
            onToggleMode={() => setIsLogin(!isLogin)}
          />
        </div>
      </div>
    </div>
  );
}
