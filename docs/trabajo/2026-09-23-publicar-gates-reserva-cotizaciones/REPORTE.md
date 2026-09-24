# Reporte — Gates locales de Reserva y Cotizaciones

- Fecha: 2026-09-23 · Plan: [PLAN.md](./PLAN.md) · Rama de publicación: `justin/cerrar-validacion-coolify-cotizaciones-2026-09-23`.
- Corte verificado en `mantra-core-health`: `b7785e36` → `4c9e419f` (PR [#583](https://github.com/mdavila-2001/mantra-core-health/pull/583)).
- Avance de esta publicación: **7 / 7 — 100 %**. El avance publicado del carril original se conserva en **29 / 51 — 56.9 %**.

## Completado

| ID | Qué se logró | Evidencia | Resultado |
|---|---|---|---|
| H1.S1.M1 | Contrastar los rojos globales con el cambio de #583 | [gates-locales.md](evidencia/gates-locales.md) | Los cuatro archivos que fallan en la suite completa no están en `git diff --name-only b7785e36 4c9e419f`. |
| H1.S1.M2 | Ejecutar gates estáticos y tests del foco | [gates-locales.md](evidencia/gates-locales.md) | lint de los 7 TypeScript y 2 plantillas del diff `0`; `typecheck` exit `0`; 7 archivos y 73 tests focales pasan. |
| H2.S1.M1 | Construir la aplicación | [gates-locales.md](evidencia/gates-locales.md) | `corepack yarn build` terminó con exit `0`; sus advertencias de presupuesto y prerender no impidieron el build. |
| H2.S1.M2 | Probar el recorrido de navegador en una instancia fresca | [gates-locales.md](evidencia/gates-locales.md) | Playwright pasó 2/2: Cotizaciones no expone documentos personales y Directorio → Cotizaciones no produjo errores de consola ni requests. |
| H2.S1.M3 | Triage de gates globales | [gates-locales.md](evidencia/gates-locales.md) | El lint global reporta 243 reglas `prefer-on-push-component-change-detection`; la suite total conserva cuatro fallos fuera del diff. Son seguimiento, no bloqueo activo de este PR. |
| H3.S1.M1 | Publicar la evidencia reproducible | Este reporte y [gates-locales.md](evidencia/gates-locales.md) | Comandos, corte, alcance y límites quedan trazables. |
| H3.S1.M2 | Enlazar los dailies | [daily de Justin](../../../repartos/2026-09-22/PromptNoche/Justin/Justin-Daily-Noche-2026-09-22.md) y [daily de equipo](../../../repartos/2026-09-22/PromptNoche/Daily-Noche-2026-09-22.md) | Los dos registros diferencian evidencia focal verde de deuda global y mantienen `29 / 51`. |

## A medias

- Lint global: 243 errores de `@angular-eslint/prefer-on-push-component-change-detection`; los 7 TypeScript y 2 plantillas del diff de #583 dan cero en lint, por lo que esos rojos no se adjudican a este cambio.
- Suite completa: 4 archivos fallan y 573 pasan; esos cuatro archivos no pertenecen al diff de #583. Se requiere su dueño y triage propio, no una corrección oportunista desde este carril.

No hay bloqueos activos: los gates focalizados necesarios para #583 están verdes y la deuda global queda declarada como seguimiento `A MEDIAS`.

## Pendiente

| Seguimiento del carril original | Estado | Qué falta para cerrarlo |
|---|---|---|
| Medición antes/después del directorio y reserva | `A MEDIAS` | Línea base histórica comparable y recorrido instrumentado repetido. |
| Precios, procedencia y acción de negocio para Cotizaciones (Q-16) | `DECISION_REQUIRED` | Fuente y decisión explícita de Negocio; no se inventa precio ni procedencia. |
| Capturas por tema/viewport y barridos de todo el producto | `A MEDIAS` | Ejecutar los DoD de regresión amplia y adjuntar la evidencia. |
| Lint y suite global | `A MEDIAS` | Triage y propiedad de los rojos heredados, separados de los cambios nuevos. |

## No cubierto

- No se modificó el frontend ni se creó un PR de producto: el corte #583 ya estaba fusionado y los gates focales no hallaron regresión.
- No se ejecutó `mockup-click-sweep` ni un barrido general: escriben artefactos y exceden el carril de Justin.
- No se afirma integración con API real; la validación remota anterior sigue siendo contra el doble del mockup, documentada en el [cierre remoto](../2026-09-23-cerrar-validacion-remota-cotizaciones/REPORTE.md).

## Desvíos del plan

Ninguno. La prueba de navegador se ejecutó sobre un servidor fresco del worktree de #583, no sobre una instancia de desarrollo previa que podía contener código distinto.

## Riesgos residuales

- Los cuatro fallos de suite total y los 243 de lint global deben recibir triage de sus responsables antes de considerar el repositorio enteramente verde.
- La cobertura de navegador se limita a Cotizaciones y al recorrido Directorio → Cotizaciones; no sustituye regresión de todos los roles y rutas.

## Decisiones y ambigüedades

- `A MEDIAS` y `DECISION_REQUIRED` no se usan como sinónimo de bloqueo. No impiden integrar documentación ni continuar con el contrato simulado declarado.
- Se conserva `29 / 51`: verificar gates no adjudica nuevas microtareas del carril original.
- Este PR de PromptManager sigue dirigido a `main`; no se fusiona automáticamente.
