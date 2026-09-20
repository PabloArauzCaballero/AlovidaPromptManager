# H3 — Permisos, estados y dinero del recorrido M-06

> **Consulta:** 2026-09-20T18:40–19:05 UTC · **Peldaño:** `VERIFIED` para lo ejecutado contra la API real (H3.S1, H3.S2), `DISCOVERED` para lo que sólo se leyó (H3.S3.M2 redondeo, catálogo de moneda) · **API:** `mantra-core-health-api` @ `a5753dc7`, arrancada localmente (PID declarado en `evidencia/H3.0_api-arranque.txt`) contra la base del propio `.env` del repo (Neon, `RLS_ENFORCE=false`) · **Actores:** los sintéticos de `CASOS-ACEPTACION-M06-2026-09-20.md` §4, materializados en runtime (correos `@example.test`, documentos `SINT<corrida><n>`, sin PII real).

**Veredicto de una línea:** el kill-test del hito (*"cambiá el identificador de la URL por el de otro paciente"*) **FALLABA**: `GET /scheduling/bookings/:id` devolvía 200 con los datos completos de la cita a otro paciente y a un actor de otra organización, y `cancel`/`reschedule` dejaban a cualquier paciente operar la cita ajena. Las transiciones de estado **sí** están bien protegidas por el backend (dos intentos ilegales, dos 422). El dinero está en `numeric` (nunca `float`) pero no en enteros de la menor unidad, y la moneda tiene 4 juegos de conceptos sin reconciliar. Todo lo declarado abajo tiene comando y salida pegada en `evidencia/`.

> [!success] Corregido y verificado el 2026-09-20 — PR [mantra-core-health-api#447](https://github.com/mdavila-2001/mantra-core-health-api/pull/447)
> Los tres hallazgos de autorización de §1 (`R1`/`R2` de lectura, `W2`/`W3`/`W1` de escritura) **están arreglados**: reusan `assertPuedeActuarPorElPaciente`, el método que ya existía en el mismo servicio. Reverificado contra la API reconstruida, sobre la **misma cita y en la misma corrida**: el intruso recibe **403** y el titular cancela con **200**. Suite de `scheduling` **483/483** (eran 476; las 7 nuevas son de autorización negativa y **4 de ellas fallan sin el arreglo**). Salida literal en `evidencia/H3.FIX_reverificacion-contra-api-viva.txt`.
>
> **`R4` no se corrigió, y es a propósito** — ver la fila corregida en §1.M1: no es el mismo tipo de hallazgo y "arreglarlo" rompería una funcionalidad que el cliente pide. Queda como pregunta de producto.

---

## §0 — Kill-test del hito, respondido primero

> *"Cambiá el identificador de la URL por el de otro paciente. Si devuelve datos, todo lo demás del recorrido es irrelevante."*

**Se cambió.** `GET /scheduling/bookings/{id de la cita de PA1}` con el token de PA2 (otro paciente, misma organización) devolvió **200** con `patientProfileId`, `resourceId`, `bookableSlotId`, `appointmentId`, `startAt`, `endAt` y `statusConceptId` de la cita ajena. Repetido con el token de PB1 (paciente de **otra** organización, en el contexto de esa organización) devolvió el mismo **200** con los mismos datos. Evidencia literal en `evidencia/H3.S1.M1_adv04-lectura.txt`, filas `R1` y `R2`.

Por la regla del kill-test, el resto de este documento es evidencia de **qué tan grave** es el fallo y de qué otras superficies del mismo recorrido comparten o no la misma causa — no una validación de que el recorrido "pasa".

---

## §1 — Permisos (H3.S1)

### H3.S1.M1 — ADV-04 lectura

**Comando:** `node h3-recorrido.mjs --step idorRead` contra la API viva. Salida completa en `evidencia/H3.S1.M1_adv04-lectura.txt`.

| # | Quién | Qué lee | Esperado (regla 90.1.3) | Observado | Veredicto |
|---|---|---|---|---|---|
| R0 | PA1 (dueño) | su propia cita | 200 | 200 | control positivo, PASS |
| R1 | PA2 (otro paciente, **misma** organización) | cita de PA1 por su uuid | 403/404 | **200**, cuerpo completo | **FAIL** |
| R2 | PB1 (paciente de **otra** organización, en su propio contexto) | cita de PA1 (organización A) | 403/404 | **200**, cuerpo completo | **FAIL** |
| R3 | Owner de la organización B (rol global `USER`) | cita de PA1 | 403/404 | 403 | PASS |
| R4 | PB1 (contexto B) | cupos publicados del recurso de A (`GET /scheduling/slots`) | *ver nota* | **200**, 3 cupos | **`DECISION_REQUIRED`**, no `FAIL` |
| R5 | PA2 | espera de PA1 por su `patientProfileId` | 403 | 403 | PASS |
| R6 | PA2 con `x-tenant-id` de una organización sin membresía | cita de PA1 | 403 | 403 (el guard de tenant, no de ownership) | PASS |
| R7 | Sin sesión | cita de PA1 | 401 | 401 | PASS |
| R8 | PA2 | cola de espera de la agenda de A | 403 | 403 | PASS |

**2 de 9 celdas en `FAIL`** (`R1` y `R2`), **1 en `DECISION_REQUIRED`** (`R4`), 6 en `PASS`. Los dos `FAIL` comparten una forma: leen una cita concreta por su identificador (`GET .../bookings/:id`) sin que el servicio compare al actor contra el dueño. Las que pasan son las que ya tenían un chequeo explícito escrito (`assertPuedeVerAlPaciente`, el guard de tenant sobre el header). **`R1` y `R2` están corregidos** — ver el aviso del encabezado y §7.

> [!note] Por qué `R4` dejó de contarse como `FAIL` (corrección de este mismo documento)
> La primera redacción lo dio por rojo con el mismo criterio que `R1`/`R2`. **Al ir a corregirlo apareció que no es el mismo caso**, y forzar el arreglo habría roto producto:
> - **No devuelve ningún dato de persona.** El cuerpo son cupos: identificador, horario, capacidad y capacidad restante. Ni nombre, ni motivo, ni perfil de paciente. `R1`/`R2`, en cambio, devolvían `patientProfileId`, horario y motivo de consulta de una persona concreta.
> - **El cliente pide explícitamente lo contrario de restringirlo.** `REQUISITOS-CLIENTE-ALOVIDA.md:104` — «Desde la APP puede revisar **todos** los médicos que están disponibles con seguro y sin seguro» — y `:106`, «Ingresa al medico que requieres y revisa su horario». Un paciente elige con qué médico atenderse **antes** de tener relación con su organización: si la disponibilidad se restringiera al tenant propio, el recorrido M-06 no existiría.
> - **Es coherente con el endpoint hermano.** `GET /scheduling/resources` (el directorio de médicos) también se consulta pasando el `tenantId` que se quiera mirar: el patrón del módulo es «catálogo público que se navega por organización», no «datos privados del tenant propio».
>
> Queda entonces como **pregunta de producto, no como defecto corregido**: ¿la disponibilidad publicada de un profesional es pública para cualquier paciente autenticado (lo que el texto del cliente sugiere) o debe restringirse? La responde negocio. Registrarla como `FAIL` sin esa respuesta sería presentar una interpretación como hecho (regla 00 §1.6).

### H3.S1.M2 — ADV-04 escritura + consulta posterior

**Primera corrida** (`evidencia/H3.S1.M2_adv04-escritura.txt`) quedó **contaminada**: el primer intento (`W1`, PA2 cancela la cita de PA1) devolvió 200 — es decir, **el propio intento de escritura ilegítima tuvo éxito** — y dejó la cita cancelada antes de que corrieran `W2` (cancelar desde otra organización) y `W3` (reprogramar). Esos dos, al recibir la cita ya cancelada, devolvieron 409/422 por **estado**, no por autorización: no prueban nada sobre permisos. Se declaró la contaminación en el propio archivo de evidencia y se re-ejecutó con una cita fresca.

**Segunda corrida, sobre una reserva nueva** (`evidencia/H3.S1.M2_adv04-escritura-ronda2.txt`), en este orden — para que un éxito indebido no invalide el resto:

| # | Quién | Qué intenta | Esperado | Observado | Veredicto |
|---|---|---|---|---|---|
| T1 | Admin (control legítimo del estado, no de permisos) | completar la cita **sin haberla iniciado** | 422 | 422 `INVALID_STATE_TRANSITION`, sin cambio | PASS (ver §2) |
| W3 | PA2 (otro paciente, **misma** organización) | reprogramar la cita de PA1 a otro cupo | 403/404 | **200**, la cita se movió de cupo | **FAIL** |
| W2 | PB1 (miembro de la organización B, en contexto B) | cancelar la cita de PA1 (organización A) | 403/404 | **200**, `capacityReleased: true` | **FAIL** |
| C1 | PA1 (dueño) | cancelar su propia cita | 200 | *omitido*: la cita ya no estaba en su estado inicial porque `W2` la había cancelado un instante antes | — |
| T2 | Admin | iniciar la consulta de una cita **ya cancelada** (por `W2`) | 422 | 422 `INVALID_STATE_TRANSITION`, sin cambio | PASS |

**Consulta posterior:** después de `W2`, la bandeja de PA1 (`GET /notifications/me`) sigue en 0 avisos — la cancelación ajena no generó ningún aviso al dueño, lo que la hace además **invisible** para quien la sufre. El cupo original (liberado por la cancelación ilegítima) volvió a ofrecerse como libre — verificado en `evidencia/H3.S2.M2_transicion-ilegal-T2-y-limpieza.txt`, fila `C2`.

**Causa raíz** (`evidencia/H3.S1.M1_root-cause-cancel-reschedule.txt`): el propio archivo `scheduling-bookings.service.ts` ya tiene el patrón correcto — un método privado `assertPuedeActuarPorElPaciente(patientProfileId, actor)` que compara al actor contra el dueño del recurso — y lo usa en `placeHold`, en la confirmación del hold, en `searchBookings` y en `enroll` de la lista de espera. **`cancel()` y `reschedule()` no lo llaman**: cargan la reserva por `{ id }` a secas (`findBookingByIdForUpdate`) y el único control activo es `@Roles('PATIENT', …)` en el controller, que autoriza a *cualquier* actor con ese rol, sin comparar `patientProfileId`. Es BOLA/IDOR de escritura (OWASP API1/API3): el rol correcto sobre el recurso ajeno sigue siendo acceso indebido (regla 90.1.2).

### H3.S1.M3 — Matriz rol × recurso × acción

Consolidada en `evidencia/H3.S1.M3_matriz-autorizacion.txt` a partir de §1.M1/M2 y de lo que Justin ya cubrió con dobles en `origin/dev` (`test/integration/waitlist-cupo-liberado.int-spec.ts`). **19 celdas**: 4 `FAIL` (todas IDOR/BOLA, todas sobre `bookings`/`slots`), 12 `PASS`, 3 `NOT_RUN` declaradas (no asumidas) — check-in con rol PATIENT, endpoints internos con rol PATIENT, y el negativo de autorización de `POST .../reminders` que H1 §11 ya marcó sin `assert*` por lectura pero que este turno no llegó a ejercitar con una llamada real.

---

## §2 — Estados (H3.S2)

### H3.S2.M1 — Transiciones legales, con su fuente

Fuente literal en `evidencia/H3.S2.M1_transiciones-fuente.txt` (`src/modules/scheduling/state/booking-state-machine.ts:18-66`).

| Desde | Hacia (legales) | Fuente |
|---|---|---|
| `REQUESTED` | `PENDING_CONFIRM`, `CONFIRMED`, `CANCELLED` | INTERNO |
| `PENDING_CONFIRM` | `CONFIRMED`, `CANCELLED` | INTERNO |
| `CONFIRMED` | `CHECKED_IN`, `IN_PROGRESS`, `CANCELLED`, `NO_SHOW` | INTERNO (el rango de destinos), **CLIENTE** para `CANCELLED` (3.4/4.3 del cliente, «un paciente descofirmó») |
| `CHECKED_IN` | `IN_PROGRESS`, `CANCELLED`, `NO_SHOW` | INTERNO |
| `IN_PROGRESS` | `COMPLETED` (única salida) | INTERNO |
| `COMPLETED` / `CANCELLED` / `NO_SHOW` | ninguna (terminales) | INTERNO |

**Reprogramar no es una transición de estado**: la cita permanece `CONFIRMED` y el cambio se modela como un evento aparte (`booking_reschedules`). El cliente no define esta máquina — pide sólo que se pueda cancelar y que el médico avise demora sin perder la cita (`:225-226`); el resto es diseño interno, correctamente rotulado como tal.

### H3.S2.M2 — Intento de transición ilegal

Dos intentos, en `evidencia/H3.S2.M2_transicion-ilegal.txt` (T1, sobre `illegal`) y `evidencia/H3.S2.M2_transicion-ilegal-T2-y-limpieza.txt` (T2, sobre `cleanup`), más el T1 repetido en la ronda 2 sobre una reserva no contaminada:

- **T1 — completar una cita `CONFIRMED` sin haberla iniciado:** rechazada con **422**, `code: PRECONDITION_FAILED`, `failureCode: INVALID_STATE_TRANSITION`. La consulta posterior confirma que el estado no cambió. **PASS**, repetido dos veces (ronda 1 y ronda 2) con el mismo resultado.
- **T2 — iniciar la consulta de una cita `CANCELLED`:** rechazada con **422**, mismo `failureCode`. **PASS**, repetido dos veces.

**El backend rechaza las dos transiciones ilegales, no una UI que oculta un botón** — la llamada se hizo directo contra la API, sin pasar por ningún frontend. La máquina de estados en sí está bien construida; el problema de este recorrido no es de estados, es de autorización (§1).

---

## §3 — Dinero (H3.S3)

Todo lo de esta sección es lectura (`DISCOVERED`), salvo las dos consultas SQL, que se ejecutaron contra la base real (`VERIFIED` como hecho observado, no como comportamiento de la aplicación).

### H3.S3.M1 — Enteros de la menor unidad

`evidencia/H3.S3_sql-dinero-y-rls.txt`, consulta 1: las dos columnas monetarias de `scheduling` (`booking_cancellations.fee_amount`, `booking_policies.no_show_fee_amount`) son **`numeric`** sin precisión ni escala fijadas en el esquema. Consulta 2: **cero** columnas `real`/`double precision` en los 6 esquemas de dinero del sistema (`scheduling`, `billing`, `payments`, `insurance`, `accounting`, `pharmacy_inventory`).

**No hay flotantes — pero tampoco hay enteros de la menor unidad.** `numeric` sin escala fija es mejor que `float` (no hay error de redondeo binario), pero no es lo que pide `accounting-double-entry` (montos en centavos como entero). En TypeScript el valor llega como `string` (`feeAmount?: string`), lo que evita que JavaScript lo convierta a `Number` y pierda precisión — es una mitigación real, no completa.

### H3.S3.M2 — Moneda, precisión y redondeo

`evidencia/H3.S3_sql-dinero-y-rls.txt`, consulta 3: **12 conceptos** con código que contiene `CURRENCY`, repartidos en **4 juegos sin reconciliar** — `accounting:CURRENCY_USD`/`CURRENCY_PEN`, `diagnostic_units:CURRENCY_BOB`/`CURRENCY_PEN`, `pharmacy:CURRENCY_USD`, `pharmacy_inventory:CURRENCY_USD` — más **6 conceptos placeholder** (`DEFAULT_CURRENCY`, `DEFAULT_DEFAULT_CURRENCY`, `DEFAULT_FROM_CURRENCY`, `DEFAULT_TO_CURRENCY`, `DEFAULT_CONCURRENCY_POLICY`, `DEFAULT_OPERATING_CURRENCY`) cuyo `display` es literalmente `"Catalog concepts — Terminology"` — texto de placeholder, no un nombre de moneda. Consulta 4: las dos columnas de moneda de `scheduling` sí tienen FK real a `terminology.catalog_concepts` (no es un campo suelto).

**Redondeo:** `grep -rnE 'Math\.round|toFixed|Math\.floor|Math\.ceil|Decimal|BigInt' src/modules/scheduling/` devuelve **una sola coincidencia**, y no es sobre dinero: `Math.round(windowMinutes / 60)` en un mensaje de texto sobre la ventana de cancelación (`scheduling-bookings.service.ts:1482`). **No hay ninguna regla de redondeo monetario en el módulo.** El camino del dinero (`feeAmount`) se copia de la política a la cancelación sin ninguna operación aritmética visible (`grep` de `feeAmount`/`noShowFeeAmount` sólo muestra asignaciones directas, nunca una multiplicación, un porcentaje ni un `round`).

### H3.S3.M3 — Lo que no está definido (dinero)

| ID | Qué falta | Quién lo define |
|---|---|---|
| DR-M06-DINERO-01 | Si existe tarifa de cancelación/no-show para M-06 y su monto | Negocio / cliente (el cliente no la menciona en 3.x/4.x) |
| DR-M06-DINERO-02 | Moneda por defecto entre los 4 juegos sin reconciliar | Negocio — decisión ya señalada como abierta en el `CLAUDE.md` de la raíz, anterior a este trabajo |
| DR-M06-DINERO-03 | Regla de redondeo — no hay ninguna hoy en el código de `scheduling` | Negocio |
| DR-M06-DINERO-04 | Si el dinero debería migrar a entero de la menor unidad (hoy `numeric`) | Arquitectura / Pablo |
| DR-M06-DINERO-05 | Datos de facturación de la consulta (3.6 del cliente): siguen sin localizador en el flujo de reserva (H1 §7, F10 de H2) | Negocio / cliente |

Esta lista coincide con `DR-M06-01` de `CASOS-ACEPTACION-M06-2026-09-20.md` §6 — no se duplica la decisión, se referencia.

---

## §4 — Datos sintéticos usados (sin PII real)

Detalle completo, con cada llamada y su código de respuesta, en `evidencia/H3.prep_datos-sinteticos.txt`. Resumen:

| Actor | Rol / membresía | Uso en este documento |
|---|---|---|
| Admin de arranque | `SUPERADMIN` (comodín global) | Preparación de datos, transiciones ilegales (control legítimo) |
| PA1 | `PATIENT`, tenant A (por defecto) | Dueño de la(s) reserva(s) bajo ataque |
| PA2 | `PATIENT`, tenant A (por defecto) | Actor de la misma organización que ataca la reserva de PA1 |
| PB1 | `PATIENT`, tenant A (por defecto) **+ membresía `STAFF` en tenant B** (agregada por el admin) | Actor de otra organización, en dos roles: paciente sin relación y miembro de B |
| Owner de organización B | rol global `USER` (alta pública) | Actor de otra organización sin ningún rol clínico |
| Organización B | tenant sintético `SINT_ORG_B_<corrida>` | Contraparte del actor cross-tenant |

Ningún nombre, documento ni correo es real. Los documentos llevan el prefijo `SINT` y los correos el dominio `example.test`, siguiendo la convención ya vigente de los arneses del repo (`p8-avisos-agenda.mjs`).

---

## §5 — Handoff

**A Justin:** los 4 `FAIL` de §1 son los negativos que hay que sumar a tu matriz — especialmente `W2`/`W3` (cancelar/reprogramar ajeno), porque tu relación `agenda → mensajería` ya cubre el camino feliz de estas mismas rutas con dobles: el mismo doble puede envolverse en un test de autorización negativa sin escribir nada nuevo del lado del aviso.

**A Ender:** ninguna regla monetaria nueva para el contrato de avisos — el hallazgo de dinero (§3) no toca `agenda-notice.port.ts`. Sí hay una consecuencia indirecta: la cancelación ilegítima de `W2` no generó ningún aviso a PA1 (bandeja en 0), lo que significa que el aviso de cambio de estado tampoco corrió para una cancelación hecha por un actor no autorizado — dato para tu matriz de cuándo se emite `BOOKING_STATE_CHANGED`.

**A Pablo:** los tres controles que faltaban **ya están puestos y verificados** (PR #447, ver §7); lo que queda para priorizar es lo que **no** se tocó:
1. ~~`POST /scheduling/bookings/:id/cancel`~~ — **corregido**: reusa `assertPuedeActuarPorElPaciente`.
2. ~~`POST /scheduling/bookings/:id/reschedule`~~ — **corregido**, mismo método.
3. ~~`GET /scheduling/bookings/:id`~~ — **corregido**, con el criterio de `cargarParaOperar`.
4. `GET /scheduling/slots` — **no se corrigió a propósito**: es pregunta de producto, no defecto (§1.M1, nota sobre `R4`).
5. **Efecto colateral que sigue abierto:** una cancelación o reprogramación ilegítima no dejaba ningún aviso al dueño real. Ahora esas dos ya no ocurren, pero la pregunta de fondo sigue viva: **¿debería avisarse al titular cuando alguien opera su cita?** Hoy, si quien la cancela es el mostrador (legítimo), el aviso sí sale; lo que no hay es rastro de lectura (§4 de H1: ninguna lectura de `scheduling` escribe en `audit.data_access_log`, pese a devolver PHI).
6. **Dos huecos destapados leyendo, no ejercitados** (se declaran, no se afirman): `searchBookings` filtrando sólo por `resourceId` no comprueba de quién es esa agenda; y `operaCualquierAgenda` mira roles globales sin acotar por organización — es el comportamiento que `cargarParaOperar` ya tenía, no algo que el arreglo haya introducido.

---

## §6 — Kill-test respondido de nuevo, para cerrar

El kill-test de §0 **estaba** en rojo y **ahora está en verde**, verificado en runtime: cambiar el identificador de la URL por el de otro paciente devuelve `403`, y el titular sigue leyendo y cancelando la suya. Lo que no cambia es el resto del veredicto: las transiciones de estado ya estaban bien (§2), el dinero sigue a medio camino de la regla (`numeric`, no entero de la menor unidad; 4 juegos de moneda sin reconciliar, §3), y la disponibilidad entre organizaciones sigue abierta como decisión de producto (`R4`).

---

## §7 — El arreglo (2026-09-20, posterior a la medición)

| | |
|---|---|
| **Rama** | `marcelo/fix-authz-citas-ajenas`, desde `origin/dev` @ `33f17785` |
| **Commit** | `9ff1542d` — *fix(scheduling): una cita ajena ya no se lee, se cancela ni se reprograma* |
| **PR** | [mantra-core-health-api#447](https://github.com/mdavila-2001/mantra-core-health-api/pull/447) contra `dev` |
| **Diff** | 2 archivos, +175 líneas, 0 borradas: el servicio y su spec |

**Qué hace.** No inventa un control nuevo: reusa `assertPuedeActuarPorElPaciente`, que ya existía en el mismo servicio y ya usaban `placeHold`, la confirmación del hold, `searchBookings` y `enroll`. Es un no-op para quien opera la agenda, así que el mostrador sigue cancelando turnos ajenos. Para la lectura aplica el criterio de `cargarParaOperar` (titular o representante · quien opera cualquier agenda · quien atiende en ese recurso) reusando el `recurso` que la función ya consultaba, sin agregar una consulta.

**Cómo se verificó** (`evidencia/H3.FIX_reverificacion-contra-api-viva.txt`):

| Prueba | Resultado |
|---|---|
| Suite de `scheduling` con el arreglo | **483/483** (eran 476; 7 nuevas de autorización negativa) |
| Las mismas 7 pruebas **sin** el arreglo | **4 fallan** — las pruebas detectan el bug, no lo acompañan |
| `typecheck` · `lint` | exit 0 · exit 0 |
| API reconstruida, lecturas ajenas (`R1`, `R2`, `R3`) | **403 · 403 · 403** (antes 200 · 200 · 403) |
| API reconstruida, escrituras ajenas (`W1`, `W2`, `W3`) | **403 · 403 · 403** (antes 200 · 200 · 200) |
| Camino legítimo, misma cita y misma corrida | intruso **403**, titular **200** con `capacityReleased: true` |
| Transiciones ilegales, tras el arreglo | siguen en **422 `INVALID_STATE_TRANSITION`** |

**Dos resultados de esa corrida que no son del arreglo**, explicados en la propia evidencia para que nadie los lea como regresión: una cancelación del titular devolvió 422 por la **ventana de 24 h** (regla TJ-2 preexistente; la cita era de ese mismo día) y un `start` posterior devolvió 200 porque esa cita nunca llegó a cancelarse — expectativa encadenada mal en el arnés, `TEST_BUG`, no `PRODUCT_BUG`. El paso `verifyOwnerCancel`, sobre una cita a siete días vista, cierra el punto sin ambigüedad.
