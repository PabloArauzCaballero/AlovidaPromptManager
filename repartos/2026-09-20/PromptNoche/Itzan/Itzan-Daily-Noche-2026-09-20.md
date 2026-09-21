# Daily de Itzan — turno noche — 2026-09-20

> **AVANCE: 55 / 59 — 93,2 %.** ← primera línea, siempre. Sale de `microtareas HECHO / 59`,
> **nunca a ojo**. `A MEDIAS` cuenta como **no hecha**. `DESCARTADO` no suma: se declara aparte con su motivo.

- **Turno:** noche · **Fecha:** 2026-09-20 · **Persona:** Itzan
- **Encargo:** [El patrón de la casa: botones con texto, insignia de especialidad, y un perfil que se puede editar entero](Noche-CorreccionesDoctor.PerfilYDisenio/PatronDeBotonesInsigniaYPerfilEditable.md)
- **Correcciones que cubrís:** C-01, C-02, C-05, C-06 (dueño del patrón), C-09, C-21 (dueño de la regla)
- **Fuente del pedido:** [`CORRECCIONES-DOCTOR-2026-09-20.md`](../../../docs/requisitos/CORRECCIONES-DOCTOR-2026-09-20.md)
- **Verificación contra el código:** [`VERIFICACION-CONTRA-CODIGO-2026-09-20.md`](../../../docs/verificacion/VERIFICACION-CONTRA-CODIGO-2026-09-20.md)
- **Tus archivos reservados:** `src/app/shared/**` · `src/app/features/account/my-profile/**`

## 1. Lo primero — pegar acá la salida de la instalación del estándar

**Un turno que arranca sin esto arranca en `BLOQUEADO`** (sección 1 del encargo).

```text
$ ls .claude/skills | wc -l
180

$ ls .claude/rules/[0-9]*.md | wc -l
14

$ py -3 .claude/hooks/plan_gate.py --self-test
PASS  sin plan: bloquea codigo .ts
PASS  sin plan: bloquea codigo sin extension conocida
PASS  sin plan: permite .md
PASS  sin plan: permite bajo docs/
PASS  sin plan: permite bajo .claude/
PASS  sin plan: permite ruta fuera del proyecto
PASS  sin plan: ignora herramienta fuera de alcance
PASS  sin plan: evento sin file_path no bloquea
PASS  mensaje de bloqueo nombra la regla
PASS  con plan: permite codigo
PASS  plan ilegible: igual permite (no bloquea por formato)

plan_gate self-test: 11 PASS, 0 FAIL
```

**Dos desvíos declarados, no escondidos:**

1. **El conteo de skills da 180, no 176.** El checkout del frontend ya versiona **4 skills
   propias del equipo** (`project-design-system`, `visual-quality-gate`,
   `frontend-production-gate`, `fable-refactor-orchestrator`) más 3 agentes. 176 + 4 = 180.
   Las cuatro del equipo quedaron intactas y no hay colisión de nombre con ninguna de las 176.
   Preferí pegar 180 con la explicación antes que acomodar el número para que coincida.
2. **El intérprete es `py -3`, no `python`.** El `settings.json` del estándar invoca `python`, que
   en este entorno no resuelve. Los candados quedaron registrados con el intérprete correcto en un
   archivo de configuración local; con el comando original no habrían corrido nunca y el turno
   habría parecido protegido sin estarlo.

**Cómo se instaló sin tocar el repositorio del equipo.** El frontend versiona su propio
`.claude/settings.json` (5 marketplaces y 15 plugins). No se sobrescribió: los candados del
estándar se registraron en un archivo de configuración local que el repositorio ya ignora, y que
se fusiona por encima sin pisar claves — las del estándar y las del equipo no se solapan. Los 176
directorios de skills quedan fuera del control de versiones por exclusión local. Verificación:
`git status --porcelain` vacío y los 8 archivos del equipo sin un byte de cambio.

- [x] Leí `skills-router` y las skills de las dos tablas de mi encargo.
- [x] Creé mi `PLAN.md` **antes** del primer `Edit`/`Write` de código.

## 2. El corte que fijaste

```text
$ git fetch origin && git log -1 --format='%H %ad %s' origin/mockup
68dcb562ef3dd74de03f4887c57fd836fb21be13 Sun Sep 20 20:59:15 2026 -0400 docs(deploy): documentar Traefik por IP en vez del dominio sslip.io de Coolify
```

**Corte de referencia del reparto:** `689697821a6e6d2c8f702c7508d6728fa9a1869a` (PR #554,
2026-09-20T12:32-04). Si el tuyo es otro, **el tuyo manda** y lo declarás acá.

**El mío es otro: `68dcb562`**, un commit adelante del de referencia. Rama de trabajo
`itzan/patron-acciones-fila-insignia-perfil`, base del PR `mockup`.

## 3. Checkpoints — uno por apertura y por cierre de microtarea

Formato de la regla 50. **Prohibido encadenar más de 3 operaciones materiales sin checkpoint.**

```text
AVANCE — Itzan — <fase> — <ID de microtarea>
- Hecho:      <qué quedó, concreto>
- Evidencia:  <comando / ruta / "ninguna todavía">
- Ahora:      <la siguiente acción, una sola>
- Bloqueo:    ninguno | <qué bloquea y de quién depende>
- Estado:     TODO | EN CURSO | HECHO | A MEDIAS | BLOQUEADO | DESCARTADO
- Peldaño:    UNKNOWN | DISCOVERED | WRITTEN | RUNS | TESTED | VERIFIED | REGRESSION_VERIFIED
```

<!-- Pegá tus checkpoints debajo de esta línea, el más reciente arriba. -->

```text
AVANCE — Itzan — CIERRE DEL TURNO — 59/60 (98,3 %)
- Hecho:      H6.S3 cerrado: suite completa, barrido de consumidores y
              capturas miradas. Además se cerró HALL-I5 como microtarea
              propia (H2.S3.M7) en vez de arreglarlo de paso.
- Evidencia:  typecheck 0 · lint 0 · suite 556 archivos / 6 903 pruebas con
              7 rojos, los 7 ajenos y los 2 reales comprobados idénticos en
              el corte base · barrido 8/8 y 6/6 · capturas 24/24 · área del
              perfil 378/378.
- Ahora:      nada: el turno cierra. Queda H5.S3.M3 en A MEDIAS por la
              captura que la maqueta no puede producir.
- Bloqueo:    ninguno que dependa de alguien para seguir.
- Estado:     HECHO 59 de 60 · A MEDIAS 1
- Peldaño:    TESTED (lo fija H5.S3.M3; el resto del alcance está en VERIFIED)
```


```text
AVANCE — Itzan — H6 — H6.S1 / H6.S2
- Hecho:      La regla de «opciones = select» publicada como ADR-0013 y
              anunciada en el daily de equipo (§4-ter), y aplicada: 13 → 11.
- Evidencia:  git grep antes y después · typecheck 0 · lint 0 · las pruebas de
              los dos componentes convertidos en verde.
- Ahora:      H6.S3 — regresión, barrido y capturas de cierre.
- Bloqueo:    ninguno.
- Estado:     HECHO seis de nueve
- Peldaño:    TESTED
```

**El kill-test del hito es que Pablo pueda contestar solo si un toggle viola C-21.** La regla
abre con un árbol de tres preguntas, para que no haya que leer el resto: *¿elige algo? ¿es el
sí/no de una afirmación? ¿esconder las opciones pierde información?* Un toggle contesta «sí» a
la segunda, y ahí termina.

**C-21 y C-10 no se contradicen, pero C-21 sí contradice otra cosa.** El encargo me pedía
resolver la tensión con los toggles, y esa era la fácil: alternar no es elegir de una lista.
La que apareció al medir es más incómoda — **C-21 al pie de la letra deroga un pedido anterior
del mismo cliente que ya está implementado**: los chips de filtro de los cuatro directorios, del
22/08. Resolví que sobreviven como excepción declarada, porque su argumento sigue siendo cierto
—un desplegable esconde las opciones y entonces nadie sabe que puede acotar— pero **es una
lectura mía y está escrita como supuesto**, no como hecho. Si el propietario dice que no, son
dos pantallas y el cambio es quitar un `asChips`.

**Lo que más me sorprendió de aplicar la regla: la mitad de mis apariciones no eran opciones.**
Tres de los seis chips de mi territorio son datos que se muestran —«atendés por telemedicina»,
los idiomas—, y ahí no hay nada que elegir. Eso no estaba en los tres casos que el encargo pedía
escribir, y es el que más se va a usar: agregué un caso cero para que nadie convierta una
insignia en un desplegable por cumplir el número.

**De trece quedaron once, y ninguno de los once es deuda.** Dos son el atajo que el cliente pidió
ver, y su componente **ya tiene el desplegable por omisión** —el chip es opt-in explícito, así
que C-21 ahí ya estaba cumplido antes de que yo llegara—. Uno es una escala, que no es una lista:
el orden y la distancia son el dato. Uno es un sí/no. Y tres son de un componente que **montan 52
plantillas** y que recibe su control desde la definición del campo: cambiar el valor por omisión
ahí habría cambiado 52 formularios de golpe, varios de otros dueños.

**Y convertir destapó un verde falso que ya estaba ahí.** La prueba de la exportación elegía el
formato escribiendo `BUNDLE` en el `value` del `<option>`, donde `app-select` pone el índice: no
casaba con nada, el desplegable se quedaba como estaba, y la prueba pasaba igual porque las dos
descargas las decide la respuesta y no la selección. Ahora elige por el texto que se ve **y**
comprueba que el formulario mandó `format: 'BUNDLE'`. La prueba quedó más fuerte que antes del
cambio, que es lo mínimo que se le puede pedir a una migración.

```text
AVANCE — Itzan — H5 — H5.S1 / H5.S2 / H5.S3
- Hecho:      El editor tiene las siete pestañas de la ficha, y los 34 campos
              del alta están: 28 escribiéndose y 6 declarados uno por uno.
- Evidencia:  22/22 en navegador (3 anchos × 2 temas) · 375 pruebas del perfil ·
              typecheck 0 · lint 0. Tabla campo por campo en evidencia/h5/.
- Ahora:      H6 — «opciones = select», regresión y cierre.
- Bloqueo:    ninguno. H5.S3.M3 queda A MEDIAS: falta la captura, ver abajo.
- Estado:     HECHO ocho de nueve · A MEDIAS una
- Peldaño:    VERIFIED
```

**El kill-test era contar.** La ficha tiene siete pestañas y el editor tenía seis. Ahora tiene las
siete, y la que faltaba —«Actividad»— **no se hizo editable**: los cuatro son cuentas de lo que la
persona ya hizo, y un contador que se escribe a mano deja de contar. Lo que cambió es que la
pestaña existe y lo dice. Antes, quien la buscaba no encontraba nada y tampoco el motivo; ahora
encuentra los cuatro, qué cuenta cada uno y qué hay que hacer para que el número se mueva. Un
«no se puede» explicado en la pantalla vale más que el mismo «no se puede» enterrado en un informe.

**El lápiz prometía algo que no cumplía.** El editor decía en su propio comentario que se abre en
la pestaña que uno venía mirando. No era cierto: el enlace no le pasaba nada, así que desde
«Credenciales» se entraba a editar en «Datos personales». Y arreglarlo no era pasar el número: la
ficha suprime «Facturación» cuando no la tiene, así que a partir de ahí las dos numeraciones dejan
de coincidir y el índice crudo habría mandado a la pestaña equivocada. Se traduce por etiqueta.

**El cruce campo por campo dio dos cosas que no se ven mirando el editor.** La primera: el número
del SEDES **no necesita un campo nuevo** —es otra matrícula, con la autoridad «SEDES», que ya es
una de las tres opciones del formulario—, así que agregarlo habría sido duplicar lo que ya existe.
La segunda: el sexo al nacer estaba declarado como si se mostrara en «Datos personales», **y ahí
no está** — la lectura del perfil no devuelve el dato. El mapa decía una cosa y la pantalla otra;
se corrigió el mapa y quedó registrado, porque que alguien no pueda ver lo que declaró en el alta
no es un detalle de formato.

**Seis campos del alta no se pueden escribir, y ninguno por decisión del formulario.** Dos son
llaves de la cuenta y tienen su propio trámite; uno se cambia en la ficha; y tres —documento,
departamento emisor y sexo al nacer— no los acepta el contrato de corrección. Inventarles un campo
que el guardado descarta sería prometer algo que no guarda. Lo que sí se hizo: **los tres que se
pueden leer ahora se ven en el editor**, sin control y con la razón al lado.

**Y el guardado rechazado no decía nada útil.** Un `PATCH` que volvía mal mostraba «No se pudo
guardar el cambio. Probá de nuevo.» y **tiraba el detalle entero**, con quince campos en el mismo
formulario. Ahora el rechazo se reparte por campo y el mensaje aparece debajo del que nombra —hay
una prueba que mira el DOM, no sólo el valor, porque un `errorMessage` enlazado al campo de al
lado se equivoca en silencio—. Lo que falta es verlo: el simulador de fallos de la maqueta tiene
cinco clases y ninguna es un rechazo de validación con el campo adentro (HALL-I8).

**Dos veces me salvó desconfiar del instrumento.** El recorrido daba dos pasos en verde sobre el
guardado fallido; los dos eran mentira. Acá el servicio simulado responde **dentro** de la
aplicación, así que interceptar la red no intercepta nada: el guardado había funcionado y el aviso
que yo leía como «falló» era el de éxito del intento anterior. Se rehizo con el interruptor que la
propia maqueta trae para esto, y recién ahí los pasos dicen algo.

```text
AVANCE — Itzan — H4 — H4.S1 / H4.S2 / H4.S3
- Hecho:      «Cómo atendés» fuera, los enlaces sueltos fuera, y el consultorio
              propio administrable dentro del perfil, con su QR.
- Evidencia:  19/19 en navegador (3 anchos × 2 temas) · 359 pruebas del perfil ·
              8/8 del mapa de campos antes y después · typecheck 0 · lint 0.
- Ahora:      H5 — el editor completo.
- Bloqueo:    ninguno.
- Estado:     HECHO las diez
- Peldaño:    VERIFIED
```

**Los dos kill-tests del hito, ejecutados sobre la pantalla.** «Dónde atiendo» ya no dice
«Telemedicina» ni «Pacientes nuevos» (`sección=false tele=false nuevos=false`), y el QR del
consultorio propio se abre **sin salir del perfil** (`ruta=/my-account imagen=true`).

**Una prueba que escribí para el cambio me impidió romper algo en silencio.** Al quitar la
sección di por sentado que «Telemedicina» seguía dicha en otro lado, porque había un chip que la
mostraba. La prueba salió en rojo: ese chip vive **sólo en el diseño de la ficha que ve otra
persona**, no en la propia. O sea que quitar la sección le habría borrado el dato al dueño de la
ficha, que es exactamente la pérdida callada que el hito prohíbe. Ahora se estampa en la cabecera
propia y **sólo cuando es verdadera** — anunciar el valor por omisión de alguien que nunca tocó
ese ajuste es afirmar algo que no dijo, que es la misma razón por la que «Pacientes nuevos» ya se
había retirado de otros tres lugares antes de este pedido.

**Y mi guion de comprobación dio 9 de 19 con casi todo respondido «no está» — incluido el
kill-test, que habría pasado en verde sin haber mirado nada.** La pestaña deja en la página los
siete paneles y oculta seis; pedir «el panel» devuelve el primero, que está vacío. Un kill-test
que pasa porque busca en el lugar equivocado es peor que no tenerlo. Se corrigió a buscar el
panel visible, y recién ahí las respuestas significan algo.

**El mismo problema, en otra forma, casi me hace declarar el QR de otro consultorio.** La marca de
la acción se repite en cada fila, y las sedes ajenas —que llevan sus acciones a la vista— aparecen
antes en la página. El guion abría el QR de una clínica ajena y lo daba por el propio. Se corrigió
apuntando al desplegable de la fila propia, y de paso la comprobación se endureció: ahora exige la
imagen del QR, que **sólo** el consultorio propio tiene cargada. Una fila equivocada ahora falla
en voz alta.

**Lo que no hace falta construir dos veces.** La pantalla que el doctor nombra («todo lo que
ofrece esa view») es literalmente un encabezado más el mismo componente de consultorios que ya
existe. Así que la pestaña monta **ese** componente, no una copia: un arreglo llega a las cuatro
superficies, y no hay un segundo formulario del QR que se desincronice.

**Eso introdujo un costo, y lo pagué en vez de dejarlo.** Con el componente montado dos veces en
la ficha, una lista que nunca se dibuja se pedía igual: la carga de afiliaciones no tenía la
guarda que su gemela de sedes sí tenía. Eran dos peticiones inútiles por visita al perfil. Entró
al plan como microtarea propia con su criterio —no «de paso»— y quedó fijada con una **aserción
nueva** en su prueba, no sacando la vieja.

**De los dos botones que nombra la corrección, en este corte existe uno solo.** El otro se declara
ausente con el comando que lo comprueba, no se reporta como quitado. Y el que existía estaba
rotulado con el nombre de una pantalla y apuntaba a la otra, así que sacarlo satisface las dos
mitades del pedido de una vez. Su argumento viejo —era el único acceso a esa pantalla— se honró:
el reemplazo se construyó y se vio funcionando **antes** de sacar el enlace, y el razonamiento
anterior quedó escrito en el código en lugar de borrado, para que el que venga vea que hubo una
decisión y no una distracción.

**El mapa de campos no cambió ningún valor, y ese era el resultado correcto.** Los cuatro campos
del consultorio ya apuntaban a «Dónde atiendo»; después del cambio apuntan con más verdad, porque
antes esa pestaña mostraba sólo el mapa de sedes —que no enseña el municipio suelto— y ahora
muestra el bloque donde los cuatro se ven y se corrigen. Se agregó la prosa que lo explica y el
spec pasa igual, sin tocarlo. Un diff por tener un diff habría sido ruido.

```text
AVANCE — Itzan — H3 — H3.S1 / H3.S2 / H3.S3
- Hecho:      La insignia de especialidad existe y el perfil tiene UNA sola forma.
- Evidencia:  kill-test 0 restos · 16/16 en navegador (3 anchos × 2 temas) ·
              23 pruebas del componente · 353 del perfil · typecheck 0 · lint 0.
- Ahora:      H4 — «Cómo atendés», los enlaces sueltos y el consultorio como pestaña.
- Bloqueo:    ninguno.
- Estado:     HECHO las nueve
- Peldaño:    VERIFIED
```

**El kill-test del hito era: abrí el perfil y contá cuántas formas distintas de mostrar una
especialidad quedan.** Quedan cero de las viejas y una nueva. Antes eran **cinco** —el encargo
decía tres— y el color dependía de **quién mirara**: en la ficha propia lo repartía un hash del
nombre, en la que ve un paciente iban todas grises.

**Tres cosas que sólo aparecieron al hacerlo, no al planearlo.**

La primera me corrigió a mí. Había decidido el tono con el contraste medido: los siete tonos del
sistema pasan 4,5:1 en los dos temas, así que elegí `neutral` para las no principales. Al abrir el
archivo para migrarlo, un comentario decía que **el cliente pidió dejar de ver ese gris**
(19/09). El número no alcanzaba: el argumento que faltaba estaba escrito en el código. Quedó
`secondary`, que no es gris y no significa un estado.

La segunda la encontré **mirando la captura**, no corriendo un test: el nombre se apilaba letra
por letra en vertical. «Cardiología» ocupaba once renglones. El sello y «Principal» no se encogen,
así que se quedaban con el ancho y al nombre le tocaba lo que sobraba. Los 353 tests estaban en
verde mientras la pantalla se veía así.

Y mi propio instrumento estaba mal: medía `scrollWidth > clientWidth`, que detecta un texto
recortado y **no ve uno apilado**. Lo cambié por contar renglones. Un instrumento que no puede
fallar tampoco puede encontrar nada.

**La tercera es la que más me importa.** Migré cinco formas y la suite pasó de **350 en verde a
350 en verde**. Ninguna prueba se enteró. Eso no es que el cambio sea seguro: es que nadie estaba
mirando. Agregué tres pruebas —que la especialidad se pinta con la insignia, que no queda ningún
chip a mano, y que el tono es el mismo para el dueño y para quien visita— porque una suite que no
nota el cambio tampoco va a notar la vuelta atrás.

**Lo que decidí NO migrar, y por qué.** En «Credenciales» del perfil propio la especialidad no se
muestra como especialidad: es una credencial más, en la misma tarjeta que la habilitación, los
idiomas y los títulos. Uniformarla ahí rompería la coherencia de esa lista para ganar la del
resto. Está dentro de mi alcance y aun así lo dejé escrito en vez de hacerlo: es una decisión de
producto, no una de implementación.

Y el descarte previo dio una sorpresa: **el encargo nombra cuatro piezas candidatas y hay una
quinta**, `status-seal`. No la encontré leyendo el encargo sino buscando de dónde sale el dato —el
tipo que alimenta la pantalla ya la tenía adentro—. La insignia termina reusando tres piezas y sin
duplicar ninguna; lo único nuevo que aporta es componerlas.

```text
AVANCE — Itzan — H1.S3 — H1.S3.M1 / M2 / M3
- Hecho:      El inventario de especialidades, el descarte escrito y la línea de base.
- Evidencia:  25 renderizados clasificados de 330 menciones · typecheck 0 · lint 0 ·
              17 archivos y 350 pruebas de `my-profile/` en verde.
- Ahora:      H3.S1 — la anatomía y los tonos de la insignia.
- Bloqueo:    ninguno.
- Estado:     HECHO las tres
- Peldaño:    VERIFIED
```

**330 menciones no son 330 lugares donde se pinta una especialidad.** La mayoría son rótulos de
campo y nombres de control. Clasificadas, quedan **25 renderizados en 7 plantillas**. Un
inventario que cuenta menciones le da a H3 un objetivo trece veces más grande que el real y
esconde el que importa.

Tres cosas que salieron de medirlo:

1. **En el perfil hay cinco formas, no tres.** El encargo decía tres.
2. **Hay dos reglas de tono, y la que se aplica depende de quién mira.** No están en la misma
   pantalla: son dos ramas del mismo componente separadas por `esPropio`. En la propia el color
   se reparte por un hash del nombre; en la pública todas van grises. La misma especialidad del
   mismo médico cambia de color según quién la mire, y ese color no significa nada en ninguno de
   los dos casos.
3. **Hay una quinta pieza candidata que el encargo no nombró**, y es la que más cerca estaba:
   `organisms/status-seal/`. No la encontré leyendo el encargo, la encontré **buscando de dónde
   sale el dato**: el tipo que alimenta la pantalla ya la tiene adentro (`sello:
   StatusSealVariant`). La insignia no va a inventar su forma de decir «certificada»: monta el
   sello que el perfil ya usa.

Del descarte de las cuatro, dos se reusan y dos no, y los motivos no son de aspecto. `badge`
queda afuera porque su `role="status"` es una región viva: anunciaría ocho especialidades al
pintarse. `specialty-browser` queda afuera porque **elige** una especialidad de un catálogo, y
la insignia **muestra** las que alguien ya tiene. No es una versión chica del mismo problema.

**Y me corregí a mí mismo con el navegador.** El primer borrador decía «dos chips en la misma
pantalla». Al ir a medirlo, la segunda rama no aparecía por ningún lado — porque no es la misma
pantalla. Lo que la medición corrigió no fue un número: fue el diagnóstico. Y la rama pública
quedó **leída y no medida**, dicho así, porque su ruta está restringida a otro rol y no la vi.

La línea de base de gates declara qué foto es: se tomó **con H2 ya dentro**, porque el orden de
ejecución puso H2 primero. Un baseline que no dice desde cuándo mide no sirve para atribuir
nada.

```text
AVANCE — Itzan — H2.S3 — H2.S3.M5
- Hecho:      El tercer recorrido deja de estar a medias: ejecutado paso a paso.
- Evidencia:  10/10 sobre la pantalla · typecheck 0 · lint 0.
- Ahora:      H1.S3 — el inventario de especialidades y el descarte escrito.
- Bloqueo:    ninguno.
- Estado:     HECHO
- Peldaño:    VERIFIED
```

Lo había dejado `A MEDIAS` porque el archivo se saltea solo sin servidor. Al volver sobre él
separé dos cosas que había mezclado: **lo que el archivo comprueba en la pantalla** y **lo que
comprueba del servidor**. Lo primero se puede ejecutar; lo segundo no, y no se puede sustituir
sin volverlo mentira.

Así que ejecuté el escenario **paso por paso, con los mismos selectores y en el mismo orden**:
se alcanza «Dónde atiendo», se carga el consultorio, la dirección se ve en MAYÚSCULAS sin
haberse guardado así, y el retiro pasa por el desplegable de esa fila. **10/10**, con la cadena
nueva ejercida dos veces.

**Y ahí se cayó lo importante: el archivo estaba roto desde antes, y no por la API.** Iba a
`/my-account`, que es la ficha, y la ficha monta ese componente en modo «historial» las dos
veces que lo monta — el bloque de sedes no se renderiza ahí. Si no lo encontraba, abría
«Trayectoria», donde tampoco está. Medido en el navegador antes de tocar nada. Los dos
corregidos, y la corrección verificada corriendo, no leyendo.

Me interesa el orden en que pasó: **declararlo `A MEDIAS` fue lo que lo salvó.** Si lo hubiera
dado por hecho, esos dos defectos seguirían ahí esperando a que alguien levante la API para
descubrir que el problema nunca fue la API. Un estado honesto no es una disculpa por lo que
falta: es lo que hace que se vuelva.

Lo que sigue sin ejecutarse son dos pasos que **no son de pantalla**: dar de alta el profesional
de prueba y comprobar que la sede sobrevive a recargar. Existen para probar que el servidor
guardó. Cambiarlos por datos de maqueta los dejaría en verde sin probar nada — que es
exactamente lo que su cabecera dice que no quiere ser.

```text
AVANCE — Itzan — H2.S3 — H2.S3.M5 / M6
- Hecho:      Los recorridos de navegador migrados al patrón, y el aviso del QR legible.
- Evidencia:  «Dónde atiendo» 20/21 · QR bancario 23/23 (claro y oscuro) · contraste
              de 3,09:1 a 8,29:1 en claro y de 4,76:1 a 10,93:1 en oscuro.
- Ahora:      H1.S3 — el inventario de especialidades y el descarte escrito.
- Bloqueo:    ninguno.
- Estado:     M5 A MEDIAS · M6 HECHO
- Peldaño:    VERIFIED
```

Los tres recorridos apuntaban al botón. Ahora preguntan por la **acción**, con su código:
preguntar por la forma los rompería cada vez que una sede gane o pierda una acción, aunque la
pantalla siguiera andando.

**M5 queda `A MEDIAS` y no `HECHO`.** Dos de los tres corrieron; `alv-perfil-medico` está
migrado pero **no ejecutado**: se saltea solo cuando no hay dónde registrar la sede, que es su
propia condición de arranque. El archivo está listo; lo que falta es correrlo donde esa
condición se cumpla. Declararlo hecho sería declarar hecho algo que nunca vi correr.

El recorrido del QR medía la tinta del glifo a 3:1, el umbral de un objeto gráfico. Ese glifo
ya no existe, así que ahora mide el **aviso en palabras** de la fila a 4,5:1, el umbral del
texto chico. Y ahí saltó un defecto que estaba desde antes y que nadie había medido: **3,09:1**.
No lo heredé sin más — mi cambio lo volvió la señal principal, porque el ámbar del glifo que lo
duplicaba se fue con el botón. Entró al plan como M6 y se corrigió usando la tinta semántica del
sistema en vez de un escalón suelto de la rampa.

```text
AVANCE — Itzan — H2.S3 — H2.S3.M1 / M4 · H2.S2 — H2.S2.M2 / M4
- Hecho:      Primer uso real en «Dónde atiendo», con su spec migrado y el teclado verificado.
- Evidencia:  10/10 en navegador · specs 70/70 (12 + 58) · typecheck 0 · lint 0 ·
              `molecules/menu/` sin tocar.
- Ahora:      H2.S3.M5 — los tres recorridos de navegador.
- Bloqueo:    ninguno.
- Estado:     HECHO las cuatro
- Peldaño:    VERIFIED
```

**El primer uso real encontró tres defectos del componente que la lectura no había encontrado.**
Ese es el argumento para aplicarlo en un archivo propio antes de repartirlo, y por eso el
encargo lo pide:

1. **La forma en fila no tenía nombre accesible.** El disparador sí, y con el argumento que
   ahora vale igual para los botones sueltos: veinte «Retirar» son veinte botones idénticos
   para quien no ve la pantalla. La documentación del componente defendía el punto y el código
   lo cumplía en una sola de las dos formas.
2. **La destructiva iba en rojo lleno.** Lo vi en la captura, no en un test: tres «Dejar de
   atender» rojos, uno debajo del otro, con la acción más peligrosa siendo lo más gritón de la
   pantalla. Y el CSS que yo mismo había borrado ya lo decía: *«sólo al apuntarlo, para que
   cuatro filas no se lean como cuatro advertencias»*. Reintroduje el problema que ese
   comentario había resuelto.
3. **Desbordaba a 375 px.** `scrollWidth` 383 contra 375. Comprobado contra el corte con una
   sonda que no usa los selectores nuevos —una que sólo funcione con el código nuevo no puede
   decir si el desborde es nuevo—: en el corte daba 375/375. **Era mío**, y lo dije así.

El spec migró **sin debilitarse**: mismas 58 pruebas, de 120 a 121 aserciones. Dos se
corrigieron de fondo. Una exigía lo contrario de ADR-0012 (glifo mudo con globo) y cambió de
exigencia junto con la decisión, no por conveniencia. La otra era un **verde falso**:
comprobaba que un `data-testid` fuera nulo, y al desaparecer ese testid pasaba siempre, aun con
la pantalla rota. Ahora pregunta si la sede ofrece «editar».

La acción del QR quedó **sin ícono**. Miré los dos candidatos del set cerrado antes de
descartarlos: `scan` es imagenología clínica —lo dice su propia ficha— y `billing` es una
tarjeta con banda, que es otro medio de pago. Poner cualquiera de los dos sería decir algo
falso sobre qué es esa acción. Falta `qr` en el set y quedó pedido, no rellenado.

```text
AVANCE — Itzan — H2.S3 — H2.S3.M2 / M3
- Hecho:      Publicado en el daily de equipo (§4-bis): la regla, la ruta del componente, el
              ejemplo de uso, su API, la evidencia, y el encargo de C-06 por dueño.
              Los cuatro pueden empezar
- Evidencia:  Daily-Noche-2026-09-20.md §4-bis · §4 marcada destrabada · HALL-D11/D12/D13 en §7
- Ahora:      H2.S3.M1 — el primer uso real, en work-history
- Bloqueo:    ninguno
- Estado:     HECHO
- Peldaño:    TESTED (el componente); el aviso es documentación
```

**Se publicó con el lote a medias, a propósito.** El encargo lo dice textual: avisar apenas el
componente exista y compile. Esperar al recorrido de teclado y al primer uso real para recién ahí
avisar les costaba el turno a cuatro personas, y el aviso no mejora por esperarlo: el componente
está escrito, compila, pasa sus diez pruebas y su API no va a cambiar por lo que falta.

Lo que **no** se dijo en el aviso: que está `VERIFIED`. Está `TESTED`, y el aviso lo dice con esa
palabra.

```text
AVANCE — Itzan — H2.S2 — H2.S2.M1 / M2 / M3
- Hecho:      `shared/components/molecules/row-actions/` sobre `app-menu`, exportado en el
              barril. Su spec cubre los cuatro comportamientos del DoD y cuatro más
- Evidencia:  10/10 en su spec · typecheck exit 0 · lint exit 0 ·
              `git status --porcelain src/app/shared/components/molecules/menu/` VACÍO
- Ahora:      H2.S2.M2 — el recorrido de teclado en navegador, con el anillo de foco
- Bloqueo:    ninguno
- Estado:     M1 HECHO · M3 HECHO · M2 TODO
- Peldaño:    TESTED
```

**La forma sale del número, no de quien lo usa.** Hasta dos acciones se dibujan como botones con
texto en la fila; con tres o más, disparador único y desplegable. No hay input para elegir entre
las dos formas, así que la regla no se puede aplicar al revés — que es lo que pasa cuando una
regla vive sólo en un documento.

**Va por datos y no por proyección**, y no es una preferencia: es la razón que ya había escrito
`PageHeaderAction` en el mismo repositorio — el mismo nodo no puede estar en la fila y en el menú
a la vez, los datos sí.

**`molecules/menu/` no se tocó**, y eso se comprobó, no se supuso: `git status` sobre esa carpeta
sale vacío. El componente compone lo que ya estaba resuelto ahí —el panel que se muda al `<body>`
para que el `overflow` de la tabla no lo recorte, el teclado completo, la vuelta del foco— en vez
de reimplementarlo peor.

**El icono es opcional, y eso es un límite real, no un descuido.** El set de íconos del sistema
(`atoms/nav-icon`) es cerrado a propósito y tiene `edit` y `remove`, pero no ver, imprimir,
descargar ni duplicar. Abrir una segunda puerta para íconos sueltos daría dos sets que se
desincronizan; agregar nombres al set es decisión de quien lo lleva. Así que una acción sin icono
se dibuja con su texto —que es exactamente lo que el pedido del doctor exige— y el faltante queda
declarado en el aviso al equipo.

```text
AVANCE — Itzan — H1.S1 — H1.S1.M2 / M3
- Hecho:      Línea de base del perfil médico mirada y capturada antes de tocar nada
- Evidencia:  evidencia/antes/01-ficha-perfil-medico.png · 02-ficha-donde-atiendo.png ·
              03-editor-perfil-medico.png · observaciones.md
- Ahora:      H2.S2.M1 — el componente
- Bloqueo:    ninguno
- Estado:     HECHO
- Peldaño:    VERIFIED (observado en pantalla, con la sesión de la médica)
```

**La ficha tiene siete pestañas, no seis.** Los rótulos no se contaron mirando la imagen: se
enumeraron del DOM, que es lo que hace comparable el número. El editor tiene seis, y la única que
le falta es «Actividad». Esto cambia H5: ver HALL-I4.

**Las tres primeras capturas mentían y hubo que rehacerlas.** Salían con la barra lateral pisando
el contenido, y eso no pasa en la aplicación: medido en el navegador, la barra ocupa de 0 a 240 y
el contenido arranca en 240 — **no se solapan**. Era la captura de página completa, que compone
mal los elementos fijos de este armazón. Se cambió a capturar el viewport agrandado hasta la
altura del documento.

Vale la pena decirlo porque el error tenía la forma de un hallazgo: una captura con la barra
encima de la tarjeta se parece muchísimo a un defecto de layout que hay que reportar. La
diferencia entre reportarlo y no reportarlo fue medir el DOM en vez de creerle a la imagen.

```text
AVANCE — Itzan — H2.S1 — H2.S1.M1 / M2 / M3
- Hecho:      La regla escrita como ADR-0012 del frontend, con el desvío del 2026-09-13
              registrado y la excepción declarada con sus dos condiciones
- Evidencia:  docs/adr/ADR-0012-botones-con-texto-y-acciones-de-fila.md + entrada en docs/adr/index.md
- Ahora:      H2.S2.M1 — el componente de acciones de fila sobre app-menu
- Bloqueo:    ninguno
- Estado:     HECHO
- Peldaño:    WRITTEN (es documentación: no hay comportamiento que ejecutar)
```

**Por qué un ADR y no un archivo nuevo.** El repositorio ya tiene `docs/adr/` con once decisiones
y su índice. Una regla que revierte una decisión de propietario es exactamente lo que un ADR
conserva. Crear un formato paralelo habría dejado dos lugares donde buscar la misma respuesta.

**Lo que dice, en corto:** todo botón lleva icono **y** texto; con más de dos acciones en una fila
van a un desplegable sobre `app-menu`; la única excepción es el significado universal, y exige
`aria-label` **y** globo — las dos, no una.

**El desvío, con sus dos fechas.** La decisión del 2026-09-13 (`agenda.html:545`) decía: *«con
texto, una solicitud ofrecía hasta cinco botones y la fila crecía a tres renglones»*. Ese
diagnóstico **era correcto y sigue siéndolo**. Lo que cambia no es el diagnóstico sino la
solución: poner texto en cinco botones y poner cinco botones en la fila son cosas distintas, y
sólo la segunda rompía el layout. El desplegable resuelve las dos.

```text
AVANCE — Itzan — H1.S2 — H1.S2.M1 / M2 / M3
- Hecho:      Los dos inventarios medidos, con lista por archivo y columna de dueño
- Evidencia:  evidencia/inventarios/C-06-botones-solo-icono.md · C-21-grupos-de-opciones.md
- Ahora:      H2.S1 — la regla escrita
- Bloqueo:    ninguno
- Estado:     HECHO
- Peldaño:    VERIFIED (el número sale de un comando reproducible)
```

**C-06 — 107 apariciones de `iconOnly` en 34 plantillas.** Reproduce exacto el número del reparto.
Repartido por dueño de archivo:

| Dueño | Apariciones | Archivos |
|---|---|---|
| **Itzan** | 41 | 17 |
| **Pablo** | 32 | 5 |
| **sin dueño declarado** | 34 | 12 |
| Justin · Marcelo · Ender | **0** | 0 |

> ### ⚠️ Esto cambia el supuesto del reparto, y conviene mirarlo antes de planificar
>
> El encargo asume que **los cuatro** quedan bloqueados esperando mi componente. Medido contra el
> corte, **sólo Pablo tiene botones sólo-icono en su territorio reservado**. Verifiqué carpeta por
> carpeta que las de Justin, Marcelo y Ender existen —tienen entre 4 y 8 archivos cada una— y que
> el conteo es cero, no que la ruta estuviera mal escrita.
>
> Y aparece un hueco: **34 apariciones en 12 archivos que no son de nadie**, sobre todo los
> formularios de alta (`auth/register-*`, 20 de las 34). Ningún lote de esta tanda los cubre.
> **C-06 no se cierra con los cinco lotes**: queda un tercio afuera.

**C-21 — el número del comando y el número real no son el mismo.** El comando del encargo cuenta
el nombre suelto, que incluye la etiqueta de cierre: `<app-chip>` y `</app-chip>` suman dos por
cada chip. Contando etiquetas de apertura:

| Tipo | Nombre suelto | Apertura (controles reales) | Archivos |
|---|---|---|---|
| `app-chip` | 379 | **58** | 26 |
| `radio-group` | 136 | **16** | 11 |
| `radio-otro` | 5 | **5** | 2 |
| `segmented-control` | 13 | **13** | 9 |
| **Total** | 533 | **92** | — |

Los dos números quedan en la evidencia. Repartir 533 como si fueran controles habría inflado el
encargo de cada uno por seis.

```text
AVANCE — Itzan — H1.S1 — H1.S1.M1
- Hecho:      Corte fijado, rama creada desde origin/mockup, PLAN.md en disco
- Evidencia:  68dcb562 · 54 microtareas / 6 hitos / 18 subtareas leídas por el candado
- Ahora:      H1.S2 — los inventarios
- Bloqueo:    ninguno
- Estado:     HECHO
- Peldaño:    VERIFIED
```

## 4. Cierre del turno — completar al terminar

| Hito | Microtareas HECHO / total | Estado del hito | Qué falta exactamente |
|---|---|---|---|
| H1 | 9 / 9 | HECHO | nada |
| H2 | 14 / 14 | HECHO | nada |
| H3 | 9 / 9 | HECHO | nada |
| H4 | 10 / 10 | HECHO | nada |
| H5 | 8 / 9 | A MEDIAS | La captura de H5.S3.M3. El mecanismo de anclar el error del servidor a su campo está construido y ejercitado en los tres niveles del contrato; lo que falta es **verlo en la pantalla**, y la maqueta no puede provocar un rechazo de validación con el campo adentro (HALL-I8) |
| H6 | 9 / 9 | HECHO | nada |
| **Total** | **59 / 60** | | |

> El total del plan es **60** y no 54: seis microtareas se agregaron sobre la
> marcha, cada una con su criterio y su DoD, según aparecía trabajo no
> previsto. Están marcadas **(añadida)** en el `PLAN.md`.

- **Peldaño de evidencia alcanzado** (el **más bajo** de tus áreas en alcance): **`TESTED`**. Lo fija H5.S3.M3; todo el resto del alcance llegó a `VERIFIED`, y H2, H3, H4 y H6 además con regresión.
- **`REPORTE.md`:** `docs/trabajo/2026-09-20-correcciones-doctor-perfil-y-disenio/REPORTE.md`, con el plan y la evidencia al lado
- **Procesos que quedaron corriendo:** **ninguno, verificado.** Todo lo que se puso en marcha para mirar la aplicación quedó detenido al cerrar, y se comprobó que efectivamente lo estaba. Una vez algo sobrevivió a su propia detención y se cerró en el momento; el silencio no cuenta como limpieza.

## 5. A quién esperás y quién te espera

| | Quién | Qué exactamente |
|---|---|---|
| **Esperás a** | Ender (activar un fallo simulado para probar el error de guardado) · Coordinación (qué pasa con `/administration/my-practice` y su entrada de menú) | |
| **Te esperan** | **Los otros cuatro**: sin tu componente de acciones de fila y tu regla de opciones, no pueden cerrar su parte de C-06 ni de C-21. **Publicá temprano.** | |

**Si un bloqueo se confirma, aplicá la regla 65 antes de declararlo:** si el contrato de lo que falta
se puede nombrar, se simula en sus tres niveles —correcto, límite e inválido— y la microtarea **se
cierra contra el doble**, declarando que se cerró así. Sólo una decisión de negocio sin tomar
justifica dejarla abierta.

### Decisiones tomadas sin confirmación, y a quién confirmárselas

**Q-D8 — C-21 al pie de la letra deroga un pedido anterior del mismo cliente.**
La corrección dice «todo lo que sean opciones deben ser selects». Los chips de filtro de los
cuatro directorios **son** opciones, y los pidió el mismo cliente el 22/08 (§A3 del plan de UX)
con un argumento que sigue en pie: un desplegable esconde las opciones, así que quien entra al
directorio de laboratorios no se entera de que puede acotar por categoría. Resolví que sobreviven
**como excepción declarada**, y no al revés, porque retirarlos no es lo que C-21 buscaba corregir
—lo que corrige es que la misma pregunta se conteste de cuatro maneras según la pantalla—. Es una
lectura mía, está escrita como supuesto en el ADR y se la confirmo al propietario. Si dice que no:
son dos pantallas de otros dueños y el cambio es quitar un `asChips`.

La tensión que el encargo nombraba —C-21 contra los toggles de C-10— resultó ser la fácil, y
quedó resuelta sin doblar ninguna de las dos: alternar el sí y el no de una afirmación no es
elegir de una lista.


**Q-I2 — «Mi consultorio propio»: la pantalla aparte sigue, y no lo decide este encargo.**
La corrección pide que el consultorio *se vea como pestaña* dentro del perfil, no que la otra
pantalla desaparezca. Así que el consultorio ya se administra desde el perfil —con su QR— y la
pantalla dedicada **sigue existiendo, con su entrada de menú**. Retirarla es una decisión de
producto sobre el mapa de navegación, que es territorio de otro; hacerla «de paso» dejaría a
quien la tenga asignada con una entrada rota y sin haberse enterado. **Lo que sí se retiró es el
enlace suelto desde el perfil**, que es lo que la corrección nombra. A confirmar con quien
coordina el lote de correcciones; si la respuesta es que la pantalla se retira, es un cambio de
una línea en la navegación más el redirect, y quien la tenga asignada ya tiene el reemplazo
construido y verificado.

**Q-I4 — el documento y el departamento que lo emitió no se corrigen desde ningún lado.**
El alta los pregunta, la ficha los muestra y el contrato de corrección del perfil no los acepta —el
propio tipo de la lectura lo dice: «no editable desde el perfil: tiene su circuito propio»—. Desde
hoy el editor **los muestra** y dice que no se tocan acá, que es lo que se puede hacer sin inventar
un guardado que no guarda. Lo que falta decidir es dónde vive esa corrección: si en el trámite de
verificación de identidad, si en soporte, o si el contrato del perfil debe aceptarlos. A confirmar
con el propietario; la pieza es de la API.

**Q-I5 — el sexo al nacer se pregunta en el alta y después no se ve nunca.**
La lectura del perfil médico no devuelve el dato, así que ni la ficha lo muestra ni el editor lo
puede ofrecer; estaba declarado como si viviera en «Datos personales» y ahí no estaba. El mapa de
campos ya se corrigió, pero eso sólo deja de mentir: **la persona sigue sin poder ver ni corregir
algo que declaró**. Es un hueco del contrato, no de la pantalla. A confirmar con el propietario si
el dato debe volver a la lectura o si el alta no debería pedirlo.

**Q-I3 — «Telemedicina» se reubica; «Pacientes nuevos» se retira.**
La corrección manda eliminar la sección, no dice qué pasa con sus dos datos, y los dos tenían
destinos distintos. **«Telemedicina» es un hecho que la persona declaró**: se sigue mostrando,
ahora en la cabecera de la ficha propia, y sólo cuando es verdadera. **«Pacientes nuevos» se
retira**, y no es una decisión nueva: ya se lo había retirado de otros tres lugares por el mismo
motivo —el valor por omisión es «sí», así que el cartel afirmaba algo que la mayoría nunca
declaró—. Este pedido es el cuarto retiro, no el primero. A confirmar con el propietario **sólo
si alguna vez quiere el dato de vuelta**: lo que haría falta entonces no es el cartel, es que el
alta lo pregunte.

## 6. Hallazgos y ambigüedades que aparecieron en el camino

| ID | Qué | A quién le pega | Estado |
|---|---|---|---|
| HALL-I1 | **C-06 no se cierra con los cinco lotes.** 34 de las 107 apariciones (12 archivos, 20 de ellas en `auth/register-*`) no están en el territorio reservado de nadie | Coordinación | Abierto — hace falta dueño |
| HALL-I2 | **Justin, Marcelo y Ender tienen 0 botones sólo-icono** en sus archivos reservados. El supuesto de que los cuatro esperan mi componente para C-06 se cumple sólo para Pablo | Coordinación, y los tres | Medido, verificado carpeta por carpeta |
| HALL-I3 | **El comando de C-21 del encargo cuenta etiquetas de cierre.** Da 533 donde hay 92 controles reales — infla el encargo por seis | Los cuatro | Resuelto: los dos números en la evidencia |
| HALL-I4 | **La premisa de H5 está vencida en el propio corte.** El encargo dice «el editor tiene 4 pestañas contra las 6 de la ficha»; medido sobre `68dcb562` son **6 contra 7**, y la única que falta es «Actividad» — la que Q-I1 dice que **no** se resuelve agregándola. H5.S1.M1 no tiene código que escribir: tiene una declaración | Itzan (y quien reparta H5) | Medido; los dos commits que lo cambiaron son **anteriores** al corte |
| HALL-I5 | **`molecules/post-preferences-menu` promete en su comentario un globo que no pone.** El disparador tiene `aria-label` y no `appTooltip`: es la excepción de ADR-0012 cumplida a medias, en mi territorio | Itzan | **Cerrado.** Entró como microtarea propia (H2.S3.M7): ahora lleva el globo con el mismo texto del nombre accesible, y la prueba enfoca el botón y comprueba que aparece, no que el atributo esté puesto |
| HALL-I6 | **El recorrido de «Dónde atiendo» estaba roto desde antes, y no sólo por el servicio.** Al ejecutar su escenario paso a paso sobre la pantalla aparecieron dos defectos propios del recorrido: iba a la ficha, donde el bloque de consultorios no se dibuja —la ficha monta ese componente dos veces y las dos con el historial—, y su respaldo abría «Trayectoria», donde tampoco está. El panel de una pestaña que no está abierta no existe en el DOM, así que el recorrido medía sobre la nada | Nadie: era mío | **Corregido y verificado paso a paso: 10/10.** Siguen sin poder correr los dos pasos que prueban que el servidor guardó, y así se declara |
| HALL-I9 | **`app-fact-section` es un organismo que no monta ninguna pantalla.** `git grep "<app-fact-section"` no devuelve una sola línea: quedó huérfano cuando `laboratory-detail` reimplementó su sección en línea —su propio comentario todavía lo nombra: «el mismo umbral que traía `app-fact-section`»—. Tiene CSS, pruebas y un chip de filtro que nadie ve | Quien decida si se borra | Registrado. **No se tocó**: borrar un organismo compartido es una decisión, no un arreglo |
| HALL-I10 | **El resumen de contabilidad pide dos veces la misma ventana los lunes, y su prueba se cae ese día.** `ventanasDeLaSemana` (`src/app/features/accounting/resumen/ventanas.ts:66`) arranca la semana el lunes, así que el lunes «lo que va de la semana» **es hoy**: de las seis lecturas del estado de resultados, dos piden el mismo rango. `resumen.spec.ts:150` exige seis ventanas distintas y recibe cinco. Barrido de los siete días: sólo el lunes da 5. El archivo monta el componente sin fijar la fecha, aunque `ventanas.ts:17` dice que `hoy` entra por parámetro «así las pruebas no dependen de cuándo se corren» | Quien lleve contabilidad | Registrado. **No se tocó** — territorio ajeno. Comprobado idéntico con `src/` en el corte base |
| HALL-I11 | **Una prueba del registro de médicos se cae sola y otras dos sólo con compañía.** `register-practitioner.spec.ts:2001` abre un `describe` cuyo primer acto es `TestBed.resetTestingModule()` **dentro** de la prueba (línea 2003); esa vence a los 5 s corriendo su archivo solo, y arrastra otras dos cuando hay más archivos en el mismo hilo. Es el mismo patrón que destapé en mi propio archivo esta noche: reiniciar el `TestBed` dentro de un test le tira el módulo a los que corren después | Quien lleve el registro de médicos | Registrado. **No se tocó** — territorio ajeno. Comprobado idéntico con `src/` en el corte base |
| HALL-I12 | **Un botón sólo-icono sin globo, en la cabecera, en 44 rutas.** El interruptor de tema tiene nombre accesible dinámico («Cambiar a modo claro» / «…oscuro») y **no tiene `appTooltip`**: es la excepción de ADR-0012 cumplida a medias, igual que HALL-I5, pero en la cabecera de la aplicación y por lo tanto en toda pantalla con marco. Sale contado de la matriz de acabado del carril 34: `tooltip :: button[data-testid="header-theme-toggle"]` aparece **44 veces**, una por ruta. Vive en `features/shell-layout/shell-layout.html:362` y `features/alovida/inicio/portada/portada.html:20`; la directiva es `core/alovida/alovida-theme-toggle.directive.ts:24` | Quien lleve el marco de la aplicación | Registrado. **No se tocó** — las tres rutas están fuera de mi frontera declarada. Es una línea, y es el hallazgo de C-06 con más alcance de la noche |
| HALL-I8 | **El simulador de fallos de la maqueta no puede provocar el error que más le importa a un formulario.** Ofrece cinco clases —sin red, sin permiso, no existe, conflicto y fallo del servidor— y ninguna es un **rechazo de validación con el campo adentro** (`details.violations`), que es el único que se puede anclar a un control. Comprobado además que ningún manejador del servicio simulado emite `violations`. Consecuencia concreta: el mensaje por campo del editor del perfil quedó probado contra el contrato real y **sin poder mirarse en la pantalla** | Quien lleve el simulador de fallos | Abierto — es una clase más en un archivo que no es mío; no se toca |
| HALL-I7 | **«Dónde atiendo» ahora enseña los mismos lugares dos veces**: arriba el mapa con sus direcciones (pedido del 19/09) y abajo la lista con sus direcciones y sus acciones (C-02). Las dos mitades están pedidas explícitamente, así que ninguna se puede sacar por cuenta propia. Lo que sí se hizo fue que no se lean como lo mismo: el bloque de arriba se llama **«Dónde caen en el mapa»** —dice lo que contesta, que es dónde queda uno respecto de otro— y el de abajo conserva su nombre. Si el propietario prefiere un solo bloque, el camino natural es que el mapa absorba la lista y las acciones cuelguen del pin; es una decisión de diseño, no de implementación | Propietario | Registrado con su mitigación aplicada — no se toca sin decisión |

**Un bug se reporta apenas aparece, no al cierre** (regla 50).

## 7. Qué NO se puede escribir en este documento

- Un `PASS` sin comando y salida pegados.
- «Listo», «funciona» o «implementado» sobre algo que no se ejecutó.
- Un porcentaje que no salga de `HECHO / 59` (eran 54 al abrir el turno; las cinco de más son las
  microtareas añadidas en el camino, cada una con su CA y su DoD — regla 20 §6.6).
- Un `BLOQUEADO` disfrazado de `PASS` porque «igual compila».
- Una microtarea en `EN CURSO` al cerrar: pasa a `A MEDIAS` con qué anda, qué no anda y qué falta.
- Datos reales de pacientes en cualquier salida pegada. Las cuentas `@alovida.mock` son sintéticas
  declaradas y sí se pueden pegar.
