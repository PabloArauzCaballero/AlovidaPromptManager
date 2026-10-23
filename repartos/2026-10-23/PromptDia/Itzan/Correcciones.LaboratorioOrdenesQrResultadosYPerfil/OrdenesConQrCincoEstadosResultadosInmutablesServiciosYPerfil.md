# Las órdenes de laboratorio e imagenología con QR, los cinco estados, los resultados inmutables, el CRUD de servicios con upsert y el perfil del centro

> **Rol:** dueño de las órdenes diagnósticas como enlace, de la pantalla de órdenes del centro, de los resultados, del catálogo de servicios y del perfil del laboratorio e imagenología · **Carril:** 3 · Farmacia, imagenología y laboratorio (con Ender) · **Fecha:** 2026-10-23 · **Turno:** día
> **Fuente del pedido:** [`CORRECCIONES-FULLSTACK-2026-10-23.md`](../../../../../docs/requisitos/CORRECCIONES-FULLSTACK-2026-10-23.md) — **PA-07, LI-01, LI-02, LI-03**, y el lado laboratorio de **PA-02**
> **Verificación contra el código:** [`VERIFICACION-CONTRA-CODIGO-2026-10-23.md`](../../../../../docs/verificacion/VERIFICACION-CONTRA-CODIGO-2026-10-23.md) — §PA-07/LI-01..03
> **Plan completo:** [`planes/06-correcciones-fullstack-2026-10-23/README.md`](../../../../../planes/06-correcciones-fullstack-2026-10-23/README.md) — **producís C-04 (lado orden y centro); consumís C-04 lado reserva (Justin), C-02 (Richard), C-06 (Pablo), `qr-scanner` (Ender)**
> **8 hitos · 13 subtareas · 61 microtareas**, todas con criterio de aceptación y Definition of Done.
>
> **Lo primero que tenés que saber:** el portal «Laboratorio» del front es un **decorado**: todas las rutas
> `/diagnostics/lab/*` (servicios, importación, resultados, subida por partes, retiro) existen sólo en el
> simulador y devuelven 501 contra la API real. Pero la API **sí tiene** recepción de muestras, accesiones,
> órdenes de trabajo, versiones de informe y liberación, repartidas en **seis máquinas de estado**. Tu trabajo
> no es reescribir eso: es **unificarlo** en los cinco estados que pide el cliente, atarlo a una orden con
> QR, y darle una pantalla real. Lo segundo: una orden hoy es **un** estudio; «los features exactos» del
> cliente piden la orden como grupo.

## 0. Ficha de asignación

| Campo | Valor |
|---|---|
| `REPOS` | `mdavila-2001/mantra-core-health-api` · `mdavila-2001/mantra-core-health` · `mantra-core-technologies/mantra-core-health-model` (`.puml` M08 órdenes, M20, M23) · `mdavila-2001/mantra_core_health_mobile` |
| `TARGET_REF` | `origin/dev` front `227eb255` · API `6ea11561` · modelo `eceb98f` · móvil `origin/main` `ec88e81`. **Reconsultá y fijá el tuyo** |
| `RAMAS` | `itzan/laboratorio-ordenes-qr-resultados-perfil-2026-10-23` por repo. PR por hito; el del modelo antes que el de la API |
| `ARCHIVOS RESERVADOS PARA VOS` | API: `clinical/**/service-request*`, `clinical/controllers/clinical-orders*`, `clinical/services/diagnostic-reports.service.ts` (C-04) · `diagnostics/**` · `diagnostic_units/**` · `object_storage/**` (**sólo** lo que la subida de resultados necesite) · `public/**` (resolver `/orden`, coordinado con Ender que tiene `/rx` en el mismo módulo: archivos distintos). Front: `features/laboratory/**` · `features/lab-reception/**` · `features/diagnostics/**` · `features/admin/medical-laboratory/**` · `features/organization/organization-profile/**` (bloque laboratorio) · `features/clinical-record/patient-chart/analysis-order-block/**` (QR de la orden) · `features/account/diagnostic-orders/**` (**sólo** el QR y el enlace; la reserva es de Richard) · `core/data-access/{lab-portal,diagnostics,diagnostic-units}/**` · `core/mock/handlers/{lab,diagnostics}*.handlers.ts` · ruta `/orden/:token` (`features/account/diagnostic-orders/order-link/**`) · tus `test()` en la suite. Modelo: `diagram_08_clinical.puml` (**sólo** el bloque de órdenes), `diagram_20_diagnostics.puml`, `diagram_23_diagnostic_units.puml`. Móvil: `features/lab_portal/**`, `features/health/**` (**sólo** el QR de la orden; la reserva es de Richard) |
| `ARCHIVOS DE OTROS — NO LOS TOQUES` | `clinical/**/prescription*`, `pharmacy*/**`, `features/pharmacy/**`, `qr-scanner` (**Ender**; vos lo usás) · `scheduling/**` (**Justin**: él agrega `serviceRequestId`, `durationMinutes` y el `PATCH duration`; vos consumís) · `billing/**`, `surveys/**`, `@Roles` existentes, `concepts.ts` (**Pablo**) · `insurance/**`, `features/account/appointments/**` (**Richard**) · cabecera, inicio (**Leo**) |
| `⚠️ RIESGO ALTO DE TU CARRIL` | **Los resultados son PHI y, una vez CONFIRMADO, son evidencia.** La inmutabilidad se impone **en la base y en la API** (409 `ORDER_CONFIRMED` en todo lo que toque archivos, versiones, muestras o estado después de confirmar), no sólo en la pantalla; la enmienda posterior es una **orden nueva** enlazada, no una edición. **Segundo:** unificar seis máquinas de estado en una vista no significa borrar ninguna: `GET /diagnostics/orders` **deriva** el estado; las tablas existentes siguen siendo la verdad. **Tercero:** el enlace de la orden es PHI por referencia, igual que la receta de Ender: token firmado, vencimiento, 401/403/410 |
| `CONTRA QUÉ SE PRUEBA` | API real + `start:real-api`. `hito2-laboratory-insurance.spec.ts` corre contra demo y **no certifica nada**: se reescribe |
| `CUENTAS DE PRUEBA` | `seed:e2e` + centro diagnóstico con personal (alta por `registro-*` de laboratorio) + paciente con orden; `yarn seed:diagnostic-units` existe en la API: usalo |
| `DÓNDE SE PRUEBA` | `/administration/laboratory` (nueva pantalla de órdenes), `/laboratorio/recepcion`, `/laboratorio/cola`, `/administration/laboratory-services` (nuevo), `/my-account` (perfil del centro), `/orden/:token`, `/my-account/diagnostic-orders` |
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

⚠️ Fusioná con el `.claude/` que ya tienen el front y la API. Sus `CLAUDE.md`/`AGENTS.md` mandan.

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
| `state-machines-workflows` | **la más importante**: derivar INICIADA / RECIBIDA / EN PROCESO / RECHAZADA / CONFIRMADO de seis máquinas, con la precondición en la escritura |
| `audit-trail-history` + `clinical-records` | CONFIRMADO es inmutable y auditable; la enmienda es una orden nueva |
| `file-uploads-media` + `data-privacy-phi` | N archivos por `object-storage`, tipo real, tamaño, borrado sólo antes de confirmar, descarga autorizada |
| `model-driven-schema` + `data-modeling-plantuml` | `service_request_groups`, enlaces, `defaultSlotMinutes` |
| `authz-access-control` + `api-testing` | el centro equivocado, el paciente equivocado, descargar sin permiso |
| `appointment-scheduling` | leer C-04 lado reserva de Justin y pedir lo que falte |
| `frontend-data-tables` + `frontend-ux-states` | la tabla PACIENTE / ESTUDIO / FECHA / ESTADO / ACCIONES con acciones por estado |
| `seed-data-catalogs` + `data-quality-validation` | upsert masivo de servicios idempotente |
| `directories-public-profiles` | el perfil del centro: qué se muestra y qué no |
| `flutter-development` · `alovida-app-movil-ux` | `lab_portal` contra rutas reales |
| `e2e-playwright` + `visual-proof` + `critical-double-review` | tus `test()` y las dos pasadas |

### 1.4 DoD de esta sección

- [ ] Salidas pegadas en tu daily.
- [ ] Skills leídas, empezando por `state-machines-workflows`.
- [ ] `PLAN.md` en cada repo (`docs/trabajo/2026-10-23-laboratorio-ordenes-qr-resultados/PLAN.md`) **antes** del primer `Edit`/`Write` de código.

> ### ✅ Hechos ya verificados contra el corte
>
> - Órdenes: `clinical.service_requests` con **un** `code_concept_id`; el front crea una por estudio (`analysis-order-block.ts:627`); estados SR_*; sin QR ni token (`grep qr` en 08/20/23: nada).
> - Seis máquinas: muestras SPEC_*, accesiones ACC_*, ítems ACC_ITEM_*, órdenes de trabajo WO_OPEN, pruebas TEST_*, versiones REPORT_* (`diagnostics.concepts.ts:18-204`). Mapeo a los cinco en la verificación §LI. Imagenología fuera de la recepción (`CATEGORIES_WITH_SPECIMEN`, `:335-338`).
> - Resultados reales: `POST /diagnostics/reports/:reportId/versions` (`:49`), `release` (`:66`); archivos por `fileId` (`diagnostics-reports.service.ts:114-123`); subida por `object-storage` (`initiate :73`, `complete :89`, `content :223`); descarga sólo del paciente (`diagnostics-patient-results.controller.ts:173`). Inmutabilidad: 409 en re-liberar (`:159-163`) pero `createReportVersion` acepta versiones nuevas tras FINAL y nada bloquea archivos ni estado.
> - Portal del front **sólo simulador** (`lab-portal.client.ts:30-35,195-204`); lo real: `lab-reception.ts` (Paciente, Estudio, Pedida, Estado, Acciones, `:166-171`), `diagnostics.ts` (cola), `medical-laboratory`. Móvil `lab_portal_repository.dart:13-15,77-195` contra rutas inexistentes; móvil llama `GET /clinical/diagnostic-orders/:id/results` **que no existe** (`health_repository.dart:484`).
> - Servicios: `POST /diagnostic-units/:id/study-offerings` (`:224`), `DELETE` retirar (`diagnostic-pricing.controller.ts:72`); **sin PATCH ni masivo**; `expected_duration_minutes` existe (`23_diagnostic_units/02_tables.sql:93`) y no se usa.
> - Perfil: `organization-profile.ts:18-24,36-40` para DIAGNOSTIC_CENTER muestra sólo razón social, nombre comercial, zona horaria y logo; `diagnostic_units` tiene `accepts_external_orders`, `walk_in_available`, `home_collection_available`, verificación, estado, que la pantalla no expone.
> - Reserva: `DEFAULT_SLOT_MINUTES = 30` constante; `slotMinutes` por plantilla/regla; sin default por unidad; la reserva no lleva la orden (web no la pasa; móvil en `reasonText`).

## 2. Resultado observable

| Hito | Prioridad | Qué queda demostrado |
|---|---|---|
| **I-H1** | `BLOQUEANTE` | Corte, baseline, kill-tests `@itzan` en rojo; **C-04 lado orden publicado el día 1**; lo que necesitás de Justin pedido en el daily. |
| **I-H2** | `BLOQUEANTE` | **Orden como grupo con enlace QR (PA-07):** el médico emite una orden con N estudios y un QR de `/orden/<token>`; el centro lo escanea y ve los estudios exactos; el paciente reserva el **servicio** general y la reserva lleva la orden; la duración por defecto la configura el centro y la ajusta al aceptar. |
| **I-H3** | `BLOQUEANTE` | **Pantalla de órdenes del centro (LI-01):** «Crear instancia de servicio» arriba a la izquierda; filas PACIENTE / ESTUDIO / FECHA / ESTADO / ACCIONES; acciones RECIBIR / RECHAZAR / SUBIR RESULTADOS (modal, N archivos, borrar lo subido) / CONFIRMAR / DESCARGAR; estados INICIADA / RECIBIDA / EN PROCESO / RECHAZADA / CONFIRMADO; tras CONFIRMADO nada cambia (409) y queda auditado; laboratorio **e imagenología**. |
| **I-H4** | `ALTA` | **Servicios ofrecidos (LI-02):** CRUD completo (crear, editar, retirar, reactivar) + upsert masivo CSV/XLSX idempotente, con duración esperada y preparación («ayunas de N horas», proceso 1.5). |
| **I-H5** | `ALTA` | **Perfil del centro (LI-03):** ficha editable con los datos de la unidad (tipo, toma a domicilio, sin turno, acepta órdenes externas, horarios, acreditaciones, documentos legales, gerentes), tras la captura de Pablo. |
| **I-H6** | `MEDIA` | **Cobro con seguro en laboratorio (PA-02 lado proveedor):** coaseguro por estudio (C-02); encuesta al CONFIRMAR (C-06); aviso al médico y al paciente al confirmar (proceso 4.2). |
| **I-H7** | `ALTA` | Móvil `lab_portal` contra las rutas reales (sin `FeatureUnavailable`). |
| **I-H8** | `ALTA` | Kill-tests `@itzan` en verde, regresión, doble revisión, `REPORTE.md`, PRs mergeables. |

> ⚠️ **Orden: I-H1 → I-H3 → I-H2 → I-H4 → I-H7 → I-H5 → I-H6 → I-H8.** I-H3 primero: es la pantalla que el cliente mira y hoy es un decorado.

**Kill-test del lote completo:** entrá como personal del centro a `/administration/laboratory`: si no hay
botón «Crear instancia de servicio» arriba a la izquierda ni columnas PACIENTE / ESTUDIO / FECHA / ESTADO /
ACCIONES, I-H3 no está hecho. Subí dos archivos, confirmá, e intentá borrar uno: si la API lo permite,
**I-H3 está mal hecho**. Como médico emití una orden con tres estudios y abrí el QR como el centro: si no
ves los tres, I-H2 no está hecho. Como paciente reservá: si la reserva no muestra la orden, I-H2 no está
hecho. Abrí la ficha del centro: si sólo tiene razón social, nombre y zona horaria, I-H5 no está hecho.

## 3. Alcance

**IN:** corte y baseline · grupo de orden (`service_request_groups`) + share-links + resolver `/orden` +
QR en PDF/pantalla · `defaultSlotMinutes` por unidad y uso de `expected_duration_minutes` (lo cablea
Justin del lado de cupos; vos exponés la configuración) · vista unificada `GET /diagnostics/orders` y las
cinco acciones · subida de N archivos, borrado antes de confirmar, confirmación con bloqueo en base y API,
descarga del centro · creación manual de instancia (walk-in del centro) · CRUD + upsert de servicios ·
perfil del centro · imagenología dentro de la recepción · aviso al médico y paciente al confirmar ·
coaseguro por estudio (C-02) · encuesta al confirmar (C-06) · móvil `lab_portal` real · tus `test()` ·
simulador · `PLAN.md`, `REPORTE.md`, `evidencia/`.

**OUT:** **cualquier archivo fuera de los reservados** · la reserva del paciente (`appointments`,
`schedule_lab_sample_sheet`) (**Richard**) · `scheduling` (**Justin**) · el escáner (**Ender**) · el
cálculo del coaseguro (**Richard**) · la plantilla de encuesta (**Pablo**) · antiduplicación de estudios
(T-26) · delivery de resultados por correo (ya existe aviso; no se agrega canal) · debilitar un spec ·
declarar `HECHO` sin DoD corrido.

**Ambigüedades registradas** (además de Q-09, Q-17, Q-IMG):

| ID | Ambigüedad | Supuesto tomado | A quién confirmar |
|---|---|---|---|
| Q-I1 | LI-01 «Crear instancia de servicio»: ¿una orden sin médico (paciente que llega con orden en papel o sin orden) o una instancia de un servicio del catálogo? | **Orden creada por el centro** (`origin: 'WALK_IN'`) para un paciente existente o nuevo, con los estudios elegidos del catálogo del centro; queda INICIADA | Pablo |
| Q-I2 | «RECHAZADA»: hoy el rechazo es por muestra; ¿la orden entera se rechaza? | Sí: `reject { reason }` sobre la orden (todas sus muestras/estudios), con motivo obligatorio; el rechazo por muestra sigue existiendo y, si rechaza la última, la orden queda RECHAZADA | Pablo + laboratorio |
| Q-I3 | «EN PROCESO» ¿empieza al registrar accesión, al abrir la orden de trabajo o al subir el primer archivo? | Al **primer** evento de proceso (accesión o primera versión preliminar), el que ocurra antes | Pablo |
| Q-I4 | Enmienda tras CONFIRMADO (hoy la API permite versiones que superan a la FINAL) | Se **bloquea** sobre la misma orden (409) y se ofrece «Nueva orden de enmienda» enlazada (`amends_order_id`) | Pablo + laboratorio |
| Q-I5 | «DESCARGAR RESULTADOS»: ¿cada archivo o un paquete? | Cada archivo **y** «Descargar todo» (zip generado en servidor con nombre sin PHI) | Pablo |
| Q-I6 | Orden como grupo: ¿se cambia `service_requests` a multi-estudio o se agrega una cabecera de grupo? | **Cabecera de grupo** `service_request_groups` + `service_requests.group_id` (nullable); las órdenes viejas siguen sueltas. Misma estrategia que la receta de Ender, PRs separados sobre el `.puml` M08 | Pablo |

## 4. Plan — hitos, subtareas y microtareas

Estados: `TODO`, `EN CURSO`, `HECHO`, `A MEDIAS`, `BLOQUEADO`, `DESCARTADO`.

### H1 — Corte, baseline, kill-tests en rojo y C-04 publicado

**Prioridad:** `BLOQUEANTE`

**CA:** Dado tu entorno, cuando alguien pregunta contra qué versión trabajaste, qué estaba en rojo y qué forma tiene C-04 del lado de la orden y del centro, entonces hay SHA, salidas, kill-tests en rojo y la fila de C-04 en el daily, más lo pedido a Justin.
**DoD:** `evidencia/antes/`; §4-bis del daily.
**Estado:** TODO

#### H1.S1 — Corte y baseline

**CA:** Dado un rojo posterior, cuando alguien pregunta si lo rompiste vos, entonces la respuesta sale de un archivo.
**DoD:** exit codes pegados.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H1.S1.M1 | Corte y rama en los cuatro repos | SHA | `git rev-parse` | TODO |
| H1.S1.M2 | Baseline API (`NODE_OPTIONS=--max-old-space-size=8192`), front, móvil | Exit codes | `evidencia/antes/` | TODO |
| H1.S1.M3 | API real + `seed:e2e` + `seed:diagnostic-units` + centro con personal + paciente con orden | Logins | `evidencia/antes/cuentas.md` | TODO |
| H1.S1.M4 | Medir el decorado: cada ruta de `lab-portal.client.ts` contra la API real → 501, pegado | Tabla | `evidencia/antes/lab-portal-501.txt` | TODO |

#### H1.S2 — Contratos y kill-tests

**CA:** Dado el daily, cuando lo leen Justin y Richard, entonces encuentran C-04 lado orden (`GET /diagnostics/orders`, acciones, share-link, `settings`) con DTOs.
**DoD:** fila en §4-bis; `--grep "@itzan"` en rojo pegado.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H1.S2.M1 | Publicar C-04 lado orden y centro | Fila | daily | TODO |
| H1.S2.M2 | Pedir a Justin: `serviceRequestId`/`durationMinutes` en hold/request, `PATCH bookings/:id/duration`, uso de `expected_duration_minutes` y `defaultSlotMinutes` | Fila | daily | TODO |
| H1.S2.M3 | Correr y clasificar `--grep "@itzan"` | Tabla | `evidencia/antes/kill-tests-itzan.txt` | TODO |

### H2 — La orden como grupo con enlace QR (PA-07, C-04)

**Prioridad:** `BLOQUEANTE`

**CA:** Dado el médico que pide N estudios, cuando confirma, entonces nace un grupo con folio y N `service_requests`; `POST /clinical/service-requests/:groupId/share-links` devuelve `/orden/<token>`; el PDF y la pantalla llevan el QR; `GET /orden/resolve/:token` con sesión del paciente dueño devuelve orden y estudios; con DIAGNOSTIC_STAFF, lo mismo y la orden queda INICIADA en ese centro (`performer_tenant_id`); otro → 403; sin sesión → 401; vencido → 410; `PATCH /diagnostic-units/:id/settings { defaultSlotMinutes }` persiste y Justin lo lee.
**DoD:** `.puml` M08 (bloque órdenes) + M23; int-specs (feliz, 401, 403, 410, token alterado); `test('PA-07 QR de la orden')`, `test('PA-07 el centro ve los estudios exactos')` verdes; OpenAPI regenerado.
**Estado:** TODO

#### H2.S1 — Modelo

**CA:** Dado `service_request_groups`, `service_requests.group_id`, `service_request_share_links`, `diagnostic_units.default_slot_minutes`, cuando se regenera, entonces las órdenes viejas quedan sueltas y nada se pierde.
**DoD:** `gen_ddl.py 08 23`; patch; `orm:audit` 0.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H2.S1.M1 | `service_request_groups` (folio, paciente, encuentro, solicitante, `origin` ORDERED|WALK_IN, `amends_group_id?`, estado derivado cacheado) + `service_requests.group_id` en `diagram_08_clinical.puml` (coordinar con Ender: PRs separados) | Regenera | `gen_ddl.py 08` | TODO |
| H2.S1.M2 | `service_request_share_links` (`token_hash`, `expires_at`, `revoked_at`) | Regenera | `gen_ddl.py 08` | TODO |
| H2.S1.M3 | `diagnostic_units.default_slot_minutes` en `diagram_23_diagnostic_units.puml` | Regenera | `gen_ddl.py 23` | TODO |
| H2.S1.M4 | Patch + entidades + deriva 0 | `orm:audit` | salida | TODO |

#### H2.S2 — API: grupo, enlace, resolución, configuración

**CA:** Dado C-04, cuando se ejercita, entonces responde con la forma publicada.
**DoD:** int-specs; `test:integration clinical diagnostics diagnostic_units` verde.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H2.S2.M1 | `POST /clinical/service-request-groups` (N estudios en una transacción, idempotente) + lectura; `analysis-order-block` deja de hacer `forkJoin` de N | int-spec | `test:integration` | TODO |
| H2.S2.M2 | `POST .../share-links` (HMAC, hash, vencimiento = vigencia de la orden) | int-spec | `test:integration` | TODO |
| H2.S2.M3 | `GET /orden/resolve/:token` en `public` con sesión: dueño/tutor → orden; DIAGNOSTIC_STAFF → orden + `receptionId` y `performer_tenant_id` asignado (INICIADA en ese centro); otro → 403; sin sesión → 401; vencido → 410; alterado → 401 | Cinco tests | `test:integration` | TODO |
| H2.S2.M4 | `PATCH /diagnostic-units/:id/settings { defaultSlotMinutes }` + `GET` | int-spec | `test:integration` | TODO |
| H2.S2.M5 | PDF de la orden con el QR del enlace (reusa `prescription-qr.ts` como utilidad compartida, sin editarlo: lo importás) | spec | `yarn pw` | TODO |
| H2.S2.M6 | Acceso registrado en el log clínico (quién resolvió) | int-spec | `test:integration` | TODO |

#### H2.S3 — Pantallas: QR en la consulta y en «Mis órdenes»; `/orden/:token`

**CA:** Dado la orden emitida, cuando el médico la ve, entonces hay QR grande y «Compartir»; el paciente ve el QR en «Mis órdenes»; `/orden/<token>` resuelve con los cuatro estados.
**DoD:** specs; Playwright con dos sesiones; `clinica-c9-mis-ordenes.spec.ts` actualizado.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H2.S3.M1 | `analysis-order-block`: una llamada de grupo, QR, «Compartir» | spec | spec | TODO |
| H2.S3.M2 | `diagnostic-orders` del paciente: cabecera de grupo con QR y «Reservar hora» que pasa `?orden=` (Richard consume) | spec | spec | TODO |
| H2.S3.M3 | Ruta `/orden/:token` con S1 / 401 (`?next=`) / 403 / 410 / contenido | spec | `test('PA-07 …')` | TODO |
| H2.S3.M4 | Simulador alineado | spec | spec | TODO |

### H3 — La pantalla de órdenes del centro: cinco estados, cinco acciones, inmutable (LI-01)

**Prioridad:** `BLOQUEANTE`

**CA:** Dado personal de un centro (laboratorio o imagenología), cuando abre `/administration/laboratory`, entonces ve «Crear instancia de servicio» arriba a la izquierda y una tabla PACIENTE / ESTUDIO / FECHA / ESTADO / ACCIONES con filtros por estado y fecha; las acciones dependen del estado: INICIADA → RECIBIR / RECHAZAR; RECIBIDA y EN PROCESO → SUBIR RESULTADOS / RECHAZAR; con archivos → CONFIRMAR; CONFIRMADO → DESCARGAR; «Subir resultados» abre un modal que acepta N archivos (imagen, PDF, DICOM), muestra lo subido y permite borrar **sólo** antes de confirmar; CONFIRMAR exige confirmación y después todo lo que toque la orden devuelve 409 `ORDER_CONFIRMED`; cada transición queda en el rastro de auditoría; el paciente y el médico reciben aviso al confirmar.
**DoD:** `GET /diagnostics/orders` derivando los cinco estados con int-specs por transición y por bloqueo; `test('LI-01 tabla y acciones por estado')`, `test('LI-01 subir N y borrar antes de confirmar')`, `test('LI-01 confirmado es inmutable')`, `test('LI-01 crear instancia de servicio')` verdes; capturas; `hito2-laboratory-insurance.spec.ts` reescrito contra la API real.
**Estado:** TODO

#### H3.S1 — API: vista unificada y acciones

**CA:** Dado el mapa de estados de la verificación §LI, cuando se deriva, entonces cada orden tiene exactamente uno de los cinco; las acciones escriben en las tablas existentes con precondición y 409 cuando no corresponde; imagenología entra en la misma vista.
**DoD:** int-specs (una por transición + una por acción prohibida por estado + concurrencia en CONFIRMAR).
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H3.S1.M1 | `diagnostics/application/orders/derive-order-status.ts` (puro) con los cinco estados y tests de tabla (todas las combinaciones de las seis máquinas) | spec | spec | TODO |
| H3.S1.M2 | `GET /diagnostics/orders?status&from&to&q&cursor` (DIAGNOSTIC_STAFF, por `performer_tenant_id`) con filas `{ orderId, groupId, patient, studies[], requestedAt, status, actions[] }` | int-spec | `test:integration` | TODO |
| H3.S1.M3 | `POST /diagnostics/orders/:id/receive` (muestra o, en imagenología, recepción directa) | int-spec | `test:integration` | TODO |
| H3.S1.M4 | `POST /diagnostics/orders/:id/reject { reason }` (Q-I2) | int-spec | `test:integration` | TODO |
| H3.S1.M5 | `POST /diagnostics/orders/:id/results` (N `fileId` ya subidos por `object-storage`; crea o actualiza la versión preliminar) y `DELETE .../results/:fileId` (409 si confirmado) | int-spec | `test:integration` | TODO |
| H3.S1.M6 | `POST /diagnostics/orders/:id/confirm` (libera FINAL, marca grupo CONFIRMADO, precondición en la escritura; dos confirmaciones concurrentes → una 200 y una 409) | int-spec de carrera | `test:integration` | TODO |
| H3.S1.M7 | Bloqueo tras CONFIRMADO en **todo**: versiones nuevas, archivos, muestras, estado → 409 `ORDER_CONFIRMED`; «Nueva orden de enmienda» (Q-I4) | int-spec ×4 | `test:integration` | TODO |
| H3.S1.M8 | `GET /diagnostics/orders/:id/results/download` (archivo o zip, nombre sin PHI, autorizado al centro, al médico solicitante y al paciente) | int-spec + 403 | `test:integration` | TODO |
| H3.S1.M9 | `POST /diagnostics/orders` (Q-I1: instancia creada por el centro, `origin: WALK_IN`) | int-spec | `test:integration` | TODO |
| H3.S1.M10 | Aviso al médico y al paciente al confirmar (adaptador de avisos existente) + disparo de encuesta (C-06, `DIAGNOSTIC_ORDER`) | int-spec | `test:integration` | TODO |
| H3.S1.M11 | Rastro de auditoría por transición (quién, cuándo, desde qué estado) | int-spec | `test:integration` | TODO |

#### H3.S2 — La pantalla

**CA:** Dado el personal, cuando opera, entonces la pantalla cumple el CA del hito, con estados S1–S9, plegado móvil y foco correcto en el modal.
**DoD:** specs; axe; capturas 1440/768/390 claro/oscuro; doble revisión.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H3.S2.M1 | `lab-portal.client.ts` reescrito contra las rutas reales (borrar `simulatorOnly`) | spec | spec | TODO |
| H3.S2.M2 | `laboratory-orders` (reemplaza `summary`/`results`): botón «Crear instancia de servicio» arriba a la izquierda, `app-data-table` con las cinco columnas, filtros arriba | spec + captura | doble revisión | TODO |
| H3.S2.M3 | Acciones por estado (ícono + texto), «Rechazar» con motivo obligatorio | spec | spec | TODO |
| H3.S2.M4 | Modal «Subir resultados» con `file-input` múltiple, cola de subida (reusa `result-upload-queue.ts`), lista de subidos con borrar, deshabilitado tras confirmar | spec | spec | TODO |
| H3.S2.M5 | «Confirmar» con `DialogService.confirm()` que advierte la inmutabilidad; después, sólo «Descargar» y «Nueva orden de enmienda» | spec | `test('LI-01 confirmado es inmutable')` | TODO |
| H3.S2.M6 | «Crear instancia de servicio»: diálogo con paciente (buscar o crear) y estudios del catálogo del centro | spec | `test('LI-01 crear instancia')` | TODO |
| H3.S2.M7 | `lab-reception` y `diagnostics` (cola) enlazan a la orden del grupo; imagenología visible | spec | spec | TODO |
| H3.S2.M8 | Redirecciones de `laboratory-results` y `laboratory` a la pantalla nueva; `navigation.map.ts` del centro | `yarn pw` | salida | TODO |
| H3.S2.M9 | Simulador alineado al contrato real | spec | spec | TODO |

### H4 — Servicios ofrecidos: CRUD + upsert masivo (LI-02)

**Prioridad:** `ALTA`

**CA:** Dado `/administration/laboratory-services`, cuando el centro gestiona su catálogo, entonces puede crear, editar (nombre, código, categoría, precio de lista, `expected_duration_minutes`, preparación «ayunas N horas», componentes del panel), retirar y reactivar; «Importar» acepta CSV/XLSX con vista previa y upsert por `code`; la segunda corrida devuelve 0/0.
**DoD:** `PATCH /diagnostic-study-offerings/:id` y `POST /diagnostic-units/:id/study-offerings/import` con int-specs (feliz, inválido por fila, idempotencia); `test('LI-02 CRUD de servicios')`, `test('LI-02 upsert masivo idempotente')` verdes; `carril-22-*` no se tocan (son de médicos).
**Estado:** TODO

#### H4.S1 — API

**CA:** Dado el catálogo del centro, cuando se edita o importa, entonces las ofertas DRAFT/ACTIVE/RETIRED se respetan y la importación reutiliza el importador común (acordar con Ender: él lo escribe en `pharmacy/application/import/`; si no está a tiempo, vos lo escribís en `diagnostic_units/application/import/` con la **misma** interfaz publicada en el daily y se unifica después).
**DoD:** int-specs.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H4.S1.M1 | `PATCH /diagnostic-study-offerings/:id` (lista blanca: nombre, código, categoría, duración, preparación, componentes) + `POST .../reactivate` | int-spec | `test:integration` | TODO |
| H4.S1.M2 | `preparation_instructions` y `fasting_hours` en `diagnostic_study_offerings` (`.puml` M23; proceso 1.5 del stakeholder) | Regenera | `gen_ddl.py 23` | TODO |
| H4.S1.M3 | `POST /diagnostic-units/:id/study-offerings/import` (vista previa + confirmación + upsert por `code`) | int-spec ×3 | `test:integration` | TODO |

#### H4.S2 — Pantalla

**CA:** Dado el catálogo, cuando se renderiza, entonces es una tarjeta a lo ancho con tabla densa, edición en modal e importación.
**DoD:** specs; capturas; doble revisión.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H4.S2.M1 | `laboratory-services` (reemplaza `laboratory-prices` simulada) con CRUD real | spec | `test('LI-02 CRUD')` | TODO |
| H4.S2.M2 | Importación con el componente compartido (de Ender) o el equivalente publicado | spec | `test('LI-02 upsert')` | TODO |
| H4.S2.M3 | Móvil `lab_services_screen.dart` contra rutas reales | `flutter test` | salida | TODO |

### H5 — El perfil del centro (LI-03)

**Prioridad:** `ALTA`

**CA:** Dado el centro en «Mi cuenta», cuando abre su ficha, entonces ve y edita en una tarjeta con pestañas: Identidad (razón social, nombre comercial, logo, tipo de unidad), Operación (acepta órdenes externas, toma a domicilio, sin turno, horarios, duración por defecto), Legal (los documentos del alta: constitución, NIT, SEPREC, licencia, SEDES, representante), Gerentes, Acreditaciones; lo que la captura de Pablo marque como mal se corrige primero (Q-IMG).
**DoD:** `GET/PATCH /diagnostic-units/me/profile` (o el existente ampliado) con int-specs; `test('LI-03 perfil del centro con operación y legal')` verde; capturas; doble revisión.
**Estado:** TODO

#### H5.S1 — API y pantalla

**CA:** Dado el perfil, cuando se guarda, entonces persiste en `diagnostic_units` y `directory` (sin duplicar la verdad) y la recarga lo muestra.
**DoD:** int-spec; Playwright con recarga.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H5.S1.M1 | Pedir la captura de LI-03 en el daily y registrar qué está mal | Fila | daily | TODO |
| H5.S1.M2 | Lectura y escritura del perfil de la unidad (campos existentes de `diagnostic_units` + horarios) | int-spec | `test:integration` | TODO |
| H5.S1.M3 | `organization-profile` para DIAGNOSTIC_CENTER con las cinco pestañas (reusa lo de farmacia donde aplique) | spec + captura | doble revisión | TODO |
| H5.S1.M4 | Móvil `lab_home_screen.dart` muestra el perfil | `flutter test` | salida | TODO |

### H6 — Cobro con seguro en laboratorio (PA-02 lado proveedor)

**Prioridad:** `MEDIA`

**CA:** Dado un paciente con cobertura, cuando ve el costo de su orden, entonces cada estudio muestra lo cubierto, su parte y el motivo si no (C-02, `context: 'DIAGNOSTIC_ORDER'`).
**DoD:** `test('PA-02 coaseguro por estudio')` verde (doble hasta que Richard publique).
**Estado:** TODO

#### H6.S1 — Consumo de C-02

**CA:** Dado `diagnostics-patient-results.service.ts:108` (ya usa `PatientSettlementService`), cuando llega C-02, entonces la vista previa se usa también **antes** de la adjudicación.
**DoD:** spec + int-spec.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H6.S1.M1 | Vista previa por estudio en «Mis órdenes» del paciente | spec | `test('PA-02 …')` | TODO |
| H6.S1.M2 | Costo por estudio en la pantalla del centro | spec | spec | TODO |

### H7 — Móvil `lab_portal` contra rutas reales

**Prioridad:** `ALTA`

**CA:** Dado `lab_portal_repository.dart`, cuando se reescribe contra `GET /diagnostics/orders` y las acciones, entonces ninguna pantalla cae en `FeatureUnavailable` y el flujo RECIBIR → SUBIR → CONFIRMAR → DESCARGAR funciona con el escáner de Ender.
**DoD:** `flutter analyze` 0; `flutter test test/features/lab_portal` verde; captura en simulador.
**Estado:** TODO

#### H7.S1 — Repositorio y pantallas

**CA:** Dado el contrato real, cuando se consume, entonces los modelos son los de C-04.
**DoD:** tests de modelo y widget.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H7.S1.M1 | Modelos `LabOrder` con los cinco estados y acciones | test | `flutter test` | TODO |
| H7.S1.M2 | `lab_results_screen` → órdenes con acciones; subida múltiple por `object-storage` | test | `flutter test` | TODO |
| H7.S1.M3 | Quitar la llamada a `GET /clinical/diagnostic-orders/:id/results` inexistente (`health_repository.dart:484`) y usar la descarga real | test | `flutter test` | TODO |

### H8 — Verde, regresión y cierre

**Prioridad:** `ALTA`

**CA:** Dado el lote, cuando se corre `--grep "@itzan"` contra la API real, entonces todo pasa; regresión y gates en verde; doble revisión; PRs mergeables.
**DoD:** `evidencia/despues/`; `evidencia/doble-revision.md`; `gh`; `REPORTE.md`.
**Estado:** TODO

#### H8.S1 — Cierre

**CA:** Dado el `REPORTE.md`, cuando lo lee alguien que no vio la sesión, entonces sabe qué anda, qué no y qué falta exactamente.
**DoD:** `report_gate.py --self-test` PASS.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H8.S1.M1 | Kill-tests `@itzan` en verde | 0 fallos | `yarn pw --grep "@itzan"` | TODO |
| H8.S1.M2 | `test:integration clinical diagnostics diagnostic_units object_storage` + regresión front y móvil | Exit 0 | salidas | TODO |
| H8.S1.M3 | Gates, axe, doble revisión | archivo | evidencia | TODO |
| H8.S1.M4 | OpenAPI regenerado; PRs `MERGEABLE` con `gh` | salidas | evidencia | TODO |
| H8.S1.M5 | `REPORTE.md` en cada repo | avance calculado | `report_gate.py` | TODO |

## 5. Definition of Done del lote

1. Los `test()` `@itzan` pasan **contra la API real**.
2. Deriva modelo ↔ base ↔ ORM en 0; las órdenes viejas siguen leyéndose.
3. Inmutabilidad tras CONFIRMADO probada en API (409 en versiones, archivos, muestras, estado) y en carrera.
4. El enlace de la orden: token firmado, vencimiento, 401/403/410, nada clínico en la URL, acceso registrado.
5. Importación de servicios: segunda corrida 0/0.
6. `lint`, `typecheck`, `test`, `test:integration` (módulos tocados) de la API; `lint`/`typecheck`/`test`/`gates:diseno` del front; `flutter analyze`/`flutter test`; ninguna ruta `simulatorOnly` queda en `lab-portal.client.ts`.
7. Capturas con dos pasadas; PRs `MERGEABLE`; `REPORTE.md` con avance calculado y «No cubierto».
