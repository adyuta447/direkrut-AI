"use client"

import * as React from "react"
import { IconSparkles, IconInfoCircle, IconRefresh, IconCheck } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog"
import { getJobScoringWeights, updateJobScoringWeights } from "@/services/jobService"
import { ScoringWeightConfig, Job } from "@/lib/types"

interface SettingsJobAiScoringSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedJob: Job | null
}

export function SettingsJobAiScoringSheet({ open, onOpenChange, selectedJob }: SettingsJobAiScoringSheetProps) {
  const [weights, setWeights] = React.useState<ScoringWeightConfig | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [isSaving, setIsSaving] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [success, setSuccess] = React.useState(false)

  React.useEffect(() => {
    if (!open || !selectedJob) return
    let cancelled = false
    setIsLoading(true)
    setError(null)
    getJobScoringWeights(selectedJob.id)
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
  }, [open, selectedJob])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!weights || !selectedJob) return

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
      await updateJobScoringWeights(selectedJob.id, newWeights)
      setWeights({ ...weights, ...newWeights, isCustom: true })
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: any) {
      setError(err.message || "Gagal menyimpan bobot")
    } finally {
      setIsSaving(false)
    }
  }

  const applyDefault = () => {
    // Sebagai fallback sederhana jika tidak ada endpoint default
    setWeights({
      ...weights!,
      weightSkillMatch: 35,
      weightExperience: 25,
      weightEducation: 10,
      weightResponsibilities: 20,
      weightAdditional: 10,
      isCustom: true
    })
  }

  const total = weights ? (weights.weightSkillMatch + weights.weightExperience + weights.weightEducation + weights.weightResponsibilities + weights.weightAdditional) : 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-xl">
        <form onSubmit={handleSubmit} className="flex max-h-[85vh] flex-col">
          <DialogHeader className="gap-1 rounded-t-3xl bg-primary px-6 py-6 text-white">
            <div className="flex items-center gap-2">
              <IconSparkles className="size-6 text-white" />
              <DialogTitle className="text-[22px] font-bold text-white">Bobot AI: {selectedJob?.title}</DialogTitle>
            </div>
            <DialogDescription className="text-white/80">
              Timpa konfigurasi default perusahaan khusus untuk lowongan ini.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {isLoading ? (
              <div className="text-center text-ink-muted py-8">Memuat konfigurasi...</div>
            ) : !weights ? (
              <div className="text-center text-destructive py-8">Gagal memuat konfigurasi.</div>
            ) : (
              <>
                {weights.isCustom ? (
                  <div className="rounded-xl bg-blue-50 border border-blue-200 p-4 flex gap-3 text-sm text-blue-800">
                    <IconCheck className="size-5 shrink-0 text-blue-600 mt-0.5" />
                    <div>
                      <strong className="block mb-0.5 text-blue-900">Lowongan ini menggunakan bobot kustom</strong>
                      Bobot ini akan mengabaikan settingan default dari pengaturan perusahaan.
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl bg-surface-1 border border-hairline p-4 flex gap-3 text-sm text-ink-muted">
                    <IconInfoCircle className="size-5 shrink-0 text-ink mt-0.5" />
                    <div>
                      <strong className="block mb-0.5 text-ink">Menggunakan bobot bawaan perusahaan</strong>
                      Saat ini lowongan ini tidak memiliki bobot spesifik. Jika diubah, lowongan ini akan punya bobot khusus.
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-[15px]">Konfigurasi Persentase Bobot</Label>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      className="h-8 text-[11px] px-2.5"
                      onClick={applyDefault}
                    >
                      <IconRefresh className="size-3 mr-1" /> Reset ke Default
                    </Button>
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
              </>
            )}
          </div>
          <div className="flex justify-end gap-3 border-t border-hairline p-6">
            <DialogClose render={<Button type="button" variant="outline" className="border-hairline" />}>
              Tutup
            </DialogClose>
            <Button type="submit" disabled={isSaving || Math.abs(total - 100) > 0.1 || isLoading}>
              {isSaving ? "Menyimpan..." : "Simpan Bobot AI Khusus"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
