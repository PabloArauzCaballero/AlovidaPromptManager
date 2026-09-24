# Plan — Publicar el plan del módulo médico

- Fecha: 2026-09-24 · Repo afectado: `PabloArauzCaballero/AlovidaPromptManager` · Predecesor: PR 616 de `mantra-core-health`
- Resultado observable: la rama principal del repositorio muestra el paquete completo del plan médico dentro de `planes/02-medical-module-plan-b57dfd316c4d/`.
- Kill-test: comparar recursivamente los hashes SHA-256 del origen y del destino; cualquier archivo faltante, extra o distinto falla la entrega.

## Alcance

- IN: copiar sin modificar los 50 archivos del paquete `MetaPrompts/02-medical-module-plan-b57dfd316c4d`; registrar esta publicación.
- OUT: editar el contenido del plan, sus evidencias, las skills o las reglas del repositorio.
- Ambigüedades registradas: “carpeta del plan” se interpreta como el paquete médico asociado al PR 616; destino pedido: `planes/` en AlovidaPromptManager.

## H1 — Paquete médico disponible en AlovidaPromptManager

**CA:** Dado el paquete médico existente, cuando se consulta la rama principal del repositorio, entonces aparecen los mismos 50 archivos bajo `planes/02-medical-module-plan-b57dfd316c4d/`, con contenido idéntico al origen.

**DoD:** comparación recursiva de hashes SHA-256 sin diferencias; la única salida de `git diff --check` corresponde a ocho espacios finales preservados del metaprompt original; publicación confirmada mediante GitHub.

**Estado:** A MEDIAS

### H1.S1 — Copiar y publicar el paquete

**CA:** el destino conserva nombres, estructura y bytes del origen. **DoD:** hash recursivo idéntico y commit publicado. **Estado:** A MEDIAS

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H1.S1.M1 | Copiar el paquete completo | Existen exactamente los mismos 50 archivos | Comparación de manifiestos SHA-256 → sin diferencias | HECHO |
| H1.S1.M2 | Publicar el cambio | El contenido aparece en GitHub bajo `planes/` | `gh` confirma commit y ruta en la rama principal | TODO |

## Riesgos y bloqueos previstos

| Riesgo | Impacto | Mitigación |
|---|---|---|
| Omitir evidencias o binarios | Paquete incompleto | Comparar manifiestos de hashes, no solo nombres |
| Publicar datos reales de personas | Exposición de PII/PHI | El paquete proviene de un repositorio público y usa datos sintéticos; buscar secretos textuales antes de publicar |
