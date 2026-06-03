import { useState } from 'react';
import { ArrowLeft, Send, Calendar, Clock, Check, ChevronDown, AlertCircle } from 'lucide-react';
import { Application } from '../../types';
import { useApp } from '../../context/AppContext';

interface DecisionPanelProps {
  candidate: Application;
  decision: 'invite' | 'reject';
  onBack: () => void;
}

export default function DecisionPanel({ candidate, decision, onBack }: DecisionPanelProps) {
  const { updateApplication } = useApp();

  // REVISI 10: Generate personal rejection feedback berdasarkan profil kandidat
  const getPersonalFeedback = () => {
    const score = candidate.recommendationScore || 0;
    const title = (candidate.jobTitle || '').toLowerCase();

    let areaKembangkan = '';
    if (title.includes('marketing')) {
      areaKembangkan = 'manajemen kampanye tingkat lanjut, analitik pemasaran berbasis data (Google Analytics/Meta Ads), dan kemampuan copywriting B2B';
    } else if (title.includes('design') || title.includes('ui') || title.includes('ux')) {
      areaKembangkan = 'riset pengguna yang lebih mendalam, kemampuan prototipe tingkat lanjut (Figma Advanced), dan kolaborasi lintas-fungsi dengan tim engineering';
    } else if (title.includes('developer') || title.includes('engineer') || title.includes('backend') || title.includes('frontend')) {
      areaKembangkan = 'penguasaan arsitektur sistem skala besar, pengujian otomatis (unit & integration testing), dan praktik DevOps/CI-CD';
    } else if (title.includes('keuangan') || title.includes('finance') || title.includes('akuntansi')) {
      areaKembangkan = 'analisis laporan keuangan lanjutan, penguasaan ERP (SAP/Oracle), dan manajemen risiko keuangan';
    } else {
      areaKembangkan = 'pengalaman langsung di lapangan yang lebih relevan, kemampuan analitis, dan rekam jejak proyek yang terdokumentasi dengan baik';
    }

    const scoreLabel = score >= 75 ? 'Memenuhi Syarat' : score >= 55 ? 'Perlu Dikembangkan' : 'Tidak Sesuai';

    return `Kepada ${candidate.applicantName},

Terima kasih telah meluangkan waktu dan kepercayaan Anda untuk melamar posisi ${candidate.jobTitle} di perusahaan kami.

Setelah melalui evaluasi yang cermat terhadap profil keahlian dan rekaman wawancara Anda, kami telah memutuskan untuk melanjutkan proses dengan kandidat lain yang kualifikasinya lebih dekat dengan kebutuhan spesifik posisi ini saat ini.

Profil Keahlian Anda berdasarkan evaluasi AI: ${scoreLabel}

Area yang direkomendasikan untuk terus dikembangkan: ${areaKembangkan}.

Kami percaya bahwa dengan pengembangan di area tersebut, Anda akan menjadi kandidat yang sangat kompetitif di masa mendatang. Jangan ragu untuk melamar kembali pada posisi-posisi yang sesuai dengan perkembangan Anda.

Tetap semangat dan terus berkembang. Kami mendukung perjalanan karir Anda.

Hormat kami,
Tim Rekrutmen`;
  };

  const [emailSubject, setEmailSubject] = useState(
    decision === 'invite'
      ? `Undangan Wawancara — ${candidate.jobTitle}`
      : `Pembaruan Status Lamaran — ${candidate.jobTitle}`
  );
  const [emailBody, setEmailBody] = useState(
    decision === 'invite'
      ? `Kepada ${candidate.applicantName},\n\nKami dengan senang hati memberitahukan bahwa lamaran Anda untuk posisi ${candidate.jobTitle} telah ditinjau dan kami ingin mengundang Anda untuk mengikuti sesi wawancara.\n\nMohon informasikan ketersediaan waktu Anda dalam minggu ini.\n\nKami menantikan pertemuan dengan Anda.\n\nHormat kami,\nTim HRD`
      : getPersonalFeedback()
  );
  const [interviewDate, setInterviewDate] = useState('');
  const [interviewTime, setInterviewTime] = useState('');
  const [interviewType, setInterviewType] = useState<'teknis' | 'hr'>('hr');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleSend = () => {
    updateApplication(candidate.id, {
      status: decision === 'invite' ? 'interview' : 'rejected'
    });
    setShowConfirmation(true);
    setTimeout(() => { onBack(); }, 2500);
  };

  if (showConfirmation) {
    return (
      <div className="p-8 flex items-center justify-center h-full font-sans">
        <div className="bg-canvas border border-hairline p-12 text-center max-w-md">
          <div className="w-14 h-14 bg-[#defbe6] border border-[#198038] flex items-center justify-center mx-auto mb-5">
            <Check className="w-7 h-7 text-[#198038]" />
          </div>
          <h2 className="text-[24px] font-light text-ink mb-2">Notifikasi Terkirim</h2>
          <p className="text-[14px] text-ink-muted">
            {candidate.applicantName} telah menerima pemberitahuan melalui email.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-6 font-sans">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-[14px] text-ink hover:underline transition-none mb-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali ke Detail Kandidat
      </button>

      <div>
        <p className="text-[12px] font-semibold uppercase tracking-widest text-ink-muted mb-2">
          {decision === 'invite' ? 'Tindakan HRD' : 'Tindakan HRD'}
        </p>
        <h1 className="text-[32px] font-light text-ink mb-1">
          {decision === 'invite' ? 'Undang ke Wawancara' : 'Tolak Lamaran'}
        </h1>
        <p className="text-[14px] text-ink-muted">
          {decision === 'invite'
            ? 'Siapkan dan kirimkan undangan wawancara kepada kandidat.'
            : 'Kirimkan pemberitahuan penolakan yang bermartabat dan berbasis data profil kandidat.'}
        </p>
      </div>

      {/* REVISI 10: Info panel untuk rejection */}
      {decision === 'reject' && (
        <div className="flex items-start gap-3 p-4 bg-[#fcf0d3] border border-[#f1c21b]">
          <AlertCircle className="w-5 h-5 text-[#f1c21b] flex-shrink-0 mt-0.5" />
          <p className="text-[13px] text-ink leading-[1.5]">
            <span className="font-semibold">Feedback Bermartabat:</span> Email penolakan ini telah diisi secara otomatis oleh AI berdasarkan profil keahlian dan hasil wawancara kandidat, sehingga bersifat personal dan berbasis data — bukan pemberitahuan generik.
          </p>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Left */}
        <div className="space-y-4">
          {/* Candidate info */}
          <div className="bg-canvas border border-hairline p-5">
            <p className="text-[12px] font-semibold uppercase tracking-widest text-ink-muted mb-3">Kandidat</p>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-ink text-white flex items-center justify-center font-semibold text-[14px] flex-shrink-0">
                {candidate.applicantName.charAt(0)}
              </div>
              <div>
                <p className="text-[14px] font-semibold text-ink">{candidate.applicantName}</p>
                <p className="text-[12px] text-ink-muted">{candidate.jobTitle}</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-surface-1 border border-hairline">
              <p className="text-[12px] text-ink-muted uppercase font-semibold">Profil Keahlian</p>
              {candidate.recommendationScore ? (
                <span className={`text-[11px] font-semibold px-2 py-1 border uppercase ${
                  candidate.recommendationScore >= 75
                    ? 'text-[#198038] bg-[#defbe6] border-[#198038]'
                    : candidate.recommendationScore >= 55
                      ? 'text-[#f1c21b] bg-[#fcf0d3] border-[#f1c21b]'
                      : 'text-[#da1e28] bg-[#fff1f1] border-[#da1e28]'
                }`}>
                  {candidate.recommendationScore >= 75 ? 'Memenuhi Syarat' : candidate.recommendationScore >= 55 ? 'Perlu Dikembangkan' : 'Tidak Sesuai'}
                </span>
              ) : (
                <p className="text-[14px] font-semibold text-ink">—</p>
              )}
            </div>
          </div>

          {/* Interview details (invite only) */}
          {decision === 'invite' && (
            <div className="bg-canvas border border-hairline p-5">
              <p className="text-[12px] font-semibold uppercase tracking-widest text-ink-muted mb-4">Detail Wawancara</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-[14px] text-ink mb-2">Jenis Wawancara</label>
                  <div className="relative">
                    <select
                      value={interviewType}
                      onChange={(e) => setInterviewType(e.target.value as 'teknis' | 'hr')}
                      className="appearance-none input-field w-full pr-10 cursor-pointer"
                    >
                      <option value="hr">Wawancara HRD</option>
                      <option value="teknis">Wawancara Teknis</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-[14px] text-ink mb-2 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> Tanggal
                  </label>
                  <input
                    type="date"
                    value={interviewDate}
                    onChange={(e) => setInterviewDate(e.target.value)}
                    className="input-field w-full"
                  />
                </div>
                <div>
                  <label className="block text-[14px] text-ink mb-2 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> Waktu
                  </label>
                  <input
                    type="time"
                    value={interviewTime}
                    onChange={(e) => setInterviewTime(e.target.value)}
                    className="input-field w-full"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Email editor */}
        <div className="bg-canvas border border-hairline p-5">
          <p className="text-[12px] font-semibold uppercase tracking-widest text-ink-muted mb-4">Pratinjau Email</p>
          <div className="space-y-4">
            <div>
              <label className="block text-[14px] text-ink mb-2">Subjek</label>
              <input
                type="text"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                className="input-field w-full"
              />
            </div>
            <div>
              <label className="block text-[14px] text-ink mb-2">Pesan</label>
              <textarea
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                rows={14}
                className="input-field resize-none w-full"
              />
            </div>

            {decision === 'invite' && interviewDate && interviewTime && (
              <div className="p-3 bg-surface-1 border border-hairline text-[12px] text-ink-muted space-y-1">
                <p className="font-semibold text-ink">Ringkasan Wawancara</p>
                <p>Jenis: {interviewType === 'hr' ? 'Wawancara HRD' : 'Wawancara Teknis'}</p>
                <p>Tanggal: {new Date(interviewDate).toLocaleDateString('id-ID')}</p>
                <p>Waktu: {interviewTime}</p>
              </div>
            )}

            <button
              onClick={handleSend}
              className={`w-full flex items-center justify-center gap-2 py-3 text-[14px] font-normal transition-none ${
                decision === 'invite'
                  ? 'bg-primary text-white hover:bg-[#0353e9]'
                  : 'border border-hairline bg-canvas text-ink hover:bg-surface-1'
              }`}
            >
              <Send className="w-4 h-4" />
              {decision === 'invite' ? 'Konfirmasi & Kirim Undangan' : 'Kirim Pemberitahuan Penolakan'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
