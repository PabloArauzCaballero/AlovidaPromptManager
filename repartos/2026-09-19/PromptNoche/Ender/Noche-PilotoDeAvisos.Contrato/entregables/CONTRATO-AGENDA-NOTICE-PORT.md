# Contrato — `AgendaNoticePort` (puerto de avisos de agenda, P8)

> Artefacto versionado. Itzan y Justin construyen contra **esta ficha**, sin abrir el
> repositorio de Mantra. Todo lo que el tipo garantiza y todo lo que sólo es comentario están
> separados explícitamente. Ver `PLAN.md` de esta misma carpeta para el alcance y la ambigüedad
> registrada sobre quién construye el validador de H2.

**Nota de fuente que falta.** La ficha de encargo cita repetidas veces `ARQUITECTURA_Y_CONTRATOS.md
§3` como la plantilla de esta ficha. Ese archivo **no existe** en ningún repo accesible desde esta
sesión — búsqueda realizada: `find` recursivo sobre toda `Mantra Core Technologies/` por
`ARQUITECTURA_Y_CONTRATOS*`, cero resultados; tampoco existen `METAPROMPT_PARA_ASTRA(1).md`,
`PILOTO_MANTRA.md` ni `PERFIL_MANTRA_DEV.md`. La estructura de esta ficha se reconstruyó a partir
de los campos que la propia ficha de encargo enumera microtarea por microtarea (H1.S1.M3,
H1.S2.M6, H1.S2.M7, H1.S3.M2), no del template ausente. Si `ARQUITECTURA_Y_CONTRATOS.md` aparece
más tarde con una forma distinta, esta ficha se reconcilia contra ella, no al revés.

---

## 0. Versionado del artefacto

| Versión | Hash (blob SHA-1 de git de este archivo, en el commit que lo publica) | Commit de este repo | Estado | Fecha |
|---|---|---|---|---|
| `v1.0.0` | commit `06dc3357bf9e38ab6626ac320717cb86257fbc72` (identidad canónica de esta versión) | `ender/contrato-agenda-notice-port` | `IMPLEMENTADO` (H1) | 2026-09-20 |

**Nota sobre auto-referencia.** Un archivo no puede contener el hash de su propio contenido
final: escribir el hash cambia el contenido y por lo tanto el hash. Por eso la identidad
inmutable de cada versión es el **commit de git** que la publica (columna "Hash" de esta tabla),
no un string SHA-256 embebido en la prosa — el mismo principio que usa git para sus propios
commits (el árbol se hashea aparte del commit que lo referencia). `evidencia/h1-s3-m3-*` documenta
el camino completo, incluida la vuelta atrás cuando intenté embeber un SHA-256 literal y noté el
problema.

Regla de esta tabla (ver §14): una fila publicada **no se edita**. Un cambio de contenido agrega
una fila nueva con su propio commit; la anterior queda intacta y se verifica por comparación de
hash de blob (H3/H5) contra el commit que la publicó, no contra el archivo editable en el
working tree.

---

## 1. Ficha de Identidad

| Campo | Valor |
|---|---|
| Nombre estable | `AgendaNoticePort` |
| Versión del contrato | `v1.0.0` (asignada por este equipo — **el archivo fuente no trae versión**, ver nota abajo) |
| Formato / dialecto | Interfaz TypeScript in-process (puerto de dominio, patrón hexagonal). **No es HTTP ni OpenAPI**: no hay request/response, no hay status code, no hay JSON sobre la red — es una llamada de método dentro del mismo proceso Node |
| Fuente | `src/modules/scheduling/ports/agenda-notice.port.ts`, corte `32ae939983f0d665e4ed371362858801134d35cd` |
| Hash del contenido exacto | `b462700cd8f382c0c42676cd931a2281198abaf5dca614cb739a47910bfb5877` (SHA-256, ver `evidencia/h1-s1-m1-hash-y-commit.txt`) |
| Commit de origen del archivo | `df2bcd685334e9a16b7f9dde0560f309bdb5706e` (`feat(scheduling): correo con enlace real y chat de SupportAdmin en avisos de agenda`, 2026-09-05) |
| Estado | `IMPLEMENTADO` — describe lo que hay, no un objetivo acordado. Toda excepción está marcada `TARGET_CONTRACT` o `HYPOTHESIS` explícitamente (§13) |

**Sobre "versión asignada, no leída".** El archivo fuente no declara ningún campo de versión de
contrato (ni un comentario `@version`, ni un export de versión). `v1.0.0` es una identidad que
este equipo le asigna al *snapshot documental*, no algo que el código exponga en runtime. Un
consumidor no puede preguntarle al puerto "¿qué versión sos?": la versión vive únicamente en este
artefacto, no en el código fuente.

**Drift del corte declarado.** `TARGET_REF` de la ficha de encargo es
`32ae939983f0d665e4ed371362858801134d35cd`, que coincide con el `dev` local de mi worktree. El
`origin/dev` remoto está **2 commits adelante** (`5d5007fb…`, 2026-09-19T21:33): `f1d46468` y
`a5753dc7`, ninguno de los cuales toca `agenda-notice.port.ts` ni ningún archivo de `scheduling/`
según el propio mensaje de commit (`iam` y regeneración de OpenAPI). No verifiqué el diff línea a
línea de esos dos commits porque tocar ese archivo habría sido lo único que invalidaría este
snapshot, y ninguno de los dos lo declara en su asunto — **hipótesis, no verificado por diff**.
Fijar cuál de los dos SHA es el corte de trabajo es decisión de Pablo (así lo dice la propia
verificación previa del 2026-09-19); esta ficha trabaja contra `32ae9399…`.

---

## 2. El archivo, literal

Bloque completo pegado en `evidencia/h1-s1-m2-archivo-literal-agenda-notice-port.ts` (133 líneas,
extraído con `git show 32ae9399…:src/modules/scheduling/ports/agenda-notice.port.ts`, no
transcrito de memoria). Los fragmentos citados abajo llevan número de línea de ese mismo archivo.

Las tres reglas que el comentario de cabecera impone a *cualquier* implementación (líneas 17–29):

1. **L19-22** — "Emitir no puede romper la agenda. Un aviso que falla se registra y se descarta;
   jamás revierte la reserva, la cancelación ni la promoción que lo originó." → esta es la cita de
   **código** de la tensión Q-06 (ver §11).
2. **L23-26** — "El aviso es navegable." Todo aviso lleva `relatedResourceType`/`relatedResourceId`
   y un destino en `payload`.
3. **L27-29** — "El destinatario se nombra por perfil, no por cuenta." La resolución de qué cuenta
   encarna al perfil es responsabilidad del adaptador, no del emisor de la agenda.

---

## 3. Semántica campo por campo: qué garantiza el tipo, qué es sólo comentario

### 3.1 `AgendaNoticeRecipient` (L44-53)

| Campo | Línea | Tipo TS | ¿El compilador lo exige? | Semántica (según lo leído) |
|---|---|---|---|---|
| `patientProfileId` | L50 | `string?` | Opcional — el compilador acepta `{}` vacío o `{ patientProfileId, userId }` con **ambos** presentes | Perfil de paciente destinatario. El adaptador resuelve la cuenta; sin cuenta de portal, el aviso no se entrega y se registra el motivo |
| `userId` | L52 | `string?` | Igual que arriba | Cuenta destinataria directa (ej. el profesional) |

**La regla "uno de los dos, no los dos" (L43) es exclusivamente un comentario JSDoc.** El tipo
`AgendaNoticeRecipient` es una interfaz con dos propiedades opcionales independientes — **no** una
unión discriminada. El compilador de TypeScript acepta sin error las cuatro combinaciones:
`{}`, `{ patientProfileId }`, `{ userId }`, `{ patientProfileId, userId }`. Esto responde
directamente el kill-test del hito: **no, el compilador NO impide construir un `recipient` con
sus dos campos vacíos**, y tampoco impide que tenga los dos llenos. La regla vive únicamente en
prosa; hacerla cumplir es el objeto de H2 (validación runtime).

### 3.2 `AgendaNotice` (L56-82)

| Campo | Línea | Tipo TS | ¿Obligatorio para el compilador? | Semántica |
|---|---|---|---|---|
| `kind` | L57 | `AgendaNoticeKind` | Sí | Uno de los 4 valores del catálogo cerrado (§4) |
| `recipient` | L58 | `AgendaNoticeRecipient` | Sí (el objeto; sus campos internos no) | Ver §3.1 |
| `tenantId` | L60 | `string?` | No | Organización del aviso; **la bandeja in-app la separa por tenant** — ver hallazgo de autorización en §7 |
| `subject` | L62 | `string` | Sí | Título corto, visible sin abrir el aviso |
| `bodyText` | L64 | `string` | Sí | Cuerpo con los datos concretos |
| `relatedResourceType` | L66 | `string` | Sí | Nombre de tabla del recurso al que lleva el aviso — **`string` libre, no un value set ni un tipo de marca** (hallazgo, ver §4) |
| `relatedResourceId` | L68 | `string?` | No | Id de ese recurso |
| `payload` | L73 | `Readonly<Record<string, unknown>>?` | No | Datos estructurados, incluido `payload.route` (el destino navegable) — **`unknown`, sin schema declarado**: el tipo no garantiza que `route` exista ni su forma |
| `debounceKey` | L79 | `string?` | No | Ver §6 |
| `actorUserId` | L81 | `string?` | No | Ver §7 |

### 3.3 `AgendaNoticeResult` (L85-118) — **los 8 campos reales**

> ⚠️ El paquete de origen (`PILOTO_MANTRA.md`, según cita la propia ficha de encargo) lista sólo
> 6 campos y omite `skippedReason` y `chatSkippedReason`. Esta tabla usa los **8** que el archivo
> declara. Gana el archivo.

| Campo | Línea | Tipo TS | Obligatorio | Qué prueba y qué NO prueba |
|---|---|---|---|---|
| `delivered` | L93 | `boolean` | Sí | **Sólo** que llegó a la bandeja in-app. No prueba correo entregado (`emailRequestId` es un campo aparte y "encolado" ≠ "entregado" — cita literal L103-105: *"acá no hay «entregado»: hay «encolado». La evidencia de que salió es la fila de `messaging.notification_deliveries`"*), no prueba chat entregado (`chatDelivered` es independiente) |
| `inAppNotificationId` | L95 | `string?` | No | Fila de la bandeja, sólo si se entregó |
| `notificationRequestId` | L97 | `string?` | No | Se crea **se haya entregado o no** — no implica éxito |
| `skippedReason` | L99 | `string?` | No | Motivo de no-entrega in-app. **Texto libre, no un código estable**: comparar por contenido de este string es una comparación frágil (ver §9) |
| `emailRequestId` | L107 | `string?` | No | Sólo indica que se **encoló** el correo, no que salió |
| `emailSkippedReason` | L109 | `string?` | No | Motivo de no-encolado del correo. Texto libre |
| `chatDelivered` | L115 | `boolean?` | No | **Ausente**, no `false`, para los 3 avisos que el pedido no manda por chat (`SLOT_RELEASED`, `PRACTITIONER_DELAY`, `APPOINTMENT_REMINDER` — sólo `BOOKING_STATE_CHANGED` toca el chat, ver adaptador L119-120 en `messaging-agenda-notice.adapter.ts`) |
| `chatSkippedReason` | L117 | `string?` | No | Motivo de no-entrega al chat. Texto libre |

**Ninguno de los 8 campos es obligatorio salvo `delivered`.** El tipo no impide, por ejemplo, un
resultado `{ delivered: true }` sin `notificationRequestId` ni `inAppNotificationId` — es
estructuralmente válido aunque sea contraintuitivo. La forma completa se valida en H2.S1.M2.

---

## 4. `AgendaNoticeKind` — catálogo cerrado (L33-41)

Cuatro valores, unión de literales string (no `enum` de TypeScript):

| Valor | Línea | Qué dispara |
|---|---|---|
| `SLOT_RELEASED` | L35 | Cupo liberado con lista de espera (3.4 / 4.3) |
| `PRACTITIONER_DELAY` | L37 | El profesional informó demora (3.5 / 4.2) |
| `APPOINTMENT_REMINDER` | L39 | Recordatorio 24h/2h |
| `BOOKING_STATE_CHANGED` | L41 | Cita aceptada/rechazada/reprogramada/cancelada |

**Hallazgo de terminología (`terminology-value-sets`):** este catálogo cerrado vive como una
unión de literales de TypeScript, no como un value set de conceptos codificados con `*_concept_id`.
Es exactamente el patrón que la skill marca como anti-patrón (*"`enum Status { ... }` en
TypeScript como fuente de verdad de un catálogo de negocio"*) — con el matiz de que acá **no hay
tabla detrás**: es un contrato interno entre servicios del mismo módulo, no una columna persistida
con FK. Lo registro como observación, no como algo a corregir en este carril (está fuera de
alcance: tocar el puerto es OUT). Si `AgendaNoticeKind` llegara a persistirse (ej. en el historial
de auditoría de avisos), ese sí sería el punto donde debería convertirse en concepto — no antes.

---

## 5. La regla «exactamente uno» de `recipient` — especificación de la validación runtime

**Lo que el tipo NO hace cumplir** (§3.1): nada impide `{}`, ni `{ patientProfileId, userId }`
juntos.

**Especificación del validador** (implementación en H2, `validador/`):

```text
Regla:      EXACTLY_ONE_RECIPIENT_FIELD
Entrada:    AgendaNoticeRecipient
Rechaza:    cero campos presentes (ambos undefined)
            dos campos presentes (ambos con valor)
Acepta:     exactamente uno de { patientProfileId, userId } con valor no vacío
Error:      { rule: 'EXACTLY_ONE_RECIPIENT_FIELD', message: '...', fields: ['patientProfileId','userId'] }
Fuente:     agenda-notice.port.ts L43 — comentario JSDoc, no tipo
Frontera:   este validador corre en el LABORATORIO (contra un doble), no dentro del
            adaptador real de Mantra (tocarlo está OUT de este carril)
```

No implemento la regla en Mantra: la especifico acá y la implemento como oráculo independiente en
`validador/` para H2.

---

## 6. `emitMany` — orden, cardinalidad y errores por elemento

Firma (L129): `emitMany(notices: readonly AgendaNotice[]): Promise<AgendaNoticeResult[]>`.

| Pregunta | Lo que la firma define | Lo que NO define |
|---|---|---|
| ¿La salida tiene la misma longitud que la entrada? | Nada en el tipo lo garantiza (`Promise<AgendaNoticeResult[]>` no está indexado por longitud) | — |
| ¿El orden de salida sigue al de entrada? | Nada en el tipo lo garantiza | `DECISION_REQUIRED` — la firma no lo dice, y "prohibido asumir que el orden de salida sigue al de entrada si la firma no lo dice" es literal de la ficha de encargo |
| ¿Un elemento que falla cancela los demás? | El comentario L128 dice que no ("Un aviso que falla no cancela los demás") — **comentario, no tipo** | — |

**Comportamiento observado en la única implementación real** (`MessagingAgendaNoticeAdapter`,
`messaging-agenda-notice.adapter.ts` L163-171): un `for...of` secuencial que hace
`resultados.push(await this.emit(notice))` — esto **sí** preserva longitud y orden 1:1 con la
entrada, y como `emit()` nunca lanza (§9), ningún elemento cancela a los demás. **Pero esto es el
comportamiento de un adaptador concreto, no una garantía del contrato**: un segundo adaptador
(el que P1 va a proveer, según el comentario de cabecera L12-13) podría paralelizar y no
garantizar orden. Cualquier consumidor que dependa de `resultados[i]` correspondiéndose con
`notices[i]` está confiando en una implementación, no en el contrato — **hallazgo para Justin**.

Motivo documentado del `for` en serie (L159-162): *"son escrituras contra la misma base y el lote
lo produce un worker que no tiene prisa. Lanzarlas juntas sólo adelantaría la saturación del pool
de conexiones."* — decisión de rendimiento del adaptador, no del contrato.

---

## 7. `debounceKey` — lo que dice y lo que no

Cita literal (L74-78): *"Clave de rebote: dos avisos con la misma clave no se duplican mientras el
primero siga vivo. Es lo que impide que un worker que reintenta un lote llene la campana del
paciente con el mismo recordatorio."*

**Lo que dice:** existe una noción de "vivo" bajo la cual una segunda emisión con la misma clave
se descarta (se resuelve como "rebotada": ver `messaging-agenda-notice.adapter.ts` L232-241,
`request.debounced`).

**Lo que NO dice, y que la ficha de encargo prohíbe explícitamente inventar:** ninguna ventana de
tiempo, ningún TTL, ningún criterio de cuándo deja de estar "vivo". `DECISION_REQUIRED`.

**Límite de confianza, no de este contrato.** El campo `debounced` que resuelve "vivo" se computa
en `NotificationsService.createRequest` (`src/modules/messaging/services/notifications.service.ts`
L179 y L255), que pertenece al contrato del canal in-app de P1 — fuera del puerto que esta ficha
gobierna. `AgendaNoticePort` **consume** esa decisión pero no la especifica. No investigué más
adentro de `notifications.service.ts` por disciplina de alcance: la pregunta de esta microtarea es
qué dice *este* puerto, no cómo funciona P1.

---

## 8. Ficha de Autorización

| Pregunta | Respuesta |
|---|---|
| ¿Quién identifica al **actor** (quién causa el aviso)? | `actorUserId?: string` (L81), opcional. Si se omite, el comentario dice que se usa "la cuenta de servicio del worker" por defecto (`SEED.systemWorkerUserId`, visto en el adaptador L196) |
| ¿El puerto autentica al actor? | **No.** No hay token, no hay sesión: es una llamada in-process de un servicio ya autenticado en la capa HTTP que lo originó. El puerto **confía completamente** en el llamador |
| ¿Quién identifica al **tenant**? | `tenantId?: string` (L60), **opcional** |
| ¿Qué pasa si se omite el tenant? | En el adaptador real, se omite del payload hacia `notifications.createRequest` (`...(notice.tenantId === undefined ? {} : { tenantId: notice.tenantId })`, L198) — la solicitud de notificación se crea **sin tenant explícito** |
| ¿Quién identifica al **titular del recurso** (de quién son los datos)? | `recipient.patientProfileId` o `recipient.userId` (§3.1). No hay verificación en el tipo de que ese perfil sea realmente el titular del `relatedResourceId` referenciado — el puerto confía en que el llamador ya lo validó |

**Hallazgo de seguridad a registrar (no a resolver en este carril):** `tenantId` es **opcional en
el tipo**, y su ausencia se propaga como ausencia real en la solicitud de notificación (no hay un
valor por defecto ni una validación que lo exija). Un caller nuevo que arme un `AgendaNotice` sin
`tenantId` produciría un aviso sin aislamiento de tenant explícito en la capa de mensajería. No
verifiqué si `NotificationsService` tiene una defensa propia contra esto (está fuera del puerto
que audito); lo registro como riesgo para la matriz de H6, dueño: quien mantenga el módulo
`messaging` — no yo.

`patientProfileId` es dato de paciente (PHI-adyacente: identifica a una persona en un sistema de
salud). No debe registrarse en logs sin control — el propio adaptador ya lo trata así (lo loguea
como campo estructurado de un logger, no en texto libre, `messaging-agenda-notice.adapter.ts`
L172), lo cual es consistente con `data-privacy-phi` aunque esa skill no está en mi lote de 22
(se activa igual por regla del router §1).

---

## 9. Ficha de Errores

| Modo de fallo | Forma | ¿Reintentable? |
|---|---|---|
| `emit()` lanza una excepción | **No ocurre por contrato.** L122-124: "Emite un aviso. **No lanza**: los fallos vuelven como `{ delivered: false, skippedReason }`" | N/A — no hay excepción que reintentar |
| Fallo interno del adaptador (ej. la base no responde) | Capturado por el adaptador (`try/catch` en `emit()`, `messaging-agenda-notice.adapter.ts` L135-151) y convertido a `{ delivered: false, skippedReason: 'La emisión del aviso falló; la operación no se revierte' }` | `DECISION_REQUIRED` — el puerto no distingue "fallo transitorio, reintentable" de "fallo permanente, no reintentable". El string de `skippedReason` en este caso concreto **no es un código estable**: es prosa fija de este adaptador, no algo que el contrato promete |
| Falta de destinatario, preferencia en contra, canal caído | `skippedReason`/`emailSkippedReason`/`chatSkippedReason`, todos `string?` | No aplica — no es un fallo, es un resultado de negocio válido |

**Hallazgo:** no existe una taxonomía de errores tipificada (`error-handling-contract` exige
`code` `SCREAMING_SNAKE` estable para que el cliente decida por código, nunca por texto). Acá los
tres campos `*SkippedReason` son `string` libre. **Verifiqué que ningún consumidor actual
compara por contenido de estos strings** (grep de los 4 puntos de emisión reales en
`scheduling-agenda-notices.service.ts`, `scheduling-bookings.service.ts`,
`scheduling-delay.service.ts`, `scheduling-catalog.service.ts`: los cuatro sólo leen
`resultado.delivered` como booleano y cuentan/loguean — ninguno hace
`skippedReason.includes(...)`). Esto es un hecho favorable hoy, pero el tipo no lo protege contra
mañana: nada impide que un futuro consumidor empiece a comparar por texto.

---

## 10. Efectos posteriores

| Pregunta | Respuesta |
|---|---|
| ¿Es el aviso un efecto **obligatorio** o **de mejor esfuerzo**? | El puerto lo trata como **de mejor esfuerzo**: L19-22 dice explícitamente que un fallo "se registra y se descarta" sin revertir nada. Ver tensión Q-06 en §11 — esto es lo que un lado de la tensión sostiene; el otro lado (el metaprompt) no lo pude citar (§11) |
| ¿Corre dentro o fuera de la transacción que lo origina? | **Fuera, siempre.** L21-22: "los servicios lo invocan *después* de confirmar su transacción y nunca dentro de ella" |
| ¿Hay outbox/reintento automático si `emit()` devuelve `delivered: false`? | **No verificado en este puerto.** El puerto no lo declara; sería responsabilidad de quien llama, y no revisé los 4 call-sites para confirmar si reintentan (fuera del alcance de esta microtarea: es sobre el puerto, no sobre sus llamadores) |

---

## 11. Tensión Q-06 — semántica del aviso (registrada, NO resuelta)

**Cita del lado "código" (verificada, L19-22 de `agenda-notice.port.ts`):**
> "Emitir no puede romper la agenda. Un aviso que falla se registra y se descarta; jamás revierte
> la reserva, la cancelación ni la promoción que lo originó."

**Cita del lado "metaprompt" (durabilidad exigida para efectos obligatorios): ENCONTRADA.**
El archivo no vive en ningún repo de `Mantra Core Technologies/` (esa fue la búsqueda original,
sin resultados); vive en `~/Downloads/METAPROMPT_PARA_ASTRA.md` (306 líneas, sin el sufijo `(1)`
que usa la ficha de encargo — mismo documento, otra copia local). Cita literal, L96:

> "Para efectos posteriores obligatorios, comprobar el mecanismo duradero existente. Cuando falte,
> proponer una solución localizada de intención persistida y reintentos. Diferenciar evento en
> memoria, solicitud encolada, aceptación del proveedor y evidencia de entrega. No prometer
> procesamiento exactamente una vez sin demostrar la garantía; diseñar efectos idempotentes."

Salida completa en `evidencia/h1-s3-m1-cita-metaprompt.txt`.

**Estado:** `DECISION_REQUIRED` — **sigue así a propósito, ahora con las dos citas completas.**
Tenerlas ambas no resuelve la tensión: el metaprompt exige un mecanismo duradero **para efectos
que sean obligatorios**, y el puerto trata al aviso como no-obligatorio (se descarta sin revertir
nada). Cuál de los dos describe lo que el aviso de agenda **debería ser** es precisamente lo que
nadie de este equipo puede decidir por su cuenta — es la clasificación de negocio pendiente.
Dueño: negocio (Marcelo, según handoff H4/H5 de la propia ficha). **No elijo un lado**: ni "el
aviso puede perderse" ni "el aviso debe ser durable" quedan asumidos en este documento ni en el
validador de H2.

---

## 12. Inventario de consumidores actuales (corte `32ae9399…`)

Ver `evidencia/h1-s1-m4-inventario-consumidores.txt` para el grep completo. Resumen:

| Archivo | Qué usa | Cómo |
|---|---|---|
| `scheduling.module.ts` | `AGENDA_NOTICE_PORT` | Binding del provider: `{ provide: AGENDA_NOTICE_PORT, useExisting: MessagingAgendaNoticeAdapter }` (L142) |
| `services/scheduling-agenda-notices.service.ts` | `AGENDA_NOTICE_PORT`, `AgendaNotice`, `AgendaNoticePort` | Inyecta el puerto, llama `emitMany()` dos veces (cupo liberado, recordatorios) |
| `services/scheduling-bookings.service.ts` | ídem | Inyecta el puerto, llama `emitMany()` (L681) y `emit()` (L2486) |
| `services/scheduling-delay.service.ts` | ídem | Inyecta el puerto, llama `emitMany()` (L226) |
| `services/scheduling-catalog.service.ts` | ídem | Inyecta el puerto, llama `emit()` (L890) |
| `notices/agenda-notices.ts` | `AgendaNotice` (tipo) | Fábricas puras que construyen los 7 tipos de aviso concretos (una por punto de emisión) |
| `adapters/messaging-agenda-notice.adapter.ts` | Implementa `AgendaNoticePort` | La única implementación real hoy |
| `adapters/support-admin-notice.adapter.ts` | `AgendaNotice` (tipo) | Colabora con el adaptador para el envío por chat |
| `adapters/*.spec.ts` (2 archivos) | `AgendaNotice` (tipo) | Tests del adaptador y del sub-adaptador de chat |
| `profiles/ports/affiliation-notice.port.ts` | Ninguno funcional — sólo lo **menciona en un comentario** ("Mismo criterio que `AgendaNoticePort` en scheduling") como precedente de diseño para un puerto hermano | No es un consumidor real; lo señalo porque el grep lo trae y descartarlo en silencio sería ocultar un resultado del propio grep |

**Todo cambio de contrato afecta como mínimo a estos 9 archivos funcionales** (excluyendo el
comentario de `affiliation-notice.port.ts` y los 2 `.spec.ts`, que son consumidores de test, no de
producción — aunque un cambio incompatible también los rompería a ellos).

---

## 13. `IMPLEMENTED_CONTRACT` vs `TARGET_CONTRACT` vs `HYPOTHESIS`

| Categoría | Contenido |
|---|---|
| **`IMPLEMENTED_CONTRACT`** | Todo §2 a §9 salvo lo marcado abajo: los 4 valores de `AgendaNoticeKind`, los campos de las 4 interfaces con su obligatoriedad real, que `emit()` nunca lanza, que `delivered` es sólo in-app, que el `for` de `emitMany` es secuencial **en el adaptador actual**, el inventario de consumidores de §12 |
| **`TARGET_CONTRACT`** | La versión `v1.0.0` asignada por este equipo (no leída del archivo); la especificación del validador de §5 (no implementada todavía en el puerto — vive en el laboratorio de H2) |
| **`HYPOTHESIS`** | Ninguna en este documento. Todo lo que no pude verificar quedó como `DECISION_REQUIRED` o `BLOQUEADO`, no como hipótesis encubierta: la tensión Q-06 (§11, lado metaprompt), el TTL de `debounceKey` (§7), la reintentabilidad de errores (§9), el orden garantizado de `emitMany` (§6), el efecto de `tenantId` ausente aguas abajo en `messaging` (§8, no verificado por estar fuera del puerto) |

---

## 14. Publicación del snapshot v1.0.0

- **Ruta del artefacto:** este mismo archivo, `CONTRATO-AGENDA-NOTICE-PORT.md`, en la rama
  `ender/contrato-agenda-notice-port` de `AlovidaPromptManager`.
- **Commit del que sale (Mantra):** `32ae939983f0d665e4ed371362858801134d35cd`.
- **Hash del contenido del puerto que documenta:** `b462700cd8f382c0c42676cd931a2281198abaf5dca614cb739a47910bfb5877`.
- **Commit de publicación de este artefacto (AlovidaPromptManager):** `06dc3357bf9e38ab6626ac320717cb86257fbc72`
  (ver `evidencia/h1-s3-m3-commit-y-blob-v1.txt` para el historial de cómo se fijó).
- **Cómo se referencia:** por versión (`v1.0.0` en la tabla de §0 y por el commit de este repo),
  no por rama de Mantra — si `dev` avanza, este documento no cambia solo; un cambio real del
  archivo fuente produce una microtarea nueva de re-verificación, no una edición silenciosa de
  esta ficha.
- Aviso pendiente en el daily del equipo (ver `Ender-Daily-Noche-2026-09-19.md`, sección de
  handoff): Itzan y Justin ya pueden construir contra §3, §5, §6, §8, §9.
