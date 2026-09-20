# Daily de Pablo — turno noche — 2026-09-21

> **Estado:** `IN_PROGRESS`. Se creó al repartir, antes del turno.
> Los resultados están en `NOT_RUN` porque **todavía no ejecutaste nada**. Completalo al cerrar.

- **Persona:** Pablo · **Turno:** noche · **Fecha:** 2026-09-21 · **Día del plazo:** 3 · **Línea:** A
- **Lote:** [Elegir la segunda capacidad replicando solo mecanismos ya probados](Dia3-SegundaCapacidad.Backend/ReplicarSoloLoQueYaFunciono.md)
- **Modo:** `DIAGNOSE_DESIGN` — elegís y justificás. La construcción viene después
- **Daily del equipo:** [Daily-Noche-2026-09-21.md](../Daily-Noche-2026-09-21.md)
- **Tu lote de ayer:** Día 2. **La evidencia de ayer no cubre el código que toques hoy.**

## 1. Instalación del estándar — se verifica todos los días

- [ ] `ls .claude/skills | wc -l` → **176**, salida pegada acá abajo.
- [ ] `python .claude/hooks/plan_gate.py --self-test` → **11 PASS, 0 FAIL**, salida pegada.
- [ ] Cargaste `skills-router` y las skills de la sección 1 de tu prompt.
- [ ] Creaste tu `PLAN.md` **antes** del primer `Edit`/`Write` de código.

```text
(pegar acá la salida de los dos comandos)
```

**Sin estas cuatro casillas, tu lote arranca en `BLOQUEADO`, no en `EN CURSO`.**

## 2. Qué se te pidió

Hay una segunda capacidad candidata elegida con criterio escrito, y una lista explícita de qué mecanismo del piloto se reusa **porque ya se demostró** y cuál no se reusa.

## 3. Avance

**0 / 8 microtareas en `HECHO`.** Se calcula, no se estima. Las `A MEDIAS` cuentan como **no hechas**.

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

> Una fila `HECHO` con la columna de comando vacía **no vale**. `command` y `exit_code` son `null`
> sólo cuando no hubo ejecución, y la causa va escrita en la columna de evidencia.

## 4. Qué entregás vos

| A quién | Qué exactamente | Entregado |
|---|---|---|
| Ender | Qué contrato va a necesitar la segunda capacidad | `NO` |
| Itzan | Qué composición reusa y qué no | `NO` |
| Marcelo | Si la segunda capacidad toca su recorrido prioritario | `NO` |

## 5. Bloqueos

| Qué bloquea | Qué intentaste | Qué lo destraba | De quién depende |
|---|---|---|---|
| — | — | — | — |

**Si un bloqueo se confirma, no iteres sobre él:** registrá la causa y pasá a la siguiente microtarea independiente.

## 6. Ambigüedades que encontraste

*(Se registran, no se resuelven.)*

| ID | Qué | Supuesto que tomaste | A quién confirmárselo |
|---|---|---|---|
| — | — | — | — |

## 7. Antes de cerrar

- [ ] Todas las microtareas en `HECHO` o `BLOCKED` con motivo y salida del error. Ninguna en `EN CURSO`.
- [ ] Ningún `PASS` sin comando y exit code pegados.
- [ ] *¿Algún éxito declarado depende de algo que no ejecutaste?*
- [ ] Si editaste después de verificar, **esa área volvió a `WRITTEN`** y la reverificaste.
- [ ] Ninguna salida pegada contiene datos reales de pacientes. Si los tenía: enmascarada **y aclarado**.
- [ ] Tu fila del [daily del equipo](../Daily-Noche-2026-09-21.md) está actualizada.
