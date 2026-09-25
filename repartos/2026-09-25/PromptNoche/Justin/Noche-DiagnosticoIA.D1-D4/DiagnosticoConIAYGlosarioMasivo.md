# Justin — Paquete 4: Diagnóstico con IA y glosario masivo (D1–D4)

Pedido del propietario del 2026-09-25 (dos mensajes), agregado después del reparto. **No reemplaza** los
carriles A (Farmacia), B (Carga masiva) ni C (Encuentro clínico): se suma.

El plan completo, con hechos verificados, decisiones P4-1…P4-8, contratos y DoD por carril, está en
[`docs/trabajo/2026-09-25-diagnostico-ia-glosario/PLAN.md`](../../../../../docs/trabajo/2026-09-25-diagnostico-ia-glosario/PLAN.md).

| Carril | Repo | Rama | En una línea |
|---|---|---|---|
| D1 | front | `justin/diagnostico-ia-glosario-2026-09-25` | Corpus masivo del glosario en `data/glossary/*.ndjson` (curados + capa clínica ES + ICD-10-CM completo del NLM) y generador extendido |
| D2 | AlovidaAIService | `justin/glosario-corpus-diagnostico-2026-09-25` | Capa `glosario.v1` sincronizada, índice de recuperación y `POST /v1/diagnosis/suggest` con barrera de catálogo |
| D3 | front | (misma rama) | Diagnóstico como tabla de presuntivos → evidencia (orden/informe/nota) → confirmar o rechazar → estado. **Entrega C3**, que nadie tomó |
| D4 | front | (misma rama) | El Formulario clínico termina en orden de análisis + diagnóstico tentativo, sugeridos por la IA |

Orden: D1 → D2 → D3 → D4. Cierre: PR a `mockup` (front) y PR a `feat/triage-service` (AI service).
