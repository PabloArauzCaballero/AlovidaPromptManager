# C6 — Historia clínica del paciente: en estudio, enfermedades activas, históricos y la línea de cada encuentro

> **Rol:** dueño de «Mi historia clínica» (paciente) y del organismo compartido `encounter-timeline` · **Responsable:** Justin · **Carril:** C6 · **Fecha:** 2026-09-25 · **Turno:** noche · **Ola B**
> **Plan maestro:** [`PLAN-MAESTRO.md`](../../../../../docs/trabajo/2026-09-25-plan-y-reparto-encuentro-clinico/PLAN-MAESTRO.md) — §0.1, §0.2 (5), §0.3 D-6, §2, §3.7, §5, §6, §7 C6
> **Literal del propietario:** «esto activa una enfermedad en el paciente que tiene una duración específica, que … aparece en su historia clínica como diagnósticos históricos». Y el principio: cada hecho es un encuentro entre dos entidades — el paciente lo tiene que ver así.

## 0. Ficha de asignación

| Campo | Valor |
|---|---|
| `REPO` | `mantra-core-health`. **Nada de backend** |
| `TARGET_REF` | `origin/mockup` con el commit de C0 (y, si ya están, los de C1–C4: `git log --oneline -20 origin/mockup`) |
| `RAMA` | `claude/clinica-c6-historia-paciente` |
| `WORKTREE` | `<raíz de tus repos>/wt-clinica-c6` |
| `PUERTO` | `4216` |
| `ARCHIVOS RESERVADOS` | `src/app/features/account/medical-record/**` (menos `where-to-buy/**`) · `shared/components/organisms/encounter-timeline/**` (nuevo) · `shared/utils/clinical-pdf/from-summary.ts` y `historia*.ts` (**sólo** secciones nuevas de la historia) · `playwright/clinica-c6-historia-paciente.spec.ts` · `playwright/nova-patient-experience.spec.ts` (sólo si tu cambio lo rompe) · `docs/trabajo/2026-09-25-encuentro-clinico/c6/**` |
| `ARCHIVOS DE OTROS` | todo lo del doctor (C1–C5, C7) · clientes de `core/data-access` (consumís `getSummary`, `getChart`, `searchBookings`, `getOwnOrders` tal como están) · `account/diagnostic-orders/**` (C9) · tipos congelados (C0) · la sección de receta del PDF (C5: si coincidís en una función, agregás otra y C8 unifica) |
| `CUENTAS` | `paciente@alovida.mock` |
| `DÓNDE SE PRUEBA` | `/my-account/medical-record` («Mi historia clínica»); `/design-system/stock` para el organismo |
| `LÍMITE DE RECURSOS` | un `yarn start`, un build/test a la vez, Playwright sólo vía `pw-guard` |
| `TUS OTROS CARRILES ESTA NOCHE` | Farmacia: `Noche-Farmacia.TiendaYReceta` · Carga Masiva: `Noche-CargaMasiva.PantallaDragAndDrop`. **Cruce en la carpeta `account/medical-record/`:** tu carril Farmacia reserva `where-to-buy/**` y este carril lo excluye. No toques `medical-record.{ts,html,css,spec.ts}` desde la rama de Farmacia ni `where-to-buy/**` desde ésta; nunca dos worktrees abiertos sobre la misma carpeta. Tu daily es uno solo (`Justin-Daily-Noche-2026-09-25.md`): este carril va en su sección «Carril C — Encuentro clínico». |

## 1. Antes de escribir una línea — instalación OBLIGATORIA del estándar

```bash
git -C <raíz de tus repos>/AlovidaPromptManager pull --ff-only origin main
cd <raíz de tus repos>/wt-clinica-c6
cp -rn ../AlovidaPromptManager/.claude/skills/* .claude/skills/     # fusionar, NO pisar las 4 skills y 3 agentes del repo
cp -rn ../AlovidaPromptManager/.claude/rules .claude/ 2>/dev/null || cp -rn ../AlovidaPromptManager/.claude/rules/* .claude/rules/
cp -rn ../AlovidaPromptManager/.claude/hooks .claude/ 2>/dev/null || true
ls .claude/skills | wc -l; ls .claude/rules/[0-9]*.md | wc -l; python .claude/hooks/plan_gate.py --self-test   # pegá las tres salidas en tu daily
```

Los `.claude/` instalados **no se commitean**. Si no podés completar este paso estás `BLOQUEADO`: avisá y no sigas.

§5.1 del plan. **Skills:** `skills-router` → `outcome-first` → `context-thrift` → `factual-discovery` → `anti-hallucination-guard` → `milestone-planning` → `scope-discipline` → `lane-authoring` → `data-privacy-phi` (la pantalla del paciente es la más sensible) → `clinical-records` → `frontend-ui-design` → `visual-hierarchy-composition` → `atomic-design-components` → `smart-dumb-components` → `component-architecture-solid` → `angular-development` → `angular-signals-state` → `frontend-ux-states` → `frontend-responsive-layout` → `frontend-accessibility` → `ux-clarity-usability` → `ux-writing-microcopy` → `native-code-patterns` → `unit-testing` → `angular-testing` → `e2e-playwright` → (cierre) `frontend-beautiful-ui` → `ui-quality-review` → `visual-proof` → `critical-double-review` → `evidence-and-verification` → `work-report-md` → `pr-mergeable-gate` → `finish-your-turn`. Del repo: `project-design-system` (Regla 8), `frontend-production-gate`, `visual-quality-gate`; agentes `visual-reviewer`, `frontend-reviewer`, `regression-auditor` (creás un organismo compartido).

`PLAN.md` propio antes del primer edit.

## 2. Resultado observable y kill-test

`paciente@alovida.mock` → «Mi historia clínica»: una pestaña nueva **«Diagnósticos»** con tres bloques (En estudio · Enfermedades activas con «hasta <fecha>» o «crónica» · Históricos con la razón: «resuelto el <fecha>» o el motivo del rechazo) y, en «Atenciones», cada atención se despliega en una **línea del encuentro**: nota médica (tabla de filas), órdenes de análisis (tipo y estado), diagnósticos con su estado, reconsulta agendada, recetas con «Diagnóstico»/«Motivo». «Descargar tu historia» incluye lo mismo. Ningún uuid ni código en pantalla.

**Kill-test:** si un diagnóstico rechazado aparece como enfermedad activa, C6 no está hecho.

## 3. Lo que consumís (§3.7)

- Diagnósticos: `summary.conditions` + `diagnosisStateOf` / `DIAGNOSIS_STATE_LABELS` (`shared/clinical/diagnosis-state.ts`, C0) con los códigos `DXV-CONFIRMED`, `DXV-REFUTED`, `COND-ACTIVE` resueltos por catálogo. «hasta» = `expectedResolutionAt`; «crónica» = curso crónico; históricos con `verification.reasonText` (si C3 lo dejó) o `resolvedAt`.
- Línea del encuentro (por `encounterId`): `chart.notes` (con `entries` si C1 lo dejó; si no, texto), `getOwnOrders()` (al primer despliegue, no al cargar; `category` si C2 lo dejó, si no, por `categoryConceptId`), `summary.conditions`, `summary.medicationRequests` (`indicationConditionId` → nombre, o `indicationText`), reconsulta = `searchBookings({ patientProfileId })` con `followUpOf?.encounterId === id` (si C4 lo dejó). **Todo lo que no llegue se omite sin romper.**
- Organismo `app-encounter-timeline` (`shared/components/organisms/encounter-timeline/`): recibe `{ encounter, notes, orders, conditions, prescriptions, followUp }` **ya resueltos y rotulados**, sin clientes adentro; ordena cronológicamente nota → orden → diagnóstico → reconsulta → receta; spec y entrada en el stock (`yarn stock:generate`). C8 lo monta después en la consulta y el expediente del doctor.

## 4. Diseño exigido

Regla 8: **una** `app-card` con `app-tabs` (Atenciones · Recetas · Alergias · Resultados · **Diagnósticos**), centrada, a lo ancho; el aside «Descargar tu historia» se conserva. Pestaña «Diagnósticos»: tres `app-fact-section`/bloques con `app-badge` de estado y `app-fact-list` (nombre, desde, hasta/crónica, quién lo confirmó, por qué). «Atenciones»: `app-accordion` por atención (fecha, profesional, motivo, sello Cerrada/En curso); al desplegar, `app-encounter-timeline` con riel vertical de fechas, un `app-data-type-icon`/`app-service-icon` por hecho, `app-fact-list` por ítem, `app-badge`. Rótulos para paciente: «Nota #a1b2», «Análisis de laboratorio: Hemograma — resultado disponible», «Diagnóstico confirmado: Hipertensión — activa hasta 24/11», «Reconsulta el 02/10 a las 10:30», «Receta: Losartán — por Hipertensión». Estados M34 (`app-view-state-host`), S3 «Todavía no tenés diagnósticos registrados». Tokens; cinco viewports; tema oscuro; `prefers-reduced-motion`.

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
| H1.S1.M1 | Arranque, estándar, baseline, `PLAN.md`; capturas «antes» | — | baseline |

### H2 — Organismo de línea de tiempo

**CA:** Todas las microtareas de H2 cumplen su criterio binario de la tabla.
**DoD:** Los DoD de sus microtareas, ejecutados y con su salida pegada en `evidencia/`.
**Estado:** TODO

#### H2.S1 — Organismo de línea de tiempo

**CA:** El mismo de H2: el hito se entrega en una sola subtarea.
**DoD:** El mismo de H2: los DoD de las microtareas de abajo.
**Estado:** TODO

| ID | Microtarea | CA | DoD |
|---|---|---|---|
| H2.S1.M1 | `encounter-timeline` organismo + spec + stock | Se ve en `/design-system/stock` con datos de muestra | `yarn stock:generate` · spec |

### H3 — Pestañas de la historia y PDF

**CA:** Todas las microtareas de H3 cumplen su criterio binario de la tabla.
**DoD:** Los DoD de sus microtareas, ejecutados y con su salida pegada en `evidencia/`.
**Estado:** TODO

#### H3.S1 — Pestañas de la historia y PDF

**CA:** El mismo de H3: el hito se entrega en una sola subtarea.
**DoD:** El mismo de H3: los DoD de las microtareas de abajo.
**Estado:** TODO

| ID | Microtarea | CA | DoD |
|---|---|---|---|
| H3.S1.M1 | Pestaña «Diagnósticos» | Con la seed hay uno en cada bloque para el primer paciente | spec |
| H3.S1.M2 | «Atenciones» con `EncounterInHistory` (renombra `AtencionVisible`) y la línea al desplegar | Desplegar no dispara N peticiones al cargar | spec + pestaña Red en captura |
| H3.S1.M3 | «Qué nunca ve el paciente» | HTML renderizado sin uuid de 36 caracteres | Playwright asserta |
| H3.S1.M4 | PDF «Descargar tu historia» con las secciones nuevas | Se abre y las tiene (compilar y renderizar con pdf.js) | evidencia |

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
| H4.S1.M1 | Playwright `clinica-c6-historia-paciente.spec.ts` | verde | `node scripts/pw-guard.mjs --port 4216 --spec playwright/clinica-c6-historia-paciente.spec.ts --serve` |
| H4.S1.M2 | Capturas cinco viewports, claro/oscuro; Regla 8 medida (≤ 2 px, ≥ 85 %); `critical-double-review` | — | capturas |

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
| H5.S1.M1 | Revisores (incl. `regression-auditor`), gates, commits, push a `mockup`, PR, `REPORTE.md`, daily en `main` | — | — |


## 6. Playwright

`node scripts/pw-guard.mjs --port 4216 --spec playwright/clinica-c6-historia-paciente.spec.ts --serve` (background). Recorrido: paciente → Mi historia → pestaña Diagnósticos → `historia-en-estudio`, `historia-activas`, `historia-historicos` presentes → Atenciones → desplegar la primera → `historia-linea-encuentro` con al menos nota y diagnóstico → si hay `historia-reconsulta`, la asserta → descargar PDF (evento `download`) → `page.reload()` → la pestaña activa se conserva. Asserta que `document.body.innerText` no contiene un uuid.

## 7. Cierre

Checklist §9. Commits `feat(historia-clinica): diagnósticos por estado y línea del encuentro`, `feat(shared): organismo encounter-timeline`, `feat(pdf): historia con diagnósticos y encuentros`. Push a `mockup` verificado + rama + PR. `REPORTE.md` con lo que se omitió porque C1–C4 no habían llegado (para C8). Sección «Carril C — Encuentro clínico · C6» de tu daily `Justin/Justin-Daily-Noche-2026-09-25.md` (sin tocar tus secciones de Farmacia y Carga Masiva) y push a `main`.

## 8. Lo que NO hacés

**OUT:** Tocar clientes ni handlers · tocar «Mis órdenes» (C9) · montar el organismo en pantallas del doctor (C8) · tipos congelados.

## Ambigüedades registradas

| Ambigüedad | Supuesto que se toma | A quién se confirma |
|---|---|---|
| Ninguna registrada al repartir. Toda duda que aparezca en ejecución se anota acá y en el `PLAN.md` del carril, con el supuesto tomado, antes de resolverla | — | Pablo |

## Definition of Done del hito

Un hito es `HECHO` sólo cuando **todas** sus microtareas están `HECHO` con la salida de su DoD
pegada en `evidencia/`, la regresión del módulo tocado está en verde y los gates aplicables del
repo pasaron. Falta cualquiera de las tres → el hito es `A MEDIAS`, con qué anda, qué no anda y
qué falta exactamente.
