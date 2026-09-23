# La pantalla de inicio del paciente: una silueta que se toca, un panel para escribir o dictar, y el modal de confirmación que los otros cuatro van a usar

> **Rol:** dueño del chequeo de síntomas, de la pantalla de inicio del paciente, y de `content-dialog` y `dialog` (la confirmación de la casa) · **Línea:** E · **Fecha:** 2026-09-22 · **Turno:** noche
> **Fuente del pedido:** [`CORRECCIONES-DOCTOR-Y-PACIENTE-2026-09-22.md`](../../../../../docs/requisitos/CORRECCIONES-DOCTOR-Y-PACIENTE-2026-09-22.md) — **P-01, P-02, P-03, D-08 (el modal de confirmación)**
> **Verificación contra el código:** [`VERIFICACION-CONTRA-CODIGO-2026-09-22.md`](../../../../../docs/verificacion/VERIFICACION-CONTRA-CODIGO-2026-09-22.md) — §1, §2 (P-01, P-02, P-03, D-08), §4 (HALL-E14)
> **Plan maestro:** [`PLAN-MAESTRO.md`](../../../../../docs/trabajo/2026-09-22-plan-y-reparto-correcciones-doctor-y-paciente/PLAN-MAESTRO.md) — **Pablo e Itzan dependen de tu H4** (la confirmación): publicalo temprano
> **6 hitos · 12 subtareas · 59 microtareas**, todas con criterio de aceptación y Definition of Done.
>
> **Tu carril tiene la pieza más visible y la más reusada de la noche.** La visible es la silueta: el
> doctor quiere «un dibujo como el mapa de Bolivia» para tocar dónde duele — y **el mapa de Bolivia ya es
> un organismo accesible** con geometría aparte, teclado y tres señales para lo elegido; la silueta se
> hace con ese molde. La reusada es la confirmación «¿Confirmás estos cambios?» que D-08 exige en cada
> «Guardar»: vos sos el dueño de `dialog-service` y `content-dialog`, y **Pablo e Itzan la esperan**.
> Lo que no cambia esta noche: **la tabla de síntomas y de especialidades**. Eso la revisa el equipo
> médico, no se toca por dibujar una figura (regla 97.5.4).

## 0. Ficha de asignación

| Campo | Valor |
|---|---|
| `REPO` | `alovida/mantra-core-health` (frontend Angular). **Nada de backend en este lote** |
| `TARGET_REF` | `origin/mockup` — corte leído **`b655e8449abd662d6b24156fd6e2b06aeb120cc1`** (2026-09-22T18:04-04). **Reconsultalo y fijá el tuyo** en tu `PLAN.md` |
| `RAMA DE TRABAJO` | Una tuya, saliendo de `origin/mockup`. **Nada directo sobre `mockup`, nada sin PR** |
| `ARCHIVOS RESERVADOS PARA VOS` | `src/app/features/symptom-check/**` · `src/app/features/dashboard/patient-home/**` · `src/app/shared/components/organisms/body-map/**` (nuevo) · `src/app/shared/components/organisms/content-dialog/**` · `src/app/shared/components/molecules/dialog/**` · `src/app/core/mock/handlers/clinical.handlers.ts` (sólo si hace falta) |
| `ARCHIVOS DE OTROS — NO LOS TOQUES` | `features/symptom-check/sintomas.datos.ts` es tuyo pero **no se edita esta noche** (dato médico revisado) · `organisms/department-map/**` (se **copia el patrón**, no se toca) · `features/dashboard/**` fuera de `patient-home/**`, `core/navigation/**`, `shell-layout/**`, `app.routes.ts`, barrels (**Ender**) · `organisms/{data-table,filter-bar}/**`, `molecules/{pagination,row-actions}/**`, `work-history/**`, `docs/adr/**` (**Pablo**) · `account/my-profile/**`, `auth/**`, `organisms/{specialty-badge,specialty-badge-grid}/**` (**Itzan**) · `features/directory/**`, `nearby-places/**`, `where-to-buy/**` (**Justin**) · `features/messaging/**` (el grabador de notas de voz se **lee** como precedente, no se toca) |
| `⚠️ RIESGO ALTO DE TU CARRIL` | `content-dialog` tiene **29** consumidores y `dialogs.confirm` **26**: lo que agregues es **opt-in** y no cambia el comportamiento de nadie. Y lo que la persona dicta o escribe son **síntomas: PHI**. Nada de eso va a consola, logs, analytics ni a un servicio externo no declarado (regla 90.2.1, 90.2.4) |
| `LA MAQUETA NO TIENE BACKEND` | `mockBackend: true` fijo. El chequeo de síntomas no habla con la API (es una tabla local + motor): tu DoD es en pantalla y en spec |
| `CUENTA DE PRUEBA` | `paciente@alovida.mock` (cualquier contraseña no vacía). **Sintética declarada** |
| `DÓNDE SE PRUEBA` | El panel del paciente (`/dashboard` con `paciente@` monta `patient-home`) y `/search/symptoms` (la misma pieza suelta, `app.routes.ts:1167, 1325`). La confirmación se prueba en cualquier `Guardar` que la llame — pedile a Pablo o a Itzan uno, o probala en la vitrina. **Sacá las URLs del router, no las supongas** |
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

Son **28**: 11 del proceso y 17 propias de la silueta, la voz y el diálogo.

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
| `frontend-accessibility` | **la más importante de tu lote**: la silueta como control (`role="button"`, teclado, `aria-pressed`, nada sólo por color); el diálogo con foco gestionado |
| `accessibility-testing` | teclado completo en la silueta, el dictado y el apilamiento de diálogos, con evidencia |
| `frontend-ui-design` | una silueta neutra, legible, que no compite con las pastillas; proporción y jerarquía |
| `frontend-beautiful-ui` | que el dibujo sea de calidad («como el mapa de Bolivia»), no un clipart |
| `iconography-imagery` | geometría SVG en archivo aparte, `viewBox`, trazos con tokens; el ícono de «Dictar» del set cerrado |
| `frontend-motion` | el indicador de «escuchando» y la transición de la zona elegida respetan `prefers-reduced-motion` |
| `atomic-design-components` | `body-map` es un organismo de `shared/` con el molde de `department-map`; nada se copia de `features/` |
| `angular-signals-state` | la zona elegida como `model`; lo dictado se vuelca al mismo `texto()` que ya lee el motor |
| `angular-ssr-hydration` | `SpeechRecognition` no existe bajo SSR: `isPlatformBrowser`, sin `window` en el constructor |
| `frontend-security` | permiso de micrófono, y qué se le dice a la persona antes de pedirlo |
| `data-privacy-phi` | lo dictado son síntomas: nada a logs, consola, analytics ni a servicios no declarados |
| `ux-writing-microcopy` | «¿Confirmás estos cambios?», «Contanos con tus palabras», «Dictar», el aviso del navegador |
| `frontend-ux-states` | escuchando / sin permiso / sin soporte / sin resultado, todos accionables |
| `frontend-forms-ux` | por qué guardar pide confirmación y cancelar con cambios pregunta |
| `unit-testing` | un comportamiento por test; los tres niveles del contrato |
| `angular-testing` | doble del reconocedor de voz; harness del diálogo; `whenStable` en zoneless |
| `visual-proof` | la captura no vale si no la mirás; el borrador de la silueta se muestra antes de pulir |

Entrá siempre por `skills-router`: **no leas el catálogo entero, no sirve.**

### 1.4 DoD de esta sección — se verifica como cualquier otra

- [ ] `ls .claude/skills | wc -l` devolvió **176**, y la salida está pegada en tu daily.
- [ ] `python .claude/hooks/plan_gate.py --self-test` devolvió **11 PASS, 0 FAIL**, salida pegada.
- [ ] Leíste `skills-router` y las 28 skills de las dos tablas, **empezando por `frontend-accessibility`**.
- [ ] Creaste tu `PLAN.md` **antes** del primer `Edit`/`Write` de código.

**Sin estas cuatro casillas, tu lote arranca en `BLOQUEADO`, no en `EN CURSO`.**

> ### ✅ Hechos ya verificados contra el corte — no los repitas, pero tampoco los creas sin abrir el archivo
>
> #### P-01 — la lógica existe; falta el dibujo
>
> `patient-home.html:20-36` monta `<app-symptom-check />` con `@defer (on immediate)` (pesa; viaja en el bundle
> inicial). `zonas.datos.ts:45-106` tiene **10 zonas** (`cabeza`, `ojos`, `orl`, `pecho`, `panza`, `huesos`,
> `piel`, `animo`, `intima`, `general`), cada una con `icono` y `sintomas`; `symptom-check.html:9-170` las dibuja
> como pastillas con SVG por `@switch`; tocar una abre sus síntomas como chips (L172-186); la recomendación sale
> del motor (`symptom-check.ts:210-216`, `recomendar(...)` cruzado con `especialidadesDisponibles()`), con «Ver
> quién atiende» hacia `/directory`. **Tres zonas no son partes del cuerpo** (`piel`, `animo`, `general`): quedan
> como pastillas (Q-11).
>
> **El molde:** `organisms/department-map/department-map.ts:1-70` y `bolivia-departments.geometry.ts`: un `<path
> role="button" tabindex aria-label aria-pressed>` por región, recorrido por teclado en un orden fijo, activado
> con Enter/Espacio, elegido con **tres señales** (relleno, trazo, texto), geometría (`viewBox`, siluetas) en un
> archivo aparte, y **sin saber de catálogos**: recibe los datos resueltos. `fixtures/anatomia-atlas.ts` es un
> índice de láminas para el glosario, **no** una figura: no sirve de geometría.
>
> #### P-02 — el área de texto existe, plegada; la voz no existe
>
> `symptom-check.html:191-203`: `<details class="sintomas__escribir" [open]="sintomas().length === 0">
> <summary>O escribilo con tus palabras</summary><app-textarea [rows]="2" [autoResize]="true" [maxRows]="5" …>`.
> Reconocimiento de voz: **ninguno** en el repo. El precedente a copiar por su criterio es
> `messaging/thread/composer/grabador.ts:14-27` (nota de voz con `MediaRecorder`; «sin permiso o sin
> `MediaRecorder` el botón no aparece»). Para dictar, la API es `SpeechRecognition`/`webkitSpeechRecognition`
> (Chromium; **no Firefox**, **no SSR**), y lo transcripto va al mismo `texto()` (`symptom-check.ts:143`) que
> el motor ya lee. **HALL-E14:** el reconocimiento del navegador puede mandar audio a un servidor del proveedor
> del navegador: se **declara** en pantalla.
>
> #### P-03 — cuatro bloques, y el pedido nombra uno sin nombrarlo
>
> `patient-home.html`, de arriba a abajo: síntomas (L20-36) · estados (L38-55) · primera vez (L58-67) **o** «Tu
> próxima cita» (L69-176) + tira de resumen (L182-224) · **grilla de accesos «Ir a lo tuyo»** (`nav.mi-salud__accesos`,
> L231-258; `patient-home.ts:152-185`). Supuesto Q-13: «el panel de abajo» es la grilla (último bloque, repite el
> menú). **Se confirma con captura antes de borrar.** `data-testid="mi-salud-acceso"` lo usan specs y barrido.
>
> #### D-08 — la confirmación: la pieza existe, el uso no
>
> `molecules/dialog/dialog-service.ts`: `confirm({ title, message, confirmLabel, cancelLabel })` → `Promise<boolean>`,
> usado en **26** archivos (`git grep -c 'dialogs.confirm('`), siempre para **destruir** («Dejar de atender acá»,
> `work-history.ts:896`; `retirarFila`, `practitioner-profile-edit.ts:1581`). **Nadie lo usa para confirmar un
> guardado.** `organisms/content-dialog/content-dialog.ts:84-123`: `heading` requerido, `size`, `dismissible`,
> `dismissAttempt` («quien lo escucha pregunta si se descarta lo escrito»), foco restaurado en L257. Lo que D-08
> pide es **componer las dos**: Guardar → `confirm` → cerrar; Cancelar con cambios → `dismissAttempt` → `confirm`
> de descarte. Y hay una pregunta sin respuesta: **¿un `<dialog>` con `showModal()` sobre otro `showModal()` apila
> bien y devuelve el foco?** Nadie lo probó. Es tu H4.S1.M6 y le importa a Pablo y a Itzan.
>
> ⚠️ **Lo que la verificación NO hizo: ejecutar.** No se abrió la maqueta. Cuál es «el panel de abajo» y si el
> apilamiento funciona son observaciones tuyas, no de este documento.

## 2. Resultado observable

| Hito | Prioridad | Qué queda demostrado |
|---|---|---|
| **H1** | `BLOQUEANTE` | Corte declarado, baseline con rojos previos clasificados, capturas de la pantalla de inicio con los cuatro bloques nombrados, el chequeo de síntomas ejercitado, y Q-13 elevada con captura. |
| **H2** | `ALTA` | Existe `body-map`: una silueta neutra frontal con zonas que responden a clic y a teclado, con tres señales para la elegida, en claro y oscuro; tocarla abre los síntomas de esa zona y aparece la especialidad — con la tabla médica intacta. El borrador se mostró al doctor. |
| **H3** | `ALTA` | El área de texto está visible como panel; en Chromium hay «Dictar» (ícono + texto) que vuelca lo dicho al texto, con estados accionables y el aviso de privacidad; sin soporte no aparece; y el panel sobrante no está, tras confirmar cuál era. |
| **H4** | `BLOQUEANTE` para Pablo e Itzan | `confirmarCambios()` publicado antes de la mitad del turno, con la receta de descarte, spec de tres niveles y la prueba de apilamiento con captura. |
| **H5** | `ALTA` | Regresión en verde; D-05 en tus archivos declarado. |
| **H6** | `ALTA` | `REPORTE.md` escrito, con lo que no se cubrió. |

> ⚠️ **Esto es más de lo que entra en una noche, y está dicho a propósito.** Orden: **H1 → H4** (dos personas
> esperan) **→ H2 → H3**. Lo que no se cierra queda `A MEDIAS` con las cuatro respuestas. **Una confirmación
> publicada y una silueta que se toca y recomienda valen más que la voz a medias.**

**Kill-test del turno completo:** entrá como `paciente@alovida.mock`. En el panel: si no hay una figura
humana, o si al tocarle el pecho no se abren sus síntomas, o si con Tab no se recorre y con Enter no se
elige, H2 no está hecho. Si el área de texto está detrás de un «O escribilo con tus palabras» plegado, o en
Chromium no hay «Dictar» con ícono y texto, H3 no está hecho. Si la grilla de accesos sigue abajo sin que el
doctor haya dicho que era otro bloque, tampoco. Y pedile a Pablo su modal: si al guardar no aparece
«¿Confirmás estos cambios?» con el foco adentro, H4 no está hecho.

## 3. Alcance

**IN:** baseline y capturas previas · Q-13 elevada con captura · organismo `body-map` con geometría
aparte, API calcada de `department-map`, accesible, con tokens y spec · integración con `symptom-check`
(zona ↔ `alternarZona`) sin tocar la tabla médica · área de texto visible · dictado por voz con
`SpeechRecognition`, detección de soporte, estados, aviso de privacidad y spec con doble · retiro del
bloque confirmado · `confirmarCambios()` sobre `DialogService`, receta de descarte documentada en
`content-dialog`, prueba de apilamiento · specs · capturas por viewport y tema · `PLAN.md`, `REPORTE.md`
y `evidencia/`.

**OUT:** **cualquier archivo fuera de los reservados de la ficha** · **`sintomas.datos.ts` y `motor.ts`**:
ni un síntoma, ni una especialidad, ni una regla nueva (regla 97.5.4 y `motor.ts:37-40`) · `department-map`
(se copia el patrón) · `messaging/**` (el grabador es precedente, no se toca) · `dashboard/**` fuera de
`patient-home` (Ender) · **un servicio externo de transcripción** (regla 90.2.4) · **guardar el audio o el
texto dictado** en ningún lado que no sea el estado de la pantalla · cambiar el comportamiento por omisión de
`content-dialog` o de `confirm` para sus consumidores actuales (todo opt-in) · dibujar frente y dorso, o
siluetas por sexo, esta noche (Q-11: neutra y frontal; lo demás se registra) · borrar la grilla **sin**
la confirmación de Q-13 · declarar `HECHO` una microtarea cuyo DoD no corriste.

## 4. Plan — hitos, subtareas y microtareas

Los seis estados permitidos son exactamente: `TODO`, `EN CURSO`, `HECHO`, `A MEDIAS`, `BLOQUEADO` y
`DESCARTADO`. **`A MEDIAS` es legítimo; disfrazarlo de `HECHO` no.**

### H1 — Corte, baseline y capturas previas

**Prioridad:** `BLOQUEANTE`

**CA:** Dado tu entorno, cuando alguien pregunta contra qué versión trabajaste, cómo se veía la pantalla
de inicio y cuál es «el panel de abajo», entonces hay SHA, capturas con los bloques nombrados y una
pregunta elevada con captura — no un recuerdo.
**DoD:** salidas en `evidencia/antes/`; capturas anotadas; Q-13 en el daily de equipo.
**Estado:** TODO

#### H1.S1 — Corte y baseline

**CA:** Dado un rojo posterior, cuando alguien pregunta si lo rompiste vos, entonces la respuesta sale de un archivo.
**DoD:** salidas con su código de salida, pegadas; cada rojo previo clasificado.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H1.S1.M1 | Fijar corte y rama | Hay SHA y rama en `PLAN.md` | `git fetch origin && git rev-parse origin/mockup && git branch --show-current` | TODO |
| H1.S1.M2 | Baseline de `lint` y `typecheck` | Hay salida y exit code | `yarn lint; echo "exit=$?"; yarn typecheck; echo "exit=$?"` → `evidencia/antes/` | TODO |
| H1.S1.M3 | Baseline de `test` | Hay conteo de fallos previos | `yarn test --watch=false` → `evidencia/antes/test.txt` | TODO |
| H1.S1.M4 | Clasificar cada rojo previo | Cada uno con su clase de la regla 80.4 | tabla en `PLAN.md` | TODO |

#### H1.S2 — Capturas, bloques y la pregunta

**CA:** Dada la pantalla de inicio del paciente, cuando alguien pregunte cómo se veía y cuál bloque se va,
entonces hay capturas con los cuatro bloques nombrados y la pregunta elevada.
**DoD:** las 5 microtareas en `HECHO`.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H1.S2.M1 | Capturar `/dashboard` con `paciente@` en 375/768/1440, claro y oscuro, miradas | Seis capturas con su línea | `evidencia/antes/capturas/` | TODO |
| H1.S2.M2 | Anotar sobre una captura los cuatro bloques con su nombre y su `data-testid` | Captura anotada | `evidencia/antes/bloques.png` | TODO |
| H1.S2.M3 | Elevar Q-13 en el daily de equipo con la captura anotada: «¿es la grilla de accesos?» | Pregunta publicada | sección en `Daily-Noche-2026-09-22.md` | TODO |
| H1.S2.M4 | Ejercitar el chequeo de hoy: tocar «Pecho», elegir «dolor de pecho», mirar la alarma; tocar «Panza», elegir un síntoma, mirar la recomendación | Dos recorridos con captura | `evidencia/antes/sintomas.md` | TODO |
| H1.S2.M5 | Revisar consola y red antes de tocar | Lista de errores previos, o «ninguno» | `evidencia/antes/consola-red.txt` | TODO |

### H2 — La silueta (P-01)

**Prioridad:** `ALTA`

**CA:** Dado el paciente, cuando toca una zona de la figura o la elige con Tab y Enter, entonces se abren
los síntomas de esa zona y, al elegir, aparece la especialidad recomendada; la figura se ve en claro y
oscuro y la zona elegida se distingue por relleno, trazo y texto — nunca sólo por color.
**DoD:** organismo con spec de tres niveles; integración con spec; capturas ×3 viewports ×2 temas;
borrador mostrado al doctor.
**Estado:** TODO

#### H2.S1 — El organismo `body-map`

**CA:** Dado `<app-body-map [zonas]="…" [(elegida)]="…">`, cuando se lo monta, entonces dibuja una silueta
neutra frontal con un `<path>` por zona anatómica, cada uno `role="button"` con `aria-label` y
`aria-pressed`, recorribles con Tab en un orden fijo y activables con Enter o Espacio; una zona que no
esté en `zonas` no se dibuja como elegible.
**DoD:** las 7 microtareas en `HECHO`.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H2.S1.M1 | `organisms/body-map/body-zones.geometry.ts`: `viewBox` y un `path` por zona anatómica (`cabeza`, `ojos`, `orl`, `pecho`, `panza`, `huesos` → brazos y piernas, `intima`), con el `id` igual al de `ZONAS_DEL_CUERPO`; el orden de tabulación escrito | Geometría en archivo aparte, sin lógica | `git ls-tree` muestra el archivo; comentario de cabecera dice de dónde salió el trazo | TODO |
| H2.S1.M2 | `body-map.ts` calcado de `department-map.ts`: `zonas = input.required<readonly ZonaElegible[]>()`, `elegida = model<string \| null>(null)`, sin conocer catálogos ni el motor | API mínima | `grep -n 'input.required\|model<' body-map.ts` | TODO |
| H2.S1.M3 | Accesibilidad: `<path role="button" tabindex="0" [attr.aria-label] [attr.aria-pressed]>`, Enter/Espacio, foco visible, y las tres señales para la elegida (relleno, trazo, nombre en un texto debajo) | Con `forced-colors` sigue distinguible | descripción + captura en escala de grises | TODO |
| H2.S1.M4 | Colores por tokens del sistema (regla 95.1.5), claro y oscuro | Cero literales de color | `git grep -n -E '#[0-9a-fA-F]{3,6}' -- src/app/shared/components/organisms/body-map` → 0 | TODO |
| H2.S1.M5 | Si hay transición al elegir: `prefers-reduced-motion` la anula | Observado con la preferencia activa | captura/descripción | TODO |
| H2.S1.M6 | Spec de tres niveles: correcto (clic y teclado emiten), límite (elegir la ya elegida la deselecciona o no — decidido y escrito; lista vacía), inválido (`elegida` con un id que no está → nada resaltado, sin error) | Verde | `npx ng test --include=src/app/shared/components/organisms/body-map/body-map.spec.ts --watch=false` | TODO |
| H2.S1.M7 | `yarn stock:generate` sigue idéntico salvo la entrada nueva; la vitrina lo monta sin props adivinadas | Sin romper el arranque | salida pegada | TODO |

#### H2.S2 — Integración con el chequeo de síntomas

**CA:** Dado `symptom-check`, cuando se toca una zona en la silueta, entonces es lo mismo que tocar su
pastilla (`alternarZona`): se abren sus síntomas, y al elegir uno aparece la recomendación de siempre; las
pastillas siguen para teclado y para las tres zonas que no son partes del cuerpo.
**DoD:** las 7 microtareas en `HECHO`.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H2.S2.M1 | Montar `<app-body-map>` en `symptom-check.html` arriba de las pastillas, con `zonas` derivadas de `ZONAS_DEL_CUERPO` (sólo las anatómicas) y `elegida` ligada a `zonaAbierta` | Se ve y responde | captura | TODO |
| H2.S2.M2 | Tocar una zona de la figura = `alternarZona(zona)`; tocar la pastilla resalta la figura | Dos caminos, un estado | spec | TODO |
| H2.S2.M3 | Las pastillas se conservan (equivalente por teclado; `piel`, `animo`, `general` sólo ahí) | Observado | captura | TODO |
| H2.S2.M4 | La recomendación aparece al elegir síntomas exactamente como antes; **`sintomas.datos.ts` y `motor.ts` sin cambios** | Diff vacío en los dos | `git diff --stat -- src/app/features/symptom-check/sintomas.datos.ts src/app/features/symptom-check/motor.ts` → vacío | TODO |
| H2.S2.M5 | Borrador de la silueta mostrado al doctor / Pablo (captura en el daily de equipo) antes de pulir (Q-11) | Publicado | sección en `Daily-Noche-2026-09-22.md` | TODO |
| H2.S2.M6 | Spec de `symptom-check`: zona por figura abre síntomas; alarma sigue funcionando | Verde | `npx ng test --include=src/app/features/symptom-check/*.spec.ts --watch=false` | TODO |
| H2.S2.M7 | Capturas ×3 viewports ×2 temas, miradas; a 375 px la figura no desborda | 6 con su línea; `scrollWidth` ≤ `clientWidth` | `evidencia/h2/capturas/` | TODO |

### H3 — Texto visible, dictado por voz, y el panel sobrante (P-02, P-03)

**Prioridad:** `ALTA`

**CA:** Dado el paciente, cuando llega a la pantalla, entonces el área de texto está visible como panel;
en Chromium hay «Dictar» (ícono + texto) que vuelca lo dicho al texto, con estados accionables y el aviso de
privacidad; sin soporte el botón no aparece; y el panel de abajo no está, tras confirmar cuál era.
**DoD:** specs con doble del reconocedor; prueba real en Chromium con captura; `mi-salud__accesos` retirado
tras la confirmación.
**Estado:** TODO

#### H3.S1 — El área de texto como panel

**CA:** Dada la pantalla, cuando se abre, entonces el área de texto se ve sin desplegar nada, con su rótulo.
**DoD:** las 3 microtareas en `HECHO`.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H3.S1.M1 | Quitar el `<details>`/`<summary>` (L191-203): panel visible con rótulo «Contanos con tus palabras» y el `app-textarea` como está | Visible sin clic | captura | TODO |
| H3.S1.M2 | Spec: el área existe y escribe en `texto()` | Verde | comando de spec | TODO |
| H3.S1.M3 | Captura ×2 viewports | Miradas | `evidencia/h3/capturas/` | TODO |

#### H3.S2 — Dictar

**CA:** Dado Chromium con micrófono, cuando se pulsa «Dictar», entonces se pide permiso (con aviso previo),
se muestra «Escuchando…» y lo reconocido aparece en el texto; sin soporte el botón no existe; sin permiso o
sin resultado el estado dice qué hacer; nada de lo dictado sale a consola, logs ni a un servicio no declarado.
**DoD:** las 8 microtareas en `HECHO`.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H3.S2.M1 | Servicio `Dictado` en `features/symptom-check/` sobre `SpeechRecognition`/`webkitSpeechRecognition`, con `isPlatformBrowser` y detección de soporte (`soportado` signal); `lang` `es-BO` o el que el navegador acepte, escrito | Sin `window` en SSR | spec con `PLATFORM_ID` servidor | TODO |
| H3.S2.M2 | Botón «Dictar» (ícono del set + texto, D-05) que sólo aparece con soporte; al escuchar pasa a «Detener» | Observado en Chromium; ausente en Firefox | captura ×2 navegadores | TODO |
| H3.S2.M3 | Resultados intermedios y finales se vuelcan en `escribir()` sin pisar lo tipeado (se agrega al final) | Observado | spec + captura | TODO |
| H3.S2.M4 | Estados accionables: sin permiso («Activá el micrófono en el navegador o escribí»), sin resultado («No te escuchamos, probá de nuevo»), error de red del reconocedor | Los tres observados o simulados con el doble | spec | TODO |
| H3.S2.M5 | Aviso de privacidad visible antes de pedir permiso: «Lo que dictás lo transcribe tu navegador; no lo guardamos» — y **cero `console.log` con el texto** | Aviso presente; grep limpio | `git grep -n 'console\.' -- src/app/features/symptom-check` → 0 | TODO |
| H3.S2.M6 | Spec con doble del reconocedor en tres niveles: resultado final (llega al texto), sin soporte (sin botón), error de permiso (estado accionable) | Verde | comando de spec | TODO |
| H3.S2.M7 | Prueba real en Chromium con captura, y la lista de navegadores probados en el reporte | Captura + lista | `evidencia/h3/dictado/` | TODO |
| H3.S2.M8 | El indicador «Escuchando…» respeta `prefers-reduced-motion` | Observado | descripción | TODO |

#### H3.S3 — El panel de abajo (P-03)

**CA:** Dada la confirmación de cuál es el bloque, cuando se lo retira, entonces la pantalla sigue
completa, specs y barrido siguen en verde; sin confirmación, el retiro queda preparado y `A MEDIAS`.
**DoD:** las 4 microtareas en `HECHO` o la cuarta `A MEDIAS` con la captura.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H3.S3.M1 | Tomar la respuesta de Q-13 del daily; si no llegó, el bloque es la grilla (supuesto declarado) y el retiro se hace en una rama aparte, listo para mergear | Respuesta o supuesto escrito | `PLAN.md` | TODO |
| H3.S3.M2 | Retirar `nav.mi-salud__accesos` (L231-258) y `accesos()` de `patient-home.ts` (L152-185) si nada más lo usa | Sin código muerto | `git grep -n 'mi-salud__accesos\|accesos()' -- src/app` → 0 | TODO |
| H3.S3.M3 | Actualizar specs y barrido que buscan `mi-salud-acceso` **sin debilitar lo demás** | Verde | comandos de spec + barrido | TODO |
| H3.S3.M4 | Captura ×3 viewports ×2 temas de la pantalla final | Miradas | `evidencia/h3/capturas/` | TODO |

### H4 — El modal de confirmación de cambios (D-08)

**Prioridad:** `BLOQUEANTE` para Pablo e Itzan

**CA:** Dado cualquier «Guardar» de la casa, cuando llama a `confirmarCambios()`, entonces aparece
«¿Confirmás estos cambios?» con el foco adentro y, al cancelar, el foco vuelve al botón Guardar; y «Cancelar
con cambios» sobre un `content-dialog` pregunta si se descartan; apilar un `confirm` sobre un
`content-dialog` abierto funciona y devuelve el foco.
**DoD:** pieza publicada en el daily de equipo antes de la mitad del turno; spec de tres niveles; prueba
de apilamiento con captura.
**Estado:** TODO

#### H4.S1 — La pieza y la receta

**CA:** Dado `DialogService`, cuando se llama a `confirmarCambios()` sin argumentos, entonces usa los
textos por omisión del ADR-0015; con argumentos, los sobreescribe; y `content-dialog` documenta en su
cabecera cómo se compone con `dismissAttempt`.
**DoD:** las 7 microtareas en `HECHO`.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H4.S1.M1 | `confirmarCambios(opciones?)` en `dialog-service.ts` sobre `confirm()`, con textos por omisión: título «¿Confirmás estos cambios?», mensaje corto, «Confirmar» / «Seguir editando» | Existe y devuelve `Promise<boolean>` | spec | TODO |
| H4.S1.M2 | `confirmarDescarte(opciones?)` para el camino de `dismissAttempt`: «¿Descartás lo que escribiste?», «Descartar» / «Seguir editando» | Existe | spec | TODO |
| H4.S1.M3 | Receta en la cabecera de `content-dialog.ts`: Guardar → `confirmarCambios` → cerrar; Cancelar/`Escape` con cambios → `dismissAttempt` → `confirmarDescarte`; sin cambios → cierra | Ejemplo de 10 líneas en el comentario | `grep -n 'confirmarCambios' content-dialog.ts` | TODO |
| H4.S1.M4 | Foco: al cancelar la confirmación vuelve al botón que la disparó; al confirmar, el diálogo cierra y el foco vuelve al disparador original (L257 ya lo hace: verificar que sigue) | Observado | descripción + captura | TODO |
| H4.S1.M5 | Spec de tres niveles: confirma (true), cancela (false, foco de vuelta), `Escape` sobre la confirmación (false) | Verde | `npx ng test --include=src/app/shared/components/molecules/dialog/*.spec.ts --watch=false` | TODO |
| H4.S1.M6 | **Prueba de apilamiento**: `confirm` (`<dialog>` `showModal`) sobre un `content-dialog` abierto, en Chromium y Firefox: se ve encima, atrapa el foco, al cerrar vuelve al de abajo | Observado en los dos | `evidencia/h4/apilamiento/` con capturas | TODO |
| H4.S1.M7 | Publicar en el daily de equipo con el ejemplo de uso y el resultado de M6 | Pablo e Itzan lo pueden usar | sección en `Daily-Noche-2026-09-22.md` | TODO |

#### H4.S2 — D-05 en el diálogo

**CA:** Dado el botón de cerrar de `content-dialog`, cuando se lo revisa, entonces es la excepción del
ADR-0012 §3 con `aria-label` **y** globo, escrita al lado; y todo botón de la confirmación lleva texto.
**DoD:** las 2 microtareas en `HECHO`.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H4.S2.M1 | Veredicto del cerrar de `content-dialog` (`closeLabel`) y aplicar globo si falta | Excepción escrita | `git grep -n 'iconOnly\|appTooltip' -- src/app/shared/components/organisms/content-dialog` | TODO |
| H4.S2.M2 | Los botones de `confirmarCambios`/`confirmarDescarte` llevan texto (ya lo hace `confirm`) | Observado | captura | TODO |

### H5 — Regresión y D-05 declarado

**Prioridad:** `ALTA`

**CA:** Dado tu cambio, cuando corrés los comandos del baseline y el barrido, entonces ningún rojo es
nuevo; y está dicho, medido, cuántos `iconOnly` hay en tus archivos.
**DoD:** salidas comparadas; barrido `--workers=1`; conteo.
**Estado:** TODO

#### H5.S1 — Regresión

**CA:** Dado el baseline, cuando se repite, entonces coincide o la diferencia está explicada.
**DoD:** las 5 microtareas en `HECHO`.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H5.S1.M1 | `lint` y `typecheck` | Sin rojos nuevos | diff contra `evidencia/antes/` | TODO |
| H5.S1.M2 | `test` completo | Sin rojos nuevos | diff contra baseline | TODO |
| H5.S1.M3 | El simulador entero con cada cuenta | Nada lanza ni devuelve 500 | `npx ng test --include=src/app/core/mock/mock-backend.spec.ts --watch=false` | TODO |
| H5.S1.M4 | Barrido de pantallas, serial | Ninguna ruta rompe | `E2E_BASE_URL=http://localhost:4200 npx playwright test playwright/mockup-barrido.spec.ts --workers=1` | TODO |
| H5.S1.M5 | Barrido de clics sobre `/dashboard` del paciente y `/search/symptoms` | Sin excepciones ni 5xx | `… playwright/mockup-click-sweep.spec.ts --workers=1` | TODO |

#### H5.S2 — D-05 en tus archivos

**CA:** Dado el inventario de Pablo, cuando se filtra por tus archivos, entonces el conteo está pegado y
cada botón nuevo lleva ícono + texto.
**DoD:** las 2 microtareas en `HECHO`.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H5.S2.M1 | Medir `iconOnly` en `symptom-check`, `patient-home`, `body-map`, `content-dialog`, `dialog` | Conteo pegado | `git grep -c iconOnly -- <rutas>` | TODO |
| H5.S2.M2 | Todo botón nuevo («Dictar», «Detener») con ícono + texto | Observado | captura | TODO |

### H6 — Cierre

**Prioridad:** `ALTA`

**CA:** Dado el cierre, cuando alguien que no vio tu turno lee el reporte, entonces sabe qué quedó
demostrado, qué quedó a medias con las cuatro respuestas, en qué navegadores se probó la voz y qué no se cubrió.
**DoD:** `REPORTE.md` con sus tres secciones y el avance arriba.
**Estado:** TODO

#### H6.S1 — Cierre honesto

**CA:** Dado el reporte, cuando se lee la primera línea, entonces está el avance calculado.
**DoD:** las 5 microtareas en `HECHO`.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H6.S1.M1 | Capturas finales por viewport y tema, miradas | Con su línea | `evidencia/h6/` | TODO |
| H6.S1.M2 | Teclado completo: silueta (Tab/Enter), dictado (Tab al botón, activar, detener), confirmación (foco adentro y de vuelta) | Descripción por paso | `evidencia/h6/teclado.md` | TODO |
| H6.S1.M3 | Declarar navegadores probados para la voz, y que nada de lo dictado se registró | Lista + afirmación con el grep | sección en `REPORTE.md` | TODO |
| H6.S1.M4 | Declarar el peldaño por área (regla 30) | Hay peldaño por área | sección en `REPORTE.md` | TODO |
| H6.S1.M5 | Escribir `REPORTE.md` con el avance primero y enumerar procesos que quedaron corriendo | `head -3` muestra el avance | `head -3 REPORTE.md` | TODO |

## 5. Ambigüedades registradas

| ID | Ambigüedad | Supuesto con el que trabajás | Quién puede resolverla | Qué bloquea |
|---|---|---|---|---|
| Q-11 | ¿La silueta reemplaza a las pastillas o convive? ¿Frente y dorso? ¿Neutra? | Convive; neutra y frontal; borrador mostrado antes de pulir | Doctor | H2.S2.M5 |
| Q-12 | «escrito a mano»: ¿tipeado o manuscrito? | Tipeado, panel visible; dictado por voz con el reconocedor del navegador | Doctor | H3.S1, H3.S2 |
| Q-13 | ¿Cuál es «el panel de abajo»? | La grilla de accesos; se confirma con captura antes de borrar | Doctor | H3.S3 |
| Q-7 | «cancelar… eliminar»: ¿Cancelar del modal o retirar la fila? | Las dos: `confirmarDescarte` para cancelar con cambios; `confirm` de retiro ya existe | Doctor | H4.S1.M2 |
| Q-M1 | `SpeechRecognition` manda audio al proveedor del navegador: ¿es aceptable para síntomas (PHI)? | Se declara en pantalla y en el reporte; no se usa ningún otro servicio; la decisión final es de negocio | Negocio + Pablo | H3.S2.M5 |
| Q-M2 | ¿`lang` del reconocedor? | `es-BO` si el navegador lo acepta; si no, `es`; escrito en el servicio | Pablo | H3.S2.M1 |
| Q-M3 | ¿Elegir la zona ya elegida la deselecciona? | Sí, como `alternarZona`; escrito en el spec | Doctor | H2.S1.M6 |

## 6. Definition of Done del hito

- [ ] Todas sus microtareas en `HECHO`, o en `A MEDIAS`/`BLOQUEADO`/`DESCARTADO` **con las cuatro respuestas**.
- [ ] La salida literal del comando de cada DoD está en `evidencia/`, no parafraseada.
- [ ] `yarn lint`, `yarn typecheck` y `yarn test --watch=false` sin rojos **nuevos** respecto del baseline.
- [ ] **`sintomas.datos.ts` y `motor.ts` sin cambios** (diff vacío pegado).
- [ ] La silueta cumple 95.4: `role="button"`, teclado, `aria-pressed`, foco visible, nada sólo por color, tokens.
- [ ] Nada de lo dictado sale a consola, logs, analytics ni a un servicio no declarado (regla 90.2); el aviso está en pantalla.
- [ ] `confirmarCambios`/`confirmarDescarte` son opt-in: los 26 consumidores de `confirm` y los 29 de `content-dialog` no cambian.
- [ ] La prueba de apilamiento está hecha en dos navegadores con captura.
- [ ] Capturas por viewport y tema, **miradas**, con una línea cada una.
- [ ] Peldaño de evidencia declarado por área (regla 30).
- [ ] Sin datos de personas en logs, capturas, plan ni reporte: sólo `paciente@alovida.mock`.
- [ ] El `PLAN.md` está actualizado en el momento, no al final.

## 7. Cómo cerrás el turno

1. **Checkpoint** en cada apertura y cierre de microtarea. Prohibido encadenar más de tres operaciones
   materiales sin uno.
2. **`REPORTE.md`** con el avance en la **primera línea**: `> **AVANCE: <HECHO> / 59 — <%>.**`
3. **Las tres secciones obligatorias existen siempre.** Una vacía se escribe con «ninguna».
4. **Publicá H4 apenas esté**, aunque el resto quede a medias: dos personas dependen de eso.
5. **Q-13 sin respuesta** no es `BLOQUEADO`: el retiro queda preparado en rama y `A MEDIAS` con la captura.
6. **Tu carril del 21/09** (`Refactor-DialogosYAdjuntos`) queda `A MEDIAS` declarado en su propio reporte.
7. **Enumerá qué quedó corriendo** y cerralo.
8. **Tu daily** es `Marcelo-Daily-Noche-2026-09-22.md`, en la carpeta de arriba.

## 8. Revisión adversarial antes de cerrar

1. ¿Tocaste `sintomas.datos.ts` o `motor.ts` «para que la zona nueva tenga síntomas»?
2. ¿La silueta se puede usar sin ratón, de punta a punta?
3. ¿Hay algún `console.log`, evento de analytics o petición con el texto dictado?
4. ¿El botón «Dictar» aparece en un navegador donde después falla?
5. ¿Borraste la grilla sin la confirmación de Q-13?
6. ¿`confirmarCambios` cambió el comportamiento de algún `confirm` existente?
7. ¿Probaste el apilamiento, o supusiste que `showModal` sobre `showModal` funciona?
8. ¿La zona elegida se distingue en escala de grises?
9. ¿Se declara verificado algo que sólo fue inspeccionado estáticamente?
10. ¿El organismo nuevo sabe algo de catálogos o del motor que no debería saber?
