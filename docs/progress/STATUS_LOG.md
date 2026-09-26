## 2026-09-26T10:10:00+00:00 — Carril M5 (Laptop Justin) — Cierre final, 15/15
- Estado: done
- QA: nginx real + el stack `mantra-redesa` real levantados en la máquina (Docker Desktop estaba
  apagado; al arrancarlo el stack subió solo, tenía política de reinicio). `/loyalty/me`,
  `POST /patients/me/reviews` y `POST /ai/v1/triage/analyze` dan JSON real de la API (o el 503
  explícito diseñado para `/ai`), nunca el `index.html` del SSR — cierra H3.S1.M2, el único
  pendiente. En el camino se encontró y corrigió un bug real: `/patients/me/reviews` tenía barra
  final en `api-locations.conf` y el cliente la llama sin barra, así que nginx nunca la hacía
  matchear; `check-api-prefixes.mjs` no lo detecta porque normaliza la barra antes de comparar.
- PR [#714](https://github.com/mdavila-2001/mantra-core-health/pull/714) abierto contra `test`
  con el fix, `mergeable: MERGEABLE` (checks del repo `pending`, CI ya documentado como caído).
  El PR de todo lo demás (#711) ya estaba mergeado. Detalle en
  `mantra-core-health/docs/progress/evidence/lane-m5-build-real/REPORTE.md`.

## 2026-09-26T07:20:00+00:00 — Carril M5 (Laptop Justin) — Cierre
- Estado: a medias
- QA: 380/381 specs dirigidos en verde (1 rojo preexistente, confirmado con `git stash` contra
  `origin/test` sin tocar nada); `typecheck` 0; `eslint` 0 en los 18 archivos tocados; build
  `production-api` y build de la maqueta, los dos exit 0.
- PR [#711](https://github.com/mdavila-2001/mantra-core-health/pull/711) abierto contra `test`,
  `mergeable: MERGEABLE` (checks del repo `pending` — su propio `CLAUDE.md` ya declara el CI
  caído). 14/15 microtareas `HECHO`: `production-api` con SSR real y el mock apagado (H1),
  `respuestaGenerica`→501 + errores alineados con la API + roles reales de la médica demo (H2),
  y los 3 prefijos que faltaban + D-C registrada + IP fuera del repo (H3.S2). Queda **A MEDIAS**
  H3.S1.M2 (verificar los prefijos contra un nginx real): esta máquina no tiene el stack Docker
  que el reparto asignó a M1. Dos correcciones forzadas por el propio cambio, no scope creep:
  un ciclo de auto-import en `environment.production-api.ts` (colgaba el build en «extracting
  routes») y un `TimeoutError` real prerenderizando `/auth/register/practitioner`
  (`SystemContextClient` sin el guardia SSR que ya tienen sus 3 vecinos). Detalle completo en
  `mantra-core-health/docs/progress/evidence/lane-m5-build-real/REPORTE.md`.

## 2026-09-26T05:10:00+00:00 — Reparto preproducción en 6 máquinas — Publicado
- Estado: repartido
- QA: n/a (es un reparto; la Ola 0 que sí se ejecutó está en `RUNS`)
- Plan `planes/05-test-preproduccion-2026-09-26/` con 36 carriles entre 6 máquinas (Mac mini, MacBook, 2 Dell Inspiron, laptop, Acer), repartidos por capacidad de máquina para que ninguna espere a otra. Ola 0 ejecutada y medida: rama `test` creada en los dos repos — front `ec7037f7` (`typecheck` 0, `build` exit 0, 602/613 suites) y API `016caaa1` (`typecheck` 0, `lint` 0). Seis hallazgos en la verificación, tres corregidos: duplicación silenciosa del merge de tres vías en `register-patient.ts` (7 × TS2300), aserción de portabilidad desfasada heredada de `dev`, y tres defectos de calidad de la API — entre ellos `xlsx-parser.ts`, que metía «[object Object]» al catálogo de terminología. Tres abiertos y con dueño: `db:vendor` borra 4 patches que sólo viven en la API (M1/D4), la suite del front no es determinista (M6/F3) y su lint tiene 263 errores heredados de `mockup` (M6/F2).

## 2026-09-25T21:26:27.797223+00:00 — Carril C0 — Cierre
- Estado: done
- QA: passing
- PR #693 mergeado por jsaldias39 21:22 UTC (merge 10912eb4). C0 integrado en mockup: 14/21 microtareas HECHO, contrato/handlers/rejilla/pw-guard TESTED, E2E BLOCKED por CSP preexistente (verificado ajeno, no relajado). Dailies actualizados y pusheados.
