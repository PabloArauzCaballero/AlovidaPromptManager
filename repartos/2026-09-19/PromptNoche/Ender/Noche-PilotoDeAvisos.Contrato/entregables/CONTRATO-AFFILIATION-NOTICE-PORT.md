# Contrato — `AffiliationNoticePort` (segunda capacidad: vínculo profesional–organización)

> **Ficha de la SEGUNDA capacidad (H3.S3).** Se abre porque el insumo que faltaba ya existe:
> Pablo eligió la segunda capacidad en su H3 —`AffiliationNoticePort`, con criterio escrito antes
> de elegir— y cerró su lote en 53/53. Cuando esta subtarea se cerró `DESCARTADO` la ficha de Pablo
> estaba en `0/53`; **ese motivo caducó y por eso la subtarea se reabre y se cierra**, que es
> exactamente la condición de reapertura que se dejó declarada.
>
> **No copia el contrato entero de `AgendaNoticePort`.** Reusa lo que corresponde, lo declara en
> §5, y nombra lo que NO se reusa y por qué. Copiar todo para disimular una dependencia es
> justamente lo que el DoD de `H3.S3.M2` prohíbe.

## 0. Versionado del artefacto

| Campo | Valor |
|---|---|
| Identidad asignada | `AffiliationNoticePort@11a8ea26` |
| Archivo | `src/modules/profiles/ports/affiliation-notice.port.ts` (61 líneas) |
| Blob sha1 del archivo | `447ef3cee272cce22ae0c408ab2abb879c196f56` |
| Último commit que lo tocó | `11a8ea262d7e5fcb7537dc2c324a690aa4dc88d7` (2026-08-26T15:49:00-04:00) |
| Declara versión propia | **No.** Igual que el primero: la identidad es **asignada**, por commit + hash |
| Corte de lectura | `dev` al 2026-09-20 |

**Misma decisión de versionado que el primer contrato, y por el mismo motivo:** `Q-05` (convención
de versionado) sigue abierta, así que no se numera `v1.0.0` — se fija commit y hash, que son
verificables hoy.

## 1. Ficha de Identidad

| Campo | Valor |
|---|---|
| Token de inyección | `AFFILIATION_NOTICE_PORT`, un **`Symbol`** (no una cadena) |
| Método | **Uno solo: `emit`.** No hay `emitMany` |
| Firma | `emit(notice: AffiliationNotice): Promise<AffiliationNoticeResult>` |
| Implementación actual | `MessagingAffiliationNoticeAdapter` (`src/modules/profiles/adapters/messaging-affiliation-notice.adapter.ts:48`) |
| Binding | `{ provide: AFFILIATION_NOTICE_PORT, useClass: MessagingAffiliationNoticeAdapter }` — `profiles.module.ts:91`. **`useClass`**, no `useExisting`: difiere del primero |
| Consumidor real | `ProfilesAffiliationsService` (`profiles-affiliations.service.ts:173`), que lo recibe por `@Inject` |

## 2. Semántica campo por campo — qué garantiza el tipo y qué es sólo comentario

### 2.1 `AffiliationNotice` (L28-40)

| Campo | Tipo | Obligatorio por el **tipo** | Nota |
|---|---|---|---|
| `kind` | `AffiliationNoticeKind` | **Sí** | Catálogo cerrado de 4, §3 |
| `recipientUserId` | `string` | **Sí** | **Diferencia dura con el primer contrato:** acá el destinatario es **una cuenta, obligatoria y única**. No hay ambigüedad posible |
| `tenantId` | `string` | **Sí** | **Y acá también:** es obligatorio, no opcional |
| `subject` | `string` | **Sí** | Título corto para la campana |
| `bodyText` | `string` | **Sí** | Cuerpo, con el motivo cuando la organización lo dio |
| `affiliationId` | `string` | **Sí** | El vínculo al que lleva el aviso |

**Los seis campos son obligatorios y ninguno es opcional.** Es un contrato materialmente más
estricto que el primero.

### 2.2 `AffiliationNoticeResult` (L48-52) — **sólo 2 campos**

| Campo | Tipo | Nota |
|---|---|---|
| `delivered` | `boolean` | Si llegó a la bandeja |
| `skippedReason` | `string?` | Por qué no se entregó: sin cuenta, preferencia en contra, canal caído |

**Dos campos, contra los ocho del primero.** No hay `notificationRequestId`, ni nada de correo, ni
nada de chat. Un consumidor que espere la forma del primer resultado **se rompe**: son contratos
distintos, no dos versiones del mismo.

## 3. `AffiliationNoticeKind` — catálogo cerrado (L12-25)

| Valor | A quién va |
|---|---|
| `AFFILIATION_APPROVED` | Al profesional |
| `AFFILIATION_REJECTED` | Al profesional |
| `AFFILIATION_REVOKED` | Al profesional |
| `AFFILIATION_REQUESTED` | **A la organización** — el único que no viaja al médico |

Cuatro valores, igual que el primero, pero **con una asimetría que el primero no tiene**: tres van
al profesional y uno va a la organización. El comentario del propio archivo lo dice: *«Es el único
que no viaja al médico. Sin él, la bandeja de solicitudes depende de que alguien entre a mirarla
por las dudas — y nadie lo hace.»*

Verificado en los dos puntos de emisión reales: `profiles-affiliations.service.ts:571` (los tres
del profesional, con el `kind` resuelto por la decisión) y `:628` (el `AFFILIATION_REQUESTED`, en
un bucle sobre los administradores de la organización).

## 4. La promesa dura: `emit` no lanza

Literal del archivo (L56): *«Emite un aviso. **No lanza**: los fallos vuelven en el resultado.»*
Y en el encabezado de `AffiliationNoticeResult` (L42-47): *«**Nunca una excepción**: que no salga
un aviso no puede impedir que una organización apruebe o rechace. La decisión ya está tomada y
escrita.»*

**Es la misma promesa que el primer contrato, redactada casi igual.** Es el mecanismo que sí se
reusa, y está probado: el laboratorio de Pablo lo ejercita en sus tres niveles.

## 5. Qué se reusa del primer contrato y qué NO (`H3.S3.M2`)

### 5.1 Se reusa — con la evidencia que lo respalda

| Qué | Por qué se puede reusar | Evidencia |
|---|---|---|
| **La promesa «`emit` no lanza»** | Redactada igual en los dos archivos, y es el invariante sobre el que se construyó el doble | `AgendaNoticePort` L85-86 · `AffiliationNoticePort` L42-47, L56 |
| **La forma del doble de laboratorio** | `PortOnlyNoticeAdapter` de Pablo depende sólo de un `Emisor` inyectado (una función), no de `NotificationsService`: el mismo patrón sirve acá sin cambios de forma | `test/lab/port-only-notice.adapter.ts`, 11/11 en tres niveles |
| **Los tres niveles de prueba del contrato** | La estructura aceptado / límite / inválido aplica igual; cambian los casos, no el método | `test/integration/agenda-notice-contract-regression.int-spec.ts`, 13/13 |
| **La identidad por commit + hash** | `Q-05` sigue abierta para los dos | §0 de las dos fichas |
| **El diagnóstico del arrastre de módulo** | `profiles.module.ts:72` importa `MessagingModule` completo, igual que `scheduling.module.ts:60`. Es el mismo defecto de composición, no uno nuevo | Corte de Pablo §11.3 |

### 5.2 NO se reusa — y por qué

| Qué | Por qué NO |
|---|---|
| **La forma del resultado** | 2 campos contra 8. El validador del primer contrato rechazaría todo resultado válido de éste |
| **La regla «exactamente uno» de `recipient`** | **No aplica**: acá el destinatario es un `recipientUserId: string` obligatorio y único. La ambigüedad que el primer contrato tiene como comentario, acá **no existe por tipo** |
| **El hallazgo `SEC-PORT-1`** | **No aplica**: `tenantId` es obligatorio acá. El agujero de autorización del primer puerto no se repite en éste |
| **`emitMany`** | **No existe** en este contrato. Todas las ambigüedades del primero sobre orden y cardinalidad del lote son inaplicables |
| **`debounceKey`** | **No existe.** Ni la clave de rebote ni su ventana indefinida. La duplicación que Justin midió (`HALL-03`) **no tiene superficie acá** |
| **Los campos de correo y chat** | No existen. Este puerto es sólo in-app |
| **La tensión `Q-06`** | Se arrastra **conceptualmente** (¿un aviso fallido se descarta o exige durabilidad?), pero el texto del primer contrato no se copia: acá el comentario es propio y más corto |

## 6. Lo que esta ficha NO afirma

- **No se ejecutó nada de esta capacidad.** Todo lo de arriba es lectura del archivo real con
  localizador: peldaño `DISCOVERED`, no `TESTED`. El laboratorio para ejercitarla es el trabajo que
  Pablo estimó en su H3 (~2-3,5 h) y que no entra en este turno.
- **No se decide `Q-06` para esta capacidad**, igual que no se decidió para la primera. Sigue
  siendo de negocio.
- **No se propone cambiar el binding** de `profiles.module.ts`: ese archivo no está reservado para
  este carril y el cambio depende de la misma decisión pendiente.
