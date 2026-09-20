# Convertir el contrato en un validador que rechaza lo que debe rechazar

> **Rol:** propietario de contrato · **Línea:** A · **Día del plazo:** 2 · **Turno:** noche
> **Paquete fuente:** `BACKEND_AUTONOMO_MANTRA`
> **Tu encargo sale de:** `PLAN_SEIS_DIAS.md` (Día 2, línea A) · `ARQUITECTURA_Y_CONTRATOS.md` §3 · `GATES_Y_PRUEBAS_ADVERSAS.md` gate A6, ADV-03 y L5

## 0. Ficha de asignación

| Campo | Valor |
|---|---|
| `PROFILE` | `MANTRA_DEV` |
| `MODE` | `BUILD_CONTRACT` — el validador vive con el contrato, no dentro de `src/` de Mantra |
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
*Convertir el contrato en un validador que rechaza lo que debe rechazar*. Cargar = abrirlas y leerlas antes de empezar, no tenerlas en disco.

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
| `concurrency-and-locking` | idempotencia: alcance y vigencia de la clave |
| `authz-access-control` | actor, tenant y titular en el borde |
| `terminology-value-sets` | catálogos cerrados como conceptos codificados |
| `unit-testing` | un comportamiento por test |

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

La regla que el tipo no hace cumplir ahora la hace cumplir un validador, y hay un caso que lo demuestra rechazando un dato **de estructura válida** pero semánticamente incorrecto.

**Kill-test (lo más barato que demuestra que NO está hecho):** Pasale al validador un `recipient` con sus dos campos vacíos y un monto o tenant incorrecto según la regla aprobada. Si los acepta porque «cumple el esquema», no está hecho.

## 3. Alcance

**IN:** validador runtime de las reglas que el tipo no cubre · oráculo independiente · casos negativos dirigidos · versionado del artefacto de contrato · compatibilidad con los consumidores inventariados el Día 1.

**OUT:** cambiar el contrato para que algo pase · resolver la tensión de durabilidad (`Q-06`) · implementar el adaptador (Justin) · inventar una regla que ninguna fuente define.

## 4. Plan

### Subtarea S3.1 — El validador

| # | Microtarea | Criterio de aceptación | Definition of Done |
|---|---|---|---|
| M1 | Implementar la regla «exactamente uno» de `recipient` como validación runtime | Rechaza cero campos y rechaza dos | Los dos casos negativos con su salida. La fuente de la regla, citada |
| M2 | Validar la forma completa del resultado contra la definición fijada | Un campo de más o de menos se detecta | Caso ejecutado |
| M3 | El oráculo NO usa la función que prueba para calcular lo esperado | Está escrito de dónde sale el valor esperado | Cita de `L5` + el origen del esperado. Es el error que hace que un test pase siempre |

### Subtarea S3.2 — Los casos que tienen que fallar

| # | Microtarea | Criterio de aceptación | Definition of Done |
|---|---|---|---|
| M4 | ADV-03: dato de estructura válida con tenant incorrecto | El validador lo rechaza **por la regla concreta**, no por esquema | Caso + el mensaje de rechazo, que debe nombrar la regla |
| M5 | Respuesta incompatible del doble | Se detecta | Caso ejecutado (gate A6) |
| M6 | Registrar qué reglas NO puede comprobar el validador todavía | Está la lista con el motivo | Lista. Una regla `DECISION_REQUIRED` no se implementa a ojo |

### Subtarea S3.3 — Versión y compatibilidad

| # | Microtarea | Criterio de aceptación | Definition of Done |
|---|---|---|---|
| M7 | Publicar el artefacto de contrato versionado con su hash | Versión inmutable + hash + commit | Artefacto + hash pegados |
| M8 | Probar el contrato contra los consumidores inventariados el Día 1 | Cada consumidor: compatible o afectado | Tabla. *Añadir un enum o una propiedad puede ser incompatible para un consumidor exhaustivo*: distinguí compatibilidad de lectura, de escritura y de significado |

## 5. Ambigüedades registradas — **no las resuelvas, anotalas**

| ID | Ambigüedad | Quién puede resolverla | Qué bloquea |
|---|---|---|---|
| Q-06 | Durabilidad del aviso: sigue `DECISION_REQUIRED` | Negocio | El validador no puede decidirlo |
| Q-12 | Idempotencia sin definir | Negocio | El caso de repetición de Justin |
| Q-13 | Reintentos, fallos terminales y agotamiento | Negocio | El comportamiento ante proveedor indisponible |

## 6. Definition of Done del hito

- [ ] Las 8 microtareas están en `HECHO` o en `BLOCKED` con motivo y salida del error.
- [ ] Todo estado de verificación es `PASS`/`FAIL`/`NOT_RUN`/`BLOCKED`. **No hay un solo `PASS` sin comando y exit code pegados.**
- [ ] Ninguna regla implementada sin fuente identificada.
- [ ] El validador rechaza al menos un caso de estructura válida y semántica inválida.
- [ ] El artefacto de contrato es citable por versión, no por rama.
- [ ] Ninguna afirmación excede lo que ejecutaste. *¿Algún éxito declarado depende de algo que no ejecutaste?*
- [ ] Avance reportado como `microtareas HECHO / 8`, no como porcentaje a ojo.

## 7. Handoff

Al cerrar, avisá por el daily a:

- **Justin** → El validador: su doble tiene que pasarlo.
- **Pablo** → Qué comprueba el validador dentro del harness.
- **Itzan** → Si el contrato cambió de hash desde ayer.

Si un bloqueo se confirma, **no itere sobre él**: registrá la causa y pasá a la siguiente microtarea independiente.
