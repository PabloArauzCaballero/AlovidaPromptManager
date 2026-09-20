# Empaquetar y versionar el artefacto MODULE del piloto

> **Rol:** propietario de capacidad / aislamiento · **Línea:** A · **Día del plazo:** 3 · **Turno:** noche
> **Paquete fuente:** `BACKEND_AUTONOMO_MANTRA`
> **Tu encargo sale de:** `PLAN_SEIS_DIAS.md` (Día 3, línea A) · `ARQUITECTURA_Y_CONTRATOS.md` §2 · `GATES_Y_PRUEBAS_ADVERSAS.md` gate A1

## 0. Ficha de asignación

| Campo | Valor |
|---|---|
| `PROFILE` | `MANTRA_DEV` |
| `MODE` | `PACKAGE` — empaquetás lo que el Día 2 dejó demostrado. Si el Día 2 quedó transicional, lo empaquetás **como transicional** |
| `WORKSPACE` | Checkout real de `mantra-core-health-api`. Registrá la ruta exacta. No inventar ruta |
| `TARGET_REF` | El corte fijado por Pablo el Día 1. **Si cambió, ese es tu corte** y lo declarás |
| `AUTHORIZED_BATCH` | Tu directorio de evidencia del Día 3 |
| `PROCESS_SOURCE` | `METAPROMPT_PARA_ASTRA(1).md` (síntesis) + [`docs/requisitos/REQUISITOS-CLIENTE-ALOVIDA.md`](../../../../../docs/requisitos/REQUISITOS-CLIENTE-ALOVIDA.md) |
| `ALLOWED_INFRA` | Lectura del repo, `git`, `yarn`, `node`. PostgreSQL y Docker: **verificar, no asumir** |
| `Predecesor` | Tu lote del Día 2. **No repitas lo que ya verificaste; sí re-verificá lo que tocaste después** |

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
*Empaquetar y versionar el artefacto MODULE del piloto*. Cargar = abrirlas y leerlas antes de empezar, no tenerlas en disco.

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
| `release-and-rollback` | versionar de forma que se pueda volver atrás |
| `dependency-management` | lockfile y resolución reproducible |
| `environment-secrets-config` | que no se te escape un secreto en el paquete |

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

Existe un artefacto MODULE versionado, con manifiesto, lockfile pertinente y evidencias adentro, que otro puede consumir **por versión** sin clonar la rama de nadie.

**Kill-test (lo más barato que demuestra que NO está hecho):** Pedile a alguien que consuma el módulo sin acceso a tu rama. Si no puede, no hay artefacto: hay una rama.

## 3. Alcance

**IN:** artefacto comprimido interno con código, declaraciones, lockfile, manifiesto y evidencias · hash y versión inmutable · mapa de resolución sin implementación vecina · estado de entrega declarado.

**OUT:** publicar nada fuera de la empresa · mergear a `dev` · empaquetar como verificado algo que quedó `TRANSITIONAL_ISOLATION` · incluir credenciales o datos reales.

## 4. Plan

### Subtarea S2.1 — El artefacto

| # | Microtarea | Criterio de aceptación | Definition of Done |
|---|---|---|---|
| M1 | Armar el artefacto con código, declaraciones, lockfile, manifiesto y evidencias | Los cinco están adentro | Listado del contenido pegado |
| M2 | Asignar versión inmutable y hash | Versión + hash + commit de origen | Los tres pegados. *No requiere publicación remota ni merge inmediato en `dev`* |
| M3 | Incluir el mapa de resolución **sin implementación vecina** | Ninguna ruta apunta al proveedor retirado | Mapa pegado (gate A1) |

### Subtarea S2.2 — Que no se escape nada

| # | Microtarea | Criterio de aceptación | Definition of Done |
|---|---|---|---|
| M4 | Verificar que el artefacto no contiene secretos | Ninguna credencial, token ni cadena de conexión | Salida del escaneo pegada. Regla 90.3: un secreto expuesto **se rota**, no se borra y listo |
| M5 | Verificar que no contiene datos reales de personas | Todo dato es sintético y está declarado | Verificación pegada |

### Subtarea S2.3 — El estado honesto del paquete

| # | Microtarea | Criterio de aceptación | Definition of Done |
|---|---|---|---|
| M6 | Declarar el estado de entrega del artefacto | `MODULE_VERIFIED_WITH_CONTRACT_DOUBLES` o `TRANSITIONAL_ISOLATION`, según el Día 2 | Estado + la evidencia del Día 2 que lo respalda |
| M7 | Registrar qué gates quedaron sin ejecutar y por qué | Cada gate A1–A8: ejecutado, no aplicable con motivo, o `NOT_RUN` | Tabla de 8 filas |

## 5. Ambigüedades registradas — **no las resuelvas, anotalas**

| ID | Ambigüedad | Quién puede resolverla | Qué bloquea |
|---|---|---|---|
| Q-16 | Dónde vive el artefacto interno: registry, almacenamiento compartido o adjunto | Coordinación | Solo la distribución, no el empaquetado |
| Q-09 | Si el aislamiento fue total o transicional | Lo resolvió el Día 2 | Nada: ya hay veredicto |

## 6. Definition of Done del hito

- [ ] Las 7 microtareas están en `HECHO` o en `BLOCKED` con motivo y salida del error.
- [ ] Todo estado de verificación es `PASS`/`FAIL`/`NOT_RUN`/`BLOCKED`. **No hay un solo `PASS` sin comando y exit code pegados.**
- [ ] El estado del paquete no es más fuerte que la evidencia del Día 2.
- [ ] Ningún secreto ni dato real dentro del artefacto.
- [ ] Los 8 gates A tienen su fila, incluidos los `NOT_RUN`.
- [ ] Ninguna afirmación excede lo que ejecutaste. *¿Algún éxito declarado depende de algo que no ejecutaste?*
- [ ] Avance reportado como `microtareas HECHO / 7`, no como porcentaje a ojo.

## 7. Handoff

Al cerrar, avisá por el daily a:

- **Justin** → El artefacto versionado que va a fijar en su relación.
- **Pablo** → Qué del empaquetado sirve para la segunda capacidad.
- **Todo el equipo** → La versión a consumir, en vez de la rama.

Si un bloqueo se confirma, **no itere sobre él**: registrá la causa y pasá a la siguiente microtarea independiente.
