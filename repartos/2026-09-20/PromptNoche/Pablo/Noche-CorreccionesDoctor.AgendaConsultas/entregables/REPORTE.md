# Reporte — Pablo · turno noche 2026-09-20 · Agenda: dos solapas, el cupo manda la hora, una sola consulta

> **AVANCE: 54 / 55 — 98,2 %.** (`A MEDIAS` cuenta como no hecha; el
> `DESCARTADO` no suma y se declara aparte con su motivo.)

- **Fecha:** 2026-09-20 (turno noche, cerrado el 2026-09-21) · **Persona:** Pablo
- **Encargo:** [SolapasCalendarioSlotsYReglaDeConsulta.md](../../AlovidaPromptManager/repartos/2026-09-20/PromptNoche/Pablo/Noche-CorreccionesDoctor.AgendaConsultas/SolapasCalendarioSlotsYReglaDeConsulta.md)
- **Correcciones cubiertas:** C-04, C-07, C-08, C-10, C-11, C-12 (UI), C-13 (UI), y C-06 en mi área
- **Repo:** `alovida/mantra-core-health` · **Rama:** `pablo/noche-2026-09-20-agenda-consultas`
- **Worktree:** `alovida/mch-pablo-noche-agenda`
- **Corte:** `68dcb562ef3dd74de03f4887c57fd836fb21be13` (el reparto decía
  `68969782…`, PR #554; **avanzó**, y manda el mío)
- **Plan:** [PLAN.md](./PLAN.md) · **Evidencia:** `evidencia/`
- **Peldaño de evidencia alcanzado:** `REGRESSION_VERIFIED` en todo lo cerrado,
  salvo H3.S3.M3 (el horario extra), que queda en `VERIFIED` contra un doble
  declarado porque el manejador simulado no genera cupos para la excepción.

## Los 4 commits

| SHA | Qué trae |
|---|---|
| `2114318a` | C-07, C-08, C-11 (encabezado) · de cuatro solapas a dos |
| `54895bfc` | C-10, C-21 · el modal, el cupo manda la hora, los slots dicen la verdad |
| `d45f8e0e` | C-08 (semana y mes), C-04 · el globo, los chips y la tarjeta que atiende |
| `601b20bb` | C-11, C-13, C-12 · una consulta a la vez, el visitador y los otros servicios |
| *(este)* | C-06 · el desplegable de acciones, la regresión y la prueba visual |

---

## Completado

### H1 — Corte, maqueta arriba y estado de partida · **9 / 9**

| ID | Qué se logró | Comando | Resultado |
|---|---|---|---|
| H1.S1.M1 | Corte declarado `68dcb562`, rama saliendo de él | `git log -1 origin/mockup` | PASS · `PLAN.md` |
| H1.S1.M2 | `mockBackend: true` confirmado en el archivo | `grep -n mockBackend src/environments/environment.ts` → `62` | PASS · `evidencia/antes/h1s1m2-mockbackend.txt` |
| H1.S1.M3 | Maqueta en 4200 y sesión adentro | `yarn install && yarn start` | PASS · `evidencia/antes/capturas/` |
| H1.S2.M1 | Las cuatro solapas y sus constantes, leídas del archivo | fragmento de `agenda.ts:376-385, 808-814` | PASS · `evidencia/antes/h1s2m1-solapas.txt` |
| H1.S2.M2 | Destino actual de los cinco valores de `vista=` | tabla | PASS · `evidencia/antes/h1s2m2-destinos.txt` |
| H1.S2.M3 | Inventario de lo que se pierde al quitar «Cupos» y la tabla | inventario | PASS · `evidencia/antes/h1s2m3-inventario-huerfanos.txt` |
| H1.S3.M1 | Línea de base de gates | `yarn typecheck; yarn lint` | PASS · exit 0 y 0 |
| H1.S3.M2 | Línea de base de specs | `npx ng test --include=…agenda…` | PASS · 17 archivos, **430** verdes |
| H1.S3.M3 | Capturas previas de las 4 solapas y del encabezado | script | PASS · 7 capturas |

### H2 — De cuatro solapas a dos, y el encabezado limpio · **10 / 10**

Commit `2114318a`, uno solo: el renombre y el retiro de la tabla van juntos, y
por eso **en ningún momento del historial hay dos solapas «Consultas»**.

**Kill-test del hito, corrido en el navegador** (`evidencia/h2/kill-test-h2.txt`,
exit 0): `/schedule?vista=table`, `?vista=cupos`, `?vista=citas` y
`?vista=solicitudes` abren el calendario, **sin ninguna tabla**, con exactamente
dos solapas y una sola «Consultas». Consola limpia.

| ID | Qué se logró |
|---|---|
| H2.S1.M1 | Destino de `table`, `citas` y `solicitudes` **escrito antes de borrar**: los tres al calendario, sin redirección (una redirección rompe el «atrás» de quien llegó por un enlace viejo) |
| H2.S1.M2 | Solapa de la tabla retirada · `yarn typecheck` exit 0 |
| H2.S1.M3 | Las tres URLs viejas abiertas en el navegador, con captura y consola limpia |
| H2.S1.M4 | Cero referencias en `src` y `cypress` · una anotada fuera de alcance (H2-P1) |
| H2.S2.M1 | Inventario: **dos** acciones huérfanas, no una — la segunda no estaba en el pedido |
| H2.S2.M2 | Solapa «Cupos» retirada · captura + typecheck 0 |
| H2.S2.M3 | Reserva recorrida entera desde el calendario: el cupo pasó de **4 libres a 3** y la cita quedó en su franja (`evidencia/h3/h2s2m3-reserva.txt`) |
| H2.S3.M1 | Renombre y retiro en el mismo commit · `git show --stat 2114318a` + prueba «una sola Consultas» |
| H2.S3.M2 | Los tres `page-actions` fuera para quien tiene calendario · 5 PASS del kill-test |
| H2.S3.M3 | Reemplazo declarado para los tres (tabla más abajo) |

**Dónde vive ahora cada botón que se quitó del encabezado:**

| Botón | Dónde está ahora |
|---|---|
| «Ingreso Mostrador» | Encabezado del **día** (`dia-ingreso-mostrador`): se usa con alguien parado enfrente, mirando ese día |
| «Avisar demora» | Encabezado del **día** (`dia-avisar-demora`): la demora es de la jornada que se está mirando |
| «Visitas de laboratorio» | La **tarjeta de visitador** dentro de la propia solapa de Consultas (C-13), que es lo que el doctor pidió. `/lab-visits` sigue alcanzable desde ahí |

Y **sin calendario los tres siguen en el encabezado**: quien reparte turnos y
quien no publicó su agenda no tienen día donde recibirlos, y quitárselos también
a ellos sería sacarles la función, no moverla.

### H3 — El alta sobre un cupo: modal, sin hora, toggles y horario respetado · **11 / 11**

**Kill-test del hito, con teclado real** (`evidencia/h3/h3s1-modal-teclado.txt`,
exit 0): el formulario **no** aparece al pie en ningún camino; el modal es
`:modal` de verdad; el foco inicial cae adentro; 18 tabulaciones seguidas y
ningún control de la página fuera del modal recibió el foco; `Escape` cierra y
el foco vuelve al disparador; con el modal abierto otro rato del día no es
alcanzable.

| ID | Qué se logró |
|---|---|
| H3.S1.M1 | Se reusa `app-content-dialog` (el `<dialog>` nativo del sistema), no se escribió uno — y `shared/**` no es de este carril |
| H3.S1.M2 | `app-tarjeta-del-dia` montada dentro del diálogo; cero apariciones al pie |
| H3.S1.M3 | Foco: entra, queda atrapado, `Escape` cierra, vuelve al disparador — los cuatro medidos |
| H3.S1.M4 | Con el modal abierto el fondo queda inerte: no se abren dos |
| H3.S2.M1 | Sobre un cupo no hay campos de hora y la franja se muestra como dato. Y **el guardado toma la franja del cupo**, no las señales: esconder los campos no alcanzaba |
| H3.S2.M2 | Radios → `segmented-control`. **Cero radios nativos** en el formulario |
| H3.S2.M3 | Flechas cambian la opción, `aria-checked` en exactamente una, el grupo se anuncia con su pregunta |
| H3.S3.M1 | Los cupos del día coinciden franja por franja con el horario publicado: 08:00–12:00 en 30 min, las dos pantallas en la evidencia |
| H3.S3.M2 | **Defecto encontrado y corregido**: el día pintaba «Disponible» cualquier cupo sin cita encima, incluidos los cerrados y los sin capacidad. Nuevo estado `no-disponible`, derivado de `remainingCapacity` igual que la tabla. Y sobre un bloqueo **no se crea nada**: la regla está en `guardar()`, no en el botón |
| H3.S3.M3 | Horario extra modelado como excepción `EXTRA` con `isAvailable: true`, nunca un cupo inventado. Petición literal en los tests; ver limitación abajo |
| H3.S3.M4 | Diálogo que **nombra** que se sale del horario («termina a las 12:00 … ese rato se puede reservar»), cancelar no crea nada, cero `confirm()` |

### H4 — Semana y mes se leen como el día, y la tarjeta lleva a atender · **9 / 9**

**Kill-test del hito** (`evidencia/h4/h4.txt`, exit 0): se llega a una cita de la
semana **sólo con el teclado** (32 tabulaciones) y el globo se abre igual que con
el puntero.

| ID | Qué se logró |
|---|---|
| H4.S1.M1 | Componente de detalle localizado y **compartido** en `detalle-de-la-cita.ts`: el globo de la semana y el diálogo del día arman sus pares con la misma función |
| H4.S1.M2 | El globo trae los mismos cinco campos; `Enter` abre el mismo diálogo |
| H4.S1.M3 | Teclado y `prefers-reduced-motion` verificados (transición ≤ 0,001 s y sigue visible) |
| H4.S2.M1 | Los chips salen de `booking-status.ts`, no de una lista nueva. **Defecto corregido**: el globo del mes mostraba el `display` del catálogo, **en inglés** («Booking in progress») |
| H4.S2.M2 | La tarjeta del mes trae sus chips |
| H4.S2.M3 | «Atendida», «No asistió», «En curso» — palabra además de color, verificado en escala de grises |
| H4.S3.M1 | La tarjeta entera navega; los botones de adentro hacen lo del botón. **Defecto corregido en H6** (ver abajo) |
| H4.S3.M2 | Al destino viajan `motivo` y `cita` = el `appointmentId`, **no** el `id` de la reserva. URL pegada en la evidencia |
| H4.S3.M3 | `rutaAtencion === null` ya no es silencioso: se nombran las dos causas |

### H5 — Una consulta a la vez, el visitador y los otros servicios · **9 / 9**

**Kill-test del hito** (`evidencia/h5/h5.txt`, exit 0): con una consulta en curso,
iniciar otra **no arranca** y dice cuál está abierta; y el rato de un servicio
programado aparece bloqueado en la agenda clínica.

| ID | Qué se logró |
|---|---|
| H5.S1.M1 | El dato es `BOOKING_IN_PROGRESS`, un estado del ciclo. **Ninguna bandera nueva en el cliente** |
| H5.S1.M2 | Con una abierta, iniciar otra no la inicia; se dice con quién, desde cuándo y por qué, y se ofrece ir a ella. La segunda no cambia de estado |
| H5.S1.M3 | **Brecha del contrato registrada**: el manejador simulado no valida nada en `start`. El 409 se ejercita contra un doble declarado |
| H5.S2.M1 | Límite citado: el visitador no accede a información clínica (`pharma-lab.types.ts:9-11`). Traer la tarjeta es presentación |
| H5.S2.M2 | Tarjeta con tono propio **y la palabra «Visitador»**, verificada en escala de grises. Cero datos clínicos. Y el «con quién» **no se inventa** (ver hallazgos) |
| H5.S2.M3 | La duración sale de `durationMinutes`; los 15 min son el respaldo. La **configuración** no existe en ningún contrato: `Q-P4`, declarado |
| H5.S3.M1 | Vistas recicladas nombradas: `app-schedule-grid` (la misma de «Mis horarios»), `segmented-control`, `app-content-dialog` |
| H5.S3.M2 | Horario programado y **bloqueo visto** en la agenda clínica: «Otros servicios · Consulta cardiológica», 14:00–16:00 |
| H5.S3.M3 | La petición lleva `exceptionType: 'OTHER'` + `reason`; **no** se amplió el enum |

### H6 — Acciones con texto, regresión, prueba visual y cierre · **6 / 7**

| ID | Qué se logró |
|---|---|
| H6.S1.M1 | Medición previa: **32** `iconOnly` en mis archivos |
| H6.S1.M2 | Las 12 acciones de fila → **un** desplegable (`app-menu`, el del sistema) con icono **y** texto por opción. La fila sigue en un renglón |
| H6.S1.M3 | Medición nueva: **6**. Los 26 convertidos y los 6 que quedan, con su motivo, en `evidencia/h6/h6s1m3-iconoonly-despues.txt`. Ninguno de los 6 es una acción de tabla |
| H6.S2.M1 | `yarn typecheck` 0 · `yarn lint` 0 · **471/471** specs de agenda y mis-servicios (baseline: 430) |
| H6.S2.M2 | Barrido **5/5 PASS**. Click-sweep 3/4: el rol Médica falla con 10 clics rotos, **todos fuera de mi alcance** y **cero en `/schedule` y `/my-services`**. Ver «No cubierto» |
| H6.S3.M1 | 36 capturas (3 viewports × 2 temas × 6 pantallas), **miradas**, con su observación en `evidencia/h6/INDICE-VISUAL.md`. Encontró 3 defectos, los tres arreglados |
| H6.S3.M2 | Este archivo |

---

## A medias

### H6.S2.M2 — El click-sweep no cierra en verde

- **Qué anda:** el barrido de rutas pasa **5/5** en los cinco roles. El
  click-sweep pasa en 3 de 4 roles, y **cero de los clics rotos está en
  `/schedule` ni en `/my-services`**, que es lo que el DoD de la microtarea
  pide.
- **Qué no anda:** el rol «Médica» falla con 10 clics rotos: 6 en
  `/my-account/profile/edit` (reservado para **Itzan**) y 4 en
  `/my-quotations/new` (de nadie esta noche).
- **Qué falta exactamente:** correr el mismo spec sobre el corte base
  `68dcb562` para demostrar que ya fallaba antes. No se hizo: la corrida tarda
  **7,7 minutos** y el turno no dio para dos. Lo que **sí** está demostrado es
  que mi rama toca 26 archivos y **ninguno** participa de esas dos rutas
  (`git diff --name-only 68dcb562..HEAD`, pegado en la evidencia). Eso hace muy
  probable que sea baseline, pero **no lo prueba**, y por eso la microtarea no
  se marca `HECHO`.
- **Dónde quedó:** `evidencia/h6/h6s2m2-barrido.txt`, con la salida literal y el
  listado de los 10 rotos. Artefactos de Playwright en
  `artifacts/playwright/salida/`.

---

## Pendiente

Ninguna. Las 55 microtareas están en `HECHO` (54) o `A MEDIAS` (1). Ninguna
quedó en `TODO`, en `EN CURSO`, en `BLOQUEADO` ni en `DESCARTADO`.

---

## Evidencia

```text
evidencia/
├─ entrar.mjs                          helper de sesión (medica@alovida.mock)
├─ antes/                              H1: corte, gates, specs y capturas previas
│  ├─ estandar-instalado.txt           180 skills · 14 reglas · plan_gate 11 PASS 0 FAIL
│  ├─ gates.txt                        typecheck 0 · lint 0
│  ├─ h1s3m2-specs-baseline.txt        17 archivos · 430 verdes
│  ├─ h1s2m1-solapas.txt  h1s2m2-destinos.txt  h1s2m3-inventario-huerfanos.txt
│  └─ capturas/                        las 4 solapas + el encabezado, antes
├─ h2/  kill-test-h2.txt (PASS) · gates.txt · h2s1m4-referencias.txt · capturas/
├─ h3/  h3s1-modal-teclado.txt (PASS) · h3s2-toggle.txt (PASS) · h3s3-extra.txt (PASS)
│       h2s2m3-reserva.txt (PASS) · gates.txt · capturas/
├─ h4/  h4.txt (PASS) · gates.txt · capturas/
├─ h5/  h5.txt (PASS) · gates.txt · capturas/
└─ h6/  h6s1m1-iconoonly-antes.txt · h6s1m3-iconoonly-despues.txt
        h6s2m1-gates.txt · h6s2m2-barrido.txt · h6s3m1-visual.txt
        INDICE-VISUAL.md · capturas/ (36)
```

Los gates del cierre, literales:

```text
$ yarn typecheck
typecheck exit=0

$ yarn lint
lint exit=0

$ npx ng test --include='src/app/features/agenda/**/*.spec.ts' \
              --include='src/app/features/my-services/**/*.spec.ts' --watch=false
 Test Files  17 passed (17)
      Tests  471 passed (471)

$ E2E_BASE_URL=http://localhost:4200 npx playwright test playwright/mockup-barrido.spec.ts --workers=1
  5 passed (23.5s)
```

---

## No cubierto

Cosas hechas o tocadas que **no** quedaron verificadas, distintas de lo pendiente:

1. **El 409 de «una consulta a la vez» contra el servidor real.** El manejador
   simulado no valida nada en `POST /bookings/:id/start`. El camino del conflicto
   está ejercitado **contra un doble declarado**, no contra el servidor.
2. **El horario extra no se puede reservar** (HALLAZGO H3-P1). La excepción
   `EXTRA` se crea y se acepta, pero el manejador simulado no genera cupos para
   su ventana: el rato existe como excepción y no aparece como disponible. Es de
   `core/mock/**`, de Ender.
3. **La configuración de la duración de la visita** (C-13, `Q-P4`): no existe en
   ningún contrato. El mecanismo lee `durationMinutes`; lo que falta es la
   pantalla donde el doctor lo fije.
4. **El click-sweep sobre el corte base**, ya explicado en «A medias».
5. **Estados de carga, vacío y error** de las pantallas tocadas: las 36 capturas
   son del estado «con datos». Forzar un fallo exige tocar `core/mock/**`.
6. **Lector de pantalla real**: se verificó el árbol de accesibilidad y el
   recorrido de teclado, no una corrida con NVDA o VoiceOver.
7. **La persistencia entre recargas** de lo que se crea: las colecciones del
   backend simulado viven en memoria y una recarga completa las reinicia. Lo que
   se verificó es la **relectura contra el servidor simulado** (salir del día y
   volver), que es lo que hay.

---

## Desvíos del plan

| Qué se hizo distinto | Por qué |
|---|---|
| **La lista de Consultas y la grilla de Cupos sobreviven donde NO hay calendario** | El pedido es sobre la pantalla del doctor, que tiene calendario. Quien reparte turnos y quien no publicó su agenda no tienen día que mirar: dejarlos con una sola solapa de horario sería sacarles la pantalla, no limpiarla. Son excluyentes con el calendario, así que nunca hay dos «Consultas» |
| **Los tres botones del encabezado también sobreviven ahí** | Mismo motivo: sin día no tienen dónde recibirlos |
| **Se tocó la reprogramación, que el pedido no nombra** | `iniciarReprogramacion()` saltaba a `vista=cupos` **por código**. Quitar la solapa sin esto dejaba «mover una cita» apuntando a una solapa inexistente. Ahora los ratos libres del día son el destino |
| **Se agregó el estado `no-disponible` al día** | Encontrado ejercitando H2.S2.M3: el día ofrecía «Disponible» un cupo ya reservado. La tabla lo derivaba bien y el día no |
| **Se convirtieron 14 `iconOnly` fuera de las acciones de fila** | H6.S1 pedía el desplegable de la agenda; C-06 dice además «botón = icono + texto». Los botones de barra de mis archivos lo cumplen ahora |
| **Se tocó `features/agenda/blocks/**`** | Está dentro de `features/agenda/**`, mi área reservada. Son tres botones que pasaron a llevar texto |

---

## Riesgos residuales y deuda

| Riesgo | Impacto | Qué lo cierra |
|---|---|---|
| El freno de «una consulta a la vez» es **del cliente** | Dos pestañas, o el teléfono, pueden abrir dos consultas: la pantalla sólo ve la ventana que leyó | La validación en el servidor. Registrado como brecha |
| El horario extra no genera cupos | El doctor lo crea y no puede reservar ahí | Pedido a Ender (abajo) |
| La duración de la visita no es configurable | Toda visita se dibuja con lo que traiga, o 15 | Decisión de negocio + contrato |
| `agenda.ts` tiene 2.500 líneas | Cada cambio es más caro | Fuera de alcance: se anota, no se refactoriza |
| Los `data-testid` de las acciones ahora viven dentro de un desplegable | Un test de otro carril que los busque sin abrirlo va a fallar | Avisado en el daily; el patrón está en `agenda.spec.ts` |

---

## Decisiones y ambigüedades

| ID | Qué | Supuesto tomado | A quién confirmárselo |
|---|---|---|---|
| Q-D1 | Sobre qué rama aplica | `origin/mockup`, corte `68dcb562` | Coordinación |
| Q-D6 | «OTROS SERVICIOS» no está en los 7 motivos | `OTHER` + `reason: 'Otros servicios · <servicio>'` | **Negocio** |
| Q-P1 | A dónde caen `vista=citas` y `solicitudes` | Al calendario, sin redirección | Doctor |
| Q-P2 | «Los botones de arriba a la derecha» son tres | Se quitan los tres; el de visitas queda cubierto por C-13 | Doctor |
| Q-P3 | Cupos históricos que no coinciden con el horario | No se borra ninguno | Doctor / negocio |
| Q-P4 | La duración configurable de la visita no existe | 15 min por omisión desde el dato; la configuración queda pedida | **Ender + negocio** |
| Q-P5 | El horario del servicio, ¿agenda propia o excepción? | Excepción sobre el recurso del profesional | Doctor / negocio |
| **D-nuevo** | El nombre del visitador no está en el contrato del doctor | La tarjeta dice «Visita de laboratorio» y el lugar. **No se muestra el uuid** | Ender |

### Hallazgos que afectan a otros

| ID | Qué | A quién |
|---|---|---|
| **H1-P3** | Quitar «Cupos» rompe además la reprogramación, que salta ahí por código | (resuelto acá) |
| **H1-P4** | Con dos solapas, `enListas()` queda siempre falso y con él los filtros de ventana, canceladas y sede | Coordinación: son función perdida del calendario, no repuesta en este turno |
| **H1-P5** | «Mis horarios» monta un segundo `tablist` anidado: un locator por `aria-selected` no encuentra la solapa activa | Marcelo (su recorrido) |
| **H2-P1** | `playwright/agenda-pestana-horario.mjs:65` y `agenda-tabla-y-mes.mjs:42` navegan a `?vista=table` y ya no muestran la tabla que documentaban | Su dueño (carril del 18/09) |
| **H3-P1** | `POST /exceptions` con `isAvailable:true` no genera cupos: el horario extra no se puede reservar | **Ender** |
| **H5-P1** | `POST /bookings/:id/start` del simulado no valida el estado previo ni la concurrencia | **Ender** |
| **H5-P2** | El contrato del doctor no publica el nombre del visitador ni el del laboratorio | **Ender** |
| **H6-P1** | `menu-item` dimensiona el ícono con `[slot='icon'] svg`: el slot va en un envoltorio, no en el propio `<svg>`. Cuesta una pasada visual descubrirlo | Itzan (documentar en el componente) |
| **H6-P2** | `app-back-link` sólo ofrece modo `iconOnly` para el encabezado: C-06 lo dejaría sin texto en todas las secciones | Itzan |

---

## Handoff

| A quién | Qué |
|---|---|
| **Todo el equipo** | El corte que fijé es `68dcb562`, no `68969782`. Los gates estaban en verde antes de tocar (typecheck 0, lint 0, 430 specs) |
| **Itzan** | Mi área quedó en **6** `iconOnly`, los seis justificados por escrito. Dos hallazgos para `shared/**`: H6-P1 y H6-P2. Usé `app-content-dialog`, `segmented-control`, `app-menu` y `app-status-seal` tal como están; no me faltó nada |
| **Marcelo** | `/schedule?vista=table`, `?citas`, `?solicitudes` y `?cupos` **ya no muestran tabla**: abren el calendario. El camino tarjeta → iniciar encuentro es `dia-ir-a-atender` y lleva a `/medical-records/:id/consultation?motivo=…&cita=…`. Ojo con H1-P5 al armar locators |
| **Ender** | Tres pedidos: **(1)** que `POST /resources/:id/exceptions` con `isAvailable:true` genere cupos para su ventana, o el horario extra no se puede reservar; **(2)** que `POST /bookings/:id/start` rechace cuando ya hay otra en curso; **(3)** que el contrato de visitas publique el nombre del visitador o de su laboratorio, porque hoy la tarjeta no puede nombrarlo |
| **Justin** | Iniciar el encuentro ahora tiene un freno: con una consulta en curso no arranca otra. Tu receta se prueba **dentro** de la que ya esté abierta |

**Procesos que quedaron corriendo:** uno, declarado — el `yarn start` del
servidor de desarrollo en el puerto 4200, levantado para esta sesión. Ningún
navegador, ningún Playwright, ningún subagente. Los scripts de `evidencia/`
cierran su navegador al terminar.
