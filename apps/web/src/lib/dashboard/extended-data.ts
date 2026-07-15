/**
 * Data profil kandidat sintetis, diturunkan deterministik dari hash nama
 * (mock -- diganti field asli begitu API kandidat tersedia). Di-cache per
 * nama karena sebelumnya dihitung ulang ~7x per baris per render.
 */
export interface ExtendedCandidateData {
  domicile: string;
  experience: string;
  lastPosition: string;
  education: string;
  gender: string;
  lastActive: string;
  category: "fresh-graduate" | "professional";
  isJobHopper: boolean;
  waitingDays: number;
  crossRoleEmailed: boolean;
  experienceSummary: string;
}

const cache = new Map<string, ExtendedCandidateData>();

export function getExtendedData(name: string): ExtendedCandidateData {
  const cached = cache.get(name);
  if (cached) return cached;

  const hash = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);

  const domiciles = ["Jakarta Pusat, DKI Jakarta", "Bandung, Jawa Barat", "Surabaya, Jawa Timur", "Medan, Sumatera Utara", "Tangerang Selatan, Banten", "Depok, Jawa Barat", "Semarang, Jawa Tengah", "Bogor, Jawa Barat"];
  const domicile = domiciles[hash % domiciles.length];

  const years = hash % 5;
  const months = (hash * 3) % 11;
  const experience = years === 0 && months === 0 ? "Fresh Graduate" : years === 0 ? `${months} bln` : `${years} thn ${months} bln`;

  const positions = ["Software Engineer", "Marketing Specialist", "Product Manager", "Data Analyst", "Sales Executive", "UI/UX Designer", "HR Admin", "Finance Staff"];
  const lastPosition = positions[hash % positions.length];

  const universities = ["Universitas Indonesia", "Institut Teknologi Bandung", "Universitas Gadjah Mada", "Bina Nusantara", "Universitas Padjadjaran", "Universitas Diponegoro", "Telkom University"];
  const degrees = ["S1 - Sistem Informasi", "S1 - Manajemen", "S1 - Ilmu Komunikasi", "D3 - Akuntansi", "S1 - Teknik Informatika", "S1 - Psikologi"];
  const education = `${degrees[hash % degrees.length]}\n${universities[(hash * 2) % universities.length]}\nAug 2019 - Jul 2023`;

  const genders = ["Laki-laki", "Perempuan"];
  const gender = genders[hash % 2];

  const activeTimes = ["Beberapa detik yang lalu", "2 menit yang lalu", "1 jam yang lalu", "Kemarin", "2 hari yang lalu"];
  const lastActive = activeTimes[hash % activeTimes.length];

  const category = hash % 3 === 0 ? ("fresh-graduate" as const) : ("professional" as const);
  const isJobHopper = category === "professional" && hash % 4 === 0;
  const waitingDays = (hash % 14) + 1;
  const crossRoleEmailed = hash % 2 === 0;
  const experienceSummary =
    category === "professional"
      ? "3 tahun di bidang yang relevan, pernah di 2 perusahaan teknologi, pengalaman mengelola sistem skala menengah."
      : "Pengalaman magang 6 bulan sebagai asisten lab dan 3 bulan di perusahaan startup lokal. Aktif di himpunan mahasiswa.";

  const data: ExtendedCandidateData = {
    domicile,
    experience,
    lastPosition,
    education,
    gender,
    lastActive,
    category,
    isJobHopper,
    waitingDays,
    crossRoleEmailed,
    experienceSummary,
  };
  cache.set(name, data);
  return data;
}
