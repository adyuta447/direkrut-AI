from docx import Document
from docx.enum.table import WD_ALIGN_VERTICAL, WD_TABLE_ALIGNMENT
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Inches, Pt, RGBColor


OUT = "output/docx/Laporan_Validasi_Level_3_Direkrut_AI.docx"

BLUE = "2E74B5"
DARK_BLUE = "1F4D78"
INK = "17202A"
MUTED = "5F6B76"
LIGHT_GRAY = "F2F4F7"
PALE_BLUE = "E8EEF5"
PALE_GREEN = "EAF6EE"
PALE_AMBER = "FFF4D6"
PALE_RED = "FDECEC"
GREEN = "276738"
AMBER = "7A5A00"
RED = "9B1C1C"
WHITE = "FFFFFF"

CONTENT_DXA = 9360


def set_font(run, size=11, bold=False, color=INK, italic=False):
    run.font.name = "Calibri"
    rpr = run._element.get_or_add_rPr()
    rpr.rFonts.set(qn("w:ascii"), "Calibri")
    rpr.rFonts.set(qn("w:hAnsi"), "Calibri")
    run.font.size = Pt(size)
    run.font.bold = bold
    run.font.italic = italic
    run.font.color.rgb = RGBColor.from_string(color)


def set_cell_shading(cell, fill):
    tc_pr = cell._tc.get_or_add_tcPr()
    shd = tc_pr.find(qn("w:shd"))
    if shd is None:
        shd = OxmlElement("w:shd")
        tc_pr.append(shd)
    shd.set(qn("w:fill"), fill)


def set_cell_margins(cell, top=80, bottom=80, start=120, end=120):
    tc_pr = cell._tc.get_or_add_tcPr()
    tc_mar = tc_pr.find(qn("w:tcMar"))
    if tc_mar is None:
        tc_mar = OxmlElement("w:tcMar")
        tc_pr.append(tc_mar)
    for name, value in (("top", top), ("bottom", bottom), ("start", start), ("end", end)):
        node = tc_mar.find(qn(f"w:{name}"))
        if node is None:
            node = OxmlElement(f"w:{name}")
            tc_mar.append(node)
        node.set(qn("w:w"), str(value))
        node.set(qn("w:type"), "dxa")


def set_table_geometry(table, widths):
    table.autofit = False
    table.alignment = WD_TABLE_ALIGNMENT.LEFT
    tbl_pr = table._tbl.tblPr
    tbl_w = tbl_pr.find(qn("w:tblW"))
    if tbl_w is None:
        tbl_w = OxmlElement("w:tblW")
        tbl_pr.append(tbl_w)
    tbl_w.set(qn("w:w"), str(sum(widths)))
    tbl_w.set(qn("w:type"), "dxa")
    tbl_ind = tbl_pr.find(qn("w:tblInd"))
    if tbl_ind is None:
        tbl_ind = OxmlElement("w:tblInd")
        tbl_pr.append(tbl_ind)
    tbl_ind.set(qn("w:w"), "120")
    tbl_ind.set(qn("w:type"), "dxa")

    grid = table._tbl.tblGrid
    for child in list(grid):
        grid.remove(child)
    for width in widths:
        grid_col = OxmlElement("w:gridCol")
        grid_col.set(qn("w:w"), str(width))
        grid.append(grid_col)

    for row in table.rows:
        for cell, width in zip(row.cells, widths):
            cell.width = Inches(width / 1440)
            cell.vertical_alignment = WD_ALIGN_VERTICAL.CENTER
            set_cell_margins(cell)
            tc_w = cell._tc.get_or_add_tcPr().find(qn("w:tcW"))
            if tc_w is None:
                tc_w = OxmlElement("w:tcW")
                cell._tc.get_or_add_tcPr().append(tc_w)
            tc_w.set(qn("w:w"), str(width))
            tc_w.set(qn("w:type"), "dxa")


def repeat_header(row):
    tr_pr = row._tr.get_or_add_trPr()
    node = OxmlElement("w:tblHeader")
    node.set(qn("w:val"), "true")
    tr_pr.append(node)


def add_paragraph(doc, text="", *, size=11, bold=False, color=INK, italic=False,
                  after=6, before=0, align=None, keep=False):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(before)
    p.paragraph_format.space_after = Pt(after)
    p.paragraph_format.line_spacing = 1.10
    p.paragraph_format.keep_with_next = keep
    if align is not None:
        p.alignment = align
    if text:
        set_font(p.add_run(text), size=size, bold=bold, color=color, italic=italic)
    return p


def add_bullet(doc, text):
    p = doc.add_paragraph(style="List Bullet")
    p.paragraph_format.space_after = Pt(8)
    p.paragraph_format.line_spacing = 1.167
    set_font(p.add_run(text), size=10.5)
    return p


def add_callout(doc, label, text, fill=PALE_BLUE, text_color=DARK_BLUE):
    table = doc.add_table(rows=1, cols=1)
    table.style = "Table Grid"
    set_table_geometry(table, [CONTENT_DXA])
    cell = table.cell(0, 0)
    set_cell_shading(cell, fill)
    p = cell.paragraphs[0]
    p.paragraph_format.space_after = Pt(0)
    p.paragraph_format.line_spacing = 1.10
    set_font(p.add_run(f"{label}: "), size=10.5, bold=True, color=text_color)
    set_font(p.add_run(text), size=10.5, color=text_color)
    add_paragraph(doc, after=4)


def add_table(doc, headers, rows, widths, font_size=9.2):
    table = doc.add_table(rows=1, cols=len(headers))
    table.style = "Table Grid"
    repeat_header(table.rows[0])
    for i, text in enumerate(headers):
        cell = table.rows[0].cells[i]
        set_cell_shading(cell, LIGHT_GRAY)
        p = cell.paragraphs[0]
        p.paragraph_format.space_after = Pt(0)
        p.paragraph_format.line_spacing = 1.0
        set_font(p.add_run(text), size=font_size, bold=True, color=DARK_BLUE)
    for row_idx, values in enumerate(rows):
        cells = table.add_row().cells
        for i, value in enumerate(values):
            if row_idx % 2:
                set_cell_shading(cells[i], "FAFBFC")
            p = cells[i].paragraphs[0]
            p.paragraph_format.space_after = Pt(0)
            p.paragraph_format.line_spacing = 1.03
            set_font(p.add_run(str(value)), size=font_size, color=INK)
    set_table_geometry(table, widths)
    add_paragraph(doc, after=4)
    return table


def heading(doc, text, level=1, page_break=False):
    p = doc.add_paragraph(style=f"Heading {level}")
    p.paragraph_format.page_break_before = page_break
    set_font(
        p.add_run(text),
        size={1: 16, 2: 13, 3: 12}[level],
        bold=True,
        color=BLUE if level < 3 else DARK_BLUE,
    )
    return p


def add_page_field(paragraph):
    paragraph.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    set_font(paragraph.add_run("Direkrut AI  |  QA Level 3  |  "), size=8.5, color=MUTED)
    run = paragraph.add_run()
    begin = OxmlElement("w:fldChar")
    begin.set(qn("w:fldCharType"), "begin")
    instr = OxmlElement("w:instrText")
    instr.set(qn("xml:space"), "preserve")
    instr.text = " PAGE "
    end = OxmlElement("w:fldChar")
    end.set(qn("w:fldCharType"), "end")
    run._r.extend([begin, instr, end])


doc = Document()
section = doc.sections[0]
section.page_width = Inches(8.5)
section.page_height = Inches(11)
section.top_margin = Inches(1)
section.bottom_margin = Inches(1)
section.left_margin = Inches(1)
section.right_margin = Inches(1)
section.header_distance = Inches(0.492)
section.footer_distance = Inches(0.492)

styles = doc.styles
normal = styles["Normal"]
normal.font.name = "Calibri"
normal._element.rPr.rFonts.set(qn("w:ascii"), "Calibri")
normal._element.rPr.rFonts.set(qn("w:hAnsi"), "Calibri")
normal.font.size = Pt(11)
normal.paragraph_format.space_after = Pt(6)
normal.paragraph_format.line_spacing = 1.10

for name, size, color, before, after in (
    ("Heading 1", 16, BLUE, 16, 8),
    ("Heading 2", 13, BLUE, 12, 6),
    ("Heading 3", 12, DARK_BLUE, 8, 4),
):
    style = styles[name]
    style.font.name = "Calibri"
    style._element.rPr.rFonts.set(qn("w:ascii"), "Calibri")
    style._element.rPr.rFonts.set(qn("w:hAnsi"), "Calibri")
    style.font.size = Pt(size)
    style.font.bold = True
    style.font.color.rgb = RGBColor.from_string(color)
    style.paragraph_format.space_before = Pt(before)
    style.paragraph_format.space_after = Pt(after)
    style.paragraph_format.keep_with_next = True

bullet = styles["List Bullet"]
bullet.font.name = "Calibri"
bullet.font.size = Pt(10.5)
bullet.paragraph_format.left_indent = Inches(0.5)
bullet.paragraph_format.first_line_indent = Inches(-0.25)
bullet.paragraph_format.space_after = Pt(8)
bullet.paragraph_format.line_spacing = 1.167

header = section.header.paragraphs[0]
header.paragraph_format.space_after = Pt(0)
set_font(header.add_run("DIREKRUT AI  /  LAPORAN VALIDASI"), size=8.5, bold=True, color=BLUE)
add_page_field(section.footer.paragraphs[0])

# Cover
add_paragraph(doc, "DIREKRUT AI", size=11, bold=True, color=BLUE, after=20)
add_paragraph(doc, "LAPORAN VALIDASI\nINNOVATION LEVEL 3", size=27, bold=True, color=DARK_BLUE, after=8)
add_paragraph(
    doc,
    "Evidence Pack Produk Digital, Pengujian Internal, Gap, dan Rencana Validasi Pengguna",
    size=14,
    color=BLUE,
    after=24,
)
add_table(
    doc,
    ["Kontrol dokumen", "Nilai"],
    [
        ["Produk", "Direkrut AI"],
        ["Tanggal evaluasi", "26 Juli 2026 (Asia/Jakarta)"],
        ["Versi sumber", "Branch dev; baseline a2f78a4 + working tree QA automation 26 Juli 2026"],
        ["Metode", "Desk review repositori + eksekusi test/build lokal"],
        ["Status laporan", "Siap final kompetisi 9/10; UAT kuantitatif dan security test lanjutan belum tersedia"],
    ],
    [2200, 7160],
    font_size=10,
)
add_callout(
    doc,
    "Kesimpulan QA",
    "Direkrut AI telah memiliki functional MVP yang dapat dijalankan dan diuji, serta telah direview oleh lima praktisi "
    "dari bidang software engineering, perbankan, product design/product management, hukum, dan human resources. Kombinasi bukti teknis, pengujian internal, "
    "feedback ahli, tujuh automated UI test yang lulus, serta security patch yang dapat ditelusuri melalui commit mendukung klaim "
    "Innovation Level 3 dan kesiapan final kompetisi 9/10. Gap yang tersisa adalah UAT kuantitatif dengan pengguna nyata, "
    "performance/application-security test lanjutan, dan beberapa endpoint yang masih berupa stub.",
    PALE_AMBER,
    AMBER,
)
add_paragraph(
    doc,
    "Klasifikasi yang direkomendasikan: LEVEL 3 — TERBUKTI MELALUI FUNCTIONAL MVP, PENGUJIAN INTERNAL, DAN REVIEW PRAKTISI.",
    size=11,
    bold=True,
    color=AMBER,
    before=8,
    after=18,
)
add_callout(
    doc,
    "Kesiapan final",
    "9/10 untuk tahap final kompetisi. Nilai ini didukung functional MVP, quality gate yang lulus, tujuh automated UI test, "
    "review lima praktisi, UAT AI Interview pada perangkat nyata, serta patch keamanan yang memiliki commit dan automated test. Nilai ini bukan klaim bahwa aplikasi "
    "telah siap produksi skala besar atau bebas seluruh kerentanan.",
    PALE_GREEN,
    GREEN,
)
add_paragraph(
    doc,
    "Catatan integritas bukti",
    size=11,
    bold=True,
    color=DARK_BLUE,
    after=4,
)
add_paragraph(
    doc,
    "Laporan ini hanya mengakui bukti yang dapat ditelusuri pada repositori atau dihasilkan melalui pengujian tanggal 26 Juli 2026. "
    "Fitur yang belum diuji, masih stub, atau belum memiliki bukti pengguna diberi status terbuka dan tidak dipresentasikan sebagai selesai.",
    size=10.5,
    color=MUTED,
)

# 1
heading(doc, "1. Interpretasi Kriteria Level 3", 1, page_break=True)
add_paragraph(
    doc,
    "Dalam perspektif QA, Level 3 bukan sekadar tersedianya desain layar atau source code. Bukti harus menunjukkan bahwa solusi "
    "telah menjadi eksperimen nyata: input diproses, output dapat diamati, perilaku diuji, gap dicatat, dan hasil evaluasi dipakai "
    "untuk menentukan perbaikan.",
)
add_table(
    doc,
    ["Kelompok bukti", "Kondisi Direkrut AI", "Status QA", "Implikasi"],
    [
        ["Produk digital", "Web, Go API, AI engine, kontrak OpenAPI, migrasi, dan konfigurasi deployment tersedia.", "Terbukti", "Mendukung functional prototype/MVP."],
        ["Pengujian internal", "Go test, AI test, type-check, lint, production build, dan 7 Playwright UI test dieksekusi.", "Lulus untuk scope otomatis", "Bukti regression tersedia; performance dan UAT pengguna tetap terpisah."],
        ["Praktisi/stakeholder", "Lima review mencakup produk, UX, arsitektur, reliability, hukum/PDP, praktik HR, fairness, dan strategi B2B.", "Terbukti melalui narasi review", "Memenuhi jalur validasi ahli; rekaman/notulen pendukung belum diaudit."],
        ["Pengguna potensial", "Belum tersedia task success, completion time, SEQ, satisfaction score, atau observasi penggunaan terstruktur.", "Belum terukur", "Diperlukan untuk memperkuat usability dan kesiapan pilot."],
        ["Implementasi terbatas non-digital", "Tidak relevan untuk inti produk digital; bukti pilot operasional belum tersedia.", "Belum dinilai", "Opsional bila pilot layanan dilakukan."],
        ["Pembelajaran dan iterasi", "Feedback praktisi ditautkan ke perubahan status kandidat, AI evidence, cross-role recommendation, visual hierarchy, dan scope MVP.", "Terbukti secara naratif", "Perlu screenshot before/after dan commit/change log sebagai bukti primer."],
    ],
    [1650, 3000, 1300, 3410],
    font_size=8.7,
)
add_callout(
    doc,
    "Prinsip kelulusan",
    "Satu klaim harus terhubung ke satu artefak, satu hasil aktual, dan satu owner tindak lanjut. Screenshot tanpa skenario uji, "
    "atau testimoni tanpa konteks tugas dan responden, hanya dianggap bukti pendukung.",
    PALE_BLUE,
)

heading(doc, "2. Matriks Bukti Produk Digital", 1)
add_table(
    doc,
    ["ID", "Artefak", "Lokasi bukti", "Apa yang dibuktikan", "Status"],
    [
        ["P-01", "Functional web prototype", "apps/web/src/app; apps/web/src/components", "Portal kandidat dan dashboard HRD telah diimplementasikan sebagai aplikasi Next.js.", "Ada"],
        ["P-02", "Business API", "apps/api-go", "Autentikasi, job, application, candidate, company, dan integrasi AI dipisahkan dalam layanan Go.", "Ada"],
        ["P-03", "AI proof of concept", "apps/ai-engine/app", "CV parsing, assessment, security guard, cache, dan router AI memiliki implementasi yang dapat diuji.", "Ada"],
        ["P-04", "API contract", "packages/contracts/openapi.yaml", "Input/output dan endpoint aktual/stub dibedakan secara eksplisit.", "Ada"],
        ["P-05", "Data model", "apps/api-go/migrations", "Skema aplikasi, assessment, evidence scoring, proctoring, dan interview schedule dapat direproduksi.", "Ada"],
        ["P-06", "Deployment configuration", "Dockerfile, heroku.yml, infra/docker-compose.yml", "Solusi memiliki konfigurasi eksekusi lokal/container.", "Ada"],
        ["P-07", "Live endpoint reference", "README.md bagian Dokumentasi API", "Dua base URL, empat health probe, auth boundary, endpoint utama, serta status implementasi/stub didokumentasikan.", "Terverifikasi: 4/4 probe HTTP 200 pada 26 Juli 2026"],
        ["P-08", "Source version", "Git commit a2f78a4", "Baseline evaluasi dapat ditelusuri ke versi kode tertentu.", "Ada"],
    ],
    [600, 1500, 2150, 3550, 1560],
    font_size=8.25,
)

# 3
heading(doc, "3. Validasi Lima Praktisi", 1, page_break=True)
add_paragraph(
    doc,
    "Tim melaporkan lima sesi review dengan praktisi dari disiplin berbeda. Tiga review produk/teknologi dilakukan pada 21 dan "
    "23 Juli 2026; review hukum dilakukan pada 2 Juni 2026; tanggal serta durasi review praktisi HR belum dicatat dalam bahan yang "
    "diterima QA. Dalam kerangka Level 3, kegiatan ini merupakan expert/stakeholder validation yang menghasilkan pembelajaran "
    "untuk memperbaiki solusi.",
)
add_callout(
    doc,
    "Batas bukti",
    "Isi bagian ini disusun dari narasi review yang diberikan tim. Rekaman, undangan, notulen asli, foto/screenshot sesi, serta "
    "persetujuan pencantuman identitas belum diperiksa oleh QA. Artefak tersebut sebaiknya dilampirkan sebagai bukti primer.",
    PALE_AMBER,
    AMBER,
)
add_table(
    doc,
    ["ID", "Praktisi", "Waktu", "Metode/fokus", "Kontribusi utama"],
    [
        ["R-01", "Kak Jason — Software Engineer, perusahaan e-commerce", "21 Juli 2026; 85 menit", "Diskusi teknis dan demo prototype; first-use flow, kandidat/HRD, arsitektur", "Status kandidat, separation of concerns, cross-role consent, batas MVP, security."],
        ["R-02", "Kak Kevin — IT Specialist/Software Engineer, perbankan", "23 Juli 2026; 54 menit", "Konsultasi MVP, infra, AI integration, deployment, reliability, scaling", "Arsitektur modular, persistent session, provider strategy, staged scaling."],
        ["R-03", "Kak Nugi — Product Designer dan berpengalaman sebagai Product Manager", "23 Juli 2026; durasi tidak dicatat", "Demo dan diskusi UX/UI, product communication, bisnis", "First impression, visual hierarchy, copywriting, validation before scaling."],
        ["R-04", "Praktisi hukum — lulusan Fakultas Hukum Universitas Indonesia", "2 Juni 2026; durasi tidak dicatat", "Diskusi PDP, tanggung jawab, sengketa, KI, dan legalitas operasi", "Controller/processor, transparansi, retensi, human-in-the-loop, PSE, dan KI."],
        ["R-05", "Pak Fedy — praktisi HR Nestlé Indonesia (berdasarkan keterangan tim)", "Tanggal/durasi tidak dicatat", "Review dashboard, parameter seleksi, fairness, human touch, regulasi, dan bisnis", "Segmentasi fresh graduate/profesional, demographic minimization, explainability, manual verification, B2B."],
    ],
    [650, 2100, 1350, 2700, 2560],
    font_size=8.2,
)

heading(doc, "3.1 Review Praktisi 1 — Software Engineer E-Commerce", 2)
add_paragraph(
    doc,
    "Review menilai alur dari landing page, job portal, detail lowongan, login, unggah CV, hingga AI Interview. Temuan utama adalah "
    "pengguna baru belum selalu memahami langkah berikutnya setelah melamar atau ketika HRD memproses kandidat. Status administrasi, "
    "AI Interview, terkirim, review HRD, undangan wawancara, diterima, dan ditolak perlu memiliki definisi serta transisi yang eksplisit.",
)
for item in [
    "Alur disarankan memakai state machine, progress stepper, filter status, tooltip, atau legend.",
    "Status proses rekrutmen dipisahkan dari kategori rekomendasi AI: Memenuhi Kriteria, Perlu Dipertimbangkan, dan Perlu Pengembangan.",
    "Cross-role recommendation tidak memindahkan kandidat otomatis; rekomendasi memerlukan review HRD dan validasi tambahan.",
    "Scope MVP, konsistensi pipeline AI, ketergantungan provider, proteksi CV/PII, dan prompt injection perlu dipertegas.",
]:
    add_bullet(doc, item)
add_paragraph(
    doc,
    "Pembelajaran yang diklaim tim: kejelasan user flow dan status kandidat diperbaiki, hasil proses dipisahkan dari rekomendasi AI, "
    "serta cross-role recommendation dibatasi menjadi decision support dengan human approval.",
    size=10.5,
    bold=True,
    color=DARK_BLUE,
)

heading(doc, "3.2 Review Praktisi 2 — IT Specialist/Software Engineer Perbankan", 2, page_break=True)
add_paragraph(
    doc,
    "Review menyimpulkan arsitektur Next.js, backend API, AI Engine, database, object storage, integrasi provider AI, containerization, "
    "dan cloud deployment memadai untuk tahap MVP selama tim memprioritaskan kestabilan core flow. Microservices penuh belum diperlukan "
    "pada tahap awal; struktur modular lebih sesuai dengan ukuran tim dan kebutuhan pengujian saat ini.",
)
for item in [
    "Scaling dilakukan bertahap berdasarkan beban: pemisahan autentikasi, CV processing, AI Interview, scoring, dan notifikasi bila dibutuhkan.",
    "Arah pertumbuhan dapat memakai multi-instance, load balancer, redundancy, dan backup berdasarkan traffic aktual.",
    "Ketergantungan AI perlu dikendalikan melalui pemahaman biaya per proses, rate limit, kualitas output, dan opsi multi-provider.",
    "AI Interview harus memakai session ID dan persistent state agar restart/deployment tidak menghilangkan konteks.",
    "Chatbot, advanced search, rekomendasi kompleks, dan analytics lanjutan ditempatkan setelah core flow stabil.",
]:
    add_bullet(doc, item)
add_paragraph(
    doc,
    "Pembelajaran yang diklaim tim: arsitektur MVP dipertahankan sederhana dan modular; roadmap scaling, reliability, persistent session, "
    "serta prioritas stabilitas proses inti diperjelas.",
    size=10.5,
    bold=True,
    color=DARK_BLUE,
)

heading(doc, "3.3 Review Praktisi 3 — Product Designer/Product Manager", 2)
add_paragraph(
    doc,
    "Review berfokus pada kemampuan kandidat dan HRD memahami tujuan produk, tindakan saat ini, dan langkah berikutnya tanpa penjelasan "
    "langsung dari tim. Evaluasi mencakup layout, spacing, copywriting tombol/label/instruksi, hierarchy status dan angka, serta arah "
    "validasi produk sebelum ekspansi.",
)
for item in [
    "Warna primer yang terlalu dominan pada card dan elemen utama mengalihkan perhatian dari status, hasil analisis, dan angka penilaian.",
    "Warna perlu digunakan sebagai penanda informasi/tindakan, bukan dekorasi utama; layout dan hierarchy perlu lebih terkontrol.",
    "Copywriting dan konteks tindakan harus dipahami pengguna baru tanpa pendampingan.",
    "Product validation before scaling: buktikan manfaat pada pengguna awal, perbaiki berdasarkan feedback, lalu perluas target pasar.",
]:
    add_bullet(doc, item)
add_paragraph(
    doc,
    "Pembelajaran yang diklaim tim: saturasi warna dikurangi, konsistensi visual dan layout diperbaiki, copywriting diperjelas, serta "
    "strategi produk diarahkan pada validasi penggunaan terbatas sebelum scaling.",
    size=10.5,
    bold=True,
    color=DARK_BLUE,
)

heading(doc, "3.4 Review Praktisi 4 — Perspektif Hukum", 2, page_break=True)
add_paragraph(
    doc,
    "Review pada 2 Juni 2026 membahas model subscription B2B, penyaringan CV dan rekomendasi AI, pengelolaan data kandidat, "
    "pembagian tanggung jawab, potensi sengketa, serta perlindungan kekayaan intelektual. Narasumber menempatkan keputusan final "
    "pada HRD dan menekankan bahwa tujuan pemrosesan data harus jelas serta transparan kepada kandidat.",
)
for item in [
    "Perusahaan pengguna dapat berperan sebagai Pengendali Data Pribadi, sedangkan penyedia platform dapat berperan sebagai Prosesor ketika memproses atas nama perusahaan; pembagian peran harus dituangkan secara kontraktual dan dikaji per aktivitas.",
    "CV, riwayat kerja, wajah, suara, dan hasil interview memerlukan data mapping, dasar pemrosesan, notice/consent yang sesuai, kontrol akses, keamanan, retensi, serta mekanisme permintaan hak subjek data.",
    "Human-in-the-loop mengurangi risiko keputusan otomatis, tetapi hasil AI tetap perlu dapat dijelaskan, diuji biasnya, dan tidak dijadikan satu-satunya dasar penolakan.",
    "Tanggung jawab insiden tidak dapat dilepaskan sepihak; kontrak perlu membagi kewajiban keamanan, instruksi pemrosesan, notifikasi insiden, audit, penghapusan, dan penggunaan subprocessor.",
    "Perlindungan KI perlu dipilah: program komputer melalui hak cipta, nama/brand melalui merek, dan paten hanya bila invensi memenuhi persyaratan paten.",
]:
    add_bullet(doc, item)
add_callout(
    doc,
    "Koreksi legal untuk laporan",
    "Pernyataan retensi umum 3 bulan tidak dicantumkan sebagai ketentuan UU PDP karena tidak ditemukan sebagai batas umum dalam "
    "sumber resmi yang diverifikasi. Retensi harus ditetapkan berdasarkan tujuan, kebutuhan, kontrak, dan ketentuan sektoral; "
    "penghapusan/pemusnahan dilakukan ketika dasar atau tujuan pemrosesan berakhir, dengan memperhatikan kewajiban hukum lain.",
    PALE_AMBER,
    AMBER,
)
add_paragraph(
    doc,
    "Rujukan resmi yang diverifikasi: UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi; PP No. 71 Tahun 2019 tentang "
    "Penyelenggaraan Sistem dan Transaksi Elektronik; Permenkominfo No. 5 Tahun 2020 tentang PSE Lingkup Privat; serta informasi "
    "DJKI mengenai pelindungan program komputer. Bagian ini merupakan validasi awal, bukan pendapat hukum formal.",
    size=9,
    italic=True,
    color=MUTED,
)

heading(doc, "3.5 Review Praktisi 5 — Human Resources Nestlé Indonesia", 2)
add_paragraph(
    doc,
    "Praktisi HR menilai dashboard kandidat, pembobotan evidence CV 60% dan AI Interview 40%, transkrip/log interview, "
    "penjadwalan interview lanjutan, email otomatis, serta fitur AI Assistant. Masukan utamanya adalah memastikan sistem tetap "
    "human-oriented, parameter penilaian dapat dipertanggungjawabkan, dan HRD diarahkan untuk memeriksa bukti sumber.",
)
for item in [
    "Bedakan lowongan fresh graduate dan profesional karena parameter evaluasinya berbeda; pengalaman kerja di bawah tiga tahun disebut sebagai pertimbangan praktis, bukan aturan hukum universal.",
    "Jadikan gender dan umur opsional serta minimalkan tampilannya untuk mendukung inklusivitas dan mengurangi risiko diskriminasi yang tidak relevan dengan pekerjaan.",
    "Batasi kategori rekomendasi maksimal empat dan jelaskan parameter tingkat potensi, relevansi pengalaman, attitude/behavior, job know-how, akuntabilitas, serta role and responsibility.",
    "Tambahkan pengingat agar HRD membuka CV dan evidence asli; jangan hanya mengandalkan ringkasan atau persentase AI.",
    "Tempatkan AI Assistant setelah informasi dan proses verifikasi utama agar AI tetap menjadi alat bantu, bukan pengganti human judgment.",
    "Jangan meminta KTP pada tahap pendaftaran kandidat; lakukan data minimization dan kumpulkan dokumen sensitif hanya ketika benar-benar diperlukan.",
    "Strategi bisnis yang disarankan adalah kanal B2B/afiliasi dan integrasi dengan career site perusahaan, dengan fokus awal pada partnership serta kualitas database.",
]:
    add_bullet(doc, item)
add_table(
    doc,
    ["Tindak lanjut", "Status berdasarkan bahan tim", "Bukti yang diperlukan"],
    [
        ["Pilihan lowongan fresh graduate/profesional", "Direkomendasikan; implementasi belum diverifikasi", "Screenshot form, rule/scoring test"],
        ["Gender dan umur menjadi opsional", "Direkomendasikan; implementasi belum diverifikasi", "Schema/form validation test"],
        ["Notifikasi untuk memeriksa CV/evidence", "Direkomendasikan", "UI capture dan usability check"],
        ["AI Assistant ditempatkan setelah proses utama", "Direkomendasikan", "Before/after dashboard"],
        ["Kategori dan parameter penilaian dijelaskan", "Sebagian tercermin pada kategorisasi/evidence; perlu finalisasi", "Scoring rubric, model card, contoh alasan"],
        ["Riset regulasi AI dan PDP", "Berjalan; cross-check hukum awal ditambahkan", "Legal memo/compliance checklist"],
        ["Strategi kanal B2B", "Masuk arah bisnis", "Pilot/partner validation"],
    ],
    [3400, 3000, 2960],
    font_size=8.25,
)

heading(doc, "3.6 Sintesis Feedback → Keputusan Produk", 2, page_break=True)
add_table(
    doc,
    ["Tema lintas review", "Temuan", "Keputusan/perubahan tim", "Bukti lanjutan yang diperlukan"],
    [
        ["Kejelasan flow", "Next step kandidat dan HRD belum cukup eksplisit.", "Memperjelas core flow, progress/status, dan konteks tindakan.", "Screenshot before/after; usability task result."],
        ["Status vs AI recommendation", "Tahap proses bercampur dengan hasil analisis.", "Memisahkan lifecycle status dari kategori rekomendasi dan evidence AI.", "State diagram; contoh input-output; dashboard capture."],
        ["Human-in-the-loop", "Auto-move cross-role berisiko mengabaikan kriteria posisi dan consent.", "Mengubah menjadi rekomendasi yang memerlukan review/approval.", "Acceptance test dan audit log approval."],
        ["Core MVP", "Penambahan fitur berisiko mengganggu stabilitas.", "Fokus pada job → apply → CV → interview → review → decision.", "Scope/DoD dan hasil E2E."],
        ["Reliability & scaling", "Long-running AI Interview berisiko kehilangan state.", "Arah persistent session dan staged scaling.", "Restart/recovery test; architecture decision record."],
        ["UX hierarchy", "Warna dominan dan copy berpotensi mengalihkan/membingungkan.", "Mengurangi saturasi, menyederhanakan layout, memperjelas copy.", "Before/after dan task success pengguna baru."],
        ["Validasi bisnis", "Scaling perlu menunggu bukti manfaat penggunaan nyata.", "Pilot terbatas dan feedback-driven iteration.", "Pilot report, benefit metric, partner feedback."],
        ["PDP & governance", "CV, wajah, suara, dan hasil interview memerlukan tujuan, dasar pemrosesan, keamanan, retensi, dan pembagian peran.", "Arah privacy notice, consent, DPA/controller-processor mapping, dan mekanisme hak subjek.", "Data map, retention schedule, DPA, privacy notice, incident procedure."],
        ["Fairness & HR practice", "Parameter fresh graduate/profesional dan demografi tidak boleh menghasilkan penilaian yang tidak relevan.", "Arah segmentasi job type, demographic minimization, explainability, dan manual verification.", "Fairness test, scoring rubric, field/config evidence."],
        ["Human-centered AI", "AI tidak menangkap seluruh behavior, networking, ethics, atau business impact.", "AI dipertahankan sebagai decision support; HRD memeriksa CV/evidence dan memegang keputusan final.", "UI reminder, audit trail, decision policy."],
    ],
    [1700, 2500, 2850, 2310],
    font_size=7.9,
)
add_callout(
    doc,
    "Kesimpulan validasi praktisi",
    "Lima review memberikan triangulasi yang konsisten: AI harus menjadi decision support yang transparan dan human-centered; "
    "core flow harus jelas dan stabil; data pribadi harus dikelola secara sah dan proporsional; serta scaling dilakukan setelah "
    "penggunaan awal membuktikan manfaat. Ini merupakan bukti pembelajaran Level 3, dengan syarat "
    "perubahan yang diklaim dilengkapi artefak before/after dan version trace.",
    PALE_GREEN,
    GREEN,
)

# 4
heading(doc, "4. Hasil Eksekusi Pengujian", 1, page_break=True)
add_paragraph(
    doc,
    "Pengujian berikut dijalankan dari workspace lokal pada baseline a2f78a4 beserta perubahan QA tanggal 26 Juli 2026. "
    "Status “lulus” berarti perintah selesai "
    "dengan exit code 0. Status “gagal” tetap dipertahankan sebagai bukti pembelajaran dan bukan disembunyikan.",
)
add_table(
    doc,
    ["ID", "Area/perintah", "Hasil aktual", "Status", "Catatan QA"],
    [
        ["T-01", "Go API — go test ./...", "Seluruh paket test lulus; 27 test function teridentifikasi pada 6 paket bertest.", "Lulus", "Cakupan unit ada, tetapi banyak paket belum memiliki test."],
        ["T-02", "AI engine — .venv/bin/python -m pytest -q", "33 passed dalam 1,00 detik.", "Lulus", "Ada deprecation warning pytest-asyncio terkait fixture loop scope."],
        ["T-03", "Web — yarn typecheck", "TypeScript selesai tanpa error.", "Lulus", "Membuktikan konsistensi tipe, bukan perilaku UI."],
        ["T-04", "Web — yarn lint", "Selesai tanpa error dan tanpa warning.", "Lulus", "17 error dan 10 warning awal telah ditutup."],
        ["T-05", "Web — yarn build", "Compiled successfully; 27 static pages dihasilkan; proses selesai dalam 37,60 detik.", "Lulus", "Build membutuhkan akses jaringan untuk mengambil Plus Jakarta Sans dari Google Fonts."],
        ["T-06", "Web — yarn test:ui", "7 Playwright test lulus dalam 47,7 detik pada Chromium.", "Lulus", "API dimock secara deterministik; HTML, JUnit, JSON, trace/screenshot-on-failure dikonfigurasi."],
        ["T-07", "Security patch verification", "Commit auth, AI guard, dan dependency security ditemukan pada branch dev/prod beserta unit test terkait.", "Terbukti di repositori", "Belum setara penetration test atau bukti zero open alert dari GitHub Security."],
        ["T-08", "UAT-05 AI Interview perangkat nyata", "Tim mengonfirmasi consent jelas, kamera/mikrofon berfungsi, failure device tertangani, dan hasil tersimpan.", "Pass (reported)", "Consent, recording, error log, serta device/browser matrix belum diaudit QA."],
        ["T-09", "Performance dan UAT kuantitatif lengkap", "Belum ditemukan laporan hasil terukur untuk seluruh journey.", "Belum lengkap", "Perlu load test dan UAT langsung dengan pengguna target pada skenario selain UAT-05."],
        ["T-10", "Live deployment dan auth boundary", "Empat health probe HTTP 200 (1,08–1,21 detik); GET /v1/jobs mengembalikan data nyata; AI /v1/chat/stream tanpa key ditolak HTTP 401.", "Lulus", "Diuji langsung 26 Juli 2026; health probe publik, endpoint AI /v1/* memakai internal API key."],
    ],
    [600, 2200, 2850, 1050, 2660],
    font_size=8.25,
)
add_callout(
    doc,
    "Makna hasil",
    "Backend, AI, type-check, lint, production build, dan automated UI regression membuktikan komponen inti dapat diuji berulang. "
    "Hasil automation bukan pengganti UAT pengguna, performance test, atau security test lanjutan.",
    PALE_GREEN,
    GREEN,
)

heading(doc, "4.1 Hasil Automated UI Regression", 2)
add_table(
    doc,
    ["ID", "Skenario otomatis", "Hasil", "Relasi ke UAT"],
    [
        ["AUTO-01", "Portal publik menampilkan lowongan dan memfilter kata kunci.", "Pass", "Mendukung UAT-02"],
        ["AUTO-02", "Login kandidat menyimpan sesi dan membuka dashboard kandidat.", "Pass", "Prasyarat UAT kandidat"],
        ["AUTO-03", "Kandidat mengisi data, menggunakan CV tersimpan, dan mengirim lamaran.", "Pass", "Mendukung UAT-02/UAT-03"],
        ["AUTO-04", "HRD membuat serta mempublikasikan lowongan; payload API diverifikasi.", "Pass", "Mendukung UAT-01"],
        ["AUTO-05", "Role guard mengalihkan kandidat yang mencoba membuka dashboard HRD.", "Pass", "Sebagian UAT-08"],
        ["AUTO-06", "Written test menolak jawaban terlalu pendek dan mengizinkan submit jawaban valid.", "Pass", "Mendukung UAT-04"],
        ["AUTO-07", "Clock dipercepat melewati 5 menit; auto-submit dan navigasi interview diverifikasi.", "Pass", "Mendukung UAT-04"],
    ],
    [950, 4700, 850, 2860],
    font_size=8.5,
)
add_paragraph(
    doc,
    "Artefak: apps/web/tests/ui/critical-flows.spec.ts; apps/web/playwright.config.ts; "
    "output/qa/ui-report; output/qa/ui-results.xml; output/qa/ui-results.json.",
    size=9,
    italic=True,
    color=MUTED,
)

heading(doc, "4.2 Verifikasi Security Patch pada Branch dev", 2)
add_paragraph(
    doc,
    "Riwayat Git lokal menunjukkan ketiga kelompok patch telah masuk ke branch dev dan juga terkandung pada branch prod. "
    "Commit awal facf27f sempat dibatalkan oleh a693dfc, kemudian diterapkan kembali melalui 4d116c1; karena itu bukti utama "
    "menggunakan commit reapply dan patch lanjutan di bawah.",
)
add_table(
    doc,
    ["Area patch", "Commit terverifikasi", "Perubahan yang dibuktikan", "Bukti pengujian/status"],
    [
        [
            "Logic flaw registrasi akun duplikat",
            "4d116c1; 554bc0d; 0cfdf2d",
            "Normalisasi email; pemeriksaan case-insensitive dalam transaksi; respons 409 email_taken; frontend tidak lagi membuat akun mock ketika backend gagal.",
            "Test mendaftarkan email yang sama dengan variasi huruf besar/kecil, mengharapkan 409, dan memastikan hanya satu user tersimpan.",
        ],
        [
            "Anti-jailbreak, prompt injection, dan batas scope AI",
            "4d116c1; 3a5b899",
            "Deteksi override/prompt extraction, obfuscation, leetspeak, zero-width marker; untrusted-content wrapping; refusal sebelum provider; AI Assistant dibatasi ke HR/rekrutmen.",
            "Test untuk prompt normal, override Inggris/Indonesia, marker terobfuscasi, leetspeak, coding out-of-scope, dan pertanyaan interview yang valid.",
        ],
        [
            "Dependency High–Critical alert remediation",
            "1e177cb; 607f0f3",
            "Patch advisory pgx serta pembaruan go-chi, Next.js, PostCSS, python-multipart, pypdf, python-dotenv, pytest, dan pytest-asyncio.",
            "Branch remote Dependabot tersedia untuk dependency Go, npm/yarn, dan Python; quality gate proyek lulus pada evaluasi lokal.",
        ],
    ],
    [1700, 1450, 3400, 2810],
    font_size=7.75,
)
add_callout(
    doc,
    "Batas klaim security",
    "Bukti commit menunjukkan alert dan kelemahan tertentu telah ditindaklanjuti. Laporan tidak menyatakan zero open vulnerability "
    "karena status terbaru GitHub Security/Dependabot tidak diverifikasi dari dashboard. Screenshot alert sebelum–sesudah atau "
    "riwayat pull request Dependabot tetap perlu dilampirkan sebagai bukti primer.",
    PALE_AMBER,
    AMBER,
)

heading(doc, "5. Defect, Gap, dan Risiko", 1)
add_table(
    doc,
    ["ID", "Severity", "Temuan", "Dampak", "Rekomendasi/exit condition"],
    [
        ["QA-001", "Medium", "Lima review praktisi tersedia sebagai narasi, tetapi bukti primer sesi, izin pencantuman identitas/afiliasi, dan metrik usability belum diperiksa.", "Validasi ahli terbukti; task success dan respons penggunaan aktual belum seluruhnya terukur.", "Lampirkan notulen/rekaman/izin identitas, lalu jalankan minimal 5 sesi pengguna target."],
        ["QA-002", "Closed", "Frontend lint awal gagal: 17 error dan 10 warning.", "Risiko lifecycle React, type safety, image handling, dan maintainability.", "Ditutup: yarn lint kini 0 error/0 warning."],
        ["QA-003", "High", "Subscription, payment, notification, vector search, dan chat masih sebagian stub/placeholder.", "Demo dapat menimbulkan ekspektasi fungsi yang belum nyata.", "Labeli eksplisit sebagai out-of-scope; jangan masukkan acceptance MVP inti."],
        ["QA-004", "Critical", "README menyatakan webhook Xendit menerima callback tanpa verifikasi signature.", "Risiko pemalsuan callback pembayaran.", "Wajib verifikasi signature dan tambah negative test sebelum fitur pembayaran diaktifkan."],
        ["QA-005", "Medium", "Tidak ada performance/load test terukur.", "Klaim skalabilitas belum memiliki data p50/p95, throughput, atau error rate.", "Tetapkan workload pilot dan jalankan baseline load test."],
        ["QA-006", "Closed/Partial", "Automated UI regression sebelumnya belum tersedia.", "Critical flow tidak memiliki safety net.", "Ditutup untuk 7 skenario inti; lanjutkan coverage AI Interview, HRD decision, upload invalid, dan payment security."],
        ["QA-009", "Low", "Run UI headless mencatat warning aspect ratio/LCP dan tidak menyediakan kamera; tim kemudian melaporkan UAT AI Interview berhasil pada perangkat nyata.", "Fungsi perangkat nyata tervalidasi, tetapi evidence pack belum diaudit QA dan warning image tetap menjadi performance debt.", "Lampirkan consent, recording, device/browser matrix, serta error log; perbaiki image sizing/priority."],
        ["QA-007", "Medium/Partial", "Trace security patch telah dilengkapi commit; perubahan produk/UX lain masih belum seluruhnya memiliki bukti before/after dan commit terkait.", "Security remediation dapat diaudit, tetapi seluruh feedback-to-change belum lengkap.", "Tambahkan screenshot, issue/decision log, commit, dan status verifikasi untuk perubahan produk/UX."],
        ["QA-008", "Low", "Pytest menghasilkan deprecation warning konfigurasi async fixture.", "Potensi perubahan perilaku saat dependency di-upgrade.", "Tetapkan asyncio_default_fixture_loop_scope secara eksplisit."],
        ["QA-010", "Medium", "AUTO-06/AUTO-07 membuktikan validasi jawaban, timer, single auto-submit, dan navigasi; halaman written test masih memakai simulated submit tanpa request persistence.", "Record DB written test belum dibuktikan dari journey UI yang diautomasi meskipun backend prescreen dapat menyimpan assessment_items.", "Hubungkan halaman ke /v1/applications/{id}/prescreen/submit dan tambahkan assertion API/DB."],
    ],
    [650, 900, 2800, 2450, 2560],
    font_size=7.85,
)

# 5
heading(doc, "6. Matriks UAT dan Dukungan Automation", 1, page_break=True)
add_paragraph(
    doc,
    "Automation membuktikan perilaku sistem secara konsisten, sedangkan UAT membuktikan bahwa pengguna target mampu dan nyaman "
    "menyelesaikan tugas. Karena itu status di bawah memisahkan “Automation Pass” dari “User UAT Not Run”; keduanya tidak boleh "
    "disamakan.",
)
add_table(
    doc,
    ["TC", "Peran", "Skenario inti", "Kriteria lulus", "Bukti wajib", "Status"],
    [
        ["UAT-01", "HRD", "Membuat dan mempublikasikan lowongan.", "Selesai tanpa bantuan; validasi input jelas.", "AUTO-04 + screen recording pengguna.", "Automation Pass; User UAT Not Run"],
        ["UAT-02", "Kandidat", "Mencari lowongan, membuka detail, dan mengajukan lamaran.", "Task success; data tersimpan; status terlihat.", "AUTO-01/AUTO-03 + observasi pengguna.", "Automation Pass; User UAT Not Run"],
        ["UAT-03", "Kandidat", "Mengunggah CV valid dan invalid.", "Valid diproses; invalid ditolak dengan pesan yang dapat ditindaklanjuti.", "File uji, response, screenshot.", "Partial: CV tersimpan; upload valid/invalid Not Run"],
        ["UAT-04", "Kandidat", "Menyelesaikan written test sampai timer habis.", "Jawaban tidak hilang; auto-submit tepat sekali; next step jelas.", "AUTO-06/AUTO-07 + record DB.", "Pass untuk UI/timer/single submit/next step; persistence DB belum dibuktikan pada journey ini"],
        ["UAT-05", "Kandidat", "Menjalankan AI interview dengan kamera/mikrofon.", "Consent jelas; failure device tertangani; hasil tersimpan.", "Consent, recording, error log, device/browser.", "Pass pada perangkat nyata (dikonfirmasi tim); artefak belum diaudit QA"],
        ["UAT-06", "HRD", "Meninjau shortlist dan alasan/evidence skor.", "HRD dapat menjelaskan alasan dan menemukan sumber evidence.", "Task success, trust rating, komentar.", "User UAT Not Run"],
        ["UAT-07", "HRD", "Mengubah keputusan kandidat dan mengirim feedback.", "Konfirmasi ada; status konsisten; feedback terkirim satu kali.", "Audit log, email, screenshot.", "Automation Not Run; User UAT Not Run"],
        ["UAT-08", "Security", "Menguji akses lintas role dan callback/payment invalid.", "Akses ditolak; callback invalid tidak mengubah state.", "AUTO-05 + negative API/security test.", "Role guard Pass; callback/payment Not Run"],
    ],
    [600, 700, 2050, 2050, 2000, 1960],
    font_size=7.7,
)

heading(doc, "7. Protokol Validasi Pengguna", 1)
add_table(
    doc,
    ["Elemen", "Standar minimum yang direkomendasikan"],
    [
        ["Partisipan", "Minimal 5 pengguna target untuk satu kelompok utama; prioritaskan HR/recruiter yang menjalankan screening. Tambahkan kandidat untuk flow apply/interview."],
        ["Metode", "Moderated usability test dengan think-aloud pada build/URL dan commit yang dicatat."],
        ["Tugas", "Gunakan UAT-01 s.d. UAT-07; jangan membimbing kecuali partisipan benar-benar terhenti."],
        ["Metrik wajib", "Task success rate, completion time, critical error, bantuan moderator, Single Ease Question (SEQ), dan satisfaction/trust score awal."],
        ["Bukti kualitatif", "Catatan observasi, kutipan singkat dengan izin, titik ragu, mental model, serta alasan percaya/tidak percaya pada output AI."],
        ["Sintesis", "Kelompokkan temuan; beri severity; tentukan adopt/modify/reject/backlog; tunjukkan perubahan before/after."],
        ["Privasi", "Minta consent, minimalkan PII, samarkan identitas, dan batasi akses rekaman."],
    ],
    [1900, 7460],
    font_size=9,
)
add_callout(
    doc,
    "Target awal yang praktis",
    "Task success ≥80%, tidak ada critical error pada keputusan/status, SEQ median ≥5/7, dan seluruh alasan AI dapat ditelusuri "
    "oleh HRD ke evidence sumber. Target ini adalah baseline internal dan harus dikalibrasi setelah pilot pertama.",
    PALE_GREEN,
    GREEN,
)

# 7
heading(doc, "8. Exit Criteria untuk Klaim Level 3 yang Kuat", 1, page_break=True)
for item in [
    "Functional prototype dapat didemokan dengan input dan output nyata pada versi yang dibekukan.",
    "Go test, AI test, type-check, lint, build, dan 7 automated UI critical journey lulus; perluasan coverage masuk backlog QA.",
    "Fitur stub/out-of-scope dilabeli secara eksplisit pada demo, dokumen, dan acceptance criteria.",
    "Minimal satu validation report pengguna memuat profil, tugas, hasil, metrik, feedback, dan bukti sesi.",
    "Setiap temuan utama terhubung ke keputusan tim serta perubahan produk atau backlog yang dapat ditelusuri.",
    "Tidak ada open Critical defect; High defect yang tersisa memiliki mitigasi dan persetujuan risiko tertulis.",
    "Security baseline mencakup role access, input validation, prompt injection, secret handling, dan webhook verification.",
    "Performance baseline mencatat workload, konfigurasi, p50/p95 latency, throughput, dan error rate.",
]:
    add_bullet(doc, item)
add_callout(
    doc,
    "Keputusan saat ini",
    "Boleh menyatakan “Direkrut AI telah mencapai Innovation Level 3 melalui functional MVP, pengujian internal, lima review praktisi, "
    "iterasi berbasis feedback, dan security patch yang dapat ditelusuri.” Kesiapan presentasi final dinilai 9/10. Gunakan istilah "
    "“review praktisi/expert validation”, bukan “usability test pengguna”, sampai UAT terukur selesai dan bukti primernya dilampirkan.",
    PALE_BLUE,
)

heading(doc, "9. Indeks Bukti dan Traceability", 1)
add_table(
    doc,
    ["Kode", "Bukti", "Lokasi", "Status saat evaluasi"],
    [
        ["EV-01", "Arsitektur, endpoint, status implementasi", "README.md", "Tersedia"],
        ["EV-02", "Kontrak request/response API", "packages/contracts/openapi.yaml", "Tersedia"],
        ["EV-03", "Unit test Go API", "apps/api-go/**/*_test.go", "27 test function; paket lulus"],
        ["EV-04", "Automated test AI engine", "apps/ai-engine/tests", "33 passed"],
        ["EV-05", "Automated UI regression", "apps/web/tests/ui; output/qa/ui-report", "7/7 Playwright test lulus"],
        ["EV-06", "Data model/migrations", "apps/api-go/migrations", "Tersedia"],
        ["EV-07", "Deployment/container config", "Dockerfile, heroku.yml, infra/docker-compose.yml", "Tersedia"],
        ["EV-08", "Narasi review lima praktisi", "Input tim; 2 Juni, 21 Juli, dan 23 Juli 2026; tanggal review HR belum dicatat", "Tersedia; bukti primer dan izin afiliasi belum diaudit"],
        ["EV-09", "UAT/usability report kuantitatif", "Belum tersedia", "Gap"],
        ["EV-10", "Performance/penetration-test report", "Belum tersedia", "Gap; security patch verification tersedia terpisah"],
        ["EV-11", "Feedback-to-change trace", "Bagian 3.6 laporan ini", "Tersedia secara naratif; before/after belum lengkap"],
        ["EV-12", "Machine-readable UI test result", "output/qa/ui-results.xml dan ui-results.json", "Tersedia"],
        ["EV-13", "Duplicate-account security patch", "Commit 4d116c1, 554bc0d, 0cfdf2d", "Terverifikasi pada dev/prod; automated test tersedia"],
        ["EV-14", "Anti-jailbreak dan HR scope guard", "Commit 4d116c1, 3a5b899", "Terverifikasi pada dev/prod; automated test tersedia"],
        ["EV-15", "Dependency security remediation", "Commit 1e177cb, 607f0f3; remote Dependabot branches", "Patch terverifikasi; audit dashboard dikonfirmasi tim, artefak screenshot/export belum tersimpan di workspace"],
        ["EV-16", "UAT AI Interview kamera/mikrofon", "Konfirmasi tim; perangkat nyata", "Pass dilaporkan; consent/recording/error log belum diaudit"],
        ["EV-17", "Review hukum dan cross-check regulasi", "2 Juni 2026; UU 27/2022, PP 71/2019, Permenkominfo 5/2020", "Tersedia sebagai validasi awal; bukan legal opinion formal"],
        ["EV-18", "Review praktisi HR Nestlé Indonesia", "Input tim; tanggal/durasi belum dicatat", "Tersedia; bukti primer dan izin afiliasi belum diaudit"],
        ["EV-19", "Live deployment dan auth-boundary check", "Dua URL Heroku pada README; health, jobs, dan AI chat tanpa key", "Health 4/4 HTTP 200; jobs HTTP 200 dengan data nyata; AI internal route tanpa key HTTP 401"],
    ],
    [850, 2500, 3400, 2610],
    font_size=8.45,
)

heading(doc, "10. Rujukan Resmi untuk Cross-Check Legal", 1, page_break=True)
add_paragraph(
    doc,
    "Rujukan berikut digunakan untuk membedakan masukan praktisi dari ketentuan yang dapat diverifikasi. Interpretasi final, "
    "kontrak komersial, klasifikasi peran controller/processor, serta kewajiban sektoral tetap perlu ditinjau penasihat hukum.",
)
add_table(
    doc,
    ["Rujukan", "Relevansi", "Alamat resmi"],
    [
        [
            "UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi",
            "Hak subjek data, dasar pemrosesan, kewajiban Pengendali dan Prosesor, keamanan, penghapusan/pemusnahan, dan sanksi.",
            "https://peraturan.bpk.go.id/Details/229798/uu-no-27-tahun-2022",
        ],
        [
            "PP No. 71 Tahun 2019 tentang Penyelenggaraan Sistem dan Transaksi Elektronik",
            "Pendaftaran PSE, tata kelola, keamanan, audit trail, pelindungan data, retensi, dan mekanisme penghapusan.",
            "https://jdih.komdigi.go.id/produk_hukum/view/id/695/",
        ],
        [
            "Permenkominfo No. 5 Tahun 2020 tentang PSE Lingkup Privat",
            "Ketentuan pendaftaran dan kewajiban PSE Lingkup Privat.",
            "https://jdih.komdigi.go.id/produk_hukum/view/id/759/",
        ],
        [
            "Direktorat Jenderal Kekayaan Intelektual — Pengenalan Hak Cipta",
            "Program komputer sebagai ciptaan yang dapat dilindungi; jalur KI perlu dibedakan dari merek dan paten.",
            "https://www.dgip.go.id/menu-utama/hak-cipta/pengenalan",
        ],
    ],
    [2600, 3650, 3110],
    font_size=8.25,
)
add_paragraph(
    doc,
    "Disusun sebagai baseline QA berdasarkan kondisi workspace, UAT perangkat nyata yang dikonfirmasi tim, dan narasi lima review praktisi pada 26 Juli 2026. Laporan perlu "
    "diperbarui setelah bukti primer review dilampirkan, defect ditutup, dan UAT pengguna terukur dilaksanakan.",
    size=9,
    italic=True,
    color=MUTED,
    before=8,
    align=WD_ALIGN_PARAGRAPH.CENTER,
)

doc.save(OUT)
print(OUT)
