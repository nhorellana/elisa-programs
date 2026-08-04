"use client";

import { Cifra } from "@/components/Cifra";
import { porId } from "@/data/programas";
import { requisitos } from "@/data/requisitos";
import type { Requisito } from "@/data/tipos";
import { formatoFecha } from "@/lib/formato";
import { useEstado } from "@/lib/useEstado";
import estilos from "./requisitos.module.css";

// Checklist transversal, no por programa (handoff §5). Cada ítem indica a qué
// programas aplica.

const paraPostular = requisitos.filter((r) => !r.postOferta);
const despuesDeOferta = requisitos.filter((r) => r.postOferta);

export default function Requisitos() {
  return (
    <main className="envoltura">
      <div className="seccion-titulo">
        <h1>Requisitos</h1>
        <p>
          Una sola lista para las seis postulaciones. Lo que marques queda
          guardado en este navegador.
        </p>
      </div>

      <ul className={estilos.lista}>
        {paraPostular.map((r) => (
          <Item key={r.id} requisito={r} />
        ))}
      </ul>

      <h2 className={estilos.grupoTitulo}>Después de la oferta</h2>
      <p className={estilos.grupoNota}>
        Esto no bloquea la postulación. Va acá para que no te tome por sorpresa
        más adelante.
      </p>
      <ul className={estilos.lista}>
        {despuesDeOferta.map((r) => (
          <Item key={r.id} requisito={r} />
        ))}
      </ul>
    </main>
  );
}

function Item({ requisito: r }: { requisito: Requisito }) {
  const { estado, hidratado, marcarRequisito, anotarRequisito } = useEstado();

  // Hasta que se lee localStorage el ítem se pinta desmarcado y la casilla va
  // deshabilitada. Es lo que evita que un ítem ya hecho aparezca sin marcar y
  // salte un instante después (handoff §2).
  const guardado = hidratado ? estado.requisitos[r.id] : undefined;
  const hecho = guardado?.hecho ?? false;

  return (
    <li className={estilos.item}>
      <input
        type="checkbox"
        className={estilos.casilla}
        id={`req-${r.id}`}
        checked={hecho}
        disabled={!hidratado}
        onChange={(e) => marcarRequisito(r.id, e.target.checked)}
      />
      <div>
        <label className={`${estilos.titulo} ${hecho ? "hecho" : ""}`} htmlFor={`req-${r.id}`}>
          {r.titulo}
        </label>

        <p className={estilos.detalle}>{r.detalle}</p>

        <div className={estilos.meta}>
          {r.bloqueante && !hecho && <span className="tag tag-alerta">te bloquea</span>}
          <span className={estilos.aplica}>
            {r.aplicaA === "todos" ? (
              "Aplica a los seis programas"
            ) : (
              <>
                Solo para{" "}
                {r.aplicaA
                  .map((id) => {
                    const p = porId(id);
                    return p ? (p.sigla ?? p.nombre) : id;
                  })
                  .join(" y ")}
              </>
            )}
          </span>
          {hecho && guardado?.fecha && (
            <span className={estilos.marcado}>
              marcado el <Cifra>{formatoFecha(guardado.fecha.slice(0, 10))}</Cifra>
            </span>
          )}
        </div>

        <div className={`field ${estilos.nota}`}>
          <label htmlFor={`nota-${r.id}`}>Notas</label>
          <textarea
            id={`nota-${r.id}`}
            className="input"
            rows={2}
            placeholder="Fechas, montos, con quién hablaste…"
            value={guardado?.nota ?? ""}
            disabled={!hidratado}
            onChange={(e) => anotarRequisito(r.id, e.target.value)}
          />
        </div>
      </div>
    </li>
  );
}
