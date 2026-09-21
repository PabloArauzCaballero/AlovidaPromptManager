# Inventario de especialidades — H1.S3.M1 y H1.S3.M2

Medido sobre el corte `68dcb562`. Es la línea de base de H3: hasta que esté acá, «una sola
insignia en todo el proyecto» no tiene contra qué compararse.

## 1. Qué se midió, y por qué no es el número que devuelve el grep

```text
$ git grep -n -i "especialidad\|specialty" -- 'src/app/**/*.html' | wc -l
330        # en 43 plantillas
```

**330 no es la respuesta.** Una mención puede ser tres cosas distintas y sólo una le importa a
la insignia:

| Qué es | Ejemplo | ¿Entra al inventario? |
|---|---|---|
| Rótulo de un campo | `<label>Especialidad</label>` | No: es texto de formulario |
| Nombre de un control | `data-testid="especialidad-select"` | No: es el control, no el dato |
| **El dato, dibujado** | `<app-chip>{{ especialidad.nombre }}</app-chip>` | **Sí** |

Clasificando por eso quedan **25 renderizados en 7 plantillas**. El instrumento toma cada
mención, descarta las que no dibujan, y para las que sí resuelve el elemento contenedor
abriendo y cerrando etiquetas hacia arriba. Tiene un segundo camino porque el patrón más común
**no nombra la especialidad en la línea que la pinta**: el `@for` la nombra y tres líneas abajo
dice `{{ e.nombre }}`.

## 2. Las formas, ordenadas por lo que le cuestan a H3

### 2.1 El defecto central: dos reglas de tono, y la que se aplica depende de quién mira

El primer borrador de este inventario decía «dos chips en la misma pantalla». **Es falso, y
mirarlo en el navegador fue lo que lo corrigió.** Son dos ramas del mismo componente,
separadas en `practitioner-profile-view.html:17` por `@if (esPropio() && !previewMode())`:

| Rama | Ruta | Tono | Qué hace |
|---|---|---|---|
| Propia | `:170` | `[variant]="especialidad.tono"` | principal → `primary`; el resto, **un color estable por nombre** (hash djb2, `practitioner-profile-view.ts:107`) |
| Pública | `:772` | `[variant]="especialidad.principal ? 'primary' : 'neutral'"` | principal → `primary`; **el resto, todas grises** |

Quién monta cada una: `practitioner-profile.html:9` pasa `[esPropio]="true"` (el perfil de uno
mismo) y `practitioner-detail.html:15` pasa `[esPropio]="false"` (la ficha que ve un paciente).

**El defecto no es que se vean dos colores juntos: es que la misma especialidad del mismo
médico cambia de color según quién la mire**, sin que ese color signifique nada distinto en
ninguno de los dos casos.

**Medido** en la rama propia, con la sesión de la médica en `/my-account`:

```text
── PROPIA (esPropio=true) — /my-account — 2 chip(s)
   «Cardiología»        fondo rgb(217, 229, 235) · tinta rgb(11, 57, 83)
   «Medicina Interna»   fondo rgb(223, 237, 233) · tinta rgb(31, 89, 73)
   colores distintos: 2
```

Dos especialidades, dos colores, y ninguna de las dos es la principal: el hash los repartió.

La rama pública **está leída y no medida**: `/directory/:profileId` está restringida al rol
paciente y no se alcanza con un clic desde el directorio de especialidades, que es una rejilla
de facetas. Se mide en H3.S3.M2, donde la captura antes/después la pide igual. **No se declara
verificado lo que no se vio.**

Esto es el kill-test de H3, y ya está fallando dentro de un solo archivo.

### 2.2 Las otras formas del perfil del doctor

| Ruta | Forma |
|---|---|
| `practitioner-profile-view.html:723` | Texto pelado: `<p class="profesional__especialidad">{{ perfil().especialidadPrincipal }}</p>` |
| `practitioner-profile-view.html:1233` y `:1277` | Texto en `<span class="profesional__item-titulo">`, con fechas y estado al lado |
| `practitioner-profile-view.html:1223` | Conteo en el título: `Especialidades ({{ … .length }})` — **H3.S3 no lo puede perder** |

Con las dos de 2.1 son **cinco** formas en el mismo archivo. El encargo decía tres.

### 2.3 Fuera del perfil — territorio ajeno: se registra y no se toca (alimenta H3.S3.M3)

| Ruta | Forma | Dueño |
|---|---|---|
| `directory/practitioners-directory/practitioners-directory.html:39` | `<app-specialty-icon>` — glifo, sin texto | Directorio |
| `form-builder/form-builder.html:273` | `<app-specialty-icon>` sobre una plantilla de formulario | Constructor de formularios |
| `public-profile/public-profile-card/public-profile-card.html:305` | `<li class="perfil__aptitud">` | Perfil público |
| `alovida/buscar/profesionales-listado/profesionales-listado.html:89` | `<h2>` de encabezado de grupo | Búsqueda |
| `admin/medical-organization/medical-organization.html:282` y `:328` | `<span>` secundario, vía `etiquetaDe(...)` | Admin |
| `alovida/personas/especialidades-listado/especialidades-listado.html:49` | `.app-chip` escrito **a mano** (`app-chip=""` como atributo literal, no el componente) | Maqueta ALOVIDA |
| `account/pharmacy-orders/new-order/new-order.html:23` | Texto en `<p>` | Farmacia |

La última merece una línea aparte: es HTML de maqueta que **imita** al átomo en vez de usarlo.
No es un consumidor del chip, es una copia de su apariencia.

## 3. Las cuatro candidatas — veredicto con motivo (H1.S3.M2; adelanta H3.S1.M1)

La regla es que lo que sirva parametrizado **se parametriza**: copiar un componente cuya
diferencia se resuelve con un input está prohibido. Las cuatro se abrieron antes de opinar.

### `atoms/chip/` — se reusa adentro, no se reemplaza

Contrato: `variant` (los tonos compartidos + `neutral`), `size` (`sm`/`md`), `label`,
`removable`, `selectable`, salida `removed`.

**Qué hace bien:** el tono ya sale del mapa compartido `shared/components/tone/`, el mismo que
usa el Badge — «un chip de faceta y una etiqueta de estado no pueden pintar distinto el mismo
concepto» (`chip.types.ts`). Esa decisión ya está tomada y la insignia la hereda.

**Por qué no alcanza:** un chip es una **faceta de filtro**. Su modelo es *un texto y quitarlo*.
La insignia de H3 tiene que mostrar cinco cosas —ícono, nombre, principal, certificada,
estado— y `removable`/`selectable` son justamente lo que **no** debe ofrecer: una especialidad
del perfil no se quita desde su insignia. Agregarle ícono, estado y «principal» al chip
cambiaría un átomo que hoy usan las barras de filtros de media aplicación, que es lo que el
encargo prohíbe: se publica una pieza nueva, no se le cambia el comportamiento a la existente.

**Veredicto:** no se reemplaza. **Se compone**: la insignia toma el mapa de tonos del chip, no
su plantilla.

### `atoms/badge/` — descartado, y el motivo no es el aspecto

Contrato: `variant` (los tonos, **sin `neutral`**), `size`, `value: string | number | null`,
`dotOnly`, `role="status"`.

`role="status"` es una región viva: el lector de pantalla **anuncia** cada cambio. Sirve para
«3 mensajes nuevos» y estorba en una lista de ocho especialidades, que se anunciarían solas al
pintarse. Y su contrato es un valor escalar: no tiene dónde entrar un ícono.

**Veredicto:** descartado. Comparte el mapa de tonos con el chip, así que la insignia no pierde
coherencia de color por no usarlo.

### `atoms/specialty-icon/` — se reusa tal cual; es la pieza que ya resolvió lo difícil

Recibe el **nombre** de la especialidad y resuelve el dibujo adentro: quien lo monta no elige el
glifo. Resuelve **por palabra clave y no por `conceptId`**, con motivo escrito: las dos
pantallas que lo dibujan reciben cosas distintas —el directorio tiene el `display` del catálogo,
el listado público parte un titular de texto libre por `·`— y un mapa por `conceptId` serviría
sólo a la primera. Tolera nombres compuestos y **degrada a `general`** en vez de romper cuando
llega una especialidad que el set no conoce. Es `aria-hidden` siempre, porque el nombre va
escrito al lado.

**Veredicto:** se usa. La insignia lo monta adentro. Dibujar un segundo set de íconos de
especialidad sería exactamente el defecto que su propio encabezado nombra.

### `organisms/specialty-browser/` — descartado: responde otra pregunta

Es un **navegador de catálogo**: agrupa, cuenta por grupo (`{{ group.items.length }}`), filtra y
avisa cuando no hay coincidencias. Sus tres consumidores lo confirman —catálogo de formularios
clínicos, importación de procedimientos y la vitrina—: los tres eligen una especialidad de una
lista larga.

La insignia no elige nada: **muestra** las que un profesional ya tiene.

**Veredicto:** descartado. No es una versión grande de la insignia; es un selector.

### La quinta, que el encargo no nombró: `organisms/status-seal/` — **se usa**

El encargo lista cuatro candidatas. Buscando de dónde sale el dato apareció una quinta, y es
la que más cerca está: el tipo que alimenta la pantalla ya la tiene adentro.

```ts
// practitioner-profile-view.types.ts:36
export interface EspecialidadVisible {
  readonly id: string;
  readonly nombre: string;
  readonly principal: boolean;
  readonly certificada: boolean;
  readonly alcance: string;
  readonly desde: Date | null;
  readonly hasta: Date | null;
  readonly estado: string;
  readonly sello: StatusSealVariant;   // <- organisms/status-seal/
}
```

`sello` **ya viene calculado en el dato**, y `status-seal` ya lo pinta en cinco lugares del
perfil (`practitioner-profile-view.html:187`, `:546`, `:744`, `credentials-panel.html:70`,
`my-profile.html:511`). Su `VARIANT_TONES` sale del mismo mapa de tonos compartido.

**Veredicto:** se usa. La insignia **no inventa** su manera de decir «certificada» o «vencida»:
monta el sello que el perfil ya usa para eso. Si la insignia dibujara su propio estado, la
misma especialidad tendría dos vocabularios de estado en la misma pantalla — que es la clase de
defecto que H3 viene a cerrar, no a agregar.

## 4. La anatomía sale del tipo que ya existe (adelanta H3.S1.M2)

Los cinco datos que el CA de H3 pide —ícono, nombre, estado, principal, certificada— **están
todos** en `EspecialidadVisible` (`practitioner-profile-view.types.ts:36`). No hay que inventar
un modelo ni pedirle nada nuevo al backend:

| Lo que muestra la insignia | De dónde sale | Pieza que lo dibuja |
|---|---|---|
| Ícono | `nombre`, resuelto por palabra clave | `atoms/specialty-icon/` |
| Nombre | `nombre` | texto |
| Principal | `principal: boolean` | tono / orden |
| Certificada | `certificada: boolean` | por decidir en H3.S1.M3 |
| Estado | `estado: string` + `sello: StatusSealVariant` | `organisms/status-seal/` |
| Alcance y fechas | `alcance`, `desde`, `hasta` | **no entran en la insignia: van al lado** (H3.S3.M2 — unificar no es recortar) |

## 5. Lo que sale de acá para H3

1. La insignia es **nueva**, y el descarte queda escrito antes del primer archivo — de las
   cuatro que el encargo nombra y de la quinta que apareció midiendo.
2. **Reusa tres piezas existentes**: `atoms/specialty-icon/` completo,
   `organisms/status-seal/` para el estado, y el mapa de tonos de `shared/components/tone/`.
   No duplica ninguna. Lo que aporta de nuevo es **componerlas en una sola forma**, que es
   justamente lo que hoy no existe.
3. Tiene que unificar **cinco** formas en `practitioner-profile-view.html`, no tres, y conservar
   el conteo de `:1223` y las fechas y el estado de `:1233`/`:1277`. Unificar no es recortar.
4. La regla de tono hay que **decidirla**: hoy hay dos. Decidida en §6.

## 6. La regla de tono — decidida (H3.S1.M3)

### Lo primero que hay que aceptar: el contraste no decide

Se midieron los siete tonos del mapa compartido, pintando un elemento con el trío real y
leyendo el color que el navegador resuelve — no el nombre del token, que puede apuntar a otro
token. Umbral **4,5:1**, el de texto chico (WCAG 1.4.3). El de 3:1 es para objetos gráficos y
usarlo acá sería el mismo error que ya costó un defecto real esta noche.

| Tono | Claro | Oscuro |
|---|---|---|
| `primary` | **9,49:1** | **6,56:1** |
| `neutral` | **7,54:1** | **12,03:1** |
| `secondary` | 6,63:1 | 5,83:1 |
| `info` | 5,01:1 | 6,23:1 |
| `success` | 6,75:1 | 6,64:1 |
| `warning` | 7,49:1 | 6,15:1 |
| `error` | 7,53:1 | 6,76:1 |

**Los siete pasan, en los dos temas.** El sistema está sano, y por eso el contraste no permite
elegir: hay que elegir por significado y decirlo como lo que es.

### La decisión: `primary` para la principal, `secondary` para el resto

> **Esta decisión se corrigió mientras se aplicaba.** El primer veredicto fue «`neutral` para
> el resto», y era la regla de la rama pública. Al abrir el `.ts` para migrar apareció, en un
> comentario, un pedido explícito del cliente del **19/09/2026**: `neutral` es «justo el gris
> que el cliente pidió dejar de ver». Medir el contraste no alcanzaba — el argumento que
> faltaba estaba escrito en el código, no en los números.

**Por qué el hash queda afuera.** Reparte `primary`, `info`, `success` y `secondary`
(`TONOS_DE_ESPECIALIDAD`, `practitioner-profile-view.ts:88`). `info` y `success` **significan
algo** en este sistema —`badge.types.ts` lo dice en una línea: «un badge siempre significa
algo»—, así que una especialidad podía leerse como el estado de un trámite. El color no dice
nada, pero **parece** decir algo, y eso es peor que no decir nada: un color arbitrario que
aparenta ser una categoría es información falsa.

**Por qué `neutral` tampoco.** Porque el gris ya se probó y el cliente pidió dejar de verlo.
Una especialidad no es un dato apagado.

**Queda `secondary`:** de marca, sin significado de estado, y no gris. Cumple las tres
condiciones a la vez, y es el único tono del mapa que las cumple.

**Qué lo reemplaza, para no perder la distinción que el hash intentaba dar.** El **ícono** de
`atoms/specialty-icon/`: un dibujo por especialidad, que es reconocimiento de verdad —«reconocer
sin leer», dice su propia ficha— en vez de un color sorteado. Y el **estado** sale de
`organisms/status-seal/`, que sí tiene vocabulario propio.

Con eso, la insignia cumple «nada transmitido sólo por color» sin esfuerzo: la principal se
distingue por tono **y** por orden; la certificación, por sello **con texto**; la especialidad,
por ícono **y** nombre.

### Los tokens, sin un solo literal

| Qué | Token |
|---|---|
| Fondo de la principal | `--st-primary-bg` |
| Tinta de la principal | `--st-primary-fg` |
| Borde de la principal | `--st-primary-bd` |
| Fondo del resto | `--st-secondary-bg` |
| Tinta del resto | `--st-secondary-fg` |
| Borde del resto | `--st-secondary-bd` |

Se toman por las clases `tone--primary` y `tone--secondary` de `shared/components/tone/tone.css`,
que es la única copia del mapa. La insignia **no define ningún color propio**: el tema oscuro lo
resuelve el sistema, no este componente.
