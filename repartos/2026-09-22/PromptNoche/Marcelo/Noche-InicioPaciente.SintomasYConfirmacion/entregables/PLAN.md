# Plan — Carril de Marcelo, ejecutado por Pablo: silueta, dictado y confirmación (noche 2026-09-22)

- Fecha: 2026-09-22 (turno noche; ejecución iniciada el 2026-09-23 00:xx) · Repos afectados: `alovida/mantra-core-health`
  (rama `pablo/inicio-paciente-silueta-voz-y-confirmacion`, worktree `../alovida/mch-marcelo-inicio-paciente`) y
  `AlovidaPromptManager` (este carril: plan, reporte, evidencia, dailies) · Predecesor:
  [`docs/trabajo/2026-09-22-plan-y-reparto-correcciones-doctor-y-paciente/`](../../../../../docs/trabajo/2026-09-22-plan-y-reparto-correcciones-doctor-y-paciente/)
- Encargo: [`SiluetaDelCuerpoVozYModalDeConfirmacion.md`](./SiluetaDelCuerpoVozYModalDeConfirmacion.md) · Plan de ejecución
  aprobado por Pablo: `~/.claude/plans/necesito-que-en-base-staged-pnueli.md`
- Corte: `origin/mockup` @ **`b655e8449abd662d6b24156fd6e2b06aeb120cc1`** (reconsultado al abrir el worktree; ver H1.S1.M1)
- Resultado observable: el paciente (`paciente@alovida.mock`) ve en `/dashboard` una silueta del cuerpo que responde a clic
  y a teclado y abre los síntomas de la zona; el área de texto está visible como panel y en Chromium hay «Dictar» con
  ícono y texto; el panel sobrante no está (tras confirmar cuál); y `DialogService.confirmarCambios()` /
  `confirmarDescarte()` existen para que Pablo e Itzan los usen en cada «Guardar».
- Kill-test: el del prompt (§2): sin figura humana en `/dashboard`, o sin `zona-abierta` al tocar el pecho, o sin Tab/Enter,
  o área de texto plegada, o sin «Dictar» en Chromium, o sin «¿Confirmás estos cambios?» al llamar a la pieza — no está hecho.

## 0. Antes de escribir — instalación OBLIGATORIA del estándar

Entrada por `skills-router` antes de tocar código, desde `AlovidaPromptManager` (Q-X2: el worktree del
producto no copia `.claude/`). Verificado con:

    python .claude/hooks/plan_gate.py --self-test

Salida: 11 PASS, 0 FAIL (misma sesión que abrió este carril).

## Alcance

- IN: lo del §3 del prompt. Todo el código va a la rama del worktree; los artefactos, a esta carpeta.
- **OUT:** lo del §3 del prompt. Además: no se copia `.claude/` del estándar al worktree (el producto versiona
  `.claude/skills/`; la sección 1 se cumple desde `AlovidaPromptManager` y se declara); no se toca `features/alovida/**`;
  no se instala ningún navegador nuevo de Playwright sin autorización de Pablo.
- Ambigüedades registradas: las del §5 del prompt (abajo) más las de este plan de ejecución:

| ID | Ambigüedad | Supuesto tomado | A quién confirmar |
|---|---|---|---|
| Q-X1 | El prompt nombra el `model` de la silueta `elegida`; el molde `department-map` lo llama `value` | Se copia el molde: `value` (regla 00 §1.4: coherencia con el patrón presente) | Pablo — decisión de rutina |
| Q-X2 | La sección 1.1 manda copiar `.claude/` dentro del checkout | No se copia: el producto versiona `.claude/skills/` y se ensuciaría con 176 skills. El estándar está cargado en esta sesión; los tres comandos se corren y pegan desde `AlovidaPromptManager` | Pablo |
| Q-X3 | Rama `marcelo/…` o `pablo/…` | `pablo/…`: el autor de git es Pablo y ejecuta el carril de Marcelo; se declara en el daily de equipo para que Marcelo no lo tome en paralelo | Pablo |
| Q-X4 | Firefox para el apilamiento y el dictado | Sólo si el binario de Playwright ya está instalado; si no, «no cubierto» declarado | Pablo |


## Rojos previos del baseline (H1.S1.M4, regla 80.4)

| Comando | Exit | Rojos | Clase | Detalle |
|---|---|---|---|---|
| `yarn lint` | 1 | 244 | `TEST_BUG`/deuda previa, **fuera de alcance** | Una sola regla: `@angular-eslint/prefer-on-push-component-change-detection`. En mi alcance sólo `content-dialog.spec.ts` (host de prueba sin OnPush). No se arregla de paso (regla 00 §3.2); mi criterio de cierre es «sin rojos **nuevos**» |
| `yarn typecheck` (checkout limpio) | 2 | 4 | `ENVIRONMENT` | `env.generated.ts` y el índice del catálogo no existen hasta correr `env:generate`/`stock:generate` (que `yarn start` corre solo). Tras generarlos: **exit 0** (`evidencia/antes/typecheck-tras-generar.txt`) |
| `yarn stock:generate` ×2 | 0 | — | — | diff vacío (`evidencia/antes/generadores.txt`) |
| `yarn test --watch=false` | 0 | 0 | — | 571 archivos · 7102 tests en verde · 1 min 27 s (`evidencia/antes/test.txt`) |

## Desvíos y hallazgos de H1

- **H1.S2.M2**: el DoD pedía `evidencia/antes/bloques.png` (captura anotada). Se entregó `bloques.md` —los cuatro bloques con su
  selector, su `data-testid` y lo que muestran— más las capturas sin anotar: el árbol de accesibilidad los identifica sin ambigüedad
  y una imagen editada a mano no aportaba más. Registrado, no escondido.
- **HALL-M1** (`evidencia/antes/HALL-M1-roles-cambian-en-caliente.md`): a los ~20 min de sesión quieta, `/dashboard` pasó a
  mostrar el panel genérico y el menú perdió los renglones de `PATIENT`. Refresh del token refutado como causa (vida 8 h).
  Fuera de alcance: queda para el dueño del simulador. Consecuencia práctica: capturar apenas se entra.
- **HALL-M2** (fuera de alcance, no se toca): `SymptomCheck` importa `Card` y `RouterLink` sin usarlos en su template ya en el
  corte `b655e844` (`app-card` y `routerLink` no aparecen en `symptom-check.html` del corte). El servidor de desarrollo lo avisa
  como NG8113 al recompilar. No es de este carril (regla 00 §3.2): se anota para quien sea dueño del módulo. Mis imports
  nuevos (`BodyMap`, `FormField`) sí se usan.
- **Reload al cambiar imports**: el servidor manda «Page reload» cuando cambia la lista de `imports` del componente; la
  sesión vive en memoria (ADR-0006), así que cada reload exige volver a entrar con la cuenta sintética antes de capturar.
- **HALL-M3 (ENVIRONMENT, reproducido)**: tras una «Component update» de HMR (la de `body-map`, 05:30), el navegador carga
  `SymptomCheck` desde `@ng/component?c=…symptom-check.ts@SymptomCheck&t=1790142401988` y ese endpoint sigue devolviendo la
  versión de esa marca de tiempo aunque el chunk servido (`chunk-H5GQXN6D.js`) ya trae el panel nuevo: con recarga completa y
  caché deshabilitada por CDP el `ɵcmp.consts` del componente en ejecución seguía siendo el viejo (`<details>`). Verificado
  con `fetch('/chunk-H5GQXN6D.js', {cache: 'reload'})` (nuevo) contra `fetch('@ng/component?…')` (viejo). Sin service
  worker (`getRegistrations()` → []). Salida: reiniciar `yarn dev`. Es del servidor de desarrollo de Angular, no del producto;
  se anota para el equipo: **tras una actualización HMR de componente, reiniciar el servidor antes de capturar un cambio de template**.
- **HALL-M4 (PRODUCT, fuera de mi alcance, DECISION_REQUIRED)**: el servidor SSR de la app manda
  `Permissions-Policy: camera=(), microphone=(), geolocation=(self)` (`src/server/security-headers.ts:268`, fijado por
  `src/server/security-headers.spec.ts:194-195`). Con `microphone=()` el documento no puede capturar audio aunque la persona
  conceda el permiso: Chrome avisa «AudioCapture permission has been blocked because of a permissions policy» y el reconocedor
  devuelve `not-allowed`. Verificado con `curl -sI http://localhost:4200/dashboard` y con `grantPermissions(['microphone'])`
  → `granted` y aun así el mismo error (`evidencia/h3/dictado/mediciones-chromium.json`). Consecuencia: **el dictado (P-02)
  y el `Grabador` de notas de voz de mensajería, que ya existía, no pueden funcionar mientras la política siga así.** No se toca
  desde este carril (`src/server/**` no está en mi reserva y es una cabecera de seguridad): se eleva a Pablo como decisión
  (`microphone=(self)`, con su spec actualizado como requisito nuevo, no debilitado). El componente queda correcto para cuando
  la política lo permita: el estado «sin permiso» es exactamente lo que se muestra hoy.
  **Decisión de Pablo (2026-09-23, en sesión): abrir `microphone=(self)` en este carril → microtarea H3.S2.M9.** La cámara sigue cerrada.
- **HALL-M6 (PRE-EXISTENTE, fuera de mi alcance, sin dueño claro)**: `mockup-click-sweep.spec.ts` (regla `--workers=1`)
  falla para el rol **Médica** en las dos corridas (antes y después del rebase): 85 botones sin responder al clic en 4000ms
  pre-rebase, 67 post-rebase, en rutas ajenas a mi carril (`/messaging`, `/groups`, `/glossary`, `/settings`,
  `/notification-center`, `/administration/pharmacy-orders`, `/administration/pharmacy-profile`, `/my-account/edit`,
  `/my-account/identity`, `/my-account/access-requests`). 10 de esas rutas se repiten en ambas corridas: no es ruido de
  máquina, es un estado ya presente en `origin/mockup` antes de que mi rama lo tocara (cero superposición con mis
  archivos). **El rol Paciente y el rol Visitador pasaron limpios en las dos corridas** — es lo que importa para este
  carril. El rol Admin falló una sola vez, post-rebase, con un síntoma distinto (`Execution context was destroyed,
  most likely because of a navigation`, no una lista de botones rotos): no se reprodujo una segunda vez, se anota sin
  clasificar. No corrijo ninguno de los dos: fuera de mi reserva y de escala de una sola noche. Elevado al equipo con
  la lista completa en `evidencia/h5/mockup-click-sweep-tras-rebase.txt`.
- **HALL-M5 (TEST_BUG ajeno, no corregido — fuera de mi reserva)**: `shell-layout.spec.ts` (2 tests) queda en rojo tras el
  rebase sobre `origin/mockup`. Causa raíz reproducida y demostrada: el PR de Justin (`b3af9887 feat: expose patient
  quotations in account navigation`, ya mergeado en `origin/mockup` antes de mi rebase, PR #577/#579) agregó
  `/my-account/cotizaciones` al menú del paciente, pero `shell-layout.spec.ts:147` sigue afirmando la lista EXACTA de rutas
  sin ese elemento (`toEqual([...])`) y el test de agrupación de L449 depende de la misma lista. Verificado en aislamiento
  (`npx ng test --include=shell-layout.spec.ts` → 2/2 en rojo, reproducible, no es OOM). Cero superposición con mis archivos
  (`comm -12` de la reserva dio vacío); el fallo ya estaba en `origin/mockup` antes de que mi rama lo tocara — no lo causé
  ni lo agravé. No lo arreglo: `shell-layout.ts`/`.spec.ts` no están en mi reserva (regla 00 §3.2). Elevado a Justin/equipo
  en el daily §4-bis.
- **Sección 1.1**: no se copió `.claude/` al worktree (Q-X2); los tres comandos se corrieron desde `AlovidaPromptManager`.
- El `start` de `mockup` es el SSR construido; la maqueta se levanta con `yarn dev` (`evidencia/antes/servidor.txt`).

## Estado por hito — se actualiza al abrir y cerrar cada microtarea (regla 50 §4)

Los seis estados: `TODO`, `EN CURSO`, `HECHO`, `A MEDIAS`, `BLOQUEADO`, `DESCARTADO`. Orden de ejecución:
**H1 → H4 → H2 → H3 → H5 → H6**.


Los seis estados permitidos son exactamente: `TODO`, `EN CURSO`, `HECHO`, `A MEDIAS`, `BLOQUEADO` y
`DESCARTADO`. **`A MEDIAS` es legítimo; disfrazarlo de `HECHO` no.**

### H1 — Corte, baseline y capturas previas

**Prioridad:** `BLOQUEANTE`

**CA:** Dado tu entorno, cuando alguien pregunta contra qué versión trabajaste, cómo se veía la pantalla
de inicio y cuál es «el panel de abajo», entonces hay SHA, capturas con los bloques nombrados y una
pregunta elevada con captura — no un recuerdo.
**DoD:** salidas en `evidencia/antes/`; capturas anotadas; Q-13 en el daily de equipo.
**Estado:** HECHO

#### H1.S1 — Corte y baseline

**CA:** Dado un rojo posterior, cuando alguien pregunta si lo rompiste vos, entonces la respuesta sale de un archivo.
**DoD:** salidas con su código de salida, pegadas; cada rojo previo clasificado.
**Estado:** HECHO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H1.S1.M1 | Fijar corte y rama | Hay SHA y rama en `PLAN.md` | `git fetch origin && git rev-parse origin/mockup && git branch --show-current` | HECHO |
| H1.S1.M2 | Baseline de `lint` y `typecheck` | Hay salida y exit code | `yarn lint; echo "exit=$?"; yarn typecheck; echo "exit=$?"` → `evidencia/antes/` | HECHO |
| H1.S1.M3 | Baseline de `test` | Hay conteo de fallos previos | `yarn test --watch=false` → `evidencia/antes/test.txt` | HECHO |
| H1.S1.M4 | Clasificar cada rojo previo | Cada uno con su clase de la regla 80.4 | tabla en `PLAN.md` | HECHO |

#### H1.S2 — Capturas, bloques y la pregunta

**CA:** Dada la pantalla de inicio del paciente, cuando alguien pregunte cómo se veía y cuál bloque se va,
entonces hay capturas con los cuatro bloques nombrados y la pregunta elevada.
**DoD:** las 5 microtareas en `HECHO`.
**Estado:** HECHO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H1.S2.M1 | Capturar `/dashboard` con `paciente@` en 375/768/1440, claro y oscuro, miradas | Seis capturas con su línea | `evidencia/antes/capturas/` | HECHO |
| H1.S2.M2 | Anotar sobre una captura los cuatro bloques con su nombre y su `data-testid` | Captura anotada | `evidencia/antes/bloques.png` | HECHO |
| H1.S2.M3 | Elevar Q-13 en el daily de equipo con la captura anotada: «¿es la grilla de accesos?» | Pregunta publicada | sección en `Daily-Noche-2026-09-22.md` | HECHO |
| H1.S2.M4 | Ejercitar el chequeo de hoy: tocar «Pecho», elegir «dolor de pecho», mirar la alarma; tocar «Panza», elegir un síntoma, mirar la recomendación | Dos recorridos con captura | `evidencia/antes/sintomas.md` | HECHO |
| H1.S2.M5 | Revisar consola y red antes de tocar | Lista de errores previos, o «ninguno» | `evidencia/antes/consola-red.txt` | HECHO |

### H2 — La silueta (P-01)

**Prioridad:** `ALTA`

**CA:** Dado el paciente, cuando toca una zona de la figura o la elige con Tab y Enter, entonces se abren
los síntomas de esa zona y, al elegir, aparece la especialidad recomendada; la figura se ve en claro y
oscuro y la zona elegida se distingue por relleno, trazo y texto — nunca sólo por color.
**DoD:** organismo con spec de tres niveles; integración con spec; capturas ×3 viewports ×2 temas;
borrador mostrado al doctor.
**Estado:** EN CURSO
(14/14 microtareas HECHO; el hito cierra con la regresión y los gates de H5.)

#### H2.S1 — El organismo `body-map`

**CA:** Dado `<app-body-map [zonas]="…" [(elegida)]="…">`, cuando se lo monta, entonces dibuja una silueta
neutra frontal con un `<path>` por zona anatómica, cada uno `role="button"` con `aria-label` y
`aria-pressed`, recorribles con Tab en un orden fijo y activables con Enter o Espacio; una zona que no
esté en `zonas` no se dibuja como elegible.
**DoD:** las 7 microtareas en `HECHO`.
**Estado:** HECHO
(7/7.)

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H2.S1.M1 | `organisms/body-map/body-zones.geometry.ts`: `viewBox` y un `path` por zona anatómica (`cabeza`, `ojos`, `orl`, `pecho`, `panza`, `huesos` → brazos y piernas, `intima`), con el `id` igual al de `ZONAS_DEL_CUERPO`; el orden de tabulación escrito | Geometría en archivo aparte, sin lógica | `git ls-tree` muestra el archivo; comentario de cabecera dice de dónde salió el trazo | HECHO |
| H2.S1.M2 | `body-map.ts` calcado de `department-map.ts`: `zonas = input.required<readonly ZonaElegible[]>()`, `elegida = model<string \| null>(null)`, sin conocer catálogos ni el motor | API mínima | `grep -n 'input.required\|model<' body-map.ts` | HECHO — desvío: `value` en vez de `elegida` (coherencia con `department-map`) |
| H2.S1.M3 | Accesibilidad: `<path role="button" tabindex="0" [attr.aria-label] [attr.aria-pressed]>`, Enter/Espacio, foco visible, y las tres señales para la elegida (relleno, trazo, nombre en un texto debajo) | Con `forced-colors` sigue distinguible | descripción + captura en escala de grises | HECHO — teclado (Tab en orden, Enter, Espacio sin scroll), trazo 6px con foco, tres señales; objetivos ≥ 24×24 tras rehacer la geometría; capturas 07/09 + mediciones.json |
| H2.S1.M4 | Colores por tokens del sistema (regla 95.1.5), claro y oscuro | Cero literales de color | `git grep -n -E '#[0-9a-fA-F]{3,6}' -- src/app/shared/components/organisms/body-map` → 0 | HECHO |
| H2.S1.M5 | Si hay transición al elegir: `prefers-reduced-motion` la anula | Observado con la preferencia activa | captura/descripción | HECHO — con reduce: transitionDuration 1e-05s (Chromium representa 0s así); sin: 0.12s |
| H2.S1.M6 | Spec de tres niveles: correcto (clic y teclado emiten), límite (elegir la ya elegida la deselecciona o no — decidido y escrito; lista vacía), inválido (`elegida` con un id que no está → nada resaltado, sin error) | Verde | `npx ng test --include=src/app/shared/components/organisms/body-map/body-map.spec.ts --watch=false` | HECHO — 13/13 |
| H2.S1.M7 | `yarn stock:generate` sigue idéntico salvo la entrada nueva; la vitrina lo monta sin props adivinadas | Sin romper el arranque | salida pegada | HECHO — md5 idéntico en dos corridas; `zonas` requerido, `problemas: []` |
#### H2.S2 — Integración con el chequeo de síntomas

**CA:** Dado `symptom-check`, cuando se toca una zona en la silueta, entonces es lo mismo que tocar su
pastilla (`alternarZona`): se abren sus síntomas, y al elegir uno aparece la recomendación de siempre; las
pastillas siguen para teclado y para las tres zonas que no son partes del cuerpo.
**DoD:** las 7 microtareas en `HECHO`.
**Estado:** HECHO
(7/7.)

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H2.S2.M1 | Montar `<app-body-map>` en `symptom-check.html` arriba de las pastillas, con `zonas` derivadas de `ZONAS_DEL_CUERPO` (sólo las anatómicas) y `elegida` ligada a `zonaAbierta` | Se ve y responde | captura | HECHO — capturas 01-06 |
| H2.S2.M2 | Tocar una zona de la figura = `alternarZona(zona)`; tocar la pastilla resalta la figura | Dos caminos, un estado | spec | HECHO — spec «la silueta» 5/5 (92/92 en la carpeta) |
| H2.S2.M3 | Las pastillas se conservan (equivalente por teclado; `piel`, `animo`, `general` sólo ahí) | Observado | captura | HECHO — 10 pastillas en todas las capturas; piel/animo/general sólo ahí (spec) |
| H2.S2.M4 | La recomendación aparece al elegir síntomas exactamente como antes; **`sintomas.datos.ts` y `motor.ts` sin cambios** | Diff vacío en los dos | `git diff --stat -- src/app/features/symptom-check/sintomas.datos.ts src/app/features/symptom-check/motor.ts` → vacío | HECHO — diff vacío en los dos |
| H2.S2.M5 | Borrador de la silueta mostrado al doctor / Pablo (captura en el daily de equipo) antes de pulir (Q-11) | Publicado | sección en `Daily-Noche-2026-09-22.md` | HECHO — publicado en el daily de equipo §4-bis con tres preguntas para el doctor (Q-11); la respuesta del doctor queda pendiente y no bloquea |
| H2.S2.M6 | Spec de `symptom-check`: zona por figura abre síntomas; alarma sigue funcionando | Verde | `npx ng test --include=src/app/features/symptom-check/*.spec.ts --watch=false` | HECHO — 92/92 |
| H2.S2.M7 | Capturas ×3 viewports ×2 temas, miradas; a 375 px la figura no desborda | 6 con su línea; `scrollWidth` ≤ `clientWidth` | `evidencia/h2/capturas/` | HECHO — capturas 01-06 miradas (LEEME.md); scrollWidth = clientWidth en 375/768/1440 |
#### H2.S3 — Rediseño de la silueta tras el rechazo visual

**Origen:** 2026-09-23, tras el cierre. Pablo, mirando la figura publicada: «El cuerpo humano está pésimo,
despreciable, totalmente feo». Diagnóstico propio sobre la geometría: ojos como un rectángulo tipo visor,
orejas como dos tabs rectangulares, torso-caja, brazos y piernas como cuadriláteros rectos sin manos ni pies.
Es trabajo no previsto: se agrega acá (regla 20.6.6) y reabre H2 (regla 30.4: el área vuelve a `WRITTEN`).

**CA:** Dada la pantalla de inicio del paciente, cuando se mira la figura, entonces se reconoce un cuerpo
humano de frente con contornos curvos (cabeza con mandíbula, ojos en antifaz, orejas redondeadas, cuello,
hombros, cintura, cadera, brazos con mano, piernas con pie), sin ningún rectángulo visible; y sigue siendo
el mismo control (mismas siete zonas, mismo orden de Tab, objetivos ≥ 24×24 px a 375 px).
**DoD:** las 4 microtareas en `HECHO`.
**Estado:** HECHO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H2.S3.M1 | Geometría nueva en `body-zones.geometry.ts`: sólo curvas en los contornos exteriores, mismas 7 zonas y mismo orden | Specs de `body-map` y `symptom-check` en verde sin tocarlos | `npx ng test --include=body-map.spec.ts --include=symptom-check.spec.ts --watch=false` | HECHO |
| H2.S3.M2 | Objetivos ≥ 24×24 px a 375 px, medidos en navegador | Cada zona con un área contigua ≥ 24×24 | `getBBox()` por zona × escala, pegado | HECHO |
| H2.S3.M3 | Capturas ×3 viewports ×2 temas + elegida + escala de grises, **miradas** | Se ve un cuerpo, no un maniquí de bloques | `evidencia/h2/capturas-v2/` con `LEEME.md` | HECHO |
| H2.S3.M4 | Commit a la rama del PR #582 y push | El PR muestra el commit | `git log origin/pablo/inicio-paciente-silueta-voz-y-confirmacion -1` | HECHO |
### H3 — Texto visible, dictado por voz, y el panel sobrante (P-02, P-03)

**Prioridad:** `ALTA`

**CA:** Dado el paciente, cuando llega a la pantalla, entonces el área de texto está visible como panel;
en Chromium hay «Dictar» (ícono + texto) que vuelca lo dicho al texto, con estados accionables y el aviso de
privacidad; sin soporte el botón no aparece; y el panel de abajo no está, tras confirmar cuál era.
**DoD:** specs con doble del reconocedor; prueba real en Chromium con captura; `mi-salud__accesos` retirado
tras la confirmación.
**Estado:** EN CURSO
(16/16 microtareas HECHO: S1 3, S2 9 con la M9 agregada, S3 4; el hito cierra con la regresión y los gates de H5.)

#### H3.S1 — El área de texto como panel

**CA:** Dada la pantalla, cuando se abre, entonces el área de texto se ve sin desplegar nada, con su rótulo.
**DoD:** las 3 microtareas en `HECHO`.
**Estado:** HECHO
(3/3.)

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H3.S1.M1 | Quitar el `<details>`/`<summary>` (L191-203): panel visible con rótulo «Contanos con tus palabras» y el `app-textarea` como está | Visible sin clic | captura | HECHO — `app-form-field` + `app-textarea`, sin `details`; visible a 375 y 1440 (capturas 01-02, mediciones-s1.json) |
| H3.S1.M2 | Spec: el área existe y escribe en `texto()` | Verde | comando de spec | HECHO — «el área de texto» 2/2 (94/94 en la carpeta); `details` ausente, `label[for]` apunta al textarea |
| H3.S1.M3 | Captura ×2 viewports | Miradas | `evidencia/h3/capturas/` | HECHO — 01 (375), 02 (1440), 03 (375 con texto reconocido), miradas; LEEME.md |
#### H3.S2 — Dictar

**CA:** Dado Chromium con micrófono, cuando se pulsa «Dictar», entonces se pide permiso (con aviso previo),
se muestra «Escuchando…» y lo reconocido aparece en el texto; sin soporte el botón no existe; sin permiso o
sin resultado el estado dice qué hacer; nada de lo dictado sale a consola, logs ni a un servicio no declarado.
**DoD:** las 8 microtareas en `HECHO`.
**Estado:** HECHO
(9/9; M9 agregada por decisión de Pablo.)

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H3.S2.M1 | Servicio `Dictado` en `features/symptom-check/` sobre `SpeechRecognition`/`webkitSpeechRecognition`, con `isPlatformBrowser` y detección de soporte (`soportado` signal); `lang` `es-BO` o el que el navegador acepte, escrito | Sin `window` en SSR | spec con `PLATFORM_ID` servidor | HECHO — `dictado.ts` + `dictado.types.ts` (desvío: `*.types.ts` en vez de `.d.ts`, patrón de la casa); token `RECONOCEDOR_DE_VOZ` con `isPlatformBrowser` → `null` en SSR; `lang` `es-BO`; `dictado.spec.ts` 16/16 |
| H3.S2.M2 | Botón «Dictar» (ícono del set + texto, D-05) que sólo aparece con soporte; al escuchar pasa a «Detener» | Observado en Chromium; ausente en Firefox | captura ×2 navegadores | HECHO — Chrome 153: botón «Dictar» con ícono + texto (`dictado/01`); Firefox 153: sin `SpeechRecognition`, sin botón, área de texto presente (`dictado/05`, `firefox.txt`) |
| H3.S2.M3 | Resultados intermedios y finales se vuelcan en `escribir()` sin pisar lo tipeado (se agrega al final) | Observado | spec + captura | HECHO — spec contra el doble (se agrega al final sin pisar) + observado en Chrome tras M9: una frase transcrita llegó al área y pasó por `escribir()` (audio ambiente real; contenido excluido de la evidencia por regla 90.2, ver `dictado/LEEME.md`) |
| H3.S2.M4 | Estados accionables: sin permiso («Activá el micrófono en el navegador o escribí»), sin resultado («No te escuchamos, probá de nuevo»), error de red del reconocedor | Los tres observados o simulados con el doble | spec | HECHO — los tres estados en spec (`it.each` 7 errores) y «sin permiso» observado en Chromium real (`evidencia/h3/dictado/02`) |
| H3.S2.M5 | Aviso de privacidad visible antes de pedir permiso: «Lo que dictás lo transcribe tu navegador; no lo guardamos» — y **cero `console.log` con el texto** | Aviso presente; grep limpio | `git grep -n 'console\.' -- src/app/features/symptom-check` → 0 | HECHO — aviso presente antes del botón (`aria-describedby`), observado; `git grep console\.` → 0 |
| H3.S2.M6 | Spec con doble del reconocedor en tres niveles: resultado final (llega al texto), sin soporte (sin botón), error de permiso (estado accionable) | Verde | comando de spec | HECHO — `dictado.spec.ts` 16/16 + `symptom-check.spec.ts` «dictar» 4/4 (114/114 en la carpeta) |
| H3.S2.M7 | Prueba real en Chromium con captura, y la lista de navegadores probados en el reporte | Captura + lista | `evidencia/h3/dictado/` | HECHO — Chrome 153 (MCP) y Firefox 153 (Playwright firefox-1538); capturas y `mediciones-chromium.json` en `evidencia/h3/dictado/`; lo no cubierto (transcripción real) declarado ahí |
| H3.S2.M8 | El indicador «Escuchando…» respeta `prefers-reduced-motion` | Observado | descripción | HECHO — con `reduce`: `animationDuration` 1e-05s (Chromium representa así `animation: none`); sin preferencia: 1.2s; medido en vivo mientras decía «Escuchando…» |
| H3.S2.M9 | **Agregada 2026-09-23 por decisión de Pablo (HALL-M4):** `Permissions-Policy` pasa a `camera=(), microphone=(self), geolocation=(self)` en `src/server/security-headers.ts`; su spec se actualiza como requisito nuevo (no se debilita) | Con permiso concedido, Chrome ya no avisa «blocked because of a permissions policy» y el reconocedor no devuelve `not-allowed` por política | `npx ng test --include=src/server/security-headers.spec.ts --watch=false` verde · `curl -sI localhost:4200/dashboard` muestra `microphone=(self)` · prueba real en Chromium | HECHO — `security-headers.spec.ts` 25/25 con la expectativa nueva; `curl -sI` → `microphone=(self)`; Chrome con permiso: sin warning, sin `onerror`, «Escuchando…» sostenido; docs/security actualizados (`dod-h3s2m9.txt`) |
#### H3.S3 — El panel de abajo (P-03)

**CA:** Dada la confirmación de cuál es el bloque, cuando se lo retira, entonces la pantalla sigue
completa, specs y barrido siguen en verde; sin confirmación, el retiro queda preparado y `A MEDIAS`.
**DoD:** las 4 microtareas en `HECHO` o la cuarta `A MEDIAS` con la captura.
**Estado:** HECHO
(4/4.)

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H3.S3.M1 | Tomar la respuesta de Q-13 del daily; si no llegó, el bloque es la grilla (supuesto declarado) y el retiro se hace en una rama aparte, listo para mergear | Respuesta o supuesto escrito | `PLAN.md` | HECHO — Q-13 respondida por Pablo en sesión (2026-09-23): «el panel de abajo» = la grilla «Ir a lo tuyo» (`nav.mi-salud__accesos`); registrado en el daily de equipo §4-bis |
| H3.S3.M2 | Retirar `nav.mi-salud__accesos` (L231-258) y `accesos()` de `patient-home.ts` (L152-185) si nada más lo usa | Sin código muerto | `git grep -n 'mi-salud__accesos\|accesos()' -- src/app` → 0 | HECHO — `nav`, `accesos`, `SECCIONES_DEL_PACIENTE`, `AccesoDelPaciente`, `navigation`, imports `NavigationService`/`NavIconName`/`Tooltip` y el bloque CSS retirados; `git grep` de `mi-salud__accesos|mi-salud-acceso` en src+playwright → 0 fuera del spec que afirma su ausencia (`dod-h3s3.txt`); los 22 del grep amplio son `accesos()` del árbol de la organización, ajeno |
| H3.S3.M3 | Actualizar specs y barrido que buscan `mi-salud-acceso` **sin debilitar lo demás** | Verde | comandos de spec + barrido | HECHO — `patient-home.spec.ts` 11/11 (el test pasa a afirmar que la grilla no volvió y que el enlace a turnos sigue); `alv-054` sin `patientOwnAccesses` y con título nuevo, typecheck+lint en 0. **No cubierto:** `alv-054` no se ejecuta contra la maqueta (da de alta pacientes por API real); el barrido de la maqueta se corre en H5 |
| H3.S3.M4 | Captura ×3 viewports ×2 temas de la pantalla final | Miradas | `evidencia/h3/capturas/` | HECHO — capturas 04-10 (3 viewports × 2 temas + página completa a 375), miradas; `mediciones-s3.json`; sin desborde |
### H4 — El modal de confirmación de cambios (D-08)

**Prioridad:** `BLOQUEANTE` para Pablo e Itzan

**CA:** Dado cualquier «Guardar» de la casa, cuando llama a `confirmarCambios()`, entonces aparece
«¿Confirmás estos cambios?» con el foco adentro y, al cancelar, el foco vuelve al botón Guardar; y «Cancelar
con cambios» sobre un `content-dialog` pregunta si se descartan; apilar un `confirm` sobre un
`content-dialog` abierto funciona y devuelve el foco.
**DoD:** pieza publicada en el daily de equipo antes de la mitad del turno; spec de tres niveles; prueba
de apilamiento con captura.
**Estado:** HECHO

#### H4.S1 — La pieza y la receta

**CA:** Dado `DialogService`, cuando se llama a `confirmarCambios()` sin argumentos, entonces usa los
textos por omisión del ADR-0015; con argumentos, los sobreescribe; y `content-dialog` documenta en su
cabecera cómo se compone con `dismissAttempt`.
**DoD:** las 7 microtareas en `HECHO`.
**Estado:** HECHO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H4.S1.M1 | `confirmarCambios(opciones?)` en `dialog-service.ts` sobre `confirm()`, con textos por omisión: título «¿Confirmás estos cambios?», mensaje corto, «Confirmar» / «Seguir editando» | Existe y devuelve `Promise<boolean>` | spec | HECHO |
| H4.S1.M2 | `confirmarDescarte(opciones?)` para el camino de `dismissAttempt`: «¿Descartás lo que escribiste?», «Descartar» / «Seguir editando» | Existe | spec | HECHO |
| H4.S1.M3 | Receta en la cabecera de `content-dialog.ts`: Guardar → `confirmarCambios` → cerrar; Cancelar/`Escape` con cambios → `dismissAttempt` → `confirmarDescarte`; sin cambios → cierra | Ejemplo de 10 líneas en el comentario | `grep -n 'confirmarCambios' content-dialog.ts` | HECHO |
| H4.S1.M4 | Foco: al cancelar la confirmación vuelve al botón que la disparó; al confirmar, el diálogo cierra y el foco vuelve al disparador original (L257 ya lo hace: verificar que sigue) | Observado | descripción + captura | HECHO |
| H4.S1.M5 | Spec de tres niveles: confirma (true), cancela (false, foco de vuelta), `Escape` sobre la confirmación (false) | Verde | `npx ng test --include=src/app/shared/components/molecules/dialog/*.spec.ts --watch=false` | HECHO |
| H4.S1.M6 | **Prueba de apilamiento**: `confirm` (`<dialog>` `showModal`) sobre un `content-dialog` abierto, en Chromium y Firefox: se ve encima, atrapa el foco, al cerrar vuelve al de abajo | Observado en los dos | `evidencia/h4/apilamiento/` con capturas | HECHO |
| H4.S1.M7 | Publicar en el daily de equipo con el ejemplo de uso y el resultado de M6 | Pablo e Itzan lo pueden usar | sección en `Daily-Noche-2026-09-22.md` | HECHO |

#### H4.S2 — D-05 en el diálogo

**CA:** Dado el botón de cerrar de `content-dialog`, cuando se lo revisa, entonces es la excepción del
ADR-0012 §3 con `aria-label` **y** globo, escrita al lado; y todo botón de la confirmación lleva texto.
**DoD:** las 2 microtareas en `HECHO`.
**Estado:** HECHO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H4.S2.M1 | Veredicto del cerrar de `content-dialog` (`closeLabel`) y aplicar globo si falta | Excepción escrita | `git grep -n 'iconOnly\|appTooltip' -- src/app/shared/components/organisms/content-dialog` | HECHO |
| H4.S2.M2 | Los botones de `confirmarCambios`/`confirmarDescarte` llevan texto (ya lo hace `confirm`) | Observado | captura | HECHO |

### H5 — Regresión y D-05 declarado

**Prioridad:** `ALTA`

**CA:** Dado tu cambio, cuando corrés los comandos del baseline y el barrido, entonces ningún rojo es
nuevo; y está dicho, medido, cuántos `iconOnly` hay en tus archivos.
**DoD:** salidas comparadas; barrido `--workers=1`; conteo.
**Estado:** HECHO
(7/7 microtareas HECHO: S1 5/5 con HALL-M6 resuelto en PR #587; S2 2/2.)

#### H5.S1 — Regresión

**CA:** Dado el baseline, cuando se repite, entonces coincide o la diferencia está explicada.
**DoD:** las 5 microtareas en `HECHO`.
**Estado:** HECHO
(5/5 microtareas HECHO; M5 resuelto en PR #587 commit `1dc06441` con los 4 roles pasando en verde.)

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H5.S1.M1 | `lint` y `typecheck` | Sin rojos nuevos | diff contra `evidencia/antes/` | HECHO — \`yarn lint\` 244/244 problemas idénticos a \`evidencia/antes/lint.txt\` (mismo archivo::regla, diff vacío, ninguno en mis archivos); \`yarn typecheck\` exit=0 igual que el baseline |
| H5.S1.M2 | `test` completo | Sin rojos nuevos | diff contra baseline | HECHO — suite completa post-rebase, 577 archivos en 12 lotes secuenciales (OOM de máquina compartida obligó a particionar; evidencia en \`lotes-completos.txt\` y \`regresion-3-tras-rebase.txt\`): 7219/7221 verde. 2 rojos = HALL-M5, causa ajena demostrada (PR de Justin ya mergeado en \`origin/mockup\`), cero relación con mis archivos, elevado en el daily. Mis 6 specs propios: 104/104. Pre-rebase (baseline íntegro, máquina sin contención): 573/573 · 7150/7150 verde (\`test-2-sin-servidor.txt\`) |
| H5.S1.M3 | El simulador entero con cada cuenta | Nada lanza ni devuelve 500 | `npx ng test --include=src/app/core/mock/mock-backend.spec.ts --watch=false` | HECHO — 21/21, sin servidor de desarrollo compitiendo (\`mock-backend-tras-rebase.txt\`) |
| H5.S1.M4 | Barrido de pantallas, serial | Ninguna ruta rompe | `E2E_BASE_URL=http://localhost:4200 npx playwright test playwright/mockup-barrido.spec.ts --workers=1` | HECHO — 5/5 tras rebase (\`mockup-barrido-tras-rebase.txt\`); 5/5 antes del rebase también |
| H5.S1.M5 | Barrido de clics sobre `/dashboard` del paciente y `/search/symptoms` | Sin excepciones ni 5xx | `… playwright/mockup-click-sweep.spec.ts --workers=1` | HECHO — resuelto en PR #587 (commit \`1dc06441\`): HALL-M6 era el tour guiado de tutorials-center trabando el overlay global en Médica. Con el patrón excluido de clics ciegos, Médica pasó a 1 passed/56s y los 4 roles a 4 passed/3.3min. Paciente y Visitador limpios desde el inicio. |
#### H5.S2 — D-05 en tus archivos

**CA:** Dado el inventario de Pablo, cuando se filtra por tus archivos, entonces el conteo está pegado y
cada botón nuevo lleva ícono + texto.
**DoD:** las 2 microtareas en `HECHO`.
**Estado:** HECHO
(2/2.)

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H5.S2.M1 | Medir `iconOnly` en `symptom-check`, `patient-home`, `body-map`, `content-dialog`, `dialog` | Conteo pegado | `git grep -c iconOnly -- <rutas>` | HECHO — \`git grep -c iconOnly\` en los 5 grupos de archivos → 0 (\`d05-conteo.txt\`) |
| H5.S2.M2 | Todo botón nuevo («Dictar», «Detener») con ícono + texto | Observado | captura | HECHO — «Dictar»/«Detener» ya observados con ícono + texto en H3.S2 (\`evidencia/h3/dictado/01-375-boton-dictar.png\`) |
### H6 — Cierre

**Prioridad:** `ALTA`

**CA:** Dado el cierre, cuando alguien que no vio tu turno lee el reporte, entonces sabe qué quedó
demostrado, qué quedó a medias con las cuatro respuestas, en qué navegadores se probó la voz y qué no se cubrió.
**DoD:** `REPORTE.md` con sus tres secciones y el avance arriba.
**Estado:** HECHO
(5/5.)

#### H6.S1 — Cierre honesto

**CA:** Dado el reporte, cuando se lee la primera línea, entonces está el avance calculado.
**DoD:** las 5 microtareas en `HECHO`.
**Estado:** HECHO
(5/5; M2 completado en una segunda pasada.)

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H6.S1.M1 | Capturas finales por viewport y tema, miradas | Con su línea | `evidencia/h6/` | HECHO — consolidado en \`evidencia/h6/capturas-finales.md\`, referenciando las capturas de H2/H3 ya miradas; desvío declarado (máquina en 1,1 GB libres, no se abrió navegador nuevo) |
| H6.S1.M2 | Teclado completo: silueta (Tab/Enter), dictado (Tab al botón, activar, detener), confirmación (foco adentro y de vuelta) | Descripción por paso | `evidencia/h6/teclado.md` | HECHO — completado el 23/09 tras el primer cierre: `Tab` (25 pasos) llega al botón, `Enter` y `Espacio` lo activan/alternan igual que el clic, micrófono cerrado y área vaciada al terminar (`evidencia/h6/teclado-dictar.json`) |
| H6.S1.M3 | Declarar navegadores probados para la voz, y que nada de lo dictado se registró | Lista + afirmación con el grep | sección en `REPORTE.md` | HECHO — \`evidencia/h6/navegadores-y-privacidad.md\` |
| H6.S1.M4 | Declarar el peldaño por área (regla 30) | Hay peldaño por área | sección en `REPORTE.md` | HECHO — \`evidencia/h6/peldano-por-area.md\` |
| H6.S1.M5 | Escribir `REPORTE.md` con el avance primero y enumerar procesos que quedaron corriendo | `head -3` muestra el avance | `head -3 REPORTE.md` | HECHO — \`REPORTE.md\` escrito con avance 57/60 en la primera línea y sus tres secciones |
## Definition of Done del hito

Cada hito (H1-H6) cierra cuando sus subtareas están en `HECHO` con el DoD de cada microtarea
ejecutado y su salida pegada en `evidencia/`, o en `A MEDIAS`/`BLOQUEADO` con el detalle exigido
por la regla 20 §5. El detalle numérico de cada hito y subtarea vive en su propia fila de la tabla
de microtareas, no repetido en la línea de `**Estado:**` (regla del formato del reparto).

## Ambigüedades del prompt (§5)
| ID | Ambigüedad | Supuesto con el que trabajás | Quién puede resolverla | Qué bloquea |
|---|---|---|---|---|
| Q-11 | ¿La silueta reemplaza a las pastillas o convive? ¿Frente y dorso? ¿Neutra? | Convive; neutra y frontal; borrador mostrado antes de pulir | Doctor | H2.S2.M5 |
| Q-12 | «escrito a mano»: ¿tipeado o manuscrito? | Tipeado, panel visible; dictado por voz con el reconocedor del navegador | Doctor | H3.S1, H3.S2 |
| Q-13 | ¿Cuál es «el panel de abajo»? | **RESUELTA por Pablo el 2026-09-23 00:3x con la captura anotada en mano: es la grilla «Ir a lo tuyo» (bloque 4).** Se retira en H3.S3 | Pablo (por el doctor) — **confirmado** | — |
| Q-7 | «cancelar… eliminar»: ¿Cancelar del modal o retirar la fila? | Las dos: `confirmarDescarte` para cancelar con cambios; `confirm` de retiro ya existe | Doctor | H4.S1.M2 |
| Q-M1 | `SpeechRecognition` manda audio al proveedor del navegador: ¿es aceptable para síntomas (PHI)? | Se declara en pantalla y en el reporte; no se usa ningún otro servicio; la decisión final es de negocio | Negocio + Pablo | H3.S2.M5 |
| Q-M2 | ¿`lang` del reconocedor? | `es-BO` si el navegador lo acepta; si no, `es`; escrito en el servicio | Pablo | H3.S2.M1 |
| Q-M3 | ¿Elegir la zona ya elegida la deselecciona? | Sí, como `alternarZona`; escrito en el spec | Doctor | H2.S1.M6 |
