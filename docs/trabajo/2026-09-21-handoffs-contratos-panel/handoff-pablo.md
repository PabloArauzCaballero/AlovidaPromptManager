# Handoff para Pablo — H2 y H3 listos en el simulador

> Preparado el 2026-09-21. **Pendiente de pegar en el daily**: el daily vive en
> `AlovidaPromptManager` y esta pasada no tiene autorización para escribir ahí.

## H2 — el motivo «Otros servicios» y el horario extra ya funcionan

**Ruta:** `POST /scheduling/resources/{resourceId}/exceptions`

### El bloqueo por otros servicios (C-12) — va como `OTHER` + texto

```json
{ "exceptionType": "OTHER", "reason": "Otros servicios",
  "startAt": "2026-09-30T09:00:00.000Z", "endAt": "2026-09-30T10:00:00.000Z" }
```

Respuesta `201`:

```json
{ "id": "…", "exceptionType": "OTHER", "reasonLabel": "Otro", "reason": "Otros servicios",
  "blocks": true, "startAt": "…", "endAt": "…", "blockedSlots": 2 }
```

**No inventé un tipo nuevo.** La lista cerrada de la API tiene siete
(`scheduling-catalog.dto.ts:725-742`) y el simulador ahora declara exactamente esos siete. «Otros
servicios» es el **texto** de un `OTHER`, no un octavo tipo: ampliar el enum es decisión de
negocio, no de implementación (ver `Q-D6`).

### El horario extra

```json
{ "exceptionType": "EXTRA", "startAt": "…T20:00:00.000Z", "endAt": "…T21:00:00.000Z" }
```

Respuesta `201` con **`"blocks": false` y `"blockedSlots": 0`**: añade disponibilidad, no la cierra.

> **Ojo con esto, porque antes no era así.** El manejador leía `isAvailable` del cuerpo del
> pedido, así que un `EXTRA` sin ese campo **cerraba los cupos del rato** — lo contrario de lo
> que el tipo significa. Ahora lo decide el catálogo a partir del tipo. Si tenías código que
> mandaba `isAvailable`, **ya no hace falta**: se ignora.

### Lo que cambió en el listado

`GET /scheduling/resources/{id}/exceptions` ahora devuelve también **`exceptionType`** y
**`blocks`** en cada ítem. Antes sólo llegaba `reasonLabel`, así que distinguir un bloqueo de un
horario extra obligaba a comparar etiquetas en castellano. Los dos campos son opcionales en
`PublishedException`, así que no rompe lo que ya leías.

### Lo que ahora se rechaza (y antes pasaba en silencio)

**`400 Bad Request`**, con la misma forma que el `ValidationPipe` de la API:

| Caso | Antes | Ahora |
|---|---|---|
| `exceptionType` fuera de los siete | Se aceptaba y caía a `OTHER` | **400** |
| Motivo que exige texto, sin `reason` | Se aceptaba con texto vacío | **400** |
| Franja invertida o de cero minutos | Se aceptaba | **400** |
| Cambiar el tipo por uno inventado vía `PATCH` | Se aceptaba | **400** |

Esto es a propósito: el doble era **más permisivo que el backend real**, y eso hacía que el
código que anda acá falle contra la API. La franja mínima de **un minuto** sigue siendo válida.

## H3 — la duración de la visita ya es configurable

**Rutas:** `GET /visit-agenda/me` · `GET /visit-agenda/doctors/{id}` · `PUT /visit-agenda/me`

Campo nuevo: **`defaultVisitDurationMinutes`**, entero, entre **5** y el `maxDurationMinutes` de
la propia agenda. **Por omisión 15**, y viaja en la respuesta aunque el profesional no haya
configurado nada — así no tenés que escribir un 15 a mano en la plantilla.

`POST /visit-requests` sin `durationMinutes` toma ese valor. Con uno pedido, se valida contra el
mismo rango. Cero, negativo, decimal, texto o por encima del máximo → **400**.

> **Es un doble declarado (regla 65).** Busqué el equivalente en el contrato real sobre
> `origin/dev` de la API (`c2c071a4`): `git grep` de `visitDuration`, `duracion.*visit` y
> `visit.*duration` sobre `src/` devuelve **cero**. El módulo `pharma_lab` existe, pero **no
> tiene dónde guardar esta configuración**. El campo está escrito igual, acá, y la brecha del
> contrato real queda como hallazgo para quien toque la API.

### Para la tarjeta de la visita

`GET /visit-requests/inbox` trae franja, visitador, laboratorio, modalidad, lugar y
`durationMinutes`. **Ningún campo clínico ni de paciente**, verificado campo por campo en
`pharma-lab.handlers.spec.ts`. Si te falta algo para pintarla, pedímelo antes de sacarlo de otra
ruta: el criterio es no mover más datos personales de los que esa vista necesita.
