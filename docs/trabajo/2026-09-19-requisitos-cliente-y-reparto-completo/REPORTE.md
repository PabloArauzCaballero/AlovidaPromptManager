# Reporte — Requisitos del cliente en el repo y reparto completo de los seis días

- Fecha: 2026-09-19 · Plan: [PLAN.md](./PLAN.md) · Rama: `main`
- Peldaño de evidencia alcanzado: **`TESTED`**.
  Por área: los tres verificadores (`check_reparto`, `check_skills_citadas` y los candados) en
  `TESTED`, con self-tests y kill-tests ejecutados · el reparto y el documento de requisitos en
  `WRITTEN` + verificados **de forma**, no de contenido · el workflow de CI sigue `NOT_RUN` en
  GitHub Actions. El peldaño del trabajo es **el más bajo de sus áreas**.
- Avance: **18 / 18 microtareas HECHO (100 %)** — calculado con `plan_status.py`. Del trabajo
  acumulado de la sesión: **46 / 47 (97,9 %)**; la única fuera es el push, bloqueado.

## Por qué existió este trabajo

El reparto anterior se entregó con tres defectos que **se midieron, no se supusieron**, cuando el
usuario pidió que se jurara que estaba completo:

```
menciones de "skill" en todo el reparto ....... 0
menciones de "skills-router" o ".claude" ...... 0
dias del plazo cubiertos ...................... Dia1 (de 6)
lotes repartidos .............................. 5 (de 30)
```

Ningún prompt obligaba a instalar el estándar, y el plan de seis días estaba repartido al 16 %.
**El usuario tenía razón.** Este trabajo corrige las tres cosas.

## Completado

### H2 — Ningún prompt se puede ejecutar sin instalar el estándar

| ID | Qué se logró | Comando | Resultado |
|---|---|---|---|
| H2.S1.M1 | Sección 1 «instalación OBLIGATORIA del estándar» en los **30** prompts | `grep -L 'skills-router'` | **0** prompts sin ella |
| H2.S1.M2 | `check_reparto.py` **falla** si un prompt no la trae | quité la sección al prompt de Itzan | **exit 1**, nombró el archivo y las 3 marcas faltantes · [evidencia](./evidencia/h2-candado-skills.txt) |
| H2.S1.M3 | `tools/check_skills_citadas.py` cruza lo citado contra el disco | `python tools/check_skills_citadas.py` | **73 skills citadas, 0 inexistentes** · [evidencia](./evidencia/h2-skills-citadas.txt) |
| H2.S1.M4 | Los dos candados corren en CI, no solo a mano | `yaml.safe_load` | 11 pasos, YAML válido · [evidencia](./evidencia/h2-ci.txt) |

La sección obliga a: clonar el estándar, copiarlo al checkout, **verificarlo con dos comandos cuya
salida va pegada en el daily**, y cargar entre 15 y 19 skills (11 del proceso, comunes a todos, más
las del lote). Sin esas cuatro casillas, el lote arranca en `BLOQUEADO`.

### H1 — Los requisitos del cliente están en el repo, citables y con procedencia

| ID | Qué se logró | Comando | Resultado |
|---|---|---|---|
| H1.S1.M1 | `docs/requisitos/REQUISITOS-CLIENTE-ALOVIDA.md`, texto **literal** con ficha de procedencia | `grep -c '^## MODULO'` | **8** módulos de primer nivel + 7 submódulos · [evidencia](./evidencia/h1-requisitos.txt) |
| H1.S1.M2 | Índice de brechas con las marcas **que declara el cliente** | conteo por módulo | 389 ítems · 19 `COMPLETO` · 53 `INCOMPLETO` · 27 `FALTA` · **290 sin marca** |
| H1.S1.M3 | Correspondencia con los escenarios `M-01`…`M-19` | tabla | **19/19 con correspondencia, 0 sin** |

**Hallazgo que vale la pena leer:** el documento del cliente coincide punto por punto con los 19
escenarios que el paquete `BACKEND_AUTONOMO_MANTRA` resume y que `FUENTES_Y_LIMITES.md` declara
**no identificados** (ambigüedad `Q-04`, que bloqueaba la aceptación documental). Coinciden incluso
los números exactos: 5 medicamentos → 3 y 2; 8 laboratorios → 5 y 3; 3 imágenes → 2 y 1; las 896
ocupaciones del SEGIP; los avisos de 15 minutos.

**Lo que eso NO significa:** que sea el archivo aprobado. Coincidir en contenido no prueba
identidad de documento. **`Q-04` sigue abierta** y la cierra quien tenga el original, no esta
transcripción. Lo que sí cambia: Marcelo pasa de buscar sin nada a tener un candidato concreto.

**El dato más incómodo del índice de brechas:** de los 8 módulos, **6 no tienen ninguna marca de
estado**. Puede ser que estén sin empezar o que nadie los relevó. No se sabe, y no se supuso.

### H4 — El trabajo está commiteado

| ID | Qué se logró | Comando | Resultado |
|---|---|---|---|
| H4.S1.M1 | `REPORTE.md` con las tres secciones | `plan_status.py` | `REPORTE.md: completo` |
| H4.S1.M2 | Commits `ad8748c` y `6b04241` | `git status --short` | **sin salida** (árbol limpio) |

### H3 — El plan de seis días está repartido completo

| ID | Qué se logró | Comando | Resultado |
|---|---|---|---|
| H3.S1.M1–M5 | Los 25 lotes de los días 2 a 6, derivados fila por fila de `PLAN_SEIS_DIAS.md` | conteo de secciones | **8 secciones** en cada uno |
| H3.S2.M1 | Los 30 dailies nuevos | `find -name '*Daily*'` | **36** en total, los 30 nuevos en `NOT_RUN` |
| H3.S3.M1 | `check_reparto.py` acepta varias fechas | `python tools/check_reparto.py repartos/*` | **exit 0** sobre las 6 fechas |
| H3.S3.M2 | **Kill-test** sobre el **Día 5**, no sobre el Día 1 | escondí el lote de Marcelo | **exit 1** nombrando la carpeta · [evidencia](./evidencia/h3-reparto-completo.txt) |
| H3.S3.M3 | Self-test del verificador extendido | `--self-test` | **18 PASS, 0 FAIL** |

Inventario final del reparto:

| | Día 1 | Día 2 | Día 3 | Día 4 | Día 5 | Día 6 | **Total** |
|---|---:|---:|---:|---:|---:|---:|---:|
| Fecha | 09-19 | 09-20 | 09-21 | 09-22 | 09-23 | 09-24 | 6 fechas |
| Lotes | 5 | 5 | 5 | 5 | 5 | 5 | **30** |
| Microtareas | 67 | 42 | 38 | 39 | 36 | 40 | **262** |

## A medias

### H2 y H4 — Los candados de CI existen pero nunca corrieron en GitHub Actions

- **Qué anda:** el workflow tiene 11 pasos, el YAML parsea, ningún step usa `continue-on-error`, y
  **los 9 comandos que ejecuta pasan en local con exit 0**: `sync_agents --check` (192 archivos,
  sin deriva), los self-tests de `sync_agents` (12 PASS), `plan_gate` (11), `report_gate` (14),
  `plan_status` (30), `check_reparto` (18), `check_skills_citadas` (7), más los dos candados
  corridos sobre el reparto real.
- **Qué no anda:** nada falla. **Falta la prueba.** El workflow nunca corrió en `ubuntu-latest`, y
  el push que lo llevaría allá sigue bloqueado desde el trabajo anterior.
- **Qué falta exactamente:** (1) que alguien corra `git push origin main`; (2) mirar la primera
  corrida y pegar el resultado; (3) provocar deriva a propósito en un PR y confirmar que **falla**;
  (4) marcarlo como check requerido en la protección de rama.
- **Dónde quedó:** `.github/workflows/estandar.yml`, commiteado en `main` local. No rompe nada si
  falla: es un job aislado.

## Pendiente

| ID | Estado | Qué lo destraba |
|---|---|---|
| Push a GitHub (heredado) | **`BLOQUEADO`** | El clasificador del modo automático de la sesión rechaza `git push` (`Out-of-Place Publication`). Lo destraba que lo corra el usuario con `! git push origin main` |
| Ejecutar las 262 microtareas | `TODO` | Es el trabajo del equipo, no de esta sesión |
| Revisión del contenido de los 30 prompts | `TODO` | Nadie del equipo los leyó todavía |

## Evidencia

```text
$ python .claude/hooks/plan_status.py
  Avance: 18/18 microtareas HECHO  (100.0%)   <- este trabajo
  REPORTE.md: completo
  TOTAL: 46/47 microtareas HECHO (97.9%)      <- los tres trabajos de la sesion

$ python tools/check_reparto.py repartos/*
check_reparto: OK, 2026-09-19 cumple la estructura obligatoria
check_reparto: OK, 2026-09-20 cumple la estructura obligatoria
check_reparto: OK, 2026-09-21 cumple la estructura obligatoria
check_reparto: OK, 2026-09-22 cumple la estructura obligatoria
check_reparto: OK, 2026-09-23 cumple la estructura obligatoria
check_reparto: OK, 2026-09-24 cumple la estructura obligatoria
exit=0

$ KILL-TEST del candado de skills: le saco la seccion al prompt de Itzan
check_reparto: ESTRUCTURA INCOMPLETA en 2026-09-19
  - .../DelimitarComposicionYBaseline.md: le FALTA la seccion 1 de instalacion obligatoria
    del estandar, y la entrada al catalogo de skills, y el comando que verifica que el
    estandar quedo instalado
exit=1

$ KILL-TEST sobre el Dia 5: escondo el lote de Marcelo
check_reparto: ESTRUCTURA INCOMPLETA en 2026-09-23
  - 2026-09-23/PromptNoche/Marcelo/: no tiene ninguna carpeta <NombreCorreccion.Modulo> con su tarea
exit=1

$ python tools/check_skills_citadas.py
check_skills_citadas: OK, 73 skill(s) distinta(s) citada(s), 0 inexistentes (de 176 en disco)
exit=0

$ los 9 comandos del workflow, en local
sync_agents --check        OK, 192 archivos, sin deriva              exit=0
sync_agents                12 PASS, 0 FAIL                           exit=0
plan_gate                  11 PASS, 0 FAIL                           exit=0
report_gate                14 PASS, 0 FAIL                           exit=0
plan_status                30 PASS, 0 FAIL                           exit=0
check_reparto              18 PASS, 0 FAIL                           exit=0
check_skills_citadas        7 PASS, 0 FAIL                           exit=0
check_reparto repartos/*   OK sobre las 6 fechas                     exit=0
check_skills_citadas       73 citadas, 0 inexistentes                exit=0

$ inventario del reparto
fechas: 6 | lotes: 30 | prompts: 30 | dailies: 36 | microtareas: 262
por fecha: 09-19=67  09-20=42  09-21=38  09-22=39  09-23=36  09-24=40

$ prompts sin la seccion obligatoria de skills
0

$ requisitos del cliente
8 modulos de primer nivel | 7 submodulos | 389 items
19 COMPLETO | 53 INCOMPLETO | 27 FALTA | 290 SIN MARCA
19/19 escenarios M-01..M-19 con correspondencia
```

Índice de `evidencia/`:

| Archivo | Qué contiene |
|---|---|
| [`h1-requisitos.txt`](./evidencia/h1-requisitos.txt) | Conteos del documento del cliente |
| [`h2-candado-skills.txt`](./evidencia/h2-candado-skills.txt) | Kill-test del candado de la sección obligatoria |
| [`h2-skills-citadas.txt`](./evidencia/h2-skills-citadas.txt) | Self-test y corrida del cruce de skills |
| [`h2-ci.txt`](./evidencia/h2-ci.txt) | Los candados agregados al workflow |
| [`h3-reparto-completo.txt`](./evidencia/h3-reparto-completo.txt) | Las 6 fechas, el inventario y el kill-test del Día 5 |
| [`h4-todos-los-candados.txt`](./evidencia/h4-todos-los-candados.txt) | Los 9 comandos con su exit code |

## No cubierto

Se hizo, pero **no se verificó**:

- **Nadie del equipo leyó los 30 prompts.** Cada afirmación técnica se derivó de un archivo del
  paquete y lleva su referencia, pero **yo no abrí `mantra-core-health-api` en ninguna sesión**.
  No verifiqué que `SchedulingDelayService`, `MessagingAgendaNoticeAdapter`, `orm.config.ts` ni
  ninguna ruta citada exista en el corte. Los prompts están escritos para que quien los ejecute lo
  verifique y registre `NOT_FOUND` si no existe — pero esa comprobación **todavía no ocurrió**.
- **La verificación del reparto es de forma, no de contenido.** `check_reparto.py` comprueba que
  los archivos estén, que traigan la sección de skills y que las skills existan. **Un prompt con
  microtareas malas pasa el check igual.** Está dicho en el docstring del propio script.
- **El workflow nunca corrió en GitHub Actions.** Los candados frenan hoy solo a quien los corra a
  mano. Como candado automático, todavía no existen.
- **Las marcas `COMPLETO`/`INCOMPLETO`/`FALTA` del cliente no se verificaron contra el código.**
  Se transcribieron y se contaron; nadie las comprobó. Usarlas como estado del sistema sería
  exactamente lo que la regla 30 prohíbe.
- **La correspondencia `M-01`…`M-19` la hice yo leyendo los dos textos.** Nadie la revisó.
- **La distribución de días 2 a 6 por persona es mi derivación** de la tabla del paquete. El
  paquete define **líneas de trabajo y roles, no personas ni días individuales por persona**.
- **Ninguna herramienta de IA cargó el puntero de Continue** (heredado del trabajo anterior).
- **Todo corrió solo en Windows.** Sin evidencia en Linux ni macOS.

## Desvíos del plan

- **`H1.S1.M1` decía 9 módulos; contados son 8** de primer nivel más 7 submódulos anidados. Se
  corrigió el número medido, no el documento.
- **La tabla de brechas se escribió primero de memoria** (Médico 9/28/16) y al contarla dio
  **12/47/27**. Se reemplazó por el conteo real y la corrección quedó escrita **dentro del propio
  documento de requisitos**, no solo acá.
- **Se agregó `H2.S1.M4` durante la ejecución** (regla 20.6.6): los dos candados nuevos frenaban
  solo a quien se acordara de correrlos. Entró al plan como microtarea, no se hizo «de paso».
- **El kill-test de `H3.S3.M2` se hizo sobre el Día 5 y no sobre el Día 1**, a propósito: probar
  siempre el mismo camino no prueba el verificador, prueba un caso.

## Riesgos residuales

| Riesgo | Impacto | Estado |
|---|---|---|
| Los prompts citan rutas del paquete que pueden no existir en el corte actual | **Alto** | Mitigado **dentro** de cada prompt: toda localización exige verificar o marcar `NOT_FOUND`, y prohíbe dar por buena una ruta no abierta. **No mitigado** fuera de eso |
| `check_reparto.py` da falsa sensación de completitud: valida forma, no contenido | Medio | Declarado en «No cubierto» y en el docstring del script |
| El mapeo Día N → fecha contradice al paquete, que dice no asignar fechas | Medio | Registrado como `Q-R1` en el plan, en el documento y **en los 5 dailies de equipo nuevos**, con aviso visible |
| Alguien lee las marcas del cliente como estado verificado del sistema | Medio | Declarado tres veces: en la ficha de procedencia, en el índice de brechas y acá |
| 262 microtareas contra un plazo de 6 días y una capacidad no calculada | **Alto** | **Sin mitigar.** Es exactamente `Q-R5`/`Q-03`: `TEAM_CAPACITY` nunca se calculó. La tabla demanda-contra-capacidad es microtarea de Marcelo el Día 1 |
| El workflow falla en `ubuntu-latest` por algo específico de Windows | Medio | Sin mitigar; se sabrá en la primera corrida |

## Decisiones y ambigüedades

- **`Q-R1` — El mapeo Día N → fecha lo inventé yo.** `PLAN_SEIS_DIAS.md` dice textualmente que **no
  se asignan fechas nuevas**, pero la estructura del reparto exige una fecha como primer nivel. Tomé
  Día 2 = `2026-09-20` … Día 6 = `2026-09-24`. **A confirmar con Pablo.** Si el mapeo real es otro,
  los archivos cambian de carpeta, no de contenido.
- **`Q-R2` — Todos los días quedaron en `PromptNoche`**, por consistencia con el Día 1. No inventé
  un turno día sin saber si existe. **A confirmar.**
- **`Q-R3` — No cerré `Q-04` por mi cuenta.** Es la decisión más tentadora de este trabajo: el
  documento coincide en los 19 escenarios y habría sido cómodo declarar el registro encontrado.
  Coincidir en contenido no prueba identidad de documento.
- **`Q-R4` — Las marcas de estado se transcribieron, no se adoptaron.**
- **`Q-R6` — «TOUS» no se tradujo.** El cliente lo usa repetidamente para lo que parece una
  notificación push o un aviso in-app. No está definido en ninguna fuente disponible. **Conservé la
  palabra del cliente en vez de interpretarla.** A confirmar.
- **`Q-R7` — Las 896 ocupaciones del SEGIP contra las 64 que el propio documento menciona:** no
  adopté ninguno de los dos números. Un catálogo oficial exige procedencia antes de entrar a la base.
- **El texto del cliente no se corrigió.** Ni ortografía, ni tildes, ni las frases cortadas, ni los
  dos artefactos visibles de copiado. Corregirlos habría sido editar la fuente de máxima jerarquía.
- **Sin datos de personas en ninguna salida pegada.** Las de esta sesión son conteos de archivos,
  exit codes y resultados de self-tests.
