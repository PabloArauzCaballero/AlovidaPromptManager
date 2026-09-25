# Marcelo — daily de la noche del 2026-09-25

> **AVANCE: 0 / 30 — 0,0 %.** ← se llena al cerrar, con `microtareas HECHO / total`.
> `A MEDIAS` cuenta como **no hecha**. Prohibido el porcentaje estimado a ojo (regla 50 §5).

- Carril: [`Noche-Farmacia.DatosYContratoReal`](Noche-Farmacia.DatosYContratoReal/ClienteMocksYEndpointsRealesDeFarmacia.md) (carriles 42 y 47 del plan)
- Cortes: front `origin/mockup` @ `bf2c3545…` → **el tuyo:** `________` · API `origin/dev` @ `343795cc…` → **el tuyo:** `________`
- Ramas: `marcelo/farmacia-cliente-y-mocks-2026-09-25` (front) · `marcelo/pharmacy-sites-y-filtro-por-farmacia-2026-09-25` (API) · Peldaño alcanzado (regla 30): `UNKNOWN`
- Daily de equipo: [`Daily-Noche-2026-09-25.md`](../Daily-Noche-2026-09-25.md)

## 0. Tu primera hora es la otra mitad de la Ola 0, y Justin e Itzan la esperan

Antes de nada: **H2** — `PharmacyDetail`, `PharmacySiteRead`, `PharmacySitePrices`, `PharmacySitePriceItem`,
`getPharmacy()`, `getSitePrices()`, los dos mocks, spec del cliente en verde, `curl` pegado, PR chico a `mockup`,
merge. **Publicalo en §4-bis del daily de equipo apenas esté en `origin/mockup`.** Después, las fixtures (H3.S1)
y recién entonces la API.

## 1. Instalación del estándar — pegá la salida acá (en los dos checkouts)

```text
$ ls .claude/skills | wc -l
<pegá la salida — tiene que dar 179>

$ ls .claude/rules/[0-9]*.md | wc -l
<pegá la salida — tiene que dar 15>

$ python .claude/hooks/plan_gate.py --self-test
<pegá la salida — tiene que dar 11 PASS, 0 FAIL>
```

- [ ] Leí `skills-router` y las 21 skills de mi lote, empezando por `frontend-data-access`.
- [ ] Creé mi `PLAN.md` antes del primer `Edit`/`Write` de código.

## 2. Baseline

| Repo | Comando | Exit code | Rojos previos | Clase (regla 80.4) |
|---|---|---|---|---|
| front | `corepack yarn lint` | | | |
| front | `corepack yarn typecheck` | | | |
| front | `npx ng test --include='src/app/core/data-access/pharmacy/*.spec.ts' --watch=false` | | | |
| API | `yarn typecheck` | | | |
| API | `yarn test src/modules/pharmacy` | | | |

## 3. El contrato, campo por campo (H2.S1.M1, H4.S1.M2)

| Campo | `pharmacy.types.ts` (front) | `read-responses.dto.ts` (API) | Igual |
|---|---|---|---|
| `PharmacySiteRead.latitude` | | | |
| `PharmacySitePriceItem.requiresPrescription` (Q-M4) | | | |
| `PharmacySitePriceItem.unitAmount` | | | |
| `PharmacySite.distanceKm` (sedes sueltas) | | | |

## 4. Coherencia de precio (H3.S2.M2)

| Producto | `/sites/:siteId/prices` | `/availability` | `POST /orders` → `unitPriceAmount` | Iguales |
|---|---|---|---|---|
| | | | | |

## 5. Checkpoints del turno

```text
AVANCE — datos y contrato real — <fase> — <ID de microtarea>
- Hecho:      <qué quedó, concreto>
- Evidencia:  <comando / ruta / "ninguna todavía">
- Ahora:      <la siguiente acción, una sola>
- Bloqueo:    ninguno | <qué bloquea y de quién depende>
- Estado:     TODO | EN CURSO | HECHO | A MEDIAS | BLOQUEADO | DESCARTADO
- Peldaño:    UNKNOWN | DISCOVERED | WRITTEN | RUNS | TESTED | VERIFIED | REGRESSION_VERIFIED
```

## 6. Cierre

| Hito | Microtareas HECHO / total | Estado | Peldaño |
|---|---|---|---|
| H1 | / 4 | | |
| H2 | / 6 | | |
| H3 | / 6 | | |
| H4 | / 5 | | |
| H5 | / 3 | | |
| H6 | / 3 | | |
| H7 | / 3 | | |
| **Total** | **/ 30** | | |

- PRs: front `________` · API `________`
- Qué quedó `A MEDIAS` (con las cuatro respuestas): `________`
- Qué quedó corriendo y se cerró: `________`
