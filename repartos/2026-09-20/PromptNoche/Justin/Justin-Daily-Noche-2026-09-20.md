# Daily de Justin — turno noche — 2026-09-20

> **Estado:** `IN_PROGRESS`. Se creó al repartir, antes del turno.
> Los resultados están en `NOT_RUN` porque **todavía no ejecutaste nada**. Completalo al cerrar.

- **Persona:** Justin · **Turno:** noche · **Fecha:** 2026-09-20 · **Día del plazo:** 2 · **Línea:** B
- **Lote:** [Ejercitar la relación con dobles fijados de ambos extremos](Dia2-AdaptadorConDobles.Integracion/ProbarLaRelacionConDoblesFijados.md)
- **Modo:** `BUILD_ADAPTER` — el adaptador y sus pruebas viven en la entrega de integración
- **Daily del equipo:** [Daily-Noche-2026-09-20.md](../Daily-Noche-2026-09-20.md)
- **Tu lote de ayer:** Día 1. **La evidencia de ayer no cubre el código que toques hoy.**

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

La relación `agenda → mensajería` corre de punta a punta con dobles fijados de los dos extremos, y su estado registrado es `ADAPTER_VERIFIED_WITH_DOUBLES` — ni una palabra más fuerte.

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
| Marcelo | Qué casos suyos ya se pueden ejercitar y cuáles esperan participantes reales | `NO` |
| Ender | Qué del contrato resultó ambiguo al implementarlo — es la mejor prueba de un contrato | `NO` |
| Itzan | Qué necesita el adaptador de la composición de capacidad | `NO` |

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
- [ ] Tu fila del [daily del equipo](../Daily-Noche-2026-09-20.md) está actualizada.
