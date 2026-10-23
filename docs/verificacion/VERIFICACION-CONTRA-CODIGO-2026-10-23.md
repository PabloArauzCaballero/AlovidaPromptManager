# Verificación contra el código — correcciones fullstack — 2026-10-23

> **Qué es:** dónde vive hoy, con archivo y línea, cada cosa que pide
> [`CORRECCIONES-FULLSTACK-2026-10-23.md`](../requisitos/CORRECCIONES-FULLSTACK-2026-10-23.md), y la
> brecha exacta entre lo pedido y lo que hay. Es la **fase 1 (descubrimiento factual)** del plan
> [`planes/06-correcciones-fullstack-2026-10-23/README.md`](../../planes/06-correcciones-fullstack-2026-10-23/README.md).
>
> **Método y límites.** Lectura de código de los siete repos en su corte del 2026-10-23 (§0), hecha por
> ocho agentes de solo lectura, uno por área, y consolidada acá. **Nada de esto se ejecutó contra la
> API viva en esta sesión**: cada «→ 400», «sólo simulador» o «no existe» sale de leer DTOs, `@Roles`,
> rutas y manejadores del simulador. Lo que se midió sobre datos (glosario) dice con qué comando.
> El primer hito de cada carril es **reproducir en runtime** lo que acá se afirma.
>
> **Peldaño de evidencia de este documento: `DISCOVERED`.**

## 0 · Corte leído

| Repo | Rama de trabajo | Base | Commit |
|---|---|---|---|
| `mantra-core-health` (front Angular 21) | `claude/intelligent-faraday-444u25` | `origin/dev` | `227eb255` |
| `mantra-core-health-api` (NestJS) | ídem | `origin/dev` | `6ea11561` |
| `mantra-core-health-model` (puml → SQL → seeds) | ídem | `origin/dev` | `eceb98f` |
| `mantra_core_health_mobile` (Flutter) | ídem | `origin/main` | `ec88e81` |
| `mantra_core_technologies_health_docs` (vault) | ídem | `origin/main` | `0b421692` |
| `AlovidaPromptManager` (estándar) | ídem | `origin/main` | `f48bec2` |
| `AlovidaAIService` (triage y conocimiento) | ídem | `origin/main` | `1163e62` |

Entorno de esta sesión: Node 22.22, Yarn 4 vía corepack (descargado desde el registro de npm porque
el proxy rechaza `repo.yarnpkg.com`), Chromium de Playwright preinstalado, Postgres 16 nativo
(`/usr/lib/postgresql/16/bin`), Redis nativo, **sin Docker**, **sin Flutter**. `cdn.sheetjs.com`
(de donde la API baja `xlsx@0.20.3`) está bloqueado: para instalar la API acá se sustituyó
localmente por `xlsx@0.18.5` de npm, **sin tocar `package.json` ni `yarn.lock` versionados**
(ver `REPORTE.md` del trabajo).

## 1 · Las ocho conclusiones que cambian el plan

1. **El flujo de pago del paciente no existe en ninguna capa.** El QR bancario por sede sí
   (`practice.practice_sites.bank_qr_file_id`, PR de septiembre), pero no hay pantalla donde el
   paciente lo vea, ni comprobante subido, ni «pagué en efectivo», ni aceptar/rechazar del médico, ni
   cierre de consulta condicionado al pago. Sólo la factura SIAT simulada exige pago previo. (§PA-04)
2. **La cobertura del seguro es decorativa en la consulta.** `coverage_percent`, `copay_amount` y
   `deductible_amount` se guardan y se muestran, pero **ningún** código los usa para calcular lo que
   paga el paciente; el cargo de la consulta es el precio de catálogo completo. La pre-autorización
   existe sólo en la API, el paciente no puede pedirla y ningún front la llama. (§PA-02)
3. **La receta no tiene cabecera.** Cada medicamento es una fila de `medication_requests`; el único QR
   es el que se dibuja dentro del PDF, con un UUID pelado sin firma ni vencimiento, y apunta a
   `/verify/rx/:id`, **una ruta que el front no tiene**. No hay escáner en web ni en móvil, no hay
   marcación «lo tengo / no lo tengo» por sucursal antes del pedido. (§PA-05)
4. **El portal de laboratorio del front es un decorado.** Todas las rutas `/diagnostics/lab/*`
   (servicios, importación, resultados, subida por partes, retiro) existen sólo en el simulador y
   devuelven 501 contra la API real. La API sí tiene recepción de muestras, accesiones, órdenes de
   trabajo, versiones de informe y liberación, pero repartidas en **seis máquinas de estado**
   distintas, sin los cinco estados que pide el cliente, y sin UI de resultados del lado del centro.
   Las órdenes no tienen QR y una orden es **un solo** estudio. (§PA-07, §LI)
5. **El mock-provider-server no sabe nada de farmacia ni del Colegio Médico como pieza aparte.**
   Emula cuatro proveedores (mensajería, borrados, embeddings, verificación de identidad con
   veredicto diferido). No está escrito en puertos y adaptadores. La API tiene las tablas de
   conexión y de mapeo de códigos de farmacia, pero nada las usa en ninguna dirección. (§PA-06, §MD-02)
6. **Encuestas y formularios: dos motores, sin modo marketing, sin Likert, sin envío automático.**
   `surveys` emite invitaciones sólo por comando manual; completar la cita no dispara nada y no
   manda ningún mensaje. No hay botón Guardar en el constructor (autoguardado por `debounce`). El
   buzón del paciente existe pero está **oculto del menú** desde el 25/09 por decisión pendiente. (§MD-05, §PA-12)
7. **Consentimiento: hay dos flujos paralelos y ninguno guarda motivo ni categoría.** El front usa
   `authz/care-relationships` (sin áreas, rechazar = revocar, sin motivo); `consent/practitioner-
   access-requests` guarda provisiones por especialidad pero **nadie lo llama** y la lectura clínica
   no las aplica. No hay taxonomía de «sistema del cuerpo» ni de «parte de la historia». (§PA-08, §MD-03)
8. **El glosario está a años luz del «atlas»: 19 313 términos, mediana de definición 0 palabras,
   70 % vacías, 1 sola ≥ 2 000 palabras, 29 % con imagen.** Las cuatro etapas de la enciclopedia
   (MedlinePlus, CIE-10/Orphanet, CIMA, Wikidata) están escritas en la API y **nunca se corrieron**.
   Pedir 2 000 palabras por término sin fuente es pedir texto inventado: prohibido. (§MD-07)

Y la que ordena el reparto: **gran parte de lo que «no funciona» funciona contra el simulador y no
contra la API real.** Portal de laboratorio, categorías e inventario de farmacia, precios de
farmacia (`unitPrice` que la API rechaza), opciones de los formularios, planes de pago por instancia,
mis gastos: todo eso tiene pantalla y tiene manejador del simulador, y **no** tiene endpoint, o tiene
uno con otra forma. Por eso cada carril arranca con la misma microtarea: **levantar el front con
`real-api` contra la API real y medir con Playwright qué pinta cada ruta del carril.**

---

## 2 · Carril 1 — Paciente (Leo y Richard)

### §PA-01 · Verificación de identidad (KYC) con el mock server y aprobación en el backoffice

**Lo que existe — API** (`mantra-core-health-api/src/modules/identity_assurance/`):

- 11 tablas del schema `identity_assurance` (casos, evidencias, checks, intentos, resultados, revisión
  manual, aserciones, señales de fraude, autoridades, endpoints, políticas).
- Estados del caso (`identity_assurance.concepts.ts:35-52`): OPEN, IN_VERIFICATION, AT_RISK,
  MANUAL_REVIEW, VERIFIED, REJECTED, ASSERTED, REVOKED, EXPIRED. Revisión: REVIEW_OPEN, REVIEW_DECIDED (`:111`).
- **Las cinco evidencias que pide el cliente ya están tipificadas** (`:172-201`):
  IDENTITY_DOCUMENT_FRONT, IDENTITY_DOCUMENT_BACK, LIVENESS_CENTER, LIVENESS_TURN_LEFT,
  LIVENESS_TURN_RIGHT (más SELFIE_WITH_ID heredada, LICENSE_DOCUMENT, INSTITUTION_DOCUMENT).
- Autoservicio (`controllers/identity-self-service.controller.ts`, `identity/me`): `POST identity-verification`
  (`:47`), `POST practitioner/identity-verification` (`:65`), `POST practitioner/license-verification` (`:83`),
  `POST tenants/:tenantId/verification` (`:99`), `GET verification-types` (`:116`), `GET verification-cases` (`:131`, `:139`).
- Administración (todo `SECURITY_ADMIN`): cola `GET identity/verification-cases` (`identity-cases.controller.ts:68`),
  detalle (`:95`), `POST :id/evidence` (`:145`), `:id/checks:plan` (`:163`), `:id/fraud-signals` (`:181`),
  `:id/manual-review` (`:199`), `:id/assertions` (`:217`); decisión `POST identity/manual-review/:id/decision`
  (`identity-manual-review.controller.ts:38`, APPROVED | REJECTED).
- Envío (`services/identity-self-service.service.ts:465-557`): exige las cinco evidencias o el
  `evidenceFileId` heredado (`:636-669`; texto del error en `:475`: «frente, reverso y las tres capturas de
  prueba de vida»); cada archivo debe ser del solicitante, PHI y no borrado (`:478-490`); un solo caso vivo
  por sujeto, el segundo da 409 (`:491-502`); TTL 72 h (`:67`); el caso pasa directo a IN_VERIFICATION con
  un check requerido (`:529-541`).
- Cierre (`services/identity-checks.service.ts`): `settleCase` `:351-401` (NO_MATCH → REJECTED; MATCH →
  `verifyCase` → VERIFIED → aserción → ASSERTED, `:470-534`); `settleManualApproval` `:422-459` es el mismo
  camino terminal disparado por la decisión del administrador. `openManualReview`
  (`identity-cases.service.ts:369-418`) sólo desde IN_VERIFICATION o AT_RISK y sólo por un administrador.
- Worker (`src/worker/jobs/identity_assurance/dispatch-identity-checks.job.ts`): puerto
  `IdentityVerificationProviderAdapter` (`:41`); adaptador por defecto falla con PROVIDER_NOT_CONFIGURED
  (`:46-56`); ACCEPTED → MATCH, el resto NO_MATCH (`:165`). El adaptador del mock
  (`mock-identity-verification-provider.adapter.ts:31-55`) **manda sólo `{subjectRef, checkType}`**: ni
  imágenes, ni CI, ni datos de la persona.
- Qué desbloquea «validado»: el único predicado es `findCurrentIdentityAssertionForPerson`
  (`repositories/identity-assertions.repository.ts:6-40`). El guard `VerifiedIdentityGuard`
  (`common/auth/verified-identity.guard.ts`) existe pero **ningún handler usa `@RequiresVerifiedIdentity()`**
  (se quitó en F-34, comentario en `jwt-payload.interface.ts:66-74`). El resumen del paciente devuelve
  `identityVerified` y expone `patientCode` sólo si es `true` (`profiles-patients.service.ts:451-463, 532-564`).

**Lo que existe — mock-provider-server** (`mantra-core-health-api/mock-provider-server/`): NestJS
standalone, puerto 4100, Swagger en `/docs`, `X-Api-Key`. Identidad (`src/identity-verification/
identity-verification.service.ts:34-115`): estado en un `Map` en memoria; veredicto PENDING hasta
`IDENTITY_VERIFICATION_DELAY_MS` (10 s) y después ACCEPTED o REJECTED según
`IDENTITY_VERIFICATION_REJECTION_RATE` (**0 por defecto: acepta todo**). DTO: `subjectRef`, `checkType`
∈ {IDENTITY_CARD, MEDICAL_LICENSE, INSTITUTION_DOCUMENT}. **Sin UI, sin persistencia, sin evidencias.**
Despliegue: en `docker-compose.yml` está (`:572-594`, `MOCK_PROVIDER_BASE_URL` `:246`,
`worker-identity_assurance` `:841-847`); en **`docker-compose.coolify.yml` no está ninguno de los dos**
(nota 6 en `:73-77`, `MOCK_PROVIDER_BASE_URL: ""` forzado en `:235`), y
`assertMockProviderNotInProduction` (`src/worker/worker.env.ts:201-215`) aborta cualquier worker con
`NODE_ENV=production` y URL de mock. `src/worker/bootstrap.ts:149-162` advierte que con el mock activo
toda verificación se auto-acepta.

**Lo que existe — front** (`mantra-core-health/src/app/`): rutas `my-account/identity` (IdentityHub,
`app.routes.ts:277`), `my-account/identity/cases` (`:323`), `.../cases/:caseId` (`:711`),
`administration/identity-assurance` (`:335`) con hijos cola, caso, evidencia, checks, revisión y
aserciones (`:1849-1930`). Captura (`features/identity-verification/identity-verification.ts`): frente y
dorso por `FileInput`; **liveness con `getUserMedia` y tres capturas** centro / giro-izquierda /
giro-derecha (`:450-506`, indicaciones en `:515`); `enviar` (`:330-358`) sube cinco archivos PHI y manda
los cinco ids. Sin detección automática de pose (comentario `:449`: lo evalúa la revisión humana).
Portal admin: `case-detail.ts:22` etiqueta las cinco evidencias y las muestra (`:61-76`), pero
`case-detail.html:46` **sólo enlaza a «review/escalate»: no hay botón Aceptar / Rechazar en el caso**, y
`ReviewDecisionForm` (`review-decision-form.ts:77-143`) exige **tipear el UUID de la revisión a mano**.

**Lo que existe — móvil**: `/patient/identity` (`route_paths.dart:78`) con asistente de cámara frente,
dorso y tres poses (`identity_verification_screen.dart:18-19, 77-95`) y cinco subidas a
`/identity/me/identity-verification` (`identity_repository.dart:179-198`). Sólo paciente.
`/administration/identity-assurance` lista la cola (`identity_admin_screen.dart:150-259`) sin mostrar
las imágenes.

**E2E**: `playwright/support/identidad.ts` — `abrirCaso` (`:96-125`) usa **el contrato heredado de un
solo archivo**; `escalarYDecidir` (`:139-165`). Ninguna prueba ejercita la cámara ni el envío de cinco
archivos por la UI.

**Brechas PA-01**

| # | El cliente pide | El código tiene |
|---|---|---|
| 1 | Un administrador acepta y recién ahí queda validado | Con el mock activo el worker auto-verifica a los ~10 s sin paso humano; la revisión manual sólo existe si un admin escala antes del veredicto |
| 2 | Mock «desplegado en el backoffice», standalone y compartido | Coolify no despliega ni el mock ni `worker-identity_assurance`; el guard de producción bloquea cualquier URL de mock; en Coolify los casos quedan IN_VERIFICATION hasta que alguien escala |
| 3 | Backoffice donde se acepta | El mock no tiene UI; la UI de revisión es el portal admin del front, y ahí no hay botón de decisión en el caso |
| 4 | Liveness tres poses | Capturadas y guardadas como evidencias tipadas en web y móvil; sin verificación biométrica (no hay proveedor) |
| 5 | Que «validado» sirva de algo | Ningún endpoint lo exige; sólo cambia `identityVerified` y muestra `patientCode` |
| 6 | Prueba de punta a punta | El helper E2E usa el contrato viejo de un archivo |

### §MD-01 · CI ocupado por el mismo tipo de usuario en el alta

- Paciente (`iam/application/services/iam-patient-self-registration.service.ts:187-206`): bloquea el
  sujeto y busca `findLivePasswordBySubject(nationalId)`; si existe, 409 «Ya existe una cuenta con ese
  documento de identidad». Funciona **porque el CI es el sujeto de login del paciente**
  (`externalSubject: dto.nationalId`, `:235`). No distingue tipo de usuario.
- Médico (`iam-practitioner-self-registration.service.ts`): chequea **sólo el correo** (`:462-475`) y el
  `practitioner_code` generado (`:477-486`); `nationalId` es obligatorio (DTO `:285-296`) y se valida
  formato y departamento emisor (`:491`); se inserta sin chequeo de duplicado
  (`identifiersRepo.create` `:804-814`) **con `ownerTypeConceptId: CONCEPTS.OWNER_PATIENT`: no existe
  OWNER_PRACTITIONER** (`common/constants/concepts.ts:399-405`). El login del médico es el correo.
- Organización: el `idNumber` del representante (`register-organization.dto.ts:292-303`) va a
  `createContactPerson` sin chequeo. Alta asistida: sólo correo (`iam-assisted-registration.service.ts:95-113`).
- `IdentifiersRepository.findActiveDuplicate` (`common/repositories/identifiers.repository.ts:65-86`)
  compara tipo + sistema + valor **global, sin owner type**, y ningún alta lo usa.
- Base: `common.identifiers` (`model/SQL/02_common/02_tables.sql:5-26`) sólo tiene la PK; el índice
  `ix_identifiers_type_concept_id_value` **no es único** (`04_indexes.sql:11`). El único índice único
  afín es `ux_authentication_credentials_live_password_subject` (`01_iam/04_indexes.sql:45`): CI del
  paciente como login, correo para los demás. Ni `persons` ni `health_practitioner_profiles` tienen CI único.
- Front: sin validador asíncrono de disponibilidad; el 409 se mapea por regex del mensaje al campo
  `nationalId` (`features/auth/shared-registration/registration-errors.ts:128, 305-340`). Móvil: el mapeador
  del médico (`registration_error_mapper.dart:400-420`) mapea «documento» → `nationalId`, pero el backend
  **nunca emite ese mensaje para médicos**.
- E2E `altas-api-real-tres-escenarios.spec.ts`: `:157` documento de paciente duplicado, `:175` mismo correo
  con otro documento, `:254` y `:400` correo duplicado de médico y organización. **Ninguna cubre el CI de
  médico duplicado.**

Consecuencias medibles: dos médicos pueden registrarse con el mismo CI y distinto correo; un paciente y
un médico comparten CI creando dos `persons`; el owner type del identificador no distingue médico de
paciente. Además la fuente del stakeholder exige **CI con departamento emisor** (vault, skill
`procesos-alovida` §4.4): la clave es (tipo documento, número, terminación, tipo de usuario).

### §PA-02 · Paciente ↔ aseguradora: cobrar sólo el % no cubierto, aprobadas por contrato, orden de aprobación

- **Nada calcula la parte del paciente en una consulta.** El cargo simulado es el precio de catálogo
  (`billing/services/billing-simulated.service.ts:502-521`). `insurance_plan_benefits.coverage_percent`,
  `copay_amount`, `deductible_amount`, `annual_limit_amount` (`insurance/entities/insurance_plan_benefits.entity.ts:37-67`)
  se guardan y se **muestran** (`insurance-read.service.ts:524`, `declared-coverages-reader.ts:170,233`,
  `read-patients.dto.ts:368,371`, `prescription-pdf.service.ts:324`) pero **ningún código los usa para un monto**.
- El monto del paciente en un reclamo es entrada manual (`claims.service.ts:456,471`) o `'0.00'` fijo en la
  decisión de la aseguradora (`insurer-received-claims.service.ts:493,510`).
- El checkout de farmacia del front usa **un coaseguro fijo del 20 %** de una fixture
  (`features/account/pharmacy-orders/checkout/checkout.fixtures.ts:35`, `checkout.summary.ts:7,96-116`).
- `PatientSettlementService` (`insurance/application/services/patient-settlement.service.ts`) sólo lee
  totales de adjudicaciones publicadas, y sólo para reservas de farmacia y órdenes diagnósticas; no consultas.
- **Aprobadas por defecto según contrato: no existe.** `requires_prior_authorization`
  (`insurance_plan_benefits.entity.ts:77-81`) y `eligibility_rule_json` se guardan y nunca se leen en una
  decisión. Todo es decisión manual de la aseguradora (el proceso 6.2 pide respuesta automática).
- **Pre-autorización: sólo backend.** `GET prior-authorization-requests/inbox` (`insurance/presentation/
  controllers/prior-auth.controller.ts:61`), `GET :id` (`:76`), `POST` (`:95`), `POST :id/determinations`
  (`:110`); estados PRIOR_AUTH_SUBMITTED / IN_REVIEW / DETERMINED (`insurance.concepts.ts:111-120`); la
  solicitud se ata a `service_request_id` / `medication_request_id` / `inventory_reservation_id`, **sin
  `encounter_id`**; `submitRequest` (`prior-auth.service.ts:90-98`) exige administrador del prestador o
  roles de facturación: **el paciente no puede pedirla**, y **ningún cliente web ni móvil la llama**.
- Lo que el paciente ve: `/my-account/requests` (`features/account/my-requests/my-requests.ts`, ruta
  `app.routes.ts:259`) lee `GET /insurance/my-claims` (`my-claims.controller.ts:30`): pestañas «Decisiones
  de la aseguradora» y «En espera de decisión», columnas Solicitud / contraparte / Aseguradora /
  Solicitado-aprobado / Estado / Acciones (`:285-296`). Son **reclamos que presenta el prestador**, no
  órdenes de aprobación del paciente. Móvil: `insurance_claims_screen.dart`, detalle con
  `CoverageBreakdownCard`; el botón «Pagar Copago» por QR **no está cableado**
  (`insurance_claim_detail_screen.dart:183-190`); el repositorio llama `GET /insurance/my-claims/:id` y
  `POST .../disputes`, **que la API no tiene** (sólo existe el listado).
- Matemática de liquidación ya escrita: `insurance/domain/settlement/claim-settlement-breakdown.ts`
  (facturado = aprobado + paciente + denegado). Configuración del %: `insurance-backbone.controller.ts:149-173`.
- E2E: `patient-coverage-copays.real.spec.ts` (póliza y beneficios, liquidaciones de pedidos, negativo
  entre pacientes `:255`); `carril-adjudicacion-clausulas.spec.ts` (cláusula obligatoria al denegar);
  `carril-insurance-exclusions-settlement.spec.ts` (300 = 150 + 30 + 120, mock). **Ninguna cubre la parte
  del paciente en una consulta ni la pre-autorización.**

**Brechas PA-02**: (1) 80 % sobre 100 → 20 Bs: no se calcula en ningún lado; (2) aprobación por
contrato: sin motor, todo manual; (3) orden de aprobación: existe en la API, sin paciente, sin consulta,
sin UI; (4) tabla: lista reclamos del prestador, no solicitudes; (5) copago por QR: sin emisión de QR;
(6) factura a la aseguradora programada: hay lotes de liquidación aseguradora → médico, nada los une a
los cargos de consulta.

### §PA-04 / §MD-06 · Sistema de pago por QR, comprobante, aceptar/rechazar, cierre

- **QR por sede: existe.** `practice.practice_sites.bank_qr_file_id` (uuid, FK `common.files`;
  `practice/entities/practice_sites.entity.ts:84-88`; `model/SQL/14_practice/02_tables.sql:68`; patch
  `SQL/patches/2026-09-15_v4215_practice_sites_bank_qr_file_id.sql`). Está **en la fila de la sede, no en
  la asignación médico↔sede**: cualquier profesional con asignación vigente pisa el valor único de esa
  sede (`practitioner-sites.service.ts:231-236, 270`). `PUT /practitioners/me/sites/:siteId/bank-qr`
  (`practitioner-sites.controller.ts:158`, PRACTITIONER/CLINICIAN, body `{fileId|null}`); el archivo sube
  por `POST /common/files/upload`. `GET /practitioners/:profileId/sites` (`:86`) admite PATIENT y devuelve
  `bankQrFileId` (`practitioner-sites.service.ts:573`) — no se verificó si el paciente puede descargar ese archivo.
- Front del médico: `/my-account/edit` → «Dónde atiendo», columna «QR bancario»
  (`features/account/my-profile/work-history/work-history.ts:546`, diálogo `site-bank-qr-dialog.ts`).
  **El QR nunca se muestra al paciente**: `bankQrFileId` sólo aparece en el perfil, el cliente y el mock
  (`core/mock/handlers/flows.handlers.ts:96` lo dice: ningún endpoint emite un QR por un monto).
- **Comprobante subido por el paciente: no existe** (ni entidad, ni columna, ni endpoint, ni pantalla, ni
  spec, en ningún repo). `payments.payment_receipts` es un recibo **emitido por el sistema** atado a una
  transacción; `billing.payments_received` no tiene archivo y sus estados son CLEARED / EXECUTED /
  RECONCILED (`billing.concepts.ts:46-48`).
- **«Pagué en efectivo»: no existe del lado del paciente.** Efectivo es el método 1 que elige el operador o
  el médico al registrar un pago, que se aplica de inmediato (`billing-simulated.service.ts:609-687`).
- **Aceptar / rechazar comprobante: no existe.** No hay estado «pendiente de verificación» ni «rechazado».
  `PUT /scheduling/bookings/:id/payment-state` (`scheduling-bookings.controller.ts:260`) sólo tiene
  PENDING | PARTIALLY_PAID | PAID + `insuranceUsed` (`scheduling/domain/booking/payment-state.ts:1-31`), es
  una **bandera manual del personal** (el paciente está excluido, comentario `:250-253`).
- **Factura sólo tras pago: sí, pero sólo en SIAT simulado** (`billing-simulated.service.ts:715-719`,
  `PreconditionFailedException` `PAYMENT_REQUIRED`). `POST /billing/invoices:issue-from-encounter`
  (`billing-receivables.controller.ts:159`) **no** lo verifica.
- **Cierre del servicio condicionado al pago: no.** `encounters.service.ts:324-405` (`close`) y
  `POST scheduling/bookings/:id/complete` no miran el pago.
- Tabla de pago al proveedor: nada la deriva de las sesiones. Lo más cercano:
  `GET /accounting/practitioner/paid-consultations` (`accounting-practitioner.controller.ts:57`),
  `POST /accounting/practitioner/consultation-income` (`:77`), `POST /payments/payouts`, y los lotes
  aseguradora → médico (`practitioner-settlement-batches.controller.ts:44-69`).
- El cargo simulado no sabe de qué sede es: toma el precio del catálogo de **la primera práctica del
  tenant** (`billing-simulated.service.ts:342-355`, `LATERAL … LIMIT 1`), así que no puede resolver el QR de la sede.
- Flujo de atención del front (`/medical-records/:profileId/consultation`): caja «Pagos»
  (`features/clinical-record/consultation/consultation.ts:202-212, 546-548`), `payment-plan-panel`,
  `patient-chart/payments-block`, `patient-charges.ts:60-83,214`; «comprobante» acá es la **nota de venta
  emitida**, no un archivo subido (`features/billing/payment-plan/payment-plan.ts:48-63,137`). Los planes
  por instancia dan 409 `NOT_A_PLAN` contra la API real (`billing-simulated.service.ts:690-703`).
- Móvil: `practice_site_repository.dart:27,71` tiene `setSiteBankQr`, **ninguna pantalla lo llama**;
  `consultation_billing_sheet.dart` registra pago y emite factura por `/billing/simulated/*`.
- E2E: `qr-bancario-por-sede-2026-09-13.mjs`, `qr-bancario-cambiar-2026-10-02.mjs` (sólo el médico);
  `pagos-plan-nota-venta-factura.spec.ts` y `planes-de-pago-flexibles.spec.ts` (**simulador**).
- Vault desactualizado: `alovida-brechas-procesos.md:791-807` y T-29 dicen «QR: no existe», anterior a
  `bank_qr_file_id`. Lo que sigue sin existir es el **QR emitido con monto**. Fuente: proceso 2.7
  (`📋 Registro de procesos por módulo.md:332-352`).

### §PA-03 · Barra superior «de la app»

**Web** (`features/shell-layout/shell-layout.html`), en orden: `<app-panic-button />` Emergencia
(`:274`, todos los roles, fechado 2026-10-08 en `:271-273`), campana (`:275`), Red social (`:413-426`),
**Tutoriales** (`:440-450`, `/tutorials`, testid `header-tutoriales`), Chats (`:452-474`), **Mis facturas**
(`:482-492`, todos los roles, `/my-account/invoices`, `header-facturas`), Mis solicitudes (`:499-509`),
**Mis gastos** (`:519-529`, sólo paciente, `/my-account/spending`, `header-gastos`), **Promociones**
(`:532-542`, sólo paciente, `/my-account/promotions`), **Carrito** (`:544-566`, `/my-account/pharmacy/cart`,
badge de `CartStore`), Ajustes (`:576-586`, `/settings`). En `navigation.map.ts` todas tienen
`fueraDelMenuPara: [ANY_ROLE]`: tutorials `~113`, loyalty `1524`, promotions `1548`, spending `1566`
(comentario: `GET /patient-spending/me` no existe, P43/P44), invoices `1585` (SIAT simulado, P53).
Ajustes (`features/settings/settings.html:8-123`) tiene pestañas Avisos, Chats, Apariencia, Permisos,
Identidad; **no hay Tutoriales**. Mis gastos (`spending.html`) no tiene pestañas (gráfico 12 meses + KPIs,
`aria-label="Resumen"` en `:51`); `my-invoices.ts:140` ya enlaza a `/my-account/spending`.
**«Mapa chat» no existe con ese nombre en ningún repo**; lo más cercano es el mapa de departamentos
dentro de Promociones (`promotions.html:24-38`, `<app-department-map testId="promociones-mapa">`).
El panel de emergencia también vive dentro de `symptom-check.html:497,519`.
Tests que fijan la barra actual: `shell-layout.spec.ts` (Promociones `:521-524`, Tutoriales `:1073-1155`,
Carrito `:1220-1279`, Mis gastos `:1285-1306`, Mis facturas todos los roles `:1323-1339`);
`playwright/promociones-arriba.mjs:42-59`; `justin-cierre-tanda.spec.ts:294,301,616`.

**Flutter** (`features/patient_shell/presentation/`): barra inferior Mis Citas / Mis Órdenes / Mis
Resultados / Mi Perfil (`patient_shell_screen.dart:79-101`); cajón (`widgets/patient_drawer.dart`):
**Emergencia** (`:90-92`, `/patient/emergency`), Directorios (`:115-118`), Farmacia y Pedidos (`:126-133`),
**Mis Facturas** (`:136-138`), Club ALOVIDA (`:151-153`), **Ayuda** = tutoriales (`:177-179`, `/help`).
Acceso rápido Emergencia también en `patient_home_screen.dart:401-404`. **Flutter no tiene Mis gastos,
ni pantalla de promociones, ni Ajustes**: promociones sólo como «Beneficios vigentes» en
`loyalty_wallet_screen.dart:183`; el carrito es una hoja (`pharmacy_cart_sheet.dart`).

**Brechas PA-03**: Emergencia está en web (todos los roles) y en móvil (cajón + inicio); Tutoriales es
enlace propio en web y «Ayuda» en móvil, y no hay pestaña ni pantalla de Ajustes que lo reciba en móvil;
Mis facturas es de **todos los roles** y Mis gastos **sólo paciente** (chocan de alcance), Mis gastos no
tiene pestañas y las dos dependen de backends que faltan (P44, P53); Promociones y Carrito son enlaces
separados; el mapa es el de departamentos de Promociones.

### §PA-09 · Inicio del paciente, recomendaciones, mapa de Bolivia, geolocalización

- Inicio: `features/dashboard/patient-home/patient-home.html` → encabezado (`:4-8`), triage de síntomas
  (`:22-39`), `app-patient-campaigns-widget` (`:45-51`), próxima cita (`:111-225`), última receta y última
  visita (`:232-280`).
- **Las «recomendaciones» viven dentro del triage**: `features/symptom-check/symptom-check.html:525-700`,
  tablist con **«Especialistas médicos»** (`:548-566`, `verProfesionales()`) y **«Recomendar
  medicamentos»** (`:573-591`, tarjetas de venta libre + aviso `:622-651`). Los datos de medicamentos
  vienen de `medications-guide.data.ts`, con **9 entradas sin fuente citada**.
- Mapa de Bolivia: `shared/components/organisms/department-map/department-map.ts` (selector `:115`,
  inputs `municipio` `:144`, `etiqueta` `:128`), usado por `laboratory-directory.html:79`,
  `clinics-directory.html:36`, `pharmacies-directory.html:36`, `insurers-directory.html:36`,
  `promotions.html:25` y el selector de ubicación del registro. La guía de médicos
  (`features/directory/practitioners-directory/`) **no tiene mapa** y su único filtro es especialidad (`:232`).
  Filtro territorial compartido: `shared/geo/territorial-filter.ts`, `public-directory-listing.ts`
  (`departamento`, `ciudad`, `verificado`, `categoria`), catálogo `BoMunicipalitiesCatalog`.
- **No hay servicio de geolocalización compartido**: ocho pantallas llaman
  `navigator.geolocation.getCurrentPosition` por su cuenta (`search-origin-picker.ts:143`,
  `where-to-buy.ts:781`, `pharmacy-detail.ts:473`, `cercania-detalle.ts:152`, `medicamentos-listado.ts:275`,
  `facility-directions-dialog.ts:224`, `register-patient.ts:2144`, `map-location-picker.ts:393`);
  `browser-permissions.service.ts:217-229` pide la posición y la descarta. El perfil del paciente trae
  `residenceMunicipalityConceptId` (`profiles.types.ts:396,921,993`): fuente posible del municipio sin GPS.
- **No hay geocodificación inversa en ninguna capa.** La API `geo` es rastreo administrativo (geocercas,
  trips, sesiones). Lo más cercano es `GET public/nearby?lat&lng&radiusKm&kind&limit`
  (`community/controllers/community-public.controller.ts:382`): distancia en línea recta, **no** resuelve
  municipio ni departamento. «Zona» no existe como nivel (sólo departamento, municipio, ciudad).
- E2E: `patient-gps-nearby-places.mjs` abre `/nearby-places`, **que hoy redirige** a `/my-account/pharmacy`
  (`app.routes.ts:1342`): está obsoleto. `datos-bolivia-en-pantalla.spec.ts`, `nova-patient-experience.spec.ts`,
  `categorias-en-directorios.spec.ts`, `carril-06-directorios-salud.spec.ts`.

### §PA-10 · Promociones como marketplace por tipo de partner

- API `promotions/`: 11 entidades; `promotions.entity.ts` tiene `tenantId` (`:18`), código, nombre, tipo
  (`:36`), prioridad, apilable, presupuesto, límites, vigencia, estado. **Sin tipo de partner, sin imagen,
  sin ubicación, sin producto/precio.** `GET promotions/me` (PATIENT, `promotions.controller.ts:57`);
  `listMine` (`services/promotions-read.service.ts:56-90`) usa `requireTenantId()`: **sólo promociones del
  tenant de la sesión**; no hay listado público ni cross-tenant ni filtro por tipo. `marketing/` y `ads/`
  sólo POST, nada de cara al paciente. Campañas de aseguradora: `insurance-campaigns.controller.ts:56`.
- Web: `features/account/promotions/promotions.ts` (DirectoryPage + DepartmentMap `:121`); en maqueta usa
  `promotions.fixtures.ts`; contra la API real mapea `GET /promotions/me` sin farmacia ni ciudad
  (`:72-104`). Autoría de farmacia: `features/organization/pharmacy-campaigns/` con
  `pharmacy-campaigns.client.ts` **demo en memoria detrás de `environment.campaignsDemo`** (`:60-82`,
  «TODO(FAR-E?)»). Motor: `core/promotions-engine/`. Detalle público `/promotions/:campaignId`
  (`app.routes.ts:1608`). E2E `promociones-mecanicas.spec.ts` (cinco familias, catorce mecánicas,
  `:106-280`).
- Móvil: `loyalty_repository.dart:75-110` (`promotionsMe`), `loyalty_wallet_screen.dart:183`;
  autoría `pharmacy_admin/presentation/campaign_screen.dart` (`POST /promotions`).
- Vault `V51 promotions — Vistas.md:209-236`: 12 vistas admin/cajero, ninguna es marketplace del paciente.

### §PA-11 · Directorios

- Portada `features/directories-overview/` (registro `navigation.map.ts ~155-226`). Cinco directorios:
  médicos `features/directory/practitioners-directory/` (`/directory`), laboratorios
  `features/laboratory-directory/`, clínicas / farmacias / aseguradoras en `features/public-directories/`
  vía `public-directory-listing.ts`. Detalles: `/directory/:profileId` (`app.routes.ts:721`),
  `/laboratory-directory/:unitId` (`:735`), `/clinics-directory/:slug` (`:760`), `/insurers-directory/:slug`
  (`:770`), `/pharmacies-directory/:slug` (`:778`). Piezas compartidas:
  `shared/components/organisms/directory-page/directory-page.ts` (título, chips, contador, rejilla
  agrupada, alternar rejilla/lista, lotes de 24), `filter-bar`, `department-map`, `result-card`,
  `alovida/buscar/centro-card`.
- Filtros hoy: médicos **sólo especialidad** (`practitioners-directory.ts:232`,
  `GET /profiles/practitioners?specialtyConceptId`, `profiles.client.ts:505`); laboratorios tipo, toma a
  domicilio, sin turno, calificación mínima (`laboratory-directory.ts:78-113`) + departamento; clínicas /
  farmacias / aseguradoras departamento, ciudad, verificado, categoría.
- API pública (`community/controllers/community-public.controller.ts`): `public/search/practitioners`
  (`:217`), `/organizations` (`:268`), `/diagnostic-units` (`:306`), `/insurers` (`:323`), `/pharmacies`
  (`:340`), `/medications` (`:357`), `public/nearby` (`:382`), perfiles y reseñas (`:427-463`). Parámetros:
  `q`, `verified`, `specialty`, `department`, `municipality`, `city`, `cursor`, `limit`, `lat`, `lng`,
  `radiusKm`, `kind`. **Sin filtro de precio ni calificación, sin ordenamiento.** `GET diagnostic-units/
  search` (`catalog.dto.ts`) sí tiene `maxAmount`, `minRating`, `homeCollection`, `walkIn`. El DTO de
  resultado (`public-search.dto.ts`) ya trae `ratingAverage`, `ratingCount`, `priceFrom`, `location`,
  `specialties`, `openNow`, `nextAvailableDate`.
- Móvil: `directories_screen.dart` (una fila por tipo), `nearby_screen.dart` (GPS + `/public/nearby`);
  sin mapa ni filtro territorial.
- Vault `V65 buscador — Vistas.md` (V65-01..14; «Cerca mío» V65-12 `:932`).

### §PA-12 · Buzón de encuestas de satisfacción del paciente

- API `surveys/controllers/surveys-patient.controller.ts:32-61`: `GET /surveys/me/invitations`, `GET :id`,
  `POST :id/responses`. `PatientInvitationDto` (`dto/responses.dto.ts:194-248`): id, título, descripción,
  estado PENDING / ANSWERED / EXPIRED, fechas, `appointmentBookingId`. **Sin tipo de partner, sin
  prestador, sin tipo de servicio.** Sólo PRACTITIONER / CLINICIAN pueden emitir
  (`surveys-assignments.controller.ts:45`): laboratorios, farmacias, centros y aseguradoras **no pueden
  mandar encuestas**.
- Web: `features/account/questionnaires/` con pestañas «Aspectos médicos» y «Encuestas (N pendientes)»
  (`questionnaires.html:7-88`); respuesta en `my-account/questionnaires/:invitationId` (`app.routes.ts:485`).
  **Oculta del menú para todos** (`navigation.map.ts:1357-1377`, `fueraDelMenuPara: [ANY_ROLE]`) por
  `docs/pendiente-decision-cuestionarios.md`. El formulario de calificación existe sólo como maqueta de
  diseño (`alovida/buscar/calificar-la-atencion-formulario`, vault V65-14).
- Móvil: `questionnaires_screen.dart` (Por responder / Anteriores), `questionnaire_repository.dart:158-194`.

## 3 · Carril 2 — Doctor (Pablo y Justin)

### §MD-02 · Identidad y credenciales del médico vía mock «Colegio Médico» hexagonal

- Matrícula: `POST /identity/me/practitioner/license-verification`
  (`identity-self-service.service.ts:167-205`, verifica que el `jurisdictionAuthorizationId` sea del
  solicitante); vertical MEDICAL_LICENSE_BASIC (`identity_assurance.seed.ts:83-88`), check
  CHECK_TYPE_MEDICAL_LICENSE; al verificar, `applyVerified` pone la autorización AUTH_ACTIVE, el perfil
  PRACT_VERIF_VERIFIED / PRACTICE_ACTIVE y una insignia en comunidad
  (`identity-verification-effects.service.ts:~150-200`).
- Identidad del médico: `POST /identity/me/practitioner/identity-verification` (`:144-159`), **misma
  política IDENTITY_CARD que el paciente**.
- Autoridad sembrada: **una sola, genérica**, «Default identity registry»
  (`common/seed/identity-verification-seed.service.ts:143-190`). **No hay Colegio Médico ni Colegio de
  Odontólogos** como autoridad, ni value set de colegios bolivianos (lo anota el vault,
  `📋 AloVida — Procesos del stakeholder.md:182-188`; la fuente lo pide en el proceso 2.1,
  `📋 Registro de procesos por módulo.md:252,274`: el colegio cambia según la profesión).
- Verificación manual de credenciales en `profiles`: `GET /profiles/credentials` (`profiles-practitioners.
  controller.ts:745`, SECURITY_ADMIN), `POST /profiles/credentials/:credentialId/verify` (`:781`; VERIFIED
  exige `verificationSourceUri`, descrito como «registro del colegio médico…» en
  `verify-credential.dto.ts:24`). Estados AUTH_PENDING/ACTIVE/EXPIRED y CRED_PENDING/VERIFIED/REJECTED
  (`profiles.concepts.ts:100-138`). **Los dos caminos (check automático de matrícula y verificación manual
  de credencial) no están unidos.**
- Registro (`iam/presentation/dto/register-practitioner.dto.ts`): `licenseNumber` (`:181`, Ministerio),
  `credentialNumber` (`:202`), `sedesLicenseNumber` (`:223`), `regulatoryAuthority` texto libre (`:235`),
  `licenseIssueDate` (`:248`). **No hay campo de matrícula de Colegio.** El alta crea matrícula y título
  PENDING (`iam-practitioner-self-registration.service.ts:633-660`).
- Hexagonal: `profiles` sí (ports/adapters/domain); `identity_assurance` es en capas
  (controllers/services/repositories); el único puerto de proveedor es el del worker
  (`IdentityVerificationProviderAdapter`). El mock trata MEDICAL_LICENSE como un `checkType` más: **nunca
  recibe número de matrícula, profesión ni colegio** y auto-acepta.
- Front: el trámite de matrícula vive en el mismo componente de identidad (`identity-verification.ts:71-77`)
  y **omite `jurisdictionAuthorizationId`** (`:396-399`). Onboarding: `features/onboarding-practitioner/`.
  Registro: `features/auth/register-practitioner/`. E2E `registro-doctor-universidad-y-profesiones.spec.ts`,
  `registro-documento-ayuda.spec.ts:75`, `altas-api-real-tres-escenarios.spec.ts:233-254`: **ninguno cubre
  matrícula ni Colegio**. Móvil: sin flujo de matrícula.
- Modelo: `diagram_27_identity_assurance.puml` existe; «Colegio» sólo en un comentario de
  `diagram_05_profiles.puml:251`.

### §MD-03 / §PA-08 · Consentimiento, permisos por categoría, bandeja del médico

**Dos flujos paralelos en la API:**

- **Flujo A — `consent/practitioner-access-requests`** (nadie lo llama desde web ni móvil):
  `POST` (`consent/controllers/practitioner-access-requests.controller.ts:41`, PRACTITIONER/CLINICIAN),
  `GET mine` (`:56`, PATIENT), `POST :id/decision` (`:73`, PATIENT). DTO de pedido:
  `patientProfileId`, `specialtyConceptIds[]` (1–50, «árbol de especialidades»), `reasonText` opcional
  (`request-practitioner-access.dto.ts`). Decisión: `ACCEPTED|DECLINED`, `authorizedSpecialtyConceptIds[]`
  (subconjunto), `validityMonths` 1–60. Servicio (`practitioner-access-requests.service.ts`): guarda un
  `consent.consents` (categoría PRACTITIONER_ACCESS) y una `consent_provisions` por especialidad en
  `data_class_concept_id` con acción REQUESTED → PERMIT / DENY (`:113-122, 325-332`); al aceptar crea un
  `authz.clinical_access_grants` READ / TREATMENT (`:355-368`). **El `reasonText` sólo va al aviso, no se
  persiste** (`:154`, `toResponse` devuelve `null` `:416`). DECLINED **no lleva motivo**.
- **Flujo B — `authz/care-relationships`** (el que usa el front): `POST request`
  (`authz-care-relationships.controller.ts:151`; body `tenantId`, `patientProfileId`,
  `relationshipType` TREATING|CONSULTING|EMERGENCY, `reasonText`; **sin especialidades ni áreas**),
  `GET requests/mine` (`:127`, PATIENT), `POST :id/respond` (`:180`, PATIENT; `decision` ACCEPT|REJECT +
  `authorizedSpecialtyConceptIds`, **sin motivo**), `GET ?tenantId&patientProfileId` (`:106`),
  `POST :id/revoke` (`:88`). Servicio (`authz-care-relationships.service.ts:228-271`): **REJECT pone
  STATE_REVOKED, así que rechazado y revocado son el mismo estado**; las especialidades autorizadas
  **no se persisten** (sólo van al evento de outbox, «`care_relationships` no modela ese campo»).
- Revocación del paciente: `GET /authz/me/access` (`authz-me.controller.ts:37`),
  `POST /authz/me/care-relationships/:id/revoke` (`:51`), `POST /authz/me/clinical-access-grants/:grantId/
  revoke` (`:67`). **Ninguno acepta body ni motivo.** Retiro de consentimiento: `withdraw-consent.dto.ts`
  sólo `withdrawalReasonConceptId` opcional.
- Aplicación: `clinical/services/clinical-read.service.ts` `assertCanReadHistory` (`:215`) pasa con
  reserva de hoy o encuentro en curso, relación activa, PERMIT del PDP sobre `clinical.patient_record`
  (`:365-385`) o emergencia. **El PDP se consulta por la historia completa**: ninguna especialidad, clase
  de dato, sistema corporal ni sección entra en la pregunta. `grep dataClassConceptId` sólo da en
  `consent/`: **las provisiones se registran y nunca se aplican**.
- `delegated_access` es delegación del médico a secretaria/asistente/enfermería/facturación
  (`delegated_access.concepts.ts:32-125`), no consentimiento del paciente. `health_context` es contexto
  sanitario agregado por país («No tiene endpoints de paciente», su README).
- **Taxonomías**: el único concepto de sistema corporal es `bodySystemConceptId` del examen físico
  (`chart/chart.concepts.ts:94`, `notes.dto.ts:370`). «Enfermedades activas» existe sólo como sección de
  pantalla (`patient-chart.html:35`, `medical-record.ts:404`, `history-with-encounters.ts:133`), **no como
  categoría de permiso**. Modelo: `consents` (`07_consent/02_tables.sql:42`) tiene
  `withdrawal_reason_concept_id` y **no** motivo de rechazo; `consent_provisions` (`:66`) tiene
  `data_class_concept_id`, `purpose_of_use_concept_id`, `security_label_concept_id`;
  `clinical_access_grants` (`06_authz/02_tables.sql:171`) sin clase de dato ni sección;
  `care_relationships` (`:242`) sin especialidad ni motivo; `resource_scope_grants` (`:134`) sí tiene `reason_text`.
- Front: el médico pide desde `medical-records/:profileId/request-access` (`app.routes.ts:632`,
  `features/clinical-record/request-access/`): **sólo un textarea «Motivo» y «Pedir vinculación»**, llama
  `POST /authz/care-relationships/request` (`request-access.ts:83-88`) sin áreas. Bandeja del paciente
  `my-account/access-requests` (`:644`, `features/account/access-requests/access-requests.ts`): **sin
  entrada de menú** (se llega por el aviso); la lista de especialidades sale del catálogo entero, no de lo
  pedido; «Aceptar» (`:135-158`) y «Rechazar» (`:160-171`) sin motivo. «Quién ve mi historia»
  `my-account/clinical-access` (`:221`): pestañas «Profesionales vinculados» y «Accesos concedidos»,
  filas con nombre, fechas, estado y «Revocar» sin motivo, sin área ni categoría. **Bandeja del médico de
  sus pedidos enviados: no existe** ni en API (los dos `mine` son PATIENT) ni en front.
- Móvil: sin pantalla de permisos del paciente ni de pedido del médico; `delegated_access` y
  `health_context` son admin.
- E2E: ninguna cubre `request-access`, `access-requests` ni `clinical-access` (`alv-054-panel-accesses`,
  `carril-02-accesos-rbac` y `mi-perfil-sin-tu-acceso.mjs` son otra cosa). Unitarios: `access-requests.spec.ts`,
  `clinical-access.spec.ts`.

### §MD-04 / §MD-09 · Horarios multi-consultorio y multi-servicio; bloqueos

- Modelo (`41_scheduling/02_tables.sql`): `schedulable_resources` (`l.42`; un recurso = un consultorio;
  la sede se deriva de la asignación, no se guarda en el recurso, `practitioner-sites.service.ts:30-80`),
  `schedule_templates` (`l.61`, **un** `service_concept_id` opcional, `slot_minutes`), `schedule_rules`
  (`l.80`), `practitioner_service_offerings` (`l.201`; `min/max_duration_minutes`, `prep`, `cleanup`,
  `requires_approval`; **sin columna de práctica, sede ni recurso**: el servicio es del médico, no del
  consultorio), `bookable_slots` (`l.116`; estados SLOT_OPEN / HELD / BOOKED / BLOCKED / RETRACTED),
  `practitioner_schedules` (`l.5`, con `practice_id` + `care_space_id`, **sin uso en la aplicación**),
  `availability_exceptions` (`l.100`; tipos ABSENCE, HOLIDAY, EXTRA, VACATION, CONFERENCE, ERRAND, OTHER,
  `catalog-types.ts:8`), `calendar_absences` (`l.309`, con `blocks_scheduling`; repositorio registrado en
  `scheduling.module.ts:171`, **sin caso de uso ni endpoint**).
- Endpoints: catálogo en `scheduling.controller.ts` (slots `:117`, recursos `:167`, plantillas `:211-344`,
  excepciones `GET :373` [ADMIN, PRACTITIONER, PATIENT — el paciente sólo de un médico con el que ya tiene
  reserva, `:365-368`] / `POST :521` / `PATCH :553` / `DELETE :581`, `close-slots :423`, `exception-types
  :504`); agenda `scheduling-agenda.controller.ts:33,46`; servicios
  `scheduling-service-offerings.controller.ts:53-134`; sedes `practitioner-sites.controller.ts:86-198`.
  `create-exception.use-case.ts:134-135` pasa los SLOT_OPEN a SLOT_BLOCKED; **`GET /scheduling/slots` no
  devuelve excepciones**, sólo omite bloqueados con `onlyAvailable=true`.
- Front `/schedule` → `Agenda` (`app.routes.ts:117`), pestañas por `?vista=` (`agenda.ts:451-461,
  885-918`): «Consultas» (`MyAgenda` calendario día / semana / mes, `my-agenda.ts:468`), «Mis horarios»
  (`ScheduleGrid`), «Horarios de otros servicios» (`ServicesSchedule`); `/schedule/new|edit` → `AgendaCreate`
  (`:1694/:1702`, selector de sede `eligeSede` `:310-351`, modo por día CONSULTATIONS|SERVICES|MIXED
  `:259-266`); `/schedule/blocks` → `Blocks` (`:1709`).
- **Qué pinta cada vista**: semana (`week-view.ts`) = siete celdas sin eje horario (punto de estado,
  conteos, barra de ocupación, N citas, «+N más»); mes (`month-view.ts:43`) = celdas con
  `sin-agenda|bloqueado|libre|con-reservas|lleno` y globo con horario y rangos bloqueados (`:638-660`);
  «Mis horarios» (`schedule-grid.ts`) = rejilla semanal 24 h con bloques rojos (`:276,:469`), **sólo la
  primera plantilla no retirada** (`my-agenda.ts:854-880`; `services-schedule.ts:72-80` lo admite).
- **Multi-sede: todo mira el primer recurso.** `agendaResourcesMy` devuelve todos (`my-resource.ts:56`) pero
  `MyAgenda` toma `pagina.items.find(r => r.resourceRefId === perfil)` (`my-agenda.ts:842`) y `Blocks`
  `recursos[0]` (`blocks.ts:255`). **Un bloqueo en el segundo consultorio es invisible.**
- **Dónde se dibujan los bloqueos (médico)**: día como bandas «ocupado» (`day-view.ts:929-957`); semana:
  **cualquier bloqueo que toque el día pinta la celda entera «bloqueado»** sin horas (`week-view.ts:397,
  427-438`); mes: estado + línea «Bloqueado HH–HH (motivo)» (`month-view.ts:505, 659-720`); rejilla roja
  (`schedule-grid.ts:469`, `leerBloqueosDeLaSemana` `my-agenda.ts:896`); carga en `cargarMes`
  (`my-agenda.ts:1226-1290`), que **descarta `id` y tipo de catálogo** (un bloqueo sin texto libre sale sin
  motivo). **Paciente: ningún selector de cupos llama `listExceptions`**
  (`practitioner-availability.ts:332`, `appointments.ts:1416` con `onlyAvailable: true`; `booking-new.ts:555`
  por `service-availability`): el tiempo bloqueado simplemente desaparece. Móvil igual
  (`appointments_repository.dart:258-276`).
- Ni «gantt» ni «ms project» aparecen en ningún repo. Móvil (`my_agenda_screen.dart`): lista de bloqueos
  90 días y horario semanal, sin calendario.
- E2E: `carril-10-11-horario-y-bloqueos.spec.ts` (layout, sin datos), `horarios-otros-servicios.spec.ts`
  (maqueta), `bloqueos-tarjetas-e-iconos.mjs` (capturas); integración API
  `fx2-medico-multisede-publica-agenda.int-spec.ts`, `fx5-motivos-de-bloqueo.int-spec.ts`.

### §MD-10 · Reservar cita: mensajes internos; «no funciona absolutamente nada»

- Endpoints (`scheduling-bookings.controller.ts`): `GET` `:86,:129`; `accept :150`, `request-info :178`,
  `propose-schedule :206`, `reject :227`, `payment-state :260/:282`, `start :307`, `complete :331`,
  `reschedule :352`, `cancel :373`, `check-in :395` (**sólo ADMIN y AGENT**), `delay :418`, `reminders :440`.
  En `scheduling.controller.ts`: `appointments/direct :611`, `appointments/walk-in :645`,
  `slots/:id/holds :666`, `holds/:token/confirm :688`, `holds/:token/request :718` — roles
  `SCHEDULING_ADMIN, SCHEDULING_AGENT, PATIENT`: **sin PRACTITIONER**.
- Avisos: `application/bookings/support/booking-change-notifier.ts` (`notifyRequest`, `notifyChange`,
  `notifyAcceptedInChat`) → puerto `agenda-notice.port.ts` → adaptador
  `messaging-agenda-notice.adapter.ts`: campana in-app (`messaging.in_app_notifications`), correo por el
  worker (`notification-delivery.job.ts`, Gmail) y, para `BOOKING_STATE_CHANGED`, **un mensaje de chat
  interno desde la cuenta «SupportAdmin»** (`support-admin-notice.adapter.ts`; seed
  `terminology-seed.service.ts:299`). Corre después de la transacción, nunca lanza, **sin outbox**.
- **Eventos que hoy mandan mensaje**: pedido del paciente (`request-booking.use-case.ts:70`, ambos lados),
  aceptar (`accept-booking.use-case.ts:152-164`, + hilo médico↔paciente por
  `community-booking-chat.adapter.ts`), rechazar y cancelar (`cancel-booking.use-case.ts:262`),
  reprogramar (`reschedule-booking.use-case.ts:222`), cita directa (`create-direct-appointment.use-case.ts:132`),
  mover cupos (`shift-slots.use-case.ts:97`), demora (`scheduling-delay.service.ts:98,163,219`), lista de
  espera y recordatorios (`scheduling-waitlist.service.ts:329,463`).
- **Eventos que no mandan nada**: `confirm-booking.use-case.ts` (confirmación de mostrador), walk-in,
  `request-info`, `propose-schedule`, estado de pago. Pacientes sin cuenta de portal se saltean.
- Front: `BookingNew` (`booking-new.ts:516,539,645-647`; PORTAL → `requestHold`, DESK → `confirmHold`);
  cancelar del paciente `appointments.ts:1678`; **el paciente no puede reprogramar en web** (móvil sí,
  `reschedule_appointment_sheet.dart`); campana `notifications.store.ts:23` (sondeo 45 s); rutas de aviso
  de agenda ya mapeadas (`notification-routes.ts:61-62`, AG-06 cerrado).
- **Causas plausibles del «no funciona nada», todas abiertas en el código**: reserva de mostrador del
  médico `/schedule/book/:slotId` → **403** (AG-03: holds/confirm/request sin PRACTITIONER); check-in del
  médico → **403** (AG-02); la reserva del paciente es sólo un **pedido** hasta que el médico acepta; sin
  reprogramación del paciente en web (AG-10); cotizaciones → 400 (AG-35); `flexibleHours` → 400 (AG-01/P36);
  y **casi todos los E2E de reserva corren contra el simulador**, que inventa reglas y oculta estos fallos
  (`docs/brechas-front-back-2026-09-24/README.md §4.2`: «todo recorrido en mockup sale verde aunque la API
  lo rechace»). `ROUTE_HEALTH_MATRIX.md`: `/my-account/appointments` «no navega» para el médico (`:67,:378`).
- E2E: `carril-14-crear-cita.spec.ts` (API real, cita directa, choque → 422); `baseline-comparable-reserva`,
  `reserva-cotizaciones-recorrido`, `cierre-local-reserva-cotizaciones` (mock, navegación y capturas, **sin
  reserva completada**); `carril-p8-avisos-agenda.spec.ts` (se saltea sin credenciales; su encabezado dice
  que la campana «todavía no existe», obsoleto). **Ninguna prueba afirma que llega un mensaje al reservar,
  cancelar o mover.** Integración API: `agenda-mensajeria-*.int-spec.ts`, `fx8`, `fx9`, `fx10`, `fx12`, `tj2`.

### §MD-05 · Formularios y encuestas: Guardar, Likert, toggle Médico–Marketing, envío automático

- Dos motores: `forms` (módulo 09, 17 tablas, campos dinámicos para la ficha clínica) y `surveys`
  (módulo 65, 7 tablas, cuestionarios versionados). **`surveys` y `pharma_lab` no tienen `.puml` ni DDL en
  el modelo** (vault T-31: 38 tablas que no sobreviven a una reconstrucción).
- `surveys` API (`surveys/controllers/`): plantillas `POST/GET/GET :id/PATCH :id` (`surveys-templates.
  controller.ts:57-87`), preguntas `POST/PUT order/PATCH/DELETE` (`:99-139`), versiones y publicación
  (`:151-162`), desactivar (`:175`), respuestas (`:193`); asignaciones `POST /surveys/assignments` (`surveys-
  assignments.controller.ts:32`), invitaciones `POST /surveys/invitations {appointmentBookingId}` (`:45`);
  paciente `surveys/me/invitations` (`surveys-patient.controller.ts:42-61`). Tipos de respuesta
  (`surveys.concepts.ts:49-66`): TEXT, SCALE (1–5 por defecto, `surveys-templates.service.ts:215-216`,
  **sin anclas etiquetadas**), BOOLEAN, SINGLE_CHOICE, MULTIPLE_CHOICE. **No hay LIKERT.** Targets
  APPOINTMENT, SERVICE, CARE_TYPE (`:72-81`; CARE_TYPE rechazado al crear,
  `surveys-assignments.service.ts:73`). Emisión (`:156-252`): exige BOOKING_COMPLETED, idempotente,
  **no emite aviso ni mensaje**. **Envío automático: ninguno** — `issueForBooking` no tiene llamador fuera
  del módulo; `complete-appointment.use-case.ts:35-75` no publica evento ni llama a encuestas
  (`surveys/README.md`: «Emisión automática al cerrar la cita — PENDIENTE»). `grep -i "likert|marketing"`
  en `forms` y `surveys`: nada. Sin bandera de obligatoriedad a nivel encuesta, sin plantilla estándar
  para CONSULTA.
- `forms` API: `forms-fields.controller.ts:52-133`, `forms-assignments.controller.ts:71-204`,
  `forms-definition-sets.controller.ts:48-137` (publicar es SECURITY_ADMIN), instancias `:54-147`,
  paciente `forms/me/instances`. Tipos técnicos: string, text, integer, decimal, boolean, date,
  datetime, time, uuid, json, binary, reference, code (`create-field-definition.dto.ts:17-31`). **Sin
  `options`**: las opciones de elección no se persisten (`docs/pendientes-backend-formularios.md`).
- Front constructor `form-builder` (`app.routes.ts:365`, `features/form-builder/`): tipos Respuesta
  corta, Párrafo, Opción múltiple, Casillas, Cuadrícula única, Cuadrícula de casillas, Entero, Decimal,
  Sí/No, Fecha (`field-editor.ts:81-91`); **sin Likert**; **guardado automático** con `debounce` de 700 ms y
  al perder foco (`field-editor.ts:249,559`; `form-builder.ts:106-117`); el único «Guardar» visible es el
  `submitLabel` de la vista previa (`form-builder.html:94`) y **no guarda**. Sin toggle de modo.
  Encuestas del médico `questionnaires` (`:356`, `:475`; `features/questionnaires/`): tipos Texto libre,
  Escala numérica, Sí/No, Elección simple, Elección múltiple + casilla «Obligatoria»
  (`question-editor.ts:32-36`, `.html:201-203`); guardado por pregunta con «Listo» (`:209-218`); «Asociar a
  un servicio» con un **UUID de servicio tipeado a mano** (`survey-detail.html:160-180`,
  `survey-detail.ts:414-425`). `surveys.client.ts:295` tiene `issueInvitations` **sin llamador**.
- Docs del front: `docs/pendientes-backend-surveys.md` está **obsoleto** (las cuatro rutas que marca como
  faltantes ya existen); `docs/pendientes-backend-formularios.md` §1–5 sigue vigente.
- Móvil: `questionnaires/` (paciente y médico), tipos TEXT/SCALE/BOOLEAN/SINGLE/MULTIPLE
  (`survey_authoring_repository.dart:34-38`), envío manual `sendToAppointment` (`:314-337`).
- E2E: `carril-27-catalogo-formularios`, `carril-27-editor-encuestas` (`:99,:181`),
  `formularios-google-forms`, `formularios-cuadricula`, `consulta-formulario-*`. **Ninguna cubre modo
  marketing, Likert, envío automático ni el buzón por tipo.**

### §MD-07 / §MD-08 · Glosario → atlas; relaciones enfermedad, síntoma, medicina, anatomía

**Medido sobre la semilla publicada** (`mantra-core-health/public/glossary-seed/`, `manifest.json`
v1, `pageSize` 500, 59 MB en `shards/<categoría>/page-N.json` + 14 MB en `mock/`; construida por
`scripts/glossary-seed.mjs` desde `../glossary-data-build/`, **que no está en git ni en esta máquina**):

| Métrica | Valor |
|---|---|
| Términos | **19 313** (disease 10 046 · pharmacology 2 833 · other 2 453 · anatomy 1 910 · signs-symptoms 824 · lab 458 · treatment 351 · diagnostic-test 275 · specialty 110 · procedure 41 · imaging 7 · care 5) |
| Por sistema de códigos | cie10es 12 051 · cima-vtm 2 380 · wikidata-anatomia 1 904 · medlineplus-es 1 016 · wikidata-medicamento 447 · wikidata-tratamiento 317 · wikidata-sintoma 315 · medlineplus-es-lab 302 · inlasa 287 · wikidata-prueba 121 · wikidata-especialidad 104 · curated 48 · loinc 15 · icd10cm 6 |
| Largo de `definition` | **mediana 0 palabras**; p90 127; media 44,8; máximo 2 659 |
| Definiciones vacías | **13 449 de 19 313 (70 %)** |
| ≥ 200 / ≥ 500 / ≥ 2 000 palabras | 1 219 / 520 / **1** |
| Procedencia de la definición | ninguna 13 518 · CIMA 2 277 · MedlinePlus 1 840 · descripción corta de Wikidata 1 678 |
| Con `imageUrl` | **5 678 (29 %)**: Wikimedia Commons 4 568, fotos CIMA 1 110; por categoría disease 2 624, pharmacology 1 579, anatomy 1 225, other 106, signs-symptoms 100; **lab, specialty, imaging, care: 0** |
| Licencias de imagen | PD 1 999 · AEMPS 1 110 · CC BY-SA 3.0 930 · CC BY-SA 4.0 494 · otras CC; cada una con `imageAttribution`, `imageLicense`, `imageLicenseUrl`, `imageSourcePage` |
| Artículos largos | **8** en `mock/articles/` (hipertensión arterial 1 892 palabras, 13 secciones; los otros siete 113–861) |
| Relaciones | **54 853** aristas, todas resuelven: RELATED_TERM 24 218 · DISEASE 15 307 · TREATMENT 5 420 · SPECIALTY 4 789 · SYMPTOM 3 593 · DIAGNOSTIC_TEST 859 · ANATOMY 664 · PROCEDURE 3; 4 027 términos sin ninguna |

- Artículos propios: `data/glossary/articulos/` (19 + README, del commit WIP 407af872), compilados por
  `scripts/glossary-articulos-alovida.mjs` (`--min` 2 000); su `--check` **falla** hoy (falta
  `cateterismo-cardiaco.svg` en `public/glossary-images/`); sólo `hipertension-arterial` llegó a la API
  (`src/common/seed/glossary-articles.generated.ts`). 68 SVG propios en `public/glossary-images/`, todos
  «pendiente de revisión médica».
- **Las cuatro etapas de la enciclopedia están escritas en la API y nunca produjeron salida**
  (`mantra-core-health-api/tools/terminology-import/encyclopedia/`): s1-medlineplus (1 016 temas + 302
  guías, dominio público, rechaza A.D.A.M.), s2-cie10 (11 586 enfermedades con Orphanet CC BY 4.0, MONDO,
  HPO; imágenes Wikidata P18 → Commons con lista blanca de licencias), s3-farmacos (2 833 fichas técnicas
  CIMA, sin la sección 4.2 de posología), s4-anatomia (Wikidata, HPO, MeSH, Commons). Wikipedia está
  **excluida a propósito** (CC BY-SA). Ningún `articles.ndjson` ni `COVERAGE.md` existe en disco. El README
  de los importadores (`:9-30`) advierte que no se corrieron contra el stack.
- API: `GET /terminology/concepts` (`terminology-concepts.controller.ts:152`), `glossary-graph` (`:249`),
  `:id/glossary-neighborhood` (`:288`), `:id/glossary-article` (`:317`), `:id` (`:342`), `$glossary-facets`
  (value-sets `:177`). El artículo y la imagen son propiedades del concepto (`concept_properties`,
  `03_terminology/02_tables.sql:95`); `glossary.constants.ts:~62-72` dice que `GLOSSARY_IMAGE_PROPERTY_CODE`
  «deliberadamente no se sembró» aunque `concepts.service.ts:929-980,1416,1741` la lee.
  `terminology.concept_relationships` (`:109`) **no tiene columna de procedencia ni evidencia**.
- UI (`features/glossary/`): `glossary.html` → barra de filtros (`:17-24`, Categoría y Etiqueta), **rejilla
  de categorías entre el buscador y los resultados** (`:30-92`), tarjetas paginadas 12/24/48 con miniatura
  (`:165-179`); nada es `sticky` (`glossary.css`): con 12 tarjetas los resultados quedan bajo el pliegue
  (lo que el cliente describe como «al buscar desaparecen las categorías»). Íconos: 12 SVG a mano por
  categoría (`glossary-category-icon.ts:94-168`), ninguno por término. Detalle (`glossary-term.*`): imagen
  héroe con lightbox, pestañas Artículo (si existe) / Definición / Medicamento, grupos de relaciones,
  `glossary-network.ts` y `glossary-clinical-route.ts`. El atlas de Netter (548 láminas) sigue importado
  por `core/mock/fixtures/glossary.ts:1` pero **excluido de la semilla**; `atlas-anatomico-en-pantalla.spec.ts`
  busca «Lámina N del … Netter» y probablemente ya no coincide.
- **Relaciones por par** (ambos sentidos; medicina = pharmacology + treatment): enfermedad–enfermedad
  21 373 · enfermedad–medicina 10 353 · enfermedad–síntoma 4 498 · enfermedad–anatomía 1 278 ·
  síntoma–síntoma 837 · medicina–síntoma 453 · medicina–medicina 56 · **anatomía–síntoma 15 ·
  anatomía–medicina 2 · anatomía–anatomía 0**. Propiedades Wikidata usadas
  (`import-wikidata-relations.mjs:4-7`): P780, P2176, P1995, P924, P923, P927.
- AlovidaAIService: `glosario.generated.ts` (11 989 términos, 572 enfermedades con síntomas, 730 pruebas,
  **conserva sólo SYMPTOM, SPECIALTY, DIAGNOSTIC_TEST y descarta anatomía y medicinas a propósito**,
  `build-glossary-official.mjs:13-15,44-46`); `clinical-knowledge.generated.ts`: 7 361 hallazgos HPO/MeSH,
  3 060 enfermedades, **65 549 enlaces enfermedad → hallazgo** ponderados (MRCOC 40 416, HPO 41 321,
  glosario 2 128, MedlinePlus 1 519), con lockfile de fuentes; `anatomia.v1.ts` ~93 partes → 24 zonas →
  especialidades, **sin enlace a enfermedades ni fármacos**. Front: `zones.data.ts` 24 zonas,
  `symptoms.data.ts` 153 síntomas, 99 con slug de glosario; `medications-guide.data.ts` síntoma → ATC con
  9 entradas sin fuente. API: `drug_interactions` 5 filas dev, vademécum 17 medicamentos dev,
  `concept_maps` sin mapas clínicos sembrados, `graph_intelligence` sin nodos clínicos.

## 4 · Carril 3 — Farmacia, imagenología y laboratorio (Ender e Itzan)

### §PA-05 / §PA-06 · QR de receta, carga en farmacia, disponibilidad por sucursal, mock de farmacia

- **La receta no tiene cabecera.** `clinical.medication_requests` (`clinical/entities/medication_requests.
  entity.ts`): `patient_profile_id`, `encounter_id`, `medication_concept_id`, `status_concept_id`,
  `dose_text`, `quantity_decimal`, `valid_from/to`, `signed_at`, `issued_at`, `replaces/replaced_by/
  renewed_from_request_id`, `issue_idempotency_key`. **Sin número de receta ni id de grupo**; el front
  agrupa por encuentro y fecha (`patient-chart.ts:278-281`). Sin token, código ni columna de QR. Es el
  bloqueador C-01 / T-10 del vault.
- **El único QR vive dentro del PDF**: `clinical/services/prescription-qr.ts:20` `drawQr()`;
  `prescription-pdf.service.ts:532-533` codifica `${webAppBaseUrl}/verify/rx/${request.id}` — **UUID
  pelado, sin firma, sin vencimiento, sin atadura al paciente**, impreso también en el pie (`:349`), y
  cubre **un medicamento**, no la receta. `GET /clinical/prescriptions/:id/pdf`
  (`clinical-prescriptions.controller.ts:52`, CLINICIAN/PRACTITIONER/PATIENT; autorización en `render`
  `:485`). Verificación pública `GET /public/prescriptions/:id/verify`
  (`clinical-prescriptions-public.controller.ts:45-59`, `@Public`, 60/min, `no-store`) devuelve sólo
  `{id, status, issuedAt, contentHash, prescriberLicense}` (`prescription-verification.dto.ts:26-48`):
  **sin PHI ni ítems, por diseño**.
- **El front no tiene la ruta `verify/rx/:id`** (`app.routes.ts` sólo `verify/portability/:manifestHash`,
  `:2092`): el QR del PDF abre una página inexistente (ya anotado en `BR-10-receta-completa.md:37,179`).
  El mock la simula (`clinical.handlers.ts:405`) pero nadie la llama.
- Pedido del paciente: `POST /pharmacy/orders` (PATIENT, `pharmacy-orders.controller.ts:92`; DTO
  `siteId`, `medicationRequestId?`, `lines[]`); **la única atadura al paciente** es
  `findOwnMedicationRequest(id, pid)` (`pharmacy-orders.use-cases.ts:379-391`, 404 si es de otro); precios
  congelados, vence a las 48 h. Un pedido es una `inventory_reservations`
  (`SQL/25_pharmacy_inventory/02_tables.sql:99-123`; **un solo** `medication_request_id`), líneas en
  `inventory_reservation_lines` (`:125`), sustituciones `pharmacy_order_substitutions` (`:145`); estados
  `PINV_ORDER_{ENVIADO, EN_REVISION, CONFIRMADO, ACEPTACION_PENDIENTE, ACEPTADO, LISTO_PARA_RETIRO,
  RETIRADO, RECHAZADO}` (`pharmacy_inventory.concepts.ts:104-178`). Flujo del personal:
  `GET /pharmacy/orders` (`:60`), `review :165`, `confirm :181` (con `adjustments[]` `NO_DISPONIBLE |
  PROPONER_GENERICO`, `dto:470-519` — **la única marca «no lo tengo» por línea, y ocurre después de que el
  paciente ya pidió**), `reject :236`, `ready :257`, `dispense :277`; paciente `cancel :145`,
  `accept-substitutions :201`, `prefer-original :220`.
- Disponibilidad por sucursal **se calcula del stock**, no la marca el personal:
  `GET /pharmacy-inventory/availability?products&lat&lng&limit` y `GET /pharmacy-inventory/sites/:siteId/
  stock` (`pharmacy-inventory-read.controller.ts:38,56`, sin `@Roles`); el stock entra por recepciones de
  mercadería (`pharmacy-procurement.controller.ts:66`). `PharmacyTenantScopeGuard`
  (`pharmacy-tenant-scope.guard.ts:32-48`) acota al **tenant**, no a la sucursal: no hay usuario por sucursal.
- Front: `my-account/pharmacy` → tienda (`app.routes.ts:248`), `.../prescriptions` (`:509`), `.../cart`
  (`:521`), `my-account/medical-record/where-to-buy/:requestId` (`:496`, `where-to-buy.ts:458-475,592,694`),
  `my-account/pharmacy-orders/*` (`:239,535-583`); tablero del personal `administration/pharmacy-orders`
  (`features/organization/pharmacy-inbox`, filtro por sucursal `:72,407-417`). **El único QR del front es el
  código de retiro** del pedido (`order-detail.ts:39,55,274`, `shared/utils/qr/draw-qr.ts`). **No hay
  escáner** (ni BarcodeDetector, ni getUserMedia para códigos, ni zxing), ni `navigator.share` ni WhatsApp.
- Móvil: `pharmacy_store_screen.dart` lleva `medicationRequestId` por `extra` de GoRouter (`:15-60`);
  el personal **tipea** el código de retiro (`orders_screen.dart:300-310`); `pubspec.yaml` tiene
  `qr_flutter` y `share_plus` pero **ningún paquete de escaneo**; `AndroidManifest.xml:31-34` sin app links.
- **Mock de farmacia: no existe nada.** `mock-provider-server/src/app.module.ts:20-28`: health,
  notifications, deletions, embeddings, identity-verification; controlador/servicio/dto por feature, **sin
  puertos y adaptadores**. La API tiene `pharmacy.pharmacy_integration_connections` (banderas
  `supports_stock_query / price_query / reservation / dispense_confirmation`, `manual_fallback_allowed`) y
  `pharmacy.pharmacy_external_product_mappings` (`external_product_code`, `external_unit_code`,
  `mapping_version`, `verification_status_concept_id`) (`SQL/24_pharmacy/02_tables.sql:142-177`), con
  `POST /pharmacies/:id/integration-connections` (`pharmacy.controller.ts:235`) y `.../product-mappings`
  (`:247`) que **sólo escriben filas**. Sincronización entrante `POST /internal/inventory-sync-batches`
  (`pharmacy-inventory-internal.controller.ts:67`) y `.../reconcile` (`:79`): la conciliación
  (`domain/sync/reconciliation.ts:11-25`) marca MATCHED sólo si viene `pharmacyProductId`, **nunca busca
  `externalProductCode` en los mapeos y no cambia stock**. Hay puertos en `pharmacy_inventory/application/
  ports/*` pero para módulos internos; **no hay puerto de proveedor externo de farmacia** ni variables de
  entorno ni servicio en compose.
- E2E: `clinica-c5-receta`, `carril-e3-donde-comprar-receta`, `prescription-official-pdf*` (descarga, **no
  verifican el QR**), `pedido-farmacia-sin-delivery`, `tablero-de-pedidos-de-farmacia` (seis colas, filtro
  por sucursal), `portal-farmacia`, `catalogo-universal-farmacia`. **Ninguna cubre QR, `/verify/rx`,
  escaneo ni enlaces profundos.**

### §FA-01 / §FA-02 · Importación masiva en todo; ERP por pestañas

- Menú del personal (`navigation.map.ts:1703-1906`), **diez entradas planas**: Resumen
  (`administration/pharmacy`), Productos (`pharmacy-catalog`), Categorías, Importación masiva,
  Inventario, Precios, Solicitudes de retiro (`pharmacy-orders`), Promociones, Ficha, Sucursales. Rutas
  `app.routes.ts:289-310`; `pharmacy-catalog` carga `features/pharmacy/products/` con simulador y
  `features/organization/pharmacy-catalog/` sin él (`:289-294`); las únicas pestañas son Productos / Nuevo
  producto / Importación masiva (`pharmacy-catalog.html:23-430`). `portal-farmacia.spec.ts:63` exige «ocho
  filas» y **está desactualizado** (hay diez).
- Importación masiva hoy: **productos** (`features/pharmacy/import/pharmacy-import.ts`, sólo `.csv`
  `pharmacy-import.html:55`, 500 filas `catalog.rules.ts:45`, modos CREAR_Y_ACTUALIZAR / SOLO_CREAR /
  SOLO_ACTUALIZAR `:614`, **upsert en el cliente, una petición por fila** `:664-667`); **inventario**
  (`inventory/upload-dialog`, `.csv` → `PATCH /pharmacies/:id/inventory`, **sólo simulador**). Categorías,
  precios, sucursales, campañas, servicios: **sin importación**. Sin XLSX.
- Contratos reales vs simulador (`core/data-access/pharmacy/pharmacy.client.ts`): `simulatorOnly` en
  `POST /pharmacies/:id/catalog-requests` (`:131`), categorías POST/PATCH/DELETE (`:296-316`),
  `PATCH /pharmacies/:id/inventory` (`:325-331`); la página de precios guarda `PATCH product {unitPrice}`
  (`pharmacy-prices.ts:260`) y la de productos `{inStock}` y `{status}` (`pharmacy-products.ts:384,417`),
  mientras `UpdateProductDto` sólo admite `brandName`, `genericName`, `strengthText`, `packageSizeText`,
  `requiresPrescription` (`update-product.dto.ts:35-95`) y la validación global es `forbidNonWhitelisted`
  (`common/http/validation-pipe.ts:104`): **esos PATCH dan 400 contra la API real** (inferido por lectura).
  Inventario del front por farmacia, **sin `siteId`** (`pharmacy.types.ts:416-420`).
- API: productos `POST/PATCH/DELETE :pharmacyId/products` (`pharmacy.controller.ts:142,156,179`);
  **categorías: sólo `GET`, que devuelve vacío porque «el modelo no las guarda todavía»** (`:88`; no hay
  tabla en `SQL/24_pharmacy`); precios por listas, **un precio por llamada** (`:191-223`); stock sólo por
  recepciones (upsert de lote y posición, `pharmacy-procurement.use-cases.ts:283,325`) y conteos
  (`pharmacy-inventory.controller.ts:100-116`). **Ningún endpoint de importación / upsert masivo para
  ningún catálogo de farmacia** (`pharmacy-products.service.ts:78` lo dice). Los únicos masivos del repo:
  `POST /terminology/.../:versionId/import(-file)` (`terminology-versions.controller.ts:77,112`; es lo que
  cubre `carga-masiva*.spec.ts`), `forms/import`, `payments/settlements/import`.
- Móvil (`pharmacy_admin/`): pantallas separadas; `CatalogImportScreen` pega texto y publica fila por fila
  (`catalog_import_screen.dart:50,158-162`), sólo productos y sólo crear.

### §PA-07 / §LI-01..03 · Órdenes de laboratorio e imagenología, QR, estados, resultados, servicios, perfil

- Órdenes: `clinical.service_requests` (`SQL/08_clinical/02_tables.sql:218-238`) con **un solo
  `code_concept_id`** (un estudio por fila), `category_concept_id`, `status_concept_id`,
  `performer_tenant_id`, `previous_diagnostic_report_id`; **sin QR, token ni lista de estudios**. Estados
  SR_ACTIVE / COMPLETED / DRAFT / ON_HOLD / REVOKED / SATISFIED_BY_PRIOR (`clinical.concepts.ts:82-130`).
  Endpoints `clinical-orders.controller.ts`: `duplicate-check :68`, `POST service-requests :87`,
  `POST diagnostic-reports :104`, `:id/release :127`. El front crea **una orden por estudio**
  (`analysis-order-block.ts:627`, `forkJoin`). Los paneles existen sólo en el catálogo del laboratorio
  (`diagnostic_units.diagnostic_study_components`, `23_diagnostic_units/02_tables.sql:107`).
- **QR de orden: no existe** en API, modelo (`grep qr` en 08/20/23: nada) ni front; móvil sólo un ícono
  `qr_code_2` decorativo (`lab_reception_screen.dart:341`). Sin escáner, sin endpoint de lectura por token.
- Recepción del laboratorio: `POST /diagnostics/service-requests/inbox`
  (`diagnostics-reception.controller.ts:43`; filtra por `performer_tenant_id`,
  `lab-reception.repository.ts:46-59`); muestras y accesiones (`diagnostics-specimens.controller.ts:62-161`:
  `specimens`, `accessions`, `specimens/:id/rejection`, contenedores, custodia). **Imagenología queda fuera
  de la recepción** (`CATEGORIES_WITH_SPECIMEN`, `diagnostics.concepts.ts:335-338`).
- Reserva del paciente: web `diagnostic-orders.ts:456,497-500` navega a `/my-account/appointments?resource=lab`
  y `appointments.ts:162-174,799-806` cambia a recurso ROOM — **el id de la orden no viaja**; móvil
  (`schedule_lab_sample_sheet.dart:85-96`, `health_repository.dart:426-445`) hace hold + request y pone la
  orden en el **texto libre `reasonText`**. `appointment_bookings` (`41_scheduling/02_tables.sql:175-199`)
  **no tiene `service_request_id` ni FK a oferta diagnóstica**; `practitioner_service_offerings` es por
  médico, no por unidad diagnóstica.
- **Duración**: `DEFAULT_SLOT_MINUTES = 30` es constante (`scheduling/domain/catalog/catalog-concepts.ts:132`);
  se sobreescribe por plantilla o regla con `slotMinutes` (mín. 5) y `gapMinutes`
  (`scheduling-catalog.dto.ts:296-335`; orden regla → plantilla → constante,
  `generate-slots.use-case.ts:122-123`). **Sin default configurable por tenant o servicio, sin editar la
  duración de un turno individual.** `diagnostic_study_offerings.expected_duration_minutes` existe
  (`23_diagnostic_units/02_tables.sql:93`) y **no está cableado** a la generación de cupos.
- Aceptar/rechazar: `POST bookings/:id/accept` (`:150`), `reject` (`:227`), `request-info`, `propose-schedule`;
  genéricos, no atados a una orden de laboratorio.
- **Estados: seis máquinas separadas** (`diagnostics.concepts.ts`): muestras SPEC_COLLECTED/RECEIVED/
  REJECTED (`:18-23`); accesiones ACC_RECEIVED/IN_PROCESS (`:26-30`); ítems ACC_ITEM_RECEIVED/REJECTED
  (`:33-40`); órdenes de trabajo WO_OPEN (`:160`); pruebas TEST_PENDING/PRELIMINARY/VERIFIED/CANCELLED/
  REPORTED (`:163-170`); versiones de informe REPORT_PRELIMINARY/FINAL + RELEASE_ELIGIBLE (`:199-204`);
  más `clinical.diagnostic_reports.lifecycle_status_concept_id` (`08_clinical:240`). Mapeo a los cinco
  del cliente: **INICIADA** ≈ SR_ACTIVE / etapa `pending` «Sin muestra»; **RECIBIDA** ≈ SPEC_RECEIVED /
  ACC_RECEIVED; **EN PROCESO** ≈ ACC_IN_PROCESS (`diagnostics-lab.service.ts:132`) / WO_OPEN /
  TEST_PENDING-PRELIMINARY; **RECHAZADA** ≈ SPEC_REJECTED / ACC_ITEM_REJECTED (**por muestra, no por orden;
  imagenología no tiene rechazo**); **CONFIRMADO** ≈ REPORT_FINAL / TEST_VERIFIED (`:286`) / SR_COMPLETED
  (`diagnostic-reports.service.ts:74`).
- Resultados en la API real: `POST /diagnostics/reports/:reportId/versions` (`diagnostics-reports.
  controller.ts:49`), `.../versions/:versionId/release` (`:66`), resultados críticos (`:84,:100`); órdenes
  de trabajo (`diagnostics-lab.controller.ts:63-133`); imagenología DICOMweb (`diagnostics-imaging.
  controller.ts:109,127`). Los archivos se atan por `fileId` en la versión
  (`diagnostics-reports.service.ts:114-123` → `diagnostic_report_files`); la subida va por `object-storage`
  (`initiate :73`, `complete :89`, `signed-url :197`, `content :223`, `request-deletion :279`). Descarga
  del **paciente** `GET /diagnostic-results/me/:reportId/files/:fileId/content`
  (`diagnostics-patient-results.controller.ts:173`); **no hay descarga del lado del centro**. Móvil llama
  `GET /clinical/diagnostic-orders/:id/results` (`health_repository.dart:484`) **que no existe**.
- **Inmutabilidad**: `releaseVersion` devuelve 409 si ya es REPORT_FINAL (`:159-163`); pero
  `createReportVersion` (`:50-127`) **sigue aceptando una versión nueva que la supera** y nada bloquea
  cambios de la orden, muestras o archivos después de FINAL.
- **El portal «Laboratorio» del front es sólo simulador** (`core/data-access/lab-portal/lab-portal.client.ts:
  30-35,195-204`: «ninguna ruta `/diagnostics/lab/*` existe en la API», todo `simulatorOnly()` → 501):
  servicios CRUD + `import` (`:46-76`), categorías (`:87-108`), resumen (`:118`), `result-files`,
  `result-targets`, `result-uploads` por partes, `content`, `withdrawal` (`:126-190`). Pantallas:
  `administration/laboratory`, `laboratory-results`, `laboratory-prices` (`app.routes.ts:313-318`,
  `features/laboratory/{summary,results,prices}`); `laboratory-results.ts` tiene cola de subida múltiple
  (`:249-298`, `result-upload-queue.ts`), descarga (`:453`) y retiro (no borrado): **una galería de archivos,
  no una tabla por orden**. Lo real: `laboratorio/recepcion` → `features/lab-reception/lab-reception.ts`
  (columnas **Paciente, Estudio, Pedida, Estado, Acciones** `:166-171` — lo más cercano a lo pedido; etapas
  `pending` «Sin muestra» / `received` / `rejected` `:71-78`; acciones «Recibir muestra» y «Registrar
  accesión» `lab-reception.html:314-342`); `laboratorio/cola` → `features/diagnostics/` (órdenes de trabajo,
  columnas Orden / Estado / Programada `:112-114`); `administration/medical-laboratory` → unidades
  diagnósticas real (`diagnostic-units-admin.client.ts:55-163`). **Ninguna de estas etiquetas existe en
  ningún repo**: «Crear instancia de servicio», RECHAZAR / CONFIRMAR / DESCARGAR RESULTADOS, INICIADA,
  EN PROCESO. Móvil `lab_portal/` usa las mismas rutas inexistentes detrás de `guardFeature`
  (`lab_portal_repository.dart:13-15,77-195`); la recepción sí usa las reales (`:206-314`).
- Servicios ofrecidos: real `POST /diagnostic-units/:id/study-offerings` (`diagnostic-units.controller.ts:224`),
  `DELETE /diagnostic-study-offerings/:id` (retirar, `diagnostic-pricing.controller.ts:72`), listas de
  precios (`:239`, `:45`, `:60`); estados DU_OFFER_DRAFT / ACTIVE / RETIRED. **Sin PATCH ni upsert masivo.**
  `billing/service-catalog` (médicos) GET / POST / PATCH sin DELETE ni masivo. E2E `carril-22-*` apuntan al
  catálogo de **médicos**, no al de laboratorio.
- **Perfil del laboratorio**: `features/organization/organization-profile/organization-profile.ts:18-24,
  36-40` (desde `my-account.ts:4`): para farmacia renderiza `PharmacyProfile` completo; para
  DIAGNOSTIC_CENTER **sólo** título «Perfil del laboratorio», razón social, nombre comercial, zona horaria
  y logo, leídos del directorio (el comentario dice que la carpeta legal y los gerentes no existen para
  laboratorios). `diagnostic_units.diagnostic_units` (`23_diagnostic_units/02_tables.sql:5`) tiene
  `public_profile_id`, `accepts_external_orders`, `walk_in_available`, `home_collection_available`,
  verificación y estado: **la pantalla no expone ninguno**.
- E2E: `clinica-c9-mis-ordenes.spec.ts` (pestañas, filtros, diálogo de preparación; sin reserva ni QR);
  `hito2-laboratory-insurance.spec.ts` (**demo/simulador**; dice que no certifica la API real);
  `lab-visits-como-la-agenda.mjs` es de **visitadores médicos** (`pharma_lab`), no de laboratorios.
