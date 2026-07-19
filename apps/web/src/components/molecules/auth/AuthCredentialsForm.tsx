import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { AuthFormField } from "../../atoms/auth/AuthFormField";
import { AuthFileField } from "../../atoms/auth/AuthFileField";

type Role = "candidate" | "hrd";

export interface AuthFormData {
  name: string;
  email: string;
  password: string;
  company: string;
}

export interface CompanyDocs {
  aktaPendirian: File | null;
  nib: File | null;
  npwp: File | null;
  suratKuasa: File | null;
}

interface AuthCredentialsFormProps {
  isLogin: boolean;
  role: Role;
  formData: AuthFormData;
  onFieldChange: (field: keyof AuthFormData, value: string) => void;
  companyDocs: CompanyDocs;
  onDocChange: (doc: keyof CompanyDocs, file: File | null) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting?: boolean;
}

export function AuthCredentialsForm({
  isLogin,
  role,
  formData,
  onFieldChange,
  companyDocs,
  onDocChange,
  onSubmit,
  isSubmitting,
}: AuthCredentialsFormProps) {
  const isHrdRegister = !isLogin && role === "hrd";
  const formRef = useRef<HTMLFormElement>(null);
  const [step, setStep] = useState(1);

  // HRD register punya 2 langkah; reset ke awal tiap ganti role/mode
  // (adjust-state-during-render, bukan effect).
  const modeKey = `${role}-${isLogin}`;
  const [prevModeKey, setPrevModeKey] = useState(modeKey);
  if (modeKey !== prevModeKey) {
    setPrevModeKey(modeKey);
    setStep(1);
  }

  // Validasi cuma field yang lagi kerender (step 1), pakai native HTML5.
  const handleNext = () => {
    const form = formRef.current;
    if (!form) return;
    for (const el of Array.from(form.querySelectorAll("input"))) {
      if (!el.checkValidity()) {
        el.reportValidity();
        return;
      }
    }
    setStep(2);
  };

  const showAccount = !isHrdRegister || step === 1;
  const showDocs = isHrdRegister && step === 2;

  return (
    <form ref={formRef} onSubmit={onSubmit} className="space-y-4">
      {isHrdRegister && <StepIndicator step={step} />}

      {showAccount && (
        <>
          {!isLogin && (
            <AuthFormField
              label="Nama Lengkap"
              type="text"
              name="name"
              autoComplete="name"
              required={!isLogin}
              minLength={2}
              maxLength={120}
              value={formData.name}
              onChange={(v) => onFieldChange("name", v)}
              placeholder="Masukkan nama lengkap"
            />
          )}
          {!isLogin && role === "hrd" && (
            <AuthFormField
              label="Perusahaan"
              type="text"
              name="company"
              autoComplete="organization"
              required={!isLogin && role === "hrd"}
              minLength={2}
              maxLength={160}
              value={formData.company}
              onChange={(v) => onFieldChange("company", v)}
              placeholder="Nama perusahaan Anda"
            />
          )}
          <AuthFormField
            label="Email"
            type="email"
            name="email"
            autoComplete="email"
            required
            value={formData.email}
            onChange={(v) => onFieldChange("email", v)}
            placeholder="anda@email.com"
          />
          <AuthFormField
            label="Kata Sandi"
            type="password"
            name="password"
            autoComplete={isLogin ? "current-password" : "new-password"}
            required
            minLength={isLogin ? undefined : 8}
            maxLength={isLogin ? undefined : 72}
            value={formData.password}
            onChange={(v) => onFieldChange("password", v)}
            placeholder="••••••••"
          />
        </>
      )}

      {showDocs && (
        <div className="space-y-4 rounded-2xl border border-hairline p-4">
          <div>
            <p className="text-[14px] font-semibold text-ink">Dokumen Legalitas Perusahaan</p>
            <p className="text-[12px] text-ink-muted mt-1">
              Buat verifikasi, hindarin perusahaan bodong. Data ini gak ditampilin ke kandidat.
            </p>
          </div>
          <AuthFileField
            label="Akta Pendirian & SK Kemenkumham"
            file={companyDocs.aktaPendirian}
            onChange={(f) => onDocChange("aktaPendirian", f)}
            required
          />
          <AuthFileField
            label="NIB"
            hint="(Nomor Induk Berusaha)"
            file={companyDocs.nib}
            onChange={(f) => onDocChange("nib", f)}
            required
          />
          <AuthFileField
            label="NPWP Perusahaan"
            file={companyDocs.npwp}
            onChange={(f) => onDocChange("npwp", f)}
            required
          />
          <AuthFileField
            label="Surat Kuasa"
            hint="(opsional, kalau bukan direktur utama)"
            file={companyDocs.suratKuasa}
            onChange={(f) => onDocChange("suratKuasa", f)}
          />
        </div>
      )}

      {isLogin && (
        <div className="-mt-1 text-right">
          <Link href="/auth/forgot-password" className="text-[13px] font-medium text-primary hover:underline">
            Lupa password?
          </Link>
        </div>
      )}

      {isHrdRegister && step === 1 ? (
        <button
          type="button"
          onClick={handleNext}
          className="w-full flex items-center justify-center gap-2 btn-primary !py-4 !text-[16px] mt-6"
        >
          Lanjut
          <ArrowRight className="w-4 h-4" />
        </button>
      ) : (
        <div className="mt-6 flex items-center gap-3">
          {isHrdRegister && step === 2 && (
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex items-center justify-center gap-2 rounded-full border border-hairline px-5 !py-4 text-[16px] font-semibold text-ink hover:bg-surface-muted"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 flex items-center justify-center gap-2 btn-primary !py-4 !text-[16px] disabled:opacity-60"
          >
            {isSubmitting ? "Memproses..." : isLogin ? "Masuk" : "Buat Akun Gratis"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </form>
  );
}

const STEPS = ["Akun", "Dokumen"] as const;

function StepIndicator({ step }: { step: number }) {
  return (
    <div className="flex items-center pb-2">
      {STEPS.map((label, i) => {
        const n = i + 1;
        const done = step > n;
        const current = step === n;
        const isLast = n === STEPS.length;
        return (
          <div key={label} className={`flex items-center ${isLast ? "" : "flex-1"}`}>
            <div className="flex items-center gap-2.5">
              <span
                className={`grid size-7 shrink-0 place-items-center rounded-full text-[12px] font-bold transition-colors ${
                  done || current
                    ? "bg-primary text-white"
                    : "bg-surface-muted text-ink-muted ring-1 ring-hairline"
                } ${current ? "ring-4 ring-primary/15" : ""}`}
              >
                {done ? <Check className="size-4" strokeWidth={3} /> : n}
              </span>
              <span
                className={`text-[13px] font-semibold transition-colors ${
                  current || done ? "text-ink" : "text-ink-muted"
                }`}
              >
                {label}
              </span>
            </div>
            {!isLast && (
              <div className="mx-3 h-0.5 flex-1 overflow-hidden rounded-full bg-hairline">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-300"
                  style={{ width: step > n ? "100%" : "0%" }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
