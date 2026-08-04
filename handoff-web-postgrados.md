# Handoff — Sitio de seguimiento de postulaciones a postgrados UK

## 1. Qué es esto

Un sitio estático de uso personal para **Elisa**, que está postulando a seis programas de máster en psicología en Reino Unido para la admisión de **septiembre 2027**.

Hoy la información vive dispersa en conversaciones y pestañas del navegador. El sitio existe para que ella tenga un solo lugar donde ver: qué programas están en la lista, qué le falta a cada uno, qué viene después y cuándo.

**Usuaria única: Elisa.** No es un panel de administración ni un reporte para terceros. Toda la copy va en **español, en segunda persona** ("tu postulación", "te falta"), salvo los nombres propios de los programas y las universidades, que van en inglés porque así los va a buscar. Nada de lenguaje de dashboard corporativo.

**Objetivo de la primera versión:** que abra el sitio, entienda en diez segundos en qué está, y pueda marcar una cosa como hecha.

---

## 2. Stack y despliegue

- **Next.js** con `output: 'export'` (export estático, sin servidor).
- **Sin backend, sin base de datos, sin autenticación.**
- Todo el estado en `localStorage`. Un solo navegador, una sola usuaria — no hay sincronización y no hay que construirla.
- **Tailwind** para estilos (o CSS modules si preferís; no hay preferencia fuerte).
- Deploy a **Vercel**.
- Sin analytics, sin cookies, sin tracking.

**Trampa conocida de Next + localStorage:** leer `localStorage` durante el render inicial rompe la hidratación. Todas las lecturas van dentro de `useEffect`, con un estado inicial neutro y un flag `hydrated` para no parpadear los checkboxes al cargar.

---

## 3. Arquitectura de datos

**Regla dura: los datos de los programas no se escriben en JSX.**

La lista de seis va a cambiar — pueden salir programas, entrar otros, y varios campos hoy están sin confirmar. Si actualizar un fee obliga a editar un componente, el sitio se abandona en tres semanas.

```
/data
  programas.ts       ← los 6 programas, tipados
  requisitos.ts      ← ítems del checklist transversal
  roadmap.ts         ← hitos de la línea de tiempo
  preguntas.ts       ← vacíos por resolver
```

### Esquema de `Programa`

```ts
type Institucion = 'UCL' | 'KCL' | 'Reading' | 'Greenwich';

type Programa = {
  id: string;
  nombre: string;              // en inglés, nombre oficial
  sigla?: string;              // 'ECDCA', 'DPCP', 'CAMH', 'DPP'
  institucion: Institucion;
  sede?: string;               // 'Anna Freud, King's Cross' / 'IoPPN'
  duracionMeses: number;
  feeOverseasGBP: number | null;   // null = por confirmar
  feePorAnio: boolean;             // true si el fee es anual, no total
  requisitoAcademico: string;
  requisitoExperiencia: string | null;
  ingles: string;
  enfoque: string;                 // 2-3 frases
  placement: {
    existe: boolean;
    obligatorio: boolean | null;
    asignadoPorPrograma: boolean | null;  // null = por confirmar
    descripcion: string;
  };
  pesoPractico: 1 | 2 | 3 | 4 | 5;   // 5 = máxima carga clínica supervisada
  riesgo: 'alto' | 'medio' | 'bajo'; // probabilidad de no obtener oferta
  urlOficial: string;
  notas: string[];                    // advertencias, condicionantes
};
```

`feeOverseasGBP: null` y `asignadoPorPrograma: null` deben renderizarse visiblemente como **"por confirmar"**, no como campo vacío. Los huecos de información son parte del contenido: saber qué no se sabe es útil.

---

## 4. Contenido: los seis programas

Datos verificados a agosto 2026. Los marcados ⚠️ requieren confirmación con la universidad.

### 1. Early Child Development and Clinical Applications, MSc
- **UCL / Anna Freud** — sede King's Cross
- 2 años full-time · £39.200 **por año** (2026/27) · ~£78.400 total en matrícula
- Requisito: 2:1 o equivalente. Para Chile, UCL fija el 2:1 en **5.5/7** y el 2:2 en 5.0/7
- Inglés: UCL Nivel 2 — IELTS 7.0 general, mínimo 6.5 en cada banda
- Enfoque: predominantemente psicoanalítico. Comprensión multi-perspectiva del desarrollo temprano y práctica clínica en primeros años. Vínculos con IPCAPA y con el doctorado UCL en psicoterapia psicoanalítica infanto-juvenil
- Placement: sí, supervisado, típicamente en el NHS, servicios clínicos de Anna Freud u organizaciones externas. Más observación de infantes en contexto familiar durante dos años
- Estructura: 270 créditos — once módulos obligatorios en año 1; tres módulos más research paper en año 2
- Peso práctico: **4/5** · Riesgo: **alto**
- URL: `https://www.ucl.ac.uk/prospective-students/graduate/taught-degrees/early-child-development-and-clinical-applications-msc`
- Nota: ciclo anterior aceptó postulaciones del 20 oct 2025 al 1 jun 2026, cierre 5pm hora UK

### 2. Developmental Psychology and Clinical Practice, MSc
- **UCL / Anna Freud**
- 2 años full-time · £39.200 por año · ~£78.400 total
- Requisito: 2:1 **en Psicología** + experiencia relevante con niños. UCL cuenta voluntariado, prácticas de pregrado, entrevistar niños en investigación y cuidado infantil
- Inglés: mismo que ECDCA
- Enfoque: ecléctico — psicología cognitiva, CBT, teoría sistémica, psicología comunitaria, psicoanálisis y neurociencia
- Placement: **el más fuerte de los seis.** Año 2 completo en un equipo CAMHS, 2-3 días por semana, servicios comunitarios o especializados (pediátricos, escolares, social care, neurodesarrollo), supervisión de clínicos experimentados. **La asignación la hace el programa, para estudiantes locales y extranjeros por igual** — la estudiante no consigue su propio placement
- Peso práctico: **5/5** · Riesgo: **alto** (~20 cupos al año)
- URL: `https://www.ucl.ac.uk/prospective-students/graduate/taught-degrees/developmental-psychology-and-clinical-practice-msc`

### 3. Child & Adolescent Mental Health, MSc
- **KCL — IoPPN**
- 1 año full-time · ~£37.000 ⚠️
- Requisito: mínimo 2:1 · **más un año full-time de experiencia postgrado trabajando con niños o adolescentes con problemas de salud mental** ← este es el filtro real
- Enfoque: clínico-psiquiátrico. Áreas especializadas incluyendo CBT, Therapeutic Assessment para autolesión, Kiddie-SADS. Mismo sitio que el Maudsley y el King's College Hospital
- Placement: rango amplio de placements clínicos disponibles. ⚠️ Confirmar si es garantizado o sujeto a disponibilidad
- Peso práctico: **4/5** · Riesgo: **alto** (condicionado a la experiencia)
- URL: `https://www.kcl.ac.uk/study/postgraduate-taught/courses/child-and-adolescent-mental-health-msc`

### 4. Developmental Psychology & Psychopathology, MSc
- **KCL — IoPPN**
- 1 año full-time · £37.368
- Requisito: **2:1 alto, nota final ≥65%** ⚠️ Confirmar equivalencia de un 5.9/7 chileno
- Enfoque: el más cercano a lo perinatal en contenido. Cubre salud mental parental durante embarazo y postparto y su impacto en el desarrollo infantil; autismo, TDAH, trastornos de conducta y alimentarios, ansiedad, depresión; factores genéticos y ambientales. Métodos avanzados incluyendo genética estadística y diseños familiares
- Placement: **opcional**, junto con módulos electivos y tesis
- Peso práctico: **2/5** · Riesgo: **medio**
- URL: `https://www.kcl.ac.uk/study/postgraduate-taught/courses/developmental-psychology-psychopathology-msc`
- Nota: KCL publica las tasas de oferta por programa (application-to-offer rates) en la sección "Discover more" de cada MSc

### 5. Theory and Practice in Clinical Psychology, MSc
- **University of Reading** — fuera de Londres, costos de vida sustancialmente menores
- 12 meses · ⚠️ **fee en disputa: fuentes dan £24.000 y £30.950**
- Requisito: 2:1 en psicología, con proyecto empírico completado durante el pregrado. **Entrevista obligatoria** para la vía con Clinical Placement
- Inglés: IELTS 7.0, ningún componente bajo 6.5
- Experiencia: no exige experiencia clínica previa. Sí experiencia práctica voluntaria o remunerada en contexto comunitario, clínico o clínico-académico (ej. niños con necesidades educativas especiales en colegios)
- Enfoque: clínico transversal por edad, no especializado en niñez. Problemas de salud mental comunes a lo largo del ciclo vital y tratamientos basados en evidencia
- Placement: extendido, en la School of Psychology and Clinical Language Sciences o con socios clínicos, con supervisión y entrenamiento
- Peso práctico: **4/5** · Riesgo: **medio**
- URL: `https://www.reading.ac.uk/ready-to-study/study/subject-area/psychology-pg/msc-theory-and-practice-in-clinical-psychology`
- **Nota importante:** para admisión 2026 la vía con Clinical Placement cerró antes que la de Research Placement. Se llena temprano

### 6. Child and Adolescent Psychology, MSc
- **University of Greenwich** — Londres
- 12 meses · ≈£17.450 primer año ⚠️
- Requisito: 2:2 o superior en Psicología acreditada por la BPS, **o** 2:2 en área relevante más una evaluación de métodos de investigación
- Enfoque: 100% infanto-juvenil. Aplicación de teoría a contextos reales, proyecto de investigación sustancial, tres módulos electivos, formación en estadística avanzada
- Placement: sí, incluido. ⚠️ Sin detalle público del alcance
- Peso práctico: **3/5** ⚠️ · Riesgo: **bajo**
- URL: `https://www.gre.ac.uk/postgraduate-courses/eduhea/childadolpsych`
- Nota: **no otorga Graduate Basis for Chartered Membership (GBC) de la BPS**, requerido para formaciones acreditadas en UK. Irrelevante para ejercer en Chile; relevante si alguna vez quisiera quedarse

---

## 5. Las seis secciones

### Panorama (home)
Lo que hay que saber en diez segundos.
- Días hasta el **20 de octubre de 2026** (apertura de postulaciones UCL)
- Los tres bloqueantes con su estado: IELTS, personal statements, referencias
- Contador de vacíos sin resolver
- Acceso directo a lo que viene esta semana

### Programas
El corazón del sitio. Dos vistas del mismo dato:
- **Comparador:** los seis en paralelo. Columnas: institución, duración, costo, requisito, peso práctico, riesgo. Ordenable por cualquier columna.
- **Ficha:** al expandir un programa, enfoque completo, detalle del placement, requisitos desglosados, notas y link oficial.

Codificar la institución por color — es agrupación real, no decoración: UCL y KCL tienen dos programas cada una y comparten reglas de postulación.

### Requisitos
Checklist transversal, no por programa. Cada ítem indica a qué programas aplica.
- Título profesional y concentración de notas (traducción oficial)
- IELTS Academic — 7.0 general, 6.5 por banda; validez 2 años
- Personal statement — **uno por programa, no reciclado**
- Dos referencias — idealmente una académica y una de supervisión con niños
- CV con horas de experiencia con niños desglosadas
- Inventario de experiencia con niños
- Pasaporte con validez que cubra 2027-2029
- Certificado de antecedentes apostillado + DBS (post-oferta; UCL cubre el DBS, la estudiante paga la verificación de identidad y el chequeo policial de su país)
- £90 de tarifa por postulación en UCL

### Roadmap
Timeline agosto 2026 → septiembre 2027.
- **Ago 2026:** definir financiamiento · IELTS de diagnóstico · inventario de experiencia · contactar referentes
- **Sep 2026:** reservar IELTS · primer borrador de statement
- **Oct 2026:** rendir IELTS (margen para repetir) · **20 oct: abren postulaciones UCL**
- **Nov 2026:** enviar postulaciones — evaluación rolling, postular temprano importa materialmente
- **Dic 2026 – feb 2027:** entrevistas
- **Mar – may 2027:** ofertas · postulación a Becas Chile con carta de aceptación
- **Jun – jul 2027:** aceptar oferta · CAS · visa
- **Ago 2027:** alojamiento y vuelo
- **Sep 2027:** inicio

Marcar visualmente la posición actual en la línea.

### Costos
Comparación de escenarios, no una lista de precios.
- Programas de 2 años (~£78.400 en matrícula) vs. de 1 año (~£17.000–37.000)
- Visa: £558 de solicitud + £776 anuales de Immigration Health Surcharge
- Acreditación de fondos: £1.529 mensuales por hasta 9 meses = £13.761 (Londres)
- **Input editable de tipo de cambio GBP→CLP**, porque el número que decide está en pesos
- Total estimado escenario Anna Freud: £100.000–110.000

### Preguntas abiertas
Los vacíos, con campo de texto para pegar la respuesta cuando llegue.
1. Fee exacto de Reading (£24.000 vs £30.950)
2. Fee overseas de Greenwich confirmado por la universidad
3. ¿El placement de CAMH y de Greenwich lo asigna el programa o la estudiante?
4. ¿Un 5.9/7 chileno satisface el "65%" de KCL DPP?
5. ¿El proyecto empírico del pregrado satisface el requisito de Reading?
6. ¿Un postulante no seleccionado en CAMH es considerado automáticamente para otros MSc del IoPPN?

---

## 6. Estado en localStorage

Una sola clave, un solo objeto. Versionado para poder migrar sin perder datos.

```ts
type Estado = {
  version: 1;
  requisitos: Record<string, {
    hecho: boolean;
    fecha?: string;      // ISO, cuándo se marcó
    nota?: string;
  }>;
  preguntas: Record<string, { respuesta: string }>;
  tipoCambio: number;    // GBP → CLP
  programasDescartados: string[];  // ids ocultos del comparador
};
```

- Clave: `postgrados-uk-v1`
- Escritura con debounce; no en cada tecla
- **Botón de exportar a JSON**, visible. Es un solo navegador sin respaldo: si limpia el caché, pierde todo. Un botón que descarga el estado es la red de seguridad completa

---

## 7. Dirección visual

El sitio compite con la ansiedad de un proceso de postulación. Debe leerse como algo ordenado y calmado, no como un panel de métricas ni como una app de productividad con rachas y porcentajes. **Sin barras de progreso globales, sin gamificación, sin celebraciones.** Marcar algo como hecho debe sentirse como tachar una línea en papel.

**Paleta** — cuatro valores, no más:
```
--fondo:  #F2F3F0   fondo general, blanco frío
--tinta:  #16191A   texto
--tenue:  #8A8F8B   metadatos, campos por confirmar
--acento: #2F4858   azul pizarra profundo — enlaces, estado activo
--alerta: #9E3B2E   ladrillo oscuro — SOLO bloqueantes y fechas críticas
```
`--alerta` es un recurso escaso. Si aparece en más de tres lugares por pantalla, deja de significar algo.

**Tipografía** — tres roles:
- **Display:** una serif con carácter (Fraunces o similar), usada con restricción — títulos de sección y poco más
- **Cuerpo:** sans neutra y legible
- **Datos:** monoespaciada para **todas las cifras** — fees, fechas, bandas de IELTS, cuenta regresiva. Es honesto al contenido: este proceso se decide en números exactos, y tratarlos tipográficamente como tales le da al sitio su identidad

**Elemento firma: la regla de tiempo.** Una franja horizontal persistente en el header que muestra el eje completo agosto 2026 → septiembre 2027, con hoy marcado y los hitos fijos anclados. Está siempre visible, en todas las secciones. Es lo único animado del sitio: al cargar, el marcador de hoy se desliza hasta su posición. Nada más se mueve.

**Piso de calidad, sin anunciarlo:** responsive hasta mobile, foco de teclado visible, `prefers-reduced-motion` respetado.

---

## 8. Fuera de alcance

No construir en la primera versión:
- Login, backend, base de datos
- Sincronización entre dispositivos
- Notificaciones o recordatorios por correo
- Scraping o consumo automático de las páginas de las universidades
- Editor de programas dentro de la interfaz — los datos se editan en `/data` y se redespliega

El riesgo real de este proyecto no es que el sitio quede corto. Es que se convierta en un proyecto paralelo que consuma el tiempo que debería ir al IELTS y a los personal statements. Si una funcionalidad no ayuda a que Elisa postule antes o mejor, no va.
