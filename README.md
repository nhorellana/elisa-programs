# Postgrados UK

Sitio de seguimiento de las postulaciones de Elisa a seis másters de psicología
en Reino Unido, para la admisión de septiembre 2027.

Usuaria única. Sin backend, sin base de datos, sin cuentas. Todo el estado vive
en el `localStorage` de un solo navegador.

La especificación completa está en `handoff-web-postgrados.md`. Cuando este
README y el handoff no coincidan, manda el handoff.

## Correr

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # export estático en out/
npm run lint
```

`next.config.ts` fija `output: 'export'`, así que `npm run build` deja el sitio
entero como HTML/CSS/JS en `out/`. No hay servidor que desplegar.

## Cómo actualizar los datos

**Los datos de los programas no se escriben en JSX.** Todo lo editable vive en
`data/`:

| Archivo | Qué tiene |
| --- | --- |
| `data/programas.ts` | Los seis programas: fees, requisitos, placements, notas |
| `data/requisitos.ts` | El checklist transversal |
| `data/roadmap.ts` | Los tramos de la línea de tiempo y las fechas ancladas |
| `data/preguntas.ts` | Los vacíos por resolver |
| `data/costos.ts` | Visa, IHS, acreditación de fondos |
| `data/tipos.ts` | Los tipos de todo lo anterior |

Para cambiar un fee se edita `data/programas.ts` y se redespliega. No hay editor
dentro de la interfaz, y no debe haberlo.

**`null` significa "por confirmar" y se muestra como tal.** No lo reemplaces por
una estimación: los huecos de información son parte del contenido. Si tienes una
cifra pero la universidad no la confirmó, deja la cifra y pon
`feeConfirmado: false`.

## Diseño

El sistema visual es **Modernist**, bajado de claude.ai/design
(`d06f920d-bf55-4671-89d2-6dd68ae32331`).

- `styles/modernist.css` es la copia del design system. **No se edita.** Se puede
  volver a bajar entera. La única diferencia con el original es que se le quitó
  el `@import` de Google Fonts, porque las fuentes las auto-hospeda `next/font`
  (`app/fuentes.ts`) y así el sitio no le pide nada a Google.
- `app/globals.css` es la capa de override: redefine los tokens que el handoff
  §7 exige y agrega las pocas clases propias del sitio. Ningún hexadecimal
  suelto debería vivir fuera de ese archivo.

Modernist trae rojo como acento; acá el acento es azul pizarra `#2F4858` y el
rojo queda reservado para bloqueantes y fechas críticas. La rampa 100–900 del
acento se deriva en OKLCH:

```bash
npm run rampa    # imprime la rampa y verifica los contrastes
```

Si alguna vez cambia el acento, se corre eso y se pegan los valores en
`app/globals.css`. La escala está construida para que el acento caiga entre los
pasos 500 y 600, que es lo que hace que `:hover` (600) y `:active` (700) sigan
oscureciendo en un fondo claro.

## Respaldo

No hay sincronización ni servidor: si se limpia el caché del navegador, se
pierde todo lo marcado. El botón **Descargar respaldo** del pie exporta el
estado completo a JSON. Es la única red de seguridad que hay.

La clave de `localStorage` es `postgrados-uk-v1`. El `version: 1` del objeto
existe para poder migrar más adelante sin perder datos.
