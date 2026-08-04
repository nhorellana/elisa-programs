import { escribir, estadoInicial, leer, type Estado } from "./estado";

// Almacén del estado, fuera de React.
//
// La trampa del handoff §2 —leer localStorage en el render inicial rompe la
// hidratación— se resuelve con useSyncExternalStore, que es la herramienta que
// React trae para exactamente esto: durante la hidratación se usa el snapshot
// "de servidor" (el estado neutro, idéntico al HTML que salió del build) y
// recién después se pasa al de verdad. Sin efectos que llamen a setState, sin
// parpadeo y sin desajuste de hidratación.

const ESPERA_GUARDADO = 400;

let cache: Estado | null = null;
const oyentes = new Set<() => void>();
let temporizador: ReturnType<typeof setTimeout> | null = null;
let escuchandoSalida = false;

export function snapshot(): Estado {
  // Se lee una sola vez y se cachea: useSyncExternalStore exige que dos
  // llamadas seguidas devuelvan la MISMA referencia si nada cambió, o React
  // entra en un bucle de renders.
  if (cache === null) cache = leer();
  return cache;
}

/** Lo que ve el render de hidratación: igual al HTML generado en el build. */
export function snapshotServidor(): Estado {
  return estadoInicial;
}

export function suscribir(alCambiar: () => void): () => void {
  oyentes.add(alCambiar);

  // Si cierra la pestaña dentro de la ventana del debounce, el último cambio
  // se guarda igual.
  if (!escuchandoSalida && typeof window !== "undefined") {
    window.addEventListener("pagehide", guardarYa);
    escuchandoSalida = true;
  }

  return () => {
    oyentes.delete(alCambiar);
  };
}

function programarGuardado() {
  // Escritura con debounce, no en cada tecla (handoff §6).
  if (temporizador) clearTimeout(temporizador);
  temporizador = setTimeout(() => {
    temporizador = null;
    escribir(snapshot());
  }, ESPERA_GUARDADO);
}

function guardarYa() {
  if (!temporizador) return;
  clearTimeout(temporizador);
  temporizador = null;
  escribir(snapshot());
}

export function actualizar(cambio: (previo: Estado) => Estado): void {
  cache = cambio(snapshot());
  for (const oyente of oyentes) oyente();
  programarGuardado();
}
