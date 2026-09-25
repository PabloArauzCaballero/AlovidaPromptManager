# C2 — Orden de análisis desde la consulta: laboratorio, imagenología u otro, a partir de las notas

> **Rol:** dueño de la orden de análisis (bloque, cliente, simulador de diagnóstico, seed de órdenes) · **Responsable:** Itzan · **Carril:** C2 · **Fecha:** 2026-09-25 · **Turno:** noche · **Ola A**
> **Plan maestro:** [`PLAN-MAESTRO.md`](../../../../../docs/trabajo/2026-09-25-plan-y-reparto-encuentro-clinico/PLAN-MAESTRO.md) — §0.2 (2a), §2, §3.3, §5, §6, §7 C2
> **Literal del propietario:** «en base a estas observaciones … puede generar una orden de análisis clínico, que … puede ser imagenología, análisis de laboratorio u otro». Y C9 necesita de vos `category` en la lectura del paciente y una seed con volumen.

## 0. Ficha de asignación

| Campo | Valor |
|---|---|
| `REPO` | `mantra-core-health`. **Nada de backend** |
| `TARGET_REF` | `origin/mockup` con el commit de C0 (verificar con `git log --oneline -8 origin/mockup`) |
| `RAMA` | `claude/clinica-c2-ordenes-analisis` |
| `WORKTREE` | `<raíz de tus repos>/wt-clinica-c2` |
| `PUERTO` | `4212` |
| `ARCHIVOS RESERVADOS` | `src/app/features/clinical-record/patient-chart/analysis-order-block/**` (ya renombrado por C0) · `core/data-access/diagnostics/diagnostics.client.ts` (+ spec) · `core/mock/handlers/diagnostics.handlers.ts` (+ spec) · `core/mock/fixtures/clinica.ts` **sólo líneas 462-504** (`OrdenSimulada`, `ordenes`) · `features/diagnostics/**` («Laboratorio e imagen» del doctor) · `playwright/clinica-c2-orden-analisis.spec.ts` · `docs/trabajo/2026-09-25-encuentro-clinico/c2/**` |
| `ARCHIVOS DE OTROS` | `account/diagnostic-orders/**` (C9) · `diagnostic-results/**` · `fixtures/clinica.ts` fuera de tu región (C3) · `medical-notes.handlers.ts`, `chart-notes.client.ts` (C1) · `consultation/**`, tipos congelados (C0) · `clinical.handlers.ts` (C5) |
| `CUENTAS` | `medica@alovida.mock`; para verificar la lectura del paciente `paciente@alovida.mock` |
| `DÓNDE SE PRUEBA` | consulta → casilla «Orden de análisis» (`consulta-casilla-ordenes`); `/diagnostics`; y `GET /diagnostic-results/me/orders` desde el spec del handler |
| `LÍMITE DE RECURSOS` | un `yarn start`, un build/test a la vez, Playwright sólo vía `pw-guard` |
| `TUS OTROS CARRILES ESTA NOCHE` | Farmacia: `Noche-Farmacia.PaginaDeFarmaciaYQA` · Carga Masiva (API): `Noche-CargaMasiva.MotorDryRunIdempotencia`. Sin cruces de archivos con ellos (verificado). Tu daily es uno solo (`Itzan-Daily-Noche-2026-09-25.md`): este carril va en su sección «Carril C — Encuentro clínico». |

## 1. Estándar y skills

§5.1 del plan. **Skills:** `skills-router` → `outcome-first` → `context-thrift` → `factual-discovery` → `anti-hallucination-guard` → `milestone-planning` → `scope-discipline` → `lane-authoring` → `data-privacy-phi` → `clinical-records` → `terminology-value-sets` → `frontend-ui-design` → `visual-hierarchy-composition` → `frontend-forms-ux` → `angular-forms` → `angular-development` → `angular-signals-state` → `frontend-data-tables` → `frontend-ux-states` → `frontend-responsive-layout` → `frontend-accessibility` → `synthetic-test-data-generation` (para la seed) → `native-code-patterns` → `unit-testing` → `angular-testing` → `e2e-playwright` → (cierre) `frontend-beautiful-ui` → `ui-quality-review` → `visual-proof` → `critical-double-review` → `evidence-and-verification` → `work-report-md` → `pr-mergeable-gate` → `finish-your-turn`. Del repo: `project-design-system`, `frontend-production-gate`, `visual-quality-gate`; agentes `visual-reviewer`, `frontend-reviewer`.

`PLAN.md` propio antes del primer edit.

## 2. Resultado observable y kill-test

En la consulta, «Orden de análisis» abre el bloque con **tipo** (Laboratorio · Imagenología · Otro) que filtra el catálogo de estudios, la lista de **notas médicas de este encuentro con checkbox** «Basada en esta nota», prioridad y motivo; guarda con `POST /clinical/service-requests`. Debajo, las órdenes del encuentro con tipo, estado y «según nota #…». `GET /diagnostics/patients/:id/orders` **y** `GET /diagnostic-results/me/orders` devuelven `category`. El paciente demo (`PACIENTE` = `PACIENTES[0]`) tiene 14 órdenes de tres tipos, cuatro estados, fechas de −400 a −3 días, 5 con informe liberado y 3 con preparación.

**Kill-test:** una orden guardada con «Basada en» marcada que vuelve del `GET /diagnostics/patients/:id/orders` sin `basedOnNoteIds`, o un `GET /diagnostic-results/me/orders` sin `category`, y C2 no está hecho.

## 3. Contrato que implementás (§3.3)

- `POST /clinical/service-requests` (ya mudado a tu archivo por C0) acepta `category: 'LAB'|'IMAGING'|'OTHER'` (→ `categoryConceptId` por `CATEGORIA_ORDEN`: `SRQ-LAB`, `SRQ-IMAGING`, `SRQ-OTHER`) y `basedOnNoteIds: string[]` (cada id existe en `notasMedicas` de C1 **o** en `notas` vieja, y es del mismo paciente; si no, 422 `VALIDATION`).
- `GET /diagnostics/patients/:id/orders` devuelve `category` (derivada del `categoryConceptId`: `SRQ-LAB`→`LAB`, `SRQ-IMAGING`→`IMAGING`, resto→`OTHER`), `basedOnNoteIds`, `encounterId`; filtro `?encounterId=`.
- `GET /diagnostic-results/me/orders` devuelve `category` con la misma derivación (C9 lo lee).
- `DiagnosticsClient.requestStudy` manda `category` y `basedOnNoteIds` sólo si vienen; `getPatientDiagnostics(id, { encounterId? })`.
- Si C1 no llegó, las notas del encuentro se leen igual por `GET /charts/notes?encounterId=` (C0 mudó la ruta; sin `entries` mientras C1 no la implemente) con un cliente mínimo propio `analysis-order-notes.client.ts` (1 método + spec, `// TODO C8: ChartNotesClient.listNotes`).

## 4. Diseño exigido

Tipo con `app-segmented-control` (tres opciones excluyentes que cambian el catálogo; justificación ADR-0013 escrita en el JSDoc). Estudio con `app-concept-select` filtrado por tipo (`STUDY-*` de laboratorio vs imagen: si el catálogo trae la categoría, usala; si no, un mapa local documentado). Notas del encuentro con `app-checkbox-group` («Basada en esta nota», con el «Nota #a1b2» y sus dos primeras filas como ayuda); con 0 notas: «No hay notas en esta consulta; podés pedir el análisis igual». Prioridad `app-select`. Lista de órdenes del encuentro con `app-data-table` `maxHeight` (ADR-0015 regla 6), `app-badge` por tipo, `app-status-seal` por estado, «según nota #…» como enlace ancla. Encuentro fijo en consulta (§3.1). Estados M34. Tokens; sin scroll lateral en 390.

## 5. Microtareas

| ID | Microtarea | CA | DoD |
|---|---|---|---|
| C2.H1.M1 | Arranque, estándar, baseline, `PLAN.md` | — | baseline |
| C2.H2.M1 | Seed (región 462-504): `OrdenSimulada` += `basedOnNoteIds`, `category`; 4 órdenes por paciente (2 citan `uuid('medical-note-<pid>-0')`); **14 órdenes para `PACIENTE`** (3 tipos, 4 estados, fechas −400…−3, 5 con informe liberado, 3 con `preparationInstructions`) | determinismo; spec verde | `diagnostics.handlers.spec.ts` |
| C2.H2.M2 | Handlers: alta con `category` y `basedOnNoteIds` (422), lecturas con `category` (doctor y paciente), filtro `encounterId` | spec: alta con/sin notas, 422 id ajeno, lectura filtrada, lectura del paciente con `category` | `yarn test --watch=false --include=src/app/core/mock/handlers/diagnostics.handlers.spec.ts --include=src/app/core/mock/mock-backend.spec.ts` |
| C2.H2.M3 | Cliente | cuerpos exactos | `yarn test --watch=false --include=src/app/core/data-access/diagnostics/**` |
| C2.H3.M1 | Bloque: tipo, catálogo filtrado, prioridad, motivo, encuentro fijo | Cambiar de tipo cambia las opciones | spec |
| C2.H3.M2 | «Basada en» con cliente mínimo propio | 0 notas → mensaje y se puede guardar | spec |
| C2.H3.M3 | Lista de órdenes del encuentro | Tras guardar aparece sin recargar | Playwright |
| C2.H3.M4 | `features/diagnostics`: columnas «Tipo» y «Según nota» | Se ve con la seed | captura |
| C2.H4.M1 | Playwright `clinica-c2-orden-analisis.spec.ts` | verde | `node scripts/pw-guard.mjs --port 4212 --spec playwright/clinica-c2-orden-analisis.spec.ts --serve` |
| C2.H4.M2 | Capturas cinco viewports, claro/oscuro; `critical-double-review` | — | capturas |
| C2.H5.M1 | Revisores, gates, commits, push a `mockup`, PR, `REPORTE.md` con **P40**, daily en `main` | — | — |

## 6. Playwright

`node scripts/pw-guard.mjs --port 4212 --spec playwright/clinica-c2-orden-analisis.spec.ts --serve` (background). Recorrido: médica → Iniciar consulta → `consulta-casilla-ordenes` → `orden-tipo-LAB` → estudio → `orden-basada-en-nota` (si hay nota; si no, el test lo salta y lo imprime) → `orden-guardar` → `orden-item` → `page.reload()` → sigue. Sin `networkidle`; rojo legítimo → `e2e-failure-triage`.

## 7. Cierre

Checklist §9 del plan. Commits `feat(orden-analisis): …`, `feat(mock): órdenes con tipo y notas de base; seed del paciente demo`. Push a `mockup` verificado + rama + PR (`--base mockup`, revisores `jsaldias39,PabloArauzCaballero`). `REPORTE.md` con **P40** listo para pegar. Sección «Carril C — Encuentro clínico · C2» de tu daily `Itzan/Itzan-Daily-Noche-2026-09-25.md` (sin tocar tus secciones de Farmacia y Carga Masiva) y push a `main`. Aviso al equipo (`SendMessage` si comparten máquina; si no, por el canal del equipo): «C2: `category` en las dos lecturas y seed del paciente demo en origin/mockup @ <sha>» (C9 lo espera).

## 8. Lo que NO hacés

Tocar «Mis órdenes» del paciente (C9) · editar `fixtures/clinica.ts` fuera de 462-504 · tocar tipos congelados (si falta un campo: `analysis-order.types.ts` propio + `// TODO C8`) · esperar a C1.
