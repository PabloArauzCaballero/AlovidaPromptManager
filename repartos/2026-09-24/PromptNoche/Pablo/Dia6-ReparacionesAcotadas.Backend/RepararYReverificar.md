# Reparaciones acotadas y nueva verificación de lo afectado

> **Rol:** habilitación de autonomía · **Línea:** A · **Día del plazo:** 6 · **Turno:** noche
> **Paquete fuente:** `BACKEND_AUTONOMO_MANTRA`
> **Tu encargo sale de:** `PLAN_SEIS_DIAS.md` (Día 6, línea A) · regla 30.4 · `GATES_Y_PRUEBAS_ADVERSAS.md` §5

## 0. Ficha de asignación

| Campo | Valor |
|---|---|
| `PROFILE` | `MANTRA_DEV` |
| `MODE` | `FIX_SCOPED` — reparás lo acotado y **reverificás lo que tocaste** |
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
*Reparaciones acotadas y nueva verificación de lo afectado*. Cargar = abrirlas y leerlas antes de empezar, no tenerlas en disco.

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
| `root-cause-debugging` | la causa explica todos los síntomas |
| `refactoring-safely` | cambio mínimo demostrable |
| `incident-response-postmortem` | qué se aprende de lo que salió mal |

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

Los fallos que la regresión del Día 5 dejó en rojo están reparados con cambio mínimo y **re-verificados**, o declarados como no reparables en el plazo con su impacto.

**Kill-test (lo más barato que demuestra que NO está hecho):** Después de cada reparación, preguntá qué se volvió a correr. Si la respuesta es «nada, era chiquito», el peldaño de esa área volvió a `WRITTEN` y nadie lo notó.

## 3. Alcance

**IN:** reparación acotada de los rojos priorizados · reejecución de lo afectado por cada reparación · actualización del peldaño por área · lista de lo no reparado con su impacto.

**OUT:** refactorizar de paso · reparar todo sin priorizar · **atribuirle a la versión reparada la evidencia de la anterior** · cerrar con algo en `EN CURSO`.

## 4. Plan

### Subtarea S1.1 — Priorizar y reparar

| # | Microtarea | Criterio de aceptación | Definition of Done |
|---|---|---|---|
| M1 | Priorizar los rojos por impacto en el dictamen | Cada uno con su prioridad y motivo | Tabla ordenada |
| M2 | Reparar el primero con cambio mínimo, tras enunciar la causa | La causa está escrita **antes** del cambio | Causa + diff + verificación |
| M3 | Repetir de a uno, cerrando antes de abrir el siguiente | Nunca dos en curso | Estado por reparación |

### Subtarea S1.2 — Reverificar

| # | Microtarea | Criterio de aceptación | Definition of Done |
|---|---|---|---|
| M4 | Reejecutar la verificación que detectó cada fallo | Pasa, o falla con causa nueva | Salida pegada por reparación. *Si el fix cambia la causa del fallo, se reejecuta la prueba que lo detectó* |
| M5 | Reejecutar la regresión del área afectada | Resultado pegado | Salida |
| M6 | Actualizar el peldaño de evidencia del área tocada | Cada área con su peldaño post-reparación | Tabla. **El área editada vuelve a `WRITTEN` hasta que se reverifique** |

### Subtarea S1.3 — Lo que no se reparó

| # | Microtarea | Criterio de aceptación | Definition of Done |
|---|---|---|---|
| M7 | Listar lo no reparado con su impacto y qué costaría | Cada uno | Tabla |
| M8 | Declarar el peldaño final del trabajo | Es **el más bajo** de las áreas en alcance | Declaración + tabla por área |

## 5. Ambigüedades registradas — **no las resuelvas, anotalas**

| ID | Ambigüedad | Quién puede resolverla | Qué bloquea |
|---|---|---|---|
| Q-26 | Si alguna reparación excede el plazo y conviene declararla deuda | Coordinación | Solo la decisión de alcance |

## 6. Definition of Done del hito

- [ ] Las 8 microtareas están en `HECHO` o en `BLOCKED` con motivo y salida del error.
- [ ] Todo estado de verificación es `PASS`/`FAIL`/`NOT_RUN`/`BLOCKED`. **No hay un solo `PASS` sin comando y exit code pegados.**
- [ ] Cada reparación enunció su causa antes del cambio.
- [ ] Cada reparación tiene su reejecución.
- [ ] Ninguna microtarea quedó en `EN CURSO` al cerrar.
- [ ] El peldaño declarado es el más bajo de las áreas, no el más alto.
- [ ] Ninguna afirmación excede lo que ejecutaste. *¿Algún éxito declarado depende de algo que no ejecutaste?*
- [ ] Avance reportado como `microtareas HECHO / 8`, no como porcentaje a ojo.

## 7. Handoff

Al cerrar, avisá por el daily a:

- **Justin** → Qué hay que incluir en la regresión del candidato final.
- **Marcelo** → Qué rojo sigue abierto y afecta el dictamen.
- **Itzan** → Si hay que reempaquetar tras las reparaciones.

Si un bloqueo se confirma, **no itere sobre él**: registrá la causa y pasá a la siguiente microtarea independiente.
