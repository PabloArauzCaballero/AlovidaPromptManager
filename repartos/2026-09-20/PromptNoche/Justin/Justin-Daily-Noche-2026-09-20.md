# Daily de Justin — turno noche — 2026-09-20

> **AVANCE: __ / 54 — __ %.** ← primera línea, siempre. Sale de `microtareas HECHO / 54`,
> **nunca a ojo**. `A MEDIAS` cuenta como **no hecha**. `DESCARTADO` no suma: se declara aparte con su motivo.

- **Turno:** noche · **Fecha:** 2026-09-20 · **Persona:** Justin
- **Encargo:** [La receta: sacarle lo que no va, y que la dosis y la posología digan la verdad](Noche-CorreccionesDoctor.Receta/RecetaLimpiaMotivoDosisYPosologia.md)
- **Correcciones que cubrís:** C-15, C-16, C-17, C-18, C-19, C-20 (UI), C-21 (en la receta), C-22
- **Fuente del pedido:** [`CORRECCIONES-DOCTOR-2026-09-20.md`](../../../docs/requisitos/CORRECCIONES-DOCTOR-2026-09-20.md)
- **Verificación contra el código:** [`VERIFICACION-CONTRA-CODIGO-2026-09-20.md`](../../../docs/verificacion/VERIFICACION-CONTRA-CODIGO-2026-09-20.md)
- **Tus archivos reservados:** `patient-chart/medication-block/**` · `core/data-access/prescription-favorites/**`

## 1. Lo primero — pegar acá la salida de la instalación del estándar

**Un turno que arranca sin esto arranca en `BLOQUEADO`** (sección 1 del encargo).

```text
$ ls .claude/skills | wc -l
<pegar>

$ ls .claude/rules/[0-9]*.md | wc -l
<pegar>

$ python .claude/hooks/plan_gate.py --self-test
<pegar>
```

- [ ] Leí `skills-router` y las skills de las dos tablas de mi encargo.
- [ ] Creé mi `PLAN.md` **antes** del primer `Edit`/`Write` de código.

## 2. El corte que fijaste

```text
$ git fetch origin && git log -1 --format='%H %ad %s' origin/mockup
<pegar>
```

**Corte de referencia del reparto:** `689697821a6e6d2c8f702c7508d6728fa9a1869a` (PR #554,
2026-09-20T12:32-04). Si el tuyo es otro, **el tuyo manda** y lo declarás acá.

## 3. Checkpoints — uno por apertura y por cierre de microtarea

Formato de la regla 50. **Prohibido encadenar más de 3 operaciones materiales sin checkpoint.**

```text
AVANCE — Justin — <fase> — <ID de microtarea>
- Hecho:      <qué quedó, concreto>
- Evidencia:  <comando / ruta / "ninguna todavía">
- Ahora:      <la siguiente acción, una sola>
- Bloqueo:    ninguno | <qué bloquea y de quién depende>
- Estado:     TODO | EN CURSO | HECHO | A MEDIAS | BLOQUEADO | DESCARTADO
- Peldaño:    UNKNOWN | DISCOVERED | WRITTEN | RUNS | TESTED | VERIFIED | REGRESSION_VERIFIED
```

<!-- Pegá tus checkpoints debajo de esta línea, el más reciente arriba. -->

## 4. Cierre del turno — completar al terminar

| Hito | Microtareas HECHO / total | Estado del hito | Qué falta exactamente |
|---|---|---|---|
| H1 | __ / __ | | |
| H2 | __ / __ | | |
| H3 | __ / __ | | |
| H4 | __ / __ | | |
| H5 | __ / __ | | |
| H6 | __ / __ | | |
| **Total** | **__ / 54** | | |

- **Peldaño de evidencia alcanzado** (el **más bajo** de tus áreas en alcance): ____
- **`REPORTE.md`:** ____ (ruta)
- **Procesos que quedaron corriendo:** ____ (si no quedó ninguno, **decilo**; el silencio no es evidencia de limpieza)

## 5. A quién esperás y quién te espera

| | Quién | Qué exactamente |
|---|---|---|
| **Esperás a** | Ender (clave de la propiedad de frecuencia por defecto) · Marcelo (el cambio en `consultation.html`, que es de él) · Itzan (componente de acciones y regla de opciones) | |
| **Te esperan** | Marcelo (qué cerró `DESCARTADO` por estar ya cumplido entra en el dictamen) | |

**Si un bloqueo se confirma, aplicá la regla 65 antes de declararlo:** si el contrato de lo que falta
se puede nombrar, se simula en sus tres niveles —correcto, límite e inválido— y la microtarea **se
cierra contra el doble**, declarando que se cerró así. Sólo una decisión de negocio sin tomar
justifica dejarla abierta.

## 6. Hallazgos y ambigüedades que aparecieron en el camino

| ID | Qué | A quién le pega | Estado |
|---|---|---|---|
| | | | |

**Un bug se reporta apenas aparece, no al cierre** (regla 50).

## 7. Qué NO se puede escribir en este documento

- Un `PASS` sin comando y salida pegados.
- «Listo», «funciona» o «implementado» sobre algo que no se ejecutó.
- Un porcentaje que no salga de `HECHO / 54`.
- Un `BLOQUEADO` disfrazado de `PASS` porque «igual compila».
- Una microtarea en `EN CURSO` al cerrar: pasa a `A MEDIAS` con qué anda, qué no anda y qué falta.
- Datos reales de pacientes en cualquier salida pegada. Las cuentas `@alovida.mock` son sintéticas
  declaradas y sí se pueden pegar.
