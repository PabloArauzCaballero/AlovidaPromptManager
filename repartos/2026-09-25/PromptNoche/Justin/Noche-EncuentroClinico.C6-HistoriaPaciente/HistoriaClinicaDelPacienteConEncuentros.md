# C6 — Historia clínica del paciente: en estudio, enfermedades activas, históricos y la línea de cada encuentro

> **Rol:** dueño de «Mi historia clínica» (paciente) y del organismo compartido `encounter-timeline` · **Carril:** C6 · **Fecha:** 2026-09-25 · **Turno:** noche · **Ola B**
> **Plan maestro:** [`PLAN-MAESTRO.md`](../PLAN-MAESTRO.md) — §0.1, §0.2 (5), §0.3 D-6, §2, §3.7, §5, §6, §7 C6
> **Literal del propietario:** «esto activa una enfermedad en el paciente que tiene una duración específica, que … aparece en su historia clínica como diagnósticos históricos». Y el principio: cada hecho es un encuentro entre dos entidades — el paciente lo tiene que ver así.

## 0. Ficha de asignación

| Campo | Valor |
|---|---|
| `REPO` | `mantra-core-health`. **Nada de backend** |
| `TARGET_REF` | `origin/mockup` con el commit de C0 (y, si ya están, los de C1–C4: `git log --oneline -20 origin/mockup`) |
| `RAMA` | `claude/clinica-c6-historia-paciente` |
| `WORKTREE` | `C:/Users/DELL/Documents/Github/Alovida/wt-clinica-c6` |
| `PUERTO` | `4216` |
| `ARCHIVOS RESERVADOS` | `src/app/features/account/medical-record/**` (menos `where-to-buy/**`) · `shared/components/organisms/encounter-timeline/**` (nuevo) · `shared/utils/clinical-pdf/from-summary.ts` y `historia*.ts` (**sólo** secciones nuevas de la historia) · `playwright/clinica-c6-historia-paciente.spec.ts` · `playwright/nova-patient-experience.spec.ts` (sólo si tu cambio lo rompe) · `docs/trabajo/2026-09-25-encuentro-clinico/c6/**` |
| `ARCHIVOS DE OTROS` | todo lo del doctor (C1–C5, C7) · clientes de `core/data-access` (consumís `getSummary`, `getChart`, `searchBookings`, `getOwnOrders` tal como están) · `account/diagnostic-orders/**` (C9) · tipos congelados (C0) · la sección de receta del PDF (C5: si coincidís en una función, agregás otra y C8 unifica) |
| `CUENTAS` | `paciente@alovida.mock` |
| `DÓNDE SE PRUEBA` | `/my-account/medical-record` («Mi historia clínica»); `/design-system/stock` para el organismo |
| `LÍMITE DE RECURSOS` | un `yarn start`, un build/test a la vez, Playwright sólo vía `pw-guard` |

## 1. Estándar y skills

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

| ID | Microtarea | CA | DoD |
|---|---|---|---|
| C6.H1.M1 | Arranque, estándar, baseline, `PLAN.md`; capturas «antes» | — | baseline |
| C6.H2.M1 | `encounter-timeline` organismo + spec + stock | Se ve en `/design-system/stock` con datos de muestra | `yarn stock:generate` · spec |
| C6.H3.M1 | Pestaña «Diagnósticos» | Con la seed hay uno en cada bloque para el primer paciente | spec |
| C6.H3.M2 | «Atenciones» con `EncounterInHistory` (renombra `AtencionVisible`) y la línea al desplegar | Desplegar no dispara N peticiones al cargar | spec + pestaña Red en captura |
| C6.H3.M3 | «Qué nunca ve el paciente» | HTML renderizado sin uuid de 36 caracteres | Playwright asserta |
| C6.H3.M4 | PDF «Descargar tu historia» con las secciones nuevas | Se abre y las tiene (compilar y renderizar con pdf.js) | evidencia |
| C6.H4.M1 | Playwright `clinica-c6-historia-paciente.spec.ts` | verde | `node scripts/pw-guard.mjs --port 4216 --spec playwright/clinica-c6-historia-paciente.spec.ts --serve` |
| C6.H4.M2 | Capturas cinco viewports, claro/oscuro; Regla 8 medida (≤ 2 px, ≥ 85 %); `critical-double-review` | — | capturas |
| C6.H5.M1 | Revisores (incl. `regression-auditor`), gates, commits, push a `mockup`, PR, `REPORTE.md`, daily en `main` | — | — |

## 6. Playwright

`node scripts/pw-guard.mjs --port 4216 --spec playwright/clinica-c6-historia-paciente.spec.ts --serve` (background). Recorrido: paciente → Mi historia → pestaña Diagnósticos → `historia-en-estudio`, `historia-activas`, `historia-historicos` presentes → Atenciones → desplegar la primera → `historia-linea-encuentro` con al menos nota y diagnóstico → si hay `historia-reconsulta`, la asserta → descargar PDF (evento `download`) → `page.reload()` → la pestaña activa se conserva. Asserta que `document.body.innerText` no contiene un uuid.

## 7. Cierre

Checklist §9. Commits `feat(historia-clinica): diagnósticos por estado y línea del encuentro`, `feat(shared): organismo encounter-timeline`, `feat(pdf): historia con diagnósticos y encuentros`. Push a `mockup` verificado + rama + PR. `REPORTE.md` con lo que se omitió porque C1–C4 no habían llegado (para C8). Daily `C6-HistoriaPaciente/C6-Daily-Noche-2026-09-25.md` aquí y push a `main`.

## 8. Lo que NO hacés

Tocar clientes ni handlers · tocar «Mis órdenes» (C9) · montar el organismo en pantallas del doctor (C8) · tipos congelados.
