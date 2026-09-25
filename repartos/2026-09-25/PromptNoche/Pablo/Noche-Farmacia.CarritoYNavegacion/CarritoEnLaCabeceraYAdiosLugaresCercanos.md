# El carrito en la cabecera, uno por farmacia, y «Lugares cercanos» que desaparece

> **Rol:** dueño del carrito (`CartStore`), de la cabecera y del registro de navegación · **Carriles del plan:** 41 y 46 · **Fecha:** 2026-09-25 · **Turno:** noche
> **Fuente del pedido:** [`FARMACIA-ECOMMERCE-2026-09-25.md`](../../../../../docs/requisitos/FARMACIA-ECOMMERCE-2026-09-25.md) — **R2, R3, R5**
> **Verificación contra el código:** [`VERIFICACION-CONTRA-CODIGO-2026-09-25.md`](../../../../../docs/verificacion/VERIFICACION-CONTRA-CODIGO-2026-09-25.md) — §2, §3, §5
> **Plan maestro:** [`PLAN-MAESTRO.md`](../../../../../docs/trabajo/2026-09-25-plan-y-reparto-farmacia-ecommerce/PLAN-MAESTRO.md) · **Plan completo:** [`planes/04-farmacia-ecommerce-2026-09-25/README.md`](../../../../../planes/04-farmacia-ecommerce-2026-09-25/README.md) §4 (contratos congelados)
> **8 hitos · 12 subtareas · 43 microtareas**, todas con criterio de aceptación y Definition of Done.
>
> **Tu carril tiene la Ola 0 del equipo.** Los otros tres no pueden compilar contra el carrito hasta que
> vos mergees **H2** (tipos + `CartStore` en memoria + rutas + testids): es una hora, va primero, y se
> publica en el daily de equipo apenas está en `origin/mockup`. Después de eso nadie te espera para nada.
> La segunda mitad —sacar «Lugares cercanos» y, al final del turno, borrar el hub viejo— es limpieza con
> tests que enumeran listas cerradas: **se corrigen las listas, nunca se saltan los tests.**

## 0. Ficha de asignación

| Campo | Valor |
|---|---|
| `REPO` | `alovida/mantra-core-health` (frontend Angular 21). **Nada de backend en este lote** |
| `TARGET_REF` | `origin/mockup` — corte leído **`bf2c35452363ede1d367f94c4fd726b2b9a63cb1`** (2026-09-25T00:34-04, PR #660). **Reconsultalo y fijá el tuyo** en tu `PLAN.md` |
| `RAMA DE TRABAJO` | `pablo/farmacia-carrito-y-navegacion-2026-09-25`, saliendo de `origin/mockup`. **Nada directo sobre `mockup`, nada sin PR.** H2 va en un PR propio y chico, mergeado antes de seguir |
| `ARCHIVOS RESERVADOS PARA VOS` | `src/app/core/data-access/pharmacy-cart/**` (nuevo) · `src/app/core/data-access/pharmacy-orders/pharmacy-orders.client.ts` + `.spec.ts` (**sólo** el `clear()` de H5.S2) · `src/app/features/account/pharmacy/pharmacy.routes.ts` y `pharmacy.testids.ts` (nuevos) · `src/app/features/account/pharmacy/cart/**` (nuevo) · `src/app/features/shell-layout/**` (sólo el bloque del ícono) · `src/app/core/navigation/**` · `src/app/core/tutorials/definitions/**` · `src/app/features/nearby-places/nearby-places.{ts,html,css,spec.ts}` (borrar) · `src/app/features/account/pharmacy-hub/**` (borrar, **sólo en H7**) · `src/app/features/directories-overview/directories-overview.spec.ts` · en `src/app/app.routes.ts` **sólo** `RUTAS_HEREDADAS`, `SECCIONES_REDIRIGIDAS`, la entrada `nearby-places` de `PANTALLAS_DIFERIDAS` y la entrada hija de `/cart` |
| `ARCHIVOS DE OTROS — NO LOS TOQUES` | `core/data-access/pharmacy/**` y `core/mock/handlers/pharmacy.handlers.ts` (**Marcelo**) · `features/account/pharmacy/store-front/**`, `search/**`, `prescriptions/**`, `medical-record/where-to-buy/**` (**Justin**) · `features/account/pharmacy/store/**` y los e2e de farmacia (**Itzan**) · `features/nearby-places/search-origin-picker/**` (**nadie**: se queda donde está) · `features/account/cotizaciones/**` (**nadie**: Cotizaciones no se toca) · `mantra-core-health-api/**` (**Marcelo**, en su repo) |
| `⚠️ RIESGO ALTO DE TU CARRIL` | **Guardar nombres de medicamentos en `localStorage`.** Es dato de salud de la persona en su propio navegador: clave por usuario, nunca en logs ni capturas, se borra al vaciar y al confirmar el pedido, y se declara en el reporte (`data-privacy-phi`). Y el segundo: **sacar «Lugares cercanos» rompe listas cerradas en 4 specs**; se corrige la lista, no el test |
| `LA MAQUETA NO TIENE BACKEND` | `mockBackend: true` fijo. El carrito no tiene endpoint: vive en el navegador. El pedido real sigue naciendo en `POST /pharmacy/orders` (manejador de Marcelo, ya existe) |
| `CUENTA DE PRUEBA` | `paciente@alovida.mock` (cualquier contraseña no vacía). **Sintética declarada.** La médica (`medica@alovida.mock`) sirve para probar que **no** ve el ícono |
| `DÓNDE SE PRUEBA` | `/my-account/pharmacy` (hoy el hub de tres pestañas; Justin lo reemplaza por la tienda en su H3), `/my-account/pharmacy/cart` (tuya), `/my-account/pharmacy-orders/new` (revisión existente, no se toca), `/nearby-places` (tiene que redirigir). **Sacá las URLs del router, no las supongas** |
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

Son **22**: 11 del proceso y 11 propias del carrito y la navegación.

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
| `angular-signals-state` | **la más importante**: el `CartStore` como signal store, `computed` para contador y total, `effect` sólo para persistir |
| `data-privacy-phi` | medicamentos de una persona en `localStorage`: clave por usuario, nunca en logs ni capturas |
| `frontend-data-access` | la forma del `BorradorDePedido` y por qué `toDraft()` calca `borradorDePedido()` |
| `frontend-navigation-ia` | sacar una sección del registro sin dejar rutas muertas: redirecciones heredadas, breadcrumb, `fueraDelMenuPara` |
| `atomic-design-components` | reusar `app-nav-icon`, `app-badge`, `DialogService.confirm()`, `ViewStateHost`; nada nuevo en `shared/` |
| `frontend-ux-states` | el carrito vacío es S3 con acción; «continuar» con sede caída se dice, no se esconde |
| `frontend-accessibility` | el `aria-label` del ícono lleva el número; el badge no se anuncia dos veces; foco tras el diálogo de vaciar |
| `unit-testing` | un comportamiento por test; `Storage` falso como en `theme.service.spec` |
| `angular-testing` | `HttpTestingController` para la revalidación al continuar; `shell-layout.spec` sin tocar los casos existentes |
| `regression-suite-management` | las listas cerradas de `navigation.*.spec` y `shell-layout.spec` se corrigen, no se debilitan |
| `visual-proof` | la captura no vale si no la mirás |

Entrá siempre por `skills-router`: **no leas el catálogo entero, no sirve.**

### 1.4 DoD de esta sección — se verifica como cualquier otra

- [ ] `ls .claude/skills | wc -l` devolvió **179**, y la salida está pegada en tu daily.
- [ ] `python .claude/hooks/plan_gate.py --self-test` devolvió **11 PASS, 0 FAIL**, salida pegada.
- [ ] Leíste `skills-router` y las 22 skills de las dos tablas, **empezando por `angular-signals-state`**.
- [ ] Creaste tu `PLAN.md` **antes** del primer `Edit`/`Write` de código.

**Sin estas cuatro casillas, tu lote arranca en `BLOQUEADO`, no en `EN CURSO`.**

> ### ✅ Hechos ya verificados contra el corte — no los repitas, pero tampoco los creas sin abrir el archivo
>
> - **El patrón de store persistente por usuario ya existe:** `core/tutorials/tutorial-progress.store.ts` — signal `progreso`, `InjectionToken` de storage, clave `mantra.tutoriales.progreso.<userId>`, `effect()` sobre `auth.userId()`. El `CartStore` se calca de ahí.
> - **El patrón de ícono en la cabecera ya existe:** `features/shell-layout/shell-layout.html` ≈ l. 400–425 — `<a class="app-header__ajustes" routerLink="/messaging" data-testid="header-chats" appTooltip="Chats" appTooltipPosition="bottom" [attr.aria-label]="etiquetaChats()"><app-nav-icon name="chat" /> @if (chatsSinLeer() > 0) { <app-badge … [value]="chatsSinLeer()" aria-hidden="true" /> }</a>`. El carrito es el mismo bloque con `name="bag"` y el contador del store.
> - **El borrador de pedido y su cadena ya existen y sirven sin receta:** `pharmacy-orders.client.ts:48` `prepararBorrador()`, `:56` `enviar()`; `pharmacy-orders.adapter.ts:116` omite `medicationRequestId` cuando `requestId === ''`. La forma exacta de las líneas la arma `borradorDePedido()` en `where-to-buy.ts:837-878` (exportada).
> - **`nearby-places` se referencia en 7 lugares fuera de su carpeta:** `app.routes.ts:96`, `navigation.map.ts:278`, `navigation.subgroups.ts:114-136`, `saved-places.ts:24` (comentario), `shell-layout.spec.ts:429`, y `component-index.generated.ts` (se regenera). El `search-origin-picker/` que vive adentro lo usan `cotizaciones.ts`, `where-to-buy.ts` y `pharmacy-shop.ts`: **no se mueve**.
> - **El hub actual** (`features/account/pharmacy-hub/`, PR #658 y #659) tiene tres pestañas y un `pharmacy-shop/` que Itzan recicla en su página de tienda. Se borra **después** de que Justin (tienda) e Itzan (página de farmacia) mergeen: H7 es Ola 3.

## 2. Resultado observable

| Hito | Prioridad | Qué queda demostrado |
|---|---|---|
| **H1** | `BLOQUEANTE` | Corte declarado y baseline con los rojos previos clasificados (hoy hay dos: `shell-layout.spec` «los nombres de ícono…» y el lint de `navigation.service.spec.ts:16`). |
| **H2** | `BLOQUEANTE` | **Ola 0 del equipo.** En `origin/mockup` existen `pharmacy-cart.types.ts`, `cart.store.ts` (en memoria), `cart.storage.ts` (no-op), `pharmacy.routes.ts` y `pharmacy.testids.ts`, con spec del store en verde. Publicado en el daily. |
| **H3** | `ALTA` | El carrito sobrevive a la recarga, es del usuario que lo armó y `toDraft()` produce el mismo borrador que `borradorDePedido()`. |
| **H4** | `ALTA` | El paciente ve un ícono de carrito en la cabecera con el número de unidades; la médica no lo ve. |
| **H5** | `ALTA` | `/my-account/pharmacy/cart` muestra las líneas, deja cambiar cantidades y vaciar, y «Continuar» lleva a la revisión existente con el borrador armado; confirmar un pedido deja el carrito vacío. |
| **H6** | `ALTA` | «Lugares cercanos» no está en el menú ni en el registro; `/nearby-places` redirige a la tienda; los specs pasan con las listas corregidas. |
| **H7** | `MEDIA` (Ola 3) | `pharmacy-hub/` borrado, `grep -rn PharmacyHub src` = 0, suite en verde. |
| **H8** | `ALTA` | Regresión en verde y `REPORTE.md` escrito, con la nota de privacidad del carrito. |

> ⚠️ **Orden: H1 → H2 (una hora, PR propio, avisar) → H3 → H4 → H5 → H6 → H8; H7 recién cuando Justin e
> Itzan hayan mergeado.** Si hay que recortar, H2 y H5 valen más que H6.

**Kill-test del turno completo:** entrá como `paciente@alovida.mock`, agregá dos unidades de algo desde la
tienda de Justin (o, si todavía no está, desde `/my-account/pharmacy?tab=comprar`): si en la cabecera no hay
un ícono con un «2», H4 no está hecho. Recargá la página: si el «2» desaparece, H3 no está hecho. Abrí
`/my-account/pharmacy/cart` y tocá «Continuar»: si no aparece la revisión con esas dos unidades, H5 no está
hecho. Confirmá el pedido: si el «2» sigue en la cabecera, H5.S2 no está hecho. Abrí `/nearby-places`: si no
redirige a la tienda, H6 no está hecho. Entrá como `medica@alovida.mock`: si ve el ícono, **está mal hecho**.

## 3. Alcance

**IN:** baseline · los contratos del carrito de la Ola 0 (tipos, store en memoria, storage no-op, rutas,
testids) en un PR propio · persistencia por usuario · `toDraft()` · ícono con badge en la cabecera · pantalla
`/cart` con sus estados y el «Continuar» que revalida disponibilidad · `clear()` al confirmar el pedido ·
sacar «Lugares cercanos» del registro, subgrupos, tutoriales y specs · borrar la pantalla y redirigir
`/nearby-places` · marcar el carril 19 como superado en `docs/progress/` · borrar el hub viejo en la Ola 3 ·
specs · capturas por viewport y tema · `PLAN.md`, `REPORTE.md` y `evidencia/`.

**OUT:** **cualquier archivo fuera de los reservados de la ficha** · el cliente y los mocks de farmacia
(**Marcelo**): si necesitás un endpoint, lo pedís por el daily · la tienda, el buscador, la receta y
`where-to-buy` (**Justin**) · la página de farmacia y los e2e (**Itzan**) · `features/account/cotizaciones/**`
(no se toca) · mover `search-origin-picker/` · un endpoint de carrito en la API · la revisión, el checkout,
el recibo y la factura del pedido (`new-order`, `checkout`, `order-*`) · **guardar el carrito con datos de
otra persona o sin clave por usuario** · debilitar un spec para que pase · declarar `HECHO` una microtarea
cuyo DoD no corriste.

## 4. Plan — hitos, subtareas y microtareas

Los seis estados permitidos son exactamente: `TODO`, `EN CURSO`, `HECHO`, `A MEDIAS`, `BLOQUEADO` y
`DESCARTADO`. **`A MEDIAS` es legítimo; disfrazarlo de `HECHO` no.**

### H1 — Corte y baseline

**Prioridad:** `BLOQUEANTE`

**CA:** Dado tu entorno, cuando alguien pregunta contra qué versión trabajaste y qué estaba en rojo antes de que tocaras nada, entonces hay SHA, salidas y una tabla de rojos previos clasificados — no una impresión.
**DoD:** salidas con exit code en `evidencia/antes/`; cada rojo previo con su clase (regla 80.4) en `PLAN.md`.
**Estado:** TODO

#### H1.S1 — Corte, rama y baseline

**CA:** Dado un rojo posterior, cuando alguien pregunta si lo rompiste vos, entonces la respuesta sale de un archivo.
**DoD:** `lint`, `typecheck` y `test` con su código de salida, pegados; rojos previos clasificados.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H1.S1.M1 | Fijar corte y rama | Hay SHA y rama en `PLAN.md` | `git fetch origin && git rev-parse origin/mockup && git branch --show-current` | TODO |
| H1.S1.M2 | Baseline de `lint` y `typecheck` | Hay salida y exit code | `corepack yarn lint; echo "exit=$?"; corepack yarn typecheck; echo "exit=$?"` → `evidencia/antes/` | TODO |
| H1.S1.M3 | Baseline de `test` | Hay conteo de fallos previos | `corepack yarn test --watch=false` → `evidencia/antes/test.txt` | TODO |
| H1.S1.M4 | Clasificar cada rojo previo | Cada uno con su clase | tabla en `PLAN.md` (esperados: `shell-layout.spec` íconos, `navigation.service.spec` lint l.16) | TODO |

### H2 — Contratos del carrito (Ola 0 del equipo)

**Prioridad:** `BLOQUEANTE`

**CA:** Dado el plan §4, cuando Justin, Itzan o Marcelo importan `CartStore`, los tipos, las rutas o los testids desde `origin/mockup`, entonces compilan y pueden probar contra el store sin esperarte para nada más.
**DoD:** PR propio mergeado en `mockup` en la primera hora; spec del store ≥ 10 casos en verde; fila en §4-bis del daily de equipo con la ruta de cada archivo.
**Estado:** TODO

#### H2.S1 — Tipos, store en memoria, storage no-op, rutas y testids

**CA:** Dado `add()` con una sede distinta a la del carrito, cuando se llama, entonces devuelve `conflict` y no cambia nada; dado un producto con receta y `requestId === null`, devuelve `requires-prescription`; `setQuantity(0)` quita la línea y el carrito vacío es `null`.
**DoD:** `npx ng test --include='src/app/core/data-access/pharmacy-cart/*.spec.ts' --watch=false` en verde; `corepack yarn typecheck` exit 0.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H2.S1.M1 | `pharmacy-cart.types.ts` con `CartSite`, `CartLine`, `CartState`, `AddOutcome` **exactamente** como el plan §4.2 | Los cuatro tipos compilan con esos campos | `corepack yarn typecheck` | TODO |
| H2.S1.M2 | `cart.storage.ts`: `InjectionToken<CartStorage>` con `read/write/clear` y una implementación no-op por defecto | Inyectable sin proveer nada | spec: el store arranca en `null` sin storage | TODO |
| H2.S1.M3 | `cart.store.ts`: `cart`, `unitCount`, `estimatedTotal`, `add`, `replaceWith`, `setQuantity`, `remove`, `clear` (plan §4.3), en memoria | La API pública es la de la tabla, ni más ni menos | `grep -n "readonly\|(): \|): " cart.store.ts` contra §4.3 | TODO |
| H2.S1.M4 | `estimatedTotal` suma en centavos con `pharmacy-campaigns.money.ts`; `null` si falta precio o mezclan moneda | Dos líneas 10,50 + 2×3,25 = «17,00»; una sin precio → `null` | spec | TODO |
| H2.S1.M5 | Spec del store: `added`, `conflict`, `requires-prescription`, sumar la misma línea, `setQuantity(0)`, `remove`, `clear`, `replaceWith`, `unitCount`, `estimatedTotal` | ≥ 10 casos en verde | `npx ng test --include='src/app/core/data-access/pharmacy-cart/*.spec.ts' --watch=false` | TODO |
| H2.S1.M6 | `features/account/pharmacy/pharmacy.routes.ts` y `pharmacy.testids.ts` con las constantes del plan §4.1 y §4.5 | Existen y exportan lo listado | `corepack yarn typecheck` | TODO |
| H2.S1.M7 | PR chico a `mockup`, mergeado, y fila **PUBLICADO** en §4-bis del daily de equipo con las rutas | Los otros tres lo pueden importar | `git log origin/mockup -1` muestra el merge | TODO |

### H3 — Persistencia por usuario y `toDraft()`

**Prioridad:** `ALTA`

**CA:** Dado un carrito con dos líneas, cuando la persona recarga o vuelve a entrar con la misma cuenta, entonces el carrito está igual; cuando entra otra cuenta, está vacío; y `toDraft(site)` produce un `BorradorDePedido` estructuralmente igual al de `borradorDePedido()` para las mismas entradas.
**DoD:** specs con `Storage` falso; comparación de borradores en spec.
**Estado:** TODO

#### H3.S1 — Persistencia

**CA:** Dado `auth.userId()`, cuando cambia, entonces el store carga el carrito de esa clave y escribe en cada cambio; en servidor (`isPlatformBrowser` falso) no toca storage.
**DoD:** spec con `Storage` falso (patrón de `theme.service.spec`), 4 casos.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H3.S1.M1 | `cart.storage.ts`: implementación real sobre `localStorage`, clave `mantra.pharmacy.cart.<userId>`, `try/catch` en lectura y escritura | Guarda y lee; con storage roto no explota | spec | TODO |
| H3.S1.M2 | `effect()` en el store sobre `auth.userId()`: carga al cambiar, escribe en cada cambio; proveer la implementación real en `app.config` como `TutorialProgressStore` | Recargar conserva; otro usuario no ve | spec + prueba manual en el navegador con captura | TODO |
| H3.S1.M3 | SSR: sin `window` no se toca storage | `yarn build` y `serve:ssr` no rompen en `/my-account/pharmacy/cart` | `corepack yarn build` exit 0 | TODO |
| H3.S1.M4 | Nota de privacidad en el JSDoc del store y en `PLAN.md`: qué se guarda, dónde, cuándo se borra | Está escrita con esas tres respuestas | lectura | TODO |

#### H3.S2 — `toDraft(site)`

**CA:** Dado un carrito y una `AvailabilitySite`, cuando se llama `toDraft`, entonces cada línea tiene `precio`/`moneda` desde `site.products` y `disponible = false` si falta o está en `missingProductIds`; `requestId` es el del carrito o `''`.
**DoD:** spec que compara con `borradorDePedido()` importada de `where-to-buy.ts` para las mismas entradas.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H3.S2.M1 | `toDraft(site)` en el store | Devuelve `BorradorDePedido` completo | `corepack yarn typecheck` | TODO |
| H3.S2.M2 | Spec de igualdad estructural contra `borradorDePedido()` (líneas con y sin stock, con y sin `requestId`) | 3 casos en verde | `npx ng test --include='src/app/core/data-access/pharmacy-cart/*.spec.ts' --watch=false` | TODO |

### H4 — El ícono en la cabecera

**Prioridad:** `ALTA`

**CA:** Dado un paciente con 3 unidades en el carrito, cuando mira la cabecera, entonces hay un enlace a `/my-account/pharmacy/cart` con el ícono `bag`, un badge «3» y `aria-label` «Carrito, 3 unidades en Farmacia X»; con carrito vacío no hay badge; la médica no ve el enlace.
**DoD:** `shell-layout.spec.ts` con 3 casos nuevos en verde y los existentes intactos; captura 1440 claro y oscuro.
**Estado:** TODO

#### H4.S1 — El bloque del ícono

**CA:** Dado el bloque de Chats en `shell-layout.html`, cuando se calca para el carrito, entonces usa `app-nav-icon name="bag"`, `app-badge` con `unitCount()`, `data-testid="header-cart"` / `header-cart-badge` y se muestra sólo si `esPaciente`.
**DoD:** spec + capturas.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H4.S1.M1 | Inyectar `CartStore` en `shell-layout.ts` y exponer `unidadesDelCarrito()` y `etiquetaCarrito()` | Compila; la etiqueta dice número y farmacia | `corepack yarn typecheck` | TODO |
| H4.S1.M2 | El bloque en `shell-layout.html` junto a Chats, sólo para paciente | Paciente lo ve; médica no | `shell-layout.spec.ts` (2 casos) | TODO |
| H4.S1.M3 | Badge sin «0», `aria-hidden`, número en el `aria-label` del enlace | Con 0 no hay badge; con 3 dice 3 | `shell-layout.spec.ts` (1 caso) | TODO |
| H4.S1.M4 | Capturas 375 y 1440, claro y oscuro, con badge | Cuatro capturas miradas | `evidencia/h4/capturas/` | TODO |

### H5 — La pantalla del carrito

**Prioridad:** `ALTA`

**CA:** Dado `/my-account/pharmacy/cart`, cuando hay carrito, entonces se ven farmacia, sede, dirección, las líneas con ± y quitar, el total estimado, «Vaciar», «Seguir comprando» y «Continuar»; vacío es S3 con acción «Ir a la tienda»; «Continuar» revalida con `availability()`, arma el borrador con `toDraft()` y navega a `/my-account/pharmacy-orders/new`; confirmar el pedido vacía el carrito.
**DoD:** spec con `HttpTestingController` ≥ 8 casos; capturas 375/1440; `pharmacy-orders.client.spec.ts` con el caso de `clear()`.
**Estado:** TODO

#### H5.S1 — La pantalla

**CA:** Dado el carrito, cuando la persona cambia una cantidad, quita una línea o vacía, entonces el store y el badge cambian; dado «Continuar» con una sede que ya no publica disponibilidad, se dice en un alert y no se navega.
**DoD:** spec ≥ 8 casos; capturas.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H5.S1.M1 | `features/account/pharmacy/cart/cart-page.{ts,html,css}` con `PageHeader`, cabecera de sede, líneas (`pharmacy-cart-lines`), ± (`pharmacy-store-qty-*` reusados), quitar, total (`pharmacy-cart-total`) | Se pinta lo que hay en el store | spec | TODO |
| H5.S1.M2 | Vacío = S3 con acción «Ir a la tienda» (`PHARMACY_ROUTE`) | Sin carrito, S3 | spec | TODO |
| H5.S1.M3 | «Vaciar» con `DialogService.confirm()` (`pharmacy-cart-clear`); «Seguir comprando» → `pharmacyStoreRoute(pharmacyId, siteId)` | Cancelar no vacía; confirmar sí | spec | TODO |
| H5.S1.M4 | «Continuar» (`pharmacy-cart-continue`): `availability({productIds, origin?})` → sede por `siteId` → `prepararBorrador(toDraft(site))` → navegar a `/my-account/pharmacy-orders/new`; sede ausente o error → alert, sin navegar; botón deshabilitado mientras consulta | Navega una vez; en error no navega | spec con `HttpTestingController` (3 casos) | TODO |
| H5.S1.M5 | Entrada hija `my-account/pharmacy/cart` en `app.routes.ts` (`PANTALLAS_HIJAS`), breadcrumb Panel › Mi cuenta › Farmacia | La ruta abre y el breadcrumb es ese | `corepack yarn build`; captura | TODO |
| H5.S1.M6 | Capturas 375 · 768 · 1440 claro + 1440 oscuro, con carrito y vacío | Ocho capturas miradas | `evidencia/h5/capturas/` | TODO |

#### H5.S2 — Vaciar al confirmar el pedido

**CA:** Dado `enviar()` con `POST` exitoso, cuando termina, entonces `CartStore.clear()` se llamó y `unitCount() === 0`.
**DoD:** caso nuevo en `pharmacy-orders.client.spec.ts`.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H5.S2.M1 | En `pharmacy-orders.client.ts` `enviar()`: `tap(() => { this.draft.set(null); this.cart.clear(); })` | Tras enviar, carrito vacío | `npx ng test --include='src/app/core/data-access/pharmacy-orders/pharmacy-orders.client.spec.ts' --watch=false` | TODO |

### H6 — «Lugares cercanos» desaparece, con redirección

**Prioridad:** `ALTA`

**CA:** Dado el paciente, cuando mira el menú, entonces no hay «Lugares cercanos»; `/nearby-places` redirige a `/my-account/pharmacy`; `grep -rn nearby-places src/app/core` = 0; y los specs pasan con las listas corregidas, sin `skip`.
**DoD:** typecheck, build y specs de navegación, shell-layout y directories-overview en verde (salvo el rojo preexistente de íconos, anotado).
**Estado:** TODO

#### H6.S1 — Inventario y registro

**CA:** Dado el grep, cuando se clasifica cada hit, entonces cada uno tiene decisión (borrar / redirigir / dejar) y el registro ya no nombra la sección.
**DoD:** `INVENTARIO.md`; `navigation.map.ts`, `navigation.subgroups.ts`, `access-tree.ts`, `tutorials/definitions` sin `nearby-places`.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H6.S1.M1 | `grep -rn "nearby-places\|NearbyPlaces\|Lugares cercanos" src --include=*.ts --include=*.html` clasificado en `evidencia/h6/INVENTARIO.md` | Cada hit con decisión | conteo del grep = filas del inventario | TODO |
| H6.S1.M2 | Borrar la sección `nearby-places` de `navigation.map.ts` y el bloque «Lugares cercanos» de `navigation.subgroups.ts`; `access-tree.ts` y tutoriales si la nombran | `grep -n nearby-places src/app/core` = 0 | `corepack yarn typecheck` | TODO |
| H6.S1.M3 | Corregir `navigation.*.spec.ts`, `shell-layout.spec.ts:429` y `directories-overview.spec.ts` **sin `skip`** | Las listas pierden un elemento; los casos siguen | `npx ng test --include='src/app/core/navigation/*.spec.ts' --include='src/app/features/shell-layout/*.spec.ts' --include='src/app/features/directories-overview/*.spec.ts' --watch=false` | TODO |

#### H6.S2 — Borrar la pantalla y redirigir

**CA:** Dado `/nearby-places`, cuando se abre, entonces termina en `/my-account/pharmacy`; los cuatro archivos de la pantalla no existen; el `search-origin-picker/` sigue.
**DoD:** `git rm` de los cuatro; entrada en `RUTAS_HEREDADAS`; índice regenerado; build limpio.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H6.S2.M1 | `git rm` `nearby-places.{ts,html,css,spec.ts}`; quitar `'nearby-places'` de `PANTALLAS_DIFERIDAS` | `ls src/app/features/nearby-places` = sólo `search-origin-picker/` | `corepack yarn typecheck` | TODO |
| H6.S2.M2 | `RUTAS_HEREDADAS`: `'nearby-places' → '/my-account/pharmacy'` | La URL vieja redirige | prueba en navegador + captura | TODO |
| H6.S2.M3 | Regenerar `component-index.generated.ts` | Sin `NearbyPlaces` | `node scripts/generate-component-index.mjs && grep -c NearbyPlaces src/app/features/component-stock/component-index.generated.ts` = 0 | TODO |

#### H6.S3 — El carril 19 queda superado y la decisión registrada

**CA:** Dado `docs/progress/` de la raíz, cuando alguien busca el carril 19, entonces dice «superado por el 43/46» y la decisión de que imagenología y centros cercanos dejan de tener pantalla está escrita.
**DoD:** diff en `docs/source-of-truth/tareas-index.json`, `docs/progress/STATUS.md`, `docs/progress/DECISIONS.md`.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H6.S3.M1 | Estado del carril 19 = superado, con fecha y por quién | Está escrito | `grep -n "19" docs/progress/STATUS.md` | TODO |
| H6.S3.M2 | Entrada en `DECISIONS.md`: Cotizaciones se queda; imagenología y centros cercanos pierden pantalla; «Cómo llegar» de la vitrina pública sigue | Está escrita con las tres frases | lectura | TODO |

### H7 — Borrar el hub viejo (Ola 3)

**Prioridad:** `MEDIA`

**CA:** Dado que Justin (tienda) e Itzan (página de farmacia) mergearon, cuando se borra `features/account/pharmacy-hub/`, entonces `grep -rn PharmacyHub src` = 0 y la suite sigue en verde.
**DoD:** `git rm -r`, índice regenerado, comentarios de `navigation.map.ts` y `app.routes.ts` sin el nombre.
**Estado:** TODO

#### H7.S1 — El borrado

**CA:** Dado el merge de Justin e Itzan en `origin/mockup`, cuando se corre el grep, entonces nada importa `pharmacy-hub`.
**DoD:** typecheck, build y suite en verde.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H7.S1.M1 | Confirmar en el daily que Justin H3.S5 e Itzan H4 están **PUBLICADO** en `origin/mockup` | Dos filas PUBLICADO | lectura del daily | TODO |
| H7.S1.M2 | `git rm -r src/app/features/account/pharmacy-hub`; ajustar comentarios que lo nombran | `grep -rn "pharmacy-hub\|PharmacyHub" src` = 0 | `corepack yarn typecheck && corepack yarn build` | TODO |
| H7.S1.M3 | Regenerar el índice y correr la suite | En verde salvo los preexistentes | `corepack yarn test --watch=false` | TODO |

### H8 — Regresión y cierre

**Prioridad:** `ALTA`

**CA:** Dado el turno, cuando se cierra, entonces `typecheck`, `lint`, `build` y `test` están sin rojos nuevos, el `REPORTE.md` tiene el avance en la primera línea y la nota de privacidad del carrito.
**DoD:** salidas pegadas; peldaño declarado por área.
**Estado:** TODO

#### H8.S1 — Cierre honesto

**CA:** Dado cada microtarea, cuando se lee su estado, entonces es uno de los seis y las `A MEDIAS` traen las cuatro respuestas (qué anda, qué no, qué falta, qué se probó).
**DoD:** `REPORTE.md` con las tres secciones; `git status` limpio; nada corriendo.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H8.S1.M1 | Regresión completa | Sin rojos nuevos | `corepack yarn typecheck && corepack yarn lint && corepack yarn build && corepack yarn test --watch=false` | TODO |
| H8.S1.M2 | PRs a `mockup` mergeables (H2 ya mergeado; el resto en uno o dos PRs) | `gh pr view` sin conflictos, checks en verde | `gh pr view --json mergeable,mergeStateStatus` | TODO |
| H8.S1.M3 | `REPORTE.md` con avance en la primera línea, las tres secciones y la nota de privacidad | Existe y cumple | `python .claude/hooks/report_gate.py` (si aplica) | TODO |
| H8.S1.M4 | Daily personal y de equipo actualizados; nada corriendo | `git status` limpio; sin procesos | `ps | grep -c "ng serve"` = 0 | TODO |

## 5. Ambigüedades registradas

| ID | Ambigüedad | Supuesto con el que trabajás | Quién puede resolverla | Qué bloquea |
|---|---|---|---|---|
| Q-P1 | ¿El ícono del carrito se ve en toda la sesión del paciente o sólo dentro de Farmacia? | En toda la sesión (estándar ecommerce) | Justin (propietario del pedido) | nada: es un `@if` |
| Q-P2 | ¿Guardar nombres de medicamentos en `localStorage` es aceptable para negocio? | Sí, en el navegador de la propia persona, con clave por usuario, sin logs, borrado al confirmar; declarado en el reporte | Negocio + Pablo | H3.S1 |
| Q-P3 | ¿Tope de unidades por línea? | El `availableQuantity` de la sede al continuar; en la pantalla, 99 | Justin | H5.S1.M1 |
| Q-P4 | ¿`bag` o un ícono nuevo de carrito? | `bag` (existe en el catálogo; el test de deriva de íconos ya está en rojo por otra causa) | dueño del sistema de íconos | nada |
| Q-P5 | Al sacar «Lugares cercanos» se pierde imagenología y centros cercanos desde el menú | Es lo pedido; queda en `DECISIONS.md`; «Cómo llegar» de la vitrina pública sigue | Justin | H6.S3 |

## 6. Definition of Done del hito

- [ ] Todas sus microtareas en `HECHO`, o en `A MEDIAS`/`BLOQUEADO`/`DESCARTADO` **con las cuatro respuestas**.
- [ ] La salida literal del comando de cada DoD está en `evidencia/`, no parafraseada.
- [ ] `corepack yarn lint`, `typecheck`, `build` y `test --watch=false` sin rojos **nuevos** respecto del baseline.
- [ ] **H2 mergeado en `origin/mockup` y publicado en el daily en la primera hora.**
- [ ] El carrito nunca aparece en logs ni capturas con datos de una persona real: sólo `paciente@alovida.mock`.
- [ ] Los estados del carrito (con líneas, vacío S3, continuar cargando, sede caída) existen y son accionables.
- [ ] Ningún spec con `skip`, aserción borrada ni tolerancia ampliada; las listas cerradas se corrigieron.
- [ ] Capturas por viewport y tema, **miradas**, con una línea cada una.
- [ ] Peldaño de evidencia declarado por área (regla 30).
- [ ] El `PLAN.md` está actualizado en el momento, no al final.

## 7. Cómo cerrás el turno

1. **Checkpoint** en cada apertura y cierre de microtarea. Prohibido encadenar más de tres operaciones
   materiales sin uno.
2. **`REPORTE.md`** con el avance en la **primera línea**: `> **AVANCE: <HECHO> / 43 — <%>.**`
3. **Las tres secciones obligatorias existen siempre.** Una vacía se escribe con «ninguna».
4. **H7 no cierra como `BLOQUEADO`** si Justin o Itzan no mergearon: queda `TODO` con la precondición escrita.
5. **Publicá H2 apenas esté**: los otros tres arrancan con eso.
6. **Enumerá qué quedó corriendo** y cerralo.
7. **Tu daily** es `Pablo-Daily-Noche-2026-09-25.md`, en la carpeta de arriba.

## 8. Revisión adversarial antes de cerrar

1. ¿Un carrito de otra sede se pisa sin preguntar, o `add()` devuelve `conflict` y nadie lo maneja?
2. ¿Un producto con receta entra al carrito por `add()` sin `requestId`?
3. ¿Recargar con otro usuario muestra el carrito del anterior?
4. ¿El badge se anuncia dos veces al lector de pantalla (número en el `aria-label` **y** badge visible al árbol accesible)?
5. ¿«Continuar» navega aunque la sede ya no publique disponibilidad?
6. ¿Confirmar el pedido deja el carrito con unidades?
7. ¿Sacaste «Lugares cercanos» con un `skip` o borrando una aserción?
8. ¿Borraste el `search-origin-picker/` junto con la pantalla?
9. ¿Borraste el hub antes de que Justin e Itzan mergearan, dejando la ruta `/my-account/pharmacy` muerta?
10. ¿Se declara verificado algo que sólo fue inspeccionado estáticamente?
