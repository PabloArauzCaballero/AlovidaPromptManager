# Plan — correcciones fullstack por carriles (documento «CORRECCIONES», 2026-10-23)

> **Qué es:** el plan para cerrar los **28 puntos** del documento «CORRECCIONES» del propietario, de
> punta a punta (modelo → API → front web → app móvil → Playwright contra la API real), repartido en
> **tres carriles y seis personas**: **Paciente (Leo y Richard) · Doctor (Pablo y Justin) · Farmacia,
> imagenología y laboratorio (Ender e Itzan)**. Cada carril es dueño exclusivo de sus archivos, construye
> contra contratos congelados acá, y no cierra nada que no haya visto pasar en verde en Playwright contra
> la API viva.
>
> - Pedido, palabra por palabra, con un ID por punto: [`CORRECCIONES-FULLSTACK-2026-10-23.md`](../../docs/requisitos/CORRECCIONES-FULLSTACK-2026-10-23.md)
> - Dónde vive cada cosa hoy, archivo:línea, y la brecha exacta: [`VERIFICACION-CONTRA-CODIGO-2026-10-23.md`](../../docs/verificacion/VERIFICACION-CONTRA-CODIGO-2026-10-23.md)
> - Reparto y los seis prompts: [`repartos/2026-10-23/PromptDia/Daily-Dia-2026-10-23.md`](../../repartos/2026-10-23/PromptDia/Daily-Dia-2026-10-23.md)
> - La suite que dice cuándo está hecho: `mantra-core-health/playwright/correcciones-2026-10-23-kill-tests.spec.ts` (hoy en rojo a propósito; ver §8)
> - Peldaño de evidencia de este documento: **`DISCOVERED`**. Es un plan. Lo medido en esta sesión está en el `REPORTE.md` del trabajo.

---

## 1 · Lo que cambia el plan antes de empezar (leer entero)

Son las ocho conclusiones de la verificación, en una línea cada una. El detalle, con archivo y línea,
está en [`VERIFICACION… §1`](../../docs/verificacion/VERIFICACION-CONTRA-CODIGO-2026-10-23.md#1--las-ocho-conclusiones-que-cambian-el-plan).

1. **El flujo de pago del paciente no existe en ninguna capa** (sólo el QR por sede del médico). PA-04 y MD-06 son **un solo desarrollo** con dos pantallas, y es el más grande del plan.
2. **La cobertura del seguro es decorativa**: ningún código calcula «80 % de 100 → 20 Bs». PA-02 es un servicio de cálculo nuevo, no un ajuste de pantalla.
3. **La receta no tiene cabecera**; el QR del PDF apunta a una ruta que no existe. PA-05 arranca por el modelo (T-10 del vault), no por el escáner.
4. **El portal de laboratorio del front es un decorado** (todo `simulatorOnly`). LI-01 se construye sobre la recepción, accesiones, versiones y liberación que la API **sí** tiene, unificando seis máquinas de estado en los cinco estados del cliente.
5. **El mock-provider-server emula cuatro proveedores sin UI ni persistencia y no es hexagonal.** Se le agregan **tres módulos nuevos, disjuntos** (identidad/KYC con veredicto diferido y aprobación, Colegio Médico, sistema de farmacia), cada uno en puertos y adaptadores, y se despliega en Coolify.
6. **Encuestas: sin modo marketing, sin Likert, sin envío automático; el buzón del paciente está oculto por decisión pendiente** (`docs/pendiente-decision-cuestionarios.md`). El documento del cliente **resuelve esa decisión**: el buzón vuelve al menú.
7. **Consentimiento: dos flujos paralelos, ninguno guarda motivo ni categoría.** Se elige **uno** (`consent/practitioner-access-requests`, que ya modela provisiones por clase de dato) y se le agregan las dos dimensiones que pide el cliente.
8. **El glosario tiene 19 313 términos con mediana de definición 0 palabras y 1 sola ≥ 2 000.** El «atlas» se construye corriendo las cuatro etapas de la enciclopedia que ya están escritas en la API, **con procedencia**, nunca generando texto.

Y la transversal: **mucho de lo que «no funciona» funciona contra el simulador y no contra la API
real.** Por eso **toda** microtarea de UI de este plan se demuestra con `ng serve --configuration real-api`
contra la API, y el simulador (`core/mock/**`) se actualiza **después**, para que la maqueta no mienta.

---

## 2 · Las cinco reglas que hacen que nadie se bloquee

1. **Nadie comparte checkout.** Cada persona clona los repos que su prompt nombra y trabaja en un
   `git worktree` por carril. Seis personas, seis árboles.
2. **Toda rama sale de `origin/dev` y vuelve por PR contra `dev`** (regla de los `CLAUDE.md`; en
   `mantra_core_health_mobile`, `main`). Nadie espera un merge para seguir: cierra su hito, abre el PR,
   arranca el siguiente desde `origin/dev`. `merge origin/dev` **al final, no al principio**.
3. **Cada persona es dueña exclusiva de sus archivos** (§6). Dos personas nunca editan el mismo archivo.
   Lo que una necesita de otra está **congelado en §5** o se pide como contrato escrito en el daily el
   primer día, y cada lado construye contra esa forma. Lo que no llega se **simula en tres niveles**
   (regla 65) y se declara; `BLOQUEADO` sin simulación no es un cierre válido.
4. **Un solo dueño de las compuertas compartidas.** Los merges a `dev`, el despliegue del
   `mock-provider-server` y de los workers a Coolify y la carga de seeds en el VPS los hace **Pablo**.
   Nadie más toca Coolify ni la base del VPS.
5. **Primero la API real, después el simulador.** El orden de cada microtarea de UI es: contrato →
   endpoint (o doble declarado) → pantalla contra `real-api` → Playwright contra `real-api` → actualizar
   `core/mock/handlers/**` para que la maqueta pinte lo mismo. Una pantalla que sólo anda con el
   simulador es `A MEDIAS`.

### El único punto de serialización, y por qué es aceptable

**Pablo es el único que toca `@Roles(...)` de endpoints que ya existen y `common/constants/concepts.ts`.**
`role-mapping.ts` tiene un `RoleCode` cerrado y los conceptos son un mapa único; dos carriles
agregándolos a la vez producen un conflicto semántico que ningún merge detecta. Los demás **no esperan**:
anotan el rol o el concepto que necesitan en su reporte y en el daily, siguen con lo suyo, y Pablo lo
aplica en su carril el mismo día.

---

## 3 · Las tres olas

| Ola | Qué | Quién | Cuándo cierra |
|---|---|---|---|
| **0 · Medir y congelar** (día 1) | Corte y rama · baseline `lint`/`typecheck`/`test` · **front `real-api` contra la API local** · correr los kill-tests del carril y pegar los rojos · publicar en el daily los contratos propios de §5 que uno **produce** (DTOs, rutas, códigos de error) | las seis personas | Cuando el daily de equipo tiene las seis filas de «publicado» |
| **1 · Modelo y API** | `.puml` → `SQL/` → base → ORM para lo que toca modelo · endpoints · tests de API con matriz de autorización negativa · mock-provider-server | las seis, cada una en sus módulos | Hito por hito, PR por PR |
| **2 · Pantallas** | Web contra `real-api` · móvil · simulador actualizado · capturas por viewport y tema · doble revisión | las seis | ídem |
| **3 · Verde y cierre** | Los kill-tests del carril **en verde contra la API real** · regresión del módulo · gates · `REPORTE.md` · PR mergeable demostrado con `gh` | las seis; merges y despliegue: Pablo | Cuando la suite del §8 pasa entera |

**Nada de la Ola 2 se declara `HECHO` sin su Ola 3.** Un hito con pantalla y sin kill-test verde es `A MEDIAS`.

---

## 4 · Mapa: punto del cliente → carril → persona → hito

Prioridad: `BLOQUEANTE` (el cliente lo nombra como roto o lo exige para operar) · `ALTA` · `MEDIA`.
«Hito» remite al prompt de la persona. Los puntos que cruzan carriles aparecen en los dos, con quién
**lidera** y quién **participa**.

### Carril 1 · Paciente — Leo y Richard

| ID | Qué pide, en una línea | Persona | Hito | Prioridad | Depende de |
|---|---|---|---|---|---|
| PA-01 | KYC: carnet ambos lados + liveness 3 poses → el admin acepta en el backoffice → validado | **Leo** | L-H2 | BLOQUEANTE | §5 C-07 (mock identidad), Pablo despliega el mock |
| PA-03 | Barra superior: sin Emergencia; Tutoriales en Ajustes; Mis facturas como pestaña «Resumen» de Mis gastos; Promociones dentro de Carrito sin el mapa | **Leo** | L-H3 (web) · L-H6 (móvil) | ALTA | — |
| PA-08 | Tabla de permisos pedidos por cada médico, por categoría de la historia, sistema del cuerpo y fase; conceder / rechazar / revocar con motivo | **Leo** | L-H4 | ALTA | §5 C-05 (Pablo produce el contrato de consentimiento) |
| PA-09.a/c/d | Quitar «Recomendar medicamentos» y dejar el panel de especialistas; mejorar la entrada principal; sacar los bloques vacíos | **Leo** | L-H5 | MEDIA | Q-IMG (capturas) |
| PA-12 | Buzón de encuestas pendientes por tipo de partner y de servicio | **Leo** | L-H7 | ALTA | §5 C-06 (Pablo extiende `PatientInvitationDto`) |
| PA-02 | Cobrar sólo el % no cubierto; aprobadas por contrato; orden de aprobación; tabla | **Richard** | R-H2 | BLOQUEANTE | §5 C-02 (Richard produce `PatientSharePort`; Pablo lo consume en billing) |
| PA-04 | Pago por QR de la sede; comprobante o «pagué en efectivo»; pendiente / aceptada / rechazada | **Richard** (paciente) · Pablo (médico, API) | R-H3 | BLOQUEANTE | §5 C-01 (Pablo produce la API de comprobantes el día 1) |
| PA-09.b | Sin mapa de Bolivia en directorios; ubicación detectada → municipio y departamento prefiltrados | **Richard** | R-H4 | ALTA | §5 C-08 (Richard produce `GET /geo/reverse`) |
| PA-11 | Rediseño de Directorios al patrón marketplace (serio, institucional, humano) | **Richard** | R-H5 | ALTA | R-H4 |
| PA-10 | Promociones como marketplace por tipo de partner (médico, imagenología, laboratorio, farmacia, aseguradora) | **Richard** | R-H6 | MEDIA | §5 C-09 (listado público de promociones) |
| PA-05 (lado paciente) | Pestaña Farmacia: abrir la receta por QR / enlace, reservar en la sucursal que la tiene | Leo participa | L-H8 | ALTA | Ender produce §5 C-03 |
| PA-07 (lado paciente) | Reservar cupo del servicio general desde la orden | Richard participa | R-H7 | ALTA | Itzan produce §5 C-04 |
| MD-10 (lado paciente) | Ver, cancelar y **mover** la cita desde el portal, con el mensaje interno | Richard participa | R-H8 | ALTA | Justin produce la reprogramación |

### Carril 2 · Doctor — Pablo y Justin

| ID | Qué pide, en una línea | Persona | Hito | Prioridad | Depende de |
|---|---|---|---|---|---|
| MD-01 | CI ocupado por el mismo tipo de usuario → rechazo claro en el alta (todos los repos) | **Pablo** | P-H2 | BLOQUEANTE | Modelo (índice único) |
| MD-02 | Identidad y credenciales del médico vía mock «Colegio Médico», hexagonal | **Pablo** | P-H3 | ALTA | §5 C-07 |
| MD-03 / PA-08 | Bandeja del médico de sus pedidos de acceso; pedido por categoría, sistema y fase; motivo en cada decisión | **Pablo** (API + médico) · Leo (paciente) | P-H4 | ALTA | — (Pablo produce C-05) |
| MD-05 | Botón Guardar; Likert en modo marketing; toggle Médico–Marketing; estándar mínimo para consulta; envío automático al cerrar la cita por mensajería interna | **Pablo** | P-H5 | ALTA | Q-14 (preguntas mínimas) |
| MD-06 / PA-04 | Comprobantes en la pantalla de atención; aceptar / rechazar; cierre del servicio y factura sólo con pago confirmado | **Pablo** | P-H6 | BLOQUEANTE | — (Pablo produce C-01) |
| MD-04 | Horarios multi-consultorio y multi-servicio tipo MS Project; semana y mes rediseñados | **Justin** | J-H2 | ALTA | — |
| MD-09 | Bloqueos visibles en día, semana, mes, rejilla y selector del paciente, para **todas** las sedes | **Justin** | J-H3 | BLOQUEANTE | — |
| MD-10 | Reservar, cancelar y mover con mensaje interno; arreglar lo que hoy no funciona (403 del médico, sin reprogramar en web, confirmación de mostrador sin aviso) | **Justin** | J-H4 | BLOQUEANTE | — |
| MD-07 | Glosario → atlas: diversidad, páginas largas con procedencia, imágenes, filtro arriba, íconos | **Justin** | J-H5 | MEDIA | Q-15 |
| MD-08 | Relaciones enfermedad ↔ síntoma ↔ medicina ↔ anatomía | **Justin** | J-H6 | MEDIA | J-H5 |

### Carril 3 · Farmacia, imagenología y laboratorio — Ender e Itzan

| ID | Qué pide, en una línea | Persona | Hito | Prioridad | Depende de |
|---|---|---|---|---|---|
| PA-05 | Receta con cabecera y QR por receta; enlace que abre la receta con sesión; la farmacia la carga y marca por sucursal qué tiene; el paciente reserva | **Ender** | E-H2 | BLOQUEANTE | Modelo (T-10) |
| PA-06 | Mock de sistema de farmacia, hexagonal, con mapeo de códigos en los dos sentidos | **Ender** | E-H3 | ALTA | §5 C-07 |
| FA-01 | Importación masiva (CSV y XLSX, upsert) en productos, categorías, precios, inventario y sucursales | **Ender** | E-H4 | ALTA | Modelo (categorías) |
| FA-02 | Una sola pantalla ERP con pestañas Productos · Categorías · Precios · Inventario | **Ender** | E-H5 | ALTA | E-H4 |
| PA-07 | QR por orden con los estudios exactos; reserva por servicio general; duración flexible con default configurable | **Itzan** | I-H2 | BLOQUEANTE | §5 C-04 (Justin agrega `serviceRequestId` a la reserva) |
| LI-01 | Pantalla de órdenes: «Crear instancia de servicio»; filas PACIENTE / ESTUDIO / FECHA / ESTADO / ACCIONES; RECIBIR / RECHAZAR / SUBIR / CONFIRMAR / DESCARGAR; cinco estados; inmutable tras CONFIRMADO | **Itzan** | I-H3 | BLOQUEANTE | — |
| LI-02 | CRUD de servicios ofrecidos + upsert masivo | **Itzan** | I-H4 | ALTA | — |
| LI-03 | Perfil del laboratorio | **Itzan** | I-H5 | ALTA | Q-IMG |
| PA-02 (lado proveedor) | Cobro con seguro en farmacia y laboratorio: coaseguro visible por ítem | Ender e Itzan participan | E-H6 · I-H6 | MEDIA | Richard produce C-02 |

**Cobertura:** 28 / 28 puntos con dueño. Ningún punto queda sin carril.

---

## 5 · Contratos congelados — no se discuten por carril

Cada contrato tiene **un productor** (lo implementa) y **consumidores** (construyen contra la forma
desde el día 1, con doble declarado hasta que llegue). La forma se publica en el daily el día 1 con el
DTO real; lo de abajo fija nombre, ruta, semántica y códigos. **Identificadores en inglés; prosa de
pantalla en castellano rioplatense; dinero en enteros de la menor unidad (`amountMinor`, `currency`)
en todo lo nuevo (`accounting-double-entry`).**

### C-01 · Comprobante de pago del paciente — produce **Pablo** (`billing`) · consumen Richard (paciente), Ender e Itzan (cobro de pedidos y órdenes)

| Pieza | Forma |
|---|---|
| Tabla nueva | `billing.payment_proofs` (`.puml` M17 → `SQL/17_billing`): `id`, `charge_id` (FK `billing.charges` o el cargo simulado), `booking_id?`, `patient_profile_id`, `practice_site_id?`, `method` (`QR_TRANSFER` \| `CASH`), `file_id?` (obligatorio si `QR_TRANSFER`), `amount_minor`, `currency`, `status` (`PENDING_REVIEW` \| `ACCEPTED` \| `REJECTED`), `rejection_reason?`, `reviewed_by_user_id?`, `reviewed_at?`, `created_at` |
| Paciente | `GET /billing/me/charges/:chargeId/payment-context` → `{ amountMinor, currency, patientShare: C-02, site: { id, name, bankQrFileId } }` · `POST /billing/me/charges/:chargeId/payment-proofs` body `{ method, fileId?, amountMinor }` → 201 `{ id, status: 'PENDING_REVIEW' }` · 409 `PROOF_ALREADY_PENDING` si ya hay uno pendiente · 422 `FILE_REQUIRED` |
| Médico | `GET /billing/charges/:chargeId/payment-proofs` · `POST /billing/payment-proofs/:id/accept` → 200 `{ status: 'ACCEPTED' }` y el cargo pasa a `PAID` · `POST /billing/payment-proofs/:id/reject` body `{ reason }` (obligatorio) → 200 `{ status: 'REJECTED' }`; el cargo vuelve a `PENDING` |
| Reglas | `POST /clinical/encounters/:id/close` → 412 `PAYMENT_REQUIRED` si el cargo no está `PAID` (salvo `insuranceCoversFull`) · `POST /billing/charges/:id/invoices` ya exige pago: se mantiene y se extiende al camino no simulado · estado de la sesión derivado del comprobante, **no** de la bandera manual `appointment_payment_states` |
| Autorización | El paciente sólo ve y crea sobre sus cargos (404 ajeno). El médico sólo sobre cargos de sus encuentros. Matriz negativa obligatoria en el test de API |

### C-02 · Parte del paciente según el seguro — produce **Richard** (`insurance`) · consumen Pablo (billing), Ender, Itzan

| Pieza | Forma |
|---|---|
| Puerto | `PatientSharePort.compute({ patientProfileId, serviceConceptId, amountMinor, currency, context: 'CONSULTATION' \| 'PHARMACY_ORDER' \| 'DIAGNOSTIC_ORDER', itemRef? })` → `{ coveragePercent, patientAmountMinor, insurerAmountMinor, approval: { status: 'COVERED_BY_CONTRACT' \| 'NEEDS_APPROVAL' \| 'APPROVED' \| 'DENIED' \| 'NO_COVERAGE', priorAuthorizationRequestId?, reason? } }` |
| Regla | Si el beneficio del plan cubre el concepto y `requires_prior_authorization = false` → `COVERED_BY_CONTRACT` y se aplica `coverage_percent` **sin pedir nada**. Si exige autorización y no hay determinación → `NEEDS_APPROVAL` y el paciente paga el total **o** pide la orden. Si hay determinación → `APPROVED` (monto aprobado) o `DENIED` (motivo y cláusula) |
| Endpoints | `GET /insurance/me/coverage-preview?serviceConceptId&amountMinor&context` (paciente) · `POST /insurance/me/prior-authorization-requests` body `{ serviceConceptId, encounterId? \| serviceRequestId? \| medicationRequestId?, amountMinor }` (hoy el paciente **no** puede pedirla: se habilita el rol PATIENT en `prior-auth.controller.ts:95` con `patientProfileId` del token) · `GET /insurance/me/prior-authorization-requests` (la **tabla** del cliente: servicio, prestador, monto, % cubierto, mi parte, estado, motivo) |
| Ejemplo que tiene que dar la prueba | plan con `coverage_percent = 80`, consulta de 100 Bs → `patientAmountMinor = 2000`, `insurerAmountMinor = 8000` |

### C-03 · Receta con cabecera y enlace QR — produce **Ender** (`clinical` recetas + `pharmacy`) · consumen Leo (pestaña Farmacia), Pablo/Justin (la consulta muestra el QR)

| Pieza | Forma |
|---|---|
| Modelo (T-10) | `clinical.prescriptions` (cabecera: `id`, `folio`, `patient_profile_id`, `encounter_id`, `prescriber_profile_id`, `status`, `issued_at`, `signed_at`) y `medication_requests.prescription_id` (FK, nullable para las viejas). `.puml` M08 → `SQL/08_clinical` → ORM |
| Enlace | `POST /clinical/prescriptions/:id/share-links` → `{ url: '<web>/rx/<token>', expiresAt }` (token firmado, ≤ 30 días, **sin datos clínicos en la URL**) · `GET /rx/resolve/:token` (requiere sesión): si la sesión es del paciente prescrito o su tutor → `{ prescription, items[] }`; si es PHARMACY_STAFF → lo mismo más `{ pharmacyLoad: { id } }` (la receta queda «cargada» en esa farmacia); cualquier otra → 403 `NOT_PRESCRIBED_PATIENT`; sin sesión → 401 (el front lleva a `/auth?next=/rx/<token>`) |
| Disponibilidad por sucursal | `PUT /pharmacy/prescription-loads/:loadId/availability` body `{ items: [{ medicationRequestId, siteId, available: boolean, productId?, priceMinor? }] }` (lo marca el personal) · `GET /pharmacy/prescription-loads/:loadId` (paciente y personal) · el paciente reserva con el `POST /pharmacy/orders` existente usando `prescriptionId` |
| QR | El PDF y la pantalla de la receta dibujan el QR de `url`, **no** el UUID. Ruta web nueva `/rx/:token`; app link Android/iOS `alovida://rx/<token>` + `https://<dominio>/rx/<token>` |

### C-04 · Orden diagnóstica con enlace QR y reserva por servicio — produce **Itzan** (`clinical` órdenes + `diagnostics`) con **Justin** (`scheduling`) · consume Richard

| Pieza | Forma |
|---|---|
| Enlace | `POST /clinical/service-requests/:id/share-links` → `{ url: '<web>/orden/<token>', expiresAt }` · `GET /orden/resolve/:token` (sesión): paciente dueño → `{ order, studies[] }`; DIAGNOSTIC_STAFF → ídem + `{ receptionId }` (la orden queda **INICIADA** en ese centro) |
| Reserva (Justin agrega, Itzan consume) | `POST /scheduling/holds/:token/request` y `POST /scheduling/slots/:id/holds` aceptan `serviceRequestId?` y `durationMinutes?`; `appointment_bookings.service_request_id` (FK nullable, `.puml` M41) · `PATCH /scheduling/bookings/:id/duration` body `{ durationMinutes }` (DIAGNOSTIC_STAFF, al aceptar o después) · default configurable: `diagnostic_study_offerings.expected_duration_minutes` **se usa** al generar cupos del recurso del centro, y `PATCH /diagnostic-units/:id/settings { defaultSlotMinutes }` |
| Cinco estados (LI-01) | Vista unificada `GET /diagnostics/orders?status&from&to` → filas `{ orderId, patient, study, requestedAt, status: 'INICIADA' \| 'RECIBIDA' \| 'EN_PROCESO' \| 'RECHAZADA' \| 'CONFIRMADO', actions[] }`, derivada de las seis máquinas existentes (mapa en la verificación §LI) · `POST /diagnostics/orders/:id/receive` · `.../reject { reason }` · `.../results` (sube N archivos vía `object-storage` y crea versión preliminar) · `DELETE .../results/:fileId` (sólo antes de confirmar) · `.../confirm` (libera `REPORT_FINAL` y **bloquea** versiones nuevas, archivos y estado: 409 `ORDER_CONFIRMED`) · `GET .../results/download` (zip o archivo) |

### C-05 · Consentimiento por categoría, sistema y fase — produce **Pablo** (`consent`) · consume Leo

| Pieza | Forma |
|---|---|
| Un solo flujo | Se usa `consent/practitioner-access-requests`; `authz/care-relationships/request` queda sólo para la **vinculación** y deja de pedirse desde `request-access` |
| Catálogos (terminology, con procedencia) | `VS_CLINICAL_RECORD_SECTION` (Análisis clínico, Enfermedades activas, Histórico de enfermedades, Medicación, Alergias, Antecedentes, Imágenes, Notas de consulta…) · `VS_BODY_SYSTEM` (los 11 sistemas del examen físico, reutilizando `EXAM_BODY_SYSTEM_*` donde exista) |
| Pedido | `POST /consent/practitioner-access-requests` body `{ patientProfileId, specialtyConceptIds[], recordSectionConceptIds[], bodySystemConceptIds[]?, reasonText }` — **`reasonText` se persiste** (`consents.reason_text`) |
| Decisión | `POST /consent/practitioner-access-requests/:id/decision` body `{ decision: 'ACCEPTED' \| 'DECLINED', authorizedSectionConceptIds[], validityMonths, reasonText? }` (DECLINED exige `reasonText`) · `POST /consent/me/consents/:id/withdraw { reasonText }` (REVOKED ≠ DECLINED) |
| Lecturas | `GET /consent/practitioner-access-requests/mine` (paciente) devuelve filas por **sección** con estado `REQUESTED \| GRANTED \| DECLINED \| REVOKED`, el médico, su especialidad/área, el sistema del cuerpo y el motivo · `GET /consent/practitioner-access-requests/sent` (**nuevo**, médico: su bandeja) |
| Aplicación | `clinical-read.service.ts` pasa `recordSection` al PDP; una sección no concedida → 403 `SECTION_NOT_GRANTED`. La relación de cuidado activa **no** salta las secciones |

### C-06 · Encuestas: modo, Likert, obligatoria, envío automático, buzón — produce **Pablo** (`surveys`, `messaging`) · consumen Leo (buzón), Ender e Itzan (encuestas de farmacia y laboratorio)

| Pieza | Forma |
|---|---|
| Plantilla | `survey_templates.kind` (`CLINICAL` \| `MARKETING`), `mandatory_for_patient`, `partner_type` (`PRACTITIONER` \| `PHARMACY` \| `LABORATORY` \| `IMAGING_CENTER` \| `INSURER`) — `.puml` nuevo M65 (T-31: hoy `surveys` **no tiene** `.puml`; se promueve al modelo en el mismo hito) |
| Likert | tipo de respuesta `LIKERT` con `scale_min`, `scale_max` y `scale_labels_json` (anclas), disponible sólo en `MARKETING` |
| Estándar de consulta | plantilla sembrada `SURVEY_STD_CONSULTATION` (5 preguntas, Q-14), `mandatory_for_patient = true`, asignada por defecto al target `CARE_TYPE = CONSULTATION`; el médico agrega preguntas opcionales en una versión propia |
| Envío automático | `complete-appointment.use-case.ts` publica `scheduling.booking.completed` (outbox); el worker de `surveys` emite la invitación y **manda un mensaje por la mensajería interna** (hilo médico↔paciente ya existente) con el enlace. Idempotente por reserva |
| Otros partners | `POST /surveys/invitations` acepta `{ targetType: 'PHARMACY_ORDER' \| 'DIAGNOSTIC_ORDER', targetId }`; se emite al pasar a `RETIRADO` / `CONFIRMADO` |
| Buzón | `PatientInvitationDto` gana `partnerType`, `providerName`, `serviceLabel`, `mandatory`, `templateKind`; `GET /surveys/me/invitations?partnerType&status` |

### C-07 · `mock-provider-server`: tres módulos nuevos, hexagonales, desplegados — produce cada carril el suyo; **Pablo** despliega

| Módulo | Dueño | Qué simula | Puerto del lado de la API |
|---|---|---|---|
| `src/identity-verification` (extiende el existente) | **Leo** | Recibe las cinco evidencias (referencias de archivo, nunca el contenido PHI), persiste en SQLite local del mock, expone `GET /backoffice/cases` y `POST /backoffice/cases/:id/decision` (**el veredicto ya no es automático**: queda `PENDING` hasta que alguien decide o vence `IDENTITY_VERIFICATION_DELAY_MS` con `AUTO_DECIDE=false` por defecto) | `IdentityVerificationProviderAdapter` existente; el worker **no** auto-verifica: al recibir `PENDING` reintenta; `ACCEPTED` → `settleCase` |
| `src/medical-college` | **Pablo** | Padrón sintético de matrículas (`license_number`, `profession`, `college`, `status`, `issued_at`) con procedencia declarada «sintético»; `POST /medical-college/verify { licenseNumber, nationalId, profession }` → `{ status: 'ACTIVE' \| 'SUSPENDED' \| 'NOT_FOUND', college }` | Puerto nuevo `MedicalCollegePort` en `identity_assurance/application/ports`, adaptador HTTP en `infrastructure/adapters`, autoridad sembrada `COLEGIO_MEDICO_BOLIVIA` y `COLEGIO_ODONTOLOGOS_BOLIVIA` |
| `src/pharmacy-system` | **Ender** | Un «sistema de farmacia» con productos propios (`sku`, `name`, `stock`, `price`), `GET /pharmacy-system/products`, `GET /stock?sku`, `POST /reservations`, `POST /dispense`, y mapeo `sku ↔ pharmacy_external_product_mappings` en los dos sentidos | Puerto `PharmacySystemPort` (`stockQuery`, `priceQuery`, `reserve`, `confirmDispense`) en `pharmacy/application/ports`; adaptador HTTP; `reconcile` **usa** los mapeos |
| Estructura | Cada módulo nuevo: `domain/`, `application/ports/`, `application/use-cases/`, `infrastructure/adapters/`, `presentation/`. El existente se migra a esa forma **sólo** en su módulo |
| Despliegue | `docker-compose.coolify.yml` suma `mock-provider-server` y `worker-identity_assurance`; `assertMockProviderNotInProduction` se relaja con `MOCK_PROVIDER_ALLOWED_IN=staging` explícito. **Pablo.** |

### C-08 · Geocodificación inversa — produce **Richard** (`geo`) · consumen Leo (inicio), Ender e Itzan (sucursal más cercana)

`GET /geo/reverse?lat&lng` → `{ departmentConceptId, municipalityConceptId, label }`, resuelto **sin
servicio externo**: punto en polígono contra los municipios del catálogo (`BoMunicipalitiesCatalog` ya
trae el centroide; los polígonos se incorporan desde el dataset de límites municipales con su
procedencia, o, mientras no esté, **municipio más cercano por centroide**, declarado). Servicio compartido
en el front `core/geo/current-location.service.ts` (permiso, posición, reverse, caché por sesión,
fallback a `residenceMunicipalityConceptId` del perfil).

### C-09 · Promociones públicas por tipo de partner — produce **Richard** (`promotions`) · consumen Ender e Itzan (autoría)

`promotions.partner_type`, `image_file_id`, `site_id?`, `price_minor?` · `GET /public/promotions?partnerType&department&municipality&cursor`
(sin tenant) · el motor de farmacia (`core/promotions-engine`, hoy demo en memoria) pasa a leer de la API.

### C-10 · Unicidad del documento — produce **Pablo** (`iam`, `common`) · consumen Leo (alta de paciente), Ender e Itzan (altas de organización)

`common.identifiers` gana `owner_kind` (`PATIENT` \| `PRACTITIONER` \| `ORGANIZATION_REP`) e índice único
`ux_identifiers_document_owner_kind (type_concept_id, value, issuer_department, owner_kind) WHERE
deleted_at IS NULL` (`.puml` M02) · los tres altas y las asistidas llaman `IdentifiersRepository.
findActiveDuplicate` **con `ownerKind`** antes de crear · 409 con código estable
`DOCUMENT_ALREADY_REGISTERED` y `{ field: 'nationalId' }` · `GET /iam/auth/document-availability?
type&number&issuer&userType` → `{ available }` para el validador asíncrono del front y del móvil.

---

## 6 · Propiedad de archivos — nadie pisa a nadie

Es la lista mínima; cada prompt la detalla. **Si necesitás algo que no es tuyo, lo pedís por el daily.**

| Persona | API (`mantra-core-health-api/src/modules/…` salvo indicación) | Front (`mantra-core-health/src/app/…`) | Modelo / mock / móvil |
|---|---|---|---|
| **Leo** | — (pide a Pablo lo que falte de `identity_assurance`; sólo puede tocar `worker/jobs/identity_assurance/*` y `identity-manual-review*`) | `features/identity-verification/**`, `features/identity-assurance/**`, `features/shell-layout/**` (barra), `features/settings/**`, `features/account/spending/**`, `features/account/my-invoices/**`, `features/account/promotions/**` (sólo la fusión con `cart`), `features/account/pharmacy/cart/**`, `features/dashboard/patient-home/**`, `features/symptom-check/**` (sólo la pestaña de recomendaciones), `features/account/access-requests/**`, `features/account/clinical-access/**`, `features/account/questionnaires/**`, `features/account/pharmacy/prescriptions/**` + ruta `/rx/:token`, `core/navigation/**` (filas del paciente), `core/mock/handlers/identity.handlers.ts`, `consent`, `surveys-forms` | `mock-provider-server/src/identity-verification/**` · móvil: `features/patient_shell/**`, `features/patient_home/**`, `features/identity/**`, `features/questionnaires/**` (paciente), rutas y app links de `/rx` |
| **Richard** | `insurance/**` (C-02), `geo/**` (C-08), `promotions/**` (C-09), `community/controllers/community-public.controller.ts` + sus DTOs (filtros y orden del directorio) | `features/billing/patient-payment/**` (nuevo), `features/account/my-requests/**`, `features/account/coverage/**` (nuevo), `features/directory/**`, `features/directories-overview/**`, `features/public-directories/**`, `features/laboratory-directory/**`, `features/account/promotions/**` (marketplace), `features/campaigns/**`, `shared/components/organisms/department-map/**` (retiro), `shared/components/organisms/directory-page/**`, `core/geo/**` (nuevo), `features/account/appointments/**`, `features/account/diagnostic-orders/**` (reserva), `core/mock/handlers/{insurance,promotions,geo}.handlers.ts` | `.puml` M26, M13, M51 · móvil: `features/insurance/**`, `features/directory/**`, `features/loyalty/**`, `features/appointments/**` |
| **Pablo** | `billing/**` (C-01), `iam/**` y `common/repositories/identifiers*` (C-10), `consent/**` y `authz/controllers/authz-care-relationships*` (C-05), `surveys/**`, `forms/**`, `messaging/**` (C-06), `identity_assurance/**` (salvo lo de Leo), `profiles/**` (credenciales), `clinical/services/encounters.service.ts` (cierre), `common/constants/concepts.ts`, todo `@Roles` de endpoints existentes, `worker/worker.env.ts`, `docker-compose.coolify.yml` | `features/clinical-record/consultation/**` (caja Pagos), `features/clinical-record/patient-chart/payments-block/**`, `features/clinical-record/request-access/**`, `features/clinical-record/access-inbox/**` (nuevo), `features/form-builder/**`, `features/questionnaires/**` (médico), `features/auth/register-*/**` (validador de documento), `features/onboarding-practitioner/**`, `core/data-access/{billing,consent,surveys,authz,iam}/**` | `.puml` M02, M07, M17, M65 (nuevo) · `mock-provider-server/src/medical-college/**` · Coolify · móvil: `features/consultation_billing/**`, `features/practitioner_registration/**`, `features/auth/**` (alta de paciente: validador) |
| **Justin** | `scheduling/**` (incluye C-04 del lado de la reserva), `terminology/**` y `tools/terminology-import/**` (glosario), `community/*booking-chat*` | `features/agenda/**`, `features/dashboard/today-agenda/**`, `features/directory/practitioner-availability/**`, `features/directory/practitioner-service-schedule/**`, `features/glossary/**`, `features/symptom-check/*.data.ts` (relaciones), `scripts/glossary-*.mjs`, `public/glossary-seed/**`, `core/mock/handlers/{scheduling,glossary}.handlers.ts` | `.puml` M41 · `AlovidaAIService/src/modules/knowledge/**` y `scripts/build-glossary-official.mjs` · móvil: `features/scheduling/**`, `features/clinician/presentation/my_agenda_screen.dart` |
| **Ender** | `clinical/**/prescription*` y `clinical/controllers/clinical-prescriptions*` (C-03), `pharmacy/**`, `pharmacy_inventory/**`, `public/**` (resolver `/rx`) | `features/pharmacy/**`, `features/organization/pharmacy-*/**`, `features/account/pharmacy/store-front/**`, `features/account/pharmacy/search/**`, `features/account/medical-record/where-to-buy/**`, `features/account/pharmacy-orders/**`, `core/data-access/pharmacy*/**`, `core/mock/handlers/pharmacy*.handlers.ts`, `shared/utils/qr/**`, `shared/components/organisms/qr-scanner/**` (nuevo, lo comparte con Itzan por contrato: lo escribe Ender en la Ola 0) | `.puml` M08 (recetas), M24, M25 · `mock-provider-server/src/pharmacy-system/**` · móvil: `features/pharmacy/**`, `features/pharmacy_admin/**`, escáner |
| **Itzan** | `clinical/**/service-request*` y `clinical/controllers/clinical-orders*` (C-04), `diagnostics/**`, `diagnostic_units/**`, `object_storage/**` (sólo lo que la subida de resultados necesite) | `features/laboratory/**`, `features/lab-reception/**`, `features/diagnostics/**`, `features/admin/medical-laboratory/**`, `features/organization/organization-profile/**` (laboratorio), `features/clinical-record/patient-chart/analysis-order-block/**` (QR de la orden), `core/data-access/{lab-portal,diagnostics,diagnostic-units}/**`, `core/mock/handlers/{lab,diagnostics}*.handlers.ts`, ruta `/orden/:token` | `.puml` M08 (órdenes), M20, M23 · móvil: `features/lab_portal/**`, `features/health/**` (reserva de laboratorio) |

**Compartido y congelado (nadie lo edita sin aviso en el daily):** `app.routes.ts` (cada persona agrega
**sólo** sus rutas, en su bloque, con un comentario con su nombre), `navigation.map.ts` (ídem),
`component-index.generated.ts` (se regenera, no se edita), `openapi/openapi.json` (se regenera con el
script del repo al cerrar cada hito de API), `src/orm/catalog/**` (se regenera desde el DDL).

---

## 7 · Lo que ya está construido y NO se vuelve a crear

Está medido en la verificación. Que el pedido lo nombre como nuevo no lo hace nuevo.

- **Las cinco evidencias del KYC** (frente, dorso, tres poses) ya se capturan en web y móvil y ya tienen
  tipo en la API. Lo que falta es la decisión humana y el despliegue del mock.
- **El QR bancario por sede** existe (`practice_sites.bank_qr_file_id`, `PUT /practitioners/me/sites/:id/bank-qr`).
- **La pre-autorización del seguro** existe con aprobación parcial por ítem, motivo y cláusula.
- **Las recepciones, accesiones, órdenes de trabajo, versiones de informe y liberación** del laboratorio
  existen en la API. LI-01 las **unifica**, no las reescribe.
- **El tablero de pedidos de farmacia** (seis colas, sustituciones, código de retiro) existe.
- **La agenda manda avisos** por campana, correo y chat en pedido, aceptación, rechazo, cancelación,
  reprogramación, cita directa y corrimiento. Faltan dos eventos y el hilo correcto.
- **Las cuatro etapas de la enciclopedia del glosario** están escritas; hay que correrlas.
- **El motor de encuestas** tiene plantillas versionadas, preguntas, asignaciones por servicio e invitaciones.
- **`DirectoryPage`**, `filter-bar`, `result-card`, `app-data-table`, `app-select`, `app-tabs`,
  `content-dialog`, `file-input`, `DialogService.confirm()`: el rediseño de directorios y el ERP de
  farmacia se arman con lo que hay en `shared/` (`atomic-design-components`, regla 95.1).

---

## 8 · La suite que dice cuándo está hecho

`mantra-core-health/playwright/correcciones-2026-10-23-kill-tests.spec.ts` tiene **una prueba por
punto verificable**, etiquetada `@carril-1`, `@carril-2`, `@carril-3` y con el ID del cliente en el
título. **Hoy está en rojo a propósito**: cada prueba afirma el comportamiento que pide el cliente y falla
por el motivo que describe la verificación. La regla es una sola: **se corrige el producto hasta que la
prueba pase; la aserción no se toca.** Si una aserción está mal escrita, se corrige con justificación en
el PR y se declara.

```bash
# en mantra-core-health, con la API real levantada (docker compose up del repo de la API) y las
# cuentas E2E sembradas (yarn seed:e2e en la API)
corepack yarn start:real-api                         # terminal 1
E2E_API_URL=http://localhost:3005 \
E2E_DOCTOR_EMAIL=… E2E_DOCTOR_PASSWORD=… E2E_ADMIN_EMAIL=… E2E_ADMIN_PASSWORD=… \
E2E_PHARMACY_EMAIL=… E2E_PHARMACY_PASSWORD=… \
corepack yarn pw playwright/correcciones-2026-10-23-kill-tests.spec.ts --grep @carril-1 --reporter=list
```

Cada persona corre **su** `--grep` en la Ola 0 (todo rojo: ése es el baseline) y en la Ola 3 (todo verde:
ése es el cierre). Entre medio, cada microtarea de UI nombra en su DoD qué prueba de la suite pone en
verde. El simulador se verifica con `start:demo`, **después**, y vale `VERIFIED_FUNCTIONAL_ONLY` como mucho.

---

## 9 · Decisiones que necesitan dueño

Las veinte ambigüedades están en el archivo de requisitos. Estas **cinco mueven semanas** y hay que
responderlas antes de que el carril que depende de ellas pase de la Ola 1:

| # | Decisión | Carril que espera | Supuesto con el que se arranca |
|---|---|---|---|
| D-1 | **¿Quién adjudica la autorización del seguro?** (vault, decisión 1) La fuente se contradice entre 6.2 y 1.5 | Richard (C-02, aprobación «por contrato») | La app aplica lo que el contrato declara aprobado (`requires_prior_authorization = false`) y **transporta** la decisión de la aseguradora para el resto. No se construye un motor de reglas de pólizas |
| D-2 | ¿El pago por QR es contra el QR bancario estático de la sede (lo que dice el cliente) o un QR emitido con monto (T-29, pasarela)? | Richard, Pablo (C-01) | **QR estático de la sede + comprobante subido.** T-29 queda para la pasarela, fuera de este plan |
| D-3 | Q-14: las cinco preguntas mínimas de la encuesta de consulta | Pablo (C-06) | Propuesta en el prompt; se siembra como `PROPUESTA` hasta que el doctor confirme |
| D-4 | Q-15: fuentes del atlas (MedlinePlus + Orphanet + CIMA + Wikidata/Commons; ¿se habilita Wikipedia en español con atribución CC BY-SA?) | Justin (J-H5) | Sin Wikipedia hasta que Pablo lo apruebe; con ella, el ≥ 2 000 palabras alcanza a muchas más entradas |
| D-5 | Q-04: «la barra superior de la app» = web + móvil | Leo (L-H3, L-H6) | Las dos, web primero |

Y las seis capturas que faltan (Q-IMG): **Pablo las adjunta a este plan** antes de que Leo (PA-09.c/d),
Itzan (LI-03) y Ender (FA-01/02) toquen esas pantallas.

---

## 10 · Riesgos, con su dueño

| Riesgo | Medido | Dueño | Mitigación |
|---|---|---|---|
| El pago (C-01) cruza tres carriles | Es el desarrollo más grande; Richard, Ender e Itzan construyen contra él | Pablo | C-01 publicado con DTO real **el día 1**; hasta entonces, doble en el simulador con los tres niveles |
| `surveys` y `pharma_lab` no tienen `.puml` (T-31) | 38 tablas que no sobreviven a `rebuild_stack.py` | Pablo | P-H5 arranca transcribiendo `surveys` al `.puml` (procedimiento de `audio_assets`) |
| Receta con cabecera cambia a todos los que leen `medication_requests` | PDF, chart, farmacia, seguro | Ender | `prescription_id` nullable; las recetas viejas se agrupan por encuentro+fecha como hoy; migración de datos en patch |
| El worker de identidad auto-acepta en local | Cualquier prueba de KYC «pasa» sin humano | Leo | `AUTO_DECIDE=false` por defecto en el mock; la prueba E2E exige la decisión del admin |
| `forbidNonWhitelisted`: todo campo nuevo del front da 400 hasta que el DTO lo declare | Causa #1 de las brechas históricas | cada productor | El contrato se publica **con el DTO**; el consumidor no manda nada que el DTO no declare |
| Rate limit de login (10/min/IP) en Playwright | Suites paralelas se caen con 429 | todos | `workers: 1` (ya está); un login por rol por archivo |
| Flutter sin verificación en este entorno | El plan móvil es `DISCOVERED` | cada persona con móvil | `flutter analyze` + `flutter test` + captura en simulador iOS/Android en el DoD, en la máquina de cada uno |
| Seis capturas sin recibir | Cuatro puntos se interpretan por texto | Pablo | Q-IMG |

---

## 11 · Cómo se regenera lo que acá se cita

- Transcripción: a mano desde el documento de Google (sin script: el conector no exporta las imágenes).
- Verificación: lectura de código en el corte de §0 de la verificación; los números del glosario salen
  de un recorrido con Node sobre `public/glossary-seed/shards/**` (comando en el `REPORTE.md`).
- Validación del reparto: `python tools/check_reparto.py repartos/2026-10-23`.
