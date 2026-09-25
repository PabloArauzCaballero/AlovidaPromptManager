# Justin — daily de la noche del 2026-09-22

> **AVANCE: 44 / 51 — 86,3 %.** ← 29 publicados (20 legados + 9 de #583) + 15 del cierre del 2026-09-24. Seis tareas de documentos están `DESCARTADO` por la decisión de producto y no suman. Sólo H2.S2.M5 queda `A MEDIAS`, con sus cuatro respuestas en el [reporte de cierre](../../../../docs/trabajo/2026-09-24-cerrar-carril-reserva-cotizaciones/REPORTE.md).
> `A MEDIAS` cuenta como **no hecha**. Prohibido el porcentaje estimado a ojo (regla 50 §5).

> **Antes de seguir, leé [`CERRAR-EL-CARRIL-SIN-FRENOS.md`](CERRAR-EL-CARRIL-SIN-FRENOS.md)** (2026-09-24): terminar las 16 microtareas que faltan sin frenos y documentar todo junto al final.

- Carril: [`Noche-ReservaYCotizaciones.DirectorioYPrecios`](Noche-ReservaYCotizaciones.DirectorioYPrecios/ClicUnicoEnElDirectorioYCotizacionesPorPrecioYCercania.md)
- Corte: `origin/mockup` @ `b655e844…` → **el tuyo:** `4daf00aa` (medición, capturas y suite), rebasado a `95472903` para los PRs
- Rama: `justin/cerrar-carril-reserva-cotizaciones-2026-09-24` · Peldaño alcanzado (regla 30): `REGRESSION_VERIFIED` contra el doble del mockup, con doble revisión adversarial de 6 rondas (sin API real)
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
| Medición del flujo de reserva | Ender | Publicada el 2026-09-24, tarde: ver la fila del [daily de equipo](../Daily-Noche-2026-09-22.md) y la última fila de acá abajo |
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
| Baseline comparable de Directorio y Reserva | Ender, Pablo | [Plan y cierre](../../../../docs/trabajo/2026-09-24-cerrar-baseline-comparable-reserva/REPORTE.md) · `mantra-core-health` rama `justin/baseline-historico-reserva-2026-09-23` → `mockup`, con `docs/trabajo/2026-09-23-baseline-comparable-reserva/` | `PUBLICADO con límites`: 2 escenarios × 10 muestras × 2 cortes (`b7785e36` → `a43ad2b3`). Medianas **1428 → 1108 ms** (hasta los cupos, con cuatro activaciones) y **1460 → 892 ms** (camino por defecto, que termina sin horarios). *Corregido el 2026-09-24: acá decía 1691 → 1163 y 1431 → 991, medianas del set anterior a la tercera revisión; las de arriba son las del `resumen.json` de #610.* 14 capturas 1440×900/390×844, sin médicos reales del catálogo de aseguradoras, con doble revisión adversarial. **Corrige tres cosas de la fila de #583**: el corte medido es la punta de `mockup`, no #583 —entre medio hay 8 merges de PR—; los 1.468 ms no se reproducen con instrumento declarado; y «cuatro toques → una navegación» **ya se cumplía en `b7785e36`**. **No suma microtareas**: el conteo sigue en 29/51. |
| Cierre del carril: una lectura de cupos por sede, Cotizaciones con fuentes reales, y evidencia (H2+H3+H5+H6) | Ender, Pablo | [#630](https://github.com/mdavila-2001/mantra-core-health/pull/630)–[#635](https://github.com/mdavila-2001/mantra-core-health/pull/635) — **fusionados** el 24/09 21:25 UTC, antes de que terminara la doble revisión adversarial | `MERGEADO` con la primera versión (sin las correcciones de las 6 rondas de revisión). Mediana hasta los cupos **992 ms** (10 muestras, instrumento de #610). H2.S2.M5 `A MEDIAS` (−31 %, no −50 %) |
| Corrección post-fusión: 6 rondas de revisión adversarial (regla 35.1), sobre lo ya fusionado | Todo el equipo | [#651](https://github.com/mdavila-2001/mantra-core-health/pull/651) → `mockup` · [#652](https://github.com/mdavila-2001/mantra-core-health/pull/652) → `dev` · [reporte y detalle de las 6 rondas](../../../../docs/trabajo/2026-09-24-cerrar-carril-reserva-cotizaciones/evidencia/doble-revision.md) | `PUBLICADO`, mergeable. Corrige un hallazgo **bloqueante** (precios inventados del simulador atribuidos a sedes con nombre real, «Farmacias Chávez», «DIACOR S.A.», como si los hubieran publicado — regla 00 §2.1) más versión móvil real, contraste WCAG AA del enlace de acción, vacío S2 propio, fuente caída con acción, y más. Cierra H2.S2.M4 y H3.S2.M4 (antes `A MEDIAS`, ahora con evidencia completa) |

## 7-bis. Trabajo de la Mac mini — registro, no seguimiento

Entre el 23 y el 24/09, la Mac mini (commits de la cuenta de Pablo) trabajó en ramas `justin/*`
**fuera de este carril**. Queda registrado acá porque las ramas llevan el nombre de Justin; **no se
sigue ni se amplía desde este carril** (regla 6 de `CERRAR-EL-CARRIL-SIN-FRENOS.md`) y **no suma
microtareas** a este conteo.

| PR | Rama | Qué | Estado al 2026-09-24 |
|---|---|---|---|
| [#607](https://github.com/mdavila-2001/mantra-core-health/pull/607) | `justin/mockup-corr-34-…` | CORR-34: prueba del cartel de demo en rutas del paciente | fusionado en `mockup` |
| [#608](https://github.com/mdavila-2001/mantra-core-health/pull/608) | `justin/mockup-corr-04-paciente-imagenologia` | Llevó a `master` commits de Cotizaciones de Justin (#580, #581) | fusionado en `master` |
| [#611](https://github.com/mdavila-2001/mantra-core-health/pull/611) | `justin/mockup-corr-39-…` | CORR-39: prueba y evidencia de matrículas y adjuntos | fusionado en `mockup` |
| [#612](https://github.com/mdavila-2001/mantra-core-health/pull/612) | `justin/mockup-corr-38-…` | CORR-38: quita el switch de certificación de especialidad | fusionado en `mockup` |
| [#615](https://github.com/mdavila-2001/mantra-core-health/pull/615) | `justin/medical-module-execution-20260924` | Plan Médico: credenciales PDF, dirección laboral, sedes, 4 especialidades, correos | fusionado en `master` |
| [#616](https://github.com/mdavila-2001/mantra-core-health/pull/616) | `justin/medical-module-cierre` | Cierre documental del plan Médico | fusionado en `master` |

El plan Médico declara su propio avance en `planes/02-medical-module-plan-b57dfd316c4d/REPORT.md`:
**10 / 98 criterios HECHO**.

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

- **Cierre del 2026-09-24: 44 / 51 HECHO, tras 6 rondas de revisión adversarial.** Las 16 pendientes se trabajaron según `CERRAR-EL-CARRIL-SIN-FRENOS.md`. El código se fusionó en [#630](https://github.com/mdavila-2001/mantra-core-health/pull/630)–[#635](https://github.com/mdavila-2001/mantra-core-health/pull/635) **antes** de que terminara la doble revisión (regla 35.1), así que las 5 rondas con hallazgos reales —una **bloqueante**: precios inventados del simulador atribuidos a sedes con nombre real como si los hubieran publicado (regla 00 §2.1)— se corrigieron en un PR aparte, [#651](https://github.com/mdavila-2001/mantra-core-health/pull/651)/[#652](https://github.com/mdavila-2001/mantra-core-health/pull/652), ya `MERGEABLE`. Sólo H2.S2.M5 queda `A MEDIAS` (−31 %, no el −50 % del criterio). Detalle, las 6 rondas hallazgo por hallazgo, y brechas en el [reporte de cierre](../../../../docs/trabajo/2026-09-24-cerrar-carril-reserva-cotizaciones/REPORTE.md) y en [`evidencia/doble-revision.md`](../../../../docs/trabajo/2026-09-24-cerrar-carril-reserva-cotizaciones/evidencia/doble-revision.md). **Brecha que importa:** los precios de diagnóstico que muestra la maqueta salen de una fórmula sintética del doble (`45 + (i % 12) × 30`), no son precios reales; ahora se lo declara así en cada fila.

- **`29 / 51 HECHO` es el avance publicado:** conserva 20 HECHO legados y añade 9 no solapados, con evidencia por ID en la [`adjudicación del cierre local`](../../../../docs/trabajo/2026-09-23-publicar-cierre-local-reserva-cotizaciones/REPORTE.md). Seis tareas H4 de documentos son `DESCARTADO`: Cotizaciones sólo muestra cotizaciones. No se contabilizan.
- **Código fusionado y despliegue observado:** #578, #579, #580 y #581 forman parte de `mockup`. La prueba de navegador de Cotizaciones [#583](https://github.com/mdavila-2001/mantra-core-health/pull/583) se fusionó en `5dc38c9`; Coolify desplegó después `fc8adc4e491f2cca9c159ba1ce74cb214d4359dd` con estado `Success`, y ese commit contiene `5dc38c9` como padre y `66bbcb76` (#581) en su historial.
- **Despliegue remoto verificado contra el doble:** el recurso `mockup-frontend` quedó `Success` y el recorrido público de Cotizaciones pasó `1` escenario en Chromium. La prueba usa el backend simulado del mockup; no afirma integración con API real. La evidencia literal está en el [cierre remoto](../../../../docs/trabajo/2026-09-23-cerrar-validacion-remota-cotizaciones/REPORTE.md).
- **Gates locales focalizados de #583:** typecheck y build terminaron con exit `0`; el lint de los siete TypeScript y dos plantillas del diff terminó con `0`; siete archivos/73 tests y los dos recorridos de navegador de Directorio → Cotizaciones pasaron. El detalle reproducible está en los [gates locales](../../../../docs/trabajo/2026-09-23-publicar-gates-reserva-cotizaciones/REPORTE.md).
- **Baseline histórico hasta cupos: cerrado el 2026-09-24.** Con dos escenarios y 10 muestras por corte, porque el recorrido por defecto —primera tarjeta de la primera especialidad— **no llega a un cupo en ninguno de los dos cortes**: los médicos de la red de aseguradoras no tienen agenda a propósito. Hizo falta un segundo recorrido sobre la única cardióloga con horarios en ambos cortes. La mejora de medianas **no se adjudica a este carril**: entre los dos cortes entró también la tabla de latencia determinista de Ender, y separarlas pide un tercer corte que no se hizo.
- **Seguimiento, no bloqueo:** los contratos de precios/origen/acciones continúan `A MEDIAS` o `DECISION_REQUIRED`; lint global (243) y suite total (4 fallos) son deuda fuera del diff de #583. No se inventan ni se marcan HECHO, pero no bloquean este cierre ni el contrato simulado. El DNS de `demo.alovidasalud.com` no se cambia para este cierre.
