import * as React from "react";
import Image from "next/image";
import { BotIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TypingDots } from "@/components/atoms/shared/TypingDots";

function AILoadingState({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex w-full flex-col items-center gap-4 rounded-2xl bg-white px-6 py-8 text-center">
      <Image
        src="/status/loading.svg"
        alt=""
        width={200}
        height={155}
        unoptimized
        className="pointer-events-none h-24 w-auto select-none animate-pulse"
      />
      {/* panel selalu putih solid, jadi teks pakai neutral tetap (bukan token) supaya kebaca di dark mode */}
      <div className="space-y-1">
        <p className="text-[18px] font-semibold text-neutral-900">{title}</p>
        <p className="text-[14px] text-neutral-600">{subtitle}</p>
      </div>
      <TypingDots />
    </div>
  );
}

interface ProfileAIBannerProps {
  isUploading: boolean;
  isSimulatingAI: boolean;
  onFileSelected: (file: File) => void;
}

export function ProfileAIBanner({
  isUploading,
  isSimulatingAI,
  onFileSelected,
}: ProfileAIBannerProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  return (
    <Card className="rounded-3xl border border-hairline bg-badge-neutral text-white shadow-none ring-0 overflow-hidden relative">
      <div className="absolute top-0 right-0 p-4 opacity-15">
        <BotIcon className="size-24 text-white" />
      </div>
      <CardHeader className="relative z-10 pb-4">
        <CardTitle className="text-[20px] font-semibold text-white flex items-center gap-2">
          <BotIcon className="size-5 text-white" />
          Isi Profil Otomatis dengan AI
        </CardTitle>
        <CardDescription className="text-base text-white/80">
          Nggak perlu isi profil dari nol. Upload CV kamu (PDF/JPG/PNG), biar
          Direkrut AI yang lengkapi otomatis. CV di sini cuma buat bantu isi
          profil, nanti pas apply kamu tetap upload CV khusus untuk HR.
        </CardDescription>
      </CardHeader>
      <CardContent className="relative z-10">
        {isUploading ? (
          <AILoadingState
            title="Mengunggah CV kamu…"
            subtitle="Sebentar ya, file kamu lagi dikirim."
          />
        ) : isSimulatingAI ? (
          <AILoadingState
            title="AI lagi baca CV kamu…"
            subtitle="Membaca pengalaman kerja, pendidikan, dan skills."
          />
        ) : (
          <div
            className="border-2 border-dashed border-white/40 bg-white/10 rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-colors cursor-pointer hover:border-white"
            onClick={() => inputRef.current?.click()}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              className="sr-only"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onFileSelected(file);
                e.target.value = "";
              }}
            />
            <div className="flex flex-col items-center gap-4">
              <Image
                src="/dashboard/add_file.svg"
                alt=""
                width={160}
                height={120}
                unoptimized
                className="pointer-events-none h-24 w-auto select-none"
              />
              <div>
                <p className="font-medium text-lg">Klik buat upload CV kamu</p>
                <p className="text-sm text-white/75 mt-1">
                  Sistem kami akan mengisi seluruh kolom di bawah secara
                  otomatis.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
