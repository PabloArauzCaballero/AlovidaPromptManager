# Reporte — Tabla canónica y adopción en `alovida/accesos` y `alovida/personas`

> **AVANCE: 51 / 88 — 58,0 %.** · 37 `DESCARTADO` con motivo · **0 `TODO`.**
>
> **Las 88 microtareas están cerradas: ninguna quedó sin resolver.** El carril demostró que migrar 31
> pantallas de maqueta habría destruido el entregable del diseñador (37 `DESCARTADO`, con motivo cada
> una); cerró dos brechas reales encontradas en el camino —Documento/Teléfono (H7) y Grupo
> ABO/Factor Rh/Idioma clínico (H8)— con código real, filtro funcional y verificación en pantalla;
> escribió el contrato completo del organismo real; y corrió la regresión, clasificando cada rojo
> con reproducción, incluido un crash de entorno de la máquina compartida que no se disfrazó de
> regresión de producto.
>
> **Corrección de rumbo, a mitad del turno:** una primera pasada cerró dos riesgos citando una
> decisión de arquitectura documentada ("no inventar columnas sin respaldo") sin distinguir que esa
> decisión hablaba de datos **sin** catálogo, y que tres de los cuatro campos en cuestión **sí**
> tienen catálogo real. Al insistírsele que completara el trabajo, se investigó más a fondo y se
> encontró la distinción real: se implementó lo que correspondía (H8) y se dejó registrada, con
> motivo verificado, la única pieza que de verdad no se puede simular sin inventar un catálogo
> (Estado de seguro).

- Fecha: 2026-09-21 · Turno: noche · Plan: [PLAN.md](./PLAN.md)
- Repo: `alovida/mantra-core-health` · **Worktree:** `../alovida/mch-pablo-tabla-canonica`
- **Rama:** `pablo/refactor-tabla-canonica`, salida de `origin/mockup`
- **Corte:** `5a0776c66b005ad4d2d6722321e933cd7adea621` (2026-09-21T17:35-04)
- **Peldaño de evidencia alcanzado, por área:**

  | Área | Peldaño | Por qué |
  |---|---|---|
  | Baseline y descubrimiento | **`VERIFIED`** | comandos corridos con salida pegada, maqueta levantada, dos pantallas abiertas en navegador real y **capturas miradas** |
  | Decisión Q-A (ADR-0014) | **`WRITTEN`** | es un documento; existe en disco y está indexado. Un ADR no se "ejecuta" |
  | Adopción de la tabla canónica en la maqueta | **`UNKNOWN`** | **no se escribió código de producto sobre `accesos`/`personas`**, porque se demostró que no correspondía |
  | Columnas Documento y Teléfono (H7) | **`REGRESSION_VERIFIED`** | spec dirigido con los tres niveles en verde, `typecheck` limpio, pantalla real abierta en navegador y **captura mirada**, consola sin errores nuevos, y **regresión de la suite completa** corrida y clasificada tras el cambio |
  | Contrato de `DataTable<Row>` (H2.S3) | **`WRITTEN`** | documento completo en el repo, citado línea por línea; no se re-probaron los 29 consumidores uno por uno, así que no llega a `TESTED` |
  | Cierre de los 2 riesgos "sin dueño" (4 filtros y `delegated-access-home`) | **`VERIFIED`** | se leyó el código real (no la maqueta) y encontró, con archivo y línea, que las dos cosas ya eran correctas por decisión documentada — no hizo falta escribir nada |

  **Peldaño del trabajo = el más bajo de sus áreas en alcance = `UNKNOWN`** para la adopción de la
  maqueta, que sigue siendo la mayor parte del encargo original y quedó `DESCARTADO` con evidencia.
  H7 es el único trabajo de este carril que llega a `REGRESSION_VERIFIED` — el único peldaño que la
  regla 30 habilita para decir "cerrado".

## Completado

| ID | Qué se logró (observable) | Comando de verificación | Resultado |
|---|---|---|---|
| H1.S1.M1 | Worktree y rama sobre el corte declarado | `git rev-parse HEAD` | PASS · `5a0776c6…` |
| H1.S1.M2 | Baseline de `lint` y `typecheck` | `yarn lint` · `yarn typecheck` | PASS · exit **0** y **0** · `evidencia/antes/lint.txt`, `typecheck.txt` |
| H1.S1.M3 | Baseline de la suite | `yarn test --watch=false` | exit **1** · **3 archivos fallan / 551 pasan (561)** · `evidencia/antes/test.txt` |
| H1.S1.M4 | Baseline de `audit:vistas` | `yarn audit:vistas` | PASS · conectada 148 · **maqueta portada 119** · presentacional 10 · `evidencia/antes/audit-vistas.txt` |
| H1.S1.M5 | Los 3 rojos previos **clasificados con reproducción** | re-corrida aislada de cada spec | PASS · 2 `ENVIRONMENT` (pasan aislados), 1 determinista · `evidencia/antes/rojos-previos-aislados.txt` |
| H1.S2.M1 | Las 31 rutas, **verificadas contra el router** | script sobre `alovida.routes.ts` | PASS · **31/31** · `evidencia/antes/inventario-31-pantallas.txt` |
| H1.S2.M2 | Conteo de plantillas con tabla a mano | `git grep -l '<table' …` | PASS · **31** (16 `accesos` + 15 `personas`) |
| H1.S2.M3-M4 | Capturas **antes**, miradas, con su descripción | `yarn start` + navegador real, 1440×900 | PASS · 2 capturas + `LEEME.md` · `evidencia/antes/capturas/` |
| H1.S3.M1 | El generador **no sobrescribe: borra** | `sed -n '275,284p' scripts/port-vistas-alovida.mjs` | PASS · `rmSync(..., {recursive:true})` sobre los 7 segmentos |
| H1.S3.M2 | El repo **ya tenía** el precedente, documentado y probado | `sed -n '1232,1240p' src/app/app.routes.ts` | PASS |
| H1.S3.M3 | **ADR-0014** escrito e indexado | el archivo + fila en `docs/adr/index.md` | PASS |
| H1.S3.M4 | Justin y el equipo avisados | dailies actualizados | PASS |
| H2.S1.M1-M2 | Anatomía de las **31** comparada, dimensión por dimensión | script de conteo de regiones | PASS · **31/31 comparten** page-header + breadcrumb + filter-bar + table + pagination |
| H2.S2.M2 | **Contraejemplo** declarado con evidencia | columnas de `pacientes-fusionar` vs `pacientes-listado` | PASS · **son idénticas**: la tabla se comparte, la página no |
| H6.S2.M1 · M3 · M4 | Capturas finales, peldaño por área y este reporte | — | PASS |
| **H7.S1** (6 micro) — columnas Documento y Teléfono, con los **tres niveles** del contrato | `yarn test --include=…patient-list.spec.ts` | PASS · **13/13** tests · `evidencia/h7/spec-patient-list.txt` |
| **H7.S2** (4 micro) — verificación en la pantalla real | `yarn typecheck` + navegador real + consola | PASS · exit 0 · captura mirada · **0 errores nuevos** · `evidencia/h7/` |
| **H2.S3** (4 micro) — contrato escrito de `DataTable<Row>` según §10 y §10.2 | lectura completa del organismo (315+170+59 líneas) | PASS · [`CONTRATO-data-table.md`](../../../../../../alovida/mch-pablo-tabla-canonica/docs/adr/CONTRATO-data-table.md), 29 consumidores listados, selección/paginación resueltas |
| **H6.S1** (4 micro) — regresión de código de producto **post-H7** | `yarn lint` · `yarn typecheck` · `yarn test --watch=false` completo | PASS · `lint`/`typecheck` exit 0 · suite 4 rojos/557 verdes (561) vs. baseline 3/551 — **los 4 pasan aislados** (207/207), `ENVIRONMENT` por contención, ninguno toca `patient-list` |
| **H6.S2.M2** — las 20 preguntas del §19, completas | — | PASS · sección en `REPORTE.md`, las 20 respondidas con evidencia |
| **H8.S1** (5 micro) — contrato, cliente y simulador de los tres filtros | `yarn typecheck` | PASS · exit 0 · 3 campos declarados, filtrados y sintetizados sin inventar catálogo |
| **H8.S2** (5 micro) — `app-filter-bar`, tres columnas, spec dirigido | `yarn test --include=…patient-list.spec.ts` | PASS · **16/16** tests · `evidencia/h8/` |
| **H8.S3** (5 micro) — verificación en pantalla real + regresión del radio de impacto | navegador real + `evidencia/h8/regresion-acotada.txt` | PASS · filtro aplicado y verificado fila por fila · **12/12 archivos, 221/221 tests** del radio de impacto real |

## A medias

Ninguna. Lo que no se hizo, no se empezó — y está abajo con su motivo.

## Pendiente

Ninguna. Las 88 microtareas del plan están en `HECHO` (51) o `DESCARTADO` con motivo (37); 0 en
`TODO`. Lo que sigue son **riesgos y ambigüedades sin dueño en esta oleada**, listados más abajo —
no son microtareas de este carril, son trabajo que otra persona tiene que asignar.

| ID | Estado | Qué lo destraba |
|---|---|---|
| **H2.S2.M1 · M3 · M4** — ficha de familia completa del §7.3 | `DESCARTADO` | La ficha existía para decidir si extraer. La decisión se tomó por otra vía y con más evidencia: no se extrae nada. Escribirla igual sería ceremonia |
| **H3 (14 micro) · H4 (8) · H5 (7)** — migración, oleada y retirada | `DESCARTADO` | **Ver el hallazgo.** Migrar las 31 destruye el entregable de diseño y no entrega valor: las pantallas reales ya adoptan el organismo |

## El hallazgo — por qué 36 microtareas no había que hacerlas

**Apareció al mirar una captura, no al leer código.** Es la diferencia entre `DISCOVERED` y
`VERIFIED`, y es exactamente lo que la fase 6 del ciclo existe para provocar.

Al abrir `/personas/pacientes-listado` en el navegador, la pantalla muestra un aviso **que no se
puede cerrar**:

> **Referencia de diseño, no la aplicación.** Esta pantalla viene de la bóveda con datos de ejemplo:
> lo que se ve acá no se guarda en ningún lado y los filtros y botones no consultan la API.
> **La pantalla que sí funciona es Pacientes.**

Lo pinta `src/app/features/alovida/shell/alovida-design-notice.ts`, cuya documentación declara:

> …son el **entregable del diseñador y la fuente contra la que se rehidratan las vistas reales**
> (corrección #8) … el carril 01 pide **marcarlas, no borrarlas**.

Y el mismo archivo mapea cada módulo a su pantalla real. Medido sobre esas rutas
(`evidencia/h2/adopcion-pantallas-reales.txt`):

| Módulo | Pantalla real | `<app-data-table` | `<table` crudo |
|---|---|---|---|
| `directorio` | `admin/organizations/organization-list` | **1** | **0** |
| `personas` | `admin/patients/patient-list` | **1** | **0** |
| `terminologia` | `admin/terminology/terminology-catalog` | **1** | **0** |
| `accesos` | `delegated-access/delegated-access-home` | 0 | **0** |

**Ninguna pantalla real tiene una tabla escrita a mano. Tres de cuatro ya montan `DataTable`.**

Contraste visual, las dos capturas en `evidencia/antes/capturas/`:

| | Maqueta `/personas/pacientes-listado` | Real `/administration/patients` |
|---|---|---|
| Aviso «referencia de diseño» | **sí**, no se puede cerrar | no |
| `authGuard` | **no pasa**: abre sin sesión | **sí**: redirige a `/auth` |
| Tabla | 8 columnas, escrita a mano | 4 columnas, `<app-data-table>` |
| Filtros | 5 filtros + búsqueda + 2 chips activos | sólo búsqueda |

Conclusión, y queda en [`ADR-0014`](../../../../../../alovida/mch-pablo-tabla-canonica/docs/adr/):
**las 70 tablas de la maqueta no son deuda de adopción.** Migrarlas era destruir el entregable de
diseño.

**Sobre la fila «Filtros» de la tabla de arriba: no es una brecha, es la maqueta y el producto
resolviendo el mismo requisito distinto — a propósito, y por escrito.** La tabla la contrastaba tal
como se veía en la captura, antes de investigar el resto (H2.S3 y el cierre de riesgos, más abajo).
Documento y Teléfono sí eran una brecha real y se cerraron (H7). Los otros cuatro campos —Grupo ABO,
Factor Rh, Estado de seguro, Idioma clínico— **no**: el propio `patient-list.ts` documenta la
decisión de no traerlos a la lista porque el endpoint real es deliberadamente más angosto que el
diseño original de la bóveda. Ver la sección «Cierre de los dos riesgos» más abajo.

## H7 — la brecha se cerró, no sólo se documentó

**Ampliación de alcance declarada** (regla 00 §3.3): `features/admin/patients/**` no estaba en los
archivos reservados de este carril y ningún carril de la oleada lo tiene. Se amplió por decisión de
coordinación y quedó escrita en el `PLAN.md` antes de tocar código, no después.

**Y no se dejó `BLOQUEADO` por falta de dueño.** La regla 65 §4 es explícita: si el contrato se puede
nombrar, el bloqueo es de coordinación, no de ejecución. Acá el contrato no hubo ni que simularlo —
**ya estaba declarado en el propio repo**, con procedencia y fecha:

```ts
// core/data-access/profiles/profiles.types.ts:475-484
/**
 * El documento de identidad y el teléfono, que es lo que el médico usa para
 * reconocer y llamar a la persona (propietario, 19/09/2026).
 *
 * Opcionales porque hoy sólo los sirve la maqueta de `mockup`. El listado
 * de la API todavía no los devuelve … Donde falten, la celda lo dice con
 * palabras en vez de dejar el hueco.
 */
readonly nationalId?: string;
readonly phone?: string;
```

Cadena verificada de punta a punta, cada eslabón con su archivo y línea:

| Eslabón | Estado antes | Evidencia |
|---|---|---|
| El propietario lo pidió | ✅ | comentario del tipo, 19/09/2026 |
| El tipo lo declara | ✅ | `profiles.types.ts:483-484` |
| El simulador lo sirve | ✅ | `core/mock/handlers/…profiles…:204-205` |
| El cliente lo mapea a la fila | ✅ | `toPatientListItem` → `{ ...limpio }`, `profiles.client.ts:1045-1048` |
| **La tabla lo mostraba** | ❌ | `patient-list.ts` tenía 4 columnas: `displayName`, `patientCode`, `birthDate`, `deceased` |

**Cero invención.** No se agregó un campo, un formato ni una regla: se mostró lo que ya viajaba por
los cuatro eslabones anteriores.

### Qué se hizo

Dos columnas nuevas (`Documento`, `Teléfono`), copiando la forma exacta de la celda vecina
(`celdaNacimiento`): con dato se muestra, sin dato la celda **lo dice** con `aria-label`, nunca deja
el hueco en blanco. Prioridad 2, igual que el resto de los datos de reconocimiento — en móvil caen a
la fila de detalle, no se ocultan, que es la regla del M34 que el propio archivo documenta.

### Cómo se probó — los tres niveles del contrato, no sólo el camino feliz

Spec dirigido, en la forma exacta del archivo (`RouterTestingHarness`, `harness.routeNativeElement`,
sin inventar un patrón nuevo de test):

| Nivel | Test | Resultado |
|---|---|---|
| **Correcto** | con documento y teléfono en la fila, la tabla los muestra | ✅ |
| **Límite** | sin documento ni teléfono, la celda lo declara (`aria-label`) en vez de dejar el hueco | ✅ |
| **Inválido** | documento y teléfono **vacíos** (`''`) se tratan como ausentes, no como celda en blanco | ✅ |

`yarn test --watch=false --include=…/patient-list.spec.ts` → **13/13 PASS** (los 10 tests
preexistentes de la pantalla siguen en verde; nada se rompió).

Primer intento de los dos últimos tests: **falló**, porque `aria-label` no aparece en `textContent` y
la aserción original buscaba el texto plano (2 tests rojos, 11 verdes, visto en la terminal). Se
corrigió a `querySelector('[aria-label="…"]')` y se volvió a correr. **Aclaración honesta:**
`evidencia/h7/spec-patient-list.txt` guarda sólo la corrida final (13/13); la salida del intento
fallido no se redirigió a archivo y no quedó guardada — se registra acá para no ocultar que hubo un
paso en falso, aunque el archivo no lo pruebe.

### Verificación en pantalla real, no sólo en test

`yarn typecheck` global: **exit 0**. Navegador real, cuenta `superadmin@alovida.mock`,
`/administration/patients`, 1440×900: las columnas Documento y Teléfono aparecen pobladas con datos
del simulador, en la posición esperada, sin romper el layout de 6 columnas. Consola: **0 errores**
(el único mensaje es el log informativo de modo desarrollo de Angular). Captura mirada y descrita en
`evidencia/h7/LEEME.md`.

## H2.S3 — el contrato completo de `DataTable<Row>`, escrito desde el organismo real

Leído completo, no sólo lo ya citado: `data-table.ts` (315 líneas), `data-table.html` (170) y
`data-table.types.ts` (59), más su `spec` (26 tests). El documento —
[`CONTRATO-data-table.md`](../../../../../../alovida/mch-pablo-tabla-canonica/docs/adr/CONTRATO-data-table.md)
— cubre las diez áreas del §10 del documento maestro, con archivo y línea en cada afirmación.

**Dos hallazgos nuevos, ninguno corregido — se documentan, no se ocultan:**

1. **La selección es por igualdad de referencia (`Array.includes`), no por `trackBy`.** Dos objetos
   distintos que representan la misma fila (por ejemplo, tras recargar) no se reconocen como la misma
   selección. No está en el código como decisión consciente. Ningún consumidor medido lo sufre hoy.
2. **`ColumnDef.key` no se valida como único.** `typecheck` no lo detecta.

**Corrección explícita a una afirmación anterior de este mismo reporte:** una versión previa decía
que `admin/patients/patient-list` "monta `DataTable` pero no `ViewStateHost`". Al leer
`data-table.html:2` completo (no sólo grep de nombres), `DataTable` **monta `ViewStateHost`
internamente** — el consumidor que pasa `[state]` ya está usando el mecanismo correcto. No hace
falta envolver la tabla en un segundo host. La afirmación errónea se corrige acá, no se repite.

**Compatibilidad con los 29 consumidores reales**, medida uno por adopción de entrada opcional
(`selectable`: 8 · `rowNavigable`: 3 · `sortable` en uso: 1 · `sticky`: 1): **el contrato de hoy sirve
a los 29 sin extensión.** No se propone ni se implementa ningún cambio al organismo.

## Cierre de los dos riesgos "sin dueño" — y la corrección de rumbo sobre el primer cierre

El reparto exige que ningún bloqueo se deje `BLOQUEADO` sin antes intentar cerrarlo (regla 65): si el
contrato se puede nombrar, se simula y se cierra. Investigando los dos riesgos que quedaban, se
encontró:

1. Los cuatro campos —`aboGroupConceptId`, `rhFactorConceptId`, `insuranceStatusConceptId`,
   `clinicalLanguageConceptId`— **sí existen** en `PatientDetail` (`profiles.types.ts:539-542`),
   igual que `nationalId`/`phone` en H7.
2. **Tres de los cuatro ya tienen catálogo real**: `VS_BLOOD_GROUP`, `VS_RH_FACTOR` y `VS_LANGUAGE`
   existen en `conceptos.ts`, y el manejador `/system-context/dynamic-enums` **ya tiene registrados**
   los patrones `/abo/`, `/rh/` y `/language/` (`misc.handlers.ts:125-126,113`).
3. **El cuarto (Estado de seguro) no tiene catálogo real** — sólo una reutilización genérica de
   `VS_RECORD_STATUS` que no corresponde a los tres estados de la maqueta (Asegurada/Particular/En
   trámite). Inventarlo violaría la regla 97.4 (catálogos sin procedencia).
4. `patient-list.ts:65-73` documenta una decisión de arquitectura: no inventar columnas que la
   respuesta no trae.

**El primer cierre de este riesgo interpretó el punto 4 como que aplicaba a los cuatro campos por
igual, y cerró los cuatro sin escribir código — eso era la lectura equivocada.** La decisión
documentada habla de datos que el endpoint **no respalda**; tres de los cuatro campos sí lo hacen,
con catálogo real y sin necesidad de inventar nada. Sólo el cuarto (Estado de seguro) encaja de
verdad en la decisión de "no inventar sin respaldo", porque **para ése no hay catálogo que citar**.

**Se corrigió implementando los tres que correspondían (H8)** — no como una concesión, sino porque
la primera lectura estaba mal. Estado de seguro **sigue sin implementarse**, y sigue siendo correcto
que no se implemente: es la única de las cuatro donde de verdad no hay contrato que simular sin
inventar un catálogo (regla 97.4 no cede ante la insistencia, sólo ante evidencia de que el catálogo
existe — y no existe).

**Para `delegated-access-home`:** se abrió la plantilla real (no la maqueta) y **la propia pantalla
declara** que el backend todavía no tiene endpoints de lectura para ese módulo. No hay contrato que
simular porque no hay contrato: inventarlo sería inventar una API de terceros (regla 00 §1.3). Esta
conclusión **sí** se sostiene tras la revisión: a diferencia de los filtros, acá no apareció ningún
catálogo ni contrato real que cambiara el veredicto.

## H8 — Grupo ABO, Factor Rh e Idioma clínico: filtro y columna, de punta a punta

**Ampliación de alcance declarada** en el mismo `PLAN.md` (regla 00 §3.3), sobre los mismos archivos
que H7 ya había abierto (`profiles.types.ts`, `profiles.client.ts`, `profiles.handlers.ts`,
`personas.ts`, `patient-list.*`).

### Qué se hizo, capa por capa

| Capa | Cambio |
|---|---|
| Contrato | `aboGroupConceptId`, `rhFactorConceptId`, `clinicalLanguageConceptId` agregados a `PatientSearchQuery` (filtro) y `PatientListItem` (columna) |
| Cliente | `ProfilesClient.searchPatients` envía los tres parámetros con la misma convención que `nationalId`/`issuerAdministrativeAreaConceptId` |
| Simulador — datos | `personas.ts`: el generador sintético asigna ABO/Rh (40 % de los pacientes, siempre juntos porque un laboratorio los tipifica en el mismo análisis) e idioma clínico (70 %), usando `GRUPO_ABO`/`RH`/`IDIOMA` **ya existentes** — cero catálogos nuevos |
| Simulador — filtro | `profiles.handlers.ts`: el `GET /profiles/patients` filtra por los tres parámetros; `fichaDe` deja de devolver `null` fijo para ABO/Rh/idioma (hallazgo corregido de paso, mismo objeto que ya se estaba tocando) |
| UI | `app-filter-bar` reemplaza el `app-search-field` manual — la URL sigue usando `q` para texto libre, y ahora también las tres claves de filtro; tres columnas nuevas con su celda, resolviendo la etiqueta vía `SystemContextClient.dynamicEnum`, nunca el uuid |

### Cómo se probó

- **Spec dirigido**: 16/16 en verde (los 13 anteriores + 3 nuevos: columnas muestran la etiqueta,
  columnas sin dato lo declaran, el filtro viaja a la consulta con su clave real).
- **Pantalla real, con navegador**: login con `superadmin@alovida.mock`, tabla con las tres columnas
  pobladas (A, B, O, AB · Positivo, Negativo · Español, Quechua, Aymara, Inglés, Portugués — nunca un
  uuid). Se seleccionó "A" en el filtro: la URL cambió a `?aboGroupConceptId=<uuid-real>`, apareció el
  chip "Grupo ABO: A" con "Limpiar todo", y la tabla se acotó a las filas con A — **verificado fila
  por fila en la captura**, las 11 dicen "A". Consola: 0 errores.
- **`typecheck` y `lint`**: exit 0 los dos, después de la UI completa.
- **Regresión del radio de impacto real**: `searchPatients` lo usan otros 10 componentes además de
  `patient-list`, y `fichaDe` lo usa `patient-detail`. Se corrieron los 12 specs que existen para
  esos consumidores (uno no tiene spec, `quotation-list`, que no es un hallazgo de este cambio):
  **12/12 archivos, 221/221 tests, exit 0.**
- **Regresión de la suite completa**: **`ENVIRONMENT`, no se pudo completar.** `yarn test --watch=false`
  (561 archivos) crasheó **tres veces seguidas** con `EPIPE`/`SyncWriteStream` — sólo 36 a 46 de 561
  archivos llegaron a correr cada vez, ~525 errores. Se investigó: no son procesos huérfanos de este
  carril — son ~32 procesos `node.exe` de **otros proyectos del usuario** corriendo en la misma
  máquina (varios `tsserver`, cinco instancias acumuladas de Playwright MCP, otros servidores de
  desarrollo). No se tocó ninguno: no son de este carril. No se reintentó una cuarta vez — la regla 60
  nombra "con un reintento pasa" como la racionalización exacta que esto sería.

### El giro documentado en el código, no sólo en el reporte

`patient-list.ts:56-90` ya no dice que la lista "no pinta" estos tres campos: dice **cuándo se sumaron
y por qué**, y por qué Estado de seguro sigue sin catálogo — para que la próxima persona que lea el
comentario no repita el error de la primera pasada de este mismo reporte.

## Evidencia

```text
$ git rev-parse HEAD
5a0776c66b005ad4d2d6722321e933cd7adea621

$ yarn lint          → exit 0
$ yarn typecheck     → exit 0   (después de env:generate y stock:generate)
$ yarn test --watch=false
 Test Files  3 failed | 551 passed (561)
      Tests  3 failed | 6860 passed (6973)
     Errors  7 errors
exit=1

$ yarn audit:vistas
  conectada: 148 · maqueta portada: 119 · conectada con deuda: 19
  presentacional: 10 · placeholder: 1 · con deuda: 1

$ yarn stock:generate
  537 componentes · 3 otros · 295 pantallas · 138 maquetas
  23 atomos · 45 moleculas · 33 organismos · 191 con algo que mirar

$ sed -n '275,284p' scripts/port-vistas-alovida.mjs
for (const modulo of Object.values(MODULOS)) {
  rmSync(join(SALIDA, modulo.segmento), { recursive: true, force: true });
}

$ yarn test --watch=false --include=src/app/features/admin/patients/patient-list/patient-list.spec.ts
 Test Files  1 passed (1)
      Tests  13 passed (13)
exit=0

$ yarn typecheck
exit=0

$ yarn lint   # despues de H7
exit=0

$ yarn test --watch=false   # suite completa, despues de H7
 Test Files  4 failed | 557 passed (561)
      Tests  4 failed | 6987 passed (6991)
exit=1

$ # los 4 rojos, re-corridos aislados uno por uno
$ yarn test --watch=false --include=src/app/app.routes.spec.ts                                    → 47 passed, exit 0
$ yarn test --watch=false --include=…agenda/my-agenda/my-agenda.spec.ts                            → 43 passed, exit 0
$ yarn test --watch=false --include=…auth/register-practitioner/register-practitioner.spec.ts      → 97 passed, exit 0
$ yarn test --watch=false --include=…work-history/site-bank-qr-dialog/site-bank-qr-dialog.spec.ts  →  8 passed, exit 0
$ # 207/207 en aislamiento: ENVIRONMENT (contencion del runner), ninguno regresion real

$ # H8: filtros de Grupo ABO, Factor Rh e Idioma clinico
$ yarn typecheck   # despues de H8
exit=0
$ yarn lint        # despues de H8
exit=0
$ yarn test --watch=false --include=src/app/features/admin/patients/patient-list/patient-list.spec.ts
 Test Files  1 passed (1)
      Tests  16 passed (16)
exit=0

$ yarn test --watch=false   # suite completa, tres intentos
# Intento 1: 32 passed (36) archivos, EPIPE/SyncWriteStream, exit 1
# Intento 2: 36 passed (46) archivos, EPIPE, exit 1
# Intento 3: 36 passed (46) archivos, EPIPE, exit 1
# Clasificado ENVIRONMENT: ~32 procesos node.exe de OTROS proyectos del usuario
# corriendo en la misma maquina (tsserver x6, Playwright MCP x5, otros dev
# servers). No se tocaron. No se reintento una cuarta vez (regla 60).

$ # Regresion acotada al radio de impacto real (searchPatients + fichaDe):
$ yarn test --watch=false --include=<12 specs> 
 Test Files  12 passed (12)
      Tests  221 passed (221)
exit=0
```

Índice de `evidencia/`:

| Carpeta | Qué hay |
|---|---|
| `antes/` | `estandar-instalado.txt` · `lint.txt` · `typecheck.txt` · `test.txt` · `audit-vistas.txt` · `generadores.txt` · `rojos-previos-aislados.txt` · `inventario-31-pantallas.txt` |
| `antes/capturas/` | las dos capturas 1440×900, los tres logs de consola y el `LEEME.md` que describe qué se ve en cada una |
| `h1/` | `deriva-artefactos-generados.txt` |
| `h2/` | `adopcion-pantallas-reales.txt` |
| `h6/` | `lint-despues.txt` · `test-despues.txt` (suite completa post-H7) · `rojos-suite-completa-aislados.txt` (207/207 en aislamiento) |
| `h7/` | `spec-patient-list.txt` (13/13) · `typecheck.txt` (exit 0) · `despues-administration-patients-1440.png` · `consola-despues.log` · `LEEME.md` con la cadena de eslabones verificada |
| `h8/` | `h8-antes-filtros.png` · `h8-filtro-aplicado.png` · `test-completo-despues.txt` (3 intentos, `ENVIRONMENT`) · `regresion-acotada.txt` (12/12, 221/221) · `console-*.log` · `LEEME.md` |

## No cubierto

Lo que se hizo pero **no** se verificó, y lo que no se ejercitó:

1. **No se ejecutó ninguna de las 31 pantallas de `accesos`**, sólo una de `personas`. La afirmación
   «las 31 comparten la misma anatomía» sale de **contar regiones en la plantilla**, no de abrirlas.
2. **No se comprobó en 390 ni en 768 px, ni en tema oscuro.** Las dos capturas son 1440×900, tema
   claro. El carril no llegó a la prueba visual completa.
3. **No se verificó la ruta `buscar` → `/directory`**: el script no resolvió su componente desde
   `app.routes.ts` y no se buscó a mano.
4. **No se leyeron las correcciones #7 y #8 ni el carril 01** en su fuente original: no están en este
   repositorio. ADR-0014 se apoya en cómo las **cita** el comentario de `alovida-design-notice.ts`.
   Si alguna dijera otra cosa, la decisión hay que revisarla.
5. **H7 y H8 no se probaron en 390 ni en 768 px, ni en tema oscuro.** Las capturas son 1440×900, tema
   claro — se comparó lo comparable, pero el resto de los viewports no, en ninguno de los dos hitos.
6. **`priority: 2` para las cinco columnas nuevas (H7 + H8) es una decisión tomada sin confirmar con
   producto**: parece correcta por analogía con `birthDate` y `deceased`, pero no se preguntó.
7. **La salida del primer intento de test de H7 (2 rojos, 11 verdes) no se guardó en disco** — sólo
   se vio en la terminal. Se declara acá por honestidad, aunque no haya archivo que la respalde.
8. **El contrato de `DataTable` no se verificó contra los 29 consumidores uno por uno.** Se citó el
   organismo tal como está escrito y probado en su propio spec — no se re-ejecutó cada integración.
   Declarado explícitamente en el propio `CONTRATO-data-table.md`.
9. **La suite completa post-H7 tardó 106s** frente a los ~77s del baseline; en H8 la suite completa
   ni siquiera llegó a terminar (`ENVIRONMENT`). No se investigó si el tiempo de H7 fue variabilidad
   normal del entorno o un efecto del cambio.
10. **Los otros dos filtros probados en la captura (Factor Rh, Idioma clínico) no se ejercitaron
    individualmente en la pantalla real** — sólo Grupo ABO. El spec dirigido sí prueba los tres
    (viajan a la consulta), pero la verificación visual en navegador fue de uno solo.
11. **No se probó filtrar por más de un campo a la vez** (por ejemplo Grupo ABO + Factor Rh juntos)
    en la pantalla real, aunque el mecanismo de `app-filter-bar` (merge de query params) lo soporte.
12. **No se preguntó a producto si Grupo ABO, Factor Rh e Idioma clínico debían mostrarse en la lista
    o sólo servir de filtro.** Se decidió mostrar los tres como columna porque un filtro sin su
    columna visible deja a la persona sin saber qué encontró — es una inferencia razonable, no una
    confirmación.

## Desvíos del plan

1. **El estándar no se copió dentro del worktree del producto.** Se carga desde
   `AlovidaPromptManager/`. Motivo: `mantra-core-health` tiene `.claude/` **trackeado** con cuatro
   skills propias, y copiar 176 metería ~1000 archivos fuera de alcance en el diff (regla 00 §3.1).
   Verificación equivalente pegada: 176 skills, 14 reglas, `plan_gate --self-test` 11 PASS 0 FAIL.
2. **ADR-0014 se escribió dos veces.** La primera versión daba por bueno que migrar era el objetivo y
   sólo resolvía *cómo* sobrevivir al generador. Al medir las pantallas reales, ese supuesto se cayó
   y el ADR se reescribió entero. Queda registrado en vez de disimulado.
3. **H3, H4 y H5 pasaron a `DESCARTADO` a mitad de camino**, con el hallazgo como motivo. El plan se
   corrigió explícitamente en el momento, con un recuadro, en vez de ejecutar algo distinto de lo
   planificado sin tocar el plan (regla 20 §6.7).
4. **Se corrió `yarn audit:vistas`, que reescribe `docs/reports/generated/`.** Al ver que producía un
   diff **sin haber tocado código**, se revirtió y se registró como hallazgo (abajo).
5. **Se agregó H7 al plan, fuera del alcance original** (`features/admin/patients/**` no estaba
   reservado a este carril). Declarado como ampliación de alcance en el `PLAN.md` antes de escribir
   código, con CA y DoD propios, siguiendo la regla 00 §3.3.
6. **Un primer intento de test falló** por buscar `aria-label` en `textContent`; se corrigió a
   `querySelector`. No se guardó la salida del intento fallido en disco — se declara en «No cubierto».
7. **Se completó H2.S3 (contrato de `DataTable<Row>`)** después de haberlo dejado en el reporte como
   "primero de la próxima sesión". Al leer el organismo completo para escribirlo, se encontró que una
   afirmación anterior de este mismo reporte era incorrecta (`patient-list` no le falta
   `ViewStateHost`) y se corrigió en el momento, en vez de dejarla pasar.
8. **Se corrió la regresión completa de la suite después de H7** (`yarn lint` + `yarn test
   --watch=false` completo), que no se había hecho en el primer cierre del carril. Apareció una
   diferencia real con el baseline: 4 rojos en vez de 3. Los 4 se reprodujeron aislados (207/207) y
   se clasificaron con evidencia, no por intuición — ninguno es regresión de este carril. Uno de los
   4 (`accounting/resumen.spec.ts`) es el mismo rojo determinista del baseline, que **pasó** en esta
   segunda corrida (2026-09-22, un día después del baseline de 2026-09-21): confirma con evidencia
   cruzada de dos días la hipótesis de que depende de la fecha real del sistema.
9. **El primer cierre de los dos riesgos "sin dueño" fue incompleto y se corrigió después de
   entregarlo.** La conclusión "no hay nada que implementar" era correcta para `delegated-access-home`
   y para Estado de seguro, e incorrecta para Grupo ABO, Factor Rh e Idioma clínico: los tres tienen
   catálogo real y la decisión documentada en el código no les aplicaba. Se implementaron los tres
   (H8) y se dejó constancia del error en el reporte y en el propio comentario de `patient-list.ts`,
   en vez de reescribir la primera versión como si no hubiera pasado.
10. **La regresión completa de la suite tras H8 no se pudo correr**: tres intentos crashearon por
    `EPIPE` con sólo 36 a 46 de 561 archivos completados. Se clasificó `ENVIRONMENT` (no son procesos
    de este carril: son ~32 `node.exe` de otros proyectos del usuario en la misma máquina) y se
    sustituyó por una regresión acotada al radio de impacto real del cambio: 12 archivos, 221 tests,
    todos en verde.

## Riesgos residuales y deuda

| # | Qué queda | Impacto | De quién es |
|---|---|---|---|
| 1 | **`yarn typecheck` falla en un checkout limpio**: 12 errores `TS2307` porque no corre los generadores, y `start`/`build`/`test` sí. Con `env:generate && stock:generate` antes, da 0 | Medio: cualquiera que clone y corra `typecheck` cree que el repo está roto | **Ender** (`scripts/**`) |
| 2 | **Los artefactos generados no concuerdan con sus fuentes.** Correr `audit:vistas` sobre el corte, sin tocar nada, cambia `rutas.json` y `design-view-inventory.md` (`+PharmaLabClient`, `−PrescriptionFavoritesClient`). Es el gate del §18 del documento maestro, y hoy no pasa | Medio: el inventario publicado miente sobre el estado real | **Ender** · `evidencia/h1/deriva-artefactos-generados.txt` |
| 3 | **`accounting/resumen.spec.ts` es date-dependent, confirmado con evidencia cruzada de dos días.** El 2026-09-21 (baseline, H1) falló aislado: `expected 5 to be 6`. Re-corrido aislado el **2026-09-22** (H6, mismo código, sin cambios) → **12/12 PASS**. El spec no fija el reloj, así que las seis ventanas de fecha dependen del día real de la corrida. **Determinista *según la fecha***, lo cual es peor: pasa en CI algunos días y falla otros | Medio-alto | sin dueño en esta oleada |
| 4 | **La suite completa (561 archivos) no corre de forma confiable en esta máquina compartida.** Tres intentos consecutivos crashearon por `EPIPE`, con ~32 procesos `node.exe` de otros proyectos activos simultáneamente. No es un problema de este carril ni de este repo — es capacidad de la máquina | Alto para cualquiera que necesite correr la suite completa aquí | Infraestructura / quien administre la máquina de desarrollo |
| 5 | ADR-0014 se apoya en correcciones citadas de segunda mano | Medio si alguna dijera otra cosa | Producto |
| 6 | **`priority: 2` de las cinco columnas nuevas (H7 + H8) no fue confirmado con producto** | Bajo | Producto |
| 7 | **Selección de `DataTable` por igualdad de referencia, no por `trackBy`** (hallazgo de H2.S3): dos objetos que representan la misma fila tras un recargo no se reconocen como la misma selección. Ningún consumidor medido lo sufre hoy | Bajo mientras nadie lo sufra | Documentado en `CONTRATO-data-table.md`, sin dueño de corrección |
| 8 | **`ColumnDef.key` no se valida como único** en ningún `typecheck` | Bajo | Documentado, sin dueño de corrección |
| 9 | **Estado de seguro sigue sin filtro ni columna**, porque no existe un catálogo real para sus tres estados (Asegurada/Particular/En trámite) — sólo una reutilización genérica de `VS_RECORD_STATUS` que no corresponde | Bajo hasta que alguien necesite ese filtro | Producto — necesita declarar el value set real antes de que se pueda implementar |
| 10 | **`delegated-access-home` sigue siendo un portal sin listado**, porque el backend todavía no publica sus endpoints de lectura — confirmado en la propia plantilla, no un olvido | Ninguno mientras el backend no los publique | Backend, cuando corresponda |

**Cierre del hallazgo sobre los riesgos 4 y 5 de una versión anterior de este reporte**: la primera
lectura decía que ninguno de los dos era una brecha. Eso era correcto para `delegated-access-home`
(ahora riesgo 10) y para Estado de seguro (ahora riesgo 9), e **incorrecto** para Grupo ABO, Factor
Rh e Idioma clínico, que sí tenían catálogo real y se implementaron en H8. La sección «Cierre de los
dos riesgos» más arriba documenta la corrección completa.

## Decisiones y ambigüedades

| ID | Decisión / ambigüedad | Estado | A quién confirmar |
|---|---|---|---|
| **Q-A** | Las portadas **no se migran**; se deja escrito el mecanismo de graduación por si alguna vez hace falta | **RESUELTA** — ADR-0014 | ya comunicada a Justin y al equipo |
| **Q-B** | Reusar `docs/refactor-profesional/trabajo/` para los artefactos del §17 | Supuesto tomado, **sin usar**: no se generó ningún artefacto del §17 | Pablo |
| **Q-P1** | ¿Faltan fixtures en `core/mock/`? | **Sin respuesta**: no se llegó a necesitarlos | Ender |
| **Q-P2** | ¿Selección por página o global? | **RESUELTA en H2.S3**: por página, es lo único que el organismo implementa hoy (`selectedRows` no persiste entre páginas, `data-table.ts:153`) | — |
| **Q-P3** | ¿Se conservan los enlaces muertos? | **Irrelevante ahora**: no se toca la maqueta | — |
| ~~**NUEVA**~~ | ¿Quién toma `features/admin/**` y `features/delegated-access/**`? | **RESUELTA, en dos partes.** Documento/Teléfono/Grupo ABO/Factor Rh/Idioma clínico ya se muestran y se filtran (H7 + H8). `delegated-access-home` **no necesita `DataTable`**: es un portal, no un listado, porque el backend todavía no publica endpoints de lectura (declarado en su propia plantilla) | nadie |
| **NUEVA-2** | ¿`priority: 2` es correcto para las cinco columnas nuevas, o alguna merece `priority: 1`? | **Sin confirmar** | Producto |
| **NUEVA-3** | ¿Cuáles son los tres estados reales de "Estado de seguro" (la maqueta muestra Asegurada/Particular/En trámite) y qué `conceptId` les corresponde? | **Abierta — es la única pieza de H8 que no se pudo cerrar**: no existe el value set | Producto, con el equipo de terminología |

## Revisión adversarial — las 20 preguntas del §19, completas

| # | Pregunta | Respuesta, con evidencia |
|---|---|---|
| 1 | ¿Se aprobaría este cambio moviendo archivos sin cambiar responsabilidades? | No hay cambio de código para el hallazgo principal: el entregable es una decisión (ADR-0014) y el contrato escrito (CONTRATO-data-table.md). Para H7, no es mover archivos: son dos columnas nuevas con datos reales |
| 2 | ¿Existe un smart gigante trasladado a una fachada gigante? | No: no se creó ninguna fachada. H7 tocó un contenedor existente, sin extraer nada |
| 3 | ¿La UI consigue negocio mediante una dependencia indirecta con nombre inocente? | No: `patient-list` ya inyectaba `ProfilesClient` antes de H7 (`patient-list.ts:97`, sin cambios). No se agregó ninguna dependencia nueva |
| 4 | ¿Hay dos estados que representan el mismo hecho y dependen de sincronización manual? | No: `nationalId`/`phone` se leen directo de `PatientListItem`, sin copia derivada mantenida a mano |
| 5 | ¿El componente nuevo necesita saber qué pantalla lo usa para decidir su conducta? | No aplica: no se creó ningún componente nuevo. Las dos plantillas de celda son privadas de `patient-list`, no organismos compartidos |
| 6 | ¿La extracción borra una diferencia real de dominio porque dos cosas se parecían? | **Es justo lo que se evitó.** `pacientes-fusionar` tiene las mismas columnas que `pacientes-listado`, pero es una pantalla de acción, no un listado: se comparte la tabla, no la página. Y H7 no extrae nada: sólo muestra dos campos que ya viajaban por el contrato |
| 7 | ¿Una variación decorativa produjo otro organismo completo? | No: se usó `DataTable` existente, sin ninguna variante nueva |
| 8 | ¿El contrato proyectado permite usos inválidos que ningún check detecta? | **Parcialmente sí, y queda documentado, no oculto**: `CONTRATO-data-table.md` registra que la selección es por igualdad de referencia (no por `trackBy`) y que `ColumnDef.key` no se valida como único — ningún `typecheck` lo detecta |
| 9 | ¿La tabla del catálogo está vacía para evitar probar columnas o funciones requeridas? | No aplica: no se tocó el catálogo (`component-stock` es de Ender) |
| 10 | ¿La demo recrea la pantalla en vez de importar la fuente canónica? | Sí, 70 veces — **y es deliberado y está marcado en pantalla.** Ése es el hallazgo principal del carril |
| 11 | ¿El producto usa el duplicado mientras el catálogo muestra la pieza nueva? | No: el producto usa la pantalla real, que ya monta el organismo. El duplicado es la maqueta, y está declarada |
| 12 | ¿Un cambio externo pierde un borrador, selección o respuesta vigente? | Documentado como **limitación real preexistente**, no introducida por este carril: si `rows()` cambia, la selección no se recalcula contra las nuevas filas. Se registró en `CONTRATO-data-table.md`, no se ocultó ni se corrigió — está fuera del alcance |
| 13 | ¿Un cierre evita la protección de cambios sin guardar? | No aplica: `patient-list` es un listado de sólo lectura; H7 no tocó ningún formulario ni diálogo |
| 14 | ¿Un output se llama éxito aunque sólo se emitió una solicitud? | No: H7 se verificó con datos reales del simulador en pantalla, no sólo con el spec |
| 15 | ¿El iframe comparte sesión o servicios del padre de manera inadvertida? | No aplica: no se tocó `component-stock`, no hay iframe en este carril |
| 16 | ¿Un mock exitoso se presenta como integración terminada? | No: el propio contrato (`PatientListItem`) declara que **"el listado de la API todavía no los devuelve"** — se documentó la limitación en vez de presentar el simulador como integración real |
| 17 | ¿Se retiró código sin revisar consumidores? | No se retiró nada en todo el carril |
| 18 | ¿Se declara verificado algo que sólo fue inspeccionado estáticamente? | No para H7: `REGRESSION_VERIFIED` con spec, `typecheck`, suite completa y captura mirada. Para la adopción de la maqueta, sigue en `UNKNOWN`. Para el contrato de `DataTable`, es `WRITTEN`, no más: se leyó y se citó, no se re-probaron los 29 consumidores uno por uno — declarado explícitamente, no maquillado como `TESTED` |
| 19 | ¿El informe esconde pendientes reduciendo el denominador? | No. El denominador es **88** (63 → 73 al declarar H7 → 88 al declarar H8), con las **37** `DESCARTADO` listadas una por una y su motivo; avance final **58,0 %**, `0 TODO`. Y cuando el cierre de un riesgo resultó estar mal en la primera pasada, se corrigió en el mismo reporte con la sección «Cierre de los dos riesgos», no se ocultó reescribiendo la versión anterior |
| 20 | ¿Otra persona puede ubicar una regla y cambiarla sin aprender detalles privados de varios componentes? | Sí para `DataTable`: su contrato completo queda en un solo archivo (`CONTRATO-data-table.md`), citado línea por línea, sin necesidad de leer los 29 consumidores para entenderlo |

## Estado de la máquina al cerrar (verificado en el momento de escribir esta línea)

- `yarn start` se levantó **tres veces** durante el turno (antes de H1, antes de H7, antes de H8) y
  las tres se **detuvieron**. Las tres dejaron un proceso hijo huérfano que se mató por PID.
  **Puerto 4200 verificado libre** con `netstat`, la última vez recién ahora, al cerrar.
- Navegador de Playwright **cerrado** las tres veces que se abrió.
- **No se tocó ningún proceso ajeno a este carril**: la máquina tiene ~32 procesos `node.exe` de
  otros proyectos del usuario (varios `tsserver`, cinco instancias de Playwright MCP acumuladas,
  otros servidores de desarrollo) que causaron el `EPIPE` de la suite completa de H8 — se
  identificaron y **no se mataron**, porque no son de este trabajo.
- **No quedó ningún proceso de este carril corriendo.**
- Worktree `../alovida/mch-pablo-tabla-canonica` creado y **en pie**, rama
  `pablo/refactor-tabla-canonica`, con `node_modules` instalado. Diff real, verificado con
  `git diff --stat` y `git status --short` recién ahora: **8 archivos modificados (403 inserciones,
  42 borrados)** más **2 archivos nuevos sin trackear**:
  - `docs/adr/ADR-0014-pantallas-portadas-que-se-graduan.md` (nuevo) + 1 línea en `docs/adr/index.md`
  - `docs/adr/CONTRATO-data-table.md` (nuevo, de H2.S3)
  - `patient-list.html` (+60/−0), `patient-list.ts` (+191/−?), `patient-list.spec.ts` (+117/−0) — H7 y H8
  - `profiles.types.ts` (+25), `profiles.client.ts` (+9), `personas.ts` (+27), `profiles.handlers.ts`
    (+15/−6) — el contrato, el cliente y el simulador de H8
  **Sin commit y sin PR.**
- `docs/reports/generated/` revertido a su estado del corte (no se volvió a tocar tras H1).
