# M3 · Dell Inspiron 1 — encargo de preproducción (2026-09-26)

> **Estado:** `TODO` · **Eje:** API clínica, sin base de datos · **Carriles:** 3
> **Peldaño al repartir:** `DISCOVERED`. Nada de este encargo se ejecutó todavía.
>
> - Daily del reparto: [`Daily-Maquinas-2026-09-26.md`](../../Daily-Maquinas-2026-09-26.md)
> - Plan completo: [`planes/05-test-preproduccion-2026-09-26/README.md`](../../../../../planes/05-test-preproduccion-2026-09-26/README.md)
> - Hechos medidos: [`VERIFICACION-CONTRA-CODIGO-2026-09-26.md`](../../../../../docs/verificacion/VERIFICACION-CONTRA-CODIGO-2026-09-26.md)
> - Pedido del propietario: [`TEST-PREPRODUCCION-2026-09-26.md`](../../../../../docs/requisitos/TEST-PREPRODUCCION-2026-09-26.md)
> - **Cortes:** front `origin/test` @ `ec7037f7` · API `origin/test` @ `016caaa1` · modelo `origin/dev` @ `13dd040`

Sos la máquina **M3**. Trabajás en `mantra-core-health-api`, **sin base de datos**: tus
compuertas son `yarn typecheck`, `yarn lint` y `yarn test` (las unitarias mockean el
`EntityManager` y no tocan Postgres). La verificación de runtime la hace M1 cuando tu PR
entra — vos no la esperás.

Rama base: **`test`** (`016caaa1`). Un worktree por carril desde `origin/test`, un PR por
carril contra `test`. **No corras `yarn db:vendor`** hasta que M1 cierre D4.

Tu eje es **lo clínico**, que es el propósito central del producto: «el paciente es dueño
de su historia». Hoy ese propósito no está completo de punta a punta, y lo que falta es tuyo.

## Tu cola, en orden

### 1 · B5 — receta, alergias, adjuntos y aspectos médicos del paciente
Tres prompts que comparten módulo, así que van juntos:
- `docs/brechas-front-back-2026-09-24/prompts/BR-10-receta-completa.md` — prescriptor por
  sesión, motivo libre (`indication_text`), QR público, corrección, favoritas y las
  políticas D-05.
- `BR-11-alergias-y-adjuntos-clinicos.md` — **bloqueante**: registrar una alergia desde la
  consulta da 400 porque el DTO no declara `encounterId`, y faltan los cinco bindings de
  catálogo de alergia. Más los adjuntos de receta, alergia y encuentro.
- `BR-12-aspectos-medicos-del-paciente.md` — **bloqueante**: `GET|PUT /clinical/me/medical-aspects`
  no existe en la API **ni en el modelo**. Es la autodeclaración de salud del paciente.

Los tres **tocan el modelo**: `indication_text`, `encounter_id` en `allergy_intolerances`,
y una tabla o columna para los aspectos médicos (decisión D-B: tabla propia,
`health_context` o `forms` — proponé la que encaje con el patrón existente y registrala en
`docs/progress/DECISIONS.md`). El trabajo del modelo empieza en
`mantra-core-health-model` y lo coordinás con M1, que es quien regenera y vendoriza.
**Vos no escribís DDL en el repo de la API.**

Mientras el modelo no esté, avanzá el DTO, el servicio y el controlador contra la forma ya
acordada: el front tiene su simulador y no te espera.

### 2 · B6 — notas clínicas, encuentros, historia del paciente y PDF oficial
- `BR-13-notas-clinicas-firma-y-liberacion.md` — firmar, enmendar, liberar, autor por
  sesión, versiones e inmutabilidad. Ojo con CL-33: prohibir todo UPDATE en
  `clinical_note_versions` rompería `signVersion`; está planteado como decisión.
- `BR-14-encuentros-y-seguridad-clinica.md` — sello del cierre, acceso por paciente, CDS y
  lecturas del resumen. Incluye **N-02** (`POST /cds/evaluate` está abierto sin `@Roles`) y
  **N-03** (el motivo del cambio de estado de una condición, que es dato de salud, se
  escribe en texto plano en el log).
- `BR-15-historia-del-paciente-y-pdf-oficial.md` — que lo liberado se vea y que el PDF
  salga de la API. **N-05**: abrir al paciente el PDF del encuentro tal como está expondría
  borradores y documentos «solo para el profesional». **N-04**: ninguna lectura clínica
  escribe en `audit.data_access_log`.
- `BR-16-plan-de-cuidados-plantillas-y-documentos.md`.

### 3 · B8 — formularios dinámicos y editor de encuestas
- `BR-18-formularios-dinamicos.md` — opciones en el modelo, editar, quitar y ordenar, en
  una transacción. Decisión D-D: `value_set_id` por campo contra `options[]` libres.
  **`docs/pendientes-backend-formularios.md` dice que `options` «se ignora», y es falso:
  da 400.**
- `BR-19-editor-de-encuestas.md` — **bloqueante**: el editor de encuestas no existe en la
  API (faltan `PATCH`, `DELETE` y el orden de preguntas).

El motor de formularios **existe dos veces** (módulo 09 `forms` y módulo 65 `surveys`, este
último con editor en el front) y hay 43 plantillas de fichas clínicas sembradas. Extendés;
no clonás Google Forms.

## Reglas que no se negocian
- `corepack yarn`, nunca `npm`.
- **Antes de crear un endpoint, buscá el equivalente.** La validación global es
  `whitelist + forbidNonWhitelisted + transform`: todo campo que el front mande y el DTO no
  declare da 400, y ésa es la causa más común de las brechas que vas a cerrar.
- Un caso de uso = un servicio = una transacción. `row_version` → `@Version()`, nunca a mano.
  `<<LOG>>`/`<<IMMUTABLE>>`/`<<APPEND_ONLY>>` → sin update ni delete.
- No inventes FKs, columnas, valores de enum ni contratos que el modelo no declare. Lo no
  resuelto va como TODO explícito, no se adivina. Los conceptos van por `*_concept_id`.
- Nada se declara hecho por debajo de `REGRESSION_VERIFIED`. Como no tenés base, tu techo
  honesto es `TESTED`: decilo así en el REPORT y dejá dicho qué le falta correr a M1.
- Identificadores nuevos en inglés; prosa de pantalla en castellano.
