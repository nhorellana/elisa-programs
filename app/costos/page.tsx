"use client";

import { Cifra, PorConfirmar } from "@/components/Cifra";
import { ESCENARIO_ANNA_FREUD, FONDOS, VISA } from "@/data/costos";
import { programas } from "@/data/programas";
import type { Programa } from "@/data/tipos";
import { duracionTexto, feeTotal, formatoCLP, formatoGBP } from "@/lib/formato";
import { useEstado } from "@/lib/useEstado";
import estilos from "./costos.module.css";

// Comparación de escenarios, no una lista de precios (handoff §5).

/** Años de visa: la visa cubre el programa completo, redondeando hacia arriba. */
const aniosVisa = (p: Programa) => Math.ceil(p.duracionMeses / 12);

const costoVisa = (p: Programa) => VISA.solicitudGBP + VISA.ihsAnualGBP * aniosVisa(p);

export default function Costos() {
  const { estado, hidratado, fijarTipoCambio } = useEstado();
  const tipoCambio = estado.tipoCambio;

  // Mientras no se haya leído localStorage no se muestran pesos: aparecerían
  // con el valor por defecto y cambiarían solos un instante después.
  const enPesos = (gbp: number) => (hidratado ? formatoCLP(gbp * tipoCambio) : null);

  return (
    <main className="envoltura">
      <div className="seccion-titulo">
        <h1>Costos</h1>
        <p>
          Lo que cuesta cada camino, no una lista de precios. La diferencia real
          está entre los programas de dos años y los de uno.
        </p>
      </div>

      <div className={estilos.cambio}>
        <div className={`field ${estilos.campoCambio}`}>
          <label htmlFor="tipo-cambio">Tipo de cambio GBP → CLP</label>
          <input
            id="tipo-cambio"
            className="input cifra"
            type="number"
            min={1}
            step={1}
            value={hidratado ? tipoCambio : ""}
            disabled={!hidratado}
            onChange={(e) => {
              const n = Number(e.target.value);
              if (Number.isFinite(n) && n > 0) fijarTipoCambio(n);
            }}
          />
        </div>
        <p className={estilos.cambioNota}>
          El número que decide está en pesos. Ajústalo cuando se mueva y todas
          las cifras de abajo se recalculan.
        </p>
      </div>

      <div className={estilos.marco}>
        <table className={`table ${estilos.tabla}`}>
          <thead>
            <tr>
              <th scope="col">Programa</th>
              <th scope="col">Matrícula</th>
              <th scope="col">Visa + IHS</th>
              <th scope="col">Fondos a acreditar</th>
              <th scope="col">Total</th>
            </tr>
          </thead>
          <tbody>
            {programas.map((p) => {
              const matricula = feeTotal(p);
              const visa = costoVisa(p);
              const total = matricula === null ? null : matricula + visa + FONDOS.totalGBP;

              return (
                <tr key={p.id}>
                  <td className={`inst inst-${p.institucion}`}>
                    <span className={estilos.programa}>
                      {p.sigla ?? p.nombre}
                      <span className={estilos.duracion}>
                        <span className={`tag tag-inst inst-${p.institucion}`}>
                          {p.institucion}
                        </span>{" "}
                        {duracionTexto(p.duracionMeses)}
                      </span>
                    </span>
                  </td>
                  <td>
                    {matricula === null ? (
                      <PorConfirmar />
                    ) : (
                      <>
                        <Cifra>{formatoGBP(matricula)}</Cifra>
                        <span className={estilos.enPesos}>
                          {enPesos(matricula) && <Cifra>{enPesos(matricula)}</Cifra>}
                        </span>
                        {!p.feeConfirmado && <PorConfirmar>sin confirmar</PorConfirmar>}
                      </>
                    )}
                  </td>
                  <td>
                    <Cifra>{formatoGBP(visa)}</Cifra>
                    <span className={estilos.enPesos}>
                      <Cifra>{aniosVisa(p)}</Cifra> {aniosVisa(p) === 1 ? "año" : "años"} de IHS
                    </span>
                  </td>
                  <td>
                    <Cifra>{formatoGBP(FONDOS.totalGBP)}</Cifra>
                    <span className={estilos.enPesos}>
                      <Cifra>{FONDOS.mesesMaximos}</Cifra> meses
                    </span>
                  </td>
                  <td className={estilos.total}>
                    {total === null ? (
                      <PorConfirmar />
                    ) : (
                      <>
                        <Cifra>{formatoGBP(total)}</Cifra>
                        <span className={estilos.enPesos}>
                          {enPesos(total) && <Cifra>{enPesos(total)}</Cifra>}
                        </span>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <section className={estilos.bloque}>
        <h2>Lo que cuesta igual en todos</h2>
        <ul className={estilos.fijos}>
          <li>
            <span>
              Solicitud de visa
              <span className={estilos.fijoDetalle}>Pago único.</span>
            </span>
            <Cifra>{formatoGBP(VISA.solicitudGBP)}</Cifra>
          </li>
          <li>
            <span>
              Immigration Health Surcharge
              <span className={estilos.fijoDetalle}>
                Por cada año de visa. Da acceso al NHS.
              </span>
            </span>
            <Cifra>{formatoGBP(VISA.ihsAnualGBP)}</Cifra>
          </li>
          <li>
            <span>
              Acreditación de fondos
              <span className={estilos.fijoDetalle}>
                <Cifra>{formatoGBP(FONDOS.mensualGBP)}</Cifra> mensuales por hasta{" "}
                <Cifra>{FONDOS.mesesMaximos}</Cifra> meses, tarifa de Londres.
              </span>
            </span>
            <Cifra>{formatoGBP(FONDOS.totalGBP)}</Cifra>
          </li>
        </ul>
        <p className={estilos.nota}>
          Los fondos no son una tarifa: es plata que tienes que demostrar que
          tienes y que después se va en vivir. Aparece en el total porque
          igualmente hay que reunirla antes de viajar. Reading está fuera de
          Londres y la cifra que le corresponde es menor, pero no la tienes
          confirmada todavía.
        </p>
      </section>

      <section className={estilos.bloque}>
        <h2>El escenario Anna Freud</h2>
        <p className={estilos.nota}>
          Los dos programas de UCL, que son los de dos años, salen entre{" "}
          <Cifra>{formatoGBP(ESCENARIO_ANNA_FREUD.minGBP)}</Cifra> y{" "}
          <Cifra>{formatoGBP(ESCENARIO_ANNA_FREUD.maxGBP)}</Cifra> todo incluido —
          matrícula, visa y vida. Es entre tres y cinco veces lo que cuesta
          Greenwich. Son también los dos con el placement más fuerte y el riesgo
          más alto.
        </p>
      </section>
    </main>
  );
}
