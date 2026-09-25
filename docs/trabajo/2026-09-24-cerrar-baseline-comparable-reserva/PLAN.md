# Plan — Cerrar el baseline comparable de Directorio y Reserva

- Fecha: 2026-09-24 · Rama: `justin/cerrar-baseline-comparable-reserva-2026-09-24`.
- Se apila sobre `justin/cerrar-validacion-coolify-cotizaciones-2026-09-23` (PR
  [#36](https://github.com/PabloArauzCaballero/AlovidaPromptManager/pull/36), abierto), que es de
  donde sale el pendiente que este trabajo cierra. Cuando #36 se mergee, este PR se encoge solo.
- Producto: `mantra-core-health`, rama `justin/baseline-historico-reserva-2026-09-23` hacia `mockup`.

## Resultado

**Actor:** Justin, para Ender y para quien lea el daily.
**Dónde:** el daily de equipo del 2026-09-22 (§4-bis, fila «Medición del flujo de reserva») y el
daily de Justin (§7 y §9).
**Estado inicial:** la fila dice `A MEDIAS` con el motivo «No publicada: faltan baseline y
recorrido». El reporte de gates del 23/09 repite el mismo pendiente: «línea base histórica
comparable y recorrido instrumentado repetido». Había en disco un `PLAN.md`, un spec de Playwright
y evidencia sin commitear, de una sesión anterior que quedó a mitad.
**Acción:** terminar esa medición contra los dos cortes reales, con muestras repetidas, publicar la
evidencia en el repositorio de producto y actualizar acá las dos filas del daily con el resultado y
sus límites.
**Observable:** el daily enlaza una tabla que cualquiera puede volver a producir con los comandos
publicados, y dice qué parte del delta **no** se puede atribuir al carril.
**Fuera:** mergear PRs, tocar código de producto, inventar una atribución de la mejora, o subir el
conteo de microtareas del carril original sin adjudicación por ID.
**Kill-test:** publicar una mejora como si fuera del cambio de Directorio, o declarar `HECHO` el DoD
«hasta cupos» con un recorrido que termina en un estado vacío.

## H1 — Terminar la medición que quedó a medias

**CA:** Dado el trabajo sin commitear de la sesión anterior, cuando se lo ejecuta contra los dos
cortes, entonces o bien produce una comparación válida o bien dice por qué no puede.
**DoD:** muestras repetidas por corte y escenario, con su archivo en disco.
**Estado:** HECHO

| ID | Microtarea | DoD | Estado |
|---|---|---|---|
| M1.1 | Levantar los dos cortes y reproducir la medición | dos `ng serve`, uno por corte | HECHO |
| M1.2 | Auditar el instrumento antes de creerle | hallazgos con archivo y línea | HECHO — 5 defectos, ver REPORTE |
| M1.3 | Repetir la medición hasta que el ruido se pueda separar de la señal | 10 muestras por corte y escenario | HECHO |
| M1.4 | Cubrir el DoD «hasta cupos» | un recorrido que termina con cupos a la vista, comparable entre cortes | HECHO |

## H2 — Revisar la evidencia visual como corresponde

**CA:** Dadas las capturas finales, cuando se las revisa dos veces, entonces cada pantalla tiene nota
escrita y los hallazgos tienen severidad.
**DoD:** `evidencia/doble-revision.md` en el repositorio de producto, enlazado desde su `REPORTE.md`.
**Estado:** HECHO

| ID | Microtarea | DoD | Estado |
|---|---|---|---|
| M2.1 | Primera pasada de verificación sobre las 14 capturas | una línea por captura | HECHO |
| M2.2 | Segunda pasada adversarial, por un agente distinto del que implementó (regla 35.1.6) | veredicto escrito con severidades | HECHO |

## H3 — Publicar

**CA:** Dado el resultado, cuando se abre el daily, entonces la fila ya no dice «no publicada» y
enlaza la evidencia, sin subir el conteo del carril.
**DoD:** dos PRs abiertos y mergeables, con la salida de `gh` pegada.
**Estado:** HECHO

| ID | Microtarea | DoD | Estado |
|---|---|---|---|
| M3.1 | PR de producto hacia `mockup` | `gh pr view` con `MERGEABLE` | HECHO |
| M3.2 | Actualizar las dos filas del daily | daily de equipo §4-bis y daily de Justin §7/§9 | HECHO |
| M3.3 | PR de PromptManager hacia `main` | `gh pr view` con `MERGEABLE` | HECHO |

## Riesgos y límites

| Riesgo | Mitigación |
|---|---|
| Atribuir al carril una mejora que trajo otro cambio | Entre los dos cortes también entró la tabla de latencia determinista de Ender. Se publica el delta conjunto y se dice explícitamente que no se puede separar sin un tercer corte |
| Creerle al instrumento heredado | Se audita antes de usarlo; los 5 defectos encontrados están en el REPORTE con su consecuencia |
| Subir el avance del carril sin adjudicación | El conteo `29 / 51` no se toca. Esta publicación cierra un pendiente, no adjudica microtareas nuevas |
| Conflicto con el PR #36, que toca los mismos dailies | La rama se apila sobre #36 en vez de salir de `main` |
