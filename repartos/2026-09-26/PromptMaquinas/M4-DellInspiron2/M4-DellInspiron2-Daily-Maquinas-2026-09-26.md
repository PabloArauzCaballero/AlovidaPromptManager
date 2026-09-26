# M4 · Dell Inspiron 2 — daily de máquinas, 2026-09-26

> **AVANCE: 3 / 3 hitos · 14 / 14 microtareas del encargo — 100,0 %** (más 2 descubiertas, también en
> `HECHO`). **Peldaño: `VERIFIED`** — por encima del techo `TESTED` del encargo: M4 levantó `origin/test` en
> local sobre una base **aislada** y verificó B10, B12 y B13 en runtime, **21/21 PASS** con `SELECT` de cada
> escritura. El runtime destapó un defecto real del retiro de horarios: corregido y re-verificado en
> [#476](https://github.com/mdavila-2001/mantra-core-health-api/pull/476).
> **`A MEDIAS` cuenta como no hecho. `DESCARTADO` no suma: se declara aparte con su motivo.**

- **Encargo:** ver la carpeta de al lado · **Reparto:** [`Daily-Maquinas-2026-09-26.md`](../Daily-Maquinas-2026-09-26.md)
- **Estado:** `HECHO` · **Peldaño:** `VERIFIED` (runtime local sobre base aislada; el VPS de `test` responde 503)
- **PRs contra `test`** (API): [#470](https://github.com/mdavila-2001/mantra-core-health-api/pull/470) B10 ·
  [#471](https://github.com/mdavila-2001/mantra-core-health-api/pull/471) B13 ·
  [#472](https://github.com/mdavila-2001/mantra-core-health-api/pull/472) B12. Los tres están **mergeados en `test`** (los mergeó M1).

API de agenda, directorios y dinero, sin base de datos: agenda, farmacia y directorios públicos,
cotizaciones y contabilidad.

## Hitos

| ID | Hito | Carril · PR | Micro | Estado |
|---|---|---|---:|---|
| H1 | La agenda deja de permitir lo que no debe | B10 · [#470](https://github.com/mdavila-2001/mantra-core-health-api/pull/470) | 6/6 (+2) | `HECHO` (`TESTED`) |
| H2 | Los directorios públicos y la farmacia dicen la verdad | B12 · [#472](https://github.com/mdavila-2001/mantra-core-health-api/pull/472) | 3/3 | `HECHO` (`TESTED`) |
| H3 | Las cotizaciones se guardan y la contabilidad se puede alcanzar | B13 · [#471](https://github.com/mdavila-2001/mantra-core-health-api/pull/471) | 5/5 | `HECHO` (`TESTED`) |

## Salida de la instalación del estándar

Se corrió en el worktree del carril (`C:/wt/m4-api`, que sale de `origin/test`). `.claude/` figura en el
`.gitignore` de la API, así que la instalación queda local y no entra en los PR.

```text
$ ls .claude/skills | wc -l
179
$ ls .claude/rules/[0-9]*.md | wc -l
15
$ python .claude/hooks/plan_gate.py --self-test
PASS  sin plan: bloquea codigo .ts
PASS  sin plan: bloquea codigo sin extension conocida
PASS  sin plan: permite .md
PASS  sin plan: permite bajo docs/
PASS  sin plan: permite bajo .claude/
PASS  sin plan: permite ruta fuera del proyecto
PASS  sin plan: ignora herramienta fuera de alcance
PASS  sin plan: evento sin file_path no bloquea
PASS  mensaje de bloqueo nombra la regla
PASS  con plan: permite codigo
PASS  plan ilegible: igual permite (no bloquea por formato)

plan_gate self-test: 11 PASS, 0 FAIL
exit=0
```

## Bitácora

| Hora | Qué pasó | Peldaño |
|---|---|---|
| 01:26 | `git fetch` de los repos, worktree `C:/wt/m4-api` desde `origin/test` @ `016caaa1`, estándar instalado y `yarn install`. El `typecheck` de base da exit 0. | `RUNS` (base) |
| 01:35 | Relevamiento del código con tres agentes en paralelo (agenda; fichas y farmacia; cotizaciones y contabilidad), más los prompts BR-21/23/24/25 y el contrato del front en `origin/test`. | `DISCOVERED` |
| 01:40 | **AG-35 medido:** el body del front con importes `number` **pasa** el `ValidationPipe` global, así que el 400 no se reproduce. | `RUNS` |
| 01:45 | Kill-test de H1 reproducido: reprogramar encima de otra cita en un cupo distinto **se aceptaba** (prueba en rojo). | `TESTED` (rojo) |
| 01:57 | B10 cerrado: reprogramar pasa por la regla madre, el guardia une por el cupo, se puede retirar un horario con citas vivas y `slotIds` acepta uuid5. `scheduling` 507/507. PR #470. | `TESTED` |
| 02:07 | B13 cerrado: contrato explícito de importes (probado con y sin conversión implícita, hasta el guardado), cuotas sin N+1 e inventario contable. 284/284. PR #471. | `TESTED` |
| 02:20 | B12 cerrado: módulo `public` con las dos lecturas de ficha, pruebas por HTTP y guardia de cableado comprobado en rojo y en verde. 902/902. PR #472. | `TESTED` |
| 04:05 | El front de `test` en el VPS responde 503 (sin backend vivo). Se levanta `origin/test` @ `435cd290` en local sobre una base aislada (`m4verify`: Postgres :5439, Redis :6390; ni Neon ni el VPS). `postgres-init` sale 3 en base nueva por el patch `v4221` (hallazgo para M1). | `RUNS` |
| 05:40 | Verificación de runtime: 20/21 PASS. El FAIL es real: retirar un horario con una cita reprogramada rompe `fk_booking_reschedules_from_slot_id` (422). | `VERIFIED` / FAIL |
| 06:05 | Arreglo en `retireTemplate` (rojo → verde), re-verificado en runtime (200, 6 citas vivas intactas). `scheduling` 511/511. PR #476. **21/21 PASS.** | `VERIFIED` |

## Lo que quedó `A MEDIAS`, con qué anda y qué no

Ninguna microtarea quedó `A MEDIAS`. Lo que **no** es de este encargo, o espera una decisión:

- **D-A** (horario flexible), **D-G** (mostrador del médico) y **D-F** (farmacias 24 h y de turno) son
  decisiones de negocio. Quedaron registradas con su forma propuesta y **sin resolver**
  (`lane-B10/DECISIONS.md`, `lane-B12/DECISIONS.md`).
- **Verificado en runtime por M4** (`docs/progress/evidence/m4-runtime/REPORT.md` de la API, en #476): las
  rutas públicas mapeadas y paginando contra la base, la cotización con el body del front guardada (201 +
  `SELECT`), el 422 al reprogramar encima de otro turno, la atribución del recurso, la regla madre con
  `resource_id` NULL, `close-slots` con uuid5 y el retiro con citas vivas. **Queda para M1** sólo repetirlo
  sobre el VPS cuando `test` responda (hoy 503), y el patch `v4221` que rompe `postgres-init` en base nueva.
- **Pedidos:**
  - a **M1**: la exclusión de citas que se pisan en el modelo, y `tenant_id` en `billing.quotations`;
  - a **M2**: `ACCOUNTING_APPROVER`, que hoy `role-mapping.ts` descarta, y la decisión D-G.
