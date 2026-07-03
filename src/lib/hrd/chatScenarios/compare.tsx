import { ChatResponse } from "../chatTypes";

// SKENARIO 4: Perbandingan
export function buildCompareResponse(
  lower: string,
  jobTitle: string,
  req1: string,
  req2: string,
  req3: string,
  req4: string
): ChatResponse {
  if (lower.includes("budi") || lower.includes("rina") || lower.includes("fresh graduate")) {
    return {
      text: (
        <div className="text-[14px]">
          <p>Berikut perbandingan <strong>Budi Santoso vs Rina Kusuma</strong> untuk posisi {jobTitle}:</p>
          <br />
          <p className="font-semibold">PENGALAMAN KERJA</p>
          <p><strong>Budi:</strong> 4 tahun pengalaman, pernah magang di 2 tempat, mengerjakan 3 proyek menengah</p>
          <p><strong>Rina:</strong> 2 tahun pengalaman, fresh graduate, aktif di kegiatan kepanitiaan/komunitas</p>
          <br />
          <p className="font-semibold">KEAHLIAN INTI</p>
          <p><strong>Budi:</strong> {req1} ✓ {req2} ✓ {req3} ✓ {req4 || "Skill lain"} perlu dikembangkan</p>
          <p><strong>Rina:</strong> {req1} ✓ {req2} perlu dikembangkan ✓ {req3} ✓ Antusiasme tinggi</p>
          <br />
          <p className="font-semibold">HASIL AI INTERVIEW</p>
          <p><strong>Budi:</strong> Komunikasi baik, menjawab pertanyaan substansial dengan percaya diri</p>
          <p><strong>Rina:</strong> Komunikasi sangat baik, inisiatif tinggi, logika bagus meski pengalaman praktik kurang mendalam</p>
          <br />
          <p className="font-semibold">KECOCOKAN KESELURUHAN</p>
          <p><strong>Budi:</strong> Lebih kuat di pemahaman {req1} dan pengalaman kerja nyata</p>
          <p><strong>Rina:</strong> Lebih kuat di komunikasi dan potensi berkembang jangka panjang</p>
          <br />
          <p>Pilihan tergantung prioritas Anda — kandidat yang langsung produktif (Budi) atau kandidat berpotensi jangka panjang (Rina).</p>
        </div>
      ),
    };
  }

  return {
    text: (
      <div className="text-[14px]">
        <p>Berikut perbandingan <strong>Doni Wijaya (Skor Tertinggi) vs Andi Pratama (Paling Senior)</strong> untuk posisi {jobTitle}:</p>
        <br />
        <p className="font-semibold">PENGALAMAN KERJA</p>
        <p><strong>Doni:</strong> 5 tahun, ex-multinasional, spesialis dalam {req1}</p>
        <p><strong>Andi:</strong> 6 tahun, pernah memimpin tim, ekspertis di operasional skala besar</p>
        <br />
        <p className="font-semibold">KEAHLIAN INTI</p>
        <p><strong>Doni:</strong> {req1} ✓ {req2} ✓ {req3} ✓ — semua Memenuhi Syarat</p>
        <p><strong>Andi:</strong> {req2} ✓ {req3} ✓ {req1} perlu dikembangkan di beberapa aspek spesifik</p>
        <br />
        <p className="font-semibold">HASIL AI INTERVIEW</p>
        <p><strong>Doni:</strong> Sangat komprehensif, menjawab sempurna, analitis</p>
        <p><strong>Andi:</strong> Sangat berpengalaman, menjawab dengan kasus kepemimpinan nyata, sangat percaya diri</p>
        <br />
        <p className="font-semibold">CATATAN PENTING</p>
        <p><strong>Doni:</strong> Ekspektasi gaji dalam batas yang ditetapkan</p>
        <p><strong>Andi:</strong> Ekspektasi gaji sedikit di atas batas — namun kompetensi manajerial paling kuat</p>
        <br />
        <p><strong>Rekomendasi AI:</strong> Doni untuk eksekusi {req1} yang cepat, Andi jika Anda membutuhkan sosok pemimpin dan mentor.</p>
      </div>
    ),
  };
}
