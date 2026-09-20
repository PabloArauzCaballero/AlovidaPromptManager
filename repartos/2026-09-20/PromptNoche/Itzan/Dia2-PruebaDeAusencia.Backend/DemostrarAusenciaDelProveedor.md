# Demostrar materialmente la ausencia del proveedor

> **Rol:** propietario de capacidad / aislamiento · **Línea:** A · **Día del plazo:** 2 · **Turno:** noche
> **Paquete fuente:** `BACKEND_AUTONOMO_MANTRA`
> **Tu encargo sale de:** `PLAN_SEIS_DIAS.md` (Día 2, línea A) · `PILOTO_MANTRA.md` paso 5 · `GATES_Y_PRUEBAS_ADVERSAS.md` gate A7 y ADV-01

## 0. Ficha de asignación

| Campo | Valor |
|---|---|
| `PROFILE` | `MANTRA_DEV` |
| `MODE` | `ISOLATE_VERIFY` — trabajás en una **copia descartable**. El checkout original no se toca |
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
*Demostrar materialmente la ausencia del proveedor*. Cargar = abrirlas y leerlas antes de empezar, no tenerlas en disco.

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
| `model-driven-schema` | el esquema no se toca a mano para destrabar |
| `dependency-management` | resolución, lockfile y qué arrastra cada paquete |
| `data-quality-validation` | verificación de deriva entre fuente, base y entidades |
| `refactoring-safely` | mover sin romper, y cómo se demuestra |

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

Hay una copia sin las implementaciones vecinas donde la capacidad **compila, arranca y pasa su aceptación local** — o hay una dependencia residual concreta, nombrada, que explica por qué todavía es transicional.

**Kill-test (lo más barato que demuestra que NO está hecho):** Preguntá si al retirar mensajería y comunidad la capacidad arranca. Si la respuesta es «debería», no está hecho. La única respuesta válida es un exit code pegado.

## 3. Alcance

**IN:** copia temporal · retiro de las implementaciones vecinas sustituidas · bloqueo de resolución desde el checkout original y cachés · typecheck, build, arranque y aceptación local en la copia · manifiesto de dependencias, exclusiones, resolución y conexiones.

**OUT:** tocar el checkout original · silenciar un import residual para que arranque · declarar autónomo todo `SchedulingModule` si solo se aisló una capacidad · mover el problema a un paquete llamado `base`.

## 4. Plan

### Subtarea S2.1 — La copia y el retiro

| # | Microtarea | Criterio de aceptación | Definition of Done |
|---|---|---|---|
| M1 | Crear la copia descartable e identificarla | La copia existe y está claro que es descartable | Ruta + cómo se destruye. **No trabajes sobre el checkout original** |
| M2 | Retirar las implementaciones vecinas sustituidas, incluidas mensajería y comunidad | Está la lista de lo retirado, con rutas | Inventario pegado. *No basta retirar dos directorios si otro paquete aún las contiene*: verificalo |
| M3 | Bloquear la resolución desde el checkout original y las cachés | Un import de lo retirado **falla** | Prueba de que falla, pegada. Si resuelve igual, la ausencia no está demostrada y todo lo que sigue no vale |
| M4 | Conservar contratos y baseline autorizado dentro de la copia | Siguen disponibles | Listado pegado |

### Subtarea S2.2 — Los gates en la copia

| # | Microtarea | Criterio de aceptación | Definition of Done |
|---|---|---|---|
| M5 | Typecheck y build de la capacidad, delimitados | Exit 0, y está identificado qué se compiló | Comando y exit code pegados (gate A2). Un build de todo el repo **no** es un build delimitado |
| M6 | Arranque propio con PostgreSQL permitido y cierre limpio | Arranca y cierra sin quedar colgado | Salida pegada (gate A3). Un contexto standalone sin HTTP **no prueba** guards ni pipes de una ruta HTTP |
| M7 | Correr la aceptación local en la copia | Los casos del laboratorio de Pablo pasan, o fallan con su causa | Salida pegada (gates A4–A6) |

### Subtarea S2.3 — El veredicto honesto

| # | Microtarea | Criterio de aceptación | Definition of Done |
|---|---|---|---|
| M8 | Manifiesto de dependencias, archivos excluidos, resolución y conexiones | Los cuatro están | Manifiesto entregado |
| M9 | Declarar el estado real de la entrega | Es `MODULE_VERIFIED_WITH_CONTRACT_DOUBLES` **o** `TRANSITIONAL_ISOLATION`, con la dependencia residual nombrada | Estado + evidencia. *Si `scheduling.module.ts`, un barrel o el ORM arrastra aún fuentes ausentes, esa evidencia dirige el siguiente cambio; no se silencia* |

## 5. Ambigüedades registradas — **no las resuelvas, anotalas**

| ID | Ambigüedad | Quién puede resolverla | Qué bloquea |
|---|---|---|---|
| Q-09 | Si el glob del ORM y el subscriber pueden delimitarse sin tocar código compartido | Se resuelve HOY, ejecutando | Deja de ser hipótesis al terminar este lote |
| Q-15 | Si la dependencia residual justifica cambiar el corte del piloto | Coordinación | El plan del Día 3. *Si Día 2 no produce evidencia de aislamiento, ajustar el corte o documentar la dependencia antes de multiplicar la estrategia* |

## 6. Definition of Done del hito

- [ ] Las 9 microtareas están en `HECHO` o en `BLOCKED` con motivo y salida del error.
- [ ] Todo estado de verificación es `PASS`/`FAIL`/`NOT_RUN`/`BLOCKED`. **No hay un solo `PASS` sin comando y exit code pegados.**
- [ ] El resultado es un exit code, no una impresión.
- [ ] Ningún control se desactivó para que algo arrancara.
- [ ] Si quedó transicional, la dependencia está nombrada con archivo y línea — no como «algo de mensajería».
- [ ] Ninguna afirmación excede lo que ejecutaste. *¿Algún éxito declarado depende de algo que no ejecutaste?*
- [ ] Avance reportado como `microtareas HECHO / 9`, no como porcentaje a ojo.

## 7. Handoff

Al cerrar, avisá por el daily a:

- **Todo el equipo** → El veredicto: si hoy no hay aislamiento, el Día 3 cambia.
- **Pablo** → Qué import residual bloquea, para priorizarlo mañana.
- **Marcelo** → Si el recorrido elegido sigue siendo alcanzable con esta evidencia.

Si un bloqueo se confirma, **no itere sobre él**: registrá la causa y pasá a la siguiente microtarea independiente.
