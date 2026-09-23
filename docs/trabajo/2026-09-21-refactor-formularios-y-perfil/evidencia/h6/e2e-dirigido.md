# H6.S1.M4 — E2E dirigido a lo que el carril tocó

Commit `4146fcd3`, maqueta, `--workers=1` (la configuración del repo ya lo fija en
`playwright.config.ts:34`; se pasa igual explícito). Servidor de desarrollo propio: el proyecto
**no declara `webServer`** en la configuración, así que la app se levanta aparte y se espera a que
termine de compilar **por condición**, no por reloj.

## 0. Qué se eligió correr, y por qué esos

No «los specs que pasan cerca», sino los que ejercitan **lo que el diff cambió**:

| Spec | Qué del carril ejercita |
|---|---|
| `file-upload-preview.spec.ts` | Los adjuntos de laboratorio e imagenología: la familia A unificada y el código muerto retirado en `H3.S1.M7` |
| `registro-documento-ayuda.spec.ts` | El alta de paciente y la de profesional |
| `carril-05-perfil-doctor.spec.ts` | La ficha del profesional: la vista separada en `H4` |
| `alv-perfil-medico.spec.ts` | El perfil y el alta |

## 1. Tanda A — los registros

```text
$ corepack yarn pw playwright/file-upload-preview.spec.ts \
      playwright/registro-documento-ayuda.spec.ts --workers=1 --reporter=list
  5 failed
    file-upload-preview.spec.ts:80 › laboratory: drag, PDF, images and layout at 390px
    file-upload-preview.spec.ts:80 › laboratory: drag, PDF, images and layout at 768px
    file-upload-preview.spec.ts:80 › laboratory: drag, PDF, images and layout at 1024px
    file-upload-preview.spec.ts:80 › laboratory: drag, PDF, images and layout at 1440px
    file-upload-preview.spec.ts:80 › laboratory: drag, PDF, images and layout at 1920px
  9 passed (2.7m)
exit=1
```

**Los cinco fallos son el mismo test a cinco anchos**, y **ninguno falla por los adjuntos**: los
cinco mueren en la misma línea, que es la aserción de consola.

```text
file-upload-preview.spec.ts:131
> expect(unexpectedConsole).toEqual([])
  Received + 2:
    "Executing inline script violates the following Content Security Policy directive
     'script-src 'self' 'sha256-Ohy6Wz7NFFGmQaVW/a8g5BXylUJrN/hbRM2QuMglZ6Q='
     'sha256-HasAYtZ13nA92vtyhOH9KYrQLVFmnxB9+lraZXpGRQc=''. …"  (×2, distinto hash sugerido)
```

Los nueve que pasan incluyen lo que de verdad ejercita la regla que el carril tocó: el rechazo que
conserva el archivo, la navegación que restaura las vistas previas, el quitar que devuelve la
validación de obligatorio, y el selector heredado por imagenología.

## 2. La clasificación, demostrada con un A/B (regla 80.4)

La pista era fuerte, pero una pista no es una causa. Se comprobó devolviendo **el archivo que ese
test ejercita** al commit del corte y corriendo el mismo test, mismo ancho:

```text
$ git checkout d40b5631 -- src/app/features/auth/register-laboratory/
  2 files changed, 22 insertions(+), 96 deletions(-)      ← el código de ANTES del carril
$ corepack yarn pw playwright/file-upload-preview.spec.ts --workers=1 --grep "layout at 1440px"
  1 failed
  → mismos dos mensajes de CSP, misma línea 131
exit=1
```

**Con el código anterior falla exactamente igual. No es regresión de este carril.**

**Clase: `TEST_BUG`, previo y ajeno.** La causa está en el instrumento, no en el producto: el spec
filtra los errores conocidos comparando el **mensaje completo** contra un baseline versionado
(`docs/frontend/evidence/file-upload/baseline/console.json`, escrito el 2026-09-09 en `3ce6f5d2`,
de otra persona). Ese archivo guarda los hashes `VM2mZqy…`, `HasAYtZ…` y `+V6QP2X…`, pero **no
`Ohy6Wz7NFFGmQaVW…`**, que es el que la política de la app nombra hoy dentro del mensaje. Como
`includes()` exige igualdad del texto entero, el filtro no casa nunca y los dos errores conocidos
se cuentan como inesperados.

Que el mensaje de hoy ya traía `Ohy6Wz7…` **antes de este carril** está registrado en el baseline
propio del 2026-09-22, tomado sin un solo cambio en el árbol (`evidencia/antes/rutas.md`). Y el
diff del carril **no toca `index.html`** ni nada que defina la política:
`git diff --name-only d40b5631 HEAD -- src/index.html` devuelve vacío.

**No se corrige** (regla 00 §3.2): el spec y su baseline son de otra persona y viven en la carpeta
de evidencia del repo. Queda anotado.

## 3. Hallazgo ajeno: ese spec escribe dentro del repo al correr

`file-upload-preview.spec.ts` **reescribe 14 capturas versionadas** de
`docs/frontend/evidence/file-upload/` (`laboratory-*.png`, `pdf-*.png`, `dark-preview.png`,
`imaging-center.png`, `text-preview.png`, `video-preview.png`) además de un `manifest-<ancho>.json`
por cada ancho. Correr el gate ensucia el árbol de trabajo de quien lo corra.

Se restauraron con `git checkout --` y se verificó que el árbol quedara limpio; **ninguna de esas
capturas viaja en el diff de este carril**. Anotado, no corregido: es territorio ajeno.

## 4. Tanda B — el perfil: los tres specs se saltan solos

```text
$ corepack yarn pw playwright/carril-05-perfil-doctor.spec.ts \
      playwright/alv-perfil-medico.spec.ts --workers=1 --reporter=list
Running 3 tests using 1 worker
  -  1 alv-perfil-medico.spec.ts:80 › carga un consultorio propio, persiste al recargar…
  -  2 carril-05-perfil-doctor.spec.ts:55 › la doctora ve su trayectoria, sus credenciales…
  -  3 carril-05-perfil-doctor.spec.ts:126 › «Ver cómo me ven» navega a la vista previa…
  3 skipped
exit=0
```

**Ninguno se ejecutó.** No es una elección: el propio spec se salta cuando el origen de datos real
no responde (`test.skip(!viva, 'La API no responde: el perfil no tiene de dónde salir.')`,
`carril-05-perfil-doctor.spec.ts:52`). Contra la maqueta, esos tres no ejercitan nada. **`SKIP`,
no `PASS`** — un verde de tres pruebas saltadas no es evidencia de nada, y `exit=0` acá engaña.

> **Dos afirmaciones de esos specs que hoy el producto ya no cumple**, detectadas al leerlos y
> **no verificadas por ejecución** porque no llegan a correr: esperan la pestaña «Vista previa del
> perfil público» (`:76`) y un enlace «Ver cómo me ven» hacia `/my-account/preview` (`:132`). Las
> dos cosas se quitaron **fuera de este carril** —`f70d6580` (28/08) y `0e3da9fc` (10/09,
> «sacar la configuración del perfil público de todos lados»)—, y hoy ni el texto ni la ruta
> existen en el repo. Queda anotado para quien corra esos specs con el origen real: van a dar rojo
> por deuda ajena, no por este trabajo.

## 5. La foto: el hueco que `H4` entregó, cerrado — y un instrumento que mentía

`H4.S2.M4` dejó esto explícito: la subida de foto no se pudo ejercitar con dos instrumentos, se
demostró que era idéntico antes y después, y **se entregó a esta microtarea**. Acá se cerró, y el
resultado **da vuelta la lectura anterior**.

### 5.1 Lo que se midió

```text
$ node tmp/sonda-foto-aislada.mjs
1 · entrada: {"existe":true,"tipo":"file","accept":"image/*","deshabilitada":false,"archivos":0,"idDeLaEtiqueta":1}
2 · lo que vio el evento change: change con 1 archivo(s)
3 · subirFoto llamado          → 0 peticiones, ningún mensaje

$ node tmp/sonda-foto-estado.mjs
1 · antes:  {"fotoSubiendo":false,"errorDeFoto":"","fotoRecien":null,
             "perfilProfesional":"be0f3a66-…","vistaEsPropio":true,"vistaPreview":false}
2 · después:{"fotoSubiendo":false,"errorDeFoto":"","fotoRecien":"data:application/octet-stream;base64,…",
             "perfilProfesional":"be0f3a66-…","vistaEsPropio":true,"vistaPreview":false}
```

**`fotoRecien` pasa de `null` a tener valor.** Esa señal **sólo** se escribe al final del ciclo de
subida. Así que el camino corre entero: ninguna de las guardas lo corta, el perfil profesional
existe, la vista está en modo propio y la subida se resuelve.

### 5.2 Las tres cosas que `H4` dio por ciertas y no lo eran

| Lo que decía `H4.S2.M4` | Lo que se demostró acá |
|---|---|
| «No sale ninguna petición» | **El instrumento no podía verlas.** El backend simulado es un `HttpInterceptorFn` (`core/mock/mock-backend.interceptor.ts:44`), no un servidor: responde **dentro** de Angular y **nada llega a la capa de red** que la sonda observaba. Cero peticiones es el valor esperado para *cualquier* operación de la maqueta |
| «El manejador corre» (deducido de que la entrada queda en 0 archivos) | Cierto, **pero mal deducido**: 0 archivos también es compatible con «nunca se asignó nada». Ahora está medido directo, con un espía puesto **antes** del evento: `change con 1 archivo(s)` |
| «No se sabe si falla el producto o la emulación del diálogo de archivo» | **Ninguno de los dos.** El diálogo entrega el archivo y el producto completa la operación |

### 5.3 Lo que sí falla, y de quién es

Lo que vuelve **no es una imagen**. Decodificado, el `data:` URL contiene un **sobre JSON**:

```json
{"body":"data:image/svg+xml;utf8,%3Csvg…%3EVR%3C%2Ftext%3E%3C%2Fsvg%3E",
 "headers":{"Content-Disposition":"attachment; filename*=UTF-8''avatar.svg"}}
```

Dos cosas a la vez: el contenido viaja **envuelto en un sobre `{body, headers}`** y etiquetado
`application/octet-stream`, así que ningún `<img>` puede dibujarlo; y lo que trae **no es la foto
subida**, sino el avatar por defecto con las iniciales. Ese sobre lo arma el manejador de archivos
del backend simulado (`core/mock/handlers/files.handlers.ts`).

**Territorio ajeno** (`core/mock/**`): se documenta y **no se toca** (regla 00 §3.2). Y **no es de
este carril**: `H4.S2.M4` ya había comprobado que el comportamiento observable era idéntico con los
archivos devueltos al commit anterior.

**Veredicto de la foto: el camino del producto queda ejercitado de punta a punta y responde. Lo que
impide ver la imagen es el dato que devuelve la maqueta.**

## 6. Veredicto y no cubierto

**PASS con desvíos declarados.** El E2E dirigido a los registros corrió y **no introdujo ningún
rojo nuevo**: los cinco fallos son previos y ajenos, demostrados con un A/B contra el commit del
corte. El camino de la foto quedó cerrado por observación directa, con su causa aislada.

**No cubierto:**

- Los tres specs del perfil, que sólo se ejercitan con el origen de datos real disponible.
- **La foto vista como imagen**: que la persona vea su retrato nuevo no se puede observar mientras
  la maqueta devuelva ese sobre. Lo que sí quedó demostrado es todo lo anterior a ese punto.
- Retirar un título: sigue sin haber ninguno pendiente en los datos de esta compilación, igual que
  en `H4`. La regla la fijan cuatro pruebas dirigidas.
