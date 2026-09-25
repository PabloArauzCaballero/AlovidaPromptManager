# Marcelo — daily de la noche del 2026-09-25

> **AVANCE: 0 / 98 — 0 %.** Sale de `microtareas HECHO / total`. Se llena al cerrar.
> `A MEDIAS` cuenta como **no hecha**. Prohibido el porcentaje estimado a ojo (regla 50 §5).

- Carril: [`Noche-CargaMasiva.CalidadE2EVisualYGates`](Noche-CargaMasiva.CalidadE2EVisualYGates/E2EPlaywrightCapturasDobleRevisionGatesYSegundoPerfil.md)
- Contrato: [`CONTRATO-CARGA-MASIVA.md`](../CONTRATO-CARGA-MASIVA.md) §3, §4, §7; **Q-9 es tuya**
- Repo: `alovida/mantra-core-health` (Playwright) · API sólo lectura · Ref: `origin/mockup` · Corte: se fija en H1.S1.M1 · Rama: `marcelo/carga-masiva-calidad-2026-09-25`
- Peldaño alcanzado (regla 30): `DISCOVERED` al repartir · se actualiza al cerrar
- Daily de equipo: [`Daily-Noche-2026-09-25.md`](../Daily-Noche-2026-09-25.md)
- Plan y reporte: `docs/trabajo/2026-09-25-marcelo-calidad/PLAN.md` y `REPORTE.md` en el front

## 0. Q-9 — ¿existe todo lo que «designaciones» necesita? (antes de la hora 1)

> Itzan (H2.S5.M4) y Justin (H4.S1.M3) leen esta sección. Si a la hora 1 está vacía, ellos deciden solos.

| Pieza | Ruta:línea | Existe | Qué exige / qué falta |
|---|---|---|---|
| DTO `create-designation.dto.ts` | | | |
| Entidad `concept_designations.entity.ts` | | | |
| Endpoint `POST :conceptId/designations` | | | |
| Repositorio con alta / `findByCode` | | | |
| Índice único | | | |

**Decisión Q-9 (hora HH:MM):** <SÍ: columnas `code, language, use, value`, clave estable … / NO: falta …>

## 0-bis. Fixtures de la API (H7.S2) — publicá en la hora 2

| Qué | SHA + hora | Para quién |
|---|---|---|
| `test/fixtures/terminology-import/**` (14 CSV + XLSX + README) | | Itzan (specs CSV), Justin (doble), vos (E2E) |
| `decision-dependencia.md` + `yarn.lock` | | Itzan (plantilla XLSX), Pablo |
| `xlsx-parser.ts` + spec, PR API | | Pablo (cablea en `index.ts`) |

## 1. Instalación del estándar — pegá la salida acá

```text
$ ls .claude/skills | wc -l
<pendiente>

$ ls .claude/rules/[0-9]*.md | wc -l
<pendiente>

$ python .claude/hooks/plan_gate.py --self-test
<pendiente>
```

- [ ] Leí `skills-router` y las 25 skills del lote, empezando por `critical-double-review`.
- [ ] Creé el `PLAN.md` antes del primer `Edit`/`Write` de código.

## 2. Avance por hito (se llena al cerrar)

| Hito | Micro | HECHO | A MEDIAS | BLOQUEADO | DESCARTADO | Nota |
|---|---|---|---|---|---|---|
| H1 Corte, baseline, Q-9, fixtures | 15 | | | | | |
| H2 Specs: baseline de hoy y contrato | 19 | | | | | |
| H3 Corrida contra la rama de Justin | 6 | | | | | |
| H4 Capturas y doble revisión | 10 | | | | | |
| H5 Gate de seguridad y PHI | 12 | | | | | |
| H6 API real, regresión, PR, cierre | 14 | | | | | |
| H7 Dependencia XLSX, fixtures de la API, parseador XLSX | 22 | | | | | |

## 3. Peldaño del E2E por corrida

| Corrida | Contra qué | Resultado | Evidencia |
|---|---|---|---|
| Baseline (pantalla de hoy) | simulador, respuesta fija | | |
| Contrato | rama de Justin, doble en tres niveles (`[backend simulado]`) | | |
| Real | rama de Justin + API de Itzan (`[API real]`) | | |

## 4. Defectos reportados (nunca arreglados por vos)

| A quién | Qué | Severidad | Captura / pasos | Estado |
|---|---|---|---|---|

## 5. Procesos que quedaron corriendo

<lista o «ninguno»>
