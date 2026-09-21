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

**Prioridad:** ALTA · **Estado:** EN CURSO (desbloqueado el 20/09 noche — ver D-2).

**Kill-test del hito:** correr la verificación de deriva entre fuente de verdad, base y entidades
del ORM.

### H4.S1 — Baseline reproducible

| ID | Microtarea | Estado | Evidencia |
|---|---|---|---|
| H4.S1.M1 | Levantar el baseline desde cero en un entorno limpio | **A MEDIAS** | `evidencia/H4.S1.M1-hallazgo-patches-no-reproducibles.md` · `H4.S1.M1-postgres-init-base-limpia.txt` · `H4.S1.M1-patches-restantes.txt` · `H4.S1-conteos-e-integridad.txt` |
| H4.S1.M2 | Checks de integridad antes del escenario | **HECHO** | `evidencia/H4.S1-conteos-e-integridad.txt` — 6 792 FK, **0 no validadas** → huérfanas imposibles por construcción |
| H4.S1.M3 | Segunda corrida del seeder para demostrar idempotencia | **HECHO** | `evidencia/H4.S1.M3-baseline-corrida-2-idempotencia.txt` y `-corrida-3.txt` — tercera corrida: `TOTAL insertados: 0 · ya existentes: 26493 · EXIT 0` |

**Por qué M1 queda `A MEDIAS` y no `HECHO`:** el baseline se levanta y da conteos estables
(1 201 tablas · 6 792 FK · 9 236 índices · 65 schemas), pero **no por el camino canónico**.
`postgres-init` sale 3 sobre base limpia. Dos patches lo impiden, por causas distintas y ambas
verificadas dos veces:

- `SQL/patches/2026-09-08_v428_billing_quotations.sql:254` — su autoverificación exige un `CHECK`
  sobre `interest_calculation_method`, columna que `SQL/patches/2026-09-18_v4218_…:76-77` **borró**.
  La tabla ya está promovida al DDL generado (`SQL/17_billing/02_tables.sql`), así que el
  `CREATE TABLE IF NOT EXISTS` del patch es un no-op y el `CHECK` nunca llega a crearse.
- `SQL/patches/2026-09-19_v4221_aseguradoras_codigo_unico.sql` — exige 17 aseguradoras canónicas
  **más** 1 fila «demo». Las 17 sólo existen en la fase `mock`
  (`seedsGenerales/modules/26_insurance.seeds.json`: `boot` = 0 filas, `mock` = 17); la fila demo
  no la reproduce ningún paquete. Es una migración de un solo uso atada a una base viva,
  estacionada donde se reejecuta en cada arranque.

Los dos se **excluyeron** del baseline, declarándolo (regla 65). Los 44 patches restantes aplican
sin error. No se escribió DDL a mano ni se tocó el repo del modelo: es territorio ajeno.

### H4.S2 — Migración conjunta

Candidata: `SQL/patches/2026-09-18_v4218_quotations_flexible_payment_plan.sql` — expandir,
migrar y contraer reales. Evidencia: `evidencia/H4.S2-migracion-candidata-v4218.txt`.

| ID | Microtarea | Estado |
|---|---|---|
| H4.S2.M1 | Aplicar la candidata sobre el baseline en entorno de prueba | **HECHO** — aplicó sin error |
| H4.S2.M2 | Verificar expandir → migrar → contraer | **HECHO**, con hallazgo |
| H4.S2.M3 | Probar el rollback o la restauración | **HECHO** — **no es practicable**, con plan de recuperación declarado |

**Hallazgo de M2:** el orden está respetado y declarado dentro del archivo (A expandir 47-71 ·
B contraer 76-82 · C CHECKs 87-96 · D verificación 99), pero las tres etapas van en **una sola
transacción y un solo despliegue**. El propósito del patrón —que «expandir» salga primero y
«contraer» después, para que la versión anterior de la app siga viva durante el despliegue— no
se consigue: en el instante del COMMIT, cualquier instancia con el código anterior rompe.

**M3:** la estructura vuelve (los 5 `ADD COLUMN` corren), los datos no — `DROP COLUMN` los borró.
Plan de recuperación: respaldo previo de las dos tablas, como el propio patch indica en sus
líneas 32-34. **Limitación honesta:** `billing.quotations` tiene 0 filas en el baseline, así que
la pérdida de datos no se pudo demostrar empíricamente, sólo la parte estructural.


### H4.S3 — Deriva

| ID | Microtarea | Estado | Evidencia |
|---|---|---|---|
| H4.S3.M1 | Verificación de deriva entre fuente de verdad, base y entidades del ORM | **HECHO** — y **detecta deriva** | `evidencia/H4.S3.M1-deriva-orm-vs-base.txt` · `H4.S3.M1-hallazgo-modulo-solo-en-codigo.md` |
| H4.S3.M2 | Registrar los índices creados con nombre explícito | **HECHO** — CA cumplida: 0 con nombre generado | `evidencia/H4.S3.M2-indices-nombre-explicito.txt` |

**La deriva detectada bloquea el cierre de H4** (así lo dice su propio DoD, y se respeta):
**44 tablas que el ORM declara y la base no tiene**. 36 son el módulo `pharma_lab` entero, 8 sus
espejos de auditoría, y las 5 restantes son las fantasma ya documentadas. `pharma_lab` no tiene
`.puml` (hay 67, ninguno suyo) ni una línea en `SQL/`: vive **sólo en el código**, el mismo
defecto del módulo 64 `audio_assets` de agosto. Detalle y precedente de cierre en el hallazgo.

**Corrección registrada:** la primera consulta de M2 marcó 17 índices como «nombre generado».
Era un falso positivo del filtro (`LIKE '%_key'` casaba el nombre de la COLUMNA, no el del
índice): los 17 llevan prefijo explícito `uq_`/`uk_`. El conteo real es **0 generados sobre
9 236**. Se deja escrito en la evidencia en lugar de cambiar el número en silencio.

## H5 — Empaquetar el candidato final del módulo

**Estado:** A MEDIAS — 5/7. Detalle: `evidencia/H5-H6-cierre.md`.

| ID | Estado |
|---|---|
| H5.S1.M1 Artefacto de la versión que la regresión respalda | **A MEDIAS** — CA no cumplida |
| H5.S1.M2 Manifiesto con versiones, hashes, resolución | **HECHO** |
| H5.S1.M3 Evidencias de los gates A ejecutados | **HECHO** |
| H5.S2.M1 Ausencia de secretos y datos reales | **HECHO** — A7/A8 `PASS` |
| H5.S2.M2 No arrastra fuentes del proveedor retirado | **FAIL declarado** |
| H5.S3.M1 Estado de entrega del candidato | **HECHO** — `TRANSITIONAL_ISOLATION` |
| H5.S3.M2 Gates `NOT_RUN` | **HECHO** — A3–A6 |

El hash reproduce exacto (`21fe553b9a97…`), y por eso A7 y A8 no son evidencia heredada: el
contenido es bit a bit el mismo que cuando se corrieron.

## H6 — Reejecutar los gates del artefacto reparado

**Estado:** A MEDIAS — 5/7. Ejecutado contra una **versión reparada simulada** en copia
descartable (regla 65), declarada como tal. Detalle: `evidencia/H5-H6-cierre.md` y
`evidencia/H6.S1.M1-typecheck-con-binding-port-only.txt`.

| ID | Estado |
|---|---|
| H6.S1.M1 Typecheck/build delimitados sobre la versión reparada | **HECHO** (simulado) |
| H6.S1.M2 Arranque propio y aceptación local | **NOT_RUN** |
| H6.S1.M3 Reejecutar la verificación de deriva | **HECHO** |
| H6.S2.M1 Artefacto final con nuevo hash | **DESCARTADO** — decisión de coordinación |
| H6.S2.M2 Enlazar cada gate con evidencia de esta versión | **HECHO** |
| H6.S3.M1 Estado de entrega del artefacto final | **HECHO** |
| H6.S3.M2 Gates `NOT_RUN` en la versión final | **HECHO** — A3–A6 |

**La medición que responde a H2.** Control y prueba sobre la misma copia, al mismo corte:

```
copia intacta ................................ EXIT 0 · 0 errores
vecinos retirados + puerto atado al doble .... EXIT 2 · 138 errores
  de esos, DENTRO de src/modules/scheduling/ .............. 0
```

En H2, sin el binding port-only, eran **5**. Con el puerto atado a un adaptador que sólo depende
del contrato, **la capacidad compila con sus vecinos físicamente ausentes**: A1 y A2 en verde
para la capacidad. Los 138 restantes caen fuera de ella y son los consumidores externos que H2 ya
había inventariado — el retiro físico es el método de medición, no el estado propuesto.

**Lo que esto NO prueba:** se hizo contra un doble de 32 líneas que devuelve
`{ delivered: false, skippedReason }`. Sustituye la espera, no la verificación final: el
adaptador real tiene que emitir de verdad.
