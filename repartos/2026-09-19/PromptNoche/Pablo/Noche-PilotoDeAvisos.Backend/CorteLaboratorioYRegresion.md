# Corte, laboratorio del piloto y regresión de aislamiento

> **Rol:** habilitación de autonomía · **Línea:** A · **Fecha:** 2026-09-19 · **Turno:** noche
> **Paquete fuente:** `BACKEND_AUTONOMO_MANTRA` · **Requisitos del cliente:** [`REQUISITOS-CLIENTE-ALOVIDA.md`](../../../../../docs/requisitos/REQUISITOS-CLIENTE-ALOVIDA.md)
> **6 hitos · 18 subtareas · 53 microtareas**, todas con criterio de aceptación y Definition of Done.

## 0. Ficha de asignación

| Campo | Valor |
|---|---|
| `PROFILE` | `MANTRA_DEV` |
| `WORKSPACE` | Checkout real de `mantra-core-health-api`. Registrá la ruta exacta. No inventar ruta |
| `TARGET_REF` | `32ae939983f0d665e4ed371362858801134d35cd`. **Reconsultá y fijá el actual**; si cambió, ese es tu corte y lo declarás |
| `AUTHORIZED_BATCH` | Tu directorio de evidencia. **Cero escrituras en `src/` de Mantra** salvo donde un hito lo autorice explícitamente |
| `PROCESS_SOURCE` | `METAPROMPT_PARA_ASTRA(1).md` (síntesis) + los requisitos del cliente |
| `ALLOWED_INFRA` | Lectura del repo, `git`, `yarn`, `node`. PostgreSQL y Docker: **verificar, no asumir** |

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

Son **29**: 11 del proceso, que carga todo el equipo, y 18 propias de
*Corte, laboratorio del piloto y regresión de aislamiento*. Cargar = abrirlas y leerlas antes de empezar, no tenerlas en disco.

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
| `test-data-management` | datos deterministas, aislados y limpiables |
| `synthetic-test-data-generation` | generar volumen sin usar datos reales |
| `unit-testing` | un comportamiento por test |
| `edge-case-data-catalog` | los casos borde que no se te ocurren solos |
| `solid-principles` | abstraer con un segundo uso real, no antes |
| `component-architecture-solid` | fronteras que aguantan el segundo caso |
| `technical-debt-management` | qué deuda se acepta a conciencia |
| `refactoring-safely` | cambiar sin romper, y cómo se demuestra |
| `scope-discipline` | lo que encontrás roto fuera de alcance se anota |
| `regression-suite-management` | qué se vuelve a correr después de tocar |
| `e2e-failure-triage` | clasificar el rojo antes de tocar |
| `incident-response-postmortem` | qué se aprende de lo que salió mal |

Entrá siempre por `skills-router`: **no leas el catálogo entero, no sirve.** El router mapea la
situación concreta ("voy a tocar un endpoint", "voy a diseñar una pantalla") a la skill que
corresponde, y fija la precedencia cuando dos se pisan.

### 1.4 DoD de esta sección — se verifica como cualquier otra

- [ ] `ls .claude/skills | wc -l` devolvió **176**, y la salida está pegada en tu daily.
- [ ] `python .claude/hooks/plan_gate.py --self-test` devolvió **11 PASS, 0 FAIL**, salida pegada.
- [ ] Leíste `skills-router` y las 29 skills de las dos tablas.
- [ ] Creaste tu `PLAN.md` **antes** del primer `Edit`/`Write` de código.

**Sin estas cuatro casillas, tu lote arranca en `BLOQUEADO`, no en `EN CURSO`.**

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

## 2. Resultado observable

Al cerrar el turno, estos son los seis resultados que alguien tiene que poder **ver**, en este orden de dependencia:

| Hito | Prioridad | Qué queda demostrado |
|---|---|---|
| **H1** | `BLOQUEANTE` | Al cerrar tu turno, cualquiera del equipo puede abrir un solo archivo y saber: **qué commit exacto estamos atacando, qué está realmente instalado y corriendo, y qué dependencia concreta bloquea el piloto de avisos de agenda** — sin volver a clonar ni re-explorar. |
| **H2** | `ALTA` | Existe un laboratorio que corre la capacidad elegida contra PostgreSQL real, con reset entre casos y reloj controlado, y que **falla** cuando alguien lo usa mal. |
| **H3** | `MEDIA` | Hay una segunda capacidad candidata elegida con criterio escrito, y una lista explícita de qué mecanismo del piloto se reusa **porque ya se demostró** y cuál no se reusa. |
| **H4** | `MEDIA` | Las dependencias que **H2** dejó nombradas están corregidas o declaradas imposibles de corregir en el plazo, ordenadas por cuánto trabajo libera cada una. |
| **H5** | `ALTA` | La regresión de aislamiento pasa sobre la versión actual, y cualquier contraejemplo guardado se reproduce con las mismas versiones, seed, reloj y estado. |
| **H6** | `ALTA` | Los fallos que la regresión de **H5** dejó en rojo están reparados con cambio mínimo y **re-verificados**, o declarados como no reparables en el plazo con su impacto. |

> ⚠️ **Esto es más de lo que entra en una noche, y está dicho a propósito.** El alcance se entrega completo y ordenado por dependencia: se cierra lo que se pueda, y **lo que no se cierra queda `A MEDIAS` con qué anda, qué no anda y qué falta exactamente** (regla 20). Recortar alcance es una decisión de coordinación, no tuya, y se registra.

**Kill-test del turno completo:** pedile a Itzan el SHA del corte y el motivo por el que `SchedulingModule` arrastra `MessagingModule`. Si tiene que abrir GitHub para responder, no está hecho.

## 3. Alcance

**IN:** fijar corte, verificar stack instalado vs. lockfile, localizar los archivos y servicios del piloto, mapa de dependencias acotado al piloto, registro de evidencia, registro de límites de acceso · harness de la capacidad · reset completo entre casos · reloj y destinatario reproducibles · validador de forma y semántica · registro de solicitudes · los checks L1–L7 del generador · criterio de elección de la segunda capacidad · inventario de mecanismos del piloto con su evidencia · cuáles se reusan y cuáles no · costo estimado por rango · qué dependencias libera · priorización de las dependencias residuales por trabajo que liberan · corrección acotada de las elegidas · reejecución de la prueba de ausencia sobre lo corregido · registro de las no corregidas · regresión de aislamiento sobre la versión actual · replay de contraejemplos guardados · fijación de versiones, seed, reloj y estado · registro de lo que cambió respecto de la corrida anterior · reparación acotada de los rojos priorizados · reejecución de lo afectado por cada reparación · actualización del peldaño por área · lista de lo no reparado con su impacto.

**OUT:** editar cualquier archivo de Mantra · proponer refactors · inventario enciclopédico del backend entero · ejecutar la suite completa · decidir la semántica del contrato (es de Ender) · armar la composición aislada (es de Itzan) · tocar `src/` de Mantra · la prueba de ausencia (es de Itzan hoy) · decidir semántica del contrato (Ender) · declarar la capacidad verificada: el laboratorio **habilita** la verificación, no la sustituye · construir la segunda capacidad hoy · **crear una plataforma o framework genérico** · crear abstracciones sin un segundo uso real · tocar el piloto para «generalizarlo» · refactorizar lo que se vea feo de paso · corregir todas las residuales sin priorizar · declarar corregido sin reejecutar · heredar la evidencia de **H2** para código nuevo · paralelizar la suite para ir más rápido en la máquina de desarrollo · subir timeouts sin demostrar la causa · `skip` de un test que molesta · declarar verde una suite que no ejercita lo que tocaste · refactorizar de paso · reparar todo sin priorizar · **atribuirle a la versión reparada la evidencia de la anterior** · cerrar con algo en `EN CURSO`.

## 4. Plan — hitos, subtareas y microtareas

Los seis estados permitidos son exactamente: `TODO`, `EN CURSO`, `HECHO`, `A MEDIAS`, `BLOQUEADO` y `DESCARTADO`. **`A MEDIAS` es legítimo; disfrazarlo de `HECHO` no.** Una microtarea cuyo DoD no se ejecutó nunca es `HECHO`, aunque el código esté escrito.

### H1 — Fijar corte reproducible y mapa de dependencias del piloto

**Prioridad:** `BLOQUEANTE`

**CA:** Dado que nadie del equipo sabe todavía contra qué commit trabaja, cuando cualquiera lee tu documento de corte, entonces llega al mismo SHA, al mismo inventario de versiones instaladas y a la misma lista de dependencias bloqueantes, en otra máquina y sin consultarte.

**DoD:** Las 13 microtareas en `HECHO` o `BLOCKED` con su salida. El SHA publicado al equipo antes de cualquier otra cosa: **cuatro personas están esperando ese dato**.

**Kill-test del hito:** pedile a Itzan el SHA del corte y el motivo por el que `SchedulingModule` arrastra `MessagingModule`. Si tiene que abrir GitHub para responder, no está hecho.

**Estado:** TODO

#### H1.S1 — Corte fijado (riesgo más alto: todo lo demás cuelga de acá)

**CA:** Dado el repositorio, cuando otra persona sigue tu registro, entonces obtiene el mismo SHA, el mismo estado del árbol y la misma relación con el SHA del paquete.

**DoD:** Las 4 microtareas en `HECHO`, con la salida literal de `git rev-parse`, `git status --porcelain=v1 -b`, `git merge-base --is-ancestor` y `git rev-list --count` pegada.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H1.S1.M1 | Fijar el SHA actual de `dev` en `mantra-core-health-api` | El SHA registrado corresponde al `HEAD` de `dev` en el momento de la consulta, con fecha y hora de la consulta anotadas | Salida literal de `git rev-parse HEAD` y `git log -1 --format='%H %cI %s'` pegada en el registro | TODO |
| H1.S1.M2 | Registrar el estado del árbol de trabajo | Está declarado si el árbol está limpio o si hay cambios locales, y cuáles | Salida literal de `git status --porcelain=v1 -b` pegada. Si hay cambios ajenos, se **preservan**, no se descartan | TODO |
| H1.S1.M3 | Registrar si el SHA del paquete sigue siendo alcanzable y qué cambió desde él | Está declarado si `32ae939…` es ancestro del `HEAD` actual, y el conteo de commits de diferencia | Salida de `git merge-base --is-ancestor 32ae939983f0d665e4ed371362858801134d35cd HEAD; echo $?` y de `git rev-list --count 32ae939..HEAD` pegadas | TODO |
| H1.S1.M4 | Registrar el resultado de consultar los dos repos que el perfil reporta en 404 | Para docs y modelo canónico queda anotado el error exacto, la referencia consultada y el efecto sobre la trazabilidad | Salida literal del error pegada. **Un 404 no demuestra inexistencia**: se registra como límite de acceso, no como "no existe" | TODO |

#### H1.S2 — Stack real, no declarado

**CA:** Dado el checkout, cuando alguien pregunta qué versión de Nest, TypeScript, MikroORM o Jest está **instalada**, entonces tu tabla lo dice, y señala dónde difiere de lo declarado y de lo resuelto.

**DoD:** Las 4 microtareas en `HECHO`. Para cada uno de los cuatro paquetes, los tres valores. Si `node_modules` no existe, el valor instalado es `NOT_INSTALLED`, **no** el del lockfile.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H1.S2.M1 | Distinguir versión declarada, resuelta en lockfile e **instalada** para Nest, TypeScript, MikroORM y Jest | Para cada uno de los cuatro hay tres valores, y donde difieren está señalado | Tabla con la salida de `yarn info <pkg> --json` o equivalente, y de leer `node_modules/<pkg>/package.json`. Si `node_modules` no existe, el valor instalado es `NOT_INSTALLED`, no la del lockfile | TODO |
| H1.S2.M2 | Registrar el runtime real: versión de Node y de Yarn en uso | Los valores corresponden a lo que ejecuta esta máquina, no a `engines` del `package.json` | `node -v` y `yarn -v` con salida pegada | TODO |
| H1.S2.M3 | Registrar qué comandos de verificación **existen realmente** en `package.json` | Está la lista literal de `scripts` disponibles, y marcado cuál sirve para typecheck, cuál para unit y cuál para integración | Bloque `scripts` de `package.json` pegado tal cual. Los comandos de los anexos del paquete son **especificaciones**, no comandos instalados: no inventar uno que no esté | TODO |
| H1.S2.M4 | Registrar disponibilidad de PostgreSQL y Docker para pruebas | Está declarado si hay un PostgreSQL alcanzable y si Docker responde, con el error exacto si no | Salida de la comprobación pegada. Si no hay, el estado es `BLOCKED` con motivo — **nunca `PASS`** | TODO |

#### H1.S3 — Mapa de dependencias acotado al piloto

**CA:** Dado el piloto de avisos, cuando alguien pregunta qué dependencia lo bloquea, entonces tu mapa lo responde con archivo y línea, y marca como `HYPOTHESIS` todo lo que todavía no se demostró ejecutando.

**DoD:** Las 5 microtareas en `HECHO`. La tabla de unidades entregables completa, sin filas `TBD` sin dueño ni fecha, y la tensión de semántica registrada como `DECISION_REQUIRED`.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H1.S3.M1 | Localizar en el árbol real las rutas de `SchedulingDelayService`, `SchedulingAgendaNoticesService` y `MessagingAgendaNoticeAdapter` | Cada uno tiene ruta real verificada en el checkout, o está marcado `NOT_FOUND` con el patrón de búsqueda usado | Salida del grep/búsqueda pegada con las rutas. **No dar por buena una ruta que no abriste** | TODO |
| H1.S3.M2 | Enumerar qué importa `src/modules/scheduling/scheduling.module.ts` | Está la lista literal de imports del módulo y, para cada uno, si es dependencia de tipos, de arranque, de persistencia o solo de composición | Bloque de imports pegado + clasificación. La clasificación es hipótesis hasta la prueba de ausencia de Itzan: marcarla `HYPOTHESIS` | TODO |
| H1.S3.M3 | Registrar qué hace `src/orm/config/orm.config.ts` con el descubrimiento de entidades | Está declarado si las entidades se descubren por glob global, si usa `TsMorphMetadataProvider`, si hay caché de metadata y si registra `HistoryMirrorSubscriber` | Fragmentos literales del archivo pegados. **Los conteos escritos en comentarios del código no se adoptan como inventario medido** | TODO |
| H1.S3.M4 | Registrar la tensión de semántica del aviso detectada en el puerto | Queda escrito, sin resolverla, que el comentario del puerto permite descartar un aviso fallido mientras el metaprompt exige durabilidad para efectos obligatorios | Cita literal del comentario del puerto + cita del metaprompt, ambas con localizador. Estado: `DECISION_REQUIRED`. **No elegir una de las dos** | TODO |
| H1.S3.M5 | Entregar la tabla de unidades entregables del lote | Cada fila tiene capacidad, dependencia que bloquea, mecanismo mínimo propuesto, riesgo y prueba de salida | Tabla completa en el documento de corte, sin filas con "TBD" sin dueño ni fecha | TODO |

### H2 — Construir el laboratorio de la capacidad del piloto

**Prioridad:** `ALTA`

**CA:** Dado el laboratorio montado, cuando alguien lo usa mal —una operación que no registró, un fallo que nadie consumió—, entonces el cierre del harness **falla**, en vez de devolver un resultado que parece bueno.

**DoD:** Las 9 microtareas en `HECHO` o `BLOCKED`. El caso de operación no registrada falla **aunque el código de aplicación capture la excepción**. Ningún caso quedó en verde por un fallback que fabricó éxito.

**Kill-test del hito:** Pedile a alguien que llame una operación que el harness no registró y que atrape la excepción en el código de aplicación. Si el test igual pasa, el laboratorio no sirve: está fabricando verdes.

**Estado:** TODO

#### H2.S1 — El harness y su regla de fallo

**CA:** Dado el harness corriendo, cuando se lo invoca con algo no previsto, entonces el cierre falla y lo reporta, incluso si la aplicación atrapó la excepción.

**DoD:** Las 4 microtareas en `HECHO`, con la salida de cada caso pegada. Esto es ADV-02: **si el caso pasa en verde, el laboratorio está roto** y el hito no avanza.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H2.S1.M1 | Montar el laboratorio de la capacidad elegida, fuera de `src/` | Corre y ejecuta al menos un caso de punta a punta | Salida del comando pegada con exit code. Si no hay PostgreSQL alcanzable, `BLOCKED` con el error exacto — **nunca `PASS`** | TODO |
| H2.S1.M2 | El harness registra cada solicitud recibida | Se puede listar qué se le pidió y con qué argumentos | Salida del registro pegada para un caso | TODO |
| H2.S1.M3 | Una operación no registrada hace fallar el cierre del harness | Falla **aunque** el código de aplicación capture la excepción | Caso ejecutado y su salida. Esto es ADV-02: si pasa en verde, el laboratorio está roto | TODO |
| H2.S1.M4 | Un fallo no consumido se conserva hasta el cierre | El cierre lo reporta | Caso ejecutado con su salida | TODO |

#### H2.S2 — Reproducibilidad

**CA:** Dado el mismo caso corrido dos veces, cuando se comparan los resultados, entonces son idénticos salvo timestamps, y la limpieza rechaza cualquier base que no sea la del run.

**DoD:** Las 3 microtareas en `HECHO`. Dos salidas pegadas del mismo caso, más el caso negativo de la limpieza. Sin ese negativo, alguien borra la base de un compañero.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H2.S2.M1 | Reset completo del estado entre casos | Dos corridas seguidas del mismo caso dan el mismo resultado | Dos salidas pegadas, idénticas salvo timestamps | TODO |
| H2.S2.M2 | Reloj y destinatario fijados, no tomados del sistema | El caso no cambia de resultado según la hora a la que se corra | Configuración pegada + caso corrido dos veces | TODO |
| H2.S2.M3 | La limpieza rechaza una base que no sea la del run | Con un nombre arbitrario, se niega | Caso negativo ejecutado. Sin esto, alguien borra la base de un compañero | TODO |

#### H2.S3 — Los checks del generador

**CA:** Dado el generador, cuando se recorren sus checks, entonces cada uno tiene resultado o motivo de inaplicabilidad, y está escrito que generar fixtures no es haber corrido tests.

**DoD:** Las 2 microtareas en `HECHO`. Tabla con los 7 checks `L1`–`L7`, con `L5` respondido: **el oráculo no usa la función que prueba para calcular el esperado**.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H2.S3.M1 | Recorrer L1–L7 y declarar cuáles aplican | Cada uno: aplica y su resultado, o no aplica con motivo | Tabla con los 7. `L5` es el más importante: **el oráculo no puede usar la función que prueba para calcular el esperado** | TODO |
| H2.S3.M2 | Registrar que generar fixtures NO es haber corrido tests | Está escrito en el documento de entrega | Cita de `L6`: *generación no se reporta como tests; integración con dobles no se reporta como real* | TODO |

### H3 — Elegir la segunda capacidad replicando solo mecanismos ya probados

**Prioridad:** `MEDIA`

**CA:** Dado el resultado del piloto, cuando se elige la segunda capacidad, entonces la elección cita qué mecanismo se reusa y con qué evidencia de ejecución, y ninguna abstracción nueva se creó sin un segundo uso real.

**DoD:** Las 8 microtareas en `HECHO` o `BLOCKED`. Ningún mecanismo replicado sin exit code detrás. La estimación es un **rango** con incertidumbres listadas, no un número.

**Kill-test del hito:** Preguntá qué mecanismo se está replicando y dónde está la evidencia de que funcionó en el piloto. Si no hay exit code detrás, se está replicando una idea, no un mecanismo.

**Estado:** TODO

#### H3.S1 — Qué del piloto sirve de verdad

**CA:** Dado el inventario de mecanismos del piloto, cuando se propone replicar uno, entonces tiene detrás un comando y un exit code, y los descartados están nombrados con su motivo.

**DoD:** Las 3 microtareas en `HECHO`. Tabla mecanismo → comando → exit code, y la declaración explícita de que **no se va a construir una plataforma universal**.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H3.S1.M1 | Inventariar los mecanismos que el piloto produjo | Cada uno con la evidencia que lo respalda | Tabla mecanismo → comando → exit code d**H2**. **Un mecanismo sin evidencia no se replica** | TODO |
| H3.S1.M2 | Marcar cuáles NO se reusan y por qué | Cada descartado tiene motivo | Tabla. Descartar es tan informativo como reusar | TODO |
| H3.S1.M3 | Declarar explícitamente que no se va a construir una plataforma universal | Está escrito en el documento | Cita: *evitar plataforma universal* · *no dedicar los seis días a crear herramientas genéricas* | TODO |

#### H3.S2 — La segunda capacidad

**CA:** Dado el conjunto de capacidades candidatas, cuando se elige una, entonces el criterio estaba escrito antes de la elección y las descartadas están nombradas.

**DoD:** Las 3 microtareas en `HECHO`. Si la elección depende de algo desconocido, el estado es `DECISION_REQUIRED` con las dos opciones y su costo, no una elección por conveniencia.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H3.S2.M1 | Listar las candidatas con su dependencia bloqueante | Cada una: qué la bloquea hoy | Tabla | TODO |
| H3.S2.M2 | Elegir una, con el criterio escrito antes de la elección | Hay exactamente una elegida y las descartadas nombradas | Decisión + razón. Si depende de algo que no sabés: `DECISION_REQUIRED` con las opciones y su costo | TODO |
| H3.S2.M3 | Estimar por rango y listar incertidumbres | Hay rango, no un número único | Estimación. *Estimar cada lote por rango y listar incertidumbres* | TODO |

#### H3.S3 — Lo que libera

**CA:** Dado el remanente del plazo, cuando se pregunta qué desbloquea esta elección, entonces hay una lista concreta de trabajo que se libera.

**DoD:** Las 2 microtareas en `HECHO`, con la tabla de capacidad restante actualizada.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H3.S3.M1 | Registrar qué trabajo desbloquea esta elección | Está la lista de lo que se destraba | Lista. El criterio del paquete es ordenar por *dependencias que desbloquean más trabajo* | TODO |
| H3.S3.M2 | Actualizar la capacidad restante del plazo | Está el remanente después de este lote | Tabla actualizada | TODO |

### H4 — Corregir las dependencias residuales que liberan más trabajo

**Prioridad:** `MEDIA`

**CA:** Dada cada dependencia residual que el aislamiento dejó nombrada, cuando se la corrige, entonces la prueba que la detectó se **reejecuta** y su resultado queda pegado; y las no corregidas están nombradas con su costo.

**DoD:** Las 8 microtareas en `HECHO` o `BLOCKED`. **Cada corrección con su reejecución**: ninguna hereda evidencia vieja (regla 30.4). Ningún refactor no solicitado en el diff.

**Kill-test del hito:** Después de la corrección, volvé a correr la prueba de ausencia. Si no la reejecutaste, no sabés si corregiste algo: solo sabés que tocaste código.

**Estado:** TODO

#### H4.S1 — Priorizar

**CA:** Dadas las dependencias residuales, cuando se ordenan, entonces cada una tiene archivo, línea y qué trabajo destraba, y está escrito cuáles entran en el turno y cuáles no.

**DoD:** Las 3 microtareas en `HECHO`. Sin localizador no es una dependencia identificada: es una sospecha, y no entra en la lista.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H4.S1.M1 | Listar las dependencias residuales d**H2** con su evidencia | Cada una con archivo y línea | Lista. Sin localizador no es una dependencia identificada: es una sospecha | TODO |
| H4.S1.M2 | Ordenarlas por trabajo que liberan | Cada una dice qué destraba | Tabla ordenada con el criterio escrito | TODO |
| H4.S1.M3 | Elegir cuáles entran en el día y cuáles no | La lista de entradas y la de descartadas, con motivo | Decisión escrita | TODO |

#### H4.S2 — Corregir, una por una

**CA:** Dada una dependencia elegida, cuando se la corrige, entonces el diff toca sólo lo necesario y la prueba de ausencia vuelve a correrse sobre lo corregido.

**DoD:** Las 3 microtareas en `HECHO`. Un diff y una salida de reejecución **por dependencia**. Nunca dos correcciones abiertas a la vez.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H4.S2.M1 | Corregir la primera, con cambio mínimo | El diff toca solo lo necesario | Diff + comando de verificación | TODO |
| H4.S2.M2 | **Reejecutar la prueba de ausencia** sobre lo corregido | Pasa, o falla con causa nueva | Salida pegada. Regla 30.4: **un cambio posterior invalida el peldaño del área tocada** | TODO |
| H4.S2.M3 | Repetir para cada dependencia elegida, cerrando una antes de abrir la siguiente | Nunca hay dos en curso | Estado del plan por dependencia | TODO |

#### H4.S3 — Lo que no se corrigió

**CA:** Dado el cierre del hito, cuando se pregunta qué quedó sin corregir, entonces cada pendiente tiene motivo y costo, y el estado del piloto está actualizado con evidencia.

**DoD:** Las 2 microtareas en `HECHO`. Una dependencia no corregida y declarada es información; una escondida es una bomba.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H4.S3.M1 | Registrar las no corregidas con su motivo y su costo | Cada una: por qué no, y qué costaría | Tabla. Una dependencia no corregida y declarada es información; una escondida es una bomba | TODO |
| H4.S3.M2 | Declarar si el piloto sigue transicional | Estado actualizado con evidencia | Estado + evidencia de la reejecución | TODO |

### H5 — Regresión de aislamiento y replay del contraejemplo

**Prioridad:** `ALTA`

**CA:** Dada la versión actual, cuando corre la regresión de aislamiento, entonces cada rojo tiene su clase con evidencia, cada `skipped` figura como `NOT_RUN`, y cada contraejemplo guardado se reproduce o se bloquea explícitamente.

**DoD:** Las 7 microtareas en `HECHO` o `BLOCKED`. Ningún test borrado, comentado ni con la aserción debilitada. Ningún timeout subido sin trace o log que demuestre la causa.

**Kill-test del hito:** Tomá el contraejemplo de un fallo d**H2** y reejecutalo. Si da otro resultado y nadie sabe por qué, la evidencia de toda la semana es frágil.

**Estado:** TODO

#### H5.S1 — Regresión

**CA:** Dada la suite de aislamiento, cuando termina, entonces hay un resultado con denominador exacto y cada rojo está clasificado en una de las cinco clases, con evidencia.

**DoD:** Las 3 microtareas en `HECHO`. Un solo worker en máquina de desarrollo. **Clasificar sin evidencia está prohibido**, y `ENVIRONMENT`/`DATA`/`EXTERNAL` se reportan `BLOQUEADO`, nunca `PASS`.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H5.S1.M1 | Correr la regresión de aislamiento, en serie | Termina y da un resultado | Salida pegada con el resumen. **Un solo worker en máquina de desarrollo** | TODO |
| H5.S1.M2 | Clasificar cada rojo en una de las cinco clases | Cada uno: `PRODUCT_BUG`, `TEST_BUG`, `ENVIRONMENT`, `DATA` o `EXTERNAL`, con evidencia | Tabla. **Clasificar sin evidencia está prohibido** | TODO |
| H5.S1.M3 | Registrar los `skipped` como `NOT_RUN` | Ninguno contado como `PASS` | Registro | TODO |

#### H5.S2 — Replay

**CA:** Dado un contraejemplo guardado, cuando se lo reejecuta con sus versiones, seed, reloj y estado, entonces da el mismo resultado o bloquea por una precondición faltante nombrada.

**DoD:** Las 2 microtareas en `HECHO`. Un contraejemplo irreproducible es un problema a registrar, no un detalle a omitir.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H5.S2.M1 | Reejecutar cada contraejemplo guardado con versiones, seed, reloj y estado | Da el mismo resultado, o bloquea explícitamente por precondición faltante | Salida pegada (ADV-11) | TODO |
| H5.S2.M2 | Registrar los que no se pudieron reproducir | Cada uno con qué falta | Lista. Un contraejemplo irreproducible es un problema, no un detalle | TODO |

#### H5.S3 — Qué cambió

**CA:** Dada la corrida anterior, cuando se comparan, entonces está la lista de lo que pasó a rojo y lo que se recuperó, y el peldaño de evidencia está declarado por área.

**DoD:** Las 2 microtareas en `HECHO`. El peldaño del trabajo es **el más bajo** de sus áreas en alcance, no el más alto.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H5.S3.M1 | Comparar contra la corrida anterior | Están los que pasaron a rojo y los que se recuperaron | Diff de resultados | TODO |
| H5.S3.M2 | Declarar el peldaño de evidencia alcanzado por área | Cada área con su peldaño | Tabla. El peldaño del trabajo es **el más bajo** de sus áreas | TODO |

### H6 — Reparaciones acotadas y nueva verificación de lo afectado

**Prioridad:** `ALTA`

**CA:** Dado cada rojo de la regresión, cuando se lo repara, entonces la causa quedó enunciada **antes** del cambio y la verificación que lo detectó se reejecutó; y el peldaño del área tocada está actualizado.

**DoD:** Las 8 microtareas en `HECHO` o `BLOCKED`. Ninguna microtarea en `EN CURSO` al cerrar. El peldaño declarado es el más bajo de las áreas.

**Kill-test del hito:** Después de cada reparación, preguntá qué se volvió a correr. Si la respuesta es «nada, era chiquito», el peldaño de esa área volvió a `WRITTEN` y nadie lo notó.

**Estado:** TODO

#### H6.S1 — Priorizar y reparar

**CA:** Dado un rojo, cuando se lo repara, entonces su causa está escrita antes del diff y el cambio es el mínimo que la resuelve.

**DoD:** Las 3 microtareas en `HECHO`. Una reparación por vez, cerrando antes de abrir la siguiente.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H6.S1.M1 | Priorizar los rojos por impacto en el dictamen | Cada uno con su prioridad y motivo | Tabla ordenada | TODO |
| H6.S1.M2 | Reparar el primero con cambio mínimo, tras enunciar la causa | La causa está escrita **antes** del cambio | Causa + diff + verificación | TODO |
| H6.S1.M3 | Repetir de a uno, cerrando antes de abrir el siguiente | Nunca dos en curso | Estado por reparación | TODO |

#### H6.S2 — Reverificar

**CA:** Dada una reparación, cuando se cierra, entonces la prueba que detectó el fallo volvió a correrse y la regresión del área también.

**DoD:** Las 3 microtareas en `HECHO`, con una salida por reparación. **El área editada vuelve a `WRITTEN` hasta que se reverifique.**

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H6.S2.M1 | Reejecutar la verificación que detectó cada fallo | Pasa, o falla con causa nueva | Salida pegada por reparación. *Si el fix cambia la causa del fallo, se reejecuta la prueba que lo detectó* | TODO |
| H6.S2.M2 | Reejecutar la regresión del área afectada | Resultado pegado | Salida | TODO |
| H6.S2.M3 | Actualizar el peldaño de evidencia del área tocada | Cada área con su peldaño post-reparación | Tabla. **El área editada vuelve a `WRITTEN` hasta que se reverifique** | TODO |

#### H6.S3 — Lo que no se reparó

**CA:** Dado el cierre del turno, cuando se pregunta qué quedó roto, entonces cada ítem tiene impacto y costo, y el peldaño final del trabajo está declarado.

**DoD:** Las 2 microtareas en `HECHO`.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H6.S3.M1 | Listar lo no reparado con su impacto y qué costaría | Cada uno | Tabla | TODO |
| H6.S3.M2 | Declarar el peldaño final del trabajo | Es **el más bajo** de las áreas en alcance | Declaración + tabla por área | TODO |

## 5. Ambigüedades registradas — **no las resuelvas, anotalas**

| ID | Ambigüedad | Quién puede resolverla | Qué bloquea |
|---|---|---|---|
| Q-01 | El paquete se fecha el **20-09-2026** y hoy es **19-09-2026** | Quien encargó el paquete | Nada técnico; afecta a qué «Día 1» significa |
| Q-C1 | **Seis bloques de trabajo en una noche no entran.** Está entregado completo y ordenado por dependencia | Coordinación | El alcance real del turno. **No recortes en silencio**: lo que no cierres va `A MEDIAS` |
| Q-08 | Qué operación concreta se aísla | Alcance del piloto | El catálogo de casos del laboratorio |
| Q-12 | Idempotencia sin definir: alcance y vigencia de la clave | Negocio, vía contrato de Ender | El caso de repetición |
| Q-14 | Qué volumen de datos sintéticos hace falta para que el caso sea realista | Coordinación | Solo el realismo, no la corrección. Empezá con el mínimo |
| Q-15 | Si la dependencia residual d**H2** obliga a cambiar el corte | Coordinación | La elección misma |
| Q-03 | `TEAM_CAPACITY` sigue sin calcularse | Coordinación | El compromiso de alcance |
| Q-19 | Si alguna corrección toca código compartido con otro equipo | Coordinación | Esa corrección concreta: no la hagas sin acordarla |
| Q-22 | Qué tests forman la «regresión de aislamiento» exactamente | El equipo | El denominador. Declaralo, no lo dejes implícito |
| Q-26 | Si alguna reparación excede el plazo y conviene declararla deuda | Coordinación | Solo la decisión de alcance |

## 6. Definition of Done del turno

- [ ] Las **53 microtareas** están en `HECHO` o en `BLOCKED` con motivo y salida del error, o en `A MEDIAS` con qué anda, qué no anda y qué falta exactamente.
- [ ] **Ninguna microtarea quedó en `EN CURSO`** al cerrar.
- [ ] Todo estado de verificación es `PASS`/`FAIL`/`NOT_RUN`/`BLOCKED`. **No hay un solo `PASS` sin comando y exit code pegados.**
- [ ] Cada hito y cada subtarea tienen su Estado actualizado, no sólo las microtareas.
- [ ] Todo estado de verificación es `PASS`/`FAIL`/`NOT_RUN`/`BLOCKED`. **No hay un solo `PASS` sin comando y exit code pegados.**
- [ ] El registro de evidencia separa `REQUIREMENT_APPROVED`, `IMPLEMENTED_CONTRACT`, `TARGET_CONTRACT`, `VERIFIED_BEHAVIOR` e `HYPOTHESIS`.
- [ ] Ninguna afirmación del documento excede lo que ejecutaste. Repasá el cierre del prompt maestro: *"¿algún éxito declarado depende de algo que no ejecutaste?"*
- [ ] Ningún caso del catálogo quedó en verde por un fallback que fabricó éxito.
- [ ] El laboratorio falla ante operación no registrada y ante respuesta incompatible.
- [ ] Ningún dato real de persona entró al laboratorio: todo sintético y declarado como tal.
- [ ] Ninguna afirmación excede lo que ejecutaste. *¿Algún éxito declarado depende de algo que no ejecutaste?*
- [ ] Ningún mecanismo replicado sin evidencia de ejecución de **H2**.
- [ ] No se creó ninguna abstracción nueva sin un segundo uso real.
- [ ] La estimación es un rango con incertidumbres listadas, no un número.
- [ ] Cada corrección tiene su reejecución. Ninguna hereda evidencia vieja.
- [ ] Ningún refactor no solicitado entró en el diff.
- [ ] Las no corregidas están nombradas con su costo.
- [ ] Ningún test borrado, comentado ni con la aserción debilitada.
- [ ] Ningún timeout subido sin trace o log que demuestre la causa.
- [ ] Los `skipped` están como `NOT_RUN`, no como `PASS`.
- [ ] Cada rojo tiene su clase con evidencia.
- [ ] Cada reparación enunció su causa antes del cambio.
- [ ] Cada reparación tiene su reejecución.
- [ ] Ninguna microtarea quedó en `EN CURSO` al cerrar.
- [ ] El peldaño declarado es el más bajo de las áreas, no el más alto.
- [ ] Avance reportado como `microtareas HECHO / 53`, **no** como porcentaje a ojo.
- [ ] Ningún dato real de paciente en ninguna salida pegada. Si lo tenía: enmascarado **y aclarado que se enmascaró**.

## 7. Handoff

Avisá por el daily **al cerrar cada hito**, no al final del turno:

| Al cerrar | A quién | Qué exactamente |
|---|---|---|
| **H1** | Ender | Rutas reales del puerto y del adaptador, y la tensión de semántica |
| **H1** | Itzan | Imports de `scheduling.module.ts` y comportamiento del ORM |
| **H1** | Marcelo y Justin | Comandos de verificación reales y disponibilidad de PostgreSQL/Docker |
| **H2** | Itzan | El laboratorio que va a correr dentro de la copia descartable de su prueba de ausencia |
| **H2** | Justin | Qué valida hoy el harness y qué no, para que su doble no asuma de más |
| **H2** | Ender | Qué reglas del contrato el validador no puede comprobar todavía |
| **H3** | Ender | Qué contrato va a necesitar la segunda capacidad |
| **H3** | Itzan | Qué composición reusa y qué no |
| **H3** | Marcelo | Si la segunda capacidad toca su recorrido prioritario |
| **H4** | Itzan | Qué cambió en la composición y hay que reflejar en el baseline |
| **H4** | Ender | Si alguna corrección movió el contrato |
| **H4** | Justin | Si hay que reejecutar la relación por estos cambios |
| **H5** | Todo el equipo | El estado real de la regresión, incluido el rojo |
| **H5** | Itzan | Qué hay que reempaquetar si algo cambió |
| **H5** | Marcelo | Si la regresión bloquea la aceptación |
| **H6** | Justin | Qué hay que incluir en la regresión del candidato final |
| **H6** | Marcelo | Qué rojo sigue abierto y afecta el dictamen |
| **H6** | Itzan | Si hay que reempaquetar tras las reparaciones |

Si un bloqueo se confirma, **no itere sobre él**: registrá la causa y pasá a la siguiente microtarea independiente. Un bloqueo se reporta **apenas aparece**, no al final.
