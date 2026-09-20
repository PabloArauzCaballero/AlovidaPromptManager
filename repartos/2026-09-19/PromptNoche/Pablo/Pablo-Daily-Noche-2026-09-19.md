# Daily de Pablo — turno noche — 2026-09-19

> **Estado:** `IN_PROGRESS`. Se creó **al repartir**, antes del turno.
> Todo está en `NOT_RUN` porque **todavía no ejecutaste nada**. Completalo al cerrar.

- **Persona:** Pablo · **Turno:** noche · **Fecha:** 2026-09-19 · **Línea:** A · **Rol:** habilitación de autonomía
- **Tu prompt:** [Corte, laboratorio del piloto y regresión de aislamiento](Noche-PilotoDeAvisos.Backend/CorteLaboratorioYRegresion.md)
- **Daily del equipo:** [Daily-Noche-2026-09-19.md](../Daily-Noche-2026-09-19.md)
- **6 hitos · 18 subtareas · 53 microtareas**

## 1. Instalación del estándar — es lo primero, no lo último

- [ ] `ls .claude/skills | wc -l` → **176**, salida pegada acá abajo.
- [ ] `python .claude/hooks/plan_gate.py --self-test` → **11 PASS, 0 FAIL**, salida pegada.
- [ ] Cargaste `skills-router` y las skills de la sección 1 de tu prompt.
- [ ] Creaste tu `PLAN.md` **antes** del primer `Edit`/`Write` de código.

```text
(pegar acá la salida de los dos comandos)
```

**Sin estas cuatro casillas, tu turno arranca en `BLOQUEADO`, no en `EN CURSO`.**

## 2. Avance por hito

**0 / 53 microtareas en `HECHO`.** Se calcula, no se estima. Las `A MEDIAS` cuentan como **no hechas**.

| Hito | Prioridad | Microtareas | HECHO | Estado |
|---|---|---:|---:|---|
| **H1** — Fijar corte reproducible y mapa de dependencias del piloto | `BLOQUEANTE` | 13 | 0 | `TODO` |
| **H2** — Construir el laboratorio de la capacidad del piloto | `ALTA` | 9 | 0 | `TODO` |
| **H3** — Elegir la segunda capacidad replicando solo mecanismos ya probados | `MEDIA` | 8 | 0 | `TODO` |
| **H4** — Corregir las dependencias residuales que liberan más trabajo | `MEDIA` | 8 | 0 | `TODO` |
| **H5** — Regresión de aislamiento y replay del contraejemplo | `ALTA` | 7 | 0 | `TODO` |
| **H6** — Reparaciones acotadas y nueva verificación de lo afectado | `ALTA` | 8 | 0 | `TODO` |
| **TOTAL** | | **53** | **0** | |

> Seis hitos no entran en una noche, y está dicho en tu prompt. **Lo que no cierres va `A MEDIAS`
> con qué anda, qué no anda y qué falta exactamente.** Disfrazarlo de `HECHO` es lo único prohibido.

## 3. Detalle de las microtareas que tocaste

*(Una fila por microtarea abierta. Las que no abriste quedan en `TODO` y no hace falta listarlas.)*

| ID | Estado | Comando ejecutado | Exit code | Ruta de la evidencia |
|---|---|---|---|---|
| H1.S1.M1 | `TODO` | — | — | — |

> Una fila `HECHO` con la columna de comando vacía **no vale**. `command` y `exit_code` son `null`
> sólo cuando no hubo ejecución, y la causa va escrita en la columna de evidencia.

## 4. Qué entregás vos

| Al cerrar | A quién | Qué exactamente | Entregado |
|---|---|---|---|
| **H1** | Ender | Rutas reales del puerto y del adaptador, y la tensión de semántica | `NO` |
| **H1** | Itzan | Imports de `scheduling.module.ts` y comportamiento del ORM | `NO` |
| **H1** | Marcelo y Justin | Comandos de verificación reales y disponibilidad de PostgreSQL/Docker | `NO` |
| **H2** | Itzan | El laboratorio que va a correr dentro de la copia descartable de su prueba de ausencia | `NO` |
| **H2** | Justin | Qué valida hoy el harness y qué no, para que su doble no asuma de más | `NO` |
| **H2** | Ender | Qué reglas del contrato el validador no puede comprobar todavía | `NO` |
| **H3** | Ender | Qué contrato va a necesitar la segunda capacidad | `NO` |
| **H3** | Itzan | Qué composición reusa y qué no | `NO` |
| **H3** | Marcelo | Si la segunda capacidad toca su recorrido prioritario | `NO` |
| **H4** | Itzan | Qué cambió en la composición y hay que reflejar en el baseline | `NO` |
| **H4** | Ender | Si alguna corrección movió el contrato | `NO` |
| **H4** | Justin | Si hay que reejecutar la relación por estos cambios | `NO` |
| **H5** | Todo el equipo | El estado real de la regresión, incluido el rojo | `NO` |
| **H5** | Itzan | Qué hay que reempaquetar si algo cambió | `NO` |
| **H5** | Marcelo | Si la regresión bloquea la aceptación | `NO` |
| **H6** | Justin | Qué hay que incluir en la regresión del candidato final | `NO` |
| **H6** | Marcelo | Qué rojo sigue abierto y afecta el dictamen | `NO` |
| **H6** | Itzan | Si hay que reempaquetar tras las reparaciones | `NO` |

## 5. Bloqueos

| Qué bloquea | Qué intentaste | Qué lo destraba | De quién depende |
|---|---|---|---|
| — | — | — | — |

**Un bloqueo se reporta apenas aparece, no al final.** Si se confirma, no iteres: registrá la causa
y pasá a la siguiente microtarea independiente.

## 6. Ambigüedades que encontraste

*(Se registran, no se resuelven. Una ambigüedad resuelta por conveniencia es una decisión de
negocio tomada por quien no podía tomarla.)*

| ID | Qué | Supuesto que tomaste | A quién confirmárselo |
|---|---|---|---|
| — | — | — | — |

## 7. Antes de cerrar

- [ ] Ninguna microtarea quedó en `EN CURSO`: todas en `HECHO`, `BLOCKED`, `A MEDIAS` o `TODO`.
- [ ] Ningún `PASS` sin comando y exit code pegados.
- [ ] Cada hito y cada subtarea que tocaste tienen su **Estado** actualizado, no sólo las microtareas.
- [ ] *¿Algún éxito declarado depende de algo que no ejecutaste?*
- [ ] Si editaste después de verificar, **esa área volvió a `WRITTEN`** y la reverificaste.
- [ ] Ninguna salida pegada contiene datos reales de pacientes. Si los tenía: enmascarada **y aclarado**.
- [ ] Tu fila del [daily del equipo](../Daily-Noche-2026-09-19.md) está actualizada.
