# Plan — Plan maestro y reparto de las correcciones del doctor y del paciente, noche 2026-09-22

- Fecha: 2026-09-22 · Repos afectados: `AlovidaPromptManager` (este; el único que se escribe) ·
  Repos **leídos** para sacar contexto: `alovida/mantra-core-health` (refs `origin/mockup` y
  `origin/dev`, traídos con `git fetch` a pedido), `alovida/mantra-core-health-api` (ref `origin/dev`) ·
  Predecesores: [`2026-09-20-reparto-correcciones-doctor`](../2026-09-20-reparto-correcciones-doctor/)
  (24 correcciones, C-01…C-24) y [`2026-09-21-reparto-refactor-frontend`](../2026-09-21-reparto-refactor-frontend/)
  (5 carriles de refactorización).
- Resultado observable: **las 5 personas del equipo (Pablo, Ender, Itzan, Marcelo, Justin) abren
  `repartos/2026-09-22/PromptNoche/<Persona>/` y encuentran un encargo ejecutable que, sumado a los
  otros cuatro, cubre las 19 observaciones nuevas (10 del doctor, 3 del flujo de reserva, 3 de la
  pantalla de inicio del paciente, 3 del menú lateral) sin un solo hueco**, con hitos → subtareas →
  microtareas, CA y DoD con comando, reserva de archivos disjunta, y un plan maestro que explica el
  orden y las dependencias entre carriles. Además, Pablo tiene un documento fuente verbatim y una
  verificación contra el corte real para no repartir suposiciones.
- Kill-test: `python tools/check_reparto.py repartos/2026-09-22` sale distinto de 0, **o** la tabla de
  cobertura del documento fuente tiene una fila `D-/R-/P-/N-nn` sin persona, hito o archivo, **o** dos
  prompts se reservan el mismo archivo. Cualquiera de las tres demuestra que el reparto NO está hecho.

## Alcance

- IN:
  - Transcripción **verbatim** de las observaciones como documento fuente con ficha de procedencia,
    IDs `D-01…D-10`, `R-01…R-03`, `P-01…P-03`, `N-01…N-03` y tabla de cobertura (`docs/requisitos/`).
  - Verificación contra el código real de lo que cada observación toca, con archivo y línea, sobre
    un corte declarado de `origin/mockup` (`docs/verificacion/`).
  - Un **plan maestro** (hitos y subtareas por observación, dueño, dependencias, orden y kill-test)
    en este mismo directorio, que no duplica las microtareas: éstas viven en cada prompt.
  - 5 prompts de tarea (uno por persona), 5 dailies personales, 1 daily de equipo
    (`repartos/2026-09-22/PromptNoche/`).
  - Ejecución de los dos candados del reparto y de un script de cobertura y de intersección de
    reservas, con salida pegada en `evidencia/`, y el `REPORTE.md` de este trabajo.
  - Entrada nueva en `ActionLog.md` y una nota de memoria con la guía de trabajo que el doctor pidió
    adoptar «a partir de ahora» (D-04 y D-08).
- OUT — **no se toca aunque se vea roto**:
  - **Ninguna línea de código de producto.** No se escribe en `mantra-core-health`,
    `mantra-core-health-api`, `mantra-core-health-model` ni en ningún worktree `mch-*`. Este trabajo
    reparte, no implementa.
  - No se crean ramas, worktrees ni commits en los repos de producto. Los `git fetch` de
    `origin/dev` y `origin/mockup` sólo actualizan refs remotos; el working copy queda como estaba.
  - No se corrigen skills ni reglas del estándar (deriva encontrada → se anota).
  - No se decide nada que sea decisión de negocio o de diseño del cliente: se registra con dueño.
  - No se reparte el turno día ni se reasigna lo repartido el 2026-09-21 (esos carriles siguen
    siendo de quien los tiene; acá sólo se **suman** archivos sin intersección).
  - No se ejecuta nada del frontend: ni `yarn start`, ni tests, ni capturas. Peldaño de todo hecho
    técnico de este trabajo: `DISCOVERED`.
- Ambigüedades registradas: ver la tabla del final. Ninguna se resuelve por conveniencia; cada una
  viaja al prompt de quien la va a tropezar, con el supuesto tomado y a quién confirmárselo.

## H1 — El documento fuente y la verificación contra el código

**CA:** Dado el pedido pegado en la sesión, cuando alguien del equipo quiere saber qué pidió el doctor
exactamente y dónde vive en el código, entonces abre dos archivos versionados: el texto palabra por
palabra con un ID por observación, y la localización con archivo y línea sobre un SHA declarado.

**DoD:** `grep -cE '^## (D|R|P|N)-' docs/requisitos/CORRECCIONES-DOCTOR-Y-PACIENTE-2026-09-22.md` → **19**;
toda afirmación técnica del documento de verificación con archivo y línea o con el comando que la produjo.

**Estado:** HECHO

### H1.S1 — Transcripción con procedencia

**CA:** Dada la transcripción, cuando se la compara con el texto pegado, entonces no hay una palabra
corregida, ni una tilde agregada, ni una frase completada; sólo se agregó el ID y el encabezado.

**DoD:** Las 3 microtareas en `HECHO`. La ficha de procedencia declara qué **no** consta.

**Estado:** HECHO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H1.S1.M1 | Transcribir las 19 observaciones verbatim con IDs `D-01…D-10`, `R-01…R-03`, `P-01…P-03`, `N-01…N-03` | Las 19 están, en el orden del original, sin corregir redacción; los dos bloques sin número del original quedan declarados como tales | `grep -cE '^## (D\|R\|P\|N)-' docs/requisitos/CORRECCIONES-DOCTOR-Y-PACIENTE-2026-09-22.md` → 19 | HECHO |
| H1.S1.M2 | Escribir la ficha de procedencia y lo que **no** consta | Fecha, autor y versión del original declarados como «no consta» donde no consta | Sección «Ficha de procedencia» presente | HECHO |
| H1.S1.M3 | Registrar las ambigüedades del propio documento fuente | Cada una con supuesto y a quién confirmar | Tabla `Q-*` presente, ≥ 12 filas | HECHO |

### H1.S2 — Verificación contra el código real

**CA:** Dada una observación, cuando alguien pregunta dónde vive hoy lo que hay que cambiar, entonces
el documento lo dice con archivo y línea sobre un corte declarado, y declara los choques con el
contrato real y con decisiones previas escritas en el código.

**DoD:** Las 3 microtareas en `HECHO`. Cero afirmaciones sin localizador. Tres SHAs declarados.

**Estado:** HECHO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H1.S2.M1 | Declarar los cortes: `origin/mockup`, `origin/dev` del front y `origin/dev` de la API, con fecha | Tres SHAs completos con fecha y asunto | `git log -1 --format='%H %ad %s' origin/mockup` (y los otros dos) pegados en el §0 | HECHO |
| H1.S2.M2 | Localizar, observación por observación, el archivo y la línea que toca | Las 19 tienen al menos un localizador, o dicen «sin localizador: exige descubrimiento del asignado» | Tabla de localización completa | HECHO |
| H1.S2.M3 | Registrar los choques con el contrato real de la API y con decisiones previas del propietario | Cada choque con la regla que lo prohíbe y la salida propuesta | Sección «Choques y hallazgos» presente | HECHO |

### H1.S3 — La tabla de cobertura y las reservas

**CA:** Dada la tabla, cuando se la lee, entonces cada ID tiene persona, hito y archivos reservados;
y ninguna persona comparte archivo con otra ni con un carril del 2026-09-21 que no sea suyo.

**DoD:** Las 2 microtareas en `HECHO`. 19 filas, cero vacíos, intersección vacía.

**Estado:** HECHO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H1.S3.M1 | Asignar las 19 observaciones a las 5 personas sin huecos ni solapamientos | Cada ID tiene dueño; las transversales tienen dueño del patrón y aplicadores nombrados | Tabla de cobertura con 19 filas | HECHO |
| H1.S3.M2 | Declarar la reserva de archivos por persona, cruzada con las reservas vigentes del 2026-09-21 | Ninguna ruta reservada aparece en dos personas | Tabla de reservas + `evidencia/reserva-disjunta.txt` | HECHO |

## H2 — El plan maestro

**CA:** Dado el plan maestro, cuando Pablo quiere saber en qué orden conviene ejecutar, quién destraba a
quién y cómo se demuestra cada observación, entonces lo lee en un solo archivo sin abrir los cinco
prompts.

**DoD:** `PLAN-MAESTRO.md` en este directorio con un hito por observación (o por grupo transversal),
sus subtareas con CA y DoD, dueño, dependencia y kill-test; y cada `H*.S*` referenciado existe en el
prompt de su dueño.

**Estado:** HECHO

### H2.S1 — Hitos, dependencias y kill-tests

**CA:** Dado cualquier ID de observación, cuando se lo busca en el plan maestro, entonces aparece con
su hito, su dueño, de qué depende y qué comprobación barata demuestra que NO está hecho.

**DoD:** Las 3 microtareas en `HECHO`.

**Estado:** HECHO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H2.S1.M1 | Escribir un hito por observación (o por patrón transversal) con dueño, CA y DoD | 19 IDs cubiertos por hitos con dueño | `grep -cE '^\| (D\|R\|P\|N)-[0-9]+' PLAN-MAESTRO.md` → ≥ 19 | HECHO |
| H2.S1.M2 | Escribir el orden de dependencias entre carriles (quién publica qué y cuándo) | Hay grafo o tabla con «espera / de quién / qué / mientras tanto» | Sección «Dependencias» presente | HECHO |
| H2.S1.M3 | Escribir un kill-test por observación | 19 kill-tests | `grep -c 'Kill-test' PLAN-MAESTRO.md` → ≥ 19 | HECHO |

## H3 — Los cinco encargos

**CA:** Dado cualquiera de los cinco prompts, cuando la persona lo abre, entonces puede empezar sin
preguntar nada: sabe qué instalar, qué skills cargar, qué corte leer, qué archivos son suyos, qué NO
tocar, qué comando demuestra cada microtarea y qué hacer si se queda sin el insumo de otro.

**DoD:** `python tools/check_reparto.py repartos/2026-09-22` → exit 0.
`python tools/check_skills_citadas.py` → exit 0. Cada prompt con ≥ 5 hitos y ≥ 40 microtareas.

**Estado:** HECHO

### H3.S1 — Los cinco prompts

**CA:** Dado cada prompt, cuando se lo revisa, entonces cada observación que cubre está citada por su
ID en una microtarea concreta, y las ambigüedades que le tocan están en su tabla.

**DoD:** Las 5 microtareas en `HECHO`, con el prompt en disco y el candado en verde.

**Estado:** HECHO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H3.S1.M1 | Prompt de **Itzan** — el perfil del médico: D-01, D-02, D-03, D-06 (patrón), D-07, D-08 (aplicación en «Configurar tu perfil»), D-09, D-10, N-03 | Las 9 citadas por ID | `check_reparto.py` sin señalar ese archivo | HECHO |
| H3.S1.M2 | Prompt de **Pablo** — la disciplina de tablas y modales como patrón de la casa: D-04, D-05 (patrón), D-08 (patrón) y su aplicación en «Dónde atiendo», D-06 (aplicación) | Las 4 citadas por ID | ídem | HECHO |
| H3.S1.M3 | Prompt de **Justin** — el flujo de reserva y las cotizaciones del paciente: R-01, R-02 (UI), N-02 | Las 3 citadas por ID | ídem | HECHO |
| H3.S1.M4 | Prompt de **Ender** — el simulador, la cabecera y el menú: R-02 (latencia), R-03, N-01, D-05 (en la cabecera), y los cambios de menú que N-02 y N-03 le piden | Las 5 citadas por ID | ídem | HECHO |
| H3.S1.M5 | Prompt de **Marcelo** — la pantalla de inicio del paciente y los diálogos de confirmación: P-01, P-02, P-03, D-08 (el modal de confirmación, como dueño de `content-dialog`) | Las 4 citadas por ID | ídem | HECHO |

### H3.S2 — Dailies

**CA:** Dado el reparto, cuando alguien busca dónde anotar su avance, entonces tiene su daily personal
creado y el daily de equipo con la tabla de quién tiene qué, las dependencias y las reservas.

**DoD:** Las 2 microtareas en `HECHO`; `check_reparto.py` no reclama ningún daily faltante.

**Estado:** HECHO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H3.S2.M1 | Crear los 5 dailies personales con su plantilla de cierre | Los 5 existen con el nombre exacto de la convención | `ls repartos/2026-09-22/PromptNoche/*/*-Daily-Noche-2026-09-22.md \| wc -l` → 5 | HECHO |
| H3.S2.M2 | Crear el daily de equipo con cobertura, dependencias, reservas y ambigüedades | Tiene las 5 filas, las 19 observaciones y la tabla de reservas | `check_reparto.py` sin «FALTA el daily de equipo» | HECHO |

## H4 — Cierre verificado

**CA:** Dado el reparto terminado, cuando se corren los candados y los scripts de medición, entonces
todo sale en verde y el número de cobertura está **medido**, no afirmado; y alguien que no vio la
sesión sabe qué quedó hecho, qué decisiones siguen abiertas y qué no se verificó.

**DoD:** Salida literal de los candados y de los scripts en `evidencia/`. `REPORTE.md` escrito.
`ActionLog.md` con la entrada nueva. Memoria escrita.

**Estado:** HECHO

### H4.S1 — Los candados y las mediciones

**CA:** Dada la estructura, cuando se la revisa con los scripts, entonces no falta ninguna pieza
obligatoria de ningún prompt, ninguna skill citada es inexistente, las 19 tienen dueño y ningún
archivo está reservado dos veces.

**DoD:** Las 4 microtareas en `HECHO`, con exit code pegado.

**Estado:** HECHO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H4.S1.M1 | Correr el candado de estructura del reparto | Exit 0 | `python tools/check_reparto.py repartos/2026-09-22` → `evidencia/check-reparto.txt` | HECHO |
| H4.S1.M2 | Correr el candado de skills citadas | Exit 0 | `python tools/check_skills_citadas.py` → `evidencia/check-skills.txt` | HECHO |
| H4.S1.M3 | Medir que cada ID aparece en al menos un prompt y contar las capas por prompt | 19/19 con dueño; 5/5 con la sección 1 | script → `evidencia/cobertura.txt` | HECHO |
| H4.S1.M4 | Medir que ningún archivo está reservado dos veces | 0 choques | script → `evidencia/reserva-disjunta.txt` | HECHO |

### H4.S2 — Reporte, registro y memoria

**CA:** Dado el cierre, cuando alguien que no vio la sesión abre el trabajo, entonces sabe qué quedó
hecho, qué quedó a medias, qué decisiones de negocio siguen abiertas y qué no se verificó.

**DoD:** Las 3 microtareas en `HECHO`.

**Estado:** HECHO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H4.S2.M1 | Escribir el `REPORTE.md` con las tres secciones obligatorias y el avance en la primera línea | Completado / A medias / Pendiente presentes | `head -3 REPORTE.md` muestra `AVANCE:` | HECHO |
| H4.S2.M2 | Anotar la entrada en `ActionLog.md` | Entrada nueva arriba, con enlaces | `head -20 ActionLog.md` | HECHO |
| H4.S2.M3 | Guardar en memoria la guía de trabajo que el doctor pidió adoptar (D-04 y D-08), como feedback | Archivo de memoria + línea en `MEMORY.md` | `grep -c 'tabla' MEMORY.md` ≥ 1 | HECHO |

## Riesgos y bloqueos previstos

| Riesgo | Impacto | Mitigación |
|---|---|---|
| `origin/mockup` se mueve durante la noche (hoy mismo entraron #570 y #573) y los localizadores envejecen | Cinco personas buscando líneas corridas | Cada prompt manda **reconsultar y declarar** el corte propio en su primera microtarea; los localizadores se declaran «al corte `b655e844…`» |
| Tres observaciones son transversales (D-04/D-08 disciplina de tabla, D-05 icono + nombre, D-06 mapa) y las tocan los cinco | Dos personas escribiendo el mismo archivo | Dueño del patrón declarado (Pablo para tabla y botones, Itzan para el mapa) + aplicación en archivos reservados de cada uno |
| D-08 pide números de página y selects, y el organismo de tabla pagina **por cursor** por decisión documentada (`CONTRATO-data-table.md` §10.2) | Reescribir un contrato con 30 consumidores «para cumplir» | Se separa: paginación en cliente con `app-pagination` para listas locales; el cursor se conserva donde la API lo impone; ambigüedad Q-5 registrada con dueño |
| N-02 (cotizaciones por precio y cercanía) exige precios de servicios médicos e imagenología que el simulador no tiene con procedencia (el arancel del Colegio está en UMA, sin conversión declarada) | Inventar precios y presentarlos como reales (regla 97.4.1) | El prompt separa **mecanismo** de **dato**: el buscador se implementa; el precio sin fuente se declara sintético o «no publicado», nunca se inventa |
| P-02 pide voz: `SpeechRecognition` no existe en todos los navegadores ni bajo SSR | Un botón que promete y falla | Mismo criterio que `app-grabador`: sin soporte, el botón no aparece; se declara qué navegadores se probaron |
| 5 × ~50 microtareas no entran en una noche | Cierres falsos | Dicho en el daily y en cada prompt: lo que no cierra va `A MEDIAS` con las cuatro respuestas; recortar es decisión de coordinación |
| Los carriles del 2026-09-21 de Itzan, Ender y Marcelo siguen abiertos (0/N en sus dailies) | Dos encargos vivos por persona | El daily de equipo lo dice: el de esta noche **manda** por ser pedido del cliente; el otro queda `A MEDIAS` declarado, no abandonado |

## Ambigüedades registradas

Las ambigüedades del pedido (`Q-1…Q-16`) viven en el documento fuente
[`CORRECCIONES-DOCTOR-Y-PACIENTE-2026-09-22.md`](../../requisitos/CORRECCIONES-DOCTOR-Y-PACIENTE-2026-09-22.md)
con supuesto y dueño, y en el prompt de quien las tropieza. Las tres propias de **este** trabajo:

| ID | Ambigüedad | Supuesto tomado | A quién confirmar |
|---|---|---|---|
| Q-T1 | El pedido no dice sobre qué rama aplica | **`origin/mockup`** — confirmado por Pablo en la sesión (las observaciones vienen de la maqueta); `origin/dev` se lee para citar contratos y el gap mockup→dev queda declarado | Pablo — **confirmado** |
| Q-T2 | ¿Plan único o reparto? | **Plan maestro + reparto a las 5 personas** — confirmado por Pablo en la sesión | Pablo — **confirmado** |
| Q-T3 | ¿Turno día o noche? | **Noche** — confirmado por Pablo; la hora local al armar el reparto es 18:14 del 2026-09-22 | Pablo — **confirmado** |
