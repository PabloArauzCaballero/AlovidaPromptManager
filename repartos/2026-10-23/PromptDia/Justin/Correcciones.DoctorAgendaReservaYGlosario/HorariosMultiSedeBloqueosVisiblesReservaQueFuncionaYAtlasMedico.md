# Horarios multi-sede tipo MS Project, bloqueos visibles en todos lados, una reserva que funciona y avisa, y el glosario convertido en atlas

> **Rol:** dueño de la agenda del médico (modelo, API, front, móvil), de la reserva del paciente del lado de la agenda, y del glosario y sus relaciones · **Carril:** 2 · Doctor (con Pablo) · **Fecha:** 2026-10-23 · **Turno:** día
> **Fuente del pedido:** [`CORRECCIONES-FULLSTACK-2026-10-23.md`](../../../../../docs/requisitos/CORRECCIONES-FULLSTACK-2026-10-23.md) — **MD-04, MD-07, MD-08, MD-09, MD-10**, y el lado agenda de **PA-07** (C-04)
> **Verificación contra el código:** [`VERIFICACION-CONTRA-CODIGO-2026-10-23.md`](../../../../../docs/verificacion/VERIFICACION-CONTRA-CODIGO-2026-10-23.md) — §MD-04/MD-09, §MD-10, §MD-07/MD-08, §PA-07
> **Plan completo:** [`planes/06-correcciones-fullstack-2026-10-23/README.md`](../../../../../planes/06-correcciones-fullstack-2026-10-23/README.md) — **producís la parte de reserva de C-04; consumís C-06 (Pablo) para el evento `booking.completed`**
> **8 hitos · 15 subtareas · 72 microtareas**, todas con criterio de aceptación y Definition of Done.
>
> **Lo primero que tenés que saber:** el cliente dice que la reserva «no funciona absolutamente nada», y
> la verificación encontró **por qué puede decirlo**: la reserva de mostrador del médico da **403**
> (`holds/confirm/request` no admiten PRACTITIONER), el check-in del médico da **403**, el paciente **no
> puede mover** su cita en web, la confirmación de mostrador **no manda ningún aviso**, y casi todos los
> E2E de reserva corren contra el simulador, que inventa reglas. Tu primer hito de valor es ése, medido
> contra la API real. Lo segundo: todas las vistas de agenda miran **el primer recurso**; un bloqueo en el
> segundo consultorio es invisible. Lo tercero: el atlas **no se escribe, se importa con procedencia**.

## 0. Ficha de asignación

| Campo | Valor |
|---|---|
| `REPOS` | `mdavila-2001/mantra-core-health-api` (`scheduling/**`, `terminology/**`, `tools/terminology-import/**`, `community/**booking-chat**`) · `mdavila-2001/mantra-core-health` · `mantra-core-technologies/mantra-core-health-model` (`.puml` M41) · `PabloArauzCaballero/AlovidaAIService` (`src/modules/knowledge/**`, `scripts/build-glossary-official.mjs`) · `mdavila-2001/mantra_core_health_mobile` |
| `TARGET_REF` | `origin/dev` front `227eb255` · API `6ea11561` · modelo `eceb98f` · `origin/main` AIService `1163e62` · móvil `ec88e81`. **Reconsultá y fijá el tuyo** |
| `RAMAS` | `justin/doctor-agenda-reserva-glosario-2026-10-23` por repo. PR por hito |
| `ARCHIVOS RESERVADOS PARA VOS` | API: `src/modules/scheduling/**` · `src/modules/terminology/**` · `tools/terminology-import/**` · `src/modules/community/**/community-booking-chat*`. Front: `features/agenda/**` · `features/dashboard/today-agenda/**` · `features/directory/practitioner-availability/**` · `features/directory/practitioner-service-schedule/**` · `features/glossary/**` · `features/symptom-check/*.data.ts` y `symptom-glossary.generated.ts` (relaciones) · `scripts/glossary-*.mjs` · `public/glossary-seed/**` · `data/glossary/**` · `core/data-access/{scheduling,terminology}/**` · `core/mock/handlers/{scheduling,glossary}.handlers.ts` · tus `test()` en la suite. Modelo: `diagram_41_scheduling.puml`. AIService: `src/modules/knowledge/**`, `scripts/build-glossary-official.mjs`. Móvil: `features/scheduling/**`, `features/clinician/presentation/my_agenda_screen.dart`, `features/appointments/**` (sólo la reprogramación compartida con Richard por contrato: vos no la tocás, él sí) |
| `ARCHIVOS DE OTROS — NO LOS TOQUES` | `billing/**`, `consent/**`, `surveys/**`, `@Roles` existentes (pero **vos pedís** los tres roles de H2 el día 1 y Pablo los aplica), `complete-appointment.use-case.ts` lo tocás **vos** sólo para llamar el publisher que te entrega Pablo (acordalo en el daily) (**Pablo**) · `insurance/**`, `geo/**`, `features/directory/**` salvo tus dos carpetas, `features/account/appointments/**` (**Richard**) · `clinical/**`, `pharmacy/**` (**Ender**) · `diagnostics/**`, `diagnostic_units/**` (**Itzan**: él consume tu `serviceRequestId`) · cabecera, ajustes, inicio (**Leo**) |
| `⚠️ RIESGO ALTO DE TU CARRIL` | **Las carreras de la agenda.** Todo lo que toques en `scheduling` tiene int-specs de concurrencia (`fx9`, `fx10`, `fx12`): se corren antes y después, y no se debilitan. **Segundo:** el glosario pesa 59 MB en `public/`: cualquier crecimiento se mide (`du -sh public/glossary-seed`) y se justifica; las páginas largas se sirven **bajo demanda por término**, nunca en la semilla. **Tercero:** **prohibido generar texto médico** con un modelo y presentarlo como contenido del atlas (regla 97.5.4); todo párrafo trae fuente, licencia y URL |
| `CONTRA QUÉ SE PRUEBA` | API real + `start:real-api`; los `agenda-*.mjs` y `horario-*.mjs` que hoy corren contra la maqueta **se repiten contra la API real** |
| `CUENTAS DE PRUEBA` | `seed:e2e` (doctor.one con dos sedes: `fx2-medico-multisede-publica-agenda.int-spec.ts` muestra cómo) + paciente sintético |
| `DÓNDE SE PRUEBA` | `/schedule`, `/schedule?vista=agenda`, `/schedule/new`, `/schedule/blocks`, `/schedule/appointment/new`, `/schedule/book/:slotId`, `/my-account/appointments/book/:slotId`, `/directory/:profileId` (disponibilidad), `/glossary`, `/glossary/:slug` |
| `LÍMITE DE RECURSOS` | Regla 70 |

## 1. Antes de escribir una línea — instalación OBLIGATORIA del estándar

> **Esta sección no es opcional y no es el final del día: es lo primero.** Si no podés completar este
> paso, estás `BLOQUEADO`: avisalo y no sigas.

### 1.1 Instalar el estándar en tu checkout

```bash
git clone https://github.com/PabloArauzCaballero/AlovidaPromptManager.git ../AlovidaPromptManager
cp -r ../AlovidaPromptManager/.claude   ./
cp    ../AlovidaPromptManager/AGENTS.md ./
cp -r ../AlovidaPromptManager/.agents   ./
ls .claude/skills | wc -l
ls .claude/rules/[0-9]*.md | wc -l
python .claude/hooks/plan_gate.py --self-test
```

⚠️ Fusioná con el `.claude/` que ya tienen el front y la API. Sus `CLAUDE.md`/`AGENTS.md` mandan.

### 1.2 Qué te instala eso

| Candado | Qué impide |
|---|---|
| `plan_gate.py` | Escribir código sin `PLAN.md` |
| `report_gate.py` | Cerrar sin `REPORTE.md` |
| `blocker_gate.py` | Cerrar con `BLOQUEADO` sin simular los tres niveles |

### 1.3 Skills que tenés que CARGAR para este lote

**Del proceso:** `skills-router` · `factual-discovery` · `milestone-planning` · `anti-hallucination-guard` ·
`evidence-and-verification` · `scope-discipline` · `rationalization-guard` · `context-thrift` ·
`progress-reporting` · `finish-your-turn` · `work-report-md`.

**De tu lote:**

| Skill | Para qué |
|---|---|
| `appointment-scheduling` | **la más importante**: recursos por sede, servicios con duración, bloqueos, doble reserva, reprogramación |
| `concurrency-and-locking` | los `fx9`/`fx10`/`fx12` no se rompen |
| `notifications-delivery` + `async-messaging-events` | el aviso de la confirmación de mostrador y el hilo médico↔paciente |
| `root-cause-debugging` + `e2e-failure-triage` | «no funciona nada»: reproducir contra la API real antes de tocar |
| `frontend-responsive-layout` + `visual-hierarchy-composition` | la línea de tiempo multi-sede y la semana con eje horario |
| `frontend-motion` | nada se mueve solo; movimiento reducido respetado en la línea de tiempo |
| `frontend-accessibility` | la línea de tiempo tiene equivalente por teclado y lector (tabla) |
| `seed-data-catalogs` + `terminology-value-sets` + `data-quality-validation` | el atlas con procedencia, licencias, conteos y nulos |
| `healthcare-interoperability-fhir` | relaciones como `ConceptMap`/`concept_relationships` con tipo y evidencia |
| `frontend-performance` | la semilla no crece; páginas largas bajo demanda |
| `flutter-development` · `alovida-app-movil-ux` | agenda móvil |
| `e2e-playwright` + `visual-proof` + `critical-double-review` | tus `test()` y las dos pasadas |

### 1.4 DoD de esta sección

- [ ] Salidas pegadas en tu daily.
- [ ] Skills leídas, empezando por `appointment-scheduling`.
- [ ] `PLAN.md` en cada repo (`docs/trabajo/2026-10-23-doctor-agenda-reserva-glosario/PLAN.md`) **antes** del primer `Edit`/`Write` de código.

> ### ✅ Hechos ya verificados contra el corte
>
> - `holds/:id`, `holds/:token/confirm`, `holds/:token/request` (`scheduling.controller.ts:667,689,718`) tienen roles `SCHEDULING_ADMIN, SCHEDULING_AGENT, PATIENT`: **sin PRACTITIONER** → 403 al médico en `/schedule/book/:slotId` (AG-03). `check-in` (`scheduling-bookings.controller.ts:395`) sólo ADMIN y AGENT (AG-02).
> - `confirm-booking.use-case.ts` (mostrador) y walk-in **no mandan ningún aviso**; el chat interno de los demás eventos sale por la cuenta «SupportAdmin» (`support-admin-notice.adapter.ts`), y el hilo médico↔paciente sólo se escribe al aceptar (`community-booking-chat.adapter.ts`).
> - El paciente no puede reprogramar en web (lo hace **Richard** en su R-H8 contra tu `reschedule` existente).
> - `MyAgenda` toma `pagina.items.find(r => r.resourceRefId === perfil)` (`my-agenda.ts:842`) y `Blocks` `recursos[0]` (`blocks.ts:255`); «Mis horarios» dibuja sólo la primera plantilla (`:854-880`). Semana sin eje horario; una excepción que toque el día pinta la celda entera «bloqueado» (`week-view.ts:397,427-438`). El paciente nunca ve bloqueos (`listSlots(onlyAvailable: true)`); `GET resources/:id/exceptions` admite PATIENT sólo con reserva previa (`:365-368`).
> - `practitioner_service_offerings` no tiene sede ni recurso; `practitioner_schedules` (con `care_space_id`) no se usa; `calendar_absences` sin caso de uso.
> - Glosario: 19 313 términos, mediana de definición **0**, 70 % vacías, 1 ≥ 2 000 palabras, 29 % con imagen; las cuatro etapas de `tools/terminology-import/encyclopedia/` nunca produjeron `articles.ndjson`; `glossary-articulos-alovida.mjs --check` falla por un SVG faltante; la rejilla de categorías tapa los resultados (`glossary.html:30-92`, nada `sticky`); 12 íconos genéricos.
> - Relaciones: 54 853 aristas en la semilla; anatomía–síntoma 15, anatomía–medicina 2, anatomía–anatomía 0; `concept_relationships` sin columna de procedencia; AIService descarta anatomía y medicinas a propósito.

## 2. Resultado observable

| Hito | Prioridad | Qué queda demostrado |
|---|---|---|
| **J-H1** | `BLOQUEANTE` | Corte, baseline, kill-tests `@justin` en rojo; los `agenda-*.mjs`/`horario-*.mjs` repetidos contra la API real con sus rojos; roles pedidos a Pablo. |
| **J-H2** | `BLOQUEANTE` | **La reserva funciona y avisa (MD-10):** el médico reserva desde el mostrador y hace check-in sin 403; toda confirmación (portal, mostrador, walk-in) manda campana + mensaje **en el hilo médico↔paciente**; cancelar y mover también; una prueba con dos sesiones lo demuestra. |
| **J-H3** | `BLOQUEANTE` | **Bloqueos visibles (MD-09):** día, semana, mes y rejilla muestran los bloqueos de **todas** las sedes con sus horas y motivo; el selector del paciente marca «bloqueado» en vez de hacer desaparecer el tiempo. |
| **J-H4** | `ALTA` | **Horarios multi-sede y multi-servicio (MD-04):** servicios por sede con duración propia; vista «Línea de tiempo» (semana con eje horario, una fila por sede y servicio, barras arrastrables con confirmación) inspirada en MS Project; semana y mes rediseñados. |
| **J-H5** | `ALTA` | **C-04 lado reserva:** la reserva acepta `serviceRequestId` y `durationMinutes`; el centro puede cambiar la duración; `expected_duration_minutes` se usa al generar cupos. |
| **J-H6** | `MEDIA` | **Atlas (MD-07):** las cuatro etapas corridas con procedencia; artículos largos e imágenes servidos bajo demanda por término; filtros arriba y fijos, rejilla de categorías que no tapa los resultados; íconos por categoría y etiqueta; cobertura medida y publicada. |
| **J-H7** | `MEDIA` | **Relaciones (MD-08):** `concept_relationships` con procedencia; pares enfermedad–síntoma–medicina–anatomía poblados desde fuentes abiertas; el detalle del término muestra el mapa de relaciones por tipo. |
| **J-H8** | `ALTA` | Kill-tests `@justin` en verde, regresión (incl. `fx*`), doble revisión, `REPORTE.md`, PRs mergeables. |

> ⚠️ **Orden: J-H1 → J-H2 → J-H3 → J-H5 → J-H4 → J-H6 → J-H7 → J-H8.** J-H2 y J-H3 son lo que el cliente ve roto.

**Kill-test del lote completo:** entrá como médico con dos sedes y bloqueá el martes en la segunda: si en
`/schedule` (semana y mes) no se ve, J-H3 no está hecho. Entrá como paciente y abrí la disponibilidad de ese
médico: si el martes simplemente no aparece (en vez de «bloqueado»), J-H3 no está hecho. Como médico,
reservá desde `/schedule/book/:slotId`: si da 403, J-H2 no está hecho. Confirmá una reserva de mostrador:
si al paciente no le llega un mensaje en el hilo con el médico, J-H2 no está hecho. Abrí `/glossary` y
buscá: si la rejilla de categorías desaparece o tapa los resultados, J-H6 no está hecho. Abrí
«Hipertensión arterial»: si no hay artículo con fuente e imagen con licencia, J-H6 no está hecho.

## 3. Alcance

**IN:** corte y baseline · roles pedidos y aplicados (por Pablo) · aviso en confirmación y walk-in ·
hilo médico↔paciente en todos los eventos de reserva · check-in del médico · bloqueos de todas las sedes en
todas las vistas y en el selector del paciente · `calendar_absences` cableado o retirado del modelo (decisión
registrada) · servicios por sede (`.puml` M41) · línea de tiempo multi-sede · semana con eje horario · mes
rediseñado · C-04 lado reserva · default de duración configurable · atlas: etapas corridas, servido por
término, UI de filtros e íconos · relaciones con procedencia · móvil: agenda con bloqueos de todas las sedes
· tus `test()` · simulador · `PLAN.md`, `REPORTE.md`, `evidencia/`.

**OUT:** **cualquier archivo fuera de los reservados** · la reprogramación del paciente en web y
`features/account/appointments` (**Richard**, contra tu `reschedule`) · el evento `booking.completed` →
encuesta (**Pablo** te da el publisher; vos lo llamás) · la oferta de cupo liberado y el aviso de demora
(T-12, otra oleada) · horario flexible sin turnos (P36, otra oleada) · texto generado por modelo en el
atlas · Wikipedia hasta la decisión D-4 · debilitar un spec · declarar `HECHO` sin DoD corrido.

**Ambigüedades registradas** (además de Q-09, Q-15, Q-16 y D-4 del plan):

| ID | Ambigüedad | Supuesto tomado | A quién confirmar |
|---|---|---|---|
| Q-J1 | MD-04.a «Inspirarse en MS Project»: ¿Gantt editable (arrastrar para mover y estirar) o sólo lectura? | **Lectura + arrastre para mover y estirar con confirmación** (`DialogService.confirm()`), sin crear desde la línea; crear sigue en `/schedule/new`. Equivalente por teclado y tabla para lector de pantalla | Doctor |
| Q-J2 | MD-10.a «mensaje dentro de la app»: hoy hay campana (in-app) y chat por SupportAdmin. ¿Cuál es «el mensaje»? | **El hilo médico↔paciente** del chat (`community`), además de la campana. SupportAdmin deja de usarse para avisos de agenda | Pablo + doctor |
| Q-J3 | MD-09: ¿el paciente ve el **motivo** del bloqueo? | No: sólo «No disponible» (el motivo es del médico). La API ya devuelve sólo la etiqueta del catálogo al paciente | Pablo |
| Q-J4 | Servicio por sede: ¿se agrega `practice_site_id` a `practitioner_service_offerings` (una oferta por sede) o una tabla puente oferta↔sede? | **Tabla puente** `practitioner_service_offering_sites (offering_id, practice_site_id, duration_minutes?)`: una oferta puede valer en varias sedes con duración distinta | Pablo (modelo) |
| Q-J5 | MD-07.c «muchísimos mejores iconos»: ¿set propio o librería? | Set **propio** en SVG con tokens (sin librería nueva, regla 95.1.4): 12 categorías + ~40 etiquetas frecuentes; cualquier librería exige ADR | Pablo |
| Q-J6 | MD-08: ¿las relaciones nuevas entran al modelo (`concept_relationships`) o sólo a la semilla del front? | **Al modelo**, con `source_name`, `source_ref`, `evidence_level`, `imported_at` (columnas nuevas en `.puml` M03); la semilla se regenera desde ahí | Pablo |

## 4. Plan — hitos, subtareas y microtareas

Estados: `TODO`, `EN CURSO`, `HECHO`, `A MEDIAS`, `BLOQUEADO`, `DESCARTADO`.

### H1 — Corte, baseline y «no funciona nada» medido

**Prioridad:** `BLOQUEANTE`

**CA:** Dado tu entorno, cuando alguien pregunta contra qué versión trabajaste, qué estaba en rojo y qué de la reserva falla hoy contra la API real, entonces hay SHA, salidas, kill-tests en rojo y una tabla «paso de la reserva → resultado contra la API real» con el código HTTP de cada fallo.
**DoD:** `evidencia/antes/`; tabla en `PLAN.md`; roles pedidos en el daily.
**Estado:** TODO

#### H1.S1 — Corte y baseline

**CA:** Dado un rojo posterior, cuando alguien pregunta si lo rompiste vos, entonces la respuesta sale de un archivo.
**DoD:** exit codes pegados; `fx8`, `fx9`, `fx10`, `fx12`, `tj2`, `agenda-mensajeria-*` en verde antes de tocar.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H1.S1.M1 | Corte y rama en los cinco repos | SHA | `git rev-parse` | TODO |
| H1.S1.M2 | Baseline API (`NODE_OPTIONS=--max-old-space-size=8192`), front, AIService, móvil | Exit codes | `evidencia/antes/` | TODO |
| H1.S1.M3 | `yarn test:integration -t "fx8|fx9|fx10|fx12|tj2|agenda-mensajeria"` en verde | Salida | `evidencia/antes/int-scheduling.txt` | TODO |
| H1.S1.M4 | API real + `seed:e2e` + médico con **dos sedes** (siguiendo `fx2`) + paciente sintético | Logins | `evidencia/antes/cuentas.md` | TODO |

#### H1.S2 — La reserva medida y los kill-tests

**CA:** Dado el front contra la API real, cuando recorrés reserva del paciente, reserva de mostrador del médico, check-in, cancelación, reprogramación y walk-in, entonces cada paso tiene su código HTTP y su aviso (o su ausencia) anotados.
**DoD:** tabla en `PLAN.md`; `--grep "@justin"` en rojo pegado.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H1.S2.M1 | Recorrido manual instrumentado (trace de Playwright) de los seis pasos | Tabla con 6 filas | `evidencia/antes/reserva-trace.zip` | TODO |
| H1.S2.M2 | Correr y clasificar `--grep "@justin"` | Tabla | `evidencia/antes/kill-tests-justin.txt` | TODO |
| H1.S2.M3 | Repetir `agenda-*.mjs`, `horario-*.mjs`, `bloqueos-tarjetas-e-iconos.mjs`, `mi-agenda-mes-globo.mjs` contra `real-api` | Capturas + rojos | `evidencia/antes/mjs/` | TODO |
| H1.S2.M4 | Pedir a Pablo por el daily: PRACTITIONER en `holds`, `confirm`, `request`, `check-in` (AG-02, AG-03) | Fila en §4-bis | daily | TODO |

### H2 — La reserva funciona y avisa (MD-10)

**Prioridad:** `BLOQUEANTE`

**CA:** Dado un médico, cuando reserva desde el mostrador para un paciente, entonces la reserva se confirma (sin 403) y el paciente recibe campana + mensaje en el hilo con el médico; dado un walk-in, ídem; dado el check-in del médico, 200; dado cancelar o mover (por cualquiera de los dos), el otro recibe campana + mensaje en el mismo hilo; el envío es idempotente y no rompe la transacción si el chat falla.
**DoD:** int-specs nuevos (`agenda-mensajeria-mostrador`, `agenda-mensajeria-walk-in`, `agenda-hilo-medico-paciente`) + los `fx*` en verde; `test('MD-10 mostrador sin 403')`, `test('MD-10 mensaje al reservar')`, `test('MD-10 mensaje al cancelar')`, `test('MD-10 mensaje al mover')` verdes con **dos sesiones** de Playwright; `carril-p8-avisos-agenda.spec.ts` reescrito a la verdad actual.
**Estado:** TODO

#### H2.S1 — Avisos y hilo

**CA:** Dado `booking-change-notifier.ts`, cuando se confirma (mostrador o walk-in), entonces `notifyChange` corre; dado cualquier `BOOKING_STATE_CHANGED`, entonces el mensaje de chat va al hilo médico↔paciente (`community-booking-chat.adapter.ts`), no a SupportAdmin (Q-J2).
**DoD:** int-specs; sin cambio en `fx*`.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H2.S1.M1 | `confirm-booking.use-case.ts` llama `notifyChange` tras el commit | int-spec: un aviso | `test:integration` | TODO |
| H2.S1.M2 | Walk-in (`create-walk-in…`) ídem | int-spec | `test:integration` | TODO |
| H2.S1.M3 | `messaging-agenda-notice.adapter.ts`: el chat de `KINDS_WITH_CHAT` usa el hilo médico↔paciente (crear si no existe) | int-spec: mensaje en la conversación correcta | `test:integration` | TODO |
| H2.S1.M4 | `request-info` y `propose-schedule` también avisan (hoy nada) | int-spec | `test:integration` | TODO |
| H2.S1.M5 | Idempotencia por `(bookingId, kind, version)` para que un reintento no duplique el mensaje | int-spec | `test:integration` | TODO |

#### H2.S2 — Roles y pantallas del médico

**CA:** Dado el médico, cuando Pablo aplica los roles, entonces `/schedule/book/:slotId` confirma y el check-in desde «Hoy» responde 200; la UI muestra el error accionable mientras tanto.
**DoD:** Playwright con dos sesiones; `today-agenda.spec.ts`.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H2.S2.M1 | `BookingNew` DESK: tras el 200, muestra «Reserva confirmada; se avisó al paciente» y enlace al hilo | spec | spec | TODO |
| H2.S2.M2 | Check-in desde «Hoy» con manejo del 403 (mensaje accionable hasta que llegue el rol) y 200 después | spec | spec | TODO |
| H2.S2.M3 | `test('MD-10 …')` ×4 con dos contextos de navegador (médico y paciente) que afirman el mensaje en `/messaging` | Verdes contra `real-api` | `yarn pw` | TODO |
| H2.S2.M4 | `carril-p8-avisos-agenda.spec.ts`: quitar el encabezado obsoleto («la campana no existe») y hacerlo correr con `E2E_*` | Verde | `yarn pw` | TODO |
| H2.S2.M5 | Móvil: `my_agenda_screen.dart` confirma reservas de mostrador y muestra el aviso | `flutter test` | salida | TODO |

### H3 — Bloqueos visibles en todos lados (MD-09)

**Prioridad:** `BLOQUEANTE`

**CA:** Dado un médico con N sedes, cuando bloquea un rango en cualquiera, entonces día, semana, mes y «Mis horarios» lo dibujan con horas y motivo (etiqueta del catálogo si no hay texto) y con la sede; `/schedule/blocks` lista los de todas las sedes con filtro por sede; el selector del paciente muestra el rango como «No disponible» (Q-J3) en vez de omitirlo; la semana ya no pinta el día entero por un bloqueo parcial.
**DoD:** `test('MD-09 bloqueo de la segunda sede visible')`, `test('MD-09 el paciente ve no disponible')` verdes; specs de `day/week/month-view`, `schedule-grid`, `blocks`; capturas; `bloqueos-tarjetas-e-iconos.mjs` repetido contra `real-api`.
**Estado:** TODO

#### H3.S1 — API: excepciones para el paciente y por recurso

**CA:** Dado el paciente que mira la disponibilidad de un médico sin reserva previa, cuando consulta, entonces recibe los rangos bloqueados como `{ startAt, endAt, label: 'No disponible' }` sin motivo; `GET /scheduling/slots` acepta `includeBlocked=true` y devuelve `status`.
**DoD:** int-specs + matriz negativa (el motivo nunca sale al paciente).
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H3.S1.M1 | `GET /scheduling/resources/:id/unavailability` (público para PATIENT, sin motivo) o `includeBlocked` en `slots` — elegir uno y documentarlo | int-spec | `test:integration` | TODO |
| H3.S1.M2 | `GET resources/:id/exceptions` devuelve `exceptionType` y su etiqueta (hoy el front descarta el tipo) | int-spec | `test:integration` | TODO |
| H3.S1.M3 | Decidir `calendar_absences`: cablear (si aporta `blocks_scheduling` por práctica) o retirar del `.puml` M41 con nota; registrar la decisión | ADR corto | archivo | TODO |

#### H3.S2 — Front del médico, todas las sedes

**CA:** Dado `MyAgenda` y `Blocks`, cuando el médico tiene varias sedes, entonces cargan los bloqueos de **todos** sus recursos y los muestran con la sede.
**DoD:** specs con fixture de dos recursos; capturas.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H3.S2.M1 | `my-agenda.ts:842,1226-1290`: cargar excepciones de todos los recursos; conservar `id`, tipo y sede en el mapeo | spec | spec | TODO |
| H3.S2.M2 | `week-view`: bloque parcial = banda horaria, no día entero (`:397,427-438`) | spec | spec | TODO |
| H3.S2.M3 | `month-view`: globo con «Sede · HH–HH · motivo» por bloqueo | spec | spec | TODO |
| H3.S2.M4 | `schedule-grid`: bloques de todas las plantillas activas y sedes | spec | spec | TODO |
| H3.S2.M5 | `blocks.ts:255`: todas las sedes + filtro por sede + columna sede | spec + `.mjs` | captura | TODO |
| H3.S2.M6 | Selector del paciente (`practitioner-availability`, `practitioner-service-schedule`, `booking-new`): rangos «No disponible» visibles y no clicables | spec | `test('MD-09 paciente')` | TODO |
| H3.S2.M7 | Móvil: `my_agenda_screen.dart` lista bloqueos de todas las sedes; `slot_picker` muestra «No disponible» | `flutter test` | salida | TODO |

### H4 — Horarios multi-sede y multi-servicio, tipo MS Project (MD-04)

**Prioridad:** `ALTA`

**CA:** Dado un médico con dos sedes y tres servicios de distinta duración, cuando abre `/schedule?vista=linea`, entonces ve una línea de tiempo semanal con eje horario, una fila por sede y por servicio, barras con duración real, bloqueos y citas; puede mover o estirar una barra con confirmación y la API lo persiste; la semana clásica tiene eje horario y la vista mensual distingue sede; «Mis horarios» dibuja todas las plantillas; el servicio se puede ofrecer en una sede y no en otra con duración distinta (Q-J4).
**DoD:** `.puml` M41 con la tabla puente; int-specs; `test('MD-04 línea de tiempo con dos sedes y tres servicios')` verde; specs; capturas en 1440/768/390 con equivalente por teclado; doble revisión.
**Estado:** TODO

#### H4.S1 — Modelo y API: servicio por sede

**CA:** Dado `practitioner_service_offering_sites`, cuando se consulta la disponibilidad de un servicio, entonces sólo se ofrecen cupos de las sedes donde el servicio vale, con su duración.
**DoD:** `gen_ddl.py 41`; patch; `orm:audit` 0; int-specs de `service-availability` por sede.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H4.S1.M1 | Tabla puente en `diagram_41_scheduling.puml` (Q-J4) | Regenera | `gen_ddl.py 41` | TODO |
| H4.S1.M2 | `PUT /scheduling/service-offerings/:id/sites` (lista blanca) y lectura en `service-availability` | int-spec | `test:integration` | TODO |
| H4.S1.M3 | `GET /scheduling/me/timeline?from&to` → filas por recurso y servicio con cupos, citas y bloqueos (una llamada, no N) | int-spec + tiempo < 500 ms con dos sedes | `test:integration` | TODO |
| H4.S1.M4 | `PATCH /scheduling/templates/:id/rules/:ruleId` para mover o estirar una franja desde la línea (reusa `shift-slots` donde aplique) y respeta `fx*` | int-spec | `test:integration` | TODO |

#### H4.S2 — La línea de tiempo y las vistas

**CA:** Dado `vista=linea`, cuando se renderiza, entonces cumple el CA del hito, respeta movimiento reducido y tiene una tabla equivalente para teclado y lector.
**DoD:** specs; axe; capturas; `yarn gates:diseno` 0.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H4.S2.M1 | Boceto en `evidencia/boceto-linea-de-tiempo.png` con tokens y visto bueno de Pablo | Fila en el daily | daily | TODO |
| H4.S2.M2 | Componente `timeline-view` (filas sede→servicio, eje horario, barras, bloqueos, citas) | spec | spec | TODO |
| H4.S2.M3 | Arrastre para mover y estirar con `DialogService.confirm()` y reversión ante error | spec | spec | TODO |
| H4.S2.M4 | Equivalente accesible: tabla con las mismas filas y acciones por botón | axe + teclado | evidencia | TODO |
| H4.S2.M5 | `week-view` con eje horario y columnas por sede (toggle «todas / una») | spec + captura | doble revisión | TODO |
| H4.S2.M6 | `month-view`: conteos por sede y color por servicio **con texto** | spec + captura | doble revisión | TODO |
| H4.S2.M7 | `services-schedule` / `AgendaCreate`: elegir sedes y duración por sede de cada servicio | spec | spec | TODO |
| H4.S2.M8 | Repetir `horario-*.mjs`, `agenda-*.mjs` contra `real-api` y guardar capturas | capturas | `evidencia/despues/mjs/` | TODO |

### H5 — C-04 lado reserva: la orden viaja, la duración se ajusta

**Prioridad:** `ALTA`

**CA:** Dado `POST /scheduling/slots/:id/holds` y `POST /scheduling/holds/:token/request` con `serviceRequestId` y `durationMinutes?`, cuando se reserva, entonces `appointment_bookings.service_request_id` queda persistido y visible en el DTO; `PATCH /scheduling/bookings/:id/duration` (DIAGNOSTIC_STAFF) ajusta el fin y recalcula cupos sin pisar otra reserva (409 si choca); `expected_duration_minutes` de la oferta diagnóstica y `defaultSlotMinutes` de la unidad se usan al generar cupos del recurso del centro.
**DoD:** `.puml` M41 con `service_request_id`; int-specs incl. carrera; publicado en el daily el día 1 como DTO para Itzan y Richard.
**Estado:** TODO

#### H5.S1 — Modelo, DTOs y endpoint de duración

**CA:** Dado el contrato, cuando Itzan y Richard construyen, entonces compilan contra lo publicado.
**DoD:** int-specs; fila en §4-bis.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H5.S1.M1 | `service_request_id` (FK nullable) en `appointment_bookings` (`.puml` M41) | Regenera | `gen_ddl.py 41` | TODO |
| H5.S1.M2 | DTOs de hold/request con `serviceRequestId?`, `durationMinutes?` (lista blanca) y `BookingItemDto.serviceRequestId` | int-spec | `test:integration` | TODO |
| H5.S1.M3 | `PATCH /scheduling/bookings/:id/duration` con precondición en la escritura y 409 por choque | int-spec de carrera | `test:integration` | TODO |
| H5.S1.M4 | Generación de cupos del recurso de una unidad diagnóstica usa `expected_duration_minutes` de la oferta y `defaultSlotMinutes` de la unidad (lo expone Itzan por su `settings`; vos leés) | int-spec | `test:integration` | TODO |
| H5.S1.M5 | Publicar C-04 lado reserva en el daily el día 1 | Fila | daily | TODO |

### H6 — El glosario como atlas (MD-07)

**Prioridad:** `MEDIA`

**CA:** Dado `/glossary`, cuando el paciente busca, entonces la barra de filtros queda fija arriba, la rejilla de categorías se pliega a chips y no tapa los resultados, cada tarjeta tiene ícono de categoría y de etiqueta; dado un término con artículo, su página muestra secciones con fuente, licencia y URL por párrafo e imágenes con atribución; la cobertura (términos con artículo ≥ 2 000 palabras, con imagen, por categoría) está publicada en `docs/` y medida con script; nada se generó con un modelo.
**DoD:** las cuatro etapas corren y producen `articles.ndjson` + `COVERAGE.md` con conteos; artículos servidos por `GET /terminology/concepts/:id/glossary-article` bajo demanda (la semilla no crece más de 5 %); `test('MD-07 filtro fijo y categorías visibles')`, `test('MD-07 artículo con fuente e imagen')` verdes; `glossary-articulos-alovida.mjs --check` en verde; `lane-25-glossary.spec.ts` y `atlas-anatomico-en-pantalla.spec.ts` actualizados.
**Estado:** TODO

#### H6.S1 — Correr las etapas con procedencia

**CA:** Dado `tools/terminology-import/encyclopedia/s1..s4`, cuando se corren contra las fuentes, entonces cada artículo trae `source`, `license`, `url`, `retrievedAt` por sección, y el reporte de cobertura dice cuántos términos llegaron a ≥ 2 000 palabras (se espera que **pocos**: eso se publica, no se maquilla).
**DoD:** `COVERAGE.md` con la tabla; muestra de 20 artículos revisados a mano por Pablo o el doctor (licencia y pertinencia).
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H6.S1.M1 | s1-medlineplus (1 016 temas + 302 guías, dominio público, sin A.D.A.M.) | `articles.ndjson` + conteo | `node … s1` | TODO |
| H6.S1.M2 | s2-cie10 con Orphanet (CC BY 4.0) + imágenes P18 → Commons con lista blanca | ídem | `node … s2` | TODO |
| H6.S1.M3 | s3-farmacos (CIMA, sin posología 4.2) | ídem | `node … s3` | TODO |
| H6.S1.M4 | s4-anatomia (Wikidata, HPO, MeSH, Commons) | ídem | `node … s4` | TODO |
| H6.S1.M5 | `COVERAGE.md`: términos, con artículo, ≥ 500, ≥ 2 000 palabras, con imagen, por categoría; comparado contra el baseline de la verificación | Tabla | archivo | TODO |
| H6.S1.M6 | Si D-4 habilita Wikipedia en español (CC BY-SA): etapa s5 con atribución por párrafo; si no, registrar que el ≥ 2 000 no se alcanza sin ella | Decisión en el daily | daily | TODO |
| H6.S1.M7 | Arreglar `glossary-articulos-alovida.mjs --check` (SVG faltante) y compilar los 19 artículos propios como `PENDIENTE DE REVISIÓN MÉDICA` visible | `--check` verde | salida | TODO |

#### H6.S2 — Servir bajo demanda y cargar

**CA:** Dado `load-glossary-es.mjs`, cuando carga artículos e imágenes a `concept_properties`, entonces `GET /terminology/concepts/:id/glossary-article` los devuelve con sus fuentes y el front no los incluye en la semilla.
**DoD:** carga idempotente (segunda corrida 0 cambios); `du -sh public/glossary-seed` ≤ +5 %.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H6.S2.M1 | Sembrar `GLOSSARY_IMAGE_PROPERTY_CODE` y artículos con `load-glossary-es.mjs` | Idempotente | corrida ×2 | TODO |
| H6.S2.M2 | `readGlossaryArticle` del front contra la API real (hoy sólo `mock/articles`) | Playwright | `test('MD-07 artículo')` | TODO |
| H6.S2.M3 | Semilla regenerada con `hasDetail: true` donde hay artículo; tamaño medido | `du` | evidencia | TODO |

#### H6.S3 — UI: filtro fijo, categorías, íconos

**CA:** Dado `glossary.html`, cuando se busca, entonces la barra es `sticky`, la rejilla pasa a chips plegables por encima de los resultados, hay ícono por categoría y por etiqueta frecuente (set propio, Q-J5).
**DoD:** specs; capturas; `yarn gates:diseno` 0; doble revisión.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H6.S3.M1 | Barra de filtros `sticky` con tokens; rejilla → chips al escribir | spec | `test('MD-07 filtro')` | TODO |
| H6.S3.M2 | Set de íconos propio (12 categorías + etiquetas frecuentes) en `glossary-category-icon.ts`, con nombre accesible | spec | spec | TODO |
| H6.S3.M3 | Detalle: secciones con fuente/licencia/URL y galería con atribución | spec + captura | doble revisión | TODO |
| H6.S3.M4 | Actualizar `lane-25-glossary.spec.ts`, `atlas-anatomico-en-pantalla.spec.ts`, `glosario-*.mjs` | Verdes | `yarn pw` | TODO |

### H7 — Relaciones enfermedad ↔ síntoma ↔ medicina ↔ anatomía (MD-08)

**Prioridad:** `MEDIA`

**CA:** Dado `concept_relationships` con procedencia (Q-J6), cuando se importan las relaciones de Wikidata (P780, P2176, P927, P924, P923, P1995), HPO (`phenotype.hpoa`) y las 65 549 de `clinical-knowledge` de AIService (con peso), entonces los pares anatomía–síntoma y anatomía–medicina dejan de ser 15 y 2, cada relación dice de dónde salió, y el detalle del término muestra el mapa por tipo; AIService y el front leen la misma fuente.
**DoD:** `.puml` M03 con las columnas de procedencia; importación idempotente con conteos antes/después por par en `docs/`; `test('MD-08 mapa de relaciones con fuente')` verde; AIService `build-glossary-official.mjs` deja de descartar anatomía y medicinas (con su evaluación `yarn knowledge:evaluate` sin retroceso).
**Estado:** TODO

#### H7.S1 — Modelo e importación

**CA:** Dado el importador, cuando corre dos veces, entonces la segunda no inserta nada y los conteos por par están publicados.
**DoD:** salida ×2 pegada; tabla de pares.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H7.S1.M1 | `concept_relationships.source_name`, `source_ref`, `evidence_level`, `weight`, `imported_at` en `.puml` M03 | Regenera | `gen_ddl.py 03` | TODO |
| H7.S1.M2 | Importar las relaciones de Wikidata con procedencia (reusa `import-wikidata-relations.mjs`) | Conteos | salida | TODO |
| H7.S1.M3 | Importar enfermedad→hallazgo de AIService (`clinical-knowledge.generated.ts`) con `weight` y `evidence_level` | Conteos | salida | TODO |
| H7.S1.M4 | Anatomía↔síntoma desde HPO (`anatomical site` de los términos) y anatomía↔anatomía (`part of`, Uberon vía Wikidata P361/P527) con procedencia | Conteos > 0 | salida | TODO |
| H7.S1.M5 | Publicar la tabla «par → antes → después → fuentes» en `docs/` | Tabla | archivo | TODO |

#### H7.S2 — Consumo

**CA:** Dado el detalle de un término, cuando tiene relaciones, entonces las muestra agrupadas por tipo con la fuente en el tooltip; AIService lee las mismas relaciones.
**DoD:** spec; `yarn knowledge:evaluate` sin retroceso (top 3 ≥ 75 %).
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H7.S2.M1 | `glossary-network.ts` y `glossary-term` muestran fuente por relación | spec | spec | TODO |
| H7.S2.M2 | `build-glossary-official.mjs` conserva ANATOMY y TREATMENT/DRUG; evaluación sin retroceso | `yarn knowledge:evaluate` | salida | TODO |
| H7.S2.M3 | `symptom-glossary.generated.ts` regenerado (99 → más síntomas con slug) | Conteo | salida | TODO |

### H8 — Verde, regresión y cierre

**Prioridad:** `ALTA`

**CA:** Dado el lote, cuando se corre `--grep "@justin"` contra la API real, entonces todo pasa; `fx*` y `agenda-mensajeria-*` en verde; doble revisión; PRs mergeables.
**DoD:** `evidencia/despues/`; `evidencia/doble-revision.md`; `gh`; `REPORTE.md`.
**Estado:** TODO

#### H8.S1 — Cierre

**CA:** Dado el `REPORTE.md`, cuando lo lee alguien que no vio la sesión, entonces sabe qué anda, qué no y qué falta exactamente.
**DoD:** `report_gate.py --self-test` PASS.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H8.S1.M1 | Kill-tests `@justin` en verde | 0 fallos | `yarn pw --grep "@justin"` | TODO |
| H8.S1.M2 | `test:integration scheduling` completo + `fx*` + regresión front, AIService y móvil | Exit 0 | salidas | TODO |
| H8.S1.M3 | Gates, axe en la línea de tiempo y el glosario, doble revisión | archivo | evidencia | TODO |
| H8.S1.M4 | OpenAPI regenerado; PRs `MERGEABLE` con `gh` | salidas | evidencia | TODO |
| H8.S1.M5 | `REPORTE.md` en cada repo | avance calculado | `report_gate.py` | TODO |

## 5. Definition of Done del lote

1. Los `test()` `@justin` pasan **contra la API real**, con dos sesiones donde el CA lo pide.
2. `fx8`, `fx9`, `fx10`, `fx12`, `tj2`, `agenda-mensajeria-*` y los int-specs nuevos en verde; deriva modelo ↔ base ↔ ORM en 0.
3. `lint`, `typecheck`, `test`, `test:integration scheduling terminology` de la API; `lint`/`typecheck`/`test`/`gates:diseno` del front; `yarn knowledge:evaluate` de AIService sin retroceso; `flutter analyze`/`flutter test`.
4. Ningún párrafo del atlas sin fuente, licencia y URL; ningún texto generado por modelo; `COVERAGE.md` publicado con los números reales.
5. Ninguna aserción debilitada; los `.mjs` repetidos contra la API real.
6. Capturas con dos pasadas; PRs `MERGEABLE`; `REPORTE.md` con avance calculado y «No cubierto».
