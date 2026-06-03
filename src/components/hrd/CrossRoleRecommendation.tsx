import { Search, ChevronDown, BarChart3, ChevronUp, AlertCircle } from "lucide-react";
import { useState, useMemo, Fragment } from "react";
import { useApp } from "../../context/AppContext";

export default function CrossRoleRecommendation() {
  const { applications, jobs } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRecId, setExpandedRecId] = useState<string | null>(null);
  
  const itemsPerPage = 5;

  // Generate a deterministic list of candidates with cross-role potential
  const crossRoleList = useMemo(() => {
    return applications
      .map((app, index) => {
        // Skip every third to simulate not all candidates having cross-role potential
        if (index % 3 === 0) return null;

        const alternateJob = jobs[(index + 1) % jobs.length];
        
        const isHighlyRelevant = index % 2 === 0;
        const label = isHighlyRelevant ? "Sangat Relevan" : "Potensi Adaptasi Cepat";
        const labelClass = isHighlyRelevant 
          ? "text-[#198038] bg-[#defbe6] border-[#198038]"
          : "text-[#f1c21b] bg-[#fcf0d3] border-[#f1c21b]";
          
        const reason = isHighlyRelevant
          ? `Keterampilan inti (transferable skills) selaras dengan kebutuhan ${alternateJob.title}.`
          : `Fondasi kuat yang dapat disesuaikan untuk ${alternateJob.title} dengan masa onboarding minimal.`;
          
        const evidence = isHighlyRelevant
          ? `Kutipan CV (Hal 1): "Memimpin kolaborasi lintas divisi yang mengharuskan penggunaan prinsip kerja dari ${alternateJob.title} untuk mencapai target perusahaan."`
          : `Log Wawancara (08:21): "Meskipun posisi ini di luar keahlian utama saya, saya telah mengikuti sertifikasi dasar terkait metrik dan operasional departemen tersebut secara otodidak."`;

        return {
          id: app.id,
          candidateName: app.applicantName,
          originalRole: app.jobTitle,
          suggestedRole: alternateJob.title,
          label,
          labelClass,
          reason,
          evidence
        };
      })
      .filter(Boolean) as any[];
  }, [applications, jobs]);

  // Filter based on search term
  const filteredList = crossRoleList.filter(item => 
    item.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.suggestedRole.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredList.length / itemsPerPage);
  const paginatedList = filteredList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-6 lg:p-8 space-y-6 font-sans bg-canvas min-h-full">
      {/* Header */}
      <div>
        <p className="text-[12px] font-semibold uppercase tracking-widest text-ink-muted mb-2">Alat AI</p>
        <h2 className="text-[32px] font-light tracking-[-0.5px] text-ink mb-2">Rekomendasi Posisi Lain</h2>
        <p className="text-[16px] text-ink-muted mb-2">
          Daftar kandidat yang memiliki <span className="italic">transferable skills</span> untuk dipindahkan ke posisi alternatif.
        </p>
        {/* Penjelasan kontekstual */}
        <div className="p-3 bg-surface-1 border border-hairline mt-4">
          <p className="text-[13px] text-ink leading-[1.5]">
            <span className="font-semibold">Cara kerja fitur ini:</span> Sistem AI memindai seluruh kandidat dan mencari kecocokan kata kunci profil mereka dengan lowongan lain yang sedang dibuka. Hal ini mencegah "talent waste" jika posisi yang dilamar sudah terpenuhi.
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-canvas border border-hairline p-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
          <input
            type="text"
            placeholder="Cari nama atau posisi rekomendasi..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="input-field pl-11 bg-surface-1 border-b border-hairline w-full"
          />
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-canvas border border-hairline">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-1 border-b border-hairline">
                <th className="px-6 py-4 text-[12px] font-semibold text-ink-muted uppercase">Kandidat</th>
                <th className="px-6 py-4 text-[12px] font-semibold text-ink-muted uppercase">Posisi Dilamar</th>
                <th className="px-6 py-4 text-[12px] font-semibold text-ink-muted uppercase">Rekomendasi Posisi AI</th>
                <th className="px-6 py-4 text-[12px] font-semibold text-ink-muted uppercase">Tingkat Potensi</th>
                <th className="px-6 py-4 text-[12px] font-semibold text-ink-muted uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline">
              {paginatedList.map((item) => (
                <Fragment key={item.id}>
                  <tr className="hover:bg-surface-1 transition-none">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-ink text-white flex items-center justify-center font-semibold text-[12px]">
                          {item.candidateName.charAt(0)}
                        </div>
                        <span className="text-[14px] font-semibold text-ink">
                          {item.candidateName}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[14px] text-ink">{item.originalRole}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[14px] font-semibold text-primary">{item.suggestedRole}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[11px] font-semibold px-2 py-1 border uppercase tracking-wide inline-block ${item.labelClass}`}>
                        {item.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => setExpandedRecId(expandedRecId === item.id ? null : item.id)}
                        className="text-[12px] font-normal text-primary hover:underline transition-none flex items-center gap-1"
                      >
                        {expandedRecId === item.id ? "Tutup Detail" : "Lihat Detail"}
                        {expandedRecId === item.id ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                    </td>
                  </tr>
                  
                  {/* Expanded Slug / View Detail */}
                  {expandedRecId === item.id && (
                    <tr className="bg-[#e5f6ff] border-b border-primary">
                      <td colSpan={5} className="px-6 py-6">
                        <div className="animate-in slide-in-from-top-2 flex flex-col md:flex-row gap-6">
                          <div className="flex-1 bg-white border border-[#0f62fe] p-5">
                            <h4 className="text-[14px] font-semibold text-primary mb-3 flex items-center gap-2 uppercase tracking-wide">
                              <BarChart3 className="w-4 h-4" />
                              Alasan Rekomendasi
                            </h4>
                            <p className="text-[14px] text-ink leading-[1.5] mb-4">
                              {item.reason}
                            </p>
                            
                            <div className="bg-surface-1 border border-hairline p-4">
                              <p className="text-[12px] font-semibold uppercase text-ink-muted mb-2 flex items-center gap-1.5">
                                Bukti Transparansi AI
                              </p>
                              <p className="text-[13px] text-ink leading-[1.5] italic border-l-4 border-primary pl-3">
                                {item.evidence}
                              </p>
                            </div>
                          </div>
                          
                          <div className="w-full md:w-64 flex flex-col justify-between border border-hairline bg-white p-5">
                             <div>
                               <p className="text-[12px] font-semibold text-ink-muted uppercase mb-1">Aksi Lanjutan</p>
                               <p className="text-[13px] text-ink leading-[1.5] mb-4">
                                 Anda dapat mengirimkan undangan penawaran role alternatif ini ke kandidat.
                               </p>
                             </div>
                             <button className="btn-primary w-full text-center py-2 px-4 text-[13px]">
                               Tawarkan Posisi Ini
                             </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-hairline bg-surface-1">
            <span className="text-[14px] text-ink-muted">
              Menampilkan {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, filteredList.length)} dari {filteredList.length} kandidat
            </span>
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-8 h-8 flex items-center justify-center text-[14px] transition-none border ${
                    currentPage === i + 1 
                      ? "bg-primary text-white border-primary" 
                      : "bg-canvas text-ink border-hairline hover:bg-[#e8e8e8]"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {filteredList.length === 0 && (
          <div className="text-center py-16 bg-surface-1 border-t border-hairline">
            <p className="text-[14px] text-ink-muted">Tidak ada kandidat dengan potensi lintas posisi yang ditemukan.</p>
          </div>
        )}
      </div>
    </div>
  );
}
