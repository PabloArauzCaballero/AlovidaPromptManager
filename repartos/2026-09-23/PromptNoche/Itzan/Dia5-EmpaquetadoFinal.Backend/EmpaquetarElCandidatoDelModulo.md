# Empaquetar el candidato final del módulo

> **Rol:** propietario de capacidad / aislamiento · **Línea:** A · **Día del plazo:** 5 · **Turno:** noche
> **Paquete fuente:** `BACKEND_AUTONOMO_MANTRA`
> **Tu encargo sale de:** `PLAN_SEIS_DIAS.md` (Día 5, línea A) · `ARQUITECTURA_Y_CONTRATOS.md` §2 · `GATES_Y_PRUEBAS_ADVERSAS.md` §5

## 0. Ficha de asignación

| Campo | Valor |
|---|---|
| `PROFILE` | `MANTRA_DEV` |
| `MODE` | `PACKAGE` — empaquetás la versión que la regresión respalda, no la última que compila |
| `WORKSPACE` | Checkout real de `mantra-core-health-api`. Registrá la ruta exacta. No inventar ruta |
| `TARGET_REF` | El corte fijado por Pablo el Día 1. **Si cambió, ese es tu corte** y lo declarás |
| `AUTHORIZED_BATCH` | Tu directorio de evidencia del Día 5 |
| `PROCESS_SOURCE` | `METAPROMPT_PARA_ASTRA(1).md` (síntesis) + [`docs/requisitos/REQUISITOS-CLIENTE-ALOVIDA.md`](../../../../../docs/requisitos/REQUISITOS-CLIENTE-ALOVIDA.md) |
| `ALLOWED_INFRA` | Lectura del repo, `git`, `yarn`, `node`. PostgreSQL y Docker: **verificar, no asumir** |
| `Predecesor` | Tu lote del Día 4. **No repitas lo que ya verificaste; sí re-verificá lo que tocaste después** |

> ### ✅ Hechos ya verificados contra el corte — no los repitas
>
> Las afirmaciones técnicas de este prompt salían del paquete, que es **la lectura de otra persona**.
> El 2026-09-19 se contrastaron contra el repositorio real, leyendo el corte
> `32ae939983f0d665e4ed371362858801134d35cd`. El detalle con localizadores está en
> [`VERIFICACION-CONTRA-CODIGO-2026-09-19.md`](../../../../../docs/verificacion/VERIFICACION-CONTRA-CODIGO-2026-09-19.md).
>
> **Ya confirmado, no hace falta que lo rehagas:**
>
> - `scheduling.module.ts` (145 líneas) importa **8 módulos**: `AuditModule`, `DirectoryModule`,
>   `PracticeModule`, `MessagingModule`, `CommunityModule`, `InsuranceModule`, `ProfilesModule`,
>   `CommonModule`. `MessagingModule` y `CommunityModule` confirmados.
> - El binding es `{ provide: AGENDA_NOTICE_PORT, useExisting: MessagingAgendaNoticeAdapter }`,
>   **línea 142**. Es **`useExisting`, no `useClass`**: la instancia ya viene provista de otro lado,
>   y eso cambia cómo se sustituye.
> - **Hay un SEGUNDO adaptador que el paquete nunca mencionó:** `SupportAdminNoticeAdapter`
>   (línea 72). Un análisis de la composición que lo ignore está incompleto.
> - `orm.config.ts`: globs globales (líneas 57-61), `TsMorphMetadataProvider` (68), caché en
>   `node_modules/.cache/mikro-orm` (78-81) y `HistoryMirrorSubscriber` (129). **Los cuatro, confirmados.**
> - El comentario de la línea 67 dice *«analizar 1159 archivos»*. **1159 es un comentario, no una
>   medición vigente.** No lo adoptes como inventario.
> - `transaction.port.ts`: existen `TransactionManager`, `execute<T>` y `TransactionOptions`. El
>   token es `TRANSACTION_MANAGER = Symbol(...)`. **`TransactionContext` no vive ahí**: se importa
>   de `./persistence-context`. **La propagación sigue sin verificar: exige ejecutar.**
>
> **El corte se movió:** `32ae939…` **es ancestro** del `HEAD` de `dev`, con **2 commits** de
> diferencia (`dev` = `5d5007f…`, 2026-09-19T21:33). Cuál de los dos es el corte de trabajo lo
> fija Pablo, no esta verificación.
>
> ⚠️ **Lo que esa verificación NO hizo: ejecutar.** No se corrió build, ni tests, ni arranque.
> **Que un símbolo exista no prueba que haga lo que su comentario promete.** Todo lo que sea
> comportamiento sigue siendo tuyo.
>
> 🔧 **Y una trampa de método, porque te va a pasar:** buscar con `git grep <SHA>` sobre un clon
> parcial (`--filter=blob:none`) en una ruta larga de Windows devolvió **`NOT_FOUND` para tres
> clases que sí existen**. El error real era `fatal: ... Filename too long`, y un `2>/dev/null` se
> lo comía. Usá `git cat-file -p <SHA>:<ruta>` y `git ls-tree -r --name-only <SHA>`.
> **Si tu búsqueda no encuentra algo, verificá primero que tu búsqueda funcione.**

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
*Empaquetar el candidato final del módulo*. Cargar = abrirlas y leerlas antes de empezar, no tenerlas en disco.

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
| `release-and-rollback` | candidato, no rama |
| `environment-secrets-config` | que no viaje un secreto |
| `dependency-management` | lockfile pertinente adentro |

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

Existe un candidato del módulo con su manifiesto, sus evidencias y su estado de entrega, consumible por versión, y ligado a la corrida de regresión que lo respalda.

**Kill-test (lo más barato que demuestra que NO está hecho):** Preguntá qué corrida de regresión respalda este paquete. Si la respuesta es «la de ayer» y hubo cambios después, la evidencia venció.

## 3. Alcance

**IN:** artefacto de la versión respaldada · manifiesto con versiones, hashes y resolución · evidencias adentro · estado de entrega · enlace a la corrida de regresión.

**OUT:** empaquetar una versión sin regresión que la respalde · **atribuirle a la versión nueva la evidencia de la anterior** · publicar fuera de la empresa · incluir secretos.

## 4. Plan

### Subtarea S2.1 — El candidato

| # | Microtarea | Criterio de aceptación | Definition of Done |
|---|---|---|---|
| M1 | Armar el artefacto de la versión que la regresión respalda | La versión empaquetada y la de la regresión coinciden | Los dos identificadores pegados |
| M2 | Incluir manifiesto con versiones, hashes, resolución y conexiones | Los cuatro | Manifiesto pegado |
| M3 | Incluir las evidencias de los gates A ejecutados | Cada gate con su ruta de evidencia, que **debe existir** | Índice de evidencias |

### Subtarea S2.2 — Higiene

| # | Microtarea | Criterio de aceptación | Definition of Done |
|---|---|---|---|
| M4 | Verificar ausencia de secretos y de datos reales | Ninguno | Salidas de las dos verificaciones |
| M5 | Verificar que el artefacto no arrastra fuentes del proveedor retirado | El mapa de resolución está limpio | Mapa pegado |

### Subtarea S2.3 — Estado

| # | Microtarea | Criterio de aceptación | Definition of Done |
|---|---|---|---|
| M6 | Declarar el estado de entrega del candidato | El que la evidencia sostiene, ni uno más fuerte | Estado + evidencia |
| M7 | Registrar qué gates quedaron `NOT_RUN` en este candidato | Lista | Tabla de gates A1–A8 |

## 5. Ambigüedades registradas — **no las resuelvas, anotalas**

| ID | Ambigüedad | Quién puede resolverla | Qué bloquea |
|---|---|---|---|
| Q-16 | Dónde se guarda el candidato | Coordinación | La distribución |
| Q-23 | Si el candidato del módulo se entrega aunque el producto global no apruebe | Coordinación | Solo la comunicación: *MODULE se ejecuta y conserva su artefacto independientemente de jobs de integración* |

## 6. Definition of Done del hito

- [ ] Las 7 microtareas están en `HECHO` o en `BLOCKED` con motivo y salida del error.
- [ ] Todo estado de verificación es `PASS`/`FAIL`/`NOT_RUN`/`BLOCKED`. **No hay un solo `PASS` sin comando y exit code pegados.**
- [ ] La versión empaquetada es la que la regresión respalda.
- [ ] Ninguna evidencia heredada de una versión anterior sin justificación.
- [ ] Sin secretos y sin datos reales adentro.
- [ ] Ninguna afirmación excede lo que ejecutaste. *¿Algún éxito declarado depende de algo que no ejecutaste?*
- [ ] Avance reportado como `microtareas HECHO / 7`, no como porcentaje a ojo.

## 7. Handoff

Al cerrar, avisá por el daily a:

- **Justin** → El candidato a fijar en la relación.
- **Marcelo** → Qué versión entra en el candidato compuesto.
- **Pablo** → Si algo del empaquetado reveló una dependencia.

Si un bloqueo se confirma, **no itere sobre él**: registrá la causa y pasá a la siguiente microtarea independiente.
