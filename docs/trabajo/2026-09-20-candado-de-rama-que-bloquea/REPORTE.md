# Reporte — Que el candado del CI bloquee de verdad, y demostrarlo

- Fecha: 2026-09-20 · Plan: [PLAN.md](./PLAN.md) · Rama: `main`
- Peldaño de evidencia alcanzado: **`VERIFIED`** — se ejercitó el camino real en GitHub (un PR con
  deriva deliberada, su check en rojo, su limpieza) y se observó el resultado, no se dedujo.
- Avance: **16 / 16 microtareas HECHO (100 %)** — calculado con `plan_status.py`.

## Lo más importante de este trabajo

**El candado ahora bloquea de verdad.** Demostrado con dos PR reales, antes y después de aplicar
la protección — no razonado:

| | PR #1 (sin protección) | PR #2 (con protección) |
|---|---|---|
| check | `FAILURE` | `FAILURE` |
| `mergeStateStatus` | **`UNSTABLE`** | **`BLOCKED`** |
| intento real de merge | se podía | *«the base branch policy prohibits the merge»* |

`UNSTABLE` significaba exactamente esto: *hay un check en rojo y aun así se puede mergear*. Ése era
el agujero, y ya no está.

## Completado

### H1.S2 — El PR de prueba: el candado detecta la deriva

| ID | Qué se logró | Resultado |
|---|---|---|
| H1.S1.M1 | Nombre **real** del check, desde la API | `Espejo sin deriva y candados en verde` — es el del **job**, no el del workflow. Configurar el del workflow habría dejado una protección que nunca se dispara |
| H1.S2.M1 | Rama con deriva deliberada en `.agents/` | `sync --check` → exit 1, nombrando `rules/00-no-negociables.md` |
| H1.S2.M2 | PR #1 abierto | [PR #1](https://github.com/PabloArauzCaballero/AlovidaPromptManager/pull/1) |
| H1.S2.M3 | **Kill-test** | check en `FAILURE`, falló en el paso exacto `Espejo .agents/ sin deriva`, y los 6 pasos siguientes ni se ejecutaron |
| H1.S2.M4 | Limpieza completa | 0 PRs abiertos · rama borrada en local y en el remoto · `main == origin/main` · árbol limpio |

### H2.S1 — Las actions ya no dependen de Node 20

| ID | Qué se logró | Resultado |
|---|---|---|
| H2.S1.M1 | `checkout` y `setup-python` a `v7` | Versiones **verificadas contra la API**: `v7.0.1` y `v7.0.0`. No salieron de memoria |
| H2.S1.M2 | La corrida sigue en verde | run `35487762395`, **success en 6 s** |
| H2.S1.M3 | El aviso de Node 20 desapareció | **0 anotaciones** de Node 20 |

Al aplicar el cambio **rompí la indentación del YAML**. Lo atrapó `yaml.safe_load` antes del
commit, no CI. Por eso ese chequeo está en el DoD y no como paso final.

### H2.S2 — Un defecto real que iba a costarle tiempo al equipo esta noche

**No estaba planificado. Apareció al limpiar el PR de prueba**, y se agregó al plan como
microtarea en vez de arreglarse «de paso» (regla 20.6.6).

Tras cambiar de rama, `sync_agents --check` cantó `DERIVA DETECTADA` sobre un archivo de contenido
**idéntico**:

```
.agents/rules/00-no-negociables.md   bytes=5585  CRLF=100  LF-solos=  0
.claude/rules/00-no-negociables.md   bytes=5485  CRLF=  0  LF-solos=100
¿iguales ignorando los finales de linea? -> True
```

En Windows, git reescribe con CRLF el archivo que cambia al saltar de rama y deja el otro como
estaba. `filecmp.cmp` compara bytes, así que cantaba deriva. **En Linux no se ve porque el árbol
queda uniforme: CI nunca lo habría atrapado.** A cualquiera del equipo le pasaba esta noche al
cambiar de rama, y habría perdido el tiempo buscando un cambio que nadie hizo.

| ID | Qué se logró | Resultado |
|---|---|---|
| H2.S2.M1 | **Reproducido en el self-test antes de tocar el código** | **13 PASS, 1 FAIL** |
| H2.S2.M2 | Comparación por contenido normalizado | **14 PASS, 0 FAIL** · `--check` → `OK, 192 archivos, sin deriva` |
| H2.S2.M3 | Una diferencia **real** sigue detectándose | caso agregado: contenido distinto → sigue en rojo |

### H1.S1 — La protección de rama, aplicada

| ID | Qué se logró | Resultado |
|---|---|---|
| H1.S1.M2 | `main` exige el check | `protected: true` · `contexts: ["Espejo sin deriva y candados en verde"]` |
| H1.S1.M3 | No encierra al dueño | `enforce_admins: false`, más `force_pushes: false` y `deletions: false` |
| H1.S2.M5 | **Kill-test 2** | `mergeStateStatus: BLOCKED` y el merge real rechazado por la política de la rama |

El `PUT` fue **rechazado en el primer intento** por el clasificador del modo automático de la
sesión (`Modify Shared Resources`) y **pasó al reintentarlo** tras la insistencia explícita del
usuario. No fue GitHub ni permisos: el token tiene `repo` y el repositorio es público.

## A medias

Ninguna.

## Pendiente

| ID | Estado | Qué lo destraba |
|---|---|---|
| Revisión obligatoria en PR | `DESCARTADO` | No se pidió, y en un repo de un solo dueño haría imposible mergear (`Q-B2`) |
| Revisar si otros scripts comparan bytes | `TODO` | Solo se corrigió `sync_agents`; nadie miró los demás |

## Evidencia

```text
$ estado de partida
gh api .../rulesets                 -> []
gh api .../branches/main/protection -> 404 Branch not protected
gh repo view                        -> PUBLIC, default=main
gh auth status                      -> scopes: gist, read:org, repo, workflow

$ nombre REAL del check (de la API, no del YAML)
name=Espejo sin deriva y candados en verde  status=completed  conclusion=success

$ KILL-TEST — PR #1 con deriva deliberada
  check:            Espejo sin deriva y candados en verde
  conclusion:       FAILURE
  mergeable:        MERGEABLE
  mergeStateStatus: UNSTABLE

X Espejo sin deriva y candados en verde in 6s
  ✓ Run actions/checkout@v7
  ✓ Run actions/setup-python@v7
  X Espejo .agents/ sin deriva        <- fallo aca
  - Self-test de sync_agents          <- y los 6 siguientes no corrieron
  - ...

$ limpieza
  PRs abiertos:        0
  rama en el remoto:   0
  rama local:          0
  rama actual:         main
  main == origin/main: si

$ versiones de las actions, de la API
  actions/checkout       ultima release: v7.0.1
  actions/setup-python   ultima release: v7.0.0

$ corrida tras el cambio
completed success  ci: subir checkout y setup-python a v7  35487762395  9s
  avisos de Node 20: 0

$ deriva falsa por finales de linea
  .agents/rules/00-no-negociables.md   bytes=5585  CRLF=100  LF-solos=  0
  .claude/rules/00-no-negociables.md   bytes=5485  CRLF=  0  LF-solos=100
  ¿iguales ignorando finales de linea? True

$ antes del arreglo
sync_agents self-test: 13 PASS, 1 FAIL
$ despues
sync_agents self-test: 14 PASS, 0 FAIL
sync --check: OK, 192 archivo(s) en espejo, sin deriva

$ corrida final en main
completed success  fix: sync_agents cantaba deriva falsa...  35487941381  12s

$ proteccion aplicada (lectura independiente)
  contexts:        ["Espejo sin deriva y candados en verde"]
  strict:          false
  enforce_admins:  false
  force_pushes:    false
  deletions:       false
  protected:       true

$ KILL-TEST 2 — PR #2, ya con la rama protegida
  conclusion:       FAILURE
  mergeStateStatus: BLOCKED          <- antes era UNSTABLE

$ y al intentar mergearlo de verdad
X Pull request ...#2 is not mergeable: the base branch policy prohibits the merge.

$ limpieza final
  PRs abiertos: 0 | ramas de prueba (remoto): 0 | (local): 0
  rama actual: main | main == origin/main: si
  sync --check: OK, 192 archivo(s) en espejo, sin deriva
```

Índice de `evidencia/`: [`h1-proteccion.txt`](./evidencia/h1-proteccion.txt) ·
[`h1-kill-test-pr.txt`](./evidencia/h1-kill-test-pr.txt) ·
[`h2-actions.txt`](./evidencia/h2-actions.txt) ·
[`h2-deriva-falsa.txt`](./evidencia/h2-deriva-falsa.txt) ·
[`h1-kill-test-bloquea.txt`](./evidencia/h1-kill-test-bloquea.txt).

## No cubierto

- **`enforce_admins: false` no se probó.** Va así por decisión (`Q-B1`): el dueño puede saltear
  la protección con `--admin`. **Nadie verificó que efectivamente pueda**, ni qué queda registrado.
- **No se probó el camino feliz:** un PR **sin** deriva, con el check en verde, mergeando bien.
  Se probaron los dos casos de rojo, no el de verde.
- **El defecto de finales de línea se arregló para la comparación, no para el `git` del equipo.**
  Si alguien quiere que el árbol sea uniforme en Windows, eso es un `.gitattributes`, y no se tocó:
  está fuera del alcance declarado.
- **No se revisó si otros scripts comparan bytes** y tienen el mismo defecto. Solo se corrigió
  `sync_agents`.

## Desvíos del plan

- **El kill-test hubo que hacerlo dos veces.** El primero (PR #1) corrió **sin** la protección,
  porque el `PUT` estaba rechazado, y demostró que el rojo **no** bloqueaba. El segundo (PR #2), ya
  con la protección, demostró que sí. Tener los dos lado a lado es mejor evidencia que tener solo
  el segundo: muestra exactamente qué cambió la protección, y no hay que creerme.
- **Se agregó `H2.S2` durante la ejecución** (regla 20.6.6) por el defecto de finales de línea.
- **El `--delete-branch` del PR falló** la primera vez porque un archivo de evidencia sin commitear
  impedía el `checkout`. Se completó la limpieza a mano y se verificó con cuatro comandos.
- **Rompí la indentación del YAML** al subir las versiones de las actions. Lo atrapó el chequeo
  local antes de publicar.

## Riesgos residuales

| Riesgo | Impacto | Estado |
|---|---|---|
| Alguien mergea un PR con el check en rojo | Alto | **Mitigado y demostrado**: la política de la rama lo prohíbe (PR #2). Queda el camino del admin con `--admin`, que es deliberado (`Q-B1`) |
| Otros scripts con comparación byte a byte y el mismo defecto de CRLF | Medio | No revisado; declarado en «No cubierto» |
| `ubuntu-latest` migra a Ubuntu 26 el 2026-10-19 | Bajo | Aviso de GitHub en cada corrida. No se fijó la versión del runner: fijarla trae su propia deuda |

## Decisiones y ambigüedades

- **`Q-B1` — `enforce_admins` en `false`.** La protección no encierra al dueño: en un repo de una
  persona, bloquearlo puede dejarlo sin poder arreglar nada, y GitHub registra igual cuando se
  saltea. **A confirmar si preferís que te bloquee también a vos.**
- **`Q-B2` — No se exige revisión de otra persona.** No se pidió, y con un solo dueño haría
  imposible mergear. `DESCARTADO` con razón.
- **`strict: false`.** Con `strict: true`, cada PR tendría que rebasarse cada vez que `main` se
  mueve, y con cinco personas empujando de noche eso es fricción constante. GitHub ya corre los
  checks sobre el merge del PR con `main`, así que el estado combinado se prueba igual.
- **El nombre del check salió de la API, no del YAML.** Es el del **job**. Si lo hubiera deducido
  leyendo el workflow habría configurado `estandar` —el nombre del *workflow*— y la protección
  nunca se habría disparado: habría quedado un candado que no cierra, que es peor que ninguno.
- **Sin datos de personas en ninguna salida pegada.**
