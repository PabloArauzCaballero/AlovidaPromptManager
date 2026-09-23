# Plan — Doble revisión crítica de capturas y PR siempre mergeable

- Fecha: 2026-09-23 · Repos afectados: `AlovidaPromptManager` · Predecesor: ninguno
- Resultado observable: cualquier agente que trabaje con este estándar encuentra, en las reglas
  no negociables y en el router de skills, dos obligaciones nuevas: (1) revisar **dos veces** las
  capturas de Playwright y evaluar de forma ultra crítica la calidad entregada; (2) no entregar
  ningún PR sin haber demostrado que es mergeable.
- Kill-test: `grep -n "35-" .claude/rules/00-no-negociables.md` no devuelve nada, o
  `python tools/sync_agents.py --check` sale con código 1.

## Alcance
- IN: regla nueva `35`, skills nuevas `critical-double-review` y `pr-mergeable-gate`, referencias
  en `00-no-negociables.md`, `rules/README.md`, `skills-router`, `visual-proof`,
  `github-pull-requests`, `AGENTS.md`, `README.md` (conteos), espejo `.agents/` regenerado.
- OUT: hooks nuevos (candado automático), `CHANGELOG.md` (no existe en el repo; crearlo no fue
  pedido), los prompts de `repartos/` (tienen cambios ajenos sin commitear), commit/PR.
- Ambigüedades registradas:
  - "revise la captura tomada dos veces": supuesto → dos **pasadas de inspección** independientes
    sobre las mismas capturas (la segunda con postura adversarial), más re-captura tras cada
    corrección. No se interpreta como "tomar la captura dos veces". Confirmar con Pablo.
  - "que sea mergeable": supuesto → `mergeable = MERGEABLE`, `mergeStateStatus = CLEAN` (o
    `HAS_HOOKS`), checks requeridos en verde, no draft, sin conflictos. Confirmar con Pablo si se
    exige además la aprobación de review (`reviewDecision = APPROVED`) — se deja como estado
    declarado, no como requisito del agente, porque el agente no puede aprobarse a sí mismo.

## H1 — Doble revisión ultra crítica de capturas
**CA:** Dado un agente que tocó UI, cuando lee las reglas y el router, entonces encuentra como
no negociable hacer dos pasadas de inspección de las capturas Playwright con veredicto crítico.
**DoD:** `grep` de las referencias en regla 00, regla 35, router y visual-proof.
**Estado:** HECHO

### H1.S1 — Skill y regla
**CA:** Existe la skill con procedimiento de dos pasadas y la regla que la vuelve obligatoria.
**DoD:** frontmatter válido + grep. **Estado:** HECHO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H1.S1.M1 | Crear skill `critical-double-review` | Archivo con `name: critical-double-review` | `grep -c "^name: critical-double-review" .claude/skills/critical-double-review/SKILL.md` → 1 | HECHO |
| H1.S1.M2 | Crear regla `35-doble-revision-critica-y-pr-mergeable.md` | La regla existe con ambas obligaciones | `grep -c "Primera pasada\|mergeStateStatus" .claude/rules/35-*.md` → ≥2 | HECHO |
| H1.S1.M3 | Agregar §9 y §10 a `00-no-negociables.md` | La regla 00 remite a la 35 | `grep -n "regla 35" .claude/rules/00-no-negociables.md` → ≥1 | HECHO |
| H1.S1.M4 | Enlazar desde `visual-proof` | visual-proof exige la doble pasada | `grep -n "critical-double-review" .claude/skills/visual-proof/SKILL.md` → ≥1 | HECHO |

## H2 — PR siempre mergeable
**CA:** Dado un agente que deja un PR, cuando cierra el turno, entonces sabe que debe demostrar con
salida de `gh` que el PR es mergeable o declararlo `A MEDIAS`.
**DoD:** grep de las referencias. **Estado:** HECHO

### H2.S1 — Skill y enlace
**CA:** Existe la skill con comandos verificados contra `gh` 2.97.0. **DoD:** grep. **Estado:** HECHO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H2.S1.M1 | Crear skill `pr-mergeable-gate` | Archivo con `name: pr-mergeable-gate` | `grep -c "^name: pr-mergeable-gate" .claude/skills/pr-mergeable-gate/SKILL.md` → 1 | HECHO |
| H2.S1.M2 | Enlazar desde `github-pull-requests` | La skill de PR remite al gate | `grep -n "pr-mergeable-gate" .claude/skills/github-pull-requests/SKILL.md` → ≥1 | HECHO |

## H3 — Cableado y espejo
**CA:** Dado cualquier agente o herramienta, cuando entra por el router, README o AGENTS.md,
entonces encuentra las dos obligaciones. **DoD:** grep + `sync_agents.py --check` exit 0.
**Estado:** HECHO

### H3.S1 — Índices
**CA:** Router, README de reglas, AGENTS.md y README reflejan lo nuevo. **DoD:** grep. **Estado:** HECHO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H3.S1.M1 | Router §1: dos filas nuevas y orden de cierre | El router lista ambas skills | `grep -n "critical-double-review\|pr-mergeable-gate" .claude/skills/skills-router/SKILL.md` → ≥2 | HECHO |
| H3.S1.M2 | `rules/README.md`: fila de la regla 35 | El índice lista la 35 | `grep -n "35-doble" .claude/rules/README.md` → 1 | HECHO |
| H3.S1.M3 | `AGENTS.md`: §1.6 y conteos | AGENTS.md contiene §1.6 | `grep -n "1.6" AGENTS.md` → ≥1 | HECHO |
| H3.S1.M4 | `README.md`: conteo de skills | El conteo coincide con `ls .claude/skills \| wc -l` | `grep -n "178" README.md` → ≥1 | HECHO |

### H3.S2 — Espejo
**CA:** `.agents/` sin deriva. **DoD:** `--check` exit 0. **Estado:** HECHO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H3.S2.M1 | Regenerar `.agents/` | Sin deriva | `python tools/sync_agents.py --check; echo $?` → 0 | HECHO |

## Riesgos y bloqueos previstos
| Riesgo | Impacto | Mitigación |
|---|---|---|
| Sin candado automático, la obligación depende de disciplina | Un agente puede saltearla | Se ofrece un hook `Stop` como trabajo siguiente; no se implementa sin pedido |
| `gh` puede devolver `UNKNOWN` justo después de un push | Falso negativo | La skill exige re-consultar, no asumir |
