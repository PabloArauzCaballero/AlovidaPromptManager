# Verificación contra el código real — correcciones del doctor y del paciente, 2026-09-22

> **Para qué existe.** Las 19 observaciones de
> [`CORRECCIONES-DOCTOR-Y-PACIENTE-2026-09-22.md`](../requisitos/CORRECCIONES-DOCTOR-Y-PACIENTE-2026-09-22.md)
> están escritas desde la maqueta desplegada: hablan de pantallas, no de archivos. Este documento las
> cruza contra el código **abriendo los archivos**, para que ningún prompt del reparto mande a alguien
> a buscar algo por su cuenta pudiendo decirle dónde está — y para que «lo que ya se mejoró del front»
> (los repartos del 20 y 21 de septiembre, ya integrados en `mockup`) se cite y no se rehaga.
>
> **Peldaño de evidencia de este documento: `DISCOVERED` (regla 30).** Todo lo de acá es lectura de
> archivos en un corte declarado, con `git show` y `git grep` sobre `origin/mockup`. **No se ejecutó
> nada**: no se corrió build, ni tests, ni se abrió la maqueta en un navegador. Que un símbolo exista
> no prueba que la pantalla se comporte como su comentario promete. Todo lo que sea comportamiento
> sigue siendo de quien recibe el prompt.

## 0. El corte — leer esto antes que nada

| Qué | Valor |
|---|---|
| Repo del frontend | `alovida/mantra-core-health` |
| Rama que corresponde a la maqueta | **`origin/mockup`** |
| Corte leído | **`b655e8449abd662d6b24156fd6e2b06aeb120cc1`** — «Merge pull request #570 from mdavila-2001/pablo/refactor-tabla-canonica», `2026-09-22 18:04:42 -0400` |
| `origin/dev` del frontend (leído para el gap mockup→dev, **no** es el destino) | `723ddb409968add40c947b3d2658a89bc1043b16` — «Merge pull request #572 from mdavila-2001/pablo/rescate-carril-c», `2026-09-22 18:04:30 -0400`. `mockup` tiene **303** commits que `dev` no tiene; `dev` tiene **4** que `mockup` no tiene; base común `c7573a97` (PR #567) |
| Repo del backend | `alovida/mantra-core-health-api`, ref `origin/dev` = **`7a604d4edd7afecb4b82ce041a988fd46b762216`** |
| Comando | `git fetch origin dev mockup && git log -1 --format='%H %ad %s' origin/mockup` (y equivalentes) |

> ### ⚠️ Cuatro trampas del corte, y le van a pasar a todos
>
> 1. **La copia de trabajo local NO es la maqueta.** El working copy de `alovida/mantra-core-health`
>    sigue en `feat/admin-portal-frontend`. Todo número de línea de acá es de `origin/mockup` al corte
>    `b655e844…`. Leelo así: `git show origin/mockup:<ruta> | sed -n '<n>,<m>p'`.
> 2. **`origin/mockup` se movió dos veces hoy** (#573 de Justin a las 17:5x, #570 de Pablo a las 18:04).
>    Si tu `origin/mockup` avanzó, ése es tu corte y lo declarás en tu `PLAN.md` en la primera microtarea.
> 3. **La maqueta no habla con ninguna API.** `src/environments/environment.ts` de `mockup` fija
>    `mockBackend: true` sin leer el entorno del proceso. El DoD de estas correcciones se demuestra contra
>    los manejadores simulados de `src/app/core/mock/`, y un dato nuevo necesita su manejador. Eso **no**
>    exime de respetar el contrato real: el simulado es un doble declarado (regla 65), y si el contrato
>    real no soporta lo que se pide, es un hallazgo que se registra, no una licencia para inventarlo.
> 4. **Varias de estas observaciones vuelven sobre correcciones del 20/09 que ya se integraron**
>    (C-05 «todas las pestañas editables», C-06 «icono + texto», C-09 «insignia de especialidad», C-21
>    «selects»). Lo que ya está se **cita y se reusa**; lo que el doctor pide distinto se hace como
>    desvío declarado, con las dos fechas.

### Cómo se verifica algo en esta rama (comandos reales, del `README` del simulador)

```bash
yarn install && yarn start                    # http://localhost:4200, sin .env, sin proxy, sin base
yarn typecheck                                # tsc app + cypress + playwright
yarn lint
npx ng test --include=<ruta al spec> --watch=false
npx ng test --include=src/app/core/mock/mock-backend.spec.ts --watch=false   # el simulador entero
E2E_BASE_URL=http://localhost:4200 npx playwright test playwright/mockup-barrido.spec.ts --workers=1
E2E_BASE_URL=http://localhost:4200 npx playwright test playwright/mockup-click-sweep.spec.ts --workers=1
```

**Cuentas de la maqueta** (cualquier contraseña no vacía): `medica@alovida.mock`,
`paciente@alovida.mock`, `admin@alovida.mock`, `superadmin@alovida.mock`, `visitador@alovida.mock`.
Son **sintéticas declaradas**: se pueden pegar. Regla 70.3: **un solo worker**; Playwright serial.

---

## 1. Lo que ya se mejoró del front y que estas observaciones tocan

Medido sobre el corte, para no rehacer lo hecho:

| Qué ya existe (del reparto del 20/09 y del 21/09) | Dónde | Le sirve a |
|---|---|---|
| **ADR-0012** «botones con texto y acciones de fila» + molécula `app-row-actions` (hasta dos acciones en la fila con texto; tres o más, un disparador con desplegable) | `docs/adr/ADR-0012-botones-con-texto-y-acciones-de-fila.md` · `src/app/shared/components/molecules/row-actions/` · **2** plantillas lo instancian (`work-history.html:84` y otra) | D-05, D-08 |
| **ADR-0013** «opciones en select» (árbol de tres preguntas) | `docs/adr/ADR-0013-opciones-en-select.md` | D-08 (los selects del paginador) |
| **ADR-0014** «pantallas portadas que se gradúan» y **el contrato completo de `DataTable<Row>`** | `docs/adr/ADR-0014-pantallas-portadas-que-se-graduan.md` · `docs/adr/CONTRATO-data-table.md` | D-08 (Pablo es el autor; el patrón nuevo lo extiende, no lo reescribe) |
| La insignia de especialidad compartida (**C-09**): `app-specialty-badge` (input `principal`) y `app-specialty-badge-grid` («la principal va primera», ordena una copia por `principal`) | `organisms/specialty-badge/specialty-badge.ts:79-89` · `organisms/specialty-badge-grid/specialty-badge-grid.ts:19-54` | D-01 (**es lo que hay que cambiar**, no crear) |
| El editor del perfil con las **siete pestañas de la ficha** (C-05), las tres tablas de lo cargado con acciones de fila con texto, y **un `app-content-dialog` de edición** para título, especialidad y matrícula | `practitioner-profile-edit.html:10-24, 388-513, 519-733, 826-1071` | D-04, D-08, D-09, D-10 (**el modal de editar ya existe**; lo que falta es lo demás de la disciplina) |
| El consultorio dentro del perfil (**C-02**): `app-work-history secciones="consultorios"` en la ficha (L475) y en el editor (L379), con `app-row-actions` (L84) y confirmación al retirar (`work-history.ts:896`) | `features/account/my-profile/work-history/**` | D-08 «Dónde atiendo» |
| El historial laboral se **agrega en un modal** (`app-content-dialog heading="Añadir elemento a tu historial"`) | `work-history.html:408-527` | D-09 «lugares donde trabajé» (precedente del modal) |
| La medición de C-06: **78 apariciones de `iconOnly` en 33 plantillas** (eran 107 en 34 el 20/09) | `git grep -c 'iconOnly' origin/mockup -- 'src/app/**/*.html'` | D-05 (inventario de partida, §3) |
| El chequeo de síntomas por **zonas del cuerpo** con pastillas, texto libre, motor de reconocimiento y recomendación de especialidad **cruzada con las que tienen gente** | `features/symptom-check/**` (`zonas.datos.ts:45-106`, `symptom-check.html:1-300`, `motor.ts`) — montado en `patient-home.html:33` con `@defer (on immediate)` | P-01, P-02 (**la lógica existe; falta el dibujo y la voz**) |
| El mapa de Bolivia por departamentos como organismo accesible (`<path role="button">`, teclado, `aria-pressed`, tres señales para el elegido) | `organisms/department-map/department-map.ts:1-70` · `bolivia-departments.geometry.ts` | P-01 (**el patrón a copiar** para la silueta) |
| Precio y distancia ya vienen juntos en la disponibilidad de farmacias (`AvailabilityProduct.price`, `AvailabilitySite.distanceKm`) y la búsqueda pública de cercanía (`PublicNearbyResult.distanceKm`) | `core/data-access/pharmacy/pharmacy.types.ts:78-135` · `public-directory.types.ts:336-371` | N-02 |
| «¿Dónde comprar?» con pestañas por vertical, **incluida «Centros de imagenología»**, y «Lugares cercanos» con origen elegible | `account/medical-record/where-to-buy/where-to-buy.html:300-308` · `features/nearby-places/**` (`RADIO_KM = 15`, `LIMITE = 20`) | N-02 (**los dos equivalentes existentes**; regla 96.1) |

---

## 2. Localización, observación por observación

### D-01 · Sin especialidad «principal»: todas por igual

- **Dónde se ve hoy la principal:**
  - Ficha, «Datos personales»: `practitioner-profile/practitioner-profile-view/practitioner-profile-view.html:194-201`, `<app-specialty-badge-grid [especialidades]="perfil().especialidades">`; y la misma insignia en «Quién es» (**L817-822**, comentario «C-09: la MISMA insignia que en Datos personales»).
  - La insignia: `organisms/specialty-badge/specialty-badge.ts:81` (`principal = input(false)`), **L89** (`tone--primary` si es principal); la rejilla: `specialty-badge-grid.ts:19-22` («La principal va primera»), **L54** (ordena por `principal`).
  - Editor, «Credenciales»: la columna «Tipo» de la tabla de especialidades **es el gesto para cambiar la principal** — `practitioner-profile-edit.ts:706-720` (comentario: «Deja de ser un rótulo y pasa a ser el lugar donde se cambia cuál es la principal»), `marcarComoPrincipal` en **L1229-1252** (`profiles.setOwnPrimarySpecialty`), `filasEspecialidades` «la principal primero» **L775-776**, y el `caption` «Especialidades cargadas, la principal primero» (`practitioner-profile-edit.html:635`). El modal de edición lo dice explícitamente (**L1010-1013**): «Cuál es la principal NO se toca acá».
  - Alta: `auth/register-practitioner/register-practitioner.ts:1967` — `label: 'Especialidad principal (opcional)'`; y el mapa de pestañas `pestanas-del-perfil-medico.ts` mapea `specialtyPrimary` → credenciales.
  - Directorio y listados: `core/data-access/profiles/profiles.types.ts:980-1011` (`PractitionerListSpecialty.isPrimary`, «Sólo las vigentes, la principal primero»); `alovida/buscar/profesionales-listado/profesionales-listado.ts:45` (maqueta portada: **no se toca**, ADR-0014).
- **Contrato real (no se escribe esta noche):** `mantra-core-health-api/src/modules/profiles/entities/practitioner_specialties.entity.ts:50` (`is_primary`, nullable), `dto/add-specialty.dto.ts:46,77`, `repositories/practitioner-specialties.repository.ts:130,152` (ordena por `isPrimary desc`), controlador `profiles-practitioners.controller.ts:529` (`PATCH practitioners/me/specialties/:specialtyId/primary`). Simulado: `core/mock/handlers/profiles.handlers.ts:45-58` (`PrincipalElegida`).
- **Consecuencia:** es un retiro en **cinco** lugares del front (insignia, rejilla, editor —columna, gesto, orden y caption—, alta, tipos) y **cero** en la API. El `isPrimary` del contrato queda sin uso del lado del cliente: se declara como deuda, no se borra de la API (`Q-1`).

### D-02 · Quitar «Estado de la práctica»

- La fila: `practitioner-profile-view.html:221-224` (`<dt>Estado de la práctica</dt><dd>{{ perfil().estadoDePractica }}</dd>`), dentro de «Datos personales».
- El dato: `core/data-access/profiles/profiles.types.ts:129` (`practiceStatus`), **L416** (`practiceStatusConceptId`); en la API es obligatorio al crear (`dto/create-practitioner.dto.ts:294`) y lo mueve la verificación (`profiles-practitioners.service.ts:1485,1703`: `PRACTICE_ONBOARDING` → `PRACTICE_ACTIVE`). **No se toca el contrato** (`Q-2`); se quita la fila y lo que la calcula sólo si nada más lo usa (medir con `git grep estadoDePractica`).

### D-03 · «Contacto» sin datos del trabajo

- Ficha, pestaña «Contacto» (`practitioner-profile-view.html:257-362`): muestra **Correo de trabajo** (L266), Correo personal (277), Celular personal (288), **Celular del trabajo** (299), **Fijo del trabajo** (310), Municipio de residencia (321), Domicilio (335). El comentario de cabecera (L258-261) explica que el alta pregunta **cinco** contactos.
- Editor, pestaña «Contacto» (`practitioner-profile-edit.html:185-324`): `app-location-picker` (L214), Dirección (L228), `app-ubicacion-picker` del domicilio (L250-261), Celular personal (L269), Correo personal (L280), **Celular del trabajo (opcional)** (L286), **Fijo del trabajo (opcional)** (L298), y la sección de sólo lectura **«Tu correo de trabajo»** (L311-322) con el motivo: «Es con el que entrás. Se cambia por su propio trámite».
- **El choque que hay que resolver antes de borrar:** `pestanas-del-perfil-medico.ts` mapea `workMobilePhone`, `workLandline` y `email` → `PESTANA_MEDICO.contacto` (bloque «5 · El contacto de tu trabajo»), y `pestanas-del-perfil-medico.spec.ts` **falla si un campo del alta queda sin pestaña** (HALL-D10 del 20/09). El propio archivo ya tiene el mecanismo para esto: `CAMPOS_DEL_ALTA_SIN_PESTANA` («para que el spec pueda distinguir "se olvidaron de mapearlo" de "se decidió no mostrarlo"»). Los tres campos van ahí con su motivo (`Q-3`). El correo de acceso se muestra en «Datos personales» (supuesto de `Q-3`), y `profiles.types.ts:375` lo documenta como «Correo de trabajo, el mismo con el que se entra».

### D-04 · Todo formulario que nace de una acción de tabla abre en modal

- **Lo que ya cumple:** el modal de **editar** de las tres tablas del editor (`practitioner-profile-edit.html:961-1071`, un solo `app-content-dialog` para los tres recursos, montado con `@if (edicion())`); el modal de **agregar** del historial laboral (`work-history.html:408-527`).
- **Lo que no cumple —los formularios que aparecen «abajo» o «arriba» en línea—:**
  - «Agregar formación» en línea sobre la tabla (`practitioner-profile-edit.html:390-492`), «Agregar especialidades» (L521-624) y «Agregar una matrícula» (L640-718): los tres son `<form class="edicion__formulario">` dentro de la pestaña, con la tabla debajo.
  - «Nuevo consultorio / Corregir tu consultorio» en «Dónde atiendo»: `work-history.html:172-292` es un `<form>` en línea que se abre con `altaDeSedeAbierta()` **debajo de la lista** (L105-135 son las dos puertas: «Agregar mi consultorio propio» y el padrón). Es exactamente «aparece abajo» — el mismo defecto que C-10 corrigió en la agenda el 20/09 (`app-tarjeta-del-dia` → modal).
- **Precedente de la casa para convertirlo:** C-10 del reparto del 20/09 (Pablo) llevó la tarjeta del día a un modal con `content-dialog`. El organismo: `organisms/content-dialog/content-dialog.ts:84-123` (`heading` requerido, `size` `sm|md|lg`, `dismissible`, `dismissAttempt`, restauración del foco en L257). **Reusar, no crear** (regla 95.1).

### D-05 · Cada botón de acción con ícono + nombre

- **Medición al corte:** `git grep -o 'iconOnly' origin/mockup -- 'src/app/**/*.html' | wc -l` → **78** apariciones en **33** archivos (el 20/09 eran 107 en 34). Por archivo, los más cargados: `auth/register-patient/register-patient.html` **8** · `organisms/paginated-form/paginated-form.html` **7** · `organisms/date-picker/date-picker.html` **7** · `design-system-sample.html` 5 · `atoms/back-link/back-link.html` 4 · `form-builder/field-editor/field-editor.html` 4 · `registro-compartido/ubicacion-picker/ubicacion-picker.html` 3 · `register-practitioner.html` 3 · `organisms/header/header.html` 2 · `molecules/pagination/pagination.html` 2 · `molecules/file-preview/file-preview.html` 2 · y 22 archivos con 1 o 2. La lista completa está en la §3 de este documento.
- **La regla ya existe:** ADR-0012 (§1 «Todo botón lleva icono y texto», §3 la única excepción —significado universal— exige `aria-label` **y** `appTooltip`, con la justificación en una línea al lado). Lo que el doctor pide hoy es lo mismo que C-06; la diferencia es que **quedan 78** y que ninguno tiene escrito al lado si es excepción o pendiente.
- **Dónde el pedido nuevo cambia una excepción:** el paginador (`pagination.html:2-9` y `38-46`, «Página anterior»/«Página siguiente» sólo-ícono): D-08 pide «anterior, siguiente y número» — o sea, **con texto**. Deja de ser excepción.
- **El set de íconos es cerrado:** `atoms/nav-icon/nav-icon.types.ts:35-75` (`NAV_ICON_NAMES`: `home, patients, calendar, orders, results, billing, settings, people, chat, directory, stethoscope, hospital, flask, scan, scalpel, pill, heart, folder, note, clipboard, survey, book, labels, building, factory, package, bag, tag, megaphone, pin, route…`). El daily del 20/09 ya avisó: **no tiene** ver, imprimir, descargar, duplicar ni `qr`. Un botón «Descargar» con texto y sin glifo cumple ADR-0012; agregar un ícono al set es del dueño del set (Ender), no «de paso».

### D-06 · Tocar el mapa vacía el campo de dirección

- **El selector compartido:** `features/auth/registro-compartido/ubicacion-picker/ubicacion-picker.{html,ts}`. Un toque sobre el mapa entra por `(pointPicked)="fijarPunto($event)"` (`ubicacion-picker.html:18` → `ubicacion-picker.ts:331-345`). **El campo de texto de la dirección NO vive adentro del selector**: vive en el formulario que lo monta. El selector hoy **no emite nada** cuando se toca el mapa (sus salidas son `confirmado` y el quitar); por eso la regla no puede vivir sólo en el padre: hace falta un `output` nuevo («`puntoElegido`» o equivalente) que cada padre escuche.
- **Las instancias** (`git grep -l '<app-ubicacion-picker\|<app-map' origin/mockup -- 'src/app/**/*.html'`): 9 plantillas.
  - Con el selector compartido: `practitioner-profile-edit.html:250-261` (campo «Dirección» en **L228-236**, señal `direccion`), `patient-profile-edit.html`, `register-practitioner.html`, `register-organization.html`, `register-laboratory.html`, `register-imaging-center.html`.
  - **Con una copia en línea del selector** (no usa `app-ubicacion-picker`): `auth/register-patient/register-patient.html` — dos bloques, domicilio (~L300-350) y trabajo (~L580-612), con `direccionConfirmada()` / `direccionTrabajoConfirmada()`.
  - Con `app-map` directo: `work-history.html:255-263` (`(pointPicked)="marcarPunto($event)"`, y el campo «Dirección» de la sede en **L196-202**, señal `direccionDeSede`); `practice-sites-map.html` y `public-profile-card.html`, `pharmacy-detail.html` (**sólo lectura**: no hay campo que vaciar).
- El organismo del mapa: `organisms/map/map.ts` (`pointPicked`, `seleccionable`, `pines`, `centro`). No hace falta tocarlo: ya emite el punto.
- **Ambigüedad `Q-4`** sobre qué significa «ponerse en blanco»; la lectura tomada es **vaciar**, y el motivo está en el propio código: `ubicacion-picker.ts:74` («El punto del mapa se guarda tal cual, pero no podemos convertirlo en el nombre de la calle: escribila vos arriba»).

### D-07 · Quitar «Listo, guardamos esta dirección…»

- Tres apariciones (`git grep -n 'Listo, guardamos' origin/mockup -- 'src/app/**/*.html'`):
  - `registro-compartido/ubicacion-picker/ubicacion-picker.html:56` — `<p appAnuncio class="registro__ubicacion-estado">Listo, guardamos esta dirección.</p>` (con `data-testid` `ids().confirmada`).
  - `auth/register-patient/register-patient.html:342` — «Listo, guardamos esta dirección.» (`data-testid="registro-direccion-confirmada"`).
  - `auth/register-patient/register-patient.html:605` — «Listo, guardamos este punto.» (`data-testid="registration-work-location-confirmed"`).
- **Cuidado con lo que cuelga de ese párrafo:** lleva `appAnuncio` (se anuncia a lectores de pantalla) y `data-testid` que usan specs y el barrido E2E. Quitar el texto visible **no** puede dejar a quien no ve la pantalla sin confirmación: el anuncio se conserva en una región sólo para lectores (`solo-lectores`) o se reemplaza por el estado del pin. Y los `data-testid` se buscan antes de borrarlos (`git grep 'registro-direccion-confirmada\|registration-work-location-confirmed'`).
- Los avisos que están debajo (`avisoSinGeocodificacion`, `avisoMoverPin`, L57-63) **no son el texto que el doctor cita**; se conservan salvo que el doctor diga lo contrario.

### D-08 · La disciplina de tabla con acciones

Punto por punto del pedido, contra lo que hay:

| Pieza del pedido | Estado al corte | Dónde |
|---|---|---|
| Editar una fila abre un modal con los campos llenos | **Existe** para título, especialidad y matrícula del editor | `practitioner-profile-edit.html:961-1071`; `editarFormacion/Especialidad/Matricula` |
| «al modificarlo se activa el botón de confirmar» | **Parcial**: el botón se habilita por validez (`puedeGuardarEdicion`, `practitioner-profile-edit.ts:1505`), no por «hubo cambios». Hay que ejercitar: abrir y guardar sin tocar nada, ¿está habilitado? | `practitioner-profile-edit.ts:1505-1520` |
| Confirmar → segundo modal «¿estás seguro?» | **No existe** al guardar. Sí existe la molécula para hacerlo: `DialogService.confirm({ title, message, confirmLabel, cancelLabel })` (`molecules/dialog/dialog-service.ts`), usada en **26** archivos | `git grep -c 'dialogs.confirm(' origin/mockup -- 'src/app/**/*.ts'` |
| Eliminar → modal de confirmación | **Existe** en el consultorio (`work-history.ts:896-903`, «Dejar de atender acá») y hay un `dialogs.confirm` en `retirarFila` del editor (`practitioner-profile-edit.ts:1581`). Se verifica ejercitando los tres «Retirar» | `practitioner-profile-edit.ts:1581-1630` |
| Buscador multicampo + filtros arriba | **No existe** en las tablas del perfil. El organismo de la casa: `organisms/filter-bar/` (`app-search-field` con debounce 300 ms + `selectFilters` de value set + chips; **8** consumidores). Sin proyección para un botón a la derecha | `filter-bar.html:1-35`, `search-field.types.ts:14` |
| Botón «Añadir» a la derecha, al final de la barra | **No existe** como pieza. Hoy los «Agregar» son formularios en línea (ver D-04) | — |
| Scroll vertical, **no** horizontal | **Choca**: `data-table.css:22-23` (`overflow-x: auto`), sombras ligadas al scroll lateral (L38-108) y `sticky: 'end'` para acciones «propietario, 18/09/2026» (`data-table.types.ts:24-27`). El plegado a detalle por prioridad en móvil sí existe (`MOBILE_DETAIL_PRIORITY = 2`, `data-table.types.ts:55`) | `Q-6` |
| Paginación abajo a la derecha: anterior, siguiente, número; filas por página y página actual **como select** | **Choca en el organismo, existe en la molécula**: `DataTable` pagina **por cursor** (sin total ni números, `data-table.types.ts:1-7,45-53`, `CONTRATO-data-table.md` §10.2, decisión documentada) y su `<nav>` sólo aparece si hay cursor. `app-pagination` (`molecules/pagination/`, **3** consumidores) sí tiene `totalItems`, `pageSize` con `app-select` de tamaños (`pagination.html:53-60`, `DEFAULT_PAGE_SIZE_OPTIONS = [10,20,50,100]`) y botones numerados con huecos (`MAX_PAGE_SLOTS = 7`), pero **no** un select de página ni texto en anterior/siguiente | `Q-5`; `pagination.types.ts:1-25` |
| Aplicarlo en «Configurar tu perfil» y en «Dónde atiendo» | Las tablas de «Configurar tu perfil» son tres (`tabla-formacion` L502, `tabla-especialidades` L628, `tabla-matriculas` L722), todas `app-data-table` con `state` `ready(filas)` de una lista local (`practitioner-profile-edit.ts:811-813`). «Dónde atiendo» hoy **no es una tabla**: es una `<ul class="historial__lista">` (`work-history.html:33-88`) | — |

**Lo que se deduce y hay que decidir (Pablo):** las tablas del perfil son listas **locales** (todo en memoria); la paginación que pide el doctor se resuelve **en cliente** con `app-pagination` sin tocar el contrato por cursor de `DataTable`. Eso exige que `DataTable` acepte convivir con un paginador externo (o proyectarlo), y que `app-pagination` gane el select de página y el texto en «Anterior»/«Siguiente». El scroll vertical exige un alto máximo por consumidor y renunciar al desborde lateral (`Q-6`).

### D-09 · Trayectoria como tabla con tipo, institución y emisión; adjunto siempre; «lugares donde trabajé»

- **La tabla ya existe con esas columnas:** `columnasFormacion` (`practitioner-profile-edit.ts:688-703`): `tipo`, `numero` («Número / título»), `institucion`, `emision`, `estado`, `acciones`. El formulario de alta (`practitioner-profile-edit.html:396-492`) pide: **Tipo de título** (`app-concept-select`, catálogo `CREDENTIAL_TYPE_*`), Número / título obtenido, **Institución** (`app-select` sobre `opcionesInstitucion`, «lista cerrada… propietario 13/09/2026», con «¿Cuál?» para fuera de catálogo, L426-453), **Fecha de emisión** (L455-460), y **Diploma o certificado** (`app-file-input`, «PDF, JPG o PNG. Hasta 5 MB», L462-482).
- **Lo que falta respecto del pedido:** (1) el modal de **editar** no ofrece el archivo (`practitioner-profile-edit.html:978-1017`: tipo, número, institución, «¿Cuál?», emisión — **sin `app-file-input`**); (2) el «ID de la institución» (`Q-8`): hoy la institución viaja como `issuingInstitutionText` (texto; `mock/handlers/profiles.handlers.ts:26`, `own-credential.dto.ts:54`), no como id de catálogo — la lista de `opcionesInstitucion` sale de `fixtures/instituciones*.ts`; (3) toda la disciplina de D-08 (modal de agregar, confirmaciones, buscador, paginación).
- **«Lugares donde trabajé» en la misma pestaña:** en el editor, la pestaña Trayectoria (`practitioner-profile-edit.html:383-513`) **sólo tiene formación**. El historial laboral vive en `app-work-history secciones="historial"` (montado en la **ficha**, `practitioner-profile-view.html:632`): línea de tiempo (`work-history.html:313-383`) + modal de agregar (`L408-527`) con Institución (del catálogo o escrita), Cargo, Consultorio de la plataforma, Desde, Hasta — **sin archivo** y **sin editar ni retirar**. Para el editor hace falta montar `app-work-history secciones="historial"` con una **vista de tabla** (`layout` hoy admite `flat` y `timeline`, `work-history.ts:195`) o una tabla propia; se decide en el prompt (`Q-20`).
- **Archivo «siempre»:** el contrato real acepta `fileId` en el título (`AddOwnCredentialDto.fileId`, `own-credential.dto.ts:70-75`) y en la matrícula (`jurisdiction_authorizations.entity.ts:74`); la respuesta lo devuelve (`OwnCredentialResponseDto.fileId`, L100). Formatos: `formatosDeRespaldo` y `maxBytesDeRespaldo` del editor (PDF/JPG/PNG, 5 MB). **El historial laboral y las especialidades no tienen `fileId`** en el contrato: ver D-10.

### D-10 · Credenciales igual que lo anterior

- La pestaña «Credenciales» del editor (`practitioner-profile-edit.html:514-733`) tiene dos tablas: especialidades (`columnasEspecialidades`, `practitioner-profile-edit.ts:714-728`: especialidad, **rol/Tipo**, desde, estado, acciones) y matrículas (`columnasMatriculas`, L740-753: número, autoridad, inscripción, estado, acciones). La matrícula **ya lleva archivo al agregar** (`app-file-input`, L699-711, «Respaldo de matrícula»); la especialidad **no**.
- **Contrato:** `practitioner_specialties.entity.ts` no tiene `file_id`; **sí tiene `supporting_credential_id`** (L31: «FK → credencial que respalda») — la manera de «adjuntar» respaldo a una especialidad sin inventar una columna es **vincularla a un título cargado** (que sí tiene archivo). Se registra como propuesta (`Q-9`); en la maqueta, el simulador puede aceptar un `fileId` por especialidad como **doble declarado**.
- **El hallazgo de contrato más importante de D-08/D-09/D-10, y ya está escrito en el propio cliente:** `core/data-access/profiles/profiles.client.ts:775-786`: «**De los cinco, sólo `removeOwnCredential` existe hoy en la API.** Los otros cuatro los atiende el simulador de la rama `mockup`… El hueco queda anotado en `docs/progress/BLOCKERS.md`». Verificado en la API: `profiles-practitioners.controller.ts` expone `POST practitioners/me/credentials` (L449), `DELETE practitioners/me/credentials/:credentialId` (L471), `PATCH practitioners/me` (L228), `PATCH practitioners/me/specialties/:specialtyId/primary` (L529) y afiliaciones (L343-427). **No hay `PATCH` de credenciales, ni `PATCH`/`DELETE` de especialidades o matrículas, ni endpoints de historial laboral bajo `me`.** Todo lo que el modal de edición guarda, lo guarda el simulador (`profiles.handlers.ts:64-101`, `correccionesDelPerfil`, `retiradasDelPerfil`). Eso **no bloquea la maqueta**, pero se declara en cada cierre: peldaño `VERIFIED` contra el doble, y brecha de contrato para `dev`.

### R-01 · Al revisar médicos disponibles, el clic no se inhabilita mientras carga

- **El flujo real del paciente** (rutas en `src/app/app.routes.ts`): `/directory` (portada por especialidad, `practitioners-directory.html:1-50`: tarjetas `<a class="rejilla__tarjeta" [routerLink]="[]" [queryParams]="{ especialidad }">`) → lista de la especialidad con `app-directory-page` (L57) cuyos resultados son enlaces (`molecules/search-result/search-result.html:12,45`: `<a [routerLink]="r.link">` y la acción «Revisar disponibilidad» `[routerLink]="accion.link"`) → `/directory/:profileId` (`practitioner-detail`, `app.routes.ts:615-627`) que monta `<app-practitioner-availability>` (`practitioner-detail.html:21-25`) → botón por cupo (`practitioner-availability.html:71-86`, `(clicked)="reservar(sede, cupo)"`) → `/my-account/appointments/book/:slotId` (`app.routes.ts:886-891`, `booking-new`).
- **Por qué el clic no se inhabilita:** las tarjetas y «Revisar disponibilidad» son **enlaces** (`<a routerLink>`), no `app-button` con `isLoading`. Un enlace no tiene estado de carga: cada clic repetido vuelve a disparar la navegación y, con ella, la carga de la ficha. Los botones de cupo (`practitioner-availability.html:71`) tampoco llevan `[isLoading]` ni `[disabled]` mientras navegan (`reservar` hace `router.navigate`, `practitioner-availability.ts:190-192`).
- **Qué ya hace bien el último paso:** `booking-new.html:101-105` y `157-161` usan `app-form-actions [pending]="enviando()"` — el doble envío está bloqueado en la reserva. El problema está **antes**.
- **Lo que hay para reusar:** el átomo `app-button` tiene `isLoading` (se usa 70+ veces); el armazón ya escucha `Router.events` y anuncia «<pantalla> cargada» (`shell-layout.ts:149-157`) — es el lugar natural para un indicador global de «navegando» que además ignore clics repetidos sobre el mismo destino.

### R-02 · Elegir médico tarda demasiado, «y eso que sólo es mock»

- **La latencia es deliberada y por petición:** `core/mock/mock-backend.interceptor.ts:251-259` — `latencia(path)`: 40 ms para `/terminology`, 600 ms para la subida de documentos, y **`120 + random(0..180)` ms para todo lo demás**, aplicada con `timer()` a cada respuesta (L69, L98). Comentario: «Un poco de espera, para que los estados de carga existan».
- **Cuántas peticiones dispara «elegir médico»:** `practitioner-detail.ts:139-150` → `getPractitionerProfile` y después `forkJoin` con `readConceptLabels` (terminología, 40 ms) y archivos; `practitioner-availability.ts:225-250` → `listSlots` **por sede** de la semana visible, y **si la semana está vacía, otra búsqueda del «próximo hueco»** (L242-250, hasta `SEMANAS_ADELANTE = 2` y el tope de L36). Con N sedes son N–2N peticiones de 120–300 ms **en serie o en paralelo según cómo esté armado el `forkJoin`** — eso es lo que hay que **medir** antes de tocar (`Q-10`): pestaña Red del navegador, contar peticiones y tiempo total.
- **Dos salidas, y no son excluyentes:** bajar/ajustar la latencia por ruta en el interceptor (Ender; sin perder los estados de carga, que existen para verse) y reducir peticiones en la ficha (Justin; p. ej. una lectura de cupos por médico en vez de una por sede, si el manejador `GET /scheduling/slots` lo admite: `scheduling.handlers.ts:160`).

### R-03 · Doctores con horarios definidos en la maqueta

- **Quién tiene agenda hoy:** `core/mock/fixtures/agenda.ts:103-140` crea **un recurso por profesional** sólo para `PROFESIONALES.filter((p) => p.especialidades.length > 0 && p.origen === undefined)` (L106). `PROFESIONALES` (`fixtures/personas.ts:262-267`) = `PROFESIONALES_ESCRITOS` + `profesionalesDeLaRed(...)` + **`profesionalesRegistrados()`** («las 13 personas de `USUARIO_MEDICOS_1.md`», `registered-people.ts`). Los registrados llevan `origen` → **sin recurso → sin plantilla → sin cupos**. Es la explicación más probable de «no tiene turnos disponibles» al elegir un médico: se **verifica** listando, por especialidad, cuántos profesionales del directorio tienen cupos en las próximas dos semanas.
- **Plantillas y cupos:** `agenda.ts:144-206` (la médica con dos plantillas —mañana L-S 08-12 de 30 min y consultorio L-Mi-V 15-19 de 20 min con `gapMinutes: 10`—; el resto **una** plantilla L-V, mañana o tarde alternadas por índice, L194-200); los cupos se generan **±21 días** (L208-241, `generarCupos`). Todo determinista con `uuid(semilla)`.
- **Qué pide el doctor:** que cada médico visible tenga horario **y** que haya casos definidos para recorrer el flujo completo (paciente elige especialidad → médico → cupo → reserva → el médico la ve en «Consultas»). Los estados de reserva ya están sembrados (`agenda.ts:280-310`: `SOLICITADA/CONFIRMADA/…`, pagos). Lo que falta es **cobertura** (todos con agenda) y **documentación** de los escenarios (qué cuenta, qué médico, qué día) en `core/mock/README.md`.

### P-01 · Silueta del cuerpo cliqueable que recomienda especialista

- **Lo que ya hay:** la pantalla de inicio del paciente monta `<app-symptom-check />` (`patient-home.html:20-36`, `@defer (on immediate)`); el chequeo tiene **10 zonas** en `zonas.datos.ts:45-106` (`cabeza`, `ojos`, `orl`, `pecho`, `panza`, `huesos`, `piel`, `animo`, `intima`, `general`), cada una con su `icono` (dibujado por un `@switch` de SVGs en `symptom-check.html:20-165`) y sus `sintomas`; tocar una zona abre sus síntomas como chips (`symptom-check.html:172-186`), y las recomendaciones salen del motor (`symptom-check.ts:210-216`, `recomendar(...)` cruzado con `especialidadesDisponibles()`) con «Ver quién atiende» hacia `/directory` (`rutaDeResultados`, L140).
- **El patrón a copiar para el dibujo:** `organisms/department-map/` — un SVG con un `<path role="button" tabindex aria-label aria-pressed>` por región, recorrido por teclado, elegido con tres señales (relleno, trazo, texto), geometría en un archivo aparte (`bolivia-departments.geometry.ts`, `BOLIVIA_VIEW_BOX`, `SILUETAS_DE_BOLIVIA`). Es lo que el doctor llama «como el mapa de bolivia».
- **Lo que no hay:** ninguna silueta humana ni geometría de zonas corporales en `shared/` ni en `features/`. `fixtures/anatomia-atlas.ts` es un **índice de láminas para el glosario** (548 láminas, 8 regiones como etiquetas), no una figura cliqueable — no sirve de geometría, aunque sus 8 regiones pueden orientar el mapeo zona ↔ región.
- **Restricción de datos (regla 97.5.4):** el organismo dibuja y elige; **no decide medicina**. La relación zona → síntomas → especialidad sigue saliendo de `sintomas.datos.ts`, «la tabla que revisa el equipo médico» (`motor.ts:37-40`). No se agrega ningún síntoma ni especialidad por dibujar la silueta.

### P-02 · Panel de texto libre, tipeado o por voz

- **El área de texto ya existe, pero plegada:** `symptom-check.html:191-203` — `<details class="sintomas__escribir" [open]="sintomas().length === 0"><summary>O escribilo con tus palabras</summary><app-textarea [rows]="2" [autoResize]="true" [maxRows]="5" …>`. El doctor pide **un panel** (TEXT AREA): visible por defecto, no detrás de un `<summary>`.
- **Voz:** no hay reconocimiento de voz en el repo (`git grep -i 'SpeechRecognition\|dictado'` → sólo comentarios ajenos). Lo más cercano es `messaging/thread/composer/grabador.ts` (nota de voz con `MediaRecorder`, **graba audio, no transcribe**), cuyo criterio sí se copia: «Sin permiso o sin `MediaRecorder` (Safari viejo, SSR) el botón no aparece» (L23-26). Para dictado la API es `SpeechRecognition`/`webkitSpeechRecognition` (sólo navegador, Chromium; **bajo SSR no existe `window`**: `angular-ssr-hydration`), y lo transcripto se vuelca en el mismo `texto()` que ya lee el motor (`symptom-check.ts:143`).
- **Datos de salud:** lo que la persona dicta o escribe son síntomas → **PHI**. Nada de eso va a logs, consola, analytics ni a un servicio externo de transcripción (regla 90.2.1 y 90.2.4). El reconocimiento del navegador puede mandar audio a un servidor del proveedor del navegador: se **declara** en la pantalla y en el reporte (`Q-12`).

### P-03 · Quitar «el panel de abajo»

- La pantalla, de arriba a abajo (`patient-home.html`): síntomas (L20-36) → estados de carga/vacío/error del resumen (L38-55) → primera vez (L58-67) **o** «Tu próxima cita» (L69-176) + tira de resumen «Tu última receta / Tu última atención» (L182-224) → **grilla de accesos «Ir a lo tuyo»** (`<nav class="mi-salud__accesos">`, L231-258), armada en `patient-home.ts:152-185` (`Mis citas`, `Mi historia`, secciones del menú, `Mis datos`).
- **Supuesto `Q-13`:** «el panel de abajo» es la grilla de accesos (L231-258): es el último bloque y repite lo que el menú lateral ya ofrece. Se confirma con captura antes de borrar. Al retirarla hay que revisar quién la referencia: `data-testid="mi-salud-acceso"` en specs y en el barrido, y el comentario de F-21 que la justifica.

### N-01 · Tutoriales y Chats a los íconos de la cabecera

- **Las dos secciones:** `core/navigation/navigation.map.ts:100-121` (`tutorials`, grupo General, `roles: [ANY_ROLE]`, **`fueraDelMenuPara: ['PRACTITIONER']`** — ya está fuera del menú del médico desde el §4.H) y **L122-141** (`messaging`, «Chats», grupo General, `roles: [ANY_ROLE]`).
- **La cabecera:** `features/shell-layout/shell-layout.html:226-420`. A la derecha (`div.app-header__derecha`, L266): `<app-notification-bell />` (L271), el selector de paciente activo (L279-…), el selector de organización, **Ajustes** como `<a routerLink="/settings" appTooltip="Ajustes" aria-label="Ajustes">` con SVG en línea (L378-386), y el menú de cuenta (L388-420). **Es el precedente exacto**: un enlace con ícono, `aria-label` y globo. «Chats» necesita además el contador de no leídos (`messaging.ts:186` ya calcula «(3) AloVida - Chats» para el título de la pestaña).
- **El mecanismo para sacarlos del menú sin quitarles la ruta:** `navigation.types.ts:334-350` — `fueraDelMenuPara` («sigue existiendo y funcionando, pero no ocupa una entrada de primer nivel»). Para las dos personas: `fueraDelMenuPara: [ANY_ROLE]` (como ya hacen `settings`, L1249, y los tres directorios, L242/307/349).
- **El spec que fija la lista cerrada del menú:** `core/navigation/navigation.service.spec.ts:126, 220-236, 283-292, 412-439, 563-571` — enumera «Chats» y «Cotizaciones» por nombre. Cambia con la decisión, **no se debilita**: se actualiza la lista con el motivo (regla 80.5.4).
- **Ícono:** el set cerrado tiene `chat` (L47) y `teach` (usado por la sección de tutoriales). No hace falta uno nuevo.

### N-02 · Cotizaciones del paciente por precio y cercanía

- **Lo que se llama «Cotizaciones» hoy es del médico:** `navigation.map.ts:605-625` (`my-quotations`, `roles: ROLES_DE_QUIEN_ATIENDE`, «Armá el presupuesto de un servicio con su plan de pagos»), `features/quotations/**` (FT-24: `quotation-list.ts:29-40` busca un paciente y lista sus presupuestos; `quotation-form.html` arma plan de pagos). **No es lo que el doctor describe** (`Q-15`).
- **Los equivalentes existentes que sí son del paciente (regla 96.1: buscar antes de crear):**
  - `features/account/medical-record/where-to-buy/**` — «¿Dónde comprar?» de una receta: disponibilidad por farmacia con **precio** (`AvailabilityProduct.price`, `pharmacy.types.ts:78-98`) y **distancia** (`AvailabilitySite.distanceKm`, L114), mapa, origen guardado (`saved-places`), y pestañas por vertical, **incluida «Centros de imagenología»** (`where-to-buy.html:300-308`) y laboratorios (`LABORATORIOS_ROUTE`).
  - `features/nearby-places/**` — «Lugares cercanos»: `PublicDirectoryClient` nearby (`PublicNearbyResult.distanceKm`, `public-directory.types.ts:336-341`, `PublicNearbyQuery.kind`), radio 15 km, tope 20, origen elegible (`search-origin-picker`), y «mi receta» como entrada (`RenglonDeReceta`, `nearby-places.ts:38-42`).
  - `features/laboratory-directory/**` (unidades diagnósticas, `DiagnosticUnitsClient`) y `features/public-directories/**` (clínicas, farmacias) para servicios médicos e imagenología.
  - Documentos del paciente para «elegir la receta, la orden de análisis o la orden de servicio»: `account/medical-record` (recetas, `MedicationRequest`), `account/diagnostic-orders` (órdenes; ya tiene «Reservar hora en un laboratorio», `diagnostic-orders.html:86-101`).
- **Dónde hay precio con procedencia y dónde no:** farmacias sí (`GET public/medications/:conceptId/availability`, API `pharmacy-public.controller.ts:120`, `sites/:siteId/prices` L87). Servicios médicos: el único arancel es `core/mock/fixtures/fee-schedules.generated.ts` («honorarios médicos del Colegio Médico de Santa Cruz (2025, **en UMA**)… **`UMA` no es una moneda… su conversión a bolivianos no está declarada**», L1-24), consumido sólo por `practice.handlers.ts`. Imagenología y análisis: **sin precios publicados** en el simulador. **Nada de esto se inventa** (`Q-16`, regla 97.4.1): se muestra «precio no publicado» y se ordena por lo que sí hay.
- **API real de cercanía:** `community-public.controller.ts:344` (`GET public/nearby`); no hay un endpoint único de «buscar en cuatro verticales por precio». La pantalla compone lecturas existentes; si hiciera falta un manejador nuevo en el simulador, se escribe como doble declarado con la forma REST que le tocaría (regla 65).
- **El renglón del menú** del paciente («Cotizaciones» bajo «Mi cuenta», rol `PATIENT`) es de Ender (`navigation.map.ts`), y toca la lista cerrada del spec (ver N-01).

### N-03 · Mis puntos como pestaña del perfil del paciente

- **La sección:** `navigation.map.ts:1325-1348` (`my-account/loyalty`, «Mis puntos», grupo Mi cuenta, `roles: ['PATIENT']`, «Aparece siempre, incluso sin programa activo: el cliente pidió que el módulo esté disponible»). La pantalla: `features/account/loyalty/loyalty.{ts,html}` (`loyalty.html:1-5` abre con **su propio `app-page-header`** y breadcrumbs; `loyalty.ts:40-60`: `GET /loyalty/me`, `/loyalty/me/points`, `POST …/redeem`; pasos `saldo | canjear | comprobante`).
- **Las pestañas del paciente:** `pestanas-del-perfil.ts:20-33` — `PESTANAS_DEL_PERFIL = ['Datos personales', 'Contacto', 'Facturación', 'Seguros y tutores']` con `PESTANA` de índices, compartidas entre la ficha (`my-profile.html:167, 311, 393, 425`) y el editor (`patient-profile-edit.html:30, 203, 344, 372`). Agregar la quinta es agregarla **en la constante** y montar `<app-loyalty>` en la ficha; el editor no la necesita (no se edita).
- **Quién apunta a la ruta:** el chip de puntos de promociones (`account/promotions/promotion-card/promotion-card.ts:42`) y `punto-motivo.ts:117`. La ruta se **conserva** y redirige a la pestaña (`Q-17`); el redirect se declara en `app.routes.ts` (Ender) y el renglón del menú se retira (Ender).
- `app-page-header` dentro de una pestaña sería una cabecera dentro de una tarjeta: hace falta un input tipo `embebido` en `Loyalty` para omitirla, o partir la pantalla en contenedor + vista (que es justo el carril de Itzan del 21/09).

---

## 3. Inventario de D-05 — los 78 `iconOnly`, por archivo y por dueño de esta noche

`git grep -c 'iconOnly' origin/mockup -- 'src/app/**/*.html'`, ordenado. El dueño es el de la
reserva del reparto; **«sin dueño»** significa que nadie lo tiene reservado esta noche y se declara
para la oleada siguiente (regla 00 §3.3), igual que HALL-D11 del 20/09.

| Archivo | `iconOnly` | Dueño esta noche |
|---|---|---|
| `features/auth/register-patient/register-patient.html` | 8 | Itzan (sólo si son los dos bloques de ubicación; el resto **sin dueño**) |
| `shared/components/organisms/paginated-form/paginated-form.html` | 7 | Itzan |
| `shared/components/organisms/date-picker/date-picker.html` | 7 | Itzan |
| `features/design-system-sample/design-system-sample.html` | 5 | sin dueño (vitrina) |
| `shared/components/atoms/back-link/back-link.html` | 4 | Itzan |
| `features/form-builder/field-editor/field-editor.html` | 4 | sin dueño |
| `features/auth/registro-compartido/ubicacion-picker/ubicacion-picker.html` | 3 | Itzan |
| `features/auth/register-practitioner/register-practitioner.html` | 3 | sin dueño (carril del 21/09 de Itzan) |
| `shared/components/organisms/header/header.html` | 2 | Ender |
| `shared/components/molecules/pagination/pagination.html` | 2 | Pablo (**deja de ser excepción**) |
| `shared/components/molecules/file-preview/file-preview.html` | 2 | sin dueño |
| `features/pharma-lab/doctor-visits/doctor-visits.html` | 2 | sin dueño |
| `features/clinical-record/clinical-record.html` | 2 | sin dueño (carril del 21/09 de Marcelo) |
| `features/auth/register-laboratory/register-laboratory.html` | 2 | sin dueño |
| `features/auth/register-imaging-center/register-imaging-center.html` | 2 | sin dueño |
| `features/agenda/my-agenda/week-view/week-view.html` | 2 | sin dueño (agenda) |
| `features/agenda/agenda.html` | 2 | sin dueño (agenda) |
| `features/account/my-profile/practitioner-profile-edit/practitioner-profile-edit.html` | 2 | Itzan |
| `shared/components/organisms/tree-select/tree-select.html` | 1 | sin dueño |
| `shared/components/organisms/auth-split/auth-split.html` | 1 | sin dueño |
| `shared/components/molecules/search-field/search-field.html` | 1 | sin dueño (limpiar búsqueda: excepción candidata) |
| `shared/components/molecules/reference-combobox/reference-combobox.html` | 1 | sin dueño |
| `shared/components/molecules/card-detail-panel/card-detail-panel.html` | 1 | sin dueño |
| `features/shell-layout/shell-layout.html` | 1 | Ender |
| `features/clinical-record/patient-chart/medication-block/medication-block.html` | 1 | sin dueño |
| `features/alovida/shell/alovida-shell.html` · `alovida-public-shell.html` | 1 + 1 | **no se toca** (ADR-0014: maqueta portada) |
| `features/agenda/my-agenda/my-agenda.html` · `agenda/blocks/blocks.html` | 1 + 1 | sin dueño (agenda) |
| `features/account/my-profile/work-history/site-bank-qr-dialog/site-bank-qr-dialog.html` | 1 | Pablo |
| `features/account/my-profile/practitioner-profile/…/practitioner-profile-view.html` · `patient-profile-edit.html` · `my-profile.html` | 1 + 1 + 1 | Itzan |

**Con dueño esta noche: 37 de 78** (Itzan 27 · Pablo 3 · Ender 3 · más los 4 de `back-link` si se
cuentan aparte). **Sin dueño: 39** — y está dicho. Cada uno de los 78 exige un veredicto escrito:
«excepción ADR-0012 §3 con `aria-label` + globo y motivo al lado» o «se le pone texto».

---

## 4. Choques y hallazgos transversales — leerlos antes de empezar

| ID | Hallazgo | A quién le pega | Regla que manda |
|---|---|---|---|
| **HALL-E1** | La maqueta **no tiene backend**: `mockBackend: true` fijo. Todo DoD va contra `core/mock/**`; un dato nuevo necesita su manejador | Los cinco | Regla 65 |
| **HALL-E2** | **El working copy no es la maqueta**, y `origin/mockup` se movió dos veces hoy. Cada uno reconsulta y declara su corte | Los cinco | Regla 30 §4 |
| **HALL-E3** | **Sólo `POST` y `DELETE` de credenciales existen en la API real**; editar título/especialidad/matrícula, retirar especialidad/matrícula y todo el historial laboral bajo `me` **viven sólo en el simulador** (`profiles.client.ts:775-786`, `profiles-practitioners.controller.ts:228-529`). El modal de D-08 se cierra `VERIFIED` contra el doble y con la brecha declarada para `dev` | Itzan, Pablo | Regla 65 §4, regla 30 |
| **HALL-E4** | **`DataTable` pagina por cursor por decisión documentada** (`CONTRATO-data-table.md` §10.2, `data-table.types.ts:1-7`), sin total ni números; D-08 pide números y selects. Se resuelve con `app-pagination` en cliente para listas locales, no rompiendo el contrato de 30 consumidores | Pablo, Itzan | Regla 00 §1.4, 96.4.1 |
| **HALL-E5** | **`sticky: 'end'` y el scroll lateral son una decisión del propietario del 18/09/2026** escrita en `data-table.types.ts:24-27`; D-08 pide sin scroll X. Gana el pedido nuevo y el ADR conserva las dos fechas | Pablo | Regla 00 §8 |
| **HALL-E6** | `pestanas-del-perfil-medico.spec.ts` falla si un campo del alta queda sin pestaña; D-03 saca tres. El mecanismo `CAMPOS_DEL_ALTA_SIN_PESTANA` existe para esto | Itzan | Regla 80.5.4 |
| **HALL-E7** | `practitioner_specialties` **no tiene `file_id`**, tiene `supporting_credential_id`; «adjuntar siempre» en especialidades se modela vinculando a un título con archivo, o como doble declarado | Itzan | Regla 00 §1.1, 97.1 |
| **HALL-E8** | La latencia del simulador es **120–300 ms por petición, aleatoria** (`mock-backend.interceptor.ts:251-259`) y «elegir médico» dispara varias (perfil + terminología + cupos por sede + próximo hueco). R-02 se **mide** antes de tocar | Ender, Justin | Regla 10 fase 5 |
| **HALL-E9** | Los **13 profesionales registrados** (`profesionalesRegistrados()`, con `origen`) **no reciben recurso ni agenda** (`agenda.ts:106`): aparecen en el directorio sin turnos | Ender | Regla 97.6 (datos sintéticos, deterministas) |
| **HALL-E10** | «Cotizaciones» existe pero **es del médico** (FT-24); lo que pide N-02 es del paciente y ya tiene dos equivalentes (`where-to-buy`, `nearby-places`) | Justin, Ender | Regla 96.1, 00 §1.1 |
| **HALL-E11** | **No hay precios con procedencia** para servicios médicos (arancel en UMA sin conversión), imagenología ni análisis. Se muestra «no publicado», no se inventa | Justin | Regla 97.4.1 |
| **HALL-E12** | `navigation.service.spec.ts` **fija por nombre la lista cerrada del menú** («Chats», «Cotizaciones»); N-01, N-02 y N-03 la cambian. Se actualiza con motivo, nunca se debilita | Ender | Regla 80.5.4 |
| **HALL-E13** | «Listo, guardamos esta dirección» lleva `appAnuncio` y `data-testid` que usan specs/E2E; quitar el texto visible no puede quitar el anuncio accesible ni romper el barrido sin actualizarlo | Itzan | Regla 95.4, 80.5.1 |
| **HALL-E14** | Reconocimiento de voz: **sólo navegador**, no bajo SSR; y lo dictado es PHI que **no** sale a un servicio externo no acordado sin declararlo | Marcelo | Regla 90.2.4, 95.6.5 |
| **HALL-E15** | El set de íconos es cerrado y **no tiene** ver/imprimir/descargar/duplicar/qr; D-05 no autoriza a ampliarlo «de paso» | Los cinco | Regla 00 §3.3 |
| **HALL-E16** | **39 de los 78 `iconOnly` no tienen dueño esta noche** (§3). Igual que HALL-D11: se declara, no se disimula | Coordinación | Regla 00 §3.3 |
| **HALL-E17** | Los carriles del 21/09 de Itzan, Ender y Marcelo siguen en `0/N` en sus dailies. Esta noche se suman archivos **sin intersección**; lo del 21/09 no se abandona: queda `A MEDIAS` declarado | Coordinación | Regla 70.1.1 |

## 5. Lo que este documento NO verificó

- **Nada se ejecutó.** Ni `yarn typecheck`, ni `yarn lint`, ni un test, ni la maqueta en un navegador.
  Peldaño `DISCOVERED`, no `RUNS` ni `TESTED`.
- **No se abrió la maqueta desplegada.** Todo lo que dice «el doctor ve X» es inferencia de la rama, no
  observación de la URL. Quien reciba cada prompt **mira la pantalla antes de tocarla**; ahí se cierran
  `Q-4`, `Q-7`, `Q-13` y la mitad de D-08 («¿el botón de guardar se habilita por cambios o por validez?»).
- **No se midió R-02.** El número de peticiones y el tiempo total son la primera microtarea de Ender y de Justin.
- **No se contó cuántos de los 78 `iconOnly` son excepciones legítimas.** Se contaron apariciones; el
  veredicto por botón es microtarea.
- **No se leyó `docs/progress/BLOCKERS.md`** del corte (el cliente lo cita para el hueco de la API).
- **No se leyó el histórico completo de `origin/mockup`**: sólo el corte y los merges desde el 19/09.
