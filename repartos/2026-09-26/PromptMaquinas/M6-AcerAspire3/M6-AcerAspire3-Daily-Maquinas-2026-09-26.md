# M6 · Acer Aspire 3 — daily de máquinas, 2026-09-26

> **AVANCE: 3 / 4 hitos HECHO, 1 A MEDIAS. Microtareas 13/15 HECHO.**
> **`A MEDIAS` cuenta como no hecho. `DESCARTADO` no suma: se declara aparte con su motivo.**

- **Encargo:** ver la carpeta de al lado · **Reparto:** [`Daily-Maquinas-2026-09-26.md`](../Daily-Maquinas-2026-09-26.md)
- **Estado:** `CERRADO (3/4) · A MEDIAS (1/4)` · **Peldaño:** `REGRESSION_VERIFIED` (H1, H3, H4) ·
  `VERIFIED` parcial (H2)

Datos y calidad de la suite. Los doce markdown como seeders, la suite determinista, el lint en
verde y el verificador de inglés.

## Salida de la instalación del estándar

**No se pudo instalar**: `AlovidaPromptManager/.claude/{skills,rules,hooks}` no está commiteado
en `origin/test` de `mantra-core-health` ni de `mantra-core-health-api` (el front trae 4 skills
propias, la API ninguna), y no hay script de instalación en `AlovidaPromptManager/tools/`.
Registrado como bloqueante no-detenedor (Q-04): se citaron las skills por ruta directa desde
`AlovidaPromptManager/.claude/skills/`, tal como indica el `CLAUDE.md` raíz para quien no puede
invocarlas con la herramienta `Skill`.

```text
ls .claude/skills | wc -l   → 4 (front) / 0 (API) — no las 178 del pack
ls .claude/rules/[0-9]*.md | wc -l → 0 / 0
python .claude/hooks/plan_gate.py --self-test → no existe el archivo
```

## Hitos

| ID | Hito | Estado |
|---|---|---|
| H1 | Los doce markdown se siembran solos | **HECHO** |
| H2 | La suite del front vuelve a servir como compuerta | **A MEDIAS** |
| H3 | `yarn lint` del front vuelve a exit 0 | **HECHO** |
| H4 | Un identificador nuevo en castellano falla en CI | **HECHO** |

### H1 — Los doce markdown se siembran solos (HECHO)

Corrección al propio encargo: 9 de los 10 markdown institucionales ya llegaban a la API en
`origin/test @ 016caaa1` (el encargo decía que faltaban 6). El único ausente de verdad era
`LISTA_DE_ESPECIALIDADES_ODONTOLOGICAS.md` (10 filas reales, no 14). Se agregó
`dental-specialties.dataset.json`, `source_file`/`source_row` en las 6 salidas, `lat`/`lng`/
`precision` desde las coordenadas ya derivadas por el front (nunca geocodificado de nuevo), y
`--check` + `yarn seed:datasets[:check]`. Determinismo verificado por hash (dos corridas, mismos
6 JSON byte a byte). Detalle:
`mantra-core-health-api/docs/progress/evidence/lane-m6-datos-y-calidad/REPORTE.md`.
PR: rama `marcelo/test-m6-datasets-lint` pusheada contra `origin/test` de
`mantra-core-health-api` (commits `18b1...`/`64dd522d`); **el PR no se abrió** — la política de
la sesión bloqueó la publicación automática (ver más abajo).

### H2 — La suite del front vuelve a servir como compuerta (A MEDIAS)

Medido al arrancar: dos corridas del mismo commit **crasheaban** (`Worker exited unexpectedly`,
memoria) o daban 17/11 suites rojas con conjuntos distintos.

Tres causas raíz reales encontradas y corregidas:
1. `vitest.config.ts` sin límite de hilos → `maxThreads: 4`.
2. `pharmacy-inbox.spec.ts`/`inbox-order.spec.ts` mockeaban `SessionStore` sin `userId` →
   `CartStore.effect()` reventaba async y envenenaba el worker → completados los dos dobles.
3. **El mismo patrón en 6 servicios `providedIn:'root'`** (`CartStore`,
   `TutorialProgressStore`, `HelpBlockDismissalStore`, `PatientContextService`, `IdleLogout`,
   `SessionEndedRedirect` — los dos últimos bootstrapeados en `provideAppInitializer`, así que
   CUALQUIER spec que arranque la app real los toca) leían `auth.userId()`/
   `session.isAuthenticated()` sin guarda; ~45 specs mockean `AuthService` parcial. Endurecidos
   los 6 con un accesor tolerante — cero cambio de comportamiento en producción.

Resultado: de crash/65 rojos a 11 archivos/23–26 tests rojos, estable en orden de magnitud pero
**no determinista todavía** — dos corridas seguidas siguen dando conjuntos distintos (probado
también con `singleThread: true`, que mejora la magnitud pero no cierra el problema; revertido).
Diagnóstico: hay al menos una instancia más del mismo patrón sin aislar. El rojo que SÍ es
estable (bugs reales de producto/contenido de otros carriles: ruta `questionnaires` ausente,
nav "Notas médicas" ausente, label "Evoluciones" ausente, `patient-home` con una petición HTTP
sin flushear) está explicado archivo por archivo en el reporte. Detalle completo con la tabla de
corridas y la recomendación para quien retome:
`mantra-core-health/docs/progress/evidence/lane-m6-datos-y-calidad/REPORTE-H2-H3.md`.

### H3 — `yarn lint` del front vuelve a exit 0 (HECHO)

De 144 errores de OnPush (no 244: el encargo describía sólo las 120 vistas alovida, que ya
estaban en 0; los 125 restantes eran componentes de prueba en `.spec.ts`, excluidos con el mismo
criterio que ya usan los overrides de `atoms/`/`molecules/` del propio `eslint.config.js`) + 19
mecánicos (no 8: 11 `no-empty-pattern` sin contar en el encargo), a **0**. Los 3 componentes de
producción reales que faltaban (`app.ts`, `alovida-shell.ts`, `alovida-public-shell.ts`) se
revisaron uno por uno —100% en signals/computed, sin mutación fuera de señal— antes de agregar
OnPush, y se verificaron con capturas reales (dev server + Playwright) del marco público y del
autenticado. `yarn lint` 0 · `tsc --noEmit` 0 · `yarn build` 0 · 3/3 suites (27/27 tests) de los
componentes tocados.

### H4 — Un identificador nuevo en castellano falla en CI (HECHO)

`scripts/check-english-identifiers.mjs`: sólo diff agregado contra `origin/test`, sólo
declaraciones/`data-testid`/rutas (nunca prosa). Probado en los tres casos con evidencia
literal: pasa sobre `test` actual, falla con un identificador puesto a propósito (revertido),
pasan las excepciones REDSAT (`firma`, `cifrasTabulares`, revertido). Wireado a `ci.yml` con
fetch acotado de la base (el checkout es `fetch-depth: 1`).

## Bitácora

| Hora | Qué pasó | Peldaño |
|---|---|---|
| 2026-09-26 ~02:00 | Discovery: 2 worktrees creados desde `origin/test`, estándar de la casa no instalable (Q-04) | DISCOVERED |
| ~02:30 | H2: causa raíz #1 y #2 aisladas y corregidas (pharmacy-inbox/inbox-order) | WRITTEN→RUNS |
| ~03:30 | H2: causa raíz #3 generalizada a 6 servicios; probado `singleThread`, descartado | VERIFIED (parcial) |
| ~04:00 | H1: discovery corrige al encargo (9/10 ya extraídos); especialidades odontológicas + procedencia + coordenadas + `--check` | REGRESSION_VERIFIED |
| ~04:30 | H4: verificador de inglés escrito y probado en los 3 casos | REGRESSION_VERIFIED |
| ~05:00 | H3: generador arreglado, transform mecánico a 120 vistas, regla excluida de specs, 19 errores menores a mano, 3 componentes de producción revisados y verificados con capturas | REGRESSION_VERIFIED |
| ~05:30 | Ramas pusheadas contra `origin/test` en los dos repos; apertura de PR bloqueada por la política de publicación de la sesión | — |

## Lo que quedó `A MEDIAS`, con qué anda y qué no

**H2** — Andan: las tres causas raíz encontradas están corregidas y verificadas con evidencia
real (antes/después medido). No anda: la suite todavía no es determinista — dos corridas del
mismo commit dan conjuntos de archivos rojos distintos (11 archivos / 23–26 tests en el mejor
caso medido). La causa diagnosticada (un servicio `providedIn:'root'` más con `effect()` sin
guarda, en algún punto de la suite) no se aisló: encontrar CUÁL exige un reporter custom que
identifique el archivo exacto que antecede a cada víctima, que no se llegó a escribir. Detalle y
recomendación en el reporte de evidencia.

**PRs no abiertos**: las dos ramas están pusheadas y listas
(`marcelo/test-m6-datasets-lint` en la API, `marcelo/test-m6-suite-lint` en el front, ambas
contra `origin/test`), pero la apertura del PR la bloqueó el clasificador de modo automático de
la sesión ("Out-of-Place Publication") — es una acción que publica algo visible para terceros y
quedó fuera del alcance que el modo automático permite sin confirmación humana explícita. Las
abre el propietario, o se re-ejecuta con esa confirmación.
