# PLAN · Hallazgo `PRODUCTION_ADAPTER_GAP` — el `recipient` inválido en el adaptador real

## Qué es esto

Un **hallazgo puntual**, no un hito ni una reapertura. Sale de un trabajo independiente sobre el contrato
de `AgendaNoticePort` hecho el 2026-09-20, en paralelo y sin conocer todavía la entrega del PR #5.

**No reabre H2 ni ningún hito del turno**, que está cerrado y mergeado.

## Alcance

- **Sólo lectura** del repositorio `mantra-core-health-api` en el corte `33f17785`.
- Cero escrituras en API, Front, Model o Docs de producto.
- No se ejecutó la aplicación ni ninguna prueba.

## Pasos

1. Leer el tipo `AgendaNoticeRecipient` y confirmar qué obliga el compilador y qué es comentario.
2. Leer el adaptador real (`MessagingAgendaNoticeAdapter`) y seguir el camino del destinatario.
3. Registrar, con cita literal, qué ocurre en los dos casos que la regla `EXACTLY_ONE_RECIPIENT_FIELD`
   declara inválidos: ningún campo y los dos campos.
4. Publicar el hallazgo **sin proponer solución** y dejar la decisión a quien corresponde.

## Lo que este trabajo NO hace

- No propone implementación, forma de error ni cambio de contrato.
- No discute la frontera del validador entregado, que está declarada a propósito.
- No asume aprobación de nadie.
