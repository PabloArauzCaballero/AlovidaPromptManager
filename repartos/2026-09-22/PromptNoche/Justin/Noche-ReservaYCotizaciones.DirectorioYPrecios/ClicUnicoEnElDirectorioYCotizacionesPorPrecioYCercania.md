# Un clic que se ve y no se repite en el directorio, y las cotizaciones del paciente por precio y cercanía

> **Rol:** dueño del directorio de médicos, de los directorios públicos, de «¿Dónde comprar?» y de «Lugares cercanos» · **Línea:** C · **Fecha:** 2026-09-22 · **Turno:** noche
> **Fuente del pedido:** [`CORRECCIONES-DOCTOR-Y-PACIENTE-2026-09-22.md`](../../../../../docs/requisitos/CORRECCIONES-DOCTOR-Y-PACIENTE-2026-09-22.md) — **R-01, R-02, N-02**
> **Verificación contra el código:** [`VERIFICACION-CONTRA-CODIGO-2026-09-22.md`](../../../../../docs/verificacion/VERIFICACION-CONTRA-CODIGO-2026-09-22.md) — §1, §2 (R-01, R-02, N-02), §4 (HALL-E8, E10, E11)
> **Plan maestro:** [`PLAN-MAESTRO.md`](../../../../../docs/trabajo/2026-09-22-plan-y-reparto-correcciones-doctor-y-paciente/PLAN-MAESTRO.md) — dependés de Ender (latencia, renglón del menú) y Ender depende de tu **medición** de H1
> **6 hitos · 10 subtareas · 51 microtareas**, todas con criterio de aceptación y Definition of Done.
>
> **Tu carril tiene dos mitades que no se parecen.** La primera es un bug de percepción con causa medible:
> el paciente toca un enlace, no ve nada, vuelve a tocar, y cada toque dispara la carga otra vez (R-01),
> sobre una ficha que pide varias cosas en serie con 120–300 ms cada una (R-02). La segunda es una
> pantalla nueva del paciente, «Cotizaciones» (N-02), que **se compone** de tres cosas que ya existen y son
> tuyas: «¿Dónde comprar?», «Lugares cercanos» y los directorios. **Lo que no existe es el precio con
> procedencia de la mitad de las verticales, y eso no se inventa** (HALL-E11).

## 0. Ficha de asignación

| Campo | Valor |
|---|---|
| `REPO` | `alovida/mantra-core-health` (frontend Angular). **Nada de backend en este lote** |
| `TARGET_REF` | `origin/mockup` — corte leído **`b655e8449abd662d6b24156fd6e2b06aeb120cc1`** (2026-09-22T18:04-04). Tu PR #573 ya está adentro. **Reconsultalo y fijá el tuyo** en tu `PLAN.md` |
| `RAMA DE TRABAJO` | Una tuya, saliendo de `origin/mockup`. **Nada directo sobre `mockup`, nada sin PR** |
| `ARCHIVOS RESERVADOS PARA VOS` | `src/app/features/directory/**` · `src/app/features/nearby-places/**` · `src/app/features/account/medical-record/where-to-buy/**` · `src/app/features/laboratory-directory/**` · `src/app/features/public-directories/**` · `src/app/features/account/cotizaciones/**` (nuevo, si H3.S1 lo decide) · `src/app/shared/components/molecules/search-result/**` · `src/app/core/data-access/{public-directory,pharmacy,diagnostic-units}/**` · `src/app/core/mock/handlers/{directory,public,pharmacy,diagnostics}.handlers.ts` |
| `ARCHIVOS DE OTROS — NO LOS TOQUES` | `core/mock/mock-backend.interceptor.ts`, `core/mock/fixtures/**`, `core/mock/handlers/scheduling.handlers.ts`, `core/navigation/**`, `features/shell-layout/**`, `src/app/app.routes.ts` y **los tres barrels** (**Ender**) · `organisms/{data-table,filter-bar}/**`, `molecules/{pagination,row-actions}/**`, `docs/adr/**` (**Pablo**) · `features/quotations/**` (la «Cotizaciones» **del médico**, FT-24: no es la tuya y no se toca) · `features/agenda/**` incluido `booking-new/**` (sin dueño esta noche: si el último paso de la reserva necesita algo, se pide) · `account/my-profile/**`, `auth/**` (**Itzan**) · `symptom-check/**`, `patient-home/**`, `content-dialog/**`, `dialog/**` (**Marcelo**) |
| `⚠️ RIESGO ALTO DE TU CARRIL` | **Inventar un precio.** El único arancel de servicios médicos está en UMA sin conversión declarada; imagenología y análisis no tienen precios publicados. Un número inventado en una pantalla que se llama «Cotizaciones» es exactamente lo que la regla 97.4.1 prohíbe. «Precio no publicado» es una respuesta válida; un número sin fuente no |
| `LA MAQUETA NO TIENE BACKEND` | `mockBackend: true` fijo. La latencia por petición es de Ender (`mock-backend.interceptor.ts:251-259`); los manejadores de directorio, público, farmacia y diagnóstico son tuyos. Un manejador nuevo se escribe como **doble declarado** con la forma REST que le tocaría (regla 65) |
| `CUENTA DE PRUEBA` | `paciente@alovida.mock` (cualquier contraseña no vacía). **Sintética declarada** |
| `DÓNDE SE PRUEBA` | `/directory` → `/directory/:profileId` (ficha + `app-practitioner-availability`) → `/my-account/appointments/book/:slotId` (`app.routes.ts:886-891`). Para N-02: `/my-account/medical-record/where-to-buy`, `/nearby-places`, `/laboratory-directory`, `/clinics-directory`, `/pharmacies-directory`. **Sacá las URLs del router, no las supongas** |
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
ls .claude/skills | wc -l            # -> 176
ls .claude/rules/[0-9]*.md | wc -l   # -> 14  (mas el README, que no es una regla)
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

Son **28**: 11 del proceso y 17 propias del directorio y las cotizaciones.

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
| `frontend-performance` | **la más importante de la primera mitad**: medir peticiones y tiempos antes y después; N+1 en la ficha |
| `frontend-ux-states` | el estado «navegando» y «cargando por sede»; los cuatro estados de Cotizaciones y «sin ubicación» |
| `frontend-forms-ux` | sin doble envío: un clic, un disparo |
| `search-and-filtering` | **la más importante de la segunda mitad**: buscador multicampo, orden por precio y por distancia, normalización |
| `quotations-billing` | qué es una cotización, qué no, y por qué el precio sin fuente es «no publicado» |
| `seed-data-catalogs` | procedencia de todo precio y catálogo que muestres; UMA no es una moneda |
| `maps-geolocation` | origen, distancia, radio; reusar `search-origin-picker` |
| `frontend-data-access` | clientes y `ViewState`; una lectura por médico, no por sede |
| `frontend-data-tables` | los resultados con la disciplina de Pablo (scroll vertical, paginación en cliente) |
| `frontend-navigation-ia` | dónde vive «Cotizaciones» del paciente y por qué no es la del médico |
| `atomic-design-components` | reusar `search-result`, `directory-page`, `filter-bar`, `segmented-control`/`select` |
| `angular-signals-state` | «navegando» como signal derivado de `Router.events`; nada de `effect` para copiar |
| `frontend-accessibility` | `aria-busy`, `role="status"` en la carga, nombre accesible en cada botón |
| `ux-clarity-usability` | por qué «no pasa nada» hace que la gente vuelva a tocar |
| `e2e-playwright` | el recorrido de reserva con `--workers=1`, contando peticiones |
| `unit-testing` | un comportamiento por test; los tres niveles del contrato |
| `angular-testing` | `RouterTestingHarness`, `HttpTestingController` para contar peticiones |
| `visual-proof` | la captura no vale si no la mirás |

Entrá siempre por `skills-router`: **no leas el catálogo entero, no sirve.**

### 1.4 DoD de esta sección — se verifica como cualquier otra

- [ ] `ls .claude/skills | wc -l` devolvió **176**, y la salida está pegada en tu daily.
- [ ] `python .claude/hooks/plan_gate.py --self-test` devolvió **11 PASS, 0 FAIL**, salida pegada.
- [ ] Leíste `skills-router` y las 28 skills de las dos tablas, **empezando por `frontend-performance`**.
- [ ] Creaste tu `PLAN.md` **antes** del primer `Edit`/`Write` de código.

**Sin estas cuatro casillas, tu lote arranca en `BLOQUEADO`, no en `EN CURSO`.**

> ### ✅ Hechos ya verificados contra el corte — no los repitas, pero tampoco los creas sin abrir el archivo
>
> #### R-01 — son enlaces, y un enlace no tiene estado de carga
>
> `practitioners-directory.html:1-50`: la portada son tarjetas `<a class="rejilla__tarjeta" [routerLink]="[]"
> [queryParams]="{ especialidad }">`; dentro de una especialidad, `app-directory-page` (L57) cuyos resultados son
> `molecules/search-result/search-result.html:12` (`<a [routerLink]="r.link">`) y la acción «Revisar
> disponibilidad» L45 (`[routerLink]="accion.link"`). **Ninguno es `app-button` con `isLoading`.** Cada clic
> repetido vuelve a navegar y a cargar. Los botones de cupo (`practitioner-availability.html:71-86`) llaman a
> `reservar()` que hace `router.navigate` (`.ts:190-192`) sin `[isLoading]` ni `[disabled]`.
> **El último paso ya está bien:** `booking-new.html:101-105, 157-161` usan `app-form-actions [pending]`.
> **Para reusar:** `app-button` con `isLoading` (70+ usos) y el armazón, que ya escucha `Router.events`
> (`shell-layout.ts:149-157`, de Ender) — pedile un indicador global si lo querés; el clic único es tuyo.
>
> #### R-02 — cuántas peticiones, y cuánto tarda cada una
>
> `practitioner-detail.ts:139-150`: `getPractitionerProfile` → `forkJoin` con `readConceptLabels` (terminología,
> 40 ms) y archivos. `practitioner-availability.ts:225-250`: `listSlots` **por sede** de la semana visible, y
> **si la semana está vacía, otra búsqueda del próximo hueco** (L242-250, `SEMANAS_ADELANTE = 2`). Cada
> petición tarda `120 + random(0..180)` ms (`mock-backend.interceptor.ts:251-259`, Ender). Con N sedes: N–2N
> peticiones. **No hay medición**: es tu H1.S2, y Ender la necesita para decidir la latencia.
>
> #### N-02 — «Cotizaciones» existe, pero es del médico; lo tuyo son tres pantallas que ya tienen precio y distancia
>
> | Pieza | Qué tiene | Dónde |
> |---|---|---|
> | «¿Dónde comprar?» de una receta | precio (`AvailabilityProduct.price`) y distancia (`AvailabilitySite.distanceKm`), mapa, origen guardado, pestañas por vertical **incluida «Centros de imagenología»** | `where-to-buy/**`, `pharmacy.types.ts:78-135`, `where-to-buy.html:300-308` |
> | «Lugares cercanos» | `PublicNearbyResult.distanceKm`, `PublicNearbyQuery.kind`, radio 15 km, tope 20, origen elegible, «mi receta» como entrada | `nearby-places/**`, `public-directory.types.ts:336-371` |
> | Directorio de laboratorios / clínicas / farmacias | unidades diagnósticas (`DiagnosticUnitsClient`), directorios públicos | `laboratory-directory/**`, `public-directories/**` |
> | Documentos del paciente | recetas (`medical-record`), órdenes (`diagnostic-orders`, con «Reservar hora en un laboratorio» L86-101) | `account/**` (Itzan/sin dueño: **se leen, no se tocan**) |
>
> **Precio con procedencia:** farmacias sí (`GET public/medications/:conceptId/availability`, API
> `pharmacy-public.controller.ts:120`). Servicios médicos: `fee-schedules.generated.ts` — «honorarios médicos
> del Colegio Médico de Santa Cruz (2025, **en UMA**)… **UMA no es una moneda** … su conversión a bolivianos no
> está declarada» (L1-24; lo consume sólo `practice.handlers.ts`). Imagenología y análisis: **sin precios
> publicados**. `GET public/nearby` existe en la API (`community-public.controller.ts:344`); **no hay** un
> endpoint de «cuatro verticales por precio».
>
> ⚠️ **Lo que la verificación NO hizo: ejecutar.** Nada se levantó. Que la ficha pida «por sede» se leyó en
> el `.ts`; cuántas peticiones son de verdad y cuánto tardan lo mide tu H1.

## 2. Resultado observable

| Hito | Prioridad | Qué queda demostrado |
|---|---|---|
| **H1** | `BLOQUEANTE` | Corte declarado, baseline con rojos previos clasificados, y **la medición** del flujo directorio → médico → cupo: cuántas peticiones, cuánto tarda cada una y el total, y qué pasa con cuatro clics seguidos. Ender decide con tus números. |
| **H2** | `ALTA` | Un clic sobre una tarjeta, sobre «Revisar disponibilidad» o sobre un cupo se ve (estado de carga) y no se repite; la ficha del médico pide los cupos **una vez** por médico, muestra carga por sede, y «elegir médico» baja a menos de la mitad de las peticiones de antes. |
| **H3** | `ALTA` | Existe «Cotizaciones» del paciente: buscador multicampo, vertical (servicios médicos, imagenología, análisis, medicamentos) y orden (precio / cercanía) como selects, distancia desde un origen elegible, precio o «no publicado», y los cuatro estados. |
| **H4** | `ALTA` | Desde «Cotizaciones» se elige una receta o una orden y el buscador se precarga con sus ítems, ordenables por precio y distancia. |
| **H5** | `ALTA` | Regresión del directorio y de Mi cuenta en verde; D-05 en tus archivos declarado (0). |
| **H6** | `ALTA` | `REPORTE.md` escrito, con las brechas de precio y de contrato declaradas. |

> ⚠️ **Esto es más de lo que entra en una noche, y está dicho a propósito.** Orden: **H1 → H2 → H3.S1** (la
> decisión) → H3.S2 → H4. Un directorio con clic único y una medición honesta de R-02 valen más que una
> pantalla de Cotizaciones a medias. Lo que no se cierra queda `A MEDIAS` con las cuatro respuestas.

**Kill-test del turno completo:** entrá como `paciente@alovida.mock`, abrí `/directory`, elegí una
especialidad y, con la pestaña Red abierta, tocá cuatro veces seguidas «Revisar disponibilidad» del mismo
médico: si la ficha se carga más de una vez, R-01 no está hecho. En la ficha, contá las lecturas de cupos:
si hay más de una por médico, R-02 no está hecho. Después abrí «Cotizaciones» en Mi cuenta: si no está, o si
al buscar «paracetamol» no podés ordenar por precio **y** por cercanía, N-02 no está hecho. Y si ves un precio
de una tomografía sin fuente, **está mal hecho**.

## 3. Alcance

**IN:** baseline · medición del flujo de reserva antes y después · estado «navegando» y clic único en
tarjetas, resultados y cupos · una lectura de cupos por médico y carga por sede · decisión escrita de dónde
vive «Cotizaciones» del paciente · pantalla con buscador multicampo, selects de vertical y orden, origen,
resultados con precio/«no publicado»/distancia y los cuatro estados · cotizar desde una receta o una orden ·
manejadores simulados nuevos **sólo si hacen falta**, como dobles declarados · pedido a Ender del renglón y la
ruta · specs · capturas por viewport y tema · `PLAN.md`, `REPORTE.md` y `evidencia/`.

**OUT:** **cualquier archivo fuera de los reservados de la ficha** · la latencia del interceptor
(**Ender**): la medís y se la pedís · `features/quotations/**` (la del médico) · `booking-new/**` (agenda):
ya bloquea el doble envío · `core/navigation/**` y `app.routes.ts` (**Ender**): el renglón y la ruta se
piden · `account/medical-record/**` fuera de `where-to-buy`, `account/diagnostic-orders/**`: se **leen** para
precargar, no se tocan · **inventar un precio** o convertir UMA a bolivianos sin fuente declarada
(regla 97.4.1) · **un endpoint nuevo en la API real** · un catálogo paralelo de servicios (regla 97.4.6) ·
cambiar `search-result` para consumidores que no son el directorio sin probarlos · debilitar un spec para
que pase · declarar `HECHO` una microtarea cuyo DoD no corriste.

## 4. Plan — hitos, subtareas y microtareas

Los seis estados permitidos son exactamente: `TODO`, `EN CURSO`, `HECHO`, `A MEDIAS`, `BLOQUEADO` y
`DESCARTADO`. **`A MEDIAS` es legítimo; disfrazarlo de `HECHO` no.**

### H1 — Corte, baseline y medición del flujo de reserva

**Prioridad:** `BLOQUEANTE`

**CA:** Dado tu entorno, cuando alguien pregunta contra qué versión trabajaste y cuánto tardaba y cuántas
peticiones hacía «elegir médico» antes, entonces hay SHA, salidas y una tabla medida — no una impresión.
**DoD:** salidas del baseline en `evidencia/antes/`; `evidencia/antes/red-flujo-reserva.md` con la tabla y capturas.
**Estado:** TODO

#### H1.S1 — Corte y baseline

**CA:** Dado un rojo posterior, cuando alguien pregunta si lo rompiste vos, entonces la respuesta sale de un archivo.
**DoD:** salidas con su código de salida, pegadas; cada rojo previo clasificado.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H1.S1.M1 | Fijar corte y rama | Hay SHA y rama en `PLAN.md` | `git fetch origin && git rev-parse origin/mockup && git branch --show-current` | TODO |
| H1.S1.M2 | Baseline de `lint` y `typecheck` | Hay salida y exit code | `yarn lint; echo "exit=$?"; yarn typecheck; echo "exit=$?"` → `evidencia/antes/` | TODO |
| H1.S1.M3 | Baseline de `test` | Hay conteo de fallos previos | `yarn test --watch=false` → `evidencia/antes/test.txt` | TODO |
| H1.S1.M4 | Clasificar cada rojo previo | Cada uno con su clase de la regla 80.4 | tabla en `PLAN.md` | TODO |

#### H1.S2 — La medición (Q-10)

**CA:** Dado el flujo directorio → médico → cupo con `paciente@`, cuando se lo recorre con la Red abierta,
entonces hay una tabla: petición, ruta, latencia, y el total hasta que la ficha muestra cupos; y está
observado qué disparan cuatro clics seguidos.
**DoD:** `evidencia/antes/red-flujo-reserva.md` + capturas; publicado a Ender por el daily.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H1.S2.M1 | Recorrer `/directory` → especialidad → «Revisar disponibilidad» → ficha con cupos, anotando cada petición (ruta, ms) y el total | Tabla con N filas y total | `evidencia/antes/red-flujo-reserva.md` | TODO |
| H1.S2.M2 | Repetir con un médico cuya semana esté vacía (dispara «próximo hueco») | Segunda tabla | idem | TODO |
| H1.S2.M3 | Cuatro clics seguidos sobre «Revisar disponibilidad» y sobre un cupo: cuántas navegaciones y peticiones | Números observados | captura de la Red | TODO |
| H1.S2.M4 | Capturas antes de `/directory`, de la ficha y de los cupos, escritorio y móvil | Seis capturas miradas | `evidencia/antes/capturas/` | TODO |
| H1.S2.M5 | Publicar la medición a Ender por el daily de equipo | Ender la puede leer | sección en `Daily-Noche-2026-09-22.md` | TODO |

### H2 — Clic único y carga visible (R-01, R-02)

**Prioridad:** `ALTA`

**CA:** Dado el paciente, cuando toca una tarjeta, «Revisar disponibilidad» o un cupo, entonces ve que
está cargando y un segundo toque no dispara nada; y la ficha del médico pide los cupos una vez por médico,
muestra carga por sede y termina en menos de la mitad del tiempo medido en H1.
**DoD:** specs; medición «después» comparada con «antes»; capturas.
**Estado:** TODO

#### H2.S1 — Un clic, un disparo

**CA:** Dado cualquier disparador de navegación del directorio, cuando se lo toca, entonces queda
`aria-busy` y sin respuesta a más clics hasta que la navegación termina, y se ve un indicador de carga.
**DoD:** spec de `search-result` y del directorio; 4 clics → 1 carga observada.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H2.S1.M1 | Estado «navegando» derivado de `Router.events` (`NavigationStart`…`NavigationEnd/Cancel/Error`) como signal en el componente del directorio (si Ender publica uno global, se reusa) | Hay signal y se apaga al terminar | spec | TODO |
| H2.S1.M2 | `search-result`: mientras «navegando», el enlace del título y la acción quedan `aria-busy="true"`, `aria-disabled`, sin `pointer-events` y con indicador (spinner de `app-button` o texto «Abriendo…») — sin cambiar consumidores que no pasen la opción | Un segundo clic no navega | spec + captura | TODO |
| H2.S1.M3 | Lo mismo en las tarjetas de especialidad (`rejilla__tarjeta`) | Observado | captura | TODO |
| H2.S1.M4 | Cupos: el botón tocado pasa a `[isLoading]` y los demás a `[disabled]` hasta navegar | Observado | captura | TODO |
| H2.S1.M5 | Medir después: cuatro clics seguidos → una carga | Números | `evidencia/h2/red-despues.md` | TODO |
| H2.S1.M6 | Nombre accesible y `role="status"` para el indicador; teclado (Enter sobre el enlace también queda único) | Observado | descripción + captura | TODO |

#### H2.S2 — Una lectura por médico, carga por sede

**CA:** Dada la ficha del médico, cuando se abre, entonces los cupos se piden una vez por médico (o en
paralelo por sede, si el manejador no admite otra cosa y está declarado), cada sede muestra su estado de
carga, y el total baja de lo medido en H1.
**DoD:** spec con conteo de peticiones; medición «después» ≤ mitad de «antes».
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H2.S2.M1 | Leer `scheduling.handlers.ts:160` (`GET /scheduling/slots`, de Ender): ¿admite varios `resourceId` o un filtro por profesional? Anotar y, si no, pedirle a Ender el filtro por el daily | Respuesta escrita | `PLAN.md` + daily | TODO |
| H2.S2.M2 | Si admite: una lectura por médico; si no: las lecturas por sede **en paralelo** (`forkJoin`) y no en serie, declarado | Peticiones contadas en spec | `HttpTestingController` | TODO |
| H2.S2.M3 | «Próximo hueco» sólo cuando la semana está vacía, y en paralelo con la semana visible, no después | Observado | spec | TODO |
| H2.S2.M4 | Estado de carga por sede (`role="status"`, «Buscando turnos…») y el estado vacío que ya existe | Observado | captura | TODO |
| H2.S2.M5 | Medición después: tabla como la de H1.S2 | Total ≤ 50 % del anterior con la misma latencia | `evidencia/h2/red-despues.md` | TODO |
| H2.S2.M6 | Repetir la medición cuando Ender publique la latencia nueva (objetivo Q-10: < 1 s) | Números | idem, segunda tabla | TODO |

### H3 — Cotizaciones del paciente: el buscador (N-02, primera mitad)

**Prioridad:** `ALTA`

**CA:** Dado el paciente en «Cotizaciones», cuando busca en una de las cuatro verticales, entonces elige
ordenar por precio o por cercanía como select, ve precio o «no publicado» con su procedencia, la distancia
desde su origen, y los cuatro estados (cargando, con datos, vacío, error) más «sin ubicación».
**DoD:** decisión de ubicación escrita; pantalla ejercitada; specs; capturas ×3 viewports ×2 temas.
**Estado:** TODO

#### H3.S1 — Descubrimiento y decisión

**CA:** Dada la pantalla nueva, cuando alguien pregunta por qué no se extendió «¿Dónde comprar?» o
«Lugares cercanos», entonces la decisión está escrita con las alternativas y el motivo, y el renglón del
menú está pedido a Ender.
**DoD:** las 4 microtareas en `HECHO`.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H3.S1.M1 | Inventario de los equivalentes: por vertical, qué manejador simulado devuelve precio y cuál distancia (farmacia sí/sí; laboratorio ?/sí; imagenología ?/sí; servicios médicos UMA/?) | Tabla de 4 filas con ruta:línea | `evidencia/h3/equivalentes.md` | TODO |
| H3.S1.M2 | Decidir dónde vive: (a) sección nueva `features/account/cotizaciones/**` que **compone** `where-to-buy` y `nearby-places`, o (b) extender `where-to-buy`; escribir la decisión con motivo (Q-15) | Decisión escrita | `PLAN.md` | TODO |
| H3.S1.M3 | Pedir a Ender por el daily: renglón «Cotizaciones» (rol `PATIENT`, grupo «Mi cuenta») y la ruta lazy en `app.routes.ts`; mientras tanto, probar por URL directa | Pedido anotado en los dos dailies | daily | TODO |
| H3.S1.M4 | Contrato de datos: qué se lee de cada manejador existente y qué doble hace falta (p. ej. servicios médicos con «precio de referencia (UMA)») — escrito con la forma REST que le tocaría | Lista de lecturas y dobles | `evidencia/h3/contrato.md` | TODO |

#### H3.S2 — La pantalla

**CA:** Dado el buscador, cuando se escribe un término y se elige vertical y orden, entonces los
resultados se ordenan por lo elegido, cada uno muestra precio o «no publicado» y distancia, y no hay ningún
número sin fuente.
**DoD:** spec; capturas; `git grep` de precios literales en el código → 0.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H3.S2.M1 | Buscador multicampo (`app-filter-bar` o `app-search-field`, normalizado) + `app-select` «Vertical» (4) + `app-select` «Ordenar por» (Precio / Cercanía) — ADR-0013 | Los dos son selects | captura | TODO |
| H3.S2.M2 | Origen para la distancia: reusar `search-origin-picker` de `nearby-places` (mi ubicación / lugar guardado / punto del mapa) | Cambiar el origen recalcula | captura | TODO |
| H3.S2.M3 | Resultados con la disciplina de Pablo: `app-data-table` con scroll vertical y `app-pagination` en cliente (si sus piezas no llegaron, lo que hay y declarado); columnas: qué, dónde, precio, distancia, acción («Ver», «Reservar» o «Pedir» según vertical, con ícono + texto) | Se ve y ordena | captura + spec | TODO |
| H3.S2.M4 | Los cuatro estados + «sin ubicación» (accionable: elegir origen) + «precio no publicado» con procedencia visible (`title`/tooltip: «no publicado por la sede») | Los seis observados | capturas | TODO |
| H3.S2.M5 | Servicios médicos: si se muestra el arancel, se muestra **en UMA, rotulado como referencia del Colegio Médico 2025**, sin conversión; ordenar por precio ordena por el número de UMA y lo dice (Q-16) | Ningún «Bs» inventado | `git grep -n -E 'Bs\.? ?[0-9]' -- src/app/features/account/cotizaciones` → 0 | TODO |
| H3.S2.M6 | Manejadores simulados: reusar `pharmacy` (disponibilidad), `public` (nearby), `diagnostics`; un doble nuevo sólo si M4 de S1 lo declaró, con spec | Sin manejador inventado sin declarar | `git diff --stat src/app/core/mock/handlers` + nota | TODO |
| H3.S2.M7 | Specs: orden por precio (nulos al final), orden por distancia (sin origen → estado), vertical cambia la lectura | Verde | `npx ng test --include=src/app/features/account/cotizaciones/**/*.spec.ts --watch=false` | TODO |
| H3.S2.M8 | Capturas ×3 viewports ×2 temas, miradas | 6 con su línea | `evidencia/h3/capturas/` | TODO |

### H4 — Cotizar desde un documento (N-02, segunda mitad)

**Prioridad:** `ALTA`

**CA:** Dado el paciente, cuando elige una receta o una orden de análisis, entonces el buscador se
precarga con sus ítems y se puede ordenar por precio y por distancia; «orden de servicio médico» aparece
sólo si el contrato tiene ese documento.
**DoD:** ejercitado con `paciente@alovida.mock`; specs; capturas.
**Estado:** TODO

#### H4.S1 — El panel de documentos

**CA:** Dado el panel, cuando se abre, entonces lista las recetas y órdenes reales del paciente (del
resumen clínico y de `diagnostic-orders`), y elegir una precarga el buscador.
**DoD:** las 6 microtareas en `HECHO`.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H4.S1.M1 | Verificar si existe «orden de servicio médico» como documento en el contrato (`git grep -n -i 'service order\|orden de servicio\|procedure_request' origin/mockup -- src/app/core/data-access`); si no, registrar Q-J1 y mostrar sólo receta y orden de análisis | Respuesta escrita | `PLAN.md` | TODO |
| H4.S1.M2 | Panel «Cotizar desde un documento»: recetas (mismo origen que `where-to-buy`: resumen clínico, tope 50) y órdenes de análisis (`diagnostic-orders`, leído, no tocado) | Se listan las del paciente | captura | TODO |
| H4.S1.M3 | Elegir receta → vertical «Medicamentos» con sus ítems precargados (reusar la lógica de `where-to-buy`) | Observado | captura | TODO |
| H4.S1.M4 | Elegir orden → vertical «Análisis» (o «Imagenología» según el estudio) con el estudio precargado | Observado | captura | TODO |
| H4.S1.M5 | Orden por precio y por distancia sobre lo precargado | Observado | spec | TODO |
| H4.S1.M6 | Specs y capturas | Verde; miradas | comandos | TODO |

### H5 — Regresión y D-05 declarado

**Prioridad:** `ALTA`

**CA:** Dado tu cambio, cuando corrés los comandos del baseline y el barrido, entonces ningún rojo es
nuevo; y está dicho, medido, que tus archivos no tienen `iconOnly`.
**DoD:** salidas comparadas; barrido `--workers=1`; conteo.
**Estado:** TODO

#### H5.S1 — Regresión

**CA:** Dado el baseline, cuando se repite, entonces coincide o la diferencia está explicada.
**DoD:** las 5 microtareas en `HECHO`.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H5.S1.M1 | `lint` y `typecheck` | Sin rojos nuevos | diff contra `evidencia/antes/` | TODO |
| H5.S1.M2 | `test` completo | Sin rojos nuevos | diff contra baseline | TODO |
| H5.S1.M3 | El simulador entero con cada cuenta | Nada lanza ni devuelve 500 | `npx ng test --include=src/app/core/mock/mock-backend.spec.ts --watch=false` | TODO |
| H5.S1.M4 | Barrido de pantallas, serial | Ninguna ruta rompe | `E2E_BASE_URL=http://localhost:4200 npx playwright test playwright/mockup-barrido.spec.ts --workers=1` | TODO |
| H5.S1.M5 | Barrido de clics sobre `/directory` y Mi cuenta | Sin excepciones ni 5xx | `… playwright/mockup-click-sweep.spec.ts --workers=1` | TODO |

#### H5.S2 — D-05 en tus archivos

**CA:** Dado el inventario de Pablo, cuando se filtra por tus archivos, entonces el conteo es 0 y está
pegado; todo botón nuevo que escribiste lleva ícono + texto.
**DoD:** las 2 microtareas en `HECHO`.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H5.S2.M1 | Medir `iconOnly` en tus archivos | 0, pegado | `git grep -c iconOnly -- src/app/features/{directory,nearby-places,laboratory-directory,public-directories} src/app/features/account/medical-record/where-to-buy src/app/features/account/cotizaciones` | TODO |
| H5.S2.M2 | Verificar que cada botón nuevo de Cotizaciones tiene ícono + texto (o excepción escrita) | Cero sin veredicto | revisión + captura | TODO |

### H6 — Cierre

**Prioridad:** `ALTA`

**CA:** Dado el cierre, cuando alguien que no vio tu turno lee el reporte, entonces sabe qué quedó
demostrado, qué quedó a medias con las cuatro respuestas, qué precio falta con procedencia y qué contrato falta.
**DoD:** `REPORTE.md` con sus tres secciones y el avance arriba.
**Estado:** TODO

#### H6.S1 — Cierre honesto

**CA:** Dado el reporte, cuando se lee la primera línea, entonces está el avance calculado.
**DoD:** las 5 microtareas en `HECHO`.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H6.S1.M1 | Capturas finales por viewport y tema, miradas | Con su línea | `evidencia/h6/` | TODO |
| H6.S1.M2 | Teclado completo en el directorio (clic único con Enter) y en Cotizaciones | Descripción por paso | `evidencia/h6/teclado.md` | TODO |
| H6.S1.M3 | Declarar las brechas: precios sin procedencia (Q-16), documentos que el contrato no tiene (Q-J1), dobles simulados | Lista | sección en `REPORTE.md` | TODO |
| H6.S1.M4 | Declarar el peldaño por área (regla 30) | Hay peldaño por área | sección en `REPORTE.md` | TODO |
| H6.S1.M5 | Escribir `REPORTE.md` con el avance primero y enumerar procesos que quedaron corriendo | `head -3` muestra el avance | `head -3 REPORTE.md` | TODO |

## 5. Ambigüedades registradas

| ID | Ambigüedad | Supuesto con el que trabajás | Quién puede resolverla | Qué bloquea |
|---|---|---|---|---|
| Q-10 | «tarda demasiado» sin umbral | Se mide antes y después; objetivo en la maqueta: < 1 s para la ficha con cupos | Pablo | H2.S2.M5-M6 |
| Q-15 | ¿«Cotizaciones» del paciente o la del médico? ¿Tres campos o cuatro verticales? | Del paciente, nueva, componiendo lo existente; cuatro verticales | Doctor + Pablo | H3.S1.M2 |
| Q-16 | Precio de servicios médicos (UMA), imagenología y análisis sin procedencia | «No publicado»; UMA rotulado como referencia, sin conversión; **ningún número inventado** | Negocio, con fuente | H3.S2.M5 |
| Q-J1 | ¿Existe «orden de servicio médico» como documento del paciente en el contrato? | Se verifica en H4.S1.M1; si no, sólo receta y orden de análisis, declarado | Pablo | H4.S1 |
| Q-J2 | ¿El clic único vive en `search-result` (molécula, otros consumidores) o sólo en el directorio? | En la molécula como opción **opt-in**; consumidores que no la pasan no cambian | Pablo | H2.S1.M2 |
| Q-J3 | ¿`GET /scheduling/slots` admite un filtro por profesional? | Se lee el manejador en H2.S2.M1; si no, paralelo por sede y pedido a Ender | Ender | H2.S2 |

## 6. Definition of Done del hito

- [ ] Todas sus microtareas en `HECHO`, o en `A MEDIAS`/`BLOQUEADO`/`DESCARTADO` **con las cuatro respuestas**.
- [ ] La salida literal del comando de cada DoD está en `evidencia/`, no parafraseada.
- [ ] `yarn lint`, `yarn typecheck` y `yarn test --watch=false` sin rojos **nuevos** respecto del baseline.
- [ ] **La medición «después» está pegada junto a la «antes»**, con el mismo recorrido.
- [ ] **Ningún precio sin procedencia** en la pantalla ni en el código; UMA nunca convertido a bolivianos.
- [ ] Los cuatro estados + «sin ubicación» + «no publicado» existen y son accionables (regla 95.2).
- [ ] Todo botón nuevo con ícono + texto (ADR-0012).
- [ ] Lo simulado con manejador nuevo está declarado como **doble** (regla 65).
- [ ] Capturas por viewport y tema, **miradas**, con una línea cada una.
- [ ] Peldaño de evidencia declarado por área (regla 30).
- [ ] Sin datos de personas en logs, capturas, plan ni reporte (regla 90.2): sólo `paciente@alovida.mock`.
- [ ] El `PLAN.md` está actualizado en el momento, no al final.

## 7. Cómo cerrás el turno

1. **Checkpoint** en cada apertura y cierre de microtarea. Prohibido encadenar más de tres operaciones
   materiales sin uno.
2. **`REPORTE.md`** con el avance en la **primera línea**: `> **AVANCE: <HECHO> / 51 — <%>.**`
3. **Las tres secciones obligatorias existen siempre.** Una vacía se escribe con «ninguna».
4. **Lo que dependa de Ender** (latencia, filtro de cupos, renglón del menú) no cierra como `BLOQUEADO`
   sin haber simulado los tres niveles de su contrato (regla 65).
5. **Publicá la medición de H1.S2 apenas esté**: Ender decide con ella.
6. **Enumerá qué quedó corriendo** y cerralo.
7. **Tu daily** es `Justin-Daily-Noche-2026-09-22.md`, en la carpeta de arriba.

## 8. Revisión adversarial antes de cerrar

1. ¿Hay un número de precio en pantalla cuya fuente no podés nombrar con archivo y línea?
2. ¿Convertiste UMA a bolivianos «para que se entienda»?
3. ¿El clic único bloquea al usuario si la navegación falla (queda `aria-busy` para siempre)?
4. ¿Contaste las peticiones «después» con el mismo recorrido que «antes»?
5. ¿Cambió `search-result` para un consumidor que no es el directorio, y lo sabés o lo suponés?
6. ¿Ordenar por distancia sin origen elegido rompe, o dice qué hacer?
7. ¿La pantalla de Cotizaciones toca archivos de Itzan (`account/medical-record` fuera de `where-to-buy`)?
8. ¿Un manejador simulado nuevo está declarado como doble con la forma REST que le tocaría?
9. ¿Se declara verificado algo que sólo fue inspeccionado estáticamente?
10. ¿La «orden de servicio médico» existe en el contrato, o la inventaste para que el panel tenga tres opciones?
