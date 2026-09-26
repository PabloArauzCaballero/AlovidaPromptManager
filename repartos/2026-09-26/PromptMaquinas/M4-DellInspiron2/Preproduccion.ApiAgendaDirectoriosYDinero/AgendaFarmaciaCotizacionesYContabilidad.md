# M4 · Dell Inspiron 2 — encargo de preproducción (2026-09-26)

> **Estado:** `TODO` · **Eje:** API de agenda, directorios y dinero, sin base de datos · **Carriles:** 3
> **Peldaño al repartir:** `DISCOVERED`. Nada de este encargo se ejecutó todavía.
>
> - Daily del reparto: [`Daily-Maquinas-2026-09-26.md`](../../Daily-Maquinas-2026-09-26.md)
> - Plan completo: [`planes/05-test-preproduccion-2026-09-26/README.md`](../../../../../planes/05-test-preproduccion-2026-09-26/README.md)
> - Hechos medidos: [`VERIFICACION-CONTRA-CODIGO-2026-09-26.md`](../../../../../docs/verificacion/VERIFICACION-CONTRA-CODIGO-2026-09-26.md)
> - Pedido del propietario: [`TEST-PREPRODUCCION-2026-09-26.md`](../../../../../docs/requisitos/TEST-PREPRODUCCION-2026-09-26.md)
> - **Cortes:** front `origin/test` @ `ec7037f7` · API `origin/test` @ `016caaa1` · modelo `origin/dev` @ `13dd040`

Sos la máquina **M4**. Trabajás en `mantra-core-health-api`, **sin base de datos**:
compuertas `yarn typecheck`, `yarn lint`, `yarn test`. La verificación de runtime la hace
M1 cuando tu PR entra; vos no la esperás.

Rama base: **`test`** (`016caaa1`). Un worktree por carril desde `origin/test`, un PR por
carril contra `test`. **No corras `yarn db:vendor`** hasta que M1 cierre D4.

Tu eje es **agenda, directorios y dinero**.

## Tu cola, en orden

### 1 · B10 — agenda
`docs/brechas-front-back-2026-09-24/prompts/BR-21-agenda-reglas-y-mostrador.md`. Cierra
AG-01, 04, 05, 08, 09, 10, 11, 12 y CV-18: horario flexible, retiro de horario con citas
vivas, walk-in, cupos y reprogramación por el paciente.

Dos hechos medidos que tenés que respetar:

- **La base no impide la doble reserva.** `SQL/41_scheduling/04_indexes.sql` tiene un solo
  índice único y cero `CHECK`, y `gist_appointments_practitioner_time` está **comentado**
  porque su predicado usa funciones placeholder que nunca se definieron. La garantía es sólo
  de servicio (`FOR UPDATE` + `assertRangoLibre()`) y **no cubre rangos que se pisan en
  cupos distintos**. Si tu carril necesita cerrarlo de verdad, empieza en el modelo y lo
  coordinás con M1.
- **El alta de cita del doctor ya está completa**: `POST /scheduling/appointments/direct`
  (AG-2), con paciente, modalidad, retracción de cupos y E2E propio. No lo reescribas.

Decisiones previas que arrancás pidiendo y registrás en `docs/progress/DECISIONS.md`:
**D-A** (¿«horario flexible» es un bloque con capacidad o un pedido de hora que el médico
confirma? Hoy no hay columna en el modelo y el simulador inventa `floor(dur/15)`) y
**D-G** (¿el mostrador del médico reserva por la vía hold sumando `PRACTITIONER`, o por
`appointments/direct`? Hoy da 403 — el rol lo agrega M2 en su carril B3).

### 2 · B12 — directorios públicos y farmacia
- `BR-23-directorios-publicos.md` — fichas de clínica y farmacia, sucursales, farmacias de
  turno y tendencias del muro. **Toca el modelo.** Decisión **D-F**: farmacias 24 h y de
  turno (P34) — ¿dato del modelo o calendario externo? Hoy `openNow` no lo calcula nadie.
- `BR-24-farmacia-sin-delivery.md` — mostrador, campañas, ficha de la empresa y fixtures.
  **Delivery y pasarela de pago están fuera de alcance por pedido**: donde aparezcan, se
  anotan como excluidos.

Tres cosas que ya existen y no se rehacen:
- «Dónde comprar la receta» está hecho: `GET /pharmacy-inventory/availability` devuelve
  `complete`, `missingProductIds`, `distanceKm` y `totalAmount`.
- `/directory` ya agrupa por especialidad. Copiar «la lógica de la red social» sería una
  regresión medida: esa versión agrupa parseando el titular por `·`.
- `GET /pharmacy/sites` y el filtro `pharmacyId` de `GET /pharmacy/products` se cerraron el
  25/09.

Deuda destapada que podés consolidar si te queda bien de alcance: `haversineKm` está
**triplicado** (`pharmacy_inventory`, `pharmacy/pharmacy-marketplace`, `pharmacy/pharmacy-read`),
los tres con la misma fórmula.

### 3 · B13 — cotizaciones y contabilidad del médico
`BR-25-cotizaciones-y-contabilidad.md`. Cierra AG-35 a 39 y AG-45.

- **Bloqueante AG-35:** ninguna cotización se guarda. Los importes viajan `number` contra
  `@IsNumberString` → 400.
- **N-06:** `billing.quotations` **no tiene `tenant_id`**, así que ninguna RLS por tenant la
  cubre; y hay un N+1 de cuotas en `listQuotationsByPatient`. El `tenant_id` empieza en el
  modelo: coordinalo con M1.
- **P35:** `POST /quotations` sin interés — fuera `interestRatePercent` y `/simulate`,
  entran `downPaymentAmount`, `paymentFrequency` e `installments` a medida.
- **Contabilidad ya existe y es grande:** módulo 16, 42 tablas, 42 entidades, 8
  controladores, pantalla en `/administration/accounting`. La partida doble valida con 422,
  la máquina `DRAFT→POSTED→REVERSED` está escrita y la precisión monetaria tiene patrón
  (`services/money.ts`). **Tu carril es exponer y completar, no crear.**
- **Ojo con la moneda:** `accounting.concepts.ts` declara `ACCT_CUR_PEN` y `ACCT_CUR_USD`,
  **sin boliviano**, en un producto boliviano cuyos seeds usan `CURRENCY_BOB`. Si lo
  corregís, decilo en el PR: es un cambio de dato, no de código.
- El `approve` de asientos hoy sólo lo alcanza `SUPERADMIN` porque falta
  `ACCOUNTING_APPROVER`: el rol lo agrega M2 (B3). Anotá el pedido en tu REPORT y seguí.

## Reglas que no se negocian
- `corepack yarn`, nunca `npm`.
- **Antes de crear un endpoint, buscá el equivalente.** La validación global es
  `whitelist + forbidNonWhitelisted + transform`: todo campo que el front mande y el DTO no
  declare da 400.
- **No escribas DDL en este repo.** Lo del modelo se coordina con M1.
- Estados y transiciones validados en el servidor, atómicos donde hay concurrencia.
  Acciones sensibles idempotentes si hay reintentos.
- No inventes FKs, columnas ni valores de enum. Los conceptos van por `*_concept_id`.
- Tu techo honesto sin base de datos es `TESTED`: decilo así en el REPORT y dejá dicho qué
  le falta correr a M1.
- Identificadores nuevos en inglés; prosa de pantalla en castellano.
