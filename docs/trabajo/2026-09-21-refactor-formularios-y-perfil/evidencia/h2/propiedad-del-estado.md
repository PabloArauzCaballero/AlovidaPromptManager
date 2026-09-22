# H2.S3 — La propiedad del estado de los dos registros, escrita

Inventario del estado mutable de los dos contenedores que H2.S1 clasificó
(`register-practitioner` y `register-patient`), con las cinco preguntas del §4 del pedido
respondidas por familia, los derivados que hoy son copia mutable, y el barrido de `effect`.

Medido sobre el corte `d40b5631`. Las líneas citadas son de `HEAD` (`caaf77dd`); el carril sólo
tocó la política de contraseña, así que ninguna de las declaraciones de acá se movió — se verifica
con `git diff d40b5631..HEAD --stat`.

## 0. El conteo

| Contenedor | Signals mutables | Derivados puros (`computed` / `toSignal`) | Estado fuera del grafo de signals |
|---|---|---|---|
| `register-practitioner.ts` | **27** | 10 | — |
| `register-patient.ts` | **34** | 20 | 1 (`direccionSembrada`, `WeakMap`, `:683`) |

Comando:

```text
$ grep -nE 'readonly [a-zA-Z]+ = (signal|computed)|= signal<' src/app/features/auth/register-*/register-*.ts
```

El conteo importa por una razón: **61 estados mutables en dos archivos** es lo que hace que la
pregunta «¿de quién es este dato?» no tenga hoy una respuesta escrita en ninguna parte.

## 1. Las cinco preguntas, por familia

Las familias siguen las filas del §4 del pedido. Cada fila responde las cinco: **quién lo crea ·
quién puede cambiarlo · quién lo lee · qué lo invalida · cuándo se destruye.**

### F1 — Catálogos remotos y su bandera de caída

**Miembros (14 signals, 7 pares):** `opcionesDepartamento`/`catalogoDepartamentosCaido`
(`practitioner:1312-1313`, `patient:943-944`) · `ramasMunicipios`/`catalogoMunicipiosCaido`
(`practitioner:1324-1325`, `patient:974-975`) · `opcionesEspecialidad`/`catalogoEspecialidadesCaido`
(`practitioner:1335-1338`) · `opcionesOcupacion`/`catalogoOcupacionesCaido` (`patient:950-951`) ·
`opcionesEmpresa`/`catalogoEmpresasCaido` (`patient:961-962`) ·
`opcionesParentesco`/`catalogoParentescosCaido` (`patient:985-986`) ·
`catalogoAseguradoras`/`catalogoAseguradorasCaido` (`patient:1837-1838`).

| Pregunta | Respuesta |
|---|---|
| Quién lo crea | El contenedor, en el constructor, inicializado vacío y en `false` |
| Quién puede cambiarlo | Sólo el contenedor, en el `then`/`catch` de la llamada al cliente de terminología |
| Quién lo lee | La plantilla y los `computed` que arman las opciones de cada `select` |
| Qué lo invalida | **Nada.** No hay recarga ni reintento: lo que se trajo al montar vale toda la sesión del formulario |
| Cuándo se destruye | Con el componente |

**Veredicto §4 («una fuente canónica; resultados obsoletos no reemplazan los vigentes»): cumple a
medias.** Hay una sola fuente por catálogo y no hay carrera posible porque no hay segunda llamada.
Lo que no cumple es la forma: ver §2.1.

### F2 — Selección de una referencia (combobox con búsqueda)

**Miembros:** `tituloProfesionalElegido` (`practitioner:1359`), `busquedaTituloProfesional`
(`practitioner:1366`), `ocupacionSeleccionada` (`patient:1641`), `busquedaOcupacion`
(`patient:1621`), `empresaSeleccionada` (`patient:824`), `busquedaEmpresa` (`patient:1813`),
`municipioProfesional` (`practitioner:1115`), `municipioConsultorio` (`practitioner:1133`),
`municipioPaciente` (`patient:641`), `municipioTrabajo` (`patient:644`).

| Pregunta | Respuesta |
|---|---|
| Quién lo crea | El contenedor |
| Quién puede cambiarlo | El manejador del combobox (`elegirOcupacion`, `elegirEmpresa`), o la suscripción a `valueChanges` del control (`practitioner:2071`) |
| Quién lo lee | Los `computed` de filtrado y de «¿cuál?», y el armador del payload (`patient:2398`, `practitioner:2372`) |
| Qué lo invalida | **Depende del campo, y ahí está el problema** — ver §2.2 |
| Cuándo se destruye | Con el componente |

**Veredicto §4 («un solo dueño; identidad estable»): NO cumple.** Cuatro campos hermanos tienen
cuatro dueños distintos. Es el hallazgo principal de esta subtarea.

### F3 — Borrador del formulario

**Miembros:** `formProfesional` / `formPaciente` (los `FormGroup`), más los arreglos que crecen:
`nombresExtra` (`practitioner:1165`, `patient:1700`), `especialidadesExtra`
(`practitioner:1174`), `titulos` (`practitioner:913`).

| Pregunta | Respuesta |
|---|---|
| Quién lo crea | El contenedor, en la declaración de campo |
| Quién puede cambiarlo | La persona que escribe, vía los controles; y el contenedor al agregar o quitar una fila |
| Quién lo lee | El organismo `paginated-form` (recibe el `FormGroup` por entrada) y el armador del payload |
| Qué lo invalida | Nada durante la sesión. **La maqueta no persiste el borrador**: recargar lo pierde, y eso es lo declarado en H1 |
| Cuándo se destruye | Al navegar fuera del alta |

**Veredicto §4 («política explícita ante cambios externos y cierre»): cumple, con la política siendo
«no hay recuperación», que es una decisión declarada y no un olvido.**

### F4 — Adjuntos y foto

**Miembros:** `attachmentFiles` (`practitioner:1027`), `respaldoTituloProfesional` /
`respaldoMatricula` / `respaldoSedes` (`practitioner:928-930`), `errorAdjunto`
(`practitioner:933`), `fotoBase64` (`practitioner:1055`), `errorFoto` (`practitioner:1056`).

| Pregunta | Respuesta |
|---|---|
| Quién lo crea | El contenedor |
| Quién puede cambiarlo | El manejador del `file-input`, y el validador de formato/peso que escribe el error |
| Quién lo lee | La plantilla (vista previa y mensaje) y el armador del payload |
| Qué lo invalida | Elegir otro archivo en el mismo campo. El error se limpia al pasar la validación siguiente |
| Cuándo se destruye | Con el componente. **El `File` en memoria no se libera explícitamente** |

**Veredicto §4: cumple.** Es estado propio del contenedor y no tiene otra copia.

### F5 — Ubicación y mapa (sólo paciente)

**Miembros (12 signals):** `gpsDomicilio`/`gpsTrabajo`, `pidiendoGps`/`pidiendoGpsTrabajo`,
`direccionConfirmada`/`direccionTrabajoConfirmada`, `gpsRechazado`/`gpsTrabajoRechazado`,
`marcandoDomicilio`/`marcandoTrabajo`, `gpsDomicilioDelNavegador`/`gpsTrabajoDelNavegador`
(`patient:835-907`). En `practitioner`: `gpsDomicilio` (`:1124`), `gpsConsultorio` (`:1136`).

| Pregunta | Respuesta |
|---|---|
| Quién lo crea | El contenedor |
| Quién puede cambiarlo | El manejador del botón de GPS, la respuesta del navegador, y el clic en el mapa |
| Quién lo lee | Los `computed` `pinesDomicilio`/`pinesTrabajo` y `mapa*Abierto` (`patient:856-912`), y el payload |
| Qué lo invalida | Pedir el GPS de nuevo. Cambiar el departamento **no** invalida el pin ya puesto |
| Cuándo se destruye | Con el componente |

**Veredicto §4: cumple en propiedad, con una deuda de coherencia** — que el pin sobreviva a un
cambio de departamento es una decisión que nadie escribió. Queda anotada, no se toca (está fuera
del alcance de este carril).

### F6 — Estado del envío

**Miembros:** `state` (`practitioner:1989`, `patient:2061`), `registered` (`:1992`/`:2064`),
`verificationSent` (`patient:2065`), y los derivados `isSubmitting` y `errorMessage`.

| Pregunta | Respuesta |
|---|---|
| Quién lo crea | El contenedor |
| Quién puede cambiarlo | Sólo `enviar()` y la suscripción `limpiarElErrorAlCorregir` (`practitioner:2183`, `patient:2131`) |
| Quién lo lee | La plantilla (alerta y bloqueo del botón) y `paginated-form` vía la entrada `pending` |
| Qué lo invalida | **Cualquier cambio en el formulario**: si hay error visible, vuelve a `ready`. Es deliberado y está comentado |
| Cuándo se destruye | Con el componente |

**Veredicto §4 («la UI no inventa éxito al emitir una intención»): cumple.** `isSubmitting` y
`errorMessage` son derivaciones puras de `state`, sin copia mutable. Es el ejemplo bien hecho del
archivo, y es la referencia contra la que se miden las infracciones de §2.

### F7 — Ayuda contextual y página visible

**Miembros:** `claveVisible` (`practitioner:2012`, `patient:2085`), `ayudaVisible` (derivado).

| Pregunta | Respuesta |
|---|---|
| Quién lo crea | El contenedor |
| Quién puede cambiarlo | Sólo el manejador de `pasoVisible`, el output del organismo (`practitioner:2021`) |
| Quién lo lee | El `computed` `ayudaVisible`, que indexa el diccionario de tarjetas |
| Qué lo invalida | El propio `pasoVisible` siguiente |
| Cuándo se destruye | Con el componente |

**Veredicto §4: es una copia, y es la copia correcta.** El dueño real del paso visible es el
organismo (`paginated-form.indice`). El contenedor no puede derivarlo —no ve el signal del hijo—,
así que lo recibe por evento y lo guarda. Eso **es** el patrón datos-abajo/eventos-arriba, no su
violación. Se declara acá para que no se cuente como infracción en §2.

### F8 — Estado fuera del grafo de signals

**Miembro:** `direccionSembrada` (`patient:683`), un `WeakMap<FormControl, string>`.

| Pregunta | Respuesta |
|---|---|
| Quién lo crea | El contenedor, como campo privado |
| Quién puede cambiarlo | Sólo el sembrador de dirección (`patient:780`) |
| Quién lo lee | El mismo sembrador, para decidir si pisa lo que la persona escribió (`patient:746`) |
| Qué lo invalida | Nada: es acumulativo |
| Cuándo se destruye | Cuando el control se recolecta — de ahí el `WeakMap` |

**Veredicto §4: cumple, y la elección de `WeakMap` está bien.** Se anota porque es el único estado
del archivo que **ningún `computed` puede observar**: quien lea el código buscando signals no lo va
a encontrar, y decide comportamiento visible.

## 2. Los derivados que hoy son copias mutables (H2.S3.M3)

### 2.1 — Siete catálogos que reimplementan a mano una máquina de estados que el repo ya tiene

Cada catálogo se guarda en **dos** signals: la lista y una bandera `*Caido`. Entre los dos codifican
tres situaciones (no llegó todavía · llegó vacío · falló), que es exactamente lo que modela
`ViewState<T>` — el mecanismo del repo, con sus nueve estados del M34.

La prueba de que no es una opinión: **el mismo archivo ya usa `ViewState`**, pero sólo para el
envío (`practitioner:1989`). Son 4 menciones de `ViewState` por archivo, todas del envío:

```text
$ grep -c 'ViewState' src/app/features/auth/register-patient/register-patient.ts
4
$ grep -c 'ViewState' src/app/features/auth/register-practitioner/register-practitioner.ts
4
```

**14 signals donde alcanzarían 7.** No se toca: cambiar cómo se traen los catálogos es acceso a
datos, fuera del alcance declarado. Queda como deuda con su medida.

### 2.2 — Cuatro campos de referencia, cuatro dueños distintos del mismo dato

Éste es el hallazgo. La pregunta que los cuatro resuelven es la misma: *un `FormControl` no avisa a
un `computed`; ¿cómo llega su valor a la plantilla?* Y hay cuatro respuestas distintas **en dos
archivos de la misma familia**:

| # | Campo | Cómo llega al `computed` | ¿Puede desincronizarse? |
|---|---|---|---|
| 1 | Título profesional (`practitioner:1359`) | **Espejo mutable** sincronizado por una suscripción a `valueChanges` (`:2071-2074`). El propio comentario lo llama «el espejo» | **Sí**, si alguien escribe el control sin pasar por el formulario |
| 2 | Ocupación (`patient:1641`) | **Copia mutable escrita a mano**: `elegirOcupacion` hace `setValue` en el control **y** `.set` en el signal, una línea después de la otra (`:1629-1632`) | **Sí**, si alguien setea `occupationConceptId` sin pasar por `elegirOcupacion()` |
| 3 | Empresa (`patient:824`) | **No es copia: es el único dueño.** `elegirEmpresa` escribe **sólo** el signal; el id nunca entra al `FormGroup` y se lee de ahí para el payload (`:2398`) | No, porque no hay segunda copia |
| 4 | Fecha de nacimiento (`patient:1652`) | **Derivación pura**: `toSignal(control.valueChanges)`, signal de sólo lectura | **No**, por construcción |

El comentario del caso 2 dice literalmente el porqué:

> «El signal es el que ven las páginas: un `FormControl` no avisa a un `computed`, y de él depende
> que aparezca el "¿cuál?" de más abajo.»

**La consecuencia falsable**, que es lo que hace de esto un hallazgo y no una opinión de estilo: en
los casos 1 y 2, cualquier escritura del control que no pase por el manejador —un `patchValue` de
un borrador restaurado, un `reset`, una siembra— deja el espejo viejo. En el campo de ocupación eso
se ve como el «¿cuál?» apareciendo o desapareciendo contra lo que dice el `select`. Hoy no ocurre
porque **nadie escribe esos controles desde afuera**; la fragilidad es potencial, no un bug vivo, y
así se declara.

El caso 4 es la forma que no puede fallar y **ya existe en el repo**, en el mismo archivo. Es la
respuesta canónica cuando esta familia se unifique.

**Relación con D-5 (tipar el `FormGroup`):** refuerza la decisión de mandarlo a la oleada 2, y por
un motivo nuevo. Tipar el formulario **no vería** el caso 3: el id de la empresa no está en el
`FormGroup`. Un contrato tipado que se escriba sin resolver antes quién es el dueño de cada campo
de referencia va a quedar tipado **y equivocado**.

## 3. Barrido de `effect` (H2.S3.M4)

```text
$ git grep -n 'effect(' d40b5631 -- 'src/app/features/auth/register-*' \
    'src/app/features/account/my-profile/**' \
    'src/app/shared/components/organisms/{paginated-form,form-section,form-actions}/**' \
    'src/app/shared/components/molecules/form-field/**'
d40b5631:…/practitioner-profile-view/practitioner-profile-view.ts:206:    effect(() => {
d40b5631:…/organisms/paginated-form/paginated-form.ts:404:    effect(() => {
d40b5631:…/organisms/paginated-form/paginated-form.ts:414:    effect(() => {
d40b5631:…/organisms/paginated-form/paginated-form.ts:438:    effect(() => {
d40b5631:…/organisms/paginated-form/paginated-form.ts:448:    effect(() => {
d40b5631:…/organisms/paginated-form/paginated-form.ts:457:    effect(() => {
```

**Seis en todo el alcance, y ninguno en los cinco contenedores de alta.** Ése es el primer resultado
y es un resultado bueno: los registros derivan con `computed`, no copian con `effect`. Lo que copian
lo copian con suscripciones a `valueChanges` (§2.2), que es otro mecanismo y otro problema.

Clasificación de los seis, que es lo que la microtarea pide:

| Ruta:línea | Qué hace | ¿Copia estado derivable? |
|---|---|---|
| `paginated-form.ts:404` | Si las páginas encogen, baja `indice` al último válido | **No.** Repara una invariante sobre estado de navegación que no tiene derivación pura: el índice es trayectoria, no función del presente |
| `paginated-form.ts:414` | Aviso por consola en desarrollo si una página excede el tope de campos o si un campo no existe en el `FormGroup` | **No.** No escribe estado |
| `paginated-form.ts:438` | `visitedIndex ← max(visitedIndex, indice)` | **No.** Es un acumulador sobre la historia. Un `computed` del índice actual no puede saber dónde se estuvo |
| `paginated-form.ts:448` | Emite `pasoVisible` | **No es copia: es emisión.** Está en un `effect` y no en `avanzar()` porque el índice también se mueve solo (al enviar con error) — el comentario lo explica |
| `paginated-form.ts:457` | Lleva el foco al título al cambiar de página, salvo el primer render | **No.** Efecto sobre el DOM, que es para lo que existe `effect` |
| `practitioner-profile-view.ts:206` | Aviso de credenciales | Fuera de esta subtarea: es el contenedor de H4 y ahí se decide. Anotado, no clasificado acá |

**Veredicto M4: ningún `effect` del alcance copia estado que debiera derivarse.** Los cinco del
organismo están donde tienen que estar, y cuatro de ellos traen escrito el porqué.

## 4. Lo que esta subtarea NO cubrió

- Los otros tres contenedores de alta (organización, laboratorio, imagenología) no se
  inventariaron: H2.S1 eligió dos y las cinco preguntas se responden sobre esos dos. El sexto
  `register-*` es `register-account-type`, que elige el tipo de cuenta y no tiene formulario de
  alta. El barrido de `effect` de §3 sí cubre los seis.
- `practitioner-profile-view.ts` tiene su propia tabla de propiedad del estado en
  `evidencia/h4/contrato-de-la-vista.md`; no se duplica acá.
- Nada de esto se corrigió. Es diagnóstico: las infracciones de §2 quedan registradas con su
  medida y su consecuencia, y ninguna entra al alcance de este carril.
