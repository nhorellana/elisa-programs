import type { Ancla, Hito } from "./tipos";

// Línea de tiempo agosto 2026 → septiembre 2027 (handoff §5).
//
// El eje es lo que dibuja la regla de tiempo del header, presente en todas las
// secciones. Los hitos son tramos; las anclas son fechas duras.

export const EJE = {
  inicio: "2026-08-01",
  fin: "2027-09-30",
} as const;

/** Apertura de postulaciones en UCL. El Panorama cuenta los días hasta acá. */
export const APERTURA_UCL = "2026-10-20";

export const hitos: Hito[] = [
  {
    id: "ago-2026",
    desde: "2026-08-01",
    hasta: "2026-08-31",
    titulo: "Agosto 2026",
    detalle: [
      "Definir financiamiento",
      "IELTS de diagnóstico",
      "Inventario de experiencia",
      "Contactar referentes",
    ],
  },
  {
    id: "sep-2026",
    desde: "2026-09-01",
    hasta: "2026-09-30",
    titulo: "Septiembre 2026",
    detalle: ["Reservar IELTS", "Primer borrador de statement"],
  },
  {
    id: "oct-2026",
    desde: "2026-10-01",
    hasta: "2026-10-31",
    titulo: "Octubre 2026",
    detalle: [
      "Rendir IELTS, con margen para repetir",
      "20 de octubre: abren postulaciones UCL",
    ],
  },
  {
    id: "nov-2026",
    desde: "2026-11-01",
    hasta: "2026-11-30",
    titulo: "Noviembre 2026",
    detalle: [
      "Enviar postulaciones",
      "La evaluación es rolling: postular temprano importa materialmente",
    ],
  },
  {
    id: "dic-2026-feb-2027",
    desde: "2026-12-01",
    hasta: "2027-02-28",
    titulo: "Diciembre 2026 – febrero 2027",
    detalle: ["Entrevistas"],
  },
  {
    id: "mar-may-2027",
    desde: "2027-03-01",
    hasta: "2027-05-31",
    titulo: "Marzo – mayo 2027",
    detalle: ["Ofertas", "Postulación a Becas Chile con carta de aceptación"],
  },
  {
    id: "jun-jul-2027",
    desde: "2027-06-01",
    hasta: "2027-07-31",
    titulo: "Junio – julio 2027",
    detalle: ["Aceptar oferta", "CAS", "Visa"],
  },
  {
    id: "ago-2027",
    desde: "2027-08-01",
    hasta: "2027-08-31",
    titulo: "Agosto 2027",
    detalle: ["Alojamiento y vuelo"],
  },
  {
    id: "sep-2027",
    desde: "2027-09-01",
    hasta: "2027-09-30",
    titulo: "Septiembre 2027",
    detalle: ["Inicio"],
  },
];

/**
 * Fechas duras ancladas en la regla de tiempo.
 * `critica` pinta con --color-alerta, que es recurso escaso: solo la apertura
 * de UCL lo lleva.
 */
// Las etiquetas van cortas a propósito: la regla de tiempo es una franja de
// pocos píxeles de alto y el detalle completo vive en /roadmap. Con textos
// largos, las anclas de octubre y noviembre —a 26 días una de otra en un eje de
// catorce meses— se pisan.
export const anclas: Ancla[] = [
  {
    id: "apertura-ucl",
    fecha: APERTURA_UCL,
    etiqueta: "Abren UCL",
    critica: true,
  },
  { id: "enviar", fecha: "2026-11-15", etiqueta: "Enviar" },
  { id: "ofertas", fecha: "2027-04-01", etiqueta: "Ofertas" },
  { id: "visa", fecha: "2027-07-01", etiqueta: "CAS y visa" },
  { id: "inicio", fecha: "2027-09-01", etiqueta: "Inicio" },
];
