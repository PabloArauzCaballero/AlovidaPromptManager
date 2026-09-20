# Plan — Requisitos del cliente en el repo y reparto completo de los seis días

- Fecha: 2026-09-19 · Repos afectados: `AlovidaPromptManager` · Predecesor: [`2026-09-19-reparto-promptnoche-y-pendientes`](../2026-09-19-reparto-promptnoche-y-pendientes/REPORTE.md)
- Resultado observable: los requisitos mínimos del cliente viven en el repo como documento citable
  con procedencia; **cada uno** de los prompts del reparto obliga a instalar el estándar y nombra
  las skills que su lote exige; y el reparto cubre **los seis días del plazo**, no uno.
- Kill-test: `grep -L "skills-router" repartos/**/*.md` → si nombra un solo prompt, no está hecho.
  Y `find repartos -type d -name 'Dia*'` → si solo aparece `Dia1`, no está hecho.

## Por qué existe este trabajo

El reparto anterior quedó con **tres defectos medidos**, no supuestos:

```
menciones de "skill" en todo el reparto ....... 0
menciones de "skills-router" o ".claude" ...... 0
dias del plazo cubiertos ...................... Dia1 (de 6)
lotes repartidos .............................. 5 (de 30)
```

Ningún prompt obligaba a instalar el estándar, y el plan de seis días estaba repartido al
**16 %** (1 día de 6). Además, los requisitos del cliente no estaban en el repo en ninguna forma.

## Alcance

- **IN:**
  - `docs/requisitos/` con el documento del cliente **literal**, su procedencia y su índice de brechas.
  - Sección obligatoria de instalación del estándar + skills del lote, en **todos** los prompts
    (los 5 que ya existen y los 25 nuevos).
  - Reparto de los **días 2 a 6** del plazo: 5 personas × 5 días = 25 lotes, con sus dailies.
  - Extensión de `tools/check_reparto.py` para que la ausencia de la sección de skills **falle**.
- **OUT:**
  - **Ejecutar** ninguna de las tareas repartidas. Este trabajo escribe encargos.
  - Tocar `mantra-core-health-api` o cualquier repo de producto.
  - Reescribir el contenido técnico ya entregado del Día 1 (solo se le agrega la sección de skills).
  - Decidir cuál de los módulos del cliente entra en el alcance del plazo: eso es decisión de
    negocio y se registra como ambigüedad.
- **Ambigüedades registradas:**
  | ID | Ambigüedad | Supuesto tomado | A quién confirmar |
  |---|---|---|---|
  | Q-R1 | `PLAN_SEIS_DIAS.md` dice explícitamente *"no asigna fechas nuevas"*, pero la estructura de carpetas del reparto **exige una fecha** como primer nivel. | Día N → `2026-09-(18+N)`, es decir Día 2 = `2026-09-20` … Día 6 = `2026-09-24`. **Es un supuesto mío y contradice al paquete.** Si el mapeo real es otro, los archivos cambian de carpeta, no de contenido. | Pablo / quien encargó el paquete |
  | Q-R2 | El paquete no define turnos. El Día 1 se repartió en `PromptNoche`. | Se mantiene `PromptNoche` para los seis días, por consistencia. No se inventa un turno día sin saber si existe. | Pablo |
  | Q-R3 | El documento del cliente **coincide punto por punto** con los escenarios `M-01`…`M-19` que el paquete resume. Eso sugiere que es el "registro funcional original" que `FUENTES_Y_LIMITES.md` declara no identificado (Q-04). | Se registra como **hipótesis fuerte con la tabla de coincidencias a la vista**, no como hecho. Q-04 no se cierra por mi cuenta. | Quien encargó el paquete |
  | Q-R4 | El documento del cliente trae marcas `COMPLETO` / `INCOMPLETO` / `FALTA` cuyo **origen y fecha no constan**. | Se transcriben **tal cual**, atribuidas al documento, y se declara que **nadie de esta sesión las verificó contra el código**. | Cliente / quien hizo ese relevamiento |
  | Q-R5 | El alcance del plazo de 6 días contra el tamaño del documento del cliente (9 módulos) no cierra a ojo. | No se recorta nada en silencio. La tabla demanda-contra-capacidad es una microtarea de Marcelo, con lo desconocido declarado desconocido. | Coordinación |

## H1 — Los requisitos del cliente están en el repo, citables y con procedencia

**CA:** Dado cualquier integrante, cuando necesita saber qué pidió el cliente, entonces abre un
archivo versionado del repo y lo cita con localizador, en vez de buscar un mensaje de chat.
**DoD:** el archivo existe, es literal, declara su procedencia, y el índice de brechas cuadra con él.
**Estado:** HECHO

### H1.S1 — El documento y su índice

**CA:** El documento no se resume, no se corrige y no se completa. Lo que el cliente escribió es
lo que queda, con sus marcas de estado atribuidas a él.
**DoD:** conteo de módulos e ítems + verificación de que no se agregó ninguna marca de estado nueva.
**Evidencia:** [`evidencia/h1-requisitos.txt`](./evidencia/h1-requisitos.txt) — 8 módulos de primer nivel, 7 submódulos, 389 ítems, 19 filas de correspondencia.
> Corrección del plan (regla 20.7): el DoD decía **9 módulos**; contados son **8** de primer nivel más 7 submódulos anidados (`PUNTOS` y `PROMOCIONES`, repetidos en Farmacia, Laboratorio, Análisis y Aseguradora). Se corrige el número medido, no el documento.
> Segunda corrección: la tabla de brechas se escribió primero **de memoria** (Médico 9/28/16) y al contarla dio **12/47/27**. Se reemplazó por el conteo real y se dejó constancia dentro del propio documento.
**Estado:** HECHO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H1.S1.M1 | `docs/requisitos/REQUISITOS-CLIENTE-ALOVIDA.md` con el texto **literal** del cliente y su ficha de procedencia | El archivo existe y contiene los módulos de primer nivel | `grep -c '^## MODULO'` → `8` | HECHO |
| H1.S1.M2 | Índice de brechas por módulo con las marcas **que declara el cliente**, no las mías | Los conteos de `COMPLETO`/`INCOMPLETO`/`FALTA` salen del texto, no de una estimación | conteo por `grep -o` pegado | HECHO |
| H1.S1.M3 | Tabla de coincidencias con los escenarios `M-01`…`M-19` del paquete, y registro de Q-R3 | Cada `M-*` tiene su sección del documento del cliente, o queda marcado `SIN CORRESPONDENCIA` | tabla completa de 19 filas | HECHO |

## H2 — Ningún prompt se puede ejecutar sin instalar el estándar

**CA:** Dado cualquier programador que abre su prompt, cuando llega a la primera microtarea,
entonces ya tuvo que instalar `.claude/` en su checkout y verificarlo con un comando, y sabe qué
skills debe abrir para su lote.
**DoD:** los 30 prompts con la sección, y el verificador fallando si falta.
**Estado:** HECHO — los 30 la tienen (`grep -L` → 0 resultados).

### H2.S1 — La sección obligatoria y su candado

**CA:** La sección nombra skills que **existen en disco** (176 verificadas), no inventadas, y trae
el comando de verificación de la instalación.
**DoD:** `grep -L` sin resultados + `check_reparto.py` en rojo cuando se quita la sección.
**Evidencia:** [`evidencia/h2-candado-skills.txt`](./evidencia/h2-candado-skills.txt) (kill-test: exit 1 nombrando el prompt) y [`evidencia/h2-skills-citadas.txt`](./evidencia/h2-skills-citadas.txt) (45 skills citadas, 0 inexistentes).
**Estado:** HECHO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H2.S1.M1 | Sección «Antes de escribir una línea» en los **5 prompts del Día 1** | Los 5 la tienen | `grep -L 'skills-router' repartos/**/Dia1-*/*.md` → sin salida | HECHO |
| H2.S1.M2 | `check_reparto.py` falla si un prompt de tarea no trae la sección | Sale 1 y nombra el archivo | quitar la sección de un prompt → exit 1 con su ruta | HECHO |
| H2.S1.M3 | Todos los nombres de skill citados existen en `.claude/skills/` | Ninguno inventado | script que cruza los citados contra el disco → `0 inexistentes` | HECHO |
| H2.S1.M4 | **Agregada durante la ejecución** (regla 20.6.6): los dos candados nuevos corren en CI, o solo frenan a quien se acuerde de correrlos | El workflow los ejecuta | `grep -c 'check_reparto\|check_skills_citadas' .github/workflows/estandar.yml` → `≥ 3` | HECHO |

## H3 — El plan de seis días está repartido completo

**CA:** Dado el plazo de seis días, cuando alguien pregunta qué le toca el Día 4, entonces abre su
carpeta y lo encuentra, con criterio de aceptación y comando de verificación.
**DoD:** 30 lotes (5 personas × 6 días), 36 dailies, y `check_reparto.py` en verde sobre las 6 fechas.
**Estado:** HECHO

### H3.S1 — Los lotes de los días 2 a 6

**CA:** Cada lote se deriva de la fila de su día en `PLAN_SEIS_DIAS.md` y de la línea (A o B) de esa
persona. Nada se inventa: lo que el paquete no define se registra como ambigüedad dentro del prompt.
**DoD:** por día, 5 lotes con sus 8 secciones obligatorias.
**Evidencia:** [`evidencia/h3-reparto-completo.txt`](./evidencia/h3-reparto-completo.txt) — 6 fechas, 30 lotes, 30 prompts, 36 dailies, **262 microtareas**, 73 skills distintas citadas y **0 inexistentes**.
**Estado:** HECHO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H3.S1.M1 | Día 2 — laboratorio del piloto y prueba de ausencia (A) · capacidades priorizadas (B) | 5 lotes con 8 secciones | conteo de secciones por archivo → `8` | HECHO |
| H3.S1.M2 | Día 3 — replicar mecanismos útiles (A) · integrar por relación (B) | 5 lotes con 8 secciones | ídem | HECHO |
| H3.S1.M3 | Día 4 — dependencias residuales y baseline (A) · recorridos multi-módulo (B) | 5 lotes con 8 secciones | ídem | HECHO |
| H3.S1.M4 | Día 5 — regresión de aislamiento y empaquetado (A) · candidato compuesto (B) | 5 lotes con 8 secciones | ídem | HECHO |
| H3.S1.M5 | Día 6 — reparaciones acotadas (A) · regresión final y dictamen (B) | 5 lotes con 8 secciones | ídem | HECHO |

### H3.S2 — Los dailies de los días 2 a 6

**CA:** Cada fecha tiene su daily de equipo y los 5 personales, todos en `NOT_RUN`.
**DoD:** 30 dailies nuevos, ninguno con avance precargado.
**Estado:** HECHO — 36 dailies en total (6 por fecha), los 30 nuevos en `NOT_RUN`.

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H3.S2.M1 | Los 6 dailies de cada una de las 5 fechas nuevas | 30 archivos, 0 con microtarea en `HECHO` | `find -name '*Daily*'` → `36` total · `grep -c '^| M[0-9]* | \`HECHO\`'` → `0` | HECHO |

### H3.S3 — El reparto completo es verificable con un comando

**CA:** Un comando recorre las 6 fechas y falla si a cualquiera le falta algo.
**DoD:** exit 0 sobre las 6, y exit 1 al esconder un archivo de una fecha cualquiera.
**Estado:** HECHO — kill-test hecho sobre el **Día 5**, no sobre el Día 1, para no probar siempre el mismo camino.

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H3.S3.M1 | `check_reparto.py` acepta varias fechas de una sola corrida | Verifica las 6 y resume | `python tools/check_reparto.py repartos/*` → exit 0 | HECHO |
| H3.S3.M2 | **Kill-test** sobre una fecha distinta del Día 1 | Sale 1 nombrando el archivo escondido | esconder un lote del Día 5 → exit 1 con su ruta | HECHO |
| H3.S3.M3 | Self-test del verificador extendido sigue en verde | Sin regresión | `python tools/check_reparto.py --self-test` → `0 FAIL` | HECHO |

## H4 — El trabajo queda commiteado y el estado es honesto

**CA:** Dado quien retoma mañana, cuando lee el reporte, entonces sabe qué está demostrado y qué no.
**DoD:** `git status --short` vacío + `REPORTE.md` con las tres secciones.
**Estado:** TODO

### H4.S1 — Cierre

**CA:** El reporte declara explícitamente que el contenido de los 30 prompts **no fue revisado por
nadie del equipo** y que el código de Mantra no se abrió en esta sesión.
**DoD:** `report_gate` conforme + `plan_status` con el avance calculado.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H4.S1.M1 | `REPORTE.md` completo | Las tres secciones presentes | `python .claude/hooks/plan_status.py` → `REPORTE.md: completo` | HECHO |
| H4.S1.M2 | Commit de todo el trabajo | Árbol limpio | `git status --short` → sin salida | HECHO |

## Riesgos y bloqueos previstos

| Riesgo | Impacto | Mitigación |
|---|---|---|
| **Inventar contenido para llenar 25 lotes** | **Alto** — es el riesgo dominante de este trabajo | Cada lote cita la fila de su día en `PLAN_SEIS_DIAS.md` y el anexo del que sale. Lo que el paquete no define entra como ambigüedad dentro del prompt, nunca como tarea inventada |
| Transcribir el documento del cliente "mejorándolo" | Alto — perdería su valor como fuente | Se copia literal. Las correcciones de redacción están prohibidas en este archivo |
| Adoptar las marcas `COMPLETO`/`FALTA` del cliente como verificadas | Alto | Se atribuyen al documento y se declara que nadie las verificó (Q-R4) |
| Asignar fechas que el paquete prohíbe asignar | Medio | Registrado como Q-R1 en el plan, en el documento y en cada daily nuevo |
| 30 prompts que nadie del equipo revisa antes de ejecutarlos | Medio | Declarado en "No cubierto". Los prompts obligan a verificar cada ruta antes de darla por buena |
