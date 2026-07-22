import * as React from "react";
import {
  IconVideo,
  IconPlayerPlay,
  IconSparkles,
  IconBriefcase,
  IconFileText,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TypingDots } from "@/components/atoms/shared/TypingDots";
import { DetailSection } from "@/components/molecules/dashboard/DetailSection";
import { StatTile } from "@/components/molecules/dashboard/StatTile";
import { Application } from "@/lib/types";
import { ExtendedCandidateData } from "@/lib/dashboard/extended-data";
import {
  getInterviewResult,
  getInterviewAudioUrl,
  getScreeningResult,
  type InterviewResult,
  type ScreeningResult,
} from "@/services/aiService";

function AnswerAudioPlayer({
  applicationId,
  questionIndex,
}: {
  applicationId: string;
  questionIndex: number;
}) {
  const [url, setUrl] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const handlePlay = async () => {
    if (url) return;
    setIsLoading(true);
    try {
      const audioUrl = await getInterviewAudioUrl(applicationId, questionIndex);
      setUrl(audioUrl);
    } catch {
      // ponytail: gagal ambil URL playback -- biarin tombolnya tetap ada, HRD bisa coba lagi.
    } finally {
      setIsLoading(false);
    }
  };

  if (url)
    return (
      <audio controls autoPlay src={url} className="h-8 w-full max-w-[240px]" />
    );
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handlePlay}
      disabled={isLoading}
      className="h-7 px-2 text-xs text-primary"
    >
      <IconPlayerPlay className="size-3.5 mr-1" />{" "}
      {isLoading ? "Memuat..." : "Putar Jawaban"}
    </Button>
  );
}

export function InterviewLogCard({
  candidate,
}: {
  candidate: Application & ExtendedCandidateData;
}) {
  const [interview, setInterview] = React.useState<InterviewResult | null>(
    null,
  );
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    let cancelled = false;
    getInterviewResult(candidate.id)
      .then((result) => {
        if (!cancelled) setInterview(result);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [candidate.id]);

  return (
    <Card className="rounded-3xl border border-hairline bg-canvas shadow-none ring-0 overflow-hidden pt-0">
      <CardHeader className="rounded-t-3xl bg-info py-5 text-white">
        <CardTitle className="text-[20px] font-semibold text-white">
          Rekaman &amp; Transkrip Wawancara AI
        </CardTitle>
        <CardDescription className="text-white/80">
          Sesi wawancara asinkron yang udah dijalani kandidat, kamera wajib
          nyala buat proctoring
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-7">
        {isLoading ? (
          <div className="flex items-center gap-3 rounded-2xl border border-hairline bg-surface-1 p-6 text-base text-ink-muted">
            <TypingDots /> Ngecek hasil wawancara...
          </div>
        ) : !interview ? (
          <div className="rounded-2xl border border-dashed border-hairline bg-surface-1 p-8 text-center space-y-2">
            <IconVideo className="size-9 text-muted-foreground/50 mx-auto" />
            <p className="text-lg font-bold text-ink">
              Kandidat belum menyelesaikan wawancara AI
            </p>
            <p className="text-base text-ink-muted">
              Transkrip &amp; skor bakal muncul di sini begitu kandidat selesai
              wawancara.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {interview.recommendationScore != null && (
                <StatTile
                  value={Math.round(interview.recommendationScore)}
                  label="Skor Rekomendasi AI"
                />
              )}
              <StatTile
                value={interview.proctoringFlags.length}
                label={
                  interview.proctoringFlags.length > 0
                    ? "kali pelanggaran (keluar tab/kamera) selama sesi ini"
                    : "kali pelanggaran integritas selama sesi ini"
                }
                tone={interview.proctoringFlags.length > 0 ? "warning" : "success"}
              />
            </div>

            <DetailSection title="Transkrip Tanya Jawab">
              <div className="space-y-4 bg-surface-1 p-4 rounded-2xl border border-hairline max-h-[400px] overflow-y-auto">
                {interview.items.map((item) => (
                  <React.Fragment key={item.questionIndex}>
                    <div className="flex flex-col gap-1 items-start">
                      <span className="text-sm font-semibold text-primary px-2">
                        AI Interviewer
                      </span>
                      <div className="bg-background border border-hairline p-3.5 rounded-2xl rounded-tl-sm max-w-[85%]">
                        <p className="text-base">{item.question}</p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 items-end">
                      <span className="text-sm font-semibold text-muted-foreground px-2">
                        {candidate.applicantName}
                      </span>
                      <div className="bg-primary text-primary-foreground p-3.5 rounded-2xl rounded-tr-sm max-w-[85%] text-right">
                        <p className="text-base">
                          {item.answer || "(gak ada transkrip)"}
                        </p>
                      </div>
                      <AnswerAudioPlayer
                        applicationId={candidate.id}
                        questionIndex={item.questionIndex}
                      />
                    </div>
                    {item.aiFeedback && (
                      <div className="flex items-start gap-2 max-w-[85%] rounded-xl border border-hairline px-3.5 py-2.5 text-sm text-ink-muted">
                        <IconSparkles className="size-4 text-primary shrink-0 mt-0.5" />
                        <span>{item.aiFeedback}</span>
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </DetailSection>
          </>
        )}
      </CardContent>
    </Card>
  );
}
export function PortfolioCard({
  candidate,
}: {
  candidate: Application & ExtendedCandidateData;
}) {
  const [screening, setScreening] = React.useState<ScreeningResult | null>(
    null,
  );
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    let cancelled = false;
    getScreeningResult(candidate.id)
      .then((result) => {
        if (!cancelled) setScreening(result);
      })
      .catch(() => {
        /* kartu ini opsional -- kalau gagal, tampil state kosong */
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [candidate.id]);

  return (
    <Card className="rounded-3xl border border-hairline bg-canvas shadow-none ring-0 overflow-hidden pt-0">
      <CardHeader className="rounded-t-3xl bg-brand-accent-strong py-5 text-white">
        <CardTitle className="text-[20px] font-semibold text-white">
          Portofolio &amp; Riwayat Kandidat
        </CardTitle>
        <CardDescription className="text-white/80">
          Diambil otomatis dari CV yang diunggah kandidat, dibaca AI
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-7">
        {isLoading ? (
          <div className="flex items-center gap-3 rounded-2xl border border-hairline bg-surface-1 p-6 text-base text-ink-muted">
            <TypingDots /> Ngambil hasil baca CV...
          </div>
        ) : !screening ? (
          <div className="rounded-2xl border border-dashed border-hairline bg-surface-1 p-8 text-center space-y-2">
            <IconFileText className="size-9 text-muted-foreground/50 mx-auto" />
            <p className="text-lg font-bold text-ink">
              CV kandidat belum dibaca AI
            </p>
            <p className="text-base text-ink-muted">
              Jalankan Screening AI dulu di tab Analisis -- ringkasan CV &amp;
              skill kandidat bakal muncul di sini.
            </p>
          </div>
        ) : (
          <>
            {screening.cvSummary && (
              <DetailSection title="Ringkasan CV (dari AI)">
                <p className="text-base leading-relaxed p-5 bg-surface-1 border border-hairline rounded-2xl italic text-ink">
                  &quot;{screening.cvSummary}&quot;
                </p>
              </DetailSection>
            )}
            {screening.workExperienceYears != null && (
              <StatTile
                value={`${screening.workExperienceYears} tahun`}
                label="estimasi pengalaman kerja relevan (dibaca AI dari CV)"
              />
            )}
            {screening.skills.length > 0 && (
              <DetailSection
                title="Skill Terdeteksi dari CV"
                icon={IconBriefcase}
              >
                <div className="flex flex-wrap gap-2">
                  {screening.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full bg-surface-1 border border-hairline px-3.5 py-1.5 text-sm font-medium text-ink"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </DetailSection>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
