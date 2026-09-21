# Reporte — Reparto de las 24 correcciones del doctor, turno noche 2026-09-20

> **AVANCE: 22 / 22 — 100 %.** Las 22 microtareas de **este trabajo** (el reparto) en `HECHO`.
> **Ojo con lo que ese número significa y con lo que no:** mide que el reparto está hecho, **no** que
> las 24 correcciones estén hechas. Las correcciones están en `TODO`: **0 / 272 microtareas de
> ejecución**. Confundir las dos cifras sería exactamente el resumen optimista que la regla 40
> prohíbe.

- Fecha: 2026-09-20 · Plan: [PLAN.md](./PLAN.md) · Rama: `main` de `AlovidaPromptManager`
- Peldaño de evidencia alcanzado: **`TESTED`** para el reparto — los dos candados del repo corrieron
  en verde y la cobertura está **medida con un script**, no afirmada. **No es `VERIFIED`**: nadie
  ejecutó todavía ninguno de los cinco encargos, así que no hay evidencia de que sean ejecutables en
  la práctica; eso lo dirá el turno.
- Peldaño de la **verificación contra el código**: **`DISCOVERED`**. Se leyeron archivos en un corte
  declarado. **No se ejecutó nada** en `mantra-core-health`: ni build, ni tests, ni se abrió la
  maqueta en un navegador.

## Completado

| ID | Qué se logró (observable) | Comando de verificación | Resultado |
|---|---|---|---|
| H1.S1.M1 | Las 24 correcciones transcritas **verbatim** con IDs `C-01`…`C-24` | `grep -c '^## C-' docs/requisitos/CORRECCIONES-DOCTOR-2026-09-20.md` | PASS → **24** |
| H1.S1.M2 | Ficha de procedencia con lo que **no** consta declarado como tal | lectura del documento | PASS |
| H1.S1.M3 | 8 ambigüedades del documento fuente registradas (`Q-D1`…`Q-D8`) con supuesto y dueño | lectura del documento | PASS |
| H1.S2.M1 | Corte del frontend fijado y declarado: `689697821a6e6d2c8f702c7508d6728fa9a1869a` (`origin/mockup`, PR #554) | `git log -1 --format='%H %ad %s' origin/mockup` | PASS |
| H1.S2.M2 | Confirmado que la maqueta corre **sin backend**, con su localizador | `git show origin/mockup:src/environments/environment.ts \| grep -n mockBackend` | PASS → `mockBackend: true` |
| H1.S2.M3 | Las 24 correcciones localizadas en el código con archivo y línea | [`VERIFICACION-CONTRA-CODIGO-2026-09-20.md`](../../verificacion/VERIFICACION-CONTRA-CODIGO-2026-09-20.md) §1 | PASS — 24 de 24 con al menos un localizador |
| H1.S2.M4 | 10 choques y hallazgos transversales registrados (`HALL-D1`…`HALL-D10`), cada uno con la regla que manda | mismo documento §2 | PASS |
| H1.S3.M1 | Las 24 asignadas a 5 personas, con dueño del patrón para las transversales | script de cobertura | PASS → **0 correcciones sin dueño** |
| H1.S3.M2 | Reserva de archivos por persona, sin solapamientos | tabla en el documento fuente y en el daily de equipo | PASS |
| H2.S1.M1 | Encargo de **Pablo** escrito (C-04, C-07, C-08, C-10, C-11, C-12, C-13) | script de cobertura | PASS → 6 / 18 / **55** |
| H2.S1.M2 | Encargo de **Justin** escrito (C-15 → C-22) | ídem | PASS → 6 / 18 / **54** |
| H2.S2.M1 | Encargo de **Itzan** escrito (C-01, C-02, C-05, C-06, C-09, C-21) | ídem | PASS → 6 / 18 / **54** |
| H2.S2.M2 | Encargo de **Ender** escrito (C-03, C-12, C-13, C-20, C-24) | ídem | PASS → 6 / 18 / **55** |
| H2.S2.M3 | Encargo de **Marcelo** escrito (C-14, C-23 + dictamen de las 24) | ídem | PASS → 6 / 18 / **54** |
| H2.S3.M1 | Los 5 dailies personales creados con su plantilla de cierre | `check_reparto.py` | PASS — sin «FALTA el daily personal» |
| H2.S3.M2 | Daily de equipo con cobertura, dependencias, reservas y ambigüedades | `check_reparto.py` | PASS — sin «FALTA el daily de equipo» |
| H3.S1.M1 | Candado de estructura del reparto en verde | `python tools/check_reparto.py repartos/2026-09-20` | PASS → exit **0** |
| H3.S1.M2 | Candado de skills citadas en verde | `python tools/check_skills_citadas.py` | PASS → exit **0**, 101 skills citadas, **0 inexistentes** |
| H3.S2.M1 | Cobertura de las 24 **medida**, no afirmada | script en `evidencia/cobertura.txt` | PASS → 24/24, **0 sin dueño** |
| H3.S2.M2 | Sección 1 obligatoria y capas contadas en los 5 prompts | mismo script | PASS → 5/5 con la sección; 30 hitos, 90 subtareas, **272 microtareas** |
| H3.S3.M1 | Este reporte, con sus tres secciones | archivo en disco | PASS |
| H3.S3.M2 | Entrada nueva en `ActionLog.md`, arriba, con enlaces | `head -20 ActionLog.md` | PASS |

## A medias

**Ninguna.** Las 22 microtareas del plan de este trabajo cerraron con su DoD ejecutado.

Lo que sí hay que decir, y no es «a medias» de este trabajo sino **su límite declarado**: los cinco
encargos **no fueron ejecutados por nadie todavía**. Que un prompt pase los dos candados demuestra
que tiene las piezas obligatorias; **no** demuestra que sea bueno ni que su DoD sea alcanzable. Eso
lo descubre el turno, y el primero que lo va a notar es quien encuentre que un número de línea se
movió.

## Pendiente

| ID | Estado | Qué lo destraba |
|---|---|---|
| Las 272 microtareas de los cinco encargos | `TODO` | Que el turno arranque. No hay nada que las bloquee: los tres supuestos de negocio abiertos tienen camino declarado sin romper contrato |
| Q-D6 — ampliar el enum `ExceptionType` para «Otros servicios» | `DECISION_REQUIRED` | Negocio. Mientras tanto se usa `OTHER` + texto, que es el uso que el contrato documenta |
| Q-D6b — fuente autoritativa de posología (C-20) | `DECISION_REQUIRED` | Negocio, con fuente clínica. El mecanismo se implementa igual; el dato queda declarado sintético |
| Q-D9 — qué norma rige la hoja de internación (C-23) | `DECISION_REQUIRED` | Doctor / negocio. Lo que no se pueda citar va `UNKNOWN` |
| Reparto del turno **día** 2026-09-20 | `DESCARTADO` para este trabajo | No fue pedido. Sólo se creó `PromptNoche/` |
| Llevar estos cambios de `mockup` a `dev` | `TODO`, fuera de alcance | Decisión de coordinación posterior al turno (`Q-D1`) |

## Evidencia

```text
$ python tools/check_reparto.py repartos/2026-09-20
check_reparto: OK, 2026-09-20 cumple la estructura obligatoria
exit: 0

$ python tools/check_skills_citadas.py
check_skills_citadas: OK, 101 skill(s) distinta(s) citada(s), 0 inexistentes (de 176 en disco)
exit: 0

$ (script de cobertura) — cada C-nn citada en al menos un prompt de tarea
  C-01 -> Itzan          C-09 -> Itzan                     C-17 -> Justin
  C-02 -> Itzan          C-10 -> Itzan, Pablo              C-18 -> Justin, Marcelo
  C-03 -> Ender          C-11 -> Pablo                     C-19 -> Justin
  C-04 -> Pablo          C-12 -> Ender, Pablo              C-20 -> Ender, Justin
  C-05 -> Itzan          C-13 -> Ender, Pablo              C-21 -> Ender, Itzan, Justin, Pablo
  C-06 -> Ender, Itzan, Justin, Pablo                      C-22 -> Justin, Marcelo
  C-07 -> Pablo          C-14 -> Marcelo                   C-23 -> Marcelo
  C-08 -> Pablo          C-15 -> Justin                    C-24 -> Ender
                         C-16 -> Justin
correcciones sin dueno: 0

$ capas por prompt (hitos / subtareas / microtareas / CA / DoD / Estado)
  Ender      6 / 18 / 55 / 24 / 24 / 24
  Itzan      6 / 18 / 54 / 24 / 24 / 24
  Justin     6 / 18 / 54 / 24 / 24 / 24
  Marcelo    6 / 18 / 54 / 24 / 24 / 24
  Pablo      6 / 18 / 55 / 24 / 24 / 24
TOTAL microtareas repartidas: 272

$ seccion 1 de instalacion obligatoria del estandar
  Ender OK · Itzan OK · Justin OK · Marcelo OK · Pablo OK

$ dailies
  Daily-Noche-2026-09-20.md OK · los 5 personales OK

$ git log -1 --format='%H %ad %s' origin/mockup   (en alovida/mantra-core-health)
689697821a6e6d2c8f702c7508d6728fa9a1869a Sun Sep 20 12:32:53 2026 -0400 Merge pull request #554 ...

$ git show origin/mockup:src/environments/environment.ts | grep -n mockBackend
  mockBackend: true,      # "Siempre encendido en la rama `mockup`: es lo que la define."

$ git grep -o "iconOnly" origin/mockup -- 'src/app/**/*.html' | wc -l
107          # en 34 plantillas — la medicion de partida de C-06

$ grep -o '"property_code": "[a-z_]*"' vademecum.dataset.json | sort | uniq -c
  17 "property_code": "therapeutic_class"
  17 "property_code": "strengths"
  17 "property_code": "routes"
  17 "property_code": "dose_forms"
   1 "property_code": "atc_route_variants"
             # CERO apariciones de frequency -> C-20 no tiene dato de origen
```

Índice de `evidencia/`: [`check-reparto.txt`](./evidencia/check-reparto.txt) ·
[`check-skills.txt`](./evidencia/check-skills.txt) · [`cobertura.txt`](./evidencia/cobertura.txt).

## No cubierto

Lo que se hizo pero **no se probó**, y los caminos que no se ejercitaron:

1. **Los cinco encargos no se ejecutaron.** Nadie corrió una sola de las 272 microtareas. Los
   candados verifican que las piezas obligatorias están, **no** que el contenido sea bueno: el
   docstring de `check_reparto.py` lo dice textualmente.
2. **No se abrió la maqueta desplegada.** Todo lo que este trabajo dice sobre «lo que el doctor ve»
   es inferencia de la rama `origin/mockup`, no observación de `https://mockup.173.249.39.237.sslip.io`.
   **Ahí es donde se cierra `Q-D4`** (si C-18 y C-22 ya están cumplidos).
3. **No se ejecutó nada en los repos de producto**: ni `yarn typecheck`, ni `yarn lint`, ni un test,
   ni el barrido de Playwright. Los comandos que los prompts exigen salen del `README` del simulador
   y del `package.json`, **leídos, no corridos**.
4. **No se midió cuántas de las 24 están ya hechas.** Este trabajo localiza y reparte; el dictamen es
   H6 de Marcelo.
5. **Los números de línea pueden haberse movido.** Son del corte `68969782…`; cada prompt manda
   reconsultar y declarar el corte propio en su primera microtarea, justo por esto.
6. **No se revisó el histórico de `origin/mockup`.** Si una de estas correcciones ya se intentó antes
   y se revirtió, este trabajo no lo sabe.
7. **No se verificó que el `git clone` del estándar funcione.** La sección 1 de los cinco prompts lo
   incluye con su plan B (pedirlo a Pablo por copia directa), porque el 2026-09-19 el push del repo
   estaba bloqueado. **Sigue sin confirmarse** si hoy está publicado.

## Desvíos del plan

| Qué se ejecutó distinto | Por qué |
|---|---|
| El plan preveía `grep -c '^### C-'` para contar las correcciones; el documento usa `^## C-` | Los `###` habrían quedado anidados bajo la sección «Texto del cliente» y el nivel de encabezado no aportaba nada. El DoD se ajustó al comando real y su salida es la misma: 24 |
| Se agregó un documento no previsto en el plan inicial: la verificación contra el código | Sin localizadores, los cinco prompts habrían mandado a cinco personas a redescubrir lo mismo. Es trabajo previsto por la regla 10 fase 1, y se agregó como H1.S2 en vez de hacerse «de paso» |
| **Se tocó un archivo fuera del alcance declarado**: `docs/trabajo/2026-09-20-probar-camino-feliz-y-salteo/PLAN.md` y su `REPORTE.md` | El candado `blocker_gate.py` bloqueó el cierre por 4 microtareas en `BLOQUEADO` de **otro trabajo de hoy**, cuyo plan no declaraba nada de lo que la regla 65 exige. El candado tenía razón. Se agregó la declaración que faltaba —excepción por acción destructiva sobre algo compartido (`DECISION_REQUIRED` del dueño del repositorio) **más** el contrato de la simulación de tres niveles que lo cerraría, en un repositorio descartable y no en `main`—. **No se usó `ALOVIDA_BLOCKER_GATE_OFF=1`, no se ejecutó ningún merge con `--admin` ni ningún push a `main` protegida, y ningún veredicto de ese trabajo cambió.** El desvío de alcance está declarado acá y en una nota dentro de ese reporte |
| Se cargó la skill `prompt-engineering` **después** de escribir los cinco prompts y se hizo una pasada de auditoría contra su checklist | El pedido la nombraba explícitamente y se había resuelto siguiendo el contrato de `check_reparto.py` y el prompt de referencia del 2026-09-19. La auditoría encontró **una** falta real: cero ejemplos etiquetados («son la señal más fuerte que hay», §4). Se agregó a cada prompt un par `<ejemplo tipo="aceptable">` / `<ejemplo tipo="prohibido">` sobre el cierre de una microtarea concreta, y los dos candados se reejecutaron en verde |
| Las mayúsculas de énfasis se midieron en vez de suponerlas | La skill §8 pide bajar el volumen. La medición (`grep -oE` de rachas en mayúsculas) devolvió que **todas** son vocabulario de la regla 20 (`A MEDIAS`, `EN CURSO`), rótulos de prioridad (`ALTA`, `BLOQUEANTE`), acrónimos o palabras textuales del cliente (`OTROS SERVICIOS`). Cero «CRÍTICO» y cero «SIEMPRE/NUNCA» gratuitos, así que no se cambió nada por este motivo |
| `/reload-skills` y `/reload-plugins` no se ejecutaron | No están en el listado de skills disponibles de esta sesión: son comandos del CLI, no invocables desde acá. Las 176 skills del repo se leyeron directo de `.claude/skills/`, que es la fuente |
| Ninguna búsqueda se delegó a un subagente | Regla 70.1.2: sin autorización del `CLAUDE.md` del proyecto el límite es 1 simultáneo, y la precisión que estos prompts necesitan (archivo y línea) se pierde en el resumen de un agente. Se hizo con búsquedas dirigidas |

## Riesgos residuales

| Riesgo | Impacto | Qué lo contiene hoy |
|---|---|---|
| **`origin/mockup` se mueve y los localizadores envejecen** | Cinco personas buscando líneas que se corrieron | Cada prompt manda reconsultar y declarar el corte propio en H1.S1.M1, y el documento de verificación avisa de la trampa en su §0 |
| **Itzan publica tarde el componente de acciones** | Los otros cuatro no cierran su parte de C-06 | Está marcado `BLOQUEANTE PARA LOS OTROS CUATRO` en su prompt, con la instrucción de publicar aunque el resto quede a medias, y está en la tabla de dependencias del daily |
| **Ender es cuello de botella de tres personas** | Pablo, Justin y Marcelo esperan contrato | Sus H2, H3 y H4 están marcados como bloqueantes, y los tres que esperan tienen instrucción explícita de aplicar la regla 65 y cerrar contra el doble |
| **C-20 tienta a inventar posología** | Dato clínico falso en un catálogo — el daño que la regla 97.5.4 existe para evitar | Está separado mecanismo de dato en dos lotes, con el precedente B-13 citado en los dos prompts y un kill-test que pregunta explícitamente de dónde salió el valor |
| **C-23 tienta a escribir campos «de norma» de memoria** | Requisitos normativos inventados | El prompt exige fuente con nombre, referencia y fecha, o `UNKNOWN` declarado, y el kill-test del hito pregunta la fuente de un campo al azar |
| **272 microtareas no entran en una noche** | Cierres falsos para llegar | Dicho en el daily y en los cinco prompts: lo que no cierra va `A MEDIAS` con las cuatro respuestas; recortar es decisión de coordinación |
| **Cinco personas sobre la misma rama** | Conflictos y archivos pisados | Tabla de reservas en el documento fuente y en el daily, más la instrucción de pedir por el daily lo que sea de otro |

## Decisiones y ambigüedades

**Decisiones tomadas en este trabajo, con su motivo:**

1. **El corte del reparto es `origin/mockup`, no el working copy ni `dev`.** Motivo: las URLs del
   pedido apuntan a la maqueta, y la maqueta es esa rama (`mockBackend: true` fijo). Confirmar con
   Pablo (`Q-D1`).
2. **Las correcciones transversales tienen un dueño del patrón y cuatro aplicadores.** Motivo: C-06 y
   C-21 tocan los cinco lotes; sin un dueño se escriben cinco componentes distintos, y con un dueño
   que las aplique en todos lados se pisan cinco archivos. Itzan publica, cada uno aplica en lo suyo.
3. **El motivo de bloqueo de C-12 viaja como `OTHER` + texto «Otros servicios».** Motivo: la lista del
   contrato es cerrada y validada con `@IsIn`, y el propio DTO documenta ese uso para cuando la lista
   se queda corta. Ampliar el enum es decisión de negocio, registrada.
4. **C-20 se partió en mecanismo (Justin) y catálogo con procedencia (Ender).** Motivo: la regla 97.5.4
   y el precedente B-13. El mecanismo es trabajo; la posología es dato clínico y **no se infiere**.
5. **Se creó sólo `PromptNoche/`.** Motivo: el pedido dice «los carriles de esta noche» (`Q-D2`).
6. **`mantra-core-health-api` y `mantra-core-health-model` no se escriben esta noche.** Motivo: las 24
   correcciones son de la maqueta, y un cambio de esquema no se revierte con un revert (regla 97).
   Lo que exija modelo se propone, con dueño.

**Ambigüedades que se arrastran, con supuesto y a quién confirmar** — las 8 `Q-D*` del documento
fuente, más las de cada lote (`Q-P*` Pablo, `Q-J*` Justin, `Q-I*` Itzan, `Q-E*` Ender, `Q-M*`
Marcelo). Las tres que son **decisión de negocio** y bloquean cierre, no arranque:

| ID | Qué | Dueño |
|---|---|---|
| Q-D6 | Ampliar el enum de motivos de bloqueo para «Otros servicios» | Negocio |
| Q-D6b | Fuente autoritativa de posología por medicamento | Negocio, con fuente clínica |
| Q-D9 | Qué norma rige la hoja de internación | Doctor / negocio |

**Ninguna se resolvió por conveniencia, y ninguna impide arrancar:** las tres tienen supuesto
declarado y un camino que no rompe contrato.
