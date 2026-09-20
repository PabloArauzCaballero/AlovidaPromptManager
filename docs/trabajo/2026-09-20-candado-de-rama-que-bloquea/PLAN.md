# Plan — Que el candado del CI bloquee de verdad, y demostrarlo

- Fecha: 2026-09-20 · Repos afectados: `AlovidaPromptManager` (y sus ajustes en GitHub) · Predecesor: [`2026-09-19-consolidar-reparto-en-una-noche`](../2026-09-19-consolidar-reparto-en-una-noche/REPORTE.md)
- Resultado observable: un PR que rompe el estándar **no se puede mergear**, y hay un PR real que
  lo demuestra con su check en rojo y su botón de merge bloqueado.
- Kill-test: abrí un PR con deriva a propósito. Si GitHub lo deja mergear, el candado no existe:
  es un adorno verde.

## Por qué existe este trabajo

El CI corre y pasa, pero **hoy muestra rojo sin impedir nada**. Un check que no bloquea no es un
candado. Además, la primera corrida dejó un aviso: `actions/checkout@v4` y `actions/setup-python@v5`
apuntan a Node 20, que GitHub deprecó, y hoy los fuerza a Node 24.

Estado de partida, medido:

```
$ gh api .../rulesets                    -> []
$ gh api .../branches/main/protection    -> 404 Branch not protected
$ gh repo view                           -> PUBLIC, default=main
$ gh auth status                         -> scopes: gist, read:org, repo, workflow
```

## Alcance

- **IN:** protección de la rama `main` con el job del workflow como **check requerido** · un PR de
  prueba con deriva deliberada que demuestre que **falla y bloquea** · limpieza de ese PR y su rama ·
  subir las dos actions a su mayor vigente, **verificada contra la API de GitHub**.
- **OUT:** tocar el contenido del reparto · cambiar los scripts de los candados · exigir revisión
  humana obligatoria en los PR (es una decisión de equipo, no técnica) · dejar abierto el PR de prueba.
- **Ambigüedades registradas:**
  | ID | Ambigüedad | Supuesto | A quién confirmar |
  |---|---|---|---|
  | Q-B1 | El usuario autorizó «hacerlo», pero no dijo si la protección debe **bloquear también a él** como dueño | Se configura **sin** `enforce_admins`: el dueño puede saltearla en una emergencia, y el salteo queda registrado en GitHub. Bloquear al dueño en un repo de una persona puede dejarlo encerrado | Pablo |
  | Q-B2 | No se pidió exigir revisión de otra persona en cada PR | **No se configura.** Es una decisión de equipo y en un repo de un solo dueño haría imposible mergear | Pablo |

## H1 — Un PR que rompe el estándar no se puede mergear

**CA:** Dado un PR con deriva deliberada en `.agents/`, cuando GitHub evalúa sus checks, entonces
el check `estandar` queda en rojo **y el merge queda bloqueado**.
**DoD:** la salida de la API mostrando `mergeable_state` bloqueado, con el check en `failure`.
**Estado:** TODO

### H1.S1 — Configurar la protección

**CA:** `main` exige el job del workflow, y el nombre del check configurado es **exactamente** el
que GitHub reporta, no el que yo supongo.
**DoD:** `gh api .../branches/main/protection` devuelve el check requerido con su nombre real.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H1.S1.M1 | Averiguar el **nombre real** del check que publica el workflow | Sale de la API de check-runs de un commit real, no de mi lectura del YAML | `gh api .../commits/<sha>/check-runs -q '.check_runs[].name'` | TODO |
| H1.S1.M2 | Proteger `main` exigiendo ese check | La protección existe y lo nombra | `gh api .../branches/main/protection` → el check en la lista | TODO |
| H1.S1.M3 | La protección **no** encierra al dueño | `enforce_admins` en `false`, y declarado como decisión | salida de la API pegada | TODO |

### H1.S2 — Demostrarlo con un PR real, y limpiarlo

**CA:** El PR de prueba queda en rojo y bloqueado; y al terminar **no queda nada** en el repo:
ni PR abierto, ni rama, ni commit de basura en `main`.
**DoD:** estado del PR antes y después, más `gh pr list` y `git branch -r` vacíos de la rama de prueba.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H1.S2.M1 | Rama con deriva deliberada en `.agents/` | La rama existe y `sync_agents --check` falla en local | `python tools/sync_agents.py --check` → exit 1 | TODO |
| H1.S2.M2 | PR abierto contra `main` | El PR existe y su número queda registrado | `gh pr view --json number,url` | TODO |
| H1.S2.M3 | **Kill-test:** el check falla y el merge queda bloqueado | El check en `failure` **y** el PR no mergeable | `gh pr view --json mergeable,mergeStateStatus,statusCheckRollup` | TODO |
| H1.S2.M4 | Limpieza completa | No queda PR abierto ni rama remota de prueba | `gh pr list --state open` sin la rama · `git ls-remote --heads` sin ella | TODO |

## H2 — El workflow no depende de acciones deprecadas

**CA:** Dado el workflow, cuando corre, entonces no emite el aviso de Node 20 deprecado y sigue
pasando los 9 pasos.
**DoD:** corrida en verde **sin** la anotación de Node 20.
**Estado:** TODO

### H2.S1 — Subir las dos actions a su mayor vigente

**CA:** La versión escrita es la que devolvió la API de GitHub, **no** una recordada.
**DoD:** la salida de `gh api .../releases/latest` pegada, más la corrida en verde.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H2.S1.M1 | `checkout` y `setup-python` a `v7` | El YAML las referencia y parsea | `yaml.safe_load` → exit 0 · `grep` de las versiones | TODO |
| H2.S1.M2 | La corrida sigue en verde | Los 9 pasos pasan | `gh run view` → `success` | TODO |
| H2.S1.M3 | El aviso de Node 20 desapareció | Ninguna anotación de Node 20 | `gh run view` → sin esa anotación | TODO |

## H3 — El trabajo queda cerrado y publicado

**CA:** Dado quien retome, cuando lee el reporte, entonces sabe qué bloquea ahora y qué no.
**DoD:** `REPORTE.md` completo + árbol limpio + `main` publicado.
**Estado:** TODO

### H3.S1 — Cierre

**CA:** El reporte dice qué se configuró, con qué evidencia, y qué decisiones quedaron sin tomar.
**DoD:** `plan_status.py` → `REPORTE.md: completo`.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H3.S1.M1 | `REPORTE.md` completo | Las tres secciones | `plan_status.py` → `completo` | TODO |
| H3.S1.M2 | Commit y push | `main` y `origin/main` coinciden | `git rev-parse main origin/main` → iguales | TODO |

## Riesgos y bloqueos previstos

| Riesgo | Impacto | Mitigación |
|---|---|---|
| **Quedar encerrado sin poder mergear a `main`** | **Alto** | `enforce_admins` en `false` (Q-B1). Si algo sale mal, el dueño puede desactivar la protección |
| Dejar basura en el repo: PR abierto o rama de prueba | Medio | La limpieza es una microtarea con su propio DoD verificable, no un «después lo borro» |
| Configurar un check con un nombre que no existe, y que la protección nunca se dispare | **Alto** | El nombre sale de la **API de check-runs de un commit real**, no de mi lectura del YAML |
| Subir una action a una versión inventada | Alto | La versión sale de `gh api .../releases/latest`, pegada como evidencia |
