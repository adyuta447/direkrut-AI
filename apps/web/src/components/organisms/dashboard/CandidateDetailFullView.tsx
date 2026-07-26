"use client"

import * as React from "react"
import Link from "next/link"
import {
  IconArrowLeft,
  IconDownload,
  IconDotsVertical,
  IconCheck,
  IconX,
  IconBriefcase,
  IconSparkles,
  IconCircleCheckFilled,
  IconInfoCircle,
  IconFileText,
  IconSchool,
  IconListCheck,
  IconStar,
  IconUser,
  IconActivity,
  IconHelpCircle,
  IconZoomIn,
  IconZoomOut,
  IconClock,
  IconUsers,
  IconAward,
  IconSearch,
  IconMaximize,
} from "@tabler/icons-react"
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
  ReferenceLine,
  PieChart,
  Pie,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
} from "recharts"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { DecisionDialog } from "@/components/organisms/dashboard/DecisionDialog"
import { Application } from "@/lib/types"
import { ExtendedCandidateData } from "@/lib/dashboard/extended-data"
import { ScreeningResult, InterviewResult } from "@/services/aiService"

interface CandidateDetailFullViewProps {
  candidate: Application & ExtendedCandidateData
  screening: ScreeningResult | null
  interview: InterviewResult | null
  resumeUrl?: string
  onRunScreening?: () => void
  isScreening?: boolean
}

/** Helper function for score-based UX colors & dynamic labels */
function getScoreUXMeta(score: number) {
  if (score >= 75) {
    return {
      label: "Strong Match",
      subtext: "Tingkat Kecocokan Tinggi",
      colorText: "text-emerald-600",
      colorStroke: "text-emerald-500",
      desc: "Kandidat memiliki kecocokan tinggi berdasarkan bukti pada CV, pengalaman kerja, dan hasil evaluasi AI.",
    }
  }
  if (score >= 60) {
    return {
      label: "Good Match",
      subtext: "Kandidat Memenuhi Kualifikasi",
      colorText: "text-blue-600",
      colorStroke: "text-blue-500",
      desc: "Kandidat memenuhi kualifikasi utama yang dibutuhkan lowongan ini dengan bukti pendukung yang baik.",
    }
  }
  if (score >= 40) {
    return {
      label: "Moderate Match",
      subtext: "Perlu Dipertimbangkan & Divalidasi",
      colorText: "text-amber-600",
      colorStroke: "text-amber-500",
      desc: "Kandidat memenuhi sebagian kualifikasi tetapi membutuhkan validasi tambahan pada beberapa kualifikasi penting.",
    }
  }
  return {
    label: "Low Match",
    subtext: "Perlu Pengembangan",
    colorText: "text-rose-600",
    colorStroke: "text-rose-500",
    desc: "Kandidat memiliki beberapa gap kualifikasi yang belum terpenuhi untuk posisi yang dilamar.",
  }
}

/** Helper to calculate color fill for candidate competency score */
function getBarColor(score: number) {
  if (score >= 85) return "#10b981" // Emerald Green (Melampaui / Sesuai Standar)
  if (score >= 70) return "#0284c7" // Sky Blue (Memenuhi Standar)
  if (score >= 50) return "#f59e0b" // Amber (Celah Ringan)
  return "#f43f5e" // Rose Red (Gap Signifikan)
}

/** Helper for dynamic breakdown card score UX colors */
function getCategoryScoreMeta(current: number, max: number) {
  const ratio = current / max
  if (ratio >= 0.8) {
    return {
      barBg: "bg-emerald-500",
      scoreText: "text-emerald-700",
      badgeText: "bg-emerald-50 text-emerald-700 border-emerald-200",
      label: "Sangat Baik",
    }
  }
  if (ratio >= 0.65) {
    return {
      barBg: "bg-sky-500",
      scoreText: "text-sky-700",
      badgeText: "bg-sky-50 text-sky-700 border-sky-200",
      label: "Memenuhi",
    }
  }
  if (ratio >= 0.5) {
    return {
      barBg: "bg-amber-500",
      scoreText: "text-amber-700",
      badgeText: "bg-amber-50 text-amber-800 border-amber-300",
      label: "Cukup",
    }
  }
  return {
    barBg: "bg-rose-500",
    scoreText: "text-rose-700",
    badgeText: "bg-rose-50 text-rose-700 border-rose-200",
    label: "Perlu Perhatian",
  }
}

// Sorotan CV (Key Highlights)
const CV_HIGHLIGHTS = [
  { title: "High-Throughput Golang Backend", category: "Skill Utama", text: "Mengembangkan layanan backend Golang berdaya tampung 10,000+ request per detik di PT Techno Corp Tbk." },
  { title: "Arsitektur Microservices & Database Optimization", category: "Pengalaman Kerja", text: "Merancang arsitektur microservices berbasis gRPC dan melakukan optimasi query PostgreSQL kompleks." },
  { title: "Infrastruktur Container & AWS Cloud", category: "Infrastruktur", text: "Mengelola deployment container Docker dan integrasi service AWS (EKS, S3, RDS, CloudWatch)." },
]

// Deep Job Requirement vs Candidate CV Match Table for Modal
const DEEP_REQUIREMENT_MATCH_TABLE = [
  {
    requirement: "Arsitektur Backend & Concurrency",
    jobSpec: "Merancang layanan backend Golang terdistribusi berkecepatan tinggi dengan REST API & gRPC.",
    candidateCv: "Senior Backend Engineer di PT Techno Corp Tbk — Membangun 12 microservices gRPC Golang melayani 10,000+ req/sec.",
    aiAssessment: "Pengalaman dan tanggung jawab nyata di CV selaras 100% dengan kebutuhan posisi ini.",
    matchStatus: "Match Sempurna (100%)",
    statusColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  {
    requirement: "Infrastruktur Container & AWS Cloud",
    jobSpec: "Menguasai containerization Docker dan cloud deployment AWS (EKS, S3, RDS).",
    candidateCv: "Mengelola deployment container Docker dan mengonfigurasi EKS, S3, serta RDS di AWS.",
    aiAssessment: "Bukti riwayat operasional nyata di cloud AWS dan Docker terverifikasi.",
    matchStatus: "Match Tinggi (90%)",
    statusColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  {
    requirement: "Database Performance Tuning",
    jobSpec: "Merancang skema terstruktur & melakukan query optimization pada database PostgreSQL.",
    candidateCv: "Melakukan optimasi query kompleks & indexing database PostgreSQL pada 5M+ record.",
    aiAssessment: "Pengalaman optimasi database terstruktur & terbukti berdampak positif.",
    matchStatus: "Match Tinggi (95%)",
    statusColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  {
    requirement: "Automated CI/CD Pipeline",
    jobSpec: "Membuat automated build, test, & deployment pipeline (GitLab CI / GitHub Actions).",
    candidateCv: "Menggunakan GitLab CI untuk otomasi build environment staging (otomasi production belum terurai).",
    aiAssessment: "Terbukti pernah menggunakan GitLab CI, namun pipeline production perlu dikonfirmasi.",
    matchStatus: "Partial Match (60%)",
    statusColor: "bg-amber-50 text-amber-800 border-amber-300",
  },
  {
    requirement: "Stabilitas Karir & Rekam Jejak",
    jobSpec: "Stabilitas karir berkelanjutan dengan rekam jejak penyelesaian proyek minimal 1-2 tahun per perusahaan.",
    candidateCv: "Terdapat 2 perusahaan terdahulu dengan masa kerja < 10 bulan (PT Solusi Digital & CV Tech).",
    aiAssessment: "Terdapat riwayat perpindahan kerja singkat, disarankan diklarifikasi pada sesi interview.",
    matchStatus: "Perlu Validasi (45%)",
    statusColor: "bg-rose-50 text-rose-700 border-rose-200",
  },
]

// Algorithm Breakdown Transparency Details Table with Color-Coded Obtained Scores
const ALGORITHM_TRANSPARENCY_TABLE = [
  {
    dimension: "Kecocokan Skill Utama",
    weight: "35%",
    score: "32 / 35",
    scoreColor: "bg-emerald-100 text-emerald-800 border-emerald-300",
    algorithm: "Analisis konteks penguasaan keahlian inti di riwayat kerja. Membedakan skill yang sekadar dicantumkan di daftar dengan skill yang terbukti diterapkan pada tugas proyek nyata.",
    cvResult: "Mengembangkan 12 microservices gRPC Golang & REST API berkapasitas 10,000+ req/sec.",
    status: "Terbukti Kuat (91%)",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  {
    dimension: "Pengalaman Kerja Relevan",
    weight: "25%",
    score: "22 / 25",
    scoreColor: "bg-emerald-100 text-emerald-800 border-emerald-300",
    algorithm: "Mengevaluasi keselarasan alur karier, masa kerja per perusahaan, serta rekam jejak kontribusi dan pencapaian terukur kandidat.",
    cvResult: "5 tahun pengalaman Senior Backend Engineer, terbiasa menangani infrastruktur cloud & database skala besar.",
    status: "Terbukti Baik (88%)",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  {
    dimension: "Skala Tanggung Jawab",
    weight: "20%",
    score: "18 / 20",
    scoreColor: "bg-emerald-100 text-emerald-800 border-emerald-300",
    algorithm: "Membandingkan tingkat senioritas peran, cakupan tanggung jawab operasional/tim, dan skala proyek yang pernah dikelola sebelumnya.",
    cvResult: "Mengelola arsitektur database PostgreSQL dan deployment container Docker di lingkungan production.",
    status: "Terbukti Kuat (90%)",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  {
    dimension: "Pendidikan & Sertifikasi",
    weight: "10%",
    score: "8 / 10",
    scoreColor: "bg-sky-100 text-sky-800 border-sky-300",
    algorithm: "Verifikasi kesesuaian kualifikasi akademik (S1/S2/D3) serta sertifikasi profesional resmi pendukung posisi.",
    cvResult: "S1 Ilmu Komputer terverifikasi, namun file fisik sertifikat AWS Certified belum dilampirkan.",
    status: "Memenuhi (80%)",
    badgeColor: "bg-sky-50 text-sky-700 border-sky-200",
  },
  {
    dimension: "Kualifikasi Tambahan",
    weight: "10%",
    score: "2 / 10",
    scoreColor: "bg-rose-100 text-rose-800 border-rose-300",
    algorithm: "Menilai nilai tambah pendukung seperti portofolio kerja, penguasaan bahasa asing, serta pengalaman organisasi/kepemimpinan.",
    cvResult: "Pengalaman GitLab CI disebutkan, namun manifest Kubernetes belum terurai secara eksplisit di CV.",
    status: "Perlu Validasi (20%)",
    badgeColor: "bg-rose-50 text-rose-700 border-rose-200",
  },
]

// Weight Pie Chart Data for Algorithm Modal with Harmonious Colorful Palette
const ALGORITHM_PIE_DATA = [
  { name: "Kecocokan Skill Utama", value: 35, color: "#6366f1" }, // Indigo
  { name: "Pengalaman Kerja Relevan", value: 25, color: "#0284c7" }, // Sky Blue
  { name: "Skala Tanggung Jawab", value: 20, color: "#10b981" }, // Emerald Green
  { name: "Pendidikan & Sertifikasi", value: 10, color: "#f59e0b" }, // Amber Gold
  { name: "Kualifikasi Tambahan", value: 10, color: "#f43f5e" }, // Rose Pink
]

export function CandidateDetailFullView({
  candidate,
  screening,
  interview,
  resumeUrl,
  onRunScreening,
  isScreening = false,
}: CandidateDetailFullViewProps) {
  const [evidenceTab, setEvidenceTab] = React.useState("evidence")
  const [highlightActive, setHighlightActive] = React.useState(true)
  const [zoomLevel, setZoomLevel] = React.useState(100)
  const [isScoreModalOpen, setIsScoreModalOpen] = React.useState(false)
  const [isAlgorithmModalOpen, setIsAlgorithmModalOpen] = React.useState(false)

  // State for CV Pop-up Dialog Modal
  const [cvModalItem, setCvModalItem] = React.useState<{
    req: string
    status: string
    evidence: string
  } | null>(null)

  const overallScore = Math.round(screening?.matchScore ?? screening?.finalWeightedScore ?? screening?.overallScore ?? candidate.recommendationScore ?? 82)
  const scoreMeta = getScoreUXMeta(overallScore)
  const isFreshGrad = candidate.category === "fresh-graduate"

  // Aggregate all assessments from MVP componentScores
  const allAssessments = React.useMemo(() => {
    if (!screening?.componentScores) return [];
    return Object.values(screening.componentScores).flatMap(c => c.assessments || []);
  }, [screening]);

  // Aggregate key gaps from MVP
  const keyGaps = screening?.keyGaps || [];

  const { pros, cons } = React.useMemo(() => {
    if (!allAssessments.length) return { pros: [], cons: [] };
    const p = allAssessments.filter(a => a.match_status === "STRONG_MATCH" || a.match_status === "FULL_MATCH").slice(0, 3);
    const c = allAssessments.filter(a => a.match_status === "MISSING" || a.match_status === "FAILED_HARD_REQUIREMENT" || a.match_status === "NO_EVIDENCE" || a.match_status === "NOT_DEMONSTRATED").slice(0, 3);
    return { pros: p, cons: c };
  }, [allAssessments]);

  // Radar Data comparing candidate vs requirement
  const radarData = [
    { subject: "Skill", Candidate: Math.round(((screening?.componentScores?.skill_match?.score ?? 0.91) * 100)), Requirement: 90 },
    { subject: "Pengalaman", Candidate: Math.round(((screening?.componentScores?.experience?.score ?? 0.88) * 100)), Requirement: 80 },
    { subject: "Tanggung Jawab", Candidate: Math.round(((screening?.componentScores?.responsibilities?.score ?? 0.90) * 100)), Requirement: 85 },
    { subject: "Pendidikan", Candidate: Math.round(((screening?.componentScores?.education?.score ?? 0.80) * 100)), Requirement: 70 },
    { subject: "Kualifikasi Tambahan", Candidate: Math.round(((screening?.componentScores?.additional?.score ?? 0.20) * 100)), Requirement: 50 },
  ]

  // Deep Skill Domain Matrix Data mapping from allAssessments (fallback to mock data if empty)
  const domainMatrixData = allAssessments.length > 0 
    ? allAssessments.filter(a => a.category === "SKILL").map(a => ({
        domain: a.requirement,
        Standar_Posisi: 100,
        Capaian_Kandidat: Math.round(a.score * 100)
      }))
    : [
        { domain: "Golang Backend", Standar_Posisi: 100, Capaian_Kandidat: 92 },
        { domain: "Microservices gRPC", Standar_Posisi: 100, Capaian_Kandidat: 88 },
        { domain: "PostgreSQL Database", Standar_Posisi: 100, Capaian_Kandidat: 90 },
        { domain: "Docker Container", Standar_Posisi: 100, Capaian_Kandidat: 85 },
        { domain: "AWS Cloud (EKS)", Standar_Posisi: 100, Capaian_Kandidat: 75 },
        { domain: "CI/CD Pipeline", Standar_Posisi: 100, Capaian_Kandidat: 55 },
      ]

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 lg:p-8 bg-slate-50/50 min-h-screen">
      {/* 1. TOP BAR NAVIGATION */}
      <div className="flex items-center justify-between">
        <Link
          href="/hrd"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <IconArrowLeft className="size-4" />
          Kembali ke Manajemen Kandidat
        </Link>
        <div className="flex items-center gap-2">
          {resumeUrl && (
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl border-slate-200 text-xs font-semibold gap-1.5 shadow-xs text-slate-700"
              onClick={() => window.open(resumeUrl, "_blank")}
            >
              <IconDownload className="size-4 text-slate-500" /> Unduh Laporan (PDF)
            </Button>
          )}
          <Button variant="ghost" size="icon" className="size-9 rounded-xl text-slate-500">
            <IconDotsVertical className="size-4" />
          </Button>
        </div>
      </div>

      {/* 2. CANDIDATE PROFILE HEADER CARD */}
      <Card className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex items-start gap-4">
            <Avatar className="size-16 sm:size-20 border border-slate-200 bg-slate-100 shrink-0">
              <AvatarFallback className="text-xl sm:text-2xl font-bold text-slate-700 bg-slate-100">
                {candidate.applicantName.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                  {candidate.applicantName}
                </h1>
              </div>
              <p className="text-base font-semibold text-slate-600">{candidate.jobTitle}</p>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <Badge
                  variant={candidate.status === "rejected" ? "destructive" : "secondary"}
                  className="rounded-lg px-2.5 py-0.5 text-xs capitalize font-medium"
                >
                  {candidate.status === "under-review" ? "Administrasi" : candidate.status}
                </Badge>

                <Badge
                  variant="outline"
                  className="border-slate-300 bg-slate-50 text-slate-700 font-medium text-xs"
                >
                  {isFreshGrad ? "Fresh Graduate" : "Professional"}
                </Badge>
              </div>
            </div>
          </div>

          {/* Top Right Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {!screening && onRunScreening && (
              <Button 
                onClick={onRunScreening}
                disabled={isScreening}
                size="sm" 
                className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm px-4 py-2 gap-1.5 shadow-xs"
              >
                <IconSparkles className="size-4" /> 
                {isScreening ? "Menjalankan AI..." : "Jalankan Screening AI"}
              </Button>
            )}
            <DecisionDialog
              candidate={candidate}
              decision="invite"
              trigger={
                <Button size="sm" className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm px-4 py-2 gap-1.5 shadow-xs">
                  <IconCheck className="size-4" /> Undang Wawancara
                </Button>
              }
            />

            <DecisionDialog
              candidate={candidate}
              decision="reject"
              trigger={
                <Button size="sm" className="rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs sm:text-sm px-4 py-2 gap-1.5 shadow-xs">
                  <IconX className="size-4" /> Tolak Lamaran
                </Button>
              }
            />
          </div>
        </div>

        {/* Responsive 2-Row Candidate Metadata Grid under name */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-4 pt-1 font-sans">
          <div>
            <p className="text-xs font-semibold text-slate-400">Nomor WA</p>
            <p className="text-xs sm:text-sm font-bold text-slate-800 mt-0.5">{candidate.phone || "+6281234567890"}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400">Email</p>
            <p className="text-xs sm:text-sm font-bold text-slate-800 mt-0.5 truncate" title={candidate.email || "mas.arnald611@gmail.com"}>
              {candidate.email || "mas.arnald611@gmail.com"}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400">Domisili</p>
            <p className="text-xs sm:text-sm font-bold text-slate-800 mt-0.5">{candidate.domicile || "Jakarta Selatan, DKI Jakarta"}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400">Pengalaman</p>
            <p className="text-xs sm:text-sm font-bold text-slate-800 mt-0.5">{candidate.experience || "2 pengalaman kerja"}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400">Posisi Terakhir</p>
            <p className="text-xs sm:text-sm font-bold text-slate-800 mt-0.5">Software Engineer · TechStart</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400">Pendidikan</p>
            <p className="text-xs sm:text-sm font-bold text-slate-800 mt-0.5">S1 Ilmu Komputer</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400">Tanggal Melamar</p>
            <p className="text-xs sm:text-sm font-bold text-slate-800 mt-0.5">22 Juli 2026</p>
          </div>
        </div>
      </Card>

      {/* 3. HORIZONTAL TABS BAR AT TOP */}
      <Tabs defaultValue="analisis" className="w-full">
        <div className="bg-white rounded-2xl border border-slate-200 p-1.5 shadow-xs mb-6 overflow-x-auto">
          <TabsList className="w-full justify-start bg-transparent gap-2 h-auto p-0">
            <TabsTrigger
              value="analisis"
              className="rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold data-[state=active]:bg-slate-900 data-[state=active]:text-white data-[state=active]:shadow-xs transition-all gap-2"
            >
              <IconSparkles className="size-4" /> Ringkasan &amp; Analisis AI
            </TabsTrigger>

            <TabsTrigger
              value="wawancara"
              className="rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold data-[state=active]:bg-slate-900 data-[state=active]:text-white data-[state=active]:shadow-xs transition-all gap-2"
            >
              <IconBriefcase className="size-4" /> Hasil Wawancara AI
            </TabsTrigger>

            <TabsTrigger
              value="catatan"
              className="rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold data-[state=active]:bg-slate-900 data-[state=active]:text-white data-[state=active]:shadow-xs transition-all gap-2"
            >
              <IconActivity className="size-4" /> Catatan &amp; Timeline HR
            </TabsTrigger>

            {resumeUrl && (
              <TabsTrigger
                value="cv-preview"
                className="rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold data-[state=active]:bg-slate-900 data-[state=active]:text-white data-[state=active]:shadow-xs transition-all gap-2"
              >
                <IconFileText className="size-4" /> Document Preview CV
              </TabsTrigger>
            )}
          </TabsList>
        </div>

        {/* TAB 1: RINGKASAN & ANALISIS AI */}
        <TabsContent value="analisis" className="space-y-6 m-0">

          {/* ROW 1: SUMMARY CARDS (3 Columns) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Card 1: Skor Kecocokan Keseluruhan */}
            <Card className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-slate-900">Skor Kecocokan Keseluruhan</h3>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger className="text-slate-400 hover:text-slate-600 transition-colors">
                        <IconInfoCircle className="size-4" />
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-md p-3.5 text-xs bg-slate-900 text-white rounded-2xl shadow-2xl space-y-2">
                        <p className="font-bold text-amber-300 border-b border-slate-800 pb-1">Kategori &amp; Indikator Penilaian AI</p>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[11px] leading-relaxed">
                          <div>
                            <span className="font-bold text-emerald-400 block">Sangat Sesuai (≥ 75%)</span>
                            <span className="text-slate-300">Bukti kualifikasi lengkap di CV &amp; pengalaman relevan.</span>
                          </div>
                          <div>
                            <span className="font-bold text-blue-400 block">Sesuai (60–74%)</span>
                            <span className="text-slate-300">Kualifikasi utama terpenuhi dengan bukti memadai.</span>
                          </div>
                          <div>
                            <span className="font-bold text-amber-400 block">Perlu Dipertimbangkan (40–59%)</span>
                            <span className="text-slate-300">Kualifikasi parsial, butuh validasi di wawancara.</span>
                          </div>
                          <div>
                            <span className="font-bold text-rose-400 block">Kurang Sesuai (&lt; 40%)</span>
                            <span className="text-slate-300">Memiliki banyak gap pada kualifikasi utama.</span>
                          </div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                <div className="flex items-center gap-4 my-2">
                  <div className="relative size-24 shrink-0">
                    <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-slate-100"
                        strokeWidth="3.5"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className={`${scoreMeta.colorStroke} transition-all duration-1000 ease-out`}
                        strokeDasharray={`${overallScore}, 100`}
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="text-2xl font-extrabold text-slate-900 leading-none">{overallScore}</span>
                      <span className="text-xs text-slate-400 font-medium">/100</span>
                    </div>
                  </div>

                  <div>
                    <span className={`text-lg font-bold block ${scoreMeta.colorText}`}>
                      {scoreMeta.label}
                    </span>
                    <span className="text-xs sm:text-sm text-slate-500 font-medium">{scoreMeta.subtext}</span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-3">
                  {scoreMeta.desc}
                </p>
              </div>

              <div className="pt-4 mt-2 border-t border-slate-100">
                <button
                  onClick={() => setIsScoreModalOpen(true)}
                  className="text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-900 inline-flex items-center gap-1 cursor-pointer transition-colors"
                >
                  Lihat penjelasan skor ›
                </button>
              </div>
            </Card>

            {/* Card 2: Ringkasan Penilaian AI */}
            <Card className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-3">Ringkasan Penilaian AI</h3>

                <div className="space-y-2.5 mb-4">
                  <p className="text-xs sm:text-sm font-bold text-slate-600">Kekuatan utama kandidat:</p>
                  <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                    {pros.length > 0 ? pros.map((p, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <IconCircleCheckFilled className="size-4.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>
                          <strong className="font-bold text-slate-900">{p.requirement}</strong> — {p.reasoning}
                        </span>
                      </li>
                    )) : (
                      <li className="text-xs text-slate-500">Belum ada kekuatan utama yang terdeteksi secara otomatis.</li>
                    )}
                  </ul>
                </div>

                <div className="space-y-2.5">
                  <p className="text-xs sm:text-sm font-bold text-slate-600">Perlu divalidasi saat wawancara:</p>
                  <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                    {cons.length > 0 ? cons.map((c, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <IconInfoCircle className="size-4.5 text-amber-600 shrink-0 mt-0.5" />
                        <span>
                          <strong className="font-bold text-slate-900">{c.requirement}</strong> — {c.reasoning}
                        </span>
                      </li>
                    )) : (
                      <li className="text-xs text-slate-500">Belum ada kekurangan signifikan yang terdeteksi.</li>
                    )}
                  </ul>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <p className="text-xs font-semibold text-slate-500 mb-1">Rekomendasi AI</p>
                <button className="text-xs sm:text-sm font-bold text-slate-900 hover:text-slate-700 inline-flex items-center gap-1">
                  Lanjut ke Wawancara Teknis ›
                </button>
              </div>
            </Card>

            {/* Card 3: Status Proses */}
            <Card className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-6">Status Proses</h3>

                <div className="relative pl-10 space-y-7 my-2">
                  <div className="absolute left-[15px] top-3 bottom-5 w-0.5 bg-slate-200" />

                  {[
                    {
                      step: "Lamaran Diterima",
                      date: "22 Jul 2026",
                      status: "completed",
                      icon: IconFileText,
                      iconColor: "text-blue-600 bg-blue-50 border-blue-400",
                      badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
                      label: "Selesai",
                    },
                    {
                      step: "Screening AI",
                      date: "22 Jul 2026",
                      status: "completed",
                      icon: IconSparkles,
                      iconColor: "text-emerald-600 bg-emerald-50 border-emerald-400",
                      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
                      label: "Selesai",
                    },
                    {
                      step: "Wawancara AI",
                      date: "Belum dilakukan",
                      status: "current",
                      icon: IconClock,
                      iconColor: "text-amber-700 bg-amber-50 border-amber-400 ring-2 ring-amber-200",
                      badgeColor: "bg-amber-50 text-amber-800 border-amber-300",
                      label: "Tahap Aktif",
                    },
                    {
                      step: "Wawancara Tim",
                      date: "Belum dijadwalkan",
                      status: "pending",
                      icon: IconUsers,
                      iconColor: "text-slate-400 bg-slate-100 border-slate-300",
                      badgeColor: "bg-slate-50 text-slate-500 border-slate-200",
                      label: "Menunggu",
                    },
                    {
                      step: "Keputusan Akhir",
                      date: "Pending",
                      status: "pending",
                      icon: IconAward,
                      iconColor: "text-slate-400 bg-slate-100 border-slate-300",
                      badgeColor: "bg-slate-50 text-slate-500 border-slate-200",
                      label: "Menunggu",
                    },
                  ].map((item, i) => (
                    <div key={i} className="relative flex items-center justify-between text-xs sm:text-sm">
                      <div
                        className={`absolute -left-[40px] top-1/2 -translate-y-1/2 size-8 rounded-full border-2 ${item.iconColor} flex items-center justify-center shadow-xs shrink-0 z-10`}
                      >
                        <item.icon className="size-4" />
                      </div>

                      <div className="space-y-0.5">
                        <p className={`font-bold ${item.status === "completed" || item.status === "current" ? "text-slate-900" : "text-slate-500"}`}>
                          {item.step}
                        </p>
                        <p className="text-xs text-slate-400 font-medium">{item.date}</p>
                      </div>

                      <Badge
                        variant="outline"
                        className={`text-[10px] font-bold rounded-md px-2.5 py-0.5 ${item.badgeColor}`}
                      >
                        {item.label}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 text-right mt-4">
                <span className="text-xs font-semibold text-slate-500">Tahap Aktif: Wawancara AI</span>
              </div>
            </Card>
          </div>

          {/* ROW 2: BREAKDOWN SKOR AI & VISUALISASI KOMPETENSI (2 Columns) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Breakdown Skor AI dengan Warna Dinamis per Skor & Link Pop-up Modal Algoritma */}
            <Card className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-base font-bold text-slate-900">Breakdown Skor AI</h3>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger className="text-slate-400 hover:text-slate-600 transition-colors">
                          <IconInfoCircle className="size-4" />
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-xs p-3 text-xs leading-relaxed bg-slate-900 text-white rounded-xl shadow-xl">
                          Penilaian AI berpatokan pada riset HRD profesional: memprioritaskan bukti penggunaan nyata &amp; hasil terukur ketimbang klaim sepihak di CV, serta menilai konsistensi alur karier kandidat.
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <button
                    onClick={() => setIsAlgorithmModalOpen(true)}
                    className="text-xs font-bold text-slate-700 hover:text-slate-900 cursor-pointer inline-flex items-center gap-1 transition-colors"
                  >
                    Lihat transparansi algoritma ›
                  </button>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      label: "Kecocokan Skill",
                      current: 32,
                      max: 35,
                      icon: IconUser,
                      desc: "Dinilai dari kesesuaian skill utama. AI membedakan skill yang sekadar ditulis di daftar (skor rendah) dengan skill yang dibuktikan dalam pekerjaan atau proyek nyata.",
                    },
                    {
                      label: "Pengalaman Kerja",
                      current: 22,
                      max: 25,
                      icon: IconBriefcase,
                      desc: "Dinilai dari relevansi industri, konsistensi riwayat kerja, dan pencapaian terukur (bukan sekadar daftar tugas biasa).",
                    },
                    {
                      label: "Tanggung Jawab",
                      current: 18,
                      max: 20,
                      icon: IconListCheck,
                      desc: "Dinilai dari seberapa sesuai peran, lingkup kerja, dan skala tanggung jawab kandidat sebelumnya dengan kebutuhan posisi ini.",
                    },
                    {
                      label: "Pendidikan",
                      current: 8,
                      max: 10,
                      icon: IconSchool,
                      desc: "Dinilai dari kesesuaian jenjang pendidikan, jurusan/bidang studi, serta kepemilikan sertifikasi profesional pendukung.",
                    },
                    {
                      label: "Kualifikasi Tambahan",
                      current: 2,
                      max: 10,
                      icon: IconStar,
                      desc: "Dinilai dari nilai tambah seperti portofolio proyek, bahasa asing, aktivitas organisasi, dan kepemimpinan.",
                    },
                  ].map((item, idx) => {
                    const catMeta = getCategoryScoreMeta(item.current, item.max)
                    return (
                      <div key={idx} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs sm:text-sm">
                          <span className="font-semibold text-slate-800 flex items-center gap-2">
                            <item.icon className="size-4 text-slate-500 shrink-0" />
                            {item.label}
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger className="text-slate-400 hover:text-slate-700 transition-colors">
                                  <IconHelpCircle className="size-3.5" />
                                </TooltipTrigger>
                                <TooltipContent side="top" className="max-w-xs p-3 text-xs leading-relaxed bg-slate-900 text-white rounded-xl shadow-xl">
                                  <p className="font-bold text-amber-300 mb-1">{item.label} ({item.current}/{item.max})</p>
                                  <p>{item.desc}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </span>
                          <span className="text-sm sm:text-base font-extrabold text-slate-900">
                            <span className={catMeta.scoreText}>{item.current}</span>{" "}
                            <span className="text-xs font-normal text-slate-400">/ {item.max}</span>
                          </span>
                        </div>
                        <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${catMeta.barBg} rounded-full transition-all duration-500`}
                            style={{ width: `${(item.current / item.max) * 100}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-4">
                <span className="text-xs sm:text-sm font-bold text-slate-600">Total skor</span>
                <span className="text-xl font-extrabold text-slate-900">
                  {overallScore} <span className="text-xs font-medium text-slate-400">/ 100</span>
                </span>
              </div>
            </Card>

            {/* Visualisasi Kompetensi Radar Chart */}
            <Card className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-base font-bold text-slate-900">Visualisasi Kompetensi</h3>
                    <IconInfoCircle className="size-4 text-slate-400" />
                  </div>
                </div>

                <div className="w-full h-[260px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData} outerRadius="75%">
                      <PolarGrid stroke="#e2e8f0" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: "#475569", fontSize: 11, fontWeight: 600 }} />
                      <Radar name="Kandidat" dataKey="Candidate" stroke="#0f172a" fill="#334155" fillOpacity={0.3} strokeWidth={2} />
                      <Radar name="Requirement" dataKey="Requirement" stroke="#94a3b8" fill="transparent" strokeDasharray="4 4" strokeWidth={1.5} />
                      <RechartsTooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="flex items-center justify-center gap-6 pt-2 border-t border-slate-100 text-xs font-semibold text-slate-600">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-0.5 bg-slate-900" />
                  <span>Kandidat</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-0.5 bg-slate-400 border-b border-dashed border-slate-400" />
                  <span>Requirement</span>
                </div>
              </div>
            </Card>
          </div>

          {/* ROW 3: BUKTI KECOCOKAN (EVIDENCE TABLE CONSOLIDATED CLEAN COLUMN) + CV PREVIEW */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* LEFT COLUMN: EVIDENCE TABLE WITH 3 FULL SUB-TABS (col-span-7) */}
            <Card className="lg:col-span-7 rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4 flex flex-col justify-between">
              <div>
                {/* Sub-tabs Navigation Header */}
                <div className="flex border-b border-slate-200 gap-6 text-xs sm:text-sm font-bold mb-4 overflow-x-auto">
                  <button
                    onClick={() => setEvidenceTab("evidence")}
                    className={`pb-2.5 border-b-2 transition-all whitespace-nowrap ${evidenceTab === "evidence"
                        ? "border-slate-900 text-slate-900"
                        : "border-transparent text-slate-500 hover:text-slate-800"
                      }`}
                  >
                    Bukti kecocokan (Evidence)
                  </button>
                  <button
                    onClick={() => setEvidenceTab("gap")}
                    className={`pb-2.5 border-b-2 transition-all whitespace-nowrap ${evidenceTab === "gap"
                        ? "border-slate-900 text-slate-900"
                        : "border-transparent text-slate-500 hover:text-slate-800"
                      }`}
                  >
                    Gap &amp; perlu divalidasi
                  </button>
                  <button
                    onClick={() => setEvidenceTab("sorotan")}
                    className={`pb-2.5 border-b-2 transition-all whitespace-nowrap ${evidenceTab === "sorotan"
                        ? "border-slate-900 text-slate-900"
                        : "border-transparent text-slate-500 hover:text-slate-800"
                      }`}
                  >
                    Sorotan CV
                  </button>
                </div>

                {/* SUB-TAB 1: BUKTI KECOCOKAN (EVIDENCE) - CONSOLIDATED MATCH & CONFIDENCE COLUMN */}
                {evidenceTab === "evidence" && (
                  <div>
                    <p className="text-xs sm:text-sm text-slate-500 mb-4">
                      AI mengekstrak bukti nyata dari CV untuk setiap requirement dan menilai tingkat keandalan bukti (*confidence level*).
                    </p>

                    <div className="overflow-x-auto rounded-2xl border border-slate-100">
                      <table className="w-full text-left text-xs sm:text-sm border-collapse min-w-[580px]">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold text-xs">
                          <tr>
                            <th className="py-3 px-3.5 w-1/4 min-w-[130px]">Requirement Posisi</th>

                            {/* Consolidated Match & Evidence Header with Single Clear Tooltip */}
                            <th className="py-3 px-3.5 w-1/3 min-w-[180px]">
                              <div className="flex items-center gap-1.5">
                                <span>Kesesuaian &amp; Bukti AI</span>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger className="text-slate-400 hover:text-slate-700 transition-colors">
                                      <IconHelpCircle className="size-3.5" />
                                    </TooltipTrigger>
                                    <TooltipContent side="top" className="max-w-xs sm:max-w-md p-3 text-xs bg-slate-900 text-white rounded-2xl shadow-2xl space-y-2">
                                      <p className="font-bold text-amber-300 border-b border-slate-800 pb-1">Metodologi Indikator Kecocokan AI</p>
                                      <p className="text-[11px] text-slate-300 leading-relaxed mb-1">
                                        AI menilai kecocokan dengan membandingkan syarat posisi terhadap bukti proyek nyata di CV:
                                      </p>
                                      <div className="grid grid-cols-2 gap-3 text-[11px]">
                                        <div className="flex flex-col gap-0.5">
                                          <span className="font-bold text-emerald-400">Strong Match (≥ 85%):</span>
                                          <span className="text-slate-200 leading-relaxed">Skill terbukti digunakan langsung pada proyek utama perusahaan.</span>
                                        </div>
                                        <div className="flex flex-col gap-0.5">
                                          <span className="font-bold text-amber-400">Partial Match (50–84%):</span>
                                          <span className="text-slate-200 leading-relaxed">Skill terbukti dipakai, namun cakupan/otomasi perlu divalidasi.</span>
                                        </div>
                                      </div>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                            </th>

                            <th className="py-3 px-3.5 w-2/5 min-w-[220px]">Bukti Utama di CV</th>
                            <th className="py-3 px-3 text-right">Aksi</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {allAssessments.length > 0 ? allAssessments.map((item, idx) => {
                            const isStrong = item.score >= 0.85;
                            const isPartial = item.score >= 0.5 && item.score < 0.85;
                            const statusLabel = item.match_status.replace(/_/g, " ");
                            const barWidth = Math.round(item.score * 100) + "%";
                            const barColor = isStrong ? "bg-emerald-500" : isPartial ? "bg-amber-500" : "bg-rose-500";
                            const confidenceColor = isStrong ? "text-emerald-700 bg-emerald-50 border-emerald-200" : isPartial ? "text-amber-800 bg-amber-50 border-amber-300" : "text-rose-700 bg-rose-50 border-rose-200";

                            return (
                            <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                              {/* Requirement Name */}
                              <td className="py-3.5 px-3.5 font-bold text-slate-900 align-top">
                                {item.requirement}
                                <div className="text-[10px] font-normal text-slate-500 mt-1 uppercase tracking-wide">
                                  {item.category} • {item.importance.replace(/_/g, " ")}
                                </div>
                              </td>

                              {/* Consolidated Cell: Top Badge, Bottom Progress Bar + Percentage */}
                              <td className="py-3.5 px-3.5 align-top whitespace-nowrap">
                                <div className="space-y-1.5">
                                  <div>
                                    <span
                                      className={`inline-block px-2.5 py-0.5 rounded-md text-[11px] font-bold ${confidenceColor}`}
                                    >
                                      {statusLabel}
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <div className="h-1.5 w-20 bg-slate-100 rounded-full overflow-hidden shrink-0">
                                      <div className={`h-full ${barColor} rounded-full`} style={{ width: barWidth }} />
                                    </div>
                                    <span className="text-[11px] font-extrabold text-slate-700">
                                      {barWidth}
                                    </span>
                                  </div>
                                </div>
                              </td>

                              {/* Bukti Utama (Multi-line text with Bold Key Terms) */}
                              <td className="py-3.5 px-3.5 text-xs text-slate-700 italic leading-relaxed align-top">
                                &ldquo;{item.evidence_text || item.reasoning}&rdquo;
                              </td>

                              {/* Lihat di CV Button */}
                              <td className="py-3.5 px-3 text-right align-top whitespace-nowrap">
                                <button
                                  onClick={() => setCvModalItem({ req: item.requirement, status: statusLabel, evidence: item.evidence_text || item.reasoning })}
                                  className="text-[11px] font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2.5 py-1.5 rounded-lg transition-colors inline-flex items-center gap-1"
                                >
                                  Lihat di CV
                                </button>
                              </td>
                            </tr>
                          )}) : (
                            <tr><td colSpan={4} className="py-6 text-center text-sm text-slate-500">Belum ada data bukti requirement. Silakan lakukan Screening AI.</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* SUB-TAB 2: GAP & PERLU DIVALIDASI */}
                {evidenceTab === "gap" && (
                  <div>
                    <p className="text-xs sm:text-sm text-slate-500 mb-4">
                      Daftar kualifikasi yang belum terbukti sepenuhnya di CV atau membutuhkan validasi lebih lanjut saat wawancara.
                    </p>

                    <div className="space-y-3">
                      {keyGaps.length > 0 ? keyGaps.map((gap, idx) => (
                        <div key={idx} className="p-3.5 rounded-2xl border border-amber-200 bg-amber-50/50 space-y-2">
                          <div className="flex items-center gap-1.5">
                            <IconInfoCircle className="size-4 text-amber-600" />
                            <span className="font-bold text-xs sm:text-sm text-slate-900 leading-relaxed">
                              {gap}
                            </span>
                          </div>
                        </div>
                      )) : (
                        <div className="p-4 text-center text-sm text-slate-500">Tidak ada gap signifikan yang terdeteksi.</div>
                      )}
                    </div>
                  </div>
                )}

                {/* SUB-TAB 3: SOROTAN CV */}
                {evidenceTab === "sorotan" && (
                  <div>
                    <p className="text-xs sm:text-sm text-slate-500 mb-4">
                      Poin-poin pencapaian &amp; pengakuan kunci kandidat yang diekstrak secara otomatis dari CV oleh AI.
                    </p>

                    <div className="space-y-3">
                      {CV_HIGHLIGHTS.map((hl, idx) => (
                        <div key={idx} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs sm:text-sm text-slate-900 flex items-center gap-1.5">
                              <IconSparkles className="size-4 text-slate-700" />
                              {hl.title}
                            </span>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-200 text-slate-800">
                              {hl.category}
                            </span>
                          </div>
                          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">&ldquo;{hl.text}&rdquo;</p>
                          <div className="pt-1 flex justify-end">
                            <button
                              onClick={() => setCvModalItem({ req: hl.title, status: "Sorotan Utama", evidence: hl.text })}
                              className="text-[11px] font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 px-2.5 py-1 rounded-lg transition-colors"
                            >
                              Lihat di CV
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </Card>

            {/* RIGHT COLUMN: PREVIEW CV WITH HIGHLIGHT (col-span-5) */}
            <Card className="lg:col-span-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-xs space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="text-xs sm:text-sm font-bold text-slate-900">Preview CV (dengan Highlight)</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 font-medium">Highlight:</span>
                    <button
                      onClick={() => setHighlightActive(!highlightActive)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${highlightActive ? "bg-slate-900" : "bg-slate-200"
                        }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${highlightActive ? "translate-x-4" : "translate-x-0"
                          }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Toolbar document reader */}
                <div className="flex items-center justify-between bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-600 my-2">
                  <div className="flex items-center gap-1">
                    <button className="p-1 hover:bg-slate-200 rounded text-slate-500">-</button>
                    <button className="p-1 hover:bg-slate-200 rounded text-slate-500">+</button>
                  </div>
                  <span className="text-xs font-medium text-slate-500">1 / 3</span>
                  <div className="flex items-center gap-1">
                    <button className="p-1 hover:bg-slate-200 rounded text-slate-500">‹</button>
                    <button className="p-1 hover:bg-slate-200 rounded text-slate-500">›</button>
                    <IconSearch className="size-3.5 text-slate-400 ml-1" />
                    <IconMaximize className="size-3.5 text-slate-400 ml-1 cursor-pointer" />
                  </div>
                </div>

                {/* Simulated Highlighted CV Document */}
                <div className="rounded-2xl border border-slate-200 bg-white p-4 text-xs sm:text-sm leading-relaxed text-slate-700 font-sans shadow-inner space-y-3 max-h-[380px] overflow-y-auto">
                  <div className="border-b border-slate-100 pb-2">
                    <h4 className="font-bold text-slate-900 text-sm">{candidate.applicantName}</h4>
                    <p className="font-medium text-slate-600">{candidate.jobTitle}</p>
                    <p className="text-xs text-slate-400">{candidate.domicile} | {candidate.phone || "+6281234567890"} | {candidate.email}</p>
                  </div>

                  <div>
                    <p className="font-bold text-xs text-slate-500 mb-1">Ringkasan profil</p>
                    <p>
                      {screening?.cvSummary || "Profil belum berhasil dianalisis sepenuhnya oleh AI."}
                    </p>
                  </div>

                  <div>
                    <p className="font-bold text-xs text-slate-500 mb-1">Pengalaman kerja</p>
                    <div className="space-y-2">
                      <p className="text-xs text-slate-600">
                        {screening?.workExperienceYears !== undefined 
                          ? `Kandidat memiliki total pengalaman kerja sekitar ${screening.workExperienceYears} tahun.`
                          : "Silakan unduh dokumen CV untuk melihat riwayat pengalaman selengkapnya."}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Highlight Legend */}
                <div className="pt-3 border-t border-slate-100">
                  <p className="text-xs text-slate-500 mb-2 italic">Dokumen asli CV dapat diunduh untuk melihat rincian riwayat pekerjaan dan kualifikasi lainnya.</p>
                </div>
              </div>
            </Card>
          </div>

        </TabsContent>

        {/* TAB 2: HASIL WAWANCARA AI */}
        <TabsContent value="wawancara" className="space-y-6 m-0">
          <Card className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Hasil Evaluasi Wawancara AI</h3>
                <p className="text-xs text-slate-500 mt-1">Transkrip dan skor validasi kompetensi dari wawancara AI kandidat</p>
              </div>
              <Badge variant={interview?.status === "completed" ? "default" : "secondary"} className="text-xs font-semibold px-3 py-1">
                {interview?.status === "completed" ? "Wawancara Selesai" : "Belum Dilakukan"}
              </Badge>
            </div>

            {interview?.status === "completed" ? (
              <div className="py-4 space-y-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row justify-between md:items-center gap-4">
                  <div>
                    <p className="text-sm font-bold text-slate-900">Skor Rekomendasi AI: {Math.round(interview.recommendationScore ?? 0)}/100</p>
                    <p className="text-xs text-slate-600 mt-0.5">Keandalan Bukti: {interview.evidenceConfidence || "High"}</p>
                  </div>
                </div>
                
                {interview.competencyScores && Object.keys(interview.competencyScores).length > 0 && (
                  <div className="space-y-3 mt-4">
                    <h4 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">Penilaian Kompetensi (Evidence-Based)</h4>
                    {Object.entries(interview.competencyScores).map(([name, score]) => (
                      <div key={name} className="border border-slate-200 rounded-xl p-4 bg-white shadow-xs space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm text-slate-900">{name}</span>
                          <Badge variant={score >= 75 ? "default" : score >= 50 ? "secondary" : "destructive"}>
                            {score >= 75 ? "STRONG_EVIDENCE" : score >= 50 ? "PARTIAL_EVIDENCE" : "INSUFFICIENT_EVIDENCE"} ({score})
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-700">
                          Skor kompetensi dihitung dari evidence jawaban interview yang tersimpan.
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="py-12 text-center space-y-3">
                <IconBriefcase className="size-10 text-slate-300 mx-auto" />
                <p className="text-sm font-bold text-slate-700">Wawancara AI belum dijalankan</p>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Undang kandidat untuk melakukan wawancara AI agar sistem dapat mengevaluasi pemahaman teknis dan respon secara otomatis.
                </p>
                <Button size="sm" className="rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs mt-2">
                  Jalankan Wawancara AI Sekarang
                </Button>
              </div>
            )}
          </Card>
        </TabsContent>

        {/* TAB 3: CATATAN & TIMELINE HR */}
        <TabsContent value="catatan" className="space-y-6 m-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Catatan HR */}
            <Card className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">Catatan HR</h3>
                <IconDotsVertical className="size-4 text-slate-400 cursor-pointer" />
              </div>
              <p className="text-xs text-slate-500">Belum ada catatan internal dari tim HR untuk kandidat ini.</p>
              <Button variant="outline" size="sm" className="rounded-xl border-slate-200 text-xs font-semibold">
                Tambah Catatan HR
              </Button>
            </Card>

            {/* Timeline Aktivitas */}
            <Card className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">Timeline Aktivitas Rekrutmen</h3>
              <div className="space-y-4 text-xs sm:text-sm">
                {[
                  { title: "Lamaran diterima", date: "22 Jul 2026 10:25", color: "text-emerald-500" },
                  { title: "Screening AI selesai", subtitle: `Skor: ${overallScore}/100`, date: "22 Jul 2026 10:27", color: "text-emerald-500" },
                  { title: "Dilihat oleh HRD", subtitle: "oleh: Andi HRD", date: "22 Jul 2026 10:35", color: "text-slate-500" },
                  { title: "Status diubah: Under Review", subtitle: "oleh: Andi HRD", date: "22 Jul 2026 11:02", color: "text-slate-500" },
                ].map((act, idx) => (
                  <div key={idx} className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2.5">
                      <IconCircleCheckFilled className={`size-4 shrink-0 mt-0.5 ${act.color}`} />
                      <div>
                        <p className="font-semibold text-slate-900">{act.title}</p>
                        {act.subtitle && <p className="text-xs text-slate-400 mt-0.5">{act.subtitle}</p>}
                      </div>
                    </div>
                    <span className="text-xs text-slate-400 font-medium shrink-0">{act.date}</span>
                  </div>
                ))}
              </div>
            </Card>

          </div>
        </TabsContent>

        {/* TAB 4: PREVIEW CV DOCUMENT */}
        {resumeUrl && (
          <TabsContent value="cv-preview" className="m-0">
            <Card className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900">Document Preview CV</h3>
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-semibold text-slate-700 hover:underline"
                >
                  Buka di tab baru ↗
                </a>
              </div>
              <iframe
                src={`${resumeUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                className="w-full rounded-2xl border border-slate-200 min-h-[650px]"
                title="CV Document Full Preview"
              />
            </Card>
          </TabsContent>
        )}
      </Tabs>

      {/* FOOTER DISCLAIMER */}
      <div className="p-4 rounded-2xl border border-slate-200 bg-white text-xs text-slate-500 leading-relaxed flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
        <div>
          <span className="font-bold text-slate-700">Tentang Penilaian AI: </span>
          Skor AI dihitung berdasarkan 5 dimensi utama dengan bobot yang telah ditentukan oleh perusahaan. AI hanya memberikan rekomendasi berdasarkan analisis CV dan wawancara. Keputusan akhir tetap berada di tangan tim rekrutmen.
        </div>
        <button className="text-xs font-semibold text-slate-700 hover:text-slate-900 shrink-0 inline-flex items-center gap-1">
          Pelajari metode penilaian AI kami ›
        </button>
      </div>

      {/* 4. DEEP-DIVE SCORE EXPLANATION DIALOG */}
      <Dialog open={isScoreModalOpen} onOpenChange={setIsScoreModalOpen}>
        <DialogContent className="sm:max-w-4xl lg:max-w-5xl max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-200 bg-white p-5 sm:p-8 shadow-2xl space-y-6">
          <DialogHeader className="pb-4 border-b border-slate-100 space-y-1.5 relative">
            <div className="flex flex-wrap items-center justify-between gap-2 pr-6">
              <div className="flex items-center gap-2.5">
                <DialogTitle className="text-lg sm:text-xl font-bold text-slate-900">
                  Analisis Mendalam &amp; Matriks Kesiapan AI ({overallScore}/100)
                </DialogTitle>
                <span className={`px-3 py-0.5 rounded-md text-xs font-bold ${scoreMeta.colorText} bg-slate-100 border border-slate-200`}>
                  {scoreMeta.label}
                </span>
              </div>
            </div>
            <DialogDescription className="text-xs sm:text-sm text-slate-500">
              Analisis mendalam kesiapan teknis per-domain industri serta penyandingan tanggung jawab pekerjaan vs bukti rekam jejak di CV kandidat.
            </DialogDescription>
          </DialogHeader>

          {/* Section 1: Chart Pemetaan Kesiapan Domain Teknis */}
          <div className="space-y-3 bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  1. Pemetaan Kesiapan Domain Teknis (Tingkat Kesiapan Kandidat vs Standard Target 100%)
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Menilai tingkat kemahiran kandidat per-domain teknis utama untuk mengukur apakah kandidat siap kerja langsung (*ready-to-deploy*) atau memerlukan pendampingan.
                </p>
              </div>
            </div>

            {/* Recharts BarChart dengan Benchmark Line 100% dan Warna Dinamis Per Batang */}
            <div className="w-full h-[240px] pt-3">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={domainMatrixData} margin={{ top: 20, right: 20, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="domain" tick={{ fill: "#475569", fontSize: 11, fontWeight: 600 }} />
                  <YAxis tick={{ fill: "#475569", fontSize: 11 }} domain={[0, 110]} />
                  <RechartsTooltip />
                  {/* Reference Line Standar Kebutuhan Posisi 100% */}
                  <ReferenceLine
                    y={100}
                    stroke="#475569"
                    strokeDasharray="4 4"
                    strokeWidth={2}
                    label={{ value: "Standar Target Posisi (100%)", fill: "#334155", fontSize: 11, fontWeight: 700, position: "top" }}
                  />
                  {/* Dynamic Color Cells for Candidate CV Match Score */}
                  <Bar dataKey="Capaian_Kandidat" radius={[6, 6, 0, 0]} name="Cakupan Bukti CV Kandidat (%)">
                    {domainMatrixData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getBarColor(entry.Capaian_Kandidat)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Skala Legenda Warna Indikator Penilaian */}
            <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs font-semibold text-slate-700">
              <span className="text-slate-500 font-bold">Indikator Kesiapan Kerja:</span>
              <div className="flex flex-wrap items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <div className="size-3 rounded-sm bg-emerald-500" /> ≥ 85%: Sangat Siap (Melampaui Standar)
                </span>
                <span className="flex items-center gap-1.5">
                  <div className="size-3 rounded-sm bg-sky-600" /> 70–84%: Siap (Memenuhi Standar)
                </span>
                <span className="flex items-center gap-1.5">
                  <div className="size-3 rounded-sm bg-amber-500" /> 50–69%: Butuh Pendampingan Singkat
                </span>
                <span className="flex items-center gap-1.5">
                  <div className="size-3 rounded-sm bg-rose-500" /> &lt; 50%: Gap Kompetensi Utama
                </span>
              </div>
            </div>
          </div>

          {/* Section 2: Penyesuaian Tanggung Jawab Peran */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-900">
              2. Penyesuaian Tanggung Jawab Peran (Job Requirement vs Riwayat Kerja CV)
            </h4>
            <p className="text-xs text-slate-500">
              Penyandingan mendalam antara deskripsi tugas utama lowongan dengan bukti tanggung jawab nyata yang pernah dipegang kandidat di perusahaan terdahulu.
            </p>

            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-100 border-b border-slate-200 text-slate-800 font-bold text-xs">
                  <tr>
                    <th className="py-3 px-4 w-1/4">Tanggung Jawab &amp; Syarat Posisi</th>
                    <th className="py-3 px-4 w-1/3">Riwayat Kerja &amp; Bukti Nyata di CV</th>
                    <th className="py-3 px-4">Evaluasi Kesesuaian AI</th>
                    <th className="py-3 px-3 text-right">Tingkat Match</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {DEEP_REQUIREMENT_MATCH_TABLE.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900 align-top">
                        <span className="block text-slate-900 font-bold">{row.requirement}</span>
                        <span className="text-xs text-slate-500 font-normal mt-0.5 block">{row.jobSpec}</span>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-800 italic leading-relaxed align-top">
                        &ldquo;{row.candidateCv}&rdquo;
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-600 leading-relaxed align-top">
                        {row.aiAssessment}
                      </td>
                      <td className="py-3.5 px-3 text-right align-top whitespace-nowrap">
                        <span className={`inline-block px-2.5 py-1 rounded-md text-[11px] font-bold ${row.statusColor}`}>
                          {row.matchStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex justify-end pt-3 border-t border-slate-100">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsScoreModalOpen(false)}
              className="rounded-xl text-xs font-semibold px-6"
            >
              Tutup Analisis Mendalam
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 5. DIALOG TRANSPARANSI METODOLOGI & ALGORITMA PENILAIAN AI (DENGAN SKOR DIPEROLEH DIBERI HIGHLIGHT WARNA UX) */}
      <Dialog open={isAlgorithmModalOpen} onOpenChange={setIsAlgorithmModalOpen}>
        <DialogContent className="sm:max-w-4xl lg:max-w-5xl max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-200 bg-white p-5 sm:p-8 shadow-2xl space-y-6">
          <DialogHeader className="pb-4 border-b border-slate-100 space-y-1.5 relative">
            <div className="flex flex-wrap items-center justify-between gap-2 pr-6">
              <div className="flex items-center gap-2.5">
                <DialogTitle className="text-lg sm:text-xl font-bold text-slate-900">
                  Transparansi &amp; Metodologi Algoritma Penilaian AI
                </DialogTitle>
                <span className="px-3 py-0.5 rounded-md text-xs font-bold bg-slate-900 text-white">
                  Bobot Standar HRD
                </span>
              </div>
            </div>
            <DialogDescription className="text-xs sm:text-sm text-slate-500">
              Penjelasan rasionalisasi pembobot AI berdasarkan standar rekrutmen profesional: Prinsip Bukti Penggunaan Nyata (*DISEBUT ≠ DIBUKTIKAN*).
            </DialogDescription>
          </DialogHeader>

          {/* Section 1: Ringkasan Prinsip Penilaian Algoritma (Universal Multi-Industri) */}
          <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 bg-slate-50/80 space-y-2">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <IconSparkles className="size-4 text-amber-500" />
              Prinsip Evaluasi AI: Bukti Pengalaman Nyata vs Klaim Sepihak di CV
            </h4>
            <p className="text-xs text-slate-700 leading-relaxed">
              Algoritma <strong className="text-slate-900">DirekrutAI</strong> tidak hanya membaca kata kunci sepihak di bagian *skills* CV. AI mengevaluasi kesesuaian berdasarkan <strong className="text-slate-900">bukti tanggung jawab pekerjaan nyata, rekam jejak hasil kerja, dan relevansi pengalaman</strong> di perusahaan terdahulu.
            </p>
          </div>

          {/* Section 2: Visualisasi Chart Proporsi Pembobot 5 Dimensi AI (Universal Multi-Industri) */}
          <div className="space-y-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200">
            <h4 className="text-sm font-bold text-slate-900">1. Distribusi Pembobot 5 Dimensi Penilaian AI</h4>
            <p className="text-xs text-slate-500">Total skor 100% dialokasikan ke dalam 5 dimensi utama sesuai tingkat urgensi kebutuhan rekrutmen profesional.</p>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center pt-2">
              <div className="md:col-span-5 h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={ALGORITHM_PIE_DATA}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {ALGORITHM_PIE_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Rincian 5 Dimensi Universal Multi-Industri dengan Bold Kata Kunci */}
              <div className="md:col-span-7 space-y-2 text-xs">
                {[
                  {
                    name: "Kecocokan Skill Utama",
                    weight: "35%",
                    desc: (
                      <>
                        <strong className="text-slate-900 font-bold">Bobot tertinggi (35%)</strong>. Menilai <strong className="text-slate-900 font-bold">penguasaan keahlian &amp; kompetensi inti</strong> (misal: <em>Finance, Healthcare, Tech, Marketing, HR</em>) yang terbukti pernah diterapkan pada <strong className="text-slate-900 font-bold">tugas nyata di CV</strong>.
                      </>
                    ),
                    color: "bg-indigo-500",
                  },
                  {
                    name: "Pengalaman Kerja Relevan",
                    weight: "25%",
                    desc: (
                      <>
                        <strong className="text-slate-900 font-bold">Bobot 25%</strong>. Menilai <strong className="text-slate-900 font-bold">keselarasan bidang pekerjaan</strong>, <strong className="text-slate-900 font-bold">stabilitas alur karier (retensi)</strong>, dan <strong className="text-slate-900 font-bold">rekam jejak pencapaian terukur</strong>.
                      </>
                    ),
                    color: "bg-sky-500",
                  },
                  {
                    name: "Skala Tanggung Jawab",
                    weight: "20%",
                    desc: (
                      <>
                        <strong className="text-slate-900 font-bold">Bobot 20%</strong>. Menilai <strong className="text-slate-900 font-bold">ruang lingkup tugas</strong> (contoh: <em>kelola anggaran, pimpin tim, skala sistem/operasional</em>) serta <strong className="text-slate-900 font-bold">tingkat senioritas peran</strong>.
                      </>
                    ),
                    color: "bg-emerald-500",
                  },
                  {
                    name: "Pendidikan & Sertifikasi",
                    weight: "10%",
                    desc: (
                      <>
                        <strong className="text-slate-900 font-bold">Bobot 10%</strong>. Menilai <strong className="text-slate-900 font-bold">kesesuaian kualifikasi akademik</strong> (S1/S2/D3) dan kepemilikan <strong className="text-slate-900 font-bold">lisensi/sertifikasi profesional resmi</strong> (misal: <em>CPA, STR, PMP, AWS</em>).
                      </>
                    ),
                    color: "bg-amber-500",
                  },
                  {
                    name: "Kualifikasi Tambahan",
                    weight: "10%",
                    desc: (
                      <>
                        <strong className="text-slate-900 font-bold">Bobot 10%</strong>. Menilai nilai tambah seperti <strong className="text-slate-900 font-bold">portofolio kerja</strong>, <strong className="text-slate-900 font-bold">penguasaan bahasa asing</strong>, dan <strong className="text-slate-900 font-bold">pengalaman organisasi/kepemimpinan</strong>.
                      </>
                    ),
                    color: "bg-rose-500",
                  },
                ].map((w, i) => (
                  <div key={i} className="flex items-start justify-between gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                    <div className="flex items-start gap-2.5">
                      <div className={`size-3.5 rounded-full ${w.color} shrink-0 mt-0.5`} />
                      <div>
                        <span className="font-bold text-slate-900 block text-xs">{w.name}</span>
                        <p className="text-[11px] text-slate-600 leading-relaxed mt-0.5">{w.desc}</p>
                      </div>
                    </div>
                    <span className="font-extrabold text-slate-900 shrink-0 text-xs sm:text-sm pl-2">{w.weight}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section 3: Tabel Rincian Metodologi Algoritma & Hasil Ekstraksi CV Kandidat Ini */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-900">2. Rincian Metodologi Algoritma &amp; Hasil Ekstraksi CV Kandidat Ini</h4>
            <p className="text-xs text-slate-500">Transparansi bagaimana AI menghitung skor per-dimensi untuk {candidate.applicantName}.</p>

            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-100 border-b border-slate-200 text-slate-800 font-bold text-xs">
                  <tr>
                    <th className="py-3 px-4 w-1/5">Dimensi &amp; Bobot</th>
                    <th className="py-3 px-3 text-center">Skor Diperoleh</th>
                    <th className="py-3 px-4 w-1/3">Metode / Algoritma Penilaian AI</th>
                    <th className="py-3 px-4">Bukti Nyata Terbukti di CV</th>
                    <th className="py-3 px-3 text-right">Status Bukti</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {ALGORITHM_TRANSPARENCY_TABLE.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900 align-top">
                        <span className="block text-slate-900 font-bold">{row.dimension}</span>
                        <span className="text-xs text-slate-500 font-semibold mt-0.5 block">Bobot: {row.weight}</span>
                      </td>
                      <td className="py-3.5 px-3 text-center align-top whitespace-nowrap">
                        <span className={`inline-block px-2.5 py-1 rounded-lg text-xs sm:text-sm font-extrabold border ${row.scoreColor || "bg-slate-100 text-slate-900 border-slate-200"}`}>
                          {row.score}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-600 leading-relaxed align-top">
                        {row.algorithm}
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-800 italic leading-relaxed align-top">
                        &ldquo;{row.cvResult}&rdquo;
                      </td>
                      <td className="py-3.5 px-3 text-right align-top whitespace-nowrap">
                        <span className={`inline-block px-2.5 py-1 rounded-md text-[11px] font-bold ${row.badgeColor}`}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex justify-end pt-3 border-t border-slate-100">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAlgorithmModalOpen(false)}
              className="rounded-xl text-xs font-semibold px-6"
            >
              Tutup Transparansi Algoritma
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 6. INTERACTIVE CV PDF READER POP-UP MODAL WITH TOOLTIPS */}
      {cvModalItem && (
        <Dialog open={!!cvModalItem} onOpenChange={(open) => !open && setCvModalItem(null)}>
          <DialogContent className="sm:max-w-4xl lg:max-w-5xl h-[85vh] rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl flex flex-col overflow-hidden">
            <DialogHeader className="space-y-1 pb-3 border-b border-slate-100 shrink-0">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <DialogTitle className="text-base sm:text-lg font-bold text-slate-900">
                    Pratinjau CV dengan Sorotan AI: {cvModalItem.req}
                  </DialogTitle>
                  <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200">
                    {cvModalItem.status}
                  </span>
                </div>
                {resumeUrl && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl border-slate-200 text-xs font-semibold gap-1.5"
                    onClick={() => window.open(resumeUrl, "_blank")}
                  >
                    <IconDownload className="size-3.5" /> Unduh Dokumen Asli
                  </Button>
                )}
              </div>
              <DialogDescription className="text-xs text-slate-500">
                Arahkan kursor (*hover*) pada bagian bersorotan untuk melihat tooltip pencocokan requirement dan alasan AI.
              </DialogDescription>
            </DialogHeader>

            {/* Document Reader Toolbar */}
            <div className="flex items-center justify-between bg-slate-100 px-4 py-2 rounded-2xl text-xs text-slate-700 shrink-0 my-3">
              <div className="flex items-center gap-2 font-semibold">
                <button
                  onClick={() => setZoomLevel((z) => Math.max(75, z - 15))}
                  className="p-1 hover:bg-white rounded-lg transition-colors"
                >
                  <IconZoomOut className="size-4" />
                </button>
                <span>{zoomLevel}%</span>
                <button
                  onClick={() => setZoomLevel((z) => Math.min(150, z + 15))}
                  className="p-1 hover:bg-white rounded-lg transition-colors"
                >
                  <IconZoomIn className="size-4" />
                </button>
              </div>

              <div className="flex items-center gap-2 font-medium">
                <span>Halaman 1 dari 3</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold text-slate-500">Highlighting:</span>
                <button
                  onClick={() => setHighlightActive(!highlightActive)}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${highlightActive ? "bg-slate-900" : "bg-slate-300"
                    }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition duration-200 ${highlightActive ? "translate-x-4" : "translate-x-0"
                      }`}
                  />
                </button>
              </div>
            </div>

            {/* A4 Paper Document Viewer Box */}
            <div className="flex-1 overflow-y-auto bg-slate-200/60 p-4 sm:p-8 rounded-2xl">
              <div
                className="max-w-3xl mx-auto bg-white rounded-2xl border border-slate-300 p-6 sm:p-10 shadow-lg text-xs sm:text-sm leading-relaxed text-slate-800 font-sans space-y-6 transition-all duration-200"
                style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: "top center" }}
              >
                {/* Active Requirement Focus Header Banner inside Modal */}
                <div className="p-3.5 rounded-xl border-l-4 border-l-slate-800 bg-slate-100 text-xs sm:text-sm space-y-1">
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    <IconSparkles className="size-4 text-slate-700" />
                    Fokus Requirement: {cvModalItem.req} ({cvModalItem.status})
                  </span>
                  <p className="text-slate-700 italic">&ldquo;{cvModalItem.evidence}&rdquo;</p>
                </div>

                {/* Candidate Header */}
                <div className="border-b border-slate-200 pb-4">
                  <h2 className="text-2xl font-bold text-slate-900">{candidate.applicantName}</h2>
                  <p className="text-sm font-semibold text-slate-600">{candidate.jobTitle}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {candidate.domicile} • {candidate.phone || "+6281234567890"} • {candidate.email}
                  </p>
                </div>

                {/* Ringkasan Profil */}
                <div className="space-y-2">
                  <h3 className="font-bold text-xs text-slate-400 uppercase tracking-wider">Ringkasan Profil</h3>
                  <p className="text-slate-700 leading-relaxed">
                    Software Engineer berpengalaman lebih dari 5 tahun dalam merancang dan mengembangkan backend service scalable berbasis{" "}
                    <span className="relative group inline-block">
                      <mark className={`px-1.5 py-0.5 rounded font-bold cursor-pointer transition-all ${highlightActive
                          ? cvModalItem.req.toLowerCase().includes("golang")
                            ? "bg-amber-300 text-slate-950 ring-2 ring-amber-500"
                            : "bg-sky-200 text-sky-900"
                          : ""
                        }`}>
                        Golang
                      </mark>
                      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:flex flex-col gap-1 w-64 p-2.5 bg-slate-900 text-white text-[11px] rounded-xl shadow-2xl z-50 pointer-events-none">
                        <span className="font-bold text-amber-300 flex items-center gap-1">
                          <IconSparkles className="size-3.5" /> Requirement Matched: Golang
                        </span>
                        <span className="text-slate-200">Kekuatan bukti: 100% (Strong Match)</span>
                      </span>
                    </span>
                    . Mahir mengimplementasikan RESTful API, arsitektur microservices terdistribusi, serta integrasi infrastruktur cloud.
                  </p>
                </div>

                {/* Pengalaman Kerja */}
                <div className="space-y-3">
                  <h3 className="font-bold text-xs text-slate-400 uppercase tracking-wider">Pengalaman Kerja</h3>

                  <div className="space-y-2">
                    <div className="flex justify-between items-baseline">
                      <h4 className="font-bold text-sm text-slate-900">Senior Backend Engineer — PT Techno Corp Tbk</h4>
                      <span className="text-xs text-slate-500">Jan 2024 – Sekarang</span>
                    </div>
                    <ul className="list-disc pl-5 space-y-2 text-slate-700">
                      <li>
                        <span className="relative group inline-block">
                          <mark className={`px-1.5 py-0.5 rounded font-semibold cursor-pointer transition-all ${highlightActive
                              ? cvModalItem.req.toLowerCase().includes("golang")
                                ? "bg-amber-300 text-slate-950 ring-2 ring-amber-500"
                                : "bg-sky-200 text-sky-900"
                              : ""
                            }`}>
                            Mengembangkan layanan backend menggunakan Golang dengan arsitektur microservices gRPC
                          </mark>
                          <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:flex flex-col gap-1 w-72 p-2.5 bg-slate-900 text-white text-[11px] rounded-xl shadow-2xl z-50 pointer-events-none">
                            <span className="font-bold text-sky-300 flex items-center gap-1">
                              <IconCheck className="size-3.5" /> Skill Match: Golang &amp; Microservices
                            </span>
                            <span className="text-slate-200">Bukti: Mengembangkan backend microservices di Golang</span>
                          </span>
                        </span>
                      </li>
                      <li>
                        <span className="relative group inline-block">
                          <mark className={`px-1.5 py-0.5 rounded font-semibold cursor-pointer transition-all ${highlightActive
                              ? cvModalItem.req.toLowerCase().includes("api")
                                ? "bg-amber-300 text-slate-950 ring-2 ring-amber-500"
                                : "bg-sky-200 text-sky-900"
                              : ""
                            }`}>
                            Merancang dan mengimplementasikan RESTful API yang aman &amp; scalable.
                          </mark>
                          <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:flex flex-col gap-1 w-64 p-2.5 bg-slate-900 text-white text-[11px] rounded-xl shadow-2xl z-50 pointer-events-none">
                            <span className="font-bold text-sky-300">Requirement: RESTful API</span>
                            <span className="text-slate-200">Status: Strong Match</span>
                          </span>
                        </span>
                      </li>
                      <li>
                        <span className="relative group inline-block">
                          <mark className={`px-1.5 py-0.5 rounded font-semibold cursor-pointer transition-all ${highlightActive
                              ? cvModalItem.req.toLowerCase().includes("docker") || cvModalItem.req.toLowerCase().includes("kubernetes")
                                ? "bg-amber-300 text-slate-950 ring-2 ring-amber-500"
                                : "bg-emerald-200 text-emerald-900"
                              : ""
                            }`}>
                            Menggunakan Docker dan Kubernetes (EKS) untuk containerization dan orchestration deployment.
                          </mark>
                          <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:flex flex-col gap-1 w-72 p-2.5 bg-slate-900 text-white text-[11px] rounded-xl shadow-2xl z-50 pointer-events-none">
                            <span className="font-bold text-emerald-300">Requirement: Docker &amp; Kubernetes</span>
                            <span className="text-slate-200">Status: Docker (Strong Match), K8s (Partial Match)</span>
                          </span>
                        </span>
                      </li>
                      <li>
                        <span className="relative group inline-block">
                          <mark className={`px-1.5 py-0.5 rounded font-semibold cursor-pointer transition-all ${highlightActive
                              ? cvModalItem.req.toLowerCase().includes("aws")
                                ? "bg-amber-300 text-slate-950 ring-2 ring-amber-500"
                                : "bg-emerald-200 text-emerald-900"
                              : ""
                            }`}>
                            Mengelola infrastruktur AWS (EKS, S3, RDS, CloudWatch) untuk ketersediaan tinggi.
                          </mark>
                          <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:flex flex-col gap-1 w-64 p-2.5 bg-slate-900 text-white text-[11px] rounded-xl shadow-2xl z-50 pointer-events-none">
                            <span className="font-bold text-emerald-300">Requirement: AWS Cloud</span>
                            <span className="text-slate-200">Bukti: Penggunaan nyata EKS, S3, RDS</span>
                          </span>
                        </span>
                      </li>
                    </ul>
                  </div>

                </div>

                {/* Legend Bar inside Modal */}
                <div className="pt-4 border-t border-slate-200">
                  <p className="text-xs font-bold text-slate-500 mb-2">Legenda highlight AI:</p>
                  <div className="flex flex-wrap gap-4 text-xs font-semibold">
                    <span className="flex items-center gap-1.5">
                      <div className="size-3 rounded-sm bg-sky-300 border border-sky-400" /> Skill Match
                    </span>
                    <span className="flex items-center gap-1.5">
                      <div className="size-3 rounded-sm bg-emerald-300 border border-emerald-400" /> Experience
                    </span>
                    <span className="flex items-center gap-1.5">
                      <div className="size-3 rounded-sm bg-amber-300 border border-amber-400" /> Focus Requirement (Dipilih)
                    </span>
                  </div>
                </div>

              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100 shrink-0">
              <span className="text-xs text-slate-500 font-medium">
                Requirement aktif: <strong>{cvModalItem.req}</strong>
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCvModalItem(null)}
                className="rounded-xl text-xs font-semibold px-5"
              >
                Tutup Pratinjau
              </Button>
            </div>

          </DialogContent>
        </Dialog>
      )}

    </div>
  )
}
