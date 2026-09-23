# Pablo — daily de la noche del 2026-09-22

> **AVANCE: 0 / 68 — 0 %.** ← actualizá esta línea al cerrar. Sale de `microtareas HECHO / total`.
> `A MEDIAS` cuenta como **no hecha**. Prohibido el porcentaje estimado a ojo (regla 50 §5).

- Carril: [`Noche-DisciplinaDeTablas.PatronYDondeAtiendo`](Noche-DisciplinaDeTablas.PatronYDondeAtiendo/TablaConAccionesModalConfirmacionYPaginacionEnCliente.md)
- Corte: `origin/mockup` @ `b655e844…` → **el tuyo:** `________________`
- Rama: `________________` · Peldaño alcanzado (regla 30): `________________`
- Daily de equipo: [`Daily-Noche-2026-09-22.md`](../Daily-Noche-2026-09-22.md)

## 0. Tu carril destraba a dos personas: publicá temprano

| Qué publicás | Para quién | Hito | Cuándo | Publicado (ruta + hora) |
|---|---|---|---|---|
| ADR-0015 «tabla con acciones» | Itzan, Marcelo, los cinco | H2.S1 | antes de la mitad del turno | |
| `app-pagination` con texto y select de página | Itzan | H3.S1 | primera mitad | |
| `filter-bar` con proyección de la acción a la derecha | Itzan | H3.S3 | primera mitad | |
| `data-table` con alto máximo, sin scroll lateral (opt-in) | Itzan | H3.S2 | | |
| `work-history layout="tabla"` (historial) | Itzan | H4.S3 | segunda mitad | |
| Inventario de los 78 `iconOnly` con veredicto y dueño | los cinco | H5 | | |

## 1. Instalación del estándar — pegá la salida acá

```text
$ ls .claude/skills | wc -l
<pegá la salida — tiene que dar 176>

$ ls .claude/rules/[0-9]*.md | wc -l
<pegá la salida — tiene que dar 14>

$ python .claude/hooks/plan_gate.py --self-test
<pegá la salida — tiene que dar 11 PASS, 0 FAIL>
```

- [ ] Leí `skills-router` y las 28 skills de mi lote, empezando por `frontend-data-tables`.
- [ ] Creé mi `PLAN.md` antes del primer `Edit`/`Write` de código.

## 2. Baseline

| Comando | Exit code | Rojos previos | Clase (regla 80.4) |
|---|---|---|---|
| `yarn lint` | | | |
| `yarn typecheck` | | | |
| `yarn test --watch=false` | | | |

## 3. Lo que ejercitaste ANTES de tocar (H1.S2.M3)

| Pregunta | Respuesta observada | Captura |
|---|---|---|
| ¿«Retirar» desde `app-row-actions` confirma? | | |
| ¿«Agregar mi consultorio propio» abre el formulario **debajo** de la lista? | | |
| ¿Cuántas de las 30 tablas tienen barra? ¿Cuántas paginación? | | |

## 4. Las dos decisiones del ADR — escritas, no supuestas

| Decisión | Alternativa descartada | Motivo | Fecha que reemplaza |
|---|---|---|---|
| Paginación: cliente para listas locales, cursor donde la API manda (Q-5) | | | — |
| Scroll: sin lateral, plegado por prioridad (Q-6) | `sticky: 'end'` + `overflow-x` | | 2026-09-18 → 2026-09-22 |

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
| `confirmarCambios()` / `confirmarDescarte()` | Marcelo | | `dialogs.confirm` con los textos del ADR, declarado |
| `PATCH`/`DELETE` del historial laboral si el manejador es de Itzan | Itzan | | doble en `evidencia/h4/doble-historial.md` |
| Resultado del apilamiento `confirm` sobre `content-dialog` | Marcelo | | lo probás en tu primer modal |

## 7. Al cerrar

- [ ] `REPORTE.md` con el avance en la **primera línea** y sus tres secciones (una vacía se escribe «ninguna»).
- [ ] Baseline repetido y comparado: ningún rojo **nuevo**.
- [ ] **Ningún consumidor que no optó por el patrón cambió**: 3 de `data-table`, 3 de `pagination`, 2 de
      `filter-bar`, con captura.
- [ ] Modales con foco atrapado y restaurado; teclado completo en «Dónde atiendo».
- [ ] Lo que sólo persiste el simulador, declarado **contra el doble**.
- [ ] Capturas por viewport y tema, **miradas**, con su línea.
- [ ] Sólo `medica@alovida.mock` en capturas y reporte.
- [ ] Procesos corriendo, enumerados y cerrados. Si no quedó nada, decilo.
