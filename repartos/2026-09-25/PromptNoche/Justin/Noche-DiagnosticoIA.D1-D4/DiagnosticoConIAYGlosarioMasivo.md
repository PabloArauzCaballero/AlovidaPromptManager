# Justin — Paquete 4: Diagnóstico con IA y glosario masivo (D1–D4)

Pedido del propietario del 2026-09-25 (dos mensajes), agregado después del reparto. **No reemplaza** los carriles A (Farmacia), B (Carga masiva) ni C (Encuentro clínico): se suma.

## 1. Antes de escribir una línea — instalación OBLIGATORIA del estándar

```bash
git -C <raiz>/AlovidaPromptManager pull --ff-only origin main
cd <worktree-del-repo-objetivo>
cp -rn ../AlovidaPromptManager/.claude/skills/* .claude/skills/
cp -rn ../AlovidaPromptManager/.claude/rules .claude/ 2>/dev/null || cp -rn ../AlovidaPromptManager/.claude/rules/* .claude/rules/
cp -rn ../AlovidaPromptManager/.claude/hooks .claude/ 2>/dev/null || true
python .claude/hooks/plan_gate.py --self-test
```

Entrada al catálogo: `skills-router`.

## 2. Resultado observable y kill-test

Se entrega D1→D4 con el glosario masivo sincronizado, endpoint de sugerencias operativo y flujo clínico que termina en orden + diagnóstico tentativo.

**Kill-test:** si no existe evidencia verificable para D1, D2, D3 y D4, el paquete no se cierra.

## 3. Contexto del paquete

El plan completo, con hechos verificados, decisiones P4-1…P4-8, contratos y DoD por carril, está en [`docs/trabajo/2026-09-25-diagnostico-ia-glosario/PLAN.md`](../../../../../docs/trabajo/2026-09-25-diagnostico-ia-glosario/PLAN.md).

| Carril | Repo | Rama | En una línea |
|---|---|---|---|
| D1 | front | `justin/diagnostico-ia-glosario-2026-09-25` | Corpus masivo del glosario en `data/glossary/*.ndjson` (curados + capa clínica ES + ICD-10-CM completo del NLM) y generador extendido |
| D2 | AlovidaAIService | `justin/glosario-corpus-diagnostico-2026-09-25` | Capa `glosario.v1` sincronizada, índice de recuperación y `POST /v1/diagnosis/suggest` con barrera de catálogo |
| D3 | front | (misma rama) | Diagnóstico como tabla de presuntivos → evidencia (orden/informe/nota) → confirmar o rechazar → estado. **Entrega C3**, que nadie tomó |
| D4 | front | (misma rama) | El Formulario clínico termina en orden de análisis + diagnóstico tentativo, sugeridos por la IA |

**OUT:** no reemplazar ni modificar entregables de los carriles A, B o C; este paquete es adicional y se integra sin alterar su alcance.

## 4. Plan de ejecución

### H1 — Ejecutar y cerrar D1–D4

**CA:** Dado el paquete adicional D1–D4, cuando se ejecuta en orden, entonces quedan disponibles corpus, servicio y flujo clínico hasta el cierre con diagnóstico tentativo.
**DoD:** cada microtarea en `HECHO` con evidencia en el plan de trabajo referenciado.
**Estado:** TODO

#### H1.S1 — Secuencia de entrega del paquete

**CA:** El mismo de H1, en una subtarea única para preservar el orden D1→D4.
**DoD:** El mismo de H1, con la evidencia mínima de cada carril.
**Estado:** TODO

| ID | Microtarea | CA | Definition of Done | Estado |
|---|---|---|---|---|
| H1.S1.M1 | D1 corpus y generador | Corpus masivo listo y versionado | evidencia de archivos `data/glossary/*.ndjson` | TODO |
| H1.S1.M2 | D2 API de sugerencias | `POST /v1/diagnosis/suggest` con barrera de catálogo | evidencia de pruebas del servicio | TODO |
| H1.S1.M3 | D3 flujo de diagnóstico | tabla de presuntivos + confirmar/rechazar + estado | evidencia funcional del flujo D3 | TODO |
| H1.S1.M4 | D4 cierre en formulario clínico | formulario termina en orden + diagnóstico tentativo sugerido | evidencia funcional del flujo D4 | TODO |

## 5. Ambigüedades registradas

| Ambigüedad | Supuesto tomado | A quién confirmar |
|---|---|---|
| Ninguna al momento del reparto | Si aparece una, se registra acá antes de implementarla | Pablo |

## 6. Definition of Done del hito

El hito queda `HECHO` cuando las cuatro microtareas del paquete están `HECHO` con evidencia verificable; si falta cualquiera, queda `A MEDIAS` con detalle explícito de qué anda, qué no anda y qué falta.
