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
