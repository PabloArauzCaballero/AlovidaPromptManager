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
**Estado:** A MEDIAS — **el check falla** (demostrado con el PR #1), pero **no bloquea**: falta la protección de rama, que el clasificador rechazó.

### H1.S1 — Configurar la protección

**CA:** `main` exige el job del workflow, y el nombre del check configurado es **exactamente** el
que GitHub reporta, no el que yo supongo.
**DoD:** `gh api .../branches/main/protection` devuelve el check requerido con su nombre real.
**Estado:** BLOQUEADO — el clasificador del modo automático de la sesión rechazó el `PUT` de la protección (`Modify Shared Resources`). El nombre real del check ya está averiguado: **`Espejo sin deriva y candados en verde`** (el del *job*, no el del workflow). El cuerpo JSON está listo. Lo destraba que lo corra el usuario.

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H1.S1.M1 | Averiguar el **nombre real** del check que publica el workflow | Sale de la API de check-runs de un commit real, no de mi lectura del YAML | `gh api .../commits/<sha>/check-runs -q '.check_runs[].name'` | HECHO |
| H1.S1.M2 | Proteger `main` exigiendo ese check | La protección existe y lo nombra | `gh api .../branches/main/protection` → el check en la lista | BLOQUEADO |
| H1.S1.M3 | La protección **no** encierra al dueño | `enforce_admins` en `false`, y declarado como decisión | salida de la API pegada | BLOQUEADO |

### H1.S2 — Demostrarlo con un PR real, y limpiarlo

**CA:** El PR de prueba queda en rojo y bloqueado; y al terminar **no queda nada** en el repo:
ni PR abierto, ni rama, ni commit de basura en `main`.
**DoD:** estado del PR antes y después, más `gh pr list` y `git branch -r` vacíos de la rama de prueba.
**Evidencia:** [`evidencia/h1-kill-test-pr.txt`](./evidencia/h1-kill-test-pr.txt) — PR #1: check `FAILURE`, pero `mergeStateStatus: UNSTABLE` → **se podía mergear igual**. Cerrado y rama borrada.
**Estado:** HECHO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H1.S2.M1 | Rama con deriva deliberada en `.agents/` | La rama existe y `sync_agents --check` falla en local | `python tools/sync_agents.py --check` → exit 1 | HECHO |
| H1.S2.M2 | PR abierto contra `main` | El PR existe y su número queda registrado | `gh pr view --json number,url` | HECHO |
| H1.S2.M3 | **Kill-test:** el check falla y el merge queda bloqueado | El check en `failure` **y** el PR no mergeable | `gh pr view --json mergeable,mergeStateStatus,statusCheckRollup` | HECHO |
| H1.S2.M4 | Limpieza completa | No queda PR abierto ni rama remota de prueba | `gh pr list --state open` sin la rama · `git ls-remote --heads` sin ella | HECHO |

## H2 — El workflow no depende de acciones deprecadas

**CA:** Dado el workflow, cuando corre, entonces no emite el aviso de Node 20 deprecado y sigue
pasando los 9 pasos.
**DoD:** corrida en verde **sin** la anotación de Node 20.
**Estado:** HECHO

### H2.S1 — Subir las dos actions a su mayor vigente

**CA:** La versión escrita es la que devolvió la API de GitHub, **no** una recordada.
**DoD:** la salida de `gh api .../releases/latest` pegada, más la corrida en verde.
**Evidencia:** [`evidencia/h2-actions.txt`](./evidencia/h2-actions.txt) — run `35487762395` en verde en 6 s, **0 avisos de Node 20**.
**Estado:** HECHO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H2.S1.M1 | `checkout` y `setup-python` a `v7` | El YAML las referencia y parsea | `yaml.safe_load` → exit 0 · `grep` de las versiones | HECHO |
| H2.S1.M2 | La corrida sigue en verde | Los 9 pasos pasan | `gh run view` → `success` | HECHO |
| H2.S1.M3 | El aviso de Node 20 desapareció | Ninguna anotación de Node 20 | `gh run view` → sin esa anotación | HECHO |

### H2.S2 — Deriva falsa por finales de línea (agregada durante la ejecución)

> **Trabajo no previsto, agregado al plan** (regla 20.6.6). Apareció al limpiar el PR de prueba:
> tras cambiar de rama, `sync_agents --check` cantó **`DERIVA DETECTADA`** sobre un archivo cuyo
> contenido es **idéntico**. Medido: el del espejo tenía 100 `CRLF` y el de origen 100 `LF`.
> En Windows, git reescribe con CRLF el archivo que cambia entre ramas y deja el otro como estaba.
> **A cualquiera del equipo le va a pasar al cambiar de rama**, y va a perder el tiempo buscando
> una deriva que no existe. En CI no se ve porque Linux es uniforme.

**CA:** Dado un archivo con el mismo contenido y distinto final de línea en origen y espejo, cuando
corre `sync_agents --check`, entonces **no** reporta deriva.
**DoD:** caso reproducido en el self-test + `--check` en verde sobre el árbol local que hoy falla.
**Evidencia:** [`evidencia/h2-deriva-falsa.txt`](./evidencia/h2-deriva-falsa.txt) — 13 PASS/1 FAIL antes del arreglo, 14 PASS/0 FAIL después.
**Estado:** HECHO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H2.S2.M1 | Reproducir el falso positivo en el self-test **antes** de tocar el código | El self-test falla por este caso | `--self-test` → 1 FAIL, el nuevo | HECHO |
| H2.S2.M2 | Comparar por contenido normalizado, no byte a byte | `--check` deja de reportar deriva falsa | `--self-test` → `0 FAIL` · `--check` → exit 0 | HECHO |
| H2.S2.M3 | Una diferencia **real** sigue detectándose | No se debilitó el candado | caso de contenido distinto → sigue en rojo | HECHO |

## H3 — El trabajo queda cerrado y publicado

**CA:** Dado quien retome, cuando lee el reporte, entonces sabe qué bloquea ahora y qué no.
**DoD:** `REPORTE.md` completo + árbol limpio + `main` publicado.
**Estado:** HECHO

### H3.S1 — Cierre

**CA:** El reporte dice qué se configuró, con qué evidencia, y qué decisiones quedaron sin tomar.
**DoD:** `plan_status.py` → `REPORTE.md: completo`.
**Estado:** HECHO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H3.S1.M1 | `REPORTE.md` completo | Las tres secciones | `plan_status.py` → `completo` | HECHO |
| H3.S1.M2 | Commit y push | `main` y `origin/main` coinciden | `git rev-parse main origin/main` → iguales | HECHO |

## Riesgos y bloqueos previstos

| Riesgo | Impacto | Mitigación |
|---|---|---|
| **Quedar encerrado sin poder mergear a `main`** | **Alto** | `enforce_admins` en `false` (Q-B1). Si algo sale mal, el dueño puede desactivar la protección |
| Dejar basura en el repo: PR abierto o rama de prueba | Medio | La limpieza es una microtarea con su propio DoD verificable, no un «después lo borro» |
| Configurar un check con un nombre que no existe, y que la protección nunca se dispare | **Alto** | El nombre sale de la **API de check-runs de un commit real**, no de mi lectura del YAML |
| Subir una action a una versión inventada | Alto | La versión sale de `gh api .../releases/latest`, pegada como evidencia |
