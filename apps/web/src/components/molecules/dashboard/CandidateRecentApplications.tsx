import Link from "next/link";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/molecules/dashboard/StatusBadge";
import { EmptyState } from "@/components/molecules/dashboard/EmptyState";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FileTextIcon } from "lucide-react";
import { Application, Job } from "@/lib/types";
import { CandidateAppTableToolbar } from "./CandidateAppTableToolbar";

interface CandidateRecentApplicationsProps {
  applications: Application[];
  jobs: Job[];
}

export function CandidateRecentApplications({
  applications,
  jobs
}: CandidateRecentApplicationsProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredApps = useMemo(() => {
    return applications.filter((app) => {
      const job = jobs.find(j => j.id === app.jobId);
      const matchesSearch = searchTerm === "" || 
        app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (job && job.company.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesStatus = statusFilter === "all" || app.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [applications, jobs, searchTerm, statusFilter]);

  if (applications.length === 0) {
    return (
      <EmptyState
        icon={FileTextIcon}
        title="Belum ada lamaran nih"
        description="Sekali lamar, progresnya langsung muncul di sini. Nggak perlu bolak-balik ngecek email."
        action={
          <Button render={<Link href="/candidate/jobs" />}>Mulai Lamar</Button>
        }
      />
    );
  }

  return (
    <div className="space-y-4">
      <CandidateAppTableToolbar 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        applications={applications}
      />
      <div className="rounded-2xl border bg-background overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Posisi</TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden md:table-cell">Perusahaan</TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden lg:table-cell">Lokasi</TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</TableHead>
              <TableHead className="text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredApps.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  Tidak ada lamaran yang cocok dengan filter.
                </TableCell>
              </TableRow>
            ) : (
              filteredApps.map((app) => {
                const job = jobs.find(j => j.id === app.jobId);
                return (
                  <TableRow key={app.id}>
                    <TableCell className="py-4">
                      <div className="font-medium text-foreground">{app.jobTitle}</div>
                      <div className="text-xs text-muted-foreground md:hidden mt-1">{job?.company}</div>
                      <div className="text-[10px] text-muted-foreground mt-0.5">{new Date(app.appliedDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">
                      {job?.company || "-"}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-muted-foreground">
                      {job?.location || "-"}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={app.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-primary hover:text-primary"
                        render={<Link href={`/candidate/applications/${app.id}`} />}
                      >
                        Detail
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
