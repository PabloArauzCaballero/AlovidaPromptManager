# Reporte — Cerrar el baseline comparable de Directorio y Reserva

> **AVANCE: 8 / 9 microtareas HECHO (88,9 %)** de este plan. La restante, `M3.1`, está `A MEDIAS`:
> el PR de producto quedó `MERGEABLE` pero `UNSTABLE`, y la regla 35.2 no admite eso como entrega.
> **El conteo del carril original no se toca: sigue en 29 / 51.** Esto cierra un pendiente, no
> adjudica microtareas nuevas.

- Fecha: 2026-09-24 · Plan: [PLAN.md](./PLAN.md) · Rama:
  `justin/cerrar-baseline-comparable-reserva-2026-09-24`, apilada sobre la del PR
  [#36](https://github.com/PabloArauzCaballero/AlovidaPromptManager/pull/36).
- Producto: `mantra-core-health` PR
  [#610](https://github.com/mdavila-2001/mantra-core-health/pull/610) → `mockup`, con la evidencia
  completa en `docs/trabajo/2026-09-23-baseline-comparable-reserva/`.

## Qué estaba a medias

El daily de equipo del 2026-09-22 tenía la fila «Medición del flujo de reserva (peticiones,
tiempos)» en `A MEDIAS`, con el motivo **«No publicada: faltan baseline y recorrido»**. El reporte
de gates del 23/09 la repetía como pendiente: «línea base histórica comparable y recorrido
instrumentado repetido».

En disco había, **sin commitear**, un `PLAN.md` con todo en `TODO`/`EN CURSO`, un spec de Playwright
y una carpeta de evidencia de una sesión anterior que no llegó a cerrar.

## Completado

| ID | Qué se logró (observable) | Comando de verificación | Resultado |
|---|---|---|---|
| M1.1 | Los dos cortes levantados a la vez y medidos con el mismo instrumento | `corepack yarn dev --port 4210` en un worktree de `b7785e36`, `--port 4200` en la punta | dos `ng serve` respondiendo |
| M1.2 | El instrumento heredado auditado **antes** de creerle | ver «Los seis defectos» | 6 defectos, todos corregidos |
| M1.3 | Diez muestras por corte y escenario, con un runner que falla fuerte | `muestras2.sh`, que aborta si una corrida no escribe su medición | 40 muestras, cada una en su archivo |
| M1.4 | El DoD «hasta cupos» cubierto con un recorrido que **llega** a cupos | escenario A del spec | 2 sedes · 15 cupos · «vie 25 · 08:30–09:00» en los dos cortes |
| M2.1 | Primera pasada de verificación sobre las 14 capturas | las 14 abiertas como imagen | una línea por captura |
| M2.2 | Pasadas adversariales, por un agente distinto del que implementó (regla 35.1.6, y 35.1.4: toda corrección exige volver a revisar) | `evidencia/doble-revision.md` del repo de producto | **tres rondas**: rechazó 4 de 7 pares, después 1 de 7, y la tercera aprobó las catorce |
| M3.2 | Las dos filas del daily actualizadas | [daily de equipo](../../repartos/2026-09-22/PromptNoche/Daily-Noche-2026-09-22.md) §4-bis y [daily de Justin](../../repartos/2026-09-22/PromptNoche/Justin/Justin-Daily-Noche-2026-09-22.md) §7 y §9 | `A MEDIAS` → `PUBLICADO con límites` |
| M3.3 | PR de PromptManager [#38](https://github.com/PabloArauzCaballero/AlovidaPromptManager/pull/38) hacia `main` | `gh pr view 38` | `MERGEABLE` · `CLEAN`, su check en verde |

## Los números que se publican

Dos escenarios, diez muestras por corte cada uno, entre `b7785e36` y la punta de `mockup`
`a43ad2b3`.

| Escenario | antes | después | delta de medianas | ¿los rangos se solapan? |
|---|---|---|---|---|
| Hasta los cupos, con cuatro activaciones | 1428 ms | 1108 ms | −320 ms (−22 %) | **sí** — 1 de 10 muestras nuevas supera la mediana vieja |
| Camino por defecto, que termina sin horarios | 1460 ms | 892 ms | −568 ms (−39 %) | no — 0 de 10 |

**Peticiones de negocio observables: 0 en los dos cortes.** El simulador del mockup es un
interceptor en memoria, así que lo que aparece en la pestaña Red son los `chunk-*.js` del servidor
de desarrollo. Ender: no hay tráfico HTTP que optimizar en este recorrido; lo que se mide es la
latencia que tu propia tabla simula.

## Lo que este cierre corrige de lo publicado antes

| Qué decía | Qué dice la evidencia |
|---|---|
| «El recorrido hasta un cupo midió 1.468 ms» (daily de Justin, fila de #583) | **No se reproduce.** La muestra vieja no declara escenario ni cantidad de corridas. Con instrumento declarado y 10 muestras, el mismo recorrido da 1428 ms de mediana en el corte anterior y 1108 en el actual |
| «Cuatro toques → una navegación» como logro de #583 | **Ya se cumplía en `b7785e36`.** No es un delta de ese PR |
| El corte posterior es el PR #583 | Es la **punta de `mockup`**: 30 commits y 8 merges de PR de distancia. La diferencia de barra lateral y cabecera que se ve en todas las capturas viene de los tres `ender/simulador-cabecera` (#584, #592, #598) |

**Nada se adjudica a un PR en particular.** Entre los dos cortes entró también la tabla de latencia
determinista del simulador (`/scheduling/slots` de `120 + random(0..179)` a `40` fijos), que toca
justo la ruta caliente de elegir médico. Separarla pediría un tercer corte que no se hizo.

## Los seis defectos del instrumento que se heredó

Encontrados auditándolo antes de usarlo. Todos corregidos en el spec; el detalle, con su
consecuencia, está en el `REPORTE.md` del repo de producto.

1. El cronómetro paraba en `getByRole('button').first()` del bloque de disponibilidad, que es
   **«Semana anterior»** y está pintado desde el primer frame: medía hasta **antes** de que llegaran
   los cupos.
2. `estable()` espera `networkidle`, que con `ng serve` no llega, y abandona **en silencio** a los
   15 s — el propio `CLAUDE.md` del repo lo advierte.
3. El proyecto `chromium` extiende `devices['Desktop Chrome']`, cuyo viewport 1280×720 **pisa** el
   1440×900 del config: los archivos `-1440` guardaban 1280 px.
4. `fullPage: true` con la barra lateral `position: fixed` la pinta una sola vez arriba, encima de
   la primera columna del resto.
5. `page.screenshot()` **no** congela animaciones, y `toBeVisible()` se cumple en el primer
   fotograma: el mismo estado vacío salió a 74 % de opacidad en un corte y a 40 % en el otro, con el
   subtítulo a 1,93:1 de contraste.
6. **`animations: 'disabled'` tampoco alcanzó.** Con el flag en las catorce capturas, una siguió
   saliendo a 66,5 % de opacidad. Ahora se espera a que terminen **todas las animaciones finitas**
   de la página y se **asevera** opacidad 1 y desplazamiento 0: si volviera a dispararse en vuelo,
   falla la prueba en vez de viajar dentro de un PNG.

## La revisión adversarial hizo su trabajo

Tres rondas, todas por un agente distinto del que implementó (regla 35.1.6, y `NO_SELF_APPROVAL`
del `CLAUDE.md` del frontend).

- **Ronda 1 — rechazó 4 de 7 pares.** Tres bloqueantes: las capturas mostraban **médicos reales**
  del catálogo que publican las aseguradoras, con nombre y dirección de consultorio; dos pares
  estaban fotografiados a mitad de animación; y el corte «después» no era el PR que el plan decía
  comparar. Además: publicar una corrida suelta daba **−36 %** donde por medianas era −18 %.
- **Ronda 2 — rechazó 1 de 7.** Dos bloqueantes cerrados, pero una captura seguía en vuelo **pese
  al flag**, y el reporte declaraba `HECHO` que eso ya no pasaba.
- **Ronda 3 — aprobó las catorce.** `07` quedó asentado (el subtítulo pasó de 3,37:1 a 7,88:1 de
  contraste y el par da cero píxeles de diferencia de contenido) y el `resumen.json` se recalculó de
  cero contra las 40 muestras crudas. Tres pares van `ACEPTABLE CON RESERVAS`, y no por la captura:
  es el defecto real del corte anterior que quedó anotado como `P-2`. Dejó seis observaciones de
  texto —entre ellas que el reporte arrastraba dos medianas del set anterior— y todas están
  corregidas en el PR.

El resultado de esa disciplina no es cosmético: sin ella, este cierre habría publicado un −36 % que
no existe, capturas con datos de personas reales y una atribución al PR #583 que la evidencia no
sostiene.

## Hallazgos de producto que quedan anotados

| ID | Qué | Estado |
|---|---|---|
| P-1 | **El camino que un paciente toma por defecto no llega a un cupo en ninguno de los dos cortes**: la primera tarjeta de la primera especialidad es un médico de la red de aseguradoras, y ésos no tienen agenda a propósito | `DECISION_REQUIRED` de producto |
| P-2 | En el corte anterior, a 390 px la píldora «Datos de prueba» tapaba entera la campana de notificaciones. En el actual es un chip «Demo» bajo la cabecera | Ya corregido en `mockup`; queda el antes y el después |
| P-3 | Tres cifras conviven en el listado sin explicarse («2 médicos» / «Cardiología 1» / portada «Cardiología · 50 médicos»), idénticas en los dos cortes | seguimiento, dueño del listado. No se inventa la causa |

## A medias

- **M3.1 — dejar el PR de producto mergeable.**
  1. *Qué anda:* [#610](https://github.com/mdavila-2001/mantra-core-health/pull/610) está abierto,
     no es borrador, `mergeable` da `MERGEABLE` y no tiene conflictos con `mockup`.
  2. *Qué no anda:* `mergeStateStatus` da `UNSTABLE`, que la regla 35.2 no admite como entrega.
  3. *Qué falta exactamente:* que los tres checks del frontend salgan de la cola y terminen.
     **Ninguno falla: están encolados**, y no por este PR — #604, #605, #606 y #607 están igual,
     el más viejo desde hace más de una hora. Es `ENVIRONMENT` (regla 80.4). En su lugar se
     corrieron a mano los guardrails que el `CLAUDE.md` de ese repo manda correr así, y sus rojos
     caen enteros fuera del diff.
  4. *Dónde quedó:* rama `justin/baseline-historico-reserva-2026-09-23`, empujada, PR abierto, sin
     auto-merge. No se tocaron privilegios ni se deshabilitó ningún check.

## Pendiente

| Qué | Estado | Qué falta |
|---|---|---|
| Atribuir la mejora de tiempo a un cambio concreto | `A MEDIAS` | Un tercer corte con el Directorio nuevo y la latencia vieja |
| P-1 | `DECISION_REQUIRED` | Decisión de producto |

## No cubierto

- **No se mergeó nada.** Los dos PRs quedan abiertos para revisión humana.
- **No se subió el conteo del carril original.** Sigue en 29 / 51: esto cierra un pendiente, no
  adjudica microtareas.
- **No se tocó código de producto.** El PR del frontend son un spec de Playwright y una carpeta de
  evidencia.
- **No hay validación remota.** Todo es local, contra dos `ng serve`.
- **No se esperó a que el CI del frontend corriera**, porque no arranca en ningún PR de ese
  repositorio. Si arranca y algo cae dentro del diff de #610, es información nueva que este reporte
  no tiene.

## Estado de los PRs

| PR | Base | `mergeable` | `mergeStateStatus` | Checks |
|---|---|---|---|---|
| [`mantra-core-health#610`](https://github.com/mdavila-2001/mantra-core-health/pull/610) | `mockup` | `MERGEABLE` | `UNSTABLE` | los tres **encolados**, no fallando |
| [`AlovidaPromptManager#38`](https://github.com/PabloArauzCaballero/AlovidaPromptManager/pull/38) | `main` | `MERGEABLE` | `CLEAN` | `Espejo sin deriva y candados en verde` · `pass` |

Salida literal de los dos, en [`evidencia/pr-mergeable.txt`](evidencia/pr-mergeable.txt).

**El CI del frontend no llegó a correr, y no es por este cambio.** Los tres checks de #610
quedaron encolados; **todos** los PR abiertos de ese repositorio están igual —#604, #605, #606,
#607— y el más viejo lleva más de una hora así. Coincide con lo que su `CLAUDE.md` ya declara:
«El CI propio está caído; los `check-*.mjs` se corren a mano». Así que se corrieron a mano:
`check-tokens` da `0`; `check-architecture`, `check-css-tokens`, `check-doc-coverage` y
`check-doc-links` dan `1`, y sus rojos caen **enteros fuera** del diff de #610 —dependencias
circulares en `src/app/core/mock/fixtures/`, tokens sin declarar en `src/app/features/` y
`src/app/shared/`, y enlaces rotos en `docs/tareas/subtarea-2.4-transparencia-copagos/`—.
Ninguno nombra un archivo que #610 agregue o modifique.
