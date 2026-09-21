# Correcciones del doctor — 2026-09-20

> **Este archivo es fuente, no análisis.** Según la regla 00 §8, un requisito explícito del cliente
> es la evidencia de **máxima** jerarquía: gana sobre el comportamiento del código, sobre los tests
> y sobre cualquier documentación de proveedor. Cuando algo de acá choca con lo que hace el sistema,
> **el sistema está mal**, no el requisito.
>
> Lo que **no** es fuente y por eso va en otro archivo: dónde vive cada cosa en el código. Eso está
> verificado, con archivo y línea, en
> [`VERIFICACION-CONTRA-CODIGO-2026-09-20.md`](../verificacion/VERIFICACION-CONTRA-CODIGO-2026-09-20.md).

## Ficha de procedencia

| Campo | Valor |
|---|---|
| Qué es | Las correcciones del doctor sobre la maqueta desplegada en `https://mockup.173.249.39.237.sslip.io` |
| Título del original | `# CORRECCIONES DOCTOR` |
| Quién lo entregó | El cliente (el doctor), vía Pablo |
| Cómo llegó | Pegado en la sesión de trabajo del **2026-09-20**, como bloque único de 24 puntos numerados |
| Fecha de redacción del original | **No consta.** No se infiere |
| Versión | **No consta.** Este archivo es la primera transcripción versionada |
| Estado | `REQUIREMENT_APPROVED` en cuanto a su origen. **Ninguno de los 24 puntos está verificado contra el código en este archivo**: eso es el otro documento |
| Sobre qué rama aplica | **No lo dice el original.** Ver `Q-D1` |

### Cómo se transcribió — leer antes de usarlo

- El texto de cada punto es **palabra por palabra** el que entregó el cliente. **No se corrigió
  ortografía, ni tildes, ni redacción, ni se completaron frases cortadas.** Donde el original
  escribe «desplegable», «cliqueales», «nesario», «anadir», «diseno», «pestana», «normа» o
  «pesimo», así queda.
- Lo único agregado es el identificador `C-nn` y el encabezado Markdown, para poder citar por
  punto. El número `nn` **es el número del original**: `C-07` es el punto 7 del doctor.
- Las mayúsculas sostenidas del original **se conservan**: son énfasis del cliente y borrarlas
  sería editar la fuente.

### Ambigüedades registradas sobre este documento

| ID | Ambigüedad | Supuesto tomado | A quién confirmar |
|---|---|---|---|
| Q-D1 | El pedido no dice **sobre qué rama** se aplica. Las URLs apuntan a la maqueta, que corre con backend simulado (`mockBackend: true`, rama `mockup`) | Se reparte **sobre `origin/mockup`**. Llevarlo a `dev` es decisión posterior de coordinación, no parte de este pedido | Pablo / coordinación |
| Q-D2 | Varios puntos mezclan un cambio de UI con un cambio de regla de negocio (C-10, C-11, C-13, C-14) | Se separan en microtareas distintas: la UI se hace, la regla se implementa **sólo** donde el contrato ya la soporta, y lo demás se registra | Doctor |
| Q-D3 | C-06 contradice una decisión de propietario del 2026-09-13 que está escrita en el código (botones de fila sólo-icono para que la fila no creciera) | Gana el pedido nuevo. El desplegable que pide C-06 resuelve las dos cosas: devuelve el texto y no crece la fila. Se registra como desvío explícito | Doctor / propietario |
| Q-D4 | C-18 y C-22 **parecen ya cumplidos** en el corte leído | No se da por hecho: se verifica en el navegador y, si ya está, la microtarea cierra `DESCARTADO` **con la evidencia**, nunca `HECHO` sin ejercitarla | Doctor |
| Q-D5 | C-24 dice «los colores no coinciden» sin decir con qué no coinciden | Se toma como que el panel no usa los mismos tonos semánticos que la agenda para los mismos estados. Exige captura de los dos lados antes de tocar | Doctor |
| Q-D6 | C-20 pide frecuencias «por defecto de fabrica» por medicamento. El catálogo del repo **declara** no tener fuente autoritativa | Se implementa el **mecanismo** y el dato se declara sintético con procedencia (precedente B-13). **Prohibido inventar posología y presentarla como real** (regla 97.5.4) | Negocio + doctor |
| Q-D7 | C-23 dice «investigar que debe tener segun nomra» sin nombrar la norma | Se exige cita con fuente, referencia y fecha, o `UNKNOWN` declarado. Ningún campo entra «porque suena a norma» | Doctor / negocio |
| Q-D8 | C-21 («todo lo que sean opciones deben ser selects») no dice si incluye los chips de atajo ni los toggle que C-10 pide | Se lee como: **lo que elige un valor de una lista es un `select`**; lo que alterna dos estados excluyentes puede ser toggle, que es lo que C-10 pide explícitamente | Doctor |

---

# Texto del cliente

> `# CORRECCIONES DOCTOR`

## C-01

En https://mockup.173.249.39.237.sslip.io/my-account es necesario eliminar la SECCION de "COMO ATENDES" dentro de la pestana "Donde atiendo"

## C-02

En https://mockup.173.249.39.237.sslip.io/my-account Deben eliminarse los botones @Mi consultorio propio @Mi organizacion medica. Solo en caso de mi consulturio se ve como pestana para personalizarle el QR y todo lo que ofrece esa view.

## C-03

En panel principal los paneles deben ser con tooltip del mismo diseno que dentro de la agenda, es decir mas estetico, al hacer hover.

## C-04

En https://mockup.173.249.39.237.sslip.io/schedule los cards deben ser tambien cliqueales y llevar a la pantalla para iniciar encuentro.

## C-05

En https://mockup.173.249.39.237.sslip.io/my-account necesito que editar muestre todos los campos, no me sirve sino se hace. Necesito que TODAS las pestanas sean editables, osea su informacion.

## C-06

TRANSVERSALMENTE EN TODAS Y CADAS UNAS DE LAS INSTANCIAS DEBE TENER ICONO + TEXTO EL BOTON. AHORA EN LAS QUE SON ACCIONES EN UNA TABLA DEBEN SER UN DESPLEGABLE QUE ABRA UNA ESPECIE DE POP UP O TOOLTIP QUE TENGA LAS OPCIONES CON SU TEXTO E ICONO.

## C-07

En https://mockup.173.249.39.237.sslip.io/schedule?vista=table quita esta vista porque no sirve para nada.

## C-08

En https://mockup.173.249.39.237.sslip.io/schedule *semana* que cada citasea desplegable y tenga el componente hover que tienen los demas. En mes es nesario que tenga el hover con el mismo diseno de cards, con chips para si esta o no antendido. Esta para todos los botones que sea tanto texto como icono con colores explicativos. En lugar de calendario, prefiere que se llame Consultas.

## C-09

En el perfil del doctor es necesario que se vea como un grid con una especie de insiginia cad aespeicalidad pero que sea homogénea en todo el Proyecto. ESTO PORQUE ES COMO UNA ESPECIE DE INSIGNIA CLAN POR LO QUE DEBE SER DA CALIDAD.

## C-10

En https://mockup.173.249.39.237.sslip.io/schedule?vista=cupos quitar cupos y hacer que funcione el botón de llenar en el que antes se llama Calendario ahora Consultas. Debe salir un modal. con las mismas opciones Y QUITAR EL COMPORTAMIENTO QUE HACIA QUE APAREZCA EN LA PARTE DE ABAJO, EL FORMULARIO. TAMPOCO LE PEDIR HORA PORQUE COMO EL SLOT ESTA PROGRAMADO YA CON HORA, NO NECESITA ESA INFORMACIÓN. APARTE ES NECESARIO QUE SEA TOGGLE BUTTONS EN LUGAR DE LOS QUE RADIO BUTTON. Es fundamenrtal que los slots coincidan con el horario y que muestren los bloqueos de agenda y no deje anadir nada ahi. Igual para los horarios de Descanso. Es necesario que sin embargo, sea flexible, porque por ahí hay alguna emergencia, entonces debe al final dejar anadir un horario y que salga un modall que consulte quieres extender esta consulta se sale de tu horario de atención.

## C-11

Como regla es que no se puede iniciar dos consultas al mismo tiempo. Los botones en la parte de arriba derecha deben ser eliminados.

## C-12

Falta la programación de horarios para Mis Servicios, que es aparte de consulta medica y que automáticamente producen un bloqueo de agenda, en la consulta medica y que debe ser por defecto con la razón: @OTROS SERVICIOS. Debe reciclar sus vistas.

## C-13

Las citas de laboratorio se debe hacer también desde la misma pestaña que los pacientes solo que un card en rojo que es VISITADOR y que su slot por defecto es de máximo 15 minutos., pero configurable por el doctor en la pantalla de horarios.

## C-14

En la vista del modal de notas al iniciar un encuentro es necesario que tenga la vista de cuadrilla tipo excel que le permita seleccionar el nombre del header y poner filas, estas filas se deben cargar para la siguiente sesiones, y solo se puede registrar una fila por sesion si quiere mas debe decirle que por motivos de integridad de los datos solo se permite máximo una fila. Explicando que sino no se podrá saber que registro corresponde cada sesión.

## C-15

En receta esta bugueado, donde escribes la receta no deberias de poder descargar la receta, eso es fuera de la receta.

## C-16

En las recetas deberiamos de quitar la demostración por temas de seguridad a la hora de registrar una receta medica por si el doctor se equivoca.

## C-17

Debemos quitar la opcion de favoritos de la receta, eso no deberia estar.

## C-18

En la parte de “De que consulta es la receta”, esta bien  que se pueda escoger un diagnostico existente, pero igual deberia de poderse escribir una razon, porsi no existe un diagnostico previo o no hace falta un diagnostico previo, solamente escribir el porque.

## C-19

El campo de dosis debe ser un campo tipo text o  el que permita poder escribir tanto numeros como letras para escribir no solo la dosis si no tambien la unidad, En ese caso se debe eliminar “Unidad”.

## C-20

Hay algo complejo con seleccionar un medicamento y la frecuencia de este, es cierto que se puede escoger un medicamento y despues ponerle la frecuencia que el doctor cree que es necesaria, pero hay medicamentos que por defecto de fabrica se deben consumir a una frecuencia especifica por defecto (es decir existen medicamentos que si o si tras consumirlos deben pasar si o si 2 horas para poder consumir el mismo pasado el tiempo asi como hay otros que se puede consumir despues de la hora que dice el doctor), en caso de seleccionar esos medicamentos se debe poner automaticamente la frecuencia por defecto de ese medicamento, entonces deben haber medicamentos que tengan una frecuencia por defecto asi como otros que no (posologia).

## C-21

Todo lo que sean opciones deben ser selects.

## C-22

El campo de para que es esta receta debe ser opcional.

## C-23

El formulario de internacion esta totalmente mal pesimo, investigar que debe tener segun nomra y ajustarlo al proyecto.

## C-24

En el dashboard del inicio los colores no coinciden.  ver el reporte semanal y mensual de consultas. Los horarios mas concurridos y los menos. Como un mapa de calor de hora y dia de la semana. Fundamental que se pueda ver los canceladas tambien.  Luego falta que se pueda ver otras atenciones, por ejemplo, como puedo ver las cirugias y tomas de muestras. Una colonoscopia toma su rato de hacer igual que una prueba de contraste que a veces en un hospital uno mismo como doctor hace. *Es decir otras atenciones*

---

# Cobertura — quién cubre cada corrección

Esta tabla es el **kill-test del reparto**: una fila sin persona, sin lote o sin hito significa que
esa corrección no está repartida, por más que aparezca nombrada en un daily.

| ID | Corrección, en una línea | Persona | Lote | Hito |
|---|---|---|---|---|
| C-01 | Quitar la sección «Cómo atendés» de la pestaña «Dónde atiendo» | **Itzan** | `Noche-CorreccionesDoctor.PerfilYDisenio` | H4 |
| C-02 | Quitar los dos enlaces del perfil y llevar el consultorio a una pestaña con su QR | **Itzan** | `Noche-CorreccionesDoctor.PerfilYDisenio` | H4 |
| C-03 | Tooltips del panel con el diseño de los de la agenda | **Ender** | `Noche-CorreccionesDoctor.ContratosYPanel` | H6 |
| C-04 | Las tarjetas de `/schedule` llevan a iniciar el encuentro | **Pablo** | `Noche-CorreccionesDoctor.AgendaConsultas` | H4 |
| C-05 | Editar el perfil muestra **todos** los campos, en **todas** las pestañas | **Itzan** | `Noche-CorreccionesDoctor.PerfilYDisenio` | H5 |
| C-06 | Botón = icono + texto en todas las instancias; acciones de tabla en desplegable | **Itzan** (dueño del patrón) + **los cinco** (aplicación en sus archivos) | todos | Itzan H2 · Pablo H6 · Justin H6 · Ender H6 · Marcelo H6 |
| C-07 | Quitar la vista `?vista=table` | **Pablo** | `Noche-CorreccionesDoctor.AgendaConsultas` | H2 |
| C-08 | Semana desplegable con hover · mes con hover de tarjeta y chips · renombrar «Calendario» a «Consultas» | **Pablo** | `Noche-CorreccionesDoctor.AgendaConsultas` | H2 (nombre) · H4 (semana y mes) |
| C-09 | Especialidades como grid de insignias, homogéneo en todo el proyecto | **Itzan** | `Noche-CorreccionesDoctor.PerfilYDisenio` | H3 |
| C-10 | Quitar «Cupos» · llenar desde un modal · sin pedir hora · toggles · slots reales con bloqueos y descansos · extensión con confirmación | **Pablo** | `Noche-CorreccionesDoctor.AgendaConsultas` | H2 (solapa) · H3 (modal y slots) |
| C-11 | No se pueden iniciar dos consultas a la vez · quitar los botones de arriba a la derecha | **Pablo** | `Noche-CorreccionesDoctor.AgendaConsultas` | H2 (botones) · H5 (regla) |
| C-12 | Programación de horarios de «Mis Servicios» que bloquea la agenda con razón «Otros servicios» | **Pablo** (UI, reciclando las vistas) + **Ender** (contrato y catálogo) | dos lotes | Pablo H5 · Ender H2 |
| C-13 | Visita de laboratorio en la misma pestaña, tarjeta roja VISITADOR, 15 min configurable | **Pablo** (UI) + **Ender** (contrato y configuración) | dos lotes | Pablo H5 · Ender H3 |
| C-14 | Cuadrícula tipo Excel en el modal de notas, cabeceras elegibles, una fila por sesión | **Marcelo** | `Noche-CorreccionesDoctor.ExpedienteYAceptacion` | H2 y H3 |
| C-15 | No se puede descargar la receta desde donde se la escribe | **Justin** | `Noche-CorreccionesDoctor.Receta` | H2 |
| C-16 | Quitar la barra de demostración de la receta | **Justin** | `Noche-CorreccionesDoctor.Receta` | H2 |
| C-17 | Quitar los favoritos de la receta | **Justin** | `Noche-CorreccionesDoctor.Receta` | H2 |
| C-18 | Poder escribir una razón además de elegir un diagnóstico | **Justin** | `Noche-CorreccionesDoctor.Receta` | H3 |
| C-19 | Dosis como texto libre (dosis + unidad) y quitar «Unidad» | **Justin** | `Noche-CorreccionesDoctor.Receta` | H4 |
| C-20 | Frecuencia por defecto del medicamento (posología) cuando el catálogo la declara | **Justin** (UI) + **Ender** (catálogo con procedencia) | dos lotes | Justin H5 · Ender H4 |
| C-21 | Todo lo que sean opciones, `select` | **Itzan** (regla e inventario) + **Justin** (receta) + **los cinco** (sus archivos) | todos | Itzan H6 · Justin H6 |
| C-22 | «¿Para qué es esta receta?» opcional | **Justin** | `Noche-CorreccionesDoctor.Receta` | H3 |
| C-23 | Rehacer el formulario de internación según norma | **Marcelo** | `Noche-CorreccionesDoctor.ExpedienteYAceptacion` | H4 y H5 |
| C-24 | Panel: colores, reporte semanal y mensual, mapa de calor, canceladas, otras atenciones | **Ender** | `Noche-CorreccionesDoctor.ContratosYPanel` | H5 |

## Reserva de archivos — para que nadie se pise

**Dos personas escribiendo el mismo archivo es un defecto del reparto, no un accidente.** Rutas
relativas a `mantra-core-health/`, sobre la rama `mockup`.

| Ruta reservada | Para quién |
|---|---|
| `src/app/features/agenda/**` · `src/app/features/my-services/**` | **Pablo** |
| `src/app/features/clinical-record/patient-chart/medication-block/**` · `src/app/core/data-access/prescription-favorites/**` | **Justin** |
| `src/app/features/clinical-record/patient-chart/free-note-block/**` · `.../admission-block/**` · `src/app/features/clinical-record/consultation/**` | **Marcelo** |
| `src/app/shared/**` · `src/app/features/account/my-profile/**` | **Itzan** |
| `src/app/core/mock/**` · `src/app/features/dashboard/**` · `src/app/core/data-access/**` (menos `prescription-favorites`) | **Ender** |

Quien necesite un cambio en la ruta de otro **lo pide por el daily y no lo escribe**. Un cambio
acordado se anota en los dos dailies, con quién lo escribió.
