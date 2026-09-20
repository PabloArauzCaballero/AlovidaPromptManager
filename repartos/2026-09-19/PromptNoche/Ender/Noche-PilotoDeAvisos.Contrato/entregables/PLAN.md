# PLAN.md — Ender · turno noche 2026-09-19 · El contrato del piloto

**Rol:** propietario de contrato · **Ficha fuente (manda sobre este plan):**
[`Noche-PilotoDeAvisos.Contrato/ContratoValidadorYCompatibilidad.md`](Noche-PilotoDeAvisos.Contrato/ContratoValidadorYCompatibilidad.md)

Este plan **no repite** el CA/DoD de las 50 microtareas: ya están completos y binarios en la
ficha (§4). Acá sólo agrego lo que la ficha no fija — dónde vive cada evidencia, en qué
workspace corre cada verificación y el orden real de ejecución — y el estado se actualiza acá
en vivo (la ficha original queda como fuente de la especificación, no del avance).

## IN / OUT (scope-discipline)

**IN**
- Repos: `mantra-core-health-api` (solo lectura, worktree propio) · `AlovidaPromptManager`
  (escritura: mi evidencia y artefactos, rama `ender/contrato-agenda-notice-port`).
- Archivos previstos a crear: todo bajo `repartos/2026-09-19/PromptNoche/Ender/`
  (`PLAN.md`, `../evidencia/`, `CONTRATO-AGENDA-NOTICE-PORT.md`, `../validador/`, `REPORTE.md`) +
  actualización del daily propio y checkboxes de mi ficha.
- Comportamiento observable esperado: los seis resultados de la sección 2 de la ficha.

**OUT** (igual que §3 de la ficha, resumido)
- Cualquier edición dentro de `mantra-core-health-api/src/` (o cualquier archivo de Mantra).
- Implementar el adaptador real (Justin), el doble/mock (Justin/laboratorio), la composición
  aislada (Itzan). El **../validador/oráculo** de H2 sí es mío (lo pide la CA del hito, lo confirma
  el handoff «H2 → Justin: el validador, su doble tiene que pasarlo») y vive en mi carpeta de
  evidencia, nunca dentro de `mantra-core-health-api`.
- Resolver Q-06 (durabilidad), Q-12, Q-13, Q-05, Q-24: se registran, no se deciden.
- `docker compose up`, `rebuild_stack.py`, tests de integración/smoke de Mantra: no aplica a
  este carril (no toco backend en ejecución; todo el trabajo es lectura de código + documento).

## Ambigüedad registrada antes de empezar (anti-hallucination-guard)

**AMBIGUO:** la §3 (Alcance) de la ficha lista en el mismo párrafo OUT: *"implementar el doble o
el validador (eso es del laboratorio)"*, pero la §4 (H2) pide explícitamente implementar el
validador runtime con casos negativos, y el handoff dice *"H2 → Justin: El validador: su doble
tiene que pasarlo"*.
- **Lecturas:** (a) "validador" en el párrafo OUT es un error de redacción/concatenación entre
  los OUT de distintos hitos (el párrafo mezcla exclusiones de H1 a H6 sin separador); (b) el
  validador completo es en efecto de otra persona y yo sólo lo *especifico* en H1.S2.M3.
- **Evidencia a favor de (a):** la tabla de H2 (§4) es mucho más específica y binaria
  (`H2.S1.M1..M3`, kill-test propio, DoD con casos negativos ejecutados) que la lista OUT
  corrida; el handoff nombra "su doble" (de Justin) contra "el validador" (mío) como cosas
  separadas — si el validador fuera ajeno, no tendría sentido que su doble deba "pasarlo".
- **Decisión:** tomo (a). Construyo el validador como **oráculo independiente**, en TypeScript
  puro sin dependencias de Mantra, en `../validador/` de esta carpeta — nunca dentro de
  `mantra-core-health-api/src`. Reversible: si Pablo confirma la lectura (b), el validador queda
  igual de válido como especificación ejecutable y se descarta sólo su ubicación como "mío".
- **A quién confirmárselo:** Pablo (dueño del backend/harness, según el handoff de H2).
- **Impacto si la lectura correcta era (b):** ninguna pérdida de trabajo — el oráculo se
  reubica o se le cede la propiedad; la especificación (H1.S2.M3) es válida en cualquier caso.

## Workspaces

| Repo | Ruta real | Uso | Aislamiento |
|---|---|---|---|
| **`mantra-core-health-api`** | `Mantra Core Health/wt-contrato-avisos-agenda/` | Sólo lectura (`git show`, `grep`, `git log`) contra el corte fijo | Worktree propio, detached en `32ae939983f0d665e4ed371362858801134d35cd` (el checkout compartido tenía señales de otra sesión — `check-exclusive-checkout.py` exit 1) |
| `AlovidaPromptManager` | `GymSheet/AlovidaPromptManager/` | Escritura de mi evidencia y artefactos | Rama propia `ender/contrato-agenda-notice-port`, sin push (no se pidió publicar) |

## Orden de ejecución (por dependencia real, no por número de hito)

1. **H1.S1** — congelar el archivo, su hash y el inventario de consumidores. *(hecho antes de este plan; ver `../evidencia/h1-s1-*`)*
2. **H1.S2** — semántica campo por campo, exactamente-uno, emitMany, debounceKey, autorización, errores.
3. **H1.S3** — tensión Q-06 sin resolver, ficha de Efectos/Compatibilidad, publicar el snapshot v1.
4. **H2** — validador runtime (oráculo independiente) + casos ADV-03 + versión/compatibilidad contra los consumidores de H1.
5. **H3** — política de compatibilidad, ADV-06 en copia temporal, matriz, contrato de la 2ª capacidad (probablemente `BLOCKED`: Pablo no la eligió aún — se verifica, no se asume).
6. **H4** — congelar versión estable con matriz completa.
7. **H5** — repetir ADV-06 sobre la versión estable, verificar inmutabilidad histórica, cerrar riesgos.
8. **H6** — versión final, pendientes con dueño, riesgos residuales.

## Microtareas — ver ficha §4 para CA/DoD completos

El estado en vivo de las 50 microtareas se lleva en la ficha original (columna «Estado» de cada
tabla) y se resume en `REPORTE.md` al cerrar. No se duplica acá para no crear una segunda fuente
de verdad (regla de `milestone-planning` §7: el plan es vivo, pero un solo lugar manda).

## Kill-test del turno (de la ficha, no reformulado)

> Preguntale a Justin qué significa que `delivered` venga en `true`, y si el compilador impide
> construir un `recipient` con sus dos campos vacíos. Si tiene que abrir el `.ts` para contestar,
> no está hecho.

Ambas respuestas quedan en `CONTRATO-AGENDA-NOTICE-PORT.md` §Semántica y §Autorización, citando
archivo:línea del corte congelado.

## Gates que aplican (skills-router §4)

- `evidence-and-verification` — cada afirmación de este carril sube peldaño con salida pegada en `../evidencia/`.
- `terminology-value-sets` — `AgendaNoticeKind` es un catálogo cerrado: se documenta como tal, no como "enum más".
- `authz-access-control` — el puerto no es un endpoint HTTP, pero transporta datos de personas (`patientProfileId`); se audita igual qué identifica al actor/titular.
- `state-machines-workflows` — no aplica directo (el puerto no es una máquina de estados), pero `AgendaNoticeKind` sí es un catálogo cerrado con reglas de pertenencia — se cruza con `terminology-value-sets`.
- `data-privacy-phi` no está en mi lista de 22, pero se activa igual por regla del router (§1: "si el cambio toca datos de personas, cargala aunque nadie la pidiera") — se aplica en la ficha de Autorización: `patientProfileId` es dato de paciente y no debe filtrar a logs sin control.
