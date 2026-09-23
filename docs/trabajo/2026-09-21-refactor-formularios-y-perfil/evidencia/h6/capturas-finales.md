# H6.S2.M1 — La matriz final: cinco altas, dos anchos, dos temas

**Veredicto: PASS.** Las veinte celdas se tomaron y **se miraron**. Ninguna muestra un defecto
introducido por este carril. Los tres defectos visibles son preexistentes y ajenos: dos ya estaban
anotados desde `H1`, y el tercero se midió acá por primera vez.

Maqueta, sin sesión (las cinco altas son públicas), `reducedMotion: reduce`. Sonda
`tmp/sonda-capturas-h6.mjs`, salida literal en [`matriz-final.txt`](./matriz-final.txt).

## 0 · Por qué estas celdas se pueden comparar y las cuentas de `H1` no

`H4.S2.M4` demostró que la maqueta **regenera sus datos en cada compilación**, así que ninguna
cuenta —caracteres, sellos, filas— vale como huella entre dos compilaciones. Lo que sí es
invariante es lo que esta matriz mide: **título, desborde horizontal, fondo del tema, número de
campos y cuántos de ellos tienen nombre accesible**. Ninguno de esos cinco depende del dato que la
maqueta inventa.

## 1 · Antes de mirar: el carril no puede haber movido un píxel de las altas

```text
$ git diff --name-only d40b5631 HEAD -- 'src/app/features/auth/**/*.html' 'src/app/features/auth/**/*.css'
(vacío)

$ git diff --name-only d40b5631 HEAD | sed 's/.*\.//' | sort | uniq -c
      2 html      ← las dos son del perfil (practitioner-profile y su vista)
     14 ts
```

**Cero hojas de estilo en todo el carril, y cero plantillas en `features/auth`.** Las cinco altas
cambiaron sólo en su `.ts`. Una diferencia visual en ellas tendría que venir de una decisión del
contenedor, no del marcado — y por eso la matriz mira **qué se dibuja**, no sólo si se dibuja.

Esto no reemplaza mirar las capturas: un `.ts` puede dejar de pasarle un valor a la plantilla y
vaciar un campo sin tocar una línea de HTML. Por eso la sonda cuenta campos y etiquetas.

## 2 · Las veinte celdas

| Alta | Escritorio claro | Escritorio oscuro | Móvil claro | Móvil oscuro |
|---|---|---|---|---|
| Paciente | OK · 5/5 | OK · 5/5 | OK · 5/5 | OK · 5/5 |
| Profesional | OK · 5/5 | OK · 5/5 | OK · 5/5 | OK · 5/5 |
| Aseguradora | OK · 4/4 | OK · 4/4 | OK · 4/4 | OK · 4/4 |
| Laboratorio | OK · 3/3 | OK · 3/3 | OK · 3/3 | OK · 3/3 |
| Imagenología | OK · 3/3 | OK · 3/3 | OK · 3/3 | OK · 3/3 |

`n/n` = campos en pantalla / campos con nombre accesible. **20 de 20 celdas: desborde horizontal
0 px y ningún campo sin etiquetar.** Fondos: `rgb(255,255,255)` en claro y `rgb(8,22,28)` en
oscuro, los dos valores del baseline.

Consola: **una entrada única** —la violación de CSP por script en línea, el hallazgo preexistente
del baseline (`../antes/rutas.md`)— en cuatro de las cinco altas; **cero** en imagenología, igual
que en el barrido de rutas. Ninguna respuesta ≥ 400 en ninguna celda.

## 3 · Lo que se vio al abrir las capturas

Se abrieron seis celdas, elegidas por riesgo, no por comodidad: las dos más densas en los dos
extremos de la matriz, más una de cada alta restante.

| Captura | Qué se vio |
|---|---|
| `alta-paciente-escritorio-light.png` | Los cinco campos con su etiqueta y su ayuda, el paso 1 de 12 marcado, «+ Agregar otro nombre», y las dos tarjetas de contexto. **Indistinguible del baseline** (§4) |
| `alta-paciente-movil-dark.png` | El indicador de pasos pliega a dos filas sin recortarse, los campos pasan a una columna a ancho completo, el texto se lee sobre el fondo oscuro |
| `alta-laboratorio-movil-light.png` | «Paso 1 de 10», los tres campos legales con su ayuda, el desplegable de tipo de sociedad con su texto de invitación |
| `alta-imagenologia-escritorio-dark.png` | «Paso 1 de 11», los tres campos, las tarjetas de contexto. Acá se notó el enlace del pie apagado → §5 |
| `alta-profesional-movil-light.png` | El título parte en dos líneas sin cortar palabras, los cinco campos apilados, la tarjeta «Así te van a ver tus pacientes» |
| `alta-aseguradora-escritorio-light.png` | «Paso 1 de 8» y los cuatro campos con su ayuda. **Es la que menos se parece a las otras cuatro** → §5.3 |

Nada recortado, nada superpuesto entre elementos del producto, nada pegado al borde en 390 px,
foco de teclado visible (§ `teclado.md`), y el mismo ritmo de espaciado en las cinco.

## 4 · La comparación que convierte «se ve bien» en «no cambió»

`../antes/capturas/pac-01-pagina.png` (baseline de `H1.S3`, tomado antes de tocar nada) y
`capturas/alta-paciente-escritorio-light.png` (hoy), abiertas una al lado de la otra:
**indistinguibles**. Mismo título, mismo indicador de pasos, mismas cinco etiquetas en el mismo
orden y con los mismos asteriscos, mismas ayudas, mismo botón, mismo pie, mismas dos tarjetas.
Incluso las dos insignias flotantes de la maqueta tapan **el mismo** renglón de la tercera tarjeta
en las dos.

## 5 · Tres hallazgos ajenos, ninguno de este carril

### 5.1 Las insignias flotantes de la maqueta tapan contenido — preexistente

«Datos de prueba» y «Ver componentes» están fijas abajo a la izquierda en escritorio, y **tapan el
encabezado de la tercera tarjeta de contexto**. En móvil suben al encabezado y **tapan el logotipo**.
Está en el baseline con exactamente el mismo recorte (§4) y ya se registró en `H1.S3` para el
perfil, donde tapaban «Cambiar contraseña». Son andamiaje de la maqueta. **Anotado, no tocado.**

### 5.2 El enlace «Iniciá sesión» no llega a AA en tema oscuro — medido acá

Se vio apagado en la captura de imagenología en oscuro. Una impresión no es un hallazgo, así que se
midió con los colores que el navegador aplica de verdad:

```text
$ node tmp/sonda-contraste-enlace.mjs
light · /auth/register/imaging-center · tinta=rgb(11,85,126) sobre rgb(255,255,255) · 12px/500 · ratio=8.03:1 · AA(4.5) PASA
dark  · /auth/register/imaging-center · tinta=rgb(18,113,159) sobre rgb(10,43,61)   · 12px/500 · ratio=2.73:1 · AA(4.5) NO PASA
```

**2,73 : 1 contra los 4,5 : 1 que exige AA para texto normal.** El enlace vive en el pie compartido
de `auth`, y este carril no tocó ninguna hoja de estilo ni ninguna plantilla de `auth` (§1).
**Anotado, no tocado** (regla 00 §3.2).

> **Y el instrumento casi miente otra vez.** La primera corrida devolvió `2,6 : 1` en tema **claro**
> —un absurdo, porque es texto oscuro sobre blanco—. La causa: Chromium devuelve
> `color(srgb 1 1 1 / 0.92)` cuando el token está declarado en un espacio de color amplio, y el
> lector tomaba `1` como un canal de 0 a 255, o sea negro. Se corrigió normalizando según la
> **forma** del valor y no según el número, y recién entonces se reportó. El primer número no se
> publicó como hallazgo; queda acá como registro de que se detectó.

### 5.3 Las cinco altas no comparten una misma cáscara — preexistente

Mirarlas juntas lo deja a la vista. Cuatro diferencias, ninguna decorativa:

| | Paciente | Profesional | Laboratorio | Imagenología | **Aseguradora** |
|---|---|---|---|---|---|
| Indicador de pasos | doce iconos | «Paso 1 de 13» | «Paso 1 de 10» | «Paso 1 de 11» | «Paso 1 de 8» |
| Ancho de la tarjeta | centrada | centrada | centrada | centrada | **casi todo el viewport** |
| Botón de avance | icono redondo | icono redondo | icono redondo | icono redondo | **botón con texto «Siguiente»** |
| Tarjetas de contexto | 2 | 2 | 3 | 2 | **ninguna** |
| Ejemplo en el campo vacío | sí | sí | sí | sí | **no** |

La aseguradora quedó fuera del patrón de las otras cuatro. **Nada de esto lo tocó este carril**
(§1: cero plantillas y cero estilos), y unificarlo es exactamente el refactor no solicitado que la
regla 00 §3.2 prohíbe. **Anotado para quien tome la cáscara de las altas como tarjeta propia.**

## 6 · No cubierto

- **Los estados de carga, vacío y error de estas cinco pantallas.** La matriz captura el estado
  inicial, que es el que el carril puede haber alterado al mover la decisión de sitio. El estado de
  error por campo sí quedó ejercitado, por teclado, en [`teclado.md`](./teclado.md).
- **Tablet (768 px).** Se cubrieron 390 y 1440. Las cinco altas usan una sola columna por debajo del
  corte y dos por encima, y los dos anchos medidos caen a cada lado de ese corte; 768 px no agrega
  una tercera forma de layout. Se declara como elección, no como olvido.
- **Lector de pantalla.** Se midió el nombre accesible de cada campo (20/20 celdas, todos con
  etiqueta), no el recorrido completo con un lector real.
- **El perfil**, que es la otra pantalla del carril: su matriz de ocho celdas está en
  [`../h4/recorrido-comparado.md`](../h4/recorrido-comparado.md) §1, con su corrección del
  2026-09-22 al lado.
