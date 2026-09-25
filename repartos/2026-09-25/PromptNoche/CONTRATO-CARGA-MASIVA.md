# Contrato compartido — motor de carga masiva (noche del 2026-09-25)

> **Este archivo es la razón de que nadie se bloquee.** Los cinco carriles escriben contra lo que dice acá,
> cada uno con su **doble** de lo que hace el otro (regla 65, tres niveles: correcto, límite, inválido).
> Nadie espera a que otro publique: se integra al final (carril de Pablo). Si alguien necesita cambiar el
> contrato, lo escribe **acá primero**, en un commit propio, y avisa en su daily. Prohibido cambiarlo en
> silencio desde el código.

## 0. Quién hace qué y qué archivos son de cada uno

| Persona | Carril | Repo | Archivos reservados (nadie más los toca) |
|---|---|---|---|
| **Itzan** | Motor **y parseo**: contrato de fila, detector, CSV, perfiles, NDJSON (heredado de Ender) + servicio ensanchado, dry-run, todo o nada, idempotencia contra Postgres, autorización, plantilla, OpenAPI | API | `src/modules/terminology/import/**` (nuevo, **menos `xlsx-parser*`**) · `src/modules/terminology/services/concept-file-import.service.ts` (+spec) · `src/modules/terminology/services/import-parsers.provider.ts` (nuevo) · `src/modules/terminology/services/import-template.service.ts` (nuevo) · `src/modules/terminology/controllers/terminology-versions.controller.ts` · `src/modules/terminology/dto/import-concepts-file.dto.ts` · `src/modules/terminology/terminology.module.ts` (sólo providers) · `src/common/errors/error-codes.ts` (sólo los códigos `IMPORT_*`) · `test/integration/terminology/**` (nuevo) · `openapi/**` |
| **Justin** | Pantalla: qué se carga, drag & drop, validar sin guardar, vista previa, resumen, descarga de errores, doble del simulador | Front | `src/app/features/admin/terminology/version-import/**` · `src/app/core/data-access/terminology/terminology.client.ts` y `terminology.types.ts` (**sólo** la sección de import) · `src/app/core/mock/handlers/terminology.handlers.ts` (**sólo** los manejadores `import-file` e `import-template`) |
| **Marcelo** | Calidad **y parseo XLSX**: E2E Playwright, capturas ×3×2×4 con doble revisión, gate de seguridad y PHI, Q-9, regresión + (heredado de Ender) dependencia XLSX, fixtures de la API, `xlsx-parser.ts` | Front + API | **API:** `src/modules/terminology/import/xlsx-parser.ts` (+spec) · `test/fixtures/terminology-import/**` (nuevo) · `package.json` + `yarn.lock` (sólo la dependencia XLSX) · rama `marcelo/carga-masiva-xlsx-2026-09-25`. **Front:** `playwright/carga-masiva*.spec.ts` (nuevo) · `playwright/fixtures/carga-masiva/**` (nuevo) · `scripts/capturas-carga-masiva.mjs` (nuevo) · `docs/trabajo/2026-09-25-marcelo-calidad/**` en los dos repos |
| **Pablo** | Integración: rama de integración, cambiar el provider de parseadores por los reales, regresión conjunta, dos PR mergeables, decisiones Q-1…Q-8, reporte consolidado | API + Front | `docs/trabajo/2026-09-25-pablo-integracion/**` en los dos repos · el **cuerpo** de `import-parsers.provider.ts` **sólo al integrar**, después de que Itzan cerró (secuencial, no simultáneo) |

**Nadie toca:** `src/modules/terminology/entities/**`, `src/orm/**` (esquema: prohibido), `src/common/storage/**`,
`src/common/files/**`, `shared/components/molecules/file-input/**` (se usa tal cual), `app.routes.ts`,
`core/navigation/**`, `features/alovida/terminologia/**`, seeds.

**Ramas:** API desde `origin/dev`; **front desde `origin/mockup`** (regla de Pablo: todo cambio de frontend termina en PR a `mockup`, mergeable y sin regresiones). En **checkouts limpios** (`git worktree add`), porque el checkout
actual del front tiene cambios sin commitear de Ender del 22/09. Rama por persona:
`<nombre>/carga-masiva-<carril>-2026-09-25`. Pablo integra en `pablo/carga-masiva-integracion-2026-09-25`.

## 1. Contrato de fila y de parseador (TypeScript, API)

Vive en `src/modules/terminology/import/row-contract.ts` (**Itzan lo publica en su primera hora**, como primer commit, antes que cualquier parseador).
Marcelo lo trae a su rama por `cherry-pick` para escribir el parseador XLSX; si a la hora 1 no está, lo escribe
**literal** desde acá y Pablo conserva el de Itzan al integrar (deben ser idénticos).

```ts
export type FormatoDeArchivo = 'ndjson' | 'csv' | 'xlsx';

/** Una fila del archivo tal como se leyó, sin validar. `numero` es 1-based y cuenta el encabezado como fila 1. */
export interface FilaLeida {
  readonly numero: number;
  readonly valores: Readonly<Record<string, string>>;
}

/** Un problema apuntando a la fila del archivo original. Sin `columna` cuando es de la fila entera o del encabezado (fila 1). */
export interface ProblemaDeFila {
  readonly fila: number;
  readonly columna?: string;
  readonly motivo: string;
}

export interface ResultadoDeParseo {
  readonly filas: readonly FilaLeida[];
  readonly problemas: readonly ProblemaDeFila[];
}

export interface ColumnaDePerfil {
  readonly nombre: string;          // nombre canónico, minúsculas: 'code'
  readonly alias: readonly string[]; // aceptados en el encabezado, insensible a mayúsculas y espacios: ['código', 'codigo']
  readonly obligatoria: boolean;
  readonly maxLargo?: number;
}

export interface PerfilDeImportacion {
  readonly id: 'conceptos' | 'designaciones';
  readonly columnas: readonly ColumnaDePerfil[];
  readonly ejemplo: Readonly<Record<string, string>>; // una fila sintética para la plantilla
}

export interface ParseadorDeArchivo {
  readonly formato: FormatoDeArchivo;
  /** Nunca lanza por contenido de filas: los problemas van en `problemas`. Lanza sólo si el buffer no es del formato. */
  parsear(buffer: Buffer, perfil: PerfilDeImportacion): ResultadoDeParseo;
}

/** Decide por CONTENIDO, nunca por extensión ni mimetype. Lanza `FormatoNoAdmitidoError` (clase exportada acá). */
export declare function detectarFormato(buffer: Buffer): FormatoDeArchivo;
export declare class FormatoNoAdmitidoError extends Error { readonly motivo: string; }
```

Perfil `conceptos` (el primero, obligatorio):

| nombre | alias | obligatoria | maxLargo |
|---|---|---|---|
| `code` | `código`, `codigo`, `clave` | sí | 255 |
| `display` | `nombre`, `término`, `termino`, `etiqueta` | sí | 255 |
| `definition` | `definición`, `definicion`, `descripción`, `descripcion` | no | — |

Reglas de detección: `xlsx` = empieza con `PK\x03\x04` **y** el ZIP contiene `xl/workbook.xml`; `ndjson` = la
primera línea no vacía parsea como objeto JSON; `csv` = texto UTF-8 (BOM tolerado) cuya primera línea contiene
`,` o `;`. Lo demás → `FormatoNoAdmitidoError`.

Reglas de CSV: separador detectado entre `,` y `;` (el que más aparece en la primera línea); comillas dobles,
`""` como escape, saltos de línea dentro de comillas; columnas **por nombre** (perfil), en cualquier orden;
columna desconocida → **un** problema en fila 1; sin encabezado reconocible → un problema en fila 1 y cero
filas; filas totalmente vacías se ignoran.

Reglas de XLSX: hoja `conceptos` si existe, si no la primera; encabezado en fila 1; celdas a texto (números sin
notación científica, fechas ISO); fórmula sin valor cacheado → problema.

Validación (la hace **Itzan** sobre `FilaLeida`, no el parseador): obligatoria vacía → problema con `columna`;
largo > `maxLargo` → problema con `columna`; `code` repetido dentro del archivo → problema en la segunda
aparición, `columna: 'code'`.

Exportación (Itzan; Pablo agrega `XlsxParser` al integrar): `src/modules/terminology/import/index.ts` exporta `PARSEADORES_DE_IMPORTACION:
readonly ParseadorDeArchivo[]`, `detectarFormato`, `PERFILES_DE_IMPORTACION: Record<PerfilDeImportacion['id'],
PerfilDeImportacion>` y los tipos.

## 2. Contrato HTTP (API ↔ Front)

### `POST /terminology/versions/{versionId}/import-file` — ya existe; se ensancha

`multipart/form-data`, rol `SECURITY_ADMIN`:

| campo | tipo | obligatorio | por omisión |
|---|---|---|---|
| `file` | archivo (NDJSON, CSV o XLSX; ≤ `FILE_STORAGE_MAX_SIZE_BYTES`, 10 MiB por omisión) | sí | — |
| `dryRun` | `'true'` \| `'false'` | no | `'false'` |
| `profile` | `'conceptos'` \| `'designaciones'` | no | `'conceptos'` |

Respuesta `201` (real) o `200` (`dryRun=true`):

```json
{
  "batchId": "uuid | null",
  "format": "csv",
  "profile": "conceptos",
  "dryRun": false,
  "aborted": false,
  "totalRead": 50,
  "inserted": 50,
  "skipped": 0,
  "errors": 0,
  "errorSamples": [ { "line": 12, "column": "display", "message": "está vacía" } ],
  "preview": [ { "line": 2, "code": "ZZ-001", "display": "Ejemplo uno", "definition": "…" } ]
}
```

- `batchId` es `null` en dry-run (**no se registra lote**, Q-4) y en `aborted`.
- `aborted: true` ⇔ `errors > 0` ⇔ `inserted = 0` (**todo o nada**, Q-2).
- `skipped` = filas cuyo `code` ya existía en la versión (**se omite, no se actualiza**, Q-7).
- `errorSamples` son **los primeros 20**; `preview` son **las primeras 20 filas válidas**.
- Los campos que ya existían (`batchId`, `totalRead`, `inserted`, `skipped`, `errors`, `errorSamples[].line`,
  `errorSamples[].message`) **no cambian de nombre ni de tipo**.

Errores (sobre de error del repo, `src/common/errors`):

| HTTP | `code` | Cuándo |
|---|---|---|
| 401 | el del repo | sin token |
| 403 | el del repo | rol distinto de `SECURITY_ADMIN` |
| 412 | el existente (`PreconditionFailedException`) | falta `file`; versión no está en borrador |
| 413 | el de multer/el repo | archivo mayor al tope |
| 422 | `IMPORT_FORMAT_UNSUPPORTED` | no es NDJSON/CSV/XLSX |
| 422 | `IMPORT_EMPTY_FILE` | 0 bytes o sólo encabezado |
| 422 | `IMPORT_PROFILE_UNKNOWN` | `profile` fuera de la lista |

**Ningún camino devuelve 500.**

### `GET /terminology/import-template?profile=conceptos&format=csv|xlsx` — nuevo

Rol `SECURITY_ADMIN`. Devuelve el archivo (`text/csv; charset=utf-8` o
`application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`) con `Content-Disposition: attachment;
filename="plantilla-conceptos.csv"`: fila 1 = nombres canónicos de columnas del perfil, fila 2 = `ejemplo`.
`format` desconocido → 422 `IMPORT_FORMAT_UNSUPPORTED`; `profile` desconocido → 422 `IMPORT_PROFILE_UNKNOWN`.

## 3. Contrato de la pantalla (Justin ↔ Marcelo)

Ruta: la que hoy carga `VersionImport` (`app.routes.ts:763`); no cambia. `data-testid` que Marcelo usa y Justin pone:

| `data-testid` | Elemento |
|---|---|
| `carga-perfil` | `app-select` del perfil («Qué vas a cargar») |
| `carga-sistema` | `app-select` del sistema de codificación |
| `carga-version` | `app-select` de la versión en borrador |
| `carga-plantilla-csv` · `carga-plantilla-xlsx` | enlaces de descarga de plantilla |
| `carga-archivo` | contenedor del `app-file-input` (el `<input type="file">` vive adentro; Marcelo usa `setInputFiles` sobre `[data-testid=carga-archivo] input[type=file]`) |
| `carga-validar` | botón «Validar sin guardar» |
| `carga-importar` | botón «Importar» — deshabilitado hasta validación con 0 errores (Q-8) |
| `carga-informe` | tarjeta con leídas / con error / formato |
| `carga-preview` | tabla de vista previa |
| `carga-errores` | tabla de errores (`fila`, `columna`, `motivo`) |
| `carga-descargar-errores` | botón que genera el CSV de errores en el cliente |
| `carga-resumen` | tarjeta final: leídas / insertadas / omitidas / errores + `batchId` |
| `carga-otro` | «Cargar otro archivo» (conserva perfil, sistema y versión) |

Estados M34 que la pantalla resuelve (Justin) y Marcelo captura: **vacío** (nada elegido), **validando**
(parcial), **con errores** (`aborted`), **éxito** (resumen). Más los de red: 413, 422, 401/403, error con `requestId`.

## 4. Fixtures sintéticos compartidos (nombres y resultados esperados)

Todos **sintéticos, declarados**, generados el 2026-09-25, códigos con prefijo `ZZ-`. Marcelo los genera en
`test/fixtures/terminology-import/` (API) con `generar-fixtures.mjs` **en su hora 2** y **copia** los que necesita
a `playwright/fixtures/carga-masiva/` (front) — no los regenera distinto. Hasta que estén, Itzan y Justin crean
**los tres primeros a mano** con estos mismos nombres y contenidos (son triviales).

| Archivo (`.csv` y su gemelo `.xlsx`) | Filas de datos | `problemas` esperados |
|---|---|---|
| `ok-50` | 50 (`ZZ-001`…`ZZ-050`) | 0 |
| `con-errores` | 50, de las cuales 5 malas: fila 5 `display` vacío · fila 9 `code` vacío · fila 14 `code` de 256 · fila 20 `code` = `ZZ-003` (repetido) · fila 33 `display` de 256 | 5, con `fila` y `columna` exactas |
| `vacio-solo-encabezado` | 0 | 1 (fila 1: «sin filas») → 422 `IMPORT_EMPTY_FILE` |
| `bom` | 3 | 0 |
| `separador-punto-y-coma` | 3 | 0 |
| `comillas-y-saltos` | 3 (una `definition` con coma, comilla y salto de línea) | 0 |
| `unicode` | 3 (tildes, ñ, emoji) | 0 |
| `columnas-desordenadas` | 3 (`definition,display,code`) | 0 |
| `columna-desconocida` | 3 (+ columna `extra`) | 1 (fila 1, «columna extra no reconocida») |
| `sin-encabezado` | — | 1 (fila 1) y 0 filas |
| `fila-vacia-al-final` | 3 (+ 2 líneas vacías) | 0 |
| `duplicado-en-archivo` | 4 (`ZZ-001` dos veces) | 1 (fila 4, `code`) — **lo detecta la validación de Itzan, no el parseador** |
| `grande-10k` | 10 000 | 0 (sólo XLSX; para el spec de límite) |
| `no-es-nada.pdf` | bytes `%PDF-1.4` | `FormatoNoAdmitidoError` → 422 |

## 5. Ambigüedades con supuesto (valen para los cinco; a confirmar con Pablo)

| ID | Supuesto |
|---|---|
| Q-1 | «Modelo» = perfil + sistema de codificación + versión en borrador. Los «otros elementos» (geografía, empleadores, ocupaciones, establecimientos, aseguradoras, glosario) **ya son conceptos** en `src/common/seed/**`: entran por el mismo motor eligiendo su sistema |
| Q-2 | Errores parciales → **todo o nada** |
| Q-3 | Síncrono hasta 10 MiB; sin job en background |
| Q-4 | Formato / dry-run / perfil del lote **no persisten** (sin columna; el esquema no se toca): van en la respuesta |
| Q-5 | La vista previa la devuelve el servidor en el dry-run; el front **no** parsea XLSX |
| Q-6 | `code` repetido dentro del archivo → problema en la segunda aparición → aborta |
| Q-7 | `code` ya existente en la versión → `skipped`, nunca se actualiza |
| Q-8 | Desde la UI no se importa sin validar antes; por API el `dryRun` es opcional |
| Q-10 | Ender no está esta noche: su carril (parseo) se reparte — contrato/detector/CSV/perfiles a Itzan; dependencia/fixtures/XLSX a Marcelo. Confirmado por Pablo el 2026-09-25 |
| Q-9 | Segundo perfil = `designaciones` (`code`, `language`, `use`, `value`) **sólo si** Marcelo confirma en su descubrimiento que entidad, DTO y repositorio existen; si no, `DESCARTADO` con evidencia |

## 6. Cómo se integra (Pablo, al final)

1. Rama de integración por repo (API desde `origin/dev`, front desde `origin/mockup`); merge en este orden — API: Itzan → Marcelo (`carga-masiva-xlsx`); front: Justin → Marcelo (`carga-masiva-calidad`).
2. En el `index.ts` de Itzan, agregar `export { XlsxParser } from './xlsx-parser'` y sumar `xlsx` a `PARSEADORES_DE_IMPORTACION` (dos líneas).
3. Regresión conjunta (serial) + E2E de Marcelo contra la API real + kill-test del contrato (§7).
4. Dos PR `MERGEABLE` demostrados: API a `dev`, **front a `mockup`**.

## 7. Kill-test del contrato entero (lo corre Pablo al integrar; cada carril corre su parte contra su doble)

Con `SECURITY_ADMIN`, en la pantalla: elegir perfil «Conceptos», un sistema de prueba `ZZ-…` y su versión en
borrador → arrastrar `ok-50.csv` → «Validar sin guardar» → `carga-informe` dice 50 leídas, 0 errores, y la base
no cambió → «Importar» → `carga-resumen` dice 50 insertadas → «Cargar otro» → mismo archivo → validar →
importar → 0 insertadas, 50 omitidas → `con-errores.xlsx` → validar → `carga-errores` muestra 5 filas con
columna, `carga-importar` deshabilitado → `no-es-nada.pdf` → 422 legible → sin token, `curl` → 401;
`PRACTITIONER` → 403.
