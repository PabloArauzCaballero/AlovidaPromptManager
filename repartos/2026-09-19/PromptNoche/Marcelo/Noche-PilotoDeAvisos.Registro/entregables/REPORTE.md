# Reporte — los seis hitos del recorrido del registro, más el arreglo

> **Estado final del carril: 54 / 54 microtareas en `HECHO`.** Los seis hitos cerraron. El dictamen de aceptación está en [`DICTAMEN-M06-2026-09-20.md`](./DICTAMEN-M06-2026-09-20.md) y **no declara el producto aceptado**: `PRODUCT_ACCEPTANCE_NOT_VERIFIED`, con cuatro rojos abiertos y cuatro participantes del recorrido que todavía no existen. El 100 % es de las microtareas del prompt, no del producto — son dos cosas distintas y el dictamen las separa.
>
> **Lo que H4 agregó, ejecutándolo:** el recorrido M-06 corrió de punta a punta contra la API y la base reales, **sin un solo doble** — 7 pasos en verde, 4 ausentes declarados — y el paciente terminó con **2 avisos reales** en su bandeja. La atomicidad (ADV-08) aguantó el reintento y la concurrencia, comprobado desde una **conexión independiente**. Detalle en [`RECORRIDO-MULTIMODULO-M06-2026-09-20.md`](./RECORRIDO-MULTIMODULO-M06-2026-09-20.md).
>
> **Dos rojos nuevos, de privacidad del rastro:** ninguna lectura de datos de paciente queda registrada (`audit.data_access_log` sólo tiene filas de semilla), y el rastro de escrituras **guarda el motivo de consulta en claro**. Ninguno se tocó: son del sistema, no del recorrido.

> **Lo primero, porque cambió después de escribirse el resto:** el `PRODUCT_BUG` de autorización que H3 destapó **está corregido y verificado en runtime** — PR [mantra-core-health-api#447](https://github.com/mdavila-2001/mantra-core-health-api/pull/447), rama `marcelo/fix-authz-citas-ajenas`, commit `9ff1542d` sobre `origin/dev` @ `33f17785`. Leer una cita ajena, cancelarla o reprogramarla devuelven **403**; el titular sigue haciendo lo suyo con **200**. Suite de `scheduling` **483/483**, y **4 de las 7 pruebas nuevas fallan sin el arreglo**. Detalle en §7 de `PERMISOS-ESTADOS-DINERO-M06-2026-09-20.md` y en `evidencia/H3.FIX_reverificacion-contra-api-viva.txt`.
>
> **Una corrección al propio hallazgo:** de los 4 `FAIL` que este reporte declaraba, **3 eran bugs reales y están arreglados**; el cuarto (`R4`, disponibilidad de cupos entre organizaciones) **se reclasificó a `DECISION_REQUIRED`** al ir a corregirlo: no devuelve ningún dato de persona y el documento del cliente pide explícitamente poder «revisar todos los médicos que están disponibles», así que restringirlo rompería el recorrido en vez de protegerlo. Es pregunta de producto, no defecto.

- Fecha: 2026-09-20 · Plan: [plan de la sesión, aprobado en modo plan] · Ramas: sin cambios en repos de código; único directorio tocado: `AlovidaPromptManager/repartos/2026-09-19/PromptNoche/Marcelo/Noche-PilotoDeAvisos.Registro/` en `marcelo/features-a-trabajar`
- Peldaño de evidencia alcanzado, **por área** (regla 30.5 — el peldaño del trabajo es el más bajo, no el más alto): H1 en `DISCOVERED` (sólo lectura). H2 en `WRITTEN`/`DISCOVERED` (diseño de casos; ninguno se ejecutó — ejecutarlos era H3-H5). **H3 en `VERIFIED`** para H3.S1 y H3.S2 (comportamiento observado en runtime, contra la API real, con persistencia real inspeccionada por consulta posterior); H3.S3 en `DISCOVERED` salvo las dos consultas SQL, que son `VERIFIED` como hecho de esquema. **H4 en `VERIFIED`** para los 7 pasos ejercitados y para ADV-08, con la persistencia comprobada desde una conexión independiente. H5 y H6 son consolidación: su peldaño es el de lo que consolidan. **El peldaño global del turno es el más bajo de sus áreas: `DISCOVERED`**, porque H1 sigue siendo pura lectura y hay cuatro participantes que nunca se pudieron ejercitar — pero H3 y H4 sí alcanzan `VERIFIED` en su propio alcance, y así se declara.
- Avance: **54 / 54 microtareas en `HECHO`** (H1 13/13 · H2 8/8 · H3 8/8 · H4 8/8 · H5 8/8 · H6 9/9). Cálculo en `evidencia/H6.S3.M1_avance-calculado.txt`.

## Completado

### H1 — Recorrido prioritario y relaciones (13/13, sin cambios respecto del reporte anterior)

| ID | Qué se logró | Comando | Resultado |
|---|---|---|---|
| H0 | Estándar instalado y verificado en `AlovidaPromptManager/` | `ls .claude/skills \| wc -l`; `python .claude/hooks/plan_gate.py --self-test` | PASS — 176 skills, 11 PASS/0 FAIL. `evidencia/H0_instalacion-estandar.txt` |
| H1.S1.M1 | Registro original encontrado y verificado por hash | `sha256sum`; `python -m zipfile` | PASS — `evidencia/H1.S1.M1_busqueda-registro-original.txt` |
| H1.S1.M2 | Corte real de los 4 checkouts | `git fetch`, `git log -1`, `git rev-list --count` | PASS — `evidencia/H1.S1.M2_cortes.txt` |
| H1.S1.M3 | Configuración que se compila y banderas de demo | `node -e`; `node scripts/check-real-api-config.mjs` | PASS — `evidencia/H1.S1.M3_entorno-que-se-compila.txt` |
| H1.S1.M4 | Advertencia normativa en la primera pantalla | `grep -n "mockBackend" … \| head -1` | PASS — `evidencia/H1.S1.M4_advertencia.txt` |
| H1.S2.M1 | Catálogo ordenado con criterio previo | `grep -c "auxiliares del paquete"` | PASS — `evidencia/H1.S2.M1_orden-catalogo.txt` |
| H1.S2.M2 | Recorrido elegido (M-06) | `grep -c "Recorrido elegido"` | PASS — `evidencia/H1.S2.M2_eleccion*.txt` |
| H1.S2.M3 | Participantes con localizador | `grep`/`ls` sobre módulos | PASS — `evidencia/H1.S2.M3_participantes.txt` |
| H1.S2.M4 | Capacidad excluida por el cobro | `grep -rn "billing\|invoice\|factura"` | PASS — `evidencia/H1.S2.M4_exclusion-cobro.txt` |
| H1.S2.M5 | Localizadores de los 11 pasos | `grep -n`, lecturas de rango | PASS — `evidencia/H1.S2.M5_localizadores.txt` |
| H1.S3.M1 | Relaciones del recorrido | `grep` de imports | PASS — `evidencia/H1.S3.M1_relaciones.txt` |
| H1.S3.M2 | Tabla dobles-vs-reales | `grep -c "ADAPTER_VERIFIED_WITH_DOUBLES"` | PASS — `evidencia/H1.S3.M2_dobles-vs-reales.txt` |
| H1.S3.M3/M4 | `TEAM_CAPACITY` desconocido + demanda vs. capacidad | `grep` sobre daily del equipo | PASS — `evidencia/H1.S3.M3_capacidad.txt`, `H1.S3.M4_demanda-vs-capacidad.txt` |

### H2 — Casos de aceptación, datos sintéticos y correspondencia (8/8)

Documento: [`CASOS-ACEPTACION-M06-2026-09-20.md`](./CASOS-ACEPTACION-M06-2026-09-20.md). **33 casos** (11 felices + 22 negativos), **29 con oráculo de aceptación** (12 del cliente, 2 de un pedido interno escrito — TAREA-15 —, 15 de reglas de la casa) y **4 rotulados `DECISION_REQUIRED`** (sus límites salen del código, no de una fuente externa, y no cuentan como aceptación).

| ID | Qué se logró | Comando (DoD) | Resultado |
|---|---|---|---|
| H2.S1.M1 | 11 casos de camino feliz, uno por paso del recorrido | `grep -c '^### CA-M06-F'` → 11; `grep -ciE 'controller\|service\|\.ts\b'` sobre §1-§2 (rango corregido) → 0 | PASS — `evidencia/H2.S1.M1_casos-felices.txt` |
| H2.S1.M2 | 22 casos negativos: 8 autorización, 9 dato inválido, 5 estado | `grep -c '^### CA-M06-N-AUTH\|VAL\|EST'` → 8/9/5 | PASS — `evidencia/H2.S1.M2_casos-negativos.txt` |
| H2.S1.M3 | Oráculo de cada caso, ninguno auto-referido | `grep -ciE '\| *(el sistema\|lo que hace el sistema) *\|'` → 0; `DECISION_REQUIRED` → 4 (corregido de 5 al localizar TAREA-15) | PASS — `evidencia/H2.S1.M3_oraculo.txt` |
| H2.S2.M1 | Grafo sintético (2 organizaciones, 2 médicos, 4+ pacientes), sin PII real | `grep -c '@example.test'` ≥ 3; `grep -cE 'SINT-[0-9]{9}'` ≥ 3; correos reales → 0 | PASS — `evidencia/H2.S2.M1_datos-sinteticos.txt` |
| H2.S2.M2 | Procedencia de 8 catálogos, 5 sin fuente completa declaradas como tales | `grep -c 'SIN PROCEDENCIA REGISTRADA'` → 5 | PASS — `evidencia/H2.S2.M2_procedencia.txt` |
| H2.S2.M3 | 8 datos no generables, cada uno con dueño | `grep -c '^| DR-M06-'` → 8; ninguna fila sin «Quién define» | PASS — `evidencia/H2.S2.M3_decision-required.txt` |
| H2.S3.M1 | 11 pasos contrastados contra el cliente (8 con párrafo, 3 `AGREGADO`) | `grep -cE '^\| (1[01]\|[1-9]) \|'` → 11 | PASS — `evidencia/H2.S3.M1_correspondencia.txt` |
| H2.S3.M2 | 9 ítems del cliente que M-06 no cubre | `grep -cE '^\| [1-9] \|'` → 9 | PASS — `evidencia/H2.S3.M2_no-cubierto.txt` |

**Desvío del plan, registrado en el propio documento:** dos totales se corrigieron sobre la marcha (rango `sed` que se solapaba con §10-§11 al ejecutar H2.S1.M1(d); `DECISION_REQUIRED` bajó de 5 a 4 casos al localizarse una fuente de oráculo para `CA-M06-F09` en `TAREA-15-notificaciones-de-agenda.md`). Ambas correcciones quedan en `evidencia/H2.S1.M1_casos-felices.txt` y `H2.S1.M3_oraculo.txt` como TEST_BUG del DoD (regla 80.4), no como cambio del contenido del caso.

### H3 — Permisos, estados y dinero, ejecutados contra la API real (8/8)

Documento: [`PERMISOS-ESTADOS-DINERO-M06-2026-09-20.md`](./PERMISOS-ESTADOS-DINERO-M06-2026-09-20.md). **API arrancada realmente** (`yarn build` exit 0, proceso propio en `:3000`, contra la base del `.env` del repo — Neon, `RLS_ENFORCE=false`), con datos sintéticos creados por llamadas HTTP reales (2 organizaciones, 3 pacientes, 1 owner). Arnés propio (`h3-recorrido.mjs`) vive en el scratchpad de la sesión, **no** en el repo.

| ID | Qué se logró | Comando (DoD) | Resultado |
|---|---|---|---|
| H3.0 | Gate de arranque | `yarn build` (exit 0); `GET /health` → 200; sin `MetadataError` | PASS — `evidencia/H3.0_api-arranque.txt` |
| H3.S1.M1 | ADV-04 lectura: 9 celdas ejercitadas, **4 en FAIL** | Salidas literales con código HTTP; kill-test del hito falla (`GET /scheduling/bookings/:id` con uuid ajeno → 200) | **FAIL de producto, capturado con evidencia** — `evidencia/H3.S1.M1_adv04-lectura.txt`, causa raíz en `H3.S1.M1_root-cause-cancel-reschedule.txt` |
| H3.S1.M2 | ADV-04 escritura + consulta posterior, en 2 rondas (la 1.ª contaminada, declarada; la 2.ª limpia) | Salidas + consultas posteriores; ronda 2: `W3` (reprogramar ajeno) → 200 FAIL, `W2` (cancelar cross-tenant) → 200 FAIL, `T1`/`T2` → 422 PASS | **2 FAIL de producto + 2 PASS**, todo con evidencia — `evidencia/H3.S1.M2_adv04-escritura*.txt` |
| H3.S1.M3 | Matriz rol×recurso×acción, 19 celdas | 12 PASS, 4 FAIL, 3 `NOT_RUN` declaradas | PASS del DoD (la matriz existe y no oculta ninguna celda) — `evidencia/H3.S1.M3_matriz-autorizacion.txt` |
| H3.S2.M1 | Transiciones legales con fuente | Fuente literal de `booking-state-machine.ts:18-66` pegada | PASS — `evidencia/H3.S2.M1_transiciones-fuente.txt` |
| H3.S2.M2 | Transición ilegal rechazada por el backend (2 intentos, 2 rondas) | 4× `422 INVALID_STATE_TRANSITION`, con consulta posterior confirmando estado intacto | **PASS** — `evidencia/H3.S2.M2_transicion-ilegal*.txt` |
| H3.S3.M1 | Enteros de la menor unidad | `information_schema.columns`: `numeric` sin escala fija; 0 columnas `real`/`double precision` en 6 esquemas | **PASS parcial** (no hay float; no hay entero de menor unidad — declarado, no maquillado) — `evidencia/H3.S3_sql-dinero-y-rls.txt` |
| H3.S3.M2 | Moneda, precisión, redondeo | 12 conceptos `CURRENCY` en 4 juegos sin reconciliar + 6 placeholders; 0 lógica de redondeo monetario en `scheduling` | PASS del DoD (declarado con evidencia) — mismo archivo |
| H3.S3.M3 | 5 datos de dinero sin definir, con dueño | Lista `DR-M06-DINERO-01..05` | PASS — dentro del documento §3.M3 |

**Hallazgo que domina el turno:** el kill-test de H3 (*"cambiá el identificador de la URL por el de otro paciente"*) **falla**. `GET /scheduling/bookings/:id`, `GET /scheduling/slots`, `POST .../cancel` y `POST .../reschedule` no verifican que el actor sea el dueño del recurso — el único control es el rol global (`@Roles('PATIENT',…)`), sin comparación de `patientProfileId` ni de tenant. Causa raíz localizada con precisión: el método privado que hace esa comparación (`assertPuedeActuarPorElPaciente`) **ya existe y se usa** en otros cuatro puntos del mismo archivo (`placeHold`, confirmación de hold, `searchBookings`, `enroll` de lista de espera) pero **nunca se agregó** a `cancel()` ni a `reschedule()` cuando se les dio el rol `PATIENT`. Es BOLA/IDOR de escritura (OWASP API1/API3, regla 90.1.2/.3), no un defecto de la máquina de estados (que sí rechaza correctamente sus dos transiciones ilegales probadas).

### H4 — El recorrido cruzando varios módulos, ejercitado (8/8)

Documento: [`RECORRIDO-MULTIMODULO-M06-2026-09-20.md`](./RECORRIDO-MULTIMODULO-M06-2026-09-20.md). El recorrido corrió de punta a punta contra la API construida desde `dev` (con el arreglo dentro) y la base real. **7 pasos REALES, 0 dobles, 4 ausentes declarados.**

| ID | Qué se logró | Comando (DoD) | Resultado |
|---|---|---|---|
| H4.S1.M1 | Recorrido completo ejecutado, paso por paso | 32 llamadas HTTP reales; 11 pasos con su línea | PASS — `evidencia/H4.S1.M1-M2-M3_recorrido-y-adv08.txt` |
| H4.S1.M2 | Cada paso con su participante real/doble/ausente | 11 filas clasificadas; `grep -c 'DOBLE'` → **0** | PASS — mismo archivo |
| H4.S1.M3 | ADV-08 desde **conexión independiente** | Reintento: 1 sola cancelación, `row_version 2`. Concurrencia: 1 ganador, capacidad nunca negativa | PASS — `evidencia/H4.S1.M3_adv08-y-H4.S3.M1_auditoria.txt` |
| H4.S2.M1 | Proveedores externos pendientes | 4 proveedores con qué acredita y qué falta | PASS — documento §3 |
| H4.S2.M2 | Pasos `NOT_RUN` con motivo | 4 pasos, cada uno con su línea | PASS — documento §3 |
| H4.S2.M3 | Correspondencia del recorrido **ejecutado** contra el cliente | 11 filas; 7 ejecutados, 4 no | PASS — documento §3 |
| H4.S3.M1 | ¿Las lecturas dejan rastro? | **0 filas** en `audit.data_access_log`; las 16 existentes son de semilla. Y el rastro de escrituras guarda `reasonText` | **FAIL de producto, capturado** — `evidencia/H4.S1.M3_…txt` |
| H4.S3.M2 | ¿Hay PHI en logs y URLs? | 6 nombres, correos, documentos, teléfonos y el motivo: **0 apariciones** en 1 976 líneas, con control positivo | PASS — `evidencia/H4.S3.M2_phi-en-logs-y-urls.txt` |

### H5 — La aceptación con los participantes reales disponibles (8/8)

Documento: [`ACEPTACION-M06-2026-09-20.md`](./ACEPTACION-M06-2026-09-20.md). Abre con los cuatro rojos, antes de cualquier resumen.

| ID | Qué se logró | Comando (DoD) | Resultado |
|---|---|---|---|
| H5.S1.M1 | Matriz paso × resultado × evidencia, con código | 11 pasos, todos con su código | PASS — `evidencia/H5-H6_DoD.txt` |
| H5.S1.M2 | Participante real/doble/ausente por paso | 14 marcas; ningún vacío | PASS — ídem |
| H5.S1.M3 | Fallos críticos primero | Los 4 rojos abren el documento (línea 5) | PASS — ídem |
| H5.S2.M1 | Recorridos exigidos NO ejecutados | 15 filas: **1 de 19** ejercitado, cada uno con motivo | PASS — ídem |
| H5.S2.M2 | Decisiones de alcance con dueño | 6 decisiones, **0 filas sin dueño** (4 mías, marcadas como tales) | PASS — ídem |
| H5.S2.M3 | Correspondencia con el cliente | 11 ítems: 2 cubiertos, 2 parciales, 6 no cubiertos | PASS — ídem |
| H5.S3.M1 | Estado de entrega | `PRODUCT_ACCEPTANCE_NOT_VERIFIED`, con el porqué | PASS — ídem |
| H5.S3.M2 | Límites externos | 6 piezas, cada una con qué acredita hoy | PASS — ídem |

### H6 — El dictamen (9/9)

Documento: [`DICTAMEN-M06-2026-09-20.md`](./DICTAMEN-M06-2026-09-20.md). Escrito para alguien que no vio el turno: abre diciendo qué está en rojo, sigue con qué se puede usar y qué no.

| ID | Qué se logró | Comando (DoD) | Resultado |
|---|---|---|---|
| H6.S1.M1 | Aprobado, con evidencia | 12 filas, cada una con su archivo de evidencia | PASS — `evidencia/H5-H6_DoD.txt` |
| H6.S1.M2 | A medias, con las cuatro respuestas | 3 ítems × 4 respuestas = **12** | PASS — ídem |
| H6.S1.M3 | Pendiente y bloqueado | 9 filas con qué lo destraba y de quién depende | PASS — ídem |
| H6.S2.M1 | Proveedores externos no verificados | 7 filas | PASS — ídem |
| H6.S2.M2 | «No cubierto» consolidado, arriba | 9 ítems de los cuatro documentos anidados | PASS — ídem |
| H6.S2.M3 | Estado de entrega con su peldaño | `PRODUCT_ACCEPTANCE_NOT_VERIFIED`; `VERIFIED` sólo por área | PASS — ídem |
| H6.S3.M1 | Avance calculado | `54 / 54 = 100.0 %`, con la fórmula pegada | PASS — `evidencia/H6.S3.M1_avance-calculado.txt` |
| H6.S3.M2 | Fallos críticos en la primera línea | El rojo abre el documento (línea 5) | PASS — `evidencia/H5-H6_DoD.txt` |
| H6.S3.M3 | Riesgos residuales con impacto | 8 riesgos, cada uno con impacto y mitigación | PASS — ídem |

## A medias

*Ninguna.* Las 29 microtareas abiertas este turno (H1+H2+H3) cerraron con su DoD ejecutado y su evidencia pegada. Dentro de H3.S1.M2 hubo una corrida contaminada (ronda 1) que se declaró como tal y se repitió limpia (ronda 2) — no es trabajo a medias, es método de verificación documentado (regla 80.4: TEST_BUG del arnés, no del hallazgo).

## Pendiente

**Ningún hito queda sin abrir.** Lo que queda pendiente no es trabajo de este carril, sino decisiones y piezas de otros:

| Qué | Qué lo destraba | De quién depende |
|---|---|---|
| Rastro de lecturas de datos de paciente (`R-1`) | Instrumentar `audit.data_access_log` en las lecturas | Equipo de la API |
| El motivo de consulta guardado en el rastro (`R-2`) | Excluirlo del snapshot o protegerlo con otra política | Equipo de la API + privacidad |
| Datos de facturación de la consulta (`R-3`) | Definir dónde se capturan | Negocio, después la API |
| Confirmación de entrega del correo (`R-4`) | Elegir y homologar proveedor | Coordinación (Q-21) |
| Los 18 escenarios restantes del catálogo | Decidir el orden; H1 los dejó priorizados con motivo | Coordinación |
| Q-06: ¿el aviso debe llegar sí o sí? | Una decisión de negocio | **Negocio** — es la que más trabajo destraba |
| `TEAM_CAPACITY` | Calcularlo | Coordinación (Q-02, Q-03) |

## Evidencia

**H1** (sin cambios): índice completo en el reporte anterior, conservado en `evidencia/H1.*` y `H0_instalacion-estandar.txt`.

**H2**: `H2.S1.M1_casos-felices.txt`, `H2.S1.M2_casos-negativos.txt`, `H2.S1.M3_oraculo.txt`, `H2.S2.M1_datos-sinteticos.txt`, `H2.S2.M2_procedencia.txt`, `H2.S2.M3_decision-required.txt`, `H2.S3.M1_correspondencia.txt`, `H2.S3.M2_no-cubierto.txt`.

**H3**: `H3.0_api-arranque.txt`, `H3.prep_datos-sinteticos.txt` (preparación, enmascarada), `H3.S1.M1_adv04-lectura.txt`, `H3.S1.M1_root-cause-cancel-reschedule.txt`, `H3.S1.M2_adv04-escritura.txt` (ronda 1, contaminada, declarada), `H3.S1.M2_adv04-escritura-ronda2.txt` (limpia), `H3.S1.M3_matriz-autorizacion.txt`, `H3.S2.M1_transiciones-fuente.txt`, `H3.S2.M2_transicion-ilegal.txt`, `H3.S2.M2_transicion-ilegal-T2-y-limpieza.txt`, `H3.S3_sql-dinero-y-rls.txt`, más un `_DoD.txt` por microtarea de H2 y H3 con el comando y la salida del chequeo final. Todos con comando literal y salida pegada.

## No cubierto

Consolidado hacia arriba (regla 40.7): lo que quedó sin cubrir en los documentos anidados de H1/H2/H3 aparece acá, no enterrado.

- **De H1** (ver reporte anterior): ningún arnés propio corrió; el paso «cupo liberado → aviso» no se verificó en este checkout; el consumo móvil no se verificó; el bloqueador `MetadataError` de Pablo no se investigó.
- **De H2**: es diseño puro — ningún caso se ejecutó (eso era H3). `CA-M06-F10` (datos de facturación) y `CA-M06-F11` (móvil) están escritos sin localizador real donde ejecutarlos.
- **De H3**:
  - **H3.S1.M3** deja 3 celdas `NOT_RUN` declaradas: check-in con rol `PATIENT`, endpoints internos con rol `PATIENT`, y el negativo de `POST .../reminders` (que H1 §11 ya marcó sin `assert*` por lectura pero que este turno no llegó a ejercitar con una llamada real).
  - **H3.S3.M2**: el catálogo de moneda se inspeccionó por consulta SQL, no se ejercitó ningún endpoint que lo use en un cálculo real (no hay ninguno visible en `scheduling` — está declarado como tal).
  - **La ronda 1 de H3.S1.M2 quedó contaminada** por diseño de la propia investigación (un éxito indebido cambió el estado antes de que corrieran los pasos siguientes) — se repitió en la ronda 2, pero la ronda 1 queda igual en la evidencia, sin borrarla, para que se vea el problema de método y no sólo el resultado limpio.
  - **No se ejercitó ningún caso de H2 contra la API** más allá de los que H3 tocó de pasada (reservar, cancelar, reprogramar, completar, iniciar). Los 33 casos de H2 no tienen todos su corrida — sólo los que H3 necesitó para el kill-test.
  - **El proceso de la API se detuvo al cerrar** (regla 70.2): `PID` verificado, `:3000` verificado libre. Los tenants sintéticos (`SINT_ORG_B_<corrida>`, org por defecto A) **quedan en la base compartida de Neon** — no hay endpoint de borrado; se listan en `H3.prep_datos-sinteticos.txt` por su código de corrida para que cualquiera los identifique y los descarte si hace falta.

## Desvíos del plan

1. **H1**: los 4 desvíos ya registrados en el reporte anterior (fuente del catálogo M-01…M-19, hallazgo que cerró Q-04, `git fetch` no estrictamente de lectura).
2. **H2**: dos correcciones de totales sobre la marcha, declaradas como TEST_BUG (ver «Completado» arriba), no como cambio de contenido.
3. **H3**: el plan preveía «Neon compartida, con tenants sintéticos rotulados» como supuesto explícito (no confirmado por el usuario, que no respondió las preguntas de alcance/paralelismo/base antes de que la sesión continuara en modo automático) — se ejecutó bajo ese supuesto, declarado en el propio `PLAN.md` y repetido acá. La ronda 1 de H3.S1.M2 se re-ejecutó como ronda 2 al detectarse la contaminación — no estaba en el plan original tener dos rondas, pero es la aplicación directa de la regla 80.4 (root-cause antes de aceptar un resultado ambiguo).
4. **Alcance no confirmado por el usuario**: las tres preguntas de `AskUserQuestion` sobre alcance (H2+H3 vs. sólo H2), paralelismo y base de datos para H3 quedaron sin respuesta explícita del usuario (la sesión continuó con "Continue" tras un cambio de modelo). Se procedió bajo los supuestos declarados en `PLAN.md` §"Supuestos tomados", que son los que este reporte ejecuta. Si el usuario hubiera preferido sólo H2, o Docker local en vez de Neon, hay que decirlo para el próximo turno.

## Riesgos residuales

- **El `PRODUCT_BUG` de autorización está corregido en la rama del PR #447, pero sigue vivo en `dev` hasta que se mergee.** Mientras tanto, cualquiera con rol `PATIENT` puede leer, cancelar o reprogramar la cita de cualquier otro paciente, de cualquier organización, en todo entorno que corra `dev`. El arreglo son 2 archivos y 175 líneas: el costo de revisarlo es bajo comparado con el de dejarlo.
- **El arreglo no cubre dos huecos vecinos**, declarados sin ejercitar: `searchBookings` filtrando sólo por `resourceId` (no comprueba de quién es esa agenda) y `operaCualquierAgenda` (mira roles globales sin acotar por organización — comportamiento que ya tenía `cargarParaOperar`, no introducido por el arreglo).
- **`R4` quedó sin decidir**: si negocio responde que la disponibilidad debe restringirse por organización, hace falta otro cambio *y* revisar cómo el paciente elige médico, porque el recorrido actual depende de poder verla.
- Heredados de H1: el corte de la API no incluye los PRs #443/#444; la lectura `ítem.subítem` es una convención propia; la tensión de semántica del aviso sigue abierta para Ender; `TEAM_CAPACITY` sigue `DESCONOCIDO`.
- **Nuevo de H3**: los 4 juegos de conceptos de moneda sin reconciliar (`DR-M06-DINERO-02`) es una deuda **anterior** a este trabajo (ya documentada en el `CLAUDE.md` de la raíz para farmacia) que ahora se confirma también en `scheduling`.
- Los datos sintéticos de H3 (org B, 3 pacientes, 1 owner) quedan vivos en la base compartida de Neon, sin mecanismo de borrado — rotulados por corrida, no reales, pero ocupan filas.

## Decisiones y ambigüedades

Las de H1 (Q-01, Q-C1, Q-04 cerrada, Q-02/Q-03, Q-10, Q-R4, Q-17, Q-21, «dos frontends», tensión del aviso) están en §11 de `RECORRIDO-PRIORITARIO-2026-09-20.md`, sin cambios. Nuevas de H2/H3:

| ID | Ambigüedad | Supuesto tomado | A quién confirmar |
|---|---|---|---|
| Q-H2-1 | El plan asumía 5 casos `DECISION_REQUIRED`; se localizó oráculo para uno (`CA-M06-F09`) en `TAREA-15` | Se corrigió a 4, declarado como desvío, no oculto | — (autocorrección con evidencia) |
| Q-ALCANCE | Las 3 preguntas de alcance/paralelismo/base no fueron respondidas por el usuario antes de continuar | H2 completo + H3 completo, serial, Neon con tenants sintéticos rotulados (los 3 supuestos del `PLAN.md`) | El usuario, para el próximo turno — si prefiere Docker local o sólo H2, decirlo ahora |
| Q-H4 | Si tiene sentido abrir H4 (recorrido multi-módulo) sabiendo que la lectura/escritura de la cita ya está rota por autorización | No se abrió H4; se recomienda (sin decidir) priorizar el fix de `cancel`/`reschedule` primero | Coordinación / Pablo |

## Handoff (regla 40 + ficha §6, consolidado H1+H2+H3)

**A Justin — al cerrar H1** (sin cambios): la siguiente relación a preparar es `avisos → chat SupportAdmin` (TAREA-15). **Al cerrar H2**: los 8 `CA-M06-N-AUTH-*` van a tu matriz; 3 ya los cubrís con dobles en `origin/dev`. **Al cerrar H3**: los 4 `FAIL` confirmados (`R1`, `R2`, `R4` de lectura; `W3`, `W2` de escritura) son negativos reales para sumar a tu matriz — tu relación `agenda → mensajería` ya cubre el camino feliz de `cancel`/`reschedule` con dobles, así que envolver un test de autorización negativa no exige tocar el lado del aviso.

**A Itzan — al cerrar H1** (sin cambios): la escritura atómica reserva+alta de paciente en `profiles`, en la misma transacción; el aviso queda deliberadamente fuera.

**A Ender — al cerrar H1** (sin cambios): la tensión de garantía de entrega del aviso, citada con ruta:línea de ambos lados. **Al cerrar H2**: reglas que el contrato de avisos no expresa (garantía de entrega, ventana de `debounceKey`, «exactamente uno» de `recipient`, chat sólo para cambio de estado). **Al cerrar H3**: ninguna regla monetaria nueva para el contrato de avisos; sí un dato indirecto — la cancelación ilegítima de `W2` no generó ningún aviso a la víctima (bandeja en 0), lo que sugiere que `BOOKING_STATE_CHANGED` tampoco se dispara para una cancelación hecha por un actor no autorizado.

**A Pablo — al cerrar H1** (sin cambios): Q-04 cerrada; demanda vs. capacidad en §10. **Al cerrar H2**: el grafo sintético de §4 para el laboratorio; 4 catálogos con procedencia incompleta. **Al cerrar H3**, esto es lo más urgente del turno: 4 controles de autorización faltantes con su fix señalado (reusar `assertPuedeActuarPorElPaciente` en `cancel()` y `reschedule()`; agregar filtro de tenant/actor a `getBookingById` y a `listSlots`), más el hallazgo lateral de que una escritura ilegítima exitosa no deja ningún aviso a la víctima.

**A quien coordine el turno siguiente:** las 3 preguntas de alcance que quedaron sin responder (ver «Decisiones y ambigüedades», `Q-ALCANCE`) — si el próximo turno debe abrir H4 o priorizar el fix de autorización que este turno destapó.
