# C7 — Homogeneización de nombres: una sola palabra por concepto, «Notas médicas» en el menú, y adiós a la hoja en blanco

> **Rol:** dueño del glosario aplicado (§2 del plan) fuera de los archivos de C1–C6/C9, de «Evoluciones → Notas médicas», de `observation-block` («Medición») y del retiro de `free-note-block` · **Carril:** C7 · **Fecha:** 2026-09-25 · **Turno:** noche · **Ola B**
> **Plan maestro:** [`PLAN-MAESTRO.md`](../PLAN-MAESTRO.md) — §2, §0.3 D-8, §5, §6, §7 C7
> **Literal del propietario:** «aprovecha para homogeneizar todo por favor de los nombres y todo».

## 0. Ficha de asignación

| Campo | Valor |
|---|---|
| `REPO` | `mantra-core-health`. **Nada de backend** |
| `TARGET_REF` | `origin/mockup` con C0 (y los de la ola A que ya estén) |
| `RAMA` | `claude/clinica-c7-nombres` |
| `WORKTREE` | `C:/Users/DELL/Documents/Github/Alovida/wt-clinica-c7` |
| `PUERTO` | `4217` |
| `ARCHIVOS RESERVADOS` | `src/app/core/navigation/navigation.map.ts` (**sólo** la línea del rótulo `'Evoluciones'`) · `features/progress-notes/**` · `features/clinical-record/patient-chart/free-note-block/**` (eliminar) · `features/clinical-record/patient-chart/note-grid/**` (→ `measurement-grid/**`) · `features/clinical-record/patient-chart/observation-block/**` · `features/clinical-record/patient-chart/care-plan-block/**` · `features/clinical-record/patient-chart/procedures-block/**` · `core/dev/toast-samples.ts` · `core/mock/faker/clinico.ts` (**sólo** renombrar `notaDeEvolucion`→`textoDeNotaMedica`; C1 agrega otra función en el mismo archivo, región distinta) y su export en `faker/index.ts` · `core/mock/aviso-ficha-medica.spec.ts` · `playwright/pdf-premium-evoluciones.spec.ts` (→ `clinica-c7-notas-medicas-pdf.spec.ts`) · `playwright/consulta-rejilla.spec.ts` · `playwright/formularios-cuadricula.spec.ts` · `docs/components/catalog.md` (fila de `free-note-block`) · `docs/trabajo/2026-09-25-encuentro-clinico/c7/**` |
| `ARCHIVOS DE OTROS` | todo lo de C1–C6 y C9 (aunque contenga términos viejos: **se anota, no se toca**) · `booking-status.ts` duplicados (no es clínico: se anota) · rutas (`MIS_TURNOS_ROUTE` se queda) · `consultation/**`, tipos congelados (C0) |
| `CUENTAS` | `medica@alovida.mock` |
| `DÓNDE SE PRUEBA` | `/progress-notes` (menú «Notas médicas»); consulta → «Medición»; expediente |
| `LÍMITE DE RECURSOS` | un `yarn start`, un build/test a la vez, Playwright sólo vía `pw-guard` |

## 1. Estándar y skills

§5.1 del plan. **Skills:** `skills-router` → `outcome-first` → `context-thrift` → `factual-discovery` → `anti-hallucination-guard` → `scope-discipline` (**la más importante de tu carril**: un renombre invita a «aprovechar») → `milestone-planning` → `lane-authoring` → `data-privacy-phi` → `frontend-navigation-ia` → `ux-writing-microcopy` → `frontend-data-tables` → `frontend-ui-design` → `angular-development` → `angular-signals-state` → `native-code-patterns` → `unit-testing` → `angular-testing` → `regression-suite-management` → `e2e-playwright` → (cierre) `ui-quality-review` → `visual-proof` → `critical-double-review` → `evidence-and-verification` → `work-report-md` → `pr-mergeable-gate` → `finish-your-turn`. Del repo: `project-design-system`, `frontend-production-gate`, `visual-quality-gate`; agentes `frontend-reviewer`, `regression-auditor` (renombrás cosas con consumidores).

`PLAN.md` propio antes del primer edit.

## 2. Resultado observable y kill-test

En la interfaz no queda «Nota clínica», «Nota de la consulta», «Evolución/Evoluciones», «Hoja en blanco», «Observación» (para la medición), «Estudio» (para la orden), «Prediagnóstico», «Control» (para la reconsulta) ni «Turno» en rótulos nuevos. El menú «Evoluciones» pasa a **«Notas médicas»** y esa pantalla lista **notas** (una fila por nota, no por cita) con barra, tabla y paginación (ADR-0015) y la tabla de filas al desplegar. `free-note-block` se elimina y `note-grid` pasa a `measurement-grid`.

**Kill-test:** `grep -rniE "nota clínica|evoluci[oó]n|hoja en blanco" src/app --include=*.html --include=*.ts` fuera de los archivos de C1–C6/C9 = 0; si no, C7 no está hecho.

## 3. Lo que aplicás

La tabla §2 del plan, columna «Se retira», sobre **tus** archivos. Inventario primero (`grep` de cada término → `evidencia/inventario.md` con archivo/línea/dueño); lo que cae en archivos de otros carriles va a tu `REPORTE.md` para C8, no se toca.

«Notas médicas» (`progress-notes`): una fila por nota; fuente `GET /charts/notes?practitionerId=&from=&to=` si C1 la dejó (verificá `medical-notes.handlers.ts` en tu corte); si no, seguís con bookings + chart como hoy y lo anotás. `app-filter-bar` (búsqueda por paciente/rótulo; período 7/30/90 con `app-select`) + `app-data-table` `maxHeight` + `app-pagination` en cliente (ADR-0015); al desplegar, `app-fact-list` de las filas. Renombres: `AtencionRegistrada`→`AttendedEncounter`, `NotaDeLaAtencion`→`MedicalNoteRow`.

## 4. Diseño exigido

«Notas médicas»: Regla 8 (una `app-card`), barra arriba, tabla sin scroll lateral, paginación abajo a la derecha con texto en Anterior/Siguiente y selects. `observation-block`: rótulos «Medición», «Registrar una medición», «Qué se midió», «¿En qué consulta se tomó?». Tokens; cinco viewports; tema oscuro.

## 5. Microtareas

| ID | Microtarea | CA | DoD |
|---|---|---|---|
| C7.H1.M1 | Arranque, estándar, baseline, `PLAN.md`; inventario | La tabla separa «mío» de «de otro carril» | `grep` guardado |
| C7.H2.M1 | Eliminar `free-note-block/**` (+ catálogo, `yarn stock:generate`) | `grep -rn "free-note-block\|FreeNoteBlock" src` = 0 | `yarn typecheck` |
| C7.H2.M2 | `observation-block` rótulos; `note-grid` → `measurement-grid` | `consulta-rejilla` ajustado y verde | `yarn test --watch=false --include=src/app/features/clinical-record/patient-chart/observation-block/** --include=src/app/features/clinical-record/patient-chart/measurement-grid/**` |
| C7.H2.M3 | `progress-notes` → «Notas médicas» (menú, título, una fila por nota, ADR-0015, renombres) | `progress-notes.spec.ts` verde con los nombres nuevos | `yarn test --watch=false --include=src/app/features/progress-notes/**` |
| C7.H2.M4 | `care-plan-block`, `procedures-block`, `toast-samples`, `faker/clinico.ts`, `aviso-ficha-medica.spec.ts` | inventario en 0 para archivos propios | `grep` |
| C7.H3.M1 | Playwright renombrado + `consulta-rejilla` | verdes | `node scripts/pw-guard.mjs --port 4217 --spec playwright/clinica-c7-notas-medicas-pdf.spec.ts --spec playwright/consulta-rejilla.spec.ts --serve` |
| C7.H3.M2 | Capturas de «Notas médicas» cinco viewports, claro/oscuro; `critical-double-review` | — | capturas |
| C7.H4.M1 | Revisores (incl. `regression-auditor`), gates, commits, push a `mockup`, PR, `REPORTE.md` con lo que quedó en archivos ajenos, daily en `main` | — | — |

## 6. Playwright

`node scripts/pw-guard.mjs --port 4217 --spec playwright/clinica-c7-notas-medicas-pdf.spec.ts --spec playwright/consulta-rejilla.spec.ts --serve` (background). Recorrido: médica → menú «Notas médicas» → barra visible → buscar un paciente reduce filas → paginar si hay > 10 → desplegar una nota → tabla de filas; consulta → casilla «Medición» abre «Registrar una medición».

## 7. Cierre

Checklist §9. Commits `refactor(nombres): …` por archivo o carpeta, `feat(notas-medicas): una fila por nota con barra y paginación`, `chore(expediente): retirar free-note-block`. Push a `mockup` verificado + rama + PR. `REPORTE.md` con la lista archivo/línea/dueño de lo que quedó fuera. Daily `C7-Nombres/C7-Daily-Noche-2026-09-25.md` aquí y push a `main`.

## 8. Lo que NO hacés

Tocar un archivo de otro carril «porque tiene la palabra vieja» · renombrar rutas · unificar `booking-status.ts` · tipos congelados · refactorizar `progress-notes` más allá de lo listado.
