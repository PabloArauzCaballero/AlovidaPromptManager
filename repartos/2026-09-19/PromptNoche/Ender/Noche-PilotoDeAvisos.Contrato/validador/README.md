# Laboratorio de validación — `AgendaNoticePort` v1.0.0 (H2)

Oráculo independiente. No es parte de `mantra-core-health-api`, no se instala ahí y no
reemplaza al adaptador real. Ver `../entregables/PLAN.md` §"Ambigüedad registrada" para por qué este
laboratorio lo construye Ender (propietario de contrato) y no "el laboratorio" en el sentido de
la ficha genérica.

## Qué valida

Tres reglas, cada una con su fuente citada en el código (`agenda-notice-validator.ts`):

1. `EXACTLY_ONE_RECIPIENT_FIELD` — la regla "uno de los dos, no los dos" que el tipo
   `AgendaNoticeRecipient` no hace cumplir (fuente: `agenda-notice.port.ts` L43).
2. `RESULT_SHAPE_EXACT` — que un `AgendaNoticeResult` tenga exactamente los 8 campos reales, con
   `delivered` obligatorio y del tipo correcto (fuente: L85-118).
3. `CHAT_FIELDS_ONLY_FOR_BOOKING_STATE_CHANGED` — sustituye al "ADV-03: tenant incorrecto"
   genérico de la ficha de encargo por una regla que sí tiene fuente en este contrato (ver el
   comentario en `agenda-notice-validator.ts` sobre por qué: inventar una regla de tenant que
   ninguna fuente define está prohibido por la propia ficha).

## Cómo correrlo

```bash
npm install        # sólo @types/node, para tipar node:test/node:assert en tsc
npm run test        # tsc -p tsconfig.json && node --test dist/*.test.js
```

Última corrida real: **15/15 tests, exit 0** — ver `../evidencia/h2-validador-build-y-tests.txt`.

## El oráculo no se prueba a sí mismo

Cada valor esperado en `agenda-notice-validator.test.ts` está tipeado a mano leyendo el código de
la regla, no generado ejecutando el validador primero y copiando su salida (H2.S1.M3). Los
nombres de regla (`'EXACTLY_ONE_RECIPIENT_FIELD'`, etc.) son strings literales en el test,
independientes de la constante que usa la implementación.

## Reglas que este validador NO puede comprobar todavía (H2.S2.M3)

| Regla | Por qué no | Qué falta |
|---|---|---|
| Consistencia de `tenantId` entre `notice` y el `recipient` real | El puerto no define qué hace a un tenant "correcto" a este nivel — es opaco, se resuelve aguas abajo en `messaging` | Que el dueño del módulo `messaging` (o negocio) declare la invariante, si existe |
| Reintentabilidad de un fallo de emisión | `emit()` nunca lanza y el `skippedReason` es texto libre, no un código clasificado | Que se defina un catálogo de razones con su reintentabilidad (ver hallazgo de `CONTRATO-AGENDA-NOTICE-PORT.md` §9) |
| TTL/ventana de `debounceKey` | El puerto sólo dice "mientras el primero siga vivo"; el criterio de "vivo" vive en `messaging`, fuera de este contrato | Decisión de negocio (Q-06 es un caso relacionado pero distinto) |
| Orden/cardinalidad garantizados de `emitMany` | La firma no lo declara; sólo lo observa el adaptador concreto | Que el contrato lo declare explícitamente, o que se acepte como no garantizado |

## Compatibilidad contra los consumidores de H1 (H2.S3.M2)

`compatibilidad-consumidores.test.ts` prueba las 6 formas reales de `recipient` que las 7
fábricas de `notices/agenda-notices.ts` construyen hoy contra el corte congelado: ninguna es
rechazada por `EXACTLY_ONE_RECIPIENT_FIELD` (compatibilidad de **lectura**). No hay todavía
compatibilidad de **escritura** ni de **significado** que probar: nadie escribe un `AgendaNotice`
nuevo a partir de esta ficha aún, y v1.0.0 es el contrato ya implementado, no uno propuesto.
