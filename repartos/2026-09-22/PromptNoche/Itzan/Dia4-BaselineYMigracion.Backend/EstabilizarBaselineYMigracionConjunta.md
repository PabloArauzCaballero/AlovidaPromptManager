# Estabilizar el baseline y probar la migración conjunta

> **Rol:** propietario de capacidad / aislamiento · **Línea:** A · **Día del plazo:** 4 · **Turno:** noche
> **Paquete fuente:** `BACKEND_AUTONOMO_MANTRA`
> **Tu encargo sale de:** `PLAN_SEIS_DIAS.md` (Día 4, línea A) · `ARQUITECTURA_Y_CONTRATOS.md` §4 · regla 97

## 0. Ficha de asignación

| Campo | Valor |
|---|---|
| `PROFILE` | `MANTRA_DEV` |
| `MODE` | `SCHEMA_VERIFY` — el esquema cambia por su fuente de verdad, **nunca a mano contra la base** |
| `WORKSPACE` | Checkout real de `mantra-core-health-api`. Registrá la ruta exacta. No inventar ruta |
| `TARGET_REF` | El corte fijado por Pablo el Día 1. **Si cambió, ese es tu corte** y lo declarás |
| `AUTHORIZED_BATCH` | Tu directorio de evidencia del Día 4 |
| `PROCESS_SOURCE` | `METAPROMPT_PARA_ASTRA(1).md` (síntesis) + [`docs/requisitos/REQUISITOS-CLIENTE-ALOVIDA.md`](../../../../../docs/requisitos/REQUISITOS-CLIENTE-ALOVIDA.md) |
| `ALLOWED_INFRA` | Lectura del repo, `git`, `yarn`, `node`. PostgreSQL y Docker: **verificar, no asumir** |
| `Predecesor` | Tu lote del Día 3. **No repitas lo que ya verificaste; sí re-verificá lo que tocaste después** |

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

Son **20**: 11 del proceso, que carga todo el equipo, y 9 propias de
*Estabilizar el baseline y probar la migración conjunta*. Cargar = abrirlas y leerlas antes de empezar, no tenerlas en disco.

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
| `mikroorm-patterns` | discovery, metadata, subscribers y transacciones |
| `database-design` | tablas propias, de referencia y de auditoria |
| `postgresql-advanced` | por que no se sustituye PostgreSQL por SQLite |
| `model-driven-schema` | dirección única del cambio de esquema |
| `data-quality-validation` | verificación de deriva como fallo, no advertencia |
| `backup-restore-dr` | un backup que no se probó restaurando no es un backup |
| `release-and-rollback` | expandir, migrar, contraer |
| `integrity-testing` | huérfanos, duplicados y nulos indebidos |

Entrá siempre por `skills-router`: **no leas el catálogo entero, no sirve.** El router mapea la
situación concreta ("voy a tocar un endpoint", "voy a diseñar una pantalla") a la skill que
corresponde, y fija la precedencia cuando dos se pisan.

### 1.4 DoD de esta sección — se verifica como cualquier otra

- [ ] `ls .claude/skills | wc -l` devolvió **176**, y la salida está pegada en tu daily.
- [ ] `python .claude/hooks/plan_gate.py --self-test` devolvió **11 PASS, 0 FAIL**, salida pegada.
- [ ] Leíste `skills-router` y las 20 skills de las dos tablas.
- [ ] Creaste tu `PLAN.md` **antes** del primer `Edit`/`Write` de código.

**Sin estas cuatro casillas, tu lote arranca en `BLOQUEADO`, no en `EN CURSO`.**

## 2. Resultado observable

El baseline es reproducible en otra máquina, la migración conjunta está probada en un entorno de prueba con su rollback, y la verificación de deriva está en verde.

**Kill-test (lo más barato que demuestra que NO está hecho):** Corré la verificación de deriva entre la fuente de verdad, la base y las entidades del ORM. Si nadie la corrió, el esquema y el código pueden estar diciendo cosas distintas hace días.

## 3. Alcance

**IN:** baseline reproducible con identidad · migración conjunta probada en entorno de prueba · estrategia de rollback o restauración comprobada · verificación de deriva · consultas de integridad.

**OUT:** **escribir DDL a mano contra la base** para destrabar · corregir un dato directamente en la base · sincronización automática de esquema · restaurar un backup de producción sin anonimizar.

## 4. Plan

### Subtarea S2.1 — Baseline reproducible

| # | Microtarea | Criterio de aceptación | Definition of Done |
|---|---|---|---|
| M1 | Levantar el baseline desde cero en un entorno limpio | Termina sin error y con los conteos esperados | Salida pegada con los conteos |
| M2 | Correr los checks de integridad y permisos antes del escenario | Sin huérfanos, sin duplicados, sin nulos indebidos | Consultas y resultados pegados |
| M3 | Segunda corrida del seeder para demostrar idempotencia | La segunda no inserta nada | Salida de las dos corridas pegadas (regla 97.4.3) |

### Subtarea S2.2 — Migración conjunta

| # | Microtarea | Criterio de aceptación | Definition of Done |
|---|---|---|---|
| M4 | Aplicar las migraciones candidatas sobre el baseline de producto en un entorno de prueba | Aplican sin error | Salida pegada. **Antes de aplicar donde importa, se prueba acá** |
| M5 | Verificar compatibilidad hacia atrás: expandir, migrar datos, contraer | El orden está respetado y declarado | Evidencia por etapa |
| M6 | Probar el rollback o la restauración | Se ejecuta y se verifica | Salida pegada. Si no es practicable, se declara por qué y cuál es el plan de recuperación |

### Subtarea S2.3 — Deriva

| # | Microtarea | Criterio de aceptación | Definition of Done |
|---|---|---|---|
| M7 | Verificación de deriva entre fuente de verdad, base y entidades del ORM | Sin tabla ausente, columna ausente, obligatoria no mapeada ni nulabilidad divergente | Salida pegada. **La deriva detectada bloquea el cierre**, no es una advertencia |
| M8 | Registrar los índices creados con nombre explícito | Ninguno con nombre generado | Listado pegado |

## 5. Ambigüedades registradas — **no las resuelvas, anotalas**

| ID | Ambigüedad | Quién puede resolverla | Qué bloquea |
|---|---|---|---|
| Q-20 | Si hay un baseline de producto acordado contra el que probar la migración conjunta | Coordinación | Solo la migración conjunta; el baseline local se puede probar igual |
| Q-09 | Grado de aislamiento alcanzado | Días 2 y 4 | Ya tiene veredicto |

## 6. Definition of Done del hito

- [ ] Las 8 microtareas están en `HECHO` o en `BLOCKED` con motivo y salida del error.
- [ ] Todo estado de verificación es `PASS`/`FAIL`/`NOT_RUN`/`BLOCKED`. **No hay un solo `PASS` sin comando y exit code pegados.**
- [ ] Ningún `ALTER TABLE` suelto contra la base.
- [ ] La deriva está en verde y su salida pegada.
- [ ] La idempotencia del seeder está demostrada con dos corridas.
- [ ] Ningún dato de producción se copió a un entorno de prueba.
- [ ] Ninguna afirmación excede lo que ejecutaste. *¿Algún éxito declarado depende de algo que no ejecutaste?*
- [ ] Avance reportado como `microtareas HECHO / 8`, no como porcentaje a ojo.

## 7. Handoff

Al cerrar, avisá por el daily a:

- **Pablo** → Si la deriva reveló algo que su corrección movió.
- **Justin** → El baseline fijado para su relación.
- **Marcelo** → Si el recorrido necesita datos que el baseline todavía no tiene.

Si un bloqueo se confirma, **no itere sobre él**: registrá la causa y pasá a la siguiente microtarea independiente.
