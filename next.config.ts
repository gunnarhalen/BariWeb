import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Otimizações de performance
  experimental: {
    optimizePackageImports: ["@tabler/icons-react", "recharts"],
  },

  // Configurações de build
  typescript: {
    ignoreBuildErrors: false,
  },

  // Configurações de imagem
  images: {
    formats: ["image/webp", "image/avif"],
  },
};

export default nextConfig;
