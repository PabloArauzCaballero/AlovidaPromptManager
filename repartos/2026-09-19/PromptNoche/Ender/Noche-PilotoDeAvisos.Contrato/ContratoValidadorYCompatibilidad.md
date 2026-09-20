# El contrato del piloto: fijarlo, validarlo y gobernar su evolución

> **Rol:** propietario de contrato · **Línea:** A · **Fecha:** 2026-09-19 · **Turno:** noche
> **Paquete fuente:** `BACKEND_AUTONOMO_MANTRA` · **Requisitos del cliente:** [`REQUISITOS-CLIENTE-ALOVIDA.md`](../../../../../docs/requisitos/REQUISITOS-CLIENTE-ALOVIDA.md)
> **6 hitos · 18 subtareas · 50 microtareas**, todas con criterio de aceptación y Definition of Done.

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

Son **22**: 11 del proceso, que carga todo el equipo, y 11 propias de
*El contrato del piloto: fijarlo, validarlo y gobernar su evolución*. Cargar = abrirlas y leerlas antes de empezar, no tenerlas en disco.

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
| `api-openapi-docs` | que lleva la ficha de un contrato y como se versiona |
| `error-handling-contract` | el contrato de errores es parte del contrato |
| `typescript-standards` | los tipos no validan: donde hace falta validacion runtime |
| `concurrency-and-locking` | idempotencia: alcance y vigencia de la clave |
| `authz-access-control` | que tiene que transportar el contrato sobre actor y tenant |
| `terminology-value-sets` | catalogos cerrados como conceptos codificados |
| `technical-docs-and-adr` | registrar la decision de versionado que vas a tomar |
| `unit-testing` | un comportamiento por test |
| `state-machines-workflows` | transiciones legales del contrato |
| `github-multirepo-coordination` | cuando el cambio cruza repos |
| `code-quality-gates` | el check obligatorio no se pasa por alto |

Entrá siempre por `skills-router`: **no leas el catálogo entero, no sirve.** El router mapea la
situación concreta ("voy a tocar un endpoint", "voy a diseñar una pantalla") a la skill que
corresponde, y fija la precedencia cuando dos se pisan.

### 1.4 DoD de esta sección — se verifica como cualquier otra

- [ ] `ls .claude/skills | wc -l` devolvió **176**, y la salida está pegada en tu daily.
- [ ] `python .claude/hooks/plan_gate.py --self-test` devolvió **11 PASS, 0 FAIL**, salida pegada.
- [ ] Leíste `skills-router` y las 22 skills de las dos tablas.
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
> - `AgendaNoticePort`, `emit`, `emitMany` y `AGENDA_NOTICE_PORT` existen. El token es un
>   **`Symbol`**, no una cadena.
> - El archivo **no declara versión de contrato**: hay que fijar snapshot y hash, como decía el prompt.
> - La regla «exactamente uno» de `recipient` existe **como comentario, no como tipo**. Literal:
>   `/** A quién va dirigido el aviso. Uno de los dos, no los dos. */`, sobre dos campos opcionales.
> - **`emit` nunca lanza:** *«No lanza: los fallos vuelven como `{ delivered: false, skippedReason }`»*.
> - `debounceKey` **no define ventana ni TTL**. Su comentario dice *«no se duplican mientras el
>   primero siga vivo»*, que no es una ventana. Sigue `DECISION_REQUIRED`.
> - **`AgendaNoticeKind` tiene exactamente 4 valores:** `SLOT_RELEASED`, `PRACTITIONER_DELAY`,
>   `APPOINTMENT_REMINDER`, `BOOKING_STATE_CHANGED`.
> - **La tensión `Q-06` está confirmada por escrito en el código:** *«Un aviso que falla se registra
>   y se descarta; jamás revierte la reserva…»*.
> **❌ CORRECCIÓN — el paquete estaba incompleto.** `PILOTO_MANTRA.md` lista **6** campos del
> resultado; el archivo real tiene **8**. El paquete omitió **`skippedReason`** y
> **`chatSkippedReason`**. Un doble construido contra la tabla del paquete devuelve resultados
> incompletos y tu validador los aceptaría. **Trabajá sobre los 8.**
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
| **H1** | `BLOQUEANTE` | Al cerrar tu turno, Itzan y Justin pueden construir contra `AgendaNoticePort` **sin abrir el repositorio**: tienen la definición congelada con hash y commit, y una tabla que dice, campo por campo, **qué garantiza el tipo y qué es solamente un comentario**. |
| **H2** | `ALTA` | La regla que el tipo no hace cumplir ahora la hace cumplir un validador, y hay un caso que lo demuestra rechazando un dato **de estructura válida** pero semánticamente incorrecto. |
| **H3** | `MEDIA` | Cualquier cambio del contrato tiene una regla escrita de qué se puede cambiar, qué consumidores afecta y cómo se transiciona — y hay un caso que **demuestra** que un cambio incompatible falla donde tiene que fallar. |
| **H4** | `MEDIA` | Hay una versión del contrato marcada estable, con su ficha completa, su matriz de consumidores y la lista explícita de lo que sigue `DECISION_REQUIRED`. |
| **H5** | `ALTA` | Está demostrado que una versión contractual incompatible hace fallar a los consumidores afectados, y que los artefactos históricos siguen intactos y con el mismo hash. |
| **H6** | `ALTA` | El contrato queda con su versión final, su ficha completa, su matriz de consumidores y una lista de pendientes donde **cada uno tiene nombre de quién decide**. |

> ⚠️ **Esto es más de lo que entra en una noche, y está dicho a propósito.** El alcance se entrega completo y ordenado por dependencia: se cierra lo que se pueda, y **lo que no se cierra queda `A MEDIAS` con qué anda, qué no anda y qué falta exactamente** (regla 20). Recortar alcance es una decisión de coordinación, no tuya, y se registra.

**Kill-test del turno completo:** preguntale a Justin qué significa que `delivered` venga en `true`, y si el compilador impide construir un `recipient` con sus dos campos vacíos. Si tiene que abrir el `.ts` para contestar, no está hecho.

## 3. Alcance

**IN:** snapshot del puerto con hash y commit · ficha de contrato de `ARQUITECTURA_Y_CONTRATOS.md` §3 · semántica campo por campo del resultado · separación tipo vs comentario · especificación del validador runtime · orden/cardinalidad/errores de `emitMany` · lo que `debounceKey` dice y lo que no · inventario de consumidores actuales del puerto · registro de lo que queda `DECISION_REQUIRED` · validador runtime de las reglas que el tipo no cubre · oráculo independiente · casos negativos dirigidos · versionado del artefacto de contrato · compatibilidad con los consumidores inventariados en **H1** · política de compatibilidad del contrato · matriz consumidor × versión · ADV-06 ejecutado en copia temporal · contrato de la segunda capacidad si Pablo ya la eligió · inmutabilidad de los artefactos históricos · ficha de contrato completa de §3 · versión estable congelada con hash · matriz consumidor × versión actualizada · lista de lo `DECISION_REQUIRED` con su dueño · plan de transición para los cambios pendientes · ADV-06 ejecutado en copia temporal · comprobación de hashes históricos · matriz final consumidor × versión · registro de lo que queda sin decidir al cierre del contrato · versión final del contrato con hash · ficha completa · matriz final · pendientes con dueño · riesgos residuales del contrato.

**OUT:** editar el puerto o cualquier archivo de Mantra · **resolver** la tensión de durabilidad del aviso (es decisión de negocio, no tuya) · implementar el doble o el validador (eso es del laboratorio) · armar la composición aislada (es de Itzan) · escribir el adaptador real (es de Justin) · inventar una ventana de deduplicación o un TTL que el archivo no declara · cambiar el contrato para que algo pase · resolver la tensión de durabilidad (`Q-06`) · implementar el adaptador (Justin) · inventar una regla que ninguna fuente define · romper un contrato en silencio · cambiar un artefacto ya publicado · decidir la semántica de negocio pendiente · imponer versionado HTTP donde el contrato no es HTTP · decidir lo que es de negocio · modificar una versión ya publicada · declarar estable un contrato cuyos campos clave siguen abiertos sin decirlo · modificar un artefacto publicado · **alterar el contrato para forzar un verde** · decidir lo que es de negocio · declarar compatible una combinación que no probaste · decidir lo de negocio para «cerrar limpio» · modificar versiones publicadas · declarar cerrado un contrato con campos clave abiertos sin decirlo.

## 4. Plan — hitos, subtareas y microtareas

Los seis estados permitidos son exactamente: `TODO`, `EN CURSO`, `HECHO`, `A MEDIAS`, `BLOQUEADO` y `DESCARTADO`. **`A MEDIAS` es legítimo; disfrazarlo de `HECHO` no.** Una microtarea cuyo DoD no se ejecutó nunca es `HECHO`, aunque el código esté escrito.

### H1 — Fijar el contrato real del puerto de avisos de agenda

**Prioridad:** `BLOQUEANTE`

**CA:** Dado tu documento de contrato, cuando Itzan o Justin construyen un doble a partir de él, entonces producen resultados que el validador acepta, y toda regla que el compilador no hace cumplir está marcada como validación runtime con su fuente — sin consultarte y sin abrir el repositorio.

**DoD:** Las 14 microtareas en `HECHO` o `BLOCKED`. El documento separa `IMPLEMENTED_CONTRACT` de `TARGET_CONTRACT` y de `HYPOTHESIS`. **Justin no puede empezar su doble sin esto.**

**Kill-test del hito:** preguntale a Justin qué significa que `delivered` venga en `true`, y si el compilador impide construir un `recipient` con sus dos campos vacíos. Si tiene que abrir el `.ts` para contestar, no está hecho.

**Estado:** TODO

#### H1.S1 — Contrato congelado (si esto no está fijo, todo lo demás flota)

**CA:** Dado el corte, cuando alguien pide la definición del puerto, entonces la recibe congelada con su hash y su commit, y con la lista de archivos que la consumen hoy.

**DoD:** Las 4 microtareas en `HECHO`, con la salida de `git cat-file -p <SHA>:<ruta>` y del hash pegadas. Una firma transcrita de memoria no cuenta.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H1.S1.M1 | Obtener el archivo del puerto en el corte y fijar su hash | Hay un hash del contenido exacto del archivo, junto al SHA del commit del que salió | Salida literal de `git show <SHA>:src/modules/scheduling/ports/agenda-notice.port.ts` y del hash del contenido, ambas pegadas. Si la ruta no existe en el corte, `NOT_FOUND` con el patrón de búsqueda usado — **no** buscar el archivo en otra rama para "encontrarlo" | TODO |
| H1.S1.M2 | Pegar la definición literal de `AgendaNoticePort`, `emit`, `emitMany` y `AGENDA_NOTICE_PORT` | Están las firmas completas, copiadas, no reescritas ni "normalizadas" | Bloque literal pegado. **Una firma transcrita de memoria no cuenta**: tiene que salir del archivo | TODO |
| H1.S1.M3 | Registrar que la definición leída **no trae versión de contrato** y asignarle una identidad propia | Queda escrito que la versión es **asignada por el equipo**, no leída del archivo (`PERFIL_MANTRA_DEV.md` §3.1) | Ficha de Identidad de `ARQUITECTURA_Y_CONTRATOS.md` §3: nombre estable, versión asignada, hash, formato/dialecto y fuente. El campo Estado debe decir `IMPLEMENTADO`, no `OBJETIVO ACORDADO`: estás describiendo lo que hay | TODO |
| H1.S1.M4 | Inventariar los consumidores actuales del token | Está la lista de archivos que referencian `AGENDA_NOTICE_PORT` o el tipo, con ruta real | Salida del grep pegada. Un cambio de contrato afecta a esta lista: es el insumo de compatibilidad (`ARQUITECTURA_Y_CONTRATOS.md` §7) | TODO |

#### H1.S2 — Semántica: qué garantiza el tipo y qué es sólo un comentario

**CA:** Dado el resultado del puerto, cuando alguien pregunta qué garantiza el tipo y qué es sólo un comentario, entonces tu tabla lo separa campo por campo, sin atribuirle al compilador nada que no haga.

**DoD:** Las 7 microtareas en `HECHO`. **Los 8 campos** del resultado, no los 6 del paquete. La regla «exactamente uno» especificada como validación runtime con su fuente.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H1.S2.M1 | Tabla de semántica del resultado, campo por campo | Cada uno de los campos observados tiene su significado **según la definición leída**, y ninguno tiene significado inventado | Tabla con los **8** campos reales: `delivered`, `inAppNotificationId`, `notificationRequestId`, **`skippedReason`**, `emailRequestId`, `emailSkippedReason`, `chatDelivered` y **`chatSkippedReason`**. ⚠️ `PILOTO_MANTRA.md` paso 2 lista solo **6**: omite `skippedReason` y `chatSkippedReason`. Ya está verificado contra el corte (ver el bloque de arriba): **gana el archivo**, y la discrepancia con el paquete queda registrada | TODO |
| H1.S2.M2 | Declarar explícitamente qué **no** prueba `delivered` | Está escrito que es resultado de entrega in-app y que **no prueba correo entregado** | Cita del paquete + lo que verificaste en el archivo. Si el archivo no lo aclara, el estado es `HYPOTHESIS`, no hecho | TODO |
| H1.S2.M3 | La regla «exactamente uno» de `recipient` | Está la cita literal del comentario, y la afirmación explícita de que el tipo **no** la hace cumplir | Comentario pegado con localizador + especificación del validador runtime (dónde cruza el límite de confianza, qué rechaza, con qué error) y **fuente identificada** de la regla. No implementarlo: especificarlo | TODO |
| H1.S2.M4 | Orden, cardinalidad y errores por elemento de `emitMany` | Para cada uno: lo que el archivo define, o `DECISION_REQUIRED` si no lo define | Fragmentos pegados. Prohibido asumir que el orden de salida sigue al de entrada si la firma no lo dice | TODO |
| H1.S2.M5 | Significado de `debounceKey` | Está lo que el archivo dice, y marcado como `DECISION_REQUIRED` lo que no dice | Cita + registro. **No inventes ventana de deduplicación ni TTL** (`PILOTO_MANTRA.md` paso 2, textual). Si escribís "por defecto 5 minutos", inventaste | TODO |
| H1.S2.M6 | Autorización y multi-organización en el contrato | Está declarado qué identifica al actor, al tenant y al titular del recurso en la firma, y qué **no** viaja | Ficha de Autorización de §3. Si el puerto no transporta tenant, eso es un hallazgo de seguridad a registrar, no un detalle | TODO |
| H1.S2.M7 | Errores: forma, reintentabilidad y efectos que no deben persistir | Cada modo de error tiene forma, significado y si es reintentable, o queda `DECISION_REQUIRED` | Ficha de Errores de §3. Un error sin clasificar de reintentabilidad bloquea el diseño de idempotencia de Justin: marcalo, no lo completes a ojo | TODO |

#### H1.S3 — Lo que queda abierto y la entrega

**CA:** Dado lo que el archivo no define, cuando se cierra el hito, entonces está registrado como `DECISION_REQUIRED` con quién decide, y el artefacto queda publicado y citable por versión.

**DoD:** Las 3 microtareas en `HECHO`. **Elegir un lado de la tensión de durabilidad es incumplir el encargo**, aunque uno parezca obviamente correcto.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H1.S3.M1 | Recibir de Pablo la tensión de semántica del aviso y dejarla **sin resolver** | Está la cita del comentario del puerto (un aviso fallido puede descartarse) junto a la del metaprompt (durabilidad exigida para efectos obligatorios), y el estado es `DECISION_REQUIRED` con quién decide | Ambas citas con localizador. **Elegir una de las dos es incumplir el encargo**, aunque una te parezca obviamente correcta | TODO |
| H1.S3.M2 | Ficha de Efectos posteriores y Compatibilidad | Está declarado si el aviso es obligatorio u opcional **según fuente**, y qué cambios del contrato romperían a los consumidores de M4 | Fichas de §3 completas o con omisiones justificadas. Compatibilidad distingue lectura, escritura y significado (§7) | TODO |
| H1.S3.M3 | Publicar el snapshot como artefacto consumible | Existe un archivo de contrato con su hash que Itzan y Justin pueden referenciar por versión, no por rama | Ruta del artefacto + hash + el commit del que salió. Avisar en el daily. El producto compone **versiones verificadas**, no la rama viva del vecino (`PLAN_SEIS_DIAS.md`) | TODO |

### H2 — Convertir el contrato en un validador que rechaza lo que debe rechazar

**Prioridad:** `ALTA`

**CA:** Dado un dato de estructura válida pero semánticamente incorrecto, cuando lo recibe el validador, entonces lo **rechaza nombrando la regla concreta** — no lo acepta por cumplir el esquema.

**DoD:** Las 8 microtareas en `HECHO` o `BLOCKED`. Ninguna regla implementada sin fuente identificada. El oráculo **no** usa la función que prueba para calcular el esperado.

**Kill-test del hito:** Pasale al validador un `recipient` con sus dos campos vacíos y un monto o tenant incorrecto según la regla aprobada. Si los acepta porque «cumple el esquema», no está hecho.

**Estado:** TODO

#### H2.S1 — El validador

**CA:** Dado un `recipient` con cero o con dos campos, cuando pasa por el validador, entonces es rechazado, y el rechazo nombra la regla y su fuente.

**DoD:** Las 3 microtareas en `HECHO`, con los dos casos negativos y su salida. El origen del valor esperado, escrito (`L5`).

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H2.S1.M1 | Implementar la regla «exactamente uno» de `recipient` como validación runtime | Rechaza cero campos y rechaza dos | Los dos casos negativos con su salida. La fuente de la regla, citada | TODO |
| H2.S1.M2 | Validar la forma completa del resultado contra la definición fijada | Un campo de más o de menos se detecta | Caso ejecutado | TODO |
| H2.S1.M3 | El oráculo NO usa la función que prueba para calcular lo esperado | Está escrito de dónde sale el valor esperado | Cita de `L5` + el origen del esperado. Es el error que hace que un test pase siempre | TODO |

#### H2.S2 — Los casos que tienen que fallar

**CA:** Dado un doble que devuelve una respuesta incompatible o un dato con tenant incorrecto, cuando se ejecuta el caso, entonces falla por la regla concreta.

**DoD:** Las 3 microtareas en `HECHO`. ADV-03 ejecutado, y la lista de reglas que el validador **todavía no puede** comprobar.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H2.S2.M1 | ADV-03: dato de estructura válida con tenant incorrecto | El validador lo rechaza **por la regla concreta**, no por esquema | Caso + el mensaje de rechazo, que debe nombrar la regla | TODO |
| H2.S2.M2 | Respuesta incompatible del doble | Se detecta | Caso ejecutado (gate A6) | TODO |
| H2.S2.M3 | Registrar qué reglas NO puede comprobar el validador todavía | Está la lista con el motivo | Lista. Una regla `DECISION_REQUIRED` no se implementa a ojo | TODO |

#### H2.S3 — Versión y compatibilidad

**CA:** Dado el artefacto de contrato, cuando un consumidor lo usa, entonces lo referencia por versión y hash, y está declarado si es compatible o afectado.

**DoD:** Las 2 microtareas en `HECHO`. Compatibilidad distinguida en lectura, escritura y significado.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H2.S3.M1 | Publicar el artefacto de contrato versionado con su hash | Versión inmutable + hash + commit | Artefacto + hash pegados | TODO |
| H2.S3.M2 | Probar el contrato contra los consumidores inventariados en **H1** | Cada consumidor: compatible o afectado | Tabla. *Añadir un enum o una propiedad puede ser incompatible para un consumidor exhaustivo*: distinguí compatibilidad de lectura, de escritura y de significado | TODO |

### H3 — Gobernar la evolución del contrato sin romper a quien lo consume

**Prioridad:** `MEDIA`

**CA:** Dada una versión contractual incompatible en copia temporal, cuando corren los consumidores, entonces **los afectados fallan** y los artefactos históricos permanecen con el mismo hash.

**DoD:** Las 7 microtareas en `HECHO` o `BLOCKED`. Ningún contrato publicado modificado: los cambios crean versión nueva. Ninguna celda de la matriz en blanco sin declararse.

**Kill-test del hito:** Introducí una versión incompatible en una copia temporal. Si los consumidores afectados siguen en verde, la matriz de compatibilidad no vale nada.

**Estado:** TODO

#### H3.S1 — La política

**CA:** Dada la política de compatibilidad, cuando alguien propone un cambio, entonces sabe si rompe, a quién, y en qué sentido (lectura, escritura o significado).

**DoD:** Las 2 microtareas en `HECHO`. Escrito que **agregar un enum o una propiedad puede romper** a un consumidor exhaustivo, con el caso concreto del contrato real.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H3.S1.M1 | Escribir qué cambios se admiten sin romper y cuáles no | Cada tipo de cambio tiene su clasificación | Tabla. Distinguí compatibilidad **de lectura, de escritura y de significado** | TODO |
| H3.S1.M2 | Registrar que agregar un enum o una propiedad puede romper | Está escrito con el caso concreto | Cita de §7 + ejemplo del contrato real | TODO |

#### H3.S2 — La prueba

**CA:** Dada una versión incompatible introducida a propósito, cuando corre la matriz, entonces falla donde la matriz dice que debe fallar.

**DoD:** Las 3 microtareas en `HECHO`. ADV-06 ejecutado con su salida. **Si los consumidores afectados pasan, la matriz está mal** y el hito no avanza.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H3.S2.M1 | ADV-06: introducir una versión incompatible en copia temporal | Los consumidores afectados **fallan** en la nueva combinación | Salida pegada. Si pasan, la matriz está mal | TODO |
| H3.S2.M2 | Verificar que los artefactos históricos permanecen inmutables | La versión anterior sigue igual y con el mismo hash | Hash comparado y pegado | TODO |
| H3.S2.M3 | Matriz consumidor × versión | Cada celda: compatible, incompatible o no probada | Matriz completa. **Las celdas «no probadas» se declaran**, no se dejan en blanco | TODO |

#### H3.S3 — El contrato de la segunda capacidad

**CA:** Dada la segunda capacidad, cuando se abre su ficha de contrato, entonces reusa lo que corresponde y declara lo que no, sin copiar el contrato entero.

**DoD:** Las 2 microtareas en `HECHO`, o `BLOCKED` esperando la elección de la segunda capacidad.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H3.S3.M1 | Si Pablo ya eligió la segunda capacidad, abrir su ficha de contrato | La ficha existe con sus campos de §3, o queda `BLOCKED` esperando la elección | Ficha o bloqueo con motivo | TODO |
| H3.S3.M2 | Registrar qué se reusa del primer contrato y qué no | Está la lista | Lista. **No copies el contrato entero para disimular una dependencia** | TODO |

### H4 — Congelar la versión estable del contrato y su matriz de consumidores

**Prioridad:** `MEDIA`

**CA:** Dada la versión estable, cuando alguien lee su ficha, entonces cada campo está completo u omitido **con justificación**, y cada punto abierto tiene nombre de quién decide.

**DoD:** Las 7 microtareas en `HECHO` o `BLOCKED`. Ningún campo completado por criterio propio. Ningún `DECISION_REQUIRED` sin dueño.

**Kill-test del hito:** Buscá en la ficha el campo «Efectos posteriores». Si dice que el aviso es obligatorio o que es opcional sin citar quién lo decidió, alguien resolvió una decisión de negocio por su cuenta.

**Estado:** TODO

#### H4.S1 — La ficha completa

**CA:** Dada la ficha de contrato, cuando se la revisa, entonces no hay campos olvidados: están completos o justificadamente omitidos, y el campo Estado no mezcla implementado con objetivo.

**DoD:** Las 2 microtareas en `HECHO`. Un campo omitido sin justificar es un campo olvidado.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H4.S1.M1 | Completar los campos de la ficha de §3 que correspondan | Cada campo: completo, o omitido **con justificación** | Ficha. Un campo omitido sin justificar es un campo olvidado | TODO |
| H4.S1.M2 | Marcar el campo Estado correctamente | `IMPLEMENTADO`, `OBJETIVO ACORDADO` o `PROPUESTA`, sin mezclarlos | Ficha. *No confundirlos* es textual del paquete | TODO |

#### H4.S2 — Congelar

**CA:** Dada la versión estable, cuando se publica, entonces tiene hash y commit, la matriz está completa y las versiones anteriores siguen intactas.

**DoD:** Las 3 microtareas en `HECHO`, con los hashes comparados y pegados.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H4.S2.M1 | Publicar la versión estable con hash | Versión, hash y commit | Los tres pegados | TODO |
| H4.S2.M2 | Actualizar la matriz consumidor × versión | Todas las celdas con resultado o `NOT_RUN` | Matriz | TODO |
| H4.S2.M3 | Verificar que las versiones anteriores no cambiaron | Hashes idénticos a los publicados | Comparación pegada | TODO |

#### H4.S3 — Lo que queda abierto

**CA:** Dado lo que queda sin decidir, cuando se cierra el hito, entonces cada pendiente tiene dueño con nombre y un plan de transición escrito.

**DoD:** Las 2 microtareas en `HECHO`. **Sin dueño, una decisión pendiente no avanza nunca.**

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H4.S3.M1 | Listar lo `DECISION_REQUIRED` con su dueño y qué bloquea | Cada uno con nombre de quién decide | Lista. Sin dueño, una decisión pendiente no avanza nunca | TODO |
| H4.S3.M2 | Escribir el plan de transición de los cambios previstos | Qué consumidores se tocan y en qué orden | Plan. Un cambio que rompe a otro repo **exige coordinación y orden de despliegue** | TODO |

### H5 — Probar que una versión incompatible rompe donde debe y que lo histórico no se toca

**Prioridad:** `ALTA`

**CA:** Dado el conjunto de versiones publicadas, cuando se compara su hash contra el del día de publicación, entonces coinciden; y una incompatibilidad introducida a propósito rompe exactamente a los consumidores que la matriz predice.

**DoD:** Las 7 microtareas en `HECHO` o `BLOCKED`. Ninguna versión publicada modificada. ADV-06 falló donde tenía que fallar.

**Kill-test del hito:** Compará el hash de la versión publicada hace tres días contra el de hoy. Si cambió, alguien editó una versión inmutable y toda la trazabilidad se cae.

**Estado:** TODO

#### H5.S1 — La prueba adversa

**CA:** Dada una versión incompatible en copia temporal, cuando corren los consumidores, entonces los afectados fallan y queda registrado cuál y con qué error.

**DoD:** Las 3 microtareas en `HECHO`, con la salida y la comparación de hashes históricos pegadas.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H5.S1.M1 | ADV-06: introducir una versión incompatible en copia temporal | Los consumidores afectados fallan | Salida pegada. Si pasan, la matriz miente | TODO |
| H5.S1.M2 | Verificar que los artefactos históricos permanecen inmutables | Hashes idénticos | Comparación pegada | TODO |
| H5.S1.M3 | Registrar qué consumidor falló y con qué error | Cada uno | Tabla | TODO |

#### H5.S2 — La matriz final

**CA:** Dada la matriz consumidor × versión, cuando se la cierra, entonces ninguna celda está en blanco: tiene resultado o `NOT_RUN` con motivo.

**DoD:** Las 2 microtareas en `HECHO`.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H5.S2.M1 | Completar la matriz consumidor × versión | Ninguna celda en blanco: resultado o `NOT_RUN` con motivo | Matriz | TODO |
| H5.S2.M2 | Declarar la estrategia de transición de cada incompatibilidad conocida | Cada una con su plan | Tabla | TODO |

#### H5.S3 — El cierre del contrato

**CA:** Dado el cierre del contrato, cuando alguien pregunta qué falta decidir, entonces la lista tiene dueño por ítem y el estado del contrato no mezcla categorías.

**DoD:** Las 2 microtareas en `HECHO`. Al llegar a **H5**, una decisión sin dueño es un **riesgo de release** y se declara como tal.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H5.S3.M1 | Listar lo que queda `DECISION_REQUIRED` al cierre | Cada uno con dueño y qué bloquea | Lista. Al llegar a **H5**, una decisión sin dueño es un riesgo de release | TODO |
| H5.S3.M2 | Declarar el estado final del contrato | `IMPLEMENTADO` / `OBJETIVO ACORDADO` / `PROPUESTA`, sin mezclar | Estado | TODO |

### H6 — Cerrar el contrato y dejar sus pendientes con dueño

**Prioridad:** `ALTA`

**CA:** Dado el cierre, cuando alguien busca un pendiente del contrato sin dueño, entonces **no encuentra ninguno**; y toda versión publicada conserva su hash original.

**DoD:** Las 7 microtareas en `HECHO` o `BLOCKED`. Ningún pendiente sin dueño con nombre. Ningún campo de la ficha completado por criterio propio.

**Kill-test del hito:** Buscá un pendiente sin dueño. Si existe, ese pendiente no se va a resolver nunca y alguien lo va a descubrir en producción.

**Estado:** TODO

#### H6.S1 — La versión final

**CA:** Dada la versión final, cuando se publica, entonces tiene hash y commit, la ficha está completa, y todas las versiones anteriores siguen intactas.

**DoD:** Las 3 microtareas en `HECHO`, con la comparación de hashes pegada.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H6.S1.M1 | Publicar la versión final con hash y commit | Los tres | Pegados | TODO |
| H6.S1.M2 | Completar la ficha de §3 | Cada campo completo u omitido con justificación | Ficha | TODO |
| H6.S1.M3 | Verificar inmutabilidad de todas las versiones anteriores | Hashes intactos | Comparación pegada | TODO |

#### H6.S2 — Los pendientes

**CA:** Dado cada `DECISION_REQUIRED`, cuando se cierra el turno, entonces tiene dueño con nombre, fecha objetivo y la consecuencia de no decidirlo.

**DoD:** Las 2 microtareas en `HECHO`. **Un pendiente sin dueño es un pendiente abandonado.**

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H6.S2.M1 | Listar cada `DECISION_REQUIRED` con dueño y fecha objetivo | Ninguno sin dueño | Lista. **Un pendiente sin dueño es un pendiente abandonado** | TODO |
| H6.S2.M2 | Declarar el impacto de cada pendiente si no se decide | Cada uno con su consecuencia | Tabla | TODO |

#### H6.S3 — Riesgos residuales

**CA:** Dado el contrato entregado, cuando alguien pregunta qué queda frágil, entonces hay una tabla de riesgos residuales con impacto y qué consumidores quedan expuestos.

**DoD:** Las 2 microtareas en `HECHO`.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H6.S3.M1 | Listar los riesgos residuales del contrato | Cada uno con impacto y mitigación o su ausencia | Tabla | TODO |
| H6.S3.M2 | Declarar qué consumidores quedan en riesgo por un cambio futuro | Lista | Tabla | TODO |

## 5. Ambigüedades registradas — **no las resuelvas, anotalas**

| ID | Ambigüedad | Quién puede resolverla | Qué bloquea |
|---|---|---|---|
| Q-01 | El paquete se fecha el **20-09-2026** y hoy es **19-09-2026** | Quien encargó el paquete | Nada técnico; afecta a qué «Día 1» significa |
| Q-C1 | **Seis bloques de trabajo en una noche no entran.** Está entregado completo y ordenado por dependencia | Coordinación | El alcance real del turno. **No recortes en silencio**: lo que no cierres va `A MEDIAS` |
| Q-06 | Durabilidad del aviso: sigue `DECISION_REQUIRED` | Negocio | El validador no puede decidirlo |
| Q-12 | Idempotencia sin definir | Negocio | El caso de repetición de Justin |
| Q-13 | Reintentos, fallos terminales y agotamiento | Negocio | El comportamiento ante proveedor indisponible |
| Q-05 | Convención de versionado del equipo | El equipo | La numeración, no la política |
| Q-24 | Si alguna incompatibilidad exige coordinar despliegue con el frontend | Coordinación | El orden de despliegue |

## 6. Definition of Done del turno

- [ ] Las **50 microtareas** están en `HECHO` o en `BLOCKED` con motivo y salida del error, o en `A MEDIAS` con qué anda, qué no anda y qué falta exactamente.
- [ ] **Ninguna microtarea quedó en `EN CURSO`** al cerrar.
- [ ] Todo estado de verificación es `PASS`/`FAIL`/`NOT_RUN`/`BLOCKED`. **No hay un solo `PASS` sin comando y exit code pegados.**
- [ ] Cada hito y cada subtarea tienen su Estado actualizado, no sólo las microtareas.
- [ ] Todo estado de verificación es `PASS`/`FAIL`/`NOT_RUN`/`BLOCKED`. **No hay un solo `PASS` sin comando y exit code pegados.**
- [ ] El documento separa `IMPLEMENTED_CONTRACT` de `TARGET_CONTRACT` y de `HYPOTHESIS`. Confundirlos es el error que este encargo existe para evitar.
- [ ] Toda regla que el compilador no hace cumplir está marcada como tal, con su fuente.
- [ ] Ninguna afirmación excede lo que leíste: si el archivo no lo dice, el documento no lo dice.
- [ ] Ninguna regla implementada sin fuente identificada.
- [ ] El validador rechaza al menos un caso de estructura válida y semántica inválida.
- [ ] El artefacto de contrato es citable por versión, no por rama.
- [ ] Ninguna afirmación excede lo que ejecutaste. *¿Algún éxito declarado depende de algo que no ejecutaste?*
- [ ] Ningún contrato publicado se modificó: los cambios crean versión nueva.
- [ ] ADV-06 se ejecutó y falló donde tenía que fallar.
- [ ] Ninguna celda de la matriz quedó en blanco sin declararse.
- [ ] Ningún campo de la ficha completado por criterio propio.
- [ ] Ninguna versión publicada fue modificada.
- [ ] Cada `DECISION_REQUIRED` tiene dueño con nombre.
- [ ] ADV-06 falló donde tenía que fallar.
- [ ] Ninguna celda de la matriz quedó en blanco.
- [ ] Ningún pendiente sin dueño con nombre.
- [ ] Ninguna versión publicada modificada.
- [ ] Avance reportado como `microtareas HECHO / 50`, **no** como porcentaje a ojo.
- [ ] Ningún dato real de paciente en ninguna salida pegada. Si lo tenía: enmascarado **y aclarado que se enmascaró**.

## 7. Handoff

Avisá por el daily **al cerrar cada hito**, no al final del turno:

| Al cerrar | A quién | Qué exactamente |
|---|---|---|
| **H1** | Itzan | Artefacto del contrato con hash y la ficha de Autorización |
| **H1** | Justin | Semántica del resultado, la regla «exactamente uno» y la clasificación de errores |
| **H1** | Pablo | Que la tensión de durabilidad sigue `DECISION_REQUIRED` |
| **H2** | Justin | El validador: su doble tiene que pasarlo |
| **H2** | Pablo | Qué comprueba el validador dentro del harness |
| **H2** | Itzan | Si el contrato cambió de hash desde ayer |
| **H3** | Justin | La matriz: es la que dice contra qué versiones probar |
| **H3** | Pablo | Qué contrato necesita la segunda capacidad |
| **H3** | Itzan | Si el artefacto empaquetado referencia una versión que va a cambiar |
| **H4** | Todo el equipo | La versión estable a consumir |
| **H4** | Marcelo | Qué decisiones de negocio siguen abiertas y bloquean la aceptación |
| **H4** | Justin | Contra qué versiones probar |
| **H5** | Marcelo | Qué decisión abierta impide firmar la aceptación |
| **H5** | Justin | Contra qué versión corre el candidato compuesto |
| **H5** | Itzan | Si hay que reempaquetar por un cambio de contrato |
| **H6** | Marcelo | Los pendientes que condicionan el dictamen |
| **H6** | Todo el equipo | La versión final del contrato |

Si un bloqueo se confirma, **no itere sobre él**: registrá la causa y pasá a la siguiente microtarea independiente. Un bloqueo se reporta **apenas aparece**, no al final.
