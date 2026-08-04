import type { Requisito } from "./tipos";

// Checklist transversal (handoff §5). No es por programa: es la lista de cosas
// que hay que tener. Cada ítem indica a qué programas aplica.
//
// Los tres `bloqueante: true` son los que salen en el Panorama. Son los únicos
// que pueden pintarse con --color-alerta.

export const requisitos: Requisito[] = [
  {
    id: "titulo-notas",
    titulo: "Título profesional y concentración de notas",
    detalle: "Con traducción oficial.",
    aplicaA: "todos",
  },
  {
    id: "ielts",
    titulo: "IELTS Academic",
    detalle:
      "7.0 general y 6.5 por banda. El puntaje vale 2 años, así que rendirlo demasiado pronto tampoco sirve.",
    aplicaA: "todos",
    bloqueante: true,
  },
  {
    id: "personal-statements",
    titulo: "Personal statements",
    detalle:
      "Uno por programa, no reciclado. Son seis textos distintos, no seis copias del mismo.",
    aplicaA: "todos",
    bloqueante: true,
  },
  {
    id: "referencias",
    titulo: "Dos referencias",
    detalle:
      "Idealmente una académica y una de supervisión con niños. Conviene avisarles con tiempo.",
    aplicaA: "todos",
    bloqueante: true,
  },
  {
    id: "cv",
    titulo: "CV con las horas de experiencia con niños desglosadas",
    detalle:
      "Desglosadas, no resumidas: varios programas evalúan la cantidad de horas.",
    aplicaA: "todos",
  },
  {
    id: "inventario",
    titulo: "Inventario de experiencia con niños",
    detalle:
      "El insumo del CV y de los statements: dónde, cuándo, cuántas horas y con qué supervisión.",
    aplicaA: "todos",
  },
  {
    id: "pasaporte",
    titulo: "Pasaporte con validez que cubra 2027-2029",
    detalle: "Si vence antes, se renueva ahora y no en medio del trámite de visa.",
    aplicaA: "todos",
  },
  {
    id: "antecedentes",
    titulo: "Certificado de antecedentes apostillado + DBS",
    detalle:
      "UCL cubre el DBS; tú pagas la verificación de identidad y el chequeo policial de tu país.",
    aplicaA: "todos",
    postOferta: true,
  },
  {
    id: "tarifa-ucl",
    titulo: "£90 de tarifa por postulación en UCL",
    detalle: "Se paga al enviar cada postulación a UCL.",
    aplicaA: ["ucl-ecdca", "ucl-dpcp"],
  },
];

/** Los tres del Panorama. */
export const bloqueantes = requisitos.filter((r) => r.bloqueante);
