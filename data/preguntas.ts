import type { Pregunta } from "./tipos";

// Los vacíos por resolver (handoff §5). Cada uno tiene un campo de texto en
// /preguntas para pegar la respuesta cuando llegue.
//
// El contador de vacíos sin resolver del Panorama sale de acá.

// Resueltas y sacadas de la lista, porque ya no son vacíos: el fee de Reading
// (£31.650) y el de Greenwich (£17.450) quedaron confirmados y viven en
// data/programas.ts. Si alguna se reabre, vuelve acá.
export const preguntas: Pregunta[] = [
  {
    id: "quien-asigna-placement",
    pregunta:
      "¿El placement de CAMH y el de Greenwich lo asigna el programa o lo consigue la estudiante?",
    porQueImporta:
      "Conseguir un placement clínico propio en UK siendo extranjera es difícil. En DPCP lo asigna el programa; si en estos dos no, el peso práctico real es bastante menor al que aparenta.",
    afecta: ["kcl-camh", "greenwich-cap"],
  },
  {
    id: "equivalencia-65",
    pregunta: "¿Un 5.9/7 chileno satisface el 65% que pide KCL en DPP?",
    porQueImporta:
      "UCL publica su equivalencia para Chile (2:1 = 5.5/7); KCL no. Sin esto no se sabe si DPP es alcanzable.",
    afecta: ["kcl-dpp"],
  },
  {
    id: "proyecto-empirico-reading",
    pregunta:
      "¿El proyecto empírico del pregrado satisface el requisito de Reading?",
    porQueImporta:
      "Es condición de entrada, no un plus. Si no califica, Reading se cae de la lista.",
    afecta: ["reading-tpcp"],
  },
  {
    id: "camh-otros-ioppn",
    pregunta:
      "¿Un postulante no seleccionado en CAMH es considerado automáticamente para otros MSc del IoPPN?",
    porQueImporta:
      "Si lo es, postular a CAMH cubre también parte del riesgo de DPP. Si no, son dos postulaciones separadas.",
    afecta: ["kcl-camh", "kcl-dpp"],
  },
];
