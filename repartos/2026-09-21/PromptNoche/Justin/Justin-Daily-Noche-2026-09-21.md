# Justin — daily de la noche del 2026-09-21

> **AVANCE: 0 / 68 — 0 %.** ← actualizá esta línea al cerrar. Sale de `microtareas HECHO / total`.
> `A MEDIAS` cuenta como **no hecha**. Prohibido el porcentaje estimado a ojo (regla 50 §5).

- Carril: [`Refactor-DirectorioYCabecera.TerminologiaYDatosCompartidos`](Refactor-DirectorioYCabecera.TerminologiaYDatosCompartidos/PaginaDeDirectorioCabeceraYBusquedaEnCuatroSubmodulos.md)
- Corte: `origin/mockup` @ `5a0776c6…` → **el tuyo:** `________________`
- Rama: `________________` · Peldaño alcanzado (regla 30): `________________`
- Daily de equipo: [`Daily-Noche-2026-09-21.md`](../Daily-Noche-2026-09-21.md)

## 0. Dos cosas que te van a llegar de otros — y qué hacés si no llegan

| Qué esperás | De quién | Si no llegó |
|---|---|---|
| La **decisión Q-A** sobre el generador de `features/alovida/**` | Pablo, su H1.S3 | Tu H1 y tu H2 avanzan igual (inventario, familias, contrato). A la hora de migrar, trabajás contra el supuesto declarado —piloto a mano y exclusión declarada— y **lo decís en el reporte**, anotando qué habría que rehacer |
| El **contrato de `content-dialog`** para tus dos diálogos crudos | Marcelo, su H2 | Simulás el contrato en tres niveles (correcto, límite, inválido), cerrás contra el doble y **declarás que se cerró contra un doble** (regla 65) |

**No te bloquees esperando.** `BLOQUEADO` sin simulación previa no es un cierre válido y el
`blocker_gate.py` lo frena.

## 1. Instalación del estándar — pegá la salida acá

```text
$ ls .claude/skills | wc -l
<pegá la salida — tiene que dar 176>

$ python .claude/hooks/plan_gate.py --self-test
<pegá la salida — tiene que dar 11 PASS, 0 FAIL>
```

- [ ] Leí `skills-router` y las 25 skills de mi lote, empezando por `atomic-design-components`.
- [ ] Creé mi `PLAN.md` antes del primer `Edit`/`Write` de código.

## 2. Baseline

| Comando | Exit code | Rojos previos | Clase (regla 80.4) |
|---|---|---|---|
| `yarn lint` | | | |
| `yarn typecheck` | | | |
| `yarn test --watch=false` | | | |
| `yarn audit:vistas` | | | |

## 3. La trampa de medición — anotá los dos números

En tus 39 pantallas el marcado dice `<div class="app-page-header" app-page-header="">`, pero
**ese atributo no instancia nada**: `page-header` tiene selector de **elemento**. Así que medir con
`grep app-page-header` te cuenta **39 falsos positivos**.

| Medición | Comando | Resultado |
|---|---|---|
| Uso real (instancia el componente) | `git grep -c '<app-page-header' origin/mockup -- 'src/app/**/*.html'` | |
| Coincidencias de texto (incluye los decorativos) | `git grep -c 'app-page-header' origin/mockup -- 'src/app/**/*.html'` | |
| La diferencia | | |

**Esa diferencia es el tamaño del problema de tu carril.** Documentala: es tu H5.S2.M1.

## 4. Avance de la migración — con denominador

| Submódulo | Pantallas con tabla a mano | Migradas | Estado |
|---|---|---|---|
| `alovida/datos-compartidos/**` | 13 | 0 | TODO |
| `alovida/terminologia/**` | 12 | 0 | TODO |
| `alovida/buscar/**` | 7 | 0 | TODO |
| `alovida/directorio/**` | 6 | 0 | TODO |
| `alovida/inicio/**` | 1 | 0 | TODO |
| **Total tablas** | **39** | **0** | |
| Diálogos crudos (`buscar/**`) | 2 | 0 | TODO |

## 5. Checkpoints del turno

```text
AVANCE — directorio, cabecera y búsqueda — <fase> — <ID de microtarea>
- Hecho:      <qué quedó, concreto>
- Evidencia:  <comando / ruta / "ninguna todavía">
- Ahora:      <la siguiente acción, una sola>
- Bloqueo:    ninguno | <qué bloquea y de quién depende>
- Estado:     TODO | EN CURSO | HECHO | A MEDIAS | BLOQUEADO | DESCARTADO
- Peldaño:    UNKNOWN | DISCOVERED | WRITTEN | RUNS | TESTED | VERIFIED | REGRESSION_VERIFIED
```

## 6. Lo que pediste y su estado

| Qué | A quién | Estado | Si no llegó: contrato simulado en tres niveles |
|---|---|---|---|
| Decisión Q-A | Pablo | | |
| Contrato de `content-dialog` | Marcelo | | |
| Patrón de migración de tabla | Pablo | | |
| Fixtures de terminología y datos compartidos | Ender | | |

## 7. El archivo compartido

`features/alovida/alovida.routes.ts` (43 KB) lo comparten **Pablo y vos**. Sólo se **agrega**; nunca se
reordena ni se reformatea, y se avisa **antes**.

| ¿Lo tocaste? | Qué agregaste | ¿Avisaste antes? |
|---|---|---|
| | | |

## 8. Al cerrar

- [ ] `REPORTE.md` con el avance en la **primera línea** y sus tres secciones (una vacía se escribe
      «ninguna»; borrarla está prohibido).
- [ ] Baseline repetido y comparado: ningún rojo **nuevo**.
- [ ] **Si tocaste `page-header`: tres consumidores ajenos comprobados a mano**, con captura. Tiene
      **171** consumidores: es la pieza más adoptada del repo.
- [ ] Capturas antes/después en 390, 768 y 1440, y en los dos temas, **miradas**, con su línea.
- [ ] Una captura en escala de grises por lote: nada puede informar **sólo** por color.
- [ ] Consola y red sin errores nuevos en cada pantalla tocada.
- [ ] Ningún literal de color, espaciado o tipografía nuevo: sólo tokens (regla 95.1.5).
- [ ] Las 20 preguntas del §19 respondidas con evidencia — en especial: **¿alguna medición tuya cuenta
      los atributos decorativos como uso real?**
- [ ] Procesos corriendo, enumerados y cerrados. Si no quedó nada, decilo.
