# Pablo — daily de la noche del 2026-09-21

> **AVANCE: 0 / 63 — 0 %.** ← actualizá esta línea al cerrar. Sale de `microtareas HECHO / total`.
> `A MEDIAS` cuenta como **no hecha**. Prohibido el porcentaje estimado a ojo (regla 50 §5).

- Carril: [`Refactor-TablaCanonica.AccesosYPersonas`](Refactor-TablaCanonica.AccesosYPersonas/ContratoDeTablaYAdopcionEnAccesosYPersonas.md)
- Corte: `origin/mockup` @ `5a0776c6…` → **el tuyo:** `________________`
- Rama: `________________` · Peldaño alcanzado (regla 30): `________________`
- Daily de equipo: [`Daily-Noche-2026-09-21.md`](../Daily-Noche-2026-09-21.md) — **lo mantenés vos**

## 0. Lo primero de la noche no es código: es la decisión Q-A

Las 161 pantallas de `features/alovida/**` las **genera** `scripts/port-vistas-alovida.mjs`. Su propio
encabezado dice **«ARCHIVO GENERADOR. Lo que produce se puede editar a mano; si se vuelve a correr, lo
pisa.»** No tiene mecanismo de exclusión, y sus rutas `VAULT` y `FRONT` son absolutas de tu Mac
(líneas 30-32), así que hoy **nadie más puede correrlo**.

**Mientras esa decisión no esté escrita, vos y Justin migran 70 pantallas a ciegas.** Es tu H1.S3, y es
lo que destraba el carril de otra persona. Las tres opciones y su motivo:

| Opción | Qué implica |
|---|---|
| El generador aprende a emitir componentes canónicos | Arregla las 133 de una, pero es trabajo en un archivo que sólo corre en tu máquina |
| La pantalla migrada sale del alcance del generador con una marca | Barato y reversible, pero hay que implementar la marca: hoy no existe |
| Se congela el generador | Cero riesgo de pisada, pero la bóveda deja de ser la fuente |

**Escribila con su alternativa descartada, en la carpeta que ya existe** (`docs/adr/` o
`docs/refactor-profesional/trabajo/DECISIONES.md`), y avisale a Justin en el mismo momento.

## 1. Instalación del estándar — pegá la salida acá

```text
$ ls .claude/skills | wc -l
<pegá la salida — tiene que dar 176>

$ python .claude/hooks/plan_gate.py --self-test
<pegá la salida — tiene que dar 11 PASS, 0 FAIL>
```

- [ ] Leí `skills-router` y las 25 skills de mi lote, empezando por `frontend-data-tables`.
- [ ] Creé mi `PLAN.md` antes del primer `Edit`/`Write` de código.

## 2. Baseline

| Comando | Exit code | Rojos previos | Clase (regla 80.4) |
|---|---|---|---|
| `yarn lint` | | | |
| `yarn typecheck` | | | |
| `yarn test --watch=false` | | | |
| `yarn audit:vistas` | | | |

## 3. Avance de la migración — con denominador

| Submódulo | Pantallas con tabla a mano | Migradas | Estado |
|---|---|---|---|
| `alovida/accesos/**` | 16 | 0 | TODO |
| `alovida/personas/**` | 15 | 0 | TODO |
| **Total** | **31** | **0** | |

**El número de arriba y el de la matriz de migración tienen que coincidir siempre.** Si no coinciden,
el plan miente (regla 50 §4).

## 4. Checkpoints del turno

```text
AVANCE — tabla canónica y adopción — <fase> — <ID de microtarea>
- Hecho:      <qué quedó, concreto>
- Evidencia:  <comando / ruta / "ninguna todavía">
- Ahora:      <la siguiente acción, una sola>
- Bloqueo:    ninguno | <qué bloquea y de quién depende>
- Estado:     TODO | EN CURSO | HECHO | A MEDIAS | BLOQUEADO | DESCARTADO
- Peldaño:    UNKNOWN | DISCOVERED | WRITTEN | RUNS | TESTED | VERIFIED | REGRESSION_VERIFIED
```

## 5. Tus dos obligaciones con el resto del equipo

| A quién | Qué le debés | Cuándo | Entregado |
|---|---|---|---|
| **Justin** | la decisión Q-A escrita | **H1.S3, temprano** | ☐ |
| **Justin** | el patrón de migración de tabla documentado, para que reuse en sus 39 | H5.S2.M3 | ☐ |

Y lo que vos le pedís a otros:

| Qué | A quién | Estado | Si no llegó: contrato simulado en tres niveles (regla 65) |
|---|---|---|---|
| Fixtures de `accesos` y `personas` en `core/mock/` | Ender | | |
| Escenario tipado de `DataTable<Row>` en el catálogo | Ender | | |
| Export nuevo en el barrel, si hace falta | Ender | | |

## 6. Como coordinador — decisiones que sólo podés tomar vos

Están todas en el daily de equipo §5. Anotá acá qué resolviste y qué elevaste:

| ID | Qué se decidió | Fundamento | Elevado a |
|---|---|---|---|
| Q-A | | | — |
| Q-B (reusar `docs/refactor-profesional/trabajo/`) | | | — |
| Q-C (`FormGroup` tipado, 52 consumidores — pide a Itzan el plan) | | | — |
| Q-D (`fact-section`, 0 consumidores — pide a Marcelo las 4 mediciones) | | | — |
| Q-E (adjuntos complementarios — pide a Marcelo la evidencia) | | | — |

## 7. Al cerrar

- [ ] `REPORTE.md` con el avance en la **primera línea** y sus tres secciones (una vacía se escribe
      «ninguna»; borrarla está prohibido).
- [ ] Baseline repetido y comparado: ningún rojo **nuevo**.
- [ ] **Los 29 consumidores de `DataTable` siguen sanos**: `typecheck` y `test` en verde.
- [ ] Capturas antes/después en 390, 768 y 1440, y en los dos temas, **miradas**, con su línea.
- [ ] Consola y red sin errores nuevos en cada pantalla tocada.
- [ ] Las 20 preguntas del §19 respondidas con evidencia — en especial la 10ª de tu lista:
      **¿la próxima corrida del generador borra lo que migraste?**
- [ ] Procesos corriendo, enumerados y cerrados. Si no quedó nada, decilo.
- [ ] **El daily de equipo actualizado** con lo que pasó en los cinco carriles.
