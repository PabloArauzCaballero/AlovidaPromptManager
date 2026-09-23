# La disciplina de tabla que el doctor pidió «a partir de ahora»: un ADR, tres piezas, y «Dónde atiendo» que la cumple entera

> **Rol:** dueño del patrón de tabla con acciones (ADR-0015) y de `data-table`, `filter-bar`, `pagination`, `row-actions` · **Línea:** A · **Fecha:** 2026-09-22 · **Turno:** noche
> **Fuente del pedido:** [`CORRECCIONES-DOCTOR-Y-PACIENTE-2026-09-22.md`](../../../../../docs/requisitos/CORRECCIONES-DOCTOR-Y-PACIENTE-2026-09-22.md) — **D-04, D-05, D-06, D-08, D-09**
> **Verificación contra el código:** [`VERIFICACION-CONTRA-CODIGO-2026-09-22.md`](../../../../../docs/verificacion/VERIFICACION-CONTRA-CODIGO-2026-09-22.md) — §1, §2 (D-04…D-09), §3, §4 (HALL-E3, E4, E5, E15, E16)
> **Plan maestro:** [`PLAN-MAESTRO.md`](../../../../../docs/trabajo/2026-09-22-plan-y-reparto-correcciones-doctor-y-paciente/PLAN-MAESTRO.md) — tu carril es el que **destraba a Itzan** (H2, H3, H4.S3)
> **6 hitos · 13 subtareas · 68 microtareas**, todas con criterio de aceptación y Definition of Done.
>
> **Tu carril es el que convierte un pedido del cliente en una regla de la casa.** El doctor dijo
> «TOMALO COMO GUIA DE TRABAJO A PARTIR DE AHORA» (D-04) y «siempre» (D-08). Eso es un ADR con piezas
> reales detrás, no un párrafo en un daily. Y vos sos quien escribió el contrato de `DataTable<Row>`
> el 21/09: el patrón nuevo **extiende** ese contrato, no lo reescribe.

## 0. Ficha de asignación

| Campo | Valor |
|---|---|
| `REPO` | `alovida/mantra-core-health` (frontend Angular). **Nada de backend en este lote** |
| `TARGET_REF` | `origin/mockup` — corte leído **`b655e8449abd662d6b24156fd6e2b06aeb120cc1`** (2026-09-22T18:04-04, tu propio PR #570). **Reconsultalo y fijá el tuyo** en tu `PLAN.md` |
| `RAMA DE TRABAJO` | Una tuya, saliendo de `origin/mockup`. **Nada directo sobre `mockup`, nada sin PR** |
| `ARCHIVOS RESERVADOS PARA VOS` | `src/app/shared/components/organisms/data-table/**` · `organisms/filter-bar/**` · `src/app/shared/components/molecules/pagination/**` (era de Justin el 21/09; su carril cerró con el PR #573) · `molecules/row-actions/**` · `src/app/features/account/my-profile/work-history/**` · `docs/adr/ADR-0015-*.md`, `docs/adr/index.md`, `docs/adr/CONTRATO-data-table.md` |
| `ARCHIVOS DE OTROS — NO LOS TOQUES` | el resto de `features/account/my-profile/**`, `features/auth/register-*/**`, `organisms/{specialty-badge,specialty-badge-grid,paginated-form,date-picker}/**`, `core/mock/handlers/{profiles,files}.handlers.ts` (**Itzan**) · `organisms/{content-dialog}/**`, `molecules/dialog/**`, `features/symptom-check/**`, `features/dashboard/patient-home/**` (**Marcelo**) · `features/directory/**`, `features/nearby-places/**`, `where-to-buy/**`, `laboratory-directory/**`, `public-directories/**`, `molecules/search-result/**` (**Justin**) · `core/mock/mock-backend.interceptor.ts`, `core/mock/fixtures/{agenda,personas,registered-people}.ts`, `core/mock/handlers/scheduling.handlers.ts`, `core/navigation/**`, `features/shell-layout/**`, `organisms/header/**`, `src/app/app.routes.ts` y **los tres barrels** (**Ender**) |
| `⚠️ RIESGO ALTO DE TU CARRIL` | `data-table` tiene **30** consumidores, `filter-bar` **8**, `pagination` **3**. Todo cambio suyo es **opt-in**: el comportamiento por omisión no cambia. Probás una **muestra de consumidores ajenos** con captura, no sólo «Dónde atiendo» |
| `LA MAQUETA NO TIENE BACKEND` | `mockBackend: true` fijo en `src/environments/environment.ts`. Ninguna petición sale a la red: las contesta `src/app/core/mock/mock-backend.interceptor.ts`. **El historial laboral y las ediciones del perfil viven sólo en el simulador** (HALL-E3): lo cerrás `VERIFIED` **contra el doble** y lo declarás |
| `CUENTA DE PRUEBA` | `medica@alovida.mock` (cualquier contraseña no vacía). **Sintética declarada**: se puede pegar |
| `DÓNDE SE PRUEBA` | `/my-account` → pestaña «Dónde atiendo» (ficha, `practitioner-profile-view.html:435-477`) y `/my-account/edit` → «Dónde atiendo» (`practitioner-profile-edit.html:377-381`); las dos montan **el mismo** `app-work-history secciones="consultorios"`. Para la muestra ajena: `/administration/patients`, `/administration/organizations`, `/administration/terminology` (montan `app-data-table`). **Sacá las URLs del router, no las supongas** |
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
pisar algo, no lo pises: fusioná y dejá constancia en tu daily de qué quedó de cada lado.

### 1.2 Qué te instala eso

| Candado | Qué impide |
|---|---|
| `plan_gate.py` | Escribir código sin `PLAN.md` en disco. Nunca bloquea `.md` ni nada bajo `docs/` |
| `report_gate.py` | Cerrar la sesión con trabajo activo y sin `REPORTE.md`, o sin sus tres secciones |
| `blocker_gate.py` | Cerrar con microtareas en `BLOQUEADO` o `EN CURSO` sin declarar la simulación de los tres niveles del contrato (regla 65) |

**En cualquier otra herramienta los candados NO corren.** El plan y el reporte siguen siendo igual de
obligatorios; lo único que cambia es que nadie te va a frenar.

### 1.3 Skills que tenés que CARGAR para este lote

Son **28**: 11 del proceso y 17 propias del patrón de tabla.

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
| `frontend-data-tables` | **la más importante de tu lote**: tabla responsiva, acciones por fila, paginación, qué se pliega y qué no |
| `technical-docs-and-adr` | cómo se escribe el ADR-0015 para que reemplace la decisión del 18/09 sin borrarla |
| `atomic-design-components` | extender `pagination`, `filter-bar` y `data-table` **parametrizando**, no copiando |
| `search-and-filtering` | buscador multicampo con debounce, filtros por value set, normalización |
| `frontend-responsive-layout` | scroll vertical con alto máximo y sin desborde lateral en 375/768/1440 |
| `frontend-accessibility` | modal con foco atrapado y restaurado; nombre accesible en Anterior/Siguiente; nada sólo por color |
| `accessibility-testing` | teclado completo en el modal y en el paginador, con evidencia |
| `frontend-forms-ux` | «guardar» habilitado por cambios; confirmación; datos preservados ante fallo; sin doble envío |
| `angular-forms` | el formulario del consultorio dentro del modal, con errores por campo |
| `angular-signals-state` | el estado «hay cambios» derivado del borrador, no copiado con `effect` |
| `ux-clarity-usability` | por qué el formulario abajo «se ve como un bug» y el modal no |
| `ux-writing-microcopy` | los textos de «¿Confirmás estos cambios?» y «¿Retirar…?» |
| `maps-geolocation` | el mapa dentro de un diálogo: alto, `invalidateSize`, y vaciar la dirección al tocar |
| `refactoring-safely` | cambiar `data-table` con 30 consumidores sin cambiarles el comportamiento |
| `unit-testing` | un comportamiento por test; los tres niveles del contrato |
| `angular-testing` | `setInput`, `whenStable` en zoneless, harness del diálogo |
| `visual-proof` | la captura no vale si no la mirás |

Entrá siempre por `skills-router`: **no leas el catálogo entero, no sirve.**

### 1.4 DoD de esta sección — se verifica como cualquier otra

- [ ] `ls .claude/skills | wc -l` devolvió **176**, y la salida está pegada en tu daily.
- [ ] `python .claude/hooks/plan_gate.py --self-test` devolvió **11 PASS, 0 FAIL**, salida pegada.
- [ ] Leíste `skills-router` y las 28 skills de las dos tablas, **empezando por `frontend-data-tables`**.
- [ ] Creaste tu `PLAN.md` **antes** del primer `Edit`/`Write` de código.

**Sin estas cuatro casillas, tu lote arranca en `BLOQUEADO`, no en `EN CURSO`.**

> ### ✅ Hechos ya verificados contra el corte — no los repitas, pero tampoco los creas sin abrir el archivo
>
> #### Lo que ya cumple la disciplina, y lo que no
>
> | Regla de D-08 | Estado | Dónde |
> |---|---|---|
> | Editar abre modal con campos llenos | **Existe** en el editor del perfil (título, especialidad, matrícula) | `practitioner-profile-edit.html:961-1071` (Itzan) |
> | Guardar se habilita **por cambios** | **Parcial**: hoy es por validez (`puedeGuardarEdicion`, `.ts:1505`) | Itzan lo ejercita en su H1 |
> | Confirmar → «¿estás seguro?» | **No existe** al guardar. La pieza para hacerlo sí: `DialogService.confirm()` en **26** archivos | `molecules/dialog/dialog-service.ts` (Marcelo publica `confirmarCambios`) |
> | Eliminar → confirmación | **Existe** en el consultorio: `work-history.ts:896-903` («Dejar de atender acá») | tuyo |
> | Buscador + filtros arriba, Añadir a la derecha | **No existe** en el perfil ni en Dónde atiendo. `filter-bar` tiene buscador con debounce 300 ms + filtros de value set + chips; **sin hueco para un botón** | `filter-bar.html:1-35` |
> | Scroll sólo vertical | **Choca** con tu propio organismo: `data-table.css:22` (`overflow-x: auto`), sombras del scroll lateral (L38-108) y `sticky: 'end'` «propietario, 18/09/2026» (`data-table.types.ts:24-27`) | HALL-E5 |
> | Paginación con selects | **Choca en el organismo, existe en la molécula**: `DataTable` pagina por cursor (tu `CONTRATO-data-table.md` §10.2, sin total ni números); `app-pagination` tiene `totalItems`, tamaños `[10,20,50,100]` con `app-select` y botones numerados, **sin** select de página y con Anterior/Siguiente sólo-ícono | HALL-E4; `pagination.html`, `pagination.types.ts` |
> | Formularios de acción de tabla en modal (D-04) | «Nuevo consultorio / Corregir tu consultorio» es un `<form>` **en línea debajo de la lista** (`work-history.html:172-292`). Es el mismo defecto que vos corregiste en la agenda el 20/09 (C-10, tarjeta del día → modal) | tuyo |
>
> #### «Dónde atiendo» hoy no es una tabla
>
> `work-history.html:33-88`: una `<ul class="historial__lista">` con nombre, insignia «Tu consultorio»/«Trabajás
> acá», dirección en mayúsculas, aviso «Sin QR de cobro», y **`app-row-actions`** (L84) con Editar/Retirar/QR
> bancario — o sea, ya cumple ADR-0012. El QR es un modal aparte (`site-bank-qr-dialog`, L408-415).
> El consultorio propio **es uno solo por persona** (`POST /practitioners/me/sites` «crea —o reutiliza—»,
> L116-124): la tabla va a tener pocas filas. La paginación se pone igual, porque la regla dice «siempre»,
> y con pocas filas se ve una sola página — que es lo que `app-pagination` ya hace bien.
>
> #### El historial laboral: modal para agregar, nada para editar, sin archivo
>
> `work-history.html:408-527`: `app-content-dialog heading="Añadir elemento a tu historial"` con Institución
> (catálogo o escrita), Cargo, Consultorio de la plataforma, Desde, Hasta. **Sin `app-file-input`, sin editar,
> sin retirar.** Y el contrato real **no tiene** historial laboral bajo `practitioners/me` (HALL-E3): todo esto
> lo persiste el simulador.
>
> #### Los 78 `iconOnly`, por archivo, están en la §3 de la verificación
>
> Los tuyos: `pagination.html` **2** (Anterior/Siguiente — **dejan de ser excepción**, D-08 pide texto) y
> `site-bank-qr-dialog.html` **1**. Los otros 75 tienen dueño o están declarados sin dueño; vos publicás el
> veredicto por fila (H5), no los tocás.
>
> ⚠️ **Lo que la verificación NO hizo: ejecutar.** No se levantó la maqueta ni se corrió un test. Que el
> `confirm` de retirar exista en el `.ts` no prueba que se dispare desde el desplegable: eso lo ejercitás en H1.

## 2. Resultado observable

| Hito | Prioridad | Qué queda demostrado |
|---|---|---|
| **H1** | `BLOQUEANTE` | Corte declarado, baseline con rojos previos clasificados, inventario de las **30** tablas y los **26** `confirm` con dueño, y capturas **antes** de «Dónde atiendo» y de las tres tablas del perfil en dos viewports. |
| **H2** | `BLOQUEANTE` para Itzan y Marcelo | **ADR-0015** publicado antes de la mitad del turno: las siete reglas, la decisión de paginación (cliente vs cursor), la decisión de scroll con las dos fechas (18/09 → 22/09), indexado y anunciado en el daily de equipo. |
| **H3** | `ALTA` | `app-pagination` con Anterior/Siguiente con texto y select de página; `data-table` con alto máximo y scroll vertical **sin** lateral, opt-in; `filter-bar` con hueco para la acción a la derecha — cada uno con spec de tres niveles y consumidores ajenos comprobados. |
| **H4** | `ALTA` | «Dónde atiendo» cumple la disciplina de punta a punta: tabla, barra, paginación, modal con campos llenos, guardar por cambios, dos confirmaciones, mapa que vacía la dirección; y el historial laboral es una tabla con las mismas reglas y adjunto, publicada para que Itzan la monte. |
| **H5** | `MEDIA` | Los 78 `iconOnly` tienen veredicto escrito y dueño; los tres tuyos aplicados. |
| **H6** | `ALTA` | Regresión y gates corridos, capturas por viewport y tema miradas, muestra de consumidores ajenos comprobada, y `REPORTE.md` escrito. |

> ⚠️ **Esto es más de lo que entra en una noche, y está dicho a propósito.** Si tenés que elegir: **H2 y
> H3.S1 primero** — sin el ADR y sin el paginador, Itzan simula a ciegas. Lo que no se cierra queda
> `A MEDIAS` con qué anda, qué no anda y qué falta exactamente. **Un patrón publicado y un consumidor
> que lo cumple entero valen más que tres piezas a medias.**

**Kill-test del turno completo:** entrá como `medica@alovida.mock`, abrí `/my-account/edit` → «Dónde
atiendo», tocá «Agregar mi consultorio propio». Si el formulario aparece **debajo** de la lista y no en un
modal, H4 no está hecho. Abrí «Editar» sobre el consultorio, no cambies nada: si «Guardar» está habilitado,
no está hecho. Cambiá el nombre y guardá: si no aparece «¿Confirmás estos cambios?», no está hecho. Escribí
una dirección y tocá el mapa: si el campo conserva el texto, D-06 no está hecho. Y si la tabla tiene scroll
lateral a 1440 px, D-08 no está hecho.

## 3. Alcance

**IN:** baseline de `lint`, `typecheck`, `test` con rojos previos clasificados · inventario de tablas y
`confirm` · capturas previas · **ADR-0015** con las siete reglas y las dos decisiones (paginación, scroll) ·
extensión de `CONTRATO-data-table.md` · `app-pagination`: texto en Anterior/Siguiente, select de página,
alineación · `data-table`: alto máximo con scroll vertical y sin lateral, opt-in · `filter-bar`: proyección
para la acción a la derecha y receta de buscador multicampo · «Dónde atiendo»: tabla, barra, paginación en
cliente, modal de alta/edición con campos llenos, guardar por cambios, confirmación al guardar y al retirar,
mapa dentro del modal, vaciar la dirección al tocar el mapa · historial laboral: layout de tabla, editar,
retirar, adjunto (contra el simulador, declarado) · veredicto por cada `iconOnly` · specs dirigidos ·
capturas por viewport y tema · `PLAN.md`, `REPORTE.md` y `evidencia/`.

**OUT:** **cualquier archivo fuera de los reservados de la ficha** · las tres tablas de «Configurar tu
perfil» (`practitioner-profile-edit.*`): son de **Itzan**; vos publicás el patrón y ella lo aplica ·
`content-dialog` y `dialog-service`: son de **Marcelo**; si necesitás algo, lo pedís por el daily y mientras
tanto llamás a `dialogs.confirm()` tal como existe · `core/mock/handlers/profiles.handlers.ts` (Itzan) y
`scheduling.handlers.ts` (Ender): si el historial laboral vive en un manejador que no es tuyo, **pedís el
cambio o simulás**, no lo escribís · `mantra-core-health-api/**` — **no se escribe API esta noche**; los
endpoints que faltan (HALL-E3) se declaran · **cambiar el comportamiento por omisión** de `data-table`,
`filter-bar` o `pagination` para sus consumidores actuales: todo es opt-in · **reemplazar la paginación
por cursor** del organismo: el ADR decide cuándo se pagina en cliente, no borra el cursor · **ampliar el
set de íconos** (`nav-icon`) «de paso» (HALL-E15) · convertir los 75 `iconOnly` que no son tuyos · las 26
tablas que no son «Dónde atiendo» ni las del perfil: se inventarían, no se migran · debilitar un spec para
que pase · declarar `HECHO` una microtarea cuyo DoD no corriste.

## 4. Plan — hitos, subtareas y microtareas

Los seis estados permitidos son exactamente: `TODO`, `EN CURSO`, `HECHO`, `A MEDIAS`, `BLOQUEADO` y
`DESCARTADO`. **`A MEDIAS` es legítimo; disfrazarlo de `HECHO` no.**

### H1 — Corte, baseline, inventario y capturas previas

**Prioridad:** `BLOQUEANTE`

**CA:** Dado tu entorno, cuando alguien pregunta contra qué versión trabajaste, cuántas tablas y
confirmaciones hay en el producto y cómo se veía «Dónde atiendo» antes, entonces hay SHA, dos tablas de
inventario y capturas — no un recuerdo.
**DoD:** salidas del baseline en `evidencia/antes/` con exit code, inventario de 30 tablas y 26
`confirm` con dueño, y cuatro capturas descritas.
**Estado:** TODO

#### H1.S1 — Corte y baseline

**CA:** Dado un rojo posterior, cuando alguien pregunta si lo rompiste vos, entonces la respuesta sale de
un archivo.
**DoD:** salidas con su código de salida, pegadas, y cada rojo previo clasificado.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H1.S1.M1 | Fijar corte y rama | Hay SHA y rama en `PLAN.md` | `git fetch origin && git rev-parse origin/mockup && git branch --show-current` | TODO |
| H1.S1.M2 | Baseline de `lint` y `typecheck` | Hay salida y exit code | `yarn lint; echo "exit=$?"; yarn typecheck; echo "exit=$?"` → `evidencia/antes/` | TODO |
| H1.S1.M3 | Baseline de `test` | Hay conteo de fallos previos | `yarn test --watch=false` → `evidencia/antes/test.txt` | TODO |
| H1.S1.M4 | Clasificar cada rojo previo | Cada uno con su clase de la regla 80.4 | tabla en `PLAN.md` | TODO |

#### H1.S2 — Inventario y capturas previas

**CA:** Dado el pedido «siempre», cuando alguien pregunta a cuántas tablas alcanza y quién es dueño de
cada una, entonces hay una tabla de 30 filas; y hay capturas de cómo se veía lo que vas a tocar.
**DoD:** dos inventarios en `evidencia/antes/` y cuatro capturas con su línea.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H1.S2.M1 | Inventariar las 30 plantillas que instancian `app-data-table`: ruta, dueño del reparto, ¿tiene barra?, ¿tiene paginación? | 30 filas, ninguna sin dueño o «sin dueño» declarado | `git grep -l '<app-data-table' origin/mockup -- 'src/app/**/*.html'` → `evidencia/antes/tablas.md` | TODO |
| H1.S2.M2 | Inventariar los 26 archivos con `dialogs.confirm(` y qué confirman (eliminar, descartar, otro) | 26 filas con el tipo | `git grep -n 'dialogs.confirm(' origin/mockup -- 'src/app/**/*.ts' ':!*.spec.ts'` → `evidencia/antes/confirmaciones.md` | TODO |
| H1.S2.M3 | Capturar «Dónde atiendo» (ficha y editor) en escritorio y móvil, y ejercitar: ¿«Retirar» confirma? ¿el formulario de alta aparece abajo? | Cuatro capturas miradas + dos respuestas observadas | `evidencia/antes/capturas/` con una línea por captura | TODO |
| H1.S2.M4 | Revisar consola y red antes de tocar | Hay lista de errores previos (o «ninguno», dicho) | lista en `evidencia/antes/consola-red.txt` | TODO |

### H2 — ADR-0015: la tabla con acciones

**Prioridad:** `BLOQUEANTE` para Itzan y Marcelo

**CA:** Dado el ADR, cuando alguien lo lee, entonces conoce las siete reglas de D-04/D-08, cómo se
pagina cada tipo de lista, qué decisión anterior reemplaza y con qué piezas se cumple — sin abrir el chat
de esta noche.
**DoD:** `docs/adr/ADR-0015-*.md` indexado, con las dos fechas, publicado en el daily de equipo **antes
de la mitad del turno**; `CONTRATO-data-table.md` extendido.
**Estado:** TODO

#### H2.S1 — Escribir y publicar el ADR

**CA:** Dada cualquiera de las siete reglas, cuando se la busca en el ADR, entonces está con su motivo,
su pieza (`content-dialog`, `dialog-service`, `filter-bar`, `pagination`, `data-table`) y su excepción
declarada si la tiene.
**DoD:** archivo en disco, `index.md` con su fila, anuncio en el daily con la ruta.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H2.S1.M1 | Escribir las siete reglas: (1) editar abre modal con campos llenos; (2) guardar se habilita por cambios; (3) guardar pide «¿Confirmás estos cambios?»; (4) eliminar pide confirmación; (5) barra arriba: buscador multicampo + filtros por campo + Añadir a la derecha al final; (6) scroll sólo vertical; (7) paginación abajo a la derecha con Anterior, Siguiente, número, y **selects** de tamaño y de página. Más la regla madre de D-04: todo formulario que nace de una acción de tabla va en modal | Las 7 + D-04 están, cada una con pieza y motivo | `grep -c '^### Regla' docs/adr/ADR-0015-tabla-con-acciones.md` → 8 | TODO |
| H2.S1.M2 | Escribir la decisión de paginación (Q-5): listas **locales** (todo en memoria) → `app-pagination` en cliente; listas **por cursor** de la API → cursor del organismo, y se declara qué pantallas quedan así | La decisión dice el criterio y nombra las dos familias | sección «Paginación» del ADR | TODO |
| H2.S1.M3 | Escribir la decisión de scroll (Q-6) conservando la razón del 18/09 («sticky end porque una tabla ancha escondía las acciones») y por qué cambia (el doctor: «a la gente le resulta difícil»): lo que no entra se pliega por prioridad, no desborda | Las dos fechas están; la razón vieja no se borra | sección «Scroll» del ADR con `2026-09-18` y `2026-09-22` | TODO |
| H2.S1.M4 | Indexar en `docs/adr/index.md` | Hay fila | `grep -c 'ADR-0015' docs/adr/index.md` → 1 | TODO |
| H2.S1.M5 | Publicar en el daily de equipo (§4-bis) con la ruta y un ejemplo de uso por regla | Itzan y Marcelo pueden leerlo sin abrir el PR | sección en `Daily-Noche-2026-09-22.md` | TODO |

#### H2.S2 — Extender `CONTRATO-data-table.md`

**CA:** Dado el contrato del organismo, cuando alguien pregunta cómo convive con un paginador externo y
cómo se acota el alto, entonces el contrato lo dice, con el input y su valor por omisión.
**DoD:** dos secciones nuevas en el contrato, coherentes con lo que H3.S2 implementa.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H2.S2.M1 | Sección «Alto máximo y scroll vertical»: nombre del input, valor por omisión (**sin cambio** para los 30 consumidores), qué pasa con `sticky: 'end'` cuando no hay scroll lateral | Está el input y el por omisión | `grep -n 'scroll vertical' docs/adr/CONTRATO-data-table.md` | TODO |
| H2.S2.M2 | Sección «Paginación externa»: cuándo el `<nav>` del organismo no se dibuja y un `app-pagination` proyectado o hermano manda | Está dicho con ejemplo de marcado | `grep -n 'app-pagination' docs/adr/CONTRATO-data-table.md` | TODO |

### H3 — Las piezas del patrón

**Prioridad:** `ALTA`

**CA:** Dado un consumidor que opta por el patrón, cuando monta las tres piezas, entonces obtiene
Anterior/Siguiente con texto, select de página y de tamaño, alto máximo con scroll vertical sin lateral, y
un hueco para el botón de acción a la derecha — y ningún consumidor que **no** opte cambia de comportamiento.
**DoD:** specs dirigidos en verde con los tres niveles del contrato; 3 consumidores ajenos de
`data-table`, los 3 de `pagination` y 2 de `filter-bar` comprobados a mano con captura.
**Estado:** TODO

#### H3.S1 — `app-pagination`: texto, select de página, alineación

**CA:** Dado el paginador, cuando se lo monta con `totalItems` y `pageSize`, entonces «Anterior» y
«Siguiente» llevan ícono **y** texto, hay un `app-select` para saltar a una página y otro para el tamaño,
y el conjunto se alinea a la derecha del contenedor; con una sola página, los botones están deshabilitados
y el select tiene una opción.
**DoD:** spec con ≥ 10 tests (forma, límites, cambio de tamaño vuelve a la página 1, teclado) en verde;
los 3 consumidores actuales comprobados con captura.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H3.S1.M1 | Anterior/Siguiente con texto e ícono (D-05, ADR-0012 §1): quitar `iconOnly` en `pagination.html:2-9` y `38-46` | Cero `iconOnly` en la molécula | `git grep -c iconOnly -- src/app/shared/components/molecules/pagination/pagination.html` → 0 | TODO |
| H3.S1.M2 | Select de página: `app-select` con una opción por página (ADR-0013: elegir de una lista → select), con `ariaLabel="Ir a la página"` | Elegir una opción navega a esa página | spec: `goTo` desde el select | TODO |
| H3.S1.M3 | Verificar el select de tamaño existente (`pageSizeChoices`, `changePageSize`) y que al cambiar vuelve a la página 1 | Observado en spec | spec: «cambiar tamaño resetea a 1» | TODO |
| H3.S1.M4 | Alineación a la derecha: el host se alinea al final con tokens del sistema, sin valores literales (regla 95.1.5) | A 375 px no desborda (`scrollWidth` ≤ `clientWidth`) | medición en navegador pegada | TODO |
| H3.S1.M5 | Spec de tres niveles: correcto (10 páginas), límite (1 página; última página; `totalItems` = 0), inválido (`pageSize` fuera de las opciones) | ≥ 10 tests en verde | `npx ng test --include=src/app/shared/components/molecules/pagination/pagination.spec.ts --watch=false` | TODO |
| H3.S1.M6 | Comprobar los 3 consumidores actuales a mano, con captura | Las 3 pantallas se comportan igual que antes | `git grep -l '<app-pagination' origin/mockup -- 'src/app/**/*.html'` + 3 capturas en `evidencia/h3/` | TODO |

#### H3.S2 — `data-table`: alto máximo, scroll vertical, sin lateral

**CA:** Dado el organismo con la opción activada, cuando la tabla es más alta que el alto máximo,
entonces desplaza verticalmente dentro de su caja; cuando es más ancha que el contenedor, no desborda ni
desplaza lateralmente: las columnas de menor prioridad se pliegan al detalle. Sin la opción, nada cambia.
**DoD:** spec de tres niveles en verde; 3 consumidores ajenos comprobados con captura en 3 viewports.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H3.S2.M1 | Input nuevo (nombre coherente con el resto del contrato, en el `.ts` con su comentario) que acota el alto y activa `overflow-y: auto`; por omisión **apagado** | Los 30 consumidores no cambian | `git diff` muestra sólo código condicionado por el input | TODO |
| H3.S2.M2 | Con la opción activa, sin `overflow-x`: lo que no entra se pliega por prioridad (`MOBILE_DETAIL_PRIORITY`) también en escritorio | A 1440 px con 8 columnas no hay scroll lateral | medición `scrollWidth` vs `clientWidth` pegada | TODO |
| H3.S2.M3 | `sticky: 'end'` queda sin efecto cuando no hay scroll lateral, y el comentario de `data-table.types.ts:24-27` remite al ADR-0015 con las dos fechas | El comentario cita las dos fechas | `grep -n '2026-09-22' src/app/shared/components/organisms/data-table/data-table.types.ts` | TODO |
| H3.S2.M4 | Spec de tres niveles: correcto (opción activa, 50 filas), límite (0 filas; exactamente el alto máximo), inválido (opción con valor no válido → por omisión) | En verde | `npx ng test --include=src/app/shared/components/organisms/data-table/data-table.spec.ts --watch=false` | TODO |
| H3.S2.M5 | Comprobar 3 consumidores ajenos **sin** la opción (`/administration/patients`, `/administration/organizations`, `/administration/terminology`) | Se ven y se comportan igual que antes | 3 capturas comparadas en `evidencia/h3/` | TODO |
| H3.S2.M6 | Capturas de la opción activa en 375/768/1440, claro y oscuro, **miradas** | 6 capturas con su línea | `evidencia/h3/capturas/` | TODO |

#### H3.S3 — `filter-bar`: la acción a la derecha y el buscador multicampo

**CA:** Dado el organismo, cuando un consumidor proyecta un botón en el hueco de acción, entonces queda
a la derecha, al final de la fila de controles, y en móvil pasa debajo sin taparse; y el buscador emite el
término una sola vez por pausa (300 ms) para que el consumidor filtre por los campos que declare.
**DoD:** spec en verde; 2 consumidores ajenos comprobados; receta escrita en el comentario del organismo.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H3.S3.M1 | Proyección (`ng-content select="[filter-bar-action]"` o equivalente coherente con el organismo) para el botón «Añadir», alineada al final | El botón proyectado queda a la derecha en 1440 y debajo en 375 | 2 capturas | TODO |
| H3.S3.M2 | Receta de buscador multicampo en el comentario de cabecera del organismo: el término se normaliza (acentos, mayúsculas) y el consumidor filtra por N campos en cliente | Hay ejemplo de 5 líneas | `grep -n 'multicampo' src/app/shared/components/organisms/filter-bar/filter-bar.ts` | TODO |
| H3.S3.M3 | Spec: correcto (proyección presente), límite (sin proyección: nada cambia), inválido (dos proyecciones: sólo la primera, o se documenta) | En verde | `npx ng test --include=src/app/shared/components/organisms/filter-bar/filter-bar.spec.ts --watch=false` | TODO |
| H3.S3.M4 | Comprobar 2 de los 8 consumidores ajenos sin proyección | Igual que antes | 2 capturas comparadas | TODO |

### H4 — «Dónde atiendo» cumple la disciplina entera

**Prioridad:** `ALTA`

**CA:** Dado el médico en «Dónde atiendo», cuando agrega o corrige su consultorio, entonces lo hace en un
modal con los campos llenos, «Guardar» se habilita al cambiar algo, confirma antes de guardar y antes de
retirar, busca y filtra arriba, pagina abajo a la derecha, no desplaza a lo ancho, y al tocar el mapa el
campo de dirección queda vacío; y el historial laboral es una tabla con las mismas reglas y adjunto.
**DoD:** cada paso ejercitado en navegador con captura; consola y red limpias; `work-history.spec.ts`
en verde; publicado para Itzan.
**Estado:** TODO

#### H4.S1 — La lista pasa a ser tabla, con barra y paginación

**CA:** Dada la pestaña, cuando se abre, entonces los consultorios son filas de `app-data-table` con
nombre, dirección, tipo (propio/ajeno), QR y acciones (`app-row-actions` como hoy); arriba hay buscador
por nombre y dirección, filtro por tipo y «Agregar mi consultorio propio» a la derecha; abajo a la
derecha, `app-pagination`.
**DoD:** spec en verde; captura en 3 viewports; sin scroll lateral.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H4.S1.M1 | Columnas: nombre (prioridad 1), tipo con la insignia (1), dirección (2), QR (2), acciones (1) con la plantilla que ya monta `app-row-actions` | La tabla muestra lo mismo que la lista mostraba | captura antes/después comparada | TODO |
| H4.S1.M2 | Barra: `app-filter-bar` con buscador (nombre y dirección, normalizado), filtro «Tipo» (Tu consultorio / Trabajás acá), y el botón de alta proyectado a la derecha; en una sede propia ya cargada el botón no aparece (L116-124) | Buscar «olivos» filtra; el botón está a la derecha | captura + spec | TODO |
| H4.S1.M3 | Paginación en cliente con `app-pagination` (10 por página por omisión), abajo a la derecha | Con 3 filas se ve una página | captura | TODO |
| H4.S1.M4 | Alto máximo con scroll vertical, sin lateral (H3.S2) | A 375 px `scrollWidth` ≤ `clientWidth` | medición pegada | TODO |
| H4.S1.M5 | Spec del componente: filtra, pagina, mantiene las acciones | En verde | `npx ng test --include=src/app/features/account/my-profile/work-history/work-history.spec.ts --watch=false` | TODO |
| H4.S1.M6 | Capturas 375/768/1440 × claro/oscuro, miradas | 6 capturas con su línea | `evidencia/h4/capturas/` | TODO |

#### H4.S2 — El formulario del consultorio pasa a un modal (D-04, D-06)

**CA:** Dado «Agregar» o «Editar», cuando se pulsa, entonces se abre `app-content-dialog` con los campos
(llenos si es editar), «Guardar» deshabilitado hasta que algo cambie, confirmación «¿Confirmás estos
cambios?» al guardar, pregunta de descarte al cancelar con cambios, confirmación al retirar, el mapa dentro
del modal con su alto correcto, y tocar el mapa vacía «Dirección».
**DoD:** los ocho comportamientos ejercitados con captura; spec en verde; teclado completo.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H4.S2.M1 | Mover el `<form>` de `work-history.html:172-292` a un `app-content-dialog size="md"` montado con `@if`, con `heading` «Nuevo consultorio» / «Corregir tu consultorio» | El formulario no se dibuja en línea | `grep -c 'sede-formulario' work-history.html` sigue 1, pero dentro del diálogo; captura | TODO |
| H4.S2.M2 | «Guardar» habilitado sólo si el borrador difiere del original (`computed` sobre las señales, sin `effect`) | Abrir editar y guardar sin tocar → deshabilitado | spec + captura | TODO |
| H4.S2.M3 | Confirmación al guardar con la pieza de Marcelo (`confirmarCambios`); si no llegó, `dialogs.confirm({ title: '¿Confirmás estos cambios?', … })` y declarás el doble | Aparece la pregunta; «Cancelar» vuelve al modal con el foco en Guardar | captura ×2 | TODO |
| H4.S2.M4 | Cancelar o `Escape` con cambios → `dismissAttempt` → pregunta de descarte; sin cambios cierra directo | Los dos caminos observados | captura ×2 | TODO |
| H4.S2.M5 | Verificar que «Retirar» desde `app-row-actions` dispara `quitarSede` con su `confirm` (L896) | Observado | captura | TODO |
| H4.S2.M6 | **D-06:** en `marcarPunto($event)` (L255-263), vaciar `direccionDeSede` y anunciar «Volvé a escribir la dirección» junto al campo | Escribir, tocar el mapa → campo vacío | captura + spec | TODO |
| H4.S2.M7 | El mapa dentro del diálogo: Leaflet sobre un nodo recién visible mide 0 px (ver el comentario de `practitioner-profile-edit.html:187-193`); montarlo con `@defer`/`@if` cuando el diálogo ya está abierto | El mapa se ve con calles a la primera | captura | TODO |
| H4.S2.M8 | Spec: alta, edición con campos llenos, guardar por cambios, descarte, retiro | En verde | `npx ng test --include=…/work-history.spec.ts --watch=false` | TODO |
| H4.S2.M9 | Teclado: abrir, recorrer, guardar, confirmar y volver al disparador sin ratón; foco visible | Descripción por paso | `evidencia/h4/teclado.md` | TODO |

#### H4.S3 — El historial laboral como tabla con la disciplina (D-09, segunda mitad)

**CA:** Dado `app-work-history secciones="historial"` con el layout de tabla, cuando se monta, entonces
muestra institución, cargo, desde, hasta, adjunto y acciones; agregar y editar van en modal con adjunto,
guardar por cambios y confirmación; retirar confirma; y todo esto persiste en el simulador y está declarado
como doble porque la API real no lo tiene.
**DoD:** spec en verde; capturas; publicado a Itzan con el nombre exacto del input.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H4.S3.M1 | Localizar el manejador simulado del historial y su colección | Hay ruta:línea en `PLAN.md` | `git grep -n -i 'historial\|employment\|work-history' origin/mockup -- 'src/app/core/mock/handlers/*.ts' 'src/app/core/data-access/profiles/*.ts'` | TODO |
| H4.S3.M2 | Si el manejador vive en un archivo ajeno (`profiles.handlers.ts` es de Itzan): pedir el `PATCH`/`DELETE` por el daily **y** simular el contrato en tres niveles mientras tanto | Pedido anotado en los dos dailies; doble declarado | `evidencia/h4/doble-historial.md` | TODO |
| H4.S3.M3 | Layout `tabla` (input `layout` ya admite `flat`/`timeline`, `work-history.ts:195`) con `app-data-table`, barra y paginación en cliente | Con `layout="tabla"` se ve la tabla; sin él, nada cambia | spec + captura | TODO |
| H4.S3.M4 | Editar y retirar por fila (`app-row-actions`) con modal de campos llenos, guardar por cambios y las dos confirmaciones | Ejercitado | capturas | TODO |
| H4.S3.M5 | Adjunto en agregar y en editar (`app-file-input`, PDF/JPG/PNG, 5 MB, como el diploma); **el contrato real no tiene `fileId` para el historial**: doble declarado (Q-9) | El archivo se guarda y se descarga desde la fila | captura + nota en `REPORTE.md` | TODO |
| H4.S3.M6 | El modal de alta existente (L408-527) gana la confirmación al guardar y el descarte con cambios | Observado | captura ×2 | TODO |
| H4.S3.M7 | Spec del historial: tabla, alta, edición, retiro, adjunto | En verde | `npx ng test --include=…/work-history.spec.ts --watch=false` | TODO |
| H4.S3.M8 | Publicar a Itzan por el daily: el selector, el input y un ejemplo de montaje en la pestaña Trayectoria | Itzan puede montarlo sin preguntarte | sección en tu daily y en el de equipo | TODO |

### H5 — D-05: veredicto por cada `iconOnly`

**Prioridad:** `MEDIA`

**CA:** Dado el inventario de 78, cuando cualquiera lo lee, entonces cada fila dice «excepción ADR-0012
§3, con `aria-label` + globo y motivo» o «convertir», y quién lo hace; los tres tuyos están aplicados.
**DoD:** tabla publicada en el daily de equipo; cero `iconOnly` sin motivo en tus tres.
**Estado:** TODO

#### H5.S1 — Inventario con veredicto, y los tuyos

**CA:** Dado un botón sólo-ícono de tus archivos, cuando se lo mira, entonces tiene texto o la excepción
escrita al lado.
**DoD:** las 4 microtareas en `HECHO`.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H5.S1.M1 | Tabla de los 78 (de la §3 de la verificación) con veredicto propuesto y dueño | 78 filas | `evidencia/h5/iconos.md` | TODO |
| H5.S1.M2 | Publicarla en el daily de equipo | Los otros cuatro la ven | sección en `Daily-Noche-2026-09-22.md` | TODO |
| H5.S1.M3 | Aplicar en `site-bank-qr-dialog.html` (1): texto o excepción con motivo al lado; `pagination.html` ya quedó en H3.S1 | Cero sin motivo | `git grep -n iconOnly -- src/app/features/account/my-profile/work-history/` | TODO |
| H5.S1.M4 | Spec o captura del cambio | Observado | `evidencia/h5/` | TODO |

### H6 — Regresión, gates y cierre

**Prioridad:** `ALTA`

**CA:** Dado el cierre, cuando alguien que no vio tu turno lee el reporte, entonces sabe qué quedó
demostrado, qué quedó a medias con las cuatro respuestas, qué se cerró contra un doble y qué no se cubrió.
**DoD:** baseline repetido y comparado, barrido con `--workers=1`, capturas miradas, `REPORTE.md` escrito.
**Estado:** TODO

#### H6.S1 — Regresión, con la muestra ajena

**CA:** Dado tu cambio, cuando corrés los comandos del baseline, entonces ningún rojo es nuevo; y los
consumidores ajenos de las tres piezas están comprobados a mano.
**DoD:** salidas comparadas + capturas.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H6.S1.M1 | `lint` y `typecheck` | Sin rojos nuevos | diff contra `evidencia/antes/` | TODO |
| H6.S1.M2 | `test` completo | Sin rojos nuevos | diff contra baseline | TODO |
| H6.S1.M3 | El simulador entero con cada cuenta | Nada lanza ni devuelve 500 | `npx ng test --include=src/app/core/mock/mock-backend.spec.ts --watch=false` | TODO |
| H6.S1.M4 | Barrido de pantallas, serial | Ninguna ruta rompe | `E2E_BASE_URL=http://localhost:4200 npx playwright test playwright/mockup-barrido.spec.ts --workers=1` | TODO |
| H6.S1.M5 | Barrido de clics sobre `/my-account` y `/my-account/edit` | Sin excepciones ni 5xx | `… playwright/mockup-click-sweep.spec.ts --workers=1` | TODO |

#### H6.S2 — Cierre honesto

**CA:** Dado el reporte, cuando se lee la primera línea, entonces está el avance calculado; y ninguna
palabra es más fuerte que la evidencia.
**DoD:** `REPORTE.md` con sus tres secciones y el avance arriba; peldaño por área.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H6.S2.M1 | Capturas finales por viewport y tema, miradas | 6 capturas con su línea | `evidencia/h6/` | TODO |
| H6.S2.M2 | Declarar qué quedó `VERIFIED` **contra el doble** (historial, edición de sede si el manejador es ajeno) y la brecha para `dev` | Hay lista | sección «Contra el doble» en `REPORTE.md` | TODO |
| H6.S2.M3 | Declarar el peldaño por área (regla 30) | Hay peldaño por área | sección en `REPORTE.md` | TODO |
| H6.S2.M4 | Escribir `REPORTE.md` con el avance primero | `head -3` muestra el avance | `head -3 REPORTE.md` | TODO |
| H6.S2.M5 | Enumerar procesos que quedaron corriendo y cerrarlos | Lista, o «ninguno» | sección en `REPORTE.md` | TODO |

## 5. Ambigüedades registradas

| ID | Ambigüedad | Supuesto con el que trabajás | Quién puede resolverla | Qué bloquea |
|---|---|---|---|---|
| Q-5 | Paginación con números y selects vs. cursor del organismo | Listas locales → `app-pagination` en cliente; cursor donde la API lo impone; el ADR lo escribe | Vos + doctor | H2.S1.M2 |
| Q-6 | «Sin scroll X» vs. `sticky: 'end'` del 18/09 | Gana el pedido nuevo; lo que no entra se pliega; el ADR conserva las dos fechas | Propietario + doctor | H2.S1.M3, H3.S2 |
| Q-7 | «Para cancelar… eliminar»: ¿Cancelar del modal o retirar la fila? | Las dos: retirar confirma; cancelar con cambios pregunta si descarta | Doctor | H4.S2.M4-M5 |
| Q-9 | Adjunto en el historial laboral sin `fileId` en el contrato real | Doble declarado en el simulador; brecha para `dev` en el reporte | Vos (contrato) | H4.S3.M5 |
| Q-18 | ¿La disciplina se aplica esta noche a las 30 tablas? | No: a «Dónde atiendo» y a las 3 del perfil (Itzan); las otras 26 quedan inventariadas con dueño propuesto | Vos | H1.S2.M1 |
| Q-P1 | ¿El manejador simulado del historial laboral es tuyo o de Itzan? | Se localiza en H4.S3.M1; si es de ella, se pide **y** se simula | Vos e Itzan | H4.S3 |
| Q-P2 | ¿Un `confirm` (`<dialog>` con `showModal`) sobre un `content-dialog` abierto apila bien en todos los navegadores probados? | Marcelo lo prueba (su H4.S1.M6); si no llegó, lo probás en H4.S2.M3 y lo anotás | Marcelo | H4.S2.M3 |

## 6. Definition of Done del hito

- [ ] Todas sus microtareas en `HECHO`, o en `A MEDIAS`/`BLOQUEADO`/`DESCARTADO` **con las cuatro
      respuestas**.
- [ ] La salida literal del comando de cada DoD está en `evidencia/`, no parafraseada.
- [ ] `yarn lint`, `yarn typecheck` y `yarn test --watch=false` sin rojos **nuevos** respecto del
      baseline de H1.S1, con el diff pegado.
- [ ] **Ningún consumidor que no optó por el patrón cambió de comportamiento**: 3 de `data-table`, 3 de
      `pagination`, 2 de `filter-bar`, comprobados a mano con captura.
- [ ] Los modales cumplen 95.4.2: rol y nombre, foco inicial adentro, atrapado, `Escape`, restauración.
- [ ] El borrador se preserva ante fallo, el doble envío está bloqueado, y «Guardar» se habilita por
      cambios (regla 95.3, D-08).
- [ ] Lo que sólo persiste el simulador está declarado como **verificado contra el doble** (regla 65).
- [ ] Capturas por viewport y tema, **miradas**, con una línea cada una.
- [ ] Peldaño de evidencia declarado por área (regla 30).
- [ ] Sin datos de personas en logs, capturas, plan ni reporte (regla 90.2). Sólo `medica@alovida.mock`.
- [ ] El `PLAN.md` está actualizado en el momento, no al final.

## 7. Cómo cerrás el turno

1. **Checkpoint** en cada apertura y cierre de microtarea. Prohibido encadenar más de tres operaciones
   materiales sin uno.
2. **`REPORTE.md`** con el avance en la **primera línea**: `> **AVANCE: <HECHO> / 68 — <%>.**`
3. **Las tres secciones obligatorias existen siempre.** Una vacía se escribe con «ninguna».
4. **Lo que dependa de Marcelo (confirmación) o de Itzan (manejador del historial)** no cierra como
   `BLOQUEADO` sin haber simulado los tres niveles de su contrato (regla 65).
5. **Publicá H2 y H3.S1 apenas estén**, aunque el resto quede a medias: cuatro personas dependen de eso.
6. **Enumerá qué quedó corriendo** y cerralo.
7. **Tu daily** es `Pablo-Daily-Noche-2026-09-22.md`, en la carpeta de arriba.

## 8. Revisión adversarial antes de cerrar

1. ¿Cambió el comportamiento de algún consumidor que **no** optó por el patrón? ¿Lo sabés o lo suponés?
2. ¿El ADR borra la razón del 18/09 en vez de conservarla con la fecha nueva?
3. ¿«Guardar» se habilita por validez y no por cambios, y lo llamaste «hecho»?
4. ¿La confirmación al guardar apila bien sobre el modal, o el foco se pierde al cerrar la segunda?
5. ¿El mapa dentro del modal mide 0 px la primera vez?
6. ¿Vaciar la dirección al tocar el mapa le borra algo a quien tocó el mapa **antes** de escribir? ¿Está dicho?
7. ¿Declaraste como `VERIFIED` algo que sólo persiste en el simulador, sin decir «contra el doble»?
8. ¿Hay un `iconOnly` tuyo sin texto y sin la excepción escrita al lado?
9. ¿Un `select` de página con 200 opciones es usable? ¿Medido, o supuesto?
10. ¿Se declara verificado algo que sólo fue inspeccionado estáticamente?
