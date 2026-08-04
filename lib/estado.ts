import { TIPO_CAMBIO_INICIAL } from "@/data/costos";

// Todo el estado del sitio en una sola clave de localStorage, versionada para
// poder migrar sin perder datos (handoff §6).
//
// Un solo navegador, una sola usuaria. No hay sincronización y no hay que
// construirla.

export const CLAVE = "postgrados-uk-v1";

export type Estado = {
  version: 1;
  requisitos: Record<
    string,
    {
      hecho: boolean;
      /** ISO: cuándo se marcó. */
      fecha?: string;
      nota?: string;
    }
  >;
  preguntas: Record<string, { respuesta: string }>;
  /** GBP → CLP. */
  tipoCambio: number;
  /** ids ocultos del comparador. */
  programasDescartados: string[];
};

export const estadoInicial: Estado = {
  version: 1,
  requisitos: {},
  preguntas: {},
  tipoCambio: TIPO_CAMBIO_INICIAL,
  programasDescartados: [],
};

/**
 * Lo que salga de localStorage es texto que pudo escribir cualquier versión
 * anterior del sitio (o quedar a medio escribir). Se valida campo por campo y
 * lo que no calce se reemplaza por el valor inicial, en vez de confiar en el
 * JSON.parse y explotar en el render.
 */
export function normalizar(crudo: unknown): Estado {
  if (typeof crudo !== "object" || crudo === null) return estadoInicial;
  const o = crudo as Record<string, unknown>;

  const requisitos: Estado["requisitos"] = {};
  if (typeof o.requisitos === "object" && o.requisitos !== null) {
    for (const [id, v] of Object.entries(o.requisitos as Record<string, unknown>)) {
      if (typeof v !== "object" || v === null) continue;
      const item = v as Record<string, unknown>;
      requisitos[id] = {
        hecho: item.hecho === true,
        ...(typeof item.fecha === "string" ? { fecha: item.fecha } : {}),
        ...(typeof item.nota === "string" ? { nota: item.nota } : {}),
      };
    }
  }

  const preguntas: Estado["preguntas"] = {};
  if (typeof o.preguntas === "object" && o.preguntas !== null) {
    for (const [id, v] of Object.entries(o.preguntas as Record<string, unknown>)) {
      if (typeof v !== "object" || v === null) continue;
      const item = v as Record<string, unknown>;
      if (typeof item.respuesta === "string") {
        preguntas[id] = { respuesta: item.respuesta };
      }
    }
  }

  const tipoCambio =
    typeof o.tipoCambio === "number" && Number.isFinite(o.tipoCambio) && o.tipoCambio > 0
      ? o.tipoCambio
      : TIPO_CAMBIO_INICIAL;

  const programasDescartados = Array.isArray(o.programasDescartados)
    ? o.programasDescartados.filter((x): x is string => typeof x === "string")
    : [];

  return { version: 1, requisitos, preguntas, tipoCambio, programasDescartados };
}

export function leer(): Estado {
  try {
    const crudo = window.localStorage.getItem(CLAVE);
    if (!crudo) return estadoInicial;
    return normalizar(JSON.parse(crudo));
  } catch {
    // localStorage puede estar bloqueado (modo privado, permisos) o el JSON
    // corrupto. El sitio sigue funcionando, solo que sin recordar nada.
    return estadoInicial;
  }
}

export function escribir(estado: Estado): void {
  try {
    window.localStorage.setItem(CLAVE, JSON.stringify(estado));
  } catch {
    // Sin espacio o sin permiso. No hay nada útil que hacer acá y romper el
    // render sería peor que perder el guardado.
  }
}
