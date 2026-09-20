# Versión estable del contrato — `AgendaNoticePort` (H4)

## 1. Declaración de estabilidad

**`v1.0.0` se promueve a versión estable.** No hubo cambios entre el snapshot de H1 y este
momento: es la misma ficha (`CONTRATO-AGENDA-NOTICE-PORT.md`), el mismo commit
`01e8035b7bb8d8e31e89001a5d22517559400bc7`, el mismo hash de blob del archivo del puerto
(`b462700cd8f382c0c42676cd931a2281198abaf5dca614cb739a47910bfb5877`).

**Verificación de que no cambió** (H4.S2.M3): `git rev-parse HEAD:repartos/2026-09-19/PromptNoche/Ender/CONTRATO-AGENDA-NOTICE-PORT.md`
= `de23711979b33e813d792ea53e501c6d24496197`, y `git log` sobre ese archivo muestra los 3
commits de H1 (`b3f78f1`, `06dc335`, `01e8035`) y **ninguno posterior** — H2 y H3 no lo tocaron.
Salida en `../evidencia/h4-s2-inmutabilidad-v1.txt`.

## 2. Ficha completa — campos u omisión justificada (H4.S1.M1)

Todos los campos que la propia ficha de encargo enumera (§0, §1, §3–§14 de
`CONTRATO-AGENDA-NOTICE-PORT.md`) están completos. Ninguno se omitió: donde la fuente no
alcanzaba, el campo quedó explícito como `DECISION_REQUIRED` con su motivo — nunca en blanco. La
cita textual del metaprompt para Q-06, que en un primer pase quedó bloqueada por una búsqueda que
no cubría `~/Downloads/`, ya está encontrada y citada (§11 del contrato) — Q-06 sigue
`DECISION_REQUIRED` con las dos citas completas, porque tenerlas no resuelve la clasificación de
negocio pendiente.

## 3. Estado — sin mezclar categorías (H4.S1.M2)

**`IMPLEMENTADO`.** No es `OBJETIVO ACORDADO` ni `PROPUESTA`: describe el puerto que existe en el
corte `32ae9399…`, no una meta a futuro. Las partes que sí son objetivo de este equipo (la
versión `v1.0.0` como identidad, la especificación del validador) están marcadas aparte como
`TARGET_CONTRACT` en §13 del contrato — no se mezclan con lo `IMPLEMENTADO`.

## 4. Matriz consumidor × versión — vigente (H4.S2.M2)

Es la misma tabla de `GOBERNANZA-Y-COMPATIBILIDAD.md` §3. No cambió: no hay una versión nueva que
agregar todavía (H3.S3 se cerró `DESCARTADO` para este turno — sin evidencia de ningún mecanismo
aislado, no hay sobre qué elegir una segunda capacidad; ver §4 de esa ficha). Se referencia, no se
duplica (evitar dos fuentes de verdad — `milestone-planning` §7).

## 5. Lo que queda abierto, con dueño (H4.S3)

| `DECISION_REQUIRED` | Qué bloquea | Dueño | Fecha objetivo |
|---|---|---|---|
| Q-06 — durabilidad del aviso (¿es efecto obligatorio o de mejor esfuerzo?) | El diseño de cualquier outbox/reintento sobre este puerto | Negocio (Marcelo, según handoff de la propia ficha) — las dos citas (código + metaprompt) ya están completas en §11 del contrato | No fijada por esta ficha — es de quien decide (regla: "no elijo un lado") |
| TTL/ventana de `debounceKey` | Cualquier implementación nueva del puerto que necesite saber cuánto dura el rebote | Negocio + dueño del módulo `messaging` (donde vive `debounced`) | No fijada |
| Reintentabilidad de un fallo de `emit()` | El diseño de idempotencia de Justin (citado en el handoff de H1) | Justin, con el catálogo de razones que decida crear | No fijada |
| Orden/cardinalidad garantizados de `emitMany` | Cualquier consumidor que necesite correlacionar `resultados[i]` con `notices[i]` con certeza | Quien mantenga el puerto (hoy nadie lo declara — es del equipo de scheduling) | No fijada |
| Consistencia de `tenantId` (opcional, hallazgo de seguridad §8 del contrato) | Aislamiento multi-tenant si un caller nuevo omite el campo | Dueño del módulo `messaging` / seguridad | No fijada |

**Segunda capacidad (H3.S3):** ya no es un `DECISION_REQUIRED` de esta tabla — se cerró
`DESCARTADO` para este turno (sin evidencia de ningún mecanismo aislado del piloto, no hay base
para elegir). No es una decisión de negocio pendiente; es un hito que no tuvo insumo esta noche.
Se reabre, no se "destraba", el día que exista al menos un mecanismo candidato con evidencia real
(ver `GOBERNANZA-Y-COMPATIBILIDAD.md` §4).

## 6. Plan de transición de los cambios previstos (H4.S3.M2)

No hay un cambio de contrato *propuesto* todavía (nadie pidió agregar/quitar un campo real). Lo
único "previsto" es que P1 reemplace el adaptador (mencionado en el propio comentario de cabecera
del puerto, L12-15): cuando eso ocurra, el plan de transición es:

1. **Expand** — P1 publica su propio contrato de emisión; el binding de `AGENDA_NOTICE_PORT` en
   `scheduling.module.ts` cambia a un adaptador que delega en él, sin tocar los 9 consumidores.
2. **Migrate** — no aplica en el sentido de `github-multirepo-coordination` (no hay consumidores
   externos a este repo); es un cambio interno de un solo archivo (el binding).
3. **Contract** — no hay "lo viejo" que borrar del lado del puerto: la interfaz
   `AgendaNoticePort` en sí no cambia, sólo su implementación.

Esto es una consecuencia directa de que el puerto ya está diseñado para ese reemplazo (es
literalmente su razón de existir, según su propio comentario) — no es un plan que yo inventé.
