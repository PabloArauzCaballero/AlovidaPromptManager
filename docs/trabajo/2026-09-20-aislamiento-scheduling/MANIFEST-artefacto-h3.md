# MANIFEST — artefacto MODULE `scheduling` (piloto de avisos, aislamiento)

## H3.S1.M1 — Contenido

- `codigo/scheduling/` — código fuente completo del módulo (controllers, dto, entities,
  repositories, services, ports, adapters, state, policies, notices) tal como está en
  `dev` a este corte. **NO** es la versión con messaging/community retirados (esa era una
  copia de prueba en `mantra-core-health-api-copia-noche-h2`, destinada a destruirse).
- `codigo/SQL_41_scheduling/` — DDL propio (`01_schema.sql`…`90_fk_deferred.sql`), 17 tablas.
- `yarn.lock` — lockfile completo del repo de origen (no hay lockfile propio de la capacidad;
  el proyecto no es un monorepo con workspaces).
- `evidencia/` — toda la evidencia de H1 y H2 (imports, clasificación, ORM, baseline Docker,
  roles, retiro de vecinos, gates, veredicto).
- Este `MANIFEST.md`.

Conteo verificado: `find . -type f | wc -l` → 117 archivos (código + evidencia + lockfile + manifiesto).

## H3.S1.M2 — Versión, hash, commit de origen

- **Versión:** `scheduling-module-v0.1.0-transitional` (primera versión, sin publicación remota
  ni merge a `dev` — cumple la nota de la propia microtarea).
- **Commit de origen:** `5d5007fbdb7916b124010bbfbb560b7bb3aabc06` (rama `dev`,
  `mantra-core-health-api`, incluye el merge de MCH-008.2 #442).
- **Hash del contenido** — reproducible, independiente de fechas y permisos:
  ```
  find codigo evidencia yarn.lock -type f | sort | xargs sha256sum | sha256sum
  ```
  `21fe553b9a97efc9e42d6468b6e7e4d8b34a4a1952a5e79e2c535f360530594a`

  > Corrección: la primera versión de este manifiesto declaraba el sha256 de un `tar`,
  > que incluye fechas y permisos en el flujo. Ese valor NO se reproduce después de copiar
  > el artefacto, con lo cual no servía para lo único que un hash tiene que servir: que
  > quien lo recibe verifique que tiene lo mismo. El hash de arriba sí se reproduce.

## H3.S1.M3 — Mapa de resolución

> **Addendum 2026-09-20 — esta sección quedó desactualizada y se corrige acá.** Abajo se afirma
> que *«no hay una versión hoy que cumpla a la vez "compila" y "no apunta a ningún vecino"»*.
> **Ya la hay**: `test/lab/port-only-notice.adapter.ts` del carril de Pablo, con 11/11 en los tres
> niveles del contrato. Medido de nuevo, el conjunto residual hacia los proveedores retirados son
> **5 líneas en 3 archivos**, y las 5 cuelgan de una sola decisión de composición
> (`scheduling.module.ts:142`). Con el binding port-only, el CA se cumple. La microtarea pasa de
> `FAIL` a `HECHO (simulado)`. Medición completa:
> `evidencia/H3.S1.M3-mapa-de-resolucion-corregido.md`.
>
> Lo de abajo **se conserva sin tocar**: era correcto cuando se escribió y es el registro de lo que
> se midió ese día. Lo que caducó es la conclusión, no la observación.

**No cumple el CA literal** ("ninguna ruta apunta al proveedor retirado"): este artefacto
empaqueta el código **real** de `scheduling` (no la versión con vecinos retirados), así que
SÍ contiene imports que apuntan a `messaging` y `community`:

| Archivo del artefacto | Import | Apunta a |
|---|---|---|
| `codigo/scheduling/scheduling.module.ts:60` | `'../messaging/messaging.module'` | `messaging` (fuera del artefacto) |
| `codigo/scheduling/scheduling.module.ts:64` | `'../community/community.module'` | `community` (fuera del artefacto) |
| `codigo/scheduling/adapters/messaging-agenda-notice.adapter.ts:6` | `'../../messaging/services'` | `messaging` (fuera del artefacto) |
| `codigo/scheduling/adapters/support-admin-notice.adapter.ts:9-10` | `'../../community/services'`, `'../../community/community.concepts'` | `community` (fuera del artefacto) |

También quedan referencias a `clinical` (repositorios `AppointmentsRepository`,
`EncountersRepository`) que tampoco viajan en el artefacto.

**Registrado, no silenciado**: empaquetar la versión sin esas fuentes (la de
`copia-noche-h2`) no compila (H2.S2.M1, exit 2) — no hay una versión hoy que cumpla a la vez
"compila" y "no apunta a ningún vecino". Por eso el estado del paquete es `TRANSITIONAL_ISOLATION`
(H3.S3.M1), no un módulo aislado. Empaquetar código roto solo para cumplir el CA literal sería
peor evidencia que declarar la dependencia.

## H3.S2 — Escaneo

**H3.S2.M1 — Secretos:** sin coincidencias.
```
find . -iname "*.env*" -o -iname "*credential*" -o -iname "*.pem" -o -iname "*.key"
  -> codigo/scheduling/notices/agenda-notices.env.ts (loader de variables de entorno, no un
     archivo .env con valores — se revisó el contenido, son `process.env.X` sin valores)
grep -rniE "password\s*[:=]...|secret\s*[:=]...|api[_-]?key...|postgres(ql)?://...@|AKIA...|-----BEGIN" codigo yarn.lock
  -> 0 coincidencias
```

**H3.S2.M2 — Datos reales de personas:** sin coincidencias.
```
grep -rniE "[a-z0-9._%+-]+@(gmail|hotmail|yahoo|outlook)\.[a-z]{2,}" codigo -> 0
grep -rniE "[0-9]{7,8}-[0-9kK]\b" codigo -> 0
```
Los datos de los `*.spec.ts` empaquetados son los fixtures sintéticos ya existentes en el
repo (nombres/UUIDs de prueba), no datos de producción ni del corpus MeSH.

## H3.S3 — Estado honesto

**H3.S3.M1 — Estado de entrega:** `TRANSITIONAL_ISOLATION`.
Evidencia que lo respalda: `evidencia/H2.S3-veredicto-honesto.md` (manifiesto completo de
dependencias residuales: `clinical`, `messaging`, `community`) y `evidencia/H2.S2-gates-en-la-copia.txt`
(FAIL del build delimitado al retirar los vecinos).

**H3.S3.M2 — Gates A1–A8:**

| Gate | Qué prueba | Estado |
|---|---|---|
| A1 | Mapa de resolución sin vecino | **FAIL** (documentado arriba, no se disfraza) |
| A2 | Typecheck/build delimitado | **FAIL** (H2.S2.M1, exit 2, ver evidencia) |
| A3 | Arranque propio + cierre limpio | `NOT_RUN` (bloqueado por A2) |
| A4–A6 | Aceptación local (laboratorio de Pablo) | `NOT_RUN` (bloqueado por A3) |
| A7 | Sin secretos | **PASS** (H3.S2.M1) |
| A8 | Sin datos reales | **PASS** (H3.S2.M2) |

No cubierto: A3–A6 nunca se ejecutaron porque A2 ya había fallado — no hay evidencia
fabricada ni heredada de otra versión para esas filas.
