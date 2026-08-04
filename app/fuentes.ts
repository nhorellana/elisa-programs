import { Archivo, IBM_Plex_Mono } from "next/font/google";

// next/font auto-hospeda las fuentes: quedan servidas desde el mismo dominio y
// el navegador no le pide nada a Google. Es lo que corresponde en un sitio que
// declara no tener analytics, cookies ni tracking (handoff §2).

// Archivo es la fuente de Modernist, para display y cuerpo. Es variable, así
// que cubre los pesos 400/600/800 que usa styles.css sin declararlos.
export const archivo = Archivo({
  subsets: ["latin"],
  variable: "--fuente-archivo",
  display: "swap",
});

// El tercer rol tipográfico que pide el handoff §7: monoespaciada para TODAS
// las cifras. No es variable, así que los pesos van explícitos.
export const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--fuente-mono",
  display: "swap",
});
