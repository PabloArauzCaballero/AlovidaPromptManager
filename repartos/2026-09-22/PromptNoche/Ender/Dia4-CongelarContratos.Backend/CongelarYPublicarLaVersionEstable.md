# Congelar la versión estable del contrato y su matriz de consumidores

> **Rol:** propietario de contrato · **Línea:** A · **Día del plazo:** 4 · **Turno:** noche
> **Paquete fuente:** `BACKEND_AUTONOMO_MANTRA`
> **Tu encargo sale de:** `PLAN_SEIS_DIAS.md` (Día 4, línea A) · `ARQUITECTURA_Y_CONTRATOS.md` §3 y §7

## 0. Ficha de asignación

| Campo | Valor |
|---|---|
| `PROFILE` | `MANTRA_DEV` |
| `MODE` | `FREEZE` — congelás lo estable y dejás lo abierto **declarado como abierto** |
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
*Congelar la versión estable del contrato y su matriz de consumidores*. Cargar = abrirlas y leerlas antes de empezar, no tenerlas en disco.

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
| `technical-docs-and-adr` | la decisión queda escrita, no se discute dos veces |
| `error-handling-contract` | los códigos que el cliente distingue son estables |
| `api-openapi-docs` | deprecación y transición |

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

Hay una versión del contrato marcada estable, con su ficha completa, su matriz de consumidores y la lista explícita de lo que sigue `DECISION_REQUIRED`.

**Kill-test (lo más barato que demuestra que NO está hecho):** Buscá en la ficha el campo «Efectos posteriores». Si dice que el aviso es obligatorio o que es opcional sin citar quién lo decidió, alguien resolvió una decisión de negocio por su cuenta.

## 3. Alcance

**IN:** ficha de contrato completa de §3 · versión estable congelada con hash · matriz consumidor × versión actualizada · lista de lo `DECISION_REQUIRED` con su dueño · plan de transición para los cambios pendientes.

**OUT:** decidir lo que es de negocio · modificar una versión ya publicada · declarar estable un contrato cuyos campos clave siguen abiertos sin decirlo.

## 4. Plan

### Subtarea S3.1 — La ficha completa

| # | Microtarea | Criterio de aceptación | Definition of Done |
|---|---|---|---|
| M1 | Completar los campos de la ficha de §3 que correspondan | Cada campo: completo, o omitido **con justificación** | Ficha. Un campo omitido sin justificar es un campo olvidado |
| M2 | Marcar el campo Estado correctamente | `IMPLEMENTADO`, `OBJETIVO ACORDADO` o `PROPUESTA`, sin mezclarlos | Ficha. *No confundirlos* es textual del paquete |

### Subtarea S3.2 — Congelar

| # | Microtarea | Criterio de aceptación | Definition of Done |
|---|---|---|---|
| M3 | Publicar la versión estable con hash | Versión, hash y commit | Los tres pegados |
| M4 | Actualizar la matriz consumidor × versión | Todas las celdas con resultado o `NOT_RUN` | Matriz |
| M5 | Verificar que las versiones anteriores no cambiaron | Hashes idénticos a los publicados | Comparación pegada |

### Subtarea S3.3 — Lo que queda abierto

| # | Microtarea | Criterio de aceptación | Definition of Done |
|---|---|---|---|
| M6 | Listar lo `DECISION_REQUIRED` con su dueño y qué bloquea | Cada uno con nombre de quién decide | Lista. Sin dueño, una decisión pendiente no avanza nunca |
| M7 | Escribir el plan de transición de los cambios previstos | Qué consumidores se tocan y en qué orden | Plan. Un cambio que rompe a otro repo **exige coordinación y orden de despliegue** |

## 5. Ambigüedades registradas — **no las resuelvas, anotalas**

| ID | Ambigüedad | Quién puede resolverla | Qué bloquea |
|---|---|---|---|
| Q-06 | Durabilidad del aviso: si sigue abierta al Día 4, es un riesgo de release | Negocio | El campo «Efectos posteriores» de la ficha |
| Q-12 | Idempotencia | Negocio | El campo de idempotencia |
| Q-13 | Reintentos | Negocio | El campo de errores |

## 6. Definition of Done del hito

- [ ] Las 7 microtareas están en `HECHO` o en `BLOCKED` con motivo y salida del error.
- [ ] Todo estado de verificación es `PASS`/`FAIL`/`NOT_RUN`/`BLOCKED`. **No hay un solo `PASS` sin comando y exit code pegados.**
- [ ] Ningún campo de la ficha completado por criterio propio.
- [ ] Ninguna versión publicada fue modificada.
- [ ] Cada `DECISION_REQUIRED` tiene dueño con nombre.
- [ ] Ninguna afirmación excede lo que ejecutaste. *¿Algún éxito declarado depende de algo que no ejecutaste?*
- [ ] Avance reportado como `microtareas HECHO / 7`, no como porcentaje a ojo.

## 7. Handoff

Al cerrar, avisá por el daily a:

- **Todo el equipo** → La versión estable a consumir.
- **Marcelo** → Qué decisiones de negocio siguen abiertas y bloquean la aceptación.
- **Justin** → Contra qué versiones probar.

Si un bloqueo se confirma, **no itere sobre él**: registrá la causa y pasá a la siguiente microtarea independiente.
