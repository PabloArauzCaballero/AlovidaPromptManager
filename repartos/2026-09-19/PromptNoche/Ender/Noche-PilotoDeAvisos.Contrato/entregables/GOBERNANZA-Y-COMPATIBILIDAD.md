# Gobernanza y compatibilidad — `AgendaNoticePort` (H3)

Rige sobre `CONTRATO-AGENDA-NOTICE-PORT.md` v1.0.0 (commit `01e8035b7bb8d8e31e89001a5d22517559400bc7`
de este repo). No modifica esa ficha; la complementa.

## 1. Política de compatibilidad (H3.S1)

Tres dimensiones, porque son independientes: un cambio puede ser compatible en una y romper otra.

| Dimensión | Pregunta | Ejemplo compatible | Ejemplo incompatible |
|---|---|---|---|
| **Lectura** | ¿Un consumidor que lee el resultado sigue leyendo lo mismo? | Agregar un campo opcional nuevo a `AgendaNoticeResult` | Quitar un campo que algún consumidor lee (`skippedReason` — ver ADV-06 abajo, §2) |
| **Escritura** | ¿Un consumidor que construye un `AgendaNotice` sigue compilando? | Agregar un campo opcional nuevo a `AgendaNotice` | Volver obligatorio un campo hoy opcional (ej. exigir `tenantId`); angostar `AgendaNoticeKind` quitando un valor que alguna fábrica ya emite |
| **Significado** | ¿El mismo dato sigue queriendo decir lo mismo? | — | Cambiar qué prueba `delivered` (hoy: sólo in-app) para que incluya "o el correo salió" — el código no cambiaría, pero los 4 puntos de emisión que hoy cuentan `delivered` para métricas empezarían a contar otra cosa sin saberlo |

**Regla concreta del contrato real** (H3.S1.M2, citando §7 del template ausente por el nombre
genérico y usando el caso real en su lugar, ya que `ARQUITECTURA_Y_CONTRATOS.md` no existe —
ver nota de apertura en `CONTRATO-AGENDA-NOTICE-PORT.md`): **agregar un valor a
`AgendaNoticeKind` es compatible** para los 9 consumidores inventariados en H1 (ninguno hace un
`switch` exhaustivo sobre los 4 valores — verificado: `grep -n "switch" src/modules/scheduling`
sobre los archivos de la §12 del contrato no encontró ningún `switch` sobre `kind`), **pero
angostar `AgendaNoticeKind` quitando `BOOKING_STATE_CHANGED` sería incompatible de escritura**:
las fábricas de `agenda-notices.ts` (L237, L277, L392 según el grep) siguen emitiéndolo, y **de
significado** para el adaptador (`KINDS_CON_CHAT` lo usa para decidir el chat, L119-120) — sería
un caso simultáneo de las tres dimensiones rompiéndose a la vez.

*(Grep exacto para el "ningún switch sobre kind": `grep -rn "switch" src/modules/scheduling
--include="*.ts" | grep -v spec` sobre el corte congelado devolvió **un solo** resultado —
`scheduling-confirmation.service.ts:364: switch (op)` — que es un switch sobre una variable
`op`, no sobre `AgendaNoticeKind`. Cero switches sobre `kind` en todo el módulo.)*

## 2. La prueba: ADV-06 en copia temporal (H3.S2)

**Cambio introducido:** se quitó `skippedReason` de `AgendaNoticeResult` (simula "quitar un
campo", clasificado arriba como incompatible de lectura) en una copia descartable fuera del repo
(`/private/tmp/.../adv06-copia-temporal`, jamás en `AlovidaPromptManager` ni en Mantra).

**Consumidor afectado, simulado literal:** una función que reproduce la rama real de
`MessagingAgendaNoticeAdapter.entregar()` que devuelve
`{ delivered: false, skippedReason: 'El destinatario no tiene cuenta de portal' }`.

**Resultado — falló donde tenía que fallar:**

```text
$ tsc -p tsconfig.json
agenda-notice-validator.ts(113,5): error TS2820: Type '"skippedReason"' is not
  assignable to type 'keyof AgendaNoticeResult'. Did you mean '"chatSkippedReason"'?
consumidor-real-simulado.ts(22,5): error TS2561: Object literal may only specify
  known properties, but 'skippedReason' does not exist in type 'AgendaNoticeResult'.
  Did you mean to write 'chatSkippedReason'?
exit 2
```

Salida completa en `../evidencia/h3-s2-adv06-copia-temporal.txt`.

**Verificación de inmutabilidad histórica:** el hash de blob del artefacto real
(`agenda-notice.types.ts` en el commit `7f19cf3…`) es idéntico antes y después de correr ADV-06
(`ee26fe75f22ffb3542973f59f8085fe86432de72`), y `git status --short` sobre la carpeta de Ender
quedó vacío — la copia temporal en `/private/tmp` nunca tocó el repo versionado. Evidencia en el
mismo archivo de arriba.

## 3. Matriz consumidor × versión (H3.S2.M3 / H5.S2.M1)

Sólo existe una versión real hoy (`v1.0.0` = el contrato ya implementado). La columna
"`v-incompatible` (ADV-06)" es la copia temporal descartada; no es una versión publicada.

| Consumidor | `v1.0.0` | `v-incompatible` (ADV-06, quita `skippedReason`) |
|---|---|---|
| `scheduling.module.ts` (binding del provider) | compatible | no probado — no referencia campos de `AgendaNoticeResult` (`NOT_RUN`, motivo: el binding es de tipo `AgendaNoticePort`, no de sus campos) |
| `services/scheduling-agenda-notices.service.ts` | compatible — sólo lee `.delivered` (verificado: `resultado.delivered` en L83 y L130) | compatible — no toca `skippedReason` |
| `services/scheduling-delay.service.ts` | compatible — sólo lee `.delivered` (verificado: `resultado.delivered` en L231) | compatible |
| `services/scheduling-bookings.service.ts` | compatible — **descarta el resultado por completo**: `await this.notices.emitMany(avisos);` (L681) y `await this.notices.emit(...)` (L2486) sin capturar ningún valor de retorno (verificado, cero apariciones de `.delivered` en este archivo) | compatible por el mismo motivo: no lee ningún campo |
| `services/scheduling-catalog.service.ts` | compatible — mismo patrón: `await this.notices.emit(...)` (L890) sin capturar el resultado | compatible por el mismo motivo |
| `notices/agenda-notices.ts` (fábricas) | compatible (construyen `AgendaNotice`, no `AgendaNoticeResult`) | compatible — este archivo no toca el campo removido |
| `adapters/messaging-agenda-notice.adapter.ts` (**el único que produce `skippedReason`**) | compatible | **incompatible — demostrado con ADV-06** (§2) |
| `adapters/support-admin-notice.adapter.ts` | compatible (usa `AgendaNotice`, no el resultado) | compatible |
| `profiles/ports/affiliation-notice.port.ts` (mención en comentario, no consumidor real) | N/A | N/A |

**Ninguna celda quedó en blanco.** Las dos que dicen `NOT_RUN`/`N/A` tienen su motivo escrito, no
un espacio vacío.

## 4. El contrato de la segunda capacidad (H3.S3) — `DESCARTADO` para este turno

**Verificado dos veces, no asumido:** la ficha de Pablo
(`Pablo/Noche-PilotoDeAvisos.Backend/CorteLaboratorioYRegresion.md`) y su daily
(`Pablo-Daily-Noche-2026-09-19.md`) siguen en **`0/53`, plantilla sin tocar** — no es que Pablo
esté trabajando en otra cosa y tarde: su turno **no arrancó**. La elección de la segunda capacidad
depende de evidencia que sólo produce el laboratorio de Pablo (H3.S1 de su ficha: "inventariar los
mecanismos que el piloto produjo, cada uno con la evidencia que lo respalda") y de la prueba de
aislamiento de Itzan — ninguna de las dos existe todavía en esta noche.

**Decisión de cierre (no una elección de la capacidad):** en vez de dejar esto `BLOCKED`
indefinidamente esperando un turno que no corrió, lo cierro `DESCARTADO` **para este turno**, con
la condición explícita de reabrirlo el día que exista una capacidad candidata con evidencia real
detrás. La alternativa — inventar yo una "segunda capacidad" sin la evidencia de qué mecanismos
del piloto ya se probaron aislados — sería exactamente "crear una abstracción sin un segundo uso
real", prohibido por la propia ficha de Pablo y por `scope-discipline` de mi lote. No es mi
decisión de negocio tomarla a ciegas; es mi decisión de gestión de turno no dejarla como una
promesa vacía de "BLOCKED" que nadie va a destrabar esta noche.

**Motivo del `DESCARTADO`, para que quede trazable:** ausencia total de insumo (cero mecanismos
del piloto con evidencia de aislamiento), no una preferencia mía. **Quién lo reabre:** quien
ejecute la ficha de Pablo — cuando exista al menos un mecanismo candidato con evidencia, H3.S3
se retoma con esa evidencia real en la mano, no antes.

## 5. Riesgo de release detectado en H3 (adelanto a H5/H6)

`skippedReason` y `emailSkippedReason` son **texto libre**, no un catálogo cerrado (ver
`CONTRATO-AGENDA-NOTICE-PORT.md` §9). Esto significa que la matriz de compatibilidad de arriba es
frágil de una forma que ADV-06 no cubre: un cambio que **no** toca la forma del tipo pero **sí**
cambia el *contenido* de esos strings (ej. traducir el mensaje, corregir una tilde) no rompería
ningún `tsc`, pero rompería a cualquier consumidor futuro que compare por texto — hoy verificado
que ninguno lo hace (§9 del contrato), pero nada en el tipo lo impide mañana. Se registra como
riesgo residual para H6, dueño: quien apruebe el próximo cambio de estos mensajes.
