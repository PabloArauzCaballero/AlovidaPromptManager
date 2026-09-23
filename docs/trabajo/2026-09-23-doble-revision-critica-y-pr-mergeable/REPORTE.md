# Reporte — Doble revisión crítica de capturas y PR siempre mergeable

> **AVANCE: 11 / 11 — 100 %.**

- Fecha: 2026-09-23 · Plan: [PLAN.md](./PLAN.md) · Rama: `main` (sin commit; cambios en el working tree)
- Peldaño de evidencia alcanzado: `WRITTEN` para el contenido de las reglas y skills, con el espejo
  `.agents/` verificado sin deriva (`--check` exit 0) y las dos skills nuevas **reconocidas por el
  harness de Claude Code** (aparecieron en la lista de skills disponibles de la sesión al
  guardarse). No hay eval de comportamiento: no se demostró todavía que un agente las cumpla.

## Completado
| ID | Qué se logró | Comando | Resultado |
|---|---|---|---|
| H1.S1.M1 | Skill `critical-double-review`: dos pasadas (verificación + adversarial con 10 preguntas), severidades, nota por pantalla, re-captura | `grep -c "^name: critical-double-review" …` | PASS → 1 · [evidencia/dod.txt](./evidencia/dod.txt) |
| H1.S1.M2 | Regla `35-doble-revision-critica-y-pr-mergeable.md` | `grep -c "Primera pasada\|mergeStateStatus" .claude/rules/35-*.md` | PASS → 4 |
| H1.S1.M3 | Regla 00 §9 "Entrega — EXTREMADAMENTE OBLIGATORIO" | `grep -n "regla 35" .claude/rules/00-no-negociables.md` | PASS → línea 99 |
| H1.S1.M4 | `visual-proof` declara su §5 como primera pasada y exige la segunda | `grep -n "critical-double-review" …visual-proof/SKILL.md` | PASS → líneas 96, 146 |
| H2.S1.M1 | Skill `pr-mergeable-gate` con comandos verificados en `gh` 2.97.0 | `grep -c "^name: pr-mergeable-gate" …` + `gh pr update-branch --help` + `gh pr ready --help` | PASS |
| H2.S1.M2 | `github-pull-requests` §6.6 remite al gate | `grep -n "pr-mergeable-gate" …` | PASS → línea 99 |
| H3.S1.M1 | Router: 2 filas obligatorias en §1, fila PR, gates de 5 a 7 | `grep -n …skills-router/SKILL.md` | PASS → 5 coincidencias |
| H3.S1.M2 | Índice de reglas con la 35 | `grep -n "35-doble" .claude/rules/README.md` | PASS → línea 31 |
| H3.S1.M3 | `AGENTS.md` §1.6 y conteos (178 skills, 15 reglas) | `grep -n "### 1.6" AGENTS.md` | PASS → línea 81 |
| H3.S1.M4 | `README.md` con 178 skills (coincide con `ls -d .claude/skills/*/ \| wc -l` = 178) | `grep -n "178" README.md` | PASS |
| H3.S2.M1 | Espejo `.agents/` regenerado sin deriva | `python tools/sync_agents.py --check` | PASS → exit=0, 196 archivos · self-test 14 PASS |

## A medias
ninguna

## Pendiente
ninguna dentro del alcance. Fuera de alcance, ofrecido como siguiente paso: candado automático (ver Riesgos).

## Evidencia
Salidas literales en [evidencia/dod.txt](./evidencia/dod.txt). Extracto:

```text
$ python tools/sync_agents.py
sync: 8 archivo(s) copiado(s), 0 huerfano(s) borrado(s)
$ python tools/sync_agents.py --check  (sin pipe)
sync --check: OK, 196 archivo(s) en espejo, sin deriva
exit=0
$ python tools/sync_agents.py --self-test
sync_agents self-test: 14 PASS, 0 FAIL
```

## No cubierto
- **Comportamiento de un agente real**: no se corrió ninguna eval (`prompt-evals`) que demuestre
  que un agente con estas reglas efectivamente hace las dos pasadas o consulta `gh` antes de cerrar.
- **Los comandos `gh pr view --json …` y `gh pr checks`** se verificaron contra `--help` de
  `gh` 2.97.0, no ejecutados contra un PR real en esta sesión.
- Los valores de `mergeStateStatus` (`CLEAN`, `BEHIND`, `DIRTY`, `UNSTABLE`, `BLOCKED`, `DRAFT`,
  `HAS_HOOKS`, `UNKNOWN`) vienen del enum `MergeStateStatus` de la API GraphQL de GitHub; no se
  observaron en una respuesta real en esta sesión.

## Desvíos del plan
- El `PLAN.md` se escribió primero con los estados en `HECHO` por error; se corrigieron a `TODO`
  antes de tocar cualquier otro archivo y se fueron marcando tras correr cada DoD.
- H1.S1.M3 preveía "§9 y §10" en la regla 00; quedó un solo §9 con los dos ítems.
- Se agregaron dos cambios menores dentro de archivos en alcance: fila de "Verificado visualmente"
  de `visual-proof` §2 y título de `github-pull-requests` §6 ("— y antes de entregar").

## Riesgos residuales
| Riesgo | Impacto | Mitigación propuesta |
|---|---|---|
| Sin candado automático: las reglas 20/40/65 tienen hook, la 35 no | Un agente puede saltearla sin que nada lo frene | Hook `Stop` que bloquee si hay PNG en `evidencia/` sin `doble-revision.md`, o si el `REPORTE.md` menciona un PR sin línea `MERGEABLE`. No se implementó: no fue pedido y un hook `Stop` defectuoso traba todas las sesiones |
| No hay `CHANGELOG.md` en el repo, que `prompt-governance-versioning` pide | El cambio de comportamiento queda solo en git | Crear el changelog en un trabajo aparte |

## Decisiones y ambigüedades
- **"Revisar la captura tomada dos veces"** → se tomó como **dos pasadas de inspección** sobre las
  mismas capturas (la segunda adversarial), no como tomar la captura dos veces. Confirmar con Pablo.
- **"Mergeable"** → `mergeable=MERGEABLE`, `mergeStateStatus` `CLEAN`/`HAS_HOOKS`, fuera de draft,
  checks sin fallos ni pendientes. `BLOCKED` se acepta **solo** si lo único que falta es la
  aprobación humana (el agente no se puede aprobar a sí mismo), declarado en el reporte. Confirmar
  con Pablo si se quiere exigir además `reviewDecision=APPROVED`.
- Número de regla **35**: entre la escalera de evidencia (30) y el reporte (40), porque es el último
  filtro antes de entregar.
- Cambios ajenos en el working tree, **no tocados**: tres dailies de `repartos/2026-09-22/`, el
  `PLAN.md` de Marcelo en `repartos/…/entregables/` y las carpetas sin trackear `.playwright-mcp/` y
  `evidencia/` en la raíz.
