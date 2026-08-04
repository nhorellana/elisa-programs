"use client";

import { useEstado } from "@/lib/useEstado";
import { isoLocal } from "@/lib/formato";

// Un solo navegador, sin respaldo: si limpia el caché, pierde todo. Un botón
// que descarga el estado es la red de seguridad completa (handoff §6).
// Por eso va visible en el pie, no escondido en un menú.

export function ExportarJSON() {
  const { estado, hidratado } = useEstado();

  function descargar() {
    const blob = new Blob([JSON.stringify(estado, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `postgrados-uk-${isoLocal(new Date())}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <button
      type="button"
      className="btn btn-secondary"
      onClick={descargar}
      disabled={!hidratado}
    >
      Descargar respaldo
    </button>
  );
}
