# Correcciones del doctor y del paciente — 2026-09-22

> **Este archivo es fuente, no análisis.** Según la regla 00 §8, un requisito explícito del cliente
> es la evidencia de **máxima** jerarquía: gana sobre el comportamiento del código, sobre los tests
> y sobre cualquier documentación de proveedor. Cuando algo de acá choca con lo que hace el sistema,
> **el sistema está mal**, no el requisito.
>
> Lo que **no** es fuente y por eso va en otro archivo: dónde vive cada cosa en el código. Eso está
> verificado, con archivo y línea, en
> [`VERIFICACION-CONTRA-CODIGO-2026-09-22.md`](../verificacion/VERIFICACION-CONTRA-CODIGO-2026-09-22.md).
> El orden de ejecución, las dependencias y el kill-test de cada observación están en el
> [`PLAN-MAESTRO.md`](../trabajo/2026-09-22-plan-y-reparto-correcciones-doctor-y-paciente/PLAN-MAESTRO.md).

## Ficha de procedencia

| Campo | Valor |
|---|---|
| Qué es | Observaciones del doctor (cliente) sobre la maqueta desplegada, más tres del flujo de reserva, tres de la pantalla de inicio del paciente y tres del menú lateral |
| Título del original | No tiene título único. Trae cuatro encabezados: `CORRECCIONES DE DOCTOR:`, `Flujo de reserva de cita:`, `Correcciones de paciente:` (con `PANTALLA DE INICIO`) y `NAVBAR LATERAL` |
| Quién lo entregó | El cliente (el doctor), vía Pablo |
| Cómo llegó | Pegado en la sesión de trabajo del **2026-09-22**, en un solo mensaje, junto con el pedido de armar el plan «en base a lo que ya se mejoró del front» y de traer `origin/dev` y `origin/mockup` |
| Fecha de redacción del original | **No consta.** No se infiere |
| Versión | **No consta.** Este archivo es la primera transcripción versionada |
| Estado | `REQUIREMENT_APPROVED` en cuanto a su origen. **Ninguna de las 19 observaciones está verificada contra el código en este archivo**: eso es el otro documento |
| Sobre qué rama aplica | **No lo dice el original.** Confirmado con Pablo en la sesión: **`origin/mockup`** (ver `Q-T1` del plan del trabajo) |
| Predecesor | [`CORRECCIONES-DOCTOR-2026-09-20.md`](./CORRECCIONES-DOCTOR-2026-09-20.md) — las 24 correcciones anteriores (`C-01…C-24`). Varias observaciones de hoy **vuelven sobre lo mismo** (C-05, C-06, C-09, C-21) y eso se declara en la cobertura, no se disimula |

### Cómo se transcribió — leer antes de usarlo

- El texto de cada observación es **palabra por palabra** el que entregó el cliente. **No se corrigió
  ortografía, ni tildes, ni redacción, ni se completaron frases cortadas.** Donde el original escribe
  «practica», «poque», «anadir», «depdneindo», «disxciplina», «imagenelogia», «receeta» o «intancias»,
  así queda. Los caracteres invisibles que trae el original después de algunos números también.
- Lo único agregado es el identificador y el encabezado Markdown, para poder citar por punto.
- **El número del ID es el del original** cuando el original numera. Hay **dos excepciones**, y se
  declaran: el bloque «Es necesario que siempre se siga la siguiente disciplina…» **no lleva número**
  y está entre el 7 y el 9 (el original salta del 7 al 9), así que se le asigna **`D-08` por
  posición**; y la línea «En la parte de credenciales debe ser lo mismo que lo anterior» **tampoco
  lleva número** y sigue al 9, así que se le asigna **`D-10` por posición**.
- Los prefijos son cuatro, uno por bloque del original: **`D-`** (`CORRECCIONES DE DOCTOR`),
  **`R-`** (`Flujo de reserva de cita`), **`P-`** (`Correcciones de paciente · PANTALLA DE INICIO`)
  y **`N-`** (`NAVBAR LATERAL`).
- Las mayúsculas sostenidas del original **se conservan**: son énfasis del cliente y borrarlas
  sería editar la fuente.

### Ambigüedades registradas sobre este documento

Ninguna se resuelve por conveniencia (regla 00 §1.7). Cada una tiene el supuesto con el que se
reparte y a quién hay que confirmárselo; viaja además al prompt de quien la tropieza.

| ID | Ambigüedad | Supuesto tomado | A quién confirmar |
|---|---|---|---|
| Q-1 | **D-01** «todas por igual»: ¿se retira la noción de «principal» sólo de lo que se ve en el perfil, o también del alta (`register-practitioner` pregunta «Especialidad principal (opcional)») y del contrato (`isPrimary` existe en la API)? | La **UI** deja de distinguir una principal en todas sus instancias (ficha, editor, insignia compartida, directorio); el **alta** deja de preguntarla; el **contrato** `isPrimary` **no se toca** (no se escribe API esta noche) y el front deja de mandarlo y de ordenar por él. Se registra la deuda de retirar la columna después | Doctor + Pablo (contrato) |
| Q-2 | **D-02** «Estado de la practica quitar»: ¿sólo de la ficha, o también del contrato, donde `practiceStatusConceptId` es obligatorio al crear y lo mueve la verificación? | Se quita **la fila visible** de «Datos personales». El dato sigue en el contrato y en la lógica de verificación; no se toca | Doctor |
| Q-3 | **D-03** «no tiene poque tener nada de correo de trabajo, ni telefono ni nada»: (a) se quitan de «Contacto» los datos **del trabajo** (correo de trabajo, celular del trabajo, fijo del trabajo) y quedan los personales, o (b) se quita la pestaña entera | **(a)**. Además, el correo de trabajo es la **identidad de acceso** («Es con el que entrás»): no puede desaparecer del producto; se muestra como «Correo de acceso», sólo lectura, en «Datos personales». Los tres campos del alta que dejan de tener pestaña pasan a `CAMPOS_DEL_ALTA_SIN_PESTANA` con su motivo, que es el mecanismo que el spec ya prevé | Doctor |
| Q-4 | **D-06** «el textfield de ubicacion debe ponerse en blanco»: lectura literal = **vaciar** el campo de texto de dirección cuando se toca el mapa; lectura alternativa = «volver a estado normal/limpio» (sin error, fondo blanco) | **Literal: se vacía.** Motivo: el punto del mapa no se geocodifica (el propio código lo dice: «no podemos convertirlo en el nombre de la calle») y un texto viejo al lado de un pin nuevo es exactamente lo que confunde. Si el doctor quería la otra lectura, el cambio es de una línea y se declara | Doctor |
| Q-5 | **D-08** paginación «anterior, siguiente y numero… ambos como select»: el organismo de tabla pagina **por cursor** por decisión documentada (sin total ni número de página, `CONTRATO-data-table.md` §10.2, 30 consumidores). | Se separan dos casos: las tablas del perfil son **listas locales** (decenas de filas ya en memoria) y se paginan **en cliente** con `app-pagination`, que sí tiene total, filas por página y ahora también select de página; los listados que la API pagina por cursor **conservan el cursor** y se declara la brecha. No se rompe un contrato con 30 consumidores para cumplir en tres tablas | Pablo (dueño del contrato) + doctor |
| Q-6 | **D-08** «scrolleable en y pero no en x»: choca con la decisión del propietario del 18/09/2026 escrita en el organismo (`sticky: 'end'` para que las acciones no se escondan detrás del scroll lateral) | Gana el pedido nuevo (regla 00 §8): la tabla **no desborda a lo ancho**; lo que no entra se pliega al detalle por prioridad (mecanismo móvil que ya existe, `MOBILE_DETAIL_PRIORITY`) y la caja tiene alto máximo con scroll vertical. La decisión del 18/09 se **reemplaza** en el ADR nuevo, con las dos fechas, no se borra | Propietario + doctor |
| Q-7 | **D-08** «Para cancelar igual es necesario que salga un modal para validar si el usuario quiere eliminar ese registro»: ¿«cancelar» es el botón Cancelar del modal de edición, o la acción de eliminar/retirar una fila? | Las dos, porque las dos tienen sentido y ya tienen mecanismo: **retirar una fila** pide confirmación (ya lo hace `work-history.quitarSede` y `retirarFila` del editor — se verifica ejercitando), y **Cancelar con cambios sin guardar** pregunta si se descartan (`dismissAttempt` de `content-dialog`) | Doctor |
| Q-8 | **D-09** «el ID de la institucion que lo emitio»: ¿el identificador de la institución del catálogo (el `select` que ya existe), o un número/código del diploma? | La institución **del catálogo**, mostrando su código junto al nombre; para las de fuera del catálogo queda el campo «¿Cuál?». El «Número / título» actual se conserva porque el alta lo pide | Doctor |
| Q-9 | **D-09/D-10** «se debe de poder adjuntar un archivo siempre»: el título y la matrícula ya llevan archivo al **agregar**, pero el modal de **editar** no lo ofrece; y las **especialidades** no tienen archivo ni en el contrato de la API (`practitioner_specialties` no tiene `file_id`) | Editar ofrece el archivo (reemplazar el existente) para título y matrícula contra el simulador; para especialidades el archivo se ofrece **sólo si el contrato lo soporta**: hoy no, así que se registra como **brecha de contrato con propuesta** y en la maqueta se simula con doble declarado (regla 65) | Pablo (contrato) + doctor |
| Q-10 | **R-02** «tarda demasiado» no trae medición ni umbral | Se mide **antes** de tocar: número de peticiones que dispara «elegir médico» × latencia simulada (hoy 120–300 ms aleatorios por petición). Objetivo declarado para la maqueta: la ficha del médico con su disponibilidad en **< 1 s** | Pablo |
| Q-11 | **P-01** «un dibujo como el mapa de bolivia… del paciente»: ¿reemplaza a las pastillas de zonas que ya existen, o convive? ¿Frente solo, o frente y dorso? ¿Silueta neutra? | **Convive**: la silueta es el selector principal y las pastillas quedan como equivalente por teclado y para las zonas que no son una parte del cuerpo («piel», «ánimo», «en general»). Una silueta **neutra y frontal** con las zonas anatómicas de la tabla existente. Se muestra el borrador al doctor antes de pulir | Doctor |
| Q-12 | **P-02** «texto escrito a mano o por voz»: «a mano» = tipeado (ya existe el `app-textarea`, hoy plegado en un `<details>`), o manuscrito (lienzo + reconocimiento, que no existe) | **Tipeado**, con el área **visible por defecto** (no plegada), y **dictado por voz** con la API de reconocimiento del navegador. Sin soporte (Firefox, SSR) el botón de voz no aparece, como ya hace `app-grabador` | Doctor |
| Q-13 | **P-03** «el panel de abajo que no sirve para nada»: la pantalla tiene, de arriba a abajo, síntomas · próxima cita · tira de resumen (última receta / última atención) · grilla de accesos «Ir a lo tuyo» | **La grilla de accesos** (último bloque): repite lo que el menú lateral ya ofrece. Se confirma con captura **antes** de borrar; si el doctor quiso decir la tira de resumen, el cambio es otro bloque | Doctor |
| Q-14 | **N-01** «a los iconos de la barra superior derecha» junto con **D-05** «CADA BOTON DE ACCION TIENE ICONO + NOMBRE»: en la cabecera los controles son íconos (campana, ajustes, cuenta) | En la cabecera se sigue la **excepción declarada** del ADR-0012: ícono con `aria-label` **y** `appTooltip`, como los que ya están; «Chats» además lleva el contador de no leídos. Y **se mueven**: dejan de ocupar renglón en el menú lateral, para las dos personas | Doctor |
| Q-15 | **N-02** «Cotizaciones»: la sección «Cotizaciones» que hoy existe es **del médico** (FT-24: presupuesto con plan de pagos para un paciente). Lo que describe el pedido —buscar por precio y cercanía, elegir la receta o la orden— es una pantalla **del paciente** | Es una sección **nueva del paciente**, «Cotizaciones», que **compone** lo que ya existe (`where-to-buy` para medicamentos con precio y distancia, `nearby-places` para cercanía, el directorio de laboratorios e imagenología, el arancel de referencia para servicios médicos). La del médico **no se toca**. Los «tres campos posibles» del texto enumeran **cuatro** verticales (servicios médicos, imagenología, análisis, medicamentos): se toman las cuatro | Doctor + Pablo |
| Q-16 | **N-02** precio de servicios médicos e imagenología: el único arancel del repo es el del Colegio Médico de Santa Cruz **en UMA**, y «UMA no es una moneda… su conversión a bolivianos no está declarada»; no hay precios publicados de imagenología ni de análisis con procedencia | El **mecanismo** (buscar, ordenar por precio y por distancia) se implementa; el **dato** sin fuente se muestra como «precio no publicado», nunca como un número inventado (regla 97.4.1). Qué fuente autoritativa se usa es **decisión de negocio** | Negocio, con fuente |
| Q-17 | **N-03** «Mis puntos se mueve a perfil del paciente como una nueva pestana»: la pantalla tiene ruta propia (`/my-account/loyalty`) a la que apuntan el chip de promociones y el menú | Pasa a ser la **quinta pestaña** de la ficha del paciente; la ruta se **conserva** y redirige a la pestaña (los enlaces existentes no se rompen); el renglón del menú se retira | Pablo |
| Q-18 | **D-04 y D-08** «TOMALO COMO GUIA DE TRABAJO A PARTIR DE AHORA» / «siempre»: ¿se aplica esta noche a las 30 tablas que instancian el organismo, o a las que el doctor nombra? | Esta noche se aplica donde el doctor lo pide («Configurar tu perfil» y «Dónde atiendo»); el patrón queda **publicado como ADR** con el inventario de las otras tablas y sus dueños para la oleada siguiente. La guía queda además en la memoria de trabajo del equipo | Pablo |
| Q-19 | **D-05** hay 78 botones sólo-ícono en 33 plantillas, y varios son excepciones declaradas del ADR-0012 (cerrar, quitar, página siguiente) con `aria-label` y globo | No se convierten a ciegas: cada uno se **re-audita** contra el ADR (excepción con motivo escrito al lado, o se le pone el texto). El paginador deja de ser excepción: «Anterior» y «Siguiente» con texto es lo que el propio D-08 pide | Doctor |
| Q-20 | **D-09** «en la misma pestana… los lugares donde trabaje»: en la ficha, el historial laboral es una **línea de tiempo**; en el editor la pestaña Trayectoria hoy sólo tiene formación | En el **editor**, «Lugares donde trabajé» es una **tabla** con la misma disciplina (modal, confirmaciones, buscador, paginación); la línea de tiempo de la ficha de lectura se conserva | Doctor |

---

# Texto del cliente

> `CORRECCIONES DE DOCTOR:`

## D-01

1. Datos personales, no es necesario una especialidad profesional principal sino todas por igual. 

## D-02

2. ⁠Estado de la practica quitar

## D-03

3. ⁠Informacion de contacto no tiene poque tener nada de correo de trabajo, ni telefono ni nada .

## D-04

4. ⁠Siempre que sean formularios que nacen de una accion en tabla deben tener si o si un modal, no deben aparecer abajo porque nadie los veria, y se ve como un bug. TOMALO COMO GUIA DE TRABAJO A PARTIR DE AHORA. 

## D-05

5. ⁠TRANSVERSALMENTE ASEGURARSE QUE CADA BOTON DE ACCION TIENE ICONO + NOMBRE

## D-06

6. ⁠Si una toca una direccion en el mapa, el textfield de ubicacion debe ponerse en blanco si o si como regla transversalmente en todas sus intancias. 

## D-07

7. ⁠El texto que esta debajo quitarlo, es innecesario aclara lo obvio: "Listo, guardamos esta direccion ... "

## D-08

> Sin número en el original; está entre el 7 y el 9.

Es necesario que siempre se siga la siguiente disciplina de comportamiento cuando tengamos una tabla con acciones: 1) Al editar cada fila debe abrir un modal que cargue los campos llenos habilitados para edicion y al modificarlo se activa el boton de confirmar. Una vez uno le da confirmar sale otro modal donde pregunta estas seguro que quieres confirmar estos cambios. Para cancelar igual es necesario que salga un modal para validar si el usuario quiere eliminar ese registro o no. Ahora en la parte superior siempre debe existir un buscador multicampo junto a filtros depdneindo del campo si es que hubiera y el boton de anadir en la parte derecha al final. Ahora la tabla debe ser scrolleable en y pero no en x porque sino la gente le resulta dificil de entender. FInalmente, debe existir paginacion al final, debajo de la tabla en la parte lateral derecha. esta debe mostar anterior, siguiente y numero. Debe poderse elegir la cantidad de filas por pagina y la pagina actual para hacer saltos especificos en la paginas posibles ambos como select, no campos input. En el caso especifico del doctor aplicar esta disciplina en el la petana de configurar tu perfil y donde atiendo.

## D-09

9. En agregar formacion “trayectoria” debe ser una tabla donde pone tipo de titulo, el ID de la institucion que lo emitio con la fecha de emision, con la misma disxciplina que estamos diciendo que queremos para donde atiendo, ahora en la misma pestana debe salir la misma logica para los lugares donde trabaje,  importante no olvidar que se debe de poder adjuntar un archivo siempre, ya sea png, jpg pdf, etc, son varios formatos

## D-10

> Sin número en el original; sigue al 9.

En la parte de credenciales debe ser lo mismo que lo anterior

> `Flujo de reserva de cita:`

## R-01

1. Al revisar médicos disponibles, y darle click no inhabilita el click dejando carga, sobrecargando el servidor dando clicks

## R-02

2. Mismo caso para elegir médico, tarda demasiado y eso que solo es mock

## R-03

3. Esto no es un bug pero si en el mockup crear doctores con horarios y definirlos para hacer flujos completos por favor

> `Correcciones de paciente: `
> `PANTALLA DE INICIO`

## P-01

1. Necesito que se vea un dibujo como el mapa de bolivia que se tiene pero que sea del paciente, y donde uno le de click identifique la parte del cuerpo que le duele a la persona y en base a eso recomiende un especialista. 

## P-02

2. ⁠Necesitamos un panel que permita ingresar texto escrito a mano o por voz. TEXT AREA. 

## P-03

3. ⁠Necesitamos que saques el panel de abajo que no sirve para nada.

> `NAVBAR LATERAL`

## N-01

1. Mover Tutoriales, Chats a los iconos de la barra superior derecha. ambos doctor y paciente

## N-02

2. Cotizaciones: Tiene que ser un buscador que permite buscar en los tres campos posibles servicios medicos, imagenelogia, analisis y medicamentos de forma que se pueda buscar ordenando las opciones segun precio o segun cercania. Luego debe haber un panel que permita seleccionar buscar especificamente elegir la receeta medica, la orden de analisis o la orden de servicio medico especifico igual buscando dos cosas precio y distancia.

## N-03

3. ⁠Mis puntos se mueve a perfil del paciente como una nueva pestana

---

# Cobertura — quién cubre cada observación

Esta tabla es el **kill-test del reparto**: una fila sin persona, sin lote o sin hito significa que
esa observación no está repartida, por más que aparezca nombrada en un daily.

| ID | Observación, en una línea | Persona | Lote | Hito |
|---|---|---|---|---|
| D-01 | Sin especialidad «principal»: todas por igual, en todas las instancias | **Itzan** | `Noche-PerfilMedico.ConfigurarTuPerfil` | H2 |
| D-02 | Quitar «Estado de la práctica» de la ficha | **Itzan** | `Noche-PerfilMedico.ConfigurarTuPerfil` | H2 |
| D-03 | «Contacto» sin datos del trabajo; el correo de acceso queda visible en otro lado | **Itzan** | `Noche-PerfilMedico.ConfigurarTuPerfil` | H2 |
| D-04 | Todo formulario que nace de una acción de tabla abre en modal, nunca abajo — **guía de trabajo** | **Pablo** (patrón, ADR-0015) + **Itzan** y **Pablo** (aplicación) | dos lotes | Pablo H2 · Itzan H4 · Pablo H4 |
| D-05 | Cada botón de acción con ícono + nombre, transversal | **Pablo** (re-auditoría y dueño del patrón ADR-0012) + **los cinco** (en sus archivos) | todos | Pablo H5 · Itzan H6 · Ender H5 · Justin H5 · Marcelo H5 |
| D-06 | Tocar el mapa vacía el campo de dirección, en todas las instancias | **Itzan** (patrón en `ubicacion-picker` y aplicación en perfil y alta) + **Pablo** (aplicación en «Dónde atiendo») | dos lotes | Itzan H5 · Pablo H4 |
| D-07 | Quitar «Listo, guardamos esta dirección…» | **Itzan** | `Noche-PerfilMedico.ConfigurarTuPerfil` | H5 |
| D-08 | La disciplina de tabla con acciones: modal de edición con confirmación, confirmación al eliminar, buscador + filtros + «Añadir» a la derecha, scroll sólo vertical, paginación con selects | **Pablo** (patrón: `data-table`, `filter-bar`, `pagination`, ADR-0015; aplicación en «Dónde atiendo») + **Marcelo** (el modal de confirmación, dueño de `content-dialog`/`dialog`) + **Itzan** (aplicación en «Configurar tu perfil») | tres lotes | Pablo H2, H3, H4 · Marcelo H4 · Itzan H4 |
| D-09 | Trayectoria como tabla (tipo, institución, emisión) con adjunto siempre; «lugares donde trabajé» en la misma pestaña | **Itzan** (formación, y montar el historial en la pestaña) + **Pablo** (el historial laboral como tabla con la disciplina, dueño de `work-history`) | dos lotes | Itzan H3 · Pablo H4 |
| D-10 | Credenciales igual que lo anterior | **Itzan** | `Noche-PerfilMedico.ConfigurarTuPerfil` | H4 |
| R-01 | Al revisar médicos disponibles, el clic no se inhabilita mientras carga | **Justin** | `Noche-ReservaYCotizaciones.DirectorioYPrecios` | H2 |
| R-02 | Elegir médico tarda demasiado en la maqueta | **Ender** (latencia y peticiones del simulador) + **Justin** (estado de carga y peticiones de la ficha) | dos lotes | Ender H2 · Justin H2 |
| R-03 | Doctores con horarios definidos en la maqueta para flujos completos | **Ender** | `Noche-SimuladorYCabecera.MockNavegacion` | H3 |
| P-01 | Silueta del cuerpo cliqueable que recomienda especialista | **Marcelo** | `Noche-InicioPaciente.SintomasYConfirmacion` | H2 |
| P-02 | Panel de texto libre, tipeado o por voz | **Marcelo** | `Noche-InicioPaciente.SintomasYConfirmacion` | H3 |
| P-03 | Quitar el panel de abajo | **Marcelo** | `Noche-InicioPaciente.SintomasYConfirmacion` | H3 |
| N-01 | Tutoriales y Chats a los íconos de la cabecera, doctor y paciente | **Ender** | `Noche-SimuladorYCabecera.MockNavegacion` | H4 |
| N-02 | Cotizaciones del paciente: buscador por precio y cercanía en cuatro verticales, y por documento | **Justin** (pantalla) + **Ender** (renglón del menú, a pedido de Justin) | dos lotes | Justin H3, H4 · Ender H4 |
| N-03 | Mis puntos como pestaña del perfil del paciente | **Itzan** (pestaña) + **Ender** (renglón del menú y redirección, a pedido de Itzan) | dos lotes | Itzan H7 · Ender H4 |

## Reserva de archivos — para que nadie se pise

**Dos personas escribiendo el mismo archivo es un defecto del reparto, no un accidente.** Rutas
relativas a `mantra-core-health/`, sobre la rama `mockup`. Las reservas del 2026-09-21 que siguen
vivas se **respetan**: lo de acá se suma sin intersección, y donde una pieza cambia de dueño respecto
de aquel reparto (por carril ya cerrado) se dice.

| Ruta reservada | Para quién |
|---|---|
| `src/app/features/account/my-profile/**` **menos** `work-history/**` · `src/app/features/account/loyalty/**` · `src/app/features/auth/registro-compartido/ubicacion-picker/**` · `src/app/features/auth/register-*/**` (las seis altas: ya suyas desde el 21/09; esta noche sólo D-01 en `register-practitioner`, y D-06/D-07 donde montan el mapa) · `src/app/shared/components/organisms/{specialty-badge,specialty-badge-grid}/**` · `organisms/{paginated-form,date-picker}/**` y `atoms/back-link/**` (D-05 en los suyos) · `src/app/core/mock/handlers/{profiles,files}.handlers.ts` | **Itzan** |
| `src/app/shared/components/organisms/{data-table,filter-bar}/**` · `src/app/shared/components/molecules/{pagination,row-actions}/**` (`pagination` era de Justin el 21/09; su carril cerró con el PR #573) · `src/app/features/account/my-profile/work-history/**` · `docs/adr/ADR-0015-*.md`, `docs/adr/index.md`, `docs/adr/CONTRATO-data-table.md` | **Pablo** |
| `src/app/features/directory/**` · `src/app/features/nearby-places/**` · `src/app/features/account/medical-record/where-to-buy/**` · `src/app/features/laboratory-directory/**` · `src/app/features/public-directories/**` · `src/app/features/account/cotizaciones/**` (nuevo, si se crea) · `src/app/shared/components/molecules/search-result/**` · `src/app/core/data-access/{public-directory,pharmacy,diagnostic-units}/**` · `src/app/core/mock/handlers/{directory,public,pharmacy,diagnostics}.handlers.ts` | **Justin** |
| `src/app/core/mock/mock-backend.interceptor.ts` · `src/app/core/mock/fixtures/{agenda,personas,registered-people}.ts` · `src/app/core/mock/handlers/scheduling.handlers.ts` · `src/app/core/navigation/**` · `src/app/features/shell-layout/**` · `src/app/shared/components/organisms/{header,notification-bell}/**` · `src/app/app.routes.ts` (**archivo de coordinación: sólo Ender escribe; los demás piden**) · los tres barrels `shared/components/*/index.ts` (como el 21/09) | **Ender** |
| `src/app/features/symptom-check/**` · `src/app/features/dashboard/patient-home/**` · `src/app/shared/components/organisms/body-map/**` (nuevo) · `src/app/shared/components/organisms/content-dialog/**` · `src/app/shared/components/molecules/dialog/**` | **Marcelo** |
| `mantra-core-health-api/**` · `mantra-core-health-model/**` | **NADIE esta noche.** Se leen y se citan; **no se escriben** |

Quien necesite un cambio en la ruta de otro **lo pide por el daily y no lo escribe**. Un cambio
acordado se anota en los dos dailies, con quién lo escribió.
