# H6.S1.M2 — teclado completo, paso a paso

## 1. La silueta del cuerpo (P-01)

Verificado en vivo en Chromium (`evidencia/h2/capturas/mediciones.json`), sobre `/dashboard` como
`paciente@alovida.mock`:

1. `Tab` desde el título de la tarjeta llega a **cabeza** (primera zona con forma).
2. `Tab` sucesivos recorren **ojos → orl → pecho → panza → huesos → íntima**, en ese orden —de
   arriba abajo, el orden declarado en `SILUETAS_DEL_CUERPO`—; después de la última zona el foco
   pasa a la primera pastilla («Cabeza y mareos»). `Shift+Tab` vuelve en el sentido contrario.
3. `Enter` sobre una zona con foco la elige: se ve el trazo grueso, el relleno cambia y la línea
   dice «Zona elegida: <nombre>».
4. `Espacio` hace lo mismo que `Enter` (probado sobre «Oído, nariz y garganta»), **y no desplaza la
   página** (`event.defaultPrevented === true`, `scrollY` sin cambios antes/después).
5. Repetir `Espacio` sobre la misma zona la suelta (vuelve a «Tocá una parte del cuerpo.»).
6. El foco visible es un trazo de 6 px sobre la forma (no un rectángulo de `outline` del
   navegador), verificado con `getComputedStyle(document.activeElement).strokeWidth`.

## 2. El dictado (P-02)

Verificado en Chromium, en vivo, el 23/09 (`evidencia/h6/teclado-dictar.json`):

1. El botón «Dictar» es un `<button app-button>` real —no un `<div>` con `role="button"`—, así que
   hereda la activación por teclado nativa del elemento `<button>`.
2. `Tab` desde el principio de la página lo alcanza en 25 pasos (`focoTrasTabs ===
   "sintomas-dictar"`), sin saltarlo ni quedar atrapado antes.
3. `Enter` con el foco puesto lo activa: `aria-pressed` pasa de `"false"` a `"true"`, el texto del
   botón pasa a «Detener» y el estado dice «Escuchando… decí qué te pasa.».
4. `Espacio` alterna igual que `Enter` y que el clic: lo apagó una vez y lo volvió a encender otra,
   en las dos observado por el cambio de `aria-pressed`.
5. Se detuvo con `Espacio` al cerrar la prueba, se vació el área de texto (`limpio: true`) y se
   cerró la página — el micrófono no quedó abierto.

**Ya no queda nada sin cubrir en este punto**: el ciclo completo (permiso → «Escuchando…» →
transcripción) ya estaba verificado por clic en `evidencia/h3/dictado/`; esta prueba agrega la
activación por teclado, que faltaba.

## 3. La confirmación de guardado (D-08, H4)

Verificado en Chromium y Firefox (`evidencia/h4/apilamiento/`), sobre un `content-dialog` abierto
con `dialogs.confirmarCambios()` disparado encima:

1. Al abrirse, el foco entra **atrapado dentro** del `confirm`: cuatro `Tab` seguidos nunca llegan
   al `content-dialog` de abajo (criterio del script: el foco jamás sale del segundo `<dialog>`).
2. El botón «Confirmar» tiene el foco inicial (no destructivo → sin `autofocus` en «Cancelar»).
3. `Escape` cierra el `confirm` con `false`, y el foco **vuelve** al elemento que lo abrió (el botón
   «Guardar» de la vitrina de prueba), verificado leyendo `document.activeElement` antes y después.
4. Mismo resultado en Firefox 153: apilado visible, foco atrapado, `Escape` → `false`, foco de
   vuelta.

## Resumen

| Flujo | Tab en orden | Activación con teclado | Foco atrapado/devuelto | Estado |
|---|---|---|---|---|
| Silueta | Verificado (6 zonas) | Verificado (Enter y Espacio, sin scroll) | N/A (no es un diálogo) | Completo |
| Dictado | Verificado (25 Tab desde el inicio de la página) | Verificado (Enter y Espacio alternan igual que el clic) | N/A | Completo |
| Confirmación D-08 | N/A | N/A | Verificado (2 navegadores) | Completo |
