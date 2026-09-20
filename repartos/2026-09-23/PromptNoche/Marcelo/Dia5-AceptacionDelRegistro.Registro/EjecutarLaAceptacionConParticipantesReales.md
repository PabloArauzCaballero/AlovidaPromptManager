# Ejecutar la aceptación del registro con los participantes reales disponibles

> **Rol:** cierre funcional e integración · **Línea:** B · **Día del plazo:** 5 · **Turno:** noche
> **Paquete fuente:** `BACKEND_AUTONOMO_MANTRA`
> **Tu encargo sale de:** `PLAN_SEIS_DIAS.md` (Día 5, línea B) · `GATES_Y_PRUEBAS_ADVERSAS.md` gates C1 y C2 · `REQUISITOS-CLIENTE-ALOVIDA.md`

## 0. Ficha de asignación

| Campo | Valor |
|---|---|
| `PROFILE` | `MANTRA_DEV` |
| `MODE` | `ACCEPTANCE` — ejecutás la aceptación y reportás lo que da, no lo que conviene |
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

Son **19**: 11 del proceso, que carga todo el equipo, y 8 propias de
*Ejecutar la aceptación del registro con los participantes reales disponibles*. Cargar = abrirlas y leerlas antes de empezar, no tenerlas en disco.

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
| `uat-acceptance-signoff` | qué exige y qué no exige un dictamen |
| `qa-evidence-reporting` | el reporte de evidencia de la campaña |
| `progress-reporting` | el rojo se reporta apenas aparece |
| `exploratory-testing` | lo que los casos escritos no encuentran |

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

Existe una matriz de pasos del recorrido con su evidencia, que dice para cada uno si se ejercitó con participantes reales, con dobles, o no se ejercitó — y los fallos críticos están arriba, no al final.

**Kill-test (lo más barato que demuestra que NO está hecho):** Leé la primera línea del reporte de aceptación. Si hay algo en rojo y la primera línea no lo dice, el reporte está maquillado.

## 3. Alcance

**IN:** matriz de pasos con evidencia · ejecución con los participantes reales disponibles · fallos críticos declarados primero · decisiones de alcance explícitas · correspondencia final con el documento del cliente.

**OUT:** firmar aceptación del producto si falta un participante exigido · **sustituir integración externa por fixtures** · presentar un resumen optimista con algo en rojo · recortar requisitos en silencio para que cierre.

## 4. Plan

### Subtarea S4.1 — La ejecución

| # | Microtarea | Criterio de aceptación | Definition of Done |
|---|---|---|---|
| M1 | Ejecutar todos los pasos del recorrido exigido | Cada uno con resultado | Matriz paso × resultado × evidencia |
| M2 | Marcar por paso si el participante fue real, doble o ausente | Los tres estados, ninguno implícito | Columna obligatoria de la matriz (gate C2: **sin dobles ocultos**) |
| M3 | Registrar los fallos críticos y ponerlos primero | El reporte abre con lo que está en rojo | Reporte. *Prohibido el resumen optimista cuando hay algo en rojo* |

### Subtarea S4.2 — El alcance, explícito

| # | Microtarea | Criterio de aceptación | Definition of Done |
|---|---|---|---|
| M4 | Listar los recorridos exigidos que NO se ejecutaron | Cada uno con motivo | Lista |
| M5 | Registrar las decisiones de alcance tomadas y quién las tomó | Cada una con nombre | Tabla. *Un cambio de alcance requiere decisión explícita, no un reporte que disimula pendientes* |
| M6 | Actualizar la correspondencia con `REQUISITOS-CLIENTE-ALOVIDA.md` | Cada ítem del cliente: cubierto, parcial o no cubierto | Tabla actualizada |

### Subtarea S4.3 — El dictamen preliminar

| # | Microtarea | Criterio de aceptación | Definition of Done |
|---|---|---|---|
| M7 | Declarar el estado de entrega del producto | `PRODUCT_ACCEPTANCE_VERIFIED` solo si C está completo para el alcance exigido; si no, el estado real | Estado + evidencia |
| M8 | Declarar los límites externos | Cada proveedor externo no verificado queda como **aceptación externa pendiente** | Lista |

## 5. Ambigüedades registradas — **no las resuelvas, anotalas**

| ID | Ambigüedad | Quién puede resolverla | Qué bloquea |
|---|---|---|---|
| Q-04 | El registro funcional original sigue sin identificarse como archivo aprobado | Quien lo tenga | La aceptación **documental** integral. La técnica puede cerrar igual |
| Q-21 | Qué proveedor externo es exigible dentro del plazo | Coordinación | El alcance del dictamen |
| Q-R5 | Los 8 módulos del cliente contra el plazo | Coordinación | Qué significa «aceptado» acá |

## 6. Definition of Done del hito

- [ ] Las 8 microtareas están en `HECHO` o en `BLOCKED` con motivo y salida del error.
- [ ] Todo estado de verificación es `PASS`/`FAIL`/`NOT_RUN`/`BLOCKED`. **No hay un solo `PASS` sin comando y exit code pegados.**
- [ ] Ningún paso sin declarar si su participante fue real o doble.
- [ ] Los fallos críticos están en la primera línea del reporte.
- [ ] Ninguna decisión de alcance quedó sin dueño.
- [ ] Ningún dato de persona en la evidencia.
- [ ] Ninguna afirmación excede lo que ejecutaste. *¿Algún éxito declarado depende de algo que no ejecutaste?*
- [ ] Avance reportado como `microtareas HECHO / 8`, no como porcentaje a ojo.

## 7. Handoff

Al cerrar, avisá por el daily a:

- **Todo el equipo** → La matriz de aceptación y los rojos.
- **Pablo** → Las decisiones de alcance que exigen coordinación.
- **Justin** → Qué pasos hay que reejecutar mañana.

Si un bloqueo se confirma, **no itere sobre él**: registrá la causa y pasá a la siguiente microtarea independiente.
