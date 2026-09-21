# H5 / H6 — Verificación del artefacto y reejecución de los gates

**Fecha:** 2026-09-20 noche · **Artefacto:** `scheduling-module-v0.1.0-transitional` · corte `5d5007fb`

## H5.S1.M1 — El hash reproduce. La verificación que Pablo dejó a nombre de Itzan: **PASS**

```
cd plan-maestro-2026-09-14/noche-2026-09-19-aislamiento-scheduling/artefacto-h3
find codigo evidencia yarn.lock -type f | sort | xargs sha256sum | sha256sum
21fe553b9a97efc9e42d6468b6e7e4d8b34a4a1952a5e79e2c535f360530594a
```

Idéntico al declarado en el manifiesto. La corrección del hash del `tar` al hash de contenido
cumple lo que tenía que cumplir: el receptor puede recalcularlo.

## La receta del tag necesita TRES fuentes, no una

Importante para quien escriba el mensaje del tag: **`git archive 5d5007fb` por sí solo no
reproduce este hash.** El artefacto son 118 archivos que vienen de tres sitios distintos:

| Parte | Archivos | Fuente |
|---|---|---|
| `codigo/scheduling/` | 99 | `mantra-core-health-api` @ `5d5007fb` → `src/modules/scheduling` |
| `codigo/SQL_41_scheduling/` | 5 | `mantra-core-health-model` → `SQL/41_scheduling` (`diff -rq` vacío) |
| `evidencia/` | 12 | `AlovidaPromptManager` → `docs/trabajo/2026-09-20-aislamiento-scheduling/evidencia/` |
| `yarn.lock` | 1 | `mantra-core-health-api` @ `5d5007fb` |
| `MANIFEST.md` | 1 | el propio artefacto (fuera del hash) |

Verificado que `codigo/scheduling` reproduce desde git: **99 archivos en `git archive
5d5007fb src/modules/scheduling` = 99 en el artefacto**.

**Aviso sobre `evidencia/`:** los 12 archivos que entran en el hash son los de H1 y H2. Esa misma
carpeta del repo del estándar tiene hoy más archivos (los de H4 de esta noche). Quien recalcule
el hash tiene que tomar **esos 12**, no el contenido actual del directorio. Los 12 son:
`H1.S1.M1`, `H1.S1.M2-M4`, `H1.S2.M1-M3-M4`, `H1.S2.M2-M5`, `H1.S3.M1` (×2), `H1.S3.M2-M5`,
`H1.S3.M3-M4`, `H2.S1.M1`, `H2.S1.M2-M3`, `H2.S2`, `H2.S3`.

## H5 — Kill-test del hito: **la evidencia venció**

> «Preguntá qué corrida de regresión respalda este paquete. Si la respuesta es "la de ayer" y
> hubo cambios después, la evidencia venció.»

Hubo cambios después. Entre el corte del artefacto (`5d5007fb`) y `dev` de hoy (`c2c071a4`)
cambiaron **4 archivos dentro del alcance empaquetado**:

```
git diff --stat 5d5007fb..c2c071a4 -- src/modules/scheduling
  ports/agenda-notice-reason.catalog.ts        | 211 +++  (nuevo)
  ports/agenda-notice-reason.catalog.spec.ts   | 120 +++  (nuevo)
  services/scheduling-bookings.service.ts      |  46 +++
  services/scheduling-bookings.service.spec.ts | 129 +++
```

Los trajeron `572e7d2d` (catálogo de razones de `emit()`, carril de Justin) y `9ff1542d` (una
cita ajena ya no se lee, se cancela ni se reprograma — fix de autorización).

**Veredicto H5.S1.M1: la versión empaquetada y la de la regresión NO coinciden.** La regresión
de contrato en tres niveles (`test/integration/agenda-notice-contract-regression.int-spec.ts`,
carril de Pablo) vive en `c2c071a4`; el paquete es de `5d5007fb`.

**No se reempaqueta**, porque la decisión de coordinación lo dice explícitamente («El artefacto
queda como está, con su A1 en `FAIL` declarado»). Se declara el desfase en lugar de taparlo: el
paquete v0.1.0 documenta el estado del corte, no el `dev` de hoy.

## H6 — Gates reejecutados

| Gate | Qué prueba | Estado | Por qué |
|---|---|---|---|
| A1 | Mapa de resolución sin vecino | **FAIL** | Sin cambio: el artefacto conserva los imports a `messaging` y `community`. Lo arregla el binding port-only, que es tarjeta del próximo turno |
| A2 | Typecheck/build delimitado | **FAIL** | Sin cambio (H2.S2.M1, exit 2) |
| A3 | Arranque propio + cierre limpio | `NOT_RUN` | Bloqueado por A2 |
| A4–A6 | Aceptación local | `NOT_RUN` | Bloqueado por A3 |
| A7 | Sin secretos | **PASS** | Sigue válido: el contenido empaquetado no cambió (hash idéntico) |
| A8 | Sin datos reales | **PASS** | Ídem |
| — | Hash reproducible | **PASS** | Nuevo: verificado esta noche |
| — | Regresión vigente | **FAIL** | Nuevo: el kill-test de H5, arriba |

A7 y A8 **no son evidencia heredada sin justificación**: se sostienen porque el hash del
contenido es bit a bit el mismo que cuando se corrieron. Eso es precisamente para lo que sirve
el hash reproducible.

## El camino para que A1 y A2 pasen ya existe, y no hay que inventarlo

`test/lab/agenda-notice-capability.lab.ts` (carril de Pablo, `#444`) trae `PortOnlyNoticeAdapter`:
implementa `AgendaNoticePort` **sin importar `messaging` ni `community`** — verificado, sus
únicos imports son `dotenv/config`, `node:crypto`, `pg` y los tipos del puerto.

Es la prueba de que el binding port-only es viable. Cambiar la resolución de `AGENDA_NOTICE_PORT`
a un adaptador así convierte A1 y A2 de `FAIL` a `PASS` y mueve el estado de
`TRANSITIONAL_ISOLATION` a aislado para esos dos vecinos. Es la tarjeta del próximo turno, con
reparto ya definido: composición Itzan (`scheduling.module.ts` está reservado), adaptador Justin,
validación Ender contra `AgendaNoticePort v1.0.0`.

**No se hizo esta noche** porque es alcance de otra tarjeta, no porque no se pudiera.
