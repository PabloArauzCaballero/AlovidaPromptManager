# Capturas de H2 — la silueta del cuerpo en `/dashboard`

Chromium 151 (Playwright MCP) sobre `http://localhost:4200` (`yarn dev`, `mockBackend: true`),
sesión de `paciente@alovida.mock` (cuenta sintética del simulador; el nombre y la cita del aviso
flotante «Se liberó un horario» también son datos sembrados, no de una persona real). Fecha 2026-09-23.
Cada captura fue **mirada**; lo que se observó está en su línea. Los números salen de
[`mediciones.json`](./mediciones.json), que es la salida literal de los scripts.

| # | Archivo | Viewport · tema | Qué se miró y qué se vio |
|---|---|---|---|
| 01 | `01-375-claro.png` | 375×812 · claro | La figura (196×431 px) ocupa la primera pantalla de la tarjeta «¿Cómo te sentís?», centrada, sin desborde (`scrollWidth 360 = clientWidth 360`). Cabeza, banda de ojos, orejas, cuello, pecho, panza, brazos, pelvis y piernas se reconocen. Debajo, «Tocá una parte del cuerpo.» y empiezan las pastillas (2 columnas). |
| 02 | `02-375-oscuro.png` | 375×812 · oscuro | Mismo layout; el relleno pasa a un gris azulado oscuro y el trazo a claro translúcido (tokens del sistema respondiendo al tema). Sin desborde. |
| 03 | `03-768-claro.png` | 768×1024 · claro | Figura centrada arriba; pastillas en 4 columnas debajo (10 pastillas: 4·4·2). El `<details>` «O escribilo con tus palabras» sigue abajo, todavía plegable (eso cambia en H3.S1). |
| 04 | `04-768-oscuro.png` | 768×1024 · oscuro | Igual que 03 en oscuro. Sin desborde. |
| 05 | `05-1440-claro.png` | 1440×900 · claro | Desde 64rem la figura va a la izquierda (columna de 196 px) y las pastillas a la derecha en 6 columnas (`grid-template-columns: 196px 850px`). El bloque no duplica el alto; el área de texto queda debajo de los dos. |
| 06 | `06-1440-oscuro.png` | 1440×900 · oscuro | Igual que 05 en oscuro. |
| 07 | `07-375-pecho-elegido.png` | 375×812 · claro | Tras tocar el pecho en la figura: relleno azul, trazo grueso oscuro (5 px frente a 2 px del resto), y la línea dice «Zona elegida: **Pecho y respiración**». La pastilla «Pecho» quedó `aria-expanded="true"` y se abrieron sus 5 síntomas (tos, dificultad para respirar, dolor de pecho, palpitaciones, presión alta). |
| 08 | `08-375-escala-de-grises-panza-elegida.png` | 375×812 · claro + `filter: grayscale(1)` | Elegida desde la **pastilla** «Panza y digestión»: en escala de grises la panza se distingue igual, por el relleno oscuro y el trazo grueso, y la línea la nombra. La elección no depende del color. |
| 09 | `09-375-foco-teclado-orl.png` | 375×812 · claro | Tab desde la cabeza → ojos → Enter (elige ojos) → Tab → Espacio: el cuello y las orejas quedan elegidos y con el foco visible sobre el trazo (6 px), la línea dice «Oído, nariz y garganta», ojos se soltó. `scrollY` no cambió con la barra (272 → 272). El pecho se ve en tono claro porque el puntero quedó sobre él tras el clic anterior: es el `:hover`, no un estado elegido. |

## Lo que no está en captura pero sí en `mediciones.json`

- **Orden del tabulador**: cabeza → ojos → orl → pecho → panza → huesos → íntima; después de la figura
  el foco pasa a la primera pastilla («Cabeza y mareos»). Shift+Tab vuelve.
- **Volver a pulsar suelta**: Espacio otra vez sobre el cuello → nada elegido, síntomas cerrados.
- **Tamaño de objetivos a 375 px** (1 unidad ≈ 0,98 px): ojos 47×27, cuello 27×31, pierna 31×127.
  Todas las zonas tienen un área contigua ≥ 24×24 (WCAG 2.2 · 2.5.8). La primera geometría no lo
  cumplía (ojos 43×14, cuello 24×20) y se rehízo antes de estas capturas.
- **Movimiento reducido**: con `prefers-reduced-motion: reduce`, `transitionDuration` = `1e-05s`
  (así representa Chromium el `transition: none`); sin la preferencia, `0.12s`.
- **Consola**: 0 errores en `/dashboard`. Los 2 errores de CSP son de `/auth` (script en línea) y
  están en `evidencia/antes/consola.txt` tal cual: no son de este cambio.
- **Red**: ninguna petición no estática durante la interacción (el simulador intercepta).

## Un tropiezo del script de evidencia, declarado

La primera corrida de la prueba de teclado leyó el DOM inmediatamente después de `keyboard.press`
y reportó «Espacio no eligió». Era el script: en zoneless el render se agenda, y la lectura llegó
antes. Reproducido (la lectura siguiente mostraba la zona ya elegida) y corregido esperando por
condición (`waitFor` sobre `aria-pressed`). Clase: `TEST_BUG` del script, no del producto.
