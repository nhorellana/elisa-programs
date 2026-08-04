// Paleta de las cuatro instituciones.
//
// El handoff §5 pide codificar la institución por color porque es agrupación
// real: UCL y KCL tienen dos programas cada una y comparten reglas de
// postulación. Modernist es un esquema mono, así que los cuatro tonos se
// derivan acá con el mismo método del sistema —OKLCH sobre una escala de
// luminosidad compartida— en vez de elegirse a ojo. El resultado es que los
// cuatro pesan visualmente lo mismo: ninguna institución grita más que otra.
//
//   node tools/paleta-instituciones.mjs

import { contraste, hexToOklch, oklchToHex } from "./oklch.mjs";

const FONDO = "#f3f2f2";
const SUPERFICIE = "#eae9e9";

// Tonos bien separados en la rueda. UCL se queda en el azul del acento porque
// es donde están los dos programas más probables.
const instituciones = [
  { id: "UCL", hue: 245 },
  { id: "KCL", hue: 152 },
  { id: "Reading", hue: 68 },
  { id: "Greenwich", hue: 322 },
];

// Tres pasos por institución, en la misma escala de L para todas.
// El croma sube en el paso base —es el que tiene que distinguirse de un
// vistazo— y baja en el tinte, que es fondo y no debe competir con el texto.
// `C` es el croma DESEADO; abajo se recorta al que las cuatro toleran.
const pasos = [
  { nombre: "tinte", L: 0.945, C: 0.032 },
  { nombre: "base", L: 0.52, C: 0.115 },
  { nombre: "oscuro", L: 0.34, C: 0.085 },
];

/** Croma máximo que cabe en sRGB para esta L y este tono. */
function cromaMaximo(L, hue, techo) {
  let bajo = 0;
  let alto = techo;
  for (let i = 0; i < 24; i++) {
    const medio = (bajo + alto) / 2;
    if (oklchToHex(L, medio, hue).fuera) alto = medio;
    else bajo = medio;
  }
  return bajo;
}

const salida = [];

for (const paso of pasos) {
  // Un croma común para los cuatro tonos: el del más restringido. Si cada uno
  // usara su propio máximo, el amarillo saldría mucho más saturado que el azul
  // y la institución se leería como jerarquía en vez de como agrupación.
  const posible = Math.min(
    paso.C,
    ...instituciones.map((i) => cromaMaximo(paso.L, i.hue, paso.C)),
  );
  for (const inst of instituciones) {
    const { hex, fuera } = oklchToHex(paso.L, posible, inst.hue);
    salida.push({ inst: inst.id, paso: paso.nombre, hex, fuera, C: posible });
  }
}

const problemas = salida.filter((s) => s.fuera).length;

console.log("  /* Instituciones — derivadas en OKLCH, misma escala de L para las cuatro */");
for (const inst of instituciones) {
  const linea = salida
    .filter((s) => s.inst === inst.id)
    .map((s) => `--inst-${inst.id.toLowerCase()}-${s.paso}: ${s.hex};`)
    .join(" ");
  console.log(`  ${linea}`);
}

console.log("\nVerificación:");
for (const inst of instituciones) {
  const t = salida.find((s) => s.inst === inst.id && s.paso === "tinte").hex;
  const b = salida.find((s) => s.inst === inst.id && s.paso === "base").hex;
  const o = salida.find((s) => s.inst === inst.id && s.paso === "oscuro").hex;

  // Los pares que el CSS realmente arma: texto oscuro sobre el tinte del tag,
  // y la regla vertical contra los dos fondos del sistema.
  const textoEnTag = contraste(o, t);
  const reglaEnFondo = contraste(b, FONDO);
  const reglaEnSuperficie = contraste(b, SUPERFICIE);

  console.log(
    `  ${inst.id.padEnd(10)} texto/tag ${textoEnTag.toFixed(2)}:1 ${
      textoEnTag >= 4.5 ? "ok" : "BAJO"
    }   regla/fondo ${reglaEnFondo.toFixed(2)}:1 ${
      reglaEnFondo >= 3 ? "ok" : "BAJO"
    }   regla/superficie ${reglaEnSuperficie.toFixed(2)}:1 ${
      reglaEnSuperficie >= 3 ? "ok" : "BAJO"
    }`,
  );
}

// Que los cuatro pesen igual es el punto de derivarlos juntos: si un tono se
// sale de sRGB y hay que recortarlo, deja de pesar lo mismo que el resto.
console.log(`\nFuera de gama: ${problemas === 0 ? "ninguno" : problemas + " — revisar croma"}`);
for (const p of pasos) {
  const c = salida.find((s) => s.paso === p.nombre).C;
  console.log(`  croma de ${p.nombre.padEnd(7)} pedido ${p.C.toFixed(3)} → usado ${c.toFixed(3)}`);
}

const Ls = salida.filter((s) => s.paso === "base").map((s) => hexToOklch(s.hex).L);
console.log(
  `Luminosidad del paso base en las cuatro: ${Ls.map((l) => l.toFixed(3)).join(", ")}`,
);
