# M6 · Acer Aspire 3 — encargo de preproducción (2026-09-26)

> **Estado del encargo:** `TODO` · **Eje:** datos y calidad de la suite · **Hitos:** 4
> **Peldaño al repartir:** `DISCOVERED`. Nada de este encargo se ejecutó todavía.
>
> - Daily del reparto: [`Daily-Maquinas-2026-09-26.md`](../../Daily-Maquinas-2026-09-26.md)
> - Tu daily: [`M6-AcerAspire3-Daily-Maquinas-2026-09-26.md`](../M6-AcerAspire3-Daily-Maquinas-2026-09-26.md)
> - Plan completo: [`planes/05-test-preproduccion-2026-09-26/README.md`](../../../../../planes/05-test-preproduccion-2026-09-26/README.md)
> - Hechos medidos: [`VERIFICACION-CONTRA-CODIGO-2026-09-26.md`](../../../../../docs/verificacion/VERIFICACION-CONTRA-CODIGO-2026-09-26.md)
> - Pedido del propietario: [`TEST-PREPRODUCCION-2026-09-26.md`](../../../../../docs/requisitos/TEST-PREPRODUCCION-2026-09-26.md)
> - **Cortes:** front `origin/test` @ `ec7037f7` · API `origin/test` @ `016caaa1` · modelo `origin/dev` @ `13dd040`

Sos la máquina **M6**. **Nada de tu cola pide RAM ni base de datos**: son datos, generadores y la
calidad de la suite. Trabajás en `mantra-core-health-api` (un hito, Python),
`mantra-core-health` (tres) y leés `mantra-core-health-model`.

**Tus hitos H2 y H3 destraban a las otras cinco máquinas:** hoy ni la suite del front ni su lint
sirven como compuerta.

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

**Las skills de este encargo:** `python-tooling-standards`, `seed-data-catalogs`, `data-quality-validation`, `terminology-value-sets`, `anti-hallucination-guard`, `unit-testing`, `code-quality-gates`, `root-cause-debugging`, `visual-proof`, `evidence-and-verification`, `technical-debt-management`.

Los **hechos de cada proyecto** (comandos reales, invariantes del modelo, prohibiciones, rutas)
no viven en las skills: viven en el `CLAUDE.md` de ese repositorio, y **mandan sobre cualquier
skill**.

## 2. Resultado observable

Los doce markdown se siembran solos y de forma determinista; la suite del front da el mismo
resultado en dos corridas seguidas; `yarn lint` vuelve a exit 0; y un identificador nuevo en
castellano falla en CI.

**Kill-test:** correr la suite completa del front **dos veces seguidas sobre el mismo commit**. Si el
conjunto rojo cambia, no está hecho.

## 3. Alcance

**IN:** `mantra-core-health-api/tools/bolivia-datasets/extract_datasets.py` y los JSON que
emite; `mantra-core-health/src/test-setup.ts`, `vitest.config.ts`, los 201 archivos de
`features/alovida/**`, y un verificador nuevo en `scripts/`.

**OUT:** **no** tocás pantallas de producto, ni la lógica de ningún carril de las otras
máquinas, ni el `environment` del front —es de M5—, ni los seeds de personas —son de M2, vos sólo
emitís sus datasets—.

## 4. Contexto que no se deduce leyendo el repo

**Los repos de front y API son públicos; el del modelo es privado.** Por eso el JSON que emitís
**no lleva datos personales**: nombre y matrícula sí, cédula y domicilio no. Las personas las
siembra M2 leyendo el markdown **en el momento**, sin escribir nada a disco.

**El orden importa.** H1 es el que el propietario va a mirar primero —es su requisito 4—, pero H2
y H3 son los que destraban a las otras cinco. Si tenés que elegir, H2 primero: una suite que no es
determinista hace que nadie pueda cerrar nada con honestidad.

## 5. Plan

### H1 — Los doce markdown se siembran solos

**CA:** Dado `yarn seed:datasets`, cuando se corre dos veces, entonces `git diff --exit-code` pasa: el resultado es determinista y está al día.
**DoD:** Las microtareas de H1 en `HECHO`, con las dos corridas y el diff vacío pegados.
**Estado:** TODO

#### H1.S1 — Las siete listas que hoy no llegan

**CA:** Dado cada uno de los siete archivos que faltan, cuando se corre el extractor, entonces emite su JSON con procedencia.
**DoD:** Las cuatro microtareas en `HECHO` con los conteos por archivo pegados.
**Estado:** TODO

Hoy **sólo cinco** de los doce llegan a la API, por `tools/bolivia-datasets/extract_datasets.py`.
Faltan: clínicas privadas (30), hospitales de 2.º/3.º nivel y cajas (35), primer nivel (470),
farmacias y laboratorios (34), arancel odontológico (186, en dólares) y especialidades
odontológicas (14). Alianza y Nacional los usa M2, pero **su dataset lo emitís vos**.

**Dos referencias de las que se copia el mapeo, no se reinventa:**
`mantra-core-health-model/salud-db/gen_seeds.py` tiene `build_real_pharmacies` y
`build_real_labs_and_clinics`, con las direcciones **ya corregidas** del UTF-16 roto; y
`mantra-core-health/data/markdown-institutions/` **ya tiene coordenadas** de Nominatim con su
`precision` por punto — eso destraba «Cómo llegar» y «los más cercanos», que hoy no tienen
destino.

| ID | Microtarea | Criterio de aceptación | Definition of Done | Estado |
|---|---|---|---|---|
| H1.S1.M1 | Extraer las cuatro listas de instituciones | conteos = filas del `.md` | conteos pegados | TODO |
| H1.S1.M2 | Extraer el arancel odontológico y las especialidades | idem | conteos pegados | TODO |
| H1.S1.M3 | Adjuntar las coordenadas ya derivadas, con su `precision` | ningún punto inventado | muestra pegada | TODO |
| H1.S1.M4 | Poner procedencia en toda fila | `source_file` y `source_row` en todas | muestra pegada | TODO |

#### H1.S2 — Que se pueda comprobar en CI

**CA:** Dado `seed:datasets:check`, cuando corre sobre un árbol al día, entonces pasa; y si el JSON quedó viejo, falla.
**DoD:** Las dos microtareas en `HECHO` con las dos salidas pegadas.
**Estado:** TODO

**Tres cosas que NO hacés:** no corregís el OCR —el arancel médico viene de un PDF escaneado y
su propia hoja lo advierte («Anestesiblogos», «Térax», «cardiol6gico»); la fila viaja marcada
`ocr_sospechoso: true`, porque inventar la corrección es peor que el texto crudo—; **no inventás
códigos** ICD-10/SNOMED/LOINC/RxNorm/ATC ni coordenadas que el corpus no trae; y **no metés datos
personales** en el JSON: las personas las siembra M2 leyendo el markdown en el momento.

| ID | Microtarea | Criterio de aceptación | Definition of Done | Estado |
|---|---|---|---|---|
| H1.S2.M1 | Agregar el comando de comprobación | falla con el JSON viejo | salida pegada | TODO |
| H1.S2.M2 | Dejarlo listo para CI | corre sin el repo del modelo presente o lo dice | salida pegada | TODO |

### H2 — La suite del front vuelve a servir como compuerta

**CA:** Dadas dos corridas completas del mismo commit, cuando se comparan, entonces dan **el mismo resultado**.
**DoD:** Las microtareas de H2 en `HECHO`, con las dos corridas pegadas y el conjunto rojo restante explicado archivo por archivo.
**Estado:** TODO

#### H2.S1 — Encontrar la causa, no el síntoma

**CA:** Dado el primer error de cada worker, cuando se lo aísla, entonces se corrige **la causa**, no el timeout.
**DoD:** Las tres microtareas en `HECHO` con la traza del primer error pegada.
**Estado:** TODO

Medido: **17 y 11** suites rojas en dos corridas del mismo commit, con conjuntos distintos, y
`insurance-portability.handlers.spec.ts` falla completa y **pasa aislada**. Síntomas dominantes:
12 × `Cannot configure the test module when the test module has already been instantiated` y
6 × `Cannot read properties of undefined (reading 'verify')`.

**La causa está escrita en el propio `src/test-setup.ts`**, que ya arregló una instancia del
patrón: un throw en un hook marca fallada cada prueba del archivo **y deja el `TestBed`
instanciado**, así que los archivos que siguen **en el mismo worker** caen con un error ajeno.
Queda al menos una causa más; candidato visto: `TypeError: this.auth.userId is not a function`.

**No subas timeouts ni marques `skip`:** demostralo con la salida y arreglá la causa.

| ID | Microtarea | Criterio de aceptación | Definition of Done | Estado |
|---|---|---|---|---|
| H2.S1.M1 | Aislar el primer error de cada worker | la traza distingue causa de cascada | traza pegada | TODO |
| H2.S1.M2 | Corregir la causa | el archivo deja de envenenar a los que siguen | dos corridas pegadas | TODO |
| H2.S1.M3 | Explicar el rojo que quede, archivo por archivo | ninguno sin explicación | tabla pegada | TODO |

### H3 — `yarn lint` del front vuelve a exit 0

**CA:** Dado `yarn lint`, cuando corre sobre el front, entonces sale 0 y **ninguna pantalla portada cambió lo que muestra**.
**DoD:** Las microtareas de H3 en `HECHO`, con la salida en 0 y una foto por tanda.
**Estado:** TODO

#### H3.S1 — Los 244 mecánicos, por tandas y con foto

**CA:** Dada cada tanda, cuando se cambia, entonces hay una foto de una pantalla de esa tanda que muestra lo mismo que antes.
**DoD:** Las tres microtareas en `HECHO` con las fotos pegadas.
**Estado:** TODO

**Medido: 201 archivos byte a byte idénticos a `origin/mockup`**, o sea que el lint ya estaba
rojo ahí y el merge no introdujo ninguno. Reparto por regla:
`prefer-on-push-component-change-detection` 244 · `no-unused-vars` 4 · `no-empty-function` 2 ·
`array-type` 2.

**No es un `sed` a ciegas:** `OnPush` cambia **cuándo** se redibuja un componente. Esas 201
pantallas son **generadas** por `scripts/port-vistas-alovida.mjs` y son cascarón sin lógica
propia, así que el riesgo es bajo — pero si alguna tiene estado mutable sin señales, se rompe **en
silencio**.

**Si el generador es el dueño de esos archivos, arreglá el generador y regenerá**, no los
archivos: es la regla del proyecto.

| ID | Microtarea | Criterio de aceptación | Definition of Done | Estado |
|---|---|---|---|---|
| H3.S1.M1 | Decidir si se toca el generador o los archivos | la decisión queda escrita | enlace pegado | TODO |
| H3.S1.M2 | Cambiar por tandas, con foto de una pantalla por tanda | cada tanda tiene su foto | fotos pegadas | TODO |
| H3.S1.M3 | Cerrar los 8 errores que no son de `OnPush` | `yarn lint` sale 0 | salida pegada | TODO |

### H4 — Un identificador nuevo en castellano falla en CI

**CA:** Dado un diff con un identificador nuevo en castellano, cuando corre el verificador, entonces falla; y sobre el `test` actual, pasa.
**DoD:** Las microtareas de H4 en `HECHO`, con las dos salidas pegadas.
**Estado:** TODO

#### H4.S1 — Sobre el diff, no sobre el árbol

**CA:** Dado el árbol actual, cuando corre el verificador, entonces **no** reporta los identificadores viejos.
**DoD:** Las tres microtareas en `HECHO` con las dos salidas pegadas.
**Estado:** TODO

La regla 29 **no es tarea de una persona: es criterio de aceptación de los 36 carriles**. Toda
ruta, identificador, variable, columna, endpoint, clase y archivo **nuevo o tocado** va en inglés;
la prosa visible sigue en castellano.

Hacelo sobre **el diff del PR**: el repo tiene años de identificadores en castellano y **no es
este carril el que los migra**. Excepciones declaradas: `MantraRadius.firma` y
`MantraTypography.cifrasTabulares` nombran conceptos del manual REDSAT y **se quedan**.

**Ojo con las rutas:** `proxy.conf.json` compara prefijos **por inicio de ruta** y
`scripts/check-route-prefixes.mjs` lo verifica en CI. Ya mordió una vez: `/admin` se comió
`/administracion/pacientes`. Antes de proponer un renombre, comprobá que ningún prefijo la absorbe.

| ID | Microtarea | Criterio de aceptación | Definition of Done | Estado |
|---|---|---|---|---|
| H4.S1.M1 | Escribir el verificador sobre el diff | no reporta lo viejo | salida pegada | TODO |
| H4.S1.M2 | Declarar las excepciones del manual REDSAT | las dos siguen pasando | salida pegada | TODO |
| H4.S1.M3 | Probarlo con un identificador en castellano a propósito | falla | salida pegada | TODO |


## 6. Ambigüedades registradas

Se **registran**, no se resuelven por conveniencia. Si una bloquea, se declara `BLOQUEADO` con
la evidencia y se sigue con lo que no dependa de ella.

| ID | Ambigüedad | Quién puede resolverla | Qué bloquea |
|---|---|---|---|
| Q-01 | Si el generador `port-vistas-alovida.mjs` sigue siendo el dueño de los 201 archivos, o ya se editan a mano | el propietario / quien lo escribió | H3.S1: cambia si se arregla el generador o los archivos |
| Q-02 | Qué hacer con las filas del arancel marcadas `ocr_sospechoso` antes de producción | el propietario | nada hoy: viajan marcadas, no corregidas |
| Q-03 | Si las 64 ocupaciones provisionales se reemplazan por la COB-2023 (606) en este esfuerzo | el propietario | nada hoy: se registra |

## 7. Definition of Done del encargo

Los cuatro hitos en `HECHO`. `yarn seed:datasets` determinista con `git diff --exit-code` en
verde; **dos corridas completas de la suite con el mismo resultado**, y el rojo restante explicado
archivo por archivo; `yarn lint` en exit 0 con una foto por tanda; y el verificador de inglés
fallando ante un identificador en castellano y pasando sobre el `test` actual. Todo en
`docs/progress/evidence/`.

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
- **Los generadores se validan regenerando y diffeando**, nunca leyendo su código.
- **No debilites pruebas**: nunca `skip`, nunca borrar aserciones, **nunca subir un timeout sin
  demostrar por qué no llegó la condición**.
- **No corrijas el OCR** ni inventes códigos ni coordenadas. Lo que el corpus no trae, no se pone.
