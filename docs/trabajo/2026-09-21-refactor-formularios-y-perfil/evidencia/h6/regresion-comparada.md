# H6.S1.M2 — La suite completa, comparada contra el baseline

**Veredicto: PASS. Ningún rojo nuevo.** De los dos rojos previos queda **uno**, el ajeno, y
se comprobó que sigue siendo el mismo defecto y no uno parecido. El propio se cerró en
`H1.S1.M5`.

Commit `4146fcd3`, rama `itzan/separacion-smart-dumb-registros`, árbol limpio. Mismo comando
literal que el baseline: `corepack yarn test --watch=false`. Salida cruda completa en
[`test.txt`](./test.txt).

## 1. Los dos estados, uno al lado del otro

| | Baseline `d76e3054` ([`antes/test.txt`](../antes/test.txt)) | Cierre `4146fcd3` ([`test.txt`](./test.txt)) |
|---|---|---|
| Archivos | `2 failed \| 569 passed (571)` | `1 failed \| 571 passed (572)` |
| Pruebas | `2 failed \| 7085 passed (7087)` | `1 failed \| 7093 passed (7094)` |
| Salida | exit 1 | exit 1 |
| Duración | 162,66 s | 174,91 s |

**Rojos: de 2 a 1.** Ninguno de los dos estados está en verde, y eso ya era así antes de tocar
nada: el exit 1 de este cierre lo produce el **mismo** rojo ajeno que el baseline registró.

## 2. Por qué el total subió — la cuenta, no una impresión

El conteo no se acepta como «subió porque agregué pruebas». Se mide:

```text
$ git diff --stat d40b5631 HEAD -- '*.spec.ts'
 practitioner-profile-view.spec.ts     | 394 +++++++++--------
 practitioner-profile.spec.ts          | 304 +++++++++++++-
 register-imaging-center.spec.ts       |  54 +--
 register-laboratory.spec.ts           |  55 +--
 register-practitioner.spec.ts         |  93 ++---
 politica-de-contrasena.spec.ts        |  36 ++      <- archivo nuevo
 6 files changed, 563 insertions(+), 373 deletions(-)

$ git diff d40b5631 HEAD -- '*.spec.ts' | grep -cE "^\+\s*(it|test)\("   # 26
$ git diff d40b5631 HEAD -- '*.spec.ts' | grep -cE "^-\s*(it|test)\("    # 21
```

| Cuenta | Valor |
|---|---|
| Baseline medido en `d76e3054` | 7 087 |
| Rebase sobre `d40b5631` (#571, 2 pruebas) — nota viva de la §1 del plan | **7 089** |
| Pruebas añadidas por este carril | +26 |
| Pruebas quitadas por este carril | −21 |
| **Esperado** | **7 094** |
| **Medido** | **7 094** |

**Cuadra exacto.** Y el archivo de más también: `politica-de-contrasena.spec.ts` es el único
spec nuevo del carril, y `571 + 1 = 572`.

Las 21 quitadas no son cobertura perdida: son las que **se mudaron de dueño** al separar vista
y contenedor (`H4.S1.M3`, ocho reescritas contra peticiones reales en el contenedor) y las que
el spec del alta de profesional dejó de necesitar al centralizarse la regla.

> **Por qué esta cuenta sí vale, cuando la del navegador no valía.** El hallazgo de `H4.S2.M4`
> —la maqueta regenera sus datos en cada compilación— invalida los conteos tomados **en el
> navegador**, no los de la suite: el número de pruebas lo fija el código fuente, no un dato
> generado. Son dos instrumentos distintos y sólo uno estaba roto.

## 3. Los rojos, uno por uno

### 3.1 `core/mock/handlers/insurance-analytics.handlers.spec.ts:86` — previo y **ajeno**

«handlers de analítica de seguros › con las primas de fábrica del catálogo, el loss ratio ya
viene calculado» · `AssertionError: expected 1 to be +0`

Idéntico al baseline, misma línea y mismo mensaje. Y se volvió a comprobar lo que lo clasifica:

```text
$ corepack yarn test --watch=false --include=src/app/core/mock/handlers/insurance-analytics.handlers.spec.ts
 Test Files  1 passed (1)
      Tests  5 passed (5)
exit=0
```

**Pasa aislado y falla dentro de la suite completa**, exactamente como en `H1.S1.M4`.
Clase `TEST_BUG` (dependencia del orden o de estado compartido entre archivos). El archivo vive
en `core/mock/**`, territorio de Ender: se documenta y **no se toca** (regla 00 §3.2). La causa
concreta sigue sin investigarse, y eso se dice en vez de insinuar que se sabe.

### 3.2 `features/auth/register-practitioner/register-practitioner.spec.ts:2002` — previo y **propio**: cerrado

El baseline lo registraba en rojo por `Timeout in 5000ms` contra la latencia que el backend
simulado impone a propósito. `H1.S1.M5` le puso un tope propio de 20 s con la causa medida, sin
tocar ni una aserción. **En esta corrida no aparece.**

### 3.3 El rojo condicional de los lunes — no aplica

El turno anterior registró un rojo de `accounting/resumen` que falla **sólo los lunes**. Esta
corrida es del martes 2026-09-22: no aparece, igual que en el baseline. Si una corrida futura
cae en lunes y aparece, **no es de este carril**.

## 4. Condiciones de medición

El servidor de desarrollo se detuvo antes de medir y el puerto 4200 quedó libre (riesgo previsto
en la §6 del plan). Una sola suite corriendo, sin build ni navegador en paralelo (regla 70).
No aparecieron `Timeout waiting for worker to respond`, caídas del pool ni errores de
transformación — la contención conocida de esta máquina no contaminó la corrida.

## 5. No cubierto

- Esta corrida es **local**. No dice nada del CI, donde el mismo `typecheck` da rojo por
  `component-index.generated.ts` (HALL-I13, ajeno y anterior).
- Que no haya rojos nuevos **no demuestra que el comportamiento en pantalla sea igual**: eso lo
  tienen que demostrar `H6.S1.M4`, `H6.S1.M5` y las capturas de `H6.S2`.

## 6. Un enmascarado, declarado

`test.txt` y `test-completo.raw.txt` son la salida literal del corredor de pruebas, y su cabecera
imprimía la ruta absoluta del checkout. **Se reemplazó por `<raiz-del-repo-del-front>`** —dos
apariciones en cada archivo, 108 bytes en total— porque una ruta de máquina no es parte de la
evidencia y no tiene por qué viajar en la entrega. **Ninguna otra línea se tocó**: los conteos, los
nombres de archivo y los fallos están tal como salieron.
