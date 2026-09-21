# Contraste con el simulador nuevo de Ender (2026-09-21)

Ender publicó cambios en `core/mock/**` **después** de mi corte, y un
`handoff-pablo.md` con instrucciones. Este reporte afirma cosas sobre ese
simulador, así que se verificaron contra `origin/mockup` HEAD (`c038f2ef`) antes
de dejarlas escritas, en vez de darlas por buenas o por caducas.

## 1. Una instrucción del handoff **no se sostiene**, y seguirla rompía C-10

> «Ahora lo decide el catálogo a partir del tipo. Si tenías código que mandaba
> `isAvailable`, **ya no hace falta**: se ignora.»

**No es así en `mockup` HEAD.** El manejador sigue leyendo el cuerpo:

```ts
// core/mock/handlers/scheduling.handlers.ts:624
isAvailable: datos.isAvailable ?? false,
// :627
const bloqueados = nuevo.isAvailable ? [] : cupos.filtrar(…);
```

El `blocks: false` de `TIPOS_DE_BLOQUEO` existe (`:46`) pero **no alimenta**
`isAvailable`. Es decir: un `EXTRA` **sin** `isAvailable: true` **cierra los cupos
del rato** — exactamente lo contrario de lo que el tipo significa.

Mi código manda `isAvailable: true`, que además es parte del contrato real
(`NewAvailabilityException.isAvailable`, «`true` cuando la excepción **añade**
disponibilidad extraordinaria»). **Se deja como está.** Si se hubiera seguido el
handoff y quitado el campo, el horario extra habría pasado a bloquear.

Avisado a Ender.

## 2. Los dos hallazgos que le pasé **siguen vigentes**

| | Estado en `c038f2ef` |
|---|---|
| **H3-P1** · `EXTRA` no genera cupos | **Sigue.** `POST /exceptions` añade el bloqueo y no toca `cupos`: el horario extra existe como excepción y no se puede reservar |
| **H5-P1** · `start` no valida nada | **Sigue.** `router.post('/scheduling/bookings/:id/start', decision('BK-IN-PROGRESS'))` (`:320`): transiciona sea cual sea el estado anterior y haya o no otra consulta en curso |

## 3. Lo que Ender SÍ agregó, y que mi código ya cumplía

| Validación nueva | ¿Mi código la pasa? |
|---|---|
| `400` si `exceptionType` no es uno de los siete | **Sí**: mando `OTHER` y `EXTRA`, los dos del catálogo |
| `422` si el motivo exige texto y no hay `reason` | **Sí**: el `OTHER` de C-12 siempre lleva `«Otros servicios · <servicio>»` |
| `422` si la franja está invertida o es de cero | **Sí**: se valida en el cliente antes de mandar, y hay un spec |
| `requiresText` sólo en `OTHER` | No me afecta: no ofrezco los otros seis motivos |

## 4. Su rectificación de H3 no cambia mi implementación

Ender retiró `defaultVisitDurationMinutes` (era un mecanismo paralelo sobre una
premisa falsa) y remite al PR #559, ya mergeado en `mockup`. Mi tarjeta del
visitador **nunca usó ese campo**: lee `durationMinutes` de la propia
`VisitRequest`, que es el contrato, y cae a 15 sólo si no viene o viene absurdo.
No hay nada que adoptar ni que revertir.

## Cómo se verificó

```text
$ git fetch origin
$ git log --oneline 68dcb562..origin/mockup      → 20 commits
$ git show origin/mockup:src/app/core/mock/handlers/scheduling.handlers.ts | grep -n "isAvailable\|blocks:"
$ git -c … rebase origin/mockup                  → sin conflictos
```

Y después, los cinco kill-tests del turno **volvieron a correr** contra el
simulador nuevo, con el servidor reiniciado:

```text
evidencia/h2/kill-test-h2.txt        → KILL-TEST H2: PASS
evidencia/h3/h3s1-modal-teclado.txt  → H3.S1 PASS
evidencia/h3/h3s2-toggle.txt         → H3.S2 PASS
evidencia/h3/h2s2m3-reserva.txt      → H2.S2.M3 PASS
evidencia/h3/h3s3-extra.txt          → H3.S3 PASS
evidencia/h4/h4.txt                  → H4 PASS
evidencia/h5/h5.txt                  → H5 PASS
```

**Dos de los «fallos» de la primera pasada de H4 eran de mi script, no de la
app**, y se corrigieron ahí: seguía esperando el texto viejo del diálogo («todavía
no se atiende» cuando ahora una cita cerrada dice «ya está cerrada») y no
contemplaba que C-11 se cruza con C-04 — con una consulta en curso, la tarjeta
avisa en vez de iniciar una segunda, y se llega a atender por «Ir a la consulta
abierta». Las dos salidas quedan ejercitadas.
