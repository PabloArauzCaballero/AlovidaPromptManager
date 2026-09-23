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

Verificado en Chromium (`evidencia/h3/dictado/`):

1. El botón «Dictar» es un `<button app-button>` real —no un `<div>` con `role="button"`—, así que
   hereda la activación por teclado nativa del elemento `<button>` (`Enter` y `Espacio` lo activan
   por especificación del navegador, sin código propio que lo replique).
2. Se ejercitó el ciclo completo con clic (permiso → «Escuchando…» → transcripción → «Dictar» de
   vuelta) y se observó `aria-pressed` cambiar de `"false"` a `"true"` y de vuelta.
3. **No cubierto**: no se grabó explícitamente una secuencia `Tab` hasta el botón + `Enter`/`Espacio`
   para activarlo (se usó `.click()` programático en las pruebas automatizadas). La activación por
   teclado se apoya en la semántica nativa de `<button>`, verificada indirectamente por el spec
   `dialog.spec.ts`/`body-map.spec.ts` sobre botones equivalentes del mismo átomo `app-button`, pero
   no se ejercitó en vivo sobre «Dictar» específicamente.

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
| Dictado | No cubierto (botón nativo, no ejercitado en vivo) | No cubierto en vivo (sí por semántica HTML) | N/A | Parcial |
| Confirmación D-08 | N/A | N/A | Verificado (2 navegadores) | Completo |
