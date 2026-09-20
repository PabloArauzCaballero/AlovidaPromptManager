# Reporte — Reparto PromptNoche 2026-09-19 y cierre de pendientes del trabajo anterior

- Fecha: 2026-09-19 · Plan: [PLAN.md](./PLAN.md) · Rama: `main`
- Peldaño de evidencia alcanzado: **`TESTED`** para el trabajo en conjunto.
  Por área: verificador de reparto y candados en `TESTED` (self-tests y kill-test ejecutados) ·
  workflow de CI en `WRITTEN` + comandos en `TESTED` localmente, pero **`NOT_RUN` en GitHub Actions** ·
  punteros de herramientas en `WRITTEN` (ninguna herramienta los cargó).
  El peldaño del trabajo es **el más bajo de sus áreas**, y la razón de que no sea `VERIFIED` está
  en "No cubierto".
- Avance: **16 / 17 microtareas HECHO (94.1%)** — calculado con
  `python .claude/hooks/plan_status.py`, no estimado.

## Completado

### H1 — Los cinco integrantes tienen su encargo del turno noche por escrito

| ID | Qué se logró | Comando | Resultado |
|---|---|---|---|
| H1.S1.M1 | Prompt de **Ender** — fijar el contrato de `AgendaNoticePort` (14 microtareas) | `grep -c '^## '` | `7` secciones · [evidencia](./evidencia/h1s1-secciones.txt) |
| H1.S1.M2 | Prompt de **Itzan** — composición de capacidad y baseline (14 microtareas) | `grep -c '^## '` | `7` secciones |
| H1.S1.M3 | Prompt de **Marcelo** — recorrido prioritario del registro (13 microtareas) | `grep -c '^## '` | `7` secciones |
| H1.S1.M4 | Prompt de **Justin** — adaptador con dobles estrictos (13 microtareas) | `grep -c '^## '` | `7` secciones |
| H1.S2.M1 | Daily de equipo con reparto, dependencias, reservas de archivos y ambigüedades | `grep -c` de los 5 nombres | los 5 presentes · [evidencia](./evidencia/h1s2-dailies.txt) |
| H1.S2.M2 | Los 5 dailies personales, con su tabla de microtareas en `TODO` | `grep -c '^\| M[0-9]* \| `HECHO`'` | **`0`** precargadas · 67 en `TODO` |
| H1.S3.M1 | `tools/check_reparto.py` con `--self-test` | `python tools/check_reparto.py --self-test` | **13 PASS, 0 FAIL** · [evidencia](./evidencia/h1s3-check-reparto.txt) |
| H1.S3.M2 | **Kill-test** del verificador | escondí el daily de Ender y volví a correr | **exit 1**, nombró el archivo exacto; restaurado → exit 0 |

El reparto quedó con **67 microtareas repartidas entre 5 personas**, ninguna marcada como avanzada:
el turno todavía no ocurrió y el documento no finge lo contrario.

### H4 — El trabajo está commiteado

| ID | Qué se logró | Comando | Resultado |
|---|---|---|---|
| H4.S1.M1 | Commit `c5c4a6f` con las 22 rutas nuevas de este trabajo, nada fuera de alcance | `git status --short` | **sin salida** (árbol limpio) |

### H3 — Las herramientas que el equipo usa encuentran el estándar

| ID | Qué se logró | Comando / fuente | Resultado |
|---|---|---|---|
| H3.S1.M1 | Rutas de Windsurf, Cline y Continue verificadas en **su propia documentación** | 3 URLs consultadas | [evidencia](./evidencia/h3-rutas-verificadas.md) |
| H3.S1.M2 | `.continue/rules/00-estandar-de-la-casa.md` — la única que hacía falta | `ls` | creado · [evidencia](./evidencia/h3-punteros.txt) |
| H3.S1.M3 | Codex, Gemini CLI y Aider: cubiertas por `AGENTS.md` | `agents.md` | con límite declarado (ver "No cubierto") |
| H3.S1.M4 | El espejo sigue sin deriva tras los cambios | `python tools/sync_agents.py --check` | `OK, 192 archivos, sin deriva` · exit 0 |

**Hallazgo que cambió el plan:** de las tres herramientas, **solo Continue necesitaba un archivo**.
Windsurf y Cline leen `AGENTS.md` según su documentación, así que escribirles un puntero habría
creado dos copias más del estándar para desincronizar — el problema que `sync_agents.py` existe
para evitar. Lo que no hacía falta, no se hizo, y está justificado por escrito.

## A medias

### H2 — El espejo `.agents/` no puede desincronizarse aunque nadie corra el script

- **Qué anda:** `.github/workflows/estandar.yml` existe, el YAML parsea (8 pasos, job `candados`),
  ningún step usa `continue-on-error`, y **los 6 comandos que el workflow ejecuta pasan en local
  con exit 0**: `sync_agents --check` (192 archivos, sin deriva), y los self-tests de
  `sync_agents` (12 PASS), `plan_gate` (11 PASS), `report_gate` (14 PASS), `plan_status` (30 PASS)
  y `check_reparto` (13 PASS).
- **Qué no anda:** nada falla. Lo que **falta es la prueba**: el workflow **nunca corrió en GitHub
  Actions**. Que los comandos pasen en mi Windows no demuestra que pasen en `ubuntu-latest` con
  Python 3.12 y un checkout limpio. Un `Path` que funciona acá puede romperse ahí.
- **Qué falta exactamente:** (1) que el push de H4 llegue al remoto; (2) mirar la primera corrida
  del workflow y pegar su resultado; (3) si queda en verde, provocar deriva a propósito en un PR y
  confirmar que **falla** — sin eso, hay un workflow, no un candado; (4) marcarlo como check
  requerido en la protección de rama, que hoy no está configurada.
- **Dónde quedó:** `.github/workflows/estandar.yml` en `main`, commiteado. No rompe nada si falla:
  es un job nuevo, aislado. Microtareas `H2.S1.M1/M2/M3` en `HECHO`; **el hito H2 en `A MEDIAS`**.

## Pendiente

| ID | Estado | Qué lo destraba |
|---|---|---|
| H4.S1.M2 | ~~`BLOQUEADO`~~ → **`HECHO`** | El **clasificador del modo automático de la sesión** rechazó `git push origin main` (`Out-of-Place Publication`). No lo rechazó el remoto ni el usuario: el usuario lo había autorizado explícitamente. Lo destraba que lo corra el usuario con `! git push origin main`, o que agregue la regla de permiso de Bash . **RESUELTO el 2026-09-20:** el usuario ejecutó el push; `main` y `origin/main` en `ef1baf9` y el CI corrió en verde (run `35487274310`). |
| Ejecutar las tareas del reparto | `TODO` | Es el turno del equipo, no de esta sesión. Fuera de alcance por diseño |
| Check requerido en protección de rama | `TODO` | Depende de que el workflow corra en verde al menos una vez |
| `PromptDia/` del 2026-09-19 | `DESCARTADO` | No se pidió y no hay material que lo respalde. Solo se creó el turno que se llenó |
| Punteros para Windsurf y Cline | `DESCARTADO` | Su documentación dice que leen `AGENTS.md`. Crear el archivo habría sido duplicar sin necesidad |

## Evidencia

```text
$ python .claude/hooks/plan_status.py --path docs/trabajo/2026-09-19-reparto-promptnoche-y-pendientes/PLAN.md
  Avance: 16/17 microtareas HECHO  (94.1%)
  Estados: HECHO=16  BLOQUEADO=1
  Sin cerrar:
    - H4.S1.M2: BLOQUEADO
  REPORTE.md: completo

$ python tools/check_reparto.py --self-test
check_reparto self-test: 13 PASS, 0 FAIL
exit=0

$ python tools/check_reparto.py repartos/2026-09-19
check_reparto: OK, 2026-09-19 cumple la estructura obligatoria
exit=0

$ KILL-TEST: escondo el daily de Ender y vuelvo a correr
check_reparto: ESTRUCTURA INCOMPLETA en 2026-09-19
  - FALTA el daily personal: 2026-09-19/PromptNoche/Ender/Ender-Daily-Noche-2026-09-19.md
exit=1

$ (restaurado)
check_reparto: OK, 2026-09-19 cumple la estructura obligatoria
exit=0

$ los 6 comandos del workflow, en local
sync_agents --check    -> OK, 192 archivo(s) en espejo, sin deriva   exit=0
sync_agents            -> 12 PASS, 0 FAIL                            exit=0
plan_gate              -> 11 PASS, 0 FAIL                            exit=0
report_gate            -> 14 PASS, 0 FAIL                            exit=0
plan_status            -> 30 PASS, 0 FAIL                            exit=0
check_reparto          -> 13 PASS, 0 FAIL                            exit=0

$ control: ninguna microtarea precargada como HECHO en los dailies
0

$ filas de microtarea repartidas
Ender=14  Itzan=14  Justin=13  Marcelo=13  Pablo=13   (total 67)

$ ocurrencias de continue-on-error como clave (no en comentario)
0

$ git commit -F <mensaje>  &&  git status --short
c5c4a6f feat: reparto PromptNoche 2026-09-19, candado de CI y puntero para Continue
(git status sin salida: arbol limpio)

$ git push origin main
DENEGADO por el clasificador del modo automatico de la sesion: [Out-of-Place Publication]
(no es un rechazo del remoto; el commit sigue solo en local)

$ git rev-parse --short main ; git rev-parse --short origin/main
c5c4a6f
fatal: Needed a single revision     <- origin/main no existe localmente: nunca se pusheo
```

Índice de `evidencia/`:

| Archivo | Qué contiene |
|---|---|
| [`h1s1-secciones.txt`](./evidencia/h1s1-secciones.txt) | Los 5 prompts con su conteo de secciones |
| [`h1s2-dailies.txt`](./evidencia/h1s2-dailies.txt) | Los 6 dailies y el control de avance no precargado |
| [`h1s3-check-reparto.txt`](./evidencia/h1s3-check-reparto.txt) | Self-test, corrida real y kill-test del verificador |
| [`h2-workflow.txt`](./evidencia/h2-workflow.txt) | Validación del YAML y del `continue-on-error` |
| [`h2-comandos-en-local.txt`](./evidencia/h2-comandos-en-local.txt) | Los 6 comandos del workflow con sus exit codes |
| [`h3-rutas-verificadas.md`](./evidencia/h3-rutas-verificadas.md) | Las 4 URLs consultadas y qué se decidió con cada una |
| [`h3-punteros.txt`](./evidencia/h3-punteros.txt) | Punteros presentes, ausentes justificados, y espejo sin deriva |

## No cubierto

Se hizo, pero **no se verificó**:

- **Nada de esto está en GitHub todavía.** El push quedó bloqueado, así que el commit `c5c4a6f`
  vive solo en esta máquina. Todo lo que sigue depende de que el push ocurra.
- **El workflow nunca corrió en GitHub Actions.** Es la limitación más importante de este trabajo:
  como candado automático, **todavía no existe**. Solo existe como archivo.
- **Nadie provocó deriva contra el workflow.** El kill-test de `sync_agents --check` es del trabajo
  anterior y se corrió en local. Contra CI, no se hizo.
- **El contenido técnico de los 4 prompts no fue revisado por nadie del equipo.** Cada afirmación
  técnica se derivó de un archivo del paquete `BACKEND_AUTONOMO_MANTRA` y lleva su referencia, pero
  **yo no abrí `mantra-core-health-api`**: no verifiqué que `SchedulingDelayService`,
  `MessagingAgendaNoticeAdapter` ni las rutas citadas existan en el corte. Los prompts están escritos
  para que quien los ejecute lo verifique — y para que registre `NOT_FOUND` si no existe.
- **El mapeo rol→persona es mío**, derivado del handoff que el prompt de Pablo ya tenía escrito y de
  la tabla del Día 1 de `PLAN_SEIS_DIAS.md`. **El paquete no nombra personas: define roles.** Si el
  reparto real es otro, los archivos cambian de carpeta, no de contenido.
- **Ninguna herramienta de IA cargó los punteros.** Que Continue documente `.continue/rules/` no
  prueba que lea este archivo. Igual que en el trabajo anterior: sin abrir el repo con cada
  herramienta, esto es documentación, no verificación.
- **Codex, Gemini CLI y Aider descansan en una sola fuente secundaria** (`agents.md`), no en la
  documentación de cada proveedor. Para Windsurf, Cline y Continue sí se consultó al proveedor.
- **`check_reparto.py` no valida contenido**, solo estructura. Un prompt vacío con el nombre correcto
  pasa el check. Eso es deliberado, pero hay que saberlo.
- **Los self-tests corrieron solo en Windows.** Sin evidencia en Linux ni macOS — que es exactamente
  lo que la primera corrida del workflow va a decir.

## Desvíos del plan

- **El DoD de `H1.S1` decía "6 secciones" y el prompt de referencia tiene 7** (numeradas 0 a 6).
  Se corrigió el DoD **antes** de ejecutar, con la corrección anotada en el `PLAN.md` (regla 20.7).
- **El DoD de `H2.S1.M1` decía `grep -c continue-on-error` → `0`**, pero el archivo menciona el
  término en el comentario que lo prohíbe. El chequeo se afinó a ocurrencias fuera de comentario.
  **La prohibición no se debilitó: se midió bien.** Alternativa descartada: borrar el comentario
  para que el grep diera 0 — eso habría sido ajustar la realidad a la medición.
- **H3 entregó menos archivos de los planificados, a propósito.** El plan preveía punteros para tres
  herramientas; el descubrimiento mostró que dos ya estaban cubiertas. Se registró en vez de
  fabricar trabajo.
- **El hito H2 quedó `A MEDIAS` con sus tres microtareas en `HECHO`.** No es una inconsistencia: las
  microtareas midieron lo que prometían medir (archivo, YAML, comandos locales); el **hito** prometía
  un candado en CI, y eso todavía no está demostrado.

## Riesgos residuales

| Riesgo | Impacto | Estado |
|---|---|---|
| El workflow falla en `ubuntu-latest` por algo específico de Windows en los scripts | Medio | **Sin mitigar.** Se sabrá en la primera corrida. Es un job nuevo: si falla, no rompe nada más |
| El mapeo rol→persona no coincide con cómo trabaja el equipo | Medio | Registrado como ambigüedad Q-A; los prompts son movibles entre carpetas |
| Los prompts citan rutas del paquete que pueden no existir en el corte actual | Medio | Mitigado **dentro de los prompts**: cada localización exige verificar o marcar `NOT_FOUND`, y prohíbe dar por buena una ruta no abierta |
| `check_reparto.py` da una falsa sensación de completitud (valida forma, no contenido) | Bajo | Declarado en "No cubierto" y en el docstring del propio script |
| El puntero de Continue se desincroniza del `AGENTS.md` | Bajo | **Sin mitigar**: no está cubierto por `sync_agents.py`, igual que el de Cursor y el de Copilot |

## Decisiones y ambigüedades

- **Los dailies se entregaron como registro a completar, no como resumen.** La estructura los define
  como "resumen de lo avanzado", pero el turno no ocurrió. Escribir un resumen de un avance
  inexistente habría sido inventar datos. Todos salen con `NOT_RUN` y `TODO`. **A confirmar con
  Pablo** si prefiere que el archivo se cree recién al cerrar el turno.
- **No se creó `PromptDia/`.** Solo se crea el turno que se llena.
- **No se tocó `AGENTS.md`** para mencionar el nuevo puntero de Continue: estaba fuera del alcance
  declarado. **Queda anotado como sugerencia**, no hecho de paso.
- **Windsurf y Cline sin archivo propio**: decisión tomada con su documentación a la vista, no por
  ahorrar trabajo. Si el equipo prefiere el archivo explícito igual, es media hora.
- **La fecha del paquete (20-09-2026) va un día adelante de hoy (19-09-2026).** No se corrigió: se
  arrastró como ambigüedad `Q-01` a los cuatro prompts nuevos y al daily de equipo. **A confirmar
  con quien encargó el paquete.**
- **Ambigüedad abierta que más trabajo bloquea del equipo:** `Q-06`, la contradicción entre el
  comentario del puerto (un aviso fallido puede descartarse) y el metaprompt (durabilidad exigida
  para efectos obligatorios). Está marcada `DECISION_REQUIRED` en tres de los cinco prompts.
  **Es decisión de negocio; ninguno de los cinco puede tomarla.**
- **Sin datos de pacientes en ninguna salida pegada.** Ninguna de las salidas de esta sesión los
  contenía: son conteos de archivos, exit codes y resultados de self-tests.
