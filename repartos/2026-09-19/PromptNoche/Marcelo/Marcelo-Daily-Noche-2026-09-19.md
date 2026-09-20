# Daily de Marcelo — turno noche — 2026-09-19

> **Estado:** `IN_PROGRESS`. Se creó **al repartir**, antes del turno.
> Todo está en `NOT_RUN` porque **todavía no ejecutaste nada**. Completalo al cerrar.

- **Persona:** Marcelo · **Turno:** noche · **Fecha:** 2026-09-19 · **Línea:** B · **Rol:** cierre funcional e integración
- **Tu prompt:** [Recorrido del registro: selección, casos y aceptación](Noche-PilotoDeAvisos.Registro/RecorridoCasosYAceptacion.md)
- **Daily del equipo:** [Daily-Noche-2026-09-19.md](../Daily-Noche-2026-09-19.md)
- **6 hitos · 18 subtareas · 54 microtareas**

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

**0 / 54 microtareas en `HECHO`.** Se calcula, no se estima. Las `A MEDIAS` cuentan como **no hechas**.

| Hito | Prioridad | Microtareas | HECHO | Estado |
|---|---|---:|---:|---|
| **H1** — Seleccionar el recorrido prioritario del registro y sus relaciones | `BLOQUEANTE` | 13 | 0 | `TODO` |
| **H2** — Diseñar los casos de aceptación del recorrido y sus datos | `ALTA` | 8 | 0 | `TODO` |
| **H3** — Probar permisos, estados y dinero del recorrido | `ALTA` | 8 | 0 | `TODO` |
| **H4** — Ejercitar el recorrido que cruza varios módulos | `MEDIA` | 8 | 0 | `TODO` |
| **H5** — Ejecutar la aceptación del registro con los participantes reales disponibles | `ALTA` | 8 | 0 | `TODO` |
| **H6** — Emitir el dictamen de aceptación con sus límites externos | `ALTA` | 9 | 0 | `TODO` |
| **TOTAL** | | **54** | **0** | |

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
| **H1** | Justin | Las relaciones: de ahí sale qué adaptador arranca primero | `NO` |
| **H1** | Itzan | Si el recorrido exige una escritura atómica que cruza capacidades | `NO` |
| **H1** | Ender | Qué garantía funcional le exige el recorrido al aviso | `NO` |
| **H1** | Pablo | El estado del registro funcional original y la demanda contra capacidad | `NO` |
| **H2** | Justin | Los casos negativos de autorización: van a su matriz | `NO` |
| **H2** | Ender | Qué reglas del recorrido el contrato todavía no expresa | `NO` |
| **H2** | Pablo | Qué datos necesita el laboratorio para estos casos | `NO` |
| **H3** | Justin | Los negativos de autorización que hay que llevar a la relación | `NO` |
| **H3** | Ender | Qué transición o regla de dinero el contrato no expresa | `NO` |
| **H3** | Pablo | Los controles faltantes, para priorizarlos | `NO` |
| **H4** | Justin | Los pasos que fallaron por la relación | `NO` |
| **H4** | Ender | Qué decisión abierta bloquea qué paso | `NO` |
| **H4** | Pablo | La lista de proveedores externos pendientes: es decisión de alcance | `NO` |
| **H5** | Todo el equipo | La matriz de aceptación y los rojos | `NO` |
| **H5** | Pablo | Las decisiones de alcance que exigen coordinación | `NO` |
| **H5** | Justin | Qué pasos hay que reejecutar mañana | `NO` |
| **H6** | Todo el equipo | El dictamen | `NO` |
| **H6** | Pablo | Las decisiones de alcance que quedan para quien coordine | `NO` |
| **H6** | Quien encargó el paquete | Los pendientes que solo puede cerrar negocio | `NO` |

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
