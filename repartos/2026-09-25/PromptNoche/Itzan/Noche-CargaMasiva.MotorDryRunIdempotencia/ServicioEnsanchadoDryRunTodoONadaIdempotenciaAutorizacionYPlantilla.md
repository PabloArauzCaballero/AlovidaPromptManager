# El motor de la carga masiva: el servicio que ya existe, ensanchado con dry-run, todo o nada, idempotencia probada contra Postgres, autorización, plantilla y OpenAPI

> **Rol:** dueño de `concept-file-import.service.ts`, del controlador de versiones y de los tests de integración de terminología · **Fecha:** 2026-09-25 · **Turno:** noche · **Modo:** autónomo, sin nadie a quien preguntar
> **Contrato compartido:** [`CONTRATO-CARGA-MASIVA.md`](../../CONTRATO-CARGA-MASIVA.md) — §1 (tipos que **copiás literalmente** hasta integrar), §2 (HTTP: es **tuyo**, lo implementás vos), §4 (fixtures), §5 (supuestos).
> **Daily de equipo:** [`Daily-Noche-2026-09-25.md`](../../Daily-Noche-2026-09-25.md)
> **7 hitos · 16 subtareas · 109 microtareas**, con CA, DoD y columna «Si se traba».
>
> **Tu carril incluye el parseo** (heredado del carril de Ender, que esta noche no está): el contrato de fila,
> el detector de formato, el parseador CSV y los perfiles viven en `src/modules/terminology/import/**` y son
> **tuyos**. Lo único que no escribís es el parseador **XLSX**: lo hace Marcelo contra tu `row-contract.ts`
> (por eso lo publicás en la **hora 1**) y Pablo lo cablea en tu barrel al integrar. Nada tuyo depende de que
> Marcelo llegue: sin XLSX, el detector devuelve 422 «xlsx no admitido» y CSV + NDJSON entran enteros. Lo que
> sí necesitás es Postgres: la idempotencia se prueba contra base real.

## 0. Ficha de asignación

| Campo | Valor |
|---|---|
| `REPO` | `alovida/mantra-core-health-api` (NestJS 11 · MikroORM 7 · Yarn 4 · Jest). **Nada de frontend** |
| `TARGET_REF` | `origin/dev`, en **worktree limpio** (el checkout actual está en `feat/admin-portal-catalog`). SHA en tu `PLAN.md` |
| `RAMA` | `itzan/carga-masiva-motor-2026-09-25` |
| `ARCHIVOS RESERVADOS PARA VOS` | `src/modules/terminology/import/**` (nuevo: `row-contract`, `format-detector`, `csv-parser`, `ndjson-parser`, `import-profiles`, `index`, `README`, specs — **menos `xlsx-parser*`**, que es de Marcelo) · `src/modules/terminology/services/concept-file-import.service.ts` (+spec) · `src/modules/terminology/services/import-parsers.provider.ts` (nuevo) · `src/modules/terminology/services/import-template.service.ts` (nuevo) · `src/modules/terminology/controllers/terminology-versions.controller.ts` · `src/modules/terminology/dto/import-concepts-file.dto.ts` · `src/modules/terminology/terminology.module.ts` (sólo `providers`) · `src/common/errors/error-codes.ts` (sólo códigos `IMPORT_*`) · `test/integration/terminology/**` (nuevo) · `openapi/**` · `docs/trabajo/2026-09-25-itzan-motor/**` |
| `ARCHIVOS DE OTROS — NO LOS TOQUES` | `src/modules/terminology/import/xlsx-parser.ts` (+spec), `test/fixtures/terminology-import/**`, `package.json`, `yarn.lock` (**Marcelo**) · `entities/**`, `src/orm/**`, `common/storage/**`, `common/files/**` (esquema y controles: prohibido) · todo el front |
| `⚠️ RIESGO ALTO` | **El esquema no se toca.** `catalog_import_batches` tiene `checksum`, `total_*`, `file_id?`, `state_concept_id?`; **no** tiene columna para formato, perfil ni dry-run: van en la respuesta (Q-4). Si te encontrás escribiendo `@Property` o un `ALTER`, parás. Y **los campos que ya existen en la respuesta no cambian de nombre**: hay un cliente en el front que los lee |
| `LA CUENTA` | `@Roles('SECURITY_ADMIN')` en los tres endpoints. Cuenta demo en `alovida/CREDENCIALES-DEMO.md:20`. **No copies la contraseña a ningún archivo.** Si no entra: `yarn seed:boot` corre `bootstrap-admin-seed.service.ts` |
| `DÓNDE SE PRUEBA` | `yarn start:dev` contra el Postgres del `docker-compose.yml` (servicio `postgres` + `postgres-init`); `yarn test:integration` corre con `ORM_SCHEMA_SYNC=off RATE_LIMIT_DISABLED=true` y `test/jest-integration.json` |
| `LÍMITE DE RECURSOS` | Regla 70: un `start:dev`, una suite, a la vez |

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
ls .claude/skills | wc -l            # -> 178 (o más, si el repo ya traía propias)
ls .claude/rules/[0-9]*.md | wc -l   # -> 15  (mas el README, que no es una regla)
python .claude/hooks/plan_gate.py --self-test    # -> 11 PASS, 0 FAIL
```

⚠️ **Antes de `cp -r`, mirá qué hay:** el repo de producto **ya tiene** su propio `.claude/` y `.agents/`. Si ibas a
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

Son **28**: 11 del proceso y 17 propias del motor.

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
| `seed-data-catalogs` | **la más importante de tu lote**: idempotencia por identificador estable, «la segunda corrida no inserta nada» como prueba, procedencia por lote |
| `integrity-testing` | la idempotencia se prueba contra Postgres real, nunca con el ORM mockeado |
| `concurrency-and-locking` | omitir existentes **por tanda** y la carrera entre dos subidas simultáneas del mismo archivo |
| `authz-access-control` | `SECURITY_ADMIN` en cada endpoint tocado o nuevo, con matriz negativa |
| `api-testing` | matriz negativa, contrato de errores, multipart, 422 vs 500 |
| `error-handling-contract` | códigos `IMPORT_*` estables y documentados; nunca stacktrace al cliente |
| `data-quality-validation` | validación por fila con `fila/columna/motivo`; consultas de verificación (conteos, duplicados, nulos) |
| `file-uploads-media` | tope de tamaño, tipo por parseo, por qué no pasa por `common/files` |
| `data-privacy-phi` | contadores en logs, nunca contenido de filas |
| `nestjs-development` | `FileInterceptor`, `@Body` en multipart, `StreamableFile`, providers e inyección |
| `mikroorm-patterns` | escribir por tandas y vaciar la unidad de trabajo como ya hace el servicio |
| `native-code-patterns` | tu código nuevo es indistinguible del que ya hay en el servicio |
| `api-openapi-docs` | `dryRun`, `profile`, respuesta ensanchada y `import-template` en la especificación, en el mismo trabajo |
| `unit-testing` | un comportamiento por test; caracterización antes de mover código |
| `test-case-design-techniques` | partición de equivalencia y valores límite por columna y por formato |
| `edge-case-data-catalog` | BOM, comillas, saltos dentro de celda, vacíos, Unicode, 255/256, duplicados: la matriz de tu parseador CSV |
| `terminology-value-sets` | qué es un concepto (`code`, `display`, `definition`) y una designación: los perfiles que publicás |

Entrá siempre por `skills-router`: **no leas el catálogo entero, no sirve.**

### 1.4 DoD de esta sección — se verifica como cualquier otra

- [ ] `ls .claude/skills | wc -l` devolvió **178 o más**, y la salida está pegada en tu daily.
- [ ] `python .claude/hooks/plan_gate.py --self-test` devolvió **11 PASS, 0 FAIL**, salida pegada.
- [ ] Leíste `skills-router` y las 28 skills de las dos tablas, **empezando por `seed-data-catalogs`**.
- [ ] Creaste tu `PLAN.md` **antes** del primer `Edit`/`Write` de código.

**Sin estas cuatro casillas, tu lote arranca en `BLOQUEADO`, no en `EN CURSO`.**

> ### ✅ Hechos ya verificados contra el árbol — no los repitas, pero tampoco los creas sin abrir el archivo
>
> | Dónde | Qué hay | Qué significa para vos |
> |---|---|---|
> | `terminology-versions.controller.ts:108-140` | `@Post(':versionId/import-file')`, `@Roles('SECURITY_ADMIN')`, `@HttpCode(CREATED)`, `FileInterceptor('file', { limits: { fileSize: loadStorageEnv().maxSizeBytes, files: 1 } })`, `@ApiConsumes('multipart/form-data')`, `@ApiBody` con `file: binary`; sin archivo → `PreconditionFailedException('Falta el archivo', { versionId })`; llama a `this.fileImportService.importFromFile(versionId, file.buffer, user)` | **Es tu endpoint.** Se ensancha con `dryRun` y `profile` en el body multipart. El `@HttpCode` fijo en 201 choca con «200 en dry-run» (§2): resolvelo con `@Res({ passthrough: true })` **si el repo ya lo hace en algún lado** (`grep -rn "passthrough" src/modules`); si no, 201 en ambos y **anotá la desviación del contrato** en tu daily para Justin |
> | `concept-file-import.service.ts` | NDJSON línea a línea; `ConceptoLeido`; `CONCEPTOS_POR_TANDA = 500`; `MUESTRA_DE_ERRORES = 20`; `MAX_CODE = MAX_DISPLAY = 255`; `exigirVersionEnBorrador(versionId) → { sourceId }`; `checksum` con `createHash`; registra `CatalogImportBatches` | **Es tu servicio.** El NDJSON se mueve detrás del contrato de parseador (a tu `provider`), sin cambiar comportamiento (test de caracterización primero) |
> | `import-concepts-file.dto.ts` | `ImportFileIssueDto { line, message }`; `ImportConceptsFileResponseDto { batchId, totalRead, inserted, skipped, errors, errorSamples }` | Se ensancha **aditivamente** (§2): `format`, `profile`, `dryRun`, `aborted`, `preview`, `errorSamples[].column?`. **Qué cuenta `skipped` hoy** lo averiguás ejecutando (H1.S2) |
> | `catalog_import_batches.entity.ts` | `sourceId` (obligatorio), `codeSystemVersionId?`, `fileId?`, `stateConceptId?`, `startedAt?`, `finishedAt?`, `totalRead?`, `totalInserted?`, `totalErrors?`, `checksum?` (`bigint` como `string`) | Sin columna nueva. Dry-run **no registra lote** |
> | `src/common/errors/error-codes.ts` | Catálogo de códigos del sobre de error | Tus `IMPORT_FORMAT_UNSUPPORTED`, `IMPORT_EMPTY_FILE`, `IMPORT_PROFILE_UNKNOWN` van ahí, con el mismo formato que los vecinos |
> | `src/modules/payments/controllers/payments-operations.controller.ts:115` | `@Post('settlements/import')` | Otro import del repo: **mirá cómo recibe campos extra junto al archivo** antes de escribir tu `@Body` |
> | `test/` | `integration/`, `doubles/`, `fixtures/`, `jest-integration.json`; **ningún spec menciona `import-file`** | El test de integración del import lo escribís vos, copiando la forma de 2 vecinos de `test/integration/` |
> | `src/orm/catalog/indexes/` | Índices declarados por schema, generados | Si **no** hay índice único `(code_system_version_id, code)`, la idempotencia se garantiza en el servicio y se anota como deuda del modelo; **no** lo agregás vos |
> | `docker-compose.yml` | `postgres`, `postgres-init`, `mongodb`, `mongo-init`, `redis`, `opensearch`, `opensearch-init`, `test` | `docker compose up -d postgres postgres-init` es lo mínimo; si la app exige el resto al arrancar, levantalos |
>
> ⚠️ **Lo que la verificación NO hizo: ejecutar.** H1.S2 lo ejercita antes de tocar nada.

## 2. Resultado observable

| Hito | Prioridad | Qué queda demostrado |
|---|---|---|
| **H1** | `BLOQUEANTE` | Corte, baseline, base viva, API viva, token `SECURITY_ADMIN`, y el import NDJSON **ejercitado dos veces** con la respuesta real guardada (qué hace `skipped` hoy, qué hace con errores parciales hoy). |
| **H2** | `ALTA` | `row-contract.ts` **pusheado en la hora 1**; `detectarFormato` por contenido, `CsvParser` RFC 4180 (sin dependencia salvo evidencia), `PERFILES_DE_IMPORTACION.conceptos`, `NdjsonParser` (el código existente, movido), barrel y provider; specs en verde; caracterización del servicio igual antes y después. |
| **H3** | `ALTA` | El servicio ensanchado: detectar → parsear → validar (obligatorias, largos, duplicado en archivo) → todo-o-nada → escribir por tandas omitiendo existentes → lote; `dryRun` no escribe ni registra. Sin 500. Sin contenido en logs. |
| **H4** | `ALTA` | Idempotencia probada **contra Postgres** en `test/integration/terminology/import-file.integration.spec.ts`; matriz negativa de autorización en verde; `curl` real ×2. |
| **H5** | `ALTA` | `GET /terminology/import-template?profile&format` devuelve la plantilla con las columnas del perfil; re-importarla en dry-run da 1 fila, 0 errores. |
| **H6** | `ALTA` | OpenAPI con el contrato entero, sin diff pendiente; `error-codes.ts` con los tres códigos. |
| **H7** | `ALTA` | Regresión sin rojos nuevos, PR `MERGEABLE`, `REPORTE.md` con «contra el doble» declarado. |

> Orden: **H1 → H2 → H3 → H4.S1 → H4.S2 → H5 → H6 → H7.** Un CSV mínimo que entra, valida, no duplica y no
> devuelve 500 vale más que la plantilla y OpenAPI a medias.

**Kill-test del turno:** con la API arrancada y `$TOKEN`: `curl -F file=@test/fixtures/terminology-import/ok-50.csv -F dryRun=true …/import-file`
tiene que devolver `totalRead: 50, errors: 0, batchId: null` y `SELECT count(*)` no cambia; sin `dryRun` → `inserted: 50`;
otra vez → `inserted: 0, skipped: 50`; `con-errores.csv` → `aborted: true, errors: 5, inserted: 0` y `count(*)` igual;
`no-es-nada.pdf` → 422 `IMPORT_FORMAT_UNSUPPORTED` sin stacktrace; sin token → 401. Si uno falla, el hito correspondiente no está hecho.
(Si Marcelo no publicó los fixtures, los tres primeros los creás en tu spec con los nombres y contenidos de §4 — son triviales.)

## 3. Alcance

**IN:** corte, baseline, base y API vivas · ejercicio del import actual · contrato de fila · detector · parseador CSV · perfiles · NDJSON movido · barrel y provider · caracterización del servicio · servicio ensanchado (detección,
parseo vía provider, validación por fila, todo-o-nada, dry-run, omisión de existentes por tanda, lote con
checksum, logs sin contenido) · DTO ensanchado aditivo · controlador con `dryRun` y `profile` · códigos
`IMPORT_*` · test de integración de idempotencia contra Postgres · matriz negativa · `import-template.service.ts`
+ `GET import-template` · OpenAPI · `PLAN.md`, `REPORTE.md`, `evidencia/`.

**OUT:** el parseador XLSX, los fixtures de `test/fixtures/terminology-import/**` y la dependencia XLSX en
`package.json`/`yarn.lock` (**Marcelo**; vos consumís el XLSX recién cuando Pablo lo cablee) · **cualquier cambio de esquema** · `entities/**`, `orm/**`,
`storage/**`, `files/**` · el front · cargas por job (Q-3) · aplicar filas válidas de un archivo con errores
(Q-2) · actualizar un concepto existente (Q-7) · publicar la versión (`$publish` no se toca) · cargar
catálogos reales · refactor del servicio más allá de lo que la microtarea justifica · debilitar un test ·
declarar `HECHO` sin correr el DoD.

## 4. Plan — hitos, subtareas y microtareas

Estados: `TODO` · `EN CURSO` · `HECHO` · `A MEDIAS` · `BLOQUEADO` · `DESCARTADO`. La columna «Si se traba» **se ejecuta, no se agenda.**

### H1 — Corte, baseline, API viva y el import actual ejercitado

**Prioridad:** `BLOQUEANTE`

**CA:** Dado tu entorno, cuando alguien pregunta qué devolvía el endpoint antes de que lo tocaras, entonces hay
respuestas JSON reales guardadas para: archivo bueno ×2 (¿qué cuenta `skipped`?), archivo con errores (¿inserta
las buenas hoy?), y un CSV (¿qué dice hoy?).
**DoD:** `evidencia/antes/` con baseline, `compose.txt`, readiness 200, y cuatro respuestas JSON con su HTTP.
**Estado:** TODO

#### H1.S1 — Corte y baseline

**CA:** Dado un rojo posterior, cuando alguien pregunta si lo rompiste vos, entonces la respuesta sale de un archivo.
**DoD:** salidas con exit code; rojos previos clasificados.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Si se traba | Estado |
|---|---|---|---|---|---|
| H1.S1.M1 | Worktree limpio desde `origin/dev` y rama | SHA en `PLAN.md` | `git fetch origin && git worktree add ../mch-api-itzan origin/dev && cd ../mch-api-itzan && git checkout -b itzan/carga-masiva-motor-2026-09-25 && git rev-parse HEAD` | `worktree` ocupado → otro nombre | TODO |
| H1.S1.M2 | `yarn install` | exit 0 | `yarn install; echo "exit=$?"` → `evidencia/antes/install.txt` | Red → un reintento; si no, copiar `node_modules` y declarar | TODO |
| H1.S1.M3 | Baseline `lint`, `typecheck`, `build` | Tres exit codes | → `evidencia/antes/baseline.txt` | Rojo previo → se clasifica en M5 | TODO |
| H1.S1.M4 | Baseline `test` del módulo terminology | Conteo | `yarn test src/modules/terminology; echo "exit=$?"` → `evidencia/antes/test-terminology.txt` | Flag de Jest según versión | TODO |
| H1.S1.M5 | Clasificar cada rojo previo | Tabla o «ninguno» | `PLAN.md` | — | TODO |

#### H1.S2 — Base, API, token y el endpoint de hoy

**CA:** Dado el endpoint, cuando se lo llama hoy con NDJSON bueno ×2, NDJSON con 2 líneas rotas y un CSV,
entonces hay cuatro respuestas guardadas con su HTTP.
**DoD:** `evidencia/antes/import-*.json`.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Si se traba | Estado |
|---|---|---|---|---|---|
| H1.S2.M1 | `.env` desde `.env.example`, sin secretos reales | La API valida config al arrancar | `cp .env.example .env` + revisar obligatorias | Secreto obligatorio sin valor → generá uno local aleatorio y anotalo sintético | TODO |
| H1.S2.M2 | Levantar la base | `postgres` sano | `docker compose up -d postgres postgres-init && docker compose ps` → `evidencia/antes/compose.txt` | La app exige Mongo/Redis/OpenSearch → levantalos. **Docker no está** → `ENVIRONMENT` declarado: H3 se cierra con unit tests contra tu doble de repositorio, H4.S1 queda `A MEDIAS` con el spec escrito y el intento pegado | TODO |
| H1.S2.M3 | Arrancar la API y esperar por condición | Readiness 200 | `yarn start:dev` en una terminal; en otra `curl -s -o /dev/null -w "%{http_code}\n" http://localhost:<puerto>/<readiness>` (puerto: `main.ts`; ruta: `app-readiness.service.ts` / `app.controller.ts`) | Rojo al arrancar → pegá el log, probá `ORM_SCHEMA_SYNC=off`; si sigue, `ENVIRONMENT` y alternativa de M2 | TODO |
| H1.S2.M4 | Token `SECURITY_ADMIN` en variable de shell | `$TOKEN` no vacío | login (`grep -rn "@Post('login')" src/modules/iam`) → `export TOKEN=…` | Cuenta no existe → `yarn seed:boot`; si no, creá una por seed local, sintética declarada | TODO |
| H1.S2.M5 | Sistema y versión en borrador **de prueba** `ZZ-PRUEBA-…` | `versionId` | `POST /terminology/code-systems` + `POST :id/versions` → `evidencia/antes/sistema-prueba.json` | Exige `sourceId` → `GET` de fuentes y usá una; ninguna → creala por su DTO, nunca por SQL | TODO |
| H1.S2.M6 | `cinco.ndjson` sintético (5 conceptos `ZZ-`) importado **dos veces** | Dos JSON | `curl -H "Authorization: Bearer $TOKEN" -F file=@cinco.ndjson …/import-file` ×2 → `import-ndjson-1.json`, `-2.json`. **Anotá qué devuelve `skipped` la segunda vez** | — | TODO |
| H1.S2.M7 | NDJSON con 2 líneas rotas | JSON + `count(*)` | → `import-ndjson-malo.json`; `SELECT count(*) FROM terminology.catalog_concepts WHERE code_system_version_id='<id>'` antes/después. **Anotá si insertó las buenas: define Q-2 contra la realidad** | Sin `psql` → `docker compose exec postgres psql -U <user> -d <db> -c "…"` | TODO |
| H1.S2.M8 | `ok-50.csv` (de Marcelo si ya está; si no, hacelo vos con §4) importado **hoy**, antes de tocar | JSON | → `import-csv-antes.json` (esperable: todas las líneas con error JSON) | — | TODO |
| H1.S2.M9 | `PRACTITIONER` (si hay cuenta demo) y sin token contra el endpoint, hoy | Dos HTTP | → `evidencia/antes/authz-*.txt` | Sin cuenta `PRACTITIONER` → sólo «sin token»; anotá | TODO |

### H2 — Contrato de fila, detector de formato, parseador CSV y perfiles (código puro, publicado temprano)

**Prioridad:** `ALTA`

**CA:** Dado `src/modules/terminology/import/`, cuando Marcelo (parseador XLSX) o Pablo (integración) hacen
`git fetch` una hora después de tu arranque, entonces encuentran `row-contract.ts` con los tipos **literales**
de §1 del contrato; y al cerrar el hito, `detectarFormato`, `CsvParser`, `PERFILES_DE_IMPORTACION.conceptos`,
el `NdjsonParser` (el código que ya existía, movido) y el barrel `index.ts` existen con specs en verde, y el
servicio sigue pasando su caracterización.
**DoD:** push de `row-contract.ts` dentro de la primera hora (`git log origin/<rama> --format=%ci -- …/row-contract.ts`);
`yarn test src/modules/terminology/import` en verde; caracterización igual que el baseline.
**Estado:** TODO

#### H2.S1 — Caracterizar antes de mover

**CA:** Dado el servicio de hoy, cuando se corre su spec, entonces cubre: NDJSON bueno, línea rota, largo 256,
versión publicada → 412; y ese spec no cambia al terminar H3.
**DoD:** spec en verde, commiteado antes de tocar el servicio.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Si se traba | Estado |
|---|---|---|---|---|---|
| H2.S1.M1 | Leer 2 specs vecinos de `services/*.spec.ts` para copiar cómo doblan `EntityManager`, repositorios y `PinoLogger` | Rutas en `PLAN.md` | — | — | TODO |
| H2.S1.M2 | ¿Existe `concept-file-import.service.spec.ts`? Si no, escribirlo con 4 casos de caracterización (bueno ×5, línea rota, `code` de 256, versión publicada) **sin tocar el servicio** | 4 PASS | `yarn test …/concept-file-import` | — | TODO |
| H2.S1.M3 | Commit «test(terminology): caracterización del import por archivo» | Commit sólo con el spec | `git show --stat HEAD` | — | TODO |

#### H2.S2 — `row-contract.ts` publicado en la primera hora

**CA:** Dado §1 del contrato, cuando se lee `row-contract.ts`, entonces tiene **esos** tipos con **esos**
nombres, `FormatoNoAdmitidoError` y la firma de `detectarFormato` (la implementación llega en H2.S3; acá
puede lanzar «no implementado» con spec que lo dice). **Una vez publicado, no se renombra nada**: Marcelo
escribe el parseador XLSX contra este archivo.
**DoD:** `yarn typecheck` exit 0; push; spec mínimo en verde; línea con hora en tu daily.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Si se traba | Estado |
|---|---|---|---|---|---|
| H2.S2.M1 | Leer `concept-file-import.service.ts:1-80` para copiar forma (TSDoc en castellano con el porqué, constantes nombradas, errores con contexto) | 3 rasgos anotados en `PLAN.md` | — | — | TODO |
| H2.S2.M2 | `src/modules/terminology/import/row-contract.ts` con los tipos de §1 **literales**, TSDoc por tipo (1-based, encabezado = fila 1, los problemas nunca lanzan) | Compila | `yarn typecheck` | — | TODO |
| H2.S2.M3 | `row-contract.spec.ts`: `FormatoNoAdmitidoError` conserva `motivo` y es `instanceof Error`; un `FilaLeida` de ejemplo tipa | 2 PASS | `yarn test src/modules/terminology/import/row-contract` | — | TODO |
| H2.S2.M4 | `import/index.ts` exportando los tipos (lo demás se agrega después, **aditivo**) | Compila | `yarn typecheck` | — | TODO |
| H2.S2.M5 | Commit `feat(terminology/import): contrato de fila y parseador` y **push** | Visible en remoto dentro de la hora 1 | `git push -u origin itzan/carga-masiva-motor-2026-09-25 && git log origin/itzan/carga-masiva-motor-2026-09-25 -1 --format=%ci` | Sin permiso de push → `gh auth status`; si no hay forma, `git bundle create` y avisá en tu daily con la hora | TODO |
| H2.S2.M6 | Línea en tu daily: «contrato publicado a las HH:MM, SHA …» | Escrita | `Itzan-Daily-Noche-2026-09-25.md` §0 | — | TODO |

#### H2.S3 — Detector de formato por contenido

**CA:** Dado un `Buffer`, cuando se llama `detectarFormato`, entonces devuelve `xlsx` (empieza con
`PK\x03\x04` **y** el buffer contiene la cadena `xl/workbook.xml` — el directorio central del ZIP la trae en
texto plano, no hace falta descomprimir ni lib), `ndjson` (primera línea no vacía parsea como objeto JSON) o
`csv` (texto UTF-8, BOM tolerado, con `,` o `;` en la primera línea); y lanza `FormatoNoAdmitidoError` con
`motivo` legible para todo lo demás.
**DoD:** `format-detector.spec.ts` en verde con 8 casos.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Si se traba | Estado |
|---|---|---|---|---|---|
| H2.S3.M1 | `format-detector.ts` con la firma del contrato, sin dependencia | Compila | `yarn typecheck` | — | TODO |
| H2.S3.M2 | Spec: `ok-50.xlsx` (de Marcelo si ya está; si no, un XLSX mínimo creado con cualquier planilla, declarado) → `xlsx`; `cinco.ndjson` → `ndjson`; `ok-50.csv` → `csv`; `bom.csv` → `csv` | 4 PASS | `yarn test src/modules/terminology/import/format-detector` | — | TODO |
| H2.S3.M3 | Spec: `no-es-nada.pdf` (bytes `%PDF-1.4`) → lanza; buffer vacío → lanza; ZIP sin `xl/workbook.xml` (armado en el spec con `zlib` o un `PK\x03\x04` + basura) → lanza; texto sin separador → lanza; cada `motivo` distinto y legible | 4 PASS | idem | — | TODO |
| H2.S3.M4 | Spec: un `.csv` cuyo contenido es JSON por línea → `ndjson` (no hay extensión en un `Buffer`) | 1 PASS | idem | — | TODO |
| H2.S3.M5 | Exportar `detectarFormato` y `FormatoNoAdmitidoError` desde `index.ts` (aditivo) | Compila | `yarn typecheck` | — | TODO |

#### H2.S4 — Parseador CSV (sin dependencia, salvo evidencia en contra)

**CA:** Dado un CSV con encabezado, cuando se parsea, entonces las columnas se resuelven **por nombre y alias
del perfil** (insensible a mayúsculas y espacios), el separador se detecta entre `,` y `;` (el más frecuente
fuera de comillas en la primera línea; empate → `,`), comillas dobles con `""` como escape y saltos de línea
dentro de comillas se respetan, el BOM se tolera, y cada problema apunta a la fila lógica del archivo.
**DoD:** `csv-parser.spec.ts` en verde sobre los fixtures de §4.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Si se traba | Estado |
|---|---|---|---|---|---|
| H2.S4.M1 | `csv-parser.ts`: `class CsvParser implements ParseadorDeArchivo { formato = 'csv' }`, RFC 4180 propio, `numero` 1-based contando el encabezado | Compila | `yarn typecheck` | Si a los 30 min no pasa M3–M5: `yarn add csv-parse` con justificación en `docs/trabajo/2026-09-25-itzan-motor/decision-csv.md` (qué resuelve, tamaño, licencia, audit pegado) y envoltorio al mismo contrato. **Avisá a Marcelo**, que es dueño de `package.json` esta noche: el commit de la dependencia lo coordinás con él por el daily | TODO |
| H2.S4.M2 | Fixtures: ¿publicó Marcelo `test/fixtures/terminology-import/`? Si no, creá **en tu spec** (no en esa carpeta, que es suya) los casos de §4 como strings; cuando publique, el spec pasa a leer sus archivos | Decisión en `PLAN.md` | `git fetch && git ls-tree origin/marcelo/carga-masiva-xlsx-2026-09-25 test/fixtures/terminology-import/ 2>/dev/null` | — | TODO |
| H2.S4.M3 | Spec: `ok-50` → 50 filas, 0 problemas, `numero` de la primera = 2 | PASS | `yarn test …/csv-parser` | — | TODO |
| H2.S4.M4 | Spec: `bom`, `separador-punto-y-coma`, `unicode` → 3 filas cada uno, valores exactos | 3 PASS | idem | — | TODO |
| H2.S4.M5 | Spec: `comillas-y-saltos` → la `definition` con coma, comilla y salto **intacta**; `numero` sigue siendo el de la fila lógica (decisión en TSDoc) | PASS | idem | — | TODO |
| H2.S4.M6 | Spec: `columnas-desordenadas` → mismos `valores` que `ok`; `columna-desconocida` → 3 filas + 1 problema en fila 1 con `columna: 'extra'` | 2 PASS | idem | — | TODO |
| H2.S4.M7 | Spec: `sin-encabezado` → 0 filas + 1 problema fila 1; `vacio-solo-encabezado` → 0 filas, 0 problemas (que esté vacío lo decide el servicio → 422); `fila-vacia-al-final` → 3 filas | 3 PASS | idem | — | TODO |
| H2.S4.M8 | Spec: alias — encabezado `Código;Nombre;Descripción` resuelve a `code/display/definition` | PASS | idem | — | TODO |
| H2.S4.M9 | Spec: `con-errores` → 50 filas, 0 problemas **de lectura** (los 5 son de validación, H3.S1); los valores de las filas 5, 9, 14, 20 y 33 son los de §4 | PASS | idem | — | TODO |

#### H2.S5 — Perfiles, NDJSON detrás del contrato, provider y barrel

**CA:** Dado `PERFILES_DE_IMPORTACION.conceptos`, cuando el parseador CSV resuelve columnas, entonces usa
**ese** objeto (no una lista propia); dado `NdjsonParser`, cuando parsea, entonces produce `FilaLeida` con el
código que ya existía en el servicio; dado `import-parsers.provider.ts`, cuando el módulo arranca, entonces
inyecta `[ndjson, csv]` + `detectarFormato` + `PERFILES` (**XLSX lo agrega Pablo al integrar** desde la rama
de Marcelo: dejá el comentario en el barrel).
**DoD:** `import-profiles.spec.ts` en verde; specs de H2.S4 siguen verdes; la app arranca.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Si se traba | Estado |
|---|---|---|---|---|---|
| H2.S5.M1 | `import-profiles.ts` con `conceptos` exacto a la tabla de §1 y `ejemplo` sintético (`ZZ-000`, «Ejemplo sintético», «Fila de ejemplo de la plantilla») | Compila | `yarn typecheck` | — | TODO |
| H2.S5.M2 | El parseador CSV resuelve columnas **desde el perfil** (reemplaza cualquier lista escrita en H2.S4.M1) | Specs de H2.S4 siguen verdes | `yarn test src/modules/terminology/import` | — | TODO |
| H2.S5.M3 | Spec: alias insensibles a mayúsculas, tildes se conservan (`Código` = `código`), espacios laterales se recortan | 3 PASS | `yarn test …/import-profiles` | — | TODO |
| H2.S5.M4 | Perfil `designaciones` **sólo si** Marcelo publicó Q-9 = SÍ en su daily; columnas `code`, `language`, `use`, `value` con alias; si no, `DESCARTADO` con esa referencia | Perfil o `DESCARTADO` | `grep -n "designaciones" import-profiles.ts` | Marcelo no publicó → lo mirás vos en `dto/create-designation.dto.ts` (5 min, sólo lectura) y decidís | TODO |
| H2.S5.M5 | `NdjsonParser implements ParseadorDeArchivo` en `import/ndjson-parser.ts`: el código de líneas del servicio, movido tal cual, produciendo `FilaLeida { numero: nºlínea, valores }` | Caracterización sigue verde | `yarn test …/concept-file-import` | — | TODO |
| H2.S5.M6 | `index.ts` exporta `PARSEADORES_DE_IMPORTACION = [ndjson, csv]`, `detectarFormato`, `FormatoNoAdmitidoError`, `PERFILES_DE_IMPORTACION`, tipos; comentario: «XLSX se agrega al integrar (rama de Marcelo)» | Compila | `yarn typecheck` | — | TODO |
| H2.S5.M7 | `services/import-parsers.provider.ts` con token `IMPORT_PARSERS` que expone lo de `index.ts`; registrado en `terminology.module.ts` con el patrón de providers del módulo | La app arranca | `yarn build && yarn start:dev` → readiness 200 | — | TODO |
| H2.S5.M8 | `import/README.md` con la tabla índice como las carpetas vecinas | Existe | `ls src/modules/terminology/import/README.md` | — | TODO |
| H2.S5.M9 | Sin contenido de filas en ningún `logger`/`console` de la carpeta | `grep` vacío | `grep -rn "console\.\|logger\." src/modules/terminology/import/*.ts \| grep -v spec` → vacío | — | TODO |
| H2.S5.M10 | Commit + push (Marcelo y Pablo consumen `index.ts`) | Visible | `git log origin/<rama> -1` | — | TODO |

### H3 — El servicio ensanchado: validar, todo o nada, dry-run, omitir existentes, lote

**Prioridad:** `ALTA`

**CA:** Dado `importFromFile(versionId, buffer, user, { dryRun, profile })`, cuando se llama, entonces: detecta
el formato; parsea con el provider; valida cada fila (obligatoria vacía, largo > max, `code` repetido en el
archivo → problema con `fila`/`columna`/`motivo`); si hay ≥ 1 problema → `aborted: true`, `inserted: 0`, sin
lote; si `dryRun` → mismo informe + `preview` (20 filas válidas), sin escribir ni registrar; si no → escribe por
tandas de 500 omitiendo los `code` que ya existen (`skipped`), registra lote con `checksum`; y **ningún camino
devuelve 500**, ni loguea contenido.
**DoD:** spec unitario con doble de repositorio; `curl` real de cada camino + `count(*)`.
**Estado:** TODO

#### H3.S1 — Validación por fila

**CA:** Dado `FilaLeida[]` y el perfil, cuando se valida, entonces cada problema tiene `fila` (la del archivo),
`columna` y `motivo` en castellano accionable.
**DoD:** `row-validator.spec.ts` (archivo tuyo dentro de `services/`) en verde.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Si se traba | Estado |
|---|---|---|---|---|---|
| H3.S1.M1 | `validarFilas(filas, perfil): { validas: ConceptoLeido[]; problemas: ProblemaDeFila[] }` en `services/row-validator.ts` | Compila | `yarn typecheck` | — | TODO |
| H3.S1.M2 | Spec: `con-errores` (parseado por tu `CsvParser`) → exactamente 5 problemas en filas 5, 9, 14, 20, 33 con las columnas de §4 | PASS | `yarn test …/row-validator` | Fixture de Ender no está → construilo en el spec con §4 | TODO |
| H3.S1.M3 | Spec: `duplicado-en-archivo` → 1 problema en la segunda aparición, `columna: 'code'` | PASS | idem | — | TODO |
| H3.S1.M4 | Spec: motivos legibles («está vacía», «supera 255 caracteres», «repetido en la fila N») sin jerga | 3 PASS | idem | — | TODO |
| H3.S1.M5 | Spec: `definition` ausente no es problema; espacios laterales se recortan antes de validar | 2 PASS | idem | — | TODO |

#### H3.S2 — DTO y servicio

**CA:** Dado el DTO, cuando se ensancha, entonces todo campo previo conserva nombre y tipo, y los nuevos son
los de §2; dado el servicio, cuando se llama en cada camino, entonces se comporta como dice el CA del hito.
**DoD:** spec del servicio (caracterización + nuevos) en verde.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Si se traba | Estado |
|---|---|---|---|---|---|
| H3.S2.M1 | DTO: agregar `format`, `profile`, `dryRun`, `aborted`, `preview[]`, `errorSamples[].column?` con `@ApiProperty` como los vecinos; `batchId` pasa a `nullable: true` | Compila | `yarn typecheck` | — | TODO |
| H3.S2.M2 | Servicio: `detectarFormato` → elegir parseador por `formato` → `parsear(buffer, perfil)` → `validarFilas` | Caracterización sigue verde | `yarn test …/concept-file-import` | — | TODO |
| H3.S2.M3 | Todo o nada: ≥ 1 problema (de parseo o validación) → `aborted: true`, `inserted: 0`, `errors: N`, sin lote | Spec | idem | Si H1.S2.M7 mostró que hoy inserta las buenas: registrá el cambio de contrato en `decision-todo-o-nada.md` y en Q-2 del reporte | TODO |
| H3.S2.M4 | Dry-run: `preview` = primeras 20 filas válidas; **ni `persist`, ni `flush`, ni lote** (spec con doble que falla si se llama) | Spec | idem | — | TODO |
| H3.S2.M5 | Omitir existentes **por tanda**: una consulta por lote de hasta 500 códigos (`code IN (...)` sobre la versión), no una por fila; `skipped` los cuenta | Spec con doble que cuenta consultas | idem | — | TODO |
| H3.S2.M6 | Lote: `totalRead`, `totalInserted`, `totalErrors`, `checksum` (sha-256 del buffer, como hoy), `startedAt/finishedAt` | Spec | idem | — | TODO |
| H3.S2.M7 | Formato sin parseador (`xlsx` hasta que Pablo cablee el de Marcelo) → error del contrato `IMPORT_FORMAT_UNSUPPORTED` con `motivo`; archivo vacío o 0 filas → `IMPORT_EMPTY_FILE`; perfil desconocido → `IMPORT_PROFILE_UNKNOWN`; los tres en `error-codes.ts` con la forma de los vecinos | Spec ×3 | idem | — | TODO |
| H3.S2.M8 | Nunca 500: spec que pasa un buffer basura y verifica que la excepción es de las del contrato; spec que fuerza un `throw` dentro del parseador y verifica que sale como 422, no como `Error` crudo | 2 PASS | idem | — | TODO |
| H3.S2.M9 | Logs sin contenido: el logger recibe `{ batchId, format, profile, totalRead, inserted, skipped, errors }`; **nunca** `code`/`display`/`valores` | `grep` pegado + spec con logger doble | `grep -n "logger\." src/modules/terminology/services/concept-file-import.service.ts src/modules/terminology/services/row-validator.ts` | — | TODO |

#### H3.S3 — Controlador y `curl` reales

**CA:** Dado el endpoint, cuando recibe `dryRun` y `profile` como campos del multipart, entonces los valida
(`class-validator`, patrón del repo para multipart) y los pasa al servicio; y cada camino del CA del hito se
observa con `curl` contra la API real.
**DoD:** `evidencia/h3/*.json` + `count(*)` antes/después por camino.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Si se traba | Estado |
|---|---|---|---|---|---|
| H3.S3.M1 | Leer `payments-operations.controller.ts:115` (`settlements/import`) y `forms-values.controller.ts:39` para ver cómo reciben campos junto al archivo | Rutas en `PLAN.md` | — | — | TODO |
| H3.S3.M2 | `ImportConceptsFileBodyDto { dryRun?: 'true'\|'false'; profile?: 'conceptos'\|'designaciones' }` con `@IsOptional() @IsIn([...])`, `@ApiBody` ensanchado | Compila; `yarn build` | `yarn build` | — | TODO |
| H3.S3.M3 | HTTP 200 en dry-run / 201 real, con `@Res({ passthrough: true })` **sólo si el repo ya lo usa** (`grep -rn "passthrough" src/modules`) | Decisión anotada | `PLAN.md` | No se usa en el repo → 201 en ambos y **anotá la desviación** para Justin en tu daily | TODO |
| H3.S3.M4 | `curl` dry-run `ok-50.csv` → `totalRead: 50, errors: 0, batchId: null, preview` de 20; `count(*)` igual | 3 salidas | `evidencia/h3/dry-run-csv.json`, `count-antes.txt`, `count-despues.txt` | — | TODO |
| H3.S3.M5 | `curl` real `ok-50.csv` → `inserted: 50`; `count(*)` +50 | 2 salidas | `evidencia/h3/import-csv.json` | — | TODO |
| H3.S3.M6 | `curl` `con-errores.csv` → `aborted: true, errors: 5, inserted: 0`, `errorSamples[].column` presente; `count(*)` igual | 2 salidas | `evidencia/h3/import-errores.json` | — | TODO |
| H3.S3.M7 | `curl` `no-es-nada.pdf` → 422 `IMPORT_FORMAT_UNSUPPORTED`, sin stacktrace | Salida | `evidencia/h3/import-pdf.json` | — | TODO |
| H3.S3.M8 | `curl` `vacio-solo-encabezado.csv` → 422 `IMPORT_EMPTY_FILE`; `profile=otro` → 422 `IMPORT_PROFILE_UNKNOWN` | 2 salidas | `evidencia/h3/import-422.json` | — | TODO |
| H3.S3.M9 | `curl` `cinco.ndjson` → sigue funcionando igual que en H1.S2.M6 (comparar JSON campo a campo) | Diff sólo en campos nuevos | `evidencia/h3/ndjson-compat.diff` | — | TODO |

### H4 — Idempotencia contra Postgres y matriz de autorización

**Prioridad:** `ALTA`

**CA:** Dado el mismo archivo importado dos veces sobre la misma versión, cuando se prueba **contra Postgres
real**, entonces la segunda no inserta nada, cuenta `skipped: 50`, y hay dos lotes con el mismo `checksum`; y
ningún rol distinto de `SECURITY_ADMIN` pasa.
**DoD:** `yarn test:integration --testPathPattern terminology/import-file` en verde; matriz negativa en verde; `curl` ×2.
**Estado:** TODO

#### H4.S1 — Integración

**CA:** Dado el spec de integración, cuando corre con la base del compose, entonces pasa.
**DoD:** salida pegada.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Si se traba | Estado |
|---|---|---|---|---|---|
| H4.S1.M1 | ¿Hay índice único `(code_system_version_id, code)`? | Hallazgo con ruta | `grep -n "catalog_concepts" src/orm/catalog/indexes/terminology.idx.ts` → pegado | No hay → la omisión del servicio es la garantía; deuda del modelo anotada; **no** lo agregás | TODO |
| H4.S1.M2 | Leer 2 specs de `test/integration/**` (cómo levantan la app, obtienen `EntityManager`, limpian entre tests) | Rutas en `PLAN.md` | — | — | TODO |
| H4.S1.M3 | Spec: importar `ok-50.csv` ×2 → `50/0` luego `0/50`; `count(*)` = 50; 2 filas en `catalog_import_batches` con igual `checksum` | PASS | `yarn test:integration --testPathPattern terminology/import-file` → `evidencia/h4/integration.txt` | Docker caído → spec escrito, `A MEDIAS` «no ejecutado por `ENVIRONMENT`», intento pegado; **no mockear** | TODO |
| H4.S1.M4 | Spec: `con-errores.csv` → `aborted`, `count(*)` = 0, 0 lotes | PASS | idem | igual | TODO |
| H4.S1.M5 | Spec: dry-run → `count(*)` = 0, 0 lotes | PASS | idem | igual | TODO |
| H4.S1.M6 | Spec de carrera: dos importaciones del mismo archivo **concurrentes** (`Promise.all`) → `count(*)` = 50 al final (con índice único: una falla o ambas omiten; sin índice: documentá qué pasó y anotá el riesgo) | PASS o riesgo documentado | idem | — | TODO |
| H4.S1.M7 | `curl` real ×2 sobre versión nueva → segunda `inserted: 0, skipped: 50` | 2 salidas | `evidencia/h4/idem-1.json`, `-2.json` | — | TODO |
| H4.S1.M8 | Consultas de verificación (regla 97.7): conteo por versión, duplicados `(version, code)` = 0, `display` nulos = 0 | 3 salidas | `evidencia/h4/consultas.txt` | — | TODO |

#### H4.S2 — Autorización

**CA:** Dado el endpoint (y `import-template`), cuando lo llama sin token / `PRACTITIONER` / `PATIENT` /
`SECURITY_ADMIN`, entonces 401 / 403 / 403 / 2xx, y los negativos no escriben.
**DoD:** spec con los cuatro casos + `curl` de dos.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Si se traba | Estado |
|---|---|---|---|---|---|
| H4.S2.M1 | Cómo se prueban roles en el repo (`grep -rn "Roles(" test/ src/**/*.spec.ts \| head`) | Ruta del patrón | `PLAN.md` | — | TODO |
| H4.S2.M2 | Spec: sin token → 401 | PASS | según patrón | — | TODO |
| H4.S2.M3 | Spec: `PRACTITIONER` → 403; `PATIENT` → 403; `count(*)` sin cambio | 2 PASS | idem | — | TODO |
| H4.S2.M4 | Spec: `SECURITY_ADMIN` → 2xx | PASS | idem | — | TODO |
| H4.S2.M5 | Tenant ajeno: si terminología es por tenant (`grep -rn "tenant" src/modules/terminology/services/*.ts`), versión de otro tenant → 404/403 según patrón; si es global, `DESCARTADO` con esa evidencia | Spec o `DESCARTADO` | idem | — | TODO |
| H4.S2.M6 | `curl` sin token y `PRACTITIONER` | 2 HTTP | `evidencia/h4/authz-*.txt` | Sin cuenta `PRACTITIONER` demo → el spec alcanza, anotado | TODO |
| H4.S2.M7 | Rate limit heredado del global (`grep -rn "Throttle\|RateLimit" src/main.ts src/app.module.ts src/common`) — anotar; no agregar uno nuevo sin patrón | Hallazgo | `PLAN.md` | — | TODO |

### H5 — Plantilla por perfil

**Prioridad:** `ALTA`

**CA:** Dado `GET /terminology/import-template?profile=conceptos&format=csv|xlsx`, cuando se llama con
`SECURITY_ADMIN`, entonces descarga `plantilla-conceptos.<ext>` con fila 1 = columnas canónicas del perfil y
fila 2 = `ejemplo`; formato o perfil desconocidos → 422; y re-importar la plantilla en dry-run da 1 fila, 0 errores.
**DoD:** `curl -OJ` ×2 + `file` + re-import pegados; spec de autorización.
**Estado:** TODO

#### H5.S1 — Servicio y endpoint

**CA:** Dado `import-template.service.ts`, cuando genera CSV, entonces lo hace sin dependencia (dos líneas);
cuando genera XLSX, usa la lib **si está** en `package.json` (Marcelo la agrega); si no está, 422 «xlsx no
disponible» y se declara.
**DoD:** `import-template.service.spec.ts` en verde; `curl`.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Si se traba | Estado |
|---|---|---|---|---|---|
| H5.S1.M1 | Cómo devuelve archivos el repo (`grep -rn "StreamableFile\|Content-Disposition" src/modules \| head -5`) | Patrón en `PLAN.md` | — | Ninguno → `StreamableFile` verificado en `node_modules/@nestjs/common` | TODO |
| H5.S1.M2 | `import-template.service.ts`: `generar(profile, format): { buffer, contentType, filename }` desde tu `PERFILES_DE_IMPORTACION` (`import/index.ts`) | Compila | `yarn typecheck` | Lib XLSX no está en `package.json` (Marcelo no la agregó aún o la descartó) → `format=xlsx` → 422 con spec; **no la agregues vos** (es archivo de Marcelo) | TODO |
| H5.S1.M3 | Spec: CSV tiene 2 líneas, encabezado `code,display,definition`, ejemplo con `ZZ-000` | PASS | `yarn test …/import-template` | — | TODO |
| H5.S1.M4 | Spec: `format=pdf` → `IMPORT_FORMAT_UNSUPPORTED`; `profile=otro` → `IMPORT_PROFILE_UNKNOWN` | 2 PASS | idem | — | TODO |
| H5.S1.M5 | `@Get('import-template')` en el controlador (decidí el controlador por prefijo de ruta coherente y anotalo), `@Roles('SECURITY_ADMIN')`, `@ApiProduces`, `Content-Disposition` | `yarn build` | `yarn build` | — | TODO |
| H5.S1.M6 | `curl -H … -OJ "…/import-template?profile=conceptos&format=csv"` + `file plantilla-conceptos.csv` | Archivo + tipo | `evidencia/h5/plantilla.txt` | — | TODO |
| H5.S1.M7 | Re-importar la plantilla con `dryRun=true` → `totalRead: 1, errors: 0` | Salida | `evidencia/h5/reimport.json` | — | TODO |
| H5.S1.M8 | Spec de autorización del endpoint (sin token 401, `PRACTITIONER` 403) | 2 PASS | según patrón H4.S2 | — | TODO |

### H6 — OpenAPI y códigos de error

**Prioridad:** `ALTA`

**CA:** Dado el contrato de §2, cuando se regenera/valida OpenAPI, entonces `import-file` muestra `dryRun`,
`profile`, la respuesta ensanchada y los tres 422; `import-template` está; y no queda diff sin commitear.
**DoD:** comando del repo con exit 0; lint de OpenAPI sin errores nuevos.
**Estado:** TODO

#### H6.S1 — Especificación

**CA:** Dado `openapi/**`, cuando se lo lee, entonces coincide con el código.
**DoD:** salida del generador/lint pegada.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Si se traba | Estado |
|---|---|---|---|---|---|
| H6.S1.M1 | Cómo se genera/valida OpenAPI en el repo (`grep -n "openapi\|redocly" package.json`) | Comando en `PLAN.md` | — | — | TODO |
| H6.S1.M2 | Regenerar o editar siguiendo al vecino `import-file` existente | exit 0 | `yarn <script>; echo "exit=$?"` → `evidencia/h6/openapi.txt` | Si `openapi/` es fuente y no se genera: editar YAML a mano copiando la forma del vecino | TODO |
| H6.S1.M3 | Lint de OpenAPI sin errores nuevos respecto del baseline | Salida | idem | — | TODO |
| H6.S1.M4 | `error-codes.ts`: los tres `IMPORT_*` con descripción, en el mismo formato que los vecinos; documentados donde el repo documente códigos (`grep -rn "IMPORT_\|ERROR_CODES" docs/ \| head`) | Diff mínimo | `git diff src/common/errors/error-codes.ts` → sólo tres líneas nuevas | — | TODO |

### H7 — Regresión, PR mergeable y cierre honesto

**Prioridad:** `ALTA`

**CA:** Dado tu cambio, cuando se repite el baseline, entonces ningún rojo es nuevo; el PR está `MERGEABLE`; el
`REPORTE.md` abre con el avance y declara qué se cerró **contra el doble** de parseadores.
**DoD:** diffs, `gh` pegados, `head -3 REPORTE.md`.
**Estado:** TODO

#### H7.S1 — Regresión

**CA:** Dado el baseline, cuando se repite, entonces el diff no tiene rojos nuevos.
**DoD:** diff pegado.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Si se traba | Estado |
|---|---|---|---|---|---|
| H7.S1.M1 | `yarn lint && yarn typecheck && yarn build` | Sin rojos nuevos | diff contra baseline | — | TODO |
| H7.S1.M2 | `yarn test` completo, una vez | Sin rojos nuevos | `evidencia/h7/test.txt` | > 20 min → módulo + `common`, anotado | TODO |
| H7.S1.M3 | `yarn test:integration` completo | Sin rojos nuevos | `evidencia/h7/integration.txt` | Docker caído → `ENVIRONMENT` con intento pegado | TODO |
| H7.S1.M4 | Diff no toca archivos de Marcelo ni esquema | `grep` vacío | `git diff origin/dev --stat \| grep -E "xlsx-parser|fixtures/terminology-import|package.json|yarn.lock|entities|orm/"` → vacío | Aparece algo → revertir y pedir en el daily | TODO |

#### H7.S2 — PR y cierre

**CA:** Dado el PR, cuando se consulta con `gh`, entonces `MERGEABLE`, no draft, checks sin `fail`.
**DoD:** `evidencia/pr/`.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Si se traba | Estado |
|---|---|---|---|---|---|
| H7.S2.M1 | Rebase sobre `origin/dev` | Limpio | `git fetch && git rebase origin/dev && git status` | Conflicto → resolvelo | TODO |
| H7.S2.M2 | PR con plantilla (qué, por qué, cómo probar con los `curl` de H3/H4, evidencia, riesgo, **«XLSX: se cablea al integrar desde la rama de Marcelo»**) | URL | `gh pr create --base dev …` | `gh` sin auth → push + cuerpo en `evidencia/pr/body.md` | TODO |
| H7.S2.M3 | `gh pr view <n> --json number,url,isDraft,mergeable,mergeStateStatus,reviewDecision,baseRefName,headRefName` | `MERGEABLE` | `evidencia/pr/view.json` | `UNKNOWN` → bucle `until`; `BEHIND` → M1 | TODO |
| H7.S2.M4 | `gh pr checks <n> --watch --fail-fast` | Sin `fail` | `evidencia/pr/checks.txt` | Rojo → clasificar; `EXTERNAL` → `A MEDIAS` | TODO |
| H7.S2.M5 | Sección «Pendiente de integrar»: XLSX (rama de Marcelo) y qué caminos se verificaron sólo con NDJSON y CSV | Lista | `REPORTE.md` | — | TODO |
| H7.S2.M6 | Procesos corriendo (`start:dev`, `docker compose`) cerrados o declarados | Lista o «ninguno» | `docker compose ps` | — | TODO |
| H7.S2.M7 | `REPORTE.md` con `> **AVANCE: <HECHO> / 109 — <%>.**` primero, tres secciones, peldaño por área, sección de seguridad (amenaza / control / test / resultado / residual: rol, tamaño, logs, 500) | `head -3` | `head -3 docs/trabajo/2026-09-25-itzan-motor/REPORTE.md` | — | TODO |
| H7.S2.M8 | Daily `Itzan-Daily-Noche-2026-09-25.md` con §1.4, el avance y **la desviación 200/201 si la hubo** | Existe | `ls` | — | TODO |

## 5. Ambigüedades registradas

| ID | Ambigüedad | Supuesto con el que trabajás | Quién puede resolverla | Qué bloquea |
|---|---|---|---|---|
| Q-2 | Errores parciales | Todo o nada; si hoy inserta las buenas, cambio de contrato declarado | Pablo | H3.S2.M3 |
| Q-4 | Dónde persiste formato/perfil/dry-run | No persiste; respuesta | Dueño del modelo | H3.S2.M6 |
| Q-7 | `code` existente | `skipped`, nunca update | Pablo | H3.S2.M5 |
| Q-I1 | HTTP en dry-run: ¿200 o 201? | 200 si el repo ya usa `passthrough`; si no, 201 en ambos, **avisado a Justin** | Pablo | H3.S3.M3 |
| Q-I2 | Sin índice único, ¿la carrera entre dos subidas simultáneas puede duplicar? | Se prueba en H4.S1.M6; si duplica, riesgo residual declarado y deuda del modelo (índice) | Dueño del modelo | H4.S1.M6 |
| Q-I3 | ¿`preview` en respuesta real o sólo en dry-run? | En ambas (mismas 20 filas); barato y simplifica el front | Justin / Pablo | H3.S2.M4 |

## 6. Definition of Done del hito

- [ ] Todas sus microtareas en `HECHO`, o en `A MEDIAS`/`BLOQUEADO`/`DESCARTADO` **con las cuatro respuestas**.
- [ ] Salida literal de cada DoD en `evidencia/`.
- [ ] **Ningún cambio de esquema** ni archivo de Marcelo en el diff.
- [ ] Campos previos de la respuesta sin cambio de nombre ni tipo (compatibilidad).
- [ ] Idempotencia probada contra Postgres real (o `A MEDIAS` declarada por `ENVIRONMENT`, nunca mockeada para ponerla en verde).
- [ ] Matriz negativa de autorización en verde en los dos endpoints.
- [ ] Ningún contenido de fila en logs; ningún 500 posible con buffer basura.
- [ ] `row-contract.ts` pusheado en la hora 1 y nunca renombrado; XLSX declarado como pendiente de integrar.
- [ ] Baseline repetido sin rojos nuevos; PR `MERGEABLE` pegado; `REPORTE.md` con avance primero.

## 7. Cómo trabajás toda la noche sin nadie

1. **Checkpoint** por microtarea; nunca más de tres operaciones materiales sin uno.
2. **«Si se traba» se ejecuta ya.** Si no alcanza: `A MEDIAS` con las cuatro respuestas y seguís.
3. **No esperás a Marcelo.** `xlsx-parser.ts` es suyo y no lo importás: Pablo lo cablea en tu `index.ts` al integrar, para que tu PR sea mergeable solo. Vos publicás `row-contract.ts` en la hora 1: él escribe contra eso.
4. **Orden si aprieta:** H1 → H2.S1 → H2.S2 (**publicar**) → H2.S3 → H2.S4 → H2.S5 → H3 → H4.S1 → H4.S2 → H5 → H6 → H7.
5. **Un proceso de cada cosa.** `start:dev` y `test:integration` no corren a la vez.
6. `REPORTE.md` con el avance primero; tres secciones; procesos enumerados.
7. **Tu daily** es `Itzan-Daily-Noche-2026-09-25.md`, en la carpeta de arriba.

## 8. Revisión adversarial antes de cerrar

1. ¿Agregaste columna, tabla, índice o `@Property`? Es esquema: revertí y anotá.
2. ¿La idempotencia la probaste con el ORM mockeado y lo llamaste `TESTED`?
3. ¿El dry-run **de verdad** no escribe ni registra lote? ¿Pegaste el `count(*)` y el conteo de lotes?
4. ¿Renombraste `batchId`, `totalRead`, `inserted`, `skipped`, `errors` o `errorSamples[].line`?
5. ¿Hay un `logger` con `code`, `display` o una fila?
6. ¿Algún camino puede devolver 500 (buffer basura, `throw` en el parseador)?
7. ¿Importaste `xlsx-parser.ts` (archivo de Marcelo) o tocaste `package.json`/`yarn.lock`?
8. ¿Subiste `testTimeout`, agregaste `retry` o `skip`?
9. ¿Hay alguna microtarea en `BLOQUEADO` cuya columna «Si se traba» no ejecutaste?
10. ¿El PR dice `MERGEABLE` en un archivo, o lo estás recordando?
