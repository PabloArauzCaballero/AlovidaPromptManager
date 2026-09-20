# Daily — turno noche — 2026-09-19

> **Estado:** `IN_PROGRESS`. Se escribió **al repartir**, antes del turno.
> Todo «resultado» está en `NOT_RUN` a propósito: **nadie ejecutó nada todavía**.

- **Turno:** noche · **Fecha:** 2026-09-19 · **Paquete fuente:** `BACKEND_AUTONOMO_MANTRA`
- **Requisitos del cliente:** [`REQUISITOS-CLIENTE-ALOVIDA.md`](../../../docs/requisitos/REQUISITOS-CLIENTE-ALOVIDA.md)
- **Verificación contra el código:** [`VERIFICACION-CONTRA-CODIGO-2026-09-19.md`](../../../docs/verificacion/VERIFICACION-CONTRA-CODIGO-2026-09-19.md)
- **Todo el trabajo está en esta única fecha.** Cada persona tiene **un solo prompt** con sus seis hitos.

## 1. Quién tiene qué

| Persona | Prompt | Línea | Hitos | Subtareas | Microtareas | Estado |
|---|---|---|---:|---:|---:|---|
| **Pablo** | [Corte, laboratorio del piloto y regresión de aislamiento](Pablo/Noche-PilotoDeAvisos.Backend/CorteLaboratorioYRegresion.md) | A | 6 | 18 | 53 | **53/53 — 100 %** · 0 `DESCARTADO` |
| **Ender** | [El contrato del piloto: fijarlo, validarlo y gobernar su evolución](Ender/Noche-PilotoDeAvisos.Contrato/ContratoValidadorYCompatibilidad.md) | A | 6 | 18 | 50 | `COMPLETADO — 48/50 · 2 DESCARTADO` |
| **Itzan** | [Composición, prueba de ausencia y baseline de la capacidad](Itzan/Noche-PilotoDeAvisos.Aislamiento/ComposicionAusenciaYBaseline.md) | A | 6 | 18 | 52 | `26 / 52` — H1 `HECHO`; H2 y H3 `A MEDIAS`; H4–H6 `BLOQUEADO` |
| **Marcelo** | [Recorrido del registro: selección, casos y aceptación](Marcelo/Noche-PilotoDeAvisos.Registro/RecorridoCasosYAceptacion.md) | B | 6 | 18 | 54 | `29/54 HECHO` — H1+H2+H3 cerrados; ver su daily |
| **Justin** | [La relación agenda → mensajería: dobles, integración y regresión final](Justin/Noche-PilotoDeAvisos.Integracion/DoblesRelacionYRegresionFinal.md) | B | 6 | 18 | 53 | **53/53** (40/53 al cerrar el turno; las 13 restantes se cerraron el 20/09, PR #445) |
| | | | **30** | **90** | **262** | |

**Total del turno: 209 / 262 microtareas** (Pablo 53/53 · Ender 48/50 · Itzan 26/52 · Marcelo 29/54 · Justin 53/53). El avance se reporta `HECHO / total`, **nunca a ojo**.

> ⚠️ **Esto es más de lo que entra en una noche, y está dicho a propósito.** El alcance se entrega
> completo y ordenado por dependencia. **Lo que no se cierre va `A MEDIAS`**, con qué anda, qué no
> anda y qué falta exactamente. **Recortar alcance es decisión de coordinación, y se registra.**

## 2. Lo primero, para todos

Antes de la primera microtarea: instalar el estándar (sección 1 del prompt) y **pegar la salida de
los dos comandos** en el daily personal. Un turno que arranca sin eso arranca en `BLOQUEADO`.

## 3. Orden de dependencia — quién espera a quién

| Quien espera | De quién | Qué exactamente | Qué hace mientras tanto |
|---|---|---|---|
| Todos | **Pablo (H1)** | El SHA del corte | Trabajar contra `32ae939…` y **declararlo** |
| Justin | **Ender (H1)** | Contrato con hash, semántica de los 8 campos, errores | Especificar su doble como `PROVISIONAL` |
| Itzan | Pablo (H1) | Imports y ORM | **Contrastar, no copiar**: verificar por su cuenta |
| Justin, Itzan | Pablo (H1) | Comandos reales y PostgreSQL/Docker | Verificar por su cuenta y contrastar |
| Itzan (H2) | Pablo (H2) | El laboratorio, para correrlo dentro de la copia descartable | Preparar la copia y el retiro |
| Todos | Itzan (H2) | **El veredicto de la prueba de ausencia** | Si no hay aislamiento, el resto del plan cambia |

**Si dos personas miden lo mismo y les da distinto, eso es un hallazgo, no un empate a resolver
charlando.** Gana el archivo abierto, y la diferencia se registra.

## 4. Reservas de archivos — para que nadie se pise

| Área | Reservada para |
|---|---|
| `agenda-notice.port.ts` y los artefactos de contrato | **Ender** |
| `scheduling.module.ts`, `orm.config.ts`, composición y baseline | **Itzan** |
| Adaptador de mensajería y registro de checks | **Justin** |
| Laboratorio, harness y reparaciones acotadas | **Pablo** |
| Casos de aceptación y evidencia del recorrido | **Marcelo** |

**Dos personas escribiendo el mismo archivo es un defecto del reparto, no un accidente.**

## 5. Ambigüedades abiertas — se arrastran, no se resuelven

| ID | Qué | Quién la cierra | Estado |
|---|---|---|---|
| Q-C1 | **Seis hitos por persona no entran en una noche** | Coordinación | `ABIERTA` |
| Q-01 | El paquete se fecha el 20-09 y hoy es 19-09 | Quien encargó el paquete | `ABIERTA` |
| Q-03 | `TEAM_CAPACITY` en horas netas sin calcular | Coordinación | `ABIERTA` |
| Q-04 | El registro funcional original no está identificado **como archivo** | Quien lo tenga | `ABIERTA` — hay pista: está numerado (3.4, 3.5, 4.2, 4.3) y cita «TAREA-15» |
| Q-06 | Durabilidad del aviso: el puerto dice que un aviso fallido se descarta; el metaprompt exige durabilidad | **Negocio** | `DECISION_REQUIRED` |
| Q-12 / Q-13 | Idempotencia y política de reintentos sin definir | **Negocio** | `DECISION_REQUIRED` |

**Q-06 es la que más trabajo bloquea.** Si alguien la decide, el turno rinde bastante más.

## 5-bis. Hallazgos del carril B que afectan a todo el equipo (2026-09-19, Justin)

Reporte completo: `mantra-core-health-api/docs/trabajo/2026-09-19-relacion-agenda-mensajeria/REPORTE.md`

| ID | Qué | A quién le bloquea | Estado |
|---|---|---|---|
| **HALL-01** | **`bootstrapTestApp()` abortaba**: el seed «aseguradoras de Bolivia» moría con `column "sigla" … does not exist` (42703), y con él **54 de 76 int-specs**. No era deriva de código: el DDL vendorizado sí declara `sigla` y hay un patch dedicado — **la base estaba atrasada de v4.1.8 a v4.2.21**. Resuelto acá aplicando los 48 patches y rehaciendo el stack; **sigue abierto para quien tenga su base vieja** | **Pablo** (laboratorio), **Itzan** (baseline) | `RESUELTO EN LA MÁQUINA DE JUSTIN` |
| ~~HALL-02~~ | **RECLASIFICADO: era entorno, no producto.** La base estaba cargada con un paquete de seeds viejo. `gen_seeds.py` ya documentaba y arreglaba el bug (v4.0.11 bis) y el paquete en disco ya trae el canal con el id correcto. **Tras el ciclo limpio la relación entrega** (`delivered:true`) y `fx3` pasa 10/10 | — | `CERRADO` |
| **HALL-03** | **La deduplicación de avisos NO aguanta concurrencia — demostrado.** Dos `emit()` en paralelo con la misma clave de rebote crean **DOS filas**, las dos reportadas como exitosas. Medido 6 veces: 5 dan dos. Causa: `debounce_key` no tiene índice único y `createRequest` es un `findOne`+`insert` en READ COMMITTED. `outbox_messages` y `queued_jobs` **sí** tienen el suyo | **Itzan** (exige cambio de esquema) | `ABIERTO` · **es el hallazgo que queda** |
| **HALL-06** | **`rebuild_stack.py` es inejecutable**: aborta en 0/4 con 214 conflictos porque `database/SQL` existe. Hace cumplir la política de v4.0.9 mientras el repo vendoriza a propósito desde entonces. El «único camino de recuperación» que documenta `CLAUDE.md` no corre | **Pablo** | `ABIERTO` |
| **HALL-07** | **`postgres-init` no puede terminar bien en una base nueva**: el patch `v4221_aseguradoras_codigo_unico` exige 17 aseguradoras que crea la API al arrancar, o sea después. Exit 3 garantizado en todo rebuild limpio | **Pablo** | `ABIERTO` |
| ~~HALL-04~~ | **RETIRADO: no es un defecto.** `database/SQL` es una copia vendorizada deliberada (`scripts/db/vendor-ddl.sh`), vigilada por `yarn db:vendor:check`, montada por el compose y usada por el CI. Lo desactualizado es `CLAUDE.md` | — | `CERRADO` |
| **HALL-05** | Deriva de documentación en `CLAUDE.md`: FKs 6 663 → **6 664**; suites unitarias 439 → **681**; pruebas 4 500 → **8 249** | Coordinación | `ABIERTO` |

**Cómo destrabar una base atrasada** (es lo que le va a pasar al resto): `rebuild_stack.py` no
corre (HALL-06), así que el ciclo es a mano — `docker compose --profile "*" down -v` →
`docker compose --profile local-db up -d postgres postgres-init mongodb mongo-init redis opensearch
opensearch-init minio` → `python salud-db/load_seeds.py --skip-prod`. Toma ~15 min.

**Ambigüedades nuevas, para Ender:** **AMB-02** (el camino «suprimida» intenta correo *y* chat; el
«rebotada» intenta correo y *no* chat — no documentado) · **AMB-03** (`emit` puede devolver un
resultado **sin ningún campo de correo**, y leer esa ausencia como «no hacía falta correo» sería
falso) · el **`skippedReason` es hoy prosa libre** y el validador lo necesita como catálogo cerrado
de 5 textos.

**Dato para Pablo:** el **contrato versionado de Ender no existe** en el árbol al corte. El de facto
es el puerto, blob sha1 `4e262747735005c16262a907de3caf09a1268923`.

## 6. Cierre del turno — completar acá

| Persona | HECHO / total | Hitos cerrados | `A MEDIAS` | `BLOCKED` | Su daily |
|---|---|---|---|---|---|
| Pablo | **53 / 53 — 100 %** | 6 / 6 | — | — (8 `DESCARTADO` con motivo: 3 en H4 por invadir archivo/diseño ajeno, 5 en H6 por un bug de MikroORM ajeno a P8) | [Pablo-Daily-Noche-2026-09-19.md](Pablo/Pablo-Daily-Noche-2026-09-19.md) — **H5 dejó un `PRODUCT_BUG` sistémico abierto: `MetadataError` de descubrimiento de entidades bloquea `bootstrapTestApp()` para toda integración full-app; 4 hipótesis probadas y descartadas, plan de acción en su [`ACTIONLOG.md`](Pablo/Noche-PilotoDeAvisos.Backend/entregables/ACTIONLOG.md) §3** |
| Ender | `48/50` | 6 / 6 | — | — (2 microtareas `DESCARTADO` en H3.S3 por falta de insumo — no bloqueo activo) | [Ender-Daily-Noche-2026-09-19.md](Ender/Ender-Daily-Noche-2026-09-19.md) |
| Itzan | `26 / 52` | 1 / 6 (H1) | H2 (6/9), H3 (6/7) | H4, H5, H6 | [Itzan-Daily-Noche-2026-09-19.md](Itzan/Itzan-Daily-Noche-2026-09-19.md) |
| Marcelo | `29/54` | 3 / 6 | — | — | [Marcelo-Daily-Noche-2026-09-19.md](Marcelo/Marcelo-Daily-Noche-2026-09-19.md) — **H3 confirmó por ejecución un `PRODUCT_BUG` de autorización (leer/cancelar/reprogramar la cita de otro paciente, incluso de otra organización) y lo dejó CORREGIDO y reverificado: PR [api#447](https://github.com/mdavila-2001/mantra-core-health-api/pull/447)** |
| Justin | **53 / 53** | 6 / 6 | — | — (las 13 pendientes se cerraron el 20/09; ver §8 de su daily) | [Justin-Daily-Noche-2026-09-19.md](Justin/Justin-Daily-Noche-2026-09-19.md) |

### Qué NO se puede escribir en este documento

- Un `PASS` sin comando y exit code pegados.
- «Listo», «funciona» o «implementado» sobre algo que no se ejecutó.
- Un porcentaje que no salga de `HECHO / total`.
- Un `BLOCKED` disfrazado de `PASS` porque «igual compila».
- Datos de pacientes reales en cualquier salida pegada.
