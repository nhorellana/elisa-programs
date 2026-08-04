import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Pie } from "@/components/Pie";
import { ReglaDeTiempo } from "@/components/ReglaDeTiempo";
import { archivo, mono } from "./fuentes";
import "./globals.css";

export const metadata: Metadata = {
  title: "Postgrados UK",
  description: "Seguimiento de las postulaciones a máster para septiembre 2027.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${archivo.variable} ${mono.variable}`}>
      <body>
        {/* El estado vive en lib/almacen.ts, que es un módulo: no hace falta
            envolver el árbol en ningún provider. */}
        <header>
          <Nav />
          {/* La regla de tiempo va en el header, visible en todas las
              secciones (handoff §7). */}
          <ReglaDeTiempo />
        </header>
        {children}
        <Pie />
      </body>
    </html>
  );
}
