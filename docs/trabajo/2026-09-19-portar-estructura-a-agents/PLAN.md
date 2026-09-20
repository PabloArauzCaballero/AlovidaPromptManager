# Plan — Portar el estándar a `.agents/` para herramientas de IA de terceros

- Fecha: 2026-09-19 · Repos afectados: AlovidaPromptManager · Predecesor: catálogo de 176 skills + 13 reglas
- Resultado observable: un programador que usa Cursor, Codex, Copilot o cualquier otra IA abre el
  repo y su herramienta lee el mismo estándar que lee Claude Code, sin que nadie tenga que copiar
  nada a mano ni pueda quedar desincronizado en silencio.
- Kill-test: editar una skill en `.claude/` y que `python tools/sync_agents.py --check` siga
  diciendo OK — eso probaría que la deriva no se detecta y el espejo miente.

## Alcance
- **IN**: espejo `.agents/` generado, detección de deriva, `AGENTS.md` en la raíz, punteros para
  las herramientas más usadas, y probar los dos pendientes abiertos (falsos positivos del eval,
  hooks en sesión real).
- **OUT**: portar los hooks a otras herramientas (no tienen API equivalente); reescribir skills
  para otros stacks; commit y push (se decide aparte con el usuario).
- **Ambigüedades registradas**: no sé qué herramientas usa exactamente el equipo. Supuesto tomado:
  cubrir el estándar `AGENTS.md` (que leen Codex, Cursor, Zed, Aider, Jules) más punteros
  explícitos para Cursor y Copilot. A confirmar con el usuario.

## H1 — El espejo `.agents/` existe y no puede desincronizarse en silencio
**CA:** Dado que alguien edita, agrega o borra una skill o regla en `.claude/`, cuando corre
`python tools/sync_agents.py --check` sin haber sincronizado, entonces el comando falla con
salida 1 y nombra exactamente el archivo en deriva.
**DoD:** `--self-test` en verde con salida pegada · `--check` detectando una deriva provocada a
propósito · `--check` en OK tras sincronizar.
**Estado:** HECHO — evidencia en `evidencia/h1-sync.txt`

### H1.S1 — Script de sincronización con verificación
**CA:** El script copia `skills/` y `rules/`, ignora `__pycache__` y `runtime`, borra huérfanos
del destino, y distingue los tres tipos de deriva (falta / difiere / sobra).
**DoD:** salida literal del `--self-test`.

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H1.S1.M1 | Escribir `tools/sync_agents.py` con `--check` y `--self-test` | El archivo existe y es ejecutable | `python tools/sync_agents.py --help` → muestra las 3 opciones | HECHO |
| H1.S1.M2 | Probar el script contra un árbol temporal | Las 12 aserciones pasan | `--self-test` → `12 PASS, 0 FAIL` | HECHO |
| H1.S1.M3 | Generar el espejo real | `.agents/skills` y `.agents/rules` con el mismo contenido | `sync` → 192 archivos; `--check` → OK | HECHO |
| H1.S1.M4 | Probar el kill-test | Tocar una skill y que `--check` falle | deriva provocada → exit 1 nombrando `skills/clean-code/SKILL.md` | HECHO |

## H2 — Cualquier IA que abra el repo encuentra el estándar
**CA:** Dado un programador con una herramienta distinta de Claude Code, cuando abre el repo,
entonces su herramienta carga un archivo que le dice las reglas no negociables, el formato
obligatorio de plan y reporte, y dónde está el catálogo completo.
**DoD:** `AGENTS.md` en la raíz + punteros por herramienta; ningún enlace roto.
**Estado:** HECHO — 275 líneas, 23 enlaces verificados, 0 rotos

### H2.S1 — Entrada cross-tool
| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H2.S1.M1 | Escribir `AGENTS.md` con reglas, formato de plan/reporte y índice | Existe y cubre las 3 secciones | script que verifica las secciones presentes | HECHO |
| H2.S1.M2 | Declarar explícitamente **qué NO se porta** (los hooks) | La sección existe y explica por qué | grep de la sección | HECHO |
| H2.S1.M3 | Punteros para Cursor y Copilot | Los archivos existen y apuntan a `AGENTS.md` | listar archivos + verificar que referencian rutas reales | HECHO |
| H2.S1.M4 | Verificar que ningún enlace de `AGENTS.md` esté roto | 0 enlaces rotos | script que resuelve cada ruta citada | HECHO |

## H3 — Los pendientes abiertos quedan probados o declarados
**CA:** Dado el reporte anterior que listaba pendientes, cuando se cierra este trabajo, entonces
cada pendiente está probado con evidencia o declarado como no hecho con su razón.
**DoD:** evidencia pegada por cada uno.
**Estado:** HECHO

> Corrección del plan: este hito tenía microtareas colgando directo del hito (`H3.M1`), sin capa
> de subtarea — **violaba la regla 20 §2**, que exige las tres capas. Corregido a `H3.S1.*`.
> Lo detectó `plan_status.py`, que contaba 8 de 11 microtareas.

### H3.S1 — Cerrar los pendientes declarados en el reporte anterior
**CA:** Cada pendiente del reporte previo queda probado con evidencia o declarado no hecho con su razón.
**DoD:** salida literal por cada uno en `evidencia/`.

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H3.S1.M1 | Hooks en sesión real de Claude Code | El hook bloquea una escritura real | `plan_gate` bloqueó el Write de `tools/sync_agents.py` en esta sesión, con su mensaje | HECHO |
| H3.S1.M2 | Escenarios negativos para medir falsos positivos | 30 pedidos que NO deberían cargar skill, juzgados a ciegas | juez ciego → tasa de falsos positivos con salida pegada | HECHO |
| H3.S1.M3 | `report_gate` bloqueando un cierre real | El gate impide cerrar sin `REPORTE.md` | bloqueó el cierre de esta sesión nombrando las 7 microtareas abiertas | HECHO |
| H3.S1.M4 | `plan_status` no descarta microtareas en silencio | Avisa de las filas que no puede parsear | fila `H3.M1` → reportada + porcentaje marcado NO CONFIABLE | HECHO |

## Riesgos y bloqueos previstos
| Riesgo | Impacto | Mitigación |
|---|---|---|
| El espejo se edita a mano y se pierde trabajo | Medio | Aviso `LEEME-GENERADO.md` en cada carpeta destino + `--check` en CI |
| Las herramientas de terceros no leen `AGENTS.md` | Alto — el trabajo no sirve | Punteros específicos por herramienta además del estándar |
| Los hooks no se portan y otras IAs no tienen candado | Alto | Declararlo explícito en `AGENTS.md`; la obligación queda escrita aunque no sea forzable |
