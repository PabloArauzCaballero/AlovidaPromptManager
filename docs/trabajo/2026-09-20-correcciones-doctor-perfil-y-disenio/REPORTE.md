# Reporte — El patrón de la casa: botones con texto, insignia de especialidad, y un perfil que se puede editar entero

> **AVANCE: 62 / 62 — 100 %.**

- Fecha: 2026-09-21 · Plan: [PLAN.md](./PLAN.md) · Rama: `itzan/patron-acciones-fila-insignia-perfil` (desde `origin/mockup` `68dcb562`)
- Cierre de H5.S3.M3, M4 y M5: 2026-09-22 · Rama: `itzan/captura-rechazo-por-campo` (desde `origin/mockup` `a0987d9f`) · PR #571
- Correcciones cubiertas: **C-01, C-02, C-05, C-06** (dueño del patrón), **C-09, C-21** (dueño de la regla)
- Peldaño de evidencia alcanzado: **`TESTED`** — el más bajo de las áreas en alcance. Lo fija el cuestionario con su desplegable, que la maqueta no dibuja (ver «No cubierto»). H5.S3.M3 subió a `VERIFIED` el 22/09. *Corrección:* hasta el 22/09 esta línea decía `VERIFIED` mientras reconocía un área en `TESTED`; el peldaño de un trabajo es el de su área más baja.

## Completado

| ID | Qué se logró (observable) | Comando de verificación | Resultado |
|---|---|---|---|
| **H1** (9/9) | Tres inventarios medidos con comando —botones sólo-icono, grupos de opciones y formas de pintar una especialidad— y la maqueta con capturas de línea de base | `git grep -o` por tipo, pegado en `evidencia/inventarios/` | PASS |
| **H2** (14/14) | `app-row-actions` publicado: icono **y** texto por opción, recorrible con teclado, con ejemplo de uso real, y la regla escrita en `docs/adr/ADR-0012` | `10/10` en navegador · `12 passed (12)` del componente · `58 passed (58)` de su primer uso | PASS |
| **H3** (9/9) | La especialidad se ve igual en todos lados: una insignia con icono, nombre y estado, en grid | Kill-test **0 restos** de forma vieja · `16/16` en 3 anchos × 2 temas · `23 passed (23)` | PASS |
| **H4** (10/10) | El perfil médico perdió «Cómo atendés» y los enlaces sueltos, y el consultorio propio se administra adentro, con su QR | **19/19** en navegador · `ruta=/my-account imagen=true` | PASS |
| **H5** (11/11) | El editor tiene las **siete** pestañas de la ficha y los 34 campos del alta están: 28 escribiéndose y 6 declarados uno por uno. El rechazo del servidor llega a **su** campo, observado en el navegador, y un intento que no llega al servidor ya no deja rechazos viejos pintados | **22/22** y **15/15** en navegador · `ficha=7 · editor=7` · editor `80/80` | PASS |
| **H6** (9/9) | La regla de «opciones = `select`» publicada como `ADR-0013` y anunciada, y aplicada en mis archivos: **13 → 11**; regresión, barrido y capturas cerradas | `git grep -o` antes y después · suite completa `556 / 6 903` · barrido `8/8` y `6/6` · capturas `24/24` | PASS |

El detalle microtarea por microtarea, con su evidencia literal, está en el
[PLAN.md](./PLAN.md): cada fila `HECHO` lleva su salida.

### Lo que hay que saber aunque no se lea el plan

**Cuatro veredictos cambiaron por una medición, no por una opinión.**

1. **«Telemedicina» casi se pierde en silencio.** Al quitar «Cómo atendés» (C-01)
   di por sentado que el dato seguía dicho en otro lado, porque había un chip que
   lo mostraba. Una prueba nueva salió en rojo: ese chip vive **sólo en el diseño
   de la ficha que ve otra persona**. Quitar la sección se lo habría borrado al
   dueño de la ficha. Ahora se estampa en su cabecera y **sólo cuando es
   verdadera**.
2. **De los dos botones que C-02 manda eliminar, en este corte existe uno.** El
   otro se declara ausente con el comando que lo comprueba; no se reporta como
   quitado algo que nunca estuvo.
3. **La premisa de H5 estaba vencida en el propio corte.** El encargo decía «4
   pestañas contra 6»; medido, eran **6 contra 7**, y la única que faltaba es la
   que no se puede hacer editable.
4. **El número de C-21 del encargo cuenta etiquetas de cierre.** Da 533 donde hay
   **92** controles reales. Repartir 533 habría inflado el encargo de cada uno
   por seis.

**Y tres veces el instrumento estuvo mal antes que el producto.** Las tres dieron
**verde sin haber mirado nada**, que es el modo de fallo que más caro sale:

- El recorrido de H4 preguntaba por «el panel» de la pestaña y recibía el primero
  del documento, que está oculto y vacío. **El kill-test habría pasado sin
  mirar.** Corregido a buscar el panel visible.
- El mismo recorrido abría el QR de una clínica ajena y lo daba por el del
  consultorio propio, porque la marca de la acción se repite en cada fila.
  Corregido, y endurecido: ahora exige la imagen del QR, que sólo el propio tiene.
- En H5, dos pasos sobre el guardado fallido estaban en verde **porque el
  guardado había funcionado**: acá el servicio simulado responde dentro de la
  aplicación, así que interceptar la red no intercepta nada. Rehechos con el
  interruptor que la propia maqueta trae.

## A medias

Ninguna. H5.S3.M3 cerró el 22/09: ver «Completado» y «Evidencia».

## Pendiente

Ninguna. Las 62 microtareas están en `HECHO`.

## Evidencia

Todo lo pegado sale de una corrida; nada está parafraseado.

```text
corepack yarn typecheck   → exit 0
corepack yarn lint        → exit 0
```

```text
Suite completa
 Test Files  3 failed | 553 passed (556)
      Tests  7 failed | 6896 passed (6903)
   Duration  319.37s
```

**Los 7 rojos son ajenos.** Cinco son esperas vencidas por competencia de
recursos —sus archivos pasan al correr solos, y las pruebas que caen cambian
de una corrida a otra—. Los 2 reales fallan **idéntico** con `src/` restaurado
al corte `68dcb562`: el del registro de médicos (HALL-I11) y el del resumen
contable, que sólo falla **los lunes** (HALL-I10). Detalle y mediciones en
`evidencia/h6/suite-completa-y-rojos-ajenos.md`.

```text
Barrido de consumidores, serial (--workers=1)
carril-insurance-portability   8/8 PASS
patient-coverage-copays        6/6 PASS
carril-27-editor-encuestas     BLOQUEADO — la maqueta no dibuja cuestionarios
alv-perfil-medico              se omite solo sin el servicio
carril-05-perfil-doctor        se omite solo sin el servicio
```

El barrido **encontró un roto mío** y por eso existe: el recorrido completo
de portabilidad seguía buscando los tres radios que C-21 convirtió en
desplegable. Corregido leyendo la opción marcada por su texto, sin bajar lo
que la prueba afirma. Detalle en `evidencia/h6/barrido-de-consumidores.md`.

```text
Capturas de cierre — el desplegable de formato, 3 anchos × 2 temas
RESULTADO: 24/24

Y la medición que salió de mirarlas:
== 375 px ==   hueco útil = 245 px
   SE CORTA   247 px   «PDF oficial certificado con código QR»
== 768 px / 1440 px ==  las tres opciones entran
```

```text
corepack yarn test --watch=false --include="src/app/features/account/my-profile/**/*.spec.ts"
 Test Files  17 passed (17)
      Tests  375 passed (375)
```

```text
Recorrido de H4 — el consultorio dentro del perfil
OK  C-01 kill-test: «Dónde atiendo» no muestra «Cómo atendés» — sección=false tele=false nuevos=false
OK  C-02 kill-test: el QR del consultorio propio se abre sin salir del perfil — ruta=/my-account imagen=true reemplazar=true
RESULTADO: 19/19
```

```text
Recorrido de H5 — el editor con todas las pestañas
OK  C-05 kill-test: el editor no tiene menos pestañas que la ficha
    ficha=7 [Datos personales · Contacto · Facturación · Dónde atiendo · Trayectoria · Credenciales · Actividad]
    editor=7 [los mismos siete, en el mismo orden]
OK  Q-I1: «Actividad» existe, enumera los cuatro y no ofrece ni un control — contadores=4 controles=0
OK  H5.S1.M3: el lápiz entra a editar en la misma pestaña que se miraba — pestaña=«Credenciales»
OK  H5.S3.M2: y el fallo se ve — aviso=«Error: Perfil — No se pudo guardar el cambio. Probá de nuevo.»
RESULTADO: 22/22
```

```text
C-21 en mis archivos, antes y después
antes:   app-chip 6 · radio-group 5 · radio-otro 1 · segmented-control 1   = 13
después: app-chip 6 · radio-group 3 · radio-otro 1 · segmented-control 1   = 11
```

**Índice de lo que hay en `evidencia/`:**

| Carpeta | Qué |
|---|---|
| `antes/` | Capturas de línea de base, el inventario de especialidades, el registro de «Cómo atendés» y los enlaces, las observaciones |
| `inventarios/` | Los dos inventarios transversales por dueño: C-06 y C-21 |
| `h2/` | Las capturas del componente de acciones de fila |
| `h4/` | (las capturas de H4 viajan en el diff del front, ver abajo) |
| `h5/` | El spec del mapa de campos antes y después · la tabla de los 34 campos del alta contra el editor |
| `h6/` | C-21 medido antes y después con la tabla de excepciones · la suite completa y por qué sus 7 rojos son ajenos · el barrido de consumidores · las capturas de cierre y la medición del rótulo que no entra |

**Las capturas de navegador viajan en el diff del repo del front**, que es donde
se revisan: `docs/frontend/evidence/insignia-especialidad/`,
`docs/frontend/evidence/consultorio-en-el-perfil/`,
`docs/frontend/evidence/editor-con-todas-las-pestanas/` y
`docs/frontend/evidence/formato-en-select/`.

### Cierre de H5.S3.M3, M4 y M5 (22/09)

```text
node rechazo-por-campo.mjs   (recorrido de navegador, sesión de la médica de la maqueta)
traza del borde: {"errorDeLaMaqueta":{"clase":"HttpErrorResponse","status":500},"errorEntregado":{"clase":"HttpErrorResponse","mismaClase":true,"status":400},"llegoUnExito":false,"mandoNombre":116,"mandoApellido":116}
OK    «Nombre» muestra SU mensaje y sólo el suyo — muestra=["name must be shorter than or equal to 100 characters"]
OK    «Nombre» queda enlazado a su mensaje por accesibilidad — aria-describedby→mensaje=true · aria-invalid=true
OK    «Apellido paterno» muestra SU mensaje y sólo el suyo — muestra=["lastName must be shorter than or equal to 100 characters"]
OK    ningún otro campo del panel muestra un mensaje ajeno — revisados=6 … derramados=[]
OK    el aviso general dice que hay campos marcados, una sola vez
OK    volver a lo guardado y apretar Guardar no deja mensajes de un valor que ya no está — quedan=[]
15/15 pasos en verde

corepack yarn test … practitioner-profile-edit.spec.ts   (ANTES del arreglo de H5.S3.M5)
AssertionError: expected 'taxId no existe en el padrón.' to be '' // Object.is equality
      Tests  2 failed | 78 passed (80)
corepack yarn test … practitioner-profile-edit.spec.ts   (DESPUÉS)
      Tests  80 passed (80)
corepack yarn test … my-profile/**/*.spec.ts
 Test Files  17 passed (17)
      Tests  380 passed (380)
corepack yarn typecheck → exit=0
corepack yarn lint → exit=0
```

Salidas completas en `evidencia/h5/`. Capturas en `mantra-core-health/docs/frontend/evidence/rechazo-por-campo/`: tres anchos y dos temas, más el ciclo rechazo → vuelta atrás → corrección. **Miradas**, no sólo tomadas.

Los `check-*.mjs` del repo se corrieron a mano, como pide su `CLAUDE.md`: `check-route-prefixes`, `check-tokens` y `check-contrast` en 0; `check-architecture`, `check-api-prefixes`, `check-form-pages` y `check-css-tokens` en 1, con **salida idéntica byte a byte** con las fuentes del corte `a0987d9f` (HALL-I18).

## No cubierto

Lo que se escribió y **no** se ejercitó, que es distinto de lo pendiente:

- **El rechazo por campo, contra la API real.** Se observó contra un **doble declarado del servidor**: el simulador de la maqueta hace fallar el guardado de verdad y, en el borde del servicio de datos, el cuerpo se reemplaza por el que la API manda ante un DTO inválido, con los mensajes literales de sus validadores. Lo que falta es verlo contra la API, y ahí hoy no todo llegaría a su campo (HALL-I15 y HALL-I16).
- **La suite completa no se volvió a correr** tras el arreglo de H5.S3.M5. El editor es una hoja —sólo lo importan la ruta y el índice generado del catálogo—, así que la regresión del área del perfil es su radio.
- **La corrección de un consultorio desde la pestaña nueva.** Se verificó que el
  bloque se monta, que sus acciones funcionan y que el QR se abre y muestra la
  imagen; **no** se ejercitó el ciclo completo de editar un consultorio, guardar
  y recargar desde ahí. Es el mismo componente que ya se usaba en su pantalla
  propia, así que lo que falta no es la lógica sino la observación en esta
  superficie.
- **El cuestionario con su desplegable, en pantalla.** La conversión está
  probada —sus pruebas pasan **sin tocarse**, que es la señal de que prueban el
  comportamiento y no el control— pero **no se pudo mirar**: la maqueta no
  dibuja cuestionarios, porque las preguntas se piden a un servicio que el
  simulador no contesta. Peldaño `TESTED`, no `VERIFIED`.
- **Los otros consumidores de `app-select`.** La regla C-21 cambió dos controles
  míos; el átomo no se tocó.
- **`fact-section`**: no se convirtió y no se pudo mirar, porque **nadie monta
  ese componente** (HALL-I9).

## Desvíos del plan

| Qué | Por qué |
|---|---|
| **H5.S3.M4 y H5.S3.M5 no estaban en el plan** | Salieron al cerrar H5.S3.M3: una captura del turno anterior que no mostraba lo que su nombre decía, y un defecto del mismo mecanismo que sólo se ve mirando el ciclo entero en el navegador. Entraron como microtareas propias, con su criterio y su DoD, en vez de arreglarse de paso |
| **«Actividad» no se hizo editable, pero la pestaña se agregó igual** | Un contador que se escribe a mano deja de contar. El kill-test de C-05 es contar pestañas; la respuesta que cumple las dos cosas es tenerla y decir en ella por qué no hay nada que escribir |
| **Tres campos del alta se muestran en el editor sin poder editarse** | El contrato de corrección no los acepta. Inventarles un campo que el guardado descarta sería prometer algo que no guarda; no mostrarlos deja a quien viene a corregirlos sin el dato y sin el motivo |
| **El mapa de campos no cambió ningún valor en H4, y sí cambió uno en H5** | En H4 los cuatro campos del consultorio ya apuntaban bien. En H5 el cruce campo por campo destapó que `sexAtBirth` apuntaba a una pestaña donde nunca estuvo |
| **Se corrigió el enlace del lápiz, que no estaba en ninguna microtarea como defecto** | H5.S1.M3 pedía *verificar* que el lápiz no cambia de pestaña. Sí cambiaba. Verificar y encontrar rojo obliga a arreglarlo, no a anotarlo |
| **Tres microtareas añadidas al plan sobre la marcha** | Trabajo no previsto que apareció al hacer: la guarda de la carga de afiliaciones, y dos migraciones de recorridos en H2. Cada una entró con su criterio y su DoD, no «de paso» |
| **`fact-section` y `paginated-form` no se convirtieron** | El primero no lo monta nadie; el segundo lo montan 52 plantillas y el control sale de la definición del campo. Cambiar ahí el valor por omisión cambiaría 52 formularios, varios de otros dueños |

## Riesgos residuales

| Riesgo | Impacto |
|---|---|
| **La pestaña «Dónde atiendo» enseña los mismos lugares dos veces**: el mapa arriba y la lista editable abajo. Las dos mitades están pedidas explícitamente (mapa el 19/09, lista en C-02) | Bajo. Mitigado renombrando el bloque de arriba para que no se lean como lo mismo. Si molesta, el camino es que el mapa absorba la lista — decisión de diseño (HALL-I7) |
| **La ficha volvió a tener una pestaña que edita**, apartándose de la decisión del 13/09 de que la ficha sólo muestra | Bajo y deliberado: es el pedido. Escrito en el código, con el argumento anterior conservado |
| **El rechazo por campo depende de que el servidor mande `details.violations`** | Medio. Es el contrato documentado del proyecto y lo que `errorToViewState` ya leía; si un endpoint usa otra forma, el mensaje sale por el aviso general —que es el comportamiento de antes—, no se pierde |
| **`app-paginated-form` sigue con tres controles de opciones sin convertir** | Bajo hoy, y es la decisión correcta; queda como trabajo declarado para quien defina la opción nueva |
| **A 375 px el rótulo más largo del desplegable de formato se corta por 2 px** | Bajo: pasa en una sola de las tres opciones, sólo en el ancho más chico y sólo con la lista plegada — al abrirla se ve entera y el nombre accesible siempre está completo. Como radios se partía en dos líneas, así que es un costo real de C-21. Medido y subido a `ADR-0013` con la regla de medir antes de convertir |

## Decisiones y ambigüedades

Las cinco están escritas con su supuesto y su dueño en el daily del turno
(`Itzan-Daily-Noche-2026-09-20.md`, §5 y §6). Resumen:

| ID | Qué se decidió sin confirmación | A quién confirmárselo |
|---|---|---|
| **Q-I1** | «Actividad» no se hace editable; la pestaña existe y explica por qué | Propietario |
| **Q-I2** | `/administration/my-practice` **sigue**, con su entrada de menú: C-02 pide el consultorio como pestaña, no que esa pantalla desaparezca | Coordinación |
| **Q-I3** | «Telemedicina» se reubica; «Pacientes nuevos» se retira, por cuarta vez y por el mismo motivo | Propietario, sólo si quiere el dato de vuelta |
| **Q-I4** | El documento y su departamento emisor se muestran y no se corrigen desde el perfil. **Dónde vive esa corrección está sin decidir** | Propietario + quien lleve la API |
| **Q-I5** | El sexo al nacer sale del mapa de campos: se pregunta en el alta y **la lectura del perfil no lo devuelve**, así que no hay dónde mostrarlo | Propietario + quien lleve la API |
| **Q-D8** | C-21 al pie de la letra **contradice un pedido anterior del mismo cliente que ya está implementado** (los chips de filtro de los cuatro directorios, 22/08). Se resolvió que ese pedido sobrevive como excepción declarada | Propietario |

## Hallazgos que le pegan a otros

Los nueve están en el daily del turno con su dueño. Los que bloquean a alguien:

- **HALL-I1** — C-06 no se cierra con los cinco lotes: **34 de 107** apariciones
  están en 12 archivos que no son de nadie, 20 de ellas en los formularios de
  alta.
- **HALL-I2** — el supuesto de que los cuatro esperan el componente de acciones
  **se cumple sólo para Pablo**: Justin, Marcelo y Ender tienen cero en su
  territorio.
- **HALL-I8** — el simulador de fallos no puede provocar un rechazo de validación
  con el campo adentro, que es el error que más le importa a un formulario.
- **HALL-I9** — `app-fact-section` es un organismo que **no monta ninguna
  pantalla**: quedó huérfano cuando `laboratory-detail` reimplementó su sección
  en línea.
- **HALL-I10** — el resumen contable **pide dos veces la misma ventana los
  lunes**, y su prueba se cae ese día: la semana arranca el lunes, así que «lo
  que va de la semana» es hoy. Barrido de los siete días: sólo el lunes da
  cinco ventanas distintas en vez de seis.
- **HALL-I11** — una prueba del registro de médicos se cae sola y arrastra
  otras dos cuando hay compañía: reinicia el `TestBed` **dentro** del test.
- **HALL-I12** — **un botón sólo-icono sin globo, en la cabecera, en 44
  rutas**: el interruptor de tema tiene nombre accesible y le falta la otra
  mitad de ADR-0012. Es una sola línea, y es el hallazgo de C-06 con más
  alcance de todos los que aparecieron esta noche.
- **HALL-I13** — **el chequeo de tipos del CI no puede pasar en un runner
  limpio.** El archivo que `component-stock.ts` importa lo genera un comando
  que el job `verificar` no corre (`.github/workflows/ci.yml:85` genera el
  entorno, no el índice de componentes) y que el repo ignora
  (`.gitignore:160`). Siete errores de tipos, y como los pasos son
  secuenciales, los doce chequeos siguientes no se ejecutan en ninguna rama.
  Idéntico en `dev`. Es agregar un comando al job; fuera de mi frontera.
- **HALL-I14** — **la suite crítica de navegador está en rojo para todo el
  repo**: 23 fallos en 8 de 10 specs, todos en autenticación, formularios de
  cuenta y navegación. `dev` da la misma secuencia exacta (`1 1 1 5 1 5 4 5`,
  `8 of 10 failed`) y las últimas doce corridas, de cuatro personas, terminan
  todas en `failure`. Medido y atribuido, no diagnosticado.
- **HALL-I15** — **contra la API real, todo guardado que toque el NIT o la razón social se rechaza
  entero.** El editor manda `taxId` y `taxHolderName` cuando cambian
  (`core/data-access/profiles/profiles.client.ts:484-485`); el DTO del médico no los declara
  (`mantra-core-health-api/src/modules/profiles/dto/update-practitioner-profile.dto.ts`) y la validación
  global corre con `forbidNonWhitelisted: true` (`mantra-core-health-api/src/main.ts:161`). La respuesta
  sería `property taxId should not exist`, que tampoco se ancla. Ninguna rama de la API los agrega.
- **HALL-I16** — **el rechazo más probable del formulario no llega a su campo.** El mensaje de los
  teléfonos en la API empieza con «El» (`update-practitioner-profile.dto.ts:60-61`), y `fieldOf` sólo
  ancla mensajes que empiezan con el nombre de la propiedad (`core/http/error-to-view-state.ts:199-216`).
- **HALL-I17** — **los mensajes del servidor se muestran crudos y en inglés** («lastName must be shorter
  than or equal to 100 characters»): `errorToViewState` pasa el texto tal cual
  (`core/http/error-to-view-state.ts:162-165`). Es de todo formulario que use ese mapeo.
- **HALL-I18** — **cuatro `check-*.mjs` salen en 1 en `mockup`**: `check-architecture`,
  `check-api-prefixes`, `check-form-pages` (2 formularios sin paginar) y `check-css-tokens` (3 tokens sin
  declarar). Salida idéntica byte a byte en el corte `a0987d9f`.
- **HALL-I19** — **toda página registra dos violaciones de CSP por un script en línea**, incluida una
  carga limpia de `/auth` sin sesión.

**HALL-I5 se cerró**: era el mismo defecto en el menú de preferencias de una
publicación, ese sí en mi territorio. Entró como microtarea propia (H2.S3.M7)
en vez de arreglarse de paso.
