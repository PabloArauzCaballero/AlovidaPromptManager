# 450 KB de registro y 600 KB de perfil: separar quién decide de quién pinta

> **Rol:** propietario de la familia «formulario» y del perfil · **Línea:** C · **Fecha:** 2026-09-21 · **Turno:** noche
> **Fuente del pedido:** [`REFACTOR-FRONTEND-2026-09-21.md`](../../../../../docs/requisitos/REFACTOR-FRONTEND-2026-09-21.md) — secciones **3.1, 4, 5, 7, 10.1 y 14**
> **Verificación contra el código:** [`VERIFICACION-CONTRA-CODIGO-2026-09-21.md`](../../../../../docs/verificacion/VERIFICACION-CONTRA-CODIGO-2026-09-21.md) — secciones **3, 10 y 11**
> **6 hitos · 15 subtareas · 64 microtareas**, todas con criterio de aceptación y Definition of Done.
>
> **Tu carril es el único donde el organismo NO es el problema.** `paginated-form` ya tiene **52
> consumidores** y los seis registros ya lo usan. Lo que hay que separar es lo que quedó **adentro de
> los contenedores**: 450 KB en `auth/register-*` y 600 KB en `account/my-profile`. Esto es el §3.1 del
> documento maestro, no el §9.

## 0. Ficha de asignación

| Campo | Valor |
|---|---|
| `REPO` | `alovida/mantra-core-health` (frontend Angular). **Nada de backend en este lote** |
| `TARGET_REF` | `origin/mockup` — corte leído **`5a0776c66b005ad4d2d6722321e933cd7adea621`** (2026-09-21T17:35-04). **Reconsultalo y fijá el tuyo** en tu `PLAN.md` |
| `RAMA DE TRABAJO` | Una tuya, saliendo de `origin/mockup`. **Nada directo sobre `mockup`, nada sin PR** |
| `ARCHIVOS RESERVADOS PARA VOS` | `src/app/shared/components/organisms/paginated-form/**` · `organisms/form-section/**` · `organisms/form-actions/**` · `src/app/shared/components/molecules/form-field/**` · `src/app/features/auth/register-*/**` · `src/app/features/account/my-profile/**` |
| `ARCHIVOS DE OTROS — NO LOS TOQUES` | `organisms/{data-table,view-state-host,filter-bar}/**` y `features/alovida/{accesos,personas}/**` (Pablo) · `organisms/{directory-page,page-header}/**`, `molecules/{search-field,pagination}/**` y `features/alovida/{terminologia,datos-compartidos,buscar,directorio,inicio}/**` (Justin) · `scripts/**`, `features/component-stock/**`, `core/mock/faker/**` y **los tres barrels** `shared/components/*/index.ts` (Ender) · `organisms/{content-dialog,attachment-dialog,attachment-uploader,fact-section}/**` y `features/clinical-record/**` (Marcelo) |
| `⚠️ RIESGO ALTO DE TU CARRIL` | `paginated-form` tiene **52 consumidores** en 12 features distintas. Cualquier cambio suyo es de alto impacto: exige probar una **muestra de consumidores ajenos**, no sólo los tuyos. Lo mismo `form-field` |
| `LA MAQUETA NO TIENE BACKEND` | `mockBackend: true` fijo en `src/environments/environment.ts`. Ninguna petición sale a la red: las contesta `src/app/core/mock/mock-backend.interceptor.ts`. **Lo que te falte en `core/mock/` se lo pedís a Ender** |
| `CUENTA DE PRUEBA` | `medica@alovida.mock` y `paciente@alovida.mock` (cualquier contraseña no vacía). Para los registros, el flujo de alta no necesita cuenta. **Sintéticas declaradas**: se pueden pegar |
| `DÓNDE SE PRUEBA` | Los seis registros cuelgan de las rutas de `auth`; el perfil, de `account/my-profile`. **Sacá las URLs del router, no las supongas** |
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

Son **26**: 11 del proceso y 15 propias de la familia formulario.

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
| `smart-dumb-components` | **la más importante de tu lote**: qué queda en el contenedor y qué baja a la vista |
| `angular-forms` | reactive forms **tipados** con `nonNullable`, validadores, errores de servidor al control |
| `frontend-forms-ux` | cuándo validar, qué se preserva ante fallo, doble envío |
| `component-architecture-solid` | responsabilidad única sin partir un archivo por línea |
| `solid-principles` | sustitución: una variante respeta los mismos eventos e invariantes |
| `angular-signals-state` | dónde vive el borrador y qué se deriva; por qué no usar `effect` para copiar estado |
| `refactoring-safely` | separar sin cambiar comportamiento, con red de pruebas |
| `typescript-standards` | `FormGroup` tipado en vez de `FormGroup` pelado |
| `frontend-accessibility` | etiqueta por campo, error vinculado, foco al primer error |
| `frontend-ux-states` | los cuatro estados, y el error accionable en vez del crudo del backend |
| `state-machines-workflows` | los pasos del asistente como transiciones con precondición |
| `atomic-design-components` | reusar `form-field` y `phone-input` en vez de rearmarlos |
| `dead-code-duplication` | qué se retira cuando dos registros dejan de duplicar una regla |
| `unit-testing` | un comportamiento por test, y no testear la implementación |
| `visual-proof` | la captura no vale si no la mirás |

Entrá siempre por `skills-router`: **no leas el catálogo entero, no sirve.**

### 1.4 DoD de esta sección — se verifica como cualquier otra

- [ ] `ls .claude/skills | wc -l` devolvió **176**, y la salida está pegada en tu daily.
- [ ] `python .claude/hooks/plan_gate.py --self-test` devolvió **11 PASS, 0 FAIL**, salida pegada.
- [ ] Leíste `skills-router` y las 26 skills de las dos tablas, **empezando por `smart-dumb-components`**.
- [ ] Creaste tu `PLAN.md` **antes** del primer `Edit`/`Write` de código.

**Sin estas cuatro casillas, tu lote arranca en `BLOQUEADO`, no en `EN CURSO`.**

> ### ✅ Hechos ya verificados contra el corte — no los repitas, pero tampoco los creas sin abrir el archivo
>
> #### El motor de formularios ya existe, ya está adoptado, y los seis registros lo usan
>
> `src/app/shared/components/organisms/paginated-form/paginated-form.ts` — **654 líneas**, **52
> consumidores** en `.html` de 12 features (`admin`, `auth`, `auth-providers`, `delegated-access`,
> `geo`, `health-context`, `identity-assurance`, `assets-liabilities`, `form-builder`,
> `design-system-sample`, y los seis `register-*`).
>
> Su contrato, líneas 198-277:
>
> | Línea | Miembro |
> |---|---|
> | 198 | `paginas = input.required<readonly PaginaDeFormulario[]>()` ← **es un motor por esquema** |
> | 201 | `form = input.required<FormGroup>()` ← **`FormGroup` SIN parámetro de tipo** |
> | 204 · 206 | `label` · `submitLabel` |
> | 208 · 218 | `pending` · `destructive` |
> | 220 · 221 | `confirmTitle` · `confirmMessage` |
> | 231 · 240 · 255 · 272 | `cancelLabel` · `interactiveSteps` · `iconOnlyNav` · `compactSteps` |
> | 275 · 277 | `enviado` · `cancelado` |
>
> Y **seis** inputs con `booleanAttribute`. Importa el átomo `Input` (línea 28) y la molécula
> `PhoneInput` (40): o sea, **el organismo conoce y monta sus hijos** a partir del esquema.
>
> El propio archivo declara la propiedad del estado, y está bien declarada — línea 110:
> **«El dato vive en el `FormGroup` que recibe, nunca acá. El motor no…»**
>
> #### 🚩 Las dos tensiones reales de tu carril, y ninguna se resuelve de un tirón
>
> 1. **`form: FormGroup` sin tipar** contradice el §10.1 del documento maestro, que pide controles
>    tipados. Pero tiene **52 consumidores**: tiparlo es un cambio incompatible. El §10 dice cómo se
>    hace eso — compatibilidad declarada, adaptador temporal con consumidores identificados y
>    condición de eliminación — y el §15 dice que los cambios incompatibles se **versionan**.
>    **No lo tipes de un tirón y a ver qué pasa.**
> 2. **Seis banderas booleanas** es exactamente lo que el §5.6 llama «una bandera por pantalla», y a la
>    vez el §9 dice que un «motor universal de formularios» debe quedar **fuera** de la abstracción.
>    Pero el motor ya existe y funciona en 52 lugares. **La respuesta correcta no es borrarlo:** es
>    medir si alguna de las seis se puede expresar como variante semántica o proyección (§8), y
>    declarar lo que se conserva.
>
> #### El tamaño de lo que hay adentro de los contenedores
>
> Seis carpetas `auth/register-*` suman **460 858 bytes** (sin specs):
>
> | Archivo | Bytes |
> |---|---|
> | `register-practitioner/register-practitioner.ts` | 108 165 |
> | `register-patient/register-patient.ts` | 104 864 |
> | `register-organization/register-organization.ts` | 49 026 |
> | `register-imaging-center/register-imaging-center.ts` | 39 757 |
> | `register-laboratory/register-laboratory.ts` | 32 217 |
> | `register-patient/register-patient.html` | 33 543 |
> | `register-practitioner/register-practitioner.html` | 28 546 |
> | `register-account-type/register-account-type.ts` | 4 731 |
>
> Y `account/my-profile/**` suma **600 630 bytes** (sin specs), con
> `practitioner-profile-edit.ts` 72 378, `practitioner-profile-view.html` 66 817,
> `practitioner-profile-edit.html` 49 560, `work-history.ts` 46 631 y
> `patient-profile-edit.ts` 38 396.
>
> ⚠️ **El tamaño NO es el defecto**, y el §5.6 lo dice: «no uses límites arbitrarios de líneas como
> definición de calidad». Esta tabla te dice **dónde buscar**, no qué está mal. Lo que decide es
> cohesión, motivos de cambio y dependencias — y eso exige abrir el archivo, que es lo que hace tu H2.
>
> #### Higiene que YA está bien: no la arregles
>
> `: any` y `as any` en todo `src/app`: **0 y 0**. El §5.4 ya se cumple. **No mandes ni un minuto a
> cazar `any`.**
>
> ⚠️ **Lo que la verificación NO hizo: ejecutar.** No se levantó la maqueta, no se corrió un test, y
> **no se leyó el cuerpo** de ninguno de esos archivos: sólo su tamaño. Que dos registros pesen 100 KB
> no prueba que dupliquen una regla. Eso es lo que H2 te pide demostrar antes de extraer nada.

## 2. Resultado observable

| Hito | Prioridad | Qué queda demostrado |
|---|---|---|
| **H1** | `BLOQUEANTE` | Corte declarado, baseline con rojos previos registrados, rutas reales de los seis registros y del perfil, y capturas **antes** de dos registros y del perfil de profesional en dos viewports. |
| **H2** | `ALTA` | Está demostrado, con evidencia y no por tamaño, **qué regla concreta se repite** entre al menos dos registros: la misma validación, la misma normalización o la misma política de borrador, con archivo y línea de cada copia. Y está declarado un **contraejemplo**: una regla que parece igual y es de otro dominio. |
| **H3** | `ALTA` | Esa regla vive **una sola vez**, dos registros reales la consumen desde ahí, y el comportamiento observable no cambió: mismos errores por campo, mismo doble envío bloqueado, mismo dato preservado ante fallo. |
| **H4** | `ALTA` | El contenedor más grande que hayas elegido tiene su vista separada: la plantilla describe regiones y acciones, y la lógica de negocio no vive en ella. Con la propiedad del estado escrita: quién lo crea, quién lo cambia, quién lo lee, qué lo invalida y cuándo se destruye. |
| **H5** | `MEDIA` | La decisión sobre `FormGroup` tipado está **escrita** con su plan de compatibilidad para los 52 consumidores, y las seis banderas están evaluadas una por una: se conserva, se convierte en variante, o se proyecta — con motivo. **Implementarlo puede ser oleada 2; decidirlo no.** |
| **H6** | `ALTA` | Regresión y gates corridos, capturas por viewport y tema miradas, §19 respondido con evidencia, y `REPORTE.md` escrito. |

> ⚠️ **Esto es más de lo que entra en una noche, y está dicho a propósito.** Un millón de bytes de
> contenedor no se separa en un turno. Lo que no se cierra queda `A MEDIAS` con qué anda, qué no anda
> y qué falta exactamente. **Una regla centralizada de verdad, con dos consumidores y sin regresión,
> vale más que seis contenedores medio partidos.**

**Kill-test del turno completo:** abrí el registro de profesional y el de paciente, y buscá en el
código la validación que dijiste que centralizaste. Si sigue escrita en los dos archivos, H3 no está
hecho. Después llená medio formulario, forzá un error de guardado y mirá si se perdió lo escrito: si
se perdió, el comportamiento cambió y eso es una regresión, no una mejora.

## 3. Alcance

**IN:** baseline de `lint`, `typecheck`, `test` y `audit:vistas` con rojos previos registrados · rutas
reales de los seis registros y del perfil · capturas previas · análisis de responsabilidad de los
contenedores elegidos, con la terna del §3 (responsabilidad × composición × ámbito) por pieza · ficha
de familia del §7.3 de **una regla concreta repetida**, con contraejemplo · extracción de esa regla a
un lugar único, con dos consumidores migrados · separación de vista y contenedor en **un** contenedor
grande, con la tabla de propiedad del estado del §4 · decisión escrita sobre `FormGroup` tipado, con
plan de compatibilidad · evaluación una por una de las seis banderas de `paginated-form` · specs
dirigidos al cambio · capturas por viewport y tema · `PLAN.md`, `REPORTE.md` y `evidencia/`.

**OUT:** **cualquier archivo fuera de los seis reservados de la ficha** · `features/form-builder/**`,
`features/admin/**`, `features/delegated-access/**`, `features/health-context/**`,
`features/identity-assurance/**`, `features/geo/**`, `features/auth-providers/**` — **son consumidores
de tu organismo pero no son tuyos**: si necesitás tocarlos, es oleada 2 y se declara · `features/auth/login*`
y el resto de `auth` que no sea `register-*` · `core/mock/**` — es de Ender · los tres barrels ·
**tipar `FormGroup` esta noche sin plan de compatibilidad**: 52 consumidores; el §10 exige adaptador
con consumidores identificados y condición de eliminación · **borrar una de las seis banderas** sin
haber medido quién la usa · **cambiar una validación clínica o un requisito de datos** porque
simplifica: agregar o quitar un campo, un formato o una restricción está prohibido por el §2.3 y por
la regla 00 §1.6 · **cazar `any`**: hay 0 · imponer `ControlValueAccessor` a un componente que no es
un control (§10.1) · perder el borrador al fallar el guardado · debilitar un spec para que pase ·
declarar `HECHO` una microtarea cuyo DoD no corriste.

## 4. Plan — hitos, subtareas y microtareas

Los seis estados permitidos son exactamente: `TODO`, `EN CURSO`, `HECHO`, `A MEDIAS`, `BLOQUEADO` y
`DESCARTADO`. **`A MEDIAS` es legítimo; disfrazarlo de `HECHO` no.**

### H1 — Corte, baseline y capturas previas

**Prioridad:** `BLOQUEANTE`

**CA:** Dado tu entorno, cuando alguien pregunta contra qué versión trabajaste y cómo se veían y se
comportaban los formularios antes, entonces hay SHA, capturas y una descripción del comportamiento —
no un recuerdo.
**DoD:** salidas del baseline en `evidencia/antes/`, seis capturas descritas, y el comportamiento de
dos formularios anotado paso por paso.
**Estado:** TODO

#### H1.S1 — Corte y baseline

**CA:** Dado un rojo posterior, cuando alguien pregunta si lo rompiste vos, entonces la respuesta sale
de un archivo.
**DoD:** salidas con su código de salida, pegadas.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H1.S1.M1 | Fijar corte y rama | Hay SHA y rama en `PLAN.md` | `git rev-parse origin/mockup && git branch --show-current` | TODO |
| H1.S1.M2 | Baseline de `lint` y `typecheck` | Hay salida y exit code | `yarn lint; yarn typecheck; echo "exit=$?"` → `evidencia/antes/` | TODO |
| H1.S1.M3 | Baseline de `test` | Hay conteo de fallos previos | `yarn test --watch=false` → `evidencia/antes/test.txt` | TODO |
| H1.S1.M4 | Clasificar cada rojo previo | Cada uno con su clase de la regla 80.4 | tabla en `PLAN.md` | TODO |

#### H1.S2 — El comportamiento de antes, anotado

**CA:** Dado un formulario que vas a separar, cuando alguien pregunte si cambió su comportamiento,
entonces hay una descripción previa paso por paso contra la que comparar.
**DoD:** dos formularios recorridos y anotados, con captura de cada paso relevante.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H1.S2.M1 | Sacar las rutas de los seis registros y del perfil del router | Hay lista de URLs verificadas | `git grep -n "register-" origin/mockup -- 'src/app/**/*.routes.ts' \| head -20` | TODO |
| H1.S2.M2 | Recorrer el registro de profesional y anotar cada paso | Hay lista de pasos, validaciones y mensajes | descripción + capturas en `evidencia/antes/` | TODO |
| H1.S2.M3 | Recorrer el registro de paciente igual | idem | idem | TODO |
| H1.S2.M4 | Probar y anotar el error de guardado: ¿se preserva lo escrito? | Hay un sí o un no observado | captura del formulario tras el fallo | TODO |
| H1.S2.M5 | Probar y anotar el doble envío | Hay un sí o un no observado | captura o descripción del intento | TODO |

#### H1.S3 — Capturas del perfil

**CA:** Dado el perfil de profesional, cuando alguien pregunte cómo se veía, entonces hay captura
previa en dos viewports y en los dos temas.
**DoD:** cuatro capturas descritas.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H1.S3.M1 | Capturar el perfil en modo consulta, escritorio y móvil | Dos capturas, miradas | `evidencia/antes/capturas/` con su línea | TODO |
| H1.S3.M2 | Capturar el perfil en modo edición | Dos capturas | idem | TODO |
| H1.S3.M3 | Revisar consola y red antes de tocar | Hay lista de errores previos | lista en `evidencia/antes/` | TODO |

### H2 — Encontrar la regla repetida, no el archivo grande

**Prioridad:** `ALTA`

**CA:** Dado el conjunto de registros, cuando afirmás que hay duplicación, entonces señalás **la misma
regla** escrita dos o más veces, con archivo y línea de cada copia, y declarás un contraejemplo: una
regla parecida que pertenece a otro dominio y **no** debe fusionarse.
**DoD:** ficha de familia del §7.3 con las copias citadas por línea.
**Estado:** TODO

#### H2.S1 — Clasificar los contenedores con la terna del §3

**CA:** Dado un contenedor, cuando lo clasificás, entonces tiene responsabilidad, nivel compositivo y
ámbito, y la clasificación sale de leer sus dependencias reales, no su carpeta.
**DoD:** tabla con una fila por contenedor y sus dependencias transitivas relevantes.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H2.S1.M1 | Listar las dependencias reales de dos registros | Hay lista, incluidas las transitivas relevantes | `git show origin/mockup:src/app/features/auth/register-practitioner/register-practitioner.ts \| grep -n '^import' ` | TODO |
| H2.S1.M2 | Clasificar cada pieza con la terna responsabilidad × composición × ámbito | Cada fila tiene las tres | tabla en `PLAN.md` | TODO |
| H2.S1.M3 | Señalar qué hay en el contenedor que NO es responsabilidad de contenedor | Hay lista con líneas | tabla con ruta y línea por hallazgo | TODO |
| H2.S1.M4 | Señalar qué hay en la plantilla que es orquestación de negocio | Hay lista con líneas | idem, sobre el `.html` | TODO |

#### H2.S2 — La regla repetida

**CA:** Dada la afirmación «esto está duplicado», cuando se verifica, entonces hay dos copias de la
misma regla citadas por línea, y está dicho qué cambio se haría **una sola vez** después de extraerla.
**DoD:** la ficha del §7.3 completa, con el contraejemplo.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H2.S2.M1 | Buscar validaciones o normalizaciones repetidas entre registros | Hay al menos una con dos copias citadas | `git grep -n '<patrón de la regla>' origin/mockup -- 'src/app/features/auth/register-*/**/*.ts'` | TODO |
| H2.S2.M2 | Comparar las cinco dimensiones del §7.1 sobre esa regla | Cinco veredictos | tabla | TODO |
| H2.S2.M3 | Escribir la ficha con los once campos del §7.3 | Tiene los once | el archivo | TODO |
| H2.S2.M4 | Declarar el contraejemplo | Hay una regla nombrada que NO se fusiona, con motivo | fila de la ficha | TODO |
| H2.S2.M5 | Decir qué cambio se hará una sola vez después de extraer | Hay un cambio concreto nombrado | fila de la ficha | TODO |

#### H2.S3 — La propiedad del estado, escrita

**CA:** Dado cada estado mutable de los formularios que vas a tocar, cuando alguien pregunta de quién
es, entonces la respuesta está escrita: quién lo crea, quién puede cambiarlo, quién lo lee, qué lo
invalida y cuándo se destruye.
**DoD:** la tabla del §4 completa para el contenedor elegido.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H2.S3.M1 | Enumerar los estados mutables del contenedor elegido | Hay lista | tabla en `PLAN.md` | TODO |
| H2.S3.M2 | Responder las cinco preguntas por estado | Ninguna fila queda incompleta | tabla | TODO |
| H2.S3.M3 | Señalar los estados derivados que hoy son copias mutables | Hay lista con líneas | tabla con ruta y línea | TODO |
| H2.S3.M4 | Señalar los `effect` que copian estado en vez de derivarlo | Hay lista, o se declara que no hay | `git grep -n 'effect(' origin/mockup -- '<tus archivos>'` | TODO |

### H3 — La regla vive una sola vez, y dos consumidores la usan

**Prioridad:** `ALTA`

**CA:** Dada la regla extraída, cuando la buscás en el repo, entonces está escrita una sola vez; y
cuando recorrés los dos registros que la consumen, entonces se comportan igual que en las notas de
H1.S2: mismos errores por campo, mismo bloqueo de doble envío, mismo dato preservado ante fallo.
**DoD:** la regla en un archivo, dos consumidores migrados, y los dos recorridos comparados contra
H1.S2 paso por paso.
**Estado:** TODO

#### H3.S1 — Extraer sin cambiar comportamiento

**CA:** Dada la extracción, cuando se compara el antes y el después, entonces no hay diferencia de
comportamiento que no esté justificada por escrito.
**DoD:** el test que protege la regla, en verde, y el recorrido comparado.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H3.S1.M1 | Escribir primero el test que protege la regla | Falla antes de extraer, pasa después | dos corridas pegadas | TODO |
| H3.S1.M2 | Extraer la regla como función pura tipada | No consulta DOM, no inyecta sesión, no hace HTTP | el archivo + revisión contra §3.1 | TODO |
| H3.S1.M3 | Migrar el primer consumidor | El registro sigue comportándose igual | recorrido comparado contra H1.S2.M2 | TODO |
| H3.S1.M4 | Migrar el segundo consumidor | idem | recorrido comparado contra H1.S2.M3 | TODO |
| H3.S1.M5 | Verificar que la copia vieja ya no existe | `git grep` de la regla da una sola definición | `git grep -n '<patrón>' -- 'src/app/features/auth/register-*/**'` | TODO |

#### H3.S2 — Que no se pierda lo que la persona escribió

**CA:** Dado un fallo de guardado, cuando la persona vuelve al formulario, entonces sigue lo que había
escrito; y dado un doble clic, entonces no se envía dos veces.
**DoD:** los dos comportamientos probados y comparados contra las notas de H1.S2.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H3.S2.M1 | Forzar el error de guardado y comprobar el borrador | Nada se perdió | captura tras el fallo, comparada con H1.S2.M4 | TODO |
| H3.S2.M2 | Probar el doble envío | No se envía dos veces | descripción + captura | TODO |
| H3.S2.M3 | Comprobar que el error del servidor se ancla al campo | El mensaje aparece en su campo, no como genérico | captura | TODO |
| H3.S2.M4 | Comprobar foco al primer error y etiqueta accesible | El foco va al primer error y todo campo tiene etiqueta | descripción por paso + captura del foco | TODO |

#### H3.S3 — Acreditar en el catálogo

**CA:** Dado lo que tocaste, cuando se monta en el catálogo, entonces se monta con un contrato válido y
con hijos reales, no un contenedor vacío.
**DoD:** escenario en el catálogo con captura.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H3.S3.M1 | Pedirle a Ender el escenario tipado si falta | El pedido está escrito | línea en el daily | TODO |
| H3.S3.M2 | Acreditar el organismo con contrato válido | La ficha monta con `paginas` y `form` reales | captura de la ficha | TODO |
| H3.S3.M3 | Mientras no exista, simular el contrato en tres niveles (regla 65) | Hay correcto, límite e inválido | tres corridas o tres capturas | TODO |

### H4 — Separar vista y contenedor en un contenedor grande

**Prioridad:** `ALTA`

**CA:** Dado el contenedor elegido, cuando alguien lee su plantilla, entonces ve regiones, estados y
acciones con nombres del problema, y no tiene que ejecutar mentalmente un algoritmo de negocio; y
cuando lee el contenedor, entonces ve conexión de casos de uso, no renderizado de celdas.
**DoD:** el diff, el comportamiento comparado contra H1, y la tabla de propiedad del estado cumplida.
**Estado:** TODO

#### H4.S1 — Bajar la presentación a la vista

**CA:** Dada la vista extraída, cuando se le pasan entradas explícitas, entonces pinta sin conocer
endpoints, sesión ni persistencia.
**DoD:** la vista con entradas y salidas tipadas, y su test de contrato.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H4.S1.M1 | Elegir el contenedor y declarar por qué ése | Hay criterio escrito | una línea en `PLAN.md` | TODO |
| H4.S1.M2 | Definir el contrato de la vista según el §10 | Las diez áreas respondidas | el archivo de contrato | TODO |
| H4.S1.M3 | Extraer la vista con entradas explícitas y salidas tipadas | No inyecta clientes de negocio | revisión del diff + `check-architecture` en verde | TODO |
| H4.S1.M4 | Comprobar que no muta los objetos que recibe | Hay test que lo demuestra | `yarn test --watch=false` acotado | TODO |
| H4.S1.M5 | Comprobar que una intención no se emite al cargar datos | Hay test que lo demuestra | idem | TODO |

#### H4.S2 — Que la plantilla describa la interfaz

**CA:** Dada la plantilla resultante, cuando se lee, entonces los eventos llaman una operación con
intención clara y las colecciones tienen identidad estable.
**DoD:** revisión del diff contra el §5.2, con los hallazgos corregidos.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H4.S2.M1 | Mover cálculos de dominio de la plantilla a funciones nombradas | La plantilla no calcula reglas | revisión del diff | TODO |
| H4.S2.M2 | Usar identidad estable en las colecciones, no el índice | No hay `track $index` donde la identidad importa | `git grep -n 'track \$index' -- '<tus archivos>'` | TODO |
| H4.S2.M3 | Verificar que ningún evento hace tres cosas en una expresión | Cada evento llama una operación | revisión del diff | TODO |
| H4.S2.M4 | Comparar el comportamiento con el recorrido de H1.S2 | Sin diferencias injustificadas | recorrido comparado | TODO |

### H5 — Las dos decisiones que no se pueden tomar en silencio

**Prioridad:** `MEDIA`

**CA:** Dado `form: FormGroup` sin tipar y las seis banderas, cuando alguien pregunta qué se decidió,
entonces hay una decisión escrita por cada una, con su plan de compatibilidad y su alternativa
descartada — aunque la implementación quede para la oleada 2.
**DoD:** las decisiones en un archivo del repo, con los 52 consumidores nombrados como superficie.
**Estado:** TODO

#### H5.S1 — La decisión sobre `FormGroup` tipado

**CA:** Dada la decisión, cuando se lee, entonces dice qué se gana, a quién rompe, qué adaptador
temporal se usa y **cuándo se elimina** ese adaptador.
**DoD:** la decisión escrita + la lista de los 52 consumidores.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H5.S1.M1 | Listar los 52 consumidores | El conteo da 52 | `git grep -l '<app-paginated-form' origin/mockup -- 'src/app/**/*.html' \| wc -l` | TODO |
| H5.S1.M2 | Escribir la decisión con su plan de compatibilidad | Dice qué adaptador y cuándo se retira | el archivo de decisión | TODO |
| H5.S1.M3 | Declarar la alternativa descartada | Hay al menos una, con motivo | idem | TODO |
| H5.S1.M4 | Si se implementa: probar una muestra de cinco consumidores ajenos | Las cinco pantallas funcionan igual | cinco capturas comparadas | TODO |

#### H5.S2 — Las seis banderas, una por una

**CA:** Dada cada bandera booleana, cuando se evalúa, entonces queda decidido si se conserva, se
convierte en variante semántica o se resuelve por proyección — con el mecanismo del §8 nombrado.
**DoD:** seis filas, cada una con decisión y motivo, y quién la usa hoy.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H5.S2.M1 | Medir quién usa cada una de las seis | Seis conteos | `git grep -c 'interactiveSteps\|iconOnlyNav\|compactSteps\|destructive' origin/mockup -- 'src/app/**/*.html'` | TODO |
| H5.S2.M2 | Decidir por cada una: conservar / variante / proyección | Seis decisiones con motivo | tabla en el archivo de decisión | TODO |
| H5.S2.M3 | Verificar que ninguna bandera lleva nombre de pantalla | Ninguna lo lleva, o se registra la que sí | revisión del contrato | TODO |
| H5.S2.M4 | No borrar ninguna esta noche sin consumidores en cero | Nada se borró con uso vivo | las mediciones pegadas | TODO |

### H6 — Regresión, gates y cierre

**Prioridad:** `ALTA`

**CA:** Dado el cierre, cuando alguien que no vio tu turno lee el reporte, entonces sabe qué quedó
demostrado, qué quedó a medias con las cuatro respuestas, y qué no se cubrió.
**DoD:** baseline repetido y comparado, capturas miradas, §19 respondido y `REPORTE.md` escrito.
**Estado:** TODO

#### H6.S1 — Regresión, con la muestra de consumidores ajenos

**CA:** Dado tu cambio, cuando corrés los comandos del baseline, entonces ningún rojo es nuevo; y si
tocaste `paginated-form` o `form-field`, entonces cinco consumidores ajenos están comprobados a mano.
**DoD:** salidas comparadas + cinco capturas de consumidores ajenos.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H6.S1.M1 | `lint` y `typecheck` | Sin rojos nuevos | diff contra baseline | TODO |
| H6.S1.M2 | `test` completo | Sin rojos nuevos | diff contra baseline | TODO |
| H6.S1.M3 | Cinco consumidores ajenos de `paginated-form`, a mano | Las cinco se comportan igual | cinco capturas comparadas | TODO |
| H6.S1.M4 | E2E dirigido al registro que tocaste, `--workers=1` | Pasa | salida pegada | TODO |
| H6.S1.M5 | Barrido de las rutas de `auth` y `my-profile` | Ninguna ruta rompe | salida pegada | TODO |

#### H6.S2 — Cierre honesto

**CA:** Dado el reporte, cuando se lee la primera línea, entonces está el avance calculado; y ninguna
palabra es más fuerte que la evidencia.
**DoD:** `REPORTE.md` con sus tres secciones y el avance arriba.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H6.S2.M1 | Capturas finales por viewport y tema | Cinco capturas con su línea | `evidencia/h6/` | TODO |
| H6.S2.M2 | Comprobar teclado en el formulario tocado | Se completa sin mouse | descripción por paso | TODO |
| H6.S2.M3 | Responder las 20 preguntas del §19 | Cada una con evidencia | sección en `REPORTE.md` | TODO |
| H6.S2.M4 | Declarar el peldaño por área (regla 30) | Hay peldaño por área | sección en `REPORTE.md` | TODO |
| H6.S2.M5 | Escribir `REPORTE.md` con el avance primero | `head -3` muestra el avance | `head -3 REPORTE.md` | TODO |

## 5. Ambigüedades registradas

| ID | Ambigüedad | Supuesto con el que trabajás | Quién puede resolverla | Qué bloquea |
|---|---|---|---|---|
| Q-I1 | ¿`form: FormGroup` se tipa en esta oleada o en la siguiente? | Se **decide** esta noche, se **implementa** en la siguiente salvo que el plan de compatibilidad salga trivial | Pablo | H5.S1 |
| Q-I2 | ¿Alguna de las seis banderas se puede retirar? | Ninguna se retira sin consumidores en cero medidos | Pablo | H5.S2 |
| Q-I3 | ¿Los seis registros comparten una política de borrador, o cada uno tiene la suya por dominio? | Hay que **demostrarlo** en H2.S2, no asumirlo | Producto | H2, H3 |
| Q-I4 | Si la entidad cambia mientras se edita el perfil, ¿se conserva el borrador o gana lo remoto? | No se elige en silencio (§10.1): se registra y se mantiene lo que hace hoy | Producto | H4 |
| Q-I5 | ¿Se pueden tocar los consumidores ajenos de `paginated-form` (12 features)? | No en esta oleada; si hace falta, se declara como oleada 2 | Pablo | H5 |

## 6. Definition of Done del hito

- [ ] Todas sus microtareas en `HECHO`, o en `A MEDIAS`/`BLOQUEADO`/`DESCARTADO` **con las cuatro
      respuestas**.
- [ ] La salida literal del comando de cada DoD está en `evidencia/`, no parafraseada.
- [ ] `yarn lint`, `yarn typecheck` y `yarn test --watch=false` sin rojos **nuevos** respecto del
      baseline de H1.S1, con el diff pegado.
- [ ] El comportamiento del formulario está comparado **paso por paso** contra las notas de H1.S2, no
      sólo visualmente.
- [ ] Si tocaste `paginated-form` o `form-field`: cinco consumidores ajenos comprobados a mano.
- [ ] El borrador se preserva ante fallo, el doble envío está bloqueado, y el error del servidor se
      ancla a su campo (regla 95.3).
- [ ] Capturas por viewport y tema, **miradas**, con una línea cada una.
- [ ] Peldaño de evidencia declarado por área (regla 30).
- [ ] Sin datos de personas en logs, capturas, plan ni reporte (regla 90.2). Los registros manejan
      datos personales: **usá los sintéticos declarados**.
- [ ] El `PLAN.md` está actualizado en el momento, no al final.

## 7. Cómo cerrás el turno

1. **Checkpoint** en cada apertura y cierre de microtarea. Prohibido encadenar más de tres operaciones
   materiales sin uno.
2. **`REPORTE.md`** con el avance en la **primera línea**: `> **AVANCE: <HECHO> / 64 — <%>.**`
3. **Las tres secciones obligatorias existen siempre.** Una vacía se escribe con «ninguna».
4. **Lo que dependa de Ender o de una decisión de Pablo** no cierra como `BLOQUEADO` sin haber simulado
   los tres niveles de su contrato (regla 65).
5. **Enumerá qué quedó corriendo** y cerralo.
6. **Tu daily** es `Itzan-Daily-Noche-2026-09-21.md`, en la carpeta de arriba.

## 8. Revisión adversarial antes de cerrar

1. ¿Existe un smart gigante trasladado a una fachada gigante? (§19.2)
2. ¿La UI consigue negocio mediante una dependencia indirecta con nombre inocente? (§19.3)
3. ¿Hay dos estados que representan el mismo hecho y dependen de sincronización manual? (§19.4)
4. ¿La extracción borró una diferencia real de dominio porque dos formularios se parecían? (§19.6)
5. ¿Un cambio externo pierde un borrador, una selección o una respuesta vigente? (§19.12)
6. ¿Un output se llama éxito aunque sólo se emitió una solicitud? (§19.14)
7. ¿Se declara verificado algo que sólo fue inspeccionado estáticamente? (§19.18)
8. ¿Se agregó una capa que sólo reenvía todos los métodos y obliga a conocer lo mismo? (§4)
9. ¿Se cambió un requisito de datos —un campo, un formato, una restricción— para que la separación
   quedara más limpia? Eso está prohibido por el §2.3.
10. ¿Se rompió alguno de los 52 consumidores de `paginated-form`, y lo sabés o lo supones?
