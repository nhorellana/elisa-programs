// Costos que no dependen del programa (handoff §5, sección Costos).
// Estos números también son datos: van acá, no en el JSX de /costos.

export const VISA = {
  solicitudGBP: 558,
  /** Immigration Health Surcharge, por año de visa. */
  ihsAnualGBP: 776,
};

/**
 * Acreditación de fondos para la visa: hay que probar que tienes con qué vivir.
 * La cifra es la de Londres.
 */
export const FONDOS = {
  mensualGBP: 1529,
  mesesMaximos: 9,
  get totalGBP() {
    return this.mensualGBP * this.mesesMaximos;
  },
};

/** Estimación del handoff para el escenario Anna Freud (los dos de UCL). */
export const ESCENARIO_ANNA_FREUD = {
  minGBP: 100000,
  maxGBP: 110000,
};

/**
 * Tipo de cambio inicial GBP → CLP. Es solo el valor de partida: Elisa lo edita
 * en /costos y queda guardado en localStorage. El número que decide está en
 * pesos, no en libras.
 */
export const TIPO_CAMBIO_INICIAL = 1250;
