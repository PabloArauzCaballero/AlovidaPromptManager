# La página de cada farmacia con su catálogo a precio real, y los tres recorridos de punta a punta

> **Rol:** dueño de la página de farmacia (tienda) y del QA de punta a punta del turno · **Carriles del plan:** 44 y 48 · **Fecha:** 2026-09-25 · **Turno:** noche
> **Fuente del pedido:** [`FARMACIA-ECOMMERCE-2026-09-25.md`](../../../../../docs/requisitos/FARMACIA-ECOMMERCE-2026-09-25.md) — **R1, R3, R4**
> **Verificación contra el código:** [`VERIFICACION-CONTRA-CODIGO-2026-09-25.md`](../../../../../docs/verificacion/VERIFICACION-CONTRA-CODIGO-2026-09-25.md) — §2, §4, §6
> **Plan maestro:** [`PLAN-MAESTRO.md`](../../../../../docs/trabajo/2026-09-25-plan-y-reparto-farmacia-ecommerce/PLAN-MAESTRO.md) · **Plan completo:** [`planes/04-farmacia-ecommerce-2026-09-25/README.md`](../../../../../planes/04-farmacia-ecommerce-2026-09-25/README.md) §3, §4.5 y §8
> **6 hitos · 12 subtareas · 45 microtareas**, todas con criterio de aceptación y Definition of Done.
>
> **Tu carril tiene dos mitades separadas por el reloj.** La primera (H2–H4) es la tienda de una farmacia:
> el paciente entra, ve el catálogo **con el precio real de esa sede**, las promociones vigentes, y suma o
> resta unidades al carrito de Pablo; lo que exige receta se ve pero no se suma. Casi todo eso ya existe en
> `pharmacy-hub/pharmacy-shop/` (PR #659) y se **recicla**, no se reescribe. La segunda mitad (H5–H6) es la
> Ola 3: cuando Pablo, Justin y Marcelo hayan mergeado, sos quien mira el producto entero correr —tres
> recorridos con Playwright, la regla visual en cuatro viewports y la regresión— y quien dice, con
> evidencia, si está hecho.

## 0. Ficha de asignación

| Campo | Valor |
|---|---|
| `REPO` | `alovida/mantra-core-health` (frontend Angular 21). **Nada de backend en este lote** |
| `TARGET_REF` | `origin/mockup` — corte leído **`bf2c35452363ede1d367f94c4fd726b2b9a63cb1`** (2026-09-25T00:34-04, PR #660). Tu H2 sale **después** de la Ola 0 (Pablo H2, Marcelo H2). **Reconsultalo y fijá el tuyo** en tu `PLAN.md` |
| `RAMA DE TRABAJO` | `itzan/farmacia-pagina-de-tienda-2026-09-25` (H2–H4) y `itzan/farmacia-qa-e2e-2026-09-25` (H5–H6), saliendo de `origin/mockup`. **Nada directo sobre `mockup`, nada sin PR** |
| `ARCHIVOS RESERVADOS PARA VOS` | `src/app/features/account/pharmacy/store/**` (nuevo, a partir de `pharmacy-hub/pharmacy-shop/` que **no** borrás: lo borra Pablo en H7) · en `src/app/app.routes.ts` **sólo** la entrada hija de `stores/:pharmacyId` · `playwright/pharmacy-store.spec.ts`, `playwright/pharmacy-cart.spec.ts`, `playwright/pharmacy-prescription-to-cart.spec.ts` (nuevos) · `docs/progress/evidence/lane-48/**` (en la raíz `Mantra Core Health/`) |
| `ARCHIVOS DE OTROS — NO LOS TOQUES` | `core/data-access/pharmacy-cart/**`, `cart/**`, `shell-layout/**`, `core/navigation/**`, `pharmacy-hub/**` (**Pablo**) · `core/data-access/pharmacy/**`, `core/mock/handlers/pharmacy.handlers.ts` (**Marcelo**: fixtures y endpoints se piden) · `features/account/pharmacy/{store-front,search,prescriptions}/**`, `where-to-buy/**` (**Justin**) · `features/account/cotizaciones/**` (nadie) · `features/nearby-places/search-origin-picker/**` (nadie) · los demás `playwright/*.spec.ts` (se corren, no se editan) · `mantra-core-health-api/**` |
| `⚠️ RIESGO ALTO DE TU CARRIL` | **Mostrar un precio que no sea el de esa sede.** El catálogo sale de `getSitePrices(siteId)` (Marcelo), no de `searchProducts()`, que no tiene precio. Y en QA: **un e2e que pasa con `waitForTimeout` o con un `expect` debilitado no prueba nada**; si un recorrido falla, se clasifica (`PRODUCT_BUG`, `TEST_BUG`, `ENVIRONMENT`, `DATA`) y se avisa al dueño, no se maquilla |
| `LA MAQUETA NO TIENE BACKEND` | `mockBackend: true` fijo. `GET /pharmacy/pharmacies/:id` y `GET /pharmacy/sites/:siteId/prices` los agrega Marcelo en la Ola 0; hasta que mergee, tu spec usa `HttpTestingController` con las formas del plan §4.4 (regla 65: tres niveles) |
| `CUENTA DE PRUEBA` | `paciente@alovida.mock` (cualquier contraseña no vacía). **Sintética declarada.** Para «no ve el ícono»: `medica@alovida.mock` |
| `DÓNDE SE PRUEBA` | `/my-account/pharmacy/stores/:pharmacyId` (tuya; `?site=<siteId>` opcional), `/my-account/pharmacy` (Justin), `/my-account/pharmacy/cart` (Pablo), `/my-account/pharmacy/prescriptions` (Justin), `/my-account/pharmacy-orders/new` (existente). **Sacá las URLs del router, no las supongas** |
| `LÍMITE DE RECURSOS` | Regla 70: un `yarn start`, un build, un navegador, Playwright `--workers=1`, **un proyecto por comando** en el cross-browser final |

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

Son **24**: 11 del proceso y 13 propias de la tienda y del QA.

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
| `frontend-ux-states` | **la más importante de la primera mitad**: cuatro estados del catálogo, S6 con id desconocido, sin perfil, conflicto de sede |
| `frontend-data-access` | `getPharmacy` + `getSitePrices` con `ViewState`; una lectura por sede, filtro interno en cliente |
| `atomic-design-components` | reusar `PageHeader`, `Card`, `Badge`, `SearchField`, `Select`, `AppButton`, `DialogService`, `ViewStateHost`; nada nuevo en `shared/` |
| `medication-prescription-safety` | qué producto exige receta, cómo se ve, por qué no se suma desde acá |
| `frontend-accessibility` | ± con nombre accesible por producto, `aria-live` en el valor, foco tras el diálogo, teclado en el selector de sede |
| `frontend-responsive-layout` | la tarjeta a lo ancho (regla §6), catálogo en una columna a 375, controles que no desbordan |
| `e2e-playwright` | **la más importante de la segunda mitad**: locators por rol/label/testid, `--workers=1`, sin `waitForTimeout`, trace en fallo |
| `qa-strategy` | qué recorrido prueba qué requisito; clasificar cada fallo; no maquillar |
| `visual-regression-testing` | fotos por viewport y tema comparadas antes/después; la regla visual medida, no mirada de reojo |
| `regression-suite-management` | la suite completa y los tres e2e existentes de farmacia/cotizaciones siguen en verde |
| `visual-proof` | la captura no vale si no la mirás |
| `unit-testing` | un comportamiento por test |
| `angular-testing` | `HttpTestingController`, `DialogService` doble, `provideRouter([])` |

Entrá siempre por `skills-router`: **no leas el catálogo entero, no sirve.**

### 1.4 DoD de esta sección — se verifica como cualquier otra

- [ ] `ls .claude/skills | wc -l` devolvió **179**, y la salida está pegada en tu daily.
- [ ] `python .claude/hooks/plan_gate.py --self-test` devolvió **11 PASS, 0 FAIL**, salida pegada.
- [ ] Leíste `skills-router` y las 24 skills de las dos tablas, **empezando por `frontend-ux-states`**.
- [ ] Creaste tu `PLAN.md` **antes** del primer `Edit`/`Write` de código.

**Sin estas cuatro casillas, tu lote arranca en `BLOQUEADO`, no en `EN CURSO`.**

> ### ✅ Hechos ya verificados contra el corte — no los repitas, pero tampoco los creas sin abrir el archivo
>
> - **Casi toda tu primera mitad ya existe:** `features/account/pharmacy-hub/pharmacy-shop/pharmacy-shop.{ts,html,css,spec.ts}` (PR #659, 7 specs en verde): lista de sedes con `nearbySites()`, catálogo filtrado con `searchProducts({ pharmacyId })`, controles ± con `role="group"` y `aria-label`, insignia «Requiere receta» con enlace a la historia, carrito local en un `Map`, y `borradorDelCarrito()` exportada. **Lo que le falta:** ruta propia por farmacia, precio (usa `searchProducts`, que no lo trae), promociones, selector de sede, y que el carrito sea el `CartStore` de Pablo y no un `Map` local.
> - **El precio por sede lo da `getSitePrices(siteId)`** (Marcelo, Ola 0): `PharmacySitePrices { siteId, siteName, items[]: { productId, …, requiresPrescription, unitAmount, patientAmount, currency } }` (plan §4.4). En el mock sale de `productos` con `stock > 0`.
> - **El patrón ± ya está definido:** `new-order.html:148-186` (`role="group"`, `aria-label` con el nombre, `app-button variant="outline" size="sm"`, `aria-live="polite"` en el valor). `pharmacy-shop.html` ya lo calca.
> - **Las promociones por farmacia:** `PharmacyCampaignsClient.campanasVigentes(pharmacyId)` (`pharmacy-campaigns.client.ts:144`), como las muestra `where-to-buy.ts:621-624`.
> - **El conflicto de sede y el diálogo:** `DialogService.confirm()` devuelve `Promise<boolean>` (`shared/components/molecules/dialog/dialog-service.ts`); `CartStore.add()` devuelve `'conflict'` (plan §4.3).
> - **Los e2e existentes de tu área** que tienen que seguir verdes: `playwright/carril-e3-donde-comprar-receta.spec.ts`, `cotizaciones-paciente.spec.ts`, `reserva-cotizaciones-recorrido.spec.ts`. Los actores están en `playwright/support/actores.ts`.
> - **Regla visual y evidencia fotográfica:** `scripts/corr-evidencia.sh <carril>` y `.claude/agents/corr-revisor-visual.md` en la raíz `Mantra Core Health/`; la matriz de CORR-04 (fondo blanco, centrado ≤ 2 px, ancho ≥ 85 %, sin scroll horizontal, consola limpia).

## 2. Resultado observable

| Hito | Prioridad | Qué queda demostrado |
|---|---|---|
| **H1** | `BLOQUEANTE` | Corte declarado (después de la Ola 0) y baseline con rojos previos clasificados. |
| **H2** | `ALTA` | `/my-account/pharmacy/stores/:pharmacyId` abre la tienda de una farmacia: cabecera con sede, dirección y retiro/reparto; id desconocido = S6. |
| **H3** | `ALTA` | El catálogo muestra el precio real de la sede, se filtra adentro sin nueva consulta, ± suma al `CartStore` (y el ícono de Pablo lo refleja), el conflicto de sede pregunta, lo que exige receta no se suma, las promociones vigentes se ven y, con más de una sede, se puede cambiar. |
| **H4** | `ALTA` | La ruta hija está registrada, el breadcrumb es Farmacia › <farmacia>, y hay capturas en 375 · 768 · 1440 claro + 1440 oscuro; **PUBLICADO** en el daily (Pablo borra el hub con eso). |
| **H5** | `ALTA` (Ola 3) | Tres recorridos Playwright en verde, seriales: tienda → carrito, carrito → pedido, receta → carrito → pedido. |
| **H6** | `ALTA` (Ola 3) | Regla visual medida en las cuatro rutas nuevas, accesibilidad por teclado y contraste, regresión completa en verde, `REPORTE.md` con el veredicto del producto entero. |

> ⚠️ **Orden: H1 → H2 → H3.S1 → H3.S2 → H4 → H3.S3 → H3.S4; después, recién cuando los otros tres hayan
> mergeado, H5 → H6.** Una tienda con precio real y ± al carrito publicada temprano vale más que el
> selector de sede. Lo que no se cierra queda `A MEDIAS` con las cuatro respuestas.

**Kill-test del turno completo:** entrá como `paciente@alovida.mock`, abrí `/my-account/pharmacy/stores/<id
de una farmacia del mock>`: si ves precios que no coinciden con `curl localhost:4200/pharmacy/sites/<siteId>/prices`,
H3 no está hecho. Tocá «+» en un producto sin receta: si el ícono de la cabecera no sube, H3.S2 no está hecho.
Buscá un producto con receta: si tiene «+», **está mal hecho**. Abrí la tienda de otra farmacia y tocá «+»:
si no pregunta antes de vaciar, H3.S2 no está hecho. Y al final del turno, corré
`E2E_BASE_URL=http://localhost:4200 npx playwright test playwright/pharmacy-*.spec.ts --workers=1`: si alguno
está en rojo y no hay un fallo clasificado con dueño en el daily, H5 no está hecho.

## 3. Alcance

**IN:** baseline · la página de farmacia reciclando `pharmacy-shop` (ruta por `pharmacyId` con `?site`,
cabecera, catálogo con precio real, filtro interno, ± sobre `CartStore`, conflicto de sede, receta sin
control, promociones, selector de sede) · la entrada hija de ruta · specs · capturas · los tres e2e nuevos ·
la regla visual y la accesibilidad en las cuatro rutas nuevas · la regresión completa · `PLAN.md`,
`REPORTE.md`, `evidencia/` y `docs/progress/evidence/lane-48/`.

**OUT:** **cualquier archivo fuera de los reservados de la ficha** · borrar `pharmacy-hub/` (**Pablo**, H7)
· el `CartStore` y la pantalla `/cart` (**Pablo**): si `add()` no hace lo que el plan dice, se le avisa · el
cliente y los mocks (**Marcelo**) · la home, el buscador y la receta (**Justin**) · editar los e2e
existentes de otros carriles: se corren y se reporta · **`waitForTimeout`, `test.skip`, subir timeouts o
reintentos sin causa demostrada** · Cotizaciones · precios que no vengan de `getSitePrices` · debilitar un
spec para que pase · declarar `HECHO` una microtarea cuyo DoD no corriste.

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
**DoD:** `lint`, `typecheck` y `test` con su código de salida, pegados; rojos previos clasificados; los tres e2e existentes de farmacia corridos una vez como «antes».
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H1.S1.M1 | Esperar la Ola 0 (Pablo H2, Marcelo H2) **PUBLICADO**; fijar corte y rama | SHA posterior a los dos merges | `git fetch origin && git log origin/mockup --oneline -5` | TODO |
| H1.S1.M2 | Baseline de `lint`, `typecheck`, `test` | Salidas y exit codes | → `evidencia/antes/` | TODO |
| H1.S1.M3 | Baseline e2e: los tres specs existentes de farmacia/cotizaciones, `--workers=1` | Conteo de verdes/rojos previo | `E2E_BASE_URL=http://localhost:4200 npx playwright test playwright/carril-e3-donde-comprar-receta.spec.ts playwright/cotizaciones-paciente.spec.ts playwright/reserva-cotizaciones-recorrido.spec.ts --workers=1` → `evidencia/antes/e2e.txt` | TODO |
| H1.S1.M4 | Clasificar cada rojo previo | Cada uno con su clase | tabla en `PLAN.md` | TODO |

### H2 — La página de farmacia

**Prioridad:** `ALTA`

**CA:** Dado `/my-account/pharmacy/stores/:pharmacyId`, cuando entra el paciente, entonces `getPharmacy(id)` resuelve la farmacia, la sede es la de `?site` o la primera, y la cabecera muestra nombre, sede, dirección y retiro/reparto; id desconocido = S6; sin perfil = aviso.
**DoD:** `store-page.spec.ts` ≥ 6 casos; entrada hija en `app.routes.ts`.
**Estado:** TODO

#### H2.S1 — Reciclar `pharmacy-shop` en `store/`

**CA:** Dado `pharmacy-shop.ts`, cuando se copia a `store/store-page.ts`, entonces se conservan la lista de productos, los controles ± y la insignia, y se quitan la elección de farmacia (ahora es la ruta) y el `Map` local (ahora es `CartStore`).
**DoD:** spec; `corepack yarn typecheck`.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H2.S1.M1 | Copiar `pharmacy-hub/pharmacy-shop/*` a `features/account/pharmacy/store/store-page.*` (sin borrar el origen) y quitar el paso «elegir farmacia» | Compila; la pantalla arranca con `pharmacyId` de la ruta | `corepack yarn typecheck` | TODO |
| H2.S1.M2 | `getPharmacy(pharmacyId)` → `ViewState<PharmacyDetail>`; sede = `?site` o `sites[0]`; cabecera `pharmacy-store-header` | Nombre, sede, dirección visibles | spec (`HttpTestingController`) | TODO |
| H2.S1.M3 | Estados: loading, S6 con id desconocido (404 del mock), error con reintento, sin perfil de paciente | Los cuatro | spec | TODO |
| H2.S1.M4 | Breadcrumb Panel › Mi cuenta › Farmacia › <farmacia> (`PageHeader` con `breadcrumbs`) | Se ve así | spec + captura | TODO |

### H3 — Catálogo a precio real, carrito, receta, promociones y sede

**Prioridad:** `ALTA`

**CA:** Dado la sede elegida, cuando carga el catálogo, entonces cada producto muestra el `unitAmount`/`patientAmount` de `getSitePrices(siteId)`; el filtro interno no consulta de nuevo; «+» llama `CartStore.add(site, line)`; `conflict` abre `DialogService.confirm()`; `requiresPrescription` no tiene control y enlaza a `/prescriptions`; las promociones vigentes se ven; con más de una sede hay selector.
**DoD:** `catalog.spec.ts` ≥ 10 casos; `store-page.spec.ts` +4; capturas.
**Estado:** TODO

#### H3.S1 — Catálogo a precio real

**CA:** Dado `PRECIOS_DE_SEDE` (fixture de Marcelo), cuando se pinta, entonces cada fila tiene nombre, presentación, precio con moneda (`displayCurrency`) e insignia si exige receta; el buscador interno filtra por nombre/genérico/código en cliente.
**DoD:** spec ≥ 5 casos.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H3.S1.M1 | `store/catalog.{ts,html,css}`: `getSitePrices(siteId)` → `ViewState<readonly PharmacySitePriceItem[]>`; lista `pharmacy-store-catalog` | Precio de la sede en cada fila | spec | TODO |
| H3.S1.M2 | Buscador interno (`SearchField`) que filtra en cliente por `brandName`/`genericName`/`productCode`, sin nueva consulta | `expectOne` una sola vez | spec | TODO |
| H3.S1.M3 | Insignia «Requiere receta» (`pharmacy-store-rx-badge`) y enlace a `PHARMACY_PRESCRIPTIONS_ROUTE` en esas filas, sin control ± | No hay `pharmacy-store-qty-plus` en esa fila | spec | TODO |
| H3.S1.M4 | Estados: loading, empty de filtro («Probá con otro nombre»), error con reintento | Los tres | spec | TODO |

#### H3.S2 — ± sobre el `CartStore`

**CA:** Dado un producto sin receta, cuando se toca «+», entonces `CartStore.add(site, line, 1)` y el valor mostrado sale de `cantidadDe(producto)` del store (recargar lo conserva); `conflict` → `DialogService.confirm()` «Vaciar y cambiar de farmacia» → `replaceWith`; cancelar no cambia nada; «−» a 0 quita.
**DoD:** spec ≥ 5 casos con `DialogService` doble.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H3.S2.M1 | Reemplazar el `Map` local por `CartStore`: `cantidadDe`, `cambiarCantidad` → `add`/`setQuantity` | El valor viene del store | spec | TODO |
| H3.S2.M2 | `CartSite` de la sede elegida (`pharmacyId, pharmacyName, siteId, siteName, addressText`) y `CartLine` desde `PharmacySitePriceItem` (precio visto) | `add` recibe el precio | spec | TODO |
| H3.S2.M3 | `conflict` → `DialogService.confirm()`; confirmar → `replaceWith(site, [line], null)`; cancelar → nada | Dos casos | spec | TODO |
| H3.S2.M4 | Prueba manual: «+» sube el ícono de Pablo; captura | Mirada | `evidencia/h3/capturas/` | TODO |

#### H3.S3 — Promociones vigentes

**CA:** Dado `campanasVigentes(pharmacyId)` con campañas, cuando se pinta la cabecera, entonces hay chips como en `where-to-buy`; sin campañas, no hay bloque.
**DoD:** spec 2 casos.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H3.S3.M1 | `PharmacyCampaignsClient.campanasVigentes(pharmacyId)` bajo la cabecera, mismo marcado que `where-to-buy.html` | Chips visibles con campañas | spec | TODO |
| H3.S3.M2 | Sin campañas, ningún bloque | Fijado | spec | TODO |

#### H3.S4 — Selector de sede

**CA:** Dado `sites.length > 1`, cuando se elige otra sede, entonces `?site` cambia (`replaceUrl`), el catálogo recarga y, si el carrito es de otra sede, se pregunta; con una sede no hay selector.
**DoD:** spec 3 casos.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H3.S4.M1 | `Select` de sede en la cabecera cuando hay más de una; cambia `?site` y recarga precios | Recarga | spec | TODO |
| H3.S4.M2 | Con una sede, sin selector | Fijado | spec | TODO |
| H3.S4.M3 | Cambio de sede con carrito de otra sede → confirm | Fijado | spec | TODO |

### H4 — Ruta, capturas y publicación

**Prioridad:** `ALTA`

**CA:** Dado `app.routes.ts`, cuando se abre `/my-account/pharmacy/stores/<id>`, entonces carga `StorePage`; hay capturas 375 · 768 · 1440 claro + 1440 oscuro miradas; y la fila **PUBLICADO** está en el daily.
**DoD:** `corepack yarn build` exit 0; capturas; fila en §4-bis.
**Estado:** TODO

#### H4.S1 — Entrada hija, capturas y aviso

**CA:** Dado el build, cuando termina, entonces el presupuesto inicial no creció (la tienda va diferida por ruta).
**DoD:** salida del build pegada con el tamaño inicial.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H4.S1.M1 | Entrada hija `my-account/pharmacy/stores/:pharmacyId` en `PANTALLAS_HIJAS` de `app.routes.ts` (una línea) | La ruta abre | `corepack yarn build` | TODO |
| H4.S1.M2 | Capturas 375 · 768 · 1440 claro + 1440 oscuro, con carrito y con producto con receta a la vista | Cuatro capturas miradas, una línea cada una | `evidencia/h4/capturas/` | TODO |
| H4.S1.M3 | PR a `mockup` mergeable y fila **PUBLICADO** en §4-bis del daily (Pablo la espera para H7) | `gh pr view` sin conflictos | `gh pr view --json mergeable,mergeStateStatus` | TODO |

### H5 — Los tres recorridos de punta a punta (Ola 3)

**Prioridad:** `ALTA`

**CA:** Dado `origin/mockup` con los cuatro carriles mergeados, cuando se corren los tres specs nuevos con `--workers=1`, entonces pasan; cada fallo, si lo hay, está clasificado con dueño en el daily.
**DoD:** los tres specs en verde en Chromium; trace y captura por fallo; sin `waitForTimeout`, sin `skip`.
**Estado:** TODO

#### H5.S1 — Tienda → carrito

**CA:** Dado `paciente@alovida.mock`, cuando busca «paracetamol», ordena por precio y por distancia, entra a una farmacia y suma una unidad, entonces el badge de la cabecera dice 1.
**DoD:** `playwright/pharmacy-store.spec.ts` en verde.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H5.S1.M1 | Login + `/my-account/pharmacy` + buscar + «Más barato»: primer precio ≤ segundo (leído de las filas) | Aserción sobre dos números | `E2E_BASE_URL=http://localhost:4200 npx playwright test playwright/pharmacy-store.spec.ts --workers=1` | TODO |
| H5.S1.M2 | Origen «tu casa» + «Más cerca»: primera distancia ≤ segunda | Aserción sobre dos números | idem | TODO |
| H5.S1.M3 | Modo Farmacias → Entrar → «+» en un producto sin receta → `header-cart-badge` = «1» | `getByTestId('header-cart-badge')` con «1» | idem | TODO |
| H5.S1.M4 | Un producto con receta no tiene `pharmacy-store-qty-plus` | `toHaveCount(0)` en esa fila | idem | TODO |

#### H5.S2 — Carrito → pedido

**CA:** Dado un carrito con dos líneas, cuando se cambia una cantidad, se intenta agregar de otra farmacia y se confirma, se continúa, se revisa y se confirma el pedido, entonces el pedido aparece en Mis pedidos y el badge desaparece.
**DoD:** `playwright/pharmacy-cart.spec.ts` en verde.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H5.S2.M1 | Dos líneas → `/cart` → «+» en una → total y badge cambian | Aserciones sobre `pharmacy-cart-total` y badge | `… playwright/pharmacy-cart.spec.ts --workers=1` | TODO |
| H5.S2.M2 | Agregar desde otra farmacia → `pharmacy-cart-conflict-dialog` → confirmar → carrito de la nueva | El diálogo aparece y el carrito cambia de farmacia | idem | TODO |
| H5.S2.M3 | «Continuar» → revisión → checkout → confirmar → `/my-account/pharmacy-orders` lista el pedido nuevo → sin badge | Cuatro aserciones | idem | TODO |
| H5.S2.M4 | Recargar con carrito lleno: sigue lleno | Aserción tras `reload()` | idem | TODO |

#### H5.S3 — Receta → carrito → pedido

**CA:** Dado el paciente con recetas, cuando toca «Buscar toda una receta», elige una, entra a `where-to-buy`, agrega la receta al carrito y continúa, entonces la revisión muestra la receta y el pedido lleva `medicationRequestId` (visible como «receta» en la revisión).
**DoD:** `playwright/pharmacy-prescription-to-cart.spec.ts` en verde.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H5.S3.M1 | Home → `pharmacy-prescription-button` → `pharmacy-prescriptions-list` → `pharmacy-prescription-search` → `where-to-buy` abre | Aserción de URL | `… playwright/pharmacy-prescription-to-cart.spec.ts --workers=1` | TODO |
| H5.S3.M2 | `where-to-buy-add-to-cart` en la primera sede → `/cart` con N líneas = medicamentos disponibles de la receta | Conteo de `pharmacy-cart-lines` | idem | TODO |
| H5.S3.M3 | «Continuar» → la revisión muestra la receta (título/emisor) | Aserción de texto | idem | TODO |
| H5.S3.M4 | Cada fallo clasificado (`PRODUCT_BUG` / `TEST_BUG` / `ENVIRONMENT` / `DATA`) con dueño en §4-bis del daily; trace adjunto | Sin rojo sin dueño | daily | TODO |

### H6 — Regla visual, accesibilidad, regresión y veredicto (Ola 3)

**Prioridad:** `ALTA`

**CA:** Dado las cuatro rutas nuevas, cuando se miden en 375 · 768 · 1440 claro + 1440 oscuro, entonces cumplen la regla visual (fondo, centrado ≤ 2 px, ancho ≥ 85 %, sin scroll horizontal, consola limpia); el teclado recorre ±, el selector de modo y el diálogo; el contraste del badge es AA; la suite completa y los e2e existentes están en verde; y el `REPORTE.md` da el veredicto del producto entero.
**DoD:** `docs/progress/evidence/lane-48/MATRIZ.md` + fotos + `REPORT.md`; `fable-proof-check.py --lane 48` PASS.
**Estado:** TODO

#### H6.S1 — Regla visual y accesibilidad

**CA:** Dado `scripts/corr-evidencia.sh 48` sobre `/my-account/pharmacy`, `/stores/<id>`, `/cart` y `/prescriptions`, cuando termina, entonces la matriz tiene una fila por ruta × viewport × criterio, todas PASS o con dueño.
**DoD:** `MATRIZ.md` y fotos fullPage.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H6.S1.M1 | Matriz de regla visual en las cuatro rutas × cuatro viewports | Todas PASS o con dueño | `scripts/corr-evidencia.sh 48` (raíz) → `MATRIZ.md` | TODO |
| H6.S1.M2 | Teclado: Tab recorre modo, orden, origen, resultados, ±, «Continuar»; Enter/Espacio en el selector de modo; Escape cierra el diálogo y devuelve el foco | Observado y anotado | `evidencia/h6/teclado.md` | TODO |
| H6.S1.M3 | Contraste del badge y de la insignia «Requiere receta» ≥ 4,5:1 en claro y oscuro | Dos números por tema | `evidencia/h6/contraste.md` | TODO |
| H6.S1.M4 | Fallos de a11y o visuales clasificados con dueño en el daily | Sin rojo sin dueño | daily | TODO |

#### H6.S2 — Regresión y veredicto

**CA:** Dado el turno, cuando se cierra, entonces `typecheck`, `lint`, `build`, `test --watch=false`, los tres e2e existentes y los tres nuevos están en verde (salvo rojos preexistentes anotados), y el reporte dice hecho / a medias / no hecho por requisito R1–R7.
**DoD:** `REPORT.md` en `docs/progress/evidence/lane-48/`; `claim.py --level REGRESSION_VERIFIED`; `fable-proof-check.py --lane 48` PASS.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H6.S2.M1 | Regresión completa | Sin rojos nuevos | `corepack yarn typecheck && corepack yarn lint && corepack yarn build && corepack yarn test --watch=false` | TODO |
| H6.S2.M2 | Los seis e2e de farmacia (tres existentes + tres nuevos), Chromium, seriales | Seis en verde | `E2E_BASE_URL=http://localhost:4200 npx playwright test playwright/pharmacy-*.spec.ts playwright/carril-e3-donde-comprar-receta.spec.ts playwright/cotizaciones-paciente.spec.ts playwright/reserva-cotizaciones-recorrido.spec.ts --workers=1` | TODO |
| H6.S2.M3 | Cross-browser final: Firefox, un proyecto por comando, sólo los tres nuevos | Tres en verde o fallo clasificado | `… --project=firefox --workers=1` | TODO |
| H6.S2.M4 | `REPORT.md` con veredicto por requisito R1–R7 (hecho / a medias / no hecho, con evidencia); `claim.py` y `fable-proof-check.py` | PASS | `python3 -S scripts/atlas/fable-proof-check.py --lane 48` (raíz) | TODO |
| H6.S2.M5 | `REPORTE.md` del carril, dailies al día, nada corriendo | `git status` limpio; sin procesos | `git status`; `ps` | TODO |

## 5. Ambigüedades registradas

| ID | Ambigüedad | Supuesto con el que trabajás | Quién puede resolverla | Qué bloquea |
|---|---|---|---|---|
| Q-I1 | ¿La distancia se muestra en la página de farmacia? | Sólo si la URL trae `?lat&lng` desde los resultados de Justin; si no, sólo la dirección. No se pide el GPS de nuevo | Justin | H2.S1.M2 |
| Q-I2 | ¿Tope de unidades por «+»? | 99 en pantalla; la sede lo corrige al continuar (Pablo) | Pablo | H3.S2.M1 |
| Q-I3 | ¿Firefox está instalado para Playwright en la máquina de QA? | Se intenta; si no, `A MEDIAS` con el motivo, nunca `skip` | Itzan | H6.S2.M3 |
| Q-I4 | ¿La revisión muestra «la receta» de forma que un e2e la pueda asertar? | Se lee `new-order.html` antes de escribir el spec; si no hay texto estable, se asierta sobre las líneas y se declara | Justin | H5.S3.M3 |
| Q-I5 | Los mocks de Marcelo pueden llegar después de tu H3.S1 | Spec con `HttpTestingController` y las formas del plan §4.4 (tres niveles: correcto, vacío, 404); prueba manual cuando mergee | Marcelo | H3.S1.M1 |

## 6. Definition of Done del hito

- [ ] Todas sus microtareas en `HECHO`, o en `A MEDIAS`/`BLOQUEADO`/`DESCARTADO` **con las cuatro respuestas**.
- [ ] La salida literal del comando de cada DoD está en `evidencia/`, no parafraseada.
- [ ] `corepack yarn lint`, `typecheck`, `build` y `test --watch=false` sin rojos **nuevos** respecto del baseline.
- [ ] **Ningún precio que no venga de `getSitePrices(siteId)`.**
- [ ] Ningún producto con receta obligatoria tiene control de cantidad en la tienda.
- [ ] Los e2e nuevos no tienen `waitForTimeout`, `skip`, reintentos ni timeouts subidos; cada fallo está clasificado con dueño.
- [ ] La regla visual está medida, no mirada de reojo: matriz con números.
- [ ] Capturas por viewport y tema, **miradas**, con una línea cada una.
- [ ] Peldaño de evidencia declarado por área (regla 30); el del producto entero, en `REPORT.md`.
- [ ] Sin datos de personas: sólo `paciente@alovida.mock` y `medica@alovida.mock`.
- [ ] El `PLAN.md` está actualizado en el momento, no al final.

## 7. Cómo cerrás el turno

1. **Checkpoint** en cada apertura y cierre de microtarea. Prohibido encadenar más de tres operaciones
   materiales sin uno.
2. **`REPORTE.md`** con el avance en la **primera línea**: `> **AVANCE: <HECHO> / 45 — <%>.**`
3. **Las tres secciones obligatorias existen siempre.** Una vacía se escribe con «ninguna».
4. **H5 y H6 no arrancan** hasta que Pablo (H5), Justin (H3.S5, H5) y Marcelo (H2) estén **PUBLICADO**; mientras tanto no es `BLOQUEADO`: es `TODO` con la precondición escrita, y H2–H4 avanzan.
5. **Publicá H4 apenas esté**: Pablo borra el hub con eso.
6. **Enumerá qué quedó corriendo** y cerralo (el `yarn start` de los e2e incluido).
7. **Tu daily** es `Itzan-Daily-Noche-2026-09-25.md`, en la carpeta de arriba.

## 8. Revisión adversarial antes de cerrar

1. ¿Hay un precio en la tienda que salió de `searchProducts()` y no de `getSitePrices()`?
2. ¿Un producto con receta tiene «+»?
3. ¿Cambiar de farmacia pisa el carrito sin preguntar?
4. ¿El valor de cantidad se guarda en la pantalla y no en el `CartStore` (recargar lo pierde)?
5. ¿Borraste `pharmacy-hub/pharmacy-shop/` «porque ya lo copiaste»?
6. ¿Algún e2e tiene `waitForTimeout`, `skip` o un `expect` que se cumple aunque el flujo falle?
7. ¿Un e2e depende del orden de otro o de un carrito que dejó el anterior?
8. ¿La regla visual dice PASS sin un número de ancho o de scroll medido?
9. ¿El cross-browser corrió con dos proyectos a la vez?
10. ¿Se declara verificado algo que sólo fue inspeccionado estáticamente?
