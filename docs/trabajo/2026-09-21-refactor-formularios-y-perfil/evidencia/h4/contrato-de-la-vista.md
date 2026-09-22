# H4.S1.M2 — Contrato de `PractitionerProfileView` según el §10

Las **diez áreas** que el §10 del documento maestro declara obligatorias, respondidas para la pieza
elegida en `H4.S1.M1`. Se escribe **antes** de tocar código, que es lo que el §10 pide: «no se
inicia la migración de una familia con entradas y eventos ambiguos».

## El problema, en una frase

`PractitionerProfileView` **se llama vista y no lo es**: recibe el perfil por `input.required()` y
al mismo tiempo inyecta siete servicios con los que escribe en el servidor. El nombre miente, y por
eso nadie lo revisa como contenedor.

Las siete inyecciones no son siete responsabilidades: son **tres operaciones**.

| Operación | Servicios que usa | Dónde vive hoy |
|---|---|---|
| Elegir foto, fijarla y propagarla a la vitrina pública | `FilesClient` · `ProfilesClient` · `CommunityClient` · `AuthService` | `:259-347` |
| Retirar una credencial, con confirmación | `DialogService` · `ProfilesClient` · `ToastService` | `:479-497` |
| El aviso único de «Credenciales» al abrir esa pestaña | `HelpBlockDismissalStore` · `ToastService` | `:206-218` |

**La dirección del cambio:** las tres suben al contenedor real, `PractitionerProfile`
(`practitioner-profile.ts:118-122`), que ya resuelve el perfil y ya inyecta tres de los siete
(`ProfilesClient`, `FilesClient`, `AuthService`). La vista se queda con entradas, salidas y
derivaciones puras.

---

## 1 · Identidad

| Campo | Valor |
|---|---|
| Ruta | `features/account/my-profile/practitioner-profile/practitioner-profile-view/` |
| Símbolo | `PractitionerProfileView` |
| Selector | `app-practitioner-profile-view` |
| Responsabilidad | **Pintar** la ficha de un perfil profesional y **avisar** lo que la persona quiere hacer. No decide, no persiste, no navega. |
| Nivel | Organismo de feature (no compartido): vive en su feature y no se publica en `shared/`. |
| Ámbito | `my-profile`, **y la Guía**. Se instancia desde `PractitionerProfile`, desde sí mismo en vista previa, y desde `directory/practitioner-detail` — ese tercero está **fuera** de la reserva del carril (ver §9). |
| Versión de contrato | Tres entradas nuevas **con valor por defecto** y tres salidas nuevas. Compila para los tres consumidores sin tocarlos; lo que cambia es dónde ocurren las operaciones. Consumidores: **tres** (ver §9). |

## 2 · Entradas

| Nombre | Tipo | Obligatoria | Default | Nulable | Transformación | Validación |
|---|---|---|---|---|---|---|
| `perfil` | `PerfilProfesionalVisible` | **sí** | — | no | ninguna | la hace quien lo resuelve |
| `esPropio` | `boolean` | no | `false` | no | ninguna | — |
| `previewMode` | `boolean` | no | `false` | no | ninguna | — |
| `fotoSubiendo` ⭑ | `boolean` | no | `false` | no | ninguna | — |
| `errorDeFoto` ⭑ | `string` | no | `''` | no | ninguna | `''` significa «no pasó nada», nunca `null` |
| `fotoRecien` ⭑ | `string \| null` | no | `null` | **sí** | ninguna | debe ser una `data:` URL, no `blob:` ni una firma del backend |

⭑ = nueva. Hoy son `signal` internas (`:222`, `:225`, `:241`) porque el componente hace la subida
él mismo. Al subir la operación, el **estado de esa operación sube con ella**: quien la ejecuta es
quien sabe si está en curso y si falló.

**Por qué `errorDeFoto` es `string` y no `boolean`:** el mensaje no es decorativo. Hay dos fallos
distintos con dos textos distintos —la cuenta sin perfil profesional (`:275-278`) y la subida
fallida (`:301`)— y quien decide cuál ocurrió es el contenedor.

**Por qué `fotoRecien` sigue existiendo:** el perfil llega por `input()`, así que la vista no puede
releerlo sola tras una subida. La nota de `:227-240` documenta que debe ser una `data:` URL: la CSP
declara `img-src 'self' data:` y bloquea `blob:`; la firma de descarga apunta a `file://local/<sha>`
y tampoco carga. **Ese detalle viaja con el contrato**, porque el contenedor es quien va a producir
el valor.

## 3 · Salidas

| Nombre | Payload | Intención | Cuándo se emite | Cuándo NO | Consumidor responsable |
|---|---|---|---|---|---|
| `trayectoriaCambio` | `void` | «releé el perfil» | tras alta/baja de un vínculo laboral en el formulario embebido | nunca al cargar | `PractitionerProfile.recargar()` |
| `fotoElegida` ⭑ | `File` | «quiero esta foto» | al elegir un archivo | con una subida en curso; en `previewMode`; sin `esPropio` | contenedor: sube, fija y propaga |
| `credencialARetirar` ⭑ | `FormacionVisible` | «quiero retirar este título» | al pedir retirar | en `previewMode`; sin `esPropio` | contenedor: **confirma** y retira |
| `pestanaVisible` ⭑ | `string` | «ahora se mira esta pestaña» | al cambiar de pestaña **por acción de la persona** | **nunca en el primer render** | contenedor: decide el aviso único |

**`credencialARetirar` emite la intención, no el resultado.** La confirmación sube con la
operación: un diálogo es una decisión del flujo, y §10.3 dice que «guardar es una intención hasta
obtener resultado». Si la vista confirmara y el contenedor persistiera, la política de descarte
quedaría repartida en dos sitios.

**`pestanaVisible` es la salida delicada.** Hoy el aviso único lo dispara un `effect` interno
(`:206-218`) que lee la pestaña seleccionada. Al subirlo, la vista **avisa qué se mira** y el
contenedor decide si corresponde avisar. El riesgo es emitirlo en el primer render, y eso es
exactamente lo que `H4.S1.M5` exige demostrar con una prueba.

## 4 · Funciones de entrada

**Ninguna.** El contrato no admite `input`s de tipo función.

Es deliberado y es la mitad del punto: hoy la vista recibe datos y **ejecuta** persistencia. Pasarle
un callback `onSubirFoto` la dejaría igual de acoplada con otra forma — el §10 lo llama «callbacks
de persistencia encubiertos». Las intenciones viajan por `output()`, que es inspeccionable,
testeable y no deja que la vista sepa qué pasa después.

## 5 · Composición

- **Hijos:** los del sistema de diseño (`Avatar`, `Badge`, `Card`, `Tabs`, `Tooltip`,
  `SpecialtyBadge`, `StatusSeal`) más los paneles propios de la ficha.
- **Cardinalidad:** una instancia por ficha, **más una anidada** en modo vista previa.
- **Auto-referencia:** la pestaña «Vista previa» reinstancia este mismo componente
  (`:160-162`). `previewMode` corta la recursión y **suprime toda acción de escritura, aunque
  `esPropio` llegue en `true` por error de quien llama** (`:175-181`). Con la vista ya tonta esto se
  vuelve más fuerte, no más débil: la instancia embebida simplemente **no lleva manejadores
  conectados**, así que no hay nada que suprimir.
- **Slots:** ninguno nuevo.
- **Semántica accesible:** la que ya tiene. Este trabajo **no la toca**; cualquier diferencia sería
  una regresión, no una mejora.

## 6 · Estado

La tabla de propiedad del estado que pide el §4 y que `H2.S3` dejó abierta.

| Estado | Quién lo crea | Quién lo cambia | Quién lo lee | Qué lo invalida | Cuándo se destruye |
|---|---|---|---|---|---|
| `perfil` (el dato) | `PractitionerProfile` al resolver la ruta | el contenedor, al recargar | la vista, por `input()` | `trayectoriaCambio`; una foto nueva | al salir de la ruta |
| Subida de foto en curso | **el contenedor** (hoy la vista, `:222`) | el contenedor | la vista, por `input()` | el fin de la subida, con éxito o error | al terminar |
| Error de la foto | **el contenedor** (hoy la vista, `:225`) | el contenedor | la vista, por `input()` | una subida nueva la limpia | al terminar |
| Foto recién subida | **el contenedor** (hoy la vista, `:241`) | el contenedor | la vista, por `input()` | una recarga del perfil | al salir de la ruta |
| Pestaña seleccionada | **la vista** | la vista | la vista | nada externo | con el componente |
| «Ya se avisó lo de Credenciales» | `HelpBlockDismissalStore` | **el contenedor** | el contenedor | nada: es una vez por cuenta | persiste entre sesiones |

**La regla que ordena la tabla:** el estado **de una operación** pertenece a quien ejecuta la
operación. La pestaña seleccionada es estado de interfaz efímero y se queda abajo; todo lo demás
sube.

## 7 · Apariencia

- **Tokens:** los del sistema. **Ningún valor literal** de color, espaciado, radio ni tipografía
  entra ni sale de este cambio.
- **Variantes permitidas:** las de hoy. No se agrega ninguna.
- **Responsive:** sin cambios. El mismo CSS, el mismo archivo.
- **Responsabilidad del contenedor:** ninguna sobre apariencia. No le pasa clases, ni estilos, ni
  banderas de presentación.
- **Invariante:** este cambio es de **reparto de responsabilidades**, no de interfaz. La ficha tiene
  que verse **idéntica** antes y después, en los tres anchos y los dos temas, y eso es lo que
  `H4.S2.M4` y las capturas de `H6` comprueban.

## 8 · Errores

Las tres clases del §10, que hoy están mezcladas:

| Clase | Qué es acá | Quién responde |
|---|---|---|
| **Contrato inválido** | `perfil` ausente; `fotoRecien` con una URL que la CSP va a bloquear | quien llama. `input.required` cubre el primero; el segundo queda documentado en §2 |
| **Error de entrada** | La persona elige un archivo que no es imagen o pesa de más | lo rechaza el control de archivo, con sus propios textos, **antes** de emitir |
| **Resultado remoto** | La subida falla; la cuenta no tiene perfil profesional (`:269-280`); retirar el título falla (`:494`) | **el contenedor**. La vista sólo pinta `errorDeFoto` y lo que el aviso diga |

**Un caso que no se pierde en la mudanza:** la propagación a la vitrina pública es
**best-effort a propósito** (`:320-321`) — un fallo ahí no puede tumbar la foto profesional, que ya
quedó guardada. Esa política sube **tal cual** al contenedor. Es una regla de negocio, y el §2.3
prohíbe cambiarla porque simplifique.

## 9 · Compatibilidad

**Firmas afectadas:** tres entradas nuevas y tres salidas nuevas. Las tres entradas llevan valor por
defecto, así que **no rompen a quien no las pase**; las salidas no obligan a nadie a escucharlas.
Lo que sí es incompatible es el comportamiento: sin conectar los manejadores, las tres operaciones
dejan de ocurrir.

**Consumidores identificados: tres. Y el tercero está FUERA de la reserva.**

> ⚠️ **La primera versión de este contrato decía que no había consumidores fuera del carril. Era
> falso**, y se descubrió al verificarlo en vez de suponerlo:
> `git grep app-practitioner-profile-view` devuelve un consumidor en
> `features/directory/practitioner-detail/practitioner-detail.html:15`.

| Consumidor | Dónde | Dentro de la reserva | Qué hay que hacer |
|---|---|---|---|
| `PractitionerProfile` | `practitioner-profile.html:7-10` | sí | conectar las tres salidas y pasar las tres entradas nuevas |
| Él mismo, en vista previa | `practitioner-profile-view.ts:160-162` | sí | nada: en `previewMode` no se conecta ninguna |
| `PractitionerDetail` (la Guía) | `directory/practitioner-detail/practitioner-detail.html:15` | **no** | **nada, y está comprobado** |

**Por qué el tercero no se entera del cambio — verificado, no supuesto.** Monta la vista con
`[perfil]="perfil" [esPropio]="false"` y nada más. Y las tres operaciones están **todas** cerradas
por `esPropio` en la plantilla:

| Operación | Guarda en la plantilla |
|---|---|
| Elegir foto | `practitioner-profile-view.html:17` y `:707` — los dos controles (`:52`, `:745`) cuelgan de un `@if (esPropio()…)` |
| Retirar credencial | dentro del mismo bloque de perfil propio; el botón está en `:611` |
| Aviso de Credenciales | `practitioner-profile-view.ts:207` — el `effect` sale temprano si `!esPropio()` |

Con `esPropio` en `false` la Guía ve una ficha **de sólo lectura**: ninguna de las tres le era
alcanzable antes y ninguna lo será después. Y como las tres entradas nuevas llevan valor por
defecto, su plantilla **sigue compilando sin tocar una línea**.

**Aun así se declara como consumidor ajeno**, y `H6` lo incluye en la muestra de regresión: que el
razonamiento diga que no cambia no reemplaza mirarlo.

**Adaptador temporal: ninguno, y se declara por qué.** El §10 permite uno, pero los dos
consumidores que hay que migrar están dentro de la reserva y el tercero no necesita migrarse. Un
adaptador sería una tercera API sin nadie a quien servir — exactamente lo que el §10 prohíbe que se
vuelva permanente.

## 10 · Evidencia

Qué hace falta para poder decir que esto quedó hecho — el DoD, escrito antes de ejecutarlo.

| Qué | Cómo se demuestra | Microtarea |
|---|---|---|
| La vista no inyecta clientes de negocio | revisión del diff + `node scripts/check-architecture.mjs` en verde | `H4.S1.M3` |
| La vista no muta lo que recibe | prueba dirigida: se le pasa un `perfil` congelado y se ejercita; el objeto sale idéntico | `H4.S1.M4` |
| Una intención no se emite al cargar | prueba dirigida: se monta, se espera el primer render, y **ninguna** salida emitió | `H4.S1.M5` |
| Escenarios tipados | montaje con `setInput` para las seis entradas, sin red | `H4.S1.M4/M5` |
| Uso real integrado | la ficha se recorre en el navegador: foto, retiro de credencial y aviso de pestaña siguen funcionando | `H4.S2` y `H6` |
| Sin regresión visual | tres anchos × dos temas, comparados contra el baseline | `H6` |

**Lo que este contrato NO cubre, y se declara:** no se toca la semántica accesible, ni el CSS, ni
las pestañas de la ficha ajena, ni `practitioner-profile-edit` —que acaba de cambiar en
`d40b5631`—, ni ningún consumidor fuera de `my-profile/practitioner-profile/`.
