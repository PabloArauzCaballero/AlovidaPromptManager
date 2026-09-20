# Verificación de los prompts contra el código real — 2026-09-19

> **Qué es esto:** las afirmaciones técnicas del reparto salían del paquete `BACKEND_AUTONOMO_MANTRA`,
> que es **la lectura de otra persona, hecha sobre un corte y con fecha del 20-09-2026**. Nadie las
> había contrastado contra el repositorio. Esto las contrasta.
>
> **Qué NO es:** una verificación de comportamiento. Comprobé que los archivos, los símbolos y los
> textos **existen y dicen lo que dicen**. **No ejecuté nada del backend**: ni build, ni tests, ni
> arranque. Un símbolo que existe no prueba que haga lo que su comentario promete.

| Campo | Valor |
|---|---|
| Método | Clon parcial de solo lectura en el scratchpad; `git cat-file -p <SHA>:<ruta>` y `git ls-tree -r`. **No** `git grep`: sobre un clon parcial da falsos negativos (ver §1) |
| Corte verificado | `32ae939983f0d665e4ed371362858801134d35cd` — el que citan los prompts |
| Escrituras en `mantra-core-health-api` | **Ninguna.** Lectura exclusivamente |
| Peldaño alcanzado | `DISCOVERED` — localicé piezas reales. **No** `TESTED`: no corrí nada del backend |

## 0. El corte se movió

```text
$ git cat-file -t 32ae939983f0d665e4ed371362858801134d35cd
commit

$ git log -1 --format='%H %cI %s' origin/dev
5d5007fbdb7916b124010bbfbb560b7bb3aabc06 2026-09-19T21:33:02-04:00
Merge pull request #442 from mdavila-2001/itzan/f09-mch008-2-encounter-coherence

$ git merge-base --is-ancestor 32ae939... origin/dev ; echo $?
0

$ git rev-list --count 32ae939...origin/dev
2
```

**El SHA del paquete es ancestro de `dev`, y hay 2 commits de diferencia.** El corte del paquete
sigue siendo alcanzable y reproducible. **Cuál de los dos es el corte de trabajo lo fija Pablo**
(su microtarea `H1.S1.M1`): esto no lo decide esta verificación.

Dato colateral: el `HEAD` de `dev` es un merge de una rama llamada `itzan/…`, lo que sugiere que el
equipo ya trabaja con ramas por persona en ese repo.

## 1. Las cinco rutas citadas existen

| Ruta citada en los prompts | En el corte |
|---|---|
| `src/modules/scheduling/ports/agenda-notice.port.ts` | **EXISTE** |
| `src/modules/scheduling/scheduling.module.ts` | **EXISTE** (145 líneas) |
| `src/orm/config/orm.config.ts` | **EXISTE** |
| `src/persistence/ports/transaction.port.ts` | **EXISTE** |
| `test/jest-integration.json` | **EXISTE** |

Y los tres símbolos que el prompt de Pablo manda localizar, con su ruta real:

| Símbolo | Ruta real | Línea | Tiene test |
|---|---|---|---|
| `SchedulingDelayService` | `src/modules/scheduling/services/scheduling-delay.service.ts` | 76 | **sí**, `.spec.ts` al lado |
| `SchedulingAgendaNoticesService` | `src/modules/scheduling/services/scheduling-agenda-notices.service.ts` | 36 | **sí** |
| `MessagingAgendaNoticeAdapter` | `src/modules/scheduling/adapters/messaging-agenda-notice.adapter.ts` | 117 | **sí** |
| `SupportAdminNoticeAdapter` | `src/modules/scheduling/adapters/support-admin-notice.adapter.ts` | 43 | — |

Y una precisión que el paquete no daba: **`MessagingAgendaNoticeAdapter implements AgendaNoticePort`**,
declarado en la propia clase. El adaptador y el puerto están atados por tipo, no solo por el binding.

**Dato que ningún prompt tenía: los tres ya tienen tests.** Eso cambia el punto de partida: no se
empieza de cero, se empieza leyendo qué fijan esos tests.

### ⚠️ Una trampa de método que les va a pasar a ustedes también

La primera vez que busqué estas clases usé `git grep "class X" <SHA>` sobre un **clon parcial**
(`--filter=blob:none --no-checkout`) en una ruta larga de Windows. Devolvió:

```text
  NOT_FOUND   SchedulingDelayService
  NOT_FOUND   SchedulingAgendaNoticesService
  NOT_FOUND   MessagingAgendaNoticeAdapter
```

**Las tres existen.** El `NOT_FOUND` era falso: `git` fallaba con
`fatal: failed to stat '<SHA>:<ruta>': Filename too long` —el límite de ruta de Windows— y el
`2>/dev/null` del comando se comía el error. Un clon parcial además no tiene los blobs bajados,
así que `git grep` tampoco es fiable ahí.

**Lo que funciona:** `git cat-file -p <SHA>:<ruta>`, que lee el objeto sin tocar el sistema de
archivos, y `git ls-tree -r --name-only <SHA>` para los nombres.

Esto es exactamente lo que los prompts previenen cuando dicen **«un 404 no demuestra inexistencia»**
y **«no des por buena una ruta que no abriste»**. Acá el error fue al revés y peor: una herramienta
dijo que algo no existía, y existía. **Si tu búsqueda no encuentra algo, verificá primero que tu
búsqueda funcione.**

## 2. El contrato del puerto — donde el paquete se quedó corto

### 2.1 Lo que el paquete decía bien

- `AgendaNoticePort`, `emit`, `emitMany` y `AGENDA_NOTICE_PORT`: **los cuatro existen.**
- `AGENDA_NOTICE_PORT` es un **`Symbol`**, no una cadena: `export const AGENDA_NOTICE_PORT = Symbol('AGENDA_NOTICE_PORT');`
- El archivo **no declara versión de contrato**. Confirmado: hay que fijar snapshot y hash.
- `debounceKey` existe y **no define ventana ni TTL**. Su comentario dice, literal: *«dos avisos con
  la misma clave no se duplican mientras el primero siga vivo»*. **«Mientras siga vivo» no es una
  ventana:** sigue siendo `DECISION_REQUIRED`, como decía el prompt.
- La regla «exactamente uno» de `recipient` **existe como comentario, no como tipo**. Literal:
  `/** A quién va dirigido el aviso. Uno de los dos, no los dos. */`, sobre una interfaz con
  `patientProfileId?: string` y `userId?: string`, **ambos opcionales**. Confirmado: el compilador
  no la hace cumplir.

### 2.2 Lo que el paquete decía MAL — corregido

`PILOTO_MANTRA.md` paso 2 lista **6 campos** del resultado. El archivo real tiene **8**:

| Campo | ¿Estaba en la tabla del paquete? | Significado según el archivo |
|---|---|---|
| `delivered` | sí | Si llegó a la bandeja in-app. **Sólo in-app**, no «llegó por algún canal» |
| `inAppNotificationId` | sí | Fila de la bandeja in-app, cuando se entregó |
| `notificationRequestId` | sí | Solicitud creada, se haya entregado o no |
| **`skippedReason`** | **NO** | Por qué no se entregó: sin cuenta, preferencia en contra, canal caído |
| `emailRequestId` | sí | Correo **encolado**, no entregado |
| `emailSkippedReason` | sí | Por qué no se encoló el correo |
| `chatDelivered` | sí | Si llegó al chat de `SupportAdmin`. **Ausente** para cupo liberado, demora y recordatorio |
| **`chatSkippedReason`** | **NO** | Por qué no llegó al chat |

**El paquete omitió `skippedReason` y `chatSkippedReason`.** Un doble construido contra la tabla
del paquete habría devuelto resultados incompletos, y el validador de Ender los habría aceptado.

### 2.3 Dos cosas que el paquete no mencionaba

1. **`emit` nunca lanza.** Literal: *«**No lanza**: los fallos vuelven como
   `{ delivered: false, skippedReason }`»*. Esto es central para el harness de Justin: el fake
   **no puede** convertir una llamada no registrada en `{delivered:false}`, porque eso es
   indistinguible de un fallo operacional legítimo del puerto real.
2. **`AgendaNoticeKind` tiene exactamente cuatro valores**: `SLOT_RELEASED`, `PRACTITIONER_DELAY`,
   `APPOINTMENT_REMINDER`, `BOOKING_STATE_CHANGED`. El catálogo del laboratorio se construye sobre
   estos cuatro, no sobre una lista inventada.

### 2.4 La tensión `Q-06` está confirmada, literal

El comentario de cabecera del puerto dice:

> *«**Emitir no puede romper la agenda.** Un aviso que falla se registra y se descarta; jamás
> revierte la reserva, la cancelación ni la promoción que lo originó.»*

Contra la exigencia de durabilidad para efectos obligatorios del metaprompt. **La contradicción es
real y está por escrito en el código.** Sigue siendo `DECISION_REQUIRED` — de negocio, no del equipo.

## 3. La composición de scheduling

Confirmado, con localizador:

| Afirmación del prompt | Verificado |
|---|---|
| Importa `MessagingModule` | **sí**, líneas 60 y 90 |
| Importa `CommunityModule` | **sí**, líneas 64 y 91 |
| Importa entidades de perfiles | **sí**: `import * as profileEntities from '../profiles/entities'` |
| Vincula el puerto al adaptador de mensajería | **sí**, línea 142 |

**Precisiones que el paquete no daba:**

- El binding exacto es `{ provide: AGENDA_NOTICE_PORT, useExisting: MessagingAgendaNoticeAdapter }`.
  Es **`useExisting`**, no `useClass`: el adaptador ya está provisto en otro lado y acá se reusa esa
  instancia. Eso cambia cómo se sustituye.
- **Hay un segundo adaptador que el paquete nunca mencionó**: `SupportAdminNoticeAdapter`
  (`./adapters/support-admin-notice.adapter`, línea 72). Cualquier análisis de la composición que
  lo ignore está incompleto.
- Los módulos importados son **ocho**: `AuditModule`, `DirectoryModule`, `PracticeModule`,
  `MessagingModule`, `CommunityModule`, `InsuranceModule`, `ProfilesModule`, `CommonModule`.

## 4. El ORM

Los cuatro puntos del prompt de Itzan, confirmados con línea:

| Afirmación | Verificado |
|---|---|
| Descubre entidades por globs globales | **sí**, líneas 57-61: `dist/modules/**/entities/*.entity.js`, `dist/src/modules/**/…`, y `entitiesTs: ['src/modules/**/entities/*.entity.ts']` |
| Usa `TsMorphMetadataProvider` | **sí**, líneas 3 y 68 |
| Hay caché de metadata | **sí**, líneas 78-81, en `node_modules/.cache/mikro-orm` |
| Registra `HistoryMirrorSubscriber` | **sí**, líneas 7 y 129 |

**Y el aviso del paquete sobre los conteos en comentarios está justificado**: la línea 67 dice
*«el coste de analizar 1159 archivos se paga una vez»*. **1159 es un comentario, no una medición
vigente.** No se adopta como inventario.

## 5. El puerto de transacción

| Afirmación | Verificado |
|---|---|
| Existe `TransactionManager` | **sí**, `export interface TransactionManager` |
| Existe `execute` | **sí**: `execute<T>(operation: (transaction: TransactionContext) => Promise<T>, …)` |
| Existe `TransactionContext` | **sí, pero no acá**: se importa de `./persistence-context` |
| Token de inyección | `TRANSACTION_MANAGER = Symbol('TRANSACTION_MANAGER')` — el paquete no lo nombraba |

Hay además `TransactionOptions`. **La propagación sigue sin verificarse**: eso exige ejecutar.

## 6. Los comandos que existen de verdad

`package.json` del corte declara **112 scripts**. Los que importan para el trabajo:

| Para qué | Script real |
|---|---|
| Typecheck | `typecheck` → `tsc --noEmit --incremental false -p tsconfig.json` |
| Build | `build` → `nest build` |
| Lint | `lint` → `eslint "{src,apps,libs,test}/**/*.ts"` |
| Unitarios | `test` → jest con `--experimental-vm-modules` |
| Integración | `test:integration` → `cross-env ORM_SCHEMA_SYNC=off RATE_LIMIT_DISABLED=true …` |
| E2E | `test:e2e` → `jest --config ./test/jest-e2e.json` |
| Smoke | `smoke` |
| Infra local | `infra:up` → `docker compose up -d redis opensearch opensearch-init minio mock-provider-server` |

`packageManager: yarn@4.14.1`, **coincide** con lo que reportaba el paquete.

`test/jest-integration.json` confirmado: `maxWorkers: 1`, `@swc/jest`, `testTimeout: 180000`,
`testMatch` sobre `test/integration/**/*.int-spec.ts`.

**Dato relevante para el Día 2:** `test:integration` fija `ORM_SCHEMA_SYNC=off`. El esquema **no**
se sincroniza solo en integración; hay que traerlo del baseline.

## 7. El hallazgo que más cambia las cosas

El comentario del puerto dice, literal:

> *«Los cuatro avisos que **el registro del cliente** pide (**3.4, 3.5, 4.2 y 4.3**).»*

Y más abajo: *«(**TAREA-15, punto 1 y 3 del pedido**)»*.

**El registro funcional original tiene secciones numeradas.** El documento que el cliente entregó y
que está transcrito en [`../requisitos/REQUISITOS-CLIENTE-ALOVIDA.md`](../requisitos/REQUISITOS-CLIENTE-ALOVIDA.md)
**no tiene numeración de secciones**.

Conclusiones, separadas con cuidado:

- **Lo que se puede afirmar:** existe un documento de requisitos numerado, citado desde el código
  fuente, con al menos las secciones 3.4, 3.5, 4.2 y 4.3, y un pedido llamado «TAREA-15».
- **Lo que esto refuerza:** la ambigüedad `Q-04` **no está cerrada**, y mi hipótesis anterior
  (`Q-R3`) queda **debilitada**: si el original está numerado y la transcripción no, **probablemente
  no son el mismo artefacto**, aunque el contenido se solape.
- **Lo que gana Marcelo:** una pista concreta. Ya no busca «un documento»: busca **un documento con
  secciones numeradas 3.x y 4.x y un pedido TAREA-15**, citado desde `agenda-notice.port.ts`.

Segunda pista, del script `ddl:sources`:

```
"ddl:sources": "python ../mantra-core-health-model/salud-db/check_ddl_sources.py"
```

El backend espera el **modelo canónico como checkout hermano**, en `../mantra-core-health-model`.
El paquete reportó ese repositorio como **404**. Eso no significa que no exista: significa que el
acceso falló. Es un límite de acceso concreto, con ruta esperada.

## 8. Qué sigue sin verificar

- **Nada del comportamiento.** No corrí `typecheck`, ni `test`, ni `test:integration`, ni arranqué
  nada. Todo lo de arriba es lectura estática sobre un corte.
- **Las 2 commits de diferencia hasta `dev`** no se revisaron: no sé si tocan lo del piloto.
- **Los `.spec.ts` de los tres servicios no se leyeron**, solo se constató que existen.
- **El segundo adaptador `SupportAdminNoticeAdapter` no se leyó.**
- **El resto del reparto** (recorridos del registro, módulos de farmacia, laboratorio, aseguradora)
  **no se verificó contra código**: esta verificación cubre el piloto de avisos de agenda, que es lo
  que los prompts afirman.
