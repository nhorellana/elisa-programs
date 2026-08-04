"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import estilos from "./Nav.module.css";

const secciones = [
  { href: "/", etiqueta: "Panorama" },
  { href: "/programas", etiqueta: "Programas" },
  { href: "/requisitos", etiqueta: "Requisitos" },
  { href: "/roadmap", etiqueta: "Roadmap" },
  { href: "/costos", etiqueta: "Costos" },
  { href: "/preguntas", etiqueta: "Preguntas" },
];

export function Nav() {
  const ruta = usePathname();

  return (
    <nav className={estilos.barra} aria-label="Secciones">
      <div className={`envoltura ${estilos.contenido}`}>
        <Link href="/" className={estilos.marca}>
          Postgrados UK
          <small>Admisión septiembre 2027</small>
        </Link>
        <div className={estilos.enlaces}>
          {secciones.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              aria-current={ruta === s.href ? "page" : undefined}
            >
              {s.etiqueta}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
