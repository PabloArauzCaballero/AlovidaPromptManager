# PLAN — El patrón de la casa: botones con texto, insignia de especialidad y perfil editable

> **AVANCE: 62 / 62 — 100 %.** El denominador pasó de 54 a 62: ocho microtareas se agregaron
> sobre la marcha, cada una por un trabajo que el encargo no preveía y que no se podía hacer
> «de paso» (H2.S2.M4, H2.S3.M4 a M7, H4.S2.M4, H5.S3.M4 y H5.S3.M5). El porcentaje se calcula
> sobre el denominador corregido, no sobre el que hacía quedar mejor.

- **Persona:** Itzan · **Turno:** noche · **Fecha del reparto:** 2026-09-20
- **Encargo:** [`PatronDeBotonesInsigniaYPerfilEditable.md`](PatronDeBotonesInsigniaYPerfilEditable.md)
- **Correcciones:** C-01, C-02, C-05, C-06 (dueño del patrón), C-09, C-21 (dueño de la regla)

Este plan **no repite** el encargo: los CA y DoD completos de cada microtarea viven ahí y son la
fuente. Acá van el corte, el orden de ejecución, el estado vivo de las 54 y las decisiones que se
vayan tomando.

## 1. El corte

```text
$ git fetch origin && git log -1 --format='%H %ad %s' origin/mockup
68dcb562ef3dd74de03f4887c57fd836fb21be13 Sun Sep 20 20:59:15 2026 -0400 docs(deploy): documentar Traefik por IP en vez del dominio sslip.io de Coolify
```

| Campo | Valor |
|---|---|
| **SHA fijado** | `68dcb562ef3dd74de03f4887c57fd836fb21be13` |
| **Rama de trabajo** | `itzan/patron-acciones-fila-insignia-perfil` |
| **Base del PR** | `mockup` |
| **Corte de referencia del reparto** | `689697821a6e6d2c8f702c7508d6728fa9a1869a` (PR #554) |

El corte del reparto quedó **1 commit atrás** del que fijo. Manda el mío, como indica el encargo.

## 2. Orden de ejecución — por qué no es el orden del documento

El encargo marca H1 como `BLOQUEANTE` y H2 como `BLOQUEANTE PARA LOS OTROS CUATRO`, y dice
textualmente: *«Avisá por el daily en cuanto el componente exista y compile, aunque el resto de tu
lote esté a medias.»*

Un retraso en H1 lo pago yo. Un retraso en H2 para a Pablo, Justin, Ender y Marcelo en su parte de
C-06. Por eso el camino crítico va primero, sin saltear nada:

| Orden | Qué | Por qué acá |
|---|---|---|
| 1 | H1.S1 | Rama, SHA y maqueta arriba. Sin `PLAN.md` el candado bloquea el primer `Edit` de código |
| 2 | H2.S1 | La regla escrita va antes del componente por diseño del encargo, y es `.md` |
| 3 | H1.S2 | Los dos inventarios. H2.S3.M3 consume directamente el de la columna «dueño» |
| 4 | H2.S2 → H2.S3 | Componente y **anuncio**. Acá se destraban los otros cuatro |
| 5 | H1.S3 | Inventario de especialidades y línea de base de gates |
| 6 | H3 → H4 → H5 → H6 | El resto del lote, en el orden del encargo |

## 3. Alcance — la frontera, en una línea

**Míos:** `src/app/shared/**` · `src/app/features/account/my-profile/**`.
**De otros, se documentan con `ruta:línea` y no se tocan:** `features/agenda/**`, `my-services/**`
(Pablo) · `patient-chart/medication-block/**` (Justin) · `free-note-block/**`, `admission-block/**`,
`clinical-record/consultation/**` (Marcelo) · `core/mock/**`, `features/dashboard/**`,
`core/data-access/**` (Ender) · `features/practice/my-practice/**` y
`core/navigation/navigation.map.ts` **se acuerdan, no se mueven**.

---

## 4. Estado vivo de las 54 microtareas

### H1 — Corte, maqueta arriba y los tres inventarios medidos

**Prioridad:** `BLOQUEANTE` · **Kill-test:** pedí el número de botones sólo-icono; si la respuesta es «muchos», el inventario no existe.

**Estado:** EN CURSO

#### H1.S1 — El corte y el entorno

**Estado:** HECHO

| ID | Microtarea | CA (binario) | DoD | Estado |
|---|---|---|---|---|
| H1.S1.M1 | Traer `origin/mockup`, declarar el SHA y salir de ahí con la rama | El SHA está en el `PLAN.md` | `git log -1 --format='%H %ad %s' origin/mockup` pegado · §1 | HECHO |
| H1.S1.M2 | Levantar la maqueta y entrar a `/my-account` como médica | La ficha abre con sus pestañas — son **siete**, no seis: ver HALL-I4 | `evidencia/antes/observaciones.md` — rótulos enumerados desde el DOM | HECHO |
| H1.S1.M3 | Capturar ficha, editor y «Dónde atiendo» antes de tocar | Tres capturas con nombre que dice qué son | `evidencia/antes/01-ficha-perfil-medico.png`, `02-ficha-donde-atiendo.png`, `03-editor-perfil-medico.png` — **miradas**, ver §7 | HECHO |

#### H1.S2 — Inventario de botones y de opciones

**Estado:** HECHO

| ID | Microtarea | CA (binario) | DoD | Estado |
|---|---|---|---|---|
| H1.S2.M1 | Medir los botones sólo-icono de toda la aplicación | Hay total y lista por archivo | `git grep -c`/`-o` de `iconOnly` en `evidencia/inventarios/` | HECHO |
| H1.S2.M2 | Medir los grupos de opciones que hoy no son `select` | Total por tipo: chips, `radio-group`, `radio-otro`, `segmented-control` | `git grep -c` pegado | HECHO |
| H1.S2.M3 | Separar en los dos inventarios qué es mío y qué es de otro | Cada fila dice de quién es el archivo | Tabla con columna «dueño» — es el encargo para los otros cuatro | HECHO |

#### H1.S3 — Inventario de especialidades y línea de base de gates

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD | Estado |
|---|---|---|---|---|
| H1.S3.M1 | Medir dónde se pinta una especialidad hoy y con qué forma | Lista con archivo, línea y forma | **330 menciones en 43 plantillas, de las que sólo `25` en `7` dibujan el dato**; el resto son rótulos y nombres de control. Clasificadas con ruta, línea y forma en [`evidencia/antes/inventario-especialidades.md`](evidencia/antes/inventario-especialidades.md) §2. Hallazgo: en `practitioner-profile-view.html` hay **cinco** formas, no tres, y **dos reglas de tono** que se reparten por `esPropio` (`:170` reparte color por hash del nombre; `:772` pinta todo gris): la misma especialidad del mismo médico cambia de color según quién la mire. La rama propia, medida: `2 colores distintos` en `/my-account` | HECHO |
| H1.S3.M2 | Registrar qué piezas existentes se pueden reusar para la insignia | Nombradas con su ruta | Las cuatro abiertas y con veredicto en [`inventario-especialidades.md`](evidencia/antes/inventario-especialidades.md) §3: **`atoms/specialty-icon/` se usa tal cual** (resuelve el glifo por palabra clave y degrada a `general`), **el mapa de tonos de `chip` se compone**, `atoms/badge/` descartado (`role="status"` anunciaría ocho especialidades al pintarse; su valor es escalar y no admite ícono) y `organisms/specialty-browser/` descartado (es un selector de catálogo, no una insignia) | HECHO |
| H1.S3.M3 | Correr typecheck, lint y specs del perfil como baseline | Exit code de los tres | Los tres en verde: `typecheck exit=0` · `lint exit=0` · `17 passed (17)` archivos y `350 passed (350)` pruebas de `my-profile/`, `specs exit=0`. En [`evidencia/antes/gates.txt`](evidencia/antes/gates.txt), que además **declara qué foto es**: se tomó con H2 ya dentro, porque el orden de ejecución puso H2 primero; la atribución de rojos no se pierde porque cada rojo de H2 se comparó contra el corte cuando apareció | HECHO |

### H2 — El patrón: botón con icono y texto, y acciones de fila en desplegable

**Prioridad:** `BLOQUEANTE PARA LOS OTROS CUATRO` · **Kill-test:** que Pablo lo use sin preguntar nada; si tiene que preguntar cómo, falta el ejemplo.

**Estado:** EN CURSO

#### H2.S1 — La regla escrita antes del componente

**Estado:** HECHO

| ID | Microtarea | CA (binario) | DoD | Estado |
|---|---|---|---|---|
| H2.S1.M1 | Escribir la regla: todo botón lleva icono **y** texto; las acciones de fila van en desplegable | La regla está en un archivo versionado y dice qué hacer en cada caso | Archivo + enlace en el daily | HECHO |
| H2.S1.M2 | Registrar el desvío contra la decisión de propietario del 2026-09-13 | Están las dos fechas, la razón vieja y por qué la nueva la reemplaza | Registro citando `agenda.html:545` | HECHO |
| H2.S1.M3 | Declarar la única excepción admitida y cómo se justifica | Escrito qué botón puede quedar sólo-icono y qué debe cumplir | Mínimo: nombre accesible **y** globo | HECHO |

#### H2.S2 — El componente de acciones de fila

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD | Estado |
|---|---|---|---|---|
| H2.S2.M1 | Construir el componente **sobre `app-menu`**, no desde cero | Lo usa y no reimplementa posicionamiento ni cierre | `shared/components/molecules/row-actions/` · `git status --porcelain` de `molecules/menu/` **vacío** | HECHO |
| H2.S2.M2 | Verificar teclado completo: abrir, recorrer, elegir, `Escape`, foco devuelto | Los cinco comportamientos observados | En navegador, sobre «Dónde atiendo»: **10/10 en verde** — anillo de foco `3px`, `qr > editar > retirar > qr` (da la vuelta), `Escape` devuelve el foco al disparador, `Enter` sobre «Editar» abre el formulario. Capturas en `evidencia/h2/` | HECHO |
| H2.S2.M3 | Escribir su spec: abre, lista, emite la elegida, cierra con `Escape` | El spec cubre los cuatro y pasa | `ng test --include=…/row-actions.spec.ts --watch=false` → **10 passed (10)** | HECHO |
| H2.S2.M4 | **(añadida)** Que el nombre accesible distinga la fila **también en la forma en fila**, no sólo en el disparador | Con `fila`, cada botón suelto se anuncia con su fila | `12 passed (12)`; en navegador, «Dejar de atender — Clínica Los Olivos · Sede Central». El porqué de la raya, en `inlineLabel` | HECHO |

#### H2.S3 — Publicarlo para los otros cuatro

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD | Estado |
|---|---|---|---|---|
| H2.S3.M1 | Aplicarlo una vez en un archivo mío, como ejemplo vivo | Hay un uso real funcionando | `work-history.html`: la sede propia pliega sus tres, la ajena deja sus dos en la fila. `evidencia/h2/desplegable-abierto.png` · `acciones-en-la-fila.png` | HECHO |
| H2.S3.M2 | **Anunciarlo en el daily de equipo** con ruta, ejemplo y regla | El anuncio está escrito y los cuatro pueden empezar | `Daily-Noche-2026-09-20.md` **§4-bis** + checkpoint en el daily propio | HECHO |
| H2.S3.M3 | Registrar el inventario de C-06 como encargo por dueño | Cada uno tiene su número y su lista | Tabla por dueño en `Daily-Noche-2026-09-20.md` §4-bis | HECHO |
| H2.S3.M4 | **(añadida)** Migrar `work-history.spec.ts` a la nueva forma, sin debilitarlo | Las aserciones de las tres acciones siguen existiendo y pasan | `58 passed (58)`, mismas pruebas y **de 120 a 121 aserciones**. Dos corregidas de fondo: una pedía lo contrario de ADR-0012, otra era verde falso (`querySelector` de un testid inexistente) | HECHO |
| H2.S3.M5 | **(añadida)** Migrar los tres recorridos de navegador que apuntan a `sede-editar`/`sede-quitar`/`sede-qr` | Los tres vuelven a encontrar la acción | «Dónde atiendo» `20/21` (el rojo es anterior al cambio, comprobado contra el corte) y QR bancario `23/23` en claro y oscuro. `alv-perfil-medico` **ejecutado paso a paso sobre la pantalla: `10/10`**, incluida dos veces la cadena que el cambio introdujo y el ALV-010 en MAYÚSCULAS; además se corrigieron dos defectos que lo tenían roto de antes (HALL-I6). Su corrida como suite no depende de este cambio: ver HALL-I6 | HECHO |
| H2.S3.M6 | **(añadida)** Que el aviso «Sin QR de cobro configurado» llegue a 4,5:1 en los dos temas | Medido ≥ 4,5:1 en claro y en oscuro | De `3,09:1` a **`8,29:1`** en claro y de `4,76:1` a **`10,93:1`** en oscuro, medidos contra el fondo realmente pintado | HECHO |
| H2.S3.M7 | **(añadida)** Cerrar la excepción de ADR-0012 en `post-preferences-menu`: el disparador sólo-icono tiene el nombre para quien escucha y le falta el globo para quien ve | El disparador muestra el globo con el mismo texto del `aria-label` | El propio comentario del archivo ya prometía las dos mitades y sólo estaba la primera (HALL-I5). Ahora lleva `appTooltip` con el mismo texto, y una prueba enfoca el botón y comprueba que aparece el globo con `role="tooltip"` y el texto exacto — no que el atributo esté puesto. `post-preferences-menu.spec.ts` **15/15** | HECHO |

### H3 — La insignia de especialidad, una sola en todo el proyecto

**Prioridad:** `ALTA` · **Kill-test:** contá cuántas formas de mostrar una especialidad quedan en el perfil; más de una y C-09 no está hecho.

**Estado:** TODO

#### H3.S1 — Descartar lo existente por escrito, y recién ahí crear

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD | Estado |
|---|---|---|---|---|
| H3.S1.M1 | Abrir las cuatro candidatas y decir de cada una por qué sirve o no | Las cuatro tienen veredicto con motivo | Las cuatro, y **una quinta que el encargo no nombra**, en [`inventario-especialidades.md`](evidencia/antes/inventario-especialidades.md) §3. Se reusan tres (`specialty-icon` entero, `status-seal` para el estado, el mapa de tonos del `chip`); se descartan dos con motivo que no es de aspecto | HECHO |
| H3.S1.M2 | Definir la anatomía: icono, nombre, estado, principal y certificada | Están los datos y de dónde sale cada uno | Tabla dato→origen→pieza en [`inventario-especialidades.md`](evidencia/antes/inventario-especialidades.md) §4. **Los cinco ya están en `EspecialidadVisible`** (`practitioner-profile-view.types.ts:36`): no hace falta modelo nuevo ni nada del backend. `alcance`, `desde` y `hasta` van **al lado**, no adentro | HECHO |
| H3.S1.M3 | Definir los tonos con tokens y verificar contraste en los dos temas | Ningún literal de color; contraste medido | §6 del inventario. **Los siete tonos pasan 4,5:1 en los dos temas** (`primary` 9,49 y 6,56; `neutral` 7,54 y 12,03), así que el contraste no decide: se elige por significado. Regla: `primary` la principal, `neutral` el resto — el hash queda afuera porque reparte tonos que **significan algo** y hace leer una especialidad como advertencia. Cero literales: todo por `tone--primary`/`tone--neutral` | HECHO |

#### H3.S2 — El componente y su grid

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD | Estado |
|---|---|---|---|---|
| H3.S2.M1 | Construir la insignia y su contenedor de grid | Los dos existen y compilan | `SpecialtyBadge` + `SpecialtyBadgeGrid` en `shared/components/organisms/`, generados con el CLI. `typecheck exit=0` · `lint exit=0`. **Van en `organisms/` y no en `molecules/` porque montan `StatusSeal`**, y el linter hace cumplir que una molécula no dependa de un organismo; el porqué, en el encabezado de `specialty-badge.ts` | HECHO |
| H3.S2.M2 | Verificar el grid en móvil estrecho, tablet y escritorio | Sin desborde horizontal ni nombre cortado | **`16/16`** en 375, 768 y 1440, en claro y oscuro: `375 vs 375`, `768 vs 768`, `1440 vs 1440`, y `1` renglón por nombre en los seis. Capturas en `docs/frontend/evidence/insignia-especialidad/`. **Acá apareció el defecto que ningún test vio**: el nombre se apilaba letra por letra en vertical | HECHO |
| H3.S2.M3 | Escribir su spec: pinta lo que recibe, distingue principal y certificada | El spec pasa | `23 passed (23)` en los dos specs. Incluye una prueba que **lee el CSS** para impedir literales de color, y tres que fijan que el sello no se dibuja sin su texto | HECHO |

#### H3.S3 — Aplicarlo en el perfil y unificar las tres formas

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD | Estado |
|---|---|---|---|---|
| H3.S3.M1 | Reemplazar las tres formas del perfil por la insignia | Cero chips o badges de especialidad a mano en ese archivo | Eran **cinco**, no tres (inventario §2). Las cinco reemplazadas. **Kill-test en navegador: `0` restos** de forma vieja en las dos pestañas. Tres pruebas nuevas en el spec del perfil, porque la migración entera había pasado por la suite **sin que una sola se enterara** — 350 en verde antes y 350 después | HECHO |
| H3.S3.M2 | Verificar que no se perdió ningún dato: principal, certificada, fechas, estado | Todo lo que se mostraba se sigue mostrando | Nada se perdió: «Principal» y «Certificada» pasan a la insignia **con su palabra**, el alcance y las fechas siguen al lado, el conteo del encabezado no se tocó, y el estado sube del renglón de fechas al sello, donde se dice una sola vez. Capturas en `docs/frontend/evidence/insignia-especialidad/` | HECHO |
| H3.S3.M3 | Registrar los lugares fuera de mi alcance donde la especialidad sigue distinta | Hay lista con dueño | Siete lugares con ruta y dueño en [`inventario-especialidades.md`](evidencia/antes/inventario-especialidades.md) §2.3 (directorio, constructor de formularios, perfil público, búsqueda, admin, maqueta, farmacia). **Más uno dentro de mi alcance que decidí no migrar**, con su razón: `credentials-panel` muestra la especialidad como una credencial entre cinco tipos, no como especialidad | HECHO |

### H4 — El perfil pierde «Cómo atendés» y los enlaces; el consultorio pasa a pestaña

**Prioridad:** `ALTA` · **Kill-test:** si «Dónde atiendo» muestra «Telemedicina» o «Pacientes nuevos», C-01 no está hecho; si hay que salir del perfil para llegar al QR, C-02 tampoco.

**Estado:** HECHO

**Kill-tests, ejecutados en la pantalla:** `C-01 kill-test: «Dónde atiendo» no muestra «Cómo atendés» — sección=false tele=false nuevos=false` · `C-02 kill-test: el QR del consultorio propio se abre sin salir del perfil — ruta=/my-account imagen=true reemplazar=true · QR bancario · Consultorio Dra. Rojas`. Recorrido completo **19/19**, capturas en `docs/frontend/evidence/consultorio-en-el-perfil/`. Gates: `typecheck exit=0` · `lint exit=0` · área del perfil **`17 archivos · 359 passed (359)`** (eran 353).

#### H4.S1 — Quitar «Cómo atendés» sin perder los datos en silencio (C-01)

**Estado:** HECHO

| ID | Microtarea | CA (binario) | DoD | Estado |
|---|---|---|---|---|
| H4.S1.M1 | Registrar qué muestra hoy la sección y de dónde sale cada dato | Los dos datos tienen su campo de origen | [`evidencia/antes/como-atendes-y-enlaces.md`](evidencia/antes/como-atendes-y-enlaces.md): el fragmento literal, la tabla dato→origen (`telemedicina`←`telehealthAvailable`, `aceptaPacientesNuevos`←`acceptsNewPatients`) y **los tres retiros previos de «Pacientes nuevos»** con su cita de código — el pedido del doctor es el cuarto, no el primero | HECHO |
| H4.S1.M2 | Quitar la sección de la pestaña | No está y la pestaña sigue mostrando los consultorios | La `app-card` fuera de `practitioner-profile-view.html`; `typecheck exit=0` · `lint exit=0`; en la pantalla `sección=false tele=false nuevos=false` y la pestaña sigue con el mapa de sedes. Captura `donde-atiendo-escritorio-claro.png`. **El primer intento del guion dio verde sin haber mirado nada**: `querySelector('[role="tabpanel"]')` devuelve el PRIMER panel, que está oculto y vacío; se corrigió a buscar el panel visible antes de dar el kill-test por pasado | HECHO |
| H4.S1.M3 | Declarar el destino de los dos datos | Escrito si se muestran en otro lado o si se retiran, y por qué | **«Telemedicina» se reubica, no se retira**, y esto lo destapó una prueba nueva antes de subir nada: el chip que parecía cubrirla vivía sólo en el diseño de la ficha AJENA, así que quitar la sección la habría borrado de la ficha propia. Ahora se estampa en la cabecera propia y **sólo cuando es verdadera**. **«Pacientes nuevos» se retira**, por lo mismo que las tres veces anteriores: anunciar el valor por omisión de alguien que nunca tocó ese ajuste es afirmar algo que no dijo. Decisión escrita en el daily §5 y en `REPORTE.md` | HECHO |

#### H4.S2 — Los enlaces sueltos salen, el consultorio entra como pestaña (C-02)

**Estado:** HECHO

| ID | Microtarea | CA (binario) | DoD | Estado |
|---|---|---|---|---|
| H4.S2.M1 | Verificar cuántos de los dos enlaces existen en mi corte y quitarlos | Los que existían no están | **De los dos que nombra C-02 existe uno solo**; el grep literal, antes y después, está en [`evidencia/antes/como-atendes-y-enlaces.md`](evidencia/antes/como-atendes-y-enlaces.md). «Mi organización médica» **se declara ausente, no se reporta como quitado**. El que existía estaba rotulado «Mis organizaciones» pero apuntaba al consultorio, así que sacarlo satisface las dos mitades del pedido de una vez. En la pantalla: `0` enlaces a esas dos vistas | HECHO |
| H4.S2.M2 | Traer el consultorio propio como pestaña, reusando el diálogo de QR existente | La pestaña existe y el QR se abre desde ahí | La vista de la que habla el doctor **es literalmente un encabezado más `app-work-history` en modo consultorios**, así que la pestaña monta ESE componente: sin copia, sin segundo formulario y sin un segundo QR que se desincronice. Kill-test: `ruta=/my-account imagen=true reemplazar=true`. Captura `qr-abierto-desde-el-perfil.png`. El bloque queda dentro de la condición de ficha propia sin previsualización: ni un colega en la Guía ni la vista pública lo ven | HECHO |
| H4.S2.M3 | Declarar qué pasa con `/administration/my-practice` y su entrada de menú | Escrito: sigue, redirige o se retira, y quién lo decide | **Sigue, con su entrada de menú, y no lo decide este encargo**: C-02 pide que el consultorio se vea como pestaña, no que la otra pantalla desaparezca, y esa pantalla es la puerta del mapa de navegación, territorio de otro. Registrado como acuerdo a pedir (Q-I2) en el daily §5, con el argumento viejo —era el único acceso— honrado: el reemplazo se construyó y se vio funcionando **antes** de sacar el enlace | HECHO |
| H4.S2.M4 | **(añadida)** Que montar el consultorio en la ficha no cueste una lectura de más por visita | Abrir el perfil no dispara ninguna petición de afiliaciones | Trabajo no previsto que apareció al montar el componente por segunda vez: la carga de afiliaciones **no tenía la guarda que su gemela de sedes sí tenía**, así que una lista que nunca se dibuja se pedía igual — antes costaba una petición inútil por visita a «Mis organizaciones», y con el consultorio en la ficha pasaba a costar dos por visita al perfil. Guarda agregada y **fijada con una aserción nueva** en su spec (`toHaveLength(0)`), no sólo quitando la vieja. Área del perfil `359 passed (359)` | HECHO |

#### H4.S3 — El mapa de campos y su spec, decididos juntos

**Estado:** HECHO

| ID | Microtarea | CA (binario) | DoD | Estado |
|---|---|---|---|---|
| H4.S3.M1 | Correr el spec del mapa antes de tocar y después | Hay las dos salidas | Antes de tocar nada: `Test Files 1 passed (1) · Tests 8 passed (8)`. Después del cambio completo: `Test Files 1 passed (1) · Tests 8 passed (8)`. Las dos salidas en `evidencia/` | HECHO |
| H4.S3.M2 | Ajustar el mapa a dónde se ve cada campo de verdad | Ningún campo apunta a una pestaña donde no está | **El resultado correcto era no cambiar ningún valor, y eso se comprobó en vez de suponerse**: los cuatro campos del consultorio ya apuntaban a «Dónde atiendo», y después del cambio apuntan con más verdad que antes — esa pestaña montaba sólo el mapa de sedes, que no enseña el municipio suelto, y ahora monta el bloque donde los cuatro se ven y se corrigen con su propio control. Se agregó la prosa que lo dice; **el spec no se tocó y pasa igual**. Un diff en el mapa por tener un diff habría sido ruido | HECHO |
| H4.S3.M3 | Verificar que los cuatro campos del consultorio siguen visibles | Los cuatro se ven | `{"nombre":true,"direccion":true,"municipio":true,"mapa":true}` con el formulario abierto desde la pestaña. Captura `cuatro-campos-del-consultorio.png` | HECHO |

### H5 — Editar muestra todos los campos, en todas las pestañas

**Prioridad:** `ALTA` · **Kill-test:** contá las pestañas del editor contra las de la ficha; después editá, guardá y recargá.

**Estado:** HECHO — once de once. H5.S3.M3 cerró el 22/09 con su captura, y al cerrarla aparecieron dos trabajos más, cerrados también: H5.S3.M4 (una captura que no mostraba lo que su nombre decía) y H5.S3.M5 (un defecto del mismo mecanismo).

**Kill-test, ejecutado en la pantalla:** `ficha=7 [Datos personales · Contacto · Facturación · Dónde atiendo · Trayectoria · Credenciales · Actividad] · editor=7 [los mismos siete, en el mismo orden]`. Recorrido **22/22**, capturas en `docs/frontend/evidence/editor-con-todas-las-pestanas/`. Gates: `typecheck exit=0` · `lint exit=0` · área del perfil **`17 archivos · 375 passed (375)`**.

#### H5.S1 — Igualar las pestañas del editor a las de la ficha

**Estado:** HECHO

| ID | Microtarea | CA (binario) | DoD | Estado |
|---|---|---|---|---|
| H5.S1.M1 | Igualar `PESTANAS_DEL_EDITOR_MEDICO` a las de la ficha | Coinciden, o la que falta tiene su motivo escrito en el archivo | **Coinciden las siete**, medidas en pantalla y no leídas del código. El comentario que explicaba por qué faltaba «Actividad» se actualizó en vez de borrarse, y la prueba que exigía que **no** estuviera se reemplazó por la invariante fuerte —las dos listas son la misma, en el mismo orden— más una segunda que impide que los índices con nombre se desincronicen. Con la anterior, el editor podía perder tres pestañas sin que nadie se enterara | HECHO |
| H5.S1.M2 | Resolver «Actividad»: son contadores calculados | Escrito que no se editan y por qué, o cuál sí | **No se editan, y la pestaña existe igual.** Un contador que se escribe a mano deja de contar: pasa a ser una afirmación sin respaldo sobre actos clínicos. La respuesta no fue sacar la pestaña —eso dejaba a quien la busca sin nada y sin motivo— sino tenerla, enumerar los cuatro con lo que cuenta cada uno y decir qué hay que hacer para que el número se mueva. En pantalla: `contadores=4 controles=0`, y no se dibuja «Guardar cambios». Q-I1 registrado en el daily | HECHO |
| H5.S1.M3 | Verificar que el lápiz no cambia de pestaña | Se entra a editar en la misma pestaña | **Sí cambiaba, y era un defecto silencioso**: el editor decía en su propio comentario que se abría donde uno venía mirando, pero el lápiz apuntaba a la pantalla a secas y desde «Credenciales» se entraba en «Datos personales». Ahora la ficha manda la pestaña **traducida por etiqueta** —suprime «Facturación» cuando no la tiene, así que los índices de las dos pantallas no son los mismos— y el editor la lee del parámetro, acotada al rango. Medido: `pestaña=«Credenciales» url=?pestana=5`, más cuatro pruebas (pide una, no pide ninguna, pide 99, pide una palabra) | HECHO |

#### H5.S2 — Todos los campos del alta, editables

**Estado:** HECHO

| ID | Microtarea | CA (binario) | DoD | Estado |
|---|---|---|---|---|
| H5.S2.M1 | Listar los campos del alta y cruzarlos con los que el editor ofrece | Tabla con «está / no está» por campo | Los 34, uno por uno, en [`evidencia/h5/campos-del-alta-contra-el-editor.md`](evidencia/h5/campos-del-alta-contra-el-editor.md), con **el contrato que lleva cada uno**: mirar el editor no alcanza, un campo se puede escribir sólo si el contrato lo acepta. **28 de 34 se editan.** Dos hallazgos que el cruce destapó: `sedesLicenseNumber` **no necesita campo nuevo** —es otra matrícula con autoridad «SEDES», que ya es una de las tres opciones—, y `sexAtBirth` estaba declarado como si viviera en «Datos personales» **y ahí no está**, porque la lectura del perfil no devuelve el dato | HECHO |
| H5.S2.M2 | Agregar los campos que falten, en su pestaña | Los que faltaban están y se pueden escribir | **Desvío declarado: ninguno de los seis se puede hacer escribible desde el front**, y no por decisión de diseño — el contrato de corrección del perfil no acepta el documento, el departamento emisor ni el sexo al nacer; el correo de trabajo está excluido a propósito porque es la llave de la cuenta; y el país y la ciudad del título no existen en el modelo de credenciales. Inventarles un campo que el guardado descarta sería prometer algo que no guarda. Lo que sí se hizo: **los tres que se pueden leer aparecen ahora en el editor**, sin control y con la razón al lado, para que quien entra a corregir su documento encuentre el dato y encuentre por qué no lo toca. En pantalla, en sus dos pestañas. El mapa de campos se corrigió con `sexAtBirth` | HECHO |
| H5.S2.M3 | Verificar etiqueta accesible y foco visible en cada campo nuevo | Etiqueta real, no placeholder | **No hay campo nuevo que enfocar, y eso es el resultado, no una excusa**: lo que se agregó son renglones de lectura con su rótulo real (`dt`/`dd`), no controles apagados — un control deshabilitado invita a buscar cómo encenderlo y acá no hay forma. Lo que sí se comprobó es lo contrario de lo que pedía la fila: que **no** haya nada enfocable donde no se puede escribir. `0` controles dentro de los tres bloques, fijado por prueba, y `0` en toda la pestaña «Actividad», medido también en el navegador | HECHO |

#### H5.S3 — Guardar de verdad, y no perder lo escrito

**Estado:** HECHO — M1 a M5.

| ID | Microtarea | CA (binario) | DoD | Estado |
|---|---|---|---|---|
| H5.S3.M1 | Editar y guardar un campo por pestaña, recargando después | El valor nuevo sobrevive a la recarga | Se cambió la biografía en «Datos personales» y el NIT en «Facturación» —los tres primeros paneles son un solo formulario y viajan juntos—, se guardó, se recargó la pantalla entera y el valor estaba. Captura `guardado-tras-recargar.png` | HECHO |
| H5.S3.M2 | Provocar un fallo de guardado y verificar que no se pierde lo escrito | Los datos siguen y el error se ve | El fallo se provocó con **el interruptor que la propia maqueta trae** para esto, no interceptando la red: acá el servicio simulado responde dentro de la aplicación y ninguna petición sale al navegador. La primera versión del recorrido lo hizo interceptando y sus dos pasos quedaron **en verde por el motivo equivocado** —el guardado había funcionado y el aviso que leía era el de éxito—. Con el interruptor: lo escrito sigue, el NIT rechazado en la otra pestaña también, y el aviso dice `Error: Perfil — No se pudo guardar el cambio. Probá de nuevo.` | HECHO |
| H5.S3.M3 | Verificar que el error del servidor se muestra en su campo | Cada error llega a su campo | **Observado en el navegador (22/09)**, con el rechazo que la API real manda ante un DTO inválido —400 `VALIDATION_FAILED` con `details.violations`, mensajes literales de `@MaxLength(100)` para `name` y `lastName`— inyectado en el borde del servicio de datos, porque el simulador de la maqueta no emite `violations` (HALL-I8). El error se construye con el mismo constructor del `HttpErrorResponse` que la maqueta devolvió, así que el `instanceof` de `errorToViewState` es genuino; del borde para adentro todo es el camino real. Resultado: cada mensaje debajo de **su** campo, con `aria-describedby` y `aria-invalid`; los otros seis campos del panel, limpios; el aviso general, una vez; lo tecleado, intacto. Capturas en tres anchos y dos temas: `docs/frontend/evidence/rechazo-por-campo/`. Salida: `evidencia/h5/h5s3m3-rechazo-por-campo.txt`. Es un doble declarado del servidor, no la API | HECHO |
| H5.S3.M4 | Reemplazar la captura `editor-con-todas-las-pestanas/error-del-servidor-en-su-campo.png`, que no muestra lo que su nombre dice | La imagen con ese nombre muestra un error del servidor junto a su campo, no un guardado exitoso | Reemplazada en `d19e545f` por la de escritorio y tema claro del recorrido de H5.S3.M3; mirada: los dos mensajes debajo de «Nombre» y «Apellido paterno», los demás campos limpios | HECHO |
| H5.S3.M5 | Que volver a lo guardado y apretar Guardar no deje pintados los rechazos del intento anterior | Tras un rechazo, un intento que no llega al servidor —sin cambios, o frenado por un teléfono a medias— no deja mensajes de valores que ya no están escritos | **Reproducido en el navegador antes de tocar nada**: los dos mensajes seguían ahí tras «No había ningún cambio para guardar». Causa: la limpieza estaba después de la salida temprana. Arreglo: sube al comienzo del intento (`29bd2614`). Dos pruebas dirigidas en rojo antes (`expected 'taxId no existe en el padrón.' to be ''`) y en verde después: editor `80/80`, área del perfil `17 archivos · 380`, `typecheck` y `lint` en 0, recorrido `15/15`. Salidas en `evidencia/h5/` | HECHO |

### H6 — «Opciones = select», regresión, prueba visual y cierre

**Prioridad:** `ALTA` · **Kill-test:** que Pablo pueda contestar si un toggle viola C-21 leyendo la regla.

**Estado:** TODO

#### H6.S1 — La regla de las opciones, y su tensión con los toggles

**Estado:** HECHO

| ID | Microtarea | CA (binario) | DoD | Estado |
|---|---|---|---|---|
| H6.S1.M1 | Escribir la regla con sus tres casos: lista, alternancia y atajo | Los tres tienen respuesta y ejemplo | `docs/adr/ADR-0013-opciones-en-select.md` en el repo del front, al lado de la de botones, y en su índice. Los tres casos con ejemplo, más un **árbol de tres preguntas** para decidir sin leer el resto. Se agregó un caso cero que el encargo no nombra y que resultó ser la mitad de mis apariciones: **un chip que sólo muestra no es una opción**, así que C-21 no habla de él | HECHO |
| H6.S1.M2 | Registrar la tensión: C-21 pide `select` y C-10 pide toggles | Escrito que es un supuesto de lectura y a quién se confirma | Resuelta en el ADR: no hablan de la misma situación —C-10 es el sí/no de una afirmación, C-21 es elegir entre valores— y por eso ninguna de las dos se dobla. **Y apareció una tensión mayor que la del encargo**: C-21 al pie de la letra contradice un pedido anterior del mismo cliente **que ya está implementado**, los chips de filtro de los cuatro directorios (§A3 del plan de UX del 22/08). Registrado como Q-D8, declarado supuesto y no hecho | HECHO |
| H6.S1.M3 | Anunciar la regla y el inventario por dueño en el daily de equipo | Los cuatro tienen su número y su lista | `Daily-Noche-2026-09-20.md` **§4-ter**: el árbol de decisión, las cinco cosas que hay que saber sin abrir el ADR, la tabla por dueño y el aviso de que el 533 del encargo son 92 controles reales | HECHO |

#### H6.S2 — Aplicarla en mis archivos

**Estado:** HECHO

| ID | Microtarea | CA (binario) | DoD | Estado |
|---|---|---|---|---|
| H6.S2.M1 | Medir en mis archivos antes de tocar | Hay número | **13** controles: `app-chip` 6 · `radio-group` 5 · `radio-otro` 1 · `segmented-control` 1. Comando y salida en [`evidencia/h6/opciones-en-select.md`](evidencia/h6/opciones-en-select.md) | HECHO |
| H6.S2.M2 | Convertir lo que corresponda y dejar justificado lo que no | El número bajó y las excepciones tienen motivo | **13 → 11.** Se convirtieron dos —el formato de la exportación de portabilidad y la pregunta de opción única del cuestionario—, que son los dos únicos que caen en el caso 1. Los once que quedan **no son deuda**: tres chips que sólo muestran, dos que son el atajo que el cliente pidió ver (y cuyo componente ya tiene el desplegable por omisión), la escala y el sí/no del cuestionario, y tres de un componente que montan **52 plantillas** y que por eso recibe una opción nueva, no un cambio de omisión. Cada motivo está escrito al lado de su control | HECHO |
| H6.S2.M3 | Verificar que ningún `select` nuevo perdió una opción | Las opciones son las mismas | Los tres formatos, **en orden y con su texto completo**, fijados por prueba; antes sólo se comprobaba que los tres radios existieran. Y el cambio destapó un **verde falso** que ya estaba ahí: el ayudante elegía el formato escribiendo `BUNDLE` donde `app-select` pone el índice, así que no elegía nada, y la prueba pasaba igual porque las dos descargas las decide la respuesta. Ahora elige por el texto visible **y** comprueba que el formulario mandó `format: 'BUNDLE'`. Las del cuestionario pasan sin tocarse | HECHO |

#### H6.S3 — Regresión, prueba visual y cierre

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD | Estado |
|---|---|---|---|---|
| H6.S3.M1 | Gates estáticos y specs, con los del perfil actualizados | Exit 0 y specs en verde | `typecheck` exit 0 · `lint` exit 0 · suite completa `556 archivos · 6 903 pruebas · 7 rojos`, **los 7 ajenos**: 5 son esperas vencidas por competencia de recursos (verdes al correr su archivo solo) y los 2 reales fallan idéntico con `src/` en el corte `68dcb562` — `register-practitioner` (HALL-I11) y `resumen` de contabilidad, que sólo falla **los lunes** (HALL-I10). Detalle en `evidencia/h6/suite-completa-y-rojos-ajenos.md` | HECHO |
| H6.S3.M2 | Barrido y click-sweep de la maqueta, serial | Las filas de `/my-account` y del banco están limpias | `carril-insurance-portability` **8/8** y `patient-coverage-copays` **6/6**, serial. El barrido **encontró un roto mío**: el recorrido completo buscaba los tres radios que C-21 convirtió en desplegable; corregido leyendo la opción marcada **por su texto** y eligiendo con `selectOption({ label })`, sin bajar lo que afirma. El del cuestionario queda **BLOQUEADO** (la maqueta no dibuja encuestas) y los dos del perfil médico se omiten solos. Detalle en `evidencia/h6/barrido-de-consumidores.md` | HECHO |
| H6.S3.M3 | Capturas 3 viewports × 2 temas, **miradas**, y `REPORTE.md` | Cada captura con su observación; el reporte abre con el avance | Seis capturas del desplegable de formato en `docs/frontend/evidence/formato-en-select/`, sonda **24/24**, cada una con su observación escrita. Mirarlas destapó algo que la sonda no preguntaba: a 375 px el rótulo más largo **se corta por 2 px** (247 contra 245 de hueco útil). Medido en los tres anchos, subido a `ADR-0013` como advertencia con número, y declarado lo que NO se hizo: ni tocar el relleno del átomo (34 plantillas) ni acortar un texto que no es mío. Detalle en `evidencia/h6/capturas-de-cierre.md` | HECHO |

---

## 5. Decisiones tomadas

| # | Decisión | Motivo |
|---|---|---|
| D-1 | El corte es `68dcb562`, no el `689697821a` del reparto | Es el `origin/mockup` vivo; el encargo dice que manda el mío |
| D-2 | Camino crítico H2 antes de terminar H1 | Instrucción explícita del encargo: publicar temprano aunque el resto esté a medias |
| D-3 | Las capturas de línea de base viven en `evidencia/antes/`; las de la entrega van además a la carpeta de evidencia del repo de front | El encargo nombra `evidencia/antes/` y ese material viaja con este plan; la prueba visual de la entrega tiene que viajar en el diff del front, que es donde se revisa |
| D-4 | Las capturas se toman con el viewport agrandado, **no** con `fullPage` | Con `fullPage` este shell sale mintiendo: la barra lateral aparece pisando el contenido. En el DOM `nav.app-side-nav` ocupa 0–240 y `main` arranca en 240 — **no se solapan**. Ver §7 |

## 6. Ambigüedades registradas — no se resuelven solas

| ID | Qué | Dueño |
|---|---|---|
| Q-I1 | «Actividad» son contadores calculados: ¿qué significa «editable» ahí? | Se declara y se consulta |
| Q-D8 | C-21 pide `select` y C-10 pide toggles | Doctor — es interpretación mía, no lo que dijo |

## 7. Línea de base mirada — qué se ve hoy en `/my-account` (H1.S1.M2 · M3)

Sesión `medica@alovida.mock`, 1440 px de ancho, tema claro. Los rótulos no se leyeron de una
captura: se enumeraron del DOM, que es lo que hace comparable el número.

| Superficie | Pestañas | Archivo |
|---|---|---|
| Ficha `/my-account` | **7** — Datos personales · Contacto · Facturación · Dónde atiendo · Trayectoria · Credenciales · Actividad | `evidencia/antes/01-ficha-perfil-medico.png` |
| Ficha › «Dónde atiendo» | abre; mapa con 3 sedes y el bloque «Cómo atendés» | `evidencia/antes/02-ficha-donde-atiendo.png` |
| Editor `/my-account/edit` | **6** — las mismas menos **Actividad** | `evidencia/antes/03-editor-perfil-medico.png` |

Lo que se ve, y que importa para lo que viene:

- **La ficha tiene un solo botón sólo-icono propio visible**: el lápiz de «Editar», arriba a la
  derecha de la tarjeta. Al lado del título hay un segundo botón sólo-icono —el acceso a «Mis
  organizaciones»— que el corte trae de `f9f259b3`. Los dos son C-06 y los dos son míos.
- **Las especialidades ya se pintan como fichas** («Cardiología», «Medicina Interna») en
  «Datos personales». Es una de las formas que H3 tiene que unificar: el inventario de H1.S3 se
  escribe contra esto, no contra una suposición.
- **«Cómo atendés» vive dentro de «Dónde atiendo»**, no suelto. C-01 pide sacarlo: la captura
  previa es la que después va a demostrar dónde fueron a parar esos dos datos.
- El editor tiene **un solo** «Guardar cambios» al pie, no uno por tarjeta.

### HALL-I6 — `alv-perfil-medico.spec.ts` estaba roto desde antes, y no sólo por la API

Al ir a cerrar H2.S3.M5 se ejecutó el escenario del spec **paso a paso sobre la pantalla**, con
los mismos selectores y el mismo orden. Ahí aparecieron dos defectos que no tienen que ver con
el cambio de acciones y que lo habrían hecho fallar **aunque la API estuviera viva**:

1. **Iba a la pantalla equivocada.** `RUTA_PERFIL` era `/my-account`, la ficha. La ficha monta
   `app-work-history` dos veces y las dos con `secciones="historial"`
   (`practitioner-profile-view.html:590` y `:1141`), así que su bloque «Dónde atiendo» —el que
   lleva `data-testid="sedes-propias"`— **no se renderiza ahí**. El único montaje con
   `secciones="consultorios"` es el del editor (`practitioner-profile-edit.html:325`).
2. **Abría la pestaña equivocada.** El respaldo de `seccionDeSedes` hacía clic en
   «Trayectoria». Medido en el navegador: con «Trayectoria» abierta hay `app-work-history` pero
   `sedes-propias` sigue en 0. La sección vive en la pestaña **«Dónde atiendo»** del editor, y
   el panel de una pestaña inactiva no está en el DOM.

Los dos se corrigieron y la corrección **se verificó corriendo cada paso**: `10/10`, con la
cadena nueva ejercida sobre la sede que ya estaba y sobre una recién cargada.

**Lo que sigue sin poder ejecutarse, y por qué.** Dos pasos del spec no son de pantalla: el alta
del profesional de prueba (`POST /iam/auth/register-practitioner`) y la comprobación de que la
sede sobrevive a recargar. Los dos existen para probar que **el servidor** guardó, y esa es toda
su razón de ser: sustituirlos por datos de maqueta convertiría el spec en lo contrario de lo que
declara su cabecera —«todo contra la API viva»— y lo dejaría pasando en verde sin probar nada.
Por eso no se tocan. Esa condición **es del archivo, no del cambio**: está en el corte
`68dcb562` palabra por palabra (`test.skip(!viva, …)`), y el cambio de este turno sólo tocó las
cuatro líneas del retiro.

**Tercera cosa medida, que no es un defecto sino una regla del producto:** el consultorio propio
es **uno por persona** (`work-history.html:126` lo explica: `POST /practitioners/me/sites` crea
o reutiliza la práctica personal). Con uno cargado, el botón de alta no existe y en su lugar va
`sede-propia-unica`. El spec arranca de un profesional recién creado, así que para él el botón
está; para ejecutarlo acá hubo que retirar primero y cargar después — los mismos pasos, en el
orden que la pantalla permite.

### HALL-I4 — la premisa de H5 está vencida en el propio corte del encargo

El encargo dice, en su línea 151:

> «El editor tiene 4 pestañas contra las 6 de la ficha (`pestanas-del-perfil-medico.ts:105`…)»

Medido contra `68dcb562`, que es el corte: **la ficha tiene 7 y el editor 6.** La diferencia no
es de dos pestañas sino de una, y esa una es **«Actividad»**.

Los dos commits que lo cambiaron son **anteriores al corte**, así que no es que el encargo
mirara una foto vieja del repo: miraba una foto vieja de un repo que ya había avanzado.

```text
$ git merge-base --is-ancestor 0aa860a6 68dcb562 && echo ancestro
ancestro        # feat(perfil médico): datos de facturación con NIT …  (2026-09-19)
$ git merge-base --is-ancestor f9f259b3 68dcb562 && echo ancestro
ancestro        # «Mis organizaciones»: el acceso pasa a botón de ícono …  (2026-09-19)
```

**Por qué cambia el trabajo, y no sólo el número.** H5.S1.M1 pide «resolver las dos ausencias».
Queda una, y es justamente la que la ambigüedad **Q-I1** del propio encargo dice que **no** se
resuelve agregándola: «Actividad» son contadores calculados, y un contador editable es un dato
inventado. O sea que H5.S1.M1 no tiene código que escribir: tiene una declaración que escribir,
y el comentario del archivo —que ya explica por qué faltaban dos— hay que **actualizarlo**, que
es lo que el DoD pide y lo que evita que alguien lea mañana un motivo que dejó de ser cierto.
