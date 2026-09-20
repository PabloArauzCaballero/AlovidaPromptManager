# Iniciar la relación `agenda → mensajería` con dobles estrictos y su registro de checks

> **Rol:** responsable de relación e integración · **Línea:** B · **Día del plazo:** 1 · **Turno:** noche
> **Paquete fuente:** `BACKEND_AUTONOMO_MANTRA` · aplica [PROMPT_MAESTRO_BACKEND_AUTONOMO.md](../../../../../../../Downloads/BACKEND_AUTONOMO_MANTRA/BACKEND_AUTONOMO_MANTRA/PROMPT_MAESTRO_BACKEND_AUTONOMO.md)
> **Tu encargo sale de:** `PILOTO_MANTRA.md` pasos 4 y 6 · `GATES_Y_PRUEBAS_ADVERSAS.md` §1 (B1–B4), §2 (ADV-02, ADV-07, ADV-12) y §4 · `PLAN_SEIS_DIAS.md` (Día 1, línea de integración)

## 0. Ficha de asignación

| Campo | Valor |
|---|---|
| `PROFILE` | `MANTRA_DEV` |
| `MODE` | `DIAGNOSE_DESIGN` — **no modificás el backend esta noche**. El adaptador y el doble se **especifican** hoy contra el contrato que fija Ender |
| `WORKSPACE` | Checkout real de `mantra-core-health-api`. Si no lo tenés clonado, clonalo y registrá la ruta exacta. No inventar ruta |
| `TARGET_REF` | **El SHA que fija Pablo esta misma noche**. Hasta que lo publique, `32ae939983f0d665e4ed371362858801134d35cd`, y marcá con qué SHA trabajaste |
| `AUTHORIZED_BATCH` | Especificaciones, escenarios y registro de checks **en tu directorio de evidencia**. Cero escrituras en `src/` de Mantra |
| `PROCESS_SOURCE` | `METAPROMPT_PARA_ASTRA(1).md` (síntesis). El registro funcional original **no está identificado**: límite a arrastrar |
| `ALLOWED_INFRA` | Lectura del repo, `git`, `yarn`, `node`. PostgreSQL y Docker: **verificar disponibilidad, no asumirla** |
| `Escritura permitida` | Solo tu directorio de evidencia. El puerto es de Ender; la composición y el baseline son de Itzan. **No toques ninguno de los dos** |
| `Dependencia dura` | Tu doble se construye contra el contrato **fijado por Ender** (su M14). Mientras no exista, trabajás contra la definición leída y **marcás todo como provisional** |

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
*Iniciar la relación agenda → mensajería con dobles estrictos*. Cargar = abrirlas y leerlas antes de empezar, no tenerlas en disco.

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
| `async-messaging-events` | outbox, entrega at-least-once y consumidores idempotentes |
| `api-testing` | matriz de autorizacion negativa y conformidad de contrato |
| `integrity-testing` | un test con el ORM mockeado no prueba persistencia |
| `qa-evidence-reporting` | el formato de registro de un resultado |
| `e2e-failure-triage` | clasificar un rojo antes de tocar nada |
| `notifications-delivery` | solicitud persistida, aceptacion y evidencia de entrega |
| `security-guardrails` | que un doble no pueda bindearse en produccion |

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

Al cerrar tu turno, existe una especificación de la relación `agenda → mensajería` que cualquiera puede
implementar mañana: qué valida el doble, qué escenarios cubre, qué hace cuando lo llaman con algo no
previsto, y **en qué formato se registra cada resultado** — más la lista explícita de lo que un doble
**jamás** va a acreditar.

**Kill-test (lo más barato que demuestra que NO está hecho):** preguntá qué pasa si el código de aplicación
atrapa la excepción de una llamada no registrada. Si la respuesta es "el test pasa", no está hecho: el
cierre del harness tiene que fallar igual.

## 3. Alcance

**IN:** localización del adaptador real · especificación del doble estricto y sus reglas de fallo · catálogo
mínimo de escenarios de la operación elegida · formato de registro de checks con todos sus campos ·
comandos de verificación que existen de verdad · disponibilidad de PostgreSQL y Docker · ficha de la
relación (artefactos, contratos, configuración, baseline) · mapeo de datos, errores y seguridad ·
control que impide un doble en producción · lista explícita de lo que el doble no prueba.

**OUT:** implementar el adaptador o el doble · modificar el adaptador existente · ejecutar la integración
real (espera a los participantes reales) · **declarar la funcionalidad terminada con el backend mockeado** ·
decidir la semántica del contrato (es de Ender) · armar la composición ni el baseline (es de Itzan) ·
inventar una ventana de deduplicación, un TTL o una política de reintento que ninguna fuente define.

## 4. Plan

### Hito H1 — La relación está fijada y el doble no puede fabricar un verde

*Se le puede mostrar a cualquiera: "así se prueba esta relación, esto detecta el doble, esto NO lo detecta,
y así se registra cada resultado para que nadie lo lea como más de lo que es".*

**CA del hito:** Dada tu especificación, cuando alguien implementa el doble mañana, entonces un resultado
incompatible del proveedor y una llamada no registrada **fallan**, y ningún resultado del laboratorio queda
registrado como integración verificada.

---

#### Subtarea S1.1 — El doble estricto y su catálogo

| # | Microtarea | Criterio de aceptación | Definition of Done |
|---|---|---|---|
| M1 | Localizar `MessagingAgendaNoticeAdapter` en el árbol real | Hay ruta verificada abriendo el archivo, o `NOT_FOUND` con el patrón de búsqueda usado | Salida de la búsqueda pegada. Pablo lo busca también (su M9): **contrastá, no copies**. Si difieren, gana el archivo abierto |
| M2 | Registrar qué hace hoy el adaptador frente a la definición del puerto | Está escrito qué campos del resultado produce y de dónde salen | Fragmentos pegados con localizador. Es lectura: **no lo corrijas aunque veas algo raro** — lo que encontrás fuera de alcance se anota |
| M3 | Especificar el doble estricto de `AgendaNoticePort` | La especificación dice qué registra, qué valida y qué devuelve | Documento. El fake **registra solicitudes, valida forma y semántica conocida, devuelve sólo resultados previstos y falla ante operaciones no registradas**. Validar contra el contrato de Ender; mientras no exista, marcar `PROVISIONAL` |
| M4 | Fijar la regla de fallo del harness | Está escrito, como regla no negociable, qué pasa ante una llamada inesperada | Registro explícito: **una llamada inesperada es un error del harness, no un fallo operacional a convertir en `{delivered:false}`**; y **el harness conserva un fallo no consumido aunque el código de aplicación capture la excepción** (ADV-02). Sin esta regla, el laboratorio produce verdes falsos |
| M5 | Mapear el catálogo mínimo de escenarios a la operación elegida | Los siete casos están presentes, cada uno con qué se comprueba y con qué oráculo | Catálogo escrito: (1) cambio propio válido con aviso correcto, (2) proveedor indisponible, (3) recurso o actor de otra organización, (4) doble con respuesta incompatible, (5) operación no registrada, (6) repetición según idempotencia definida —**midiendo efectos persistidos, no cantidad de llamadas**—, (7) reloj y destinatario reproducibles con reset entre casos. El ejemplo de escenario del paquete es **formato de trabajo, no política completa de Mantra** |

#### Subtarea S1.2 — El registro de resultados, que es lo que evita el optimismo

| # | Microtarea | Criterio de aceptación | Definition of Done |
|---|---|---|---|
| M6 | Definir el formato de registro de un resultado | Están los trece campos y un ejemplo lleno | Formato con `check_id`, `gate`, `scope`, `artifact`, `required`, `applicable`, `status`, `reason`, `participants`, `command`, `exit_code`, `evidence_paths` y `limits`. **`command` y `exit_code` son null si no hubo ejecución, con causa explícita**, y **las rutas de evidencia tienen que existir** |
| M7 | Separar los estados de entrega de los veredictos de ejecución | Está escrito que son dos ejes distintos, con la lista de cada uno | Registro. Veredictos: `PASS`/`FAIL`/`NOT_RUN`/`BLOCKED`. Estados de entrega: `IN_PROGRESS`, `TRANSITIONAL_ISOLATION`, `DECISION_REQUIRED`, `MODULE_VERIFIED_WITH_CONTRACT_DOUBLES`, `ADAPTER_VERIFIED_WITH_DOUBLES`, `INTEGRATION_VERIFIED_WITH_REAL_IMPLEMENTATIONS`, `PRODUCT_ACCEPTANCE_VERIFIED`. **Un test marcado `skipped` por el runner se registra `NOT_RUN`, nunca `PASS`** |
| M8 | Registrar qué comandos de verificación **existen realmente** | Está el bloque `scripts` literal y marcado cuál sirve para typecheck, unit e integración | Bloque de `package.json` pegado tal cual. **Los comandos de los anexos del paquete son especificaciones, no comandos instalados: no inventes uno que no esté** |
| M9 | Verificar disponibilidad de PostgreSQL y Docker | Está el resultado real, con el error exacto si no hay | Salida pegada. Si no hay, `BLOCKED` con motivo — **nunca `PASS`**. Itzan verifica lo mismo (su M10): si los resultados difieren, eso es un hallazgo de entorno, no un empate a resolver a mano |

#### Subtarea S1.3 — La relación, y lo que el doble no acredita

| # | Microtarea | Criterio de aceptación | Definition of Done |
|---|---|---|---|
| M10 | Ficha de la relación `agenda → mensajería` | Están fijados artefactos, contratos, configuración y baseline de ambos extremos | Ficha del gate B1. Fija **versiones**, no ramas: el producto compone versiones verificadas compatibles, no la última rama incompleta de cada persona |
| M11 | Especificar el mapeo de datos, errores y seguridad de la relación | Cada campo del contrato tiene origen y destino; cada error, su traducción; y está declarado cómo viajan actor y organización | Especificación del gate B2. **Sin reglas de dominio duplicadas en el adaptador**: el adaptador traduce, no decide |
| M12 | Escribir la lista de lo que el doble **no** prueba | Están los tres canales con su límite explícito | Registro literal: para in-app, hay que comprobar **filas y acceso del destinatario real**; para correo, distinguir **solicitud persistida / aceptación por transporte / evidencia de entrega** —un sumidero local prueba el transporte hacia ese sumidero, **no certifica un proveedor externo**—; para chat, **un booleano no acredita conversación, membresía ni visibilidad**. Sin esta lista, `ADAPTER_VERIFIED_WITH_DOUBLES` se lee como integración terminada |
| M13 | Especificar el control que impide un doble en producción y una salida a destinatario real | Está el control, y el caso negativo que lo dispara | Especificación de ADV-07: **bloqueo efectivo antes del envío o del efecto**, con **evidencia de composición y política, no sólo el nombre de una variable de entorno**. Un `if (env !== 'prod')` no es un control: es una intención |

## 5. Ambigüedades registradas — **no las resuelvas, anotalas**

| ID | Ambigüedad | Quién puede resolverla | Qué bloquea |
|---|---|---|---|
| Q-01 | El paquete se fecha el **20 de septiembre de 2026** y hoy es **19 de septiembre de 2026** | Quien encargó el paquete | Nada técnico; afecta a qué "Día 1" significa |
| Q-06 | Obligatoriedad y durabilidad del aviso: comentario del puerto contra metaprompt | Decisión de negocio | Tu caso 2 del catálogo y todo el diseño de intención duradera. **No elijas vos** |
| Q-07 | Cuándo "corresponde" el canal de chat | Quien definió el alcance del piloto | Si el caso de chat entra en el catálogo de esta relación |
| Q-12 | Idempotencia: alcance y vigencia de la clave, y qué responder ante payload repetido o distinto | Ender al fijar la ficha, con decisión de negocio donde falte | Tu caso 6. **Sin definición no hay caso 6**: se registra `DECISION_REQUIRED`, no se fabrica una política |
| Q-13 | Política de reintentos transitorios, fallos terminales y tratamiento del agotamiento | Decisión de negocio | El comportamiento ante proveedor indisponible. **No inventar backoff ni número de intentos** |

## 6. Definition of Done del hito

- [ ] Las 13 microtareas están en `HECHO` o en `BLOCKED` con motivo y salida del error.
- [ ] Todo estado de verificación es `PASS`/`FAIL`/`NOT_RUN`/`BLOCKED`. **No hay un solo `PASS` sin comando y exit code pegados.**
- [ ] Ningún resultado obtenido con dobles está registrado como integración real. El estado máximo alcanzable hoy es `ADAPTER_VERIFIED_WITH_DOUBLES`.
- [ ] La especificación del doble hace fallar el caso 4 (respuesta incompatible) y el caso 5 (operación no registrada). Si tu diseño los deja pasar, no está hecho.
- [ ] Ninguna política de reintento, deduplicación o TTL aparece en el documento sin fuente. Lo que falta está `DECISION_REQUIRED`.
- [ ] Avance reportado como `microtareas HECHO / 13`, no como porcentaje a ojo.

## 7. Handoff

Al cerrar, avisá por el daily a:
- **Ender** → qué campos y qué reglas necesita tu validador que el contrato todavía no define (Q-12, Q-13).
- **Itzan** → la ficha de la relación (M10) y qué espera tu adaptador de la composición de capacidad.
- **Marcelo** → si la relación que priorizó exige un canal (correo o chat) cuyo límite de verificación está en tu M12.
- **Pablo** → los comandos reales (M8) y la disponibilidad de PostgreSQL/Docker (M9), que condicionan el plan de toda la semana.

Si un bloqueo se confirma, **no itere sobre él**: registrá la causa y pasá a la siguiente microtarea independiente.
