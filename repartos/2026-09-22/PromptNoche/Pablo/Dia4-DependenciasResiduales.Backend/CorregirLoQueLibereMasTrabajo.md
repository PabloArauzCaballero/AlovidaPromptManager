# Corregir las dependencias residuales que liberan más trabajo

> **Rol:** habilitación de autonomía · **Línea:** A · **Día del plazo:** 4 · **Turno:** noche
> **Paquete fuente:** `BACKEND_AUTONOMO_MANTRA`
> **Tu encargo sale de:** `PLAN_SEIS_DIAS.md` (Día 4, línea A) · `ARQUITECTURA_Y_CONTRATOS.md` §2 · evidencia del Día 2

## 0. Ficha de asignación

| Campo | Valor |
|---|---|
| `PROFILE` | `MANTRA_DEV` |
| `MODE` | `FIX_SCOPED` — corregís lo residual, **acotado**. Cada corrección tiene su microtarea |
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

Son **18**: 11 del proceso, que carga todo el equipo, y 7 propias de
*Corregir las dependencias residuales que liberan más trabajo*. Cargar = abrirlas y leerlas antes de empezar, no tenerlas en disco.

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
| `refactoring-safely` | cambiar sin romper, y cómo se demuestra |
| `scope-discipline` | lo que encontrás roto fuera de alcance se anota |
| `regression-suite-management` | qué se vuelve a correr después de tocar |

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

Las dependencias que el Día 2 dejó nombradas están corregidas o declaradas imposibles de corregir en el plazo, ordenadas por cuánto trabajo libera cada una.

**Kill-test (lo más barato que demuestra que NO está hecho):** Después de la corrección, volvé a correr la prueba de ausencia. Si no la reejecutaste, no sabés si corregiste algo: solo sabés que tocaste código.

## 3. Alcance

**IN:** priorización de las dependencias residuales por trabajo que liberan · corrección acotada de las elegidas · reejecución de la prueba de ausencia sobre lo corregido · registro de las no corregidas.

**OUT:** refactorizar lo que se vea feo de paso · corregir todas las residuales sin priorizar · declarar corregido sin reejecutar · heredar la evidencia del Día 2 para código nuevo.

## 4. Plan

### Subtarea S1.1 — Priorizar

| # | Microtarea | Criterio de aceptación | Definition of Done |
|---|---|---|---|
| M1 | Listar las dependencias residuales del Día 2 con su evidencia | Cada una con archivo y línea | Lista. Sin localizador no es una dependencia identificada: es una sospecha |
| M2 | Ordenarlas por trabajo que liberan | Cada una dice qué destraba | Tabla ordenada con el criterio escrito |
| M3 | Elegir cuáles entran en el día y cuáles no | La lista de entradas y la de descartadas, con motivo | Decisión escrita |

### Subtarea S1.2 — Corregir, una por una

| # | Microtarea | Criterio de aceptación | Definition of Done |
|---|---|---|---|
| M4 | Corregir la primera, con cambio mínimo | El diff toca solo lo necesario | Diff + comando de verificación |
| M5 | **Reejecutar la prueba de ausencia** sobre lo corregido | Pasa, o falla con causa nueva | Salida pegada. Regla 30.4: **un cambio posterior invalida el peldaño del área tocada** |
| M6 | Repetir para cada dependencia elegida, cerrando una antes de abrir la siguiente | Nunca hay dos en curso | Estado del plan por dependencia |

### Subtarea S1.3 — Lo que no se corrigió

| # | Microtarea | Criterio de aceptación | Definition of Done |
|---|---|---|---|
| M7 | Registrar las no corregidas con su motivo y su costo | Cada una: por qué no, y qué costaría | Tabla. Una dependencia no corregida y declarada es información; una escondida es una bomba |
| M8 | Declarar si el piloto sigue transicional | Estado actualizado con evidencia | Estado + evidencia de la reejecución |

## 5. Ambigüedades registradas — **no las resuelvas, anotalas**

| ID | Ambigüedad | Quién puede resolverla | Qué bloquea |
|---|---|---|---|
| Q-15 | Si conviene cambiar el corte del piloto en vez de corregir | Coordinación | La estrategia, no la corrección |
| Q-19 | Si alguna corrección toca código compartido con otro equipo | Coordinación | Esa corrección concreta: no la hagas sin acordarla |

## 6. Definition of Done del hito

- [ ] Las 8 microtareas están en `HECHO` o en `BLOCKED` con motivo y salida del error.
- [ ] Todo estado de verificación es `PASS`/`FAIL`/`NOT_RUN`/`BLOCKED`. **No hay un solo `PASS` sin comando y exit code pegados.**
- [ ] Cada corrección tiene su reejecución. Ninguna hereda evidencia vieja.
- [ ] Ningún refactor no solicitado entró en el diff.
- [ ] Las no corregidas están nombradas con su costo.
- [ ] Ninguna afirmación excede lo que ejecutaste. *¿Algún éxito declarado depende de algo que no ejecutaste?*
- [ ] Avance reportado como `microtareas HECHO / 8`, no como porcentaje a ojo.

## 7. Handoff

Al cerrar, avisá por el daily a:

- **Itzan** → Qué cambió en la composición y hay que reflejar en el baseline.
- **Ender** → Si alguna corrección movió el contrato.
- **Justin** → Si hay que reejecutar la relación por estos cambios.

Si un bloqueo se confirma, **no itere sobre él**: registrá la causa y pasá a la siguiente microtarea independiente.
