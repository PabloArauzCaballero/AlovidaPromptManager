# H4.S2 — Que la plantilla describa la interfaz

Las tres primeras microtareas de `H4.S2` sobre `practitioner-profile-view.html` (1 413 líneas) y
`practitioner-profile.html`. Dos de las tres se cumplían **ya**; lo valioso de medirlas es poder
decirlo con el comando en la mano en vez de suponerlo.

## 1 · `H4.S2.M1` — los cálculos de dominio salen de la plantilla

Se barrió la plantilla buscando expresiones que **decidan una regla** —no que elijan un texto o
comprueben un vacío—. Aparecieron **dos**, y una de ellas estaba escrita dos veces.

### La regla que vivía dos veces, con dos redacciones

«Un título se puede retirar sólo mientras sigue pendiente» se decidía en los dos dibujos de la
ficha, y **no decían lo mismo**:

| Dónde | Cómo estaba escrita | Qué le faltaba |
|---|---|---|
| Dibujo propio (`:611`) | `@if (estudio.sello === 'in-review')` | «sólo el dueño» — quedaba implícita en un `@if` de más arriba |
| Dibujo de la Guía (`:1167`) | `@if (esPropio() && estudio.sello === 'in-review')` | nada |

Dos redacciones de la misma regla es una que se puede corregir sin la otra. Ahora vive una sola vez,
en `practitioner-profile-view.ts`:

```ts
protected sePuedeRetirar(estudio: FormacionVisible): boolean {
  return this.esPropio() && estudio.sello === 'in-review';
}
```

**Se eligió deliberadamente la unión exacta de lo que las dos decían, y no la regla «mejor».**
Añadirle `!previewMode()` habría sido más coherente con lo que ese input promete —suprimir toda
acción de escritura— pero habría **cambiado comportamiento**, y esta microtarea nombra reglas, no
las corrige. Ver el hueco declarado en §4.

### La condición de cinco términos que decidía si aparece «Tus datos»

```html
@if (datos.documento || datos.telefono || datos.correo || datos.domicilio || datos.edad !== null)
```

Pasó a `tieneDatosDeFiliacion`, un `computed`. El detalle que la hacía frágil y que ahora está
escrito donde se lee: **`edad` se compara contra `null` y no se evalúa como verdadera**. Es la única
de las cinco que puede ser un número, y un `0` legítimo haría desaparecer la sección entera con el
resto de los datos adentro.

### Lo que NO se movió, y por qué

| Expresión | Dónde | Por qué se queda |
|---|---|---|
| `perfil().formacion.length > 0` y sus hermanas | 8 sitios | Es una comprobación de vacío, no una regla: decide qué dibujo va, no qué es cierto |
| `estudio.vencida ? 'venció' : 'vence'` | `:604`, `:1159` | Elige el tiempo verbal de una palabra a partir de una bandera **ya calculada** por el contenedor |
| `perfil().especialidadPrincipal && perfil().especialidades.length === 0` | `:776` | Es un repliegue de maquetación —el renglón de texto sólo si no hay insignias— con su comentario al lado |
| `credenciales().verificados.length` | `:1233` | Una cifra para un rótulo |

## 2 · `H4.S2.M2` — identidad estable en las colecciones

**Se cumplía ya, y ahora está medido.** Los **quince** `@for` de la ficha llevan `track` por
identidad: catorce por `id` y uno por `clave` (los contadores de actividad, cuya clave es su nombre).

```text
$ git grep -n 'track $index' -- 'src/app/features/account/my-profile/practitioner-profile/*'
(sin coincidencias)
```

Importa acá más que en una lista cualquiera: la trayectoria y las credenciales se reordenan al
alta y a la baja, y con el índice como identidad Angular reusaría el nodo equivocado — el sello de
un título aparecería sobre otro.

## 3 · `H4.S2.M3` — ningún evento hace tres cosas

Inventario completo de los enlaces de evento de los dos archivos: **quince**, y cada uno llama a
**una** operación con `$event` como mucho.

| Enlace | Veces | Qué llama |
|---|---|---|
| `(fileDropRejected)="alRechazarArchivo($event)"` | 2 | una |
| `(change)="alElegirFoto($event)"` | 2 | una |
| `(selectedIndexChange)="alCambiarPestana($event)"` | 2 | una |
| `(clicked)="alPedirRetiro(estudio)"` | 2 | una |
| `(added)="trayectoriaCambio.emit()"` | 3 | una |
| `(retry)`, `(trayectoriaCambio)`, `(fotoElegida)`, `(credencialARetirar)`, `(pestanaVisible)` | 1 c/u | una |

**Los tres `(added)="trayectoriaCambio.emit()"` se miraron y se dejaron.** Reemitir una salida desde
la plantilla es crudo, pero es **una** operación y su intención se lee entera en el renglón;
envolverla en un método agregaría un salto sin agregar significado.

`H4.S1` mejoró este número sin proponérselo: `(fileDropRejected)="errorDeFoto.set($event)"`
escribía una señal **desde la plantilla**, que es peor que hacer tres cosas — es hacer una que no
debería poder hacerse. Hoy llama a un manejador con nombre.

## 4 · Hueco declarado, NO corregido

`previewMode` promete «suprimir toda acción de escritura aunque `esPropio` llegue en `true`». El
botón «Retirar» del dibujo de la Guía **no lo respeta**: su guarda nunca lo miró, y con
`previewMode=true` y `esPropio=true` ese botón aparecería.

- **Es inalcanzable hoy**: nadie pasa `[previewMode]` en todo el repo (ver la corrección del
  contrato de `H4.S1.M2`).
- **Y es inofensivo**: `alPedirRetiro` sí comprueba `previewMode` antes de emitir, así que el botón
  no haría nada. Sería un botón muerto en un modo que nadie usa.

Se anota, no se arregla (regla 00 §3.2): corregirlo es cambiar comportamiento, y este bloque de
microtareas nombra reglas.

## 5 · No cubierto

- `H4.S2.M4` —comparar el comportamiento contra el recorrido de `H1.S2`— es aparte y va en el
  navegador.
- No se barrieron las plantillas de los cuatro componentes hijos de la ficha
  (`credentials-panel`, `practitioner-activity`, `practice-sites-map`, `activity-chart`): el
  contenedor elegido en `H4.S1.M1` es la ficha, no su árbol entero.
