# Daily de Marcelo — turno noche — 2026-09-19

> **Estado:** `IN_PROGRESS`. Este archivo se creó **al repartir**, antes del turno.
> Los resultados están en `NOT_RUN` porque **todavía no ejecutaste nada**. Completalo al cerrar.

- **Persona:** Marcelo · **Turno:** noche · **Fecha:** 2026-09-19 · **Día del plazo:** 1 · **Línea:** B
- **Lote:** [Seleccionar el recorrido prioritario del registro y sus relaciones](Dia1-RecorridoPrioritario.Registro/SeleccionarRecorridoPrioritarioYRelaciones.md)
- **Modo:** `DIAGNOSE_DESIGN` — **no escribís en `src/` de Mantra este turno.**
- **Daily del equipo:** [Daily-Noche-2026-09-19.md](../Daily-Noche-2026-09-19.md)

## 1. Qué se te pidió

Que recorrido funcional atacamos primero, por que ese, que participantes exige y con que localizadores reales se verifica.

## 2. Avance

**0 / 13 microtareas en `HECHO`.** Se calcula, no se estima. Las microtareas `A MEDIAS` cuentan como **no hechas**.

| Estado | Cantidad |
|---|---|
| `HECHO` | 0 |
| `EN CURSO` | 0 |
| `A MEDIAS` | 0 |
| `BLOCKED` | 0 |
| `TODO` | 13 |

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

> Una fila con estado `HECHO` y la columna de comando vacía **no vale**. `command` y `exit_code` son `null`
> sólo cuando no hubo ejecución, y en ese caso la causa va escrita en la columna de evidencia.

## 3. Qué esperás de otros

| De quién | Qué exactamente | Recibido |
|---|---|---|
| Pablo | El SHA del corte del backend (su M1) | `NO` |
| -- | Tu linea puede arrancar en paralelo: los dos frontends no dependen del corte del backend | `NO` |

## 4. Qué entregás vos

| A quién | Qué exactamente | Entregado |
|---|---|---|
| Justin | Las relaciones (M10, M11): de ahi sale que adaptador arranca primero | `NO` |
| Itzan | Si el recorrido exige una escritura atomica que cruza capacidades | `NO` |
| Ender | Que garantia funcional le exige el recorrido al aviso | `NO` |
| Pablo | El estado del registro funcional original (M1) y la tabla de demanda contra capacidad (M13) | `NO` |

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

Lo mas caro que podes hacer esta noche es completar a ojo un porcentaje, una formula o un catalogo que el registro no define. Un numero inventado aca termina en una factura.

## 8. Antes de cerrar

- [ ] Todas las microtareas están en `HECHO` o `BLOCKED` con motivo y salida del error. Ninguna quedó en `EN CURSO`.
- [ ] Ningún `PASS` sin comando y exit code pegados.
- [ ] Ninguna afirmación excede lo que ejecutaste. *¿Algún éxito declarado depende de algo que no ejecutaste?*
- [ ] El handoff de la sección 4 está entregado y avisado en el daily del equipo.
- [ ] Ninguna salida pegada contiene datos reales de pacientes. Si los tenía: enmascarada, **y aclarado que se enmascaró**.
- [ ] Tu fila del [daily del equipo](../Daily-Noche-2026-09-19.md) está actualizada.
