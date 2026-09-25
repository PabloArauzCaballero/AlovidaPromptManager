# Plan — Publicar el plan y el reparto de «Farmacia como ecommerce»

- Fecha: 2026-09-25 · Repo afectado: `PabloArauzCaballero/AlovidaPromptManager` · Predecesor: PR #658 y #659 de `mantra-core-health` (el hub con pestañas, descartado por el propietario)
- Resultado observable: `main` del repositorio contiene el reparto `repartos/2026-09-25/PromptNoche/` con un daily de equipo, cuatro dailies personales y cuatro prompts de carril (Pablo, Justin, Marcelo, Itzan; sin Ender), más el requisito verbatim, la verificación contra el código, el plan maestro y el plan completo en `planes/04-farmacia-ecommerce-2026-09-25/`; y los dos candados del CI (`check_reparto.py`, `check_skills_citadas.py`) pasan sobre él.
- Kill-test: `python tools/check_reparto.py repartos/2026-09-25` distinto de `OK`; o `python tools/check_skills_citadas.py` distinto de 0; o existe `repartos/2026-09-25/PromptNoche/Ender/`; o `git log origin/main -1` no contiene el commit.

## Alcance

- IN: el reparto (estructura obligatoria), los cuatro prompts con las tres capas H/S/M y CA/DoD/Estado, los cuatro dailies, el daily de equipo, `docs/requisitos/`, `docs/verificacion/`, `docs/trabajo/…/PLAN-MAESTRO.md`, `planes/04-…/README.md`, la entrada en `ActionLog.md`, la publicación en `main`.
- OUT: código de producto en `mantra-core-health` o en la API; editar skills, reglas o candados del repositorio; tocar repartos anteriores.
- Ambigüedades registradas: «todos los programadores menos Ender» = las cuatro personas restantes de `PERSONAS` del validador (Pablo, Itzan, Marcelo, Justin). «Pushear a main» = `main` está protegido por el check del CI; si el push directo es rechazado, se abre PR y se declara.

## H1 — El reparto existe, cumple la estructura y está en `main`

**CA:** Dado el repositorio, cuando alguien corre los dos candados sobre `repartos/2026-09-25`, entonces pasan; y cuando abre `main`, el reparto y los documentos están.

**DoD:** salida de `check_reparto.py` = OK; salida de `check_skills_citadas.py` exit 0; `sync_agents.py --check` exit 0; commit visible en `origin/main` (o PR mergeable con checks en verde, declarado).

**Estado:** EN CURSO

### H1.S1 — Escribir el reparto y los documentos

**CA:** cuatro prompts con sección 1, kill-test, OUT, ambigüedades, DoD del hito y tres capas; dailies; requisito; verificación; plan maestro; plan. **DoD:** archivos en disco, conteos reales de hitos/subtareas/microtareas en las cabeceras. **Estado:** HECHO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H1.S1.M1 | Cuatro prompts de carril (Pablo 41+46, Justin 43+45, Marcelo 42+47, Itzan 44+48) | Existen con las piezas obligatorias | `grep -c "^### H" <prompt>` y `grep -c "^#### H" <prompt>` coinciden con la cabecera | HECHO |
| H1.S1.M2 | Daily de equipo y cuatro dailies personales | Existen con los nombres que exige el validador | `ls repartos/2026-09-25/PromptNoche/` | HECHO |
| H1.S1.M3 | Requisito verbatim, verificación contra el código, plan maestro, plan en `planes/` | Existen y se enlazan entre sí | `ls docs/requisitos docs/verificacion planes/04-*` | HECHO |
| H1.S1.M4 | Entrada en `ActionLog.md` | Está arriba, más reciente primero | `sed -n '10,14p' ActionLog.md` | HECHO |

### H1.S2 — Validar y publicar

**CA:** los dos candados y el espejo pasan; el commit está en `origin/main`. **DoD:** salidas pegadas en `REPORTE.md`. **Estado:** EN CURSO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H1.S2.M1 | `check_reparto.py` sobre la fecha nueva y sobre todas | OK | `python3 tools/check_reparto.py repartos/2026-09-25 && python3 tools/check_reparto.py repartos/*/` | TODO |
| H1.S2.M2 | `check_skills_citadas.py` y `sync_agents.py --check` | exit 0 | `python3 tools/check_skills_citadas.py; python3 tools/sync_agents.py --check` | TODO |
| H1.S2.M3 | Commit en rama `justin/reparto-farmacia-ecommerce-2026-09-25` y push a `main` | `git log origin/main -1` muestra el commit | `git push origin HEAD:main` | TODO |
| H1.S2.M4 | Si `main` rechaza el push: PR a `main`, mergeable, declarado | `gh pr view` | `gh pr create --base main` | TODO |

## Riesgos y bloqueos previstos

| Riesgo | Impacto | Mitigación |
|---|---|---|
| El validador rechaza un prompt por una pieza faltante | El CI no deja entrar el reparto | Correrlo local antes del push; corregir el prompt, no el validador |
| Una skill citada no existe | `check_skills_citadas.py` en rojo | Nombres copiados de `ls .claude/skills` |
| `main` protegido rechaza el push directo | No queda en `main` | Abrir PR y decirlo; no forzar |
| Contar mal hitos/subtareas/microtareas | Cabeceras que mienten | Contadas con `grep`, no a ojo |
