# La cuadrícula de notas, la internación según norma, y el dictamen del lote

> **Rol:** propietario del expediente clínico (notas e internación) y de la aceptación del lote · **Línea:** B · **Fecha:** 2026-09-20 · **Turno:** noche
> **Fuente del pedido:** [`CORRECCIONES-DOCTOR-2026-09-20.md`](../../../../../docs/requisitos/CORRECCIONES-DOCTOR-2026-09-20.md) · **Verificación contra el código:** [`VERIFICACION-CONTRA-CODIGO-2026-09-20.md`](../../../../../docs/verificacion/VERIFICACION-CONTRA-CODIGO-2026-09-20.md)
> **Correcciones que cubrís: C-14, C-23** — más el **dictamen de aceptación de las 24**.
> **6 hitos · 18 subtareas · 54 microtareas**, todas con criterio de aceptación y Definition of Done.

> ### 🔑 Tu lote tiene dos mitades muy distintas, y conviene no mezclarlas
>
> **La primera es construcción con una brecha de contrato adelante:** C-14 y C-23 piden cosas que el
> modelo de hoy **no tiene dónde guardar**. Eso no te bloquea (regla 65): se nombra el contrato, se
> simula en sus tres niveles y se cierra contra el doble, **declarando** que se cerró así y dejando la
> brecha registrada para quien sea dueño del modelo.
>
> **La segunda es aceptación del lote entero:** H6 mira las 24 correcciones, no sólo las tuyas, y
> emite un dictamen. Ahí **no editás el código de nadie**: ejercitás, capturás y dictaminás. Regla
> 70.4.8: la verificación no la hace quien escribió el código, y por eso este hito es tuyo.

## 0. Ficha de asignación

| Campo | Valor |
|---|---|
| `REPO` | `alovida/mantra-core-health` (frontend Angular). El repo de la API y el del modelo se **leen**, no se escriben |
| `TARGET_REF` | `origin/mockup` — corte leído **`689697821a6e6d2c8f702c7508d6728fa9a1869a`** (PR #554, 2026-09-20T12:32-04). **Reconsultalo y fijá el tuyo** |
| `RAMA DE TRABAJO` | Una tuya, saliendo de `origin/mockup`. **Nada directo sobre `mockup`, nada sin PR** |
| `ARCHIVOS RESERVADOS PARA VOS` | `src/app/features/clinical-record/patient-chart/free-note-block/**` · `.../admission-block/**` · `src/app/features/clinical-record/consultation/**` |
| `ARCHIVOS DE OTROS — NO LOS TOQUES` | `patient-chart/medication-block/**` (Justin: **te va a pedir un cambio en `consultation.html`, que es tuyo**) · `features/agenda/**` y `my-services/**` (Pablo) · `src/app/shared/**` y `account/my-profile/**` (Itzan) · `core/mock/**`, `features/dashboard/**`, `core/data-access/**` (Ender) |
| `LA MAQUETA NO TIENE BACKEND` | `mockBackend: true` fijo en `src/environments/environment.ts`. Lo que necesites guardar **lo pedís a Ender**: `core/mock/**` es suyo |
| `CUENTA DE PRUEBA` | `medica@alovida.mock`, `paciente@alovida.mock`. **Sintéticas declaradas** |
| `LÍMITE DE RECURSOS` | Regla 70: un `yarn start`, un build, un navegador, Playwright `--workers=1` |

## 1. Antes de escribir una línea — instalación OBLIGATORIA del estándar

> **Esta sección no es opcional y no es el final del día: es lo primero.** Un prompt ejecutado sin
> el estándar cargado produce trabajo que después hay que rehacer, porque no va a tener plan, ni
> evidencia, ni reporte. **Si no podés completar este paso, estás `BLOQUEADO`: avisalo y no sigas.**

### 1.1 Instalar el estándar en tu checkout

```bash
# 1. Clonar el estandar al lado del repo de producto
git clone https://github.com/PabloArauzCaballero/AlovidaPromptManager.git ../AlovidaPromptManager

# 2. Copiarlo DENTRO de tu checkout de trabajo (Claude Code solo carga desde ./.claude/)
cp -r ../AlovidaPromptManager/.claude   ./
cp    ../AlovidaPromptManager/AGENTS.md ./
cp -r ../AlovidaPromptManager/.agents   ./   # solo si tu herramienta no lee .claude/

# 3. Verificar que quedo instalado (pega esta salida en tu daily)
ls .claude/skills | wc -l            # -> 176
ls .claude/rules/[0-9]*.md | wc -l   # -> 14  (mas el README, que no es una regla)
python .claude/hooks/plan_gate.py --self-test    # -> 11 PASS, 0 FAIL
```

**Si el `git clone` falla con 404:** el estándar todavía no está publicado. Pedíselo a Pablo por
copia directa y registralo como límite de acceso. **Un 404 no demuestra que el repositorio no exista.**

### 1.2 Qué te instala eso

| Candado | Qué impide |
|---|---|
| `plan_gate.py` | Escribir código sin `PLAN.md` en disco. Nunca bloquea `.md` ni nada bajo `docs/` |
| `report_gate.py` | Cerrar la sesión con trabajo activo y sin `REPORTE.md`, o sin sus tres secciones |
| `blocker_gate.py` | Cerrar con microtareas en `BLOQUEADO` o `EN CURSO` sin declarar la simulación de los tres niveles del contrato (regla 65) |

**En cualquier otra herramienta los candados NO corren.** El plan y el reporte siguen siendo igual de
obligatorios.

### 1.3 Skills que tenés que CARGAR para este lote

Son **27**: 11 del proceso y 16 propias del expediente y de la aceptación.

**Del proceso — obligatorias para todos:**

| Skill | Para qué |
|---|---|
| `skills-router` | la entrada al catalogo: mapea la situacion concreta a la skill que toca |
| `factual-discovery` | confirmar el sistema real antes de planificar |
| `milestone-planning` | descomponer en hitos, subtareas y microtareas con CA y DoD |
| `anti-hallucination-guard` | localizar lo existente antes de crear; no inventar APIs de terceros |
| `evidence-and-verification` | que podes afirmar con que evidencia |
| `scope-discipline` | no tocar nada fuera del alcance declarado |
| `rationalization-guard` | las excusas tipicas para saltear una verificacion, y su contramedida |
| `context-thrift` | leer por rangos y busqueda, no archivos enteros |
| `progress-reporting` | checkpoints visibles en cada apertura y cierre de microtarea |
| `finish-your-turn` | como se cierra un turno sin dejar nada colgado |
| `work-report-md` | como se redacta el reporte de cierre |

**De tu lote:**

| Skill | Para qué |
|---|---|
| `clinical-records` | **la primera de tu lote**: encuentro, episodio, qué se registra dentro de cuál y qué no se toca |
| `regulatory-compliance-mapping` | cómo se mapea un requisito normativo a un campo, con su fuente |
| `healthcare-interoperability-fhir` | si la hoja de admisión tiene un recurso estándar detrás, es mejor que inventar uno |
| `audit-trail-history` | quién, qué, cuándo: una internación y una nota dejan rastro |
| `data-privacy-phi` | **gate obligatorio**: ningún dato de paciente en logs, capturas, reportes ni URLs |
| `model-driven-schema` | la dirección única del cambio de esquema, si hace falta una columna nueva |
| `data-modeling-plantuml` | cómo se propone una estructura nueva sin escribirla en la base |
| `frontend-data-tables` | una cuadrícula que se pueda usar en móvil sin perder las acciones |
| `angular-forms` | reactive forms tipados, validadores, errores por campo |
| `frontend-forms-ux` | qué se preserva ante un fallo y cómo se explica una restricción |
| `requirements-and-acceptance` | criterio de aceptación en dado/cuando/entonces, verificable |
| `uat-acceptance-signoff` | qué es una aceptación firmada y qué la invalida |
| `qa-evidence-reporting` | el reporte de evidencia de una campaña de pruebas |
| `exploratory-testing` | recorrer con intención, no hacer clic al azar |
| `bug-reporting-standard` | un defecto que nadie puede reproducir no está reportado |
| `visual-proof` | la captura no vale si no la mirás |

Entrá siempre por `skills-router`: **no leas el catálogo entero, no sirve.**

### 1.4 DoD de esta sección — se verifica como cualquier otra

- [ ] `ls .claude/skills | wc -l` devolvió **176**, y la salida está pegada en tu daily.
- [ ] `python .claude/hooks/plan_gate.py --self-test` devolvió **11 PASS, 0 FAIL**, salida pegada.
- [ ] Leíste `skills-router` y las 27 skills de las dos tablas, **empezando por `clinical-records` y `data-privacy-phi`**.
- [ ] Creaste tu `PLAN.md` **antes** del primer `Edit`/`Write` de código.

**Sin estas cuatro casillas, tu lote arranca en `BLOQUEADO`, no en `EN CURSO`.**

> ### ✅ Hechos ya verificados contra el corte — no los repitas, pero tampoco los creas sin abrir el archivo
>
> Todo con archivo y línea en
> [`VERIFICACION-CONTRA-CODIGO-2026-09-20.md`](../../../../../docs/verificacion/VERIFICACION-CONTRA-CODIGO-2026-09-20.md).
> Lo que más te importa:
>
> - **La casilla «notas» es una hoja en blanco, no una cuadrícula.**
>   `patient-chart/free-note-block/free-note-block.html` es un `app-rich-text-editor` que guarda
>   versiones, más un selector «¿De qué consulta es la nota?». El modal que la monta es
>   `clinical-record/consultation/consultation.html:176-273`, y la casilla «notas» está en la **225**.
> - **El motor de formularios tiene cinco tipos de pregunta y ninguno es tabla**: `BOOLEAN`,
>   `MULTIPLE_CHOICE`, `SCALE`, `SINGLE_CHOICE`, `TEXT` (`shared/components/atoms/question-type-icon/question-type-icon.ts`).
>   **Así que la grilla de C-14 no tiene hoy dónde guardarse.** Eso es un hallazgo de contrato, y la
>   salida es la regla 65, **no** inventar un tipo de pregunta nuevo.
> - **Los cuatro candidatos que hay que descartar por escrito antes de crear nada** (regla 95.1):
>   el motor de formularios (`core/data-access/forms/`, `surveys/`, `specialty-form-block/`,
>   `form-builder/`, y las fichas estándar en `core/mock/fixtures/fichas-estandar.generated.ts`);
>   `observation-block/` —lo más parecido a «una fila por sesión» que ya existe—; la nota versionada
>   actual (`ChartNote`, con `signedAt`); y `organisms/data-table/` para la presentación.
> - **El formulario de internación tiene UN campo.** `patient-chart/admission-block/admission-block.html`
>   líneas **62-67**: «Inicio de la internación», y nada más. El doctor tiene razón.
> - **Y la tabla tampoco tiene dónde**: `POST /clinical/care-episodes` (`core/data-access/clinical/clinical.client.ts:164-189`)
>   escribe en `clinical.care_episodes`, cuyos campos son `patient_profile_id`, `tenant_id`,
>   `responsible_practitioner_id`, `type_concept_id`, `status_concept_id`, `start_at`, `end_at`, más
>   auditoría (`mantra-core-health-api/src/modules/clinical/entities/care_episodes.entity.ts`).
>   **No hay servicio, ni sala, ni cama, ni diagnóstico de ingreso, ni procedencia, ni acompañante.**
> - **El `409` no es un error**: el backend rechaza un segundo episodio activo del mismo paciente en
>   la misma organización, y el bloque ya lo cuenta en ámbar señalando el que está abierto.
> - **La lista sale de releer**: `GET /clinical/patients/:id/summary`, no de la respuesta del alta. Ese
>   criterio es el que hay que mantener: **una internación que aparece porque la pintamos nosotros y
>   no porque el servidor la tenga es la clase de mentira que un expediente no puede permitirse** — es
>   textual del archivo.
> - **Dos correcciones de Justin pueden estar ya cumplidas** (C-18 y C-22): él las verifica
>   ejercitando y, si ya están, cierran `DESCARTADO` **con captura**. Eso entra en tu dictamen.
>
> ⚠️ **Lo que esa verificación NO hizo: ejecutar.** No se abrió la maqueta ni se corrió un test. Y
> **no dictaminó nada**: localizó. El dictamen es tuyo, y es H6.
>
> 🔧 **Trampa de método:** los números de línea son de `origin/mockup`. Verificá contra qué ref
> buscás antes de concluir que algo no existe: `git show origin/mockup:<ruta> | grep -n '<patrón>'`.

## 2. Resultado observable

| Hito | Prioridad | Qué queda demostrado |
|---|---|---|
| **H1** | `BLOQUEANTE` | La maqueta levanta, el corte está declarado, hay captura previa de la casilla de notas y del formulario de internación, y existe un documento con **el marco normativo citado con fuente, referencia y fecha** — o con `UNKNOWN` declarado donde no se pudo citar. |
| **H2** | `ALTA` | El modal de notas ofrece una cuadrícula donde se elige el nombre de cada cabecera y se carga una fila, con los cuatro estados resueltos. |
| **H3** | `ALTA` | Sólo se puede registrar una fila por sesión, el sistema **explica por qué** cuando alguien intenta una segunda, y las filas de sesiones anteriores se cargan y se ven. |
| **H4** | `ALTA` | Existe una matriz campo × fuente normativa × soporte del contrato actual, que dice, campo por campo, si se puede guardar hoy, dónde, y si no, qué falta. |
| **H5** | `ALTA` | El formulario de internación pide lo que la matriz dice que se puede guardar, con sus validaciones; y la brecha está declarada como propuesta de modelo, no escrita en la base. |
| **H6** | `ALTA` | Hay un dictamen de aceptación de las 24 correcciones, con veredicto por corrección, evidencia enlazada y los rojos abiertos nombrados con su clase. |

> ⚠️ **Esto es más de lo que entra en una noche, y está dicho a propósito.** Lo que no se cierra queda
> `A MEDIAS` con qué anda, qué no anda y qué falta exactamente (regla 20). **Pero H6 se escribe igual,
> aunque sea con muchos `NOT_RUN`**: un dictamen honesto con la mitad sin ejercitar vale; un dictamen
> optimista no vale nada.

**Kill-test del turno completo:** abrí la casilla de notas e intentá cargar dos filas en la misma
sesión. Si te deja, C-14 no está hecho. Y abrí el formulario de internación: si sigue teniendo un
solo campo, C-23 no está hecho. Y pedí el dictamen: si dice «todo bien» sin un comando pegado por
corrección, el dictamen no existe.

## 3. Alcance

**IN:** corte declarado y capturas previas · marco normativo de la hoja de admisión **con
procedencia**, o `UNKNOWN` declarado · descarte por escrito de los cuatro candidatos existentes antes
de construir la cuadrícula · cuadrícula de notas con cabeceras elegibles y una fila por sesión · el
mensaje que explica la restricción de integridad · carga de las filas de sesiones anteriores en sólo
lectura · matriz campo × fuente × soporte del contrato para la internación · formulario de internación
con los campos que el contrato soporta, validados · propuesta de modelo para lo que no cabe, **sin
tocar la base** · recorrido de aceptación de las 24 correcciones con veredicto por corrección ·
dictamen con rojos clasificados · regresión dirigida, barrido y click-sweep · capturas por viewport y
tema · `PLAN.md`, `REPORTE.md` y `evidencia/`.

**OUT:** **cualquier archivo fuera de `free-note-block/**`, `admission-block/**` y
`clinical-record/consultation/**`** · `core/mock/**` — es de Ender: **lo que necesites guardar se lo
pedís** · `src/app/shared/**` — es de Itzan · `medication-block/**` — es de Justin · **escribir en
`mantra-core-health-api` o en `mantra-core-health-model`**: se leen y se citan · **escribir DDL a mano
contra la base** para que un campo entre (regla 97.1.3) · **inventar un campo normativo**: o tiene
cita con fuente, referencia y fecha, o se declara `UNKNOWN` (regla 97.5.4) · inventar un tipo de
pregunta en el motor de formularios · usar datos de un paciente real como dato de prueba · **corregir
el código de otro** durante la aceptación: se reporta, no se arregla · declarar `PASS` una corrección
que no ejercitaste · escribir un dictamen optimista con algo en rojo (regla 40.5.2) · declarar
`HECHO` una microtarea cuyo DoD no corriste.

## 4. Plan — hitos, subtareas y microtareas

Los seis estados permitidos son exactamente: `TODO`, `EN CURSO`, `HECHO`, `A MEDIAS`, `BLOQUEADO` y
`DESCARTADO`. **`A MEDIAS` es legítimo; disfrazarlo de `HECHO` no.**

### H1 — Corte, estado real de las dos pantallas, y el marco normativo con procedencia

**Prioridad:** `BLOQUEANTE`

**CA:** Dado el pedido «investigar qué debe tener según norma», cuando alguien pregunta de dónde sale cada campo que vas a proponer, entonces hay una fuente citada con nombre, referencia y fecha — o un `UNKNOWN` declarado, y **ninguna invención**.

**DoD:** Las 9 microtareas en `HECHO` o `BLOQUEADO`. Documento de fuentes en `evidencia/`. Capturas previas. Gates de partida con exit code.

**Kill-test del hito:** señalá cualquier campo de tu matriz y pedí su fuente. Si la respuesta es «porque una hoja de internación siempre tiene eso», ese campo está inventado y hay que marcarlo `UNKNOWN`.

**Estado:** TODO

#### H1.S1 — El corte, el entorno y las capturas previas

**CA:** Dada tu rama, cuando se la compara con `origin/mockup`, entonces sale de ese corte, y hay captura de las dos pantallas antes de tocarlas.

**DoD:** Las 3 microtareas en `HECHO`, con `git log -1` y las capturas.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H1.S1.M1 | Traer `origin/mockup`, declarar el SHA y salir de ahí con tu rama | El SHA está en tu `PLAN.md` | `git fetch origin && git log -1 --format='%H %ad %s' origin/mockup` → pegada | TODO |
| H1.S1.M2 | Abrir una consulta y capturar la casilla «notas» y la de «internación» | Hay dos capturas y está dicho qué campos tiene cada una | Capturas en `evidencia/antes/` + la lista de campos observada | TODO |
| H1.S1.M3 | Correr typecheck, lint y los specs de tus bloques como baseline | Hay exit code de los tres | `yarn typecheck; yarn lint; npx ng test --include=src/app/features/clinical-record/**/*.spec.ts --watch=false` → `evidencia/antes/gates.txt` | TODO |

#### H1.S2 — Buscar dentro de la casa antes de inventar

**CA:** Dada la cuadrícula que hay que construir, cuando alguien pregunta por qué no se reusó lo que había, entonces hay un descarte escrito de los cuatro candidatos existentes.

**DoD:** Las 3 microtareas en `HECHO`. El descarte escrito **antes** del primer archivo nuevo.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H1.S2.M1 | Abrir el motor de formularios y decidir si sirve | Hay veredicto con motivo, citando los cinco tipos de pregunta que existen | Fragmento de `question-type-icon.ts` pegado + veredicto. **Sin tipo tabla ni grupo repetible, el motor no da la grilla: eso es el hallazgo, no una excusa** | TODO |
| H1.S2.M2 | Abrir `observation-block/` y decidir si «una fila por sesión» ya está resuelto ahí | Hay veredicto con motivo | Fragmento + veredicto. Es lo más parecido que existe: **si sirve parametrizado, se parametriza** (regla 95.1.3) | TODO |
| H1.S2.M3 | Decidir dónde se guarda la fila, y declarar si el contrato real lo soporta | Está escrito el destino y si es contrato real o doble del simulador | Decisión + cita. Si es doble, se declara como tal y se registra la brecha (regla 65). **Lo que necesites en `core/mock/**` se lo pedís a Ender** | TODO |

#### H1.S3 — La norma, con procedencia o con `UNKNOWN`

**CA:** Dado el documento de fuentes, cuando se lo lee, entonces cada requisito normativo tiene fuente, referencia y fecha; y lo que no se pudo confirmar está marcado `UNKNOWN`, no completado a criterio.

**DoD:** Las 3 microtareas en `HECHO` o `BLOQUEADO`. Cero campos sin fuente ni marca. Cero fuentes inventadas.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H1.S3.M1 | Buscar primero dentro de la casa: vault, casos de uso y modelo | Está registrado qué encontraste y qué no | Búsqueda pegada sobre `mantra_core_technologies_health_docs/` y `mantra-core-health-model/`. **Si ya hay una especificación de admisión, gana sobre cualquier cosa que traigas de afuera** (regla 00 §8) | TODO |
| H1.S3.M2 | Si hace falta fuente externa, citarla con nombre, referencia, fecha y condición de uso | Cada fuente tiene los cuatro datos | Ficha de procedencia por fuente (regla 97.4.2). **Sin los cuatro datos, la fuente no se usa** | TODO |
| H1.S3.M3 | Marcar `UNKNOWN` todo lo que no se pudo confirmar | Ningún campo queda con una fuente supuesta | Lista de `UNKNOWN` con qué haría falta para cerrarlo. **B-13 en `REGISTRO-DEFECTOS.md` de la API es el precedente de lo que pasa cuando se inventan fuentes: leelo** | TODO |

### H2 — La cuadrícula de notas: cabeceras elegibles y una fila

**Prioridad:** `ALTA`

**CA:** Dada la casilla de notas del encuentro, cuando se la abre, entonces ofrece una cuadrícula donde se elige el nombre de cada cabecera y se carga una fila de valores, con sus cuatro estados resueltos —cargando, con datos, vacío y error— y usable con teclado.

**DoD:** Las 9 microtareas en `HECHO` o `BLOQUEADO` con el pedido a Ender escrito. La fila **releída** del servidor simulado, no sólo pintada. Los cuatro estados capturados.

**Kill-test del hito:** cargá una fila, recargá la página y volvé a abrir la casilla. Si la fila no está, no está hecho: estaba pintada, no guardada.

**Estado:** TODO

#### H2.S1 — Las cabeceras se eligen

**CA:** Dada la cuadrícula, cuando se define una columna, entonces su nombre se elige de una lista y no se teclea libre, y la elección queda guardada para las sesiones siguientes.

**DoD:** Las 3 microtareas en `HECHO`. La lista de nombres sale de un catálogo, no de un literal en la plantilla. El `select` reusado del sistema de diseño.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H2.S1.M1 | Definir de dónde sale la lista de nombres de cabecera | Está la fuente: catálogo, conceptos o configuración, con su ruta | Decisión escrita. **Un nombre de columna clínico escrito a mano en la plantilla es un catálogo inventado** (regla 97.4.7) | TODO |
| H2.S1.M2 | Ofrecer la elección con el `select` del sistema, no con texto libre | Se elige de la lista; no se puede teclear un nombre arbitrario | Captura + el control usado. Si hace falta permitir uno propio, **eso se decide y se registra**, no se agrega por comodidad | TODO |
| H2.S1.M3 | Guardar la definición de columnas y verificar que sobrevive a la recarga | Las columnas siguen ahí tras recargar | Captura tras recargar. Si el simulador no persiste, **es pedido a Ender** y queda `BLOQUEADO` con el pedido escrito | TODO |

#### H2.S2 — La fila se carga y se guarda de verdad

**CA:** Dada una cuadrícula con sus columnas, cuando se carga una fila y se guarda, entonces se relee del servidor con sus valores.

**DoD:** Las 3 microtareas en `HECHO`. Releído tras recargar. Ningún dato de paciente en ninguna captura pegada.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H2.S2.M1 | Cargar una fila y guardarla | La fila queda guardada | Petición y respuesta pegadas | TODO |
| H2.S2.M2 | Releer y verificar que está | Aparece tras recargar la página | Captura tras recargar. **Una fila que aparece porque la pintamos nosotros no prueba que el servidor la tenga** — es el criterio que ya usa el bloque de internación | TODO |
| H2.S2.M3 | Verificar que ninguna captura ni salida pegada trae datos de paciente real | Todo es sintético declarado, o está enmascarado y aclarado | Revisión de tus capturas. Regla 90.2.3 y 40.5.5 | TODO |

#### H2.S3 — Los cuatro estados y el teclado

**CA:** Dada la cuadrícula, cuando no hay datos, cuando está cargando, cuando hay error y cuando hay filas, entonces cada caso se ve y dice qué hacer; y todo se puede usar con teclado.

**DoD:** Las 3 microtareas en `HECHO`. Las cuatro capturas. El recorrido de teclado descrito.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H2.S3.M1 | Resolver los cuatro estados, con el vacío orientando | Los cuatro existen y el vacío dice por qué está vacío y qué hacer | Las cuatro capturas. Regla 95.2: **el vacío mudo está prohibido** | TODO |
| H2.S3.M2 | Verificar el recorrido con teclado por celda | Se puede llegar a cada celda y salir sin ratón | Recorrido descrito + captura del anillo de foco | TODO |
| H2.S3.M3 | Verificar en móvil estrecho que la cuadrícula sigue usable | No hay desborde horizontal ni celdas inalcanzables | Captura en móvil. Regla 95.4.4: **si colapsa, la información y las acciones siguen disponibles** | TODO |

### H3 — Una fila por sesión, explicada, y las anteriores a la vista

**Prioridad:** `ALTA`

**CA:** Dada una sesión con una fila ya registrada, cuando se intenta registrar otra, entonces no se registra y el sistema explica que por integridad de los datos sólo se admite una, y por qué —sin eso no se podría saber a qué sesión corresponde cada registro—; y las filas de sesiones anteriores se cargan y se ven.

**DoD:** Las 9 microtareas en `HECHO` o `BLOQUEADO`. La restricción ejercitada de verdad: la segunda fila **no** queda guardada. El texto del mensaje capturado.

**Kill-test del hito:** intentá la segunda fila y después recargá. Si quedaron dos, la restricción está sólo en el cartel y no donde se escribe.

**Estado:** TODO

#### H3.S1 — La restricción donde se escribe, no sólo en el cartel

**CA:** Dada la regla de una fila por sesión, cuando se intenta violarla, entonces la escritura no ocurre, y eso se verifica releyendo.

**DoD:** Las 3 microtareas en `HECHO`. El caso negativo ejercitado. La validación donde se guarda, no sólo en la UI.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H3.S1.M1 | Implementar el freno en la UI: con una fila registrada, no se ofrece cargar otra | El camino no está disponible | Captura | TODO |
| H3.S1.M2 | Verificar qué hace el servidor simulado si la petición llega igual | Está registrada la respuesta real | Petición y respuesta pegadas. **Ocultar el botón no es la regla: la precondición va en la escritura** (regla 96.3.2). Si el simulado no la valida, **es pedido a Ender** y se registra | TODO |
| H3.S1.M3 | Releer después del intento y verificar que hay una sola fila | Hay exactamente una | Captura tras recargar | TODO |

#### H3.S2 — El mensaje que explica, no el que sólo niega

**CA:** Dada la segunda fila intentada, cuando el sistema la rechaza, entonces el mensaje dice la restricción **y** su motivo: sin una fila por sesión no se puede saber a qué sesión corresponde cada registro.

**DoD:** Las 3 microtareas en `HECHO`. El texto capturado. Sin error crudo del servidor a la vista.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H3.S2.M1 | Escribir el mensaje con su motivo, en las palabras del pedido | El mensaje dice la restricción y la razón | Captura del mensaje. Regla 95.2.3: **el error es accionable, no crudo** | TODO |
| H3.S2.M2 | Verificar que el mensaje se anuncia a un lector de pantalla | El aviso tiene rol de estado | Revisión + captura. Regla 80.7.3: **lo automático no alcanza** | TODO |
| H3.S2.M3 | Verificar que lo escrito no se pierde cuando el intento falla | Los valores siguen en el formulario | Caso ejercitado. Regla 95.3.3 | TODO |

#### H3.S3 — Las filas anteriores se cargan

**CA:** Dada una sesión nueva, cuando se abre la cuadrícula, entonces se ven las filas de las sesiones anteriores, identificadas por su sesión, y no se pueden editar desde acá.

**DoD:** Las 3 microtareas en `HECHO`. Las filas anteriores visibles con su sesión. La ambigüedad de editable vs sólo lectura registrada.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H3.S3.M1 | Mostrar las filas anteriores con la sesión a la que pertenecen | Cada fila dice de qué sesión es | Captura con al menos dos sesiones. **Una fila sin su sesión es exactamente el problema que el pedido quiere evitar** | TODO |
| H3.S3.M2 | Dejarlas en sólo lectura y registrar el supuesto | No se pueden editar desde la sesión nueva | Captura + registro de `Q-D7` con dueño (doctor) | TODO |
| H3.S3.M3 | Verificar el orden y qué pasa con muchas sesiones | El orden es determinista y la lista no crece sin límite | Caso con varias filas + la decisión de paginar o recortar, declarada. Regla 96.6.2: **el orden determinista incluye un desempate** | TODO |

### H4 — Internación: la matriz campo × fuente × soporte del contrato

**Prioridad:** `ALTA`

**CA:** Dada la matriz, cuando alguien pregunta qué debería tener la hoja de internación y qué se puede guardar hoy, entonces cada campo tiene tres columnas respondidas: qué fuente lo pide, si el contrato actual lo soporta y dónde, y si no, qué haría falta.

**DoD:** Las 9 microtareas en `HECHO` o `BLOQUEADO`. Ningún campo sin fuente o sin `UNKNOWN`. La entidad real citada, no descrita de memoria.

**Kill-test del hito:** tomá tres campos de la matriz al azar y pedí, de cada uno, la columna del modelo donde se guardaría. Si alguno no la tiene y tampoco dice «no cabe», la matriz está a medias.

**Estado:** TODO

#### H4.S1 — Qué soporta hoy el contrato, leído

**CA:** Dado el contrato actual, cuando se lo describe, entonces la descripción sale de abrir la entidad y el DTO, no de la memoria.

**DoD:** Las 3 microtareas en `HECHO`, con los fragmentos pegados.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H4.S1.M1 | Leer la entidad de episodio de cuidado y listar sus campos reales | La lista es literal del archivo | Fragmento de `care_episodes.entity.ts` pegado con sus campos | TODO |
| H4.S1.M2 | Leer el cliente y el endpoint que usa el bloque hoy | Están la ruta y el cuerpo que manda | Fragmento de `clinical.client.ts:164-189` pegado | TODO |
| H4.S1.M3 | Registrar qué conceptos admite `type_concept_id` y `status_concept_id` | Está dicho de qué conjunto de valores salen | Localizador del catálogo. **Si no se sabe, es `UNKNOWN`, no «seguramente cualquier concepto»** | TODO |

#### H4.S2 — Los campos que la norma pide

**CA:** Dada cada fila de la matriz, cuando se la lee, entonces tiene su fuente citada o su `UNKNOWN`, y está claro si es obligatorio, condicional u opcional según esa fuente.

**DoD:** Las 3 microtareas en `HECHO`. Cero campos inventados. La distinción obligatorio/opcional sale de la fuente, no de tu criterio.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H4.S2.M1 | Listar los campos que la fuente pide, con su cita | Cada campo tiene fuente y referencia | Matriz en `evidencia/`. **Un campo sin cita va `UNKNOWN`** (regla 97.5.4) | TODO |
| H4.S2.M2 | Marcar obligatoriedad según la fuente, no según criterio propio | Cada campo dice obligatorio, condicional u opcional, y de dónde sale eso | Matriz con la columna. **Poner un campo obligatorio sin que la fuente lo diga es cambiar la semántica del requisito** (regla 00 §1.6) | TODO |
| H4.S2.M3 | Verificar si hay un recurso estándar de interoperabilidad detrás | Está dicho si existe y si conviene alinearse | Cita o `UNKNOWN`. Skill `healthcare-interoperability-fhir`: **alinearse a un estándar es mejor que inventar una estructura** | TODO |

#### H4.S3 — El cruce, y la propuesta para lo que no cabe

**CA:** Dada la matriz cruzada, cuando se la lee, entonces se sabe qué se implementa esta noche, qué exige modelo nuevo, y por dónde entraría ese cambio.

**DoD:** Las 3 microtareas en `HECHO`. La propuesta de modelo escrita **sin** tocar la base. La dirección única del cambio respetada.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H4.S3.M1 | Cruzar campo por campo contra el contrato y marcar los tres grupos | Cada campo cae en «entra hoy», «entra como doble» o «exige modelo» | Matriz completa | TODO |
| H4.S3.M2 | Escribir la propuesta de modelo para lo que no cabe | Hay propuesta con tablas, columnas y relaciones, en la fuente de verdad correcta | Documento en `evidencia/` + la ruta de `mantra-core-health-model` donde iría. **Prohibido escribir DDL a mano contra la base** (regla 97.1.3) | TODO |
| H4.S3.M3 | Registrar quién es dueño de ese cambio de modelo y qué bloquea | Está el dueño y el impacto | Registro con dueño. **No lo implementes: no es tuyo y es irreversible con un revert** (regla 97) | TODO |

### H5 — El formulario de internación que el contrato sí soporta

**Prioridad:** `ALTA`

**CA:** Dada la casilla de internación, cuando se la abre con un encuentro en curso, entonces pide los campos que la matriz marcó como soportados, valida lo que corresponde, y la internación se relee del servidor con esos datos.

**DoD:** Las 9 microtareas en `HECHO` o `BLOQUEADO`. Releído tras recargar. El `409` sigue contándose como «ya está internada». Ningún campo agregado sin fuente.

**Kill-test del hito:** dá de alta una internación, recargá y volvé a abrir la ficha. Si los campos nuevos no están, se guardaron sólo en la pantalla.

**Estado:** TODO

#### H5.S1 — Los campos que entran hoy

**CA:** Dado el formulario, cuando se lo compara con la matriz, entonces tiene exactamente los campos marcados como soportados, con su etiqueta accesible y su ayuda.

**DoD:** Las 3 microtareas en `HECHO`. Cada campo con su fila en la matriz. Cero campos sin respaldo.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H5.S1.M1 | Agregar los campos soportados, cada uno con su fila en la matriz | Cero campos sin fila | Captura + la matriz al lado | TODO |
| H5.S1.M2 | Poner etiqueta accesible y ayuda en cada campo | Todos tienen etiqueta real, no placeholder | Revisión con teclado + captura. Regla 95.3.5 | TODO |
| H5.S1.M3 | Verificar que los campos que **no** entran están declarados en el reporte | La lista de lo que falta está escrita | Sección «No cubierto» del `REPORTE.md`. **Un formulario que parece completo y no lo es es peor que uno que declara su límite** | TODO |

#### H5.S2 — Validación y errores

**CA:** Dado el formulario, cuando se manda algo inválido, entonces el error se muestra en su campo, lo escrito no se pierde, y el `409` del segundo episodio se sigue contando como «ya está internada».

**DoD:** Las 3 microtareas en `HECHO`. Los tres casos ejercitados. Ningún error crudo del servidor a la vista.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H5.S2.M1 | Validar en el formulario lo que la fuente marca obligatorio | No se puede mandar sin lo obligatorio | Caso ejercitado con captura | TODO |
| H5.S2.M2 | Verificar el error de campo del servidor mapeado a su campo | El error llega a su campo, no a un genérico | Caso ejercitado. Regla 95.3.2 | TODO |
| H5.S2.M3 | Verificar que el `409` sigue contándose como «ya está internada» | El aviso en ámbar sigue apareciendo y señala el episodio abierto | Caso ejercitado con captura. **Ese comportamiento ya existe y no se puede perder al agregar campos** | TODO |

#### H5.S3 — Guardado real y rastro

**CA:** Dada una internación dada de alta, cuando se recarga la ficha, entonces está ahí con sus datos; y la operación deja rastro auditable.

**DoD:** Las 3 microtareas en `HECHO`. Releído tras recargar. Rastro verificado o declarado `NOT_RUN` con el motivo.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H5.S3.M1 | Dar de alta una internación con los campos nuevos y releer | Los datos están tras recargar | Captura tras recargar. **La lista sale de releer el expediente, no de la respuesta del alta**: mantené ese criterio | TODO |
| H5.S3.M2 | Verificar que la operación queda registrada como acción sensible | Hay rastro, o está declarado que en la maqueta no se puede verificar | Evidencia o `NOT_RUN` con motivo. Regla 90.2.7 | TODO |
| H5.S3.M3 | Verificar que ninguna captura ni salida pegada trae datos de paciente real | Todo sintético declarado o enmascarado y aclarado | Revisión de tus capturas. Regla 90.2.3 | TODO |

### H6 — El dictamen de aceptación de las 24 correcciones

**Prioridad:** `ALTA`

**CA:** Dado el lote completo, cuando coordinación lee tu dictamen, entonces sabe, corrección por corrección, si está aceptada, rechazada, bloqueada o sin ejercitar, con la evidencia enlazada y los rojos clasificados — sin tener que abrir el trabajo de cada uno.

**DoD:** Las 9 microtareas en `HECHO`. Las 24 filas con veredicto. Cada `PASS` con su comando u observación. Cada rojo con su clase de las cinco de la regla 80.4. **Ninguna corrección ajena tocada por vos.**

**Kill-test del hito:** buscá una fila con veredicto `PASS` y pedí la evidencia. Si no hay captura ni comando, ese `PASS` es inválido y hay que bajarlo a `NOT_RUN`.

**Estado:** TODO

#### H6.S1 — El recorrido, con intención

**CA:** Dadas las 24 correcciones, cuando se las recorre, entonces cada una tiene un caso concreto ejercitado en la maqueta, o un `NOT_RUN` con el motivo.

**DoD:** Las 3 microtareas en `HECHO`. El guion escrito antes de recorrer. Cero clics al azar.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H6.S1.M1 | Escribir el guion: por cada `C-nn`, el caso mínimo que la acepta o la rechaza | Las 24 tienen su caso escrito antes de empezar | Guion en `evidencia/`. Usá los kill-tests de cada prompt: **ya están escritos, no los reinventes** | TODO |
| H6.S1.M2 | Recorrer con la cuenta médica y anotar el resultado por corrección | Las 24 tienen resultado observado o `NOT_RUN` | Tabla de resultados + capturas | TODO |
| H6.S1.M3 | Recorrer los caminos de otras cuentas donde corresponda | Están cubiertas paciente y visitador donde el caso lo pide | Resultados + capturas. **El visitador es el caso de acceso más delicado del lote** | TODO |

#### H6.S2 — Clasificar los rojos, con evidencia

**CA:** Dado cada rojo, cuando se lo reporta, entonces tiene su clase de las cinco —producto, test, entorno, datos o externo— demostrada con reproducción, no elegida por intuición.

**DoD:** Las 3 microtareas en `HECHO`. Cada rojo reproducible por otro. Ninguno maquillado como `PASS`.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H6.S2.M1 | Reproducir cada rojo con el caso mínimo antes de clasificarlo | Cada rojo tiene pasos que otro puede seguir | Pasos escritos + captura. Regla 80.4.2: **clasificar sin reproducción está prohibido** | TODO |
| H6.S2.M2 | Clasificar cada uno en una de las cinco clases | Cada rojo tiene exactamente una clase, con su evidencia | Tabla. `ENVIRONMENT`, `DATA` y `EXTERNAL` **nunca** se maquillan como `PASS` (regla 80.4.1) | TODO |
| H6.S2.M3 | Reportar cada rojo a su dueño en el momento, no al cierre | El aviso está en el daily con la hora | Entradas en el daily. Regla 50: **un bug se reporta apenas aparece** | TODO |

#### H6.S3 — El dictamen, la regresión y el cierre

**CA:** Dado el cierre del turno, cuando coordinación lee un solo documento, entonces sabe el estado real del lote de 24 y qué falta exactamente — y ninguna palabra es más fuerte que la evidencia pegada.

**DoD:** Las 3 microtareas en `HECHO`. Dictamen escrito con su veredicto global. `REPORTE.md` con las tres secciones y el avance en la primera línea.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H6.S3.M1 | Escribir el dictamen con veredicto por corrección y veredicto global | Las 24 filas están, y el global es el más bajo de sus partes | Dictamen en `evidencia/`. **Prohibido el resumen optimista con algo en rojo** (regla 40.5.2) | TODO |
| H6.S3.M2 | Correr la regresión de tu área y el barrido de la maqueta, serial | Gates en 0 y las filas del expediente limpias | `yarn typecheck; yarn lint; npx ng test --include=src/app/features/clinical-record/**/*.spec.ts --watch=false` y `playwright/mockup-barrido.spec.ts --workers=1` → salidas pegadas | TODO |
| H6.S3.M3 | Capturas 3 viewports × 2 temas de tus dos pantallas, **miradas**, y `REPORTE.md` | Cada captura con su observación; el reporte abre con `AVANCE: <HECHO> / 54` | Índice de capturas + archivo en disco | TODO |

## 5. Ambigüedades registradas — **no las resuelvas, anotalas**

| ID | Ambigüedad | Quién puede resolverla | Qué bloquea | Supuesto con el que seguís |
|---|---|---|---|---|
| Q-D7 | C-14 no dice si las filas de sesiones anteriores se muestran editables o en sólo lectura | Doctor | Sólo esa parte | Sólo lectura para las anteriores; editable sólo la de la sesión en curso |
| Q-D8 | C-23 dice «según nomra» sin nombrar la norma | Doctor / negocio | Qué campos entran en la matriz | Se cita lo que se pueda con fuente, referencia y fecha; el resto va `UNKNOWN`. **Ningún campo se escribe «porque suena a norma»** |
| Q-M1 | C-14 pide «seleccionar el nombre del header» sin decir de qué lista | Doctor | La fuente de los nombres de columna | Sale de un catálogo declarado; un nombre clínico escrito a mano en la plantilla sería un catálogo inventado |
| Q-M2 | C-14 dice que las filas «se deben cargar para la siguiente sesiones» sin decir cuántas ni en qué orden | Doctor | Sólo el volumen | Se muestran todas, en orden determinista, con la decisión de paginar declarada si hacen falta muchas |
| Q-M3 | El motor de formularios no tiene tipo tabla, así que la cuadrícula no tiene contrato real donde guardarse | Dueño del modelo + negocio | La persistencia real, no la de la maqueta | Se cierra contra el doble del simulador, **declarado como doble**, y la brecha queda registrada (regla 65) |
| Q-M4 | `care_episodes` no tiene columnas para la mayor parte de una hoja de admisión | Dueño del modelo | Los campos que exigen modelo nuevo | Se implementa lo que entra, se propone el modelo del resto y **no se toca la base** |
| Q-M5 | El dictamen depende del trabajo de los otros cuatro, que puede no estar terminado | Coordinación | El alcance del dictamen, no su existencia | El dictamen se escribe igual, con `NOT_RUN` en lo que no llegó a estar |

<ejemplos>
Dos formas de cerrar la misma microtarea. La diferencia no es de redacción: es que una se puede
auditar y la otra no.

<ejemplo tipo="aceptable" microtarea="H3.S1.M3">
Intenté la segunda fila, el sistema la rechazó con el mensaje de integridad (`evidencia/h3/mensaje.png`), recargué la página y la cuadrícula muestra **una** fila (`evidencia/h3/tras-recargar.png`). La petición devolvió 409 (`evidencia/h3/peticion.txt`).

Estado: HECHO · Veredicto: PASS · Peldaño: VERIFIED
</ejemplo>

<ejemplo tipo="prohibido" microtarea="H3.S1.M3">
No deja cargar dos filas, el cartel se ve bien.

Estado: HECHO
</ejemplo>

Por qué el segundo no vale: el cartel puede verse y la fila guardarse igual. Sin la relectura tras recargar, lo único demostrado es que la interfaz dice algo (regla 96.3.2: la precondición va en la escritura).
</ejemplos>

## 6. Definition of Done del turno

- [ ] Las **54 microtareas** están en `HECHO`, en `BLOQUEADO` con su causa y el pedido escrito, o en `A MEDIAS` con qué anda, qué no anda, qué falta y dónde quedó.
- [ ] **Ninguna microtarea quedó en `EN CURSO`** al cerrar.
- [ ] Cada hito y cada subtarea tienen su Estado actualizado.
- [ ] Todo veredicto es `PASS`/`FAIL`/`NOT_RUN`/`BLOCKED`. **Ningún `PASS` sin comando u observación pegados.**
- [ ] **Los cuatro candidatos existentes están descartados por escrito** antes del primer archivo nuevo de la cuadrícula.
- [ ] La fila de la cuadrícula está **releída tras recargar**, no sólo pintada.
- [ ] La restricción de una fila por sesión está donde se escribe, no sólo en el cartel: el intento de la segunda **no** deja dos filas.
- [ ] El mensaje de la restricción dice la regla **y su motivo**, y se anuncia a un lector de pantalla.
- [ ] Las filas anteriores se ven **con su sesión**, en sólo lectura, con orden determinista.
- [ ] La matriz de internación tiene, por campo: fuente citada o `UNKNOWN`, obligatoriedad según la fuente, y soporte del contrato con su localizador.
- [ ] **Ningún campo normativo escrito sin fuente.** Cero fuentes inventadas (precedente B-13 leído y citado).
- [ ] La propuesta de modelo está escrita en la fuente de verdad correcta y **no se tocó la base**: cero DDL a mano.
- [ ] La internación se relee tras recargar con sus campos nuevos, y el `409` sigue contándose como «ya está internada».
- [ ] El dictamen tiene **24 filas**, una por corrección, con veredicto, evidencia enlazada y dueño del rojo.
- [ ] Cada rojo está **reproducido** antes de clasificarlo, y clasificado en una de las cinco clases.
- [ ] Cada rojo se reportó a su dueño **en el momento**, no al cierre.
- [ ] El veredicto global es el **más bajo** de sus partes. Cero resumen optimista con algo en rojo.
- [ ] **No corregiste el código de nadie durante la aceptación**: se reporta, no se arregla.
- [ ] Cero archivos tocados fuera de `free-note-block/**`, `admission-block/**` y `consultation/**`. **Cero escrituras en la API y en el modelo.**
- [ ] Ningún dato real de paciente en ninguna captura, salida, matriz ni dictamen. Si algo los tenía: **enmascarado y aclarado que se enmascaró**.
- [ ] Ningún spec borrado, saltado ni debilitado. Ningún timeout subido. Ningún reintento agregado.
- [ ] Capturas en 3 viewports × 2 temas, **miradas**, cada una con su observación.
- [ ] Ningún proceso quedó corriendo al cerrar, o está declarado cuál y por qué.
- [ ] Avance reportado como `microtareas HECHO / 54`, **no** como porcentaje a ojo.

## 7. Handoff — avisá por el daily al cerrar cada hito, no al final

| Al cerrar | A quién | Qué exactamente |
|---|---|---|
| **H1** | Ender | Qué necesitás guardar para la cuadrícula: es su `core/mock/**` |
| **H1** | Coordinación | Qué quedó `UNKNOWN` del marco normativo, y qué haría falta para cerrarlo |
| **H2** | Justin | Que `consultation.html` es tuyo: **el cambio del `output` de descarga que él necesita lo escribís vos**, o se acuerda quién |
| **H2** | Ender | Si la cuadrícula necesita persistencia que el simulador no tiene |
| **H3** | Dueño del modelo | La brecha: la cuadrícula no tiene contrato real donde guardarse |
| **H4** | Dueño del modelo | La matriz y la propuesta: es el insumo del cambio de esquema |
| **H4** | Coordinación | Cuántos campos de la hoja de admisión **no** entran hoy: es el tamaño real de C-23 |
| **H5** | Coordinación | Qué quedó en «No cubierto» del formulario de internación |
| **H6** | Los cuatro | Cada rojo de su área, **en el momento en que aparece** |
| **H6** | Coordinación | El dictamen de las 24 con su veredicto global |

Si un bloqueo se confirma, **no iteres sobre él**: registrá la causa, escribí el pedido, y pasá a la
siguiente microtarea independiente. Antes de declarar `BLOQUEADO`, leé la **regla 65**: tu lote es el
que más la necesita, porque las dos correcciones que te tocan chocan con el modelo. Si el contrato de
lo que falta se puede nombrar, **se simula en sus tres niveles y la microtarea se cierra contra el
doble**, declarándolo. Lo único que no se simula es una decisión de negocio — y «qué campos exige la
norma» es exactamente eso mientras no haya fuente.
