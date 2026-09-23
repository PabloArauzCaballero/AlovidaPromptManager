# Plan maestro — correcciones del doctor y del paciente, noche del 2026-09-22

> **Qué es esto y qué no.** Es la vista consolidada de las 19 observaciones: qué hito las cubre, de
> quién es, de qué depende, en qué orden conviene ir y qué comprobación barata demuestra que **no**
> está hecha. **Las microtareas no viven acá**: viven en el prompt de cada persona
> (`repartos/2026-09-22/PromptNoche/<Persona>/…`), que es donde se ejecutan y se marcan. Duplicarlas
> sería tener dos verdades del estado (regla 20 §6.2). Cada `H*.S*` que se cita acá existe con ese
> mismo identificador en el prompt de su dueño.
>
> - Fuente: [`CORRECCIONES-DOCTOR-Y-PACIENTE-2026-09-22.md`](../../requisitos/CORRECCIONES-DOCTOR-Y-PACIENTE-2026-09-22.md)
> - Hechos: [`VERIFICACION-CONTRA-CODIGO-2026-09-22.md`](../../verificacion/VERIFICACION-CONTRA-CODIGO-2026-09-22.md)
> - Corte: `origin/mockup` @ **`b655e8449abd662d6b24156fd6e2b06aeb120cc1`** (2026-09-22 18:04 -04)
> - Peldaño de todo lo afirmado acá: **`DISCOVERED`**. Nada se ejecutó.

## 1. Los cinco carriles, en una tabla

| Persona | Lote | Qué demuestra si sale bien | Hitos | Observaciones |
|---|---|---|---|---|
| **Pablo** | `Noche-DisciplinaDeTablas.PatronYDondeAtiendo` | Que la disciplina de tabla que el doctor pidió «a partir de ahora» es un ADR con piezas reales (`pagination`, `filter-bar`, `data-table`) y que «Dónde atiendo» la cumple de punta a punta, con el mapa vaciando la dirección | 6 | D-04, D-05, D-06 (aplicación), D-08, D-09 (historial laboral) |
| **Itzan** | `Noche-PerfilMedico.ConfigurarTuPerfil` | Que la ficha y el editor del médico ya no distinguen una especialidad principal, no muestran el estado de la práctica ni los contactos del trabajo, y que Trayectoria y Credenciales son tablas con modal, confirmaciones, adjunto, buscador y paginación; que el mapa vacía la dirección y que «Listo, guardamos…» ya no está; que «Mis puntos» es una pestaña del paciente | 8 | D-01, D-02, D-03, D-06, D-07, D-08 (aplicación), D-09, D-10, N-03 |
| **Justin** | `Noche-ReservaYCotizaciones.DirectorioYPrecios` | Que un paciente que elige médico ve que está cargando y no puede disparar la carga dos veces; que «elegir médico» baja de N peticiones a las mínimas; y que existe una pantalla de Cotizaciones del paciente que busca en cuatro verticales por precio y cercanía, y cotiza una receta o una orden | 6 | R-01, R-02 (UI), N-02 |
| **Ender** | `Noche-SimuladorYCabecera.MockNavegacion` | Que la maqueta responde con una latencia decidida por ruta y no aleatoria, que **todos** los médicos del directorio tienen agenda y hay escenarios documentados de flujo completo, y que Tutoriales y Chats viven en la cabecera para las dos personas | 6 | R-02 (latencia), R-03, N-01, D-05 (cabecera), N-02/N-03 (menú) |
| **Marcelo** | `Noche-InicioPaciente.SintomasYConfirmacion` | Que el paciente elige dónde le duele tocando una silueta accesible y recibe la especialidad; que puede escribir o dictar; que el panel sobrante no está; y que «guardar» pregunta «¿confirmás?» con una pieza reusable para todos | 6 | P-01, P-02, P-03, D-08 (confirmación) |

**Total: 32 hitos.** El conteo de subtareas y microtareas por prompt está en la primera línea de
cada uno y en el daily de equipo; el reporte de este trabajo lo mide con un script.

## 2. Mapa observación → hito → dueño → kill-test

| ID | Hito(s) | Dueño | Depende de | Kill-test (la comprobación más barata de que NO está hecho) |
|---|---|---|---|---|
| D-01 | Itzan **H2.S2** | Itzan | — | Kill-test: entrá como `medica@alovida.mock`, abrí `/my-account` → Datos personales; si una insignia se ve distinta de las otras, o el editor tiene «Marcar como principal», no está hecho |
| D-02 | Itzan **H2.S1** | Itzan | — | Kill-test: `git grep -n 'Estado de la práctica' -- src/app` devuelve algo en una plantilla |
| D-03 | Itzan **H2.S3** | Itzan | — | Kill-test: en `/my-account` → Contacto se lee «Correo de trabajo», «Celular del trabajo» o «Fijo del trabajo»; o `pestanas-del-perfil-medico.spec.ts` está en rojo |
| D-04 | Pablo **H2.S1** (regla) · Itzan **H3.S1, H4.S1, H4.S2** · Pablo **H4.S2** (aplicación) | Pablo (patrón) | ADR-0015 publicado | Kill-test: en Trayectoria, Credenciales o Dónde atiendo hay un `<form>` de alta dibujado **en línea** dentro de la pestaña (no en `app-content-dialog`) |
| D-05 | Pablo **H5** (inventario y veredictos) · Itzan **H6** · Ender **H5** · Justin **H5.S2** · Marcelo **H5.S2** | Pablo (patrón, ADR-0012) | — | Kill-test: `git grep -c iconOnly -- 'src/app/**/*.html'` da un archivo **con dueño esta noche** cuyo botón no tiene ni texto ni la excepción escrita al lado con `aria-label` + `appTooltip` |
| D-06 | Itzan **H5.S1** (patrón) · Itzan **H5.S2** · Pablo **H4.S2.M6** (aplicación) | Itzan (patrón) | el `output` nuevo del picker | Kill-test: en `/my-account/edit` → Contacto escribí una dirección, tocá el mapa; si el campo conserva el texto, no está hecho |
| D-07 | Itzan **H5.S3** | Itzan | — | Kill-test: `git grep -n 'Listo, guardamos' -- src/app` devuelve una plantilla |
| D-08 | Pablo **H2, H3, H4** (patrón + Dónde atiendo) · Marcelo **H4** (confirmación) · Itzan **H3.S2, H4** (Configurar tu perfil) | Pablo (patrón) · Marcelo (confirmación) | ADR-0015 · `confirmarCambios` publicado · `app-pagination` con selects · `filter-bar` con acción a la derecha | Kill-test: en la tabla de títulos abrí «Editar», no cambies nada y mirá si «Guardar» está habilitado; cambiá algo y guardá: si no aparece «¿Confirmás estos cambios?», no está hecho. Y si la tabla tiene scroll lateral a 1440 px, tampoco |
| D-09 | Itzan **H3** (formación) · Pablo **H4.S3** (historial laboral como tabla) | Itzan, Pablo | Pablo publica el layout de tabla del historial | Kill-test: en el editor → Trayectoria no hay tabla de «Lugares donde trabajé», o el modal de editar un título no tiene adjunto |
| D-10 | Itzan **H4** | Itzan | HALL-E7 (especialidad sin `file_id`) | Kill-test: la tabla de especialidades o la de matrículas se agrega con un formulario en línea, o «Editar» matrícula no ofrece el respaldo |
| R-01 | Justin **H2.S1** | Justin | Ender H4 (indicador global, opcional) | Kill-test: en `/directory`, tocá cuatro veces seguidas «Revisar disponibilidad» con la Red abierta; si hay más de una carga de la ficha, no está hecho |
| R-02 | Ender **H2** (latencia) · Justin **H2.S2** (peticiones) | Ender, Justin | la medición de H1 de los dos | Kill-test: con la Red abierta, elegir un médico tarda ≥ 1 s o dispara más de una lectura de cupos por médico |
| R-03 | Ender **H3** | Ender | — | Kill-test: elegí en `/directory` un médico de los 13 registrados (`registered-people.ts`); si dice «No tiene turnos disponibles», no está hecho. O `core/mock/README.md` no tiene la sección de escenarios |
| P-01 | Marcelo **H2** | Marcelo | — | Kill-test: en la pantalla de inicio del paciente no hay una figura humana con zonas que respondan a clic **y** a Enter/Espacio con `aria-pressed` |
| P-02 | Marcelo **H3.S1, H3.S2** | Marcelo | — | Kill-test: el área de texto está detrás de un `<summary>`, o en Chromium no hay botón «Dictar» con ícono y texto |
| P-03 | Marcelo **H3.S3** | Marcelo | confirmación del doctor (Q-13) | Kill-test: `git grep -n 'mi-salud__accesos' -- src/app` devuelve una plantilla |
| N-01 | Ender **H4.S1** | Ender | — | Kill-test: como paciente o como médica, «Chats» sigue en el menú lateral, o en la cabecera no hay un ícono con globo «Chats» y otro «Tutoriales» |
| N-02 | Justin **H3, H4** · Ender **H4.S2.M1** (menú) | Justin | Ender (renglón y ruta) · Q-15/Q-16 | Kill-test: como `paciente@alovida.mock` no hay «Cotizaciones» en Mi cuenta, o al buscar «paracetamol» no se puede ordenar por precio y por cercanía |
| N-03 | Itzan **H7** · Ender **H4.S2.M2** (menú y redirect) | Itzan | Ender | Kill-test: `/my-account` del paciente tiene cuatro pestañas, o `/my-account/loyalty` da 404 |

## 3. Dependencias — quién destraba a quién, y qué se hace mientras tanto

```
Pablo  ──(ADR-0015 + `app-pagination` con selects + `filter-bar` con acción)──▶ Itzan aplica en sus 3 tablas
Pablo  ──(layout `tabla` del historial laboral en `work-history`)─────────────▶ Itzan lo monta en Trayectoria
Marcelo ──(`confirmarCambios` sobre `DialogService` + receta de descarte)──────▶ Pablo e Itzan en cada «Guardar»
Itzan  ──(`output` del `ubicacion-picker` al tocar el mapa)────────────────────▶ Pablo vacía la dirección de la sede
Ender  ──(latencia por ruta + agendas para todos)──────────────────────────────▶ Justin mide «después» y cierra R-02
Ender  ──(renglones del menú: Cotizaciones, Mis puntos; ruta y redirect)───────▶ Justin (N-02) e Itzan (N-03)
Justin ──(la medición de peticiones del flujo de reserva)──────────────────────▶ Ender decide la latencia con números
```

| Quien espera | De quién | Qué exactamente | Cuándo | Qué hace mientras tanto (regla 65, obligatoria) |
|---|---|---|---|---|
| Itzan (H3, H4) | Pablo (H2, H3) | ADR-0015; `app-pagination` con select de página y texto en Anterior/Siguiente; `filter-bar` con hueco para «Añadir» a la derecha | Primera mitad del turno | Monta `app-pagination` y `filter-bar` **tal como están hoy** y deja un botón «Agregar» a la derecha con su CSS; declara que cerró contra la versión vieja; cuando Pablo publique, es un `git merge` |
| Itzan (H3.S3) | Pablo (H4.S3) | `app-work-history secciones="historial" layout="tabla"` | Segunda mitad | Monta la línea de tiempo existente en la pestaña y declara que la tabla llega de Pablo |
| Pablo e Itzan (cada «Guardar») | Marcelo (H4) | `confirmarCambios()` con textos por omisión y la receta de «Cancelar con cambios» | Temprano | Llaman a `dialogs.confirm({...})` con los textos del ADR y lo declaran: la API de `confirm` ya existe (26 consumidores) |
| Pablo (H4.S2.M6) | Itzan (H5.S1) | El `output` del picker al tocar el mapa | Temprano | «Dónde atiendo» usa `app-map` directo con `pointPicked`: **no depende del picker**; vacía la dirección en `marcarPunto` y listo |
| Justin (H2.S2) | Ender (H2) | La latencia nueva por ruta | Primera mitad | Mide con la latencia actual y deja la medición «después» como microtarea que se repite al mergear |
| Justin (H3), Itzan (H7) | Ender (H4.S2) | Renglón «Cotizaciones» (PATIENT), retiro de «Mis puntos», redirect | Cuando lo pidan por el daily | Prueban su pantalla por URL directa y lo declaran |
| Ender (H2) | Justin (H1.S2) | Cuántas peticiones y cuánto tarda hoy «elegir médico» | Al arrancar | Mide él mismo con `medica@`/`paciente@` si Justin no llegó, y anota que fue su medición |
| Marcelo (H3.S3) | Doctor / Pablo | Cuál es «el panel de abajo» (Q-13) | Antes de borrar | Prepara el retiro en una rama y lo deja `A MEDIAS` con la captura anotada si no hay respuesta; **no borra a ciegas** |
| Los cinco | Marcelo (H4.S1.M6) | Que un `confirm` sobre un `content-dialog` abierto apila bien (`showModal` sobre `showModal`) | Temprano | Si no llegó, cada uno lo prueba en su primer modal y anota el resultado |

**Nadie se queda esperando.** La regla 65 es obligatoria: si el insumo del otro no llegó y su
contrato se puede nombrar, se simula en **tres niveles** —correcto, límite e inválido—, se cierra la
microtarea contra el doble y **se declara**. `BLOQUEADO` sin simulación previa no es un cierre válido
y el `blocker_gate.py` lo frena.

## 4. Orden sugerido de la noche

| Fase | Quién | Qué | Por qué primero |
|---|---|---|---|
| 0 · Instalación y baseline | los cinco | Estándar instalado, corte declarado, `lint`/`typecheck`/`test` con rojos previos clasificados, capturas **antes** | Sin baseline nadie puede demostrar qué rompió |
| 1 · Piezas bloqueantes | Pablo (ADR-0015, paginador, barra) · Marcelo (confirmación) · Itzan (output del picker) · Ender (latencia, agendas) | Lo que otros consumen | Cuanto antes se publica, menos gente simula |
| 2 · Aplicaciones | Itzan (perfil) · Pablo (Dónde atiendo) · Justin (directorio, cotizaciones) · Ender (cabecera, menú) · Marcelo (silueta, voz, panel) | Lo visible para el doctor | Es el pedido |
| 3 · D-05 | los cinco, en lo suyo | Veredicto por cada `iconOnly` propio | Barato y medible al final |
| 4 · Regresión y cierre | los cinco | Baseline repetido, barrido, capturas por viewport y tema **miradas**, `REPORTE.md` | Regla 80.1 |

## 5. Los hitos de cada carril — CA y DoD al nivel del hito

Las subtareas y microtareas, con su comando, están en cada prompt. Acá va lo que hay que poder
demostrar por hito, para que Pablo pueda leer el estado de la noche sin abrir los cinco archivos.

### Pablo — `Noche-DisciplinaDeTablas.PatronYDondeAtiendo`

| Hito | CA | DoD | Cubre |
|---|---|---|---|
| **H1** Corte, baseline, inventario y capturas | Dado un rojo posterior, cuando alguien pregunta si lo rompió Pablo, la respuesta sale de `evidencia/antes/`; y hay inventario de las 30 tablas con dueño y de los 26 `confirm` | Salidas con exit code; tabla de 30 filas; capturas de «Dónde atiendo» y de las 3 tablas del perfil | base |
| **H2** ADR-0015 «tabla con acciones» | Dado el ADR, cuando alguien lee, sabe las siete reglas (modal, guardar por cambios, confirmación al guardar, confirmación al eliminar, barra con buscador + filtros + Añadir a la derecha, scroll sólo vertical, paginación con selects), qué decisión anterior reemplaza (18/09) y cómo se pagina cada tipo de lista (Q-5) | Archivo en `docs/adr/`, indexado, publicado en el daily de equipo antes de la mitad del turno | D-04, D-08 |
| **H3** Las piezas: `pagination`, `data-table`, `filter-bar` | Dado un consumidor, cuando monta las tres piezas, obtiene Anterior/Siguiente con texto, select de página y de tamaño, alto máximo con scroll vertical sin lateral, y un hueco para el botón de acción a la derecha — sin cambiar el comportamiento de los consumidores que no opten | Specs dirigidos en verde (3 niveles cada uno); 3 consumidores ajenos de `data-table` y 2 de `filter-bar` comprobados con captura | D-08, D-05 |
| **H4** «Dónde atiendo» con la disciplina | Dado el médico en la pestaña, cuando agrega o corrige su consultorio, lo hace en un modal con campos llenos, guardar se habilita con cambios, confirma antes de guardar y antes de retirar, busca y filtra arriba, pagina abajo a la derecha, y tocar el mapa vacía la dirección; y el historial laboral es una tabla con las mismas reglas y adjunto | Ejercitado en navegador con captura de cada paso; consola y red limpias; `work-history.spec` en verde | D-04, D-06, D-08, D-09 |
| **H5** D-05: veredicto por cada `iconOnly` | Dado el inventario de 78, cuando se lo lee, cada fila tiene veredicto (excepción con motivo / convertir) y dueño; los suyos están aplicados | Tabla publicada en el daily; `pagination.html` y `site-bank-qr-dialog.html` sin `iconOnly` sin motivo | D-05 |
| **H6** Regresión y cierre | Dado el cierre, ningún rojo es nuevo y el reporte dice qué quedó demostrado y qué no | Baseline repetido y comparado; barrido `--workers=1`; `REPORTE.md` con avance primero | — |

### Itzan — `Noche-PerfilMedico.ConfigurarTuPerfil`

| Hito | CA | DoD | Cubre |
|---|---|---|---|
| **H1** Corte, baseline y capturas previas | Hay SHA, rojos previos clasificados y capturas de la ficha y del editor antes de tocar; y está **ejercitado** si «Guardar cambios» del modal se habilita sin cambios y si los tres «Retirar» confirman | `evidencia/antes/` con salidas y capturas; tabla de comportamiento previo | base |
| **H2** Datos personales y Contacto | Dado el perfil, cuando se lo mira, no hay «Estado de la práctica», ninguna especialidad se distingue como principal en ningún lugar (ficha, editor, alta, directorio), y «Contacto» no muestra datos del trabajo; el correo de acceso sigue visible en sólo lectura | Specs en verde (`pestanas-del-perfil-medico.spec`, `specialty-badge-grid.spec`, vista y editor); capturas ×3 viewports ×2 temas | D-01, D-02, D-03 |
| **H3** Trayectoria | Dado el editor → Trayectoria, cuando se agrega o corrige un título, se hace en modal con adjunto, guardar por cambios y confirmación, y «Lugares donde trabajé» está en la misma pestaña | Ejercitado con captura; spec del editor en verde; el simulador persiste el `fileId` al corregir | D-04, D-08, D-09 |
| **H4** Credenciales y la barra + paginación de las tres tablas | Dado el editor → Credenciales, especialidades y matrículas siguen la misma disciplina; y las tres tablas tienen buscador multicampo, filtro por estado, Añadir a la derecha, scroll vertical y paginación con selects | Ejercitado con captura; specs en verde; Q-9 registrada con la salida elegida | D-08, D-10 |
| **H5** El mapa y el texto sobrante | Dado cualquier formulario con mapa, cuando se toca el mapa, el campo de dirección queda vacío; y «Listo, guardamos…» no se ve, pero el lector de pantalla sigue recibiendo la confirmación | Spec del picker (3 niveles); capturas en editor, alta de paciente y alta de profesional; specs/E2E de los `data-testid` actualizados | D-06, D-07 |
| **H6** D-05 en sus archivos | Dado cada `iconOnly` de sus 10 archivos, tiene texto o la excepción escrita al lado | 37 veredictos aplicados; capturas | D-05 |
| **H7** Mis puntos como pestaña | Dado `/my-account` del paciente, hay cinco pestañas y la quinta muestra la billetera sin cabecera duplicada; `/my-account/loyalty` sigue llegando | Spec de pestañas; captura; pedido a Ender anotado en los dos dailies | N-03 |
| **H8** Regresión y cierre | Ningún rojo nuevo; teclado completo en los modales; reporte honesto | Baseline comparado; barrido; `REPORTE.md` | — |

### Justin — `Noche-ReservaYCotizaciones.DirectorioYPrecios`

| Hito | CA | DoD | Cubre |
|---|---|---|---|
| **H1** Corte, baseline y medición del flujo | Hay SHA, rojos previos y una medición del flujo directorio → médico → cupo: peticiones, tiempos, y qué pasa con cuatro clics seguidos | `evidencia/antes/red-flujo-reserva.md` con la tabla y capturas de la pestaña Red | base, R-01, R-02 |
| **H2** Clic único y carga visible | Dado el paciente, cuando toca una tarjeta o «Revisar disponibilidad», ve que está cargando y un segundo clic no dispara nada; la ficha del médico pide los cupos **una vez** por médico y muestra estado de carga por sede | Specs; medición «después» ≤ mitad de peticiones que «antes»; capturas | R-01, R-02 |
| **H3** Cotizaciones del paciente — el buscador | Dado el paciente en «Cotizaciones», cuando busca en una de las cuatro verticales, elige ordenar por precio o por cercanía como select, ve precio o «no publicado», distancia desde su origen, y los cuatro estados | Pantalla ejercitada; manejadores simulados existentes o dobles declarados; specs; capturas ×3×2 | N-02 |
| **H4** Cotizar un documento | Dado el paciente, cuando elige una receta o una orden, el buscador se precarga con sus ítems y ordena por precio y distancia | Ejercitado con `paciente@alovida.mock`; specs; capturas | N-02 |
| **H5** Regresión | Ningún rojo nuevo; barrido del directorio y de Mi cuenta | Baseline comparado; `--workers=1` | D-05 (0 en sus archivos: declarado) |
| **H6** Cierre | Reporte con avance primero y las brechas de precio declaradas | `REPORTE.md` | — |

### Ender — `Noche-SimuladorYCabecera.MockNavegacion`

| Hito | CA | DoD | Cubre |
|---|---|---|---|
| **H1** Corte, baseline, `stock:generate` idéntico y medición | Hay SHA, rojos previos, el índice regenera idéntico, y una tabla: latencia actual por prefijo y cuántos profesionales tienen agenda de cuántos | Salidas; `evidencia/antes/agendas.txt` con el conteo | base, R-02, R-03 |
| **H2** Latencia decidida por ruta | Dado el simulador, cuando responde, la espera es una tabla por prefijo con valores justificados (los estados de carga siguen existiendo) y sin azar en E2E; elegir médico baja de lo medido | Spec del interceptor (3 niveles); medición «después» con Justin | R-02 |
| **H3** Agendas para todos y escenarios documentados | Dado cualquier médico del directorio, tiene cupos en las próximas dos semanas; y `core/mock/README.md` describe al menos dos flujos completos con cuenta, médico y día | `mock-backend.spec` en verde; conteo N/N; README; barrido | R-03 |
| **H4** Cabecera y menú | Dado el doctor o el paciente, Tutoriales y Chats están en la cabecera con globo y nombre accesible, Chats con no leídos, y no ocupan renglón; «Cotizaciones» (PATIENT) existe y «Mis puntos» redirige a la pestaña | `navigation.service.spec` actualizado con motivo; specs del shell; capturas ×2 roles ×3 viewports ×2 temas | N-01, N-02, N-03, D-05 |
| **H5** D-05 en la cabecera | Los 3 `iconOnly` de `header.html` y `shell-layout.html` con veredicto aplicado (el interruptor de tema con globo: HALL-D7 del 20/09) | Captura; spec | D-05 |
| **H6** Regresión y cierre | Ningún rojo nuevo, `yarn start` arranca para los otros cuatro | Baseline comparado; `REPORTE.md` | — |

### Marcelo — `Noche-InicioPaciente.SintomasYConfirmacion`

| Hito | CA | DoD | Cubre |
|---|---|---|---|
| **H1** Corte, baseline y capturas | Hay SHA, rojos previos, capturas de la pantalla de inicio con los cuatro bloques nombrados, y la pregunta Q-13 elevada con captura | `evidencia/antes/`; pregunta en el daily de equipo | base |
| **H2** La silueta | Dado el paciente, cuando toca una zona de la figura (o la elige con teclado), se abren sus síntomas y aparece la especialidad recomendada; la figura funciona en claro y oscuro y no transmite nada sólo por color | Organismo `body-map` con spec (3 niveles); integración con spec; capturas ×3×2; borrador mostrado al doctor | P-01 |
| **H3** Texto, voz y el panel sobrante | Dado el paciente, el área de texto está visible; en Chromium hay «Dictar» con ícono y texto que vuelca lo dicho al texto; sin soporte no aparece; y el panel de abajo no está | Specs con doble del reconocedor; prueba real en Chromium con captura; declaración PHI en pantalla; `mi-salud__accesos` retirado tras confirmar | P-02, P-03 |
| **H4** El modal de confirmación de cambios | Dado cualquier «Guardar» de la casa, cuando se llama a la pieza, aparece «¿Confirmás estos cambios?» con el foco gestionado, y «Cancelar con cambios» pregunta si se descartan; apilar un `confirm` sobre un `content-dialog` funciona | Pieza publicada en el daily antes de la mitad del turno; spec (3 niveles); prueba de apilamiento con captura | D-08 |
| **H5** Regresión | Ningún rojo nuevo; D-05 en sus archivos declarado (0 salvo el cierre del diálogo, excepción) | Baseline comparado | D-05 |
| **H6** Cierre | Reporte honesto | `REPORTE.md` | — |

## 6. Gates transversales — se aplican en los cinco

| Gate | Qué exige | Regla |
|---|---|---|
| Accesibilidad | Modales con rol, nombre, foco inicial, atrapado, `Escape` y restauración; nombre accesible en todo botón; nada sólo por color; teclado completo | 95.4, 80.7 |
| Prueba visual | Capturas en 375 / 768 / 1440, tema claro y oscuro, estados cargando/vacío/error, **miradas** | 10 fase 6, 95.7 |
| Datos de salud | Ningún dato de persona en logs, capturas, plan ni reporte; sólo las cuentas sintéticas declaradas; lo dictado en P-02 es PHI | 90.2 |
| Recursos | Un `yarn start`, un build, un navegador, Playwright `--workers=1`; nada en background sin cerrar | 70 |
| Evidencia | Ninguna palabra más fuerte que la evidencia; peldaño por área; «No cubierto» en cada reporte | 30, 40 |
| Contrato | Lo que sólo existe en el simulador se cierra `VERIFIED` **contra el doble** y con la brecha declarada para `dev` (HALL-E3, E7, E11) | 65 |

## 7. Cobertura medida — con denominador

| Qué | Total | Con dueño esta noche | Fuera (declarado) |
|---|---|---|---|
| Observaciones del pedido | **19** | **19** | 0 |
| Plantillas que instancian `app-data-table` | 30 | 4 (las 3 del perfil + Dónde atiendo) reciben la disciplina completa; las otras 26 quedan inventariadas con dueño propuesto en Pablo H1.S2 | 26 |
| Botones `iconOnly` | 78 en 33 archivos | 37 (Itzan 27 · Pablo 3 · Ender 3 · más `back-link` 4) | **39** (HALL-E16) |
| Instancias del selector de ubicación | 9 plantillas | 9: editor médico, editor paciente, 6 altas (Itzan) y Dónde atiendo (Pablo); las 3 de sólo lectura no tienen campo que vaciar | 0 |
| Endpoints del perfil que la API real no tiene y el simulador sí | 5 (editar título/especialidad/matrícula, retirar especialidad/matrícula) + historial laboral | 0 — **no se escribe API esta noche** | todo, declarado en HALL-E3 |

## 8. Lo que queda para la oleada siguiente, y ya está dicho

- Los **39 `iconOnly` sin dueño** (§3 de la verificación): agenda (6), altas de organización/laboratorio/imagenología (4), `form-builder` (4), vitrina (5), moléculas sueltas (6) y otros.
- Las **26 tablas** que no reciben la disciplina esta noche: se inventarían con dueño propuesto (Pablo H1.S2).
- **Port a `dev`**: todo lo de esta noche va a `mockup` (Q-T1). Llevarlo a `dev` exige, además, los endpoints de HALL-E3 en la API — decisión de coordinación.
- **Precio con procedencia** para servicios médicos, imagenología y análisis (Q-16): decisión de negocio.
- **`isPrimary` en el contrato** (Q-1): retirarlo o dejarlo sin uso es decisión de Pablo con la API.
