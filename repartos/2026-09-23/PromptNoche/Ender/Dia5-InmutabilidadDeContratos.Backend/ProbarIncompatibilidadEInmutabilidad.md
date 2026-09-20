# Probar que una versión incompatible rompe donde debe y que lo histórico no se toca

> **Rol:** propietario de contrato · **Línea:** A · **Día del plazo:** 5 · **Turno:** noche
> **Paquete fuente:** `BACKEND_AUTONOMO_MANTRA`
> **Tu encargo sale de:** `PLAN_SEIS_DIAS.md` (Día 5, línea A) · `GATES_Y_PRUEBAS_ADVERSAS.md` ADV-06 · `ARQUITECTURA_Y_CONTRATOS.md` §7

## 0. Ficha de asignación

| Campo | Valor |
|---|---|
| `PROFILE` | `MANTRA_DEV` |
| `MODE` | `VERIFY_CONTRACT` — probás en copia temporal, nunca sobre lo publicado |
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
*Probar que una versión incompatible rompe donde debe y que lo histórico no se toca*. Cargar = abrirlas y leerlas antes de empezar, no tenerlas en disco.

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
| `api-openapi-docs` | detección de cambios que rompen |
| `github-multirepo-coordination` | orden de despliegue cuando cruza repos |
| `code-quality-gates` | el check obligatorio no se pasa por alto |

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

Está demostrado que una versión contractual incompatible hace fallar a los consumidores afectados, y que los artefactos históricos siguen intactos y con el mismo hash.

**Kill-test (lo más barato que demuestra que NO está hecho):** Compará el hash de la versión publicada hace tres días contra el de hoy. Si cambió, alguien editó una versión inmutable y toda la trazabilidad se cae.

## 3. Alcance

**IN:** ADV-06 ejecutado en copia temporal · comprobación de hashes históricos · matriz final consumidor × versión · registro de lo que queda sin decidir al cierre del contrato.

**OUT:** modificar un artefacto publicado · **alterar el contrato para forzar un verde** · decidir lo que es de negocio · declarar compatible una combinación que no probaste.

## 4. Plan

### Subtarea S3.1 — La prueba adversa

| # | Microtarea | Criterio de aceptación | Definition of Done |
|---|---|---|---|
| M1 | ADV-06: introducir una versión incompatible en copia temporal | Los consumidores afectados fallan | Salida pegada. Si pasan, la matriz miente |
| M2 | Verificar que los artefactos históricos permanecen inmutables | Hashes idénticos | Comparación pegada |
| M3 | Registrar qué consumidor falló y con qué error | Cada uno | Tabla |

### Subtarea S3.2 — La matriz final

| # | Microtarea | Criterio de aceptación | Definition of Done |
|---|---|---|---|
| M4 | Completar la matriz consumidor × versión | Ninguna celda en blanco: resultado o `NOT_RUN` con motivo | Matriz |
| M5 | Declarar la estrategia de transición de cada incompatibilidad conocida | Cada una con su plan | Tabla |

### Subtarea S3.3 — El cierre del contrato

| # | Microtarea | Criterio de aceptación | Definition of Done |
|---|---|---|---|
| M6 | Listar lo que queda `DECISION_REQUIRED` al cierre | Cada uno con dueño y qué bloquea | Lista. Al Día 5, una decisión sin dueño es un riesgo de release |
| M7 | Declarar el estado final del contrato | `IMPLEMENTADO` / `OBJETIVO ACORDADO` / `PROPUESTA`, sin mezclar | Estado |

## 5. Ambigüedades registradas — **no las resuelvas, anotalas**

| ID | Ambigüedad | Quién puede resolverla | Qué bloquea |
|---|---|---|---|
| Q-06 | Durabilidad del aviso al cierre | Negocio | Si sigue abierta, es riesgo declarado de release |
| Q-24 | Si alguna incompatibilidad exige coordinar despliegue con el frontend | Coordinación | El orden de despliegue |

## 6. Definition of Done del hito

- [ ] Las 7 microtareas están en `HECHO` o en `BLOCKED` con motivo y salida del error.
- [ ] Todo estado de verificación es `PASS`/`FAIL`/`NOT_RUN`/`BLOCKED`. **No hay un solo `PASS` sin comando y exit code pegados.**
- [ ] Ninguna versión publicada fue modificada.
- [ ] ADV-06 falló donde tenía que fallar.
- [ ] Ninguna celda de la matriz quedó en blanco.
- [ ] Ninguna afirmación excede lo que ejecutaste. *¿Algún éxito declarado depende de algo que no ejecutaste?*
- [ ] Avance reportado como `microtareas HECHO / 7`, no como porcentaje a ojo.

## 7. Handoff

Al cerrar, avisá por el daily a:

- **Marcelo** → Qué decisión abierta impide firmar la aceptación.
- **Justin** → Contra qué versión corre el candidato compuesto.
- **Itzan** → Si hay que reempaquetar por un cambio de contrato.

Si un bloqueo se confirma, **no itere sobre él**: registrá la causa y pasá a la siguiente microtarea independiente.
