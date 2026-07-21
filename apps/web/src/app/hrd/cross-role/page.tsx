"use client";

import { PageHeader } from "@/components/molecules/dashboard/PageHeader";
import { useState, useMemo, useEffect, useCallback } from "react";
import Image from "next/image";
import { IconAlertCircle, IconSearch, IconSparkles } from "@tabler/icons-react";
import { useDashboard } from "@/context/DashboardContext";
import { getCrossRoleRecommendations, type CrossRoleMatch } from "@/services/aiService";
import { ApiError } from "@/services/apiClient";
import { TypingDots } from "@/components/atoms/shared/TypingDots";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CrossRoleAnalyticsToggle,
  CrossRoleAnalyticsCharts,
} from "@/components/molecules/dashboard/CrossRoleAnalyticsPanel";
import { CrossRoleCard } from "@/components/molecules/dashboard/CrossRoleCard";

const COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

// Auto-fetch cross-role buat N kandidat paling baru yang udah discreen --
// dibatesin biar buka halaman ini gak langsung micu puluhan AI match call
// sekaligus (tiap kandidat bisa nge-hit sampai 5 lowongan lain, tiap
// lowongan = embed CV + embed lowongan + evidence LLM call). Kandidat di
// luar cap tetap muncul, tinggal klik tombol buat cek manual.
const AUTO_FETCH_LIMIT = 10;

type MatchState = "loading" | "error" | CrossRoleMatch[];

export default function CrossRoleRecommendationPage() {
  const { applications, jobs, refetchApplications } = useDashboard();

  // Sama kayak hrd/page.tsx -- context cuma fetch sekali pas login, refetch
  // di sini biar lamaran baru kelihatan tanpa reload penuh.
  useEffect(() => {
    void refetchApplications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterLabel, setFilterLabel] = useState("Semua Kategori");
  const [filterRole, setFilterRole] = useState("Semua Posisi Usulan");
  const [showChart, setShowChart] = useState(false);
  const [matchesByApp, setMatchesByApp] = useState<Record<string, MatchState>>({});

  // Kandidat yang udah discreen (recommendationScore keisi lewat
  // ScoringResult) -- itu prasyarat buat cross-role, backend reuse
  // ringkasan CV dari screening biar gak parse CV dua kali.
  const screenedApplications = useMemo(
    () =>
      applications
        .filter((a) => a.recommendationScore != null && a.status !== "rejected")
        .sort((a, b) => (b.appliedDate > a.appliedDate ? 1 : -1)),
    [applications],
  );

  const runCrossRole = useCallback(async (applicationId: string) => {
    setMatchesByApp((prev) => ({ ...prev, [applicationId]: "loading" }));
    try {
      const matches = await getCrossRoleRecommendations(applicationId);
      setMatchesByApp((prev) => ({ ...prev, [applicationId]: matches }));
    } catch (err) {
      console.error("[cross-role] gagal ambil rekomendasi:", err instanceof ApiError ? err.message : err);
      setMatchesByApp((prev) => ({ ...prev, [applicationId]: "error" }));
    }
  }, []);

  useEffect(() => {
    screenedApplications.slice(0, AUTO_FETCH_LIMIT).forEach((app) => {
      setMatchesByApp((prev) => {
        if (prev[app.id] !== undefined) return prev;
        void runCrossRole(app.id);
        return { ...prev, [app.id]: "loading" };
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screenedApplications]);

  const crossRoleList = useMemo(() => {
    return screenedApplications.flatMap((app) => {
      const state = matchesByApp[app.id];
      if (!Array.isArray(state)) return [];
      return state.map((m) => {
        const isHighlyRelevant = m.score >= 70;
        const label = isHighlyRelevant ? "Sangat Relevan" : "Potensi Adaptasi Cepat";
        return {
          id: app.id,
          candidateName: app.applicantName,
          originalRole: app.jobTitle,
          suggestedRole: m.jobTitle,
          label,
          variant: isHighlyRelevant ? "default" : "secondary",
          reason: `Skor kecocokan ${Math.round(m.score)}% antara CV ${app.applicantName} dengan kualifikasi posisi ${m.jobTitle}, dihitung AI dari kemiripan skill & pengalaman.`,
          evidenceType: "cv",
          evidence: m.matchedEvidence.length > 0
            ? m.matchedEvidence.join(" • ")
            : "Kecocokan berdasarkan kemiripan semantik ringkasan CV dengan deskripsi lowongan.",
          emailed: false,
        };
      });
    });
  }, [screenedApplications, matchesByApp]);

  const pendingApplications = useMemo(
    () =>
      screenedApplications.filter((app) => {
        const state = matchesByApp[app.id];
        return state === undefined || state === "loading" || state === "error" || (Array.isArray(state) && state.length === 0);
      }),
    [screenedApplications, matchesByApp],
  );

  const uniqueLabels = useMemo(
    () => Array.from(new Set(crossRoleList.map((i) => i.label))),
    [crossRoleList],
  );
  const uniqueRoles = useMemo(
    () => Array.from(new Set(crossRoleList.map((i) => i.suggestedRole))),
    [crossRoleList],
  );

  const filtersActive = searchTerm.trim() !== "" || filterLabel !== "Semua Kategori" || filterRole !== "Semua Posisi Usulan";

  const filteredList = crossRoleList.filter((item) => {
    const matchSearch =
      item.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.suggestedRole.toLowerCase().includes(searchTerm.toLowerCase());
    const matchLabel =
      filterLabel === "Semua Kategori" || item.label === filterLabel;
    const matchRole =
      filterRole === "Semua Posisi Usulan" || item.suggestedRole === filterRole;
    return matchSearch && matchLabel && matchRole;
  });

  const roleCounts: Record<string, number> = {};
  filteredList.forEach((item) => {
    roleCounts[item.suggestedRole] = (roleCounts[item.suggestedRole] || 0) + 1;
  });
  let chartData = Object.entries(roleCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([name, value], idx) => ({
      name,
      value,
      color: COLORS[idx % COLORS.length],
    }));
  if (chartData.length > 5) {
    const others = chartData
      .slice(5)
      .reduce((acc, curr) => acc + (curr.value as number), 0);
    chartData = [
      ...chartData.slice(0, 5),
      {
        name: "Posisi Lainnya",
        value: others,
        color: "var(--muted-foreground)",
      },
    ];
  }

  const relevanceCounts = { "Sangat Relevan": 0, "Potensi Adaptasi Cepat": 0 };
  filteredList.forEach((item) => {
    if (
      relevanceCounts[item.label as keyof typeof relevanceCounts] !== undefined
    ) {
      relevanceCounts[item.label as keyof typeof relevanceCounts]++;
    }
  });
  const relevanceData = [
    {
      name: "Sangat Relevan",
      count: relevanceCounts["Sangat Relevan"],
      fill: "var(--success)",
    },
    {
      name: "Adaptasi Cepat",
      count: relevanceCounts["Potensi Adaptasi Cepat"],
      fill: "var(--warning)",
    },
  ];

  const evidenceData = [
    { name: "Kutipan CV", count: filteredList.length, fill: "var(--chart-2)" },
    { name: "Log Wawancara", count: 0, fill: "var(--chart-4)" },
  ];

  if (jobs.length < 2) {
    return (
      <div className="flex flex-1 items-center justify-center p-4 lg:p-8 min-h-[70vh]">
        <div className="flex flex-col items-center rounded-3xl border border-hairline bg-canvas p-10 text-center max-w-lg">
          <Image
            src="/dashboard/add_file.svg"
            alt=""
            width={220}
            height={165}
            unoptimized
            className="pointer-events-none mb-6 h-32 w-auto select-none"
          />
          <h2 className="text-2xl font-bold mb-2 text-ink">
            Lowongan Aktifnya Kurang dari 2 Nih
          </h2>
          <p className="text-ink-muted max-w-md">
            AI Cross-Role butuh minimal 2 lowongan yang buka bareng biar bisa
            mulai nyariin kandidat lintas posisi. Yuk tambah lowongan dulu.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 lg:p-8 @container/main w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <PageHeader
          className="flex-1"
          title="Rekomendasi Lintas Posisi"
          description={
            <>
              Kandidat yang <span className="italic">skill</span>-nya nyambung
              ke posisi lain, udah AI temuin buat kamu.
            </>
          }
        />
        <CrossRoleAnalyticsToggle
          show={showChart}
          onToggle={() => setShowChart(!showChart)}
          totalVisible={filteredList.length}
        />
      </div>

      {showChart && filteredList.length > 0 && (
        <CrossRoleAnalyticsCharts
          chartData={chartData}
          relevanceData={relevanceData}
          evidenceData={evidenceData}
        />
      )}

      <div className="relative overflow-hidden rounded-3xl bg-primary p-6 text-white">
        <div className="flex items-start gap-4 max-w-2xl">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-destructive">
            <IconAlertCircle className="size-5" />
          </div>
          <div>
            <h3 className="font-semibold text-[17px]">
              Cara Kerja AI Cross-Role
            </h3>
            <p className="text-sm text-white/85 mt-1">
              AI cocokin ringkasan CV kandidat yang udah discreen sama
              deskripsi lowongan aktif lainnya di company ini (skor kecocokan
              &ge; 50%).
            </p>
          </div>
        </div>
        <Image
          src="/dashboard/profile/skills.svg"
          alt=""
          width={200}
          height={150}
          unoptimized
          className="pointer-events-none absolute right-6 top-1/2 hidden h-20 w-auto -translate-y-1/2 select-none sm:block"
        />
      </div>

      <div className="flex flex-col md:flex-row gap-4 w-full">
        <div className="relative flex-1">
          <IconSearch className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Cari nama atau posisi usulan..."
            className="pl-10 rounded-full border-hairline bg-canvas"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select
          value={filterLabel}
          onValueChange={(val) => val && setFilterLabel(val)}
        >
          <SelectTrigger className="w-full md:w-[200px] rounded-full border-hairline bg-canvas">
            <SelectValue placeholder="Semua Kategori" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Semua Kategori">Semua Kategori</SelectItem>
            {uniqueLabels.map((label) => (
              <SelectItem key={label} value={label}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={filterRole}
          onValueChange={(val) => val && setFilterRole(val)}
        >
          <SelectTrigger className="w-full md:w-[240px] rounded-full border-hairline bg-canvas">
            <SelectValue placeholder="Semua Posisi Usulan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Semua Posisi Usulan">
              Semua Posisi Usulan
            </SelectItem>
            {uniqueRoles.map((role) => (
              <SelectItem key={role} value={role}>
                {role}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {filteredList.map((item, idx) => (
          <CrossRoleCard key={`${item.id}-${item.suggestedRole}-${idx}`} item={item} />
        ))}

        {!filtersActive && pendingApplications.map((app) => {
          const state = matchesByApp[app.id];
          return (
            <div
              key={app.id}
              className="rounded-3xl border border-dashed border-hairline bg-surface-1 p-6 flex flex-col items-center justify-center text-center gap-3 min-h-45"
            >
              <p className="font-semibold text-ink">{app.applicantName}</p>
              <p className="text-xs text-ink-muted">Lamaran: {app.jobTitle}</p>
              {state === "loading" ? (
                <div className="flex items-center gap-2 text-ink-muted text-sm">
                  <TypingDots /> Nyari lowongan lain yang cocok...
                </div>
              ) : state === "error" ? (
                <>
                  <p className="text-sm text-destructive">Gagal ambil rekomendasi.</p>
                  <Button size="sm" onClick={() => runCrossRole(app.id)}>Coba lagi</Button>
                </>
              ) : Array.isArray(state) ? (
                <p className="text-sm text-ink-muted">Belum ada posisi lain yang cukup cocok saat ini.</p>
              ) : (
                <Button size="sm" onClick={() => runCrossRole(app.id)}>
                  <IconSparkles className="size-4 mr-1.5" /> Cari Rekomendasi
                </Button>
              )}
            </div>
          );
        })}

        {filteredList.length === 0 && pendingApplications.length === 0 && (
          <div className="col-span-full flex flex-col items-center rounded-2xl bg-surface-1 py-10 px-6 text-center">
            <Image
              src="/dashboard/decline.svg"
              alt=""
              width={200}
              height={150}
              unoptimized
              className="pointer-events-none mb-5 h-28 w-auto select-none"
            />
            <p className="text-[17px] font-semibold text-ink">
              Belum ada rekomendasi yang cocok
            </p>
            <p className="mt-1 text-sm text-ink-muted">
              {screenedApplications.length === 0
                ? "Screening CV kandidat dulu di halaman detail lamaran biar AI bisa nyariin posisi lain yang cocok."
                : "Coba ganti kata kunci atau filternya ya."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
