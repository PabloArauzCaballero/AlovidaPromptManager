# Marcelo — daily de la noche del 2026-09-25

> **AVANCE COMBINADO: 82 / 128 — 64,1 %.** Carril A (Farmacia) sin tocar esta sesión: 0/30. Carril B: 82/98. Sale de `microtareas HECHO / total`, sumando los dos carriles de
> abajo. `A MEDIAS` cuenta como **no hecha**. Prohibido el porcentaje estimado a ojo (regla 50 §5).

- Daily de equipo: [`Daily-Noche-2026-09-25.md`](../Daily-Noche-2026-09-25.md) — **dos paquetes esta noche**, uno por sección de este documento.

---

## Carril A — Farmacia: cliente, mocks y el contrato real en la API

> **AVANCE: 0 / 30 — 0,0 %.**

- Carril: [`Noche-Farmacia.DatosYContratoReal`](Noche-Farmacia.DatosYContratoReal/ClienteMocksYEndpointsRealesDeFarmacia.md) (carriles 42 y 47 del plan)
- Cortes: front `origin/mockup` @ `bf2c3545…` → **el tuyo:** `________` · API `origin/dev` @ `343795cc…` → **el tuyo:** `________`
- Ramas: `marcelo/farmacia-cliente-y-mocks-2026-09-25` (front) · `marcelo/pharmacy-sites-y-filtro-por-farmacia-2026-09-25` (API) · Peldaño alcanzado (regla 30): `UNKNOWN`

### 0. Tu primera hora es la otra mitad de la Ola 0, y Justin e Itzan la esperan

Antes de nada: **H2** — `PharmacyDetail`, `PharmacySiteRead`, `PharmacySitePrices`, `PharmacySitePriceItem`,
`getPharmacy()`, `getSitePrices()`, los dos mocks, spec del cliente en verde, `curl` pegado, PR chico a `mockup`,
merge. **Publicalo en §4-bis del Paquete 1 del daily de equipo apenas esté en `origin/mockup`.** Después, las
fixtures (H3.S1) y recién entonces la API.

### 1. Instalación del estándar — pegá la salida acá (en los dos checkouts)

```text
$ ls .claude/skills | wc -l
<pegá la salida — tiene que dar 179>

$ ls .claude/rules/[0-9]*.md | wc -l
<pegá la salida — tiene que dar 15>

$ python .claude/hooks/plan_gate.py --self-test
<pegá la salida — tiene que dar 11 PASS, 0 FAIL>
```

- [ ] Leí `skills-router` y las 21 skills de mi lote, empezando por `frontend-data-access`.
- [ ] Creé mi `PLAN.md` antes del primer `Edit`/`Write` de código.

### 2. Baseline

| Repo | Comando | Exit code | Rojos previos | Clase (regla 80.4) |
|---|---|---|---|---|
| front | `corepack yarn lint` | | | |
| front | `corepack yarn typecheck` | | | |
| front | `npx ng test --include='src/app/core/data-access/pharmacy/*.spec.ts' --watch=false` | | | |
| API | `yarn typecheck` | | | |
| API | `yarn test src/modules/pharmacy` | | | |

### 3. El contrato, campo por campo (H2.S1.M1, H4.S1.M2)

| Campo | `pharmacy.types.ts` (front) | `read-responses.dto.ts` (API) | Igual |
|---|---|---|---|
| `PharmacySiteRead.latitude` | | | |
| `PharmacySitePriceItem.requiresPrescription` (Q-M4) | | | |
| `PharmacySitePriceItem.unitAmount` | | | |
| `PharmacySite.distanceKm` (sedes sueltas) | | | |

### 4. Coherencia de precio (H3.S2.M2)

| Producto | `/sites/:siteId/prices` | `/availability` | `POST /orders` → `unitPriceAmount` | Iguales |
|---|---|---|---|---|
| | | | | |

### 5. Checkpoints del turno

```text
AVANCE — datos y contrato real — <fase> — <ID de microtarea>
- Hecho:      <qué quedó, concreto>
- Evidencia:  <comando / ruta / "ninguna todavía">
- Ahora:      <la siguiente acción, una sola>
- Bloqueo:    ninguno | <qué bloquea y de quién depende>
- Estado:     TODO | EN CURSO | HECHO | A MEDIAS | BLOQUEADO | DESCARTADO
- Peldaño:    UNKNOWN | DISCOVERED | WRITTEN | RUNS | TESTED | VERIFIED | REGRESSION_VERIFIED
```

### 6. Cierre

| Hito | Microtareas HECHO / total | Estado | Peldaño |
|---|---|---|---|
| H1 | / 4 | | |
| H2 | / 6 | | |
| H3 | / 6 | | |
| H4 | / 5 | | |
| H5 | / 3 | | |
| H6 | / 3 | | |
| H7 | / 3 | | |
| **Total** | **/ 30** | | |

- PRs: front `________` · API `________`
- Qué quedó `A MEDIAS` (con las cuatro respuestas): `________`
- Qué quedó corriendo y se cerró: `________`

---

## Carril B — Carga masiva: calidad (E2E, doble revisión, gates) y parseo XLSX

> **AVANCE: 82 / 98 — 83,7 %.**

- Carril: [`Noche-CargaMasiva.CalidadE2EVisualYGates`](Noche-CargaMasiva.CalidadE2EVisualYGates/E2EPlaywrightCapturasDobleRevisionGatesYSegundoPerfil.md)
- Contrato: [`CONTRATO-CARGA-MASIVA.md`](../CONTRATO-CARGA-MASIVA.md) §3, §4, §7; **Q-9 es tuya**
- Repos: `alovida/mantra-core-health` (Playwright, ref `origin/mockup`) y `alovida/mantra-core-health-api`
  (H7: worktree propio desde `origin/dev`, rama `marcelo/carga-masiva-xlsx-2026-09-25`) — **ninguno de los dos
  es el mismo checkout que tu Carril A**: worktrees separados
- Peldaño alcanzado (regla 30): `DISCOVERED` al repartir · se actualiza al cerrar

### 0. Q-9 — ¿existe todo lo que «designaciones» necesita? (antes de la hora 1)

> Itzan (H2.S5.M4) y Justin (H4.S1.M3) leen esta sección.

| Pieza | Ruta:línea | Existe | Qué exige / qué falta |
|---|---|---|---|
| DTO `create-designation.dto.ts` | `mantra-core-health-api/src/modules/terminology/dto/create-designation.dto.ts:53-100` | **SÍ** | `value` obligatorio (≤255) · `language?` `'ES'\|'EN'` · `designationType?` `'PREFERRED'\|'SYNONYM'` · `preferred?` · `properties?`. **No tiene `code` ni `use`**: el concepto va en la URL (`:conceptId`) y el «uso» se llama `designationType` |
| Entidad `concept_designations.entity.ts` | `mantra-core-health-api/src/modules/terminology/entities/concept_designations.entity.ts:12-76` | **SÍ** | `concept_id` (FK), `language_concept_id?`, `designation_type_concept_id?`, `value` (varchar), `preferred?`, auditoría, `row_version`. **Sin `unique`** en ninguna combinación de columnas |
| Endpoint `POST :conceptId/designations` | `mantra-core-health-api/src/modules/terminology/controllers/terminology-concepts.controller.ts:241-252` → `services/concepts.service.ts:120-160` | **SÍ** | `@Roles('SECURITY_ADMIN')`, uno por llamada, `conceptId` uuid en la ruta; mapea `language`→`CONCEPTS.LANG_ES/EN` y `designationType`→`CONCEPTS.DESIG_PREFERRED/SYNONYM`; degrada la preferida anterior por idioma con `FOR UPDATE` |
| Repositorio con alta / `findByCode` | `repositories/concept-designations.repository.ts:69` `createDesignation` · `:110` `findByLanguageForUpdate` · `:126` `findByConcept`. El concepto **padre** se ubica por `repositories/catalog-concepts.repository.ts:104` `findByVersionAndCode(em, versionId, code)` | **SÍ** el alta · **NO** hay búsqueda de designación existente por `(concepto, idioma, valor)` | La idempotencia (Q-7 del contrato: «omitida» si ya existe) exige una consulta nueva en este repositorio, que hoy no está |
| Índice único | `src/orm/catalog/indexes/terminology.idx.ts:36-40` | **NO** (5 índices `btree` simples: `concept_id`, `language_concept_id`, `designation_type_concept_id`, `created_by_user_id`, `updated_by_user_id`) | Sin clave estable en base: dos altas idénticas conviven sin que Postgres las rechace |

**Decisión Q-9 (2026-09-25, hora de publicación: ver commit):** **SÍ, con matices.** La entidad, el DTO, el endpoint y el repositorio con alta existen y son usables hoy. El perfil `designaciones` es viable con columnas `code` (resuelve el concepto padre vía `findByVersionAndCode`), `language` (`ES|EN`, alias `idioma`), `use` (mapea a `designationType`, `PREFERRED|SYNONYM`, alias `uso`/`tipo`) y `value` (alias `valor`/`término`). Lo que falta —índice único y una consulta de existencia por `(concept_id, language_concept_id, value)`— es trabajo del **servicio** de Itzan, no del esquema (que está prohibido tocar). Si Itzan no quiere abrir eso esta noche, el perfil queda `DESCARTADO` con esta evidencia, y `import-profiles.ts` de su rama ya lo declara así en un comentario («El perfil de designaciones se suma cuando se confirme que su entidad, su DTO y su repositorio existen»).

## 0-bis. Fixtures de la API (H7.S2) — publicá en la hora 2

| Qué | SHA + hora | Para quién |
|---|---|---|
| `test/fixtures/terminology-import/**` (13 CSV + 15 XLSX + PDF + README, 30 archivos) | `f3816e3e`, 2026-09-25 12:25 (hora local del commit) | Itzan (specs CSV), Justin (doble), vos (E2E) |
| `decision-dependencia.md` + `yarn.lock` | `52aa408b` (xlsx 0.20.3), `2026-09-25 12:16` | Itzan (plantilla XLSX), Pablo |
| `xlsx-parser.ts` + spec, PR API | PR [#462](https://github.com/mdavila-2001/mantra-core-health-api/pull/462), `82c6239f`, 18/18 en verde (spec cruzado sobre los 12 gemelos) | Pablo (cablea en `index.ts`) |

### 1. Instalación del estándar — pegá la salida acá

```text
$ ls .claude/skills | wc -l
179

$ ls .claude/rules/[0-9]*.md | wc -l
15

$ python .claude/hooks/plan_gate.py --self-test
plan_gate self-test: 11 PASS, 0 FAIL
```

- [x] Leí `skills-router` y las skills del lote (leídas por ruta, ver `estandar-de-la-casa-promptmanager`: el pack no es invocable con la herramienta Skill).
- [x] Creé el `PLAN.md` antes del primer `Edit`/`Write` de código: `mantra-core-health/docs/trabajo/2026-09-25-marcelo-calidad/PLAN.md` (98 microtareas) y su espejo en `mantra-core-health-api` (H7).

### 2. Avance por hito (se llena al cerrar)

| Hito | Micro | HECHO | A MEDIAS | BLOQUEADO | DESCARTADO | Nota |
|---|---|---|---|---|---|---|
| H1 Corte, baseline, Q-9, fixtures | 15 | 14 | 1 | | | `pw:rutas` diferido a H2/H3 (evita un `ng serve` extra) |
| H2 Specs: baseline de hoy y contrato | 19 | 19 | | | | Justin ya integrado en `mockup`: no hubo «rama de Justin» aparte |
| H3 Corrida contra la rama de Justin | 6 | 3 | 1 | | 2 | La «rama de Justin» ya no existe como tal (integrada); 2 microtareas de esa premisa quedaron `DESCARTADO` |
| H4 Capturas y doble revisión | 10 | 8 | 1 | | 1 | Drag & drop real `A MEDIAS` (no automatizable); re-captura `DESCARTADO` porque Justin aún no corrigió |
| H5 Gate de seguridad y PHI | 12 | 8 | | | 4 | Matriz `curl` `DESCARTADO`: la API de Itzan no arranca (`InsuranceModule` roto, ajeno) |
| H6 API real, regresión, PR, cierre | 14 | 8 | 3 | | 3 | PR #684 `MERGEABLE`; API real/regresión con backend real bloqueadas por lo mismo que H5 |
| H7 Dependencia XLSX, fixtures de la API, parseador XLSX | 22 | 22 | | | | Completo — PR #462 `MERGEABLE`, 59/59 pruebas |

### 3. Peldaño del E2E por corrida

| Corrida | Contra qué | Resultado | Evidencia |
|---|---|---|---|
| Baseline (pantalla de hoy) | simulador, respuesta fija | **VERIFIED** — 1/1 PASS | `mantra-core-health/docs/trabajo/2026-09-25-marcelo-calidad/evidencia/h2/baseline.txt` |
| Contrato | pantalla ya integrada (Justin mergeado en `mockup`), `[backend simulado]` | **VERIFIED (10/11)** — el 11º es un hallazgo real de `axe-core`, reportado no arreglado | `.../evidencia/h3/simulado.txt` |
| Real | API de Itzan (`d99ff9e7`) | **BLOCKED** — la API no arranca (`UnknownDependenciesException` en `InsuranceModule`, ajeno a terminología) | `.../evidencia/h5/api-no-arranca.txt` |

### 4. Defectos reportados (nunca arreglados por vos)

| A quién | Qué | Severidad | Captura / pasos | Estado |
|---|---|---|---|---|
| Justin | Contraste 4,27:1 en `.carga__nota` (`version-import.css:134-138`, token `--text-muted`); WCAG 2 AA exige 4,5:1. Afecta 4 párrafos. Hallado con `axe-core` en el test 11 del contrato. | MAYOR | `mantra-core-health/docs/trabajo/2026-09-25-marcelo-calidad/defectos.md` + `evidencia/h3/simulado.txt` | Reportado en su daily §4, sin corregir |
| Itzan | La rama `carga-masiva-motor-2026-09-25` (`d99ff9e7`) no arranca: `UnknownDependenciesException` en `PractitionerSettlementBatchesService`/`InsuranceModule`. Él mismo ya lo dejó dicho en su daily (`b2e092f6`). | BLOQUEANTE (para H5.S2 y H6 de este carril) | `mantra-core-health-api/docs/trabajo/2026-09-25-marcelo-calidad/REPORTE.md` sección A medias | Ya en curso de corrección por Itzan, según su propio daily |

### 5. Procesos que quedaron corriendo

Ninguno. `ng serve` (puerto 4200) y el intento de `yarn start:dev` de la API (puerto 3000, nunca
llegó a escuchar) se detuvieron antes de cerrar — verificado con `Get-NetTCPConnection -LocalPort
4200,3000` (libres) y sin procesos `node` huérfanos de esta sesión.

---

## Cómo repartís tu noche entre los dos carriles

Sos la persona con más superficie esta noche (128 microtareas entre los dos): Carril A te tiene en la **Ola 0**
(destraba a Justin e Itzan en su primera hora) y Carril B te tiene publicando **Q-9 y fixtures** en tus primeras
dos horas (destraba a Itzan y a Justin del otro paquete). **Los dos empiezan primero que nada esta noche.**
Sugerencia de orden: Carril A H2 (una hora) → Carril B H1+Q-9 (paralelo posible si alternás mientras el PR de
A H2 espera review/checks) → Carril B H7.S1–S2 (dependencia y fixtures, hora 2) → seguís cada uno según su
propio orden interno. Si no llegás a los dos completos, decilo en este daily con cuál priorizaste y por qué.

---

## Carril C — Encuentro clínico (Paquete 3, agregado por el propietario): C0, C3

> **AVANCE DEL CARRIL C: 14 / 33** (C0: 14/21 · C3: 0/12). Sale de `microtareas HECHO / total`. `A MEDIAS` cuenta como no hecha. Se suma a tus carriles A y B, no los reemplaza.

- Plan maestro del paquete: [`PLAN-MAESTRO.md`](../../../../docs/trabajo/2026-09-25-plan-y-reparto-encuentro-clinico/PLAN-MAESTRO.md) · Daily de equipo, sección «Paquete 3»: [`Daily-Noche-2026-09-25.md`](../Daily-Noche-2026-09-25.md)
- Repo: `mantra-core-health` · Ref: `origin/mockup` · Corte de referencia `bf2c3545` → **el tuyo:** C0 partió de `9b8bc46e` (base original), reverificado sobre `72450ff5`/`33a33bca` (dos rondas de fusión, incluido un conflicto mecánico en `diagnostics.handlers.ts` resuelto conservando ambas adiciones — detalle en `REPORTE.md` §7).
- Instalación del estándar: la misma de arriba (no la repitas; si abriste un worktree nuevo, fusioná `.claude/` sin pisar y pegá los tres números).
- Cómo entra en tu noche: C0 bloquea a Itzan, Justin y Pablo: es lo primero de este paquete (≈3 h). Después C3. Cómo se ordena con tus carriles A y B lo fija el propietario; la sugerencia del plan es C0 apenas cierres la Ola 0 de Farmacia (H2), porque tres personas lo esperan.

| Carril | Prompt | Corte propio | Rama | HECHO/total | Peldaño (regla 30) | PR | Push a `mockup` | Bloqueos / avisos |
|---|---|---|---|---|---|---|---|---|
| C0 · Contrato primero (tipos, conceptos, stubs, casillas, `pw-guard`) | [prompt](Noche-EncuentroClinico.C0-ContratoPrimero/ContratoPrimero.md) | `72450ff5`/`33a33bca` | `marcelo/feat-clinica-c0-contrato-primero` | 14/21 (+1 integración necesaria, A MEDIAS) | TESTED (contrato/handlers/componentes); E2E BLOCKED por CSP ajeno, no C0 | [#693](https://github.com/mdavila-2001/mantra-core-health/pull/693) — **MERGEADO** por jsaldias39, 21:22 UTC | **Sí, integrado**: `origin/mockup` @ `10912eb4` ya contiene C0 | Ninguno nuevo. El E2E completo (31 casos) falla 31/31 solo en el `afterEach` de consola por un CSP preexistente (reproducido en `/auth`, ajeno a C0); 2 de esos 31 arrastran además un overflow de header preexistente. Ninguno debilitado. Falta P2 (segunda revisión visual) y aplicar el rename H4.S1.M1–M5 a VERIFIED completo. |
| C3 · Diagnóstico presuntivo → confirmado/rechazado; enfermedad activa | [prompt](Noche-EncuentroClinico.C3-Diagnostico/DiagnosticoPresuntivoConfirmarORechazar.md) | | `claude/clinica-c3-diagnostico` | 0/12 | | | | Bloqueado hasta que C0 se integre en `mockup` (el stub 404 de verificación es de C0). |

### Lo que publicás para otros (con SHA + hora)

- **Contrato, casillas, stubs, `pw-guard` en `origin/mockup`** — Marcelo (C0) → Itzan, Justin, Pablo. **INTEGRADO en `mockup`**: PR [#693](https://github.com/mdavila-2001/mantra-core-health/pull/693) mergeado por Justin (`jsaldias39`) el 2026-09-25 21:22 UTC, merge commit `10912eb4`. `origin/mockup` ya contiene los tipos congelados de C0 — C1/C2/C4/C9 pueden ramificar directo de `origin/mockup`, sin depender del PR.

### Baseline del worktree de este carril

| Comando | Exit code | Rojos previos | Clase (regla 80.4) |
|---|---|---|---|
| `yarn lint` | 1 (263 errores) | Sí, idéntico antes/después de C0 | ENVIRONMENT/preexistente, ajeno a C0 |
| `yarn typecheck` | 0 | — | — |
| `yarn test --watch=false --include=<13 carpetas de C0>` | 0 (13 archivos / 309 tests) | No | — |
| `node scripts/pw-guard.mjs --self-test` | 0 (3 PASS, 0 FAIL) | No | — |
| `grep -rn "diagnostics-block\|DiagnosticsBlock" src/app` (kill-test) | 1 (0 coincidencias = PASS) | No | — |
| `node scripts/pw-guard.mjs --port 4210 --spec playwright/consulta-rejilla.spec.ts` (31 casos) | 1 (31/31 fallan) | El CSP se reproduce también en `/auth`, ruta que C0 no toca | ENVIRONMENT — causa en `src/server/security-headers.ts`, confirmada por reproducción independiente, no solo por comparación de hashes |

### Doble revisión crítica de las capturas (regla 35)

P1 (primera mirada) completada sobre las 60 capturas finales: 50 OK, 8 defectos menores (tira de pestañas/sello de demo en historia1024, sello en rejilla1440, inspector de stock1440/1920, ambos temas), 2 mayores (historia390 claro/oscuro, por el overflow de 13–52 px del header global — HTML/CSS idénticos a base por SHA-256, fuera de alcance de C0). Detalle en `docs/trabajo/2026-09-25-encuentro-clinico/c0/evidencia/doble-revision-p1.md`. **P2 (segunda mirada adversarial) sigue pendiente** — no se declara la doble revisión concluida.

### Cierre

- **C0** — PR: [#693](https://github.com/mdavila-2001/mantra-core-health/pull/693), **MERGEADO** a `mockup` por jsaldias39 el 2026-09-25 21:22 UTC, merge commit `10912eb4` (SHA de la rama: `8b48f0b5`). · Push a `mockup` verificado: **sí, por merge del reviewer** — el push propio fue a la rama, no directo a `mockup`; el merge lo hizo Justin al revisar. `origin/mockup` ya contiene C0 (confirmado con `git merge-base --is-ancestor`). · `REPORTE.md`: completo, 7 secciones, en `docs/trabajo/2026-09-25-encuentro-clinico/c0/REPORTE.md`. · Pendiente de backend redactado: sí — P39–P42 (verificación de diagnóstico, categorías de orden, notas con firma real) quedan para C1/C2/C3 con backend NestJS real; C0 es solo simulador. · `// TODO C8` dejados: uno, en `src/app/core/mock/fixtures/agenda.ts:217-218`, ya resuelto por C0 (marca dónde C8 debía reemplazar el tipo de cita — el value set `APT-RECONSULTA` ya existe, falta que C8 lo consuma).
- **C3** — no se trabajó esta noche (priorizado C0 por ser el que bloquea a tres personas).
