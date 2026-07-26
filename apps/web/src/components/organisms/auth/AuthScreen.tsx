"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { useDashboard } from "@/context/DashboardContext";
import { ApiError } from "@/services/apiClient";
import {
  uploadCompanyDocument,
  saveCompanyDocumentKeys,
} from "@/services/companyService";
import { AuthMarketingPanel } from "./AuthMarketingPanel";
import { AuthMobileNav } from "../../molecules/auth/AuthMobileNav";
import { RoleToggle } from "../../molecules/auth/RoleToggle";
import {
  AuthCredentialsForm,
  AuthFormData,
  CompanyDocs,
} from "../../molecules/auth/AuthCredentialsForm";
import { AuthFormFooter } from "../../molecules/auth/AuthFormFooter";

const EMPTY_COMPANY_DOCS: CompanyDocs = {
  aktaPendirian: null,
  nib: null,
  npwp: null,
  suratKuasa: null,
};

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
  const [companyDocs, setCompanyDocs] =
    useState<CompanyDocs>(EMPTY_COMPANY_DOCS);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const goToNextPage = () => {
    if (!isLogin && role === "hrd") {
      router.replace("/auth/verification-success");
      return;
    }
    router.push(role === "candidate" ? "/candidate" : "/hrd");
  };
  const uploadCompanyDocsIfAny = async () => {
    const entries: [keyof CompanyDocs, string][] = [
      ["aktaPendirian", "aktaPendirianKey"],
      ["nib", "nibKey"],
      ["npwp", "npwpKey"],
      ["suratKuasa", "suratKuasaKey"],
    ];
    const keys: Record<string, string> = {};
    for (const [docType, keyName] of entries) {
      const file = companyDocs[docType];
      if (!file) continue;
      const objectKey = await uploadCompanyDocument(docType, file);
      if (objectKey) keys[keyName] = objectKey;
    }
    if (Object.keys(keys).length > 0) {
      await saveCompanyDocumentKeys(keys);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await register(
          formData.name,
          formData.email,
          formData.password,
          role,
          formData.company,
        );
        if (role === "hrd") await uploadCompanyDocsIfAny();
      }
      goToNextPage();
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : isLogin
            ? "Gagal masuk. Coba lagi nanti."
            : "Gagal membuat akun. Coba lagi nanti.",
      );
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
              <h1 className="text-[clamp(34px,3.4vw,46px)] font-bold leading-[1.1] tracking-[-0.02em] text-ink">
                {copy.title}
              </h1>
            </div>

            <RoleToggle role={role} onChange={setRole} />
            {error && (
              <div className="mt-4 flex items-center gap-3 rounded-2xl bg-destructive px-5 py-4 text-white">
                <AlertCircle className="size-5 shrink-0" />
                <p className="text-[15px] font-semibold leading-snug">
                  {error}
                </p>
              </div>
            )}
            <AuthCredentialsForm
              isLogin={isLogin}
              role={role}
              formData={formData}
              onFieldChange={(field, value) =>
                setFormData({ ...formData, [field]: value })
              }
              companyDocs={companyDocs}
              onDocChange={(doc, file) =>
                setCompanyDocs({ ...companyDocs, [doc]: file })
              }
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
            <AuthFormFooter isLogin={isLogin} role={role} />
          </div>
        </div>
      </div>
    </div>
  );
}
