# H3.S2.M3 y M4 — La deuda medida, y el contrato que habría que simular

Las dos microtareas quedan `A MEDIAS`. Este archivo existe para que quien las retome no tenga que
repetir la investigación: dice qué hay puesto, qué falta, y **cuál es el contrato** que la regla 65
obliga a simular en vez de declarar un bloqueo.

Ninguna de las dos es una regresión de este trabajo: las dos se midieron **en el baseline**, antes
de tocar una línea (`evidencia/antes/recorrido-profesional.md`).

## M3 — El error del servidor anclado a su campo

### Lo que ya está puesto

El borde HTTP **ya hace la mitad del trabajo**. `core/http/error-to-view-state.ts:199` deduce el
campo desde el mensaje del backend —la convención `"email must be an email"`— y lo publica como
`ViewStateIssue.field`. El reconocimiento es conservador a propósito: si no reconoce el campo, el
mensaje se muestra igual, sin anclar.

### Dónde se pierde

| Eslabón | Qué hace | Ruta |
|---|---|---|
| El alta recibe el error | `errorToViewState(error)` → `state` | `register-patient.ts:2362`, `register-practitioner.ts:2342` |
| El alta lo convierte en texto | toma **sólo** `issues[0].message` y **descarta `field`** | `register-patient.ts:2097`, `register-practitioner.ts:2024` |
| La plantilla lo pinta | una alerta genérica arriba del formulario | `register-patient.html:42` |
| El motor dibuja errores de campo | `[errorMessage]="errorDe(campo)"`, y `errorDe` sale de `mensajeDeError`, que sólo entiende claves de validador conocidas | `paginated-form.html:51,69` · `paginated-form.ts:493` |

Es decir: el dato existe y se tira. Y aunque no se tirara, **el organismo no tiene por dónde
recibirlo**: no hay input para errores externos por campo, y `setErrors` sobre el control no sirve
—una clave desconocida cae en el genérico «Revisá `<campo>`.» (`mensaje-de-error.ts:94`), no en el
texto del servidor.

### Observado

`evidencia/h3/capturas/pro-13-tras-error-de-guardado.png`: el fallo se muestra como una alerta
arriba del formulario («Simulado: fallo del servidor. (mock-fallo)»), sin marcar ningún campo. La
pantalla se queda en el paso 13 y la contraseña sigue escrita.

### El contrato a simular — regla 65

El simulador de fallos en modo `error` devuelve **sólo** `code: 'INTERNAL'` y un mensaje genérico
(`core/mock/fallos-simulados.ts:105-126`): nunca emite violaciones por campo. Y `core/mock/**` está
declarado OUT en el encargo.

Eso **no es un bloqueo válido**: el contrato tiene nombre y se puede simular. Es
`ApiErrorBody.details.violations` — el arreglo de strings que produce el `ValidationPipe` del
backend real, documentado con su ejemplo en `error-to-view-state.ts:150-158`. Los tres niveles que
habría que ejercitar, inyectando el error en el borde del servicio sin tocar `core/mock/**`:

| Nivel | Cuerpo a inyectar | Qué debe verse |
|---|---|---|
| **Correcto** | `details.violations: ["email must be an email"]` | El mensaje aparece **en el campo del correo**, no arriba |
| **Límite** | dos violaciones, una de un campo que no está en la página visible | Las dos se muestran; la de otra página no se pierde en silencio |
| **Inválido** | `details.violations: ["each value must be a string"]` — no empieza con un campo | `fieldOf` **no inventa** un campo y el mensaje cae al genérico de arriba, como hoy |

El tercer nivel es el que importa: es el modo de fallo benigno que el diseño de `fieldOf` promete,
y es lo que impide que un mensaje suelto ancle a un campo equivocado.

### ⚠️ Hay una implementación de referencia, y está en terreno propio

Descubierto al verificar el corte, **después** de haber declarado esta microtarea `A MEDIAS`:
`origin/mockup` tiene el commit `d40b5631` — *«fix(mi-perfil): el rechazo del servidor, junto a su
campo — y sin mensajes viejos pintados»* — que resuelve **este mismo problema** en
`account/my-profile/practitioner-profile-edit/`, que es una de las seis carpetas reservadas de este
carril.

Su propio mensaje describe la técnica y desarma el bloqueo que este archivo daba por firme:

> «El rechazo tiene la forma que la API manda ante un DTO inválido (400 `VALIDATION_FAILED` con
> `details.violations`, mensajes literales de `@MaxLength(100)`). **La maqueta no emite
> `violations`, así que se entrega en el borde del servicio de datos, sobre el error real que
> devuelve el simulador**; del borde para adentro es el camino de siempre.»

Es decir: **no hace falta tocar `core/mock/**` para producir el error por campo.** Se inyecta en el
borde del servicio de datos, sobre el error real del simulador, y de ahí para adentro el camino es
el de producción. Ese commit trae además su evidencia visual en tres anchos y dos temas, y dos
pruebas nuevas en `practitioner-profile-edit.spec.ts`.

**Qué significa para quien retome esta microtarea:** el trabajo no es inventar el mecanismo, es
**llevar al motor de formularios un patrón que ya funciona en el editor del perfil**. Lo que sigue
faltando es lo específico del motor —un input aditivo para errores por campo que hoy no existe— y
la simulación de los tres niveles de arriba.

## M4 — Foco al primer error

### Lo que ya está puesto

Más de lo que parecía. Al intentar enviar, `enviar()` marca todo como tocado y **salta a la primera
página que tiene error** (`paginated-form.ts:598-613`); un effect sobre el índice de página lleva
el foco **al título de esa página** (`paginated-form.ts:453-466`).

### Lo que falta

El último tramo: el foco no llega al **primer control inválido**. Medido en el baseline: tras
«Siguiente» con campos vacíos el foco queda en el propio botón «Siguiente», en las **7 páginas con
obligatorios** del alta de profesional (`evidencia/antes/recorrido-profesional.md:37`).

La segunda mitad del CA —«todo campo tiene etiqueta accesible»— no se verificó por separado y se
declara **no cubierta**.

### Por qué no se hizo acá

Cambiar a dónde va el foco es un **cambio de comportamiento observable en los 53 consumidores** del
organismo, y H3 se cerró con la promesa contraria: que el comportamiento no cambió. Hacerlo exige
la regresión de cinco consumidores ajenos que el propio encargo pide en `H5.S1.M4`, y por tanto
pertenece a esa oleada, no a la extracción de la regla.

## Hallazgo vecino, no tocado

`evidencia/antes/recorrido-profesional.md:49` (A-1): en la primera página del alta de profesional
el error «Ingresá tu nombre.» se dibuja **debajo de «Tercer nombre»**, no del «Primer nombre». El
primer nombre es un campo proyectado (`register-practitioner.html:67-78`) bajo la clave `name`, y
el motor pone el mensaje al pie del bloque. Queda **anotado, no arreglado**: es del mismo terreno
que M3 y se resuelve junto con él.
