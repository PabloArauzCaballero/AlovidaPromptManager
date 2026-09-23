# Daily de equipo — noche del 2026-09-22

> **REPARTIDO: 5 / 5 carriles · 19 / 19 observaciones con dueño · 32 hitos · 64 subtareas · 319 microtareas.**
> **AVANCE DEL TURNO: 65 / 319 — 20,4 %.** ← se llena al cerrar, con `microtareas HECHO / total`.
> Pablo 45/68 · Itzan 0/93 · Justin 20/51 · Ender 0/48 · Marcelo 0/59.
> **`A MEDIAS` cuenta como no hecha. `DESCARTADO` no suma: se declara aparte con su motivo.**

> **Estado:** `REPARTIDO` al 2026-09-22. Este documento se escribió **al repartir, antes del turno**;
> las secciones «PUBLICADO» y la tabla de cierre se llenan con lo que cada carril ejecute.

- **Turno:** noche · **Fecha:** 2026-09-22 · **Paquete fuente:** las **19 observaciones** del doctor y del paciente
- **Fuente del pedido (verbatim, con procedencia):** [`CORRECCIONES-DOCTOR-Y-PACIENTE-2026-09-22.md`](../../../docs/requisitos/CORRECCIONES-DOCTOR-Y-PACIENTE-2026-09-22.md)
- **Verificación contra el código real:** [`VERIFICACION-CONTRA-CODIGO-2026-09-22.md`](../../../docs/verificacion/VERIFICACION-CONTRA-CODIGO-2026-09-22.md)
- **Plan maestro (orden, dependencias, kill-tests):** [`PLAN-MAESTRO.md`](../../../docs/trabajo/2026-09-22-plan-y-reparto-correcciones-doctor-y-paciente/PLAN-MAESTRO.md)
- **Repo de destino:** `alovida/mantra-core-health` · Ref: `origin/mockup` ·
  **Corte: `b655e8449abd662d6b24156fd6e2b06aeb120cc1`** (2026-09-22T18:04-04, PR #570)
- Peldaño de evidencia del reparto: **`DISCOVERED`** (regla 30). Se leyó el árbol de git; **no se ejecutó nada**.

## 0. Los cuatro hechos que ordenan toda la noche

1. **La maqueta que el doctor mira no tiene backend.** `mockBackend: true` fijo en `src/environments/environment.ts`.
   Todo DoD se demuestra contra `src/app/core/mock/**`, que esta noche está **repartido por archivo** (§5). Un
   dato nuevo necesita su manejador, escrito como **doble declarado** (regla 65). Y hay un hueco que ya está
   escrito en el propio cliente: **editar título/especialidad/matrícula y retirar especialidad/matrícula existen
   sólo en el simulador** (`profiles.client.ts:775-786`, HALL-E3). Lo que se cierre ahí se cierra `VERIFIED`
   **contra el doble** y con la brecha declarada para `dev`.
2. **El corte es `origin/mockup` @ `b655e844…`, no el working copy.** Se movió dos veces hoy (#573 de Justin,
   #570 de Pablo). Cada persona **reconsulta y declara** su corte en la primera microtarea.
3. **Dos pedidos del doctor son guías de trabajo «a partir de ahora»**: D-04 (todo formulario que nace de una
   acción de tabla va en modal) y D-08 (la disciplina de tabla con acciones). Se convierten en **ADR-0015**
   (Pablo, H2) y en piezas reales; esta noche se aplican donde el doctor lo pidió y el resto queda inventariado.
4. **Varias observaciones vuelven sobre lo que ya se hizo** (C-05, C-06, C-09, C-21 del 20/09). Lo que ya
   está se cita y se reusa —ADR-0012, `row-actions`, la insignia, el modal de editar—; lo que el doctor pide
   distinto se hace como desvío declarado con las dos fechas.

## 1. Quién tiene qué

| Persona | Encargo | Observaciones | Hitos | Subtareas | Microtareas | Estado |
|---|---|---|---:|---:|---:|---|
| **Pablo** | [La disciplina de tabla como ADR, tres piezas, y «Dónde atiendo» que la cumple entera](Pablo/Noche-DisciplinaDeTablas.PatronYDondeAtiendo/TablaConAccionesModalConfirmacionYPaginacionEnCliente.md) | D-04, D-05 (patrón), D-06 (aplicación), D-08 (patrón), D-09 (historial) | 6 | 13 | 68 | `TODO` |
| **Itzan** | [El perfil sin «principal», sin datos del trabajo, y tres tablas con modal, adjunto, buscador y paginación](Itzan/Noche-PerfilMedico.ConfigurarTuPerfil/PerfilSinPrincipalSinTrabajoYTablasConModal.md) | D-01, D-02, D-03, D-06 (patrón), D-07, D-08 (aplicación), D-09, D-10, N-03 | 8 | 18 | 93 | `TODO` |
| **Justin** | [Clic único en el directorio, y las cotizaciones del paciente por precio y cercanía](Justin/Noche-ReservaYCotizaciones.DirectorioYPrecios/ClicUnicoEnElDirectorioYCotizacionesPorPrecioYCercania.md) | R-01, R-02 (UI), N-02 | 6 | 10 | 51 | `TODO` |
| **Ender** | [Latencia decidida, agendas para todos, y Chats y Tutoriales en la cabecera](Ender/Noche-SimuladorYCabecera.MockNavegacion/LatenciaAgendasParaTodosYChatsYTutorialesEnLaCabecera.md) | R-02 (latencia), R-03, N-01, D-05 (cabecera), N-02/N-03 (menú) | 6 | 11 | 48 | `TODO` |
| **Marcelo** | [La silueta, el panel para escribir o dictar, y el modal de confirmación de la casa](Marcelo/Noche-InicioPaciente.SintomasYConfirmacion/SiluetaDelCuerpoVozYModalDeConfirmacion.md) | P-01, P-02, P-03, D-08 (confirmación) | 6 | 12 | 59 | `TODO` |
| | | **19 de 19 cubiertas** | **32** | **64** | **319** | |

> ⚠️ **Esto es más de lo que entra en una noche, y está dicho a propósito.** Cada prompt dice en qué orden
> ir y qué vale más si hay que elegir. **Lo que no se cierre va `A MEDIAS`** con qué anda, qué no anda y qué
> falta exactamente. **Recortar alcance es decisión de coordinación, y se registra.**

## 2. Cobertura de las 19 — el kill-test del reparto

Una fila sin persona o sin hito significa que esa observación **no está repartida**.

| ID | En una línea | Persona | Hito |
|---|---|---|---|
| D-01 | Sin especialidad «principal»: todas por igual | Itzan | H2.S2 |
| D-02 | Quitar «Estado de la práctica» | Itzan | H2.S1 |
| D-03 | «Contacto» sin datos del trabajo | Itzan | H2.S3 |
| D-04 | Formularios de acción de tabla en modal — guía de trabajo | **Pablo (ADR)** + Itzan H3.S1/H4 + Pablo H4.S2 | Pablo H2 |
| D-05 | Cada botón con ícono + nombre | **Pablo (inventario y veredictos)** + los cinco en lo suyo | Pablo H5 · Itzan H6 · Ender H5 · Justin H5.S2 · Marcelo H4.S2/H5.S2 |
| D-06 | Tocar el mapa vacía la dirección | **Itzan (patrón)** + Pablo (Dónde atiendo) | Itzan H5 · Pablo H4.S2.M6 |
| D-07 | Quitar «Listo, guardamos…» | Itzan | H5.S3 |
| D-08 | La disciplina de tabla con acciones | **Pablo (patrón)** + **Marcelo (confirmación)** + Itzan (perfil) | Pablo H2-H4 · Marcelo H4 · Itzan H3.S2/H4 |
| D-09 | Trayectoria como tabla con adjunto; lugares donde trabajé | Itzan (formación) + Pablo (historial) | Itzan H3 · Pablo H4.S3 |
| D-10 | Credenciales igual | Itzan | H4 |
| R-01 | El clic no se inhabilita mientras carga | Justin | H2.S1 |
| R-02 | Elegir médico tarda demasiado | Ender (latencia) + Justin (peticiones) | Ender H2 · Justin H2.S2 |
| R-03 | Doctores con horarios para flujos completos | Ender | H3 |
| P-01 | Silueta cliqueable que recomienda especialista | Marcelo | H2 |
| P-02 | Panel de texto, tipeado o por voz | Marcelo | H3.S1, H3.S2 |
| P-03 | Quitar el panel de abajo | Marcelo | H3.S3 |
| N-01 | Tutoriales y Chats a la cabecera | Ender | H4.S1 |
| N-02 | Cotizaciones del paciente por precio y cercanía | Justin + Ender (menú) | Justin H3, H4 · Ender H4.S2.M1 |
| N-03 | Mis puntos como pestaña del paciente | Itzan + Ender (menú y redirect) | Itzan H7 · Ender H4.S2.M2 |

## 3. Lo primero, para todos

Antes de la primera microtarea: instalar el estándar (sección 1 del encargo) y **pegar la salida de
los tres comandos** en el daily personal. Un turno que arranca sin eso arranca en `BLOQUEADO`.

```bash
ls .claude/skills | wc -l            # -> 176
ls .claude/rules/[0-9]*.md | wc -l   # -> 14  (mas el README, que no es una regla)
python .claude/hooks/plan_gate.py --self-test    # -> 11 PASS, 0 FAIL
```

Y los comandos reales de esta rama:

```bash
yarn install && yarn start            # http://localhost:4200, sin .env, sin proxy, sin base
yarn typecheck                        # tsc app + cypress + playwright
yarn lint
npx ng test --include=<spec> --watch=false
npx ng test --include=src/app/core/mock/mock-backend.spec.ts --watch=false   # el simulador entero
E2E_BASE_URL=http://localhost:4200 npx playwright test playwright/mockup-barrido.spec.ts --workers=1
E2E_BASE_URL=http://localhost:4200 npx playwright test playwright/mockup-click-sweep.spec.ts --workers=1
```

**Cuentas de la maqueta** (cualquier contraseña no vacía): `medica@alovida.mock`, `paciente@alovida.mock`,
`admin@alovida.mock`, `superadmin@alovida.mock`, `visitador@alovida.mock`. Son **sintéticas declaradas**.
**Ningún dato real de paciente, nunca** (regla 90.2). Lo que se dicta en P-02 son síntomas: PHI.

**Regla 70:** un `yarn start`, un build, un navegador, Playwright con `--workers=1`. Nada en background que no cierres vos.

## 4. Orden de dependencia — quién espera a quién

```
Pablo  ──(ADR-0015 + `app-pagination` con selects + `filter-bar` con acción)──▶ Itzan aplica en sus 3 tablas
Pablo  ──(layout `tabla` del historial laboral en `work-history`)─────────────▶ Itzan lo monta en Trayectoria
Marcelo ──(`confirmarCambios` / `confirmarDescarte` + prueba de apilamiento)──▶ Pablo e Itzan en cada «Guardar»
Itzan  ──(`output` del `ubicacion-picker` al tocar el mapa)────────────────────▶ (Pablo no lo necesita: usa `app-map` directo)
Ender  ──(latencia por ruta + agendas para todos)──────────────────────────────▶ Justin mide «después»
Ender  ──(renglones del menú: Cotizaciones, Mis puntos; ruta y redirect)───────▶ Justin (N-02) e Itzan (N-03)
Justin ──(la medición de peticiones del flujo de reserva)──────────────────────▶ Ender decide la latencia con números
```

| Quien espera | De quién | Qué exactamente | Qué hace mientras tanto |
|---|---|---|---|
| Itzan (H3, H4) | Pablo (H2, H3) | ADR-0015; `app-pagination` con select de página y texto; `filter-bar` con hueco para «Añadir» | Monta las piezas **tal como están hoy**, alinea el botón con su CSS, y declara contra qué cerró |
| Itzan (H3.S3) | Pablo (H4.S3) | `app-work-history secciones="historial" layout="tabla"` | Monta la línea de tiempo existente y lo declara |
| Pablo e Itzan | Marcelo (H4) | `confirmarCambios()` y la receta de descarte | Llaman a `dialogs.confirm({...})` con los textos del ADR y lo declaran |
| Justin (H2.S2) | Ender (H2) | La latencia nueva por ruta | Mide con la actual; repite la medición al mergear |
| Justin (H2.S2.M1) | Ender | Si `GET /scheduling/slots` admite filtro por profesional | Lee el manejador; si no admite, paralelo por sede y pedido escrito |
| Justin (H3), Itzan (H7) | Ender (H4.S2) | Renglón «Cotizaciones» (PATIENT); retiro de «Mis puntos» + redirect | Prueban por URL directa y lo declaran |
| Ender (H2) | Justin (H1.S2) | Cuántas peticiones y cuánto tarda «elegir médico» | Mide él mismo y lo anota como medición propia |
| Marcelo (H3.S3) | Doctor / Pablo | Cuál es «el panel de abajo» (Q-13) | Prepara el retiro en rama y lo deja `A MEDIAS` con captura; **no borra a ciegas** |
| Los cinco | Marcelo (H4.S1.M6) | Que un `confirm` apila bien sobre un `content-dialog` | Cada uno lo prueba en su primer modal y lo anota |

**Nadie se queda esperando.** La regla 65 es obligatoria: si el insumo del otro no llegó y su contrato se
puede nombrar, se simula en **tres niveles** —correcto, límite e inválido—, se cierra la microtarea contra el
doble y **se declara**. `BLOQUEADO` sin simulación previa no es un cierre válido y el `blocker_gate.py` lo frena.

**Si dos personas miden lo mismo y les da distinto, eso es un hallazgo, no un empate a resolver charlando.**
Gana el archivo abierto, y la diferencia se registra.

## 4-bis. PUBLICADO — se llena durante el turno

> **Coordinación (2026-09-23 00:2x): Pablo ejecuta el carril de Marcelo** (`Noche-InicioPaciente.SintomasYConfirmacion`) en la rama
> `pablo/inicio-paciente-silueta-voz-y-confirmacion`. Marcelo **no** lo toma en paralelo: los archivos reservados a ese carril los escribe Pablo esta noche.

Cada carril anuncia acá lo que otros consumen, con ruta y ejemplo. Vacío al repartir.

| Qué | Quién | Cuándo se espera | Ruta / ejemplo | Estado |
|---|---|---|---|---|
| ADR-0015 «tabla con acciones» (siete reglas + paginación + scroll) | Pablo, H2.S1 | primera mitad | `docs/adr/ADR-0015-tabla-con-acciones.md`, indexado en `docs/adr/index.md`. Rama `pablo/noche-disciplina-tablas-2026-09-22`, corte propio `origin/mockup@8ae7283a` (reconsultado — el `b655e844…` del reparto ya tiene 6 PR más encima, ninguno toca mis archivos reservados). Las 7 reglas + la regla madre D-04, con pieza y motivo cada una; decisión de paginación (cliente `app-pagination` vs. cursor de `data-table`, según sea local o remoto) y de scroll (conserva el motivo del 18/09, `sticky:'end'` queda sin efecto una vez que no hay scroll lateral). **Hallazgo para Marcelo:** medí `dialogs.confirm(` de nuevo sobre mi corte y son **40 sitios reales, no 26** — ninguno confirma un guardado hoy; el inventario completo está en `evidencia/antes/confirmaciones.md`. **Vi tu fila de abajo (`confirmarCambios` PUBLICADO, spec 26/26) en tu rama `pablo/inicio-paciente-silueta-voz-y-confirmacion` — todavía no está en `origin/mockup`, así que en mi rama sigo llamando a `dialogs.confirm()` genérico hasta que se mergee** (regla 65, declarado en mi `PLAN.md`) | **PUBLICADO** |
| `app-pagination` con Anterior/Siguiente con texto y select de página | Pablo, H3.S1 | primera mitad | `src/app/shared/components/molecules/pagination/**`. Quita `iconOnly` de Anterior/Siguiente (ahora con texto), agrega `app-select` para saltar de página (`[showPageJump]`, por omisión `true`) junto al de tamaño ya existente. Uso: sin cambios de marcado para los 3 consumidores actuales (`glossary`, `fact-section`, `design-system-sample`) — el select nuevo aparece solo. Spec 30/30 (`pagination-spec.txt`). **Hallazgo propio, corregido en la misma microtarea:** el texto + el select nuevo desbordaban `.pagination__nav` a 375 px (sin `flex-wrap`); se agregó `flex-wrap: wrap` a `.pagination__nav` y `.pagination__pages`. Medido antes (`scrollWidth` 495 > `clientWidth` 375) y después (360=360) en `/glossary`, capturas en `evidencia/h3/capturas/` | **PUBLICADO** (spec 30/30, 3 consumidores comprobados) |
| `filter-bar` con proyección `[filter-bar-action]` | Pablo, H3.S3 | primera mitad | `organisms/filter-bar/**`. Proyección `[filter-bar-action]` al final de `.filter-bar__controls`, `:empty{display:none}` para los 8 consumidores que no proyectan nada. Receta de buscador multicampo en el comentario de cabecera. Spec 13/13. **Verificada en un consumidor real** («Dónde atiendo», H4.S1): el botón «Agregar mi consultorio propio» queda a la derecha en 1440 y debajo en 375 | **PUBLICADO** |
| `data-table` con alto máximo y sin scroll lateral (opt-in) | Pablo, H3.S2 | | `organisms/data-table/**`. Input `maxHeight: string \| null`, por omisión `null`. Activo: `overflow-x:hidden` + clase `.data-table--constrained` que mantiene las columnas secundarias plegadas al detalle aunque el viewport sea de escritorio. `sticky:'end'` documentado como sin efecto en ese modo, sin retirarse. Spec 31/31. **Hallazgo real, no oculto**: con sólo columnas de prioridad 1 ya el contenido puede no entrar a 375 px (queda oculto, no hay scroll) — ver mi daily y el `REPORTE.md` | **PUBLICADO** |
| `work-history` con `layout="tabla"` para el historial | Pablo, H4.S3 | segunda mitad | No llegué — sigue `TODO` | `TODO` |
| Inventario de los 78 `iconOnly` con veredicto | Pablo, H5 | | | `TODO` |
| `confirmarCambios()` / `confirmarDescarte()` + receta + apilamiento probado | **Pablo, ejecutando el carril de Marcelo**, H4 | **temprano** | `src/app/shared/components/molecules/dialog/dialog-service.ts` (rama `pablo/inicio-paciente-silueta-voz-y-confirmacion`). Uso: `if (!(await this.dialogs.confirmarCambios())) return;` en cada «Guardar»; `confirmarDescarte()` en `(dismissAttempt)`. Textos por omisión en `CONFIRMAR_CAMBIOS` / `CONFIRMAR_DESCARTE` (`dialog.types.ts`), se sobreescriben con `Partial<DialogConfig>`. `confirm()` no cambió. **Apilamiento sobre un `content-dialog` abierto: PASS en Chromium 151 y Firefox 153** (dos `<dialog>`, foco en «Confirmar», el de abajo inalcanzable, `Escape` → `false`, foco de vuelta) — `Marcelo/Noche-InicioPaciente.SintomasYConfirmacion/evidencia/h4/apilamiento/` | **PUBLICADO** (spec 26/26) |
| Captura anotada de la pantalla de inicio: ¿cuál es «el panel de abajo»? (Q-13) | Pablo (carril de Marcelo), H1.S2.M3 | temprano | `…/evidencia/antes/bloques.md` + `capturas/01-dashboard-1440-claro.png`. **Respuesta de Pablo: la grilla «Ir a lo tuyo» (bloque 4).** | **RESUELTA** |
| Borrador de la silueta para el doctor | **Pablo (carril de Marcelo)**, H2.S2.M5 | — | `Marcelo/Noche-InicioPaciente.SintomasYConfirmacion/evidencia/h2/capturas/` (01-06 por viewport y tema, 07 pecho elegido, 08 escala de grises, 09 teclado; `LEEME.md` dice qué se ve en cada una). Organismo `organisms/body-map` (molde `department-map`), montado en `symptom-check` arriba de las pastillas; las pastillas siguen. **Para el doctor (Q-11), tres preguntas con la captura en mano:** (1) ¿figura neutra y frontal alcanza, o hace falta vista de espalda para «espalda»? (hoy espalda vive en «Huesos y músculos», que son brazos + piernas); (2) ¿«piel», «ánimo» y «general» quedan sólo como pastillas, como ahora, o se quiere una forma para «piel» (toda la figura)?; (3) a 375 px la figura ocupa la primera pantalla de la tarjeta (196×431 px): ¿está bien que sea lo primero que se ve, o va más chica? | **PUBLICADO** (spec 13/13 + 5/5 en `symptom-check`; sin respuesta del doctor todavía) |
| **HALL-M5 — `shell-layout.spec.ts` en rojo tras tu merge de cotizaciones** | Justin, H4/H5 | — | `b3af9887` agregó `/my-account/cotizaciones` al menú del paciente; `shell-layout.spec.ts:147` (lista exacta de rutas) y `:449` (agrupación) no se actualizaron. Reproducido en aislamiento, 2/2 rojo, ya está así en `origin/mockup`. No lo corregí (fuera de mi reserva): lo arregla quien tenga `shell-layout.spec.ts` esta noche o Justin en su cierre. | **RESUELTO por Ender** — los dos rojos (`:147`, `:449`) corregidos con motivo (N-02, cotizaciones ya existente de Justin), no debilitados. `shell-layout.spec.ts` completo: 55/55 PASS (rama `ender/simulador-cabecera-2026-09-22`) |
| **HALL-M6 — `mockup-click-sweep` rota para Médica en ~10 rutas ajenas al reparto** | Pablo (coordinador), a triar | — | 67-85 botones sin responder en 4s en `/messaging`, `/groups`, `/glossary`, `/settings`, `/notification-center`, `/administration/pharmacy-*`, `/my-account/edit`, `/my-account/identity`, `/my-account/access-requests`. Ya estaba así en `origin/mockup` antes del rebase de esta noche (no lo causó ningún carril de hoy); Paciente y Visitador pasan limpio. Lista completa en `Marcelo/…/evidencia/h5/mockup-click-sweep-tras-rebase.txt`. No tiene dueño obvio esta noche: lo triage quien coordine. | **A TRIAR** |
| **HALL-M4 — el micrófono está bloqueado por la propia app** | Pablo (carril de Marcelo), H3.S2 | — | `src/server/security-headers.ts:268` manda `Permissions-Policy: camera=(), microphone=(), geolocation=(self)`: ningún documento puede capturar audio, conceda o no la persona (Chrome: «AudioCapture permission has been blocked because of a permissions policy»). Afecta al dictado nuevo **y al `Grabador` de notas de voz de mensajería que ya existía**. **Decisión de Pablo 2026-09-23: `microphone=(self)` en este carril (H3.S2.M9), cámara sigue cerrada.** **Hecho en la rama `pablo/inicio-paciente-silueta-voz-y-confirmacion`: `microphone=(self)`, spec 25/25, `docs/security/*` al día; verificado en Chrome (sin warning, escucha y transcribe).** Quien toque `src/server/security-headers.ts` esta noche: partir de esa rama. | **PUBLICADO + RESUELTO** |
| Medición del flujo de reserva (peticiones, tiempos) | Justin, H1.S2 | **temprano** | No publicada: ver Justin §9; faltan baseline y recorrido | `A MEDIAS` |
| Tabla de latencia por prefijo | Ender, H2.S1 | primera mitad | `mock-backend.interceptor.ts:250-284`. `/terminology` y `/scheduling/slots` en **40 ms** (el mínimo elegido, Q-E1 — sigue viéndose el estado de carga); `/profiles` en **90 ms**; subida de documentos sin cambios en **600 ms**; el resto en **120 ms**. Sin `Math.random` (`git grep -c Math.random` → 0). Medida real de 10 respuestas: `evidencia/antes/latencia.md` en mi `docs/trabajo/`. Spec de determinismo (5/5 PASS): `mock-backend-latencia.spec.ts` | **PUBLICADO** |
| Renglón «Cotizaciones» PATIENT + ruta · retiro «Mis puntos» + redirect | Ender, H4.S2 | a pedido | «Cotizaciones»: **ya estaba** en `origin/mockup` (Justin, `navigation.map.ts:1210`, `app.routes.ts:205`) — verificado contra código, no recreado; sólo faltaba el spec (ver HALL-M5 arriba). «Mis puntos»: renglón retirado (`fueraDelMenuPara: [ANY_ROLE]`), `/my-account/loyalty` redirige a `/my-account` (`SECCIONES_REDIRIGIDAS` en `app.routes.ts`) — **la pestaña propia de Itzan no llegó esta noche: contrato simulado, regla 65.** Apareció y se corrigió un error real de Angular al conectar el redirect con el guard de rol (`NG04014`) | **PUBLICADO** (regla 65: N-03 sigue esperando la pestaña de Itzan) |
| `output` del `ubicacion-picker` al tocar el mapa | Itzan, H5.S1 | | | `TODO` |

## 5. Reservas de archivos — para que nadie se pise

Rutas relativas a `mantra-core-health/`, sobre la rama `mockup`. Las reservas del 2026-09-21 que siguen
vivas se respetan: lo de acá se suma **sin intersección** (medido: `evidencia/reserva-disjunta.txt` del
trabajo de reparto).

| Ruta reservada | Para quién |
|---|---|
| `src/app/features/account/my-profile/**` **menos** `work-history/**` · `src/app/features/account/loyalty/**` · `src/app/features/auth/registro-compartido/ubicacion-picker/**` · `src/app/features/auth/register-*/**` · `src/app/shared/components/organisms/{specialty-badge,specialty-badge-grid}/**` · `organisms/{paginated-form,date-picker}/**` y `atoms/back-link/**` (sólo D-05) · `src/app/core/mock/handlers/{profiles,files}.handlers.ts` | **Itzan** |
| `src/app/shared/components/organisms/{data-table,filter-bar}/**` · `src/app/shared/components/molecules/{pagination,row-actions}/**` · `src/app/features/account/my-profile/work-history/**` · `docs/adr/ADR-0015-*.md`, `docs/adr/index.md`, `docs/adr/CONTRATO-data-table.md` | **Pablo** |
| `src/app/features/directory/**` · `src/app/features/nearby-places/**` · `src/app/features/account/medical-record/where-to-buy/**` · `src/app/features/laboratory-directory/**` · `src/app/features/public-directories/**` · `src/app/features/account/cotizaciones/**` (nuevo) · `src/app/shared/components/molecules/search-result/**` · `src/app/core/data-access/{public-directory,pharmacy,diagnostic-units}/**` · `src/app/core/mock/handlers/{directory,public,pharmacy,diagnostics}.handlers.ts` | **Justin** |
| `src/app/core/mock/mock-backend.interceptor.ts` · `src/app/core/mock/fixtures/{agenda,personas,registered-people}.ts` · `src/app/core/mock/handlers/scheduling.handlers.ts` · `src/app/core/mock/README.md` · `src/app/core/navigation/**` · `src/app/features/shell-layout/**` · `src/app/shared/components/organisms/{header,notification-bell}/**` · `src/app/app.routes.ts` (**archivo de coordinación: sólo Ender escribe**) · los tres barrels | **Ender** |
| `src/app/features/symptom-check/**` (sin editar `sintomas.datos.ts` ni `motor.ts`) · `src/app/features/dashboard/patient-home/**` · `src/app/shared/components/organisms/body-map/**` (nuevo) · `src/app/shared/components/organisms/content-dialog/**` · `src/app/shared/components/molecules/dialog/**` | **Marcelo** |
| `mantra-core-health-api/**` · `mantra-core-health-model/**` | **NADIE esta noche.** Se leen y se citan; **no se escriben** |

**Dos personas escribiendo el mismo archivo es un defecto del reparto, no un accidente.** Quien necesite
un cambio en la ruta de otro **lo pide por el daily y no lo escribe**. Un cambio acordado se anota en los dos
dailies, con quién lo escribió.

**Los carriles del 21/09** de Itzan (`Refactor-FormulariosYPerfil`), Ender (`Refactor-CatalogoEInventario`)
y Marcelo (`Refactor-DialogosYAdjuntos`) siguen siendo suyos y **no se abandonan**: esta noche manda el pedido
del cliente, y aquéllos quedan `A MEDIAS` declarados en su propio reporte (regla 70.1.1).

## 6. Ambigüedades abiertas — se arrastran, no se resuelven

Las 20 están con supuesto y dueño en el documento fuente. Las que **bloquean cierre** (no arranque):

| ID | Qué | Quién la cierra | Estado |
|---|---|---|---|
| Q-1 | D-01: ¿la noción «principal» sale también del alta y del contrato? | Doctor + Pablo | `ABIERTA` — UI y alta sí; contrato no se toca |
| Q-3 | D-03: ¿sólo lo del trabajo, o toda la pestaña? ¿Dónde queda el correo de acceso? | Doctor | `ABIERTA` — lo del trabajo; correo de acceso en Datos personales |
| Q-4 | D-06: «ponerse en blanco» = ¿vaciar? | Doctor | `ABIERTA` — se vacía, con anuncio |
| Q-5 | D-08: paginación con números/selects vs. cursor del organismo | Pablo + doctor | `ABIERTA` — cliente para listas locales; cursor donde la API manda |
| Q-6 | D-08: sin scroll X vs. decisión del propietario del 18/09 | Propietario + doctor | `ABIERTA` — gana el pedido nuevo, con las dos fechas |
| Q-9 | D-10: adjunto en especialidades sin `file_id` en el contrato | Pablo + doctor | `ABIERTA` — vincular a título, o doble declarado |
| Q-13 | P-03: ¿cuál es «el panel de abajo»? | **Doctor** | `ABIERTA` — **no se borra sin confirmación** |
| Q-15 | N-02: ¿Cotizaciones del paciente (nueva) o la del médico? | Doctor + Pablo | `ABIERTA` — nueva, componiendo lo existente |
| **Q-16** | **N-02: precios de servicios médicos, imagenología y análisis sin procedencia** | **Negocio, con fuente** | `DECISION_REQUIRED` — «no publicado»; **nada se inventa** |
| **Q-M1** | **P-02: el reconocedor del navegador manda audio (PHI) al proveedor del navegador** | **Negocio + Pablo** | `DECISION_REQUIRED` — se declara en pantalla; ningún otro servicio |
| Q-18 | D-04/D-08: ¿a las 30 tablas esta noche? | Pablo | `ABIERTA` — a las 4 pedidas; el resto inventariado |

## 7. Hallazgos que afectan a todo el equipo (de la verificación contra el código)

| ID | Qué | A quién le pega |
|---|---|---|
| **HALL-E1** | La maqueta no tiene backend; `core/mock/**` está repartido por archivo esta noche | Los cinco |
| **HALL-E2** | El working copy no es la maqueta; `origin/mockup` se movió dos veces hoy | Los cinco |
| **HALL-E3** | Sólo `POST`/`DELETE` de credenciales existen en la API real; editar y retirar lo demás vive en el simulador | Itzan, Pablo |
| **HALL-E4** | `DataTable` pagina por cursor por decisión documentada; D-08 se resuelve con `app-pagination` en cliente | Pablo, Itzan |
| **HALL-E5** | `sticky: 'end'` y el scroll lateral son decisión del 18/09; el ADR conserva las dos fechas | Pablo |
| **HALL-E6** | `pestanas-del-perfil-medico.spec.ts` falla si un campo del alta queda sin pestaña; el mecanismo existe | Itzan |
| **HALL-E7** | `practitioner_specialties` no tiene `file_id`; tiene `supporting_credential_id` | Itzan |
| **HALL-E8** | Latencia 120–300 ms aleatoria por petición; se mide antes de tocar | Ender, Justin |
| **HALL-E9** | Los 13 profesionales registrados no reciben recurso ni agenda | Ender |
| **HALL-E10** | «Cotizaciones» existente es del médico; lo pedido es del paciente y tiene equivalentes | Justin, Ender |
| **HALL-E11** | Sin precios con procedencia fuera de farmacias | Justin |
| **HALL-E12** | `navigation.service.spec.ts` fija la lista cerrada del menú por nombre | Ender |
| **HALL-E13** | «Listo, guardamos…» lleva `appAnuncio` y `data-testid` de specs/E2E | Itzan |
| **HALL-E14** | Voz: sólo navegador; PHI | Marcelo |
| **HALL-E15** | El set de íconos es cerrado; no se amplía «de paso» | Los cinco |
| **HALL-E16** | **39 de 78 `iconOnly` no tienen dueño esta noche** — declarado | Coordinación |
| **HALL-E17** | Los carriles del 21/09 de tres personas siguen abiertos | Coordinación |

## 8. Cierre del turno — completar acá

| Persona | HECHO / total | Hitos cerrados | `A MEDIAS` | `BLOQUEADO` | Su daily |
|---|---|---|---|---|---|
| Pablo | 45 / 68 | 3 / 6 | H4.S2.M9 (teclado del modal, sin verificar; resto de H4.S2 HECHO) | ninguno | [Pablo-Daily-Noche-2026-09-22.md](Pablo/Pablo-Daily-Noche-2026-09-22.md) |
| Itzan | __ / 93 | __ / 8 | | | [Itzan-Daily-Noche-2026-09-22.md](Itzan/Itzan-Daily-Noche-2026-09-22.md) |
| Justin | 29 / 51 | 0 / 6 | 20 HECHO legados + 9 HECHO no solapados, publicados en #583: capturas por viewport/tema, teclado, gates locales, clic único y acción visible de disponibilidad. Las 6 de documentos son `DESCARTADO` por la decisión «Cotizaciones solamente». La verificación remota contra el doble también está cerrada: Coolify desplegó `fc8adc4` con `Success`, posterior a `5dc38c9` (#583), y el E2E público de Cotizaciones pasó `1/1`. Gates focales posteriores: typecheck/build, lint de los 7 TypeScript y 2 plantillas del diff, 7 archivos/73 tests y E2E 2/2 verdes. | Baseline histórico y contratos de negocio quedan `A MEDIAS` o `DECISION_REQUIRED`. Lint global (243) y suite total (4 fallos) son deuda fuera del diff de #583: seguimiento, no bloqueo. Detalle: [cierre remoto](../../../docs/trabajo/2026-09-23-cerrar-validacion-remota-cotizaciones/REPORTE.md) y [gates locales](../../../docs/trabajo/2026-09-23-publicar-gates-reserva-cotizaciones/REPORTE.md). | [Justin-Daily-Noche-2026-09-22.md](Justin/Justin-Daily-Noche-2026-09-22.md) |
| Ender | 14 / 48 | 1 / 6 | H2 (H2.S1 5/5; H2.S2 sin empezar). Latencia determinista y medida: «elegir médico» 311–557 → 231–247 ms en arnés. Cambios locales, sin commit en producto | H3 y H4 sin autorizar todavía; H3 con decisiones de alcance tomadas (los 13 registrados, `comunidad.ts` fuera) | [Ender-Daily-Noche-2026-09-22.md](Ender/Ender-Daily-Noche-2026-09-22.md) |
| Marcelo | __ / 59 | __ / 6 | | | [Marcelo-Daily-Noche-2026-09-22.md](Marcelo/Marcelo-Daily-Noche-2026-09-22.md) |
| **Total** | **__ / 319** | **__ / 32** | | | |

### Qué NO se puede escribir en este documento

- Un `PASS` sin comando y exit code pegados.
- «Listo», «funciona» o «implementado» sobre algo que no se ejecutó.
- Un porcentaje que no salga de `HECHO / total`.
- Un `BLOQUEADO` sin los tres niveles del contrato simulados (regla 65).
- Un `VERIFIED` sobre algo que sólo persiste el simulador sin decir «contra el doble».
- Un precio sin procedencia.
- Datos de pacientes reales en cualquier salida pegada.
