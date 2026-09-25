# Daily de equipo — noche del 2026-09-25

> **REPARTIDO: 4 / 4 carriles (Ender no está esta noche; su parseo se repartió) · 25 hitos · 50 subtareas · 334 microtareas.**
> **AVANCE DEL TURNO: 0 / 334 — 0 %.** ← se llena al cerrar, con `microtareas HECHO / total`.
> Itzan 0/109 · Justin 0/68 · Marcelo 0/98 · Pablo 0/59.
> **`A MEDIAS` cuenta como no hecha. `DESCARTADO` no suma: se declara aparte con su motivo.**

> **Estado:** `REPARTIDO` al 2026-09-25. Este documento se escribió **al repartir, antes del turno**;
> la tabla de cierre se llena con lo que cada carril ejecute.

- **Turno:** noche · **Fecha:** 2026-09-25 · **Paquete fuente:** el pedido del cliente del 2026-09-25 — «un motor
  para upload masivo de datos… terminología médica y otros elementos… dado un Excel o un CSV… seleccionar qué
  modelo se va a subir y un drag and drop»
- **Contrato compartido:** [`CONTRATO-CARGA-MASIVA.md`](CONTRATO-CARGA-MASIVA.md) — tipos, HTTP, `data-testid`,
  fixtures, supuestos, orden de integración, kill-test. **Todos escriben contra él.**
- **Verificación contra el código real:** §1.5 / «Hechos ya verificados» de cada prompt (lectura del árbol de
  los dos repos; **nada ejecutado**)
- **Repos de destino:** `alovida/mantra-core-health-api` (ref `origin/dev`, PR a `dev`) y `alovida/mantra-core-health` (ref **`origin/mockup`**, PR a **`mockup`** — regla de Pablo para todo cambio de frontend) · en
  **worktrees limpios** (el checkout actual del front tiene cambios sin commitear de Ender del 22/09)
- Peldaño de evidencia del reparto: **`DISCOVERED`** (regla 30).

## 0. Los cuatro hechos que ordenan la noche

1. **El motor ya existe y es angosto.** `POST /terminology/versions/:id/import-file` importa conceptos por
   archivo, por tandas, con lote y errores por línea — **sólo NDJSON**. Itzan lo ensancha (CSV/XLSX vía
   contrato, dry-run, todo o nada, idempotencia contra Postgres) y escribe el contrato de fila, el detector, el CSV
   y los perfiles; Marcelo escribe el parseador XLSX, los fixtures y decide la dependencia. **Ender no está esta
   noche**: su carril se repartió entre los dos (Q-10).
2. **La pantalla y el drag & drop ya existen.** `admin/terminology/version-import` + `app-file-input`
   (dropzone). Justin agrega «qué se carga» con plantilla, «validar sin guardar», vista previa, resumen.
3. **Los «otros elementos» ya son conceptos de terminología** (`src/common/seed/*.catalog.ts`): entran por el
   mismo motor eligiendo su sistema (Q-1). No se inventa un registro de entidades.
4. **El esquema no se toca.** Ni tabla ni columna; lo que no quepa en `catalog_import_batches` va en la
   respuesta (Q-4).

## 1. Carriles — archivos disjuntos, nadie espera a nadie

| Persona | Carril | Repo | Hitos | Sub | Micro | Publica temprano (para quién) | Prompt |
|---|---|---|---|---|---|---|---|
| **Itzan** | Motor **y parseo**: contrato de fila, detector, CSV, perfiles, NDJSON + servicio, dry-run, todo o nada, idempotencia, authz, plantilla, OpenAPI | API | 7 | 16 | 109 | `row-contract.ts` **hora 1** (Marcelo, Pablo) · rama arrancable (Justin H6, Marcelo H5/H6, Pablo) | [`ServicioEnsanchadoDryRunTodoONadaIdempotenciaAutorizacionYPlantilla.md`](Itzan/Noche-CargaMasiva.MotorDryRunIdempotencia/ServicioEnsanchadoDryRunTodoONadaIdempotenciaAutorizacionYPlantilla.md) |
| **Justin** | Pantalla: qué se carga, arrastrar, validar, vista previa, resumen, doble del simulador | Front | 6 | 10 | 68 | doble del simulador **hora 1,5** (Marcelo) | [`QueSeCargaArrastrarValidarSinGuardarVistaPreviaYResumen.md`](Justin/Noche-CargaMasiva.PantallaDragAndDrop/QueSeCargaArrastrarValidarSinGuardarVistaPreviaYResumen.md) |
| **Marcelo** | Calidad **y parseo XLSX**: E2E, capturas con doble revisión, gates, Q-9, regresión + dependencia XLSX, fixtures de la API, `xlsx-parser.ts` | Front + API | 7 | 15 | 98 | **Q-9 hora 1** (Itzan, Justin) · **fixtures hora 2** (Itzan, Justin) · spec del contrato (Justin) | [`E2EPlaywrightCapturasDobleRevisionGatesYSegundoPerfil.md`](Marcelo/Noche-CargaMasiva.CalidadE2EVisualYGates/E2EPlaywrightCapturasDobleRevisionGatesYSegundoPerfil.md) |
| **Pablo** | Integración: decisiones, merges incrementales, cableado del XLSX, kill-test, PR mergeables, reporte consolidado | Ambos | 5 | 9 | 59 | decisiones Q-1…Q-9 en el contrato (todos) | [`IntegrarLosCuatroCarrilesKillTestDelContratoYDosPRMergeables.md`](Pablo/Noche-CargaMasiva.IntegracionYEntrega/IntegrarLosCuatroCarrilesKillTestDelContratoYDosPRMergeables.md) |

## 2. Por qué es imposible bloquearse (regla 65 aplicada al reparto)

| Dependencia | Cómo se rompe |
|---|---|
| Marcelo (XLSX) ← contrato de Itzan | Itzan publica `row-contract.ts` en la hora 1; Marcelo lo cherry-pickea, o lo escribe literal desde el contrato si no está. Itzan no depende del XLSX: sin él, 422 «xlsx no admitido» y CSV + NDJSON enteros; Pablo cablea `XlsxParser` en dos líneas al integrar |
| Justin ← API de Itzan | Justin ensancha el **doble del simulador** (`terminology.handlers.ts`) en tres niveles contra §2; mira la rama de Itzan **una vez** al final |
| Marcelo ← pantalla de Justin | Marcelo escribe el E2E contra los `data-testid` de §3 y lo corre primero contra la pantalla **de hoy** (baseline), después contra la rama de Justin, después contra API real: tres corridas, tres peldaños declarados |
| Itzan / Justin ← Q-9 de Marcelo | Marcelo la publica en su daily **antes de la hora 1**; si no está, cada uno la mira 5 min y decide |
| Itzan / Justin ← fixtures de Marcelo (hora 2) | Los tres primeros son triviales: cada uno los crea a mano con §4 si aún no están |
| Pablo ← que los cuatro terminen | Integra **lo que hay** al cerrar cada microtarea; un carril que no llega queda `A MEDIAS` con dueño y el resto se entrega |
| Cualquiera ← Docker / `gh` / cuenta demo / lib XLSX con audit rojo | Columna «Si se traba» en cada fila con el camino alternativo |

**Lo único que legítimamente queda sin cerrar:** una decisión de negocio (Q-1…Q-9 ya tienen supuesto: se
trabaja con él) o una acción destructiva sobre algo compartido (no hay ninguna: esquema y `dev` no se tocan).

## 3. Ambigüedades del reparto (con supuesto; Pablo las confirma en el contrato en su H1.S2)

| ID | Supuesto |
|---|---|
| Q-1 | «Modelo» = perfil + sistema de codificación + versión en borrador |
| Q-2 | Errores parciales → todo o nada |
| Q-3 | Síncrono hasta 10 MiB; sin job |
| Q-4 | Formato/dry-run/perfil no persisten (sin columna): respuesta |
| Q-5 | Vista previa desde el servidor; el front no parsea |
| Q-6 | `code` repetido en el archivo → problema, aborta |
| Q-7 | `code` existente → `skipped`, no se actualiza |
| Q-8 | Desde la UI no se importa sin validar |
| Q-9 | `designaciones` sólo si Marcelo confirma entidad + DTO + repositorio |
| Q-10 | Ender no está: parseo repartido entre Itzan (contrato, detector, CSV, perfiles) y Marcelo (dependencia, fixtures, XLSX) |

## 4. Cierre del turno (lo llena Pablo en su H5.S2)

| Persona | HECHO / total | Peldaño | Rama pusheada | PR (`mergeable`) | Contra el doble | Sin reporte al cierre |
|---|---|---|---|---|---|---|
| Itzan | 0 / 109 | — | — | — | — | |
| Justin | 0 / 68 | — | — | — | — | |
| Marcelo | 0 / 98 | — | — | — | — | |
| Pablo | 0 / 59 | — | — | — | — | |
| **Total** | **0 / 334** | el más bajo | | | | |
