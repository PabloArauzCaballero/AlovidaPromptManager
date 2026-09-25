# Pablo — daily de la noche del 2026-09-25

> **AVANCE COMBINADO: 0 / 102 — 0,0 %.** Sale de `microtareas HECHO / total`, sumando los dos carriles de
> abajo. `A MEDIAS` cuenta como **no hecha**. Prohibido el porcentaje estimado a ojo (regla 50 §5).

- Daily de equipo: [`Daily-Noche-2026-09-25.md`](../Daily-Noche-2026-09-25.md) — **dos paquetes esta noche**, uno por sección de este documento.

---

## Carril A — Farmacia: el carrito en la cabecera y adiós «Lugares cercanos»

> **AVANCE: 0 / 43 — 0,0 %.**

- Carril: [`Noche-Farmacia.CarritoYNavegacion`](Noche-Farmacia.CarritoYNavegacion/CarritoEnLaCabeceraYAdiosLugaresCercanos.md) (carriles 41 y 46 del plan)
- Corte: `origin/mockup` @ `bf2c3545…` → **el tuyo:** `________` (reconsultado)
- Rama: `pablo/farmacia-carrito-y-navegacion-2026-09-25` · Peldaño alcanzado (regla 30): `UNKNOWN`

### 0. Tu primera hora es la Ola 0 del equipo, y los otros tres la esperan

Antes de nada: **H2** — `pharmacy-cart.types.ts`, `cart.store.ts` (en memoria), `cart.storage.ts` (no-op),
`pharmacy.routes.ts`, `pharmacy.testids.ts`, spec del store en verde, PR chico a `mockup`, merge. **Publicalo en
§4-bis del Paquete 1 del daily de equipo apenas esté en `origin/mockup`.** Recién después seguís con la persistencia.

### 1. Instalación del estándar — pegá la salida acá

```text
$ ls .claude/skills | wc -l
<pegá la salida — tiene que dar 179>

$ ls .claude/rules/[0-9]*.md | wc -l
<pegá la salida — tiene que dar 15>

$ python .claude/hooks/plan_gate.py --self-test
<pegá la salida — tiene que dar 11 PASS, 0 FAIL>
```

- [ ] Leí `skills-router` y las 22 skills de mi lote, empezando por `angular-signals-state`.
- [ ] Creé mi `PLAN.md` antes del primer `Edit`/`Write` de código.

### 2. Baseline

| Comando | Exit code | Rojos previos | Clase (regla 80.4) |
|---|---|---|---|
| `corepack yarn lint` | | | |
| `corepack yarn typecheck` | | | |
| `corepack yarn test --watch=false` | | (esperados: `shell-layout.spec` íconos · lint `navigation.service.spec:16`) | |

### 3. La Ola 0 (H2) — publicada cuándo

| Qué | SHA del merge en `origin/mockup` | Hora | Fila en §4-bis |
|---|---|---|---|
| Tipos + `CartStore` + rutas + testids | | | |

### 4. Privacidad del carrito (H3.S1.M4, Q-P2)

| Pregunta | Respuesta |
|---|---|
| Qué se guarda | |
| Dónde (clave) | |
| Cuándo se borra | |

### 5. «Lugares cercanos» — inventario (H6.S1.M1)

| Hits del grep | Filas del inventario | Coinciden |
|---|---|---|
| | | |

### 6. Checkpoints del turno

```text
AVANCE — carrito y navegación — <fase> — <ID de microtarea>
- Hecho:      <qué quedó, concreto>
- Evidencia:  <comando / ruta / "ninguna todavía">
- Ahora:      <la siguiente acción, una sola>
- Bloqueo:    ninguno | <qué bloquea y de quién depende>
- Estado:     TODO | EN CURSO | HECHO | A MEDIAS | BLOQUEADO | DESCARTADO
- Peldaño:    UNKNOWN | DISCOVERED | WRITTEN | RUNS | TESTED | VERIFIED | REGRESSION_VERIFIED
```

### 7. Cierre

| Hito | Microtareas HECHO / total | Estado | Peldaño |
|---|---|---|---|
| H1 | / 4 | | |
| H2 | / 7 | | |
| H3 | / 6 | | |
| H4 | / 4 | | |
| H5 | / 7 | | |
| H6 | / 8 | | |
| H7 | / 3 | | |
| H8 | / 4 | | |
| **Total** | **/ 43** | | |

- PRs: `________`
- Qué quedó `A MEDIAS` (con las cuatro respuestas): `________`
- Qué quedó corriendo y se cerró: `________`

---

## Carril B — Carga masiva: integración, kill-test y dos PR mergeables

> **AVANCE: 0 / 59 — 0 %.**

- Carril: [`Noche-CargaMasiva.IntegracionYEntrega`](Noche-CargaMasiva.IntegracionYEntrega/IntegrarLosCuatroCarrilesKillTestDelContratoYDosPRMergeables.md)
- Contrato: [`CONTRATO-CARGA-MASIVA.md`](../CONTRATO-CARGA-MASIVA.md) — **es tuyo**: §5 decisiones, §6 integración, §7 kill-test
- Repos: `alovida/mantra-core-health-api` (ref `origin/dev`) y `alovida/mantra-core-health` (ref `origin/mockup`
  — **no** `origin/dev`: regla del propietario, todo frontend cierra a `mockup`) · Ramas:
  `pablo/carga-masiva-integracion-{api,front}-2026-09-25` · **ninguno de los dos es el mismo checkout que tu
  Carril A** (worktrees separados)
- Peldaño alcanzado (regla 30): `DISCOVERED` al repartir · se actualiza al cerrar (el del trabajo = el más bajo de los cuatro)

### 0. Tabla de integración (se llena a medida que publican)

| Rama | Detectada (hora) | SHA integrado | `lint`/`typecheck`/`build` | Alcance respetado | Nota |
|---|---|---|---|---|---|
| `itzan/carga-masiva-motor-2026-09-25` | | | | | |
| `marcelo/carga-masiva-xlsx-2026-09-25` (API) | | | | | |
| `justin/carga-masiva-pantalla-2026-09-25` | | | | | |
| `marcelo/carga-masiva-calidad-2026-09-25` | | | | | |
| `XlsxParser` cableado en `index.ts` (H3) | | | | | |

### 1. Instalación del estándar — pegá la salida acá (una por repo)

```text
$ ls .claude/skills | wc -l
<pendiente>

$ ls .claude/rules/[0-9]*.md | wc -l
<pendiente>

$ python .claude/hooks/plan_gate.py --self-test
<pendiente>
```

- [ ] Leí `skills-router` y las 21 skills del lote, empezando por `pr-mergeable-gate`.
- [ ] Creé el `PLAN.md` en cada repo antes del primer `Edit`/`Write` de código.

### 2. Decisiones Q-1…Q-10 (hora de confirmación en el contrato)

| ID | Decisión | Hora | Avisado a |
|---|---|---|---|
| Q-1 | | | |
| Q-2 | | | |
| Q-3 | | | |
| Q-4 | | | |
| Q-5 | | | |
| Q-6 | | | |
| Q-7 | | | |
| Q-8 | | | |
| Q-9 | | | |
| Q-10 | Repartido: Itzan (contrato, detector, CSV, perfiles) / Marcelo (dependencia, fixtures, XLSX) | ya confirmada al escribir el contrato | — |

### 3. Avance por hito (se llena al cerrar)

| Hito | Micro | HECHO | A MEDIAS | BLOQUEADO | DESCARTADO | Nota |
|---|---|---|---|---|---|---|
| H1 Base y decisiones | 12 | | | | | |
| H2 Integración incremental | 14 | | | | | |
| H3 Cableado del XLSX en `index.ts` | 6 | | | | | |
| H4 Kill-test y regresión conjunta | 13 | | | | | |
| H5 PR y reporte consolidado | 14 | | | | | |

### 4. Desvíos (correcciones mínimas en ramas ajenas)

| Rama | Commit | Por qué bloqueaba la entrega | Avisado a |
|---|---|---|---|

### 5. Procesos que quedaron corriendo

<lista o «ninguno»>

---

## Cómo repartís tu noche entre los dos carriles

Sos la única persona con un carril de **coordinación** en cada paquete: Farmacia te tiene en la Ola 0 (H2, tu
primera hora) y Carga Masiva te tiene integrando **a medida que los otros tres publican**, no de una vez al
final. Por eso el orden real de tu noche es: Farmacia H2 (Ola 0, 1 h) → alternás entre cerrar Farmacia H3–H8 y
revisar `git fetch` de los cuatro carriles de Carga Masiva cada vez que cerrás una microtarea propia de
cualquiera de los dos. El kill-test del Carril B y el cierre de ambos PR van al final de la noche. Si no llegás
a los dos completos, decilo en este daily con cuál priorizaste y por qué.

---

## Carril C — Encuentro clínico (Paquete 3, agregado por el propietario): C9, C5, C7

> **AVANCE DEL CARRIL C: 23 / 27 — 85,2 %.** Sale de `microtareas HECHO / total`. `A MEDIAS` cuenta como no hecha. Se suma a tus carriles A y B, no los reemplaza.

- Plan maestro del paquete: [`PLAN-MAESTRO.md`](../../../../docs/trabajo/2026-09-25-plan-y-reparto-encuentro-clinico/PLAN-MAESTRO.md) · Daily de equipo, sección «Paquete 3»: [`Daily-Noche-2026-09-25.md`](../Daily-Noche-2026-09-25.md)
- Repo: `mantra-core-health` · Ref: `origin/mockup` · Corte de referencia `bf2c3545` → **el tuyo:** C9/C5 `963b7283` (post Ola 0 Farmacia) · C7 `963b7283` → mergeado con `9fa933be` tras integrarse C9 (#677) y C5 (#679)
- Instalación del estándar: la misma de arriba (no la repitas; si abriste un worktree nuevo, fusioná `.claude/` sin pisar y pegá los tres números).
- Cómo entra en tu noche: C9 primero (es lo que el propietario pidió ver), después C5 y C7. Cruce con tu carril A (Farmacia): reserva `core/navigation/**` entero y C7 cambia una línea de `navigation.map.ts`; se hizo en secuencia — Farmacia mergeó primero (PR #671), C7 mergeó `origin/mockup` de vuelta sobre su rama después, sin conflictos (`git merge`, evidencia en el `PLAN.md` de C7).

| Carril | Prompt | Corte propio | Rama | HECHO/total | Peldaño (regla 30) | PR | Push a `mockup` | Bloqueos / avisos |
|---|---|---|---|---|---|---|---|---|
| C9 · «Mis órdenes» por tipo con barra y paginación | [prompt](Noche-EncuentroClinico.C9-MisOrdenes/MisOrdenesPorTipoConBarraYPaginacion.md) | `963b7283` | `claude/clinica-c9-mis-ordenes` | 8/10 | **Playwright corrido**: encontró un bug real (ver abajo) | #677 (mergeado) + **#683 fix** | **#677 MERGEADO** · #683 abierto, mergeable | Bug real en producción, ver «Lo que publicás» |
| C5 · Receta ligada a diagnóstico confirmado o motivo | [prompt](Noche-EncuentroClinico.C5-Receta/RecetaLigadaADiagnosticoConfirmadoOMotivo.md) | `963b7283` | `claude/clinica-c5-receta` | 8/9 | **Playwright corrido**: 5 bugs del spec corregidos, 1 hallazgo sin resolver (ver abajo) | #679 (mergeado) + **#685 fix de specs** | **#679 MERGEADO** · #685 abierto, mergeable | Integración triple pendiente en `patient-chart.ts`/`consultation.ts`/`medical-record.ts` (C3) — ver su `REPORTE.md` |
| C7 · Homogeneización de nombres y «Notas médicas» | [prompt](Noche-EncuentroClinico.C7-Nombres/HomogeneizacionDeNombresYNotasMedicas.md) | `963b7283`→`9fa933be` | `claude/clinica-c7-nombres` | 7/8 | **Playwright corrido**: «Notas médicas» PASS, 5 viewports, doble revisión APROBADA | #682 | Abierto, `MERGEABLE`/`UNSTABLE` (checks del runner propio en `pending`, caído) | `consulta-rejilla.spec.ts` bloqueado por un locator ajeno en `clinical-record.html` (pre-existente) — no se pudo verificar `observation-block` ni el envoltorio `free-note-block` en navegador. Detalle en su `REPORTE.md` |

### El pase consolidado de Playwright — sí se hizo, y encontró cosas reales

Se corrió esta noche (mockup corre contra el interceptor propio, **sin Postgres ni API** — corrección
sobre lo que este daily decía antes). Hallazgo de infraestructura: **`scripts/pw-guard.mjs` no existe
en el repo**, aunque los tres prompts clínicos lo asumen como si ya estuviera escrito. Se usó el
mecanismo real (`ng serve --port <PUERTO>` + `E2E_BASE_URL=http://localhost:<PUERTO> npx playwright
test <spec>`, que `playwright.config.ts:41` ya soporta). Alguien tiene que escribirlo o corregir los
tres prompts.

**Bug real en C9 (ya en `mockup` desde el PR #677 mergeado):** `<app-data-table>` en «Mis órdenes»
estaba atado a `estado()` (todas las filas sin filtrar) en vez de a las filas ya filtradas —
buscar o filtrar cambiaba el número del resumen pero la tabla seguía mostrando todo. **PR #683** lo
arregla + agrega un test de regresión (el bug era invisible a los unitarios existentes, que sólo
afirmaban sobre el `computed` en aislamiento, nunca sobre lo que la tabla realmente recibe).

**Hallazgo en C5 (sin resolver):** con los 5 bugs del propio spec corregidos (ruta 404, selects
apuntando al host en vez del control nativo, botón «Prescribir» ambiguo, medicamento nunca elegido,
diálogos de interacción/adjuntos sin manejar), la receta creada queda en estado **Borrador** y el
badge «Diagnóstico:»/«Motivo:» que el criterio de aceptación espera sólo aparece para una receta
**firmada**. El spec (ni la versión original ni la corrección de esta noche) firma la receta. Ver
`docs/trabajo/2026-09-25-encuentro-clinico/c5/evidencia/c5-receta-playwright.md` — falta decidir si
el criterio esperaba firma o si el badge debería verse en borrador también.

**C7 sí cerró en verde:** «Notas médicas» funciona de punta a punta (heading, botón PDF, sin
desborde en 5 viewports, descarga real, consola limpia), con doble revisión crítica hecha y
`APROBADA`. `observation-block` y el envoltorio `free-note-block`→`measurement-grid` no se pudieron
verificar: `consulta-rejilla.spec.ts` — el único camino E2E hasta esas pantallas — se cae antes, en
`/medical-records`, por un `label` que cambió (`clinical-record.html:29` dice «Nombre o código»; el
spec busca «Buscar por nombre o código», de antes de esta noche).

### Baseline del worktree de C7 (el más reciente tocado)

| Comando | Exit code | Rojos previos | Clase (regla 80.4) |
|---|---|---|---|
| `yarn lint` (repo completo, no sólo C7) | 1 | 252 errores `prefer-on-push-component-change-detection`, ninguno en archivos de C7 | `ENVIRONMENT` — baseline preexistente del repo (254 errores antes de tocar nada, verificado con `git stash`), no introducido por ningún carril de esta noche |
| `yarn typecheck` (C7, tras mergear `origin/mockup`) | 0 | — | — |
| `yarn build` (C7) | 0 | — | — |
| `yarn test --watch=false` con 9 `--include` de C7 | 0 | — | 15 files / 235 tests, todos verdes |

### Doble revisión crítica de las capturas (regla 35)

**«Notas médicas» (C7), tema claro, 5 viewports: hecha, APROBADA**, sin hallazgos bloqueantes —
`wt-clinica-c7/docs/trabajo/2026-09-25-encuentro-clinico/c7/evidencia/doble-revision.md`. Falta el
tema oscuro (el spec no lo alterna). El resto (`observation-block`, `measurement-grid` en consulta,
la pantalla de recetas de C5) sigue sin capturas por los bloqueos de arriba.

### Cierre

- PR: C9 #677 (mergeado) + **#683 fix del filtro** (abierto) · C5 #679 (mergeado) + **#685 fix de
  specs** (abierto) · C7 #682 (abierto, mergeable)
- Push a `mockup` verificado: C9 y C5 sí (mergeados); C7 con `gh pr view` pegado en su `REPORTE.md`;
  los dos fixes (#683, #685) con el mismo chequeo, `MERGEABLE`/`UNSTABLE` por el runner caído
- `REPORTE.md`: los tres tienen el suyo actualizado, en
  `docs/trabajo/2026-09-25-encuentro-clinico/{c9,c5,c7}/REPORTE.md` de cada worktree, más
  `docs/trabajo/2026-09-25-fix-mis-ordenes-filtro-tabla/` (C9) y la evidencia de Playwright de C5/C7
- Pendiente de backend redactado: C7 (lectura de colección `GET /charts/notes`), C5 (integración
  triple en `patient-chart.ts`/`consultation.ts`/`medical-record.ts`) — ambos en sus `REPORTE.md`
- Pendiente de infraestructura: `scripts/pw-guard.mjs` no existe — alguien lo escribe o se corrigen
  los tres prompts que lo asumen
- Pendiente ajeno anotado, no tocado: `clinical-record.html`/`consulta-rejilla.spec.ts` (locator
  desactualizado), `prescription-official-pdf.spec.ts` (el caso «sin conexión» falla, pre-existente)
- `// TODO C8` dejados: ninguno literal; el inventario de términos en archivos ajenos de C7
  (`consultation.ts`, `patient-chart.ts`, `progress-notes-pdf.ts`) queda anotado en
  `evidencia/inventario.md` de C7 para quien los pueda tocar
- Farmacia (PR #671) ya está mergeado también, pero **no tiene un spec de Playwright propio** —
  su ficha nunca definió uno (a diferencia de C9/C5/C7). Queda pendiente si alguien quiere una
  verificación visual manual de esa pantalla.
