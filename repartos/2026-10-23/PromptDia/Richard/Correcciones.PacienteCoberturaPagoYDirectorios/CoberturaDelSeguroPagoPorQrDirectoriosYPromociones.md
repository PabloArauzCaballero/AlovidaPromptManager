# La parte del paciente según el seguro, el pago por QR con comprobante, los directorios sin mapa y las promociones como marketplace

> **Rol:** dueño del cálculo de cobertura del paciente, de la pantalla de pago del paciente, de la geolocalización, de los directorios y del marketplace de promociones · **Carril:** 1 · Paciente (con Leo) · **Fecha:** 2026-10-23 · **Turno:** día
> **Fuente del pedido:** [`CORRECCIONES-FULLSTACK-2026-10-23.md`](../../../../../docs/requisitos/CORRECCIONES-FULLSTACK-2026-10-23.md) — **PA-02, PA-04 (paciente), PA-09.b, PA-10, PA-11**, y el lado paciente de **PA-07** y **MD-10**
> **Verificación contra el código:** [`VERIFICACION-CONTRA-CODIGO-2026-10-23.md`](../../../../../docs/verificacion/VERIFICACION-CONTRA-CODIGO-2026-10-23.md) — §PA-02, §PA-04/MD-06, §PA-09, §PA-10, §PA-11
> **Plan completo:** [`planes/06-correcciones-fullstack-2026-10-23/README.md`](../../../../../planes/06-correcciones-fullstack-2026-10-23/README.md) — **producís C-02, C-08 y C-09; consumís C-01 (Pablo), C-04 (Itzan + Justin)**
> **9 hitos · 16 subtareas · 68 microtareas**, todas con criterio de aceptación y Definition of Done.
>
> **Lo primero que tenés que saber:** hoy **nada** calcula lo que paga el paciente. `coverage_percent`
> se guarda y se muestra, pero el cargo de la consulta es el precio completo y el checkout de farmacia usa
> un 20 % fijo de una fixture. Tu primer hito de valor es un **servicio de cálculo** (C-02) que Pablo,
> Ender e Itzan consumen; publicalo el día 1 aunque devuelva el caso simple. Y el pago del paciente **no
> existe en ninguna capa**: vos hacés la pantalla contra C-01, que Pablo publica el día 1.

## 0. Ficha de asignación

| Campo | Valor |
|---|---|
| `REPOS` | `mdavila-2001/mantra-core-health-api` (módulos `insurance`, `geo`, `promotions`, `community/controllers/community-public.controller.ts`) · `mdavila-2001/mantra-core-health` · `mantra-core-technologies/mantra-core-health-model` (`.puml` M13, M26, M51) · `mdavila-2001/mantra_core_health_mobile` |
| `TARGET_REF` | `origin/dev` del front (`227eb255`), de la API (`6ea11561`) y del modelo (`eceb98f`); `origin/main` del móvil (`ec88e81`). **Reconsultá y fijá el tuyo** |
| `RAMAS` | `richard/paciente-cobertura-pago-directorios-2026-10-23` en cada repo. Un PR por hito cerrado. El PR del modelo va **antes** que el de la API que lo usa |
| `ARCHIVOS RESERVADOS PARA VOS` | API: `src/modules/insurance/**` (C-02) · `src/modules/geo/**` (C-08) · `src/modules/promotions/**` (C-09) · `src/modules/community/controllers/community-public.controller.ts` + `community/dto/public-search.dto.ts` (filtros y orden). Front: `features/billing/patient-payment/**` (nuevo) · `features/account/my-requests/**` · `features/account/coverage/**` (nuevo) · `features/directory/**` (salvo `practitioner-availability` y `practitioner-service-schedule`, de Justin) · `features/directories-overview/**` · `features/public-directories/**` · `features/laboratory-directory/**` · `features/account/promotions/**` (el marketplace; Leo deja el `slot` en el carrito) · `features/campaigns/**` · `shared/components/organisms/department-map/**` (retiro) · `shared/components/organisms/directory-page/**` · `core/geo/**` (nuevo) · `features/account/appointments/**` · `features/account/diagnostic-orders/**` (la reserva) · `core/data-access/{insurance,promotions,geo,patient-payment}/**` · `core/mock/handlers/{insurance,promotions,geo,patient-payment}.handlers.ts` · tus `test()` en `playwright/correcciones-2026-10-23-kill-tests.spec.ts`. Modelo: `diagram_13_geo.puml`, `diagram_26_insurance.puml`, `diagram_51_promotions.puml` y lo que `gen_ddl.py` regenere de ellos. Móvil: `features/insurance/**`, `features/directory/**`, `features/loyalty/**`, `features/appointments/**`, `features/billing/**` (pago del paciente) |
| `ARCHIVOS DE OTROS — NO LOS TOQUES` | `billing/**`, `iam/**`, `consent/**`, `surveys/**`, `@Roles` existentes, `concepts.ts` (**Pablo**) · `scheduling/**`, `features/agenda/**`, `practitioner-availability/**` (**Justin**) · `clinical/**`, `pharmacy/**`, `features/pharmacy/**`, `where-to-buy/**` (**Ender**) · `diagnostics/**`, `features/laboratory/**` (**Itzan**) · `shell-layout`, `settings`, `spending`, `cart`, `identity-*`, `access-requests`, `questionnaires` (**Leo**) · `app.routes.ts` y `navigation.map.ts`: **sólo** tus rutas y filas, con comentario `// Richard · plan 06` |
| `⚠️ RIESGO ALTO DE TU CARRIL` | **Dinero.** Todo monto nuevo en enteros de la menor unidad (`amountMinor`) y moneda explícita; prohibido `float`; el redondeo del % se define una vez (`accounting-double-entry`). Segundo: **el comprobante que sube el paciente es un archivo de una persona**: va por `/common/files/upload` con categoría PHI, nunca en la URL, nunca en logs. Tercero: **el QR bancario es por sede y lo comparten los médicos de la sede** (`practice_sites.bank_qr_file_id`): mostrás el de la sede **del cargo**; si el cargo no sabe de qué sede es (hoy no lo sabe), eso es parte de C-01 y lo pedís a Pablo |
| `CONTRA QUÉ SE PRUEBA` | **API real** + `corepack yarn start:real-api`. El simulador después, `VERIFIED_FUNCTIONAL_ONLY` |
| `CUENTAS DE PRUEBA` | `yarn seed:e2e` de la API; necesitás un paciente **con cobertura** (plan con `coverage_percent = 80`) y uno **sin**: si el seed no los trae, los creás por API en tu Ola 0 y lo documentás (sintéticos) |
| `DÓNDE SE PRUEBA` | `/my-account/coverage` (nuevo), `/my-account/requests`, `/my-account/pay/:chargeId` (nuevo), `/directory`, `/directories`, `/laboratory-directory`, `/clinics-directory`, `/pharmacies-directory`, `/insurers-directory`, `/my-account/pharmacy/cart?pestana=promociones`, `/my-account/appointments`, `/my-account/diagnostic-orders` |
| `LÍMITE DE RECURSOS` | Regla 70: un `ng serve`, un build, un navegador, Playwright `--workers=1` |

## 1. Antes de escribir una línea — instalación OBLIGATORIA del estándar

> **Esta sección no es opcional y no es el final del día: es lo primero.** Si no podés completar este
> paso, estás `BLOQUEADO`: avisalo y no sigas.

### 1.1 Instalar el estándar en tu checkout

```bash
git clone https://github.com/PabloArauzCaballero/AlovidaPromptManager.git ../AlovidaPromptManager
cp -r ../AlovidaPromptManager/.claude   ./
cp    ../AlovidaPromptManager/AGENTS.md ./
cp -r ../AlovidaPromptManager/.agents   ./   # solo si tu herramienta no lee .claude/
ls .claude/skills | wc -l
ls .claude/rules/[0-9]*.md | wc -l
python .claude/hooks/plan_gate.py --self-test
```

⚠️ El front y la API **ya tienen** su `.claude/`: fusioná, no pises. Sus `CLAUDE.md` / `AGENTS.md` mandan.

### 1.2 Qué te instala eso

| Candado | Qué impide |
|---|---|
| `plan_gate.py` | Escribir código sin `PLAN.md` en disco |
| `report_gate.py` | Cerrar sin `REPORTE.md` o sin sus tres secciones |
| `blocker_gate.py` | Cerrar con `BLOQUEADO` o `EN CURSO` sin la simulación de tres niveles (regla 65) |

### 1.3 Skills que tenés que CARGAR para este lote

**Del proceso:** `skills-router` · `factual-discovery` · `milestone-planning` · `anti-hallucination-guard` ·
`evidence-and-verification` · `scope-discipline` · `rationalization-guard` · `context-thrift` ·
`progress-reporting` · `finish-your-turn` · `work-report-md`.

**De tu lote:**

| Skill | Para qué |
|---|---|
| `insurance-workflows` | **la más importante**: cobertura, copago, deducible, pre-autorización, aprobación parcial por ítem |
| `accounting-double-entry` | dinero en enteros, redondeo declarado, nunca `float` |
| `model-driven-schema` + `data-modeling-plantuml` | `.puml` → `SQL/` → base → ORM para `promotions.partner_type` y lo que C-02 necesite |
| `api-testing` + `authz-access-control` | matriz negativa: otro paciente no ve mi cobertura ni mi comprobante |
| `maps-geolocation` | geocodificación inversa sin servicio externo, permisos, fallback al perfil |
| `search-and-filtering` | filtros y orden determinista del directorio por lista blanca |
| `frontend-design-system` + `visual-hierarchy-composition` + `frontend-beautiful-ui` | el directorio y el marketplace dentro de ALOVIDA v1.0 y los 188 tokens |
| `frontend-data-tables` + `frontend-ux-states` | la tabla de solicitudes de aprobación y la de cobertura |
| `file-uploads-media` + `data-privacy-phi` | el comprobante del paciente |
| `e2e-playwright` + `visual-proof` + `critical-double-review` | tus `test()` y las dos pasadas |
| `flutter-development` · `alovida-app-movil-ux` | pago, cobertura y directorio en la app |

Entrá siempre por `skills-router`.

### 1.4 DoD de esta sección

- [ ] Salidas de instalación pegadas en tu daily.
- [ ] Leíste las skills de las dos tablas, empezando por `insurance-workflows`.
- [ ] `PLAN.md` en cada repo (`docs/trabajo/2026-10-23-paciente-cobertura-pago-directorios/PLAN.md`) **antes** del primer `Edit`/`Write` de código.

> ### ✅ Hechos ya verificados contra el corte
>
> - Nadie calcula la parte del paciente: `billing-simulated.service.ts:502-521` cobra el precio de catálogo; `coverage_percent` sólo se muestra (`insurance-read.service.ts:524`, `declared-coverages-reader.ts:170,233`). El checkout de farmacia usa `checkout.fixtures.ts:35` (20 % fijo).
> - La pre-autorización existe sólo en la API (`prior-auth.controller.ts:61-110`), la pide el prestador (`prior-auth.service.ts:90-98`), no tiene `encounter_id`, y **ningún** cliente la llama.
> - `/my-account/requests` (`my-requests.ts`) lista `GET /insurance/my-claims`: reclamos del prestador, no solicitudes del paciente.
> - El QR por sede: `practice_sites.bank_qr_file_id`; `GET /practitioners/:profileId/sites` admite PATIENT y devuelve `bankQrFileId` (`practitioner-sites.service.ts:573`). Ninguna pantalla del paciente lo muestra.
> - Mapa de Bolivia: `department-map` en `laboratory-directory.html:79`, `clinics-directory.html:36`, `pharmacies-directory.html:36`, `insurers-directory.html:36`, `promotions.html:25`. Ocho pantallas llaman `navigator.geolocation` cada una por su cuenta; **no hay** geocodificación inversa en ninguna capa; `public/nearby` sólo da distancia.
> - Directorio de médicos: único filtro especialidad (`practitioners-directory.ts:232`); `public/search/practitioners` acepta `department`, `municipality` pero no precio ni calificación ni orden; el DTO de resultado ya trae `ratingAverage`, `priceFrom`, `nextAvailableDate`.
> - Promociones: `promotions.entity.ts` sin `partner_type`, imagen ni sede; `listMine` por tenant de la sesión (`promotions-read.service.ts:56-90`); autoría de farmacia demo en memoria (`pharmacy-campaigns.client.ts:60-82`).
> - El paciente **no puede reprogramar en web** (AG-10; móvil sí, `reschedule_appointment_sheet.dart`); la reserva de laboratorio no lleva la orden (`appointments.ts:162-174`).

## 2. Resultado observable

| Hito | Prioridad | Qué queda demostrado |
|---|---|---|
| **R-H1** | `BLOQUEANTE` | Corte, baseline y tus kill-tests `@carril-1 @richard` en rojo, pegados; **C-02 publicado el día 1** con su DTO. |
| **R-H2** | `BLOQUEANTE` | `PatientSharePort` y `GET /insurance/me/coverage-preview`: plan al 80 % sobre 100 Bs → paciente 20 Bs; cubierto por contrato sin pedir nada; fuera de contrato → el paciente puede pedir la orden de aprobación; la **tabla** de sus solicitudes con estado y motivo. |
| **R-H3** | `BLOQUEANTE` | `/my-account/pay/:chargeId`: ve el monto, su parte, el QR de la sede, sube el comprobante o marca «Pagué en efectivo»; la sesión queda «pendiente de pago»; cuando el médico acepta ve «Pagado»; si rechaza ve el motivo y puede volver a subir. |
| **R-H4** | `ALTA` | Ningún directorio del paciente tiene el mapa de Bolivia; al entrar, la ubicación se detecta y el listado viene prefiltrado por departamento y municipio, editables; sin permiso de GPS, por el municipio del perfil. |
| **R-H5** | `ALTA` | Directorios rediseñados al patrón marketplace (filtros arriba, orden por relevancia / precio / distancia / calificación, tarjetas con imagen, ficha con pestañas), serios e institucionales, dentro de los tokens. |
| **R-H6** | `MEDIA` | Promociones como marketplace por tipo de partner, dentro de la pestaña del carrito, leyendo de la API (no de la demo). |
| **R-H7** | `ALTA` | Desde una orden de laboratorio el paciente reserva el servicio y la reserva lleva la orden (C-04). |
| **R-H8** | `ALTA` | El paciente **mueve** su cita desde el portal web y recibe el mensaje interno. |
| **R-H9** | `ALTA` | Kill-tests `@richard` en verde contra la API real, regresión, doble revisión, `REPORTE.md`, PRs mergeables. |

> ⚠️ **Orden: R-H1 → R-H2 → R-H3 → R-H4 → R-H5 → R-H7 → R-H8 → R-H6 → R-H9.** Si hay que recortar, R-H2 y R-H3 valen más que R-H6.

**Kill-test del lote completo:** entrá como el paciente con plan al 80 % y abrí el pago de una consulta de
100 Bs: si no dice «Tu parte: 20 Bs», R-H2 no está hecho. Si no hay QR ni botón «Pagué en efectivo», R-H3
no está hecho. Subí un comprobante y entrá como el médico (lo de Pablo): si el paciente no ve «pendiente de
revisión» y después «pagado», R-H3 no está hecho. Abrí `/clinics-directory`: si hay un mapa de Bolivia, R-H4
no está hecho; si el listado no viene filtrado por tu municipio, tampoco. Abrí `/directory` como un
paciente nuevo: si lo único que podés filtrar es la especialidad, R-H5 no está hecho.

## 3. Alcance

**IN:** corte y baseline · `PatientSharePort` + endpoints de vista previa y solicitud de aprobación del
paciente (API, `.puml` si hace falta) · pantalla de cobertura y tabla de solicitudes · pantalla de pago
del paciente (QR, comprobante, efectivo, estados) contra C-01 · geocodificación inversa (API) + servicio
de ubicación del front · retiro del mapa de los directorios y prefiltro · rediseño de los cinco
directorios con `DirectoryPage` · filtros y orden en `public/search/*` · promociones con tipo de partner e
imagen, listado público, marketplace en el carrito · reserva de laboratorio con `serviceRequestId` ·
reprogramación del paciente en web · móvil: pago, cobertura, directorio sin mapa · tus `test()` ·
simulador · capturas · `PLAN.md`, `REPORTE.md`, `evidencia/`.

**OUT:** **cualquier archivo fuera de los reservados** · la API de comprobantes y el cierre de la consulta
(**Pablo**, C-01: construís contra el contrato con doble declarado) · el motor de reglas de pólizas,
carencias y preexistencias (T-22: decisión D-1; vos aplicás «cubierto por contrato» y transportás la
decisión del seguro) · la pasarela y el QR con monto embebido (T-28/T-29) · la cabecera, el carrito y la
pestaña (**Leo** deja el `slot`) · la disponibilidad de cupos y los bloqueos (**Justin**) · «dónde comprar
la receta» (**Ender**) · debilitar un spec · declarar `HECHO` sin DoD corrido.

**Ambigüedades registradas** (además de Q-03, Q-11, Q-12 del archivo de requisitos y D-1, D-2 del plan):

| ID | Ambigüedad | Supuesto tomado | A quién confirmar |
|---|---|---|---|
| Q-R1 | Redondeo de la parte del paciente cuando el % no da entero (p. ej. 80 % de 33 Bs = 26,40) | Se redondea **al centavo** (menor unidad), hacia arriba la parte del paciente sólo si así lo dice el plan; por defecto `ROUND_HALF_EVEN`, declarado en `PatientShare` | Pablo + aseguradora |
| Q-R2 | PA-04 «lee el QR subido para cada consultorio»: ¿el paciente lo escanea con otra app bancaria desde la pantalla (imagen grande) o la app lo abre? | **Imagen grande + «Descargar QR» + «Copiar monto»**; el pago lo hace la app del banco. Ningún deep link bancario (no hay estándar común) | Pablo |
| Q-R3 | «Zona» en PA-09.b | Texto libre opcional de filtro hasta que exista catálogo con procedencia (Q-11) | Pablo |
| Q-R4 | Polígonos municipales para la geocodificación inversa: ¿hay dataset con licencia? | Hasta tenerlo, **municipio más cercano por centroide** del `BoMunicipalitiesCatalog`, declarado en el reporte y en la respuesta (`method: 'NEAREST_CENTROID'`) | Pablo |
| Q-R5 | PA-11 «marketplace de amazon»: ¿incluye precios en las tarjetas de médicos? El único arancel es el del Colegio Médico en UMA | Se muestra `priceFrom` **sólo** si el prestador lo publicó; si no, «precio no publicado». Nunca un número inventado (regla 97.4.1) | Pablo |

## 4. Plan — hitos, subtareas y microtareas

Estados: `TODO`, `EN CURSO`, `HECHO`, `A MEDIAS`, `BLOQUEADO`, `DESCARTADO`.

### H1 — Corte, baseline, kill-tests en rojo y C-02 publicado

**Prioridad:** `BLOQUEANTE`

**CA:** Dado tu entorno, cuando alguien pregunta contra qué versión trabajaste, qué estaba en rojo y qué forma tiene el contrato que los demás consumen, entonces hay SHA, salidas, tus kill-tests en rojo y el DTO de C-02 publicado en el daily.
**DoD:** `evidencia/antes/`; fila de C-02 en §4-bis del daily con el DTO real.
**Estado:** TODO

#### H1.S1 — Corte y baseline

**CA:** Dado un rojo posterior, cuando alguien pregunta si lo rompiste vos, entonces la respuesta sale de un archivo.
**DoD:** `lint`, `typecheck`, `test` del front y de la API con exit code.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H1.S1.M1 | Corte y rama en los cuatro repos | SHA en `PLAN.md` | `git rev-parse origin/dev` ×3, `origin/main` ×1 | TODO |
| H1.S1.M2 | Baseline front | Exit codes | `corepack yarn lint; typecheck; test --watch=false` → `evidencia/antes/` | TODO |
| H1.S1.M3 | Baseline API (necesita `NODE_OPTIONS=--max-old-space-size=8192` para `typecheck`) | Exit codes | `corepack yarn lint; typecheck; test` → `evidencia/antes/` | TODO |
| H1.S1.M4 | API real levantada + `seed:e2e` + paciente con plan al 80 % y paciente sin cobertura | Login de los dos | script en `evidencia/antes/cuentas.md` (sin contraseñas) | TODO |

#### H1.S2 — Kill-tests y contrato

**CA:** Dado el front contra la API real, cuando corrés `--grep "@richard"`, entonces cada prueba falla por el motivo de la verificación.
**DoD:** salida en `evidencia/antes/kill-tests-richard.txt`; DTO de C-02 en el daily.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H1.S2.M1 | Correr y clasificar tus kill-tests | Tabla en `PLAN.md` | `corepack yarn pw … --grep "@richard" --reporter=list` | TODO |
| H1.S2.M2 | Publicar C-02 (`PatientShareInput/Result`, rutas, códigos) en §4-bis del daily | Fila con el DTO literal | daily | TODO |
| H1.S2.M3 | Publicar C-08 y C-09 | Filas | daily | TODO |

### H2 — La parte del paciente según el seguro (PA-02, C-02)

**Prioridad:** `BLOQUEANTE`

**CA:** Dado un paciente con plan que cubre la consulta al 80 % sin autorización previa, cuando pide la vista previa de una consulta de 100 Bs, entonces recibe `patientAmountMinor = 2000`, `insurerAmountMinor = 8000`, `approval.status = 'COVERED_BY_CONTRACT'`; dado un servicio que exige autorización, recibe `NEEDS_APPROVAL` y puede crear la solicitud; dado un paciente sin cobertura, `NO_COVERAGE` y paga todo; dado otro paciente, 404.
**DoD:** tests de API (unitario del cálculo con los tres niveles + integración con base real + matriz negativa) en verde; `test('PA-02 …')` ×3 en verde; `openapi.json` regenerado.
**Estado:** TODO

#### H2.S1 — El puerto y el cálculo

**CA:** Dado `insurance_plan_benefits` del plan vigente del paciente para el concepto, cuando se calcula, entonces se aplica `coverage_percent`, se suma `copay_amount` fijo si existe, se respeta `annual_limit_amount` (lo que exceda lo paga el paciente) y el redondeo es el declarado (Q-R1).
**DoD:** `yarn test src/modules/insurance/application/services/patient-share*` con casos: 80/100, 80/33, con copago fijo, con tope anual superado, sin plan, concepto no cubierto.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H2.S1.M1 | `insurance/application/ports/patient-share.port.ts` + `patient-share.service.ts` (puro, sin HTTP) | Firma = C-02 | spec unitario | TODO |
| H2.S1.M2 | Lectura del plan vigente del paciente y del beneficio por `serviceConceptId` (reutiliza `declared-coverages-reader.ts`) | Caso real de la base | int-spec | TODO |
| H2.S1.M3 | Tope anual: acumulador por período leído de las adjudicaciones publicadas (T-14 parcial: sólo lectura, sin tabla nueva; si no alcanza, `A MEDIAS` declarado) | Caso con tope superado | spec | TODO |
| H2.S1.M4 | Exportar el puerto como provider público del `InsuranceModule` para que `billing` (Pablo) lo inyecte | `InsuranceModule` lo exporta | `app.module.wiring.spec.ts` | TODO |

#### H2.S2 — Endpoints del paciente

**CA:** Dado el paciente autenticado, cuando llama `GET /insurance/me/coverage-preview?serviceConceptId&amountMinor&context`, entonces recibe el resultado; `POST /insurance/me/prior-authorization-requests` crea la solicitud con `patientProfileId` del token y `encounterId`/`serviceRequestId`/`medicationRequestId`; `GET /insurance/me/prior-authorization-requests` lista las suyas con estado, monto aprobado, motivo y cláusula.
**DoD:** int-spec con los tres endpoints + matriz negativa (otro paciente, médico, sin token); OpenAPI regenerado.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H2.S2.M1 | Controller `insurance-me.controller.ts` con los tres endpoints y DTOs con lista blanca | `forbidNonWhitelisted` no rechaza nada del front | int-spec | TODO |
| H2.S2.M2 | `prior_authorization_requests.encounter_id` (FK nullable) en `.puml` M26 → `gen_ddl.py` → patch → ORM | `rebuild` o patch aplicado; deriva 0 | `python salud-db/gen_ddl.py 26` + `yarn orm:audit` | TODO |
| H2.S2.M3 | Pedir a Pablo por el daily: rol PATIENT en `prior-auth.controller.ts:95` **o** la ruta nueva propia (vos hacés la ruta propia bajo `insurance/me`, que no toca `@Roles` existentes) | Decisión registrada | daily | TODO |
| H2.S2.M4 | Matriz negativa: otro paciente → 404; médico → 403; sin token → 401 | Tres tests | int-spec | TODO |

#### H2.S3 — Pantallas: cobertura y tabla de solicitudes

**CA:** Dado `/my-account/coverage`, cuando el paciente entra, entonces ve su plan, el %, copago y deducible, y una **tabla** «Mis solicitudes de aprobación» con servicio, prestador, monto, % cubierto, mi parte, estado y motivo; desde un servicio `NEEDS_APPROVAL` puede «Pedir aprobación» y la fila aparece.
**DoD:** `test('PA-02 tabla de solicitudes')` verde; capturas; `my-requests.spec.ts` actualizado.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H2.S3.M1 | `core/data-access/insurance/insurance.client.ts`: `vistaPrevia()`, `pedirAprobacion()`, `misSolicitudes()` | spec con `HttpTestingController` | spec | TODO |
| H2.S3.M2 | Componente `coverage` (tarjeta a lo ancho, pestañas «Mi cobertura» / «Solicitudes») con `app-data-table` | Columnas de arriba | captura | TODO |
| H2.S3.M3 | Botón «Pedir aprobación» con diálogo de confirmación y S3/S5 | Fila nueva tras confirmar | Playwright | TODO |
| H2.S3.M4 | Reemplazar el 20 % fijo de `checkout.fixtures.ts` por la vista previa con `context: 'PHARMACY_ORDER'` (coordinar con Ender: el archivo es de él; vos le entregás el cliente y él lo cablea) | Fila en el daily | daily | TODO |
| H2.S3.M5 | Móvil: `CoverageBreakdownCard` lee la vista previa real; «Pagar copago» navega al pago (R-H3) | `flutter test` | salida | TODO |

### H3 — El pago del paciente: QR, comprobante, efectivo (PA-04, contra C-01)

**Prioridad:** `BLOQUEANTE`

**CA:** Dado un cargo pendiente, cuando el paciente abre `/my-account/pay/:chargeId`, entonces ve el monto total, su parte (R-H2), el QR bancario de la sede del cargo (imagen grande, descargar, copiar monto), «Subir comprobante» (imagen o PDF) y «Pagué en efectivo»; al enviar, el cargo queda «Pendiente de revisión»; cuando el médico acepta, ve «Pagado» con fecha; si rechaza, ve el motivo y puede volver a subir; otro paciente obtiene 404.
**DoD:** `test('PA-04 …')` ×3 en verde contra la API real con C-01 publicado (hasta entonces, doble del simulador con los tres niveles y `A MEDIAS`); capturas 1440/768/390 claro/oscuro.
**Estado:** TODO

#### H3.S1 — Cliente, doble y entrada al pago

**CA:** Dado C-01, cuando Pablo publica el DTO, entonces el cliente compila sin cambios de forma; el simulador responde correcto (201), límite (segundo comprobante → 409 `PROOF_ALREADY_PENDING`) e inválido (QR sin archivo → 422 `FILE_REQUIRED`).
**DoD:** spec del cliente y del handler.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H3.S1.M1 | `core/data-access/patient-payment/patient-payment.client.ts`: `contexto(chargeId)`, `subirComprobante()`, `pagueEnEfectivo()`, `estado()` | Tipos = C-01 | spec | TODO |
| H3.S1.M2 | `patient-payment.handlers.ts` del simulador con los tres niveles | 409 y 422 | spec | TODO |
| H3.S1.M3 | Entradas al pago: desde la cita (`appointments`, «Pagar») y desde la consulta cerrada; `app.routes.ts` `my-account/pay/:chargeId` | Botón visible con cargo pendiente | spec | TODO |

#### H3.S2 — La pantalla

**CA:** Dado el contexto del cargo, cuando se renderiza, entonces la tarjeta a lo ancho tiene el resumen (total, cubierto, tu parte), el QR de la sede con `alt` y descarga, el `file-input` del comprobante (`image/*,application/pdf`, ≤ 10 MB, categoría PHI) y el botón de efectivo con confirmación; sin QR cargado por el médico, lo dice y sólo ofrece efectivo (S3).
**DoD:** spec del componente con los estados; axe sin violaciones; Playwright.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H3.S2.M1 | Componente `patient-payment` con resumen de montos (usa la vista previa de R-H2) | 100 / 80 / 20 visibles | spec | TODO |
| H3.S2.M2 | Bloque del QR: imagen desde `bankQrFileId` por el endpoint de archivos, «Descargar», «Copiar monto» | Sin `bankQrFileId` → S3 con texto | spec | TODO |
| H3.S2.M3 | Subida del comprobante por `/common/files/upload` (PHI) + `POST payment-proofs`; doble envío bloqueado | Botón deshabilitado durante el envío | spec | TODO |
| H3.S2.M4 | «Pagué en efectivo» con `DialogService.confirm()` | Confirmación obligatoria | spec | TODO |
| H3.S2.M5 | Estados: pendiente de revisión (S7 con «hace N»), pagado, rechazado con motivo y «Volver a subir» | `data-testid` por estado | spec + Playwright | TODO |
| H3.S2.M6 | Móvil: `PatientPaymentScreen` con el mismo flujo (cámara o galería para el comprobante) | `flutter test` | salida | TODO |

### H4 — Directorios sin mapa y con la ubicación detectada (PA-09.b, C-08)

**Prioridad:** `ALTA`

**CA:** Dado el paciente que entra a cualquier directorio, cuando el navegador da la posición, entonces el listado viene filtrado por su departamento y municipio (chips editables) y no hay mapa de Bolivia; cuando no la da, se usa el municipio del perfil; cuando no hay ninguno, se muestra todo con los chips vacíos.
**DoD:** `GET /geo/reverse` con tests (punto dentro de un municipio conocido, punto en frontera, punto fuera de Bolivia → 422); `test('PA-09.b directorio sin mapa y prefiltrado')` verde; `datos-bolivia-en-pantalla.spec.ts` y `patient-gps-nearby-places.mjs` actualizados.
**Estado:** TODO

#### H4.S1 — Geocodificación inversa (API)

**CA:** Dado `lat,lng`, cuando se consulta, entonces devuelve `departmentConceptId`, `municipalityConceptId`, `label`, `method`; fuera de Bolivia → 422 `OUTSIDE_COVERAGE`.
**DoD:** unit + int-spec; respuesta ≤ 50 ms con los 339 municipios en memoria.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H4.S1.M1 | `geo/application/use-cases/reverse-geocode.use-case.ts` por centroide más cercano (Q-R4) con `method: 'NEAREST_CENTROID'` | Tres niveles | spec | TODO |
| H4.S1.M2 | `GET /geo/reverse` público con rate limit (misma política que `public/nearby`) | 60/min | int-spec | TODO |
| H4.S1.M3 | Puerto para polígonos (`MunicipalityBoundaryPort`) con adaptador «sin datos» y nota de procedencia para cuando llegue el dataset | Puerto declarado, no implementado | archivo + reporte | TODO |

#### H4.S2 — Servicio de ubicación del front y retiro del mapa

**CA:** Dado `core/geo/current-location.service.ts`, cuando una pantalla pide la ubicación, entonces obtiene `{ departmentConceptId, municipalityConceptId, source: 'GPS' | 'PROFILE' | 'NONE' }` con caché por sesión y sin pedir permiso dos veces.
**DoD:** spec del servicio (permiso concedido, denegado, sin API de geolocalización, SSR); los cinco directorios sin `app-department-map`.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H4.S2.M1 | Servicio compartido con `afterNextRender` (SSR) y fallback a `residenceMunicipalityConceptId` | Cuatro casos en spec | spec | TODO |
| H4.S2.M2 | `territorial-filter.ts` toma el valor inicial del servicio si la URL no trae `departamento`/`ciudad` | URL vacía → chips llenos | spec | TODO |
| H4.S2.M3 | Quitar `<app-department-map>` de `laboratory-directory.html:79`, `clinics-directory.html:36`, `pharmacies-directory.html:36`, `insurers-directory.html:36` (el de `promotions.html` lo quita Leo) | `grep -rn department-map src/app/features` = 0 salvo registro | grep | TODO |
| H4.S2.M4 | Marcar `department-map` como obsoleto en `shared/` (se borra en otra oleada si nadie más lo usa: el registro lo usa) | Nota en el componente | archivo | TODO |
| H4.S2.M5 | Chip «Zona» de texto libre (Q-R3) | Filtra por `q` | spec | TODO |
| H4.S2.M6 | Actualizar `datos-bolivia-en-pantalla.spec.ts` y reescribir `patient-gps-nearby-places.mjs` (hoy abre una ruta que redirige) | Verdes | `yarn pw` | TODO |
| H4.S2.M7 | Móvil: `directories_screen.dart` y `nearby_screen.dart` prefiltran por `GET /geo/reverse` | `flutter test` | salida | TODO |

### H5 — Rediseño de Directorios al patrón marketplace (PA-11)

**Prioridad:** `ALTA`

**CA:** Dado cualquiera de los cinco directorios, cuando el paciente entra, entonces ve una composición única: barra de filtros arriba (especialidad / tipo, departamento, municipio, zona, verificado, calificación mínima, precio máximo donde exista, «atiende hoy»), selector de orden (relevancia, precio, distancia, calificación), contador, rejilla de tarjetas con imagen dominante, nombre, insignias, calificación, «desde» (o «precio no publicado») y próxima disponibilidad, y una ficha con pestañas; todo dentro de los tokens ALOVIDA v1.0, en una tarjeta a lo ancho, en 1440/768/390.
**DoD:** `public/search/*` acepta `sort` y `minRating`/`maxPriceMinor` por lista blanca con tests; `test('PA-11 …')` verde; `carril-06-directorios-salud.spec.ts` y `categorias-en-directorios.spec.ts` actualizados; doble revisión con nota por pantalla; `yarn gates:diseno` 0.
**Estado:** TODO

#### H5.S1 — API: filtros y orden

**CA:** Dado `GET /public/search/practitioners?sort=rating&minRating=4&department=…`, cuando se consulta, entonces el orden es determinista (con desempate por id) y los filtros se resuelven por lista blanca; un `sort` desconocido → 400.
**DoD:** int-spec por recurso; plan de consulta documentado para el índice que haga falta.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H5.S1.M1 | `sort` ∈ {relevance, price, distance, rating, availability} en `public-search.dto.ts` y en los cinco buscadores | 400 ante valor fuera de lista | int-spec | TODO |
| H5.S1.M2 | `minRating`, `maxPriceMinor`, `openNow` en practitioners, organizations, pharmacies e insurers (diagnostic-units ya los tiene) | Filtran | int-spec | TODO |
| H5.S1.M3 | `distance` exige `lat,lng` → 422 si faltan | Test | int-spec | TODO |

#### H5.S2 — El organismo y las cinco pantallas

**CA:** Dado `DirectoryPage`, cuando recibe la configuración de filtros y orden, entonces renderiza la misma composición para los cinco directorios; las tarjetas reutilizan `result-card` con imagen y respaldo ante fallo de carga.
**DoD:** spec de `DirectoryPage` con la configuración nueva; capturas de los cinco en tres viewports y dos temas; doble revisión.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H5.S2.M1 | Boceto en `evidencia/boceto-directorio.png` (tokens, jerarquía, sin colores ajenos) y visto bueno de Pablo antes de codificar | Fila en el daily | daily | TODO |
| H5.S2.M2 | `DirectoryPage`: barra de filtros arriba (`filter-bar` + selector de orden), contador, rejilla responsiva 4/2/1 | Spec | spec | TODO |
| H5.S2.M3 | `result-card`: imagen dominante con `alt`, dimensiones estables y respaldo; insignias; calificación con texto (no sólo estrellas); «desde» o «precio no publicado» (Q-R5) | Spec | spec | TODO |
| H5.S2.M4 | Médicos: filtros departamento/municipio/calificación/orden (hoy sólo especialidad) | Playwright | `test('PA-11 médicos')` | TODO |
| H5.S2.M5 | Laboratorios, clínicas, farmacias, aseguradoras con la misma configuración | Playwright | `test('PA-11 …')` | TODO |
| H5.S2.M6 | Fichas con pestañas (Información · Servicios · Opiniones · Cómo llegar) reutilizando lo existente | Captura | doble revisión | TODO |
| H5.S2.M7 | Portada `directories-overview` rediseñada como entrada del marketplace | Captura | doble revisión | TODO |
| H5.S2.M8 | Móvil: `directories_screen.dart` con la misma jerarquía y filtros | `flutter test` | salida | TODO |

### H6 — Promociones como marketplace por tipo de partner (PA-10, C-09)

**Prioridad:** `MEDIA`

**CA:** Dado el paciente, cuando abre la pestaña «Promociones» del carrito, entonces ve tarjetas con imagen grande, título, partner (Médico / Imagenología / Laboratorio / Farmacia / Aseguradora), precio o beneficio, vigencia y distancia, con filtros por tipo de partner y departamento, leyendo de `GET /public/promotions`; las promociones de la demo en memoria ya no se usan.
**DoD:** `.puml` M51 con `partner_type`, `image_file_id`, `site_id`, `price_minor`; `GET /public/promotions` con tests; `test('PA-10 …')` verde; `promociones-mecanicas.spec.ts` actualizado.
**Estado:** TODO

#### H6.S1 — Modelo y API

**CA:** Dado `promotions`, cuando se crea una con `partnerType`, entonces se lista públicamente filtrada por tipo y territorio, con cursor.
**DoD:** patch aplicado, deriva 0, int-spec.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H6.S1.M1 | `.puml` M51 → `gen_ddl.py 51` → patch → ORM: `partner_type_concept_id`, `image_file_id`, `site_id`, `price_minor`, `currency` | Deriva 0 | `yarn orm:audit` | TODO |
| H6.S1.M2 | `GET /public/promotions?partnerType&department&municipality&cursor&limit` (sin tenant) | Lista cross-tenant | int-spec | TODO |
| H6.S1.M3 | `POST /promotions` acepta los campos nuevos (DTO con lista blanca) | 400 si campo fuera de lista | int-spec | TODO |

#### H6.S2 — El marketplace

**CA:** Dado el `slot` que deja Leo en la pestaña del carrito, cuando se monta, entonces el marketplace vive ahí y `features/account/promotions` deja de leer `promotions.fixtures.ts`.
**DoD:** spec; capturas; doble revisión.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H6.S2.M1 | `promotions.client.ts` → `GET /public/promotions`; borrar el uso de fixtures en `real-api` | Sin fixtures en runtime real | spec | TODO |
| H6.S2.M2 | Tarjetas con imagen dominante, chips por partner, filtros arriba | Captura | doble revisión | TODO |
| H6.S2.M3 | `pharmacy-campaigns.client.ts` deja de ser demo en memoria y escribe en `POST /promotions` (coordinar: el archivo es de Ender si está bajo `features/organization/pharmacy-*`; vos entregás el cliente) | Fila en el daily | daily | TODO |

### H7 — Reservar el servicio desde la orden de laboratorio (PA-07, lado paciente, C-04)

**Prioridad:** `ALTA`

**CA:** Dado una orden de laboratorio en «Mis órdenes», cuando el paciente toca «Reservar hora», entonces elige el centro y el cupo del **servicio** (no de cada estudio) y la reserva lleva `serviceRequestId`; el centro la ve con la orden; la duración la define el centro (Itzan).
**DoD:** `test('PA-07 reserva con la orden')` verde cuando Justin publique `serviceRequestId` en la reserva (hasta entonces doble declarado).
**Estado:** TODO

#### H7.S1 — La reserva lleva la orden

**CA:** Dado `appointments.ts`, cuando viene de `diagnostic-orders` con `?orden=`, entonces manda `serviceRequestId` en el hold/request.
**DoD:** spec + Playwright.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H7.S1.M1 | `diagnostic-orders.ts:456,497-500` pasa `?orden=<id>&centro=<unitId>` | Query presente | spec | TODO |
| H7.S1.M2 | `appointments.ts` manda `serviceRequestId` al `requestHold` cuando viene `?orden=` | Body con el campo | spec con `HttpTestingController` | TODO |
| H7.S1.M3 | Móvil: `schedule_lab_sample_sheet.dart` manda `serviceRequestId` en vez de texto en `reasonText` | `flutter test` | salida | TODO |

### H8 — El paciente mueve su cita en web (MD-10, lado paciente)

**Prioridad:** `ALTA`

**CA:** Dado una cita confirmada, cuando el paciente toca «Mover» en `/my-account/appointments`, entonces elige otro cupo del mismo médico y la cita queda reprogramada; el médico recibe el aviso y el chat (lo que ya hace `reschedule-booking.use-case.ts:222`); el paciente ve la cita nueva al recargar.
**DoD:** `test('MD-10 paciente mueve su cita')` verde; `appointments.spec.ts` actualizado.
**Estado:** TODO

#### H8.S1 — Mover desde el portal

**CA:** Dado `POST /scheduling/bookings/:id/reschedule` (existe), cuando el paciente lo llama desde la UI, entonces responde 200 y la lista se actualiza.
**DoD:** spec + Playwright + captura.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H8.S1.M1 | Botón «Mover» junto a «Cancelar» (`appointments.ts:1678`) que abre el selector de cupos del mismo médico (reutiliza `practitioner-availability` de Justin como componente, sin editarlo) | Botón visible | spec | TODO |
| H8.S1.M2 | Llamada a `reschedule` y actualización optimista con reversión ante error | 200 → lista nueva | spec | TODO |
| H8.S1.M3 | Verificar que el aviso llegó al médico (prueba con dos sesiones: paciente mueve, médico ve el mensaje) | Mensaje visible | Playwright | TODO |

### H9 — Verde, regresión y cierre

**Prioridad:** `ALTA`

**CA:** Dado el lote, cuando se corre `--grep "@richard"` contra la API real, entonces todo pasa; regresión y gates en verde; doble revisión; PRs mergeables.
**DoD:** `evidencia/despues/`; `evidencia/doble-revision.md`; salidas de `gh`; `REPORTE.md`.
**Estado:** TODO

#### H9.S1 — Cierre

**CA:** Dado el `REPORTE.md`, cuando lo lee alguien que no vio la sesión, entonces sabe qué anda, qué no y qué falta exactamente.
**DoD:** `report_gate.py --self-test` PASS.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H9.S1.M1 | Kill-tests `@richard` en verde contra `real-api` | 0 fallos | `corepack yarn pw … --grep "@richard"` | TODO |
| H9.S1.M2 | Regresión API (`yarn test`, `yarn test:integration` de `insurance`, `geo`, `promotions`, `community`), front y móvil | Exit 0 | salidas | TODO |
| H9.S1.M3 | `yarn gates:diseno`, axe en directorio, marketplace y pago | Exit 0 | salidas | TODO |
| H9.S1.M4 | Doble revisión de capturas | nota por pantalla | archivo | TODO |
| H9.S1.M5 | OpenAPI regenerado; PRs mergeables con `gh` | `MERGEABLE` | salidas | TODO |
| H9.S1.M6 | `REPORTE.md` en cada repo tocado | avance calculado | `report_gate.py` | TODO |

## 5. Definition of Done del lote

1. Los `test()` `@richard` pasan **contra la API real**.
2. `lint`, `typecheck`, `test` y `test:integration` (módulos tocados) de la API, `lint`/`typecheck`/`test`/`gates:diseno` del front, `flutter analyze`/`flutter test` del móvil: exit 0 o rojos previos clasificados sin ninguno nuevo.
3. Deriva modelo ↔ base ↔ ORM en 0 (`yarn orm:audit`) tras cada patch.
4. Ninguna aserción debilitada; listas cerradas corregidas.
5. Dinero sólo en enteros de la menor unidad; redondeo declarado; sin PHI en logs ni capturas.
6. Capturas con dos pasadas, ninguna `RECHAZADA`.
7. PRs `MERGEABLE` demostrados con `gh`; `REPORTE.md` con avance calculado y «No cubierto».
