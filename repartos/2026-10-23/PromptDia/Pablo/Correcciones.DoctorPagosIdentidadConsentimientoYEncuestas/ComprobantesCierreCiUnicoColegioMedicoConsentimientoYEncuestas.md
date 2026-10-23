# Los comprobantes y el cierre con pago, el CI único, el Colegio Médico simulado, el consentimiento por sección y las encuestas que se mandan solas

> **Rol:** dueño del backend de pagos del médico, de la unicidad del documento, de la verificación de credenciales, del consentimiento, de encuestas y formularios, de los `@Roles` y de las compuertas compartidas (merges a `dev`, Coolify) · **Carril:** 2 · Doctor (con Justin) · **Fecha:** 2026-10-23 · **Turno:** día
> **Fuente del pedido:** [`CORRECCIONES-FULLSTACK-2026-10-23.md`](../../../../../docs/requisitos/CORRECCIONES-FULLSTACK-2026-10-23.md) — **MD-01, MD-02, MD-03, MD-05, MD-06**, y el lado médico y API de **PA-04** y **PA-08**
> **Verificación contra el código:** [`VERIFICACION-CONTRA-CODIGO-2026-10-23.md`](../../../../../docs/verificacion/VERIFICACION-CONTRA-CODIGO-2026-10-23.md) — §PA-04/MD-06, §MD-01, §MD-02, §MD-03/PA-08, §MD-05
> **Plan completo:** [`planes/06-correcciones-fullstack-2026-10-23/README.md`](../../../../../planes/06-correcciones-fullstack-2026-10-23/README.md) — **producís C-01, C-05, C-06, C-10 y el módulo `medical-college` de C-07; despliegues de C-07**
> **8 hitos · 17 subtareas · 79 microtareas**, todas con criterio de aceptación y Definition of Done.
>
> **Lo primero que tenés que saber:** tres de tus contratos (C-01 comprobantes, C-05 consentimiento,
> C-06 encuestas) los esperan **otras cinco personas** desde el día 1. No tienen que esperar tu
> implementación: tienen que tener **el DTO**. Publicá los tres en el daily en la primera hora, con la forma
> literal, y recién después implementá. Lo segundo: sos el único que toca `@Roles` existentes y
> `concepts.ts`; los demás te van a pedir roles por el daily y vos los aplicás el mismo día.

## 0. Ficha de asignación

| Campo | Valor |
|---|---|
| `REPOS` | `mdavila-2001/mantra-core-health-api` · `mdavila-2001/mantra-core-health` · `mantra-core-technologies/mantra-core-health-model` (`.puml` M02, M07, M17, M65 nuevo) · `mdavila-2001/mantra_core_health_mobile` · `mantra_core_technologies_health_docs` (vault: T-31, registro de la decisión de encuestas) |
| `TARGET_REF` | `origin/dev` front `227eb255` · API `6ea11561` · modelo `eceb98f` · móvil `origin/main` `ec88e81`. **Reconsultá y fijá el tuyo** |
| `RAMAS` | `pablo/doctor-pagos-identidad-consentimiento-encuestas-2026-10-23` por repo. PR por hito. El del modelo antes que el de la API |
| `ARCHIVOS RESERVADOS PARA VOS` | API: `billing/**` · `iam/**` · `common/repositories/identifiers*` · `common/services/identifiers.service.ts` · `consent/**` · `authz/controllers/authz-care-relationships*` y su servicio · `surveys/**` · `forms/**` · `messaging/**` · `identity_assurance/**` (salvo `worker/jobs/identity_assurance/**`, de Leo) · `profiles/**` (credenciales y matrícula) · `clinical/services/encounters.service.ts` (sólo `close`) · `common/constants/concepts.ts` · **todo `@Roles` de endpoints existentes** · `worker/worker.env.ts` · `docker-compose.coolify.yml` · `mock-provider-server/src/medical-college/**`. Front: `features/clinical-record/consultation/**` (caja Pagos) · `features/clinical-record/patient-chart/payments-block/**` y `patient-charges/**` · `features/clinical-record/request-access/**` · `features/clinical-record/access-inbox/**` (nuevo) · `features/form-builder/**` · `features/questionnaires/**` (médico) · `features/auth/register-*/**` y `shared-registration/**` (validador de documento) · `features/onboarding-practitioner/**` · `core/data-access/{billing,iam,authz,forms}/**` · `core/mock/handlers/{billing,iam,authz,flows}.handlers.ts` · tus `test()` en la suite de kill-tests. Modelo: `diagram_02_common.puml`, `diagram_07_consent.puml`, `diagram_17_billing.puml`, `diagram_65_surveys.puml` (nuevo). Móvil: `features/consultation_billing/**`, `features/practitioner_registration/**`, `features/auth/**` (validador de documento) |
| `ARCHIVOS DE OTROS — NO LOS TOQUES` | `insurance/**`, `geo/**`, `promotions/**`, `community-public.controller.ts`, directorios, `features/billing/patient-payment/**` (**Richard**) · `scheduling/**`, `terminology/**`, `features/agenda/**`, `features/glossary/**` (**Justin**) · `clinical/**/prescription*`, `pharmacy*/**`, `features/pharmacy/**` (**Ender**) · `clinical/**/service-request*`, `diagnostics/**`, `diagnostic_units/**`, `features/laboratory/**` (**Itzan**) · `worker/jobs/identity_assurance/**`, `mock-provider-server/src/identity-verification/**`, `shell-layout`, `settings`, `spending`, `cart`, `access-requests`, `questionnaires` del paciente (**Leo**) |
| `⚠️ RIESGO ALTO DE TU CARRIL` | **El cierre de la consulta condicionado al pago puede dejar consultas sin cerrar** en producción si el cargo no existe o el seguro cubre todo: el 412 `PAYMENT_REQUIRED` tiene excepción explícita por cobertura total y una salida administrativa auditada. **Segundo:** el índice único de documento sobre datos existentes puede fallar si ya hay duplicados: el patch **primero mide** y los duplicados se registran, no se borran. **Tercero:** `surveys` no tiene `.puml` (T-31): cualquier columna nueva que agregues a mano al ORM sin pasar por el modelo agranda la deriva; se promueve al modelo **antes** de tocarlo |
| `CONTRA QUÉ SE PRUEBA` | API real (`docker compose up`, `seed:e2e`) + front `start:real-api` |
| `CUENTAS DE PRUEBA` | `seed:e2e` (doctor.one, doctor.two) + un paciente creado por API en tu Ola 0 (sintético) |
| `DÓNDE SE PRUEBA` | `/medical-records/:profileId/consultation` (caja Pagos), `/billing`, `/auth/register/practitioner`, `/auth/register/patient`, `/medical-records/:profileId/request-access`, `/access-inbox` (nuevo), `/form-builder`, `/questionnaires`, `/questionnaires/:id` |
| `LÍMITE DE RECURSOS` | Regla 70 |

## 1. Antes de escribir una línea — instalación OBLIGATORIA del estándar

> **Esta sección no es opcional y no es el final del día: es lo primero.** Si no podés completar este
> paso, estás `BLOQUEADO`: avisalo y no sigas.

### 1.1 Instalar el estándar en tu checkout

```bash
git clone https://github.com/PabloArauzCaballero/AlovidaPromptManager.git ../AlovidaPromptManager
cp -r ../AlovidaPromptManager/.claude   ./
cp    ../AlovidaPromptManager/AGENTS.md ./
cp -r ../AlovidaPromptManager/.agents   ./
ls .claude/skills | wc -l
ls .claude/rules/[0-9]*.md | wc -l
python .claude/hooks/plan_gate.py --self-test
```

⚠️ La API y el front **ya tienen** `.claude/` y `AGENTS.md`: fusioná. Sus `CLAUDE.md`/`AGENTS.md` mandan.

### 1.2 Qué te instala eso

| Candado | Qué impide |
|---|---|
| `plan_gate.py` | Escribir código sin `PLAN.md` |
| `report_gate.py` | Cerrar sin `REPORTE.md` |
| `blocker_gate.py` | Cerrar con `BLOQUEADO` sin simular los tres niveles |

### 1.3 Skills que tenés que CARGAR para este lote

**Del proceso:** `skills-router` · `factual-discovery` · `milestone-planning` · `anti-hallucination-guard` ·
`evidence-and-verification` · `scope-discipline` · `rationalization-guard` · `context-thrift` ·
`progress-reporting` · `finish-your-turn` · `work-report-md`.

**De tu lote:**

| Skill | Para qué |
|---|---|
| `state-machines-workflows` | **la más importante**: comprobante PENDING_REVIEW → ACCEPTED / REJECTED, cargo PENDING → PAID, con la precondición en la escritura |
| `concurrency-and-locking` | dos comprobantes a la vez, aceptar dos veces, cerrar la consulta mientras llega el pago |
| `model-driven-schema` + `data-modeling-plantuml` | `payment_proofs`, `owner_kind` + índice único, `consents.reason_text`, `surveys` al modelo |
| `authz-access-control` + `api-testing` | el paciente no ve comprobantes ajenos; el médico no acepta cargos de otro; matriz negativa |
| `consent-management` + `clinical-records` | provisiones por sección, PDP con `recordSection`, revocación con motivo |
| `async-messaging-events` + `background-jobs-scheduling` | `booking.completed` por outbox → invitación → mensaje interno, idempotente |
| `notifications-delivery` | el mensaje interno en el hilo correcto |
| `authn-identity` | el puerto del Colegio Médico y la autoridad sembrada |
| `seed-data-catalogs` + `terminology-value-sets` | `VS_CLINICAL_RECORD_SECTION`, `VS_BODY_SYSTEM`, plantilla estándar de consulta, padrón sintético del colegio **declarado sintético** |
| `angular-forms` + `frontend-forms-ux` | el botón Guardar del constructor, el toggle, Likert |
| `coolify-deployment` + `environment-secrets-config` | desplegar el mock y el worker de identidad en staging |
| `e2e-playwright` + `visual-proof` + `critical-double-review` | tus `test()` y las dos pasadas |

### 1.4 DoD de esta sección

- [ ] Salidas pegadas en tu daily.
- [ ] Leíste las skills, empezando por `state-machines-workflows`.
- [ ] `PLAN.md` en cada repo (`docs/trabajo/2026-10-23-doctor-pagos-identidad-consentimiento/PLAN.md`) **antes** del primer `Edit`/`Write` de código.

> ### ✅ Hechos ya verificados contra el corte
>
> - Comprobante del paciente: **no existe** (ni entidad, ni endpoint, ni UI). `payments.payment_receipts` es un recibo emitido; `billing.payments_received` no tiene archivo. La bandera `appointment_payment_states` (PENDING/PARTIALLY_PAID/PAID) es manual y del personal (`scheduling-bookings.controller.ts:250-282`).
> - Factura sólo con pago: **sólo** en `billing-simulated.service.ts:715-719` (`PAYMENT_REQUIRED`); `issue-from-encounter` (`billing-receivables.controller.ts:159`) no lo mira. Cierre: `encounters.service.ts:324-405` y `bookings/:id/complete` no miran el pago.
> - El cargo simulado no sabe de qué sede es (`billing-simulated.service.ts:342-355`, primera práctica del tenant).
> - CI: el médico no chequea documento (`iam-practitioner-self-registration.service.ts:462-486`) y lo inserta como `OWNER_PATIENT` (`:804-814`; no existe `OWNER_PRACTITIONER`, `concepts.ts:399-405`); `identifiers` sin índice único (`02_common/04_indexes.sql:11`); `findActiveDuplicate` sin owner type (`identifiers.repository.ts:65-86`).
> - Colegio: autoridad genérica única (`identity-verification-seed.service.ts:143-190`); el mock trata MEDICAL_LICENSE como un string; verificación manual de credenciales en `profiles-practitioners.controller.ts:745,781` sin enlace con el check automático.
> - Consentimiento: dos flujos; el front usa `care-relationships` sin áreas ni motivo; `practitioner-access-requests` guarda provisiones por especialidad y **nadie lo llama**; REJECT = REVOKED; `reasonText` no se persiste (`practitioner-access-requests.service.ts:154,416`); el PDP no mira secciones (`clinical-read.service.ts:365-385`); no hay bandeja del médico.
> - Encuestas: sin LIKERT, sin modo, sin obligatoria por plantilla, sin estándar; `complete-appointment.use-case.ts:35-75` no publica nada; `issueForBooking` sin llamador; `surveys` y `pharma_lab` sin `.puml` (T-31). Constructor: autoguardado por `debounce` (`field-editor.ts:249,559`), «Guardar» de la vista previa no guarda (`form-builder.html:94`).

## 2. Resultado observable

| Hito | Prioridad | Qué queda demostrado |
|---|---|---|
| **P-H1** | `BLOQUEANTE` | Corte, baseline, kill-tests `@pablo` en rojo; **C-01, C-05, C-06 y C-10 publicados con DTO en la primera hora.** |
| **P-H2** | `BLOQUEANTE` | **Pagos (C-01 / MD-06 / PA-04):** el médico ve en la caja «Pagos» de la consulta los comprobantes pendientes, con la imagen, y acepta o rechaza con motivo; el cargo pasa a PAGADO; la consulta **no cierra** sin pago (salvo cobertura total); la factura sólo se emite con pago; la tabla de pago al proveedor lista las sesiones y su estado. |
| **P-H3** | `BLOQUEANTE` | **CI único por tipo de usuario (C-10 / MD-01):** dos médicos con el mismo CI y terminación → 409 claro en el alta; médico y paciente con el mismo CI → permitido y vinculados; validador asíncrono en web y móvil; índice único en la base. |
| **P-H4** | `ALTA` | **Colegio Médico (MD-02 / C-07):** el mock responde ACTIVE / SUSPENDED / NOT_FOUND por matrícula + CI + profesión; la autoridad «Colegio Médico de Bolivia» está sembrada; la matrícula del médico se verifica por el puerto y la credencial queda VERIFIED con fuente; NOT_FOUND deja la matrícula PENDING con motivo. |
| **P-H5** | `ALTA` | **Consentimiento (C-05 / MD-03 / PA-08):** el médico pide acceso eligiendo secciones de la historia, sistema del cuerpo y fase, con motivo; ve su bandeja de pedidos y su estado; la lectura clínica respeta las secciones concedidas. |
| **P-H6** | `ALTA` | **Encuestas y formularios (C-06 / MD-05):** `surveys` en el modelo; botón Guardar; toggle Médico–Marketing; Likert sólo en marketing; plantilla estándar de consulta obligatoria; al completar la cita, la invitación se emite sola y llega por la mensajería interna. |
| **P-H7** | `ALTA` | **Despliegue (C-07):** `mock-provider-server` y `worker-identity_assurance` en Coolify (staging), con `AUTO_DECIDE=false`. |
| **P-H8** | `ALTA` | Kill-tests `@pablo` en verde, regresión, gates, doble revisión, `REPORTE.md`, PRs mergeables; merges a `dev` de todo el equipo. |

> ⚠️ **Orden: P-H1 → P-H2 → P-H3 → P-H5 → P-H6 → P-H4 → P-H7 → P-H8.** C-01 vale más que todo lo demás junto: cinco personas construyen contra él.

**Kill-test del lote completo:** como paciente (lo de Richard) subí un comprobante; entrá como médico a la
consulta: si en «Pagos» no ves el comprobante con botones Aceptar / Rechazar, P-H2 no está hecho. Cerrá la
consulta sin aceptarlo: si cierra, **P-H2 está mal hecho**. Registrá dos médicos con el mismo CI y
terminación: si el segundo entra, P-H3 no está hecho. Pedí acceso a un paciente: si no podés elegir
«Enfermedades activas» y «Sistema cardiovascular», P-H5 no está hecho. Completá una cita: si al paciente no
le llega la encuesta por la mensajería interna, P-H6 no está hecho.

## 3. Alcance

**IN:** corte y baseline · C-01 completo (modelo, API, caja Pagos del médico, tabla de pago al
proveedor, cierre y factura condicionados) · C-10 (modelo, API, validador web y móvil) · módulo
`medical-college` del mock + puerto + autoridad sembrada + verificación de matrícula · C-05 (catálogos,
API, pantalla de pedido del médico, bandeja, PDP por sección) · C-06 (`surveys` al modelo, Likert, modo,
obligatoria, estándar de consulta, evento `booking.completed`, worker, mensaje interno, botón Guardar,
toggle) · despliegue en Coolify · tus `test()` · simulador · `PLAN.md`, `REPORTE.md`, `evidencia/`.

**OUT:** **cualquier archivo fuera de los reservados** · la pantalla de pago del paciente, la cobertura y
el % (**Richard**, C-02: vos inyectás `PatientSharePort`) · el buzón del paciente y la bandeja de permisos
del paciente (**Leo**) · la agenda (**Justin**) · el QR de receta y órdenes (**Ender**, **Itzan**) · la
pasarela y el QR con monto (T-28/T-29) · el motor de reglas de pólizas (D-1) · el módulo de identidad del
mock (**Leo**) · debilitar un spec · declarar `HECHO` sin DoD corrido.

**Ambigüedades registradas** (además de Q-06, Q-13, Q-14 y D-2, D-3 del plan):

| ID | Ambigüedad | Supuesto tomado | A quién confirmar |
|---|---|---|---|
| Q-P1 | MD-06 «Solo se habilita facturacion cuando se haya confirmado el pago»: ¿y el cierre clínico? El cliente dice «hacer un cierre del servicio» | **Las dos**: `encounters.close` → 412 `PAYMENT_REQUIRED` salvo `insuranceCoversFull` o una excepción administrativa auditada (`closeWithoutPayment { reason }`, rol FINANCE), y la factura ya lo exige | Doctor |
| Q-P2 | ¿El cargo de la consulta nace con la cita o con el cierre? Hoy el «cargo» es el encuentro | Nace **al iniciar la consulta** (`bookings/:id/start`) con el precio del servicio reservado y la sede de la reserva (así el QR de la sede se resuelve); el cierre lo exige PAID | Doctor + Pablo |
| Q-P3 | PA-04.3 «tabla de pago al proveedor»: ¿es la vista del médico de sus sesiones y su estado de pago, o una liquidación a AloVida? | Vista del médico: sesiones del período con monto, parte del paciente, parte del seguro, estado y comprobante. La comisión a AloVida es T-13, fuera de alcance | Pablo |
| Q-P4 | C-10 ¿qué se hace con los duplicados **ya existentes** al crear el índice único? | El patch **mide** (`SELECT … GROUP BY HAVING count > 1`) y, si hay, crea el índice **parcial** sobre `created_at > fecha del patch` y registra los duplicados en el reporte para resolverlos a mano. Nunca se borran filas | Pablo |
| Q-P5 | MD-02: el padrón del Colegio es sintético | Sí, declarado (`synthetic: true`, procedencia «generado 2026-10-23 para el mock»); las matrículas de `seed:e2e` se incluyen para que el flujo cierre | Pablo |
| Q-P6 | MD-05.c «BOTÓN TOGGLE EN PARTE SUPERIOR DERECHA: Medico – Marketing» ¿en `form-builder` (fichas clínicas) o en `questionnaires` (encuestas)? | En **las dos**, con el mismo componente: en `form-builder` cambia entre campos clínicos y preguntas de marketing (Likert); en `questionnaires` fija el `kind` de la plantilla | Doctor |

## 4. Plan — hitos, subtareas y microtareas

Estados: `TODO`, `EN CURSO`, `HECHO`, `A MEDIAS`, `BLOQUEADO`, `DESCARTADO`.

### H1 — Corte, baseline, kill-tests en rojo y contratos publicados

**Prioridad:** `BLOQUEANTE`

**CA:** Dado tu entorno, cuando alguien pregunta contra qué versión trabajaste, qué estaba en rojo y qué forma tienen C-01, C-05, C-06 y C-10, entonces hay SHA, salidas, kill-tests en rojo y cuatro filas en §4-bis del daily con el DTO literal.
**DoD:** `evidencia/antes/`; daily actualizado antes de la primera hora.
**Estado:** TODO

#### H1.S1 — Corte y baseline

**CA:** Dado un rojo posterior, cuando alguien pregunta si lo rompiste vos, entonces la respuesta sale de un archivo.
**DoD:** exit codes pegados.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H1.S1.M1 | Corte y rama en los cinco repos | SHA en `PLAN.md` | `git rev-parse` | TODO |
| H1.S1.M2 | Baseline API (`NODE_OPTIONS=--max-old-space-size=8192`) y front | Exit codes | `lint; typecheck; test` ×2 → `evidencia/antes/` | TODO |
| H1.S1.M3 | API real + `seed:e2e` + paciente sintético | Logins | `evidencia/antes/cuentas.md` | TODO |

#### H1.S2 — Contratos y kill-tests

**CA:** Dado el daily, cuando lo abren los otros cinco, entonces encuentran C-01, C-05, C-06 y C-10 con DTOs.
**DoD:** cuatro filas en §4-bis; `--grep "@pablo"` en rojo pegado.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H1.S2.M1 | Publicar C-01 (`PaymentProofDto`, rutas, 409/412/422) | Fila | daily | TODO |
| H1.S2.M2 | Publicar C-05 (DTOs de pedido, decisión, retiro, lecturas) | Fila | daily | TODO |
| H1.S2.M3 | Publicar C-06 (`PatientInvitationDto` extendido, targets nuevos) | Fila | daily | TODO |
| H1.S2.M4 | Publicar C-10 (código 409 y `document-availability`) | Fila | daily | TODO |
| H1.S2.M5 | Correr y clasificar `--grep "@pablo"` | Tabla | `evidencia/antes/kill-tests-pablo.txt` | TODO |

### H2 — Pagos del médico: comprobantes, aceptar / rechazar, cierre y factura con pago (C-01)

**Prioridad:** `BLOQUEANTE`

**CA:** Dado un cargo con un comprobante PENDING_REVIEW, cuando el médico lo acepta, entonces el comprobante pasa a ACCEPTED, el cargo a PAID, la consulta puede cerrarse y facturarse, y el paciente ve «Pagado»; cuando lo rechaza con motivo, el comprobante pasa a REJECTED, el cargo vuelve a PENDING y el paciente ve el motivo; cerrar sin pago → 412 `PAYMENT_REQUIRED`; aceptar dos veces → 409; aceptar un cargo ajeno → 404.
**DoD:** patch del modelo aplicado con deriva 0; int-specs con base real (camino feliz, concurrencia, matriz negativa); `test('PA-04 médico acepta')`, `test('MD-06 cierre exige pago')`, `test('MD-06 factura exige pago')` verdes; OpenAPI regenerado; capturas de la caja Pagos.
**Estado:** TODO

#### H2.S1 — Modelo

**CA:** Dado `.puml` M17, cuando se regenera, entonces existe `billing.payment_proofs` con sus FK, índice único parcial `ux_payment_proofs_pending_per_charge (charge_id) WHERE status = 'PENDING_REVIEW'`, y `billing.charges.practice_site_id`.
**DoD:** `python salud-db/gen_ddl.py 17` con diff limpio salvo lo nuevo; patch en `SQL/patches/2026-10-2x_v43x_payment_proofs.sql`; `yarn orm:audit` 0.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H2.S1.M1 | `payment_proofs` en `diagram_17_billing.puml` con las columnas de C-01 | Regenera | `gen_ddl.py 17` | TODO |
| H2.S1.M2 | `charges.practice_site_id` (FK nullable a `practice.practice_sites`) para resolver el QR de la sede | Regenera | `gen_ddl.py 17` | TODO |
| H2.S1.M3 | Patch + entidad MikroORM + `orm:catalog` | Deriva 0 | `yarn orm:audit` | TODO |

#### H2.S2 — API

**CA:** Dado C-01, cuando se llaman los endpoints, entonces responden con la forma publicada, con la precondición en el `UPDATE` (`WHERE status = 'PENDING_REVIEW'`) y con acceso por objeto.
**DoD:** int-specs: feliz, 409 doble aceptación, 409 segundo comprobante pendiente, 422 sin archivo, 404 ajeno, 403 rol; `test:integration billing` verde.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H2.S2.M1 | `GET /billing/me/charges/:chargeId/payment-context` (inyecta `PatientSharePort` de Richard; hasta que exista, doble declarado que devuelve `NO_COVERAGE`) | Forma de C-01 | int-spec | TODO |
| H2.S2.M2 | `POST /billing/me/charges/:chargeId/payment-proofs` | 201 / 409 / 422 | int-spec | TODO |
| H2.S2.M3 | `GET /billing/charges/:chargeId/payment-proofs` (médico, acceso por objeto) | 404 ajeno | int-spec | TODO |
| H2.S2.M4 | `POST /billing/payment-proofs/:id/accept` y `/reject { reason }` con precondición en la escritura | 409 en carrera (test con dos llamadas concurrentes) | int-spec | TODO |
| H2.S2.M5 | El cargo nace al `start` de la reserva con sede y precio (Q-P2); el estado del cargo se deriva del comprobante y **reemplaza** la bandera manual para el paciente | `PUT payment-state` marcado `@deprecated` en OpenAPI | int-spec | TODO |
| H2.S2.M6 | `encounters.close` → 412 `PAYMENT_REQUIRED` salvo `insuranceCoversFull` o `closeWithoutPayment { reason }` auditado (Q-P1) | Tres casos | int-spec | TODO |
| H2.S2.M7 | `POST /billing/invoices:issue-from-encounter` exige PAID (mismo código que el simulado) | 412 | int-spec | TODO |
| H2.S2.M8 | `GET /billing/me/provider-payment-table?from&to` (Q-P3): sesiones, monto, parte paciente, parte seguro, estado, comprobante | Paginado por cursor | int-spec | TODO |
| H2.S2.M9 | Aviso al paciente (campana + mensaje interno) al aceptar o rechazar, por el adaptador de avisos existente | Dos avisos | int-spec | TODO |

#### H2.S3 — La caja «Pagos» de la consulta y la tabla del proveedor

**CA:** Dado `/medical-records/:profileId/consultation`, cuando hay comprobantes, entonces la caja «Pagos» los lista con miniatura (abre en lightbox), monto, método, fecha, y botones «Aceptar» / «Rechazar» (motivo obligatorio); el estado del cargo se ve; «Cerrar consulta» avisa si falta el pago y ofrece la excepción si el rol la tiene.
**DoD:** `test('PA-04 médico acepta')` verde; specs; capturas 1440/768/390 claro/oscuro; `/billing` con pestaña «Pagos por sesión» (la tabla).
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H2.S3.M1 | `billing.client.ts`: `comprobantes(chargeId)`, `aceptar`, `rechazar`, `tablaProveedor` | spec | spec | TODO |
| H2.S3.M2 | `payments-block` con la lista de comprobantes y acciones (ícono + texto), miniatura PHI vía `contentDataUrl` | spec | spec | TODO |
| H2.S3.M3 | «Cerrar consulta» maneja 412 con mensaje accionable y la excepción auditada | spec | spec | TODO |
| H2.S3.M4 | `/billing` → pestaña «Pagos por sesión» con `app-data-table` | captura | doble revisión | TODO |
| H2.S3.M5 | Simulador: `billing.handlers.ts` + `flows.handlers.ts` con C-01 y los tres niveles | spec | spec | TODO |
| H2.S3.M6 | Móvil: `consultation_billing_sheet.dart` muestra comprobantes y acepta / rechaza | `flutter test` | salida | TODO |

### H3 — CI único por tipo de usuario (C-10 / MD-01)

**Prioridad:** `BLOQUEANTE`

**CA:** Dado un médico registrado con CI `1234567 SC`, cuando otro médico intenta registrarse con el mismo CI y terminación, entonces 409 `DOCUMENT_ALREADY_REGISTERED` con `{ field: 'nationalId' }` y el formulario lo marca en el campo; cuando un **paciente** se registra con ese CI, entonces se acepta y queda vinculado a la misma persona; `GET /iam/auth/document-availability` responde en < 300 ms; la base rechaza el duplicado aunque el servicio falle.
**DoD:** patch con índice único (Q-P4) y deriva 0; int-specs de los tres altas y la asistida; `test('MD-01 CI duplicado del médico')` verde; validador asíncrono en web (`register-practitioner`, `register-patient`, `register-organization`) y móvil.
**Estado:** TODO

#### H3.S1 — Modelo y repositorio

**CA:** Dado `common.identifiers`, cuando se regenera, entonces tiene `owner_kind` y el índice único parcial; `findActiveDuplicate` acepta `ownerKind`.
**DoD:** `gen_ddl.py 02`; patch que **mide duplicados primero**; `yarn orm:audit` 0; spec del repositorio.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H3.S1.M1 | `owner_kind` + `issuer_department` en `diagram_02_common.puml` | Regenera | `gen_ddl.py 02` | TODO |
| H3.S1.M2 | Patch: medición de duplicados + índice único (parcial si hay) + reporte | Salida de la medición pegada | psql | TODO |
| H3.S1.M3 | `OWNER_PRACTITIONER` y `OWNER_ORGANIZATION_REP` en `concepts.ts` y seed de conceptos | Seed idempotente (segunda corrida 0 inserts) | `yarn seed:boot` ×2 | TODO |
| H3.S1.M4 | `findActiveDuplicate({ typeConceptId, value, issuerDepartment, ownerKind })` | spec | spec | TODO |

#### H3.S2 — Los altas y el endpoint de disponibilidad

**CA:** Dado cada alta (paciente, médico, organización, asistidas), cuando el documento ya existe para ese `ownerKind`, entonces 409 con el código estable; `document-availability` es público, con rate limit, y no revela a quién pertenece.
**DoD:** int-specs; `altas-api-real-tres-escenarios.spec.ts` ampliado con el CI de médico duplicado.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H3.S2.M1 | Médico: chequeo antes de crear + `ownerKind: PRACTITIONER` al insertar | 409 | int-spec | TODO |
| H3.S2.M2 | Paciente: mismo código de error (hoy mensaje libre) y vinculación a la persona existente si el CI es de un médico | Persona única | int-spec | TODO |
| H3.S2.M3 | Organización (representante) y altas asistidas | 409 | int-spec | TODO |
| H3.S2.M4 | `GET /iam/auth/document-availability?type&number&issuer&userType` → `{ available }` | 60/min; sin PII en la respuesta | int-spec | TODO |
| H3.S2.M5 | Front: `AsyncValidator` de documento en los tres registros + mapeo del 409 por **código**, no por regex del mensaje | spec de cada formulario | spec | TODO |
| H3.S2.M6 | Móvil: validador en `practitioner_registration` y `register_patient_wizard` | `flutter test` | salida | TODO |

### H4 — El Colegio Médico simulado y la matrícula verificada (MD-02 / C-07)

**Prioridad:** `ALTA`

**CA:** Dado un médico con matrícula, cuando pide la verificación de matrícula, entonces la API consulta `MedicalCollegePort` (adaptador HTTP → mock) con número, CI y profesión; ACTIVE → la matrícula pasa a AUTH_ACTIVE y la credencial a VERIFIED con `verificationSourceUri` del colegio; SUSPENDED o NOT_FOUND → PENDING con motivo visible; el padrón del mock es sintético y declarado.
**DoD:** tests del mock (tres niveles); spec del adaptador; int-spec del flujo; `test('MD-02 matrícula verificada por el colegio')` verde; autoridad sembrada idempotente.
**Estado:** TODO

#### H4.S1 — El módulo del mock

**CA:** Dado `POST /medical-college/verify { licenseNumber, nationalId, profession }`, cuando la matrícula existe y coincide el CI, entonces `ACTIVE` con `college`; CI distinto → `MISMATCH`; inexistente → `NOT_FOUND`; body incompleto → 422.
**DoD:** `yarn test` del mock; Swagger.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H4.S1.M1 | `src/medical-college/{domain,application/ports,application/use-cases,infrastructure/adapters,presentation}` | Estructura | árbol | TODO |
| H4.S1.M2 | Padrón sintético (JSON versionado, `synthetic: true`, incluye las matrículas de `seed:e2e`) | Procedencia en el archivo | archivo | TODO |
| H4.S1.M3 | Endpoint + tests de los tres niveles | Verde | `yarn test` | TODO |

#### H4.S2 — El puerto, la autoridad y el efecto

**CA:** Dado el check MEDICAL_LICENSE, cuando el worker lo despacha, entonces usa `MedicalCollegePort` (no el genérico) y el resultado se refleja en la matrícula y la credencial.
**DoD:** int-spec; seed idempotente.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H4.S2.M1 | `identity_assurance/application/ports/medical-college.port.ts` + adaptador HTTP + adaptador «no configurado» | spec | spec | TODO |
| H4.S2.M2 | Autoridades `COLEGIO_MEDICO_BOLIVIA`, `COLEGIO_ODONTOLOGOS_BOLIVIA` + value set de colegios por profesión (procedencia: proceso 2.1 del stakeholder) | Seed ×2 sin cambios | `seed:boot` | TODO |
| H4.S2.M3 | El check de matrícula manda número, CI y profesión; el efecto `applyVerified` también marca la credencial VERIFIED con `verificationSourceUri` | int-spec | int-spec | TODO |
| H4.S2.M4 | Campo «Matrícula del Colegio» en el alta y en el onboarding del médico (DTO + front + móvil) | 400 no aparece | spec | TODO |
| H4.S2.M5 | El trámite de matrícula del front manda `jurisdictionAuthorizationId` (hoy lo omite, `identity-verification.ts:396-399`) — coordinar con Leo (archivo suyo): vos entregás el cambio por PR chico que él revisa | Fila en el daily | daily | TODO |

### H5 — Consentimiento por sección, sistema y fase; bandeja del médico (C-05 / MD-03 / PA-08)

**Prioridad:** `ALTA`

**CA:** Dado el médico en la ficha de un paciente, cuando pide acceso, entonces elige secciones de la historia, sistemas del cuerpo y fase, con motivo; el pedido aparece en su bandeja `/access-inbox` con estado por sección; cuando el paciente concede algunas secciones, la lectura de las no concedidas da 403 `SECTION_NOT_GRANTED`; rechazar y revocar llevan motivo y son estados distintos.
**DoD:** catálogos sembrados con procedencia; int-specs del flujo completo + PDP por sección + matriz negativa; `test('MD-03 bandeja del médico')` y `test('PA-08 API: decisión con motivo')` verdes; `request-access` migrado al flujo único.
**Estado:** TODO

#### H5.S1 — Modelo y catálogos

**CA:** Dado `.puml` M07, cuando se regenera, entonces `consents.reason_text`, `consent_provisions.record_section_concept_id`, `body_system_concept_id`, `record_phase_concept_id`, `decision_reason_text` existen; los value sets están sembrados.
**DoD:** `gen_ddl.py 07`; patch; `orm:audit` 0; seed idempotente.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H5.S1.M1 | Columnas en `diagram_07_consent.puml` | Regenera | `gen_ddl.py 07` | TODO |
| H5.S1.M2 | `VS_CLINICAL_RECORD_SECTION`, `VS_BODY_SYSTEM` (reutilizando `EXAM_BODY_SYSTEM_*`), `VS_RECORD_PHASE` con procedencia | Seed ×2 | `seed:boot` | TODO |
| H5.S1.M3 | Patch + ORM | Deriva 0 | `orm:audit` | TODO |

#### H5.S2 — API y PDP

**CA:** Dado C-05, cuando se ejercita, entonces el pedido persiste motivo y dimensiones, la decisión es por sección con motivo, el retiro tiene motivo y estado propio, `sent` lista la bandeja del médico, y `clinical-read` consulta por sección.
**DoD:** int-specs; `test:integration consent clinical` verde.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H5.S2.M1 | DTOs de pedido y decisión extendidos (lista blanca) | 400 no aparece desde el front | int-spec | TODO |
| H5.S2.M2 | `GET /consent/practitioner-access-requests/sent` (médico) con filas por sección y estado | Paginado | int-spec | TODO |
| H5.S2.M3 | `POST /consent/me/consents/:id/withdraw { reasonText }` → estado REVOKED distinto de DECLINED | Dos estados | int-spec | TODO |
| H5.S2.M4 | `clinical-read.service.ts` pasa `recordSection` al PDP; 403 `SECTION_NOT_GRANTED`; la relación activa no salta secciones | Cuatro casos | int-spec | TODO |
| H5.S2.M5 | `authz/care-relationships/request` deja de pedirse desde la UI (queda para vinculación); documentar en OpenAPI | Nota | OpenAPI | TODO |

#### H5.S3 — Pantallas del médico

**CA:** Dado `request-access`, cuando el médico pide, entonces elige secciones, sistemas y fase con casillas agrupadas y escribe el motivo; `/access-inbox` lista sus pedidos con estado por sección y motivo de la decisión.
**DoD:** specs; `test('MD-03 …')` verde; capturas.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H5.S3.M1 | `consent.client.ts` del médico (`pedir`, `misPedidosEnviados`) — el del paciente lo escribe Leo en el mismo archivo **por contrato**: vos creás el archivo con tus métodos el día 1 y él agrega los suyos | Archivo creado el día 1 | daily | TODO |
| H5.S3.M2 | `request-access` migrado a C-05 con grupos de casillas (sección / sistema / fase) y motivo | spec | spec | TODO |
| H5.S3.M3 | `access-inbox` con `app-data-table` y fila en el menú del médico | spec + captura | doble revisión | TODO |
| H5.S3.M4 | Simulador: `consent.handlers.ts` (compartido con Leo por contrato: vos el lado médico) | spec | spec | TODO |

### H6 — Encuestas y formularios (C-06 / MD-05)

**Prioridad:** `ALTA`

**CA:** Dado el constructor de formularios, cuando el médico edita, entonces hay un botón «Guardar» explícito (además del autoguardado, que se mantiene como respaldo) y un toggle «Médico – Marketing» arriba a la derecha; en marketing hay preguntas Likert con anclas; la plantilla estándar de consulta existe, es obligatoria y el médico sólo agrega preguntas; al completar una cita, la invitación se emite sola y el paciente recibe un mensaje en el hilo con el médico; farmacia y laboratorio pueden emitir por `PHARMACY_ORDER` / `DIAGNOSTIC_ORDER`.
**DoD:** `surveys` en el modelo (`.puml` M65, DDL, `rebuild` con las 7 tablas); int-specs del evento y del worker (idempotencia: dos `completed` → una invitación); `test('MD-05 Guardar')`, `test('MD-05 Likert en marketing')`, `test('MD-05 envío automático por mensajería')` verdes; `docs/pendientes-backend-surveys.md` corregido.
**Estado:** TODO

#### H6.S1 — `surveys` al modelo (T-31) y columnas nuevas

**CA:** Dado el `.puml` M65 nuevo, cuando se regenera, entonces las 7 tablas existentes se transcriben sin cambios de forma y se agregan `kind`, `mandatory_for_patient`, `partner_type`, `LIKERT` y `scale_labels_json`.
**DoD:** `gen_ddl.py 65`; `rebuild_stack.py --yes` con conteo de schemas +1; `orm:audit` 0; int-specs del módulo en verde.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H6.S1.M1 | Transcribir las 7 entidades a `diagram_65_surveys.puml` (procedimiento de `audio_assets`) | DDL = entidades | `orm:audit` | TODO |
| H6.S1.M2 | Columnas nuevas + value set `LIKERT` | Regenera | `gen_ddl.py 65` | TODO |
| H6.S1.M3 | Patch + ORM; anotar en el vault que T-31 queda a medias (`pharma_lab` sigue sin `.puml`) | Nota | vault | TODO |

#### H6.S2 — API: Likert, modo, estándar, evento, worker, mensaje, targets

**CA:** Dado C-06, cuando se ejercita, entonces todo responde con la forma publicada y el envío es idempotente.
**DoD:** int-specs; `test:integration surveys scheduling messaging` verde.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H6.S2.M1 | `LIKERT` sólo en plantillas `MARKETING` (422 en `CLINICAL`) | Test | int-spec | TODO |
| H6.S2.M2 | Plantilla `SURVEY_STD_CONSULTATION` sembrada como `PROPUESTA` (Q-14) y asignada a `CARE_TYPE = CONSULTATION` (habilitar CARE_TYPE, hoy rechazado) | Seed ×2 | `seed:boot` | TODO |
| H6.S2.M3 | `complete-appointment.use-case.ts` publica `scheduling.booking.completed` en `messaging.outbox_messages` (coordinar con Justin: el archivo es suyo; vos entregás el publisher y él lo llama, o él te cede ese archivo por el daily) | Fila en el daily | daily | TODO |
| H6.S2.M4 | Worker `surveys` consume el evento, emite por `issueForBooking` y manda el mensaje interno en el hilo médico↔paciente | Dos `completed` → una invitación | int-spec | TODO |
| H6.S2.M5 | `POST /surveys/invitations { targetType: PHARMACY_ORDER | DIAGNOSTIC_ORDER, targetId }` + emisión al pasar a RETIRADO / CONFIRMADO (los disparos los llaman Ender e Itzan por contrato) | int-spec | int-spec | TODO |
| H6.S2.M6 | `PatientInvitationDto` extendido + filtro `partnerType` | int-spec | int-spec | TODO |

#### H6.S3 — Constructor y editor de encuestas

**CA:** Dado `form-builder` y `questionnaires`, cuando el médico trabaja, entonces hay Guardar explícito, toggle y Likert como dice el CA del hito.
**DoD:** specs; Playwright; capturas; `carril-27-editor-encuestas.spec.ts` y `formularios-*.spec.ts` actualizados.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H6.S3.M1 | Botón «Guardar» en la cabecera de `form-builder` que fuerza `guardarAhora()` y muestra «Guardado hace N s» (S7) | spec | `test('MD-05 Guardar')` | TODO |
| H6.S3.M2 | Toggle «Médico – Marketing» (componente compartido, arriba a la derecha, accesible por teclado, estado no sólo por color) en las dos pantallas (Q-P6) | spec | spec | TODO |
| H6.S3.M3 | Tipo Likert en `question-editor` (anclas editables, 3–7 puntos) sólo con modo marketing | spec | `test('MD-05 Likert')` | TODO |
| H6.S3.M4 | «Asociar a un servicio» con selector de servicios reales (no UUID a mano) y la casilla «Obligatoria para el paciente» | spec | spec | TODO |
| H6.S3.M5 | Vista de la plantilla estándar de consulta (sólo lectura + «Agregar preguntas») | captura | doble revisión | TODO |
| H6.S3.M6 | Simulador `surveys-forms.handlers.ts` (lado médico; Leo el lado paciente) | spec | spec | TODO |

### H7 — Despliegue del mock y del worker de identidad (C-07)

**Prioridad:** `ALTA`

**CA:** Dado Coolify (staging), cuando se despliega, entonces `mock-provider-server` responde `/health` desde la red interna, `worker-identity_assurance` corre con `MOCK_PROVIDER_BASE_URL` apuntando al mock y `AUTO_DECIDE=false`, y el guard de producción sigue bloqueando cualquier mock en `production`.
**DoD:** `docker compose -f docker-compose.coolify.yml config` sin error; captura de los dos servicios `running:healthy`; un caso de KYC creado en staging queda IN_VERIFICATION hasta la decisión del admin.
**Estado:** TODO

#### H7.S1 — Compose y guard

**CA:** Dado `worker.env.ts`, cuando `MOCK_PROVIDER_ALLOWED_IN=staging` y `NODE_ENV=staging`, entonces arranca; con `NODE_ENV=production` aborta igual que hoy.
**DoD:** spec de `worker.env`; compose validado.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H7.S1.M1 | Servicios `mock-provider-server` y `worker-identity_assurance` en `docker-compose.coolify.yml` (volumen para `MOCK_STATE_DIR`) | `config` ok | `docker compose config` | TODO |
| H7.S1.M2 | `assertMockProviderNotInProduction` con `MOCK_PROVIDER_ALLOWED_IN` | spec | `yarn test worker.env` | TODO |
| H7.S1.M3 | Despliegue y verificación en staging | Captura `running:healthy` | evidencia | TODO |

### H8 — Verde, merges y cierre

**Prioridad:** `ALTA`

**CA:** Dado el lote y el equipo, cuando se corre `--grep "@pablo"` contra la API real, entonces todo pasa; los PRs de las seis personas se mergean a `dev` en el orden de dependencias; cada merge se re-consulta con `gh`.
**DoD:** `evidencia/despues/`; `evidencia/doble-revision.md`; salidas de `gh`; `REPORTE.md`; tabla de merges en el daily de equipo.
**Estado:** TODO

#### H8.S1 — Cierre

**CA:** Dado el `REPORTE.md`, cuando lo lee alguien que no vio la sesión, entonces sabe qué anda, qué no y qué falta exactamente.
**DoD:** `report_gate.py --self-test` PASS.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H8.S1.M1 | Kill-tests `@pablo` en verde | 0 fallos | `corepack yarn pw … --grep "@pablo"` | TODO |
| H8.S1.M2 | Regresión API (`test`, `test:integration` de billing, iam, consent, surveys, identity_assurance), front, móvil | Exit 0 | salidas | TODO |
| H8.S1.M3 | OpenAPI regenerado; gates; doble revisión | archivo | evidencia | TODO |
| H8.S1.M4 | Merges a `dev` en orden: modelo → API (contratos) → front/móvil; re-consulta de `gh` tras cada merge | Tabla en el daily | daily | TODO |
| H8.S1.M5 | `REPORTE.md` en cada repo | avance calculado | `report_gate.py` | TODO |

## 5. Definition of Done del lote

1. Los `test()` `@pablo` pasan **contra la API real**; C-01, C-05, C-06 y C-10 responden con la forma publicada el día 1 (si cambió, el cambio está en el daily con fecha).
2. Deriva modelo ↔ base ↔ ORM en 0 tras cada patch; `rebuild_stack.py --yes` en PASS con `surveys` dentro.
3. `lint`, `typecheck`, `test`, `test:integration` (módulos tocados) de la API; `lint`/`typecheck`/`test`/`gates:diseno` del front; `flutter analyze`/`flutter test`: exit 0 o rojos previos clasificados.
4. Matriz de autorización negativa en todo endpoint nuevo o tocado.
5. Ninguna aserción debilitada; ningún `@Roles` cambiado sin fila en el daily.
6. Mock y worker desplegados en staging con `AUTO_DECIDE=false`; producción sigue bloqueando el mock.
7. Capturas con dos pasadas; PRs `MERGEABLE` con `gh`; `REPORTE.md` con avance calculado y «No cubierto».
