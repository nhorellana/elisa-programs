import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Export estático: `next build` deja el sitio entero en out/.
  // Sin servidor, sin backend, sin base de datos (handoff §2).
  output: "export",

  // El optimizador de imágenes por defecto necesita un servidor y no está
  // disponible en export estático.
  images: { unoptimized: true },
};

export default nextConfig;
