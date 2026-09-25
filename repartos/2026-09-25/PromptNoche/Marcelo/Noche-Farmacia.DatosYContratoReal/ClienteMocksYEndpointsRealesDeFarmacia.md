# Cliente y mocks de farmacia, y el contrato real en la API: sedes sueltas y catálogo por farmacia

> **Rol:** dueño del cliente y los mocks de farmacia en el front, y del módulo `pharmacy` en la API · **Carriles del plan:** 42 y 47 · **Fecha:** 2026-09-25 · **Turno:** noche
> **Fuente del pedido:** [`FARMACIA-ECOMMERCE-2026-09-25.md`](../../../../../docs/requisitos/FARMACIA-ECOMMERCE-2026-09-25.md) — **R1, R4** (los datos que las pantallas necesitan)
> **Verificación contra el código:** [`VERIFICACION-CONTRA-CODIGO-2026-09-25.md`](../../../../../docs/verificacion/VERIFICACION-CONTRA-CODIGO-2026-09-25.md) — §2, §3 (la API real)
> **Plan maestro:** [`PLAN-MAESTRO.md`](../../../../../docs/trabajo/2026-09-25-plan-y-reparto-farmacia-ecommerce/PLAN-MAESTRO.md) · **Plan completo:** [`planes/04-farmacia-ecommerce-2026-09-25/README.md`](../../../../../planes/04-farmacia-ecommerce-2026-09-25/README.md) §4.4
> **7 hitos · 8 subtareas · 30 microtareas**, todas con criterio de aceptación y Definition of Done.
>
> **Tu carril tiene la otra mitad de la Ola 0 y el único trabajo de backend del turno.** En la primera hora
> (H2) dejás en `origin/mockup` los tipos y los dos métodos de cliente que Justin e Itzan importan
> (`getPharmacy`, `getSitePrices`) con sus mocks. Después nadie te espera: el resto de tu turno cierra en
> la API real (`mantra-core-health-api`, rama `dev`) la brecha que la maqueta tapa con mocks —**listar sedes
> sueltas y filtrar productos por farmacia**— para que cuando el front deje el simulador, funcione igual.

## 0. Ficha de asignación

| Campo | Valor |
|---|---|
| `REPO` | **Dos.** `alovida/mantra-core-health` (front: H2, H3) y `alovida/mantra-core-health-api` (API: H4, H5, H6) |
| `TARGET_REF` | Front: `origin/mockup` @ **`bf2c35452363ede1d367f94c4fd726b2b9a63cb1`** (2026-09-25T00:34-04, PR #660). API: `origin/dev` @ **`343795cc2d08745692f491c50e81427215043315`** (2026-09-25T00:30-04, PR #459). **Reconsultá y fijá los tuyos** en tu `PLAN.md` |
| `RAMA DE TRABAJO` | Front: `marcelo/farmacia-cliente-y-mocks-2026-09-25` desde `origin/mockup` (H2 en un PR propio y chico, **primero**). API: `marcelo/pharmacy-sites-y-filtro-por-farmacia-2026-09-25` desde `origin/dev`. **Nada directo, nada sin PR** |
| `ARCHIVOS RESERVADOS PARA VOS` | Front: `src/app/core/data-access/pharmacy/pharmacy.types.ts` · `pharmacy.client.ts` · `pharmacy.client.spec.ts` · `pharmacy.fixtures.ts` · `src/app/core/mock/handlers/pharmacy.handlers.ts` · `pharmacy.handlers.spec.ts` (nuevo). API: `src/modules/pharmacy/controllers/pharmacy-read.controller.ts` · `services/pharmacy-read.service.ts` (o donde viva `listPharmacies`) · `dto/read-responses.dto.ts` · sus specs · `openapi/endpoints/pharmacy*.md` · `docs/PENDIENTES-BACKEND.md` (una nota) |
| `ARCHIVOS DE OTROS — NO LOS TOQUES` | Front: `core/data-access/pharmacy-cart/**`, `cart/**`, `shell-layout/**`, `core/navigation/**`, `app.routes.ts` (**Pablo**) · `features/account/pharmacy/{store-front,search,prescriptions}/**`, `where-to-buy/**` (**Justin**) · `features/account/pharmacy/store/**` (**Itzan**) · `features/account/cotizaciones/**` (nadie). API: `pharmacy_inventory/**` (sólo se lee: `availability` es la referencia de Haversine y de `lat/lng`), el modelo (`mantra-core-health-model/**`: **cero DDL**, las tablas ya existen) |
| `⚠️ RIESGO ALTO DE TU CARRIL` | **Que el mock y la API real no digan lo mismo.** Los campos de `PharmacySite`, `PharmacySitePrices` y del listado de sedes tienen que ser **idénticos** en `pharmacy.types.ts`, en el mock y en `read-responses.dto.ts` — nombre por nombre, tipo por tipo. Si te desviás en uno, Justin e Itzan cierran contra un contrato que después no existe |
| `LA MAQUETA NO TIENE BACKEND` | `mockBackend: true` fijo. Todo lo que agregues al mock sale de `FARMACIAS` y `productos` que ya viven en `pharmacy.handlers.ts`: **mismo `price`, mismo `stock`, mismo `requiresPrescription`**. Sin dato inventado |
| `CUENTA DE PRUEBA` | Front: `paciente@alovida.mock`. API: los actores de `test/` del repo (sintéticos). **Ningún dato real** |
| `DÓNDE SE PRUEBA` | Front: `curl` contra `yarn start` (`/pharmacy/pharmacies/:id`, `/pharmacy/sites/:siteId/prices`, `/pharmacy/sites`, `/pharmacy/products?pharmacyId`). API: `yarn test` del módulo y el CI de docs (`docs:coverage`, OpenAPI). **No levantes el stack Docker sin pedir permiso** (`CLAUDE.md` de la raíz): los specs de controlador con `EntityManager` mockeado alcanzan |
| `LÍMITE DE RECURSOS` | Regla 70: un `yarn start`, un build, un navegador. En la API, `yarn test` del módulo, no la suite entera de 890 s |

## 1. Antes de escribir una línea — instalación OBLIGATORIA del estándar

> **Esta sección no es opcional y no es el final del día: es lo primero.** Un prompt ejecutado sin
> el estándar cargado produce trabajo que después hay que rehacer, porque no va a tener plan, ni
> evidencia, ni reporte. **Si no podés completar este paso, estás `BLOQUEADO`: avisalo y no sigas.**

### 1.1 Instalar el estándar en tu checkout

```bash
# 1. Clonar el estandar al lado del repo de producto
git clone https://github.com/PabloArauzCaballero/AlovidaPromptManager.git ../AlovidaPromptManager

# 2. Copiarlo DENTRO de tu checkout de trabajo (Claude Code solo carga desde ./.claude/)
cp -r ../AlovidaPromptManager/.claude   ./
cp    ../AlovidaPromptManager/AGENTS.md ./
cp -r ../AlovidaPromptManager/.agents   ./   # solo si tu herramienta no lee .claude/

# 3. Verificar que quedo instalado (pega esta salida en tu daily)
ls .claude/skills | wc -l            # -> 179
ls .claude/rules/[0-9]*.md | wc -l   # -> 15  (mas el README, que no es una regla)
python .claude/hooks/plan_gate.py --self-test    # -> 11 PASS, 0 FAIL
```

⚠️ **Antes de `cp -r`, mirá qué hay:** los dos repos de producto **ya tienen** su propio `.claude/`. Si ibas a
pisar algo, no lo pises: fusioná y dejá constancia en tu daily.

### 1.2 Qué te instala eso

| Candado | Qué impide |
|---|---|
| `plan_gate.py` | Escribir código sin `PLAN.md` en disco. Nunca bloquea `.md` ni nada bajo `docs/` |
| `report_gate.py` | Cerrar la sesión con trabajo activo y sin `REPORTE.md`, o sin sus tres secciones |
| `blocker_gate.py` | Cerrar con microtareas en `BLOQUEADO` o `EN CURSO` sin declarar la simulación de los tres niveles del contrato (regla 65) |

**En cualquier otra herramienta los candados NO corren.** El plan y el reporte siguen siendo igual de
obligatorios; lo único que cambia es que nadie te va a frenar.

### 1.3 Skills que tenés que CARGAR para este lote

Son **21**: 11 del proceso y 10 propias del contrato de datos.

**Del proceso — obligatorias para todos:**

| Skill | Para qué |
|---|---|
| `skills-router` | la entrada al catalogo: mapea la situacion concreta a la skill que toca |
| `factual-discovery` | confirmar el sistema real antes de planificar |
| `milestone-planning` | descomponer en hitos, subtareas y microtareas con CA y DoD |
| `anti-hallucination-guard` | localizar lo existente antes de crear; no inventar APIs de terceros |
| `evidence-and-verification` | que podes afirmar con que evidencia |
| `scope-discipline` | no tocar nada fuera del alcance declarado |
| `rationalization-guard` | las excusas tipicas para saltear una verificacion, y su contramedida |
| `context-thrift` | leer por rangos y busqueda, no archivos enteros |
| `progress-reporting` | checkpoints visibles en cada apertura y cierre de microtarea |
| `finish-your-turn` | como se cierra un turno sin dejar nada colgado |
| `work-report-md` | como se redacta el reporte de cierre |

**De tu lote:**

| Skill | Para qué |
|---|---|
| `frontend-data-access` | **la más importante de la primera hora**: cliente contract-first, `HttpParams` sin `undefined`, tipos calcados del DTO |
| `nestjs-development` | **la más importante de la segunda mitad**: un `@Get` nuevo en el read controller, `ParseUUIDPipe({ optional })`, el servicio de lectura, sin tocar el modelo |
| `api-openapi-docs` | `@ApiQuery`/`@ApiOkResponse` completos; `openapi/endpoints/pharmacy*.md` regenerado; `docs:coverage` en verde |
| `postgresql-advanced` | la consulta de sedes con Haversine como ya la hace `availability`; sin `SELECT *`, con índice existente |
| `error-handling-contract` | `lat` sin `lng` = 400 como en `availability`; id desconocido = 404 en el mock y en la API |
| `secure-code-review` | lectura pública del directorio sin `@Roles`, igual que `pharmacies`; ningún dato de paciente en estos endpoints |
| `seed-data-catalogs` | el mock no inventa precios: reusa `productos` y `FARMACIAS`; las fixtures son sintéticas declaradas |
| `unit-testing` | un comportamiento por test; el spec del handler compara el precio en tres endpoints |
| `angular-testing` | `HttpTestingController` en `pharmacy.client.spec.ts` (ya hay 6 casos: seguí el patrón) |
| `github-pull-requests` | dos PRs a dos repos, mergeables, con `PLAN.md`/`REPORTE.md` |

Entrá siempre por `skills-router`: **no leas el catálogo entero, no sirve.**

### 1.4 DoD de esta sección — se verifica como cualquier otra

- [ ] `ls .claude/skills | wc -l` devolvió **179**, y la salida está pegada en tu daily.
- [ ] `python .claude/hooks/plan_gate.py --self-test` devolvió **11 PASS, 0 FAIL**, salida pegada.
- [ ] Leíste `skills-router` y las 21 skills de las dos tablas, **empezando por `frontend-data-access`**.
- [ ] Creaste tu `PLAN.md` **antes** del primer `Edit`/`Write` de código.

**Sin estas cuatro casillas, tu lote arranca en `BLOQUEADO`, no en `EN CURSO`.**

> ### ✅ Hechos ya verificados contra el corte — no los repitas, pero tampoco los creas sin abrir el archivo
>
> - **La API real ya tiene lo que el catálogo por tienda necesita:** `pharmacy-read.controller.ts` — `GET /pharmacy/pharmacies` (l. 38), `GET /pharmacy/pharmacies/:id` (l. 46, `PharmacyDetailDto` con `sites[]`: `id, code, name, addressText, latitude, longitude` en `read-responses.dto.ts:27-62`), `GET /pharmacy/products` (l. 56: `search`, `conceptId`, `limit`; **sin `pharmacyId`**), `GET /pharmacy/sites/:siteId/prices` (l. 87: `PharmacySitePricesResponseDto` con `siteId, siteName, items[]` de `PharmacySitePriceDto`, l. 259). **No hay `GET /pharmacy/sites`.**
> - **El front sólo tiene tres métodos:** `PharmacyClient.listPharmacies()`, `searchProducts()`, `availability()` (`pharmacy.client.ts`), más `nearbySites()` y el filtro `pharmacyId` del PR #659 — **los dos sólo existen en el mock**. Faltan `getPharmacy()` y `getSitePrices()`.
> - **El mock sirve** `/pharmacy/pharmacies`, `/pharmacy/products`, `/pharmacy/sites`, `/pharmacy-inventory/availability` y los pedidos (`pharmacy.handlers.ts:268-432`). `FARMACIAS` (l. 52) tiene 58 sedes con `lat/lng/addressText/homeDelivery`; `productos` (l. 86) tiene `price`, `stock`, `requiresPrescription`, `medicationConceptId`. La distancia la calcula `distanciaKm()` (l. 112). **No sirve** `/pharmacy/pharmacies/:id` ni `/pharmacy/sites/:siteId/prices`.
> - **La forma de `availability` en la API real** (`pharmacy-inventory-read.controller.ts:56`) es la referencia para `lat`+`lng` juntos o 400, y para el Haversine del servicio.

## 2. Resultado observable

| Hito | Prioridad | Qué queda demostrado |
|---|---|---|
| **H1** | `BLOQUEANTE` | Los dos cortes declarados y el baseline de los dos repos con rojos previos clasificados. |
| **H2** | `BLOQUEANTE` | **Ola 0 del equipo.** En `origin/mockup` existen `PharmacyDetail`, `PharmacySiteRead`, `PharmacySitePrices`, `PharmacySitePriceItem`, `getPharmacy()`, `getSitePrices()` y sus dos mocks; `curl` los devuelve; publicado en el daily en la primera hora. |
| **H3** | `ALTA` | `pharmacy.fixtures.ts` exporta `FARMACIA_DETALLE`, `PRECIOS_DE_SEDE` y `SEDES_CERCANAS`; el precio de un producto coincide en `/sites/:siteId/prices`, `/availability` y el pedido, y hay un spec del handler que lo fija. |
| **H4** | `ALTA` | La API real responde `GET /pharmacy/sites?search&lat&lng&limit` con los mismos campos que el mock. |
| **H5** | `ALTA` | La API real filtra `GET /pharmacy/products?pharmacyId=`. |
| **H6** | `ALTA` | OpenAPI y Postman regenerados sin diff pendiente; nota en `PENDIENTES-BACKEND.md`; PR a `dev` mergeable. |
| **H7** | `ALTA` | Regresión de los dos repos en verde y `REPORTE.md` escrito. |

> ⚠️ **Orden: H1 → H2 (una hora, PR propio, avisar) → H3 → H4 → H5 → H6 → H7.** Si hay que recortar, H2 y H3
> valen más que H6: el front cierra el turno contra el mock; la API puede llegar mañana.

**Kill-test del turno completo:** con `yarn start` del front, `curl -s localhost:4200/pharmacy/pharmacies/<id
de FARMACIAS[0]>` tiene que traer `sites[0].latitude`; si no, H2 no está hecho. `curl -s
localhost:4200/pharmacy/sites/<siteId>/prices | jq '.items[0].unitAmount'` y el `price` de ese producto en
`/pharmacy-inventory/availability?products=<id>` tienen que ser el mismo número; si no, H3 no está hecho. En
la API, `yarn test src/modules/pharmacy` tiene que incluir un caso que pida `/pharmacy/sites?lat=-17.78` sin
`lng` y reciba 400; si no, H4 no está hecho. Y si un campo del DTO nuevo se llama distinto que en
`pharmacy.types.ts` del front, **está mal hecho**.

## 3. Alcance

**IN:** baseline de los dos repos · tipos y dos métodos de cliente nuevos · dos mocks nuevos · fixtures
compartidas · spec del handler que fija la coherencia de precio · `GET /pharmacy/sites` real con Haversine ·
`pharmacyId` en `GET /pharmacy/products` real · OpenAPI, Postman y nota de pendientes · specs · `PLAN.md`,
`REPORTE.md` y `evidencia/` por repo.

**OUT:** **cualquier archivo fuera de los reservados de la ficha** · pantallas (**Justin, Itzan**) · el
carrito y la cabecera (**Pablo**) · `pharmacy_inventory/**` de la API (sólo se lee) · **el modelo, DDL y
seeds** (`mantra-core-health-model/**`): las tablas ya existen; si te parece que falta una columna, se anota,
no se agrega · un endpoint de carrito en la API · `availability` (ya existe y funciona) · levantar el stack
Docker sin permiso · debilitar un spec para que pase · declarar `HECHO` una microtarea cuyo DoD no corriste.

## 4. Plan — hitos, subtareas y microtareas

Los seis estados permitidos son exactamente: `TODO`, `EN CURSO`, `HECHO`, `A MEDIAS`, `BLOQUEADO` y
`DESCARTADO`. **`A MEDIAS` es legítimo; disfrazarlo de `HECHO` no.**

### H1 — Cortes y baseline de los dos repos

**Prioridad:** `BLOQUEANTE`

**CA:** Dado cada repo, cuando alguien pregunta contra qué versión trabajaste y qué estaba en rojo antes, entonces hay SHA, salidas y rojos previos clasificados para el front y para la API.
**DoD:** `evidencia/antes/front/` y `evidencia/antes/api/` con salidas y exit codes.
**Estado:** TODO

#### H1.S1 — Corte, ramas y baseline

**CA:** Dado un rojo posterior en cualquiera de los dos, cuando alguien pregunta si lo rompiste vos, entonces la respuesta sale de un archivo.
**DoD:** salidas pegadas; rojos previos clasificados.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H1.S1.M1 | Fijar los dos cortes y las dos ramas en `PLAN.md` | Dos SHA y dos ramas | `git fetch origin && git rev-parse origin/mockup` (front) · `git rev-parse origin/dev` (API) | TODO |
| H1.S1.M2 | Baseline front: `lint`, `typecheck`, `test --include='src/app/core/data-access/pharmacy/*.spec.ts'` | Salidas y exit codes | → `evidencia/antes/front/` | TODO |
| H1.S1.M3 | Baseline API: `yarn typecheck` y `yarn test src/modules/pharmacy` | Salidas y exit codes | → `evidencia/antes/api/` | TODO |
| H1.S1.M4 | Clasificar cada rojo previo | Cada uno con su clase | tabla en `PLAN.md` | TODO |

### H2 — Tipos, cliente y mocks (Ola 0 del equipo)

**Prioridad:** `BLOQUEANTE`

**CA:** Dado el plan §4.4, cuando Justin e Itzan llaman `getPharmacy(id)` y `getSitePrices(siteId)` desde `origin/mockup`, entonces compilan, el mock responde y los campos son los del DTO real nombre por nombre.
**DoD:** PR propio mergeado en `mockup` en la primera hora; `pharmacy.client.spec.ts` +4 casos en verde; `curl` pegado; fila **PUBLICADO** en §4-bis del daily.
**Estado:** TODO

#### H2.S1 — Tipos, métodos y mocks

**CA:** Dado `getSitePrices(siteId, productId?)`, cuando `productId` viene, entonces viaja como `?product=`; cuando no, no viaja ninguna clave; dado un `siteId` desconocido, el mock responde 404.
**DoD:** spec del cliente; `curl` contra `yarn start`.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H2.S1.M1 | `pharmacy.types.ts`: `PharmacySiteRead { id, code, name, addressText, latitude, longitude }`, `PharmacyDetail extends PharmacyDirectoryItem { legalName, type, homeDeliveryAvailable, pickupAvailable, sites: PharmacySiteRead[] }`, `PharmacySitePriceItem { productId, productCode, brandName, genericName, strengthText, packageSizeText, medication, requiresPrescription, unitAmount, patientAmount, currency, priceListCode }`, `PharmacySitePrices { siteId, siteName, items }` — **calcados de `read-responses.dto.ts`** | Cada campo existe en el DTO con el mismo nombre | `diff` manual pegado en `evidencia/h2/campos.md` | TODO |
| H2.S1.M2 | `PharmacyClient.getPharmacy(id)` → `GET /pharmacy/pharmacies/:id` | Compila; spec | `npx ng test --include='src/app/core/data-access/pharmacy/pharmacy.client.spec.ts' --watch=false` | TODO |
| H2.S1.M3 | `PharmacyClient.getSitePrices(siteId, productId?)` → `GET /pharmacy/sites/:siteId/prices?product=` (sin clave si no viene) | Spec fija las dos formas | idem | TODO |
| H2.S1.M4 | Mock `GET /pharmacy/pharmacies/:id` desde `FARMACIAS` (una sede por farmacia con `lat/lng/addressText`); 404 si no existe | `curl` devuelve `sites[0].latitude` | `curl -s localhost:4200/pharmacy/pharmacies/<id>` pegado | TODO |
| H2.S1.M5 | Mock `GET /pharmacy/sites/:siteId/prices` desde `productos` de esa farmacia con `stock > 0`: `unitAmount = patientAmount = price`, `currency = BOB`, `priceListCode = 'PUBLICO'`, `requiresPrescription`; `?product=` acota; 404 si la sede no existe | `curl` devuelve `items[]` con precio | `curl -s localhost:4200/pharmacy/sites/<siteId>/prices` pegado | TODO |
| H2.S1.M6 | PR chico a `mockup`, mergeado, y fila **PUBLICADO** en §4-bis del daily con rutas y ejemplo de `curl` | Justin e Itzan lo pueden importar | `git log origin/mockup -1` | TODO |

### H3 — Fixtures y coherencia del mock

**Prioridad:** `ALTA`

**CA:** Dado un producto, cuando se lo consulta por `/sites/:siteId/prices`, `/availability` y se lo pide por `POST /orders`, entonces el precio es el mismo número en los tres; y las fixtures exportadas compilan contra los tipos.
**DoD:** `pharmacy.fixtures.ts` con tres constantes nuevas; `pharmacy.handlers.spec.ts` (nuevo) en verde.
**Estado:** TODO

#### H3.S1 — Fixtures compartidas

**CA:** Dado Justin o Itzan escribiendo un spec, cuando importan `PRECIOS_DE_SEDE`, entonces tienen un producto sin receta y uno con receta, con precio, de la misma sede que `FARMACIA_DETALLE`.
**DoD:** typecheck; fila en el daily con los nombres.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H3.S1.M1 | `FARMACIA_DETALLE: PharmacyDetail` (una sede con coordenadas), `PRECIOS_DE_SEDE: PharmacySitePrices` (2 ítems, uno `requiresPrescription: true`), `SEDES_CERCANAS: PharmacySitePage` (3 con `distanceKm`) | Compilan y son coherentes entre sí (misma `siteId`) | `corepack yarn typecheck` | TODO |
| H3.S1.M2 | Publicar los nombres en §4-bis del daily | Justin e Itzan los ven | lectura | TODO |

#### H3.S2 — Coherencia de precio en el mock

**CA:** Dado `pharmacy.handlers.spec.ts`, cuando se consulta el mismo producto por tres caminos, entonces el precio coincide y un producto con `stock 0` no aparece en `/prices` ni en `/availability`.
**DoD:** spec nuevo en verde (≥ 4 casos), montado sobre el `MockRouter` como lo hacen los otros `*.handlers.spec.ts`.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H3.S2.M1 | Leer cómo se prueban `pharma-lab.handlers.spec.ts` / `community.handlers` y calcar el arnés | El spec registra `registrarFarmacia` en un router de prueba | spec compila | TODO |
| H3.S2.M2 | Caso: precio igual en `/sites/:siteId/prices`, `/availability` y `POST /orders` → `lines[].unitPriceAmount` | Tres números iguales | `npx ng test --include='src/app/core/mock/handlers/pharmacy.handlers.spec.ts' --watch=false` | TODO |
| H3.S2.M3 | Caso: `stock 0` no aparece en `/prices` ni en `/availability`; `requiresPrescription` viaja en `/prices` | Fijado | idem | TODO |
| H3.S2.M4 | Caso: `/pharmacy/sites` ordena por distancia con origen y por nombre sin origen; `/products?pharmacyId` filtra | Fijado | idem | TODO |

### H4 — `GET /pharmacy/sites` en la API real

**Prioridad:** `ALTA`

**CA:** Dado `GET /pharmacy/sites?search=&lat=&lng=&limit=`, cuando se llama, entonces devuelve las sedes publicadas del tenant con `siteId, siteName, pharmacyId, pharmacyName, addressText, latitude, longitude, distanceKm, homeDeliveryAvailable, pickupAvailable, productCount`, ordenadas por distancia (con origen) y nombre; `lat` sin `lng` = 400; sin `@Roles`.
**DoD:** spec del controlador (≥ 5 casos) y del servicio; OpenAPI actualizado; `yarn typecheck` exit 0.
**Estado:** TODO

#### H4.S1 — Controlador, servicio y DTO

**CA:** Dado el servicio, cuando se lee la consulta, entonces usa las mismas tablas que `listPharmacies`/`getPharmacy` (sedes publicadas) y el Haversine de `availability`; sin `SELECT *`.
**DoD:** spec con `EntityManager` mockeado, como los demás del módulo.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H4.S1.M1 | Leer `pharmacy-read.service.ts` (`listPharmacies`, `getPharmacy`) y `pharmacy-inventory-read.service.ts` (`availability`: Haversine y validación `lat/lng`) y anotar en `PLAN.md` qué se reusa | Hay archivo y línea de cada pieza | `PLAN.md` | TODO |
| H4.S1.M2 | `PharmacySiteListItemDto` y `PharmacySiteListResponseDto` en `read-responses.dto.ts` con `@ApiProperty` — **campos idénticos a `PharmacySite` del front** | Nombre por nombre | `evidencia/h4/campos.md` (diff con el front) | TODO |
| H4.S1.M3 | `listSites({ search, origin, limit })` en el servicio: sedes publicadas, filtro por nombre de farmacia o sede, `distanceKm` con Haversine, orden distancia → nombre, `productCount` | Spec del servicio | `yarn test src/modules/pharmacy/services` | TODO |
| H4.S1.M4 | `@Get('sites')` en `pharmacy-read.controller.ts`, **declarado antes de `sites/:siteId/prices`**, con `@ApiQuery` × 4, `ParseUUIDPipe` donde aplique, `lat`+`lng` juntos o 400 (misma validación que `availability`), sin `@Roles` | Spec del controlador: 200 con origen, 200 sin origen (`distanceKm: null`), 400 con `lat` solo, filtro `search`, `limit` | `yarn test src/modules/pharmacy/controllers` | TODO |
| H4.S1.M5 | `openapi/endpoints/pharmacy*.md` regenerado; `docs:coverage` en verde | Sin diff pendiente tras regenerar | `yarn docs:coverage` (o el script que use el CI) | TODO |

### H5 — `pharmacyId` en `GET /pharmacy/products`

**Prioridad:** `ALTA`

**CA:** Dado `GET /pharmacy/products?pharmacyId=<uuid>`, cuando se llama, entonces sólo vuelven productos publicados de esa farmacia; un `pharmacyId` que no es uuid = 400; sin el parámetro, igual que hoy.
**DoD:** spec del controlador (+3 casos) y del servicio; OpenAPI.
**Estado:** TODO

#### H5.S1 — Query, filtro y docs

**CA:** Dado el servicio `searchProducts({ search, conceptId, pharmacyId })`, cuando `pharmacyId` viene, entonces se agrega al `where` sin cambiar el orden ni el tope.
**DoD:** specs en verde; OpenAPI.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H5.S1.M1 | `@Query('pharmacyId', new ParseUUIDPipe({ optional: true }))` + `@ApiQuery` en el controlador | 400 con valor no uuid | spec | TODO |
| H5.S1.M2 | Filtro en el servicio | Sólo esa farmacia | spec | TODO |
| H5.S1.M3 | OpenAPI regenerado | Sin diff pendiente | `yarn docs:coverage` | TODO |

### H6 — Contrato cerrado

**Prioridad:** `ALTA`

**CA:** Dado el CI de docs de la API, cuando corre sobre tu rama, entonces `postman:generate` y OpenAPI no dejan diff; `PENDIENTES-BACKEND.md` tiene la nota que cierra la brecha; el PR a `dev` está mergeable.
**DoD:** `gh pr view` sin conflictos y checks en verde (si el runner self-hosted está apagado, se declara y se pega la verificación local).
**Estado:** TODO

#### H6.S1 — PR a `dev`

**CA:** Dado el PR, cuando alguien lo abre, entonces trae `PLAN.md`, `REPORTE.md`, los specs y la nota; y el título dice qué endpoints agrega.
**DoD:** PR abierto y mergeable; fila **PUBLICADO** en el daily con el número.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H6.S1.M1 | `postman:generate` y `git diff --exit-code` sobre los artefactos generados | Sin diff | `yarn postman:generate && git diff --exit-code` | TODO |
| H6.S1.M2 | Nota en `docs/PENDIENTES-BACKEND.md`: brecha «sedes sueltas y filtro por farmacia» cerrada, con fecha y PR | Está escrita | lectura | TODO |
| H6.S1.M3 | PR a `dev` mergeable; fila en el daily | `gh pr view --json mergeable` = MERGEABLE | `gh pr view` pegado | TODO |

### H7 — Regresión y cierre

**Prioridad:** `ALTA`

**CA:** Dado el turno, cuando se cierra, entonces el front y la API están sin rojos nuevos, los PRs mergeables y el `REPORTE.md` tiene el avance en la primera línea.
**DoD:** salidas pegadas por repo; peldaño por área.
**Estado:** TODO

#### H7.S1 — Cierre honesto

**CA:** Dado cada microtarea, cuando se lee su estado, entonces es uno de los seis y las `A MEDIAS` traen las cuatro respuestas.
**DoD:** `REPORTE.md` con las tres secciones; `git status` limpio en los dos repos; nada corriendo.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H7.S1.M1 | Regresión front: `typecheck`, `lint`, `test` de `core/data-access/pharmacy` y `core/mock` | Sin rojos nuevos | comandos pegados | TODO |
| H7.S1.M2 | Regresión API: `yarn typecheck`, `yarn lint --max-warnings=0`, `yarn test src/modules/pharmacy` | Sin rojos nuevos | comandos pegados | TODO |
| H7.S1.M3 | `REPORTE.md` y dailies al día; `git status` limpio en los dos; nada corriendo | Existe y cumple | `git status`; `ps` | TODO |

## 5. Ambigüedades registradas

| ID | Ambigüedad | Supuesto con el que trabajás | Quién puede resolverla | Qué bloquea |
|---|---|---|---|---|
| Q-M1 | ¿`GET /pharmacy/sites` lista sedes de **todas** las farmacias publicadas del tenant o sólo de las que tienen productos? | Todas las publicadas; `productCount` viaja y el front filtra si quiere | Justin (consumidor) | H4.S1.M3 |
| Q-M2 | ¿`distanceKm` con un decimal como `availability`, o crudo? | Un decimal, igual que `availability`, para que las dos pantallas no discrepen | Marcelo | H4.S1.M3 |
| Q-M3 | ¿El mock de `/pharmacies/:id` devuelve una sede por farmacia aunque el real pueda traer varias? | Sí: `FARMACIAS` tiene una por farmacia; se declara como límite del doble | Marcelo | H2.S1.M4 |
| Q-M4 | ¿`requiresPrescription` existe en `PharmacySitePriceDto` real? | Se verifica en H2.S1.M1 abriendo el DTO; si no está, se agrega al DTO en H4 y se declara | Marcelo | H2.S1.M1 |
| Q-M5 | El runner self-hosted del CI de la API puede estar apagado | Se corre todo local y se pega; el PR queda mergeable en cuanto el runner vuelva | Pablo | H6.S1.M3 |

## 6. Definition of Done del hito

- [ ] Todas sus microtareas en `HECHO`, o en `A MEDIAS`/`BLOQUEADO`/`DESCARTADO` **con las cuatro respuestas**.
- [ ] La salida literal del comando de cada DoD está en `evidencia/`, no parafraseada.
- [ ] Front: `lint`, `typecheck` y los specs de `core/data-access/pharmacy` y `core/mock` sin rojos **nuevos**. API: `typecheck`, `lint --max-warnings=0` y `yarn test src/modules/pharmacy` sin rojos **nuevos**.
- [ ] **H2 mergeado en `origin/mockup` y publicado en el daily en la primera hora.**
- [ ] Los campos de los tipos del front, del mock y de los DTO de la API son idénticos (diff pegado).
- [ ] Ningún precio ni farmacia inventados: todo sale de `FARMACIAS`/`productos` o de las tablas reales.
- [ ] Cero cambios en el modelo, DDL o seeds.
- [ ] Ningún spec con `skip` ni aserción borrada.
- [ ] Peldaño de evidencia declarado por área y por repo (regla 30).
- [ ] El `PLAN.md` está actualizado en el momento, no al final.

## 7. Cómo cerrás el turno

1. **Checkpoint** en cada apertura y cierre de microtarea. Prohibido encadenar más de tres operaciones
   materiales sin uno.
2. **`REPORTE.md`** con el avance en la **primera línea**: `> **AVANCE: <HECHO> / 30 — <%>.**`
3. **Las tres secciones obligatorias existen siempre.** Una vacía se escribe con «ninguna».
4. **Publicá H2 apenas esté**: Justin e Itzan arrancan con eso. Y H3.S1 (las fixtures) apenas compile.
5. **Si el CI de la API no corre** (runner apagado), no es `BLOQUEADO`: es `A MEDIAS` con la verificación local pegada.
6. **Enumerá qué quedó corriendo** y cerralo.
7. **Tu daily** es `Marcelo-Daily-Noche-2026-09-25.md`, en la carpeta de arriba.

## 8. Revisión adversarial antes de cerrar

1. ¿Hay un campo que en el front se llama de una forma y en el DTO real de otra?
2. ¿El mock de precios inventa un número que no está en `productos`?
3. ¿`lat` sin `lng` devuelve 200 en la API nueva?
4. ¿`@Get('sites')` quedó declarado después de `sites/:siteId/prices` y el router se lo come?
5. ¿Tocaste el modelo o agregaste una columna «porque hacía falta»?
6. ¿Un producto con `stock 0` aparece con precio en `/prices`?
7. ¿Levantaste el stack Docker sin pedir permiso?
8. ¿El `pharmacyId` no uuid devuelve 500 en vez de 400?
9. ¿OpenAPI quedó con diff sin commitear?
10. ¿Se declara verificado algo que sólo fue inspeccionado estáticamente?
