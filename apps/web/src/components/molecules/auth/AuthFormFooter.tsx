import Link from "next/link";

type Role = "candidate" | "hrd";

interface AuthFormFooterProps {
  isLogin: boolean;
  role: Role;
}

export function AuthFormFooter({ isLogin, role }: AuthFormFooterProps) {
  return (
    <>
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
