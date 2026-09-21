# Verificación contra el código real — correcciones del doctor, 2026-09-20

> **Para qué existe.** Las 24 correcciones de
> [`CORRECCIONES-DOCTOR-2026-09-20.md`](../requisitos/CORRECCIONES-DOCTOR-2026-09-20.md) están
> escritas desde la maqueta desplegada: hablan de pantallas, no de archivos. Este documento las
> cruza contra el código **abriendo los archivos**, para que ningún prompt del reparto mande a
> alguien a buscar algo por su cuenta pudiendo decirle dónde está.
>
> **Peldaño de evidencia de este documento: `DISCOVERED` (regla 30).** Todo lo de acá es lectura de
> archivos en un corte declarado. **No se ejecutó nada**: no se corrió build, ni tests, ni se abrió
> la maqueta en un navegador. Que un símbolo exista no prueba que la pantalla se comporte como su
> comentario promete. Todo lo que sea comportamiento sigue siendo de quien recibe el prompt.

## 0. El corte — leer esto antes que nada

| Qué | Valor |
|---|---|
| Repo del frontend | `alovida/mantra-core-health` |
| Rama que corresponde a la maqueta | **`origin/mockup`** |
| Corte leído | **`689697821a6e6d2c8f702c7508d6728fa9a1869a`** — «Merge pull request #554 from mdavila-2001/justin/build-rotulos-y-precios», `Sun Sep 20 12:32:53 2026 -0400` |
| Repo del backend | `alovida/mantra-core-health-api`, ref `origin/dev` = `c2c071a4` |
| Modelo | `alovida/mantra-core-health-model` (`SQL/`, `NoSQL/`) y `alovida/salud-db` (generadores) |
| Documentación de dominio | `alovida/mantra_core_technologies_health_docs` (= `Mantra Core Health Vault`) |

> ### ⚠️ Tres trampas del corte, y le van a pasar a todos
>
> 1. **La copia de trabajo local NO es la maqueta.** El working copy de
>    `alovida/mantra-core-health` está en `feat/admin-portal-frontend` (= punta de `dev`, PR #478).
>    La rama `mockup` **local** está más atrasada todavía (PR #420). La que corresponde a lo que el
>    doctor vio es **`origin/mockup` (PR #554)**. Leer el working copy para estas correcciones
>    devuelve líneas que no existen en la maqueta — de hecho, tres de las cosas que el doctor
>    describe (`?vista=table`, la solapa «Calendario», el botón «Mis horarios») **no existen** en el
>    working copy y sí en `origin/mockup`.
> 2. **Los números de línea de este documento son del corte `68969782…`.** Verificalos con
>    `git show origin/mockup:<ruta> | grep -n` antes de editar. Si tu `origin/mockup` avanzó, ese es
>    tu corte, y lo declarás en tu `PLAN.md`.
> 3. **La maqueta no habla con ninguna API.** `src/environments/environment.ts` de `mockup` fija
>    `mockBackend: true` **sin leer el entorno del proceso**, con este comentario textual: *«Siempre
>    encendido en la rama `mockup`: es lo que la define. No lee el entorno del proceso a propósito,
>    para que no haya forma de apuntar esta rama a una API real por accidente.»* Consecuencia
>    práctica: **el DoD de estas correcciones se demuestra contra los manejadores simulados de
>    `src/app/core/mock/`**, y un cambio que necesite datos nuevos necesita también su manejador.
>    Eso **no** exime de respetar el contrato real de la API: el simulado es un doble del contrato
>    (regla 65), y si el contrato real no soporta lo que se pide, eso es un hallazgo que se registra,
>    no una licencia para inventar el contrato.

### Cómo se verifica algo en esta rama (comandos reales, del `README` del simulador)

```bash
# instalar y levantar: no hace falta .env, ni proxy, ni API, ni base
yarn install
yarn start                                    # http://localhost:4200

# gates estáticos
yarn typecheck                                # tsc app + cypress + playwright
yarn lint

# unitarios dirigidos (Vitest vía el CLI de Angular)
npx ng test --include=<ruta al spec> --watch=false

# el simulador entero, con cada cuenta: nada lanza ni devuelve 500
npx ng test --include=src/app/core/mock/mock-backend.spec.ts --watch=false

# cada pantalla con cada cuenta (Chromium) → artifacts/playwright/mockup/MOCKUP_MATRIX.md
E2E_BASE_URL=http://localhost:4200 npx playwright test playwright/mockup-barrido.spec.ts --workers=1

# cada botón de cada pantalla: se pulsa, se cierra lo que abre, y se anota excepción,
# error de consola, 5xx o petición sin manejador → artifacts/playwright/mockup/MOCKUP_CLICKS.md
E2E_BASE_URL=http://localhost:4200 npx playwright test playwright/mockup-click-sweep.spec.ts --workers=1
```

**Cuentas de la maqueta** (cualquier contraseña no vacía): `medica@alovida.mock`,
`paciente@alovida.mock`, `admin@alovida.mock`, `superadmin@alovida.mock`,
`visitador@alovida.mock`. Son cuentas **sintéticas declaradas** — ninguna es una persona real, y
por eso se pueden pegar en el reporte. Regla 70.3: **un solo worker**; Playwright serial.

---

## 1. Localización, corrección por corrección

### C-01 · Quitar «Cómo atendés» de la pestaña «Dónde atiendo»

- La pestaña y su contenido: `src/app/features/account/my-profile/practitioner-profile/practitioner-profile-view/practitioner-profile-view.html`, la sección «Cómo atendés» arranca en el comentario de la **línea 417** y el `<h3>` está en la **421**. Muestra dos datos: `Telemedicina` y `Pacientes nuevos`.
- El índice de pestañas es una constante compartida: `src/app/features/account/my-profile/pestanas-del-perfil-medico.ts`, `PESTANAS_DEL_PERFIL_MEDICO` — «Dónde atiendo» es el índice **2** (`PESTANA_MEDICO.dondeAtiendo`).
- **Ojo con el spec de al lado:** `pestanas-del-perfil-medico.spec.ts` lee los `key:` del alta de profesional y **falla si un campo del alta no está mapeado a una pestaña**. `CAMPO_DEL_ALTA_EN_PESTANA` mapea `officeName`, `municipioConsultorio`, `officeAddressLines` y `gpsConsultorio` a `dondeAtiendo`. Vaciar la pestaña sin tocar ese mapa deja el spec en verde mintiendo; quitar el mapa sin ofrecer los campos en otro lado rompe el spec. **Las dos cosas se deciden juntas.**

### C-02 · Quitar los dos enlaces y llevar el consultorio a una pestaña con su QR

- El bloque con los enlaces: `src/app/features/account/my-profile/my-profile.html`, `routerLink="/administration/my-practice"` en la **línea 41** (en el corte `68969782…` quedó **uno** de los dos; el otro, `/administration/medical-organization`, **ya no aparece** en ese archivo: verificalo antes de «quitarlo»).
- La pantalla destino existe: `src/app/features/practice/my-practice/my-practice.{ts,html}` — *«Mi consultorio propio — dónde atiende el profesional por su cuenta»*.
- El QR de sede ya existe como diálogo: `src/app/features/account/my-profile/work-history/site-bank-qr-dialog/site-bank-qr-dialog.ts`. **Es el candidato a reusar** (regla 95.1: reusar antes que crear).
- La entrada de menú «Mi consultorio propio» vive en `src/app/core/navigation/navigation.map.ts` (~línea 1378). Si el consultorio pasa a ser pestaña del perfil, hay que decidir qué pasa con esa entrada: **no se borra en silencio**.

### C-03 · Tooltips del panel con el diseño de los de la agenda

- El globo de la casa es una directiva: `src/app/shared/components/atoms/tooltip/tooltip.ts` (`appTooltip`, con `appTooltipPosition`). Se cuelga del `<body>` con `position: fixed`, así que **no lo recorta ningún contenedor con `overflow`** — que es exactamente el problema por el que un tooltip dentro de una tabla muere. Aparece con puntero (tras una espera corta) y con foco (sin espera); se va con `mouseleave`, `blur` o `Escape`. Bajo SSR no hace nada.
- **En el panel ya se usa en un lugar**: `src/app/features/dashboard/access-tree/access-tree.html` líneas **94-95** y **110-111** (`[appTooltip]="seccion.summary"`, `appTooltipPosition="bottom"`).
- Los bloques del panel que **no** lo usan: `src/app/features/dashboard/dashboard.html` — `panel-accesos` (línea 81) y `panel-ultimos-pacientes` (117). `agenda-de-hoy.html` **no tiene ni un `appTooltip`** (grep sin resultados).
- **Ambigüedad real (`Q-D5` del documento fuente):** «los paneles» puede querer decir las tarjetas del panel, o los ítems del árbol de accesos que ya lo tienen. Exige captura de los dos lados antes de tocar.

### C-04 · Las tarjetas de `/schedule` llevan a iniciar el encuentro

- `/schedule` abre, para quien atiende, la solapa **«Calendario»**: `src/app/features/agenda/agenda.html` líneas **211-221**, que monta `<app-my-agenda mode="calendar" [appointmentActions]="accionesDeLaCitaDelDia" …>`.
- Las tarjetas del día las pinta `src/app/features/agenda/my-agenda/day-view/day-view.html`: el bloque cliqueable es el botón «Ver detalle» (**líneas 182-199**), con el comentario *«Cliqueable sólo lo que TIENE detalle: el aire entre bloques no es…»*. Hoy la tarjeta entera **no** es el disparador.
- El camino a iniciar: `agenda.ts` → `iniciarAtencion(cita)` (**línea 1941**) hace `scheduling.startBooking(cita.id)` y después `irAAtender(cita)` (**1970**), que navega a `cita.rutaAtencion` con `cita.paramsDeLaAtencion`.
- La ruta destino es `consultationRoute(profileId)` = `/medical-records/:profileId/consultation`, declarada en `src/app/features/clinical-record/clinical-record.routes.ts`, y el turno viaja en el query param que ese archivo declara (`MOTIVO_QUERY_PARAM` y el del `appointmentId`). **El comentario del archivo advierte que va el `appointmentId` de la cita clínica, no el `id` de la reserva**: mandar el equivocado viola la clave foránea.
- **Cuidado:** `rutaAtencion` puede ser `null` (sin permiso de expedientes). `irAAtender` ya lo maneja. Una tarjeta cliqueable que ignore ese caso navega a `null`.

### C-05 · Editar el perfil muestra todos los campos, en todas las pestañas

- El editor tiene hoy **4** pestañas contra las **6** de la ficha: `pestanas-del-perfil-medico.ts`, `PESTANAS_DEL_EDITOR_MEDICO` (**línea 105**) saltea «Dónde atiendo» y «Actividad», y el propio archivo dice por qué: *«el consultorio propio se crea y se edita en su propia pantalla (`/administration/my-practice`, CORR-02). Duplicar acá el formulario daría dos lugares para el mismo dato y ninguna forma de saber cuál ganó»*, y *«Actividad — son los contadores de la plataforma. No se editan: se miran»*.
- **C-05 y C-02 se tocan**: C-02 pide que el consultorio sea una pestaña del perfil. Eso resuelve la objeción del «doble lugar» **sólo si el formulario del consultorio se mueve, no si se copia**. Copiarlo es exactamente el defecto que ese comentario evita.
- «Actividad» son contadores calculados. **Hacerlos editables no es un campo de formulario: sería inventar un dato.** Se registra como ambigüedad, no se implementa por analogía.
- El editor vive en `src/app/features/account/my-profile/practitioner-profile-edit/`.

### C-06 · Botón = icono + texto en todas las instancias; acciones de tabla en desplegable

- **Medición, no impresión:** en el corte hay **107 apariciones de `iconOnly` en 34 plantillas** de `src/app/**/*.html` (`git grep -o "iconOnly" origin/mockup -- 'src/app/**/*.html' | wc -l`). Ese es el inventario de partida; el reparto exige rehacer la medición en el corte propio, porque es el número que después dice si está hecho.
- El átomo: `src/app/shared/components/atoms/button/button.ts` (`app-button`, entrada `iconOnly`).
- El desplegable que el pedido describe **ya existe** y ya se usa en la agenda: `src/app/shared/components/molecules/menu/` (`app-menu` + `app-menu-item`), usado en `agenda.html` línea **524** para el pago. **Esto es lo que hay que reusar** (regla 95.1), no un componente nuevo.
- La tabla: `src/app/shared/components/organisms/data-table/` recibe `ColumnDef.cell` con un `TemplateRef`; las celdas de acción de la agenda son `#celdaAccionesCita` (**agenda.html:545**), `#accionesDeLaCitaDelDia` (**804**) y `#celdaReservar` (**811**).
- **Choque declarado (`Q-D3`):** el comentario de `celdaAccionesCita` dice textualmente *«Íconos con su globo (propietario, 2026-09-13): con texto, una solicitud ofrecía hasta cinco botones y la fila crecía a tres renglones»*. O sea: **el estado actual es una decisión de propietario, no un descuido.** El pedido nuevo gana (regla 00 §8), y el desplegable es lo que resuelve las dos cosas. Eso se registra como desvío, con las dos fechas.

### C-07 · Quitar la vista `?vista=table`

- `src/app/features/agenda/agenda.ts`: las cuatro solapas son `type AgendaTab = 'calendar' | 'consultations' | 'schedule' | 'slots'` (**línea 385**), y los valores de `vista=` son las constantes `TABLE_VIEW = 'table'` (**375**), `SCHEDULE_VIEW = 'agenda'` (**378**) y `SLOTS_VIEW = 'cupos'` (**381**). `pestanaActual()` (**808-813**) resuelve el parámetro.
- La solapa a quitar es la de la **línea 229 de `agenda.html`** (`<app-tab [label]="rotuloDeConsultas()">` con el `app-data-table` de consultas).
- **Lo que hay que resolver antes de borrar, no después:** los valores viejos `vista=citas` y `vista=solicitudes` **caen hoy a esa solapa** a propósito, para que un enlace viejo siga llegando. Si la solapa desaparece, esos enlaces tienen que caer a otra parte, y eso se decide, no se deja pasar.

### C-08 · Semana desplegable con hover · mes con hover de tarjeta y chips · «Calendario» → «Consultas»

- El nombre de la solapa está en `agenda.html` línea **212** (`<app-tab label="Calendario">`). **Cuidado con el choque de nombres:** la solapa de la línea **229** ya se llama «Consultas» (`rotuloDeConsultas()`, definido en `agenda.ts`). Por eso C-07 y C-08 se hacen en el mismo hito: quitar una y renombrar la otra en dos pasos separados deja dos «Consultas» a la vez.
- El conmutador Día/Semana/Mes: `src/app/features/agenda/my-agenda/my-agenda.html` líneas **11-42** (tres botones con `calendario__vista--activa`).
- Las tres vistas: `week-view/`, `month-view/`, `day-view/` bajo `my-agenda/`. El mes recibe `dayDetail="bookings"` y `[selectable]="true"` (**my-agenda.html:114-124**).
- Hoy, el hover rico existe en el **día** (`day-view.html:182-199`, «Ver detalle»); en `month-view.html` el único condicional de detalle es `@if (dayDetail() === 'bookings')` (**línea 117**), y en `week-view.html` no hay tooltip. Eso es lo que el pedido llama «el componente hover que tienen los demás».
- Los estados que hoy se pintan con sello: `app-status-seal` (`agenda.html:401`), y los chips existen como átomo (`app-chip`). Para «si está o no atendido», los estados reales del ciclo son `SOLICITADA → CONFIRMADA → EN CURSO → COMPLETADA` (más canceladas y no-show), resueltos en `src/app/features/agenda/booking-status.ts`. **Los chips salen de ahí, no de una lista nueva.**

### C-09 · Especialidades como grid de insignias, homogéneo en todo el proyecto

- Dónde se pintan hoy, sólo en la ficha del profesional (`practitioner-profile-view.html`): como `<dt>Especialidades</dt>` con chips (**165-172**), como chips consolidados (**761-779**) y como lista con badges dentro de la pestaña «Credenciales» (**1215-1268**). **Tres formas distintas en un mismo archivo** — que es literalmente lo que el pedido llama no homogéneo.
- Piezas a reusar: `src/app/shared/components/atoms/specialty-icon/` (icono por especialidad), `atoms/chip/`, `atoms/badge/`, y `organisms/specialty-browser/`. **Buscar antes de crear** (regla 95.1): ya hay un átomo de icono de especialidad.
- Otros lugares donde la especialidad se muestra y tendrían que quedar iguales: el directorio de médicos y el perfil público (`src/app/features/directory/**`, `src/app/features/public-profile/**`). El inventario medido es microtarea del reparto.

### C-10 · Quitar «Cupos» · llenar desde un modal · sin pedir hora · toggles · slots reales · extensión

- La solapa «Cupos» es la de `agenda.html` línea **281**, con `columnasDeCupos()` y la celda `#celdaReservar` (**811**), cuyo destino es `bookingNewRoute(cupo.id)` → `/schedule/book/:slotId` (`agenda.routes.ts`).
- **El «formulario que aparece en la parte de abajo» es `app-tarjeta-del-dia`**: `my-agenda.html` líneas **148-162**, dentro del panel del día, con el comentario *«LA TARJETA (AG-5): tocar un rato libre del día la abre con esa franja ya puesta»*. Recibe `[desdeInicial]` y `[hastaInicial]`. El componente está en `my-agenda/tarjeta-del-dia/`.
- El diálogo de la casa para convertirlo en modal: `src/app/shared/components/organisms/content-dialog/` (el que usa la pantalla de atención) o `molecules/dialog/`. **Reusar, no crear.** Regla 95.4.2: rol y nombre, foco inicial adentro, foco atrapado, cierre por `Escape` y **restauración del foco** al elemento que lo abrió.
- Los toggle en vez de radio: existe `molecules/radio-group/` (lo actual) y `molecules/segmented-control/` (el candidato). Regla 95.1.
- Bloqueos y descansos: los pinta `[bloqueos]="bloqueosDelMes()"` (`my-agenda.html:110, 120, 133`). El catálogo de motivos lo sirve `GET /scheduling/exception-types`; en el simulado, `src/app/core/mock/handlers/scheduling.handlers.ts` **líneas 29-35** (`TIPOS_DE_BLOQUEO`), y el `POST` de excepción está en la **571**. Cada tipo trae `blocks: true|false` — `EXTRA` es el único con `blocks: false`, porque **añade** disponibilidad en vez de quitarla. **Ese es el tipo con el que se modela la extensión por emergencia que pide el pedido**, y por eso la extensión no es «un slot inventado»: es una excepción `EXTRA`.
- La confirmación «¿querés extender esta consulta? se sale de tu horario de atención» es un diálogo de confirmación, no un `confirm()` del navegador: en esta base de código un diálogo modal del navegador **congela la automatización** y además no cumple 95.4.2.

### C-11 · No se pueden iniciar dos consultas a la vez · quitar los botones de arriba a la derecha

- Los botones de arriba a la derecha son los `page-actions` de `agenda.html`: **línea 13** («Avisar demora», bajo `puedeAvisarDemora()`), **27** y **49** (`<a … routerLink="/lab-visits">Visitas de laboratorio`). Los tres salen del `app-page-header`.
- **No se borra una puerta sin dejar camino**: el comentario de la línea ~27 dice que «Visitas de laboratorio» ya salió del menú y que ese enlace **es** el camino que quedó. Quitarlo sin C-13 hecho deja la bandeja de visitas inalcanzable. Por eso C-11 y C-13 están en el mismo lote.
- La regla de «una sola a la vez»: hoy el único freno es `operando()` (`agenda.ts:1942`), que impide **dos clics simultáneos en la misma pantalla**, no dos consultas iniciadas. Lo que distingue una consulta en curso es su estado: `sePuedeCompletar(cita)` ofrece «Continuar consulta» y el comentario dice que `startBooking` sobre una cita ya iniciada responde **409**. O sea: **el dato para la regla ya está del lado del cliente** (hay cita en `EN CURSO`), y el 409 es el respaldo del servidor. Lo que falta es el aviso que explique por qué no se puede, en vez de un botón que falle.

### C-12 · Horarios de «Mis Servicios» que bloquean la agenda con razón «Otros servicios»

- La pantalla existe y **sólo lista el catálogo**: `src/app/features/my-services/my-services.{ts,html}`, con `ServicesCatalogClient` (`src/app/core/data-access/services-catalog/`). **No tiene ninguna programación de horarios**: su HTML no menciona horario ni agenda.
- Las vistas «a reciclar» son las del horario publicado: `my-agenda.html` en su modo no-calendario (desde la **línea 180**), con `app-schedule-grid` (**463**) y el alta por fases de `agenda/agenda-create/`.
- **El choque de contrato, y es el hallazgo más importante de esta corrección:** el motivo «OTROS SERVICIOS» **no existe**. El contrato real tiene una lista **cerrada de 7**: `mantra-core-health-api/src/modules/scheduling/dto/scheduling-catalog.dto.ts` **línea 735**, `EXCEPTION_TYPES = ['ABSENCE','HOLIDAY','VACATION','CONFERENCE','ERRAND','EXTRA','OTHER']`, validada con `@IsIn(EXCEPTION_TYPES)` (**754**), y el propio archivo dice que *«`OTHER` **exige** el texto libre de `reason`: es lo que permite que la lista se quede corta sin bloquear a nadie, y lo que la gente escriba ahí es la mejor fuente para ampliarla después»*.
  - **Salida sin romper contrato:** `exceptionType: 'OTHER'` + `reason: 'Otros servicios'`, que es exactamente el uso que el contrato documenta.
  - **Ampliar el enum** (un `SERVICE` nuevo) es cambio de contrato **y** de terminología (`exception_type_concept_id` es FK a `terminology.catalog_concepts`): eso es decisión de negocio, se registra, no se hace de paso.

### C-13 · Visita de laboratorio en la misma pestaña, tarjeta roja VISITADOR, 15 min configurable

- El carril del visitador ya existe completo: `src/app/core/data-access/pharma-lab/pharma-lab.{client,types}.ts` — `POST /visit-requests`, `GET /visit-requests/mine`, y el tipo *«Ventana semanal en la que un doctor recibe visitadores»* (`pharma-lab.types.ts:102`). El simulado: `src/app/core/mock/handlers/pharma-lab.handlers.ts`, con `durationMinutes` por solicitud (líneas 64-65) y una cuenta de visitador (`visitador@alovida.mock`).
- La bandeja actual: sección `lab-visits` (`src/app/app.routes.ts:290`, `navigation.map.ts:488`).
- **Límite duro que hay que respetar:** `pharma-lab.types.ts` línea 9 dice, citando la especificación (5316-5318), que **el visitador no accede a información clínica** y que una visita comercial **no se mezcla** con la agenda clínica. Traer la tarjeta a la misma pestaña es **presentación**; no puede convertirse en que el visitador vea pacientes ni en que la visita se cuente como consulta. Regla 90.1: la autorización no la decide la pantalla.
- «Rojo» es un tono semántico del sistema de diseño, no un `#RRGGBB` escrito a mano (regla 95.1.5). Y regla 95.4.6: **la información no puede transmitirse sólo por color** — la tarjeta necesita la palabra «Visitador», no sólo el rojo.
- Los 15 minutos configurables: el lugar natural es la pantalla de horarios del profesional. **No hay hoy un campo así**: es contrato nuevo. Se define con Ender y se declara.

### C-14 · Cuadrícula tipo Excel en el modal de notas

- El modal es uno solo para las diez casillas: `src/app/features/clinical-record/consultation/consultation.html` **líneas 176-273**; la casilla «notas» monta `<app-free-note-block>` en la **225**.
- Lo que hay hoy: `src/app/features/clinical-record/patient-chart/free-note-block/free-note-block.html` es **«Hoja en blanco»**: un `app-rich-text-editor` que guarda versiones (`versiones()`), más el selector «¿De qué consulta es la nota?». **No hay ninguna grilla.**
- **Antes de crear nada, hay cuatro candidatos existentes que hay que descartar por escrito** (regla 95.1 / 96.1):
  1. el motor de formularios: `src/app/core/data-access/forms/`, `surveys/`, `specialty-form-block/`, `form-builder/` y las fichas estándar (`src/app/core/mock/fixtures/fichas-estandar.generated.ts`);
  2. `observation-block/` (observaciones con valor por encuentro), que es lo más parecido a «una fila por sesión» que ya existe;
  3. la nota versionada actual (`ChartNote`, con `signedAt`);
  4. `organisms/data-table/` para la presentación.
  **Dato medido:** los tipos de pregunta del motor de formularios son **cinco** —`BOOLEAN`, `MULTIPLE_CHOICE`, `SCALE`, `SINGLE_CHOICE`, `TEXT`— (`atoms/question-type-icon/question-type-icon.ts`). **No hay tipo tabla ni grupo repetible.** Así que el motor, tal como está, no da la grilla: eso es un hallazgo de contrato, y la salida honesta es la regla 65 (simular contra el doble del simulador y registrar la brecha del contrato real), no inventar un tipo de pregunta.
- «Una fila por sesión» es una **regla de integridad**: se valida donde se escribe, no sólo con un cartel (regla 96.3.2). En la maqueta el freno vive en el manejador; en el contrato real, no existe todavía.

> [!important] Errata del 2026-09-21 — **la grilla SÍ tiene dónde guardarse**
> Escrita por la línea B al ejecutar C-14. Corrige **la conclusión** del punto de arriba, no sus
> mediciones: que el motor de formularios tenga cinco tipos y ninguno sea tabla **es cierto y sigue
> en pie**. Lo que no se sostiene es el salto de «el motor no puede» a «no hay dónde», que es lo que
> originó la ambigüedad `Q-M3` del lote.
>
> **La respuesta estaba en el candidato 2 de esta misma lista.** `observation-block` —«lo más
> parecido a "una fila por sesión" que ya existe», dice el punto de arriba— usa un contrato que
> tiene las tres piezas del pedido:
>
> | Pieza de C-14 | Campo |
> |---|---|
> | «seleccionar el nombre del header» | `Observation.codeConceptId`, concepto de terminología, con el `app-concept-select` que ese bloque ya usa |
> | «una fila por sesión» | `encounterId` — las observaciones que lo comparten **son** la fila |
> | «se deben cargar para la siguiente sesiones» | `GET /clinical/patients/:id/summary` → `observations[]` + `encounters[]` |
>
> **Una fila = N observaciones con el mismo `encounterId`**, no un registro nuevo y no una
> observación con `components[]`: la escritura admite componentes (`clinical.types.ts:629`) pero la
> **lectura no los devuelve** (`interface Observation`, `clinical.types.ts:115-129`) y el simulador
> los descarta (`clinical.handlers.ts:511`). Y **las columnas no necesitan almacenamiento propio**:
> son la unión de los `codeConceptId` que esa persona ya tiene medidos.
>
> **Consecuencias para el reparto:**
> 1. **No hizo falta ningún doble** (regla 65 no aplicaba) ni ningún cambio en `core/mock/**`: el
>    simulador ya persiste observaciones y encuentros (`fixtures/clinica.ts:509-511`).
> 2. **La restricción de una fila por sesión sí tiene dónde vivir** en el contrato real: es
>    «este encuentro ya tiene observaciones», comprobable al leer.
>
> Verificado en navegador: cargar la fila → recargar la página → reabrir la casilla → sigue ahí.
> Detalle y evidencia en [`docs/trabajo/2026-09-21-dictamen-y-hallazgos-lote-B/`](../trabajo/2026-09-21-dictamen-y-hallazgos-lote-B/REPORTE.md).

### C-15 · No se puede descargar la receta desde donde se la escribe

- `src/app/features/clinical-record/patient-chart/medication-block/medication-block.html`: el botón «Descargar PDF» está en la lista de recetas, **líneas 62-70**, y su comentario dice *«La receta en papel (corrección #16). Está siempre, también sobre una emitida —que es cuando más se pide— y sobre una sin emitir, donde el documento se declara copia de trabajo»*. O sea: **estaba puesto a propósito por una corrección anterior.**
- El evento sube al padre: `(descargar)="descargarReceta($event)"` en `consultation.html` (**línea ~212**). El archivo de la pantalla de atención **no es de quien toca la receta**: cambiarlo se pide por el daily.
- **Ambigüedad que hay que registrar, no resolver por conveniencia:** «eso es fuera de la receta» puede significar (a) sólo desde el expediente/documentos, (b) sólo cuando está emitida, o (c) las dos. El supuesto del reparto: **se quita del formulario de prescripción y queda disponible sobre la receta ya emitida**, y se confirma con el doctor.

### C-16 · Quitar la demostración de la receta

- La barra de casos: `medication-block.html` **líneas 132-155** (`@if (demoActiva)`, `receta__presets`, `aplicarCasoDemo(caso)`), con badge «Demo».
- El interruptor es de entorno: `demoPresets` en `src/environments/environment.ts` — y en la rama `mockup` está **encendido por defecto** (`envFromProcess.demoPresets ?? true`). Por eso el doctor la ve.
- **Dos salidas distintas, y hay que elegir a conciencia:** quitar la barra **de la receta** (cambio de UI, no toca el resto de la maqueta) o apagar `demoPresets` en el despliegue (afecta a todas las pantallas que la usen). El pedido dice «en las recetas», así que el alcance mínimo coherente es la primera; apagar la bandera global es OUT y se registra.

### C-17 · Quitar los favoritos de la receta

- Dos lugares: el selector «Usar un favorito» (`medication-block.html` **182-193**) y el botón «Guardar como favorito` (**408-415**), más `errorDelFavorito()` (**394**).
- El cliente entero: `src/app/core/data-access/prescription-favorites/prescription-favorites.{client,types}.ts`. Si nadie más lo usa, queda código muerto: **se anota** (regla 00 §3.2, lo de afuera del alcance no se arregla de paso) y se propone su retiro como microtarea propia, con la medición de quién lo importa.

### C-18 · Poder escribir una razón además de elegir un diagnóstico

- **Puede estar ya hecho, y por eso no se declara hecho:** `medication-block.html` **líneas 375-390** ya tiene el campo «¿Cuál es el motivo?» (`motivoLibre`), condicionado a `@if (motivoEsLibre())`, con el comentario *«El motivo escrito, para cuando no hay diagnóstico registrado detrás: “sólo se fue a hacer recetar”, que en psiquiatría es lo corriente»*.
- Lo que **sí** hay que verificar ejercitando la pantalla: (1) si el campo aparece **siempre** que se elija la opción de motivo libre o sólo cuando no hay ningún diagnóstico cargado; (2) si el pedido habla de ese campo o del selector **«¿De qué consulta es la receta?»** (**línea 164**), que es el de la cita y no el del diagnóstico — el doctor cita ese rótulo textualmente. **Son dos campos distintos y el pedido nombra el primero.** Ambigüedad `Q-D4`.

### C-19 · Dosis como texto libre y quitar «Unidad»

- Hoy la dosis **cambia de forma** según el catálogo: `medication-block.html` **217-251**. Si `hayPosologia()` (el medicamento declara presentaciones o concentraciones), se ofrecen dos `select` —«Concentración» (**222**) y «Presentación» (**232**)— y **no hay campo de dosis**; si no, se ofrece «Dosis» como texto (**243**). La composición se arma en `medication-block.ts` → `posologia()` (**línea 931**), que junta concentración y presentación en `doseText`.
- «Unidad» es un `app-concept-select` (**301-306**) que acompaña a «Cantidad» (**291**).
- **El contrato lo permite:** `mantra-core-health-api/src/modules/clinical/dto/medication.dto.ts` — `doseText?: string` («Dosis en texto libre», línea **76**), `quantityDecimal?: number` (**103**) y `unitConceptId?: string` **opcional** (**111**). Quitar el control de unidad **no rompe nada**: la clave se omite.
- **La decisión que este pedido fuerza y hay que hacer explícita:** si la dosis vuelve a ser siempre texto libre, ¿qué pasa con los dos `select` del catálogo? Dejarlos **y** el texto da dos fuentes para el mismo dato (y `posologia()` pisa lo escrito). El supuesto del reparto: **la dosis en texto libre manda siempre**, y concentración/presentación quedan como atajos que **rellenan** ese texto — nunca como una segunda fuente. Se confirma con el doctor.

### C-20 · Frecuencia por defecto del medicamento (posología)

- El mecanismo por donde entraría ya existe: `medication-block.ts` lee la ficha del concepto (`terminology.readConceptDetail`, **línea 900**) y saca listas de `ficha.properties` con las claves `dose_forms` (**112**) y `strengths` (**113**). **Una frecuencia por defecto sería una propiedad más del mismo mecanismo**, y eso es lo coherente con el patrón presente (regla 00 §4).
- La frecuencia hoy: campo de texto libre con chips de atajo (`medication-block.html` **254-277**), y `frequencyText?: string` en el contrato (`medication.dto.ts:95`).
- **Y acá está el límite que no se cruza.** El catálogo de medicamentos del proyecto es
  `mantra-core-health-api/src/common/seed/data/vademecum/vademecum.dataset.json`, y **él mismo declara su licencia**: *«Dato de desarrollo sin fuente autoritativa — contenido escrito a mano para ejercitar la receta en desarrollo, no apto para uso clínico ni producción (ver B-13 en REGISTRO-DEFECTOS.md)»*. Tiene **17 conceptos** y exactamente **cuatro** propiedades: `therapeutic_class`, `strengths`, `routes`, `dose_forms` (medido: `grep -o '"property_code": "[a-z_]*"' … | sort | uniq -c`). **Cero apariciones de `frequency`.**
- El precedente de la casa para este mismo problema está escrito: **B-13** en `mantra-core-health-api/REGISTRO-DEFECTOS.md` (línea **101**) — 17 medicamentos con contraindicaciones e interacciones escritas a mano; se resolvió **quitando las fuentes falsas** (de 3 fuentes inventadas a 1 declarada como dato de desarrollo) y poniendo un gate de producción. **Ese es el camino a copiar.**
- Conclusión operativa, y es de regla, no de opinión (**regla 97.5.4**: prohibido inferir dosis, contraindicaciones, interacciones o equivalencias sin fuente con procedencia y revisión humana): **el mecanismo se implementa; la posología concreta de cada fármaco NO se inventa.** Los valores de desarrollo se declaran sintéticos con su procedencia, y quién provee la fuente autoritativa es decisión de negocio registrada.

### C-21 · Todo lo que sean opciones, `select`

- El átomo existe: `atoms/select/`, y `molecules/concept-select/` para lo que sale de terminología.
- Los casos visibles en la receta: los chips de frecuencia (`medication-block.html` **265-276**) y los de duración (**317-329**), los dos con el comentario de que son «atajos» y que «el texto libre sigue mandando».
- Los casos en el resto: `molecules/radio-group/`, `molecules/radio/`, `molecules/radio-otro/` y `molecules/segmented-control/`. **El inventario medido es microtarea**: sin número, «todo» no se puede verificar.
- **Tensión con C-10, que pide toggle buttons.** No es contradicción si se lee así: **elegir un valor de una lista → `select`; alternar entre dos estados excluyentes → toggle**. Eso es lo que dice `Q-D8`, y es supuesto, no hecho.

### C-22 · «¿Para qué es esta receta?» opcional

- **Puede estar ya cumplido, y por eso se verifica antes:** `medication-block.html` **355-373**: el campo lleva `[required]="exigeDiagnostico()"` y su comentario dice *«Opcional de verdad: una prescripción sintomática o profiláctica no tiene diagnóstico detrás, y por eso la opción vacía es la primera y la de por omisión»*.
- Lo que hay que ejercitar: **cuándo** `exigeDiagnostico()` da verdadero. Si hay un caso donde lo exige, el pedido dice que ahí también debe ser opcional. Está en `medication-block.ts`. Ambigüedad `Q-D4`.

### C-23 · Rehacer el formulario de internación según norma

- Estado real, y el doctor tiene razón: `src/app/features/clinical-record/patient-chart/admission-block/admission-block.html` tiene **un solo campo**, «Inicio de la internación» (**líneas 62-67**), y su único botón. Nada más.
- Qué guarda hoy el contrato: `POST /clinical/care-episodes` (`clinical.client.ts:164-189`), y la tabla es `clinical.care_episodes`: `patient_profile_id`, `tenant_id`, `responsible_practitioner_id`, `type_concept_id`, `status_concept_id`, `start_at`, `end_at`, más auditoría y `row_version` (`mantra-core-health-api/src/modules/clinical/entities/care_episodes.entity.ts`). **No hay servicio, ni sala, ni cama, ni diagnóstico de ingreso, ni procedencia, ni acompañante.**
- O sea: **la mayor parte de lo que una hoja de admisión normada pide no tiene hoy dónde guardarse.** La corrección es, en partes iguales, investigación normativa y **matriz campo × fuente × soporte del contrato**; lo que el contrato soporta se implementa, y lo que no, se declara como brecha con su propuesta de modelo. Regla 97.1: el esquema tiene **una sola** dirección de cambio y se escribe en la fuente de verdad (`mantra-core-health-model`), nunca con DDL a mano.
- Regla 97.5.4 otra vez: **un campo normativo no se escribe de memoria.** O tiene cita con fuente, referencia y fecha, o se declara `UNKNOWN`.

### C-24 · Panel: colores, reporte semanal y mensual, mapa de calor, canceladas, otras atenciones

- Lo que el panel muestra hoy: `src/app/features/dashboard/dashboard.html` → «Tus accesos» (`panel-accesos`, **81**), «Últimos pacientes» (`panel-ultimos-pacientes`, **117**) y `<app-agenda-de-hoy>` (**67**). **No hay ni un gráfico, ni una serie temporal, ni un mapa de calor.**
- «Canceladas» **ya existe como filtro de la agenda**: `incluirCanceladas()` en `agenda.ts`, atado al query param `canceladas=si`, con su `app-switch` en la plantilla. El panel puede usar el mismo criterio; **no hay que inventar un estado nuevo**.
- «Otras atenciones» **ya tiene su tipología en el contrato**: `ACTIVITY_TYPES = ['APPOINTMENT','PROCEDURE','FOLLOW_UP','TELEHEALTH','OTHER']` (`scheduling-catalog.dto.ts:921`), servida por `GET /scheduling/activity-types` (`scheduling.controller.ts:436`) y ya simulada (`mock/handlers/scheduling.handlers.ts:547`); la agenda ya la recibe como `[tipologias]="tipologias()"`. **Una colonoscopia o una toma de muestra son `PROCEDURE`, no una categoría nueva.** Y el DTO trae `tone` en vez de color, con este comentario: *«el pedido dice “con otros colores”, pero **el color concreto es del sistema de diseño**, no de la API»*. Eso resuelve la mitad de «los colores no coinciden»: **los tonos son semánticos y los resuelve cada pantalla con sus tokens**.
- **Lo que NO existe:** un endpoint de analítica de consultas. El módulo `reporting` de la API es un motor de definiciones de reporte (**todos los verbos son `POST`**: `data-sources`, `definitions`, `executions`, `dashboards`…), no un `GET` de «consultas por semana». El único precedente de analítica servida es de seguros: `GET /insurance/analytics/loss-ratio` (`mock/handlers/insurance-analytics.handlers.ts:115`, con su spec al lado). **Ese es el patrón a seguir si se agrega uno**, y la alternativa sin contrato nuevo es agregar del lado del cliente sobre las reservas que la agenda ya lee. Cuál de las dos se hace es decisión que se declara, con su consecuencia.
- Regla 95.4.6: un mapa de calor **no puede** transmitir su información sólo por color — necesita el número accesible al teclado y al lector de pantalla. Skill `dataviz` y `dashboard-data-ui`.

---

## 2. Choques y hallazgos transversales — leerlos antes de empezar

| ID | Hallazgo | A quién le pega | Regla que manda |
|---|---|---|---|
| **HALL-D1** | La maqueta **no tiene backend**: `mockBackend: true` fijo en la rama. Todo DoD se demuestra contra `src/app/core/mock/`, y un dato nuevo necesita su manejador | Los cinco | Regla 65: el simulador es un **doble declarado**, no el sistema real |
| **HALL-D2** | **El working copy no es la maqueta.** Tres cosas que el doctor describe no existen en `dev` y sí en `origin/mockup` | Los cinco | Regla 30 §4 |
| **HALL-D3** | C-06 revierte una decisión de propietario **escrita en el código** el 2026-09-13 | Itzan (patrón) y los cuatro que aplican | Regla 00 §8: gana el requisito del cliente; el desvío **se registra** |
| **HALL-D4** | «OTROS SERVICIOS» no está en la lista cerrada de 7 motivos del contrato | Pablo, Ender | Regla 00 §1.3 y 96.4.1 |
| **HALL-D5** | El vademécum **declara** que no tiene fuente autoritativa, y no publica ninguna frecuencia | Justin, Ender | Regla 97.5.4 + precedente B-13 |
| **HALL-D6** | ~~El motor de formularios tiene 5 tipos de pregunta y **ninguno es tabla**: la grilla de C-14 no tiene dónde guardarse hoy~~ → **CORREGIDO 2026-09-21**: lo de los 5 tipos es cierto; la conclusión no. La grilla se guarda como **N observaciones con el mismo `encounterId`** — ver la errata en §C-14 | Marcelo | ~~Regla 65~~ → no aplicaba: hay contrato real |
| **HALL-D7** | `care_episodes` no tiene servicio, sala, cama ni diagnóstico de ingreso: la mayor parte de una hoja de admisión normada **no tiene columna** — **CONFIRMADO 2026-09-21** y dimensionado: **10 de 18 campos** sin dónde caer, y en el estándar viven en `Encounter.hospitalization`, no en el episodio. Propuesta de modelo escrita | Marcelo | Regla 97.1 y 97.7 |
| **HALL-D8** | No existe endpoint de analítica de consultas; `reporting` es un motor de definiciones (todo `POST`) | Ender | Regla 00 §1.1 |
| **HALL-D9** | El visitador **no puede** ver información clínica y la visita comercial **no se mezcla** con la agenda clínica (especificación citada en el propio tipo) | Pablo, Ender | Regla 90.1 y 90.2 |
| **HALL-D10** | `pestanas-del-perfil-medico.spec.ts` falla si un campo del alta queda sin pestaña: vaciar «Dónde atiendo» toca ese contrato | Itzan | Regla 80.5.4 (no se debilita el spec) |

## 3. Lo que este documento NO verificó

- **Nada se ejecutó.** Ni `yarn typecheck`, ni `yarn lint`, ni un test, ni la maqueta en un navegador. Peldaño `DISCOVERED`, no `RUNS` ni `TESTED`.
- **No se abrió la maqueta desplegada.** Todo lo que dice «el doctor ve X» es inferencia de la rama, no observación de la URL. Quien reciba cada prompt **tiene que mirar la pantalla** antes de tocarla; ahí es donde `Q-D4` (C-18 y C-22 posiblemente ya cumplidos) se cierra.
- **No se midió cuántas de las 24 están ya hechas.** Este documento localiza; no dictamina.
- **No se revisó el turno día** ni ningún worktree `mch-*`.
- **No se leyó el histórico completo de `origin/mockup`**: sólo el corte. Si una corrección ya se intentó antes y se revirtió, este documento no lo sabe.
