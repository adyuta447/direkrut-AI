// eslint-config-next@16 sudah mengekspor array flat-config native (lihat
// node_modules/eslint-config-next/dist/*.js), jadi diimpor langsung di
// sini. JANGAN dibungkus lewat @eslint/eslintrc FlatCompat.extends() lagi
// — itu memaksa config flat (yang plugin-nya mereferensikan dirinya
// sendiri) lewat resolver config lama punya ConfigArrayFactory, dan itu
// crash "Converting circular structure to JSON" saat coba format error.
import storybook from "eslint-plugin-storybook";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  ...storybook.configs["flat/recommended"],
  {
    // Script Node CJS mandiri (dijalankan via `node scripts/x.cjs`, bukan
    // bagian dari app bundle) — nggak perlu ikut rule TypeScript/React.
    ignores: ["scripts/**"],
  },
];

export default eslintConfig;
