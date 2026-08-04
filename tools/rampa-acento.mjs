// Deriva la rampa 100–900 del acento nuevo (#2F4858).
//
// No basta copiar las L de Modernist: su acento (#ec3013, L 0.61) es mucho más
// claro que el azul pizarra (L 0.39). Copiando la escala tal cual, el paso 600
// —el que styles.css usa para :hover— quedaría MÁS CLARO que el acento y los
// estados se invertirían en un fondo claro.
//
// En vez de eso se fija una escala de L propia que coloca el azul pizarra en la
// misma POSICIÓN RELATIVA que ocupa el rojo en su rampa —entre los pasos 500 y
// 600— y comprime el extremo oscuro para dejarle sitio a :hover y :active por
// debajo del acento. Así los estados siguen oscureciendo, que es lo que pide el
// readme del sistema.
//
// Los valores que imprime están pegados en app/globals.css. Correr con:
//   node tools/rampa-acento.mjs

const srgbToLinear = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const linearToSrgb = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);

function hexToOklch(hex) {
  const r = srgbToLinear(parseInt(hex.slice(1, 3), 16) / 255);
  const g = srgbToLinear(parseInt(hex.slice(3, 5), 16) / 255);
  const b = srgbToLinear(parseInt(hex.slice(5, 7), 16) / 255);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  return { L, C: Math.hypot(A, B), h: (Math.atan2(B, A) * 180) / Math.PI };
}

function oklchToHex(L, C, hDeg) {
  const h = (hDeg * Math.PI) / 180;
  const A = C * Math.cos(h);
  const B = C * Math.sin(h);
  const l = (L + 0.3963377774 * A + 0.2158037573 * B) ** 3;
  const m = (L - 0.1055613458 * A - 0.0638541728 * B) ** 3;
  const s = (L - 0.0894841775 * A - 1.291485548 * B) ** 3;
  const rgb = [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
  return (
    '#' +
    rgb
      .map((v) => {
        const n = Math.round(Math.min(1, Math.max(0, linearToSrgb(v))) * 255);
        return n.toString(16).padStart(2, '0');
      })
      .join('')
  );
}

// Contraste WCAG, para verificar los pares que styles.css realmente arma.
const lum = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => srgbToLinear(parseInt(hex.slice(i, i + 2), 16) / 255));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};

const modernist = ['#fff2ef', '#ffe0d9', '#ffc4b8', '#ff9783', '#ff563c', '#dd2b0f', '#ae1800', '#7c1405', '#4d170e'];
const pasos = [100, 200, 300, 400, 500, 600, 700, 800, 900];
const Cs = modernist.map((h) => hexToOklch(h).C);

const slate = hexToOklch('#2F4858');
const rojo = hexToOklch('#ec3013');

// Escala de L explícita. Un remapeo afín de la escala de Modernist manda L900 a
// negativo (el azul pizarra es demasiado oscuro para esa fracción) y los pasos
// oscuros se saturan a negro. Estos valores comprimen el extremo oscuro para
// dejar sitio a :hover y :active por debajo del acento, y colocan el acento
// entre 500 y 600 — la misma posición que ocupa el rojo en Modernist.
const Lnuevas = [0.97, 0.9, 0.78, 0.61, 0.43, 0.345, 0.275, 0.22, 0.175];

// El croma conserva el perfil de Modernist (pico al medio, apagado en los
// extremos) escalado a la sobriedad del azul pizarra.
const escalaC = slate.C / rojo.C;

console.log(`acento L ${slate.L.toFixed(3)} · croma escalado ×${escalaC.toFixed(3)} · hue ${slate.h.toFixed(1)}\n`);

const rampa = modernist.map((_, i) => oklchToHex(Lnuevas[i], Cs[i] * escalaC, slate.h));
rampa.forEach((hex, i) => console.log(`  --color-accent-${pasos[i]}: ${hex};`));

const idx = (p) => pasos.indexOf(p);
console.log('\nVerificación de los pares que styles.css arma:');
console.log(`  .btn-primary  texto --color-bg #f3f2f2 sobre acento #2F4858 → ${ratio('#f3f2f2', '#2F4858').toFixed(2)}:1`);
console.log(`  :hover  600 ${rampa[idx(600)]} debe ser más oscuro que el acento → L ${hexToOklch(rampa[idx(600)]).L.toFixed(3)} vs ${slate.L.toFixed(3)}`);
console.log(`  :active 700 ${rampa[idx(700)]} más oscuro aún → L ${hexToOklch(rampa[idx(700)]).L.toFixed(3)}`);
console.log(`  .tag-accent  800 ${rampa[idx(800)]} sobre 100 ${rampa[idx(100)]} → ${ratio(rampa[idx(800)], rampa[idx(100)]).toFixed(2)}:1`);
console.log(`  enlaces  acento #2F4858 sobre fondo #f3f2f2 → ${ratio('#2F4858', '#f3f2f2').toFixed(2)}:1`);
console.log(`  alerta   #9E3B2E sobre fondo #f3f2f2 → ${ratio('#9E3B2E', '#f3f2f2').toFixed(2)}:1`);

console.log('\nMonotonía (cada paso debe oscurecer):',
  Lnuevas.every((L, i) => i === 0 || L < Lnuevas[i - 1]) ? 'ok' : 'ROTA');
console.log(`Acento entre 500 y 600: ${Lnuevas[4] > slate.L && slate.L > Lnuevas[5] ? 'ok' : 'NO'}`);
console.log(`\n  --color-alerta: #9E3B2E;`);
console.log(`  --color-alerta-tinte: ${oklchToHex(0.96, hexToOklch('#9E3B2E').C * 0.22, hexToOklch('#9E3B2E').h)};`);
