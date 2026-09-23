# Capturas ANTES — `/dashboard` con `paciente@alovida.mock`, corte `b655e844`, Chromium (Playwright MCP)

Cada captura fue **mirada**; la línea dice qué se ve y qué artefacto de captura hay que descontar.

| Archivo | Viewport · tema | Qué se ve | Artefactos de la captura (no del producto) |
|---|---|---|---|
| `01-dashboard-1440-claro.png` | 1440×900 · claro | Los cuatro bloques: síntomas (10 pastillas en 6 columnas, área de texto plegada bajo «▼ O escribilo con tus palabras», descargo), «Tu próxima cita» (miércoles 23, 09:30–10:00, profesional, sede, motivo, «Ver o reprogramar»), tira receta/atención, grilla «Ir a lo tuyo» de 6 tarjetas en una fila | La barra lateral fija se superpone a la columna izquierda en el `fullPage`; el panel flotante «Datos de prueba / Ver componentes» tapa el inicio de la tira |
| `02-dashboard-1440-oscuro.png` | 1440×900 · oscuro (`prefers-color-scheme`) | Igual, en tema oscuro; contraste legible en pastillas y tarjetas | Ídem + un aviso simulado «Se liberó un horario» (toast del simulador) abajo a la derecha |
| `03-dashboard-768-oscuro.png` | 768×1024 · oscuro | **NO es la pantalla del paciente**: panel genérico «Tus accesos». Ver `../HALL-M1-roles-cambian-en-caliente.md`. Se conserva como evidencia del hallazgo | — |
| `04-dashboard-768-claro.png` | 768×1024 · claro (tras volver a entrar) | Pantalla del paciente: pastillas en 4 columnas (4+4+2), área plegada, próxima cita con el botón a la derecha, tira en dos tarjetas, grilla 5+1 | El toast «Se liberó un horario» tapa la tira receta/atención |
| `05-dashboard-768-oscuro.png` | 768×1024 · oscuro | Igual, tema oscuro | — |
| `06-dashboard-375-oscuro.png` | 375×812 · oscuro | Pastillas en 2 columnas (5 filas), área plegada, próxima cita apilada con el botón a ancho completo, tira en dos tarjetas apiladas, grilla en 2 columnas (3 filas). **Sin desborde lateral**: `scrollWidth 375 = clientWidth 375` | El toast «Se liberó un horario» tapa la última fila de pastillas |
| `07-dashboard-375-claro.png` | 375×812 · claro | Igual, tema claro | Ídem |
| `08-sintomas-pecho-alarma.png` | 1440 · claro (tarjeta) | Pecho abierto, «dolor de pecho» pulsado, «Te entendimos» y la alerta roja «Esto no puede esperar a un turno» | — |
| `09-sintomas-panza-recomendacion.png` | 1440 · claro (tarjeta) | Panza abierta, «náuseas o vómitos» pulsado, «Conviene que veas a» Gastroenterología y Medicina general con «Ver quién atiende» | — |
