import { useState } from "react";
import { Clock, FileText, ArrowRight, CheckCircle2, Bell } from "lucide-react";
import { useApp } from "../../context/AppContext";
import AIInterviewPage from "./AIInterviewPage";
import SchedulingModal from "./SchedulingModal";

export default function SubmissionComplete() {
  const { currentUser, applications } = useApp();
  const [aiInterviewOpen, setAiInterviewOpen] = useState(false);
  const [schedulingOpen, setSchedulingOpen] = useState(false);

  const userApplications = applications.filter(
    (app) => app.applicantId === currentUser?.id,
  );
  const hasInterviewStatus = userApplications.some(
    (app) => app.status === "interview",
  );

  if (aiInterviewOpen) {
    return <AIInterviewPage onClose={() => setAiInterviewOpen(false)} />;
  }

  return (
    <div className="min-h-full px-6 py-10 md:px-12 lg:px-16 xl:px-24 font-sans bg-canvas">
      {schedulingOpen && (
        <SchedulingModal onClose={() => setSchedulingOpen(false)} />
      )}

      <div className="max-w-[1600px] mx-auto w-full">
        <div className="mb-10 lg:mb-16">
          <h1 className="text-[42px] font-light tracking-[-0.5px] text-ink mb-4">
            Status Lamaran
          </h1>
          <p className="text-[16px] text-ink-muted max-w-xl leading-relaxed">
            Lacak dan kelola progres lamaran Anda. Tindakan yang perlu dilakukan 
            akan muncul di sini apabila dibutuhkan.
          </p>
        </div>

        {userApplications.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] border border-hairline bg-surface-1 p-12 text-center">
            <div className="w-20 h-20 bg-canvas flex items-center justify-center mb-6 border border-hairline">
              <FileText className="w-8 h-8 text-ink-muted" />
            </div>
            <p className="text-[16px] font-semibold text-ink uppercase mb-3">
              Belum Ada Lamaran
            </p>
            <p className="text-[14px] text-ink-muted">
              Mulai melamar lowongan untuk melihat status Anda di sini.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            {/* AI Interview CTA — Carbon Highlight Block */}
            {hasInterviewStatus && (
              <div className="bg-[#0f62fe] text-white p-8 lg:p-12 flex flex-col lg:flex-row lg:items-center justify-between gap-10">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    <span className="text-[12px] font-semibold uppercase tracking-widest text-white">
                      Tindakan Diperlukan
                    </span>
                  </div>
                  <h2 className="text-[32px] font-light text-white mb-4">
                    Wawancara AI Siap Dimulai
                  </h2>
                  <p className="text-[16px] text-[#e0e0e0] leading-relaxed max-w-xl">
                    Anda telah lolos seleksi awal. Selesaikan sesi wawancara AI di bawah 
                    ini sebelum wawancara dengan tim HRD. Wawancara ini mencakup pertanyaan teknis dan perilaku.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row lg:flex-col gap-4 flex-shrink-0 w-full lg:w-auto">
                  <button
                    onClick={() => setAiInterviewOpen(true)}
                    className="group inline-flex items-center justify-center gap-3 bg-white text-[#0f62fe] px-8 py-4 text-[14px] font-semibold hover:bg-[#e0e0e0] transition-none"
                  >
                    Mulai Sesi
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button
                    onClick={() => setSchedulingOpen(true)}
                    className="inline-flex items-center justify-center gap-3 bg-transparent border border-white text-white px-8 py-4 text-[14px] font-semibold hover:bg-white hover:text-[#0f62fe] transition-none"
                  >
                    Jadwalkan Wawancara
                  </button>
                </div>
              </div>
            )}

            {/* Application List */}
            <div className="grid grid-cols-1 gap-6">
              {userApplications.map((app) => {
                const cvViewed = app.cvViewed || ["under-review", "interview", "rejected"].includes(app.status);
                const isUnderReview = ["under-review", "interview", "rejected"].includes(app.status);
                const isInterview = ["interview", "rejected"].includes(app.status);
                
                return (
                  <div
                    key={app.id}
                    className="border border-hairline bg-surface-1 p-8 flex flex-col lg:flex-row gap-8"
                  >
                    {/* Info Area */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-8">
                        <div>
                          <h3 className="text-[24px] font-normal text-ink mb-2">
                            {app.jobTitle}
                          </h3>
                          <p className="text-[14px] text-ink-muted">
                            Dikirim pada: {app.appliedDate}
                          </p>
                        </div>
                        <span className="text-[12px] font-semibold px-3 py-1 border border-hairline bg-canvas text-ink uppercase">
                          {app.status === "interview"
                            ? "Tahap Wawancara"
                            : app.status === "under-review"
                              ? "Tahap Administrasi"
                              : app.status === "rejected"
                                ? "Tidak Lolos"
                                : "Terkirim"}
                        </span>
                      </div>

                      {/* Stats grid */}
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-canvas border border-hairline p-4 flex flex-col justify-center">
                          <p className="text-[12px] font-semibold uppercase text-ink-muted mb-2">
                            Validasi AI
                          </p>
                          <div className="flex items-center gap-2">
                            {app.validationStatus === "completed" ? (
                              <>
                                <CheckCircle2 className="w-4 h-4 text-[#198038]" />
                                <span className="text-[14px] text-ink">
                                  Selesai
                                </span>
                              </>
                            ) : (
                              <>
                                <Clock className="w-4 h-4 text-ink-muted" />
                                <span className="text-[14px] text-ink-muted">
                                  Menunggu
                                </span>
                              </>
                            )}
                          </div>
                        </div>

                        {app.recommendationScore !== undefined && (
                          <div className="bg-canvas border border-hairline p-4 flex flex-col justify-center">
                            <p className="text-[12px] font-semibold uppercase text-ink-muted mb-2">
                              Profil Keahlian
                            </p>
                            {/* REVISI 2: Label teks bukan angka */}
                            <span className={`text-[11px] font-semibold px-2 py-1 border uppercase tracking-wide self-start ${
                              app.recommendationScore >= 75
                                ? "text-[#198038] bg-[#defbe6] border-[#198038]"
                                : app.recommendationScore >= 55
                                  ? "text-[#f1c21b] bg-[#fcf0d3] border-[#f1c21b]"
                                  : "text-[#da1e28] bg-[#fff1f1] border-[#da1e28]"
                            }`}>
                              {app.recommendationScore >= 75
                                ? "Memenuhi Syarat"
                                : app.recommendationScore >= 55
                                  ? "Perlu Dikembangkan"
                                  : "Tidak Sesuai"}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Status note */}
                      {(app.status === "interview" ||
                        app.status === "under-review") && (
                        <div className="bg-[#e5f6ff] border border-[#0f62fe] p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <p className="text-[12px] font-semibold uppercase text-[#0f62fe]">
                              {app.status === "interview"
                                ? "Tindakan Berikutnya"
                                : "Pembaruan Status"}
                            </p>
                          </div>
                          <p className="text-[14px] text-ink leading-relaxed">
                            {app.status === "interview"
                              ? "Harap selesaikan wawancara AI di panel atas, tim kami akan menghubungi Anda untuk wawancara akhir."
                              : "Lamaran Anda sedang dalam tahap administrasi dan review oleh tim HRD. Kami akan memberi tahu jika ada pembaruan."}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Timeline Tracker — REVISI 8: Status lengkap */}
                    <div className="w-full lg:w-64 flex-shrink-0 border-t border-hairline lg:border-t-0 lg:border-l pt-6 lg:pt-0 lg:pl-8">
                      <p className="text-[14px] font-semibold text-ink mb-6">Linimasa (Timeline)</p>
                      
                      {/* REVISI 9: Notifikasi CV Dilihat */}
                      {cvViewed && (
                        <div className="mb-4 p-3 bg-[#e5f6ff] border border-[#0f62fe] flex items-center gap-2">
                          <Bell className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                          <p className="text-[11px] text-ink leading-[1.4]">
                            CV Anda telah dilihat oleh HRD pada {app.appliedDate}.
                          </p>
                        </div>
                      )}
                      
                      <div className="relative pl-6 space-y-6">
                        {/* 1. Terkirim — selalu aktif */}
                        <div className="relative">
                          <div className="absolute left-[-23px] top-1 w-3 h-3 rounded-full bg-[#198038]"></div>
                          <div className="absolute left-[-18px] top-4 w-px h-6 bg-[#198038]"></div>
                          <p className="text-[14px] font-semibold text-ink">Lamaran Diterima</p>
                          <p className="text-[12px] text-ink-muted">Dokumen berhasil diunggah</p>
                        </div>

                        {/* 2. CV Sedang Ditinjau */}
                        <div className="relative">
                          <div className={`absolute left-[-23px] top-1 w-3 h-3 rounded-full ${cvViewed ? 'bg-[#198038]' : 'bg-surface-2 border border-hairline'}`}></div>
                          <div className={`absolute left-[-18px] top-4 w-px h-6 ${cvViewed ? 'bg-[#198038]' : 'bg-surface-2'}`}></div>
                          <p className={`text-[14px] font-semibold ${cvViewed ? 'text-ink' : 'text-ink-muted'}`}>CV Sedang Ditinjau</p>
                          <p className="text-[12px] text-ink-muted">{cvViewed ? 'Tim HRD membuka CV Anda' : 'Menunggu peninjauan HRD'}</p>
                        </div>

                        {/* 3. Dalam Proses Seleksi */}
                        <div className="relative">
                          <div className={`absolute left-[-23px] top-1 w-3 h-3 rounded-full ${isUnderReview ? 'bg-[#198038]' : 'bg-surface-2 border border-hairline'}`}></div>
                          <div className={`absolute left-[-18px] top-4 w-px h-6 ${isUnderReview ? 'bg-[#198038]' : 'bg-surface-2'}`}></div>
                          <p className={`text-[14px] font-semibold ${isUnderReview ? 'text-ink' : 'text-ink-muted'}`}>Dalam Proses Seleksi</p>
                          <p className="text-[12px] text-ink-muted">{isUnderReview ? 'Evaluasi AI interview selesai' : 'Menunggu evaluasi AI'}</p>
                        </div>

                        {/* 4. Wawancara Dijadwalkan */}
                        <div className="relative">
                          <div className={`absolute left-[-23px] top-1 w-3 h-3 rounded-full ${isInterview ? 'bg-[#198038]' : 'bg-surface-2 border border-hairline'}`}></div>
                          <div className={`absolute left-[-18px] top-4 w-px h-6 ${isInterview && app.status !== 'rejected' ? 'bg-[#198038]' : 'bg-surface-2'}`}></div>
                          <p className={`text-[14px] font-semibold ${isInterview ? 'text-ink' : 'text-ink-muted'}`}>Wawancara Dijadwalkan</p>
                          <p className="text-[12px] text-ink-muted">{isInterview ? 'Lolos ke tahap wawancara' : 'Menunggu keputusan HRD'}</p>
                        </div>

                        {/* 5. Keputusan Akhir */}
                        <div className="relative">
                          <div className={`absolute left-[-23px] top-1 w-3 h-3 rounded-full ${
                            app.status === 'rejected'
                              ? 'bg-[#da1e28]'
                              : isInterview
                                ? 'bg-surface-2 border border-hairline'
                                : 'bg-surface-2 border border-hairline'
                          }`}></div>
                          <p className={`text-[14px] font-semibold ${
                            app.status === 'rejected' ? 'text-[#da1e28]' : 'text-ink-muted'
                          }`}>
                            {app.status === 'rejected' ? 'Tidak Melanjutkan' : 'Keputusan Akhir'}
                          </p>
                          <p className="text-[12px] text-ink-muted">
                            {app.status === 'rejected'
                              ? 'Kandidat tidak lolos seleksi'
                              : 'Menunggu keputusan final'}
                          </p>
                        </div>

                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
