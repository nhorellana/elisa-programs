"use client";

import { anclas, EJE } from "@/data/roadmap";
import {
  aFecha,
  formatoFecha,
  formatoFechaCorta,
  isoLocal,
  posicionEnEje,
} from "@/lib/formato";
import { useHoy } from "@/lib/useEstado";
import { Cifra } from "./Cifra";
import estilos from "./ReglaDeTiempo.module.css";

// El elemento firma (handoff §7): el eje completo agosto 2026 → septiembre
// 2027, persistente en todas las secciones.

const pct = (n: number) => `${(n * 100).toFixed(3)}%`;

const posicionAncla = (fecha: string) =>
  pct(posicionEnEje(aFecha(fecha), EJE.inicio, EJE.fin));

export function ReglaDeTiempo() {
  // null durante la hidratación: el HTML sale del build y no puede traer la
  // fecha del navegador.
  const hoy = useHoy();

  return (
    <div className={estilos.franja}>
      <div className={`envoltura ${estilos.contenido}`}>
        <div className={estilos.eje}>
          {anclas.map((a) => (
            <span
              key={a.id}
              className={`${estilos.ancla} ${a.critica ? estilos.anclaCritica : ""}`}
              style={{ left: posicionAncla(a.fecha) }}
            />
          ))}

          {hoy && (
            <span
              className={estilos.hoy}
              style={
                {
                  "--posicion": pct(posicionEnEje(hoy, EJE.inicio, EJE.fin)),
                } as React.CSSProperties
              }
            />
          )}
        </div>

        <div className={estilos.etiquetas}>
          {anclas.map((a, i) => (
            <span
              key={a.id}
              className={[
                estilos.etiqueta,
                // Alternadas en dos filas para que las anclas vecinas no se
                // pisen; ver ReglaDeTiempo.module.css.
                i % 2 === 1 ? estilos.filaBaja : "",
                a.critica ? estilos.etiquetaCritica : "",
              ]
                .filter(Boolean)
                .join(" ")}
              style={{ left: posicionAncla(a.fecha) }}
            >
              {formatoFechaCorta(a.fecha)} · {a.etiqueta}
            </span>
          ))}
        </div>

        <p className={estilos.pie}>
          <span>
            <Cifra>ago 2026</Cifra>
          </span>
          <span className={estilos.hoyTexto}>
            {hoy && (
              <>
                hoy · <Cifra>{formatoFecha(isoLocal(hoy))}</Cifra>
              </>
            )}
          </span>
          <span>
            <Cifra>sep 2027</Cifra>
          </span>
        </p>
      </div>
    </div>
  );
}
