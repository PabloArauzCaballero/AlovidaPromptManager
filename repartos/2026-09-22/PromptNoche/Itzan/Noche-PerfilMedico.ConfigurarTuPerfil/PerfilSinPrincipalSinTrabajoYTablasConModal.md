# El perfil del médico como lo pidió el doctor: sin «principal», sin datos del trabajo, y tres tablas que se editan en modal con confirmación, adjunto, buscador y paginación

> **Rol:** dueña del perfil del médico (`account/my-profile`), del selector de ubicación (`ubicacion-picker`) y de las altas (`register-*`) · **Línea:** B · **Fecha:** 2026-09-22 · **Turno:** noche
> **Fuente del pedido:** [`CORRECCIONES-DOCTOR-Y-PACIENTE-2026-09-22.md`](../../../../../docs/requisitos/CORRECCIONES-DOCTOR-Y-PACIENTE-2026-09-22.md) — **D-01, D-02, D-03, D-06, D-07, D-08, D-09, D-10, N-03**
> **Verificación contra el código:** [`VERIFICACION-CONTRA-CODIGO-2026-09-22.md`](../../../../../docs/verificacion/VERIFICACION-CONTRA-CODIGO-2026-09-22.md) — §1, §2 (D-01…D-10, N-03), §3, §4 (HALL-E3, E6, E7, E13, E15)
> **Plan maestro:** [`PLAN-MAESTRO.md`](../../../../../docs/trabajo/2026-09-22-plan-y-reparto-correcciones-doctor-y-paciente/PLAN-MAESTRO.md) — dependés de Pablo (ADR-0015, paginador, historial como tabla) y de Marcelo (confirmación); **no te quedes esperando** (regla 65)
> **8 hitos · 18 subtareas · 93 microtareas**, todas con criterio de aceptación y Definition of Done.
>
> **Tu carril es el más largo de la noche y es el que el doctor mira primero.** Nueve observaciones
> caen en `account/my-profile/**`, que es tuyo desde el 21/09. Casi todo lo que hace falta **ya existe
> en tu territorio** —el modal de editar, la insignia compartida, los `file-input`, el mecanismo para
> sacar un campo del alta de una pestaña— y el trabajo es **quitar, mover y completar**, no crear.
> El orden importa: **H2 primero** (tres quitas que el doctor va a ver de inmediato), después H3 y H4.

## 0. Ficha de asignación

| Campo | Valor |
|---|---|
| `REPO` | `alovida/mantra-core-health` (frontend Angular). **Nada de backend en este lote** |
| `TARGET_REF` | `origin/mockup` — corte leído **`b655e8449abd662d6b24156fd6e2b06aeb120cc1`** (2026-09-22T18:04-04). Tu PR #571 («el rechazo del servidor, junto a su campo») ya está adentro. **Reconsultalo y fijá el tuyo** en tu `PLAN.md` |
| `RAMA DE TRABAJO` | Una tuya, saliendo de `origin/mockup`. **Nada directo sobre `mockup`, nada sin PR** |
| `ARCHIVOS RESERVADOS PARA VOS` | `src/app/features/account/my-profile/**` **menos** `work-history/**` (que esta noche es de Pablo) · `src/app/features/account/loyalty/**` · `src/app/features/auth/registro-compartido/ubicacion-picker/**` · `src/app/features/auth/register-*/**` (las seis altas, tuyas desde el 21/09) · `src/app/shared/components/organisms/{specialty-badge,specialty-badge-grid}/**` · `organisms/{paginated-form,date-picker}/**` y `atoms/back-link/**` (sólo para D-05) · `src/app/core/mock/handlers/{profiles,files}.handlers.ts` |
| `ARCHIVOS DE OTROS — NO LOS TOQUES` | `work-history/**`, `organisms/{data-table,filter-bar}/**`, `molecules/{pagination,row-actions}/**`, `docs/adr/**` (**Pablo**) · `organisms/content-dialog/**`, `molecules/dialog/**`, `features/symptom-check/**`, `features/dashboard/patient-home/**` (**Marcelo**) · `features/directory/**`, `nearby-places/**`, `where-to-buy/**`, `laboratory-directory/**`, `public-directories/**` (**Justin**) · `core/mock/mock-backend.interceptor.ts`, `core/mock/fixtures/**`, `core/mock/handlers/scheduling.handlers.ts`, `core/navigation/**`, `features/shell-layout/**`, `organisms/header/**`, `src/app/app.routes.ts` y **los tres barrels** (**Ender**) |
| `⚠️ RIESGO ALTO DE TU CARRIL` | `specialty-badge` y `specialty-badge-grid` los montan **la ficha, el directorio y el perfil público** (C-09 los hizo homogéneos): quitar el tono «principal» cambia esas tres pantallas a la vez — comprobalas. `pestanas-del-perfil-medico.spec.ts` **falla si un campo del alta queda sin pestaña** (HALL-E6): D-03 saca tres, y el mecanismo para declararlo existe. `paginated-form` tiene **52** consumidores: D-05 ahí es «excepción o texto», nunca un cambio de comportamiento |
| `LA MAQUETA NO TIENE BACKEND` | `mockBackend: true` fijo. **Editar título/especialidad/matrícula y retirar especialidad/matrícula existen sólo en el simulador** (`profiles.client.ts:775-786`, HALL-E3); el `PATCH` que acepte `fileId` al corregir lo escribís vos en `profiles.handlers.ts`, y lo cerrás `VERIFIED` **contra el doble**, declarado |
| `CUENTA DE PRUEBA` | `medica@alovida.mock` para todo el perfil; `paciente@alovida.mock` para N-03 (cualquier contraseña no vacía). **Sintéticas declaradas** |
| `DÓNDE SE PRUEBA` | `/my-account` (ficha: `practitioner-profile-view.html`) y `/my-account/edit` (editor: `practitioner-profile-edit.html`), pestañas por índice de `PESTANA_MEDICO`. Las altas cuelgan de `auth`. **Sacá las URLs del router, no las supongas** |
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

⚠️ **Antes de `cp -r`, mirá qué hay:** el repo de producto **ya tiene** su propio `.claude/`. Si ibas a
pisar algo, no lo pises: fusioná y dejá constancia en tu daily.

### 1.2 Qué te instala eso

| Candado | Qué impide |
|---|---|
| `plan_gate.py` | Escribir código sin `PLAN.md` en disco. Nunca bloquea `.md` ni nada bajo `docs/` |
| `report_gate.py` | Cerrar la sesión con trabajo activo y sin `REPORTE.md`, o sin sus tres secciones |
| `blocker_gate.py` | Cerrar con microtareas en `BLOQUEADO` o `EN CURSO` sin declarar la simulación de los tres niveles del contrato (regla 65) |

**En cualquier otra herramienta los candados NO corren.** El plan y el reporte siguen siendo igual de
obligatorios; lo único que cambia es que nadie te va a frenar.

### 1.3 Skills que tenés que CARGAR para este lote

Son **28**: 11 del proceso y 17 propias del perfil.

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
| `frontend-forms-ux` | **la más importante de tu lote**: guardar por cambios, confirmación, datos preservados ante fallo, sin doble envío |
| `angular-forms` | el formulario dentro del modal con errores por campo y el 422 del simulador anclado al campo (tu PR #571) |
| `frontend-data-tables` | las tres tablas del perfil con barra, paginación y acciones por fila |
| `atomic-design-components` | reusar `content-dialog`, `file-input`, `filter-bar`, `pagination` — no rearmarlos |
| `smart-dumb-components` | `Loyalty` como pestaña: separar cabecera de contenido sin duplicar la pantalla |
| `angular-signals-state` | «hay cambios» como `computed` sobre el borrador; nada de `effect` para copiar estado |
| `file-uploads-media` | el adjunto al corregir: tipo real, tamaño, `fileId`, y qué pasa con el archivo viejo |
| `maps-geolocation` | el `output` del selector al tocar el mapa; qué se vacía y qué se anuncia |
| `frontend-accessibility` | el anuncio para lectores que reemplaza a «Listo, guardamos…»; nombre accesible en cada botón |
| `accessibility-testing` | teclado completo en los tres modales, con evidencia |
| `frontend-ux-states` | los cuatro estados de las tablas y de la billetera embebida |
| `ux-writing-microcopy` | «Correo de acceso», «¿Confirmás estos cambios?», «Volvé a escribir la dirección» |
| `data-privacy-phi` | el perfil son datos personales: sólo cuentas sintéticas en capturas y reporte |
| `dead-code-duplication` | qué se retira cuando «principal» y «Estado de la práctica» dejan de usarse, medido antes |
| `unit-testing` | un comportamiento por test; los tres niveles del contrato |
| `angular-testing` | `setInput`, `whenStable` en zoneless, `HttpTestingController` para el `PATCH` con `fileId` |
| `visual-proof` | la captura no vale si no la mirás |

Entrá siempre por `skills-router`: **no leas el catálogo entero, no sirve.**

### 1.4 DoD de esta sección — se verifica como cualquier otra

- [ ] `ls .claude/skills | wc -l` devolvió **176**, y la salida está pegada en tu daily.
- [ ] `python .claude/hooks/plan_gate.py --self-test` devolvió **11 PASS, 0 FAIL**, salida pegada.
- [ ] Leíste `skills-router` y las 28 skills de las dos tablas, **empezando por `frontend-forms-ux`**.
- [ ] Creaste tu `PLAN.md` **antes** del primer `Edit`/`Write` de código.

**Sin estas cuatro casillas, tu lote arranca en `BLOQUEADO`, no en `EN CURSO`.**

> ### ✅ Hechos ya verificados contra el corte — no los repitas, pero tampoco los creas sin abrir el archivo
>
> #### D-01 — «principal» vive en cinco lugares tuyos y en cero de la API que vayas a tocar
>
> | Dónde | Qué hay | Qué hacer |
> |---|---|---|
> | `organisms/specialty-badge/specialty-badge.ts:81,89` | `principal = input(false)` → `tone--primary` | El tono deja de depender de `principal` (o el input queda sin efecto y documentado) |
> | `organisms/specialty-badge-grid/specialty-badge-grid.ts:19-22,54` | «La principal va primera»: ordena una copia por `principal` | Sin ordenar por principal; el orden es el que llega |
> | `practitioner-profile-edit.ts:706-720, 734, 775-776, 1229-1252` | La columna «Tipo» es el gesto «Marcar como principal»; `filasEspecialidades` «la principal primero»; `marcarComoPrincipal` llama a `setOwnPrimarySpecialty` | Se retiran el gesto, el orden y el `caption` «la principal primero» (`.html:635`); la columna «Tipo» vuelve a ser dato o se quita si queda vacía |
> | `practitioner-profile-edit.html:1010-1013` | El modal dice «Cuál es la principal NO se toca acá» | El comentario se actualiza: ya no hay principal |
> | `auth/register-practitioner/register-practitioner.ts:1967` | `label: 'Especialidad principal (opcional)'` | El alta deja de preguntarla; `specialtyPrimary` sale de `CAMPO_DEL_ALTA_EN_PESTANA` con motivo (o el campo del alta se retira, y el spec lo acompaña) |
>
> **El contrato `isPrimary` no se toca** (`practitioner_specialties.entity.ts:50`, `PATCH …/specialties/:id/primary`):
> el front deja de mandarlo y de ordenar por él; queda anotado como deuda (Q-1). El simulador tiene
> `PrincipalElegida` (`profiles.handlers.ts:45-58`): **no lo borres de paso** — medí quién lo usa y anotalo.
>
> #### D-02 — una fila
>
> `practitioner-profile-view.html:221-224`: `<dt>Estado de la práctica</dt><dd>{{ perfil().estadoDePractica }}</dd>`.
> El dato sigue en el contrato (`profiles.types.ts:129,416`; obligatorio al crear en la API). **No se toca el contrato.**
>
> #### D-03 — tres filas en la ficha, dos campos y una sección en el editor, y un spec que te espera
>
> Ficha (`practitioner-profile-view.html:257-362`): Correo de trabajo (L266), Celular del trabajo (L299),
> Fijo del trabajo (L310). Editor (`practitioner-profile-edit.html:185-324`): Celular del trabajo (L286),
> Fijo del trabajo (L298), y la sección de sólo lectura «Tu correo de trabajo» (L311-322): «Es con el que
> entrás. Se cambia por su propio trámite». **Ese correo es la identidad de acceso** (`profiles.types.ts:375`):
> no puede desaparecer del producto. Supuesto Q-3: se muestra como «Correo de acceso» en «Datos personales».
>
> `pestanas-del-perfil-medico.ts` mapea `workMobilePhone`, `workLandline`, `email` → `contacto`, y el spec
> **falla si un campo del alta queda sin pestaña**. El archivo ya tiene `CAMPOS_DEL_ALTA_SIN_PESTANA` con
> `password` y `sexAtBirth` y su motivo escrito: **es exactamente el mecanismo para D-03**. No debilites el spec.
>
> #### D-08/D-09/D-10 — el modal de editar existe; lo que falta es lo demás
>
> `practitioner-profile-edit.html:961-1071`: **un** `app-content-dialog` para título, especialidad y matrícula,
> con `app-form-actions submitLabel="Guardar cambios" [disabled]="!puedeGuardarEdicion()"`. Hoy se habilita
> **por validez** (`.ts:1505`), no por cambios. **Sin `app-file-input`** en ninguno de los tres casos.
> Las altas («Agregar formación» L390-492, «Agregar especialidades» L521-624, «Agregar una matrícula» L640-718)
> son formularios **en línea** sobre cada tabla: es lo que D-04 prohíbe. Las tablas (`tabla-formacion` L502,
> `tabla-especialidades` L628, `tabla-matriculas` L722) son `app-data-table` sobre listas locales
> (`ready(filas)`, `.ts:811-813`): **se paginan en cliente** (decisión Q-5 de Pablo).
> Los «Retirar» llaman a `retirarFila` (`.ts:1581-1630`) que tiene un `dialogs.confirm` — **ejercitalo** en H1.
>
> Columnas hoy: formación `tipo · numero · institucion · emision · estado · acciones` (`.ts:688-703`) — ya son
> las que D-09 pide; la institución viaja como texto (`issuingInstitutionText`), no como id (Q-8).
> Archivo: el título y la matrícula lo llevan al **agregar** (`app-file-input`, PDF/JPG/PNG, 5 MB, `fileId`
> en el contrato real: `own-credential.dto.ts:70-75`); la especialidad **no tiene `file_id`** en la API,
> tiene `supporting_credential_id` (HALL-E7).
>
> #### D-06/D-07 — el selector no emite al tocar el mapa, y el texto tiene tres copias
>
> `ubicacion-picker.html:18` `(pointPicked)="fijarPunto($event)"` → `.ts:331-345`. Sus salidas son
> `confirmado` y el quitar: **no hay evento «tocaron el mapa»**. El campo «Dirección» vive en el padre
> (editor: `practitioner-profile-edit.html:228-236`, señal `direccion`). Nueve plantillas montan mapa; las
> tuyas: editor médico, editor paciente y seis altas (`register-patient.html` tiene **dos copias en línea** del
> selector, ~L300-350 y ~L580-612, que no usan `app-ubicacion-picker`).
> «Listo, guardamos…» está en `ubicacion-picker.html:56`, `register-patient.html:342` y `:605` — con `appAnuncio`
> y `data-testid` que usan specs y el barrido (HALL-E13).
>
> #### N-03 — cuatro pestañas y una pantalla con cabecera propia
>
> `pestanas-del-perfil.ts:20-33` (`PESTANAS_DEL_PERFIL`, 4) compartido por `my-profile.html:167-425` y
> `patient-profile-edit.html:30-372`. `loyalty.html:1-5` abre con `app-page-header` y breadcrumbs; `loyalty.ts`
> lee `GET /loyalty/me` y `/loyalty/me/points`. La ruta `/my-account/loyalty` la usan `promotion-card.ts:42` y
> `punto-motivo.ts:117`: **se conserva** y Ender la redirige (Q-17).
>
> ⚠️ **Lo que la verificación NO hizo: ejecutar.** Nada se levantó ni se corrió. Que el `confirm` de retirar
> exista en el `.ts` no prueba que se dispare: H1 lo ejercita.

## 2. Resultado observable

| Hito | Prioridad | Qué queda demostrado |
|---|---|---|
| **H1** | `BLOQUEANTE` | Corte declarado, baseline con rojos previos clasificados, capturas **antes** de la ficha y del editor, y tres comportamientos **ejercitados**: ¿«Guardar cambios» se habilita sin cambios?, ¿los tres «Retirar» confirman?, ¿la insignia principal se ve en directorio y perfil público? |
| **H2** | `ALTA` | La ficha no muestra «Estado de la práctica»; ninguna especialidad se distingue como principal en ficha, editor, alta, directorio ni perfil público; «Contacto» no muestra correo, celular ni fijo del trabajo; el correo de acceso se lee en «Datos personales»; `pestanas-del-perfil-medico.spec` en verde **sin debilitarlo**. |
| **H3** | `ALTA` | Trayectoria: agregar y corregir un título es en modal, con adjunto (también al corregir), «Guardar» por cambios y confirmación; la institución del catálogo se ve con su código; «Lugares donde trabajé» está en la misma pestaña. |
| **H4** | `ALTA` | Credenciales: especialidades y matrículas siguen la misma disciplina; las tres tablas tienen buscador multicampo, filtro por estado, «Añadir» a la derecha, scroll vertical sin lateral y paginación con selects. |
| **H5** | `ALTA` | Tocar el mapa vacía «Dirección» en el editor, en el editor del paciente y en las seis altas; «Listo, guardamos…» no se ve, y el lector de pantalla sigue recibiendo la confirmación. |
| **H6** | `MEDIA` | Los 37 `iconOnly` de tus archivos tienen texto o la excepción escrita al lado. |
| **H7** | `MEDIA` | `/my-account` del paciente tiene cinco pestañas y la quinta es la billetera sin cabecera duplicada; el pedido a Ender está anotado. |
| **H8** | `ALTA` | Regresión y gates corridos, capturas por viewport y tema miradas, teclado completo en los modales, y `REPORTE.md` escrito. |

> ⚠️ **Esto es más de lo que entra en una noche, y está dicho a propósito.** Orden: **H2 → H3 → H4 → H5**; H6
> y H7 al final. Lo que no se cierra queda `A MEDIAS` con qué anda, qué no anda y qué falta exactamente.
> **Una tabla que cumple la disciplina entera vale más que tres a medias.**

**Kill-test del turno completo:** entrá como `medica@alovida.mock`. En `/my-account` → Datos personales: si
se lee «Estado de la práctica» o una insignia se ve distinta de las otras, H2 no está hecho. Contacto: si se
lee «Correo de trabajo», tampoco. En `/my-account/edit` → Trayectoria: si «Agregar formación» es un formulario
debajo del título y no un botón a la derecha que abre un modal, H3 no está hecho; abrí «Editar» sobre un
título, no toques nada: si «Guardar» está habilitado, tampoco; cambiá la fecha y guardá: si no aparece
«¿Confirmás estos cambios?», tampoco; y si el modal no ofrece el diploma, tampoco. Contacto del editor:
escribí una dirección y tocá el mapa: si el campo conserva el texto, H5 no está hecho.

## 3. Alcance

**IN:** baseline y capturas previas · retiro de «Estado de la práctica» · retiro de la noción «principal»
en insignia, rejilla, editor, alta y tipos del front · «Contacto» sin datos del trabajo y «Correo de acceso»
en Datos personales · `CAMPOS_DEL_ALTA_SIN_PESTANA` con los tres campos · Trayectoria: alta en modal,
edición con adjunto, guardar por cambios, dos confirmaciones, institución con código, historial montado en
la pestaña · Credenciales: lo mismo para especialidades y matrículas · barra, paginación en cliente y scroll
vertical en las tres tablas · `output` del `ubicacion-picker` al tocar el mapa y su aplicación en tus ocho
formularios · retiro de «Listo, guardamos…» conservando el anuncio accesible · veredicto por cada `iconOnly`
tuyo · «Mis puntos» como quinta pestaña del paciente · el `PATCH` del simulador que acepta `fileId` al
corregir · specs dirigidos · capturas por viewport y tema · `PLAN.md`, `REPORTE.md` y `evidencia/`.

**OUT:** **cualquier archivo fuera de los reservados de la ficha** · `work-history/**`: esta noche es de
**Pablo** (Dónde atiendo y el historial como tabla); vos **montás** lo que él publique · `data-table`,
`filter-bar`, `pagination`, `row-actions` y el ADR-0015 (**Pablo**): si no llegaron, montás lo que hay y
declarás · `content-dialog` y `dialog-service` (**Marcelo**): llamás a `dialogs.confirm()` tal como existe si
su pieza no llegó · `core/navigation/**` y `app.routes.ts` (**Ender**): el renglón de «Mis puntos» y el
redirect se **piden** · `mantra-core-health-api/**` — **no se escribe API esta noche**: `isPrimary`,
`practiceStatus` y los endpoints que faltan (HALL-E3, E7) se declaran, no se tocan · **debilitar
`pestanas-del-perfil-medico.spec.ts`** para que pase: el mecanismo correcto es `CAMPOS_DEL_ALTA_SIN_PESTANA`
· **cambiar el comportamiento por omisión** de `paginated-form`, `date-picker` o `back-link` (D-05 ahí es
texto o excepción) · **borrar `PrincipalElegida` del simulador de paso** · **inventar un campo de archivo
para especialidades en el contrato**: se vincula a un título o se simula, declarado · cambiar un requisito
de datos del alta (regla 00 §1.6) · declarar `HECHO` una microtarea cuyo DoD no corriste.

## 4. Plan — hitos, subtareas y microtareas

Los seis estados permitidos son exactamente: `TODO`, `EN CURSO`, `HECHO`, `A MEDIAS`, `BLOQUEADO` y
`DESCARTADO`. **`A MEDIAS` es legítimo; disfrazarlo de `HECHO` no.**

### H1 — Corte, baseline y capturas previas

**Prioridad:** `BLOQUEANTE`

**CA:** Dado tu entorno, cuando alguien pregunta contra qué versión trabajaste y cómo se veía y se
comportaba el perfil antes, entonces hay SHA, capturas y tres comportamientos observados — no un recuerdo.
**DoD:** salidas del baseline en `evidencia/antes/`, seis capturas descritas, y la tabla de comportamiento previo.
**Estado:** TODO

#### H1.S1 — Corte y baseline

**CA:** Dado un rojo posterior, cuando alguien pregunta si lo rompiste vos, entonces la respuesta sale de un archivo.
**DoD:** salidas con su código de salida, pegadas; cada rojo previo clasificado.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H1.S1.M1 | Fijar corte y rama | Hay SHA y rama en `PLAN.md` | `git fetch origin && git rev-parse origin/mockup && git branch --show-current` | TODO |
| H1.S1.M2 | Baseline de `lint` y `typecheck` | Hay salida y exit code | `yarn lint; echo "exit=$?"; yarn typecheck; echo "exit=$?"` → `evidencia/antes/` | TODO |
| H1.S1.M3 | Baseline de `test` | Hay conteo de fallos previos | `yarn test --watch=false` → `evidencia/antes/test.txt` | TODO |
| H1.S1.M4 | Clasificar cada rojo previo | Cada uno con su clase de la regla 80.4 | tabla en `PLAN.md` | TODO |

#### H1.S2 — Capturas y comportamiento previo, ejercitado

**CA:** Dado el perfil, cuando alguien pregunte cómo se veía y qué hacía antes, entonces hay capturas de
la ficha y del editor y tres respuestas observadas, no leídas del código.
**DoD:** seis capturas con su línea + tabla de tres filas en `evidencia/antes/comportamiento.md`.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H1.S2.M1 | Capturar la ficha (Datos personales, Contacto) y el editor (Trayectoria, Credenciales) en escritorio y móvil, miradas | Seis capturas con una línea cada una | `evidencia/antes/capturas/` | TODO |
| H1.S2.M2 | Ejercitar: abrir «Editar» sobre un título y mirar si «Guardar cambios» está habilitado sin tocar nada | Un sí o un no observado | fila en `comportamiento.md` + captura | TODO |
| H1.S2.M3 | Ejercitar: pulsar «Retirar» en las tres tablas y anotar si aparece confirmación | Tres observaciones | fila + captura | TODO |
| H1.S2.M4 | Ejercitar: dónde se ve la insignia «principal» hoy (ficha, directorio `/directory`, perfil público) | Lista de pantallas con captura | fila + capturas | TODO |
| H1.S2.M5 | Revisar consola y red antes de tocar | Lista de errores previos, o «ninguno» | `evidencia/antes/consola-red.txt` | TODO |

### H2 — Datos personales y Contacto: tres quitas y un traslado (D-01, D-02, D-03)

**Prioridad:** `ALTA`

**CA:** Dado el perfil del médico, cuando se lo mira, entonces no hay «Estado de la práctica», ninguna
especialidad se distingue como principal en ningún lugar, y «Contacto» no muestra datos del trabajo — con
el correo de acceso visible en sólo lectura y los specs en verde sin debilitarlos.
**DoD:** specs en verde (`practitioner-profile-view`, `practitioner-profile-edit`, `specialty-badge-grid`,
`pestanas-del-perfil-medico`); capturas ×3 viewports ×2 temas.
**Estado:** TODO

#### H2.S1 — D-02: quitar «Estado de la práctica»

**CA:** Dada la ficha, cuando se abre Datos personales, entonces la fila no existe, y nada más se rompió.
**DoD:** spec en verde; captura.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H2.S1.M1 | Medir quién usa `estadoDePractica` antes de tocar | Lista de usos | `git grep -n 'estadoDePractica' origin/mockup -- 'src/app/**/*.ts' 'src/app/**/*.html'` | TODO |
| H2.S1.M2 | Quitar la fila de `practitioner-profile-view.html:221-224` | No se dibuja | `git grep -c 'Estado de la práctica' -- src/app` → 0 | TODO |
| H2.S1.M3 | Retirar lo que la calculaba **sólo si** M1 dio cero usos restantes; si no, anotar | Sin código muerto o anotado | diff + nota en `PLAN.md` | TODO |
| H2.S1.M4 | Spec de la vista en verde; captura | Verde + captura mirada | `npx ng test --include=src/app/features/account/my-profile/practitioner-profile/**/*.spec.ts --watch=false` | TODO |

#### H2.S2 — D-01: todas las especialidades por igual

**CA:** Dada cualquier pantalla que muestre especialidades, cuando se la mira, entonces todas las
insignias se ven iguales, no hay «Marcar como principal», la tabla no ordena por principal, y el alta no
pregunta cuál es la principal.
**DoD:** specs en verde; capturas de ficha, editor, `/directory` y perfil público.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H2.S2.M1 | Inventario medido de todo lo que lee `principal`/`isPrimary` en el front | Lista con ruta:línea | `git grep -n -E 'principal\|isPrimary' origin/mockup -- 'src/app/**/*.ts' 'src/app/**/*.html' ':!*.spec.ts'` → `evidencia/h2/principal.txt` | TODO |
| H2.S2.M2 | `specialty-badge`: el tono deja de depender de `principal`; el input queda documentado como sin efecto (o se retira si M1 lo permite) | Todas las insignias con el mismo tono | spec de la insignia | TODO |
| H2.S2.M3 | `specialty-badge-grid`: sin ordenar por principal; el comentario «La principal va primera» se reemplaza con la fecha y el motivo (D-01) | El orden es el de entrada | spec de la rejilla | TODO |
| H2.S2.M4 | Editor: retirar `marcarComoPrincipal`, `marcandoPrincipal`, el gesto de la columna «Tipo», el orden «la principal primero» y el `caption`; decidir si «Tipo» queda como dato (certificada) o se quita | Sin gesto; columnas coherentes | `git grep -c 'principal' -- src/app/features/account/my-profile/practitioner-profile-edit/` → 0 (o sólo comentarios de historia) | TODO |
| H2.S2.M5 | Alta: retirar el select «Especialidad principal (opcional)» de `register-practitioner.ts:1967` y ajustar `CAMPO_DEL_ALTA_EN_PESTANA`/`CAMPOS_DEL_ALTA_SIN_PESTANA` con el motivo | El alta no pregunta; el spec de pestañas en verde | `npx ng test --include=src/app/features/account/my-profile/pestanas-del-perfil-medico.spec.ts --watch=false` | TODO |
| H2.S2.M6 | Tipos del front: `PractitionerListSpecialty.isPrimary` y `PractitionerSpecialty.isPrimary` quedan sin uso — **no se borran del wire**; comentario con la deuda (Q-1) | Nada lee `isPrimary` para pintar u ordenar | `git grep -n 'isPrimary' -- src/app ':!*.spec.ts'` sólo en tipos/simulador | TODO |
| H2.S2.M7 | Simulador: `PrincipalElegida` y el `PATCH …/primary` quedan; se anota en el reporte que ya no tienen consumidor | Anotado | nota en `REPORTE.md` | TODO |
| H2.S2.M8 | Capturas: ficha, editor, `/directory` (una especialidad), perfil público — todas las insignias iguales | 4 capturas miradas | `evidencia/h2/capturas/` | TODO |

#### H2.S3 — D-03: «Contacto» sin datos del trabajo

**CA:** Dada la pestaña Contacto, cuando se la mira o se la edita, entonces no hay correo, celular ni
fijo del trabajo; el correo de acceso se lee en Datos personales en sólo lectura; y el spec de pestañas
sigue verde porque los tres campos están declarados sin pestaña con su motivo.
**DoD:** specs en verde; capturas.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H2.S3.M1 | Ejercitar qué muestra Contacto hoy con `medica@` (qué datos tiene sembrados) | Captura anotada | `evidencia/h2/` | TODO |
| H2.S3.M2 | Ficha: quitar las tres filas (`practitioner-profile-view.html:266, 299, 310`) | No se dibujan | `git grep -c 'del trabajo' -- …/practitioner-profile-view.html` → 0 | TODO |
| H2.S3.M3 | Editor: quitar «Celular del trabajo» y «Fijo del trabajo» (L286-310) y la sección «Tu correo de trabajo» (L311-322) | No se dibujan | `git grep -c 'trabajo' -- …/practitioner-profile-edit.html` sólo en comentarios de historia | TODO |
| H2.S3.M4 | «Correo de acceso» en Datos personales (ficha y editor), sólo lectura, con la misma nota «se cambia por su propio trámite» | Se lee en las dos pantallas | captura ×2 | TODO |
| H2.S3.M5 | `CAMPOS_DEL_ALTA_SIN_PESTANA` gana `workMobilePhone`, `workLandline` y `email` con el motivo (D-03, fecha) y se quitan de `CAMPO_DEL_ALTA_EN_PESTANA` | El spec de pestañas pasa **sin** tocarlo | `npx ng test --include=…/pestanas-del-perfil-medico.spec.ts --watch=false` | TODO |
| H2.S3.M6 | El `PATCH /profiles/practitioners/me` sigue mandando sólo lo que se edita: verificar que no viaja `workMobilePhone` vacío que borre el dato | Observado en la Red | captura de la petición | TODO |
| H2.S3.M7 | Specs de la vista y del editor en verde | Verde | comando de spec | TODO |
| H2.S3.M8 | Capturas ×3 viewports ×2 temas de Contacto y Datos personales | 12 capturas miradas | `evidencia/h2/capturas/` | TODO |

### H3 — Trayectoria: tabla, modal, adjunto y lugares donde trabajé (D-04, D-08, D-09)

**Prioridad:** `ALTA`

**CA:** Dado el editor → Trayectoria, cuando se agrega o corrige un título, entonces se hace en un modal
con el diploma adjuntable (también al corregir), «Guardar» se habilita por cambios y pide confirmación, la
institución del catálogo se ve con su código, y «Lugares donde trabajé» está en la misma pestaña como tabla.
**DoD:** ejercitado con captura; specs en verde; el simulador persiste el `fileId` al corregir.
**Estado:** TODO

#### H3.S1 — El alta pasa a un modal (D-04)

**CA:** Dada la pestaña, cuando se pulsa «Agregar título» (a la derecha de la barra), entonces se abre un
`app-content-dialog` con los campos de hoy, y el formulario en línea ya no existe.
**DoD:** spec; captura; el archivo viaja como hoy.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H3.S1.M1 | Mover «Agregar formación» (L390-492) a un `app-content-dialog size="md"` abierto por un botón «Agregar título» (ícono + texto) a la derecha de la barra (proyección de Pablo; si no llegó, botón alineado con tu CSS y declarado) | El formulario no se dibuja en línea | captura | TODO |
| H3.S1.M2 | El diploma sigue viajando en el alta (`fileId`); verificar en el simulador «agregar → recargar → sigue ahí con archivo» | Observado | captura + `profiles.handlers.ts` sin cambios para el alta | TODO |
| H3.S1.M3 | Institución con su código del catálogo visible en el select y en la tabla (Q-8); «¿Cuál?» sigue para fuera de catálogo | Se lee el código | captura | TODO |
| H3.S1.M4 | Confirmación al agregar («¿Confirmás estos datos?») con la pieza de Marcelo o `dialogs.confirm` declarado | Aparece | captura | TODO |
| H3.S1.M5 | Spec del alta en modal | Verde | `npx ng test --include=…/practitioner-profile-edit.spec.ts --watch=false` | TODO |

#### H3.S2 — Corregir con adjunto, guardar por cambios y confirmación (D-08)

**CA:** Dado «Editar» sobre un título pendiente, cuando se abre, entonces los campos vienen llenos, hay
`app-file-input` para reemplazar el diploma, «Guardar» está deshabilitado hasta cambiar algo, al guardar
pregunta «¿Confirmás estos cambios?», y cancelar con cambios pregunta si se descartan.
**DoD:** los cinco comportamientos observados; spec; `PATCH` simulado acepta `fileId`.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H3.S2.M1 | `app-file-input` en el `@case ('formacion')` del modal (L978-1017), con el archivo actual indicado y «Reemplazar» | Se puede elegir uno nuevo | captura | TODO |
| H3.S2.M2 | `OwnCredentialChanges` gana `fileId` y el `PATCH` del simulador lo persiste (`profiles.handlers.ts`, `corregirDelPerfil`) — **doble declarado**: la API real no tiene este `PATCH` (HALL-E3) | Corregir → recargar → «Descargar» baja el nuevo | captura + nota | TODO |
| H3.S2.M3 | «Guardar cambios» habilitado sólo si el borrador difiere del original (`computed`, sin `effect`) | Abrir y guardar sin tocar → deshabilitado | spec + captura | TODO |
| H3.S2.M4 | Confirmación al guardar con la pieza de Marcelo (`confirmarCambios`); si no llegó, `dialogs.confirm` con el texto del ADR y declarás el doble | Aparece; «Cancelar» vuelve con el foco en Guardar | captura ×2 | TODO |
| H3.S2.M5 | Cancelar o `Escape` con cambios → `dismissAttempt` → pregunta de descarte; sin cambios cierra directo | Dos caminos observados | captura ×2 | TODO |
| H3.S2.M6 | Verificar que «Retirar» confirma (H1.S2.M3); si no, agregarlo con `dialogs.confirm` | Observado | captura | TODO |
| H3.S2.M7 | Spec: campos llenos, adjunto, dirty, confirmación, descarte | Verde | comando de spec | TODO |

#### H3.S3 — «Lugares donde trabajé» en la misma pestaña

**CA:** Dada la pestaña Trayectoria del editor, cuando se abre, entonces debajo de los títulos está el
historial laboral como tabla con la disciplina (lo publica Pablo), y si no llegó, la línea de tiempo
existente montada y declarada.
**DoD:** montado; spec de pestañas sin cambios; captura.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H3.S3.M1 | Montar `<app-work-history secciones="historial" layout="tabla">` (nombre exacto: el que Pablo publique) en la pestaña Trayectoria del editor, con `@if (pestana() === …)` como las otras | Se ve | captura | TODO |
| H3.S3.M2 | Si el layout de tabla no llegó: montar la línea de tiempo existente, y registrar en el reporte que la tabla llega de Pablo | Declarado | nota en `PLAN.md` y `REPORTE.md` | TODO |
| H3.S3.M3 | `CAMPO_DEL_ALTA_EN_PESTANA` sin cambios para `professionalTitle*` (siguen en Trayectoria) | Spec verde | comando de spec | TODO |
| H3.S3.M4 | Captura ×2 viewports | Miradas | `evidencia/h3/capturas/` | TODO |

### H4 — Credenciales, y la barra + paginación de las tres tablas (D-08, D-10)

**Prioridad:** `ALTA`

**CA:** Dado el editor → Credenciales, cuando se agrega o corrige una especialidad o una matrícula,
entonces sigue la misma disciplina que los títulos (modal, adjunto donde el contrato lo permite, guardar
por cambios, dos confirmaciones); y las tres tablas del editor tienen buscador multicampo, filtro por
estado, «Añadir» a la derecha, scroll vertical sin lateral y paginación con selects abajo a la derecha.
**DoD:** ejercitado con captura; specs en verde; Q-9 registrada con la salida elegida.
**Estado:** TODO

#### H4.S1 — Especialidades

**CA:** Dada la tabla de especialidades, cuando se agrega o corrige, entonces es en modal con
confirmación, y el respaldo se ofrece por el camino que el contrato admite.
**DoD:** spec; capturas; decisión Q-9 escrita.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H4.S1.M1 | Alta en modal: «Agregar especialidad» (ícono + texto) a la derecha; el formulario en línea (L521-624) desaparece, las casillas sumables se conservan dentro del modal | Sin formulario en línea | captura | TODO |
| H4.S1.M2 | Respaldo: decidir y escribir Q-9 — (a) vincular a un título cargado (`supportingCredentialId`, que el contrato tiene) o (b) `fileId` sólo en el simulador como doble declarado; implementar la elegida | Decisión escrita con motivo | `PLAN.md` + nota en `REPORTE.md` | TODO |
| H4.S1.M3 | Editar: campos llenos, guardar por cambios, confirmación, descarte con cambios | Observado | capturas | TODO |
| H4.S1.M4 | Retirar con confirmación verificada | Observado | captura | TODO |
| H4.S1.M5 | Spec | Verde | comando de spec | TODO |
| H4.S1.M6 | Capturas ×2 viewports | Miradas | `evidencia/h4/capturas/` | TODO |

#### H4.S2 — Matrículas

**CA:** Dada la tabla de matrículas, cuando se agrega o corrige, entonces es en modal con el respaldo
adjuntable (también al corregir), guardar por cambios y confirmación.
**DoD:** spec; capturas; el simulador persiste el `fileId` al corregir.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H4.S2.M1 | Alta en modal: «Agregar matrícula» a la derecha; el formulario en línea (L640-718) desaparece | Sin formulario en línea | captura | TODO |
| H4.S2.M2 | Editar con `app-file-input` (reemplazar el carnet) y `PATCH` simulado que persiste `fileId` — doble declarado | Corregir → recargar → «Descargar» baja el nuevo | captura + nota | TODO |
| H4.S2.M3 | Guardar por cambios, confirmación, descarte, retirar con confirmación | Observado | capturas | TODO |
| H4.S2.M4 | Spec | Verde | comando de spec | TODO |
| H4.S2.M5 | Capturas ×2 viewports | Miradas | `evidencia/h4/capturas/` | TODO |

#### H4.S3 — Barra, paginación y scroll en las tres tablas

**CA:** Dada cualquiera de las tres tablas, cuando tiene filas, entonces arriba hay buscador multicampo
(normalizado) y filtro por estado (pendiente/verificado), «Añadir» a la derecha, la tabla no desplaza a lo
ancho y desplaza a lo alto con alto máximo, y abajo a la derecha hay Anterior/Siguiente con texto, número,
y selects de página y de tamaño.
**DoD:** specs; capturas ×3 viewports ×2 temas; sin scroll lateral medido.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H4.S3.M1 | `app-filter-bar` sobre cada tabla: buscador por tipo + número + institución (títulos), especialidad (especialidades), número + autoridad (matrículas), normalizando acentos y mayúsculas; filtro «Estado» | Buscar «umsa» encuentra «UMSA» | spec + captura | TODO |
| H4.S3.M2 | Botón «Añadir» proyectado a la derecha (H3.S3 de Pablo); sin la proyección, alineado con tu CSS y declarado | A la derecha en 1440, debajo en 375 | captura ×2 | TODO |
| H4.S3.M3 | Paginación en cliente con `app-pagination` (10 por página), abajo a la derecha; si el select de página de Pablo no llegó, el paginador tal como está y declarado | Con 12 títulos se ven 2 páginas | captura | TODO |
| H4.S3.M4 | Alto máximo con scroll vertical, sin lateral (opción de `data-table` de Pablo; si no llegó, envoltorio con `overflow-y` y declarado) | A 375/1440 `scrollWidth` ≤ `clientWidth` | medición pegada | TODO |
| H4.S3.M5 | Specs de las tres | Verde | comando de spec | TODO |
| H4.S3.M6 | Capturas ×3 viewports ×2 temas de las tres tablas, miradas | 18 capturas con su línea | `evidencia/h4/capturas/` | TODO |

### H5 — El mapa vacía la dirección, y el texto sobrante se va (D-06, D-07)

**Prioridad:** `ALTA`

**CA:** Dado cualquier formulario tuyo con mapa, cuando se toca el mapa, entonces el campo de dirección
queda vacío y se anuncia qué hacer; y «Listo, guardamos…» no se ve, pero el lector de pantalla sigue
recibiendo la confirmación.
**DoD:** spec del selector (3 niveles); capturas en el editor médico, el editor paciente y dos altas;
specs/E2E de los `data-testid` actualizados.
**Estado:** TODO

#### H5.S1 — El selector emite al tocar el mapa

**CA:** Dado `app-ubicacion-picker`, cuando se fija un punto tocando el mapa, entonces emite un evento
que el padre puede escuchar; usar la ubicación del navegador o quitar el punto no lo emiten (o sí, y está
decidido y escrito).
**DoD:** spec con los tres niveles; comentario de cabecera actualizado.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H5.S1.M1 | `output` nuevo (nombre coherente con `confirmado`; p. ej. «`puntoElegido`») emitido en `fijarPunto` (`ubicacion-picker.ts:331-345`) | Emite con el punto | spec | TODO |
| H5.S1.M2 | Decidir y escribir si «Usar mi ubicación» y «mover el pin» también emiten (el texto del doctor dice «toca una dirección en el mapa») | Decisión en el comentario | `grep -n 'D-06' ubicacion-picker.ts` | TODO |
| H5.S1.M3 | Spec de tres niveles: correcto (toque emite), límite (toque sobre el pin existente), inválido (sin mapa abierto no emite) | Verde | `npx ng test --include=src/app/features/auth/registro-compartido/ubicacion-picker/*.spec.ts --watch=false` | TODO |

#### H5.S2 — Aplicación en tus formularios

**CA:** Dado cada formulario tuyo con mapa, cuando se toca el mapa, entonces «Dirección» queda vacía y
un texto junto al campo dice «Volvé a escribir la dirección para este punto».
**DoD:** ocho instancias observadas o declaradas; capturas de cuatro.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H5.S2.M1 | Editor médico → Contacto: vaciar `direccion` al evento y anunciar | Observado | captura | TODO |
| H5.S2.M2 | Editor paciente (`patient-profile-edit.html`) | Observado | captura | TODO |
| H5.S2.M3 | `register-patient.html`: las **dos copias en línea** (domicilio y trabajo) vacían su campo en `fijarPunto` equivalente | Observado | captura | TODO |
| H5.S2.M4 | Las otras cuatro altas que montan `app-ubicacion-picker` (`register-practitioner`, `register-organization`, `register-laboratory`, `register-imaging-center`) | Observado o declarado `A MEDIAS` con cuáles faltan | capturas o nota | TODO |
| H5.S2.M5 | Spec de al menos dos padres (editor médico y alta de paciente) | Verde | comando de spec | TODO |

#### H5.S3 — «Listo, guardamos…» (D-07)

**CA:** Dadas las tres apariciones, cuando se confirma la dirección, entonces no se ve el texto, el lector
recibe la confirmación por una región sólo para lectores, y specs y barrido siguen en verde.
**DoD:** `git grep 'Listo, guardamos'` sin plantillas; specs/E2E actualizados.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H5.S3.M1 | Medir quién usa los `data-testid` `ids().confirmada`, `registro-direccion-confirmada`, `registration-work-location-confirmed` | Lista | `git grep -n -E 'direccion-confirmada\|location-confirmed\|confirmada' origin/mockup -- 'src/**/*.spec.ts' 'playwright/**' 'cypress/**'` | TODO |
| H5.S3.M2 | Quitar el texto visible en las tres, conservando `appAnuncio` en un `<p class="solo-lectores">` con la confirmación | Texto no visible; anuncio presente | `git grep -c 'Listo, guardamos' -- src/app` → 0 en `.html` visible | TODO |
| H5.S3.M3 | Actualizar los specs/E2E de M1 sin debilitar lo que comprueban (que la confirmación ocurrió) | Verde | comandos de spec + barrido | TODO |

### H6 — D-05 en tus archivos

**Prioridad:** `MEDIA`

**CA:** Dado cada `iconOnly` de tus diez archivos (37), cuando se lo mira, entonces tiene texto o la
excepción del ADR-0012 §3 escrita al lado con `aria-label` y `appTooltip`.
**DoD:** 37 veredictos aplicados; specs; capturas.
**Estado:** TODO

#### H6.S1 — Veredicto y aplicación

**CA:** Dada la tabla de Pablo (H5) filtrada por tus archivos, cuando se la lee, entonces cada fila está aplicada.
**DoD:** las 5 microtareas en `HECHO`.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H6.S1.M1 | Tus 37: `register-patient` 8, `paginated-form` 7, `date-picker` 7, `back-link` 4, `ubicacion-picker` 3, `register-practitioner` 3, `practitioner-profile-edit` 2, `practitioner-profile-view` 1, `patient-profile-edit` 1, `my-profile` 1 — veredicto por fila | 37 filas | `evidencia/h6/iconos.md` | TODO |
| H6.S1.M2 | Convertir los que no son excepción (texto + ícono) | Cero sin veredicto aplicado | `git grep -n iconOnly -- <tus archivos>` con motivo al lado | TODO |
| H6.S1.M3 | Escribir la excepción al lado de los que sí lo son (cerrar, quitar, siguiente paso) con `aria-label` + `appTooltip` | Cada excepción con motivo y fecha | idem | TODO |
| H6.S1.M4 | `paginated-form` (52 consumidores): **sin cambio de comportamiento**; probar 5 consumidores ajenos si tocaste su plantilla | 5 capturas comparadas | `evidencia/h6/` | TODO |
| H6.S1.M5 | Specs y capturas | Verde; miradas | comandos | TODO |

### H7 — «Mis puntos» como quinta pestaña del paciente (N-03)

**Prioridad:** `MEDIA`

**CA:** Dado `/my-account` con `paciente@alovida.mock`, cuando se abre, entonces hay cinco pestañas y
«Mis puntos» muestra la billetera sin cabecera duplicada; `/my-account/loyalty` sigue llegando (Ender).
**DoD:** spec de pestañas; captura; pedido a Ender anotado en los dos dailies.
**Estado:** TODO

#### H7.S1 — La pestaña

**CA:** Dada la ficha del paciente, cuando se elige «Mis puntos», entonces se ve el saldo, canjear y el
comprobante como hoy, dentro de la tarjeta.
**DoD:** las 5 microtareas en `HECHO`.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H7.S1.M1 | `Loyalty` gana un input (p. ej. `embebido`) que omite `app-page-header` y breadcrumbs; por omisión, como hoy | La ruta propia no cambia | spec | TODO |
| H7.S1.M2 | `PESTANAS_DEL_PERFIL` gana «Mis puntos» (índice 4) y `PESTANA.puntos`; la ficha monta `<app-loyalty embebido />` en la quinta pestaña; el editor **no** la necesita (decidir y anotar si la muestra deshabilitada o no la muestra) | Cinco pestañas en la ficha | captura | TODO |
| H7.S1.M3 | Pedir a Ender por el daily: retirar el renglón «Mis puntos» del menú y redirigir `/my-account/loyalty` → `/my-account?pestana=puntos` (o el mecanismo que tenga `my-profile` para abrir una pestaña por URL) | Pedido anotado en los dos dailies | daily | TODO |
| H7.S1.M4 | Spec de pestañas del paciente y de la ficha | Verde | `npx ng test --include=src/app/features/account/my-profile/my-profile.spec.ts --watch=false` | TODO |
| H7.S1.M5 | Captura ×2 viewports ×2 temas | Miradas | `evidencia/h7/capturas/` | TODO |

### H8 — Regresión, gates y cierre

**Prioridad:** `ALTA`

**CA:** Dado el cierre, cuando alguien que no vio tu turno lee el reporte, entonces sabe qué quedó
demostrado, qué quedó a medias con las cuatro respuestas, qué se cerró contra un doble y qué no se cubrió.
**DoD:** baseline repetido y comparado, barrido con `--workers=1`, capturas miradas, teclado completo,
`REPORTE.md` escrito.
**Estado:** TODO

#### H8.S1 — Regresión

**CA:** Dado tu cambio, cuando corrés los comandos del baseline, entonces ningún rojo es nuevo; y las
pantallas que montan la insignia están comprobadas.
**DoD:** salidas comparadas.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H8.S1.M1 | `lint` y `typecheck` | Sin rojos nuevos | diff contra `evidencia/antes/` | TODO |
| H8.S1.M2 | `test` completo | Sin rojos nuevos | diff contra baseline | TODO |
| H8.S1.M3 | El simulador entero con cada cuenta | Nada lanza ni devuelve 500 | `npx ng test --include=src/app/core/mock/mock-backend.spec.ts --watch=false` | TODO |
| H8.S1.M4 | Barrido de pantallas, serial | Ninguna ruta rompe | `E2E_BASE_URL=http://localhost:4200 npx playwright test playwright/mockup-barrido.spec.ts --workers=1` | TODO |
| H8.S1.M5 | Barrido de clics sobre `/my-account`, `/my-account/edit` y una alta | Sin excepciones ni 5xx | `… playwright/mockup-click-sweep.spec.ts --workers=1` | TODO |

#### H8.S2 — Cierre honesto

**CA:** Dado el reporte, cuando se lee la primera línea, entonces está el avance calculado; y ninguna
palabra es más fuerte que la evidencia.
**DoD:** `REPORTE.md` con sus tres secciones y el avance arriba; peldaño por área; «contra el doble» declarado.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H8.S2.M1 | Capturas finales por viewport y tema, miradas | Con su línea | `evidencia/h8/` | TODO |
| H8.S2.M2 | Teclado completo en los tres modales: abrir, recorrer, adjuntar, guardar, confirmar, volver al disparador | Descripción por paso | `evidencia/h8/teclado.md` | TODO |
| H8.S2.M3 | Declarar qué quedó `VERIFIED` **contra el doble** (todo lo que edita o retira en el simulador) y la brecha para `dev` (HALL-E3, E7) | Lista | sección «Contra el doble» en `REPORTE.md` | TODO |
| H8.S2.M4 | Declarar el peldaño por área (regla 30) | Hay peldaño por área | sección en `REPORTE.md` | TODO |
| H8.S2.M5 | Escribir `REPORTE.md` con el avance primero y enumerar procesos que quedaron corriendo | `head -3` muestra el avance; lista o «ninguno» | `head -3 REPORTE.md` | TODO |

## 5. Ambigüedades registradas

| ID | Ambigüedad | Supuesto con el que trabajás | Quién puede resolverla | Qué bloquea |
|---|---|---|---|---|
| Q-1 | «todas por igual»: ¿sólo la UI, o también el alta y el contrato? | UI y alta sí; contrato `isPrimary` no se toca; deuda anotada | Doctor + Pablo | H2.S2.M5-M7 |
| Q-2 | «Estado de la práctica quitar»: ¿la fila o el dato? | La fila; el dato sigue en el contrato | Doctor | H2.S1.M3 |
| Q-3 | «ni correo de trabajo, ni teléfono ni nada»: ¿lo del trabajo, o toda la pestaña? ¿Dónde queda el correo de acceso? | Lo del trabajo; el correo de acceso en Datos personales, sólo lectura | Doctor | H2.S3.M4 |
| Q-4 | «ponerse en blanco»: ¿vaciar el campo, o «estado limpio»? | Vaciar, con anuncio junto al campo; si era la otra lectura, es una línea | Doctor | H5.S2 |
| Q-8 | «el ID de la institución»: ¿id de catálogo o número del diploma? | La institución del catálogo con su código visible; «Número / título» se conserva | Doctor | H3.S1.M3 |
| Q-9 | Adjunto en especialidades sin `file_id` en el contrato | (a) vincular a un título con archivo (`supportingCredentialId`) o (b) `fileId` sólo en el simulador, declarado — se decide en H4.S1.M2 | Pablo (contrato) + doctor | H4.S1 |
| Q-17 | La ruta `/my-account/loyalty` y el renglón del menú | Se conservan y Ender redirige/retira; vos montás la pestaña | Pablo, Ender | H7.S1.M3 |
| Q-20 | «lugares donde trabajé» en la pestaña del editor | Como tabla (Pablo la publica); la línea de tiempo queda en la ficha | Doctor | H3.S3 |
| Q-I1 | ¿«Guardar cambios» debe habilitarse por cambios aunque el formulario sea inválido? | No: por cambios **y** válido; ambos se muestran (botón deshabilitado + error por campo) | Doctor | H3.S2.M3 |
| Q-I2 | ¿Qué pasa con el archivo viejo al reemplazar el diploma en el simulador? | Se reemplaza el `fileId`; el viejo no se borra del store simulado; anotado | Pablo | H3.S2.M2 |

## 6. Definition of Done del hito

- [ ] Todas sus microtareas en `HECHO`, o en `A MEDIAS`/`BLOQUEADO`/`DESCARTADO` **con las cuatro respuestas**.
- [ ] La salida literal del comando de cada DoD está en `evidencia/`, no parafraseada.
- [ ] `yarn lint`, `yarn typecheck` y `yarn test --watch=false` sin rojos **nuevos** respecto del baseline
      de H1.S1, con el diff pegado.
- [ ] **`pestanas-del-perfil-medico.spec.ts` en verde sin haberlo debilitado**: los campos que salen de
      una pestaña están en `CAMPOS_DEL_ALTA_SIN_PESTANA` con motivo.
- [ ] Los modales cumplen 95.4.2: rol y nombre, foco inicial adentro, atrapado, `Escape`, restauración.
- [ ] «Guardar» se habilita por cambios, pide confirmación, y cancelar con cambios pregunta (D-08).
- [ ] Lo que sólo persiste el simulador está declarado como **verificado contra el doble** (regla 65).
- [ ] Si tocaste `specialty-badge` o `specialty-badge-grid`: ficha, `/directory` y perfil público comprobados.
- [ ] Si tocaste `paginated-form`, `date-picker` o `back-link`: sin cambio de comportamiento, con muestra ajena.
- [ ] Capturas por viewport y tema, **miradas**, con una línea cada una.
- [ ] Peldaño de evidencia declarado por área (regla 30).
- [ ] Sin datos de personas en logs, capturas, plan ni reporte (regla 90.2). Sólo las cuentas sintéticas.
- [ ] El `PLAN.md` está actualizado en el momento, no al final.

## 7. Cómo cerrás el turno

1. **Checkpoint** en cada apertura y cierre de microtarea. Prohibido encadenar más de tres operaciones
   materiales sin uno.
2. **`REPORTE.md`** con el avance en la **primera línea**: `> **AVANCE: <HECHO> / 93 — <%>.**`
3. **Las tres secciones obligatorias existen siempre.** Una vacía se escribe con «ninguna».
4. **Lo que dependa de Pablo o de Marcelo** no cierra como `BLOQUEADO` sin haber simulado los tres niveles
   de su contrato (regla 65): montás lo que existe hoy y declarás contra qué cerraste.
5. **Tu carril del 21/09** (`Refactor-FormulariosYPerfil`) queda `A MEDIAS` declarado en su propio
   reporte, no abandonado: esta noche manda el pedido del cliente.
6. **Enumerá qué quedó corriendo** y cerralo.
7. **Tu daily** es `Itzan-Daily-Noche-2026-09-22.md`, en la carpeta de arriba.

## 8. Revisión adversarial antes de cerrar

1. ¿Debilitaste `pestanas-del-perfil-medico.spec.ts` en vez de declarar los campos sin pestaña?
2. ¿Quedó alguna pantalla que todavía distingue una especialidad como principal (directorio, perfil público, alta)?
3. ¿El correo de acceso desapareció del producto, o sigue visible en sólo lectura?
4. ¿«Guardar» se habilita por validez y no por cambios, y lo llamaste «hecho»?
5. ¿Declaraste como `VERIFIED` una edición que sólo persiste en el simulador, sin decir «contra el doble»?
6. ¿Quitar «Listo, guardamos…» dejó a quien usa lector de pantalla sin confirmación?
7. ¿Vaciar la dirección al tocar el mapa le borra algo a quien tocó el mapa antes de escribir? ¿Está anunciado?
8. ¿Inventaste un campo de archivo para especialidades en el contrato en vez de vincular o simular declarado?
9. ¿Hay un `iconOnly` tuyo sin texto y sin la excepción escrita al lado?
10. ¿Se declara verificado algo que sólo fue inspeccionado estáticamente?
