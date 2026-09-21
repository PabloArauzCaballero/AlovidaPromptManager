# H6.S3.M1 — Prueba visual: 3 viewports × 2 temas

**36 capturas** en `evidencia/h6/capturas/`, tomadas por
`evidencia/h6/visual.mjs` con `medica@alovida.mock` (cuenta sintética
declarada). Viewports: móvil 390×844, tablet 820×1180, escritorio 1440×900.
Temas: claro y oscuro. **Consola limpia en los seis pares** (descontando los dos
errores de CSP que ya estaban en el baseline, ver `evidencia/antes/`).

> «Tomarla y no mirarla no cuenta» (regla 95.7.2). Cada fila dice **qué se vio**,
> y las tres últimas secciones son defectos que encontró esta pasada —no los
> tests, no el typecheck— y que se arreglaron antes de cerrarla.

## Qué se miró en cada captura

| Captura (× 6 combinaciones) | Qué se vio |
|---|---|
| `01-dia-*` | Dos solapas: «Consultas» y «Mis horarios». El encabezado de la página **sin** los tres botones. La barra del día con «Avisar demora», «Ingreso Mostrador», «Mover horario» y «Agregar», los cuatro **con texto**. Al pie, «Agregar un horario al final» y «Bloquear este día». En oscuro los sellos de estado mantienen su contraste y los tonos de cada tarjeta siguen distinguiéndose. |
| `02-acciones-*` | El desplegable abierto sobre una fila: cada opción con **su ícono a escala y su texto** («Ver detalle de la cita», «Iniciar la consulta», «Avisar una demora», «Mover a otro horario», «Cancelar la cita» en tinta de error). La fila sigue en **un renglón**, que es la tensión que el pedido resuelve. |
| `03-semana-*` | La semana con el globo de una cita abierto, con los mismos cinco campos que el detalle del día. En escritorio y tablet flota sobre la columna; en móvil se despliega en el flujo (ver defecto 3). |
| `04-mes-*` | La tarjeta del día con sus chips: «Atendida», «No asistió», «En curso» — en castellano, con color **y** palabra. |
| `05-modal-*` | El alta sobre un cupo: fondo atenuado, «Franja 08:30–09:00 · La pone el cupo del horario publicado» como dato, **sin campos de hora**, y «Guardar» en el pie. |
| `06-servicio-horario-*` | «Programar horario · Consulta cardiológica» con la grilla del horario **reciclada** dentro del modal, el día como alternancia, las dos horas, y el aviso «va a aparecer como «Otros servicios · Consulta cardiológica»». |

## Los tres defectos que encontró esta pasada

Ninguno lo vio el `typecheck`, ni el `lint`, ni las 471 pruebas. Los tres están
arreglados y vueltos a capturar.

### 1. El desplegable de acciones no recibía clics — en TODOS los viewports

`day-view.css` ponía `pointer-events: none` en `.dia__cuerpo` y lo reactivaba
con `.dia__cuerpo :is(button, a, [role='button'])`. **Ese selector nunca alcanzó
a las acciones**: son contenido proyectado desde `/schedule`, y con
encapsulación emulada los nodos proyectados llevan el atributo del componente
que los escribió, no el de `DayView`. Resultado: la capa de «atender» quedaba
por encima y el desplegable de C-06 no se podía abrir.

Arreglado apuntando a `.dia__acciones`, que **sí** es un elemento de esta vista
—el `<div>` que recibe la proyección—, y de ahí `pointer-events` se hereda.
Medido con `elementFromPoint` antes y después: `BUTTON.dia__ir-a-atender` →
`BUTTON.btn btn--ghost btn--sm`, en móvil y en escritorio.

### 2. Los íconos del desplegable salían a tamaño natural

`menu-item.css` dimensiona con `:host ::ng-deep [slot='icon'] svg`: espera un
**elemento con el slot que contiene el svg**. Se había puesto `slot="icon"`
encima del propio `<svg>`, así que la regla no casaba y el ícono se dibujaba a
su tamaño natural —un ojo de 120 px— dejando el texto en una columna de una
letra y fuera de la pantalla. Los 12 íconos pasaron a ir envueltos en
`<span slot="icon">`.

### 3. El globo de la semana se cortaba en el teléfono

Flotando sobre una columna de ~170 px, el `min-width: 14rem` del globo se salía
de la pantalla: «Germán Agu Vargas Uliba», «Seguimient». Abajo de 640 px el
globo deja de flotar y **se despliega en el flujo**, empujando la tarjeta: se
lee entero, y es la forma en que un desplegable se comporta en un teléfono.

## Lo que esta pasada NO cubrió

- **Estados de carga, vacío y error** de las pantallas tocadas: las capturas son
  todas del estado «con datos». El backend simulado responde siempre, y
  forzarle un fallo exige tocar `core/mock/**`, que es de Ender.
- **Contraste medido**: se miró que el estado se lea en escala de grises
  (`evidencia/h4/capturas/06-*` y `evidencia/h5/capturas/03-*`), no se corrió un
  medidor de contraste sobre los tokens nuevos. No hay tokens nuevos: todos los
  colores usados salen del sistema.
- **Lector de pantalla real**: se verificó el árbol de accesibilidad
  (`role`, `aria-checked`, `aria-haspopup`, `aria-expanded`, nombre accesible
  del modal y de las tarjetas) y el recorrido de teclado, no una corrida con
  NVDA o VoiceOver.
