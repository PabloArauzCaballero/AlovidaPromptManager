# Manifiesto — `scheduling-module-v0.1.1-transitional` (artefacto final, H6.S2.M1)

> **Sucede a `v0.1.0-transitional`.** No lo reemplaza ni lo invalida: aquél sigue siendo la foto
> del corte `5d5007fb`. Éste es la versión sobre la que se reejecutaron los gates de H6.

- Fecha: 2026-09-20 · Origen: `mantra-core-health-api` @ `origin/dev`
- Árbol de `src/modules/scheduling`: `61304e7dcb709dc80f7c4c2aef864ff6a8c6c21c`
- Evidencia literal con comandos y salidas: `evidencia/H6.S2.M1-artefacto-final-v0.1.1-hash.txt`

## 1. Identidad

| Identidad | Valor | Cubre |
|---|---|---|
| **Código entregable** (la que conviene fijar) | `4f1daac2d46b5cf3a0d762fa9b7803a4715652e3af2603545ba0714e4aa5ad06` | `codigo/` + `yarn.lock` — 107 archivos |
| Paquete completo | `0166b211ab32786ef4423f20fa5b21237ddead200d273db108598b9f65a7248a` | `codigo/` + `evidencia/` + `yarn.lock` — 144 archivos |
| Árbol git del módulo | `61304e7dcb709dc80f7c4c2aef864ff6a8c6c21c` | sólo `src/modules/scheduling` |

**Las dos primeras se verificaron en dos reconstrucciones independientes desde cero: idénticas.**

**Por qué hay dos.** La del paquete completo usa la misma receta que `v0.1.0` y por eso es
comparable con ella, pero **se mueve cada vez que se agrega un archivo de evidencia**. La del
código entregable no. Quien fije este módulo en una relación de dependencias debería fijar
`4f1daac2…`.

## 2. Contenido

| Parte | Archivos | Qué es |
|---|---:|---|
| `codigo/scheduling/` | 101 | El módulo completo, desde `origin/dev` |
| `codigo/SQL_41_scheduling/` | 5 | DDL propio: `01_schema.sql` … `90_fk_deferred.sql`, 17 tablas |
| `yarn.lock` | 1 | Lockfile del repo de origen (la capacidad no tiene uno propio) |
| `evidencia/` | 37 | Las salidas de los seis hitos |
| **Total en el hash del paquete** | **144** | |

## 3. Qué cambió respecto de `v0.1.0-transitional`

**Sólo por agregado.** 4 archivos, **506 inserciones, 0 borrados** (`evidencia/H5.S1.M1-desfase-medido-contra-dev.txt`):

| Archivo | Cambio |
|---|---|
| `ports/agenda-notice-reason.catalog.ts` | **nuevo** (211 líneas) — catálogo de razones de no-entrega |
| `ports/agenda-notice-reason.catalog.spec.ts` | **nuevo** (120 líneas) |
| `services/scheduling-bookings.service.ts` | +46 |
| `services/scheduling-bookings.service.spec.ts` | +129 |

Y lo que **no** cambió, verificado byte a byte:

- **El contrato del puerto** — blob `4e262747735005c16262a907de3caf09a1268923`, idéntico al corte.
- **La composición** — `scheduling.module.ts`, idéntico al corte.

Por eso la etiqueta es `v0.1.1` y no `v0.2.0`: **ningún consumidor del puerto se rompe**.

## 4. Por qué el hash es de contenido y no de un `tar` — demostrado

El mismo contenido, empaquetado dos veces, da dos `tar` distintos:

```text
copia 1 → 3c63e9ed4140a3a378ca42b3b58b8b85557c0cda9372e5540d6bfb48cfdb97df
copia 2 → 1e0a53ef9766117c88e72cb9b70cfca8b2e7943623996c5260915cea09a65f07
```

El `tar` arrastra fechas y permisos. El hash de contenido, con las mismas dos copias, da el mismo
valor. Era la corrección que `v0.1.0` ya traía anotada; acá queda **medida**, no afirmada.

## 5. Gates sobre este artefacto

| Gate | Resultado |
|---|---|
| **A7** — secretos en `codigo/` + `yarn.lock` | **PASS** — 0 coincidencias |
| **A8** — correos personales en `codigo/` | **PASS** — 0 |
| **A8** — documentos de identidad en `codigo/` | **PASS** — 0 |
| **A7/A8** sobre `evidencia/` (no estaba en `v0.1.0`) | **PASS** — 0 / 0 / 0 |
| **Hash reproducible** | **PASS** — dos reconstrucciones independientes, idénticas |
| **Typecheck del módulo** (binding port-only) | **PASS** — 0 errores dentro de `scheduling/`, contra 5 sin él |
| **Aceptación local** | **PASS** — 29/29 integración + 467/467 unitarios |
| **A1** — el artefacto no apunta fuera de sí | **FAIL con la composición actual**, **PASS con el binding port-only** (`evidencia/H3.S1.M3-mapa-de-resolucion-corregido.md`) |

## 6. Estado de entrega: sigue siendo `TRANSITIONAL_ISOLATION`

Calcular el hash no aisló nada. Lo que sigue en pie, sin maquillar:

1. **`clinical` sigue siendo dependencia residual** (`AppointmentsRepository`, `EncountersRepository`).
   Es la ambigüedad `Q-I2`, registrada y sin resolver — quedó fuera de alcance a propósito.
2. **El binding del producto no se tocó.** `scheduling.module.ts` es archivo reservado y el cambio
   depende de `Q-06`, que es decisión de negocio.
3. **Las 5 líneas hacia `messaging`/`community` están en este artefacto igual que en el anterior.**
   Lo que se demostró es que salen todas de una sola decisión de composición, no que ya no estén.

## 7. Nota sobre la decisión de coordinación

Coordinación decidió **no reempaquetar**, y esa decisión se respeta: **no se publicó ningún paquete
nuevo**, no hay tarball, no hay directorio `artefacto-h3/` actualizado ni nada que reemplace al
artefacto vigente. Lo que este manifiesto entrega es la **identidad verificable** de la versión
final, calculada desde `git` y reproducible por cualquiera con los comandos de §1 — que era el
entregable de `H6.S2.M1`. La decisión prohibía reempaquetar; no prohibía saber cuánto vale el hash.
