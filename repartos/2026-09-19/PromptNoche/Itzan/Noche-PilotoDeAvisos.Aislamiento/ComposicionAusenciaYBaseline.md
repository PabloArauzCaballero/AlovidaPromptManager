# Composición, prueba de ausencia y baseline de la capacidad

> **Rol:** propietario de capacidad / aislamiento · **Línea:** A · **Fecha:** 2026-09-19 · **Turno:** noche
> **Paquete fuente:** `BACKEND_AUTONOMO_MANTRA` · **Requisitos del cliente:** [`REQUISITOS-CLIENTE-ALOVIDA.md`](../../../../../docs/requisitos/REQUISITOS-CLIENTE-ALOVIDA.md)
> **6 hitos · 18 subtareas · 52 microtareas**, todas con criterio de aceptación y Definition of Done.

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

Son **25**: 11 del proceso, que carga todo el equipo, y 14 propias de
*Composición, prueba de ausencia y baseline de la capacidad*. Cargar = abrirlas y leerlas antes de empezar, no tenerlas en disco.

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
| `nestjs-development` | composicion de modulos, DI y contexto standalone |
| `mikroorm-patterns` | discovery de entidades, metadata, subscribers y transacciones |
| `model-driven-schema` | direccion unica del cambio de esquema |
| `database-design` | tablas propias, de referencia y de auditoria |
| `postgresql-advanced` | por que no se sustituye PostgreSQL por SQLite |
| `multi-tenancy` | el contexto de organizacion en cada consulta |
| `data-quality-validation` | verificacion de deriva entre fuente, base y entidades |
| `test-data-management` | baseline por ejecucion, identificable y limpiable |
| `dependency-management` | resolución, lockfile y qué arrastra cada paquete |
| `refactoring-safely` | mover sin romper, y cómo se demuestra |
| `release-and-rollback` | versionar de forma que se pueda volver atrás |
| `environment-secrets-config` | que no se te escape un secreto en el paquete |
| `backup-restore-dr` | un backup que no se probó restaurando no es un backup |
| `integrity-testing` | huérfanos, duplicados y nulos indebidos |

Entrá siempre por `skills-router`: **no leas el catálogo entero, no sirve.** El router mapea la
situación concreta ("voy a tocar un endpoint", "voy a diseñar una pantalla") a la skill que
corresponde, y fija la precedencia cuando dos se pisan.

### 1.4 DoD de esta sección — se verifica como cualquier otra

- [ ] `ls .claude/skills | wc -l` devolvió **176**, y la salida está pegada en tu daily.
- [ ] `python .claude/hooks/plan_gate.py --self-test` devolvió **11 PASS, 0 FAIL**, salida pegada.
- [ ] Leíste `skills-router` y las 25 skills de las dos tablas.
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
> - `scheduling.module.ts` (145 líneas) importa **8 módulos**: `AuditModule`, `DirectoryModule`,
>   `PracticeModule`, `MessagingModule`, `CommunityModule`, `InsuranceModule`, `ProfilesModule`,
>   `CommonModule`. `MessagingModule` y `CommunityModule` confirmados.
> - El binding es `{ provide: AGENDA_NOTICE_PORT, useExisting: MessagingAgendaNoticeAdapter }`,
>   **línea 142**. Es **`useExisting`, no `useClass`**: la instancia ya viene provista de otro lado,
>   y eso cambia cómo se sustituye.
> - **Hay un SEGUNDO adaptador que el paquete nunca mencionó:** `SupportAdminNoticeAdapter`
>   (línea 72). Un análisis de la composición que lo ignore está incompleto.
> - `orm.config.ts`: globs globales (líneas 57-61), `TsMorphMetadataProvider` (68), caché en
>   `node_modules/.cache/mikro-orm` (78-81) y `HistoryMirrorSubscriber` (129). **Los cuatro, confirmados.**
> - El comentario de la línea 67 dice *«analizar 1159 archivos»*. **1159 es un comentario, no una
>   medición vigente.** No lo adoptes como inventario.
> - `transaction.port.ts`: existen `TransactionManager`, `execute<T>` y `TransactionOptions`. El
>   token es `TRANSACTION_MANAGER = Symbol(...)`. **`TransactionContext` no vive ahí**: se importa
>   de `./persistence-context`. **La propagación sigue sin verificar: exige ejecutar.**
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
| **H1** | `BLOQUEANTE` | Al cerrar tu turno, el equipo puede leer un solo documento y saber **qué carga hoy `SchedulingModule` y por qué**, **qué composición mínima se propone para la capacidad del piloto**, y **cómo se levanta una base de pruebas aislada e identificable** — sin que nadie tenga que volver a rastrear imports. |
| **H2** | `BLOQUEANTE` | Hay una copia sin las implementaciones vecinas donde la capacidad **compila, arranca y pasa su aceptación local** — o hay una dependencia residual concreta, nombrada, que explica por qué todavía es transicional. |
| **H3** | `MEDIA` | Existe un artefacto MODULE versionado, con manifiesto, lockfile pertinente y evidencias adentro, que otro puede consumir **por versión** sin clonar la rama de nadie. |
| **H4** | `ALTA` | El baseline es reproducible en otra máquina, la migración conjunta está probada en un entorno de prueba con su rollback, y la verificación de deriva está en verde. |
| **H5** | `ALTA` | Existe un candidato del módulo con su manifiesto, sus evidencias y su estado de entrega, consumible por versión, y ligado a la corrida de regresión que lo respalda. |
| **H6** | `ALTA` | El artefacto final tiene sus gates A reejecutados sobre la versión reparada, con su propia evidencia, y su estado de entrega corresponde a esa versión y no a la anterior. |

> ⚠️ **Esto es más de lo que entra en una noche, y está dicho a propósito.** El alcance se entrega completo y ordenado por dependencia: se cierra lo que se pueda, y **lo que no se cierra queda `A MEDIAS` con qué anda, qué no anda y qué falta exactamente** (regla 20). Recortar alcance es una decisión de coordinación, no tuya, y se registra.

**Kill-test del turno completo:** preguntá a cualquiera si el ORM descubre las entidades por glob global y qué hace `HistoryMirrorSubscriber` al arrancar la capacidad sola. Si nadie lo sabe sin abrir `orm.config.ts`, no está hecho.

## 3. Alcance

**IN:** imports reales de la composición de scheduling y su clasificación · ubicación del binding `AGENDA_NOTICE_PORT` → adaptador · comportamiento real del descubrimiento de entidades y del subscriber · lectura del puerto de transacción existente · **propuesta** de composición de capacidad · diseño del baseline local por ejecución con su identidad, DDL mínimo, roles y limpieza · tabla de propiedad de datos de la capacidad · copia temporal · retiro de las implementaciones vecinas sustituidas · bloqueo de resolución desde el checkout original y cachés · typecheck, build, arranque y aceptación local en la copia · manifiesto de dependencias, exclusiones, resolución y conexiones · artefacto comprimido interno con código, declaraciones, lockfile, manifiesto y evidencias · hash y versión inmutable · mapa de resolución sin implementación vecina · estado de entrega declarado · baseline reproducible con identidad · migración conjunta probada en entorno de prueba · estrategia de rollback o restauración comprobada · verificación de deriva · consultas de integridad · artefacto de la versión respaldada · manifiesto con versiones, hashes y resolución · evidencias adentro · estado de entrega · enlace a la corrida de regresión · reejecución de los gates A aplicables sobre la versión reparada · verificación de deriva otra vez · nuevo hash y manifiesto · estado de entrega de esta versión.

**OUT:** editar `scheduling.module.ts`, `orm.config.ts` o cualquier fuente de Mantra · **ejecutar la prueba de ausencia** (es **H2** de este mismo turno) · decidir la semántica del contrato (es de Ender) · escribir el adaptador real (es de Justin) · crear una abstracción de transacción nueva · crear workspaces o paquetes nuevos antes de comprobar que alcanza con puntos de entrada delimitados (`ARQUITECTURA_Y_CONTRATOS.md` §2) · tocar el checkout original · silenciar un import residual para que arranque · declarar autónomo todo `SchedulingModule` si solo se aisló una capacidad · mover el problema a un paquete llamado `base` · publicar nada fuera de la empresa · mergear a `dev` · empaquetar como verificado algo que quedó `TRANSITIONAL_ISOLATION` · incluir credenciales o datos reales · **escribir DDL a mano contra la base** para destrabar · corregir un dato directamente en la base · sincronización automática de esquema · restaurar un backup de producción sin anonimizar · empaquetar una versión sin regresión que la respalde · **atribuirle a la versión nueva la evidencia de la anterior** · publicar fuera de la empresa · incluir secretos · **reusar la evidencia de la versión anterior sin justificación verificable** · empaquetar sin reejecutar · dejar la deriva sin verificar tras un cambio de esquema.

## 4. Plan — hitos, subtareas y microtareas

Los seis estados permitidos son exactamente: `TODO`, `EN CURSO`, `HECHO`, `A MEDIAS`, `BLOQUEADO` y `DESCARTADO`. **`A MEDIAS` es legítimo; disfrazarlo de `HECHO` no.** Una microtarea cuyo DoD no se ejecutó nunca es `HECHO`, aunque el código esté escrito.

### H1 — Delimitar la composición de la capacidad y su baseline local

**Prioridad:** `BLOQUEANTE`

**CA:** Dado tu documento, cuando otra persona intenta levantar la capacidad aislada en otra máquina, entonces sabe exactamente qué proveedores necesita, qué entidades registrar y qué base crear — y cuando algo falta, tu documento ya decía que iba a faltar.

**DoD:** Las 14 microtareas en `HECHO` o `BLOCKED`. Toda clasificación de dependencias marcada `HYPOTHESIS` hasta la prueba de ausencia. Ningún control desactivado para que algo arranque.

**Kill-test del hito:** preguntá a cualquiera si el ORM descubre las entidades por glob global y qué hace `HistoryMirrorSubscriber` al arrancar la capacidad sola. Si nadie lo sabe sin abrir `orm.config.ts`, no está hecho.

**Estado:** TODO

#### H1.S1 — Qué carga hoy la composición (hechos, no impresiones)

**CA:** Dada la composición actual, cuando alguien pregunta qué carga, entonces tiene la lista literal de imports con su clasificación y su localizador, contrastada por vos y no copiada.

**DoD:** Las 4 microtareas en `HECHO`, con el bloque de imports pegado. Si tu lectura difiere de la de Pablo, **gana el archivo** y la diferencia se registra como hallazgo.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H1.S1.M1 | Verificar por tu cuenta los imports de `src/modules/scheduling/scheduling.module.ts` en el corte | La lista es literal del archivo en el SHA declarado, no la del paquete ni la que te pasaron | Bloque de imports pegado. El mapa de Pablo (su M10) es tu punto de partida: **contrastalo, no lo copies**. Si difiere, gana el archivo y la diferencia se registra | TODO |
| H1.S1.M2 | Clasificar cada import: dependencia de tipos, de arranque, de persistencia o sólo de composición | Cada import tiene exactamente una clasificación y un motivo | Tabla completa. **Toda la clasificación es `HYPOTHESIS` hasta la prueba de ausencia (**H2**)**: marcarla así es parte del DoD, no un detalle | TODO |
| H1.S1.M3 | Localizar dónde se vincula `AGENDA_NOTICE_PORT` con el adaptador de mensajería | Hay archivo y línea reales, verificados abriendo el archivo | Fragmento pegado con localizador. **No des por buena una ruta que no abriste** | TODO |
| H1.S1.M4 | Registrar qué repositorios privados o clínicos necesitan las escrituras de la capacidad candidata | Está la lista, y para cada uno si es propio, de referencia o privado de otra capacidad | Tabla de propiedad de datos de `ARQUITECTURA_Y_CONTRATOS.md` §4. Si las escrituras requieren repositorios privados clínicos, el paquete manda **evaluar otra subcapacidad o exponer operaciones públicas** — registrá la opción, no la ejecutes. Y **no muevas el problema a un paquete llamado `base`** (§3 del piloto, textual) | TODO |

#### H1.S2 — ORM, arranque y transacción: lo que un cambio de imports NO resuelve

**CA:** Dado el ORM y el puerto de transacción, cuando alguien pregunta si basta con cambiar imports para delimitar el arranque, entonces tu documento demuestra con fragmentos que no, y nombra qué más hay que tocar.

**DoD:** Las 5 microtareas en `HECHO`, con fragmentos literales. La API usada revalidada contra la versión **instalada** (`7.1.7`), no contra la documentación más nueva.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H1.S2.M1 | Registrar qué hace `src/orm/config/orm.config.ts`: globs de descubrimiento, `TsMorphMetadataProvider`, caché de metadata y `HistoryMirrorSubscriber` | Los cuatro puntos están respondidos con fragmento literal, no con un resumen | Fragmentos pegados. **Los conteos escritos en comentarios del código no se adoptan como inventario medido** | TODO |
| H1.S2.M2 | Proponer la configuración explícita de entidades mínimas para el entorno local | Está la lista de entidades y, para cada una, por qué la capacidad la necesita | Lista + justificación. Si el subscriber o la metadata todavía arrastran fuentes privadas de otro proveedor, el estado es `TRANSITIONAL_ISOLATION`, no "listo". **Prohibido desactivar controles para que arranque** | TODO |
| H1.S2.M3 | Revalidar la API que vas a usar contra la versión **instalada** de MikroORM, no contra la documentación más nueva | Está citada la página consultada y la versión que documenta, contra la versión que el lockfile fija (`7.1.7` core, adaptador Nest `7.0.2`) | Cita + nota de diferencia. El paquete advierte que la página consultada mostraba **7.2**: si escribís configuración con API de 7.2 sobre un 7.1.7 instalado, inventaste | TODO |
| H1.S2.M4 | Leer `src/persistence/ports/transaction.port.ts` y su implementación | Está registrado si `TransactionManager.execute` y `TransactionContext` existen, y si la propagación está **verificada o no** | Fragmentos pegados. **Sin ejecución, la propagación es `NOT_RUN`, no "funciona"**. No supongas que `fork`, decoradores anidados o transacciones separadas se unen (`ARQUITECTURA_Y_CONTRATOS.md` §5). Si no comparten garantía, `TRANSITIONAL_ISOLATION` antes de fragmentar nada | TODO |
| H1.S2.M5 | Propuesta de composición de capacidad que reciba `AGENDA_NOTICE_PORT` **desde afuera** | El documento lista qué proveedores entran (repositorios propios, auth, auditoría, infra base) y qué queda fuera | Documento de composición. Debe decir explícitamente que **`overrideProvider` sobre `AppModule` no es prueba de aislamiento** y por qué (el grafo pudo cargar proveedores privados antes del reemplazo), y que un contexto standalone sin HTTP **no prueba guards ni pipes de una ruta HTTP** | TODO |

#### H1.S3 — Baseline que no se pisa con el de nadie

**CA:** Dada una corrida de prueba, cuando se levanta su base, entonces es identificable, tiene sólo el DDL mínimo de la capacidad, separa rol de preparación de rol de runtime, y su limpieza rechaza cualquier base ajena.

**DoD:** Las 5 microtareas en `HECHO`. Si no hay PostgreSQL alcanzable: `BLOCKED` con el error exacto, **nunca `PASS`**, y **nunca sustituido por SQLite**.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H1.S3.M1 | Verificar que hay un PostgreSQL alcanzable y si Docker responde | Está el resultado real con el error exacto si no hay | Salida pegada. Si no hay, el estado es `BLOCKED` con motivo — **nunca `PASS`**, y **nunca sustituido por SQLite** para afirmar equivalencia de bloqueos o RLS (`ARQUITECTURA_Y_CONTRATOS.md` §4.2) | TODO |
| H1.S3.M2 | Diseñar la identidad de la base de pruebas **por ejecución** | Cada corrida tiene una base identificable, y está escrito cómo se identifica | Esquema de nombres + comprobación. Un esquema alternativo sirve **sólo** si no hay nombres cualificados, extensiones ni triggers que escapen del aislamiento: verificalo o declaralo no verificado | TODO |
| H1.S3.M3 | Definir el DDL versionado mínimo: tablas propias, de referencia y de auditoría de la capacidad | Está la lista con sus restricciones y políticas pertinentes al caso | DDL en tu directorio de evidencia. Los registros de referencia de un proveedor ausente son **baseline contractual**, no implementación del proveedor | TODO |
| H1.S3.M4 | Separar rol de preparación y rol de runtime | Están los dos roles y qué privilegios tiene cada uno | Definición escrita. El rol de runtime **no** puede tener privilegios que evadan la política que se va a probar: si los tiene, la prueba no prueba nada | TODO |
| H1.S3.M5 | Definir la limpieza con comprobación de identidad y destino | La rutina de limpieza rechaza una base que no sea la del run | Especificación + el caso negativo que la rechaza. **La limpieza no debe poder aceptar una base compartida por un nombre arbitrario** (§4.6). Este es el control que evita borrar la base de un compañero | TODO |

### H2 — Demostrar materialmente la ausencia del proveedor

**Prioridad:** `BLOQUEANTE`

**CA:** Dada una copia sin las implementaciones vecinas, cuando se compila, arranca y corre la aceptación local, entonces pasa — o hay una dependencia residual concreta, con archivo y línea, que explica por qué el piloto sigue siendo transicional.

**DoD:** Las 9 microtareas en `HECHO` o `BLOCKED`. El resultado es un exit code, no una impresión. Si quedó transicional, la dependencia está nombrada con localizador.

**Kill-test del hito:** Preguntá si al retirar mensajería y comunidad la capacidad arranca. Si la respuesta es «debería», no está hecho. La única respuesta válida es un exit code pegado.

**Estado:** TODO

#### H2.S1 — La copia y el retiro

**CA:** Dada la copia descartable, cuando se importa algo de lo retirado, entonces **falla**; y el checkout original quedó intacto.

**DoD:** Las 4 microtareas en `HECHO`, con la prueba de que el import falla pegada. **Si resuelve igual, la ausencia no está demostrada y nada de lo que sigue vale.**

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H2.S1.M1 | Crear la copia descartable e identificarla | La copia existe y está claro que es descartable | Ruta + cómo se destruye. **No trabajes sobre el checkout original** | TODO |
| H2.S1.M2 | Retirar las implementaciones vecinas sustituidas, incluidas mensajería y comunidad | Está la lista de lo retirado, con rutas | Inventario pegado. *No basta retirar dos directorios si otro paquete aún las contiene*: verificalo | TODO |
| H2.S1.M3 | Bloquear la resolución desde el checkout original y las cachés | Un import de lo retirado **falla** | Prueba de que falla, pegada. Si resuelve igual, la ausencia no está demostrada y todo lo que sigue no vale | TODO |
| H2.S1.M4 | Conservar contratos y baseline autorizado dentro de la copia | Siguen disponibles | Listado pegado | TODO |

#### H2.S2 — Los gates en la copia

**CA:** Dada la copia, cuando se ejecutan typecheck, build, arranque y aceptación local, entonces cada uno da un exit code registrado.

**DoD:** Las 3 microtareas en `HECHO`. Un build de todo el repo **no** es un build delimitado, y un contexto sin HTTP **no prueba** guards ni pipes de una ruta HTTP.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H2.S2.M1 | Typecheck y build de la capacidad, delimitados | Exit 0, y está identificado qué se compiló | Comando y exit code pegados (gate A2). Un build de todo el repo **no** es un build delimitado | TODO |
| H2.S2.M2 | Arranque propio con PostgreSQL permitido y cierre limpio | Arranca y cierra sin quedar colgado | Salida pegada (gate A3). Un contexto standalone sin HTTP **no prueba** guards ni pipes de una ruta HTTP | TODO |
| H2.S2.M3 | Correr la aceptación local en la copia | Los casos del laboratorio de Pablo pasan, o fallan con su causa | Salida pegada (gates A4–A6) | TODO |

#### H2.S3 — El veredicto honesto

**CA:** Dado el resultado, cuando se declara el estado de la entrega, entonces es el que la evidencia sostiene, y la dependencia residual —si la hay— dirige el cambio siguiente.

**DoD:** Las 2 microtareas en `HECHO`. `MODULE_VERIFIED_WITH_CONTRACT_DOUBLES` **o** `TRANSITIONAL_ISOLATION`, nunca una palabra más fuerte que la evidencia.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H2.S3.M1 | Manifiesto de dependencias, archivos excluidos, resolución y conexiones | Los cuatro están | Manifiesto entregado | TODO |
| H2.S3.M2 | Declarar el estado real de la entrega | Es `MODULE_VERIFIED_WITH_CONTRACT_DOUBLES` **o** `TRANSITIONAL_ISOLATION`, con la dependencia residual nombrada | Estado + evidencia. *Si `scheduling.module.ts`, un barrel o el ORM arrastra aún fuentes ausentes, esa evidencia dirige el siguiente cambio; no se silencia* | TODO |

### H3 — Empaquetar y versionar el artefacto MODULE del piloto

**Prioridad:** `MEDIA`

**CA:** Dado el artefacto publicado, cuando otra persona lo consume **sin acceso a tu rama**, entonces puede hacerlo por versión y hash, y el estado declarado coincide con la evidencia del aislamiento.

**DoD:** Las 7 microtareas en `HECHO` o `BLOCKED`. Sin secretos ni datos reales adentro. Los 8 gates `A1`–`A8` con su fila, incluidos los `NOT_RUN`.

**Kill-test del hito:** Pedile a alguien que consuma el módulo sin acceso a tu rama. Si no puede, no hay artefacto: hay una rama.

**Estado:** TODO

#### H3.S1 — El artefacto

**CA:** Dado el artefacto, cuando se lo abre, entonces trae código, declaraciones, lockfile, manifiesto y evidencias, y su mapa de resolución no apunta a ninguna implementación vecina.

**DoD:** Las 3 microtareas en `HECHO`, con el listado del contenido y el hash pegados.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H3.S1.M1 | Armar el artefacto con código, declaraciones, lockfile, manifiesto y evidencias | Los cinco están adentro | Listado del contenido pegado | TODO |
| H3.S1.M2 | Asignar versión inmutable y hash | Versión + hash + commit de origen | Los tres pegados. *No requiere publicación remota ni merge inmediato en `dev`* | TODO |
| H3.S1.M3 | Incluir el mapa de resolución **sin implementación vecina** | Ninguna ruta apunta al proveedor retirado | Mapa pegado (gate A1) | TODO |

#### H3.S2 — Que no se escape nada

**CA:** Dado el artefacto, cuando se lo escanea, entonces no contiene ninguna credencial ni ningún dato real de persona.

**DoD:** Las 2 microtareas en `HECHO`, con las dos salidas pegadas. Un secreto expuesto **se rota**, no se borra y listo.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H3.S2.M1 | Verificar que el artefacto no contiene secretos | Ninguna credencial, token ni cadena de conexión | Salida del escaneo pegada. Regla 90.3: un secreto expuesto **se rota**, no se borra y listo | TODO |
| H3.S2.M2 | Verificar que no contiene datos reales de personas | Todo dato es sintético y está declarado | Verificación pegada | TODO |

#### H3.S3 — El estado honesto del paquete

**CA:** Dado el paquete, cuando se declara su estado, entonces no es más fuerte que la evidencia del aislamiento, y los gates sin correr están nombrados.

**DoD:** Las 2 microtareas en `HECHO`.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H3.S3.M1 | Declarar el estado de entrega del artefacto | `MODULE_VERIFIED_WITH_CONTRACT_DOUBLES` o `TRANSITIONAL_ISOLATION`, según **H2** | Estado + la evidencia de **H2** que lo respalda | TODO |
| H3.S3.M2 | Registrar qué gates quedaron sin ejecutar y por qué | Cada gate A1–A8: ejecutado, no aplicable con motivo, o `NOT_RUN` | Tabla de 8 filas | TODO |

### H4 — Estabilizar el baseline y probar la migración conjunta

**Prioridad:** `ALTA`

**CA:** Dado el baseline, cuando se lo levanta desde cero en otra máquina, entonces da los mismos conteos; la segunda corrida del seeder no inserta nada; y la verificación de deriva está en verde.

**DoD:** Las 8 microtareas en `HECHO` o `BLOCKED`. Ningún `ALTER TABLE` suelto contra la base. **La deriva detectada bloquea el cierre**, no es una advertencia.

**Kill-test del hito:** Corré la verificación de deriva entre la fuente de verdad, la base y las entidades del ORM. Si nadie la corrió, el esquema y el código pueden estar diciendo cosas distintas hace días.

**Estado:** TODO

#### H4.S1 — Baseline reproducible

**CA:** Dado un entorno limpio, cuando se levanta el baseline, entonces termina sin error, con los conteos esperados y sin huérfanos, duplicados ni nulos indebidos.

**DoD:** Las 3 microtareas en `HECHO`. La **segunda corrida del seeder** demostrando idempotencia, con las dos salidas pegadas.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H4.S1.M1 | Levantar el baseline desde cero en un entorno limpio | Termina sin error y con los conteos esperados | Salida pegada con los conteos | TODO |
| H4.S1.M2 | Correr los checks de integridad y permisos antes del escenario | Sin huérfanos, sin duplicados, sin nulos indebidos | Consultas y resultados pegados | TODO |
| H4.S1.M3 | Segunda corrida del seeder para demostrar idempotencia | La segunda no inserta nada | Salida de las dos corridas pegadas (regla 97.4.3) | TODO |

#### H4.S2 — Migración conjunta

**CA:** Dadas las migraciones candidatas, cuando se aplican sobre el baseline de producto en un entorno de prueba, entonces aplican, respetan expandir → migrar → contraer, y el rollback se ejecuta y se verifica.

**DoD:** Las 3 microtareas en `HECHO`. **Antes de aplicar donde importa, se prueba acá.** Si el rollback no es practicable, se declara por qué y cuál es el plan de recuperación.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H4.S2.M1 | Aplicar las migraciones candidatas sobre el baseline de producto en un entorno de prueba | Aplican sin error | Salida pegada. **Antes de aplicar donde importa, se prueba acá** | TODO |
| H4.S2.M2 | Verificar compatibilidad hacia atrás: expandir, migrar datos, contraer | El orden está respetado y declarado | Evidencia por etapa | TODO |
| H4.S2.M3 | Probar el rollback o la restauración | Se ejecuta y se verifica | Salida pegada. Si no es practicable, se declara por qué y cuál es el plan de recuperación | TODO |

#### H4.S3 — Deriva

**CA:** Dada la fuente de verdad, la base y las entidades del ORM, cuando se comparan, entonces no hay tabla ausente, columna ausente, obligatoria no mapeada ni nulabilidad divergente.

**DoD:** Las 2 microtareas en `HECHO`, con la salida de la verificación de deriva pegada y los índices con nombre explícito.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H4.S3.M1 | Verificación de deriva entre fuente de verdad, base y entidades del ORM | Sin tabla ausente, columna ausente, obligatoria no mapeada ni nulabilidad divergente | Salida pegada. **La deriva detectada bloquea el cierre**, no es una advertencia | TODO |
| H4.S3.M2 | Registrar los índices creados con nombre explícito | Ninguno con nombre generado | Listado pegado | TODO |

### H5 — Empaquetar el candidato final del módulo

**Prioridad:** `ALTA`

**CA:** Dado el candidato empaquetado, cuando alguien pregunta qué corrida de regresión lo respalda, entonces la versión del paquete y la de la regresión coinciden.

**DoD:** Las 7 microtareas en `HECHO` o `BLOCKED`. Ninguna evidencia heredada de una versión anterior sin justificación verificable.

**Kill-test del hito:** Preguntá qué corrida de regresión respalda este paquete. Si la respuesta es «la de ayer» y hubo cambios después, la evidencia venció.

**Estado:** TODO

#### H5.S1 — El candidato

**CA:** Dado el candidato, cuando se lo arma, entonces empaqueta la versión que la regresión respalda, con manifiesto completo y evidencias cuyas rutas existen.

**DoD:** Las 3 microtareas en `HECHO`, con los dos identificadores —el del paquete y el de la regresión— pegados.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H5.S1.M1 | Armar el artefacto de la versión que la regresión respalda | La versión empaquetada y la de la regresión coinciden | Los dos identificadores pegados | TODO |
| H5.S1.M2 | Incluir manifiesto con versiones, hashes, resolución y conexiones | Los cuatro | Manifiesto pegado | TODO |
| H5.S1.M3 | Incluir las evidencias de los gates A ejecutados | Cada gate con su ruta de evidencia, que **debe existir** | Índice de evidencias | TODO |

#### H5.S2 — Higiene

**CA:** Dado el artefacto, cuando se lo revisa, entonces no lleva secretos, ni datos reales, ni fuentes del proveedor retirado.

**DoD:** Las 2 microtareas en `HECHO`, con las salidas de las verificaciones pegadas.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H5.S2.M1 | Verificar ausencia de secretos y de datos reales | Ninguno | Salidas de las dos verificaciones | TODO |
| H5.S2.M2 | Verificar que el artefacto no arrastra fuentes del proveedor retirado | El mapa de resolución está limpio | Mapa pegado | TODO |

#### H5.S3 — Estado

**CA:** Dado el candidato, cuando se declara su estado, entonces es el que la evidencia sostiene y los gates sin correr están listados.

**DoD:** Las 2 microtareas en `HECHO`.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H5.S3.M1 | Declarar el estado de entrega del candidato | El que la evidencia sostiene, ni uno más fuerte | Estado + evidencia | TODO |
| H5.S3.M2 | Registrar qué gates quedaron `NOT_RUN` en este candidato | Lista | Tabla de gates A1–A8 | TODO |

### H6 — Reejecutar los gates del artefacto reparado

**Prioridad:** `ALTA`

**CA:** Dada la versión reparada, cuando se comparan sus gates contra la evidencia que los respalda, entonces la versión coincide: ninguna evidencia es de otro software.

**DoD:** Las 7 microtareas en `HECHO` o `BLOCKED`. La deriva en verde **sobre la versión final**. Los gates `NOT_RUN` declarados.

**Kill-test del hito:** Compará la versión del artefacto con la versión que aparece en la evidencia de cada gate. Si no coinciden, la evidencia es de otro software.

**Estado:** TODO

#### H6.S1 — Reejecutar

**CA:** Dada la versión reparada, cuando se reejecutan typecheck, build, arranque, aceptación y deriva, entonces cada uno tiene su propio exit code de esta versión.

**DoD:** Las 3 microtareas en `HECHO`, con las salidas pegadas. **La evidencia anterior no se hereda.**

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H6.S1.M1 | Reejecutar typecheck y build delimitados sobre la versión reparada | Exit 0 | Salida pegada | TODO |
| H6.S1.M2 | Reejecutar arranque propio y aceptación local | Pasan o fallan con causa | Salida pegada | TODO |
| H6.S1.M3 | Reejecutar la verificación de deriva | En verde | Salida pegada. Si el esquema cambió, esto **no es opcional** | TODO |

#### H6.S2 — Reempaquetar

**CA:** Dado el artefacto final, cuando se lo publica, entonces tiene hash y versión nuevos, y cada gate enlaza con la evidencia de **esta** versión.

**DoD:** Las 2 microtareas en `HECHO`, con el índice de evidencias indicando la versión en cada fila.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H6.S2.M1 | Generar el artefacto final con nuevo hash y manifiesto | Hash nuevo, versión nueva | Los dos pegados | TODO |
| H6.S2.M2 | Enlazar cada gate con la evidencia **de esta versión** | Ninguna evidencia heredada sin justificar | Índice de evidencias con la versión en cada fila | TODO |

#### H6.S3 — Estado final

**CA:** Dado el artefacto final, cuando se declara su estado, entonces corresponde a la evidencia nueva, y los gates sin correr están nombrados.

**DoD:** Las 2 microtareas en `HECHO`.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H6.S3.M1 | Declarar el estado de entrega del artefacto final | El que sostiene la evidencia nueva | Estado | TODO |
| H6.S3.M2 | Listar los gates que quedaron `NOT_RUN` en la versión final | Lista | Tabla A1–A8 | TODO |

## 5. Ambigüedades registradas — **no las resuelvas, anotalas**

| ID | Ambigüedad | Quién puede resolverla | Qué bloquea |
|---|---|---|---|
| Q-01 | El paquete se fecha el **20-09-2026** y hoy es **19-09-2026** | Quien encargó el paquete | Nada técnico; afecta a qué «Día 1» significa |
| Q-C1 | **Seis bloques de trabajo en una noche no entran.** Está entregado completo y ordenado por dependencia | Coordinación | El alcance real del turno. **No recortes en silencio**: lo que no cierres va `A MEDIAS` |
| Q-09 | Si el glob del ORM y el subscriber pueden delimitarse sin tocar código compartido | Se resuelve en **H2**, ejecutando | Deja de ser hipótesis al terminar este lote |
| Q-15 | Si la dependencia residual justifica cambiar el corte del piloto | Coordinación | El plan de **H3**. *Si **H2** no produce evidencia de aislamiento, ajustar el corte o documentar la dependencia antes de multiplicar la estrategia* |
| Q-16 | Dónde vive el artefacto interno: registry, almacenamiento compartido o adjunto | Coordinación | Solo la distribución, no el empaquetado |
| Q-20 | Si hay un baseline de producto acordado contra el que probar la migración conjunta | Coordinación | Solo la migración conjunta; el baseline local se puede probar igual |
| Q-23 | Si el candidato del módulo se entrega aunque el producto global no apruebe | Coordinación | Solo la comunicación: *MODULE se ejecuta y conserva su artefacto independientemente de jobs de integración* |

## 6. Definition of Done del turno

- [ ] Las **52 microtareas** están en `HECHO` o en `BLOCKED` con motivo y salida del error, o en `A MEDIAS` con qué anda, qué no anda y qué falta exactamente.
- [ ] **Ninguna microtarea quedó en `EN CURSO`** al cerrar.
- [ ] Todo estado de verificación es `PASS`/`FAIL`/`NOT_RUN`/`BLOCKED`. **No hay un solo `PASS` sin comando y exit code pegados.**
- [ ] Cada hito y cada subtarea tienen su Estado actualizado, no sólo las microtareas.
- [ ] Todo estado de verificación es `PASS`/`FAIL`/`NOT_RUN`/`BLOCKED`. **No hay un solo `PASS` sin comando y exit code pegados.**
- [ ] Toda clasificación de dependencias está marcada `HYPOTHESIS` hasta la prueba de ausencia.
- [ ] Ninguna propuesta de composición se presenta como aislamiento demostrado: eso se demuestra **H2**, ejecutando.
- [ ] Ningún control se desactivó para que algo arranque, y no hay ningún paquete nuevo llamado `base`, `common` o `shared` creado para esconder una dependencia.
- [ ] El resultado es un exit code, no una impresión.
- [ ] Ningún control se desactivó para que algo arrancara.
- [ ] Si quedó transicional, la dependencia está nombrada con archivo y línea — no como «algo de mensajería».
- [ ] Ninguna afirmación excede lo que ejecutaste. *¿Algún éxito declarado depende de algo que no ejecutaste?*
- [ ] El estado del paquete no es más fuerte que la evidencia de **H2**.
- [ ] Ningún secreto ni dato real dentro del artefacto.
- [ ] Los 8 gates A tienen su fila, incluidos los `NOT_RUN`.
- [ ] Ningún `ALTER TABLE` suelto contra la base.
- [ ] La deriva está en verde y su salida pegada.
- [ ] La idempotencia del seeder está demostrada con dos corridas.
- [ ] Ningún dato de producción se copió a un entorno de prueba.
- [ ] La versión empaquetada es la que la regresión respalda.
- [ ] Ninguna evidencia heredada de una versión anterior sin justificación.
- [ ] Sin secretos y sin datos reales adentro.
- [ ] Ninguna evidencia de la versión anterior se atribuyó a la final sin justificación.
- [ ] La deriva está en verde sobre la versión final.
- [ ] Los gates `NOT_RUN` están declarados.
- [ ] Avance reportado como `microtareas HECHO / 52`, **no** como porcentaje a ojo.
- [ ] Ningún dato real de paciente en ninguna salida pegada. Si lo tenía: enmascarado **y aclarado que se enmascaró**.

## 7. Handoff

Avisá por el daily **al cerrar cada hito**, no al final del turno:

| Al cerrar | A quién | Qué exactamente |
|---|---|---|
| **H1** | Pablo | Si tu lectura de los imports difiere de la suya, y PostgreSQL/Docker |
| **H1** | Justin | Qué proveedores entran en la composición de capacidad |
| **H1** | Marcelo | Si la garantía transaccional que su recorrido necesita existe hoy |
| **H2** | Todo el equipo | El veredicto: si hoy no hay aislamiento, **H3** cambia |
| **H2** | Pablo | Qué import residual bloquea, para priorizarlo mañana |
| **H2** | Marcelo | Si el recorrido elegido sigue siendo alcanzable con esta evidencia |
| **H3** | Justin | El artefacto versionado que va a fijar en su relación |
| **H3** | Pablo | Qué del empaquetado sirve para la segunda capacidad |
| **H3** | Todo el equipo | La versión a consumir, en vez de la rama |
| **H4** | Pablo | Si la deriva reveló algo que su corrección movió |
| **H4** | Justin | El baseline fijado para su relación |
| **H4** | Marcelo | Si el recorrido necesita datos que el baseline todavía no tiene |
| **H5** | Justin | El candidato a fijar en la relación |
| **H5** | Marcelo | Qué versión entra en el candidato compuesto |
| **H5** | Pablo | Si algo del empaquetado reveló una dependencia |
| **H6** | Marcelo | La versión final del módulo que entra en el dictamen |
| **H6** | Justin | El artefacto a fijar en la regresión final |
| **H6** | Pablo | Si algo se rompió al reempaquetar |

Si un bloqueo se confirma, **no itere sobre él**: registrá la causa y pasá a la siguiente microtarea independiente. Un bloqueo se reporta **apenas aparece**, no al final.
