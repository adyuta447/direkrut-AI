export interface ResourceArticle {
  category: string;
  title: string;
  excerpt: string;
  readTime: string;
}

export const RESOURCE_CATEGORIES = [
  "Semua",
  "CV & Portofolio",
  "Wawancara",
  "Gaji & Negosiasi",
  "Pengembangan Karir",
];

export const RESOURCE_ARTICLES: ResourceArticle[] = [
  {
    category: "Wawancara",
    title: "Cara pede ngadepin interview video AI",
    excerpt:
      "Interview berbasis AI menilai jawaban kamu secara objektif dan konsisten. Pahami apa saja yang diukur, gimana nyiapin tempat rekaman, dan kesalahan umum yang paling sering bikin skor kandidat turun.",
    readTime: "8 menit baca",
  },
  {
    category: "CV & Portofolio",
    title: "Nulis CV yang gampang kebaca sistem AI",
    excerpt:
      "Struktur, format, dan pilihan kata di CV kamu menentukan seberapa akurat sistem AI membaca riwayat kerjamu. Panduan praktis biar semua skill kamu terbaca utuh, nggak ada yang kelewat.",
    readTime: "6 menit baca",
  },
  {
    category: "Gaji & Negosiasi",
    title: "Baca rentang gaji: kapan dan gimana caranya nego",
    excerpt:
      "Transparansi gaji bikin posisi tawarmu lebih kuat. Pelajari cara memakai data rentang gaji di lowongan buat nyusun angka yang realistis dan tetap profesional pas nego.",
    readTime: "7 menit baca",
  },
  {
    category: "Pengembangan Karir",
    title: "Manfaatin skor kecocokan AI buat mapping langkah kariermu",
    excerpt:
      "Skor kecocokan bukan sekadar angka. Kutipan bukti di baliknya nunjukin gap skill yang bisa kamu kejar buat posisi impian berikutnya.",
    readTime: "9 menit baca",
  },
  {
    category: "CV & Portofolio",
    title: "Portofolio yang ngomong sendiri: bukti kerja vs klaim",
    excerpt:
      "Sistem validasi kompetensi menilai bukti, bukan klaim. Susun portofolio yang bikin skill teknis kamu gampang diverifikasi dan susah diragukan.",
    readTime: "5 menit baca",
  },
  {
    category: "Wawancara",
    title: "Pertanyaan interview paling sering muncul dan cara jawabnya",
    excerpt:
      "Pakai kerangka STAR buat jawab pertanyaan perilaku dengan rapi. Lengkap dengan contoh jawaban yang dinilai bagus sama sistem AI.",
    readTime: "10 menit baca",
  },
  {
    category: "Pengembangan Karir",
    title: "Pindah bidang industri tanpa mulai dari nol",
    excerpt:
      "Rekomendasi posisi lintas bidang bantu kamu nemuin peran yang menghargai skill yang udah kamu punya. Begini cara bacanya.",
    readTime: "7 menit baca",
  },
  {
    category: "Gaji & Negosiasi",
    title: "Ngerti komponen kompensasi di luar gaji pokok",
    excerpt:
      "Tunjangan, bonus, dan fleksibilitas kerja sering kali lebih bernilai daripada selisih gaji. Kerangka sederhana buat bandingin tawaran secara utuh.",
    readTime: "6 menit baca",
  },
  {
    category: "Wawancara",
    title: "Jaga keaslian jawabanmu di era AI generatif",
    excerpt:
      "Sistem deteksi integritas bisa mengenali jawaban yang nggak otentik. Kenapa jawaban jujur dari pengalaman sendiri selalu menang, dan gimana nyiapinnya.",
    readTime: "5 menit baca",
  },
];
