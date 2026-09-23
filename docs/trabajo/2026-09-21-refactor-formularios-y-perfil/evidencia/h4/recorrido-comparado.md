# H4.S2.M4 — El comportamiento, comparado en el navegador

**Veredicto: PASS con una cobertura declarada.** La ficha se dibuja igual, el aviso de
«Credenciales» funciona, y la subida de foto **no pudo ejercitarse con ningún instrumento** — pero
se demostró que eso es **idéntico antes y después del cambio**, así que no es regresión de este
carril.

Sesión `medica@alovida.mock` (sintética declarada), maqueta, ancho 1440×900 y 390×844, temas claro
y oscuro, `reducedMotion: reduce`.

## 0 · Lo primero: el instrumento del baseline NO sirve para comparar

El baseline de `H1.S3` anotó «`/my-account`: texto en main tras cargar = **934** caracteres». La
primera corrida después del cambio dio **931**, y eso parecía una diferencia de tres caracteres que
había que explicar.

**No lo era. La cifra no mide el código.** Se comprobó en las dos direcciones, devolviendo los
cuatro archivos al commit anterior y volviendo a medir:

| Qué | Código anterior | Código de este carril |
|---|---|---|
| `sonda-perfil.mjs`, escritorio claro | 934 | 934 · 931 (dos corridas) |
| `sonda-texto-perfil.mjs` | 931 | 931 |
| Las cuatro celdas de una misma corrida | — | 934 · 935 · 931 · 938 |

El mismo código produce 931 y 934; el código anterior también. Y el volcado del texto de `main` en
los dos estados es **idéntico línea a línea** (`diff` sin salida).

**La causa, aislada con un experimento:** se forzó una recompilación **sin cambiar una sola línea**
(`touch` sobre el archivo, `git status` vacío después) y el conteo de sellos de la pestaña
Trayectoria pasó de **2 a 6**. La maqueta **regenera sus datos en cada compilación**; dentro de una
misma compilación es estable (dos corridas seguidas, 2 y 2).

> **Consecuencia para el resto del trabajo:** ninguna cuenta tomada a un lado y otro de un rebuild
> —caracteres, sellos, filas— vale como huella de comparación en esta maqueta. `H6` tiene que
> comparar **estructura y comportamiento**, no cifras. Los «934 caracteres» del baseline quedan
> como lo que son: el tamaño de un dato que ya no existe.

## 1 · Las ocho celdas, comparadas contra `H1.S3`

Misma sonda del baseline, corrida verbatim.

```text
$ node tmp/sonda-perfil.mjs <capturas>
perfil-consulta-escritorio-light.png · 1440×900 · fondo body=rgb(255, 255, 255) · desborde horizontal=0px · problemas=0
perfil-edicion-escritorio-light.png · 1440×900 · fondo body=rgb(255, 255, 255) · desborde horizontal=0px · problemas=0
perfil-consulta-movil-light.png    · 390×844  · … · desborde horizontal=0px · problemas=0
perfil-edicion-movil-light.png     · 390×844  · … · desborde horizontal=0px · problemas=0
perfil-consulta-escritorio-dark.png · 1440×900 · fondo body=rgb(8, 22, 28) · desborde horizontal=0px · problemas=0
perfil-edicion-escritorio-dark.png  · 1440×900 · fondo body=rgb(8, 22, 28) · desborde horizontal=0px · problemas=0
perfil-consulta-movil-dark.png      · 390×844  · fondo body=rgb(8, 22, 28) · desborde horizontal=0px · problemas=0
perfil-edicion-movil-dark.png       · 390×844  · fondo body=rgb(8, 22, 28) · desborde horizontal=0px · problemas=0
```

**Ocho de ocho: desborde 0, problemas 0, fondos correctos** — los mismos tres números que el
baseline, que sí son invariantes.

`perfil-consulta-escritorio-light.png` abierta al lado de la del baseline: **indistinguibles**.
Mismo retrato de iniciales, misma cabecera «Tus datos», las mismas siete pestañas en el mismo
orden, los mismos renglones, las mismas dos especialidades con su sello, la misma presentación, el
mismo pie «En la plataforma desde …». Las dos insignias flotantes de la maqueta tapan «Cambiar
contraseña» en las dos — hallazgo preexistente ya anotado en `H1.S3`.

`/my-account/edit` entra como **control**: este carril no lo tocó, y se ve igual.

## 2 · Las tres operaciones que bajaron al contenedor

Es lo que de verdad había que mirar: lo que se movió de sitio.

| # | Operación | Qué se observó | Veredicto |
|---|---|---|---|
| 1 | El aviso único de «Credenciales» | 0 avisos al abrir la ficha · **1** al abrir esa pestaña, con su texto visible · sigue en 1 al ir a «Actividad» y volver | **PASS** |
| 2 | Retirar un título | **0 botones «Retirar»**: los ocho elementos de esta compilación están verificados o activos, ninguno pendiente | **No ejercitado** — falta el dato, no el código |
| 3 | Subir la foto | El manejador corre, pero no sale ninguna petición | **Sin regresión** (ver §3) |

```text
1 · aviso de Credenciales · al abrir la ficha=0 · al abrir la pestaña=1 (texto visible=true) · al volver=1
2 · trayectoria · botones «Retirar»=0 · sellos en pantalla=2
problemas=2
    console: Executing inline script violates the following Content Security Policy directive…
```

`capturas/op-1-aviso-credenciales.png`, **abierta**: el aviso está abajo a la derecha con el título
«Credenciales» y el texto completo —«…lo que ya fue verificado contra una fuente —el colegio
médico, el registro de matrículas—…»—, sobre la pestaña Credenciales con sus ocho tarjetas
(Todas 8 · Verificadas 5 · Declaradas 3). **El `effect` que lo disparaba desde la vista se
reemplazó por una salida y una decisión del contenedor, y el resultado en pantalla es el mismo.**

Los **2 problemas de consola** son las dos entradas de la **misma** violación de CSP por script en
línea, el hallazgo preexistente registrado en el baseline de `H1` (`evidencia/antes/rutas.md`).
Cero respuestas ≥ 400.

## 3 · La foto: qué se intentó, qué se sabe y qué no

> [!important] Corrección del 2026-09-22, escrita al cerrar `H6.S1.M4`
> **Esta sección se equivocaba de instrumento, y la conclusión cambió.** Lo que sigue se conserva
> tal como se escribió, porque el registro no se maquilla; pero hay que leerlo con esto al lado:
>
> - **«No sale ninguna petición» no medía nada.** El backend simulado es un `HttpInterceptorFn`
>   (`core/mock/mock-backend.interceptor.ts:44`), no un servidor: responde dentro de Angular y
>   **ninguna operación de la maqueta llega a la capa de red** que la sonda observaba. Cero
>   peticiones era el valor esperado para cualquier operación, saliera bien o mal.
> - **«El manejador corre» estaba bien, pero mal deducido.** Se infirió de que la entrada quedaba
>   en cero archivos, y eso también es compatible con que nunca se le asignara ninguno. Ahora está
>   medido directo, con un espía puesto antes del evento: `change con 1 archivo(s)`.
> - **La subida sí ocurre.** `fotoRecien` pasa de `null` a tener valor, y esa señal sólo se escribe
>   al final del ciclo.
> - **Lo que falla es el dato que vuelve**: un sobre `{body, headers}` etiquetado
>   `application/octet-stream`, que ningún `<img>` puede dibujar, y que además trae el avatar por
>   defecto en lugar de la foto. Lo arma `core/mock/handlers/files.handlers.ts` — ajeno al carril.
>
> Medición completa en [`../h6/e2e-dirigido.md`](../h6/e2e-dirigido.md) §5.

Se intentó con **dos** instrumentos distintos:

1. `setInputFiles` directo sobre la entrada oculta.
2. El camino de una persona: clic en el retrato → evento `filechooser` → `setFiles`.

**Los dos terminan igual**, y lo mismo con el código anterior al carril:

```text
3a · control de foto · entradas=1 · deshabilitada=false
3c · archivos que quedan en la entrada=0 (0 = el manejador corrió)
3b · peticiones tras elegir la foto: 0
3  · foto · imagen antes=0 · despues=0 · src=ninguno
```

Lo que **sí** se sabe:

- **El manejador corre.** Su primera línea limpia la entrada, y la entrada queda en cero archivos.
- **No sale ninguna petición** a `/common/files/upload`, `/profiles/…/photo` ni `/community/…`.
- **No aparece el mensaje de error** de «tu cuenta no está asociada a un perfil profesional»
  (`capturas/op-3-foto-subida.png`, abierta: el avatar sigue en iniciales y no hay texto de error).
- **Es idéntico con los cuatro archivos devueltos al commit anterior**, comprobado corriendo la
  misma sonda contra ese estado. **No es una regresión de este carril.**

Lo que **no** se sabe, y por eso no se afirma: si la subida falla para una persona de verdad, o si
lo que falla es la emulación del diálogo de archivo en este entorno. Afirmar un defecto del
producto con esta evidencia sería sobre-afirmar.

**Queda como no cubierto y es trabajo natural del E2E dirigido de `H6.S1.M4`**, que es donde este
camino tiene que quedar ejercitado de punta a punta.

## 4 · Un defecto propio del método, anotado

La primera corrida de la sonda murió con `<vite-error-overlay> intercepts pointer events` y ni
pudo iniciar sesión. **No era un error de compilación**: el registro del servidor no tenía ni uno,
sólo avisos. La sonda había arrancado **mientras el servidor recompilaba**. Se resolvió esperando
por condición —contando las marcas de compilación completa en el registro— en vez de correr y ver.
Todas las corridas de este documento esperan así.

## 5 · No cubierto

- La subida de foto, por lo de §3.
- Retirar un título: no hay ninguno pendiente en los datos de esta compilación. La regla sí está
  fijada por dos pruebas dirigidas —el dueño ve «Retirar» sólo en un pendiente, un visitante no lo
  ve nunca— y el `DELETE` con y sin confirmación, por dos más en el contenedor.
- Teclado, lector de pantalla y la matriz completa de viewports: son de `H6.S2`.
- La ficha de la Guía (`directory/practitioner-detail`), el otro consumidor de esta vista: entra en
  la muestra de regresión de `H6`.
