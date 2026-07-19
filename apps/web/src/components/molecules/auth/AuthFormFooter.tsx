import Link from "next/link";
import { Zap } from "lucide-react";

type Role = "candidate" | "hrd";

interface AuthFormFooterProps {
  isLogin: boolean;
  role: Role;
  onQuickAccess: () => void;
  isSubmitting?: boolean;
}

export function AuthFormFooter({ isLogin, role, onQuickAccess, isSubmitting }: AuthFormFooterProps) {
  return (
    <>
      {role === "hrd" && (
        <div className="mt-6 border-t border-hairline pt-6">
          <button
            onClick={onQuickAccess}
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 border border-hairline text-ink rounded-full py-3.5 text-[14px] font-medium hover:border-primary hover:text-primary transition-none disabled:opacity-60"
          >
            <Zap className="w-4 h-4" strokeWidth={1.5} />
            Coba Akses Cepat (Demo)
          </button>
        </div>
      )}

      <p className="text-[14px] text-ink-muted mt-8 text-center">
        {isLogin ? "Belum punya akun? " : "Udah punya akun? "}
        <Link
          href={isLogin ? "/auth/register" : "/auth/login"}
          className="text-primary font-medium hover:underline"
        >
          {isLogin ? "Daftar sekarang" : "Masuk di sini"}
        </Link>
      </p>

      <p className="text-[12px] text-ink-muted mt-2 text-center">
        Kamu akan masuk sebagai{" "}
        <span className="font-medium text-ink">{role === "candidate" ? "Kandidat" : "HRD"}</span>
      </p>
    </>
  );
}
