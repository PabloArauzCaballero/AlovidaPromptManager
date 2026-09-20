# H1 — Recorrido prioritario del registro y sus relaciones

> **Consulta:** 2026-09-20T15:56–17:38 UTC · **Peldaño:** `DISCOVERED` (nada de esto arrancó build/test/runtime propio; los tests citados son de otras personas, ya corridos, con su evidencia enlazada) · **Rutas absolutas de los checkouts:**
> `D:\Trabajos Secundarios\Mantra Core Technologies\{mantra-core-health-api, mantra-core-health, mantra_core_health_mobile, AloVida, Mantra Core Health Vault, AlovidaPromptManager}`

> [!warning] Antes de leer nada más: lo que se ve puede ser una demo
> `mantra-core-health` compila el backend simulado **encendido** en `yarn start` (desarrollo) y en `yarn build` (producción, `defaultConfiguration` sin `fileReplacements`) — es así en `HEAD`, `origin/dev` y `origin/mockup` por igual. **Un recorrido verde con `mockBackend` activo no acredita el backend.** Sólo tres arneses lo apagan: `yarn start:real-api`, `yarn recorrido:real` (Cypress `cypress/e2e/real/`) y la configuración `e2e-real` de Playwright, todos contra la API real en `:3000`. No se afirma que todo endpoint esté simulado en toda configuración: no se comprobó exhaustivamente. Detalle en §3.

**Veredicto de una línea:** recorrido elegido **M-06** (agenda con espera y demora, incl. los 4 avisos 3.4/3.5/4.2/4.3 del piloto P8) — verificable hoy contra backend real sólo parcialmente (mecanismo con dobles, no con integración completa: un bug sistémico ajeno la bloquea) — y **Q-04 (registro original) queda cerrada**: el `.docx` existe en este mismo workspace y su hash coincide al 100% con el que la bóveda transcribió.

---

## §1 — El registro funcional original (H1.S1.M1)

| Candidato | Qué es | Veredicto |
|---|---|---|
| `RealDataSeeds/REGISTRO DE PROCESOS POR MODULO.docx` | El documento que el cliente entregó, según la bóveda (`sha256:467a2bb1e2745ebd…`, recibido 2026-08-17) | **ES el original.** `sha256sum` del archivo real en este workspace = `467a2bb1e2745ebd544d9e7df0ae9821f80f1cf5a3df452f12fc7622998331cd` — coincide byte a byte con el prefijo que cita la bóveda. Extraído con `python -m zipfile`: **428 párrafos no vacíos**, exactamente lo que declara `Mantra Core Health Vault/SALUD/📋 Registro de procesos por módulo.md:15`, y **sin ninguna marca `(COMPLETO)`/`(INCOMPLETO)`/`(FALTA)`** — es el texto limpio del cliente, no una copia anotada |
| `gdoc_procesos.txt` (raíz) | Copia del mismo contenido, **con 102 marcas de estado del equipo intercaladas** (`(COMPLETO)`, `(INCOMPLETO: …)`, `(FALTA)`) | Es una **derivación de trabajo** sobre el original, no el original mismo. Útil porque el equipo ya usa sus marcas para diagnosticar brechas, pero no reemplaza al `.docx` |
| `REGISTRO DE PROCESOS POR MODULO.md` (raíz) | — | Es «Diagnóstico de fidelidad — corte 2026-09-05»: **auditoría derivada**, no el original (regla de la ficha) |
| `docs/tareas/TAREA-15-notificaciones-de-agenda.md` | Normaliza el pedido puntual de agenda desde `BITCAORA.md` (UTF-16) | Es la ficha de trabajo de un pedido concreto (los 4 avisos), no el registro completo |

**Q-04 — corrección respecto del reparto: CERRADA.** El paquete `BACKEND_AUTONOMO_MANTRA` (que no existe en este workspace) y Pablo habían registrado el `.docx` como inaccesible, buscándolo en `C:\Users\Usuario\Downloads\Entrypoint-GitHUb\alovida` — ruta que hoy **no existe** en esta máquina. Pero el archivo sí está, en `RealDataSeeds/` de este mismo workspace, y el hash lo confirma como el mismo documento. La cita del puerto de agenda (`agenda-notice.port.ts:32`: "Los cuatro avisos que el registro del cliente pide (3.4, 3.5, 4.2 y 4.3)", y línea 111 "TAREA-15, punto 1 y 3 del pedido") corresponde a los ítems del `.docx`/`gdoc_procesos.txt` bajo «MODULO PACIENTE → 3. Agendar Hora…» (sub-ítems 4 y 5) y «MODULO MEDICO → 4. Revisión de su Calendario…» (sub-ítems 2 y 3). La lectura `ítem.subítem` como «3.4/3.5/4.2/4.3» es una convención de quien escribió el puerto, no una numeración literal del documento (que usa sangría, no números compuestos) — se declara así para no sobre-afirmar.

---

## §2 — Corte real de los checkouts (H1.S1.M2)

| Checkout | Rama / HEAD | `origin/dev` | `origin/mockup` | Nota |
|---|---|---|---|---|
| `mantra-core-health-api` | `marcelo/feat-representantes-nombre-en-partes-api` @ `a5753dc7` (2026-09-19 17:27) | `4cc5ea1f` (2026-09-20 10:50, merge PR #443 Justin) | — | `TARGET_REF` de la ficha (`32ae9399`) es commit válido, **8 commits detrás** de `origin/dev`; mi HEAD es ancestro de `origin/dev` y **no incluye el PR #443** de Justin |
| `mantra-core-health` | `marcelo/feat-insurance-antifraud-hardening` @ `35cf35dc` (2026-09-20 02:00) | `3f001e49` (2026-09-20 00:29) | `48a402cd` (2026-09-20 00:29) | `TARGET_REF` no existe en este repo (`git cat-file -t` → error) |
| `mantra_core_health_mobile` | `dev` @ `2c2e257a` (2026-09-05 17:36) | = HEAD | — | `TARGET_REF` no existe en este repo |
| `AloVida` | `main` @ `ec5e0083` (2026-08-24 14:40) | — | — | `TARGET_REF` no existe en este repo |

**Ambigüedad — «los dos repositorios de frontend»:** la ficha §0 dice «frontends (`mantra-core-health`)» (singular implícito); el documento maestro habla de «las dos ramas» de un mismo repo (`dev`/`mockup`). Se registran **ambas** lecturas arriba, sin decidir cuál pedía la ficha.

Los 8 commits nuevos en `origin/dev` de la API (`32ae939..origin/dev`) son: el merge de Itzan (`5d5007f`, MCH-008.2), la relación agenda→mensajería de Justin con dobles (`89382d4`, `f9afde2`, merge `4cc5ea1f`), y el laboratorio de Pablo (`cd1889b`, merge `cac54e7`). **Justin fijó su relación al corte `5d5007f`**, ni al `TARGET_REF` ni al `origin/dev` actual.

---

## §3 — Qué configuración de entorno se compila, y qué banderas de demo quedan activas (H1.S1.M3/M4)

| Configuración de `angular.json` | Archivo que gana | `mockBackend` | `campaignsDemo` | `paymentDemo` | `loyaltyDemo` |
|---|---|---|---|---|---|
| `production` (**default de `build`**, usa `yarn build`) | `environment.ts` (sin `fileReplacements`) | **`true`** | `true` | `true` | `true` |
| `development` (**default de `serve`**, usa `yarn start`) | `environment.development.ts` | **`true`** | `true` | `true` | `true` |
| `real-api` (`yarn start:real-api`) | `environment.real-api.ts` | `false` | `false` | `false` | `true` (hereda el default; sólo se apaga con `PUBLIC_LOYALTY_DEMO=false`) |
| `e2e-real` | `environment.e2e-real.ts` | `false` | `true` (hereda) | `true` (hereda) | `true` (hereda) |

Fragmentos literales (`environment.ts:40,48,55,62`): `paymentDemo: envFromProcess.paymentDemo ?? true` / `loyaltyDemo: … ?? true` / `campaignsDemo: … ?? true` / `mockBackend: true` (**no lee `envFromProcess`, está quemado**). `environment.real-api.ts:44-46`: `mockBackend: false, campaignsDemo: false, paymentDemo: false` (spread de `desarrollo` para el resto). Idéntico en `HEAD`, `origin/dev` y `origin/mockup` — verificado con `git show <ref>:src/environments/environment.ts` en los tres. `node scripts/check-real-api-config.mjs` confirma la configuración: "✓ real-api apaga la maqueta, las demos de campañas y pago, y el SSR; development y production intactos". La bandera `mockBackend: true` entró a `dev` el 2026-09-05 con el commit `5a4bab48` (Pablo, «backend simulado en memoria»).

`src/app/core/mock/README.md:3-4`: «esta rama es un clon de `dev` en el que **ninguna petición sale a la red**»; lo que un handler no cubre cae en respuesta genérica + `[mock] sin manejador para …` en consola (línea 65-67). Hay 27 archivos de handlers en `src/app/core/mock/handlers/` cubriendo la mayoría de dominios — pero **no se afirma cobertura total**, no se auditó.

**Arneses que sí hablan con el backend real:** `yarn start:real-api` / configuración `e2e-real` de Playwright · `yarn recorrido:real` (`scripts/run-recorrido-real.mjs`: Cypress `cypress/e2e/real/`, 12 specs, exige `RATE_LIMIT_DISABLED=true` y la API en `:3000`) · `playwright/carril-p8-avisos-agenda.spec.ts` (captura sobre datos creados por `mantra-core-health-api/tools/alovida/p8-avisos-agenda.mjs` contra API viva; su cabecera declara explícitamente que la campana in-app es del carril P1 y **no existe todavía** en el front) · `playwright/*.real.spec.ts` (`patient-coverage-copays.real.spec.ts`, `prescription-official-pdf.real.spec.ts`).

**Frase normativa para el equipo:** un recorrido verde con `mockBackend` activo no acredita el backend. Tampoco se afirma lo contrario: no se comprobó que todos los endpoints estén simulados en cualquier configuración. Lo que no se comprobó, no se afirma.

---

## §4 — Criterio de orden del catálogo, y por qué (H1.S2.M1)

**Los IDs `M-01…M-19` son auxiliares del paquete `PERFIL_MANTRA_DEV.md` §5** (inaccesible en este workspace — Glob vacío), transcriptos en `AlovidaPromptManager/docs/requisitos/REQUISITOS-CLIENTE-ALOVIDA.md` Anexo A (líneas 594-621). **No son IDs oficiales del cliente y no reemplazan los pasos del documento original** (§1). Este uso es un desvío declarado por límite de acceso.

**Criterio, escrito antes de aplicar la tabla:**
1. **Recorridos que el turno exige.** El reparto del 19/09 (`Daily-Noche-2026-09-19.md` y los cuatro prompts hermanos de Pablo/Justin/Itzan/Ender) fija el **piloto de avisos de agenda (P8)** como foco de la noche, y el propio código del backend cita el registro del cliente en 3.4/3.5/4.2/4.3 + TAREA-15 (§1). Esta es una fuente **externa** a la ficha de Marcelo, citada explícitamente como tal.
2. **Dependencias que desbloquea**, medido por localizador real: participantes ya materializados en código (servicios, adaptadores, entidades) pesan más que un proveedor externo inexistente.
3. **Verificable hoy contra backend real**: existe un arnés que no depende de la maqueta (§3).
4. **Sin regla de negocio indefinida**: se descarta o pospone lo que el propio texto del cliente marca como pendiente de decidir («se decidirá cuando se cierre la negociación», «CHARLAR») — nunca se rellena esa regla por criterio propio.

**Ninguno de los 19 escenarios del catálogo se presenta como transcripción del registro original** (§1): son requisitos recogidos de segunda mano por el paquete y contrastados acá contra el `.docx` y el código real.

| Orden | ID | Escenario | Motivo (verificable) |
|---|---|---|---|
| 1 | **M-06** | Agenda entre sedes, reserva concurrente, cancelación, espera y demora | Foco del turno (criterio 1); mecanismo ya construido con localizadores reales (§8); arnés real existente (`recorrido:real`, `carril-p8-avisos-agenda.spec.ts`, `p8-avisos-agenda.mjs`); sin regla de negocio indefinida en el flujo de reserva/aviso mismo |
| — | M-01 | Registro con tres nombres, apellidos, CI/departamento y edad derivada | **Prerrequisito de datos** de M-06 (necesita paciente y médico dados de alta), no un recorrido en sí — no se ordena en la lista, se declara como dependencia |
| 2 | M-02 | Tutor/dependiente e invitación que recupera la misma ficha | Participantes de registro ya existen parcialmente (código); no toca P8; sin arnés real específico verificado |
| 3 | M-05 | Médicos: especialidades, títulos, matrículas y documentos | Registro, no agenda; participantes verificados en trabajo previo (subtareas 1.x de Marcelo, memoria de sesión) |
| 4 | M-03 | Datos fiscales y sedes múltiples | Registro/legal, ya trabajado (subtareas 1.1-1.4); no es un recorrido nuevo |
| 5 | M-07 | Preparación de estudios (ayuno, especificaciones técnicas) | Depende de datos que «dará la empresa» externa — no definidos por el cliente en este documento |
| 6 | M-13 | Resultados, correo y notificación al médico y paciente | Notificación (participantes ya materializados: `messaging`), pero requiere integración de resultados de laboratorio externo, no verificada |
| 7 | M-11 | Atención de orden completa por farmacia/centro | Requiere «enlazado o sincronizado con el sistema de la Farmacia» (línea 314 de `gdoc_procesos.txt`) — integración externa sin contrato definido |
| 8 | M-12 | Domicilio, trabajo o retiro; entrega y factura | Depende de M-11; cobro parcialmente excluido (§7) |
| 9 | M-04 | Ocupaciones requeridas por el registro | Depende del catálogo SEGIP (896 opciones), que el propio cliente anota «(CHARLAR CON EL TIO)» — regla de negocio pendiente de conversación, no de código |
| 10 | M-08/M-09/M-10 | Aprobación parcial de aseguradora (medicamentos/laboratorio/imagen) | `grep` en `src/modules/insurance` no encuentra motor de aprobación automática por cláusula/póliza — sólo lectura/analytics/settlement. Q-17 (qué es «aprobación parcial» exactamente) sigue abierta |
| 11 | M-19 | Integraciones de precios, inventario y aseguradoras | Integración externa de sistemas de terceros, sin contrato ni proveedor confirmado |
| 12 | M-17 | Supermercado, promociones, lotes por caducar | Depende de un «socio aliado» (supermercado) no identificado; regla de negocio de descuento sin definir |
| 13 | M-18 | Facturas, comisiones y reportes monetarios | No es un recorrido vertical: es una capacidad transversal (dentro de la exclusión del cobro, ver §7) que ya tiene base parcial (`accounting`, 42 tablas — memoria de sesión) |
| 14 | M-15/M-16 | Puntos: saldo, canje, multiplicadores | El cliente declara literalmente, tres veces (`gdoc_procesos.txt:337,394,460`): "el nombre lo decidiremos juntos después" — regla de negocio explícitamente pendiente de negociación con un tercero |
| 15 | M-14 | Cronograma de medicamentos con alarmas de 15 min | **`NOT_FOUND` verificado**: `grep -rniE "cronograma\|medication.?schedule\|alarm"` en ambos repos no devuelve ninguna feature real de recordatorio de toma de medicamentos (los aciertos de la búsqueda son de otros dominios: `accrual`/`schedule` contable, `alarma-de-pedidos` de farmacia). Coincide con la marca `FALTA` del cliente en las tres capas — dato reportado por el equipo, verificado independientemente por código, no adoptado como estado del sistema sin comprobar |

**Q-10 (reglas sin definir) queda registrada** para M-04 (catálogo SEGIP/«CHARLAR»), M-08/09/10 (Q-17, qué es aprobación parcial), M-15/16 (nombre y % de puntos) y M-17 (socio supermercado).

---

## §5 — Recorrido elegido, y los descartados (H1.S2.M2)

**Elegido: M-06 — Agenda con espera y demora.** Camino: paciente busca médico → ve horario/sede → reserva (hold→confirm) → si no hay cupo, entra a lista de espera → si otro paciente cancela, se libera el cupo y **se dispara el aviso 3.4/4.3** → si el médico avisa demora, **se dispara el aviso 3.5/4.2** → el aviso llega por in-app, correo y (TAREA-15) chat de `SupportAdmin`.

**Por qué éste y no otro:** cumple los 4 criterios de §4 simultáneamente — es el foco explícito del reparto de la noche, tiene los participantes materializados en código con localizador real (§8), existe un arnés que lo verifica sin maqueta, y su mecánica central (reserva, espera, aviso) no depende de ninguna regla de negocio que el cliente haya dejado pendiente de decidir. Es, además, el único candidato donde **cuatro personas del equipo (Pablo, Justin, Itzan, Ender) ya están trabajando la misma noche** sobre piezas de la misma capacidad — elegir otro recorrido dejaría ese trabajo sin quien lo use.

**M-01 no es un recorrido descartado, es un prerrequisito**: sin un paciente y un médico dados de alta, M-06 no tiene con qué ejercitarse. No se le asigna posición en la tabla de §4 por esa razón, no por irrelevancia.

**Los 17 restantes, descartados con motivo verificable** (tabla de §4, columna «Motivo»): ninguno se descarta por una marca `(FALTA)`/`(INCOMPLETO)` del cliente tomada como estado del sistema (Q-R4 lo prohíbe) — cada descarte cita o bien texto literal del cliente que declara la regla pendiente, o bien un `NOT_FOUND` verificado en código.

**Nada de esto queda `DECISION_REQUIRED`**: la elección de M-06 no dependió de un dato que faltara, sólo de aplicar el criterio ya escrito a la evidencia recolectada.

---

## §6 — Participantes que exige M-06 (H1.S2.M3)

| Capacidad | Localizador | Rol |
|---|---|---|
| `scheduling` (API) | `src/modules/scheduling/{controllers,services,adapters,ports,notices,state}/` | Reserva, lista de espera, demora, emisión del aviso |
| `messaging` (API) | `src/modules/messaging/services/notifications.service.ts` (canal `CHANNEL_TYPE_IN_APP`, líneas 447/467/857/914/1181/1346) | Entrega in-app y cola de correo |
| `community` (API) | `src/modules/community/` + `SupportAdminNoticeAdapter` (`scheduling.module.ts:72,140`) | Chat de `SupportAdmin` (TAREA-15) |
| `directory` (API) | `scheduling.module.ts:88` (comentario TP-5: «quién pertenece a cada organización lo decide `directory`») | Permiso de lectura de agenda por organización |
| `practice` (API) | `scheduling.module.ts:89` | Sede/asignación de dónde se atiende |
| `profiles` (API) | `scheduling.module.ts:96` | Alta de paciente sin cuenta dentro de la transacción de reserva |
| `insurance` (API, sólo lectura) | comentario ALV-021 en `scheduling.module.ts` | Mostrar «Particular» o el nombre de la aseguradora en la lista de consultas |
| `audit` (API) | `scheduling.module.ts:84` | Trazabilidad transversal |
| Frontend `agenda` | `src/app/features/agenda/{booking-new,appointment-new,my-agenda,walk-in,blocks}` | Reserva y vista de agenda |
| Frontend `notifications` | `src/app/features/notifications/{notification-center,aviso-de-hueco-libre,notification-presentation}.ts` | Bandeja de avisos (**sin campana/badge visible**: `grep` de "campana/bell/badge" no encontró ninguno) |
| Móvil | `lib/core/constants/api_endpoints.dart:31-40` declara `myAgenda`, `agendaSlots`, `slotHold`, `bookings`, `cancelBooking` | Consumo de agenda desde la app — **corrección al `CLAUDE.md`**: el móvil no tiene «cero conexión a la API»; sí declara estos endpoints. No se verificó qué pantalla los invoca realmente (fuera de alcance de H1) |
| Infra | Postgres `mantra_redesa_health` (`:5433`/`:5434` según `.env`), canal `IN_APP` sembrado (bug v4.0.11 corregido, ver memoria de sesión) | Persistencia y catálogo de conceptos |

**Proveedores externos:**

| Proveedor | Estado | Consecuencia |
|---|---|---|
| Correo (SMTP real) | `docker-compose.yml:563` sirve `mock-provider-server` como doble; `.env.example` sólo declara `GOOGLE_SENDER_EMAIL`, ningún SMTP real | Aceptación externa pendiente (Q-21): el correo real nunca se probó |
| Push | Sin cliente conectado verificado en este lote | Aceptación externa pendiente |
| SMS/WhatsApp (para el link de registro, fuera de M-06 pero mencionado en el documento del cliente) | `NOT_FOUND` en el flujo de agenda | No aplica a M-06 directamente |

---

## §7 — Qué capacidad queda fuera por la exclusión del cobro (H1.S2.M4)

**Fuera del alcance:** la pasarela y el procesamiento del cobro (QR de pago, tarjeta; el módulo `payments` como ejecución del cobro en sí).

**Dentro** (Anexo C §5 de `REQUISITOS-CLIENTE-ALOVIDA.md`): facturas, NIT/razón social, copagos, deducibles, comisiones, delivery, puntos, QR de canje, inventario, reportes, promociones. **No se elimina `payments` por su nombre**: se determina la capacidad.

Para M-06 específicamente: el dinero aparece en el documento del cliente sólo como «Datos de la facturación» (`gdoc_procesos.txt:64-66`, sub-ítem 6 de «Agendar Hora»: nombre/razón social y NIT), **no como cobro de la reserva misma**. Verificado: `grep -rn "billing|invoice|factura"` en los controllers y DTOs de `scheduling` no encuentra integración de facturación en el flujo de reserva (el único acierto es un comentario sobre el costo de un hueco no cubrable, no una integración real) — **`NOT_FOUND`**: la facturación de la cita vive en el flujo de encuentro/consulta clínica, no en la agenda.

---

## §8 — Localizadores reales, paso por paso (H1.S2.M5)

| # | Paso | Repo | Localizador | Arnés real |
|---|---|---|---|---|
| 1 | Buscar médico disponible | API | `src/modules/scheduling/controllers/scheduling-bookings.controller.ts:85` (`GET`) | `cypress/e2e/real/03-medico.cy.ts`, `05-portal-turnos.cy.ts` |
| 2 | Ver horario y sede | API | mismo controller, `:128` (`GET :id`) | ídem |
| 3 | Reservar (hold→confirm) | API | rutas `:144 accept`, `:190 propose-schedule`, `:206 reject`, `:311 reschedule`, `:327 cancel` en `scheduling-bookings.controller.ts` | `carril-ag6-agenda-convivencia.spec.ts` |
| 4 | Sin cupo → lista de espera | API | `src/modules/scheduling/services/scheduling-waitlist.service.ts:66` (`SchedulingWaitlistService`) | sin arnés `.real` específico verificado |
| 5 | Cupo liberado → aviso 3.4/4.3 | API | `scheduling-agenda-notices.service.ts` (referencia `SLOT_RELEASED`; **no se encontró coincidencia literal en esa corrida de grep** — revisar contra `origin/dev`, que ya trae el trabajo de Justin) | `tools/alovida/p8-avisos-agenda.mjs` + `playwright/carril-p8-avisos-agenda.spec.ts` |
| 6 | Demora del médico → aviso 3.5/4.2 | API | `scheduling-delay.service.ts:76` (`SchedulingDelayService`) | ídem |
| 7 | Paciente ve el aviso (bandeja) | Front | `src/app/features/notifications/{notification-center,aviso-de-hueco-libre}.ts` | **`NOT_FOUND`** la campana/badge visible; `carril-p8-avisos-agenda.spec.ts` declara explícitamente que ese componente es del carril **P1** y no existe aún |
| 8 | Copia al chat `SupportAdmin` (TAREA-15) | API | `src/modules/scheduling/adapters/support-admin-notice.adapter.ts:43` (`SupportAdminNoticeAdapter`) | sin arnés `.real` verificado; `carril-chat-realtime.spec.ts` toca chat pero no se confirmó que cubra este camino |
| 9 | Correo | API | `messaging-agenda-notice.adapter.ts:342` (`encolarCorreo`, produce `emailRequestId`/`emailSkippedReason`) | `mock-provider-server` como destino (doble), sin SMTP real probado |
| 10 | Datos de facturación (3.6) | API | **`NOT_FOUND`** en el flujo de reserva (§7) | — |
| 11 | Consumo móvil | Móvil | `lib/core/constants/api_endpoints.dart:31-40` declara los 5 endpoints de agenda | `grep` en `lib/features` no encontró pantalla que los consuma en este lote — **no verificado, no se afirma que no exista**, sólo que no se localizó |

**Relación con lo ya construido por el equipo (en `origin/dev`, fuera de mi checkout):** `test/doubles/strict-agenda-notice-port.double.ts`, `test/integration/agenda-mensajeria-{relacion,persistencia}.int-spec.ts` y el reporte de Justin (`docs/trabajo/2026-09-19-relacion-agenda-mensajeria/`) ya cubren los pasos 5, 6 y 9 **con dobles**, `ADAPTER_VERIFIED_WITH_DOUBLES` (ver §9).

---

## §9 — Relaciones que el recorrido exige (H1.S3.M1) y qué acredita cada una (H1.S3.M2)

| Relación | Participantes / dirección | Puede empezar con dobles | Espera participantes reales | Estado hoy |
|---|---|---|---|---|
| `agenda → mensajería` | `scheduling` → `messaging` (in-app + correo) | Sí — ya lo hizo Justin | Integración full-app real (bloqueada, ver abajo) | `ADAPTER_VERIFIED_WITH_DOUBLES` (fijado a `5d5007f`, no al `origin/dev` actual) |
| `avisos → chat SupportAdmin` | `scheduling` → `community` (TAREA-15) | Sí, mismo patrón que la anterior | Verificación contra Postgres real con la reserva completa | **No iniciada** — es la siguiente relación natural para Justin |
| `agenda → lista de espera` | `scheduling` interno → adaptador Postgres + worker de barrido | Sí | Confirmar que el worker dispara al desmarcar (el cliente pide «al desmarcarse», el código dispara «por barrido periódico» — brecha ya anotada en `gdoc_procesos.txt:226`) | Construido, comportamiento distinto al pedido — no es un `DECISION_REQUIRED` de H1, es dato para Ender |
| `agenda → perfiles/directorio` | `scheduling` → `profiles`/`directory` (alta de paciente sin cuenta dentro de la reserva; permiso por membresía) | Sí | Prueba de ausencia de Itzan sobre `MessagingModule`/`CommunityModule` en `scheduling.module.ts` | En construcción por Itzan (su H1/H2 del mismo turno) |
| `front agenda → API scheduling` | `scheduling.client.ts` → controllers de `scheduling` | Sí, con la maqueta | Arranque contra `real-api` (§3) | Sin verificar en este lote |
| `front notificaciones → API messaging` | `notifications.client.ts` → `notifications.service.ts` | Sí, con la maqueta | ídem | Sin verificar; falta además el componente de campana (P1) |
| `móvil → API scheduling` | `api_endpoints.dart` → controllers de `scheduling` | No verificado si hay dobles en el móvil | Confirmar qué pantalla los invoca | Sin verificar (§8, paso 11) |
| `mensajería → correo externo` | `messaging` → proveedor SMTP | Con `mock-provider-server` | Un SMTP real (Q-21) | Aceptación externa pendiente |
| `mensajería → push` | `messaging` → proveedor push | No verificado | Cliente conectado (Q-21) | Aceptación externa pendiente |

**Lo que un adaptador con dobles NUNCA acredita** (heredado de la ficha de Justin en `origin/dev`): contenido semántico real de `subject`/`bodyText`, resolución real de `recipient` a cuenta, ni nada de correo/chat real. `ADAPTER_VERIFIED_WITH_DOUBLES` no es integración verificada.

**El bloqueador que afecta a cualquier verificación de integración completa de este recorrido:** un `MetadataError` sistémico de MikroORM (`TsMorphMetadataProvider` sobre 1258 entidades) impide que `bootstrapTestApp()` arranque para cualquier `*.int-spec.ts` que use el `AppModule` completo — Pablo lo destapó y probó 4 causas distintas sin resolverlo (`origin/dev`, `CORTE-2026-09-19.md` §13). No es de este recorrido en particular, pero bloquea su verificación end-to-end real.

---

## §10 — Capacidad del equipo y demanda (H1.S3.M3/M4)

`TEAM_CAPACITY = DESCONOCIDO`. `Daily-Noche-2026-09-19.md:65`: «Q-03 · `TEAM_CAPACITY` en horas netas sin calcular · `ABIERTA`». Falta: personas asignadas a la línea B, horas netas por persona y día, y qué día del plazo es hoy (`Q-01`: el paquete se fecha 20-09 y se escribió 19-09).

**No se inventa un número.** Por eso la tabla de abajo da rangos e incertidumbres, no una fecha de entrega:

| Lote | Rango estimado | Incertidumbre principal |
|---|---|---|
| H2 (casos de aceptación del recorrido) | 2-4 h | Depende de cuánto del catálogo M-06 ya tiene oráculo definido en el documento del cliente |
| H3 (permisos, estados, dinero) | 3-6 h | El kill-test de IDOR es barato; la matriz completa de estados puede ser más larga si `scheduling` tiene más transiciones de las vistas hoy |
| H4 (ejercitar multi-módulo) | **Sin techo mientras el `MetadataError` no se resuelva** | Bloqueado por infraestructura ajena a este recorrido (§9) |
| H5 (aceptación con participantes reales) | Depende de H4 | Requiere Postgres arriba + API en `:3000` con `RATE_LIMIT_DISABLED=true` — infraestructura que ya falló y se reparó una vez esta misma noche (ver `CORTE-2026-09-19.md` de Pablo) |
| H6 (dictamen) | 1-2 h una vez cerrado H5 | Ninguna propia |

**Como no cabe afirmar «no cabe» sin `TEAM_CAPACITY`, se entregan alternativas para coordinación (Q-C1), sin recortar en silencio:**
- **(A)** Cerrar H1+H2 esta noche; dejar H3–H6 `A MEDIAS` con lo ejecutable declarado.
- **(B)** Cerrar H1+H2+H3.S1 (permisos), priorizando el kill-test de IDOR sobre el resto de H3.
- **(C)** Pedir `TEAM_CAPACITY` a coordinación antes de abrir H4, porque su costo real depende de si alguien va a invertir tiempo en el `MetadataError` o si H4/H5 quedan bloqueados hasta que otra persona lo resuelva.

---

## §11 — Ambigüedades registradas (no resueltas)

| ID | Ambigüedad | Estado |
|---|---|---|
| Q-01 | El paquete se fecha 20-09 y se escribió 19-09 | `ABIERTA` — afecta qué significa «Día 1» |
| Q-C1 | Seis hitos no entran en una noche | Alcance parcial declarado (§10); decisión de coordinación |
| Q-04 | Registro funcional original | **CERRADA** en este documento (§1): el `.docx` existe en `RealDataSeeds/` y su hash coincide |
| Q-02/Q-03 | `TEAM_CAPACITY` sin calcular | `ABIERTA` (§10) |
| Q-10 | Reglas de negocio sin definir (SEGIP/ocupaciones, nombre de puntos, socio supermercado) | `ABIERTA` — ver §4 |
| Q-R4 | Las marcas `(COMPLETO)`/`(INCOMPLETO)`/`(FALTA)` del cliente no están verificadas por nadie | Respetada: cada vez que se citó una, se verificó también en código (§4, M-14) |
| Q-17 | Qué es exactamente «aprobación parcial» de la aseguradora | `ABIERTA` — afecta M-08/09/10, descartados en §4 |
| Q-21 | Qué proveedor externo se puede probar dentro del plazo (correo real, push) | `ABIERTA` — ver §6 |
| «dos frontends» | Ambigua entre «los dos repos front» y «las dos ramas de `mantra-core-health`» | Se fijaron ambas lecturas en §2 |
| Tensión del aviso («Q-06» en `VERIFICACION-CONTRA-CODIGO-2026-09-19.md` §2.4; sin ID en la ficha de Marcelo) | El puerto dice «un aviso que falla se registra y se descarta, jamás revierte nada» (`agenda-notice.port.ts:19-20`); el cliente dice «RECIBIRA» / «de manera AUTOMATICA enviara» (`gdoc_procesos.txt:225-226`) y «PUEDES RECIBIR» (línea 62) — no garantiza entrega, el cliente parece asumirla | `DECISION_REQUIRED`, no resuelta acá (OUT explícito de la ficha: es de Ender). Se cita, no se decide |

---

## §12 — Kill-test respondido

**«¿El recorrido elegido se puede verificar hoy contra el backend real, o el frontend compila con `mockBackend` activo?»**

Respuesta citando el archivo de entorno que se compila (§3): con `yarn start` o `yarn build` (los comandos por defecto), **el frontend compila con `mockBackend: true` en `environment.development.ts` / `environment.ts`**. La única forma de verificar M-06 contra el backend real hoy es `yarn start:real-api` o los arneses `recorrido:real`/`e2e-real`/`carril-p8-avisos-agenda.spec.ts` — y aun así, la **integración completa** (paso a paso, con Postgres real y el `AppModule` entero) está bloqueada por el `MetadataError` sistémico de §9. Lo que sí está verificado contra Postgres real, con dobles, es la relación `agenda → mensajería` de Justin.

---

## §13 — Handoff

**A Justin:** la siguiente relación a preparar es `avisos → chat SupportAdmin` (TAREA-15, §9) — mismo patrón de dobles que ya usaste en `agenda → mensajería`, con la ventaja de que `SupportAdminNoticeAdapter` (`support-admin-notice.adapter.ts:43`) ya existe y sólo falta el equivalente de tu `strict-agenda-notice-port.double.ts` para `community`. Ojo: tu ficha fijó el corte en `5d5007f`, y `origin/dev` ya se movió a `4cc5ea1f` (incluye tu propio merge + el laboratorio de Pablo) — revisar si eso cambia algo antes de seguir. (Lo que vos me debías a mí: si mi recorrido toca un canal cuyo límite de verificación es tuyo — sí, los tres canales de M-06 pasan por tu relación.)

**A Itzan:** el recorrido **exige** una escritura atómica que cruza `scheduling` + `profiles` en un punto concreto: cuando el paciente que reserva no tiene cuenta todavía, el alta en `profiles` tiene que quedar en la misma transacción que la reserva (comentario AC-3.3 citado en el `CORTE-2026-09-19.md` de Pablo). El aviso queda **fuera** de esa unidad transaccional (el puerto lo dice explícitamente: «jamás revierte la reserva» — línea 19-20 de `agenda-notice.port.ts`). Como dato aparte: `em.transactional` ya se usa 12 veces en `scheduling-bookings.service.ts`. (Lo que vos me debías: si la garantía transaccional que necesito existe hoy — sí, para reserva+alta; no está probada para reserva+aviso porque el aviso está deliberadamente fuera de la transacción.)

**A Ender:** la garantía funcional que el recorrido le exige al aviso está en tensión (§11, última fila): el puerto declara que un aviso fallido se descarta sin garantía de reintento ni de entrega, mientras el documento del cliente (3.5/4.2, línea 225-226 de `gdoc_procesos.txt`) da por hecho que el paciente/médico **va a recibir** la notificación. Las dos citas con ruta:línea están arriba — no propongo cuál gana, es tu decisión de contrato.

**A Pablo:** Q-04 (registro original) queda **cerrada**: el `.docx` está en `RealDataSeeds/REGISTRO DE PROCESOS POR MODULO.docx` de este mismo workspace, hash `467a2bb1e2745ebd…` coincidente con el que la bóveda transcribió — no hace falta seguir buscándolo en `Entrypoint-GitHUb`. La tabla de demanda vs. capacidad está en §10; sin `TEAM_CAPACITY` no puedo decir si algo entra o no en el plazo, sólo dar las tres alternativas de coordinación.
