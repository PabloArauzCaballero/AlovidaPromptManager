# Plan — Reparto PromptNoche 2026-09-19 y cierre de pendientes del trabajo anterior

- Fecha: 2026-09-19 · Repos afectados: `AlovidaPromptManager` · Predecesor: [`2026-09-19-portar-estructura-a-agents`](../2026-09-19-portar-estructura-a-agents/REPORTE.md)
- Resultado observable: cada integrante del equipo (Ender, Itzan, Pablo, Marcelo, Justin) abre su carpeta de
  `repartos/2026-09-19/PromptNoche/` y encuentra su prompt de tarea y su daily del turno; y el espejo `.agents/`
  deja de depender de que alguien se acuerde de correr `sync_agents --check`.
- Kill-test: `ls repartos/2026-09-19/PromptNoche/Ender/` → si no hay archivo, no está hecho. Y
  editar `.agents/` a mano y abrir un PR → si CI queda en verde, el gate no existe.

## Alcance

- **IN:**
  - Prompts de tarea del turno noche del Día 1 para Ender, Itzan, Marcelo y Justin (el de Pablo ya existe).
  - Los 6 dailies que exige la estructura: 1 de equipo + 1 por persona.
  - Workflow de CI que corra `sync_agents.py --check` y los `--self-test`.
  - Punteros de configuración para Windsurf, Cline y Continue, con la ruta verificada en su documentación.
  - Commit y push, ya autorizados explícitamente por el usuario en esta sesión.
- **OUT:**
  - **Ejecutar** las tareas del reparto. Este trabajo escribe los encargos; no toca `mantra-core-health-api`.
  - Reescribir el prompt de Pablo, que ya está entregado.
  - `PromptDia/` del 2026-09-19: no se pidió y no hay material que lo respalde.
  - Cambiar cualquier skill o regla de `.claude/` por lo que se vea de paso.
- **Ambigüedades registradas:**
  | ID | Ambigüedad | Supuesto tomado | A quién confirmar |
  |---|---|---|---|
  | Q-A | El paquete `BACKEND_AUTONOMO_MANTRA` no nombra personas: define **roles**. El mapeo rol→persona es mío. | Pablo=corte (ya hecho) · Ender=contrato · Itzan=composición y baseline · Marcelo=recorrido del registro · Justin=adaptador de la relación. Se deriva del handoff que el propio prompt de Pablo ya escribió y de la tabla Día 1 de `PLAN_SEIS_DIAS.md`. | Pablo (coordinador) |
  | Q-B | Los dailies "resumen lo avanzado", pero el turno **todavía no ocurrió**. | Se entregan como **registro a completar** con campos en `NOT_RUN`, no como resumen de un avance inexistente (regla 00.2). | Pablo |
  | Q-C | El paquete se fecha el 20-09-2026 y hoy es 19-09-2026 (ya registrada como Q-01 en el prompt de Pablo). | No se corrige la fecha; se arrastra la ambigüedad a los prompts nuevos. | Quien encargó el paquete |

## H1 — Los cinco integrantes tienen su encargo del turno noche por escrito

**CA:** Dado el árbol `repartos/2026-09-19/PromptNoche/`, cuando cualquier integrante abre su carpeta,
entonces encuentra su prompt de tarea con hito/subtarea/microtareas, CA y DoD, y su daily del turno,
sin tener que preguntar qué le toca.
**DoD:** comando de verificación de estructura en verde + los 4 prompts con las secciones obligatorias.
**Estado:** HECHO

### H1.S1 — Prompts de tarea de los cuatro integrantes faltantes

**CA:** Cada prompt declara alcance IN/OUT, microtareas con CA binario y DoD con comando, ambigüedades a
registrar y handoff; y no afirma nada que el paquete fuente no respalde.
**DoD:** existencia del archivo + conteo de las 7 secciones obligatorias (`## 0.` a `## 6.`) en cada uno.
**Evidencia:** [`evidencia/h1s1-secciones.txt`](./evidencia/h1s1-secciones.txt) — los 5 prompts con `secciones=7`.
> Corrección del plan (regla 20.7): el prompt de referencia (el de Pablo) tiene 7 secciones numeradas 0..6, no 6. Se ajusta el DoD antes de ejecutar.
**Estado:** HECHO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H1.S1.M1 | Prompt de **Ender** — fijar el contrato real de `AgendaNoticePort` (snapshot, hash, semántica, `recipient` "exactamente uno", `emitMany`, `debounceKey`) | El archivo existe en `Ender/Dia1-ContratoDelPiloto.Backend/` y tiene las 7 secciones | `grep -c '^## '` → `7` | HECHO |
| H1.S1.M2 | Prompt de **Itzan** — composición de capacidad y baseline local (imports de `scheduling.module.ts`, ORM discovery, `TransactionManager`) | Ídem en `Itzan/Dia1-ComposicionYBaseline.Backend/` | `grep -c '^## '` → `7` | HECHO |
| H1.S1.M3 | Prompt de **Marcelo** — seleccionar el recorrido prioritario del registro y sus relaciones (línea B, Día 1) | Ídem en `Marcelo/Dia1-RecorridoPrioritario.Registro/` | `grep -c '^## '` → `7` | HECHO |
| H1.S1.M4 | Prompt de **Justin** — iniciar el adaptador `agenda → mensajería` con dobles fijados y el registro de checks | Ídem en `Justin/Dia1-AdaptadorAgendaMensajeria.Integracion/` | `grep -c '^## '` → `7` | HECHO |

### H1.S2 — Dailies del turno

**CA:** Existe el daily de equipo y el de cada una de las 5 personas, cada uno identificándose por
persona + turno + fecha, y ninguno afirma avance que no ocurrió.
**DoD:** conteo de archivos daily = 6, y `grep` de que ninguno declara `HECHO` en el estado de cierre.
**Evidencia:** [`evidencia/h1s2-dailies.txt`](./evidencia/h1s2-dailies.txt) — 5 personales + 1 de equipo; 0 microtareas precargadas como `HECHO`; 67 en `TODO`.
**Estado:** HECHO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H1.S2.M1 | `Daily-Noche-2026-09-19.md` de equipo, con la tabla de quién tiene qué y el estado de cada lote | El archivo existe y lista a los 5 | `grep -c` de los 5 nombres → `5` o más | HECHO |
| H1.S2.M2 | Los 5 dailies personales `<Persona>-Daily-Noche-2026-09-19.md` | Existen los 5 y ninguno tiene avance precargado | `find ... -name '*-Daily-Noche-*'` → `5` archivos, y `grep -c 'NOT_RUN'` > 0 en cada uno | HECHO |

### H1.S3 — La estructura es verificable, no revisada a ojo

**CA:** Un solo comando dice si el árbol cumple la estructura obligatoria, y falla si falta un archivo.
**DoD:** el comando corre, sale 0 sobre el árbol correcto, y sale distinto de 0 si se esconde un archivo.
**Evidencia:** [`evidencia/h1s3-check-reparto.txt`](./evidencia/h1s3-check-reparto.txt) — self-test 13 PASS / 0 FAIL, árbol real exit 0, kill-test exit 1 nombrando el archivo.
**Estado:** HECHO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H1.S3.M1 | Verificador de estructura del reparto en `tools/check_reparto.py` | Sale 0 con el árbol completo | `python tools/check_reparto.py repartos/2026-09-19` → exit 0 | HECHO |
| H1.S3.M2 | **Kill-test**: el verificador falla si falta un archivo | Renombrando un daily, sale 1 y **nombra el archivo faltante** | mismo comando tras esconder un archivo → exit 1 con el nombre | HECHO |

## H2 — El espejo `.agents/` no puede desincronizarse aunque nadie corra el script

**CA:** Dado un PR que edita `.claude/` sin sincronizar, cuando corre CI, entonces el check falla y
nombra el archivo en deriva.
**DoD:** workflow válido + los mismos comandos corridos en local con su salida pegada.
**Estado:** A MEDIAS — el workflow existe y sus comandos pasan en local; **todavía no corrió en GitHub Actions**. Sube a `HECHO` cuando haya una corrida real en verde (depende del push, H4).

### H2.S1 — Workflow de verificación

**CA:** El workflow corre en push y PR, ejecuta `--check` y los tres `--self-test`, y no usa `continue-on-error`.
**DoD:** YAML parseado sin error + salida local de cada comando.
**Evidencia:** [`evidencia/h2-workflow.txt`](./evidencia/h2-workflow.txt) y [`evidencia/h2-comandos-en-local.txt`](./evidencia/h2-comandos-en-local.txt) — YAML válido, 8 pasos, los 6 comandos en exit 0.
> Corrección del plan (regla 20.7): el DoD de M1 decía `grep -c continue-on-error` → `0`, pero el archivo **menciona** el término en el comentario que lo prohíbe. El chequeo se afina a ocurrencias fuera de comentario. La prohibición no se debilitó: se midió bien.
**Estado:** HECHO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H2.S1.M1 | `.github/workflows/estandar.yml` con el job de deriva y self-tests | El archivo existe y ningún step usa `continue-on-error` | `grep -c '^[^#]*continue-on-error'` → `0` | HECHO |
| H2.S1.M2 | El YAML es sintácticamente válido | Parsea sin excepción | `python -c "import yaml,sys; yaml.safe_load(open(...))"` → exit 0 | HECHO |
| H2.S1.M3 | Los comandos del workflow pasan en local (si fallan acá, fallan en CI) | Los 4 comandos salen 0 | ejecución secuencial con exit codes pegados | HECHO |

## H3 — Las herramientas que el equipo usa encuentran el estándar

**CA:** Dado Windsurf, Cline o Continue abriendo el repo, cuando cargan su configuración, entonces esa
configuración apunta al estándar; y la ruta de cada archivo está respaldada por documentación oficial citada.
**DoD:** archivos creados en la ruta verificada + `sync --check` en verde.
**Resultado:** de las tres, **solo Continue necesitaba archivo**. Windsurf y Cline leen `AGENTS.md` según su propia documentación, así que crear un puntero habría sido una copia más para desincronizar.
**Estado:** HECHO

### H3.S1 — Punteros verificados

**CA:** Ningún puntero se escribe en una ruta que no pude confirmar en documentación oficial; lo no
confirmado se declara, no se inventa (regla 00.1.3).
**DoD:** por cada herramienta, la URL consultada y la ruta resultante, o el motivo de no escribirla.
**Evidencia:** [`evidencia/h3-rutas-verificadas.md`](./evidencia/h3-rutas-verificadas.md) y [`evidencia/h3-punteros.txt`](./evidencia/h3-punteros.txt).
**Estado:** HECHO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H3.S1.M1 | Verificar en documentación oficial la ruta de configuración de Windsurf, Cline y Continue | Para cada una: ruta confirmada con URL, o marcada `NO VERIFICADA` | Tabla con las 3 URLs consultadas en `evidencia/` | HECHO |
| H3.S1.M2 | Escribir los punteros **solo** de las rutas confirmadas | Existen los archivos de las confirmadas y ninguno de las no confirmadas | `ls` de los archivos creados | HECHO |
| H3.S1.M3 | Confirmar que Codex/Gemini CLI/Aider leen `AGENTS.md` (si ya están cubiertos, no se agrega nada) | Cada una: cubierta por `AGENTS.md` con fuente, o pendiente declarada | Tabla en `evidencia/` | HECHO |
| H3.S1.M4 | El espejo sigue sin deriva tras los cambios | `--check` sale 0 | `python tools/sync_agents.py --check` → exit 0 | HECHO |

## H4 — El trabajo está publicado

**CA:** Dado el remoto de GitHub, cuando alguien clona `main`, entonces recibe el estándar, el reparto y el CI.
**DoD:** `git push` con su salida, y `git status` limpio.
**Estado:** TODO

### H4.S1 — Commit y push

**CA:** El commit no incluye nada fuera del alcance de este plan, y el push queda reflejado en el remoto.
**DoD:** salida de `git push` y de `git log origin/main -1`.
**Estado:** BLOQUEADO — el commit está hecho y el árbol limpio, pero `git push origin main` fue **rechazado por el clasificador del modo automático de la sesión** (`Out-of-Place Publication`), no por el remoto ni por el usuario. Lo destraba que el usuario corra `! git push origin main`, o que agregue la regla de permiso correspondiente.

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H4.S1.M1 | Commit de este trabajo | `git status --short` queda vacío | `git status --short` → sin salida | HECHO |
| H4.S1.M2 | Push de `main` al remoto | El SHA local de `main` y el de `origin/main` coinciden | `git rev-parse main origin/main` → dos líneas iguales | BLOQUEADO |

## Riesgos y bloqueos previstos

| Riesgo | Impacto | Mitigación |
|---|---|---|
| Inventar el contenido técnico de los prompts en vez de derivarlo del paquete fuente | **Alto** — sería exactamente lo que la regla 00 prohíbe | Cada afirmación técnica de los prompts cita el archivo del paquete del que sale. Lo que el paquete no dice se escribe como ambigüedad a registrar, no como dato |
| El mapeo rol→persona es mío, no del paquete | Medio | Registrado como Q-A y declarado dentro de cada prompt |
| Las rutas de Windsurf/Cline/Continue no se pueden verificar sin red | Medio | Si no se verifica, **no se escribe el archivo**; se declara `BLOQUEADO` con el motivo |
| El push publica hacia afuera | Medio | Autorizado explícitamente por el usuario en esta sesión; se hace al final, con todo verificado |
