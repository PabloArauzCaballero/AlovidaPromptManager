# Diseñar los casos de aceptación del recorrido y sus datos

> **Rol:** cierre funcional e integración · **Línea:** B · **Día del plazo:** 2 · **Turno:** noche
> **Paquete fuente:** `BACKEND_AUTONOMO_MANTRA`
> **Tu encargo sale de:** `PLAN_SEIS_DIAS.md` (Día 2, línea B) · `REQUISITOS-CLIENTE-ALOVIDA.md` · `GATES_Y_PRUEBAS_ADVERSAS.md` gate C1

## 0. Ficha de asignación

| Campo | Valor |
|---|---|
| `PROFILE` | `MANTRA_DEV` |
| `MODE` | `DESIGN_TESTS` — diseñás los casos; ejecutarlos viene después |
| `WORKSPACE` | Checkout real de `mantra-core-health-api`. Registrá la ruta exacta. No inventar ruta |
| `TARGET_REF` | El corte fijado por Pablo el Día 1. **Si cambió, ese es tu corte** y lo declarás |
| `AUTHORIZED_BATCH` | Tu directorio de evidencia del Día 2 |
| `PROCESS_SOURCE` | `METAPROMPT_PARA_ASTRA(1).md` (síntesis) + [`docs/requisitos/REQUISITOS-CLIENTE-ALOVIDA.md`](../../../../../docs/requisitos/REQUISITOS-CLIENTE-ALOVIDA.md) |
| `ALLOWED_INFRA` | Lectura del repo, `git`, `yarn`, `node`. PostgreSQL y Docker: **verificar, no asumir** |
| `Predecesor` | Tu lote del Día 1. **No repitas lo que ya verificaste; sí re-verificá lo que tocaste después** |

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
*Diseñar los casos de aceptación del recorrido y sus datos*. Cargar = abrirlas y leerlas antes de empezar, no tenerlas en disco.

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
| `requirements-and-acceptance` | criterios de aceptacion observables |
| `vertical-slicing` | cortar por recorrido, no por capa |
| `data-privacy-phi` | gate obligatorio en todo lo que toque datos de personas |
| `qa-strategy` | que se prueba en cada nivel |
| `test-case-design-techniques` | partición, valores límite, tablas de decisión |
| `synthetic-test-data-generation` | datos realistas sin datos reales |
| `edge-case-data-catalog` | los bordes que no se te ocurren solos |
| `uat-acceptance-signoff` | qué exige un dictamen de aceptación |

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

El recorrido elegido tiene sus casos de aceptación escritos en dado/cuando/entonces, con datos sintéticos definidos y el oráculo de cada uno identificado.

**Kill-test (lo más barato que demuestra que NO está hecho):** Tomá un caso y preguntá de dónde sale el resultado esperado. Si la respuesta es «de lo que hace el sistema», no es un caso de aceptación: es una foto del bug.

## 3. Alcance

**IN:** casos en dado/cuando/entonces del recorrido elegido · datos sintéticos con ownership coherente · oráculo por caso, con su fuente en el documento del cliente · casos negativos · qué queda `DECISION_REQUIRED` por falta de regla.

**OUT:** implementar nada · ejecutar los casos · **inventar una regla, un porcentaje, una fórmula o un catálogo** que el documento del cliente no define · usar datos reales de personas.

## 4. Plan

### Subtarea S4.1 — Los casos

| # | Microtarea | Criterio de aceptación | Definition of Done |
|---|---|---|---|
| M1 | Escribir los casos del camino feliz en dado/cuando/entonces | Cada uno es observable y no menciona implementación | Casos escritos. Cada uno cita la sección del documento del cliente de la que sale |
| M2 | Escribir los casos negativos | Están los de autorización, los de dato inválido y los de estado incorrecto | Casos escritos. Un recorrido sin casos negativos no está diseñado |
| M3 | Identificar el oráculo de cada caso | Cada uno dice de dónde sale el esperado | Tabla caso → fuente del esperado. Si la fuente es el propio sistema, el caso **no vale** |

### Subtarea S4.2 — Los datos

| # | Microtarea | Criterio de aceptación | Definition of Done |
|---|---|---|---|
| M4 | Definir los datos sintéticos con relaciones y ownership coherentes | Ningún dato real de persona | Definición. Regla 97.6: **prohibido usar datos reales como datos de prueba** |
| M5 | Declarar la procedencia de todo catálogo que el recorrido necesite | Cada catálogo: fuente, fecha y licencia, o marcado como sintético | Tabla. Compañías de seguro, seguros públicos y ocupaciones del SEGIP son **catálogos oficiales**: exigen procedencia (regla 97.4) |
| M6 | Registrar qué datos NO se pueden generar por falta de regla | Lista con quién define cada uno | Lista. **No completes un porcentaje ni una fórmula a ojo** |

### Subtarea S4.3 — Lo que no cierra

| # | Microtarea | Criterio de aceptación | Definition of Done |
|---|---|---|---|
| M7 | Contrastar el recorrido elegido contra `REQUISITOS-CLIENTE-ALOVIDA.md` | Cada paso del recorrido tiene su párrafo en el documento del cliente, o está marcado como agregado | Tabla de correspondencia |
| M8 | Registrar los ítems del cliente que el recorrido NO cubre | Está la lista | Lista. Es el insumo de la conversación de alcance, y evita que se lea el piloto como todo Mantra |

## 5. Ambigüedades registradas — **no las resuelvas, anotalas**

| ID | Ambigüedad | Quién puede resolverla | Qué bloquea |
|---|---|---|---|
| Q-04 | El registro funcional original sigue sin identificarse como archivo | Quien tenga el aprobado | La aceptación documental. **Hay un candidato**: `docs/requisitos/REQUISITOS-CLIENTE-ALOVIDA.md`, que coincide en los 19 escenarios. Contrastalo, no lo des por cerrado |
| Q-10 | Cláusulas, fórmulas, unidades y porcentajes sin definir | Negocio | Los casos que dependan de ellos quedan `DECISION_REQUIRED` |
| Q-R4 | Las marcas COMPLETO/INCOMPLETO/FALTA del cliente no están verificadas | Quien hizo el relevamiento | No las uses como estado del sistema |

## 6. Definition of Done del hito

- [ ] Las 8 microtareas están en `HECHO` o en `BLOCKED` con motivo y salida del error.
- [ ] Todo estado de verificación es `PASS`/`FAIL`/`NOT_RUN`/`BLOCKED`. **No hay un solo `PASS` sin comando y exit code pegados.**
- [ ] Ningún caso usa el sistema como oráculo de sí mismo.
- [ ] Ningún dato de prueba es real.
- [ ] Ninguna regla de negocio fue completada por criterio propio.
- [ ] Ninguna afirmación excede lo que ejecutaste. *¿Algún éxito declarado depende de algo que no ejecutaste?*
- [ ] Avance reportado como `microtareas HECHO / 8`, no como porcentaje a ojo.

## 7. Handoff

Al cerrar, avisá por el daily a:

- **Justin** → Los casos negativos de autorización: van a su matriz.
- **Ender** → Qué reglas del recorrido el contrato todavía no expresa.
- **Pablo** → Qué datos necesita el laboratorio para estos casos.

Si un bloqueo se confirma, **no itere sobre él**: registrá la causa y pasá a la siguiente microtarea independiente.
