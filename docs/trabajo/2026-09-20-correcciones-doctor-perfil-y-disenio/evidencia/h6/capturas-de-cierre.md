# H6.S3.M3 — las capturas de cierre, miradas

Seis capturas de la conversión C-21 que la maqueta puede dibujar: el
desplegable de formato del certificado de portabilidad, en tres anchos y dos
temas. Están en el repo del front, en
`docs/frontend/evidence/formato-en-select/`.

Sonda: **24/24**.

```text
OK  [movil light]      los tres formatos, en orden y completos
OK  [movil light]      abre en PDF
OK  [movil light]      el desplegable llega al alto del sistema (44 px) — 44 px
OK  [movil light]      sin desborde horizontal — 0 px
… (idéntico en movil dark, tablet light/dark, escritorio light/dark;
   en escritorio el alto declarado es 40 px y mide 40 px)
RESULTADO: 24/24
```

## Qué se ve en cada una

| Captura | Qué se miró | Observación |
|---|---|---|
| `formato-movil-light.png` | El diálogo entero a 375 px | Entra completo sin desbordar. **La opción más larga se corta contra la flecha** — medido abajo |
| `formato-movil-dark.png` | Lo mismo en oscuro | Mismo corte. El texto del desplegable se lee bien sobre el fondo oscuro; el borde del control se distingue del panel |
| `formato-tablet-light.png` | 768 px | El rótulo entra entero con holgura. El diálogo deja de ser casi pantalla completa y el control queda a lo ancho de la tarjeta |
| `formato-tablet-dark.png` | 768 px oscuro | Sin diferencias con el claro más allá del tono |
| `formato-escritorio-light.png` | 1440 px | El control ocupa el ancho del diálogo; la flecha queda lejos del texto y no hay ambigüedad sobre dónde termina la opción |
| `formato-escritorio-dark.png` | 1440 px oscuro | El botón de acción (menta sobre petróleo) y el texto del desplegable se leen sin esfuerzo; nada queda a media tinta |

## Lo que la foto destapó: dos píxeles, y lo que significan

A 375 px el rótulo más largo **no entra**. Medido con la tipografía calculada
del propio control, no a ojo:

```text
== 375 px ==   select=269px   hueco útil=245px (padding derecho 24px)
   SE CORTA   247px  PDF oficial certificado con código QR
   entra      184px  Archivo JSON interoperable
   entra      217px  Paquete completo (PDF + JSON)

== 768 px ==   hueco útil=510px   → las tres entran
== 1440 px ==  hueco útil=567px   → las tres entran
```

**Se pasa por 2 px.** Sólo una de las tres opciones, sólo a 375, y sólo en el
estado plegado: al abrir la lista el sistema operativo la muestra entera, y el
nombre accesible del control siempre es completo.

Es, igual, un costo real de la conversión y hay que decirlo: **como radios el
rótulo se partía en dos líneas y se leía entero**. Un desplegable no parte
líneas.

### Qué NO se hizo, y por qué

- **No se acortó el rótulo.** La conversión C-21 cambia el control, no lo que
  dice; cambiar la palabra para ganar dos píxeles convierte una corrección de
  forma en una de contenido, que nadie pidió.
- **No se tocó el relleno del `app-select`.** Ese átomo lo montan 34
  plantillas: mover su padding para acomodar un rótulo mío le cambia el ancho
  útil a todas. Es exactamente lo que el encargo prohíbe.

### Qué sí se hizo

La medición subió a `ADR-0013` como advertencia con número: antes de
convertir una lista a desplegable, **medir el rótulo más largo contra el hueco
útil a 375 px**. Es la primera vez que la regla tiene un costo medido y no una
intuición, y los cuatro la van a aplicar sobre listas más largas que la mía.
