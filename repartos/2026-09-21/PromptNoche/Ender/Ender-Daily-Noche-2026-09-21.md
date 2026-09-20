# Daily de Ender — turno noche — 2026-09-21

> **Estado:** `IN_PROGRESS`. Se creó al repartir, antes del turno.
> Los resultados están en `NOT_RUN` porque **todavía no ejecutaste nada**. Completalo al cerrar.

- **Persona:** Ender · **Turno:** noche · **Fecha:** 2026-09-21 · **Día del plazo:** 3 · **Línea:** A
- **Lote:** [Gobernar la evolución del contrato sin romper a quien lo consume](Dia3-EvolucionDelContrato.Backend/GobernarLaEvolucionDelContrato.md)
- **Modo:** `BUILD_CONTRACT` — versionás y probás compatibilidad; no rompés nada en silencio
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

Cualquier cambio del contrato tiene una regla escrita de qué se puede cambiar, qué consumidores afecta y cómo se transiciona — y hay un caso que **demuestra** que un cambio incompatible falla donde tiene que fallar.

## 3. Avance

**0 / 7 microtareas en `HECHO`.** Se calcula, no se estima. Las `A MEDIAS` cuentan como **no hechas**.

| # | Estado | Comando ejecutado | Exit code | Ruta de la evidencia |
|---|---|---|---|---|
| M1 | `TODO` | — | — | — |
| M2 | `TODO` | — | — | — |
| M3 | `TODO` | — | — | — |
| M4 | `TODO` | — | — | — |
| M5 | `TODO` | — | — | — |
| M6 | `TODO` | — | — | — |
| M7 | `TODO` | — | — | — |

> Una fila `HECHO` con la columna de comando vacía **no vale**. `command` y `exit_code` son `null`
> sólo cuando no hubo ejecución, y la causa va escrita en la columna de evidencia.

## 4. Qué entregás vos

| A quién | Qué exactamente | Entregado |
|---|---|---|
| Justin | La matriz: es la que dice contra qué versiones probar | `NO` |
| Pablo | Qué contrato necesita la segunda capacidad | `NO` |
| Itzan | Si el artefacto empaquetado referencia una versión que va a cambiar | `NO` |

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
