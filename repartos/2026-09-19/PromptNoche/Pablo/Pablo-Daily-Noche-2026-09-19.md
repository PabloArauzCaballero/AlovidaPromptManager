# Daily de Pablo — turno noche — 2026-09-19

> **Estado:** `IN_PROGRESS`. Este archivo se creó **al repartir**, antes del turno.
> Los resultados están en `NOT_RUN` porque **todavía no ejecutaste nada**. Completalo al cerrar.

- **Persona:** Pablo · **Turno:** noche · **Fecha:** 2026-09-19 · **Día del plazo:** 1 · **Línea:** A
- **Lote:** [Fijar corte reproducible y mapa de dependencias del piloto](Dia1-CorteReproducible.Backend/FijarCorteYMapaDeDependencias.md)
- **Modo:** `DIAGNOSE_DESIGN` — **no escribís en `src/` de Mantra este turno.**
- **Daily del equipo:** [Daily-Noche-2026-09-19.md](../Daily-Noche-2026-09-19.md)

## 1. Qué se te pidió

Que commit exacto atacamos, que esta realmente instalado y corriendo, y que dependencia concreta bloquea el piloto de avisos de agenda.

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
| -- | Nadie: tu lote es el que desbloquea a los otros cuatro. Arranca primero. | `NO` |

## 4. Qué entregás vos

| A quién | Qué exactamente | Entregado |
|---|---|---|
| Ender | Rutas reales del puerto y del adaptador (M9) y la tension de semantica (M12) | `NO` |
| Itzan | Imports de `scheduling.module.ts` (M10) y comportamiento del ORM (M11) | `NO` |
| Marcelo y Justin | Comandos de verificacion que existen de verdad (M7) y disponibilidad de PostgreSQL/Docker (M8) | `NO` |

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

Si el SHA de `dev` cambio respecto del paquete, **ese** es el corte y hay que avisarlo temprano: cuatro personas estan esperando ese dato.

## 8. Antes de cerrar

- [ ] Todas las microtareas están en `HECHO` o `BLOCKED` con motivo y salida del error. Ninguna quedó en `EN CURSO`.
- [ ] Ningún `PASS` sin comando y exit code pegados.
- [ ] Ninguna afirmación excede lo que ejecutaste. *¿Algún éxito declarado depende de algo que no ejecutaste?*
- [ ] El handoff de la sección 4 está entregado y avisado en el daily del equipo.
- [ ] Ninguna salida pegada contiene datos reales de pacientes. Si los tenía: enmascarada, **y aclarado que se enmascaró**.
- [ ] Tu fila del [daily del equipo](../Daily-Noche-2026-09-19.md) está actualizada.
