# Justin — daily de la noche del 2026-09-25

> **AVANCE: 0 / 68 — 0 %.** Sale de `microtareas HECHO / total`. Se llena al cerrar.
> `A MEDIAS` cuenta como **no hecha**. Prohibido el porcentaje estimado a ojo (regla 50 §5).

- Carril: [`Noche-CargaMasiva.PantallaDragAndDrop`](Noche-CargaMasiva.PantallaDragAndDrop/QueSeCargaArrastrarValidarSinGuardarVistaPreviaYResumen.md)
- Contrato: [`CONTRATO-CARGA-MASIVA.md`](../CONTRATO-CARGA-MASIVA.md) §2 (consumís), §3 (`data-testid`: los ponés vos)
- Repo: `alovida/mantra-core-health` · Ref: `origin/mockup` (worktree limpio; el checkout actual tiene cambios sin commitear de Ender) · Corte: se fija en H1.S1.M1 · Rama: `justin/carga-masiva-pantalla-2026-09-25`
- Peldaño alcanzado (regla 30): `DISCOVERED` al repartir · se actualiza al cerrar
- Daily de equipo: [`Daily-Noche-2026-09-25.md`](../Daily-Noche-2026-09-25.md)
- Plan y reporte: `docs/trabajo/2026-09-25-justin-pantalla/PLAN.md` y `REPORTE.md` en el repo de producto

## 0. Tu carril destraba a Marcelo: publicá temprano

| Qué publicás | Para quién | Hito | Cuándo | Publicado (SHA + hora) |
|---|---|---|---|---|
| Doble del simulador en tres niveles (`terminology.handlers.ts`) | Marcelo (corre su E2E contra tu rama) | H2 | **hora 1,5** | |
| Pantalla con los `data-testid` de §3 | Marcelo (H3, H4.S2) | H4 | segunda mitad | |

## 1. Instalación del estándar — pegá la salida acá

```text
$ ls .claude/skills | wc -l
<pendiente>

$ ls .claude/rules/[0-9]*.md | wc -l
<pendiente>

$ python .claude/hooks/plan_gate.py --self-test
<pendiente>
```

- [ ] Leí `skills-router` y las 26 skills del lote, empezando por `frontend-forms-ux`.
- [ ] Creé el `PLAN.md` antes del primer `Edit`/`Write` de código.

## 2. Avance por hito (se llena al cerrar)

| Hito | Micro | HECHO | A MEDIAS | BLOQUEADO | DESCARTADO | Nota |
|---|---|---|---|---|---|---|
| H1 Corte, baseline, pantalla de hoy | 10 | | | | | |
| H2 Doble del simulador | 7 | | | | | |
| H3 Cliente y tipos | 7 | | | | | |
| H4 Pantalla en tres pasos | 27 | | | | | |
| H5 Prueba visual y regresión | 6 | | | | | |
| H6 API real, PR, cierre | 11 | | | | | |

## 3. Qué se cerró contra el doble (regla 65)

<todo lo verificado con `mockBackend: true`; qué se recorrió contra la API real (H6.S1) o por qué no>

## 4. Defectos que Marcelo te reportó

<lista con estado: corregido + re-captura / pendiente>

## 5. Procesos que quedaron corriendo

<lista o «ninguno»>
