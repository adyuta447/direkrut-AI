import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function AuthMobileNav() {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-hairline lg:border-b-0">
      <Link
        href="/"
        className="flex items-center gap-2 text-[14px] font-semibold text-ink-muted hover:text-ink transition-none"
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali
      </Link>
      <span className="text-[14px] font-semibold uppercase lg:hidden text-ink">Direkrut AI</span>
      <div className="w-8 h-8 lg:hidden"></div>
    </div>
  );
}
