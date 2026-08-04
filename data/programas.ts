import type { Programa } from "./tipos";

// Los seis programas. Datos verificados a agosto 2026 según el handoff §4.
//
// Para actualizar un fee o un requisito se edita ACÁ y se redespliega. No hay
// editor dentro de la interfaz y no debe haberlo (handoff §8).
//
// Lo que el handoff §4 no especifica va como `null` → "por confirmar" en
// pantalla. No se completa a ojo ni se deduce: un dato inventado acá es una
// decisión equivocada más adelante.

export const programas: Programa[] = [
  {
    id: "ucl-ecdca",
    nombre: "Early Child Development and Clinical Applications, MSc",
    sigla: "ECDCA",
    institucion: "UCL",
    sede: "Anna Freud, King's Cross",
    duracionMeses: 24,
    feeOverseasGBP: 39200,
    feePorAnio: true,
    feeConfirmado: true,
    requisitoAcademico:
      "2:1 o equivalente. Para Chile, UCL fija el 2:1 en 5.5/7 y el 2:2 en 5.0/7.",
    requisitoExperiencia: null,
    ingles: "UCL Nivel 2 — IELTS 7.0 general, mínimo 6.5 en cada banda.",
    enfoque:
      "Predominantemente psicoanalítico. Comprensión multi-perspectiva del desarrollo temprano y de la práctica clínica en primeros años. Tiene vínculos con IPCAPA y con el doctorado UCL en psicoterapia psicoanalítica infanto-juvenil.",
    placement: {
      existe: true,
      obligatorio: null,
      asignadoPorPrograma: null,
      descripcion:
        "Supervisado, típicamente en el NHS, en servicios clínicos de Anna Freud o en organizaciones externas. Además, observación de infantes en contexto familiar durante los dos años.",
    },
    pesoPractico: 4,
    riesgo: "alto",
    urlOficial:
      "https://www.ucl.ac.uk/prospective-students/graduate/taught-degrees/early-child-development-and-clinical-applications-msc",
    notas: [
      "270 créditos: once módulos obligatorios en el año 1; tres módulos más research paper en el año 2.",
      "El ciclo anterior aceptó postulaciones del 20 oct 2025 al 1 jun 2026, con cierre a las 5pm hora UK.",
    ],
  },
  {
    id: "ucl-dpcp",
    nombre: "Developmental Psychology and Clinical Practice, MSc",
    sigla: "DPCP",
    institucion: "UCL",
    sede: "Anna Freud",
    duracionMeses: 24,
    feeOverseasGBP: 39200,
    feePorAnio: true,
    feeConfirmado: true,
    requisitoAcademico: "2:1 en Psicología.",
    requisitoExperiencia:
      "Experiencia relevante con niños. UCL cuenta voluntariado, prácticas de pregrado, entrevistar niños en investigación y cuidado infantil.",
    ingles: "UCL Nivel 2 — IELTS 7.0 general, mínimo 6.5 en cada banda.",
    enfoque:
      "Ecléctico: psicología cognitiva, CBT, teoría sistémica, psicología comunitaria, psicoanálisis y neurociencia.",
    placement: {
      existe: true,
      obligatorio: true,
      asignadoPorPrograma: true,
      descripcion:
        "El más fuerte de los seis. El año 2 completo en un equipo CAMHS, 2-3 días por semana, en servicios comunitarios o especializados (pediátricos, escolares, social care, neurodesarrollo), con supervisión de clínicos experimentados. La asignación la hace el programa, para estudiantes locales y extranjeros por igual: no tienes que conseguir tu propio placement.",
    },
    pesoPractico: 5,
    riesgo: "alto",
    urlOficial:
      "https://www.ucl.ac.uk/prospective-students/graduate/taught-degrees/developmental-psychology-and-clinical-practice-msc",
    notas: ["Alrededor de 20 cupos al año."],
  },
  {
    id: "kcl-camh",
    nombre: "Child & Adolescent Mental Health, MSc",
    sigla: "CAMH",
    institucion: "KCL",
    sede: "IoPPN",
    duracionMeses: 12,
    feeOverseasGBP: 37000,
    feePorAnio: false,
    feeConfirmado: false,
    requisitoAcademico: "Mínimo 2:1.",
    requisitoExperiencia:
      "Un año full-time de experiencia postgrado trabajando con niños o adolescentes con problemas de salud mental. Este es el filtro real del programa.",
    ingles: null,
    enfoque:
      "Clínico-psiquiátrico. Áreas especializadas incluyendo CBT, Therapeutic Assessment para autolesión y Kiddie-SADS. Mismo sitio que el Maudsley y el King's College Hospital.",
    placement: {
      existe: true,
      obligatorio: null,
      asignadoPorPrograma: null,
      descripcion: "Hay un rango amplio de placements clínicos disponibles.",
    },
    pesoPractico: 4,
    riesgo: "alto",
    urlOficial:
      "https://www.kcl.ac.uk/study/postgraduate-taught/courses/child-and-adolescent-mental-health-msc",
    notas: [
      "El fee de ~£37.000 no está confirmado con la universidad.",
      "Falta confirmar si el placement es garantizado o está sujeto a disponibilidad.",
      "El riesgo alto viene de la experiencia exigida, no de la nota.",
    ],
  },
  {
    id: "kcl-dpp",
    nombre: "Developmental Psychology & Psychopathology, MSc",
    sigla: "DPP",
    institucion: "KCL",
    sede: "IoPPN",
    duracionMeses: 12,
    feeOverseasGBP: 37368,
    feePorAnio: false,
    feeConfirmado: true,
    requisitoAcademico: "2:1 alto, con nota final igual o superior a 65%.",
    requisitoExperiencia: null,
    ingles: null,
    enfoque:
      "El más cercano a lo perinatal en contenido. Cubre salud mental parental durante el embarazo y el postparto y su impacto en el desarrollo infantil; autismo, TDAH, trastornos de conducta y alimentarios, ansiedad y depresión; factores genéticos y ambientales. Métodos avanzados, incluyendo genética estadística y diseños familiares.",
    placement: {
      existe: true,
      obligatorio: false,
      asignadoPorPrograma: null,
      descripcion: "Opcional, junto con módulos electivos y tesis.",
    },
    pesoPractico: 2,
    riesgo: "medio",
    urlOficial:
      "https://www.kcl.ac.uk/study/postgraduate-taught/courses/developmental-psychology-psychopathology-msc",
    notas: [
      "Falta confirmar si un 5.9/7 chileno satisface el 65% que pide el programa.",
      'KCL publica las tasas de oferta por programa (application-to-offer rates) en la sección "Discover more" de cada MSc.',
    ],
  },
  {
    id: "reading-tpcp",
    nombre: "Theory and Practice in Clinical Psychology, MSc",
    institucion: "Reading",
    duracionMeses: 12,
    feeOverseasGBP: 31650,
    feePorAnio: false,
    feeConfirmado: true,
    requisitoAcademico:
      "2:1 en psicología, con proyecto empírico completado durante el pregrado. Entrevista obligatoria para la vía con Clinical Placement.",
    requisitoExperiencia:
      "No exige experiencia clínica previa. Sí experiencia práctica, voluntaria o remunerada, en contexto comunitario, clínico o clínico-académico — por ejemplo, niños con necesidades educativas especiales en colegios.",
    ingles: "IELTS 7.0, ningún componente bajo 6.5.",
    enfoque:
      "Clínico transversal por edad, no especializado en niñez. Problemas de salud mental comunes a lo largo del ciclo vital y tratamientos basados en evidencia.",
    placement: {
      existe: true,
      obligatorio: null,
      asignadoPorPrograma: null,
      descripcion:
        "Extendido, en la School of Psychology and Clinical Language Sciences o con socios clínicos, con supervisión y entrenamiento.",
    },
    pesoPractico: 4,
    riesgo: "medio",
    urlOficial:
      "https://www.reading.ac.uk/ready-to-study/study/subject-area/psychology-pg/msc-theory-and-practice-in-clinical-psychology",
    notas: [
      "Está fuera de Londres: los costos de vida son sustancialmente menores.",
      "Para la admisión 2026 la vía con Clinical Placement cerró antes que la de Research Placement. Se llena temprano.",
    ],
  },
  {
    id: "greenwich-cap",
    nombre: "Child and Adolescent Psychology, MSc",
    institucion: "Greenwich",
    sede: "Londres",
    duracionMeses: 12,
    feeOverseasGBP: 17450,
    feePorAnio: true,
    feeConfirmado: true,
    requisitoAcademico:
      "2:2 o superior en Psicología acreditada por la BPS, o 2:2 en área relevante más una evaluación de métodos de investigación.",
    requisitoExperiencia: null,
    ingles: null,
    enfoque:
      "100% infanto-juvenil. Aplicación de teoría a contextos reales, proyecto de investigación sustancial, tres módulos electivos y formación en estadística avanzada.",
    placement: {
      existe: true,
      obligatorio: null,
      asignadoPorPrograma: null,
      descripcion: "Incluido, pero sin detalle público del alcance.",
    },
    pesoPractico: 3,
    riesgo: "bajo",
    urlOficial: "https://www.gre.ac.uk/postgraduate-courses/eduhea/childadolpsych",
    notas: [
      "El fee es el del primer año: es el único programa de la lista que cobra por año siendo de doce meses.",
      "El peso práctico 3/5 es una estimación: no hay detalle público del placement.",
      "No otorga Graduate Basis for Chartered Membership (GBC) de la BPS, requerido para las formaciones acreditadas en UK. Es irrelevante para ejercer en Chile; importa solo si alguna vez quisieras quedarte.",
    ],
  },
];

export const porId = (id: string) => programas.find((p) => p.id === id);
