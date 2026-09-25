# Plan — Prompt de la noche: motor de carga masiva (CSV/XLSX) por modelo con drag & drop

- Fecha: 2026-09-25 · Repos afectados: `AlovidaPromptManager` (solo docs) · Predecesor: ninguno
- Resultado observable: cada uno de los cinco (Ender, Itzan, Justin, Marcelo, Pablo) abre su carpeta en `repartos/2026-09-25/PromptNoche/` y encuentra un prompt
  ejecutable toda la noche sin intervención, con cada dependencia externa resuelta por un camino
  alternativo escrito (regla 65), más los dos dailies que exige la estructura.
- Kill-test: `python tools/check_reparto.py repartos/2026-09-25` sale distinto de 0, o
  `python tools/check_skills_citadas.py` sale distinto de 0, o el prompt tiene una microtarea que
  dependa de otra persona sin camino alternativo escrito.

## Alcance
- IN: PLAN/REPORTE de esta sesión · cinco prompts de carril + `CONTRATO-CARGA-MASIVA.md` · cinco dailies personales ·
  `Daily-Noche-2026-09-25.md` · corrida de los dos checkers.
- OUT: cualquier archivo en los repos de producto · el conflicto de merge que quedó en
  `repartos/2026-09-22/PromptNoche/Daily-Noche-2026-09-22.md` (se anota, no se arregla) ·
  prompts para otras personas.
- Ambigüedades registradas: destinatario y turno no dichos → Pablo, noche (a confirmar con Pablo) ·
  errores parciales todo-o-nada (Q-2 del prompt) · síncrono hasta el tope de storage (Q-3).

## H1 — El prompt existe, valida y cubre el pedido completo
**CA:** Dado el reparto del 2026-09-25, cuando se corren los dos checkers, entonces salen con 0 y el
prompt tiene las tres capas con CA y DoD.
**DoD:** `python tools/check_reparto.py repartos/2026-09-25` → exit 0 · `python tools/check_skills_citadas.py` → exit 0
**Estado:** HECHO

### H1.S1 — Escribir y validar
**CA:** Dado el prompt escrito, cuando se lo valida, entonces no falta ninguna marca obligatoria.
**DoD:** salidas en `evidencia/`.
**Estado:** HECHO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H1.S1.M1 | Escribir los cinco prompts de carril y el contrato | Seis archivos con secciones 0–8 | `find repartos/2026-09-25 -name "*.md" | wc -l` | HECHO |
| H1.S1.M2 | Escribir los seis dailies (cinco personales + equipo) | Los seis existen | `ls repartos/2026-09-25/PromptNoche/` | HECHO |
| H1.S1.M3 | Validar estructura y contenido mínimo | exit 0 | `python tools/check_reparto.py repartos/2026-09-25` | HECHO |
| H1.S1.M4 | Validar skills citadas | exit 0 | `python tools/check_skills_citadas.py` | HECHO |
| H1.S1.M5 | Contar microtareas y hitos del prompt | Números pegados en el daily | `grep -c "^| H[0-9]*\.S[0-9]*\.M[0-9]* |" <prompt>` | HECHO |

## Riesgos y bloqueos previstos
| Riesgo | Impacto | Mitigación |
|---|---|---|
| El prompt cita un comando del repo de producto que no existe | Bloqueo de quien ejecuta | Todo comando citado se leyó en `package.json` o en el árbol (ver hallazgos en el prompt §1.5) |
