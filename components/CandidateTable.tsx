"use client";

import { useState, useMemo } from "react";
import {
  Search,
  Eye,
  TrendingUp,
  PieChart as PieChartIcon,
  FileText,
  Briefcase,
  BarChart3,
  AlertCircle,
  Clock,
  MoreHorizontal,
} from "lucide-react";
import { useApp } from "@/components/providers/app-provider";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CandidateTableProps {
  onViewCandidate?: (candidateId: string) => void;
  searchTerm?: string;
}

function getScoreLabel(score?: number): { label: string; variant: "default" | "secondary" | "destructive" | "outline" } {
  if (!score) return { label: "—", variant: "outline" };
  if (score >= 75) return { label: "Memenuhi Syarat", variant: "default" };
  if (score >= 55) return { label: "Perlu Dikembangkan", variant: "secondary" };
  return { label: "Tidak Sesuai", variant: "destructive" };
}

function getDaysWaiting(appliedDate: string): number {
  if (appliedDate === "Hari ini" || appliedDate === "Today") return 0;
  const dateMap: Record<string, number> = {
    "Jan": 0, "Feb": 1, "Mar": 2, "Apr": 3, "Mei": 4, "Jun": 5,
    "Jul": 6, "Agu": 7, "Sep": 8, "Okt": 9, "Nov": 10, "Des": 11,
    "May": 4, "Aug": 7, "Oct": 9, "Dec": 11,
  };
  try {
    const parts = appliedDate.split(" ");
    if (parts.length >= 3) {
      const day = parseInt(parts[0]);
      const month = dateMap[parts[1]] ?? 0;
      const year = parseInt(parts[2]);
      const then = new Date(year, month, day);
      const now = new Date();
      const diffMs = now.getTime() - then.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 0;
    }
  } catch (_) {  }
  return 8;
}

export default function CandidateTable({
  onViewCandidate,
  searchTerm: externalSearchTerm = "",
}: CandidateTableProps) {
  const { applications, jobs } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [jobFilter, setJobFilter] = useState("all");
  const [scoreFilter, setScoreFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const activeSearchTerm = externalSearchTerm || searchTerm;

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.applicantName
        .toLowerCase()
        .includes(activeSearchTerm.toLowerCase()) ||
      app.jobTitle.toLowerCase().includes(activeSearchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    const matchesJob = jobFilter === "all" || app.jobId === jobFilter;
    
    const scoreLabel = getScoreLabel(app.recommendationScore).label;
    const matchesScore = scoreFilter === "all" || scoreLabel === scoreFilter;

    return matchesSearch && matchesStatus && matchesJob && matchesScore;
  });

  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage);
  const paginatedApplications = filteredApplications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const potentialCandidates = useMemo(() => {
    return applications.filter((app) => {
      const score = app.recommendationScore || 0;
      return score >= 80 && app.status === "submitted";
    }).slice(0, 3);
  }, [applications]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "interview":
        return <Badge variant="default" className="bg-blue-500 hover:bg-blue-600">Wawancara</Badge>;
      case "under-review":
        return <Badge variant="secondary">Administrasi</Badge>;
      case "rejected":
        return <Badge variant="outline">Ditolak</Badge>;
      default:
        return <Badge variant="outline">Terkirim</Badge>;
    }
  };

  const avgScore =
    applications.filter((a) => a.recommendationScore).length > 0
      ? Math.round(
          applications
            .filter((a) => a.recommendationScore)
            .reduce((sum, a) => sum + (a.recommendationScore || 0), 0) /
            applications.filter((a) => a.recommendationScore).length,
        )
      : undefined;

  const avgScoreLabel = getScoreLabel(avgScore);

  const statCards = [
    {
      label: "Total Lamaran",
      value: applications.length,
    },
    {
      label: "Tahap Administrasi",
      value: applications.filter((a) => a.status === "under-review").length,
    },
    {
      label: "Wawancara",
      value: applications.filter((a) => a.status === "interview").length,
    },
    {
      label: "Rata-rata Kecocokan",
      value: avgScore ? avgScoreLabel.label : "—",
    },
  ];

  const statusDistribution = [
    {
      status: "terkirim",
      jumlah: applications.filter((a) => a.status === "submitted").length,
      fill: "var(--color-terkirim)",
    },
    {
      status: "administrasi",
      jumlah: applications.filter((a) => a.status === "under-review").length,
      fill: "var(--color-administrasi)",
    },
    {
      status: "wawancara",
      jumlah: applications.filter((a) => a.status === "interview").length,
      fill: "var(--color-wawancara)",
    },
    {
      status: "ditolak",
      jumlah: applications.filter((a) => a.status === "rejected").length,
      fill: "var(--color-ditolak)",
    },
  ];

  const statusChartConfig = {
    jumlah: { label: "Jumlah" },
    terkirim: { label: "Terkirim", color: "var(--chart-1)" },
    administrasi: { label: "Administrasi", color: "var(--chart-2)" },
    wawancara: { label: "Wawancara", color: "var(--chart-3)" },
    ditolak: { label: "Ditolak", color: "var(--chart-4)" },
  } satisfies ChartConfig;

  const trendData = useMemo(() => {
    const days = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
    return days.map((day, idx) => {
      const total = Math.max(
        1,
        Math.floor(applications.length * ((idx + 1) / 7)),
      );
      const submitted = Math.floor(total * 0.4 + Math.random() * total * 0.2);
      const underReview = Math.floor(
        total * 0.3 + Math.random() * total * 0.15,
      );
      const interview = Math.floor(total * 0.2 + Math.random() * total * 0.1);
      const rejected = Math.floor(total * 0.1 + Math.random() * total * 0.05);

      return {
        day,
        total: submitted + underReview + interview + rejected,
        wawancara: interview,
      };
    });
  }, [applications.length]);

  const trendChartConfig = {
    total: { label: "Total Lamaran", color: "var(--chart-1)" },
    wawancara: { label: "Lolos Wawancara", color: "var(--chart-2)" },
  } satisfies ChartConfig;

  const scoreDistributionData = [
    {
      kategori: "memenuhi",
      kandidat: applications.filter((a) => (a.recommendationScore || 0) >= 75).length,
      fill: "var(--color-memenuhi)",
    },
    {
      kategori: "berkembang",
      kandidat: applications.filter((a) => {
        const s = a.recommendationScore || 0;
        return s >= 55 && s < 75;
      }).length,
      fill: "var(--color-berkembang)",
    },
    {
      kategori: "tidak_sesuai",
      kandidat: applications.filter((a) => (a.recommendationScore || 0) < 55 && (a.recommendationScore || 0) > 0).length,
      fill: "var(--color-tidak_sesuai)",
    },
  ];

  const scoreChartConfig = {
    kandidat: { label: "Kandidat" },
    memenuhi: { label: "Memenuhi Syarat", color: "var(--chart-2)" },
    berkembang: { label: "Perlu Dikembangkan", color: "var(--chart-3)" },
    tidak_sesuai: { label: "Tidak Sesuai", color: "var(--chart-1)" },
  } satisfies ChartConfig;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Manajemen Pelamar</h2>
          <p className="text-muted-foreground">
            {applications.length} total lamaran
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card, index) => {
          const gradients = [
            "bg-gradient-to-br from-blue-500/10 via-transparent to-transparent border-blue-200/50 dark:border-blue-900/50",
            "bg-gradient-to-br from-purple-500/10 via-transparent to-transparent border-purple-200/50 dark:border-purple-900/50",
            "bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent border-emerald-200/50 dark:border-emerald-900/50",
            "bg-gradient-to-br from-orange-500/10 via-transparent to-transparent border-orange-200/50 dark:border-orange-900/50",
          ];
          return (
            <Card key={card.label} className={gradients[index]}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {card.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="flex flex-col gap-4 md:flex-row items-center">
        <div className="relative w-full md:max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Cari berdasarkan nama atau posisi..."
            className="w-full pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Select
          value={jobFilter}
          onValueChange={(value) => value && setJobFilter(value)}
        >
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Semua Lowongan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Lowongan</SelectItem>
            {jobs.map((j) => (
              <SelectItem key={j.id} value={j.id}>{j.title}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={statusFilter}
          onValueChange={(value) => value && setStatusFilter(value)}
        >
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Semua Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="submitted">Terkirim</SelectItem>
            <SelectItem value="under-review">Administrasi</SelectItem>
            <SelectItem value="interview">Wawancara</SelectItem>
            <SelectItem value="rejected">Ditolak</SelectItem>
          </SelectContent>
        </Select>

        <Select value={scoreFilter} onValueChange={(val) => {
          if (val) {
            setScoreFilter(val);
            setCurrentPage(1);
          }
        }}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Semua Profil" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Profil</SelectItem>
            <SelectItem value="Memenuhi Syarat">Memenuhi Syarat</SelectItem>
            <SelectItem value="Perlu Dikembangkan">Perlu Dikembangkan</SelectItem>
            <SelectItem value="Tidak Sesuai">Tidak Sesuai</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kandidat</TableHead>
                <TableHead>Posisi</TableHead>
                <TableHead>CV</TableHead>
                <TableHead>Profil Keahlian</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedApplications.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    Tidak ada kandidat ditemukan.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedApplications.map((app) => {
                  const scoreInfo = getScoreLabel(app.recommendationScore);
                  const daysWaiting = getDaysWaiting(app.appliedDate);
                  const isWaiting = daysWaiting >= 7 && app.status === "submitted";

                  return (
                    <TableRow key={app.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarFallback>{app.applicantName.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-medium">{app.applicantName}</span>
                            {isWaiting && (
                              <span className="text-[11px] text-yellow-600 flex items-center gap-1 mt-0.5">
                                <Clock className="w-3 h-3" />
                                Menunggu {daysWaiting} hari
                              </span>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{app.jobTitle}</TableCell>
                      <TableCell>
                        {app.resumeLink ? (
                          <a
                            href={app.resumeLink}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-1 text-sm text-primary hover:underline"
                          >
                            <FileText className="h-4 w-4" /> Lihat
                          </a>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {app.recommendationScore ? (
                          <Badge variant={scoreInfo.variant}>
                            {scoreInfo.label}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(app.status)}
                      </TableCell>
                      <TableCell>{app.appliedDate}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            render={<Button variant="ghost" className="h-8 w-8 p-0" />}
                          >
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => onViewCandidate?.(app.id)}>
                              <Eye className="mr-2 h-4 w-4" />
                              Lihat Detail
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t">
            <span className="text-sm text-muted-foreground">
              Menampilkan {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, filteredApplications.length)} dari {filteredApplications.length}
            </span>
            <div className="flex gap-1">
              {Array.from({ length: totalPages }).map((_, i) => (
                <Button
                  key={i}
                  variant={currentPage === i + 1 ? "default" : "outline"}
                  size="sm"
                  className="w-8 h-8 p-0"
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </Button>
              ))}
            </div>
          </div>
        )}
      </Card>

      {potentialCandidates.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-900">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2 text-yellow-800 dark:text-yellow-500">
              <AlertCircle className="h-5 w-5" />
              Rekomendasi Tambahan
            </CardTitle>
            <CardDescription className="text-yellow-700 dark:text-yellow-600">
              Kandidat potensial yang mungkin terlewat dari filter utama Anda
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {potentialCandidates.map((app) => {
              const scoreInfo = getScoreLabel(app.recommendationScore);
              return (
                <div key={app.id} className="flex items-center justify-between border-b border-yellow-200 dark:border-yellow-800/50 pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback>{app.applicantName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium leading-none mb-1">{app.applicantName}</p>
                      <p className="text-sm text-muted-foreground">{app.jobTitle}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant={scoreInfo.variant}>{scoreInfo.label}</Badge>
                    <Button variant="outline" size="sm" onClick={() => onViewCandidate?.(app.id)}>
                      Tinjau
                    </Button>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        
        <Card className="col-span-1 md:col-span-2 lg:col-span-2 flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-medium">
              <TrendingUp className="h-4 w-4" />
              Tren Lamaran
            </CardTitle>
            <CardDescription>Lamaran masuk vs Lolos wawancara</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-4">
            <ChartContainer config={trendChartConfig} className="max-h-[250px] w-full">
              <AreaChart
                accessibilityLayer
                data={trendData}
                margin={{ left: 0, right: 0 }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="day"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                <defs>
                  <linearGradient id="fillTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-total)" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="var(--color-total)" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="fillWawancara" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-wawancara)" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="var(--color-wawancara)" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <Area
                  dataKey="wawancara"
                  type="natural"
                  fill="url(#fillWawancara)"
                  fillOpacity={0.4}
                  stroke="var(--color-wawancara)"
                  stackId="a"
                />
                <Area
                  dataKey="total"
                  type="natural"
                  fill="url(#fillTotal)"
                  fillOpacity={0.4}
                  stroke="var(--color-total)"
                  stackId="a"
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="col-span-1 lg:col-span-1 flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-medium">
              <BarChart3 className="h-4 w-4" />
              Distribusi Profil Keahlian
            </CardTitle>
            <CardDescription>Berdasarkan skor AI</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <ChartContainer config={scoreChartConfig}>
              <BarChart
                accessibilityLayer
                data={scoreDistributionData}
                layout="vertical"
                margin={{ left: 0 }}
              >
                <YAxis
                  dataKey="kategori"
                  type="category"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) =>
                    scoreChartConfig[value as keyof typeof scoreChartConfig]?.label
                  }
                />
                <XAxis dataKey="kandidat" type="number" hide />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar dataKey="kandidat" radius={5} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="col-span-1 lg:col-span-1 flex flex-col">
          <CardHeader className="items-center pb-0">
            <CardTitle className="flex items-center gap-2 text-base font-medium">
              <PieChartIcon className="h-4 w-4" />
              Rincian Status
            </CardTitle>
            <CardDescription>Keseluruhan lamaran</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            <ChartContainer
              config={statusChartConfig}
              className="mx-auto aspect-square max-h-[250px] [&_.recharts-text]:fill-background"
            >
              <PieChart>
                <ChartTooltip
                  content={<ChartTooltipContent nameKey="jumlah" hideLabel />}
                />
                <Pie data={statusDistribution} dataKey="jumlah">
                  <LabelList
                    dataKey="status"
                    className="fill-background"
                    stroke="none"
                    fontSize={12}
                    formatter={(value) =>
                      statusChartConfig[value as keyof typeof statusChartConfig]?.label
                    }
                  />
                </Pie>
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
