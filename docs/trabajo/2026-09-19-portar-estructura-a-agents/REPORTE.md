# Reporte — Portar el estándar a `.agents/` para herramientas de IA de terceros

- Fecha: 2026-09-19 · Plan: [PLAN.md](./PLAN.md) · Rama: `main`
- Peldaño de evidencia alcanzado: **VERIFIED** (cada microtarea con la salida de su DoD)
- Avance: **12 / 12 microtareas HECHO (100%)** — calculado por `plan_status.py`, no estimado

## Completado

### H1 — El espejo `.agents/` no puede desincronizarse en silencio

| ID | Qué se logró | Comando | Resultado |
|---|---|---|---|
| H1.S1.M1 | `tools/sync_agents.py` con `--check` y `--self-test` | `--help` | 3 opciones expuestas |
| H1.S1.M2 | Pruebas sobre árbol temporal, no solo funciones puras | `--self-test` | `12 PASS, 0 FAIL` |
| H1.S1.M3 | Espejo generado desde `.claude/` | `sync_agents.py && --check` | 192 archivos, sin deriva |
| H1.S1.M4 | **Kill-test**: deriva provocada | `--check` tras tocar el espejo | exit 1, nombra el archivo exacto |

Verificación posterior en uso real: tras editar 2 descriptions, `sync` copió **exactamente 2**
archivos y `--check` volvió a OK.

### H2 — Cualquier IA que abra el repo encuentra el estándar

| ID | Qué se logró | Verificación | Resultado |
|---|---|---|---|
| H2.S1.M1 | `AGENTS.md` en la raíz, 275 líneas | secciones requeridas | 14/14 presentes |
| H2.S1.M2 | Sección "Qué NO se porta" | `grep` | línea 236, explícita |
| H2.S1.M3 | `.github/copilot-instructions.md` (32) y `.cursor/rules/estandar-de-la-casa.mdc` (37) | `ls` | ambos existen |
| H2.S1.M4 | Enlaces de `AGENTS.md` | script resolvedor | 23 internos, **0 rotos** |

Confirmado en fuente oficial: la ubicación de `AGENTS.md` y su precedencia por cercanía en el
árbol; que las reglas de Cursor van en `.cursor/rules/*.mdc` y que **los `.md` ahí se ignoran** —
por eso el puntero es `.mdc` con frontmatter; y que Copilot lee tanto
`.github/copilot-instructions.md` como `AGENTS.md`.

### H3 — Pendientes cerrados

| ID | Qué se logró | Evidencia |
|---|---|---|
| H3.S1.M1 | `plan_gate` en sesión real | Bloqueó el `Write` de `tools/sync_agents.py` por falta de `PLAN.md` |
| H3.S1.M2 | Falsos positivos medidos | 8/30 bruto → **2/30 defectos reales**; ambos corregidos |
| H3.S1.M3 | `report_gate` en sesión real | Bloqueó el cierre y nombró las 7 microtareas abiertas |
| H3.S1.M4 | `plan_status` deja de sub-contar | Reporta la fila y marca el % `NO CONFIABLE` |

Las 2 descriptions corregidas: `ux-writing-microcopy` (cuantificador universal "cualquier texto de
UI" → dispara al **decidir** qué dice) y `refactoring-safely` (verbo sin objeto "al extraer o
renombrar" → "**un símbolo, función o módulo en código**"). Detalle en
[`../../evals/REPORTE-FALSOS-POSITIVOS.md`](../../evals/REPORTE-FALSOS-POSITIVOS.md).

## A medias

Ninguna.

## Pendiente

| Ítem | Estado | Qué lo destraba |
|---|---|---|
| Push a GitHub | BLOQUEADO | Requiere confirmación explícita del usuario: es una acción hacia afuera |
| `sync_agents --check` en CI | PENDIENTE | No hay workflow todavía; hoy el gate depende de que alguien lo corra |
| Punteros para otras herramientas (Windsurf, Cline, Continue) | PENDIENTE | Depende de saber qué usa el equipo |

## Evidencia

```text
$ python tools/sync_agents.py --self-test
sync_agents self-test: 12 PASS, 0 FAIL

$ python tools/sync_agents.py --check
sync --check: OK, 192 archivo(s) en espejo, sin deriva

$ (deriva provocada) python tools/sync_agents.py --check
sync --check: DERIVA DETECTADA entre .claude/ y .agents/
  [difiere] rules/00-no-negociables.md
exit=1

$ python .claude/hooks/plan_status.py --root <plan con fila malformada>
  Avance: 1/1 microtareas HECHO  (100.0%)  <-- NO CONFIABLE: 1 fila(s) sin contar
    ! fila ignorada: 'H3.M1' no es un ID de microtarea valido

$ self-tests de los hooks
plan_gate      11 PASS, 0 FAIL
report_gate    14 PASS, 0 FAIL
plan_status    30 PASS, 0 FAIL

$ integridad final
skills: 176 | reglas: 14 | espejo: 194 archivos | name==carpeta: OK

$ enlaces de AGENTS.md
enlaces internos verificados : 23   ROTOS: 0
```

## No cubierto

Se hizo, pero **no se verificó**:

- **Ninguna herramienta de terceros leyó el espejo todavía.** Que `AGENTS.md` y `.agents/` existan
  y que las rutas estén confirmadas en documentación **no prueba** que Cursor o Codex los carguen
  en la práctica. Eso requiere abrir el repo con esas herramientas.
- **`sync_agents --check` nunca corrió en CI.** Como gate automático no existe.
- **Los hooks se probaron solo en Windows.** Sin evidencia en Linux ni macOS.
- **Las 176 skills siguen sin ejercitarse en una tarea de producto real.** Verificadas de forma,
  de enrutamiento y de falsos positivos; no de utilidad.
- **La medición de falsos positivos es de muestra chica** (30 casos, un solo juez, que además
  escribió los escenarios). No permite afirmar una tasa estable.

## Desvíos del plan

- **El hito H3 se escribió violando la regla 20**: microtareas colgando directo del hito (`H3.M1`),
  sin capa de subtarea. Corregido a `H3.S1.*` durante la ejecución. Lo detectó `plan_status.py`
  al contar 8 microtareas donde había 11 — no una revisión humana.
- **Se agregó H3.S1.M4**, no previsto: el sub-conteo silencioso apareció al investigar el desvío
  anterior. Se sumó al plan en vez de arreglarlo "de paso".
- **`AGENTS.md` quedó en 275 líneas** contra las ~150-200 de la directiva. El exceso son los dos
  esqueletos copiables de `PLAN.md` y `REPORTE.md`, que es lo que hace la sección autosuficiente.
  Desvío aceptado.

## Riesgos residuales

| Riesgo | Impacto | Estado |
|---|---|---|
| Alguien edita `.agents/` a mano y pierde el cambio | Medio | Mitigado con `LEEME-GENERADO.md`; **no** mitigado en CI |
| Las herramientas de terceros no leen los archivos en la práctica | Alto | Sin verificar (ver "No cubierto") |
| Otras IAs no tienen candado automático | Alto | Aceptado y documentado; no resoluble desde este repo |

## Decisiones y ambigüedades

- **Espejo en vez de symlink**: en Windows los symlinks requieren privilegios y git los trata de
  forma inconsistente entre plataformas.
- **Los hooks NO se copian a `.agents/`**: implementan la API de hooks de Claude Code. Copiarlos
  daría falsa sensación de protección en herramientas que no pueden ejecutarlos.
- **No se afirmó nada sobre `.cursorrules`**: varios blogs lo dan por deprecado, pero la
  documentación oficial de Cursor no lo menciona. Se omitió en vez de inventar.
- **Ambigüedad abierta**: no sé qué herramientas usa realmente el equipo. Supuesto tomado: cubrir
  `AGENTS.md` más punteros para Cursor y Copilot. **A confirmar con el usuario.**
- **Push no ejecutado por decisión propia**: subir a GitHub es una acción hacia afuera y no fue
  autorizada explícitamente.
