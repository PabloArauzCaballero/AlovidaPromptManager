# Plan — Composición, prueba de ausencia y baseline de la capacidad (scheduling)

- Fecha: 2026-09-20 · Repos afectados: `mantra-core-health-api-copia-noche` (copia descartable) ·
  Predecesor: verificación previa contra `32ae939983f0d665e4ed371362858801134d35cd`
  (`docs/verificacion/VERIFICACION-CONTRA-CODIGO-2026-09-19.md` de `AlovidaPromptManager`)
- WORKSPACE: `mantra-core-health-api-copia-noche`
  (copia descartable de `mantra-core-health-api`, NO el checkout real)
- TARGET_REF: el prompt fija `32ae939983f0d665e4ed371362858801134d35cd`, pero la copia está clonada
  en `dev` = `5d5007fb` (2 commits después, incluye el merge de MCH-008.2 #442, no toca `scheduling/`
  ni `orm.config.ts`). **Corte de trabajo declarado: `5d5007fb`.** Diferencia registrada, no resuelta
  por conveniencia: si algo de lo hallado difiere de lo ya verificado contra `32ae939…`, se anota.
- Resultado observable: al cerrar el turno, alguien puede leer un documento y saber qué carga hoy
  `SchedulingModule`, qué composición mínima se propone para aislar la capacidad, y cómo se levanta
  una base de pruebas identificable — sin volver a rastrear imports (H1). Los hitos H2–H6 dependen de H1.
- Kill-test: preguntar si el ORM descubre entidades por glob global y qué hace
  `HistoryMirrorSubscriber` al arrancar la capacidad sola. Si no se puede responder sin abrir
  `orm.config.ts`, no está hecho.

## Alcance

- IN: ver `Noche-PilotoDeAvisos.Aislamiento/ComposicionAusenciaYBaseline.md` §3 (IN completo, no se
  copia dos veces).
- OUT: ver el mismo documento §3 (OUT completo) — en particular: editar `scheduling.module.ts` u
  `orm.config.ts`, mergear a `dev`, crear paquetes `base`/`common`/`shared`, DDL a mano, sincronización
  automática de esquema, tocar el checkout original.
- Ambigüedades registradas:
  - Sección 1.3 del prompt (25 skills) exige leerlas todas antes de escribir el `PLAN.md`; la regla
    70.5 de esta misma casa (`context-thrift`) dice cargar las skills cuando la fase las necesita, no
    todas al principio. **Tensión real entre dos fuentes de la misma jerarquía de reglas.** Resolución
    tomada: `skills-router` ya cargado (obligatorio, es la entrada); las 24 restantes se cargan una a
    una en la subtarea que las use, y se deja constancia acá de cuál se cargó y cuándo. A confirmar con
    quien mantiene el estándar (Pablo) si la intención era otra.
  - Q-01, Q-C1, Q-09, Q-15, Q-16, Q-20, Q-23 del prompt: no se resuelven, quedan tal cual las registró
    el prompt (§5). Q-C1 en particular: 6 hitos no entran en una noche; se avisa a coordinación al
    cerrar cada hito, no se recorta en silencio.

## H1 — Delimitar la composición de la capacidad y su baseline local

**CA:** Dado el documento, cuando otra persona intenta levantar la capacidad aislada en otra
máquina, entonces sabe qué proveedores necesita, qué entidades registrar y qué base crear.
**DoD:** Las 14 microtareas en HECHO o BLOCKED. Clasificación `HYPOTHESIS` hasta H2.
**Estado:** HECHO -- 14/14 microtareas HECHO (S1 4/4 · S2 5/5 · S3 5/5)

### H1.S1 — Qué carga hoy la composición

**CA:** Lista literal de imports con localizador, contrastada, no copiada.
**DoD:** 4 microtareas en HECHO con el bloque de imports pegado.
**Estado:** HECHO

| ID | Microtarea | Estado |
|---|---|---|
| H1.S1.M1 | Verificar por cuenta propia los imports de `scheduling.module.ts` | HECHO |
| H1.S1.M2 | Clasificar cada import (tipos / arranque / persistencia / composición), `HYPOTHESIS` | HECHO |
| H1.S1.M3 | Localizar el binding `AGENDA_NOTICE_PORT` → adaptador | HECHO (ver evidencia M1, línea 142) |
| H1.S1.M4 | Registrar qué repositorios privados/clínicos necesitan las escrituras de la capacidad | HECHO (hallazgo: AppointmentsRepository nunca exportado por clinical) |

### H1.S2 — ORM, arranque y transacción

**Estado:** HECHO

| ID | Microtarea | Estado |
|---|---|---|
| H1.S2.M1 | Registrar qué hace `orm.config.ts`: globs, `TsMorphMetadataProvider`, caché, `HistoryMirrorSubscriber` | HECHO |
| H1.S2.M2 | Proponer configuración explícita de entidades mínimas | HECHO (TRANSITIONAL_ISOLATION declarado) |
| H1.S2.M3 | Revalidar la API de MikroORM contra la versión instalada | HECHO (core/postgresql 7.1.7, nestjs adapter 7.0.2 -- hallazgo) |
| H1.S2.M4 | Leer `transaction.port.ts` y su implementación; propagación `NOT_RUN` si no se ejecuta | HECHO (NOT_RUN declarado) |
| H1.S2.M5 | Propuesta de composición que reciba `AGENDA_NOTICE_PORT` desde afuera | HECHO (propuesta de diseño, no aislamiento probado) |

### H1.S3 — Baseline que no se pisa con el de nadie

**Estado:** HECHO

| ID | Microtarea | Estado |
|---|---|---|
| H1.S3.M1 | Verificar PostgreSQL/Docker alcanzable | HECHO (hallazgo: Docker SÍ está arriba, ver evidencia) |
| H1.S3.M2 | Diseñar identidad de la base de pruebas por ejecución | HECHO |
| H1.S3.M3 | DDL versionado mínimo de la capacidad | HECHO (TRANSITIONAL_ISOLATION -- depende de terminology y clinical) |
| H1.S3.M4 | Separar rol de preparación y rol de runtime | HECHO (probado: night_run no puede DDL) |
| H1.S3.M5 | Definir la limpieza con comprobación de identidad | HECHO |

## H2 — Demostrar materialmente la ausencia del proveedor

**Prioridad:** BLOQUEANTE · **Estado:** HECHO (con veredicto `TRANSITIONAL_ISOLATION`, no aislamiento limpio) — H2.S1 4/4 HECHO · H2.S2 1 FAIL + 2 BLOQUEADO · H2.S3 2/2 HECHO
Ver documento fuente §4 para CA/DoD literal de cada una (no se duplica aquí para no divergir).
Copia de trabajo de este hito: `mantra-core-health-api-copia-noche-h2/` (sin remoto, sin git
del checkout original — evidencia en `H2.S1.M1-copia-y-destruccion.txt`).

### H2.S1 — La copia y el retiro

**Estado:** HECHO

| ID | Microtarea | Estado |
|---|---|---|
| H2.S1.M1 | Crear la copia descartable e identificarla | HECHO |
| H2.S1.M2 | Retirar mensajería y comunidad, con inventario verificado | HECHO (8 consumidores externos son infra transversal, no acoplamiento de la capacidad) |
| H2.S1.M3 | Bloquear la resolución y probar que un import falla | HECHO (`tsc` exit 2; 5 errores TS2307 dentro de `scheduling/` — messaging y community SÍ son dependencias concretas, no solo por el puerto) |
| H2.S1.M4 | Conservar contratos y baseline dentro de la copia | HECHO |

### H2.S2 — Los gates en la copia

**Estado:** HECHO (con resultado FAIL/BLOQUEADO — es un cierre honesto, no un pase)

| ID | Microtarea | Estado |
|---|---|---|
| H2.S2.M1 | Typecheck y build de la capacidad, delimitados | FAIL (no hay build delimitado nativo — el repo no es monorepo Nest; typecheck completo exit 2, 143 errores nuevos vs. baseline 0, 5 dentro de `scheduling/`) |
| H2.S2.M2 | Arranque propio con PostgreSQL | BLOQUEADO (depende de M1) |
| H2.S2.M3 | Aceptación local (laboratorio de Pablo) | BLOQUEADO (depende de M2) |

### H2.S3 — El veredicto honesto

**Estado:** HECHO

| ID | Microtarea | Estado |
|---|---|---|
| H2.S3.M1 | Manifiesto de dependencias/exclusiones/resolución/conexiones | HECHO |
| H2.S3.M2 | Declarar el estado real | HECHO — **`TRANSITIONAL_ISOLATION`**, dependencia residual: `clinical` (repos + FK diferida), `messaging` (adapter concreto), `community` (adapter concreto) |

Detalle completo: `evidencia/H2.S3-veredicto-honesto.md`.

## H3 — Empaquetar y versionar el artefacto MODULE

**Prioridad:** MEDIA · **Estado:** HECHO — con estado de paquete `TRANSITIONAL_ISOLATION`, gate A1
en FAIL declarado (no oculto). Artefacto: `docs/trabajo/2026-09-20-aislamiento-scheduling/artefacto-h3/`
(117 archivos, ver `MANIFEST.md`). Kill-test del hito ("que alguien lo consuma sin tu rama") NO
pasa limpio: el artefacto trae imports a `messaging`/`community` que no viajan adentro — es
exactamente lo que el propio DoD permite declarar como `TRANSITIONAL_ISOLATION` en vez de
fingir un artefacto autónomo que no existe.

| Subtarea | Estado |
|---|---|
| H3.S1 — El artefacto | HECHO (M1/M2 HECHO, M3 **FAIL declarado**, ver `MANIFEST.md` §H3.S1.M3) |
| H3.S2 — Que no se escape nada | HECHO (sin secretos, sin datos reales) |
| H3.S3 — El estado honesto del paquete | HECHO (`TRANSITIONAL_ISOLATION`, tabla A1–A8 en `MANIFEST.md`) |

## H4 — Estabilizar el baseline y probar la migración conjunta

**Prioridad:** ALTA · **Estado:** BLOQUEADO — decisión de infraestructura pendiente de Itzan,
no un TODO más. Detalle completo: `evidencia/H4-bloqueo-decision-infra.md`.
Resumen: el DoD exige el **baseline de producto completo** (1 184 tablas, ~1,46M filas de
seed vía `mantra-core-health-model/salud-db/rebuild_stack.py`), una escala de infraestructura
distinta a la instancia chica de `scheduling` (17 tablas) que D-1 autorizó esta noche. Se
verificó que el intérprete (`py`, Python 3.14.0) y el script existen; no se ejecutó por ser
una decisión de infra nueva, no una continuación automática, y por el riesgo de recursos ya
observado esta sesión (un `yarn test` con Docker arriba murió por protección de memoria baja).

## H5 — Empaquetar el candidato final del módulo

**Prioridad:** ALTA · **Estado:** BLOQUEADO (depende de H4, que está BLOQUEADO).

## H6 — Reejecutar los gates del artefacto reparado

**Prioridad:** ALTA · **Estado:** BLOQUEADO (depende de H5, que está BLOQUEADO).

## Riesgos y bloqueos previstos

| Riesgo | Impacto | Mitigación |
|---|---|---|
| PostgreSQL/Docker apagados y sin autorización de levantarlos esta noche | Bloquea H1.S3, H2, H4 completos | Declarar BLOCKED con el error exacto; avanzar H1.S1/S2 (puro código) mientras tanto |
| 6 hitos no entran en una noche (Q-C1, dicho a propósito por el prompt) | Alcance parcial | Cerrar H1 completo primero (bloqueante); lo que no cierre queda A MEDIAS con las 4 respuestas |
| Corte de trabajo (`5d5007fb`) distinto del declarado en el prompt (`32ae939…`) | Hallazgos podrían no calzar 1:1 con lo pre-verificado | Contrastar cada hallazgo contra el archivo real en este corte, no contra el paquete |

## Decisiones tomadas esta noche (registradas, no en silencio)

- **D-1 (Itzan, 20/09 madrugada):** Docker autorizado esta noche. Se usa para levantar una instancia
  Postgres **efímera y propia** de este trabajo (nombre/puerto propios, nunca el contenedor
  `mantra-redesa-postgres-1` del stack compartido, que tiene datos vivos de otros carriles). **Neon
  jamás**: sigue la regla dura de no tocarlo sin OK explícito por comando, y una base aislada e
  identificable (lo que pide H1.S3) no es lo mismo que la base remota compartida — usarla la
  incumpliría igual.
