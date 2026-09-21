# Agenda: dos solapas, el cupo manda la hora, y una sola consulta a la vez

> **Rol:** propietario de la sección Consultas médicas (`/schedule`) · **Línea:** A · **Fecha:** 2026-09-20 · **Turno:** noche
> **Fuente del pedido:** [`CORRECCIONES-DOCTOR-2026-09-20.md`](../../../../../docs/requisitos/CORRECCIONES-DOCTOR-2026-09-20.md) · **Verificación contra el código:** [`VERIFICACION-CONTRA-CODIGO-2026-09-20.md`](../../../../../docs/verificacion/VERIFICACION-CONTRA-CODIGO-2026-09-20.md)
> **Correcciones que cubrís: C-04, C-07, C-08, C-10, C-11, C-12 (UI), C-13 (UI)** — 7 de 24.
> **6 hitos · 18 subtareas · 55 microtareas**, todas con criterio de aceptación y Definition of Done.

## 0. Ficha de asignación

| Campo | Valor |
|---|---|
| `REPO` | `alovida/mantra-core-health` (frontend Angular). **Nada de backend en este lote** |
| `TARGET_REF` | `origin/mockup` — corte leído **`689697821a6e6d2c8f702c7508d6728fa9a1869a`** (PR #554, 2026-09-20T12:32-04). **Reconsultalo y fijá el tuyo** en tu `PLAN.md`: si avanzó, ese es tu corte y lo declarás |
| `RAMA DE TRABAJO` | Una tuya, saliendo de `origin/mockup`. **No trabajes sobre `mockup` directo y no mergees nada sin PR** |
| `ARCHIVOS RESERVADOS PARA VOS` | `src/app/features/agenda/**` · `src/app/features/my-services/**` |
| `ARCHIVOS DE OTROS — NO LOS TOQUES` | `src/app/shared/**` y `features/account/my-profile/**` (Itzan) · `patient-chart/medication-block/**` (Justin) · `patient-chart/free-note-block/**`, `patient-chart/admission-block/**`, `clinical-record/consultation/**` (Marcelo) · `core/mock/**`, `features/dashboard/**`, `core/data-access/**` (Ender) |
| `LA MAQUETA NO TIENE BACKEND` | `mockBackend: true` fijo en `src/environments/environment.ts` de esta rama. Tu DoD se demuestra contra los manejadores simulados de `src/app/core/mock/` — **que son de Ender**: lo que necesites ahí, se lo pedís por el daily |
| `CUENTA DE PRUEBA` | `medica@alovida.mock` (cualquier contraseña no vacía). Es **sintética declarada**: se puede pegar en el reporte |
| `LÍMITE DE RECURSOS` | Regla 70: **un** `yarn start`, **un** build, **un** navegador, Playwright con `--workers=1`. Nada en background que no cierres vos |

## 1. Antes de escribir una línea — instalación OBLIGATORIA del estándar

> **Esta sección no es opcional y no es el final del día: es lo primero.** Un prompt ejecutado sin
> el estándar cargado produce trabajo que después hay que rehacer, porque no va a tener plan, ni
> evidencia, ni reporte. **Si no podés completar este paso, estás `BLOQUEADO`: avisalo y no sigas.**

### 1.1 Instalar el estándar en tu checkout

```bash
# 1. Clonar el estandar al lado del repo de producto
git clone https://github.com/PabloArauzCaballero/AlovidaPromptManager.git ../AlovidaPromptManager

# 2. Copiarlo DENTRO de tu checkout de trabajo (Claude Code solo carga desde ./.claude/)
cp -r ../AlovidaPromptManager/.claude   ./
cp    ../AlovidaPromptManager/AGENTS.md ./
cp -r ../AlovidaPromptManager/.agents   ./   # solo si tu herramienta no lee .claude/

# 3. Verificar que quedo instalado (pega esta salida en tu daily)
ls .claude/skills | wc -l            # -> 176
ls .claude/rules/[0-9]*.md | wc -l   # -> 14  (mas el README, que no es una regla)
python .claude/hooks/plan_gate.py --self-test    # -> 11 PASS, 0 FAIL
```

**Si el `git clone` falla con 404:** el estándar todavía no está publicado. Pedíselo a Pablo por
copia directa y registralo como límite de acceso. **Un 404 no demuestra que el repositorio no exista.**

**No commitees `.claude/` dentro de `mantra-core-health` sin acordarlo con el equipo.**

### 1.2 Qué te instala eso

| Candado | Qué impide |
|---|---|
| `plan_gate.py` | Escribir código sin `PLAN.md` en disco. Nunca bloquea `.md` ni nada bajo `docs/`, así que siempre podés crear el plan primero |
| `report_gate.py` | Cerrar la sesión con trabajo activo y sin `REPORTE.md`, o con un reporte al que le falta alguna de las tres secciones |
| `blocker_gate.py` | Cerrar con microtareas en `BLOQUEADO` o `EN CURSO` cuyo plan no declare la simulación de los tres niveles del contrato (regla 65) |

**En cualquier otra herramienta (Cursor, Codex, Copilot, Continue, Windsurf, Cline) los candados NO
corren.** El plan y el reporte siguen siendo igual de obligatorios; lo único que cambia es que nadie
te va a frenar.

### 1.3 Skills que tenés que CARGAR para este lote

Son **24**: 11 del proceso, que carga todo el equipo, y 13 propias de la agenda.
Cargar = abrirlas y leerlas antes de empezar, no tenerlas en disco.

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
| `appointment-scheduling` | horarios, bloqueos, disponibilidad calculada y prevención de doble reserva |
| `state-machines-workflows` | el ciclo de la cita y por qué la precondición va en la escritura |
| `angular-development` | componentes standalone, `@if`/`@for`, `input()`, señales, OnPush |
| `angular-signals-state` | dónde vive cada dato: local, feature, URL |
| `frontend-ux-states` | los cuatro estados obligatorios: cargando, con datos, vacío y error |
| `frontend-navigation-ia` | qué pasa con un enlace viejo cuando desaparece una solapa |
| `frontend-accessibility` | modal con foco atrapado, `Escape` y restauración del foco |
| `frontend-responsive-layout` | que semana y mes sigan leyéndose en móvil |
| `frontend-motion` | el hover que se pide, respetando movimiento reducido |
| `atomic-design-components` | reusar `app-menu`, `app-content-dialog` y `segmented-control` en vez de crearlos |
| `visual-proof` | la captura no vale si no la mirás |
| `e2e-playwright` | locators por rol y texto, web-first assertions, cero `waitForTimeout` |
| `e2e-failure-triage` | clasificar el rojo antes de tocarlo |

Entrá siempre por `skills-router`: **no leas el catálogo entero, no sirve.**

### 1.4 DoD de esta sección — se verifica como cualquier otra

- [ ] `ls .claude/skills | wc -l` devolvió **176**, y la salida está pegada en tu daily.
- [ ] `python .claude/hooks/plan_gate.py --self-test` devolvió **11 PASS, 0 FAIL**, salida pegada.
- [ ] Leíste `skills-router` y las 24 skills de las dos tablas.
- [ ] Creaste tu `PLAN.md` **antes** del primer `Edit`/`Write` de código.

**Sin estas cuatro casillas, tu lote arranca en `BLOQUEADO`, no en `EN CURSO`.**

> ### ✅ Hechos ya verificados contra el corte — no los repitas, pero tampoco los creas sin abrir el archivo
>
> Está todo con archivo y línea en
> [`VERIFICACION-CONTRA-CODIGO-2026-09-20.md`](../../../../../docs/verificacion/VERIFICACION-CONTRA-CODIGO-2026-09-20.md).
> Lo que más te importa:
>
> - **`/schedule` tiene HOY cuatro solapas**, no dos: `agenda.ts:385` declara
>   `type AgendaTab = 'calendar' | 'consultations' | 'schedule' | 'slots'`, y los valores del query
>   param son las constantes `TABLE_VIEW = 'table'` (375), `SCHEDULE_VIEW = 'agenda'` (378) y
>   `SLOTS_VIEW = 'cupos'` (381). `pestanaActual()` está en 808-813.
> - **La solapa que el doctor llama «Calendario» es la de `agenda.html:212`**, y monta
>   `<app-my-agenda mode="calendar">` (211-221). **La solapa de la 229 ya se llama «Consultas»**
>   (`rotuloDeConsultas()`): por eso quitar la tabla y renombrar el calendario van juntos, o quedan
>   dos «Consultas» a la vez.
> - **El «formulario que aparece abajo» es `app-tarjeta-del-dia`** (`my-agenda.html:148-162`),
>   que recibe `[desdeInicial]`/`[hastaInicial]`. No es un formulario dentro de la tabla.
> - **La extensión por emergencia ya tiene su modelo**: los tipos de bloqueo traen `blocks: true|false`
>   y `EXTRA` es el único con `blocks: false`, porque **añade** disponibilidad
>   (`core/mock/handlers/scheduling.handlers.ts:29-35`; en la API, `EXCEPTION_TYPES` en
>   `scheduling-catalog.dto.ts:735`). **Un horario extra no es un slot inventado: es una excepción `EXTRA`.**
> - **«OTROS SERVICIOS» no existe** en la lista cerrada de 7 motivos. La salida sin romper contrato es
>   `exceptionType: 'OTHER'` + `reason: 'Otros servicios'`, que es el uso que el propio contrato
>   documenta. Ampliar el enum es decisión de negocio (ver `Q-D6`).
> - **`iniciarAtencion`** está en `agenda.ts:1941` y navega con `irAAtender` (1970) a
>   `cita.rutaAtencion`, que **puede ser `null`** sin permiso de expediente.
> - **Los tres botones de arriba a la derecha** son `page-actions` en `agenda.html:13`, `27` y `49`.
>   El de la 49 es el **único** camino que quedó a «Visitas de laboratorio»: el comentario del
>   archivo lo dice. Por eso C-11 y C-13 están en el mismo lote.
> - **El visitador no accede a información clínica** y la visita comercial **no se mezcla** con la
>   agenda clínica: está citado de la especificación en `core/data-access/pharma-lab/pharma-lab.types.ts:9`.
>
> ⚠️ **Lo que esa verificación NO hizo: ejecutar.** No se corrió build, ni tests, ni se abrió la
> maqueta en un navegador. **Que un símbolo exista no prueba que la pantalla se comporte como su
> comentario promete.** Todo lo que sea comportamiento es tuyo.
>
> 🔧 **Trampa de método que te va a pasar:** los números de línea de arriba son de `origin/mockup`
> al corte `68969782…`. El working copy está en otra rama y **tres de estas cosas no existen ahí**.
> Si tu búsqueda no encuentra algo, verificá primero **contra qué ref** estás buscando:
> `git show origin/mockup:<ruta> | grep -n '<patrón>'`.

## 2. Resultado observable

Al cerrar el turno, esto es lo que alguien tiene que poder **ver** en la maqueta, en este orden de dependencia:

| Hito | Prioridad | Qué queda demostrado |
|---|---|---|
| **H1** | `BLOQUEANTE` | La maqueta levanta en tu máquina, el corte está declarado, y existe una captura **previa** de las cuatro solapas y de los tres botones del encabezado, con los gates en su estado de partida. Sin esto no se puede demostrar después que algo cambió. |
| **H2** | `BLOQUEANTE` | `/schedule` tiene **dos** solapas: «Consultas» (el calendario) y «Mis horarios». La tabla y los cupos no están, los enlaces viejos siguen llegando a algún lado declarado, y el encabezado no tiene los tres botones. |
| **H3** | `ALTA` | Tocar un rato libre abre un **modal** —no un formulario al pie—, que no pregunta la hora, usa toggles, muestra los bloqueos y los descansos como no disponibles, y ofrece extender fuera del horario **preguntando primero**. |
| **H4** | `ALTA` | En semana cada cita se despliega con el mismo globo que el día; en mes el hover es una tarjeta con chips de atendido / no atendido; y tocar una tarjeta lleva a iniciar el encuentro. |
| **H5** | `ALTA` | No se puede iniciar una segunda consulta con una en curso, y el sistema **dice por qué**. La visita de laboratorio se ve en la misma pestaña como tarjeta de visitador de 15 minutos. «Mis Servicios» tiene programación de horarios y su bloqueo aparece en la agenda clínica. |
| **H6** | `ALTA` | Las acciones de fila de la agenda son un desplegable con icono **y** texto, la regresión está corrida, y hay capturas mirando los tres viewports y los dos temas. |

> ⚠️ **Esto es más de lo que entra en una noche, y está dicho a propósito.** El alcance se entrega
> completo y ordenado por dependencia: se cierra lo que se pueda, y **lo que no se cierra queda
> `A MEDIAS` con qué anda, qué no anda y qué falta exactamente** (regla 20). Recortar alcance es una
> decisión de coordinación, no tuya, y se registra.

**Kill-test del turno completo:** abrí `/schedule?vista=table` y `/schedule?vista=cupos` en la
maqueta. Si alguna de las dos muestra una tabla, C-07 y C-10 no están hechos. Después tocá un rato
libre del día: si el formulario aparece **abajo** en vez de en un modal, H3 no está hecho. Y con una
consulta en curso, pulsá iniciar en otra: si arranca, C-11 no está hecho.

## 3. Alcance

**IN:** el corte declarado y la maqueta levantada · capturas previas de las 4 solapas y del
encabezado · retiro de la solapa de tabla (`vista=table`) con destino declarado para
`vista=citas`/`vista=solicitudes` · retiro de la solapa «Cupos» y reubicación de lo único que vivía
ahí (reservar un cupo) · renombre de «Calendario» a «Consultas» sin dejar dos solapas con el mismo
nombre · retiro de los tres `page-actions` del encabezado · `app-tarjeta-del-dia` convertida en
modal accesible · quitar los campos de hora del alta sobre un cupo ya programado · toggles en vez de
radios · slots que coinciden con el horario publicado · bloqueos y descansos pintados como no
disponibles y **no reservables** · alta de horario extra al final con diálogo de confirmación que
nombre que se sale del horario de atención · cita desplegable en semana con el globo del día · hover
de tarjeta con chips de estado en mes · tarjeta cliqueable que lleva a iniciar el encuentro · regla
de una sola consulta en curso, con el motivo dicho · tarjeta de visitador con su tono y su palabra,
de 15 minutos por omisión · programación de horarios de «Mis Servicios» reciclando las vistas del
horario, con su bloqueo `OTHER` + «Otros servicios» · aplicación del desplegable de acciones de fila
de Itzan en las celdas de acción de la agenda · regresión dirigida, barrido y click-sweep de la
maqueta · capturas por viewport y tema · `PLAN.md`, `REPORTE.md` y `evidencia/`.

**OUT:** **cualquier archivo fuera de `src/app/features/agenda/**` y `src/app/features/my-services/**`** ·
`src/app/shared/**` (es de Itzan: si necesitás un componente nuevo compartido, **lo pedís**, no lo
escribís) · `src/app/core/mock/**` (es de Ender: los datos y manejadores que te falten **se los
pedís**) · `features/dashboard/**` · `medication-block/**`, `free-note-block/**`,
`admission-block/**`, `consultation/**` · **el repo de la API**: no se toca `mantra-core-health-api`
en este lote, ni para «arreglar» el contrato de motivos · ampliar el enum `ExceptionType` (decisión
de negocio) · cambiar la semántica de un estado de cita para que el filtro salga más fácil ·
mockear el backend real para declarar una funcionalidad terminada · borrar la bandeja `/lab-visits`
o su ruta · dar acceso clínico al visitador · usar `confirm()`/`alert()` del navegador para la
confirmación de extensión · escribir un color literal en vez de un token · subir un timeout o
agregar un reintento para que un test pase · declarar `HECHO` una microtarea cuyo DoD no corriste ·
refactorizar `agenda.ts` «de paso» porque tiene 2000 líneas: lo que veas mal fuera de alcance **se
anota**.

## 4. Plan — hitos, subtareas y microtareas

Los seis estados permitidos son exactamente: `TODO`, `EN CURSO`, `HECHO`, `A MEDIAS`, `BLOQUEADO` y
`DESCARTADO`. **`A MEDIAS` es legítimo; disfrazarlo de `HECHO` no.** Una microtarea cuyo DoD no se
ejecutó nunca es `HECHO`, aunque el código esté escrito.

### H1 — Corte, maqueta arriba y estado de partida

**Prioridad:** `BLOQUEANTE`

**CA:** Dado tu entorno, cuando alguien pregunta contra qué versión trabajaste y cómo estaba la pantalla antes, entonces hay un SHA declarado, la maqueta corriendo y capturas previas de las cuatro solapas — no un recuerdo.

**DoD:** Las 9 microtareas en `HECHO` o `BLOQUEADO` con el error exacto. `yarn typecheck` y `yarn lint` con su exit code pegado como línea de base. Capturas en `evidencia/antes/`.

**Kill-test del hito:** pedí el SHA del corte y la captura previa de la solapa «Cupos». Si no existen, no hay con qué comparar nada de lo que sigue.

**Estado:** TODO

#### H1.S1 — El corte y el entorno

**CA:** Dada tu rama, cuando se la compara con `origin/mockup`, entonces sale de ese corte y el SHA está escrito en tu `PLAN.md`.

**DoD:** Las 3 microtareas en `HECHO`, con la salida de `git log -1` pegada.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H1.S1.M1 | Traer `origin/mockup`, declarar el SHA del corte y salir de ahí con tu rama | El SHA está en tu `PLAN.md` y tu rama sale de él | `git fetch origin && git log -1 --format='%H %ad %s' origin/mockup` → pegada. Si difiere de `68969782…`, **el tuyo manda** y lo declarás | TODO |
| H1.S1.M2 | Confirmar por tu cuenta que esta rama no habla con ninguna API | Está citado el archivo y la línea del interruptor | `git show origin/mockup:src/environments/environment.ts \| grep -n mockBackend` → pegada. **No lo des por bueno porque lo diga este prompt** | TODO |
| H1.S1.M3 | Levantar la maqueta y entrar con `medica@alovida.mock` | La maqueta responde en `http://localhost:4200` y la sesión entra | `yarn install && yarn start`, más la captura del panel ya dentro. Un `yarn start` solo (regla 70.1.6: un proceso por puerto) | TODO |

#### H1.S2 — El mapa real de las solapas

**CA:** Dada la sección, cuando se pregunta qué solapa muestra cada valor de `vista=`, entonces hay una tabla hecha abriendo el archivo, no copiada de este prompt.

**DoD:** Las 3 microtareas en `HECHO`, con los fragmentos pegados.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H1.S2.M1 | Verificar las cuatro solapas y las constantes de `vista=` en tu corte | La tabla `vista=` → solapa es literal del archivo | Fragmento de `agenda.ts` alrededor de `pestanaActual()` pegado, con números de línea **tuyos** | TODO |
| H1.S2.M2 | Registrar qué hace hoy cada valor viejo: `citas`, `solicitudes`, `agenda`, `cupos`, `table` | Los cinco tienen su destino actual escrito | Tabla pegada. Los dos primeros **caen a propósito** a la lista unificada: eso hay que resolverlo, no romperlo | TODO |
| H1.S2.M3 | Registrar qué es lo único que se puede hacer desde «Cupos» y desde la tabla que no se pueda hacer en otro lado | Está la lista, con archivo y línea de cada acción | Inventario pegado. Si algo sólo vive ahí, **quitarlo sin reubicarlo es perder una función**, no una limpieza | TODO |

#### H1.S3 — Línea de base de gates y capturas previas

**CA:** Dado el estado de partida, cuando algo se ponga rojo más tarde, entonces se puede demostrar si ya estaba rojo antes.

**DoD:** Las 3 microtareas en `HECHO`, con exit codes pegados y las capturas en disco.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H1.S3.M1 | Correr typecheck y lint **antes** de tocar nada | Hay exit code de los dos | `yarn typecheck; yarn lint` → salidas en `evidencia/antes/gates.txt`. Si algo ya está rojo, **eso es baseline, no tu bug**: queda registrado | TODO |
| H1.S3.M2 | Correr los specs de agenda que ya existen, como baseline | Hay salida del runner | `npx ng test --include=src/app/features/agenda/agenda.spec.ts --include=src/app/features/agenda/my-agenda/my-agenda.spec.ts --watch=false` → pegada | TODO |
| H1.S3.M3 | Capturar las 4 solapas y el encabezado antes de tocar | Hay 5 capturas con nombre que dice qué son | Archivos en `evidencia/antes/`. **Sin la captura previa, «ahora se ve mejor» no es evidencia de nada** | TODO |

### H2 — De cuatro solapas a dos, y el encabezado limpio

**Prioridad:** `BLOQUEANTE`

**CA:** Dado `/schedule`, cuando quien atiende lo abre, entonces ve exactamente dos solapas —«Consultas» (el calendario) y «Mis horarios»—, no hay ninguna tabla de consultas ni de cupos, y el encabezado no tiene los tres botones de arriba a la derecha.

**DoD:** Las 10 microtareas en `HECHO`. `yarn typecheck` en 0. Captura de la sección con dos solapas. Para cada enlace viejo, su destino nuevo declarado y **probado navegando**.

**Kill-test del hito:** entrá a `/schedule?vista=table` y `/schedule?vista=cupos`. Si aparece una tabla, no está hecho. Entrá a `/schedule?vista=citas`: si cae en un 404 o en una solapa vacía, rompiste un enlace.

**Estado:** TODO

#### H2.S1 — Quitar la vista de tabla sin romper enlaces (C-07)

**CA:** Dada la sección, cuando se abre con `vista=table`, `vista=citas` o `vista=solicitudes`, entonces se llega a una solapa que existe y muestra las consultas de la ventana, sin error de consola.

**DoD:** Las 4 microtareas en `HECHO`, con la navegación probada en el navegador y la consola limpia.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H2.S1.M1 | Decidir y **escribir** a dónde caen `table`, `citas` y `solicitudes`, antes de borrar nada | Los tres tienen destino declarado en el `PLAN.md` | Decisión escrita. Si el destino es el calendario, decilo; si es una redirección, decilo. **Elegir en silencio es lo que esta microtarea existe para evitar** | TODO |
| H2.S1.M2 | Quitar la solapa de la tabla de consultas de `agenda.html` y su `columnasDeConsultas()` si queda sin uso | La solapa no está y no queda código muerto sin anotar | `yarn typecheck` exit 0 pegado. Lo que quede sin uso y no sea tuyo quitarlo, **se anota** | TODO |
| H2.S1.M3 | Hacer que los tres valores viejos resuelvan al destino declarado | Los tres abren una solapa existente | Las tres URLs abiertas en el navegador, con captura y la consola sin errores nuevos | TODO |
| H2.S1.M4 | Verificar que ningún `routerLink` ni test del repo apuntaba a `vista=table` | Cero referencias, o todas actualizadas | `git grep -n "vista=table\|vista=citas\|vista=solicitudes" -- src cypress playwright` → salida pegada | TODO |

#### H2.S2 — Quitar «Cupos» y reubicar lo único que vivía ahí (C-10, primera mitad)

**CA:** Dada la sección, cuando se busca reservar un cupo para un paciente, entonces el camino existe desde el calendario, y `vista=cupos` no muestra ninguna tabla.

**DoD:** Las 3 microtareas en `HECHO`, con el camino nuevo recorrido de punta a punta en el navegador.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H2.S2.M1 | Verificar qué se pierde al quitar la solapa: la celda `#celdaReservar` y su ruta `/schedule/book/:slotId` | Está escrito qué acción queda huérfana y desde dónde se va a ofrecer ahora | Inventario + decisión. **La ruta de reserva no se borra**: sigue siendo el destino, cambia quién la ofrece | TODO |
| H2.S2.M2 | Quitar la solapa «Cupos» y su tabla | La solapa no está; `vista=cupos` cae al destino declarado | Captura de las dos solapas + `yarn typecheck` exit 0 | TODO |
| H2.S2.M3 | Recorrer la reserva completa desde el calendario, con un cupo real de la maqueta | La reserva llega a confirmarse y el cupo cambia de estado | Recorrido con capturas del antes y el después del cupo. **Un 200 no prueba que el cupo cambió: mirá la pantalla** | TODO |

#### H2.S3 — «Calendario» pasa a llamarse «Consultas», y el encabezado se limpia (C-08, C-11)

**CA:** Dada la sección, cuando se leen los rótulos de las solapas, entonces hay una sola «Consultas» y es el calendario; y el encabezado no ofrece «Avisar demora» ni «Visitas de laboratorio».

**DoD:** Las 3 microtareas en `HECHO`. Captura del encabezado sin botones. Ningún camino perdido sin reemplazo declarado.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H2.S3.M1 | Renombrar la solapa del calendario a «Consultas» **en el mismo commit** en que desaparece la otra | En ningún momento del historial quedan dos solapas «Consultas» | `git show --stat` del commit + captura. Si lo hacés en dos pasos, el intermedio tiene dos solapas iguales: eso es el defecto que esto evita | TODO |
| H2.S3.M2 | Quitar los tres `page-actions` del encabezado (`agenda.html:13`, `27`, `49`) | El encabezado no tiene botones de acción | Captura del encabezado. **Antes de quitar el tercero, leé H5.S2**: es el único camino a las visitas | TODO |
| H2.S3.M3 | Declarar, para cada botón quitado, dónde vive ahora su acción | Los tres tienen reemplazo escrito: «Avisar demora», «Visitas de laboratorio» y el tercero | Tabla en tu `REPORTE.md`. Si alguno **no** tiene reemplazo todavía, es `A MEDIAS` con eso dicho, no `HECHO` | TODO |

### H3 — El alta sobre un cupo: modal, sin hora, con toggles y respetando el horario

**Prioridad:** `ALTA`

**CA:** Dado un rato libre del día, cuando se lo toca, entonces se abre un modal accesible con las mismas opciones que antes, que **no** pregunta la hora, usa toggles en vez de radios, y no permite elegir un rato bloqueado ni de descanso; y si el rato queda fuera del horario de atención, el sistema pregunta antes de crearlo.

**DoD:** Las 11 microtareas en `HECHO`. El formulario **no** aparece al pie en ningún camino. Foco atrapado y devuelto, verificado con teclado. Un caso negativo ejercitado: intentar agendar sobre un bloqueo **no** crea nada.

**Kill-test del hito:** tocá un rato libre. Si el formulario aparece abajo, no está hecho. Recorré el modal **sólo con teclado**: si podés tabular fuera de él o `Escape` no lo cierra, no está hecho.

**Estado:** TODO

#### H3.S1 — De formulario al pie a modal accesible (C-10)

**CA:** Dada la tarjeta del día, cuando se abre, entonces es un diálogo modal con rol y nombre, con el foco adentro, atrapado mientras está abierto, que cierra con `Escape` y devuelve el foco al elemento que lo abrió.

**DoD:** Las 4 microtareas en `HECHO`, con el recorrido de teclado grabado o descrito paso por paso, y el componente de diálogo **reusado**, no escrito de nuevo.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H3.S1.M1 | Elegir el diálogo existente que vas a reusar y dejar constancia de por qué ese | Está nombrado el componente y el archivo donde vive | Decisión escrita citando `shared/components/organisms/content-dialog/` o `molecules/dialog/`. **Crear un modal nuevo con `shared/**` reservado para Itzan es, además, tocar lo que no es tuyo** | TODO |
| H3.S1.M2 | Montar `app-tarjeta-del-dia` dentro del diálogo y sacarla del panel del día | No queda ningún camino donde el formulario aparezca al pie | Captura del antes y el después + `git grep` de la plantilla mostrando que ya no está en el panel | TODO |
| H3.S1.M3 | Verificar el foco: entra, queda atrapado, `Escape` cierra, y vuelve al disparador | Los cuatro comportamientos observados con teclado | Recorrido descrito paso por paso con capturas del anillo de foco. Regla 95.4.2 | TODO |
| H3.S1.M4 | Verificar que no se abren dos diálogos encimados al tocar dos ratos seguidos | El segundo reemplaza al primero o el primero no deja tocar | Recorrido pegado | TODO |

#### H3.S2 — El cupo manda la hora, y las opciones son toggles (C-10, C-21)

**CA:** Dado un cupo ya programado, cuando se abre el alta, entonces la franja viene puesta y no se pregunta, y las opciones excluyentes se eligen con toggles.

**DoD:** Las 3 microtareas en `HECHO`. Ninguna hora escribible en el camino del cupo. El control reusado del sistema de diseño, no uno nuevo.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H3.S2.M1 | Quitar los campos de hora cuando el alta viene de un cupo, mostrando la franja como dato | La franja se lee y no se puede editar desde ahí | Captura del modal + el caso probado: crear sobre un cupo y verificar que la cita quedó en la franja del cupo, no en otra | TODO |
| H3.S2.M2 | Cambiar los radios por toggles reusando `segmented-control` | Ningún `radio-group` quedó en ese formulario | `git grep -n "radio" -- src/app/features/agenda` → salida pegada, más captura | TODO |
| H3.S2.M3 | Verificar el toggle con teclado y con lector de pantalla básico | Se puede elegir con flechas y el estado se anuncia | Recorrido pegado. Regla 80.7: **lo automático no alcanza** | TODO |

#### H3.S3 — Los slots dicen la verdad, y la emergencia se pregunta (C-10)

**CA:** Dado el día, cuando hay un bloqueo de agenda o un horario de descanso, entonces se ven como no disponibles y **no** se puede agendar ahí; y si se agrega un horario al final que se sale del horario de atención, el sistema pregunta con un diálogo que lo dice antes de crearlo.

**DoD:** Las 4 microtareas en `HECHO`. Un caso negativo ejercitado por cada regla: sobre bloqueo **no crea**, sobre descanso **no crea**, fuera de horario **pregunta**. Cero `confirm()` del navegador.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H3.S3.M1 | Verificar que los cupos que muestra el día son los del horario publicado, y no otra lista | Coinciden franja por franja con el horario, en un día con horario conocido | Comparación pegada: horario publicado vs cupos del día, con los dos en pantalla | TODO |
| H3.S3.M2 | Pintar bloqueos y descansos como no disponibles y bloquear el alta ahí | Intentar agendar sobre uno **no crea nada** y dice por qué | Caso negativo ejercitado con captura + la lista de citas sin la nueva. **Ocultar el botón no alcanza: la regla se aplica donde se crea** | TODO |
| H3.S3.M3 | Ofrecer agregar un horario al final del día, modelado como excepción `EXTRA` | Se crea una excepción con `blocks: false`, no un cupo inventado | La petición que sale y el bloqueo creado, con su tipo, pegados. Si el manejador simulado no lo soporta, **se lo pedís a Ender** y esta microtarea queda `BLOQUEADO` con el pedido escrito | TODO |
| H3.S3.M4 | Diálogo de confirmación que nombre que se sale del horario de atención | El texto dice qué pasa si sigue, y cancelar no crea nada | Captura del diálogo con su texto + el caso cancelado sin efecto. **Prohibido `confirm()`/`alert()`**: congela la automatización y no cumple 95.4.2 | TODO |

### H4 — Semana y mes se leen como el día, y la tarjeta lleva a atender

**Prioridad:** `ALTA`

**CA:** Dada la vista de semana, cuando se pasa el puntero o se llega con el teclado a una cita, entonces se despliega el mismo globo que en el día; dada la de mes, el hover es una tarjeta con chips que dicen si está atendida o no; y dada cualquiera de las tarjetas, al activarla se llega a iniciar el encuentro de esa persona.

**DoD:** Las 9 microtareas en `HECHO`. Los chips salen de los estados reales del ciclo, no de una lista nueva. El hover funciona con **teclado**, no sólo con puntero. Capturas de las tres vistas.

**Kill-test del hito:** llegá a una cita de la semana **sólo con el teclado**. Si el globo no aparece, no está hecho: un hover que sólo responde al puntero deja afuera a quien navega con teclado.

**Estado:** TODO

#### H4.S1 — La semana, desplegable y con globo (C-08)

**CA:** Dada una cita de la semana, cuando se la despliega, entonces muestra lo mismo que el día muestra en su detalle, y se puede abrir y cerrar con teclado.

**DoD:** Las 3 microtareas en `HECHO`, reusando el globo existente y sin duplicar la plantilla del detalle.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H4.S1.M1 | Verificar qué componente de detalle usa hoy el día, para reusarlo y no copiarlo | Está nombrado el archivo y la plantilla | Localizador pegado (`day-view.html` alrededor de 182-199). **Copiar la plantilla es el defecto**: el día que cambie una, la otra queda vieja | TODO |
| H4.S1.M2 | Hacer que cada cita de la semana se despliegue con ese mismo detalle | El contenido es el mismo, no una versión recortada a mano | Capturas del día y de la semana lado a lado | TODO |
| H4.S1.M3 | Verificar apertura y cierre con teclado y con movimiento reducido activado | Funciona con `Tab`/`Enter`/`Escape` y no anima si el sistema pide no animar | Recorrido pegado + captura con `prefers-reduced-motion`. Regla 95.5.1 | TODO |

#### H4.S2 — El mes, con tarjeta y chips de estado (C-08)

**CA:** Dado un día del mes con citas, cuando se lo señala, entonces aparece una tarjeta con las citas y cada una lleva un chip que dice si está atendida o no, con color **y** palabra.

**DoD:** Las 3 microtareas en `HECHO`. Los estados salen de `booking-status.ts`. Ninguna información transmitida sólo por color (regla 95.4.6).

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H4.S2.M1 | Sacar los estados y sus tonos de donde ya se resuelven, sin inventar una lista | La lista es la del ciclo real: solicitada, confirmada, en curso, completada, cancelada, no-show | Fragmento de `booking-status.ts` pegado + la tabla estado → chip | TODO |
| H4.S2.M2 | Montar el hover del mes con el diseño de tarjeta y los chips | La tarjeta se ve en mes y trae los chips | Captura del mes con la tarjeta abierta | TODO |
| H4.S2.M3 | Verificar que el chip dice el estado en palabras, no sólo con color | Se entiende en escala de grises | Captura en escala de grises o con simulación de daltonismo. Regla 95.4.6 | TODO |

#### H4.S3 — La tarjeta lleva a iniciar el encuentro (C-04)

**CA:** Dada una tarjeta de cita, cuando se la activa, entonces se llega a la pantalla de atención de esa persona con el turno y el motivo que ya tenía, y si la sesión no puede abrir expedientes, el sistema lo dice en vez de navegar a la nada.

**DoD:** Las 3 microtareas en `HECHO`. Recorrido completo hecho en el navegador con `medica@alovida.mock`. El caso sin permiso ejercitado, o declarado `NOT_RUN` con el motivo.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H4.S3.M1 | Hacer cliqueable la tarjeta entera, sin romper los botones que ya tiene adentro | Tocar la tarjeta navega; tocar un botón de adentro hace lo del botón | Los dos casos ejercitados con captura. **Un botón dentro de un elemento cliqueable dispara los dos si no se detiene la propagación**: probalo | TODO |
| H4.S3.M2 | Llevar el turno y el motivo al destino, con los parámetros que la ruta declara | La pantalla de atención abre con el motivo precargado | URL de destino pegada + captura. Ojo: va el `appointmentId` de la cita clínica, **no** el `id` de la reserva; está dicho en `clinical-record.routes.ts` | TODO |
| H4.S3.M3 | Manejar el caso de `rutaAtencion === null` | No se navega a la nada: se dice qué falta | Caso ejercitado con una cuenta sin permiso de expediente, o `NOT_RUN` declarado con el motivo | TODO |

### H5 — Una consulta a la vez, el visitador y los otros servicios

**Prioridad:** `ALTA`

**CA:** Dada una consulta en curso, cuando se intenta iniciar otra, entonces no arranca y el sistema dice por qué y ofrece continuar la que está abierta; dada una visita de laboratorio, se ve en la misma pestaña como tarjeta de visitador de 15 minutos por omisión; y dado un servicio de «Mis Servicios» con horario programado, su rato aparece bloqueado en la agenda clínica con el motivo «Otros servicios».

**DoD:** Las 9 microtareas en `HECHO` o `BLOQUEADO` con el pedido a Ender escrito. El caso negativo de la regla ejercitado de verdad. Ningún dato clínico expuesto al visitador.

**Kill-test del hito:** iniciá una consulta y, sin cerrarla, intentá iniciar otra. Si arranca, C-11 no está hecho. Y programá un servicio: si la agenda clínica sigue ofreciendo ese rato, C-12 no está hecho.

**Estado:** TODO

#### H5.S1 — No se pueden iniciar dos consultas a la vez (C-11)

**CA:** Dada una cita en curso, cuando se pulsa iniciar en otra, entonces no se inicia, se explica que ya hay una abierta y se ofrece ir a esa.

**DoD:** Las 3 microtareas en `HECHO`. El freno ejercitado con dos citas reales de la maqueta. La explicación visible, no un botón deshabilitado y mudo.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H5.S1.M1 | Definir con qué dato se sabe que hay una consulta en curso, citando dónde vive | Es un estado del ciclo, no una bandera nueva en el cliente | Localizador pegado (`sePuedeCompletar`, `booking-status.ts`). **No inventes una bandera local: el estado ya existe** | TODO |
| H5.S1.M2 | Impedir el inicio de una segunda y decir por qué, con salida a la que está abierta | Con una en curso, iniciar otra no la inicia y aparece el motivo | Caso ejercitado con captura y la lista mostrando que la segunda **no** cambió de estado | TODO |
| H5.S1.M3 | Verificar qué hace el servidor simulado si igual llega la petición | Está registrada la respuesta real (409 u otra) | Respuesta pegada. El freno del cliente **no reemplaza** la validación del servidor: si el simulado no la tiene, se registra como brecha del contrato | TODO |

#### H5.S2 — La visita de laboratorio, en la misma pestaña y como visitador (C-13)

**CA:** Dada una visita de laboratorio aceptada, cuando se mira la pestaña de consultas, entonces aparece como una tarjeta identificada «Visitador» con su tono propio y una duración de 15 minutos por omisión, y no se mezcla con la información clínica del paciente.

**DoD:** Las 3 microtareas en `HECHO` o `BLOQUEADO`. La palabra «Visitador» presente, no sólo el color. Ningún dato clínico en la tarjeta. La bandeja `/lab-visits` sigue alcanzable.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H5.S2.M1 | Leer el contrato de visitas y su límite antes de pintar nada | Está citado el límite: el visitador no accede a información clínica y la visita no se mezcla con la agenda clínica | Fragmento de `pharma-lab.types.ts:9` pegado. **Traer la tarjeta es presentación; el límite de acceso no se toca** (regla 90.1) | TODO |
| H5.S2.M2 | Pintar la tarjeta de visitador con tono propio y su palabra | Se distingue en escala de grises y dice «Visitador» | Captura normal y en escala de grises. Tono del sistema de diseño, **no** un color literal (regla 95.1.5) | TODO |
| H5.S2.M3 | Dejar los 15 minutos por omisión, tomados de donde el contrato los declare | La duración sale del dato, no de un número escrito en la plantilla | Localizador del campo (`durationMinutes`) + captura. La **configuración** de ese valor es de Ender (H3 de su lote): si no está, `BLOQUEADO` con el pedido escrito | TODO |

#### H5.S3 — «Mis Servicios» con horario, y su bloqueo en la agenda (C-12)

**CA:** Dado un servicio propio, cuando se le programa un horario, entonces ese rato queda bloqueado en la agenda de consulta médica con el motivo «Otros servicios», y las pantallas que se usan para programarlo son las mismas del horario de atención, no unas nuevas.

**DoD:** Las 3 microtareas en `HECHO` o `BLOQUEADO`. El bloqueo **visto** en la agenda clínica. `OTHER` + texto, sin ampliar el enum.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H5.S3.M1 | Identificar qué vistas del horario se reciclan y qué se pasa por parámetro | Están nombradas las plantillas reusadas, con su archivo | Lista pegada (`my-agenda` en modo horario, `schedule-grid`, `agenda-create`). **Duplicar la pantalla es el defecto que «reciclar» evita** | TODO |
| H5.S3.M2 | Programar el horario de un servicio y ver el bloqueo en la agenda clínica | El rato aparece bloqueado y con el motivo «Otros servicios» | Las dos capturas: el servicio programado y la agenda con el rato bloqueado | TODO |
| H5.S3.M3 | Verificar que el motivo viaja como `OTHER` + texto y no como un tipo inventado | La petición lleva `exceptionType: 'OTHER'` y `reason` con el texto | Petición pegada. Si hace falta un tipo propio, **eso es decisión de negocio** (`Q-D6`): se registra, no se implementa | TODO |

### H6 — Acciones con texto, regresión, prueba visual y cierre

**Prioridad:** `ALTA`

**CA:** Dada cualquier fila de la agenda, cuando se abren sus acciones, entonces es un desplegable donde cada opción tiene icono **y** texto; y dado el turno cerrado, la regresión está corrida, las capturas están mirando los tres viewports y los dos temas, y el reporte dice la verdad.

**DoD:** Las 7 microtareas en `HECHO`. Cero `iconOnly` sin texto en tus archivos, **medido**. Barrido y click-sweep corridos con `--workers=1`. `REPORTE.md` escrito.

**Kill-test del hito:** contá los `iconOnly` en tus archivos. Si el número no bajó y no hay una explicación por cada uno que quedó, C-06 no está aplicado en tu parte.

**Estado:** TODO

#### H6.S1 — Aplicar el desplegable de acciones en la agenda (C-06)

**CA:** Dadas las celdas de acción de la agenda, cuando se las usa, entonces ofrecen un desplegable con icono y texto por opción, y la fila no crece a tres renglones.

**DoD:** Las 3 microtareas en `HECHO`, con la medición antes y después y el componente de Itzan reusado, no uno propio.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H6.S1.M1 | Medir cuántos `iconOnly` hay en tus archivos antes de tocar | Hay un número, no una impresión | `git grep -c iconOnly -- src/app/features/agenda src/app/features/my-services` → pegado | TODO |
| H6.S1.M2 | Reemplazar las celdas de acción por el desplegable del sistema de diseño | Cada opción tiene icono y texto; se llega con teclado y cierra con `Escape` | Captura del desplegable abierto + recorrido de teclado. Reusá `app-menu` (ya se usa en `agenda.html:524`) o el componente que publique Itzan; **no escribas uno** | TODO |
| H6.S1.M3 | Volver a medir y justificar cada `iconOnly` que quede | El número bajó y los que quedan tienen motivo escrito | Medición nueva + tabla de excepciones. **Un `iconOnly` sin justificación es C-06 sin cumplir** | TODO |

#### H6.S2 — Regresión

**CA:** Dado el conjunto de cambios, cuando se corre la regresión, entonces los gates estáticos están en 0, los specs de agenda pasan, y el barrido de la maqueta no reporta petición sin manejador ni error de consola nuevo en las pantallas que tocaste.

**DoD:** Las 2 microtareas en `HECHO`, con las salidas literales pegadas. Serial, un worker.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H6.S2.M1 | Gates estáticos y unitarios dirigidos | Exit 0 en typecheck y lint; los specs de agenda en verde | `yarn typecheck; yarn lint; npx ng test --include=src/app/features/agenda/**/*.spec.ts --watch=false` → salidas pegadas. Si un spec viejo choca con el cambio pedido, **se actualiza el spec al requisito nuevo, no se lo debilita** (regla 80.5.4) | TODO |
| H6.S2.M2 | Barrido y click-sweep de la maqueta, serial | Hay matriz y reporte de clics, y las filas de `/schedule` están limpias | `E2E_BASE_URL=http://localhost:4200 npx playwright test playwright/mockup-barrido.spec.ts --workers=1` y el `mockup-click-sweep.spec.ts`, con las dos salidas y las rutas de los artefactos pegadas | TODO |

#### H6.S3 — Prueba visual y cierre

**CA:** Dado el turno cerrado, cuando alguien que no lo vivió abre tu reporte, entonces sabe qué quedó demostrado, qué quedó a medias con las cuatro respuestas, y qué decisiones quedaron abiertas.

**DoD:** Las 2 microtareas en `HECHO`. Capturas en móvil, tablet y escritorio, en claro y oscuro, **miradas**. `REPORTE.md` con sus tres secciones.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H6.S3.M1 | Capturar y **mirar**: 3 viewports × 2 temas × (calendario día/semana/mes, modal abierto, desplegable abierto) | Están todas las capturas y cada una tiene una línea diciendo qué se vio | Índice de capturas en `evidencia/` con su observación. **Tomarla y no mirarla no cuenta** (regla 95.7.2) | TODO |
| H6.S3.M2 | Escribir `REPORTE.md` con avance calculado y las tres secciones | La primera línea es `AVANCE: <HECHO> / 55` y están Completado, A medias y Pendiente | Archivo en disco. Ningún porcentaje a ojo; `A MEDIAS` con qué anda, qué no anda, qué falta y dónde quedó | TODO |

## 5. Ambigüedades registradas — **no las resuelvas, anotalas**

| ID | Ambigüedad | Quién puede resolverla | Qué bloquea | Supuesto con el que seguís |
|---|---|---|---|---|
| Q-D1 | Sobre qué rama aplica el pedido | Pablo / coordinación | Nada técnico si trabajás sobre `origin/mockup` y lo declarás | Se trabaja sobre `origin/mockup` |
| Q-D6 | «OTROS SERVICIOS» no está en la lista cerrada de 7 motivos del contrato | Negocio + Ender | Sólo la etiqueta del bloqueo, no el bloqueo | `OTHER` + `reason: 'Otros servicios'` |
| Q-P1 | C-07 no dice a dónde caen `vista=citas` y `vista=solicitudes`, que hoy llevan a la tabla que se quita | Doctor | Nada: hay que elegir un destino y decirlo | Caen al calendario, que es lo que `/schedule` a secas abre |
| Q-P2 | C-11 dice «los botones de arriba a la derecha» sin nombrarlos. Son tres y uno es el único camino a las visitas de laboratorio | Doctor | El tercero. Los otros dos se quitan sin discusión | Se quitan los tres, y «Visitas de laboratorio» queda cubierto por C-13 en el mismo lote |
| Q-P3 | C-10 dice «los slots deben coincidir con el horario». No dice qué hacer con los cupos ya generados que **no** coinciden con el horario actual | Doctor / negocio | Sólo los cupos históricos; los nuevos coinciden por construcción | No se borra ningún cupo existente: se muestran y se anota la discrepancia |
| Q-P4 | C-13 dice «configurable por el doctor en la pantalla de horarios», y ese campo no existe en ningún contrato | Ender + negocio | La configuración, no el valor por omisión | 15 minutos por omisión desde el dato de la visita; la configuración queda pendiente con su pedido escrito |
| Q-P5 | C-12 dice «debe reciclar sus vistas» sin decir si el horario del servicio es una agenda propia o una excepción sobre la agenda médica | Doctor / negocio | El modelo del horario del servicio | Se modela como excepción de disponibilidad sobre el recurso del profesional — es lo que produce el bloqueo que el pedido exige |

<ejemplos>
Dos formas de cerrar la misma microtarea. La diferencia no es de redacción: es que una se puede
auditar y la otra no.

<ejemplo tipo="aceptable" microtarea="H2.S1.M2">
La solapa de la tabla ya no está en `agenda.html` y `yarn typecheck` cerró en 0 (`evidencia/h2/typecheck.txt`, exit 0). `/schedule?vista=table` abre el calendario y la consola quedó limpia (`evidencia/h2/vista-table.png`). `git grep -n vista=table -- src cypress playwright` no devolvió nada (`evidencia/h2/grep.txt`).

Estado: HECHO · Veredicto: PASS · Peldaño: VERIFIED
</ejemplo>

<ejemplo tipo="prohibido" microtarea="H2.S1.M2">
Saqué la solapa de la tabla, compila bien. Los enlaces viejos deberían seguir funcionando.

Estado: HECHO
</ejemplo>

Por qué el segundo no vale: «debería» no es un veredicto, no hay comando pegado, y «compila» no dice nada sobre los enlaces. Esto es `WRITTEN`, no `HECHO`.
</ejemplos>

## 6. Definition of Done del turno

- [ ] Las **55 microtareas** están en `HECHO`, en `BLOQUEADO` con su causa y el pedido escrito, o en `A MEDIAS` con qué anda, qué no anda, qué falta exactamente y dónde quedó.
- [ ] **Ninguna microtarea quedó en `EN CURSO`** al cerrar.
- [ ] Cada hito y cada subtarea tienen su Estado actualizado, no sólo las microtareas.
- [ ] Todo veredicto es `PASS`/`FAIL`/`NOT_RUN`/`BLOCKED`. **No hay un solo `PASS` sin comando y salida pegados.**
- [ ] El corte está declarado con su SHA, y los localizadores del reporte son **tuyos**, verificados contra ese corte.
- [ ] `/schedule?vista=table` y `/schedule?vista=cupos` **no muestran ninguna tabla**, y los enlaces viejos llegan a un destino declarado y probado.
- [ ] En ningún momento existieron dos solapas llamadas «Consultas».
- [ ] Por cada botón quitado del encabezado hay un reemplazo declarado, o está dicho que no lo tiene.
- [ ] El alta sobre un cupo **no** pregunta la hora, y el formulario **no** aparece al pie en ningún camino.
- [ ] El modal cumple: rol y nombre, foco inicial adentro, foco atrapado, `Escape`, y foco devuelto al disparador.
- [ ] Hay **un caso negativo ejercitado** por cada regla: sobre bloqueo no crea, sobre descanso no crea, segunda consulta no inicia. Con captura y con el estado sin cambiar.
- [ ] El horario extra se modela como excepción `EXTRA`, no como un cupo inventado.
- [ ] Ningún `confirm()` ni `alert()` del navegador en ningún camino nuevo.
- [ ] Ningún color literal: todo por token del sistema de diseño.
- [ ] Ninguna información transmitida sólo por color: el estado y el visitador se leen en palabras.
- [ ] Ningún dato clínico visible en la tarjeta de visitador, y `/lab-visits` sigue alcanzable.
- [ ] Cero archivos tocados fuera de `features/agenda/**` y `features/my-services/**`. Si hiciste falta tocar otro, está **acordado y anotado en los dos dailies**.
- [ ] La medición de `iconOnly` está antes y después, y cada uno que quedó tiene su motivo.
- [ ] Ningún spec borrado, saltado ni debilitado. Ningún timeout subido. Ningún reintento agregado.
- [ ] Capturas en 3 viewports × 2 temas, **miradas**, cada una con su observación escrita.
- [ ] Ningún proceso quedó corriendo al cerrar el turno, o está declarado cuál y por qué.
- [ ] Avance reportado como `microtareas HECHO / 55`, **no** como porcentaje a ojo.
- [ ] Ningún dato real de paciente en ninguna salida pegada. Las cuentas `@alovida.mock` son sintéticas declaradas y sí se pueden pegar.

## 7. Handoff — avisá por el daily al cerrar cada hito, no al final

| Al cerrar | A quién | Qué exactamente |
|---|---|---|
| **H1** | Todo el equipo | El SHA del corte que fijaste, y si los gates ya estaban rojos antes de tocar |
| **H2** | Itzan | Que la sección quedó en dos solapas: su inventario de `iconOnly` cambia |
| **H2** | Marcelo | Qué URLs cambiaron de significado, para su recorrido de aceptación |
| **H3** | Itzan | Qué diálogo y qué control de toggle reusaste, y si te faltó algo de `shared/**` |
| **H3** | Ender | Si el manejador simulado no soporta la excepción `EXTRA` que necesitás |
| **H4** | Marcelo | El camino tarjeta → iniciar encuentro, que es la puerta de su recorrido |
| **H5** | Ender | El campo de duración configurable del visitador, y el motivo del bloqueo de servicios |
| **H5** | Justin | Que iniciar el encuentro ahora tiene un freno: su receta se prueba dentro de un encuentro |
| **H6** | Itzan | Cuántos `iconOnly` quedaron en tu área y por qué |
| **H6** | Marcelo | Las rutas de tus artefactos de barrido y click-sweep, para el dictamen del lote |

Si un bloqueo se confirma, **no iteres sobre él**: registrá la causa, escribí el pedido a quien
corresponda, y pasá a la siguiente microtarea independiente. Y antes de declarar `BLOQUEADO`, leé la
**regla 65**: si el contrato de lo que te falta se puede nombrar, se puede simular en sus tres
niveles —correcto, límite e inválido— y la microtarea **se cierra contra el doble**, declarando que
se cerró así. Sólo una decisión de negocio sin tomar justifica dejarla abierta.
