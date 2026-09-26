# Justin — daily de la noche del 2026-09-25

> **AVANCE COMBINADO: 133 / 140 — 95,0 %.** Es el estado **después de la corrida de cierre** del
> 2026-09-25 (A 39/41 · B 66/68 · C 28/31). Al terminar la noche era **116 / 140 — 82,9 %**
> (A 33/41 · B 60/68 · C 23/31). Sale de `microtareas HECHO / total`, sumando los **tres** carriles
> de abajo; el encabezado del reparto decía «los dos carriles» porque se escribió antes del
> Paquete 3, y el Carril C se suma, no reemplaza. `A MEDIAS` cuenta como **no hecha**. Prohibido el
> porcentaje estimado a ojo (regla 50 §5).

- Daily de equipo: [`Daily-Noche-2026-09-25.md`](../Daily-Noche-2026-09-25.md) — **tres paquetes esta noche**, uno por sección de este documento.
- **Los cinco PRs están MERGEADOS contra `mockup`.** Horas en UTC:

| PR | Carril | Rama | Mergeado (UTC) | Avance |
|---|---|---|---|---|
| [#673](https://github.com/mdavila-2001/mantra-core-health/pull/673) | B · Carga masiva | `justin/carga-masiva-pantalla-2026-09-25` | 2026-09-25 15:22:39 | 60 / 68 |
| [#674](https://github.com/mdavila-2001/mantra-core-health/pull/674) | C · C6 historia del paciente | `claude/clinica-c6-historia-paciente` | 2026-09-25 15:23:05 | 6 / 9 |
| [#672](https://github.com/mdavila-2001/mantra-core-health/pull/672) | C · C4 reconsulta | `claude/clinica-c4-reconsulta` | 2026-09-25 16:49:59 | 10 / 12 |
| [#678](https://github.com/mdavila-2001/mantra-core-health/pull/678) | C · C8 integración | `claude/clinica-c8-integracion` | 2026-09-25 17:07:50 | 7 / 10 |
| [#675](https://github.com/mdavila-2001/mantra-core-health/pull/675) | A · Farmacia tienda y receta | `justin/farmacia-tienda-y-receta-2026-09-25` | 2026-09-25 17:15:41 | 33 / 41 |

## Cierre de la tanda — corrida del 2026-09-25 con la máquina libre

Todo lo que esa noche quedó `UNKNOWN` por no poder levantar un servidor se **observó**: hay 26
capturas, contraste y Regla 8 **medidos**, tres specs de Playwright que nunca se habían ejecutado
**ejecutados**, y la suite completa corrida y clasificada. **24 de las 29 microtareas abiertas,
cerradas.**

Trabajo y evidencia: **[PR #687](https://github.com/mdavila-2001/mantra-core-health/pull/687)** ·
reporte de este repo: [`docs/trabajo/2026-09-25-justin-cierre-tanda/REPORTE.md`](../../../../docs/trabajo/2026-09-25-justin-cierre-tanda/REPORTE.md)

| Carril | Antes | Ahora | Qué queda |
|---|---|---|---|
| A · Farmacia | 33 / 41 | **39 / 41** | 1 `EXTERNAL` (CI caído) · **1 defecto abierto**: el carrito |
| B · Carga masiva | 60 / 68 | **66 / 68** | 1 `BLOQUEADO` (API real) · 1 parcial (lector de pantalla) |
| C4 · Reconsulta | 10 / 12 | **11 / 12** | Espera la segunda pasada crítica |
| C6 · Historia | 6 / 9 | **8 / 9** | 1 `BLOQUEADO`: su spec exige API viva |
| C8 · Integración | 7 / 10 | **9 / 10** | Espera la segunda pasada crítica |

### Cuatro defectos que sólo aparecen mirando

**Corregidos en el PR #687:** el contraste de `.carga__nota`, que `axe` marcaba *serious* (4,27:1
contra el mínimo AA de 4,5:1), y el docblock del spec de C8, que seguía diciendo «no se ejecutó»
después de que lo corrieran 6/6.

**Abiertos, con dueño:**

1. **«Agregar la receta al carrito» no agrega nada** — botón habilitado, sin aviso, y el carrito
   dice «Tu carrito está vacío». Los 46 unitarios pasan porque miran el *store*; el navegador mira
   la pantalla. **→ Pablo** (el carrito y la cabecera son de la Ola 0).
2. **Los sellos de reconsulta suben solos** — `2, 3, 4, 5` en cuatro cargas de «Mis citas» sin que
   nadie agende; la captura a 375 muestra dos citas idénticas. **→ quien tenga `core/mock/`.**

### Lo que hace falta de otros

**Las ocho decisiones, con opciones y recomendación:** [`DECISIONES-EQUIPO.md`](../../../../docs/trabajo/2026-09-25-justin-cierre-tanda/DECISIONES-EQUIPO.md).

- **La segunda pasada crítica de las 26 capturas** — no puede ser propia (regla 35.1.6). Es lo
  único que separa a C4 y C8 de su última microtarea.
- **El cableado de `consulta-casilla-reconsulta`**: `FollowUpBlock` está escrito y **ninguna
  plantilla lo monta**. Bloquea 3 casos de C4. Era de **C1**, que no se entregó.
- **Itzan**: el endpoint de carga masiva **ya existe** en `origin/itzan/carga-masiva-motor-2026-09-25`,
  sin mergear. El bloqueo cambió: antes no estaba escrito.

### Lo que la corrida destapó del repo, que no es de este carril

**La suite completa está en rojo: 53 fallos de 7 950**, y ninguno es de estos carriles — demostrado
por bisección en siete cortes: verde hasta `#669`, rompe en **#670** (10) y suma en **#671** (38);
uno más es el renombre de C7 que no actualizó su spec. Los 6 `check-*.mjs` en rojo **ya fallaban en
el corte base**, y `lint` pasó de 6 a 19 errores durante la noche, en archivos ajenos. El **desborde
a 375 px** que se veía en cuatro pantallas es **del armazón** (`div.app-header__derecha`), no del
CSS de los carriles. `build` y `typecheck`: **exit 0**.

---

> [!warning] Lo que esta noche **no** tiene
> **Ningún carril alcanzó `REGRESSION_VERIFIED`.** Los carriles A, B y C corrieron en paralelo en la
> misma máquina con los servidores prohibidos (regla 70), así que **el Carril A no vio un navegador en
> toda la corrida** y su prueba visual es `UNKNOWN`. El Carril B cerró lo visual **al día siguiente**,
> el 2026-09-26, cuando la máquina quedó libre. Sólo C8 llegó a `VERIFIED`, y sólo para su resultado
> observable. La suite completa y `yarn build` **no** se corrieron en ningún carril: los corre el
> operador, centralizados.

---

## Carril A — Farmacia: la tienda, el buscador y la receta al carrito

> **AVANCE: 33 / 41 — 80,5 %.**

- Carril: [`Noche-Farmacia.TiendaYReceta`](Noche-Farmacia.TiendaYReceta/BuscadorPorPrecioYDistanciaYLaRecetaAlCarrito.md) (carriles 43 y 45 del plan)
- Corte: `origin/mockup` @ `bf2c3545…` → **el tuyo (después de la Ola 0):** `4ba17b1a` = `bf2c3545` (PR #660) **+ cherry-pick de `84a587d8`** (Ola 0 de Pablo, PR #671, que en ese momento seguía **abierto**)
- Rama: `justin/farmacia-tienda-y-receta-2026-09-25` · Peldaño alcanzado (regla 30): **`TESTED`** · visual **`UNKNOWN`**
- Reporte: [`docs/trabajo/2026-09-25-justin-farmacia-tienda/REPORTE.md`](https://github.com/mdavila-2001/mantra-core-health/blob/mockup/docs/trabajo/2026-09-25-justin-farmacia-tienda/REPORTE.md) (repo del front)

### 0. Arrancás cuando la Ola 0 esté publicada — y no antes de una hora

**No se esperó, y se declara (regla 65).** A la hora, Pablo tenía su PR #671 **abierto** sin mergear y
Marcelo **no había publicado** nada. Se trabajó sobre `origin/mockup` + cherry-pick de `84a587d8`, y los
únicos archivos ajenos del diff son exactamente los 6 de esa Ola 0, sin editar. Por eso **H1.S1.M1 quedó
`A MEDIAS`**: el CA pedía un corte posterior a los dos merges, y no lo es.

**La primera entrega visible, H3.S5, sí salió:** `my-account/pharmacy` apunta a `StoreFront`, que es lo
que Pablo necesitaba para borrar el hub en la Ola 3.

### 1. Instalación del estándar — pegá la salida acá

```text
$ ls .claude/skills | wc -l
NO CORRIDO — no se instaló `.claude/` en el checkout de trabajo

$ ls .claude/rules/[0-9]*.md | wc -l
NO CORRIDO — ídem

$ python .claude/hooks/plan_gate.py --self-test
NO CORRIDO — ídem
```

**Por qué, y qué se hizo en su lugar.** El repo del front **ya trae su propio `.claude/`**
(`project-design-system`, `visual-quality-gate`, `frontend-production-gate`,
`fable-refactor-orchestrator` y los revisores de `.claude/agents/`), y el prompt avisa de no pisarlo.
Copiar el estándar encima sin fusionarlo a mano habría sido exactamente lo que §1.1 prohíbe. Las
**reglas** 00–97 sí estaban cargadas en sesión y son las que se siguieron: plan antes del primer `Edit`,
estado por microtarea, escalera de evidencia y reporte con el avance primero. **Los candados
(`plan_gate`, `report_gate`, `blocker_gate`) no corrieron: el cumplimiento acá es por disciplina, no por
hook.** Vale igual para los carriles B y C.

- [x] Leí `skills-router` y las skills del lote.
- [x] Creé mi `PLAN.md` antes del primer `Edit`/`Write` de código — [`PLAN.md`](https://github.com/mdavila-2001/mantra-core-health/blob/mockup/docs/trabajo/2026-09-25-justin-farmacia-tienda/PLAN.md).

### 2. Baseline

| Comando | Exit code | Rojos previos | Clase (regla 80.4) |
|---|---|---|---|
| `corepack yarn lint` | 1 | **6** (4 en `playwright/**`, de Marcelo; 2 de función vacía en specs de seguros) | `PREEXISTING` — ajenos al carril, **no se tocaron** (regla 00 §3.2). Al cierre: los mismos 6, ninguno nuevo |
| `corepack yarn typecheck` | 0 | 0 | — |
| `corepack yarn test --watch=false` | **NO CORRIDO** | — | La suite entera estaba prohibida (otros tres agentes en paralelo). **H1.S1.M2 quedó `A MEDIAS` por esto**; mitigado con specs dirigidos de cada área tocada |

### 3. El servicio de búsqueda (H2) — lo que fija el spec

`pharmacy-search.service.spec.ts` → **22/22 PASS** (`evidencia/h2/`).

| Caso | Esperado | Resultado |
|---|---|---|
| «paracetamol», dos sedes 10,00 y 8,00, orden precio | 8,00 primero | **PASS** |
| sin origen, orden distancia | sin reordenar, `sinOrigen = true` | **PASS** |
| término de 1 letra | ninguna petición | **PASS** |
| fila con precio sin `availability()` | **no existe** | **PASS** |

### 4. La receta al carrito (H5) — lo que fija el spec

| Caso | Esperado | Resultado |
|---|---|---|
| receta con 3 medicamentos, 2 disponibles en la sede | 2 líneas + aviso «1 no se pudo agregar» | **PASS** · `where-to-buy.spec.ts` **46/46** (36 previos intactos + 10 nuevos) |
| carrito previo de otra sede | confirm; cancelar no cambia | **PASS** · `product-results.spec.ts` **9/9** |
| `createOrderRequest(toDraft(...))` | trae `medicationRequestId` | **PASS con reserva declarada (Q-J5):** `CartStore.toDraft` **no existe** en el corte. Se probó contra `createOrderRequest(borradorDePedido(...))`, que es el trecho donde el id podría perderse, **no** contra el camino que Pablo va a construir |

### 5. Checkpoints del turno

Los checkpoints se llevaron en el `PLAN.md` del carril, microtarea por microtarea, con su estado y su
peldaño. No se replican acá: la fuente es ese archivo.

### 6. Cierre

| Hito | Microtareas HECHO / total | Estado | Peldaño |
|---|---|---|---|
| H1 Corte y baseline | **1 / 3** | A MEDIAS (M1 corte previo a la Ola 0; M2 sin suite completa) | `RUNS` |
| H2 Servicio de búsqueda | **6 / 6** | HECHO | `TESTED` |
| H3 La home, resultados y rutas | **16 / 18** | A MEDIAS (S5.M3 fila del daily; S1.M6 capturas `BLOQUEADO`) | `TESTED` · visual `UNKNOWN` |
| H4 Mis recetas | **4 / 5** | A MEDIAS (faltan las capturas 375/1440) | `TESTED` · visual `UNKNOWN` |
| H5 Receta al carrito | **5 / 6** | A MEDIAS (recorrido manual `BLOQUEADO`) | `TESTED` |
| H6 Regresión y PR | **1 / 3** | A MEDIAS (sin suite/build/e2e; checks del PR sin arrancar) | `RUNS` |
| **Total** | **33 / 41 — 80,5 %** | **A MEDIAS** | **`TESTED`** |

- PRs: **[#675](https://github.com/mdavila-2001/mantra-core-health/pull/675) — `MERGEABLE`, no draft, y mergeado el 2026-09-25 17:15:41 UTC.**
- `git diff --stat origin/mockup -- src/app/features/account/cotizaciones` → tiene que estar vacío: **salida vacía ✓** (verificado; `evidencia/despues/pr.txt`)
- Qué quedó `A MEDIAS` (con las cuatro respuestas): **6 microtareas** — H1.S1.M1 (corte), H1.S1.M2 (baseline de la suite), H3.S5.M3 (esta fila del daily, que es justamente lo que este documento cierra), H4.S1.M5 (capturas 375/1440), H6.S1.M1 (regresión completa), H6.S1.M2 (checks del PR en cola, nunca arrancados). Las cuatro respuestas de cada una están escritas en el `REPORTE.md` del carril. **`BLOQUEADO` (2, cuentan como no hechas):** H3.S1.M6 y H5.S2.M2, las dos por exigir navegador.
- Qué quedó corriendo y se cerró: **nada.** Ningún servidor, ningún navegador, ningún proceso en segundo plano.

**Lo que este carril NO cubrió, y hay que saberlo:** toda la prueba visual (ni 375, ni 768, ni 1440, ni
tema oscuro, ni la doble revisión de la regla 35 — no hay capturas que revisar); el recorrido real contra
el simulador de punta a punta; la suite completa, el build y los e2e; el carrito de Pablo visto desde la
tienda (se afirma sobre el store, no sobre la cabecera).

---

## Carril B — Carga masiva: la pantalla (elegir modelo, arrastrar, validar, resumen)

> **AVANCE: 60 / 68 — 88,2 %.**

- Carril: [`Noche-CargaMasiva.PantallaDragAndDrop`](Noche-CargaMasiva.PantallaDragAndDrop/QueSeCargaArrastrarValidarSinGuardarVistaPreviaYResumen.md)
- Contrato: [`CONTRATO-CARGA-MASIVA.md`](../CONTRATO-CARGA-MASIVA.md) §2 (consumís), §3 (`data-testid`: los ponés vos)
- Repo: `alovida/mantra-core-health` · Ref: `origin/mockup` @ `bf2c3545` · Rama propia: `justin/carga-masiva-pantalla-2026-09-25`
- Peldaño alcanzado (regla 30): **`TESTED`** contra el doble · contra la **API real: `UNKNOWN`** · **visual: `UNKNOWN` la noche del 25, cerrado el 2026-09-26**
- Reporte: [`docs/trabajo/2026-09-25-justin-pantalla/REPORTE.md`](https://github.com/mdavila-2001/mantra-core-health/blob/mockup/docs/trabajo/2026-09-25-justin-pantalla/REPORTE.md)

### 0. Tu carril destraba a Marcelo: publicá temprano

| Qué publicás | Para quién | Hito | Cuándo | Publicado (SHA + hora) |
|---|---|---|---|---|
| Doble del simulador en tres niveles (`terminology.handlers.ts`) | Marcelo (corre su E2E contra tu rama) | H2 | **hora 1,5** | **✓ `8926f5af`, push 04:00:55 -0400 (08:00:55 UTC)** — dentro de la ventana |
| Pantalla con los `data-testid` de §3 | Marcelo (H3, H4.S2) | H4 | segunda mitad | **✓ en el PR #673, mergeado 15:22:39 UTC.** Los **14 `data-testid`** están puestos con esos nombres exactos, **una sola vez cada uno**, con una prueba que los cuenta uno por uno para que nadie los renombre sin enterarse |

### 1. Instalación del estándar — pegá la salida acá

```text
$ ls .claude/skills | wc -l
NO CORRIDO — ver la explicación del Carril A §1 (el repo del front trae su propio `.claude/`)

$ ls .claude/rules/[0-9]*.md | wc -l
NO CORRIDO — ídem

$ python .claude/hooks/plan_gate.py --self-test
NO CORRIDO — ídem
```

- [x] Leí `skills-router` y las skills del lote.
- [x] Creé el `PLAN.md` antes del primer `Edit`/`Write` de código.

### 2. Avance por hito (se llena al cerrar)

Reconstruido microtarea por microtarea desde el `PLAN.md` del carril; la suma cuadra exactamente con el
total del `REPORTE.md` (**60 HECHO · 2 PENDIENTE · 3 A MEDIAS · 3 DESCARTADO = 68**).

| Hito | Micro | HECHO | A MEDIAS | BLOQUEADO | DESCARTADO | Nota |
|---|---|---|---|---|---|---|
| H1 Corte, baseline, pantalla de hoy | 10 | **9** | — | — | — | 1 `PENDIENTE`: el NDJSON de 3 líneas no se subió (el recorrido usó CSV y XLSX). M3 y M5 se cerraron el **2026-09-26** con navegador |
| H2 Doble del simulador | 7 | **7** | — | — | — | 25/25 del manejador (4 preexistentes + 21 nuevas). Publicado a la hora 1,5 |
| H3 Cliente y tipos | 7 | **7** | — | — | — | 37/37 del cliente (eran 26) |
| H4 Pantalla en tres pasos | 27 | **25** | 2 | — | — | `A MEDIAS`: S3.M3 recorrido de teclado (escrito y derivado del DOM, **no observado**) y S3.M7 recorrido contra `yarn dev` (faltan `no-es-nada.pdf` y `error-red.csv`) |
| H5 Prueba visual y regresión | 6 | **4** | — | — | 1 | Las **24 capturas** y el scroll a 375 se cerraron el **2026-09-26**. 1 `PENDIENTE`: contraste en oscuro **no medido**. 1 `DESCARTADO`: la suite entera la corre el operador |
| H6 API real, PR, cierre | 11 | **8** | 1 | — | 2 | `A MEDIAS`: los checks del PR nunca arrancaron. `DESCARTADO` ×2: levantar la API e ir contra ella — la rama de Itzan (`e57c0126`) trae **sólo el contrato de fila §1** |

### 3. Qué se cerró contra el doble (regla 65)

**Todo lo que este carril declara verificado, lo está contra el doble del simulador, no contra la API
real.** 132 pruebas dirigidas en verde (25 manejador + 37 cliente + 39 pantalla + 31 barrido del
simulador); baseline de esos mismos archivos: 66. Ninguna prueba se borró, se saltó ni se debilitó.

Verificado contra el doble: los tres niveles de §2 decididos por nombre de archivo con sus códigos y
estados · `aborted` ⇔ `errors > 0` ⇔ `inserted = 0` (Q-2) · `batchId` nulo en dry-run sin registrar lote
(Q-4) · un código ya existente se **omite**, no se actualiza (Q-7) · el `FormData` con `file`, `dryRun` y
`profile` · la plantilla como blob con su `Content-Disposition` · los tres candados del contrato (**no se
importa sin validar**, **sin doble envío**, **nada se pierde ante fallo**: red, 413, 422 y 500).

**H6.S1 — contra la API real: nada.** La rama de Itzan existe pero el endpoint HTTP que esta pantalla
consume **no está escrito** (cero apariciones de `dryRun`, `import-template` e `IMPORT_FORMAT_UNSUPPORTED`
en toda su rama, verificado con `grep`). Queda pendiente de contrastar: el estado HTTP del dry-run (Q-J1),
los valores de `preview`/`errorSamples`, la plantilla XLSX real, el S8 y el 401/403 real.

> [!important] Tres cosas que el equipo tiene que saber al integrar
> 1. **El doble NO puede emitir el S8 «la petición no llegó».** El estado 0 sólo lo produce `emitirFallo`
>    del interceptor, y lo dispara la sesión. `error-red.*` devuelve un **503 con `correlationId`**, que es
>    lo más cercano. Para ver el S8 real en el navegador hay que declarar el fallo en `sessionStorage` con
>    la clave `mock:fallos`; la receta literal está en la cabecera del manejador.
> 2. **Los códigos `IMPORT_*` no están en `API_ERROR_CODES`** (`core/http/api-error.ts`), así que
>    `errorToViewState` los devuelve como error genérico. La pantalla los lee del cuerpo crudo sin tocar
>    ese archivo, que es de otro carril. **Pablo / Itzan: agregarlos al integrar** (Q-J4).
> 3. **La plantilla XLSX del doble no es un libro de Excel**, es el mismo texto CSV con el tipo y el
>    nombre correctos. Armar uno de verdad exige una dependencia y este carril la tenía prohibida.

### 4. Defectos que Marcelo te reportó

**Ninguno consta.** No hubo daily de Marcelo en esta corrida, lo que además dejó **Q-9 sin confirmar** (si
el perfil `designaciones` existe): la pantalla ofrece **una sola opción de perfil**, «Conceptos», porque
ofrecer una que el servidor va a rechazar es peor que no ofrecerla. **Marcelo: confirmar.**

**Defecto propio, encontrado y corregido:** se pisó un spec ajeno.
`core/mock/handlers/terminology.handlers.spec.ts` ya existía con 4 pruebas (C-20) y se creó con `Write`
dándolo por inexistente. Lo destapó `git diff origin/mockup --stat`. Corregido **antes** del PR: se
recuperó el original, el `describe` nuevo quedó anidado debajo, y el archivo tiene ahora **25** pruebas;
el diff filtrado por líneas borradas sale **vacío**.

### 5. Procesos que quedaron corriendo

**Ninguno.** La noche del 25 no se levantó ningún `ng serve`, ninguna API, ningún contenedor ni ningún
navegador: sólo `yarn test --include` dirigidos, `typecheck` y `lint`, todos en primer plano y terminados.
El 2026-09-26, con la máquina libre, se levantó `yarn dev` para cerrar lo visual y se cerró al terminar.

---

## Cómo repartí la noche entre los carriles

Los tres son del mismo repo (`mantra-core-health`), cada uno en **su worktree y su rama**; ningún commit
se mezcló entre carriles. El Carril A tenía la precondición externa de la Ola 0 y **no se cumplió a la
hora**, así que se arrancó con cherry-pick y se declaró (regla 65). Los cruces de archivos que el reparto
marcaba se respetaron y se demostraron con diffs vacíos: Farmacia no entró en
`medical-record.{ts,html,css,spec.ts}`, C6 no entró en `where-to-buy/**`, y el Carril B no tocó
`file-input`, `app.routes`, `navigation`, `playwright` ni `alovida/terminologia`.

**El cuello de botella de la noche fue la máquina, no el alcance:** cuatro carriles en paralelo con los
servidores prohibidos. Eso es lo que dejó sin navegador a los carriles A y B y sin suite completa a todos.

---

## Carril C — Encuentro clínico (Paquete 3, agregado por el propietario): C4, C6, C8

> **AVANCE DEL CARRIL C: 23 / 31 — 74,2 %.** Sale de `microtareas HECHO / total`. `A MEDIAS` cuenta como no hecha. Se suma a tus carriles A y B, no los reemplaza.

- Plan maestro del paquete: [`PLAN-MAESTRO.md`](../../../../docs/trabajo/2026-09-25-plan-y-reparto-encuentro-clinico/PLAN-MAESTRO.md) · Daily de equipo, sección «Paquete 3»: [`Daily-Noche-2026-09-25.md`](../Daily-Noche-2026-09-25.md)
- Repo: `mantra-core-health` · Ref: `origin/mockup` · Corte de referencia `bf2c3545` → **el mío: `bf2c3545` en los tres carriles**
- Instalación del estándar: la misma del Carril A §1 — **no se instaló `.claude/`**, por el mismo motivo.
- Reportes: [`docs/trabajo/2026-09-25-encuentro-clinico/`](https://github.com/mdavila-2001/mantra-core-health/tree/mockup/docs/trabajo/2026-09-25-encuentro-clinico) — uno por carril, más el `REPORTE-FINAL.md` del paquete, que lo escribió C8.

| Carril | Prompt | Corte propio | Rama | HECHO/total | Peldaño (regla 30) | PR | Push a `mockup` | Bloqueos / avisos |
|---|---|---|---|---|---|---|---|---|
| C4 · Reconsulta como cita real | [prompt](Noche-EncuentroClinico.C4-Reconsulta/ReconsultaComoCitaReal.md) | `bf2c3545` | `claude/clinica-c4-reconsulta` | **10/12** | `TESTED` | [#672](https://github.com/mdavila-2001/mantra-core-health/pull/672) | **✓ mergeado 16:49:59 UTC** | El Playwright está **escrito pero nunca ejecutado**: `scripts/pw-guard.mjs` —su DoD literal— **no existe en el árbol**, era artefacto de C0, que no se entregó |
| C6 · Historia clínica del paciente con encuentros | [prompt](Noche-EncuentroClinico.C6-HistoriaPaciente/HistoriaClinicaDelPacienteConEncuentros.md) | `bf2c3545` | `claude/clinica-c6-historia-paciente` | **6/9** | `TESTED` en lo ejercitable · **`WRITTEN`** en el Playwright y en todo lo visual | [#674](https://github.com/mdavila-2001/mantra-core-health/pull/674) | **✓ mergeado 15:23:05 UTC** | El PDF con las dos secciones nuevas **no se abrió**: el DoD pide renderizarlo con pdf.js y eso exige navegador |
| C8 · Integración y recorrido completo (mañana) | [prompt](Noche-EncuentroClinico.C8-Integracion/IntegracionYRecorridoCompleto.md) | `bf2c3545` | `claude/clinica-c8-integracion` | **7/10** | **`VERIFIED`** para el resultado observable (navegador real contra `yarn dev` en el 4218) | [#678](https://github.com/mdavila-2001/mantra-core-health/pull/678) | **✓ mergeado 17:07:50 UTC** | 2 `DESCARTADO`: los barridos dependen de `pw-guard` (no existe) y la doble revisión se hace sobre capturas, que este turno no produjo |

**Lo que C8 dejó, que es el punto del paquete:** en «Mi historia», al desplegar una atención, la línea del
encuentro dice **«Reconsulta el ⟨fecha⟩ a las ⟨hora⟩»** — el dato que C4 produjo y C6 no podía leer.
Verificado en navegador, prueba 5 del recorrido, en verde. Además: los `TODO C8` bajaron de **16 a 6**
(los 6 que quedan dependen de C1, C2, C3 y C0, que **no se entregaron**), el recorrido Playwright
`clinica-c8-recorrido-completo.spec.ts` pasó **6 de 6 sin saltos**, y los merges de C4 y C6 entraron con
**0 conflictos**.

### Lo que publicás para otros (con SHA + hora)

- **C4 → C6/C8:** `followUpOf` en `POST /scheduling/appointments/direct` y en las dos lecturas, con el
  `startAt` del origen resuelto. Entregado en el PR #672.
- **C6 → C8:** el organismo `app-encounter-timeline` (presentacional puro, en el stock: 550 componentes,
  35 organismos). Entregado en el PR #674.
- **C8 → el paquete:** `PENDIENTES-BACKEND.md` con **P39–P42** (P42 completo; P39/P40/P41 declarados **sin
  carril entregado**, que es lo que son) y el `REPORTE-FINAL.md`.

### Baseline del worktree de este carril

| Comando | Exit code | Rojos previos | Clase (regla 80.4) |
|---|---|---|---|
| `yarn lint` | 1 | **6**, los mismos del Carril A | `PREEXISTING` — ajenos, no se tocaron. Al cierre: sin rojos nuevos |
| `yarn typecheck` | 0 | 0 | — |
| `yarn test --watch=false --include=<mis carpetas>` | 0 | 0 | **C4:** 24/24 handlers · 42/42 cliente · 14/14 bloque · 125/125 agenda · 84/84 mis citas · 5/5 detalle. **C6:** 33 pantalla · 19 modelo · 12 organismo (73 propias + 61 de regresión). **C8:** **361 pruebas** de los 10 specs que el carril movió |

### Doble revisión crítica de las capturas (regla 35)

**No se hizo, y no se puede simular: no hay capturas que revisar.** Ninguno de los tres carriles produjo
capturas — C4 y C6 no levantaron navegador, y C8 lo levantó para **ejercitar comportamiento**, no para
juzgar acabado visual (por eso su C8.H2.M4 quedó `DESCARTADO` con ese motivo escrito). La segunda pasada
adversarial, además, no puede ser propia (regla 35.1.6).

### Cierre

- PR: **#672, #674 y #678, los tres mergeados contra `mockup`** · Push a `mockup` verificado: **sí, los tres** · `REPORTE.md`: **uno por carril + `REPORTE-FINAL.md`** · Pendiente de backend redactado: **`PENDIENTES-BACKEND.md`, P39–P42** · `// TODO C8` dejados: **6** (de 16; los 6 restantes dependen de C0–C3, no entregados)

---

## Reserva sobre los PRs (regla 35.2) — leer antes de citar «verde»

**En ninguno de los cinco PRs se vio un check pasar.** Los tres checks (`verificar`, `dependencias`,
`e2e`) quedaron **en cola sin arrancar**, con `mergeStateStatus: UNSTABLE` por *pendientes*, **ninguno en
`fail`**. Está clasificado **`EXTERNAL`** (regla 80.4) con evidencia de que no es de estas ramas: las
cuatro corridas más recientes del repo —de cuatro ramas y dos personas distintas— estaban todas `queued`
sin runner, y el propio `CLAUDE.md` del front declara que «el CI propio está caído; los `check-*.mjs` se
corren a mano».

Lo que sustituyó al CI: `typecheck` en 0, `lint` sin rojos nuevos, los specs dirigidos de cada carril con
su salida pegada, y en C4 además `check-architecture` y `check-css-tokens` a mano. **No se declara verde:
se declara que ningún check falló y que ninguno llegó a correr.** Los cinco PRs se mergearon igual.

## Por qué este daily se publicó tarde

El trabajo se ejecutó y se publicó **en el repo del front** la noche del 25 y la mañana del 26. Este
daily, que vive en **otro repositorio**, quedó sin llenar — y es literalmente la microtarea **H3.S5.M3**
del Carril A, que su propio reporte dejó `A MEDIAS` con este motivo: «el daily vive en otro repositorio,
fuera del worktree de trabajo de esta sesión». Mientras tanto, desde acá el carril se leía como
`0 / 109 — 0,0 %`, es decir, como si no se hubiera hecho nada. **Publicarlo cierra esa microtarea.**

---

## Carril D — Diagnóstico con IA y glosario masivo (Paquete 4, pedido del propietario el 2026-09-25)

> Agregado después del reparto, **sin reemplazar** A, B ni C. Plan, hechos verificados y contratos en
> [`docs/trabajo/2026-09-25-diagnostico-ia-glosario/PLAN.md`](../../../../docs/trabajo/2026-09-25-diagnostico-ia-glosario/PLAN.md) ·
> prompt en [`Noche-DiagnosticoIA.D1-D4/`](Noche-DiagnosticoIA.D1-D4/DiagnosticoConIAYGlosarioMasivo.md).

- Repos: `mantra-core-health` (`origin/mockup` @ `8b50d188`, worktree `wt-justin-diagnostico-ia-2026-09-25`, rama `justin/diagnostico-ia-glosario-2026-09-25`) y `PabloArauzCaballero/AlovidaAIService` (`feat/triage-service` @ `5a60aec`, rama `justin/glosario-corpus-diagnostico-2026-09-25`).
- **Aviso al equipo:** D3 entrega **C3** (diagnóstico presuntivo → confirmar/rechazar con evidencia), que no tiene rama ni PR. Si alguien lo retomó en paralelo, que lo diga acá antes de tocar `diagnosis-block/**`.
- Baseline AI service: `corepack yarn --ignore-engines build && node --test dist/test/*.test.js` → exit 0 (node 24 local; el servicio pide 22).
- **Decisiones del usuario (25/09, tarde):** D1 y D2 en dos sesiones (repos distintos) · D2 recortado al determinista · sin suite completa ni build del front en esta tanda (van en corrida aparte con máquina libre) · D3/D4 para otra tanda · **A1 = sí** (apoyo al profesional, `disclaimer` siempre) · **A2 = sí** (`patient` sólo viaja al prompt, no pesa).

| Carril | HECHO/total | Peldaño | PR | Avisos |
|---|---|---|---|---|
| D1 · Corpus masivo del glosario | **9/11** | `TESTED` · visual `UNKNOWN` | [#704](https://github.com/mdavila-2001/mantra-core-health/pull/704) `MERGEABLE` | 2 289 términos (69 curados + 195 enfermedades + 107 análisis + 1 918 ICD-10-CM); 323 códigos verificados contra el NLM. Faltan build (fixture de ~1 MB, carga diferida sin medir) y capturas: corrida aparte con máquina libre |
| D2 · AI service: `glosario.v1` + `/v1/diagnosis/suggest` | **7/8** | `TESTED` (91/91, `docs:check` 0) | [#2](https://github.com/PabloArauzCaballero/AlovidaAIService/pull/2) `MERGEABLE` | Sólo determinista: el camino con modelo va en un 2.º PR (decisión del usuario). Corpus pinneado a `381ce773`: **resincronizar cuando D1 entre a `mockup`**. Sin despliegue (sin SSH) |
| D3 · Tabla de presuntivos → evidencia → cierre (C3) | 0/6 | `TODO` | — | **Otra tanda** (decisión del usuario 25/09: 4–6 h de front con navegador) |
| D4 · Cierre del formulario con orden + tentativo (IA) | 0/5 | `TODO` | — | **Otra tanda**; no depende del modelo: el determinista de D2 responde siempre |
