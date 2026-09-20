# Reejecutar los gates del artefacto reparado

> **Rol:** propietario de capacidad / aislamiento · **Línea:** A · **Día del plazo:** 6 · **Turno:** noche
> **Paquete fuente:** `BACKEND_AUTONOMO_MANTRA`
> **Tu encargo sale de:** `PLAN_SEIS_DIAS.md` (Día 6, línea A) · `GATES_Y_PRUEBAS_ADVERSAS.md` §5 · regla 30.4

## 0. Ficha de asignación

| Campo | Valor |
|---|---|
| `PROFILE` | `MANTRA_DEV` |
| `MODE` | `REVERIFY` — la versión cambió, así que la evidencia anterior **no se hereda** |
| `WORKSPACE` | Checkout real de `mantra-core-health-api`. Registrá la ruta exacta. No inventar ruta |
| `TARGET_REF` | El corte fijado por Pablo el Día 1. **Si cambió, ese es tu corte** y lo declarás |
| `AUTHORIZED_BATCH` | Tu directorio de evidencia del Día 6 |
| `PROCESS_SOURCE` | `METAPROMPT_PARA_ASTRA(1).md` (síntesis) + [`docs/requisitos/REQUISITOS-CLIENTE-ALOVIDA.md`](../../../../../docs/requisitos/REQUISITOS-CLIENTE-ALOVIDA.md) |
| `ALLOWED_INFRA` | Lectura del repo, `git`, `yarn`, `node`. PostgreSQL y Docker: **verificar, no asumir** |
| `Predecesor` | Tu lote del Día 5. **No repitas lo que ya verificaste; sí re-verificá lo que tocaste después** |

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
*Reejecutar los gates del artefacto reparado*. Cargar = abrirlas y leerlas antes de empezar, no tenerlas en disco.

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
| `data-quality-validation` | la deriva vuelve a chequearse tras cada cambio |
| `release-and-rollback` | versión nueva, evidencia nueva |
| `integrity-testing` | conteos, huérfanos y nulos otra vez |

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

El artefacto final tiene sus gates A reejecutados sobre la versión reparada, con su propia evidencia, y su estado de entrega corresponde a esa versión y no a la anterior.

**Kill-test (lo más barato que demuestra que NO está hecho):** Compará la versión del artefacto con la versión que aparece en la evidencia de cada gate. Si no coinciden, la evidencia es de otro software.

## 3. Alcance

**IN:** reejecución de los gates A aplicables sobre la versión reparada · verificación de deriva otra vez · nuevo hash y manifiesto · estado de entrega de esta versión.

**OUT:** **reusar la evidencia de la versión anterior sin justificación verificable** · empaquetar sin reejecutar · dejar la deriva sin verificar tras un cambio de esquema.

## 4. Plan

### Subtarea S2.1 — Reejecutar

| # | Microtarea | Criterio de aceptación | Definition of Done |
|---|---|---|---|
| M1 | Reejecutar typecheck y build delimitados sobre la versión reparada | Exit 0 | Salida pegada |
| M2 | Reejecutar arranque propio y aceptación local | Pasan o fallan con causa | Salida pegada |
| M3 | Reejecutar la verificación de deriva | En verde | Salida pegada. Si el esquema cambió, esto **no es opcional** |

### Subtarea S2.2 — Reempaquetar

| # | Microtarea | Criterio de aceptación | Definition of Done |
|---|---|---|---|
| M4 | Generar el artefacto final con nuevo hash y manifiesto | Hash nuevo, versión nueva | Los dos pegados |
| M5 | Enlazar cada gate con la evidencia **de esta versión** | Ninguna evidencia heredada sin justificar | Índice de evidencias con la versión en cada fila |

### Subtarea S2.3 — Estado final

| # | Microtarea | Criterio de aceptación | Definition of Done |
|---|---|---|---|
| M6 | Declarar el estado de entrega del artefacto final | El que sostiene la evidencia nueva | Estado |
| M7 | Listar los gates que quedaron `NOT_RUN` en la versión final | Lista | Tabla A1–A8 |

## 5. Ambigüedades registradas — **no las resuelvas, anotalas**

| ID | Ambigüedad | Quién puede resolverla | Qué bloquea |
|---|---|---|---|
| Q-23 | Si el módulo se entrega aunque el producto no apruebe | Coordinación | La comunicación del cierre |

## 6. Definition of Done del hito

- [ ] Las 7 microtareas están en `HECHO` o en `BLOCKED` con motivo y salida del error.
- [ ] Todo estado de verificación es `PASS`/`FAIL`/`NOT_RUN`/`BLOCKED`. **No hay un solo `PASS` sin comando y exit code pegados.**
- [ ] Ninguna evidencia de la versión anterior se atribuyó a la final sin justificación.
- [ ] La deriva está en verde sobre la versión final.
- [ ] Los gates `NOT_RUN` están declarados.
- [ ] Ninguna afirmación excede lo que ejecutaste. *¿Algún éxito declarado depende de algo que no ejecutaste?*
- [ ] Avance reportado como `microtareas HECHO / 7`, no como porcentaje a ojo.

## 7. Handoff

Al cerrar, avisá por el daily a:

- **Marcelo** → La versión final del módulo que entra en el dictamen.
- **Justin** → El artefacto a fijar en la regresión final.
- **Pablo** → Si algo se rompió al reempaquetar.

Si un bloqueo se confirma, **no itere sobre él**: registrá la causa y pasá a la siguiente microtarea independiente.
