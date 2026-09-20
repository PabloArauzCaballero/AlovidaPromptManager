# Reporte — Que el candado del CI bloquee de verdad, y demostrarlo

- Fecha: 2026-09-20 · Plan: [PLAN.md](./PLAN.md) · Rama: `main`
- Peldaño de evidencia alcanzado: **`VERIFIED`** — se ejercitó el camino real en GitHub (un PR con
  deriva deliberada, su check en rojo, su limpieza) y se observó el resultado, no se dedujo.
- Avance: **13 / 15 microtareas HECHO (86,7 %)** — calculado con `plan_status.py`. Las 2 que
  faltan son la misma cosa: la protección de rama, rechazada por el clasificador de la sesión.

## Lo más importante de este trabajo

**El candado detecta, pero no bloquea.** Lo demostré con un PR real, no con un razonamiento:

```
PR #1
  check:            Espejo sin deriva y candados en verde
  conclusion:       FAILURE          <- lo detecta
  mergeable:        MERGEABLE        <- pero deja mergear
  mergeStateStatus: UNSTABLE
```

`UNSTABLE` significa exactamente eso: *hay un check en rojo y aun así se puede mergear*. Mientras
`estandar` no sea un **check requerido** de la rama, el rojo es decorativo.

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

## A medias

### H1 — El check falla, pero no bloquea

- **Qué anda:** el check se dispara, falla en el paso correcto, y el nombre real que hay que exigir
  ya está averiguado desde la API: `Espejo sin deriva y candados en verde`. El cuerpo JSON de la
  protección está escrito y listo.
- **Qué no anda:** la protección **no está aplicada**. El `PUT` a
  `repos/.../branches/main/protection` fue **rechazado por el clasificador del modo automático de
  la sesión** (`Modify Shared Resources`) — no por GitHub, no por permisos: el token tiene `repo`
  y el repo es público, así que la llamada funcionaría.
- **Qué falta exactamente:** un solo comando, abajo. Después, reabrir un PR de deriva y confirmar
  que `mergeStateStatus` pasa de `UNSTABLE` a `BLOCKED`.
- **Dónde quedó:** todo publicado en `main`. No hay nada a medio aplicar en GitHub.

**El comando que lo cierra** (el JSON está explicado en «Decisiones»):

```bash
gh api -X PUT repos/PabloArauzCaballero/AlovidaPromptManager/branches/main/protection \
  --input - <<'JSON'
{
  "required_status_checks": { "strict": false,
    "contexts": ["Espejo sin deriva y candados en verde"] },
  "enforce_admins": false,
  "required_pull_request_reviews": null,
  "restrictions": null,
  "allow_force_pushes": false,
  "allow_deletions": false
}
JSON
```

## Pendiente

| ID | Estado | Qué lo destraba |
|---|---|---|
| H1.S1.M2 | **`BLOQUEADO`** | El clasificador rechaza el `PUT` de la protección. Lo destraba el comando de arriba, o una regla de permiso de Bash |
| H1.S1.M3 | **`BLOQUEADO`** | Ídem: es parte del mismo cuerpo JSON |
| Revisión obligatoria en PR | `DESCARTADO` | No se pidió, y en un repo de un solo dueño haría imposible mergear (`Q-B2`) |

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
```

Índice de `evidencia/`: [`h1-proteccion.txt`](./evidencia/h1-proteccion.txt) ·
[`h1-kill-test-pr.txt`](./evidencia/h1-kill-test-pr.txt) ·
[`h2-actions.txt`](./evidencia/h2-actions.txt) ·
[`h2-deriva-falsa.txt`](./evidencia/h2-deriva-falsa.txt).

## No cubierto

- **Que la protección bloquee de verdad.** Se demostró que hoy **no** bloquea; no se demostró que
  con la protección sí, porque no se pudo aplicar.
- **`enforce_admins` no se probó.** Va en `false` por decisión (`Q-B1`), pero nadie verificó su
  efecto.
- **El defecto de finales de línea se arregló para la comparación, no para el `git` del equipo.**
  Si alguien quiere que el árbol sea uniforme en Windows, eso es un `.gitattributes`, y no se tocó:
  está fuera del alcance declarado.
- **No se revisó si otros scripts comparan bytes** y tienen el mismo defecto. Solo se corrigió
  `sync_agents`.

## Desvíos del plan

- **El plan preveía que el PR de prueba demostrara que el merge queda bloqueado.** Demostró lo
  contrario, que es información igual de valiosa: **sin protección, el rojo no bloquea**. El
  kill-test cumplió su función — falló donde tenía que fallar.
- **Se agregó `H2.S2` durante la ejecución** (regla 20.6.6) por el defecto de finales de línea.
- **El `--delete-branch` del PR falló** la primera vez porque un archivo de evidencia sin commitear
  impedía el `checkout`. Se completó la limpieza a mano y se verificó con cuatro comandos.
- **Rompí la indentación del YAML** al subir las versiones de las actions. Lo atrapó el chequeo
  local antes de publicar.

## Riesgos residuales

| Riesgo | Impacto | Estado |
|---|---|---|
| Alguien mergea un PR con el check en rojo | **Alto** | **Sin mitigar**: es exactamente lo que la protección resolvería. Un comando lo cierra |
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
