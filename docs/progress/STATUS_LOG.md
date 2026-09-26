## 2026-09-26T05:10:00+00:00 — Reparto preproducción en 6 máquinas — Publicado
- Estado: repartido
- QA: n/a (es un reparto; la Ola 0 que sí se ejecutó está en `RUNS`)
- Plan `planes/05-test-preproduccion-2026-09-26/` con 36 carriles entre 6 máquinas (Mac mini, MacBook, 2 Dell Inspiron, laptop, Acer), repartidos por capacidad de máquina para que ninguna espere a otra. Ola 0 ejecutada y medida: rama `test` creada en los dos repos — front `ec7037f7` (`typecheck` 0, `build` exit 0, 602/613 suites) y API `016caaa1` (`typecheck` 0, `lint` 0). Seis hallazgos en la verificación, tres corregidos: duplicación silenciosa del merge de tres vías en `register-patient.ts` (7 × TS2300), aserción de portabilidad desfasada heredada de `dev`, y tres defectos de calidad de la API — entre ellos `xlsx-parser.ts`, que metía «[object Object]» al catálogo de terminología. Tres abiertos y con dueño: `db:vendor` borra 4 patches que sólo viven en la API (M1/D4), la suite del front no es determinista (M6/F3) y su lint tiene 263 errores heredados de `mockup` (M6/F2).

## 2026-09-25T21:26:27.797223+00:00 — Carril C0 — Cierre
- Estado: done
- QA: passing
- PR #693 mergeado por jsaldias39 21:22 UTC (merge 10912eb4). C0 integrado en mockup: 14/21 microtareas HECHO, contrato/handlers/rejilla/pw-guard TESTED, E2E BLOCKED por CSP preexistente (verificado ajeno, no relajado). Dailies actualizados y pusheados.
