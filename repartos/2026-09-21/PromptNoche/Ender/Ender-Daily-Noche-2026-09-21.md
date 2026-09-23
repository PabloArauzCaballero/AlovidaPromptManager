# Ender — daily de la noche del 2026-09-21

> **AVANCE: 58 / 61 — 95.1 %.** Sale de `microtareas HECHO / total`: 58 HECHO · 1 A MEDIAS · 2 BLOQUEADO · 0 DESCARTADO · 0 TODO.
> `A MEDIAS` y `BLOQUEADO` cuentan como **no hechas**; el denominador sigue siendo **61**. Prohibido el porcentaje estimado a ojo (regla 50 §5).

- Carril: [`Refactor-CatalogoEInventario.Plataforma`](Refactor-CatalogoEInventario.Plataforma/CatalogoRealScannerYFactoriesTipadas.md)
- Corte: `origin/mockup` @ `5a0776c6…` → **el tuyo:** `d40b5631f68a52c79fe94f0dc689df3bc7e70140` (base auditada). `mockup` avanzó después a `b655e844` (7 commits, incluido #570) **sin solape** con los 14 archivos del carril, verificado antes del commit y antes del push
- Rama: `ender/catalogo-real-scanner-factories-tipadas` · commit `bf5abde379613749a06b82347b27a46b1b9dfa44` · [PR #575](https://github.com/mdavila-2001/mantra-core-health/pull/575) contra `mockup`, **OPEN, sin merge** · Peldaño alcanzado (regla 30): **AUDITADO · COMMITEADO · PUSHEADO · PR ABIERTA** · carril **CLOSED** · `DONE_FORMAL = NO` (ver §7)
- Daily de equipo: [`Daily-Noche-2026-09-21.md`](../Daily-Noche-2026-09-21.md)
- Repo real: `mdavila-2001/mantra-core-health` (el reparto dice `alovida/mantra-core-health`, que no resuelve en GitHub)
- Próxima acción de Ender: **ninguna**. El carril está cerrado. La revisión y el merge del PR #575 quedan a cargo de quien corresponda.

## 0. Por qué tu carril va primero

Los otros cuatro tienen que **acreditar sus organismos en tu catálogo**. Si el catálogo monta con
props adivinadas —`columns: []`, `trackBy` inventado, un diálogo vacío— sus pruebas de fidelidad no
valen nada. **H2 y H3 son lo que más importa de tu noche.**

Y hay un riesgo que sólo tenés vos: `package.json` define
`"start": "yarn env:generate && yarn stock:generate && ng serve"`, y lo mismo `"build"`.
**Tu generador es dependencia del arranque de los otros cuatro.** Si lo dejás roto, cuatro personas no
pueden trabajar. Por eso tu H1.S3 exige que el índice regenere idéntico **antes** de que toques la
lógica, y cada cambio cierra con `yarn stock:generate` corrido de nuevo.

> **Drift registrado:** desde `f4b4caea` (22/09), `yarn start` sirve el SSR ya compilado de `dist/` y
> el antiguo `start` pasó a llamarse `yarn dev`. `ASSIGNMENT_COMMAND_DRIFT: yarn start -> yarn dev`: todas
> las verificaciones de arranque del carril usaron `yarn dev`. No se tocó `package.json`.

## 1. Instalación del estándar — pegá la salida acá

```text
$ ls .claude/skills | wc -l
180

$ ls .claude/rules/[0-9]*.md | wc -l
14

$ python .claude/hooks/plan_gate.py --self-test
plan_gate self-test: 11 PASS, 0 FAIL
```

180 = las **176 del estándar**, verificadas una por una por nombre y contenido de `SKILL.md`, **+ 4 propias
del producto** (`fable-refactor-orchestrator`, `frontend-production-gate`, `project-design-system`,
`visual-quality-gate`).

Se copió **sólo `.claude/`**, no `AGENTS.md` ni `.agents/`: es la regla de MANTRA/Ender. La copia fue
archivo por archivo con `cp -n`, sin pisar nada. La única colisión fue `.claude/settings.json`: quedó
el del producto (sha idéntico antes y después). Los hooks del estándar se pusieron en
`.claude/settings.local.json`, que no se versiona. Los 8 archivos versionados de `.claude/` del
producto quedaron intactos. Todo lo instalado está excluido de git.

- [ ] Leí `skills-router` y las 25 skills de mi lote, empezando por `atomic-design-components`. — **No
      se marca:** la ejecución siguió las reglas y el reparto, pero no queda constancia de lectura de las 25.
- [x] Creé mi `PLAN.md` antes del primer `Edit`/`Write` de código.

## 2. Baseline — sin esto no podés demostrar que un rojo ya estaba

| Comando | Exit code | Rojos previos | Archivo de evidencia |
|---|---|---|---|
| `yarn lint` | 1 | 244 errores, una sola regla (`prefer-on-push-component-change-detection`), 195 archivos — ENVIRONMENT (aparece con `angular-eslint` 22→21 en `f4b4caea`; inferido) | `evidencia/antes/lint.txt` |
| `yarn typecheck` | 0 | ninguno | `evidencia/antes/typecheck.txt` |
| `yarn test --watch=false` | 1 | 26 de 7089: TestBed ya instanciado según el orden (TEST_BUG, intermitente), cuota de storage (TEST_BUG), spec que lee el repo de la API como hermano (ENVIRONMENT), timeout (ENVIRONMENT) | `evidencia/antes/test.txt` |
| `yarn audit:vistas` | 0 | reescribe 2 archivos **versionados** de `docs/reports/generated/` (informe desactualizado en `mockup`, DATA) | `evidencia/antes/audit-vistas.txt` + `audit-vistas-tracked-drift.diff` |
| `yarn stock:generate` ×2 + `diff` | 0 / 0 | diff vacío: **sí** (sha256 idéntico) | `evidencia/antes/component-index.generated.ts` |

Conteo del índice por nivel, de la línea de resumen que imprime el propio generador:
`545 componentes · 3 otros · 303 pantallas · 138 maquetas · 23 atomos · 45 moleculas · 33 organismos · 192 con algo que mirar`

Al cierre: los mismos cuatro números de nivel. «Con algo que mirar» pasa a 203, y cada cambio está
explicado: +7 `importado-sin-instanciar` y selectores de atributo que antes no se veían. El índice
generado está en `.gitignore`: nunca hubo versión trackeada contra la cual derivar.

> Las rutas `evidencia/…`, `PLAN.md` y `REPORTE.md` viven en el worktree del carril
> (`wt-catalogo-scanner-front`), excluidas de git por `.git/info/exclude`. No van en el PR.

## 3. Checkpoints del turno

El registro por microtarea está en `PLAN.md` del worktree. Este es el cierre por hito:

```text
AVANCE — catálogo e inventario — H1 — H1.S1.M1…H1.S3.M4
- Hecho:      corte d40b5631 fijado; Node 22.16 / Yarn 4.18.0 = packageManager; ruta /design-system/stock
              (app.routes.ts:1852-1869); baseline de los cinco comandos; índice idéntico ×2
- Evidencia:  evidencia/antes/*
- Estado:     HECHO 12/12 · Peldaño: VERIFIED

AVANCE — catálogo e inventario — H2 — H2.S1.M1…H2.S3.M4
- Hecho:      el índice distingue template-instantiates / imports-available sin instanciar / type-only /
              dynamic-loads; selector de atributo; 5 unresolvedEvidence reales con causa; nivel con
              procedencia (por-ruta/declarado) y soporte de @nivelAtomico
- Evidencia:  node --test scripts/lib/relaciones-de-uso.test.mjs 25/25; evidencia/h2/*
- Bloqueo:    H2.S3.M2 (ver §5)
- Estado:     HECHO 12/13 · BLOQUEADO 1 · Peldaño: REGRESSION_VERIFIED

AVANCE — catálogo e inventario — H3 — H3.S1.M1…H3.S3.M4
- Hecho:      DataTable correcto / límite (0, 1, texto largo, sticky medido) / inválido (trackBy repetido,
              rechazado antes de montar, conserva el último válido); ContentDialog con foco restaurado
              (DOCUMENT del marco); faker del-tipo / sin-verificar / por-omision
- Evidencia:  escenarios.spec + props.spec 62/62; evidencia/h3/*; barrido 545: 524 → 529, 0 regresiones
- Estado:     HECHO 13/13 · Peldaño: REGRESSION_VERIFIED

AVANCE — catálogo e inventario — H4 — H4.S1.M1…H4.S2.M4
- Hecho:      medido en runtime: comparte SessionStore/Router, localStorage/cookies; 0 peticiones de negocio
              en modo simulado; la cuenta del banco cambia la sesión en memoria y se restaura al salir.
              Decisión B (límite declarado) + aislamiento parcial (DOCUMENT)
- Evidencia:  evidencia/runtime-*/ciclo-y-aislamiento.json; evidencia/h4/ADR-propuesta-aislamiento-del-preview.md
- Bloqueo:    H4.S2.M2 (ver §5)
- Estado:     HECHO 7/8 · BLOQUEADO 1 · Peldaño: VERIFIED

AVANCE — catálogo e inventario — H5 — H5.S1.M1…H5.S2.M3
- Hecho:      A→B→A con carga demorada real resuelto (turno vigente); limpieza completa en montaje fallido
              (vistas, nodo, observador de red y timer); seis dimensiones de acreditación legibles en grises
- Evidencia:  evidencia/runtime-antes vs evidencia/final; evidencia/cierre-final/sonda-red-tras-fallo.json
- Bloqueo:    H5.S2.M3 A MEDIAS (dos dimensiones son de runtime; el generador cuenta 4 de 6)
- Estado:     HECHO 5/6 · A MEDIAS 1 · Peldaño: VERIFIED

AVANCE — catálogo e inventario — H6 — H6.S1.M1…H6.S2.M4
- Hecho:      regresión contra H1 sin rojos nuevos por causa del cambio; capturas por viewport y tema miradas;
              §19 respondido; REPORTE.md; auditoría independiente con H-1/H-3/H-4 y limpieza del observador
              resueltos antes del commit
- Evidencia:  evidencia/despues/*, evidencia/h6/*, evidencia/final-review/*
- Estado:     HECHO 9/9 · Peldaño: AUDITADO → commit bf5abde3, push, PR #575 OPEN
```

## 4. Lo que te van a pedir esta noche

| Quién | Qué | Cuándo |
|---|---|---|
| Pablo | escenario tipado de `DataTable<Row>` en el catálogo, y fixtures de `accesos`/`personas` en `core/mock/` | temprano |
| Justin | fixtures de terminología y datos compartidos | media noche |
| Itzan | escenario de `paginated-form` con `paginas` y `form` reales | media noche |
| Marcelo | escenarios de `attachment-dialog` y `attachment-uploader`, y fixtures del expediente | media noche |
| Los cuatro | un export nuevo en un barrel — **vos sos el único dueño de los tres** | cuando aparezca |

**Anotá cada pedido acá, con quién y qué:**

| Quién pidió | Qué | Estado | Cuándo se lo entregaste |
|---|---|---|---|
| — | En esta ejecución no llegó ningún pedido directo al carril | — | — |
| Pablo (vía #569, ya en `mockup`) | Escenario tipado de `DataTable<Row>` | Ya existía (12 variantes, #569). Se **amplió** con límite ×3 e inválido, más verificación de contrato | En el PR #575 |

Los tres barrels no cambiaron en este carril: nadie pidió un export nuevo por esta vía. Los fixtures
de `core/mock/` no son de Ender; sólo `core/mock/faker/**` está en su reserva.

## 5. Lo que vos pediste y no llegó

No hubo insumos de otro carril pendientes. Los dos bloqueos son **de alcance**: exigen escribir fuera de
la reserva. No son contratos ajenos que se puedan doblar, así que la simulación de tres niveles de la
regla 65 no aplica.

| Qué falta | De quién | Contrato que simulaste | Los tres niveles | Qué falta verificar contra lo real |
|---|---|---|---|---|
| **H2.S3.M2 — BLOQUEADO.** Marcar un componente indexado con `@nivelAtomico` para demostrar que el nivel declarado gana. Los únicos `@Component` de la reserva son la infraestructura del banco, excluida del índice | Pablo + el dueño del componente (Q-E1) | La regla `clasificarNivel` / `nivelDeclarado` sobre texto de prueba | correcto (declarado gana), límite (sin declaración → por ruta), inválido (valor no reconocido → se rechaza y se reporta): 3 tests | Un componente real con la etiqueta y su fila en el índice regenerado |
| **H4.S2.M2 — BLOCKED_BY_SCOPE.** ADR de aislamiento del preview en `docs/adr/` o `DECISIONES.md` | Pablo (Q-B) | — (es una escritura, no un contrato) | — | Copiar `evidencia/h4/ADR-propuesta-aislamiento-del-preview.md` a su destino |

**H5.S2.M3 — A MEDIAS.**
- *Qué anda:* la línea del generador da 4 de las 6 dimensiones con denominador: descubiertos 545/545, con escenario 3/545, verificados visualmente 3/545, bloqueados 69/545.
- *Qué no anda:* «montó» e «interactuado» son de runtime.
- *Qué falta:* una fuente runtime versionable que el generador pueda leer. Hoy «montó» sale del barrido (529/545).
- *Dónde quedó:* el bloque de acreditación del generador y `component-stock.ts`.

**Residuales de la revisión adversarial.**
- *H-2:* conviven dos analizadores de relaciones, este índice y `scripts/inventario-organismos.mjs` de #569, con alcances distintos. Unificarlos requiere coordinación con Pablo.
- *H-5:* hay dos reglas de «generable» (generador y faker) que podrían divergir. Es riesgo documentado: hoy dan 0 contradicciones.

## 6. Al cerrar

- [x] `REPORTE.md` escrito, con el avance en la **primera línea** y sus tres secciones
      (`Completado`, `A medias`, `Pendiente`; una vacía se escribe «ninguna»).
- [x] `yarn stock:generate` corrido dos veces con diff vacío, y **`yarn dev` levantando**. `yarn start`
      ahora sirve `dist/` (drift en §0), así que el arranque de los otros cuatro se verificó con `yarn dev`.
- [x] Baseline repetido y comparado: ningún rojo **nuevo**. Lint: los mismos 244 en los mismos 195
      archivos. Typecheck: verde. Test: los rojos previos más intermitentes de la misma clase, que
      pasan aislados 61/61. `audit:vistas`: drift idéntico, fuera del diff. `check-architecture`: los
      mismos 5 hallazgos previos.
- [x] Capturas del catálogo por viewport (320 / 768 / 1600) y tema (claro / oscuro), **miradas**, con una
      línea cada una. En oscuro apareció un defecto previo del marco, que se corrigió dentro de la reserva.
- [x] Las 20 preguntas del §19 respondidas con evidencia (en `REPORTE.md`).
- [x] Procesos que quedaron corriendo: **ninguno**. `yarn dev` detenido, puerto 4200 libre, bucles de
      espera cerrados.
- [ ] La decisión sobre el aislamiento del preview, escrita donde alguien la encuentre —
      **reusando** `docs/adr/` o `docs/refactor-profesional/trabajo/DECISIONES.md`, no en carpeta nueva. —
      **No se marca: BLOCKED_BY_SCOPE** (H4.S2.M2). La decisión completa está redactada en
      `evidencia/h4/ADR-propuesta-aislamiento-del-preview.md`, pendiente de que Pablo la ubique.

## 7. Estado final

| Campo | Valor |
|---|---|
| AVANCE | 58 / 61 (95.1 %) |
| H2.S3.M2 | BLOCKED |
| H4.S2.M2 | BLOCKED_BY_SCOPE |
| H5.S2.M3 | A MEDIAS |
| Corte del producto | `origin/mockup` @ `d40b5631f68a52c79fe94f0dc689df3bc7e70140` (después avanzó a `b655e844` sin solape) |
| Rama de producto | `ender/catalogo-real-scanner-factories-tipadas` |
| FINAL_COMMIT | `bf5abde379613749a06b82347b27a46b1b9dfa44` (14 archivos, todos dentro de la reserva) |
| PR_575 | [#575](https://github.com/mdavila-2001/mantra-core-health/pull/575) OPEN · NOT_MERGED |
| Peldaño real | AUDITADO · COMMITEADO · PUSHEADO · PR ABIERTA |
| PROCESSES_LEFT_RUNNING | NONE |
| CARRIL_ENDER | CLOSED |
| IMPLEMENTATION_WORK_REMAINING_FOR_ENDER | 0 |
| RESIDUALES | 2 BLOCKED + 1 A MEDIAS, documentados y fuera de acción actual |
| DONE_FORMAL | NO |
| NEXT_ACTION_FOR_ENDER | NONE |

**Tests y gates** (medidos antes del commit `bf5abde3`):

| Gate | Resultado |
|---|---|
| Tests propios (escenarios + faker) | 62/62 PASS |
| `relaciones-de-uso` (`node --test`) | 25/25 PASS |
| `yarn typecheck` | PASS |
| ESLint de superficie (los 14 archivos) | PASS |
| `yarn stock:generate` ×2 | idempotente (sha idéntico) |
| `git diff --check` | PASS |
| Navegador (recorridos del catálogo) | PASS |
| Suite global | **NO VERDE**: fallos baseline e intermitentes ajenos al cambio (TestBed ya instanciado, cuota de storage, entorno). No se presenta como verde |
| `check-architecture` | los mismos 5 hallazgos previos, ninguno nuevo |
| `yarn audit:vistas` | drift idéntico al baseline, fuera del diff |

**Residuales exactos:**

- **H2.S3.M2 = BLOCKED.**
  - *Qué anda:* el soporte de `@nivelAtomico` está implementado y probado.
  - *Qué no puede cumplirse:* el DoD literal exige marcar un componente real fuera de la reserva.
  - *Qué falta:* editar un componente ajeno bajo `shared/components/**` o `features/**`.
  - *Quién decide:* Pablo + el dueño del componente.
- **H4.S2.M2 = BLOCKED_BY_SCOPE.**
  - *Qué anda:* la decisión de aislamiento está redactada y sustentada con evidencia.
  - *Qué no puede cumplirse:* escribirla en la ubicación documental exigida.
  - *Qué falta:* publicarla en `docs/adr/` o una ubicación equivalente del producto.
  - *Quién decide:* Pablo / coordinación.
- **H5.S2.M3 = A MEDIAS.**
  - *Qué anda:* 4 dimensiones estáticas del catálogo tienen conteo y denominador; el montaje y la interacción existen en runtime.
  - *Qué falta:* una fuente versionable de evidencia runtime, para que el generador estático pueda contar honestamente las 6.

**Cierre:**

`CARRIL_ENDER = CLOSED` · `IMPLEMENTATION_WORK_REMAINING_FOR_ENDER = 0` · `NEXT_ACTION_FOR_ENDER = NONE`

`DONE_FORMAL = NO`. La escala canónica de evidencia e integración todavía no alcanza el DONE formal:
PR #575 está OPEN · NOT_MERGED y siguen declarados 2 BLOCKED + 1 A MEDIAS. Esto no implica trabajo
pendiente para Ender.

> El carril de Ender está cerrado y no tiene acciones pendientes. `DONE_FORMAL = NO` refleja sólo la
> escala canónica de evidencia e integración y los tres residuales declarados. No significa que Ender
> deba volver periódicamente a trabajar esta tarea.

Hallazgos para otros dueños, que no se tocaron:
- 11 `selector-no-importado` reales en producto; por ejemplo, `organization-detail.html:68` usa `<button app-button>` sin importar `AppButton`.
- 7 imports que la plantilla no usa (coinciden con los NG8113 del compilador).
- `radio` y `radio-otro` necesitan un `RadioGroup` padre para montar.
- Los componentes de mapa piden teselas a OpenStreetMap.
