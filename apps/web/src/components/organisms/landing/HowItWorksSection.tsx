import Image from "next/image";

const steps = [
  {
    number: "01",
    tab: "Upload CV",
    title: "Melamar cuma butuh beberapa menit",
    desc: "Cukup upload CV, sistem AI langsung membaca riwayat kerja dan skill kamu. Nggak ada lagi formulir panjang.",
    img: "/file.svg",
    alt: "Ilustrasi upload dokumen CV",
  },
  {
    number: "02",
    tab: "Validasi Skill",
    title: "Skill kamu divalidasi otomatis",
    desc: "Jawab beberapa pertanyaan singkat, sisanya dinilai AI. Objektif, konsisten, dan adil untuk semua kandidat.",
    img: "/ai.svg",
    alt: "Ilustrasi validasi skill",
  },
  {
    number: "03",
    tab: "Interview AI",
    title: "Interview video sesuai waktumu",
    desc: "Sesi interview tahap pertama dipandu AI. Kamu bebas pilih waktu sendiri tanpa menunggu jadwal rekruter.",
    img: "/interview.svg",
    alt: "Ilustrasi interview video",
  },
  {
    number: "04",
    tab: "Pantau Status",
    title: "Status lamaran selalu kelihatan, nggak digantung",
    desc: "Pantau progres lamaranmu kapan saja, lengkap dengan skor kecocokan dan alasan di balik setiap penilaian.",
    img: "/status.svg",
    alt: "Ilustrasi pantau status lamaran",
  },
];

const STACK_OFFSET = 64;

export function HowItWorksSection() {
  return (
    <section className="pb-24 px-6 lg:px-10 max-w-[1584px] mx-auto">
      <div className="mb-14 max-w-3xl" data-reveal>
        <p className="flex items-center gap-3 text-[12px] font-medium text-ink-muted uppercase tracking-[0.2em] mb-6">
          Cara Kerja
        </p>
        <h2 className="text-[clamp(36px,4.5vw,60px)] font-bold leading-[1.1] tracking-[-0.02em] text-ink">
          Prosesnya jelas, kamu selalu tau ada di tahap mana
        </h2>
      </div>
      <div className="space-y-8">
        {steps.map((step, i) => {
          const tone = i % 2 === 0 ? "bg-primary" : "bg-brand-accent";
          return (
            <div
              key={step.number}
              className="folder-step sticky"
              style={{ top: `${120 + i * STACK_OFFSET}px` }}
            >
              <div className="folder-inner">
                <div
                  className={`${tone} h-12 w-fit min-w-[200px] sm:min-w-[240px] rounded-tl-2xl flex items-center gap-3 pl-6 pr-14 text-white`}
                  style={{
                    clipPath:
                      "polygon(0 0, calc(100% - 32px) 0, 100% 100%, 0 100%)",
                  }}
                >
                  <span className="text-[13px] text-white/70 tabular-nums">
                    {step.number}
                  </span>
                  <span className="text-[14px] font-medium whitespace-nowrap">
                    {step.tab}
                  </span>
                </div>
                <div
                  className={`${tone} text-white rounded-b-[28px] rounded-tr-[28px] px-6 sm:px-10 lg:px-14 pt-10 lg:pt-12 pb-10 lg:pb-14 min-h-[340px] grid lg:grid-cols-12 gap-8 lg:gap-12 items-center`}
                >
                  <div className="lg:col-span-7">
                    <p className="text-[13px] font-medium uppercase tracking-[0.22em] text-white/60 mb-5">
                      Tahap {step.number} dari 04
                    </p>
                    <h3 className="text-[clamp(32px,4vw,58px)] font-bold leading-[1.05] tracking-[-0.02em] max-w-2xl mb-6">
                      {step.title}
                    </h3>
                    <p className="text-[16px] lg:text-[18px] text-white/80 leading-[1.7] max-w-xl">
                      {step.desc}
                    </p>
                  </div>
                  <div className="lg:col-span-5 flex justify-center lg:justify-end">
                    <div className="rounded-2xl p-6 sm:p-8 rotate-[1.5deg] w-full max-w-[340px]">
                      <Image
                        src={step.img}
                        alt={step.alt}
                        height={36}
                        width={44}
                        className="w-full h-36 sm:h-44 object-contain"
                        loading="lazy"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
