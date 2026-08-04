// Toda cifra del sitio pasa por acá: fees, fechas, bandas de IELTS, cuenta
// regresiva, tipo de cambio.
//
// "Este proceso se decide en números exactos, y tratarlos tipográficamente como
// tales le da al sitio su identidad" — handoff §7.

export function Cifra({ children }: { children: React.ReactNode }) {
  return <span className="cifra">{children}</span>;
}

/**
 * Un dato que la universidad todavía no confirmó. Se muestra, no se esconde:
 * los huecos de información son parte del contenido (handoff §3).
 */
export function PorConfirmar({ children }: { children?: React.ReactNode }) {
  return <span className="por-confirmar">{children ?? "por confirmar"}</span>;
}
