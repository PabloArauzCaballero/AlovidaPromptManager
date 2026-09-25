# Integrar los cuatro carriles de la carga masiva: cambiar el doble por los parseadores reales, correr el kill-test del contrato de punta a punta, y dejar dos PR mergeables

> **Rol:** integrador y dueño del contrato · **Fecha:** 2026-09-25 · **Turno:** noche · **Modo:** autónomo; arranca cuando los carriles empiezan a publicar, y cierra el turno
> **Contrato compartido:** [`CONTRATO-CARGA-MASIVA.md`](../../CONTRATO-CARGA-MASIVA.md) — **es tuyo**: §5 (decisiones Q-1…Q-9), §6 (cómo se integra), §7 (kill-test).
> **Daily de equipo:** [`Daily-Noche-2026-09-25.md`](../../Daily-Noche-2026-09-25.md)
> **5 hitos · 9 subtareas · 59 microtareas**, con CA, DoD y columna «Si se traba».
>
> **Tu carril no espera a que los cuatro terminen.** Integrás **lo que haya** cada vez que alguien publica, en
> una rama de integración por repo, y corrés el kill-test parcial contra lo integrado. Si un carril no llega
> en toda la noche, su parte queda `A MEDIAS` declarada y **el resto se entrega igual**: el motor con NDJSON + CSV
> reales es entregable aunque falte el XLSX de Marcelo; la pantalla contra el simulador es entregable. Vos sos
> además quien **resuelve las ambigüedades** que los cuatro registraron con supuesto: las confirmás o las
> cambiás **en el contrato**, no en el chat.

## 0. Ficha de asignación

| Campo | Valor |
|---|---|
| `REPOS` | `alovida/mantra-core-health-api` y `alovida/mantra-core-health` |
| `TARGET_REF` | API: `origin/dev`. Front: **`origin/mockup`** (regla de Pablo: todo cambio de frontend termina en PR a `mockup`). Ramas de integración `pablo/carga-masiva-integracion-api-2026-09-25` y `pablo/carga-masiva-integracion-front-2026-09-25` desde `origin/dev`, en worktrees limpios |
| `RAMAS QUE INTEGRÁS` | API: `itzan/carga-masiva-motor-2026-09-25` → `marcelo/carga-masiva-xlsx-2026-09-25`. Front: `justin/carga-masiva-pantalla-2026-09-25` → `marcelo/carga-masiva-calidad-2026-09-25` |
| `ARCHIVOS RESERVADOS PARA VOS` | `docs/trabajo/2026-09-25-pablo-integracion/**` en los dos repos · `src/modules/terminology/import/index.ts` **sólo al integrar** (dos líneas: `export { XlsxParser }` y el array de parseadores), después de que Itzan y Marcelo pushearon (secuencial: ya no lo tocan) · resolución de conflictos de merge (mínima, declarada por archivo) |
| `ARCHIVOS DE OTROS — NO LOS TOQUES` | Todo lo demás. Un defecto encontrado al integrar se **reporta** al dueño (línea en su daily + `defectos.md`); si el dueño ya cerró el turno y el defecto bloquea la entrega, la corrección **mínima** la hacés vos en la rama de integración, en un commit propio que lo dice, y queda en el reporte como desvío |
| `⚠️ RIESGO ALTO` | Itzan y Marcelo comparten la carpeta `import/`: Itzan todo menos `xlsx-parser*`; Marcelo sólo `xlsx-parser*` y, por cherry-pick, `row-contract.ts` (idéntico). Dos ramas del front tocan `terminology.handlers.ts`? No: sólo Justin. Los archivos son disjuntos por diseño; **si un merge muestra conflicto, alguien salió de su alcance**: se anota quién y se resuelve conservando al dueño del archivo |
| `LÍMITE DE RECURSOS` | Regla 70: **un** `start:dev`, **un** `ng serve`, **un** navegador, una suite. La regresión conjunta es serial |

## 1. Antes de escribir una línea — instalación OBLIGATORIA del estándar

> **Esta sección no es opcional y no es el final del día: es lo primero.** Un prompt ejecutado sin
> el estándar cargado produce trabajo que después hay que rehacer, porque no va a tener plan, ni
> evidencia, ni reporte. **Si no podés completar este paso, estás `BLOQUEADO`: avisalo y no sigas.**

### 1.1 Instalar el estándar en los DOS checkouts de integración

```bash
# 1. Clonar el estandar al lado de los repos de producto (una sola vez)
git clone https://github.com/PabloArauzCaballero/AlovidaPromptManager.git ../AlovidaPromptManager

# 2. Copiarlo DENTRO de cada checkout de trabajo (Claude Code solo carga desde ./.claude/)
cp -r ../AlovidaPromptManager/.claude   ./
cp    ../AlovidaPromptManager/AGENTS.md ./
cp -r ../AlovidaPromptManager/.agents   ./   # solo si tu herramienta no lee .claude/

# 3. Verificar que quedo instalado (pega esta salida en tu daily, una por repo)
ls .claude/skills | wc -l            # -> 178 (o más)
ls .claude/rules/[0-9]*.md | wc -l   # -> 15  (mas el README, que no es una regla)
python .claude/hooks/plan_gate.py --self-test    # -> 11 PASS, 0 FAIL
```

⚠️ **Antes de `cp -r`, mirá qué hay:** los dos repos **ya tienen** `.claude/`. Fusioná, no pises.

### 1.2 Qué te instala eso

| Candado | Qué impide |
|---|---|
| `plan_gate.py` | Escribir código sin `PLAN.md` en disco. Nunca bloquea `.md` ni nada bajo `docs/` |
| `report_gate.py` | Cerrar la sesión con trabajo activo y sin `REPORTE.md`, o sin sus tres secciones |
| `blocker_gate.py` | Cerrar con microtareas en `BLOQUEADO` o `EN CURSO` sin declarar la simulación de los tres niveles del contrato (regla 65) |

**En cualquier otra herramienta los candados NO corren.**

### 1.3 Skills que tenés que CARGAR para este lote

Son **21**: 11 del proceso y 10 propias de la integración.

**Del proceso — obligatorias para todos:**

| Skill | Para qué |
|---|---|
| `skills-router` | la entrada al catalogo: mapea la situacion concreta a la skill que toca |
| `factual-discovery` | confirmar el sistema real antes de planificar |
| `milestone-planning` | descomponer en hitos, subtareas y microtareas con CA y DoD |
| `anti-hallucination-guard` | localizar lo existente antes de crear |
| `evidence-and-verification` | que podes afirmar con que evidencia; el peldaño del trabajo es el más bajo de sus áreas |
| `scope-discipline` | al integrar, la tentación de «arreglar de paso» es máxima |
| `rationalization-guard` | «el conflicto lo resuelve quien mergee» está prohibido: sos vos |
| `context-thrift` | leer por rangos y busqueda |
| `progress-reporting` | checkpoints por microtarea |
| `finish-your-turn` | como se cierra un turno sin dejar nada colgado |
| `work-report-md` | el reporte consolidado |

**De tu lote:**

| Skill | Para qué |
|---|---|
| `pr-mergeable-gate` | **la más importante de tu lote**: `gh pr view` + `gh pr checks` pegados por PR, `UNKNOWN` se re-consulta |
| `github-pull-requests` | forma de los dos PR de integración; PRs apilados si los individuales siguen abiertos |
| `github-multirepo-coordination` | orden de merge y despliegue entre API y front (la API va primero: el front nuevo contra la API vieja da 422 en `dryRun`) |
| `git-workflow-multirepo` | worktrees, ramas de integración, resolución de conflictos conservando al dueño |
| `regression-suite-management` | qué corre en la regresión conjunta, en qué orden, serial |
| `requirements-and-acceptance` | resolver Q-1…Q-9 como decisiones registradas, no como charla |
| `release-and-rollback` | qué pasa si se mergea la API y no el front (compatible: los campos nuevos son aditivos) |
| `qa-orchestration` | juntar la evidencia de Marcelo con la de los otros tres en un solo veredicto |
| `agent-resource-control` | un proceso de cada cosa durante la regresión conjunta |
| `technical-docs-and-adr` | el ADR corto de «carga masiva por perfil + sistema + versión» (Q-1) si Pablo-cliente lo confirma |

Entrá siempre por `skills-router`: **no leas el catálogo entero, no sirve.**

### 1.4 DoD de esta sección — se verifica como cualquier otra

- [ ] `ls .claude/skills | wc -l` devolvió **178 o más** en los dos repos, salidas pegadas en tu daily.
- [ ] `python .claude/hooks/plan_gate.py --self-test` devolvió **11 PASS, 0 FAIL** en los dos, salida pegada.
- [ ] Leíste `skills-router` y las 21 skills, **empezando por `pr-mergeable-gate`**.
- [ ] Creaste tu `PLAN.md` en cada repo **antes** del primer `Edit`/`Write` de código.

**Sin estas cuatro casillas, tu lote arranca en `BLOQUEADO`, no en `EN CURSO`.**

> ### ✅ Hechos ya verificados contra el árbol
>
> | Dónde | Qué hay | Qué significa para vos |
> |---|---|---|
> | API `feat/admin-portal-catalog` (`f2dcecd8`) | Rama actual del checkout, con `dev` traído | **No integrás ahí**: `origin/dev` es la base |
> | Front `ender/simulador-cabecera-2026-09-22` | Cambios sin commitear de Ender del 22/09 | **No lo toques**; worktree limpio |
> | `terminology-versions.controller.ts:108` | `import-file` NDJSON existente | Compatibilidad: los campos nuevos de la respuesta son aditivos (§2); el front viejo sigue funcionando contra la API nueva |
> | §6 del contrato | Orden API: Itzan → Marcelo (xlsx); front: Justin → Marcelo; cableado de `XlsxParser` en `index.ts` | Tu H3 |
> | `alovida/CREDENCIALES-DEMO.md:20` | Cuenta `SECURITY_ADMIN` | Para el kill-test; **no copies la contraseña** |
>
> ⚠️ **Lo que la verificación NO hizo: ejecutar.**

## 2. Resultado observable

| Hito | Prioridad | Qué queda demostrado |
|---|---|---|
| **H1** | `BLOQUEANTE` | Worktrees de integración, baseline de los dos repos, Postgres y API arrancan desde `dev`; tabla de decisiones Q-1…Q-9 confirmada o cambiada **en el contrato**. |
| **H2** | `ALTA` | Integración incremental: cada rama pusheada se mergea en cuanto aparece (al cerrar cada microtarea, `git fetch`), con `lint`/`typecheck`/`build` después de cada merge. |
| **H3** | `ALTA` | `XlsxParser` de Marcelo cableado en el `index.ts` de Itzan (dos líneas); suite de terminología + integración en verde con los tres parseadores; `curl` XLSX real. |
| **H4** | `ALTA` | Kill-test del contrato (§7) de punta a punta contra API real + pantalla real, con capturas; regresión conjunta serial en los dos repos; E2E de Marcelo `[API real]`. |
| **H5** | `ALTA` | Dos PR de integración a `dev` (o los individuales, si alcanzan) `MERGEABLE` demostrado; reporte consolidado con el avance de los cinco y el peldaño del trabajo (el más bajo de las áreas). |

> Orden: **H1 → H2 (en bucle mientras publican) → H3 → H4 → H5.** Si a las 3 h de turno nadie publicó nada,
> H1 ya está y seguís con la parte de H4 que se pueda contra `dev` (baseline del kill-test: hoy falla en todo,
> pegado) — es evidencia del «antes», no tiempo perdido.

**Kill-test del turno:** el de §7 del contrato, entero, contra lo integrado, con capturas en `evidencia/h4/`.
Y `gh pr view` de cada PR entregado con `mergeable: MERGEABLE` en un archivo.

## 3. Alcance

**IN:** worktrees y baseline · decisiones Q-1…Q-9 escritas en el contrato · merges incrementales · reemplazo
del provider · regresión conjunta · kill-test §7 · PR de integración (o individuales) mergeables · reporte
consolidado · dailies de equipo actualizados (avance de los cinco).

**OUT:** implementar cualquier parte de un carril que no llegó (se declara `A MEDIAS` con el dueño) · arreglar
defectos ajenos salvo corrección mínima declarada cuando el dueño cerró y bloquea la entrega · cambiar el
contrato desde el código · esquema · mergear a `dev` con checks en rojo o con admin.

## 4. Plan — hitos, subtareas y microtareas

Estados: `TODO` · `EN CURSO` · `HECHO` · `A MEDIAS` · `BLOQUEADO` · `DESCARTADO`. La columna «Si se traba» **se ejecuta, no se agenda.**

### H1 — Base de integración y decisiones

**Prioridad:** `BLOQUEANTE`

**CA:** Dado el turno, cuando arranca, entonces hay dos worktrees de integración desde `origin/dev` con
baseline, la API arranca desde `dev`, y las nueve ambigüedades tienen decisión escrita en el contrato.
**DoD:** `evidencia/antes/` ×2; commit en el contrato.
**Estado:** TODO

#### H1.S1 — Worktrees y baseline

**CA:** Dado un rojo posterior, cuando alguien pregunta si lo trajo un merge, entonces el baseline de `dev` lo dice.
**DoD:** salidas con exit code.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Si se traba | Estado |
|---|---|---|---|---|---|
| H1.S1.M1 | Worktree API desde `origin/dev` + rama de integración | SHA | `git worktree add ../mch-api-integracion origin/dev && cd … && git checkout -b pablo/carga-masiva-integracion-api-2026-09-25 && git rev-parse HEAD` | — | TODO |
| H1.S1.M2 | Worktree front desde **`origin/mockup`** + rama de integración | SHA | `git worktree add ../mch-front-integracion origin/mockup && cd … && git checkout -b pablo/carga-masiva-integracion-front-2026-09-25 && git rev-parse HEAD` | — | TODO |
| H1.S1.M3 | `yarn install` ×2 | exit 0 ×2 | → `evidencia/antes/install-*.txt` | Red → un reintento; declarar | TODO |
| H1.S1.M4 | Baseline API: `lint`, `typecheck`, `build`, `test src/modules/terminology` | 4 exit codes | → `evidencia/antes/api-baseline.txt` | Rojo previo → clasificar | TODO |
| H1.S1.M5 | Baseline front: `lint`, `typecheck`, spec `version-import` | 3 exit codes | → `evidencia/antes/front-baseline.txt` | ídem | TODO |
| H1.S1.M6 | Postgres + API desde `dev` arrancan; token admin en variable | Readiness 200 | `docker compose up -d postgres postgres-init`; `yarn start:dev`; `curl` readiness | Docker no está → `ENVIRONMENT`; la integración se cierra con unit + lo que Marcelo corra contra el simulador, declarado | TODO |
| H1.S1.M7 | Kill-test §7 contra `dev` **hoy** (esperable: falla en el primer paso) → «antes» | Salida | `evidencia/antes/kill-test-dev.md` | — | TODO |

#### H1.S2 — Decisiones Q-1…Q-9

**CA:** Dado §5 del contrato, cuando se lo lee al cerrar H1, entonces cada fila dice `CONFIRMADA` o
`CAMBIADA A …` con tu firma y hora, y los cambios (si hay) están avisados en el daily del carril afectado.
**DoD:** commit en `CONTRATO-CARGA-MASIVA.md`.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Si se traba | Estado |
|---|---|---|---|---|---|
| H1.S2.M1 | Q-1 (perfil + sistema + versión): confirmar con la lista de seeds como evidencia | Fila | contrato §5 | — | TODO |
| H1.S2.M2 | Q-2 (todo o nada), Q-7 (omitir, no actualizar), Q-8 (validar antes desde UI): confirmar o cambiar | 3 filas | contrato §5 | Cambio → aviso en el daily de Itzan y Justin **antes** de que lleguen a esas microtareas (mirá sus planes) | TODO |
| H1.S2.M3 | Q-3, Q-4, Q-5, Q-6: confirmar | 4 filas | contrato §5 | — | TODO |
| H1.S2.M4 | Q-9: leer la resolución de Marcelo (hora 1) y confirmar si `designaciones` entra o queda `DESCARTADO` para todos | Fila | contrato §5 | Marcelo no publicó → decidí vos con `create-designation.dto.ts` (5 min) y anotalo | TODO |
| H1.S2.M5 | Commit + push del contrato | Visible | `git log -1 -- repartos/2026-09-25/PromptNoche/CONTRATO-CARGA-MASIVA.md` | — | TODO |

### H2 — Integración incremental

**Prioridad:** `ALTA`

**CA:** Dada una rama de carril pusheada, cuando se detecta (al cerrar cada microtarea propia, `git fetch`),
entonces se mergea en la rama de integración de su repo, se corre `lint`/`typecheck`/`build` y se anota el SHA
integrado; un conflicto se resuelve conservando al dueño del archivo y se anota quién salió de su alcance.
**DoD:** tabla de integración con SHA, hora, resultado por rama.
**Estado:** TODO

#### H2.S1 — API: Itzan, después Marcelo (rama `marcelo/carga-masiva-xlsx-2026-09-25`)

**CA:** Dado el merge de cada rama, cuando se compila, entonces exit 0; y ningún archivo fue tocado por dos ramas.
**DoD:** salidas + `git log --merges`.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Si se traba | Estado |
|---|---|---|---|---|---|
| H2.S1.M1 | Detectar la rama de Itzan | SHA o «no aún» | `git fetch && git log origin/itzan/carga-masiva-motor-2026-09-25 -1` | No aún → seguir; volver al cerrar la próxima microtarea | TODO |
| H2.S1.M2 | Merge Itzan → integración; `lint`/`typecheck`/`build`; `test src/modules/terminology` | exit 0 | `git merge --no-ff origin/itzan/carga-masiva-motor-2026-09-25 && yarn lint && yarn typecheck && yarn build && yarn test src/modules/terminology` → `evidencia/h2/itzan.txt` | Conflicto → resolver conservando al dueño; rojo → clasificar y reportar a Itzan | TODO |
| H2.S1.M3 | Verificar archivos tocados por Itzan contra su alcance | Lista dentro del alcance | `git diff origin/dev...origin/itzan/carga-masiva-motor-2026-09-25 --stat` → comparar con contrato §0 | Fuera de alcance → anotar en `defectos.md` y en su daily | TODO |
| H2.S1.M4 | Detectar la rama `marcelo/carga-masiva-xlsx-2026-09-25` | SHA o «no aún» | `git fetch && git log origin/marcelo/carga-masiva-xlsx-2026-09-25 -1` | No aún → seguir; la entrega sin XLSX es válida | TODO |
| H2.S1.M5 | Merge Marcelo (xlsx) → integración; `lint`/`typecheck`/`build`; `test src/modules/terminology/import` | exit 0 | → `evidencia/h2/marcelo-xlsx.txt` | Conflicto en `row-contract.ts` → conservar el de Itzan (deben ser idénticos) | TODO |
| H2.S1.M6 | Verificar alcance de Marcelo (API): sólo `xlsx-parser*`, fixtures, `package.json`, `yarn.lock`, docs | Lista | `git diff origin/dev...origin/marcelo/carga-masiva-xlsx-2026-09-25 --stat` | Fuera → anotar | TODO |
| H2.S1.M7 | Re-integrar si un carril pushea más commits después (repetir M2/M5 con el SHA nuevo) | Tabla actualizada | `evidencia/h2/integracion.md` | — | TODO |

#### H2.S2 — Front: Justin, después Marcelo

**CA:** Ídem para el front.
**DoD:** salidas + tabla.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Si se traba | Estado |
|---|---|---|---|---|---|
| H2.S2.M1 | Detectar la rama de Justin | SHA o «no aún» | `git fetch && git log origin/justin/carga-masiva-pantalla-2026-09-25 -1` | No aún → seguir | TODO |
| H2.S2.M2 | Merge Justin → integración; `lint`/`typecheck`; spec `version-import` y `terminology.client` | exit 0 | → `evidencia/h2/justin.txt` | Conflicto/rojo → conservar dueño, clasificar, reportar | TODO |
| H2.S2.M3 | Verificar alcance de Justin | Lista | `git diff origin/dev...origin/justin/… --stat` | Fuera → anotar | TODO |
| H2.S2.M4 | Detectar la rama de Marcelo | SHA o «no aún» | análogo | análogo | TODO |
| H2.S2.M5 | Merge Marcelo → integración; `typecheck` (incluye `playwright/tsconfig.json`) | exit 0 | → `evidencia/h2/marcelo.txt` | análogo | TODO |
| H2.S2.M6 | Verificar alcance de Marcelo | Lista | análogo | análogo | TODO |
| H2.S2.M7 | Re-integrar commits posteriores | Tabla | `evidencia/h2/integracion.md` | — | TODO |

### H3 — Cablear el parseador XLSX de Marcelo en el barrel de Itzan y verificar los parseadores reales

**Prioridad:** `ALTA`

**CA:** Dadas las ramas de Itzan (`import/**` con contrato, detector, CSV, perfiles, NDJSON, provider) y de
Marcelo (`xlsx-parser.ts` + fixtures + dependencia) integradas, cuando `index.ts` exporta también
`XlsxParser` y `PARSEADORES_DE_IMPORTACION` pasa a `[ndjson, csv, xlsx]`, entonces el servicio importa XLSX
real y toda la suite de terminología + integración está en verde.
**DoD:** diff de `index.ts` de dos líneas; `yarn test src/modules/terminology` y `yarn test:integration --testPathPattern terminology` en verde; `curl` XLSX real.
**Estado:** TODO

#### H3.S1 — El cableado

**CA:** Dado `index.ts`, cuando se agrega el export, entonces sólo cambia ese archivo y el módulo sigue arrancando.
**DoD:** `git show --stat` con un archivo; readiness 200.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Si se traba | Estado |
|---|---|---|---|---|---|
| H3.S1.M1 | Confirmar que ambas ramas están integradas y que `xlsx-parser.ts` compila contra el `row-contract.ts` de Itzan (si Marcelo lo cherry-pickeó, el merge es limpio; si lo escribió a mano, conservá el de Itzan y verificá que sean idénticos) | Tabla nombre a nombre | `git diff origin/itzan/carga-masiva-motor-2026-09-25 origin/marcelo/carga-masiva-xlsx-2026-09-25 -- src/modules/terminology/import/row-contract.ts` → vacío | Difieren → **el contrato manda**: conservá el de Itzan, reportá a Marcelo, adaptá el parseador con el cambio mínimo declarado si ya cerró. Falta la rama de Marcelo → H3 `A MEDIAS`: la entrega es NDJSON + CSV, y el detector devuelve 422 para xlsx (declarado) | TODO |
| H3.S1.M2 | `index.ts`: `export { XlsxParser } from './xlsx-parser'` y `PARSEADORES_DE_IMPORTACION = [ndjson, csv, xlsx]`; quitar el comentario «XLSX se agrega al integrar» | Compila | `yarn typecheck && yarn build` | Tipos incompatibles → error literal pegado; reportar al dueño; cambio mínimo declarado si cerró | TODO |
| H3.S1.M3 | `yarn test src/modules/terminology` | Verde | `evidencia/h3/test.txt` | Rojo → clasificar; `TEST_BUG` ajeno → reportar; ajuste mínimo declarado si cerró | TODO |
| H3.S1.M4 | `yarn test:integration --testPathPattern terminology` | Verde | `evidencia/h3/integration.txt` | Docker caído → `ENVIRONMENT` | TODO |
| H3.S1.M5 | `curl` real: `ok-50.xlsx` con `dryRun` → `format: 'xlsx'`, 50 leídas; `con-errores.xlsx` → `aborted`, 5 errores con columna | 2 JSON | `evidencia/h3/reales.json` | XLSX descartado por Marcelo → 422 pegado | TODO |
| H3.S1.M6 | Commit «chore(terminology/import): parseador XLSX en el barrel» | Un archivo en el diff | `git show --stat HEAD` | — | TODO |

### H4 — Kill-test del contrato y regresión conjunta

**Prioridad:** `ALTA`

**CA:** Dado lo integrado en los dos repos, cuando se corre §7 de punta a punta (API real + pantalla real),
entonces cada paso da lo que dice, con captura; y la regresión conjunta serial no tiene rojos nuevos.
**DoD:** `evidencia/h4/kill-test.md` con capturas; salidas de regresión.
**Estado:** TODO

#### H4.S1 — Kill-test

**CA:** Dado §7, cuando se ejecuta a mano y con el E2E de Marcelo `[API real]`, entonces ambos pasan.
**DoD:** salidas + capturas.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Si se traba | Estado |
|---|---|---|---|---|---|
| H4.S1.M1 | API integrada arrancada; front integrado con `yarn start:real-api` | Readiness 200; 4200 sirve | `evidencia/h4/arranque.txt` | Un lado no está → kill-test parcial (sólo API con `curl`, o sólo front contra simulador), declarado | TODO |
| H4.S1.M2 | Pasos 1–4 de §7 a mano (perfil, sistema, versión, `ok-50.csv`, validar, informe, base sin cambio) con captura | Observado | `kill-test.md` + capturas | — | TODO |
| H4.S1.M3 | Pasos 5–8 (importar, resumen 50, otro, mismo archivo → 0/50) | Observado | ídem | — | TODO |
| H4.S1.M4 | Pasos 9–11 (`con-errores.xlsx` → 5 errores con columna, importar deshabilitado; `no-es-nada.pdf` → 422 legible) | Observado | ídem | — | TODO |
| H4.S1.M5 | Pasos 12–13 (`curl` sin token → 401; `PRACTITIONER` → 403) | 2 HTTP | ídem | Sin cuenta `PRACTITIONER` → sólo 401, anotado | TODO |
| H4.S1.M6 | E2E de Marcelo contra API real | Verde `[API real]` | `E2E_BACKEND=real yarn pw playwright/carga-masiva.spec.ts --workers=1 --trace on` → `evidencia/h4/e2e-real.txt` | Rojo → clasificar y reportar al dueño; corrección mínima declarada si cerró | TODO |
| H4.S1.M7 | Consola y red durante el kill-test | 0 errores o lista | `evidencia/h4/consola-red.txt` | — | TODO |

#### H4.S2 — Regresión conjunta, serial

**CA:** Dado el baseline de H1, cuando se repite sobre lo integrado, entonces no hay rojos nuevos.
**DoD:** diffs pegados.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Si se traba | Estado |
|---|---|---|---|---|---|
| H4.S2.M1 | API: `lint`, `typecheck`, `build`, `test` completo | Sin rojos nuevos | `evidencia/h4/api-regresion.txt` | > 20 min → módulos `terminology` + `common`, anotado | TODO |
| H4.S2.M2 | API: `test:integration` completo | Sin rojos nuevos | `evidencia/h4/api-integration.txt` | Docker → `ENVIRONMENT` | TODO |
| H4.S2.M3 | Front: `lint`, `typecheck`, `test` completo | Sin rojos nuevos | `evidencia/h4/front-regresion.txt` | — | TODO |
| H4.S2.M4 | Front: `pw:rutas --workers=1`, `pw:accesos --workers=1`, `npx ng test --include=src/app/core/mock/mock-backend.spec.ts --watch=false`, `playwright/mockup-barrido.spec.ts --workers=1`, `playwright/mockup-click-sweep.spec.ts --workers=1`, luego `carga-masiva.spec.ts` (todo en serie) | Sin rojos nuevos | `evidencia/h4/front-pw.txt` | — | TODO |
| H4.S2.M5 | Cada rojo nuevo clasificado (80.4) y con dueño | Tabla | `defectos.md` | — | TODO |
| H4.S2.M6 | Doble revisión de Marcelo leída: ninguna pantalla `RECHAZADA` se entrega; si hay, queda `A MEDIAS` con el hallazgo | Veredicto | `REPORTE.md` | — | TODO |

### H5 — PR mergeables y reporte consolidado

**Prioridad:** `ALTA`

**CA:** Dada la entrega, cuando se consulta `gh` por cada PR entregado, entonces `MERGEABLE`, no draft, checks
sin `fail`; y el reporte consolidado dice, para los cinco carriles, HECHO/total, peldaño y qué quedó `A MEDIAS`
con dueño.
**DoD:** `evidencia/pr/`; `head -3 REPORTE.md`; daily de equipo actualizado.
**Estado:** TODO

#### H5.S1 — Los PR

**CA:** Dados los PR individuales (si todos están `MERGEABLE` y disjuntos, se mergean en orden a `dev` y no hace
falta PR de integración salvo el commit del provider), o el PR de integración por repo (si alguno no llegó o
hubo ajustes), cuando se consulta con `gh`, entonces cumplen la condición de la regla 35.2.
**DoD:** salidas literales.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Si se traba | Estado |
|---|---|---|---|---|---|
| H5.S1.M1 | Decidir la forma: individuales + PR chico del provider, **o** PR de integración por repo; anotar por qué | Decisión en `PLAN.md` | — | — | TODO |
| H5.S1.M2 | Rebase de cada rama a entregar sobre `origin/dev` | Limpio | `git rebase origin/dev && git status` | Conflicto → resolver conservando dueño | TODO |
| H5.S1.M3 | Abrir/actualizar PR API con plantilla; en «cómo probar», el kill-test | URL | `gh pr create --base dev …` | `gh` sin auth → push + `evidencia/pr/api-body.md` | TODO |
| H5.S1.M4 | Abrir/actualizar PR front **a `mockup`** (`gh pr create --base mockup …`); en la descripción, «funciona contra el simulador; verificado además contra la API real de `dev` en local» | URL | análogo | análogo | TODO |
| H5.S1.M5 | `gh pr view <n> --json number,url,isDraft,mergeable,mergeStateStatus,reviewDecision,baseRefName,headRefName` por cada PR entregado | `MERGEABLE` | `evidencia/pr/*-view.json` | `UNKNOWN` → bucle `until`; `BEHIND` → M2; `DIRTY` → resolver | TODO |
| H5.S1.M6 | `gh pr checks <n> --watch --fail-fast` por cada PR | Sin `fail` | `evidencia/pr/*-checks.txt` | Rojo → clasificar; `EXTERNAL` → `A MEDIAS`; **nunca** admin ni deshabilitar checks | TODO |
| H5.S1.M7 | Tras mergear la API (si te toca), **re-consultar** el PR del front | `MERGEABLE` otra vez | `evidencia/pr/front-view-2.json` | `BEHIND` → actualizar y repetir | TODO |

#### H5.S2 — Cierre consolidado

**CA:** Dado el `REPORTE.md` de integración, cuando se lee la primera línea, entonces está el avance
**consolidado** (`suma HECHO / suma total` de los cinco) y por carril; y ninguna palabra es más fuerte que la
evidencia del carril más bajo.
**DoD:** `head -3`; daily de equipo con la tabla de cierre llena.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Si se traba | Estado |
|---|---|---|---|---|---|
| H5.S2.M1 | Leer los cinco `REPORTE.md` (o dailies si alguno no cerró) y llenar la tabla de cierre del daily de equipo: HECHO/total, peldaño, PR, contra el doble | Tabla | `Daily-Noche-2026-09-25.md` §4 | Un carril sin reporte → «sin reporte al cierre» en su fila, nunca inventar su avance | TODO |
| H5.S2.M2 | Peldaño del trabajo = el más bajo de las áreas (regla 30.5), justificado | Línea | `REPORTE.md` | — | TODO |
| H5.S2.M3 | «Contra el doble» consolidado: qué quedó verificado sólo contra simulador/doble y qué contra real | Lista | `REPORTE.md` | — | TODO |
| H5.S2.M4 | Desvíos: correcciones mínimas que hiciste en ramas ajenas, con commit y motivo | Lista o «ninguna» | `REPORTE.md` | — | TODO |
| H5.S2.M5 | Procesos corriendo (API, `ng serve`, compose, navegadores) cerrados o declarados | Lista | `docker compose ps`; `Get-Process node` | — | TODO |
| H5.S2.M6 | `REPORTE.md` con `> **AVANCE: <HECHO> / 59 — <%>.**` (el tuyo) **y** en la segunda línea el consolidado de los cinco; tres secciones; enlaces a los cinco reportes | `head -3` | `head -3 docs/trabajo/2026-09-25-pablo-integracion/REPORTE.md` | — | TODO |
| H5.S2.M7 | Daily `Pablo-Daily-Noche-2026-09-25.md` con §1.4 y la tabla de integración | Existe | `ls` | — | TODO |

## 5. Ambigüedades registradas

| ID | Ambigüedad | Supuesto con el que trabajás | Quién puede resolverla | Qué bloquea |
|---|---|---|---|---|
| Q-1…Q-9 | Las del contrato §5 | Se confirman o cambian en H1.S2, **en el contrato** | Vos (como cliente) | H1.S2 |
| Q-P1 | ¿PR individuales o de integración? | Individuales si todos llegan `MERGEABLE` y disjuntos (+ PR chico del provider); de integración si no | Vos | H5.S1.M1 |
| Q-P2 | Un carril no llega en toda la noche | Su parte `A MEDIAS` con dueño; el resto se entrega; NDJSON + CSV de Itzan **es** la entrega del motor si el XLSX de Marcelo no llegó | Vos | H3 |
| Q-P3 | Corrección mínima en rama ajena cuando el dueño cerró y bloquea la entrega | Se hace, en commit propio que lo dice, y va a «Desvíos» | Vos | H2/H3/H4 |
| Q-P4 | ¿A qué base va cada PR? | API a `dev`; **front a `mockup`** (regla de Pablo: todo cambio de frontend termina en PR a `mockup`, mergeable y sin regresiones). El front contra `mockup` corre con el simulador, así que no depende del merge de la API; la verificación contra API real es local (`start:real-api`) | Vos | H5.S1.M4 |

## 6. Definition of Done del hito

- [ ] Todas sus microtareas en `HECHO`, o en `A MEDIAS`/`BLOQUEADO`/`DESCARTADO` **con las cuatro respuestas**.
- [ ] Decisiones Q-1…Q-9 escritas en el contrato con hora.
- [ ] Cada merge con `lint`/`typecheck`/`build` pegado y verificación de alcance por rama.
- [ ] Provider reemplazado con un solo archivo en el diff (o `A MEDIAS` declarado si faltó una rama).
- [ ] Kill-test §7 con capturas; E2E `[API real]` o declarado por qué no.
- [ ] Regresión conjunta serial sin rojos nuevos en los dos repos.
- [ ] Ninguna pantalla `RECHAZADA` entregada.
- [ ] PR entregados con `gh pr view` y `gh pr checks` pegados; API a `dev`, front a `mockup`.
- [ ] Reporte consolidado con el avance de los cinco y el peldaño más bajo; daily de equipo con la tabla llena.

## 7. Cómo trabajás toda la noche sin nadie

1. **Integrás lo que hay, cuando hay.** `git fetch` al cerrar cada microtarea propia; nunca un bucle ciego.
2. **Checkpoint** por microtarea; nunca más de tres operaciones materiales sin uno.
3. **«Si se traba» se ejecuta ya.** Un carril que no llega no bloquea: `A MEDIAS` con dueño y se entrega el resto.
4. **Los defectos ajenos se reportan.** Corrección mínima sólo si el dueño cerró **y** bloquea la entrega, en commit propio que lo dice.
5. **El contrato manda.** Un nombre que difiere se adapta con un alias en el provider y se anota quién se desvió.
6. **Un proceso de cada cosa.** La regresión conjunta es serial: API entera, después front entero.
7. `REPORTE.md` con el avance primero (el tuyo y el consolidado); tres secciones; procesos enumerados.
8. **Tu daily** es `Pablo-Daily-Noche-2026-09-25.md`, en la carpeta de arriba.

## 8. Revisión adversarial antes de cerrar

1. ¿Arreglaste algo en una rama ajena sin commit propio que lo diga y sin línea en «Desvíos»?
2. ¿Cambiaste el contrato desde el código en vez de en el archivo?
3. ¿`index.ts` quedó con el comentario «XLSX se agrega al integrar» y sin el export de `XlsxParser`?
4. ¿Mergeaste con un check en rojo o con admin? ¿El PR del front va a `mockup` y no a `dev`?
5. ¿El avance consolidado lo calculaste de los reportes, o lo estimaste?
6. ¿Declaraste el peldaño del trabajo por el área más alta en vez de la más baja?
7. ¿Entregaste una pantalla que Marcelo marcó `RECHAZADA`?
8. ¿Inventaste el avance de un carril que no cerró reporte?
9. ¿Hay alguna microtarea en `BLOQUEADO` cuya columna «Si se traba» no ejecutaste?
10. ¿El PR dice `MERGEABLE` en un archivo, o lo estás recordando?
