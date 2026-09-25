# Plan — Publicar el daily de la noche del 2026-09-25 (Justin)

- Fecha: 2026-09-25 (redactado el 2026-09-25) · Rama: `justin/daily-noche-2026-09-25`
- Repo: `AlovidaPromptManager` · Base: `origin/main` @ `b16ecdd`

## Por qué existe este trabajo

El trabajo de la noche del 2026-09-25 se ejecutó y se publicó **en el repo del front**
(`mdavila-2001/mantra-core-health`): cinco PRs, los cinco mergeados contra `mockup`. Pero el
seguimiento del equipo se mira en **este** repo, y acá el daily de Justin quedó en la plantilla
del reparto, con `AVANCE COMBINADO: 0 / 109 — 0,0 %`, los checkboxes vacíos y las tablas en
blanco. Itzan y Pablo sí publicaron los suyos. Resultado: desde este repo el carril de Justin se
lee como si no se hubiera hecho nada.

Esto es una **brecha de publicación, no de ejecución**. Este trabajo la cierra.

## Alcance

Documentar. **No se toca código de ningún repo, ni se reabre ningún carril.**

Archivos que se escriben, y ninguno más:

| Archivo | Qué se hace |
|---|---|
| `repartos/2026-09-25/PromptNoche/Justin/Justin-Daily-Noche-2026-09-25.md` | Se llena con los resultados reales. La estructura del reparto se conserva |
| `docs/trabajo/2026-09-25-justin-daily-noche/PLAN.md` | Este archivo |
| `docs/trabajo/2026-09-25-justin-daily-noche/REPORTE.md` | Reporte de esta publicación |
| `ActionLog.md` | Una entrada arriba |

## De dónde sale cada número (regla 1.2 — no inventar)

Ningún dato de este daily se estima. Todos salen de artefactos ya publicados y verificables:

| Fuente | Qué aporta |
|---|---|
| `docs/trabajo/2026-09-25-justin-pantalla/{PLAN,REPORTE}.md` del front | Carga masiva: 60/68 y el estado de las 68 microtareas una por una |
| `docs/trabajo/2026-09-25-justin-farmacia-tienda/REPORTE.md` del front | Farmacia: 33/41, desvíos, riesgos |
| `docs/trabajo/2026-09-25-encuentro-clinico/c{4,6,8}/REPORTE.md` del front | C4 10/12 · C6 6/9 · C8 7/10 |
| `gh pr list --repo mdavila-2001/mantra-core-health` | Número, base, estado y hora de merge de los 5 PRs |

El desglose por hito del Carril B se reconstruyó microtarea por microtarea desde el `PLAN.md` de
ese carril y **cuadra exactamente** con el total que declara su `REPORTE.md` (60 HECHO · 2
PENDIENTE · 3 A MEDIAS · 3 DESCARTADO = 68). El del Carril A cuadra igual contra su 33/41.

## Microtareas

| ID | Qué | DoD |
|---|---|---|
| M1 | Reunir los 5 reportes y el estado real de los PRs | Los cinco avances y las cinco horas de merge, citados |
| M2 | Reconstruir el desglose por hito de los carriles A y B | La suma por hito da exactamente el total del `REPORTE.md` |
| M3 | Llenar el daily conservando la estructura del reparto | Ninguna celda de resultado queda en blanco sin motivo escrito |
| M4 | `REPORTE.md` con el avance en la primera línea | `head -1` lo muestra |
| M5 | Entrada en `ActionLog.md`, arriba | Entrada nueva primera |
| M6 | PR contra `main`, demostrado mergeable con `gh` | `mergeable: MERGEABLE`, no draft |

## Lo que este trabajo NO hace, a propósito

- **No corrige avances.** Lo que quedó `A MEDIAS` o `BLOQUEADO` se publica como tal. `A MEDIAS`
  cuenta como no hecha (regla 50 §5).
- **No declara nada verificado que no lo esté.** Los peldaños se copian de cada reporte, incluido
  el `UNKNOWN` visual de la noche del Carril B y la ausencia total de navegador en el Carril A.
- **No reabre las microtareas pendientes** ni promete fechas para ellas.
