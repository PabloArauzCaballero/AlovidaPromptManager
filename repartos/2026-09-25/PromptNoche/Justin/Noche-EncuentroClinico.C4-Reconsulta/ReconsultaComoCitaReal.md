# C4 — Reconsulta: una cita real agendada desde la consulta, con fecha acordada con el paciente

> **Rol:** dueño de la reconsulta (bloque, simulador de agenda, seed de reservas, sellos en agenda y Mis citas) · **Carril:** C4 · **Fecha:** 2026-09-25 · **Turno:** noche · **Ola A**
> **Plan maestro:** [`PLAN-MAESTRO.md`](../PLAN-MAESTRO.md) — §0.2 (2c), §0.3 D-5, §2, §3.5, §5, §6, §7 C4
> **Literal del propietario:** «también agendar una orden de reconsulta para una fecha específica acordada con el paciente».

## 0. Ficha de asignación

| Campo | Valor |
|---|---|
| `REPO` | `mantra-core-health`. **Nada de backend** |
| `TARGET_REF` | `origin/mockup` con el commit de C0 |
| `RAMA` | `claude/clinica-c4-reconsulta` |
| `WORKTREE` | `C:/Users/DELL/Documents/Github/Alovida/wt-clinica-c4` |
| `PUERTO` | `4214` |
| `ARCHIVOS RESERVADOS` | `src/app/features/clinical-record/patient-chart/follow-up-block/**` · `core/data-access/scheduling/scheduling.client.ts` (+ spec: **sólo** `createDirectAppointment` con `followUpOf` y lectura de `followUpOf`) · `core/mock/handlers/scheduling.handlers.ts` (+ spec) · `core/mock/fixtures/agenda.ts` (`ReservaSimulada.followUpOf`, seed de una reconsulta) · `features/agenda/agenda.{ts,html,css,spec.ts}` (**sólo** sello y `CitaVisible.reconsultaDe`) · `features/agenda/my-agenda/detalle-de-la-cita.ts` (+ spec) · `features/account/appointments/appointments.{ts,html,css,spec.ts}` (**sólo** sello y texto) · `playwright/clinica-c4-reconsulta.spec.ts` · `docs/trabajo/2026-09-25-encuentro-clinico/c4/**` |
| `ARCHIVOS DE OTROS` | `booking-new`, `appointment-new`, `walk-in`, plantillas y cupos · «Completar la cita» (`agenda.ts:2376`, se conserva) · `consultation/**`, tipos congelados, `conceptos.ts` (C0) · todo lo clínico (C1–C3, C5) · `account/medical-record/**` (C6) |
| `CUENTAS` | `medica@alovida.mock`, `paciente@alovida.mock` |
| `DÓNDE SE PRUEBA` | consulta abierta desde `/schedule` → «Iniciar la consulta» (llega `?cita=`) → `consulta-casilla-reconsulta`; `/schedule` (Consultas médicas); `/my-account/appointments` (paciente) |
| `LÍMITE DE RECURSOS` | un `yarn start`, un build/test a la vez, Playwright sólo vía `pw-guard` |

## 1. Estándar y skills

§5.1 del plan. **Skills:** `skills-router` → `outcome-first` → `context-thrift` → `factual-discovery` → `anti-hallucination-guard` → `milestone-planning` → `scope-discipline` → `lane-authoring` → `data-privacy-phi` → `appointment-scheduling` → `state-machines-workflows` → `frontend-ui-design` → `visual-hierarchy-composition` → `frontend-forms-ux` → `angular-forms` → `angular-development` → `angular-signals-state` → `frontend-ux-states` → `frontend-responsive-layout` → `frontend-accessibility` → `ux-writing-microcopy` → `native-code-patterns` → `unit-testing` → `angular-testing` → `edge-case-data-catalog` (fechas, husos) → `e2e-playwright` → (cierre) `frontend-beautiful-ui` → `ui-quality-review` → `visual-proof` → `critical-double-review` → `evidence-and-verification` → `work-report-md` → `pr-mergeable-gate` → `finish-your-turn`. Del repo: `project-design-system`, `frontend-production-gate`, `visual-quality-gate`; agentes `visual-reviewer`, `frontend-reviewer`, `regression-auditor` (tocás `agenda`, que tiene 2700 líneas y muchos specs).

`PLAN.md` propio antes del primer edit.

## 2. Resultado observable y kill-test

En la consulta, «Reconsulta» abre un bloque con **calendario** (cupos libres del recurso del doctor desde mañana hasta +90 días, `GET /scheduling/slots`), motivo precargado «Reconsulta: <motivo de la cita>» editable y «Agendar». Crea una cita real: en «Consultas médicas» la fila lleva el sello **Reconsulta** y «de la cita del <fecha>»; en el detalle de la cita «Qué es» dice «Reconsulta»; en «Mis citas» del paciente el mismo sello y «Tu médico te citó de nuevo por la consulta del <fecha>». Una segunda reconsulta de la misma cita se rechaza con mensaje.

**Kill-test:** si la reconsulta no aparece en `/my-account/appointments` de `paciente@alovida.mock` con el sello, C4 no está hecho.

## 3. Contrato que implementás (§3.5)

`POST /scheduling/appointments/direct` con `followUpOf { bookingId, encounterId }`:

- 404 si la cita origen no existe · 422 si el paciente difiere o `startAt` no es futuro · 403 si `resourceId` no es del doctor de la sesión · 409 si ya hay una reconsulta futura de esa cita origen.
- Crea la reserva `BK-CONFIRMED` con `typeConceptId = TIPO_CITA['APT-RECONSULTA']`, `reasonText` = el mandado o «Reconsulta: <motivo origen>», `followUpOf`.
- `GET /scheduling/bookings` y `GET /scheduling/bookings/:id` devuelven `followUpOf`; la reserva origen expone `followUpBookingId` (campo de lectura declarado en `follow-up.types.ts` propio con `// TODO C8: subir a scheduling.types.ts`).
- `SchedulingClient.createDirectAppointment` manda `followUpOf` sólo si viene.

Seed (`fixtures/agenda.ts`): `ReservaSimulada.followUpOf: FollowUpOrigin | null`; para `MEDICA`, una reserva futura `APT-RECONSULTA` que cuelga de una completada pasada del mismo paciente (`agendas-cobertura.spec.ts` debe seguir verde).

## 4. Diseño exigido

Reutilizar `app-date-picker` (organismo) o el `app-appointment-calendar` de `account/appointments` para elegir el día (desde mañana, +90 días, sin fines de semana si el recurso no atiende); al elegir día, cupos libres como `app-radio-group` agrupados «Mañana / Tarde» con hora y sede; motivo `app-textarea` precargado; «Agendar» primario deshabilitado sin cupo. Estados: sin `bookingId` (consulta abierta desde el expediente) → `app-alert` «La reconsulta se agenda desde una cita: abrí la consulta desde Mis citas»; ya agendada → tarjeta con fecha y «Reprogramar» que lleva a la agenda; éxito → `app-alert variant="success"` con fecha/hora y «Ver en Consultas médicas». En agenda: `app-badge` «Reconsulta» junto al motivo (`cita-reconsulta-sello`) + «de la cita del <fecha>»; en Mis citas del paciente, badge (`mis-citas-reconsulta-sello`) + frase. 409 visible en el bloque (S4). Tokens; cinco viewports; tema oscuro.

## 5. Microtareas

| ID | Microtarea | CA | DoD |
|---|---|---|---|
| C4.H1.M1 | Arranque, estándar, baseline, `PLAN.md` | — | baseline |
| C4.H2.M1 | Seed de agenda | determinismo; `agendas-cobertura.spec.ts` verde | spec |
| C4.H2.M2 | Handler de cita directa con `followUpOf`; lecturas con `followUpOf`/`followUpBookingId` | spec: 6 casos (ok · 404 · 422 paciente · 422 pasado · 403 recurso · 409 segunda) | `yarn test --watch=false --include=src/app/core/mock/handlers/scheduling.handlers.spec.ts --include=src/app/core/mock/mock-backend.spec.ts` |
| C4.H2.M3 | Cliente | cuerpo exacto | `yarn test --watch=false --include=src/app/core/data-access/scheduling/**` |
| C4.H3.M1 | `follow-up-block`: lectura de la cita origen y los tres estados | Se ven los tres | spec |
| C4.H3.M2 | Día + cupos + motivo + Agendar | Sin cupo no guarda | spec |
| C4.H3.M3 | Éxito y `cambio` | — | Playwright |
| C4.H3.M4 | Agenda del doctor: sello y «de la cita del»; detalle «Qué es» = «Reconsulta» | Se ve con la seed | spec + captura |
| C4.H3.M5 | Mis citas del paciente: sello y frase | Se ve con `paciente@alovida.mock` | spec + captura |
| C4.H4.M1 | Playwright `clinica-c4-reconsulta.spec.ts` | verde | `node scripts/pw-guard.mjs --port 4214 --spec playwright/clinica-c4-reconsulta.spec.ts --serve` |
| C4.H4.M2 | Capturas cinco viewports, claro/oscuro; `critical-double-review` | — | capturas |
| C4.H5.M1 | Revisores (incl. `regression-auditor` sobre `agenda.spec.ts` y `appointments.spec.ts` completos), gates, commits, push a `mockup`, PR, `REPORTE.md` con **P42**, daily en `main` | — | — |

## 6. Playwright

`node scripts/pw-guard.mjs --port 4214 --spec playwright/clinica-c4-reconsulta.spec.ts --serve` (background). Recorrido: médica → `/schedule` → «Iniciar la consulta» (llega `?cita=`) → `consulta-casilla-reconsulta` → `reconsulta-fecha` → `reconsulta-cupo` → `reconsulta-guardar` → éxito → volver a `/schedule` → fila con `cita-reconsulta-sello` → logout → paciente → `/my-account/appointments` → `mis-citas-reconsulta-sello`. Caso negativo: repetir la reconsulta de la misma cita → mensaje 409 visible.

## 7. Cierre

Checklist §9. Commits `feat(reconsulta): …`, `feat(mock): cita directa con followUpOf`, `feat(agenda): sello de reconsulta`, `feat(mis-citas): sello de reconsulta`. Push a `mockup` verificado + rama + PR. `REPORTE.md` con **P42** listo para pegar (`follow_up_of_booking_id`, `ACT_FOLLOW_UP`, regla «una por cita», `BookingItemDto`). Daily `C4-Reconsulta/C4-Daily-Noche-2026-09-25.md` aquí y push a `main`. `SendMessage`: «C4: `followUpOf` en `GET /scheduling/bookings` en origin/mockup @ <sha>» (C6 lo usa).

## 8. Lo que NO hacés

Tocar «Completar la cita», `booking-new`, `appointment-new`, `walk-in`, plantillas · reescribir `agenda.ts` más allá del sello y del campo `reconsultaDe` · tipos congelados (`follow-up.types.ts` propio + `// TODO C8`).
