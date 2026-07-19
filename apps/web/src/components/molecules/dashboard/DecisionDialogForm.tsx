import { Calendar, Clock, AlertCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Candidate } from "@/components/molecules/dashboard/CandidateTableTypes"

interface ScoreInfoProps {
  scoreInfo: { label: string; color: string }
  candidate: Candidate
}

export function CandidateInfoPanel({ candidate, scoreInfo }: ScoreInfoProps) {
  return (
    <div className="border rounded-lg p-4 space-y-4 bg-muted/20">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Kandidat
      </h4>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-md bg-primary text-primary-foreground flex items-center justify-center font-bold">
          {candidate.applicantName.charAt(0)}
        </div>
        <div>
          <p className="font-semibold">{candidate.applicantName}</p>
          <p className="text-xs text-muted-foreground">{candidate.jobTitle}</p>
        </div>
      </div>
      <div className="flex items-center justify-between pt-3 border-t">
        <span className="text-xs font-medium text-muted-foreground uppercase">
          Kecocokan AI
        </span>
        <span
          className={`text-xs font-semibold px-2 py-1 rounded-md ${scoreInfo.color}`}
        >
          {scoreInfo.label} ({candidate.recommendationScore}%)
        </span>
      </div>
    </div>
  )
}

interface InterviewDetailPanelProps {
  interviewType: "Wawancara Teknis" | "Wawancara HRD"
  interviewDate: string
  interviewTime: string
  onTypeChange: (val: "Wawancara Teknis" | "Wawancara HRD") => void
  onDateChange: (val: string) => void
  onTimeChange: (val: string) => void
}

export function InterviewDetailPanel({
  interviewType,
  interviewDate,
  interviewTime,
  onTypeChange,
  onDateChange,
  onTimeChange,
}: InterviewDetailPanelProps) {
  return (
    <div className="border rounded-lg p-4 space-y-4">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Detail Wawancara
      </h4>
      <div className="space-y-2">
        <Label>Jenis Wawancara</Label>
        <Select
          value={interviewType}
          onValueChange={(val: "Wawancara Teknis" | "Wawancara HRD" | null) => val && onTypeChange(val)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Pilih Jenis" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Wawancara HRD">Wawancara HRD</SelectItem>
            <SelectItem value="Wawancara Teknis">Wawancara Teknis</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" /> Tanggal
          </Label>
          <Input
            type="date"
            value={interviewDate}
            onChange={(e) => onDateChange(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> Waktu
          </Label>
          <Input
            type="time"
            value={interviewTime}
            onChange={(e) => onTimeChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  )
}

interface InviteSummaryProps {
  interviewType: string
  interviewDate: string
  interviewTime: string
}

export function InviteSummary({
  interviewType,
  interviewDate,
  interviewTime,
}: InviteSummaryProps) {
  if (!interviewDate || !interviewTime) return null
  const formattedDate = new Date(interviewDate).toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
  return (
    <div className="bg-muted/50 p-3 rounded-md text-xs space-y-1 mt-2">
      <p className="font-semibold mb-2">Ringkasan Undangan:</p>
      <p><span className="text-muted-foreground">Jenis:</span> {interviewType}</p>
      <p><span className="text-muted-foreground">Tanggal:</span> {formattedDate}</p>
      <p><span className="text-muted-foreground">Waktu:</span> {interviewTime} WIB</p>
    </div>
  )
}

interface EmailPreviewPanelProps {
  emailSubject: string
  emailBody: string
  onSubjectChange: (val: string) => void
  onBodyChange: (val: string) => void
  decision: "invite" | "reject"
  interviewType: string
  interviewDate: string
  interviewTime: string
}

export function EmailPreviewPanel({
  emailSubject,
  emailBody,
  onSubjectChange,
  onBodyChange,
  decision,
  interviewType,
  interviewDate,
  interviewTime,
}: EmailPreviewPanelProps) {
  return (
    <div className="border rounded-lg p-4 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Pratinjau Email
        </h4>
        <span className="text-[10px] font-medium bg-primary/10 text-primary px-2 py-1 rounded-full flex items-center gap-1 w-fit">
          <AlertCircle className="w-3 h-3" />
          Dikirim via Direkrut AI (Reply-to HRD)
        </span>
      </div>
      <div className="space-y-2">
        <Label>Subjek</Label>
        <Input
          value={emailSubject}
          onChange={(e) => onSubjectChange(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label>Pesan</Label>
        <Textarea
          value={emailBody}
          onChange={(e) => onBodyChange(e.target.value)}
          className="min-h-[250px] resize-y"
        />
      </div>
      {decision === "invite" && (
        <InviteSummary
          interviewType={interviewType}
          interviewDate={interviewDate}
          interviewTime={interviewTime}
        />
      )}
    </div>
  )
}

export function RejectAlert() {
  return (
    <Alert className="bg-warning/5 border-warning/20">
      <AlertCircle className="h-4 w-4 text-warning" />
      <AlertTitle className="text-warning font-semibold">
        Feedback yang Tetap Manusiawi
      </AlertTitle>
      <AlertDescription className="text-warning/90 mt-1">
        Draft ini udah diisi otomatis sama AI berdasarkan profil keahlian dan hasil
        wawancara kandidat — jadi tetap personal dan berbasis data, bukan template generik.
      </AlertDescription>
    </Alert>
  )
}
