# H6.S2.M2 — El alta tocada, completada sin mouse

**Veredicto: PASS.** El primer paso de `register-laboratory` se completa entero con el teclado:
`Paso 1 de 10` → `Paso 2 de 10`, escribiendo, eligiendo en el desplegable con flechas y avanzando
con Enter. Ningún clic.

Se eligió esa alta porque es la que más tocó el carril: `H3.S1.M7` unificó ahí la familia de
adjuntos y borró el código muerto, y su `.ts` adoptó la política de contraseña compartida.

Salida literal en [`teclado.txt`](./teclado.txt).

## 1 · El orden de tabulación y el foco

```text
    1 · button[button] «Claro»                          · foco visible=true (solid 4px)
    2 · button[button] «Oscuro»                         · foco visible=true (solid 4px)
    3 · button[button] «Sistema»                        · foco visible=true (solid 4px)
    4 · input[text]    «Nombre o razón social *(obligatorio)»
    5 · select         «Tipo de sociedad *(obligatorio)»
    6 · input[text]    «Número de NIT *(obligatorio)»
    7 · button[submit] «Siguiente»                      · foco visible=true (solid 4px)
```

**Siete paradas, en el mismo orden en que se ven, y ninguna sin nombre accesible.** No hay trampa
de foco: al llegar al botón de avance el recorrido termina. Cada obligatorio dice «\*(obligatorio)»
dentro de su nombre accesible, así que el asterisco rojo no es la única señal.

## 2 · El anillo de foco de los campos — y el instrumento que lo negó cuatro veces

Las tres primeras mediciones dijeron `foco visible=false` en los campos, y **estaban mal**. El
anillo aparece, medido esperando **por condición**:

```text
$ node tmp/sonda-foco-esperar.mjs
campo enfocado: «Nombre o razón social *(obligatorio)»
¿apareció el anillo esperando por condición? true
   clases del envoltorio: input-wrapper is-focused
   box-shadow: rgba(79, 179, 169, 0.45) 0px 0px 0px 4px
   borde: rgb(11, 85, 126)
```

Anillo aguamarina de 4 px más el borde en petróleo. Se ve en
`capturas/teclado-1-foco-en-el-campo.png`, con los otros dos campos en gris al lado.

> **Por qué fallaron las mediciones anteriores, que es lo que hay que aprender.**
> El campo lleva `outline: none` (`shared/components/atoms/input/input.css:39`) y el anillo cuelga
> de **una clase**, no de `:focus-within`: `.input-wrapper.is-focused` (`input.css:149-152`). Esa
> clase la pone el componente al recibir el evento, o sea **un tick después** del `Tab`. Las sondas
> leían el estilo en el mismo tick y veían el estado anterior.
>
> Y hubo un momento peor que el error: una captura **sí** mostraba el anillo, y cinco lecturas
> posteriores decían que no. Estuve a punto de declarar la captura un artefacto y publicar un
> incumplimiento de WCAG AA que no existe. Lo que lo evitó fue no aceptar la contradicción: buscar
> la regla en el CSS explicó las dos cosas a la vez —por qué el anillo existe y por qué el
> instrumento no lo veía—. **La captura era la única medición correcta.**
>
> Es la tercera vez en este hito que el instrumento es el problema y no el producto: la red que no
> podía ver la subida de la foto, el lector de color que tomaba `color(srgb 1 1 1)` como negro, y
> esta. Las tres compartían la misma forma: **medir en el lugar equivocado y creerle al número.**
>
> El rastro de la corrección queda en las capturas, no se borra: `foco-a-sin-foco.png` y
> `foco-b-con-foco.png` son el mismo recorte leído demasiado pronto —idénticos, de ahí la
> conclusión falsa—; `foco-c-repeticion.png` es el intento de reproducir el anillo que también
> midió temprano; y `foco-d-esperado.png` es la misma escena esperando por condición.

## 3 · Validar sin mouse: qué hace bien y qué le falta

Con el foco en «Siguiente» y los tres obligatorios vacíos, un Enter:

```text
campos inválidos (3): ["Nombre o razón social *(obligatorio)","Tipo de sociedad *(obligatorio)","Número de NIT *(obligatorio)"]
¿el foco se movió a un campo con error, esperando por condición? false
   el foco quedó en: «Siguiente» · ¿es un campo con error? false
   el primer campo apunta a: Escribí el nombre o la razón social de la empresa.
   ¿hay un resumen con role=alert? true
   ¿avanzó de paso? false
```

`capturas/teclado-2-error-sin-mouse.png`, **abierta**:

| Lo que se pidió | Lo que se vio |
|---|---|
| El error se muestra **en su campo** | ✅ Los tres campos con borde rojo y su mensaje justo debajo |
| No depende **sólo del color** | ✅ Cada mensaje lleva su icono ⓘ además del rojo |
| El mensaje está **atado** al campo | ✅ `aria-describedby` del campo resuelve a su texto |
| Hay algo que el lector **anuncia** | ✅ existe un resumen con `role="alert"` |
| El formulario **no avanza** | ✅ sigue en `Paso 1 de 10` |
| El foco **va al primer error** | ❌ se queda en «Siguiente» |

**El último renglón es la deuda declarada en `H3.S2.M4`, y sigue abierta.** Ahora está medida
esperando por condición durante 3 s, no deducida de una lectura instantánea: no es que el foco
llegue tarde, es que no se mueve.

> `H3.S2.M3` —el error **del servidor** anclado a su campo— es otra cosa y **no** queda cerrada
> acá: lo que se ejercitó es la validación del cliente. Sigue `A MEDIAS` con su contrato simulado.

## 4 · Completar el paso, sólo con teclado

```text
3 · completar el paso sin mouse
   tras Tab el foco está en: select[select-one] «Tipo de sociedad *(obligatorio)»
   elegido con flechas: {"valor":"0","texto":"Unipersonal"}
   «Paso 1 de 10» → «Paso 2 de 10» · url cambió=false
```

Escribir el nombre · `Tab` · `ArrowDown` + `Enter` para elegir la sociedad · escribir el NIT ·
`Enter` en «Siguiente». **El paso avanza.** La URL no cambia porque el avance es dentro del mismo
componente paginado, que es como estaba antes del carril.

Consola durante todo el recorrido: **una** entrada única, la violación de CSP preexistente del
baseline. Ninguna respuesta ≥ 400.

## 5 · Un hallazgo menor, ajeno

Con el foco en «Siguiente», su globo de ayuda **se dibuja encima del campo «Número de NIT»** y tapa
su lado derecho (visible en `teclado-2-error-sin-mouse.png`). El globo es del botón compartido, que
este carril no tocó. **Anotado, no tocado.**

## 6 · No cubierto

- **Los diez pasos del alta.** Se ejercitó el primero, que es donde vive la validación que el
  carril movió de sitio. Los pasos 2 a 10 no se recorrieron por teclado.
- **Lector de pantalla real.** Se midió lo que el lector usaría —nombre accesible, `aria-invalid`,
  `aria-describedby`, `role="alert"`—, no el recorrido escuchado.
- **Las otras cuatro altas por teclado.** Comparten el mismo organismo paginado y los mismos
  átomos de campo; el barrido de rutas y la matriz de capturas cubren que se dibujen igual, no que
  se recorran igual.
- **El perfil por teclado.** Su superficie interactiva es otra (pestañas, subida de foto) y no
  entró en esta microtarea.
