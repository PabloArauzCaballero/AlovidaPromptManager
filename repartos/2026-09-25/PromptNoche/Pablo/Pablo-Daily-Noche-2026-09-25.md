# Pablo — daily de la noche del 2026-09-25

> **AVANCE: 0 / 43 — 0,0 %.** ← se llena al cerrar, con `microtareas HECHO / total`.
> `A MEDIAS` cuenta como **no hecha**. Prohibido el porcentaje estimado a ojo (regla 50 §5).

- Carril: [`Noche-Farmacia.CarritoYNavegacion`](Noche-Farmacia.CarritoYNavegacion/CarritoEnLaCabeceraYAdiosLugaresCercanos.md) (carriles 41 y 46 del plan)
- Corte: `origin/mockup` @ `bf2c3545…` → **el tuyo:** `________` (reconsultado)
- Rama: `pablo/farmacia-carrito-y-navegacion-2026-09-25` · Peldaño alcanzado (regla 30): `UNKNOWN`
- Daily de equipo: [`Daily-Noche-2026-09-25.md`](../Daily-Noche-2026-09-25.md)

## 0. Tu primera hora es la Ola 0 del equipo, y los otros tres la esperan

Antes de nada: **H2** — `pharmacy-cart.types.ts`, `cart.store.ts` (en memoria), `cart.storage.ts` (no-op),
`pharmacy.routes.ts`, `pharmacy.testids.ts`, spec del store en verde, PR chico a `mockup`, merge. **Publicalo en
§4-bis del daily de equipo apenas esté en `origin/mockup`.** Recién después seguís con la persistencia.

## 1. Instalación del estándar — pegá la salida acá

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

## 2. Baseline

| Comando | Exit code | Rojos previos | Clase (regla 80.4) |
|---|---|---|---|
| `corepack yarn lint` | | | |
| `corepack yarn typecheck` | | | |
| `corepack yarn test --watch=false` | | (esperados: `shell-layout.spec` íconos · lint `navigation.service.spec:16`) | |

## 3. La Ola 0 (H2) — publicada cuándo

| Qué | SHA del merge en `origin/mockup` | Hora | Fila en §4-bis |
|---|---|---|---|
| Tipos + `CartStore` + rutas + testids | | | |

## 4. Privacidad del carrito (H3.S1.M4, Q-P2)

| Pregunta | Respuesta |
|---|---|
| Qué se guarda | |
| Dónde (clave) | |
| Cuándo se borra | |

## 5. «Lugares cercanos» — inventario (H6.S1.M1)

| Hits del grep | Filas del inventario | Coinciden |
|---|---|---|
| | | |

## 6. Checkpoints del turno

```text
AVANCE — carrito y navegación — <fase> — <ID de microtarea>
- Hecho:      <qué quedó, concreto>
- Evidencia:  <comando / ruta / "ninguna todavía">
- Ahora:      <la siguiente acción, una sola>
- Bloqueo:    ninguno | <qué bloquea y de quién depende>
- Estado:     TODO | EN CURSO | HECHO | A MEDIAS | BLOQUEADO | DESCARTADO
- Peldaño:    UNKNOWN | DISCOVERED | WRITTEN | RUNS | TESTED | VERIFIED | REGRESSION_VERIFIED
```

## 7. Cierre

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
