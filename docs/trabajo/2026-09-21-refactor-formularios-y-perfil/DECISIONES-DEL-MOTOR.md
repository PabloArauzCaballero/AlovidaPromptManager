# Decisiones sobre el motor de formularios paginados

Las dos decisiones que el encargo pide **tomar**, no implementar: el tipado de `FormGroup` y las
banderas booleanas del organismo. Cada una con su superficie medida, su plan de compatibilidad y
la alternativa que se descarta.

- Pieza: `shared/components/organisms/paginated-form/` (selector `app-paginated-form`)
- Corte de todas las mediciones: `origin/mockup` en `d76e3054`
- Salidas literales: [`evidencia/h5/banderas-medidas.txt`](./evidencia/h5/banderas-medidas.txt) y
  [`evidencia/h5/consumidores-y-forma.txt`](./evidencia/h5/consumidores-y-forma.txt)

> **Corrección de dos cifras del encargo.** El encargo habla de «52 consumidores» y «seis banderas
> booleanas». Medido: los consumidores son **53** y las banderas booleanas son **cinco**. La sexta
> que el encargo cuenta existe, pero no es booleana: es `cancelLabel`, una bandera disfrazada de
> string. Las dos diferencias se declaran acá y no se corrigen en silencio.

---

## D-5 · `form: FormGroup` sin tipar

**Decisión: se conserva el input sin tipar en este trabajo, con la compatibilidad declarada y la
implementación asignada a la oleada 2.** No es una postergación por falta de tiempo: es que el
cambio es incompatible y el §10 exige adaptador con consumidores identificados y condición de
retiro antes de tocarlo.

### Qué está hoy

```ts
readonly form = input.required<FormGroup>();     // paginated-form.ts:201
readonly key: string;                            // paginated-form.types.ts:112
```

`FormGroup` sin parámetro **es** `FormGroup<any>`. La consecuencia importa y se midió: los
consumidores **ya pueden** pasar grupos tipados y el motor los acepta sin queja. El catálogo lo
hace hoy (`organisms-gallery.ts:339-345`: `nonNullable: true`, `FormControl<Date | null>`).

Es decir: **tipar los formularios de las pantallas no rompe nada y ya se puede hacer**. Lo
incompatible es otra cosa — hacer **genérico el input del organismo**.

### Qué se gana

La `key` de un campo es la **única atadura** entre lo declarado y el dato; el propio tipo lo dice:
«un campo con una `key` que no existe en el grupo es un error de programación… en producción se
vería como un campo que no guarda nada — el peor fallo posible en un formulario»
(`paginated-form.types.ts:106-110`). Hoy eso se avisa **en desarrollo, en tiempo de ejecución**.
Con `PaginaDeFormulario<T>` y `key: keyof T`, el mismo error lo cazaría el compilador.

### Verificado por experimento, no razonado

> Esta decisión se escribió primero **sin correr nada**, razonando desde el conteo. Eso es
> exactamente lo que la regla 60 llama «es obvio que…», y la obviedad no es un veredicto. Así que
> se hizo el experimento: se hicieron genéricos los tres archivos del motor
> (`paginated-form.types.ts`, `paginar-campos.ts`, `paginated-form.ts`) con `key: keyof TControles`
> y un valor por defecto que preserva el comportamiento, se corrió `corepack yarn typecheck`, y se
> **revirtió** (`git checkout --`; árbol limpio y `typecheck` exit 0 después).

**Resultado: 19 errores.** No cientos — y ése es el primer dato que corrige la decisión escrita a
ojo. Se reparten así:

| Grupo | Cuántos | Qué son |
|---|---|---|
| Internos del motor | **9** | Threading incompleto del genérico por los ayudantes del propio organismo. Mecánicos, en archivos míos. |
| En consumidores | **10** | Ver abajo: **no** son typos, son un hallazgo de diseño. |

### El hallazgo que cambia la decisión: `key` significa dos cosas

Dos de los diez errores dicen esto:

```
child-organization-new.ts(202,13): Type '"administrador"' is not assignable to type '"code" | "tipo" | "legalName"'
organization-new.ts(390,13):      Type '"owner"' is not assignable to type '"code" | "timeZone" | "tradeName" | "tipo" | "legalName"'
```

A primera vista parecen el bug que el tipado promete cazar: un campo que no guarda nada. **No lo
son.** Los dos son `control: 'custom'` —campos **proyectados**— y su valor vive fuera del
formulario a propósito: `administrador` es un `signal<ReferenceOption | null>`
(`child-organization-new.ts:222`) que se lee directo al armar el envío (línea 389). Su `key` no
nombra un control: nombra una **ranura de proyección**.

Y no es uniforme, que es lo que lo vuelve una decisión y no una corrección. En
`register-patient.ts:1380-1400`, `campoDepartamentoEmisor` usa **la misma `key` para `custom` y
para `select`**: el campo cambia de proyectado a dibujado por el motor según si el catálogo de
departamentos está caído, y la clave se mantiene **precisamente porque sí es un control** — «la
clave es la misma en los dos casos… así que lo que se haya elegido antes de un fallo no se
pierde» (línea 1377).

**Escala del asunto: 55 campos `custom` en 12 de los 53 consumidores.**

Conclusión: `key: keyof T` **plano es incorrecto**, y el experimento es lo que lo demostró. El
contrato necesita una **unión discriminada**: un campo con control declara `key: keyof T`, y un
campo proyectado declara una ranura que puede o no serlo. Decidir cuál de las dos es cada uno de
esos 55 campos es una decisión sobre pantallas de `features/admin/**`, `features/geo/**` y
`features/delegated-access/**` — todas declaradas fuera de alcance.

**Eso, y no el conteo de consumidores, es lo que manda esto a la oleada 2.** Ahora con evidencia.

### A quién rompe — medido, no estimado

| Forma de armar el grupo | Consumidores | Consecuencia al tipar el input |
|---|---|---|
| **Estática** (literal de objeto: el tipo lo infiere TypeScript) | **52** | Ninguna: su grupo ya tiene tipo y es asignable |
| **Dinámica** (`addControl` / `removeControl` / `setControl` / `FormRecord`) | **1** | No puede tener un tipo estático: su forma se decide en ejecución |

El único dinámico es **`features/form-builder/form-builder.ts`** — y no es casual: su oficio *es*
construir formularios en tiempo de ejecución. Un constructor de formularios no puede declarar en
compilación la forma del formulario que va a construir. Además, `features/form-builder/**` está
declarado fuera del alcance de este trabajo.

Así que el reparto real no es «52 consumidores a migrar»: es **52 que ya cumplen y 1 que nunca va a
poder**, y el diseño tiene que dejarle una puerta.

### El adaptador temporal y su condición de retiro

En este orden, porque el paso 1 es el que el experimento dejó sin resolver:

1. **Primero, la unión discriminada de `CampoDeFormulario`.** Un campo con control declara
   `key: keyof T`; un campo proyectado declara su ranura. Sin esto, los 55 campos `custom` no
   compilan, y el experimento lo midió. Exige repasar esos 55 uno por uno y decir de cada uno si su
   `key` nombra un control o una ranura — el caso de `register-patient` demuestra que las dos
   respuestas existen en el repo.
2. El input se hace genérico con un valor por defecto que preserva el comportamiento actual:
   `form = input.required<FormGroup<TForma>>()` con `TForma` cayendo en el tipo abierto cuando no se
   especifica. Los 52 estáticos compilan sin tocar una línea.
3. Se termina de pasar el genérico por los ayudantes internos del organismo: son los **9** errores
   del experimento en archivos propios, todos mecánicos.
4. Para el caso dinámico se expone **una** vía explícita —un tipo `FormularioDinamico` o el
   `FormRecord` del propio Angular— y `form-builder` la declara. Es una declaración de intención,
   no un escape genérico: quien la usa dice que su forma se decide en ejecución.
5. **Condición de retiro del adaptador:** cuando `form-builder` sea el único que lo declara y eso
   esté verificado con la misma medición de esta tabla, el tipo abierto por defecto se elimina y
   el genérico pasa a ser obligatorio. La medición que lo comprueba es la que produjo este archivo,
   y se vuelve a correr entonces.

**Costo real, ya no estimado:** 9 errores mecánicos propios + una revisión de 55 campos repartidos
en 12 pantallas ajenas. Lo caro no es el tipado: es la revisión.

### Alternativa descartada

**Tipar el input de un tirón, sin genérico ni escape** — que es lo que el encargo prohíbe
explícitamente («no lo tipes de un tirón y a ver qué pasa»).

*Por qué se descarta:* dejaría a `form-builder` sin forma de compilar, y su única salida sería un
`as any` en el borde. Eso no elimina el problema: lo esconde en el consumidor, donde nadie lo mide,
y encima en el consumidor **ajeno**. El repo tiene hoy cero `any` y esta decisión no va a ser la
que abra el primero.

**Segunda descartada: no hacer nada nunca.** Tampoco sirve. Deja permanentemente en ejecución un
error que el compilador puede cazar, en la única atadura que decide si un campo guarda o no guarda.

---

## D-6 · Las banderas del organismo, una por una

**Medición:** cuántos de los **53** consumidores le pasan cada bandera **al elemento
`<app-paginated-form>`** — no cuántos archivos contienen la palabra.

> **Por qué la distinción no es un detalle.** El comando que el encargo propone
> (`git grep -c '<bandera>' -- '**/*.html'`) cuenta archivos que mencionan el nombre, y esos
> nombres los usan también otros componentes. Medido de las dos formas: `pending` da **92** archivos
> con la palabra y **49** consumidores reales; `cancelLabel`, **16** contra **4**; y `destructive`,
> **5** contra **0**. El comando ingenuo habría dado por viva una bandera que no usa nadie.

| # | Bandera | Tipo | Consumidores reales | Quiénes | Decisión |
|---|---|---|---|---|---|
| 1 | `pending` | `boolean` | **49 / 53** | casi todos | **Conservar** |
| 2 | `iconOnlyNav` | `boolean` | **4** | los cuatro `register-*` | **Conservar** |
| 3 | `compactSteps` | `boolean` | **1** | `register-patient` | **Conservar**, vigilada |
| 4 | `cancelLabel` | `string` (bandera por vacío) | **4** | los cuatro de `admin/` | **Convertir en variante semántica** — oleada 2 |
| 5 | `interactiveSteps` | `boolean` (por defecto `true`) | **0** | nadie lo apaga | **Conservar** el comportamiento; retirar la bandera en oleada 2 |
| 6 | `destructive` | `boolean` (por defecto `false`) | **0** | nadie lo enciende | **Retirar en oleada 2**, con `confirmTitle` y `confirmMessage` |

### Una por una, con su motivo

**1 · `pending` — Conservar.** No es una bandera de pantalla: es el **estado de la operación en
curso**, y es lo que impide el doble envío que la regla 95.3.4 exige. 49 de 53 la usan. No hay
variante semántica que reemplace a un estado que cambia durante la vida de la pantalla.

**2 · `iconOnlyNav` — Conservar.** Cuatro consumidores, todos altas, todos míos. Es una decisión de
densidad visual del recorrido, no una rama de comportamiento. **No lleva nombre de pantalla**
(`H5.S2.M3`): dice qué hace la navegación, no quién la pidió.

**3 · `compactSteps` — Conservar, vigilada.** Un solo consumidor, `register-patient`, y es el
candidato más claro a «una bandera por pantalla» del §5.6. Se conserva por dos motivos medidos:
su nombre describe el **indicador de pasos**, no la pantalla, y el propio organismo lo delega a
`compact` de `app-stepper` (`paginated-form.ts:270`), que es una propiedad que ya existe aguas
abajo. *Vigilancia:* si aparece un segundo consumidor con otra necesidad de densidad, las dos se
resuelven juntas como una variante de indicador, no con dos banderas.

**4 · `cancelLabel` — Convertir en variante semántica.** Es la «sexta bandera» del encargo: no es
booleana, pero **opera como booleana** — con `''` no hay botón de cancelar, con texto sí. Eso es un
booleano y un texto metidos en un solo parámetro, y obliga a quien lee el contrato a deducir la
regla desde el valor por defecto. Sus 4 consumidores son los cuatro formularios de `admin/`, que
son altas dentro de un flujo del que se puede salir — un **caso semántico**, no una preferencia.
*Oleada 2*, porque cambiarlo toca a 4 consumidores ajenos (`features/admin/**`, declarado OUT).

**5 · `interactiveSteps` — Conservar el comportamiento, retirar la bandera.** Viene **encendida** y
**ningún** consumidor la apaga. Su valor por defecto *es* el comportamiento del producto. Una
bandera que nadie mueve no es un punto de configuración: es una rama muerta con nombre de opción.
*Oleada 2*, y sin riesgo observable: quitarla dejando el comportamiento fijo en `true` no cambia
nada en ninguna de las 53 pantallas — que es exactamente lo que la medición demuestra.

**6 · `destructive` — Retirar, con sus dos acompañantes.** Cero consumidores, y esta vez el valor
por defecto es `false`: nadie enciende la rama, así que el diálogo de confirmación
(`paginated-form.ts:617-622`) y la variante `danger` del botón (`paginated-form.html:285`) **no se
ejecutan nunca**. Se verificó que tampoco se enciende desde TypeScript: los `destructive: true` del
repo pertenecen a **otros** componentes —`DialogService.confirm`, `app-menu-item`,
`app-form-actions`—, ninguno al motor.

Es el mismo hallazgo que destapó H3: una regla escrita que ninguna plantilla invoca. Y la
confirmación destructiva **ya vive donde corresponde**, en `form-actions` y en `DialogService`, que
son quienes la usan de verdad. *Oleada 2*, arrastrando `confirmTitle` y `confirmMessage`, que sólo
existen para alimentarla.

### Las dos comprobaciones de cierre de la subtarea

- **`H5.S2.M3` — ninguna bandera lleva nombre de pantalla.** Revisado el contrato completo
  (`paginated-form.ts:198-272`): las doce entradas nombran **qué hace** el organismo —páginas,
  formulario, rótulo, envío en curso, navegación por iconos, pasos compactos—, ninguna nombra a un
  consumidor. La más cerca del olor es `compactSteps`, con un solo usuario, y ni siquiera esa dice
  «paciente»: dice «pasos compactos». **Ninguna incumple.**
- **`H5.S2.M4` — no se borró nada.** En este trabajo **no se retiró ninguna bandera**. Las dos con
  cero consumidores quedan declaradas para oleada 2, con la medición que lo sostiene pegada en
  `evidencia/h5/banderas-medidas.txt`. Las cuatro con uso vivo se conservan.

---

## Lo que estas decisiones NO cubren

- **No se implementó nada.** Las seis filas y el plan de tipado son decisiones escritas; el código
  del organismo no se tocó en este trabajo.
- **No se midió** el costo de migrar los 4 consumidores de `cancelLabel`, porque están declarados
  fuera de alcance y abrirlos era territorio ajeno.
- **No se verificó en navegador** que quitar `interactiveSteps` no cambie nada: eso es parte de la
  oleada que la retire, junto con la regresión de cinco consumidores ajenos que pide `H5.S1.M4`.
