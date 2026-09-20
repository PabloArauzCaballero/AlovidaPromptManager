# Construir el laboratorio de la capacidad del piloto

> **Rol:** habilitación de autonomía · **Línea:** A · **Día del plazo:** 2 · **Turno:** noche
> **Paquete fuente:** `BACKEND_AUTONOMO_MANTRA`
> **Tu encargo sale de:** `PLAN_SEIS_DIAS.md` (Día 2, línea A) · `PILOTO_MANTRA.md` paso 4 · `GATES_Y_PRUEBAS_ADVERSAS.md` ADV-02 y L1–L7

## 0. Ficha de asignación

| Campo | Valor |
|---|---|
| `PROFILE` | `MANTRA_DEV` |
| `MODE` | `BUILD_LAB` — construís el laboratorio **fuera** de `src/` de Mantra. Cero cambios en código de producto |
| `WORKSPACE` | Checkout real de `mantra-core-health-api`. Registrá la ruta exacta. No inventar ruta |
| `TARGET_REF` | El corte fijado por Pablo el Día 1. **Si cambió, ese es tu corte** y lo declarás |
| `AUTHORIZED_BATCH` | Tu directorio de evidencia del Día 2 |
| `PROCESS_SOURCE` | `METAPROMPT_PARA_ASTRA(1).md` (síntesis) + [`docs/requisitos/REQUISITOS-CLIENTE-ALOVIDA.md`](../../../../../docs/requisitos/REQUISITOS-CLIENTE-ALOVIDA.md) |
| `ALLOWED_INFRA` | Lectura del repo, `git`, `yarn`, `node`. PostgreSQL y Docker: **verificar, no asumir** |
| `Predecesor` | Tu lote del Día 1. **No repitas lo que ya verificaste; sí re-verificá lo que tocaste después** |

> ### ✅ Hechos ya verificados contra el corte — no los repitas
>
> Las afirmaciones técnicas de este prompt salían del paquete, que es **la lectura de otra persona**.
> El 2026-09-19 se contrastaron contra el repositorio real, leyendo el corte
> `32ae939983f0d665e4ed371362858801134d35cd`. El detalle con localizadores está en
> [`VERIFICACION-CONTRA-CODIGO-2026-09-19.md`](../../../../../docs/verificacion/VERIFICACION-CONTRA-CODIGO-2026-09-19.md).
>
> **Ya confirmado, no hace falta que lo rehagas:**
>
> - Las **5 rutas** citadas existen en el corte.
> - `SchedulingDelayService` → `src/modules/scheduling/services/scheduling-delay.service.ts`
> - `SchedulingAgendaNoticesService` → `src/modules/scheduling/services/scheduling-agenda-notices.service.ts`
> - `MessagingAgendaNoticeAdapter` → `src/modules/scheduling/adapters/messaging-agenda-notice.adapter.ts`
> - **Los tres ya tienen su `.spec.ts` al lado.** No empezás de cero: empezá leyendo qué fijan esos tests.
> - `package.json` declara **112 scripts**. Los que te sirven: `typecheck`, `build`, `lint`, `test`,
>   `test:integration`, `test:e2e`, `smoke`, `infra:up`. `packageManager: yarn@4.14.1`.
> - `test:integration` fija **`ORM_SCHEMA_SYNC=off`**: el esquema no se sincroniza solo ahí.
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

Son **19**: 11 del proceso, que carga todo el equipo, y 8 propias de
*Construir el laboratorio de la capacidad del piloto*. Cargar = abrirlas y leerlas antes de empezar, no tenerlas en disco.

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
| `test-data-management` | datos deterministas, aislados y limpiables |
| `synthetic-test-data-generation` | generar volumen sin usar datos reales |
| `unit-testing` | un comportamiento por test |
| `edge-case-data-catalog` | los casos borde que no se te ocurren solos |

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

Existe un laboratorio que corre la capacidad elegida contra PostgreSQL real, con reset entre casos y reloj controlado, y que **falla** cuando alguien lo usa mal.

**Kill-test (lo más barato que demuestra que NO está hecho):** Pedile a alguien que llame una operación que el harness no registró y que atrape la excepción en el código de aplicación. Si el test igual pasa, el laboratorio no sirve: está fabricando verdes.

## 3. Alcance

**IN:** harness de la capacidad · reset completo entre casos · reloj y destinatario reproducibles · validador de forma y semántica · registro de solicitudes · los checks L1–L7 del generador.

**OUT:** tocar `src/` de Mantra · la prueba de ausencia (es de Itzan hoy) · decidir semántica del contrato (Ender) · declarar la capacidad verificada: el laboratorio **habilita** la verificación, no la sustituye.

## 4. Plan

### Subtarea S1.1 — El harness y su regla de fallo

| # | Microtarea | Criterio de aceptación | Definition of Done |
|---|---|---|---|
| M1 | Montar el laboratorio de la capacidad elegida, fuera de `src/` | Corre y ejecuta al menos un caso de punta a punta | Salida del comando pegada con exit code. Si no hay PostgreSQL alcanzable, `BLOCKED` con el error exacto — **nunca `PASS`** |
| M2 | El harness registra cada solicitud recibida | Se puede listar qué se le pidió y con qué argumentos | Salida del registro pegada para un caso |
| M3 | Una operación no registrada hace fallar el cierre del harness | Falla **aunque** el código de aplicación capture la excepción | Caso ejecutado y su salida. Esto es ADV-02: si pasa en verde, el laboratorio está roto |
| M4 | Un fallo no consumido se conserva hasta el cierre | El cierre lo reporta | Caso ejecutado con su salida |

### Subtarea S1.2 — Reproducibilidad

| # | Microtarea | Criterio de aceptación | Definition of Done |
|---|---|---|---|
| M5 | Reset completo del estado entre casos | Dos corridas seguidas del mismo caso dan el mismo resultado | Dos salidas pegadas, idénticas salvo timestamps |
| M6 | Reloj y destinatario fijados, no tomados del sistema | El caso no cambia de resultado según la hora a la que se corra | Configuración pegada + caso corrido dos veces |
| M7 | La limpieza rechaza una base que no sea la del run | Con un nombre arbitrario, se niega | Caso negativo ejecutado. Sin esto, alguien borra la base de un compañero |

### Subtarea S1.3 — Los checks del generador

| # | Microtarea | Criterio de aceptación | Definition of Done |
|---|---|---|---|
| M8 | Recorrer L1–L7 y declarar cuáles aplican | Cada uno: aplica y su resultado, o no aplica con motivo | Tabla con los 7. `L5` es el más importante: **el oráculo no puede usar la función que prueba para calcular el esperado** |
| M9 | Registrar que generar fixtures NO es haber corrido tests | Está escrito en el documento de entrega | Cita de `L6`: *generación no se reporta como tests; integración con dobles no se reporta como real* |

## 5. Ambigüedades registradas — **no las resuelvas, anotalas**

| ID | Ambigüedad | Quién puede resolverla | Qué bloquea |
|---|---|---|---|
| Q-08 | Qué operación concreta se aísla | Alcance del piloto | El catálogo de casos del laboratorio |
| Q-12 | Idempotencia sin definir: alcance y vigencia de la clave | Negocio, vía contrato de Ender | El caso de repetición |
| Q-14 | Qué volumen de datos sintéticos hace falta para que el caso sea realista | Coordinación | Solo el realismo, no la corrección. Empezá con el mínimo |

## 6. Definition of Done del hito

- [ ] Las 9 microtareas están en `HECHO` o en `BLOCKED` con motivo y salida del error.
- [ ] Todo estado de verificación es `PASS`/`FAIL`/`NOT_RUN`/`BLOCKED`. **No hay un solo `PASS` sin comando y exit code pegados.**
- [ ] Ningún caso del catálogo quedó en verde por un fallback que fabricó éxito.
- [ ] El laboratorio falla ante operación no registrada y ante respuesta incompatible.
- [ ] Ningún dato real de persona entró al laboratorio: todo sintético y declarado como tal.
- [ ] Ninguna afirmación excede lo que ejecutaste. *¿Algún éxito declarado depende de algo que no ejecutaste?*
- [ ] Avance reportado como `microtareas HECHO / 9`, no como porcentaje a ojo.

## 7. Handoff

Al cerrar, avisá por el daily a:

- **Itzan** → El laboratorio que va a correr dentro de la copia descartable de su prueba de ausencia.
- **Justin** → Qué valida hoy el harness y qué no, para que su doble no asuma de más.
- **Ender** → Qué reglas del contrato el validador no puede comprobar todavía.

Si un bloqueo se confirma, **no itere sobre él**: registrá la causa y pasá a la siguiente microtarea independiente.
