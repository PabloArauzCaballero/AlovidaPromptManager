# Daily de Ender — turno noche — 2026-09-20

> **AVANCE: __ / 55 — __ %.** ← primera línea, siempre. Sale de `microtareas HECHO / 55`,
> **nunca a ojo**. `A MEDIAS` cuenta como **no hecha**. `DESCARTADO` no suma: se declara aparte con su motivo.

> **AVANCE: 27 / 55 — 49 %.** Sale de `microtareas HECHO / 55`, contadas una por una: H2 (8 de 9),
> H3 (8 de 9), H4 (8 de 9) y los 3 prerequisitos de H1 que si hacian falta. **Las 3 `A MEDIAS` no
> suman** — eran los dos avisos por el daily y el acuerdo con Justin; los avisos quedan **HECHO**
> con esta publicacion, el de Justin sigue `A MEDIAS` hasta que el responda. **H5 y H6 no se
> empezaron**, por orden de Ender.

- **Turno:** noche · **Fecha:** 2026-09-20 · **Persona:** Ender
- **Encargo:** [Los contratos que faltan y un panel que diga la verdad](Noche-CorreccionesDoctor.ContratosYPanel/CatalogosBloqueosPosologiaYPanel.md)
- **Correcciones que cubrís:** C-03, C-12 (contrato), C-13 (contrato), C-20 (catálogo), C-24
- **Fuente del pedido:** [`CORRECCIONES-DOCTOR-2026-09-20.md`](../../../docs/requisitos/CORRECCIONES-DOCTOR-2026-09-20.md)
- **Verificación contra el código:** [`VERIFICACION-CONTRA-CODIGO-2026-09-20.md`](../../../docs/verificacion/VERIFICACION-CONTRA-CODIGO-2026-09-20.md)
- **Tus archivos reservados:** `core/mock/**` · `features/dashboard/**` · `core/data-access/**` (menos `prescription-favorites/**`)

## 1. Lo primero — pegar acá la salida de la instalación del estándar

```text
$ ls .claude/skills | wc -l
180        # 176 del estandar + las 4 versionadas del propio repo de producto

$ ls .claude/rules/[0-9]*.md | wc -l
14

$ python .claude/hooks/plan_gate.py --self-test
plan_gate self-test: 11 PASS, 0 FAIL

$ python .claude/hooks/report_gate.py --self-test
report_gate self-test: 14 PASS, 0 FAIL

$ python .claude/hooks/blocker_gate.py --self-test < /dev/null
blocker_gate self-test: 11 PASS, 0 FAIL
```

> El `blocker_gate` se cuelga si se lo ejecuta a mano con `stdin` abierto: es un hook de `Stop`
> y se queda esperando el JSON del evento. Con `< /dev/null` corre y pasa.

El estandar quedo instalado **local y no versionado** (`.git/info/exclude`), y el
`settings.json` versionado del repo de producto **no se toco**: el cableado de hooks vive en
`.claude/settings.local.json`. `git status` del worktree no muestra ni un archivo del estandar.

**Un turno que arranca sin esto arranca en `BLOQUEADO`** (sección 1 del encargo).

- [ ] Leí `skills-router` y las skills de las dos tablas de mi encargo.
- [ ] Creé mi `PLAN.md` **antes** del primer `Edit`/`Write` de código.

## 2. El corte que fijaste

```text
$ git fetch origin && git log -1 --format='%H %ad %s' origin/mockup
0b40653231620bc3729043b0f06d6e3f10be5b39 Mon Sep 21 03:11:34 2026 -0400 Merge pull request #558 from mdavila-2001/marcelo/notas-cuadricula-e-internacion
```

**El corte del reparto quedo atras y mando el mio:** `689697821a6e...` (PR #554) sigue siendo
ancestro, pero `mockup` avanzo **6 commits** con los PR #557 (Justin) y #558 (Marcelo). Dentro
de mis archivos reservados lo unico que cambio es que Justin **borro**
`core/data-access/prescription-favorites/**`, que es suyo y esta excluido de mi lote: **cero
colision**.

**Ref de la API para citar contratos:** `origin/dev` = `c2c071a4`. **Solo lectura**, y no se
escribio una sola linea ahi.

## 3. Checkpoints — uno por apertura y por cierre de microtarea

Formato de la regla 50. **Prohibido encadenar más de 3 operaciones materiales sin checkpoint.**

```text
AVANCE — Ender — <fase> — <ID de microtarea>
- Hecho:      <qué quedó, concreto>
- Evidencia:  <comando / ruta / "ninguna todavía">
- Ahora:      <la siguiente acción, una sola>
- Bloqueo:    ninguno | <qué bloquea y de quién depende>
- Estado:     TODO | EN CURSO | HECHO | A MEDIAS | BLOQUEADO | DESCARTADO
- Peldaño:    UNKNOWN | DISCOVERED | WRITTEN | RUNS | TESTED | VERIFIED | REGRESSION_VERIFIED
```

<!-- Pegá tus checkpoints debajo de esta línea, el más reciente arriba. -->

```text
AVANCE — Ender — H4 — H4.S3.M3
- Hecho:      spec de la propiedad de frecuencia (3/3) y simulador entero de nuevo en verde
- Evidencia:  ng test --include=core/mock/handlers/terminology.handlers.spec.ts → 3/3
- Ahora:      publicar los handoffs de Pablo y Justin
- Bloqueo:    ninguno
- Estado:     HECHO
- Peldaño:    TESTED

AVANCE — Ender — H4 — H4.S1.M3
- Hecho:      verificado que el contrato REAL admite la propiedad: `propertyCode` libre y
              `valueJson` «JSON arbitrario» (create-designation.dto.ts:20-35)
- Evidencia:  cita pegada en docs/trabajo/2026-09-21-handoffs-contratos-panel/handoff-justin.md
- Ahora:      declarar la procedencia sintetica en el archivo de datos
- Bloqueo:    ninguno
- Estado:     HECHO — **corrige lo que supuse en el PLAN**: no es extension del doble
- Peldaño:    VERIFIED

AVANCE — Ender — H3 — H3.S3.M2
- Hecho:      matriz negativa del visitador ejercitada con `visitador@alovida.mock`
- Evidencia:  pharma-lab.handlers.spec.ts → 6/6; rutas clinicas devuelven forbidden
- Ahora:      empezar H4
- Bloqueo:    ninguno
- Estado:     HECHO — **sin fuga: ningun PRODUCT_BUG que reportar**
- Peldaño:    VERIFIED

AVANCE — Ender — H2 — H2.S3.M2
- Hecho:      spec del manejador de excepciones: crea, lista, rechaza el invalido (8/8)
- Evidencia:  ng test --include=core/mock/handlers/scheduling.handlers.spec.ts → 8/8
- Ahora:      H3, la duracion configurable
- Bloqueo:    ninguno
- Estado:     HECHO
- Peldaño:    TESTED

AVANCE — Ender — H2 — H2.S2.M1
- Hecho:      tres defectos del doble corregidos: aceptaba cualquier `exceptionType` con
              fallback silencioso; `EXTRA` cerraba horario en vez de abrirlo; el GET escondia
              `exceptionType`
- Evidencia:  scheduling.handlers.ts; mock-backend.spec.ts sigue 21/21
- Ahora:      escribir el spec propio del manejador
- Bloqueo:    ninguno
- Estado:     HECHO — el kill-test del hito **fallaba** antes de esto
- Peldaño:    RUNS

AVANCE — Ender — H1 — H1.S2.M1
- Hecho:      linea base del simulador ANTES de tocar nada
- Evidencia:  ng test --include=core/mock/mock-backend.spec.ts → 21/21
- Ahora:      H2
- Bloqueo:    ninguno
- Estado:     HECHO
- Peldaño:    TESTED
```

## 4. Cierre del turno — completar al terminar

| Hito | Microtareas HECHO / total | Estado del hito | Qué falta exactamente |
|---|---|---|---|
| H1 | __ / __ | | |
| H2 | __ / __ | | |
| H3 | __ / __ | | |
| H4 | __ / __ | | |
| H5 | __ / __ | | |
| H6 | __ / __ | | |
| **Total** | **__ / 55** | | |

- **Peldaño de evidencia alcanzado** (el **más bajo** de tus áreas en alcance): ____
- **`REPORTE.md`:** ____ (ruta)
- **Procesos que quedaron corriendo:** ____ (si no quedó ninguno, **decilo**; el silencio no es evidencia de limpieza)

## 5. A quién esperás y quién te espera

| | Quién | Qué exactamente |
|---|---|---|
| **Esperás a** | Itzan (componente de acciones y regla de opciones, para tus archivos) | Su rama `itzan/patron-acciones-fila-insignia-perfil` esta **10 commits por delante de `mockup` y sin PR abierto**: el patron todavia no esta publicado. Afecta a H6.S2, que no entra en esta pasada |
| **Te esperan** | **Pablo** (excepción `EXTRA`, motivo del bloqueo, forma de la visita) · **Justin** (clave de la propiedad de frecuencia) · **Marcelo** (dónde guardar las filas de su cuadrícula). **Publicá el contrato antes de terminar la pantalla.** | **Pablo: PUBLICADO** → `docs/trabajo/2026-09-21-handoffs-contratos-panel/handoff-pablo.md`. **Justin: PUBLICADO, esperando su ACCEPT/REJECT/CHANGE_REQUESTED** → `handoff-justin.md`. **Marcelo:** su cuadricula (PR #558) ya esta mergeada y **no llama a ningun cliente de datos**: la persistencia sigue sin existir, lo digo abajo como hallazgo |

**Si un bloqueo se confirma, aplicá la regla 65 antes de declararlo:** si el contrato de lo que falta
se puede nombrar, se simula en sus tres niveles —correcto, límite e inválido— y la microtarea **se
cierra contra el doble**, declarando que se cerró así. Sólo una decisión de negocio sin tomar
justifica dejarla abierta.

## 6. Hallazgos y ambigüedades que aparecieron en el camino

| ID | Qué | A quién le pega | Estado |
|---|---|---|---|
| **E-01** | El `POST` de excepciones aceptaba **cualquier** `exceptionType` y caia a `OTHER`/`EXC-PERSONAL` en silencio. El doble era **mas permisivo que el backend**, que valida con `@IsIn` y rechaza con 400 | Pablo | **CORREGIDO** en el doble |
| **E-02** | `EXTRA` **cerraba** horario en vez de añadirlo: `isAvailable` salia del cuerpo del pedido y no del tipo, asi que un `EXTRA` sin ese campo bloqueaba los cupos | Pablo | **CORREGIDO** · avisado en el handoff porque **cambia el comportamiento** |
| **E-03** | El `GET` de excepciones **quitaba `exceptionType`** de la respuesta: distinguir un bloqueo de un horario extra obligaba a comparar etiquetas en castellano | Pablo | **CORREGIDO**: viajan `exceptionType` y `blocks` |
| **E-04** | La API **no tiene** donde guardar la duracion configurable de la visita: `git grep` de `visitDuration` / `visit.*duration` sobre `src/` de `c2c071a4` devuelve **cero** | Quien toque `pharma_lab` en la API | **HALLAZGO ABIERTO** · el campo se escribio como **doble declarado** (regla 65) |
| **E-05** | La cuadricula de notas de Marcelo (PR #558, ya en `mockup`) **no llama a ningun cliente de datos**: no hay donde guardar una fila estructurada | Marcelo | **HALLAZGO ABIERTO** · es el dato que su lote necesita |
| **Q-D6.a** | «OTROS SERVICIOS» como motivo propio **no es agregar una palabra al enum**: `exception_type_concept_id` es FK a `terminology.catalog_concepts`, ademas de contrato publico, orden de despliegue y migracion | Negocio | **DECISION DE NEGOCIO** · detalle en `Q-D6-decisiones-de-negocio.md` |
| **Q-D6.b** | La posologia por defecto **no la decide el equipo**. Lo cargado es sintetico, declarado `MANTRA_DEV_VADEMECUM`, sin fuente autoritativa y no apto para uso clinico. Precedente **B-13** | Negocio | **DECISION DE NEGOCIO** · bloquea sacar estos valores de la maqueta |
| **E-06** | `fixtures/fichas-estandar.spec.ts` falla por **entorno, no por codigo**: hace `readdirSync(cwd + '/../mantra-core-health-api/...')` y esa ruta no existe en esta maquina (la API vive en `Mantra Core Technologies/`). Falla igual fuera de este diff y ningun archivo de este slice participa | Nadie de este lote | **BASELINE_ENVIRONMENT_FAILURE** · no se arregla en este carril |
| **E-07** | El catalogo del doble exigia texto en `ABSENCE`, `CONFERENCE` y `ERRAND`. La API declara **un solo** motivo que lo exige (`MOTIVO_QUE_EXIGE_TEXTO = 'OTHER'`, `scheduling-catalog.service.ts:163`, validado en `:688`). El doble era **mas estricto** que el backend: habria rechazado lo que la API acepta | Pablo | **CORREGIDO** · lo encontre revisando su `blocks.ts`, despues de publicar el handoff. Rectificado ahi mismo |

**Un bug se reporta apenas aparece, no al cierre** (regla 50).

## 7. Qué NO se puede escribir en este documento

- Un `PASS` sin comando y salida pegados.
- «Listo», «funciona» o «implementado» sobre algo que no se ejecutó.
- Un porcentaje que no salga de `HECHO / 55`.
- Un `BLOQUEADO` disfrazado de `PASS` porque «igual compila».
- Una microtarea en `EN CURSO` al cerrar: pasa a `A MEDIAS` con qué anda, qué no anda y qué falta.
- Datos reales de pacientes en cualquier salida pegada. Las cuentas `@alovida.mock` son sintéticas
  declaradas y sí se pueden pegar.
