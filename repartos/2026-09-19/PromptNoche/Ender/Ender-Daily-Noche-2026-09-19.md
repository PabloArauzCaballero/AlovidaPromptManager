# Daily de Ender — turno noche — 2026-09-19

> **Estado:** `IN_PROGRESS`. Se creó **al repartir**, antes del turno.
> Todo está en `NOT_RUN` porque **todavía no ejecutaste nada**. Completalo al cerrar.

- **Persona:** Ender · **Turno:** noche · **Fecha:** 2026-09-19 · **Línea:** A · **Rol:** propietario de contrato
- **Tu prompt:** [El contrato del piloto: fijarlo, validarlo y gobernar su evolución](Noche-PilotoDeAvisos.Contrato/ContratoValidadorYCompatibilidad.md)
- **Daily del equipo:** [Daily-Noche-2026-09-19.md](../Daily-Noche-2026-09-19.md)
- **6 hitos · 18 subtareas · 50 microtareas**

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

**0 / 50 microtareas en `HECHO`.** Se calcula, no se estima. Las `A MEDIAS` cuentan como **no hechas**.

| Hito | Prioridad | Microtareas | HECHO | Estado |
|---|---|---:|---:|---|
| **H1** — Fijar el contrato real del puerto de avisos de agenda | `BLOQUEANTE` | 14 | 0 | `TODO` |
| **H2** — Convertir el contrato en un validador que rechaza lo que debe rechazar | `ALTA` | 8 | 0 | `TODO` |
| **H3** — Gobernar la evolución del contrato sin romper a quien lo consume | `MEDIA` | 7 | 0 | `TODO` |
| **H4** — Congelar la versión estable del contrato y su matriz de consumidores | `MEDIA` | 7 | 0 | `TODO` |
| **H5** — Probar que una versión incompatible rompe donde debe y que lo histórico no se toca | `ALTA` | 7 | 0 | `TODO` |
| **H6** — Cerrar el contrato y dejar sus pendientes con dueño | `ALTA` | 7 | 0 | `TODO` |
| **TOTAL** | | **50** | **0** | |

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
| **H1** | Itzan | Artefacto del contrato con hash y la ficha de Autorización | `NO` |
| **H1** | Justin | Semántica del resultado, la regla «exactamente uno» y la clasificación de errores | `NO` |
| **H1** | Pablo | Que la tensión de durabilidad sigue `DECISION_REQUIRED` | `NO` |
| **H2** | Justin | El validador: su doble tiene que pasarlo | `NO` |
| **H2** | Pablo | Qué comprueba el validador dentro del harness | `NO` |
| **H2** | Itzan | Si el contrato cambió de hash desde ayer | `NO` |
| **H3** | Justin | La matriz: es la que dice contra qué versiones probar | `NO` |
| **H3** | Pablo | Qué contrato necesita la segunda capacidad | `NO` |
| **H3** | Itzan | Si el artefacto empaquetado referencia una versión que va a cambiar | `NO` |
| **H4** | Todo el equipo | La versión estable a consumir | `NO` |
| **H4** | Marcelo | Qué decisiones de negocio siguen abiertas y bloquean la aceptación | `NO` |
| **H4** | Justin | Contra qué versiones probar | `NO` |
| **H5** | Marcelo | Qué decisión abierta impide firmar la aceptación | `NO` |
| **H5** | Justin | Contra qué versión corre el candidato compuesto | `NO` |
| **H5** | Itzan | Si hay que reempaquetar por un cambio de contrato | `NO` |
| **H6** | Marcelo | Los pendientes que condicionan el dictamen | `NO` |
| **H6** | Todo el equipo | La versión final del contrato | `NO` |

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
