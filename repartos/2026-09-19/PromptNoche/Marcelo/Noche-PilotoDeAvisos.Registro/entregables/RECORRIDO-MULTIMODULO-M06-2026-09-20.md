# H4 — El recorrido M-06 cruzando varios módulos, ejercitado

> **Consulta:** 2026-09-20T21:56–22:03 UTC · **Peldaño:** `VERIFIED` para los 7 pasos ejercitados y para ADV-08 (comportamiento observado en runtime, con persistencia comprobada desde una **conexión independiente** a la base); `DISCOVERED` para los 4 pasos que no tienen con qué correrse · **API:** construida desde `dev` @ `b122bd4d`, que ya incluye el arreglo de autorización del PR #447 · **Base:** la del `.env` del repo (Neon, `RLS_ENFORCE=false`).

**Kill-test del hito, respondido primero:** *"preguntá si el recorrido pasa; si nadie puede nombrar qué participante era un doble, el resultado no significa nada"*. **No hubo ni un solo doble.** Los 7 pasos que corrieron lo hicieron contra la API real y la base real; los otros 4 no corrieron y están marcados `AUSENTE`, cada uno con el motivo de por qué no hay contra qué correrlos. La tabla de §1 es la respuesta completa.

**Veredicto de una línea:** el recorrido **funciona de punta a punta en su tramo construido** — reservar, anotarse en espera, liberar el cupo, promover la espera, avisar la demora, y el paciente ve **2 avisos** en su bandeja. La atomicidad aguanta: reintentar una cancelación deja **un** solo efecto y dos retenciones simultáneas sobre el último cupo dejan **un** solo ganador. Lo que falla es el **rastro**: ninguna lectura de datos de paciente queda registrada, y el rastro de escrituras que sí existe **guarda el motivo de consulta en texto libre**.

---

## §0 — Dos cosas del entorno, antes de leer los resultados

| Qué | Por qué importa |
|---|---|
| **La API corrió en `:3010`, no en `:3000`.** Docker Desktop arrancó a las 17:50 y tomó el 3000 (`wslrelay` + `com.docker.backend`). Mi espera «por puerto abierto» dio un **falso positivo**: el puerto estaba abierto, pero lo servía Docker y la API no respondía | Clasificado `ENVIRONMENT` (regla 80.4). Si alguien repite esto y ve el puerto abierto pero nada contesta, es esto. **Esperar por `/health`, no por el puerto** |
| **El primer intento del paso 3 falló con 409** sobre un cupo que **mi propia corrida de H3** había dejado inservible unas horas antes | Clasificado `DATA`, no producto: con un cupo limpio, retener y confirmar dan 201 y 201 (diagnóstico pegado en la evidencia). El arnés ahora prueba hasta 6 cupos. La base es compartida y arrastra estado entre corridas |

---

## §1 — El recorrido, paso por paso, con participante declarado (H4.S1.M1 y H4.S1.M2)

Evidencia literal: `evidencia/H4.S1.M1-M2-M3_recorrido-y-adv08.txt`.

| # | Paso | Participante | Clase | Resultado | Qué se observó |
|---|---|---|---|---|---|
| 1 | Buscar médico disponible | API `scheduling` + `practice` | **REAL** | **PASS** | 19 recursos agendables |
| 2 | Ver horario y sede | API `scheduling` (cupos publicados) | **REAL** | **PASS** | cupos reales a 7 días vista |
| 3 | Reservar (retener → confirmar) | API `scheduling` + `clinical` + `profiles` | **REAL** | **PASS** | 201 y 201; nace la reserva |
| 4 | Sin cupo, entrar a la lista de espera | API `scheduling` (waitlist) | **REAL** | **PASS** | entrada creada con prioridad |
| 5 | Cupo liberado dispara el aviso de hueco | API `scheduling` + **worker interno** | **REAL** | **PASS** | `processed: 1` — la espera se promovió |
| 6 | Demora del profesional dispara el aviso | API `scheduling` (delay) + `messaging` | **REAL** | **PASS** | 200 sobre la cita |
| 7 | El paciente ve los avisos en su bandeja | API `messaging` (canal in-app) | **REAL** | **PASS** | **2 avisos** en la bandeja del paciente |
| 8 | Copia al chat de `SupportAdmin` | API `community` | **AUSENTE** | `NOT_RUN` | **403** al listar conversaciones; `SupportAdmin` no existe como cuenta (ya declarado en `TAREA-15` §2.2) |
| 9 | Correo del aviso | proveedor de correo | **AUSENTE** (el proveedor) / **REAL** (el encolado) | `NOT_RUN` (la entrega) | ver §3: el correo **sí sale** (16 `ND_SENT`), pero **ninguna entrega tiene `delivered_at`** |
| 10 | Datos de facturación de la consulta (3.6 del cliente) | ninguno | **AUSENTE** | `NOT_RUN` | `NOT_FOUND` desde H1 §7: no existe en el flujo de reserva |
| 11 | La misma cita desde el móvil | app Flutter | **AUSENTE** | `NOT_RUN` | la app declara los endpoints; no se localizó la pantalla que los consume (H1 §8) |

**7 participantes reales, 0 dobles, 4 ausentes.** Esa es la frase que el kill-test pide y que nadie puede reemplazar por «el recorrido pasa».

**Lo que el paso 7 demuestra, y conviene no minimizar:** el paciente terminó con dos avisos distintos en su bandeja — el del cupo liberado y el de la demora. Es el corazón del pedido del cliente (3.4 y 3.5) funcionando de verdad, no contra un doble.

---

## §2 — ADV-08: atomicidad, comprobada desde una conexión independiente (H4.S1.M3)

Las consultas no pasan por el `EntityManager` de la aplicación: son un cliente `pg` propio contra la misma base. Evidencia: `evidencia/H4.S1.M3_adv08-y-H4.S3.M1_auditoria.txt`.

### ADV-08a — Reintentar la misma operación no puede dejar dos efectos

| Vía HTTP | Desde la conexión independiente |
|---|---|
| Cancelar la cita: **200** · Cancelarla otra vez: **409 `CONFLICT`** | `booking_cancellations` para esa reserva: **1 fila, 1 id** |
| | `appointment_bookings`: **un** solo estado final, `row_version: 2` |

El reintento no duplicó la cancelación ni volvió a liberar el cupo. **PASS.**

### ADV-08b — Dos pacientes al último cupo, a la vez

Dos peticiones **simultáneas** (`Promise.all`, no secuenciales) reteniendo el mismo cupo de capacidad 1:

| Vía HTTP | Desde la conexión independiente |
|---|---|
| **201** a uno, **409** al otro | `remaining_capacity`: **0** — nunca negativa |
| exactamente **1** éxito | reservas vivas sobre ese cupo: **1 como máximo**, nunca 2 |

**PASS.** Y es un dato que matiza el hallazgo **H-1** que el `CLAUDE.md` de la raíz arrastra («la base no impide la doble reserva»): es cierto que **no hay** restricción en la base, pero el camino de retención **sí serializa** bajo concurrencia real. La protección existe en la aplicación, no en el esquema — que es exactamente la diferencia entre «no pasó» y «no puede pasar». Lo segundo sigue sin estar.

---

## §3 — Lo que el recorrido exige y no está (H4.S2)

### H4.S2.M1 — Proveedores externos pendientes

| Proveedor | Qué se observó | Qué acredita hoy | Qué falta |
|---|---|---|---|
| **Correo** | 16 entregas en `ND_SENT` con `sent_at`, despachadas por `WORKER_DISPATCHED`; **1 en `ND_FAILED`**; **0 con `delivered_at`** | Que el sistema **encola y despacha** el correo de verdad | Un proveedor que **confirme la entrega**. Hoy «enviado» es lo último que el sistema sabe |
| **Push** | ningún cliente conectado | nada | Aceptación externa pendiente (Q-21) |
| **Chat `SupportAdmin`** | 403 al listar conversaciones; la cuenta de empresa no existe | El chat existe como módulo | La cuenta/bot que escriba en él (`TAREA-15` punto 1) |
| **Móvil** | endpoints declarados en `api_endpoints.dart` | que la app conoce las rutas | La pantalla que las consuma |

### H4.S2.M2 — Pasos `NOT_RUN`, con motivo

| Paso | Motivo, en una línea |
|---|---|
| 8 · chat de soporte | la cuenta `SupportAdmin` no existe; el endpoint además responde 403 al paciente |
| 9 · entrega del correo | no hay proveedor que confirme entrega; el encolado sí se verificó (§3, arriba) |
| 10 · datos de facturación | no existe el punto donde capturarlos en el flujo de reserva |
| 11 · móvil | no se localizó pantalla que consuma los endpoints de agenda |

Ninguno se sustituyó por un doble para poder declararlo verde. Eso es lo que el `OUT` del hito prohíbe explícitamente.

### H4.S2.M3 — Correspondencia del recorrido **ejecutado** contra el documento del cliente

Actualiza la tabla de H2 §7 con lo que efectivamente corrió.

| # | Paso | Párrafo del cliente | Ejecutado |
|---|---|---|---|
| 1 | Buscar médico | `:104`, `:106` | **Sí**, real |
| 2 | Ver horario y sede | `:106`, `:248` | **Sí**, real |
| 3 | Reservar | `:106` (la retención previa es `AGREGADO`) | **Sí**, real |
| 4 | Lista de espera | `:107` (anotarse es `AGREGADO`) | **Sí**, real |
| 5 | Aviso de cupo liberado | `:107`, `:254` | **Sí**, real — con la salvedad del plazo: sale por barrido, no al desmarcar |
| 6 | Aviso de demora | `:108`, `:253` | **Sí**, real |
| 7 | El paciente ve el aviso | `:108`, `:253` | **Sí**, real (bandeja; la campana sigue sin existir) |
| 8 | Chat de soporte | `AGREGADO` (pedido interno) | No |
| 9 | Correo | `AGREGADO` (pedido interno) | Encolado sí, entregado no |
| 10 | Facturación (3.6) | `:109-111` | **No** — el cliente lo pide y no hay dónde |
| 11 | Móvil | `:104-106` | No |

**7 de 11 ejecutados. De los 4 que no, uno (el 10) es un pedido explícito del cliente sin implementación**; los otros tres dependen de piezas externas o de otro carril.

---

## §4 — El rastro (H4.S3)

### H4.S3.M1 — ¿Las lecturas de datos de paciente dejan rastro?

**No. Cero.** Y el rastro de escrituras que sí existe guarda contenido que no debería.

| Consulta (conexión independiente) | Resultado |
|---|---|
| Rastro de **escrituras** de las dos citas (`audit.appointment_bookings_history`) | **2 revisiones**: una transición de estado y una demora, con **2 autores distintos** registrados por identificador | 
| Claves que guarda ese rastro | `actorKind`, `bookingId`, `delayMinutes`, `fromStateConceptId`, `toStateConceptId` y **`reasonText`** |
| Rastro de **lecturas** de esas citas y esos pacientes (`audit.data_access_log`) | **0 filas** — y el recorrido las leyó seis veces o más |
| Control positivo: ¿la tabla se usa? | 16 filas en total… **todas de semilla** (`DATA_ACCESS_LOG_01` a `08`, dos cada una). Ningún módulo escribió ahí durante el recorrido |

**Dos hallazgos, no uno:**

1. **`FAIL` — las lecturas no dejan rastro.** La regla 90.2.7 pide rastro de todo acceso a datos clínicos, «incluidas las lecturas». `GET /scheduling/bookings/:id` devuelve perfil de paciente, horario y motivo de consulta, y no registra nada. Ya se sospechaba por lectura en H3; ahora está medido contra la base, y el control positivo descarta que sea un problema de mi consulta: la tabla existe y sólo tiene filas sembradas.
2. **`FAIL` — el rastro de escrituras guarda el motivo de consulta.** `reasonText` (34 caracteres en esta corrida) es texto libre que escribe el paciente para decir **por qué** consulta. Está guardado en claro dentro de `data_snapshot`. El hito pide expresamente que «ese rastro **no contiene** el contenido clínico». Guardar el motivo en la auditoría no es lo mismo que guardarlo en la cita: multiplica las copias y el rastro suele tener otra política de acceso y de retención.

### H4.S3.M2 — ¿Hay datos de personas en logs o URLs?

**No.** Evidencia: `evidencia/H4.S3.M2_phi-en-logs-y-urls.txt`, sobre las 1 976 líneas de log que produjo la corrida.

| Se buscó | Apariciones |
|---|---|
| Los 6 fragmentos de los nombres sintéticos | **0** |
| Los correos de la corrida | **0** |
| Los documentos sintéticos | **0** |
| Los teléfonos | **0** |
| **El motivo de consulta** (texto libre) y la clave `reasonText` | **0** |

Control positivo (para descartar que el log fuera ciego): 23 líneas del recorrido, con 11 operaciones distintas registradas (`scheduling.hold.place`, `scheduling.booking.confirm`, `scheduling.waitlist.promote`, `scheduling.booking.delay`…). Una línea literal:

```json
{"level":30,"context":"SchedulingBookingsService","operation":"scheduling.booking.cancel","bookingId":"3a2c5fbd-…","isNoShow":false,"msg":"Cancelling booking"}
```

Identificador opaco y nada más: exactamente lo que la regla 90.2.1 pide.

**URLs:** sólo uuid v4 y fechas ISO. El único matiz honesto es que `patientProfileId` y `profileId` viajan en el query string — son identificadores opacos, no datos identificatorios, así que cumplen la regla 90.2.2, pero quedan en historiales y logs de acceso: si mañana se quiere endurecer, ese es el punto.

**PASS**, con el matiz declarado.

---

## §5 — Handoff de H4

**A Justin:** ningún paso falló por tu relación — `agenda → mensajería` entregó de verdad: 4 solicitudes in-app y 8 de correo en la corrida, con los tres tipos de aviso (`NOTICE_SLOT_RELEASED`, `NOTICE_PRACTITIONER_DELAY`, `NOTICE_BOOKING_STATE_CHANGED`) apareciendo en base. Lo que sí bloquea el paso 8 es que `SupportAdmin` no existe como cuenta, que es la relación que todavía no empezó.

**A Ender:** dos decisiones de contrato que el recorrido tocó. (1) **El aviso de cupo liberado sale por barrido del worker, no al cancelar** — el cliente dice «de manera AUTOMATICA» y no fija plazo; medido, la promoción ocurrió cuando el worker la pidió. (2) **El correo se marca `ND_SENT` sin que nadie confirme entrega** (0 de 16 con `delivered_at`) y **1 quedó en `ND_FAILED`**: el contrato del aviso dice que un fallo se descarta, así que ese correo perdido no deja más rastro que su fila. Las dos alimentan Q-06.

**A Pablo:** la lista de proveedores externos pendientes de §3.M1, y **dos hallazgos de auditoría que no son de mi recorrido sino del sistema**: las lecturas de datos de paciente no escriben en `audit.data_access_log` (que sólo tiene filas de semilla), y el rastro de escrituras guarda el motivo de consulta en claro. Ninguno lo toqué.
