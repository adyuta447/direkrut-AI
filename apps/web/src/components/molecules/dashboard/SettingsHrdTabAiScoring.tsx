"use client"

import * as React from "react"
import { IconSparkles, IconInfoCircle, IconRefresh, IconCheck } from "@tabler/icons-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getCompanyScoringWeights, updateCompanyScoringWeights } from "@/services/jobService"
import { ScoringWeightConfig } from "@/lib/types"

export function SettingsHrdTabAiScoring() {
  const [weights, setWeights] = React.useState<ScoringWeightConfig | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [isSaving, setIsSaving] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [success, setSuccess] = React.useState(false)

  React.useEffect(() => {
    let cancelled = false
    getCompanyScoringWeights()
      .then((data) => {
        if (!cancelled) {
          setWeights(data)
          setIsLoading(false)
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message || "Gagal memuat konfigurasi bobot")
          setIsLoading(false)
        }
      })
    return () => { cancelled = true }
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!weights) return

    setIsSaving(true)
    setError(null)
    setSuccess(false)
    
    const formData = new FormData(e.currentTarget)
    const newWeights = {
      weightSkillMatch: parseFloat(formData.get("weightSkillMatch") as string || "0"),
      weightExperience: parseFloat(formData.get("weightExperience") as string || "0"),
      weightEducation: parseFloat(formData.get("weightEducation") as string || "0"),
      weightResponsibilities: parseFloat(formData.get("weightResponsibilities") as string || "0"),
      weightAdditional: parseFloat(formData.get("weightAdditional") as string || "0"),
    }

    const total = newWeights.weightSkillMatch + newWeights.weightExperience + newWeights.weightEducation + newWeights.weightResponsibilities + newWeights.weightAdditional
    if (Math.abs(total - 100) > 0.1) {
      setError(`Total bobot harus persis 100%. Saat ini: ${total.toFixed(1)}%`)
      setIsSaving(false)
      return
    }

    try {
      await updateCompanyScoringWeights(newWeights)
      setWeights({ ...weights, ...newWeights, isCustom: true })
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan bobot")
    } finally {
      setIsSaving(false)
    }
  }

  const applyDefault = (type: "professional" | "freshGrad") => {
    if (!weights) return
    const def = type === "professional" ? weights.defaultProfessional : weights.defaultFreshGraduate
    if (def) {
      setWeights({ ...weights, ...def })
    }
  }

  if (isLoading) {
    return <div className="p-8 text-center text-ink-muted">Memuat konfigurasi...</div>
  }

  if (!weights) {
    return <div className="p-8 text-center text-destructive">Gagal memuat konfigurasi.</div>
  }

  const total = weights.weightSkillMatch + weights.weightExperience + weights.weightEducation + weights.weightResponsibilities + weights.weightAdditional

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2 mb-1">
          <IconSparkles className="size-5 text-primary" />
          <CardTitle>Bobot AI Screening (Default Perusahaan)</CardTitle>
        </div>
        <CardDescription>
          Tentukan seberapa penting setiap aspek dalam menilai kandidat. Bobot ini akan digunakan sebagai default untuk semua lowongan pekerjaan di perusahaan kamu, kecuali jika HRD membuat bobot khusus di lowongan tersebut.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {weights.isCustom ? (
          <div className="mb-6 rounded-xl bg-blue-50 border border-blue-200 p-4 flex gap-3 text-sm text-blue-800">
            <IconCheck className="size-5 shrink-0 text-blue-600 mt-0.5" />
            <div>
              <strong className="block mb-0.5 text-blue-900">Perusahaan kamu menggunakan bobot kustom</strong>
              Kamu telah menyesuaikan bobot penilaian AI sesuai kebutuhan perusahaanmu.
            </div>
          </div>
        ) : (
          <div className="mb-6 rounded-2xl bg-primary p-5 flex gap-4 text-white">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white/15">
              <IconInfoCircle className="size-5" />
            </span>
            <div className="text-sm">
              <strong className="block mb-0.5 text-base font-semibold">Menggunakan bobot bawaan DirekrutAI</strong>
              <span className="text-white/80">Saat ini AI menilai kandidat menggunakan standar bobot algoritma kami. Kamu bisa menyesuaikannya di bawah.</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-[15px]">Konfigurasi Persentase Bobot</Label>
              <div className="flex gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  className="h-8 text-[11px] px-2.5"
                  onClick={() => applyDefault("professional")}
                >
                  <IconRefresh className="size-3 mr-1" /> Reset ke Profesional
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  className="h-8 text-[11px] px-2.5"
                  onClick={() => applyDefault("freshGrad")}
                >
                  <IconRefresh className="size-3 mr-1" /> Reset ke Fresh Graduate
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="weightSkillMatch">Kecocokan Skill (%)</Label>
                <Input 
                  id="weightSkillMatch" 
                  name="weightSkillMatch" 
                  type="number" 
                  step="0.1" 
                  min="0" 
                  max="100" 
                  value={weights.weightSkillMatch}
                  onChange={e => setWeights({...weights, weightSkillMatch: parseFloat(e.target.value) || 0})}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weightExperience">Pengalaman Kerja (%)</Label>
                <Input 
                  id="weightExperience" 
                  name="weightExperience" 
                  type="number" 
                  step="0.1" 
                  min="0" 
                  max="100" 
                  value={weights.weightExperience}
                  onChange={e => setWeights({...weights, weightExperience: parseFloat(e.target.value) || 0})}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weightEducation">Pendidikan (%)</Label>
                <Input 
                  id="weightEducation" 
                  name="weightEducation" 
                  type="number" 
                  step="0.1" 
                  min="0" 
                  max="100" 
                  value={weights.weightEducation}
                  onChange={e => setWeights({...weights, weightEducation: parseFloat(e.target.value) || 0})}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weightResponsibilities">Tanggung Jawab Sebelumnya (%)</Label>
                <Input 
                  id="weightResponsibilities" 
                  name="weightResponsibilities" 
                  type="number" 
                  step="0.1" 
                  min="0" 
                  max="100" 
                  value={weights.weightResponsibilities}
                  onChange={e => setWeights({...weights, weightResponsibilities: parseFloat(e.target.value) || 0})}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weightAdditional">Kualifikasi Tambahan (%)</Label>
                <Input 
                  id="weightAdditional" 
                  name="weightAdditional" 
                  type="number" 
                  step="0.1" 
                  min="0" 
                  max="100" 
                  value={weights.weightAdditional}
                  onChange={e => setWeights({...weights, weightAdditional: parseFloat(e.target.value) || 0})}
                  required 
                />
              </div>
            </div>

            <div className={`p-4 rounded-xl border flex items-center justify-between ${Math.abs(total - 100) > 0.1 ? "bg-rose-50 border-rose-200 text-rose-800" : "bg-emerald-50 border-emerald-200 text-emerald-800"}`}>
              <span className="font-semibold text-sm">Total Bobot:</span>
              <span className="font-bold text-lg">{total.toFixed(1)}%</span>
            </div>
            {Math.abs(total - 100) > 0.1 && (
              <p className="text-xs text-rose-600 font-medium">Total bobot wajib berjumlah 100%.</p>
            )}
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
          {success && <p className="text-sm text-emerald-600 font-medium">Bobot berhasil disimpan.</p>}

          <Button type="submit" disabled={isSaving || Math.abs(total - 100) > 0.1}>
            {isSaving ? "Menyimpan..." : "Simpan Bobot AI"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
