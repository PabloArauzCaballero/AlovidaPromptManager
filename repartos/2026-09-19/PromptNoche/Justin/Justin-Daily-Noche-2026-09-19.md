# Daily de Justin — turno noche — 2026-09-19

> **Estado:** `IN_PROGRESS`. Este archivo se creó **al repartir**, antes del turno.
> Los resultados están en `NOT_RUN` porque **todavía no ejecutaste nada**. Completalo al cerrar.

- **Persona:** Justin · **Turno:** noche · **Fecha:** 2026-09-19 · **Día del plazo:** 1 · **Línea:** B
- **Lote:** [Iniciar la relacion agenda -> mensajeria con dobles estrictos y su registro de checks](Dia1-AdaptadorAgendaMensajeria.Integracion/IniciarAdaptadorConDoblesEstrictos.md)
- **Modo:** `DIAGNOSE_DESIGN` — **no escribís en `src/` de Mantra este turno.**
- **Daily del equipo:** [Daily-Noche-2026-09-19.md](../Daily-Noche-2026-09-19.md)

## 1. Qué se te pidió

Una especificacion de la relacion que cualquiera puede implementar manana, mas la lista explicita de lo que un doble **jamas** va a acreditar.

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
| Ender | El contrato fijado con hash (su M14). Mientras no exista, tu doble se marca `PROVISIONAL` | `NO` |
| Pablo | Comandos reales (su M7) y PostgreSQL/Docker (su M8) | `NO` |
| Marcelo | Que relacion prioriza (su M10) | `NO` |

## 4. Qué entregás vos

| A quién | Qué exactamente | Entregado |
|---|---|---|
| Ender | Que reglas necesita tu validador que el contrato todavia no define (Q-12, Q-13) | `NO` |
| Itzan | La ficha de la relacion (M10) | `NO` |
| Marcelo | Si su recorrido toca un canal cuyo limite de verificacion esta en tu M12 | `NO` |
| Pablo | Comandos reales (M8) y disponibilidad de PostgreSQL/Docker (M9) | `NO` |

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

Un doble que no hace fallar el caso 4 (respuesta incompatible) ni el caso 5 (operacion no registrada) fabrica verdes. El estado maximo alcanzable hoy es `ADAPTER_VERIFIED_WITH_DOUBLES`, nunca integracion verificada.

## 8. Antes de cerrar

- [ ] Todas las microtareas están en `HECHO` o `BLOCKED` con motivo y salida del error. Ninguna quedó en `EN CURSO`.
- [ ] Ningún `PASS` sin comando y exit code pegados.
- [ ] Ninguna afirmación excede lo que ejecutaste. *¿Algún éxito declarado depende de algo que no ejecutaste?*
- [ ] El handoff de la sección 4 está entregado y avisado en el daily del equipo.
- [ ] Ninguna salida pegada contiene datos reales de pacientes. Si los tenía: enmascarada, **y aclarado que se enmascaró**.
- [ ] Tu fila del [daily del equipo](../Daily-Noche-2026-09-19.md) está actualizada.
