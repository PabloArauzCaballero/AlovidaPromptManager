# Justin — daily de la noche del 2026-09-21

> **AVANCE: 0 / 68 — 0 %.** ← actualizá esta línea al cerrar. Sale de `microtareas HECHO / total`.
> `A MEDIAS` cuenta como **no hecha**. Prohibido el porcentaje estimado a ojo (regla 50 §5).

- Carril: [`Refactor-DirectorioYCabecera.TerminologiaYDatosCompartidos`](Refactor-DirectorioYCabecera.TerminologiaYDatosCompartidos/PaginaDeDirectorioCabeceraYBusquedaEnCuatroSubmodulos.md)
- Corte: `origin/mockup` @ `5a0776c6…` → **el tuyo:** `________________`
- Rama: `________________` · Peldaño alcanzado (regla 30): `________________`
- Daily de equipo: [`Daily-Noche-2026-09-21.md`](../Daily-Noche-2026-09-21.md)

## 0. Dos cosas que te van a llegar de otros — y qué hacés si no llegan

> ## 🛑 PARÁ ACÁ — tus 39 pantallas NO se migran. Q-A resuelta, y el resultado cancela el trabajo
>
> **`docs/adr/ADR-0014-pantallas-portadas-que-se-graduan.md`** (rama `pablo/refactor-tabla-canonica`).
> **No empieces a migrar nada de `features/alovida/**` hasta leerlo.**
>
> ### Por qué
>
> 1. Al abrir una de esas pantallas en el navegador, el propio producto muestra un aviso **que no se
>    puede cerrar**: *«Referencia de diseño, no la aplicación. Esta pantalla viene de la bóveda con
>    datos de ejemplo… La pantalla que sí funciona es Pacientes.»*
> 2. Lo pinta `alovida/shell/alovida-design-notice.ts`, y su documentación declara que las 126
>    portadas son **el entregable del diseñador y la fuente contra la que se rehidratan las vistas
>    reales** (corrección #8), y que el carril 01 pide **marcarlas, no borrarlas**.
> 3. **Las pantallas reales ya montan el organismo canónico.** Medido:
>    `admin/organizations/organization-list`, `admin/patients/patient-list` y
>    `admin/terminology/terminology-catalog` usan `<app-data-table>`, y **ninguna** tiene una tabla
>    escrita a mano. Tus tres módulos con pantalla real ya están adoptados.
>
> **Migrar tus 39 destruiría el entregable de diseño para conseguir cero valor de producto.**
> Quedan `DESCARTADO`, igual que las 31 de Pablo. Tu H3, H4 y H5 no corresponden.
>
> ### Dos datos que igual te sirven
>
> - **El generador no sobrescribe: borra.** `port-vistas-alovida.mjs:275-284` hace
>   `rmSync(..., { recursive: true, force: true })` sobre los siete segmentos, **incluidos tus cinco**.
>   Un archivo nuevo creado a mano ahí adentro tampoco sobrevive.
> - **`maqueta portada: 119` de `yarn audit:vistas` no es deuda**: es el recuento del entregable de
>   diseño. Usarlo como meta a bajar sería medir mal.
>
> ### Qué hacer en su lugar — confirmalo con Pablo antes de arrancar
>
> Lo que **sí** es deuda real, y hoy **no tiene dueño**: la pantalla real de Pacientes tiene **4 de
> las 8 columnas** y **ninguno de los 5 filtros** que el diseño especifica, y monta `DataTable` pero
> **no** `ViewStateHost`. Eso vive en `features/admin/**`. Es trabajo de producto, no de
> refactorización, y hay que asignarlo antes de tocarlo.

| Qué esperás | De quién | Si no llegó |
|---|---|---|
| ~~La **decisión Q-A**~~ | ~~Pablo~~ | **RESUELTA** — ver el recuadro de arriba |
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

## 7. El archivo compartido — **corregido el 2026-09-21 por ADR-0014**

> ❌ **`features/alovida/alovida.routes.ts` NO se toca nunca.** Es un archivo **generado** y está en
> la lista de borrado del generador (línea 281). Lo que se escriba ahí se pierde.
>
> ✅ **El archivo de coordinación real es `src/app/app.routes.ts`.** Ahí va la ruta de cada pantalla
> graduada, en el bloque que corre **antes** de `ALOVIDA_ROUTES`. Sólo se **agrega**; nunca se
> reordena ni se reformatea, y se avisa **antes** en el daily. Lo comparten Pablo y vos.

| ¿Tocaste `app.routes.ts`? | Qué ruta agregaste | ¿Avisaste antes? |
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
