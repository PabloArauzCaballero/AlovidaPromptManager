# C3 — Diagnóstico: nace presuntivo, se confirma o rechaza con motivo y evidencia, y activa la enfermedad

> **Rol:** dueño del diagnóstico (bloque, modal de verificación, simulador de verificación, seed de condiciones) y del expediente del doctor · **Carril:** C3 · **Fecha:** 2026-09-25 · **Turno:** noche · **Ola A**
> **Plan maestro:** [`PLAN-MAESTRO.md`](../PLAN-MAESTRO.md) — §0.2 (2b, 3, 5), §0.3 D-1/D-2/D-6, §2, §3.4, §5, §6, §7 C3
> **Literal del propietario:** «un diagnóstico se puede confirmar o rechazar, pero debe haber la opción de adjuntar esto como motivo de decisión: simple observación y cuál observación asociada a qué cita o análisis médico … esto activa una enfermedad en el paciente que tiene una duración específica, que … aparece en su historia clínica como diagnósticos históricos».

## 0. Ficha de asignación

| Campo | Valor |
|---|---|
| `REPO` | `mantra-core-health`. **Nada de backend** |
| `TARGET_REF` | `origin/mockup` con el commit de C0 |
| `RAMA` | `claude/clinica-c3-diagnostico` |
| `WORKTREE` | `C:/Users/DELL/Documents/Github/Alovida/wt-clinica-c3` |
| `PUERTO` | `4213` |
| `ARCHIVOS RESERVADOS` | `src/app/features/clinical-record/patient-chart/diagnosis-block/**` · `…/patient-chart/diagnosis-verify-dialog/**` (nuevo) · `…/patient-chart/patient-chart.{ts,html,css,spec.ts}` · `…/patient-chart/demo-presets.ts` · `core/data-access/clinical/clinical.client.ts` (+ spec: **sólo agregar** `verifyCondition` y el default provisional en `createCondition`) · `core/mock/handlers/diagnosis-verification.handlers.ts` (+ `.spec.ts` nuevo) · `core/mock/fixtures/clinica.ts` **sólo líneas 33-52 y 227-245** (`CondicionSimulada`, `condiciones`) · `playwright/clinica-c3-diagnostico.spec.ts` · `playwright/diagnostico-que-se-ve.spec.ts` · `playwright/expediente-pestanas-navegador.spec.ts` (sólo si tu cambio de pestaña lo rompe) · `docs/trabajo/2026-09-25-encuentro-clinico/c3/**` |
| `ARCHIVOS DE OTROS` | `medication-block/**` (C5) · `care-plan-block/**` (C7) · `account/medical-record/**` (C6) · `clinical.handlers.ts` (C5; `change-status` se conserva) · `fixtures/clinica.ts` fuera de tus regiones (C2) · `consultation/**`, tipos congelados, `shared/clinical/diagnosis-state.ts` (C0) |
| `CUENTAS` | `medica@alovida.mock` |
| `DÓNDE SE PRUEBA` | consulta → `consulta-casilla-diagnosticos`; expediente `/medical-records/<id>` → pestaña «Diagnósticos» y tarjeta «Enfermedades activas» |
| `LÍMITE DE RECURSOS` | un `yarn start`, un build/test a la vez, Playwright sólo vía `pw-guard` |

## 1. Estándar y skills

§5.1 del plan. **Skills:** `skills-router` → `outcome-first` → `context-thrift` → `factual-discovery` → `anti-hallucination-guard` → `milestone-planning` → `scope-discipline` → `lane-authoring` → `data-privacy-phi` → `clinical-records` → `state-machines-workflows` → `terminology-value-sets` → `frontend-ui-design` → `visual-hierarchy-composition` → `frontend-forms-ux` → `angular-forms` → `angular-development` → `angular-signals-state` → `frontend-data-tables` → `frontend-ux-states` → `frontend-responsive-layout` → `frontend-accessibility` → `ux-writing-microcopy` → `native-code-patterns` → `unit-testing` → `angular-testing` → `test-case-design-techniques` → `e2e-playwright` → (cierre) `frontend-beautiful-ui` → `ui-quality-review` → `visual-proof` → `critical-double-review` → `evidence-and-verification` → `work-report-md` → `pr-mergeable-gate` → `finish-your-turn`. Del repo: `project-design-system`, `frontend-production-gate`, `visual-quality-gate`; agentes `visual-reviewer`, `frontend-reviewer`, `regression-auditor` (tocás el expediente, que tiene consumidores).

`PLAN.md` propio antes del primer edit.

## 2. Resultado observable y kill-test

En la consulta, «Diagnóstico» crea un diagnóstico que nace **Presuntivo** (rótulo visible). En la lista del bloque y en la pestaña «Diagnósticos» del expediente, cada presuntivo tiene «Acciones → Confirmar… / Rechazar…» que abre un **modal** con motivo, evidencia (ninguna · una nota médica de una cita · un análisis —orden o informe—) y, al confirmar, inicio, fin esperado **o** «Crónica». Al guardar, el estado cambia, y el expediente muestra arriba **«Enfermedades activas»** («hasta <fecha>», días restantes) además de «En estudio» e «Históricos» (con la razón). La pestaña «Notas» muestra las filas de las notas nuevas.

**Kill-test:** confirmar sin motivo y sin evidencia debe fallar con el 422 visible dentro del modal; si guarda, C3 no está hecho.

## 3. Contrato que implementás (§3.4)

`POST /clinical/conditions/:id/verification` con `NewDiagnosisVerification { outcome, reasonText?, basedOn?, onsetAt?, expectedResolutionAt?, clinicalCourseConceptId? }`:

- 404 si no existe · 409 si no está en `DXV-PROVISIONAL` · 422 si faltan `reasonText` **y** `basedOn` · 422 si `basedOn.noteId` / `serviceRequestId` / `diagnosticReportId` no existe o no es del paciente · 422 al confirmar sin `expectedResolutionAt` ni curso crónico.
- Al confirmar: `verificationStatusConceptId = DXV-CONFIRMED`, `clinicalStatusConceptId = COND-ACTIVE`, `onsetAt` (el que venga o el que tenía), `expectedResolutionAt`, `verification { outcome, decidedAt, decidedByProfileId, reasonText, basedOn }`. Al rechazar: `DXV-REFUTED`, `resolvedAt = ahora`, `verification`.
- `basedOn.encounterId` lo resolvés vos desde la nota (para que la UI diga «por nota del 12/09»).
- `ClinicalClient.verifyCondition(id, body): Observable<Condition>`; `createCondition` manda `verificationStatusConceptId` = id del código `DXV-PROVISIONAL` (resuelto por catálogo, nunca uuid pegado).
- Los estados de la lista se derivan con `diagnosisStateOf` y `DIAGNOSIS_STATE_LABELS` de `shared/clinical/diagnosis-state.ts` (C0). No los reimplementes.

Seed (regiones 33-52 y 227-245 de `fixtures/clinica.ts`): `CondicionSimulada` += `verification`, `expectedResolutionAt`; el confirmado de cada paciente con `verification` (motivo + `basedOn` nota `uuid('medical-note-<pid>-0')`), `expectedResolutionAt` +60 días (crónico si el código es `I10` o `E11.9`); uno de cada tres pacientes con un rechazado.

## 4. Diseño exigido

Modal `app-content-dialog` «Confirmar el diagnóstico» / «Rechazar el diagnóstico»: `app-textarea` motivo (≤ 500, contador); `app-radio-group` evidencia (Ninguna · Una nota médica · Un análisis); según la elección, `app-select` de notas del paciente agrupadas por fecha de cita («Consulta del 12/09 — Nota #a1b2: Presión arterial…») o `app-select` de órdenes/informes («Hemograma — informe del 15/09»); al confirmar, `app-date-picker` inicio y fin esperado + `app-checkbox` «Crónica (sin fin esperado)» que deshabilita el fin. Guardar deshabilitado hasta que haya motivo o evidencia (y fin o crónica al confirmar). 409/422 dentro del modal con el mensaje del servidor y el ID de petición, sin cerrar. Sellos `app-status-seal`: Presuntivo = neutro, Confirmado = éxito, Rechazado = peligro. Acciones de fila con `appMenuTrigger` + `app-menu` (ADR-0015; texto, no ícono). «Enfermedades activas»: `app-card` sobre las pestañas con `app-fact-list` (desde / hasta / días restantes) y `app-progress` del tiempo transcurrido; «Crónica» sin barra. Pestaña «Diagnósticos»: columna «Estado» con sello, agrupación En estudio / Activas / Históricas, columna «Decisión» («por nota del 12/09», «por informe de hemograma»). Pestaña «Notas»: si la nota trae `entries`, `app-fact-list` (`expediente-nota-entries`). Regla 8 del expediente intacta; tokens; cinco viewports; tema oscuro.

## 5. Microtareas

| ID | Microtarea | CA | DoD |
|---|---|---|---|
| C3.H1.M1 | Arranque, estándar, baseline, `PLAN.md` | — | baseline |
| C3.H2.M1 | Seed de condiciones | determinismo | spec |
| C3.H2.M2 | Handler de verificación con todas las reglas; exporta `verificarCondicion()` | spec: 9 casos (motivo · nota · orden · sin nada 422 · ya confirmado 409 · rechazar · sin fin ni crónica 422 · nota ajena 422 · crónica sin fin 200) | `yarn test --watch=false --include=src/app/core/mock/handlers/diagnosis-verification.handlers.spec.ts --include=src/app/core/mock/mock-backend.spec.ts` |
| C3.H2.M3 | Cliente: `verifyCondition`, default provisional | cuerpo exacto | `yarn test --watch=false --include=src/app/core/data-access/clinical/clinical.client.spec.ts` |
| C3.H3.M1 | `diagnosis-block`: nace presuntivo; lista con estado y menú | Confirmado sin menú de verificación | spec |
| C3.H3.M2 | `diagnosis-verify-dialog` | Guardar deshabilitado sin motivo ni evidencia; «Crónica» exime el fin | spec |
| C3.H3.M3 | 409/422 dentro del diálogo (S4/S9) | forzado con `mock:fallos` y con el 422 real | capturas |
| C3.H3.M4 | `patient-chart`: «Enfermedades activas», columna Estado agrupada, columna Decisión | Con la seed la médica ve una activa y una en estudio en el primer paciente | spec + captura |
| C3.H3.M5 | Pestaña «Notas» con `entries` | Se ve con seed de C1 o con una nota creada por `POST` en el spec | spec |
| C3.H4.M1 | Playwright `clinica-c3-diagnostico.spec.ts` | verde | `node scripts/pw-guard.mjs --port 4213 --spec playwright/clinica-c3-diagnostico.spec.ts --serve` |
| C3.H4.M2 | Capturas cinco viewports, claro/oscuro; `critical-double-review` | — | capturas |
| C3.H5.M1 | Revisores (incl. `regression-auditor`), gates, commits, push a `mockup`, PR, `REPORTE.md` con **P41**, daily en `main` | — | — |

## 6. Playwright

`node scripts/pw-guard.mjs --port 4213 --spec playwright/clinica-c3-diagnostico.spec.ts --serve` (background). Recorrido: médica → Iniciar consulta → `consulta-casilla-diagnosticos` → crear → `diagnostico-estado` = «Presuntivo» → `diagnostico-acciones` → `diagnostico-confirmar` → `verificacion-motivo` + `verificacion-fin-esperado` (+30 días) → `verificacion-guardar` → «Confirmado» → «Ver expediente» → `expediente-enfermedades-activas` lo lista → `page.reload()` → sigue. Segundo caso: crear otro → `diagnostico-rechazar` con motivo → aparece en `expediente-diagnosticos-historicos`. Tercer caso negativo: confirmar sin motivo ni evidencia → mensaje 422 visible en `verificacion-dialogo`.

## 7. Cierre

Checklist §9. Commits `feat(diagnostico): …`, `feat(mock): verificación del diagnóstico`, `feat(expediente): enfermedades activas y estados del diagnóstico`. Push a `mockup` verificado + rama + PR. `REPORTE.md` con **P41** listo para pegar (estados `COND_PROVISIONAL`/`COND_REFUTED`, endpoint, regla de activación, camino `.puml` → `gen_ddl.py` → `SQL/` → patch → `gen_entities.py`). Daily `C3-Diagnostico/C3-Daily-Noche-2026-09-25.md` aquí y push a `main`. `SendMessage`: «C3: verificación en origin/mockup @ <sha>» (C5 y C6 lo usan).

## 8. Lo que NO hacés

Tocar `medication-block` (C5) ni el lado paciente (C6) · cambiar `change-status` · reimplementar `diagnosisStateOf` · agregar campos a tipos congelados (`diagnosis.types.ts` propio + `// TODO C8` si hace falta) · editar `fixtures/clinica.ts` fuera de tus regiones.
