# Ejercitar la relación con dobles fijados de ambos extremos

> **Rol:** responsable de relación e integración · **Línea:** B · **Día del plazo:** 2 · **Turno:** noche
> **Paquete fuente:** `BACKEND_AUTONOMO_MANTRA`
> **Tu encargo sale de:** `PLAN_SEIS_DIAS.md` (Día 2, línea B) · `PILOTO_MANTRA.md` paso 6 · `GATES_Y_PRUEBAS_ADVERSAS.md` gate B1 y ADV-12

## 0. Ficha de asignación

| Campo | Valor |
|---|---|
| `PROFILE` | `MANTRA_DEV` |
| `MODE` | `BUILD_ADAPTER` — el adaptador y sus pruebas viven en la entrega de integración |
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
*Ejercitar la relación con dobles fijados de ambos extremos*. Cargar = abrirlas y leerlas antes de empezar, no tenerlas en disco.

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
| `api-testing` | matriz de autorizacion negativa y conformidad de contrato |
| `qa-evidence-reporting` | el formato de registro de un resultado |
| `e2e-failure-triage` | clasificar un rojo antes de tocar nada |
| `integrity-testing` | un test con el ORM mockeado no prueba persistencia |
| `async-messaging-events` | entrega at-least-once y consumidores idempotentes |
| `notifications-delivery` | solicitud persistida, aceptación y evidencia de entrega |
| `error-handling-contract` | traducir errores sin inventar semántica |
| `security-guardrails` | que un doble no pueda bindearse en producción |

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

La relación `agenda → mensajería` corre de punta a punta con dobles fijados de los dos extremos, y su estado registrado es `ADAPTER_VERIFIED_WITH_DOUBLES` — ni una palabra más fuerte.

**Kill-test (lo más barato que demuestra que NO está hecho):** Preguntá si la relación está probada. Si alguien dice que sí sin aclarar «con dobles», el registro está mal hecho y alguien va a leer esto como integración terminada.

## 3. Alcance

**IN:** adaptador contra el contrato versionado de Ender · dobles fijados de ambos extremos · mapeo de datos y errores ejecutado · compatibilidad temprana entre versiones · registro de cada resultado con sus 13 campos.

**OUT:** declarar integración real · ejecutar contra implementaciones reales (esperan a sus participantes) · duplicar reglas de dominio dentro del adaptador · cambiar el contrato para que algo pase.

## 4. Plan

### Subtarea S5.1 — El adaptador contra el contrato fijado

| # | Microtarea | Criterio de aceptación | Definition of Done |
|---|---|---|---|
| M1 | Implementar el adaptador contra el artefacto versionado de Ender | Compila y referencia la versión, no la rama | Comando y exit code pegados + la versión referenciada |
| M2 | Ejecutar el mapeo de datos de la relación | Cada campo del contrato tiene origen y destino demostrados | Caso ejecutado con la salida |
| M3 | Ejecutar el mapeo de errores | Cada modo de error se traduce como dice la ficha | Casos ejecutados. El adaptador **traduce, no decide** |

### Subtarea S5.2 — Los dobles de los dos extremos

| # | Microtarea | Criterio de aceptación | Definition of Done |
|---|---|---|---|
| M4 | Fijar el doble del proveedor y el del consumidor | Los dos están fijados por versión | Fichas pegadas (gate B1) |
| M5 | ADV-12: el doble satisface el catálogo y el proveedor real devuelve lo contrario | Queda escrito qué pasaría y cómo se detectaría | Especificación. **No se altera el contrato para forzar verde** |
| M6 | Registrar el estado como `ADAPTER_VERIFIED_WITH_DOUBLES` | Está el estado y qué falta para el siguiente | Registro. No existe atajo a `INTEGRATION_VERIFIED_WITH_REAL_IMPLEMENTATIONS` |

### Subtarea S5.3 — Compatibilidad temprana

| # | Microtarea | Criterio de aceptación | Definition of Done |
|---|---|---|---|
| M7 | Probar el adaptador contra las versiones del contrato que el producto va a seguir usando | Cada combinación: pasa o falla, con su motivo | Matriz de combinaciones |
| M8 | Registrar cada resultado con los 13 campos del formato | Ninguno sin `command` y `exit_code`, o con la causa de que sean null | Registro pegado. Las rutas de evidencia tienen que existir |

## 5. Ambigüedades registradas — **no las resuelvas, anotalas**

| ID | Ambigüedad | Quién puede resolverla | Qué bloquea |
|---|---|---|---|
| Q-06 | Durabilidad del aviso | Negocio | Si hace falta intención duradera |
| Q-12 | Idempotencia | Negocio | El caso de repetición |
| Q-13 | Política de reintentos | Negocio | El caso de proveedor indisponible |

## 6. Definition of Done del hito

- [ ] Las 8 microtareas están en `HECHO` o en `BLOCKED` con motivo y salida del error.
- [ ] Todo estado de verificación es `PASS`/`FAIL`/`NOT_RUN`/`BLOCKED`. **No hay un solo `PASS` sin comando y exit code pegados.**
- [ ] Ningún resultado con dobles registrado como integración real.
- [ ] Ningún `PASS` sin comando y exit code.
- [ ] Ninguna política de reintento, TTL o deduplicación escrita sin fuente.
- [ ] Ninguna afirmación excede lo que ejecutaste. *¿Algún éxito declarado depende de algo que no ejecutaste?*
- [ ] Avance reportado como `microtareas HECHO / 8`, no como porcentaje a ojo.

## 7. Handoff

Al cerrar, avisá por el daily a:

- **Marcelo** → Qué casos suyos ya se pueden ejercitar y cuáles esperan participantes reales.
- **Ender** → Qué del contrato resultó ambiguo al implementarlo — es la mejor prueba de un contrato.
- **Itzan** → Qué necesita el adaptador de la composición de capacidad.

Si un bloqueo se confirma, **no itere sobre él**: registrá la causa y pasá a la siguiente microtarea independiente.
