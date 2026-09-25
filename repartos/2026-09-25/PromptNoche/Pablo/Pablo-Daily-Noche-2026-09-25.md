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

> **AVANCE DEL CARRIL C: 22 / 27 — 81,5 %.** Sale de `microtareas HECHO / total`. `A MEDIAS` cuenta como no hecha. Se suma a tus carriles A y B, no los reemplaza.

- Plan maestro del paquete: [`PLAN-MAESTRO.md`](../../../../docs/trabajo/2026-09-25-plan-y-reparto-encuentro-clinico/PLAN-MAESTRO.md) · Daily de equipo, sección «Paquete 3»: [`Daily-Noche-2026-09-25.md`](../Daily-Noche-2026-09-25.md)
- Repo: `mantra-core-health` · Ref: `origin/mockup` · Corte de referencia `bf2c3545` → **el tuyo:** C9/C5 `963b7283` (post Ola 0 Farmacia) · C7 `963b7283` → mergeado con `9fa933be` tras integrarse C9 (#677) y C5 (#679)
- Instalación del estándar: la misma de arriba (no la repitas; si abriste un worktree nuevo, fusioná `.claude/` sin pisar y pegá los tres números).
- Cómo entra en tu noche: C9 primero (es lo que el propietario pidió ver), después C5 y C7. Cruce con tu carril A (Farmacia): reserva `core/navigation/**` entero y C7 cambia una línea de `navigation.map.ts`; se hizo en secuencia — Farmacia mergeó primero (PR #671), C7 mergeó `origin/mockup` de vuelta sobre su rama después, sin conflictos (`git merge`, evidencia en el `PLAN.md` de C7).

| Carril | Prompt | Corte propio | Rama | HECHO/total | Peldaño (regla 30) | PR | Push a `mockup` | Bloqueos / avisos |
|---|---|---|---|---|---|---|---|---|
| C9 · «Mis órdenes» por tipo con barra y paginación | [prompt](Noche-EncuentroClinico.C9-MisOrdenes/MisOrdenesPorTipoConBarraYPaginacion.md) | `963b7283` | `claude/clinica-c9-mis-ordenes` | 8/10 | TESTED (16/16 specs + build; falta Playwright/capturas) | #677 | **MERGEADO** | Faltó H4 completo y el cierre de H5 (Playwright, diferido al pase final consolidado que nunca se corrió esta noche) |
| C5 · Receta ligada a diagnóstico confirmado o motivo | [prompt](Noche-EncuentroClinico.C5-Receta/RecetaLigadaADiagnosticoConfirmadoOMotivo.md) | `963b7283` | `claude/clinica-c5-receta` | 8/9 | TESTED (10/10 + 63/63 + 45/45 specs; falta Playwright/E2E) | #679 | **MERGEADO** | Falta H4/H5 (Playwright corrido); integración triple pendiente en `patient-chart.ts`/`consultation.ts`/`medical-record.ts` (C3, fuera de alcance) — detalle en su `REPORTE.md` |
| C7 · Homogeneización de nombres y «Notas médicas» | [prompt](Noche-EncuentroClinico.C7-Nombres/HomogeneizacionDeNombresYNotasMedicas.md) | `963b7283`→`9fa933be` | `claude/clinica-c7-nombres` | 6/8 | TESTED (235/235 specs post-merge + build; falta Playwright/capturas) | #682 | Abierto, `MERGEABLE`/`UNSTABLE` (checks del runner propio en `pending`, caído) | `free-note-block/**` no se pudo eliminar (bloquea `patient-chart.ts`, C3): queda `@deprecated`, delegando en `measurement-grid/` nuevo. «Una fila por nota» en Notas médicas no se logró: no existe `GET /charts/notes` de colección en este corte. Detalle completo en su `REPORTE.md` |

### Lo que publicás para otros (con SHA + hora)

- `measurement-grid` (ex `note-grid`, ahora fuera de `free-note-block/`): quien toque `patient-chart.ts` después puede cambiar su import/plantilla a `<app-measurement-grid>` directo y borrar el envoltorio `free-note-block` — instrucción exacta en el JSDoc de `free-note-block.ts` (PR #682, sin mergear todavía).
- `faker/clinico.ts`: `notaDeEvolucion` ya no existe, es `textoDeNotaMedica` (PR #682).

### Baseline del worktree de este carril

| Comando | Exit code | Rojos previos | Clase (regla 80.4) |
|---|---|---|---|
| `yarn lint` (repo completo, no sólo C7) | 1 | 252 errores `prefer-on-push-component-change-detection`, ninguno en archivos de C7 | `ENVIRONMENT` — baseline preexistente del repo (254 errores antes de tocar nada, verificado con `git stash`), no introducido por ningún carril de esta noche |
| `yarn typecheck` (C7, tras mergear `origin/mockup`) | 0 | — | — |
| `yarn build` (C7) | 0 | — | — |
| `yarn test --watch=false` con 9 `--include` de C7 | 0 | — | 15 files / 235 tests, todos verdes |

### Doble revisión crítica de las capturas (regla 35)

Ninguna de las tres corrió Playwright ni sacó capturas esta noche — el pase final consolidado que
los tres `PLAN.md` prometían («se levanta el stack una sola vez para los tres») **no se hizo**: quedó
como el pendiente más grande de todo el Carril C. Sin capturas no hay doble revisión que hacer
todavía.

### Cierre

- PR: C9 #677 (mergeado) · C5 #679 (mergeado) · C7 #682 (abierto, mergeable)
- Push a `mockup` verificado: C9 y C5 sí (mergeados); C7 con `gh pr view` pegado en su `REPORTE.md`
- `REPORTE.md`: los tres tienen el suyo, en `docs/trabajo/2026-09-25-encuentro-clinico/{c9,c5,c7}/REPORTE.md` de cada worktree
- Pendiente de backend redactado: C7 (lectura de colección `GET /charts/notes`), C5 (integración triple en `patient-chart.ts`/`consultation.ts`/`medical-record.ts`) — ambos en sus `REPORTE.md`
- `// TODO C8` dejados: ninguno literal; el inventario de términos en archivos ajenos de C7 (`consultation.ts`, `patient-chart.ts`, `progress-notes-pdf.ts`) queda anotado en `evidencia/inventario.md` de C7 para quien los pueda tocar
