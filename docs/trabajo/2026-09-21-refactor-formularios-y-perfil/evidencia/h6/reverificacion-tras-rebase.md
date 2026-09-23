# Re-verificación sobre la base real de la fusión

**Por qué existe este documento.** Toda la evidencia de `H6` se midió en `d40b5631`. Antes de
entregar, `origin/mockup` había avanzado **7 commits**, así que el árbol que se va a fusionar no es
el que se verificó. La regla 30 §4 es explícita: un cambio posterior invalida el peldaño del área
tocada. **Se rebasó y se volvieron a correr los gates**, en vez de entregar con evidencia de un
árbol que ya no existe.

| | Antes | Ahora |
|---|---|---|
| Base | `d40b5631` | **`b655e844`** (*Merge pull request #570*) |
| Punta de la rama | `4146fcd3` | **`88c91da0`** |
| Commits del carril | 4 | 4 (los mismos, reescritos por el rebase) |

## 1 · Antes de rebasar: los 7 commits nuevos no tocan la reserva

```text
$ git diff --name-only d40b5631 origin/mockup -- \
      src/app/features/auth/ src/app/features/account/my-profile/ \
      src/app/shared/components/organisms/paginated-form/ \
      src/app/shared/components/molecules/form-field/
(vacío)

$ git merge-tree $(git merge-base HEAD origin/mockup) HEAD origin/mockup | grep -E "^(<<<<<<<|CONFLICT)"
(vacío)
```

**Ninguno de los siete toca un archivo reservado, y la fusión de prueba no da conflictos.** Por eso
el rebase salió limpio en los cuatro commits, sin resolver nada a mano.

Esto es una condición previa, **no la verificación**: que no toquen mis archivos no prueba que el
árbol combinado se comporte igual. Para eso están los gates de abajo.

## 2 · Lint y typecheck

```text
precondición typecheck: component-index.generated.ts existe, 632 763 bytes

$ corepack yarn lint
exit=0 · bytes de salida: 0

$ corepack yarn typecheck
exit=0 · bytes de salida: 0
```

Idénticos al baseline y a la medición anterior: los dos en `exit=0` y **sin una sola línea**.

> La precondición se repite porque sigue valiendo: ese archivo generado está ignorado por
> `.gitignore:160` y en CI no se genera antes del paso de tipos, así que **este verde es local y no
> dice nada del CI** (hallazgo ajeno y anterior).

## 3 · La suite completa: verde entero, y el número reconciliado

```text
$ corepack yarn test --watch=false
 Test Files  572 passed (572)
      Tests  7107 passed (7107)
   Duration  202.58s
exit=0
```

**Cero fallos.** Y el número no se acepta, se reconcilia:

```text
Medición anterior (base d40b5631 + carril) ....... 7 094 en 572 archivos
Lo que agregan los 7 commits nuevos de la base:
  $ git diff -U0 d40b5631..origin/mockup -- '*.spec.ts' | rg -c "^\+\s*(it|test)\("   → +14
  $ git diff -U0 d40b5631..origin/mockup -- '*.spec.ts' | rg -c "^-\s*(it|test)\("   → −1
  archivos de spec añadidos: 0 · borrados: 0
                                            Esperado   7 094 + 13 = 7 107
                                            Medido                  7 107  ✔
                                            Archivos   572 + 0 = 572 ✔
```

Los dos specs que la base tocó son ajenos al carril: `patients/patient-list/patient-list.spec.ts`
y `medication-block/medication-block.spec.ts`.

### 3.1 El rojo ajeno ya no aparece — y eso **no** significa que esté arreglado

La medición anterior arrastraba un rojo previo y ajeno:
`core/mock/handlers/insurance-analytics.handlers.spec.ts:86`. En esta corrida **no falla**.

**No se declara corregido.** Ese spec ya había demostrado ser **dependiente del orden**: corrido
aislado pasaba (`Tests 5 passed (5)`, `exit=0`) y sólo fallaba dentro de la suite completa. Un
fallo que depende del orden **no se demuestra ausente con una corrida en verde**: lo único
observado es que esta vez el orden no lo disparó.

Lo que sí cambia, y es lo que importa para esta entrega: **el carril no aporta ningún rojo.**

## 4 · Navegador sobre la base nueva

Servidor de desarrollo levantado sobre el árbol rebasado, esperando la compilación **por
condición** (`Application bundle generation complete`), no por reloj.

### 4.1 La matriz de veinte celdas, re-tomada

Mismas cinco altas, mismos dos anchos, mismos dos temas. **Celda por celda, idéntico** a la
medición anterior: desborde horizontal **0 px** en las veinte, campos etiquetados **5/5, 4/4 y 3/3**,
fondos `rgb(255,255,255)` y `rgb(8,22,28)`, y el mismo ruido de consola preexistente (una entrada
en cuatro altas, cero en imagenología). Salida en [`matriz-final.txt`](./matriz-final.txt).

### 4.2 Teclado: igual, con una corrección de método

El recorrido vuelve a dar **7 paradas en orden visual**, los tres obligatorios marcados con su
mensaje bajo su campo, el formulario que no avanza, y `Paso 1 de 10` → `Paso 2 de 10` sin un clic.

El foco al primer error sigue sin moverse: es la deuda `H3.S2.M4`, que esta corrida vuelve a medir
esperando por condición.

> **Y acá el instrumento falló por cuarta vez, en la misma familia de error.** La sonda del anillo
> de foco dio `false` en esta corrida, después de haber dado `true` en la anterior. En vez de
> elegir el resultado que convenía, se midió la **frecuencia**:
>
> ```text
> $ node tmp/sonda-foco-repetido.mjs
> tab:            anillo presente en 5/5
> focus-directo:  anillo presente en 5/5
> ```
>
> **10 de 10.** La diferencia es que esta sonda **espera a que la aplicación hidrate**
> (`window.ng?.getComponent` disponible) antes de tabular; la que falló tabulaba apenas aparecía el
> título, cuando el manejador `handleFocus` (`input.ts:216`) todavía no estaba enganchado.
> El anillo funciona siempre. **Un fenómeno intermitente no se discute: se repite y se cuenta.**

### 4.3 E2E dirigido: un rojo NUEVO, y de quién es

```text
$ corepack yarn pw playwright/file-upload-preview.spec.ts \
      playwright/registro-documento-ayuda.spec.ts --workers=1 --reporter=list
  6 failed        ← eran 5
  8 passed (2.7m) ← eran 9
exit=1
```

El sexto es nuevo respecto de la medición en `d40b5631`:

```text
file-upload-preview.spec.ts:224 › shared picker previews text and audio, and disabled picker rejects drops
  Error: expect(locator).toContainText(expected) failed
  Locator: locator('app-file-input').first().locator('pre')
  Expected substring: "Catálogo de prueba"
  Error: element(s) not found
```

La vista previa de un archivo de texto ya no dibuja su `<pre>`.

#### Clasificación: `TEST_BUG` **previo y ajeno**, dependiente del orden — demostrado, no supuesto

Primero, la pista estructural: `git diff --name-only origin/mockup..HEAD | rg -i "file-input|file-upload"`
devuelve **vacío**. El carril no toca ese átomo. Pero una pista no es una causa, así que se hizo el
A/B — y el primer intento estuvo **mal armado**, lo cual se declara:

| # | Qué se corrió | Dónde | Resultado |
|---|---|---|---|
| 1 | El test **solo** (`--grep "shared picker"`) | base pura `b655e844` | **pasa** (8,8 s) |
| 2 | El test **solo** | mi rama `88c91da0` | **pasa** (10,5 s) |
| 3 | El archivo completo, **un solo spec** | base pura | 5 fallan · el test **pasa** |
| 4 | **Los dos specs**, mismo comando que la corrida original | base pura | **6 fallan · 8 pasan · el test FALLA** |
| — | **Los dos specs** | mi rama | **6 fallan · 8 pasan · el test FALLA** |

**Las dos últimas filas son idénticas.** El rojo aparece **sin el carril**, con el mismo comando.

> **El error de método, dicho en voz alta.** La fila 3 se comparó contra una corrida de **dos**
> archivos: distinto comando, distinta condición. Estuve a punto de concluir «pasa en la base,
> falla en mi rama → es mío» a partir de una comparación despareja. Lo que lo evitó fue mirar el
> comando, no el resultado. La fila 4 es la comparación pareja, y da lo contrario.

**Qué lo causa, hasta donde se observó:** el test pasa aislado y falla cuando corre después del
resto, en las dos ramas. Es contaminación entre pruebas, y **aparece con los 7 commits nuevos de la
base** (en `d40b5631` el mismo comando daba 5 fallos y este test pasaba). **Territorio ajeno**: el
spec y el átomo son de otra persona. **Anotado, no tocado** (regla 00 §3.2).

> Un detalle más, por si le sirve a quien lo tome: en la base los cinco fallos de laboratorio ya no
> mueren en la aserción de consola (línea 131) sino en `expect(failedRequests).toEqual([])`
> (línea 132). El síntoma se movió; la causa sigue siendo del instrumento.

### 4.4 Y el spec vuelve a ensuciar el repo

Correrlo modificó **12 archivos versionados** de `docs/frontend/evidence/file-upload/`. Se
restauraron con `git checkout --` después de cada corrida y el árbol quedó limpio
(`git status --short` vacío, `git clean -nd` vacío). Ninguno viaja en el diff del carril.

## 5 · Veredicto de la re-verificación

**PASS con dos desvíos ajenos declarados.** Sobre el árbol que se va a fusionar:

| Gate | Resultado |
|---|---|
| `lint` · `typecheck` | `exit=0`, sin salida |
| Suite completa | **572 archivos · 7 107 pruebas · 0 fallos**, con el total reconciliado |
| Matriz visual (20 celdas) | desborde 0 · etiquetas 100 % · idéntica a la anterior |
| Teclado | el paso se completa sin mouse · anillo de foco **10/10** |
| E2E dirigido | 8 pasan · **6 rojos, todos reproducidos en la base sin el carril** |

**El carril no aporta ningún rojo, en ninguno de los cinco gates.**

**No cubierto:** los tres specs del perfil siguen saltándose solos contra la maqueta; el quinto
consumidor ajeno de `paginated-form` sigue necesitando una cuenta con otras habilitaciones. Las dos
cosas ya estaban declaradas y el rebase no las cambia.
