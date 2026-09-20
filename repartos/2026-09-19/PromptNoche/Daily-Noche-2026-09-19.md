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
| **Pablo** | [Corte, laboratorio del piloto y regresión de aislamiento](Pablo/Noche-PilotoDeAvisos.Backend/CorteLaboratorioYRegresion.md) | A | 6 | 18 | 53 | `NOT_RUN` |
| **Ender** | [El contrato del piloto: fijarlo, validarlo y gobernar su evolución](Ender/Noche-PilotoDeAvisos.Contrato/ContratoValidadorYCompatibilidad.md) | A | 6 | 18 | 50 | `NOT_RUN` |
| **Itzan** | [Composición, prueba de ausencia y baseline de la capacidad](Itzan/Noche-PilotoDeAvisos.Aislamiento/ComposicionAusenciaYBaseline.md) | A | 6 | 18 | 52 | `NOT_RUN` |
| **Marcelo** | [Recorrido del registro: selección, casos y aceptación](Marcelo/Noche-PilotoDeAvisos.Registro/RecorridoCasosYAceptacion.md) | B | 6 | 18 | 54 | `NOT_RUN` |
| **Justin** | [La relación agenda → mensajería: dobles, integración y regresión final](Justin/Noche-PilotoDeAvisos.Integracion/DoblesRelacionYRegresionFinal.md) | B | 6 | 18 | 53 | **36/53** |
| | | | **30** | **90** | **262** | |

**Total del turno: 36 / 262 microtareas** (sólo el carril B reportó). El avance se reporta `HECHO / total`, **nunca a ojo**.

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
| **HALL-01** | **`bootstrapTestApp()` aborta**: el seed «aseguradoras de Bolivia» muere con `column "sigla" of relation "insurance_carriers" does not exist` (42703). Deriva verificada en las 4 capas: la entidad ORM declara `sigla`, el DDL de `SQL/` no la tiene, la base viva tampoco. **Ningún int-spec que use el arnés puede correr** | **Pablo** (laboratorio), **Itzan** (baseline), **Marcelo** (aceptación) | `ABIERTO` |
| **HALL-02** | **La relación `agenda → mensajería` no entrega ningún aviso, en silencio.** El adaptador direcciona el canal in-app por `MESSAGING_SEED.inAppChannelId` (`d0240273-…`); la base lo tiene con `ed1b78a4-…`. `createRequest` lanza `Canal no encontrado`, `emit` lo atrapa (el puerto promete no lanzar) y devuelve un `skippedReason` genérico. **El seed del backend ya esquiva esa divergencia buscando por código; el adaptador no** | **Marcelo** (todo su recorrido), **Itzan** (composición) | `ABIERTO` |
| **HALL-03** | `messaging.notification_requests.debounce_key` **no tiene índice, ni único ni común**. La deduplicación es un `findOne`+`insert` en READ COMMITTED: una carrera. `outbox_messages` y `queued_jobs` **sí** tienen el suyo | **Itzan** (sí exige cambio de esquema) | `ABIERTO` |
| **HALL-04** | **`database/SQL/` volvió a existir** en `dev` (`git ls-tree` lo devuelve). Según `CLAUDE.md` se eliminó en v4.0.9 y `yarn ddl:sources` debe fallar si reaparece. No verificado corriendo | **Pablo** | `ABIERTO` |
| **HALL-05** | Deriva de documentación en `CLAUDE.md`: FKs 6 663 → **6 664**; suites unitarias 439 → **681**; pruebas 4 500 → **8 249** | Coordinación | `ABIERTO` |

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
| Pablo | `NOT_RUN` | 0 / 6 | — | — | [Pablo-Daily-Noche-2026-09-19.md](Pablo/Pablo-Daily-Noche-2026-09-19.md) |
| Ender | `NOT_RUN` | 0 / 6 | — | — | [Ender-Daily-Noche-2026-09-19.md](Ender/Ender-Daily-Noche-2026-09-19.md) |
| Itzan | `NOT_RUN` | 0 / 6 | — | — | [Itzan-Daily-Noche-2026-09-19.md](Itzan/Itzan-Daily-Noche-2026-09-19.md) |
| Marcelo | `NOT_RUN` | 0 / 6 | — | — | [Marcelo-Daily-Noche-2026-09-19.md](Marcelo/Marcelo-Daily-Noche-2026-09-19.md) |
| Justin | **36 / 53** | 1 / 6 (H1) | H2, H3, H4, H5, H6 | H2.S1.M1 · H2.S3.M1 · H4.S3.M1-M3 · H5.S1.M2 | [Justin-Daily-Noche-2026-09-19.md](Justin/Justin-Daily-Noche-2026-09-19.md) |

### Qué NO se puede escribir en este documento

- Un `PASS` sin comando y exit code pegados.
- «Listo», «funciona» o «implementado» sobre algo que no se ejecutó.
- Un porcentaje que no salga de `HECHO / total`.
- Un `BLOCKED` disfrazado de `PASS` porque «igual compila».
- Datos de pacientes reales en cualquier salida pegada.
