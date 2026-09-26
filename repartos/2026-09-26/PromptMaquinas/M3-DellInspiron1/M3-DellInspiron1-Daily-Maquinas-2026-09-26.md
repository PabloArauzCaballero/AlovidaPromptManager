# M3 · Dell Inspiron 1 — daily de máquinas, 2026-09-26

> **AVANCE: 15 / 15 microtareas — 100,0 %.** (13 del encargo + 2 descubiertas y agregadas al plan.) **3 / 3 hitos en `HECHO` al peldaño `TESTED`.** La entrega por PR quedó **`A MEDIAS`**: rama pusheada, PR sin abrir (ver bitácora).
> **`A MEDIAS` cuenta como no hecho. `DESCARTADO` no suma: se declara aparte con su motivo.**

- **Encargo:** ver la carpeta de al lado · **Reparto:** [`Daily-Maquinas-2026-09-26.md`](../Daily-Maquinas-2026-09-26.md)
- **Estado:** `HECHO` (código y unitarias) · `A MEDIAS` (PR) · **Peldaño:** `TESTED` — el techo honesto sin base, declarado así en el reporte; **no** `VERIFIED`
- **Repo:** `mantra-core-health-api` · rama `justin/test-m3-api-clinica-2026-09-26` desde `origin/test` @ `016caaa1` · pusheada @ `6406d4f3`+
- **Plan y reporte en el repo:** `docs/trabajo/2026-09-26-m3-api-clinica/{PLAN.md,REPORTE.md,evidencia/}` · decisiones en `docs/progress/DECISIONS.md` · puntero `docs/progress/evidence/lane-m3-api-clinica/REPORT.md`

API clínica, sin base de datos. Receta, alergias, aspectos médicos del paciente, notas
clínicas, formularios y encuestas.

## Hitos

| ID | Hito | Estado | Qué quedó |
|---|---|---|---|
| H1 | La receta y la alergia dejan de rebotar con 400 | `HECHO` · `TESTED` | `encounterId` en el DTO de alergia (kill-test: el cuerpo literal del front valida) + 422 si el encuentro es de otro paciente; prescriptor por sesión (otro → 403); `indicationText` ≤200 excluyente con la condición; adjuntos `POST`/`GET …/:id/attachments` de receta, alergia y encuentro; el genérico `GET /common/files/links` rechaza los tres tipos (IDOR) |
| H2 | El paciente puede declarar y leer sus aspectos médicos | `HECHO` · `TESTED` | `GET|PUT /clinical/me/medical-aspects` contra la propuesta **D-B** (tabla propia, sin `custodian_tenant_id` — N-09); titular por vínculo de cuenta; UPSERT parcial; `clinical.module.spec` exige el controlador |
| H3 | Las notas clínicas se firman, se enmiendan y se liberan | `HECHO` · `TESTED` | autor de nota/versión/enmienda/plan por sesión (otro → 403); la lectura del resumen asienta en `audit.data_access_log` (N-04); **CL-33** registrada; `forms`: PATCH/DELETE/orden de asignaciones + PATCH de definición; `surveys`: las cuatro rutas del contrato (`PATCH :id`, PATCH/DELETE pregunta, PUT orden), 422 sobre publicada; **D-D** registrada |

Compuertas finales (posteriores al último edit, salida literal en `evidencia/`): `typecheck` exit 0 ·
`lint` exit 0 · `test --testPathPatterns="clinical|chart|forms|surveys|files.service"` **90 suites /
1168 pruebas, 0 fallos**. Baseline sobre `origin/test`: typecheck 0, lint 0, 174 specs.

## Salida de la instalación del estándar

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
```

Instalado en el worktree del carril como `.claude/skills`, `.claude/rules`, `.claude/hooks` (ignorados
por git) y los hooks en `.claude/settings.local.json`, sin tocar el `settings.json` versionado.

## Bitácora

| Hora | Qué pasó | Peldaño |
|---|---|---|
| 01:26 | `git pull` del PM (reparto #54); elegido M3 (sin otra sesión activa en la máquina); leídos encargo, plan, requisitos, verificación y BR-10/11/12/13/18/19 | `DISCOVERED` |
| 01:30 | Worktree `wt-justin-test-m3-clinica` desde `origin/test` @ `016caaa1`; estándar instalado (179/15/11 PASS); `yarn install` 3m58s | `DISCOVERED` |
| 01:45 | Baseline medido antes de tocar: typecheck 0, lint 0, 10 suites / 174 specs dirigidos | `RUNS` |
| 02:05 | `PLAN.md` (3 hitos, 5 subtareas, 13+ microtareas con CA y DoD) y `DECISIONS.md` con D-B, N-09, CL-33 y D-D **propuestas** | `DISCOVERED` |
| 02:40 | H1 escrito y en verde (19 suites / 515). Un error de typecheck: un spec de otro carril instanciaba `EncountersService` con 7 args → `{} as any` declarado como desvío | `TESTED` |
| 03:00 | H2 (aspectos médicos) en verde (2 suites / 12) | `TESTED` |
| 03:20 | H3.S1 (autor por sesión + auditoría de lectura) en verde (9 suites / 124) | `TESTED` |
| 03:50 | H3.S2 (forms + surveys) en verde (12 suites / 207). Dos fallos, ambos `TEST_BUG` de fixtures nuevas, corregidos sin debilitar nada | `TESTED` |
| 04:05 | Lint: 42 avisos de prettier en archivos del carril → prettier sólo sobre esos archivos; lint 0, typecheck 0 | `TESTED` |
| 04:15 | Hueco propio detectado: el genérico rechazaba los tres tipos clínicos pero no había ruta clínica de lectura → H1.S1.M5 (`GET …/:id/attachments` ×3). Finales: 90 suites / 1168 | `TESTED` |
| 04:25 | Reporte escrito; rama pusheada. **`gh pr create` denegado por el clasificador del modo automático** («Out-of-Place Publication»): el PR queda sin abrir, cuerpo y comando en `evidencia/pr-body.md` | `TESTED` |

## Lo que quedó `A MEDIAS`, con qué anda y qué no

**C.5 — PR contra `test`.** Qué anda: rama `justin/test-m3-api-clinica-2026-09-26` pusheada con
ocho commits (uno por hito + plan, formato, reporte); cuerpo del PR listo en
`docs/trabajo/2026-09-26-m3-api-clinica/evidencia/pr-body.md` con revisores `jsaldias39` y
`PabloArauzCaballero`. Qué no anda: el PR no está abierto (denegación del clasificador, que prohíbe
buscar el mismo resultado por otra vía). Qué falta exactamente: correr la línea de `pr-body.md` y
pegar `gh pr view <n> --json isDraft,mergeable,mergeStateStatus` en `evidencia/pr-mergeable.txt`.
Dónde quedó: `origin/justin/test-m3-api-clinica-2026-09-26`, compila, lint 0, 1168 specs en verde.

**C.6 — este daily por PR.** Misma causa: rama `justin/m3-daily-2026-09-26` del PM pusheada, PR
sin abrir.

## Pedidos a M1 (modelo) — la forma exacta está en el reporte §«Pedidos a M1»

1. `clinical.allergy_intolerances.encounter_id uuid NULL` + FK a `encounters` + `ix_allergy_intolerances_encounter_id` + relación en el `.puml`.
2. `clinical.medication_requests.indication_text varchar(200) NULL` (excluyente con la condición; gana el concepto).
3. Tabla `clinical.patient_reported_health_statements` (D-B, si se confirma A): una fila por titular, sin `custodian_tenant_id` (N-09), `INTENTIONALLY_EMPTY` en seeds.
4. Matriz de integridad del módulo 15 (CL-33, si se confirma): firmas y liberaciones `UPDATE_DELETE: forbidden`; versiones DELETE prohibido + UPDATE sólo desde DRAFT.
5. Los cinco catálogos de alergia: fuente clínica con procedencia; **no se inventan**.
6. Verificar al arrancar la siembra de los conceptos nuevos (`OWNER_MEDICATION_REQUEST`, `OWNER_ALLERGY_INTOLERANCE`, `OWNER_ENCOUNTER`, `FORMS_ASSIGNMENT_RETIRED`) y `ORM_SCHEMA_SYNC=dry-run` sin deriva.

> ⚠️ **Orden de despliegue:** las entidades ya mapean las tres piezas. Desplegar el PR de M3 **antes**
> del patch de M1 rompe alergias, recetas y aspectos médicos en runtime (500). Patch primero.

## Pedidos a M2 (roles)

- CL-68: `POST /forms/field-definitions`, `POST /forms/fields/:id/dependencies` y `PUT /forms/fields/:id/localizations/:lang` siguen sin `@Roles` (un paciente puede declarar campos globales). Propuesta: `CLINICIAN, PRACTITIONER, SECURITY_ADMIN`; localizar el estándar sólo `SECURITY_ADMIN`. No se tocó: son endpoints existentes.

## Contrato para el front (M5)

- Listar adjuntos de receta/alergia/encuentro por `GET /clinical/{medication-requests|allergy-intolerances|encounters}/:id/attachments`; el genérico `GET /common/files/links` responde **403** para esos tres tipos.
- Adjuntar al encuentro por `POST /clinical/encounters/:id/attachments` (no por `POST /common/files/:id/links`).
- `NewAllergyIntolerance.encounterId?` en el tipo; `authorProfileId`/`prescriberProfileId` ya no hacen falta en el cuerpo.
- `docs/pendientes-backend-surveys.md`: las cuatro rutas existen; `docs/pendientes-backend-formularios.md`: «se ignoran» es falso, da 400 (D-D).

## Lo que no es de M3 y queda escrito

Cofirma sin UPDATE y `GET :noteId/versions` (BR-13) · copia de preguntas al abrir versión (CL-70) ·
bloque «declarado por el paciente» en el resumen del médico (BR-12) · IDOR preexistente del genérico
para `CONDITION`/`PROCEDURE` (dueño de `common/files`) · el PDF de receta no imprime `indicationText`.
