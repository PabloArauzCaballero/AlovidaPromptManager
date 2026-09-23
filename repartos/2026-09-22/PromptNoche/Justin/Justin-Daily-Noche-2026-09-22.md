# Justin — daily de la noche del 2026-09-22

> **AVANCE: 29 / 51 — 56.9 %.** ← 20 HECHO legados + 9 HECHO posteriores no solapados, adjudicados por ID en el cierre local de #583. Seis tareas de documentos están `DESCARTADO` por la decisión de producto y no suman.
> `A MEDIAS` cuenta como **no hecha**. Prohibido el porcentaje estimado a ojo (regla 50 §5).

- Carril: [`Noche-ReservaYCotizaciones.DirectorioYPrecios`](Noche-ReservaYCotizaciones.DirectorioYPrecios/ClicUnicoEnElDirectorioYCotizacionesPorPrecioYCercania.md)
- Corte: `origin/mockup` @ `b655e844…` → **el tuyo:** `________________`
- Rama: `________________` · Peldaño alcanzado (regla 30): `________________`
- Daily de equipo: [`Daily-Noche-2026-09-22.md`](../Daily-Noche-2026-09-22.md)

> **Publicación tardía — 2026-09-23.** El frontend recibió los PRs de Justin [#578](https://github.com/mdavila-2001/mantra-core-health/pull/578), [#579](https://github.com/mdavila-2001/mantra-core-health/pull/579) y [#580](https://github.com/mdavila-2001/mantra-core-health/pull/580), fusionados en `mockup`. Este daily no se había actualizado, por eso el equipo no tenía el puntero. El detalle, evidencia y límites están en [`docs/trabajo/2026-09-23-publicar-avance-justin/REPORTE.md`](../../../../docs/trabajo/2026-09-23-publicar-avance-justin/REPORTE.md).

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

### Publicado después del turno

| Qué | Para quién | Ruta + hora | Estado |
|---|---|---|---|
| Pantalla, ruta y menú de Cotizaciones | Pablo, Ender | `mantra-core-health` PR [#578](https://github.com/mdavila-2001/mantra-core-health/pull/578), merge `38072e84`, 2026-09-23 13:56 UTC | `A MEDIAS`: no cubre los DoD completos del carril |
| Órdenes diagnósticas propias con etiquetas, sin IDs impresos | Pablo | `mantra-core-health` PR [#579](https://github.com/mdavila-2001/mantra-core-health/pull/579), merge `8ae7283a`, 2026-09-23 14:13 UTC | `A MEDIAS`: falta publicación observable en mockup |
| Estados de perfil, error y truncamiento de órdenes | Pablo | `mantra-core-health` PR [#580](https://github.com/mdavila-2001/mantra-core-health/pull/580), merge `05d83cb8` | `A MEDIAS`: fusionado; falta publicación observable y DoD del carril |
| Simplificación: Cotizaciones sin estudios personales, con contrato de menú sincronizado | Pablo, Ender | `mantra-core-health` PR [#581](https://github.com/mdavila-2001/mantra-core-health/pull/581), merge `66bbcb76` en `mockup`; incluido en el despliegue `fc8adc4` | `HECHO` en su plan propio 4/4: prueba focal, observación autenticada local y recorrido de Chromium. El E2E remoto de #583 lo verifica contra el doble, no contra API real. |
| Cierre local de Cotizaciones y disponibilidad en Directorio | Pablo, Ender | `mantra-core-health` PR [#583](https://github.com/mdavila-2001/mantra-core-health/pull/583), commit `4c9e419f`, rama `justin/verificar-cotizaciones-navegador-2026-09-23`, sobre `origin/mockup@b7785e36` | `PUBLICADO`: seis capturas (390/768/1440, claro/oscuro), teclado/orden/filtro, gates locales, cuatro toques → una navegación y la acción visible `Revisar disponibilidad` → `#horarios`. El recorrido hasta un cupo midió 1.468 ms localmente. La adjudicación suma 9 HECHO no solapados: 29/51 total. |
| Verificación remota de Cotizaciones | Pablo, Ender | [Cierre y evidencia](../../../../docs/trabajo/2026-09-23-cerrar-validacion-remota-cotizaciones/REPORTE.md) · Coolify `mockup-frontend` desplegó `fc8adc4` exitosamente; el commit contiene `5dc38c9`, merge de [#583](https://github.com/mdavila-2001/mantra-core-health/pull/583) | `VERIFIED contra el doble`: E2E público en Chromium `1 passed`; no cubre API real ni los DoD completos del carril |

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

## 9. Estado real al publicar este daily

- **`29 / 51 HECHO` es el avance publicado:** conserva 20 HECHO legados y añade 9 no solapados, con evidencia por ID en la [`adjudicación del cierre local`](../../../../docs/trabajo/2026-09-23-publicar-cierre-local-reserva-cotizaciones/REPORTE.md). Seis tareas H4 de documentos son `DESCARTADO`: Cotizaciones sólo muestra cotizaciones. No se contabilizan.
- **Código fusionado y despliegue observado:** #578, #579, #580 y #581 forman parte de `mockup`. La prueba de navegador de Cotizaciones [#583](https://github.com/mdavila-2001/mantra-core-health/pull/583) se fusionó en `5dc38c9`; Coolify desplegó después `fc8adc4e491f2cca9c159ba1ce74cb214d4359dd` con estado `Success`, y ese commit contiene `5dc38c9` como padre y `66bbcb76` (#581) en su historial.
- **Despliegue remoto verificado contra el doble:** el recurso `mockup-frontend` quedó `Success` y el recorrido público de Cotizaciones pasó `1` escenario en Chromium. La prueba usa el backend simulado del mockup; no afirma integración con API real. La evidencia literal está en el [cierre remoto](../../../../docs/trabajo/2026-09-23-cerrar-validacion-remota-cotizaciones/REPORTE.md).
- **Gates locales focalizados de #583:** typecheck y build terminaron con exit `0`; lint focal terminó con `0`; siete archivos/73 tests y los dos recorridos de navegador de Directorio → Cotizaciones pasaron. El detalle reproducible está en los [gates locales](../../../../docs/trabajo/2026-09-23-publicar-gates-reserva-cotizaciones/REPORTE.md).
- **Seguimiento, no bloqueo:** baseline histórico hasta cupos y contratos de precios/origen/acciones continúan `A MEDIAS` o `DECISION_REQUIRED`; lint global (243) y suite total (4 fallos) son deuda fuera del diff de #583. No se inventan ni se marcan HECHO, pero no bloquean este cierre ni el contrato simulado. El DNS de `demo.alovidasalud.com` no se cambia para este cierre.
