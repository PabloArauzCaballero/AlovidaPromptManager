# Que el catálogo diga la verdad: el inventario, las factories y el aislamiento del preview

> **Rol:** propietario de la plataforma del catálogo y del inventario · **Línea:** habilitadora · **Fecha:** 2026-09-21 · **Turno:** noche
> **Fuente del pedido:** [`REFACTOR-FRONTEND-2026-09-21.md`](../../../../../docs/requisitos/REFACTOR-FRONTEND-2026-09-21.md) — secciones **6, 12, 13, 16.1 y 17**
> **Verificación contra el código:** [`VERIFICACION-CONTRA-CODIGO-2026-09-21.md`](../../../../../docs/verificacion/VERIFICACION-CONTRA-CODIGO-2026-09-21.md) — secciones **1, 7 y 9**
> **6 hitos · 15 subtareas · 61 microtareas**, todas con criterio de aceptación y Definition of Done.
>
> **Tu carril habilita a los otros cuatro.** Pablo, Justin, Itzan y Marcelo tienen que acreditar sus
> organismos en el catálogo. Si el catálogo monta con props adivinadas, sus pruebas de fidelidad no
> valen. Por eso este lote va primero en el orden de dependencias, y por eso **H2 y H3 son lo que más
> importa de la noche.**

## 0. Ficha de asignación

| Campo | Valor |
|---|---|
| `REPO` | `alovida/mantra-core-health` (frontend Angular). **Nada de backend en este lote** |
| `TARGET_REF` | `origin/mockup` — corte leído **`5a0776c66b005ad4d2d6722321e933cd7adea621`** (2026-09-21T17:35-04). **Reconsultalo y fijá el tuyo** en tu `PLAN.md` |
| `RAMA DE TRABAJO` | Una tuya, saliendo de `origin/mockup`. **Nada directo sobre `mockup`, nada sin PR** |
| `ARCHIVOS RESERVADOS PARA VOS` | `scripts/generate-component-index.mjs` · `scripts/lib/**` · `scripts/check-architecture.mjs` · `src/app/features/component-stock/**` · `src/app/core/mock/faker/**` |
| `TAMBIÉN SOS EL DUEÑO DE` | los tres barrels: `src/app/shared/components/{atoms,molecules,organisms}/index.ts`. **Nadie más los edita**: si otro necesita un export nuevo, te lo pide por el daily y lo agregás vos. Es el único archivo central del reparto y por eso tiene un solo dueño (regla 70.9) |
| `ARCHIVOS DE OTROS — NO LOS TOQUES` | `organisms/{data-table,view-state-host,filter-bar}/**` (Pablo) · `organisms/{directory-page,page-header}/**` y `molecules/{search-field,pagination}/**` (Justin) · `organisms/{paginated-form,form-section,form-actions}/**`, `molecules/form-field/**`, `features/auth/register-*/**`, `features/account/my-profile/**` (Itzan) · `organisms/{content-dialog,attachment-dialog,attachment-uploader,fact-section}/**` y `features/clinical-record/**` (Marcelo) · `features/alovida/**` (Pablo y Justin) |
| `LA MAQUETA NO TIENE BACKEND` | `mockBackend: true` fijo en `src/environments/environment.ts` de esta rama. Ninguna petición sale a la red: las contesta `src/app/core/mock/mock-backend.interceptor.ts`. **El faker es tuyo; los handlers y fixtures también están bajo `core/mock/`, pero sólo tocás `core/mock/faker/**`** |
| `CUENTA DE PRUEBA` | `medica@alovida.mock`, `superadmin@alovida.mock` (cualquier contraseña no vacía). **Sintéticas declaradas**: se pueden pegar |
| `DÓNDE SE PRUEBA` | El catálogo vive en la ruta que sirve `features/component-stock`. Localizala en `*.routes.ts` **antes** de suponerla |
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

⚠️ **Cuidado con el choque de nombres:** el repo de producto **ya tiene** su propio `.claude/skills/`
(entre otras, `fable-refactor-orchestrator`). Antes de copiar, mirá qué hay: si `cp -r` iba a pisar
algo, **no lo pises** — fusioná y dejá constancia en el daily de qué quedó de cada lado. Pisar skills
del producto es tocar archivos fuera de tu alcance (regla 00 §3.1).

### 1.2 Qué te instala eso

| Candado | Qué impide |
|---|---|
| `plan_gate.py` | Escribir código sin `PLAN.md` en disco. Nunca bloquea `.md` ni nada bajo `docs/` |
| `report_gate.py` | Cerrar la sesión con trabajo activo y sin `REPORTE.md`, o sin sus tres secciones |
| `blocker_gate.py` | Cerrar con microtareas en `BLOQUEADO` o `EN CURSO` sin declarar la simulación de los tres niveles del contrato (regla 65) |

**En cualquier otra herramienta los candados NO corren.** El plan y el reporte siguen siendo igual de
obligatorios; lo único que cambia es que nadie te va a frenar.

### 1.3 Skills que tenés que CARGAR para este lote

Son **25**: 11 del proceso y 14 propias de la plataforma del catálogo.

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
| `atomic-design-components` | **la más importante de tu lote**: qué es átomo, molécula y organismo, y por qué el nivel no lo decide la carpeta |
| `component-architecture-solid` | los ejes de responsabilidad que el índice tiene que poder representar |
| `smart-dumb-components` | la distinción que hoy el scanner no sabe hacer |
| `synthetic-test-data-generation` | datos válidos, límite e inválidos a propósito — el corazón de las factories |
| `edge-case-data-catalog` | los bordes que una factory tiene que poder producir |
| `test-case-design-techniques` | partición de equivalencia y valores límite para los escenarios |
| `angular-development` | `createComponent`, `setInput`, ciclo de vida y destrucción en v21 |
| `angular-testing` | `setInput` con inputs signal y `whenStable` en zoneless |
| `frontend-security` | por qué el preview no puede compartir sesión ni almacenamiento del anfitrión |
| `static-analysis-linting` | por qué una regex no decide estructura, y qué sí |
| `typescript-standards` | validar `unknown` en el borde en vez de castear |
| `technical-docs-and-adr` | registrar la decisión del aislamiento donde alguien la encuentre |
| `visual-proof` | la captura no vale si no la mirás |
| `dead-code-duplication` | qué hacer con lo que el índice revele sin consumidores |

Entrá siempre por `skills-router`: **no leas el catálogo entero, no sirve.**

### 1.4 DoD de esta sección — se verifica como cualquier otra

- [ ] `ls .claude/skills | wc -l` devolvió **176**, y la salida está pegada en tu daily.
- [ ] `python .claude/hooks/plan_gate.py --self-test` devolvió **11 PASS, 0 FAIL**, salida pegada.
- [ ] Leíste `skills-router` y las 25 skills de las dos tablas, **empezando por `atomic-design-components`**.
- [ ] Creaste tu `PLAN.md` **antes** del primer `Edit`/`Write` de código.

**Sin estas cuatro casillas, tu lote arranca en `BLOQUEADO`, no en `EN CURSO`.**

> ### ✅ Hechos ya verificados contra el corte — no los repitas, pero tampoco los creas sin abrir el archivo
>
> Todo con archivo y línea en [`VERIFICACION-CONTRA-CODIGO-2026-09-21.md`](../../../../../docs/verificacion/VERIFICACION-CONTRA-CODIGO-2026-09-21.md) §7.
>
> | Qué | Dónde, al corte `5a0776c6` |
> |---|---|
> | El scanner clasifica el nivel **por ruta** | `scripts/generate-component-index.mjs` **126-129**: `if (path.includes('/shared/components/atoms/')) return 'atomo'` |
> | Y deduce la composición **por imports** | **289-300**: `// Composición: de qué nivel es cada clase importada` |
> | Y lee el fuente con **regex** | **46, 53, 60, 66, 87, 97, 112** |
> | Su salida | **29**: `src/app/features/component-stock/component-index.generated.ts` |
> | El catálogo monta el componente **real** | `component-stock.ts` **8, 306**: `createComponent` |
> | Dentro de un `iframe`, y explica por qué | **38-41, 206, 255** |
> | Pero **con el inyector del documento principal** | **325**, en un comentario del propio código |
> | Pasa `axe-core` sobre lo montado | **479-486** |
> | El faker adivina por nombre y por tipo | `core/mock/faker/props.ts` **125** (`/date\|fecha/i`), **128** (`/id$/i`), **95**, **147** |
> | Y cae en `[]` cuando no sabe | **144** |
> | `check-architecture.mjs` ya revisa ciclos, capas, red y faker | **67-160**; `LAYER_EXCEPTIONS` 44, `NETWORK_ALLOWED` 47, `FAKER_ALLOWED` 63 |
>
> 🚩 **El hecho que cambia tu orden de trabajo:** `package.json` define
> `"start": "yarn env:generate && yarn stock:generate && ng serve"` y lo mismo en `"build"`.
> **Tu generador es dependencia del arranque de los otros cuatro.** Si lo dejás roto diez minutos,
> cuatro personas no pueden trabajar. Por eso H1.S3 exige que el índice regenere **idéntico** antes
> de que toques una línea de la lógica, y por eso cada cambio se cierra con `yarn stock:generate`
> corrido de nuevo.
>
> ⚠️ **Lo que esa verificación NO hizo: ejecutar.** No se corrió `stock:generate`, no se abrió el
> catálogo, no se miró una captura. **Que el comentario de la línea 325 diga que el inyector es del
> anfitrión no prueba qué se rompe por eso.** Eso es tuyo.

## 2. Resultado observable

| Hito | Prioridad | Qué queda demostrado |
|---|---|---|
| **H1** | `BLOQUEANTE` | El corte está declarado, los cinco comandos del repo corrieron con su salida pegada, los rojos **previos** están registrados como previos, y el índice regenera **byte a byte igual** antes de tocar nada. |
| **H2** | `ALTA` | El inventario distingue «está importado» de «se instancia en una plantilla», y lo que no pudo resolver aparece como **no resuelto**, no como ausencia. |
| **H3** | `ALTA` | `DataTable<Row>` y `ContentDialog` se montan en el catálogo con un contrato **válido y escrito a mano en TypeScript** — columnas reales, `trackBy` real, contenido proyectado real — y sus eventos producen salidas observables. |
| **H4** | `MEDIA` | O el preview corre con inyector propio y está demostrado, o está escrito **con evidencia** qué comparte con el anfitrión y qué riesgo deja. Las dos son respuestas válidas; «parece aislado» no. |
| **H5** | `MEDIA` | El catálogo distingue seis estados de acreditación por componente y sobrevive a A→B→A con carga demorada sin dejar montado lo anterior. |
| **H6** | `ALTA` | Regresión y gates corridos, capturas miradas, las 20 preguntas del §19 respondidas con evidencia, y `REPORTE.md` escrito. |

> ⚠️ **Esto es más de lo que entra en una noche, y está dicho a propósito.** Lo que no se cierra queda
> `A MEDIAS` con qué anda, qué no anda y qué falta exactamente (regla 20). **Recortar alcance es
> decisión de coordinación, no tuya, y se registra.**

**Kill-test del turno completo:** abrí el catálogo, elegí `DataTable`, y mirá con qué se montó. Si las
columnas son `[]`, si `trackBy` no existe o si la tabla está vacía, la prueba de fidelidad del §12.1
no está cumplida y H3 no está hecho — por más que la ficha se pinte. Después elegí un componente A
con carga demorada, cambiá a B y volvé a A: si queda algo de la primera montura en el DOM, H5 no está
hecho.

## 3. Alcance

**IN:** baseline de `stock:generate`, `audit:vistas`, `lint`, `typecheck` y `test` con los rojos
previos registrados como previos · el índice generado distinguiendo al menos `imports-available` de
`template-instantiates`, con `unresolvedEvidence` visible · el nivel del componente dejando de salir
sólo de la ruta, con la procedencia de la clasificación declarada · factories y hosts tipados en
TypeScript para los dos pilotos (`DataTable<Row>` y `ContentDialog`), con niveles correcto, límite e
inválido · el fallback del faker marcado como **no verificado** en vez de presentarse como escenario ·
decisión y evidencia sobre el aislamiento del preview · seis estados de acreditación por componente ·
A→B→A con limpieza, incluida la limpieza cuando el montaje **falla** · extensión de
`check-architecture.mjs` sólo para lo que este lote descubra · `PLAN.md`, `REPORTE.md` y `evidencia/`.

**OUT:** **cualquier archivo fuera de los cinco reservados de la ficha** · los organismos de los otros
cuatro: si el catálogo revela que `DataTable` tiene un contrato incómodo, **se lo decís a Pablo, no lo
arreglás** · `features/alovida/**` — es de Pablo y Justin, y además está bajo la ambigüedad Q-A ·
`core/mock/handlers/**` y `core/mock/fixtures/**`: el faker es tuyo, los datos de la maqueta no ·
**reescribir el scanner como un compilador de TypeScript**: el §6 del documento maestro lo prohíbe
explícitamente («no desarrolles un compilador completo antes del primer incremento») · **instalar una
dependencia nueva** para analizar plantillas sin haber demostrado que lo que ya está no alcanza, y sin
registrar la decisión · borrar `fact-section` porque el índice diga que tiene 0 consumidores: **medí
antes** (usos por tipo, dinámicos y del catálogo) y si sobra, se propone · tocar el barrel de otro
para "destrabar" · declarar `HECHO` una microtarea cuyo DoD no corriste.

## 4. Plan — hitos, subtareas y microtareas

Los seis estados permitidos son exactamente: `TODO`, `EN CURSO`, `HECHO`, `A MEDIAS`, `BLOQUEADO` y
`DESCARTADO`. **`A MEDIAS` es legítimo; disfrazarlo de `HECHO` no.**

### H1 — Corte, baseline y el índice que no se mueve

**Prioridad:** `BLOQUEANTE`

**CA:** Dado tu entorno, cuando alguien pregunta contra qué versión trabajaste y qué estaba roto antes
de que llegaras, entonces hay un SHA declarado y cinco salidas de comando pegadas — no un recuerdo.
**DoD:** las cinco salidas en `evidencia/antes/`, y `yarn stock:generate` corrido dos veces dando el
mismo archivo.
**Estado:** TODO

#### H1.S1 — Corte y entorno

**CA:** Dado el repo, cuando declarás el corte, entonces coincide con `origin/mockup` y está escrito
en tu `PLAN.md`.
**DoD:** `git rev-parse origin/mockup` pegado, y la versión de Node y Yarn resueltas.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H1.S1.M1 | Fijar el corte y la rama de trabajo | Hay SHA y nombre de rama en `PLAN.md` | `git rev-parse origin/mockup && git branch --show-current` | TODO |
| H1.S1.M2 | Confirmar el gestor de paquetes y su versión | Coincide con `packageManager` | `yarn --version` → `4.18.0` | TODO |
| H1.S1.M3 | Levantar la maqueta una vez y entrar con una cuenta sintética | Se ve una pantalla autenticada | `yarn start`, captura en `evidencia/antes/` | TODO |

#### H1.S2 — Baseline de los cinco comandos

**CA:** Dado un rojo que aparezca después, cuando alguien pregunte si lo rompiste vos, entonces la
respuesta sale de un archivo, no de la memoria.
**DoD:** cinco archivos en `evidencia/antes/` con la salida literal y el código de salida.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H1.S2.M1 | Baseline de `lint` | Hay salida y exit code | `yarn lint; echo "exit=$?"` → `evidencia/antes/lint.txt` | TODO |
| H1.S2.M2 | Baseline de `typecheck` (los **tres** proyectos) | Hay salida y exit code | `yarn typecheck; echo "exit=$?"` → `evidencia/antes/typecheck.txt` | TODO |
| H1.S2.M3 | Baseline de `test` | Hay salida y conteo de fallos previos | `yarn test --watch=false; echo "exit=$?"` → `evidencia/antes/test.txt` | TODO |
| H1.S2.M4 | Baseline de `audit:vistas` | Hay salida | `yarn audit:vistas; echo "exit=$?"` → `evidencia/antes/audit-vistas.txt` | TODO |
| H1.S2.M5 | Registrar los rojos previos como **previos** | Cada rojo tiene su clase (regla 80.4) | tabla en `PLAN.md` con `PRODUCT_BUG`/`TEST_BUG`/`ENVIRONMENT`/`DATA`/`EXTERNAL` | TODO |

#### H1.S3 — El índice regenera idéntico

**CA:** Dado el generador sin tocar, cuando lo corrés dos veces, entonces produce el mismo archivo;
y cuando lo toques, la diferencia será **la que buscabas** y no ruido.
**DoD:** diff vacío entre dos corridas consecutivas, pegado.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H1.S3.M1 | Correr `stock:generate` y guardar el índice como referencia | Existe la copia | `yarn stock:generate && cp src/app/features/component-stock/component-index.generated.ts evidencia/antes/` | TODO |
| H1.S3.M2 | Demostrar que la segunda corrida no cambia nada | Diff vacío | `yarn stock:generate && diff evidencia/antes/component-index.generated.ts src/app/features/component-stock/component-index.generated.ts` → sin salida | TODO |
| H1.S3.M3 | Contar qué hay hoy en el índice, por nivel | Hay cuatro números | la línea de resumen que el propio generador imprime (`porNivel`, **384-391**) pegada | TODO |
| H1.S3.M4 | Capturar el catálogo **antes**, con dos componentes montados | Dos capturas existen y las mirastes | capturas en `evidencia/antes/catalogo/`, descritas en una línea cada una | TODO |

### H2 — El inventario deja de confundir «importado» con «usado»

**Prioridad:** `ALTA`

**CA:** Dado un componente que está en `imports:` pero no aparece en ninguna plantilla, cuando mirás
el índice, entonces figura como disponible y **no** como instanciado; y dado uno que el analizador no
pudo resolver, entonces figura como **no resuelto** con la causa, no como ausente.
**DoD:** un caso de cada tipo señalado a mano en el repo real y encontrado correctamente clasificado
por el índice regenerado; salida pegada.
**Estado:** TODO

#### H2.S1 — Encontrar los casos que hoy se clasifican mal

**CA:** Dado el índice actual, cuando buscás un falso positivo, entonces lo encontrás con archivo y
línea; si no existe ninguno, eso también se demuestra.
**DoD:** tabla de casos reales en `PLAN.md`, cada uno con ruta.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H2.S1.M1 | Localizar un `import` disponible y **no** instanciado | Hay ruta y línea | comparación entre `imports:` del `.ts` y el selector en el `.html`, pegada | TODO |
| H2.S1.M2 | Localizar un selector de **atributo** (`app-button=""`) usado sin etiqueta | Hay ruta y línea | `git grep -n 'app-button=""' origin/mockup -- 'src/app/**/*.html' \| head` | TODO |
| H2.S1.M3 | Localizar un uso **sólo de tipo** (`import type`) | Hay ruta | `git grep -n 'import type' origin/mockup -- 'src/app/shared/**/*.ts' \| head` | TODO |
| H2.S1.M4 | Localizar una carga dinámica (`import(` o `createComponent`) | Hay ruta | `git grep -n 'createComponent\|await import(' origin/mockup -- 'src/app/**/*.ts'` | TODO |

#### H2.S2 — Distinguir las relaciones en el índice

**CA:** Dado el índice regenerado, cuando lo leés, entonces cada relación tiene su tipo; y ninguna
relación afirma más de lo que el analizador pudo comprobar.
**DoD:** los cuatro casos de H2.S1 clasificados correctamente, con la salida pegada.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H2.S2.M1 | Agregar la relación `template-instantiates` mirando la plantilla, no el import | El caso de H2.S1.M1 ya no figura instanciado | `yarn stock:generate` y `grep` del componente en el índice | TODO |
| H2.S2.M2 | Conservar `imports-available` como relación propia | El mismo componente sí figura disponible | idem | TODO |
| H2.S2.M3 | Reconocer el selector de atributo | El caso de H2.S1.M2 aparece como uso | idem | TODO |
| H2.S2.M4 | Marcar `type-only` sin contarlo como uso visual | El caso de H2.S1.M3 no cuenta como consumidor | idem | TODO |
| H2.S2.M5 | Emitir `unresolvedEvidence` con su causa cuando no se pueda decidir | Hay al menos un registro con causa legible | `grep -c unresolved` en el índice → ≥ 1, con el motivo | TODO |

#### H2.S3 — El nivel deja de salir sólo de la carpeta

**CA:** Dado un componente cuyo nivel no coincide con su carpeta, cuando el índice lo clasifica,
entonces dice **de dónde** salió esa clasificación y admite que se declare en el propio componente.
**DoD:** un componente con nivel declarado explícitamente y respetado por el índice, con salida pegada.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H2.S3.M1 | Agregar la procedencia de la clasificación (`por-ruta` / `declarado`) | Cada entrada dice cuál fue | `grep` del campo en el índice regenerado | TODO |
| H2.S3.M2 | Permitir declarar el nivel en el componente y darle prioridad | El declarado gana sobre la ruta | un componente marcado a mano y su fila en el índice | TODO |
| H2.S3.M3 | Verificar que el conteo por nivel no cambió por accidente | Los cuatro números son explicables | diff contra `evidencia/antes/component-index.generated.ts`, con cada cambio justificado en una línea | TODO |
| H2.S3.M4 | Confirmar que el arranque sigue funcionando | La maqueta levanta | `yarn start` y captura, porque `start` corre `stock:generate` | TODO |

### H3 — Factories y hosts tipados: que el catálogo monte un contrato válido

**Prioridad:** `ALTA`

**CA:** Dado `DataTable<Row>` en el catálogo, cuando se monta, entonces recibe columnas reales, un
`trackBy` que devuelve identidad estable y un `ViewState` con datos; y cuando ordenás o seleccionás,
la ficha muestra la salida emitida. Dado `ContentDialog`, cuando se abre, entonces tiene contenido y
acciones **proyectados** — no un contenedor vacío.
**DoD:** los dos pilotos montados con factory tipada, con captura mirada y la salida del evento
visible; y el caso inválido mostrando error sin perder el último escenario válido.
**Estado:** TODO

#### H3.S1 — La factory de `DataTable<Row>`

**CA:** Dado el contrato real del organismo, cuando la factory produce un escenario, entonces cumple
las tres obligatorias (`state`, `columns`, `trackBy`) con valores coherentes entre sí.
**DoD:** el componente monta sin error de contrato y la tabla muestra filas; captura pegada.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H3.S1.M1 | Leer el contrato antes de escribir la factory | Están anotados los 13 miembros | `git show origin/mockup:src/app/shared/components/organisms/data-table/data-table.ts \| sed -n '90,155p'` | TODO |
| H3.S1.M2 | Escribir la factory del nivel **correcto** en TypeScript | Filas visibles, columnas con `header` legible | captura del catálogo con la tabla poblada | TODO |
| H3.S1.M3 | Escribir el nivel **límite**: 0 filas, 1 fila, texto largo, columna `sticky` | Los cuatro se pueden elegir en la ficha | cuatro capturas en `evidencia/h3/` | TODO |
| H3.S1.M4 | Escribir el nivel **inválido**: `trackBy` que repite identidad | La ficha muestra el error y conserva el último escenario válido | captura del error, y la tabla anterior intacta detrás | TODO |
| H3.S1.M5 | Conectar los outputs a la ficha | Ordenar emite `sortChanged` visible | captura con el evento registrado | TODO |

#### H3.S2 — La factory y el host de `ContentDialog`

**CA:** Dado un diálogo, cuando el catálogo lo monta, entonces hay título, contenido y acciones
reales, y el foco entra adentro.
**DoD:** apertura, cierre por `Escape` y restauración del foco, comprobados con teclado y descritos.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H3.S2.M1 | Leer el contrato de `content-dialog` **sin modificarlo** | Están anotados inputs, outputs y slots | `git show origin/mockup:src/app/shared/components/organisms/content-dialog/content-dialog.ts \| grep -n 'input\|output\|ng-content'` | TODO |
| H3.S2.M2 | Escribir un **host tipado** que proyecte contenido y acciones | El diálogo abre con contenido, no vacío | captura del diálogo abierto | TODO |
| H3.S2.M3 | Comprobar foco inicial, `Escape` y restauración | Los tres pasan con teclado | descripción por paso + captura del foco visible | TODO |
| H3.S2.M4 | Registrar en la ficha si el descarte pide confirmación o no | Está escrito qué hace hoy | una línea en la ficha, citando el archivo | TODO |

#### H3.S3 — El fallback del faker deja de mentir

**CA:** Dado un input que la heurística no sabe llenar, cuando el catálogo monta el componente,
entonces el escenario queda marcado **no verificado** y se dice qué input faltó.
**DoD:** un componente con input complejo mostrando el aviso, con captura.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H3.S3.M1 | Localizar los fallbacks a `[]` y `''` | Hay líneas citadas | `git show origin/mockup:src/app/core/mock/faker/props.ts \| sed -n '135,160p'` | TODO |
| H3.S3.M2 | Distinguir «no sé llenarlo» de «lo llené» | La función devuelve un resultado que lo distingue | test unitario del faker en verde, salida pegada | TODO |
| H3.S3.M3 | Mostrar el aviso en la ficha del componente | El aviso se ve y nombra el input | captura | TODO |
| H3.S3.M4 | No romper los escenarios que hoy sí funcionan | El conteo de montajes válidos no baja | comparación contra el baseline de H1.S3.M3 | TODO |

### H4 — Aislamiento del preview: demostrarlo o declarar el límite

**Prioridad:** `MEDIA`

**CA:** Dado el preview, cuando alguien pregunta si comparte inyector, sesión, almacenamiento o
estilos con el anfitrión, entonces hay una respuesta con evidencia por cada uno de los cuatro — y si
la respuesta es «lo comparte», está escrito el riesgo y qué lo destrabaría.
**DoD:** tabla de cuatro filas con veredicto y evidencia; y si se implementó el inyector propio, la
demostración de que el componente sigue montando.
**Estado:** TODO

#### H4.S1 — Medir qué comparte hoy

**CA:** Dado el código actual, cuando medís, entonces cada afirmación sale de una observación en
runtime, no de leer el comentario de la línea 325.
**DoD:** cuatro observaciones pegadas.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H4.S1.M1 | Comprobar si el componente montado ve los servicios del anfitrión | Hay un sí o un no observado | observación en el navegador, pegada | TODO |
| H4.S1.M2 | Comprobar si comparte `localStorage`/cookies | Hay un sí o un no observado | idem | TODO |
| H4.S1.M3 | Comprobar si una petición de negocio inesperada puede salir | Hay un sí o un no observado | lista de peticiones del navegador durante un montaje | TODO |
| H4.S1.M4 | Comprobar si una cuenta sintética del preview cambia la sesión del anfitrión | Hay un sí o un no observado | idem, con captura antes y después | TODO |

#### H4.S2 — Decidir y registrar

**CA:** Dada la medición, cuando se decide, entonces la decisión queda escrita donde alguien la
encuentre, con su alternativa descartada.
**DoD:** una ADR o sección equivalente **reusando la carpeta que ya existe**, no una nueva.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H4.S2.M1 | Localizar dónde van las decisiones en este repo | Hay ruta real | `ls docs/adr` y `ls docs/refactor-profesional/trabajo/DECISIONES.md` | TODO |
| H4.S2.M2 | Escribir la decisión con su alternativa descartada | Se lee sin haber visto la sesión | el archivo, revisado contra `technical-docs-and-adr` | TODO |
| H4.S2.M3 | Si se implementa inyector propio, demostrar que todo sigue montando | El conteo de montajes válidos no baja | comparación contra H1.S3.M3 | TODO |
| H4.S2.M4 | Bloquear peticiones de negocio inesperadas desde el preview | Una petición de negocio no sale | lista de peticiones durante un montaje, pegada | TODO |

### H5 — Ciclo de vida y acreditación honesta

**Prioridad:** `MEDIA`

**CA:** Dado un componente A con carga demorada, cuando cambiás a B y volvés a A, entonces sólo queda
montado A, sin listeners ni timers de las monturas anteriores; y dado el catálogo, cuando mirás una
ficha, entonces el estado de acreditación distingue seis dimensiones y no un tilde verde.
**DoD:** A→B→A demostrado con el DOM y con la consola limpia; y las seis dimensiones visibles.
**Estado:** TODO

#### H5.S1 — Una sola ejecución vigente

**CA:** Dado un montaje demorado, cuando ya elegiste otro componente, entonces el demorado no
reemplaza al actual.
**DoD:** la prueba A→B→A con demora, descrita y capturada.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H5.S1.M1 | Reproducir el problema o demostrar que no existe | Hay un veredicto observado | secuencia A→B→A con demora, capturas antes/después | TODO |
| H5.S1.M2 | Garantizar limpieza también cuando el montaje **falla** | Tras un montaje fallido no queda nada montado | captura del DOM tras forzar un escenario inválido | TODO |
| H5.S1.M3 | Limpiar listeners, observers y timers del preview | La consola no acumula avisos tras 10 cambios | captura de la consola tras 10 cambios | TODO |

#### H5.S2 — Seis dimensiones, no un tilde

**CA:** Dada una ficha, cuando la leés, entonces sabés si el componente fue descubierto, si tiene
escenario, si montó, si se interactuó, si se verificó visualmente, o si está bloqueado.
**DoD:** las seis se ven en la interfaz y su fuente es el índice, no un valor escrito a mano.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H5.S2.M1 | Representar las seis dimensiones en el tipo del índice | El tipo las declara | `typecheck` en verde, salida pegada | TODO |
| H5.S2.M2 | Mostrarlas en la ficha sin depender sólo del color | Se distinguen en escala de grises | captura en escala de grises (regla 95.4.6) | TODO |
| H5.S2.M3 | Contar el estado real del catálogo por dimensión | Hay seis números con denominador | la línea de resumen del generador, pegada | TODO |

### H6 — Regresión, gates y cierre

**Prioridad:** `ALTA`

**CA:** Dado el cierre, cuando alguien que no vio tu turno lee tu reporte, entonces sabe qué quedó
demostrado, qué quedó a medias con las cuatro respuestas, y qué no se cubrió.
**DoD:** las cinco salidas del baseline repetidas y comparadas, capturas miradas, §19 respondido y
`REPORTE.md` con sus tres secciones.
**Estado:** TODO

#### H6.S1 — Regresión y gates

**CA:** Dado tu cambio, cuando corrés los mismos cinco comandos del baseline, entonces ningún rojo es
nuevo; y si hay uno nuevo, está clasificado antes de cerrar.
**DoD:** las cinco salidas comparadas contra `evidencia/antes/`.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H6.S1.M1 | Repetir `lint` y `typecheck` y comparar | Sin rojos nuevos | `yarn lint && yarn typecheck`, diff contra el baseline | TODO |
| H6.S1.M2 | Repetir `test` y comparar | Sin rojos nuevos | `yarn test --watch=false`, diff contra el baseline | TODO |
| H6.S1.M3 | Repetir `stock:generate` dos veces | Diff vacío entre corridas | `yarn stock:generate` ×2 + `diff` | TODO |
| H6.S1.M4 | Correr `audit:vistas` y comparar | Sin rojos nuevos | `yarn audit:vistas`, diff contra el baseline | TODO |
| H6.S1.M5 | Confirmar que el arranque del producto no se rompió | La maqueta levanta y se navega a dos rutas | `yarn start` + dos capturas | TODO |

#### H6.S2 — Prueba visual y revisión adversarial

**CA:** Dada una captura, cuando la incluís como evidencia, entonces la mirastes y podés decir qué se
ve; y dada la lista del §19, cuando la respondés, entonces cada respuesta tiene evidencia.
**DoD:** capturas por viewport y tema con una línea cada una, y las 20 preguntas respondidas.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H6.S2.M1 | Capturas del catálogo en móvil, tablet y escritorio | Tres capturas con su línea | `evidencia/h6/` con las tres descritas | TODO |
| H6.S2.M2 | Capturas en tema claro y oscuro | Dos capturas con su línea | idem | TODO |
| H6.S2.M3 | Responder las 20 preguntas del §19 con evidencia | Ninguna respuesta queda sin cita | sección en `REPORTE.md` | TODO |
| H6.S2.M4 | Escribir `REPORTE.md` con el avance en la primera línea | La primera línea es `> **AVANCE: x / 61 — y %.**` | `head -3 REPORTE.md` | TODO |

## 5. Ambigüedades registradas

**No las resuelvas por conveniencia.** Se registran, se trabaja con el supuesto declarado, y se
elevan (regla 00 §1.7).

| ID | Ambigüedad | Supuesto con el que trabajás | Quién puede resolverla | Qué bloquea |
|---|---|---|---|---|
| Q-B | ¿Los artefactos del §17 reusan `docs/refactor-profesional/trabajo/` o nacen en carpeta nueva? | **Reusar**: el propio §17 lo exige | Pablo | H4.S2, H6 |
| Q-E1 | ¿El nivel atómico se declara en el componente o en un mapa aparte? | En el componente, porque vive al lado de lo que describe | Pablo + los cuatro dueños de organismos | H2.S3 |
| Q-E2 | ¿Se acepta una dependencia nueva para analizar plantillas, o se resuelve con lo instalado? | Con lo instalado; una dependencia nueva exige decisión registrada (§2.2) | Pablo | H2.S2 |
| Q-E3 | ¿El preview debe quedar aislado esta noche, o alcanza declarar el límite? | Alcanza declararlo **con evidencia**; el aislamiento completo puede ser oleada 2 | Pablo | H4 |
| Q-E4 | `fact-section` tiene 0 consumidores: ¿es pieza nueva o código muerto? | Ninguno de los dos hasta medirlo; **no se borra** | Marcelo (es su organismo) | H2 |

## 6. Definition of Done del hito

Un hito sólo pasa a `HECHO` con **todas** sus casillas, no con la mayoría.

- [ ] Todas sus microtareas en `HECHO`, o en `A MEDIAS`/`BLOQUEADO`/`DESCARTADO` **con las cuatro
      respuestas** (qué anda, qué no anda, qué falta exactamente, dónde quedó).
- [ ] La salida literal del comando de cada DoD está en `evidencia/`, no parafraseada.
- [ ] `yarn lint`, `yarn typecheck` y `yarn test --watch=false` sin rojos **nuevos** respecto del
      baseline de H1.S2, con el diff pegado.
- [ ] `yarn stock:generate` corrido dos veces con diff vacío, y `yarn start` levantando.
- [ ] Si el hito tocó algo visible: capturas por viewport y por tema, **miradas**, con una línea cada una.
- [ ] Peldaño de evidencia declarado por área (regla 30), y ninguna palabra más fuerte que él.
- [ ] Sin datos de personas en logs, capturas, plan ni reporte (regla 90.2).
- [ ] El `PLAN.md` está actualizado **en el momento**, no al final.

## 7. Cómo cerrás el turno

1. **Checkpoint** en cada apertura y cierre de microtarea (regla 50). Prohibido encadenar más de tres
   operaciones materiales sin uno.
2. **`REPORTE.md`** al lado de tu `PLAN.md`, con el avance calculado en la **primera línea**:
   `> **AVANCE: <HECHO> / 61 — <%>.**` El número sale de `microtareas HECHO / total`. `A MEDIAS`
   cuenta como **no hecha**.
3. **Las tres secciones obligatorias existen siempre**: `Completado`, `A medias`, `Pendiente`. Una
   vacía se escribe con «ninguna»; borrarla está prohibido.
4. **Lo que pediste y no llegó** (un export en un barrel ajeno, una decisión de Pablo) va como
   `BLOQUEADO` **sólo si además simulaste los tres niveles de su contrato** (regla 65). Si el contrato
   se puede nombrar, el bloqueo es de coordinación y la microtarea se cierra contra el doble,
   declarando que se cerró contra un doble.
5. **Enumerá qué quedó corriendo** (servidores, watchers) y cerralo. Si no queda nada, decilo: el
   silencio no es evidencia de limpieza (regla 70.2.3).
6. **Tu daily** es `Ender-Daily-Noche-2026-09-21.md`, en la carpeta de arriba.

## 8. Revisión adversarial antes de cerrar

Del §19 del documento maestro, las que más aplican a tu carril. **Respondé con evidencia, no con
intención**; cualquier respuesta que deje un escape, se corrige antes de cerrar.

1. ¿El índice sigue afirmando composición a partir de imports en algún camino que no revisaste?
2. ¿La ficha de la tabla está vacía para no tener que probar columnas ni `trackBy`? (§19.9)
3. ¿La demo recrea el componente en vez de importar la fuente canónica? (§19.10)
4. ¿El iframe comparte sesión o servicios del padre de manera inadvertida? (§19.15)
5. ¿Un mock exitoso se está presentando como integración terminada? (§19.16)
6. ¿Se declara verificado algo que sólo fue inspeccionado estáticamente? (§19.18)
7. ¿El informe esconde pendientes reduciendo el alcance o el denominador? (§19.19)
8. ¿Rompiste el arranque de los otros cuatro y todavía no lo sabés porque no corriste `yarn start`?
