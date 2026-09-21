# Marcelo — daily de la noche del 2026-09-21

> **AVANCE: 0 / 61 — 0 %.** ← actualizá esta línea al cerrar. Sale de `microtareas HECHO / total`.
> `A MEDIAS` cuenta como **no hecha**. Prohibido el porcentaje estimado a ojo (regla 50 §5).

- Carril: [`Refactor-DialogosYAdjuntos.Expediente`](Refactor-DialogosYAdjuntos.Expediente/ContratoDeDialogoAdjuntosYSeccionDeDatosDelExpediente.md)
- Corte: `origin/mockup` @ `5a0776c6…` → **el tuyo:** `________________`
- Rama: `________________` · Peldaño alcanzado (regla 30): `________________`
- Daily de equipo: [`Daily-Noche-2026-09-21.md`](../Daily-Noche-2026-09-21.md)

## 0. Tenés una deuda con Justin, y es temprano

Dos de las pantallas de Justin (`alovida/buscar/hospitales-listado/facility-directions-dialog` y
`alovida/buscar/medicamentos-listado/pharmacy-availability-dialog`) tienen **diálogos escritos a mano**.
El organismo canónico `content-dialog` es **tuyo**, y su contrato lo escribís vos en **H2**.

**Escribilo temprano y avisale acá.** Si no llega, él tiene que simular el contrato a ciegas — que es
lo que la regla 65 permite, pero es peor trabajo.

| Entregable | Cuándo | Entregado | Justin confirmó |
|---|---|---|---|
| Contrato de `content-dialog` (§8 + §10.3, incluidos los **tres caminos de cierre**) | H2.S1 | ☐ | ☐ |

## 1. Instalación del estándar — pegá la salida acá

```text
$ ls .claude/skills | wc -l
<pegá la salida — tiene que dar 176>

$ python .claude/hooks/plan_gate.py --self-test
<pegá la salida — tiene que dar 11 PASS, 0 FAIL>
```

- [ ] Leí `skills-router` y las 26 skills de mi lote, empezando por `clinical-records` y
      `data-privacy-phi`.
- [ ] Creé mi `PLAN.md` antes del primer `Edit`/`Write` de código.

## 2. Baseline

| Comando | Exit code | Rojos previos | Clase (regla 80.4) |
|---|---|---|---|
| `yarn lint` | | | |
| `yarn typecheck` | | | |
| `yarn test --watch=false` | | | |

## 3. El comportamiento de ANTES del diálogo del expediente

`clinical-record/patient-chart/patient-chart.html` tiene un diálogo escrito a mano. **Antes de
tocarlo**, recorré los tres caminos de cierre y anotá qué hace cada uno. Si no lo anotás, después no
podés demostrar que no cambiaste la política.

| Camino de cierre | ¿Pide confirmación si hay cambios? | ¿Dónde queda el foco al cerrar? |
|---|---|---|
| Botón «Cerrar» | | |
| `Escape` | | |
| Clic en el fondo | | |

> El organismo ya expone **`dismissAttempt`** (línea 123): el diálogo **pide** cerrarse y el consumidor
> decide. El mecanismo existe; lo que falta es demostrar que se usa por los tres caminos.

## 4. Las tres mediciones que te piden como evidencia

| Qué | Comando | Resultado |
|---|---|---|
| Consumidores de `content-dialog` | `git grep -l '<app-content-dialog' origin/mockup -- 'src/app/**/*.html' \| wc -l` | (esperado 26) |
| De ésos, cuántos escuchan `dismissAttempt` | `git grep -c 'dismissAttempt' origin/mockup -- 'src/app/**/*.html'` | |
| Consumidores de `attachment-dialog` / `attachment-uploader` | los dos `git grep -l` | (esperado 3 y 3) |

## 5. `fact-section`: cuatro mediciones antes de cualquier veredicto

Existe (239 líneas) y `<app-fact-section` aparece en **0** plantillas. **Cero consumidores no es un
veredicto**: puede ser una pieza recién nacida o código muerto. **No se borra esta noche.**

| Medición | Resultado |
|---|---|
| Usos estáticos por selector | |
| Usos por importación de la clase (`FactSection`) | |
| Usos dinámicos o por ruta | |
| Presencia en el índice del catálogo | |

**Veredicto (uno de tres):** adoptado por una casilla real del expediente ☐ · pendiente con dueño ☐ ·
propuesto para retiro ☐ — **con motivo escrito.**

## 6. Adjuntos: el §9 te prohíbe fusionarlas por el nombre

> «No consolides `attachment-dialog` y `attachment-uploader` sólo por referirse a adjuntos: pueden
> tener responsabilidades complementarias.»

| Dimensión (§7.1) | `attachment-dialog` (178 líneas) | `attachment-uploader` (390 líneas) |
|---|---|---|
| Propósito | | |
| Anatomía | | |
| Contrato | | |
| Comportamiento | | |
| Apariencia | | |

**Veredicto con evidencia:** complementarias ☐ · fusionables ☐ — `________________________`

## 7. Checkpoints del turno

```text
AVANCE — diálogos, adjuntos y expediente — <fase> — <ID de microtarea>
- Hecho:      <qué quedó, concreto>
- Evidencia:  <comando / ruta / "ninguna todavía">
- Ahora:      <la siguiente acción, una sola>
- Bloqueo:    ninguno | <qué bloquea y de quién depende>
- Estado:     TODO | EN CURSO | HECHO | A MEDIAS | BLOQUEADO | DESCARTADO
- Peldaño:    UNKNOWN | DISCOVERED | WRITTEN | RUNS | TESTED | VERIFIED | REGRESSION_VERIFIED
```

## 8. Lo que pediste y su estado

| Qué | A quién | Estado | Si no llegó: contrato simulado en tres niveles (regla 65) |
|---|---|---|---|
| Fixtures del expediente en `core/mock/` | Ender | | |
| Escenarios de los dos organismos de adjuntos en el catálogo | Ender | | |

## 9. Al cerrar

- [ ] `REPORTE.md` con el avance en la **primera línea** y sus tres secciones (una vacía se escribe
      «ninguna»; borrarla está prohibido).
- [ ] Baseline repetido y comparado: ningún rojo **nuevo**.
- [ ] **Si tocaste `content-dialog`: tres consumidores ajenos comprobados a mano**, con captura.
- [ ] Todo diálogo tocado: rol y nombre accesible · foco inicial adentro · foco atrapado · `Escape` ·
      **restauración del foco al abridor** · movimiento reducido respetado.
- [ ] Capturas por viewport y tema, **miradas**, con su línea.
- [ ] **GATE DE `data-privacy-phi`, escrito en el reporte:** cero datos de pacientes en logs, capturas,
      plan o reporte. Si una salida los tenía, se enmascara **y se aclara que se enmascaró**
      (regla 90.2). Usá `medica@alovida.mock`, que es sintética declarada.
- [ ] **Ningún dato clínico inventado**: ni dosis, ni posología, ni catálogo (regla 97.5.4).
- [ ] Los **ocho** diálogos crudos restantes declarados con dueño propuesto para la oleada 2
      (dos son de Justin; seis quedan fuera).
- [ ] Las 20 preguntas del §19 respondidas — en especial: **¿un cierre evita la protección de cambios
      sin guardar por alguno de los tres caminos?**
- [ ] Procesos corriendo, enumerados y cerrados. Si no quedó nada, decilo.
