import {
  ShieldCheck,
  Target,
  ScanEye,
  Video,
  CalendarCheck,
  Eye,
  LucideIcon,
} from "lucide-react";
import { TiltCard } from "../../atoms/shared/TiltCard";

const features: { icon: LucideIcon; title: string; desc: string }[] = [
  {
    icon: ShieldCheck,
    title: "Validasi Skill Otomatis",
    desc: "Sistem AI mengecek skill teknis kamu lebih dalam, bukan cuma percaya pada yang tertulis di CV. Kemampuan asli pasti kelihatan.",
  },
  {
    icon: Target,
    title: "Rekomendasi Posisi yang Relevan",
    desc: "Kalau ada posisi lain yang lebih cocok dengan profil kamu, sistem akan kasih tau. Peluang kariermu jadi lebih luas.",
  },
  {
    icon: ScanEye,
    title: "Deteksi Integritas Jawaban",
    desc: "Jawaban yang nggak otentik atau sepenuhnya dibuat AI akan terdeteksi. Kandidat yang jawab jujur nggak akan dirugikan.",
  },
  {
    icon: Video,
    title: "Interview Video Berbasis AI",
    desc: "Interview tahap pertama dipandu penuh oleh AI. Hasilnya terstruktur, prosesnya cepat, dan hemat waktu untuk kamu maupun rekruter.",
  },
  {
    icon: CalendarCheck,
    title: "Penjadwalan Mandiri",
    desc: "Atur sesi interview dengan tim HRD langsung dari platform. Tinggal pilih slot yang paling pas dengan waktumu.",
  },
  {
    icon: Eye,
    title: "Skor yang Transparan",
    desc: "Skor kecocokan kamu bukan kotak hitam. Setiap penilaian disertai bukti kutipan langsung dari dokumen lamaranmu.",
  },
];

export function FeaturesSection() {
  return (
    <section className="pb-24 px-6 lg:px-10 max-w-[1584px] mx-auto">
      <div className="mb-14 max-w-3xl" data-reveal>
        <p className="flex items-center gap-3 text-[12px] font-medium text-ink-muted uppercase tracking-[0.2em] mb-6">
          Fitur Utama
        </p>
        <h2 className="text-[clamp(36px,4.5vw,60px)] font-light leading-[1.1] tracking-[-0.02em] text-ink">
          Fitur kelas enterprise, pakainya tetap gampang
        </h2>
      </div>

      <div
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"
        data-reveal-group
      >
        {features.map((feature) => (
          <div key={feature.title} data-reveal-item>
            <TiltCard className="h-full">
              <div className="rounded-3xl bg-surface-1 p-8 lg:p-10 transition-none h-full">
                <span className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-canvas text-primary mb-6">
                  <feature.icon className="w-5 h-5" strokeWidth={1.5} />
                </span>
                <h3 className="text-[22px] font-normal leading-[1.33] mb-3 text-ink">
                  {feature.title}
                </h3>
                <p className="text-[14px] text-ink-muted leading-[1.6]">
                  {feature.desc}
                </p>
              </div>
            </TiltCard>
          </div>
        ))}
      </div>
    </section>
  );
}
