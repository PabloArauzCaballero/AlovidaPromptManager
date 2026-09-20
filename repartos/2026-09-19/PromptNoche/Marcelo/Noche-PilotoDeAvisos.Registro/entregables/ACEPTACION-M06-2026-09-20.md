# H5 — Aceptación del registro con los participantes reales disponibles

> **Kill-test del hito:** *"leé la primera línea; si hay algo en rojo y no lo dice, el reporte está maquillado"*. Acá está, antes que cualquier otra cosa.

## 🔴 Lo que está en rojo

| # | Qué está mal | Cómo se supo | Estado |
|---|---|---|---|
| **R-1** | **Ninguna lectura de datos de paciente deja rastro.** `GET /scheduling/bookings/:id` devuelve perfil, horario y motivo de consulta, y no escribe una sola fila en `audit.data_access_log`. La tabla tiene 16 filas y **las 16 son de semilla** | Consulta desde conexión independiente tras leer las citas seis veces: **0 filas** (H4 §4) | **ABIERTO** — incumple la regla 90.2.7 |
| **R-2** | **El rastro de escrituras guarda el motivo de consulta en claro.** `data_snapshot` incluye `reasonText`, el texto libre donde el paciente dice por qué consulta | Claves del snapshot consultadas en base (H4 §4) | **ABIERTO** — el hito pedía que el rastro **no** tenga contenido clínico |
| **R-3** | **El cliente pide los datos de facturación de la consulta (3.6) y no hay dónde ponerlos.** No es que fallen: no existen en el flujo de reserva | `NOT_FOUND` verificado en H1 §7, caso `CA-M06-F10` escrito en H2, paso 10 `NOT_RUN` en H4 | **ABIERTO** — es un requisito explícito sin implementación |
| **R-4** | **El correo se marca enviado sin que nadie confirme la entrega**, y uno de la corrida quedó fallido | 16 entregas `ND_SENT` con `sent_at`, **0 con `delivered_at`**, 1 en `ND_FAILED` (H4 §3) | **ABIERTO** — aceptación externa pendiente (Q-21) |

**Un rojo que ya no está:** el que dominaba el turno —leer, cancelar y reprogramar la cita de otro paciente— **se arregló y se verificó** (PR [api#447](https://github.com/mdavila-2001/mantra-core-health-api/pull/447), mergeado). Su verificación está en `PERMISOS-ESTADOS-DINERO-M06-2026-09-20.md` §7.

---

> **Consulta:** 2026-09-20T21:56–22:03 UTC · **Peldaño:** `VERIFIED` para los pasos ejercitados; `DISCOVERED` para lo que no tiene contra qué correrse · **Alcance de esta aceptación:** el recorrido **M-06** solamente, no el producto.

## §1 — La matriz de aceptación (H5.S1.M1 y H5.S1.M2)

Un renglón por paso del recorrido exigido. La columna de participante **no admite vacío**: o fue real, o fue un doble, o no había con qué (gate C2, sin dobles ocultos). En esta corrida **no se usó ni un doble**.

| # | Paso | Resultado | Código | Participante | Evidencia |
|---|---|---|---|---|---|
| 1 | Buscar médico disponible | **PASS** | 200 | **REAL** · API `scheduling` + `practice` | `H4.S1.M1-M2-M3_recorrido-y-adv08.txt` |
| 2 | Ver horario y sede | **PASS** | 200 | **REAL** · API `scheduling` | ídem |
| 3 | Reservar (retener → confirmar) | **PASS** | 201 · 201 | **REAL** · `scheduling` + `clinical` + `profiles` | ídem |
| 4 | Entrar a la lista de espera | **PASS** | 201 | **REAL** · API `scheduling` | ídem |
| 5 | Cupo liberado dispara el aviso | **PASS** | 200 (`processed: 1`) | **REAL** · `scheduling` + worker interno | ídem |
| 6 | Demora del profesional dispara el aviso | **PASS** | 200 | **REAL** · `scheduling` + `messaging` | ídem |
| 7 | El paciente ve los avisos en su bandeja | **PASS** | 200 (2 avisos) | **REAL** · `messaging` in-app | ídem |
| 8 | Copia al chat de soporte | `NOT_RUN` | 403 | **AUSENTE** · la cuenta `SupportAdmin` no existe | ídem + `TAREA-15` §2.2 |
| 9 | Correo del aviso | **PARCIAL** | — | **REAL** el encolado (16 `ND_SENT`) · **AUSENTE** la confirmación de entrega | `H4.S1.M3_adv08-y-H4.S3.M1_auditoria.txt` |
| 10 | Datos de facturación (3.6 del cliente) | `NOT_RUN` | — | **AUSENTE** · no existe el punto de captura | H1 §7 |
| 11 | La misma cita desde el móvil | `NOT_RUN` | — | **AUSENTE** · no se localizó la pantalla | H1 §8 |

**Además, tres propiedades del recorrido, no pasos:**

| Propiedad | Resultado | Código | Participante | Evidencia |
|---|---|---|---|---|
| Autorización: leer/cancelar/reprogramar cita ajena | **PASS** (tras el arreglo) | 403 × 6 | **REAL** | `H3.FIX_reverificacion-contra-api-viva.txt` |
| Transiciones de estado ilegales | **PASS** | 422 × 4 | **REAL** | `H3.S2.M2_transicion-ilegal*.txt` |
| Atomicidad ADV-08 (reintento y concurrencia) | **PASS** | 200/409 · 201/409 | **REAL**, comprobado desde conexión independiente | `H4.S1.M3_…txt` |

**Cuenta: 7 pasos PASS, 1 PARCIAL, 3 NOT_RUN, y 3 propiedades transversales en PASS.** Sin dobles.

## §2 — Los fallos críticos, y por qué están arriba (H5.S1.M3)

Están en la primera pantalla, antes del índice. Los cuatro (`R-1` a `R-4`) tienen el mismo patrón: **no son fallos del camino feliz** — el recorrido funciona — sino de lo que rodea al camino feliz: el rastro, la privacidad del rastro, un requisito sin implementar y un proveedor que nadie confirmó. Un reporte que abriera con «7 de 11 pasos en verde» sería exacto y engañoso a la vez.

---

## §3 — El alcance, explícito (H5.S2)

### H5.S2.M1 — Recorridos exigidos que **no** se ejecutaron

El catálogo del paquete tiene 19 escenarios (`M-01`…`M-19`). Se ejercitó **uno**.

| Escenario | Estado | Motivo |
|---|---|---|
| **M-06** agenda con espera y demora | **EJECUTADO** | Es el elegido en H1, por criterio escrito antes |
| M-01 registro con tres nombres, CI y edad | NO EJECUTADO | Prerrequisito de datos de M-06; se usó el alta pública, no se probó el requisito en sí |
| M-02 tutor y dependiente | NO EJECUTADO | Fuera del recorrido elegido |
| M-03 datos fiscales y sedes | NO EJECUTADO | Fuera del recorrido; parcialmente trabajado en subtareas 1.x anteriores |
| M-04 ocupaciones del SEGIP | NO EJECUTADO | Regla de negocio pendiente («CHARLAR», Q-10) |
| M-05 especialidades y matrículas | NO EJECUTADO | Fuera del recorrido |
| M-07 preparación de estudios | NO EJECUTADO | Depende de datos que provee una empresa externa |
| M-08 · M-09 · M-10 aprobación parcial de aseguradora | NO EJECUTADO | Q-17 abierta: nadie definió qué es «aprobación parcial» |
| M-11 · M-12 farmacia y entrega | NO EJECUTADO | Integración externa sin contrato |
| M-13 resultados de laboratorio | NO EJECUTADO | Integración externa |
| M-14 cronograma de medicamentos con alarmas | NO EJECUTADO | `NOT_FOUND` verificado: no existe en ninguna capa |
| M-15 · M-16 puntos y multiplicadores | NO EJECUTADO | El cliente declara tres veces que el nombre y las reglas se deciden después |
| M-17 supermercado y promociones | NO EJECUTADO | Socio comercial no identificado |
| M-18 facturas, comisiones y reportes | NO EJECUTADO | Capacidad transversal; parcialmente dentro de la exclusión del cobro |
| M-19 integraciones de precios e inventario | NO EJECUTADO | Sin proveedor confirmado |

**1 de 19.** No es un recorte: es lo que el propio prompt anticipó (Q-C1) y lo que H1 ordenó por dependencia.

### H5.S2.M2 — Decisiones de alcance tomadas, con dueño

| # | Decisión | Quién la tomó | Dónde consta |
|---|---|---|---|
| 1 | Ejecutar **H2 y H3 completos** en vez de sólo H2 | **Claude (yo)**, bajo supuesto declarado por falta de respuesta del usuario | `PLAN.md` de la sesión, §Supuestos; `REPORTE.md` §Desvíos |
| 2 | Usar **Neon (base compartida)** con tenants sintéticos rotulados, en vez de levantar Docker local | **Claude (yo)**, mismo supuesto | ídem |
| 3 | **Corregir el fallo de autorización** en el mismo turno, antes de seguir con H4 | **El propietario del trabajo**, por pedido explícito | PR api#447 |
| 4 | **No corregir `R4`** (disponibilidad entre organizaciones) y reclasificarlo a `DECISION_REQUIRED` | **Claude (yo)**, con el argumento escrito | `PERMISOS-ESTADOS-DINERO-M06` §1, nota sobre `R4` |
| 5 | **No tocar** `searchBookings` por `resourceId` ni el alcance de `operaCualquierAgenda` | **Claude (yo)**, por disciplina de alcance: vistos leyendo, no ejercitados | PR api#447, sección «Fuera de alcance» |
| 6 | Correr la API en **`:3010`** en vez de `:3000` | **Claude (yo)**, por causa externa (Docker tomó el puerto) | H4 §0 |

Ninguna decisión quedó sin dueño. Las cuatro que tomé yo están marcadas como tales: **no son decisiones de producto y cualquiera puede revertirlas.**

### H5.S2.M3 — Correspondencia con el documento del cliente, actualizada

Sólo las secciones que M-06 toca. «Parcial» significa que una parte se ejercitó y otra no, con el detalle al lado.

| Ítem del cliente | Línea | Estado | Por qué |
|---|---|---|---|
| Revisar médicos disponibles | `:104` | **Parcial** | Se listan; el filtro «con seguro / sin seguro» no existe |
| Médicos por aseguradora | `:105` | **No cubierto** | Fuera del recorrido |
| Ver horario y lugar, y agendar | `:106` | **Cubierto** | Ejecutado, pasos 2 y 3 |
| Aviso de cupo liberado tras un desmarque | `:107` · `:254` | **Parcial** | Funciona, pero **el paciente debe anotarse** y el aviso sale **por barrido**, no al desmarcar |
| Aviso de demora del médico | `:108` · `:253` | **Cubierto** | Ejecutado, pasos 6 y 7 |
| Datos de facturación de la consulta | `:109-111` | **No cubierto** | `R-3`: no existe dónde |
| Horarios en hospitales públicos, con cuadro de calendario | `:247` | **No cubierto** | Otro carril (publicación de agenda) |
| Calendario del médico diario/semanal/mensual con nombre | `:252` | **No cubierto** | Vista del profesional, fuera de este recorrido |
| El aviso llega a «los que estuvieron revisando ese día» | `:254` | **No cubierto** | El sistema exige anotarse: `DR-M06-03` |
| Aviso por push o SMS | `:253` | **No cubierto** | Sin cliente push; SMS `NOT_FOUND` en agenda |

**2 cubiertos · 2 parciales · 6 no cubiertos**, de los 10 ítems que M-06 roza. El resto del documento del cliente (los otros siete módulos) ni se tocó.

---

## §4 — El dictamen preliminar (H5.S3)

### H5.S3.M1 — Estado de entrega

> ### `PRODUCT_ACCEPTANCE_NOT_VERIFIED`
>
> **No** se declara `PRODUCT_ACCEPTANCE_VERIFIED`, y la razón no es una formalidad: el gate C exige **todos** los participantes exigidos, y cuatro de los del propio recorrido no estuvieron (chat, entrega de correo, facturación, móvil). Además hay cuatro rojos abiertos, dos de ellos de privacidad del rastro.

Lo que **sí** se puede afirmar, con comando y salida detrás de cada palabra:

- **El tramo construido del recorrido M-06 funciona de punta a punta contra la API y la base reales.** Siete pasos, sin un solo doble, y el paciente termina con dos avisos reales en su bandeja.
- **La autorización sobre la cita quedó cerrada y verificada** tras el arreglo del PR #447.
- **Las transiciones de estado ilegales las rechaza el backend**, no la interfaz.
- **La atomicidad aguanta** el reintento y la concurrencia, comprobado desde una conexión independiente.

### H5.S3.M2 — Límites externos

| Proveedor / pieza | Estado | Qué haría falta |
|---|---|---|
| Proveedor de correo | **Aceptación externa pendiente** | Alguien que confirme entrega; hoy `sent_at` es lo último que se sabe |
| Push | **Aceptación externa pendiente** | Un cliente conectado |
| Cuenta `SupportAdmin` del chat | **Pendiente de construcción**, no de homologación | La cuenta de empresa (`TAREA-15` punto 1) |
| App móvil | **Pendiente de construcción** | La pantalla que consuma los endpoints ya declarados |
| Base de datos | **Compartida (Neon)** | Un entorno propio si se quiere una aceptación reproducible y aislada |

---

## §5 — Handoff de H5

**A todo el equipo:** la matriz de §1 y los cuatro rojos de la cabecera. El recorrido anda; lo que no anda es el rastro y un requisito del cliente sin implementar.

**A Pablo:** las seis decisiones de alcance de §3.M2 — cuatro son mías y se pueden revertir. Y la pregunta que vuelve: `TEAM_CAPACITY` sigue `DESCONOCIDO`, así que **1 de 19 recorridos** es un dato, no una evaluación de ritmo.

**A Justin:** nada de lo que falló es de tu relación; `agenda → mensajería` entregó. Lo que queda para vos es el paso 8, que depende de que `SupportAdmin` exista.
