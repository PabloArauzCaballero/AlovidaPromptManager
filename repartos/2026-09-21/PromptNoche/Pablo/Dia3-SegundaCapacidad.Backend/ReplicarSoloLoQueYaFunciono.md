# Elegir la segunda capacidad replicando solo mecanismos ya probados

> **Rol:** habilitación de autonomía · **Línea:** A · **Día del plazo:** 3 · **Turno:** noche
> **Paquete fuente:** `BACKEND_AUTONOMO_MANTRA`
> **Tu encargo sale de:** `PLAN_SEIS_DIAS.md` (Día 3, línea A) · `ARQUITECTURA_Y_CONTRATOS.md` §2 · `PILOTO_MANTRA.md` (cierre)

## 0. Ficha de asignación

| Campo | Valor |
|---|---|
| `PROFILE` | `MANTRA_DEV` |
| `MODE` | `DIAGNOSE_DESIGN` — elegís y justificás. La construcción viene después |
| `WORKSPACE` | Checkout real de `mantra-core-health-api`. Registrá la ruta exacta. No inventar ruta |
| `TARGET_REF` | El corte fijado por Pablo el Día 1. **Si cambió, ese es tu corte** y lo declarás |
| `AUTHORIZED_BATCH` | Tu directorio de evidencia del Día 3 |
| `PROCESS_SOURCE` | `METAPROMPT_PARA_ASTRA(1).md` (síntesis) + [`docs/requisitos/REQUISITOS-CLIENTE-ALOVIDA.md`](../../../../../docs/requisitos/REQUISITOS-CLIENTE-ALOVIDA.md) |
| `ALLOWED_INFRA` | Lectura del repo, `git`, `yarn`, `node`. PostgreSQL y Docker: **verificar, no asumir** |
| `Predecesor` | Tu lote del Día 2. **No repitas lo que ya verificaste; sí re-verificá lo que tocaste después** |

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
*Elegir la segunda capacidad replicando solo mecanismos ya probados*. Cargar = abrirlas y leerlas antes de empezar, no tenerlas en disco.

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
| `solid-principles` | abstraer con un segundo uso real, no antes |
| `component-architecture-solid` | fronteras que aguantan el segundo caso |
| `technical-debt-management` | qué deuda se acepta a conciencia |

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

Hay una segunda capacidad candidata elegida con criterio escrito, y una lista explícita de qué mecanismo del piloto se reusa **porque ya se demostró** y cuál no se reusa.

**Kill-test (lo más barato que demuestra que NO está hecho):** Preguntá qué mecanismo se está replicando y dónde está la evidencia de que funcionó en el piloto. Si no hay exit code detrás, se está replicando una idea, no un mecanismo.

## 3. Alcance

**IN:** criterio de elección de la segunda capacidad · inventario de mecanismos del piloto con su evidencia · cuáles se reusan y cuáles no · costo estimado por rango · qué dependencias libera.

**OUT:** construir la segunda capacidad hoy · **crear una plataforma o framework genérico** · crear abstracciones sin un segundo uso real · tocar el piloto para «generalizarlo».

## 4. Plan

### Subtarea S1.1 — Qué del piloto sirve de verdad

| # | Microtarea | Criterio de aceptación | Definition of Done |
|---|---|---|---|
| M1 | Inventariar los mecanismos que el piloto produjo | Cada uno con la evidencia que lo respalda | Tabla mecanismo → comando → exit code del Día 2. **Un mecanismo sin evidencia no se replica** |
| M2 | Marcar cuáles NO se reusan y por qué | Cada descartado tiene motivo | Tabla. Descartar es tan informativo como reusar |
| M3 | Declarar explícitamente que no se va a construir una plataforma universal | Está escrito en el documento | Cita: *evitar plataforma universal* · *no dedicar los seis días a crear herramientas genéricas* |

### Subtarea S1.2 — La segunda capacidad

| # | Microtarea | Criterio de aceptación | Definition of Done |
|---|---|---|---|
| M4 | Listar las candidatas con su dependencia bloqueante | Cada una: qué la bloquea hoy | Tabla |
| M5 | Elegir una, con el criterio escrito antes de la elección | Hay exactamente una elegida y las descartadas nombradas | Decisión + razón. Si depende de algo que no sabés: `DECISION_REQUIRED` con las opciones y su costo |
| M6 | Estimar por rango y listar incertidumbres | Hay rango, no un número único | Estimación. *Estimar cada lote por rango y listar incertidumbres* |

### Subtarea S1.3 — Lo que libera

| # | Microtarea | Criterio de aceptación | Definition of Done |
|---|---|---|---|
| M7 | Registrar qué trabajo desbloquea esta elección | Está la lista de lo que se destraba | Lista. El criterio del paquete es ordenar por *dependencias que desbloquean más trabajo* |
| M8 | Actualizar la capacidad restante del plazo | Está el remanente después de este lote | Tabla actualizada |

## 5. Ambigüedades registradas — **no las resuelvas, anotalas**

| ID | Ambigüedad | Quién puede resolverla | Qué bloquea |
|---|---|---|---|
| Q-15 | Si la dependencia residual del Día 2 obliga a cambiar el corte | Coordinación | La elección misma |
| Q-03 | `TEAM_CAPACITY` sigue sin calcularse | Coordinación | El compromiso de alcance |

## 6. Definition of Done del hito

- [ ] Las 8 microtareas están en `HECHO` o en `BLOCKED` con motivo y salida del error.
- [ ] Todo estado de verificación es `PASS`/`FAIL`/`NOT_RUN`/`BLOCKED`. **No hay un solo `PASS` sin comando y exit code pegados.**
- [ ] Ningún mecanismo replicado sin evidencia de ejecución del Día 2.
- [ ] No se creó ninguna abstracción nueva sin un segundo uso real.
- [ ] La estimación es un rango con incertidumbres listadas, no un número.
- [ ] Ninguna afirmación excede lo que ejecutaste. *¿Algún éxito declarado depende de algo que no ejecutaste?*
- [ ] Avance reportado como `microtareas HECHO / 8`, no como porcentaje a ojo.

## 7. Handoff

Al cerrar, avisá por el daily a:

- **Ender** → Qué contrato va a necesitar la segunda capacidad.
- **Itzan** → Qué composición reusa y qué no.
- **Marcelo** → Si la segunda capacidad toca su recorrido prioritario.

Si un bloqueo se confirma, **no itere sobre él**: registrá la causa y pasá a la siguiente microtarea independiente.
