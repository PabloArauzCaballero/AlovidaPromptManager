# C0 — Contrato primero: tipos, conceptos, stubs, casillas de la consulta y el guardián de Playwright

> **Rol:** dueño del contrato compartido de la noche · **Responsable:** Marcelo · **Carril:** C0 · **Fecha:** 2026-09-25 · **Turno:** noche · **Sesión única, va primero y sola**
> **Plan maestro:** [`PLAN-MAESTRO.md`](../../../../../docs/trabajo/2026-09-25-plan-y-reparto-encuentro-clinico/PLAN-MAESTRO.md) — §3 (contratos), §4.3 (lo que congelás), §6 (`pw-guard`), §7 C0 (tus microtareas)
> **Tu carril destraba a nueve carriles de tres personas.** Nada de lo tuyo es «feature»: es contrato, esqueleto y herramienta. Cuando termina, los tipos que tocaste quedan congelados para todos.

## 0. Ficha de asignación

| Campo | Valor |
|---|---|
| `REPO` | `mantra-core-health` (frontend Angular 21, Yarn 4 PnP). **Nada de backend** |
| `TARGET_REF` | `origin/mockup` — corte leído `bf2c3545` (PR #660). **Reconsultalo y fijá el tuyo** en tu `PLAN.md` |
| `RAMA` | `claude/clinica-c0-base`, desde `origin/mockup` |
| `WORKTREE` | `<raíz de tus repos>/wt-clinica-c0` (`git -C mantra-core-health worktree add ../wt-clinica-c0 -b claude/clinica-c0-base origin/mockup`) |
| `PUERTO` | `4210` (`corepack yarn start --port 4210`, en background) |
| `ARCHIVOS RESERVADOS` | `src/app/core/data-access/clinical/clinical.types.ts` · `core/data-access/chart-notes/chart-notes.types.ts` · `core/data-access/diagnostics/diagnostics.types.ts` · `core/data-access/scheduling/scheduling.types.ts` · `core/mock/fixtures/conceptos.ts` · `core/mock/handlers/index.ts` · `core/mock/handlers/clinical.handlers.ts` (**sólo quitar** los bloques que mudás) · `core/mock/handlers/diagnostics.handlers.ts` (**sólo pegar** el bloque mudado) · `core/mock/handlers/medical-notes.handlers.ts` (nuevo) · `core/mock/handlers/diagnosis-verification.handlers.ts` (nuevo) · `features/clinical-record/consultation/**` · `features/clinical-record/patient-chart/analysis-order-block/**` (rename de `diagnostics-block`) · `features/clinical-record/patient-chart/specialty-form-block/specialty-form-block.{ts,html,spec.ts}` (sólo import/selector) · `features/clinical-record/patient-chart/medical-note-block/**` (stub) · `features/clinical-record/patient-chart/follow-up-block/**` (stub) · `shared/clinical/diagnosis-state.{ts,spec.ts}` · `features/component-stock/component-index.generated.ts` (regenerado) · `scripts/pw-guard.mjs` · `docs/testing/pw-guard.md` · `docs/business/glossary.md` · `docs/adr/ADR-0016-encuentro-eje-clinico.md` · `docs/adr/index.md` · `docs/trabajo/2026-09-25-encuentro-clinico/README.md` y `c0/**` · `.gitignore` (sólo `artifacts/pw-guard/`) |
| `ARCHIVOS DE OTROS` | Todo lo demás. En particular **no** implementás la nota médica (C1), la orden (C2), la verificación (C3), la reconsulta (C4), la receta (C5), la historia (C6), los renombres (C7) ni «Mis órdenes» (C9): dejás **stubs** que compilan y se ven |
| `CUENTAS` | `medica@alovida.mock`, `paciente@alovida.mock` (cualquier contraseña no vacía; sintéticas declaradas) |
| `DÓNDE SE PRUEBA` | `/medical-records/<id>/consultation` (llegá desde `/schedule` → «Iniciar la consulta»), `/design-system/stock` |
| `LÍMITE DE RECURSOS` | un `yarn start`, un build a la vez, Playwright sólo vía `pw-guard --workers=1` |
| `TUS OTROS CARRILES ESTA NOCHE` | Farmacia: `Noche-Farmacia.DatosYContratoReal` · Carga Masiva: `Noche-CargaMasiva.CalidadE2EVisualYGates`. Ningún archivo de este carril se cruza con ellos (verificado contra sus listas reservadas). **C0 bloquea a Itzan, Justin y Pablo: hacelo antes que tus otros dos carriles**, o pactá el orden con el propietario. Tu daily es uno solo (`Marcelo-Daily-Noche-2026-09-25.md`): este carril va en su sección «Carril C — Encuentro clínico». |
| `DEPENDE DE` | nada. **Los demás dependen de vos:** publicá en `origin/mockup` apenas compile y pase lo tuyo |

## 1. Antes de escribir una línea — instalación OBLIGATORIA del estándar

```bash
git -C <raíz de tus repos>/AlovidaPromptManager pull --ff-only origin main
cd <raíz de tus repos>/wt-clinica-c0
cp -rn ../AlovidaPromptManager/.claude/skills/* .claude/skills/     # fusionar, NO pisar las 4 skills y 3 agentes del repo
cp -rn ../AlovidaPromptManager/.claude/rules .claude/ 2>/dev/null || cp -rn ../AlovidaPromptManager/.claude/rules/* .claude/rules/
cp -rn ../AlovidaPromptManager/.claude/hooks .claude/ 2>/dev/null || true
ls .claude/skills | wc -l; ls .claude/rules/[0-9]*.md | wc -l; python .claude/hooks/plan_gate.py --self-test   # pegá las tres salidas en tu daily
```

Los `.claude/` instalados **no se commitean**. Si no podés completar este paso estás `BLOQUEADO`: avisá y no sigas.

**Skills que cargás (herramienta Skill), en este orden:** `skills-router` → `outcome-first` → `context-thrift` → `factual-discovery` → `anti-hallucination-guard` → `milestone-planning` → `scope-discipline` → `lane-authoring` → `angular-development` → `angular-signals-state` → `native-code-patterns` → `terminology-value-sets` → `technical-docs-and-adr` → `unit-testing` → `angular-testing` → `e2e-playwright` → `evidence-and-verification` → `work-report-md` → `pr-mergeable-gate` → `finish-your-turn`. Del repo: `project-design-system`, `frontend-production-gate`, `visual-quality-gate`.

**Después del estándar y antes del primer edit de código:** `docs/trabajo/2026-09-25-encuentro-clinico/c0/PLAN.md` con corte propio, IN/OUT, archivos reservados y las microtareas de abajo con estado.

## 2. Resultado observable y kill-test

**Resultado observable:** en `http://localhost:4210/medical-records/<id>/consultation` la rejilla muestra **12 casillas** en este orden: Nota médica · Orden de análisis · Diagnóstico · Reconsulta · Receta · Alergia · Medición · Plan de cuidados · Documento · Formulario clínico · Internación · Pagos. Nota médica, Orden y Reconsulta abren `consulta-modal` con «En construcción (C1/C2/C4)». `node scripts/pw-guard.mjs --self-test` imprime `3 PASS, 0 FAIL`. `lint`, `typecheck`, `mock-backend.spec.ts`, `clinical.handlers.spec.ts`, `diagnostics.handlers.spec.ts`, `consultation.spec.ts`, `specialty-form-block.spec.ts` verdes.

**Kill-test:** si `POST /charts/notes` sigue registrado en `clinical.handlers.ts`, o `pw-guard --self-test` no existe, o `grep -rn "diagnostics-block\|DiagnosticsBlock" src/app` devuelve algo, C0 no está hecho.

## 3. Lo que fijás (leé `PLAN-MAESTRO.md` §3 completo; acá va lo literal)

- **Conceptos** (`fixtures/conceptos.ts`): `ACTIVIDAD += ['ACT-FOLLOW-UP','Reconsulta']` · `TIPO_CITA += ['APT-RECONSULTA','Reconsulta']` · `CATEGORIA_ORDEN += ['SRQ-OTHER','Otro']`. `VERIFICACION_DX` ya tiene `DXV-CONFIRMED/PROVISIONAL/DIFFERENTIAL/REFUTED`: no lo toques.
- **Tipos** (todos con JSDoc que dice qué carril lo llena y qué pendiente P39–P42 lo respalda):
  - `clinical.types.ts`: `MedicalNoteEntry { label; value }`, `ChartNote.entries?`, `DiagnosisOutcome`, `DiagnosisEvidence`, `DiagnosisVerification`, `NewDiagnosisVerification`, `Condition.verification?` — forma exacta en §3.2 y §3.4.
  - `chart-notes.types.ts`: `entries?` en `CreateClinicalNoteInput` y `AppendClinicalNoteVersionInput`.
  - `diagnostics.types.ts`: `AnalysisCategory = 'LAB'|'IMAGING'|'OTHER'`; `NewDiagnosticOrder.category?`, `.basedOnNoteIds?`; `DiagnosticOrder.category?`, `.basedOnNoteIds?`; **`PatientOrder.category?`**.
  - `scheduling.types.ts`: `FollowUpOrigin { bookingId; encounterId: string|null }`, `NewDirectAppointment.followUpOf?`, `Booking.followUpOf?`.
- **Ayudante** `src/app/shared/clinical/diagnosis-state.ts`: `DiagnosisState`, `DIAGNOSIS_STATE_LABELS`, `diagnosisStateOf(...)` (§3.4) + spec con 8 casos.
- **Mudanzas de handlers** (mecánicas, sin cambiar comportamiento): `/charts/notes*` (`clinical.handlers.ts:595-644`) → `handlers/medical-notes.handlers.ts` (`registrarNotasMedicas`, registrado **después** de `registrarClinica` en `index.ts`); `POST /clinical/service-requests` (`clinical.handlers.ts:521-583`) → `diagnostics.handlers.ts`. Stub `handlers/diagnosis-verification.handlers.ts` con `POST /clinical/conditions/:id/verification` → `notFound('Pendiente: carril C3')`.
- **Rename** `diagnostics-block` → `analysis-order-block` (`git mv`; clase `AnalysisOrderBlock`; selector `app-analysis-order-block`; archivos `analysis-order-block.{ts,html,css,spec.ts}`; consumidores: `specialty-form-block.{ts,html,spec.ts}`, comentario de `misc.handlers.ts:96`; `yarn stock:generate`).
- **Stubs**: `medical-note-block` (`app-medical-note-block`; inputs `patientProfileId`, `encounterId`, `citas`; output `guardada`) y `follow-up-block` (`app-follow-up-block`; inputs `patientProfileId`, `encounterId`, `bookingId: string | null`; output `cambio`), cada uno con `app-alert` «En construcción (C1)» / «(C4)» y spec mínimo.
- **Consulta** (`consultation.ts` / `.html` / `.spec.ts`): `CasillaDeConsulta` += `'ordenes' | 'reconsulta'`; rótulos y descripciones exactos en §7 H4.S1.M4; `ORDEN_DE_CASILLAS` = notas, ordenes, diagnosticos, reconsulta, medicacion, alergias, observaciones, planes, documentos, formulario, internacion, pagos; `@case` nuevos en el HTML según H4.S1.M5; quitar el import de `free-note-block`.
- **`scripts/pw-guard.mjs`** exactamente como §6 (ESM, sin dependencias nuevas, Windows y POSIX, `--self-test`, `docs/testing/pw-guard.md`, `artifacts/pw-guard/` ignorado).
- **Docs**: `ADR-0016-encuentro-eje-clinico.md` (+ fila en `docs/adr/index.md`), sección «Clínica — nombres únicos» en `docs/business/glossary.md` (tabla §2), `docs/trabajo/2026-09-25-encuentro-clinico/README.md` apuntando a `AlovidaPromptManager/repartos/2026-09-25/PromptNoche/`.

## 4. Microtareas (estado en tu `PLAN.md`)

### H1 — Arranque, ADR y glosario

**CA:** Todas las microtareas de H1 cumplen su criterio binario de la tabla.
**DoD:** Los DoD de sus microtareas, ejecutados y con su salida pegada en `evidencia/`.
**Estado:** TODO

#### H1.S1 — Arranque, ADR y glosario

**CA:** El mismo de H1: el hito se entrega en una sola subtarea.
**DoD:** El mismo de H1: los DoD de las microtareas de abajo.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD |
|---|---|---|---|
| H1.S1.M1 | Worktree, rama, estándar instalado, corte anotado, baseline a `evidencia/antes/` | `PLAN.md` cita SHA; tres `.txt` con exit code | `yarn lint; echo exit=$?` · `yarn typecheck; echo exit=$?` · `yarn test --watch=false --include=src/app/core/mock/** --include=src/app/features/clinical-record/**; echo exit=$?` |
| H1.S1.M2 | ADR-0016 + fila en el índice | Cita rutas reales; no promete nada fuera del plan | `node scripts/check-doc-links.mjs` |
| H1.S1.M3 | Glosario + README puntero | Cada fila con tres columnas y «Se retira» | `node scripts/check-doc-links.mjs` |

### H2 — Conceptos y tipos congelados

**CA:** Todas las microtareas de H2 cumplen su criterio binario de la tabla.
**DoD:** Los DoD de sus microtareas, ejecutados y con su salida pegada en `evidencia/`.
**Estado:** TODO

#### H2.S1 — Conceptos y tipos congelados

**CA:** El mismo de H2: el hito se entrega en una sola subtarea.
**DoD:** El mismo de H2: los DoD de las microtareas de abajo.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD |
|---|---|---|---|
| H2.S1.M1 | Conceptos nuevos | `terminology.handlers.spec.ts` verde; `$expand` los devuelve | `yarn test --watch=false --include=src/app/core/mock/handlers/terminology.handlers.spec.ts` |
| H2.S1.M2 | Tipos de nota médica | `yarn typecheck` limpio; JSDoc | `yarn typecheck` |
| H2.S1.M3 | Tipos de orden (incl. `PatientOrder.category?`) | ídem | `yarn typecheck` |
| H2.S1.M4 | Tipos de verificación | ídem | `yarn typecheck` |
| H2.S1.M5 | Tipos de reconsulta | `scheduling.client.spec.ts` verde | `yarn test --watch=false --include=src/app/core/data-access/scheduling/**` |
| H2.S1.M6 | `diagnosis-state.ts` + spec (8 casos) | 8 casos verdes | `yarn test --watch=false --include=src/app/shared/clinical/**` |

### H3 — Mudanza de rutas del simulador

**CA:** Todas las microtareas de H3 cumplen su criterio binario de la tabla.
**DoD:** Los DoD de sus microtareas, ejecutados y con su salida pegada en `evidencia/`.
**Estado:** TODO

#### H3.S1 — Mudanza de rutas del simulador

**CA:** El mismo de H3: el hito se entrega en una sola subtarea.
**DoD:** El mismo de H3: los DoD de las microtareas de abajo.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD |
|---|---|---|---|
| H3.S1.M1 | Mudanza `/charts/notes*` | `router.rutas()` conserva las 3 rutas; specs verdes | `yarn test --watch=false --include=src/app/core/mock/**` |
| H3.S1.M2 | Mudanza `POST /clinical/service-requests` | ídem | ídem |
| H3.S1.M3 | Stub de verificación | `mock-backend.spec.ts` verde (404 no es 500) | ídem |

### H4 — Renombres y casillas de la consulta

**CA:** Todas las microtareas de H4 cumplen su criterio binario de la tabla.
**DoD:** Los DoD de sus microtareas, ejecutados y con su salida pegada en `evidencia/`.
**Estado:** TODO

#### H4.S1 — Renombres y casillas de la consulta

**CA:** El mismo de H4: el hito se entrega en una sola subtarea.
**DoD:** El mismo de H4: los DoD de las microtareas de abajo.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD |
|---|---|---|---|
| H4.S1.M1 | Rename `analysis-order-block` | `grep` = 0 | `yarn typecheck` · `yarn test --watch=false --include=src/app/features/clinical-record/patient-chart/analysis-order-block/** --include=src/app/features/clinical-record/patient-chart/specialty-form-block/**` |
| H4.S1.M2 | Stub `medical-note-block` | En `/design-system/stock` | `yarn stock:generate` · spec |
| H4.S1.M3 | Stub `follow-up-block` | ídem | ídem |
| H4.S1.M4 | Casillas de la consulta | 12 casillas en ese orden | `yarn test --watch=false --include=src/app/features/clinical-record/consultation/**` |
| H4.S1.M5 | `@case` nuevos en el HTML | Las tres abren `consulta-modal` | ídem + capturas de la rejilla y los tres modales |

### H5 — Guardián de Playwright

**CA:** Todas las microtareas de H5 cumplen su criterio binario de la tabla.
**DoD:** Los DoD de sus microtareas, ejecutados y con su salida pegada en `evidencia/`.
**Estado:** TODO

#### H5.S1 — Guardián de Playwright

**CA:** El mismo de H5: el hito se entrega en una sola subtarea.
**DoD:** El mismo de H5: los DoD de las microtareas de abajo.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD |
|---|---|---|---|
| H5.S1.M1 | `pw-guard.mjs` + `--self-test` + doc + `.gitignore` | `3 PASS, 0 FAIL`; una corrida real contra 4210 con `playwright/consulta-rejilla.spec.ts` termina con `RESUMEN:` | `node scripts/pw-guard.mjs --self-test` · `node scripts/pw-guard.mjs --port 4210 --spec playwright/consulta-rejilla.spec.ts` |

### H6 — Gates, reporte y entrega

**CA:** Todas las microtareas de H6 cumplen su criterio binario de la tabla.
**DoD:** Los DoD de sus microtareas, ejecutados y con su salida pegada en `evidencia/`.
**Estado:** TODO

#### H6.S1 — Gates, reporte y entrega

**CA:** El mismo de H6: el hito se entrega en una sola subtarea.
**DoD:** El mismo de H6: los DoD de las microtareas de abajo.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD |
|---|---|---|---|
| H6.S1.M1 | Gates §5.3 (1–3) + `REPORTE.md` | exit 0; salida en `evidencia/despues/` | comandos con `; echo exit=$?` |
| H6.S1.M2 | Commits por microtarea, `pull --rebase`, `git push origin HEAD:mockup`, rama, PR `--base mockup` | `origin/mockup` contiene los commits; PR abierto | `git fetch origin mockup && git log --oneline -8 origin/mockup` |
| H6.S1.M3 | Sección «Carril C — Encuentro clínico · C0» de tu daily `Marcelo/Marcelo-Daily-Noche-2026-09-25.md` (sin tocar tus secciones de Farmacia y Carga Masiva) en `AlovidaPromptManager` (commit + `git push origin main`); aviso a Itzan, Justin y Pablo con el SHA (`SendMessage` si comparten máquina; si no, por el canal del equipo) | Daily con SHA, números de instalación, archivos tocados | `git -C ../AlovidaPromptManager log --oneline -1 origin/main` |


## 5. Cómo cerrás

1. Gates §5.3 del plan (1, 2, 3) con salida pegada; `critical-double-review` sobre las capturas de la rejilla.
2. Commits Conventional en castellano: `feat(clinica): contrato primero (C0) — tipos de nota, orden, verificación y reconsulta`, `refactor(mock): mudar /charts/notes y service-requests a sus handlers`, `refactor(expediente): diagnostics-block → analysis-order-block`, `feat(consulta): casillas Nota médica, Orden de análisis y Reconsulta`, `chore(scripts): pw-guard`, `docs(adr): ADR-0016 …`. **Nunca `git add -A`.**
3. `git pull --rebase origin mockup && git push origin HEAD:mockup`; verificá con `git fetch` y `git rev-parse HEAD origin/mockup`. Además `git push -u origin claude/clinica-c0-base` y `gh pr create --base mockup --title "feat(clinica): contrato primero (C0)" --reviewer jsaldias39,PabloArauzCaballero`.
4. `REPORTE.md` (Completado / A medias / Pendiente / Evidencia / No cubierto / Desvíos / Riesgos / Decisiones / `// TODO C8`).
5. Sección «Carril C — Encuentro clínico · C0» en tu daily `Marcelo/Marcelo-Daily-Noche-2026-09-25.md` (sin tocar tus secciones de Farmacia y Carga Masiva) y push a `main`. Aviso a Itzan, Justin y Pablo (`SendMessage` si comparten máquina; si no, por el canal del equipo): «C0 en origin/mockup @ <sha>; arranquen C1, C2, C4, C5, C9».

## 6. Lo que NO hacés

**OUT:** Implementar ningún bloque de verdad · tocar `patient-chart.ts` (es de C3) · tocar `medication-block`, `diagnosis-block`, `agenda`, `account/**` · cambiar comportamiento de los handlers que mudás · `prettier --write` sobre fixtures · esperar a nadie: si a las 3 h no terminaste, pusheá lo que compile y pase, anotá lo que falta para C8 y avisá.

## Ambigüedades registradas

| Ambigüedad | Supuesto que se toma | A quién se confirma |
|---|---|---|
| Ninguna registrada al repartir. Toda duda que aparezca en ejecución se anota acá y en el `PLAN.md` del carril, con el supuesto tomado, antes de resolverla | — | Pablo |

## Definition of Done del hito

Un hito es `HECHO` sólo cuando **todas** sus microtareas están `HECHO` con la salida de su DoD
pegada en `evidencia/`, la regresión del módulo tocado está en verde y los gates aplicables del
repo pasaron. Falta cualquiera de las tres → el hito es `A MEDIAS`, con qué anda, qué no anda y
qué falta exactamente.
