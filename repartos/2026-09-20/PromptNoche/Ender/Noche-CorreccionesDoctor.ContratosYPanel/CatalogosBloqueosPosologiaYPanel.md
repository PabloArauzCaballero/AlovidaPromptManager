# Los contratos que faltan y un panel que diga la verdad

> **Rol:** propietario del contrato simulado, los catálogos y el panel de inicio · **Línea:** A · **Fecha:** 2026-09-20 · **Turno:** noche
> **Fuente del pedido:** [`CORRECCIONES-DOCTOR-2026-09-20.md`](../../../../../docs/requisitos/CORRECCIONES-DOCTOR-2026-09-20.md) · **Verificación contra el código:** [`VERIFICACION-CONTRA-CODIGO-2026-09-20.md`](../../../../../docs/verificacion/VERIFICACION-CONTRA-CODIGO-2026-09-20.md)
> **Correcciones que cubrís: C-03, C-12 (contrato), C-13 (contrato), C-20 (catálogo), C-24** — 5 de 24.
> **6 hitos · 18 subtareas · 55 microtareas**, todas con criterio de aceptación y Definition of Done.

> ### 🔑 Tu lote es el que alimenta a los otros
>
> Sos el único dueño de `src/app/core/mock/**`. **Tres de los otros cuatro te esperan:** Pablo
> necesita la excepción de horario extra y el motivo del bloqueo de servicios; Justin necesita la
> clave de propiedad de la frecuencia por defecto; Marcelo necesita poder guardar filas de su
> cuadrícula. **Publicá el contrato antes de terminar la pantalla**: un manejador que existe destraba
> a otra persona; un panel bonito no destraba a nadie.
>
> Y el límite que ordena todo tu lote: **el simulador es un doble declarado del contrato real
> (regla 65), no una licencia para inventarlo.** Antes de agregar un endpoint o un campo, se busca el
> equivalente en `mantra-core-health-api` y se cita. Si no existe, el manejador se escribe **igual**,
> pero declarando que es un doble y registrando la brecha del contrato real como hallazgo.

## 0. Ficha de asignación

| Campo | Valor |
|---|---|
| `REPO` | `alovida/mantra-core-health` (frontend Angular). El repo de la API se **lee**, no se escribe |
| `TARGET_REF` | `origin/mockup` — corte leído **`689697821a6e6d2c8f702c7508d6728fa9a1869a`** (PR #554, 2026-09-20T12:32-04). **Reconsultalo y fijá el tuyo** |
| `REF DE LA API PARA CITAR CONTRATOS` | `origin/dev` de `mantra-core-health-api` = `c2c071a4`. **Sólo lectura** |
| `RAMA DE TRABAJO` | Una tuya, saliendo de `origin/mockup`. **Nada directo sobre `mockup`, nada sin PR** |
| `ARCHIVOS RESERVADOS PARA VOS` | `src/app/core/mock/**` · `src/app/features/dashboard/**` · `src/app/core/data-access/**` (menos `prescription-favorites/**`, que es de Justin) |
| `ARCHIVOS DE OTROS — NO LOS TOQUES` | `features/agenda/**` y `my-services/**` (Pablo) · `patient-chart/medication-block/**` (Justin) · `patient-chart/free-note-block/**`, `admission-block/**`, `clinical-record/consultation/**` (Marcelo) · `src/app/shared/**` y `account/my-profile/**` (Itzan) |
| `LA MAQUETA NO TIENE BACKEND` | `mockBackend: true` fijo en `src/environments/environment.ts`. **Vos sos el backend de esta rama**, y por eso este lote es el que más cuidado exige con la regla 00 §1.3 |
| `CUENTA DE PRUEBA` | `medica@alovida.mock` y `visitador@alovida.mock`. **Sintéticas declaradas** |
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

Son **26**: 11 del proceso y 15 propias de los contratos, los catálogos y el panel.

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
| `terminology-value-sets` | **la primera de tu lote**: catálogo cerrado, conceptos codificados y por qué un enum del lenguaje no es un catálogo |
| `seed-data-catalogs` | procedencia obligatoria de todo dato de catálogo, y qué es sintético declarado |
| `medication-prescription-safety` | qué no se puede inferir de un medicamento, y por qué la posología es el caso extremo |
| `synthetic-test-data-generation` | datos válidos e inválidos a propósito, deterministas |
| `edge-case-data-catalog` | los bordes que hay que simular además del caso feliz |
| `appointment-scheduling` | bloqueos, excepciones y disponibilidad calculada |
| `api-openapi-docs` | cómo se documenta un contrato y qué es un cambio que rompe |
| `error-handling-contract` | los códigos que el cliente distingue son parte del contrato |
| `dashboard-data-ui` | qué va en un panel, qué no, y cómo se agrega sin mentir |
| `frontend-data-access` | cliente de datos, estados y mapeo del error |
| `frontend-ux-states` | cargando, con datos, vacío y error: los cuatro |
| `frontend-accessibility` | un mapa de calor no puede decir su información sólo con color |
| `color-systems` | tono semántico y contraste, en claro y oscuro |
| `visual-proof` | la captura no vale si no la mirás |
| `unit-testing` | un comportamiento por test; el manejador simulado también se prueba |

Entrá siempre por `skills-router`: **no leas el catálogo entero, no sirve.**

### 1.4 DoD de esta sección — se verifica como cualquier otra

- [ ] `ls .claude/skills | wc -l` devolvió **176**, y la salida está pegada en tu daily.
- [ ] `python .claude/hooks/plan_gate.py --self-test` devolvió **11 PASS, 0 FAIL**, salida pegada.
- [ ] Leíste `skills-router` y las 26 skills de las dos tablas, **empezando por `terminology-value-sets` y `seed-data-catalogs`**.
- [ ] Creaste tu `PLAN.md` **antes** del primer `Edit`/`Write` de código.

**Sin estas cuatro casillas, tu lote arranca en `BLOQUEADO`, no en `EN CURSO`.**

> ### ✅ Hechos ya verificados contra el corte — no los repitas, pero tampoco los creas sin abrir el archivo
>
> Todo con archivo y línea en
> [`VERIFICACION-CONTRA-CODIGO-2026-09-20.md`](../../../../../docs/verificacion/VERIFICACION-CONTRA-CODIGO-2026-09-20.md).
> Lo que más te importa:
>
> - **Los motivos de bloqueo son una lista cerrada de 7, y «OTROS SERVICIOS» no está.** En la API:
>   `src/modules/scheduling/dto/scheduling-catalog.dto.ts:735`,
>   `EXCEPTION_TYPES = ['ABSENCE','HOLIDAY','VACATION','CONFERENCE','ERRAND','EXTRA','OTHER']`,
>   validado con `@IsIn(EXCEPTION_TYPES)` (754), servido por `GET /scheduling/exception-types`
>   (`scheduling.controller.ts:458`). En el simulador: `core/mock/handlers/scheduling.handlers.ts:29-35`
>   (`TIPOS_DE_BLOQUEO`), listado en la **557** y creado en la **571**. El propio DTO dice que
>   *«`OTHER` **exige** el texto libre de `reason`: es lo que permite que la lista se quede corta sin
>   bloquear a nadie, y lo que la gente escriba ahí es la mejor fuente para ampliarla después»*.
>   **Ese es el camino sin romper contrato.**
> - **`EXTRA` es el único tipo con `blocks: false`**, porque **añade** disponibilidad en vez de
>   quitarla. Es con lo que se modela el horario extra por emergencia que necesita Pablo.
> - **Las «otras atenciones» de C-24 ya tienen su tipología en el contrato:**
>   `ACTIVITY_TYPES = ['APPOINTMENT','PROCEDURE','FOLLOW_UP','TELEHEALTH','OTHER']`
>   (`scheduling-catalog.dto.ts:921`), servida por `GET /scheduling/activity-types`
>   (`scheduling.controller.ts:436`) y ya simulada (`scheduling.handlers.ts:547`). **Una colonoscopia
>   o una toma de muestra es `PROCEDURE`, no una categoría nueva.** Y el DTO trae `tone` y no color,
>   con este comentario: *«el pedido dice "con otros colores", pero **el color concreto es del sistema
>   de diseño**, no de la API»*.
> - **«Canceladas» ya existe como filtro**: `incluirCanceladas()` en `features/agenda/agenda.ts`,
>   atado al query param `canceladas=si`. **No hay que inventar un estado nuevo.**
> - **No existe ningún endpoint de analítica de consultas.** El módulo `reporting` de la API es un
>   motor de definiciones de reporte y **todos sus verbos son `POST`** (`reporting.controller.ts`:
>   `data-sources`, `definitions`, `executions`, `dashboards`…). El único precedente de analítica
>   servida es de seguros: `GET /insurance/analytics/loss-ratio`
>   (`core/mock/handlers/insurance-analytics.handlers.ts:115`, **con su spec al lado**). Ese es el
>   patrón si agregás uno.
> - **El vademécum declara su propia falta de fuente.** `mantra-core-health-api/src/common/seed/data/vademecum/vademecum.dataset.json`,
>   campo `license`: *«Dato de desarrollo sin fuente autoritativa — contenido escrito a mano para
>   ejercitar la receta en desarrollo, no apto para uso clínico ni producción (ver B-13 en
>   REGISTRO-DEFECTOS.md)»*. Tiene **17 conceptos** y exactamente cuatro propiedades:
>   `therapeutic_class`, `strengths`, `routes`, `dose_forms`. **Cero apariciones de `frequency`.**
> - **El precedente de la casa para este problema está escrito**: **B-13** en
>   `mantra-core-health-api/REGISTRO-DEFECTOS.md:101` — se resolvió pasando de 3 fuentes inventadas a
>   1 declarada como dato de desarrollo, más un gate de producción. **Copiá ese camino.**
> - **El visitador no accede a información clínica** y la visita comercial **no se mezcla** con la
>   agenda clínica: citado de la especificación en `core/data-access/pharma-lab/pharma-lab.types.ts:9`.
>   Ahí también vive el tipo *«Ventana semanal en la que un doctor recibe visitadores»* (línea 102) y
>   `durationMinutes` por solicitud (`pharma-lab.handlers.ts:64-65`).
> - **El panel hoy no tiene ni un gráfico**: `features/dashboard/dashboard.html` sólo tiene «Tus
>   accesos» (81), «Últimos pacientes» (117) y `<app-agenda-de-hoy>` (67). El globo `appTooltip` ya se
>   usa en `dashboard/access-tree/access-tree.html:94-95` y **110-111**, y `agenda-de-hoy.html` **no
>   tiene ninguno**.
> - **Cómo se verifica el simulador entero:**
>   `npx ng test --include=src/app/core/mock/mock-backend.spec.ts --watch=false` — cada ruta con cada
>   cuenta, nada lanza ni devuelve 500. **Ese spec es tu red de seguridad: corrélo después de cada
>   manejador nuevo.**
>
> ⚠️ **Lo que esa verificación NO hizo: ejecutar.** No se corrió un test ni se abrió la maqueta.
>
> 🔧 **Trampa de método:** los números de línea son de `origin/mockup` y de `origin/dev` de la API.
> Verificá contra qué ref buscás antes de concluir que algo no existe:
> `git show origin/mockup:<ruta> | grep -n '<patrón>'`.

## 2. Resultado observable

| Hito | Prioridad | Qué queda demostrado |
|---|---|---|
| **H1** | `BLOQUEANTE` | La maqueta levanta, el corte está declarado, el spec del simulador pasa como línea de base, y hay un mapa escrito de qué endpoint simulado sirve hoy cada cosa que los otros cuatro van a pedir. |
| **H2** | `BLOQUEANTE PARA PABLO` | Un servicio con horario produce un bloqueo real en la agenda, con el motivo «Otros servicios», sin haber inventado un tipo que el contrato no tiene; y la excepción de horario extra que Pablo necesita, funciona. |
| **H3** | `BLOQUEANTE PARA PABLO` | La duración de una visita de visitador sale de un dato configurable, con 15 minutos por omisión, y el visitador sigue sin poder ver nada clínico. |
| **H4** | `BLOQUEANTE PARA JUSTIN` | La ficha de un medicamento puede declarar su frecuencia por defecto, la clave está acordada y documentada, **y ningún valor clínico inventado se presenta como real**: lo que se cargue es sintético declarado con procedencia. |
| **H5** | `ALTA` | El panel muestra el reporte semanal y mensual de consultas, el mapa de calor de hora × día, las canceladas y las otras atenciones (cirugías, tomas de muestra), con los mismos tonos que la agenda usa para los mismos estados. |
| **H6** | `ALTA` | Los bloques del panel tienen el mismo globo que la agenda, tus archivos cumplen el patrón de botones y de opciones, la regresión está corrida y las capturas están miradas. |

> ⚠️ **Esto es más de lo que entra en una noche, y está dicho a propósito.** Lo que no se cierra queda
> `A MEDIAS` con qué anda, qué no anda y qué falta exactamente (regla 20). **Pero H2, H3 y H4 salen
> primero**: son lo que otros dos están esperando.

**Kill-test del turno completo:** pedile a Pablo que cree un horario extra fuera de su horario de
atención. Si el manejador no lo acepta, H2 no está hecho. Y preguntá de dónde salió la frecuencia por
defecto de un medicamento: si la respuesta es «la escribí yo», H4 está **mal hecho**, por más que la
pantalla funcione.

## 3. Alcance

**IN:** corte declarado y mapa de endpoints simulados que los otros van a pedir · motivo de bloqueo
para «otros servicios» resuelto **sin romper el contrato**, con la opción de ampliar el enum
registrada como decisión de negocio · excepción de horario extra funcionando en el simulador · ventana
y duración de visita de visitador, con 15 minutos por omisión y su configuración · propiedad de
frecuencia por defecto en la ficha del concepto, con clave acordada, datos sintéticos **declarados** y
su procedencia · agregación de consultas por semana y por mes, mapa de calor hora × día, canceladas y
otras atenciones, con los tonos semánticos del sistema · globos en los bloques del panel · el patrón
de botones y de opciones de Itzan aplicado en tus archivos · specs de cada manejador nuevo · el spec
del simulador entero en verde · barrido y click-sweep · capturas por viewport y tema · `PLAN.md`,
`REPORTE.md` y `evidencia/`.

**OUT:** **cualquier archivo fuera de `core/mock/**`, `features/dashboard/**` y `core/data-access/**`
(menos `prescription-favorites/**`)** · **escribir en `mantra-core-health-api`**: se lee y se cita, no
se toca · ampliar el enum `ExceptionType` de la API · **inventar la posología de un medicamento**:
prohibido por la regla 97.5.4, y tiene precedente propio (B-13) · inventar una fuente para un dato de
catálogo: eso es exactamente lo que B-13 corrigió · presentar un dato de desarrollo como catálogo
oficial · truncar una colección del simulador como estrategia de actualización (regla 97.4.4) ·
copiar un dato de producción a la maqueta · agregar un endpoint simulado **sin** buscar primero el
equivalente en la API y citarlo · agregar un endpoint simulado sin su spec · cambiar el significado de
un estado de cita para que una cifra cierre · escribir un color literal en el panel · un mapa de calor
que sólo se entienda por color · declarar `HECHO` una microtarea cuyo DoD no corriste.

## 4. Plan — hitos, subtareas y microtareas

Los seis estados permitidos son exactamente: `TODO`, `EN CURSO`, `HECHO`, `A MEDIAS`, `BLOQUEADO` y
`DESCARTADO`. **`A MEDIAS` es legítimo; disfrazarlo de `HECHO` no.**

### H1 — Corte, simulador bajo control y mapa de lo que ya sirve

**Prioridad:** `BLOQUEANTE`

**CA:** Dado el simulador, cuando otro dueño de lote pregunta si el endpoint que necesita ya existe, entonces hay un mapa escrito que lo responde con ruta y manejador — sin que tenga que leer 20 archivos.

**DoD:** Las 9 microtareas en `HECHO`. `mock-backend.spec.ts` en verde como línea de base. El mapa en `evidencia/`.

**Kill-test del hito:** pedile a Pablo que busque en tu mapa si existe el `POST` de excepción con tipo `EXTRA`. Si no lo encuentra en un minuto, el mapa no sirve.

**Estado:** TODO

#### H1.S1 — El corte y el entorno

**CA:** Dada tu rama, cuando se la compara con `origin/mockup`, entonces sale de ese corte y el SHA está en tu `PLAN.md`.

**DoD:** Las 3 microtareas en `HECHO`, con la salida de `git log -1` pegada.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H1.S1.M1 | Traer `origin/mockup`, declarar el SHA y salir de ahí con tu rama | El SHA está en tu `PLAN.md` | `git fetch origin && git log -1 --format='%H %ad %s' origin/mockup` → pegada | TODO |
| H1.S1.M2 | Declarar el ref de la API que vas a citar, y que es sólo lectura | Está el SHA de `origin/dev` de la API | `git -C <ruta api> log -1 --format='%H %s' origin/dev` → pegada | TODO |
| H1.S1.M3 | Levantar la maqueta y entrar con las dos cuentas: médica y visitador | Las dos entran y ven lo suyo | Dos capturas | TODO |

#### H1.S2 — La red de seguridad del simulador

**CA:** Dado el simulador, cuando se corre su spec, entonces ninguna ruta lanza ni devuelve 500 con ninguna cuenta — y eso quedó registrado **antes** de que empieces a tocarlo.

**DoD:** Las 3 microtareas en `HECHO`, con las salidas pegadas.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H1.S2.M1 | Correr el spec del simulador entero como línea de base | Hay salida y exit code | `npx ng test --include=src/app/core/mock/mock-backend.spec.ts --watch=false` → `evidencia/antes/mock.txt` | TODO |
| H1.S2.M2 | Correr typecheck y lint de partida | Hay exit code de los dos | `yarn typecheck; yarn lint` → pegadas. Si ya estaba rojo, **es baseline, no tu bug** | TODO |
| H1.S2.M3 | Registrar cómo se declara la persistencia de una colección, para no perder escrituras | Está escrito cómo se persiste y qué sobrevive a un F5 | Fragmento de `mock-store.ts` / `Coleccion.persistirEn` pegado. **Un manejador nuevo cuyo dato no sobrevive a la recarga hace que el DoD de otro no se pueda demostrar** | TODO |

#### H1.S3 — El mapa de lo que los otros van a pedir

**CA:** Dado el mapa, cuando alguien busca si existe el endpoint que necesita, entonces encuentra la ruta, el manejador y si el contrato real tiene equivalente.

**DoD:** Las 3 microtareas en `HECHO`. Cada fila con su cita del contrato real, o con «no existe en la API» declarado.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H1.S3.M1 | Mapear lo que necesita Pablo: excepciones, tipos de bloqueo, cupos y actividad | Cada uno con ruta simulada y cita del contrato real | Tabla en `evidencia/mapa-endpoints.md` | TODO |
| H1.S3.M2 | Mapear lo que necesita Justin: ficha de concepto y sus propiedades | Está la ruta que hoy sirve la ficha y las claves que ya publica | Tabla + las claves `dose_forms` y `strengths` citadas | TODO |
| H1.S3.M3 | Mapear lo que necesita Marcelo: notas, episodios y formularios | Está qué existe y qué no para guardar una cuadrícula | Tabla. **Si no hay dónde guardar una fila estructurada, decilo ahí**: es el hallazgo que ordena su lote | TODO |

### H2 — El bloqueo por «otros servicios», y el horario extra

**Prioridad:** `BLOQUEANTE PARA PABLO`

**CA:** Dado un servicio propio con horario programado, cuando se consulta la agenda de ese profesional, entonces ese rato aparece bloqueado con el motivo «Otros servicios»; y dado un horario extra fuera del horario de atención, se puede crear como excepción que **añade** disponibilidad.

**DoD:** Las 9 microtareas en `HECHO`. Sin tipos inventados en el enum. El spec del manejador en verde. `mock-backend.spec.ts` sigue en verde. Los tres niveles del contrato ejercitados.

**Kill-test del hito:** creá una excepción con un `exceptionType` que no está en la lista de 7. Si el manejador la acepta, **el doble es más permisivo que el contrato real** y eso hace que Pablo escriba código que el backend real va a rechazar.

**Estado:** TODO

#### H2.S1 — El motivo, sin romper la lista cerrada (C-12)

**CA:** Dado el pedido de una razón «OTROS SERVICIOS», cuando se la implementa, entonces viaja como `OTHER` con su texto, el contrato real la acepta tal cual, y la opción de ampliar el enum queda registrada como decisión de negocio.

**DoD:** Las 3 microtareas en `HECHO`. La cita del contrato real pegada. La ambigüedad registrada con dueño.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H2.S1.M1 | Verificar por tu cuenta la lista cerrada de motivos en la API y en el simulador | Las dos listas están pegadas y se comparan | Fragmentos de `scheduling-catalog.dto.ts:735` y `scheduling.handlers.ts:29-35`. **Si difieren, eso ya es un hallazgo** | TODO |
| H2.S1.M2 | Implementar el motivo como `OTHER` + texto «Otros servicios», con su etiqueta legible | La excepción creada tiene `exceptionType: 'OTHER'` y su `reason` | Petición y respuesta pegadas + la excepción releída | TODO |
| H2.S1.M3 | Registrar la opción de ampliar el enum como decisión de negocio | Está escrito qué implicaría: contrato, terminología y despliegue | Registro de `Q-D6` con dueño. **`exception_type_concept_id` es FK a `terminology.catalog_concepts`: no es sólo agregar una palabra al enum** | TODO |

#### H2.S2 — El horario extra que Pablo necesita

**CA:** Dado un rato fuera del horario de atención, cuando se crea la excepción `EXTRA`, entonces queda creada con `blocks: false` y el día la muestra como disponibilidad añadida, no como bloqueo.

**DoD:** Las 3 microtareas en `HECHO`. Los tres niveles ejercitados. Avisado a Pablo en el daily en cuanto funcione.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H2.S2.M1 | Verificar que el `POST` de excepción acepta `EXTRA` y lo devuelve con `blocks: false` | La respuesta lo trae | Petición y respuesta pegadas | TODO |
| H2.S2.M2 | Ejercitar los tres niveles: válido, límite y **inválido** | Los tres tienen comportamiento declarado | Las tres peticiones y respuestas. El inválido (tipo fuera de la lista, franja invertida, franja de cero minutos) **tiene que ser rechazado**, no aceptado en silencio (regla 65 §2) | TODO |
| H2.S2.M3 | Avisar a Pablo por el daily que ya puede usarlo | El aviso está escrito con la ruta y el cuerpo esperado | Entrada en el daily. **Este aviso es lo que destraba su H3.S3** | TODO |

#### H2.S3 — Que el bloqueo se vea en la agenda, y no rompa nada

**CA:** Dado el bloqueo creado, cuando la agenda pide los bloqueos del mes, entonces aparece con su etiqueta; y ninguna otra ruta del simulador se rompió.

**DoD:** Las 3 microtareas en `HECHO`. `mock-backend.spec.ts` en verde. Spec propio del manejador.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H2.S3.M1 | Verificar que el bloqueo sale en el listado de excepciones del recurso | Aparece con su etiqueta y su franja | Respuesta del `GET` pegada + captura de la agenda mostrando el rato bloqueado | TODO |
| H2.S3.M2 | Escribir el spec del manejador: crea, lista, rechaza el inválido | Los tres casos cubiertos y en verde | `npx ng test --include=<ruta del spec> --watch=false` → pegada. **Un manejador sin spec es un contrato sin verificación** | TODO |
| H2.S3.M3 | Volver a correr el spec del simulador entero | Sigue en verde con todas las cuentas | `npx ng test --include=src/app/core/mock/mock-backend.spec.ts --watch=false` → pegada | TODO |

### H3 — La visita del visitador: duración configurable y su límite de acceso

**Prioridad:** `BLOQUEANTE PARA PABLO`

**CA:** Dada una visita de visitador, cuando se la agenda, entonces su duración sale de un dato configurable con 15 minutos por omisión; y dado el visitador, sigue sin poder acceder a ninguna información clínica.

**DoD:** Las 9 microtareas en `HECHO` o `BLOQUEADO` con el pedido escrito. El límite de acceso **verificado con la cuenta de visitador**, no asumido. Los tres niveles ejercitados.

**Kill-test del hito:** entrá con `visitador@alovida.mock` y pedí una pantalla clínica. Si te devuelve datos de un paciente, hay un `PRODUCT_BUG` de autorización y **eso se reporta ya**, no al final.

**Estado:** TODO

#### H3.S1 — La duración, configurable con su valor por omisión (C-13)

**CA:** Dada la configuración del profesional, cuando no definió nada, entonces la visita dura 15 minutos; y cuando definió otra cosa, dura eso.

**DoD:** Las 3 microtareas en `HECHO`. El campo nombrado y documentado. Nada escrito a mano en la plantilla de Pablo.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H3.S1.M1 | Buscar si el contrato real ya tiene dónde guardar esa configuración, y citarlo | Hay cita, o está declarado que no existe | Búsqueda pegada sobre la API. **«Seguramente no existe» no es evidencia** (regla 00 §1.2) | TODO |
| H3.S1.M2 | Definir el contrato del campo: dónde vive, qué tipo, qué rango admite | Están los cuatro: ruta, nombre, tipo y rango | Contrato escrito en `evidencia/`. Declaralo **doble** si la API no lo tiene (regla 65) | TODO |
| H3.S1.M3 | Implementarlo con 15 minutos por omisión y ejercitar los tres niveles | Válido, límite (mínimo y máximo) e inválido (cero, negativo, texto) | Las peticiones y respuestas pegadas. El inválido **se rechaza** | TODO |

#### H3.S2 — Que la visita se pueda ver en la pestaña de consultas

**CA:** Dada una visita aceptada, cuando la pantalla de consultas pide lo del día, entonces la visita viene con lo necesario para pintarla —franja, visitador, laboratorio y duración— y **sin ningún dato clínico**.

**DoD:** Las 3 microtareas en `HECHO`. La respuesta revisada campo por campo: ningún dato de paciente adentro. Avisado a Pablo.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H3.S2.M1 | Definir qué campos necesita Pablo para la tarjeta, y sólo esos | La lista es la mínima para pintarla | Contrato escrito. Regla 96.5.3: **no devuelvas más datos personales de los que esa vista necesita** | TODO |
| H3.S2.M2 | Verificar que la respuesta no trae ningún dato clínico ni de paciente | Cero campos clínicos | Respuesta pegada y revisada campo por campo. Regla 90.2 | TODO |
| H3.S2.M3 | Avisar a Pablo por el daily con la ruta y la forma de la respuesta | El aviso está escrito | Entrada en el daily. **Destraba su H5.S2** | TODO |

#### H3.S3 — El límite de acceso del visitador, verificado

**CA:** Dada la cuenta de visitador, cuando intenta llegar a una pantalla o a un endpoint clínico, entonces no obtiene datos; y eso está comprobado, no supuesto.

**DoD:** Las 3 microtareas en `HECHO`. La matriz negativa ejercitada con la cuenta real. Cualquier fuga reportada como `PRODUCT_BUG` en el momento.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H3.S3.M1 | Citar el límite desde la especificación, no de memoria | Está el fragmento con su ruta | `pharma-lab.types.ts:9` pegado | TODO |
| H3.S3.M2 | Ejercitar la matriz negativa con `visitador@alovida.mock` | Ninguna ruta clínica devuelve datos | Las peticiones y sus respuestas pegadas. Regla 80.2.3: **toda superficie nueva exige su matriz negativa** | TODO |
| H3.S3.M3 | Si algo se filtra, reportarlo como `PRODUCT_BUG` en el momento | El hallazgo está escrito con su evidencia | Entrada en el daily el mismo momento en que aparece, no al cierre (regla 50) | TODO |

### H4 — Posología por defecto: el mecanismo sí, el dato clínico inventado **no**

**Prioridad:** `BLOQUEANTE PARA JUSTIN`

**CA:** Dada la ficha de un medicamento, cuando publica su frecuencia por defecto, entonces lo hace por una propiedad con clave documentada, y todo valor cargado en la maqueta está **declarado como sintético con su procedencia**; y dado un medicamento sin esa propiedad, la ficha no la trae y la receta sigue funcionando.

**DoD:** Las 9 microtareas en `HECHO`. La clave acordada con Justin por escrito. Procedencia declarada en el archivo de datos. Los tres niveles ejercitados. **Cero valores presentados como catálogo oficial.**

**Kill-test del hito:** preguntá de dónde salió la frecuencia de un medicamento concreto. Si la respuesta no cita una fuente con nombre, referencia y fecha, **entonces la respuesta correcta es que es un dato sintético de desarrollo — y eso tiene que estar escrito en el archivo, no en tu cabeza.**

**Estado:** TODO

#### H4.S1 — El mecanismo, siguiendo el patrón que ya existe

**CA:** Dada la propiedad nueva, cuando se la compara con las que ya existen, entonces entra por el mismo camino (`properties` de la ficha del concepto) y con la misma forma.

**DoD:** Las 3 microtareas en `HECHO`. La clave acordada con Justin. Cero mecanismos paralelos.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H4.S1.M1 | Verificar cómo se publican hoy `dose_forms` y `strengths`, y seguir ese patrón | Está citado el manejador y la forma del dato | Fragmento de `terminology.handlers.ts` o de la fixture de conceptos, pegado. **Un mecanismo paralelo para lo mismo es el defecto más caro del sistema** (regla 96.1) | TODO |
| H4.S1.M2 | Acordar la clave y la forma con Justin, por escrito | La clave está en los dos dailies | Acuerdo pegado. **Avisale en cuanto la definas: su H5 lo espera** | TODO |
| H4.S1.M3 | Buscar si el contrato real de terminología admite propiedades arbitrarias, y citarlo | Está dicho si la propiedad nueva cabe en el contrato o es una extensión del doble | Cita de la API pegada. Si es extensión del doble, **se declara como tal** (regla 65) | TODO |

#### H4.S2 — Los datos, sintéticos y declarados

**CA:** Dado cualquier valor de frecuencia cargado en la maqueta, cuando alguien pregunta de dónde salió, entonces el archivo lo dice: fuente, condición de uso y que **no es apto para uso clínico**.

**DoD:** Las 3 microtareas en `HECHO`. La procedencia escrita en el archivo de datos. El precedente B-13 citado.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H4.S2.M1 | Leer B-13 y escribir cómo lo aplicás acá | Está citado el defecto y las tres acciones con las que se resolvió | `REGISTRO-DEFECTOS.md:101` de la API, pegado, + tu aplicación. **Es el precedente de la casa para exactamente este problema** | TODO |
| H4.S2.M2 | Declarar la procedencia de los valores que cargues, en el propio archivo | Cada valor tiene fuente declarada y la advertencia de no apto para uso clínico | Fragmento del archivo pegado. Regla 97.4.2. **Inventar una fuente autoritativa es lo que B-13 corrigió: no lo repitas** | TODO |
| H4.S2.M3 | Registrar quién debe proveer la fuente autoritativa | Está escrito con dueño (negocio) y qué queda bloqueado hasta entonces | Registro de `Q-D6`. **La posología real no la decidís vos ni la decide el equipo** (regla 97.5.4) | TODO |

#### H4.S3 — Los tres niveles, y que la receta siga funcionando sin la propiedad

**CA:** Dada una ficha sin la propiedad, cuando la receta la lee, entonces funciona como antes; dada una con la propiedad, la trae; y dada una con la propiedad mal formada, la receta no se rompe.

**DoD:** Las 3 microtareas en `HECHO`. Los tres casos con su respuesta pegada. `mock-backend.spec.ts` en verde.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H4.S3.M1 | Publicar la propiedad en algunos conceptos y **no** en otros, a propósito | Hay conceptos con y sin, y está dicho cuáles | Lista + respuestas de la ficha de uno de cada tipo | TODO |
| H4.S3.M2 | Ejercitar el caso inválido: propiedad presente pero mal formada | La ficha responde de forma declarada y la receta no se rompe | Respuesta pegada + captura de la receta con ese medicamento. Regla 65 §2: **sin el nivel inválido, lo que hay es un `WRITTEN` optimista** | TODO |
| H4.S3.M3 | Escribir el spec del manejador y volver a correr el del simulador | Los dos en verde | Las dos salidas pegadas | TODO |

### H5 — El panel dice la verdad: reportes, mapa de calor, canceladas y otras atenciones

**Prioridad:** `ALTA`

**CA:** Dado el panel de inicio, cuando el profesional lo abre, entonces ve el reporte semanal y mensual de sus consultas, un mapa de calor de hora × día que distingue los horarios más y menos concurridos, las canceladas, y las otras atenciones —cirugías, tomas de muestra— separadas de las consultas; y los tonos de cada estado son los mismos que usa la agenda.

**DoD:** Las 10 microtareas en `HECHO` o `A MEDIAS` con lo que falta. Toda cifra **verificable contra la agenda**. Ningún dato transmitido sólo por color. Ningún endpoint nuevo sin cita ni spec.

**Kill-test del hito:** tomá una semana concreta, contá las consultas en la agenda a mano y compará con la cifra del panel. Si no coinciden, el panel está mintiendo, y un panel que miente es peor que un panel vacío.

**Estado:** TODO

#### H5.S1 — De dónde salen las cifras, decidido y citado

**CA:** Dada cada cifra del panel, cuando se pregunta de dónde sale, entonces hay una respuesta con ruta: o de un endpoint que existe, o de una agregación declarada del lado del cliente.

**DoD:** Las 4 microtareas en `HECHO`. La decisión escrita **antes** del primer gráfico. El precedente de analítica citado.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H5.S1.M1 | Verificar por tu cuenta que no hay endpoint de analítica de consultas en la API | Está pegada la búsqueda y su resultado | `grep -rn "@Get(" src/modules/reporting/controllers/` sobre la API → pegado. **Si encontrás uno, gana el archivo y este prompt estaba equivocado**: registralo | TODO |
| H5.S1.M2 | Leer el precedente de analítica simulada y decidir si seguirlo | Está citado y hay decisión escrita | `insurance-analytics.handlers.ts:115` + su spec, citados, y tu decisión: endpoint nuevo simulado **o** agregación en el cliente | TODO |
| H5.S1.M3 | Declarar la consecuencia de la opción elegida | Está escrito qué falta del lado real para que esto funcione fuera de la maqueta | Registro escrito. **Un panel que sólo existe en la maqueta es legítimo si se declara; presentarlo como función del producto, no** | TODO |
| H5.S1.M4 | Definir la ventana y la zona horaria de la agregación | Están declaradas las dos | Decisión escrita. Una cifra «de esta semana» sin decir en qué zona empieza el lunes es una cifra que nadie puede reproducir | TODO |

#### H5.S2 — Semanal, mensual, canceladas y el mapa de calor

**CA:** Dado el panel, cuando se mira el reporte, entonces las consultas por semana y por mes cuadran con la agenda, las canceladas se pueden ver, y el mapa de calor muestra hora × día con los valores accesibles sin depender del color.

**DoD:** Las 3 microtareas en `HECHO`. Una cifra verificada a mano contra la agenda. El mapa de calor con su valor legible por teclado y lector de pantalla.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H5.S2.M1 | Mostrar el reporte semanal y mensual, con las canceladas incluibles | Los tres existen y la cifra cuadra | Conteo manual de una semana contra la cifra del panel, los dos pegados. Reusá el criterio de `incluirCanceladas()`: **no inventes un estado nuevo** | TODO |
| H5.S2.M2 | Mostrar el mapa de calor de hora × día, distinguiendo el más y el menos concurrido | Se ve la concentración y se lee cuál es el máximo y el mínimo | Captura + el valor de las celdas extremas | TODO |
| H5.S2.M3 | Verificar que el mapa de calor no dice su información sólo por color | El valor está disponible en texto y con teclado | Captura en escala de grises + recorrido con teclado. Regla 95.4.6 y 80.7 | TODO |

#### H5.S3 — Otras atenciones, y los colores que sí coinciden

**CA:** Dado el panel, cuando se buscan las otras atenciones, entonces las cirugías y las tomas de muestra se ven separadas de las consultas, con la tipología que el contrato ya tiene; y los tonos de cada estado son los mismos que la agenda usa para ese estado.

**DoD:** Las 3 microtareas en `HECHO`. La tipología reusada, no inventada. Comparación de tonos panel vs agenda, lado a lado.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H5.S3.M1 | Usar la tipología de actividad que ya existe para separar las otras atenciones | `PROCEDURE` y las demás salen del endpoint, no de una lista tuya | Respuesta de `GET /scheduling/activity-types` pegada + captura del panel. **Una colonoscopia es `PROCEDURE`: no es una categoría nueva** | TODO |
| H5.S3.M2 | Igualar los tonos del panel a los de la agenda para los mismos estados | Un mismo estado se ve del mismo tono en las dos pantallas | Capturas lado a lado + la tabla estado → token. Regla 95.1.5: **tokens, no literales** | TODO |
| H5.S3.M3 | Verificar los tonos en tema claro y oscuro, con contraste | Los dos temas pasan | Capturas y medición de contraste. Regla 95.5.4 | TODO |

### H6 — Globos del panel, patrón aplicado, regresión y cierre

**Prioridad:** `ALTA`

**CA:** Dado un bloque del panel, cuando se pasa el puntero o se llega con el teclado, entonces aparece el mismo globo que usa la agenda; y dado el turno cerrado, tus archivos cumplen el patrón de botones y de opciones, la regresión está corrida y las capturas están miradas.

**DoD:** Las 9 microtareas en `HECHO`. Globo reusado, no uno nuevo. Medición de `iconOnly` y de opciones antes y después. `REPORTE.md` escrito.

**Kill-test del hito:** llegá a un bloque del panel **sólo con el teclado**. Si el globo no aparece, C-03 no está hecho: el globo del sistema ya responde al foco, así que si no aparece es que no lo usaste.

**Estado:** TODO

#### H6.S1 — Los globos del panel (C-03)

**CA:** Dado el panel, cuando se recorren sus bloques, entonces cada uno que necesite explicación tiene el globo del sistema, y se comporta igual que el de la agenda.

**DoD:** Las 3 microtareas en `HECHO`. El globo existente reusado. Puntero y teclado verificados. La ambigüedad de «qué son los paneles» registrada.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H6.S1.M1 | Capturar el globo de la agenda y el estado actual del panel, lado a lado | Están las dos capturas y la diferencia descrita | Las dos capturas. **Es lo que cierra `Q-D5`: sin ver los dos lados, «los paneles» es una adivinanza** | TODO |
| H6.S1.M2 | Aplicar el globo del sistema en los bloques del panel que lo necesiten | Cada bloque señalado tiene su globo | Captura con el globo abierto. Reusá `appTooltip` con su posición; **no escribas otro tooltip** | TODO |
| H6.S1.M3 | Verificar con puntero y con teclado, y en móvil | Los tres casos tienen comportamiento declarado | Recorridos pegados. En móvil no hay hover: **si el dato sólo vive en el globo, en móvil se pierde**, y eso hay que resolverlo o declararlo | TODO |

#### H6.S2 — El patrón de Itzan aplicado en tus archivos (C-06, C-21)

**CA:** Dados tus archivos, cuando se los mide, entonces no queda ningún botón sólo-icono sin justificación ni ningún grupo de opciones que debiera ser `select`.

**DoD:** Las 3 microtareas en `HECHO`. Medición antes y después. Componente y regla de Itzan reusados.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H6.S2.M1 | Medir `iconOnly` y grupos de opciones en tus archivos | Hay dos números | `git grep -c "iconOnly" -- src/app/features/dashboard src/app/core` y el de opciones → pegados | TODO |
| H6.S2.M2 | Aplicar el patrón publicado por Itzan | Cada botón tiene icono y texto; las opciones son `select` | Capturas + medición nueva. **Si Itzan no publicó todavía, esta microtarea queda `BLOQUEADO` con el pedido escrito** — no escribas tu propia versión del componente | TODO |
| H6.S2.M3 | Justificar cada excepción que quede | Cada una tiene motivo escrito | Tabla de excepciones | TODO |

#### H6.S3 — Regresión, prueba visual y cierre

**CA:** Dado el turno cerrado, cuando alguien que no lo vivió lee tu reporte, entonces sabe qué contratos publicaste, qué quedó a medias con las cuatro respuestas, y qué decisiones de negocio siguen abiertas.

**DoD:** Las 3 microtareas en `HECHO`. Gates en 0. `mock-backend.spec.ts` en verde. Barrido y click-sweep serial. Capturas 3 viewports × 2 temas miradas.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H6.S3.M1 | Gates estáticos, specs de tus manejadores y el spec del simulador entero | Exit 0 y todos en verde | `yarn typecheck; yarn lint; npx ng test --include=src/app/core/mock/**/*.spec.ts --include=src/app/features/dashboard/**/*.spec.ts --watch=false` → pegadas | TODO |
| H6.S3.M2 | Barrido y click-sweep de la maqueta, serial | El panel y las rutas que alimentás están limpias, sin «sin manejador para…» | Las dos salidas + rutas de artefactos, con `--workers=1`. **«sin manejador para …» en la consola es tu inventario de lo que falta**: cada línea se atiende o se declara | TODO |
| H6.S3.M3 | Capturas 3 viewports × 2 temas del panel, **miradas**, y `REPORTE.md` | Cada captura con su observación; el reporte abre con `AVANCE: <HECHO> / 55` | Índice de capturas + archivo en disco con las tres secciones | TODO |

## 5. Ambigüedades registradas — **no las resuelvas, anotalas**

| ID | Ambigüedad | Quién puede resolverla | Qué bloquea | Supuesto con el que seguís |
|---|---|---|---|---|
| Q-D5 | C-24 dice «los colores no coinciden» sin decir con qué | Doctor | Sólo qué se iguala a qué | Se iguala el panel a los tonos que la agenda usa para el mismo estado, y se muestran las dos capturas |
| Q-D6 | «OTROS SERVICIOS» no está en la lista cerrada, y C-20 pide posología sin fuente | Negocio | La etiqueta del bloqueo y el **dato** clínico, nunca el mecanismo | `OTHER` + texto; posología como dato sintético declarado con procedencia |
| Q-E1 | C-24 no dice si el reporte es del profesional, de la organización o de las dos | Doctor | El alcance de la cifra | Es del profesional de la sesión, en la organización activa. **Una cifra sin decir de quién es, no se puede verificar** |
| Q-E2 | C-24 pide «otras atenciones» y nombra cirugías, colonoscopias y pruebas de contraste. La tipología del contrato tiene `PROCEDURE`, no una por estudio | Doctor / negocio | Sólo el nivel de detalle | Se agrupa por la tipología existente; un desglose por estudio exige catálogo y **se registra** |
| Q-E3 | C-13 pide una configuración de duración que no existe en ningún contrato | Negocio + doctor | Sólo la persistencia real; el doble se puede simular hoy | Se define el contrato, se simula y se declara como doble |
| Q-E4 | No hay endpoint de analítica: la agregación puede vivir en el cliente o en un contrato nuevo | Coordinación | Nada de esta noche: se elige y se declara | Se agrega del lado del cliente sobre lo que la agenda ya lee, y se registra qué falta del lado real |
| Q-E5 | En móvil no hay hover: un dato que sólo vive en el globo se pierde | Doctor | Sólo los bloques cuyo dato no esté en otro lado | El globo **complementa**, nunca es el único lugar donde vive un dato |

<ejemplos>
Dos formas de cerrar la misma microtarea. La diferencia no es de redacción: es que una se puede
auditar y la otra no.

<ejemplo tipo="aceptable" microtarea="H2.S2.M2">
Los tres niveles ejercitados y pegados en `evidencia/h2/tres-niveles.md`: válido (`EXTRA` creado, `blocks:false`), límite (franja de 1 minuto, aceptada) e inválido (tipo `SERVICE`, rechazado 422; franja invertida, rechazada). `mock-backend.spec.ts` sigue en verde tras el cambio.

Estado: HECHO · Veredicto: PASS · Peldaño: VERIFIED
</ejemplo>

<ejemplo tipo="prohibido" microtarea="H2.S2.M2">
El manejador acepta EXTRA y devuelve blocks:false. Pablo ya puede usarlo.

Estado: HECHO
</ejemplo>

Por qué el segundo no vale: falta el nivel inválido, que es el que importa: si el doble acepta un tipo que el contrato real rechaza, Pablo escribe código que el backend va a rechazar. Con sólo el camino feliz esto es un `WRITTEN` optimista (regla 65 §2).
</ejemplos>

## 6. Definition of Done del turno

- [ ] Las **55 microtareas** están en `HECHO`, en `BLOQUEADO` con su causa y el pedido escrito, o en `A MEDIAS` con qué anda, qué no anda, qué falta y dónde quedó.
- [ ] **Ninguna microtarea quedó en `EN CURSO`** al cerrar.
- [ ] Cada hito y cada subtarea tienen su Estado actualizado.
- [ ] Todo veredicto es `PASS`/`FAIL`/`NOT_RUN`/`BLOCKED`. **Ningún `PASS` sin comando y salida pegados.**
- [ ] **Ningún endpoint simulado nuevo sin (a) la búsqueda del equivalente real citada, (b) su spec, y (c) la declaración de que es un doble si la API no lo tiene.**
- [ ] El motivo del bloqueo viaja como `OTHER` + texto: **el enum no se amplió** y la opción quedó registrada como decisión de negocio.
- [ ] El manejador **rechaza** un `exceptionType` fuera de la lista de 7: el doble no es más permisivo que el contrato real.
- [ ] Los tres niveles —válido, límite e inválido— están ejercitados en cada contrato que tocaste, con su respuesta pegada.
- [ ] **Ninguna frecuencia de medicamento se presenta como dato de catálogo oficial.** Lo cargado está declarado sintético, con fuente, condición de uso y la advertencia de no apto para uso clínico.
- [ ] B-13 está citado y está escrito cómo se aplicó su criterio.
- [ ] Quién debe proveer la fuente autoritativa de posología está **registrado con dueño**.
- [ ] La respuesta de la visita de visitador **no trae ningún dato clínico**, revisada campo por campo.
- [ ] La matriz negativa del visitador está ejercitada con su cuenta real, y cualquier fuga se reportó **en el momento**.
- [ ] Al menos una cifra del panel está verificada **contando a mano** contra la agenda, con los dos números pegados.
- [ ] El mapa de calor se entiende sin color, y se recorre con teclado.
- [ ] Las otras atenciones salen de la tipología que el contrato ya publica, no de una lista tuya.
- [ ] `mock-backend.spec.ts` está en verde **después** de todos tus cambios, no sólo antes.
- [ ] Cada línea de «sin manejador para …» del barrido está atendida o declarada.
- [ ] Cero archivos tocados fuera de `core/mock/**`, `features/dashboard/**` y `core/data-access/**` (menos `prescription-favorites/**`). **Cero escrituras en `mantra-core-health-api`.**
- [ ] Ningún color literal; contraste verificado en claro y oscuro.
- [ ] Ningún spec borrado, saltado ni debilitado. Ningún timeout subido. Ningún reintento agregado.
- [ ] Ninguna colección del simulador truncada como estrategia de actualización.
- [ ] Capturas en 3 viewports × 2 temas, **miradas**, cada una con su observación.
- [ ] Ningún proceso quedó corriendo al cerrar, o está declarado cuál y por qué.
- [ ] Avance reportado como `microtareas HECHO / 55`, **no** como porcentaje a ojo.
- [ ] Ningún dato real de paciente en ninguna salida pegada.

## 7. Handoff — avisá por el daily al cerrar cada hito, no al final

| Al cerrar | A quién | Qué exactamente |
|---|---|---|
| **H1** | Los cuatro | El mapa de endpoints simulados: qué existe, qué no, y qué tiene equivalente real |
| **H2** | **Pablo** | **Que la excepción `EXTRA` y el motivo «Otros servicios» funcionan**, con la ruta y el cuerpo. Es lo que destraba su H3 y su H5 |
| **H3** | **Pablo** | **La forma de la respuesta de la visita y el campo de duración configurable.** Destraba su H5.S2 |
| **H3** | Marcelo | Si apareció cualquier fuga de acceso del visitador: es hallazgo de seguridad, entra en su dictamen |
| **H4** | **Justin** | **La clave de la propiedad de frecuencia por defecto y su forma.** Destraba su H5 |
| **H4** | Marcelo | Que la posología queda con un pendiente de negocio y datos declarados sintéticos |
| **H5** | Pablo | Qué criterio de canceladas usaste, para que la agenda y el panel no digan cifras distintas |
| **H5** | Marcelo | Qué cifra verificaste a mano y contra qué, para su dictamen |
| **H6** | Itzan | Cuántos `iconOnly` y cuántos grupos de opciones quedaron en tu área, y por qué |
| **H6** | Los cuatro | Las líneas de «sin manejador para …» que aparecieron en el barrido y que son de su área |

Si un bloqueo se confirma, **no iteres sobre él**: registrá la causa, escribí el pedido, y pasá a la
siguiente microtarea independiente. Y recordá que en tu lote la **regla 65** aplica casi siempre: si
el contrato real no tiene lo que hace falta, **el doble se escribe igual**, en sus tres niveles, y se
declara como doble. Lo único que no se puede simular es una decisión de negocio — y la posología
real de un medicamento es exactamente eso.
