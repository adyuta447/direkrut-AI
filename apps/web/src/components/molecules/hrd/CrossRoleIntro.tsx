export function CrossRoleIntro() {
  return (
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
  );
}
