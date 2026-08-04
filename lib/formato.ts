import type { Programa } from "@/data/tipos";

// Formato de cifras y fechas. Todo lo que devuelve algo numérico se renderiza
// dentro de <Cifra>, que le pone la monoespaciada (handoff §7).

// `narrowSymbol` es lo que da "£31.650". Sin eso, es-CL escribe el código de la
// moneda —"GBP 31.650"— que ocupa más, se lee peor y no es como se habla de
// estos montos en ningún lado.
const gbp = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "GBP",
  currencyDisplay: "narrowSymbol",
  maximumFractionDigits: 0,
});

const clp = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
  maximumFractionDigits: 0,
});

export const formatoGBP = (n: number) => gbp.format(n);
export const formatoCLP = (n: number) => clp.format(n);

/** Fee total del programa: los de dos años cobran por año. */
export function feeTotal(p: Programa): number | null {
  if (p.feeOverseasGBP === null) return null;
  return p.feePorAnio
    ? p.feeOverseasGBP * (p.duracionMeses / 12)
    : p.feeOverseasGBP;
}

export function duracionTexto(meses: number): string {
  if (meses % 12 === 0) {
    const anios = meses / 12;
    return anios === 1 ? "1 año" : `${anios} años`;
  }
  return `${meses} meses`;
}

const fechaLarga = new Intl.DateTimeFormat("es-CL", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

const fechaCorta = new Intl.DateTimeFormat("es-CL", {
  day: "numeric",
  month: "short",
  timeZone: "UTC",
});

/**
 * Las fechas del sitio son días calendario ("20 de octubre de 2026"), no
 * instantes. Se parsean y formatean en UTC para que no se corran un día según
 * la zona horaria del navegador.
 */
export const aFecha = (iso: string) => new Date(`${iso}T00:00:00Z`);

export const formatoFecha = (iso: string) => fechaLarga.format(aFecha(iso));
export const formatoFechaCorta = (iso: string) => fechaCorta.format(aFecha(iso));

/**
 * Fecha del calendario LOCAL en formato ISO. `toISOString()` no sirve para
 * esto: convierte a UTC, y en Chile eso adelanta el día durante buena parte de
 * la tarde. "Hoy" tiene que ser el día que la usuaria ve en su reloj.
 */
export const isoLocal = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;

/** Días calendario entre hoy y una fecha ISO. Negativo si ya pasó. */
export function diasHasta(iso: string, hoy: Date): number {
  const objetivo = aFecha(iso).getTime();
  const inicioDeHoy = Date.UTC(
    hoy.getFullYear(),
    hoy.getMonth(),
    hoy.getDate(),
  );
  return Math.round((objetivo - inicioDeHoy) / 86_400_000);
}

/** Posición 0–1 de una fecha dentro del eje de la línea de tiempo. */
export function posicionEnEje(fecha: Date, desde: string, hasta: string): number {
  const a = aFecha(desde).getTime();
  const b = aFecha(hasta).getTime();
  return Math.min(1, Math.max(0, (fecha.getTime() - a) / (b - a)));
}
