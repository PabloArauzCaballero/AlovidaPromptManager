> **AVANCE: 5 / 6 — 83,3 %.**

# Reporte — Publicar el informe de brechas front↔back y sus 30 prompts

- Fecha: 2026-09-24 · Plan: [PLAN.md](./PLAN.md) · Rama: `justin/planes-brechas-front-back-2026-09-24` · PR: [#43](https://github.com/PabloArauzCaballero/AlovidaPromptManager/pull/43)
- Peldaño de evidencia alcanzado:
  - **Publicación: `TESTED`.** Hay manifiestos de hashes, gates del repo y estado del PR pegados.
  - **Contenido del informe: `DISCOVERED`.** Sale de leer el código de los dos repos; nada se
    ejercitó contra la API viva.

## Completado

| ID | Qué se logró | Comando | Resultado |
|---|---|---|---|
| H1.S1.M1 | Se copiaron los 45 archivos del paquete a `planes/03-brechas-front-back-2026-09-24/` | `sha256sum` de origen (rama del front) y destino, y `diff` de manifiestos | PASS: 45/45, única diferencia `README.md`, que es la esperada por M2 · [evidencia/01](./evidencia/01-copia-y-ajuste.txt) |
| H1.S1.M2 | El §11 del README ya no apunta al repo del front, sino a `AlovidaPromptManager/planes/03-…/inventarios` | `grep -c "mantra-core-health/docs/brechas" README.md` | PASS: `0` · [evidencia/01](./evidencia/01-copia-y-ajuste.txt) |
| H1.S2.M1 | Entrada del 2026-09-24 arriba de todo en `ActionLog.md` | `head -12 ActionLog.md` | PASS · [evidencia/02](./evidencia/02-actionlog-y-gate.txt) |
| H1.S2.M2 | Ninguna skill citada inexistente, y el espejo `.agents/` sin deriva | `python tools/check_skills_citadas.py` · `python tools/sync_agents.py --check` | PASS: `0 inexistentes` · `sin deriva` · [evidencia/02](./evidencia/02-actionlog-y-gate.txt) |
| H1.S2.M3 | PR #43 abierto contra `main`, mergeable y con CI en verde | `gh pr view 43 --json …` · `gh pr checks 43` | PASS: `MERGEABLE` · `CLEAN` · check `pass` · [evidencia/04](./evidencia/04-pr-43-mergeable.txt) |

## A medias

Ninguna.

## Pendiente

| ID | Estado | Qué lo destraba |
|---|---|---|
| H1.S3.M1 | `BLOQUEADO` — `DECISION_REQUIRED` | El PR 628 del front **ya estaba mergeado** en `mockup` cuando se intentó cerrarlo (cuenta `Jsaldias39`, 21:26:03Z, commit `a96ad90c`), y un PR mergeado no se cierra. Retirar la carpeta del front es una acción sobre una rama compartida. **Decide Justin:** (a) dejar la copia del front como referencia, o (b) abrir un PR contra `mockup` que la retire. Ya quedó publicado en el 628 un comentario que apunta a este PR · [evidencia/03](./evidencia/03-cierre-pr-628.txt) |

## Evidencia

```text
$ diff <(origen normalizado) <(destino normalizado)
1c1
< 58f114b4…cba00 *README.md
---
> 8108fa38…33eea *README.md
exit=1  (única diferencia esperada: README.md, ajustado en H1.S1.M2)

$ python tools/check_skills_citadas.py
check_skills_citadas: OK, 114 skill(s) distinta(s) citada(s), 0 inexistentes (de 179 en disco)

$ python tools/sync_agents.py --check
sync --check: OK, 198 archivo(s) en espejo, sin deriva

$ gh pr view 43 --json mergeable,mergeStateStatus,isDraft
{"isDraft":false,"mergeStateStatus":"CLEAN","mergeable":"MERGEABLE", …}
$ gh pr checks 43
Espejo sin deriva y candados en verde	pass	8s

$ gh pr close 628 …
X … can't be closed because it was already merged
```

Índice de `evidencia/`:
- `01-copia-y-ajuste.txt`: manifiestos, `grep` de rutas y búsqueda de secretos.
- `02-actionlog-y-gate.txt`: `ActionLog.md` y los gates del repo.
- `03-cierre-pr-628.txt`: el intento de cierre, quién mergeó y el comentario publicado.
- `04-pr-43-mergeable.txt`: estado del PR y checks.

## No cubierto

- **El contenido del informe no se verificó en runtime.** Cada «→400/403/404» de los anexos sale
  de leer el DTO, el `@Roles` o el controlador. El DoD de cada prompt `BR-NN` exige reproducirlo
  contra la API viva antes de tocar código.
- No se corrieron evals de comportamiento sobre los prompts: son de ejecución de tareas, no skills.
- `check_reparto.py` no se corrió en local porque no se tocó `repartos/`. Sí lo corrió el CI del PR
  (paso «Estructura del reparto»), dentro del check en verde.
- El estado mergeable se tomó después del último push de código. Este `REPORTE.md` va en un push
  posterior: el estado se vuelve a consultar al entregar y se informa en el cierre del turno.

## Desvíos del plan

- **H1.S3.M1:** el plan suponía que el PR 628 seguía abierto, y estaba mergeado. En lugar de
  cerrarlo se publicó un comentario que apunta a este PR, y la retirada queda como decisión (ver
  Pendiente). No se tocó `mockup`.

## Riesgos residuales

- **Hay dos copias del informe:** `mantra-core-health/docs/brechas-front-back-2026-09-24/` (en
  `mockup`) y este `planes/03-…`. Si alguien edita una, divergen. Mitigación: el comentario del 628
  declara a este PR como la versión de referencia; la decisión (a)/(b) lo cierra.
- Los anexos citan líneas de código del 24/09. Con cada merge en los repos las líneas se corren:
  el README §10 ya registra las correcciones que salieron al redactar.

## Decisiones y ambigüedades

- **«Subilo como PR … a prompts».** Primero se leyó como «en formato de prompts» y se publicó en
  el front. Justin aclaró que el destino era este repo. **Supuesto tomado:** carpeta `planes/` con
  el número siguiente (`03`), igual que el plan médico `02-…`. A confirmar con Justin o Pablo si lo
  prefieren en `repartos/`.
- **Revisor pedido:** `PabloArauzCaballero`, dueño del repo. El autor (`Jsaldias39`) no puede ser
  revisor de su propio PR.
