# Preguntas al equipo — todo lo que bloquea el carril B

- **De:** Justin · **Fecha:** 2026-09-20 · **Turno origen:** noche del 2026-09-19
- **Carril:** B — *La relación `agenda → mensajería`: dobles, integración y regresión final*
- **Corte de trabajo:** `5d5007fbdb7916b124010bbfbb560b7bb3aabc06` (`dev`)
- **Avance:** 40 / 53 microtareas en `HECHO` (75 %, calculado). **Las 13 que faltan dependen de lo
  que se conteste acá.**

**Enlaces:**
[PR #443 · API](https://github.com/mdavila-2001/mantra-core-health-api/pull/443) ·
[PR #4 · reparto](https://github.com/PabloArauzCaballero/AlovidaPromptManager/pull/4) ·
reporte completo en `mantra-core-health-api/docs/trabajo/2026-09-19-relacion-agenda-mensajeria/REPORTE.md` ·
evidencia ejecutada en `…/evidencia/` (19 archivos)

---

## Cómo leer esto

Cada pregunta trae **cinco cosas**, en este orden:

1. **Qué bloquea** — las microtareas concretas, por ID.
2. **Qué ya verifiqué** — con ruta, línea y salida literal, para que no repitas trabajo.
3. **La pregunta**, en una frase.
4. **Las opciones**, con su costo real.
5. **Qué pasa si nadie contesta** — porque «queda pendiente» no es una consecuencia, es una excusa.

**Ninguna pregunta te pide investigar.** O sabés la respuesta, o hay que decidirla. Si una te parece
que ya está contestada en algún lado, decime dónde y la cierro.

**Contestá en línea**, debajo de cada pregunta. No hace falta que contestes todas: cada una es
independiente salvo donde digo lo contrario.

---

## Resumen — ordenado por cuánto destraba

| # | Pregunta | Para | Destraba | Urgencia |
|---|---|---|---|---|
| 1 | ¿Producción se siembra con el mismo paquete que desarrollo? | **Pablo** | Nada del carril — **puede ser un incidente en curso** | 🔴 hoy |
| 2 | Q-06: ¿el aviso fallido se descarta o es durable? | **Negocio** | 3 µtareas · todo H4.S3 | 🔴 bloquea un hito entero |
| 3 | ¿Dónde está el artefacto de contrato versionado? | **Ender** | 3 µtareas · H2.S1.M1, H2.S3.M1, H2.S2.M1 | 🟠 |
| 4 | HALL-03: ¿va índice único en `debounce_key`, y sobre qué columnas? | **Itzan** + modelo | Es **el defecto abierto** del carril | 🔴 |
| 5 | Q-12 / Q-13: ¿qué política de idempotencia y reintentos? | **Negocio** | Cierra AMB-01; sin esto H4.S1.M2 no tiene oráculo | 🟠 |
| 6 | AMB-02: ¿«rebotada» debe avisar por chat? | **Ender** | Semántica del contrato | 🟡 |
| 7 | AMB-03: ¿es válido un resultado sin campos de correo? | **Ender** | Semántica del contrato | 🟡 |
| 8 | ¿`skippedReason` pasa a catálogo cerrado de 5 textos? | **Ender** | Lo que el validador puede exigir | 🟠 |
| 9 | ¿Qué tabla materializa la conversación de `SupportAdmin`? | Quien lo sepa | 1 µtarea · H3.S2.M3 | 🟡 |
| 10 | HALL-06: ¿se arregla `rebuild_stack.py` o se retira? | **Pablo** | La recuperación de **todos** | 🟠 |
| 11 | HALL-07: ¿el patch v4221 sale del init? | **Pablo** | CI y todo rebuild limpio | 🟠 |
| 12 | ¿Corrijo los 9 `lint` ajenos para desbloquear el merge? | **Coordinación** | 1 µtarea · H6.S1.M1 · y el merge del PR | 🟠 |
| 13 | ¿El corte fue `5d5007f` o `32ae939`? | **Pablo** | Confirma DEC-01 | 🟡 |
| 14 | ¿Cómo se prueba una salida real sin mandarle nada a nadie? | **Coordinación** | 1 µtarea · H5.S1.M2 | 🟡 |
| 15 | ¿El E2E de esta relación es del carril B? | **Coordinación** | 2 µtareas · H6.S1.M3/M4 | 🟡 |
| 16 | ¿Quién consolida los checks A y C de la semana? | **Todo el equipo** | 2 µtareas · H6.S3 | 🟠 |
| 17 | HALL-05: ¿quién actualiza `CLAUDE.md`? | **Coordinación** | Evita que el próximo se equivoque igual que yo | 🟠 |

**Las 13 microtareas pendientes, por dependencia:**

```
Q-06 (pregunta 2) ─────────────► H4.S3.M1, H4.S3.M2, H4.S3.M3
Contrato de Ender (pregunta 3) ► H2.S1.M1, H2.S3.M1, H2.S2.M1
Tabla del chat (pregunta 9) ───► H3.S2.M3
Lint ajeno (pregunta 12) ──────► H6.S1.M1
Entorno de salida (pregunta 14) ► H5.S1.M2
Dueño del E2E (pregunta 15) ───► H6.S1.M3, H6.S1.M4
Checks A y C (pregunta 16) ────► H6.S3.M1, H6.S3.M2
```

---

# 1 · ¿Producción se siembra con el mismo paquete de seeds que desarrollo?

**Para:** Pablo
**Bloquea:** nada del carril. **Pero si la respuesta es «sí, con una revisión anterior a
v4.0.11», hay un incidente en producción ahora mismo y nadie lo sabe.**

## El contexto

Anoche, con el paquete de seeds que tenía mi base —una revisión anterior a `2.4.0-v4.0.11`— la
relación `agenda → mensajería` **no entregaba ni un solo aviso**. Los cuatro avisos de agenda
—cupo liberado, demora del profesional, recordatorio de turno y cambio de estado de la cita— eran
**no-operativos**.

Y lo más grave: **fallaba en silencio.**

## Qué verifiqué, ejecutando

**Capa 1 — el id del canal no coincidía.**

```text
[H3.S1.M1] canal IN_APP en base: ed1b78a4-4482-5bed-b9f6-5e05c8f1a60f
           el que direcciona el adaptador: d0240273-f75e-5405-9db2-8dd6769eb263
```

`MessagingAgendaNoticeAdapter` usa literalmente `MESSAGING_SEED.inAppChannelId` al crear la
solicitud. Ese id lo **deriva el backend** (`deterministicId('seed:message-channel:in-app')`). El
paquete viejo sembraba el canal con **otro** uuid. Resultado:

```json
{"level":50,"context":"MessagingAgendaNoticeAdapter","operation":"scheduling.notice.emit",
 "err":{"type":"ResourceNotFoundException","message":"Canal no encontrado"}}
```

**Capa 2 — arreglar el id no alcanzaba.** Repetí la misma llamada cambiando **sólo** el `channelId`
por el que la base tenía:

```text
[H3.S1.M1-bis] con id derivado: Canal no encontrado
               con id de la base: El canal no está activo
```

`notifications.service.ts:132` compara `channel.stateConceptId !== CONCEPTS.STATE_ACTIVE`. El canal
estaba **activo por código** (`code='ACTIVE'`) y **no lo estaba por uuid**.

**Capa 3 — la causa de las dos.** `terminology.catalog_concepts` tenía dos filas con `code='ACTIVE'`:
`38a1d301-…` (la que deriva el backend) y `d0f53ea3-…` (la que sembraba el paquete), y las filas de
`message_channels` apuntaban a la del paquete.

**Y `emit` se lo tragaba todo.** El puerto promete no lanzar (`agenda-notice.port.ts:122-126`), así
que el fallo volvía como:

```json
{"delivered":false,"skippedReason":"La emisión del aviso falló; la operación no se revierte"}
```

**Ese texto es indistinguible de una caída transitoria de red.** Nadie lo habría investigado.

## Qué resultó ser

**No es un defecto del producto.** El paquete de seeds actual (`seed_revision: 2.4.0-v4.0.11`) ya
trae el canal correcto, y el propio generador documenta el bug y su arreglo:

> `salud-db/gen_seeds.py:309` — *«v4.0.11 (bis) — el canal IN_APP tiene el mismo bug que tenía
> EMAIL, una fila con code IN_APP e id PROPIO; la app busca el suyo POR ID, no lo encuentra…»*

> `salud-db/gen_seeds.py:1016-1018` — *«Los DOS tríos del backend (messaging-seed.service.ts):
> correo e in-app, mismos [ids]… Sin el espejo de IN_APP la campana quedaba muerta.»*

Verificado en el paquete en disco:

```text
EMAIL   96be0595-d496-5457-95ac-e8c77f3da292  state= 38a1d301-f40d-5b17-a695-5e6d605f8b19
IN_APP  d0240273-f75e-5405-9db2-8dd6769eb263  state= 38a1d301-f40d-5b17-a695-5e6d605f8b19
```

Y tras rehacer el stack con ese paquete, la relación **entrega**:

```text
[H3.S1.M2] resultado real: {"delivered":true,
  "notificationRequestId":"781499ce-4cb8-49f9-be6b-579662589d65",
  "inAppNotificationId":"7a91758e-b0bb-4b39-a6ca-856058b0b5c2",
  "chatDelivered":true}
```

Confirmado además por una prueba que yo no escribí:
`test/integration/fx3-agenda-respiro-y-avisos.int-spec.ts` —la regresión del propio proyecto para
estos avisos— pasó de dar `Expected 4 / Received 0` a **10/10 en verde**.

## La pregunta

> **¿Con qué revisión del paquete de seeds se sembró producción, y en qué fecha?**

## Cómo verificarlo en un minuto

```sql
select id, code, state_concept_id
  from messaging.message_channels
 where code in ('IN_APP','EMAIL');
```

**Si sale esto, está sano:**

```
IN_APP  d0240273-f75e-5405-9db2-8dd6769eb263  38a1d301-f40d-5b17-a695-5e6d605f8b19
EMAIL   96be0595-d496-5457-95ac-e8c77f3da292  38a1d301-f40d-5b17-a695-5e6d605f8b19
```

**Cualquier otro uuid en cualquiera de las dos columnas = los avisos de agenda no salen.**

## Qué pasa si nadie contesta

Si producción está sembrada con el paquete viejo, hoy mismo hay pacientes que no se están enterando
de que les cancelaron o movieron el turno, y **no hay ningún error en los logs que lo delate** —
sólo `skippedReason` genéricos que parecen fallos de red. No hay alerta posible sobre eso.

**No lo verifiqué yo** porque no tengo acceso a producción ni me corresponde tenerlo.

---

# 2 · Q-06 — ¿un aviso que falla se descarta, o tiene que sobrevivir?

**Para:** Negocio (Pablo lo escala)
**Bloquea:** `H4.S3.M1`, `H4.S3.M2`, `H4.S3.M3` — **el hito de recuperación completo**, 3 de las 13
microtareas pendientes.

## El contexto

Hay una contradicción **explícita** entre dos fuentes del proyecto, y no se puede cumplir las dos.

**Fuente 1 — el puerto**, `src/modules/scheduling/ports/agenda-notice.port.ts:19-22`:

> *«**Emitir no puede romper la agenda.** Un aviso que falla se registra y se **descarta**; jamás
> revierte la reserva, la cancelación ni la promoción que lo originó. Por eso los servicios lo
> invocan *después* de confirmar su transacción y nunca dentro de ella.»*

**Fuente 2 — el metaprompt del piloto**, ADV-09: exige **durabilidad**. Que la intención de avisar
quede registrada **en la misma transacción del negocio**, y que un worker la reintente después hasta
lograrlo o agotar la política.

## Por qué son incompatibles

No es un matiz de redacción. Son dos arquitecturas distintas:

| | El puerto dice | El metaprompt exige |
|---|---|---|
| Dónde se registra la intención | Después del commit del negocio, fuera de la transacción | **Dentro** de la transacción del negocio |
| Qué pasa si falla | Se registra en el log y se descarta | Se reintenta hasta agotar la política |
| Qué se garantiza | Que la agenda nunca se rompe por un aviso | Que el aviso **sale** |
| Patrón | Llamada directa post-commit | **Outbox** |

Hoy **gana la primera**, y tiene una consecuencia que conviene mirar de frente: **el fallo terminal
de un aviso es invisible por diseño.** Vuelve como `skippedReason` y nadie se entera.

## La pregunta

> **Cuando un aviso de agenda no se puede emitir, ¿se pierde, o el sistema tiene que garantizar que
> en algún momento salga?**

## Las opciones

### Opción A — se descarta (lo que hace hoy)

- **Qué implica:** confirmar el puerto tal como está. `H4.S3` pasa a `DESCARTADO` con motivo escrito,
  no a `HECHO`.
- **Costo técnico:** cero. Ya está implementado.
- **Costo de negocio:** hay que asumir que **un paciente puede no enterarse de que le cancelaron el
  turno**, y que nadie va a saber que pasó. Si eso es aceptable, se escribe y se cierra.

### Opción B — es durable

- **Qué implica:** patrón outbox. La intención se persiste en la misma transacción del negocio, y un
  worker la toma y reintenta.
- **Costo técnico:** cambio de modelo (tabla de outbox para avisos de agenda, o reusar
  `messaging.outbox_messages`) **más** los cuatro puntos de emisión
  (`scheduling-agenda-notices.service.ts`, `scheduling-bookings.service.ts`,
  `scheduling-catalog.service.ts`, `scheduling-delay.service.ts`), **más** un worker.
- **Nota:** `messaging.outbox_messages` **ya existe y ya tiene** su índice único de idempotencia
  (`uq_outbox_messages_idempotency_key`). Puede que esta opción sea más barata de lo que parece.

### Opción C — híbrida

Durable sólo para los avisos que el negocio considere críticos (por ejemplo
`BOOKING_STATE_CHANGED`, que le dice al paciente que su cita cambió) y descarte para los demás
(recordatorio de 24 h, que se vuelve a intentar solo en la próxima corrida del worker).

- **Costo:** el del B, pero acotado a un `kind`.
- **Requiere decidir:** cuáles son críticos. Eso es negocio, no técnica.

## Qué pasa si nadie contesta

`H4.S3` queda `BLOQUEADO` indefinidamente — un hito entero del carril sin poder cerrar. **No lo voy
a resolver por conveniencia**: elegir entre A, B y C es una decisión de negocio con consecuencias
para pacientes, y la regla 00 §1.7 prohíbe resolver una ambigüedad así.

Y mientras tanto queda una deuda concreta: **hoy, si un aviso falla definitivamente, nadie se
entera.** Eso es cierto con cualquiera de las tres respuestas, pero sólo la B y la C lo arreglan.

---

# 3 · ¿Dónde está el artefacto de contrato versionado?

**Para:** Ender
**Bloquea:** `H2.S1.M1` y `H2.S3.M1` (ambas `BLOQUEADO`), y deja `H2.S2.M1` en `A MEDIAS`. Son 3 de
las 13 pendientes.

## Qué verifiqué

Al corte `5d5007f` **no existe** ningún artefacto de contrato versionado de esta relación. Busqué
de tres formas:

```bash
$ git ls-tree -r --name-only HEAD | grep -iE 'contract|contrato'
# los aciertos son del módulo 31 (integration_contracts) y de ERP — otra cosa

$ ls contracts/ docs/contracts/
ls: cannot access 'contracts': No such file or directory
ls: cannot access 'docs/contracts': No such file or directory

$ find . -iname '*agenda-notice*contract*' -o -iname '*contract*agenda*'
# vacío
```

Evidencia: `evidencia/h2s1m1-contrato-ausente.txt`.

## Qué hice mientras tanto

Fijé el **puerto como contrato de facto**, por el sha1 de su blob:

```bash
$ git rev-parse HEAD:src/modules/scheduling/ports/agenda-notice.port.ts
4e262747735005c16262a907de3caf09a1268923
```

Mi doble estricto (`test/doubles/strict-agenda-notice-port.double.ts`) valida contra eso y está
marcado **`PROVISIONAL`**.

## Las preguntas

> **3.a — ¿El artefacto existe y no lo encontré, o todavía no está publicado?**

Si existe, decime la ruta y lo referencio hoy mismo.

> **3.b — Si no está: ¿cuándo, y con qué forma?**

Necesito saber **qué se referencia**, porque el prompt exige fijar *versiones, no ramas*:

- ¿Un archivo en el repo? ¿Con qué nombre y dónde?
- ¿Un hash del contenido, como el sha1 que estoy usando?
- ¿Un número de versión semántica dentro del archivo?

Cualquiera sirve. Lo que no sirve es «la rama de Ender», porque una rama se mueve.

> **3.c — ¿Va a haber más de una versión del contrato en este piloto?**

`H2.S3` pide una **matriz de compatibilidad** entre las versiones que el producto va a seguir
usando. Hoy hay **una sola**, y una matriz de una fila no es una matriz. Inventar versiones para
llenarla sería peor que no tenerla.

- Si va a haber más de una → `H2.S3` espera.
- Si no → `H2.S3` se `DESCARTA` con motivo, y lo escribo.

## Qué pasa si nadie contesta

`H2.S1.M1` y `H2.S3.M1` quedan `BLOQUEADO`. Y hay un riesgo silencioso: **el doble del proveedor
está fijado contra el commit, no contra una versión publicada**, así que cualquier cambio en
`NotificationsService` lo desincroniza **sin que nada lo señale**. Es la deuda de `H2.S2.M1`.

---

# 4 · HALL-03 — ¿va un índice único en `debounce_key`, y sobre qué columnas?

**Para:** Itzan (composición) + quien decida el modelo
**Bloquea:** no bloquea ninguna microtarea — **es el defecto que queda abierto del carril**, y el
único hallazgo de producto que sobrevivió al turno.

## Qué verifiqué, ejecutando

```text
[H4.S2.M1] filas creadas con la misma clave de rebote en paralelo: 2 · resultados: [null,null]
```

**Dos `emit()` simultáneos con la misma `debounceKey` crean DOS filas**, y las dos se reportan como
exitosas (`skippedReason` nulo en ambas). Medido **6 veces**:

| Corrida | Filas |
|---|---|
| 1 | 1 |
| 2 | **2** |
| 3 | **2** |
| 4 | **2** |
| 5 | **2** |
| 6 | **2** |

**5 de 6.** No es intermitente. La corrida que dio 1 no contradice nada: es el caso en que una
transacción alcanzó a cometer antes de que la otra hiciera su `findOne`.

Evidencia: `evidencia/h4-carrera-medida.txt`.

## La causa, con el código

**No hay índice.** Ni único ni común:

```sql
select indexdef from pg_indexes
 where schemaname='messaging' and tablename='notification_requests'
   and indexdef ilike '%debounce_key%';
-- 0 filas
```

Confirmado también contra el DDL: `debounce_key` aparece en
`database/SQL/35_messaging/02_tables.sql:269` como `varchar`, y **no aparece en ningún
`CREATE INDEX`** de `35_messaging/04_indexes.sql`.

**Y la deduplicación es un read-then-write.** `notifications.service.ts:167-181`:

```ts
if (dto.debounceKey) {
  const live = await this.notificationsRepo.findLiveRequestByDebounceKey(   // ← LEE
    tx, dto.debounceKey, [...LIVE_REQUEST_STATES]);
  if (live) {
    return { id: live.id, statusConceptId: live.statusConceptId,
             suppressed: false, debounced: true };
  }
}
// …más abajo, el insert, SIN condición                                      // ← ESCRIBE
```

Bajo READ COMMITTED —el default de Postgres— dos transacciones concurrentes ven ambas «no hay» e
insertan las dos. Es exactamente el `if` previo que la **regla 96.3.2** prohíbe: *«la precondición
va en la escritura, no en un `if` previo»*.

## Por qué importa más de lo que parece

El puerto dice para qué existe el rebote, en `agenda-notice.port.ts:74-78`:

> *«Clave de rebote: dos avisos con la misma clave no se duplican mientras el primero siga vivo. Es
> lo que **impide que un worker que reintenta un lote** llene la campana del paciente con el mismo
> recordatorio.»*

**Un worker que reintenta un lote es, por definición, el escenario concurrente.** El rebote falla
justo en el caso para el que fue escrito.

## El patrón correcto ya existe, a dos tablas de distancia

En el **mismo esquema**, `database/SQL/35_messaging/04_indexes.sql`:

| Tabla | Índice | Línea |
|---|---|---|
| `messaging.outbox_messages` | `uq_outbox_messages_idempotency_key` UNIQUE | :15 |
| `messaging.queued_jobs` | `uq_queued_jobs_dedupe_key` UNIQUE | :63 |
| **`messaging.notification_requests`** | **ninguno sobre `debounce_key`** | — |

## La pregunta

> **¿Se agrega `UNIQUE` sobre `debounce_key`, y sobre qué columnas exactamente?**

Lo que hay que decidir no es «si» —eso está claro— sino **el alcance de la clave**, y ahí hay tres
candidatos con consecuencias distintas:

### Candidato A — `(debounce_key)` a secas

- **Rompe el sufijo `:email`.** Hoy el adaptador namespacea la clave del correo
  (`messaging-agenda-notice.adapter.ts:63`, constante `REBOTE_CORREO`) precisamente porque
  `findLiveRequestByDebounceKey` **no filtra por canal**. Con un único total sobre la clave, la
  solicitud de correo chocaría contra la del in-app.
- **Veredicto:** no, salvo que se quite el sufijo a la vez.

### Candidato B — `(channel_id, debounce_key)`

- Es lo que la intención describe: «dos avisos iguales colapsan **dentro de su canal**».
- **Haría innecesario el sufijo `:email`**, que es un parche sobre este mismo defecto. Menos deuda.
- **Requiere** revisar el adaptador para quitar el sufijo, o dejarlo (inocuo pero redundante).

### Candidato C — parcial, sólo sobre los estados vivos

- El puerto dice «mientras el primero siga vivo». Un único **total** impediría reusar la clave
  después de que el aviso se entregó o caducó.
- Sería algo como:
  `CREATE UNIQUE INDEX … ON notification_requests (channel_id, debounce_key) WHERE status_concept_id IN (<vivos>)`
- **Ojo:** el predicado de un índice parcial debe ser **inmutable**. Los estados vivos son
  `*_concept_id` (uuid), así que habría que escribirlos como literales — igual que ya se hizo en
  `ux_authentication_credentials_live_password_subject` en v4.0.9. Hay precedente.

**Mi lectura, que no es una decisión:** la **C sobre `(channel_id, debounce_key)`** es la que
describe el puerto y la que haría desaparecer un parche. Pero esto es modelo —sale de los `.puml`,
fuera de este repo— y no lo toco.

## Bonus: con el único puesto, el código casi no cambia

El `INSERT` daría `23505` (violación de único) y el `catch` puede traducirlo a `debounced: true` —
que es **exactamente** lo que `createRequest` ya devuelve por el otro camino. La precondición pasa a
estar en la escritura sin cambiar el contrato.

## Qué pasa si nadie contesta

La deduplicación sigue fallando bajo concurrencia y **nadie lo va a notar**, porque las dos filas se
reportan como exitosas. El síntoma que llegaría es «un paciente recibió el recordatorio dos veces»,
y se diagnosticaría como problema del worker, no de la base.

---

# 5 · Q-12 / Q-13 — ¿qué política de idempotencia y de reintentos?

**Para:** Negocio
**Cierra:** AMB-01. Sin esto, `H4.S1.M2` está `HECHO` pero **describiendo** el comportamiento, no
validándolo.

## Qué verifiqué, sin declararlo correcto

Si llega la **misma `debounceKey` con un payload distinto**, esto es lo que pasa:

```sql
-- tras dos emit() con la misma clave y distinto subject
select payload_json->>'subject' from messaging.notification_requests where debounce_key = $1;
-- 1 fila: el subject del PRIMERO
```

**Gana el primero. El segundo contenido no se persiste y nadie se entera:** no hay error, no hay
excepción, no hay campo en el resultado que lo señale. El llamador cree que su aviso salió.

Lo registré como comportamiento **observado**, no como correcto, porque el contrato no lo define.

## Las preguntas

> **5.a — ¿Es eso lo que se quiere?**

Opciones:

| | Qué implica |
|---|---|
| **Gana el primero** (hoy) | Confirmar y documentar. El llamador no puede corregir un aviso ya encolado |
| **Gana el último** | El segundo `emit` actualiza el contenido de la solicitud viva |
| **Rechaza** | Misma clave con contenido distinto es un error del llamador: `409` o equivalente |

> **5.b — ¿Cuál es la política de reintentos?**

**No hay ninguna declarada en ninguna fuente del proyecto.** No la inventé —la regla 00 §1.1 lo
prohíbe— así que el punto quedó sin oráculo. Hace falta:

- **Cuántos intentos** antes de darse por vencido.
- **Con qué espera** entre uno y otro (fija, exponencial, con jitter).
- **Qué pasa al agotarlos**: ¿se descarta? ¿se marca la solicitud como fallida? ¿alguien se entera?
  (esto último se cruza con la pregunta 2).

## Qué pasa si nadie contesta

El laboratorio **no puede afirmar que la idempotencia sea correcta**, sólo describir lo que hace. Y
`H4.S3.M3` —«hacer visible el fallo terminal»— no tiene criterio: no se sabe cuándo un fallo es
terminal si no está definido cuántos intentos hay.

---

# 6 · AMB-02 — «suprimida» avisa por chat, «rebotada» no. ¿A propósito?

**Para:** Ender
**Bloquea:** nada, pero es semántica del contrato que hoy no está escrita en ningún lado.

## Qué verifiqué, ejecutando

Dos caminos que se parecen mucho se comportan distinto:

| Camino | ¿intenta correo? | ¿intenta chat? | Dónde |
|---|---|---|---|
| **Suprimida** por preferencia del destinatario | **sí** | **sí** | `messaging-agenda-notice.adapter.ts:223-234` |
| **Rebotada** (ya había una viva) | **sí** | **no** | `:236-245` |

Los dos casos están cubiertos por pruebas que pasan; no es una suposición.

## Por qué me llamó la atención

El comentario del adaptador explica bien por qué el camino «suprimida» **sí** intenta los otros
canales:

> *«La preferencia se guarda por (usuario, canal, categoría): que la campana esté silenciada no dice
> nada del correo ni del chat. Por eso este camino igualmente los intenta en vez de cortar la
> emisión entera.»*

Pero **no hay comentario equivalente** que explique por qué el camino «rebotada» sí intenta el correo
y no el chat. Puede ser deliberado —«si ya hay un aviso vivo, el chat tampoco hace falta»— o puede
ser un olvido al escribir el segundo camino.

## La pregunta

> **¿La asimetría es deliberada? Si lo es, ¿cuál es la regla, para que el validador pueda exigirla?**

## Qué pasa si nadie contesta

Queda una diferencia de comportamiento no documentada entre dos caminos parecidos. El día que
alguien «arregle» la asimetría por prolijidad, puede estar rompiendo una decisión intencional que
nadie escribió.

---

# 7 · AMB-03 — ¿es válido un resultado sin ningún campo de correo?

**Para:** Ender

## Qué verifiqué, ejecutando

`emit` puede devolver un resultado **sin `emailRequestId` ni `emailSkippedReason`**:

```text
[H3.S2.M2][NOT_RUN] el correo no se evaluó: el in-app falló antes.
  resultado: {"delivered":false,"skippedReason":"La emisión del aviso falló; la operación no se revierte"}
```

Pasa cuando el in-app falla **antes** de llegar al `try` del correo
(`messaging-agenda-notice.adapter.ts:342`).

## Por qué es un problema de contrato, no de código

El problema es de **lectura**. Hay dos situaciones distintas que producen la misma salida:

| Situación | Qué debería significar | Qué devuelve hoy |
|---|---|---|
| El aviso no correspondía por correo | «no aplica» | nada en el eje del correo |
| El correo **ni se llegó a evaluar** | «no sé» | nada en el eje del correo |

**Leer esa ausencia como «no hacía falta correo» sería falso**, y es la clase de confusión que dejó
a HALL-02 invisible.

## La pregunta

> **¿El contrato admite ese resultado, o `emit` debería devolver siempre algo en el eje del correo?**

Si la respuesta es que debería devolver algo, hace falta un motivo nuevo tipo
`emailSkippedReason: 'No se evaluó: el canal principal falló antes'` — que sería un sexto texto del
catálogo (ver pregunta 8).

---

# 8 · ¿`skippedReason` pasa a catálogo cerrado?

**Para:** Ender
**Impacto:** define qué puede exigir el validador, y es una de las cosas que más me costó anoche.

## Qué verifiqué

El adaptador produce hoy **exactamente cinco** textos, y son **prosa libre** — strings escritos en
el código, sin constante ni enum:

| # | Texto literal | Dónde | `delivered` | ¿trae `notificationRequestId`? |
|---|---|---|---|---|
| 1 | `El destinatario no tiene cuenta de portal` | `:189` | `false` | **no** |
| 2 | `suppressionReason` ?? `El destinatario no acepta este aviso por el canal in-app` | `:228` | `false` | sí |
| 3 | `Ya había un aviso igual sin entregar` | `:241` | `false` | sí |
| 4 | `La entrega no produjo bandeja in-app` | `:267` | `false` | sí |
| 5 | `La emisión del aviso falló; la operación no se revierte` | `:153` | `false` | **no** |

Y cuatro más en el eje del correo: `La cuenta no declaró correo`, `…no acepta este aviso por
correo`, `Ya había un correo igual sin enviar`, `No se pudo encolar el correo`.

**Ojo con el #2:** empieza con `request.suppressionReason ??`, o sea que **el texto puede venir de
mensajería** y no ser ninguno de los cinco. Es un catálogo abierto de hecho.

## La pregunta

> **¿Se fija ese conjunto como catálogo cerrado en el contrato —con códigos estables, no prosa—?**

## Por qué lo pido (y por qué no es cosmético)

1. **El doble estricto no puede validar el motivo.** Hoy acepta cualquier string, porque no tiene
   contra qué contrastarlo. Un `skippedReason` nuevo que aparezca por un camino no previsto se ve
   **idéntico** a uno conocido.
2. **Es exactamente lo que dejó a HALL-02 invisible.** El aviso fallaba con
   `La emisión del aviso falló; la operación no se revierte` — el motivo #5, el genérico del `catch`.
   Si ese caso tuviera un código propio y distinguible (`CHANNEL_NOT_FOUND` vs `CHANNEL_INACTIVE` vs
   `UNEXPECTED`), el problema se habría visto el primer día.
3. **El consumidor no puede reaccionar distinto.** «El destinatario no tiene cuenta de portal» es
   accionable (invitarlo al portal); «la emisión falló» es un incidente. Hoy los dos llegan como
   texto y el llamador no los distingue sin comparar strings.

**Mi sugerencia, que es sólo eso:** un código estable por motivo, y el texto como `display`. El
proyecto ya hace exactamente eso con los conceptos (`*_concept_id` + `display`), así que hay patrón.

---

# 9 · ¿Qué tabla materializa la conversación de `SupportAdmin`?

**Para:** quien lo sepa (¿Marcelo? ¿quien construyó el chat?)
**Bloquea:** `H3.S2.M3`, hoy `A MEDIAS`.

## Qué verifiqué

El aviso **llega al chat**: `chatDelivered: true`, contra el adaptador real
(`SupportAdminNoticeAdapter`), no contra un doble. Eso está en la salida pegada.

**Pero eso es un booleano.** La ficha de la relación (`H1-ficha-relacion.md` §M3) exige tres cosas
para poder decir que el chat entregó, y no comprobé ninguna:

1. Que **exista la conversación**.
2. Que el destinatario sea **miembro** de ella.
3. Que el mensaje le sea **visible**.

## La pregunta

> **¿Contra qué tablas consulto esas tres cosas?**

Con los nombres escribo las tres consultas y cierro la microtarea en una corrida. Son equivalentes a
las que la suite **ya hace** para el canal in-app:

```ts
// lo que ya hago para in-app, y quiero replicar para chat
const bandeja = await sql.query(
  `select id, recipient_user_id, subject, read_at
     from messaging.in_app_notifications
    where notification_request_id = $1`, [r.notificationRequestId]);
expect(bandeja.rows[0]?.recipient_user_id).toBe(destinatarioReal);
expect(bandeja.rows[0]?.read_at).toBeNull();
```

## Por qué no lo adiviné

Hay varias tablas candidatas entre `community` y mensajería, y **elegir una por parecido de nombre
sería inventar** — la regla 00 §1.1 lo prohíbe explícitamente. Prefiero preguntar que escribir una
consulta contra la tabla equivocada y que dé verde por accidente.

---

# 10 · HALL-06 — `rebuild_stack.py` no corre

**Para:** Pablo
**Impacto:** deja al equipo entero sin la vía de recuperación que la documentación promete.

## Qué verifiqué

```text
$ python salud-db/rebuild_stack.py --yes

══ 0/4 · fuentes de DDL ══

══ Fuentes de DDL en conflicto con SQL/ (214) ══
  [XX] existe `mantra-core-health-api\database\SQL` — es una copia, no una fuente.
       Su DDL no lo aplica nadie y se desfasa en silencio.
  [XX] existe `mantra-core-health-api\database\NoSQL` — es una copia, no una fuente.
  [XX] `…\database\SQL\01_iam\02_tables.sql` declara CREATE TABLE fuera de `SQL/` y `NoSQL/`
  … (211 más)
```

Aborta en el paso **0/4**.

## La contradicción

La herramienta hace cumplir la política de **v4.0.9** («nada de DDL fuera de `SQL/`»). Pero el repo,
**desde entonces**, vendoriza `database/SQL` **a propósito**. Está documentado en la cabecera de
`scripts/db/vendor-ddl.sh`:

> *«El esquema relacional vive en OTRO repositorio —`mantra-core-health-model`—. Que el modelo tenga
> repositorio propio arregla el versionado, pero NO arregla el despliegue: una plataforma como
> Coolify clona ESTE repositorio y nada más. Sin la copia de `database/`, el contenedor de
> inicialización arranca con `/init/SQL` vacío, la base queda sin tablas y la aplicación responde
> 500 en la primera escritura.»*

Y no es teórico — esa copia es la que **realmente se usa**:

- El compose la monta: `docker-compose.yml:374` → `${SQL_MODEL_DIR:-./database/SQL}:/init/SQL:ro`
- El CI la usa: `.github/workflows/docs.yml:294-300` monta `$PWD/database/SQL`
- Tiene su propio guardián: `yarn db:vendor:check`, que el CI corre en `docs.yml:238`

**Las dos cosas se contradicen de frente**, y `CLAUDE.md` todavía declara `rebuild_stack.py --yes`
como *«el ÚNICO camino de recuperación»*.

## Lo único bueno

El paso 0 corre **antes** del `down -v`, y está comentado que es a propósito:

> `rebuild_stack.py:385` — *«Va antes del `down -v` a propósito: reconstruir desde una fuente
> equivocada produce una base que parece correcta y no lo es.»*

Así que el rechazo **no destruye nada**. Lo verifiqué: mi base quedó intacta.

## La pregunta

> **¿`check_ddl_sources.py` pasa a reconocer la copia vendorizada como lo que es, o se retira
> `rebuild_stack.py` y se documenta el ciclo a mano?**

## El ciclo a mano, mientras tanto

Lo corrí así y funcionó. Son los mismos pasos que la herramienta ejecuta, sin el chequeo del 0/4:

```bash
docker compose --profile "*" down -v
docker compose --profile local-db up -d postgres postgres-init mongodb mongo-init redis opensearch opensearch-init minio
python salud-db/load_seeds.py --skip-prod          # sin --skip-prod si necesitás el corpus MeSH
```

Toma ~15 minutos. Evidencia: `evidencia/rebuild-ciclo.txt`.

---

# 11 · HALL-07 — `postgres-init` no puede salir 0 en una base nueva

**Para:** Pablo

## Qué verifiqué

En el ciclo limpio, `postgres-init` salió con código **3**. El DDL quedó **completo** —1 201 tablas,
6 792 FKs, `sigla` incluida— y el único paso que falla es el **último patch**:

```text
>>> patches/2026-09-19_v4221_aseguradoras_codigo_unico.sql
BEGIN
CREATE TABLE
INSERT 0 9
SELECT 0
UPDATE 0   (×6)
DELETE 0   (×5)
psql:/init/SQL/patches/2026-09-19_v4221_aseguradoras_codigo_unico.sql:175:
  ERROR:  v4.2.21: se esperaban 17 aseguradoras canónicas y hay 0
CONTEXT:  PL/pgSQL function inline_code_block line 15 at RAISE
```

## Por qué no puede pasar nunca en una base nueva

Es una **precondición de datos dentro del init del DDL**. Y el orden lo hace imposible:

| Paso | Qué crea | Cuándo corre |
|---|---|---|
| `postgres-init` | El esquema **y los patches** | Al levantar el contenedor |
| Paquete de seeds (`load_seeds.py`) | **12** aseguradoras mock | Después, a mano |
| `BoliviaInsuranceSeedService` | Las **17 canónicas** que el patch exige | **Al arrancar la API** |

Verificado: el paquete trae 12 filas de `insurance_carriers`, y son mock. Las 17 canónicas las crea
la app.

**El patch pide algo que sólo existe dos pasos después.**

## La pregunta

> **¿El patch tolera una base sin aseguradoras, o sale del init del DDL y corre después de la
> siembra?**

Opciones:

| | Qué implica |
|---|---|
| **Tolerar** | Que el `RAISE` sea condicional: si hay 0 aseguradoras, no hay nada que reconciliar y el patch es no-op. Es idempotente en todo lo demás |
| **Mover** | Sacarlo de `SQL/patches/` y correrlo como paso posterior a la siembra. Más limpio conceptualmente, más piezas que coordinar |

## Por qué insisto en que no es cosmético

**Un init que siempre falla entrena a todo el mundo a ignorar su código de salida.** El día que
`postgres-init` falle por algo real —una tabla que no se creó, una FK rota— nadie lo va a mirar,
porque «siempre sale 3».

---

# 12 · ¿Corrijo los 9 errores de `lint` ajenos?

**Para:** Coordinación (o quien los introdujo)
**Bloquea:** `H6.S1.M1` (hoy `A MEDIAS`) **y el merge del PR #443**.

## Qué verifiqué

```text
$ yarn lint --max-warnings=0
✖ 9 problems (9 errors, 0 warnings)
  9 errors and 0 warnings potentially fixable with the `--fix` option.
exit=1
```

Los 9 son `prettier/prettier` —reformateo automático— en **4 archivos que mi rama no tocó**:

- `src/modules/directory/dto/my-organizations.dto.ts`
- `src/modules/directory/services/directory-read.service.ts`
- `src/modules/iam/dto/register-organization.dto.ts`
- `src/modules/iam/dto/register-organization.dto.spec.ts`

**Mis 3 archivos dan exit 0.** Y `git status` sobre la rama confirma **cero modificaciones en
`src/`**.

## Por qué no los toqué

La regla 00 §3.2 es explícita: *«Prohibido el refactor, renombre, reformateo o upgrade no
solicitado. Lo que encontrás roto o feo fuera de alcance se **anota**, no se arregla.»*

Así que los anoté.

## La pregunta

> **¿Los corrijo en un commit aparte para que el PR quede con el gate en verde, o se respeta el
> alcance y los arregla quien los introdujo?**

Son `yarn lint:fix`. Dos minutos, sin criterio humano de por medio.

## Qué pasa si nadie contesta

El CI corre `lint --max-warnings=0` (`docs.yml`), así que **mientras estén, cualquier PR que toque
ese árbol está en rojo por algo ajeno**. Ya pasó: las 8 corridas de CI más recientes están en
`failure`, en 5 ramas distintas. No verifiqué que todas sean por esto —no leí sus logs— pero el
gate está ahí.

---

# 13 · ¿El corte del turno fue `5d5007f` o `32ae939`?

**Para:** Pablo
**Confirma:** DEC-01, la única decisión que tomé sin poder consultarla.

## Qué verifiqué

El prompt declaraba `TARGET_REF = 32ae939983f0d665e4ed371362858801134d35cd` y decía
*«reconsultá y fijá el actual; si cambió, ese es tu corte y lo declarás»*.

```bash
$ git rev-parse HEAD
5d5007fbdb7916b124010bbfbb560b7bb3aabc06

$ git merge-base --is-ancestor 32ae939… HEAD; echo $?
0                                    # 32ae939 ES ancestro

$ git log --oneline 32ae939..HEAD
5d5007fb Merge pull request #442 from mdavila-2001/itzan/f09-mch008-2-encounter-coherence
70f8f1a8 fix(clinical): MCH-008.2 · condiciones y órdenes exigen un encuentro del mismo paciente y custodio

$ git diff --name-only 32ae939..HEAD
src/modules/clinical/services/conditions.service.spec.ts
src/modules/clinical/services/conditions.service.ts
src/modules/clinical/services/service-requests.service.spec.ts
src/modules/clinical/services/service-requests.service.ts
```

**Los 2 commits de diferencia tocan exclusivamente `clinical`.** Ninguno toca `scheduling`,
`messaging` ni el puerto de avisos — o sea, ninguno toca la superficie de esta relación.

## La decisión que tomé

Trabajar contra `5d5007f` (el `HEAD` real de `dev`), porque no cambia nada de esta relación y evita
un rebase posterior.

## La pregunta

> **¿Lo confirmás?**

Si el corte del turno es `32ae939`, **lo revierto sin costo**: al no haber diferencias en la
superficie de la relación, todo el trabajo aplica igual.

---

# 14 · ¿Cómo se prueba una salida a destinatario real sin mandarle nada a nadie?

**Para:** Coordinación
**Bloquea:** `H5.S1.M2`, hoy `BLOQUEADO`.

## El problema, que es circular

El control que hay que demostrar es: *«un doble no puede salir a un destinatario real»*. Para
**ejercitarlo** habría que apuntar a un proveedor real y comprobar que se bloquea antes del envío.

Pero apuntar a un proveedor real es **exactamente lo que el control debe impedir**. Y si el control
fallara, el efecto colateral es mandarle un correo a una persona real desde un entorno de pruebas.

## Qué sí quedó demostrado

Para que se entienda qué falta y qué no:

| Capa | Estado | Cómo se comprobó |
|---|---|---|
| **Estructural** | ✅ ejecutado | Barrido recursivo de `src/`: **0 archivos importan de `test/`**. Si no hay camino de import, no hay doble que bindear |
| **Build** | ✅ ejecutado | `tsconfig.build.json` excluye `test/`: el doble no entra a `dist/` |
| **Composición** | ✅ ejecutado | `[H5.S1.M3] AGENDA_NOTICE_PORT resuelve a: MessagingAgendaNoticeAdapter`, preguntado a la app compuesta. Y `useExisting` verificado: token y clase son la misma instancia |
| **Runtime** | ❌ **no existe** | No hay guarda que impida bindear un doble si alguien agrega la palanca |

## Sobre la capa que falta

**Hoy el riesgo es bajo** porque no hay palanca: el binding es literal
(`scheduling.module.ts:142`) y no hay flag de entorno que lo cambie. Pero eso es una propiedad del
código actual, no un control.

**El patrón para hacerlo ya existe en el repo**, en dos precedentes verificados:

| Precedente | Mecanismo |
|---|---|
| `src/worker/worker.env.ts:201` `assertMockProviderNotInProduction` | Lanza al cargar el env del worker |
| `src/common/verification/verification-bypass.env.ts:52` | **Dos mitades**: `Joi.when('NODE_ENV','production', valid(false))` que aborta el arranque + assert en defensa de profundidad |

## La pregunta

> **¿Hay un entorno donde esto se pueda intentar sin riesgo —una cuenta de correo de pruebas con el
> proveedor real, un buzón controlado, una lista de permitidos— o `H5.S1.M2` se `DESCARTA` con
> motivo?**

Y una segunda, más barata:

> **¿Se escribe la regla de la capa 3 ahora, antes de que alguien agregue la palanca?**

O sea: dejar escrito que **si alguna vez** se agrega un binding por entorno, tiene que seguir las
dos mitades del precedente. Un `if (env !== 'prod')` suelto no es un control: es una intención.

---

# 15 · ¿El E2E de esta relación es responsabilidad del carril B?

**Para:** Coordinación
**Bloquea:** `H6.S1.M3` y `H6.S1.M4`, hoy `NOT_RUN`.

## Qué verifiqué

Las etapas 5, 6 y 7 de la pirámide de cierre (E2E dirigido, E2E de regresión, smoke cross-browser)
**no se pueden correr desde este repo**:

```text
$ grep -i playwright package.json
# vacío — Playwright NO es dependencia de mantra-core-health-api

$ ls playwright.config.* e2e/
ls: cannot access 'playwright.config.*': No such file or directory
ls: cannot access 'e2e': No such file or directory

$ ls ../mantra-core-health/playwright | head -3
administrador-e2e.spec.ts
agenda-barra-y-grilla.mjs
agenda-pestana-horario.mjs
```

Los specs de navegador viven en **`mantra-core-health`**, el repo del front.

## Una trampa que vale señalar

`yarn test:e2e` **existe** como script:

```json
"test:e2e": "jest --config ./test/jest-e2e.json"
```

Y su `testRegex` (`.e2e-spec.ts$`) casa con **un solo archivo**: `test/app.e2e-spec.ts`, el scaffold
de Nest. Correrlo y contarlo como etapa 5 sería exactamente el *«workflow verde porque no seleccionó
ninguna prueba»* que el propio prompt prohíbe en H6.S2.M1. Por eso no lo corrí.

Evidencia: `evidencia/h6-etapas5a7-e2e-ausente.txt`.

## La pregunta

> **Las etapas 5-7 de la pirámide para esta relación, ¿son del carril B —y entonces el trabajo es en
> el repo del front— o son de otro carril?**

Si son mías, necesito saber contra qué flujo de UI: el aviso se ve en la campana, así que el E2E
sería «cancelar una cita → la campana del paciente muestra el aviso», y eso cruza los dos repos.

---

# 16 · ¿Quién consolida los checks A y C de la semana?

**Para:** Todo el equipo
**Bloquea:** `H6.S3.M1` y `H6.S3.M2`, hoy `A MEDIAS`.

## Qué tengo

`registro-de-checks.json` con **23 checks del gate B**, cada uno con sus 13 campos y **todas sus
rutas de evidencia verificadas** (existen los archivos, no son rutas inventadas).

## Qué falta

- **Gate A** (aislamiento): Pablo, Itzan.
- **Gate C** (producto/aceptación): Marcelo.

No existen todavía.

## Las preguntas

> **16.a — ¿Cada uno publica el suyo en el mismo formato y alguien los une, o hay un dueño del
> consolidado?**

> **16.b — ¿Se usa el formato de 13 campos, o hay otro acordado?**

El mío está especificado en `H1-registro-de-checks.md` por si sirve de plantilla. Los 13 campos son:
`check_id`, `gate`, `scope`, `artifact`, `required`, `applicable`, `status`, `reason`,
`participants`, `command`, `exit_code`, `evidence_paths`, `limits`.

## Por qué importa el formato y no sólo el contenido

Dos campos hacen todo el trabajo:

- **`participants`** marca cada uno como `real` o `double`. **Sin eso el consolidado no distingue
  «verificado con dobles» de «verificado de verdad»**, que es la distinción entera del piloto.
- **`limits`** dice qué NO acredita cada check. Un `limits` vacío es una afirmación muy fuerte.

Y una regla que propongo mantener: **`command` y `exit_code` son `null` sólo cuando no hubo
ejecución, con la causa escrita en `reason`.** Una fila `PASS` con el comando vacío no vale.

---

# 17 · HALL-05 — ¿quién actualiza `CLAUDE.md`?

**Para:** Coordinación

## Qué verifiqué

Está desactualizado en **cinco puntos**, y **tres me hicieron diagnosticar mal**:

| # | Dice `CLAUDE.md` | Es | Verificado en |
|---|---|---|---|
| 1 | «`database/` se eliminó (450 archivos)» y `check_ddl_sources.py` falla si reaparece | Es la **copia vendorizada vigente**, con `db:vendor:check` como guardián | `scripts/db/vendor-ddl.sh`, `docs.yml:238` |
| 2 | «el compose monta `../SQL`» | Monta `${SQL_MODEL_DIR:-./database/SQL}` — por defecto **la vendorizada** | `docker-compose.yml:374` |
| 3 | «De integración solo corre `postgres-privileges`: cualquier otro int-spec en rojo pasa invisible por CI» | El workflow corre **`yarn test:integration --ci` completo** | `docs.yml:389` (y el dirigido en `:334`) |
| 4 | 6 663 FKs | **6 664** (antes del rebuild) · **6 792** (después) | `psql`, conteo excluyendo `_timescaledb%` |
| 5 | 439 suites / 4 500 pruebas unitarias | **681 suites / 8 249 pruebas** | `yarn test` |

## El costo real de que estén desactualizados

Los puntos 1, 2 y 3 me costaron **dos diagnósticos equivocados** que tuve que corregir a mitad del
trabajo y dejar documentados:

- **Reporté que `database/SQL` había reaparecido como regresión** (HALL-04). Falso: es la copia
  vendorizada deliberada. Lo retiré.
- **Busqué `sigla` en `SQL/` del workspace, no la encontré, y acusé al ORM de ir adelante del
  modelo.** Falso: estaba en `database/SQL` —la copia que el compose realmente monta— junto con su
  patch dedicado. La base estaba atrasada, no el modelo adelantado.

Los puntos 4 y 5 no los investigué; son conteos.

## La pregunta

> **¿Lo actualizo yo en un PR aparte, o tiene dueño?**

Puedo dejarlo hecho hoy: tengo las cinco correcciones verificadas con su ruta.

## Por qué no es cosmético

`CLAUDE.md` se lee como **la fuente de verdad del repo** — es lo primero que carga cualquiera que
trabaje acá. Mientras diga esas tres cosas, **el próximo que llegue va a llegar a mis mismas
conclusiones equivocadas**, y va a perder las mismas horas que perdí yo.

---

# Lo que NO estoy preguntando

Para que quede claro qué está cerrado y no necesita atención de nadie:

| ID | Qué era | Estado |
|---|---|---|
| **HALL-02** | «La relación no entrega ningún aviso» | **CERRADO.** Era una base con un paquete de seeds viejo, no un defecto. El arreglo ya existía en `gen_seeds.py` (v4.0.11 bis). Tras el ciclo limpio la relación entrega y `fx3` pasa 10/10 |
| **HALL-04** | «`database/SQL` volvió a existir» | **RETIRADO.** Lo levanté yo y es falso: es una copia vendorizada deliberada con su propio guardián |
| **HALL-01** | 54 de 76 int-specs bloqueados (`column "sigla" … does not exist`) | **RESUELTO en mi máquina** aplicando los 48 patches versionados. Sigue abierto para quien tenga su base atrasada — los comandos están en la pregunta 10 |
| «18 conceptos duplicados» | Lo reporté como corrupción de catálogo | **FALSO, retirado.** `catalog_concepts` declara `UNIQUE(code_system_version_id, code)`: `code` no es único globalmente por diseño. Por eso `OTRO` aparece seis veces y está bien. Deduplicarlos habría borrado catálogo legítimo |

---

# Apéndice · Estado de las 53 microtareas

| Hito | µtareas | `HECHO` | `A MEDIAS` | `BLOQUEADO` | `NOT_RUN` |
|---|---:|---:|---:|---:|---:|
| **H1** — doble estricto, catálogo y registro de checks | 13 | **13** | 0 | 0 | 0 |
| **H2** — la relación con dobles de ambos extremos | 8 | **5** | 1 | 2 | 0 |
| **H3** — integración con participantes reales | 8 | **7** | 1 | 0 | 0 |
| **H4** — idempotencia, concurrencia y recuperación | 8 | **5** | 0 | 3 | 0 |
| **H5** — el doble no llega a producción | 7 | **6** | 0 | 1 | 0 |
| **H6** — regresión del candidato final | 9 | **4** | 3 | 0 | 2 |
| **TOTAL** | **53** | **40** | **5** | **6** | **2** |

**Peldaño de evidencia alcanzado:** `VERIFIED` para la relación con dobles y contra la base.
**No** `REGRESSION_VERIFIED`: el lint global queda en rojo por deuda ajena (pregunta 12) y las
etapas 5-7 de la pirámide no se ejecutaron (pregunta 15).

**Comandos con los que se verificó todo lo afirmado acá:**

```text
$ yarn test:integration --testPathPatterns=agenda-mensajeria
Test Suites: 2 passed, 2 total
Tests:       33 passed, 33 total                    exit=0

$ yarn test:integration --testPathPatterns=fx3-agenda
Tests:       10 passed, 10 total                    exit=0

$ yarn typecheck                                    exit=0

$ yarn test
Tests: 1 skipped, 8248 passed, 8249 total           exit=0
        └─ el skipped es elevenlabs.contract.spec.ts (condicional por credencial),
           registrado NOT_RUN, nunca PASS

$ yarn lint --max-warnings=0
✖ 9 problems (9 errors, 0 warnings)                 exit=1
        └─ los 9 en archivos ajenos — ver pregunta 12
```
