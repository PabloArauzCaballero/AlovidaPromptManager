# La tienda: buscador por precio y distancia, y la receta completa al carrito

> **Rol:** dueño de la tienda (home de Farmacia), del buscador y de «Dónde comprar mi receta» · **Carriles del plan:** 43 y 45 · **Fecha:** 2026-09-25 · **Turno:** noche
> **Fuente del pedido:** [`FARMACIA-ECOMMERCE-2026-09-25.md`](../../../../../docs/requisitos/FARMACIA-ECOMMERCE-2026-09-25.md) — **R1, R4, R6, R7**
> **Verificación contra el código:** [`VERIFICACION-CONTRA-CODIGO-2026-09-25.md`](../../../../../docs/verificacion/VERIFICACION-CONTRA-CODIGO-2026-09-25.md) — §1, §2, §4
> **Plan maestro:** [`PLAN-MAESTRO.md`](../../../../../docs/trabajo/2026-09-25-plan-y-reparto-farmacia-ecommerce/PLAN-MAESTRO.md) · **Plan completo:** [`planes/04-farmacia-ecommerce-2026-09-25/README.md`](../../../../../planes/04-farmacia-ecommerce-2026-09-25/README.md) §3 y §4
> **6 hitos · 11 subtareas · 41 microtareas**, todas con criterio de aceptación y Definition of Done.
>
> **Tu carril es la cara de la tienda y las dos vías de entrada.** La vía A es el buscador: por producto
> («paracetamol en Farmacia X, 12,50 Bs, a 1,2 km») y por farmacia (tiendas ordenadas por precio o
> distancia). La vía B ya está construida: `where-to-buy` ordena una receta entera por «más barato» y
> «más cerca» desde hace dos semanas — **lo único que le falta es un botón que vuelque la receta al
> carrito** en vez de armar el pedido directo. No reescribas lo que ya ordena por precio y distancia:
> dale la salida nueva.

## 0. Ficha de asignación

| Campo | Valor |
|---|---|
| `REPO` | `alovida/mantra-core-health` (frontend Angular 21). **Nada de backend en este lote** |
| `TARGET_REF` | `origin/mockup` — corte leído **`bf2c35452363ede1d367f94c4fd726b2b9a63cb1`** (2026-09-25T00:34-04, PR #660). **Reconsultalo y fijá el tuyo** en tu `PLAN.md` |
| `RAMA DE TRABAJO` | `justin/farmacia-tienda-y-receta-2026-09-25`, saliendo de `origin/mockup` **después** de que Pablo (H2) y Marcelo (H2) mergeen la Ola 0. **Nada directo sobre `mockup`, nada sin PR** |
| `ARCHIVOS RESERVADOS PARA VOS` | `src/app/features/account/pharmacy/store-front/**` (nuevo) · `src/app/features/account/pharmacy/search/**` (nuevo) · `src/app/features/account/pharmacy/prescriptions/**` (nuevo) · `src/app/features/account/medical-record/where-to-buy/**` · en `src/app/app.routes.ts` **sólo** la entrada `'my-account/pharmacy'` de `PANTALLAS_DIFERIDAS` y la entrada hija de `/prescriptions` |
| `ARCHIVOS DE OTROS — NO LOS TOQUES` | `core/data-access/pharmacy-cart/**`, `pharmacy.routes.ts`, `pharmacy.testids.ts`, `cart/**`, `shell-layout/**`, `core/navigation/**`, `pharmacy-hub/**` (**Pablo**) · `core/data-access/pharmacy/**`, `core/mock/handlers/pharmacy.handlers.ts` (**Marcelo**: le pedís fixtures y endpoints por el daily) · `features/account/pharmacy/store/**` y los e2e (**Itzan**) · `features/account/cotizaciones/**` (**nadie**: se queda como está) · `features/nearby-places/search-origin-picker/**` (**nadie**: se importa, no se mueve) · `mantra-core-health-api/**` |
| `⚠️ RIESGO ALTO DE TU CARRIL` | **Mostrar un precio que no vino de la sede.** `GET /pharmacy/products` no publica precio; sólo `availability()` lo trae, evaluado contra una sede. En el buscador cada fila con precio es una fila que pasó por `availability()`; lo demás dice «Precio no publicado». Y **ordenar por distancia sin origen** no ordena nada: se dice y se ofrece elegir origen |
| `LA MAQUETA NO TIENE BACKEND` | `mockBackend: true` fijo. Los manejadores de farmacia son de Marcelo; `GET /pharmacy/sites` y el filtro `pharmacyId` ya existen en el mock (PR #659). Un dato que te falte se pide, no se inventa |
| `CUENTA DE PRUEBA` | `paciente@alovida.mock` (cualquier contraseña no vacía). **Sintética declarada.** Tiene recetas en su historia clínica (resumen clínico del mock) |
| `DÓNDE SE PRUEBA` | `/my-account/pharmacy` (tu home reemplaza al hub), `/my-account/pharmacy/prescriptions` (tuya), `/my-account/medical-record/where-to-buy/:requestId` (tuya, existe), `/my-account/pharmacy/cart` (Pablo), `/my-account/pharmacy/stores/:pharmacyId` (Itzan). **Sacá las URLs del router, no las supongas** |
| `LÍMITE DE RECURSOS` | Regla 70: un `yarn start`, un build, un navegador, Playwright `--workers=1` |

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

⚠️ **Antes de `cp -r`, mirá qué hay:** el repo de producto **ya tiene** su propio `.claude/`. Si ibas a
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

Son **23**: 11 del proceso y 12 propias de la tienda y la receta.

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
| `search-and-filtering` | **la más importante**: un término, dos modos (producto / farmacia), dos órdenes (precio / distancia), normalización, y qué pasa sin término |
| `maps-geolocation` | origen elegible (casa / trabajo / ubicación), distancia Haversine que calcula la API, radio y «sin origen» |
| `quotations-billing` | qué es un precio con procedencia; «no publicado» es respuesta válida; dinero como texto |
| `seed-data-catalogs` | de dónde sale cada precio y cada farmacia del mock; nada inventado |
| `medication-prescription-safety` | qué medicamento exige receta y por qué no entra al carrito libre; la receta como llave |
| `frontend-ux-states` | los cuatro estados por modo, «escribí qué buscás», «sin origen», «sin recetas» |
| `frontend-data-access` | componer `searchProducts` + `availability` como ya lo hace `CotizacionesFuentes`, sin tocarla |
| `frontend-forms-ux` | un buscador que no dispara dos veces; selector de modo y orden como `SegmentedControl` |
| `frontend-performance` | una consulta por término, no una por fila; `switchMap` sobre el término |
| `angular-testing` | `HttpTestingController` para el servicio de búsqueda; el spec de `where-to-buy` se amplía, no se reescribe |
| `unit-testing` | un comportamiento por test; funciones de orden puras y exportadas |
| `visual-proof` | la captura no vale si no la mirás |

Entrá siempre por `skills-router`: **no leas el catálogo entero, no sirve.**

### 1.4 DoD de esta sección — se verifica como cualquier otra

- [ ] `ls .claude/skills | wc -l` devolvió **179**, y la salida está pegada en tu daily.
- [ ] `python .claude/hooks/plan_gate.py --self-test` devolvió **11 PASS, 0 FAIL**, salida pegada.
- [ ] Leíste `skills-router` y las 23 skills de las dos tablas, **empezando por `search-and-filtering`**.
- [ ] Creaste tu `PLAN.md` **antes** del primer `Edit`/`Write` de código.

**Sin estas cuatro casillas, tu lote arranca en `BLOQUEADO`, no en `EN CURSO`.**

> ### ✅ Hechos ya verificados contra el corte — no los repitas, pero tampoco los creas sin abrir el archivo
>
> - **La vía B ya existe:** `features/account/medical-record/where-to-buy/where-to-buy.ts` (1 032 líneas): `OrdenDeSedes = 'receta-completa' | 'mas-cerca' | 'mas-barato'` (l. 98–108), mapa Leaflet, promociones, `enviarPedido(sede)` (l. 635) que llama `prepararBorrador(borradorDePedido(...))` y navega a `/my-account/pharmacy-orders/new`. `borradorDePedido()` (l. 837) está **exportada** y es pura: la reusás para armar las líneas del carrito.
> - **Las recetas salen del resumen clínico:** `ClinicalClient.getSummary(patientProfileId)` → `GET /clinical/patients/:id/summary` → `medicationRequests[]` (`clinical.types.ts:54`: `id`, `medicationConceptId`, `statusConceptId`, `encounterId`, `validFrom/To`). La historia (`medical-record.html:199`) ya enlaza `['where-to-buy', receta.id]`.
> - **El precio sólo lo da `availability()`:** `PharmacyProduct` (`pharmacy.types.ts:46-59`) no tiene precio; `AvailabilitySite.products[].price` (`:78-99`) sí, más `distanceKm` por sede. `CotizacionesFuentes.medicamentos()` (`cotizaciones.fuentes.ts:149`) ya compone las dos llamadas: leelo, no lo importes ni lo toques.
> - **El selector de origen es reusable:** `features/nearby-places/search-origin-picker/` (`SearchOrigin {source, lat, lng}`) + `saved-places.ts` (`savedPlacesOf`, casa/trabajo del perfil). Cotizaciones lo usa así (`cotizaciones.ts:139-152`).
> - **Los mocks que necesitás ya responden:** `GET /pharmacy/sites?search&lat&lng` y `GET /pharmacy/products?pharmacyId` (`pharmacy.handlers.ts`, PR #659). `getSitePrices` y `getPharmacy` los agrega Marcelo en la Ola 0.
> - **El hub actual** (`pharmacy-hub.ts`) lee `?tab=cotizaciones|comprar`. Tu home los redirige; Pablo borra el hub en la Ola 3.

## 2. Resultado observable

| Hito | Prioridad | Qué queda demostrado |
|---|---|---|
| **H1** | `BLOQUEANTE` | Corte declarado (después de la Ola 0) y baseline con rojos previos clasificados. |
| **H2** | `ALTA` | Existe `PharmacySearchService`: buscar un término devuelve filas por producto con precio y distancia reales, ordenables por «más barato» y «más cerca», y farmacias con «desde X Bs»; sin origen, «más cerca» lo dice. |
| **H3** | `ALTA` | `/my-account/pharmacy` es la tienda: buscador, modo Productos · Farmacias, orden, origen, «Buscar toda una receta», «Mis pedidos» y «Tus últimos pedidos»; agregar desde un resultado sube el badge de Pablo; `?tab=` viejos redirigen. |
| **H4** | `ALTA` | `/my-account/pharmacy/prescriptions` lista las recetas vigentes del paciente y cada una lleva a `where-to-buy/:requestId`. |
| **H5** | `ALTA` | En `where-to-buy`, cada sede tiene «Agregar la receta al carrito»; el carrito resultante lleva `requestId` y el pedido final lleva `medicationRequestId`. |
| **H6** | `ALTA` | Regresión en verde y `REPORTE.md` escrito. |

> ⚠️ **Orden: H1 → H2 → H3.S1 → H3.S2 → H3.S5 (la ruta) → H4 → H5 → H3.S3/S4 → H6.** Una tienda con
> buscador por producto y la receta entrando al carrito valen más que «Tus últimos pedidos». Lo que no se
> cierra queda `A MEDIAS` con las cuatro respuestas.

**Kill-test del turno completo:** entrá como `paciente@alovida.mock`, abrí `/my-account/pharmacy`: si ves
pestañas, H3 no está hecho. Buscá «paracetamol» en modo Productos y ordená por «Más barato»: si la primera
fila no tiene el precio más bajo, o alguna fila tiene un precio que `availability()` no devolvió, H2 no está
hecho. Elegí «tu casa» como origen y ordená por «Más cerca»: si la primera distancia no es la menor, H2 no
está hecho. Tocá «Agregar» en una fila: si el ícono de Pablo no sube a 1, H3.S2 no está hecho. Tocá «Buscar
toda una receta», elegí una y en la sede de arriba tocá «Agregar la receta al carrito»: si el carrito no tiene
los medicamentos de la receta, H5 no está hecho. Y si en cualquier lugar ves un precio de una tomografía o de
una consulta, **te metiste en Cotizaciones y está mal hecho**.

## 3. Alcance

**IN:** baseline · `PharmacySearchService` con los dos modos y los dos órdenes · la home de la tienda con
buscador, modo, orden, origen, botón de receta, enlace y bloque de últimos pedidos · resultados por producto
con «Agregar» y «Ver tienda» · resultados por farmacia con «Entrar» · la ruta `my-account/pharmacy` apuntando
a la home y las redirecciones de `?tab=` · la pantalla de elegir receta · el botón «Agregar la receta al
carrito» en `where-to-buy` · specs · capturas por viewport y tema · `PLAN.md`, `REPORTE.md` y `evidencia/`.

**OUT:** **cualquier archivo fuera de los reservados de la ficha** · el `CartStore`, la pantalla `/cart`, la
cabecera y el registro (**Pablo**): si `add()` devuelve algo raro, se lo decís · el cliente y los mocks
(**Marcelo**): fixtures y endpoints se piden · la página de farmacia y sus e2e (**Itzan**) ·
`features/account/cotizaciones/**`: **no se toca, ni para «reusar» su servicio** — se lee y se compone
igual en tu servicio · mover `search-origin-picker/` · **un precio que no vino de `availability()`** ·
convertir monedas · **inventar una receta o un medicamento**: sólo lo que devuelve el resumen clínico ·
subir archivos de recetas externas · debilitar un spec para que pase · declarar `HECHO` una microtarea cuyo
DoD no corriste.

## 4. Plan — hitos, subtareas y microtareas

Los seis estados permitidos son exactamente: `TODO`, `EN CURSO`, `HECHO`, `A MEDIAS`, `BLOQUEADO` y
`DESCARTADO`. **`A MEDIAS` es legítimo; disfrazarlo de `HECHO` no.**

### H1 — Corte y baseline

**Prioridad:** `BLOQUEANTE`

**CA:** Dado tu entorno, cuando alguien pregunta contra qué versión trabajaste y qué estaba en rojo antes, entonces hay SHA (posterior a la Ola 0), salidas y una tabla de rojos previos clasificados.
**DoD:** salidas con exit code en `evidencia/antes/`; rojos previos clasificados en `PLAN.md`.
**Estado:** TODO

#### H1.S1 — Corte, rama y baseline

**CA:** Dado un rojo posterior, cuando alguien pregunta si lo rompiste vos, entonces la respuesta sale de un archivo.
**DoD:** `lint`, `typecheck` y `test` con su código de salida, pegados; rojos previos clasificados.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H1.S1.M1 | Esperar a que la Ola 0 (Pablo H2, Marcelo H2) esté **PUBLICADO** en el daily; fijar corte y rama desde ese `origin/mockup` | Hay SHA posterior a los dos merges | `git fetch origin && git log origin/mockup --oneline -5` muestra los dos PR | TODO |
| H1.S1.M2 | Baseline de `lint`, `typecheck` y `test` | Hay salidas y exit codes | `corepack yarn lint; corepack yarn typecheck; corepack yarn test --watch=false` → `evidencia/antes/` | TODO |
| H1.S1.M3 | Clasificar cada rojo previo | Cada uno con su clase | tabla en `PLAN.md` | TODO |

### H2 — El servicio de búsqueda

**Prioridad:** `ALTA`

**CA:** Dado un término y un origen, cuando se busca en modo Productos, entonces cada fila trae `productId, name, presentation, pharmacyId, pharmacyName, siteId, siteName, unitAmount, currency, distanceKm, requiresPrescription, medicationConceptId`, ordenadas por precio (sin precio al final) o por distancia (sin origen: aviso, sin reordenar); en modo Farmacias, cada sede trae `distanceKm` y, con término, `fromAmount`.
**DoD:** `pharmacy-search.service.spec.ts` ≥ 8 casos con `HttpTestingController`; funciones de orden puras exportadas y probadas.
**Estado:** TODO

#### H2.S1 — `PharmacySearchService`

**CA:** Dado «paracetamol» y dos sedes con 10,00 y 8,00, cuando se ordena por precio, entonces 8,00 va primero; dado sin origen y orden por distancia, entonces el resultado conserva el orden de la API y `sinOrigen === true`.
**DoD:** spec en verde; ninguna fila con precio sin haber pasado por `availability()`.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H2.S1.M1 | `features/account/pharmacy/search/pharmacy-search.types.ts`: `ProductHit`, `StoreHit`, `SearchMode = 'products' \| 'stores'`, `SearchSort = 'price' \| 'distance'`, `SearchResult<T> { items; sinOrigen: boolean }` | Compila con esos nombres | `corepack yarn typecheck` | TODO |
| H2.S1.M2 | `pharmacy-search.service.ts`: `searchProducts(term, origin, sort)` = `PharmacyClient.searchProducts({search})` → `availability({productIds, origin})` → una fila por `(productId, siteId)` con precio y distancia | Para 2 productos × 2 sedes salen 4 filas con precio | spec (`HttpTestingController`) | TODO |
| H2.S1.M3 | `searchStores(term, origin, sort)` = `nearbySites({search, origin})`; con término, `availability()` de los productos que matchean para `fromAmount` por sede | Con «paracetamol», cada sede que lo tiene trae «desde» | spec | TODO |
| H2.S1.M4 | Funciones puras exportadas: `sortByPrice(rows)` (sin precio al final), `sortByDistance(rows)` (sin distancia al final), `normalizeTerm` | 3 casos cada una | spec | TODO |
| H2.S1.M5 | Sin origen y orden `distance`: no reordena, `sinOrigen = true` | El spec lo fija | spec | TODO |
| H2.S1.M6 | Término de menos de 2 letras: no consulta | `HttpTestingController.expectNone` | spec | TODO |

### H3 — La home de la tienda

**Prioridad:** `ALTA`

**CA:** Dado `/my-account/pharmacy`, cuando entra el paciente, entonces ve una tarjeta a lo ancho con `SearchField`, `SegmentedControl` Productos · Farmacias, `SegmentedControl` Más barato · Más cerca, `SearchOriginPicker`, el botón «Buscar toda una receta», el enlace «Mis pedidos» y «Tus últimos pedidos»; sin pestañas; y los resultados del modo elegido con sus cuatro estados.
**DoD:** specs de home, resultados por producto, resultados por farmacia y últimos pedidos (≥ 22 casos en total); capturas 375 · 768 · 1440 claro + 1440 oscuro; `?tab=cotizaciones` → `/my-account/cotizaciones`, `?tab=comprar` → la home sin query.
**Estado:** TODO

#### H3.S1 — La pantalla

**CA:** Dado cambiar modo, orden u origen, cuando se hace, entonces se recalcula sin recargar; sin término en Productos hay S3 «Escribí qué buscás»; sin término en Farmacias se lista por distancia (con origen) o por nombre.
**DoD:** `store-front.spec.ts` ≥ 8 casos.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H3.S1.M1 | `store-front.{ts,html,css}` con `PageHeader` «Farmacia» y la tarjeta a lo ancho (regla §6 del `CLAUDE.md` del front) | Se pinta sin pestañas | spec | TODO |
| H3.S1.M2 | Buscador (`pharmacy-search-term`), modo (`pharmacy-search-mode`), orden (`pharmacy-search-sort`), origen (`pharmacy-search-origin` con `SearchOriginPicker` + `savedPlacesOf`) como signals que alimentan el servicio | Cambiar cualquiera recalcula | spec | TODO |
| H3.S1.M3 | Botón secundario «Buscar toda una receta» → `PHARMACY_PRESCRIPTIONS_ROUTE` (`pharmacy-prescription-button`) y enlace «Mis pedidos» → `MIS_PEDIDOS_ROUTE` | Los dos enlaces existen con esas rutas | spec | TODO |
| H3.S1.M4 | Estados: S3 sin término (Productos), lista completa sin término (Farmacias), loading, empty de búsqueda, error con reintento, «sin origen» al ordenar por distancia (alert con el picker) | Los seis visibles | spec | TODO |
| H3.S1.M5 | Sin perfil de paciente: aviso, sin consultas | `expectNone` | spec | TODO |
| H3.S1.M6 | Capturas 375 · 768 · 1440 claro + 1440 oscuro con resultados | Cuatro capturas miradas | `evidencia/h3/capturas/` | TODO |

#### H3.S2 — Resultados por producto

**CA:** Dado una fila, cuando se toca «Agregar», entonces `CartStore.add()` suma y el badge de Pablo sube; con `conflict`, aparece `DialogService.confirm()` y cancelar no cambia nada; con receta obligatoria no hay botón sino insignia y enlace a `/prescriptions`; «Ver tienda» va a `pharmacyStoreRoute(pharmacyId, siteId)`.
**DoD:** `product-results.spec.ts` ≥ 6 casos.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H3.S2.M1 | `search/product-results.{ts,html,css}`: fila = nombre + presentación · farmacia/sede · precio o «Precio no publicado» · distancia o «Elegí desde dónde medir» · acciones | Se pintan las 4 partes | spec | TODO |
| H3.S2.M2 | «Agregar» (`pharmacy-result-add`) → `CartStore.add(site, line)`; `conflict` → confirm «Vaciar y cambiar de farmacia» → `replaceWith` | Agregar suma; cancelar no cambia | spec (3 casos) | TODO |
| H3.S2.M3 | `requiresPrescription` → insignia «Requiere receta» + enlace a `PHARMACY_PRESCRIPTIONS_ROUTE`, sin «Agregar» | No hay botón en esa fila | spec | TODO |
| H3.S2.M4 | «Ver tienda» (`pharmacy-result-store`) | `href` correcto | spec | TODO |

#### H3.S3 — Resultados por farmacia

**CA:** Dado el modo Farmacias, cuando hay origen, entonces las tarjetas salen por distancia; con término, muestran «desde X Bs»; «Entrar» va a la tienda de Itzan.
**DoD:** `store-results.spec.ts` ≥ 4 casos.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H3.S3.M1 | `search/store-results.{ts,html,css}`: tarjeta = farmacia · sede · dirección · distancia · «desde X Bs» (sólo con término) · «Entrar» | Se pinta | spec | TODO |
| H3.S3.M2 | Orden respeta `sort`; sin origen y `distance` → alert | El spec lo fija | spec | TODO |
| H3.S3.M3 | Farmacias con `productCount === 0` no se listan | Filtradas | spec | TODO |

#### H3.S4 — Tus últimos pedidos

**CA:** Dado un paciente con pedidos, cuando entra a la tienda, entonces ve 3 filas (farmacia, fecha, estado en palabras) y «Ver todos»; sin pedidos, una línea; sin perfil, nada.
**DoD:** `recent-orders.spec.ts` ≥ 3 casos.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H3.S4.M1 | `store-front/recent-orders.{ts,html,spec.ts}` con `PharmacyOrdersClient.misPedidos()` y `pedido-status.ts` | 3 filas máximo | spec | TODO |
| H3.S4.M2 | Vacío = una línea con enlace a la tienda; sin perfil = no consulta | `expectNone` | spec | TODO |

#### H3.S5 — La ruta y las redirecciones heredadas

**CA:** Dado `app.routes.ts`, cuando se abre `/my-account/pharmacy`, entonces carga `StoreFront`; `?tab=cotizaciones` termina en `/my-account/cotizaciones` y `?tab=comprar` en la home sin query.
**DoD:** spec de las dos redirecciones; `corepack yarn build` exit 0; **PUBLICADO** en el daily (Pablo lo espera para H7).
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H3.S5.M1 | `'my-account/pharmacy': () => import('./features/account/pharmacy/store-front/store-front').then(m => m.StoreFront)` en `PANTALLAS_DIFERIDAS` | La ruta abre la home | `corepack yarn build` | TODO |
| H3.S5.M2 | Redirecciones de `?tab=` en `StoreFront` (`replaceUrl`) | Las dos redirigen | spec (2 casos) | TODO |
| H3.S5.M3 | Fila **PUBLICADO** en §4-bis del daily de equipo | Pablo puede leerla | lectura | TODO |

### H4 — Elegir receta

**Prioridad:** `ALTA`

**CA:** Dado `/my-account/pharmacy/prescriptions`, cuando entra el paciente, entonces ve una tarjeta por receta vigente (fecha, N medicamentos con nombre, médico si viene) con «Buscar dónde comprarla» → `where-to-buy/:requestId`; sin recetas, S3 «Ir a mi historia clínica»; sin perfil, aviso.
**DoD:** `prescriptions-page.spec.ts` ≥ 6 casos; capturas 375/1440.
**Estado:** TODO

#### H4.S1 — La pantalla

**CA:** Dado el resumen clínico, cuando se agrupa por `encounterId` (misma lectura y tope 50 que la historia), entonces cada receta muestra sus medicamentos con nombre resuelto por `TerminologyClient` como lo hace `where-to-buy`.
**DoD:** spec con `HttpTestingController`; entrada hija en `app.routes.ts`.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H4.S1.M1 | `prescriptions/prescriptions-page.{ts,html,css}` con `ClinicalClient.getSummary(patientProfileId, 50)` y agrupación por `encounterId` | Una tarjeta por receta | spec | TODO |
| H4.S1.M2 | Nombres de medicamento con `TerminologyClient` (mismo camino que `where-to-buy.ts` l. 420–440) | Se ve el nombre, no el uuid | spec | TODO |
| H4.S1.M3 | «Buscar dónde comprarla» (`pharmacy-prescription-search`) → `/my-account/medical-record/where-to-buy/<id>` | `href` con el id | spec | TODO |
| H4.S1.M4 | Estados: loading, S3 sin recetas con acción a `MI_HISTORIA_ROUTE`, error con reintento, sin perfil | Los cuatro | spec | TODO |
| H4.S1.M5 | Entrada hija `my-account/pharmacy/prescriptions` en `app.routes.ts`; capturas 375/1440 | La ruta abre; dos capturas miradas | `corepack yarn build`; `evidencia/h4/capturas/` | TODO |

### H5 — La receta entra al carrito

**Prioridad:** `ALTA`

**CA:** Dado `where-to-buy/:requestId` con una sede evaluada, cuando se toca «Agregar la receta al carrito», entonces el carrito queda con las líneas disponibles de esa sede y `requestId`; las sin producto se listan como «no se pudieron agregar»; si había carrito de otra sede, se confirma; después navega a `/my-account/pharmacy/cart`. «Pedir» sigue igual.
**DoD:** `where-to-buy.spec.ts` ampliado (los casos actuales intactos) + caso en `cart.store.spec.ts` acordado con Pablo: `toDraft` con `requestId` → `createOrderRequest` incluye `medicationRequestId`.
**Estado:** TODO

#### H5.S1 — El botón en `where-to-buy`

**CA:** Dado `borradorDePedido(requestId, sitio, consultables, sinProducto)`, cuando se convierte a `CartLine[]`, entonces sólo entran las líneas con `productId !== null` y `disponible === true`, con su precio y presentación.
**DoD:** spec ≥ 4 casos nuevos.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H5.S1.M1 | Función pura exportada `cartLinesFromDraft(borrador): { lines: CartLine[]; omitted: string[] }` en `where-to-buy.ts` | Omite sin producto y sin stock | spec (2 casos) | TODO |
| H5.S1.M2 | Botón `where-to-buy-add-to-cart` por sede, junto a «Pedir»: `CartStore.replaceWith(site, lines, requestId)`; con carrito de otra sede, `DialogService.confirm()` | Cancelar no cambia; confirmar reemplaza | spec (2 casos) | TODO |
| H5.S1.M3 | Aviso «N medicamentos no se pudieron agregar» cuando `omitted.length > 0`; luego navegar a `PHARMACY_CART_ROUTE` | El aviso y la navegación | spec | TODO |
| H5.S1.M4 | Los casos existentes de `where-to-buy.spec.ts` siguen en verde sin cambios | Mismo conteo que el baseline | `npx ng test --include='src/app/features/account/medical-record/where-to-buy/*.spec.ts' --watch=false` | TODO |

#### H5.S2 — El pedido lleva la receta

**CA:** Dado un carrito con `requestId`, cuando se continúa y se envía, entonces el `POST /pharmacy/orders` incluye `medicationRequestId`.
**DoD:** caso en `cart.store.spec.ts` (coordinado con Pablo, archivo suyo: se lo pedís por el daily) o, si no llega, en tu spec contra `createOrderRequest(toDraft(...))`.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H5.S2.M1 | Spec: `createOrderRequest({ borrador: store.toDraft(site), modalidad: 'RETIRO', direccionDeEntrega: null }, key).medicationRequestId === requestId` | En verde | `npx ng test --include=<tu spec> --watch=false` | TODO |
| H5.S2.M2 | Recorrido manual: receta → carrito → continuar → la revisión muestra la receta; captura | Mirada | `evidencia/h5/capturas/` | TODO |

### H6 — Regresión y cierre

**Prioridad:** `ALTA`

**CA:** Dado el turno, cuando se cierra, entonces `typecheck`, `lint`, `build` y `test` sin rojos nuevos, PRs mergeables y `REPORTE.md` con el avance en la primera línea.
**DoD:** salidas pegadas; peldaño por área.
**Estado:** TODO

#### H6.S1 — Cierre honesto

**CA:** Dado cada microtarea, cuando se lee su estado, entonces es uno de los seis y las `A MEDIAS` traen las cuatro respuestas.
**DoD:** `REPORTE.md` con las tres secciones; `git status` limpio; nada corriendo.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H6.S1.M1 | Regresión completa + los e2e existentes de tu área en verde | Sin rojos nuevos | `corepack yarn typecheck && corepack yarn lint && corepack yarn build && corepack yarn test --watch=false`; `E2E_BASE_URL=http://localhost:4200 npx playwright test playwright/carril-e3-donde-comprar-receta.spec.ts playwright/cotizaciones-paciente.spec.ts --workers=1` | TODO |
| H6.S1.M2 | PRs a `mockup` mergeables | `gh pr view` sin conflictos | `gh pr view --json mergeable,mergeStateStatus` | TODO |
| H6.S1.M3 | `REPORTE.md` y dailies al día; nada corriendo | Existe y cumple | `git status`; `ps` | TODO |

## 5. Ambigüedades registradas

| ID | Ambigüedad | Supuesto con el que trabajás | Quién puede resolverla | Qué bloquea |
|---|---|---|---|---|
| Q-J1 | En modo Farmacias sin término, ¿qué significa «ordenar por precio»? | Nada: sin término se ordena por distancia (con origen) o por nombre; el orden por precio aplica al «desde X» del producto buscado | Justin (propietario) | H3.S3.M2 |
| Q-J2 | ¿Se muestran farmacias sin productos publicados? | No (`productCount > 0`) | Justin | H3.S3.M3 |
| Q-J3 | ¿La receta al carrito lleva sólo lo disponible en esa sede o también lo faltante? | Sólo lo disponible; lo faltante se avisa por nombre | Justin + Pablo | H5.S1.M3 |
| Q-J4 | ¿`recetas vigentes` = `validTo` en el futuro o cualquier `statusConceptId`? | Mismo criterio que la historia clínica (`medical-record.ts`): se lee y se calca | Justin | H4.S1.M1 |
| Q-J5 | El caso de `medicationRequestId` vive en `cart.store.spec.ts` (Pablo) | Se pide por el daily; si no llega, el spec va en tu carpeta contra `createOrderRequest` | Pablo | H5.S2.M1 |

## 6. Definition of Done del hito

- [ ] Todas sus microtareas en `HECHO`, o en `A MEDIAS`/`BLOQUEADO`/`DESCARTADO` **con las cuatro respuestas**.
- [ ] La salida literal del comando de cada DoD está en `evidencia/`, no parafraseada.
- [ ] `corepack yarn lint`, `typecheck`, `build` y `test --watch=false` sin rojos **nuevos** respecto del baseline.
- [ ] **Ningún precio sin `availability()` detrás**; ninguna moneda convertida.
- [ ] Los estados de cada modo (S3 sin término, loading, empty, error, sin origen, sin perfil) existen y son accionables.
- [ ] `features/account/cotizaciones/**` sin un solo cambio (`git diff --stat origin/mockup -- src/app/features/account/cotizaciones` vacío).
- [ ] Los casos existentes de `where-to-buy.spec.ts` intactos y en verde.
- [ ] Capturas por viewport y tema, **miradas**, con una línea cada una.
- [ ] Peldaño de evidencia declarado por área (regla 30).
- [ ] Sin datos de personas: sólo `paciente@alovida.mock`.
- [ ] El `PLAN.md` está actualizado en el momento, no al final.

## 7. Cómo cerrás el turno

1. **Checkpoint** en cada apertura y cierre de microtarea. Prohibido encadenar más de tres operaciones
   materiales sin uno.
2. **`REPORTE.md`** con el avance en la **primera línea**: `> **AVANCE: <HECHO> / 41 — <%>.**`
3. **Las tres secciones obligatorias existen siempre.** Una vacía se escribe con «ninguna».
4. **Lo que dependa de Marcelo** (fixtures, `getSitePrices`) o de Pablo (`CartStore`) no cierra como
   `BLOQUEADO` sin haber simulado los tres niveles de su contrato (regla 65): el contrato está en el plan §4.
5. **Publicá H3.S5 apenas esté**: Pablo borra el hub con eso.
6. **Enumerá qué quedó corriendo** y cerralo.
7. **Tu daily** es `Justin-Daily-Noche-2026-09-25.md`, en la carpeta de arriba.

## 8. Revisión adversarial antes de cerrar

1. ¿Hay una fila con precio que no pasó por `availability()`?
2. ¿Ordenar por distancia sin origen reordena algo o inventa distancias?
3. ¿«Agregar» mete un producto con receta obligatoria al carrito libre?
4. ¿Tocaste `cotizaciones.fuentes.ts` «para reusar»?
5. ¿La home sigue mostrando pestañas en algún viewport?
6. ¿`?tab=cotizaciones` cae en la tienda en vez de en Cotizaciones?
7. ¿La receta al carrito mete líneas sin `productId` y después `createOrderRequest` explota con `UnsupportedPharmacyOrderLineError`?
8. ¿«Pedir» de `where-to-buy` cambió de comportamiento?
9. ¿Un spec existente de `where-to-buy` se reescribió en vez de ampliarse?
10. ¿Se declara verificado algo que sólo fue inspeccionado estáticamente?
