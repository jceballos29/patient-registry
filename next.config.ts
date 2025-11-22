import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Habilita el modo standalone para Docker
  output: 'standalone',

  // Optimizaciones de producción
  poweredByHeader: false,
  compress: true,

  // Configuración de imágenes (si se necesita en el futuro)
  images: {
    unoptimized: false,
  },
};

export default nextConfig;
