# H5 — Prueba adversa repetida e inmutabilidad histórica

## 1. ADV-06, re-ejecutado de forma independiente de H3 (H5.S1.M1)

Mismo experimento de `GOBERNANZA-Y-COMPATIBILIDAD.md` §2, corrido de nuevo en una copia temporal
**nueva** (no la misma carpeta), para no heredar la evidencia de la corrida anterior
(`no atribuirle a la versión reparada la evidencia de la anterior`, regla explícita de la ficha
de Pablo que aplico acá por prudencia aunque no sea mi ficha).

**Resultado:** idéntico a H3 — `tsc` falla con `exit 2`, mismos dos errores (`TS2820` en el
validador, `TS2561` en el consumidor simulado). Salida completa en
`evidencia/h5-s1-adv06-reejecutado-e-inmutabilidad.txt`.

## 2. Consumidor que falla, y con qué error (H5.S1.M3)

| Consumidor afectado | Error | Reintentable arreglando el consumidor? |
|---|---|---|
| `MessagingAgendaNoticeAdapter.entregar()` (simulado literal en `consumidor-real-simulado.ts`) | `TS2561: Object literal may only specify known properties, but 'skippedReason' does not exist in type 'AgendaNoticeResult'` | No — es el único productor real de ese campo; el fix es no quitar el campo, no tocar el consumidor |

## 3. Inmutabilidad histórica, verificada de nuevo (H5.S1.M2)

Blob hash de `agenda-notice.types.ts` y de `CONTRATO-AGENDA-NOTICE-PORT.md` en el commit actual
de `AlovidaPromptManager`: **idénticos** a los fijados en H2/H3 y H4 respectivamente. Ningún
artefacto publicado cambió entre H3, H4 y este momento.

## 4. Matriz final (H5.S2.M1)

Es la misma de `GOBERNANZA-Y-COMPATIBILIDAD.md` §3, sin cambios: no se publicó ninguna versión
nueva del contrato entre H3 y H5. Ninguna celda en blanco.

## 5. Estrategia de transición por incompatibilidad conocida (H5.S2.M2)

| Incompatibilidad conocida | Estrategia |
|---|---|
| Quitar `skippedReason` (demostrada con ADV-06) | No hacerlo sin antes migrar `MessagingAgendaNoticeAdapter` a leer el motivo desde otro lado, en un PR separado, **antes** de tocar el tipo (patrón expand/migrate/contract de `github-multirepo-coordination` §4, aplicado a un solo repo: expandir el nuevo campo, migrar el adaptador, recién ahí contraer el viejo) |
| Angostar `AgendaNoticeKind` quitando `BOOKING_STATE_CHANGED` (analizado en H3.S1) | Mismo patrón: ningún valor se quita mientras alguna fábrica lo siga emitiendo. Verificar con el mismo grep de consumidores antes de proponerlo |
| Volver `tenantId` obligatorio (cerraría el hallazgo de seguridad de §8 del contrato) | Es **compatible** de escritura si se le da un default en las 7 fábricas antes del cambio de tipo — no incompatible, pero requiere tocar `agenda-notices.ts`, que está fuera de mi alcance (edición de Mantra) |

## 6. Cierre del contrato al llegar a H5 (H5.S3)

**Lista de `DECISION_REQUIRED` al cierre:** es la misma tabla de `VERSION-ESTABLE.md` §5 (Q-06,
TTL de `debounceKey`, reintentabilidad, orden de `emitMany`, consistencia de `tenantId`, segunda
capacidad). Ninguna sin dueño.

**Riesgo de release declarado** (regla de H5.S3.M1: "una decisión sin dueño es un riesgo de
release"): las seis decisiones de la tabla **sí** tienen dueño, así que ninguna es, por esa
definición, un riesgo de release sin gobernar. El riesgo real que sí queda abierto es el de
`GOBERNANZA-Y-COMPATIBILIDAD.md` §5 (mensajes de texto libre frágiles a futuro) — tiene dueño
("quien apruebe el próximo cambio de estos mensajes") pero no una fecha, porque no hay todavía un
cambio propuesto que la dispare.

**Estado final del contrato (H5.S3.M2):** `IMPLEMENTADO`. No se mezcla con `OBJETIVO ACORDADO` ni
`PROPUESTA` — ver razón en `VERSION-ESTABLE.md` §3.
