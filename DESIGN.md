# Direkrut AI Design System

## 1. Atmosphere & Identity

Direkrut AI terasa seperti workspace rekrutmen yang terang, cepat dipindai, dan profesional. Signature visualnya adalah canvas putih dengan panel abu lembut, aksen biru untuk aksi utama, dan copy Bahasa Indonesia yang ringkas.

## 2. Color

| Role | Token | Value | Usage |
|------|-------|-------|-------|
| Canvas | `--canvas` | `#ffffff` | Background halaman publik dan auth |
| Surface 1 | `--surface-1` | `#f4f6f8` | Input, panel lembut |
| Surface 2 | `--surface-2` | `#e8ecf0` | Surface sekunder |
| Ink | `--ink` | `#161616` | Teks utama |
| Ink muted | `--ink-muted` | `#5a6572` | Helper, caption, label sekunder |
| Hairline | `--hairline` | `#e4e7ec` | Border halus |
| Primary | `--primary` | `#0a66c2` | CTA, link, focus |
| Primary strong | `--primary-strong` | `#084e96` | Hover CTA |
| Accent | `--brand-accent` | `#f97316` | Highlight brand terbatas |
| Success | `--success` | `#16a34a` | Konfirmasi |
| Warning | `--warning` | `#d97706` | Peringatan |
| Error | `--destructive` | `oklch(0.577 0.245 27.325)` | Error form |

Rules: gunakan token Tailwind yang sudah dipetakan (`bg-canvas`, `bg-surface-1`, `text-ink`, `text-ink-muted`, `border-hairline`, `bg-primary`). Jangan tambah warna mentah di komponen auth.

## 3. Typography

| Level | Size | Weight | Line Height | Tracking | Usage |
|-------|------|--------|-------------|----------|-------|
| Auth title | `clamp(30px,3vw,40px)` | 700 | 1.15 | 0 | Judul halaman auth |
| Page hero | `clamp(40px,5vw,68px)` | 700 | 1.05 | `-0.02em` | Halaman marketing |
| Body | `15px` to `17px` | 400 to 500 | 1.6 | 0 | Form copy dan paragraph |
| Label | `13px` to `14px` | 500 | 1.4 | 0 | Field label |
| Overline | `12px` | 500 | 1.4 | `0.2em` | Kicker uppercase |

Font stack: `--font-jakarta`, Helvetica, Arial, sans-serif.

## 4. Spacing & Layout

Base unit: 4px. Auth pages use a two-column desktop shell (`lg:flex-row`) and one-column mobile shell. Content forms are centered with `max-w-[420px]`, `px-6`, `py-10`, `space-y-4`, and submit spacing `mt-6`.

Breakpoints follow Tailwind defaults: `sm 640px`, `md 768px`, `lg 1024px`, `xl 1280px`.

## 5. Components

### Auth Shell
- Structure: full-height `bg-canvas text-ink font-sans`, marketing panel on desktop, mobile nav above content.
- States: responsive desktop/mobile, no horizontal overflow at 375px.
- Accessibility: main form content must use semantic `form`, `label`, `input`, and `button`.

### Auth Form Field
- Structure: label plus input.
- Spacing: label `mb-2`, input `px-5 py-3.5`.
- States: default `bg-surface-1 border-transparent`, focus `border-primary bg-canvas`, disabled via native attribute if needed.
- Accessibility: input type must match content (`email`, `password`, `text`), validation uses native constraints plus server validation.

### Primary Button
- Structure: icon plus text when an icon improves scan.
- States: default `btn-primary`, disabled `opacity-60`, hover through `primary-strong`.
- Accessibility: button text must remain visible and describe the action.

### Inline Auth Links
- Structure: muted helper text with primary link.
- States: default primary, hover underline.
- Accessibility: links must have real `href`, not click-only handlers.

### Auth Feedback
- Structure: rounded surface with Lucide status icon and short message.
- Variants: destructive for errors, success uses `bg-success text-white`.
- Accessibility: status copy must be readable without relying on icon or color alone.

## 6. Motion & Interaction

Current auth pages use `transition-none`; preserve this for consistency. Interactive controls still need visible hover/focus states.

## 7. Depth & Surface

Strategy: mixed, but restrained. Auth input surfaces use tonal shift and transparent borders. Repeated dashboard cards may use border and rounded corners, but auth forms stay visually light and unshadowed.

## 8. Accessibility Constraints & Accepted Debt

Constraints: target WCAG 2.2 AA, visible focus on every interactive field, semantic labels for every input, no color-only status communication, no primary-content horizontal scroll at 375px.

Accepted debt: none for the forgot/reset password flow.
