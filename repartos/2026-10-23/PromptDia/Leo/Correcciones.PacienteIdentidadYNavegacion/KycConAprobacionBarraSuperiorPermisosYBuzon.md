# KYC con aprobación humana, la barra superior del paciente, la tabla de permisos y el buzón de encuestas

> **Rol:** dueño de la identidad del paciente, de la cabecera web y móvil del paciente, de la tabla de permisos y del buzón de encuestas · **Carril:** 1 · Paciente (con Richard) · **Fecha:** 2026-10-23 · **Turno:** día
> **Fuente del pedido:** [`CORRECCIONES-FULLSTACK-2026-10-23.md`](../../../../../docs/requisitos/CORRECCIONES-FULLSTACK-2026-10-23.md) — **PA-01, PA-03, PA-08, PA-09.a/c/d, PA-12**, y el lado paciente de **PA-05**
> **Verificación contra el código:** [`VERIFICACION-CONTRA-CODIGO-2026-10-23.md`](../../../../../docs/verificacion/VERIFICACION-CONTRA-CODIGO-2026-10-23.md) — §PA-01, §PA-03, §PA-08/MD-03, §PA-09, §PA-12, §PA-05
> **Plan completo:** [`planes/06-correcciones-fullstack-2026-10-23/README.md`](../../../../../planes/06-correcciones-fullstack-2026-10-23/README.md) — contratos **C-03, C-05, C-06, C-07, C-10** (vos consumís; producís el módulo de identidad del mock)
> **9 hitos · 19 subtareas · 72 microtareas**, todas con criterio de aceptación y Definition of Done.
>
> **Lo primero que tenés que saber:** las cinco evidencias del KYC (frente, dorso, tres poses) **ya se
> capturan** en web y en móvil y **ya tienen tipo** en la API. Lo que no existe es la decisión humana: con el
> mock activo el worker auto-verifica a los diez segundos, y en el portal admin no hay botón de aceptar. Tu
> carril arranca por ahí. Y lo segundo: **el simulador miente**; cada pantalla se demuestra contra la API
> real con `start:real-api`, y el simulador se actualiza después.

## 0. Ficha de asignación

| Campo | Valor |
|---|---|
| `REPOS` | `mdavila-2001/mantra-core-health` (front Angular 21) · `mdavila-2001/mantra-core-health-api` **sólo** `mock-provider-server/src/identity-verification/**` y `src/worker/jobs/identity_assurance/**` · `mdavila-2001/mantra_core_health_mobile` (Flutter) |
| `TARGET_REF` | `origin/dev` del front (corte leído `227eb255`) y de la API (`6ea11561`); `origin/main` del móvil (`ec88e81`). **Reconsultá y fijá el tuyo** en tu `PLAN.md` |
| `RAMAS` | `leo/paciente-kyc-y-navegacion-2026-10-23` en cada repo, saliendo de su base. **Nada directo sobre `dev`/`main`, nada sin PR.** Un PR por hito cerrado |
| `ARCHIVOS RESERVADOS PARA VOS` | Front: `features/identity-verification/**` · `features/identity-assurance/**` · `features/shell-layout/**` (**sólo** el bloque de la cabecera del paciente) · `features/settings/**` · `features/account/spending/**` · `features/account/my-invoices/**` · `features/account/pharmacy/cart/**` · `features/account/promotions/**` (**sólo** mover el contenido al carrito; el marketplace es de Richard) · `features/dashboard/patient-home/**` · `features/symptom-check/**` (**sólo** la pestaña de recomendaciones) · `features/account/access-requests/**` · `features/account/clinical-access/**` · `features/account/questionnaires/**` · `features/account/pharmacy/prescriptions/**` · ruta nueva `/rx/:token` (`features/account/pharmacy/rx-link/**`) · `core/navigation/**` (**sólo** filas del paciente) · `core/data-access/{identity,consent,surveys}/**` · `core/mock/handlers/{identity,consent,surveys-forms}.handlers.ts` · `playwright/correcciones-2026-10-23-kill-tests.spec.ts` (**sólo** los `test()` de tus IDs). API: `mock-provider-server/src/identity-verification/**` · `src/worker/jobs/identity_assurance/**`. Móvil: `features/patient_shell/**` · `features/patient_home/**` · `features/identity/**` · `features/questionnaires/**` (paciente) · `features/settings/**` (nuevo) · app links |
| `ARCHIVOS DE OTROS — NO LOS TOQUES` | `insurance/**`, `geo/**`, `promotions/**`, `features/directory/**`, `features/public-directories/**`, `features/billing/patient-payment/**`, `core/geo/**` (**Richard**) · `identity_assurance/**` de la API salvo el worker, `consent/**`, `surveys/**`, `iam/**`, `billing/**`, `@Roles` de cualquier endpoint, `concepts.ts`, Coolify (**Pablo**) · `scheduling/**`, `features/agenda/**`, `features/glossary/**` (**Justin**) · `clinical/**/prescription*`, `pharmacy/**`, `features/pharmacy/**`, `shared/components/organisms/qr-scanner/**` (**Ender**) · `diagnostics/**`, `features/laboratory/**` (**Itzan**) · `app.routes.ts` y `navigation.map.ts`: **sólo** tus rutas y filas, en tu bloque, con comentario `// Leo · plan 06` |
| `⚠️ RIESGO ALTO DE TU CARRIL` | **Las evidencias del KYC son PHI.** El mock recibe **referencias** de archivo, nunca el contenido; nada de eso en logs, capturas ni en tu reporte (`data-privacy-phi`). Segundo: **sacar Emergencia, Tutoriales, Mis facturas y Promociones de la cabecera rompe listas cerradas** en `shell-layout.spec.ts` (`:521-524`, `:1073-1155`, `:1220-1279`, `:1285-1339`) y en `promociones-arriba.mjs`: se corrigen las listas, **nunca** se saltan los tests |
| `CONTRA QUÉ SE PRUEBA` | **API real** (`docker compose up` en el repo de la API, `yarn seed:e2e`) + `corepack yarn start:real-api`. El simulador (`start:demo`) se actualiza **después** y vale `VERIFIED_FUNCTIONAL_ONLY` |
| `CUENTAS DE PRUEBA` | Las que siembra `yarn seed:e2e` (variables `E2E_*`). Contra el simulador: `paciente@alovida.mock`, `admin@alovida.mock` (cualquier contraseña). **Sintéticas declaradas** |
| `DÓNDE SE PRUEBA` | `/my-account/identity`, `/administration/identity-assurance/cases/:caseId`, la cabecera en `/dashboard` como paciente, `/settings`, `/my-account/spending`, `/my-account/pharmacy/cart`, `/my-account/access-requests`, `/my-account/clinical-access`, `/my-account/questionnaires`, `/rx/:token`. **Sacá las URLs del router, no las supongas** |
| `LÍMITE DE RECURSOS` | Regla 70: un `ng serve`, un build, un navegador, Playwright `--workers=1` (ya está en la config) |

## 1. Antes de escribir una línea — instalación OBLIGATORIA del estándar

> **Esta sección no es opcional y no es el final del día: es lo primero.** Un prompt ejecutado sin el
> estándar cargado produce trabajo que después hay que rehacer, porque no va a tener plan, ni evidencia,
> ni reporte. **Si no podés completar este paso, estás `BLOQUEADO`: avisalo y no sigas.**

### 1.1 Instalar el estándar en tu checkout

```bash
# 1. Clonar el estandar al lado de los repos de producto
git clone https://github.com/PabloArauzCaballero/AlovidaPromptManager.git ../AlovidaPromptManager

# 2. Copiarlo DENTRO de cada checkout de trabajo (Claude Code solo carga desde ./.claude/)
cp -r ../AlovidaPromptManager/.claude   ./
cp    ../AlovidaPromptManager/AGENTS.md ./
cp -r ../AlovidaPromptManager/.agents   ./   # solo si tu herramienta no lee .claude/

# 3. Verificar que quedo instalado (pega esta salida en tu daily)
ls .claude/skills | wc -l
ls .claude/rules/[0-9]*.md | wc -l
python .claude/hooks/plan_gate.py --self-test
```

⚠️ **Antes de `cp -r`, mirá qué hay:** el front **ya tiene** su propio `.claude/` (skills `project-design-system`,
`visual-quality-gate`, agentes `visual-reviewer`, `frontend-reviewer`). No lo pises: fusioná y dejá constancia
en tu daily. El `CLAUDE.md` del front **manda** sobre estas reglas cuando discrepan.

### 1.2 Qué te instala eso

| Candado | Qué impide |
|---|---|
| `plan_gate.py` | Escribir código sin `PLAN.md` en disco. Nunca bloquea `.md` ni nada bajo `docs/` |
| `report_gate.py` | Cerrar la sesión con trabajo activo y sin `REPORTE.md`, o sin sus tres secciones |
| `blocker_gate.py` | Cerrar con microtareas en `BLOQUEADO` o `EN CURSO` sin declarar la simulación de los tres niveles del contrato (regla 65) |

### 1.3 Skills que tenés que CARGAR para este lote

**Del proceso — obligatorias para todos:** `skills-router` · `factual-discovery` · `milestone-planning` ·
`anti-hallucination-guard` · `evidence-and-verification` · `scope-discipline` · `rationalization-guard` ·
`context-thrift` · `progress-reporting` · `finish-your-turn` · `work-report-md`.

**De tu lote:**

| Skill | Para qué |
|---|---|
| `data-privacy-phi` | **la más importante**: evidencias del KYC, referencias y no contenido, nada en logs ni capturas |
| `authn-identity` | el ciclo del caso de verificación y qué desbloquea «validado» |
| `frontend-navigation-ia` | sacar y mover secciones sin dejar rutas muertas: redirecciones heredadas, `fueraDelMenuPara`, breadcrumbs |
| `frontend-ux-states` | la tabla de permisos vacía, el buzón vacío y el caso «en revisión» son S3 con próxima acción, no pantallas mudas |
| `frontend-data-tables` | la tabla de permisos por sección y sistema, con acciones por fila y plegado en móvil |
| `frontend-accessibility` | el toggle conceder/rechazar/revocar no transmite el estado sólo por color; foco tras el diálogo de motivo |
| `atomic-design-components` | `app-data-table`, `app-tabs`, `content-dialog`, `app-badge`: nada nuevo en `shared/` |
| `regression-suite-management` | las listas cerradas de `shell-layout.spec` y `navigation.*.spec` se corrigen, no se debilitan |
| `e2e-playwright` | tus `test()` en la suite de kill-tests: locators por rol, web-first, sin `waitForTimeout` |
| `visual-proof` + `critical-double-review` | tres viewports, dos temas, dos pasadas |
| `hexagonal-architecture` (si existe; si no, `nestjs-development` + `subagent-design` §contrato) | el módulo de identidad del mock en puertos y adaptadores |
| `flutter-development` · `alovida-app-movil-ux` | el cajón, los Ajustes nuevos y el app link de `/rx` |

Entrá siempre por `skills-router`: **no leas el catálogo entero, no sirve.**

### 1.4 DoD de esta sección

- [ ] `ls .claude/skills | wc -l` y `python .claude/hooks/plan_gate.py --self-test` pegados en tu daily.
- [ ] Leíste `skills-router` y las skills de las dos tablas, empezando por `data-privacy-phi`.
- [ ] Creaste tu `PLAN.md` (`docs/trabajo/2026-10-23-paciente-kyc-y-navegacion/PLAN.md` en cada repo) **antes** del primer `Edit`/`Write` de código.

> ### ✅ Hechos ya verificados contra el corte — no los repitas, pero tampoco los creas sin abrir el archivo
>
> - La captura de las cinco evidencias: `features/identity-verification/identity-verification.ts:330-358` (envío), `:450-506` (liveness con `getUserMedia`, poses centro / izquierda / derecha). Móvil: `identity_verification_screen.dart:18-19,77-95`, `identity_repository.dart:179-198`.
> - El portal admin del caso **no decide**: `features/identity-assurance/.../case-detail.html:46` sólo enlaza a `review/escalate`; `review-decision-form.ts:77-143` pide el UUID de la revisión a mano. La API sí tiene `POST identity/verification-cases/:id/manual-review` y `POST identity/manual-review/:id/decision` (`identity-manual-review.controller.ts:38`).
> - El worker auto-acepta: `mock-identity-verification-provider.adapter.ts:31-55` manda `{subjectRef, checkType}`; el mock responde ACCEPTED a los 10 s con `IDENTITY_VERIFICATION_REJECTION_RATE=0`; `settleCase` (`identity-checks.service.ts:351-401`) cierra sin humano.
> - La cabecera: `shell-layout.html:274` (Emergencia), `:440-450` (Tutoriales), `:482-492` (Mis facturas, **todos los roles**), `:519-529` (Mis gastos), `:532-542` (Promociones), `:544-566` (Carrito). Ajustes sin pestaña Tutoriales (`settings.html:8-123`). El «mapa» de PA-03.d es `promotions.html:24-38`.
> - Permisos: el front hoy pide por `authz/care-relationships` sin áreas (`request-access.ts:83-88`); la bandeja del paciente `access-requests.ts` acepta/rechaza sin motivo (`:135-171`) y **no está en el menú**. El contrato nuevo (C-05) lo produce Pablo sobre `consent/practitioner-access-requests`.
> - Buzón: `features/account/questionnaires/` existe con dos pestañas y está **oculto del menú** (`navigation.map.ts:1357-1377`). `PatientInvitationDto` no trae partner ni servicio: Pablo lo extiende (C-06).

## 2. Resultado observable

| Hito | Prioridad | Qué queda demostrado |
|---|---|---|
| **L-H1** | `BLOQUEANTE` | Corte, baseline y tus kill-tests `@carril-1 @leo` corridos contra la API real, **en rojo y pegados**. |
| **L-H2** | `BLOQUEANTE` | Un paciente sube carnet (2 caras) y 3 poses; el caso queda **en revisión**; un administrador lo ve con las cinco imágenes en el portal y lo **acepta con un botón**; el paciente ve «Identidad validada» y `patientCode`. Rechazar deja motivo visible. El mock no decide solo. |
| **L-H3** | `ALTA` | Cabecera web del paciente sin Emergencia; Tutoriales dentro de Ajustes; `/my-account/spending` con pestañas «Resumen» (facturas) y «Movimientos»; Promociones dentro del Carrito y sin mapa; las rutas viejas redirigen; specs corregidos. |
| **L-H4** | `ALTA` | `/my-account/permissions`: tabla de pedidos por médico, área, sección de la historia, sistema del cuerpo y fase, con Conceder / Rechazar / Revocar y motivo, contra C-05, con entrada en el menú. |
| **L-H5** | `MEDIA` | Inicio del paciente sin «Recomendar medicamentos», con el panel de especialistas; entrada principal rediseñada tras la captura; bloques vacíos retirados. |
| **L-H6** | `ALTA` | Móvil: cajón sin Emergencia; pantalla Ajustes nueva con Ayuda/Tutoriales; Mis facturas dentro de Gastos; promociones en el carrito. |
| **L-H7** | `ALTA` | Buzón de encuestas en el menú, agrupado por tipo de partner y servicio, con las obligatorias arriba y contador. Web y móvil. |
| **L-H8** | `ALTA` | `/rx/<token>` abre la receta del paciente con sesión (o pide iniciar sesión y vuelve), y de ahí reserva en la farmacia que la tiene. App link en móvil. |
| **L-H9** | `ALTA` | Kill-tests `@leo` **en verde contra la API real**, regresión, doble revisión, `REPORTE.md`, PRs mergeables. |

> ⚠️ **Orden: L-H1 → L-H2 → L-H3 → L-H4 → L-H7 → L-H8 → L-H5 → L-H6 → L-H9.** Si hay que recortar, L-H2 y L-H4 valen más que L-H5 y L-H6.

**Kill-test del lote completo:** entrá como paciente con la API real, subí las cinco evidencias: si el caso
pasa a «verificado» solo, sin que un administrador toque nada, **L-H2 está mal hecho**. Entrá como
administrador: si para aceptar tenés que pegar un UUID, L-H2 no está hecho. Volvé como paciente: si en la
cabecera sigue el botón de emergencia o «Tutoriales» como enlace propio, L-H3 no está hecho. Abrí
`/my-account/permissions`: si no hay tabla con sección de la historia y sistema del cuerpo, o «Rechazar» no
pide motivo, L-H4 no está hecho. Abrí el menú: si no aparece «Encuestas», L-H7 no está hecho. Pegá un
`/rx/<token>` en una ventana sin sesión: si muestra la receta, **L-H8 está mal hecho**.

## 3. Alcance

**IN:** corte y baseline · módulo de identidad del mock en puertos y adaptadores con backoffice y
`AUTO_DECIDE=false` · worker que no auto-acepta · botón Aceptar / Rechazar en el caso del portal admin ·
estado del caso en la pantalla del paciente web y móvil · cabecera web y cajón móvil según PA-03 · pestañas
de Mis gastos · Ajustes con Tutoriales (web y móvil) · promociones dentro del carrito sin mapa · tabla de
permisos del paciente y revocación con motivo (web y móvil) · inicio del paciente (PA-09.a/c/d) · buzón de
encuestas (web y móvil) · ruta `/rx/:token` y app link · tus `test()` de la suite de kill-tests · simulador
actualizado · capturas · `PLAN.md`, `REPORTE.md`, `evidencia/`.

**OUT:** **cualquier archivo fuera de los reservados de la ficha** · la API de `identity_assurance`,
`consent`, `surveys` y `iam` (**Pablo**: si necesitás un endpoint, lo pedís por el daily y construís contra
el contrato con doble declarado) · el marketplace de promociones y el rediseño de directorios (**Richard**)
· la cabecera del médico y de los demás roles (Mis facturas **sigue** para los roles que no son paciente:
el cliente habla de la barra del paciente; se registra como ambigüedad) · el escáner de QR (**Ender** lo
escribe en `shared/components/organisms/qr-scanner/**` en su Ola 0; vos lo usás) · detección biométrica
de pose · desplegar el mock en Coolify (**Pablo**) · debilitar un spec para que pase · declarar `HECHO` una
microtarea cuyo DoD no corriste.

**Ambigüedades registradas** (además de Q-01, Q-02, Q-04, Q-05, Q-10, Q-IMG del archivo de requisitos):

| ID | Ambigüedad | Supuesto tomado | A quién confirmar |
|---|---|---|---|
| Q-L1 | PA-03.a «Emergencia eliminarlo»: ¿sólo de la cabecera, o también el panel dentro del triage de síntomas (`symptom-check.html:497,519`) y la pantalla `/patient/emergency` del móvil? | Se quita **de la cabecera y del cajón**; el panel dentro del triage **se conserva** (es la salida natural ante un síntoma de alarma) y la pantalla móvil queda accesible desde el triage. Se confirma con el doctor | Pablo + doctor |
| Q-L2 | PA-03.c: Mis facturas es de **todos los roles**; Mis gastos sólo del paciente | Para el paciente, facturas = pestaña «Resumen» de Mis gastos y `/my-account/invoices` redirige; para los demás roles Mis facturas sigue donde está | Pablo |
| Q-L3 | PA-03.d «Promociones fusionarlo con Carrito»: ¿pestaña dentro de `/my-account/pharmacy/cart` o sección debajo del carrito? | **Pestaña** («Carrito» · «Promociones») en la misma tarjeta a lo ancho (`composition-rules.md §5`); `/my-account/promotions` redirige a `?pestana=promociones` | Pablo |
| Q-L4 | PA-01: «backoffice» = portal admin del front | Sí (Q-01). El mock expone además `GET /backoffice/cases` por si Pablo quiere una consola mínima en el propio mock: se expone, no se le hace UI | Pablo |
| Q-L5 | L-H8: ¿qué pasa si el token venció? | Pantalla S5 «Este enlace venció; pedile al médico que lo reenvíe», con botón a Mis recetas si la sesión es del paciente | Pablo |

## 4. Plan — hitos, subtareas y microtareas

Los seis estados permitidos son exactamente: `TODO`, `EN CURSO`, `HECHO`, `A MEDIAS`, `BLOQUEADO` y
`DESCARTADO`. **`A MEDIAS` es legítimo; disfrazarlo de `HECHO` no.** Cada microtarea de UI nombra en su
DoD el `test()` de la suite de kill-tests que pone en verde.

### H1 — Corte, baseline y kill-tests en rojo

**Prioridad:** `BLOQUEANTE`

**CA:** Dado tu entorno, cuando alguien pregunta contra qué versión trabajaste, qué estaba en rojo antes de tocar nada y qué pedía el cliente que hoy no pasa, entonces hay SHA, salidas con código de salida y la lista de tus kill-tests en rojo con el motivo de cada uno.
**DoD:** salidas en `evidencia/antes/`; rojos previos clasificados (regla 80.4) en `PLAN.md`; `playwright test playwright/correcciones-2026-10-23-kill-tests.spec.ts --grep "@leo"` contra `real-api` con su salida pegada.
**Estado:** TODO

#### H1.S1 — Corte, rama y baseline

**CA:** Dado un rojo posterior, cuando alguien pregunta si lo rompiste vos, entonces la respuesta sale de un archivo.
**DoD:** `lint`, `typecheck` y `test` con código de salida, pegados; rojos previos clasificados.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H1.S1.M1 | Fijar corte y rama en los tres repos | Hay SHA y rama en `PLAN.md` | `git fetch origin && git rev-parse origin/dev && git branch --show-current` ×3 | TODO |
| H1.S1.M2 | Baseline del front | Salida y exit code | `corepack yarn lint; echo exit=$?; corepack yarn typecheck; echo exit=$?; corepack yarn test --watch=false` → `evidencia/antes/` | TODO |
| H1.S1.M3 | Baseline del móvil | Salida y exit code | `flutter analyze; flutter test` → `evidencia/antes/` | TODO |
| H1.S1.M4 | Levantar la API real y el front `real-api` | `/readiness` 200 y login del paciente E2E | `docker compose up -d && yarn seed:e2e` (API) · `corepack yarn start:real-api` (front) · captura del login | TODO |

#### H1.S2 — Tus kill-tests, en rojo

**CA:** Dado el front contra la API real, cuando corrés tus pruebas de la suite, entonces cada una falla por el motivo que dice la verificación, y ninguna por un error de la prueba.
**DoD:** `corepack yarn pw playwright/correcciones-2026-10-23-kill-tests.spec.ts --grep "@leo" --reporter=list` → `evidencia/antes/kill-tests-leo.txt`.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H1.S2.M1 | Correr `--grep "@leo"` contra `real-api` | Hay salida con cada prueba y su motivo | comando de arriba; salida en `evidencia/antes/` | TODO |
| H1.S2.M2 | Clasificar cada rojo: «producto» (esperado) vs «test» (arreglar la prueba) | Tabla en `PLAN.md` | tabla con una fila por prueba | TODO |
| H1.S2.M3 | Publicar en el daily de equipo los contratos que consumís y que todavía no existen (C-05, C-06, C-10) | Fila en §4-bis del daily por cada uno | daily actualizado | TODO |

### H2 — KYC: el administrador decide, no el mock

**Prioridad:** `BLOQUEANTE`

**CA:** Dado un paciente que sube carnet (frente y dorso) y las tres poses, cuando el caso llega al portal admin, entonces un administrador ve las cinco imágenes y lo acepta o rechaza **con un botón y un motivo**; hasta que lo hace, el caso sigue «en revisión» aunque pasen horas; al aceptarlo el paciente ve «Identidad validada» y su `patientCode`, y al rechazarlo ve el motivo y puede volver a enviar.
**DoD:** `test('PA-01 …')` de la suite en verde contra la API real con el mock levantado con `AUTO_DECIDE=false`; test de API del worker que recibe `PENDING` y **no** cierra el caso; capturas del caso en el portal admin (tres viewports, dos temas) con las imágenes **enmascaradas** en la evidencia.
**Estado:** TODO

#### H2.S1 — El módulo de identidad del mock, en puertos y adaptadores (C-07)

**CA:** Dado `POST /identity-verification/execute` con las referencias de las cinco evidencias, cuando nadie decidió, entonces `verify` responde `PENDING` indefinidamente con `AUTO_DECIDE=false`; dado `POST /backoffice/cases/:id/decision {decision, reason}`, entonces `verify` responde `ACCEPTED` o `REJECTED` con el motivo; dado un `subjectRef` desconocido, 404; dado un body sin las cinco referencias, 422.
**DoD:** `yarn test` del mock con los tres niveles (correcto, límite, inválido); Swagger en `/docs` muestra las rutas nuevas; el estado sobrevive a un reinicio del mock (SQLite en `MOCK_STATE_DIR`).
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H2.S1.M1 | Reestructurar `src/identity-verification` en `domain/`, `application/ports/`, `application/use-cases/`, `infrastructure/adapters/`, `presentation/` sin cambiar el contrato actual | Los tests existentes del mock siguen en verde | `cd mock-provider-server && yarn test` → verde | TODO |
| H2.S1.M2 | Puerto `CaseStorePort` + adaptador SQLite (`better-sqlite3`) con `MOCK_STATE_DIR` | Un caso creado sobrevive a `kill` + `start` | script en `evidencia/`: crear, reiniciar, consultar | TODO |
| H2.S1.M3 | `execute` acepta `evidence: { documentFrontRef, documentBackRef, livenessCenterRef, livenessLeftRef, livenessRightRef }` (referencias opacas) y los guarda | Falta una → 422 con el nombre del campo | test «inválido» | TODO |
| H2.S1.M4 | `AUTO_DECIDE` (default `false`): con `false`, `verify` es `PENDING` hasta la decisión; con `true`, conserva el comportamiento viejo del delay | test «límite»: 11 s con `AUTO_DECIDE=false` sigue `PENDING` | test | TODO |
| H2.S1.M5 | `GET /backoffice/cases?status` y `POST /backoffice/cases/:id/decision { decision: 'ACCEPTED'\|'REJECTED', reason }` (reason obligatorio al rechazar) | 404 desconocido · 422 sin motivo · 409 ya decidido | tests + Swagger | TODO |
| H2.S1.M6 | `.env.example`, `README.md` del mock y `docker-compose.yml` (servicio `mock-provider-server`) con las variables nuevas | `docker compose config` sin error | `docker compose config | grep AUTO_DECIDE` | TODO |

#### H2.S2 — El worker ya no auto-verifica

**CA:** Dado un check despachado, cuando el proveedor responde `PENDING`, entonces el worker **reintenta** con backoff y el caso sigue IN_VERIFICATION; cuando responde `ACCEPTED`, cierra por `settleCase`; cuando responde `REJECTED`, el caso pasa a REJECTED con el motivo visible para el paciente.
**DoD:** `yarn test src/worker/jobs/identity_assurance` en verde con los tres casos; `yarn test:integration` del módulo en verde.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H2.S2.M1 | `mock-identity-verification-provider.adapter.ts` manda las cinco referencias de evidencia (ids de `common.files`, nunca el contenido) | El body del `execute` tiene los cinco campos | test unitario del adaptador | TODO |
| H2.S2.M2 | `dispatch-identity-checks.job.ts`: `PENDING` → reintento con backoff hasta `IDENTITY_CHECK_MAX_WAIT_HOURS` (default 72, el TTL del caso), sin cerrar | Test: 3 `PENDING` seguidos → caso sigue IN_VERIFICATION | `yarn test` del job | TODO |
| H2.S2.M3 | `REJECTED` con `reason` → el motivo llega a `identity_check_results.detail` y al caso | El paciente lo lee por `GET identity/me/verification-cases/:id` | test de integración | TODO |
| H2.S2.M4 | Quitar el aviso «todo se auto-acepta» de `worker/bootstrap.ts:149-162` **sólo** si `AUTO_DECIDE` está apagado del lado del mock (lo lee de la respuesta de `/health` del mock) | El log dice qué modo está activo | arranque del worker, log pegado | TODO |

#### H2.S3 — El portal admin decide con un botón

**CA:** Dado un caso IN_VERIFICATION o MANUAL_REVIEW, cuando el administrador abre `/administration/identity-assurance/cases/:caseId`, entonces ve las cinco evidencias con su etiqueta y dos botones «Aceptar identidad» y «Rechazar»; «Rechazar» abre un diálogo que exige motivo; al confirmar, la pantalla muestra el estado nuevo sin recargar y la cola lo saca de «pendientes».
**DoD:** `test('PA-01 admin acepta con un botón')` en verde; unit spec de `case-detail` con los dos caminos; capturas 1440/768/390 claro y oscuro.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H2.S3.M1 | `IdentityAdminClient.decidir(caseId, decision, reason)` que encadena `manual-review` (si hace falta) + `decision` en una sola llamada del front | Una llamada del componente, dos del cliente | spec del cliente con `HttpTestingController` | TODO |
| H2.S3.M2 | Botones «Aceptar identidad» / «Rechazar» en `case-detail.html` (ícono + texto, ADR-0012) y diálogo de motivo con `content-dialog` | Rechazar sin motivo no envía | spec del componente | TODO |
| H2.S3.M3 | Estados S1–S9 del caso: cargando, sin evidencias, en revisión, decidido, error con `requestId` | Cada estado tiene su `data-testid` | spec + captura | TODO |
| H2.S3.M4 | La cola (`queue`) filtra por «pendientes de decisión» por defecto y muestra la antigüedad del caso (S7) | Columna «Hace» visible | captura | TODO |
| H2.S3.M5 | Simulador: `identity.handlers.ts` responde el mismo contrato que la API para que `start:demo` pinte igual | `start:demo` recorre aceptar y rechazar | captura contra demo (`VERIFIED_FUNCTIONAL_ONLY`) | TODO |

#### H2.S4 — El paciente ve en qué está su identidad (web y móvil)

**CA:** Dado un paciente con un caso abierto, cuando entra a `/my-account/identity`, entonces ve «En revisión» con la fecha de envío; si fue rechazado ve el motivo y «Volver a enviar»; si fue aceptado ve «Identidad validada» y su `patientCode`.
**DoD:** `test('PA-01 paciente ve el estado y el patientCode')` en verde; widget test del móvil con los tres estados.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H2.S4.M1 | Tarjeta de estado en `identity-hub` con los tres estados y la próxima acción (S3) | `data-testid="identidad-estado"` con el texto | spec + captura | TODO |
| H2.S4.M2 | «Volver a enviar» reabre la captura con las cinco evidencias (409 «caso vivo» no debe aparecer: el rechazado no es vivo) | Segundo envío tras rechazo → 201 | prueba contra API real | TODO |
| H2.S4.M3 | Móvil: `IdentityStatusCard` con los tres estados y «Volver a enviar» | `flutter test test/features/identity` verde | salida pegada | TODO |
| H2.S4.M4 | Actualizar `playwright/support/identidad.ts` al contrato de cinco evidencias (hoy usa `evidenceFileId`) | `abrirCaso` sube cinco archivos | la prueba de PA-01 lo usa | TODO |

### H3 — La barra superior del paciente (web)

**Prioridad:** `ALTA`

**CA:** Dado un paciente, cuando mira la cabecera, entonces **no** hay botón de emergencia ni enlace «Tutoriales»; «Mis facturas» y «Mis gastos» son una sola entrada que abre `/my-account/spending` con pestañas «Resumen» y «Movimientos»; «Promociones» no está y el carrito tiene una pestaña «Promociones» sin mapa; `/tutorials`, `/my-account/invoices` y `/my-account/promotions` redirigen a su destino nuevo; para la médica la cabecera no cambia salvo Tutoriales.
**DoD:** `test('PA-03 …')` ×4 en verde; `shell-layout.spec.ts`, `navigation.*.spec.ts` y `promociones-arriba.mjs` corregidos (listas, no aserciones debilitadas) y en verde; capturas de la cabecera 1440/768/390 claro/oscuro, paciente y médica.
**Estado:** TODO

#### H3.S1 — Emergencia fuera de la cabecera (PA-03.a)

**CA:** Dado cualquier rol, cuando mira la cabecera, entonces no hay `boton-emergencia`; dado el triage con síntoma de alarma, el panel de emergencia sigue apareciendo.
**DoD:** `test('PA-03.a sin Emergencia en la cabecera')` verde; `panic-button.spec.ts` sigue verde (el componente vive, cambia de lugar).
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H3.S1.M1 | Quitar `<app-panic-button />` de `shell-layout.html:274` y su import si queda huérfano | `grep -n panic-button shell-layout.html` = 0 | grep + spec | TODO |
| H3.S1.M2 | Corregir `shell-layout.spec.ts` (lista cerrada de controles de la cabecera) | Spec en verde sin `skip` | `ng test --include=**/shell-layout.spec.ts` | TODO |
| H3.S1.M3 | Confirmar con captura que el panel del triage sigue (Q-L1) | Captura en `evidencia/` | captura | TODO |

#### H3.S2 — Tutoriales dentro de Ajustes (PA-03.b)

**CA:** Dado `/settings`, cuando el paciente abre la pestaña «Tutoriales», entonces ve el centro de tutoriales (`TutorialsCenter`) embebido; `/tutorials` redirige a `/settings?tab=tutoriales` conservando el foco accesible.
**DoD:** `test('PA-03.b Tutoriales en Ajustes')` verde; `tutorials-center.spec.ts` verde.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H3.S2.M1 | Pestaña «Tutoriales» en `settings.html` con `TutorialsCenter` proyectado | La pestaña existe para todos los roles | spec de settings | TODO |
| H3.S2.M2 | Quitar el enlace `header-tutoriales` (`shell-layout.html:440-450`) y la fila `tutorials` del registro; `RUTAS_HEREDADAS['tutorials'] = '/settings?tab=tutoriales'` | `/tutorials` → redirige | prueba Playwright | TODO |
| H3.S2.M3 | Corregir `shell-layout.spec.ts:1073-1155` (N-01) | Verde | `ng test` | TODO |

#### H3.S3 — Mis facturas como «Resumen» de Mis gastos (PA-03.c)

**CA:** Dado el paciente, cuando abre Mis gastos, entonces ve la tarjeta a lo ancho con pestañas «Resumen» (las facturas, lo que hoy es `/my-account/invoices`) y «Movimientos» (lo que hoy es `spending`); `/my-account/invoices` redirige a `?pestana=resumen` sólo para el paciente; los demás roles conservan Mis facturas.
**DoD:** `test('PA-03.c Resumen dentro de Mis gastos')` verde; `my-invoices.spec.ts` y `spending.spec.ts` verdes.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H3.S3.M1 | `spending` con `app-tabs` «Resumen» / «Movimientos»; «Resumen» proyecta el componente de `my-invoices` sin duplicar lógica | Un componente, dos usos | spec | TODO |
| H3.S3.M2 | Cabecera: una sola entrada «Mis gastos» para el paciente; «Mis facturas» sólo para roles no paciente (Q-L2) | `header-facturas` ausente como paciente, presente como médica | `test('PA-03.c …')` | TODO |
| H3.S3.M3 | Redirección `my-account/invoices` → `my-account/spending?pestana=resumen` condicionada al rol en un guard de redirección | Paciente redirige; médica no | prueba Playwright con dos roles | TODO |
| H3.S3.M4 | Corregir `shell-layout.spec.ts:1285-1339` | Verde | `ng test` | TODO |

#### H3.S4 — Promociones dentro del Carrito, sin mapa (PA-03.d)

**CA:** Dado el paciente, cuando abre el carrito, entonces hay pestañas «Carrito» y «Promociones»; la de promociones **no** tiene `promociones-mapa`; `/my-account/promotions` redirige a `?pestana=promociones`; el ícono «Promociones» ya no está en la cabecera.
**DoD:** `test('PA-03.d Promociones en el carrito sin mapa')` verde; `promociones-arriba.mjs` reescrito a la nueva verdad; `cart-page.spec.ts` y `promotions.spec.ts` verdes.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H3.S4.M1 | `cart-page` con `app-tabs`; «Promociones» proyecta el listado actual de `promotions` **sin** `<app-department-map>` | `grep department-map promotions.html` = 0 | spec | TODO |
| H3.S4.M2 | Quitar `header-promociones` (`shell-layout.html:532-542`) y redirigir la ruta | Redirige | Playwright | TODO |
| H3.S4.M3 | Avisar a Richard por el daily: el marketplace (R-H6) se monta **dentro** de esta pestaña; vos dejás el `slot` | Fila en el daily | daily | TODO |
| H3.S4.M4 | Corregir `shell-layout.spec.ts:521-524,1220-1279` y `promociones-arriba.mjs` | Verdes | `ng test` + `node playwright/promociones-arriba.mjs` | TODO |

### H4 — La tabla de permisos del paciente (PA-08)

**Prioridad:** `ALTA`

**CA:** Dado un paciente con pedidos de acceso, cuando abre «Permisos» desde el menú, entonces ve una tabla con una fila por pedido y sección: médico, área (especialidad), sección de la historia (Análisis clínico, Enfermedades activas, Histórico…), sistema del cuerpo, fase, fecha, estado (Pedido / Concedido / Rechazado / Revocado) y el motivo; al final de cada fila «Conceder», «Rechazar» (pide motivo) y, si está concedido, «Revocar» (pide motivo); la tabla vacía dice por qué y qué hacer.
**DoD:** `test('PA-08 tabla de permisos con secciones y motivo')` en verde contra la API real con C-05 publicado (o contra el doble declarado hasta entonces, y **re-verificado** cuando llegue); capturas con el plegado móvil; `access-requests.spec.ts` y `clinical-access.spec.ts` actualizados.
**Estado:** TODO

#### H4.S1 — Cliente y doble de C-05

**CA:** Dado el contrato C-05, cuando Pablo publica el DTO, entonces tu cliente compila sin cambios de forma; hasta entonces, el simulador responde los tres niveles (correcto, límite: 50 secciones, inválido: rechazo sin motivo → 422).
**DoD:** spec del cliente; manejadores del simulador con los tres niveles declarados en el reporte.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H4.S1.M1 | `core/data-access/consent/consent.client.ts`: `misPedidos()`, `decidir(id, {decision, authorizedSectionConceptIds, reasonText})`, `revocar(consentId, reasonText)`, catálogos de sección y sistema | Tipos calcados del contrato | spec con `HttpTestingController` | TODO |
| H4.S1.M2 | `consent.handlers.ts` del simulador: los tres niveles | Rechazo sin motivo → 422 | spec del handler | TODO |

#### H4.S2 — La pantalla

**CA:** Dado el menú del paciente, cuando toca «Permisos», entonces llega a `/my-account/permissions` (la ruta vieja `access-requests` redirige) y ve la tabla; los diálogos de motivo atrapan el foco y lo devuelven; el estado no se transmite sólo por color.
**DoD:** `test('PA-08 …')` verde; axe sin violaciones en la tabla; capturas 1440/768/390 claro/oscuro.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H4.S2.M1 | Componente `permissions` con `app-data-table` (columnas de arriba, `MOBILE_DETAIL_PRIORITY`) en una tarjeta a lo ancho | Columnas presentes a 1440; plegado a 390 | captura | TODO |
| H4.S2.M2 | Acciones por fila con `content-dialog` de motivo (obligatorio en Rechazar y Revocar) | Confirmar sin motivo deshabilitado | spec | TODO |
| H4.S2.M3 | Estados S3 (vacío con «Nadie te pidió acceso todavía»), S5 error con `requestId`, S7 antigüedad | `data-testid` por estado | spec | TODO |
| H4.S2.M4 | Fila en el menú del paciente («Permisos», bajo Mi cuenta) y redirección de `access-requests` y `clinical-access` | Aparece en el menú | `navigation.*.spec` | TODO |
| H4.S2.M5 | Móvil: pantalla `PatientPermissionsScreen` con la misma tabla plegada a tarjetas | `flutter test` verde | salida | TODO |

### H5 — El inicio del paciente (PA-09.a/c/d)

**Prioridad:** `MEDIA`

**CA:** Dado el inicio del paciente, cuando termina el triage, entonces sólo hay el panel «Especialistas» (no la pestaña «Recomendar medicamentos»); la entrada principal muestra un saludo, la próxima acción y la próxima cita en una composición a lo ancho; los bloques que el cliente marcó como vacíos (confirmados con captura, Q-IMG) no están.
**DoD:** `test('PA-09.a sin recomendar medicamentos')` verde; capturas antes/después; `nova-patient-experience.spec.ts` actualizado.
**Estado:** TODO

#### H5.S1 — Panel de especialistas

**CA:** Dado un resultado del triage, cuando se muestra la orientación, entonces no existe el tab «Recomendar medicamentos» ni su callout, y `verProfesionales()` sigue llevando al directorio filtrado.
**DoD:** spec de `symptom-check` actualizado; prueba Playwright.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H5.S1.M1 | Quitar el tab y el bloque `:573-651` de `symptom-check.html`; el panel de especialistas deja de ser tab y pasa a sección | `grep medicamentosSugeridos symptom-check.html` = 0 | spec | TODO |
| H5.S1.M2 | Anotar en `docs/` que `medications-guide.data.ts` queda sin uso (9 entradas sin fuente) y abrir issue para borrarlo en otra oleada (fuera de alcance) | Nota escrita | archivo | TODO |

#### H5.S2 — Entrada principal y bloques vacíos (tras la captura)

**CA:** Dado el inicio, cuando Pablo adjunta las capturas de PA-09.c/d, entonces se identifican los bloques y se retiran o rediseñan; sin captura, esta subtarea queda `BLOQUEADO` por decisión de negocio (Q-IMG), no por ejecución.
**DoD:** capturas antes/después; `patient-home.spec.ts` verde.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H5.S2.M1 | Pedir las capturas en el daily y registrar la respuesta | Fila en el daily | daily | TODO |
| H5.S2.M2 | Rediseño del encabezado del inicio (saludo por nombre, próxima acción, próxima cita) en una tarjeta a lo ancho | Captura a 1440/768/390 | doble revisión | TODO |
| H5.S2.M3 | Retirar los bloques confirmados como vacíos | `grep` del selector = 0 | spec | TODO |

### H6 — La barra del paciente en el móvil (PA-03 en Flutter)

**Prioridad:** `ALTA`

**CA:** Dado el paciente en la app, cuando abre el cajón, entonces no hay «Emergencia»; hay «Ajustes» con «Ayuda y tutoriales» adentro; «Mis facturas» vive dentro de «Mis gastos» (pantalla nueva con pestañas); las promociones están en el carrito.
**DoD:** `flutter analyze` 0; `flutter test test/features/patient_shell test/features/patient_home test/features/settings` verde; capturas en simulador iOS y Android.
**Estado:** TODO

#### H6.S1 — Cajón, Ajustes y gastos

**CA:** Dado `patient_drawer.dart`, cuando se renderiza, entonces las filas son las nuevas y los widget tests lo fijan.
**DoD:** widget tests actualizados.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H6.S1.M1 | Quitar Emergencia de `patient_drawer.dart:90-92` y de `patient_home_screen.dart:401-404` (la ruta queda para el triage) | Tests del cajón verdes | `flutter test` | TODO |
| H6.S1.M2 | Pantalla `SettingsScreen` nueva (`features/settings/`) con «Ayuda y tutoriales» (reutiliza la pantalla de `/help`), tema y permisos | Ruta `/patient/settings` | test de widget | TODO |
| H6.S1.M3 | `SpendingScreen` con pestañas Resumen (facturas) / Movimientos contra `GET /patient-spending/me` (P44: si no existe, doble declarado y `A MEDIAS`) | Pestañas visibles | test | TODO |
| H6.S1.M4 | Promociones (`promotionsMe`) como pestaña de `pharmacy_cart_sheet` | Pestaña visible | test | TODO |

### H7 — El buzón de encuestas (PA-12)

**Prioridad:** `ALTA`

**CA:** Dado un paciente con invitaciones, cuando abre «Encuestas» desde el menú, entonces ve las pendientes agrupadas por tipo de partner (Médico, Farmacia, Laboratorio, Imagenología, Aseguradora) y por servicio, con las obligatorias primero y un contador en el menú; responder una la saca de pendientes.
**DoD:** `test('PA-12 buzón agrupado por partner y servicio')` verde contra C-06 (doble hasta que Pablo lo publique); móvil con la misma agrupación.
**Estado:** TODO

#### H7.S1 — Web

**CA:** Dado el DTO extendido de C-06, cuando llega, entonces la pantalla agrupa sin cambios de forma.
**DoD:** spec del componente con fixtures de los cinco tipos.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H7.S1.M1 | Sacar `fueraDelMenuPara` de la fila `questionnaires` (`navigation.map.ts:1357-1377`) para el paciente y renombrarla «Encuestas»; registrar en `docs/pendiente-decision-cuestionarios.md` que el documento del cliente resolvió la decisión | Aparece en el menú | `navigation.*.spec` | TODO |
| H7.S1.M2 | Agrupación por `partnerType` → `serviceLabel`, obligatorias arriba con insignia «Obligatoria» | Orden correcto con fixture | spec | TODO |
| H7.S1.M3 | Contador de pendientes en la fila del menú (como los chats) | Badge con N | spec | TODO |
| H7.S1.M4 | Simulador: `surveys-forms.handlers.ts` con los campos nuevos y los tres niveles | — | spec | TODO |

#### H7.S2 — Móvil

**CA:** Dado `questionnaires_screen.dart`, cuando hay invitaciones de varios partners, entonces se agrupan igual que en web.
**DoD:** widget test con fixture de tres partners.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H7.S2.M1 | Modelo con `partnerType`, `providerName`, `serviceLabel`, `mandatory` | Parse de JSON probado | test | TODO |
| H7.S2.M2 | Agrupación y orden en la pantalla | test de widget | `flutter test` | TODO |

### H8 — `/rx/:token`: la receta por enlace (PA-05, lado paciente)

**Prioridad:** `ALTA`

**CA:** Dado un enlace `/rx/<token>` (del QR o pegado desde WhatsApp), cuando lo abre el paciente prescrito con sesión, entonces ve su receta con los ítems y el botón «Dónde comprarla» que lleva a `where-to-buy` con esa receta; sin sesión, ve la pantalla de ingreso y al entrar vuelve al enlace; otro paciente ve «Este enlace no es tuyo»; vencido, ve el aviso de vencimiento.
**DoD:** `test('PA-05 /rx/<token> sólo para el paciente prescrito')` verde contra C-03 (Ender lo produce en su Ola 1; hasta entonces, doble declarado); app link probado en Android con `adb shell am start -a android.intent.action.VIEW -d "https://<dominio>/rx/<token>"`.
**Estado:** TODO

#### H8.S1 — Ruta, resolución y estados

**CA:** Dado `GET /rx/resolve/:token`, cuando responde 200 / 401 / 403 / 410, entonces la pantalla muestra el estado correspondiente.
**DoD:** spec del componente con los cuatro casos; Playwright con dos sesiones.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H8.S1.M1 | Ruta pública `rx/:token` que no exige sesión para **renderizar**, pero cuya resolución la exige (`?next=`) | Sin sesión → `/auth?next=/rx/<token>` | Playwright | TODO |
| H8.S1.M2 | Componente `rx-link` con S1 cargando, S5 403 «no es tuyo», S5 410 vencido (Q-L5), contenido con ítems | `data-testid` por estado | spec | TODO |
| H8.S1.M3 | «Dónde comprarla» → `where-to-buy/:requestId` (o el flujo por `prescriptionId` cuando Ender lo publique) | Navega con el id correcto | spec | TODO |
| H8.S1.M4 | Móvil: app link `https://<dominio>/rx/*` y esquema `alovida://rx/*` → `RxLinkScreen` con la misma resolución | `adb` abre la pantalla | captura | TODO |

### H9 — Verde, regresión y cierre

**Prioridad:** `ALTA`

**CA:** Dado el lote, cuando se corre la suite de kill-tests con `--grep "@leo"` contra la API real, entonces todas pasan; la regresión del front (`yarn test`), el móvil (`flutter test`) y los gates de diseño (`yarn gates:diseno`) están en verde; cada captura tiene sus dos pasadas; cada PR está mergeable.
**DoD:** salidas en `evidencia/despues/`; `evidencia/doble-revision.md`; `gh pr view … --json mergeable,mergeStateStatus` y `gh pr checks` pegados; `REPORTE.md` con avance calculado.
**Estado:** TODO

#### H9.S1 — Cierre

**CA:** Dado el `REPORTE.md`, cuando lo lee alguien que no vio la sesión, entonces sabe qué anda, qué no y qué falta exactamente.
**DoD:** `python .claude/hooks/report_gate.py --self-test` PASS; las tres secciones presentes.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H9.S1.M1 | Kill-tests `@leo` en verde contra `real-api` | 0 fallos | `corepack yarn pw … --grep "@leo"` → `evidencia/despues/` | TODO |
| H9.S1.M2 | Regresión front y móvil | Exit 0 | `yarn test --watch=false`; `flutter test` | TODO |
| H9.S1.M3 | Gates de diseño y accesibilidad en lo tocado | Exit 0 | `yarn gates:diseno`; axe en las pantallas nuevas | TODO |
| H9.S1.M4 | Doble revisión de todas las capturas | `evidencia/doble-revision.md` con nota por pantalla | archivo | TODO |
| H9.S1.M5 | PRs mergeables, uno por hito, con la salida de `gh` | `MERGEABLE` + `CLEAN`/`BLOCKED` sólo por revisión humana | salida pegada | TODO |
| H9.S1.M6 | `REPORTE.md` en cada repo tocado | Avance `HECHO / total` en la primera línea | `report_gate.py --self-test` | TODO |

## 5. Definition of Done del lote

El lote está `HECHO` sólo cuando **todo** esto es verdad, con salida pegada:

1. Los `test()` `@leo` de `playwright/correcciones-2026-10-23-kill-tests.spec.ts` pasan **contra la API real** (no contra el simulador).
2. `corepack yarn lint`, `typecheck`, `test` y `gates:diseno` del front en exit 0 (o con los rojos previos clasificados y sin ninguno nuevo); `flutter analyze` y `flutter test` en 0.
3. Ninguna aserción de la suite ni de los specs existentes fue debilitada; las listas cerradas se corrigieron.
4. Capturas por viewport y tema con las dos pasadas (`critical-double-review`), ninguna `RECHAZADA`.
5. Ningún dato personal ni imagen de evidencia sin enmascarar en logs, capturas ni reporte.
6. Cada PR `MERGEABLE`, fuera de draft, checks en verde, demostrado con `gh`.
7. `REPORTE.md` con Completado / A medias / Pendiente, avance calculado y «No cubierto».
