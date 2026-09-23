# Pablo — daily de la noche del 2026-09-22

> **AVANCE: 52 / 68 — 76,5 %.** Sale de `microtareas HECHO / total`.
> `A MEDIAS` cuenta como **no hecha**. Prohibido el porcentaje estimado a ojo (regla 50 §5).

- Carril: [`Noche-DisciplinaDeTablas.PatronYDondeAtiendo`](Noche-DisciplinaDeTablas.PatronYDondeAtiendo/TablaConAccionesModalConfirmacionYPaginacionEnCliente.md)
- Corte: `origin/mockup` @ `b655e844…` → **el tuyo:** `8ae7283a2944074d5aecd4f1c634def57ca23083` (reconsultado 2026-09-23; 6 PR más encima, ninguno toca mis archivos)
- Rama: `pablo/noche-disciplina-tablas-2026-09-22` (en `alovida/mch-pablo-tabla-canonica`) · Peldaño alcanzado (regla 30): `TESTED` + `VERIFIED` visual en lo cerrado (H1, H2.S1, H3.S1); `TODO` el resto
- Daily de equipo: [`Daily-Noche-2026-09-22.md`](../Daily-Noche-2026-09-22.md)
- Plan y reporte completos: `docs/trabajo/2026-09-22-pablo-disciplina-tablas/PLAN.md` y `REPORTE.md`, en el repo de producto (no en este repo de estándar)

## 0. Tu carril destraba a dos personas: publicá temprano

| Qué publicás | Para quién | Hito | Cuándo | Publicado (ruta + hora) |
|---|---|---|---|---|
| ADR-0015 «tabla con acciones» | Itzan, Marcelo, los cinco | H2.S1 | antes de la mitad del turno | `docs/adr/ADR-0015-tabla-con-acciones.md` — **PUBLICADO** |
| `app-pagination` con texto y select de página | Itzan | H3.S1 | primera mitad | `molecules/pagination/**` — **PUBLICADO**, spec 30/30 |
| `filter-bar` con proyección de la acción a la derecha | Itzan | H3.S3 | primera mitad | `organisms/filter-bar/**` — **PUBLICADO**, spec 13/13, verificado en «Dónde atiendo» |
| `data-table` con alto máximo, sin scroll lateral (opt-in) | Itzan | H3.S2 | | `organisms/data-table/**` — **PUBLICADO**, spec 31/31. Ojo: a 375 px con sólo columnas de prioridad 1 puede seguir sin entrar (se oculta, no hay scroll) — medido en mi propio consumidor, ver mi `REPORTE.md` |
| `work-history layout="tabla"` (historial) | Itzan | H4.S3 | segunda mitad | rama `pablo/noche-disciplina-tablas-2026-09-22` (repo de producto): input `layout="tabla"` con `secciones="ambas"` o `"historial"`; editar/retirar/adjunto contra doble local (recargar pierde los cambios), **A MEDIAS**: falta re-captura y doble revisión |
| Inventario de los 78 `iconOnly` con veredicto y dueño | los cinco | H5 | | no llegué — **TODO** |

## 1. Instalación del estándar — pegá la salida acá

```text
$ ls .claude/skills | wc -l
180   (176 del estándar + 4 propias del repo de producto, fusionadas sin pisar)

$ ls .claude/rules/[0-9]*.md | wc -l
14

$ python .claude/hooks/plan_gate.py --self-test
plan_gate self-test: 11 PASS, 0 FAIL
```

- [x] Leí `skills-router` y las skills de mi lote (`frontend-data-tables`, `technical-docs-and-adr`,
      `atomic-design-components`, `refactoring-safely`, `unit-testing`, `angular-testing` — las
      aplicadas de verdad en lo que cerré; el resto del lote (28) no se llegó a usar porque no llegué
      a esos hitos).
- [x] Creé mi `PLAN.md` antes del primer `Edit`/`Write` de código: `docs/trabajo/2026-09-22-pablo-disciplina-tablas/PLAN.md` en el repo de producto.

## 2. Baseline

| Comando | Exit code | Rojos previos | Clase (regla 80.4) |
|---|---|---|---|
| `yarn lint` | 0 | ninguno | — |
| `yarn typecheck` | 0 | ninguno | — |
| `yarn test --watch=false` | 1 | 3 archivos / 4 tests (`app.routes.spec.ts`, `shell-layout.spec.ts`, `insurance-analytics.spec.ts`) | `PRODUCT_BUG`/`TEST_BUG` (2, sin diagnosticar, ajenos) + `ENVIRONMENT` (1, timeout de 5000ms) — ninguno toca mis archivos reservados |

## 3. Lo que ejercitaste ANTES de tocar (H1.S2.M3)

| Pregunta | Respuesta observada | Captura |
|---|---|---|
| ¿«Retirar» desde `app-row-actions` confirma? | **Sí** — «Dejar de atender acá», Cancelar/Retirar | `03-retirar-confirma-1440.png` |
| ¿«Agregar mi consultorio propio» abre el formulario **debajo** de la lista? | **Confirmado el defecto**: «Editar» sobre el propio abre «Corregir tu consultorio» **inyectado dentro del `tabpanel`, debajo del `<ul>`**, no en modal (D-04 sin cumplir hoy) | `04-editar-formulario-en-linea-1440.png`, `04b-…-completo-1440.png` |
| ¿Cuántas de las 30 tablas tienen barra? ¿Cuántas paginación? | 4/30 con `app-filter-bar`, 0/30 con `app-pagination` externo (el organismo pagina por cursor interno) | `evidencia/antes/tablas.md` |

## 4. Las dos decisiones del ADR — escritas, no supuestas

| Decisión | Alternativa descartada | Motivo | Fecha que reemplaza |
|---|---|---|---|
| Paginación: cliente para listas locales, cursor donde la API manda (Q-5) | Un único paginador para todo | Un cursor no conoce el total (`data-table.types.ts:1-6`); forzar `app-pagination` sobre cursor rompería esa garantía | — |
| Scroll: sin lateral, plegado por prioridad (Q-6) | `sticky: 'end'` + `overflow-x` | El pedido nuevo gana; `sticky:'end'` queda sin efecto práctico una vez que no hay scroll lateral que esconda las acciones, pero el motivo del 18/09 no se borra | 2026-09-18 → 2026-09-22 |

## 5. Checkpoints del turno

```text
AVANCE — disciplina de tablas — <fase> — <ID de microtarea>
- Hecho:      <qué quedó, concreto>
- Evidencia:  <comando / ruta / "ninguna todavía">
- Ahora:      <la siguiente acción, una sola>
- Bloqueo:    ninguno | <qué bloquea y de quién depende>
- Estado:     TODO | EN CURSO | HECHO | A MEDIAS | BLOQUEADO | DESCARTADO
- Peldaño:    UNKNOWN | DISCOVERED | WRITTEN | RUNS | TESTED | VERIFIED | REGRESSION_VERIFIED
```

## 6. Lo que pediste y su estado

| Qué | A quién | Estado | Si no llegó: contrato simulado en tres niveles (regla 65) |
|---|---|---|---|
| `confirmarCambios()` / `confirmarDescarte()` | Marcelo | **Publicada por Marcelo en su rama `pablo/inicio-paciente-silueta-voz-y-confirmacion`, todavía no en `origin/mockup`** | Llegué a H4.S2 (donde se usa) y la rama de Marcelo seguía sin mergear: usé `dialogs.confirm()` genérico con los textos del ADR, **verificado en navegador** (aparece «¿Confirmás estos cambios?» y «¿Descartar los cambios?»), declarado en el `PLAN.md` (regla 65) |
| `PATCH`/`DELETE` del historial laboral si el manejador es de Itzan | Itzan | No llegué a H4.S3 | Pendiente — el doble se arma cuando abra esa microtarea |
| Resultado del apilamiento `confirm` sobre `content-dialog` | Marcelo | Marcelo ya lo probó (PASS, Chromium 151 y Firefox 153 — ver daily de equipo §4-bis) | Confirmado también por mi propia prueba en H4.S2: el diálogo de confirmación se ve y funciona bien apilado sobre `app-content-dialog`, foco en el botón correcto |

## 7. Al cerrar

- [x] `REPORTE.md` con el avance en la **primera línea** y sus tres secciones (una vacía se escribe «ninguna»): `docs/trabajo/2026-09-22-pablo-disciplina-tablas/REPORTE.md`, repo de producto.
- [x] Baseline repetido y comparado: ningún rojo **nuevo** (lint y typecheck en verde en cada pieza tocada; los 4 tests rojos de `test` completo son los mismos 3 archivos del baseline, ajenos — la regresión completa no pudo confirmarse por dos caídas de infraestructura, declarado `ENVIRONMENT` en el `REPORTE.md`).
- [x] **Ningún consumidor que no optó por el patrón cambió**: 3 de `pagination`, 3 de `data-table`, 2 de `filter-bar` comprobados con captura o `yarn typecheck` limpio.
- [x] Modales con foco atrapado y restaurado — el modal de «Dónde atiendo» reusa `app-content-dialog`, mismo mecanismo de foco ya probado en el modal del historial. **Teclado completo: no verificado** (H4.S2.M9, declarado `A MEDIAS` en el `REPORTE.md`).
- [x] Lo que sólo persiste el simulador, declarado **contra el doble**: no aplica todavía a lo que cerré — el consultorio propio sí tiene endpoint real (`PATCH /practitioners/me/sites`), verificado con un PATCH real contra el mock backend.
- [x] Capturas por viewport y tema, **miradas**, con su línea: `evidencia/antes/`, `evidencia/h3/capturas/`, `evidencia/h4/capturas/` (12 imágenes: modal, guardar por cambios, confirmación, D-06, descarte, 375/768/1440, claro/oscuro).
- [x] Sólo `medica@alovida.mock` en capturas y reporte.
- [x] Procesos corriendo, enumerados y cerrados: el `yarn start` de verificación se detuvo antes de cerrar (verificado con `netstat`, sin `LISTENING` en 4200).
