type Role = "applicant" | "hrd";

interface AuthFormFooterProps {
  isLogin: boolean;
  role: Role;
  onQuickAccess: () => void;
  onToggleMode: () => void;
}

export function AuthFormFooter({ isLogin, role, onQuickAccess, onToggleMode }: AuthFormFooterProps) {
  return (
    <>
      <div className="mt-6 border-t border-hairline pt-6">
        <button
          onClick={onQuickAccess}
          className="w-full flex items-center justify-center gap-3 border border-primary text-primary py-3 text-[14px] font-semibold hover:bg-primary hover:text-white transition-none"
        >
          Masuk Akses Cepat (Demo)
        </button>
      </div>

      <p className="text-[14px] text-ink-muted mt-8">
        {isLogin ? "Belum punya akun? " : "Sudah punya akun? "}
        <button onClick={onToggleMode} className="text-primary font-semibold hover:underline">
          {isLogin ? "Daftar" : "Masuk"}
        </button>
      </p>

      <p className="text-[12px] text-ink-muted mt-2">
        Masuk sebagai <span className="font-semibold text-ink">{role === "applicant" ? "Kandidat" : "HRD"}</span>
      </p>
    </>
  );
}
