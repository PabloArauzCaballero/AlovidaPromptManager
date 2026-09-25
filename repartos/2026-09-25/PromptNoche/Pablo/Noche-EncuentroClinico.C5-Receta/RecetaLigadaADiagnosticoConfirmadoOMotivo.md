# C5 — Receta: siempre ligada a un diagnóstico confirmado, o con motivo plano; vincular después

> **Rol:** dueño de la receta (bloque, reglas del simulador de recetas, sección Diagnóstico/Motivo del PDF) · **Responsable:** Pablo · **Carril:** C5 · **Fecha:** 2026-09-25 · **Turno:** noche · **Ola A**
> **Plan maestro:** [`PLAN-MAESTRO.md`](../../../../../docs/trabajo/2026-09-25-plan-y-reparto-encuentro-clinico/PLAN-MAESTRO.md) — §0.2 (4), §0.3 D-3, §2, §3.6, §5, §6, §7 C5
> **Literal del propietario:** «en base a un diagnóstico realizado se da una receta médica … en todo momento se puede linkear a un diagnóstico confirmado o por motivo plano».

## 0. Ficha de asignación

| Campo | Valor |
|---|---|
| `REPO` | `mantra-core-health`. **Nada de backend** |
| `TARGET_REF` | `origin/mockup` con el commit de C0 |
| `RAMA` | `claude/clinica-c5-receta` |
| `WORKTREE` | `<raíz de tus repos>/wt-clinica-c5` |
| `PUERTO` | `4215` |
| `ARCHIVOS RESERVADOS` | `src/app/features/clinical-record/patient-chart/medication-block/**` · `core/mock/handlers/clinical.handlers.ts` (+ spec; **sólo** el bloque de `medication-requests`, líneas 299-349 tras las mudanzas de C0, y sus `attachments`) · `shared/utils/clinical-pdf/**` (**sólo** la sección Diagnóstico/Motivo de la receta) · `playwright/clinica-c5-receta.spec.ts` · `playwright/prescription-official-pdf.spec.ts` (ajustar) · `docs/trabajo/2026-09-25-encuentro-clinico/c5/**` |
| `ARCHIVOS DE OTROS` | `diagnosis-block/**`, `patient-chart.*` (C3) · `where-to-buy/**` · favoritos (`misc.handlers.ts`) · `consultation/**`, tipos congelados (C0) · `medical-notes.handlers.ts` (C1) · `diagnostics.handlers.ts` (C2) · `account/medical-record/**` (C6; si la función del PDF de la historia coincide con la tuya, C6 agrega otra y C8 unifica) |
| `CUENTAS` | `medica@alovida.mock` |
| `DÓNDE SE PRUEBA` | consulta → `consulta-casilla-medicacion`; expediente → pestaña «Medicación» |
| `LÍMITE DE RECURSOS` | un `yarn start`, un build/test a la vez, Playwright sólo vía `pw-guard` |
| `TUS OTROS CARRILES ESTA NOCHE` | Farmacia: `Noche-Farmacia.CarritoYNavegacion` · Carga Masiva: `Noche-CargaMasiva.IntegracionYEntrega`. Sin cruces de archivos con ellos (verificado). Tu daily es uno solo (`Pablo-Daily-Noche-2026-09-25.md`): este carril va en su sección «Carril C — Encuentro clínico». |

## 1. Antes de escribir una línea — instalación OBLIGATORIA del estándar

```bash
git -C <raíz de tus repos>/AlovidaPromptManager pull --ff-only origin main
cd <raíz de tus repos>/wt-clinica-c5
cp -rn ../AlovidaPromptManager/.claude/skills/* .claude/skills/     # fusionar, NO pisar las 4 skills y 3 agentes del repo
cp -rn ../AlovidaPromptManager/.claude/rules .claude/ 2>/dev/null || cp -rn ../AlovidaPromptManager/.claude/rules/* .claude/rules/
cp -rn ../AlovidaPromptManager/.claude/hooks .claude/ 2>/dev/null || true
ls .claude/skills | wc -l; ls .claude/rules/[0-9]*.md | wc -l; python .claude/hooks/plan_gate.py --self-test   # pegá las tres salidas en tu daily
```

Los `.claude/` instalados **no se commitean**. Si no podés completar este paso estás `BLOQUEADO`: avisá y no sigas.

§5.1 del plan. **Skills:** `skills-router` → `outcome-first` → `context-thrift` → `factual-discovery` → `anti-hallucination-guard` → `milestone-planning` → `scope-discipline` → `lane-authoring` → `data-privacy-phi` → `medication-prescription-safety` → `clinical-records` → `frontend-ui-design` → `frontend-forms-ux` → `angular-forms` → `angular-development` → `angular-signals-state` → `frontend-ux-states` → `frontend-accessibility` → `ux-writing-microcopy` → `native-code-patterns` → `unit-testing` → `angular-testing` → `e2e-playwright` → (cierre) `frontend-beautiful-ui` → `ui-quality-review` → `visual-proof` → `critical-double-review` → `evidence-and-verification` → `work-report-md` → `pr-mergeable-gate` → `finish-your-turn`. Del repo: `project-design-system`, `frontend-production-gate`, `visual-quality-gate`; agentes `visual-reviewer`, `frontend-reviewer`.

`PLAN.md` propio antes del primer edit.

## 2. Resultado observable y kill-test

En la consulta, «Receta»: «¿Para qué es esta receta?» lista **sólo diagnósticos confirmados** («Confirmado el <fecha>») y la opción «Otro motivo (escribir)» que muestra el textarea «Motivo»; el simulador rechaza con 422 el presuntivo y la receta sin diagnóstico ni motivo, y el modal lo muestra sin cerrarse. La lista de recetas y el PDF dicen «Diagnóstico: X» o «Motivo: …». En las recetas con motivo plano, «Acciones → Vincular a un diagnóstico…» liga después a un confirmado (`POST /clinical/medication-requests/:id/edit`, sólo en borrador; emitida → 409 visible).

**Kill-test:** si el selector muestra un diagnóstico presuntivo, C5 no está hecho.

## 3. Contrato que implementás (§3.6)

- `POST /clinical/medication-requests`: 422 `VALIDATION` si no viene ni `indicationConditionId` ni `indicationText`; 422 si `indicationConditionId` apunta a una condición que no está en `DXV-CONFIRMED` («La receta sólo se liga a un diagnóstico confirmado»); si vienen los dos, gana la condición y `indicationText` se descarta (criterio P24).
- `POST /clinical/medication-requests/:id/edit` (existe en la API `clinical-records.controller.ts`; **no** existe en el mock: agregala): acepta `indicationConditionId` / `indicationText` con las mismas reglas, sólo en borrador (`MR_DRAFT` / `ST-DRAFT`); 409 si emitida.
- Lectura (`summary.medicationRequests`) trae los dos campos.
- Los diagnósticos confirmados se reconocen por el **código** `DXV-CONFIRMED` resuelto por catálogo (`TerminologyClient`), nunca por uuid pegado.

## 4. Diseño exigido

`app-select` (ADR-0013) con grupo «Diagnósticos confirmados» (nombre + «Confirmado el <fecha>») y la opción «Otro motivo (escribir)»; al elegirla aparece `app-textarea` «Motivo» (≤ 200, contador, obligatorio). Guardar deshabilitado sin diagnóstico ni motivo. Errores del servidor dentro del modal (S4/S9). En la lista, `receta-vinculo` como `app-badge` «Diagnóstico: …» / «Motivo: …»; `app-row-actions` con texto: «Vincular a un diagnóstico…» abre `app-content-dialog` con el mismo `app-select`; emitida → ítem deshabilitado con tooltip «Ya emitida». PDF: sección «Diagnóstico» con nombre o «Motivo: …», nunca vacía. Renombrar en tu carpeta `DiagnosticoEnFicha`→`DiagnosisOption`, `RecetaEnFicha`→`PrescriptionInChart`. Tokens; cinco viewports; tema oscuro.

## 5. Microtareas

### H1 — Arranque y baseline

**CA:** Todas las microtareas de H1 cumplen su criterio binario de la tabla.
**DoD:** Los DoD de sus microtareas, ejecutados y con su salida pegada en `evidencia/`.
**Estado:** TODO

#### H1.S1 — Arranque y baseline

**CA:** El mismo de H1: el hito se entrega en una sola subtarea.
**DoD:** El mismo de H1: los DoD de las microtareas de abajo.
**Estado:** TODO

| ID | Microtarea | CA | DoD |
|---|---|---|---|
| H1.S1.M1 | Arranque, estándar, baseline, `PLAN.md` | — | baseline |

### H2 — Reglas del simulador

**CA:** Todas las microtareas de H2 cumplen su criterio binario de la tabla.
**DoD:** Los DoD de sus microtareas, ejecutados y con su salida pegada en `evidencia/`.
**Estado:** TODO

#### H2.S1 — Reglas del simulador

**CA:** El mismo de H2: el hito se entrega en una sola subtarea.
**DoD:** El mismo de H2: los DoD de las microtareas de abajo.
**Estado:** TODO

| ID | Microtarea | CA | DoD |
|---|---|---|---|
| H2.S1.M1 | Reglas del handler + ruta `/:id/edit` | spec: 6 casos (sin nada 422 · presuntivo 422 · confirmado 201 · motivo 201 · ambos → gana condición · edit emitida 409) | `yarn test --watch=false --include=src/app/core/mock/handlers/clinical.handlers.spec.ts --include=src/app/core/mock/mock-backend.spec.ts` |

### H3 — Selector, errores, lista y PDF

**CA:** Todas las microtareas de H3 cumplen su criterio binario de la tabla.
**DoD:** Los DoD de sus microtareas, ejecutados y con su salida pegada en `evidencia/`.
**Estado:** TODO

#### H3.S1 — Selector, errores, lista y PDF

**CA:** El mismo de H3: el hito se entrega en una sola subtarea.
**DoD:** El mismo de H3: los DoD de las microtareas de abajo.
**Estado:** TODO

| ID | Microtarea | CA | DoD |
|---|---|---|---|
| H3.S1.M1 | Selector filtrado + «Otro motivo» + renombres | Guardar deshabilitado sin diagnóstico ni motivo | spec |
| H3.S1.M2 | Errores en el modal | forzado con presuntivo | captura |
| H3.S1.M3 | Lista: vínculo + «Vincular a un diagnóstico…» | Emitida deshabilitada con «Ya emitida» | spec |
| H3.S1.M4 | PDF con Diagnóstico/Motivo; `prescription-official-pdf.spec.ts` ajustado | nunca vacío | comando |

### H4 — Recorrido y capturas

**CA:** Todas las microtareas de H4 cumplen su criterio binario de la tabla.
**DoD:** Los DoD de sus microtareas, ejecutados y con su salida pegada en `evidencia/`.
**Estado:** TODO

#### H4.S1 — Recorrido y capturas

**CA:** El mismo de H4: el hito se entrega en una sola subtarea.
**DoD:** El mismo de H4: los DoD de las microtareas de abajo.
**Estado:** TODO

| ID | Microtarea | CA | DoD |
|---|---|---|---|
| H4.S1.M1 | Playwright `clinica-c5-receta.spec.ts` | verde | `node scripts/pw-guard.mjs --port 4215 --spec playwright/clinica-c5-receta.spec.ts --spec playwright/prescription-official-pdf.spec.ts --serve` |
| H4.S1.M2 | Capturas cinco viewports, claro/oscuro; `critical-double-review` | — | capturas |

### H5 — Revisión y entrega

**CA:** Todas las microtareas de H5 cumplen su criterio binario de la tabla.
**DoD:** Los DoD de sus microtareas, ejecutados y con su salida pegada en `evidencia/`.
**Estado:** TODO

#### H5.S1 — Revisión y entrega

**CA:** El mismo de H5: el hito se entrega en una sola subtarea.
**DoD:** El mismo de H5: los DoD de las microtareas de abajo.
**Estado:** TODO

| ID | Microtarea | CA | DoD |
|---|---|---|---|
| H5.S1.M1 | Revisores, gates, commits, push a `mockup`, PR, `REPORTE.md` (P24 referenciado), daily en `main` | — | — |


## 6. Playwright

`node scripts/pw-guard.mjs --port 4215 --spec playwright/clinica-c5-receta.spec.ts --spec playwright/prescription-official-pdf.spec.ts --serve` (background). Recorrido: médica → Iniciar consulta → `consulta-casilla-medicacion` → `receta-diagnostico` no contiene el nombre del presuntivo de la seed → elegir confirmado → `receta-guardar` → `receta-item` con «Diagnóstico: …» → nueva → «Otro motivo» → `receta-motivo` → guardar → «Motivo: …» → `page.reload()` → siguen → `receta-vincular` sobre la de motivo → elegir confirmado → badge cambia.

## 7. Cierre

Checklist §9. Commits `feat(receta): sólo diagnósticos confirmados o motivo plano`, `feat(mock): reglas de la receta y edición del borrador`, `feat(pdf): diagnóstico o motivo en la receta`. Push a `mockup` verificado + rama + PR. `REPORTE.md` referencia P24 (no lo duplica) y anota si `/:id/edit` necesita algo más en la API. Sección «Carril C — Encuentro clínico · C5» de tu daily `Pablo/Pablo-Daily-Noche-2026-09-25.md` (sin tocar tus secciones de Farmacia y Carga Masiva) y push a `main`.

## 8. Lo que NO hacés

**OUT:** Tocar `diagnosis-block` ni `patient-chart` (C3) · favoritos · `where-to-buy` · tipos congelados · esperar a C3: los confirmados de la seed ya existen desde antes de esta noche.

## Ambigüedades registradas

| Ambigüedad | Supuesto que se toma | A quién se confirma |
|---|---|---|
| Ninguna registrada al repartir. Toda duda que aparezca en ejecución se anota acá y en el `PLAN.md` del carril, con el supuesto tomado, antes de resolverla | — | Pablo |

## Definition of Done del hito

Un hito es `HECHO` sólo cuando **todas** sus microtareas están `HECHO` con la salida de su DoD
pegada en `evidencia/`, la regresión del módulo tocado está en verde y los gates aplicables del
repo pasaron. Falta cualquiera de las tres → el hito es `A MEDIAS`, con qué anda, qué no anda y
qué falta exactamente.
