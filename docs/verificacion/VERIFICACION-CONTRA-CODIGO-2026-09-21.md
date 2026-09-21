# Verificación contra el código — refactorización frontend

> **Qué es esto:** los hechos del repositorio de frontend medidos contra un corte declarado, para que
> el reparto de [`REFACTOR-FRONTEND-2026-09-21.md`](../requisitos/REFACTOR-FRONTEND-2026-09-21.md) no
> reparta suposiciones. Cada fila trae **el comando que la produjo** o **archivo y línea**.
>
> **Lo que esta verificación NO hizo: ejecutar la aplicación.** No se levantó la maqueta, no se corrió
> un test, no se miró una captura. Todo lo de acá es lectura estática del árbol de git. Peldaño
> alcanzado: **`DISCOVERED`** (regla 30). Que un componente exista no prueba cómo se comporta.

## 0. El corte

| Campo | Valor |
|---|---|
| Repo | `alovida/mantra-core-health` |
| Ref | `origin/mockup` |
| SHA | `5a0776c66b005ad4d2d6722321e933cd7adea621` |
| Fecha del commit | 2026-09-21 17:35:32 -0400 |
| Asunto | `fix(deploy): el mockup deja de publicar el 4000 en todas las interfaces` |
| Comando | `git fetch origin && git log -1 --format='%H %ad %s' origin/mockup` |

> **Coincidencia relevante:** el documento maestro cita el SHA `5a0776c6…` como "referencia
> histórica". **Resultó ser la punta actual de `origin/mockup`**, no un commit viejo. O sea: los
> antecedentes del documento se escribieron contra el mismo árbol que vas a tocar.
>
> ⚠️ **El working copy local NO es la maqueta.** Al armar este documento el checkout estaba en
> `feat/admin-portal-frontend`. Todo número de línea de acá es de `origin/mockup`. Leelo así:
> `git show origin/mockup:<ruta> | sed -n '<n>,<m>p'`.

## 1. Stack — confirmado, no heredado

| Qué declara el antecedente | Qué dice `origin/mockup:package.json` | Veredicto |
|---|---|---|
| Angular `^21.2.0` | `@angular/core: ^21.2.0` | CONFIRMADO |
| Herramientas Angular `^21.2.11` | `@angular/ssr: ^21.2.11` | CONFIRMADO |
| Yarn `4.18.0` | `"packageManager": "yarn@4.18.0"` | CONFIRMADO |
| Vitest, Playwright y Cypress | `test: ng test` · `pw: playwright test` · `e2e: cypress run` | CONFIRMADO (los tres coexisten) |

Comando: `git show origin/mockup:package.json | sed -n '1,60p'`.

**Scripts que existen de verdad** (`package.json`): `start`, `build`, `test`, `test:coverage`,
`lint` (`eslint .`), `typecheck` (**tres** proyectos: `tsconfig.app.json`, `cypress/tsconfig.json`,
`playwright/tsconfig.json`), `stock:generate` (`node scripts/generate-component-index.mjs`),
`audit:vistas` (`node scripts/audit-design-views.mjs`), `pw`, `recorrido`.

> **Trampa medida:** `yarn start` y `yarn build` corren `yarn stock:generate` **antes** de compilar.
> O sea: **el índice del catálogo es una dependencia del build del producto.** Romper el generador
> rompe el arranque de todos.

## 2. Tamaño del alcance

| Medida | Valor | Comando |
|---|---|---|
| Archivos `.ts` bajo `src/app` | 1568 | `git ls-tree -r --name-only origin/mockup src/app \| grep -c '\.ts$'` |
| Plantillas `.html` bajo `src/app` | 520 | `git ls-tree -r --name-only origin/mockup src/app \| grep -c '\.html$'` |
| Carpetas de `features/` | 50 | `git ls-tree --name-only origin/mockup:src/app/features/` |
| Átomos · moléculas · organismos | **22 · 43 · 35** | `git ls-tree --name-only origin/mockup:src/app/shared/components/{atoms,molecules,organisms}/` |

## 3. El sistema de diseño YA EXISTE — y con los nombres del documento maestro

El documento maestro §9 propone una "lista inicial de candidatos". **Casi todos existen ya** como
organismo en `src/app/shared/components/organisms/`:

| Familia candidata del §9 | Pieza real en el repo | ¿Existe? |
|---|---|---|
| Tabla de datos / `DataTable<Row>` | `organisms/data-table/` | SÍ |
| Directorio / `DirectoryPage` | `organisms/directory-page/` | SÍ |
| Diálogo / `ContentDialog` | `organisms/content-dialog/` | SÍ |
| Host de estados / `ViewStateHost` | `organisms/view-state-host/` | SÍ |
| Búsqueda y filtros / `FilterBar` | `organisms/filter-bar/` | SÍ |
| Cabecera / `PageHeader` | `organisms/page-header/` | SÍ |
| Sección editable de datos | `organisms/fact-section/` + `molecules/fact-list/` | SÍ |
| Editor modal de formulario | `organisms/form-section/` + `form-actions/` + `paginated-form/` | SÍ |
| Adjuntos | `organisms/attachment-dialog/` **y** `attachment-uploader/` | SÍ, los dos |
| Grupos de preguntas | `organisms/survey-form/` + `molecules/radio-group/`, `checkbox-group/` | SÍ |

**Consecuencia para el reparto:** el trabajo NO es crear organismos. Es **adopción, separación de
responsabilidades y retirada de duplicados**. Quien cree un `DataTable` nuevo está violando la
regla 00 §1.1.

## 4. Adopción real de cada organismo — el número, no la impresión

Comando patrón: `git grep -l '<app-XXX' origin/mockup -- 'src/app/**/*.html' | wc -l`

| Selector | Archivos `.html` que lo instancian |
|---|---|
| `<app-page-header` | **171** |
| `<app-view-state-host` | **69** |
| `<app-data-table` | **29** |
| `<app-content-dialog` | **26** |
| `<app-form-section` | **25** |
| `<app-filter-bar` | **7** |
| `<app-directory-page` | **5** |
| `<app-fact-section` | **0** ← existe el organismo y **nadie lo instancia** |

> `fact-section` con 0 consumidores es un dato, no un veredicto: puede ser una pieza recién nacida o
> código muerto. **Antes de borrarlo hay que medir quién lo importa**, incluidos usos por tipo y por
> el catálogo (regla 00 §3.2 y `dead-code-duplication`).

## 5. El contrato de `DataTable<Row>` — ya es el que pide el documento

`src/app/shared/components/organisms/data-table/data-table.ts`, líneas 95-151:

| Línea | Miembro |
|---|---|
| 95 | `state = input.required<ViewState<readonly Row[]>>()` |
| 96 | `columns = input.required<readonly ColumnDef<Row>[]>()` |
| 99 | `trackBy = input.required<(row: Row) => string>()` ← identidad como **función**, como pide §12.3 |
| 102 | `caption = input<string>('')` |
| 109 | `rowLabel = input<((row: Row) => string) \| null>(null)` |
| 111 | `selectable` · 112 `sort` · 113 `cursor` |
| 115-117 | `sortChanged` · `cursorChanged` · `selectionChanged` |
| 132 · 137 | `rowNavigable` · `rowActivated` |
| 148 · 151 | `retry` · `refresh` |

`data-table.types.ts` líneas 23-55: `ColumnDef<Row>` con `key`, `header`, `priority`, `align`,
`sortable`, `sticky?: 'end'` y **`cell?: TemplateRef<{ $implicit: Row }>`** — o sea, la plantilla con
contexto tipado del §8.4 **ya está implementada**. `SortState` (44) y `CursorState` (53) con
`prevCursor`/`nextCursor`: **paginación por cursor, no por índice**.

## 6. `ViewState<T>` — 10 discriminantes, y la razón de cada uno está escrita

`src/app/core/view-state/view-state.types.ts` líneas 36-46:
`'route-auth-pending' | 'loading' | 'empty' | 'ready' | 'validation' | 'forbidden' | 'not-found' |
'stale' | 'offline' | 'error'`.

El antecedente del documento maestro acertó: **son 10**. El archivo además documenta las tres
distinciones que no son cosméticas (líneas 17-28): S1≠S2 (autorizar antes de pedir datos sensibles),
S5≠S6 (un «no tenés permiso» sobre un id confirma que el id existe), y S7 exige `asOf`.
`M34Code` (línea 49) fija la trazabilidad `S1`…`S9`.

> **Prohibido sustituirlo por `loading/error/success`.** Está dicho en el documento maestro §12.3 y
> acá queda demostrado que el contrato real es más rico.

## 7. Los tres riesgos del §13 del documento: los tres son REALES

### 7.1 `scripts/generate-component-index.mjs` — 394 líneas

| Riesgo que denuncia el §13 | Evidencia |
|---|---|
| Usa regex sobre el texto fuente | Líneas 46, 53, 60, 66, 87, 97, 112: `source.matchAll(/export const (\w+)…/g)` y compañía |
| Clasifica el nivel **por ruta** | Líneas 126-129: `function nivelDe(path)` → `if (path.includes('/shared/components/atoms/')) return 'atomo'` |
| Deduce la composición **por imports** | Líneas 289-300: `// Composición: de qué nivel es cada clase importada` + `nivelPorClase` |

**Por qué importa:** un `import` disponible no es una instancia (`imports-available` ≠
`template-instantiates`, §6 del documento). El índice de hoy **no puede distinguirlos**, y el build
del producto depende de él (§1 de acá).

### 7.2 `src/app/features/component-stock/component-stock.ts` — 539 líneas

| Hecho | Línea |
|---|---|
| Monta el componente **real** con `createComponent` | 8, 306 |
| Lo monta **dentro de un `iframe`**, y explica por qué | 38-41, 206, 255 |
| **Los estilos se copian desde el documento principal** | 325: comentario explícito sobre crear en el inyector **principal**, no en el del iframe |
| Pasa `axe-core` sobre lo montado | 479-486 |

**Por qué importa:** confirma el §12.4 palabra por palabra — *"un nodo dentro de un iframe no implica
aislamiento si usa inyectores o servicios del padre"*. Acá el propio código dice que el componente se
crea con el inyector del anfitrión. **El aislamiento visual existe; el de inyección, no.**

### 7.3 `src/app/core/mock/faker/props.ts` — 188 líneas

| Hecho | Línea |
|---|---|
| Heurística por **nombre** del input | 125 (`/date\|fecha/i`), 128 (`/id$/i`) |
| Heurística por **tipo** en texto | 95 (`tipo.startsWith('boolean')`), 147 (`string`) |
| **Fallback a `[]`** cuando no sabe | 144 |
| Uniones sólo si el texto trae `\|` y `'` | 61 |

**Por qué importa:** es exactamente el §12.2 — *"no uses `''` para un obligatorio desconocido ni `[]`
como prueba suficiente de toda colección compleja"*. Un `DataTable` montado con `columns: []` y
`trackBy` inventado **no acredita el organismo**.

## 8. El hallazgo más grande del corte: `features/alovida/**` es maqueta replicada

| Medida | Valor | Comando |
|---|---|---|
| Plantillas con `<table>` crudo en `features/**` | **81** | `git grep -l '<table' origin/mockup -- 'src/app/features/**/*.html' \| wc -l` |
| …de las cuales en `features/alovida/` | **70** | mismo comando acotado a `alovida` |
| Archivos `.ts` en `features/alovida/` | **161** | `git ls-tree -r --name-only origin/mockup src/app/features/alovida \| grep -c '\.ts$'` |
| …que importan algo de `shared/components` | **22** | `git grep -l "from '.*shared/components" origin/mockup -- 'src/app/features/alovida/**/*.ts' \| wc -l` |

Reparto de las 70 tablas crudas por submódulo de `alovida`:

| Submódulo | Tablas crudas |
|---|---|
| `accesos/` | 16 |
| `personas/` | 15 |
| `datos-compartidos/` | 13 |
| `terminologia/` | 12 |
| `buscar/` | 7 |
| `directorio/` | 6 |
| `inicio/` | 1 |

Y las 11 restantes, fuera de `alovida`: `insurance` 3 · `agenda` 3 · `account` 2 · `dashboard` 1 ·
`clinical-record` 1 · `component-stock` 1.

### 8.1 Qué son esas pantallas, exactamente

`src/app/features/alovida/personas/apoderados-de-portal-listado/apoderados-de-portal-listado.ts`,
completo:

```ts
/* V05-04·L · Apoderados de portal
   Portada de V05-profiles/security-admin/V05-04-apoderados-de-portal-listado.html en la bóveda. El marcado lo
   genera scripts/port-vistas-alovida.mjs; la lógica va acá, no en el generador. */
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-alovida-personas-apoderados-de-portal-listado',
  imports: [RouterLink],
  templateUrl: './apoderados-de-portal-listado.html',
})
export class PersonasApoderadosDePortalListado {}
```

Y su plantilla **replica las clases del sistema en lugar de instanciar los componentes**:

```html
<div class="app-page-header" app-page-header="">        <!-- no es <app-page-header> -->
<section class="app-filter-bar" app-filter-bar="">       <!-- no es <app-filter-bar> -->
<input class="app-input" app-input="" type="search">     <!-- no es <app-input> -->
<a aria-disabled="true" data-sin-destino="">Inicio</a>   <!-- enlace muerto declarado -->
```

Esto es, textualmente, la pregunta 10 de la revisión adversarial del §19: *"¿La demo recrea la
pantalla en vez de importar la fuente canónica?"* — **70 veces**.

#### 8.1.bis Los atributos de esa maqueta no instancian NADA — verificado selector por selector

Es tentador mirar `<div class="app-page-header" app-page-header="">` y suponer que el atributo engancha
un selector de atributo del sistema. **No lo hace.** Los selectores reales, leídos del corte:

| Componente | `selector` declarado | ¿Lo activa el marcado de `alovida`? |
|---|---|---|
| `organisms/page-header` | `app-page-header` (**elemento**) | NO: el marcado es un `<div>` con un atributo homónimo |
| `organisms/filter-bar` | `app-filter-bar` (**elemento**) | NO: es una `<section>` |
| `organisms/directory-page` | `app-directory-page` (**elemento**) | NO |
| `molecules/search-field` | `app-search-field` (**elemento**) | NO: es un `<label>`/`<span>` |
| `molecules/pagination` | `app-pagination` (**elemento**) | NO |
| `atoms/input` | `app-input` (**elemento**) | NO: es un `<input>` |
| `atoms/button` | `button[app-button]` (**atributo, y sólo sobre `<button>`**) | NO: en `alovida` se escribe `<a app-button="">`, y una `<a>` no matchea `button[...]` |

Comando: `git show origin/mockup:src/app/shared/components/<nivel>/<pieza>/<pieza>.ts | grep -m1 'selector:'`

> **Por qué esto importa más de lo que parece.** El atributo es **decorativo**: un marcador que dejó el
> generador, no un enganche. Así que en esas 70 pantallas **no hay nada del sistema de diseño
> corriendo**: no hay foco gestionado, no hay estados, no hay accesibilidad del componente, no hay
> responsive del organismo. Sólo hay CSS que se parece. Y como el atributo existe, cualquier búsqueda
> de adopción hecha con `grep app-page-header` **cuenta 70 falsos positivos**.
>
> Corolario para quien mida adopción: contá `<app-page-header` **con el signo `<` pegado al nombre**,
> que es lo que hace la §4 de este documento. Contar `app-page-header` a secas miente.

### 8.2 De dónde salen y por qué NO se migran a mano sin decidir antes

`scripts/port-vistas-alovida.mjs`, 568 líneas, encabezado (líneas 1-24):

- Porta **133 pantallas** desde `SALUD/Vistas/HTML/**` del vault de documentación.
- **`ARCHIVO GENERADOR. Lo que produce se puede editar a mano; si se vuelve a correr, lo pisa.`**
- `VAULT` y `FRONT` son **rutas absolutas de la máquina de Pablo**
  (`/Users/pablo/Documents/GitHub/…`, líneas 30-32): **nadie más puede correrlo tal como está**.
- Los `<button>` no se cablean acá a propósito: los mueve
  `AlovidaRuntimeService.controlesDeMaqueta()` con un oyente delegado sobre `data-alovida-maqueta`.
- No se encontró ningún mecanismo de exclusión ni de "no pisar lo migrado"
  (`grep -iE 'skip|excl|omit|preserv'` sobre el generador: **ninguna coincidencia funcional**).

> 🚩 **AMBIGÜEDAD Q-A, registrada y sin resolver.** Migrar una de esas 70 pantallas a los componentes
> canónicos **es trabajo que la próxima corrida del generador borra**. Antes del primer `Edit` sobre
> `features/alovida/**` hay que decidir: (a) el generador aprende a emitir componentes canónicos,
> (b) la pantalla migrada sale del alcance del generador con una marca explícita, o (c) se congela el
> generador. **No la resuelva quien la encuentre: se eleva a Pablo.** Resolverla por conveniencia es
> regla 00 §1.7.

## 9. Gates que ya existen — no se reinventan

| Script | Qué ya revisa | Líneas |
|---|---|---|
| `scripts/check-architecture.mjs` | ciclos (67-70), imports internos que no resuelven (79), **dirección de las capas** (88-118), superficie de red (118-140), dónde se permite el faker (140-160) | `LAYER_EXCEPTIONS` 44 · `NETWORK_ALLOWED` 47 · `FAKER_ALLOWED` 63 |
| `scripts/audit-design-views.mjs` | `yarn audit:vistas` | — |
| `scripts/check-css-tokens.mjs`, `check-tokens.mjs`, `check-contrast.mjs` | tokens y contraste | — |
| `scripts/check-api-contract-drift.mjs` | deriva contra el contrato de la API | — |

**Consecuencia:** el §16.1 del documento maestro ("comprueba imports prohibidos directos/transitivos,
ciclos…") **ya tiene implementación**. Se extiende; no se escribe de nuevo.

## 10. Higiene de tipos y de CSS — medida, no supuesta

| Medida | Valor | Lectura |
|---|---|---|
| `: any` en `src/app/**/*.ts` | **0** | El §5.4 ("no uses `any`") ya se cumple. **No mandes a nadie a cazar `any`.** |
| `as any` | **0** | idem |
| `.css` con `::ng-deep` | 12 archivos | Superficie acotada y localizable (§11) |
| `.css` con `!important` | 12 archivos | idem |

Comandos: `git grep -E ':\s*any\b' origin/mockup -- 'src/app/**/*.ts' | wc -l` y equivalentes.

## 11. Los contenedores más grandes — candidatos objetivos a separar smart/dumb

Por bytes en `origin/mockup` (`git ls-tree -r -l origin/mockup src/app/features`), excluyendo specs y
archivos generados:

| Archivo | Bytes |
|---|---|
| `features/agenda/agenda.ts` | 112 795 |
| `features/auth/register-practitioner/register-practitioner.ts` | 108 165 |
| `features/auth/register-patient/register-patient.ts` | 104 864 |
| `features/agenda/my-agenda/my-agenda.ts` | 73 977 |
| `features/account/appointments/appointments.ts` | 73 038 |
| `features/account/my-profile/practitioner-profile-edit/practitioner-profile-edit.ts` | 72 378 |
| `features/account/my-profile/practitioner-profile/practitioner-profile-view/practitioner-profile-view.html` | 66 817 |
| `features/clinical-record/patient-chart/patient-chart.ts` | 66 139 |
| `features/agenda/agenda-create/agenda-create.ts` | 55 571 |
| `features/form-builder/form-builder.ts` | 50 255 |
| `features/auth/register-organization/register-organization.ts` | 49 026 |
| `features/account/my-profile/work-history/work-history.ts` | 46 631 |
| `features/clinical-record/patient-chart/medication-block/medication-block.ts` | 45 822 |
| `features/admin/medical-laboratory/medical-laboratory.ts` | 44 178 |
| `features/accounting/accounting.ts` | 42 696 |
| `features/auth/register-imaging-center/register-imaging-center.ts` | 39 757 |

> ⚠️ **El tamaño no es el defecto.** El documento maestro §5.6 lo dice: *"no uses límites arbitrarios
> de líneas como definición de calidad"*. Esta tabla **prioriza dónde buscar**, no sentencia. Lo que
> decide es cohesión, motivos de cambio y dependencias — y eso hay que abrirlo y leerlo.
>
> Los cuatro `register-*` juntos suman **301 KB**: es la familia con más masa repetida del repo y la
> que mejor cumple el criterio de familia del §7 (mismo propósito, misma anatomía de pasos, mismo
> comportamiento de borrador, dominios distintos).

## 12. Trabajo previo que NO hay que duplicar

Ya existe infraestructura documental de refactorización en el repo:

- `docs/refactor-profesional/PLAN_MAESTRO.md` — 12 fases (00…11) con gate de salida por fase.
- `docs/refactor-profesional/trabajo/` — `INVENTARIO.md`, `MATRIZ_COBERTURA.md`, `ESTADO.md`,
  `HALLAZGOS.md`, `DECISIONES.md`, `EVIDENCIAS.md`, `ARQUITECTURA.md`, `QA_FINAL.md`, `barrido/*.json`
  y `capturas/{antes,despues,e2e}/`.
- `docs/frontend/REFACTOR_DAG.md` y `FABLE_FRONTEND_REFACTOR_PLAYBOOK.md`.
- `docs/design-system/port-alovida.md` — la documentación del generador del §8.2.

> El §17 del documento maestro pide un `REFACTOR_FRONTEND.md` y siete artefactos. **Antes de crear
> ninguno, abrí `docs/refactor-profesional/trabajo/`**: el propio §17 dice *"reutiliza archivos
> equivalentes si existen. No multipliques documentos que repiten lo mismo"*. Esa es la **ambigüedad
> Q-B**, y también se eleva.

## 13. Qué queda sin verificar en este documento

- **Nada se ejecutó.** No hay `yarn start`, ni `test`, ni captura, ni un solo veredicto de runtime.
- **No se leyó el cuerpo** de los 16 archivos del §11: sólo su tamaño. Que un archivo pese 100 KB no
  dice qué responsabilidad tiene adentro.
- **No se midió** cuántos de los 69 consumidores de `view-state-host` cubren los 10 estados, ni
  cuántos de los 26 `content-dialog` respetan la política de descarte.
- **No se comprobó** si `fact-section` (0 consumidores) tiene usos por tipo, dinámicos o del catálogo.
- **No se abrió** el vault de `SALUD/Vistas/HTML`: no está en esta máquina en la ruta que usa el
  generador.
- **`audit:vistas`, `stock:generate`, `lint`, `typecheck` y `test` no se corrieron.** No hay baseline
  de rojos. Establecerlo es la primera microtarea de cada carril, no un supuesto de este documento.
