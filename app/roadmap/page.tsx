"use client";

import { hitos } from "@/data/roadmap";
import { aFecha } from "@/lib/formato";
import { useHoy } from "@/lib/useEstado";
import estilos from "./roadmap.module.css";

// La línea de tiempo completa. Marca visualmente la posición actual (handoff §5).

export default function Roadmap() {
  // null durante la hidratación: el HTML sale del build y no puede traer la
  // fecha del navegador horneada.
  const hoy = useHoy();

  return (
    <main className="envoltura">
      <div className="seccion-titulo">
        <h1>Roadmap</h1>
        <p>
          De agosto de 2026 al inicio de clases, en septiembre de 2027. Lo que
          decide el resultado se concentra en los primeros cuatro meses.
        </p>
      </div>

      <ol className={estilos.linea}>
        {hitos.map((h) => {
          const fin = aFecha(h.hasta ?? h.desde);
          const inicio = aFecha(h.desde);
          const esActual = hoy ? inicio <= hoy && hoy <= fin : false;
          const esPasado = hoy ? fin < hoy : false;

          return (
            <li
              key={h.id}
              className={`${estilos.tramo} ${esActual ? estilos.actual : ""} ${
                esPasado ? estilos.pasado : ""
              }`}
              aria-current={esActual ? "step" : undefined}
            >
              <div>
                <h2 className={estilos.titulo}>{h.titulo}</h2>
                {esActual && <span className={estilos.marcaActual}>estás aquí</span>}
              </div>
              <ul className={estilos.detalle}>
                {h.detalle.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            </li>
          );
        })}
      </ol>
    </main>
  );
}
