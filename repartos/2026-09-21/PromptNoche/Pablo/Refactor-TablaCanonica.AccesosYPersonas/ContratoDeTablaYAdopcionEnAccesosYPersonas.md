# La tabla canónica y las 31 pantallas que hoy la replican en vez de usarla

> **Rol:** propietario de la familia «tabla de datos» y coordinador del reparto · **Línea:** A · **Fecha:** 2026-09-21 · **Turno:** noche
> **Fuente del pedido:** [`REFACTOR-FRONTEND-2026-09-21.md`](../../../../../docs/requisitos/REFACTOR-FRONTEND-2026-09-21.md) — secciones **7, 8, 9, 10.2, 11 y 14**
> **Verificación contra el código:** [`VERIFICACION-CONTRA-CODIGO-2026-09-21.md`](../../../../../docs/verificacion/VERIFICACION-CONTRA-CODIGO-2026-09-21.md) — secciones **4, 5, 6 y 8**
> **6 hitos · 15 subtareas · 63 microtareas**, todas con criterio de aceptación y Definition of Done.
>
> **Sos además el dueño de la decisión Q-A**, la que bloquea a Justin igual que a vos. Tomarla es una
> microtarea de tu H1, no un pendiente: mientras no esté tomada, dos carriles migran a ciegas.

## 0. Ficha de asignación

| Campo | Valor |
|---|---|
| `REPO` | `alovida/mantra-core-health` (frontend Angular). **Nada de backend en este lote** |
| `TARGET_REF` | `origin/mockup` — corte leído **`5a0776c66b005ad4d2d6722321e933cd7adea621`** (2026-09-21T17:35-04). **Reconsultalo y fijá el tuyo** en tu `PLAN.md` |
| `RAMA DE TRABAJO` | Una tuya, saliendo de `origin/mockup`. **Nada directo sobre `mockup`, nada sin PR** |
| `ARCHIVOS RESERVADOS PARA VOS` | `src/app/shared/components/organisms/data-table/**` · `organisms/view-state-host/**` · `organisms/filter-bar/**` · `src/app/features/alovida/accesos/**` · `src/app/features/alovida/personas/**` |
| `ARCHIVOS DE OTROS — NO LOS TOQUES` | `scripts/**`, `features/component-stock/**`, `core/mock/faker/**` y **los tres barrels** `shared/components/*/index.ts` (Ender: el export nuevo se lo pedís) · `organisms/{directory-page,page-header}/**`, `molecules/{search-field,pagination}/**` y `features/alovida/{terminologia,datos-compartidos,buscar,directorio,inicio}/**` (Justin) · `organisms/{paginated-form,form-section,form-actions}/**`, `molecules/form-field/**`, `features/auth/register-*/**`, `features/account/my-profile/**` (Itzan) · `organisms/{content-dialog,attachment-dialog,attachment-uploader,fact-section}/**` y `features/clinical-record/**` (Marcelo) |
| `LA MAQUETA NO TIENE BACKEND` | `mockBackend: true` fijo en `src/environments/environment.ts`. Ninguna petición sale a la red: las contesta `src/app/core/mock/mock-backend.interceptor.ts` desde `core/mock/handlers/` y `core/mock/fixtures/`. **Lo que te falte ahí se lo pedís a Ender por el daily** — `core/mock/**` no es tuyo |
| `CUENTA DE PRUEBA` | `superadmin@alovida.mock` y `admin@alovida.mock` (cualquier contraseña no vacía). **Sintéticas declaradas**: se pueden pegar |
| `DÓNDE SE PRUEBA` | Las pantallas de `accesos` y `personas` cuelgan de las rutas que declara `features/alovida/alovida.routes.ts` (43 KB). **Abrilo antes de suponer una URL** |
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

**Si el `git clone` falla con 404:** el estándar todavía no está publicado. Pedíselo a Pablo por
copia directa y registralo como límite de acceso. **Un 404 no demuestra que el repositorio no exista.**

### 1.2 Qué te instala eso

| Candado | Qué impide |
|---|---|
| `plan_gate.py` | Escribir código sin `PLAN.md` en disco. Nunca bloquea `.md` ni nada bajo `docs/` |
| `report_gate.py` | Cerrar la sesión con trabajo activo y sin `REPORTE.md`, o sin sus tres secciones |
| `blocker_gate.py` | Cerrar con microtareas en `BLOQUEADO` o `EN CURSO` sin declarar la simulación de los tres niveles del contrato (regla 65) |

**En cualquier otra herramienta los candados NO corren.** El plan y el reporte siguen siendo igual de
obligatorios; lo único que cambia es que nadie te va a frenar.

### 1.3 Skills que tenés que CARGAR para este lote

Son **25**: 11 del proceso y 14 propias de la familia tabla.

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
| `frontend-data-tables` | **la más importante de tu lote**: columnas, identidad, orden, selección y qué hace una tabla en móvil |
| `smart-dumb-components` | quién trae los datos y quién los pinta; la separación que estas 31 pantallas no tienen |
| `atomic-design-components` | reusar antes de crear, y por qué copiar la clase CSS no es reusar |
| `frontend-ux-states` | los cuatro estados mínimos, y los diez que ya declara `ViewState` |
| `search-and-filtering` | filtros, orden determinista y paginación coherente |
| `frontend-accessibility` | `caption`, encabezados de columna, orden de foco y foco visible |
| `frontend-responsive-layout` | qué pasa con una tabla de 9 columnas en 390 px |
| `refactoring-safely` | cómo se migra un consumidor sin cambiar comportamiento |
| `dead-code-duplication` | qué se retira y cuándo, y cómo se mide quién lo usa |
| `angular-signals-state` | dónde vive el estado del listado y qué se deriva |
| `typescript-standards` | `ColumnDef<Row>` y `trackBy` tipados sin castear |
| `unit-testing` | un comportamiento por test, y no testear la implementación |
| `visual-proof` | la captura no vale si no la mirás |
| `e2e-playwright` | locators por rol y texto, cero `waitForTimeout` |

Entrá siempre por `skills-router`: **no leas el catálogo entero, no sirve.**

### 1.4 DoD de esta sección — se verifica como cualquier otra

- [ ] `ls .claude/skills | wc -l` devolvió **176**, y la salida está pegada en tu daily.
- [ ] `python .claude/hooks/plan_gate.py --self-test` devolvió **11 PASS, 0 FAIL**, salida pegada.
- [ ] Leíste `skills-router` y las 25 skills de las dos tablas, **empezando por `frontend-data-tables`**.
- [ ] Creaste tu `PLAN.md` **antes** del primer `Edit`/`Write` de código.

**Sin estas cuatro casillas, tu lote arranca en `BLOQUEADO`, no en `EN CURSO`.**

> ### ✅ Hechos ya verificados contra el corte — no los repitas, pero tampoco los creas sin abrir el archivo
>
> #### El organismo canónico YA EXISTE y su contrato ya es el que pide el documento
>
> `src/app/shared/components/organisms/data-table/data-table.ts`:
>
> | Línea | Miembro |
> |---|---|
> | 95 | `state = input.required<ViewState<readonly Row[]>>()` |
> | 96 | `columns = input.required<readonly ColumnDef<Row>[]>()` |
> | 99 | `trackBy = input.required<(row: Row) => string>()` |
> | 102 · 109 | `caption` · `rowLabel` |
> | 111 · 112 · 113 | `selectable` · `sort` · `cursor` |
> | 115-117 | `sortChanged` · `cursorChanged` · `selectionChanged` |
> | 132 · 137 | `rowNavigable` · `rowActivated` |
> | 148 · 151 | `retry` · `refresh` |
>
> Y `data-table.types.ts` **23-55**: `ColumnDef<Row>` con `key`, `header`, `priority`, `align`,
> `sortable`, `sticky?: 'end'` y **`cell?: TemplateRef<{ $implicit: Row }>`**. `SortState` (44) y
> `CursorState` con `prevCursor`/`nextCursor` (53): **paginación por cursor, no por índice**.
>
> **Consecuencia:** crear un `DataTable` nuevo está prohibido (regla 00 §1.1). Lo que se hace es
> **documentar este contrato, extenderlo sólo si una pantalla real lo necesita, y adoptarlo.**
>
> #### Adopción real hoy, medida
>
> `<app-data-table` aparece en **29** plantillas. `<app-view-state-host` en **69**.
> `<app-filter-bar` en **7**. Y hay **81** plantillas de `features/**` con `<table>` **crudo**,
> de las cuales **70 están en `features/alovida/`**.
>
> #### Qué son tus 31 pantallas, exactamente
>
> `features/alovida/accesos/` tiene **16** plantillas con `<table>` crudo y `personas/` **15**. Su
> componente es una cáscara vacía. Éste es, completo, el de `personas/apoderados-de-portal-listado`:
>
> ```ts
> @Component({
>   selector: 'app-alovida-personas-apoderados-de-portal-listado',
>   imports: [RouterLink],
>   templateUrl: './apoderados-de-portal-listado.html',
> })
> export class PersonasApoderadosDePortalListado {}
> ```
>
> Y la plantilla **replica las clases del sistema en vez de instanciar los componentes**:
> `<div class="app-page-header" app-page-header="">`, `<section class="app-filter-bar" app-filter-bar="">`,
> `<input class="app-input" app-input="">`, más enlaces muertos declarados con
> `aria-disabled="true" data-sin-destino=""`.
>
> De los **161** `.ts` de `features/alovida/`, sólo **22** importan algo de `shared/components`.
>
> 🚩 **Y acá está la trampa que te toca resolver:** ese marcado lo **genera**
> `scripts/port-vistas-alovida.mjs` desde un vault de 133 pantallas HTML, y su propio encabezado dice
> **«ARCHIVO GENERADOR. Lo que produce se puede editar a mano; si se vuelve a correr, lo pisa.»**
> No tiene mecanismo de exclusión. Sus rutas `VAULT` y `FRONT` son **absolutas de tu Mac**
> (líneas 30-32), así que hoy nadie más puede correrlo. **Migrar una pantalla sin resolver esto es
> trabajo que la próxima corrida borra.** Es la ambigüedad **Q-A** y la decidís vos, en H1.S3.
>
> ⚠️ **Lo que la verificación NO hizo: ejecutar.** No se levantó la maqueta, no se corrió un test, no
> se miró una captura, y **no se abrió el cuerpo** de ninguna de las 31 plantillas más allá del
> ejemplo citado. Que dos listados tengan `<table>` no prueba que compartan anatomía: eso es lo que
> H2 te pide demostrar antes de fusionar nada (§7.1).

## 2. Resultado observable

| Hito | Prioridad | Qué queda demostrado |
|---|---|---|
| **H1** | `BLOQUEANTE` | Corte declarado, baseline de los cinco comandos con sus rojos previos registrados, capturas **antes** de dos pantallas de cada submódulo, y **la decisión Q-A tomada y escrita** — con lo que Justin también queda destrabado. |
| **H2** | `ALTA` | Está demostrado con evidencia **cuáles** de las 31 pantallas son la misma familia y cuáles no: propósito, anatomía, contrato, comportamiento y apariencia comparados, con un **contraejemplo** declarado de lo que la abstracción NO debe absorber. |
| **H3** | `ALTA` | El contrato de `DataTable<Row>` está documentado como contrato (entradas, salidas, composición, estado, compatibilidad) y **dos** pantallas reales —una de `accesos` y una de `personas`— lo usan de verdad, con su `ViewState`, su `trackBy` y sus columnas, y conservan su apariencia. |
| **H4** | `ALTA` | La oleada avanza sobre el resto de las 31 con el mismo patrón, y el avance se mide con denominador: `migradas / 31`. |
| **H5** | `MEDIA` | El marcado replicado que quedó sin uso está retirado, o está declarado por qué no se puede retirar todavía y quién lo destraba. Nada se borra sin haber medido sus consumidores. |
| **H6** | `ALTA` | Regresión y gates corridos, capturas por viewport y tema miradas, §19 respondido con evidencia, y `REPORTE.md` escrito. |

> ⚠️ **Esto es más de lo que entra en una noche, y está dicho a propósito.** 31 pantallas no se migran
> en un turno, y el documento maestro lo dice: «no confundas completar un piloto con completar todo el
> alcance» (§6). Lo que no se cierra queda `A MEDIAS` con qué anda, qué no anda y qué falta
> exactamente. **Dos consumidores migrados y demostrados valen más que treinta a medias.**

**Kill-test del turno completo:** abrí `/personas/apoderados-de-portal-listado` (o la ruta real que
declare `alovida.routes.ts`) y buscá `app-data-table` en el DOM. Si lo que hay es un `<table>` con
`class="app-..."` escrito a mano, la adopción no ocurrió. Después buscá los cuatro estados: si no
existe forma de ver la pantalla cargando, vacía y en error, `ViewState` no está conectado y H3 no está
hecho.

## 3. Alcance

**IN:** baseline de `lint`, `typecheck`, `test`, `audit:vistas` y `stock:generate` con rojos previos
registrados · **la decisión Q-A escrita** con su alternativa descartada · ficha de familia del §7.3
para la tabla de listado de `alovida`, con miembros, invariantes, diferencias visuales, diferencias de
dominio, pieza canónica, alternativas descartadas, consumidores a migrar y **contraejemplo** ·
contrato completo de `DataTable<Row>` según la tabla del §10, incluido el contrato de selección y
paginación del §10.2 · extensión mínima del organismo **sólo** si una pantalla real la necesita, con
compatibilidad para los 29 consumidores actuales · adopción real en al menos dos pantallas, una de
cada submódulo · oleada sobre el resto con avance medido · retirada del marcado replicado que quede
sin uso, con medición previa · specs dirigidos al cambio · capturas por viewport y tema ·
`PLAN.md`, `REPORTE.md` y `evidencia/`.

**OUT:** **cualquier archivo fuera de los cinco reservados de la ficha** · `features/alovida/terminologia|datos-compartidos|buscar|directorio|inicio` — **son de Justin**: el patrón se lo pasás por el daily, no le migrás las pantallas · `scripts/port-vistas-alovida.mjs` **como archivo**: la decisión Q-A la tomás, pero si implica tocar el generador, eso es una microtarea nueva que se agrega al plan y se anuncia, porque el generador afecta a 133 pantallas y a Justin · los tres barrels de `shared/components` — son de Ender · **cambiar el contrato de `ViewState<T>`**: tiene 69 consumidores y 10 estados documentados con su razón (§6 de la verificación); si te incomoda, se registra · **romper la compatibilidad de `DataTable`** con sus 29 consumidores actuales sin adaptador y sin probarlos · convertir la paginación por cursor en paginación por índice «para simplificar la demo» (§10.2 lo prohíbe) · quitar `aria-disabled`/`data-sin-destino` de los enlaces muertos sin entender qué los mueve (`AlovidaRuntimeService.controlesDeMaqueta()`) · inventar datos de catálogo para poblar una tabla: los fixtures son de Ender y los datos de catálogo necesitan procedencia (regla 97.4) · debilitar un spec para que pase · declarar `HECHO` una microtarea cuyo DoD no corriste.

## 4. Plan — hitos, subtareas y microtareas

Los seis estados permitidos son exactamente: `TODO`, `EN CURSO`, `HECHO`, `A MEDIAS`, `BLOQUEADO` y
`DESCARTADO`. **`A MEDIAS` es legítimo; disfrazarlo de `HECHO` no.**

### H1 — Corte, baseline, capturas previas y la decisión que destraba a dos carriles

**Prioridad:** `BLOQUEANTE`

**CA:** Dado tu entorno, cuando alguien pregunta contra qué versión trabajaste, cómo se veían las
pantallas antes y qué se decidió sobre el generador, entonces hay SHA, capturas y una decisión escrita.
**DoD:** cuatro salidas de comando en `evidencia/antes/`, cuatro capturas descritas, y la decisión Q-A
en un archivo del repo.
**Estado:** TODO

#### H1.S1 — Corte y baseline

**CA:** Dado un rojo posterior, cuando alguien pregunta si lo rompiste vos, entonces la respuesta sale
de un archivo.
**DoD:** las salidas con su código de salida, pegadas.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H1.S1.M1 | Fijar corte y rama | Hay SHA y rama en `PLAN.md` | `git rev-parse origin/mockup && git branch --show-current` | TODO |
| H1.S1.M2 | Baseline de `lint` y `typecheck` | Hay salida y exit code | `yarn lint; yarn typecheck; echo "exit=$?"` → `evidencia/antes/` | TODO |
| H1.S1.M3 | Baseline de `test` | Hay conteo de fallos previos | `yarn test --watch=false` → `evidencia/antes/test.txt` | TODO |
| H1.S1.M4 | Baseline de `audit:vistas` | Hay salida | `yarn audit:vistas` → `evidencia/antes/audit-vistas.txt` | TODO |
| H1.S1.M5 | Clasificar cada rojo previo | Cada uno tiene su clase de la regla 80.4 | tabla en `PLAN.md` | TODO |

#### H1.S2 — Las rutas reales y las capturas de antes

**CA:** Dada una pantalla que vas a tocar, cuando alguien pregunte cómo se veía, entonces hay una
captura anterior al cambio, no un recuerdo.
**DoD:** cuatro capturas en `evidencia/antes/capturas/`, cada una con una línea de qué se ve.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H1.S2.M1 | Sacar las rutas reales de `accesos` y `personas` del router | Hay lista de URLs verificadas | `git show origin/mockup:src/app/features/alovida/alovida.routes.ts \| grep -n 'accesos\|personas' \| head -40` | TODO |
| H1.S2.M2 | Listar las 31 plantillas con `<table>` crudo | El conteo da 16 + 15 | `git grep -l '<table' origin/mockup -- 'src/app/features/alovida/{accesos,personas}/**/*.html' \| wc -l` → 31 | TODO |
| H1.S2.M3 | Capturar dos pantallas de `accesos` en escritorio y móvil | Cuatro capturas, miradas | `evidencia/antes/capturas/`, con una línea cada una | TODO |
| H1.S2.M4 | Capturar dos pantallas de `personas` igual | idem | idem | TODO |

#### H1.S3 — La decisión Q-A

**CA:** Dada la ambigüedad del generador, cuando Justin o vos empiecen a migrar, entonces hay una
decisión escrita que dice qué pasa cuando el generador se vuelva a correr — y no se descubre después.
**DoD:** la decisión en un archivo del repo, con su alternativa descartada y a quién afecta.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H1.S3.M1 | Leer el generador y confirmar que no tiene exclusión | Hay veredicto con línea | `git show origin/mockup:scripts/port-vistas-alovida.mjs \| sed -n '1,60p'` | TODO |
| H1.S3.M2 | Leer la documentación del port antes de decidir | Está leída | `git show origin/mockup:docs/design-system/port-alovida.md \| head -60` | TODO |
| H1.S3.M3 | Escribir la decisión: generador emite canónico / pantalla sale del generador / generador congelado | Hay una opción elegida y dos descartadas con motivo | el archivo de decisión, en la carpeta que ya existe (`docs/adr/` o `docs/refactor-profesional/trabajo/DECISIONES.md`) | TODO |
| H1.S3.M4 | Avisarle a Justin por el daily | Su daily lo referencia | línea en `Pablo-Daily-Noche-2026-09-21.md` y en el de equipo | TODO |

### H2 — Demostrar la familia antes de abstraerla

**Prioridad:** `ALTA`

**CA:** Dado el conjunto de 31 listados, cuando afirmás que son la misma familia, entonces lo
respaldás comparando las cinco dimensiones del §7.1 sobre una muestra real, y declarás un
contraejemplo: un listado cercano que la abstracción **no** debe absorber.
**DoD:** la ficha del §7.3 completa, con miembros citados por ruta.
**Estado:** TODO

#### H2.S1 — Comparar las cinco dimensiones

**CA:** Dada una muestra de al menos seis listados, cuando comparás, entonces cada dimensión tiene
veredicto por pantalla, no una impresión global.
**DoD:** tabla de 6 × 5 en `PLAN.md`, con ruta por fila.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H2.S1.M1 | Elegir la muestra: 3 de `accesos` y 3 de `personas` | Seis rutas anotadas | lista en `PLAN.md` | TODO |
| H2.S1.M2 | Comparar propósito y anatomía (regiones, orden, semántica DOM) | Seis veredictos | tabla con la anatomía de cada una | TODO |
| H2.S1.M3 | Comparar contrato (columnas, acciones, estados) | Seis veredictos | idem | TODO |
| H2.S1.M4 | Comparar comportamiento (orden, selección, filtro, navegación de fila) | Seis veredictos | idem, observado en la maqueta, no leído | TODO |
| H2.S1.M5 | Comparar apariencia y separar decoración de estructura (§11) | Está clasificada cada regla relevante | tabla de estructura / semántica visual / decoración / contexto | TODO |

#### H2.S2 — La ficha de decisión y el contraejemplo

**CA:** Dada la ficha, cuando alguien la lee sin haber visto la sesión, entonces sabe qué se comparte,
qué se conserva distinto y qué NO entra.
**DoD:** la ficha con sus once campos del §7.3, incluido el contraejemplo.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H2.S2.M1 | Escribir la ficha de la familia | Tiene los once campos | el archivo, revisado contra §7.3 | TODO |
| H2.S2.M2 | Declarar el contraejemplo | Hay un listado nombrado que no entra, con motivo | fila de la ficha con su ruta | TODO |
| H2.S2.M3 | Decir qué cambio se hará **una sola vez** después de extraer | Hay un cambio concreto nombrado | fila de la ficha | TODO |
| H2.S2.M4 | Registrar las pantallas **excluidas** con su motivo | Ninguna queda sin clasificar | conteo: incluidas + excluidas = 31 | TODO |

#### H2.S3 — El contrato escrito de `DataTable<Row>`

**CA:** Dado el organismo, cuando otro lo va a usar, entonces tiene su contrato escrito según la tabla
del §10 y no necesita leer la implementación.
**DoD:** el contrato en el repo, y el de selección y paginación del §10.2 resuelto explícitamente.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H2.S3.M1 | Documentar identidad, entradas, salidas y funciones de entrada | Las diez áreas del §10 están cubiertas | el archivo de contrato | TODO |
| H2.S3.M2 | Resolver el contrato de selección: por página o global, qué significa «todos» | Está escrito y coincide con el código | cita de `data-table.ts` con línea | TODO |
| H2.S3.M3 | Resolver el contrato de paginación por cursor | Está escrito que es cursor y no índice | cita de `data-table.types.ts:53` | TODO |
| H2.S3.M4 | Declarar compatibilidad con los 29 consumidores actuales | Hay lista de consumidores y veredicto | `git grep -l '<app-data-table' origin/mockup -- 'src/app/**/*.html'` pegado | TODO |

### H3 — Primera adopción real: dos pantallas, una de cada submódulo

**Prioridad:** `ALTA`

**CA:** Dada una pantalla migrada, cuando la abrís, entonces se ve equivalente a la captura previa,
instancia `app-data-table` de verdad, resuelve los estados con `ViewState`, y ordenar o navegar una
fila hace lo que hacía antes.
**DoD:** dos pantallas migradas, con captura antes/después por viewport y el spec dirigido en verde.
**Estado:** TODO

#### H3.S1 — La pantalla de `accesos`

**CA:** Dada la pantalla elegida, cuando se migra, entonces el contenedor trae los datos y el
organismo los pinta: la plantilla no arma filas a mano.
**DoD:** captura antes/después + spec en verde + consola y red sin errores nuevos.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H3.S1.M1 | Definir las columnas como `ColumnDef<Row>[]` tipadas | `typecheck` en verde | `yarn typecheck` | TODO |
| H3.S1.M2 | Definir `trackBy` con identidad estable del dominio | No usa el índice | la función, con su test | TODO |
| H3.S1.M3 | Conectar `ViewState` con los estados que la pantalla puede tener | Se pueden ver cargando, vacío y error | tres capturas | TODO |
| H3.S1.M4 | Reemplazar el `<table>` replicado por `<app-data-table>` | El DOM ya no tiene la tabla a mano | captura del DOM + captura visual comparada con la de antes | TODO |
| H3.S1.M5 | Escribir el spec dirigido al cambio | Pasa y falla si se rompe la identidad | `yarn test --watch=false` acotado, salida pegada | TODO |

#### H3.S2 — La pantalla de `personas`

**CA:** Idéntico criterio, sobre otra pantalla, para demostrar reutilización y no un caso único.
**DoD:** los mismos cinco artefactos que H3.S1.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H3.S2.M1 | Columnas tipadas de la segunda pantalla | `typecheck` en verde | `yarn typecheck` | TODO |
| H3.S2.M2 | `trackBy` propio, distinto y correcto | No copia el de la otra pantalla sin pensar | la función, con su test | TODO |
| H3.S2.M3 | Migrar la plantilla conservando su apariencia | Comparación visual sin regresión | captura antes/después en 390, 768 y 1440 | TODO |
| H3.S2.M4 | Conservar las diferencias legítimas de presentación | Las dos pantallas siguen viéndose como antes, distintas entre sí | dos capturas lado a lado | TODO |
| H3.S2.M5 | Acreditar el organismo en el catálogo de Ender | Existe escenario con contrato válido | captura de la ficha del catálogo | TODO |

#### H3.S3 — Extensión mínima, sólo si hace falta

**CA:** Dada una necesidad real de las dos pantallas que el contrato no cubra, cuando se extiende el
organismo, entonces la extensión es la más pequeña de las seis opciones del §8 y no rompe a nadie.
**DoD:** los 29 consumidores siguen compilando y sus tests pasan; si no hizo falta extender, se declara.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H3.S3.M1 | Decidir si hace falta extender, y con qué mecanismo del §8 | Hay decisión con el mecanismo elegido | una línea en la ficha de familia | TODO |
| H3.S3.M2 | Si se extiende: hacerlo sin bandera por pantalla | No hay input con nombre de pantalla | revisión del diff | TODO |
| H3.S3.M3 | Verificar que los 29 consumidores siguen sanos | `typecheck` y `test` en verde | `yarn typecheck && yarn test --watch=false` | TODO |
| H3.S3.M4 | Actualizar el spec del organismo | Cubre el caso nuevo | `yarn test --watch=false` acotado a `data-table.spec.ts` | TODO |

### H4 — Oleada sobre el resto de las 31

**Prioridad:** `MEDIA`

**CA:** Dada la oleada, cuando alguien pregunta cuánto se migró, entonces hay un número con
denominador (`migradas / 31`) y las no migradas tienen estado, no silencio.
**DoD:** la matriz de migración del §17 con una fila por pantalla y su estado.
**Estado:** TODO

#### H4.S1 — La matriz de migración

**CA:** Dada la matriz, cuando se lee, entonces cada una de las 31 tiene consumidor previo,
implementación destino, prueba y estado.
**DoD:** 31 filas, ninguna vacía.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H4.S1.M1 | Crear la matriz con las 31 filas en `TODO` | El conteo de filas es 31 | `grep -c '^|' matriz.md` | TODO |
| H4.S1.M2 | Priorizar por criterio legible, no por facilidad | Hay criterio escrito | una línea de criterio + el orden | TODO |
| H4.S1.M3 | Migrar por lotes de a tres, cerrando cada lote | Cada lote tiene su captura y su spec | tres capturas y un `yarn test` por lote | TODO |
| H4.S1.M4 | Actualizar el avance en el momento | El número del plan coincide con la matriz | `migradas / 31` en `PLAN.md` | TODO |

#### H4.S2 — Que la oleada no pierda comportamiento

**CA:** Dada una pantalla migrada de la oleada, cuando se compara con su captura previa, entonces no
aparece una diferencia visual no justificada, ni un error nuevo en consola o red.
**DoD:** por cada pantalla, captura comparada y consola revisada.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H4.S2.M1 | Revisar consola y red en cada pantalla migrada | Cero errores nuevos | lista de errores por pantalla (vacía o justificada) | TODO |
| H4.S2.M2 | Comprobar el listado en 390 px | La tabla sigue siendo legible o colapsa como corresponde | captura móvil por pantalla | TODO |
| H4.S2.M3 | Comprobar tema oscuro | Nada ilegible | captura oscura por lote | TODO |
| H4.S2.M4 | Comprobar teclado: foco visible y orden | Se recorre la tabla con teclado | descripción por lote + captura del foco | TODO |

### H5 — Retirada del duplicado y prevención

**Prioridad:** `MEDIA`

**CA:** Dado el marcado replicado de una pantalla migrada, cuando ya nadie lo usa, entonces se retira;
y cuando no se puede retirar, está escrito por qué y quién lo destraba.
**DoD:** medición de consumidores antes de cada retirada, y un gate que impida que vuelva.
**Estado:** TODO

#### H5.S1 — Medir antes de borrar

**CA:** Dado algo que parece muerto, cuando lo borrás, entonces antes midiste usos estáticos,
dinámicos, por tipo y de rutas.
**DoD:** cuatro mediciones por candidato.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H5.S1.M1 | Medir usos estáticos del candidato | Hay conteo | `git grep -n '<clase-o-selector>' -- 'src/app/**'` | TODO |
| H5.S1.M2 | Medir usos dinámicos y de ruta | Hay conteo | `git grep -n 'loadComponent\|createComponent' -- 'src/app/features/alovida/**'` | TODO |
| H5.S1.M3 | Retirar sólo lo que dio cero, y dejar constancia | Nada se borró con uso vivo | diff + las mediciones pegadas | TODO |
| H5.S1.M4 | Lo que no se puede retirar queda declarado | Hay motivo y quién lo destraba | sección en `REPORTE.md` | TODO |

#### H5.S2 — Prevención concreta

**CA:** Dado el problema que encontraste, cuando alguien lo repita, entonces un gate lo detecta antes
del merge.
**DoD:** el gate corre y falla ante el caso que querés prevenir; salida pegada.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H5.S2.M1 | Proponerle a Ender la regla que falta en `check-architecture.mjs` | La propuesta está escrita, no implementada por vos | línea en el daily + issue o nota | TODO |
| H5.S2.M2 | Si el gate vive en tu alcance, escribirlo y probar que falla | Falla con el caso malo y pasa con el bueno | dos corridas pegadas | TODO |
| H5.S2.M3 | Documentar el patrón de migración para Justin | Se puede seguir sin preguntarte | el documento, citado en el daily | TODO |

### H6 — Regresión, gates y cierre

**Prioridad:** `ALTA`

**CA:** Dado el cierre, cuando alguien que no vio tu turno lee el reporte, entonces sabe qué quedó
demostrado, qué quedó a medias con las cuatro respuestas, y qué no se cubrió.
**DoD:** baseline repetido y comparado, capturas miradas, §19 respondido y `REPORTE.md` escrito.
**Estado:** TODO

#### H6.S1 — Regresión

**CA:** Dado tu cambio, cuando corrés los comandos del baseline, entonces ningún rojo es nuevo.
**DoD:** las salidas comparadas contra `evidencia/antes/`.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H6.S1.M1 | `lint` y `typecheck` | Sin rojos nuevos | diff contra baseline | TODO |
| H6.S1.M2 | `test` completo | Sin rojos nuevos | diff contra baseline | TODO |
| H6.S1.M3 | `audit:vistas` | Sin rojos nuevos | diff contra baseline | TODO |
| H6.S1.M4 | Barrido de rutas de `accesos` y `personas` con Playwright, `--workers=1` | Ninguna ruta rompe | salida pegada | TODO |

#### H6.S2 — Cierre honesto

**CA:** Dado el reporte, cuando se lee la primera línea, entonces está el avance calculado; y ninguna
palabra es más fuerte que la evidencia.
**DoD:** `REPORTE.md` con sus tres secciones y el avance arriba.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H6.S2.M1 | Capturas finales por viewport y tema | Cinco capturas con su línea | `evidencia/h6/` | TODO |
| H6.S2.M2 | Responder las 20 preguntas del §19 | Cada una con evidencia | sección en `REPORTE.md` | TODO |
| H6.S2.M3 | Declarar el peldaño por área (regla 30) | Hay peldaño por área, y el global es el más bajo | sección en `REPORTE.md` | TODO |
| H6.S2.M4 | Escribir `REPORTE.md` con el avance primero | `head -3` muestra el avance | `head -3 REPORTE.md` | TODO |

## 5. Ambigüedades registradas

| ID | Ambigüedad | Supuesto con el que trabajás | Quién puede resolverla | Qué bloquea |
|---|---|---|---|---|
| Q-A | ¿Las pantallas de `features/alovida/**` se migran a mano, sale el generador de su camino, o el generador aprende a emitir canónico? | Piloto a mano + exclusión declarada, **hasta que tomes la decisión en H1.S3** | **Vos** (y afecta a Justin) | H3, H4, y todo el carril de Justin |
| Q-P1 | ¿Las 31 pantallas necesitan datos nuevos en `core/mock/`? | Sí, algunas; se le piden a Ender y mientras se trabaja contra un doble declarado (regla 65) | Ender | H3, H4 |
| Q-P2 | ¿La selección es por página o global en estos listados? | Por página, porque es lo que el cursor permite sostener sin mentir | Producto / Pablo | H2.S3 |
| Q-P3 | ¿Los enlaces muertos (`data-sin-destino`) se conservan al migrar? | Se conservan: son maqueta declarada, no un bug | Producto | H3, H4 |
| Q-B | ¿Los artefactos del §17 reusan `docs/refactor-profesional/trabajo/`? | Reusar | Vos | H2, H4 |

## 6. Definition of Done del hito

- [ ] Todas sus microtareas en `HECHO`, o en `A MEDIAS`/`BLOQUEADO`/`DESCARTADO` **con las cuatro
      respuestas**.
- [ ] La salida literal del comando de cada DoD está en `evidencia/`, no parafraseada.
- [ ] `yarn lint`, `yarn typecheck` y `yarn test --watch=false` sin rojos **nuevos** respecto del
      baseline de H1.S1, con el diff pegado.
- [ ] Toda pantalla tocada tiene captura **antes y después** en 390, 768 y 1440, y en los dos temas
      si el componente cambia con el tema. **Miradas**, con una línea cada una.
- [ ] Consola y red sin errores nuevos en cada pantalla tocada (regla 95.7.3).
- [ ] Ningún consumidor de `DataTable` quedó roto: los 29 compilan y sus tests pasan.
- [ ] Peldaño de evidencia declarado por área (regla 30).
- [ ] Sin datos de personas en logs, capturas, plan ni reporte (regla 90.2).
- [ ] El `PLAN.md` está actualizado en el momento, no al final.

## 7. Cómo cerrás el turno

1. **Checkpoint** en cada apertura y cierre de microtarea. Prohibido encadenar más de tres operaciones
   materiales sin uno.
2. **`REPORTE.md`** con el avance en la **primera línea**: `> **AVANCE: <HECHO> / 63 — <%>.**`
3. **Las tres secciones obligatorias existen siempre.** Una vacía se escribe con «ninguna».
4. **Lo que dependa de Ender** (un fixture, un export en el barrel) no cierra como `BLOQUEADO` sin
   haber simulado los tres niveles de su contrato (regla 65): correcto, límite e inválido.
5. **Enumerá qué quedó corriendo** y cerralo.
6. **Tu daily** es `Pablo-Daily-Noche-2026-09-21.md`. Además, como coordinador, el de equipo.

## 8. Revisión adversarial antes de cerrar

1. ¿Se podría aprobar este cambio moviendo archivos sin cambiar responsabilidades? (§19.1)
2. ¿La extracción borró una diferencia real de dominio porque dos listados se parecían? (§19.6)
3. ¿Una variación decorativa produjo otro organismo completo? (§19.7)
4. ¿El componente nuevo necesita saber qué pantalla lo usa para decidir su conducta? (§19.5)
5. ¿El producto todavía usa el duplicado mientras el catálogo muestra la pieza nueva? (§19.11)
6. ¿Un cambio de filtro pierde la selección vigente, o una respuesta atrasada reemplaza la actual? (§19.12)
7. ¿Se retiró código sin revisar consumidores dinámicos y rutas? (§19.17)
8. ¿Se declara verificado algo que sólo fue inspeccionado estáticamente? (§19.18)
9. ¿El informe esconde pendientes reduciendo el denominador de 31? (§19.19)
10. ¿La próxima corrida de `port-vistas-alovida.mjs` borra lo que migraste? **Si no podés responder
    esto con la decisión de H1.S3 en la mano, no cierres el hito.**
