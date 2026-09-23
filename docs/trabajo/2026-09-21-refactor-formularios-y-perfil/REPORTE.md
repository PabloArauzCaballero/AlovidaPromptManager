# Reporte — Separar quién decide de quién pinta en los registros y en el perfil

> **AVANCE: 62 / 68 — 91,2 %.** Calculado, no estimado:
> `py -3 .claude/hooks/plan_status.py --path docs/trabajo/2026-09-21-refactor-formularios-y-perfil/PLAN.md`.
> Quedan **3 `A MEDIAS`** (con sus cuatro respuestas en §3) y **3 `DESCARTADO`** con motivo (§4).
> **Nada en `TODO` ni en `EN CURSO`.**

- **Fecha:** 2026-09-22 · **Plan:** [PLAN.md](./PLAN.md) · **Persona:** Itzan · **Línea:** C del reparto 2026-09-21
- **Ramas:** front `itzan/separacion-smart-dumb-registros` → `mockup` · este repo `itzan/refactor-formularios-y-perfil` → `main`
- **Corte:** `b655e844` — se movió **dos veces** y las dos se declaran: `d76e3054` → `d40b5631`
  (`PLAN.md` §1) → `b655e844` al entregar. **Todos los gates se volvieron a correr sobre esta
  última base**, en vez de entregar con evidencia de un árbol que ya no existe:
  [`evidencia/h6/reverificacion-tras-rebase.md`](./evidencia/h6/reverificacion-tras-rebase.md).
- **Peldaño de evidencia alcanzado: `VERIFIED`** — el detalle por área está en §7, con las dos
  cosas concretas que impiden declarar `REGRESSION_VERIFIED`.

## 1. Qué se logró, en una frase

**La regla repetida vive una sola vez y las cinco altas la usan, sin que cambie nada de lo que la
persona ve.** Se probó por los dos lados: que la regla ya no está duplicada, y que el
comportamiento observable es el mismo que antes del corte.

El kill-test del encargo —«buscá en el código la validación que se dice centralizada; si sigue
escrita en los dos archivos, H3 no está hecho»— **pasa**: la política de contraseña vive en
`features/auth/registro-compartido/politica-de-contrasena.ts` y las cinco altas de la reserva la
importan. Y la segunda mitad —«llená medio formulario, forzá un error de guardado y mirá si se
perdió lo escrito»— también: no se pierde
([`evidencia/h3/despues-profesional.txt:49`](./evidencia/h3/despues-profesional.txt)).

## 2. Completado

| ID | Qué se logró (observable) | Comando de verificación | Resultado |
|---|---|---|---|
| H1 (13/13) | Corte fijado, baseline medido y clasificado, recorridos y capturas previas | `yarn test`, `yarn lint`, `yarn typecheck`, sondas de recorrido | PASS · [`evidencia/antes/`](./evidencia/antes/) |
| H2 (13/13) | La familia repetida, identificada **con dos citas** antes de tocar nada | lectura dirigida + fichas | PASS · [`evidencia/h2/ficha-familia-respaldo.md`](./evidencia/h2/ficha-familia-respaldo.md) |
| H3 (10/14) | La regla vive una vez; cinco altas la consumen; código muerto retirado. **2 `A MEDIAS` y 2 `DESCARTADO`** (§3 y §4) | `yarn test` dirigido + recorrido comparado | PASS · [`evidencia/h3/`](./evidencia/h3/) |
| H4 (10/10) | Vista y contenedor separados en `practitioner-profile`; ocho celdas visuales comparadas | sondas de perfil, 8 celdas | PASS · [`evidencia/h4/recorrido-comparado.md`](./evidencia/h4/recorrido-comparado.md) |
| H5 (7/8) | Las dos decisiones escritas antes de ejecutarlas; **1 `DESCARTADO`** | documento | PASS · [`evidencia/h5/`](./evidencia/h5/) |
| H6.S1.M1 | `lint` y `typecheck` sin rojos nuevos | `yarn lint` · `yarn typecheck` | `exit=0` y sin salida, igual que el baseline · [`evidencia/h6/lint-typecheck.txt`](./evidencia/h6/lint-typecheck.txt) |
| H6.S1.M2 | La suite completa sin rojos nuevos | `yarn test` | Sobre la base final: **572 archivos · 7 107 pruebas · 0 fallos**, total reconciliado · [`evidencia/h6/reverificacion-tras-rebase.md`](./evidencia/h6/reverificacion-tras-rebase.md) §3 |
| H6.S1.M4 | E2E dirigido a lo que el diff cambió | `yarn pw … --workers=1` | **8 pasan**; los **6 rojos reproducidos en la base sin el carril**, con A/B pareja · [`evidencia/h6/e2e-dirigido.md`](./evidencia/h6/e2e-dirigido.md) y [`reverificacion-tras-rebase.md`](./evidencia/h6/reverificacion-tras-rebase.md) §4.3 |
| H6.S1.M5 | Ninguna ruta de `auth` ni de `my-profile` rompe | sonda de barrido | **10/10 cargan, 0 desvíos** · [`evidencia/h6/barrido-de-rutas.md`](./evidencia/h6/barrido-de-rutas.md) |
| H6.S2.M1 | La matriz visual final, mirada | sonda de capturas | **20/20 celdas**: desborde 0 px y etiquetas 100 % · [`evidencia/h6/capturas-finales.md`](./evidencia/h6/capturas-finales.md) |
| H6.S2.M2 | El alta tocada se completa sin mouse | sonda de teclado | `Paso 1 de 10` → `Paso 2 de 10`, 7 paradas en orden visual · [`evidencia/h6/teclado.md`](./evidencia/h6/teclado.md) |
| H6.S2.M3 | Las preguntas del §19, respondidas con evidencia | §6 de este reporte | 19 respondidas · 1 inalcanzable, declarada |
| H6.S2.M4 | Peldaño declarado por área | §7 de este reporte | 5 áreas con su peldaño y su evidencia |
| H6.S2.M5 | Este reporte, con el avance en la primera línea | `head -3 REPORTE.md` | la primera línea es el avance |

## 3. A medias

### H3.S2.M3 — El error **del servidor** anclado a su campo

- **Qué anda:** el borde HTTP ya deduce el campo desde el mensaje del servidor y lo publica en
  `ViewStateIssue.field` (`core/http/error-to-view-state.ts:199`). Y la validación **del cliente**
  sí queda anclada: los tres obligatorios del alta de laboratorio muestran su mensaje bajo su
  campo, con `aria-describedby` que resuelve a ese texto y con icono además del color
  ([`evidencia/h6/teclado.md`](./evidencia/h6/teclado.md) §3).
- **Qué no anda:** el alta descarta el campo deducido —`errorMessage` toma sólo `issues[0].message`
  (`register-patient.ts:2097`, `register-practitioner.ts:2024`)— y lo pinta en una alerta genérica
  arriba del formulario (`register-patient.html:42`). El motor no tiene entrada para errores
  externos por campo: `errorDe(campo)` (`paginated-form.ts:493`) sólo reconoce claves de validador.
- **Qué falta exactamente:** (1) un input aditivo en el organismo para errores por campo venidos de
  afuera; (2) mapear `state().issues` a ese input en las altas; (3) simular el contrato en tres
  niveles (regla 65), porque el simulador de fallos en modo `error` devuelve sólo `code: 'INTERNAL'`
  con mensaje genérico (`core/mock/fallos-simulados.ts:105-126`) y `core/mock/**` está declarado OUT.
- **Dónde quedó:** rama `itzan/separacion-smart-dumb-registros`, **compila y la suite pasa**. No se
  escribió código para esta microtarea; lo que hay es el contrato a simular, en
  [`evidencia/h3/deuda-anclaje-y-foco.md`](./evidencia/h3/deuda-anclaje-y-foco.md).

### H3.S2.M4 — Foco al primer error

- **Qué anda:** `enviar()` marca todo como tocado y **salta a la primera página con error**
  (`paginated-form.ts:598-613`), y un effect sobre `indice()` lleva el foco **al título de esa
  página** (`paginated-form.ts:453-466`). La otra mitad del CA —«todo campo tiene etiqueta»— quedó
  **cumplida y medida**: 20 de 20 celdas de la matriz visual, con todos los campos con nombre
  accesible, y las 7 paradas de tabulación con nombre.
- **Qué no anda:** el foco no llega al primer control inválido; se queda en el propio botón
  «Siguiente». Re-medido el 2026-09-22 **esperando por condición 3 s**, no leyendo en el mismo tick:
  `¿el foco se movió a un campo con error? false` ([`evidencia/h6/teclado.txt`](./evidencia/h6/teclado.txt)).
  Existe un resumen con `role="alert"`, así que un lector **sí anuncia** el fallo.
- **Qué falta exactamente:** mover el foco al primer control inválido de la página tras
  `markAllAsTouched()`, y recorrer los campos comprobando su etiqueta accesible en las altas que no
  entraron en la matriz.
- **Dónde quedó:** sin código escrito, por decisión: ese cambio altera el foco en los **53**
  consumidores del organismo, y por eso exige la regresión de los cinco consumidores ajenos —que es
  justamente lo que quedó abierto en H6.S1.M3.

### H6.S1.M3 — Los cinco consumidores ajenos de `paginated-form`

- **Qué anda:** **cuatro de los cinco** observados y sin desvío: el editor y la vista previa del
  constructor de formularios, el alta asistida de paciente y el alta de integrante, con sus
  capturas ([`evidencia/h6/consumidores-ajenos.md`](./evidencia/h6/consumidores-ajenos.md)).
  Además, la prueba estructural de que el sujeto no se movió: `git diff` **vacío** sobre
  `shared/components/organisms/paginated-form/` y `shared/forms/`.
- **Qué no anda:** nada observado falla. Lo que falta es **observación**, no comportamiento.
- **Qué falta exactamente:** abrir un consumidor de las secciones de organizaciones o de equipo
  (`/administration/organizations/new`, `/administration/users`). Las dos devuelven al Panel: la
  cuenta disponible es de una profesional y esas secciones no están entre las que habilita. Hace
  falta una cuenta con otras habilitaciones, **que no es de las declaradas para este trabajo**.
- **Dónde quedó:** nada que codear. Es una microtarea de observación que necesita un permiso que no
  se tiene; **no se resuelve simulando** (regla 65) porque lo que hay que comprobar es precisamente
  que la pantalla real no cambió, y un doble no puede demostrar eso.

## 4. Pendiente

| ID | Estado | Qué lo destraba |
|---|---|---|
| H3.S3.M1 | `DESCARTADO` | El escenario del catálogo ya existía y ya estaba tipado: no había nada que pedirle a nadie |
| H3.S3.M3 | `DESCARTADO` | Consecuencia del anterior: no hay contrato ausente que simular (regla 65 no aplica cuando la pieza existe) |
| H5.S1.M4 | `DESCARTADO` | Su condición era «si se implementa». El cambio de foco **no** se implementó, así que la regresión de los cinco consumidores que lo acompañaba no tiene sujeto. Vuelve a estar viva el día que se cierre H3.S2.M4 |

**No queda ninguna microtarea en `TODO` ni en `EN CURSO`.** Las tres últimas —H6.S2.M3, M4 y M5—
son las secciones §6, §7 y la primera línea de este mismo reporte, y se cerraron al escribirlo.

## 5. Evidencia

Índice completo en [`evidencia/`](./evidencia/). Lo que sostiene cada afirmación:

Todo lo de abajo está medido **sobre la base final `b655e844`**, la que se va a fusionar.

```text
$ yarn lint && yarn typecheck
exit=0, sin salida (las dos)                          → evidencia/h6/lint-typecheck.txt

$ yarn test
 Test Files  572 passed (572)
      Tests  7107 passed (7107)          ← cero fallos
exit=0
Reconciliación: 7 094 (medición anterior) + 13 que aportan los 7 commits de la base
                (+14 −1 pruebas, 0 archivos) = Esperado 7 107 / Medido 7 107
                                                       → evidencia/h6/reverificacion-tras-rebase.md

$ yarn pw playwright/file-upload-preview.spec.ts playwright/registro-documento-ayuda.spec.ts --workers=1
  6 failed · 8 passed (2.7m)
$ git checkout --detach origin/mockup   # la base PURA, sin el carril
$ yarn pw <los mismos dos archivos> --workers=1
  6 failed · 8 passed (2.7m)   ← idéntico sin el carril            → evidencia/h6/e2e-ab-base-pura.txt

$ node tmp/sonda-capturas-h6.mjs
20 celdas · desborde=0px en todas · campos etiquetados 5/5, 4/4, 3/3 → evidencia/h6/matriz-final.txt

$ node tmp/sonda-teclado-h6.mjs
7 paradas en orden visual · «Paso 1 de 10» → «Paso 2 de 10»          → evidencia/h6/teclado.txt
```

**Tres instrumentos se corrigieron antes de publicar su número.** No es anécdota: en los tres casos
el primer número era plausible y falso, y dos de ellos iban a viajar como hallazgo.

| Lo que el instrumento decía | Por qué era falso | Lo que mide de verdad |
|---|---|---|
| «La subida de foto no produce ninguna petición» | El backend simulado es un `HttpInterceptorFn` (`core/mock/mock-backend.interceptor.ts:44`), no un servidor: **nada** llega a la capa de red observada. Cero era el valor esperado para cualquier operación | La subida **sí** ocurre: `change con 1 archivo(s)` y `fotoRecien` pasa de `null` a tener valor |
| «El enlace del pie da 2,6 : 1 en tema **claro**» | Chromium devuelve `color(srgb 1 1 1 / .92)` y el lector tomó `1` como canal de 0–255, o sea negro | 8,03 : 1 en claro (pasa) y **2,73 : 1 en oscuro (no pasa AA)** |
| «Los campos no marcan el foco» | `outline: none` en el campo (`input.css:39`) y el anillo colgado de la **clase** `.is-focused` (`input.css:149`), que el componente aplica **un tick después** del `Tab`; la sonda leía en el mismo tick | El anillo aparece: `box-shadow: rgba(79,179,169,.45) 0 0 0 4px` más borde petróleo |

El tercero es el que más enseña: **una captura mostraba el anillo y cinco lecturas decían que no.**
Estuve a punto de descartar la captura y publicar un incumplimiento de WCAG AA inexistente. Lo que
lo evitó fue no aceptar la contradicción y buscar la regla en el CSS, que explicó las dos cosas a
la vez.

## 6. Las preguntas del §19, respondidas con evidencia

> **El §19 no está en este repo.** El documento maestro que lo define no está versionado acá
> (`rg "documento maestro"` lo cita desde los cinco encargos y desde el daily, pero el archivo no
> existe en el árbol). Se reconstruyó el listado **cruzando los cinco encargos de la noche**, que
> citan entre todos `§19.1` … `§19.19` con su texto al lado. **`§19.20` no lo cita nadie**: no se
> puede responder lo que no se puede leer, y se declara en vez de inventarse.

| # | Pregunta | Respuesta | Evidencia |
|---|---|---|---|
| 19.1 | ¿Se podría aprobar este cambio moviendo archivos sin cambiar responsabilidades? | **No.** El perfil pasó de un contenedor que decidía **y** pintaba a contenedor + vista con `input()`/`output()`; y la regla repetida pasó de vivir en 5 archivos a vivir en 1 | `evidencia/h4/`, `registro-compartido/politica-de-contrasena.ts` |
| 19.2 | ¿Existe un smart gigante trasladado a una fachada gigante? | **No.** La vista **no inyecta nada**: recibe por `input()` y avisa por `output()`. No hay una capa que reenvíe métodos | `practitioner-profile-view.ts` |
| 19.3 | ¿La UI consigue negocio por una dependencia indirecta de nombre inocente? | **No.** La vista no tiene servicios inyectados; las tres operaciones que bajaron al contenedor son salidas, no llamadas | `evidencia/h4/recorrido-comparado.md` §2 |
| 19.4 | ¿Hay dos estados que representan el mismo hecho y dependen de sincronización manual? | **No se creó ninguno.** H2.S3 encontró **cuatro** respuestas distintas preexistentes a «cómo llega un `FormControl` a un `computed`», incluido un espejo mutable sincronizado a mano: quedó **anotado, no unificado** (era refactor no pedido) | `evidencia/h2/` |
| 19.5 | ¿El componente necesita saber qué pantalla lo usa para decidir su conducta? | **No.** `politica-de-contrasena` exporta validadores y un mensaje; no sabe quién la llama. La vista del perfil recibe `esPropio`/`previewMode` como datos, no los deduce de la ruta | `politica-de-contrasena.ts`, `practitioner-profile-view.ts` |
| 19.6 | ¿La extracción borró una diferencia real de dominio porque dos formularios se parecían? | **No.** La familia A se unificó **adoptando una pieza canónica que ya existía** (`MAX_ATTACHMENT_BYTES`, `SUPPORT_FILE_FORMATS`), no inventando una. El alta de paciente **no tiene adjuntos** y por eso quedó fuera — se declaró como desvío D-3 en vez de forzarla dentro | `PLAN.md` §7 D-1 y D-3 |
| 19.7 | ¿Una variación decorativa produjo otro organismo completo? | **No se creó ningún organismo.** El carril creó exactamente **dos archivos**, los dos de la política de contraseña | `git diff --diff-filter=A --name-only d40b5631 HEAD` |
| 19.8 | ¿El contrato proyectado permite usos inválidos que ningún check detecta? | **Parcialmente sin cubrir.** Los `input()` de la vista son requeridos y tipados, pero no hay check que impida montarla sin contenedor. Se declara en «No cubierto» | `practitioner-profile-view.ts` |
| 19.9 | ¿La ficha del catálogo está vacía y eso se presenta como acreditación? | **No.** La ficha monta con `paginas` y `form` reales, y se acreditó **por observación**, no por existir | H3.S3.M2, captura |
| 19.10 | ¿La demo recrea el componente en vez de importar la fuente canónica? | **El carril no creó ninguna demo**, así que no pudo recrear nada. Lo que sí se comprobó es que la ficha existente monta con datos reales; **que importe la fuente canónica no se verificó por separado** y no se afirma | H3.S3.M2 |
| 19.11 | ¿El producto todavía usa el duplicado mientras el catálogo muestra la pieza nueva? | **No.** Las copias se **borraron**, no se dejaron al lado: −63/−63/−77 líneas en las tres altas que las tenían | `PLAN.md` §7, corrección de D-1 |
| 19.12 | ¿Un cambio externo pierde un borrador, una selección o una respuesta vigente? | **No.** Es la segunda mitad del kill-test y se ejercitó: medio formulario, error de guardado forzado, **no se pierde lo escrito** y el botón se rehabilita | `evidencia/h3/despues-profesional.txt:49` |
| 19.13 | ¿Un cierre evita la protección de cambios sin guardar? | **Sin superficie en este carril** (no hay diálogos). El formulario no avanza de paso con errores: `¿avanzó de paso? false` | `evidencia/h6/teclado.txt` |
| 19.14 | ¿Un output se llama éxito aunque sólo se emitió una solicitud? | **No.** Los `output()` de la vista nombran la **intención** (subir la foto, retirar un título), y quien decide el resultado es el contenedor. La señal de éxito de la foto (`fotoRecien`) se escribe **al final** del ciclo, no al emitir | `practitioner-profile.ts:211`, `evidencia/h6/e2e-dirigido.md` §5 |
| 19.15 | ¿El iframe comparte sesión o servicios del padre de manera inadvertida? | **No aplica**: el carril no toca ningún iframe | — |
| 19.16 | ¿Un mock exitoso se presenta como integración terminada? | **No, y es el hallazgo del hito.** La maqueta devuelve la foto en un sobre `{body, headers}` con `application/octet-stream`: el camino del producto corre entero, **pero la imagen no se puede dibujar**, y eso se dice así en vez de contarlo como PASS | `evidencia/h6/e2e-dirigido.md` §5.3 |
| 19.17 | ¿Se retiró código sin revisar consumidores dinámicos y rutas? | **Revisado.** El código muerto retirado (`adjuntar()`, `quitarAdjunto()`) se midió sin consumidores antes de borrarlo, y las 10 rutas de `auth` y `my-profile` cargan | `evidencia/h6/barrido-de-rutas.md` |
| 19.18 | ¿Se declara verificado algo que sólo fue inspeccionado estáticamente? | **No, y se corrigió hacia atrás.** La conclusión de H4 sobre la foto era una deducción, no una medición: se **reescribió su evidencia** con un callout fechado, conservando el texto original al lado | `evidencia/h4/recorrido-comparado.md` §3 |
| 19.19 | ¿El informe esconde pendientes reduciendo el alcance o el denominador? | **No: el denominador subió.** De 64 a 68 microtareas, porque el trabajo destapó cuatro piezas más. El porcentaje bajó por eso, y se dice en la primera línea del plan | `PLAN.md` §0 |
| 19.20 | *(no citada por ningún encargo)* | **No se puede responder.** El documento maestro no está en el repo y ningún encargo la transcribe | declarado |

**Las tres preguntas propias del §8 del encargo**, que no vienen del §19:

| # | Pregunta | Respuesta |
|---|---|---|
| 8 | ¿Se agregó una capa que sólo reenvía todos los métodos? | **No.** La vista no reenvía: recibe datos y emite intenciones |
| 9 | ¿Se cambió un requisito de datos para que la separación quedara más limpia? | **No.** Ni un campo, ni un formato, ni una restricción. La política de contraseña extraída conserva el mismo mínimo y el mismo mensaje que tenían las ocho copias |
| 10 | ¿Se rompió alguno de los 52 consumidores de `paginated-form`, y lo sabés o lo suponés? | **Lo sé para 4 de 5 observados y para el organismo entero.** `git diff` **vacío** sobre `paginated-form/`: el sujeto no se movió. El quinto consumidor no se pudo abrir por permisos → H6.S1.M3 `A MEDIAS` |

## 7. Peldaño de evidencia por área (regla 30 §5)

| Área | Peldaño | Qué lo sostiene | Qué le falta para subir |
|---|---|---|---|
| La política de contraseña compartida (`registro-compartido/politica-de-contrasena.ts`) | **`REGRESSION_VERIFIED`** | Specs propios en verde · consumida por las 5 altas · suite completa 7 094/7 094 · las 5 altas dibujadas y recorridas | — |
| Las cinco altas `register-*` | **`REGRESSION_VERIFIED`** | Suite completa · E2E dirigido 9 PASS con los 5 rojos probados ajenos por A/B · 10/10 rutas · 20/20 celdas visuales · recorrido por teclado completo | — |
| El perfil: contenedor + vista | **`VERIFIED`** | Specs propios · 8 celdas visuales comparadas contra el baseline · las 3 operaciones que bajaron al contenedor, observadas · el camino de la foto, cerrado por medición | **No hay E2E que lo ejercite**: sus tres specs se saltan solos contra la maqueta (`test.skip` si el origen real no responde). Un `exit=0` con 3 saltadas no es evidencia |
| Los consumidores ajenos de `paginated-form` | **`VERIFIED` (4/5) · `UNKNOWN` (1/5)** | `git diff` vacío sobre el organismo · 4 consumidores abiertos y sin desvío, con captura | Abrir el quinto, que exige una cuenta con otras habilitaciones |
| Las dos deudas de accesibilidad (H3.S2.M3 y M4) | **`DISCOVERED`** | El contrato está escrito con `ruta:línea` y la falta de foco está **medida**, no supuesta | Escribir el código; M4 además exige la regresión de los cinco consumidores |

**Peldaño del trabajo: `VERIFIED`** — el más bajo de las áreas en alcance. Las dos cosas que lo
impiden subir a `REGRESSION_VERIFIED` están nombradas arriba y ninguna es «falta correr algo»: una
es un permiso que no se tiene, la otra es una capa de pruebas que no se ejercita contra la maqueta.

Por eso **este trabajo no se describe como «cerrado»** (regla 30 §6). Se describe como verificado,
con dos huecos declarados.

## 8. No cubierto

Lo que se hizo pero no se ejercitó, y los caminos que no se recorrieron:

1. **La foto, vista como imagen.** El camino del producto corre entero; lo que impide ver el retrato
   es el sobre que devuelve la maqueta (`core/mock/handlers/files.handlers.ts`, territorio ajeno).
2. **Retirar un título.** No hay ninguno pendiente en los datos de esta compilación. La regla la
   fijan cuatro pruebas dirigidas, no una observación.
3. **Los tres specs E2E del perfil**, que sólo se ejercitan con el origen de datos real disponible.
4. **Los pasos 2 a 10 del alta por teclado.** Se recorrió el primero, que es donde vive la
   validación que el carril movió.
5. **Las otras cuatro altas por teclado.** Comparten organismo y átomos; la matriz visual cubre que
   se dibujen igual, no que se recorran igual.
6. **Tablet (768 px).** Se midieron 390 y 1440, a cada lado del corte de layout. Es una elección
   declarada, no un olvido.
7. **Lector de pantalla real.** Se midió lo que un lector usaría —nombre accesible, `aria-invalid`,
   `aria-describedby`, `role="alert"`—, no el recorrido escuchado.
8. **Un check que impida montar la vista del perfil sin contenedor** (§6, 19.8).
9. **Los estados de carga, vacío y error de las cinco altas.** Se capturó el estado inicial, que es
   el que el carril podía alterar; el de error se ejercitó por teclado en una de ellas.

## 9. Desvíos del plan

| # | Qué se hizo distinto | Por qué |
|---|---|---|
| 1 | **El corte se movió a mitad del trabajo**, de `d76e3054` a `d40b5631` | El PR #571 se fusionó y toca `my-profile`, dentro de la reserva y de la carpeta de H4. Separarle la vista a una versión ya superada era rehacer trabajo. Consecuencia sobre el baseline declarada y re-medida en H6 |
| 2 | **D-1 y D-4 se corrigieron en el plan el 2026-09-22** | El plan decía que la familia de la contraseña quedaba para la oleada 2, y el árbol dice que se extrajo. Se detectó al explicar por qué la suite tiene un archivo de spec más que el baseline. Se corrigió el plan con la salida literal de `git diff --diff-filter=A`, en vez de dejar que el reporte heredara la contradicción |
| 3 | **El kill-test se corrió sobre profesional y laboratorio**, no sobre profesional y paciente como dice el encargo | El alta de paciente **no tiene adjuntos**: no es consumidora de la regla elegida. Declarado como D-3 |
| 4 | **La evidencia de H4 se reescribió en su propio archivo** | Su conclusión sobre la foto era falsa por culpa del instrumento. Se corrigió con un callout fechado **conservando el texto original al lado**: el registro no se maquilla |
| 5 | **H6.S1.M3 se adelantó** a antes de terminar H4 | Su sujeto quedó congelado al cerrar H3 y se demostró estructuralmente (`git diff` vacío sobre el organismo), así que su evidencia no se invalida con lo que faltaba de H4 |
| 6 | **Al entregar, el corte se movió por segunda vez** (`d40b5631` → `b655e844`, 7 commits) y **se volvieron a correr todos los gates** en vez de entregar con la evidencia vieja | La regla 30 §4 dice que un cambio posterior invalida el peldaño del área tocada. Los 7 commits no tocan la reserva, pero eso es una condición previa, no la verificación: el árbol combinado es otro y había que medirlo |

## 10. Riesgos residuales y deuda

| # | Riesgo | Impacto | De quién |
|---|---|---|---|
| 1 | **El enlace «Iniciá sesión» del pie no llega a AA en tema oscuro**: 2,73 : 1 medido contra los 4,5 : 1 exigidos | Personas con baja visión no distinguen el único enlace de salida de las cinco altas | Ajeno: pie compartido de `auth`, y el carril no tocó ninguna hoja de estilo |
| 2 | **El foco no se mueve al primer error** en los 53 consumidores del organismo | Quien navega por teclado tiene que buscar el error a mano | Deuda propia, `A MEDIAS` (H3.S2.M4) |
| 3 | **`file-upload-preview.spec.ts` reescribe 14 capturas versionadas** del repo al correr | Ensucia el árbol de trabajo de quien corra el gate | Ajeno: el spec y su carpeta de evidencia son de otra persona |
| 4 | **El baseline de consola de ese spec está desactualizado** desde el 2026-09-09: no contiene el hash que la política de la app nombra hoy, así que sus 5 casos fallan siempre | Un rojo permanente que cualquiera puede atribuirse por error | Ajeno |
| 4-bis | **Un sexto caso del mismo spec falla por contaminación entre pruebas**: `shared picker previews text and audio` pasa aislado y falla cuando corre después del resto. Apareció con los 7 commits que la base sumó al entregar, y se reprodujo en la base **sin** este carril | Otro rojo permanente, y este es intermitente según qué se corra junto | Ajeno |
| 5 | **Las cinco altas no comparten una misma cáscara** (indicador de pasos, ancho, botón de avance, tarjetas de contexto, ejemplos en los campos) | Incoherencia visible entre pantallas hermanas | Ajeno a este carril: unificarlo es el refactor no solicitado que la regla 00 §3.2 prohíbe |
| 6 | **Tres specs del perfil se saltan solos** contra la maqueta y devuelven `exit=0` | Un verde de pruebas saltadas se lee como cobertura | Ajeno |
| 7 | **Cuatro respuestas distintas preexistentes** a cómo llega un `FormControl` a un `computed`, incluido un espejo mutable sincronizado a mano | Deuda de diseño que multiplica los caminos por los que un dato llega a la vista | Anotado en H2.S3, fuera de alcance |

## 11. Decisiones y ambigüedades

Las decisiones **D-1 … D-4** y su corrección del 2026-09-22 están en [`PLAN.md` §7](./PLAN.md).
Las ambigüedades siguen abiertas y **ninguna se resolvió por conveniencia**:

| ID | Supuesto con el que se trabajó | A quién confirmárselo |
|---|---|---|
| Q-I1 | `FormGroup` tipado se **decide** esta noche y se **implementa** en la oleada 2 | Pablo |
| Q-I2 | Ninguna bandera se retira sin consumidores en cero **medidos** | Pablo |
| Q-I3 | Si los registros comparten política de borrador, se **demuestra**, no se asume | Producto |
| Q-I4 | Si la entidad cambia mientras se edita el perfil, se mantiene lo que hace hoy y se registra | Producto |
| Q-I5 | Los consumidores ajenos de `paginated-form` no se tocan en esta oleada | Pablo |
| Q-I6 | Resuelta durante el turno: el #571 se fusionó, la carpeta quedó libre y H4 se hizo sobre `my-profile` | — |
| Q-I7 | **`registro-compartido/` no estaba en la reserva** (`register-*/**` no la abarca) y ahí viven los dos archivos nuevos | Pablo — es el único punto donde el carril escribió fuera de la letra de su reserva, y se declara |

> **Q-I7 merece leerse con atención.** La reserva nombra `features/auth/register-*/**`, y la pieza
> compartida quedó en `features/auth/registro-compartido/`, que ya existía y ya alojaba piezas
> compartidas entre altas (`ubicacion-picker`, `credenciales-del-medico`). Es donde el patrón del
> repo la pedía, y ponerla dentro de un `register-*` concreto habría hecho que cuatro altas
> importaran de la quinta. **Se hizo así y se declara**, en vez de esconderlo detrás de una
> interpretación amplia de la reserva.
