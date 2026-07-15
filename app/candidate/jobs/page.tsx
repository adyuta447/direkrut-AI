"use client"

import * as React from "react"
import { useApp } from "@/components/providers/app-provider"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { InputGroup, InputGroupAddon } from "@/components/ui/input-group"
import { Input } from "@/components/ui/input"
import { MapPinIcon, BriefcaseIcon, SearchIcon, BuildingIcon, ClockIcon } from "lucide-react"
import { useRouter } from "next/navigation"

export default function CandidateJobsPage() {
  const { jobs } = useApp()
  const router = useRouter()
  const [search, setSearch] = React.useState("")

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(search.toLowerCase()) || 
    job.company?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 pt-6 w-full space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Cari Lowongan</h2>
          <p className="text-muted-foreground mt-1">Temukan pekerjaan impian Anda dan lamar sekarang.</p>
        </div>
        <div className="w-full md:w-72">
          <InputGroup>
            <InputGroupAddon>
              <SearchIcon className="size-4 text-muted-foreground" />
            </InputGroupAddon>
            <Input 
              placeholder="Cari posisi atau perusahaan..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </InputGroup>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredJobs.length === 0 ? (
          <div className="col-span-full text-center py-12 border rounded-xl border-dashed">
            <SearchIcon className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
            <h3 className="mt-4 text-lg font-medium">Lowongan tidak ditemukan</h3>
            <p className="mt-1 text-sm text-muted-foreground">Coba gunakan kata kunci lain.</p>
          </div>
        ) : (
          filteredJobs.map((job) => (
            <Card key={job.id} className="flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                    {job.department}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{job.posted}</span>
                </div>
                <CardTitle className="text-xl line-clamp-1">{job.title}</CardTitle>
                <div className="text-sm text-muted-foreground space-y-1 mt-2">
                  <div className="flex items-center gap-1.5">
                    <BuildingIcon className="size-3.5" />
                    <span className="line-clamp-1">{job.company}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPinIcon className="size-3.5" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ClockIcon className="size-3.5" />
                    <span>{job.type}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-sm line-clamp-2 text-muted-foreground">
                  {job.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-1">
                  {job.requirements?.slice(0, 3).map((req, i) => (
                    <Badge key={i} variant="outline" className="text-xs font-normal">
                      {req}
                    </Badge>
                  ))}
                  {(job.requirements?.length || 0) > 3 && (
                    <Badge variant="outline" className="text-xs font-normal">
                      +{(job.requirements?.length || 0) - 3} lagi
                    </Badge>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={() => router.push(`/candidate/apply/${job.id}`)}
                >
                  Lamar Posisi Ini
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
