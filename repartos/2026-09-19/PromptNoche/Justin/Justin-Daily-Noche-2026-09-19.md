# Daily de Justin — turno noche — 2026-09-19

> **Estado:** `CERRADO`. Completado al cerrar el turno, con la evidencia ejecutada.
> **Continuación (2026-09-20):** las 13 microtareas que este daily dejó abiertas ya están
> cerradas. El carril B terminó en **53/53**. Ver §8.

- **Persona:** Justin · **Turno:** noche · **Fecha:** 2026-09-19 · **Línea:** B · **Rol:** responsable de relación e integración
- **Tu prompt:** [La relación agenda → mensajería: dobles, integración y regresión final](Noche-PilotoDeAvisos.Integracion/DoblesRelacionYRegresionFinal.md)
- **Daily del equipo:** [Daily-Noche-2026-09-19.md](../Daily-Noche-2026-09-19.md)
- **6 hitos · 18 subtareas · 53 microtareas**
- **Trabajo en disco:** `mantra-core-health-api/docs/trabajo/2026-09-19-relacion-agenda-mensajeria/`
  (`PLAN.md`, `REPORTE.md`, `registro-de-checks.json`, 4 documentos de hito, 13 archivos de evidencia)
- **Rama:** `justin/noche-2026-09-19-relacion-agenda-mensajeria` · **Corte:** `5d5007fb` (declarado, ver DEC-01)

## 1. Instalación del estándar — es lo primero, no lo último

- [x] `ls .claude/skills | wc -l` → **176**, salida pegada acá abajo.
- [x] `python .claude/hooks/plan_gate.py --self-test` → **11 PASS, 0 FAIL**, salida pegada.
- [x] Cargaste `skills-router` y las skills de la sección 1 de tu prompt.
- [x] Creaste tu `PLAN.md` **antes** del primer `Edit`/`Write` de código.

```text
$ ls .claude/skills | wc -l
176

$ ls .claude/rules/*.md | wc -l
14

$ python .claude/hooks/plan_gate.py --self-test
PASS  sin plan: bloquea codigo .ts
PASS  sin plan: bloquea codigo sin extension conocida
PASS  sin plan: permite .md
PASS  sin plan: permite bajo docs/
PASS  sin plan: permite bajo .claude/
PASS  sin plan: permite ruta fuera del proyecto
PASS  sin plan: ignora herramienta fuera de alcance
PASS  sin plan: evento sin file_path no bloquea
PASS  mensaje de bloqueo nombra la regla
PASS  con plan: permite codigo
PASS  plan ilegible: igual permite (no bloquea por formato)

plan_gate self-test: 11 PASS, 0 FAIL
exit=0
```

## 2. Avance por hito

**40 / 53 microtareas en `HECHO`** (75 %, calculado). Las `A MEDIAS` cuentan como **no hechas**.

| Hito | Prioridad | Microtareas | HECHO | Estado |
|---|---|---:|---:|---|
| **H1** — Iniciar la relación con dobles estrictos y su registro de checks | `ALTA` | 13 | **13** | `HECHO` |
| **H2** — Ejercitar la relación con dobles fijados de ambos extremos | `ALTA` | 8 | **5** | `A MEDIAS` |
| **H3** — Integrar la relación con los artefactos que ya estén listos | `MEDIA` | 8 | **7** | `A MEDIAS` |
| **H4** — Probar idempotencia, concurrencia y recuperación | `ALTA` | 8 | **5** | `A MEDIAS` |
| **H5** — Probar que un doble no puede llegar a producción | `ALTA` | 7 | **6** | `A MEDIAS` |
| **H6** — Correr la regresión del candidato final | `ALTA` | 9 | **4** | `A MEDIAS` |
| **TOTAL** | | **53** | **40** | |

### Lo que hay que leer aunque no se lea nada más

Durante casi todo el turno el hallazgo grande fue **«la relación no entrega ni un aviso»**. Era
cierto de lo observado y era **el diagnóstico equivocado**: la base de desarrollo estaba cargada con
un paquete de seeds viejo. El propio `gen_seeds.py` ya documentaba el bug y lo había arreglado
(v4.0.11 bis). Tras el ciclo limpio la relación **funciona**:

```text
[H3.S1.M2] resultado real: {"delivered":true,"notificationRequestId":"781499ce-…",
  "inAppNotificationId":"7a91758e-…","chatDelivered":true}
```

Y `fx3-agenda-respiro-y-avisos.int-spec.ts` —la regresión del propio proyecto, que con la base vieja
daba `Expected 4, Received 0`— pasa **10/10**.

**El hallazgo que sí queda, y que sólo apareció al poder medir:**

```text
[H4.S2.M1] filas creadas con la misma clave de rebote en paralelo: 2 · resultados: [null,null]
```

**Dos emisiones simultáneas con la misma clave de rebote crean DOS filas**, ambas reportadas como
exitosas. Medido **6 veces: 5 dan dos**. La deduplicación de avisos **no aguanta concurrencia** —
`debounce_key` no tiene índice único y `createRequest` es un read-then-write. Es **HALL-03**, y el
rebote existe precisamente para el caso de un worker que reintenta un lote, que es concurrente.

## 3. Detalle de las microtareas que tocaste

| ID | Estado | Comando ejecutado | Exit code | Ruta de la evidencia |
|---|---|---|---|---|
| H1.S1.M1 | `HECHO` | `grep -rln MessagingAgendaNoticeAdapter src test` + `git ls-tree` | 0 | `evidencia/h1s1m1-localizacion-adaptador.txt` |
| H1.S1.M2 | `HECHO` | lectura + ejecución posterior | 0 | `H1-especificacion-doble-estricto.md` |
| H1.S1.M3 | `HECHO` | `yarn test:integration --testPathPatterns=agenda-mensajeria-relacion` | 0 | `test/doubles/strict-agenda-notice-port.double.ts` |
| H1.S1.M4 | `HECHO` | ídem (kill-test ejecutado) | 0 | `evidencia/h2-relacion-dobles.txt` |
| H1.S1.M5 | `HECHO` | ídem (6 de 7 casos; el 6 exige base) | 0 | ídem |
| H1.S2.M1 | `HECHO` | — (documento) | null · no hubo ejecución | `H1-registro-de-checks.md` |
| H1.S2.M2 | `HECHO` | — (documento) | null · no hubo ejecución | ídem |
| H1.S2.M3 | `HECHO` | `node -e "…require('./package.json').scripts"` | 0 | `evidencia/h1s2m3-comandos-reales.txt` |
| H1.S2.M4 | `HECHO` | `docker exec mantra-redesa-postgres-1 psql …` | 0 | `evidencia/h1s2m4-postgres-y-docker.txt` |
| H1.S3.M1 | `HECHO` | `git merge-base --is-ancestor` + `git diff --name-only` | 0 | `H1-ficha-relacion.md` |
| H1.S3.M2 | `HECHO` | — (documento) | null · no hubo ejecución | ídem |
| H1.S3.M3 | `HECHO` | — (documento) | null · no hubo ejecución | ídem |
| H1.S3.M4 | `HECHO` | — (documento, sobre 2 precedentes reales del repo) | null · no hubo ejecución | ídem |
| H2.S1.M1 | `BLOQUEADO` | `git ls-tree -r --name-only HEAD \| grep -iE 'contract'` | 0 | `evidencia/h2s1m1-contrato-ausente.txt` |
| H2.S1.M2 | `HECHO` | `yarn test:integration --testPathPatterns=agenda-mensajeria-relacion` | 0 | `evidencia/h2-relacion-dobles.txt` |
| H2.S1.M3 | `HECHO` | ídem | 0 | ídem |
| H2.S2.M1 | `A MEDIAS` | ídem | 0 | ídem |
| H2.S2.M2 | `HECHO` | ídem + suite de persistencia | 0 | `evidencia/h3-h4-persistencia.txt` |
| H2.S2.M3 | `HECHO` | — | null · es una declaración de estado | `registro-de-checks.json` |
| H2.S3.M1 | `BLOQUEADO` | — | null · no hay versiones que combinar | `H2-H5-ejecucion-de-la-relacion.md` |
| H2.S3.M2 | `HECHO` | — | null · es el registro | `registro-de-checks.json` |
| H3.S1.M1 | `HECHO` | `yarn test:integration --testPathPatterns=agenda-mensajeria --verbose` | 0 | `evidencia/h3-h4-tras-rebuild.txt` |
| H3.S1.M2 | `HECHO` | ídem — `delivered:true` con fila real | 0 | ídem |
| H3.S1.M3 | `HECHO` | ídem (conexión independiente: fila presente) | 0 | ídem |
| H3.S2.M1 | `HECHO` | ídem — fila de bandeja, destinatario, asunto y `read_at` nulo | 0 | ídem |
| H3.S2.M2 | `HECHO` | ídem | 0 | ídem |
| H3.S2.M3 | `A MEDIAS` | ídem — `chatDelivered:true`, pero un booleano no acredita conversación ni membresía | 0 | ídem |
| H3.S3.M1 | `HECHO` | — | null · declaración por relación | `registro-de-checks.json` |
| H3.S3.M2 | `HECHO` | — | null · tabla del reporte | `REPORTE.md` |
| H4.S1.M1 | `HECHO` | ídem — **idempotencia verificada: 2 emisiones → 1 fila** | 0 | `evidencia/h3-h4-tras-rebuild.txt` |
| H4.S1.M2 | `HECHO` | ídem — gana la primera, la segunda no persiste y nadie se entera | 0 | ídem |
| H4.S1.M3 | `HECHO` | ídem + `grep -rn debounce SQL/` | 0 | ídem |
| H4.S2.M1 | `HECHO` | ídem ×6 — **2 filas en paralelo: la carrera existe** | 0 | `evidencia/h4-carrera-medida.txt` |
| H4.S2.M2 | `HECHO` | lectura de `notifications.service.ts:167-181` | null · es lectura del código | `H2-H5-ejecucion-de-la-relacion.md` |
| H4.S3.M1 | `BLOQUEADO` | — | null · Q-06 sin decidir: sin oráculo de negocio | `REPORTE.md` |
| H4.S3.M2 | `BLOQUEADO` | — | null · ídem | ídem |
| H4.S3.M3 | `BLOQUEADO` | — | null · ídem | ídem |
| H5.S1.M1 | `HECHO` | `yarn test:integration --testPathPatterns=agenda-mensajeria-relacion` | 0 | `evidencia/h2-relacion-dobles.txt` |
| H5.S1.M2 | `BLOQUEADO` | — | null · exigiría apuntar a un proveedor real | `REPORTE.md` |
| H5.S1.M3 | `HECHO` | `yarn test:integration --testPathPatterns=agenda-mensajeria-persistencia` | 0 | `evidencia/h3-h4-persistencia.txt` |
| H5.S2.M1 | `HECHO` | ídem | 0 | ídem |
| H5.S2.M2 | `HECHO` | — | null · es el registro de la discrepancia | `REPORTE.md` |
| H5.S3.M1 | `HECHO` | — | null · es el registro | `registro-de-checks.json` |
| H5.S3.M2 | `HECHO` | — | null · declaración de estado | ídem |
| H6.S1.M1 | `A MEDIAS` | `yarn typecheck` · `yarn lint --max-warnings=0` | 0 · **1** | `evidencia/h6-etapa1-typecheck.txt` · `h6-etapa2-lint.txt` |
| H6.S1.M2 | `HECHO` | `yarn test` · `yarn test:integration --testPathPatterns=agenda-mensajeria` | 0 · 0 | `evidencia/h6-etapa3-unitarios-completa.txt` |
| H6.S1.M3 | `NOT_RUN` | — | null · Playwright vive en el repo del front | `REPORTE.md` |
| H6.S1.M4 | `NOT_RUN` | — | null · ídem | ídem |
| H6.S2.M1 | `HECHO` | — | null · el `skipped` registrado `NOT_RUN` | `registro-de-checks.json` |
| H6.S2.M2 | `HECHO` | — | null · tabla de clasificación de los 5 rojos | `REPORTE.md` |
| H6.S2.M3 | `HECHO` | — | null · denominadores en el reporte | ídem |
| H6.S3.M1 | `A MEDIAS` | — | null · sólo existen los checks del carril B | `registro-de-checks.json` |
| H6.S3.M2 | `A MEDIAS` | — | null · ídem | ídem |

## 4. Qué entregás vos

| Al cerrar | A quién | Qué exactamente | Entregado |
|---|---|---|---|
| **H1** | Ender | El `skippedReason` es hoy prosa libre; el validador lo necesita como **catálogo cerrado de 5 textos** | `SÍ` |
| **H1** | Itzan | La ficha de la relación (`H1-ficha-relacion.md`) | `SÍ` |
| **H1** | Marcelo | Los 3 canales con su límite de verificación (`H1-ficha-relacion.md` §M3) | `SÍ` |
| **H1** | Pablo | Comandos reales + PG/Docker (daemon **caído** al arrancar, levantado a mano) | `SÍ` |
| **H2** | Marcelo | Ningún escenario que dependa de que el aviso **llegue** se puede ejercitar hoy (HALL-02) | `SÍ` |
| **H2** | Ender | **AMB-02**: «suprimida» intenta correo **y chat**; «rebotada» intenta correo y **no** chat. No documentado | `SÍ` |
| **H2** | Itzan | El adaptador **no** puede resolver el canal por la constante: su composición tiene que contemplarlo | `SÍ` |
| **H3** | Marcelo | Ninguno corre con implementaciones reales: la emisión falla antes de persistir | `SÍ` |
| **H3** | Itzan | La relación necesita que el canal in-app exista **con el id que el código deriva**, o que el adaptador resuelva por código | `SÍ` |
| **H3** | Ender | **AMB-03**: `emit` puede devolver un resultado **sin ningún campo de correo** | `SÍ` |
| **H4** | Marcelo | Ninguno: idempotencia, concurrencia y recuperación quedaron sin medir (HALL-02) | `SÍ` |
| **H4** | Ender | Q-12/Q-13 siguen sin respuesta. Se midió el comportamiento **observado**, sin declararlo correcto | `SÍ` |
| **H4** | Itzan | **SÍ exige cambio de esquema**: `debounce_key` no tiene índice único (HALL-03). El patrón ya existe en `outbox_messages` y `queued_jobs` | `SÍ` |
| **H5** | Marcelo | HALL-02 afecta su dictamen entero | `SÍ` |
| **H5** | Ender | La discrepancia doble vs proveedor real **ocurrió**: doble dice `delivered:true`, real dice `false` | `SÍ` |
| **H5** | Pablo | `registro-de-checks.json` consolidado del carril B | `SÍ` |
| **H6** | Marcelo | Regresión: typecheck 0 · lint **1** (deuda ajena) · unitarios 8 248/8 249 · integración: ver reporte | `SÍ` |
| **H6** | Pablo | Rojo sin reparar: HALL-01 (`bootstrapTestApp` roto) y HALL-04 (`database/` volvió) | `SÍ` |
| **H6** | Todo el equipo | Consolidado de la semana: **sólo existe el carril B** | `PARCIAL` |

## 5. Bloqueos

| Qué bloquea | Qué intentaste | Qué lo destraba | De quién depende |
|---|---|---|---|
| **HALL-02** — el aviso no se entrega: `Canal no encontrado` | Ejecuté la relación contra participantes reales, capturé el log del adaptador, comparé el id del canal en base vs el del código, y confirmé que el seed ya esquiva la divergencia | Que el adaptador resuelva el canal **por código** (como `MessagingSeedService.idDeCanal`), o que el paquete siembre con el id derivado | Dueño de mensajería/agenda. **Corregirlo es `src/`: fuera del alcance de esta noche** |
| **HALL-01** — `bootstrapTestApp()` aborta por el seed de aseguradoras | Reproduje, leí el error completo (42703), verifiqué `sigla` en las 4 capas, y rodeé componiendo la app sin el arnés | Alinear la entidad `insurance_carriers` con el DDL canónico (quitar `sigla` del seed o agregarla al modelo) | **Pablo / Itzan** (fidelidad de esquema) |
| **Contrato de Ender ausente** | Busqué por nombre, ruta candidata y patrón sobre el árbol del corte | Que Ender publique el artefacto versionado | **Ender** |
| **Q-06** — durabilidad del aviso | Ninguno: no se resuelve por conveniencia | Decisión de negocio | **Negocio** |
| **Docker caído** (resuelto) | Levanté Docker Desktop a mano; los 5 contenedores subieron healthy | — | Resuelto |

## 6. Ambigüedades que encontraste

| ID | Qué | Supuesto que tomaste | A quién confirmárselo |
|---|---|---|---|
| **AMB-01** | El contrato no define qué pasa con la misma clave de rebote y payload distinto | **Ninguno.** Se midió el comportamiento observado y se registró como observado | **Negocio** (Q-12/Q-13) |
| **AMB-02** | «Suprimida» intenta correo **y** chat; «rebotada» intenta correo y **no** chat | Ninguno. Registrada como diferencia no documentada entre dos caminos parecidos | **Ender** |
| **AMB-03** | `emit` puede devolver un resultado **sin ningún campo de correo** | Ninguno. Leer esa ausencia como «no hacía falta correo» sería falso | **Ender** |
| **AMB-04** | Q-06: el puerto descarta el aviso fallido, el metaprompt exige durabilidad | Ninguno. **No se implementó durabilidad ni se declaró que exista** | **Negocio** |
| **DEC-01** | Corte `5d5007f` en vez de `32ae939` | Los 2 commits de diferencia tocan sólo `clinical`; ninguno toca esta relación | **Pablo** |

## 7. Antes de cerrar

- [x] Ninguna microtarea quedó en `EN CURSO`.
- [x] Ningún `PASS` sin comando y exit code pegados.
- [x] Cada hito y cada subtarea que toqué tienen su **Estado** actualizado.
- [x] *¿Algún éxito declarado depende de algo que no ejecutaste?* — **No.** Lo que no se ejecutó
      está en `NOT_RUN`/`BLOQUEADO` con causa, y la sección «No cubierto» del `REPORTE.md` lista
      los 8 caminos que quedaron sin ejercitar.
- [x] Si editaste después de verificar, esa área volvió a `WRITTEN` y la reverificaste — pasó dos
      veces: tras corregir la grabadora del doble (20/21 → 21/21) y tras los 3 errores de tipos
      que `@swc/jest` no ve (se re-corrieron las dos suites: 32/32).
- [x] Ninguna salida pegada contiene datos reales de pacientes. Los uuid que aparecen son ids de
      canal y de commit, no personas.
- [x] Mi fila del [daily del equipo](../Daily-Noche-2026-09-19.md) está actualizada.

## 8. Continuación del 2026-09-20 — el carril B cerró 53/53

Este daily cerró el turno en **40/53**, con 13 microtareas esperando respuestas. **Ninguna las
necesitaba.** Se cerraron el día siguiente, en dos vueltas, y van en el
**[PR #445](https://github.com/mdavila-2001/mantra-core-health-api/pull/445)**
(`docs/trabajo/2026-09-20-cerrar-pendientes-carril-b/`).

| Qué destrabó | Cuántas | Cómo |
|---|---:|---|
| Aparecieron los artefactos que faltaban (Itzan `v0.1.0-transitional`, laboratorio de Pablo en `dev`) | 3 | H2 dejó de no tener «versiones que combinar» |
| Medir en vez de esperar la decisión de Q-06 | 3 | Se midió y se registró **como observado**, sin declararlo correcto |
| Tres microtareas que yo había leído mal | 3 | `H5.S1.M2` pide comprobar el **bloqueo**, no mandar algo; `H6.S1.M4` admite `NOT_RUN` con motivo; `H6.S1.M3` no necesitaba tocar `src/`, necesitaba entorno |
| Trabajo que simplemente había que hacer | 4 | chat acreditado con filas, `lint` en exit 0, consolidado de los 3 niveles + tabla de gates |

**Lo que más me corrige a mí mismo:** declaré `H6.S1.M3` (el E2E dirigido) como «gate sin sujeto»
porque la suite daba `3 skipped`. La suite se saltea sin las credenciales P8, y esas credenciales
las produce `tools/alovida/p8-avisos-agenda.mjs` — que **estaba rota contra `dev`** desde que el
alta de paciente creció (HALL-11). Corregidas sus dos derivas, el recorrido dio **27/27, exit 0**,
y la etapa 5 **3 passed, exit 0** contra la API viva, con el front servido en modo `e2e-real` (sin
el simulador). Un carril sobre `agenda → mensajería` cuyo único registro visual era un `skipped` no
acreditaba lo que decía acreditar.

### Veredicto del consolidado (los tres niveles, 37 checks)

| Nivel | Obligatorios aplicables | Aprobados | Veredicto |
|---|---:|---:|---|
| A — el artefacto (Itzan) | 6 | 2 | **NO APROBADO** |
| B — la relación (mío) | 23 | 22 | **NO APROBADO** — sólo por `H4.S2.M1` |
| C — la regresión | 5 | 5 | **APROBADO** |

**El nivel B está a un solo check de aprobar y ese check es HALL-03**: `debounce_key` sigue sin
índice único, y dos `emit()` en paralelo con la misma clave crean dos filas reportadas como
exitosas. Es lo único que falta para cerrar el nivel entero.

### Hallazgos nuevos del cierre

| ID | Qué | De quién es |
|---|---|---|
| **HALL-08** | El puerto **sí** es transaccional; el negocio lo llama afuera a propósito. ADV-09 es alcanzable sin tocar el puerto | Negocio (Q-06) |
| **HALL-09** | Un aviso a un destinatario inexistente no deja rastro: ni solicitud, ni entrega, ni cola de muertos | Negocio (Q-06) |
| **HALL-10** | La guarda anti-SSRF retorna sin mirar nada fuera de producción; lo que aísla es la configuración | Pablo / seguridad |
| **HALL-11** | El recorrido P8 llevaba roto contra `dev` (alta con seis campos nuevos + cupo que se pisa). **Corregido** | Mío, ya en el PR |
| **HALL-12** | `seed-dev-data.mjs` no puede asignar especialidades: `dynamic-enums` 404 → `specialties` 422 | Dueño de `profiles` |
| **HALL-13** | El servicio `api` del compose se declara *healthy* sin poder hablar con Postgres (lee `DB_HOST=localhost` del `.env` del host) | Pablo / infra |

### Lo que sigue sin dueño resuelto

Las 17 preguntas de `PREGUNTAS-EQUIPO-CARRIL-B-2026-09-20.md` siguen **sin contestar**. Tres ya no
bloquean nada (el contrato de Ender existe: `v1.0.0`, commit `06dc3357`, PR #5), pero **Q-06** y
**HALL-03** siguen siendo decisiones de otros, y el check `docs` del CI está en rojo para todos por
**HALL-07** (el patch `v4221` en el init), no por este trabajo.
