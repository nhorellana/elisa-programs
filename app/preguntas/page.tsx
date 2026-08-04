"use client";

import { Cifra } from "@/components/Cifra";
import { preguntas } from "@/data/preguntas";
import { porId } from "@/data/programas";
import { useEstado } from "@/lib/useEstado";
import estilos from "./preguntas.module.css";

// Los vacíos por resolver. Cada uno con un campo para pegar la respuesta
// cuando llegue (handoff §5).

export default function Preguntas() {
  const { estado, hidratado, responder } = useEstado();

  const sinResolver = preguntas.filter(
    (p) => !estado.preguntas[p.id]?.respuesta?.trim(),
  ).length;

  return (
    <main className="envoltura">
      <div className="seccion-titulo">
        <h1>Preguntas abiertas</h1>
        <p>
          Lo que todavía no sabes y que cambia la decisión. Cuando consigas una
          respuesta, pégala acá.
        </p>
      </div>

      <div className={estilos.contador}>
        <span className={estilos.contadorNumero}>{hidratado ? sinResolver : " "}</span>
        <span className="text-muted">
          sin resolver, de <Cifra>{preguntas.length}</Cifra>
        </span>
      </div>

      <ul className={estilos.lista}>
        {preguntas.map((p) => {
          const respuesta = hidratado ? (estado.preguntas[p.id]?.respuesta ?? "") : "";
          const resuelta = respuesta.trim().length > 0;

          return (
            <li key={p.id} className={estilos.item}>
              <div className={estilos.encabezado}>
                <h2 className={`${estilos.pregunta} ${resuelta ? "hecho" : ""}`}>
                  {p.pregunta}
                </h2>
                {hidratado && resuelta && <span className="tag tag-neutral">respondida</span>}
              </div>

              <p className={estilos.porQue}>{p.porQueImporta}</p>

              <div className={estilos.afecta}>
                {p.afecta.map((id) => {
                  const prog = porId(id);
                  if (!prog) return null;
                  return (
                    <span key={id} className={`tag tag-inst inst-${prog.institucion}`}>
                      {prog.sigla ?? prog.nombre}
                    </span>
                  );
                })}
              </div>

              <div className={`field ${estilos.campo}`}>
                <label htmlFor={`resp-${p.id}`}>Respuesta</label>
                <textarea
                  id={`resp-${p.id}`}
                  className="input"
                  rows={3}
                  placeholder="Pega acá lo que te respondan, con la fecha y quién te lo dijo."
                  value={respuesta}
                  disabled={!hidratado}
                  onChange={(e) => responder(p.id, e.target.value)}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
