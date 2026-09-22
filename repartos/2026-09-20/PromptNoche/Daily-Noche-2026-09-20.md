# Daily — turno noche — 2026-09-20

> **AVANCE DEL TURNO: 0 / 272 — 0 %.** ← se llena al cerrar, con `microtareas HECHO / total`.
> Pablo **54/55** · Ender 0/55 · Itzan **62/62** · Marcelo 0/54 · Justin 0/54.
> **`A MEDIAS` cuenta como no hecha. `DESCARTADO` no suma: se declara aparte con su motivo.**

> **Estado:** `REPARTIDO` al 2026-09-20. Este documento se escribió **al repartir, antes del turno**;
> las filas de resultado se llenan con lo que cada carril ejecute.

- **Turno:** noche · **Fecha:** 2026-09-20 · **Paquete fuente:** las **24 correcciones del doctor**
- **Fuente del pedido (verbatim, con procedencia):** [`CORRECCIONES-DOCTOR-2026-09-20.md`](../../../docs/requisitos/CORRECCIONES-DOCTOR-2026-09-20.md)
- **Verificación contra el código real:** [`VERIFICACION-CONTRA-CODIGO-2026-09-20.md`](../../../docs/verificacion/VERIFICACION-CONTRA-CODIGO-2026-09-20.md)
- **Todo el trabajo está en esta única fecha.** Cada persona tiene **un solo prompt** con sus seis hitos.

## 0. Los tres hechos que ordenan toda la noche

1. **La maqueta que el doctor mira no tiene backend.** La rama `mockup` fija `mockBackend: true` en
   `src/environments/environment.ts`, **sin leer el entorno del proceso a propósito**, para que no
   haya forma de apuntarla a una API real por accidente. Consecuencia: **todo DoD se demuestra contra
   los manejadores simulados de `src/app/core/mock/`**, que son de **Ender**. Eso no exime de
   respetar el contrato real: el simulador es un **doble declarado** (regla 65), y si el contrato real
   no soporta lo que se pide, eso es un hallazgo que se registra, no una licencia para inventarlo.
2. **El corte es `origin/mockup`, no el working copy.** Corte de referencia:
   **`689697821a6e6d2c8f702c7508d6728fa9a1869a`** (PR #554, 2026-09-20T12:32-04). El working copy del
   frontend está en otra rama, y **tres de las cosas que el doctor describe no existen ahí**
   (`?vista=table`, la solapa «Calendario», el botón «Mis horarios»). Cada persona **reconsulta y
   declara** su corte en la primera microtarea.
3. **Dos correcciones pueden estar ya cumplidas** (C-18 y C-22). **No se declaran hechas**: se
   verifican ejercitando la pantalla y, si ya están, cierran `DESCARTADO` **con la captura**. Un
   `HECHO` sin haber ejercitado es exactamente lo que la regla 30 prohíbe.

## 1. Quién tiene qué

| Persona | Encargo | Correcciones | Hitos | Subtareas | Microtareas | Estado |
|---|---|---|---:|---:|---:|---|
| **Pablo** | [Agenda: dos solapas, el cupo manda la hora, y una sola consulta a la vez](Pablo/Noche-CorreccionesDoctor.AgendaConsultas/SolapasCalendarioSlotsYReglaDeConsulta.md) | C-04, C-07, C-08, C-10, C-11, C-12 (UI), C-13 (UI) | 6 | 18 | 55 | **54/55 · A MEDIAS** |
| **Justin** | [La receta: sacarle lo que no va, y que la dosis y la posología digan la verdad](Justin/Noche-CorreccionesDoctor.Receta/RecetaLimpiaMotivoDosisYPosologia.md) | C-15, C-16, C-17, C-18, C-19, C-20 (UI), C-21, C-22 | 6 | 18 | 54 | `TODO` |
| **Itzan** | [El patrón de la casa: botones con texto, insignia de especialidad, y un perfil que se puede editar entero](Itzan/Noche-CorreccionesDoctor.PerfilYDisenio/PatronDeBotonesInsigniaYPerfilEditable.md) | C-01, C-02, C-05, **C-06 (patrón)**, C-09, **C-21 (regla)** | 6 | 18 | 54 | `TODO` |
| **Ender** | [Los contratos que faltan y un panel que diga la verdad](Ender/Noche-CorreccionesDoctor.ContratosYPanel/CatalogosBloqueosPosologiaYPanel.md) | C-03, C-12 (contrato), C-13 (contrato), C-20 (catálogo), C-24 | 6 | 18 | 55 | `TODO` |
| **Marcelo** | [La cuadrícula de notas, la internación según norma, y el dictamen del lote](Marcelo/Noche-CorreccionesDoctor.ExpedienteYAceptacion/CuadriculaDeNotasInternacionNormadaYDictamen.md) | C-14, C-23 + **dictamen de las 24** | 6 | 18 | 54 | `TODO` |
| | | **24 de 24 cubiertas** | **30** | **90** | **272** | |

**Total del turno: 272 microtareas.** El avance se reporta `HECHO / total`, **nunca a ojo**.

> ⚠️ **Esto es más de lo que entra en una noche, y está dicho a propósito.** El alcance se entrega
> completo y ordenado por dependencia. **Lo que no se cierre va `A MEDIAS`**, con qué anda, qué no
> anda y qué falta exactamente. **Recortar alcance es decisión de coordinación, y se registra.**

## 2. Cobertura de las 24 — el kill-test del reparto

Una fila sin persona o sin hito significa que esa corrección **no está repartida**.

| ID | En una línea | Persona | Hito |
|---|---|---|---|
| C-01 | Quitar «Cómo atendés» de la pestaña «Dónde atiendo» | Itzan | H4 |
| C-02 | Quitar los enlaces sueltos; el consultorio como pestaña con su QR | Itzan | H4 |
| C-03 | Globos del panel con el diseño de los de la agenda | Ender | H6 |
| C-04 | Las tarjetas de `/schedule` llevan a iniciar el encuentro | Pablo | H4 |
| C-05 | Editar el perfil muestra todos los campos, en todas las pestañas | Itzan | H5 |
| C-06 | Botón = icono + texto; acciones de tabla en desplegable | **Itzan (patrón)** + los cinco (aplicación) | Itzan H2 · Pablo H6 · Justin H6 · Ender H6 · Marcelo (en sus pantallas) |
| C-07 | Quitar la vista `?vista=table` | Pablo | H2 |
| C-08 | Semana desplegable con hover · mes con chips · «Calendario» → «Consultas» | Pablo | H2 y H4 |
| C-09 | Especialidades como grid de insignias, homogéneo | Itzan | H3 |
| C-10 | Quitar «Cupos» · modal · sin hora · toggles · slots reales · extensión | Pablo | H2 y H3 |
| C-11 | Una consulta a la vez · quitar los botones de arriba a la derecha | Pablo | H2 y H5 |
| C-12 | Horarios de «Mis Servicios» que bloquean con «Otros servicios» | Pablo (UI) + **Ender (contrato)** | Pablo H5 · Ender H2 |
| C-13 | Visita de laboratorio en la misma pestaña, VISITADOR, 15 min configurable | Pablo (UI) + **Ender (contrato)** | Pablo H5 · Ender H3 |
| C-14 | Cuadrícula tipo Excel en el modal de notas, una fila por sesión | Marcelo | H2 y H3 |
| C-15 | No se descarga la receta desde donde se la escribe | Justin | H2 |
| C-16 | Quitar la barra de demostración de la receta | Justin | H2 |
| C-17 | Quitar los favoritos de la receta | Justin | H2 |
| C-18 | Poder escribir una razón además de elegir un diagnóstico | Justin | H3 |
| C-19 | Dosis como texto libre; quitar «Unidad» | Justin | H4 |
| C-20 | Frecuencia por defecto del medicamento (posología) | Justin (UI) + **Ender (catálogo)** | Justin H5 · Ender H4 |
| C-21 | Todo lo que sean opciones, `select` | **Itzan (regla)** + Justin + los cinco | Itzan H6 · Justin H6 |
| C-22 | «¿Para qué es esta receta?» opcional | Justin | H3 |
| C-23 | Rehacer el formulario de internación según norma | Marcelo | H4 y H5 |
| C-24 | Panel: colores, semanal/mensual, mapa de calor, canceladas, otras atenciones | Ender | H5 |

## 3. Lo primero, para todos

Antes de la primera microtarea: instalar el estándar (sección 1 del encargo) y **pegar la salida de
los tres comandos** en el daily personal. Un turno que arranca sin eso arranca en `BLOQUEADO`.

```bash
ls .claude/skills | wc -l            # -> 176
ls .claude/rules/[0-9]*.md | wc -l   # -> 14  (mas el README, que no es una regla)
python .claude/hooks/plan_gate.py --self-test    # -> 11 PASS, 0 FAIL
```

Y los comandos reales de esta rama, que **no** son los de la API:

```bash
yarn install && yarn start            # http://localhost:4200, sin .env, sin proxy, sin base
yarn typecheck                        # tsc app + cypress + playwright
yarn lint
npx ng test --include=<spec> --watch=false
npx ng test --include=src/app/core/mock/mock-backend.spec.ts --watch=false   # el simulador entero
E2E_BASE_URL=http://localhost:4200 npx playwright test playwright/mockup-barrido.spec.ts --workers=1
E2E_BASE_URL=http://localhost:4200 npx playwright test playwright/mockup-click-sweep.spec.ts --workers=1
```

**Cuentas de la maqueta** (cualquier contraseña no vacía): `medica@alovida.mock`,
`paciente@alovida.mock`, `admin@alovida.mock`, `superadmin@alovida.mock`, `visitador@alovida.mock`.
Son **sintéticas declaradas**: se pueden pegar en el reporte. **Ningún dato real de paciente, nunca**
(regla 90.2).

**Regla 70:** un `yarn start`, un build, un navegador, Playwright con `--workers=1`. Nada en
background que no cierres vos.

## 4. Orden de dependencia — quién espera a quién

| Quien espera | De quién | Qué exactamente | Qué hace mientras tanto |
|---|---|---|---|
| ~~**Los cuatro**~~ | ~~**Itzan (H2)**~~ | **PUBLICADO — ver §4-bis.** La regla es ADR-0012 y el componente es `app-row-actions` | **Destrabado.** C-06 se puede empezar |
| ~~**Los cuatro**~~ | ~~**Itzan (H6)**~~ | **PUBLICADO — ver §4-ter.** La regla es ADR-0013, con su árbol de tres preguntas y el número de cada uno | **Destrabado.** C-21 se puede empezar |
| **Pablo (H3.S3)** | **Ender (H2)** | Que la excepción `EXTRA` funcione en el simulador | Dejar la microtarea `BLOQUEADO` con el pedido escrito **y** simular el contrato en sus tres niveles (regla 65) |
| **Pablo (H5.S2, H5.S3)** | **Ender (H2, H3)** | Motivo del bloqueo de servicios · forma de la respuesta de la visita y duración configurable | Ídem |
| **Justin (H5)** | **Ender (H4)** | **La clave de la propiedad de frecuencia por defecto** y su forma | Simular la ficha del concepto en sus tres niveles y seguir |
| **Justin (H2.S1)** | **Marcelo** | El cambio del `output` de descarga en `consultation.html`, que es de Marcelo | Pedirlo por el daily y anotarlo en los dos |
| **Marcelo (H2, H3)** | **Ender (H1.S3)** | Dónde guardar las filas de la cuadrícula | Cerrar contra el doble, declarándolo |
| **Marcelo (H6)** | **Los cuatro** | Su trabajo terminado, para poder ejercitarlo | **Escribir el dictamen igual**, con `NOT_RUN` en lo que no llegó a estar |
| **Coordinación** | Itzan (H4), Marcelo (H4) | Qué pasa con `/administration/my-practice` · cuántos campos de la hoja de admisión no entran hoy | — |

**Si dos personas miden lo mismo y les da distinto, eso es un hallazgo, no un empate a resolver
charlando.** Gana el archivo abierto, y la diferencia se registra.

## 4-bis. PUBLICADO — el patrón de acciones de fila (Itzan, H2)

> **Los cuatro pueden empezar C-06.** No hace falta esperar nada más de H2.

### La regla

`docs/adr/ADR-0012-botones-con-texto-y-acciones-de-fila.md`, con su fila en `docs/adr/index.md`.
Tres puntos:

1. **Todo botón lleva icono y texto.** El icono acompaña al texto; no lo sustituye.
2. **Con más de dos acciones en una fila, van a un desplegable**, cada una con su texto. La fila
   muestra un único disparador. Hasta dos quedan en la fila, con texto.
3. **La única excepción** —significado universal: cerrar, quitar, página siguiente— exige
   `aria-label` **y** `appTooltip`. Las dos, no una: un `aria-label` sin globo deja fuera a quien
   ve la pantalla; un globo sin `aria-label`, a quien no la ve. Se justifica en una línea al lado.

El ADR conserva **la razón de la decisión del 2026-09-13 que reemplaza** (`agenda.html:545`), y
por qué esa razón era correcta: con texto, cinco botones hacían crecer la fila a tres renglones.
Eso sigue siendo cierto. Lo que cambia es la solución: poner texto en cinco botones y poner cinco
botones en la fila son dos cosas distintas, y sólo la segunda rompía el ancho.

### El componente

`src/app/shared/components/molecules/row-actions/`, exportado en el barril de moléculas como
`RowActions` · `RowAction` · `ROW_ACTIONS_INLINE_MAX`.

**Dónde está hoy:** rama `itzan/patron-acciones-fila-insignia-perfil`, cinco commits
(el ADR, el componente, sus tres correcciones, el primer uso real y los recorridos).
**Todavía no está en `mockup`**, así que un `git pull` de `mockup` no lo trae: para usarlo hoy
hay que traer esa rama. Se integra con el PR del turno; si a alguien le urge antes, se pide y
se adelanta.

> **Cambió después de publicarlo — si ya lo bajaste, volvé a bajarlo.** Ninguno de los tres
> cambia la API, así que el código que hayas escrito sigue andando:
>
> 1. **Las acciones dibujadas en la fila ahora también se anuncian con su fila.** Antes eso lo
>    hacía sólo el disparador. Veinte «Retirar» son tan indistinguibles como veinte «Acciones».
>    Se lee «Retirar — la sede X»: con raya y no con «de», porque el texto de una acción es una
>    frase verbal que escribís vos y no hay preposición que sirva para todas.
> 2. **La acción destructiva en la fila ya no va en rojo lleno.** Repetida por fila, la acción
>    más peligrosa era lo más gritón de la pantalla. Va en `ghost` como las demás y se distingue
>    por su tinta al apuntarla o enfocarla. En el desplegable no cambia nada.
> 3. **Ya no empuja la página a lo ancho.** A 375 px las dos acciones en fila desbordaban 8 px
>    (`scrollWidth` 383 contra 375). Era `inline-size: max-content`, que no se deja achicar.
>
> Los tres salieron del **primer uso real**, no de leer el componente de nuevo. Es el argumento
> para aplicarlo en un archivo propio antes de repartirlo: el uso encuentra lo que la lectura no.

```html
<app-row-actions
  [actions]="accionesDe(solicitud)"
  fila="la solicitud de Ana Pérez"
  (actionSelected)="ejecutar($event, solicitud)"
/>
```

```ts
protected accionesDe(s: Solicitud): readonly RowAction[] {
  return [
    { code: 'ver',      label: 'Ver detalle',  icon: 'note' },
    { code: 'aceptar',  label: 'Aceptar' },
    { code: 'iniciar',  label: 'Iniciar',      disabled: !s.puedeIniciar },
    { code: 'anular',   label: 'Anular',       icon: 'remove', destructive: true },
  ];
}
```

**La forma sale de cuántas son, no de una decisión de quien lo usa.** Hasta dos se dibujan como
botones con texto en la fila; con tres o más, disparador único y desplegable. No hay forma de
aplicar la regla al revés.

| Entrada / salida | Qué hace |
|---|---|
| `actions` (requerido) | `code` · `label` · `icon?` · `disabled?` · `destructive?` |
| `fila` | De qué fila son, en palabras. Entra en el nombre accesible del disparador |
| `label` | El texto visible del disparador. Por omisión, «Acciones» |
| `actionSelected` | Emite el `code` de la elegida, venga del botón o del menú |

Tres cosas que conviene saber antes de usarlo:

- **`icon` es opcional y es del set cerrado del sistema** (`atoms/nav-icon`). No acepta un SVG
  suelto: un segundo set de íconos se desincroniza del primero. El set tiene `edit` y `remove`;
  **no tiene ver, imprimir, descargar ni duplicar** — una acción sin icono se dibuja con su texto,
  que es lo que el pedido exige. Si necesitás un nombre que no está, pedilo por acá; **no lo
  agregues de paso**. Dos que ya se descartaron mirándolos: **`scan` no sirve para un QR de
  cobro** (su propia ficha dice que es imagenología clínica) y **`billing` es una tarjeta con
  banda**, que es otro medio de pago. Falta **`qr`** en el set; mientras tanto esa acción va sólo
  con su texto, y en `ghost` se le nota la falta de glifo al lado de las que sí tienen.
- **`fila` no es decorativo.** Veinte filas con veinte botones «Acciones» son veinte botones
  indistinguibles para quien no ve la pantalla. Con `fila`, el disparador se anuncia «Acciones de
  la solicitud de Ana Pérez».
- **No reimplementa nada del desplegable.** Va sobre `molecules/menu/`, que ya muda su panel al
  `<body>` mientras está abierto —que es lo que evita que el `overflow` de una tabla lo recorte— y
  ya trae el teclado completo y la vuelta del foco. `molecules/menu/` **no se tocó**: su
  comportamiento por omisión es el mismo de antes.

### Con qué evidencia se publica

```text
$ npx ng test --include=src/app/shared/components/molecules/row-actions/row-actions.spec.ts --watch=false
Test Files  1 passed (1)
     Tests  10 passed (10)

$ yarn typecheck
exit 0

$ yarn eslint src/app/shared/components/molecules/row-actions --max-warnings=0
exit 0
```

Los 10 cubren: la forma según el número de acciones, que ninguna quede sin texto, el nombre
accesible con y sin `fila`, abrir y listar, emitir el código y cerrar, que una deshabilitada no
emita, **`Escape` cierra y devuelve el foco al disparador**, y que sólo la destructiva se marque.

**Peldaño: `TESTED`.** El recorrido de teclado en navegador y el primer uso real están en curso;
cuando estén, sube. Se publica ahora porque el encargo lo pide así y porque esperar a eso para
avisar les cuesta el turno a cuatro personas.

### C-06 por dueño — el encargo de cada uno

Medido sobre el corte, contando apariciones de `iconOnly` en plantillas:

| Dueño | Apariciones | Archivos | Los más cargados |
|---|---|---|---|
| **Itzan** | 41 | 17 | `paginated-form` 8 · `date-picker` 7 · `back-link` 5 |
| **sin dueño declarado** | **34** | **12** | `register-patient` 8 · `design-system-sample` 5 · `field-editor` 4 |
| **Pablo** | 32 | 5 | `agenda` 15 · `my-agenda` 9 · `blocks` 4 |
| **Justin** | **0** | 0 | — |
| **Marcelo** | **0** | 0 | — |
| **Ender** | **0** | 0 | — |
| **Total** | **107** | **34** | |

La lista archivo por archivo está en el material de Itzan, en
`evidencia/inventarios/C-06-botones-solo-icono.md`.

**Justin, Marcelo y Ender: no tienen ninguno en su territorio reservado.** No es que no se
buscó — se verificó carpeta por carpeta que esas rutas existen y tienen archivos. Para los tres,
C-06 no genera trabajo; lo que sí les toca es la regla 1 (icono **y** texto) en todo botón nuevo
que escriban esta noche.

## 4-ter. PUBLICADO — cuándo algo tiene que ser un `select` (Itzan, H6)

> **Los cuatro pueden empezar C-21.** La regla es
> `docs/adr/ADR-0013-opciones-en-select.md`, en el repo del front, al lado de la de botones.

**C-21 dice «todo lo que sean opciones deben ser selects» y C-10, del mismo día y del mismo
autor, pide lo contrario para el modal de cupos** («ES NECESARIO QUE SEA TOGGLE BUTTONS EN LUGAR
DE LOS QUE RADIO BUTTON»). No se contradicen: no hablan de la misma situación, y la regla lo
resuelve por escrito para que nadie tenga que decidirlo solo.

**Las tres preguntas, en orden:**

```text
¿La persona elige algo?
├─ No  → es un dato. Chip, insignia o texto. C-21 no aplica.
└─ Sí  → ¿es el sí/no de una misma afirmación?
         ├─ Sí → toggle (es lo que pide C-10)
         └─ No → ¿esconder las opciones pierde información
                  (es una escala, o es el atajo que el cliente pidió ver)?
                  ├─ Sí → se dibuja entero, con el motivo escrito al lado
                  └─ No → `app-select`   ← el caso normal (C-21)
```

**Lo que hay que saber sin abrir el ADR:**

1. **Un chip que sólo muestra no es una opción.** Una especialidad, un idioma, un estado: no hay
   nada que elegir, así que no se convierten. No es una excepción; es que C-21 no habla de ellos.
2. **Dos valores del mismo eje no van en un desplegable.** Sí/no, activo/inactivo. Un `select` de
   dos opciones esconde la mitad de la respuesta detrás de un clic.
3. **Una escala se dibuja entera.** «Del 1 al 5» no es una lista: el orden y la distancia son el dato.
4. **Toda excepción se escribe en el código, al lado del control, con su motivo y su fecha.**
   Sin eso no es una excepción, es una omisión.
5. **Un componente que montan muchas pantallas no cambia su comportamiento por omisión**: se le
   publica una opción nueva. Ejemplo medido: `app-paginated-form` lo montan **52** plantillas.

**El encargo de cada uno** — etiquetas de apertura, que son los controles reales:

| Dueño | `app-chip` | `radio-group` | `radio-otro` | `segmented-control` | Total |
|---|---|---|---|---|---|
| **sin dueño declarado** | 49 | 11 | 0 | 7 | **67** |
| **Itzan** | 6 | 3 | 1 | 1 | **11** (eran 13; los 11 que quedan son excepciones declaradas) |
| **Pablo** | 0 | 0 | 0 | 5 | **5** |
| **Justin** | 2 | 0 | 0 | 0 | **2** |
| **Marcelo** · **Ender** | 0 | 0 | 0 | 0 | **0** |

> **Ojo con el número del encargo.** Su comando cuenta el nombre suelto y da **533**, porque
> `<app-chip>` y `</app-chip>` suman dos por cada chip. Los controles reales son **92**. Repartir
> 533 habría inflado el encargo de cada uno por seis.

La lista archivo por archivo está en el material de Itzan, en
`evidencia/inventarios/C-21-grupos-de-opciones.md`.

**Marcelo y Ender: no tienen ninguno en su territorio reservado.** Como con C-06, lo que sí les
toca es aplicar la regla en todo control de opciones que escriban esta noche.

> **Una lectura que hay que confirmarle al propietario.** C-21 al pie de la letra contradice un
> pedido anterior del mismo cliente que **ya está implementado**: los chips de filtro de los
> cuatro directorios (§A3 del plan de UX del 22/08). Acá se resolvió que ese pedido sobrevive
> como excepción declarada, porque su argumento —esconder las opciones hace que nadie sepa que
> existen— sigue siendo cierto. **Es un supuesto, no un hecho.** Si la respuesta es que C-21
> también los alcanza, son dos pantallas y el cambio es quitar un `asChips`.

### Antes de convertir, medí el rótulo más largo a 375 px

Esto salió de aplicar la regla, no de pensarla, y les va a pasar a todos.

**Un `<select>` no parte líneas.** Tres radios con un rótulo largo lo muestran
completo en dos renglones; el mismo rótulo dentro de un desplegable se corta
contra la flecha, sin puntos suspensivos y sin aviso.

Medido en la primera conversión, con la tipografía calculada del propio control:

```text
== 375 px ==   hueco útil = 245 px
   SE CORTA   247 px   «PDF oficial certificado con código QR»
   entra      184 px   «Archivo JSON interoperable»
   entra      217 px   «Paquete completo (PDF + JSON)»

== 768 px / 1440 px ==   las tres entran
```

Se pasó **por dos píxeles**. No es un defecto de accesibilidad —al abrir la
lista el sistema la muestra entera y el nombre accesible siempre está
completo— pero sí se pierde de un vistazo, y sus listas van a ser más largas
que la mía.

**Qué hacer cuando no entra**, en este orden:

1. Si el rótulo es tuyo y se puede decir más corto sin perder nada, decilo más corto.
2. Si el texto es del cliente o del dominio, **no lo acortes por tu cuenta**: C-21 cambia el
   control, no lo que dice. Registralo como costo medido y que la decisión sea de quien es dueño
   de esas palabras.
3. **No toques el relleno del `app-select`.** Lo montan 34 plantillas y le cambiarías el ancho
   útil a todas.

Cómo medirlo y el detalle están en `docs/adr/ADR-0013-opciones-en-select.md`.

## 5. Reservas de archivos — para que nadie se pise

Rutas relativas a `mantra-core-health/`, sobre la rama `mockup`.

| Ruta reservada | Para quién |
|---|---|
| `src/app/features/agenda/**` · `src/app/features/my-services/**` | **Pablo** |
| `src/app/features/clinical-record/patient-chart/medication-block/**` · `src/app/core/data-access/prescription-favorites/**` | **Justin** |
| `src/app/features/clinical-record/patient-chart/free-note-block/**` · `.../admission-block/**` · `src/app/features/clinical-record/consultation/**` | **Marcelo** |
| `src/app/shared/**` · `src/app/features/account/my-profile/**` | **Itzan** |
| `src/app/core/mock/**` · `src/app/features/dashboard/**` · `src/app/core/data-access/**` (menos `prescription-favorites/**`) | **Ender** |
| `mantra-core-health-api/**` · `mantra-core-health-model/**` | **NADIE esta noche.** Se leen y se citan; **no se escriben** |

**Dos personas escribiendo el mismo archivo es un defecto del reparto, no un accidente.** Quien
necesite un cambio en la ruta de otro **lo pide por el daily y no lo escribe**. Un cambio acordado se
anota en los dos dailies, con quién lo escribió.

## 6. Ambigüedades abiertas — se arrastran, no se resuelven

| ID | Qué | Quién la cierra | Estado |
|---|---|---|---|
| Q-D1 | Sobre qué rama aplica el pedido (se asumió `origin/mockup`) | Pablo / coordinación | `ABIERTA` — supuesto declarado |
| Q-D2 | Varios puntos mezclan cambio de UI con cambio de regla de negocio | Doctor | `ABIERTA` — se separan en microtareas distintas |
| Q-D3 | **C-06 revierte una decisión de propietario del 2026-09-13 escrita en el código** | Doctor / propietario | `ABIERTA` — gana el pedido nuevo, el desvío se registra |
| Q-D4 | C-18 y C-22 parecen ya cumplidos | Doctor | `ABIERTA` — se verifican ejercitando; si están, `DESCARTADO` con captura |
| Q-D5 | C-24: «los colores no coinciden» sin decir con qué | Doctor | `ABIERTA` |
| Q-D6 | **«OTROS SERVICIOS» no está en la lista cerrada de 7 motivos** del contrato | **Negocio** | `DECISION_REQUIRED` — se usa `OTHER` + texto mientras tanto |
| Q-D6b | **C-20 pide posología «de fábrica» y el vademécum declara no tener fuente autoritativa** | **Negocio (con fuente clínica)** | `DECISION_REQUIRED` — **el mecanismo se implementa; el dato NO se inventa** (regla 97.5.4, precedente B-13) |
| Q-D7 | C-14: las filas anteriores, ¿editables o sólo lectura? | Doctor | `ABIERTA` — se asume sólo lectura |
| Q-D8 | C-21 pide `select` y C-10 pide toggles | Doctor | `ABIERTA` — lista → `select`; alternancia → toggle |
| Q-D9 | **C-23: «según nomra» sin nombrar la norma** | **Doctor / negocio** | `DECISION_REQUIRED` — lo que no se pueda citar va `UNKNOWN` |

**Las tres `DECISION_REQUIRED` son las que más trabajo bloquean.** Ninguna impide arrancar: las tres
tienen supuesto declarado y camino sin romper contrato. Lo que impiden es **cerrar** la parte que
depende de la decisión.

## 7. Hallazgos previos que afectan a todo el equipo (de la verificación contra el código)

| ID | Qué | A quién le pega | Regla que manda |
|---|---|---|---|
| **HALL-D1** | La maqueta no tiene backend: `mockBackend: true` fijo. Todo DoD va contra `core/mock/**` | Los cinco | Regla 65 |
| **HALL-D2** | **El working copy no es la maqueta**: tres cosas que el doctor describe no existen en `dev` | Los cinco | Regla 30 §4 |
| **HALL-D3** | C-06 revierte una decisión de propietario escrita en el código el 2026-09-13 | Itzan + los cuatro | Regla 00 §8 |
| **HALL-D4** | «OTROS SERVICIOS» no está en la lista cerrada de 7 motivos | Pablo, Ender | Regla 00 §1.3, 96.4.1 |
| **HALL-D5** | El vademécum **declara** no tener fuente autoritativa y no publica ninguna frecuencia | Justin, Ender | Regla 97.5.4 + B-13 |
| **HALL-D6** | El motor de formularios tiene 5 tipos de pregunta y **ninguno es tabla**: la grilla de C-14 no tiene dónde guardarse hoy | Marcelo | Regla 65, 96.1 |
| **HALL-D7** | **C-06 en la cabecera: el interruptor de tema es sólo-icono y no tiene globo, en 44 rutas.** Tiene nombre accesible («Cambiar a modo claro» / «…oscuro») y le falta la otra mitad que pide ADR-0012. Contado, no estimado: aparece 44 veces, una por ruta, en la matriz de acabado del carril 34. Vive en `features/shell-layout/shell-layout.html:362` y `features/alovida/inicio/portada/portada.html:20`; la directiva es `core/alovida/alovida-theme-toggle.directive.ts:24`. **Es una línea** y es el hallazgo de C-06 con más alcance que apareció | Quien lleve el marco de la aplicación | Regla 95.4.1, ADR-0012 |
| **HALL-D7** | `care_episodes` no tiene servicio, sala, cama ni diagnóstico de ingreso | Marcelo | Regla 97.1, 97.7 |
| **HALL-D8** | No existe endpoint de analítica de consultas; `reporting` es un motor de definiciones (todo `POST`) | Ender | Regla 00 §1.1 |
| **HALL-D9** | El visitador **no puede** ver información clínica; la visita comercial no se mezcla con la agenda clínica | Pablo, Ender | Regla 90.1, 90.2 |
| **HALL-D10** | `pestanas-del-perfil-medico.spec.ts` falla si un campo del alta queda sin pestaña | Itzan | Regla 80.5.4 |
| **HALL-D11** | **C-06 no cierra con los cinco lotes: 34 de las 107 apariciones (12 archivos) no son de nadie**, y 20 están en los formularios de alta. El pedido decía «transversalmente en todas y cada una» | Coordinación | Regla 00 §3.3 |
| **HALL-D12** | **El comando de C-21 del reparto cuenta al revés: `git grep -c "app-chip\|…"` cuenta también `</app-chip>`.** Da 533 donde hay **92** controles reales (`app-chip` 379→58, `radio-group` 136→16). Seis veces inflado | Quien reparta C-21 | Regla 30, «el instrumento no es la pregunta» |
| **HALL-D13** | **`molecules/post-preferences-menu` declara en su comentario un globo que el código no pone**: el disparador tiene `aria-label` pero no `appTooltip`. Es la excepción de ADR-0012 cumplida a medias, en territorio de Itzan | Itzan | Regla 95.4.1 |

## 8. Cierre del turno — completar acá

| Persona | HECHO / total | Hitos cerrados | `A MEDIAS` | `BLOQUEADO` | Su daily |
|---|---|---|---|---|---|
| Pablo | **54 / 55** | **5 / 6** | H6.S2.M2 (click-sweep sin corrida sobre el corte base) | ninguno | [Pablo-Daily-Noche-2026-09-20.md](Pablo/Pablo-Daily-Noche-2026-09-20.md) |
| Justin | __ / 54 | __ / 6 | | | [Justin-Daily-Noche-2026-09-20.md](Justin/Justin-Daily-Noche-2026-09-20.md) |
| Itzan | __ / 54 | __ / 6 | | | [Itzan-Daily-Noche-2026-09-20.md](Itzan/Itzan-Daily-Noche-2026-09-20.md) |
| Ender | __ / 55 | __ / 6 | | | [Ender-Daily-Noche-2026-09-20.md](Ender/Ender-Daily-Noche-2026-09-20.md) |
| Marcelo | __ / 54 | __ / 6 | | | [Marcelo-Daily-Noche-2026-09-20.md](Marcelo/Marcelo-Daily-Noche-2026-09-20.md) |
| **Total** | **__ / 272** | **__ / 30** | | | |

**Dictamen de aceptación del lote (Marcelo, H6):** ____ (ruta) · **Veredicto global:** ____

### Qué NO se puede escribir en este documento

- Un `PASS` sin comando y exit code pegados.
- «Listo», «funciona» o «implementado» sobre algo que no se ejecutó.
- Un porcentaje que no salga de `HECHO / total`.
- Un `BLOCKED` disfrazado de `PASS` porque «igual compila».
- Una corrección marcada cubierta que no tenga su microtarea cerrada con evidencia.
- Datos de pacientes reales en cualquier salida pegada.
