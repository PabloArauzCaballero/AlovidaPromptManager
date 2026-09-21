# Handoff para Justin — H4: la clave de la frecuencia por defecto

> Preparado el 2026-09-21. **Pendiente de pegar en el daily** y **pendiente de tu acuerdo**: la
> microtarea H4.S1.M2 pide que la clave se acuerde por escrito entre los dos, así que esto es la
> propuesta con su forma, no un hecho consumado.

## La clave

    default_frequency

**Dónde vive:** en `properties` de la ficha del concepto, la que ya devuelve
`GET /terminology/concepts/{id}`. **El mismo camino que `dose_forms` y `strengths`** — no hay un
mecanismo nuevo, que es lo que la regla 96.1 pide evitar.

**Forma:** texto libre, legible tal cual. Ejemplo: `"Cada 8 horas"`.

**Cómo leerla:** con `textoDePropiedad(concepto.properties, 'default_frequency')`, de
`core/data-access/terminology/terminology.types.ts`. Es hermana de la `listaDeTextos` que ya
usás y tiene el mismo criterio: **devuelve `null` ante cualquier forma inesperada** —un número,
una lista, un objeto, un texto vacío— en vez de lanzar. Un medicamento sin la propiedad y uno
con la propiedad rota se comportan igual: la receta cae a su campo de texto, como hoy.

## No es una extensión del doble: el contrato real ya lo admite

Lo verifiqué sobre `origin/dev` de la API (`c2c071a4`) en vez de asumirlo.
`ConceptPropertyInputDto` (`create-designation.dto.ts:20-35`) declara:

- `propertyCode`: texto libre, `@IsString()` `@IsNotEmpty()` `@MaxLength(255)`.
- `valueJson`: **«Valor de la propiedad (JSON arbitrario)»**, tipado `unknown`.

Y `UpsertConceptPropertiesDto` (`concept-properties.dto.ts:17-29`) hace `UPSERT` por código:
reenviar la misma propiedad actualiza su valor, no duplica.

O sea: **`default_frequency` cabe en el contrato real tal cual, sin cambiarlo**. Lo único que no
existe todavía es el **dato**, que es decisión de negocio. Esto es mejor de lo que esperaba
cuando escribí el plan —ahí lo daba por posible extensión del doble— y lo corrijo acá con la
cita, porque cambia lo que te toca a vos: no vas a tener que migrar nada cuando el backend real
publique la propiedad.

## Qué medicamentos la traen, y cuáles no

| Con `default_frequency` | Sin ella, **a propósito** |
|---|---|
| `paracetamol` · `amoxicilina` · `losartan` | `metformina` · `salbutamol` · `warfarina` |

Los de la derecha no son un olvido. `metformina` y `salbutamol` están para que se vea que la
receta funciona igual sin la propiedad. **`warfarina` es deliberado y no lo voy a cambiar**: es
un anticoagulante de margen terapéutico estrecho, y prellenar una frecuencia inventada para un
fármaco así es exactamente el riesgo que cerró B-13.

## Lo que tenés que saber antes de mostrarla en pantalla

**Estos valores son sintéticos.** Cada ficha que trae `default_frequency` trae al lado
`default_frequency_provenance`:

> `Dato sintético de desarrollo · fuente MANTRA_DEV_VADEMECUM · sin fuente autoritativa ·
> NO APTO PARA USO CLÍNICO · la fuente real la debe proveer negocio (Q-D6)`

No hay ninguna referencia real detrás: no se cita RxNorm, SNOMED CT, WHO ATC ni vademécum
alguno. Es el precedente **B-13** aplicado antes de que el problema exista — ahí hubo 17
medicamentos con contenido clínico escrito a mano **citando fuentes que no eran su fuente**, y
costó retractar el dataset entero.

**Sugerencia, no imposición:** si la receta va a prellenar la frecuencia, que se vea que es
sugerencia y sea editable. Lo que no se puede es presentarla como catálogo oficial.

## Lo que falta, y no lo decidimos nosotros

La posología real de cada medicamento es **decisión de negocio**, no de este equipo (`Q-D6`).
Hasta que negocio provea la fuente autoritativa con nombre, referencia y fecha, esto queda como
dato de desarrollo y **no puede salir de la maqueta**.

**¿Te sirve la clave y la forma?** Si preferís otra —`default_dosage_frequency`, o un objeto con
`{ value, unit }`— decilo ahora y lo cambio antes de que haya consumidores. Lo que no voy a
hacer es publicarla por dos caminos distintos.

## Respuesta que necesito, y es cerrable

Contestá con **una** de estas tres, en tu daily o en este mismo documento:

| Respuesta | Qué significa |
|---|---|
| `ACCEPT` | La clave `default_frequency`, su forma de texto y la lectura con `textoDePropiedad()` te sirven tal cual. Sigo con esto y no lo vuelvo a mover. |
| `CHANGE_REQUESTED` | Querés otro nombre o otra forma —por ejemplo `{ value, unit }`—. **Decí cuál**: lo cambio antes de que haya consumidores, que es ahora o nunca. |
| `REJECT` | No querés esta propiedad. Decime por dónde preferís que viaje y lo reviso contra el contrato real. |

**No doy por aceptado el silencio.** Hasta que respondas, H4 queda `A MEDIAS` en mi daily: el
mecanismo está implementado y probado, pero el acuerdo que la microtarea H4.S1.M2 pide es de los
dos, y no lo firmo por vos.
