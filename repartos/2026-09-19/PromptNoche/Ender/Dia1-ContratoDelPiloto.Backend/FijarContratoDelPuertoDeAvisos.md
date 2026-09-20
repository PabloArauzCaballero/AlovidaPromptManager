# Fijar el contrato real del puerto de avisos de agenda

> **Rol:** propietario de contrato · **Línea:** A · **Día del plazo:** 1 · **Turno:** noche
> **Paquete fuente:** `BACKEND_AUTONOMO_MANTRA` · aplica [PROMPT_MAESTRO_BACKEND_AUTONOMO.md](../../../../../../../Downloads/BACKEND_AUTONOMO_MANTRA/BACKEND_AUTONOMO_MANTRA/PROMPT_MAESTRO_BACKEND_AUTONOMO.md)
> **Tu encargo sale de:** `PILOTO_MANTRA.md` paso 2 · `ARQUITECTURA_Y_CONTRATOS.md` §3 · `PERFIL_MANTRA_DEV.md` §3 hallazgo 1

## 0. Ficha de asignación

| Campo | Valor |
|---|---|
| `PROFILE` | `MANTRA_DEV` |
| `MODE` | `DIAGNOSE_DESIGN` — **no modificás el backend**. Fijar un contrato es leerlo y documentarlo, no editarlo |
| `WORKSPACE` | Checkout real de `mantra-core-health-api`. Si no lo tenés clonado, clonalo y registrá la ruta exacta. No inventar ruta |
| `TARGET_REF` | **El SHA que fija Pablo esta misma noche** (su microtarea M1). Hasta que lo publique, trabajá contra el SHA de referencia del paquete `32ae939983f0d665e4ed371362858801134d35cd` y **marcá cada salida con el SHA que usaste**. Si el corte de Pablo resulta distinto, reejecutá el snapshot; no heredes el hash viejo |
| `AUTHORIZED_BATCH` | Documentos y snapshots en tu directorio de evidencia. Cero escrituras en `src/` de Mantra |
| `PROCESS_SOURCE` | `METAPROMPT_PARA_ASTRA(1).md` (síntesis). El registro funcional original **no está identificado** (`FUENTES_Y_LIMITES.md`): es un límite a arrastrar, no a resolver |
| `ALLOWED_INFRA` | Lectura del repo, `git`, herramienta de hash. No necesitás levantar la base para esta tarea |
| `Escritura permitida` | Solo tu directorio de evidencia. `scheduling.module.ts` y la composición: **reservados para Itzan** |

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

Son **18**: 11 del proceso, que carga todo el equipo, y 7 propias de
*Fijar el contrato real del puerto de avisos*. Cargar = abrirlas y leerlas antes de empezar, no tenerlas en disco.

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

Entrá siempre por `skills-router`: **no leas el catálogo entero, no sirve.** El router mapea la
situación concreta ("voy a tocar un endpoint", "voy a diseñar una pantalla") a la skill que
corresponde, y fija la precedencia cuando dos se pisan.

### 1.4 DoD de esta sección — se verifica como cualquier otra

- [ ] `ls .claude/skills | wc -l` devolvió **176**, y la salida está pegada en tu daily.
- [ ] `python .claude/hooks/plan_gate.py --self-test` devolvió **11 PASS, 0 FAIL**, salida pegada.
- [ ] Leíste `skills-router` y las 18 skills de las dos tablas.
- [ ] Creaste tu `PLAN.md` **antes** del primer `Edit`/`Write` de código.

**Sin estas cuatro casillas, tu lote arranca en `BLOQUEADO`, no en `EN CURSO`.**

## 2. Resultado observable

Al cerrar tu turno, Itzan y Justin pueden construir contra `AgendaNoticePort` **sin abrir el repositorio**:
tienen la definición congelada con hash y commit, y una tabla que dice, campo por campo, **qué garantiza el
tipo y qué es solamente un comentario**.

**Kill-test (lo más barato que demuestra que NO está hecho):** preguntale a Justin qué significa que
`delivered` venga en `true`, y si el compilador impide construir un `recipient` con sus dos campos vacíos.
Si tiene que abrir el `.ts` para contestar, no está hecho.

## 3. Alcance

**IN:** snapshot del puerto con hash y commit · ficha de contrato de `ARQUITECTURA_Y_CONTRATOS.md` §3 ·
semántica campo por campo del resultado · separación tipo vs comentario · especificación del validador
runtime · orden/cardinalidad/errores de `emitMany` · lo que `debounceKey` dice y lo que no · inventario de
consumidores actuales del puerto · registro de lo que queda `DECISION_REQUIRED`.

**OUT:** editar el puerto o cualquier archivo de Mantra · **resolver** la tensión de durabilidad del aviso
(es decisión de negocio, no tuya) · implementar el doble o el validador (eso es del laboratorio) · armar la
composición aislada (es de Itzan) · escribir el adaptador real (es de Justin) · inventar una ventana de
deduplicación o un TTL que el archivo no declara.

## 4. Plan

### Hito H1 — El contrato del piloto está fijado, es citable y distingue lo garantizado de lo supuesto

*Se le puede mostrar a cualquiera del equipo: "esta es la definición exacta, este es su hash, y esta es la
lista de reglas que el compilador **no** hace cumplir".*

**CA del hito:** Dado tu documento de contrato, cuando Itzan o Justin construyen un doble a partir de él,
entonces producen resultados que el validador acepta y regla que el tipo no cubre queda marcada como
validación runtime con su fuente — sin consultarte y sin abrir el repositorio.

---

#### Subtarea S1.1 — Contrato congelado (si esto no está fijo, todo lo demás flota)

| # | Microtarea | Criterio de aceptación | Definition of Done |
|---|---|---|---|
| M1 | Obtener el archivo del puerto en el corte y fijar su hash | Hay un hash del contenido exacto del archivo, junto al SHA del commit del que salió | Salida literal de `git show <SHA>:src/modules/scheduling/ports/agenda-notice.port.ts` y del hash del contenido, ambas pegadas. Si la ruta no existe en el corte, `NOT_FOUND` con el patrón de búsqueda usado — **no** buscar el archivo en otra rama para "encontrarlo" |
| M2 | Pegar la definición literal de `AgendaNoticePort`, `emit`, `emitMany` y `AGENDA_NOTICE_PORT` | Están las firmas completas, copiadas, no reescritas ni "normalizadas" | Bloque literal pegado. **Una firma transcrita de memoria no cuenta**: tiene que salir del archivo |
| M3 | Registrar que la definición leída **no trae versión de contrato** y asignarle una identidad propia | Queda escrito que la versión es **asignada por el equipo**, no leída del archivo (`PERFIL_MANTRA_DEV.md` §3.1) | Ficha de Identidad de `ARQUITECTURA_Y_CONTRATOS.md` §3: nombre estable, versión asignada, hash, formato/dialecto y fuente. El campo Estado debe decir `IMPLEMENTADO`, no `OBJETIVO ACORDADO`: estás describiendo lo que hay |
| M4 | Inventariar los consumidores actuales del token | Está la lista de archivos que referencian `AGENDA_NOTICE_PORT` o el tipo, con ruta real | Salida del grep pegada. Un cambio de contrato afecta a esta lista: es el insumo de compatibilidad (`ARQUITECTURA_Y_CONTRATOS.md` §7) |

#### Subtarea S1.2 — Semántica: qué garantiza el tipo y qué es sólo un comentario

> Esta es la subtarea que más daño evita. `ARQUITECTURA_Y_CONTRATOS.md` §3 lo dice explícito: *dos propiedades
> opcionales no hacen cumplir por sí mismas una regla «exactamente una»*. Y `PILOTO_MANTRA.md` paso 2:
> *no atribuir al compilador una validación que el tipo no hace*.

| # | Microtarea | Criterio de aceptación | Definition of Done |
|---|---|---|---|
| M5 | Tabla de semántica del resultado, campo por campo | Cada uno de los campos observados tiene su significado **según la definición leída**, y ninguno tiene significado inventado | Tabla con `delivered`, `inAppNotificationId`, `notificationRequestId`, `emailRequestId`, `emailSkippedReason`, `chatDelivered`. Contraste obligatorio contra la tabla de `PILOTO_MANTRA.md` paso 2: si tu lectura difiere de la del paquete, **gana el archivo** y la discrepancia se registra |
| M6 | Declarar explícitamente qué **no** prueba `delivered` | Está escrito que es resultado de entrega in-app y que **no prueba correo entregado** | Cita del paquete + lo que verificaste en el archivo. Si el archivo no lo aclara, el estado es `HYPOTHESIS`, no hecho |
| M7 | La regla «exactamente uno» de `recipient` | Está la cita literal del comentario, y la afirmación explícita de que el tipo **no** la hace cumplir | Comentario pegado con localizador + especificación del validador runtime (dónde cruza el límite de confianza, qué rechaza, con qué error) y **fuente identificada** de la regla. No implementarlo: especificarlo |
| M8 | Orden, cardinalidad y errores por elemento de `emitMany` | Para cada uno: lo que el archivo define, o `DECISION_REQUIRED` si no lo define | Fragmentos pegados. Prohibido asumir que el orden de salida sigue al de entrada si la firma no lo dice |
| M9 | Significado de `debounceKey` | Está lo que el archivo dice, y marcado como `DECISION_REQUIRED` lo que no dice | Cita + registro. **No inventes ventana de deduplicación ni TTL** (`PILOTO_MANTRA.md` paso 2, textual). Si escribís "por defecto 5 minutos", inventaste |
| M10 | Autorización y multi-organización en el contrato | Está declarado qué identifica al actor, al tenant y al titular del recurso en la firma, y qué **no** viaja | Ficha de Autorización de §3. Si el puerto no transporta tenant, eso es un hallazgo de seguridad a registrar, no un detalle |
| M11 | Errores: forma, reintentabilidad y efectos que no deben persistir | Cada modo de error tiene forma, significado y si es reintentable, o queda `DECISION_REQUIRED` | Ficha de Errores de §3. Un error sin clasificar de reintentabilidad bloquea el diseño de idempotencia de Justin: marcalo, no lo completes a ojo |

#### Subtarea S1.3 — Lo que queda abierto y la entrega

| # | Microtarea | Criterio de aceptación | Definition of Done |
|---|---|---|---|
| M12 | Recibir de Pablo la tensión de semántica del aviso y dejarla **sin resolver** | Está la cita del comentario del puerto (un aviso fallido puede descartarse) junto a la del metaprompt (durabilidad exigida para efectos obligatorios), y el estado es `DECISION_REQUIRED` con quién decide | Ambas citas con localizador. **Elegir una de las dos es incumplir el encargo**, aunque una te parezca obviamente correcta |
| M13 | Ficha de Efectos posteriores y Compatibilidad | Está declarado si el aviso es obligatorio u opcional **según fuente**, y qué cambios del contrato romperían a los consumidores de M4 | Fichas de §3 completas o con omisiones justificadas. Compatibilidad distingue lectura, escritura y significado (§7) |
| M14 | Publicar el snapshot como artefacto consumible | Existe un archivo de contrato con su hash que Itzan y Justin pueden referenciar por versión, no por rama | Ruta del artefacto + hash + el commit del que salió. Avisar en el daily. El producto compone **versiones verificadas**, no la rama viva del vecino (`PLAN_SEIS_DIAS.md`) |

## 5. Ambigüedades registradas — **no las resuelvas, anotalas**

| ID | Ambigüedad | Quién puede resolverla | Qué bloquea |
|---|---|---|---|
| Q-01 | El paquete se fecha el **20 de septiembre de 2026** y hoy es **19 de septiembre de 2026** | Quien encargó el paquete | Nada técnico; afecta a qué "Día 1" significa |
| Q-04 | El registro funcional original no está identificado; sólo hay la síntesis del metaprompt | Quien tenga el documento aprobado | La aceptación documental integral (C1). Tu trabajo de contrato **puede continuar** |
| Q-05 | El puerto no declara versión de contrato en el archivo leído | El equipo, al fijar la convención de versionado | La trazabilidad de compatibilidad. Asignás una versión y **declarás que la asignaste** |
| Q-06 | Obligatoriedad y durabilidad del aviso: el comentario del puerto y el metaprompt se contradicen | Decisión de negocio / quien encargó | El diseño de intención duradera de Justin y el caso 2 del catálogo del laboratorio |
| Q-07 | El paquete describe `chatDelivered` "cuando corresponde"; cuándo corresponde no está definido en lo leído | Quien definió el alcance del piloto | El alcance del caso de chat. Registrar, no suponer |

## 6. Definition of Done del hito

- [ ] Las 14 microtareas están en `HECHO` o en `BLOCKED` con motivo y salida del error.
- [ ] Todo estado de verificación es `PASS`/`FAIL`/`NOT_RUN`/`BLOCKED`. **No hay un solo `PASS` sin comando y exit code pegados.**
- [ ] El documento separa `IMPLEMENTED_CONTRACT` de `TARGET_CONTRACT` y de `HYPOTHESIS`. Confundirlos es el error que este encargo existe para evitar.
- [ ] Toda regla que el compilador no hace cumplir está marcada como tal, con su fuente.
- [ ] Ninguna afirmación excede lo que leíste: si el archivo no lo dice, el documento no lo dice.
- [ ] Avance reportado como `microtareas HECHO / 14`, no como porcentaje a ojo.

## 7. Handoff

Al cerrar, avisá por el daily a:
- **Itzan** → artefacto del contrato con hash (M14) y la ficha de Autorización (M10), que condiciona su composición.
- **Justin** → semántica del resultado (M5, M6), la regla «exactamente uno» (M7) y la clasificación de errores (M11): sin eso su doble estricto no puede validar nada.
- **Pablo** → la tensión que te pasó sigue `DECISION_REQUIRED` (M12) y necesita a alguien que decida.
- **Marcelo** → si el recorrido que elige toca avisos, el contrato fijado es el que manda.

Si un bloqueo se confirma, **no itere sobre él**: registrá la causa y pasá a la siguiente microtarea independiente.
