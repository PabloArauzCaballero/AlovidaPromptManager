# Daily de equipo — noche del 2026-09-25

> **REPARTIDO: 4 / 4 carriles de persona · dos paquetes por persona (8 / 8 carriles del plan Farmacia +
> 4 carriles del contrato Carga Masiva) · 8 / 8 requisitos de Farmacia con dueño · 52 hitos · 93 subtareas ·
> 493 microtareas.**
> **AVANCE DEL TURNO: 0 / 493 — 0,0 %.** ← se llena al cerrar, con `microtareas HECHO / total`.
> Pablo 0/102 (43 Farmacia + 59 Carga Masiva) · Justin 0/109 (41 + 68) · Marcelo 0/128 (30 + 98) ·
> Itzan 0/154 (45 + 109). **Ender no participa de ninguno de los dos** (pedido del propietario).
> **`A MEDIAS` cuenta como no hecha. `DESCARTADO` no suma: se declara aparte con su motivo.**

> **Estado:** `REPARTIDO` al 2026-09-25. **Esta noche el equipo tiene DOS paquetes de trabajo en paralelo**,
> cada persona con un carril de cada uno, documentados como dos secciones en este mismo daily porque la
> estructura del repo admite un único daily de equipo y un único daily personal por turno y fecha. Ninguno
> reemplaza al otro: **ambos se hacen** (decisión del propietario, 2026-09-25). Este documento se escribió
> **al repartir, antes del turno**; las secciones «PUBLICADO» y la tabla de cierre se llenan con lo que cada
> carril ejecute.

- **Turno:** noche · **Fecha:** 2026-09-25
- **Paquete 3, agregado después del reparto por pedido del propietario:** «El encuentro clínico doctor–paciente» — diez carriles (113 microtareas) repartidos entre las mismas cuatro personas, **sin Ender**. Se suma a los dos paquetes de arriba, no los reemplaza; su sección está al final de este daily.

## Paquete 1 — Farmacia como tienda (ecommerce)

- **Paquete fuente:** el pedido del propietario de rehacer «Farmacia» como una tienda (ecommerce)
- **Fuente del pedido (verbatim, con procedencia):** [`FARMACIA-ECOMMERCE-2026-09-25.md`](../../../docs/requisitos/FARMACIA-ECOMMERCE-2026-09-25.md)
- **Verificación contra el código real:** [`VERIFICACION-CONTRA-CODIGO-2026-09-25.md`](../../../docs/verificacion/VERIFICACION-CONTRA-CODIGO-2026-09-25.md)
- **Plan maestro (orden, dependencias, kill-tests):** [`PLAN-MAESTRO.md`](../../../docs/trabajo/2026-09-25-plan-y-reparto-farmacia-ecommerce/PLAN-MAESTRO.md) · **Plan completo:** [`planes/04-farmacia-ecommerce-2026-09-25/README.md`](../../../planes/04-farmacia-ecommerce-2026-09-25/README.md)
- **Repo de destino:** `alovida/mantra-core-health` · Ref: `origin/mockup` ·
  **Corte: `bf2c35452363ede1d367f94c4fd726b2b9a63cb1`** (2026-09-25T00:34-04, PR #660). Y para Marcelo, además, `alovida/mantra-core-health-api` · `origin/dev` @ `343795cc2d08745692f491c50e81427215043315`
- Peldaño de evidencia del reparto: **`DISCOVERED`** (regla 30). Se leyó el árbol de git de los dos repos; **no se ejecutó nada del plan**.

### 0. Los cuatro hechos que ordenan la Ola de Farmacia

1. **El motor del pedido ya existe y sirve sin receta.** `prepararBorrador()` → revisión `/my-account/pharmacy-orders/new`
   → checkout → `POST /pharmacy/orders`; con `requestId: ''` el adaptador omite `medicationRequestId`. **Nadie
   escribe un checkout nuevo.** El carrito termina ahí.
2. **La vía B ya está construida.** `where-to-buy/:requestId` ordena una receta entera por «más barato» y «más cerca»
   desde hace dos semanas. Le falta **un botón** que la vuelque al carrito. Reescribirla es duplicar 1 032 líneas.
3. **Hay una Ola 0 de una hora y después nadie espera a nadie.** Pablo H2 (tipos + `CartStore` en memoria + rutas +
   testids) y Marcelo H2 (tipos + `getPharmacy` + `getSitePrices` + mocks) van en PRs propios, chicos, mergeados
   primero y **publicados acá** (§4-bis). Todo lo demás compila contra eso. Lo que no llega se simula en tres
   niveles y se declara (regla 65); `BLOQUEADO` sin simulación no es un cierre válido.
4. **La maqueta que el propietario mira no tiene backend.** `mockBackend: true` fijo. Todo DoD se demuestra contra
   `src/app/core/mock/**`, que esta noche es de **Marcelo** (`pharmacy.handlers.ts`). El contrato real de la API
   (sedes sueltas, filtro por farmacia) lo cierra Marcelo en su repo, en paralelo, sin que nadie lo espere.

### 1. Quién tiene qué

| Persona | Encargo | Carriles del plan | Requisitos | Hitos | Subtareas | Microtareas | Estado |
|---|---|---|---|---:|---:|---:|---|
| **Pablo** | [El carrito en la cabecera, uno por farmacia, y «Lugares cercanos» que desaparece](Pablo/Noche-Farmacia.CarritoYNavegacion/CarritoEnLaCabeceraYAdiosLugaresCercanos.md) | 41, 46 | R2, R3, R5 | 8 | 12 | 43 | `TODO` |
| **Justin** | [La tienda: buscador por precio y distancia, y la receta completa al carrito](Justin/Noche-Farmacia.TiendaYReceta/BuscadorPorPrecioYDistanciaYLaRecetaAlCarrito.md) | 43, 45 | R1, R4, R6, R7 | 6 | 11 | 41 | `TODO` |
| **Marcelo** | [Cliente y mocks de farmacia, y el contrato real en la API](Marcelo/Noche-Farmacia.DatosYContratoReal/ClienteMocksYEndpointsRealesDeFarmacia.md) | 42, 47 | R1, R4 (datos) | 7 | 8 | 30 | `TODO` |
| **Itzan** | [La página de cada farmacia con su catálogo a precio real, y los tres recorridos de punta a punta](Itzan/Noche-Farmacia.PaginaDeFarmaciaYQA/CatalogoConPrecioRealYRecorridosDePuntaAPunta.md) | 44, 48 | R1, R3, R4 (tienda) · DoD de todos | 6 | 12 | 45 | `TODO` |
| | | **8 de 8** | **8 de 8 cubiertos** | **27** | **43** | **159** | |

> ⚠️ **Esto es más de lo que entra en una noche, y está dicho a propósito.** Cada prompt dice en qué orden
> ir y qué vale más si hay que elegir. **Lo que no se cierre va `A MEDIAS`** con qué anda, qué no anda y qué
> falta exactamente. **Recortar alcance es decisión de coordinación, y se registra.**

### 2. Cobertura de los 8 — el kill-test del reparto

Una fila sin persona o sin hito significa que ese requisito **no está repartido**.

| ID | En una línea | Persona | Hito |
|---|---|---|---|
| R1 | Farmacia como tienda (ecommerce), sin pestañas | Justin (home) + Itzan (página de farmacia) + Pablo (borra el hub) | Justin H3 · Itzan H2–H3 · Pablo H7 |
| R2 | Carrito como ícono en la cabecera | Pablo | H4 |
| R3 | Carrito por farmacia específica, con conflicto al cambiar | Pablo (store) + Justin/Itzan (lo consumen) | Pablo H2, H3, H5 · Justin H3.S2 · Itzan H3.S2 |
| R4 | Buscador con filtros precio y distancia, dos modos | Justin (buscador) + Marcelo (datos) | Justin H2, H3 · Marcelo H2, H3, H4, H5 |
| R5 | «Lugares cercanos» desaparece; Cotizaciones se queda | Pablo | H6 |
| R6 | Receta completa por ambas vías, con ambos filtros | Justin | H4, H5 |
| R7 | Botón de receta «lo más limpio» (dentro de Farmacia) | Justin | H3.S1.M3 |
| R8 | Plan repartido sin Ender, publicado en `main` | Coordinación (este documento) | — |

### 3. Lo primero, para todos (Farmacia)

Antes de la primera microtarea: instalar el estándar (sección 1 del encargo) y **pegar la salida de
los tres comandos** en el daily personal. Un turno que arranca sin eso arranca en `BLOQUEADO`.

```bash
ls .claude/skills | wc -l            # -> 179
ls .claude/rules/[0-9]*.md | wc -l   # -> 15  (mas el README, que no es una regla)
python .claude/hooks/plan_gate.py --self-test    # -> 11 PASS, 0 FAIL
```

Y los comandos reales del front (`mantra-core-health`, yarn 4 por corepack — **nunca npm**):

```bash
corepack yarn install --immutable && corepack yarn start   # http://localhost:4200, sin backend
corepack yarn typecheck
corepack yarn lint
npx ng test --include=<spec> --watch=false
corepack yarn build                                        # presupuesto inicial: hoy 1,29 MB de 1,3 MB
E2E_BASE_URL=http://localhost:4200 npx playwright test playwright/<spec> --workers=1
```

**Cuentas de la maqueta** (cualquier contraseña no vacía): `paciente@alovida.mock`, `medica@alovida.mock`. Son
**sintéticas declaradas**. **Ningún dato real de paciente, nunca** (regla 90.2). El carrito guarda nombres de
medicamentos: es dato de salud, y se trata como tal (Pablo, `data-privacy-phi`).

**Regla 70:** un `yarn start`, un build, un navegador, Playwright con `--workers=1`. Nada en background que no cierres vos.
**En la API, nadie levanta el stack Docker sin pedir permiso** (`CLAUDE.md` de la raíz): Marcelo trabaja con specs de controlador.

### 4. Orden de dependencia — quién espera a quién (Farmacia)

```
Pablo   ──(H2: tipos + CartStore en memoria + rutas + testids, PR propio, 1 h)──▶ Justin, Itzan (importan el store)
Marcelo ──(H2: tipos + getPharmacy + getSitePrices + mocks, PR propio, 1 h)─────▶ Justin, Itzan (importan el cliente)
Marcelo ──(H3.S1: fixtures FARMACIA_DETALLE, PRECIOS_DE_SEDE, SEDES_CERCANAS)───▶ Justin, Itzan (sus specs)
Justin  ──(H3.S5: la ruta /my-account/pharmacy apunta a la tienda)───────────────▶ Pablo H7 (borra el hub)
Itzan   ──(H4: la página de farmacia publicada)──────────────────────────────────▶ Pablo H7 (borra el hub)
Pablo, Justin, Marcelo, Itzan ──(todo mergeado)──────────────────────────────────▶ Itzan H5–H6 (e2e, regla visual, veredicto)
```

| Quien espera | De quién | Qué exactamente | Qué hace mientras tanto |
|---|---|---|---|
| Justin (H2–H5), Itzan (H2–H4) | Pablo (H2) | `CartStore`, tipos, `pharmacy.routes.ts`, `pharmacy.testids.ts` en `origin/mockup` | Nada que esperar más de una hora. Si se demora, codean contra el contrato del plan §4.2–4.3 con un doble local y lo declaran |
| Justin (H2–H3), Itzan (H2–H3) | Marcelo (H2) | `getPharmacy`, `getSitePrices`, tipos y mocks | Idem: `HttpTestingController` con las formas del plan §4.4 (tres niveles) |
| Justin, Itzan (specs) | Marcelo (H3.S1) | Las tres fixtures | Arman las suyas con los tipos; las reemplazan cuando lleguen |
| Pablo (H7) | Justin (H3.S5), Itzan (H4) | La tienda y la página de farmacia **PUBLICADO** | Sigue con H3–H6; H7 queda `TODO` con la precondición escrita, nunca `BLOQUEADO` |
| Itzan (H5–H6) | los cuatro | Todo mergeado en `origin/mockup` | Cierra H2–H4 y prepara los specs e2e contra los testids congelados (§4.5 del plan) |
| Justin (H5.S2) | Pablo | Un caso en `cart.store.spec.ts` (`medicationRequestId`) | Lo pide por acá; si no llega, el spec va en su carpeta contra `createOrderRequest` |

**Nadie se queda esperando.** La regla 65 es obligatoria: si el insumo del otro no llegó y su contrato se
puede nombrar —y acá **todos** los contratos están nombrados en el plan §4—, se simula en **tres niveles**
(correcto, límite e inválido), se cierra la microtarea contra el doble y **se declara**.

**Si dos personas miden lo mismo y les da distinto, eso es un hallazgo, no un empate a resolver charlando.**
Gana el archivo abierto, y la diferencia se registra.

### 4-bis. PUBLICADO — se llena durante el turno

Cada carril anuncia acá lo que otros consumen, con ruta y ejemplo. Vacío al repartir.

| Qué | Quién | Cuándo se espera | Ruta / ejemplo | Estado |
|---|---|---|---|---|
| Contratos del carrito: tipos, `CartStore` en memoria, `pharmacy.routes.ts`, `pharmacy.testids.ts` | Pablo, H2 | **primera hora** | | `TODO` |
| Cliente: `getPharmacy`, `getSitePrices`, tipos; mocks `/pharmacy/pharmacies/:id`, `/pharmacy/sites/:siteId/prices` | Marcelo, H2 | **primera hora** | | `TODO` |
| Fixtures `FARMACIA_DETALLE`, `PRECIOS_DE_SEDE`, `SEDES_CERCANAS` | Marcelo, H3.S1 | temprano | | `TODO` |
| `CartStore` persistente + `toDraft()` | Pablo, H3 | primera mitad | | `TODO` |
| Ícono del carrito en la cabecera | Pablo, H4 | primera mitad | | `TODO` |
| Pantalla `/my-account/pharmacy/cart` | Pablo, H5 | primera mitad | | `TODO` |
| La ruta `/my-account/pharmacy` apunta a la tienda; `?tab=` redirige | Justin, H3.S5 | primera mitad | | `TODO` |
| Página de farmacia `/my-account/pharmacy/stores/:pharmacyId` | Itzan, H4 | primera mitad | | `TODO` |
| «Lugares cercanos» fuera del menú; `/nearby-places` redirige | Pablo, H6 | segunda mitad | | `TODO` |
| `/my-account/pharmacy/prescriptions` + «Agregar la receta al carrito» en where-to-buy | Justin, H4–H5 | segunda mitad | | `TODO` |
| `GET /pharmacy/sites` y `pharmacyId` en `/pharmacy/products` en la API real (PR a `dev`) | Marcelo, H4–H6 | segunda mitad | | `TODO` |
| Hub viejo borrado | Pablo, H7 | **Ola 3** | | `TODO` |
| Tres e2e + regla visual + veredicto por requisito | Itzan, H5–H6 | **Ola 3** | | `TODO` |

### 5. Reservas de archivos — para que nadie se pise (Farmacia)

Rutas relativas a `mantra-core-health/src/app/`, sobre la rama `mockup`. Sin intersección entre personas.

| Ruta reservada | Para quién |
|---|---|
| `core/data-access/pharmacy-cart/**` · `core/data-access/pharmacy-orders/pharmacy-orders.client.ts` (+ spec, sólo `clear()`) · `features/account/pharmacy/pharmacy.routes.ts` · `features/account/pharmacy/pharmacy.testids.ts` · `features/account/pharmacy/cart/**` · `features/shell-layout/**` (bloque del ícono) · `core/navigation/**` · `core/tutorials/definitions/**` · `features/nearby-places/nearby-places.{ts,html,css,spec.ts}` · `features/account/pharmacy-hub/**` (sólo para borrar, en Ola 3) · `features/directories-overview/*.spec.ts` · en `app.routes.ts`: `RUTAS_HEREDADAS`, `SECCIONES_REDIRIGIDAS`, la entrada `nearby-places` y la hija de `/cart` | **Pablo** |
| `features/account/pharmacy/store-front/**` · `features/account/pharmacy/search/**` · `features/account/pharmacy/prescriptions/**` · `features/account/medical-record/where-to-buy/**` · en `app.routes.ts`: la entrada `my-account/pharmacy` y la hija de `/prescriptions` | **Justin** |
| `core/data-access/pharmacy/**` · `core/mock/handlers/pharmacy.handlers.ts` (+ `pharmacy.handlers.spec.ts` nuevo) · **API:** `mantra-core-health-api/src/modules/pharmacy/**`, `openapi/**`, `docs/PENDIENTES-BACKEND.md` | **Marcelo** |
| `features/account/pharmacy/store/**` · en `app.routes.ts`: la hija de `stores/:pharmacyId` · `playwright/pharmacy-store.spec.ts`, `pharmacy-cart.spec.ts`, `pharmacy-prescription-to-cart.spec.ts` · raíz `docs/progress/evidence/lane-48/**` | **Itzan** |
| `features/nearby-places/search-origin-picker/**` · `features/account/cotizaciones/**` · `features/account/pharmacy-orders/{new-order,checkout,order-*}/**` · `mantra-core-health-model/**` | **NADIE esta noche.** Se leen y se citan; **no se escriben** |

**`app.routes.ts` es el único archivo compartido**: cada carril agrega **sólo su línea** en `PANTALLAS_HIJAS` /
`PANTALLAS_DIFERIDAS`; un conflicto ahí es de una línea y lo resuelve quien mergea segundo. **Dos personas
escribiendo el mismo archivo fuera de eso es un defecto del reparto, no un accidente.** Quien necesite un cambio en
la ruta de otro **lo pide por este daily y no lo escribe**.

### 6. Ambigüedades abiertas — se arrastran, no se resuelven (Farmacia)

Las de cada carril están con supuesto y dueño en su prompt (§5). Las que cruzan a más de una persona:

| ID | Qué | Quién la cierra | Estado |
|---|---|---|---|
| Q-T1 | ¿El ícono del carrito se ve en toda la sesión del paciente o sólo dentro de Farmacia? | Justin (propietario) — supuesto: toda la sesión | `ABIERTA` |
| Q-T2 | Nombres de medicamentos en `localStorage` (dato de salud en el navegador propio) | Negocio + Pablo — supuesto: sí, clave por usuario, sin logs, borrado al confirmar | `ABIERTA` |
| Q-T3 | ¿La receta al carrito lleva sólo lo disponible en la sede? | Justin + Pablo — supuesto: sólo lo disponible; lo faltante se avisa | `ABIERTA` |
| Q-T4 | ¿`requiresPrescription` y los montos existen en `PharmacySitePriceDto` real? | Marcelo, abriendo el DTO en H2.S1.M1 | `ABIERTA` |
| Q-T5 | Imagenología y centros médicos cercanos pierden pantalla al borrar «Lugares cercanos» | Justin — supuesto: es lo pedido; queda en `DECISIONS.md` | `ABIERTA` |

### 7. Hallazgos que afectan a todo el equipo (Farmacia, de la verificación contra el código)

| ID | Qué | A quién le pega |
|---|---|---|
| **HALL-F1** | El precio no está en `searchProducts()`: sólo en `availability()` y en `sites/:siteId/prices` | Justin, Itzan |
| **HALL-F2** | La API real no lista sedes sueltas ni filtra productos por farmacia; la maqueta anda con mocks | Marcelo; todos al salir del mock |
| **HALL-F3** | `where-to-buy` ya es la vía B completa; se le agrega un botón, no se rehace | Justin |
| **HALL-F4** | `search-origin-picker/` vive dentro de `nearby-places/`; se borra la pantalla, no la carpeta | Pablo |
| **HALL-F5** | `Tabs` monta la pestaña 0 de forma transitoria; deja de importar sin pestañas | nadie |
| **HALL-F6** | El carrito en `localStorage` es dato de salud: clave por usuario, sin logs | Pablo |
| **HALL-F7** | Dos rojos preexistentes en `origin/mockup` (`shell-layout.spec` íconos; lint de `navigation.service.spec:16`): se anotan, no se tocan | los cuatro |

---

## Paquete 2 — Motor de carga masiva (CSV/XLSX) por modelo, con drag & drop

- **Paquete fuente:** el pedido del cliente del 2026-09-25 — «un motor para upload masivo de datos… terminología
  médica y otros elementos… dado un Excel o un CSV… seleccionar qué modelo se va a subir y un drag and drop»
- **Contrato compartido:** [`CONTRATO-CARGA-MASIVA.md`](CONTRATO-CARGA-MASIVA.md) — tipos, HTTP, `data-testid`,
  fixtures, supuestos, orden de integración, kill-test. **Todos escriben contra él.**
- **Verificación contra el código real:** «Hechos ya verificados» de cada prompt de este paquete (lectura del
  árbol de los dos repos; **nada ejecutado**)
- **Repos de destino:** `alovida/mantra-core-health-api` (ref `origin/dev`, PR a `dev`) y
  `alovida/mantra-core-health` (ref **`origin/mockup`**, PR a **`mockup`** — regla del propietario: todo cambio
  de frontend termina en PR mergeable a `mockup`), en **worktrees limpios** (el checkout local del front tiene
  cambios sin commitear de Ender del 22/09)
- Peldaño de evidencia del reparto: **`DISCOVERED`**.

### 0. Los tres hechos que ordenan este paquete

1. **El motor ya existe y es angosto.** `POST /terminology/versions/:id/import-file` importa conceptos por
   archivo, por tandas, con lote y errores por línea — **sólo NDJSON**. Itzan lo ensancha (CSV/XLSX vía
   contrato, dry-run, todo o nada, idempotencia contra Postgres) y escribe el contrato de fila, el detector, el
   CSV y los perfiles; Marcelo escribe el parseador XLSX, los fixtures y decide la dependencia. **Ender no está
   esta noche**: su carril de parseo se repartió entre los dos (Q-10).
2. **La pantalla y el drag & drop ya existen.** `admin/terminology/version-import` + `app-file-input`
   (dropzone). Justin agrega «qué se carga» con plantilla, «validar sin guardar», vista previa, resumen.
3. **Los «otros elementos» ya son conceptos de terminología** (`src/common/seed/*.catalog.ts`): entran por el
   mismo motor eligiendo su sistema (Q-1). El esquema no se toca.

### 1. Carriles — archivos disjuntos, nadie espera a nadie

| Persona | Carril | Repo | Hitos | Sub | Micro | Publica temprano (para quién) | Prompt |
|---|---|---|---|---|---|---|---|
| **Itzan** | Motor **y parseo**: contrato de fila, detector, CSV, perfiles, NDJSON + servicio, dry-run, todo o nada, idempotencia, authz, plantilla, OpenAPI | API | 7 | 16 | 109 | `row-contract.ts` **hora 1** (Marcelo, Pablo) · rama arrancable (Justin H6, Marcelo H5/H6, Pablo) | [`ServicioEnsanchadoDryRunTodoONadaIdempotenciaAutorizacionYPlantilla.md`](Itzan/Noche-CargaMasiva.MotorDryRunIdempotencia/ServicioEnsanchadoDryRunTodoONadaIdempotenciaAutorizacionYPlantilla.md) |
| **Justin** | Pantalla: qué se carga, arrastrar, validar sin guardar, vista previa, resumen, doble del simulador | Front | 6 | 10 | 68 | doble del simulador **hora 1,5** (Marcelo) | [`QueSeCargaArrastrarValidarSinGuardarVistaPreviaYResumen.md`](Justin/Noche-CargaMasiva.PantallaDragAndDrop/QueSeCargaArrastrarValidarSinGuardarVistaPreviaYResumen.md) |
| **Marcelo** | Calidad **y parseo XLSX**: E2E, capturas con doble revisión, gates, Q-9, regresión + dependencia XLSX, fixtures de la API, `xlsx-parser.ts` | Front + API | 7 | 15 | 98 | **Q-9 hora 1** (Itzan, Justin) · **fixtures hora 2** (Itzan, Justin) · spec del contrato (Justin) | [`E2EPlaywrightCapturasDobleRevisionGatesYSegundoPerfil.md`](Marcelo/Noche-CargaMasiva.CalidadE2EVisualYGates/E2EPlaywrightCapturasDobleRevisionGatesYSegundoPerfil.md) |
| **Pablo** | Integración: decisiones Q-1…Q-9, merges incrementales, cableado del XLSX, kill-test, dos PR mergeables (API a `dev`, front a `mockup`), reporte consolidado | Ambos | 5 | 9 | 59 | decisiones Q-1…Q-9 en el contrato (todos) | [`IntegrarLosCuatroCarrilesKillTestDelContratoYDosPRMergeables.md`](Pablo/Noche-CargaMasiva.IntegracionYEntrega/IntegrarLosCuatroCarrilesKillTestDelContratoYDosPRMergeables.md) |

### 2. Por qué es imposible bloquearse (regla 65 aplicada al reparto)

| Dependencia | Cómo se rompe |
|---|---|
| Marcelo (XLSX) ← contrato de Itzan | Itzan publica `row-contract.ts` en la hora 1; Marcelo lo cherry-pickea, o lo escribe literal desde el contrato si no está. Itzan no depende del XLSX: sin él, 422 «xlsx no admitido» y CSV + NDJSON enteros; Pablo cablea `XlsxParser` en dos líneas al integrar |
| Justin ← API de Itzan | Justin ensancha el **doble del simulador** (`terminology.handlers.ts`) en tres niveles contra §2; mira la rama de Itzan **una vez** al final |
| Marcelo ← pantalla de Justin | Marcelo escribe el E2E contra los `data-testid` del contrato y lo corre tres veces (pantalla de hoy → rama de Justin → API real), declarando el peldaño de cada una |
| Itzan / Justin ← Q-9 de Marcelo | Marcelo la publica en su daily **antes de la hora 1**; si no está, cada uno la mira 5 min y decide |
| Itzan / Justin ← fixtures de Marcelo (hora 2) | Los tres primeros son triviales: cada uno los crea a mano con §4 si aún no están |
| Pablo ← que los cuatro terminen | Integra **lo que hay** al cerrar cada microtarea; un carril que no llega queda `A MEDIAS` con dueño y el resto se entrega |
| Cualquiera ← Docker / `gh` / cuenta demo / lib XLSX con audit rojo | Columna «Si se traba» en cada fila con el camino alternativo |

**Lo único que legítimamente queda sin cerrar:** una decisión de negocio (Q-1…Q-9 ya tienen supuesto: se
trabaja con él) o una acción destructiva sobre algo compartido (no hay ninguna: esquema y `dev`/`mockup` no se tocan).

### 3. Ambigüedades del reparto (con supuesto; Pablo las confirma en el contrato en su H1.S2)

| ID | Supuesto |
|---|---|
| Q-1 | «Modelo» = perfil + sistema de codificación + versión en borrador |
| Q-2 | Errores parciales → todo o nada |
| Q-3 | Síncrono hasta 10 MiB; sin job |
| Q-4 | Formato/dry-run/perfil no persisten (sin columna): respuesta |
| Q-5 | Vista previa desde el servidor; el front no parsea |
| Q-6 | `code` repetido en el archivo → problema, aborta |
| Q-7 | `code` existente → `skipped`, no se actualiza |
| Q-8 | Desde la UI no se importa sin validar |
| Q-9 | `designaciones` sólo si Marcelo confirma entidad + DTO + repositorio |
| Q-10 | Ender no está: parseo repartido entre Itzan (contrato, detector, CSV, perfiles) y Marcelo (dependencia, fixtures, XLSX) |

---

## Cierre del turno (se llena al cerrar, sumando los dos paquetes por persona)

| Persona | Farmacia HECHO/total | Carga Masiva HECHO/total | **Total persona** | Peldaño | PRs (`mergeable`) | Contra el doble | Sin reporte al cierre |
|---|---|---|---|---|---|---|---|
| Pablo | 0 / 43 | 0 / 59 | **0 / 102** | — | — | — | |
| Justin | 0 / 41 | 0 / 68 | **0 / 109** | — | — | — | |
| Marcelo | 0 / 30 | 0 / 98 | **0 / 128** | — | — | — | |
| Itzan | 0 / 45 | 0 / 109 | **0 / 154** | — | — | — | |
| **Total** | **0 / 159** | **0 / 334** | **0 / 493** | el más bajo | | | |

---

## Paquete 3 — El encuentro clínico doctor–paciente (agregado por el propietario la misma noche)

- **Paquete fuente:** el pedido del propietario del 2026-09-25: «cada hecho es un encuentro entre dos entidades»; ahora el par doctor–paciente: nota médica clave/valor por cita, orden de análisis (laboratorio / imagenología / otro) a partir de las notas, diagnóstico presuntivo, reconsulta con fecha, confirmar o rechazar con motivo y evidencia, receta ligada a un diagnóstico confirmado o a un motivo, enfermedad activa e historia clínica con diagnósticos históricos, nombres homogéneos, y «Mis órdenes» del paciente por tipo con buscador, filtros y paginación (ADR-0015).
- **Plan maestro (modelo, glosario, contratos simulados, reparto, calidad, guardián de Playwright):** [`PLAN-MAESTRO.md`](../../../docs/trabajo/2026-09-25-plan-y-reparto-encuentro-clinico/PLAN-MAESTRO.md)
- **Repo de destino:** `alovida/mantra-core-health` · Ref: `origin/mockup` · **Corte: `bf2c3545`** (PR #660). **La API no se toca**: lo que falta se simula y queda como P39–P42.
- Peldaño de evidencia del reparto: **`DISCOVERED`** (regla 30): se leyó el código de las dos ramas y el simulador; **no se ejecutó nada del plan**.
- **Convivencia con los paquetes 1 y 2:** se cruzaron las listas de archivos reservados de los ocho prompts de arriba contra las de estos diez carriles: **ningún archivo compartido entre personas distintas**; dos cruces dentro de la misma persona (Pablo: `core/navigation/**`; Justin: carpeta `account/medical-record/`), resueltos en secuencia (§4.6 del plan). `app.routes.ts` queda congelado para este paquete.

### Los cuatro hechos que ordenan este paquete

1. **C0 va primero y solo** (Marcelo, ≈3 h): tipos, conceptos, mudanzas de handlers, casillas de la consulta, stubs, `diagnosisStateOf` y `scripts/pw-guard.mjs`. Cuando está en `origin/mockup`, los otros nueve carriles compilan contra eso. Mientras tanto cada uno adelanta lo de §4.5 del plan.
2. **Después de C0 nadie espera a nadie:** listas de archivos reservados disjuntas; los cruces entre carriles son ids en texto (`basedOnNoteIds`, `basedOn.noteId`, `indicationConditionId`, `followUpOf.encounterId`); lo que otro carril no llegó a publicar se deriva o se omite sin romper.
3. **Playwright nunca a pelo:** todo corre por `pw-guard`, que mata y relanza sólo cuelgues e infraestructura; un rojo legítimo se diagnostica (`e2e-failure-triage`), no se relanza.
4. **Calidad con las skills de la casa y `NO_SELF_APPROVAL`:** cada carril carga las skills de diseño y QA del estándar, respeta Regla 8 / ADR-0012 / ADR-0013 / ADR-0015 / M34, corre `critical-double-review` tras cada captura y cierra con `visual-reviewer` + `frontend-reviewer` (≥ 92, cero BLOCKER/CRITICAL/HIGH) y `pr-mergeable-gate`.

### Quién tiene qué

| Persona | Carriles (en este orden) | Prompts | Microtareas | Estado |
|---|---|---|---|---|
| **Marcelo** | C0 (contrato primero, bloquea a todos) → C3 | [C0 · Contrato primero](Marcelo/Noche-EncuentroClinico.C0-ContratoPrimero/ContratoPrimero.md) · [C3 · Diagnóstico presuntivo → confirmado/rechazado; enfermedad activa](Marcelo/Noche-EncuentroClinico.C3-Diagnostico/DiagnosticoPresuntivoConfirmarORechazar.md) | 21 + 12 = **33** | `TODO` |
| **Itzan** | C1 → C2 | [C1 · Nota médica clave/valor](Itzan/Noche-EncuentroClinico.C1-NotasMedicas/NotaMedicaClaveValor.md) · [C2 · Orden de análisis desde la consulta](Itzan/Noche-EncuentroClinico.C2-OrdenesDeAnalisis/OrdenDeAnalisisDesdeLaConsulta.md) | 11 + 11 = **22** | `TODO` |
| **Justin** | C4 → C6 → C8 (mañana) | [C4 · Reconsulta como cita real](Justin/Noche-EncuentroClinico.C4-Reconsulta/ReconsultaComoCitaReal.md) · [C6 · Historia clínica del paciente con encuentros](Justin/Noche-EncuentroClinico.C6-HistoriaPaciente/HistoriaClinicaDelPacienteConEncuentros.md) · [C8 · Integración y recorrido completo](Justin/Noche-EncuentroClinico.C8-Integracion/IntegracionYRecorridoCompleto.md) | 12 + 9 + 10 = **31** | `TODO` |
| **Pablo** | C9 (lo que el propietario pidió ver) → C5 → C7 | [C9 · «Mis órdenes» por tipo con barra y paginación](Pablo/Noche-EncuentroClinico.C9-MisOrdenes/MisOrdenesPorTipoConBarraYPaginacion.md) · [C5 · Receta ligada a diagnóstico confirmado o motivo](Pablo/Noche-EncuentroClinico.C5-Receta/RecetaLigadaADiagnosticoConfirmadoOMotivo.md) · [C7 · Homogeneización de nombres y «Notas médicas»](Pablo/Noche-EncuentroClinico.C7-Nombres/HomogeneizacionDeNombresYNotasMedicas.md) | 10 + 9 + 8 = **27** | `TODO` |
| **Ender** | — (sin carril esta noche, pedido del propietario) | — | 0 | — |
| **Total** | | | **113** | |

### Lo que destraba a otros (publicá temprano)

| Qué | Quién | Para quién | Cuándo | Publicado (SHA + hora) |
|---|---|---|---|---|
| Contrato, casillas, stubs, `pw-guard` en `origin/mockup` | Marcelo (C0) | todos | primero, solo | **Disponible en PR [#693](https://github.com/mdavila-2001/mantra-core-health/pull/693), SHA `8b48f0b5`, 2026-09-25 ~21:20 UTC — NO integrado en `mockup` todavía** (falta review/merge). Quien no quiera esperar el merge puede ramificar directo del PR: los tipos ya están congelados en ese SHA. |
| `GET /charts/notes` con `entries` (ids `uuid('medical-note-<pid>-0')`) | Itzan (C1) | C2, C3, C6, C7 | primera mitad | |
| `category` en `GET /diagnostic-results/me/orders` + 14 órdenes del paciente demo | Itzan (C2) | C9, C6 | primera mitad | |
| `POST /clinical/conditions/:id/verification` | Marcelo (C3) | C5, C6 | primera mitad | |
| `followUpOf` en `GET /scheduling/bookings` | Justin (C4) | C6 | primera mitad | |

### Avance por carril (se llena al cerrar; `A MEDIAS` no suma)

| Carril | Responsable | Corte propio (`origin/mockup @`) | Rama | HECHO/total | Peldaño | PR | Push a `mockup` | Bloqueos / avisos |
|---|---|---|---|---|---|---|---|---|
| C0 · Contrato primero | Marcelo | `72450ff5`/`33a33bca` | `marcelo/feat-clinica-c0-contrato-primero` | 14/21 | TESTED (contrato/handlers/componentes); E2E BLOCKED por CSP ajeno | [#693](https://github.com/mdavila-2001/mantra-core-health/pull/693) MERGEADO | **Sí** — `mockup` @ `10912eb4` | 31/31 casos del E2E completo fallan solo en el `afterEach` de consola por CSP preexistente (confirmado en `/auth`, no C0); P2 (segunda revisión visual) pendiente |
| C3 · Diagnóstico | Marcelo | | `claude/clinica-c3-diagnostico` | 0/12 | | | | |
| C1 · Nota médica | Itzan | | `claude/clinica-c1-notas-medicas` | 0/11 | | | | |
| C2 · Orden de análisis | Itzan | | `claude/clinica-c2-ordenes-analisis` | 0/11 | | | | |
| C4 · Reconsulta | Justin | | `claude/clinica-c4-reconsulta` | 0/12 | | | | |
| C6 · Historia del paciente | Justin | | `claude/clinica-c6-historia-paciente` | 0/9 | | | | |
| C8 · Integración | Justin | | `claude/clinica-c8-integracion` | 0/10 | | | | |
| C9 · Mis órdenes | Pablo | | `claude/clinica-c9-mis-ordenes` | 0/10 | | | | |
| C5 · Receta | Pablo | | `claude/clinica-c5-receta` | 0/9 | | | | |
| C7 · Nombres | Pablo | | `claude/clinica-c7-nombres` | 0/8 | | | | |

### Pendientes de backend que nacen de este paquete (C8 los pasa a `PENDIENTES-BACKEND.md` del front)

| # | Carril | En una línea |
|---|---|---|
| P39 | C1 | filas clave/valor de la nota médica (`entries_json` en `chart.clinical_note_versions`) |
| P40 | C2 | `based_on_note_ids` y `category` textual en `POST /clinical/service-requests` y sus lecturas; concepto `SR_OTHER` |
| P41 | C3 | estados `COND_PROVISIONAL` / `COND_REFUTED`, `POST /clinical/conditions/:id/verification` con motivo y evidencia, regla de activación |
| P42 | C4 | `follow_up_of_booking_id` en la reserva, `ACT_FOLLOW_UP` en la cita directa, «una reconsulta futura por cita» |

### Incidentes de este paquete

(quién, qué, cómo se resolvió, a qué hora)
