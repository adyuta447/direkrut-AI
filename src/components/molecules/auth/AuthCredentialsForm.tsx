import { ArrowRight } from "lucide-react";
import { AuthFormField } from "../../atoms/auth/AuthFormField";

type Role = "applicant" | "hrd";

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
}

export function AuthCredentialsForm({ isLogin, role, formData, onFieldChange, onSubmit }: AuthCredentialsFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {!isLogin && (
        <AuthFormField
          label="Nama Lengkap"
          type="text"
          required={!isLogin}
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
        value={formData.password}
        onChange={(v) => onFieldChange("password", v)}
        placeholder="••••••••"
      />
      <button type="submit" className="w-full flex items-center justify-between gap-2 btn-primary mt-6">
        {isLogin ? "Masuk" : "Buat Akun"}
        <ArrowRight className="w-4 h-4" />
      </button>
    </form>
  );
}
