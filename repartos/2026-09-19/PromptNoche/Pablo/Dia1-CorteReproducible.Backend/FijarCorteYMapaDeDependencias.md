# Fijar corte reproducible y mapa de dependencias del piloto

> **Rol:** habilitación de autonomía · **Línea:** A · **Día del plazo:** 1 · **Turno:** noche
> **Paquete fuente:** `BACKEND_AUTONOMO_MANTRA` · aplica [PROMPT_MAESTRO_BACKEND_AUTONOMO.md](../../../../../../../Downloads/BACKEND_AUTONOMO_MANTRA/BACKEND_AUTONOMO_MANTRA/PROMPT_MAESTRO_BACKEND_AUTONOMO.md)

## 0. Ficha de asignación

| Campo | Valor |
|---|---|
| `PROFILE` | `MANTRA_DEV` |
| `MODE` | `DIAGNOSE_DESIGN` — **no modificás el backend** |
| `WORKSPACE` | Checkout real de `mantra-core-health-api`. Si no lo tenés clonado, clonalo y registrá la ruta exacta. No inventar ruta. |
| `TARGET_REF` | Rama `dev`. SHA de referencia del paquete: `32ae939983f0d665e4ed371362858801134d35cd`. **Reconsultar y fijar el SHA actual**; si cambió, ese es tu corte. |
| `AUTHORIZED_BATCH` | Diagnóstico y documentos locales en `repartos/` y en el directorio de evidencia del lote. Cero escrituras en `src/` de Mantra. |
| `PROCESS_SOURCE` | `METAPROMPT_PARA_ASTRA(1).md` (síntesis). El registro funcional original **no está identificado**: eso es un hallazgo tuyo a registrar, no a resolver. |
| `ALLOWED_INFRA` | Lectura del repo, `git`, `yarn`, `node`. PostgreSQL y Docker: **verificar disponibilidad, no asumirla**. |
| `Escritura permitida` | Solo tu directorio de evidencia. Archivos compartidos del backend: reservados, nadie los toca esta noche. |

> ### ✅ Hechos ya verificados contra el corte — no los repitas
>
> Las afirmaciones técnicas de este prompt salían del paquete, que es **la lectura de otra persona**.
> El 2026-09-19 se contrastaron contra el repositorio real, leyendo el corte
> `32ae939983f0d665e4ed371362858801134d35cd`. El detalle con localizadores está en
> [`VERIFICACION-CONTRA-CODIGO-2026-09-19.md`](../../../../../docs/verificacion/VERIFICACION-CONTRA-CODIGO-2026-09-19.md).
>
> **Ya confirmado, no hace falta que lo rehagas:**
>
> - Las **5 rutas** citadas existen en el corte.
> - `SchedulingDelayService` → `src/modules/scheduling/services/scheduling-delay.service.ts`
> - `SchedulingAgendaNoticesService` → `src/modules/scheduling/services/scheduling-agenda-notices.service.ts`
> - `MessagingAgendaNoticeAdapter` → `src/modules/scheduling/adapters/messaging-agenda-notice.adapter.ts`
> - Las clases, con línea verificada: `SchedulingDelayService` (76),
>   `SchedulingAgendaNoticesService` (36), `MessagingAgendaNoticeAdapter` (117, y
>   **`implements AgendaNoticePort`**). Hay además un cuarto: `SupportAdminNoticeAdapter` (43).
> - **Los cuatro servicios/adaptadores ya tienen su `.spec.ts` al lado.** No empezás de cero:
>   empezá leyendo qué fijan esos tests.
> - `package.json` declara **112 scripts**. Los que te sirven: `typecheck`, `build`, `lint`, `test`,
>   `test:integration`, `test:e2e`, `smoke`, `infra:up`. `packageManager: yarn@4.14.1`.
> - `test:integration` fija **`ORM_SCHEMA_SYNC=off`**: el esquema no se sincroniza solo ahí.
>
> **El corte se movió:** `32ae939…` **es ancestro** del `HEAD` de `dev`, con **2 commits** de
> diferencia (`dev` = `5d5007f…`, 2026-09-19T21:33). Cuál de los dos es el corte de trabajo lo
> fija Pablo, no esta verificación.
>
> ⚠️ **Lo que esa verificación NO hizo: ejecutar.** No se corrió build, ni tests, ni arranque.
> **Que un símbolo exista no prueba que haga lo que su comentario promete.** Todo lo que sea
> comportamiento sigue siendo tuyo.
>
> 🔧 **Y una trampa de método, porque te va a pasar:** buscar con `git grep <SHA>` sobre un clon
> parcial (`--filter=blob:none`) en una ruta larga de Windows devolvió **`NOT_FOUND` para tres
> clases que sí existen**. El error real era `fatal: ... Filename too long`, y un `2>/dev/null` se
> lo comía. Usá `git cat-file -p <SHA>:<ruta>` y `git ls-tree -r --name-only <SHA>`.
> **Si tu búsqueda no encuentra algo, verificá primero que tu búsqueda funcione.**

## 1. Antes de escribir una línea — instalación OBLIGATORIA del estándar

> **Esta sección no es opcional y no es el final del día: es lo primero.** Un prompt ejecutado sin
> el estándar cargado produce trabajo que después hay que rehacer, porque no va a tener plan,
> ni evidencia, ni reporte. **Si no podés completar este paso, estás `BLOQUEADO`: avisalo y no sigas.**

### 1.1 Instalar el estándar en tu checkout

```bash
# 1. Clonar el estandar al lado del repo de producto
git clone https://github.com/PabloArauzCaballero/AlovidaPromptManager.git ../AlovidaPromptManager

# 2. Copiarlo DENTRO de tu checkout de trabajo (Claude Code solo carga desde ./.claude/)
cp -r ../AlovidaPromptManager/.claude   ./
cp    ../AlovidaPromptManager/AGENTS.md ./
cp -r ../AlovidaPromptManager/.agents   ./   # solo si tu herramienta no lee .claude/

# 3. Verificar que quedo instalado (pega esta salida en tu daily)
ls .claude/skills | wc -l        # -> 176
ls .claude/rules/*.md | wc -l    # -> 14
python .claude/hooks/plan_gate.py --self-test    # -> 11 PASS, 0 FAIL
```

**Si el `git clone` falla con 404:** el estándar todavía **no está publicado en GitHub** (el push
quedó bloqueado el 2026-09-19). Pedíselo a Pablo por copia directa y registralo como límite de
acceso. **Un 404 no demuestra que el repositorio no exista.**

**No commitees `.claude/` dentro del repo de producto sin acordarlo con el equipo.** Instalarlo en
tu checkout es tuyo; agregarlo al repo compartido es una decisión de todos.

### 1.2 Qué te instala eso

Dos candados que **bloquean de verdad** mientras trabajes con Claude Code:

| Candado | Qué impide |
|---|---|
| `plan_gate.py` | Escribir código sin `PLAN.md` en disco. Nunca bloquea `.md` ni nada bajo `docs/`, así que siempre podés crear el plan primero |
| `report_gate.py` | Cerrar la sesión con trabajo activo y sin `REPORTE.md`, o con un reporte al que le falta alguna de las tres secciones |

**En cualquier otra herramienta (Cursor, Codex, Copilot, Continue, Windsurf, Cline) los candados NO
corren.** El plan y el reporte siguen siendo igual de obligatorios; lo único que cambia es que nadie
te va a frenar. Ahí la disciplina la ponés vos y la controla quien revisa el PR.

### 1.3 Skills que tenés que CARGAR para este lote

Son **17**: 11 del proceso, que carga todo el equipo, y 6 propias de
*Fijar corte reproducible y mapa de dependencias*. Cargar = abrirlas y leerlas antes de empezar, no tenerlas en disco.

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
| `native-code-patterns` | copiar la forma del codigo vecino en vez de imponer una nueva |
| `windows-dev-environment` | los comandos que de verdad funcionan en esta maquina |
| `dependency-management` | distinguir version declarada, resuelta e instalada |
| `root-cause-debugging` | reproducir antes de diagnosticar cuando algo no arranca |
| `agent-resource-control` | un build, una suite, un navegador por vez |
| `technical-docs-and-adr` | dejar la decision registrada donde alguien la encuentre |

Entrá siempre por `skills-router`: **no leas el catálogo entero, no sirve.** El router mapea la
situación concreta ("voy a tocar un endpoint", "voy a diseñar una pantalla") a la skill que
corresponde, y fija la precedencia cuando dos se pisan.

### 1.4 DoD de esta sección — se verifica como cualquier otra

- [ ] `ls .claude/skills | wc -l` devolvió **176**, y la salida está pegada en tu daily.
- [ ] `python .claude/hooks/plan_gate.py --self-test` devolvió **11 PASS, 0 FAIL**, salida pegada.
- [ ] Leíste `skills-router` y las 17 skills de las dos tablas.
- [ ] Creaste tu `PLAN.md` **antes** del primer `Edit`/`Write` de código.

**Sin estas cuatro casillas, tu lote arranca en `BLOQUEADO`, no en `EN CURSO`.**

## 2. Resultado observable

Al cerrar tu turno, cualquiera del equipo puede abrir un solo archivo y saber: **qué commit exacto estamos atacando, qué está realmente instalado y corriendo, y qué dependencia concreta bloquea el piloto de avisos de agenda** — sin volver a clonar ni re-explorar.

**Kill-test (lo más barato que demuestra que NO está hecho):** pedile a Itzan el SHA del corte y el motivo por el que `SchedulingModule` arrastra `MessagingModule`. Si tiene que abrir GitHub para responder, no está hecho.

## 3. Alcance

**IN:** fijar corte, verificar stack instalado vs. lockfile, localizar los archivos y servicios del piloto, mapa de dependencias acotado al piloto, registro de evidencia, registro de límites de acceso.

**OUT:** editar cualquier archivo de Mantra · proponer refactors · inventario enciclopédico del backend entero · ejecutar la suite completa · decidir la semántica del contrato (es de Ender) · armar la composición aislada (es de Itzan).

## 4. Plan

### Hito H1 — El corte y el bloqueo del piloto están fijados y son reproducibles por otro

*Se le puede mostrar a cualquiera del equipo: "este es el commit, este es el stack real, y esta es la dependencia que impide entregar la capacidad de avisos sin mensajería".*

**CA del hito:** Dado el documento de corte que dejás, cuando otra persona lo sigue desde cero en otra máquina, entonces llega al mismo SHA, al mismo inventario de versiones instaladas y a la misma lista de dependencias bloqueantes, sin consultarte.

---

#### Subtarea S1.1 — Corte fijado (riesgo más alto: todo lo demás cuelga de acá)

| # | Microtarea | Criterio de aceptación | Definition of Done |
|---|---|---|---|
| M1 | Fijar el SHA actual de `dev` en `mantra-core-health-api` | El SHA registrado corresponde al `HEAD` de `dev` en el momento de la consulta, con fecha y hora de la consulta anotadas | Salida literal de `git rev-parse HEAD` y `git log -1 --format='%H %cI %s'` pegada en el registro |
| M2 | Registrar el estado del árbol de trabajo | Está declarado si el árbol está limpio o si hay cambios locales, y cuáles | Salida literal de `git status --porcelain=v1 -b` pegada. Si hay cambios ajenos, se **preservan**, no se descartan |
| M3 | Registrar si el SHA del paquete sigue siendo alcanzable y qué cambió desde él | Está declarado si `32ae939…` es ancestro del `HEAD` actual, y el conteo de commits de diferencia | Salida de `git merge-base --is-ancestor 32ae939983f0d665e4ed371362858801134d35cd HEAD; echo $?` y de `git rev-list --count 32ae939..HEAD` pegadas |
| M4 | Registrar el resultado de consultar los dos repos que el perfil reporta en 404 | Para docs y modelo canónico queda anotado el error exacto, la referencia consultada y el efecto sobre la trazabilidad | Salida literal del error pegada. **Un 404 no demuestra inexistencia**: se registra como límite de acceso, no como "no existe" |

#### Subtarea S1.2 — Stack real, no declarado

| # | Microtarea | Criterio de aceptación | Definition of Done |
|---|---|---|---|
| M5 | Distinguir versión declarada, resuelta en lockfile e **instalada** para Nest, TypeScript, MikroORM y Jest | Para cada uno de los cuatro hay tres valores, y donde difieren está señalado | Tabla con la salida de `yarn info <pkg> --json` o equivalente, y de leer `node_modules/<pkg>/package.json`. Si `node_modules` no existe, el valor instalado es `NOT_INSTALLED`, no la del lockfile |
| M6 | Registrar el runtime real: versión de Node y de Yarn en uso | Los valores corresponden a lo que ejecuta esta máquina, no a `engines` del `package.json` | `node -v` y `yarn -v` con salida pegada |
| M7 | Registrar qué comandos de verificación **existen realmente** en `package.json` | Está la lista literal de `scripts` disponibles, y marcado cuál sirve para typecheck, cuál para unit y cuál para integración | Bloque `scripts` de `package.json` pegado tal cual. Los comandos de los anexos del paquete son **especificaciones**, no comandos instalados: no inventar uno que no esté |
| M8 | Registrar disponibilidad de PostgreSQL y Docker para pruebas | Está declarado si hay un PostgreSQL alcanzable y si Docker responde, con el error exacto si no | Salida de la comprobación pegada. Si no hay, el estado es `BLOCKED` con motivo — **nunca `PASS`** |

#### Subtarea S1.3 — Mapa de dependencias acotado al piloto

| # | Microtarea | Criterio de aceptación | Definition of Done |
|---|---|---|---|
| M9 | Localizar en el árbol real las rutas de `SchedulingDelayService`, `SchedulingAgendaNoticesService` y `MessagingAgendaNoticeAdapter` | Cada uno tiene ruta real verificada en el checkout, o está marcado `NOT_FOUND` con el patrón de búsqueda usado | Salida del grep/búsqueda pegada con las rutas. **No dar por buena una ruta que no abriste** |
| M10 | Enumerar qué importa `src/modules/scheduling/scheduling.module.ts` | Está la lista literal de imports del módulo y, para cada uno, si es dependencia de tipos, de arranque, de persistencia o solo de composición | Bloque de imports pegado + clasificación. La clasificación es hipótesis hasta la prueba de ausencia de Itzan: marcarla `HYPOTHESIS` |
| M11 | Registrar qué hace `src/orm/config/orm.config.ts` con el descubrimiento de entidades | Está declarado si las entidades se descubren por glob global, si usa `TsMorphMetadataProvider`, si hay caché de metadata y si registra `HistoryMirrorSubscriber` | Fragmentos literales del archivo pegados. **Los conteos escritos en comentarios del código no se adoptan como inventario medido** |
| M12 | Registrar la tensión de semántica del aviso detectada en el puerto | Queda escrito, sin resolverla, que el comentario del puerto permite descartar un aviso fallido mientras el metaprompt exige durabilidad para efectos obligatorios | Cita literal del comentario del puerto + cita del metaprompt, ambas con localizador. Estado: `DECISION_REQUIRED`. **No elegir una de las dos** |
| M13 | Entregar la tabla de unidades entregables del lote | Cada fila tiene capacidad, dependencia que bloquea, mecanismo mínimo propuesto, riesgo y prueba de salida | Tabla completa en el documento de corte, sin filas con "TBD" sin dueño ni fecha |

## 5. Ambigüedades registradas — **no las resuelvas, anotalas**

| ID | Ambigüedad | Quién puede resolverla | Qué bloquea |
|---|---|---|---|
| Q-01 | El paquete se fecha el **20 de septiembre de 2026** y hoy es **19 de septiembre de 2026**. La fecha del encargo está un día adelante de hoy. | Quien encargó el paquete | Nada técnico; afecta a qué "Día 1" significa. Registrar, no corregir por cuenta propia |
| Q-02 | `CURRENT_DAY` del plazo original no está verificado | Coordinación | El plan de seis días asume Día 1..6 sin fechas nuevas |
| Q-03 | `TEAM_CAPACITY` en horas netas no está calculado | Coordinación | Compromiso de alcance. Desconocido **se conserva desconocido** |
| Q-04 | El registro funcional original no está identificado; solo hay la síntesis del metaprompt | Quien tenga el documento aprobado | La aceptación documental integral (C1). La habilitación técnica **puede continuar** |

## 6. Definition of Done del hito

- [ ] Las 13 microtareas están en `HECHO` o en `BLOCKED` con motivo y salida del error.
- [ ] Todo estado de verificación es `PASS`/`FAIL`/`NOT_RUN`/`BLOCKED`. **No hay un solo `PASS` sin comando y exit code pegados.**
- [ ] El registro de evidencia separa `REQUIREMENT_APPROVED`, `IMPLEMENTED_CONTRACT`, `TARGET_CONTRACT`, `VERIFIED_BEHAVIOR` e `HYPOTHESIS`.
- [ ] Ninguna afirmación del documento excede lo que ejecutaste. Repasá el cierre del prompt maestro: *"¿algún éxito declarado depende de algo que no ejecutaste?"*
- [ ] Avance reportado como `microtareas HECHO / 13`, no como porcentaje a ojo.

## 7. Handoff

Al cerrar, avisá por el daily a:
- **Ender** → rutas reales del puerto y del adaptador (M9), y la tensión de semántica (M12).
- **Itzan** → imports de `scheduling.module.ts` (M10) y comportamiento del ORM (M11).
- **Marcelo y Justin** → comandos de verificación que existen de verdad (M7) y disponibilidad de PostgreSQL/Docker (M8).

Si un bloqueo se confirma, **no itere sobre él**: registrá la causa y pasá a la siguiente microtarea independiente.
