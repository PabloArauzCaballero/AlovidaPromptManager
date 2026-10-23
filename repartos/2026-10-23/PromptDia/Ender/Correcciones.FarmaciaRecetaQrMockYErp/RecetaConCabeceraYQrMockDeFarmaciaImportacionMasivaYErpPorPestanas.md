# La receta con cabecera y QR, el sistema de farmacia simulado, la importación masiva de todo y el ERP por pestañas

> **Rol:** dueño de la receta como agregado, del enlace QR de la receta, de la carga en farmacia por sucursal, del mock del sistema de farmacia, de la importación masiva y de la pantalla ERP · **Carril:** 3 · Farmacia, imagenología y laboratorio (con Itzan) · **Fecha:** 2026-10-23 · **Turno:** día
> **Fuente del pedido:** [`CORRECCIONES-FULLSTACK-2026-10-23.md`](../../../../../docs/requisitos/CORRECCIONES-FULLSTACK-2026-10-23.md) — **PA-05, PA-06, FA-01, FA-02**, y el lado farmacia de **PA-02**
> **Verificación contra el código:** [`VERIFICACION-CONTRA-CODIGO-2026-10-23.md`](../../../../../docs/verificacion/VERIFICACION-CONTRA-CODIGO-2026-10-23.md) — §PA-05/PA-06, §FA-01/FA-02
> **Plan completo:** [`planes/06-correcciones-fullstack-2026-10-23/README.md`](../../../../../planes/06-correcciones-fullstack-2026-10-23/README.md) — **producís C-03 y el módulo `pharmacy-system` de C-07, y el escáner compartido `qr-scanner`; consumís C-02 (Richard), C-06 (Pablo)**
> **8 hitos · 14 subtareas · 67 microtareas**, todas con criterio de aceptación y Definition of Done.
>
> **Lo primero que tenés que saber:** la receta **no tiene cabecera**: cada medicamento es una fila de
> `medication_requests` y el único QR es el que se dibuja dentro del PDF con un UUID pelado que apunta a
> `/verify/rx/:id`, **una ruta que el front no tiene**. Antes de cualquier escáner, va el modelo (T-10 del
> vault: lo piden dos fuentes independientes). Lo segundo: **categorías de farmacia no tiene tabla**, precios
> e inventario del front sólo existen en el simulador, y la API no tiene ningún endpoint masivo de farmacia.
> El ERP por pestañas se arma **sobre** contratos reales, no sobre el simulador.

## 0. Ficha de asignación

| Campo | Valor |
|---|---|
| `REPOS` | `mdavila-2001/mantra-core-health-api` · `mdavila-2001/mantra-core-health` · `mantra-core-technologies/mantra-core-health-model` (`.puml` M08 recetas, M24, M25) · `mdavila-2001/mantra_core_health_mobile` |
| `TARGET_REF` | `origin/dev` front `227eb255` · API `6ea11561` · modelo `eceb98f` · móvil `origin/main` `ec88e81`. **Reconsultá y fijá el tuyo** |
| `RAMAS` | `ender/farmacia-receta-qr-mock-erp-2026-10-23` por repo. PR por hito; el del modelo antes que el de la API |
| `ARCHIVOS RESERVADOS PARA VOS` | API: `clinical/**/prescription*`, `clinical/controllers/clinical-prescriptions*`, `clinical/services/prescription-pdf.service.ts`, `prescription-qr.ts` (C-03) · `pharmacy/**` · `pharmacy_inventory/**` · `public/**` (resolver `/rx`) · `mock-provider-server/src/pharmacy-system/**`. Front: `features/pharmacy/**` · `features/organization/pharmacy-*/**` · `features/account/pharmacy/store-front/**` · `features/account/pharmacy/search/**` · `features/account/medical-record/where-to-buy/**` · `features/account/pharmacy-orders/**` · `core/data-access/pharmacy*/**` · `core/mock/handlers/pharmacy*.handlers.ts` · `shared/utils/qr/**` · `shared/components/organisms/qr-scanner/**` (nuevo, **lo escribís en tu Ola 0** porque Itzan y Leo lo usan) · tus `test()` en la suite. Modelo: `diagram_08_clinical.puml` (**sólo** el bloque de recetas; Itzan toca el de órdenes: coordinen por el daily y hagan PRs separados), `diagram_24_pharmacy.puml`, `diagram_25_pharmacy_inventory.puml`. Móvil: `features/pharmacy/**`, `features/pharmacy_admin/**`, escáner |
| `ARCHIVOS DE OTROS — NO LOS TOQUES` | `clinical/**/service-request*`, `diagnostics/**`, `diagnostic_units/**`, `features/laboratory/**`, `features/lab-reception/**` (**Itzan**) · `billing/**`, `surveys/**`, `@Roles` existentes, `concepts.ts` (**Pablo**) · `insurance/**`, `promotions/**`, `features/directory/**`, `checkout.summary.ts` lo cableás **vos** con el cliente que te entrega Richard (**Richard**) · `scheduling/**` (**Justin**) · `features/account/pharmacy/cart/**`, `features/account/pharmacy/prescriptions/**`, `/rx/:token` del paciente (**Leo**) |
| `⚠️ RIESGO ALTO DE TU CARRIL` | **La cabecera de receta cambia a todos los que leen `medication_requests`** (PDF, chart, farmacia, seguro, móvil): `prescription_id` es **nullable**, las recetas viejas se agrupan como hoy, y hay migración de datos en patch que agrupa por encuentro+fecha **sin inventar** nada. **Segundo:** el enlace de la receta es **PHI por referencia**: token firmado, vencimiento, **nunca** datos clínicos en la URL, 403 a cualquiera que no sea el paciente prescrito o personal de farmacia con sesión. **Tercero:** la importación masiva hace UPSERT por clave estable (`sku`/`externalProductCode`), la segunda corrida no inserta nada, y **nunca** trunca |
| `CONTRA QUÉ SE PRUEBA` | API real + `start:real-api`; el mock de farmacia levantado (`mock-provider-server`) |
| `CUENTAS DE PRUEBA` | `seed:e2e` + farmacia con dos sucursales y personal (`registro-farmacia.spec.ts` muestra el alta; si no hay seed, se crea por API, sintética) |
| `DÓNDE SE PRUEBA` | `/administration/pharmacy` (ERP), `/administration/pharmacy-orders`, `/administration/pharmacy/prescription-loads/:id` (nuevo), `/my-account/medical-record/where-to-buy/:requestId`, `/my-account/pharmacy-orders/*`, el PDF de la receta, el móvil del personal con escáner |
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
| `medication-prescription-safety` | **la más importante**: la receta como agregado, firma del conjunto, sustituciones, nada clínico inferido |
| `model-driven-schema` + `data-modeling-plantuml` | `prescriptions`, `prescription_loads`, `pharmacy_categories`, la tabla puente de disponibilidad |
| `frontend-security` + `data-privacy-phi` | token firmado, `?next=`, nada en la URL, 403 por sujeto |
| `authz-access-control` + `api-testing` | el paciente equivocado, la farmacia equivocada, sin sesión: matriz negativa |
| `backend-development` (puertos y adaptadores) + `nestjs-development` | `PharmacySystemPort` y el módulo hexagonal del mock |
| `seed-data-catalogs` + `data-quality-validation` + `terminology-value-sets` | importación masiva idempotente con procedencia; categorías como conceptos |
| `file-uploads-media` | CSV/XLSX: tipo real, tamaño, parse en servidor |
| `frontend-data-tables` + `frontend-forms-ux` + `frontend-ux-states` | el ERP por pestañas, denso, con errores por fila |
| `mobile-offline-sync` (sólo el escáner) + `flutter-development` | escáner en el móvil del personal |
| `e2e-playwright` + `visual-proof` + `critical-double-review` | tus `test()` y las dos pasadas |

### 1.4 DoD de esta sección

- [ ] Salidas pegadas en tu daily.
- [ ] Skills leídas, empezando por `medication-prescription-safety`.
- [ ] `PLAN.md` en cada repo (`docs/trabajo/2026-10-23-farmacia-receta-qr-mock-erp/PLAN.md`) **antes** del primer `Edit`/`Write` de código.

> ### ✅ Hechos ya verificados contra el corte
>
> - Sin cabecera: `medication_requests.entity.ts` (sin `prescription_id`, token ni QR); el front agrupa por encuentro+fecha (`patient-chart.ts:278-281`).
> - QR sólo en el PDF: `prescription-qr.ts:20`, `prescription-pdf.service.ts:532-533` (`/verify/rx/<uuid>`), pie `:349`. Verificación pública `GET /public/prescriptions/:id/verify` sin PHI ni ítems. **No existe `verify/rx` en `app.routes.ts`** (sólo `verify/portability`, `:2092`).
> - Pedido: `POST /pharmacy/orders` (PATIENT) con `findOwnMedicationRequest` (`pharmacy-orders.use-cases.ts:379-391`, la única atadura al paciente); `inventory_reservations` con **un** `medication_request_id`; `confirm` con `NO_DISPONIBLE | PROPONER_GENERICO` **después** del pedido. Disponibilidad calculada del stock (`pharmacy-inventory-read.controller.ts:38,56`). Personal acotado al tenant, no a la sucursal (`pharmacy-tenant-scope.guard.ts:32-48`).
> - Ningún escáner en web ni móvil; `qr_flutter` y `share_plus` sí, sin paquete de escaneo; sin app links.
> - Mock sin farmacia (`mock-provider-server/src/app.module.ts:20-28`); `pharmacy_integration_connections` y `pharmacy_external_product_mappings` existen y **nada las usa**; `reconcile` ignora los mapeos y no toca stock.
> - Menú de farmacia: diez entradas planas (`navigation.map.ts:1703-1906`); categorías sin tabla (`pharmacy.controller.ts:88`); precios por listas, uno por llamada; `UpdateProductDto` rechaza `unitPrice`/`inStock`/`status` (400 inferido); inventario sin `siteId`; importación sólo productos (CSV, fila por fila) e inventario (simulador). `portal-farmacia.spec.ts:63` exige «ocho filas» y está obsoleto.

## 2. Resultado observable

| Hito | Prioridad | Qué queda demostrado |
|---|---|---|
| **E-H1** | `BLOQUEANTE` | Corte, baseline, kill-tests `@ender` en rojo; **C-03 publicado el día 1**; `qr-scanner` compartido en `origin/dev` en la primera hora. |
| **E-H2** | `BLOQUEANTE` | **Receta con cabecera y enlace QR (PA-05):** el médico emite una receta de N ítems con folio; el PDF y la pantalla llevan el QR de `/rx/<token>`; abierto por el paciente prescrito muestra la receta; por otro, 403; sin sesión, pide entrar y vuelve; vencido, lo dice. |
| **E-H3** | `BLOQUEANTE` | **La farmacia la carga y marca por sucursal (PA-05):** el personal escanea (web o móvil) y la receta queda cargada en su farmacia; marca por sucursal qué ítems tiene y a qué precio; el paciente lo ve y reserva en esa sucursal. |
| **E-H4** | `ALTA` | **Sistema de farmacia simulado (PA-06 / C-07):** módulo hexagonal en el mock con productos, stock, precios, reservas y dispensación; `PharmacySystemPort` en la API; el mapeo de códigos funciona en los dos sentidos y `reconcile` actualiza stock. |
| **E-H5** | `ALTA` | **Importación masiva de todo (FA-01):** productos, categorías, precios, inventario por sucursal y sucursales aceptan CSV y XLSX con UPSERT en servidor, vista previa, errores por fila, segunda corrida sin cambios. |
| **E-H6** | `ALTA` | **ERP por pestañas (FA-02):** `/administration/pharmacy` es una tarjeta a lo ancho con pestañas Productos · Categorías · Precios · Inventario (denso, con filtros arriba e importación en cada una); las cuatro rutas viejas redirigen; contra la API real. |
| **E-H7** | `MEDIA` | **Cobro con seguro en farmacia (PA-02 lado proveedor):** el checkout muestra el coaseguro real por ítem (C-02) en vez del 20 % fijo; la encuesta de farmacia se emite al retirar (C-06). |
| **E-H8** | `ALTA` | Kill-tests `@ender` en verde, regresión, doble revisión, `REPORTE.md`, PRs mergeables. |

> ⚠️ **Orden: E-H1 → E-H2 → E-H3 → E-H5 → E-H6 → E-H4 → E-H7 → E-H8.** Si hay que recortar, E-H2 y E-H3 valen más que E-H4.

**Kill-test del lote completo:** emití una receta de 3 ítems como médico y descargá el PDF: si el QR
codifica un UUID y no `/rx/<token>`, E-H2 no está hecho. Abrí el enlace en una ventana sin sesión: si muestra
la receta, **está mal hecho**. Entrá como personal de farmacia y escaneá: si no aparece «receta cargada» con
los tres ítems para marcar por sucursal, E-H3 no está hecho. Marcá dos disponibles y entrá como paciente:
si no puede reservar esos dos en esa sucursal, E-H3 no está hecho. Subí un XLSX de precios: si la API no
tiene endpoint y lo procesa el navegador fila por fila, E-H5 no está hecho. Abrí
`/administration/pharmacy-categories`: si no redirige a la pestaña del ERP, E-H6 no está hecho.

## 3. Alcance

**IN:** corte y baseline · `qr-scanner` compartido · `clinical.prescriptions` + `prescription_id` +
migración · share-links con token firmado · resolver con sesión y 403 por sujeto · QR en PDF y pantalla ·
`prescription_loads` + disponibilidad por sucursal · reserva desde la carga · módulo `pharmacy-system` del
mock + `PharmacySystemPort` + mapeo bidireccional + `reconcile` que actualiza stock · tabla de categorías
(modelo) · endpoints de importación masiva CSV/XLSX con upsert para productos, categorías, precios,
inventario por sucursal y sucursales · ERP por pestañas · redirecciones · checkout con C-02 · emisión de
encuesta al retirar (C-06) · móvil: escáner del personal, marcar disponibilidad, importación · tus `test()`
· simulador · `PLAN.md`, `REPORTE.md`, `evidencia/`.

**OUT:** **cualquier archivo fuera de los reservados** · la ruta `/rx/:token` del **paciente** (**Leo**; vos
producís el resolver y el contrato) · el cálculo del coaseguro (**Richard**, C-02) · la plantilla y el envío
de la encuesta (**Pablo**, C-06: vos llamás el disparo al pasar a RETIRADO) · delivery y pasarela · el
supermercado (T-19) · comisiones semanales (T-13) · órdenes de laboratorio (**Itzan**) · debilitar un spec ·
declarar `HECHO` sin DoD corrido.

**Ambigüedades registradas** (además de Q-07, Q-08, Q-18 del archivo de requisitos):

| ID | Ambigüedad | Supuesto tomado | A quién confirmar |
|---|---|---|---|
| Q-E1 | PA-05 «el usuario por sucursal marca si tiene o no»: el personal está acotado al tenant, no a la sucursal | La marca lleva `siteId` elegido por el personal (selector de sucursal, recordado por sesión); el guard sigue por tenant. Un usuario por sucursal es T-nuevo, se registra | Pablo |
| Q-E2 | ¿Qué pasa con el stock real cuando el personal marca «lo tengo» y el stock dice 0? | La marca manual **gana** para esa carga (es lo que el cliente pide) y se registra `source: 'MANUAL'`; la disponibilidad calculada del stock sigue valiendo para el buscador general | Pablo |
| Q-E3 | Vencimiento del token del enlace | 30 días o la vigencia de la receta, lo que sea menor; renovable por el médico | Pablo + doctor |
| Q-E4 | Firma de la receta multi-ítem: hoy se firma por ítem (política D-05 del vault) | Se firma **la cabecera**; los ítems heredan; las recetas viejas conservan su firma por ítem (sin migrar firmas) | Pablo + doctor |
| Q-E5 | FA-01 formatos: ¿CSV y XLSX, o también el pegado de texto del móvil? | CSV y XLSX en servidor (una ruta por catálogo, misma forma de respuesta); el pegado del móvil se **retira** y la app sube el archivo | Pablo |
| Q-E6 | FA-02 ¿«Sucursales», «Promociones» y «Solicitudes de retiro» entran en el ERP? | No: el cliente nombra cuatro pestañas; las otras quedan como rutas propias | Pablo |

## 4. Plan — hitos, subtareas y microtareas

Estados: `TODO`, `EN CURSO`, `HECHO`, `A MEDIAS`, `BLOQUEADO`, `DESCARTADO`.

### H1 — Corte, baseline, kill-tests en rojo, C-03 y el escáner publicados

**Prioridad:** `BLOQUEANTE`

**CA:** Dado tu entorno, cuando alguien pregunta contra qué versión trabajaste, qué estaba en rojo y qué forma tiene C-03, entonces hay SHA, salidas, kill-tests en rojo, la fila de C-03 en el daily y `shared/components/organisms/qr-scanner/` mergeado en `origin/dev`.
**DoD:** `evidencia/antes/`; §4-bis del daily; PR del escáner mergeado en la primera hora.
**Estado:** TODO

#### H1.S1 — Corte y baseline

**CA:** Dado un rojo posterior, cuando alguien pregunta si lo rompiste vos, entonces la respuesta sale de un archivo.
**DoD:** exit codes pegados.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H1.S1.M1 | Corte y rama en los cuatro repos | SHA | `git rev-parse` | TODO |
| H1.S1.M2 | Baseline API (`NODE_OPTIONS=--max-old-space-size=8192`), front, móvil | Exit codes | `evidencia/antes/` | TODO |
| H1.S1.M3 | API real + `seed:e2e` + farmacia con dos sucursales y personal + paciente con receta | Logins | `evidencia/antes/cuentas.md` | TODO |

#### H1.S2 — Escáner compartido y contratos

**CA:** Dado `qr-scanner`, cuando Itzan y Leo lo importan, entonces compila y lee un QR con `BarcodeDetector` donde exista y con una librería de respaldo (ADR corto justificando la dependencia) donde no; sin cámara ofrece pegar el enlace.
**DoD:** spec del componente; PR chico mergeado; fila de C-03 en el daily.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H1.S2.M1 | `qr-scanner` (átomo/molécula en `shared/`) con `BarcodeDetector` + respaldo + entrada manual, accesible | spec | spec | TODO |
| H1.S2.M2 | ADR de la dependencia de respaldo (`technical-docs-and-adr`), tamaño y licencia | ADR | archivo | TODO |
| H1.S2.M3 | PR del escáner mergeado y publicado en §4-bis | SHA del merge | daily | TODO |
| H1.S2.M4 | Publicar C-03 (DTOs de cabecera, share-link, resolve, loads, availability) | Fila | daily | TODO |
| H1.S2.M5 | Correr y clasificar `--grep "@ender"` | Tabla | `evidencia/antes/kill-tests-ender.txt` | TODO |

### H2 — La receta con cabecera y su enlace QR (PA-05, C-03)

**Prioridad:** `BLOQUEANTE`

**CA:** Dado el médico que emite N medicamentos en una consulta, cuando confirma, entonces nace **una** receta con folio y N ítems; `POST /clinical/prescriptions/:id/share-links` devuelve `/rx/<token>` con vencimiento; el PDF y la pantalla de la receta dibujan ese QR; `GET /rx/resolve/:token` con sesión del paciente prescrito (o su tutor) devuelve la receta e ítems, con sesión de otro paciente 403 `NOT_PRESCRIBED_PATIENT`, sin sesión 401, vencido 410; la URL **no** contiene datos clínicos; las recetas anteriores siguen leyéndose.
**DoD:** `.puml` M08 (bloque recetas) + patch con migración de datos; int-specs (feliz, 401, 403, 410, token manipulado → 401) y `prescription-official-pdf.real.spec.ts` ampliado a «el QR codifica `/rx/`»; `test('PA-05 QR del PDF apunta a /rx/<token>')`, `test('PA-05 /rx resuelve sólo al prescrito')` verdes; OpenAPI regenerado.
**Estado:** TODO

#### H2.S1 — Modelo y migración

**CA:** Dado `clinical.prescriptions` y `medication_requests.prescription_id`, cuando corre el patch, entonces las recetas existentes quedan agrupadas por (paciente, encuentro, fecha de emisión) en cabeceras nuevas con folio generado, sin inventar nada más, y las sin encuentro quedan con `prescription_id NULL`.
**DoD:** `gen_ddl.py 08`; patch con conteos antes/después; `orm:audit` 0.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H2.S1.M1 | `prescriptions` (folio único por tenant, `patient_profile_id`, `encounter_id`, `prescriber_profile_id`, `status`, `issued_at`, `signed_at`, `signed_by_user_id`) en `diagram_08_clinical.puml` (coordinar con Itzan: PRs separados sobre el mismo `.puml`) | Regenera | `gen_ddl.py 08` | TODO |
| H2.S1.M2 | `medication_requests.prescription_id` FK nullable | Regenera | `gen_ddl.py 08` | TODO |
| H2.S1.M3 | `prescription_share_links` (`token_hash`, `expires_at`, `created_by`, `revoked_at`) | Regenera | `gen_ddl.py 08` | TODO |
| H2.S1.M4 | Patch con migración de datos y conteos (`SELECT count(*)` antes/después) | Conteos pegados | psql | TODO |
| H2.S1.M5 | Entidades + `orm:catalog` + deriva 0 | `orm:audit` | salida | TODO |

#### H2.S2 — API: emisión, enlace, resolución, PDF

**CA:** Dado C-03, cuando se ejercita, entonces responde con la forma publicada y la firma aplica a la cabecera (Q-E4).
**DoD:** int-specs; `test:integration clinical` verde.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H2.S2.M1 | `POST /clinical/prescriptions` (cabecera + ítems en una transacción, idempotente) y lectura `GET /clinical/prescriptions/:id` | int-spec | `test:integration` | TODO |
| H2.S2.M2 | Firma y emisión sobre la cabecera; los endpoints por ítem siguen para recetas viejas y se marcan `@deprecated` | int-spec | `test:integration` | TODO |
| H2.S2.M3 | `POST /clinical/prescriptions/:id/share-links` (token firmado HMAC, hash en base, vencimiento Q-E3) | int-spec | `test:integration` | TODO |
| H2.S2.M4 | `GET /rx/resolve/:token` en `public` **con sesión**: paciente prescrito o tutor → receta; PHARMACY_STAFF → receta + `pharmacyLoad`; otro → 403; sin sesión → 401; vencido → 410; token alterado → 401 | Cinco tests | `test:integration` | TODO |
| H2.S2.M5 | PDF: el QR codifica la `url` del share-link (se crea uno al generar el PDF si no hay vigente) y el pie lo imprime; el PDF de una receta vieja (sin cabecera) sigue saliendo | `prescription-official-pdf.real.spec.ts` | `yarn pw` | TODO |
| H2.S2.M6 | Acceso registrado en el log de accesos clínicos (quién resolvió, cuándo), sin contenido | int-spec | `test:integration` | TODO |

#### H2.S3 — Pantallas del médico y del paciente (receta)

**CA:** Dado la consulta, cuando el médico emite, entonces ve la receta como una tarjeta con folio, ítems y QR grande con «Compartir» (copiar enlace, `navigator.share`); en «Mis recetas» del paciente aparece la cabecera con sus ítems.
**DoD:** specs; capturas; `clinica-c5-receta.spec.ts` actualizado.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H2.S3.M1 | `clinical.client.ts` (parte recetas): `emitirReceta`, `shareLink`, `leerReceta` | spec | spec | TODO |
| H2.S3.M2 | Bloque de receta en la consulta: cabecera + ítems + QR + «Compartir» | spec + captura | doble revisión | TODO |
| H2.S3.M3 | «Mis recetas» del paciente agrupa por cabecera (las viejas por encuentro+fecha como hoy) | spec | spec | TODO |
| H2.S3.M4 | Simulador: `pharmacy*.handlers.ts` y el de recetas con C-03 | spec | spec | TODO |

### H3 — La farmacia la carga, marca por sucursal, el paciente reserva (PA-05, C-03)

**Prioridad:** `BLOQUEANTE`

**CA:** Dado personal de farmacia con sesión, cuando escanea el QR (o pega el enlace) en `/administration/pharmacy/prescription-loads/new`, entonces la receta queda cargada (`prescription_loads`) y aparece una tabla ítem × sucursal donde marca «lo tengo / no lo tengo», producto equivalente y precio; cuando guarda, el paciente ve en `where-to-buy` esa farmacia con los ítems disponibles por sucursal y puede reservar; cargar la misma receta dos veces devuelve la misma carga; un token ajeno al tenant de farmacia no se puede cargar.
**DoD:** `.puml` M24 con `prescription_loads` y `prescription_load_availability`; int-specs + matriz negativa; `test('PA-05 farmacia escanea y marca por sucursal')`, `test('PA-05 paciente reserva lo marcado')` verdes; móvil del personal con el escáner.
**Estado:** TODO

#### H3.S1 — Modelo y API

**CA:** Dado `PUT /pharmacy/prescription-loads/:loadId/availability` con `{ items: [{ medicationRequestId, siteId, available, productId?, priceMinor? }] }`, cuando se guarda, entonces es idempotente por (load, item, site) y `GET` lo devuelve; `POST /pharmacy/orders` acepta `prescriptionId` y valida contra la disponibilidad marcada (Q-E2).
**DoD:** int-specs; `test:integration pharmacy pharmacy_inventory` verde.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H3.S1.M1 | `prescription_loads` (`prescription_id`, `pharmacy_id`, `loaded_by_user_id`, `loaded_at`, único por receta+farmacia) y `prescription_load_availability` en `diagram_24_pharmacy.puml` | Regenera | `gen_ddl.py 24` | TODO |
| H3.S1.M2 | Carga al resolver con sesión PHARMACY_STAFF (C-03) + `GET /pharmacy/prescription-loads?status` (bandeja de recetas cargadas) | int-spec | `test:integration` | TODO |
| H3.S1.M3 | `PUT .../availability` (upsert, `source: 'MANUAL'`) y `GET .../:loadId` (paciente dueño y personal) | int-spec + 403 ajeno | `test:integration` | TODO |
| H3.S1.M4 | `POST /pharmacy/orders` acepta `prescriptionId` + `siteId` y valida la disponibilidad marcada; `inventory_reservations.prescription_id` (`.puml` M25) | int-spec | `test:integration` | TODO |
| H3.S1.M5 | `GET /pharmacy-inventory/availability` incluye las marcas manuales de las cargas del paciente (si las hay) con `source` | int-spec | `test:integration` | TODO |

#### H3.S2 — Pantallas del personal (web y móvil) y del paciente

**CA:** Dado el personal, cuando escanea, entonces ve la tabla ítem × sucursal y guarda; dado el paciente, cuando abre «Dónde comprarla», entonces ve la farmacia con las marcas y reserva.
**DoD:** specs; Playwright con dos sesiones; capturas; `flutter test`.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H3.S2.M1 | `pharmacy-prescription-loads` (bandeja + alta por escáner/enlace) con `qr-scanner` y selector de sucursal (Q-E1) | spec | spec | TODO |
| H3.S2.M2 | Tabla ítem × sucursal con `app-data-table`, toggles accesibles (texto + ícono), precio, equivalente | spec + captura | doble revisión | TODO |
| H3.S2.M3 | Alarma al llegar una carga nueva (proceso 3.2 del stakeholder: «alarma o sonido como Pedidos Ya»), respetando preferencias | spec | spec | TODO |
| H3.S2.M4 | `where-to-buy` muestra las sucursales con marcas manuales primero y permite reservar por `prescriptionId` | spec | `test('PA-05 paciente reserva')` | TODO |
| H3.S2.M5 | Móvil del personal: escáner + tabla de disponibilidad; app link `/rx/*` abre la carga si la sesión es de farmacia | `flutter test` + `adb` | salida + captura | TODO |

### H4 — El sistema de farmacia simulado y el puerto (PA-06, C-07)

**Prioridad:** `ALTA`

**CA:** Dado el mock con `src/pharmacy-system` (dominio, puertos, casos de uso, adaptadores, presentación), cuando la API consulta stock o precio por `PharmacySystemPort` con un `pharmacy_product_id`, entonces el adaptador traduce al `sku` externo con `pharmacy_external_product_mappings`, consulta el mock y traduce de vuelta; `reserve` y `confirmDispense` actualizan el mock; un lote de sincronización entrante con `externalProductCode` conocido queda MATCHED y **mueve stock**; un código desconocido queda `UNMAPPED_PRODUCT` sin tocar nada; el mock caído → `manual_fallback_allowed` decide 503 o respaldo.
**DoD:** tests del mock (tres niveles); specs del adaptador; int-spec del `reconcile`; `docker-compose.yml` con el servicio; `test('PA-06 stock desde el sistema externo')` verde.
**Estado:** TODO

#### H4.S1 — El módulo del mock

**CA:** Dado `GET /pharmacy-system/products`, `GET /stock?sku`, `POST /reservations`, `POST /dispense`, cuando se llaman, entonces responden sobre un catálogo sintético declarado, con latencia y tasa de fallo configurables.
**DoD:** `yarn test` del mock; Swagger.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H4.S1.M1 | Estructura hexagonal del módulo + catálogo sintético (JSON con `synthetic: true`) | Árbol | árbol | TODO |
| H4.S1.M2 | Endpoints con tres niveles (sku inexistente → 404, reserva sin stock → 409, body inválido → 422) | Tests | `yarn test` | TODO |
| H4.S1.M3 | `PHARMACY_SYSTEM_FAILURE_RATE`, `SIMULATED_LATENCY_MS`; `.env.example`, README, compose | `docker compose config` | salida | TODO |

#### H4.S2 — Puerto, adaptador y mapeo bidireccional

**CA:** Dado `PharmacySystemPort`, cuando se inyecta, entonces el servicio de disponibilidad puede consultarlo (por conexión REALTIME) y la sincronización BATCH usa los mapeos.
**DoD:** specs + int-spec.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H4.S2.M1 | `pharmacy/application/ports/pharmacy-system.port.ts` (`stockQuery`, `priceQuery`, `reserve`, `confirmDispense`) + adaptador HTTP + adaptador «no configurado» | spec | spec | TODO |
| H4.S2.M2 | Traductor `productId ↔ externalProductCode` sobre `pharmacy_external_product_mappings` (dos sentidos, versión de mapeo) | spec | spec | TODO |
| H4.S2.M3 | `reconcile` busca por `externalProductCode` en los mapeos y actualiza `inventory_stock_positions` (hoy no toca stock) | int-spec | `test:integration` | TODO |
| H4.S2.M4 | Disponibilidad en tiempo real por conexión `REALTIME` con `supports_stock_query` (fallback al stock local si `manual_fallback_allowed`) | int-spec | `test:integration` | TODO |
| H4.S2.M5 | Pantalla de conexión en el ERP (pestaña Inventario → «Sistema externo»: estado, último sync, mapeos sin resolver) | spec | spec | TODO |

### H5 — Importación masiva de todo (FA-01)

**Prioridad:** `ALTA`

**CA:** Dado un archivo CSV o XLSX, cuando el personal lo sube a `POST /pharmacies/:id/{products|categories|prices|inventory|branches}/import`, entonces el servidor valida tipo real y tamaño, devuelve una **vista previa** (filas válidas, inválidas con motivo por fila y columna, qué se crearía y qué se actualizaría) y, al confirmar, hace UPSERT por clave estable; la segunda corrida del mismo archivo devuelve 0 creados / 0 actualizados; nunca trunca.
**DoD:** `pharmacy_categories` en el modelo; int-specs por catálogo (feliz, inválido por fila, idempotencia); `test('FA-01 importación XLSX de precios idempotente')` verde; móvil sube archivo.
**Estado:** TODO

#### H5.S1 — Modelo: categorías e inventario por sucursal

**CA:** Dado `.puml` M24/M25, cuando se regenera, entonces existen `pharmacy_categories` (concepto o tabla propia por farmacia, con `code` estable) y `pharmacy_products.category_id`; el inventario del front pasa a ser por sucursal.
**DoD:** `gen_ddl.py 24 25`; patch; `orm:audit` 0.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H5.S1.M1 | `pharmacy_categories` (por farmacia, `code`, `name`, `parent_id?`) + `pharmacy_products.category_id` | Regenera | `gen_ddl.py 24` | TODO |
| H5.S1.M2 | `GET/POST/PATCH/DELETE /pharmacies/:id/categories` reales (hoy GET vacío y el resto simulador) | int-spec | `test:integration` | TODO |
| H5.S1.M3 | `UpdateProductDto` acepta `categoryId`, `status`, y el precio pasa por listas (documentado: `unitPrice` no existe) | 400 no aparece desde el ERP | int-spec | TODO |

#### H5.S2 — Importador común y las cinco rutas

**CA:** Dado el importador común (parser CSV/XLSX en servidor, vista previa, confirmación por `importId`, upsert), cuando se usa en los cinco catálogos, entonces comparten forma de respuesta y errores por fila.
**DoD:** int-specs ×5; fixtures en `test/fixtures/pharmacy-import/`.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H5.S2.M1 | `pharmacy/application/import/` común: parse (reusa `terminology/import/xlsx-parser.ts`), validación por fila, vista previa, confirmación, upsert por clave | spec | spec | TODO |
| H5.S2.M2 | Productos (clave `sku`/`externalProductCode`) | int-spec ×3 | `test:integration` | TODO |
| H5.S2.M3 | Categorías (clave `code`) | int-spec ×3 | `test:integration` | TODO |
| H5.S2.M4 | Precios (lista vigente, clave `sku`+`siteId?`) | int-spec ×3 | `test:integration` | TODO |
| H5.S2.M5 | Inventario por sucursal (clave `sku`+`siteId`, movimiento de ajuste auditado, no truncado) | int-spec ×3 | `test:integration` | TODO |
| H5.S2.M6 | Sucursales (clave `code`; P54: `description`, `locationUrl`) | int-spec ×3 | `test:integration` | TODO |
| H5.S2.M7 | Componente de importación compartido en el front (`pharmacy-import` reescrito: sube el archivo, muestra la vista previa, confirma; ya no procesa fila por fila) | spec | `test('FA-01 …')` | TODO |
| H5.S2.M8 | Móvil: `CatalogImportScreen` sube archivo (Q-E5) | `flutter test` | salida | TODO |

### H6 — El ERP por pestañas (FA-02)

**Prioridad:** `ALTA`

**CA:** Dado `/administration/pharmacy`, cuando entra el personal, entonces ve **una** tarjeta a lo ancho con pestañas Productos · Categorías · Precios · Inventario, cada una con filtros arriba, tabla densa (`app-data-table`), acciones por fila, botón «Importar» y contador; `pharmacy-catalog`, `pharmacy-categories`, `pharmacy-prices`, `pharmacy-inventory`, `pharmacy-import` redirigen a su pestaña; el menú tiene una sola entrada «Catálogo»; todo contra la API real.
**DoD:** `test('FA-02 ERP por pestañas contra la API real')` verde; `portal-farmacia.spec.ts` corregido (lista del menú); capturas 1440/768/390 claro/oscuro; doble revisión; `yarn gates:diseno` 0.
**Estado:** TODO

#### H6.S1 — Composición y pestañas

**CA:** Dado el ERP, cuando se cambia de pestaña, entonces la URL lo refleja (`?pestana=`), el foco va al encabezado de la pestaña y los filtros se conservan por pestaña.
**DoD:** spec; axe.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H6.S1.M1 | Boceto en `evidencia/boceto-erp.png` (denso y compacto, Q-18) con visto bueno de Pablo | Fila en el daily | daily | TODO |
| H6.S1.M2 | `pharmacy-erp` con `app-tabs` y las cuatro pestañas montando los componentes existentes refactorizados a contenedor + presentacional | spec | spec | TODO |
| H6.S1.M3 | Productos: filtros (texto, categoría, estado, con receta), edición en modal, importar | spec | spec | TODO |
| H6.S1.M4 | Categorías: árbol/tabla, alta, renombrar, borrar con confirmación, importar | spec | spec | TODO |
| H6.S1.M5 | Precios: lista vigente, edición por fila que escribe en listas de precios (no `unitPrice`), importar | spec | spec | TODO |
| H6.S1.M6 | Inventario: por sucursal (selector), stock, mínimo, ajuste auditado, «Sistema externo», importar | spec | spec | TODO |
| H6.S1.M7 | Redirecciones de las cinco rutas viejas y una sola fila «Catálogo» en el menú; `portal-farmacia.spec.ts:63` corregido | Verde | `yarn pw` | TODO |
| H6.S1.M8 | Simulador alineado al contrato real | spec | spec | TODO |

### H7 — Cobro con seguro en farmacia y encuesta al retirar (PA-02 lado proveedor, C-02, C-06)

**Prioridad:** `MEDIA`

**CA:** Dado un paciente con cobertura, cuando revisa el checkout, entonces cada ítem muestra lo cubierto, su parte y el motivo si no está cubierto, calculado por C-02 (`context: 'PHARMACY_ORDER'`), no por el 20 % fijo; dado un pedido que pasa a RETIRADO, entonces se emite la invitación de encuesta de farmacia (C-06).
**DoD:** `test('PA-02 coaseguro por ítem en farmacia')` verde (doble hasta que Richard publique); int-spec del disparo de encuesta.
**Estado:** TODO

#### H7.S1 — Checkout y disparo

**CA:** Dado `checkout.summary.ts`, cuando llega C-02, entonces deja de usar `checkout.fixtures.ts`.
**DoD:** spec; int-spec.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H7.S1.M1 | `checkout.summary.ts` consume `vistaPrevia()` del cliente de Richard por ítem; borrar la fixture del camino real | spec | spec | TODO |
| H7.S1.M2 | `dispense`/RETIRADO dispara `POST /surveys/invitations { targetType: 'PHARMACY_ORDER' }` (contrato de Pablo) después del commit, idempotente | int-spec | `test:integration` | TODO |

### H8 — Verde, regresión y cierre

**Prioridad:** `ALTA`

**CA:** Dado el lote, cuando se corre `--grep "@ender"` contra la API real con el mock de farmacia levantado, entonces todo pasa; regresión y gates en verde; doble revisión; PRs mergeables.
**DoD:** `evidencia/despues/`; `evidencia/doble-revision.md`; `gh`; `REPORTE.md`.
**Estado:** TODO

#### H8.S1 — Cierre

**CA:** Dado el `REPORTE.md`, cuando lo lee alguien que no vio la sesión, entonces sabe qué anda, qué no y qué falta exactamente.
**DoD:** `report_gate.py --self-test` PASS.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H8.S1.M1 | Kill-tests `@ender` en verde | 0 fallos | `yarn pw --grep "@ender"` | TODO |
| H8.S1.M2 | `test:integration clinical pharmacy pharmacy_inventory public` + regresión front y móvil | Exit 0 | salidas | TODO |
| H8.S1.M3 | Gates, axe en el ERP y la bandeja, doble revisión | archivo | evidencia | TODO |
| H8.S1.M4 | OpenAPI regenerado; PRs `MERGEABLE` con `gh` | salidas | evidencia | TODO |
| H8.S1.M5 | `REPORTE.md` en cada repo | avance calculado | `report_gate.py` | TODO |

## 5. Definition of Done del lote

1. Los `test()` `@ender` pasan **contra la API real** con el mock de farmacia levantado.
2. Deriva modelo ↔ base ↔ ORM en 0; migración de recetas con conteos antes/después pegados; ninguna receta vieja dejó de leerse.
3. El enlace de la receta: token firmado, vencimiento, 401/403/410 probados, nada clínico en la URL, acceso registrado.
4. Importación: segunda corrida 0/0 en los cinco catálogos; ningún `TRUNCATE`.
5. `lint`, `typecheck`, `test`, `test:integration` (módulos tocados) de la API; `lint`/`typecheck`/`test`/`gates:diseno` del front; `flutter analyze`/`flutter test`.
6. Ninguna aserción debilitada; `portal-farmacia.spec.ts` corregido, no saltado.
7. Capturas con dos pasadas; PRs `MERGEABLE`; `REPORTE.md` con avance calculado y «No cubierto».
