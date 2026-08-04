"use client";

import { useMemo, useState } from "react";
import { Cifra, PorConfirmar } from "@/components/Cifra";
import { programas } from "@/data/programas";
import type { Programa } from "@/data/tipos";
import { duracionTexto, feeTotal, formatoGBP } from "@/lib/formato";
import { useEstado } from "@/lib/useEstado";
import estilos from "./programas.module.css";

// Dos vistas del mismo dato (handoff §5): el comparador de los seis en paralelo
// y la ficha que se abre en la misma tabla.

type Columna = "nombre" | "institucion" | "duracion" | "costo" | "requisito" | "peso";

const columnas: { id: Columna; etiqueta: string }[] = [
  { id: "nombre", etiqueta: "Programa" },
  { id: "institucion", etiqueta: "Institución" },
  { id: "duracion", etiqueta: "Duración" },
  { id: "costo", etiqueta: "Costo" },
  { id: "requisito", etiqueta: "Requisito" },
  { id: "peso", etiqueta: "Práctica" },
];

function valorDe(p: Programa, col: Columna): string | number {
  switch (col) {
    case "nombre":
      return p.nombre;
    case "institucion":
      return p.institucion;
    case "duracion":
      return p.duracionMeses;
    case "costo":
      // Los fees sin confirmar no tienen cifra comparable. Se mandan al final
      // en vez de tratarlos como cero, que los pondría arriba como si fueran
      // los más baratos.
      return feeTotal(p) ?? Number.POSITIVE_INFINITY;
    case "requisito":
      return p.requisitoAcademico;
    case "peso":
      return p.pesoPractico;
  }
}

export default function Programas() {
  const { estado, alternarDescarte } = useEstado();
  // Por institución: UCL y KCL tienen dos programas cada una y comparten reglas
  // de postulación, así que agrupadas es como se leen mejor (handoff §5).
  const [orden, setOrden] = useState<{ col: Columna; asc: boolean }>({
    col: "institucion",
    asc: true,
  });
  const [abierto, setAbierto] = useState<string | null>(null);

  // No hace falta condicionar por hidratación: durante ese render el almacén
  // devuelve el estado inicial, cuyo arreglo vacío es una referencia estable.
  const descartados = estado.programasDescartados;

  const visibles = useMemo(() => {
    const lista = programas.filter((p) => !descartados.includes(p.id));
    return [...lista].sort((a, b) => {
      const va = valorDe(a, orden.col);
      const vb = valorDe(b, orden.col);
      const cmp =
        typeof va === "number" && typeof vb === "number"
          ? va - vb
          : String(va).localeCompare(String(vb), "es");
      return orden.asc ? cmp : -cmp;
    });
  }, [orden, descartados]);

  function ordenarPor(col: Columna) {
    setOrden((prev) => (prev.col === col ? { col, asc: !prev.asc } : { col, asc: true }));
  }

  return (
    <main className="envoltura">
      <div className="seccion-titulo">
        <h1>Programas</h1>
        <p>
          Los seis en paralelo. Toca cualquier fila para abrir la ficha completa,
          o cualquier encabezado para reordenar.
        </p>
      </div>

      <div className={estilos.marco}>
        <table className={`table ${estilos.tabla}`}>
          <thead>
            <tr>
              {columnas.map((c) => (
                <th key={c.id} scope="col" aria-sort={
                  orden.col === c.id ? (orden.asc ? "ascending" : "descending") : "none"
                }>
                  <button type="button" onClick={() => ordenarPor(c.id)}>
                    {c.etiqueta}
                    <span className={estilos.flecha} aria-hidden="true">
                      {orden.col === c.id ? (orden.asc ? "▲" : "▼") : ""}
                    </span>
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibles.map((p) => {
              const total = feeTotal(p);
              const estaAbierto = abierto === p.id;
              return (
                <FilaPrograma
                  key={p.id}
                  programa={p}
                  total={total}
                  abierto={estaAbierto}
                  onAlternar={() => setAbierto(estaAbierto ? null : p.id)}
                  onDescartar={() => {
                    alternarDescarte(p.id);
                    setAbierto(null);
                  }}
                />
              );
            })}
          </tbody>
        </table>
      </div>

      {descartados.length > 0 && (
        <div className={estilos.descartados}>
          <span>
            <Cifra>{descartados.length}</Cifra>{" "}
            {descartados.length === 1 ? "programa oculto" : "programas ocultos"} del
            comparador.
          </span>
          {descartados.map((id) => {
            const p = programas.find((x) => x.id === id);
            if (!p) return null;
            return (
              <button
                key={id}
                type="button"
                className="btn btn-ghost"
                onClick={() => alternarDescarte(id)}
              >
                Devolver {p.sigla ?? p.institucion}
              </button>
            );
          })}
        </div>
      )}
    </main>
  );
}

function FilaPrograma({
  programa: p,
  total,
  abierto,
  onAlternar,
  onDescartar,
}: {
  programa: Programa;
  total: number | null;
  abierto: boolean;
  onAlternar: () => void;
  onDescartar: () => void;
}) {
  return (
    <>
      <tr className={estilos.filaPrograma}>
        {/* La regla vertical de la institución va en la celda: es agrupación
            real, no decoración (handoff §5). */}
        <td className={`inst inst-${p.institucion}`}>
          {/* El control es solo el nombre, no la fila entera: así se llega con
              teclado sin convertir cada celda en un botón. */}
          <button
            type="button"
            className={estilos.botonNombre}
            onClick={onAlternar}
            aria-expanded={abierto}
          >
            <span className={estilos.nombre}>
              {p.nombre}
              {p.sigla && <span className={estilos.sigla}>{p.sigla}</span>}
            </span>
            {p.sede && <span className={estilos.sede}>{p.sede}</span>}
          </button>
        </td>
        <td>
          <span className={`tag tag-inst inst-${p.institucion}`}>{p.institucion}</span>
        </td>
        <td>
          <Cifra>{duracionTexto(p.duracionMeses)}</Cifra>
        </td>
        <td>
          {total === null ? (
            <PorConfirmar />
          ) : (
            <>
              <Cifra>{formatoGBP(total)}</Cifra>
              {p.feePorAnio && (
                <span className={estilos.feeAnual}>
                  <Cifra>{formatoGBP(p.feeOverseasGBP as number)}</Cifra> por año
                </span>
              )}
              {!p.feeConfirmado && (
                <span className={estilos.feeAnual}>
                  <PorConfirmar>sin confirmar</PorConfirmar>
                </span>
              )}
            </>
          )}
        </td>
        <td className={estilos.requisitoCelda}>{p.requisitoAcademico}</td>
        <td>
          <Cifra>{p.pesoPractico}/5</Cifra>
        </td>
      </tr>

      {abierto && (
        <tr className={estilos.fichaFila}>
          <td colSpan={6}>
            <div className={estilos.ficha}>
              <div>
                <div className={estilos.bloqueFicha}>
                  <h3>Enfoque</h3>
                  <p>{p.enfoque}</p>
                </div>

                <div className={estilos.bloqueFicha}>
                  <h3>Placement</h3>
                  <p>{p.placement.descripcion}</p>
                  <dl className={estilos.definiciones}>
                    <dt>Obligatorio</dt>
                    <dd>
                      {p.placement.obligatorio === null ? (
                        <PorConfirmar />
                      ) : p.placement.obligatorio ? (
                        "Sí"
                      ) : (
                        "No, es opcional"
                      )}
                    </dd>
                    <dt>Quién lo asigna</dt>
                    <dd>
                      {p.placement.asignadoPorPrograma === null ? (
                        <PorConfirmar />
                      ) : p.placement.asignadoPorPrograma ? (
                        "El programa"
                      ) : (
                        "Lo consigues tú"
                      )}
                    </dd>
                  </dl>
                </div>

                {p.notas.length > 0 && (
                  <div className={estilos.bloqueFicha}>
                    <h3>Notas</h3>
                    <ul className={estilos.notas}>
                      {p.notas.map((n) => (
                        <li key={n}>{n}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div>
                <div className={estilos.bloqueFicha}>
                  <h3>Requisitos</h3>
                  <dl className={estilos.definiciones}>
                    <dt>Académico</dt>
                    <dd>{p.requisitoAcademico}</dd>
                    <dt>Experiencia</dt>
                    <dd>
                      {p.requisitoExperiencia ?? (
                        <span className="text-muted">No exige experiencia previa.</span>
                      )}
                    </dd>
                    <dt>Inglés</dt>
                    <dd>{p.ingles ?? <PorConfirmar />}</dd>
                  </dl>
                </div>

                {/* El riesgo salió del comparador, pero sigue siendo un dato
                    real del programa: vive acá, dentro de la ficha. */}
                <div className={estilos.bloqueFicha}>
                  <h3>Riesgo</h3>
                  <dl className={estilos.definiciones}>
                    <dt>Probabilidad de no obtener oferta</dt>
                    <dd>{p.riesgo}</dd>
                  </dl>
                </div>

                <div className={estilos.accionesFicha}>
                  <a
                    className="btn btn-primary"
                    href={p.urlOficial}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    Página oficial
                  </a>
                  <button type="button" className="btn btn-secondary" onClick={onDescartar}>
                    Sacar del comparador
                  </button>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
