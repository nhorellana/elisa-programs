import { ExportarJSON } from "./ExportarJSON";
import estilos from "./Pie.module.css";

export function Pie() {
  return (
    <footer className={estilos.pie}>
      <div className={`envoltura ${estilos.contenido}`}>
        <p className={estilos.nota}>
          Todo lo que marcas se guarda solo en este navegador. Si limpias el
          caché, se pierde. Descarga un respaldo de vez en cuando.
        </p>
        <ExportarJSON />
      </div>
    </footer>
  );
}
