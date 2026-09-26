# M3 · Dell Inspiron 1 — encargo de preproducción (2026-09-26)

> **Estado del encargo:** `TODO` · **Eje:** API clínica, sin base de datos · **Hitos:** 3
> **Peldaño al repartir:** `DISCOVERED`. Nada de este encargo se ejecutó todavía.
>
> - Daily del reparto: [`Daily-Maquinas-2026-09-26.md`](../../Daily-Maquinas-2026-09-26.md)
> - Tu daily: [`M3-DellInspiron1-Daily-Maquinas-2026-09-26.md`](../M3-DellInspiron1-Daily-Maquinas-2026-09-26.md)
> - Plan completo: [`planes/05-test-preproduccion-2026-09-26/README.md`](../../../../../planes/05-test-preproduccion-2026-09-26/README.md)
> - Hechos medidos: [`VERIFICACION-CONTRA-CODIGO-2026-09-26.md`](../../../../../docs/verificacion/VERIFICACION-CONTRA-CODIGO-2026-09-26.md)
> - Pedido del propietario: [`TEST-PREPRODUCCION-2026-09-26.md`](../../../../../docs/requisitos/TEST-PREPRODUCCION-2026-09-26.md)
> - **Cortes:** front `origin/test` @ `ec7037f7` · API `origin/test` @ `016caaa1` · modelo `origin/dev` @ `13dd040`

Sos la máquina **M3**. Trabajás en `mantra-core-health-api` **sin base de datos**: tus compuertas
son `yarn typecheck`, `yarn lint` y `yarn test` — las unitarias mockean el `EntityManager` y no
tocan Postgres. La verificación de runtime la hace M1 cuando tu PR entra; **vos no la esperás**.

Tu eje es lo clínico, que es el propósito central del producto: «el paciente es dueño de su
historia». Hoy ese propósito **no está completo de punta a punta**, y lo que falta es tuyo.

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

**Las skills de este encargo:** `nestjs-development`, `mikroorm-patterns`, `clinical-records`, `medication-prescription-safety`, `data-privacy-phi`, `consent-management`, `error-handling-contract`, `unit-testing`, `evidence-and-verification`, `scope-discipline`, `anti-hallucination-guard`.

Los **hechos de cada proyecto** (comandos reales, invariantes del modelo, prohibiciones, rutas)
no viven en las skills: viven en el `CLAUDE.md` de ese repositorio, y **mandan sobre cualquier
skill**.

## 2. Resultado observable

Registrar una alergia desde la consulta deja de dar 400; la receta guarda su motivo escrito; el
paciente puede declarar sus aspectos médicos; las notas se firman, se enmiendan y se liberan; y
los formularios y las encuestas se pueden editar, reordenar y quitar.

**Kill-test:** mandar la petición de alergia que hoy da 400, tal como la arma el front. Si sigue
dando 400, no está hecho — y la unitaria en verde no alcanza para decir lo contrario.

## 3. Alcance

**IN:** `src/modules/clinical/**`, `src/modules/charts/**`, `encounter-pdf`,
`src/modules/forms/**` y `src/modules/surveys/**`.

**OUT:** **no** tocás `authz` ni ningún `@Roles` de endpoints existentes —es de M2; anotá el
rol que necesites y seguí—, **no** tocás `scheduling`, `pharmacy` ni `billing` —son de M4—, y
**no** escribís DDL.

## 4. Contexto que no se deduce leyendo el repo

**Tu techo honesto sin base de datos es `TESTED`.** Decilo así en el reporte y dejá escrito qué
le falta correr a M1. Afirmar `VERIFIED` con unitarias mockeadas sería exactamente la equivalencia
falsa que la regla 1.1 prohíbe: «un unitario pasa ≠ el flujo funciona».

**Tres de tus hitos tocan el modelo** (`indication_text`, `encounter_id` en
`allergy_intolerances`, y la tabla o columna de los aspectos médicos). El trabajo del modelo
empieza en `mantra-core-health-model` y lo regenera M1. Mientras tanto avanzás DTO, servicio y
controlador contra la forma acordada: **el front tiene su simulador y no te espera**.

## 5. Plan

### H1 — La receta y la alergia dejan de rebotar con 400

**CA:** Dado el registro de una alergia desde la consulta, cuando se envía con `encounterId`, entonces la API la acepta en vez de devolver 400.
**DoD:** Las microtareas de H1 en `HECHO`, con el DTO, el servicio y sus unitarias en verde.
**Estado:** TODO

#### H1.S1 — Alergia desde la consulta y sus adjuntos

**CA:** Dado el DTO de alergia, cuando declara `encounterId` y los cinco bindings de catálogo, entonces la petición completa pasa la validación.
**DoD:** Las tres microtareas en `HECHO` con la salida de las unitarias pegada.
**Estado:** TODO

**Bloqueante CL-01.** Hoy da 400 porque el DTO no declara `encounterId`, y faltan los cinco
bindings de catálogo de alergia. Toca el modelo: el `.puml` lo coordinás con M1. Mientras no
esté, avanzá DTO, servicio y controlador contra la forma ya acordada — el front tiene su
simulador y no te espera.

| ID | Microtarea | Criterio de aceptación | Definition of Done | Estado |
|---|---|---|---|---|
| H1.S1.M1 | Declarar `encounterId` en el DTO de alergia | la petición del front deja de dar 400 | unitaria pegada | TODO |
| H1.S1.M2 | Pedir a M1 los cinco bindings de catálogo | el pedido queda escrito con su forma | pedido en el reporte | TODO |
| H1.S1.M3 | Aceptar adjuntos de receta, alergia y encuentro | las dos rutas `:id/attachments` responden | unitaria pegada | TODO |

#### H1.S2 — La receta completa

**CA:** Dada una receta sin diagnóstico previo, cuando el médico escribe el motivo, entonces se guarda en `indication_text`.
**DoD:** Las dos microtareas en `HECHO` con las unitarias en verde.
**Estado:** TODO

P24 necesita `medication_requests.indication_text`, que **empieza en el modelo**. Además:
prescriptor por sesión, QR público, corrección, favoritas y las políticas D-05.

| ID | Microtarea | Criterio de aceptación | Definition of Done | Estado |
|---|---|---|---|---|
| H1.S2.M1 | Tomar el prescriptor de la sesión, no del cuerpo | un cuerpo con otro prescriptor no lo pisa | unitaria pegada | TODO |
| H1.S2.M2 | Aceptar el motivo libre | se persiste y se lee | unitaria pegada | TODO |

### H2 — El paciente puede declarar y leer sus aspectos médicos

**CA:** Dado `GET|PUT /clinical/me/medical-aspects`, cuando el paciente los consulta y los guarda, entonces la API responde en vez de 404.
**DoD:** Las microtareas de H2 en `HECHO`, con la decisión D-B registrada y las unitarias en verde.
**Estado:** TODO

#### H2.S1 — Elegir dónde vive el dato, y registrarlo

**CA:** Dada la decisión D-B, cuando se toma, entonces queda escrita en `docs/progress/DECISIONS.md` con su motivo.
**DoD:** Las dos microtareas en `HECHO` con la decisión registrada.
**Estado:** TODO

**Bloqueante CL-04 / CV-01: la ruta no existe en la API ni en el modelo.** D-B es una decisión
de producto: ¿tabla propia, `health_context` o `forms`? Proponé la que encaje con el patrón
existente, **registrala**, y no la resuelvas por conveniencia. Ojo con **N-09**: la RLS por
`custodian_tenant_id` choca con una declaración del paciente, que no pertenece a ningún tenant.

| ID | Microtarea | Criterio de aceptación | Definition of Done | Estado |
|---|---|---|---|---|
| H2.S1.M1 | Proponer y registrar D-B con su motivo | queda en `DECISIONS.md` | enlace pegado | TODO |
| H2.S1.M2 | Escribir las dos rutas contra esa forma | responden 200 | unitaria pegada | TODO |

### H3 — Las notas clínicas se firman, se enmiendan y se liberan

**CA:** Dada una nota firmada, cuando se intenta modificar su versión, entonces el sistema lo impide sin romper `signVersion`.
**DoD:** Las microtareas de H3 en `HECHO`, con las unitarias de los tres caminos en verde.
**Estado:** TODO

#### H3.S1 — Firma, enmienda y autor por sesión

**CA:** Dada una nota, cuando se firma, entonces el autor sale de la sesión y la versión queda inmutable.
**DoD:** Las tres microtareas en `HECHO` con las unitarias pegadas.
**Estado:** TODO

**CL-33 es una decisión, no una regla obvia:** prohibir todo UPDATE en
`clinical_note_versions` **rompería `signVersion`**. Planteala y registrala.
Y **N-04**: ninguna lectura clínica escribe en `audit.data_access_log`; sólo el break-the-glass.

| ID | Microtarea | Criterio de aceptación | Definition of Done | Estado |
|---|---|---|---|---|
| H3.S1.M1 | Tomar el autor de la sesión | un cuerpo con otro autor no lo pisa | unitaria pegada | TODO |
| H3.S1.M2 | Plantear y registrar la barrera WORM de CL-33 | queda en `DECISIONS.md` | enlace pegado | TODO |
| H3.S1.M3 | Dejar la lectura clínica auditada | la lectura escribe su registro | unitaria pegada | TODO |

#### H3.S2 — Formularios y encuestas editables

**CA:** Dado un formulario, cuando se edita, se reordena o se quita un campo, entonces la operación ocurre **en una transacción**.
**DoD:** Las tres microtareas en `HECHO` con las unitarias pegadas.
**Estado:** TODO

**Bloqueante CL-60: el editor de encuestas no existe en la API** (faltan `PATCH`, `DELETE` y el
orden de preguntas). El motor de formularios **existe dos veces** (módulo 09 `forms` y módulo 65
`surveys`, con editor en el front) y hay 43 plantillas sembradas: **extendés, no clonás Google
Forms**. Y ojo: `docs/pendientes-backend-formularios.md` dice que `options` «se ignora», y **es
falso: da 400**.

| ID | Microtarea | Criterio de aceptación | Definition of Done | Estado |
|---|---|---|---|---|
| H3.S2.M1 | Registrar la decisión D-D sobre las opciones | queda en `DECISIONS.md` | enlace pegado | TODO |
| H3.S2.M2 | Agregar editar, quitar y ordenar en `forms` | las tres rutas responden | unitaria pegada | TODO |
| H3.S2.M3 | Lo mismo en `surveys` | idem | unitaria pegada | TODO |


## 6. Ambigüedades registradas

Se **registran**, no se resuelven por conveniencia. Si una bloquea, se declara `BLOQUEADO` con
la evidencia y se sigue con lo que no dependa de ella.

| ID | Ambigüedad | Quién puede resolverla | Qué bloquea |
|---|---|---|---|
| Q-01 | D-B: ¿dónde viven los «aspectos médicos» del paciente — tabla propia, `health_context` o `forms`? | el propietario | H2 entero |
| Q-02 | D-D: ¿las opciones de un campo de elección son value sets por campo o una tabla de opciones? | el propietario | H3.S2 |
| Q-03 | CL-33: ¿se prohíbe todo UPDATE en `clinical_note_versions`, sabiendo que rompería `signVersion`? | el propietario | H3.S1 |
| Q-04 | N-09: cómo convive la RLS por `custodian_tenant_id` con una declaración del paciente, que no es de ningún tenant | el propietario / M1 | H2 |

## 7. Definition of Done del encargo

Los tres hitos en `HECHO` con sus unitarias dirigidas en verde y su salida pegada, las cuatro
ambigüedades **registradas** en `docs/progress/DECISIONS.md`, y el reporte diciendo explícitamente
`TESTED` —no `VERIFIED`— con la lista de lo que le falta correr a M1.

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
- Un caso de uso = un servicio = **una transacción**. `row_version` → `@Version()`, nunca a mano.
- `<<LOG>>` / `<<IMMUTABLE>>` / `<<APPEND_ONLY>>` → sin update ni delete.
