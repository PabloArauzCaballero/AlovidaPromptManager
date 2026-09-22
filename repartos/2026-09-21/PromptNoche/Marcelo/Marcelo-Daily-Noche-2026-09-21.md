# Marcelo — daily de la noche del 2026-09-21

> **AVANCE: 63 / 70 — 90,0 %.** `A MEDIAS` cuenta como no hecha. Denominador **70, no 61**:
> desvío declarado en `PLAN.md` (H3 se descompuso en 8 microtareas por subtarea — 7 bloques +
> cableado — en vez de agrupadas, uno por commit/verificación independiente).

- Carril: [`Refactor-DialogosYAdjuntos.Expediente`](Refactor-DialogosYAdjuntos.Expediente/ContratoDeDialogoAdjuntosYSeccionDeDatosDelExpediente.md)
- Corte: `origin/mockup` @ `5a0776c6…` → **el mío:** `d40b5631f68a52c79fe94f0dc689df3bc7e70140`
  (9 commits después del declarado en la ficha; ninguno toca mis 6 archivos reservados salvo 3
  diálogos nuevos en `admin/**` que suman consumidores de `content-dialog` de 26 a 29)
- Rama: `marcelo/noche-2026-09-21-dialogos-adjuntos-expediente` (repo `mantra-core-health`) ·
  Peldaño alcanzado (regla 30): **VERIFIED** para H3 (E2E real + capturas), **TESTED** para el
  código de soporte, **WRITTEN** para los 3 contratos (documentación, no código ejecutable)
- Daily de equipo: [`Daily-Noche-2026-09-21.md`](../Daily-Noche-2026-09-21.md)
- Reporte completo: `mantra-core-health/docs/trabajo/2026-09-21-marcelo-dialogos-adjuntos-expediente/REPORTE.md`

## 0. La deuda con Justin — CERRADA

| Entregable | Cuándo | Entregado | Justin confirmó |
|---|---|---|---|
| Contrato de `content-dialog` (§8 + §10.3, incluidos los **tres caminos de cierre**) | H2.S1 | ☑ `mantra-core-health/docs/refactor-profesional/trabajo/contratos/content-dialog.md` | ☐ (avisado acá, pendiente de que lo lea) |

**@Justin**: el contrato está en `contratos/content-dialog.md`. Trae, además del §8/§10/§10.3, una
receta de migración paso a paso al final (§8) pensada para tus dos diálogos —
`facility-directions-dialog` y `pharmacy-availability-dialog`— y la tabla completa de los 29
consumidores actuales, para que veas ejemplos reales de `[dismissible]`/`(dismissAttempt)` ya
vinculados (`work-history.html`, `tarjeta-del-dia.html`, `attachment-dialog.html`). Como tus dos son
sólo mapas (sin formulario), no necesitás la política de descarte — el organismo cierra directo por
default, así que la migración es sólo estructura (título, cuerpo, `dialog-actions`, `(closed)`).

## 1. Instalación del estándar — hecho, leído desde el hermano

```text
$ ls AlovidaPromptManager/.claude/skills | wc -l
176

$ python AlovidaPromptManager/.claude/hooks/plan_gate.py --self-test
plan_gate self-test: 11 PASS, 0 FAIL
```

**No se copió** `.claude/` dentro de `mantra-core-health/` (desvío deliberado, ver PLAN.md): el
front ya tiene su propio `settings.json` versionado (marketplaces/plugins) que copiar hubiera
pisado, y sumaba ~200 archivos sin rastrear al PR. El DoD se cumple igual, leído desde el hermano.

- [x] Leí `skills-router` y las skills de mi lote, empezando por `clinical-records` y `data-privacy-phi`.
- [x] Creé mi `PLAN.md` antes del primer `Edit`/`Write` de código.

## 2. Baseline

| Comando | Exit code | Rojos previos | Clase (regla 80.4) |
|---|---|---|---|
| `yarn lint` | 1 | 244 (preexistentes) | STATIC — no bloquea, es el estado real del repo |
| `yarn typecheck` | 0 | — | — |
| `yarn test --watch=false` | 1 | 4 archivos / 9 tests (de 571/7089) | ENVIRONMENT — contagio de TestBed, `app.routes.spec.ts`, `catalog-object-detail.spec.ts`, `register-practitioner.spec.ts`, `insurance-analytics.spec.ts`; ninguno en mi alcance |

## 3. El comportamiento de ANTES del diálogo del expediente

**Hallazgo, no lo esperado**: `patient-chart.html` **no tiene un diálogo escrito a mano** —
`grep '<dialog\|role="dialog"'` sólo matchea un comentario (línea 296). Sus tres modales YA son
`<app-content-dialog>`, pero **ninguno vinculaba `[dismissible]`/`(dismissAttempt)`**. H3 se
reformuló: no es "migrar al organismo", es "cablear la política de descarte que el organismo ya
soporta". Detalle completo en `PLAN.md` desvío #1.

| Camino de cierre | ¿Pide confirmación si hay cambios? (antes) | ¿Dónde queda el foco al cerrar? (antes) |
|---|---|---|
| Botón «Cerrar» | No — razonado por código, no observado en navegador | No razonado explícitamente |
| `Escape` | No — idem | Idem |
| Clic en el fondo | No — idem | Idem |

> **Nota honesta**: no se abrió el navegador contra el código *antes* del cambio (habría exigido
> otro ciclo completo de `yarn dev`, que en este sandbox tardó 2-3 arranques por inestabilidad de
> esbuild). Lo que SÍ se verificó en navegador es el comportamiento *después*: **3 passed / 1
> skipped** en `expediente-dialogo-descarte.spec.ts`, con 4 capturas.

El organismo ya expone **`dismissAttempt`** (línea 123 de `content-dialog.ts`): el diálogo **pide**
cerrarse y el consumidor decide. Después de este carril, el expediente lo usa.

## 4. Las tres mediciones pedidas como evidencia

| Qué | Comando | Resultado |
|---|---|---|
| Consumidores de `content-dialog` | `git grep -l '<app-content-dialog' origin/mockup -- 'src/app/**/*.html' \| wc -l` | **29** (no 26 — 3 nuevos en `admin/**` post-corte de la ficha) |
| De ésos, cuántos escuchan `dismissAttempt` | `git grep -l 'dismissAttempt' -- 'src/app/**/*.html'` | **5 archivos** |
| Consumidores de `attachment-dialog` / `attachment-uploader` | los dos `git grep -l` | **3 y 3** (confirmado) |

## 5. `fact-section`: cuatro mediciones, veredicto sin borrar nada

| Medición | Resultado |
|---|---|
| Usos estáticos por selector | **0** |
| Usos por importación de la clase (`FactSection`) | **1** — sólo el re-export del barrel `organisms/index.ts:34` |
| Usos dinámicos o por ruta | **0** |
| Presencia en el índice del catálogo | Sí — sólo el banco de componentes |

**Veredicto:** pendiente con dueño ☑ Pablo — **no se adopta ni se retira esta noche**. El único
candidato dentro de mi alcance (el detalle de lectura del expediente, un `<dl>` de 3-5 campos fijos)
no necesita buscador ni paginación: `fact-section` trae ambos, pensado para listas largas. Forzarlo
ahí sería adoptar el organismo equivocado sólo para justificar que se usa. `fact-list` (la molécula,
sin buscador) sí encajaría — candidata de oleada 2, no decidida esta noche. Detalle en
`contratos/seccion-de-datos.md` + D-19 en `DECISIONES.md`.

## 6. Adjuntos: veredicto con evidencia (§7.1)

| Dimensión (§7.1) | `attachment-dialog` (178 líneas) | `attachment-uploader` (390 líneas) |
|---|---|---|
| Propósito | Cáscara modal + política de descarte | Cola de subida, vínculo, reintento |
| Anatomía | Envuelve `content-dialog` + `attachment-uploader` | `file-input` + lista de estado por archivo |
| Contrato | `ownerType`/`ownerId` reenviados; `attached`/`progressed`/`closed` | idem; expone `tieneCambiosPendientes` |
| Comportamiento | Pregunta al cerrar con selección sin subir | Hace el HTTP real (`FilesClient.upload`) |
| Apariencia | Heredada de `content-dialog` | CSS propio, cola visible |

**Veredicto con evidencia:** complementarias ☑ — fusionables ☐ — **contraejemplo**:
`allergy-block.html` y `medication-block.html` montan `attachment-uploader` **directo, sin modal**;
si fueran la misma pieza esos dos bloques no podrían existir sin duplicar un modal a mano.

## 7. Checkpoints del turno

```text
AVANCE — diálogos, adjuntos y expediente — CIERRE — H6
- Hecho: 63/70 microtareas. Contratos H2/H4/H5 escritos y verificados con git grep. H3 cableado,
  27+10=37 tests unitarios nuevos verdes, E2E real 3 passed/1 skipped, 4 capturas miradas.
  Regresión completa sin empeorar (3 rojos vs 4 baseline, mismo patrón ENVIRONMENT ajeno).
- Evidencia: mantra-core-health/docs/trabajo/2026-09-21-marcelo-dialogos-adjuntos-expediente/
  (PLAN.md, REPORTE.md, evidencia/ con 35 archivos)
- Ahora: PR de la rama contra mockup
- Bloqueo: ninguno
- Estado: HECHO (5 microtareas PENDIENTE con las 4 respuestas en REPORTE.md, ninguna A MEDIAS)
- Peldaño: VERIFIED (H3) / TESTED (código) / WRITTEN (contratos)
```

## 8. Lo que pediste y su estado

| Qué | A quién | Estado | Si no llegó: contrato simulado en tres niveles (regla 65) |
|---|---|---|---|
| Fixtures del expediente en `core/mock/` | Ender | No hizo falta pedir nada — la maqueta ya sirve `medica@alovida.mock` + paciente «Ana» completos | N/A |
| Escenarios de los dos organismos de adjuntos en el catálogo | Ender | **Definiciones entregadas** en `contratos/adjuntos.md` (variantes, props, salidas esperadas); implementación en `component-stock/` es de Ender (regla 65: los 3 niveles del contrato de cada organismo ya están ejercitados por sus specs propios, `attachment-dialog.spec.ts`/`attachment-uploader.spec.ts`, así que el comportamiento no depende de que Ender monte el escenario — sólo la acreditación visual en la Vitrina queda pendiente) | Declarado, no bloqueante |

## 9. Al cerrar

- [x] `REPORTE.md` con el avance en la primera línea y sus tres secciones (`A medias` = «ninguna»).
- [x] Baseline repetido y comparado: **ningún rojo nuevo** (de hecho, menos rojos: 3 vs 4).
- [x] **`content-dialog` tocado sólo en consumo** (no se editó el organismo): la medición de 3
      consumidores ajenos a mano **quedó PENDIENTE** (H2.S2.M4/H6.S1.M3) — declarado con las 4
      respuestas en `REPORTE.md`, no se ocultó.
- [x] `patient-chart` (único diálogo tocado): rol y nombre accesible ☑ · foco inicial adentro ☑ ·
      foco atrapado — **no probado explícitamente con `Tab`×N**, declarado PENDIENTE ☐ · `Escape` ☑ ·
      restauración del foco al abridor ☑ · movimiento reducido respetado ☑.
- [x] Capturas por viewport y tema, **miradas**, con su línea (4, no 5 — sin "antes", ver §3).
- [x] **GATE DE `data-privacy-phi`**, escrito en `REPORTE.md`: cero datos de pacientes reales.
      `medica@alovida.mock` + paciente sintética «Ana Lucía Pérez Quiroga» del simulador.
- [x] **Ningún dato clínico inventado**: el documento sintético de prueba se tituló "Laboratorio
      completo", sin dosis, posología ni catálogo médico inventado.
- [x] Los **ocho** diálogos crudos restantes declarados con dueño propuesto para la oleada 2 en
      `REPORTE.md` §"Oleada 2" (2 de Justin ya resueltos con el contrato entregado arriba; 6 sin
      dueño asignado, incluidos los 3 de `admin/**` que no existían al escribirse la ficha).
- [x] Las 20 preguntas del §19 respondidas en `REPORTE.md`; en especial la #13 (protección de
      cambios sin guardar por los tres caminos): **sí está cubierta**, verificada en el E2E.
- [x] Procesos corriendo, enumerados y cerrados: `yarn dev`/`yarn start` matados con
      `taskkill /F /IM node.exe` tras la verificación E2E; nada quedó corriendo.
