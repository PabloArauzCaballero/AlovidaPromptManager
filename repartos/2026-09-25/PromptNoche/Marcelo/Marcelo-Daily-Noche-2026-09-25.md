# Marcelo — daily de la noche del 2026-09-25

> **AVANCE COMBINADO: 0 / 128 — 0,0 %.** Sale de `microtareas HECHO / total`, sumando los dos carriles de
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

> **AVANCE: 0 / 98 — 0 %.**

- Carril: [`Noche-CargaMasiva.CalidadE2EVisualYGates`](Noche-CargaMasiva.CalidadE2EVisualYGates/E2EPlaywrightCapturasDobleRevisionGatesYSegundoPerfil.md)
- Contrato: [`CONTRATO-CARGA-MASIVA.md`](../CONTRATO-CARGA-MASIVA.md) §3, §4, §7; **Q-9 es tuya**
- Repos: `alovida/mantra-core-health` (Playwright, ref `origin/mockup`) y `alovida/mantra-core-health-api`
  (H7: worktree propio desde `origin/dev`, rama `marcelo/carga-masiva-xlsx-2026-09-25`) — **ninguno de los dos
  es el mismo checkout que tu Carril A**: worktrees separados
- Peldaño alcanzado (regla 30): `DISCOVERED` al repartir · se actualiza al cerrar

### 0. Q-9 — ¿existe todo lo que «designaciones» necesita? (antes de la hora 1)

> Itzan (H2.S5.M4) y Justin (H4.S1.M3) leen esta sección. Si a la hora 1 está vacía, ellos deciden solos.

| Pieza | Ruta:línea | Existe | Qué exige / qué falta |
|---|---|---|---|
| DTO `create-designation.dto.ts` | | | |
| Entidad `concept_designations.entity.ts` | | | |
| Endpoint `POST :conceptId/designations` | | | |
| Repositorio con alta / `findByCode` | | | |
| Índice único | | | |

**Decisión Q-9 (hora HH:MM):** <SÍ: columnas `code, language, use, value`, clave estable … / NO: falta …>

## 0-bis. Fixtures de la API (H7.S2) — publicá en la hora 2

| Qué | SHA + hora | Para quién |
|---|---|---|
| `test/fixtures/terminology-import/**` (14 CSV + XLSX + README) | | Itzan (specs CSV), Justin (doble), vos (E2E) |
| `decision-dependencia.md` + `yarn.lock` | | Itzan (plantilla XLSX), Pablo |
| `xlsx-parser.ts` + spec, PR API | | Pablo (cablea en `index.ts`) |

### 1. Instalación del estándar — pegá la salida acá

```text
$ ls .claude/skills | wc -l
<pendiente>

$ ls .claude/rules/[0-9]*.md | wc -l
<pendiente>

$ python .claude/hooks/plan_gate.py --self-test
<pendiente>
```

- [ ] Leí `skills-router` y las 29 skills del lote, empezando por `critical-double-review`.
- [ ] Creé el `PLAN.md` antes del primer `Edit`/`Write` de código.

### 2. Avance por hito (se llena al cerrar)

| Hito | Micro | HECHO | A MEDIAS | BLOQUEADO | DESCARTADO | Nota |
|---|---|---|---|---|---|---|
| H1 Corte, baseline, Q-9, fixtures | 15 | | | | | |
| H2 Specs: baseline de hoy y contrato | 19 | | | | | |
| H3 Corrida contra la rama de Justin | 6 | | | | | |
| H4 Capturas y doble revisión | 10 | | | | | |
| H5 Gate de seguridad y PHI | 12 | | | | | |
| H6 API real, regresión, PR, cierre | 14 | | | | | |
| H7 Dependencia XLSX, fixtures de la API, parseador XLSX | 22 | | | | | |

### 3. Peldaño del E2E por corrida

| Corrida | Contra qué | Resultado | Evidencia |
|---|---|---|---|
| Baseline (pantalla de hoy) | simulador, respuesta fija | | |
| Contrato | rama de Justin, doble en tres niveles (`[backend simulado]`) | | |
| Real | rama de Justin + API de Itzan (`[API real]`) | | |

### 4. Defectos reportados (nunca arreglados por vos)

| A quién | Qué | Severidad | Captura / pasos | Estado |
|---|---|---|---|---|

### 5. Procesos que quedaron corriendo

<lista o «ninguno»>

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

> **AVANCE DEL CARRIL C: 0 / 33.** Sale de `microtareas HECHO / total`. `A MEDIAS` cuenta como no hecha. Se suma a tus carriles A y B, no los reemplaza.

- Plan maestro del paquete: [`PLAN-MAESTRO.md`](../../../../docs/trabajo/2026-09-25-plan-y-reparto-encuentro-clinico/PLAN-MAESTRO.md) · Daily de equipo, sección «Paquete 3»: [`Daily-Noche-2026-09-25.md`](../Daily-Noche-2026-09-25.md)
- Repo: `mantra-core-health` · Ref: `origin/mockup` · Corte de referencia `bf2c3545` → **el tuyo:** (reconsultalo y anotalo por carril)
- Instalación del estándar: la misma de arriba (no la repitas; si abriste un worktree nuevo, fusioná `.claude/` sin pisar y pegá los tres números).
- Cómo entra en tu noche: C0 bloquea a Itzan, Justin y Pablo: es lo primero de este paquete (≈3 h). Después C3. Cómo se ordena con tus carriles A y B lo fija el propietario; la sugerencia del plan es C0 apenas cierres la Ola 0 de Farmacia (H2), porque tres personas lo esperan.

| Carril | Prompt | Corte propio | Rama | HECHO/total | Peldaño (regla 30) | PR | Push a `mockup` | Bloqueos / avisos |
|---|---|---|---|---|---|---|---|---|
| C0 · Contrato primero (tipos, conceptos, stubs, casillas, `pw-guard`) | [prompt](Noche-EncuentroClinico.C0-ContratoPrimero/ContratoPrimero.md) | | `claude/clinica-c0-base` | 0/21 | | | | |
| C3 · Diagnóstico presuntivo → confirmado/rechazado; enfermedad activa | [prompt](Noche-EncuentroClinico.C3-Diagnostico/DiagnosticoPresuntivoConfirmarORechazar.md) | | `claude/clinica-c3-diagnostico` | 0/12 | | | | |

### Lo que publicás para otros (con SHA + hora)

(ver «Lo que destraba a otros» en la sección Paquete 3 del daily de equipo)

### Baseline del worktree de este carril

| Comando | Exit code | Rojos previos | Clase (regla 80.4) |
|---|---|---|---|
| `yarn lint` | | | |
| `yarn typecheck` | | | |
| `yarn test --watch=false --include=<mis carpetas>` | | | |

### Doble revisión crítica de las capturas (regla 35)

(una entrada por captura Playwright: primera mirada · segunda mirada adversarial · qué se corrigió)

### Cierre

- PR: · Push a `mockup` verificado: · `REPORTE.md`: · Pendiente de backend redactado: · `// TODO C8` dejados:
