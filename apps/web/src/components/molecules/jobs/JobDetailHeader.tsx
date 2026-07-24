import Link from "next/link";
import { Users, CheckCircle, Bookmark } from "lucide-react";
import { Job } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { useDashboard } from "@/context/DashboardContext";

interface JobDetailHeaderProps {
  job: Job;
  /** Tujuan tombol Lamar; default alur publik (register). */
  applyHref?: string;
  applicationStatus?: string;
}

export function JobDetailHeader({ job, applyHref = "/auth/register", applicationStatus }: JobDetailHeaderProps) {
  const { savedJobs, toggleSavedJob } = useDashboard();
  const isSaved = savedJobs?.includes(job.id);

  const logoUrl = job.id.charCodeAt(0) % 2 === 0 
    ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0BN_ZUkZz-mOnQwcZk28BfvRgxDZAi_zb0ORSodt9GKLdJculJM9kezM&s=10"
    : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTq3LQL2zAX0klKle21pMdjN86d9IIitbtYSayhxb9Jry0xTujdGNDx8eg&s=10";

  const getStatusButton = () => {
    if (!applicationStatus) {
      return (
        <Button render={<Link href={applyHref} />} size="lg" className="w-full sm:w-auto font-semibold">
          Lamar Sekarang
        </Button>
      );
    }
    
    return (
      <Button render={<Link href="/candidate" />} variant="outline" size="lg" className="w-full sm:w-auto font-semibold border-primary/30 text-primary bg-primary/5 hover:bg-primary/10">
        Sudah Dilamar (Ke Dashboard)
      </Button>
    );
  };

  return (
    <div className="p-6 md:p-8 border-b border-hairline bg-surface-1">
      <div className="flex flex-col md:flex-row md:items-start gap-4 mb-4">
        <img 
          src={logoUrl} 
          alt={`${job.company} logo`} 
          className="w-16 h-16 md:w-20 md:h-20 rounded-xl object-contain bg-white border border-hairline p-2"
        />
        <div className="flex-1">
          <h2 className="text-[clamp(24px,3vw,36px)] font-bold leading-[1.15] tracking-[-0.01em] mb-2 text-ink">
            {job.title}
          </h2>
          <p className="text-[17px] font-normal mb-1 text-ink">{job.company}</p>
          <p className="text-[14px] text-ink-muted">{job.location} • {job.industry}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-6">
        <span className="text-[13px] rounded-full bg-canvas px-3 py-1.5 text-primary font-medium border border-hairline">
          {job.salaryRange}
        </span>
        <span className="text-[13px] rounded-full bg-canvas px-3 py-1.5 text-ink border border-hairline">{job.type}</span>
        <span className="flex items-center gap-1.5 text-[13px] rounded-full bg-canvas px-3 py-1.5 text-ink-muted border border-hairline">
          <Users className="w-3.5 h-3.5" strokeWidth={1.5} />
          {job.applicantCount} pelamar
        </span>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-center">
        {getStatusButton()}
        <Button 
          variant="outline" 
          size="lg" 
          onClick={() => toggleSavedJob?.(job.id)}
          className={`w-full sm:w-auto font-semibold transition-colors ${isSaved ? "bg-primary/5 border-primary/30 text-primary" : ""}`}
        >
          <Bookmark className={`w-4 h-4 mr-2 ${isSaved ? "fill-primary text-primary" : ""}`} />
          {isSaved ? "Tersimpan" : "Simpan"}
        </Button>
      </div>
    </div>
  );
}
