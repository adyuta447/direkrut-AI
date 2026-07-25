"use client";

import Image from "next/image";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { X } from "lucide-react";

const team = [
  {
    name: "Raffi Rabbani Widyputra",
    title: "Software Engineer",
    role: "Chief Executive Officer",
    photo: "/profiles/1781936260111.jpeg",
    bio: "Fullstack engineer yang nyaman di dua dunia: frontend Next.js dan Vue, backend Golang dan NestJS. Raffi memastikan fondasi produk Direkrut AI tetap cepat, stabil, dan siap berkembang.",
    skills: ["Next.js & Vue.js", "Golang & NestJS", "DevOps & Kubernetes"],
    highlights: [
      "Backend Developer Pemira Pusat Politeknik Negeri Jakarta",
      "Web Application Developer IEEE Student Branch PNJ",
      "Semifinalis Coding & Algorithms Tournament 2026",
    ],
  },
  {
    name: "Jan Agra Adyuta Harnowo",
    title: "Komisaris CV. Digital Awan Nusantara",
    role: "Chief Marketing Officer",
    photo: "/profiles/yuta.jpeg",
    bio: "Berbekal lebih dari lima tahun di front-end development dan cyber security, Jan membangun pengalaman produk yang modern, aman, dan tetap mudah dipakai oleh kandidat maupun rekruter. Bertanggung jawab untuk menetapkan operasional, administrasi, legalitas, produk seperti serta arah strategis untuk CV. Digital Awan Nusantara. Beliau juga menjadi komisaris yang bertanggung jawab memegang saham Digital Awan Nusantara.",
    skills: ["React.js & Next.js", "Cyber Security", "GraphQL", "React Native"],
    highlights: [
      "Juara 1 Best Marketing Team, Business Plan Competition Innovare UI 2025",
      "Juara 2 Hackathon Computer Science Festival 2025",
      "Semifinalis International Business Case Competition Ganesha Festival ITB 2026",
      "Semifinalis Business Plan Competition IYREF ITB 2026",
      "Top 3 Semifinalist in Business Plan Competition by Vorment UI 2024",
      "Semifinalis Business Plan Competition UI Innovation War 2024",
      "Semifinalis National Digital League Web Development 2024 (Skilvul)",
      "Olimpiade Sains Nasional bidang Informatika, Puspresnas 2023 & 2024",
      "Olimpiade Nasional bidang Geografi, Universitas Indonesia 2023",
    ],
  },
  {
    name: "Randi Adam Arnaldi",
    title: "Cyber Security Specialist",
    role: "Chief Security Information Officer",
    photo: "/profiles/randi.jpeg",
    bio: "Randi hidup di dunia CTF dan keamanan siber. Di Direkrut AI, ia memastikan sistem tidak mudah dibobol dengan menemukan celah lebih dulu dan mengubah temuannya menjadi perlindungan produk.",
    skills: ["Penetration Testing", "Linux", "Python & MySQL", "Generative AI"],
    highlights: [
      "Juara 2 Kategori Cybersecurity KMIPN 2025",
      "Juara 2 CTF Cyberwave 1.0",
      "Finalis Cybersecurity Itechnocup 2025",
    ],
  },
  {
    name: "Alief Athallah Putra",
    title: "Network Engineer",
    role: "Chief Technology Officer",
    photo: "/profiles/alief.jpeg",
    bio: "Alief adalah spesialis jaringan dari fiber optic sampai NOC. Pengalamannya di provisioning dan mentoring membantu Direkrut AI membangun infrastruktur yang tangguh sekaligus mudah dipahami tim.",
    skills: ["Network Engineering", "Fiber Optic & Cabling", "Cisco"],
    highlights: [
      "Juara 2 LKS Information Network Cabling",
      "Provisioning Engineer PGNCOM",
      "Mentor Network Engineer dan anggota Student Council",
    ],
  },
];

export function TeamShowcase() {
  return (
    <section className="relative isolate mb-24 overflow-hidden bg-[#0a2b52] font-sans text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-[18vw] top-40 h-[70vw] w-[70vw] rounded-full border border-white/10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-[22vw] -top-[18vw] h-[58vw] w-[58vw] rounded-full border border-[#f97316]/35"
      />

      <div className="relative mx-auto max-w-[1584px] px-6 py-20 lg:px-10 lg:py-28">
        <div className="mb-14 grid gap-8 border-b border-white/20 pb-12 lg:grid-cols-12 lg:items-end lg:gap-10 lg:pb-16">
          <div className="lg:col-span-8">
            <p className="mb-6 text-[12px] font-medium uppercase tracking-[0.2em] text-[#fb923c]">
              Tim Kami
            </p>
            <h2 className="max-w-4xl text-[clamp(40px,5.5vw,76px)] font-bold leading-[1.02] tracking-[-0.03em]">
              Orang-orang yang bikin{" "}
              <span className="text-[#93c5fd]">rekrutmen lebih manusiawi.</span>
            </h2>
          </div>
          <div className="lg:col-span-4 lg:pb-1">
            <p className="max-w-md text-[15px] leading-[1.7] text-white/70 lg:ml-auto lg:text-[16px]">
              Empat engineer dengan satu obsesi: proses rekrutmen yang cepat,
              adil, dan nggak bikin siapa pun digantung.
            </p>
          </div>
        </div>

        <div className="grid gap-x-4 gap-y-12 sm:grid-cols-2 xl:grid-cols-4">
          {team.map((member, index) => (
            <Dialog key={member.name}>
              <DialogTrigger
                render={
                  <button
                    type="button"
                    className="group block w-full text-left outline-none"
                    aria-label={`Buka profil ${member.name}`}
                  />
                }
              >
                <span className="relative block aspect-[4/4.35] overflow-hidden rounded-3xl border border-white/20 bg-[#071f3b] outline-offset-4 transition-colors group-focus-visible:outline-2 group-focus-visible:outline-[#fb923c]">
                  <span
                    aria-hidden="true"
                    className={`absolute inset-x-0 top-0 z-10 h-1.5 ${
                      index % 2 === 0 ? "bg-primary" : "bg-brand-accent"
                    }`}
                  />
                  <Image
                    src={member.photo}
                    alt=""
                    fill
                    sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
                    quality={90}
                    className="object-cover grayscale contrast-[1.05] transition-transform duration-700 ease-out group-hover:scale-[1.025]"
                    loading="lazy"
                  />
                </span>
                <span className="mt-6 block">
                  <span className="block text-[22px] font-semibold leading-[1.2] tracking-[-0.01em] text-white">
                    {member.name}
                  </span>
                  <span
                    className={`mt-2 block text-[13px] font-medium leading-[1.5] ${
                      index % 2 === 0 ? "text-[#93c5fd]" : "text-[#fb923c]"
                    }`}
                  >
                    {member.role}
                  </span>
                </span>
              </DialogTrigger>

              <DialogContent
                showCloseButton={false}
                className="!fixed !inset-0 !left-0 !top-0 z-50 !block !h-dvh !w-screen !max-w-none !translate-x-0 !translate-y-0 overflow-y-auto !rounded-none !border-0 bg-canvas !p-0 font-sans text-ink !shadow-none sm:!max-w-none"
              >
                <div className="sticky top-0 z-20 flex h-24 items-center border-b border-white/15 bg-[#161616] px-6 lg:px-10">
                  <DialogClose
                    render={
                      <button
                        type="button"
                        className="flex size-14 items-center justify-center rounded-full border border-[#f97316] text-white transition-colors hover:bg-[#f97316] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                        aria-label="Tutup profil"
                      />
                    }
                  >
                    <X className="size-6" strokeWidth={1.5} />
                  </DialogClose>
                </div>

                <div className="bg-[#161616] text-white">
                  <div className="mx-auto grid max-w-[1320px] lg:grid-cols-2">
                    <div className="flex min-h-[320px] flex-col justify-center border-b border-white/15 px-6 py-14 sm:px-10 lg:min-h-[560px] lg:border-b-0 lg:border-r lg:px-20">
                      <p className="mb-7 text-[12px] font-medium uppercase tracking-[0.2em] text-[#fb923c]">
                        {member.title}
                      </p>
                      <DialogTitle className="max-w-xl text-[clamp(38px,4.5vw,68px)] font-bold leading-[1.04] tracking-[-0.03em] text-white">
                        {member.name}
                      </DialogTitle>
                      <DialogDescription className="mt-5 max-w-lg text-[16px] font-semibold leading-[1.5] text-[#93c5fd] lg:text-[20px]">
                        {member.role}
                      </DialogDescription>
                    </div>
                    <div className="relative aspect-square min-h-[360px] overflow-hidden bg-[#0a2b52] lg:min-h-[560px]">
                      <Image
                        src={member.photo}
                        alt={`Foto ${member.name}`}
                        fill
                        sizes="(min-width: 1024px) 50vw, 100vw"
                        quality={95}
                        className="object-cover grayscale contrast-[1.05]"
                        priority
                      />
                      <span
                        aria-hidden="true"
                        className={`absolute inset-y-0 left-0 w-2 ${
                          index % 2 === 0 ? "bg-primary" : "bg-brand-accent"
                        }`}
                      />
                    </div>
                  </div>
                </div>

                <div className="mx-auto grid max-w-[1320px] gap-12 px-6 py-16 sm:px-10 lg:grid-cols-12 lg:gap-16 lg:px-20 lg:py-24">
                  <div className="lg:col-span-3">
                    <p className="text-[12px] font-medium uppercase tracking-[0.2em] text-primary">
                      Tentang
                    </p>
                  </div>
                  <div className="lg:col-span-9">
                    <p className="max-w-4xl text-[clamp(22px,2.2vw,34px)] font-semibold leading-[1.45] tracking-[-0.02em] text-ink">
                      {member.bio}
                    </p>

                    <div className="mt-14 grid gap-10 border-t border-hairline pt-10 md:grid-cols-2">
                      <div>
                        <p className="mb-5 text-[11px] font-medium uppercase tracking-[0.18em] text-ink-muted">
                          Keahlian utama
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {member.skills.map((skill) => (
                            <span
                              key={skill}
                              className="rounded-full border border-primary px-4 py-2 text-[13px] font-medium text-primary"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="mb-5 text-[11px] font-medium uppercase tracking-[0.18em] text-ink-muted">
                          Pengalaman & pencapaian
                        </p>
                        <ul className="space-y-4">
                          {member.highlights.map((highlight) => (
                            <li
                              key={highlight}
                              className="border-l-2 border-brand-accent pl-4 text-[14px] leading-[1.6] text-ink-muted"
                            >
                              {highlight}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      </div>
    </section>
  );
}
