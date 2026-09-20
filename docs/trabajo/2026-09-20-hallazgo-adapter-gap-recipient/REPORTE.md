# `PRODUCTION_ADAPTER_GAP` — el `recipient` inválido en el adaptador real

> **Para Pablo y Justin.** Hallazgo puntual, clasificado **`PRODUCTION_ADAPTER_GAP`**.
> **No reabre H2 ni ningún hito**: el turno noche del 2026-09-19 está entregado y mergeado (PR #5), con el
> daily en `COMPLETADO` (48/50 `HECHO` + 2 `DESCARTADO`).
> **No propone solución.** Sólo deja registrado un comportamiento verificado.
> Corte: `mantra-core-health-api` @ `33f17785` · evidencia literal en
> [`evidencia/adapter-recipient-33f17785.txt`](evidencia/adapter-recipient-33f17785.txt).

## 1. Qué cubre lo ya entregado, y dónde termina

El contrato publicado (`CONTRATO-AGENDA-NOTICE-PORT.md` §5) especifica la regla
`EXACTLY_ONE_RECIPIENT_FIELD` con su forma de error, y declara **de forma explícita** dónde corre:

> «este validador corre en el LABORATORIO (contra un doble), **no dentro del adaptador real de Mantra**
> (tocarlo está OUT de este carril)».

Esa frontera fue una decisión declarada y **no se discute acá**. Este hallazgo sólo mira qué hace hoy el
adaptador real, que por esa misma frontera quedó fuera del carril entregado.

## 2. Lo verificado

### 2.1 `recipient` vacío → el motivo devuelto afirma otra cosa

`resolverDestinatario` devuelve `userId` si está presente; si no, y `patientProfileId` es `undefined`,
devuelve `null` (`messaging-agenda-notice.adapter.ts:419-423`). Con `null`, `emit` responde (`:177-190`):

```ts
return {
  delivered: false,
  skippedReason: 'El destinatario no tiene cuenta de portal',
};
```

El aviso no se entregó porque **no se indicó ninguna persona**. El motivo, en cambio, afirma un hecho
distinto y comprobable **sobre el paciente**: que no tiene cuenta de portal. Un defecto de quien llama
queda registrado como un hecho operativo del destinatario, y así viaja al log.

### 2.2 Los dos campos presentes → se elige `userId` en silencio

`resolverDestinatario` devuelve `userId` y el flujo sigue (`:419`). No hay error, ni log, ni señal: la
violación de `EXACTLY_ONE_RECIPIENT_FIELD` **no deja rastro** en producción.

### 2.3 Por qué el tipo no lo impide

Los dos campos son opcionales e independientes; la regla «uno de los dos, no los dos» vive en un comentario
JSDoc. Esto ya está documentado en el contrato entregado (§3.1) y se repite acá sólo como contexto.

## 3. Clasificación

**`PRODUCTION_ADAPTER_GAP`.** No es un defecto del contrato ni del validador entregados: es la distancia
entre lo que el contrato especifica **para el laboratorio** y lo que el **adaptador real** hace hoy.

## 4. Por qué puede importar

- Quien mida «avisos no entregados» mezcla defectos de código con hechos del paciente, y el texto del
  motivo orienta a diagnosticar lo que no es.
- Una entrada inválida con los dos campos pasa sin señal: nadie se entera de que ocurrió.

## 5. Qué NO dice este documento

- No propone implementación, forma de error ni cambio de contrato.
- No reabre H2, ni H1, ni ningún hito del turno.
- No afirma que el adaptador esté mal diseñado: su frontera fue una decisión explícita del carril.

## 6. Quién decide

**Pablo**, como dueño del paquete del piloto, y **Justin**, como consumidor del contrato, deciden si esto
merece un follow-up, si queda como deuda registrada o si no amerita nada. **No se asume ninguna
aprobación.**

---

*Verificado por Ender el 2026-09-20 sobre el corte `33f17785`, en trabajo independiente previo a conocer la
entrega del PR #5.*
