# Itzan — daily de la noche del 2026-09-25

> **AVANCE: 0 / 109 — 0 %.** Sale de `microtareas HECHO / total`. Se llena al cerrar.
> `A MEDIAS` cuenta como **no hecha**. Prohibido el porcentaje estimado a ojo (regla 50 §5).

- Carril: [`Noche-CargaMasiva.MotorDryRunIdempotencia`](Noche-CargaMasiva.MotorDryRunIdempotencia/ServicioEnsanchadoDryRunTodoONadaIdempotenciaAutorizacionYPlantilla.md)
- Contrato: [`CONTRATO-CARGA-MASIVA.md`](../CONTRATO-CARGA-MASIVA.md) §1 (copiás los tipos), §2 (lo implementás)
- Repo: `alovida/mantra-core-health-api` · Ref: `origin/dev` · Corte: se fija en H1.S1.M1 · Rama: `itzan/carga-masiva-motor-2026-09-25`
- Peldaño alcanzado (regla 30): `DISCOVERED` al repartir · se actualiza al cerrar
- Daily de equipo: [`Daily-Noche-2026-09-25.md`](../Daily-Noche-2026-09-25.md)
- Plan y reporte: `docs/trabajo/2026-09-25-itzan-motor/PLAN.md` y `REPORTE.md` en el repo de producto

## 0. Lo que otros leen de tu daily

| Qué avisás | Para quién | Cuándo |
|---|---|---|
| `row-contract.ts` pusheado (SHA + hora) | Marcelo (parseador XLSX), Pablo | **hora 1** |
| `index.ts` con `[ndjson, csv]`, detector y perfiles | Pablo (cablea XLSX) | al cerrar H2 |
| Qué devuelve `skipped` hoy y si hoy inserta las válidas con errores parciales (H1.S2.M6/M7) | Pablo (Q-2, Q-7) | al cerrar H1 |
| HTTP del dry-run: 200 o 201 (H3.S3.M3) | Justin (su cliente acepta ambos, pero lo necesita saber) | al cerrar H3.S3 |
| Rama pusheada y arrancable | Justin (H6.S1), Marcelo (H5.S2, H6.S1), Pablo | apenas H3 esté verde |

## 1. Instalación del estándar — pegá la salida acá

```text
$ ls .claude/skills | wc -l
<pendiente>

$ ls .claude/rules/[0-9]*.md | wc -l
<pendiente>

$ python .claude/hooks/plan_gate.py --self-test
<pendiente>
```

- [ ] Leí `skills-router` y las 26 skills del lote, empezando por `seed-data-catalogs`.
- [ ] Creé el `PLAN.md` antes del primer `Edit`/`Write` de código.

## 2. Avance por hito (se llena al cerrar)

| Hito | Micro | HECHO | A MEDIAS | BLOQUEADO | DESCARTADO | Nota |
|---|---|---|---|---|---|---|
| H1 Corte, baseline, API viva, import de hoy | 14 | | | | | |
| H2 Contrato, detector, CSV, perfiles, provider | 33 | | | | | |
| H3 Servicio ensanchado | 23 | | | | | |
| H4 Idempotencia y autorización | 15 | | | | | |
| H5 Plantilla | 8 | | | | | |
| H6 OpenAPI y códigos | 4 | | | | | |
| H7 Regresión, PR, cierre | 12 | | | | | |

## 3. Qué se cerró contra el doble (regla 65)

<no aplica: los parseadores NDJSON y CSV son reales. XLSX queda «pendiente de integrar» (rama de Marcelo)>

## 4. Procesos que quedaron corriendo

<lista o «ninguno»>
