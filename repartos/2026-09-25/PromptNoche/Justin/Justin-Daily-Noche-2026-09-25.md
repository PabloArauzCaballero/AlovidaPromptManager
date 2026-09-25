# Justin — daily de la noche del 2026-09-25

> **AVANCE: 0 / 41 — 0,0 %.** ← se llena al cerrar, con `microtareas HECHO / total`.
> `A MEDIAS` cuenta como **no hecha**. Prohibido el porcentaje estimado a ojo (regla 50 §5).

- Carril: [`Noche-Farmacia.TiendaYReceta`](Noche-Farmacia.TiendaYReceta/BuscadorPorPrecioYDistanciaYLaRecetaAlCarrito.md) (carriles 43 y 45 del plan)
- Corte: `origin/mockup` @ `bf2c3545…` → **el tuyo (después de la Ola 0):** `________`
- Rama: `justin/farmacia-tienda-y-receta-2026-09-25` · Peldaño alcanzado (regla 30): `UNKNOWN`
- Daily de equipo: [`Daily-Noche-2026-09-25.md`](../Daily-Noche-2026-09-25.md)

## 0. Arrancás cuando la Ola 0 esté publicada — y no antes de una hora

Mirá §4-bis del daily de equipo: cuando Pablo (H2) y Marcelo (H2) estén **PUBLICADO**, fijás tu corte desde ese
`origin/mockup`. Si a la hora no llegaron, codeás contra el contrato del plan §4 con un doble local y lo declarás
(regla 65). **Tu primera entrega visible es H3.S5**: la ruta `/my-account/pharmacy` apuntando a la tienda — Pablo
la espera para borrar el hub.

## 1. Instalación del estándar — pegá la salida acá

```text
$ ls .claude/skills | wc -l
<pegá la salida — tiene que dar 179>

$ ls .claude/rules/[0-9]*.md | wc -l
<pegá la salida — tiene que dar 15>

$ python .claude/hooks/plan_gate.py --self-test
<pegá la salida — tiene que dar 11 PASS, 0 FAIL>
```

- [ ] Leí `skills-router` y las 23 skills de mi lote, empezando por `search-and-filtering`.
- [ ] Creé mi `PLAN.md` antes del primer `Edit`/`Write` de código.

## 2. Baseline

| Comando | Exit code | Rojos previos | Clase (regla 80.4) |
|---|---|---|---|
| `corepack yarn lint` | | | |
| `corepack yarn typecheck` | | | |
| `corepack yarn test --watch=false` | | | |

## 3. El servicio de búsqueda (H2) — lo que fija el spec

| Caso | Esperado | Resultado |
|---|---|---|
| «paracetamol», dos sedes 10,00 y 8,00, orden precio | 8,00 primero | |
| sin origen, orden distancia | sin reordenar, `sinOrigen = true` | |
| término de 1 letra | ninguna petición | |
| fila con precio sin `availability()` | **no existe** | |

## 4. La receta al carrito (H5) — lo que fija el spec

| Caso | Esperado | Resultado |
|---|---|---|
| receta con 3 medicamentos, 2 disponibles en la sede | 2 líneas + aviso «1 no se pudo agregar» | |
| carrito previo de otra sede | confirm; cancelar no cambia | |
| `createOrderRequest(toDraft(...))` | trae `medicationRequestId` | |

## 5. Checkpoints del turno

```text
AVANCE — tienda y receta — <fase> — <ID de microtarea>
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
| H1 | / 3 | | |
| H2 | / 6 | | |
| H3 | / 18 | | |
| H4 | / 5 | | |
| H5 | / 6 | | |
| H6 | / 3 | | |
| **Total** | **/ 41** | | |

- PRs: `________`
- `git diff --stat origin/mockup -- src/app/features/account/cotizaciones` → tiene que estar vacío: `________`
- Qué quedó `A MEDIAS` (con las cuatro respuestas): `________`
- Qué quedó corriendo y se cerró: `________`
