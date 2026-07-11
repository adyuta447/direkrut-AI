import { Award } from "lucide-react";
import { SiteHeader } from "../../components/organisms/shared/SiteHeader";
import { SiteFooter } from "../../components/organisms/shared/SiteFooter";
import { CtaBanner } from "../../components/organisms/landing/CtaBanner";
import { FooterRevealBody } from "../../components/atoms/shared/FooterRevealBody";
import Image from "next/image";

const values = [
  {
    number: "01",
    title: "Transparan dari awal",
    desc: "Nggak ada skor kotak hitam, nggak ada kandidat digantung. Semua penilaian bisa dilihat alasannya, semua status bisa dipantau.",
  },
  {
    number: "02",
    title: "Kandidat duluan",
    desc: "Fitur kami dibangun dari keresahan pencari kerja, bukan cuma kebutuhan perusahaan. Kalau kandidat nyaman, hasil rekrutmennya ikut bagus.",
  },
  {
    number: "03",
    title: "Serius di teknologi, santai di bahasa",
    desc: "AI-nya kami bangun sungguh-sungguh, tapi cara kami ngomong tetap manusiawi. Teknologi canggih nggak harus terdengar kaku.",
  },
];

const team = [
  {
    name: "Raffi Rabbani Widyputra",
    role: "Software Engineer & Head of Software Development",
    photo: "/profiles/1781936260111.jpeg",
    bio: "Fullstack engineer yang nyaman di dua dunia: frontend Next.js dan Vue, backend Golang dan NestJS. Plus urusan DevOps dari CI/CD sampai Kubernetes.",
    skills: [
      "Next.js & Vue.js",
      "Golang & NestJS",
      "DevOps & Kubernetes",
      "Redis",
    ],
    achievements: [
      "Backend Developer Pemira Pusat Politeknik Negeri Jakarta",
      "Web Application Developer IEEE Student Branch PNJ",
      "Semifinalis Coding & Algorithms Tournament 2026",
    ],
  },
  {
    name: "Jan Agra Adyuta Harnowo",
    role: "Co-Founder & Front-End Engineer",
    photo: "/profiles/yuta.jpeg",
    bio: "5+ tahun di front-end development dan cyber security. Ngebangun web app yang modern, aman, dan kencang, sambil ngurus dua perusahaan sekaligus.",
    skills: ["React.js & Next.js", "Cyber Security", "GraphQL", "React Native"],
    achievements: [
      "Juara 1 Best Marketing Team, Business Plan Competition Innovare UI 2025",
      "Juara 2 Hackathon Computer Science Festival 2025 (Smart Lost & Found System)",
      "Semifinalis International Business Case Competition Ganesha Festival ITB 2026",
      "Semifinalis Business Plan Competition IYREF ITB 2026",
      "Semifinalis (Top 3) Business Plan Competition Vorment UI 2024",
      "Semifinalis Business Plan Competition UI Innovation War 2024",
      "Semifinalis National Digital League Web Development 2024 (Skilvul)",
      "Olimpiade Sains Nasional bidang Informatika 2023 & 2024 (Perpusnas)",
      "Olimpiade Nasional bidang Geografi, Universitas Indonesia 2023",
    ],
  },
  {
    name: "Randi Adam Arnaldi",
    role: "Cyber Security Specialist & CTF Player",
    photo: "/profiles/randi.jpeg",
    bio: "Hidupnya di dunia CTF dan keamanan siber. Tugasnya mastiin sistem kami nggak gampang dibobol, karena dia yang paling jago nyari celahnya duluan.",
    skills: ["Penetration Testing", "Linux", "Python & MySQL", "Generative AI"],
    achievements: [
      "Juara 2 Kategori Cybersecurity KMIPN 2025",
      "Juara 2 CTF Cyberwave 1.0",
      "Finalis Cybersecurity Itechnocup 2025 & kontestan CTF IDSECCONF 2025",
    ],
  },
  {
    name: "Alief Athallah Putra",
    role: "Network Engineer & Vice Chief Scientific Club",
    photo: "/profiles/alief.jpeg",
    bio: "Spesialis jaringan dari fiber optic sampai NOC. Pernah pegang provisioning di PGNCOM, sekarang jadi mentor network engineering buat para juniornya.",
    skills: [
      "Network Engineering",
      "Fiber Optic & Cabling",
      "Cisco",
      "HTML, CSS & JS",
    ],
    achievements: [
      "Juara 2 LKS Information Network Cabling",
      "Provisioning Engineer PGNCOM",
      "Mentor Network Engineer & anggota Student Council",
    ],
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-canvas text-ink font-sans overflow-x-clip">
      <FooterRevealBody>
        <SiteHeader />

        {/* Hero */}
        <section className="relative overflow-hidden bg-black">
          <Image
            src="/map.png"
            alt=""
            aria-hidden="true"
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-70"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent"
          />

          <div className="relative max-w-[1584px] mx-auto px-6 lg:px-10 py-24 lg:py-32">
            <p className="text-[12px] font-medium text-white/60 uppercase tracking-[0.2em] mb-6">
              Tentang Kami
            </p>
            <h1 className="text-[clamp(40px,5.5vw,76px)] font-bold leading-[1.02] tracking-[-0.02em] mb-8 text-white max-w-3xl">
              Tim kecil, misinya gede:{" "}
              <span className="text-[#93c5fd]">
                bikin cari kerja nggak ribet lagi.
              </span>
            </h1>
            <p className="text-[17px] lg:text-[18px] text-white/70 leading-[1.7] max-w-xl">
              Direkrut AI lahir dari keresahan sederhana: proses rekrutmen itu
              kelamaan, kandidat sering digantung, dan skill nyata kalah sama CV
              yang bagus doang. Jadi kami bangun AI yang menilai kemampuan
              beneran, dan bikin semua prosesnya transparan.
            </p>
          </div>
        </section>

        {/* Misi */}
        <section className="py-24 px-6 lg:px-10 max-w-[1584px] mx-auto">
          <div className="grid lg:grid-cols-12 gap-8">
            <p className="lg:col-span-3 text-[12px] font-medium text-ink-muted uppercase tracking-[0.2em]">
              Misi Kami
            </p>
            <h2 className="lg:col-span-9 text-[clamp(28px,3.5vw,52px)] font-bold leading-[1.15] tracking-[-0.01em] text-ink max-w-4xl">
              Kami percaya skill nyata lebih penting daripada koneksi.
              <span className="text-primary">
                {" "}
                AI kami dibangun buat ngebuktiin itu.
              </span>{" "}
              Satu kandidat, satu perusahaan, satu proses rekrutmen dalam satu
              waktu.
            </h2>
          </div>
        </section>

        <section className="pb-24 px-6 lg:px-10 max-w-[1584px] mx-auto">
          <div className="grid md:grid-cols-3 gap-4">
            {values.map((value) => (
              <div
                key={value.number}
                className="rounded-2xl bg-surface-1 p-8 lg:p-10"
              >
                <p className="text-[15px] font-normal text-primary tabular-nums mb-6">
                  {value.number}
                </p>
                <h3 className="text-[22px] font-semibold leading-[1.3] mb-3 text-ink">
                  {value.title}
                </h3>
                <p className="text-[14px] text-ink-muted leading-[1.6]">
                  {value.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Tim */}
        <section className="pb-24 px-6 lg:px-10 max-w-[1584px] mx-auto">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center mb-14">
            <div className="lg:col-span-7">
              <p className="text-[12px] font-medium text-ink-muted uppercase tracking-[0.2em] mb-6">
                Tim Kami
              </p>
              <h2 className="text-[clamp(36px,4.5vw,60px)] font-bold leading-[1.1] tracking-[-0.02em] text-ink mb-5">
                Orang-orang di balik semuanya
              </h2>
              <p className="text-[16px] text-ink-muted leading-[1.6] max-w-xl">
                Empat engineer, satu obsesi: proses rekrutmen yang cepat, adil,
                dan nggak bikin siapa pun digantung. Dari front-end sampai
                keamanan jaringan, semuanya ada.
              </p>
            </div>
            <div className="lg:col-span-5">
              <Image
                height={52}
                width={100}
                src="/team.svg"
                alt="Ilustrasi tim Direkrut AI"
                className="w-full h-52 lg:h-64 object-contain"
                loading="lazy"
              />
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-4">
            {team.map((member) => (
              <div
                key={member.name}
                className="rounded-3xl border border-hairline p-8 flex flex-col"
              >
                <div className="flex items-center gap-5 mb-6">
                  <Image
                    src={member.photo}
                    alt={`Foto ${member.name}`}
                    width={150}
                    height={150}
                    quality={80}
                    className="w-20 h-20 rounded-full object-cover flex-shrink-0"
                    loading="lazy"
                  />
                  <div className="min-w-0">
                    <h3 className="text-[20px] font-semibold text-ink leading-[1.3]">
                      {member.name}
                    </h3>
                    <p className="text-[13px] font-medium text-primary mt-1">
                      {member.role}
                    </p>
                  </div>
                </div>

                <p className="text-[14px] text-ink-muted leading-[1.6] mb-6">
                  {member.bio}
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {member.skills.map((skill) => (
                    <span
                      key={skill}
                      className="text-[12px] rounded-full bg-surface-1 px-3 py-1.5 text-ink"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="mt-auto border-t border-hairline pt-5">
                  <p className="text-[11px] font-medium text-ink-muted uppercase tracking-[0.18em] mb-3">
                    Pencapaian
                  </p>
                  <ul className="space-y-2.5">
                    {member.achievements.map((achievement) => (
                      <li
                        key={achievement}
                        className="flex gap-2.5 text-[13px] text-ink-muted leading-[1.5]"
                      >
                        <Award
                          className="w-4 h-4 text-primary flex-shrink-0 mt-0.5"
                          strokeWidth={1.5}
                        />
                        {achievement}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        <CtaBanner />
      </FooterRevealBody>
      <SiteFooter />
    </div>
  );
}
