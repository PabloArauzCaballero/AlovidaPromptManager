# La página de directorio, la cabecera y la búsqueda: 39 pantallas que copian el CSS y no usan el componente

> **Rol:** propietario de las familias «página de directorio», «cabecera» y «búsqueda» · **Línea:** B · **Fecha:** 2026-09-21 · **Turno:** noche
> **Fuente del pedido:** [`REFACTOR-FRONTEND-2026-09-21.md`](../../../../../docs/requisitos/REFACTOR-FRONTEND-2026-09-21.md) — secciones **7, 8, 9, 11, 12.1 y 14**
> **Verificación contra el código:** [`VERIFICACION-CONTRA-CODIGO-2026-09-21.md`](../../../../../docs/verificacion/VERIFICACION-CONTRA-CODIGO-2026-09-21.md) — secciones **3, 4, 8, 8.1 y 8.1.bis**
> **6 hitos · 16 subtareas · 68 microtareas**, todas con criterio de aceptación y Definition of Done.
>
> **Dependés de una decisión de Pablo (Q-A) que él toma en su H1.** Mientras no esté, tu H1 y tu H2
> avanzan igual: son inventario, comparación de familias y contrato. **No te bloquees esperándola**
> (regla 65): si a la hora de migrar todavía no está, trabajás contra el supuesto declarado y lo decís.

## 0. Ficha de asignación

| Campo | Valor |
|---|---|
| `REPO` | `alovida/mantra-core-health` (frontend Angular). **Nada de backend en este lote** |
| `TARGET_REF` | `origin/mockup` — corte leído **`5a0776c66b005ad4d2d6722321e933cd7adea621`** (2026-09-21T17:35-04). **Reconsultalo y fijá el tuyo** en tu `PLAN.md` |
| `RAMA DE TRABAJO` | Una tuya, saliendo de `origin/mockup`. **Nada directo sobre `mockup`, nada sin PR** |
| `ARCHIVOS RESERVADOS PARA VOS` | `src/app/shared/components/organisms/directory-page/**` · `organisms/page-header/**` · `src/app/shared/components/molecules/search-field/**` · `molecules/pagination/**` · `src/app/features/alovida/{terminologia,datos-compartidos,buscar,directorio,inicio}/**` |
| `ARCHIVOS DE OTROS — NO LOS TOQUES` | `organisms/{data-table,view-state-host,filter-bar}/**` y `features/alovida/{accesos,personas}/**` (Pablo) · `scripts/**`, `features/component-stock/**`, `core/mock/faker/**` y **los tres barrels** `shared/components/*/index.ts` (Ender) · `organisms/{paginated-form,form-section,form-actions}/**`, `molecules/form-field/**`, `features/auth/register-*/**`, `features/account/my-profile/**` (Itzan) · `organisms/{content-dialog,attachment-dialog,attachment-uploader,fact-section}/**` y `features/clinical-record/**` (Marcelo) |
| `OJO CON UN ARCHIVO EN PARTICULAR` | `features/alovida/alovida.routes.ts` (43 KB) es **compartido** con Pablo. Si tenés que tocarlo, avisá en el daily **antes**; nunca lo reformatees ni lo reordenes (regla 70.9) |
| `LA MAQUETA NO TIENE BACKEND` | `mockBackend: true` fijo en `src/environments/environment.ts`. Ninguna petición sale a la red: las contesta `src/app/core/mock/mock-backend.interceptor.ts` desde `core/mock/handlers/` y `core/mock/fixtures/`. **Lo que te falte ahí se lo pedís a Ender** — `core/mock/**` no es tuyo |
| `CUENTA DE PRUEBA` | `superadmin@alovida.mock` y `admin@alovida.mock` (cualquier contraseña no vacía). **Sintéticas declaradas**: se pueden pegar |
| `DÓNDE SE PRUEBA` | Tus pantallas cuelgan de los segmentos `terminologia`, `datos-compartidos`, `buscar`, `directorio` e `inicio`. **Sacá las URLs de `alovida.routes.ts`, no las supongas** |
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

Son **25**: 11 del proceso y 14 propias de tus familias.

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
| `atomic-design-components` | **la más importante de tu lote**: por qué copiar la clase CSS no es reusar el componente |
| `frontend-navigation-ia` | cabecera, migas, pestañas y qué significa un enlace muerto |
| `search-and-filtering` | búsqueda normalizada, filtros activos, restablecer y orden determinista |
| `smart-dumb-components` | quién trae los resultados y quién los pinta |
| `frontend-ux-states` | los cuatro estados mínimos; el vacío tiene que orientar, no ser mudo |
| `css-architecture` | estructura, semántica visual, decoración y contexto: las cuatro capas del §11 |
| `frontend-design-system` | tokens en vez de literales, y variantes con significado |
| `frontend-accessibility` | nombre accesible, foco visible, y que nada dependa sólo del color |
| `frontend-responsive-layout` | qué pasa con una cabecera de cuatro acciones en 390 px |
| `refactoring-safely` | migrar un consumidor sin cambiar comportamiento |
| `dead-code-duplication` | medir consumidores antes de retirar el marcado replicado |
| `unit-testing` | un comportamiento por test, y no testear la implementación |
| `visual-proof` | la captura no vale si no la mirás |
| `e2e-playwright` | locators por rol y texto, cero `waitForTimeout` |

Entrá siempre por `skills-router`: **no leas el catálogo entero, no sirve.**

### 1.4 DoD de esta sección — se verifica como cualquier otra

- [ ] `ls .claude/skills | wc -l` devolvió **176**, y la salida está pegada en tu daily.
- [ ] `python .claude/hooks/plan_gate.py --self-test` devolvió **11 PASS, 0 FAIL**, salida pegada.
- [ ] Leíste `skills-router` y las 25 skills de las dos tablas, **empezando por `atomic-design-components`**.
- [ ] Creaste tu `PLAN.md` **antes** del primer `Edit`/`Write` de código.

**Sin estas cuatro casillas, tu lote arranca en `BLOQUEADO`, no en `EN CURSO`.**

> ### ✅ Hechos ya verificados contra el corte — no los repitas, pero tampoco los creas sin abrir el archivo
>
> #### Tus organismos ya existen, y `page-header` es el más adoptado del repo
>
> | Pieza | Selector real | Consumidores que la **instancian** |
> |---|---|---|
> | `organisms/page-header` | `app-page-header` (**elemento**) | **171** plantillas |
> | `organisms/directory-page` | `app-directory-page` (**elemento**) | **5** |
> | `molecules/search-field` | `app-search-field` (**elemento**) | — (medilo vos) |
> | `molecules/pagination` | `app-pagination` (**elemento**) | — (medilo vos) |
>
> Comando: `git grep -l '<app-page-header' origin/mockup -- 'src/app/**/*.html' | wc -l`
>
> #### 🚩 El hecho central de tu carril, y es contraintuitivo
>
> En tus 39 pantallas el marcado dice cosas como:
>
> ```html
> <div class="app-page-header" app-page-header="">
> <section class="app-filter-bar" app-filter-bar="">
> <label class="app-search-field" app-search-field="">
> <input class="app-input" app-input="" type="search">
> <a app-button="" data-variante="primario" routerLink="...">
> ```
>
> **Ninguno de esos atributos instancia nada.** Está verificado selector por selector en la §8.1.bis de
> la verificación: `page-header`, `filter-bar`, `search-field` y `input` tienen selector de **elemento**,
> así que un `<div app-page-header="">` no los activa; y `button[app-button]` sólo matchea un
> `<button>`, no una `<a>`. El atributo es un **marcador decorativo** que dejó el generador.
>
> Consecuencia doble:
>
> 1. **En esas pantallas no corre nada del sistema de diseño**: ni foco gestionado, ni estados, ni
>    accesibilidad del componente, ni su responsive. Sólo hay CSS que se parece.
> 2. **Cualquier medición de adopción hecha con `grep app-page-header` cuenta 39 falsos positivos
>    tuyos.** Contá siempre con el `<` pegado: `grep '<app-page-header'`.
>
> #### Cuántas son, y dónde
>
> De las 81 plantillas de `features/**` con `<table>` crudo, **70 están en `features/alovida/`**, y de
> ésas **39 son tuyas**:
>
> | Submódulo | Plantillas con `<table>` crudo |
> |---|---|
> | `datos-compartidos/` | 13 |
> | `terminologia/` | 12 |
> | `buscar/` | 7 |
> | `directorio/` | 6 |
> | `inicio/` | 1 |
>
> De los **161** `.ts` de `features/alovida/`, sólo **22** importan algo de `shared/components`.
>
> #### Y además tenés dos diálogos escritos a mano
>
> En todo el repo hay **9** plantillas de `features/**` con `<dialog` o `role="dialog"` escrito a mano.
> **Dos son tuyas**:
>
> | Archivo | |
> |---|---|
> | `alovida/buscar/hospitales-listado/facility-directions-dialog/facility-directions-dialog.html` | tuyo |
> | `alovida/buscar/medicamentos-listado/pharmacy-availability-dialog/pharmacy-availability-dialog.html` | tuyo |
>
> El organismo canónico es `organisms/content-dialog` (**26 consumidores**), y **es de Marcelo**. Su
> contrato lo escribe él en su H2 y te lo pasa por el daily: trae `heading` obligatorio, `dismissible`,
> y sobre todo **`dismissAttempt`**, que es la «solicitud de descarte» del §9 — el diálogo pide
> cerrarse y el consumidor decide. **Vos migrás tus dos; no edites `content-dialog/**`.** Si el
> contrato todavía no llegó cuando te toque, simulalo en tres niveles y declaralo (regla 65).
>
> #### El componente de esas pantallas es una cáscara vacía
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
> #### Y las genera un script que las vuelve a pisar
>
> `scripts/port-vistas-alovida.mjs`, encabezado: **«ARCHIVO GENERADOR. Lo que produce se puede editar a
> mano; si se vuelve a correr, lo pisa.»** Sin mecanismo de exclusión. Sus rutas son absolutas de la
> máquina de Pablo (líneas 30-32). **Es la ambigüedad Q-A y la decide Pablo en su H1.S3.** No la
> resuelvas vos (regla 00 §1.7), y no empieces a migrar sin haberla leído.
>
> ⚠️ **Lo que la verificación NO hizo: ejecutar.** No se levantó la maqueta, no se corrió un test, y
> **no se abrió el cuerpo** de ninguna de tus 39 plantillas más allá del ejemplo citado. Que cuatro
> submódulos tengan `<table>` no prueba que sean la misma familia: eso es lo que H2 te pide demostrar.

## 2. Resultado observable

| Hito | Prioridad | Qué queda demostrado |
|---|---|---|
| **H1** | `BLOQUEANTE` | Corte declarado, baseline de los comandos con rojos previos registrados, las rutas reales de tus cinco submódulos sacadas del router, y capturas **antes** de dos pantallas por submódulo. |
| **H2** | `ALTA` | Está demostrado, comparando las cinco dimensiones del §7.1, cuáles de tus 39 pantallas comparten la anatomía «cabecera + pestañas + filtros + resultados + paginación» y cuáles no — con **contraejemplo** declarado. Y `directory-page`, que hoy tiene 5 consumidores, tiene su contrato escrito. |
| **H3** | `ALTA` | **Dos** pantallas reales de submódulos distintos instancian `<app-page-header>`, `<app-search-field>` y la composición canónica de verdad, conservando su apariencia; y los estados de la vista los resuelve el contrato, no una cadena de booleanos. |
| **H4** | `MEDIA` | La oleada avanza sobre el resto con avance medido (`migradas / 39`) y las no migradas tienen estado, no silencio. |
| **H5** | `MEDIA` | El marcado replicado que quedó sin uso está retirado, o está declarado por qué no, con la medición de consumidores pegada. Y la trampa de medición (`grep` sin `<`) queda documentada para que nadie la repita. |
| **H6** | `ALTA` | Regresión y gates corridos, capturas por viewport y tema miradas, §19 respondido con evidencia, y `REPORTE.md` escrito. |

> ⚠️ **Esto es más de lo que entra en una noche, y está dicho a propósito.** 39 pantallas no se migran
> en un turno. Lo que no se cierra queda `A MEDIAS` con qué anda, qué no anda y qué falta exactamente.
> **Dos consumidores migrados y demostrados valen más que treinta y nueve a medias.**

**Kill-test del turno completo:** abrí una pantalla de `terminologia` y buscá `<app-page-header` en el
DOM renderizado. Si lo que hay es un `<div class="app-page-header">`, la adopción no ocurrió. Después
probá la búsqueda: si escribir en el campo no cambia nada porque no hay componente detrás, `search-field`
no está adoptado y H3 no está hecho.

## 3. Alcance

**IN:** baseline de `lint`, `typecheck`, `test` y `audit:vistas` con rojos previos registrados · rutas
reales de los cinco submódulos sacadas del router · capturas previas de dos pantallas por submódulo ·
ficha de familia del §7.3 para «página de directorio», con miembros, invariantes, diferencias visuales,
diferencias de dominio, pieza canónica, alternativas descartadas y **contraejemplo** · contrato escrito
de `directory-page` y de `page-header` según la tabla del §10 · adopción real en al menos dos pantallas
de submódulos distintos · oleada sobre el resto con avance medido · retirada del marcado replicado sin
uso, con medición previa · la trampa de medición documentada · specs dirigidos al cambio · capturas por
viewport y tema · `PLAN.md`, `REPORTE.md` y `evidencia/`.

**OUT:** **cualquier archivo fuera de los cinco reservados de la ficha** · `features/alovida/{accesos,personas}/**`, `organisms/data-table/**`, `view-state-host/**` y `filter-bar/**` — **son de Pablo**: la tabla canónica la usás, no la editás; lo que le falte se lo pedís por el daily · `scripts/port-vistas-alovida.mjs` — **la decisión Q-A no es tuya** · los tres barrels de `shared/components` — son de Ender · `core/mock/**` · **cambiar `ViewState<T>`**: 69 consumidores y 10 estados con su razón documentada · **romper la compatibilidad de `page-header`** con sus 171 consumidores: cualquier cambio ahí es de alto impacto y exige probar una muestra real, no sólo tus pantallas · quitar `aria-disabled`/`data-sin-destino` de los enlaces muertos sin entender qué los mueve (`AlovidaRuntimeService.controlesDeMaqueta()`) · introducir una librería de UI nueva (regla 95.1.4) · escribir literales de color, espaciado o tipografía en vez de tokens (regla 95.1.5) · inventar datos de catálogo o de terminología para poblar una pantalla: **la terminología es catálogo cerrado y necesita procedencia** (regla 97.4, y `terminology-value-sets`) · debilitar un spec para que pase · declarar `HECHO` una microtarea cuyo DoD no corriste.

## 4. Plan — hitos, subtareas y microtareas

Los seis estados permitidos son exactamente: `TODO`, `EN CURSO`, `HECHO`, `A MEDIAS`, `BLOQUEADO` y
`DESCARTADO`. **`A MEDIAS` es legítimo; disfrazarlo de `HECHO` no.**

### H1 — Corte, baseline, rutas reales y capturas previas

**Prioridad:** `BLOQUEANTE`

**CA:** Dado tu entorno, cuando alguien pregunta contra qué versión trabajaste, en qué URL vive cada
pantalla y cómo se veía antes, entonces hay SHA, lista de rutas verificadas y capturas.
**DoD:** las salidas del baseline en `evidencia/antes/`, la lista de rutas y diez capturas descritas.
**Estado:** TODO

#### H1.S1 — Corte y baseline

**CA:** Dado un rojo posterior, cuando alguien pregunta si lo rompiste vos, entonces la respuesta sale
de un archivo.
**DoD:** salidas con su código de salida, pegadas.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H1.S1.M1 | Fijar corte y rama | Hay SHA y rama en `PLAN.md` | `git rev-parse origin/mockup && git branch --show-current` | TODO |
| H1.S1.M2 | Baseline de `lint` y `typecheck` | Hay salida y exit code | `yarn lint; yarn typecheck; echo "exit=$?"` → `evidencia/antes/` | TODO |
| H1.S1.M3 | Baseline de `test` | Hay conteo de fallos previos | `yarn test --watch=false` → `evidencia/antes/test.txt` | TODO |
| H1.S1.M4 | Baseline de `audit:vistas` | Hay salida | `yarn audit:vistas` → `evidencia/antes/audit-vistas.txt` | TODO |
| H1.S1.M5 | Clasificar cada rojo previo | Cada uno con su clase de la regla 80.4 | tabla en `PLAN.md` | TODO |

#### H1.S2 — Las rutas y el inventario de tus 39

**CA:** Dada una pantalla tuya, cuando la abrís, entonces la URL salió del router y no de una
suposición; y el conteo de tus pantallas coincide con el del reparto.
**DoD:** lista de rutas verificadas + conteo 13+12+7+6+1 = 39.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H1.S2.M1 | Sacar las rutas de tus cinco submódulos del router | Hay lista de URLs | `git show origin/mockup:src/app/features/alovida/alovida.routes.ts \| grep -n 'terminologia\|datos-compartidos\|buscar\|directorio' \| head -60` | TODO |
| H1.S2.M2 | Confirmar el conteo de plantillas con tabla cruda | Da 39 | `git grep -l '<table' origin/mockup -- 'src/app/features/alovida/{terminologia,datos-compartidos,buscar,directorio,inicio}/**/*.html' \| wc -l` → 39 | TODO |
| H1.S2.M3 | Medir la adopción real de tus organismos **con el `<`** | Hay dos números distintos: con `<` y sin `<` | `git grep -c '<app-page-header' ...` y `git grep -c 'app-page-header' ...`, los dos pegados | TODO |
| H1.S2.M4 | Registrar la trampa de medición en tu `PLAN.md` | Está escrita con los dos números | una sección de dos líneas | TODO |

#### H1.S3 — Capturas de antes

**CA:** Dada una pantalla que vas a tocar, cuando alguien pregunte cómo se veía, entonces hay captura
previa en dos viewports.
**DoD:** diez capturas (dos por submódulo) con una línea cada una.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H1.S3.M1 | Capturar dos de `terminologia` y dos de `datos-compartidos` | Cuatro capturas, miradas | `evidencia/antes/capturas/` con su línea | TODO |
| H1.S3.M2 | Capturar dos de `buscar` y dos de `directorio` | Cuatro capturas, miradas | idem | TODO |
| H1.S3.M3 | Capturar `inicio` en escritorio y móvil | Dos capturas | idem | TODO |
| H1.S3.M4 | Revisar consola y red en esas pantallas **antes** de tocar | Hay lista de errores previos | lista (vacía o con los errores previos) en `evidencia/antes/` | TODO |

### H2 — Demostrar la familia y escribir el contrato

**Prioridad:** `ALTA`

**CA:** Dado el conjunto de tus 39 pantallas, cuando afirmás que comparten la anatomía de un
directorio, entonces lo respaldás comparando las cinco dimensiones del §7.1 sobre una muestra real, y
declarás un contraejemplo. Y dado `directory-page`, cuando otro lo va a usar, entonces tiene contrato
escrito y no necesita leer la implementación.
**DoD:** ficha de familia del §7.3 completa + contrato del §10 para `directory-page` y `page-header`.
**Estado:** TODO

#### H2.S1 — Comparar las cinco dimensiones

**CA:** Dada una muestra de al menos ocho pantallas (dos por submódulo grande), cuando comparás,
entonces hay veredicto por dimensión y por pantalla.
**DoD:** tabla de 8 × 5 en `PLAN.md`, con ruta por fila.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H2.S1.M1 | Elegir y anotar la muestra de ocho | Ocho rutas anotadas | lista en `PLAN.md` | TODO |
| H2.S1.M2 | Comparar propósito y anatomía (regiones, orden, semántica DOM) | Ocho veredictos | tabla | TODO |
| H2.S1.M3 | Comparar contrato (qué datos, qué acciones, qué estados) | Ocho veredictos | tabla | TODO |
| H2.S1.M4 | Comparar comportamiento observado en la maqueta, no leído | Ocho veredictos | tabla + capturas de apoyo | TODO |
| H2.S1.M5 | Clasificar el CSS en estructura / semántica visual / decoración / contexto (§11) | Cada regla relevante tiene su clase | tabla de cuatro columnas | TODO |

#### H2.S2 — La ficha de decisión

**CA:** Dada la ficha, cuando alguien la lee sin haber visto la sesión, entonces sabe qué se comparte,
qué se conserva distinto y qué NO entra.
**DoD:** los once campos del §7.3, incluido el contraejemplo.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H2.S2.M1 | Escribir la ficha de la familia «página de directorio» | Tiene los once campos | el archivo, revisado contra §7.3 | TODO |
| H2.S2.M2 | Declarar el contraejemplo | Hay una pantalla nombrada que no entra, con motivo | fila de la ficha con ruta | TODO |
| H2.S2.M3 | Registrar las excluidas con su motivo | incluidas + excluidas = 39 | conteo en la ficha | TODO |
| H2.S2.M4 | Decidir si `directory-page` se adopta o se extiende (§7.2) | Hay decisión con su evidencia | fila de la ficha | TODO |

#### H2.S3 — Los contratos escritos

**CA:** Dado `page-header` con 171 consumidores, cuando se documenta, entonces queda claro qué es
obligatorio, qué es opcional, qué cardinalidad admite y qué evento sale de cada región.
**DoD:** los contratos en el repo, cubriendo las diez áreas del §10 y la tabla del §8.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H2.S3.M1 | Leer el contrato real de `page-header` antes de escribirlo | Están anotados inputs, outputs y slots | `git show origin/mockup:src/app/shared/components/organisms/page-header/page-header.ts \| grep -n 'input\|output\|ng-content'` | TODO |
| H2.S3.M2 | Documentar partes obligatorias, opcionales, cardinalidad y orden (§8) | Las diez filas del §8 están respondidas | el archivo de contrato | TODO |
| H2.S3.M3 | Ídem para `directory-page` | idem | idem | TODO |
| H2.S3.M4 | Listar los 171 consumidores de `page-header` como superficie de riesgo | Hay lista y veredicto | `git grep -l '<app-page-header' origin/mockup -- 'src/app/**/*.html'` pegado | TODO |

### H3 — Primera adopción real: dos pantallas de submódulos distintos

**Prioridad:** `ALTA`

**CA:** Dada una pantalla migrada, cuando la abrís, entonces instancia los componentes canónicos de
verdad (se ven en el DOM como `<app-...>`), se ve equivalente a su captura previa, y sus estados los
resuelve el contrato de la vista y no una combinación de booleanos.
**DoD:** dos pantallas migradas, captura antes/después por viewport, spec dirigido en verde, consola y
red sin errores nuevos.
**Estado:** TODO

#### H3.S1 — La pantalla de `terminologia`

**CA:** Dada la pantalla elegida, cuando se migra, entonces el contenedor decide y el organismo pinta:
la plantilla no arma la cabecera a mano.
**DoD:** los cinco artefactos del hito, para esta pantalla.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H3.S1.M1 | Reemplazar la cabecera replicada por `<app-page-header>` | El DOM muestra `<app-page-header` | captura del DOM + captura visual comparada | TODO |
| H3.S1.M2 | Reemplazar el campo de búsqueda replicado por `<app-search-field>` | Idem, y escribir en él hace algo observable | captura + descripción del comportamiento | TODO |
| H3.S1.M3 | Resolver los cuatro estados con el contrato existente | Se pueden ver cargando, con datos, vacío y error | cuatro capturas | TODO |
| H3.S1.M4 | Conservar los enlaces muertos declarados tal como están | `data-sin-destino` sigue ahí | diff que lo muestre | TODO |
| H3.S1.M5 | Spec dirigido al cambio | Pasa, y falla si se rompe la composición | `yarn test --watch=false` acotado, salida pegada | TODO |

#### H3.S2 — La pantalla de `directorio` o `buscar`

**CA:** Idéntico criterio, sobre otro submódulo, para demostrar reutilización y no un caso único.
**DoD:** los mismos cinco artefactos.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H3.S2.M1 | Migrar la composición conservando su apariencia | Comparación visual sin regresión | captura antes/después en 390, 768 y 1440 | TODO |
| H3.S2.M2 | Usar la tabla canónica de Pablo tal como está | No editaste `data-table/**` | diff que lo demuestre | TODO |
| H3.S2.M3 | Conservar las diferencias legítimas entre las dos pantallas | Siguen viéndose distintas entre sí, como antes | dos capturas lado a lado | TODO |
| H3.S2.M4 | Acreditar la composición en el catálogo de Ender | Hay escenario con contrato válido | captura de la ficha | TODO |
| H3.S2.M5 | Comprobar teclado y foco en la cabecera y la búsqueda | Foco visible y orden razonable | descripción por paso + captura del foco | TODO |

#### H3.S3 — Extensión mínima, sólo si hace falta

**CA:** Dada una necesidad real que el contrato no cubra, cuando se extiende, entonces se usa el
mecanismo más pequeño del §8 y los 171 consumidores de `page-header` siguen sanos.
**DoD:** `typecheck` y `test` en verde, y una muestra de consumidores ajenos comprobada a mano.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H3.S3.M1 | Decidir si hace falta extender, y con qué mecanismo del §8 | Hay decisión escrita | línea en la ficha de familia | TODO |
| H3.S3.M2 | Si se extiende: sin bandera por pantalla, sin nombre de pantalla como variante | No hay input con nombre de pantalla | revisión del diff | TODO |
| H3.S3.M3 | Verificar que los consumidores ajenos no se rompieron | `typecheck` y `test` en verde | `yarn typecheck && yarn test --watch=false` | TODO |
| H3.S3.M4 | Comprobar a mano tres consumidores ajenos de `page-header` | Las tres pantallas se ven igual que antes | tres capturas comparadas | TODO |

### H4 — Oleada sobre el resto de las 39

**Prioridad:** `MEDIA`

**CA:** Dada la oleada, cuando alguien pregunta cuánto se migró, entonces hay un número con
denominador (`migradas / 39`), y las no migradas tienen estado.
**DoD:** la matriz de migración del §17 con 39 filas.
**Estado:** TODO

#### H4.S1 — La matriz

**CA:** Dada la matriz, cuando se lee, entonces cada pantalla tiene consumidor previo, destino, prueba
y estado.
**DoD:** 39 filas, ninguna vacía.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H4.S1.M1 | Crear la matriz con 39 filas en `TODO` | El conteo de filas es 39 | `grep -c '^|' matriz.md` | TODO |
| H4.S1.M2 | Priorizar con criterio escrito, no por facilidad | Hay criterio y orden | una línea de criterio + el orden | TODO |
| H4.S1.M3 | Migrar por lotes de a tres, cerrando cada lote | Cada lote con su captura y su spec | tres capturas y un `yarn test` por lote | TODO |
| H4.S1.M4 | Actualizar el avance en el momento | El número del plan coincide con la matriz | `migradas / 39` en `PLAN.md` | TODO |

#### H4.S2 — Que la oleada no pierda comportamiento

**CA:** Dada una pantalla de la oleada, cuando se compara con su captura previa, entonces no aparece
una diferencia visual no justificada ni un error nuevo.
**DoD:** por pantalla, captura comparada y consola revisada.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H4.S2.M1 | Consola y red por pantalla migrada | Cero errores nuevos | lista por pantalla | TODO |
| H4.S2.M2 | 390 px en cada pantalla migrada | La cabecera y los filtros siguen usables | captura móvil por pantalla | TODO |
| H4.S2.M3 | Tema oscuro por lote | Nada ilegible | captura oscura por lote | TODO |
| H4.S2.M4 | Que ningún texto informe sólo por color | Se distingue en escala de grises | una captura en escala de grises por lote | TODO |

#### H4.S3 — Tus dos diálogos escritos a mano

**CA:** Dado cada uno de tus dos diálogos, cuando se abre, entonces es `<app-content-dialog>` en el DOM,
el foco entra adentro y queda atrapado, `Escape` respeta la misma política que el botón de cerrar, y al
cerrar el foco vuelve al elemento que lo abrió.
**DoD:** los cuatro comportamientos probados con teclado por diálogo, con captura antes/después.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H4.S3.M1 | Recorrer los dos diálogos **antes** de tocarlos y anotar los tres caminos de cierre | Seis observaciones | descripción + capturas en `evidencia/antes/` | TODO |
| H4.S3.M2 | Migrar `facility-directions-dialog` al organismo canónico | El DOM muestra `<app-content-dialog` | captura del DOM + visual comparada | TODO |
| H4.S3.M3 | Migrar `pharmacy-availability-dialog` igual | idem | idem | TODO |
| H4.S3.M4 | Comprobar foco, `Escape` y restauración del foco en los dos | Ocho observaciones | descripción por paso + captura del foco | TODO |
| H4.S3.M5 | Si el contrato de Marcelo no llegó, simularlo en tres niveles y declararlo | Hay correcto, límite e inválido, y está dicho que se cerró contra un doble | tres corridas o capturas + línea en el reporte | TODO |

### H5 — Retirada, prevención y la trampa documentada

**Prioridad:** `MEDIA`

**CA:** Dado el marcado replicado de una pantalla migrada, cuando ya nadie lo usa, entonces se retira;
y cuando no se puede, está escrito por qué. Y dada la trampa de medición, cuando otro mida adopción,
entonces la encuentra documentada y no cuenta falsos positivos.
**DoD:** medición de consumidores antes de cada retirada + la trampa escrita donde se mide.
**Estado:** TODO

#### H5.S1 — Medir antes de borrar

**CA:** Dado algo que parece muerto, cuando lo borrás, entonces antes midiste usos estáticos,
dinámicos, por tipo y de rutas.
**DoD:** cuatro mediciones por candidato.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H5.S1.M1 | Medir usos estáticos del candidato | Hay conteo | `git grep -n '<selector-o-clase>' -- 'src/app/**'` | TODO |
| H5.S1.M2 | Medir usos dinámicos y de ruta | Hay conteo | `git grep -n 'loadComponent\|createComponent' -- 'src/app/features/alovida/**'` | TODO |
| H5.S1.M3 | Retirar sólo lo que dio cero | Nada se borró con uso vivo | diff + mediciones pegadas | TODO |
| H5.S1.M4 | Lo que no se puede retirar queda declarado | Hay motivo y quién lo destraba | sección en `REPORTE.md` | TODO |

#### H5.S2 — Prevención

**CA:** Dado el problema que encontraste, cuando alguien lo repita, entonces algo lo detecta antes del
merge; y si el gate no es tuyo, la propuesta está escrita y dirigida a su dueño.
**DoD:** propuesta escrita a Ender, o el gate probado con caso malo y caso bueno.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H5.S2.M1 | Documentar la trampa del `grep` sin `<` | Está escrita donde se mide adopción | el archivo + línea en el daily | TODO |
| H5.S2.M2 | Proponerle a Ender el chequeo de «clase del sistema sin su componente» | La propuesta está escrita, no implementada por vos | línea en el daily | TODO |
| H5.S2.M3 | Documentar tu patrón de migración para la oleada 2 | Se puede seguir sin preguntarte | el documento, citado en el daily | TODO |

### H6 — Regresión, gates y cierre

**Prioridad:** `ALTA`

**CA:** Dado el cierre, cuando alguien que no vio tu turno lee el reporte, entonces sabe qué quedó
demostrado, qué quedó a medias con las cuatro respuestas, y qué no se cubrió.
**DoD:** baseline repetido y comparado, capturas miradas, §19 respondido y `REPORTE.md` escrito.
**Estado:** TODO

#### H6.S1 — Regresión

**CA:** Dado tu cambio, cuando corrés los comandos del baseline, entonces ningún rojo es nuevo.
**DoD:** salidas comparadas contra `evidencia/antes/`.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H6.S1.M1 | `lint` y `typecheck` | Sin rojos nuevos | diff contra baseline | TODO |
| H6.S1.M2 | `test` completo | Sin rojos nuevos | diff contra baseline | TODO |
| H6.S1.M3 | `audit:vistas` | Sin rojos nuevos | diff contra baseline | TODO |
| H6.S1.M4 | Barrido de tus rutas con Playwright, `--workers=1` | Ninguna ruta rompe | salida pegada | TODO |

#### H6.S2 — Cierre honesto

**CA:** Dado el reporte, cuando se lee la primera línea, entonces está el avance calculado; y ninguna
palabra es más fuerte que la evidencia.
**DoD:** `REPORTE.md` con sus tres secciones y el avance arriba.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H6.S2.M1 | Capturas finales por viewport y tema | Cinco capturas con su línea | `evidencia/h6/` | TODO |
| H6.S2.M2 | Responder las 20 preguntas del §19 | Cada una con evidencia | sección en `REPORTE.md` | TODO |
| H6.S2.M3 | Declarar el peldaño por área (regla 30) | Hay peldaño por área | sección en `REPORTE.md` | TODO |
| H6.S2.M4 | Escribir `REPORTE.md` con el avance primero | `head -3` muestra el avance | `head -3 REPORTE.md` | TODO |

## 5. Ambigüedades registradas

| ID | Ambigüedad | Supuesto con el que trabajás | Quién puede resolverla | Qué bloquea |
|---|---|---|---|---|
| Q-A | ¿Qué pasa con lo migrado cuando `port-vistas-alovida.mjs` se vuelva a correr? | Hasta que Pablo decida: **piloto a mano y exclusión declarada**; se anota qué habría que rehacer | **Pablo**, en su H1.S3 | H3, H4, H5 |
| Q-J1 | ¿La terminología y los datos compartidos tienen fixtures suficientes en `core/mock/`? | No todos; se le piden a Ender y mientras se simula el contrato en tres niveles (regla 65) | Ender | H3, H4 |
| Q-J2 | ¿`directory-page` (5 consumidores) se adopta para estos listados o se conserva aparte? | Se **evalúa** en H2.S2.M4 con evidencia; no se asume ninguna de las dos | Pablo | H2, H3 |
| Q-J3 | ¿Los enlaces muertos (`data-sin-destino`) se conservan al migrar? | Se conservan: son maqueta declarada, no un bug | Producto | H3, H4 |
| Q-J4 | ¿Se puede tocar `alovida.routes.ts`, que es compartido con Pablo? | Sólo avisando antes en el daily, y sólo agregando | Pablo | H3, H4 |

## 6. Definition of Done del hito

- [ ] Todas sus microtareas en `HECHO`, o en `A MEDIAS`/`BLOQUEADO`/`DESCARTADO` **con las cuatro
      respuestas**.
- [ ] La salida literal del comando de cada DoD está en `evidencia/`, no parafraseada.
- [ ] `yarn lint`, `yarn typecheck` y `yarn test --watch=false` sin rojos **nuevos** respecto del
      baseline de H1.S1, con el diff pegado.
- [ ] Toda pantalla tocada tiene captura **antes y después** en 390, 768 y 1440, y en los dos temas.
      **Miradas**, con una línea cada una.
- [ ] Consola y red sin errores nuevos en cada pantalla tocada (regla 95.7.3).
- [ ] Si tocaste `page-header`: tres consumidores ajenos comprobados a mano, con captura.
- [ ] Ningún literal de color, espaciado o tipografía nuevo: sólo tokens (regla 95.1.5).
- [ ] Peldaño de evidencia declarado por área (regla 30).
- [ ] Sin datos de personas en logs, capturas, plan ni reporte (regla 90.2).
- [ ] El `PLAN.md` está actualizado en el momento, no al final.

## 7. Cómo cerrás el turno

1. **Checkpoint** en cada apertura y cierre de microtarea. Prohibido encadenar más de tres operaciones
   materiales sin uno.
2. **`REPORTE.md`** con el avance en la **primera línea**: `> **AVANCE: <HECHO> / 68 — <%>.**`
3. **Las tres secciones obligatorias existen siempre.** Una vacía se escribe con «ninguna».
4. **Lo que dependa de Pablo (Q-A) o de Ender (un fixture)** no cierra como `BLOQUEADO` sin haber
   simulado los tres niveles de su contrato (regla 65): correcto, límite e inválido. Si el contrato se
   puede nombrar, se cierra contra el doble y se declara así.
5. **Enumerá qué quedó corriendo** y cerralo.
6. **Tu daily** es `Justin-Daily-Noche-2026-09-21.md`, en la carpeta de arriba.

## 8. Revisión adversarial antes de cerrar

1. ¿Se podría aprobar este cambio moviendo archivos sin cambiar responsabilidades? (§19.1)
2. ¿La extracción borró una diferencia real de dominio porque dos pantallas se parecían? (§19.6)
3. ¿Una variación decorativa produjo otro organismo completo? (§19.7)
4. ¿El componente necesita saber qué pantalla lo usa para decidir su conducta? (§19.5)
5. ¿El producto todavía usa el duplicado mientras el catálogo muestra la pieza nueva? (§19.11)
6. ¿Se retiró código sin revisar consumidores dinámicos y rutas? (§19.17)
7. ¿Se declara verificado algo que sólo fue inspeccionado estáticamente? (§19.18)
8. ¿El informe esconde pendientes reduciendo el denominador de 39? (§19.19)
9. ¿Alguna medición de adopción tuya cuenta los atributos decorativos como si fueran uso real?
10. ¿La próxima corrida del generador borra lo que migraste, y lo sabés o lo supones?
