import path from "path";
import type { NextConfig } from "next";

// Monorepo: node_modules di-hoist yarn workspaces ke root repo (dua level
// di atas apps/web), jadi turbopack.root harus nunjuk ke sana biar bisa
// resolve paket next/react dkk.
const nextConfig: NextConfig = {
  reactStrictMode: true,
  turbopack: {
    root: path.join(__dirname, "..", ".."),
  },
  images: {
    formats: ["image/webp"],
  },
};

export default nextConfig;
