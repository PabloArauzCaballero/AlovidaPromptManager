# Regresión de aislamiento y replay del contraejemplo

> **Rol:** habilitación de autonomía · **Línea:** A · **Día del plazo:** 5 · **Turno:** noche
> **Paquete fuente:** `BACKEND_AUTONOMO_MANTRA`
> **Tu encargo sale de:** `PLAN_SEIS_DIAS.md` (Día 5, línea A) · `GATES_Y_PRUEBAS_ADVERSAS.md` gate A8 y ADV-11

## 0. Ficha de asignación

| Campo | Valor |
|---|---|
| `PROFILE` | `MANTRA_DEV` |
| `MODE` | `REGRESSION` — corrés en serie, no en paralelo (regla 70.3) |
| `WORKSPACE` | Checkout real de `mantra-core-health-api`. Registrá la ruta exacta. No inventar ruta |
| `TARGET_REF` | El corte fijado por Pablo el Día 1. **Si cambió, ese es tu corte** y lo declarás |
| `AUTHORIZED_BATCH` | Tu directorio de evidencia del Día 5 |
| `PROCESS_SOURCE` | `METAPROMPT_PARA_ASTRA(1).md` (síntesis) + [`docs/requisitos/REQUISITOS-CLIENTE-ALOVIDA.md`](../../../../../docs/requisitos/REQUISITOS-CLIENTE-ALOVIDA.md) |
| `ALLOWED_INFRA` | Lectura del repo, `git`, `yarn`, `node`. PostgreSQL y Docker: **verificar, no asumir** |
| `Predecesor` | Tu lote del Día 4. **No repitas lo que ya verificaste; sí re-verificá lo que tocaste después** |

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
*Regresión de aislamiento y replay del contraejemplo*. Cargar = abrirlas y leerlas antes de empezar, no tenerlas en disco.

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
| `root-cause-debugging` | reproducir antes de diagnosticar |
| `agent-resource-control` | un build, una suite, un navegador por vez |
| `technical-docs-and-adr` | dejar la decision registrada donde alguien la encuentre |
| `regression-suite-management` | qué entra en la regresión y qué es cuarentena |
| `e2e-failure-triage` | clasificar el rojo antes de tocar |
| `root-cause-debugging` | reproducir primero |

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

La regresión de aislamiento pasa sobre la versión actual, y cualquier contraejemplo guardado se reproduce con las mismas versiones, seed, reloj y estado.

**Kill-test (lo más barato que demuestra que NO está hecho):** Tomá el contraejemplo de un fallo del Día 2 y reejecutalo. Si da otro resultado y nadie sabe por qué, la evidencia de toda la semana es frágil.

## 3. Alcance

**IN:** regresión de aislamiento sobre la versión actual · replay de contraejemplos guardados · fijación de versiones, seed, reloj y estado · registro de lo que cambió respecto de la corrida anterior.

**OUT:** paralelizar la suite para ir más rápido en la máquina de desarrollo · subir timeouts sin demostrar la causa · `skip` de un test que molesta · declarar verde una suite que no ejercita lo que tocaste.

## 4. Plan

### Subtarea S1.1 — Regresión

| # | Microtarea | Criterio de aceptación | Definition of Done |
|---|---|---|---|
| M1 | Correr la regresión de aislamiento, en serie | Termina y da un resultado | Salida pegada con el resumen. **Un solo worker en máquina de desarrollo** |
| M2 | Clasificar cada rojo en una de las cinco clases | Cada uno: `PRODUCT_BUG`, `TEST_BUG`, `ENVIRONMENT`, `DATA` o `EXTERNAL`, con evidencia | Tabla. **Clasificar sin evidencia está prohibido** |
| M3 | Registrar los `skipped` como `NOT_RUN` | Ninguno contado como `PASS` | Registro |

### Subtarea S1.2 — Replay

| # | Microtarea | Criterio de aceptación | Definition of Done |
|---|---|---|---|
| M4 | Reejecutar cada contraejemplo guardado con versiones, seed, reloj y estado | Da el mismo resultado, o bloquea explícitamente por precondición faltante | Salida pegada (ADV-11) |
| M5 | Registrar los que no se pudieron reproducir | Cada uno con qué falta | Lista. Un contraejemplo irreproducible es un problema, no un detalle |

### Subtarea S1.3 — Qué cambió

| # | Microtarea | Criterio de aceptación | Definition of Done |
|---|---|---|---|
| M6 | Comparar contra la corrida anterior | Están los que pasaron a rojo y los que se recuperaron | Diff de resultados |
| M7 | Declarar el peldaño de evidencia alcanzado por área | Cada área con su peldaño | Tabla. El peldaño del trabajo es **el más bajo** de sus áreas |

## 5. Ambigüedades registradas — **no las resuelvas, anotalas**

| ID | Ambigüedad | Quién puede resolverla | Qué bloquea |
|---|---|---|---|
| Q-22 | Qué tests forman la «regresión de aislamiento» exactamente | El equipo | El denominador. Declaralo, no lo dejes implícito |

## 6. Definition of Done del hito

- [ ] Las 7 microtareas están en `HECHO` o en `BLOCKED` con motivo y salida del error.
- [ ] Todo estado de verificación es `PASS`/`FAIL`/`NOT_RUN`/`BLOCKED`. **No hay un solo `PASS` sin comando y exit code pegados.**
- [ ] Ningún test borrado, comentado ni con la aserción debilitada.
- [ ] Ningún timeout subido sin trace o log que demuestre la causa.
- [ ] Los `skipped` están como `NOT_RUN`, no como `PASS`.
- [ ] Cada rojo tiene su clase con evidencia.
- [ ] Ninguna afirmación excede lo que ejecutaste. *¿Algún éxito declarado depende de algo que no ejecutaste?*
- [ ] Avance reportado como `microtareas HECHO / 7`, no como porcentaje a ojo.

## 7. Handoff

Al cerrar, avisá por el daily a:

- **Todo el equipo** → El estado real de la regresión, incluido el rojo.
- **Itzan** → Qué hay que reempaquetar si algo cambió.
- **Marcelo** → Si la regresión bloquea la aceptación.

Si un bloqueo se confirma, **no itere sobre él**: registrá la causa y pasá a la siguiente microtarea independiente.
