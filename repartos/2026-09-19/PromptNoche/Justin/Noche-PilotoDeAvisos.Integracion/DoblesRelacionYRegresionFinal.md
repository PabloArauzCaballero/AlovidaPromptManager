# La relación agenda → mensajería: dobles, integración y regresión final

> **Rol:** responsable de relación e integración · **Línea:** B · **Fecha:** 2026-09-19 · **Turno:** noche
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
*La relación agenda → mensajería: dobles, integración y regresión final*. Cargar = abrirlas y leerlas antes de empezar, no tenerlas en disco.

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
| `async-messaging-events` | outbox, entrega at-least-once y consumidores idempotentes |
| `api-testing` | matriz de autorizacion negativa y conformidad de contrato |
| `integrity-testing` | un test con el ORM mockeado no prueba persistencia |
| `qa-evidence-reporting` | el formato de registro de un resultado |
| `e2e-failure-triage` | clasificar un rojo antes de tocar nada |
| `notifications-delivery` | solicitud persistida, aceptacion y evidencia de entrega |
| `security-guardrails` | que un doble no pueda bindearse en produccion |
| `error-handling-contract` | traducir errores sin inventar semántica |
| `backend-observability` | correlación para poder cruzar lo que pasó |
| `concurrency-and-locking` | precondición en la escritura, no en un `if` previo |
| `background-jobs-scheduling` | un solo ejecutor, timeout y visibilidad |
| `performance-load-testing` | cómo se ejerce competencia de verdad |
| `frontend-security` | que no se filtre por el otro lado |
| `deployment-verification-smoke` | qué se comprueba antes de dar por buena una composición |
| `regression-suite-management` | qué entra, qué se cuarentena y con qué dueño |
| `ci-cd-pipeline` | matriz de jobs por capacidad y relación |
| `code-quality-gates` | el check obligatorio falla de verdad |
| `e2e-playwright` | locators, esperas por condición y trace en fallo |

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
> - **`emit` nunca lanza.** Literal: *«No lanza: los fallos vuelven como
>   `{ delivered: false, skippedReason }`»*. Esto es **central para tu harness**: el fake **no puede**
>   convertir una llamada no registrada en `{delivered:false}`, porque sería indistinguible de un
>   fallo operacional legítimo del puerto real. Es exactamente ADV-02.
> - **El resultado tiene 8 campos, no los 6 del paquete.** Faltaban **`skippedReason`** y
>   **`chatSkippedReason`**. Tu doble estricto tiene que validar los 8.
> - `chatDelivered` está **ausente** para cupo liberado, demora y recordatorio: solo aplica al chat
>   de `SupportAdmin`. Un doble que siempre lo devuelve está mintiendo.
> - `emailRequestId` es **«encolado», no «entregado»**. La evidencia de que salió es la fila de
>   `messaging.notification_deliveries` con su `provider_message_ref`.
> - `AGENDA_NOTICE_PORT` es un **`Symbol`**; el binding real usa **`useExisting`**.
> - `test/jest-integration.json`: `maxWorkers: 1`, `@swc/jest`, `testTimeout: 180000`,
>   `testMatch` sobre `test/integration/**/*.int-spec.ts`. `test:integration` fija `ORM_SCHEMA_SYNC=off`.
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
| **H1** | `ALTA` | Al cerrar tu turno, existe una especificación de la relación `agenda → mensajería` que cualquiera puede implementar mañana: qué valida el doble, qué escenarios cubre, qué hace cuando lo llaman con algo no previsto, y **en qué formato se registra cada resultado** — más la lista explícita de lo que un doble **jamás** va a acreditar. |
| **H2** | `ALTA` | La relación `agenda → mensajería` corre de punta a punta con dobles fijados de los dos extremos, y su estado registrado es `ADAPTER_VERIFIED_WITH_DOUBLES` — ni una palabra más fuerte. |
| **H3** | `MEDIA` | La relación corre con las implementaciones reales que ya estén disponibles y sus efectos quedan comprobados en la persistencia, no en un booleano. |
| **H4** | `ALTA` | Repetir la operación no duplica efectos, competir por ella no rompe la invariante, y una caída en la emisión obligatoria no pierde la intención. |
| **H5** | `ALTA` | Está demostrado que intentar bindear un doble en la composición de producción **se bloquea antes del envío**, y que una discrepancia entre el doble y el proveedor real abre una discrepancia en vez de tapar el contrato. |
| **H6** | `ALTA` | El candidato final tiene su regresión corrida en el orden obligatorio, con cada etapa en su estado real, y el registro consolidado de todos los checks de la semana. |

> ⚠️ **Esto es más de lo que entra en una noche, y está dicho a propósito.** El alcance se entrega completo y ordenado por dependencia: se cierra lo que se pueda, y **lo que no se cierra queda `A MEDIAS` con qué anda, qué no anda y qué falta exactamente** (regla 20). Recortar alcance es una decisión de coordinación, no tuya, y se registra.

**Kill-test del turno completo:** preguntá qué pasa si el código de aplicación atrapa la excepción de una llamada no registrada. Si la respuesta es "el test pasa", no está hecho: el cierre del harness tiene que fallar igual.

## 3. Alcance

**IN:** localización del adaptador real · especificación del doble estricto y sus reglas de fallo · catálogo mínimo de escenarios de la operación elegida · formato de registro de checks con todos sus campos · comandos de verificación que existen de verdad · disponibilidad de PostgreSQL y Docker · ficha de la relación (artefactos, contratos, configuración, baseline) · mapeo de datos, errores y seguridad · control que impide un doble en producción · lista explícita de lo que el doble no prueba · adaptador contra el contrato versionado de Ender · dobles fijados de ambos extremos · mapeo de datos y errores ejecutado · compatibilidad temprana entre versiones · registro de cada resultado con sus 13 campos · ejecución de la relación con artefactos reales disponibles · comprobación de efectos persistidos · escenarios del catálogo común con participantes reales · qué sigue con dobles y por qué · ADV-05 repetición y competencia · ADV-09 caída tras el commit con recuperación · deduplicación por clave de negocio con unicidad real · política de reintentos declarada · fallo terminal visible · ADV-07 ejecutado · ADV-12 ejecutado · evidencia de composición y política, no solo nombres de variables · registro consolidado de checks de la relación · las siete etapas de la pirámide en orden · regresión del módulo afectado · registro consolidado con los 13 campos · denominadores exactos y motivo de selección de tests.

**OUT:** implementar el adaptador o el doble · modificar el adaptador existente · ejecutar la integración real (espera a los participantes reales) · **declarar la funcionalidad terminada con el backend mockeado** · decidir la semántica del contrato (es de Ender) · armar la composición ni el baseline (es de Itzan) · inventar una ventana de deduplicación, un TTL o una política de reintento que ninguna fuente define · declarar integración real · ejecutar contra implementaciones reales (esperan a sus participantes) · duplicar reglas de dominio dentro del adaptador · cambiar el contrato para que algo pase · declarar `INTEGRATION_VERIFIED_WITH_REAL_IMPLEMENTATIONS` si falta un participante · sustituir un participante real por un doble y no decirlo · certificar un proveedor externo con un sumidero local · **inventar una política de reintentos, un backoff o un TTL** que ninguna fuente define · usar un `Set` del fake como prueba de deduplicación · eliminar evidencia de un efecto perdido · agregar reintentos para tapar un intermitente · **alterar el contrato para forzar verde** cuando el proveedor real contradice al doble · dejar el control como una convención no probada · enviar nada a un destinatario real de verdad · paralelizar en la máquina de desarrollo · saltear una etapa que aplica · `continue-on-error` en un check obligatorio · **un workflow verde porque no seleccionó ninguna prueba**.

## 4. Plan — hitos, subtareas y microtareas

Los seis estados permitidos son exactamente: `TODO`, `EN CURSO`, `HECHO`, `A MEDIAS`, `BLOQUEADO` y `DESCARTADO`. **`A MEDIAS` es legítimo; disfrazarlo de `HECHO` no.** Una microtarea cuyo DoD no se ejecutó nunca es `HECHO`, aunque el código esté escrito.

### H1 — Iniciar la relación `agenda → mensajería` con dobles estrictos y su registro de checks

**Prioridad:** `ALTA`

**CA:** Dada tu especificación, cuando alguien implementa el doble, entonces un resultado incompatible y una llamada no registrada **fallan**, y ningún resultado del laboratorio queda registrado como integración verificada.

**DoD:** Las 13 microtareas en `HECHO` o `BLOCKED`. Ningún resultado con dobles registrado como integración real. Ninguna política de reintento, TTL o deduplicación escrita sin fuente.

**Kill-test del hito:** preguntá qué pasa si el código de aplicación atrapa la excepción de una llamada no registrada. Si la respuesta es "el test pasa", no está hecho: el cierre del harness tiene que fallar igual.

**Estado:** TODO

#### H1.S1 — El doble estricto y su catálogo

**CA:** Dado el doble estricto, cuando recibe una operación que no registró, entonces el cierre del harness falla — aunque la aplicación capture la excepción.

**DoD:** Las 5 microtareas en `HECHO`. Los 7 casos del catálogo mínimo mapeados. **`emit` nunca lanza** (verificado en el código): el fake no puede devolver `{delivered:false}` ante una llamada no prevista, porque sería indistinguible de un fallo legítimo.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H1.S1.M1 | Localizar `MessagingAgendaNoticeAdapter` en el árbol real | Hay ruta verificada abriendo el archivo, o `NOT_FOUND` con el patrón de búsqueda usado | Salida de la búsqueda pegada. Pablo lo busca también (su M9): **contrastá, no copies**. Si difieren, gana el archivo abierto | TODO |
| H1.S1.M2 | Registrar qué hace hoy el adaptador frente a la definición del puerto | Está escrito qué campos del resultado produce y de dónde salen | Fragmentos pegados con localizador. Es lectura: **no lo corrijas aunque veas algo raro** — lo que encontrás fuera de alcance se anota | TODO |
| H1.S1.M3 | Especificar el doble estricto de `AgendaNoticePort` | La especificación dice qué registra, qué valida y qué devuelve | Documento. El fake **registra solicitudes, valida forma y semántica conocida, devuelve sólo resultados previstos y falla ante operaciones no registradas**. Validar contra el contrato de Ender; mientras no exista, marcar `PROVISIONAL` | TODO |
| H1.S1.M4 | Fijar la regla de fallo del harness | Está escrito, como regla no negociable, qué pasa ante una llamada inesperada | Registro explícito: **una llamada inesperada es un error del harness, no un fallo operacional a convertir en `{delivered:false}`**; y **el harness conserva un fallo no consumido aunque el código de aplicación capture la excepción** (ADV-02). Sin esta regla, el laboratorio produce verdes falsos | TODO |
| H1.S1.M5 | Mapear el catálogo mínimo de escenarios a la operación elegida | Los siete casos están presentes, cada uno con qué se comprueba y con qué oráculo | Catálogo escrito: (1) cambio propio válido con aviso correcto, (2) proveedor indisponible, (3) recurso o actor de otra organización, (4) doble con respuesta incompatible, (5) operación no registrada, (6) repetición según idempotencia definida —**midiendo efectos persistidos, no cantidad de llamadas**—, (7) reloj y destinatario reproducibles con reset entre casos. El ejemplo de escenario del paquete es **formato de trabajo, no política completa de Mantra** | TODO |

#### H1.S2 — El registro de resultados, que es lo que evita el optimismo

**CA:** Dado cualquier resultado de check, cuando se lo registra, entonces tiene sus 13 campos y sus rutas de evidencia existen; y un `skipped` figura como `NOT_RUN`.

**DoD:** Las 4 microtareas en `HECHO`. `command` y `exit_code` son `null` sólo sin ejecución, con causa. Los comandos citados son los **reales** de `package.json`, no los de los anexos.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H1.S2.M1 | Definir el formato de registro de un resultado | Están los trece campos y un ejemplo lleno | Formato con `check_id`, `gate`, `scope`, `artifact`, `required`, `applicable`, `status`, `reason`, `participants`, `command`, `exit_code`, `evidence_paths` y `limits`. **`command` y `exit_code` son null si no hubo ejecución, con causa explícita**, y **las rutas de evidencia tienen que existir** | TODO |
| H1.S2.M2 | Separar los estados de entrega de los veredictos de ejecución | Está escrito que son dos ejes distintos, con la lista de cada uno | Registro. Veredictos: `PASS`/`FAIL`/`NOT_RUN`/`BLOCKED`. Estados de entrega: `IN_PROGRESS`, `TRANSITIONAL_ISOLATION`, `DECISION_REQUIRED`, `MODULE_VERIFIED_WITH_CONTRACT_DOUBLES`, `ADAPTER_VERIFIED_WITH_DOUBLES`, `INTEGRATION_VERIFIED_WITH_REAL_IMPLEMENTATIONS`, `PRODUCT_ACCEPTANCE_VERIFIED`. **Un test marcado `skipped` por el runner se registra `NOT_RUN`, nunca `PASS`** | TODO |
| H1.S2.M3 | Registrar qué comandos de verificación **existen realmente** | Está el bloque `scripts` literal y marcado cuál sirve para typecheck, unit e integración | Bloque de `package.json` pegado tal cual. **Los comandos de los anexos del paquete son especificaciones, no comandos instalados: no inventes uno que no esté** | TODO |
| H1.S2.M4 | Verificar disponibilidad de PostgreSQL y Docker | Está el resultado real, con el error exacto si no hay | Salida pegada. Si no hay, `BLOCKED` con motivo — **nunca `PASS`**. Itzan verifica lo mismo (su M10): si los resultados difieren, eso es un hallazgo de entorno, no un empate a resolver a mano | TODO |

#### H1.S3 — La relación, y lo que el doble no acredita

**CA:** Dada la relación, cuando se declara su estado, entonces dice explícitamente qué **no** acredita un doble en cada uno de los tres canales.

**DoD:** Las 4 microtareas en `HECHO`. Sin esa lista, `ADAPTER_VERIFIED_WITH_DOUBLES` se lee como integración terminada.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H1.S3.M1 | Ficha de la relación `agenda → mensajería` | Están fijados artefactos, contratos, configuración y baseline de ambos extremos | Ficha del gate B1. Fija **versiones**, no ramas: el producto compone versiones verificadas compatibles, no la última rama incompleta de cada persona | TODO |
| H1.S3.M2 | Especificar el mapeo de datos, errores y seguridad de la relación | Cada campo del contrato tiene origen y destino; cada error, su traducción; y está declarado cómo viajan actor y organización | Especificación del gate B2. **Sin reglas de dominio duplicadas en el adaptador**: el adaptador traduce, no decide | TODO |
| H1.S3.M3 | Escribir la lista de lo que el doble **no** prueba | Están los tres canales con su límite explícito | Registro literal: para in-app, hay que comprobar **filas y acceso del destinatario real**; para correo, distinguir **solicitud persistida / aceptación por transporte / evidencia de entrega** —un sumidero local prueba el transporte hacia ese sumidero, **no certifica un proveedor externo**—; para chat, **un booleano no acredita conversación, membresía ni visibilidad**. Sin esta lista, `ADAPTER_VERIFIED_WITH_DOUBLES` se lee como integración terminada | TODO |
| H1.S3.M4 | Especificar el control que impide un doble en producción y una salida a destinatario real | Está el control, y el caso negativo que lo dispara | Especificación de ADV-07: **bloqueo efectivo antes del envío o del efecto**, con **evidencia de composición y política, no sólo el nombre de una variable de entorno**. Un `if (env !== 'prod')` no es un control: es una intención | TODO |

### H2 — Ejercitar la relación con dobles fijados de ambos extremos

**Prioridad:** `ALTA`

**CA:** Dada la relación corrida con dobles fijados de ambos extremos, cuando se registra su estado, entonces dice `ADAPTER_VERIFIED_WITH_DOUBLES` — ni una palabra más fuerte.

**DoD:** Las 8 microtareas en `HECHO` o `BLOCKED`. Ningún `PASS` sin comando y exit code. El adaptador **traduce, no decide**.

**Kill-test del hito:** Preguntá si la relación está probada. Si alguien dice que sí sin aclarar «con dobles», el registro está mal hecho y alguien va a leer esto como integración terminada.

**Estado:** TODO

#### H2.S1 — El adaptador contra el contrato fijado

**CA:** Dado el artefacto de contrato versionado, cuando el adaptador lo consume, entonces referencia la versión y no la rama, y cada campo y cada error tienen su mapeo demostrado.

**DoD:** Las 3 microtareas en `HECHO`, con comando, exit code y la versión referenciada pegados.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H2.S1.M1 | Implementar el adaptador contra el artefacto versionado de Ender | Compila y referencia la versión, no la rama | Comando y exit code pegados + la versión referenciada | TODO |
| H2.S1.M2 | Ejecutar el mapeo de datos de la relación | Cada campo del contrato tiene origen y destino demostrados | Caso ejecutado con la salida | TODO |
| H2.S1.M3 | Ejecutar el mapeo de errores | Cada modo de error se traduce como dice la ficha | Casos ejecutados. El adaptador **traduce, no decide** | TODO |

#### H2.S2 — Los dobles de los dos extremos

**CA:** Dados los dobles de los dos extremos, cuando se los fija, entonces están fijados por versión, y está escrito qué pasaría si el proveedor real contradijera al doble.

**DoD:** Las 3 microtareas en `HECHO`. **No se altera el contrato para forzar verde.** No existe atajo a `INTEGRATION_VERIFIED_WITH_REAL_IMPLEMENTATIONS`.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H2.S2.M1 | Fijar el doble del proveedor y el del consumidor | Los dos están fijados por versión | Fichas pegadas (gate B1) | TODO |
| H2.S2.M2 | ADV-12: el doble satisface el catálogo y el proveedor real devuelve lo contrario | Queda escrito qué pasaría y cómo se detectaría | Especificación. **No se altera el contrato para forzar verde** | TODO |
| H2.S2.M3 | Registrar el estado como `ADAPTER_VERIFIED_WITH_DOUBLES` | Está el estado y qué falta para el siguiente | Registro. No existe atajo a `INTEGRATION_VERIFIED_WITH_REAL_IMPLEMENTATIONS` | TODO |

#### H2.S3 — Compatibilidad temprana

**CA:** Dadas las versiones del contrato que el producto va a seguir usando, cuando se prueba el adaptador contra cada una, entonces cada combinación tiene resultado o motivo.

**DoD:** Las 2 microtareas en `HECHO`, con la matriz de combinaciones y el registro de 13 campos.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H2.S3.M1 | Probar el adaptador contra las versiones del contrato que el producto va a seguir usando | Cada combinación: pasa o falla, con su motivo | Matriz de combinaciones | TODO |
| H2.S3.M2 | Registrar cada resultado con los 13 campos del formato | Ninguno sin `command` y `exit_code`, o con la causa de que sean null | Registro pegado. Las rutas de evidencia tienen que existir | TODO |

### H3 — Integrar la relación con los artefactos que ya estén listos

**Prioridad:** `MEDIA`

**CA:** Dado un aviso emitido con participantes reales, cuando se verifica su efecto, entonces se comprueba **la fila y el acceso del destinatario**, no un booleano del adaptador.

**DoD:** Las 8 microtareas en `HECHO` o `BLOCKED`. Ningún doble presentado como participante real. El estado se declara **por relación**, no global.

**Kill-test del hito:** Preguntá si el aviso llegó. Si la respuesta es «devolvió `delivered: true`», no está verificado: falta la fila y el acceso del destinatario real.

**Estado:** TODO

#### H3.S1 — Con lo real que haya

**CA:** Dados los participantes reales disponibles, cuando corre la relación, entonces sus efectos se comprueban desde una **conexión independiente**.

**DoD:** Las 3 microtareas en `HECHO`, con las consultas pegadas. Un booleano del adaptador **no** acredita la fila.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H3.S1.M1 | Fijar qué participantes reales están disponibles hoy | Lista con versión de cada uno | Lista (gate B1). *Su gate real espera solo a sus participantes* | TODO |
| H3.S1.M2 | Ejecutar la relación con esos participantes | Corre de punta a punta o falla con causa | Salida pegada | TODO |
| H3.S1.M3 | Comprobar los efectos en la persistencia, desde una conexión independiente | Las filas existen y el destinatario real las ve | Consultas pegadas. Un booleano del adaptador **no** acredita la fila | TODO |

#### H3.S2 — Los tres canales, con su límite

**CA:** Dado cada canal, cuando se declara su resultado, entonces in-app comprueba fila y acceso; correo distingue solicitud, aceptación y entrega; y chat comprueba conversación, membresía y visibilidad.

**DoD:** Las 3 microtareas en `HECHO`. *Un sumidero local prueba el transporte hacia ese sumidero; no certifica un proveedor externo.* Verificado en el código: `emailRequestId` es **encolado**, no entregado.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H3.S2.M1 | In-app: comprobar fila y acceso del destinatario real de pruebas | Ambos verificados | Consultas pegadas | TODO |
| H3.S2.M2 | Correo: distinguir solicitud persistida, aceptación por transporte y evidencia de entrega | Los tres estados por separado | Evidencia por estado. *Un sumidero local prueba el transporte hacia ese sumidero; no certifica un proveedor externo* | TODO |
| H3.S2.M3 | Chat, si aplica: conversación real, membresía y visibilidad | Los tres, o `NOT_RUN` con motivo | Evidencia. *Un booleano no acredita todos esos efectos* | TODO |

#### H3.S3 — El estado, otra vez honesto

**CA:** Dado el estado de la relación, cuando se lo declara, entonces es por relación y nombra qué participante falta y qué lo destraba.

**DoD:** Las 2 microtareas en `HECHO`. Un proveedor externo no disponible es **aceptación externa pendiente**, no un rojo del equipo.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H3.S3.M1 | Declarar el estado por relación | `ADAPTER_VERIFIED_WITH_DOUBLES` o `INTEGRATION_VERIFIED_WITH_REAL_IMPLEMENTATIONS`, por relación | Estado por relación, no global | TODO |
| H3.S3.M2 | Registrar qué participante falta y qué lo destraba | Cada faltante con su bloqueo | Tabla. Un proveedor externo no disponible es **aceptación externa pendiente**, no un rojo del equipo | TODO |

### H4 — Probar idempotencia, concurrencia y recuperación de la relación

**Prioridad:** `ALTA`

**CA:** Dada la misma operación ejecutada dos veces con la misma clave, cuando se cuentan **los efectos persistidos**, entonces hay uno solo; y una caída tras el commit no pierde la intención.

**DoD:** Las 8 microtareas en `HECHO` o `BLOCKED`. La idempotencia medida en efectos persistidos, no en llamadas. Ningún reintento agregado para tapar un intermitente.

**Kill-test del hito:** Corré la misma operación dos veces con la misma clave y contá **los efectos persistidos**, no las llamadas. Si hay dos filas, la idempotencia no existe.

**Estado:** TODO

#### H4.S1 — Idempotencia

**CA:** Dada una operación repetida con la misma clave, cuando se consultan los efectos, entonces son uno; y la deduplicación descansa en una restricción real de la base.

**DoD:** Las 3 microtareas en `HECHO`, con la consulta de conteo y el DDL o índice pegados. **Un `Set` del fake no prueba deduplicación en producción.**

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H4.S1.M1 | ADV-05: repetir la operación con la misma clave | **Los efectos persistidos** se mantienen en uno | Consulta de conteo pegada. *Medir efectos persistidos, no cantidad de llamadas* | TODO |
| H4.S1.M2 | Repetir con payload distinto y misma clave | La respuesta es la definida por el contrato, o `DECISION_REQUIRED` si no está definida | Salida o el registro del bloqueo | TODO |
| H4.S1.M3 | Verificar que la deduplicación usa unicidad real en la base | Existe la restricción | DDL o índice pegado. **Un `Set` del fake no prueba deduplicación en producción** | TODO |

#### H4.S2 — Concurrencia

**CA:** Dados dos clientes compitiendo por la operación, cuando terminan, entonces la invariante se preserva y el conflicto es explícito; y la precondición está en la escritura.

**DoD:** Las 2 microtareas en `HECHO`, con las dos ejecuciones y el estado final pegados. **Un `if` previo es una carrera.**

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H4.S2.M1 | Competir por la operación desde dos clientes | La invariante se preserva y el conflicto es explícito | Salida de las dos ejecuciones + estado final | TODO |
| H4.S2.M2 | Verificar que la precondición está en la escritura | El `UPDATE` incluye la condición | Fragmento pegado. Un `if` previo es una carrera | TODO |

#### H4.S3 — Recuperación

**CA:** Dada una caída en la emisión obligatoria tras el commit, cuando se reinicia el procesamiento, entonces la intención estaba registrada en la misma transacción y el efecto se reintenta de forma idempotente.

**DoD:** Las 3 microtareas en `HECHO`. El fallo terminal es **visible**: no se elimina evidencia de un efecto perdido.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H4.S3.M1 | ADV-09: confirmar el negocio y simular caída en la emisión obligatoria | La intención queda registrada en la **misma transacción** del negocio | Consulta pegada | TODO |
| H4.S3.M2 | Reiniciar el procesamiento | El efecto se reintenta y es idempotente | Salida pegada | TODO |
| H4.S3.M3 | Hacer visible el fallo terminal | Cuando se agotan los intentos, alguien se entera | Evidencia. **No elimines evidencia de un efecto perdido** | TODO |

### H5 — Probar que un doble no puede llegar a producción ni salir a un destinatario real

**Prioridad:** `ALTA`

**CA:** Dado un intento de bindear un doble en la composición de producción, cuando se ejecuta, entonces **se bloquea antes del envío**, y el bloqueo se demuestra con composición y política, no con el nombre de una variable.

**DoD:** Las 7 microtareas en `HECHO` o `BLOCKED`. El control se ejecutó, no se describió. Ningún contrato alterado para acomodar una discrepancia.

**Kill-test del hito:** Intentá, a propósito, configurar el doble en la composición de producción. Si el único obstáculo es el nombre de una variable de entorno, no hay control: hay una intención.

**Estado:** TODO

#### H5.S1 — ADV-07

**CA:** Dado un doble configurado a propósito en producción, o una salida a un destinatario real, cuando se intenta, entonces se bloquea antes del efecto.

**DoD:** Las 3 microtareas en `HECHO`, con la salida y los fragmentos de composición y política pegados. **Un `if (env !== 'prod')` no es un control: es una intención.**

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H5.S1.M1 | Intentar bindear un doble en la composición de producción | **Se bloquea**, y el bloqueo ocurre antes del envío o del efecto | Salida pegada | TODO |
| H5.S1.M2 | Intentar una salida a destinatario real o red no permitida | Se bloquea | Salida pegada | TODO |
| H5.S1.M3 | Mostrar la evidencia de composición y política que lo bloquea | No alcanza con el nombre de una variable | Fragmentos de composición y política pegados | TODO |

#### H5.S2 — ADV-12

**CA:** Dado un doble que satisface el catálogo y un proveedor real que devuelve lo contrario, cuando se los compara, entonces la verificación falla y abre una discrepancia con dueño.

**DoD:** Las 2 microtareas en `HECHO`. **No se altera el contrato para forzar verde.**

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H5.S2.M1 | Hacer que el doble satisfaga el catálogo y el proveedor real devuelva lo contrario | La verificación del proveedor **falla** y se abre discrepancia | Salida pegada | TODO |
| H5.S2.M2 | Registrar la discrepancia sin tocar el contrato | La discrepancia queda abierta con dueño | Registro. **No se altera el contrato para forzar verde** | TODO |

#### H5.S3 — Consolidar

**CA:** Dado el conjunto de checks de la relación, cuando se lo consolida, entonces cada uno tiene sus 13 campos y todas sus rutas de evidencia existen.

**DoD:** Las 2 microtareas en `HECHO`.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H5.S3.M1 | Registro consolidado de todos los checks de la relación | Cada uno con sus 13 campos y su ruta de evidencia existente | Registro completo | TODO |
| H5.S3.M2 | Declarar el estado final por relación | El que la evidencia sostiene | Estado por relación | TODO |

### H6 — Correr la regresión del candidato final

**Prioridad:** `ALTA`

**CA:** Dado el candidato final, cuando corre su regresión, entonces las etapas aplicables se ejecutaron **en orden**, ninguna se salteó, y ningún `skipped` figura como `PASS`.

**DoD:** Las 9 microtareas en `HECHO` o `BLOCKED`. Ningún test borrado, comentado ni debilitado para cerrar. Todas las rutas de evidencia del registro consolidado existen.

**Kill-test del hito:** Mirá si alguna etapa se saltó. La pirámide no admite saltos: typecheck, lint, unitarios, integración, E2E dirigido, E2E de regresión, cross-browser.

**Estado:** TODO

#### H6.S1 — La pirámide, en orden

**CA:** Dada la pirámide de cierre, cuando se la recorre, entonces cada etapa aplicable tiene su exit code, en el orden obligatorio, y una etapa en rojo detiene el avance a la siguiente.

**DoD:** Las 4 microtareas en `HECHO`, con una salida por etapa y los denominadores exactos. Un solo worker, con trace y screenshot en fallo.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H6.S1.M1 | Etapas 1 y 2: typecheck y lint | Exit code pegado por etapa | Salidas. Estas **no habilitan decir que funciona** | TODO |
| H6.S1.M2 | Etapas 3 y 4: unitarios e integración relevantes al cambio | Resultados pegados | Salidas con los denominadores exactos | TODO |
| H6.S1.M3 | Etapas 5 y 6: E2E dirigido y E2E de regresión del módulo | Resultados pegados | Salidas. Un solo worker, con trace y screenshot en fallo | TODO |
| H6.S1.M4 | Etapa 7: smoke cross-browser si el proyecto lo soporta | Ejecutado o `NOT_RUN` con motivo | Salida o registro, un navegador por comando y secuencialmente | TODO |

#### H6.S2 — Honestidad del resultado

**CA:** Dado el resultado, cuando se lo registra, entonces los omitidos por filtros figuran como tales, cada rojo tiene su clase con evidencia, y el motivo de selección de tests está escrito.

**DoD:** Las 3 microtareas en `HECHO`. *Evitá un workflow verde porque no seleccionó ninguna prueba.*

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H6.S2.M1 | Registrar los resultados omitidos por filtros como tales | Ninguno contado como pasado | Registro. *Evitá un workflow verde porque no seleccionó ninguna prueba* | TODO |
| H6.S2.M2 | Clasificar cada rojo en una de las cinco clases con evidencia | Cada uno | Tabla | TODO |
| H6.S2.M3 | Registrar el motivo de selección de tests y el denominador | Los dos | Registro | TODO |

#### H6.S3 — Consolidar la semana

**CA:** Dados todos los checks A, B y C de la semana, cuando se los consolida, entonces están completos y los gates obligatorios que no aprobaron están listados.

**DoD:** Las 2 microtareas en `HECHO`. *Todos los checks obligatorios aplicables del nivel deben aprobar para el mismo artefacto y configuración.*

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H6.S3.M1 | Registro consolidado de todos los checks A, B y C | Cada uno con sus 13 campos y rutas de evidencia existentes | Registro completo | TODO |
| H6.S3.M2 | Declarar qué gates obligatorios aplicables NO aprobaron | Lista | Tabla. *Todos los checks obligatorios aplicables del nivel deben aprobar para el mismo artefacto y configuración* | TODO |

## 5. Ambigüedades registradas — **no las resuelvas, anotalas**

| ID | Ambigüedad | Quién puede resolverla | Qué bloquea |
|---|---|---|---|
| Q-01 | El paquete se fecha el **20-09-2026** y hoy es **19-09-2026** | Quien encargó el paquete | Nada técnico; afecta a qué «Día 1» significa |
| Q-C1 | **Seis bloques de trabajo en una noche no entran.** Está entregado completo y ordenado por dependencia | Coordinación | El alcance real del turno. **No recortes en silencio**: lo que no cierres va `A MEDIAS` |
| Q-06 | Durabilidad del aviso | Negocio | Si hace falta intención duradera |
| Q-12 | Idempotencia | Negocio | El caso de repetición |
| Q-13 | Política de reintentos | Negocio | El caso de proveedor indisponible |
| Q-18 | Qué cuenta como «evidencia de entrega» exigida por el registro para el correo | Negocio / proveedor | El estado final del canal correo |
| Q-25 | Qué cuenta como «composición de producción» en un entorno que todavía no existe | Coordinación | La fidelidad del control, no su existencia |
| Q-22 | Qué tests forman la regresión exigida | El equipo | El denominador del resultado |
| Q-21 | Proveedores externos no verificables | Coordinación | Los checks que quedan `BLOCKED` |

## 6. Definition of Done del turno

- [ ] Las **53 microtareas** están en `HECHO` o en `BLOCKED` con motivo y salida del error, o en `A MEDIAS` con qué anda, qué no anda y qué falta exactamente.
- [ ] **Ninguna microtarea quedó en `EN CURSO`** al cerrar.
- [ ] Todo estado de verificación es `PASS`/`FAIL`/`NOT_RUN`/`BLOCKED`. **No hay un solo `PASS` sin comando y exit code pegados.**
- [ ] Cada hito y cada subtarea tienen su Estado actualizado, no sólo las microtareas.
- [ ] Todo estado de verificación es `PASS`/`FAIL`/`NOT_RUN`/`BLOCKED`. **No hay un solo `PASS` sin comando y exit code pegados.**
- [ ] Ningún resultado obtenido con dobles está registrado como integración real. El estado máximo alcanzable hoy es `ADAPTER_VERIFIED_WITH_DOUBLES`.
- [ ] La especificación del doble hace fallar el caso 4 (respuesta incompatible) y el caso 5 (operación no registrada). Si tu diseño los deja pasar, no está hecho.
- [ ] Ninguna política de reintento, deduplicación o TTL aparece en el documento sin fuente. Lo que falta está `DECISION_REQUIRED`.
- [ ] Ningún resultado con dobles registrado como integración real.
- [ ] Ningún `PASS` sin comando y exit code.
- [ ] Ninguna política de reintento, TTL o deduplicación escrita sin fuente.
- [ ] Ninguna afirmación excede lo que ejecutaste. *¿Algún éxito declarado depende de algo que no ejecutaste?*
- [ ] Ningún efecto se dio por bueno sin consultarlo desde una conexión independiente.
- [ ] Ningún doble se presentó como participante real.
- [ ] El estado se declaró por relación, no como un único estado global.
- [ ] La idempotencia se midió en efectos persistidos.
- [ ] Ninguna política de reintento escrita sin fuente.
- [ ] Ningún reintento agregado para tapar un intermitente.
- [ ] El control se ejecutó; no se describió.
- [ ] Ningún contrato se alteró para acomodar una discrepancia.
- [ ] Todas las rutas de evidencia del registro existen.
- [ ] Ninguna etapa aplicable se salteó.
- [ ] Ningún `skipped` contado como `PASS`.
- [ ] Ningún test borrado, comentado ni debilitado para cerrar.
- [ ] Todas las rutas de evidencia del registro consolidado existen.
- [ ] Avance reportado como `microtareas HECHO / 53`, **no** como porcentaje a ojo.
- [ ] Ningún dato real de paciente en ninguna salida pegada. Si lo tenía: enmascarado **y aclarado que se enmascaró**.

## 7. Handoff

Avisá por el daily **al cerrar cada hito**, no al final del turno:

| Al cerrar | A quién | Qué exactamente |
|---|---|---|
| **H1** | Ender | Qué reglas necesita tu validador que el contrato no define |
| **H1** | Itzan | La ficha de la relación |
| **H1** | Marcelo | Si su recorrido toca un canal cuyo límite de verificación tenés vos |
| **H1** | Pablo | Comandos reales y disponibilidad de PostgreSQL/Docker |
| **H2** | Marcelo | Qué casos suyos ya se pueden ejercitar y cuáles esperan participantes reales |
| **H2** | Ender | Qué del contrato resultó ambiguo al implementarlo — es la mejor prueba de un contrato |
| **H2** | Itzan | Qué necesita el adaptador de la composición de capacidad |
| **H3** | Marcelo | Qué escenarios suyos ya corren con implementaciones reales |
| **H3** | Itzan | Qué necesitó la relación de la composición |
| **H3** | Ender | Qué ambigüedad del contrato apareció al integrar |
| **H4** | Marcelo | Qué pasos de su recorrido quedan cubiertos por estas propiedades |
| **H4** | Ender | Qué necesita el contrato para cerrar Q-12 y Q-13 |
| **H4** | Itzan | Si la restricción de unicidad exige cambio de esquema |
| **H5** | Marcelo | Qué discrepancias abiertas afectan su dictamen |
| **H5** | Ender | La discrepancia doble vs proveedor real, si la hubo |
| **H5** | Pablo | El registro consolidado para el cierre |
| **H6** | Marcelo | El resultado de la regresión, incluido el rojo, para el dictamen |
| **H6** | Pablo | Qué quedó en rojo y no se pudo reparar |
| **H6** | Todo el equipo | El registro consolidado de la semana |

Si un bloqueo se confirma, **no itere sobre él**: registrá la causa y pasá a la siguiente microtarea independiente. Un bloqueo se reporta **apenas aparece**, no al final.
