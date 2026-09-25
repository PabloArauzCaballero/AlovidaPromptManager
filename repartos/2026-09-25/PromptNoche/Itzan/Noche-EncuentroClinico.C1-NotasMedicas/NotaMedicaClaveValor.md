# C1 — Nota médica: la tabla clave/valor que el doctor escribe en cada cita

> **Rol:** dueño de la nota médica (bloque, cliente, simulador, seed) · **Responsable:** Itzan · **Carril:** C1 · **Fecha:** 2026-09-25 · **Turno:** noche · **Ola A**
> **Plan maestro:** [`PLAN-MAESTRO.md`](../../../../../docs/trabajo/2026-09-25-plan-y-reparto-encuentro-clinico/PLAN-MAESTRO.md) — §0.2 (1), §2, §3.2, §5, §6, §7 C1
> **Lo que el propietario dijo, literal:** «en cada cita es posible realizar una observación, en la cual el doctor escribe lo que se observa y cada observación tiene su respectivo ID … es una tabla de valores donde los campos son más dinámicos y laxos … llamadas notas médicas (aprovecha para homogeneizar todo)».

## 0. Ficha de asignación

| Campo | Valor |
|---|---|
| `REPO` | `mantra-core-health` (frontend, Yarn 4 PnP). **Nada de backend** |
| `TARGET_REF` | `origin/mockup` **con el commit de C0** («feat(clinica): contrato primero (C0)»). Verificalo con `git log --oneline -8 origin/mockup`; si no está, esperá el aviso de C0 |
| `RAMA` | `claude/clinica-c1-notas-medicas` desde `origin/mockup` |
| `WORKTREE` | `<raíz de tus repos>/wt-clinica-c1` |
| `PUERTO` | `4211` |
| `ARCHIVOS RESERVADOS` | `src/app/features/clinical-record/patient-chart/medical-note-block/**` · `core/data-access/chart-notes/chart-notes.client.ts` (+ `chart-notes.client.spec.ts` nuevo) · `core/mock/handlers/medical-notes.handlers.ts` (+ `.spec.ts` nuevo) · `core/mock/fixtures/medical-notes.ts` (nuevo) · `core/mock/faker/clinico.ts` (**sólo agregar** `filasDeNotaMedica(f)`) y su export en `core/mock/faker/index.ts` · `playwright/clinica-c1-nota-medica.spec.ts` · `docs/trabajo/2026-09-25-encuentro-clinico/c1/**` |
| `ARCHIVOS DE OTROS` | `free-note-block/**`, `note-grid/**`, `observation-block/**`, `progress-notes/**` (C7) · `patient-chart.*` (C3) · `consultation/**`, tipos congelados, `conceptos.ts`, `handlers/index.ts` (C0) · `clinical.handlers.ts` (C5) · `diagnostics.handlers.ts` (C2) · `fixtures/clinica.ts` (C2/C3) |
| `CUENTAS` | `medica@alovida.mock` (doctor) |
| `DÓNDE SE PRUEBA` | `/schedule` → «Iniciar la consulta» → `/medical-records/<id>/consultation?cita=…` → casilla «Nota médica» (`consulta-casilla-notas`) |
| `LÍMITE DE RECURSOS` | un `yarn start`, un build/test a la vez, Playwright sólo vía `pw-guard` |
| `TUS OTROS CARRILES ESTA NOCHE` | Farmacia: `Noche-Farmacia.PaginaDeFarmaciaYQA` · Carga Masiva (API): `Noche-CargaMasiva.MotorDryRunIdempotencia`. Sin cruces de archivos con ellos (verificado). Tu daily es uno solo (`Itzan-Daily-Noche-2026-09-25.md`): este carril va en su sección «Carril C — Encuentro clínico». |

## 1. Antes de escribir una línea — instalación OBLIGATORIA del estándar

```bash
git -C <raíz de tus repos>/AlovidaPromptManager pull --ff-only origin main
cd <raíz de tus repos>/wt-clinica-c1
cp -rn ../AlovidaPromptManager/.claude/skills/* .claude/skills/     # fusionar, NO pisar las 4 skills y 3 agentes del repo
cp -rn ../AlovidaPromptManager/.claude/rules .claude/ 2>/dev/null || cp -rn ../AlovidaPromptManager/.claude/rules/* .claude/rules/
cp -rn ../AlovidaPromptManager/.claude/hooks .claude/ 2>/dev/null || true
ls .claude/skills | wc -l; ls .claude/rules/[0-9]*.md | wc -l; python .claude/hooks/plan_gate.py --self-test   # pegá las tres salidas en tu daily
```

Los `.claude/` instalados **no se commitean**. Si no podés completar este paso estás `BLOQUEADO`: avisá y no sigas.

Instalación del estándar: §5.1 del plan (fusionar `.claude/` sin pisar; pegar `wc -l` y `plan_gate --self-test` en tu daily). **Skills a cargar:** `skills-router` → `outcome-first` → `context-thrift` → `factual-discovery` → `anti-hallucination-guard` → `milestone-planning` → `scope-discipline` → `lane-authoring` → `data-privacy-phi` → `clinical-records` → `frontend-ui-design` → `visual-hierarchy-composition` → `frontend-forms-ux` → `angular-forms` → `angular-development` → `angular-signals-state` → `atomic-design-components` → `smart-dumb-components` → `frontend-ux-states` → `frontend-responsive-layout` → `frontend-accessibility` → `ux-writing-microcopy` → `native-code-patterns` → `unit-testing` → `angular-testing` → `e2e-playwright` → (al cerrar) `frontend-beautiful-ui` → `ui-quality-review` → `visual-proof` → `critical-double-review` → `evidence-and-verification` → `work-report-md` → `pr-mergeable-gate` → `finish-your-turn`. Del repo: `project-design-system`, `frontend-production-gate`, `visual-quality-gate`; agentes `visual-reviewer`, `frontend-reviewer` antes del PR.

`PLAN.md` propio en `docs/trabajo/2026-09-25-encuentro-clinico/c1/` **antes del primer edit**.

## 2. Resultado observable y kill-test

En la consulta, «Nota médica» abre un formulario de **filas campo/valor** (una fila vacía inicial, «Agregar fila», «Quitar», texto libre opcional), guarda con `POST /charts/notes` y debajo lista las notas **de este encuentro** y, plegadas, las anteriores del paciente, cada una con ID corto («Nota #a1b2»), fecha, autor, sello Borrador/Firmada y su tabla. F5 conserva la nota. «Firmar» cambia el sello y bloquea la edición.

**Kill-test:** guardá una nota con dos filas, F5; si no aparecen las dos filas con sus rótulos, C1 no está hecho.

## 3. Contrato que implementás (§3.2 del plan)

Reglas: hasta 40 filas; `label` 1–60, `value` 1–500; sin `label` duplicado (sin mayúsculas ni tildes); `subjectiveText` opcional «Texto libre»; firmada no se edita (versión nueva con `amendmentReasonText`).

| Ruta | Cuerpo | Respuesta | Errores |
|---|---|---|---|
| `POST /charts/notes` | `{ patientProfileId, encounterId?, entries?, subjectiveText?, … }` | `201 { noteId, versionId, versionNumber, lifecycleStatusConceptId, versionStatusConceptId }` | 422 `VALIDATION` con `details` por fila; 422 si no hay ni filas ni texto |
| `PUT /charts/notes/:id/versions` | `{ entries?, subjectiveText?, … }` | `201 { … versionNumber+1 }` | 404; 409 `CONFLICT` firmada sin `amendmentReasonText` |
| `GET /charts/notes?patientProfileId&encounterId&limit` | — | `{ items: ChartNote[], count, limit, nextCursor }` | 403 si el paciente no es propio ni atendido |
| `POST /charts/notes/:id/versions/:versionId/sign` | — | `200 ChartNote` con `signedAt` | 404 |

Además registrás en **tu** archivo un `GET /charts/patients/:id/chart` que invoca el handler previo (importalo desde `clinical.handlers.ts` si está exportado; si no, reconstruí la respuesta con las colecciones) y agrega a `notes` las tuyas con `entries` (gana el registrado después). Marcalo `// TODO C8: función exportada en clinical.handlers.ts`.

Seed: `fixtures/medical-notes.ts` → `MedicalNoteSimulada` (= `NotaSimulada` + `entries`), colección `notasMedicas` persistida en `mock.clinica.notasMedicas`, 2 notas por paciente con 4–7 filas realistas (`fk.clinico.filasDeNotaMedica`: «Presión arterial: 120/80», «Dolor: región lumbar, 6/10», «Duración: 3 días», «Exploración: abdomen blando, depresible»…), ids **`uuid('medical-note-<pid>-<n>')`** (C2 y C3 citan `…-0`: no cambies la semilla).

## 4. Diseño exigido

Formulario dentro del `app-content-dialog` de la consulta. Cada fila: cuadrícula de dos `app-form-field` (rótulo con `app-input`, valor con `app-textarea` de una línea que crece) y `app-button variant="ghost"` «Quitar» **con texto** (ADR-0012). «Agregar fila» secundario; `Enter` en el valor agrega fila y enfoca el rótulo nuevo; contador «n de 40»; validación en vivo bajo el campo. Guardar primario, deshabilitado sin filas válidas ni texto. Lista: `app-card` por nota con cabecera (fecha, autor, `app-badge` Borrador/Firmada, «Nota #a1b2») y `app-fact-list` para los pares; «De esta consulta» arriba; «Anteriores» en `app-accordion`. Estados con `app-view-state-host` (S2 esqueleto; S3 «Escribí la primera nota»; S9 con ID). En la consulta el encuentro viene fijo (§3.1): sin encuentro, `app-alert` «Abrí el encuentro para registrar» y guardar deshabilitado. Tokens, sin valores mágicos; 390 apila la fila sin scroll lateral; tema oscuro revisado.

## 5. Microtareas

### H1 — Arranque y baseline

**CA:** Todas las microtareas de H1 cumplen su criterio binario de la tabla.
**DoD:** Los DoD de sus microtareas, ejecutados y con su salida pegada en `evidencia/`.
**Estado:** TODO

#### H1.S1 — Arranque y baseline

**CA:** El mismo de H1: el hito se entrega en una sola subtarea.
**DoD:** El mismo de H1: los DoD de las microtareas de abajo.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD |
|---|---|---|---|
| H1.S1.M1 | Arranque §4.4, estándar §5.1, baseline, `PLAN.md` con corte | SHA anotado; `evidencia/antes/` | comandos de baseline |

### H2 — Datos simulados y cliente

**CA:** Todas las microtareas de H2 cumplen su criterio binario de la tabla.
**DoD:** Los DoD de sus microtareas, ejecutados y con su salida pegada en `evidencia/`.
**Estado:** TODO

#### H2.S1 — Datos simulados y cliente

**CA:** El mismo de H2: el hito se entrega en una sola subtarea.
**DoD:** El mismo de H2: los DoD de las microtareas de abajo.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD |
|---|---|---|---|
| H2.S1.M1 | `fixtures/medical-notes.ts` + `filasDeNotaMedica` en el faker | Determinista: dos `crearRouterSimulado()` dan los mismos ids | spec del handler |
| H2.S1.M2 | `medical-notes.handlers.ts` completo (tabla de arriba + `GET …/chart` con `entries`) | spec: alta, validación por fila, listado por encuentro, firma, chart con `entries` | `yarn test --watch=false --include=src/app/core/mock/handlers/medical-notes.handlers.spec.ts --include=src/app/core/mock/mock-backend.spec.ts` |
| H2.S1.M3 | `chart-notes.client.ts`: `listNotes`, `signVersion`; `entries` sólo si hay filas | `chart-notes.client.spec.ts` con `HttpTestingController`, cuerpos exactos | `yarn test --watch=false --include=src/app/core/data-access/chart-notes/**` |

### H3 — Bloque de nota médica en la consulta

**CA:** Todas las microtareas de H3 cumplen su criterio binario de la tabla.
**DoD:** Los DoD de sus microtareas, ejecutados y con su salida pegada en `evidencia/`.
**Estado:** TODO

#### H3.S1 — Bloque de nota médica en la consulta

**CA:** El mismo de H3: el hito se entrega en una sola subtarea.
**DoD:** El mismo de H3: los DoD de las microtareas de abajo.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD |
|---|---|---|---|
| H3.S1.M1 | Formulario `FormArray` con validaciones | 0 filas y sin texto → Guardar deshabilitado; 1 fila válida → habilitado | spec |
| H3.S1.M2 | Guardar → `createNote`; limpia; emite `guardada`; relee | Mutación `UI → request → response → recarga → UI` | Playwright |
| H3.S1.M3 | Lista con «De esta consulta» / «Anteriores», firma | Firmada sin «Firmar» ni edición | spec |
| H3.S1.M4 | Estados M34 | Se ven forzando `mock:fallos` | capturas |

### H4 — Recorrido y capturas

**CA:** Todas las microtareas de H4 cumplen su criterio binario de la tabla.
**DoD:** Los DoD de sus microtareas, ejecutados y con su salida pegada en `evidencia/`.
**Estado:** TODO

#### H4.S1 — Recorrido y capturas

**CA:** El mismo de H4: el hito se entrega en una sola subtarea.
**DoD:** El mismo de H4: los DoD de las microtareas de abajo.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD |
|---|---|---|---|
| H4.S1.M1 | Playwright `clinica-c1-nota-medica.spec.ts` | verde vía guardián | `node scripts/pw-guard.mjs --port 4211 --spec playwright/clinica-c1-nota-medica.spec.ts` (en background) |
| H4.S1.M2 | Capturas 390/768/1024/1440/1920, claro y oscuro; `critical-double-review` escrita | Sin overflow | capturas en `evidencia/` |

### H5 — Revisión y entrega

**CA:** Todas las microtareas de H5 cumplen su criterio binario de la tabla.
**DoD:** Los DoD de sus microtareas, ejecutados y con su salida pegada en `evidencia/`.
**Estado:** TODO

#### H5.S1 — Revisión y entrega

**CA:** El mismo de H5: el hito se entrega en una sola subtarea.
**DoD:** El mismo de H5: los DoD de las microtareas de abajo.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD |
|---|---|---|---|
| H5.S1.M1 | Revisores, gates §5.3, commits por archivo, push a `mockup`, rama, PR, `REPORTE.md` con **P39**, daily en `AlovidaPromptManager` `main` | PR abierto; `origin/mockup` con tus commits; daily en `origin/main` | `git log --oneline -3 origin/mockup` |


## 6. Playwright, siempre por el guardián

```bash
node scripts/pw-guard.mjs --port 4211 --spec playwright/clinica-c1-nota-medica.spec.ts --serve
```

Corrélo con `run_in_background: true` y esperá la notificación. Recorrido: login médica (`playwright/support/sesion.ts`) → Mis citas → «Iniciar la consulta» → `consulta-casilla-notas` → 3 filas (`nota-medica-fila`) → `nota-medica-guardar` → `nota-medica-item` con 3 pares → `page.reload()` → sigue → `nota-medica-firmar` → sello «Firmada». `test.setTimeout(90_000)`; sin `networkidle`. Un rojo legítimo se diagnostica con `e2e-failure-triage`, no se relanza.

## 7. Cierre

Checklist §9 del plan completo. Commits: `feat(nota-medica): …`, `feat(mock): notas médicas con filas clave/valor`, `test(nota-medica): …`. `git pull --rebase origin mockup && git push origin HEAD:mockup` verificado; `gh pr create --base mockup --reviewer jsaldias39,PabloArauzCaballero`. `REPORTE.md` con la sección **P39** lista para pegar en `PENDIENTES-BACKEND.md` (modelo: `entries_json jsonb` en `chart.clinical_note_versions`; DTOs; lectura en chart y en `GET /charts/notes`; estado del frontend). Sección «Carril C — Encuentro clínico · C1» de tu daily `Itzan/Itzan-Daily-Noche-2026-09-25.md` (sin tocar tus secciones de Farmacia y Carga Masiva), `git pull --rebase origin main && git push origin main`. Aviso al equipo (`SendMessage` si comparten máquina; si no, por el canal del equipo): «C1: `GET /charts/notes` con `entries` en origin/mockup @ <sha>».

## 8. Lo que NO hacés

**OUT:** Borrar `free-note-block` (C7) · tocar `patient-chart` (C3) · agregar campos a `clinical.types.ts` (si te falta uno: `medical-note.types.ts` propio + `// TODO C8`) · editar `clinical.handlers.ts` · esperar a C2/C3.

## Ambigüedades registradas

| Ambigüedad | Supuesto que se toma | A quién se confirma |
|---|---|---|
| Ninguna registrada al repartir. Toda duda que aparezca en ejecución se anota acá y en el `PLAN.md` del carril, con el supuesto tomado, antes de resolverla | — | Pablo |

## Definition of Done del hito

Un hito es `HECHO` sólo cuando **todas** sus microtareas están `HECHO` con la salida de su DoD
pegada en `evidencia/`, la regresión del módulo tocado está en verde y los gates aplicables del
repo pasaron. Falta cualquiera de las tres → el hito es `A MEDIAS`, con qué anda, qué no anda y
qué falta exactamente.
