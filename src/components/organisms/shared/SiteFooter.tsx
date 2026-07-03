export function SiteFooter() {
  return (
    <footer className="bg-inverse-canvas py-16 px-6 lg:px-10">
      <div className="max-w-[1584px] mx-auto flex flex-col md:flex-row justify-between items-start gap-8 border-b border-[#393939] pb-8 mb-8">
        <div>
          <span className="text-[20px] font-semibold text-white tracking-tight uppercase">Direkrut AI</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
          <div className="flex flex-col gap-4">
            <span className="text-white text-[14px] font-semibold">Platform Integrasi</span>
            <a href="#" className="text-[#c6c6c6] text-[14px] hover:text-white">Ekstraksi Dokumen AI</a>
            <a href="#" className="text-[#c6c6c6] text-[14px] hover:text-white">Validasi Video Cerdas</a>
            <a href="#" className="text-[#c6c6c6] text-[14px] hover:text-white">Sistem Rekomendasi</a>
          </div>
          <div className="flex flex-col gap-4">
            <span className="text-white text-[14px] font-semibold">Pusat Referensi</span>
            <a href="#" className="text-[#c6c6c6] text-[14px] hover:text-white">Panduan Pengguna</a>
            <a href="#" className="text-[#c6c6c6] text-[14px] hover:text-white">Dokumentasi API</a>
          </div>
        </div>
      </div>
      <div className="max-w-[1584px] mx-auto flex justify-between items-center text-[#8d8d8d] text-[12px]">
        <p>© 2026 Direkrut AI. Hak cipta dilindungi.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-white">Kebijakan Privasi</a>
          <a href="#" className="hover:text-white">Syarat dan Ketentuan</a>
        </div>
      </div>
    </footer>
  );
}
