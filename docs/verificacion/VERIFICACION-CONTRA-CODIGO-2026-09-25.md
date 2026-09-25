# Verificación contra el código real — Farmacia como ecommerce, 2026-09-25

> **Para qué existe.** Los ocho requisitos de
> [`FARMACIA-ECOMMERCE-2026-09-25.md`](../requisitos/FARMACIA-ECOMMERCE-2026-09-25.md) hablan de una
> tienda, un carrito y un buscador; este documento los cruza contra el código **abriendo los archivos**, en
> los dos repos, para que ningún prompt mande a alguien a buscar por su cuenta pudiendo decirle dónde está —
> y para que lo que ya existe (el pedido de punta a punta, «Dónde comprar mi receta», el selector de origen)
> se cite y no se rehaga.
>
> **Peldaño de evidencia de este documento: `DISCOVERED` (regla 30).** Todo lo de acá es lectura de
> archivos en los cortes declarados, con `git log`, `grep` y `sed` sobre `origin/mockup` y `origin/dev`.
> Lo único que se ejecutó fue lo que dejó el PR #659 (typecheck, lint y 260 specs de farmacia en verde, y
> `curl` contra el VPS para confirmar que sirve `["Mis pedidos","Cotizaciones","Comprar"]`). Que un
> símbolo exista no prueba que la pantalla se comporte como su comentario promete.

## 0. Los cortes — leer esto antes que nada

| Qué | Valor |
|---|---|
| Repo del frontend | `alovida/mantra-core-health` |
| Rama que corresponde a la maqueta | **`origin/mockup`** |
| Corte leído | **`bf2c35452363ede1d367f94c4fd726b2b9a63cb1`** — «Merge pull request #660 from mdavila-2001/justin/citas-toggle-tus-citas», `2026-09-25 00:34:22 -0400`. Incluye #658 (hub Farmacia) y #659 (pestaña Comprar) |
| Repo del backend | `alovida/mantra-core-health-api`, ref **`origin/dev`** = **`343795cc2d08745692f491c50e81427215043315`** — «Merge pull request #459 from mdavila-2001/marcelo/feat-practitioner-settlement-batches-api», `2026-09-25 00:30:04 -0400` |
| Comando | `git fetch origin mockup && git log -1 --format='%H %ad %s' --date=iso origin/mockup` (y `origin/dev` en la API) |

> ### ⚠️ Tres trampas del corte
>
> 1. **La copia de trabajo local no es la maqueta.** En la Mac hay más de sesenta worktrees del front; los
>    números de línea de acá son de `origin/mockup` al corte. Cada persona **reconsulta y declara** el suyo.
> 2. **El VPS ya sirve el corte** (`alovida-autodeploy.sh --estado`: `1b6c5d67` desplegado a las 00:21, y
>    #660 después). Lo que el propietario vio con dos pestañas era caché del navegador: el chunk servido
>    (`chunk-QXETYSHA.js`) contiene la tercera. No es un bug a corregir; es que el diseño de pestañas está
>    descartado.
> 3. **`main` del prompt manager está protegido** con el check «Espejo sin deriva y candados en verde» (CI
>    `estandar.yml`): corre `check_reparto.py` sobre **todas** las fechas de `repartos/` y
>    `check_skills_citadas.py`. Un reparto que no pasa esos dos no entra.

## 1. Lo que ya existe y se reusa tal cual (R1, R6)

| Pieza | Dónde (front) | Qué hace hoy | Para quién |
|---|---|---|---|
| **Pedido de punta a punta** | `src/app/core/data-access/pharmacy-orders/pharmacy-orders.client.ts:41-66` — `draft = signal<BorradorDePedido \| null>`, `prepararBorrador()` (l. 48), `descartarBorrador()` (l. 52), `enviar()` (l. 56) = `POST /pharmacy/orders` | El carrito termina acá. Con `requestId: ''` el adaptador omite `medicationRequestId`: `pharmacy-orders.adapter.ts:116` `...(order.borrador.requestId === '' ? {} : { medicationRequestId })`. Líneas con `productId === null` lanzan `UnsupportedPharmacyOrderLineError` (l. 111, 120) | Pablo (`toDraft`), Justin (receta) |
| **Forma del borrador y de la línea** | `pharmacy-orders.types.ts:46-70` (`LineaDePedido`: `productId`, `conceptId?`, `medicamento`, `presentacion`, `cantidad`, `precio`, `moneda`, `disponible`) y `:205-219` (`BorradorDePedido`: `requestId`, `siteId`, `pharmacyId`, `farmacia`, `sede`, `direccion`, `lineas`, `totalEstimado`, `moneda`) | La forma que `CartStore.toDraft()` tiene que producir | Pablo |
| **Revisión del pedido** | `features/account/pharmacy-orders/new-order/new-order.ts` (530 l.): lee `borradorPreparado()`, `fuenteDeEjemplo(borrador)` genérica sobre las líneas (l. 424), cantidades ±, alternativas, `RUTA_DEL_CHECKOUT` (`new-order.handoff.ts:37`) | No se toca. Recibe cualquier borrador, venga de receta o de carrito | todos |
| **«Dónde comprar mi receta» = la vía B** | `features/account/medical-record/where-to-buy/where-to-buy.ts` (1 032 l.) + `.html` (333 l.): ruta `my-account/medical-record/where-to-buy/:requestId` (`app.routes.ts:428`); `OrdenDeSedes = 'receta-completa' \| 'mas-cerca' \| 'mas-barato'` (l. 98-108); `enviarPedido(sede)` (l. 635-645) → `prepararBorrador(borradorDePedido(...))` → navega a `/my-account/pharmacy-orders/new`; **`borradorDePedido()` exportada y pura** (l. 837-878); mapa `app-map`, promociones (`campaigns.sembrarPara`, l. 617) | Ya ordena una receta entera por precio y distancia. Le falta un botón que vuelque al carrito | Justin |
| **De dónde salen las recetas** | `core/data-access/clinical/clinical.client.ts:105` `getSummary(patientProfileId, limit)` → `GET /clinical/patients/:id/summary` → `medicationRequests[]`; tipo en `clinical.types.ts:54-79` (`id`, `medicationConceptId`, `statusConceptId`, `encounterId?`, `validFrom?`, `validTo?`); la historia enlaza `['where-to-buy', receta.id]` en `medical-record.html:199` | Es la única fuente de recetas. La API real sólo expone `GET clinical/prescriptions/:id/pdf` (`clinical-prescriptions.controller.ts:47`) además del resumen | Justin |
| **Selector de origen** | `features/nearby-places/search-origin-picker/` (`SearchOrigin { source: 'home' \| 'work' \| 'current'; lat; lng }`); `core/data-access/profiles/saved-places.ts` (`savedPlacesOf`, `NO_SAVED_PLACES`); uso en `cotizaciones.ts:139-152` y `where-to-buy.ts:660-669` | **Vive dentro de `nearby-places/`**: al borrar la pantalla, el picker se queda | Justin, Itzan (lo importan); Pablo (no lo borra) |
| **Promociones por farmacia** | `core/data-access/pharmacy-campaigns/pharmacy-campaigns.client.ts:144` `campanasVigentes(pharmacyId)`; `:210` `campanasDeFarmacia(pharmacyId)`; dinero en `pharmacy-campaigns.money.ts` (`aCentavos`, `aTexto`, `totalDeRenglones`) | Para la cabecera de la página de farmacia y para sumar el total del carrito en centavos | Itzan, Pablo |
| **Patrón ±** | `features/account/pharmacy-orders/new-order/new-order.html:148-186`: `role="group"` + `aria-label`, dos `app-button variant="outline" size="sm"`, valor con `aria-live="polite"` | Se calca en catálogo y carrito | Itzan, Pablo |
| **Diálogo de confirmación** | `shared/components/molecules/dialog/dialog-service.ts` — `DialogService.confirm()` devuelve `Promise<boolean>`; `confirmarCambios()`/`confirmarDescarte()` (reparto del 22/09) | Conflicto de sede y «Vaciar» | Pablo, Justin, Itzan |

## 2. El hub actual y lo que se recicla (R1)

| Pieza | Dónde | Estado |
|---|---|---|
| `PharmacyHub` | `features/account/pharmacy-hub/pharmacy-hub.{ts,html,css,spec.ts}` (PR #658 + #659): `PESTANAS = ['Mis pedidos', 'Cotizaciones', 'Comprar']`, `?tab=cotizaciones\|comprar`, pestañas «Cotizaciones» y «Comprar» con `@defer` | **Se reemplaza** por la tienda (Justin) y se borra al final (Pablo H7) |
| `PharmacyShop` | `features/account/pharmacy-hub/pharmacy-shop/pharmacy-shop.{ts,html,css,spec.ts}` (PR #659, 7 specs): `nearbySites()` con `SearchOriginPicker`, `searchProducts({ pharmacyId })`, ± con `role="group"`, insignia «Requiere receta» → `MI_HISTORIA_ROUTE`, carrito en `Map<string, ItemDeCarrito>`, `continuar()` = `availability()` → `prepararBorrador(borradorDelCarrito(...))` → `/my-account/pharmacy-orders/new`; `borradorDelCarrito()` exportada (l. 264-299) | **Se recicla** en `features/account/pharmacy/store/` (Itzan). Le falta precio (usa `searchProducts`, sin precio), ruta propia, promociones, selector de sede y el `CartStore` |
| `embedded` / `fixedVertical` | `pharmacy-orders.ts` (`embedded`), `cotizaciones.ts` (`embedded`, `fixedVertical`) — PR #658 | Quedan; no molestan. Cotizaciones se sigue usando por su ruta |
| Registro | `core/navigation/navigation.map.ts` ≈ l. 1332-1381: sección `my-account/pharmacy` (label «Farmacia», `roles: ['PATIENT']`, `icon: 'bag'`) y `my-account/pharmacy-orders` con `fueraDelMenuPara: [ANY_ROLE]`; `navigation.subgroups.ts:303-315` «Mis gestiones» con los dos paths | La sección «Farmacia» **se queda**; sólo cambia a qué componente apunta la ruta |

## 3. El cliente de farmacia y los mocks (R4) — y lo que la API real tiene

### 3.1 Front (`src/app/core/data-access/pharmacy/`)

| Método (`PharmacyClient`) | Endpoint | Estado en el corte |
|---|---|---|
| `listPharmacies()` | `GET /pharmacy/pharmacies` → `PharmacyDirectoryPage { items: PharmacyDirectoryItem[] (id, code, name, siteCount, productCount); count }` | existe |
| `searchProducts({ search?, conceptId?, pharmacyId?, limit? })` | `GET /pharmacy/products` → `PharmacyProduct { id, pharmacyId, pharmacyName, productCode, brandName, genericName, strengthText, packageSizeText, dosageForm, medication, requiresPrescription }` — **sin precio** (`pharmacy.types.ts:46-59`) | existe; `pharmacyId` sólo en el mock (PR #659) |
| `nearbySites({ search?, origin?, limit? })` | `GET /pharmacy/sites` → `PharmacySite { siteId, siteName, pharmacyId, pharmacyName, addressText, latitude, longitude, distanceKm, homeDeliveryAvailable, pickupAvailable, productCount }` | existe **sólo en el mock** (PR #659) |
| `availability({ productIds, origin?, limit? })` | `GET /pharmacy-inventory/availability` → `AvailabilitySite { …, products: AvailabilityProduct[] (productId, …, availableQuantity, price: { unitAmount, patientAmount, currency, priceListCode }) }` (`pharmacy.types.ts:78-139`) | existe; **es el único lugar del front donde hay precio** |
| `getPharmacy(id)` | `GET /pharmacy/pharmacies/:id` | **no existe** (Marcelo H2) |
| `getSitePrices(siteId, productId?)` | `GET /pharmacy/sites/:siteId/prices` | **no existe** (Marcelo H2) |

### 3.2 Mock (`src/app/core/mock/handlers/pharmacy.handlers.ts`, 468 l. tras #659)

- `FARMACIAS` (l. 52): 58 sedes (8 de la maqueta + 50 del corpus «Bolivia Salud · Eje Central») con `siteId`, `siteName`, `addressText`, `lat`, `lng`, `homeDelivery`. **Una sede por farmacia.**
- `productos` (l. 86): por farmacia × medicamento del vademécum, con `price`, `stock`, `requiresPrescription` (índices 5, 6, 11, 12 = sin receta), `medicationConceptId`.
- Rutas: `/pharmacy/pharmacies` (l. 269), `/pharmacy/products` con `search`/`conceptId`/`pharmacyId` (l. 274), `/pharmacy/sites` con `search`/`lat`/`lng`/`limit` (l. 291), `/pharmacy-inventory/availability` (l. 320, agrupa por `medicationConceptId`, `distanciaKm()` Haversine l. 112), pedidos (l. 360-464).
- **No sirve** `/pharmacy/pharmacies/:id` ni `/pharmacy/sites/:siteId/prices`.

### 3.3 API real (`mantra-core-health-api/src/modules/pharmacy/`)

| Endpoint | Archivo:línea | Qué devuelve | Brecha |
|---|---|---|---|
| `GET /pharmacy/pharmacies` | `controllers/pharmacy-read.controller.ts:38` | `PharmacyDirectoryResponseDto` | — |
| `GET /pharmacy/pharmacies/:id` | `:46` | `PharmacyDetailDto extends PharmacyDirectoryItemDto { sites: PharmacySiteReadDto[] }`; `PharmacySiteReadDto { id, code, name, addressText, latitude, longitude }` (`dto/read-responses.dto.ts:27-62`, `:156-161`) | sin cliente en el front |
| `GET /pharmacy/products` | `:56-84` | `search`, `conceptId` (`ParseUUIDPipe({ optional: true })`), `limit` | **sin `pharmacyId`** (Marcelo H5) |
| `GET /pharmacy/sites/:siteId/prices` | `:87-101` | `PharmacySitePricesResponseDto { siteId, siteName, items: PharmacySitePriceDto[] }`; `PharmacySitePriceDto { productId, productCode, brandName, genericName, strengthText, packageSizeText, medication, … }` (`:259-300`, `:358-369`) — **si `requiresPrescription` y los montos están en el DTO se verifica en Marcelo H2.S1.M1** | sin cliente en el front |
| `GET /pharmacy-inventory/availability` | `pharmacy_inventory/controllers/pharmacy-inventory-read.controller.ts:56` | referencia de `lat`+`lng` juntos o 400 y del Haversine | — |
| `GET /pharmacy/sites` | — | **no existe** (Marcelo H4) | brecha real |

## 4. Lo que hay que borrar (R5) — «Lugares cercanos»

`features/nearby-places/nearby-places.ts` (JSDoc l. 62-96): tres pestañas — **Farmacias** (lista la receta vigente y enlaza a `WhereToBuy`; no repite el cruce), **Imagenología** y **Centros médicos** (`GET /public/nearby` acotado por `kind`). Al borrarla, las dos últimas pierden pantalla desde el menú; `facility-directions-dialog.ts` («Cómo llegar» de la vitrina pública) sigue usando `GET /public/nearby` y no se ve afectado.

Referencias fuera de su carpeta (`grep -rn "nearby-places\|NearbyPlaces\|Lugares cercanos" src/app --include=*.ts --include=*.html`):

| Archivo:línea | Qué | Decisión |
|---|---|---|
| `app.routes.ts:96-97` | entrada en `PANTALLAS_DIFERIDAS` | borrar; agregar redirección en `RUTAS_HEREDADAS` |
| `core/navigation/navigation.map.ts:278-279` | sección `nearby-places` / «Lugares cercanos» | borrar |
| `core/navigation/navigation.subgroups.ts:114-136` | bloque «Lugares cercanos» + comentario en «Directorios» | borrar el bloque; el comentario se acorta |
| `core/data-access/profiles/saved-places.ts:24` | comentario | dejar (o reescribir la frase) |
| `features/shell-layout/shell-layout.spec.ts:429` | `expect(enlaces).toContain('/nearby-places')` | corregir la lista |
| `features/component-stock/component-index.generated.ts` (6 hits) | índice generado | regenerar |
| `features/alovida/buscar/cercania-detalle/cercania-detalle.html:66` | texto de la vitrina pública | dejar: no es la sección |
| `features/account/cotizaciones/cotizaciones.{ts,html}`, `pharmacy-shop.html` | comentarios «mismo selector que Lugares cercanos» | dejar |
| `features/nearby-places/search-origin-picker/**` | el selector de origen | **dejar**: lo usan Cotizaciones, where-to-buy y la tienda |

Specs que enumeran listas cerradas del menú del paciente y que van a cambiar: `shell-layout.spec.ts:429` (arriba), `navigation.service.spec.ts` (ver «no quedan grupos vacíos», l. 434), `navigation.subgroups.spec.ts` («reparte el registro entero»), `directories-overview.spec.ts` (los 4 nodos; no debería cambiar, se verifica).

## 5. La cabecera y el store persistente (R2, R3)

- **Ícono en la cabecera:** `features/shell-layout/shell-layout.html` ≈ l. 388-425 — Tutoriales y Chats como `<a class="app-header__ajustes" routerLink appTooltip appTooltipPosition="bottom" aria-label>` con `<app-nav-icon name="teach|chat" />` y, en Chats, `<app-badge class="app-header__chats-badge" variant="error" size="sm" [value]="chatsSinLeer()" aria-hidden="true" />` sólo si `> 0`; el número viaja en `etiquetaChats()`. `ChatStore` se inyecta en `shell-layout.ts:39`. El catálogo de íconos tiene `bag` (lo usa «Farmacia»); **no** tiene «cart».
- **Store persistente por usuario:** `core/tutorials/tutorial-progress.store.ts` — `signal<ReadonlyMap>`, `InjectionToken` `TUTORIAL_STORAGE`, `claveDe(usuario)` = `mantra.tutoriales.progreso.<userId>`, `effect()` sobre `auth.userId()`. Otros usos de `localStorage` en `core/`: `auth/session.store.ts`, `auth/refresh-token.storage.ts`, `tutorials/help-block-dismissal.store.ts`, `mock/mock-store.ts` (`Coleccion.persistirEn`).
- **Rojo preexistente que va a seguir:** `shell-layout.spec.ts` «los nombres de ícono del registro y los del nav no se separaron» (`NAV_ICON_NAMES` vs `NAV_ICON_NAMES_DEL_NAV`, 68 vs 53) — verificado en aislamiento el 2026-09-25, ya estaba en `origin/mockup` antes de #658. Y `navigation.service.spec.ts:16` (`@Component({ template: '' })` sin `OnPush`) rompe el lint. **Ninguno lo causa este trabajo; ninguno se toca.**

## 6. E2E y evidencia existentes

- Specs en `playwright/` que tocan farmacia y cotizaciones (de 106): `carril-e3-donde-comprar-receta.spec.ts`, `cotizaciones-paciente.spec.ts`, `reserva-cotizaciones-recorrido.spec.ts`, `cierre-carril-reserva-cotizaciones.spec.ts`, `cierre-local-reserva-cotizaciones.spec.ts`. Actores en `playwright/support/actores.ts`.
- Regla visual y fotos: en la raíz `Mantra Core Health/`, `scripts/corr-evidencia.sh <carril>` y los agentes `.claude/agents/corr-revisor-visual.md`, `corr-auditor-regla-visual.md`; `scripts/atlas/fable-proof-check.py --lane NN`.
- Presupuesto del build (`angular.json:76-86`): inicial `maximumWarning 620 kB`, `maximumError 1.3 MB` — hoy **1,29 MB** (`yarn build` del 2026-09-25, exit 0 con warnings). Todo lo nuevo va diferido por ruta.

## 7. Hallazgos que afectan a todo el equipo

| ID | Qué | A quién le pega |
|---|---|---|
| **HALL-F1** | El precio no está en el catálogo (`searchProducts`) sino en `availability()` y en `sites/:siteId/prices`; una pantalla que muestre precio tiene que pasar por uno de los dos | Justin, Itzan |
| **HALL-F2** | La API real no lista sedes sueltas ni filtra productos por farmacia: la maqueta anda con mocks; la integración real depende del carril 47 | Marcelo; todos al salir del mock |
| **HALL-F3** | `where-to-buy` ya es la vía B completa (precio + distancia + receta entera); rehacerla sería duplicar 1 032 líneas | Justin |
| **HALL-F4** | `search-origin-picker/` vive dentro de `nearby-places/`; borrar la carpeta entera rompe Cotizaciones, where-to-buy y la tienda | Pablo |
| **HALL-F5** | `Tabs` monta la pestaña 0 de forma transitoria al arrancar en otra (visto en el spec de #659): con la tienda sin pestañas deja de importar | nadie |
| **HALL-F6** | Guardar el carrito en `localStorage` es guardar nombres de medicamentos de una persona en su navegador: clave por usuario, sin logs, borrado al confirmar | Pablo |
| **HALL-F7** | `main` del prompt manager exige `check_reparto.py` sobre todas las fechas y `check_skills_citadas.py`: cada prompt lleva la sección 1, kill-test, OUT, ambigüedades, DoD del hito y las tres capas H/S/M con CA, DoD y Estado | quien reparte |
