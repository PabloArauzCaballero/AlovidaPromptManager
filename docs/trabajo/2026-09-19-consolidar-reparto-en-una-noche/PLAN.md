# Plan — Consolidar el reparto en una sola noche y cumplir la regla 20

- Fecha: 2026-09-19 · Repos afectados: `AlovidaPromptManager` · Predecesor: [`2026-09-19-verificar-contra-codigo-real`](../2026-09-19-verificar-contra-codigo-real/REPORTE.md)
- Resultado observable: cada integrante abre **un solo archivo** en
  `repartos/2026-09-19/PromptNoche/<Persona>/` y encuentra **todo** su trabajo, estructurado en
  **hitos → subtareas → microtareas**, con **criterio de aceptación, Definition of Done y Estado en
  las tres capas**.
- Kill-test: abrí cualquier prompt y buscá `H1.S1.M1`. Si no está, o si una subtarea no tiene su
  propio `**CA:**` y `**DoD:**`, no cumple la regla 20 y no está hecho.

## Por qué existe este trabajo

El usuario pidió **todos los prompts para esta noche**, con **hitos, subtareas y microtareas, con
criterio de aceptación y Definition of Done**. Lo que entregué no era eso. Medido:

```
fechas creadas ..................... 6   (se pidio 1)
prompts con encabezado de Hito ..... 5 de 30
prompts con IDs H<n>.S<n>.M<n> ..... 0 de 30
subtareas con CA y DoD propios ..... 0 de 30
```

**La regla 20 de este mismo repo exige las tres capas, cada una con CA y DoD**, y los artefactos
que produje no la cumplían. No es una diferencia de interpretación: es incumplimiento de la regla
que el repo existe para imponer.

## Alcance

- **IN:**
  - Un único prompt por persona bajo `repartos/2026-09-19/PromptNoche/<Persona>/`, que **consolida**
    los seis lotes que había repartido en seis fechas.
  - Estructura de la regla 20: `H<n>` → `H<n>.S<n>` → `H<n>.S<n>.M<n>`, con **CA, DoD y Estado en
    las tres capas**.
  - Eliminación de las fechas `2026-09-20` a `2026-09-24`.
  - Dailies del 2026-09-19 actualizados a los totales nuevos.
  - `check_reparto.py` exige la estructura de la regla 20, para que esto no pueda repetirse.
- **OUT:**
  - Cambiar el **contenido técnico** de las microtareas ya verificadas contra el código: se
    reordena y se le agregan las capas que faltan, **no se reescribe lo que ya está verificado**.
  - Ejecutar ninguna tarea del reparto.
  - Tocar `mantra-core-health-api`.
- **Ambigüedades registradas:**
  | ID | Ambigüedad | Supuesto | A quién confirmar |
  |---|---|---|---|
  | Q-C1 | Seis bloques de trabajo en **una noche** no entran en ninguna estimación razonable | Se entrega **todo** el alcance en un solo prompt, **ordenado por dependencia** y con prioridad por hito. Lo que no se cierre queda `A MEDIAS` con qué anda, qué no anda y qué falta — **no se recorta nada en silencio**. Recortar alcance es decisión tuya, no mía | Pablo |
  | Q-C2 | «Un solo prompt» puede significar un archivo por persona, o un único archivo para las cinco | Un archivo **por persona**: la estructura de carpetas del equipo es por persona, y un archivo compartido haría que cinco personas se pisen en el mismo documento | Pablo |

## H1 — Cada persona tiene todo su trabajo en un solo archivo del 19

**CA:** Dado cualquier integrante, cuando abre su carpeta del 2026-09-19, entonces encuentra
**un** archivo con la totalidad de su trabajo, y ninguna otra fecha existe en el reparto.
**DoD:** `ls repartos/` → solo `2026-09-19`; un prompt por persona; `check_reparto.py` en verde.
**Estado:** HECHO

### H1.S1 — Consolidar

**CA:** Ningún contenido técnico de los seis lotes se pierde en la consolidación.
**DoD:** el conteo de microtareas del archivo consolidado ≥ la suma de los seis lotes de esa persona.
**Evidencia:** [`evidencia/h3-cierre.txt`](./evidencia/h3-cierre.txt) — **262 microtareas** antes y después: ninguna perdida.
**Estado:** HECHO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H1.S1.M1 | Extraer el contenido de los 30 lotes a una estructura de datos única | Las 262 microtareas quedan representadas | conteo del extractor → `262` | HECHO |
| H1.S1.M2 | Un prompt consolidado por persona, en `2026-09-19` | Existen 5 y solo 5 prompts de tarea | `find ... ! -name '*Daily*'` → `5` | HECHO |
| H1.S1.M3 | Eliminar las fechas `2026-09-20` a `2026-09-24` | `ls repartos/` devuelve una sola fecha | `ls repartos \| wc -l` → `1` | HECHO |
| H1.S1.M4 | Dailies del 19 actualizados a los totales nuevos | El daily de equipo suma lo mismo que los 5 prompts | conteo cruzado → coincide | HECHO |

## H2 — Los prompts cumplen la regla 20 en las tres capas

**CA:** Dado cualquier prompt, cuando se lo revisa contra la regla 20, entonces tiene hitos,
subtareas y microtareas, **cada capa con su criterio de aceptación, su Definition of Done y su
Estado**, y los identificadores son `H<n>`, `H<n>.S<n>` y `H<n>.S<n>.M<n>`.
**DoD:** conteos por prompt + `check_reparto.py` con los chequeos nuevos en verde.
**Estado:** HECHO

### H2.S1 — La estructura

**CA:** No hay ninguna subtarea sin CA ni DoD propios, ni ninguna microtarea sin su ID de tres capas.
**DoD:** `grep -c` por prompt de cada elemento, con la salida pegada.
**Evidencia:** [`evidencia/h2-estructura.txt`](./evidencia/h2-estructura.txt) — los 5 prompts con `CA = DoD = Estado = 24 = 6 hitos + 18 subtareas`.
**Estado:** HECHO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H2.S1.M1 | Cada hito con `**CA:**`, `**DoD:**` y `**Estado:**` | Los 5 prompts, todos sus hitos | `grep -c '^## H[0-9] —'` = `grep -c` de sus CA | HECHO |
| H2.S1.M2 | Cada subtarea con `**CA:**`, `**DoD:**` y `**Estado:**` | Ídem para subtareas | conteo cruzado por prompt | HECHO |
| H2.S1.M3 | Cada microtarea con ID `H<n>.S<n>.M<n>`, CA binario, DoD con comando y Estado | Ninguna fila sin las cuatro columnas | `grep -cE '^\| H[0-9]+\.S[0-9]+\.M[0-9]+ \|'` → suma = total | HECHO |
| H2.S1.M4 | Estados permitidos: solo los seis de la regla 20 | Ningún estado inventado | `grep -o` de estados → solo `TODO` en la entrega | HECHO |

### H2.S2 — El candado, para que no vuelva a pasar

**CA:** Dado un prompt sin hitos, sin CA de subtarea o sin IDs de tres capas, cuando corre el
verificador, entonces **falla y lo nombra**.
**DoD:** self-test ampliado en verde + kill-test sobre un prompt real.
**Evidencia:** [`evidencia/h2-candado-regla20.txt`](./evidencia/h2-candado-regla20.txt) — 30 PASS / 0 FAIL, y dos kill-tests sobre el prompt real de Marcelo.
**Estado:** HECHO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H2.S2.M1 | `check_reparto.py` exige hitos, subtareas con CA/DoD e IDs de tres capas | Los chequeos existen | `--self-test` → `0 FAIL` | HECHO |
| H2.S2.M2 | **Kill-test** sobre un prompt real | Sale 1 y nombra qué falta | quitar el CA de una subtarea → exit 1 | HECHO |

## H3 — El trabajo queda commiteado y el estado es honesto

**CA:** Dado quien retome, cuando lee el reporte, entonces sabe qué se rehízo, por qué, y qué sigue abierto.
**DoD:** `git status --short` vacío + `REPORTE.md` con las tres secciones.
**Estado:** HECHO

### H3.S1 — Cierre

**CA:** El reporte dice sin rodeos que la entrega anterior incumplía la regla 20.
**DoD:** `plan_status.py` → `REPORTE.md: completo`.
**Estado:** HECHO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H3.S1.M1 | `REPORTE.md` completo | Las tres secciones | `plan_status.py` → `completo` | HECHO |
| H3.S1.M2 | Commit | Árbol limpio | `git status --short` → sin salida | HECHO |

## Riesgos y bloqueos previstos

| Riesgo | Impacto | Mitigación |
|---|---|---|
| Perder contenido técnico al consolidar | **Alto** | El conteo de microtareas del consolidado se compara contra el de los seis lotes: si baja, falla |
| Inventar los CA y DoD de subtarea que faltan | Alto | Se derivan de las microtareas que ya contienen, que están verificadas contra el código. No se inventa alcance nuevo |
| Seis bloques de trabajo en una noche | **Alto** | Registrado como `Q-C1`. Se entrega todo, ordenado por dependencia y con prioridad por hito. **El recorte es decisión del usuario** |
| Que el candado nuevo deje pasar algo otra vez | Medio | Kill-test sobre prompt real, no sobre fixture |
