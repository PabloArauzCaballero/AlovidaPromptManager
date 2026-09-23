# Capturas de H3 — el área de texto, el dictado y el panel sobrante

Chromium 151 (Playwright MCP) sobre `http://localhost:4200` (`yarn dev` reiniciado a las 05:48 por HALL-M3),
sesión de `paciente@alovida.mock` (cuenta sintética; el aviso flotante «Se liberó un horario» también es
dato sembrado). Fecha 2026-09-23. Cada captura fue **mirada**. Los números salen de `mediciones-s1.json`.

## H3.S1 — el área de texto como panel

| # | Archivo | Viewport · tema | Qué se miró y qué se vio |
|---|---|---|---|
| 01 | `01-375-panel-de-texto.png` | 375×812 · claro | Debajo de las pastillas, el panel «Contanos con tus palabras» a la vista: rótulo, ícono de nota a la izquierda, área de texto con su placeholder y la ayuda «Podés escribir varios síntomas; no hace falta que sea exacto.» No hay nada que desplegar (`details` = 0). El `label[for]` apunta al `id` del textarea (`mch-field-23-control`). Sin desborde. |
| 02 | `02-1440-panel-de-texto.png` | 1440×900 · claro | Mismo panel a lo ancho (1057 px), bajo la figura y la grilla de pastillas. Rótulo, ícono y ayuda alineados con el resto del texto de la tarjeta. |
| 03 | `03-375-texto-escrito.png` | 375×812 · claro | Tras escribir «me duele la cabeza hace tres días»: la fila «TE ENTENDIMOS · dolor de cabeza ×», «Empezar de nuevo» y las recomendaciones (Neurología, Oftalmología, Medicina general, cada una con «Ver quién atiende»). El área de texto quedó justo arriba, bajo la cabecera fija: lo que documenta la captura es que el reconocimiento sigue vivo con el panel nuevo; la región viva anunció «Reconocimos: dolor de cabeza.» (`mediciones-s1.json`). |

Una primera toma de la 03 salió con una banda oscura a la izquierda; se midió (`scrollX` 0, `scrollWidth` =
`clientWidth`, `elementFromPoint(30, 400)` = `card__body`, cajón lateral en `x = -303`) y era un artefacto
de la captura, no del layout. Se retomó con el puntero fuera de la tarjeta y dos `requestAnimationFrame`.

## H3.S3 — el panel sobrante (la grilla «Ir a lo tuyo», Q-13 resuelta por Pablo)

Números en `mediciones-s3.json`: ni `nav.mi-salud__accesos` ni `mi-salud-acceso` en el DOM, ni en los
`consts` de la definición del componente en ejecución (no es un HMR viejo); 2 enlaces a turnos y 3 a la
historia siguen; el último bloque de «Mi salud» pasa a ser «Tu próxima cita». Sin desborde en ningún ancho.

| # | Archivo | Viewport · tema | Qué se miró y qué se vio |
|---|---|---|---|
| 04 | `04-375-claro-sin-grilla.png` | 375×812 · claro | Del final del chequeo («Dictar», «no es un diagnóstico») se pasa directo a «Tu próxima cita», «Tu última receta» y «Tu última atención». Debajo no hay nada más: la grilla no está. |
| 05 | `05-375-oscuro-sin-grilla.png` | 375×812 · oscuro | Lo mismo en oscuro. |
| 06 | `06-768-claro-sin-grilla.png` | 768×1024 · claro | Pastillas en 4 columnas, panel de texto, «Tu próxima cita» a lo ancho y las dos referencias (receta, atención) lado a lado. Sin grilla. |
| 07 | `07-768-oscuro-sin-grilla.png` | 768×1024 · oscuro | Lo mismo en oscuro. |
| 08 | `08-1440-claro-sin-grilla.png` | 1440×900 · claro | Figura a la izquierda, pastillas a la derecha, panel de texto, «Tu próxima cita» y las dos referencias. El menú lateral sigue ofreciendo Directorios, Chats, Mis citas, Mi historia clínica…: los destinos que la grilla duplicaba no se perdieron. |
| 09 | `09-1440-oscuro-sin-grilla.png` | 1440×900 · oscuro | Lo mismo en oscuro. |
| 10 | `10-375-claro-pagina-completa-sin-grilla.png` | 375 · página completa (2194 px) | La pantalla de inicio entera: saludo → «¿Cómo te sentís?» con la figura, las pastillas y el panel de texto → «Tu próxima cita» → última receta → última atención. Cuatro bloques eran cinco; el quinto (la grilla) es el que el doctor pidió sacar. |

Las tomas 04, 08 y 10 se hicieron dos veces: la primera salió a mitad de la transición del cajón lateral
tras el cambio de viewport (el `nav` se desliza con `transform` y la foto lo agarraba a medio camino). Se
repitieron esperando por condición —dos lecturas consecutivas iguales de `getBoundingClientRect()` del
cajón y del `main`, cada 150 ms— y quedaron limpias (`navX` −303 a 375 px, `mainX` 240 a 1440 px).
