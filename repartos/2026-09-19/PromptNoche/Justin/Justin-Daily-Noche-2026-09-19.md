# Daily de Justin — turno noche — 2026-09-19

> **Estado:** `IN_PROGRESS`. Se creó **al repartir**, antes del turno.
> Todo está en `NOT_RUN` porque **todavía no ejecutaste nada**. Completalo al cerrar.

- **Persona:** Justin · **Turno:** noche · **Fecha:** 2026-09-19 · **Línea:** B · **Rol:** responsable de relación e integración
- **Tu prompt:** [La relación agenda → mensajería: dobles, integración y regresión final](Noche-PilotoDeAvisos.Integracion/DoblesRelacionYRegresionFinal.md)
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
| **H1** — Iniciar la relación `agenda → mensajería` con dobles estrictos y su registro de checks | `ALTA` | 13 | 0 | `TODO` |
| **H2** — Ejercitar la relación con dobles fijados de ambos extremos | `ALTA` | 8 | 0 | `TODO` |
| **H3** — Integrar la relación con los artefactos que ya estén listos | `MEDIA` | 8 | 0 | `TODO` |
| **H4** — Probar idempotencia, concurrencia y recuperación de la relación | `ALTA` | 8 | 0 | `TODO` |
| **H5** — Probar que un doble no puede llegar a producción ni salir a un destinatario real | `ALTA` | 7 | 0 | `TODO` |
| **H6** — Correr la regresión del candidato final | `ALTA` | 9 | 0 | `TODO` |
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
| **H1** | Ender | Qué reglas necesita tu validador que el contrato no define | `NO` |
| **H1** | Itzan | La ficha de la relación | `NO` |
| **H1** | Marcelo | Si su recorrido toca un canal cuyo límite de verificación tenés vos | `NO` |
| **H1** | Pablo | Comandos reales y disponibilidad de PostgreSQL/Docker | `NO` |
| **H2** | Marcelo | Qué casos suyos ya se pueden ejercitar y cuáles esperan participantes reales | `NO` |
| **H2** | Ender | Qué del contrato resultó ambiguo al implementarlo — es la mejor prueba de un contrato | `NO` |
| **H2** | Itzan | Qué necesita el adaptador de la composición de capacidad | `NO` |
| **H3** | Marcelo | Qué escenarios suyos ya corren con implementaciones reales | `NO` |
| **H3** | Itzan | Qué necesitó la relación de la composición | `NO` |
| **H3** | Ender | Qué ambigüedad del contrato apareció al integrar | `NO` |
| **H4** | Marcelo | Qué pasos de su recorrido quedan cubiertos por estas propiedades | `NO` |
| **H4** | Ender | Qué necesita el contrato para cerrar Q-12 y Q-13 | `NO` |
| **H4** | Itzan | Si la restricción de unicidad exige cambio de esquema | `NO` |
| **H5** | Marcelo | Qué discrepancias abiertas afectan su dictamen | `NO` |
| **H5** | Ender | La discrepancia doble vs proveedor real, si la hubo | `NO` |
| **H5** | Pablo | El registro consolidado para el cierre | `NO` |
| **H6** | Marcelo | El resultado de la regresión, incluido el rojo, para el dictamen | `NO` |
| **H6** | Pablo | Qué quedó en rojo y no se pudo reparar | `NO` |
| **H6** | Todo el equipo | El registro consolidado de la semana | `NO` |

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
