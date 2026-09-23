# Justin — daily de la noche del 2026-09-22

> **AVANCE: 0 / 51 — 0 %.** ← actualizá esta línea al cerrar. Sale de `microtareas HECHO / total`.
> `A MEDIAS` cuenta como **no hecha**. Prohibido el porcentaje estimado a ojo (regla 50 §5).

- Carril: [`Noche-ReservaYCotizaciones.DirectorioYPrecios`](Noche-ReservaYCotizaciones.DirectorioYPrecios/ClicUnicoEnElDirectorioYCotizacionesPorPrecioYCercania.md)
- Corte: `origin/mockup` @ `b655e844…` → **el tuyo:** `________________`
- Rama: `________________` · Peldaño alcanzado (regla 30): `________________`
- Daily de equipo: [`Daily-Noche-2026-09-22.md`](../Daily-Noche-2026-09-22.md)

## 0. Tu primera entrega es una medición, y Ender la espera

Antes de tocar nada: el flujo `/directory` → médico → cupo con la pestaña Red abierta. Cuántas
peticiones, cuánto tarda cada una, cuál es el total, y qué disparan cuatro clics seguidos. Sin ese número
no hay «antes», y Ender no puede decidir la latencia. **Publicalo en §4-bis del daily de equipo apenas esté.**

## 1. Instalación del estándar — pegá la salida acá

```text
$ ls .claude/skills | wc -l
<pegá la salida — tiene que dar 176>

$ ls .claude/rules/[0-9]*.md | wc -l
<pegá la salida — tiene que dar 14>

$ python .claude/hooks/plan_gate.py --self-test
<pegá la salida — tiene que dar 11 PASS, 0 FAIL>
```

- [ ] Leí `skills-router` y las 28 skills de mi lote, empezando por `frontend-performance`.
- [ ] Creé mi `PLAN.md` antes del primer `Edit`/`Write` de código.

## 2. Baseline

| Comando | Exit code | Rojos previos | Clase (regla 80.4) |
|---|---|---|---|
| `yarn lint` | | | |
| `yarn typecheck` | | | |
| `yarn test --watch=false` | | | |

## 3. La medición — antes y después (H1.S2, H2.S1.M5, H2.S2.M5-M6)

| Recorrido | Peticiones | Total (ms) | Cuatro clics seguidos → cargas | Con la latencia de Ender |
|---|---|---|---|---|
| Antes | | | | — |
| Después (H2) | | | | |

## 4. La decisión de Cotizaciones (H3.S1.M2)

| Alternativa | Elegida | Motivo |
|---|---|---|
| (a) `features/account/cotizaciones/**` que compone `where-to-buy` + `nearby-places` | | |
| (b) extender `where-to-buy` | | |

**Precio sin procedencia:** ¿qué mostrás por vertical? `________________` (nunca un número inventado; UMA rotulado, sin conversión)

## 5. Checkpoints del turno

```text
AVANCE — reserva y cotizaciones — <fase> — <ID de microtarea>
- Hecho:      <qué quedó, concreto>
- Evidencia:  <comando / ruta / "ninguna todavía">
- Ahora:      <la siguiente acción, una sola>
- Bloqueo:    ninguno | <qué bloquea y de quién depende>
- Estado:     TODO | EN CURSO | HECHO | A MEDIAS | BLOQUEADO | DESCARTADO
- Peldaño:    UNKNOWN | DISCOVERED | WRITTEN | RUNS | TESTED | VERIFIED | REGRESSION_VERIFIED
```

## 6. Lo que pediste y su estado

| Qué | A quién | Estado | Si no llegó: contrato simulado en tres niveles (regla 65) |
|---|---|---|---|
| Latencia por ruta | Ender | | medís con la actual y repetís al mergear |
| Filtro por profesional en `GET /scheduling/slots` | Ender | | paralelo por sede, declarado |
| Renglón «Cotizaciones» (PATIENT) + ruta lazy | Ender | | probás por URL directa |
| Piezas de tabla (paginación en cliente, scroll vertical) | Pablo | | lo que hay hoy, declarado |

## 7. Lo que publicaste

| Qué | Para quién | Ruta + hora |
|---|---|---|
| Medición del flujo de reserva | Ender | |
| Componente y ruta de «Cotizaciones» para el renglón | Ender | |

## 8. Al cerrar

- [ ] `REPORTE.md` con el avance en la **primera línea** y sus tres secciones (una vacía se escribe «ninguna»).
- [ ] Baseline repetido y comparado: ningún rojo **nuevo**.
- [ ] **La medición «después» pegada junto a la «antes»**, mismo recorrido.
- [ ] **Ningún precio sin procedencia**; UMA nunca convertido.
- [ ] Los cuatro estados + «sin ubicación» + «no publicado», accionables.
- [ ] Todo botón nuevo con ícono + texto.
- [ ] Manejadores simulados nuevos declarados como dobles.
- [ ] Capturas por viewport y tema, **miradas**, con su línea.
- [ ] Sólo `paciente@alovida.mock` en capturas y reporte.
- [ ] Procesos corriendo, enumerados y cerrados. Si no quedó nada, decilo.
