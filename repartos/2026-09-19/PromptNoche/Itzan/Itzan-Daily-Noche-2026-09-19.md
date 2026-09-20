# Daily de Itzan — turno noche — 2026-09-19

> **Estado:** `IN_PROGRESS`. Este archivo se creó **al repartir**, antes del turno.
> Los resultados están en `NOT_RUN` porque **todavía no ejecutaste nada**. Completalo al cerrar.

- **Persona:** Itzan · **Turno:** noche · **Fecha:** 2026-09-19 · **Día del plazo:** 1 · **Línea:** A
- **Lote:** [Delimitar la composicion de la capacidad y su baseline local](Dia1-ComposicionYBaseline.Backend/DelimitarComposicionYBaseline.md)
- **Modo:** `DIAGNOSE_DESIGN` — **no escribís en `src/` de Mantra este turno.**
- **Daily del equipo:** [Daily-Noche-2026-09-19.md](../Daily-Noche-2026-09-19.md)

## 1. Qué se te pidió

Que carga hoy `SchedulingModule` y por que, que composicion minima se propone, y como se levanta una base de pruebas aislada e identificable.

## 2. Avance

**0 / 14 microtareas en `HECHO`.** Se calcula, no se estima. Las microtareas `A MEDIAS` cuentan como **no hechas**.

| Estado | Cantidad |
|---|---|
| `HECHO` | 0 |
| `EN CURSO` | 0 |
| `A MEDIAS` | 0 |
| `BLOCKED` | 0 |
| `TODO` | 14 |

### Detalle por microtarea

| # | Estado | Comando ejecutado | Exit code | Ruta de la evidencia |
|---|---|---|---|---|
| M1 | `TODO` | — | — | — |
| M2 | `TODO` | — | — | — |
| M3 | `TODO` | — | — | — |
| M4 | `TODO` | — | — | — |
| M5 | `TODO` | — | — | — |
| M6 | `TODO` | — | — | — |
| M7 | `TODO` | — | — | — |
| M8 | `TODO` | — | — | — |
| M9 | `TODO` | — | — | — |
| M10 | `TODO` | — | — | — |
| M11 | `TODO` | — | — | — |
| M12 | `TODO` | — | — | — |
| M13 | `TODO` | — | — | — |
| M14 | `TODO` | — | — | — |

> Una fila con estado `HECHO` y la columna de comando vacía **no vale**. `command` y `exit_code` son `null`
> sólo cuando no hubo ejecución, y en ese caso la causa va escrita en la columna de evidencia.

## 3. Qué esperás de otros

| De quién | Qué exactamente | Recibido |
|---|---|---|
| Pablo | Imports de `scheduling.module.ts` (M10), ORM (M11) y disponibilidad de PostgreSQL/Docker (M8) -- para **contrastar**, no para copiar | `NO` |
| Ender | Que transporta el contrato sobre actor y organizacion (su M10) | `NO` |

## 4. Qué entregás vos

| A quién | Qué exactamente | Entregado |
|---|---|---|
| Pablo | Si tu lectura de los imports difiere de la suya (M1) y el resultado de PostgreSQL/Docker (M10) | `NO` |
| Justin | Que proveedores entran en la composicion de capacidad (M9) | `NO` |
| Marcelo | Si la garantia transaccional que su recorrido necesita existe hoy o no (M8) | `NO` |

## 5. Bloqueos

*(Completar. Un bloqueo se registra apenas aparece, no al final del turno.)*

| Qué bloquea | Qué intentaste | Qué lo destraba | De quién depende |
|---|---|---|---|
| — | — | — | — |

**Si un bloqueo se confirma, no iteres sobre él:** registrá la causa y pasá a la siguiente microtarea independiente.

## 6. Ambigüedades que encontraste

*(Se registran, no se resuelven. Una ambigüedad resuelta por conveniencia es una decisión de negocio tomada por quien no podía tomarla.)*

| ID | Qué | Supuesto que tomaste | A quién confirmárselo |
|---|---|---|---|
| — | — | — | — |

## 7. El riesgo específico de tu lote

La trampa del turno: presentar una propuesta de composicion como aislamiento demostrado. El aislamiento se demuestra el **Dia 2**, ejecutando la prueba de ausencia. Hoy todo lo que clasifiques es `HYPOTHESIS`.

## 8. Antes de cerrar

- [ ] Todas las microtareas están en `HECHO` o `BLOCKED` con motivo y salida del error. Ninguna quedó en `EN CURSO`.
- [ ] Ningún `PASS` sin comando y exit code pegados.
- [ ] Ninguna afirmación excede lo que ejecutaste. *¿Algún éxito declarado depende de algo que no ejecutaste?*
- [ ] El handoff de la sección 4 está entregado y avisado en el daily del equipo.
- [ ] Ninguna salida pegada contiene datos reales de pacientes. Si los tenía: enmascarada, **y aclarado que se enmascaró**.
- [ ] Tu fila del [daily del equipo](../Daily-Noche-2026-09-19.md) está actualizada.
