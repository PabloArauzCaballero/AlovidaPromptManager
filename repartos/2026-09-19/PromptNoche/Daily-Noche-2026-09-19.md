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
| **Itzan** | [Composición, prueba de ausencia y baseline de la capacidad](Itzan/Noche-PilotoDeAvisos.Aislamiento/ComposicionAusenciaYBaseline.md) | A | 6 | 18 | 52 | `26 / 52` — H1 `HECHO`; H2 y H3 `A MEDIAS`; H4–H6 `BLOQUEADO` |
| **Marcelo** | [Recorrido del registro: selección, casos y aceptación](Marcelo/Noche-PilotoDeAvisos.Registro/RecorridoCasosYAceptacion.md) | B | 6 | 18 | 54 | `NOT_RUN` |
| **Justin** | [La relación agenda → mensajería: dobles, integración y regresión final](Justin/Noche-PilotoDeAvisos.Integracion/DoblesRelacionYRegresionFinal.md) | B | 6 | 18 | 53 | `NOT_RUN` |
| | | | **30** | **90** | **262** | |

**Total del turno: 0 / 262 microtareas.** El avance se reporta `HECHO / total`, **nunca a ojo**.

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

## 6. Cierre del turno — completar acá

| Persona | HECHO / total | Hitos cerrados | `A MEDIAS` | `BLOCKED` | Su daily |
|---|---|---|---|---|---|
| Pablo | `NOT_RUN` | 0 / 6 | — | — | [Pablo-Daily-Noche-2026-09-19.md](Pablo/Pablo-Daily-Noche-2026-09-19.md) |
| Ender | `NOT_RUN` | 0 / 6 | — | — | [Ender-Daily-Noche-2026-09-19.md](Ender/Ender-Daily-Noche-2026-09-19.md) |
| Itzan | `26 / 52` | 1 / 6 (H1) | H2 (6/9), H3 (6/7) | H4, H5, H6 | [Itzan-Daily-Noche-2026-09-19.md](Itzan/Itzan-Daily-Noche-2026-09-19.md) |
| Marcelo | `NOT_RUN` | 0 / 6 | — | — | [Marcelo-Daily-Noche-2026-09-19.md](Marcelo/Marcelo-Daily-Noche-2026-09-19.md) |
| Justin | `NOT_RUN` | 0 / 6 | — | — | [Justin-Daily-Noche-2026-09-19.md](Justin/Justin-Daily-Noche-2026-09-19.md) |

### Qué NO se puede escribir en este documento

- Un `PASS` sin comando y exit code pegados.
- «Listo», «funciona» o «implementado» sobre algo que no se ejecutó.
- Un porcentaje que no salga de `HECHO / total`.
- Un `BLOCKED` disfrazado de `PASS` porque «igual compila».
- Datos de pacientes reales en cualquier salida pegada.
