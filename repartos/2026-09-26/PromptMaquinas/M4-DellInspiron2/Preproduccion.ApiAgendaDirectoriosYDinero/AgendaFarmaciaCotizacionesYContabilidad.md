# M4 · Dell Inspiron 2 — encargo de preproducción (2026-09-26)

> **Estado del encargo:** `HECHO` al techo que fija el encargo (`TESTED`, sin base) · **Eje:** API de agenda, directorios y dinero, sin base de datos · **Hitos:** 3
> **AVANCE: 14 / 14 microtareas del encargo — 100,0 %** (+2 descubiertas en B10, también `HECHO`). **Peldaño alcanzado: `TESTED`** — no `VERIFIED`: lo que le falta correr a M1 está en §9.
> PRs contra `test`, **mergeados en `test`**: API [#470](https://github.com/mdavila-2001/mantra-core-health-api/pull/470) (B10 · H1) · [#471](https://github.com/mdavila-2001/mantra-core-health-api/pull/471) (B13 · H3) · [#472](https://github.com/mdavila-2001/mantra-core-health-api/pull/472) (B12 · H2).
>
> - Daily del reparto: [`Daily-Maquinas-2026-09-26.md`](../../Daily-Maquinas-2026-09-26.md)
> - Tu daily: [`M4-DellInspiron2-Daily-Maquinas-2026-09-26.md`](../M4-DellInspiron2-Daily-Maquinas-2026-09-26.md)
> - Plan completo: [`planes/05-test-preproduccion-2026-09-26/README.md`](../../../../../planes/05-test-preproduccion-2026-09-26/README.md)
> - Hechos medidos: [`VERIFICACION-CONTRA-CODIGO-2026-09-26.md`](../../../../../docs/verificacion/VERIFICACION-CONTRA-CODIGO-2026-09-26.md)
> - Pedido del propietario: [`TEST-PREPRODUCCION-2026-09-26.md`](../../../../../docs/requisitos/TEST-PREPRODUCCION-2026-09-26.md)
> - **Cortes:** front `origin/test` @ `ec7037f7` · API `origin/test` @ `016caaa1` · modelo `origin/dev` @ `13dd040`

Sos la máquina **M4**. Trabajás en `mantra-core-health-api` **sin base de datos**: compuertas
`yarn typecheck`, `yarn lint` y `yarn test`. La verificación de runtime la hace M1 cuando tu PR
entra; **vos no la esperás**.

Tu eje es **agenda, directorios y dinero**.

## 1. Antes de escribir una línea — instalación OBLIGATORIA del estándar

El estándar de la casa vive en `AlovidaPromptManager`. Instalalo en el repo donde vayas a
trabajar y **pegá la salida de los tres comandos** en tu daily. Un turno que arranca sin esto
arranca en `BLOQUEADO`, porque produce trabajo sin plan, sin evidencia y sin reporte — que
después hay que rehacer.

```bash
ls .claude/skills | wc -l
ls .claude/rules/[0-9]*.md | wc -l
python .claude/hooks/plan_gate.py --self-test
```

Entrá por **`skills-router`**, que es el índice: mapea la situación concreta a la skill que hay
que cargar y fija la precedencia cuando dos se contradicen. Con 178 skills, leer el catálogo
entero no sirve; el router sí.

**Las skills de este encargo:** `nestjs-development`, `mikroorm-patterns`, `appointment-scheduling`, `concurrency-and-locking`, `directories-public-profiles`, `quotations-billing`, `insurance-workflows`, `search-and-filtering`, `maps-geolocation`, `unit-testing`, `evidence-and-verification`, `anti-hallucination-guard`.

Los **hechos de cada proyecto** (comandos reales, invariantes del modelo, prohibiciones, rutas)
no viven en las skills: viven en el `CLAUDE.md` de ese repositorio, y **mandan sobre cualquier
skill**.

## 2. Resultado observable

La agenda rechaza el solapamiento que hoy deja pasar y permite retirar un horario con citas
vivas; las fichas de clínica y farmacia traen sus servicios, productos y sucursales; y las
cotizaciones **se guardan**, que hoy no pasa con ninguna.

**Kill-test:** mandar una cotización con importes tal como la arma el front. Si devuelve 400, no está
hecho. Y crear dos citas cuyos rangos se pisan en cupos distintos: si las acepta, tampoco.

## 3. Alcance

**IN:** `src/modules/scheduling/**`, `src/modules/public/**`, `src/modules/pharmacy/**`,
`src/modules/pharmacy_inventory/**`, `src/modules/billing/quotations` y
`src/modules/accounting/**`.

**OUT:** **no** tocás `clinical`, `charts`, `forms` ni `surveys` —son de M3—, **no** tocás
`authz` ni ningún `@Roles` existente —es de M2—, **no** escribís DDL, y **pasarela de pago y
delivery están excluidos por pedido**: donde aparezcan, se anotan como excluidos.

## 4. Contexto que no se deduce leyendo el repo

**Tu techo honesto sin base de datos es `TESTED`.** Decilo así en el reporte y dejá escrito qué
le falta correr a M1.

**Deuda destapada que podés consolidar si te entra en el alcance:** `haversineKm` está
**triplicado** en el repo (`pharmacy_inventory/services/pharmacy-inventory-read.service.ts`,
`pharmacy/services/pharmacy-marketplace.service.ts` y `pharmacy/services/pharmacy-read.service.ts`),
los tres con la misma fórmula. Se copió a propósito entre módulos reservados de carriles
distintos; consolidarlo es trabajo de otro turno, así que **si no entra, se registra y no se
toca**.

## 5. Plan

### H1 — La agenda deja de permitir lo que no debe

**CA:** Dadas dos citas cuyos rangos se pisan en cupos distintos, cuando se intenta crear la segunda, entonces el sistema la rechaza.
**DoD:** Las microtareas de H1 en `HECHO`, con las unitarias del solapamiento y del retiro en verde.
**Estado:** HECHO
**Peldaño:** `TESTED` (techo del encargo sin base; ver §9)

#### H1.S1 — Cerrar el solapamiento que hoy pasa

**CA:** Dado un rango que se pisa con otro en distinto cupo, cuando se reserva, entonces falla.
**DoD:** Las tres microtareas en `HECHO` con la unitaria pegada.
**Estado:** HECHO
**Peldaño:** `TESTED` (techo del encargo sin base; ver §9)

Medido: `SQL/41_scheduling/04_indexes.sql` tiene **un solo índice único y cero `CHECK`**, y
`gist_appointments_practitioner_time` está **comentado** porque su predicado usa funciones
placeholder que nunca se definieron. La garantía es **sólo de servicio** (`FOR UPDATE` +
`assertRangoLibre()`) y **no cubre rangos que se pisan en cupos distintos**. Cerrarlo de verdad
empieza en el modelo: coordinalo con M1.

| ID | Microtarea | Criterio de aceptación | Definition of Done | Estado |
|---|---|---|---|---|
| H1.S1.M1 | Escribir la prueba que hoy falla | reproduce el solapamiento | salida en rojo pegada | HECHO |
| H1.S1.M2 | Cubrirlo en el servicio | la prueba pasa | salida en verde pegada | HECHO |
| H1.S1.M3 | Pedir a M1 la exclusión en el modelo | el pedido queda escrito con su forma | pedido en el reporte | HECHO |

#### H1.S2 — Horario flexible, retiro y mostrador

**CA:** Dado un horario con citas vivas, cuando se lo retira, entonces la operación conserva los cupos con cita en vez de fallar con 409.
**DoD:** Las tres microtareas en `HECHO` con las unitarias pegadas.
**Estado:** HECHO
**Peldaño:** `TESTED` (techo del encargo sin base; ver §9)

**D-A no la resolvés vos:** ¿«horario flexible» es un bloque con capacidad o un pedido de hora
que el médico confirma? **No hay columna en el modelo** y el simulador inventa `floor(dur/15)`.
**D-G tampoco:** el mostrador del médico hoy da **403**, y el rol lo agrega M2. Anotá el pedido
y seguí.

**El alta de cita del doctor ya está completa** (`POST /scheduling/appointments/direct`, con
paciente, modalidad, retracción de cupos y E2E propio). **No la reescribas.**

| ID | Microtarea | Criterio de aceptación | Definition of Done | Estado |
|---|---|---|---|---|
| H1.S2.M1 | Registrar D-A y D-G con su forma propuesta | quedan en `DECISIONS.md` | enlace pegado | HECHO |
| H1.S2.M2 | Permitir retirar un horario con citas vivas | conserva los cupos con cita | unitaria pegada | HECHO |
| H1.S2.M3 | Dejar que el paciente reprograme | la ruta responde | unitaria pegada | HECHO |

### H2 — Los directorios públicos y la farmacia dicen la verdad

**CA:** Dada la ficha de una clínica o de una farmacia, cuando se consulta, entonces trae sus servicios o sus productos, y sus sucursales.
**DoD:** Las microtareas de H2 en `HECHO`, con las unitarias en verde y las rutas nuevas documentadas.
**Estado:** HECHO
**Peldaño:** `TESTED` (techo del encargo sin base; ver §9)

#### H2.S1 — Las lecturas que el front ya llama y no existen

**CA:** Dadas `o/:slug/services` y `f/:slug/products`, cuando el front las llama, entonces la API responde en vez de 404.
**DoD:** Las tres microtareas en `HECHO` con las unitarias pegadas.
**Estado:** HECHO
**Peldaño:** `TESTED` (techo del encargo sin base; ver §9)

**Tres cosas ya existen y no se rehacen:** «Dónde comprar la receta»
(`GET /pharmacy-inventory/availability` devuelve `complete`, `missingProductIds`, `distanceKm` y
`totalAmount`); `/directory` **ya agrupa por especialidad** —copiar «la lógica de la red social»
sería una **regresión medida**, esa versión agrupa parseando el titular por `·`—; y
`GET /pharmacy/sites` con el filtro `pharmacyId`, cerrados el 25/09.

**D-F no la resolvés vos:** farmacias 24 h y de turno — ¿dato del modelo o calendario externo?
Hoy `openNow` **no lo calcula nadie**.

| ID | Microtarea | Criterio de aceptación | Definition of Done | Estado |
|---|---|---|---|---|
| H2.S1.M1 | Agregar la lectura de servicios de una organización | responde con precio de referencia | unitaria pegada | HECHO |
| H2.S1.M2 | Agregar la de productos de una farmacia | responde con marca, precio y stock | unitaria pegada | HECHO |
| H2.S1.M3 | Registrar D-F | queda en `DECISIONS.md` | enlace pegado | HECHO |

### H3 — Las cotizaciones se guardan y la contabilidad se puede alcanzar

**CA:** Dada una cotización con importes, cuando se envía tal como la arma el front, entonces se guarda en vez de dar 400.
**DoD:** Las microtareas de H3 en `HECHO`, con la unitaria del guardado en verde.
**Estado:** HECHO
**Peldaño:** `TESTED` (techo del encargo sin base; ver §9)

#### H3.S1 — El 400 que impide guardar cualquier cotización

**CA:** Dados importes numéricos, cuando llegan al DTO, entonces la validación los acepta.
**DoD:** Las tres microtareas en `HECHO` con la unitaria pegada.
**Estado:** HECHO
**Peldaño:** `TESTED` (techo del encargo sin base; ver §9)

**Bloqueante AG-35: ninguna cotización se guarda.** Los importes viajan `number` contra
`@IsNumberString` → **400**. Además **N-06**: `billing.quotations` **no tiene `tenant_id`**, así
que ninguna RLS por tenant la cubre —eso empieza en el modelo, coordinalo con M1— y hay un **N+1
de cuotas** en `listQuotationsByPatient`.

**P35:** fuera `interestRatePercent` y `/simulate`; entran `downPaymentAmount`,
`paymentFrequency` e `installments` a medida.

| ID | Microtarea | Criterio de aceptación | Definition of Done | Estado |
|---|---|---|---|---|
| H3.S1.M1 | Alinear el contrato de importes entre front y DTO | la petición del front se guarda | unitaria pegada | HECHO |
| H3.S1.M2 | Pedir a M1 el `tenant_id` de `quotations` | el pedido queda escrito | pedido en el reporte | HECHO |
| H3.S1.M3 | Resolver el N+1 de cuotas | una consulta, no N | consulta pegada | HECHO |

#### H3.S2 — Exponer la contabilidad que ya existe

**CA:** Dado el módulo contable, cuando se lo expone, entonces **no se crea nada que ya esté**.
**DoD:** Las dos microtareas en `HECHO` con el inventario de lo existente pegado.
**Estado:** HECHO
**Peldaño:** `TESTED` (techo del encargo sin base; ver §9)

**Contabilidad existe y es grande:** módulo 16, 42 tablas, 42 entidades, 8 controladores,
pantalla en `/administration/accounting`. La partida doble **ya valida con 422**, la máquina
`DRAFT→POSTED→REVERSED` está escrita y la precisión monetaria tiene patrón (`services/money.ts`).
**Tu carril es exponer y completar, no crear.**

**Ojo con la moneda:** `accounting.concepts.ts` declara `ACCT_CUR_PEN` y `ACCT_CUR_USD`, **sin
boliviano**, en un producto boliviano cuyos seeds usan `CURRENCY_BOB`. Si lo corregís, decilo en
el PR: es un cambio de dato, no de código.

El `approve` de asientos hoy **sólo lo alcanza `SUPERADMIN`** porque falta
`ACCOUNTING_APPROVER`: el rol lo agrega M2. Anotá el pedido y seguí.

| ID | Microtarea | Criterio de aceptación | Definition of Done | Estado |
|---|---|---|---|---|
| H3.S2.M1 | Inventariar qué del módulo 16 ya existe antes de tocar nada | la lista sale del código | `grep` y salida pegados | HECHO |
| H3.S2.M2 | Registrar el hallazgo de la moneda sin corregirlo por tu cuenta | queda en `DECISIONS.md` | enlace pegado | HECHO |


## 6. Ambigüedades registradas

Se **registran**, no se resuelven por conveniencia. Si una bloquea, se declara `BLOQUEADO` con
la evidencia y se sigue con lo que no dependa de ella.

| ID | Ambigüedad | Quién puede resolverla | Qué bloquea |
|---|---|---|---|
| Q-01 | D-A: ¿«horario flexible» es un bloque con capacidad o un pedido de hora que el médico confirma? | el propietario | H1.S2 |
| Q-02 | D-G: ¿el mostrador reserva por la vía hold sumando `PRACTITIONER`, o por `appointments/direct`? | el propietario / M2 | H1.S2 |
| Q-03 | D-F: farmacias 24 h y de turno — ¿dato del modelo o calendario externo? | el propietario | H2.S1 |
| Q-04 | La moneda del módulo contable no incluye el boliviano en un producto boliviano | el propietario | nada hoy: se registra, no se corrige por cuenta propia |

## 7. Definition of Done del encargo

Los tres hitos en `HECHO` con sus unitarias dirigidas en verde y su salida pegada, las cuatro
ambigüedades **registradas**, los pedidos a M1 y a M2 escritos con su forma, y el reporte diciendo
explícitamente `TESTED` —no `VERIFIED`— con lo que le falta correr a M1.

## 8. Reglas que no se negocian

- `corepack yarn`, nunca `npm`.
- **Nada se declara hecho por debajo de `REGRESSION_VERIFIED`.** La evidencia va a
  `docs/progress/evidence/lane-<id>/REPORT.md` con los comandos y su **salida literal pegada**.
  Compilar no es verificar; «debería funcionar» es FAIL.
- **No inventar.** Antes de crear una entidad, tabla, endpoint o componente, localizá el
  equivalente **por código**. «Seguramente ya hay algo así» no es evidencia.
- **Diff mínimo.** Nada de refactors ni renombres fuera de lo pedido.
- Identificadores nuevos en **inglés**; prosa de pantalla en **castellano rioplatense**.
- Si tocás datos de personas, `data-privacy-phi` aplica aunque nadie lo haya pedido.
- **No escribís DDL en el repo de la API.** Si falta una tabla o una columna, el trabajo empieza
  en `mantra-core-health-model` (`.puml` → `gen_ddl.py` → `SQL/`) y lo coordinás con M1. Nada de
  `CREATE TABLE`, nada de archivos de migración.
- **No corras `yarn db:vendor`** hasta que M1 cierre H3: hoy borra cuatro patches.
- Antes de crear un endpoint, **buscá el equivalente**. La validación global es
  `whitelist + forbidNonWhitelisted + transform`: todo campo que el front mande y el DTO no
  declare da **400**, y ésa es la causa más común de las brechas que vas a cerrar.
- Los conceptos van por `*_concept_id`. Sin enums de TS inventados, sin labels hardcodeados.
- Estados y transiciones validados **en el servidor**, atómicos donde hay concurrencia.
- Acciones sensibles **idempotentes** si hay reintentos.

## 9. Cierre del encargo (M4 · 2026-09-26)

Tres carriles, uno por hito, cada uno con rama propia desde `origin/test`, PR contra `test`, y su
`PLAN.md` / `REPORT.md` / `DECISIONS.md` / `evidencia/` en `docs/progress/evidence/lane-<id>/` del repo de la
API.

| Hito | Carril | PR | Micro | Compuertas | Reporte |
|---|---|---|---:|---|---|
| H1 | B10 | [#470](https://github.com/mdavila-2001/mantra-core-health-api/pull/470) | 6/6 (+2) | typecheck 0 · lint 0 · `scheduling` 507/507 | `docs/progress/evidence/lane-B10/REPORT.md` |
| H2 | B12 | [#472](https://github.com/mdavila-2001/mantra-core-health-api/pull/472) | 3/3 | typecheck 0 · lint 0 · `public\|community\|pharmacy\|billing\|wiring` 902/902 | `docs/progress/evidence/lane-B12/REPORT.md` |
| H3 | B13 | [#471](https://github.com/mdavila-2001/mantra-core-health-api/pull/471) | 5/5 | typecheck 0 · lint 0 · `quotation\|billing\|accounting` 284/284 | `docs/progress/evidence/lane-B13/REPORT.md` |

**Hallazgos que corrigen la verificación del 26/09:**

- **Kill-test de H1.** Los caminos que **crean** una cita (confirmar, solicitar, aceptar, directa, walk-in) **ya** corrían
  `assertRangoLibre`, que compara rangos en cualquier cupo del profesional. El que ocupaba un rango sin preguntar era
  **reprogramar**, y ése se cerró (prueba roja → verde). Además, el guardia unía por `b.resource_id` (nulable) y dejaba
  invisibles algunas citas: ahora une por el recurso del cupo.
- **AG-35 no se reproduce.** Con el `ValidationPipe` global, el body del front con importes `number` **pasa** (la
  conversión implícita lo convierte a texto). El contrato funcionaba por accidente; ahora el DTO lo declara solo y está
  probado con y sin esa opción, hasta el guardado.
- **`haversineKm` son cuatro copias, no tres** (la cuarta está en `community`). Queda registrado y no se tocó.
- **`app.module.wiring.spec.ts` no ve un módulo sin `imports`.** Se esquivó en el módulo nuevo y se reportó.

**Lo que le falta correr a M1 (de `TESTED` a `VERIFIED`):** está detallado en cada `REPORT.md`. En resumen: reprogramar
encima de otra cita → 422; retiro con citas vivas → 200 con `liveBookingIds`; cerrar un cupo uuid5 → 200; `POST
/quotations` con el body del front → 201 y `SELECT` de los importes; `curl` sin token a las dos fichas y ver
`Mapped {…}` en el arranque.

**Pedidos escritos, con su forma:**

- **A M1:** la exclusión en el modelo para citas que se pisan (H1.S1.M3) y `tenant_id` en `billing.quotations`
  (H3.S1.M2).
- **A M2:** decidir D-G y sembrar `ACCOUNTING_APPROVER`, que hoy `role-mapping.ts` descarta.

**Ambigüedades registradas, sin resolver:** Q-01 (D-A), Q-02 (D-G), Q-03 (D-F) y Q-04 (moneda). Además: Q-05
(«sin precio»), Q-06 (el contrato del retiro: el CA del encargo contra BR-21) y Q-07 (AG-35).

