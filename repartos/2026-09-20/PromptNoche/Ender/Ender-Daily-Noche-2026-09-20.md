# Daily de Ender — turno noche — 2026-09-20

> **AVANCE: 54 / 55 — 98,2 %.** ← primera línea, siempre. Sale de `microtareas HECHO / 55`,
> **nunca a ojo**. `A MEDIAS` cuenta como **no hecha**. `DESCARTADO` no suma: se declara aparte con su motivo.
>
> Ejecutado el 2026-09-21 (madrugada), sobre worktree dedicado `wt-ender-contratos-panel` en la
> rama `ender/noche-2026-09-20-contratos-panel`. Plan y reporte completos en
> `mantra-core-health/docs/trabajo/2026-09-20-ender-contratos-panel/{PLAN.md,REPORTE.md}`.

- **Turno:** noche · **Fecha:** 2026-09-20 · **Persona:** Ender
- **Encargo:** [Los contratos que faltan y un panel que diga la verdad](Noche-CorreccionesDoctor.ContratosYPanel/CatalogosBloqueosPosologiaYPanel.md)
- **Correcciones que cubrís:** C-03, C-12 (contrato), C-13 (contrato), C-20 (catálogo), C-24
- **Fuente del pedido:** [`CORRECCIONES-DOCTOR-2026-09-20.md`](../../../docs/requisitos/CORRECCIONES-DOCTOR-2026-09-20.md)
- **Verificación contra el código:** [`VERIFICACION-CONTRA-CODIGO-2026-09-20.md`](../../../docs/verificacion/VERIFICACION-CONTRA-CODIGO-2026-09-20.md)
- **Tus archivos reservados:** `core/mock/**` · `features/dashboard/**` · `core/data-access/**` (menos `prescription-favorites/**`)

## 1. Lo primero — pegar acá la salida de la instalación del estándar

**Un turno que arranca sin esto arranca en `BLOQUEADO`** (sección 1 del encargo).

```text
$ ls .claude/skills | wc -l
180

$ ls .claude/rules/[0-9]*.md | wc -l
14

$ python .claude/hooks/plan_gate.py --self-test
plan_gate self-test: 11 PASS, 0 FAIL
```

Nota: el conteo de skills salió en **180**, no 176 como declara el encargo — el repo
`AlovidaPromptManager` avanzó 22 commits entre que se escribió la ficha y que la instalé (traje
`main` al día antes de arrancar, como pide la instrucción). Es una diferencia esperable, no un
error de instalación.

- [x] Leí `skills-router` y las skills de las dos tablas de mi encargo.
- [x] Creé mi `PLAN.md` **antes** del primer `Edit`/`Write` de código
      (`mantra-core-health/docs/trabajo/2026-09-20-ender-contratos-panel/PLAN.md`).

## 2. El corte que fijaste

```text
$ git fetch origin && git log -1 --format='%H %ad %s' origin/mockup
68dcb562ef3dd74de03f4887c57fd836fb21be13 Sun Sep 20 20:59:15 2026 -0400 docs(deploy): documentar Traefik por IP en vez del dominio sslip.io de Coolify
```

**Corte de referencia del reparto:** `689697821a6e6d2c8f702c7508d6728fa9a1869a` (PR #554,
2026-09-20T12:32-04). **El mío es otro y manda**: `68dcb562` — `mockup` avanzó 22 commits sobre
el de la ficha; verificado que ninguno toca `core/mock/**`, `features/dashboard/**` ni
`core/data-access/**`. Ref de la API citada (sólo lectura): `origin/dev` = `c2c071a4`.

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
AVANCE — Ender — cierre — H6
- Hecho:      H5 y H6 cerrados. Regresión completa del frontend: 6875/6876 verde (1 rojo ajeno,
              contabilidad, no tocado por mí). Capturas de "Tus consultas" en 5 anchos + oscuro,
              miradas. REPORTE.md escrito.
- Evidencia:  mantra-core-health/docs/trabajo/2026-09-20-ender-contratos-panel/REPORTE.md
- Ahora:      cerrar el turno; bajar `yarn start`.
- Bloqueo:    ninguno.
- Estado:     HECHO (H6 en A MEDIAS por H6.S3.M2, ver tabla de arriba)
- Peldaño:    VERIFIED (frontend) / TESTED (manejadores del simulador)
```

```text
AVANCE — Ender — H5 — construcción del panel — H5.S1-S3
- Hecho:      Componente `consultas-resumen` nuevo: semanal/mensual, canceladas incluibles,
              mapa de calor accesible (número siempre en texto, nunca sólo color), otras
              atenciones con la tipología real, tonos reusados de `booking-status.ts` de la
              agenda. 7 tests unitarios + 4 checks E2E reales (5 anchos, oscuro, teclado).
- Evidencia:  yarn test --include=.../consultas-resumen.spec.ts → 7/7 PASS
              yarn pw playwright/ender-contratos-panel-evidencia.spec.ts --workers=1 → 4/4 PASS
- Ahora:      H6 — globos, patrón de Itzan, regresión.
- Bloqueo:    ninguno.
- Estado:     HECHO
- Peldaño:    VERIFIED
```

```text
AVANCE — Ender — H4 — propiedad de frecuencia — H4.S1-S3
- Hecho:      Descubrí que el mecanismo `properties` de concepto NO existía en el simulador (mi
              corte es 22 commits más nuevo que el de la ficha). Lo construí siguiendo el
              contrato real de la API (search-concepts.dto.ts), y agregué
              `default_frequency` como extensión sintética declarada en 5 de 15 medicamentos
              (uno con valor mal formado a propósito, para el caso inválido).
- Evidencia:  evidencia/h4-tres-niveles.txt · 9/9 tests nuevos · 48/48 regresión del simulador
- Ahora:      H5.
- Bloqueo:    ninguno.
- Estado:     HECHO
- Peldaño:    TESTED
```

```text
AVANCE — Ender — H3 — visita del visitador — H3.S1-S3
- Hecho:      Corregí la premisa Q-E3 de la ficha con evidencia real de la API: el contrato de
              duración configurable SÍ existe. Agregué el tope por política del doctor y el
              rechazo de valores fuera de [5,240]. Verifiqué en runtime que el visitador no
              accede a información clínica (403) — sin fuga, `puedeLeer()` ya defendía bien.
- Evidencia:  evidencia/h3-tres-niveles.txt · 10/10 tests nuevos
- Ahora:      H4.
- Bloqueo:    ninguno.
- Estado:     HECHO
- Peldaño:    TESTED
```

```text
AVANCE — Ender — H2 — motivo y horario extra — H2.S1-S3
- Hecho:      OTHER+texto y EXTRA ya funcionaban de fábrica; el gap real (kill-test de la ficha)
              era que el manejador no rechazaba un exceptionType inválido ni una franja
              inválida. Corregido: ahora 422 en los dos casos, en POST y PATCH.
- Evidencia:  evidencia/h2-tres-niveles.txt · 8/8 tests nuevos · 29/29 con mock-backend.spec.ts
- Ahora:      H3.
- Bloqueo:    ninguno.
- Estado:     HECHO
- Peldaño:    TESTED
```

```text
AVANCE — Ender — H1 — setup, baseline y mapa — H1.S1-S3
- Hecho:      Worktree dedicado, estándar instalado (self-test 11/11), PLAN.md escrito, baseline
              del simulador en verde (21/21), typecheck y lint limpios, mapa de endpoints escrito
              para Pablo/Justin/Marcelo, capturas de login de médica y visitador miradas.
- Evidencia:  evidencia/{antes-mock.txt,baseline-typecheck-lint.txt,mapa-endpoints.md}
- Ahora:      H2.
- Bloqueo:    ninguno.
- Estado:     HECHO
- Peldaño:    RUNS/TESTED
```

## 4. Cierre del turno — completar al terminar

| Hito | Microtareas HECHO / total | Estado del hito | Qué falta exactamente |
|---|---|---|---|
| H1 | 9 / 9 | HECHO | — |
| H2 | 9 / 9 | HECHO | — |
| H3 | 9 / 9 | HECHO | — |
| H4 | 9 / 9 | HECHO | — |
| H5 | 10 / 10 | HECHO | — |
| H6 | 8 / 9 | A MEDIAS | H6.S3.M2: no corrí `yarn recorrido` (barrido Cypress de TODA la app); sustituido por un E2E dirigido a mi pantalla nueva, en verde |
| **Total** | **54 / 55** | | |

- **Peldaño de evidencia alcanzado** (el **más bajo** de tus áreas en alcance): **VERIFIED**
  (frontend, con prueba visual real en 5 anchos × 2 temas) / **TESTED** (los cuatro manejadores
  del simulador, con specs dirigidos y la regresión completa del simulador en verde).
- **`REPORTE.md`:** `mantra-core-health/docs/trabajo/2026-09-20-ender-contratos-panel/REPORTE.md`
- **Procesos que quedaron corriendo:** `yarn start` (servidor de desarrollo en `localhost:4200`)
  para las capturas de Playwright — **se baja al cerrar la sesión**. Ningún otro proceso en
  background.

## 5. A quién esperás y quién te espera

| | Quién | Qué exactamente |
|---|---|---|
| **Esperás a** | Itzan | **Ya no espero nada**: su patrón (`origin/itzan/patron-acciones-fila-insignia-perfil`) ya está publicado, y medí 0 botones-solo-ícono y 0 grupos de opciones en mis archivos — no había nada que aplicarle esta noche. |
| **Te esperan** | **Pablo** — `EXTRA` (horario extra, `blocks:false`) y el motivo `OTHER`+"Otros servicios" funcionan, **y ahora además rechazan lo inválido** (tipo fuera de la lista de 7, franja invertida o de cero minutos → 422). Ruta: `POST /scheduling/resources/:id/exceptions`. También: la visita de visitador tiene duración configurable con tope por política del doctor. Ver `evidencia/h2-tres-niveles.txt` y `evidencia/h3-tres-niveles.txt` en `mantra-core-health`. | |
| | **Justin** — la clave es `properties.default_frequency` (string), servida sólo por `GET /terminology/concepts/:id` (no en listas), leíble con `valorDeTexto(ficha.properties, 'default_frequency')` de `core/data-access/terminology/terminology.types.ts`. Puede faltar o venir mal formada: en los dos casos devuelve `undefined`, nunca lanza. Ver `evidencia/h4-tres-niveles.txt`. | |
| | **Marcelo** — no hay endpoint para guardar una fila estructurada de cuadrícula (notas libres y episodios sí existen). Ver `evidencia/mapa-endpoints.md`. Y: cero fugas de acceso del visitador verificadas en runtime (403 en `/clinical/patients/:id/summary` y `/charts/patients/:id/chart`) — nada que aportar a su dictamen de seguridad esta noche. | |

**Si un bloqueo se confirma, aplicá la regla 65 antes de declararlo:** si el contrato de lo que falta
se puede nombrar, se simula en sus tres niveles —correcto, límite e inválido— y la microtarea **se
cierra contra el doble**, declarando que se cerró así. Sólo una decisión de negocio sin tomar
justifica dejarla abierta.

## 6. Hallazgos y ambigüedades que aparecieron en el camino

| ID | Qué | A quién le pega | Estado |
|---|---|---|---|
| H-01 | El manejador de excepciones de agenda aceptaba cualquier `exceptionType` (incluso fuera de la lista cerrada de 7) y franjas invertidas/de cero minutos, sin rechazarlas | Pablo (agenda) | Corregido esta noche — ahora 422 |
| H-02 | El mecanismo `properties` de concepto (`GET /terminology/concepts/:id`) no existía en el simulador, aunque `ConceptDetail.properties` ya estaba declarado del lado del data-access (TAREA-25) | Justin (receta/ficha de medicamento) | Corregido esta noche — construido desde cero |
| H-03 | La duración configurable de la visita de visitador (C-13) SÍ tiene contrato en la API real (`doctor_visit_policies`/`doctor_visit_windows`); la ficha asumía que no existía (Q-E3) | Coordinación | Corregido en el PLAN — sólo faltaba cumplirlo, no inventarlo |
| H-04 | `dose_forms`/`strengths` de medicamentos NO están publicados en ningún concepto del simulador todavía (la ficha citaba que sí) | Justin | Registrado, no corregido — fuera del alcance de C-20 (que sólo pedía la frecuencia) |
| H-05 | `reservaVisible()` en `scheduling.handlers.ts` tiene un fallback permisivo para cualquier usuario sin `patientProfileId` ni `practitionerProfileId` (incluye admin/superadmin por diseño) | Pablo (agenda) / Marcelo (seguridad) | Registrado, no corregido — es diseño existente para roles de staff, no una fuga clínica confirmada |
| H-06 | No hay endpoint para guardar una fila estructurada de cuadrícula (notas libres y episodios sí existen) | Marcelo | Registrado, no corregido — es exactamente el hallazgo que su propio encargo esperaba |

**Un bug se reporta apenas aparece, no al cierre** (regla 50).

## 7. Qué NO se puede escribir en este documento

- Un `PASS` sin comando y salida pegados.
- «Listo», «funciona» o «implementado» sobre algo que no se ejecutó.
- Un porcentaje que no salga de `HECHO / 55`.
- Un `BLOQUEADO` disfrazado de `PASS` porque «igual compila».
- Una microtarea en `EN CURSO` al cerrar: pasa a `A MEDIAS` con qué anda, qué no anda y qué falta.
- Datos reales de pacientes en cualquier salida pegada. Las cuentas `@alovida.mock` son sintéticas
  declaradas y sí se pueden pegar.
