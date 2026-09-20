# Emitir el dictamen de aceptación con sus límites externos

> **Rol:** cierre funcional e integración · **Línea:** B · **Día del plazo:** 6 · **Turno:** noche
> **Paquete fuente:** `BACKEND_AUTONOMO_MANTRA`
> **Tu encargo sale de:** `PLAN_SEIS_DIAS.md` (Día 6, línea B) · `GATES_Y_PRUEBAS_ADVERSAS.md` gates C1–C3 y §5 · regla 40

## 0. Ficha de asignación

| Campo | Valor |
|---|---|
| `PROFILE` | `MANTRA_DEV` |
| `MODE` | `ACCEPTANCE` — emitís el dictamen que la evidencia sostiene |
| `WORKSPACE` | Checkout real de `mantra-core-health-api`. Registrá la ruta exacta. No inventar ruta |
| `TARGET_REF` | El corte fijado por Pablo el Día 1. **Si cambió, ese es tu corte** y lo declarás |
| `AUTHORIZED_BATCH` | Tu directorio de evidencia del Día 6 |
| `PROCESS_SOURCE` | `METAPROMPT_PARA_ASTRA(1).md` (síntesis) + [`docs/requisitos/REQUISITOS-CLIENTE-ALOVIDA.md`](../../../../../docs/requisitos/REQUISITOS-CLIENTE-ALOVIDA.md) |
| `ALLOWED_INFRA` | Lectura del repo, `git`, `yarn`, `node`. PostgreSQL y Docker: **verificar, no asumir** |
| `Predecesor` | Tu lote del Día 5. **No repitas lo que ya verificaste; sí re-verificá lo que tocaste después** |

> ### ✅ Hechos ya verificados contra el corte — no los repitas
>
> Las afirmaciones técnicas de este prompt salían del paquete, que es **la lectura de otra persona**.
> El 2026-09-19 se contrastaron contra el repositorio real, leyendo el corte
> `32ae939983f0d665e4ed371362858801134d35cd`. El detalle con localizadores está en
> [`VERIFICACION-CONTRA-CODIGO-2026-09-19.md`](../../../../../docs/verificacion/VERIFICACION-CONTRA-CODIGO-2026-09-19.md).
>
> **Ya confirmado, no hace falta que lo rehagas:**
>
> - **Pista fuerte para tu microtarea del registro original.** El comentario de
>   `agenda-notice.port.ts` cita: *«Los cuatro avisos que **el registro del cliente** pide
>   (**3.4, 3.5, 4.2 y 4.3**)»*, y más abajo *«**TAREA-15, punto 1 y 3 del pedido**»*.
>   **El registro original tiene secciones numeradas.**
> - El documento transcrito en [`REQUISITOS-CLIENTE-ALOVIDA.md`](../../../../../docs/requisitos/REQUISITOS-CLIENTE-ALOVIDA.md)
>   **no tiene numeración**. Eso **debilita** la hipótesis de que sean el mismo artefacto: se
>   solapan en contenido, pero probablemente no son el mismo documento. **`Q-04` sigue abierta**, y
>   ahora buscás algo concreto: un documento con secciones 3.x y 4.x y un pedido «TAREA-15».
> - Segunda pista: el script `ddl:sources` corre
>   `python ../mantra-core-health-model/salud-db/check_ddl_sources.py`. El backend espera el
>   **modelo canónico como checkout hermano**. El paquete lo reportó 404: eso es un **límite de
>   acceso**, no una inexistencia.
> - `package.json` tiene **112 scripts**, entre ellos `test:e2e` y `smoke`.
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
*Emitir el dictamen de aceptación con sus límites externos*. Cargar = abrirlas y leerlas antes de empezar, no tenerlas en disco.

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
| `uat-acceptance-signoff` | qué habilita y qué no habilita un dictamen |
| `work-report-md` | las tres secciones obligatorias |
| `qa-evidence-reporting` | el índice de evidencia |
| `progress-reporting` | el avance se calcula, no se estima |

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

Hay un dictamen que dice, sin eufemismos, qué quedó aprobado con evidencia, qué quedó pendiente, y qué depende de un tercero que no estuvo disponible.

**Kill-test (lo más barato que demuestra que NO está hecho):** Dale el dictamen a alguien que no vio la semana. Si después de leerlo no sabe qué puede usar y qué no, el dictamen no sirve.

## 3. Alcance

**IN:** dictamen con aprobado / pendiente / bloqueado · evidencia por recorrido exigido · límites externos declarados · consolidación de todo lo «no cubierto» de los reportes anidados · riesgos residuales.

**OUT:** firmar `PRODUCT_ACCEPTANCE_VERIFIED` sin C completo para el alcance exigido · **enterrar una limitación en un reporte anidado** · resumen optimista con algo en rojo · porcentaje estimado a ojo.

## 4. Plan

### Subtarea S4.1 — El dictamen

| # | Microtarea | Criterio de aceptación | Definition of Done |
|---|---|---|---|
| M1 | Escribir qué quedó aprobado, con su evidencia | Cada ítem con comando y salida | Tabla. **Si no podés pegar la salida, no va en aprobado** |
| M2 | Escribir qué quedó a medias, con las cuatro respuestas | Qué anda, qué no anda, qué falta exactamente, dónde quedó | Ítems completos. «Casi listo» está prohibido |
| M3 | Escribir qué quedó pendiente o bloqueado | Cada uno con qué lo destraba y de quién depende | Tabla |

### Subtarea S4.2 — Los límites

| # | Microtarea | Criterio de aceptación | Definition of Done |
|---|---|---|---|
| M4 | Declarar cada proveedor externo no verificado | Cada uno como aceptación externa pendiente | Lista |
| M5 | Consolidar el «No cubierto» de todos los reportes anidados | Nada queda enterrado abajo | Sección consolidada. Regla 40.7: **lo que quedó sin cubrir en QA queda sin cubrir en el trabajo, y tiene que aparecer arriba** |
| M6 | Declarar el estado de entrega del producto | El que la evidencia sostiene | Estado |

### Subtarea S4.3 — Honestidad del cierre

| # | Microtarea | Criterio de aceptación | Definition of Done |
|---|---|---|---|
| M7 | Calcular el avance como `HECHO / total` | El número sale de la fórmula | Cálculo pegado. **Ningún porcentaje a ojo** |
| M8 | Poner los fallos críticos en la primera línea | Si hay rojo, abre el documento | Documento |
| M9 | Listar los riesgos residuales con su impacto | Cada uno | Tabla |

## 5. Ambigüedades registradas — **no las resuelvas, anotalas**

| ID | Ambigüedad | Quién puede resolverla | Qué bloquea |
|---|---|---|---|
| Q-04 | Aceptación documental integral: sigue dependiendo del registro original aprobado | Quien lo tenga | La parte documental del dictamen, no la técnica |
| Q-R5 | Los 8 módulos del cliente contra el plazo de seis días | Coordinación | Qué significa «aceptado»: hay que decirlo explícito en el dictamen |

## 6. Definition of Done del hito

- [ ] Las 9 microtareas están en `HECHO` o en `BLOCKED` con motivo y salida del error.
- [ ] Todo estado de verificación es `PASS`/`FAIL`/`NOT_RUN`/`BLOCKED`. **No hay un solo `PASS` sin comando y exit code pegados.**
- [ ] Ningún ítem aprobado sin salida literal pegada.
- [ ] Ningún ítem a medias sin las cuatro respuestas.
- [ ] Ninguna limitación quedó solo en un reporte anidado.
- [ ] El porcentaje sale de la fórmula.
- [ ] Ningún dato de persona en el dictamen.
- [ ] Ninguna afirmación excede lo que ejecutaste. *¿Algún éxito declarado depende de algo que no ejecutaste?*
- [ ] Avance reportado como `microtareas HECHO / 9`, no como porcentaje a ojo.

## 7. Handoff

Al cerrar, avisá por el daily a:

- **Todo el equipo** → El dictamen.
- **Pablo** → Las decisiones de alcance que quedan para quien coordine.
- **Quien encargó el paquete** → Los pendientes que solo puede cerrar negocio.

Si un bloqueo se confirma, **no itere sobre él**: registrá la causa y pasá a la siguiente microtarea independiente.
