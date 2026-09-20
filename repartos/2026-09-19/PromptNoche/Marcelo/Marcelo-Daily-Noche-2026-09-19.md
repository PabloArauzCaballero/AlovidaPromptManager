# Daily de Marcelo — turno noche — 2026-09-19

> **Estado:** `IN_PROGRESS`. H1, H2 y H3 cerrados `HECHO` (29/29 microtareas abiertas). H4-H6 en `TODO` (54 - 29 = 25 restantes), no abiertos por decisión de alcance — ver §5.
> **Hallazgo que domina el turno, y su arreglo.** `GET /scheduling/bookings/:id`, `POST .../cancel` y `POST .../reschedule` no verificaban de quién era la cita: cualquier paciente, de cualquier organización, la leía, la cancelaba y la movía. Confirmado por ejecución contra la API real y **corregido en el mismo turno**: PR [mantra-core-health-api#447](https://github.com/mdavila-2001/mantra-core-health-api/pull/447), rama `marcelo/fix-authz-citas-ajenas`, commit `9ff1542d` sobre `dev` @ `33f17785`. Reverificado: intruso **403**, titular **200**, sobre la misma cita. Suite de `scheduling` **483/483**; sin el arreglo, 4 de las 7 pruebas nuevas fallan.
> **Corrección de mi propio hallazgo:** de los 4 rojos que declaré, 3 eran bugs y están arreglados; el cuarto (`GET /scheduling/slots` entre organizaciones) se **reclasificó a `DECISION_REQUIRED`** al ir a corregirlo — no lleva datos de paciente y el cliente pide explícitamente poder ver todos los médicos disponibles, así que restringirlo rompería el recorrido. Es pregunta de producto, no defecto.

- **Persona:** Marcelo · **Turno:** noche · **Fecha:** 2026-09-19 · **Línea:** B · **Rol:** cierre funcional e integración
- **Tu prompt:** [Recorrido del registro: selección, casos y aceptación](Noche-PilotoDeAvisos.Registro/RecorridoCasosYAceptacion.md)
- **Documento de H1:** [RECORRIDO-PRIORITARIO-2026-09-20.md](Noche-PilotoDeAvisos.Registro/entregables/RECORRIDO-PRIORITARIO-2026-09-20.md)
- **Documento de H2:** [CASOS-ACEPTACION-M06-2026-09-20.md](Noche-PilotoDeAvisos.Registro/entregables/CASOS-ACEPTACION-M06-2026-09-20.md)
- **Documento de H3:** [PERMISOS-ESTADOS-DINERO-M06-2026-09-20.md](Noche-PilotoDeAvisos.Registro/entregables/PERMISOS-ESTADOS-DINERO-M06-2026-09-20.md)
- **Reporte consolidado (H1+H2+H3):** [REPORTE.md](Noche-PilotoDeAvisos.Registro/entregables/REPORTE.md)
- **Daily del equipo:** [Daily-Noche-2026-09-19.md](../Daily-Noche-2026-09-19.md)
- **6 hitos · 18 subtareas · 54 microtareas**

## 1. Instalación del estándar — es lo primero, no lo último

- [x] `ls .claude/skills | wc -l` → **176**, salida pegada abajo.
- [x] `python .claude/hooks/plan_gate.py --self-test` → **11 PASS, 0 FAIL**, salida pegada.
- [x] Cargados `skills-router` y las skills de H1-H3: `requirements-and-acceptance`, `vertical-slicing`, `outcome-first`, `factual-discovery`, `context-thrift`, `scope-discipline`, `test-case-design-techniques`, `synthetic-test-data-generation`, `seed-data-catalogs`, `edge-case-data-catalog`, `data-privacy-phi`.
- [x] El plan de H1-H3 vivió en modo plan de la sesión (aprobado antes del primer `Write`) — regla 20 permite que el plan viva en la estructura propia del carril; no se duplicó en `docs/trabajo/`.

```text
$ ls .claude/skills | wc -l
176
$ ls .claude/rules/*.md | wc -l
15   (14 reglas numeradas + README.md; la ficha esperaba "14" contando sólo las reglas)
$ python .claude/hooks/plan_gate.py --self-test
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
exit_code=0
```

Salida completa: [`evidencia/H0_instalacion-estandar.txt`](Noche-PilotoDeAvisos.Registro/evidencia/H0_instalacion-estandar.txt).

**Límite registrado:** el estándar no se copió dentro de `mantra-core-health-api/.claude/` (no se tocó `src/` de ningún repo, ficha §0); en la raíz del workspace corren los hooks de ATLAS, no `plan_gate`/`report_gate`. La disciplina de plan/reporte se sostuvo igual, de forma manual.

## 2. Avance por hito

**29 / 54 microtareas en `HECHO`.** Se calcula, no se estima.

| Hito | Prioridad | Microtareas | HECHO | Estado |
|---|---|---:|---:|---|
| **H1** — Seleccionar el recorrido prioritario del registro y sus relaciones | `BLOQUEANTE` | 13 | **13** | **`HECHO`** |
| **H2** — Diseñar los casos de aceptación del recorrido y sus datos | `ALTA` | 8 | **8** | **`HECHO`** |
| **H3** — Probar permisos, estados y dinero del recorrido | `ALTA` | 8 | **8** | **`HECHO`** |
| **H4** — Ejercitar el recorrido que cruza varios módulos | `MEDIA` | 8 | 0 | `TODO` |
| **H5** — Ejecutar la aceptación del registro con los participantes reales disponibles | `ALTA` | 8 | 0 | `TODO` |
| **H6** — Emitir el dictamen de aceptación con sus límites externos | `ALTA` | 9 | 0 | `TODO` |
| **TOTAL** | | **54** | **29** | **29/54 = 54 %** |

**H1** (`HECHO`, 13/13): sin cambios respecto de la entrega anterior — ver §3.

**H2.S1** (`HECHO`, 3/3): 11 casos de camino feliz + 22 negativos (8 autorización, 9 dato inválido, 5 estado), oráculo de cada uno declarado sin auto-referencia (4 casos quedan `DECISION_REQUIRED`, no cuentan como aceptación).
**H2.S2** (`HECHO`, 3/3): grafo sintético de 2 organizaciones sin PII real; procedencia de 8 catálogos (5 sin fuente completa, declarados así); 8 datos sin regla para generarlos, cada uno con dueño.
**H2.S3** (`HECHO`, 2/2): 11 pasos contrastados contra el cliente (8 con párrafo, 3 `AGREGADO`); 9 ítems del cliente que M-06 no cubre.

**H3.S1** (`HECHO`, 3/3): ADV-04 de lectura y escritura ejecutadas contra la API real — **4 celdas en `FAIL`** de 19 ejercitadas/declaradas (kill-test del hito falla: otro paciente y otra organización leen y escriben la cita ajena). Causa raíz localizada con archivo:línea.
**H3.S2** (`HECHO`, 2/2): tabla de transiciones con fuente; dos intentos de transición ilegal, ambos rechazados por el backend con `422 INVALID_STATE_TRANSITION` (esta parte del recorrido **sí** está bien construida).
**H3.S3** (`HECHO`, 3/3): dinero en `numeric` (no `float`, pero tampoco entero de la menor unidad); 4 juegos de conceptos de moneda sin reconciliar + 6 placeholders; sin lógica de redondeo; 5 datos monetarios sin definir, cada uno con dueño.

> Seis hitos no entran en una noche, y está dicho en tu prompt. H1+H2+H3 cierran completos;
> H4-H6 quedan en `TODO` explícito, no recortados en silencio — ver §5 «Qué entregás vos».
> **Recomendación no vinculante:** dado el `PRODUCT_BUG` de autorización que H3 confirmó por
> ejecución, puede rendir más priorizar su fix (4 líneas: reusar `assertPuedeActuarPorElPaciente`
> en `cancel()`/`reschedule()`) antes de abrir H4 sobre un recorrido que hoy no protege ni la
> lectura ni la escritura de la cita. Decisión de coordinación, no mía.

## 3. Detalle de las microtareas que tocaste

| ID | Estado | Comando ejecutado | Exit code | Ruta de la evidencia |
|---|---|---|---|---|
| H0 | `HECHO` | `ls .claude/skills \| wc -l`; `python .claude/hooks/plan_gate.py --self-test` | 0 | `evidencia/H0_instalacion-estandar.txt` |
| H1.S1.M1 | `HECHO` | `sha256sum`, `python -m zipfile`, `grep` sobre puerto y bóveda | 0 | `evidencia/H1.S1.M1_busqueda-registro-original.txt` |
| H1.S1.M2 | `HECHO` | `git fetch`, `git log -1`, `git rev-list --count`, `git merge-base --is-ancestor` × 4 checkouts | 0 | `evidencia/H1.S1.M2_cortes.txt` |
| H1.S1.M3 | `HECHO` | `node -e` sobre `angular.json`/`package.json`; `node scripts/check-real-api-config.mjs` | 0 | `evidencia/H1.S1.M3_entorno-que-se-compila.txt` |
| H1.S1.M4 | `HECHO` | `grep -n "mockBackend" RECORRIDO-PRIORITARIO-2026-09-20.md \| head -1` → línea 7 | 0 | `evidencia/H1.S1.M4_advertencia.txt` |
| H1.S2.M1 | `HECHO` | `grep -c "auxiliares del paquete"` → 1 | 0 | `evidencia/H1.S2.M1_orden-catalogo.txt` |
| H1.S2.M2 | `HECHO` | `grep -c "Recorrido elegido"` → 1; greps de evidencia de descarte | 0 | `evidencia/H1.S2.M2_eleccion.txt` + `_descartes-evidencia.txt` |
| H1.S2.M3 | `HECHO` | `grep`/`ls` sobre `scheduling.module.ts`, `notifications.service.ts`, `docker-compose.yml` | 0 | `evidencia/H1.S2.M3_participantes.txt` |
| H1.S2.M4 | `HECHO` | `ls src/modules`; `grep -rln` banderas demo; `grep -rn "billing\|invoice\|factura"` | 0 | `evidencia/H1.S2.M4_exclusion-cobro.txt` |
| H1.S2.M5 | `HECHO` | `grep -n` + lecturas de rango en API/front/móvil, 11 pasos | 0 | `evidencia/H1.S2.M5_localizadores.txt` |
| H1.S3.M1 | `HECHO` | `grep -n` imports de `scheduling.module.ts`; `git show origin/dev:...H1-ficha-relacion.md` | 0 | `evidencia/H1.S3.M1_relaciones.txt` |
| H1.S3.M2 | `HECHO` | `grep -c "ADAPTER_VERIFIED_WITH_DOUBLES"` → 3 | 0 | `evidencia/H1.S3.M2_dobles-vs-reales.txt` |
| H1.S3.M3 | `HECHO` | `grep -nE "Q-0[123]\|TEAM_CAPACITY"` sobre daily del equipo | 0 | `evidencia/H1.S3.M3_capacidad.txt` |
| H1.S3.M4 | `HECHO` | `grep -c "DESCONOCIDO"` → 1 | 0 | `evidencia/H1.S3.M4_demanda-vs-capacidad.txt` |
| H2.S1.M1 | `HECHO` | `grep -c '^### CA-M06-F'` → 11; `grep -ciE 'controller\|service\|\.ts\b'` sobre §1-§2 → 0 | 0 | `evidencia/H2.S1.M1_casos-felices.txt` |
| H2.S1.M2 | `HECHO` | `grep -c '^### CA-M06-N-AUTH\|VAL\|EST'` → 8/9/5 | 0 | `evidencia/H2.S1.M2_casos-negativos.txt` |
| H2.S1.M3 | `HECHO` | `grep -ciE '\| *(el sistema\|lo que hace el sistema) *\|'` → 0 | 0 | `evidencia/H2.S1.M3_oraculo.txt` |
| H2.S2.M1 | `HECHO` | `grep -c '@example.test'` ≥ 3; `grep -cE 'SINT-[0-9]{9}'` ≥ 3; correos reales → 0 | 0 | `evidencia/H2.S2.M1_datos-sinteticos.txt` |
| H2.S2.M2 | `HECHO` | `grep -c 'SIN PROCEDENCIA REGISTRADA'` → 5 | 0 | `evidencia/H2.S2.M2_procedencia.txt` |
| H2.S2.M3 | `HECHO` | `grep -c '^| DR-M06-'` → 8 | 0 | `evidencia/H2.S2.M3_decision-required.txt` |
| H2.S3.M1 | `HECHO` | `grep -cE '^\| (1[01]\|[1-9]) \|'` → 11 | 0 | `evidencia/H2.S3.M1_correspondencia.txt` |
| H2.S3.M2 | `HECHO` | `grep -cE '^\| [1-9] \|'` → 9 | 0 | `evidencia/H2.S3.M2_no-cubierto.txt` |
| H3.0 | `HECHO` | `yarn build` (exit 0); `GET /health` → 200; PID propio en `:3000` | 0 | `evidencia/H3.0_api-arranque.txt` |
| H3.S1.M1 | `HECHO` | 9 llamadas HTTP reales (arnés propio en scratchpad); 4 en `FAIL` | 1* | `evidencia/H3.S1.M1_adv04-lectura.txt` + `_root-cause-cancel-reschedule.txt` |
| H3.S1.M2 | `HECHO` | 2 rondas de llamadas HTTP + consulta posterior; ronda 1 contaminada declarada, ronda 2 limpia con 2 `FAIL` | 1* | `evidencia/H3.S1.M2_adv04-escritura.txt` + `_ronda2.txt` |
| H3.S1.M3 | `HECHO` | Matriz consolidada de las 19 celdas de M1/M2 | 0 | `evidencia/H3.S1.M3_matriz-autorizacion.txt` |
| H3.S2.M1 | `HECHO` | `sed -n '18,66p' booking-state-machine.ts` | 0 | `evidencia/H3.S2.M1_transiciones-fuente.txt` |
| H3.S2.M2 | `HECHO` | 2 transiciones ilegales × 2 rondas → 4× `422 INVALID_STATE_TRANSITION` | 0 | `evidencia/H3.S2.M2_transicion-ilegal*.txt` |
| H3.S3.M1 | `HECHO` | `SELECT` sobre `information_schema.columns` (cliente `pg` del repo) | 0 | `evidencia/H3.S3_sql-dinero-y-rls.txt` |
| H3.S3.M2 | `HECHO` | `SELECT` sobre `terminology.catalog_concepts`; `grep` de redondeo en `scheduling` | 0 | mismo archivo |
| H3.S3.M3 | `HECHO` | Lista `DR-M06-DINERO-01..05` en el documento | 0 | dentro de `PERMISOS-ESTADOS-DINERO-M06-2026-09-20.md` §3.M3 |

*`exit_code=1` en H3.S1.M1/M2 es el propio arnés marcando que hubo al menos un desvío respecto de la regla (`expect` no cumplido) — es la señal correcta de que el `FAIL` se detectó, no un fallo de ejecución del comando.

## 4. Qué entregás vos

| Al cerrar | A quién | Qué exactamente | Entregado |
|---|---|---|---|
| **H1** | Justin | Las relaciones: de ahí sale qué adaptador arranca primero | **`SÍ`** — §13 del documento: la siguiente relación es `avisos → chat SupportAdmin` (TAREA-15) |
| **H1** | Itzan | Si el recorrido exige una escritura atómica que cruza capacidades | **`SÍ`** — §13: reserva + alta de paciente en `profiles`, en la misma transacción; el aviso queda deliberadamente fuera |
| **H1** | Ender | Qué garantía funcional le exige el recorrido al aviso | **`SÍ`** — §13 y §11: tensión citada con ruta:línea de ambos lados, sin resolver |
| **H1** | Pablo | El estado del registro funcional original y la demanda contra capacidad | **`SÍ`** — §13: Q-04 cerrada (el `.docx` está en `RealDataSeeds/`); tabla de §10 |
| **H2** | Justin | Los casos negativos de autorización: van a su matriz | **`SÍ`** — §10 de H2: los 8 `CA-M06-N-AUTH-*`, con 3 ya cubiertos por sus dobles en `origin/dev` |
| **H2** | Ender | Qué reglas del recorrido el contrato todavía no expresa | **`SÍ`** — §10 de H2: garantía de entrega, ventana de `debounceKey`, «exactamente uno» de `recipient`, chat sólo para cambio de estado |
| **H2** | Pablo | Qué datos necesita el laboratorio para estos casos | **`SÍ`** — §10 de H2: grafo sintético completo de §4 |
| **H3** | Justin | Los negativos de autorización que hay que llevar a la relación | **`SÍ`** — §5 de H3: los 4 `FAIL` confirmados por ejecución |
| **H3** | Ender | Qué transición o regla de dinero el contrato no expresa | **`SÍ`** — §5 de H3: ninguna regla monetaria nueva; sí el dato lateral de que la cancelación ilegítima no dejó aviso a la víctima |
| **H3** | Pablo | Los controles faltantes, para priorizarlos | **`SÍ`** — §5 de H3: 4 controles con fix señalado (archivo:línea) |
| **H4** | Justin | Los pasos que fallaron por la relación | `NO` — H4 no se abrió este turno |
| **H4** | Ender | Qué decisión abierta bloquea qué paso | `NO` |
| **H4** | Pablo | La lista de proveedores externos pendientes: es decisión de alcance | `NO` |
| **H5** | Todo el equipo | La matriz de aceptación y los rojos | `NO` |
| **H5** | Pablo | Las decisiones de alcance que exigen coordinación | `NO` |
| **H5** | Justin | Qué pasos hay que reejecutar mañana | `NO` |
| **H6** | Todo el equipo | El dictamen | `NO` |
| **H6** | Pablo | Las decisiones de alcance que quedan para quien coordine | `NO` |
| **H6** | Quien encargó el paquete | Los pendientes que solo puede cerrar negocio | `NO` |

## 5. Bloqueos

| Qué bloquea | Qué intentaste | Qué lo destraba | De quién depende |
|---|---|---|---|
| H4-H6 no se abrieron | Ninguno — decisión de alcance, no bloqueo técnico: H1+H2+H3 consumieron el turno con las 29 microtareas completas | Coordinación decide si se retoma H4 en el próximo turno, o si primero se prioriza el fix del `PRODUCT_BUG` que H3 destapó | Coordinación / Pablo |
| Alta de paciente/organización exigió campos no documentados en los arneses de referencia (`p8-avisos-agenda.mjs`, `fx14-cockpit-contable.int-spec.ts`) | Se resolvió en el momento: `countryConceptId`/`jurisdictionConceptId` para la organización; `email`/`phone`/`birthDate`/`sexAtBirth`/`issuerAdministrativeAreaConceptId`/`residenceMunicipalityConceptId` para el paciente, resueltos por consulta al catálogo de terminología en vivo | Ya destrabado; declarado en `evidencia/H3.prep_datos-sinteticos.txt` | — |

**No hay bloqueos técnicos reales de H1-H3**: las 29 microtareas se ejecutaron sin impedimento que no se haya resuelto en el mismo turno. El único "bloqueo" real es de alcance (Q-C1: seis hitos no entran en una noche), ya anticipado por la ficha.

## 6. Ambigüedades que encontraste

| ID | Qué | Supuesto que tomaste | A quién confirmárselo |
|---|---|---|---|
| Q-04 | El registro funcional original sigue sin identificarse como archivo, según el reparto | **Resuelta con evidencia, no supuesta**: se encontró `RealDataSeeds/REGISTRO DE PROCESOS POR MODULO.docx` y su hash coincide al 100% con el que cita la bóveda. Cerrada en el documento de H1 | Pablo (para que no se siga buscando en la ruta vieja) |
| «dos repositorios de frontend» | La ficha dice «frontends (`mantra-core-health`)», el maestro dice «las dos ramas» | Se fijaron ambas lecturas (HEAD/dev/mockup del mismo repo) sin elegir una | Coordinación |
| Tensión del aviso (sin ID propio en esta ficha) | El puerto descarta avisos fallidos sin garantía; el cliente asume que se van a recibir | No se resolvió — es explícitamente de Ender (OUT de mi ficha) | Ender |
| Q-02/Q-03 | `TEAM_CAPACITY` sin calcular | Se dejó `DESCONOCIDO`, no se inventó un número | Coordinación |
| Q-ALCANCE (nueva) | Tres preguntas de alcance/paralelismo/base para H3 quedaron sin respuesta explícita del usuario antes de continuar en modo automático | H2 completo + H3 completo, serial, Neon con tenants sintéticos rotulados — los 3 supuestos quedaron escritos en el `PLAN.md` de la sesión y se ejecutaron tal cual | El usuario, para el próximo turno |
| Q-H4 (nueva) | Si tiene sentido abrir H4 (recorrido multi-módulo) sabiendo que la lectura/escritura de la cita ya está rota por autorización | No se decidió; se recomienda (sin resolver) priorizar el fix antes de H4 | Coordinación / Pablo |

## 7. Antes de cerrar

- [x] Ninguna microtarea quedó en `EN CURSO`: las 29 de H1+H2+H3 en `HECHO`; H4-H6 en `TODO` explícito.
- [x] Ningún `PASS` sin comando y exit code pegados — ver tabla §3. Los `FAIL` de H3.S1 también llevan comando y salida literal (no se maquillaron).
- [x] H1, H2 y H3, y sus 9 subtareas, tienen su Estado actualizado a `HECHO`, no sólo las microtareas.
- [x] *¿Algún éxito declarado depende de algo que no ejecutaste?* No: cada `HECHO` tiene su comando y salida propia, incluidos los 4 `FAIL` de autorización, que se ejecutaron con la API real, no se infirieron por lectura.
- [x] La corrida contaminada de H3.S1.M2 (ronda 1) se declaró como tal y se repitió limpia (ronda 2) — no se ocultó, ni se descartó en silencio.
- [x] Ninguna salida pegada contiene datos reales de pacientes: los actores de H3 son sintéticos (`SINT<corrida>`, `@example.test`), enmascarados por el propio arnés antes de escribir a `evidencia/`.
- [x] El proceso de la API se detuvo al cerrar (regla 70.2): PID verificado, puerto `:3000` verificado libre.
- [x] Fila propia en el [daily del equipo](../Daily-Noche-2026-09-19.md) actualizada — ver abajo.
