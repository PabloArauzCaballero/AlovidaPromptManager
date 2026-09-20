# Correr la regresión del candidato final

> **Rol:** responsable de relación e integración · **Línea:** B · **Día del plazo:** 6 · **Turno:** noche
> **Paquete fuente:** `BACKEND_AUTONOMO_MANTRA`
> **Tu encargo sale de:** `PLAN_SEIS_DIAS.md` (Día 6, línea B) · `GATES_Y_PRUEBAS_ADVERSAS.md` gate C3 · regla 80.1

## 0. Ficha de asignación

| Campo | Valor |
|---|---|
| `PROFILE` | `MANTRA_DEV` |
| `MODE` | `REGRESSION` — en serie, en el orden de la pirámide de cierre |
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

Son **19**: 11 del proceso, que carga todo el equipo, y 8 propias de
*Correr la regresión del candidato final*. Cargar = abrirlas y leerlas antes de empezar, no tenerlas en disco.

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
| `api-testing` | matriz de autorizacion negativa y conformidad de contrato |
| `qa-evidence-reporting` | el formato de registro de un resultado |
| `e2e-failure-triage` | clasificar un rojo antes de tocar nada |
| `integrity-testing` | un test con el ORM mockeado no prueba persistencia |
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
- [ ] Leíste `skills-router` y las 19 skills de las dos tablas.
- [ ] Creaste tu `PLAN.md` **antes** del primer `Edit`/`Write` de código.

**Sin estas cuatro casillas, tu lote arranca en `BLOQUEADO`, no en `EN CURSO`.**

## 2. Resultado observable

El candidato final tiene su regresión corrida en el orden obligatorio, con cada etapa en su estado real, y el registro consolidado de todos los checks de la semana.

**Kill-test (lo más barato que demuestra que NO está hecho):** Mirá si alguna etapa se saltó. La pirámide no admite saltos: typecheck, lint, unitarios, integración, E2E dirigido, E2E de regresión, cross-browser.

## 3. Alcance

**IN:** las siete etapas de la pirámide en orden · regresión del módulo afectado · registro consolidado con los 13 campos · denominadores exactos y motivo de selección de tests.

**OUT:** paralelizar en la máquina de desarrollo · saltear una etapa que aplica · `continue-on-error` en un check obligatorio · **un workflow verde porque no seleccionó ninguna prueba**.

## 4. Plan

### Subtarea S5.1 — La pirámide, en orden

| # | Microtarea | Criterio de aceptación | Definition of Done |
|---|---|---|---|
| M1 | Etapas 1 y 2: typecheck y lint | Exit code pegado por etapa | Salidas. Estas **no habilitan decir que funciona** |
| M2 | Etapas 3 y 4: unitarios e integración relevantes al cambio | Resultados pegados | Salidas con los denominadores exactos |
| M3 | Etapas 5 y 6: E2E dirigido y E2E de regresión del módulo | Resultados pegados | Salidas. Un solo worker, con trace y screenshot en fallo |
| M4 | Etapa 7: smoke cross-browser si el proyecto lo soporta | Ejecutado o `NOT_RUN` con motivo | Salida o registro, un navegador por comando y secuencialmente |

### Subtarea S5.2 — Honestidad del resultado

| # | Microtarea | Criterio de aceptación | Definition of Done |
|---|---|---|---|
| M5 | Registrar los resultados omitidos por filtros como tales | Ninguno contado como pasado | Registro. *Evitá un workflow verde porque no seleccionó ninguna prueba* |
| M6 | Clasificar cada rojo en una de las cinco clases con evidencia | Cada uno | Tabla |
| M7 | Registrar el motivo de selección de tests y el denominador | Los dos | Registro |

### Subtarea S5.3 — Consolidar la semana

| # | Microtarea | Criterio de aceptación | Definition of Done |
|---|---|---|---|
| M8 | Registro consolidado de todos los checks A, B y C | Cada uno con sus 13 campos y rutas de evidencia existentes | Registro completo |
| M9 | Declarar qué gates obligatorios aplicables NO aprobaron | Lista | Tabla. *Todos los checks obligatorios aplicables del nivel deben aprobar para el mismo artefacto y configuración* |

## 5. Ambigüedades registradas — **no las resuelvas, anotalas**

| ID | Ambigüedad | Quién puede resolverla | Qué bloquea |
|---|---|---|---|
| Q-22 | Qué tests forman la regresión exigida | El equipo | El denominador del resultado |
| Q-21 | Proveedores externos no verificables | Coordinación | Los checks que quedan `BLOCKED` |

## 6. Definition of Done del hito

- [ ] Las 9 microtareas están en `HECHO` o en `BLOCKED` con motivo y salida del error.
- [ ] Todo estado de verificación es `PASS`/`FAIL`/`NOT_RUN`/`BLOCKED`. **No hay un solo `PASS` sin comando y exit code pegados.**
- [ ] Ninguna etapa aplicable se salteó.
- [ ] Ningún `skipped` contado como `PASS`.
- [ ] Ningún test borrado, comentado ni debilitado para cerrar.
- [ ] Todas las rutas de evidencia del registro consolidado existen.
- [ ] Ninguna afirmación excede lo que ejecutaste. *¿Algún éxito declarado depende de algo que no ejecutaste?*
- [ ] Avance reportado como `microtareas HECHO / 9`, no como porcentaje a ojo.

## 7. Handoff

Al cerrar, avisá por el daily a:

- **Marcelo** → El resultado de la regresión, incluido el rojo, para el dictamen.
- **Pablo** → Qué quedó en rojo y no se pudo reparar.
- **Todo el equipo** → El registro consolidado de la semana.

Si un bloqueo se confirma, **no itere sobre él**: registrá la causa y pasá a la siguiente microtarea independiente.
