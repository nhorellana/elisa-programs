// Tipos de los datos del sitio.
//
// Regla dura del handoff §3: los datos de los programas no se escriben en JSX.
// La lista de seis va a cambiar — pueden salir programas, entrar otros, y
// varios campos hoy están sin confirmar. Si actualizar un fee obliga a editar
// un componente, el sitio se abandona en tres semanas.
//
// `null` significa "por confirmar" y se RENDERIZA como tal, nunca como campo
// vacío. Los huecos de información son parte del contenido: saber qué no se
// sabe es útil.

export type Institucion = "UCL" | "KCL" | "Reading" | "Greenwich";

export type Riesgo = "alto" | "medio" | "bajo";

export type Programa = {
  id: string;
  /** Nombre oficial, en inglés — así es como los va a buscar. */
  nombre: string;
  sigla?: string;
  institucion: Institucion;
  sede?: string;
  duracionMeses: number;
  /** null = por confirmar. */
  feeOverseasGBP: number | null;
  /** true si el fee es anual, no total. */
  feePorAnio: boolean;
  /**
   * Desviación del esquema del handoff §3, añadida a propósito: de los seis
   * programas, tres traen el fee marcado con ⚠️ en el handoff §4 — hay cifra,
   * pero la universidad no la confirmó. Sin este campo habría que elegir entre
   * borrar el dato (perdiéndolo) o mostrarlo como si estuviera firme
   * (mintiendo). Con él se muestra la cifra Y la advertencia.
   */
  feeConfirmado: boolean;
  requisitoAcademico: string;
  requisitoExperiencia: string | null;
  /**
   * El handoff §3 lo tipa como `string`, pero el §4 no da el requisito de
   * inglés de KCL ni de Greenwich. Se amplía a nullable en vez de inventar el
   * dato o codificar "no se sabe" como un string mágico.
   */
  ingles: string | null;
  /** 2-3 frases. */
  enfoque: string;
  placement: {
    existe: boolean;
    obligatorio: boolean | null;
    /** null = por confirmar. */
    asignadoPorPrograma: boolean | null;
    descripcion: string;
  };
  /** 5 = máxima carga clínica supervisada. */
  pesoPractico: 1 | 2 | 3 | 4 | 5;
  /** Probabilidad de no obtener oferta. */
  riesgo: Riesgo;
  urlOficial: string;
  /** Advertencias y condicionantes. */
  notas: string[];
};

/** Ítem del checklist transversal. No es por programa: es una cosa que hacer. */
export type Requisito = {
  id: string;
  titulo: string;
  detalle: string;
  /** "todos", o los ids de los programas a los que aplica. */
  aplicaA: "todos" | string[];
  /**
   * Los tres bloqueantes del Panorama: sin esto no se postula.
   * Es lo único que puede pintarse con --color-alerta.
   */
  bloqueante?: boolean;
  /** Se hace después de recibir una oferta, no antes de postular. */
  postOferta?: boolean;
};

/** Tramo de la línea de tiempo. */
export type Hito = {
  id: string;
  /** ISO. */
  desde: string;
  /** ISO. Si falta, el tramo dura hasta el inicio del siguiente. */
  hasta?: string;
  titulo: string;
  detalle: string[];
};

/** Fecha dura que se ancla en la regla de tiempo del header. */
export type Ancla = {
  id: string;
  fecha: string;
  etiqueta: string;
  /** Pinta con --color-alerta. Recurso escaso. */
  critica?: boolean;
};

/** Un vacío por resolver. La respuesta la pega Elisa cuando llegue. */
export type Pregunta = {
  id: string;
  pregunta: string;
  porQueImporta: string;
  /** Programas a los que afecta. */
  afecta: string[];
};
