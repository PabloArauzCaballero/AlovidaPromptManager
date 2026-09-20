# Reporte — Consolidar el reparto en una sola noche y cumplir la regla 20

- Fecha: 2026-09-19 · Plan: [PLAN.md](./PLAN.md) · Rama: `main`
- Peldaño de evidencia alcanzado: **`TESTED`** — el verificador y su candado tienen self-tests y
  kill-tests ejecutados; la estructura de los 5 prompts está medida con comandos, no revisada a ojo.
- Avance: **10 / 10 microtareas HECHO (100 %)** — calculado con `plan_status.py`.

## Lo que estaba mal

El pedido era: **todos los prompts para esta noche**, con **hitos, subtareas y microtareas, con
criterio de aceptación y Definition of Done**. Lo entregado no era eso, y se midió:

```
fechas creadas ..................... 6   (se pidio 1)
prompts con encabezado de Hito ..... 5 de 30
prompts con IDs H<n>.S<n>.M<n> ..... 0 de 30
subtareas con CA y DoD propios ..... 0 de 30
```

**La regla 20 de este repo exige las tres capas, cada una con CA y DoD.** Los artefactos que
produje no la cumplían. No fue una diferencia de interpretación: fue incumplir la regla que este
repo existe para imponer, en el artefacto que la regla gobierna.

## Completado

### H1 — Cada persona tiene todo su trabajo en un solo archivo del 19

| ID | Qué se logró | Comando | Resultado |
|---|---|---|---|
| H1.S1.M1 | Extractor que lee los 30 lotes sin retipear nada | conteo | **262** microtareas extraídas |
| H1.S1.M2 | Un prompt consolidado por persona | `find ... ! -name '*Daily*'` | **5** |
| H1.S1.M3 | Fechas `09-20` a `09-24` eliminadas | `ls repartos` | **1 fecha**: `2026-09-19` |
| H1.S1.M4 | Dailies del 19 con los totales nuevos | conteo cruzado | 30 hitos / 90 subtareas / 262 microtareas, coincide |

**Nada se perdió en la consolidación: 262 microtareas antes y 262 después.** El extractor lee el
contenido ya escrito y verificado contra el código en vez de retipearlo, y lo viejo se borra
**recién después** de que los cinco archivos nuevos están en memoria — si algo hubiera fallado,
no se perdía nada.

| Persona | Prompt | Hitos | Subtareas | Microtareas |
|---|---|---:|---:|---:|
| Pablo | Corte, laboratorio del piloto y regresión de aislamiento | 6 | 18 | 53 |
| Ender | El contrato del piloto: fijarlo, validarlo y gobernar su evolución | 6 | 18 | 50 |
| Itzan | Composición, prueba de ausencia y baseline de la capacidad | 6 | 18 | 52 |
| Marcelo | Recorrido del registro: selección, casos y aceptación | 6 | 18 | 54 |
| Justin | La relación agenda → mensajería: dobles, integración y regresión final | 6 | 18 | 53 |
| **TOTAL** | | **30** | **90** | **262** |

### H2 — Los prompts cumplen la regla 20 en las tres capas

| ID | Qué se logró | Comando | Resultado |
|---|---|---|---|
| H2.S1.M1–M2 | CA, DoD y Estado en **hitos y subtareas** | conteo cruzado por prompt | `CA = DoD = Estado = 24 = 6 hitos + 18 subtareas`, en los 5 |
| H2.S1.M3 | Microtareas con ID de tres capas | `grep -cE '^\| H\d+\.S\d+\.M\d+ \|'` | **262** |
| H2.S1.M4 | Solo los seis estados de la regla 20 | chequeo de estados | ningún estado inventado |
| H2.S2.M1 | El candado exige las tres capas | `--self-test` | **30 PASS, 0 FAIL** |
| H2.S2.M2 | **Kill-test sobre un prompt real** | quité un CA de subtarea a Marcelo | **exit 1**: *«le FALTA `**CA:**` en 1 de las 24 capas (hay 23, hacen falta 24: 6 hitos + 18 subtareas)»* |

Se escribieron **30 criterios de aceptación y 30 Definition of Done de hito**, y **90 de
subtarea**, que antes no existían. Cada uno se deriva de las microtareas que contiene —que ya
estaban verificadas contra el código— y ninguno agrega alcance nuevo.

El candado detecta ahora, además: una subtarea que cuelga de un hito inexistente, una subtarea sin
microtareas, y un estado fuera de los seis permitidos (probado con `CASI LISTO` → exit 1).

## A medias

Ninguna.

## Pendiente

| ID | Estado | Qué lo destraba |
|---|---|---|
| Push a GitHub | **`BLOQUEADO`** | El clasificador del modo automático de la sesión rechaza `git push`. **Lo destraba un comando tuyo:** `! git push origin main` |
| Que el CI corra | `TODO` | Depende del push |
| Ejecutar las 262 microtareas | `TODO` | Es el turno del equipo |
| Revisión humana del contenido | `TODO` | El candado verifica que las piezas estén; **no puede juzgar si están bien escritas** |

## Evidencia

```text
$ python .claude/hooks/plan_status.py --path .../PLAN.md
  Avance: 10/10 microtareas HECHO  (100.0%)

$ inventario final
  fechas:            1  (2026-09-19)
  prompts de tarea:  5
  dailies:           6
  hitos:             30
  subtareas:         90
  microtareas:      262   (identicas a las 262 repartidas antes en 6 fechas)

$ regla 20, por prompt
  Pablo    hitos=6 subs=18 micros=53 | CA=24 DoD=24 Estado=24 -> OK
  Ender    hitos=6 subs=18 micros=50 | CA=24 DoD=24 Estado=24 -> OK
  Itzan    hitos=6 subs=18 micros=52 | CA=24 DoD=24 Estado=24 -> OK
  Marcelo  hitos=6 subs=18 micros=54 | CA=24 DoD=24 Estado=24 -> OK
  Justin   hitos=6 subs=18 micros=53 | CA=24 DoD=24 Estado=24 -> OK

$ python tools/check_reparto.py --self-test
  [PASS] detecta prompt sin capa de hito
  [PASS] detecta prompt sin capa de subtarea
  [PASS] detecta prompt sin microtareas con ID de tres capas
  [PASS] detecta subtarea sin CA propio
  [PASS] detecta subtarea sin DoD propio
  [PASS] detecta subtarea sin Estado propio
  [PASS] detecta subtarea que cuelga de un hito inexistente
  [PASS] detecta un estado inventado fuera de los seis de la regla 20
check_reparto self-test: 30 PASS, 0 FAIL

$ KILL-TEST 1 sobre el prompt real de Marcelo: le saco el CA a una subtarea
check_reparto: ESTRUCTURA INCOMPLETA en 2026-09-19
  - .../RecorridoCasosYAceptacion.md: le FALTA `**CA:**` en 1 de las 24 capas
    (hay 23, hacen falta 24: 6 hitos + 18 subtareas)
exit=1

$ KILL-TEST 2: le pongo un estado inventado
  - .../RecorridoCasosYAceptacion.md: le FALTA estados inventados: 'CASI LISTO'
exit=1

$ restaurado
check_reparto: OK, 2026-09-19 cumple la estructura obligatoria
exit=0

$ todos los candados
sync_agents --check        OK, 192 archivos, sin deriva   exit=0
sync_agents                12 PASS, 0 FAIL                exit=0
plan_gate                  11 PASS, 0 FAIL                exit=0
report_gate                14 PASS, 0 FAIL                exit=0
plan_status                30 PASS, 0 FAIL                exit=0
check_reparto              30 PASS, 0 FAIL                exit=0
check_skills_citadas        7 PASS, 0 FAIL                exit=0
check_reparto 2026-09-19   OK                             exit=0
check_skills_citadas       73 citadas, 0 inexistentes     exit=0
```

Índice de `evidencia/`: [`h2-estructura.txt`](./evidencia/h2-estructura.txt) ·
[`h2-candado-regla20.txt`](./evidencia/h2-candado-regla20.txt) · [`h3-cierre.txt`](./evidencia/h3-cierre.txt).

## No cubierto

- **El contenido de los 5 prompts no lo revisó ninguna persona.** El candado verifica que las
  piezas estén, no que estén bien escritas.
- **Los 30 CA de hito y los 90 de subtarea los escribí yo**, derivados de las microtareas que
  contienen. Son la capa que más criterio requiere y la que menos verificación externa tiene.
- **El reparto sigue sin ejecutarse.** Todo está en `TODO`.
- **Nada de esto está en GitHub**: el push sigue bloqueado.
- **La estimación no cambió.** Sigue sin calcularse cuánto de las 262 microtareas entra realmente
  en una noche: `TEAM_CAPACITY` nunca se calculó (`Q-03`).

## Desvíos del plan

- **El verificador tuvo que romperse a propósito para arreglarse.** Al consolidar, `check_reparto`
  falló sobre los 5 prompts nuevos porque exigía el formato viejo `| M<n> |`. **El chequeo estaba
  desactualizado, no los prompts**: se reescribió para exigir las tres capas, que es lo que la
  regla 20 pide desde el principio.
- **Quedaron referencias a «Día N» dentro de las microtareas** después de consolidar, que ya no
  tenían sentido con una sola fecha. Se mapearon a referencias de hito (`H2`, `H5`…). Las 5 que
  quedan son de `Q-01`, que habla de la fecha del paquete y debe quedar.

## Riesgos residuales

| Riesgo | Impacto | Estado |
|---|---|---|
| **262 microtareas en una noche** | **Alto** | **Sin mitigar, y declarado en el prompt y en los 6 dailies.** El alcance va completo y ordenado por dependencia; lo que no se cierre va `A MEDIAS`. **Recortar es decisión de coordinación** |
| Los CA de hito y subtarea no los revisó nadie | Medio | Declarado en «No cubierto» |
| El candado da falsa sensación de calidad | Medio | Dicho en el docstring del script y acá: verifica presencia, no calidad |
| El contenido consolidado perdió contexto de orden | Bajo | Mitigado: cada hito lleva prioridad, y el daily de equipo tiene la tabla de dependencias |

## Decisiones y ambigüedades

- **`Q-C1` — Seis hitos por persona no entran en una noche.** Lo dije antes de empezar y está
  escrito **dentro de cada prompt y de los 6 dailies**, no sólo acá. Entregué el alcance completo
  ordenado por dependencia en vez de recortarlo por mi cuenta: **recortar es tu decisión**.
- **`Q-C2` — Un archivo por persona, no uno compartido.** La estructura de carpetas del equipo es
  por persona, y un único archivo para cinco haría que se pisen. **A confirmar.**
- **No reescribí el contenido técnico.** Las 262 microtareas son las mismas, con el mismo texto
  verificado contra el código. Lo que se agregó son las dos capas que faltaban.
- **Sin datos de personas en ninguna salida pegada.**
