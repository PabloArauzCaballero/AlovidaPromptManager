# El simulador que responde a tiempo, agendas para todos los médicos, y Chats y Tutoriales en la cabecera

> **Rol:** dueño del simulador (interceptor, fixtures de agenda y personas, manejador de agenda), de la navegación (`core/navigation`, `shell-layout`, `header`) y de `app.routes.ts` · **Línea:** D · **Fecha:** 2026-09-22 · **Turno:** noche
> **Fuente del pedido:** [`CORRECCIONES-DOCTOR-Y-PACIENTE-2026-09-22.md`](../../../../../docs/requisitos/CORRECCIONES-DOCTOR-Y-PACIENTE-2026-09-22.md) — **R-02, R-03, N-01, D-05 (cabecera), y los cambios de menú que N-02 y N-03 te piden**
> **Verificación contra el código:** [`VERIFICACION-CONTRA-CODIGO-2026-09-22.md`](../../../../../docs/verificacion/VERIFICACION-CONTRA-CODIGO-2026-09-22.md) — §1, §2 (R-02, R-03, N-01, N-02, N-03), §3, §4 (HALL-E8, E9, E12, E15)
> **Plan maestro:** [`PLAN-MAESTRO.md`](../../../../../docs/trabajo/2026-09-22-plan-y-reparto-correcciones-doctor-y-paciente/PLAN-MAESTRO.md) — Justin te da la **medición** de R-02; vos le das la latencia; Itzan y Justin te piden dos renglones del menú
> **6 hitos · 11 subtareas · 48 microtareas**, todas con criterio de aceptación y Definition of Done.
>
> **Tu carril es el que hace que la maqueta se sienta como un producto.** El doctor dice «tarda
> demasiado y eso que solo es mock»: tiene razón, y la causa está escrita en tu interceptor —120 a 300 ms
> **aleatorios por petición**, «para que los estados de carga existan»—. Los estados de carga tienen que
> seguir existiendo; lo que no puede seguir es que elegir un médico dispare varias peticiones en serie con
> ese costo cada una. Y los 13 médicos registrados no tienen agenda: aparecen en el directorio y dicen «no
> tiene turnos». Eso también es tuyo.

## 0. Ficha de asignación

| Campo | Valor |
|---|---|
| `REPO` | `alovida/mantra-core-health` (frontend Angular). **Nada de backend en este lote** |
| `TARGET_REF` | `origin/mockup` — corte leído **`b655e8449abd662d6b24156fd6e2b06aeb120cc1`** (2026-09-22T18:04-04). **Reconsultalo y fijá el tuyo** en tu `PLAN.md` |
| `RAMA DE TRABAJO` | Una tuya, saliendo de `origin/mockup`. **Nada directo sobre `mockup`, nada sin PR** |
| `ARCHIVOS RESERVADOS PARA VOS` | `src/app/core/mock/mock-backend.interceptor.ts` · `src/app/core/mock/fixtures/{agenda,personas,registered-people}.ts` · `src/app/core/mock/handlers/scheduling.handlers.ts` · `src/app/core/mock/README.md` · `src/app/core/navigation/**` · `src/app/features/shell-layout/**` · `src/app/shared/components/organisms/{header,notification-bell}/**` · `src/app/app.routes.ts` (**archivo de coordinación: sólo vos escribís; los demás piden**) · los tres barrels `shared/components/*/index.ts` (como el 21/09) · `features/tutorials/**` y `features/messaging/**` sólo si el contador de no leídos lo exige |
| `ARCHIVOS DE OTROS — NO LOS TOQUES` | `core/mock/handlers/{profiles,files}.handlers.ts` (**Itzan**) · `core/mock/handlers/{directory,public,pharmacy,diagnostics}.handlers.ts`, `features/directory/**` (**Justin**) · `organisms/{data-table,filter-bar}/**`, `molecules/{pagination,row-actions}/**`, `work-history/**`, `docs/adr/**` (**Pablo**) · `symptom-check/**`, `patient-home/**`, `content-dialog/**`, `dialog/**` (**Marcelo**) · `account/my-profile/**`, `auth/**` (**Itzan**) |
| `⚠️ RIESGO ALTO DE TU CARRIL` | `yarn start` y `yarn build` corren `stock:generate` antes de compilar (verificado el 21/09): **si tu rama rompe el arranque, cuatro personas no trabajan.** Cada cierre repite `yarn start`. Y `navigation.service.spec.ts` **fija por nombre la lista cerrada del menú** (HALL-E12): la cambiás con motivo, no la debilitás |
| `LA MAQUETA NO TIENE BACKEND` | `mockBackend: true` fijo. **Vos sos el backend.** Todo dato nuevo (agendas de los 13) es sintético, determinista (`uuid(semilla)`) y declarado |
| `CUENTA DE PRUEBA` | `medica@alovida.mock` y `paciente@alovida.mock` (cualquier contraseña no vacía). **Sintéticas declaradas** |
| `DÓNDE SE PRUEBA` | La cabecera en cualquier ruta con sesión (`shell-layout`); el directorio del paciente en `/directory`; la agenda de la médica en `/schedule`. **Sacá las URLs del router, no las supongas** |
| `LÍMITE DE RECURSOS` | Regla 70: un `yarn start`, un build, un navegador, Playwright `--workers=1` |

## 1. Antes de escribir una línea — instalación OBLIGATORIA del estándar

> **Esta sección no es opcional y no es el final del día: es lo primero.** Un prompt ejecutado sin
> el estándar cargado produce trabajo que después hay que rehacer, porque no va a tener plan, ni
> evidencia, ni reporte. **Si no podés completar este paso, estás `BLOQUEADO`: avisalo y no sigas.**

### 1.1 Instalar el estándar en tu checkout

```bash
# 1. Clonar el estandar al lado del repo de producto
git clone https://github.com/PabloArauzCaballero/AlovidaPromptManager.git ../AlovidaPromptManager

# 2. Copiarlo DENTRO de tu checkout de trabajo (Claude Code solo carga desde ./.claude/)
cp -r ../AlovidaPromptManager/.claude   ./
cp    ../AlovidaPromptManager/AGENTS.md ./
cp -r ../AlovidaPromptManager/.agents   ./   # solo si tu herramienta no lee .claude/

# 3. Verificar que quedo instalado (pega esta salida en tu daily)
ls .claude/skills | wc -l            # -> 176
ls .claude/rules/[0-9]*.md | wc -l   # -> 14  (mas el README, que no es una regla)
python .claude/hooks/plan_gate.py --self-test    # -> 11 PASS, 0 FAIL
```

⚠️ **Antes de `cp -r`, mirá qué hay:** el repo de producto **ya tiene** su propio `.claude/`. Si ibas a
pisar algo, no lo pises: fusioná y dejá constancia en tu daily.

### 1.2 Qué te instala eso

| Candado | Qué impide |
|---|---|
| `plan_gate.py` | Escribir código sin `PLAN.md` en disco. Nunca bloquea `.md` ni nada bajo `docs/` |
| `report_gate.py` | Cerrar la sesión con trabajo activo y sin `REPORTE.md`, o sin sus tres secciones |
| `blocker_gate.py` | Cerrar con microtareas en `BLOQUEADO` o `EN CURSO` sin declarar la simulación de los tres niveles del contrato (regla 65) |

**En cualquier otra herramienta los candados NO corren.** El plan y el reporte siguen siendo igual de
obligatorios; lo único que cambia es que nadie te va a frenar.

### 1.3 Skills que tenés que CARGAR para este lote

Son **27**: 11 del proceso y 16 propias del simulador y la navegación.

**Del proceso — obligatorias para todos:**

| Skill | Para qué |
|---|---|
| `skills-router` | la entrada al catalogo: mapea la situacion concreta a la skill que toca |
| `factual-discovery` | confirmar el sistema real antes de planificar |
| `milestone-planning` | descomponer en hitos, subtareas y microtareas con CA y DoD |
| `anti-hallucination-guard` | localizar lo existente antes de crear; no inventar APIs de terceros |
| `evidence-and-verification` | que podes afirmar con que evidencia |
| `scope-discipline` | no tocar nada fuera del alcance declarado |
| `rationalization-guard` | las excusas tipicas para saltear una verificacion, y su contramedida |
| `context-thrift` | leer por rangos y busqueda, no archivos enteros |
| `progress-reporting` | checkpoints visibles en cada apertura y cierre de microtarea |
| `finish-your-turn` | como se cierra un turno sin dejar nada colgado |
| `work-report-md` | como se redacta el reporte de cierre |

**De tu lote:**

| Skill | Para qué |
|---|---|
| `synthetic-test-data-generation` | **la más importante de tu lote**: agendas sintéticas, deterministas y declaradas para los 13 |
| `appointment-scheduling` | recursos, plantillas, cupos, bloqueos: qué tiene que tener una agenda para un flujo completo |
| `test-data-management` | escenarios nombrados, limpiables y documentados en el README |
| `seed-data-catalogs` | procedencia de todo lo que siembres; nada ficticio presentado como real |
| `edge-case-data-catalog` | médico sin sede, semana vacía, cupo de capacidad 0: los límites del contrato |
| `frontend-performance` | latencia por ruta, peticiones en serie vs. paralelo; medir antes y después |
| `root-cause-debugging` | R-02: reproducir, medir, hipótesis falsable, matarla con el experimento más barato |
| `frontend-navigation-ia` | dónde va Chats, dónde Tutoriales, por qué el renglón desaparece y la ruta no |
| `iconography-imagery` | el set cerrado de íconos: `chat`, `teach`; el badge de no leídos; nada nuevo «de paso» |
| `frontend-accessibility` | enlaces-ícono con `aria-label` **y** globo (ADR-0012 §3), foco visible, orden de tabulación |
| `native-code-patterns` | los enlaces nuevos de la cabecera calcados de «Ajustes» (`shell-layout.html:378-386`) |
| `data-privacy-phi` | fixtures sin personas reales; los 13 registrados ya son sintéticos declarados |
| `e2e-playwright` | el barrido y el recorrido de reserva con `--workers=1` |
| `unit-testing` | un comportamiento por test; los tres niveles del contrato del interceptor |
| `angular-testing` | `HttpTestingController`, `RouterTestingHarness` para el shell |
| `visual-proof` | la captura no vale si no la mirás |

Entrá siempre por `skills-router`: **no leas el catálogo entero, no sirve.**

### 1.4 DoD de esta sección — se verifica como cualquier otra

- [ ] `ls .claude/skills | wc -l` devolvió **176**, y la salida está pegada en tu daily.
- [ ] `python .claude/hooks/plan_gate.py --self-test` devolvió **11 PASS, 0 FAIL**, salida pegada.
- [ ] Leíste `skills-router` y las 27 skills de las dos tablas, **empezando por `synthetic-test-data-generation`**.
- [ ] Creaste tu `PLAN.md` **antes** del primer `Edit`/`Write` de código.

**Sin estas cuatro casillas, tu lote arranca en `BLOQUEADO`, no en `EN CURSO`.**

> ### ✅ Hechos ya verificados contra el corte — no los repitas, pero tampoco los creas sin abrir el archivo
>
> #### R-02 — la latencia es tuya, deliberada y aleatoria
>
> `mock-backend.interceptor.ts:251-259`, `latencia(path)`: 40 ms para `/terminology`, 600 ms para la subida de
> documentos, y **`120 + Math.floor(Math.random() * 180)`** para todo lo demás, aplicada con `timer()` a cada
> respuesta (L69, L98). Comentario: «Un poco de espera, para que los estados de carga existan». El azar hace que
> **ninguna medición sea repetible** y que un E2E vea tiempos distintos cada corrida. «Elegir médico» dispara
> perfil + terminología + archivos + cupos por sede + próximo hueco (`practitioner-detail.ts:139-150`,
> `practitioner-availability.ts:225-250`, de Justin). **Cuántas son y cuánto tardan lo mide Justin en su H1.S2**
> y te lo publica; si no llegó, lo medís vos y lo declarás.
>
> #### R-03 — los 13 registrados no tienen agenda, y está escrito por qué
>
> `fixtures/agenda.ts:103-140`: un recurso por profesional **sólo** para
> `PROFESIONALES.filter((p) => p.especialidades.length > 0 && p.origen === undefined)` (L106).
> `PROFESIONALES` (`fixtures/personas.ts:262-267`) = escritos + red + **`profesionalesRegistrados()`** («las 13
> personas de `USUARIO_MEDICOS_1.md`», `registered-people.ts`), que llevan `origen` → sin recurso → sin plantilla
> (`agenda.ts:194-200`, una plantilla L-V por recurso) → sin cupos (`generarCupos`, L208-241, ±21 días).
> La médica tiene dos plantillas (L144-190). Todo es determinista con `uuid(semilla)`. Los estados de reserva
> ya están sembrados (L280-310).
>
> #### N-01 — la cabecera ya tiene el precedente exacto, y el menú tiene el mecanismo
>
> `shell-layout.html:266-420`, `div.app-header__derecha`: campana (L271), paciente activo, organización, y
> **«Ajustes»** como `<a routerLink="/settings" appTooltip="Ajustes" appTooltipPosition="bottom" aria-label="Ajustes">`
> con SVG en línea (L378-386). Es lo que hay que **copiar** para Tutoriales y Chats. El set de íconos tiene
> `chat` y `teach` (`nav-icon.types.ts:35-75`). Para sacarlos del menú sin quitarles la ruta:
> `navigation.types.ts:334-350` `fueraDelMenuPara` («sigue existiendo y funcionando, pero no ocupa una entrada
> de primer nivel»); `tutorials` ya lo tiene para `PRACTITIONER` (`navigation.map.ts:114`); `messaging` no
> (L135-141). `settings` y los tres directorios ya usan `fueraDelMenuPara: [ANY_ROLE]` (L242, 307, 349, 1249).
> El contador de no leídos existe para el título de la pestaña: `messaging.ts:186`.
> **El spec que te espera:** `navigation.service.spec.ts:126, 220-236, 283-292, 412-439, 563-571` enumera
> «Chats» y «Cotizaciones» por nombre.
>
> #### N-02 y N-03 — dos renglones que te van a pedir
>
> «Cotizaciones» existe (`navigation.map.ts:605-625`) pero es del médico (`ROLES_DE_QUIEN_ATIENDE`); Justin te
> pide uno para `PATIENT` en «Mi cuenta» con su ruta lazy. «Mis puntos» (`L1325-1348`, `my-account/loyalty`,
> `PATIENT`) pasa a ser pestaña del perfil (Itzan): te pide retirar el renglón y redirigir la ruta, que usan
> `promotion-card.ts:42` y `punto-motivo.ts:117`.
>
> #### D-05 en tus archivos
>
> `organisms/header/header.html` **2** (menú, tema) y `features/shell-layout/shell-layout.html` **1**. HALL-D7
> del 20/09 ya lo dijo: el interruptor de tema tiene `aria-label` y **no tiene globo** — la excepción de
> ADR-0012 §3 a medias. Es una línea.
>
> ⚠️ **Lo que la verificación NO hizo: ejecutar.** No se midió R-02 ni se contó cuántos médicos tienen cupos:
> los dos números son tu H1.

## 2. Resultado observable

| Hito | Prioridad | Qué queda demostrado |
|---|---|---|
| **H1** | `BLOQUEANTE` | Corte declarado, baseline con rojos previos clasificados, `stock:generate` idéntico, y dos números medidos: la latencia actual por ruta y cuántos profesionales del directorio tienen agenda de cuántos. |
| **H2** | `ALTA` | La latencia del simulador es una tabla por prefijo con valores justificados, sin azar bajo E2E, y «elegir médico» baja de lo medido (con Justin). |
| **H3** | `ALTA` | Todos los médicos del directorio tienen cupos en las próximas dos semanas, `mock-backend.spec` sigue verde, y `core/mock/README.md` documenta al menos dos flujos completos con cuenta, médico y día. |
| **H4** | `ALTA` | Tutoriales y Chats están en la cabecera para doctor y paciente, con globo, nombre accesible y no leídos en Chats, y no ocupan renglón; «Cotizaciones» del paciente y el redirect de «Mis puntos» existen a pedido; el spec de navegación pasa con la lista nueva y su motivo. |
| **H5** | `MEDIA` | Los 3 `iconOnly` de tus archivos tienen veredicto aplicado; el interruptor de tema tiene globo. |
| **H6** | `ALTA` | Regresión en verde, `yarn start` arranca para los otros cuatro, `REPORTE.md` escrito. |

> ⚠️ **Esto es más de lo que entra en una noche, y está dicho a propósito.** Orden: **H1 → H2.S1 → H3.S1 → H4.S1**.
> Lo que no se cierra queda `A MEDIAS` con las cuatro respuestas. **Una latencia decidida y agendas para todos
> valen más que la cabecera a medias**: son lo que el doctor va a sentir primero.

**Kill-test del turno completo:** entrá como `paciente@alovida.mock`, abrí `/directory`, elegí uno de los 13
registrados (`registered-people.ts`) y tocá «Revisar disponibilidad»: si dice «No tiene turnos disponibles»,
R-03 no está hecho. Abrí la Red y recargá la ficha dos veces: si los tiempos de la misma petición difieren
en más de lo que tu tabla declara, la latencia sigue siendo azar. Mirá la cabecera: si no hay un ícono con globo
«Chats» y otro «Tutoriales», o si «Chats» sigue en el menú lateral, N-01 no está hecho.

## 3. Alcance

**IN:** baseline y `stock:generate` idéntico · medición de latencia y de agendas · tabla de latencia por
prefijo, determinismo bajo E2E, spec del interceptor · recursos, plantillas y cupos para los 13 registrados ·
escenarios de flujo completo en el README · enlaces-ícono de Tutoriales y Chats en la cabecera con globo y
nombre accesible, contador de no leídos, `fueraDelMenuPara` para ambos roles · renglón «Cotizaciones» del
paciente y redirect de «Mis puntos» **a pedido** · spec de navegación actualizado con motivo · veredicto de los
3 `iconOnly` · specs · capturas por rol, viewport y tema · `PLAN.md`, `REPORTE.md` y `evidencia/`.

**OUT:** **cualquier archivo fuera de los reservados de la ficha** · la ficha del médico y sus peticiones
(**Justin**): vos bajás la latencia, él baja las peticiones · `directory.handlers.ts` (Justin): si el
directorio cuenta médicos, se lee, no se toca · `profiles.handlers.ts` (Itzan) · **quitar la latencia a
cero**: los estados de carga existen para verse (el comentario del interceptor sigue teniendo razón) ·
**sembrar médicos con nombres inventados nuevos**: los 13 ya existen y son sintéticos declarados · **agregar
íconos al set** «de paso» (HALL-E15) · debilitar `navigation.service.spec.ts` (se cambia la lista **con
motivo**) · `features/messaging/**` y `features/tutorials/**` más allá de exponer el contador o un enlace ·
`mantra-core-health-api/**` · declarar `HECHO` una microtarea cuyo DoD no corriste.

## 4. Plan — hitos, subtareas y microtareas

Los seis estados permitidos son exactamente: `TODO`, `EN CURSO`, `HECHO`, `A MEDIAS`, `BLOQUEADO` y
`DESCARTADO`. **`A MEDIAS` es legítimo; disfrazarlo de `HECHO` no.**

### H1 — Corte, baseline, `stock:generate` idéntico y medición

**Prioridad:** `BLOQUEANTE`

**CA:** Dado tu entorno, cuando alguien pregunta contra qué versión trabajaste, si el arranque de los
otros cuatro está a salvo, cuánto tarda hoy el simulador y cuántos médicos tienen agenda, entonces hay
SHA, un diff vacío y dos tablas medidas.
**DoD:** salidas en `evidencia/antes/`; `evidencia/antes/latencia.md` y `evidencia/antes/agendas.txt`.
**Estado:** TODO

#### H1.S1 — Corte, baseline y el generador

**CA:** Dado un rojo posterior o un arranque roto, cuando alguien pregunta si fue tu cambio, entonces la
respuesta sale de un archivo.
**DoD:** salidas con exit code; `stock:generate` ×2 con diff vacío.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H1.S1.M1 | Fijar corte y rama | Hay SHA y rama en `PLAN.md` | `git fetch origin && git rev-parse origin/mockup && git branch --show-current` | TODO |
| H1.S1.M2 | Baseline de `lint` y `typecheck` | Hay salida y exit code | `yarn lint; echo "exit=$?"; yarn typecheck; echo "exit=$?"` → `evidencia/antes/` | TODO |
| H1.S1.M3 | Baseline de `test` | Hay conteo de fallos previos | `yarn test --watch=false` → `evidencia/antes/test.txt` | TODO |
| H1.S1.M4 | Clasificar cada rojo previo | Cada uno con su clase de la regla 80.4 | tabla en `PLAN.md` | TODO |
| H1.S1.M5 | `stock:generate` dos veces con diff vacío | Diff vacío | `yarn stock:generate && cp <índice> /tmp/a && yarn stock:generate && diff /tmp/a <índice>` | TODO |

#### H1.S2 — Los dos números

**CA:** Dado el simulador al corte, cuando alguien pregunta cuánto tarda cada ruta y cuántos médicos
tienen cupos, entonces hay una tabla medida y un conteo N/M, no una lectura del código.
**DoD:** las 4 microtareas en `HECHO`, publicadas a Justin.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H1.S2.M1 | Tabla de latencia actual por prefijo (leída del interceptor) y observada (10 peticiones de `/scheduling/slots` con la Red abierta: mínimo, máximo) | Tabla con las dos columnas | `evidencia/antes/latencia.md` | TODO |
| H1.S2.M2 | Conteo: profesionales en el directorio vs. con recurso vs. con cupos en ±14 días (script o spec de sólo lectura sobre los fixtures) | N/M/K pegados | `evidencia/antes/agendas.txt` | TODO |
| H1.S2.M3 | Tomar la medición de Justin (H1.S2 suyo) del flujo «elegir médico»; si no llegó, medirla vos y declararlo | Tabla de peticiones y total | `evidencia/antes/red-flujo-reserva.md` (copia o propia) | TODO |
| H1.S2.M4 | Capturas antes de la cabecera con `medica@` y `paciente@`, escritorio y móvil | Cuatro capturas miradas | `evidencia/antes/capturas/` | TODO |

### H2 — Latencia decidida por ruta (R-02)

**Prioridad:** `ALTA`

**CA:** Dado el simulador, cuando responde, entonces la espera es una tabla por prefijo con valores
justificados (los estados de carga siguen existiendo), sin azar cuando corre bajo E2E, y «elegir médico»
baja de lo medido.
**DoD:** spec del interceptor de tres niveles; medición «después» con Justin.
**Estado:** TODO

#### H2.S1 — La tabla y el determinismo

**CA:** Dada una ruta, cuando se la busca en la tabla, entonces tiene una latencia con su motivo; y bajo
E2E la misma petición tarda siempre lo mismo.
**DoD:** las 5 microtareas en `HECHO`.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H2.S1.M1 | Tabla por prefijo en el interceptor (`/terminology`, `/scheduling/slots`, `/profiles`, subida, resto) con valores justificados en el comentario; ninguna por debajo de lo que hace visible un estado de carga (declarar el mínimo elegido) | La tabla reemplaza al `random` | `git grep -c 'Math.random' -- src/app/core/mock/mock-backend.interceptor.ts` → 0 | TODO |
| H2.S1.M2 | Sin azar: la variación, si la querés conservar fuera de E2E, sale de un hash determinista del `path` — nunca de `Math.random` | Dos corridas, mismos tiempos | spec | TODO |
| H2.S1.M3 | Spec de tres niveles: prefijo conocido (valor de la tabla), desconocido (valor por omisión), subida (600) | Verde | `npx ng test --include=src/app/core/mock/mock-backend.spec.ts --watch=false` | TODO |
| H2.S1.M4 | Medición «después» del flujo «elegir médico», con la ficha de Justin como esté (objetivo Q-10: < 1 s) | Tabla comparada | `evidencia/h2/red-despues.md` | TODO |
| H2.S1.M5 | Publicar la tabla a Justin por el daily | Justin la puede leer | daily de equipo | TODO |

#### H2.S2 — Peticiones idénticas en vuelo

**CA:** Dada la misma `GET` disparada dos veces antes de que la primera responda, cuando se decide qué
hace el simulador, entonces la decisión está escrita: o se comparte la respuesta en vuelo, o no, con el motivo.
**DoD:** decisión escrita; si se implementa, spec.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H2.S2.M1 | Decidir y escribir: compartir `GET` idénticas en vuelo en el interceptor (ayuda a R-01 pero puede esconder bugs de doble disparo) vs. no hacerlo y dejar que el cliente sea único | Decisión con motivo en `PLAN.md` | `PLAN.md` | TODO |
| H2.S2.M2 | Si se implementa: spec de tres niveles (dos idénticas → una respuesta; distintas → dos; error en vuelo → las dos ven el error) | Verde | comando de spec | TODO |

### H3 — Agendas para todos, y escenarios documentados (R-03)

**Prioridad:** `ALTA`

**CA:** Dado cualquier médico del directorio, cuando el paciente lo elige, entonces tiene cupos en las
próximas dos semanas; y el README describe al menos dos flujos completos con cuenta, médico y día.
**DoD:** conteo N/N; `mock-backend.spec` en verde; README; barrido.
**Estado:** TODO

#### H3.S1 — Recurso, plantilla y cupos para los 13

**CA:** Dados los profesionales registrados, cuando se genera la agenda, entonces cada uno tiene un
recurso con sede, una plantilla y cupos ±21 días, deterministas.
**DoD:** las 5 microtareas en `HECHO`.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H3.S1.M1 | Incluir a los registrados en `recursos` (quitar la exclusión por `origen`, o darles recurso con sede explícita), conservando `uuid(semilla)` | 13 recursos más | `evidencia/h3/agendas-despues.txt` | TODO |
| H3.S1.M2 | Plantilla por recurso nuevo (L-V, mañana/tarde alternadas como el resto) y cupos generados | Cupos ±21 días para cada uno | spec de sólo lectura sobre los fixtures | TODO |
| H3.S1.M3 | Casos límite declarados: un médico sin especialidad sigue sin agenda (y se dice por qué); una sede sin `timeZone` cae al por omisión | Dos casos en spec | comando de spec | TODO |
| H3.S1.M4 | `mock-backend.spec` con cada cuenta en verde | Verde | `npx ng test --include=src/app/core/mock/mock-backend.spec.ts --watch=false` | TODO |
| H3.S1.M5 | El directorio del paciente muestra cupos para un registrado (captura) | Observado | `evidencia/h3/capturas/` | TODO |

#### H3.S2 — Los escenarios de flujo completo

**CA:** Dado el README del simulador, cuando alguien quiere recorrer «paciente elige especialidad →
médico → cupo → reserva → la médica la ve», entonces encuentra al menos dos escenarios con cuenta, médico,
día y qué se ve en cada paso.
**DoD:** las 4 microtareas en `HECHO`.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H3.S2.M1 | Escenario A: `paciente@` reserva con la médica (`medica@`) un cupo de mañana; la médica lo ve en «Consultas» | Recorrido con captura por paso | `evidencia/h3/escenario-a/` | TODO |
| H3.S2.M2 | Escenario B: `paciente@` reserva con un registrado; el estado queda `SOLICITADA` o `CONFIRMADA` según la política, y se dice cuál | Recorrido con captura | `evidencia/h3/escenario-b/` | TODO |
| H3.S2.M3 | Sección «Escenarios de flujo completo» en `core/mock/README.md` con los dos, sus IDs y qué comando los verifica | Sección presente | `grep -c 'Escenario' src/app/core/mock/README.md` → ≥ 2 | TODO |
| H3.S2.M4 | Barrido de pantallas con las dos cuentas | Ninguna rompe | `E2E_BASE_URL=http://localhost:4200 npx playwright test playwright/mockup-barrido.spec.ts --workers=1` | TODO |

### H4 — Cabecera y menú (N-01, y N-02/N-03 a pedido)

**Prioridad:** `ALTA`

**CA:** Dado el doctor o el paciente, cuando mira la cabecera, entonces ve Tutoriales y Chats como
íconos con globo y nombre accesible (Chats con no leídos), y no los ve en el menú lateral; y los renglones
que Justin e Itzan pidieron existen con su ruta.
**DoD:** `navigation.service.spec.ts` actualizado con motivo; specs del shell; capturas ×2 roles ×3 viewports ×2 temas.
**Estado:** TODO

#### H4.S1 — Tutoriales y Chats en la cabecera (N-01)

**CA:** Dada la cabecera, cuando se la recorre con teclado, entonces los dos enlaces nuevos tienen foco
visible, nombre accesible y globo, y navegan; y con dos chats sin leer el ícono muestra «2».
**DoD:** las 7 microtareas en `HECHO`.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H4.S1.M1 | Dos `<a routerLink>` calcados de «Ajustes» (`shell-layout.html:378-386`): `/tutorials` con `teach` y `/messaging` con `chat`, `aria-label` **y** `appTooltip` (ADR-0012 §3, con la excepción escrita al lado), antes de la campana o después según el orden que decidas y escribas | Los dos se ven y navegan | captura | TODO |
| H4.S1.M2 | Contador de no leídos en Chats: reusar la fuente de `messaging.ts:186`; si vive dentro del componente, exponerla por un servicio en `core/` (no duplicar la cuenta) | Con 2 sin leer, se ve «2» y el nombre accesible lo dice | spec + captura | TODO |
| H4.S1.M3 | `fueraDelMenuPara: [ANY_ROLE]` en `tutorials` y `messaging` (`navigation.map.ts`), con el motivo (N-01, fecha) en el comentario | No hay renglón para ningún rol; las rutas siguen | captura ×2 roles | TODO |
| H4.S1.M4 | `navigation.service.spec.ts`: actualizar la lista cerrada (L126, 220-236, 283-292, 412-439, 563-571) con el motivo escrito — **sin** borrar aserciones | Verde con la lista nueva | `npx ng test --include=src/app/core/navigation/navigation.service.spec.ts --watch=false` | TODO |
| H4.S1.M5 | Orden de tabulación y foco visible en la cabecera; a 375 px nada desborda | Observado y medido | descripción + `scrollWidth` | TODO |
| H4.S1.M6 | Spec del shell: los dos enlaces existen para ambos roles | Verde | comando de spec | TODO |
| H4.S1.M7 | Capturas ×2 roles ×3 viewports ×2 temas, miradas | 12 con su línea | `evidencia/h4/capturas/` | TODO |

#### H4.S2 — Los renglones a pedido (N-02, N-03)

**CA:** Dado el pedido de Justin, cuando llega, entonces «Cotizaciones» existe para `PATIENT` en «Mi
cuenta» con su ruta lazy; dado el de Itzan, «Mis puntos» no tiene renglón y `/my-account/loyalty` redirige
a la pestaña; y si no llegaron, el contrato está simulado y declarado.
**DoD:** las 4 microtareas en `HECHO`.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H4.S2.M1 | Renglón «Cotizaciones» (`PATIENT`, grupo «Mi cuenta», ícono `billing` o el que el set permita) y ruta lazy hacia el componente que Justin publique; mientras no exista, hacia una ruta declarada | Con `paciente@` se ve el renglón | captura | TODO |
| H4.S2.M2 | Retirar el renglón «Mis puntos» y redirigir `/my-account/loyalty` → `/my-account` con la pestaña «Mis puntos» (el mecanismo que `my-profile` tenga para abrir una pestaña por URL; si no tiene, lo pedís a Itzan y redirigís a `/my-account`) | La URL vieja llega a la pestaña | captura | TODO |
| H4.S2.M3 | Spec de navegación con las dos entradas | Verde | comando de spec | TODO |
| H4.S2.M4 | Regla 65: si un pedido no llegó, simular (ruta hacia un componente vacío declarado) y anotar en los dos dailies | Declarado | dailies | TODO |

### H5 — D-05 en la cabecera

**Prioridad:** `MEDIA`

**CA:** Dados los 3 `iconOnly` de `header.html` y `shell-layout.html`, cuando se los mira, entonces tienen
texto o la excepción escrita al lado con `aria-label` y `appTooltip` — incluido el interruptor de tema.
**DoD:** veredictos aplicados; captura; spec.
**Estado:** TODO

#### H5.S1 — Veredicto y aplicación

**CA:** Dado cada uno de los tres, cuando se lo revisa, entonces está aplicado.
**DoD:** las 3 microtareas en `HECHO`.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H5.S1.M1 | Veredicto: menú (excepción: hamburguesa universal), tema (excepción **con globo**, HALL-D7), el de `shell-layout` (leer cuál es) | Tres veredictos escritos | `evidencia/h5/iconos.md` | TODO |
| H5.S1.M2 | Aplicar: `appTooltip` en el interruptor de tema y la excepción escrita al lado de cada uno | Cero sin motivo | `git grep -n iconOnly -- src/app/shared/components/organisms/header src/app/features/shell-layout` | TODO |
| H5.S1.M3 | Spec o captura | Observado | `evidencia/h5/` | TODO |

### H6 — Regresión y cierre

**Prioridad:** `ALTA`

**CA:** Dado el cierre, cuando alguien que no vio tu turno lee el reporte, entonces sabe qué quedó
demostrado, qué quedó a medias con las cuatro respuestas y qué no se cubrió; y `yarn start` arranca.
**DoD:** baseline repetido y comparado; `yarn start` limpio; `REPORTE.md`.
**Estado:** TODO

#### H6.S1 — Regresión

**CA:** Dado el baseline, cuando se repite, entonces coincide o la diferencia está explicada; y el
arranque de los otros cuatro está a salvo.
**DoD:** las 5 microtareas en `HECHO`.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H6.S1.M1 | `lint` y `typecheck` | Sin rojos nuevos | diff contra `evidencia/antes/` | TODO |
| H6.S1.M2 | `test` completo | Sin rojos nuevos | diff contra baseline | TODO |
| H6.S1.M3 | `stock:generate` idéntico y `yarn start` arranca | Diff vacío; arranca | salidas pegadas | TODO |
| H6.S1.M4 | Barrido de pantallas con las cinco cuentas | Ninguna rompe | `… playwright/mockup-barrido.spec.ts --workers=1` | TODO |
| H6.S1.M5 | Barrido de clics sobre la cabecera y `/directory` | Sin excepciones ni 5xx | `… playwright/mockup-click-sweep.spec.ts --workers=1` | TODO |

#### H6.S2 — Cierre honesto

**CA:** Dado el reporte, cuando se lee la primera línea, entonces está el avance calculado.
**DoD:** las 4 microtareas en `HECHO`.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H6.S2.M1 | Capturas finales por rol, viewport y tema, miradas | Con su línea | `evidencia/h6/` | TODO |
| H6.S2.M2 | Declarar el peldaño por área (regla 30) y qué se cerró contra un doble | Hay peldaño por área | sección en `REPORTE.md` | TODO |
| H6.S2.M3 | Escribir `REPORTE.md` con el avance primero | `head -3` muestra el avance | `head -3 REPORTE.md` | TODO |
| H6.S2.M4 | Enumerar procesos que quedaron corriendo y cerrarlos | Lista, o «ninguno» | sección en `REPORTE.md` | TODO |

## 5. Ambigüedades registradas

| ID | Ambigüedad | Supuesto con el que trabajás | Quién puede resolverla | Qué bloquea |
|---|---|---|---|---|
| Q-10 | «tarda demasiado» sin umbral | < 1 s para la ficha con cupos; se mide con Justin | Pablo | H2.S1.M4 |
| Q-14 | Íconos en la cabecera vs. «icono + nombre» (D-05) | Excepción ADR-0012 §3: `aria-label` + globo, como campana y ajustes | Doctor | H4.S1.M1 |
| Q-17 | Ruta y renglón de «Mis puntos» | La ruta se conserva y redirige; el renglón se retira | Pablo | H4.S2.M2 |
| Q-E1 | ¿Cuál es la latencia mínima que todavía deja ver un estado de carga? | La que elijas, escrita con motivo (p. ej. 60 ms para lecturas, más para escrituras) | Pablo | H2.S1.M1 |
| Q-E2 | ¿Compartir `GET` idénticas en vuelo en el interceptor? | Se decide en H2.S2.M1 con motivo; por omisión **no**, para no esconder dobles disparos del cliente | Pablo | H2.S2 |
| Q-E3 | ¿Los 13 registrados tienen sede? Si no, ¿cuál se les asigna? | Una de las tres sedes existentes, determinista por índice, declarada | Pablo | H3.S1.M1 |
| Q-E4 | ¿Dónde va el contador de no leídos si hoy vive dentro de `messaging`? | Un servicio en `core/` que los dos consuman; no se duplica la cuenta | Pablo | H4.S1.M2 |

## 6. Definition of Done del hito

- [ ] Todas sus microtareas en `HECHO`, o en `A MEDIAS`/`BLOQUEADO`/`DESCARTADO` **con las cuatro respuestas**.
- [ ] La salida literal del comando de cada DoD está en `evidencia/`, no parafraseada.
- [ ] `yarn lint`, `yarn typecheck` y `yarn test --watch=false` sin rojos **nuevos** respecto del baseline.
- [ ] **`yarn start` arranca y `stock:generate` regenera idéntico**: el arranque de los otros cuatro está a salvo.
- [ ] `Math.random` fuera del interceptor; la latencia es una tabla con motivo.
- [ ] `navigation.service.spec.ts` en verde **con la lista nueva y su motivo**, no con aserciones borradas.
- [ ] Los enlaces nuevos de la cabecera cumplen ADR-0012 §3: `aria-label` **y** globo, con la excepción escrita.
- [ ] Todo dato sembrado es sintético, determinista y declarado (regla 97.6).
- [ ] Capturas por rol, viewport y tema, **miradas**, con una línea cada una.
- [ ] Peldaño de evidencia declarado por área (regla 30).
- [ ] Sin datos de personas en logs, capturas, plan ni reporte (regla 90.2).
- [ ] El `PLAN.md` está actualizado en el momento, no al final.

## 7. Cómo cerrás el turno

1. **Checkpoint** en cada apertura y cierre de microtarea. Prohibido encadenar más de tres operaciones
   materiales sin uno.
2. **`REPORTE.md`** con el avance en la **primera línea**: `> **AVANCE: <HECHO> / 48 — <%>.**`
3. **Las tres secciones obligatorias existen siempre.** Una vacía se escribe con «ninguna».
4. **Los pedidos de Justin e Itzan que no lleguen** no cierran como `BLOQUEADO` sin haber simulado los tres
   niveles de su contrato (regla 65).
5. **Publicá la tabla de latencia (H2.S1) apenas esté**: Justin mide con ella.
6. **Tu carril del 21/09** (`Refactor-CatalogoEInventario`) queda `A MEDIAS` declarado en su propio reporte.
7. **Enumerá qué quedó corriendo** y cerralo.
8. **Tu daily** es `Ender-Daily-Noche-2026-09-22.md`, en la carpeta de arriba.

## 8. Revisión adversarial antes de cerrar

1. ¿Bajaste la latencia a cero y ahora ningún estado de carga se ve?
2. ¿Queda un `Math.random` que haga que dos corridas de E2E vean tiempos distintos?
3. ¿Los 13 tienen cupos **en el directorio del paciente**, o sólo en el fixture?
4. ¿Debilitaste `navigation.service.spec.ts` en vez de cambiar la lista con motivo?
5. ¿Los enlaces de la cabecera tienen `aria-label` **y** globo, o sólo uno de los dos?
6. ¿El contador de no leídos está calculado dos veces (en la pestaña y en la cabecera)?
7. ¿Un pedido que no llegó quedó `BLOQUEADO` sin simular?
8. ¿`yarn start` arranca en un checkout limpio de tu rama?
9. ¿Se declara verificado algo que sólo fue inspeccionado estáticamente?
10. ¿Agregaste un ícono al set «de paso»?
