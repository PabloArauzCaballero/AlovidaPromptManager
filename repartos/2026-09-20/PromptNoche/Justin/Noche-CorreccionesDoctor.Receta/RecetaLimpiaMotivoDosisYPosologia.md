# La receta: sacarle lo que no va, y que la dosis y la posología digan la verdad

> **Rol:** propietario del bloque de medicación del expediente · **Línea:** A · **Fecha:** 2026-09-20 · **Turno:** noche
> **Fuente del pedido:** [`CORRECCIONES-DOCTOR-2026-09-20.md`](../../../../../docs/requisitos/CORRECCIONES-DOCTOR-2026-09-20.md) · **Verificación contra el código:** [`VERIFICACION-CONTRA-CODIGO-2026-09-20.md`](../../../../../docs/verificacion/VERIFICACION-CONTRA-CODIGO-2026-09-20.md)
> **Correcciones que cubrís: C-15, C-16, C-17, C-18, C-19, C-20 (UI), C-21 (en la receta), C-22** — 8 de 24.
> **6 hitos · 18 subtareas · 54 microtareas**, todas con criterio de aceptación y Definition of Done.

## 0. Ficha de asignación

| Campo | Valor |
|---|---|
| `REPO` | `alovida/mantra-core-health` (frontend Angular). **Nada de backend en este lote** |
| `TARGET_REF` | `origin/mockup` — corte leído **`689697821a6e6d2c8f702c7508d6728fa9a1869a`** (PR #554, 2026-09-20T12:32-04). **Reconsultalo y fijá el tuyo** en tu `PLAN.md` |
| `RAMA DE TRABAJO` | Una tuya, saliendo de `origin/mockup`. **Nada directo sobre `mockup`, nada sin PR** |
| `ARCHIVOS RESERVADOS PARA VOS` | `src/app/features/clinical-record/patient-chart/medication-block/**` · `src/app/core/data-access/prescription-favorites/**` |
| `ARCHIVOS DE OTROS — NO LOS TOQUES` | `clinical-record/consultation/**` (Marcelo: **ahí vive el modal que monta tu bloque**, y el `(descargar)` que sube) · `patient-chart/free-note-block/**` y `admission-block/**` (Marcelo) · `src/app/shared/**` y `account/my-profile/**` (Itzan) · `features/agenda/**` y `my-services/**` (Pablo) · `core/mock/**`, `features/dashboard/**` y el resto de `core/data-access/**` (Ender) |
| `LA MAQUETA NO TIENE BACKEND` | `mockBackend: true` fijo en `src/environments/environment.ts` de esta rama. Tu DoD se demuestra contra `src/app/core/mock/` — **que es de Ender**: lo que te falte ahí, se lo pedís por el daily |
| `CUENTA DE PRUEBA` | `medica@alovida.mock` (cualquier contraseña no vacía). **Sintética declarada**: se puede pegar |
| `DÓNDE SE PRUEBA` | La receta vive en la casilla «Medicación» de `/medical-records/:profileId/consultation`, y también en el expediente. **Exige un encuentro abierto** salvo que se le pase `exigeEncuentro=false` |
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
obligatorios; lo único que cambia es que nadie te va a frenar.

### 1.3 Skills que tenés que CARGAR para este lote

Son **24**: 11 del proceso y 13 propias de la receta.

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
| `medication-prescription-safety` | **la más importante de tu lote**: qué no se puede inferir de una receta y por qué |
| `clinical-records` | el encuentro, el episodio y qué se registra dentro de cuál |
| `terminology-value-sets` | catálogo cerrado, `conceptId` y por qué el texto libre no reemplaza un concepto |
| `angular-forms` | reactive forms tipados, validadores y errores por campo |
| `frontend-forms-ux` | cuándo validar, qué se preserva ante fallo y qué se dice |
| `frontend-ux-states` | cargando, con datos, vacío y error: los cuatro |
| `frontend-accessibility` | etiqueta accesible por campo, foco visible, el placeholder no es etiqueta |
| `atomic-design-components` | reusar `app-select` y `concept-select` en vez de crear controles |
| `ux-writing-microcopy` | el texto de un campo clínico se lee como una instrucción, no como una adivinanza |
| `dead-code-duplication` | qué hacer con el cliente de favoritos si queda sin uso |
| `unit-testing` | un comportamiento por test, y no testear la implementación |
| `visual-proof` | la captura no vale si no la mirás |
| `e2e-playwright` | locators por rol y texto, cero `waitForTimeout` |

Entrá siempre por `skills-router`: **no leas el catálogo entero, no sirve.**

### 1.4 DoD de esta sección — se verifica como cualquier otra

- [ ] `ls .claude/skills | wc -l` devolvió **176**, y la salida está pegada en tu daily.
- [ ] `python .claude/hooks/plan_gate.py --self-test` devolvió **11 PASS, 0 FAIL**, salida pegada.
- [ ] Leíste `skills-router` y las 24 skills de las dos tablas, **empezando por `medication-prescription-safety`**.
- [ ] Creaste tu `PLAN.md` **antes** del primer `Edit`/`Write` de código.

**Sin estas cuatro casillas, tu lote arranca en `BLOQUEADO`, no en `EN CURSO`.**

> ### ✅ Hechos ya verificados contra el corte — no los repitas, pero tampoco los creas sin abrir el archivo
>
> Todo con archivo y línea en
> [`VERIFICACION-CONTRA-CODIGO-2026-09-20.md`](../../../../../docs/verificacion/VERIFICACION-CONTRA-CODIGO-2026-09-20.md).
> Localizadores en `patient-chart/medication-block/medication-block.html` al corte `68969782…`:
>
> | Qué | Dónde |
> |---|---|
> | «Descargar PDF» en cada receta de la lista (C-15) | **62-70**, y el evento sube al padre como `(descargar)` |
> | Barra «Casos de demostración» (C-16) | **132-155**, bajo `@if (demoActiva)` |
> | «Usar un favorito» (C-17) | **182-193** · «Guardar como favorito» **408-415** · `errorDelFavorito()` **394** |
> | «¿De qué consulta es la receta?» — el rótulo que el doctor cita en C-18 | **164** (es el selector de **cita**, no de diagnóstico) |
> | «Concentración» / «Presentación» (aparecen si el catálogo las declara) | **222** y **232** |
> | «Dosis» en texto (aparece **sólo** si el catálogo no declara nada) | **243** |
> | «Frecuencia» texto + chips de atajo | **254-277** |
> | «Cantidad» **291** · «Unidad» (C-19) | **301-306** |
> | Chips de duración | **317-329** |
> | «¿Para qué es esta receta?» con `[required]="exigeDiagnostico()"` (C-22) | **355-373** |
> | «¿Cuál es el motivo?» libre, bajo `@if (motivoEsLibre())` (C-18) | **375-390** |
>
> Y en `medication-block.ts`: `hayPosologia()` en **561-562**, la lectura de la ficha del concepto en
> **900-913** con las claves de propiedad `dose_forms` (**112**) y `strengths` (**113**), y
> `posologia()` —que compone concentración + presentación en `doseText`— en **931**.
>
> **Del contrato real de la API** (`mantra-core-health-api/src/modules/clinical/dto/medication.dto.ts`):
> `doseText?: string` es **texto libre** (línea 76), `frequencyText?: string` también (95),
> `quantityDecimal?: number` (103) y `unitConceptId?: string` es **opcional** (111). O sea: **quitar
> el control de «Unidad» no rompe el contrato** — la clave se omite y listo.
>
> ⚠️ **Lo que esa verificación NO hizo: ejecutar.** No se abrió la maqueta, no se corrió un test.
> **Que el campo exista en la plantilla no prueba cuándo aparece en pantalla.** Eso es tuyo, y es
> justo lo que decide si C-18 y C-22 ya están cumplidos o no.
>
> 🔧 **Trampa de método:** los números de línea son de `origin/mockup`. El working copy está en otra
> rama. Si algo no aparece, verificá contra qué ref buscás:
> `git show origin/mockup:<ruta> | grep -n '<patrón>'`.

## 2. Resultado observable

| Hito | Prioridad | Qué queda demostrado |
|---|---|---|
| **H1** | `BLOQUEANTE` | La maqueta levanta, el corte está declarado, y hay captura previa del formulario de receta **completo** con sus cuatro variantes visibles (con y sin posología del catálogo, con y sin diagnósticos cargados). Sin eso no se puede demostrar después qué cambió. |
| **H2** | `ALTA` | Escribiendo una receta ya no se puede descargar un PDF, no hay barra de demostración y no hay favoritos. Y está escrito dónde **sí** se descarga. |
| **H3** | `ALTA` | Se puede recetar eligiendo un diagnóstico **o** escribiendo el motivo, y «¿Para qué es esta receta?» es opcional en todos los caminos. |
| **H4** | `ALTA` | La dosis se escribe en palabras —número y unidad juntos— y el campo «Unidad» ya no existe; lo que se guarda sigue siendo lo que el contrato espera. |
| **H5** | `ALTA` | Si el catálogo declara una frecuencia por defecto para ese medicamento, al elegirlo la frecuencia se pone sola y se dice de dónde salió; si no la declara, se escribe como siempre. **Y ninguna frecuencia inventada se presenta como dato real.** |
| **H6** | `ALTA` | Todo lo que es elegir una opción es un `select`, las acciones de la lista de recetas son un desplegable con icono y texto, la regresión está corrida y hay capturas miradas. |

> ⚠️ **Esto es más de lo que entra en una noche, y está dicho a propósito.** Lo que no se cierra queda
> `A MEDIAS` con qué anda, qué no anda y qué falta exactamente (regla 20). **Recortar alcance es
> decisión de coordinación, no tuya, y se registra.**

**Kill-test del turno completo:** abrí una consulta, entrá a «Medicación» y buscá el botón de
descargar, la barra de demostración y el selector de favoritos. Si aparece cualquiera de los tres,
C-15/C-16/C-17 no están hechos. Después elegí un medicamento que declare concentraciones: si no hay
ningún campo donde escribir «500 mg cada 8 horas» en palabras, C-19 no está hecho.

## 3. Alcance

**IN:** captura previa de las variantes del formulario · retiro del botón de descarga del lugar donde
se escribe la receta, con el lugar alternativo declarado · retiro de la barra de demostración **de la
receta** · retiro del selector y del botón de favoritos, y decisión declarada sobre el cliente de
favoritos que queda sin uso · motivo escrito como alternativa al diagnóstico, en todos los caminos ·
«¿Para qué es esta receta?» opcional, con el caso en que hoy se exige identificado y resuelto ·
dosis en texto libre que admite número y unidad · retiro del control «Unidad» sin romper el contrato ·
decisión declarada sobre qué pasa con «Concentración» y «Presentación» cuando la dosis vuelve a ser
texto · frecuencia por defecto leída del catálogo cuando existe, con su procedencia visible · chips
de frecuencia y de duración convertidos en `select` · acciones de la lista de recetas en desplegable
con icono y texto · specs del bloque actualizados al requisito nuevo · regresión dirigida, barrido y
click-sweep · capturas por viewport y tema · `PLAN.md`, `REPORTE.md` y `evidencia/`.

**OUT:** **cualquier archivo fuera de `medication-block/**` y `core/data-access/prescription-favorites/**`** ·
`clinical-record/consultation/**` — **es de Marcelo**, y ahí vive el modal que monta tu bloque y el
manejador del evento `(descargar)`: el cambio que necesites ahí **se lo pedís por el daily** ·
`src/app/core/mock/**` — es de Ender: **el dato de posología no lo cargás vos** · `src/app/shared/**` ·
**el repo de la API**: no se toca `mantra-core-health-api` · **inventar la posología de un
medicamento**: está prohibido por la regla 97.5.4 y tiene precedente propio (B-13) · apagar la
bandera global `demoPresets` del entorno (afecta a otras pantallas; si te parece que hay que hacerlo,
**se propone**) · borrar el cliente de favoritos sin medir quién lo importa · quitar el `conceptId`
del medicamento para «simplificar»: el medicamento **se elige del catálogo**, nunca es texto libre ·
debilitar un spec para que pase · declarar `HECHO` una microtarea cuyo DoD no corriste.

## 4. Plan — hitos, subtareas y microtareas

Los seis estados permitidos son exactamente: `TODO`, `EN CURSO`, `HECHO`, `A MEDIAS`, `BLOQUEADO` y
`DESCARTADO`. **`A MEDIAS` es legítimo; disfrazarlo de `HECHO` no.**

### H1 — Corte, maqueta arriba y las cuatro caras del formulario

**Prioridad:** `BLOQUEANTE`

**CA:** Dado tu entorno, cuando alguien pregunta contra qué versión trabajaste y cómo se veía la receta antes, entonces hay un SHA declarado y capturas de las cuatro variantes del formulario — no un recuerdo.

**DoD:** Las 9 microtareas en `HECHO` o `BLOQUEADO` con el error exacto. Gates de partida con exit code pegado. Capturas en `evidencia/antes/`.

**Kill-test del hito:** pedí la captura del formulario con un medicamento **que declare concentraciones**. Si no existe, no sabés cómo se comporta hoy la mitad de C-19.

**Estado:** TODO

#### H1.S1 — El corte y el entorno

**CA:** Dada tu rama, cuando se la compara con `origin/mockup`, entonces sale de ese corte y el SHA está en tu `PLAN.md`.

**DoD:** Las 3 microtareas en `HECHO`, con la salida de `git log -1` pegada.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H1.S1.M1 | Traer `origin/mockup`, declarar el SHA y salir de ahí con tu rama | El SHA está en tu `PLAN.md` | `git fetch origin && git log -1 --format='%H %ad %s' origin/mockup` → pegada | TODO |
| H1.S1.M2 | Confirmar por tu cuenta que esta rama no habla con ninguna API | Está citado archivo y línea del interruptor | `git show origin/mockup:src/environments/environment.ts \| grep -n mockBackend` → pegada | TODO |
| H1.S1.M3 | Levantar la maqueta, entrar como médica y llegar a «Medicación» de una consulta | La casilla abre con el formulario visible | Ruta usada + captura. Si pide encuentro abierto, abrilo: **eso es parte del camino real** | TODO |

#### H1.S2 — Las cuatro caras del formulario, vistas

**CA:** Dado el formulario, cuando se lo abre en sus cuatro combinaciones, entonces hay una captura de cada una y está escrito qué campos aparecen en cada caso.

**DoD:** Las 3 microtareas en `HECHO`, con las cuatro capturas y la tabla de campos por caso.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H1.S2.M1 | Capturar con un medicamento **sin** posología en el catálogo (aparece «Dosis» en texto) | Está la captura y el nombre del medicamento usado | Captura + nombre. Es el caso en que hoy la dosis es texto libre | TODO |
| H1.S2.M2 | Capturar con un medicamento **con** concentraciones o presentaciones (desaparece «Dosis») | Está la captura y se ve que no hay campo de dosis | Captura + nombre del medicamento. **Este es el caso que C-19 rompe si no se decide qué hacer con los dos selects** | TODO |
| H1.S2.M3 | Capturar con y sin diagnósticos cargados en la historia, para ver cuándo se exige el diagnóstico | Está registrado en qué caso `¿Para qué es esta receta?` aparece como obligatorio | Las dos capturas + el valor observado de `exigeDiagnostico()`. **Esto es lo que decide si C-22 ya está cumplido** | TODO |

#### H1.S3 — Línea de base de gates

**CA:** Dado el estado de partida, cuando algo se ponga rojo después, entonces se puede demostrar si ya estaba rojo antes.

**DoD:** Las 3 microtareas en `HECHO`, con exit codes pegados.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H1.S3.M1 | Correr typecheck y lint antes de tocar nada | Hay exit code de los dos | `yarn typecheck; yarn lint` → `evidencia/antes/gates.txt`. Si ya estaba rojo, **es baseline, no tu bug** | TODO |
| H1.S3.M2 | Correr el spec del bloque de medicación como baseline | Hay salida del runner | `npx ng test --include=src/app/features/clinical-record/patient-chart/medication-block/medication-block.spec.ts --watch=false` → pegada | TODO |
| H1.S3.M3 | Registrar cuántas aserciones del spec dependen de los campos que vas a quitar | Hay un número y la lista | Lista pegada. **Los specs se actualizan al requisito nuevo, nunca se debilitan** (regla 80.5.4) | TODO |

### H2 — Sacar de la receta lo que no va: descarga, demostración y favoritos

**Prioridad:** `ALTA`

**CA:** Dada la pantalla donde se escribe una receta, cuando se la mira completa, entonces no hay botón de descarga, ni barra de casos de demostración, ni nada de favoritos; y está escrito desde dónde se descarga una receta ahora.

**DoD:** Las 9 microtareas en `HECHO` o `BLOQUEADO` con el pedido a Marcelo escrito. Los tres elementos ausentes, verificado en pantalla. Cero código muerto sin anotar.

**Kill-test del hito:** abrí «Medicación» con al menos una receta ya cargada. Si ves «Descargar PDF», «Casos de demostración» o «Usar un favorito», no está hecho.

**Estado:** TODO

#### H2.S1 — La descarga sale de donde se escribe (C-15)

**CA:** Dado el bloque de medicación, cuando se está escribiendo o revisando una receta ahí, entonces no se ofrece descargarla; y quien necesite el papel tiene un camino declarado y probado.

**DoD:** Las 3 microtareas en `HECHO`. El camino alternativo **recorrido**, o declarado `A MEDIAS` con lo que falta. El evento `(descargar)` tratado sin tocar el archivo de Marcelo.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H2.S1.M1 | Registrar por qué ese botón estaba puesto, antes de quitarlo | Está citado el comentario que lo justificaba y la corrección que lo pidió | Fragmento pegado (`medication-block.html:58-61`). **Quitar algo que otra corrección pidió sin nombrarlo es cómo se pierde la razón de un cambio** | TODO |
| H2.S1.M2 | Quitar el botón del bloque y dejar el `output` sin emisor, o retirarlo, sin tocar `consultation/**` | El botón no está y `yarn typecheck` da 0 | Captura + exit code. Si retirar el `output` obliga a cambiar `consultation.html`, **eso es de Marcelo: se lo pedís y lo anotás en los dos dailies** | TODO |
| H2.S1.M3 | Declarar y probar desde dónde se descarga la receta ahora | Hay un camino real recorrido, o está dicho que no existe todavía | Recorrido con captura, o `A MEDIAS` con «no hay camino alternativo, pendiente de decisión» y la ambigüedad `Q-J1` registrada | TODO |

#### H2.S2 — La demostración sale de la receta (C-16)

**CA:** Dado el formulario de receta, cuando se lo abre en la maqueta, entonces no aparece ninguna barra de casos de demostración ni badge «Demo», aunque la bandera de entorno siga encendida para el resto de la aplicación.

**DoD:** Las 3 microtareas en `HECHO`. La bandera global **no** se apagó. El resto de las pantallas que la usan, sin cambios.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H2.S2.M1 | Medir qué otras pantallas usan la bandera de demostración | Hay lista con archivos | `git grep -n "demoPresets\|demoActiva\|casosDemo" -- src/app` → pegada. **Es lo que demuestra que apagar la bandera global sería pasarse de alcance** | TODO |
| H2.S2.M2 | Quitar la barra y sus casos **del bloque de receta**, sin tocar la bandera | La barra no aparece; las otras pantallas siguen igual | Captura de la receta + captura de una de las otras pantallas de la lista, intacta | TODO |
| H2.S2.M3 | Verificar que no quedó código de casos de demostración sin uso en tu archivo | Cero constantes muertas | `yarn lint` exit 0 + `git grep -n casosDemo -- src/app/features/clinical-record` vacío | TODO |

#### H2.S3 — Los favoritos salen (C-17)

**CA:** Dado el formulario, cuando se lo recorre completo, entonces no hay selector «Usar un favorito» ni botón «Guardar como favorito», y ninguna petición de favoritos sale al abrirlo.

**DoD:** Las 3 microtareas en `HECHO`. Pestaña de red revisada: cero llamadas a favoritos. La decisión sobre el cliente huérfano, escrita.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H2.S3.M1 | Quitar el selector, el botón y el aviso de error de favoritos | Los tres no están | Captura + `yarn typecheck` exit 0 | TODO |
| H2.S3.M2 | Verificar en la pestaña de red que ya no se pide nada de favoritos al abrir | Cero peticiones a `prescription-favorites` | Captura de la pestaña de red. **«No vi errores» no es evidencia: mirá la red** (regla 60) | TODO |
| H2.S3.M3 | Medir quién más importa el cliente de favoritos y **proponer** qué hacer con él | Hay número y propuesta escrita | `git grep -n "prescription-favorites" -- src/app \| grep -v spec` → pegada. Si queda sin uso, la propuesta de retiro es **una microtarea nueva registrada**, no un borrado de paso (regla 00 §3) | TODO |

### H3 — El motivo y el para qué

**Prioridad:** `ALTA`

**CA:** Dada una receta que no tiene detrás un diagnóstico registrado, cuando se la prescribe, entonces se puede escribir el motivo en palabras y la receta se guarda con ese motivo; y en ningún camino «¿Para qué es esta receta?» impide guardar por estar vacío.

**DoD:** Las 9 microtareas en `HECHO` o `DESCARTADO` **con la evidencia de que ya estaba cumplido**. Los dos casos recetados de verdad y releídos de la lista. Ambigüedad `Q-D4` cerrada con observación, no con suposición.

**Kill-test del hito:** recetá algo sin elegir ningún diagnóstico y sin escribir nada en «¿Para qué es esta receta?». Si no te deja guardar, C-22 no está hecho. Después recetá escribiendo un motivo libre: si el motivo no aparece en la receta releída, C-18 no está hecho.

**Estado:** TODO

#### H3.S1 — Qué de esto ya está hecho (y se demuestra, no se supone)

**CA:** Dada la pantalla, cuando se la ejercita, entonces está registrado exactamente qué pide C-18 y C-22 que ya funcione y qué no, con captura de cada caso.

**DoD:** Las 3 microtareas en `HECHO`. Cada parte ya cumplida cierra `DESCARTADO` **con su captura**; nunca `HECHO` sin haberla ejercitado.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H3.S1.M1 | Ejercitar el campo de motivo libre actual y registrar **cuándo** aparece | Está escrita la condición real observada, no la leída del código | Captura con el campo visible y con el campo ausente + la condición | TODO |
| H3.S1.M2 | Resolver a qué campo se refiere C-18: el rótulo que cita es «De que consulta es la receta» | Está decidido y escrito, con el razonamiento | Decisión + las dos capturas (el selector de cita y el de diagnóstico). **Son dos campos distintos y el doctor nombró el primero**: registralo como `Q-J2` y seguí con el supuesto | TODO |
| H3.S1.M3 | Ejercitar «¿Para qué es esta receta?» en el caso donde hoy se exige | Está identificado el caso y qué lo dispara | Captura del campo marcado obligatorio + el valor de la condición. Si no se exige en ningún caso, **C-22 cierra `DESCARTADO` con esa evidencia** | TODO |

#### H3.S2 — Escribir el motivo, siempre que haga falta (C-18)

**CA:** Dada una prescripción, cuando no hay diagnóstico previo o no hace falta, entonces se puede escribir el motivo y queda guardado como el motivo de la receta.

**DoD:** Las 3 microtareas en `HECHO`. La receta **releída del servidor** con el motivo puesto, no la respuesta del alta.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H3.S2.M1 | Ofrecer el motivo escrito en todos los caminos donde no hay diagnóstico elegido | El campo está disponible sin tener que elegir una opción especial | Captura de los caminos + la condición nueva | TODO |
| H3.S2.M2 | Recetar con motivo escrito y **releer la lista** | El motivo aparece en la receta releída | Captura de la lista tras recargar. **Una receta que aparece porque la pintamos nosotros no prueba que el servidor la tenga** | TODO |
| H3.S2.M3 | Verificar qué campo del contrato lleva ese motivo | Está citado el campo del DTO donde viaja | Localizador del contrato + la petición pegada. **Si no hay campo, es brecha del contrato y se registra** — no se mete el motivo en un campo que significa otra cosa | TODO |

#### H3.S3 — Opcional de verdad (C-22)

**CA:** Dada cualquier receta, cuando se deja vacío «¿Para qué es esta receta?», entonces se puede prescribir igual.

**DoD:** Las 3 microtareas en `HECHO`. El caso ejercitado en el escenario donde hoy se exige. Ninguna validación del servidor rota en el intento.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H3.S3.M1 | Hacer el campo opcional también en el caso donde hoy se exige | Se puede guardar vacío en los dos escenarios | Los dos casos ejercitados con captura | TODO |
| H3.S3.M2 | Verificar que el servidor simulado acepta la receta sin ese dato | La receta queda creada y se relee | Petición y respuesta pegadas + lista recargada | TODO |
| H3.S3.M3 | Registrar si el contrato real lo exige, leyéndolo | Está dicho si es opcional en el DTO | Localizador del DTO pegado. Si el contrato real lo **exige**, la maqueta no puede decidir lo contrario en silencio: se registra el choque | TODO |

### H4 — La dosis en palabras, y «Unidad» afuera

**Prioridad:** `ALTA`

**CA:** Dada una prescripción, cuando se escribe la dosis, entonces se puede poner número y unidad en el mismo campo —«500 mg»— en **todos** los casos, incluido el de un medicamento que declara concentraciones; y el campo «Unidad» ya no existe.

**DoD:** Las 9 microtareas en `HECHO`. Las dos variantes ejercitadas. Lo guardado verificado releyendo. `unitConceptId` omitido, no enviado vacío.

**Kill-test del hito:** elegí un medicamento que declare concentraciones. Si no podés escribir la dosis en palabras, o si lo que escribiste se pierde al guardar, no está hecho.

**Estado:** TODO

#### H4.S1 — Decidir qué manda cuando hay catálogo (C-19)

**CA:** Dado un medicamento con concentraciones y presentaciones declaradas, cuando se prescribe, entonces está claro y escrito cuál es la fuente de la dosis, y no hay dos fuentes compitiendo por el mismo dato.

**DoD:** Las 3 microtareas en `HECHO`, con la decisión escrita antes de escribir el código.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H4.S1.M1 | Leer `posologia()` y registrar qué pisa hoy cuando hay catálogo | Está escrito que compone concentración + presentación y que **ignora** el campo de texto | Fragmento pegado (`medication-block.ts:931`). **Este es el choque real de C-19**: dos fuentes para `doseText` | TODO |
| H4.S1.M2 | Decidir y escribir la regla: la dosis en texto manda siempre, y los selects del catálogo **rellenan** ese texto | La decisión está escrita con su consecuencia | Decisión en el `PLAN.md` + registro de `Q-J3`. **Prohibido resolverlo por conveniencia sin registrarlo** (regla 00 §1.7) | TODO |
| H4.S1.M3 | Verificar que el contrato acepta la forma elegida | `doseText` es texto libre y lo confirmaste abriendo el DTO | Localizador pegado (`medication.dto.ts:76`) | TODO |

#### H4.S2 — El campo de dosis, siempre disponible

**CA:** Dado cualquier medicamento, cuando se abre el formulario, entonces hay un campo de dosis que acepta letras y números, con su etiqueta accesible y su ejemplo.

**DoD:** Las 3 microtareas en `HECHO`. Las dos variantes capturadas. Lo escrito, releído después de guardar.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H4.S2.M1 | Ofrecer el campo de dosis en texto en los dos casos | Aparece con y sin catálogo | Las dos capturas | TODO |
| H4.S2.M2 | Prescribir con dosis escrita y releer la receta | Lo escrito es lo que aparece en la lista releída | Captura tras recargar. Si el select de catálogo pisó el texto, **eso es un `PRODUCT_BUG` tuyo y se corrige, no se documenta** | TODO |
| H4.S2.M3 | Verificar etiqueta accesible y que el placeholder no hace de etiqueta | El campo tiene `label` real | Captura + revisión con teclado. Regla 95.3.5 | TODO |

#### H4.S3 — «Unidad» afuera, sin romper el contrato

**CA:** Dado el formulario, cuando se lo recorre, entonces no hay control «Unidad», y la receta guardada no manda un `unitConceptId` vacío ni inválido.

**DoD:** Las 3 microtareas en `HECHO`. La petición pegada mostrando que la clave **no viaja**. Las recetas viejas que ya tenían unidad, siguen leyéndose.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H4.S3.M1 | Quitar el control «Unidad» y su binding | El control no está | Captura + `yarn typecheck` exit 0 | TODO |
| H4.S3.M2 | Verificar que la clave se **omite** en la petición, no se manda vacía | La petición no incluye `unitConceptId` | Cuerpo de la petición pegado. Mandar `null` o `''` donde el DTO espera un uuid es un 422 esperando pasar | TODO |
| H4.S3.M3 | Verificar que una receta vieja **con** unidad se sigue mostrando bien | La lista no se rompe con los datos previos | Captura de una receta del fixture que tenga unidad. **Quitar un campo del formulario no borra los datos que ya existen** | TODO |

### H5 — La posología por defecto: el mecanismo sí, el dato clínico inventado **no**

**Prioridad:** `ALTA`

**CA:** Dado un medicamento cuyo catálogo declara una frecuencia por defecto, cuando se lo elige, entonces la frecuencia se completa sola, se dice de dónde salió y se puede cambiar donde el catálogo no la imponga; y dado uno que no la declara, la frecuencia se escribe como hasta ahora.

**DoD:** Las 9 microtareas en `HECHO` o `BLOQUEADO` con el pedido a Ender escrito. **Ninguna frecuencia escrita por vos y presentada como dato del catálogo.** El origen del valor visible en la pantalla.

**Kill-test del hito:** preguntá de dónde salió la frecuencia que apareció sola. Si la respuesta es «la puse yo en el código», el hito está **mal hecho**, aunque la pantalla se vea perfecta: eso es exactamente lo que la regla 97.5.4 prohíbe.

**Estado:** TODO

#### H5.S1 — Leer la posología del catálogo, sin inventarla

**CA:** Dado el mecanismo, cuando se le pregunta de dónde viene una frecuencia por defecto, entonces la respuesta es una propiedad del concepto del catálogo, con su clave, y no una tabla escrita en el componente.

**DoD:** Las 3 microtareas en `HECHO`. La clave de propiedad acordada con Ender **por escrito**. Cero literales de frecuencia por medicamento en tu código.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H5.S1.M1 | Leer cómo entra hoy la posología del catálogo y reusar ese mismo camino | Está citado el método y las dos claves que ya se usan | Fragmento pegado (`medication-block.ts:900-913`, `dose_forms`, `strengths`). **Es el patrón presente: se sigue, no se inventa otro** (regla 00 §4) | TODO |
| H5.S1.M2 | Acordar con Ender la clave de la propiedad nueva y su forma | La clave y su forma están escritas en los dos dailies | Acuerdo pegado. Si Ender no la publicó todavía, esta microtarea queda `BLOQUEADO` **y aplicás la regla 65**: simulás la ficha del concepto en sus tres niveles (con la propiedad, con la propiedad vacía, con la propiedad mal formada) y seguís | TODO |
| H5.S1.M3 | Verificar que **no** escribiste ninguna frecuencia por medicamento en tu código | Cero literales de este tipo | `git grep -nE "cada [0-9]+ horas" -- src/app/features/clinical-record/patient-chart/medication-block` revisado uno por uno: los ejemplos de placeholder están permitidos, **una tabla medicamento → frecuencia no** | TODO |

#### H5.S2 — Completar sola, y decir de dónde salió

**CA:** Dado un medicamento con frecuencia declarada, cuando se lo elige, entonces la frecuencia aparece puesta y la pantalla dice que viene del catálogo, no de una elección del profesional.

**DoD:** Las 3 microtareas en `HECHO`. Los tres niveles del contrato ejercitados: con propiedad, sin propiedad, con propiedad inválida.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H5.S2.M1 | Completar la frecuencia al elegir el medicamento | El campo queda con el valor del catálogo | Captura antes y después de elegir | TODO |
| H5.S2.M2 | Decir en la pantalla de dónde salió el valor | Se lee que es del catálogo, no una sugerencia tuya | Captura del texto. **Un dato clínico que aparece sin decir su origen se lee como una recomendación del sistema**, y eso es lo que no puede pasar | TODO |
| H5.S2.M3 | Ejercitar los tres niveles: con propiedad, sin propiedad y con propiedad mal formada | Los tres casos se comportan de forma declarada y ninguno rompe la pantalla | Las tres capturas. El caso inválido **no** puede dejar el formulario inservible (regla 65 §2) | TODO |

#### H5.S3 — Cuándo se puede cambiar, y qué queda pendiente

**CA:** Dada una frecuencia que el catálogo impone, cuando el profesional intenta cambiarla, entonces el sistema hace lo que la fuente diga que corresponde — y si la fuente no lo dice, **eso está registrado como pendiente y no se decide por analogía**.

**DoD:** Las 3 microtareas en `HECHO`. La ambigüedad registrada con dueño. Nada presentado como regla clínica sin fuente.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H5.S3.M1 | Registrar la distinción que pide el pedido: frecuencia obligatoria vs sugerida | Está escrito que el pedido las distingue y que el catálogo hoy **no** publica esa distinción | Registro de `Q-J4` con dueño (negocio). **Decidir vos cuál es obligatoria es inferir dato clínico**: prohibido | TODO |
| H5.S3.M2 | Implementar el comportamiento del caso que sí está definido, y dejar el otro pendiente | El caso definido funciona; el indefinido está declarado, no adivinado | Captura + el pendiente escrito en el `REPORTE.md` | TODO |
| H5.S3.M3 | Dejar constancia del límite del catálogo actual, citando su propia licencia | Está citado que el vademécum se declara dato de desarrollo sin fuente autoritativa | Cita pegada (`vademecum.dataset.json`, campo `license`) + referencia a **B-13** en `REGISTRO-DEFECTOS.md` de la API. **Es el precedente de la casa para este mismo problema** | TODO |

### H6 — Opciones en `select`, acciones en desplegable, regresión y cierre

**Prioridad:** `ALTA`

**CA:** Dado el formulario de receta, cuando se elige un valor de una lista, entonces se elige en un `select` y no en una fila de chips; dadas las acciones de una receta de la lista, se abren en un desplegable con icono y texto; y dado el turno cerrado, la regresión está corrida y las capturas están miradas.

**DoD:** Las 9 microtareas en `HECHO`. Medición de chips antes y después. Gates y barrido con salida pegada. `REPORTE.md` escrito.

**Kill-test del hito:** contá las filas de chips que eligen un valor en tu formulario. Si el número no bajó a cero y no hay una justificación por cada una que quedó, C-21 no está aplicado en tu parte.

**Estado:** TODO

#### H6.S1 — Todo lo que es opción, `select` (C-21)

**CA:** Dadas la frecuencia y la duración, cuando se eligen, entonces se eligen de un `select` con sus opciones, sin perder la posibilidad de escribir algo que no esté en la lista donde eso tenga sentido.

**DoD:** Las 3 microtareas en `HECHO`. La regla que publique Itzan aplicada, no una propia. Lo que se escribía a mano, sigue siendo posible donde corresponde.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H6.S1.M1 | Medir cuántos grupos de chips de elección hay en tu formulario | Hay número y lista | `git grep -c "app-chip" -- src/app/features/clinical-record/patient-chart/medication-block` → pegado | TODO |
| H6.S1.M2 | Convertir los chips de frecuencia y de duración en `select`, reusando el átomo | Los dos son `select` y siguen produciendo el mismo valor | Capturas + el valor guardado verificado releyendo. Seguí la regla que publica Itzan (su H6); **si difiere de lo que hacés, gana la suya y lo anotás** | TODO |
| H6.S1.M3 | Conservar la escritura libre donde el pedido no la quita | Frecuencia sigue admitiendo un texto que no está en la lista | Caso ejercitado. **C-21 pide que las opciones sean `select`, no que se prohíba escribir**: convertirlo en lista cerrada sería cambiar la semántica del requisito (regla 00 §1.6) | TODO |

#### H6.S2 — Acciones de la lista de recetas en desplegable (C-06)

**CA:** Dada una receta de la lista, cuando se abren sus acciones, entonces hay un desplegable donde firmar, emitir y lo que quede tienen icono y texto.

**DoD:** Las 3 microtareas en `HECHO`. Componente de Itzan reusado. Teclado verificado.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H6.S2.M1 | Medir los `iconOnly` y los botones sin texto de tu área | Hay número | `git grep -c "iconOnly" -- src/app/features/clinical-record/patient-chart/medication-block` → pegado | TODO |
| H6.S2.M2 | Poner las acciones de cada receta en el desplegable del sistema de diseño | Cada opción tiene icono y texto | Captura del desplegable abierto. **No escribas un componente nuevo**: `shared/**` es de Itzan | TODO |
| H6.S2.M3 | Verificar el desplegable con teclado y con `Escape` | Se abre, se recorre y se cierra sin puntero | Recorrido pegado | TODO |

#### H6.S3 — Regresión, prueba visual y cierre

**CA:** Dado el turno cerrado, cuando alguien que no lo vivió lee tu reporte, entonces sabe qué quedó demostrado, qué quedó a medias con las cuatro respuestas y qué quedó pendiente de decisión.

**DoD:** Las 3 microtareas en `HECHO`. Gates en 0, specs actualizados en verde, barrido corrido serial, capturas en 3 viewports × 2 temas miradas.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H6.S3.M1 | Gates estáticos y specs del bloque, actualizados al requisito nuevo | Exit 0 y specs en verde | `yarn typecheck; yarn lint; npx ng test --include=.../medication-block/medication-block.spec.ts --watch=false` → pegadas. **Un spec que probaba el campo «Unidad» se actualiza al requisito, no se borra ni se saltea** | TODO |
| H6.S3.M2 | Barrido y click-sweep de la maqueta, serial | Las filas del expediente y la consulta están limpias | Las dos salidas + rutas de los artefactos pegadas, con `--workers=1` | TODO |
| H6.S3.M3 | Capturas 3 viewports × 2 temas del formulario y de la lista, **miradas**, y `REPORTE.md` | Cada captura tiene su observación escrita; el reporte abre con `AVANCE: <HECHO> / 54` | Índice de capturas + archivo en disco con las tres secciones | TODO |

## 5. Ambigüedades registradas — **no las resuelvas, anotalas**

| ID | Ambigüedad | Quién puede resolverla | Qué bloquea | Supuesto con el que seguís |
|---|---|---|---|---|
| Q-D4 | C-18 y C-22 **parecen ya cumplidos** en el corte | Doctor | Nada: se verifica ejercitando | Lo que ya esté cumplido cierra `DESCARTADO` **con captura**, nunca `HECHO` sin ejercitar |
| Q-D6 | C-20 pide frecuencias «de fábrica» y el catálogo declara no tener fuente autoritativa | Negocio + doctor | El **dato**, no el mecanismo | El mecanismo se implementa; el dato se declara sintético con procedencia (precedente B-13) |
| Q-J1 | C-15 dice «eso es fuera de la receta» sin decir dónde | Doctor | Sólo el camino alternativo | Se quita del formulario y queda disponible sobre la receta ya emitida; si ese camino no existe, se declara `A MEDIAS` |
| Q-J2 | C-18 cita el rótulo «De que consulta es la receta», que es el selector de **cita**, no el de diagnóstico | Doctor | Cuál de los dos campos se toca | Se interpreta que habla del motivo de la receta (el del diagnóstico), porque el resto de la frase habla de diagnóstico previo. **Se confirma** |
| Q-J3 | C-19 no dice qué pasa con «Concentración» y «Presentación» cuando la dosis vuelve a ser texto | Doctor | La forma final del formulario | La dosis en texto manda; los selects del catálogo **rellenan** ese texto y no son una segunda fuente |
| Q-J4 | C-20 distingue medicamentos cuya frecuencia es obligatoria de los que no, y el catálogo **no publica** esa distinción | Negocio (con fuente clínica) | Sólo el caso obligatorio | Se implementa el caso definido; el otro queda pendiente declarado. **Decidir cuál es obligatoria sin fuente es inferir dato clínico: prohibido** |
| Q-J5 | C-17 no dice qué hacer con el cliente de favoritos que queda sin uso | Coordinación | Nada de esta noche | Se mide quién lo importa y se **propone** el retiro como microtarea nueva |

<ejemplos>
Dos formas de cerrar la misma microtarea. La diferencia no es de redacción: es que una se puede
auditar y la otra no.

<ejemplo tipo="aceptable" microtarea="H4.S3.M2">
El cuerpo de la petición de alta no incluye la clave `unitConceptId` (`evidencia/h4/peticion-sin-unidad.json`), la receta quedó creada y al recargar la lista muestra «Paracetamol · 500 mg cada 8 horas» (`evidencia/h4/lista-tras-recargar.png`).

Estado: HECHO · Veredicto: PASS · Peldaño: VERIFIED
</ejemplo>

<ejemplo tipo="prohibido" microtarea="H4.S3.M2">
Quité el campo Unidad. El backend la acepta igual porque es opcional.

Estado: HECHO
</ejemplo>

Por qué el segundo no vale: «es opcional» sale de leer el DTO, no de haber mandado la petición. Sin el cuerpo pegado no se sabe si la clave viaja en `null`, que es un 422 esperando pasar.
</ejemplos>

## 6. Definition of Done del turno

- [ ] Las **54 microtareas** están en `HECHO`, en `BLOQUEADO` con su causa y el pedido escrito, en `DESCARTADO` con la evidencia de que ya estaba cumplido, o en `A MEDIAS` con qué anda, qué no anda, qué falta y dónde quedó.
- [ ] **Ninguna microtarea quedó en `EN CURSO`** al cerrar.
- [ ] Cada hito y cada subtarea tienen su Estado actualizado.
- [ ] Todo veredicto es `PASS`/`FAIL`/`NOT_RUN`/`BLOCKED`. **Ningún `PASS` sin comando y salida pegados.**
- [ ] El corte está declarado con su SHA y los localizadores del reporte son **tuyos**.
- [ ] Escribiendo una receta no se puede descargar el PDF, y está declarado desde dónde sí.
- [ ] No hay barra de demostración en la receta, **y la bandera global sigue como estaba**.
- [ ] No hay favoritos, y la pestaña de red lo confirma: cero peticiones al abrir.
- [ ] Se puede recetar con motivo escrito, y el motivo aparece **releyendo** la lista, no sólo en la respuesta del alta.
- [ ] Se puede recetar dejando «¿Para qué es esta receta?» vacío, en los dos escenarios.
- [ ] La dosis se escribe en palabras en **los dos** casos de catálogo, y lo escrito sobrevive al guardado.
- [ ] No existe el control «Unidad», y la petición **omite** la clave en vez de mandarla vacía.
- [ ] Una receta vieja con unidad se sigue mostrando bien.
- [ ] **Ninguna frecuencia por medicamento escrita por vos**: el valor sale del catálogo y la pantalla dice de dónde.
- [ ] Los tres niveles del contrato de la ficha del concepto ejercitados: con propiedad, sin propiedad y con propiedad mal formada.
- [ ] La distinción «frecuencia obligatoria vs sugerida» está **registrada como pendiente con dueño**, no decidida por vos.
- [ ] Las opciones se eligen en `select`, y donde el pedido no lo quita, sigue siendo posible escribir.
- [ ] Las acciones de cada receta están en un desplegable con icono y texto, recorrible con teclado.
- [ ] Cero archivos tocados fuera de `medication-block/**` y `prescription-favorites/**`. Lo que hizo falta en `consultation/**` está **acordado con Marcelo y anotado en los dos dailies**.
- [ ] Ningún spec borrado, saltado ni debilitado. Ningún timeout subido. Ningún reintento agregado.
- [ ] Capturas en 3 viewports × 2 temas, **miradas**, cada una con su observación.
- [ ] Ningún proceso quedó corriendo al cerrar, o está declarado cuál y por qué.
- [ ] Avance reportado como `microtareas HECHO / 54`, **no** como porcentaje a ojo.
- [ ] Ningún dato real de paciente en ninguna salida pegada. Las cuentas `@alovida.mock` son sintéticas declaradas.

## 7. Handoff — avisá por el daily al cerrar cada hito, no al final

| Al cerrar | A quién | Qué exactamente |
|---|---|---|
| **H1** | Todo el equipo | El SHA del corte, y si los gates ya estaban rojos antes |
| **H2** | Marcelo | Que el `output` de descarga cambia: el modal de la consulta es suyo |
| **H2** | Ender | Si al quitar favoritos quedó un manejador simulado sin consumidor |
| **H3** | Marcelo | Qué quedó `DESCARTADO` por estar ya cumplido, con su captura: entra en su dictamen |
| **H4** | Ender | Qué forma final tiene `doseText`, porque su catálogo la alimenta |
| **H5** | Ender | **La clave de propiedad de la frecuencia por defecto**: es el acuerdo que destraba tu H5 |
| **H5** | Marcelo | Que la posología queda con un pendiente de negocio, para el dictamen |
| **H6** | Itzan | Cuántos chips y cuántos `iconOnly` quedaron en tu área, y por qué |
| **H6** | Pablo | Que la receta se prueba dentro de un encuentro, y su regla de «una consulta a la vez» cambia tu camino de prueba |

Si un bloqueo se confirma, **no iteres sobre él**: registrá la causa, escribí el pedido, y pasá a la
siguiente microtarea independiente. Antes de declarar `BLOQUEADO`, leé la **regla 65**: si el
contrato de lo que te falta se puede nombrar, se simula en sus tres niveles —correcto, límite e
inválido— y la microtarea **se cierra contra el doble**, declarando que se cerró así. En tu lote esto
aplica sobre todo a H5: la ficha del concepto con su propiedad de frecuencia se puede simular hoy.
