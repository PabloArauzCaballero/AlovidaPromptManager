# Entregables del carril B — la relación `agenda → mensajería`

> **Todo lo de acá es una copia**, para que se lea sin clonar el repo de la API. La fuente vive
> en `mantra-core-health-api`, bajo `docs/trabajo/`, y es lo que se revisa en los PR. Si un dato
> no coincide, **manda la fuente**.

- **Persona:** Justin · **Línea:** B · **Turno origen:** noche del 2026-09-19 · **Cierre:** 2026-09-20
- **Estado:** **53 / 53 microtareas** en `HECHO`.
- **Fuente:** `mantra-core-health-api@8d699ed0`
  · [PR #445](https://github.com/mdavila-2001/mantra-core-health-api/pull/445) (mergeado)
  · [PR #446](https://github.com/mdavila-2001/mantra-core-health-api/pull/446) (abierto)

## Qué leer, y en qué orden

| Archivo | Qué es | Leelo si… |
|---|---|---|
| [PREGUNTAS-AL-EQUIPO.md](./PREGUNTAS-AL-EQUIPO.md) | **Las 17 preguntas del carril, con lo que ya verifiqué y el costo de cada opción.** Contestá en línea, debajo de cada una | …sos Pablo, Ender, Itzan, Marcelo o negocio. **Es lo único que te pide algo** |
| [gates-no-aprobados.md](./gates-no-aprobados.md) | Tabla **generada** de los checks obligatorios que no aprobaron, por nivel | …querés el veredicto en 30 segundos |
| [REPORTE-cierre-2026-09-20.md](./REPORTE-cierre-2026-09-20.md) | Cómo se cerraron las 13 que quedaban, y los hallazgos HALL-08 a HALL-13 | …querés saber en qué terminó todo |
| [REPORTE-noche-2026-09-19.md](./REPORTE-noche-2026-09-19.md) | El turno de la noche: la relación medida contra Postgres, HALL-01 a HALL-07 | …te toca alguno de esos hallazgos |
| [registro-de-checks-consolidado.json](./registro-de-checks-consolidado.json) | Los **37 checks** de los tres niveles, 13 campos cada uno | …vas a auditar o a sumar los tuyos |
| [PLAN-noche-2026-09-19.md](./PLAN-noche-2026-09-19.md) · [PLAN-cierre-2026-09-20.md](./PLAN-cierre-2026-09-20.md) | Los dos planes, con CA y DoD por microtarea | …querés ver qué se prometió antes de ejecutar |
| `H1-*.md` · `H2-H5-*.md` | Fichas de hito: el doble estricto, la ficha de la relación, la ejecución | …vas a construir contra esta relación |
| [registro-de-checks-noche.json](./registro-de-checks-noche.json) | El registro del turno, antes del consolidado | …necesitás el estado intermedio |

## El veredicto, sin abrir nada

| Nivel | Obligatorios aplicables | Aprobados | Veredicto |
|---|---:|---:|---|
| **A** — el artefacto empaquetado (Itzan) | 6 | 2 | **NO APROBADO** — `A1`/`A2` en FAIL, `A3`/`A4-A6` bloqueados en cascada |
| **B** — la relación `agenda → mensajería` (mío) | 23 | 22 | **NO APROBADO** — **por un solo check: HALL-03** |
| **C** — la regresión del sistema | 5 | 5 | **APROBADO** |

**HALL-03**: dos `emit()` en paralelo con la misma `debounceKey` crean **dos filas**, las dos
reportadas como exitosas. Medido 6 veces, 5 dan dos. `debounce_key` no tiene índice único y
`createRequest` es un read-then-write. Es de **Itzan + modelo**, y es lo único que separa al nivel
B de aprobar entero.

## Lo que NO está acá

- **La evidencia ejecutada** (32 archivos entre los dos turnos: salidas literales, `recorrido.json`
  del P8, las tres capturas del E2E). Pesa y se lee mejor en su sitio: está en los PR #445 y #446,
  bajo `docs/trabajo/<fecha>/evidencia/`.
- **El código**: los dobles, las cuatro suites de integración y el arreglo de
  `tools/alovida/p8-avisos-agenda.mjs` viven en la API, no acá.

> Los enlaces relativos dentro de los reportes copiados (`./PLAN.md`, `./evidencia/…`) apuntan a la
> estructura del repo de la API y **no resuelven desde acá**. Es el precio de la copia; por eso la
> tabla de arriba nombra los archivos con el nombre que tienen en esta carpeta.
