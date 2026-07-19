"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { type FormEvent, type ReactNode, useState } from "react";
import { AlertCircle, ArrowRight, CheckCircle2 } from "lucide-react";
import { ApiError } from "@/services/apiClient";
import { logout, requestPasswordReset, resetPassword } from "@/services/authService";
import { AuthFormField } from "../../atoms/auth/AuthFormField";
import { AuthMobileNav } from "../../molecules/auth/AuthMobileNav";
import { AuthMarketingPanel } from "./AuthMarketingPanel";

type FeedbackKind = "error" | "success";

interface FeedbackProps {
  kind: FeedbackKind;
  message: string;
}

const feedbackStyles: Record<FeedbackKind, string> = {
  error: "bg-destructive text-white",
  success: "bg-success text-white",
};
const maxPasswordBytes = 72;
const passwordEncoder = new TextEncoder();

function Feedback({ kind, message }: FeedbackProps) {
  const Icon = kind === "success" ? CheckCircle2 : AlertCircle;

  return (
    <div
      role={kind === "error" ? "alert" : "status"}
      aria-live={kind === "error" ? "assertive" : "polite"}
      className={`my-4 flex items-center gap-3 rounded-2xl px-5 py-4 ${feedbackStyles[kind]}`}
    >
      <Icon className="size-5 shrink-0" />
      <p className="text-[15px] font-semibold leading-snug">{message}</p>
    </div>
  );
}

interface AuthResetShellProps {
  kicker: string;
  title: string;
  children: ReactNode;
}

function AuthResetShell({ kicker, title, children }: AuthResetShellProps) {
  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col lg:flex-row font-sans">
      <AuthMarketingPanel />

      <div className="flex-1 flex flex-col min-h-screen lg:min-h-0 bg-canvas">
        <AuthMobileNav />
        <div className="flex-1 flex items-center justify-center px-6 py-10">
          <div className="w-full max-w-[420px]">
            <div className="mb-8">
              <p className="text-[12px] font-medium uppercase tracking-[0.2em] text-ink-muted mb-4">
                {kicker}
              </p>
              <h1 className="text-[clamp(30px,3vw,40px)] font-bold leading-[1.15] text-ink">
                {title}
              </h1>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSent(false);
    setIsSubmitting(true);

    try {
      await requestPasswordReset(email);
      setSent(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Gagal mengirim tautan reset. Coba lagi sebentar lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthResetShell kicker="Reset kata sandi" title="Reset password lewat email.">
      {error && <Feedback kind="error" message={error} />}
      {sent && (
        <Feedback
          kind="success"
          message="Kalau email terdaftar, tautan ganti password sudah dikirim. Cek inbox atau spam."
        />
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthFormField
          label="Email"
          type="email"
          name="email"
          autoComplete="email"
          required
          value={email}
          onChange={setEmail}
          placeholder="anda@email.com"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 btn-primary !py-3.5 mt-6 disabled:opacity-60"
        >
          {isSubmitting ? "Mengirim..." : "Kirim Tautan"}
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      <p className="text-[14px] text-ink-muted mt-8 text-center">
        Ingat password?{" "}
        <Link href="/auth/login" className="text-primary font-medium hover:underline">
          Masuk di sini
        </Link>
      </p>
    </AuthResetShell>
  );
}

export function ResetPasswordScreen() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(token ? null : "Tautan reset password tidak valid.");
  const [done, setDone] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setDone(false);

    if (!token) {
      setError("Tautan reset password tidak valid.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Konfirmasi password belum sama.");
      return;
    }
    if (passwordEncoder.encode(newPassword).length > maxPasswordBytes) {
      setError("Password terlalu panjang.");
      return;
    }

    setIsSubmitting(true);
    try {
      await resetPassword(token, newPassword);
      logout();
      setDone(true);
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Gagal mengganti password. Coba lagi sebentar lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthResetShell kicker="Buat password baru" title="Buat sandi baru.">
      {error && <Feedback kind="error" message={error} />}
      {done && <Feedback kind="success" message="Password berhasil diganti. Silakan masuk dengan password baru." />}

      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthFormField
          label="Password"
          type="password"
          name="newPassword"
          autoComplete="new-password"
          required
          minLength={8}
          maxLength={72}
          value={newPassword}
          onChange={setNewPassword}
          placeholder="Minimal 8 karakter"
        />
        <AuthFormField
          label="Ulangi Password"
          type="password"
          name="confirmPassword"
          autoComplete="new-password"
          required
          minLength={8}
          maxLength={72}
          value={confirmPassword}
          onChange={setConfirmPassword}
          placeholder="Ulangi password baru"
        />
        <button
          type="submit"
          disabled={isSubmitting || !token}
          className="w-full flex items-center justify-center gap-2 btn-primary !py-3.5 mt-6 disabled:opacity-60"
        >
          {isSubmitting ? "Menyimpan..." : "Simpan"}
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      <p className="text-[14px] text-ink-muted mt-8 text-center">
        Sudah diganti?{" "}
        <Link href="/auth/login" className="text-primary font-medium hover:underline">
          Masuk di sini
        </Link>
      </p>
    </AuthResetShell>
  );
}
