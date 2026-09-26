# M5 · Laptop Justin — daily de máquinas, 2026-09-26

> **AVANCE: 15 / 15 microtareas — 100 %.**
> **`A MEDIAS` cuenta como no hecho. `DESCARTADO` no suma: se declara aparte con su motivo.**

- **Encargo:** ver la carpeta de al lado · **Reparto:** [`Daily-Maquinas-2026-09-26.md`](../Daily-Maquinas-2026-09-26.md)
- **Estado:** `HECHO` (15/15) · **Peldaño:** `VERIFIED` en los tres hitos

Front: la salida del simulador. El build de producción contra la API real, el simulador
honesto y el enrutado de producción.

## Hitos

| ID | Hito | Estado |
|---|---|---|
| H1 | Existe un artefacto de producción que habla con la API real | `HECHO` |
| H2 | El simulador deja de esconder las brechas | `HECHO` |
| H3 | El enrutado de producción no miente con 200 | `HECHO` |

## Salida de la instalación del estándar

```text
$ ls .claude/skills | wc -l
179
$ ls .claude/rules/[0-9]*.md | wc -l
15
$ python .claude/hooks/plan_gate.py --self-test
plan_gate self-test: 11 PASS, 0 FAIL
```

## Bitácora

| Hora | Qué pasó | Peldaño |
|---|---|---|
| 01:00 | Worktree `wt-m5-build-real` desde `origin/test` @ `ec7037f7`; `node_modules` simbólico desde el checkout principal (mismo `package.json`/`yarn.lock`) para no duplicar 21 M de instalación con 15 GB libres | `DISCOVERED` |
| 01:15 | Leídos BR-01/BR-02/BR-03 del informe de brechas del 2026-09-24: mismo alcance que H1-H3, con línea y archivo exactos — se usaron como referencia factual, no se implementó su alcance completo (ver decisiones en el `REPORTE.md` del carril) | `DISCOVERED` |
| 01:40 | `environment.production-api.ts` + `angular.json` + `Dockerfile` + cartel/interceptor/media condicionados | `WRITTEN` |
| 02:00 | `yarn build --configuration=production-api` falla: ciclo de auto-import en el archivo nuevo (heredaba de `./environment`, el mismo path que su propio `fileReplacements` reemplaza) | `RUNS` (rojo) |
| 02:05 | Reescrito standalone; build vuelve a fallar, ahora con `TimeoutError` real prerenderizando `/auth/register/practitioner` — `SystemContextClient` sin el guardia SSR que ya tienen sus 3 vecinos | `RUNS` (rojo) |
| 02:10 | Guardia agregado; `yarn build --configuration=production-api` **y** `yarn build` (maqueta) en verde | `RUNS` |
| 02:20 | Playwright contra el servidor levantado: sin `app-mock-banner`, 0 `x-mock-backend` en 6 combinaciones, capturas tomadas | `VERIFIED` |
| 02:30 | H2: `mock-router.ts` (412→422, 422+issues→400+violations), `respuestaGenerica`→501, roles de la médica demo | `WRITTEN` |
| 02:35 | Specs dirigidos: 18 rojos por el cambio de status/forma (esperado). Reescritos uno por uno, comprobando en el handler cuál función respalda cada 422/412 antes de tocar cada aserción | `TESTED` (rojo→verde) |
| 02:45 | `check-mock-vs-client.mjs` escrito y probado rompiéndolo a propósito 2 veces (agregar/quitar del allowlist) | `TESTED` |
| 02:50 | H3: 3 prefijos en las 3 declaraciones; D-C registrada en `DECISIONS.md`; IP fuera de `proxy.conf.mjs` | `WRITTEN` |
| 02:55 | `check-api-prefixes`/`check-client-prefixes` verdes; sin Docker arrancado en esta máquina para probar contra nginx real → H3.S1.M2 queda `A MEDIAS` | `TESTED` (parcial) |
| 03:00 | Doble revisión de las 6 capturas; un hallazgo (hidratación lenta de `/auth` en tema oscuro) reproducido también en la maqueta — preexistente, no de este carril, anotado y no investigado (fuera del IN) | `VERIFIED` |
| 03:10 | 4 commits atómicos, PR #711 abierto contra `test` | `HECHO` (14/15) |
| — | A pedido, revisión de disco de la máquina: liberados ~15 GB (imágenes de Android SDK sin uso + snapshots del emulador + un `node_modules` duplicado vuelto junction) y 12,7 GB internos de Docker (build cache + 3 imágenes de otro proyecto) | — |
| — | Docker Desktop arrancado a pedido; el stack `mantra-redesa` (tenía política de reinicio) subió solo, sano | `RUNS` |
| — | Con la API real arriba: `server.mjs` de `production-api` local + `nginx:1.27-alpine` con `deploy/nginx.conf`+`api-locations.conf`+`api-proxy.conf` montados, apuntando a `host.docker.internal`. `/loyalty/me`, `/patients/me/reviews` y `/ai/v1/triage/analyze` — los tres JSON real, nunca HTML | `RUNS` |
| — | **Encontrado y corregido en el camino:** `/patients/me/reviews` tenía barra final en `api-locations.conf`; el cliente la llama sin barra y nginx nunca matcheaba. `check-api-prefixes.mjs` no lo veía (normaliza la barra antes de comparar) | `VERIFIED` |
| — | H3.S1.M2 cerrado; PR #714 abierto contra `test` con el fix + el reporte actualizado | `HECHO` (15/15) |

## Cierre

Los 15/15 quedaron `VERIFIED`. Nada quedó `A MEDIAS`.

Detalle completo (evidencia, no cubierto, desvíos, decisiones) en
`mantra-core-health/docs/progress/evidence/lane-m5-build-real/REPORTE.md`, PRs
[#711](https://github.com/mdavila-2001/mantra-core-health/pull/711) (mergeado) y
[#714](https://github.com/mdavila-2001/mantra-core-health/pull/714) (abierto, mergeable —
checks del repo en `pending`, su CI ya está documentado como caído).
