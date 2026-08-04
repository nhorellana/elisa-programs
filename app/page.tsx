"use client";

import Link from "next/link";
import { Cifra } from "@/components/Cifra";
import { preguntas } from "@/data/preguntas";
import { bloqueantes } from "@/data/requisitos";
import { APERTURA_UCL, hitos } from "@/data/roadmap";
import { aFecha, diasHasta, formatoFecha } from "@/lib/formato";
import { useEstado, useHoy } from "@/lib/useEstado";
import estilos from "./page.module.css";

// Panorama. El objetivo de la primera versión: que abras el sitio y entiendas
// en diez segundos en qué estás (handoff §1).

export default function Panorama() {
  const { estado, hidratado } = useEstado();
  const hoy = useHoy();

  const dias = hoy ? diasHasta(APERTURA_UCL, hoy) : null;

  const tramoActual = hoy
    ? hitos.find((h) => aFecha(h.desde) <= hoy && hoy <= aFecha(h.hasta ?? h.desde))
    : undefined;

  const sinResolver = preguntas.filter(
    (p) => !estado.preguntas[p.id]?.respuesta?.trim(),
  ).length;

  return (
    <main className="envoltura">
      {/* El héroe visual de esta pantalla es la cuenta regresiva, no un título.
          Pero el documento igual necesita un h1, así que va para lectores de
          pantalla nada más. */}
      <h1 className="solo-lectores">Panorama</h1>

      <div className={estilos.cuenta}>
        <div className={`${estilos.dias} ${dias === null ? estilos.diasVacio : ""}`}>
          {dias === null ? "000" : dias > 0 ? dias : 0}
        </div>
        <div className={estilos.cuentaTexto}>
          <p>
            <strong>
              {dias === null || dias > 0
                ? "días hasta que abran las postulaciones de UCL"
                : "ya abrieron las postulaciones de UCL"}
            </strong>
            El <Cifra>{formatoFecha(APERTURA_UCL)}</Cifra>. La evaluación es
            rolling: postular temprano importa de verdad.
          </p>
        </div>
      </div>

      <div className={estilos.rejilla}>
        <div>
          <section className={estilos.bloque}>
            <div className={estilos.bloqueTitulo}>
              <h2>Lo que te bloquea</h2>
              <Link href="/requisitos">Ver todos los requisitos</Link>
            </div>
            <ul className={estilos.lista}>
              {bloqueantes.map((r) => {
                // Antes de leer localStorage no se pinta ningún estado: mostrar
                // "te falta" y corregirlo un instante después sería peor que
                // esperar un frame.
                const hecho = hidratado && estado.requisitos[r.id]?.hecho;
                return (
                  <li key={r.id}>
                    <span className={estilos.itemTitulo}>
                      <span className={hecho ? "hecho" : undefined}>{r.titulo}</span>
                      <span className={estilos.itemDetalle}>{r.detalle}</span>
                    </span>
                    {hidratado && (
                      <span className={`tag ${hecho ? "tag-neutral" : "tag-alerta"}`}>
                        {hecho ? "listo" : "te falta"}
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>

          <section className={estilos.bloque}>
            <div className={estilos.bloqueTitulo}>
              <h2>En lo que estás ahora</h2>
              <Link href="/roadmap">Ver la línea completa</Link>
            </div>
            {tramoActual ? (
              <ul className={estilos.ahora}>
                {tramoActual.detalle.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            ) : (
              <p className="text-muted">
                {hoy ? "Hoy cae fuera de la línea de tiempo del proceso." : " "}
              </p>
            )}
          </section>
        </div>

        <section className={estilos.bloque}>
          <div className={estilos.bloqueTitulo}>
            <h2>Vacíos sin resolver</h2>
          </div>
          <div className={estilos.vacios}>
            <span className={estilos.vaciosNumero}>{hidratado ? sinResolver : " "}</span>
            <span className="text-muted">
              de <Cifra>{preguntas.length}</Cifra> preguntas
            </span>
          </div>
          <p className={estilos.vaciosNota}>
            Son los datos que todavía no tienes y que cambian la decisión: fees
            en disputa, equivalencias de nota, quién asigna los placements.
          </p>
          <Link className="btn btn-secondary btn-block" href="/preguntas">
            Ver las preguntas
          </Link>
        </section>
      </div>
    </main>
  );
}
