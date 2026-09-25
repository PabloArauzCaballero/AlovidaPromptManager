# La pantalla de la carga masiva: elegir qué se carga con su plantilla, arrastrar el Excel o CSV, validar sin guardar, ver la vista previa y los errores por fila, confirmar y ver el resumen

> **Rol:** dueño de `features/admin/terminology/version-import/**`, de la sección de import del cliente de terminología y del doble del simulador · **Fecha:** 2026-09-25 · **Turno:** noche · **Modo:** autónomo, sin nadie a quien preguntar
> **Contrato compartido:** [`CONTRATO-CARGA-MASIVA.md`](../../CONTRATO-CARGA-MASIVA.md) — §2 (HTTP: lo que **vos consumís**), §3 (`data-testid`: lo que **vos ponés** y Marcelo usa), §4 (fixtures), §5 (supuestos).
> **Daily de equipo:** [`Daily-Noche-2026-09-25.md`](../../Daily-Noche-2026-09-25.md)
> **6 hitos · 10 subtareas · 68 microtareas**, con CA, DoD y columna «Si se traba».
>
> **Tu carril no espera a Itzan.** La API real llega cuando llegue; vos escribís **hoy** contra §2 del contrato
> con el **doble del simulador** (`terminology.handlers.ts:244`, `mockBackend: true`) ensanchado en tres niveles.
> Todo se cierra `VERIFIED` **contra el doble, declarado**; si al final del turno la rama de Itzan está arriba,
> H6 lo recorre contra la API real y sube el peldaño. **La pantalla y el drag & drop ya existen**: tu trabajo es
> ensanchar, no crear.

## 0. Ficha de asignación

| Campo | Valor |
|---|---|
| `REPO` | `alovida/mantra-core-health` (Angular 21 standalone con señales · SSR · Vitest 4 · Yarn 4 PnP). **Nada de backend** |
| `TARGET_REF` | `origin/mockup`, en **worktree limpio**: el checkout actual está en `ender/simulador-cabecera-2026-09-22` **con cambios sin commitear de Ender — no lo toques**. SHA en tu `PLAN.md` |
| `RAMA` | `justin/carga-masiva-pantalla-2026-09-25` |
| `ARCHIVOS RESERVADOS PARA VOS` | `src/app/features/admin/terminology/version-import/**` · `src/app/core/data-access/terminology/terminology.client.ts` y `terminology.types.ts` (**sólo** la sección de import: `importarArchivo`, `descargarPlantilla`, sus tipos) · `src/app/core/mock/handlers/terminology.handlers.ts` (**sólo** los manejadores `import-file` e `import-template`) · `docs/trabajo/2026-09-25-justin-pantalla/**` |
| `ARCHIVOS DE OTROS — NO LOS TOQUES` | `shared/components/molecules/file-input/**` (**se usa tal cual**; si le falta algo, lo resolvés en tu pantalla y lo anotás) · `app.routes.ts`, `core/navigation/**` · `features/alovida/terminologia/**` (otra pantalla, otro carril) · `playwright/**`, `scripts/capturas-*` (**Marcelo**) · todo lo demás del cliente de terminología · la API |
| `⚠️ RIESGO ALTO` | Marcelo escribe su E2E **hoy** contra los `data-testid` de §3. Si les cambiás el nombre, su spec falla al integrar. **Los ponés como están, una vez.** Y la regla del cliente del 09/09 (`CLAUDE.md` §6): **una tarjeta con pestañas, centrada, a lo ancho**; nunca un bloque a la izquierda con columna vacía |
| `DÓNDE SE PRUEBA` | `yarn dev` (simulador, `mockBackend: true`, cuenta `SECURITY_ADMIN` del simulador: buscala en `core/mock/**` — `grep -rn "SECURITY_ADMIN" src/app/core/mock \| head`) · al final, `yarn start:real-api` contra la API de Itzan si está · ruta: la que carga `app.routes.ts:763` (`VersionImport`) — **sacala del router** |
| `LÍMITE DE RECURSOS` | Regla 70: un `ng serve`, una suite, un navegador. La suite entera son ~4985 pruebas / ~140 s: **corré el spec dirigido**, la suite entera una vez al final |

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
ls .claude/skills | wc -l            # -> 178 (o más: el front trae 4 propias)
ls .claude/rules/[0-9]*.md | wc -l   # -> 15  (mas el README, que no es una regla)
python .claude/hooks/plan_gate.py --self-test    # -> 11 PASS, 0 FAIL
```

⚠️ **Antes de `cp -r`, mirá qué hay:** el front **ya tiene** `.claude/` con `project-design-system`,
`visual-quality-gate`, `frontend-production-gate`, `fable-refactor-orchestrator` y revisores en `.claude/agents/`.
**No los pises**: fusioná y dejá constancia en tu daily.

### 1.2 Qué te instala eso

| Candado | Qué impide |
|---|---|
| `plan_gate.py` | Escribir código sin `PLAN.md` en disco. Nunca bloquea `.md` ni nada bajo `docs/` |
| `report_gate.py` | Cerrar la sesión con trabajo activo y sin `REPORTE.md`, o sin sus tres secciones |
| `blocker_gate.py` | Cerrar con microtareas en `BLOQUEADO` o `EN CURSO` sin declarar la simulación de los tres niveles del contrato (regla 65) |

**En cualquier otra herramienta los candados NO corren.** El plan y el reporte siguen siendo igual de
obligatorios; lo único que cambia es que nadie te va a frenar.

### 1.3 Skills que tenés que CARGAR para este lote

Son **26**: 11 del proceso y 15 propias de la pantalla.

**Del proceso — obligatorias para todos:**

| Skill | Para qué |
|---|---|
| `skills-router` | la entrada al catalogo: mapea la situacion concreta a la skill que toca |
| `factual-discovery` | confirmar el sistema real antes de planificar |
| `milestone-planning` | descomponer en hitos, subtareas y microtareas con CA y DoD |
| `anti-hallucination-guard` | localizar lo existente antes de crear; no inventar APIs de Angular ni inputs de la molécula |
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
| `frontend-forms-ux` | **la más importante de tu lote**: validar antes de confirmar, sin doble envío, datos preservados ante fallo, errores anclados |
| `frontend-ux-states` | los nueve estados M34 de `ViewState<T>` (ADR-0005 del repo): vacío que orienta, error accionable con `requestId`, parcial mientras valida |
| `atomic-design-components` | reusar `app-file-input`, `app-select`, `app-alert`, `app-view-state-host`, `app-data-table`, `app-form-field`, `app-button`: **no rearmar ninguno** |
| `angular-forms` | el selector de perfil/sistema/versión y el archivo como formulario con estado |
| `angular-signals-state` | «puede importar» como `computed` sobre (validación OK ∧ no cargando); nada de `effect` para copiar estado |
| `frontend-data-tables` | las tablas de vista previa y de errores: legibles, colapsables en móvil, con estado vacío |
| `ux-writing-microcopy` | «Validar sin guardar», «Importar 50 conceptos», «Fila 12, columna display: está vacía», «No se guardó nada» |
| `frontend-accessibility` | nombre accesible en cada botón, foco al resultado, `aria-live` para el informe, teclado hasta la zona de arrastre |
| `accessibility-testing` | recorrido de teclado escrito y verificado |
| `frontend-security` | la descarga de errores CSV se genera en el cliente: prefijar celdas que empiezan con `= + - @` (CSV injection) |
| `frontend-data-access` | el cliente HTTP con `FormData`, `responseType: 'blob'` y `HttpTestingController` como lo hace el repo |
| `angular-testing` | `setInput`, `whenStable` en zoneless, `HttpTestingController`, fixtures de respuesta |
| `frontend-responsive-layout` | 375 / 768 / 1280 sin scroll horizontal; la tarjeta a lo ancho |
| `visual-proof` | tres viewports, dos temas, cuatro estados: mirar la captura |
| `data-privacy-phi` | sólo fixtures sintéticos en capturas y reporte |

Entrá siempre por `skills-router`: **no leas el catálogo entero, no sirve.**

### 1.4 DoD de esta sección — se verifica como cualquier otra

- [ ] `ls .claude/skills | wc -l` devolvió **178 o más**, y la salida está pegada en tu daily.
- [ ] `python .claude/hooks/plan_gate.py --self-test` devolvió **11 PASS, 0 FAIL**, salida pegada.
- [ ] Leíste `skills-router` y las 26 skills de las dos tablas, **empezando por `frontend-forms-ux`**.
- [ ] Creaste tu `PLAN.md` **antes** del primer `Edit`/`Write` de código.

**Sin estas cuatro casillas, tu lote arranca en `BLOQUEADO`, no en `EN CURSO`.**

> ### ✅ Hechos ya verificados contra el árbol — no los repitas, pero tampoco los creas sin abrir el archivo
>
> | Dónde | Qué hay | Qué significa para vos |
> |---|---|---|
> | `features/admin/terminology/version-import/version-import.html` | `app-page-header` «Importar terminología»; `app-view-state-host [state]="estado()" (retry)="cargar()"`; sección «1 · A dónde» con `app-form-field` + `app-select` de sistema (`opcionesDeSistema()`) y de versión (`sinVersionesAbiertas()` → `app-alert warning`); sección «2 · El archivo» con `app-alert info` que explica NDJSON, `app-file-input [(files)]="archivos" accept=".ndjson,.jsonl,.json,application/json,text/plain" [maxSizeBytes]="maxBytes" [maxFiles]="1" [disabled]="importando()" (rejected)="avisarRechazos($event)"`, nota `data-testid="importar-tope"` con `{{ maxMib }}`, botón `app-button variant="primary" [disabled]="!puedeImportar()" [isLoading]="importando()" (clicked)="importar()"`; bloque `@if (resultado(); as informe)` | **Es tu pantalla.** Se reordena en tres pasos («Qué vas a cargar», «El archivo», «Resultado») y se ensancha. Lo que existe se conserva: el selector de versión que filtra borradores es exactamente lo que el contrato pide |
> | `version-import.ts` | `estado = signal<ViewState<readonly CodeSystemListItem[]>>(loading())`; `cargandoVersiones`; `errorToViewState`; `ViewStateHost` importado; `ready(items)` | Copiá esa forma para los estados nuevos (`validando`, `informe`, `resumen`) |
> | `version-import.spec.ts` | Existe | Tu baseline; se ensancha, no se reemplaza |
> | `shared/components/molecules/file-input/file-input.html:3-9` | `class="dropzone"`, `[class.is-dragging]="isDragging()"`, `(dragover)`, `(dragleave)`, `(drop)="handleDrop($event)"`, `<label class="dropzone-content" [attr.for]="controlId()">`, texto «arrastrá…» | **El drag & drop está hecho.** Inputs (`file-input.ts:49-78`): `label`, `accessibleLabel`, `hasError`, `required`, `showList`, `showFeedback`, y `accept`, `maxSizeBytes`, `maxFiles`, `disabled`, `files` (model), `rejected` (output) — **verificá la lista completa en el `.ts` antes de usar uno** |
> | `core/data-access/terminology/terminology.client.ts:410-424` | `POST /terminology/versions/{id}/import-file` con `FormData` (`file`) | Se ensancha con `dryRun` y `profile`; se agrega `descargarPlantilla` |
> | `core/mock/handlers/terminology.handlers.ts:244` | `router.post('/terminology/versions/:id/import-file', () => ({ … }))` — respuesta fija | Tu **doble**. Se ensancha a los tres niveles de §2 decidiendo por nombre de archivo (§4) |
> | `CLAUDE.md` | M34 en `ViewState<T>`; `tsc` no revisa plantillas; sin Tailwind, 188 tokens; **una tarjeta con pestañas, centrada, a lo ancho** (09/09); Playwright sin `networkidle` | Las cuatro aplican |
> | `package.json` | Sin dependencia CSV/XLSX | La vista previa viene del servidor (Q-5); el CSV de errores lo generás vos en 10 líneas |
>
> ⚠️ **Lo que la verificación NO hizo: ejecutar.** H1 abre la pantalla y la captura antes de tocarla.

## 2. Resultado observable

| Hito | Prioridad | Qué queda demostrado |
|---|---|---|
| **H1** | `BLOQUEANTE` | Corte, baseline, la pantalla actual **abierta y capturada** (escritorio + móvil) contra el simulador, consola y red anotadas. |
| **H2** | `ALTA` | El doble del simulador responde §2 en tres niveles (correcto / límite / inválido) decidiendo por nombre de archivo, con spec; y sirve la plantilla. **Publicado en tu primera hora y media** (Marcelo lo usa para su E2E). |
| **H3** | `ALTA` | Cliente y tipos ensanchados (`importarArchivo` con `dryRun`/`profile`, `descargarPlantilla`), probados con `HttpTestingController`. |
| **H4** | `ALTA` | La pantalla en tres pasos con los `data-testid` de §3: qué se carga + plantilla, arrastrar, validar sin guardar, vista previa y errores, importar (deshabilitado hasta 0 errores), resumen, descargar errores, cargar otro. Nueve estados M34. Datos preservados ante fallo. Teclado completo. |
| **H5** | `ALTA` | Capturas ×3 viewports ×2 temas ×4 estados **miradas**, consola y red limpias, spec dirigido y suite entera sin rojos nuevos. |
| **H6** | `ALTA` | Recorrido contra la API real si la rama de Itzan está arriba (peldaño `VERIFIED`); si no, `VERIFIED` contra el doble, **declarado**. PR `MERGEABLE`. `REPORTE.md`. |

> Orden: **H1 → H2 → H3 → H4.S1 → H4.S2 → H4.S3 → H5 → H6.** El doble de H2 va **temprano** porque
> Marcelo lo necesita. Un flujo entero contra el doble vale más que la descarga de errores y la plantilla a medias.

**Kill-test del turno:** `yarn dev`, entrá con la cuenta admin del simulador a la ruta de «Importar
terminología». Si el primer paso no dice **qué** vas a cargar ni ofrece «Descargar plantilla», H4 no está hecho.
Arrastrá `ok-50.csv` sobre la zona: si no se toma, H4 no está hecho. «Validar sin guardar»: si `carga-informe`
no dice 50 leídas / 0 errores, o `carga-importar` sigue deshabilitado después, H4 no está hecho. «Importar»: si
`carga-resumen` no dice 50 insertadas, tampoco. Arrastrá `con-errores.xlsx`: si `carga-errores` no muestra 5
filas con columna y `carga-importar` habilitado, tampoco. Desconectá el simulador (nombre `error-red`): si el
archivo elegido desaparece de la pantalla, H4.S2.M9 no está hecho. Todo con la consola limpia.

## 3. Alcance

**IN:** corte, baseline, capturas «antes» · doble del simulador en tres niveles + plantilla simulada ·
cliente y tipos (sección import) · pantalla en tres pasos con `data-testid` de §3 · `accept` con CSV/XLSX ·
«Validar sin guardar» → informe + vista previa + errores · «Importar» habilitado sólo tras validación con 0
errores · resumen · descarga de errores (CSV en cliente, con protección de fórmulas) · plantilla descargable ·
nueve estados M34 · datos preservados ante fallo · accesibilidad y teclado · specs dirigidos · capturas ×3×2×4 ·
`PLAN.md`, `REPORTE.md`, `evidencia/`.

**OUT:** la molécula `file-input` (se usa; si necesita algo, se anota) · `app.routes.ts` y navegación ·
`features/alovida/terminologia/**` · Playwright y scripts de captura (**Marcelo**) · el resto del cliente de
terminología · **parsear CSV/XLSX en el navegador** (Q-5) · cualquier dependencia nueva · la API · cambiar
los `data-testid` de §3 una vez puestos · literales de color/espaciado (sólo tokens) · declarar `HECHO` sin correr el DoD.

## 4. Plan — hitos, subtareas y microtareas

Estados: `TODO` · `EN CURSO` · `HECHO` · `A MEDIAS` · `BLOQUEADO` · `DESCARTADO`. La columna «Si se traba» **se ejecuta, no se agenda.**

### H1 — Corte, baseline y la pantalla de hoy, capturada

**Prioridad:** `BLOQUEANTE`

**CA:** Dado tu checkout, cuando alguien pregunta cómo se veía y qué hacía la pantalla antes, entonces hay
SHA, salidas con exit code y capturas miradas.
**DoD:** `evidencia/antes/` con baseline, dos capturas con su línea, consola y red.
**Estado:** TODO

#### H1.S1 — Corte y baseline

**CA:** Dado un rojo posterior, cuando alguien pregunta si lo rompiste vos, entonces la respuesta sale de un archivo.
**DoD:** salidas con exit code; rojos previos clasificados.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Si se traba | Estado |
|---|---|---|---|---|---|
| H1.S1.M1 | Worktree limpio desde `origin/mockup` y rama (**no** el checkout de Ender) | SHA en `PLAN.md` | `git fetch origin && git worktree add ../mch-front-justin origin/mockup && cd ../mch-front-justin && git checkout -b justin/carga-masiva-pantalla-2026-09-25 && git rev-parse HEAD` | `worktree` ocupado → otro nombre | TODO |
| H1.S1.M2 | `yarn install` (PnP; **nunca npm**) | exit 0 | `yarn install; echo "exit=$?"` → `evidencia/antes/install.txt` | Red → un reintento; si no, declarar | TODO |
| H1.S1.M3 | Baseline `lint`, `typecheck` | Dos exit codes | → `evidencia/antes/baseline.txt` | Rojo previo → se clasifica en M5 | TODO |
| H1.S1.M4 | Baseline spec dirigido | Conteo | `yarn test --run --include='**/version-import.spec.ts'` (si `ng test` no acepta `--include`, mirá `angular.json` → `test.options`; último recurso: suite entera una vez y guardar sólo esas líneas) → `evidencia/antes/spec.txt` | — | TODO |
| H1.S1.M5 | Clasificar cada rojo previo | Tabla o «ninguno» | `PLAN.md` | — | TODO |

#### H1.S2 — La pantalla de hoy

**CA:** Dada la ruta, cuando se abre con la cuenta admin del simulador, entonces hay dos capturas miradas y la
lista de errores previos de consola y red.
**DoD:** `evidencia/antes/capturas/` + `consola-red.txt`.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Si se traba | Estado |
|---|---|---|---|---|---|
| H1.S2.M1 | Ruta real de la pantalla desde `app.routes.ts:763` y guard de rol | Ruta + guard en `PLAN.md` | `grep -n -B10 "version-import" src/app/app.routes.ts` | — | TODO |
| H1.S2.M2 | Cuenta admin del simulador | Correo sintético en `PLAN.md` | `grep -rn "SECURITY_ADMIN" src/app/core/mock \| head` | Ninguna → mirá `core/mock/fixtures/**` de usuarios y elegí la de mayor rol; anotalo | TODO |
| H1.S2.M3 | `yarn dev`, abrir, capturar 1280 y 375, **mirarlas** (una línea cada una) | 2 capturas | `evidencia/antes/capturas/` | Puerto 4200 ocupado → identificá el proceso (`Get-NetTCPConnection -LocalPort 4200`), no levantes otro | TODO |
| H1.S2.M4 | Subir un NDJSON de 3 líneas por el flujo actual y anotar qué muestra | Descripción | `evidencia/antes/comportamiento.md` | — | TODO |
| H1.S2.M5 | Consola y red | Lista o «ninguno» | `evidencia/antes/consola-red.txt` | — | TODO |

### H2 — El doble del simulador en tres niveles, publicado temprano

**Prioridad:** `ALTA`

**CA:** Dado `terminology.handlers.ts`, cuando la pantalla llama `import-file` con un archivo cuyo nombre
contiene `ok` / `con-errores` / `grande` / `.pdf` / `vacio` / `error-red`, entonces responde §2 en nivel
correcto (informe con `preview`, `inserted` según `dryRun`) / límite (`aborted` con 5 `errorSamples` con
`column`; 413) / inválido (422 `IMPORT_FORMAT_UNSUPPORTED`; 422 `IMPORT_EMPTY_FILE`; error de red con
`requestId`); y `import-template` devuelve un CSV de dos líneas.
**DoD:** spec del manejador en verde; **push antes de la hora y media** con aviso en tu daily.
**Estado:** TODO

#### H2.S1 — El manejador

**CA:** Dado cada nombre de archivo, cuando se llama, entonces la respuesta es la de la tabla del spec.
**DoD:** spec con 8 casos.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Si se traba | Estado |
|---|---|---|---|---|---|
| H2.S1.M1 | Leer 2 manejadores del simulador que leen `FormData` (`files.handlers.ts`) y cómo devuelven errores con `requestId` | Rutas en `PLAN.md` | — | — | TODO |
| H2.S1.M2 | Nivel correcto: `*ok*` → `{ batchId: dryRun ? null : uuid, format: por extensión del nombre, profile, dryRun, aborted: false, totalRead: 50, inserted: dryRun ? 0 : 50, skipped: 0, errors: 0, errorSamples: [], preview: 20 filas ZZ- }`; segunda llamada real con el mismo nombre → `inserted: 0, skipped: 50` (estado en memoria del simulador por `versionId`) | spec | `yarn test --run --include='**/terminology.handlers.spec.ts'` (o el spec del simulador: `mock-backend.spec.ts`) | — | TODO |
| H2.S1.M3 | Nivel límite: `*con-errores*` → `aborted: true, errors: 5, inserted: 0`, 5 `errorSamples` con `line` 5/9/14/20/33 y `column` de §4; `*grande*` → 413 con el sobre de error del simulador | spec ×2 | idem | — | TODO |
| H2.S1.M4 | Nivel inválido: `*.pdf` → 422 `{ code: 'IMPORT_FORMAT_UNSUPPORTED' }`; `*vacio*` → 422 `IMPORT_EMPTY_FILE`; sin archivo → 412; `*error-red*` → fallo de red (status 0) con `requestId` si el simulador lo soporta | spec ×4 | idem | — | TODO |
| H2.S1.M5 | Sin rol admin → 403 (si el simulador modela roles; `grep -rn "403" src/app/core/mock/handlers \| head -3`) | spec o `DESCARTADO` con evidencia | idem | — | TODO |
| H2.S1.M6 | `GET /terminology/import-template?profile&format` → CSV `code,display,definition\nZZ-000,Ejemplo sintético,Fila de ejemplo` con `Content-Disposition`; `format=xlsx` → un Blob mínimo o 422 (declaralo) | spec | idem | — | TODO |
| H2.S1.M7 | Commit «feat(mock): doble de carga masiva en tres niveles» + **push** + línea en tu daily con la hora | Visible | `git log origin/justin/carga-masiva-pantalla-2026-09-25 -1 --format=%ci` | Sin push → `gh auth status`; bundle y aviso | TODO |

### H3 — Cliente y tipos

**Prioridad:** `ALTA`

**CA:** Dado `terminology.client.ts`, cuando se llama `importarArchivo(versionId, file, { dryRun, profile })`
y `descargarPlantilla(profile, format)`, entonces las peticiones coinciden con §2 y las respuestas tipan con §2.
**DoD:** spec del cliente con `HttpTestingController` en verde.
**Estado:** TODO

#### H3.S1 — Tipos y métodos

**CA:** Dado `terminology.types.ts`, cuando se ensancha, entonces nada existente cambia de nombre.
**DoD:** `yarn typecheck`; spec.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Si se traba | Estado |
|---|---|---|---|---|---|
| H3.S1.M1 | Leer cómo el cliente ya arma `FormData` (`:410-424`) y cómo otro cliente descarga un Blob (`grep -rn "responseType: 'blob'" src/app/core/data-access \| head -2`) | Rutas en `PLAN.md` | — | — | TODO |
| H3.S1.M2 | Tipos: `ImportarArchivoRespuesta` con los campos de §2 (nuevos opcionales para no romper el consumidor actual), `ProblemaImportado { line; column?; message }`, `FilaPreview { line; code; display; definition? }`, `PerfilDeImportacion = 'conceptos' \| 'designaciones'` | `yarn typecheck` | — | — | TODO |
| H3.S1.M3 | `importarArchivo(versionId, file, opciones)`: `FormData` con `file`, `dryRun`, `profile` | Compila | `yarn typecheck` | — | TODO |
| H3.S1.M4 | `descargarPlantilla(profile, format): Observable<Blob>` | Compila | `yarn typecheck` | — | TODO |
| H3.S1.M5 | Spec: el `FormData` lleva `file`, `dryRun='true'`, `profile='conceptos'`; la URL es la de §2 | PASS | `yarn test --run --include='**/terminology.client.spec.ts'` | — | TODO |
| H3.S1.M6 | Spec: la plantilla pide `responseType: 'blob'` con los query params | PASS | idem | — | TODO |
| H3.S1.M7 | Spec: 422 con `code` llega tipado al consumidor (según el mapeo de errores del repo: `core/http/error-to-view-state.ts`) | PASS | idem | — | TODO |

### H4 — La pantalla en tres pasos

**Prioridad:** `ALTA`

**CA:** Dada la pantalla con la cuenta admin, cuando la persona elige perfil, sistema y versión, arrastra un
archivo, valida sin guardar, revisa vista previa y errores, e importa, entonces ve el resumen, puede descargar
errores y plantilla, y ante fallo no pierde nada; con los `data-testid` de §3 puestos **una vez**.
**DoD:** `version-import.spec.ts` ensanchado en verde; ruta recorrida contra el doble con consola y red limpias.
**Estado:** TODO

#### H4.S1 — Paso 1 «Qué vas a cargar» y paso 2 «El archivo»

**CA:** Dado el paso 1, cuando se elige el perfil, entonces se habilitan sistema, versión y la plantilla; dado
el paso 2, cuando se arrastra o elige un CSV/XLSX, entonces se toma, y los rechazos por tamaño o tipo se
muestran anclados.
**DoD:** spec por comportamiento.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Si se traba | Estado |
|---|---|---|---|---|---|
| H4.S1.M1 | Muestrear 2 pantallas de `features/admin/**` para copiar tarjeta, pestañas/secciones y `app-view-state-host` (regla 09/09) | Rutas en `PLAN.md` | — | — | TODO |
| H4.S1.M2 | Reestructurar la plantilla en tres secciones dentro de **una** tarjeta a lo ancho: «1 · Qué vas a cargar», «2 · El archivo», «3 · Resultado» | Se ve; `app-page-header` se conserva | captura provisoria | — | TODO |
| H4.S1.M3 | `app-select` de perfil (`data-testid="carga-perfil"`, opciones «Conceptos»; «Designaciones» **sólo si** Marcelo confirmó Q-9 en su daily; si no, una sola opción y el select igual existe) | spec: al elegir, `perfil()` cambia | `yarn test --run --include='**/version-import.spec.ts'` | — | TODO |
| H4.S1.M4 | Sistema y versión: los selects existentes con `data-testid="carga-sistema"` y `carga-version`; la alerta de «sin versiones en borrador» se conserva | spec existente sigue verde | idem | — | TODO |
| H4.S1.M5 | Enlaces «Descargar plantilla (CSV)» / «(XLSX)» (`carga-plantilla-csv`, `carga-plantilla-xlsx`) que llaman `descargarPlantilla` y disparan la descarga con el nombre del `Content-Disposition` (o `plantilla-<perfil>.<ext>` si falta) | spec: click → petición → `URL.createObjectURL` llamado (doble) | idem | — | TODO |
| H4.S1.M6 | Texto de ayuda del paso 2 desde el perfil: «Columnas: code (obligatoria), display (obligatoria), definition (opcional). También acepta código/nombre/definición.» — sin mencionar NDJSON como principal (queda como «también») | Se ve | spec: el texto cambia con el perfil | — | TODO |
| H4.S1.M7 | `app-file-input` con `accept=".csv,.xlsx,.ndjson,.jsonl,.json,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/json,text/plain"`, `maxFiles=1`, `maxSizeBytes` del tope, `[disabled]` mientras valida/importa, envuelto en `<div data-testid="carga-archivo">` | Arrastrar toma el archivo | spec: `files` cambia; `(rejected)` muestra mensaje anclado con el motivo (tamaño / tipo) | `accept` no filtra `.xlsx` en algún navegador → el servidor decide (detección por contenido); anotalo | TODO |
| H4.S1.M8 | Cambiar el archivo **limpia** informe, preview, errores y resumen (estado consistente) | spec | idem | — | TODO |

#### H4.S2 — Validar, importar, resumen, descargar, otro

**CA:** Dado un archivo elegido, cuando se pulsa «Validar sin guardar», entonces se llama con `dryRun=true` y
se muestran informe, preview y errores; «Importar» sólo se habilita con validación de 0 errores; al importar
se muestra el resumen; los errores se descargan como CSV; «Cargar otro» vuelve al paso 2 conservando el paso 1.
**DoD:** spec por comportamiento; recorrido contra el doble.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Si se traba | Estado |
|---|---|---|---|---|---|
| H4.S2.M1 | Botón «Validar sin guardar» (`carga-validar`, primario mientras no hay validación) → `importarArchivo(..., { dryRun: true })`; `isLoading`; bloqueo de doble clic | spec: una sola petición con dos clics rápidos | `yarn test … version-import` | — | TODO |
| H4.S2.M2 | Estado «validando» como parcial M34 (la sección 3 muestra esqueleto/indicador, no vacío) | spec | idem | — | TODO |
| H4.S2.M3 | `carga-informe`: «Leídas: N · Con error: M · Formato: CSV/XLSX/NDJSON · Perfil»; si `aborted`, `app-alert warning`: «No se guardó nada: corregí las filas y volvé a validar» | spec con fixture de respuesta | idem | — | TODO |
| H4.S2.M4 | `carga-preview`: `app-data-table` con `preview` (fila, code, display, definition), estado vacío si no hay filas válidas, colapsable en móvil (`frontend-data-tables`) | spec | idem | — | TODO |
| H4.S2.M5 | `carga-errores`: `app-data-table` con `fila`, `columna`, `motivo`; texto «Primeros 20 errores de M» cuando `errors > 20`; oculta si 0 | spec ×2 | idem | — | TODO |
| H4.S2.M6 | `carga-importar`: `puedeImportar = computed(() => informe()?.errors === 0 && !cargando())` (Q-8); texto «Importar N conceptos»; segunda llamada **sin** `dryRun`; `isLoading`; sin doble envío | spec ×3: deshabilitado sin validar / con errores; habilitado con 0; un clic = una petición | idem | — | TODO |
| H4.S2.M7 | `carga-resumen`: «Leídas / Insertadas / Omitidas / Errores» + `batchId` + explicación de «omitidas» («ya existían en esta versión y no se tocaron») | spec | idem | — | TODO |
| H4.S2.M8 | `carga-descargar-errores`: CSV generado en el cliente (`fila,columna,motivo`, comillas escapadas, **celdas que empiezan con `= + - @` prefijadas con `'`**), nombre `errores-<batchId o fecha>.csv`; texto aclara que son los primeros 20 | spec: el Blob contiene encabezado + N filas; una celda `=1+1` sale como `'=1+1` | idem | — | TODO |
| H4.S2.M9 | Datos preservados ante fallo: si validar o importar fallan (red, 413, 422, 5xx), el archivo y las tres selecciones siguen; el error se muestra en la sección 3 (no sólo un toast) | spec ×2 | idem | — | TODO |
| H4.S2.M10 | `carga-otro`: vuelve al paso 2 con paso 1 intacto y sección 3 limpia | spec | idem | — | TODO |
| H4.S2.M11 | Mapeo de errores: 413 → «El archivo supera N MB»; 422 `IMPORT_FORMAT_UNSUPPORTED` → «Ese archivo no es CSV, XLSX ni NDJSON»; `IMPORT_EMPTY_FILE` → «El archivo no tiene filas»; `IMPORT_PROFILE_UNKNOWN` → «Elegí qué vas a cargar»; 401/403 → sin permiso (S-permiso M34); red → error con `requestId` (S9) | spec por código | idem | — | TODO |
| H4.S2.M12 | Nueve estados M34 recorridos en una tabla del `PLAN.md`: cuál aplica a qué sección y con qué spec | Tabla | `PLAN.md` | — | TODO |

#### H4.S3 — Accesibilidad, microcopy, tokens

**CA:** Dada la pantalla, cuando se recorre con teclado y lector, entonces cada control tiene nombre, el
informe se anuncia, el foco va al resultado tras validar; y no hay literales de color ni espaciado.
**DoD:** recorrido escrito; `grep` de literales vacío; `lint`/`typecheck`.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Si se traba | Estado |
|---|---|---|---|---|---|
| H4.S3.M1 | Nombres accesibles en cada botón y enlace; etiquetas en cada `app-form-field`; `aria-live` en el informe (como lo hace el repo: `grep -rn "aria-live\|appAnuncio" src/app/shared \| head -3`) | spec: `getByRole` encuentra cada control | `yarn test … version-import` | — | TODO |
| H4.S3.M2 | Foco al `carga-informe` tras validar y al `carga-resumen` tras importar | spec | idem | — | TODO |
| H4.S3.M3 | Recorrido de teclado: Tab hasta la zona, Enter abre el diálogo, Tab a validar, Enter, Tab a importar | Descrito por paso | `evidencia/h4/teclado.md` | — | TODO |
| H4.S3.M4 | Microcopy revisada con `ux-writing-microcopy` (lista de textos en `PLAN.md`) | Lista | `PLAN.md` | — | TODO |
| H4.S3.M5 | Sólo tokens en el CSS | `grep` limpio | `grep -nE "#[0-9a-fA-F]{3,6}\|[0-9]+px" version-import.css` → sólo lo que ya estaba en el baseline | — | TODO |
| H4.S3.M6 | `yarn lint && yarn typecheck` + spec dirigido | Sin rojos nuevos | `evidencia/h4/` | — | TODO |
| H4.S3.M7 | Recorrer la ruta entera contra `yarn dev` con `ok-50.csv`, `con-errores.xlsx`, `no-es-nada.pdf`, `error-red.csv` (nombres del doble); consola y red limpias | Observado | `evidencia/h4/consola-red.txt` | — | TODO |

### H5 — Prueba visual y regresión

**Prioridad:** `ALTA`

**CA:** Dada la pantalla, cuando se captura en 375 / 768 / 1280, claro y oscuro, en vacío / validando / con
errores / éxito, entonces cada captura fue **mirada** con una línea; sin scroll horizontal; la suite entera sin
rojos nuevos.
**DoD:** 24 capturas con línea en `evidencia/h5/capturas.md`; `yarn test` completo.
**Estado:** TODO

#### H5.S1 — Capturas y suite

**CA:** Dado el baseline, cuando se repite, entonces no hay rojos nuevos; y las capturas están miradas.
**DoD:** salidas y líneas.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Si se traba | Estado |
|---|---|---|---|---|---|
| H5.S1.M1 | 24 capturas contra el doble (3 × 2 × 4) con Playwright o el navegador del MCP, **una por una** | 24 archivos | `evidencia/h5/capturas/` | Sin Playwright a mano → navegador con DevTools en modo dispositivo; anotá el método | TODO |
| H5.S1.M2 | Primera pasada: una línea por captura contra el CA de H4 (`visual-proof` §5) | 24 líneas | `evidencia/h5/capturas.md` | — | TODO |
| H5.S1.M3 | Sin scroll horizontal a 375 (`document.documentElement.scrollWidth <= innerWidth`) en los cuatro estados | 4 valores | `evidencia/h5/scroll.txt` | Hay → arreglar en tu CSS (tokens), re-capturar | TODO |
| H5.S1.M4 | Modo oscuro: contraste de la alerta de `aborted` y de las tablas visible | Línea | `capturas.md` | — | TODO |
| H5.S1.M5 | `yarn test` completo, una vez | Sin rojos nuevos | `evidencia/h5/test.txt` | — | TODO |
| H5.S1.M6 | Diff no toca archivos de otros | `grep` vacío | `git diff origin/mockup --stat \| grep -E "file-input|app.routes|navigation|playwright|alovida/terminologia"` → vacío | Aparece → revertir y pedir | TODO |

### H6 — Contra la API real si está, PR mergeable y cierre

**Prioridad:** `ALTA`

**CA:** Dado el turno, cuando cierra, entonces la pantalla está `VERIFIED` contra la API real de Itzan **o**
`VERIFIED` contra el doble con la brecha declarada; el PR está `MERGEABLE`; el `REPORTE.md` abre con el avance.
**DoD:** `evidencia/h6/`, `evidencia/pr/`, `head -3 REPORTE.md`.
**Estado:** TODO

#### H6.S1 — API real (si está)

**CA:** Dada la rama `itzan/carga-masiva-motor-2026-09-25` pusheada y arrancable, cuando se recorre el flujo
con `yarn start:real-api`, entonces el kill-test pasa contra Postgres.
**DoD:** recorrido con capturas o `DESCARTADO` con evidencia de que la rama no estaba.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Si se traba | Estado |
|---|---|---|---|---|---|
| H6.S1.M1 | ¿Está la rama de Itzan? | Sí/no con SHA | `git -C ../mantra-core-health-api fetch && git -C ../mantra-core-health-api log origin/itzan/carga-masiva-motor-2026-09-25 -1` | No está → `DESCARTADO` con esta salida; el peldaño queda `VERIFIED` contra el doble, declarado. **No esperás** | TODO |
| H6.S1.M2 | Worktree de esa rama, `.env`, `docker compose up -d postgres postgres-init`, `yarn start:dev`, readiness 200 | 200 | `evidencia/h6/api.txt` | No arranca → pegá el log, `DESCARTADO` con causa | TODO |
| H6.S1.M3 | `yarn start:real-api` (proxy al puerto de la API: `proxy.conf.json`), login con la cuenta demo (`alovida/CREDENCIALES-DEMO.md:20`, **sin copiar la contraseña**), kill-test entero | Observado | `evidencia/h6/kill-test.md` + capturas | — | TODO |
| H6.S1.M4 | Anotar diferencias entre el doble y la API real (200/201, campos) y ajustar el doble si difiere | Lista | `REPORTE.md` §Contra el doble | — | TODO |

#### H6.S2 — PR y cierre

**CA:** Dado el PR, cuando se consulta con `gh`, entonces `MERGEABLE`, no draft, checks sin `fail`.
**DoD:** `evidencia/pr/`.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Si se traba | Estado |
|---|---|---|---|---|---|
| H6.S2.M1 | Rebase sobre `origin/mockup` | Limpio | `git fetch && git rebase origin/mockup && git status` | Conflicto → resolvelo | TODO |
| H6.S2.M2 | PR con plantilla (qué, por qué, cómo probar contra el simulador, capturas, riesgo, **«verificado contra el doble / contra la API real»**) | URL | `gh pr create --base mockup …` | `gh` sin auth → push + `evidencia/pr/body.md` | TODO |
| H6.S2.M3 | `gh pr view <n> --json number,url,isDraft,mergeable,mergeStateStatus,reviewDecision,baseRefName,headRefName` | `MERGEABLE` | `evidencia/pr/view.json` | `UNKNOWN` → bucle `until`; `BEHIND` → M1 | TODO |
| H6.S2.M4 | `gh pr checks <n> --watch --fail-fast` | Sin `fail` | `evidencia/pr/checks.txt` | Rojo → clasificar; `EXTERNAL` → `A MEDIAS` | TODO |
| H6.S2.M5 | Procesos corriendo (`ng serve`, API, compose) cerrados o declarados | Lista | `Get-Process node`; `docker compose ps` | — | TODO |
| H6.S2.M6 | `REPORTE.md` con `> **AVANCE: <HECHO> / 68 — <%>.**` primero, tres secciones, peldaño por área, sección «Contra el doble» | `head -3` | `head -3 docs/trabajo/2026-09-25-justin-pantalla/REPORTE.md` | — | TODO |
| H6.S2.M7 | Daily `Justin-Daily-Noche-2026-09-25.md` con §1.4, el avance y la hora de publicación del doble | Existe | `ls` | — | TODO |

## 5. Ambigüedades registradas

| ID | Ambigüedad | Supuesto con el que trabajás | Quién puede resolverla | Qué bloquea |
|---|---|---|---|---|
| Q-5 | ¿Parsear en el navegador para la vista previa? | No; viene del servidor en el dry-run | Pablo | H4.S2.M4 |
| Q-8 | ¿Importar sin validar? | No desde la UI | Pablo | H4.S2.M6 |
| Q-9 | ¿Perfil «Designaciones» en el select? | Sólo si Marcelo lo confirmó en su daily; si no, una opción | Marcelo | H4.S1.M3 |
| Q-J1 | Dry-run responde 200 o 201 | El doble responde 200; si Itzan avisó 201 en su daily, el cliente acepta ambos (no depende del status) | Itzan | H3.S1.M3 |
| Q-J2 | ¿La plantilla se descarga con `<a download>` o con `createObjectURL`? | Como lo haga el repo para otros Blobs (H3.S1.M1); si no hay precedente, `createObjectURL` + `revokeObjectURL` | Pablo | H4.S1.M5 |
| Q-J3 | Vista previa en respuesta real: ¿se muestra otra vez? | No: tras importar se muestra sólo el resumen | Pablo | H4.S2.M7 |

## 6. Definition of Done del hito

- [ ] Todas sus microtareas en `HECHO`, o en `A MEDIAS`/`BLOQUEADO`/`DESCARTADO` **con las cuatro respuestas**.
- [ ] Salida literal de cada DoD en `evidencia/`.
- [ ] Los `data-testid` de §3 puestos **exactamente** con esos nombres.
- [ ] Ningún archivo de otros en el diff; ninguna dependencia nueva.
- [ ] «Importar» inaccesible sin validación con 0 errores; sin doble envío; datos preservados ante fallo.
- [ ] Nueve estados M34 mapeados y con spec.
- [ ] Sólo tokens; claro y oscuro; sin scroll horizontal a 375.
- [ ] Capturas ×3×2×4 miradas con línea (la segunda pasada adversarial la hace **Marcelo**: no la hagas vos, regla 35.1.6).
- [ ] Lo verificado contra el doble, declarado; contra la API real si estuvo.
- [ ] `lint`, `typecheck`, spec dirigido y suite entera sin rojos nuevos; PR `MERGEABLE` pegado; `REPORTE.md` con avance primero.

## 7. Cómo trabajás toda la noche sin nadie

1. **Checkpoint** por microtarea; nunca más de tres operaciones materiales sin uno.
2. **«Si se traba» se ejecuta ya.** Si no alcanza: `A MEDIAS` con las cuatro respuestas y seguís.
3. **No esperás a Itzan.** Tu doble es la API de esta noche. H6.S1 mira si su rama está **una vez**, al final; si no, `DESCARTADO` y listo.
4. **El doble se publica a la hora y media** (Marcelo lo usa). Publicá aunque falte el nivel 403.
5. **Orden si aprieta:** H1 → H2 → H3 → H4.S1 → H4.S2.M1–M7 → H4.S3 → H5 → H4.S2.M8–M12 → H6.
6. **Un `ng serve`, un navegador.** El puerto 4200 se verifica antes de levantar.
7. `REPORTE.md` con el avance primero; tres secciones; procesos enumerados.
8. **Tu daily** es `Justin-Daily-Noche-2026-09-25.md`, en la carpeta de arriba.

## 8. Revisión adversarial antes de cerrar

1. ¿Cambiaste un `data-testid` de §3 o le pusiste otro nombre «más claro»?
2. ¿«Importar» se puede pulsar sin validar, o con errores, o dos veces?
3. ¿Ante un fallo de red el archivo elegido desaparece?
4. ¿Tocaste `file-input` «porque era una línea»?
5. ¿Hay un literal de color o `px` nuevo en tu CSS?
6. ¿El CSV de errores deja pasar `=CMD()` sin prefijo?
7. ¿Declaraste `VERIFIED` sin decir «contra el doble» cuando la API real no estuvo?
8. ¿Hiciste vos la segunda pasada adversarial de tus propias capturas?
9. ¿Hay alguna microtarea en `BLOQUEADO` cuya columna «Si se traba» no ejecutaste?
10. ¿El PR dice `MERGEABLE` en un archivo, o lo estás recordando?
