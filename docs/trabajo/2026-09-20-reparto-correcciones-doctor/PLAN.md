# Plan — Reparto de las 24 correcciones del doctor, turno noche 2026-09-20

- Fecha: 2026-09-20 · Repos afectados: `AlovidaPromptManager` (este; el único que se escribe) ·
  Repos **leídos** para sacar contexto: `alovida/mantra-core-health` (ref `origin/mockup`),
  `alovida/mantra-core-health-api` (ref `origin/dev`), `alovida/mantra-core-health-model`,
  `alovida/mantra_core_technologies_health_docs` · Predecesor:
  [`2026-09-19-requisitos-cliente-y-reparto-completo`](../2026-09-19-requisitos-cliente-y-reparto-completo/)
- Resultado observable: **a las 5 personas del equipo (Pablo, Ender, Itzan, Marcelo, Justin) les
  queda, en `repartos/2026-09-20/PromptNoche/<Persona>/`, un encargo ejecutable que cubre las 24
  correcciones del doctor sin un solo hueco**, con hitos → subtareas → microtareas, CA y DoD con
  comando, alcance IN/OUT, kill-test, ambigüedades registradas y la sección 1 de instalación
  obligatoria del estándar; más el daily de equipo y el daily de cada persona.
- Kill-test: `python tools/check_reparto.py repartos/2026-09-20` sale 0 **y** la tabla de cobertura
  del documento fuente no tiene ninguna fila `C-nn` sin persona, hito y archivo. Si una corrección
  aparece nombrada en el daily pero no en ningún prompt con su `C-nn`, **no está repartida**.

## Alcance

- IN:
  - Transcripción **verbatim** de las 24 correcciones como documento fuente con ficha de
    procedencia, IDs `C-01`…`C-24` y tabla de cobertura (`docs/requisitos/`).
  - Verificación contra el código real de las piezas que cada corrección toca, con archivo y línea,
    contra un corte declarado (`docs/verificacion/`).
  - 5 prompts de tarea (uno por persona), 5 dailies personales, 1 daily de equipo
    (`repartos/2026-09-20/PromptNoche/`).
  - Ejecución de los dos candados del reparto (`check_reparto.py`, `check_skills_citadas.py`) con su
    salida pegada, y el `REPORTE.md` de este trabajo.
  - Entrada nueva en `ActionLog.md`.
- OUT — **no se toca aunque se vea roto**:
  - **Ninguna línea de código de producto.** No se escribe en `mantra-core-health`,
    `mantra-core-health-api`, `mantra-core-health-model` ni en ningún worktree `mch-*`. Este trabajo
    reparte, no implementa. Lo que se encontró roto se anota en el documento de verificación.
  - No se crean ramas, worktrees ni commits en los repos de producto.
  - No se corrigen las skills ni las reglas del estándar (deriva encontrada → se anota).
  - No se decide nada que sea decisión de negocio (ver §Ambigüedades): se registra con dueño.
  - No se reparte el turno día 2026-09-20 (no fue pedido) ni se toca `repartos/2026-09-19/`.
- Ambigüedades registradas: ver la tabla del final. Ninguna se resuelve por conveniencia; cada una
  viaja al prompt de quien la va a tropezar, con el supuesto tomado y a quién confirmárselo.

## H1 — El documento fuente y la verificación contra el código

**CA:** Dado el pedido pegado en la sesión, cuando alguien del equipo quiere saber qué pidió el
doctor exactamente, entonces abre un archivo versionado con el texto **palabra por palabra**, su
procedencia, un ID por corrección y la tabla de qué persona la cubre — sin tener que buscar el chat.

**DoD:** Los dos documentos en disco; `grep -c '^## C-' docs/requisitos/CORRECCIONES-DOCTOR-2026-09-20.md` → **24**; toda afirmación técnica del documento de verificación con archivo y línea.

**Estado:** HECHO

### H1.S1 — Transcripción con procedencia

**CA:** Dada la transcripción, cuando se la compara con el texto pegado, entonces no hay una palabra corregida, ni una tilde agregada, ni una frase completada.

**DoD:** Las 3 microtareas en `HECHO`. La ficha de procedencia declara qué **no** consta, en vez de inventarlo.

**Estado:** HECHO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H1.S1.M1 | Transcribir las 24 correcciones verbatim con IDs `C-01`…`C-24` | Las 24 están, en el orden del original, sin corregir redacción | `grep -c '^## C-' docs/requisitos/CORRECCIONES-DOCTOR-2026-09-20.md` → 24 | HECHO |
| H1.S1.M2 | Escribir la ficha de procedencia y lo que **no** consta | Fecha, autor y versión del original declarados como «no consta» donde no consta | Sección «Ficha de procedencia» presente | HECHO |
| H1.S1.M3 | Registrar las ambigüedades del propio documento fuente | Cada una con supuesto y a quién confirmar | Tabla `Q-D*` presente | HECHO |

### H1.S2 — Verificación contra el código real

**CA:** Dada una corrección, cuando alguien pregunta dónde vive hoy lo que hay que cambiar, entonces el documento de verificación lo dice con archivo y línea sobre un corte declarado.

**DoD:** Las 4 microtareas en `HECHO`. Cero afirmaciones sin localizador. El corte declarado con su SHA.

**Estado:** HECHO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H1.S2.M1 | Fijar y declarar el corte del frontend que corresponde a la maqueta desplegada | Hay SHA, fecha y rama, y está dicho por qué ese y no el del working copy | SHA `68969782…` de `origin/mockup` pegado en el documento | HECHO |
| H1.S2.M2 | Confirmar que la maqueta corre **sin backend** y con qué interruptor | Está el archivo y la línea del interruptor | `mockBackend: true` citado con ruta | HECHO |
| H1.S2.M3 | Localizar, corrección por corrección, el archivo real que toca | Las 24 tienen al menos un localizador, o dicen explícitamente «sin localizador: exige descubrimiento del asignado» | Tabla de localización completa | HECHO |
| H1.S2.M4 | Registrar los choques con el contrato real de la API y con las reglas de la casa | Cada choque con la regla que lo prohíbe y la salida propuesta | Sección «Choques» presente | HECHO |

### H1.S3 — La tabla de cobertura

**CA:** Dada la tabla, cuando se la lee, entonces cada `C-nn` tiene persona, lote, hito y archivos reservados; y ninguna persona comparte archivo con otra.

**DoD:** Las 2 microtareas en `HECHO`. 24 filas, cero vacíos.

**Estado:** HECHO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H1.S3.M1 | Asignar las 24 correcciones a las 5 personas sin huecos ni solapamientos | Cada `C-nn` tiene dueño; las correcciones transversales tienen dueño del patrón y aplicadores | Tabla de cobertura con 24 filas | HECHO |
| H1.S3.M2 | Declarar la reserva de archivos por persona | Ninguna ruta reservada aparece en dos personas | Tabla de reservas | HECHO |

## H2 — Los cinco encargos

**CA:** Dado cualquiera de los cinco prompts, cuando la persona lo abre, entonces puede empezar sin preguntar nada: sabe qué instalar, qué skills cargar, qué corte leer, qué archivos son suyos, qué NO tocar, qué comando demuestra cada microtarea y qué hacer si se queda sin el insumo de otro.

**DoD:** `python tools/check_reparto.py repartos/2026-09-20` → exit 0. `python tools/check_skills_citadas.py` → exit 0. Cada prompt con 6 hitos, 18 subtareas y ≥ 50 microtareas.

**Estado:** HECHO

### H2.S1 — Los prompts de la capa de agenda y de receta

**CA:** Dados los prompts de Pablo y Justin, cuando se los revisa, entonces cada corrección que cubren está citada por su `C-nn` y su microtarea correspondiente.

**DoD:** Las 2 microtareas en `HECHO`, con el prompt en disco y el candado en verde.

**Estado:** HECHO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H2.S1.M1 | Escribir el encargo de Pablo (agenda y consultas: C-04, C-07, C-08, C-10, C-11, C-12-UI, C-13-UI) | 6 hitos, 18 subtareas, ≥ 50 microtareas; las 7 correcciones citadas por ID | `python tools/check_reparto.py repartos/2026-09-20` sin señalar ese archivo | HECHO |
| H2.S1.M2 | Escribir el encargo de Justin (receta: C-15 a C-22) | Ídem, con las 8 correcciones citadas | Ídem | HECHO |

### H2.S2 — Los prompts del sistema de diseño, los contratos y el expediente

**CA:** Dados los prompts de Itzan, Ender y Marcelo, cuando se los revisa, entonces las correcciones transversales (C-06, C-09, C-21) tienen dueño del patrón declarado y el resto del equipo tiene dicho que las aplica en sus propios archivos.

**DoD:** Las 3 microtareas en `HECHO`.

**Estado:** HECHO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H2.S2.M1 | Escribir el encargo de Itzan (perfil y sistema de diseño: C-01, C-02, C-05, C-06, C-09, C-21) | Ídem, con el inventario medido como microtarea y no como impresión | `check_reparto.py` sin señalarlo | HECHO |
| H2.S2.M2 | Escribir el encargo de Ender (contratos, catálogos y panel: C-03, C-12, C-13, C-20, C-24) | Ídem, con el gate de dato clínico inventado explícito (regla 97.5.4) | Ídem | HECHO |
| H2.S2.M3 | Escribir el encargo de Marcelo (expediente y aceptación: C-14, C-23 + dictamen del lote) | Ídem, con la norma exigida **con procedencia** y no de memoria | Ídem | HECHO |

### H2.S3 — Dailies

**CA:** Dado el reparto, cuando alguien busca dónde anotar su avance, entonces tiene su daily personal creado y el daily de equipo con la tabla de quién tiene qué.

**DoD:** Las 2 microtareas en `HECHO`; `check_reparto.py` no reclama ningún daily faltante.

**Estado:** HECHO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H2.S3.M1 | Crear los 5 dailies personales con su plantilla de cierre | Los 5 existen con el nombre exacto que exige la convención | `check_reparto.py` sin «FALTA el daily personal» | HECHO |
| H2.S3.M2 | Crear el daily de equipo con cobertura, dependencias, reservas y ambigüedades | Tiene las 5 filas, las 24 correcciones y la tabla de reservas | `check_reparto.py` sin «FALTA el daily de equipo» | HECHO |

## H3 — Cierre verificado del reparto

**CA:** Dado el reparto terminado, cuando se corren los candados, entonces los dos salen en verde y el número de cobertura está **medido**, no afirmado.

**DoD:** Salida literal de los dos candados pegada en `evidencia/`, más el conteo de correcciones cubiertas. `REPORTE.md` escrito.

**Estado:** HECHO

### H3.S1 — Los candados

**CA:** Dada la estructura, cuando se la revisa con el script, entonces no falta ninguna pieza obligatoria de ningún prompt.

**DoD:** Las 2 microtareas en `HECHO`, con exit code pegado.

**Estado:** HECHO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H3.S1.M1 | Correr el candado de estructura del reparto | Exit 0 | `python tools/check_reparto.py repartos/2026-09-20` → salida en `evidencia/check-reparto.txt` | HECHO |
| H3.S1.M2 | Correr el candado de skills citadas | Exit 0 | `python tools/check_skills_citadas.py` → salida en `evidencia/check-skills.txt` | HECHO |

### H3.S2 — La medición de cobertura

**CA:** Dada la afirmación «están las 24», cuando se la audita, entonces sale de un comando y no de una lectura a ojo.

**DoD:** Las 2 microtareas en `HECHO`, con la salida del conteo pegada.

**Estado:** HECHO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H3.S2.M1 | Medir que cada `C-nn` aparece en al menos un prompt | Las 24 aparecen; cero ausencias | Script de conteo con su salida en `evidencia/cobertura.txt` | HECHO |
| H3.S2.M2 | Medir que cada prompt trae la sección 1 del estándar y la cuenta de capas | 5 de 5 | Conteo en `evidencia/cobertura.txt` | HECHO |

### H3.S3 — Reporte y registro

**CA:** Dado el cierre, cuando alguien que no vio la sesión abre el trabajo, entonces sabe qué quedó hecho, qué quedó a medias y qué decisiones de negocio siguen abiertas.

**DoD:** Las 2 microtareas en `HECHO`.

**Estado:** HECHO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H3.S3.M1 | Escribir el `REPORTE.md` con las tres secciones obligatorias | Completado / A medias / Pendiente presentes, con avance en la primera línea | Archivo en disco | HECHO |
| H3.S3.M2 | Anotar la entrada en `ActionLog.md` | Entrada nueva arriba, con enlaces | Archivo modificado | HECHO |

## Riesgos y bloqueos previstos

| Riesgo | Impacto | Mitigación |
|---|---|---|
| El corte de la maqueta desplegada no es el que fijé (`origin/mockup` se mueve) | Todo localizador podría apuntar a otra línea | Cada prompt manda **reconsultar y declarar** el corte en su primera microtarea; los localizadores se declaran «al corte 68969782…», no como verdad permanente |
| Tres correcciones son transversales (C-06, C-09, C-21) y las tocan los cinco | Dos personas escribiendo el mismo archivo | Dueño del patrón declarado (Itzan) + aplicación en archivos reservados de cada uno; tabla de reservas en el daily |
| C-20 pide frecuencia «de fábrica» por medicamento, y el vademécum del repo declara no tener fuente autoritativa | Inventar dato clínico (regla 97.5.4) | El prompt separa **mecanismo** de **dato**: el mecanismo se implementa, el dato se declara sintético con procedencia, siguiendo el precedente B-13 |
| C-23 pide «según norma» y la norma no está en el repo | Inventar requisitos normativos | El prompt exige cita con fuente, referencia y fecha, o `UNKNOWN` declarado; prohibido escribir un campo «porque suena a norma» |
| 5 × ~54 microtareas no entran en una noche | Cierres falsos | Dicho en el daily y en cada prompt: lo que no cierra va `A MEDIAS` con las cuatro respuestas; recortar es decisión de coordinación |

## Ambigüedades registradas

| ID | Ambigüedad | Supuesto tomado | A quién confirmar |
|---|---|---|---|
| Q-D1 | El pedido no dice sobre qué rama se aplica. La maqueta que las URLs muestran corre `mockBackend: true`, o sea la rama `mockup` | Se reparte **sobre `origin/mockup`**, y cada prompt lo declara; lo que haya que llevar a `dev` es decisión posterior de coordinación | Pablo / coordinación |
| Q-D2 | «Turno noche» se asume por «los carriles de esta noche» | Se crea sólo `PromptNoche/`, no `PromptDia/` | Pablo |
| Q-D3 | C-06 («todos los botones con icono + texto») choca con una decisión de propietario del 2026-09-13, escrita en el código, que puso los botones de fila sólo-icono justo para que la fila no creciera a tres renglones | Gana el pedido nuevo, y por eso C-06 manda el desplegable: resuelve el alto de fila **y** devuelve el texto. Se registra como desvío explícito, no como descubrimiento | Doctor / propietario |
| Q-D4 | C-18 y C-22 parecen ya cumplidos en el corte (el motivo libre y la opcionalidad existen) | No se declara hecho: cada prompt manda **verificarlo en el navegador primero** y, si ya está, cerrar la microtarea como `DESCARTADO` con la evidencia — nunca como `HECHO` sin ejercitarla | Doctor |
| Q-D5 | C-24 pide «los colores no coinciden» sin decir con qué | Se toma como que el panel no usa los mismos tonos semánticos que la agenda para los mismos estados; el prompt exige capturas de los dos lados antes de tocar | Doctor |
| Q-D6 | C-12 pide un bloqueo con razón «OTROS SERVICIOS», y el contrato real tiene una lista cerrada de 7 motivos que no la incluye | Se usa `OTHER` con el texto «Otros servicios» (no rompe contrato) y se registra la opción de ampliar el enum como decisión de negocio | Ender + negocio |
| Q-D7 | C-14 exige «una fila por sesión» y que las filas anteriores «se carguen» para las siguientes. No dice si la fila anterior se muestra editable o en sólo lectura | Se asume **sólo lectura** para las de sesiones anteriores, editable sólo la de la sesión en curso | Doctor |
