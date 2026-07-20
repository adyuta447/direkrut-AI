import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

export function AuthMobileNav() {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-hairline bg-canvas">
      {/* Kiri: Logo (Mobile) atau Tombol Kembali (Desktop) */}
      <div className="flex items-center">
        {/* Logo hanya muncul di layar mobile */}
        <Link href="/" className="flex lg:hidden items-center hover:opacity-90 transition-opacity">
          <Image
            src="/logo/Direkrut%20AI_WhiteMode.png"
            className="block dark:hidden h-6 w-auto"
            width={117}
            height={24}
            alt="Direkrut AI Logo"
          />
          <Image
            src="/logo/Direkrut%20AI_DarkMode.png"
            className="hidden dark:block h-6 w-auto"
            width={117}
            height={24}
            alt="Direkrut AI Logo"
          />
        </Link>

        {/* Tombol Kembali hanya muncul di layar desktop */}
        <Link
          href="/"
          className="hidden lg:flex items-center gap-1.5 text-[14px] font-sans font-bold text-ink-muted hover:text-ink transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Beranda
        </Link>
      </div>

      {/* Kanan: Tombol Kembali (Mobile) */}
      <div className="flex lg:hidden">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-[14px] font-sans font-bold text-ink-muted hover:text-ink transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali
        </Link>
      </div>
    </div>
  );
}
