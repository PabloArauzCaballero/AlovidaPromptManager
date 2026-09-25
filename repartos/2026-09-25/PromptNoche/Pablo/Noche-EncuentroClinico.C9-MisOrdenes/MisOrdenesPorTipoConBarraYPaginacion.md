# C9 — «Mis órdenes» del paciente: por tipo, con buscador, filtros, tabla sin scroll lateral y paginación (ADR-0015)

> **Rol:** dueño de «Mis órdenes» del paciente · **Responsable:** Pablo · **Carril:** C9 · **Fecha:** 2026-09-25 · **Turno:** noche · **Ola B (entra primero)**
> **Plan maestro:** [`PLAN-MAESTRO.md`](../../../../../docs/trabajo/2026-09-25-plan-y-reparto-encuentro-clinico/PLAN-MAESTRO.md) — §0.2 (6), §0.3 D-9, §3.8, §5, §6, §7 C9
> **Literal del propietario:** «necesito que te asegures que esto aparecerá en el módulo de paciente como Mis órdenes ahora sí clasificado por el tipo por favor y con buscador y filtro con la disciplina de paginación que hemos documentado acá y con la máxima calidad que se exige».
> **Referencia de implementación que ya cumple la disciplina:** `features/account/my-profile/work-history/**` («Dónde atiendo»: `app-filter-bar` + `app-data-table maxHeight` + `app-pagination` en cliente, `normalizarTexto`). Copiá el patrón, no la pantalla.

## 0. Ficha de asignación

| Campo | Valor |
|---|---|
| `REPO` | `mantra-core-health`. **Nada de backend, nada de mock** |
| `TARGET_REF` | `origin/mockup` con C0 (ideal: también con C2, que te da `category` y 14 órdenes para el paciente demo; si C2 no llegó, seguís igual) |
| `RAMA` | `claude/clinica-c9-mis-ordenes` |
| `WORKTREE` | `<raíz de tus repos>/wt-clinica-c9` |
| `PUERTO` | `4219` |
| `ARCHIVOS RESERVADOS` | `src/app/features/account/diagnostic-orders/**` · `playwright/clinica-c9-mis-ordenes.spec.ts` · `docs/trabajo/2026-09-25-encuentro-clinico/c9/**` |
| `ARCHIVOS DE OTROS` | `core/mock/handlers/diagnostics.handlers.ts` y `fixtures/clinica.ts` (C2) · `account/diagnostic-results/**` · `laboratory-directory/**` · `shared/components/organisms/{data-table,filter-bar}/**`, `molecules/{pagination,row-actions}/**` (piezas de la casa: si te falta algo, **se anota, no se toca**) · tipos congelados (C0) · `account/medical-record/**` (C6) |
| `CUENTAS` | `paciente@alovida.mock` |
| `DÓNDE SE PRUEBA` | `/my-account/diagnostic-orders` (menú «Mis órdenes») |
| `LÍMITE DE RECURSOS` | un `yarn start`, un build/test a la vez, Playwright sólo vía `pw-guard` |
| `TUS OTROS CARRILES ESTA NOCHE` | Farmacia: `Noche-Farmacia.CarritoYNavegacion` · Carga Masiva: `Noche-CargaMasiva.IntegracionYEntrega`. Sin cruces de archivos con ellos (verificado). Tu daily es uno solo (`Pablo-Daily-Noche-2026-09-25.md`): este carril va en su sección «Carril C — Encuentro clínico». |

## 1. Estándar y skills

§5.1 del plan. **Skills:** `skills-router` → `outcome-first` → `context-thrift` → `factual-discovery` → `anti-hallucination-guard` → `milestone-planning` → `scope-discipline` → `lane-authoring` → `data-privacy-phi` → `frontend-data-tables` → `search-and-filtering` → `frontend-ui-design` → `visual-hierarchy-composition` → `frontend-design-system` → `frontend-ux-states` → `frontend-responsive-layout` → `frontend-accessibility` → `ux-clarity-usability` → `ux-writing-microcopy` → `angular-development` → `angular-signals-state` → `smart-dumb-components` → `native-code-patterns` → `unit-testing` → `angular-testing` → `test-case-design-techniques` → `accessibility-testing` → `e2e-playwright` → (cierre) `frontend-beautiful-ui` → `ui-quality-review` → `visual-proof` → `critical-double-review` → `evidence-and-verification` → `work-report-md` → `pr-mergeable-gate` → `finish-your-turn`. Del repo: `project-design-system` (Regla 8), `frontend-production-gate`, `visual-quality-gate`; ADR-0012, ADR-0013, ADR-0015 y `docs/adr/CONTRATO-data-table.md` leídos enteros; agentes `visual-reviewer`, `frontend-reviewer`.

`PLAN.md` propio antes del primer edit.

## 2. Resultado observable y kill-test

`paciente@alovida.mock` → «Mis órdenes» es **una tarjeta centrada a lo ancho con cuatro pestañas** (Todas (n) · Laboratorio (n) · Imagenología (n) · Otros (n)); en cada pestaña una barra con buscador y tres filtros (Estado · Resultado · Período), una tabla sin scroll lateral y paginación abajo a la derecha con Anterior/Siguiente **con texto**, número de página y selects de página y tamaño. Buscar «hemo» deja sólo hemogramas; filtrar «Con resultado» deja las que enlazan a «Mis resultados»; «Limpiar filtros» vuelve al total; F5 conserva pestaña, búsqueda, filtros y página. Preparación y liquidación del seguro siguen accesibles desde «Acciones» (texto, no ícono).

**Kill-test:** scroll lateral en la tabla a 390 o 768, o un paginador sin número de página, y C9 no está hecho.

## 3. Lo que consumís y cómo derivás (§3.8)

- `DiagnosticsClient.getOwnOrders()` → `PatientOwnOrders { items: PatientOrder[], truncated }`. `PatientOrder` trae `category?` (C0 lo declaró; C2 lo llena). Si no viene, derivás el tipo desde `categoryConceptId` resolviendo por código con `TerminologyClient` el value set `VS_SERVICE_REQUEST_CATEGORY` (`SRQ-LAB`→Laboratorio, `SRQ-IMAGING`→Imagenología, resto→Otros).
- Modelo de vista `PatientOrderRow` (renombra `OrdenVisible`): `type: AnalysisCategory`, `typeLabel`, `studyLabel`, `stateLabel`, `hasResult`, `reportId`, `consultationLabel` («Consulta del dd/mm» o «Sin consulta»), `requestedAt`, `preparation`, `settlement` (los campos de `PatientSettlementFields`). Ningún uuid llega a la fila.
- Estado en señales: `tab`, `q`, `estado`, `resultado`, `periodo`, `pagina`, `tamano`; `computed` de filtrado (normalizado por acentos y mayúsculas, multicampo: estudio, estado, consulta, preparación) y de paginado; sincronizado con la URL (`replaceUrl: true`) y leído al entrar desde `ActivatedRoute`.

## 4. Diseño exigido (esto es lo que se va a mirar con lupa)

- `app-page-header` («Mis órdenes», subtítulo «Los análisis que te pidieron y qué tenés que hacer con cada uno») + **una** `app-card` centrada a lo ancho (Regla 8, medida: holgura izquierda ≈ derecha ≤ 2 px, ancho ≥ 85 % de `.app-main__inner`).
- `app-tabs` con los cuatro tipos y su conteo (`mis-ordenes-tab-TODAS` / `-LAB` / `-IMAGING` / `-OTHER`); la pestaña activa vive en la URL.
- Dentro de cada pestaña, en este orden y sin nada más: `app-filter-bar` (`searchLabel` «Buscar en tus órdenes», `searchPlaceholder` «Estudio, estado o consulta»; `filters`: Estado (`app-select`, los estados presentes), Resultado (Con resultado / Sin resultado), Período (30 / 90 / 365 días / Todo); **sin** hueco de acción: es sólo lectura) → `app-data-table` (`maxHeight`, `caption`, `trackBy`, columnas **Pedida · Estudio · Tipo (`app-badge`) · Estado (`app-status-seal`) · Resultado («Disponible» con enlace / «Pendiente») · Consulta · Acciones**; en móvil pliega Consulta y Preparación al detalle por prioridad) → `app-pagination` abajo a la derecha (`totalItems`, tamaños 10 / 25 / 50, Anterior/Siguiente con texto, select de página).
- `app-row-actions` con texto: «Ver resultado» (si `hasResult`, a «Mis resultados» con el `reportId`), «Ver preparación» (`app-content-dialog` con el texto), «Ver liquidación» (si hay `insuranceSettlement`, el `app-patient-insurance-settlement` existente dentro del modal).
- Estados M34 con `app-view-state-host`: S2 esqueleto de filas (`app-skeleton`); S3 por pestaña con próxima acción («Cuando tu médico te pida un análisis va a aparecer acá»); vacío por filtro («Ninguna orden coincide» + `mis-ordenes-limpiar-filtros`); S7 si `truncated` («Mostramos las últimas 50»); S9 con ID de petición.
- Accesibilidad: `caption` de la tabla, orden de tabulación barra → tabla → paginación, foco visible, `aria-live="polite"` en «n órdenes», diálogos con foco atrapado y `Escape`.
- Tokens, sin valores mágicos; sin CSS inline; tema oscuro revisado; `prefers-reduced-motion`.

## 5. Microtareas

| ID | Microtarea | CA | DoD |
|---|---|---|---|
| C9.H1.M1 | Arranque, estándar, baseline, `PLAN.md`; capturas «antes» en 390/1440 | — | baseline |
| C9.H2.M1 | `PatientOrderRow` + derivación del tipo (con y sin `category`) | Sin `any`; sin uuids en la fila; spec con los dos caminos | spec |
| C9.H2.M2 | Señales, `computed` de filtrado/paginado, URL ida y vuelta | Cambiar cualquier control cambia la URL; entrar por URL restaura la vista | spec |
| C9.H3.M1 | Plantilla §4 completa | Regla 8 medida; sin scroll lateral en ningún viewport | Playwright + capturas |
| C9.H3.M2 | `app-row-actions` con texto y los tres modales/enlaces | Ninguna acción sólo ícono | spec |
| C9.H3.M3 | Estados M34 | Los cinco se ven (forzando `mock:fallos` y filtros imposibles) | capturas |
| C9.H3.M4 | Accesibilidad | `accessibility-testing` sin hallazgos serios; `node scripts/check-contrast.mjs` | evidencia |
| C9.H4.M1 | Playwright `clinica-c9-mis-ordenes.spec.ts` | verde | `node scripts/pw-guard.mjs --port 4219 --spec playwright/clinica-c9-mis-ordenes.spec.ts --serve` |
| C9.H4.M2 | Capturas cinco viewports, claro/oscuro; `critical-double-review`; `ui-quality-review` | ≥ 92 | capturas + puntuación |
| C9.H5.M1 | Revisores, gates §5.3, commits, push a `mockup`, PR, `REPORTE.md`, daily en `main` | — | — |

## 6. Playwright

`node scripts/pw-guard.mjs --port 4219 --spec playwright/clinica-c9-mis-ordenes.spec.ts --serve` (background). Recorrido: paciente → Mis órdenes → `mis-ordenes-card` → suma de los conteos de las tres pestañas de tipo = conteo de «Todas» → `mis-ordenes-buscador` «hemo» → filas reducidas y todas contienen «Hemograma» → `mis-ordenes-filtro-resultado` «Con resultado» → todas con «Disponible» → `mis-ordenes-limpiar-filtros` → total → si el total > 10, `mis-ordenes-paginacion` cambia de página y las filas cambian; si no, asserta el texto «1–n de n» → `page.reload()` → pestaña, búsqueda y página conservadas → «Ver preparación» abre un diálogo y `Escape` lo cierra. Aserta a 390 y 768 que `scrollWidth <= clientWidth` del contenedor de la tabla.

## 7. Cierre

Checklist §9. Commits `feat(mis-ordenes): pestañas por tipo, barra, tabla y paginación (ADR-0015)`, `test(mis-ordenes): …`. Push a `mockup` verificado + rama + PR (`--base mockup`, revisores `jsaldias39,PabloArauzCaballero`; en la descripción, la puntuación del `ui-quality-review` y los cinco viewports). `REPORTE.md` con lo que le faltó a las piezas compartidas, si algo. Sección «Carril C — Encuentro clínico · C9» de tu daily `Pablo/Pablo-Daily-Noche-2026-09-25.md` (sin tocar tus secciones de Farmacia y Carga Masiva) y push a `main`.

## 8. Lo que NO hacés

Tocar el mock ni la seed (C2) · tocar `data-table`, `filter-bar`, `pagination`, `row-actions` · inventar un paginador propio · esperar a C2 (derivás el tipo) · agrupar por atención como hoy (la consulta pasa a ser una columna).
