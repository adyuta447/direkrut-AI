import Link from "next/link"
import { CheckCircleIcon } from "lucide-react"
import { IconBriefcase, IconUsers } from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Job } from "@/lib/types"

interface AppDetailJobInfoProps {
  job: Job
  isFreshGrad: boolean
  hasCategory: boolean
  companyJobs: Job[]
}

export function AppDetailJobInfo({ job, isFreshGrad, hasCategory, companyJobs }: AppDetailJobInfoProps) {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold leading-[1.1] tracking-[-0.02em] md:text-2xl">Deskripsi Pekerjaan</CardTitle>
          <CardDescription>{job.title} di {job.company}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-sm leading-relaxed text-muted-foreground">
            {job.description || `Kami mencari individu yang berdedikasi dan kompeten untuk bergabung sebagai ${job.title} di ${job.company}.`}
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 rounded-2xl border p-4">
              <h4 className="flex items-center gap-2 text-sm font-semibold">
                <IconUsers className="size-4 text-primary" /> Terbuka untuk
              </h4>
              <div className="flex flex-wrap gap-2">
                {(isFreshGrad || !hasCategory) && <Badge variant="secondary">Fresh Graduate</Badge>}
                <Badge variant="secondary">Professional</Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                {job.requirements?.[0] || "Terbuka untuk semua jenjang karir yang memenuhi kualifikasi"}
              </p>
            </div>
            <div className="space-y-2 rounded-2xl border p-4">
              <h4 className="flex items-center gap-2 text-sm font-semibold">
                <IconBriefcase className="size-4 text-primary" /> Detail Posisi
              </h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tipe Pekerjaan</span>
                  <span className="font-medium">{job.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Lokasi</span>
                  <span className="font-medium">{job.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Kisaran Gaji</span>
                  <span className="font-medium">{job.salaryRange || "Kompetitif"}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold leading-[1.1] tracking-[-0.02em] md:text-2xl">Persyaratan &amp; Kualifikasi</CardTitle>
          <CardDescription>Yang perlu kamu punya buat posisi ini.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Persyaratan Utama</h4>
              <ul className="space-y-2">
                {(job.requirements && job.requirements.length > 0
                  ? job.requirements
                  : ["Memiliki kemampuan analitis dan komunikasi yang baik", "Mampu bekerja secara mandiri maupun dalam tim", "Familiar dengan tools dan teknologi yang relevan"]
                ).map((req: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <CheckCircleIcon className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {companyJobs.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold leading-[1.1] tracking-[-0.02em] md:text-2xl">Posisi Lain di {job.company}</CardTitle>
            <CardDescription>Siapa tau ada yang lebih cocok buat kamu.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              {companyJobs.filter((j) => j.id !== job.id).slice(0, 4).map((j) => (
                <div key={j.id} className="rounded-2xl border p-4 transition-colors hover:border-primary/50">
                  <div className="text-sm font-semibold">{j.title}</div>
                  <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{j.type}</span><span>·</span><span>{j.location}</span>
                  </div>
                  <div className="mt-2">
                    <Button size="sm" variant="ghost" className="h-7 px-2 text-xs text-primary hover:text-primary" render={<Link href="/candidate/jobs" />}>
                      Lihat Lowongan
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </>
  )
}
