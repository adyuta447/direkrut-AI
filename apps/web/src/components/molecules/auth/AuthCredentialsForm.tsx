import { ArrowRight } from "lucide-react";
import { AuthFormField } from "../../atoms/auth/AuthFormField";

type Role = "candidate" | "hrd";

export interface AuthFormData {
  name: string;
  email: string;
  password: string;
  company: string;
}

interface AuthCredentialsFormProps {
  isLogin: boolean;
  role: Role;
  formData: AuthFormData;
  onFieldChange: (field: keyof AuthFormData, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting?: boolean;
}

export function AuthCredentialsForm({
  isLogin,
  role,
  formData,
  onFieldChange,
  onSubmit,
  isSubmitting,
}: AuthCredentialsFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {!isLogin && (
        <AuthFormField
          label="Nama Lengkap"
          type="text"
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
        required
        value={formData.email}
        onChange={(v) => onFieldChange("email", v)}
        placeholder="anda@email.com"
      />
      <AuthFormField
        label="Kata Sandi"
        type="password"
        required
        minLength={isLogin ? undefined : 8}
        maxLength={isLogin ? undefined : 72}
        value={formData.password}
        onChange={(v) => onFieldChange("password", v)}
        placeholder="••••••••"
      />
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex items-center justify-center gap-2 btn-primary !py-3.5 mt-6 disabled:opacity-60"
      >
        {isSubmitting ? "Memproses..." : isLogin ? "Masuk" : "Buat Akun Gratis"}
        <ArrowRight className="w-4 h-4" />
      </button>
    </form>
  );
}
