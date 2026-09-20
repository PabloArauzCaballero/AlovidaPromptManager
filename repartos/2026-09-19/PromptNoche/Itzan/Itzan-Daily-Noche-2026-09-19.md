# Daily de Itzan — turno noche — 2026-09-19

> **Estado:** `IN_PROGRESS`. Se creó **al repartir**, antes del turno.
> Todo está en `NOT_RUN` porque **todavía no ejecutaste nada**. Completalo al cerrar.

- **Persona:** Itzan · **Turno:** noche · **Fecha:** 2026-09-19 · **Línea:** A · **Rol:** propietario de capacidad / aislamiento
- **Tu prompt:** [Composición, prueba de ausencia y baseline de la capacidad](Noche-PilotoDeAvisos.Aislamiento/ComposicionAusenciaYBaseline.md)
- **Daily del equipo:** [Daily-Noche-2026-09-19.md](../Daily-Noche-2026-09-19.md)
- **6 hitos · 18 subtareas · 52 microtareas**

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

**0 / 52 microtareas en `HECHO`.** Se calcula, no se estima. Las `A MEDIAS` cuentan como **no hechas**.

| Hito | Prioridad | Microtareas | HECHO | Estado |
|---|---|---:|---:|---|
| **H1** — Delimitar la composición de la capacidad y su baseline local | `BLOQUEANTE` | 14 | 0 | `TODO` |
| **H2** — Demostrar materialmente la ausencia del proveedor | `BLOQUEANTE` | 9 | 0 | `TODO` |
| **H3** — Empaquetar y versionar el artefacto MODULE del piloto | `MEDIA` | 7 | 0 | `TODO` |
| **H4** — Estabilizar el baseline y probar la migración conjunta | `ALTA` | 8 | 0 | `TODO` |
| **H5** — Empaquetar el candidato final del módulo | `ALTA` | 7 | 0 | `TODO` |
| **H6** — Reejecutar los gates del artefacto reparado | `ALTA` | 7 | 0 | `TODO` |
| **TOTAL** | | **52** | **0** | |

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
| **H1** | Pablo | Si tu lectura de los imports difiere de la suya, y PostgreSQL/Docker | `NO` |
| **H1** | Justin | Qué proveedores entran en la composición de capacidad | `NO` |
| **H1** | Marcelo | Si la garantía transaccional que su recorrido necesita existe hoy | `NO` |
| **H2** | Todo el equipo | El veredicto: si hoy no hay aislamiento, **H3** cambia | `NO` |
| **H2** | Pablo | Qué import residual bloquea, para priorizarlo mañana | `NO` |
| **H2** | Marcelo | Si el recorrido elegido sigue siendo alcanzable con esta evidencia | `NO` |
| **H3** | Justin | El artefacto versionado que va a fijar en su relación | `NO` |
| **H3** | Pablo | Qué del empaquetado sirve para la segunda capacidad | `NO` |
| **H3** | Todo el equipo | La versión a consumir, en vez de la rama | `NO` |
| **H4** | Pablo | Si la deriva reveló algo que su corrección movió | `NO` |
| **H4** | Justin | El baseline fijado para su relación | `NO` |
| **H4** | Marcelo | Si el recorrido necesita datos que el baseline todavía no tiene | `NO` |
| **H5** | Justin | El candidato a fijar en la relación | `NO` |
| **H5** | Marcelo | Qué versión entra en el candidato compuesto | `NO` |
| **H5** | Pablo | Si algo del empaquetado reveló una dependencia | `NO` |
| **H6** | Marcelo | La versión final del módulo que entra en el dictamen | `NO` |
| **H6** | Justin | El artefacto a fijar en la regresión final | `NO` |
| **H6** | Pablo | Si algo se rompió al reempaquetar | `NO` |

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
