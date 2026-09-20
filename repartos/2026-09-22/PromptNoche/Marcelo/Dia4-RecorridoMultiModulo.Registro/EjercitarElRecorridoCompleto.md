# Ejercitar el recorrido que cruza varios módulos

> **Rol:** cierre funcional e integración · **Línea:** B · **Día del plazo:** 4 · **Turno:** noche
> **Paquete fuente:** `BACKEND_AUTONOMO_MANTRA`
> **Tu encargo sale de:** `PLAN_SEIS_DIAS.md` (Día 4, línea B) · `GATES_Y_PRUEBAS_ADVERSAS.md` gate C1 y ADV-08 · `REQUISITOS-CLIENTE-ALOVIDA.md`

## 0. Ficha de asignación

| Campo | Valor |
|---|---|
| `PROFILE` | `MANTRA_DEV` |
| `MODE` | `VERIFY_FUNCTIONAL` — ejercitás el recorrido completo con lo disponible |
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

Son **19**: 11 del proceso, que carga todo el equipo, y 8 propias de
*Ejercitar el recorrido que cruza varios módulos*. Cargar = abrirlas y leerlas antes de empezar, no tenerlas en disco.

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
| `concurrency-and-locking` | atomicidad del proceso que cruza capacidades |
| `clinical-records` | qué exige un registro clínico que no se puede improvisar |
| `regulatory-compliance-mapping` | qué obligaciones caen sobre el recorrido |
| `audit-trail-history` | toda lectura de dato clínico deja rastro |

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

El recorrido que cruza varios módulos se ejercitó de punta a punta, y está declarado exactamente qué participante real faltó en cada paso.

**Kill-test (lo más barato que demuestra que NO está hecho):** Preguntá si el recorrido pasa. Si nadie puede nombrar qué participante era un doble, el resultado no significa nada.

## 3. Alcance

**IN:** ejecución del recorrido multi-módulo · unidad transaccional donde el proceso la exija · lista de proveedores externos pendientes · qué pasos corrieron con dobles · correspondencia con el documento del cliente.

**OUT:** declarar aceptación del producto · sustituir integración externa por fixtures y no decirlo · **rellenar reglas desconocidas** · presentar el piloto como todo Mantra.

## 4. Plan

### Subtarea S4.1 — El recorrido de punta a punta

| # | Microtarea | Criterio de aceptación | Definition of Done |
|---|---|---|---|
| M1 | Ejecutar el recorrido completo con los participantes disponibles | Corre, o se detiene en un paso identificado | Salida pegada paso por paso |
| M2 | Declarar, por paso, si el participante fue real o doble | Cada paso tiene su marca | Tabla paso × participante × real/doble. **Sin esto el resultado es inútil** |
| M3 | ADV-08: fallar tras la escritura de un participante y antes del commit compartido | Una consulta independiente **no** encuentra éxito parcial ni auditoría de éxito confirmada | Consultas pegadas desde conexión independiente |

### Subtarea S4.2 — Lo que el recorrido exige y no está

| # | Microtarea | Criterio de aceptación | Definition of Done |
|---|---|---|---|
| M4 | Lista de proveedores externos pendientes | Cada uno con qué acredita y qué falta | Lista. Es evidencia de salida exigida por el Día 4 |
| M5 | Registrar los pasos que quedaron `NOT_RUN` y por qué | Cada uno con motivo | Lista |
| M6 | Contrastar el recorrido ejecutado contra `REQUISITOS-CLIENTE-ALOVIDA.md` | Cada paso tiene su párrafo, o está marcado como no cubierto | Tabla de correspondencia actualizada |

### Subtarea S4.3 — Rastro

| # | Microtarea | Criterio de aceptación | Definition of Done |
|---|---|---|---|
| M7 | Verificar que las lecturas de datos clínicos dejan rastro auditable | El rastro existe y no contiene el contenido clínico | Consulta pegada. Regla 90.2.7: **incluidas las lecturas** |
| M8 | Verificar que no hay datos de personas en logs ni URLs del recorrido | Ninguno | Evidencia de la revisión. Si una salida los tenía: enmascarada **y aclarado** |

## 5. Ambigüedades registradas — **no las resuelvas, anotalas**

| ID | Ambigüedad | Quién puede resolverla | Qué bloquea |
|---|---|---|---|
| Q-10 | Reglas de negocio sin definir | Negocio | Los pasos que dependan de ellas |
| Q-21 | Qué proveedor externo se puede probar dentro del plazo y cuál no | Coordinación | El alcance de la aceptación del Día 5 |

## 6. Definition of Done del hito

- [ ] Las 8 microtareas están en `HECHO` o en `BLOCKED` con motivo y salida del error.
- [ ] Todo estado de verificación es `PASS`/`FAIL`/`NOT_RUN`/`BLOCKED`. **No hay un solo `PASS` sin comando y exit code pegados.**
- [ ] Cada paso declara si su participante fue real o doble.
- [ ] Ninguna regla desconocida se rellenó.
- [ ] Ningún dato de persona en logs, URLs ni en esta evidencia.
- [ ] Ninguna afirmación excede lo que ejecutaste. *¿Algún éxito declarado depende de algo que no ejecutaste?*
- [ ] Avance reportado como `microtareas HECHO / 8`, no como porcentaje a ojo.

## 7. Handoff

Al cerrar, avisá por el daily a:

- **Justin** → Los pasos que fallaron por la relación.
- **Ender** → Qué decisión abierta bloquea qué paso.
- **Pablo** → La lista de proveedores externos pendientes: es decisión de alcance.

Si un bloqueo se confirma, **no itere sobre él**: registrá la causa y pasá a la siguiente microtarea independiente.
