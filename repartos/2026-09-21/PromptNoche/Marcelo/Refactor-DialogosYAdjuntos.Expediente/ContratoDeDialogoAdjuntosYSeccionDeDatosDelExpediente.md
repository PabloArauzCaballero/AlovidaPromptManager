# El diálogo, los adjuntos y la sección de datos: el contrato que usan 26 pantallas

> **Rol:** propietario de las familias «diálogo de contenido», «adjuntos» y «sección de datos» · **Línea:** D · **Fecha:** 2026-09-21 · **Turno:** noche
> **Fuente del pedido:** [`REFACTOR-FRONTEND-2026-09-21.md`](../../../../../docs/requisitos/REFACTOR-FRONTEND-2026-09-21.md) — secciones **7, 8, 9, 10.3, 12.3 y 14**
> **Verificación contra el código:** [`VERIFICACION-CONTRA-CODIGO-2026-09-21.md`](../../../../../docs/verificacion/VERIFICACION-CONTRA-CODIGO-2026-09-21.md) — secciones **3, 4, 6 y 11**
> **6 hitos · 14 subtareas · 61 microtareas**, todas con criterio de aceptación y Definition of Done.
>
> **Justin te va a pedir el contrato del diálogo**: dos de sus pantallas (`alovida/buscar/…`) tienen
> diálogos escritos a mano. **El contrato lo escribís vos en H2; las pantallas las migra él.** Escribilo
> temprano y avisale por el daily, o lo dejás bloqueado.

## 0. Ficha de asignación

| Campo | Valor |
|---|---|
| `REPO` | `alovida/mantra-core-health` (frontend Angular). **Nada de backend en este lote** |
| `TARGET_REF` | `origin/mockup` — corte leído **`5a0776c66b005ad4d2d6722321e933cd7adea621`** (2026-09-21T17:35-04). **Reconsultalo y fijá el tuyo** en tu `PLAN.md` |
| `RAMA DE TRABAJO` | Una tuya, saliendo de `origin/mockup`. **Nada directo sobre `mockup`, nada sin PR** |
| `ARCHIVOS RESERVADOS PARA VOS` | `src/app/shared/components/organisms/content-dialog/**` · `organisms/attachment-dialog/**` · `organisms/attachment-uploader/**` · `organisms/fact-section/**` · `src/app/shared/components/molecules/fact-list/**` · `src/app/features/clinical-record/**` |
| `ARCHIVOS DE OTROS — NO LOS TOQUES` | `organisms/{data-table,view-state-host,filter-bar}/**` y `features/alovida/{accesos,personas}/**` (Pablo) · `organisms/{directory-page,page-header}/**`, `molecules/{search-field,pagination}/**` y `features/alovida/{terminologia,datos-compartidos,buscar,directorio,inicio}/**` (Justin — **incluidos sus dos diálogos crudos**) · `organisms/{paginated-form,form-section,form-actions}/**`, `molecules/form-field/**`, `features/auth/register-*/**`, `features/account/my-profile/**` (Itzan) · `scripts/**`, `features/component-stock/**`, `core/mock/faker/**` y **los tres barrels** (Ender) |
| `⚠️ RIESGO ALTO DE TU CARRIL` | `content-dialog` tiene **26 consumidores**. Cualquier cambio suyo exige probar una **muestra de consumidores ajenos**, no sólo el expediente |
| `LA MAQUETA NO TIENE BACKEND` | `mockBackend: true` fijo en `src/environments/environment.ts`. Ninguna petición sale a la red: las contesta `src/app/core/mock/mock-backend.interceptor.ts`. **Lo que te falte en `core/mock/` se lo pedís a Ender** |
| `CUENTA DE PRUEBA` | `medica@alovida.mock` (cualquier contraseña no vacía). **Sintética declarada**: se puede pegar |
| `DÓNDE SE PRUEBA` | El expediente vive en las rutas de `clinical-record`. Varias casillas **exigen un encuentro abierto**. **Sacá las URLs del router, no las supongas** |
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

**Si el `git clone` falla con 404:** el estándar todavía no está publicado. Pedíselo a Pablo por
copia directa y registralo como límite de acceso. **Un 404 no demuestra que el repositorio no exista.**

### 1.2 Qué te instala eso

| Candado | Qué impide |
|---|---|
| `plan_gate.py` | Escribir código sin `PLAN.md` en disco. Nunca bloquea `.md` ni nada bajo `docs/` |
| `report_gate.py` | Cerrar la sesión con trabajo activo y sin `REPORTE.md`, o sin sus tres secciones |
| `blocker_gate.py` | Cerrar con microtareas en `BLOQUEADO` o `EN CURSO` sin declarar la simulación de los tres niveles del contrato (regla 65) |

**En cualquier otra herramienta los candados NO corren.** El plan y el reporte siguen siendo igual de
obligatorios; lo único que cambia es que nadie te va a frenar.

### 1.3 Skills que tenés que CARGAR para este lote

Son **26**: 11 del proceso y 15 propias de tus familias.

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
| `clinical-records` | **la más importante de tu lote**: el encuentro, el episodio y qué se registra dentro de cuál |
| `frontend-accessibility` | rol y nombre del modal, foco atrapado, `Escape`, y **restauración del foco** |
| `smart-dumb-components` | quién guarda y quién pinta; el diálogo emite intención, no persiste |
| `atomic-design-components` | reusar `content-dialog` en vez de escribir otro modal |
| `component-architecture-solid` | por qué `attachment-dialog` y `attachment-uploader` pueden ser complementarios |
| `file-uploads-media` | tipo real y tamaño validados en servidor; el progreso que la UI **recibe** |
| `data-privacy-phi` | **gate obligatorio**: nada de datos de pacientes en logs, capturas ni reporte |
| `frontend-ux-states` | los cuatro estados, y el error accionable en vez del crudo del backend |
| `frontend-motion` | respetar movimiento reducido en la apertura del diálogo |
| `frontend-forms-ux` | la política de descarte y qué se preserva al cerrar |
| `refactoring-safely` | separar sin cambiar comportamiento |
| `dead-code-duplication` | `fact-section` tiene 0 consumidores: cómo se mide antes de decidir |
| `unit-testing` | un comportamiento por test, y no testear la implementación |
| `visual-proof` | la captura no vale si no la mirás |
| `e2e-playwright` | locators por rol y texto, cero `waitForTimeout` |

Entrá siempre por `skills-router`: **no leas el catálogo entero, no sirve.**

### 1.4 DoD de esta sección — se verifica como cualquier otra

- [ ] `ls .claude/skills | wc -l` devolvió **176**, y la salida está pegada en tu daily.
- [ ] `python .claude/hooks/plan_gate.py --self-test` devolvió **11 PASS, 0 FAIL**, salida pegada.
- [ ] Leíste `skills-router` y las 26 skills de las dos tablas, **empezando por `clinical-records` y
      `data-privacy-phi`**.
- [ ] Creaste tu `PLAN.md` **antes** del primer `Edit`/`Write` de código.

**Sin estas cuatro casillas, tu lote arranca en `BLOQUEADO`, no en `EN CURSO`.**

> ### ✅ Hechos ya verificados contra el corte — no los repitas, pero tampoco los creas sin abrir el archivo
>
> #### El contrato de `content-dialog` ya trae lo que el §10.3 pide
>
> `src/app/shared/components/organisms/content-dialog/content-dialog.ts`:
>
> | Línea | Miembro |
> |---|---|
> | 84 | `selector: 'app-content-dialog'` (**elemento**) |
> | 92 | `heading = input.required<string>()` |
> | 95 · 97 · 105 | `description` · `closeLabel` · `size` |
> | 113 | `dismissible = input(true)` |
> | 116 · 126 | `opened` · `closed` |
> | **123** | **`dismissAttempt = output<void>()`** |
>
> `dismissAttempt` es exactamente la **«solicitud de descarte»** del §9: el diálogo **pide** cerrarse y
> el consumidor decide. O sea: el contrato del §10.3 («guardar es una intención hasta obtener
> resultado») ya está expresado en el organismo. **Lo que falta no es el mecanismo: es demostrar que
> los 26 consumidores lo respetan por los tres caminos de cierre** — botón, `Escape` y fondo.
>
> Consumidores: `<app-content-dialog` aparece en **26** plantillas.
> Comando: `git grep -l '<app-content-dialog' origin/mockup -- 'src/app/**/*.html' | wc -l`
>
> #### Adjuntos: son DOS piezas, y el documento maestro dice explícitamente que no se fusionan
>
> | Pieza | Líneas | Consumidores |
> |---|---|---|
> | `organisms/attachment-dialog` | 178 | 3 |
> | `organisms/attachment-uploader` | 390 | 3 |
>
> El §9 lo dice textual: *«No consolides `attachment-dialog` y `attachment-uploader` sólo por referirse
> a adjuntos: pueden tener responsabilidades complementarias.»* Tu trabajo es **demostrar cuál es la
> responsabilidad de cada una**, no fusionarlas.
>
> #### `fact-section` existe y NADIE lo instancia
>
> `organisms/fact-section` son **239 líneas** y `<app-fact-section` aparece en **0** plantillas.
> `molecules/fact-list` sí existe al lado.
>
> ⚠️ **Cero consumidores NO es un veredicto.** Puede ser una pieza recién nacida esperando su primer
> uso, o código muerto. La regla 00 §3.2 y `dead-code-duplication` exigen medir antes: usos estáticos,
> dinámicos, por tipo y del catálogo. **No lo borres, y tampoco lo adoptes a la fuerza para justificar
> que existe.** Ésa es la ambigüedad Q-M2.
>
> #### Diálogos escritos a mano: son 9 en todo el repo, y sólo UNO es tuyo
>
> `git grep -l -E '<dialog|role="dialog"' origin/mockup -- 'src/app/features/**/*.html'`:
>
> | Archivo | De quién es |
> |---|---|
> | `clinical-record/patient-chart/patient-chart.html` | **tuyo** |
> | `alovida/buscar/hospitales-listado/facility-directions-dialog/…` | **de Justin** |
> | `alovida/buscar/medicamentos-listado/pharmacy-availability-dialog/…` | **de Justin** |
> | `agenda/agenda.html` · `agenda/my-agenda/my-agenda.html` · `agenda/my-agenda/tarjeta-del-dia/…` | oleada 2 |
> | `messaging/thread/thread.html` · `messaging/thread/contact-panel/…` | oleada 2 |
> | `public-profile/public-profile-card/…` | oleada 2 |
>
> **De ahí sale tu obligación con Justin:** vos escribís el contrato en H2, él migra los dos suyos.
>
> #### El tamaño del expediente
>
> `features/clinical-record/**` suma **540 844 bytes** sin specs, con `patient-chart.ts` 66 139 y
> `medication-block.ts` 45 822. **El tamaño no es el defecto** (§5.6): es dónde buscar.
>
> #### `ViewState<T>` tiene 10 estados, con su razón escrita
>
> `core/view-state/view-state.types.ts` **36-46**. Las tres distinciones documentadas en **17-28** son
> de tu dominio: **S5 ≠ S6** — un «no tenés permiso» sobre un identificador de paciente **confirma que
> ese paciente existe**, y por eso `NotFoundViewState` no transporta datos del recurso. **Prohibido
> sustituirlo por `loading/error/success`** (§12.3).
>
> ⚠️ **Lo que la verificación NO hizo: ejecutar.** No se levantó la maqueta, no se corrió un test, no
> se abrió un diálogo. **No se midió cuántos de los 26 `content-dialog` respetan la política de
> descarte.** Eso es tuyo, y es justo lo que decide si H2 está hecho.

## 2. Resultado observable

| Hito | Prioridad | Qué queda demostrado |
|---|---|---|
| **H1** | `BLOQUEANTE` | Corte declarado, baseline con rojos previos registrados, rutas reales del expediente, y capturas **antes** de dos casillas del expediente y de un diálogo abierto, en dos viewports. |
| **H2** | `ALTA` | El contrato de `content-dialog` está escrito según el §8 y el §10.3 —incluida la política de descarte por los **tres** caminos de cierre— y **Justin lo tiene** para migrar sus dos diálogos. Y está medido cuántos de los 26 consumidores la respetan hoy. |
| **H3** | `ALTA` | El diálogo escrito a mano de `patient-chart` usa el organismo canónico, con foco inicial adentro, foco atrapado, `Escape` y **restauración del foco** al elemento que lo abrió — probado con teclado, no supuesto. |
| **H4** | `ALTA` | Está demostrado cuál es la responsabilidad de `attachment-dialog` y cuál la de `attachment-uploader`, con su contrato escrito, y la conclusión es **complementarias** o **fusionables** con evidencia — no por intuición. |
| **H5** | `MEDIA` | `fact-section` tiene veredicto medido: adoptado por un consumidor real, o declarado como pendiente con dueño, o propuesto para retiro con las cuatro mediciones pegadas. **Nada se borra esta noche.** |
| **H6** | `ALTA` | Regresión y gates corridos, capturas por viewport y tema miradas, el gate de privacidad de datos clínicos pasado, §19 respondido con evidencia, y `REPORTE.md` escrito. |

> ⚠️ **Esto es más de lo que entra en una noche, y está dicho a propósito.** Lo que no se cierra queda
> `A MEDIAS` con qué anda, qué no anda y qué falta exactamente. **Prioridad real: H2 temprano, porque
> destraba a Justin.**

**Kill-test del turno completo:** abrí el diálogo de `patient-chart`, escribí algo, y cerralo con
`Escape`. Si se cierra perdiendo lo escrito sin preguntar, o si al cerrar el foco no vuelve al botón
que lo abrió, la política de descarte y el manejo de foco no están cumplidos y H3 no está hecho. Y
después probá lo mismo cerrando por el fondo: si los tres caminos no se comportan igual, el §10.3 está
violado.

## 3. Alcance

**IN:** baseline de `lint`, `typecheck`, `test` y `audit:vistas` con rojos previos registrados · rutas
reales del expediente · capturas previas · contrato escrito de `content-dialog` según el §8 y el §10.3,
**entregado a Justin** · medición de cuántos de los 26 consumidores respetan la política de descarte ·
migración del diálogo escrito a mano de `patient-chart` al organismo canónico, con foco y descarte
probados con teclado · contrato escrito de `attachment-dialog` y de `attachment-uploader`, con el
veredicto sobre si son complementarias · veredicto medido sobre `fact-section` · specs dirigidos al
cambio · capturas por viewport y tema · gate de `data-privacy-phi` · `PLAN.md`, `REPORTE.md` y
`evidencia/`.

**OUT:** **cualquier archivo fuera de los seis reservados de la ficha** · **los dos diálogos crudos de
`alovida/buscar/**`** — son de Justin: vos le das el contrato, él migra · los tres de `agenda/**`, los
dos de `messaging/**` y el de `public-profile/**` — **oleada 2**, declarada · `core/mock/**` — es de
Ender: el dato que te falte se lo pedís · los tres barrels · **cambiar `ViewState<T>`**: 69 consumidores
y 10 estados con su razón documentada · **fusionar `attachment-dialog` con `attachment-uploader` porque
las dos dicen «adjunto»**: el §9 lo prohíbe expresamente sin evidencia · **borrar `fact-section`** ·
**inventar un dato clínico**: dosis, posología, contraindicación, equivalencia o catálogo. Está
prohibido por la regla 97.5.4 y necesita fuente con procedencia · **cambiar qué se registra en un
encuentro o en un episodio** porque simplifica la refactorización (§2.3) · pegar un dato real de
paciente en una captura, un log, el plan o el reporte (regla 90.2) · debilitar un spec para que pase ·
declarar `HECHO` una microtarea cuyo DoD no corriste.

## 4. Plan — hitos, subtareas y microtareas

Los seis estados permitidos son exactamente: `TODO`, `EN CURSO`, `HECHO`, `A MEDIAS`, `BLOQUEADO` y
`DESCARTADO`. **`A MEDIAS` es legítimo; disfrazarlo de `HECHO` no.**

### H1 — Corte, baseline y capturas previas

**Prioridad:** `BLOQUEANTE`

**CA:** Dado tu entorno, cuando alguien pregunta contra qué versión trabajaste y cómo se comportaba el
diálogo antes, entonces hay SHA, capturas y el comportamiento anotado paso por paso.
**DoD:** salidas del baseline en `evidencia/antes/`, cuatro capturas descritas, y el recorrido del
diálogo anotado.
**Estado:** TODO

#### H1.S1 — Corte y baseline

**CA:** Dado un rojo posterior, cuando alguien pregunta si lo rompiste vos, entonces la respuesta sale
de un archivo.
**DoD:** salidas con su código de salida, pegadas.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H1.S1.M1 | Fijar corte y rama | Hay SHA y rama en `PLAN.md` | `git rev-parse origin/mockup && git branch --show-current` | TODO |
| H1.S1.M2 | Baseline de `lint` y `typecheck` | Hay salida y exit code | `yarn lint; yarn typecheck; echo "exit=$?"` → `evidencia/antes/` | TODO |
| H1.S1.M3 | Baseline de `test` | Hay conteo de fallos previos | `yarn test --watch=false` → `evidencia/antes/test.txt` | TODO |
| H1.S1.M4 | Clasificar cada rojo previo | Cada uno con su clase de la regla 80.4 | tabla en `PLAN.md` | TODO |

#### H1.S2 — Las rutas y el comportamiento de antes

**CA:** Dado el diálogo que vas a migrar, cuando alguien pregunte si cambió su comportamiento, entonces
hay una descripción previa de los tres caminos de cierre contra la que comparar.
**DoD:** los tres caminos recorridos y anotados, con captura.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H1.S2.M1 | Sacar las rutas del expediente del router | Hay lista de URLs verificadas | `git grep -n 'clinical-record' origin/mockup -- 'src/app/**/*.routes.ts' \| head -20` | TODO |
| H1.S2.M2 | Localizar el diálogo escrito a mano en `patient-chart.html` | Hay línea citada | `git show origin/mockup:src/app/features/clinical-record/patient-chart/patient-chart.html \| grep -n '<dialog\|role="dialog"'` | TODO |
| H1.S2.M3 | Recorrer los tres caminos de cierre y anotar qué hace cada uno | Tres veredictos observados | descripción + capturas en `evidencia/antes/` | TODO |
| H1.S2.M4 | Anotar dónde vuelve el foco al cerrar, si vuelve | Hay un sí o un no observado | captura del foco tras cerrar | TODO |

#### H1.S3 — Capturas y estado previo

**CA:** Dada una casilla del expediente que vas a tocar, cuando alguien pregunte cómo se veía, entonces
hay captura previa en dos viewports y en los dos temas.
**DoD:** cuatro capturas descritas, con datos sintéticos.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H1.S3.M1 | Capturar dos casillas del expediente en escritorio y móvil | Cuatro capturas, miradas | `evidencia/antes/capturas/` con su línea | TODO |
| H1.S3.M2 | Confirmar que en las capturas no hay dato real de paciente | Todo es sintético declarado | revisión contra `data-privacy-phi`, anotada | TODO |
| H1.S3.M3 | Revisar consola y red antes de tocar | Hay lista de errores previos | lista en `evidencia/antes/` | TODO |

### H2 — El contrato del diálogo, escrito y entregado

**Prioridad:** `ALTA` — **y es lo primero que hacés después de H1, porque destraba a Justin**

**CA:** Dado `content-dialog`, cuando otro lo va a usar, entonces tiene contrato escrito que responde
las diez filas del §8 y el §10.3, y no necesita leer la implementación; y dado el conjunto de sus 26
consumidores, cuando se pregunta cuántos respetan la política de descarte, entonces hay un número.
**DoD:** el contrato en el repo + el conteo de los 26, con criterio de medición declarado.
**Estado:** TODO

#### H2.S1 — Escribir el contrato

**CA:** Dado el contrato, cuando se lee, entonces dice qué partes son obligatorias, qué opcionales, qué
cardinalidad admite, qué orden preserva, qué eventos salen y qué combinaciones son inválidas.
**DoD:** las diez filas del §8 y las diez áreas del §10 respondidas.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H2.S1.M1 | Leer el contrato real antes de escribirlo | Están anotados inputs, outputs y slots | `git show origin/mockup:src/app/shared/components/organisms/content-dialog/content-dialog.ts \| grep -n 'input\|output\|ng-content'` | TODO |
| H2.S1.M2 | Documentar la anatomía: título, descripción, contenido, acciones | Las diez filas del §8 respondidas | el archivo de contrato | TODO |
| H2.S1.M3 | Documentar la política de descarte del §10.3 por los tres caminos | Está escrito qué hace botón, `Escape` y fondo | idem | TODO |
| H2.S1.M4 | Declarar las invariantes: qué combinación de partes es inválida | Hay al menos una invariante escrita | idem | TODO |
| H2.S1.M5 | Avisarle a Justin que el contrato está listo | Su daily lo referencia | línea en tu daily y en el de equipo | TODO |

#### H2.S2 — Medir a los 26

**CA:** Dada la afirmación «los consumidores respetan la política de descarte», cuando se verifica,
entonces hay un conteo con criterio declarado y una lista de los que no.
**DoD:** el conteo y la lista, con el criterio escrito.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H2.S2.M1 | Listar los 26 consumidores | El conteo da 26 | `git grep -l '<app-content-dialog' origin/mockup -- 'src/app/**/*.html' \| wc -l` | TODO |
| H2.S2.M2 | Declarar el criterio de «respeta la política» | Es binario y comprobable | una línea en el contrato | TODO |
| H2.S2.M3 | Medir cuántos escuchan `dismissAttempt` | Hay un número | `git grep -c 'dismissAttempt' origin/mockup -- 'src/app/**/*.html'` | TODO |
| H2.S2.M4 | Probar tres consumidores ajenos a mano, con los tres caminos | Nueve observaciones | descripción por caso + capturas | TODO |

#### H2.S3 — El contrato de la sección de datos

**CA:** Dada la familia «sección editable de datos» del §9, cuando se documenta, entonces queda claro
qué es consulta, qué es edición, y quién persiste.
**DoD:** el contrato escrito, y la relación entre `fact-section` y `fact-list` declarada.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H2.S3.M1 | Leer `fact-section` y `fact-list` y anotar su responsabilidad | Hay una línea por pieza | `git show origin/mockup:src/app/shared/components/organisms/fact-section/fact-section.ts \| grep -n 'input\|output\|ng-content'` | TODO |
| H2.S3.M2 | Documentar el contrato de la sección de datos según el §10 | Las diez áreas respondidas | el archivo de contrato | TODO |
| H2.S3.M3 | Declarar qué queda **fuera**: la persistencia y las reglas de cada dato | Está escrito | idem | TODO |

### H3 — El diálogo del expediente usa el organismo canónico

**Prioridad:** `ALTA`

**CA:** Dado el diálogo de `patient-chart`, cuando se abre, entonces es `<app-content-dialog>` en el
DOM, el foco entra adentro, queda atrapado mientras está abierto, `Escape` respeta la misma política que
el botón, y al cerrar el foco vuelve al elemento que lo abrió.
**DoD:** los cinco comportamientos probados con teclado, cada uno descrito, más captura antes/después.
**Estado:** TODO

#### H3.S1 — La migración

**CA:** Dada la migración, cuando se compara con la captura previa, entonces se ve equivalente y no hay
error nuevo en consola ni en red.
**DoD:** captura antes/después por viewport + consola revisada.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H3.S1.M1 | Reemplazar el diálogo escrito a mano por el organismo | El DOM muestra `<app-content-dialog` | captura del DOM + captura visual comparada | TODO |
| H3.S1.M2 | Proyectar contenido y acciones reales, no un contenedor vacío | El diálogo abre con contenido | captura | TODO |
| H3.S1.M3 | Conectar `dismissAttempt` a la política del expediente | Cerrar con cambios sin guardar hace lo que hacía antes | recorrido comparado con H1.S2.M3 | TODO |
| H3.S1.M4 | Comprobar consola y red | Cero errores nuevos | lista pegada | TODO |
| H3.S1.M5 | Spec dirigido al cambio | Pasa, y falla si se rompe el descarte | `yarn test --watch=false` acotado, salida pegada | TODO |

#### H3.S2 — Accesibilidad del modal, probada con teclado

**CA:** Dado el diálogo abierto, cuando se navega sólo con teclado, entonces se puede recorrer y cerrar
sin mouse, y el foco no se escapa al fondo.
**DoD:** los cinco comportamientos descritos paso por paso, con captura del foco visible.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H3.S2.M1 | Comprobar rol y nombre accesible del diálogo | Tiene los dos | descripción + captura del árbol de accesibilidad | TODO |
| H3.S2.M2 | Comprobar foco inicial adentro | El primer `Tab` queda dentro | descripción | TODO |
| H3.S2.M3 | Comprobar foco atrapado | `Tab` no llega al fondo | descripción | TODO |
| H3.S2.M4 | Comprobar cierre por `Escape` | Cierra respetando la política | descripción | TODO |
| H3.S2.M5 | Comprobar restauración del foco al abridor | El foco vuelve al botón | captura del foco tras cerrar | TODO |
| H3.S2.M6 | Comprobar movimiento reducido | La apertura respeta la preferencia | descripción de la prueba con la preferencia activada | TODO |

### H4 — Adjuntos: demostrar la responsabilidad de cada pieza

**Prioridad:** `ALTA`

**CA:** Dadas `attachment-dialog` y `attachment-uploader`, cuando alguien pregunta por qué son dos,
entonces hay una respuesta con evidencia: la responsabilidad de cada una, sus consumidores, y el
veredicto **complementarias** o **fusionables** — no una intuición.
**DoD:** los dos contratos escritos + el veredicto con su evidencia.
**Estado:** TODO

#### H4.S1 — Leer y contrastar

**CA:** Dadas las dos piezas, cuando se comparan por las cinco dimensiones del §7.1, entonces hay
veredicto por dimensión.
**DoD:** tabla de 2 × 5, con líneas citadas.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H4.S1.M1 | Leer el contrato de las dos | Están anotados inputs, outputs y slots de cada una | `git show origin/mockup:src/app/shared/components/organisms/attachment-uploader/attachment-uploader.ts \| grep -n 'input\|output'` y su par | TODO |
| H4.S1.M2 | Listar los consumidores de cada una | Tres y tres | `git grep -l '<app-attachment-dialog' origin/mockup -- 'src/app/**/*.html'` y su par | TODO |
| H4.S1.M3 | Comparar las cinco dimensiones del §7.1 | Cinco veredictos | tabla | TODO |
| H4.S1.M4 | Declarar el veredicto con su evidencia | Hay una conclusión citada | fila final de la tabla | TODO |

#### H4.S2 — El contrato de cada una

**CA:** Dado el contrato de cada pieza, cuando se lee, entonces queda claro qué recibe, qué emite, y
**qué NO hace** — en particular, que el progreso lo **recibe** y la subida no la decide ella.
**DoD:** los dos contratos escritos, con su sección de «qué queda fuera».
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H4.S2.M1 | Contrato de `attachment-uploader` según el §10 | Las diez áreas respondidas | el archivo | TODO |
| H4.S2.M2 | Contrato de `attachment-dialog` según el §10 | idem | idem | TODO |
| H4.S2.M3 | Declarar que la validación real de tipo y tamaño es del servidor | Está escrito | idem, revisado contra `file-uploads-media` | TODO |
| H4.S2.M4 | Declarar que el progreso se recibe, no se inventa | Está escrito | idem | TODO |
| H4.S2.M5 | Acreditar las dos en el catálogo de Ender | Dos escenarios con contrato válido | dos capturas de la ficha | TODO |

### H5 — `fact-section`: veredicto medido, sin borrar nada

**Prioridad:** `MEDIA`

**CA:** Dado `fact-section` con 0 consumidores, cuando alguien pregunta qué es, entonces hay un
veredicto respaldado por cuatro mediciones — y no se borró nada esta noche.
**DoD:** las cuatro mediciones pegadas y el veredicto escrito.
**Estado:** TODO

#### H5.S1 — Las cuatro mediciones

**CA:** Dada la pieza, cuando se mide, entonces se midieron usos estáticos, dinámicos, por tipo y del
catálogo, por separado.
**DoD:** cuatro números pegados.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H5.S1.M1 | Usos estáticos por selector | Hay número | `git grep -c '<app-fact-section' origin/mockup -- 'src/app/**/*.html'` | TODO |
| H5.S1.M2 | Usos por importación de la clase | Hay número | `git grep -c 'FactSection' origin/mockup -- 'src/app/**/*.ts'` | TODO |
| H5.S1.M3 | Usos dinámicos y por ruta | Hay número | `git grep -n 'loadComponent\|createComponent' origin/mockup -- 'src/app/**/*.ts' \| grep -i fact` | TODO |
| H5.S1.M4 | Presencia en el índice del catálogo | Hay veredicto | `grep -n 'FactSection' src/app/features/component-stock/component-index.generated.ts` | TODO |

#### H5.S2 — El veredicto

**CA:** Dado el resultado, cuando se escribe el veredicto, entonces es una de tres cosas: adoptado por
un consumidor real del expediente, pendiente con dueño y fecha, o propuesto para retiro — con motivo.
**DoD:** el veredicto escrito, y **cero borrados**.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H5.S2.M1 | Evaluar si una casilla del expediente lo puede adoptar de verdad | Hay un sí o un no con motivo | una línea en el contrato + la casilla nombrada | TODO |
| H5.S2.M2 | Si se adopta: migrar una casilla y demostrarlo | El DOM muestra `<app-fact-section` | captura antes/después | TODO |
| H5.S2.M3 | Si no se adopta: declararlo pendiente con dueño | Hay dueño y motivo | sección en `REPORTE.md` | TODO |
| H5.S2.M4 | Confirmar que no borraste nada | El diff no elimina la pieza | `git diff --stat` | TODO |

### H6 — Regresión, gates y cierre

**Prioridad:** `ALTA`

**CA:** Dado el cierre, cuando alguien que no vio tu turno lee el reporte, entonces sabe qué quedó
demostrado, qué quedó a medias con las cuatro respuestas, y qué no se cubrió; y el gate de privacidad
de datos clínicos está pasado y escrito.
**DoD:** baseline repetido y comparado, capturas miradas, gate de PHI, §19 respondido y `REPORTE.md`.
**Estado:** TODO

#### H6.S1 — Regresión y el gate de privacidad

**CA:** Dado tu cambio, cuando corrés los comandos del baseline, entonces ningún rojo es nuevo; y
cuando se revisa la evidencia, entonces no hay ni un dato real de paciente.
**DoD:** salidas comparadas + la sección de privacidad del reporte.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H6.S1.M1 | `lint` y `typecheck` | Sin rojos nuevos | diff contra baseline | TODO |
| H6.S1.M2 | `test` completo | Sin rojos nuevos | diff contra baseline | TODO |
| H6.S1.M3 | Tres consumidores ajenos de `content-dialog`, a mano | Los tres se comportan igual | tres capturas comparadas | TODO |
| H6.S1.M4 | E2E dirigido al expediente, `--workers=1` | Pasa | salida pegada |  TODO |
| H6.S1.M5 | Gate de `data-privacy-phi` sobre toda la evidencia | Cero datos reales; si hubo, se enmascaró y se dice | sección en `REPORTE.md` | TODO |

#### H6.S2 — Cierre honesto

**CA:** Dado el reporte, cuando se lee la primera línea, entonces está el avance calculado; y ninguna
palabra es más fuerte que la evidencia.
**DoD:** `REPORTE.md` con sus tres secciones y el avance arriba.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H6.S2.M1 | Capturas finales por viewport y tema | Cinco capturas con su línea | `evidencia/h6/` | TODO |
| H6.S2.M2 | Responder las 20 preguntas del §19 | Cada una con evidencia | sección en `REPORTE.md` | TODO |
| H6.S2.M3 | Declarar el peldaño por área (regla 30) | Hay peldaño por área | sección en `REPORTE.md` | TODO |
| H6.S2.M4 | Declarar qué quedó para la oleada 2 y de quién es | Los ocho diálogos restantes tienen dueño propuesto | sección en `REPORTE.md` | TODO |
| H6.S2.M5 | Escribir `REPORTE.md` con el avance primero | `head -3` muestra el avance | `head -3 REPORTE.md` | TODO |

## 5. Ambigüedades registradas

| ID | Ambigüedad | Supuesto con el que trabajás | Quién puede resolverla | Qué bloquea |
|---|---|---|---|---|
| Q-M1 | ¿Cerrar un diálogo del expediente con cambios sin guardar debe pedir confirmación? | **Se conserva lo que hace hoy**, documentado en H1.S2.M3; no se elige una política nueva en silencio (§10.3) | Producto | H3 |
| Q-M2 | `fact-section` tiene 0 consumidores: ¿pieza nueva o código muerto? | Ninguno de los dos hasta medirlo. **No se borra** | Pablo, con tus cuatro mediciones | H5 |
| Q-M3 | ¿`attachment-dialog` y `attachment-uploader` son complementarias? | Se **demuestra** en H4, no se asume. El §9 prohíbe fusionarlas sólo por el nombre | Pablo | H4 |
| Q-M4 | ¿Los ocho diálogos crudos restantes son de esta oleada? | No: dos son de Justin, seis son oleada 2, y se declaran con dueño propuesto | Pablo | H6.S2.M4 |
| Q-M5 | ¿Falta algún fixture del expediente en `core/mock/`? | Probablemente sí; se le pide a Ender y mientras se simula el contrato en tres niveles (regla 65) | Ender | H3, H4 |

## 6. Definition of Done del hito

- [ ] Todas sus microtareas en `HECHO`, o en `A MEDIAS`/`BLOQUEADO`/`DESCARTADO` **con las cuatro
      respuestas**.
- [ ] La salida literal del comando de cada DoD está en `evidencia/`, no parafraseada.
- [ ] `yarn lint`, `yarn typecheck` y `yarn test --watch=false` sin rojos **nuevos** respecto del
      baseline de H1.S1, con el diff pegado.
- [ ] Si tocaste `content-dialog`: tres consumidores ajenos comprobados a mano, con captura.
- [ ] Todo diálogo tocado: rol y nombre, foco inicial adentro, foco atrapado, `Escape`, **restauración
      del foco**, y movimiento reducido respetado (regla 95.4.2 y 95.5.1).
- [ ] Capturas por viewport y tema, **miradas**, con una línea cada una.
- [ ] Consola y red sin errores nuevos (regla 95.7.3).
- [ ] **Gate de `data-privacy-phi` pasado y escrito**: cero datos de pacientes en logs, capturas, plan
      o reporte. Si una salida los tenía, se enmascaró **y se aclara que se enmascaró** (regla 90.2).
- [ ] Ningún dato clínico inventado: ni dosis, ni posología, ni catálogo (regla 97.5.4).
- [ ] Peldaño de evidencia declarado por área (regla 30).
- [ ] El `PLAN.md` está actualizado en el momento, no al final.

## 7. Cómo cerrás el turno

1. **Checkpoint** en cada apertura y cierre de microtarea. Prohibido encadenar más de tres operaciones
   materiales sin uno.
2. **`REPORTE.md`** con el avance en la **primera línea**: `> **AVANCE: <HECHO> / 61 — <%>.**`
3. **Las tres secciones obligatorias existen siempre.** Una vacía se escribe con «ninguna».
4. **Lo que dependa de Ender o de una decisión de Pablo** no cierra como `BLOQUEADO` sin haber simulado
   los tres niveles de su contrato (regla 65).
5. **Enumerá qué quedó corriendo** y cerralo.
6. **Tu daily** es `Marcelo-Daily-Noche-2026-09-21.md`, en la carpeta de arriba. **Y confirmá ahí que
   Justin recibió el contrato del diálogo**: es lo que lo destraba.

## 8. Revisión adversarial antes de cerrar

1. ¿Un cierre evita la protección de cambios sin guardar por alguno de los tres caminos? (§19.13)
2. ¿Un output se llama éxito aunque sólo se emitió una solicitud? (§19.14)
3. ¿La extracción borró una diferencia real de dominio porque dos piezas se llamaban parecido? (§19.6)
4. ¿El contrato proyectado permite usos inválidos que ningún check detecta? (§19.8)
5. ¿El diálogo del catálogo está vacío y eso se presenta como que el organismo está acreditado? (§19.9)
6. ¿Se retiró código sin revisar consumidores dinámicos y rutas? (§19.17)
7. ¿Se declara verificado algo que sólo fue inspeccionado estáticamente? (§19.18)
8. ¿Se cambió qué se registra en un encuentro o un episodio para que la refactorización quedara más
   limpia? Eso está prohibido por el §2.3.
9. ¿Hay un dato clínico en la evidencia que no tenga procedencia o no esté declarado sintético?
10. ¿Se rompió alguno de los 26 consumidores de `content-dialog`, y lo sabés o lo supones?
