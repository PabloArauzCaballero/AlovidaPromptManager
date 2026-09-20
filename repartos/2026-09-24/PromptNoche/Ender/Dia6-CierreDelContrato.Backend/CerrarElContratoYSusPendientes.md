# Cerrar el contrato y dejar sus pendientes con dueño

> **Rol:** propietario de contrato · **Línea:** A · **Día del plazo:** 6 · **Turno:** noche
> **Paquete fuente:** `BACKEND_AUTONOMO_MANTRA`
> **Tu encargo sale de:** `PLAN_SEIS_DIAS.md` (Día 6, línea A) · `ARQUITECTURA_Y_CONTRATOS.md` §3 y §7

## 0. Ficha de asignación

| Campo | Valor |
|---|---|
| `PROFILE` | `MANTRA_DEV` |
| `MODE` | `FREEZE` — cerrás lo cerrable y dejás lo abierto con dueño y fecha |
| `WORKSPACE` | Checkout real de `mantra-core-health-api`. Registrá la ruta exacta. No inventar ruta |
| `TARGET_REF` | El corte fijado por Pablo el Día 1. **Si cambió, ese es tu corte** y lo declarás |
| `AUTHORIZED_BATCH` | Tu directorio de evidencia del Día 6 |
| `PROCESS_SOURCE` | `METAPROMPT_PARA_ASTRA(1).md` (síntesis) + [`docs/requisitos/REQUISITOS-CLIENTE-ALOVIDA.md`](../../../../../docs/requisitos/REQUISITOS-CLIENTE-ALOVIDA.md) |
| `ALLOWED_INFRA` | Lectura del repo, `git`, `yarn`, `node`. PostgreSQL y Docker: **verificar, no asumir** |
| `Predecesor` | Tu lote del Día 5. **No repitas lo que ya verificaste; sí re-verificá lo que tocaste después** |

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
>
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
*Cerrar el contrato y dejar sus pendientes con dueño*. Cargar = abrirlas y leerlas antes de empezar, no tenerlas en disco.

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
| `api-openapi-docs` | la ficha de un contrato y como se versiona |
| `error-handling-contract` | el contrato de errores es parte del contrato |
| `typescript-standards` | los tipos no validan: donde hace falta validacion runtime |
| `technical-docs-and-adr` | registrar la decision, no discutirla dos veces |
| `technical-docs-and-adr` | la decisión y su porqué, escritas |
| `error-handling-contract` | los códigos estables al cierre |
| `api-openapi-docs` | deprecación documentada |

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

El contrato queda con su versión final, su ficha completa, su matriz de consumidores y una lista de pendientes donde **cada uno tiene nombre de quién decide**.

**Kill-test (lo más barato que demuestra que NO está hecho):** Buscá un pendiente sin dueño. Si existe, ese pendiente no se va a resolver nunca y alguien lo va a descubrir en producción.

## 3. Alcance

**IN:** versión final del contrato con hash · ficha completa · matriz final · pendientes con dueño · riesgos residuales del contrato.

**OUT:** decidir lo de negocio para «cerrar limpio» · modificar versiones publicadas · declarar cerrado un contrato con campos clave abiertos sin decirlo.

## 4. Plan

### Subtarea S3.1 — La versión final

| # | Microtarea | Criterio de aceptación | Definition of Done |
|---|---|---|---|
| M1 | Publicar la versión final con hash y commit | Los tres | Pegados |
| M2 | Completar la ficha de §3 | Cada campo completo u omitido con justificación | Ficha |
| M3 | Verificar inmutabilidad de todas las versiones anteriores | Hashes intactos | Comparación pegada |

### Subtarea S3.2 — Los pendientes

| # | Microtarea | Criterio de aceptación | Definition of Done |
|---|---|---|---|
| M4 | Listar cada `DECISION_REQUIRED` con dueño y fecha objetivo | Ninguno sin dueño | Lista. **Un pendiente sin dueño es un pendiente abandonado** |
| M5 | Declarar el impacto de cada pendiente si no se decide | Cada uno con su consecuencia | Tabla |

### Subtarea S3.3 — Riesgos residuales

| # | Microtarea | Criterio de aceptación | Definition of Done |
|---|---|---|---|
| M6 | Listar los riesgos residuales del contrato | Cada uno con impacto y mitigación o su ausencia | Tabla |
| M7 | Declarar qué consumidores quedan en riesgo por un cambio futuro | Lista | Tabla |

## 5. Ambigüedades registradas — **no las resuelvas, anotalas**

| ID | Ambigüedad | Quién puede resolverla | Qué bloquea |
|---|---|---|---|
| Q-06 | Durabilidad del aviso: si llega sin decidir al Día 6, se entrega como riesgo declarado | Negocio | El comportamiento ante fallo del aviso en producción |
| Q-12 | Idempotencia | Negocio | La política de reintento del consumidor |
| Q-13 | Reintentos | Negocio | El agotamiento visible |

## 6. Definition of Done del hito

- [ ] Las 7 microtareas están en `HECHO` o en `BLOCKED` con motivo y salida del error.
- [ ] Todo estado de verificación es `PASS`/`FAIL`/`NOT_RUN`/`BLOCKED`. **No hay un solo `PASS` sin comando y exit code pegados.**
- [ ] Ningún pendiente sin dueño con nombre.
- [ ] Ninguna versión publicada modificada.
- [ ] Ningún campo de la ficha completado por criterio propio.
- [ ] Ninguna afirmación excede lo que ejecutaste. *¿Algún éxito declarado depende de algo que no ejecutaste?*
- [ ] Avance reportado como `microtareas HECHO / 7`, no como porcentaje a ojo.

## 7. Handoff

Al cerrar, avisá por el daily a:

- **Marcelo** → Los pendientes que condicionan el dictamen.
- **Todo el equipo** → La versión final del contrato.

Si un bloqueo se confirma, **no itere sobre él**: registrá la causa y pasá a la siguiente microtarea independiente.
