import { RoleToggle } from "../../molecules/auth/RoleToggle";
import { AuthCredentialsForm, AuthFormData } from "../../molecules/auth/AuthCredentialsForm";
import { AuthFormFooter } from "../../molecules/auth/AuthFormFooter";

type Role = "applicant" | "hrd";
export type { AuthFormData };

interface AuthFormProps {
  isLogin: boolean;
  role: Role;
  formData: AuthFormData;
  onRoleChange: (role: Role) => void;
  onFieldChange: (field: keyof AuthFormData, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onQuickAccess: () => void;
  onToggleMode: () => void;
}

export function AuthForm({
  isLogin, role, formData, onRoleChange, onFieldChange, onSubmit, onQuickAccess, onToggleMode,
}: AuthFormProps) {
  return (
    <div className="w-full max-w-[400px]">
      <div className="mb-8">
        <p className="text-[14px] font-semibold uppercase text-ink-muted mb-4">
          {isLogin ? "Selamat Datang Kembali" : "Mulai Sekarang"}
        </p>
        <h1 className="text-[32px] font-light leading-[1.25] text-ink">
          {isLogin ? "Masuk ke Direkrut AI" : "Buat Akun Anda"}
        </h1>
      </div>

      <RoleToggle role={role} onChange={onRoleChange} />
      <AuthCredentialsForm isLogin={isLogin} role={role} formData={formData} onFieldChange={onFieldChange} onSubmit={onSubmit} />
      <AuthFormFooter isLogin={isLogin} role={role} onQuickAccess={onQuickAccess} onToggleMode={onToggleMode} />
    </div>
  );
}
