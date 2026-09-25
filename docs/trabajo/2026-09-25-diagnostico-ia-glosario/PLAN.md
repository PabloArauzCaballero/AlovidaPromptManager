# PLAN — Diagnóstico con IA y glosario masivo (Paquete 4, 2026-09-25)

> Pedido del propietario (verbatim, dos mensajes): «Necesito que corrijamos la estructura del front con
> diagnóstico, está mal. El flujo es: 1) se llena un formulario con preguntas estándar para identificar
> enfermedades o condiciones, y al final se selecciona una orden de análisis clínicos y un diagnóstico
> tentativo. 2) En Diagnóstico sale una tabla de diagnósticos tentativos para linkear resultados médicos,
> determinar una conclusión y cerrar el mismo.» · «Para los diagnósticos necesito que carguemos masivamente
> definiciones de todos los campos de glosario y lo nutramos profundamente al AI service.» El AI service es
> `PabloArauzCaballero/AlovidaAIService` (el minichatbot de triage).

Responsable: Justin. Se **suma** al reparto de la noche del 2026-09-25 (Farmacia, Carga Masiva, Encuentro
clínico); no reemplaza nada. Ramas: front `justin/diagnostico-ia-glosario-2026-09-25` (desde
`origin/mockup` @ `8b50d188`, worktree `wt-justin-diagnostico-ia-2026-09-25`) · AI service
`justin/glosario-corpus-diagnostico-2026-09-25` (desde `feat/triage-service` @ `5a60aec`, clon
`Alovida/AlovidaAIService`). Cierre: **PR a `mockup`** (front) y **PR a `feat/triage-service`** (AI service;
`main` está vacío). Nunca push directo.

## 0. Lo que se verificó antes de planificar (no supuestos)

| Hecho | Evidencia |
|---|---|
| El AI service **tiene el modelo activo** en el VPS | `POST https://ai.173.249.39.237.sslip.io/v1/triage/analyze` con «ando bajoneada y sin ganas de nada» → `source: "model"`, `model: google/gemini-3.1-flash-lite-preview`, `providerLatencyMs: 652`, `promptTokens: 1813`. La sección «Pendiente» del README está vieja. |
| Su conocimiento son **dos capas**: motor de síntomas copiado del front (101 síntomas, 21 zonas, `catalog:sync`, pinneado a `symptom-check-bb8e00d6`) + `anatomia.v1.ts` (70 partes, 246 sinónimos × 16 molestias) | `knowledgeVersion: "symptom-check-bb8e00d6+anatomia-v1"` · `src/modules/triage/` |
| El catálogo **entero va en el prompt en cada consulta** (`CATALOG_PROMPT`, armado una vez al cargar) y el modelo sólo puede devolver ids de `CURATED_IDS` (`sanitizeExtraction` descarta el resto) | `triage.service.ts:36-38, 22-33` |
| El contrato de salida del modelo es sólo `{symptoms, severity, durationDays}`; el servicio declara «No diagnostica» | `triage.service.ts:98`, README |
| Sin Postgres ni Redis configurados | `GET /health/ready` → `{"status":"unavailable","dependencies":{"postgres":"unconfigured","redis":"unconfigured"}}` |
| Node 24.18.1 en esta máquina; el servicio exige 22.12–22.x (sin nvm/fnm/volta) | `corepack yarn --ignore-engines` instala y compila; CI corre en 22 |
| El glosario **profundo** existe pero es chico: 70 términos curados con definición clínica, resumen llano, sinónimos, 12 categorías, 15 etiquetas y relaciones tipadas (`DISEASE`, `PROCEDURE`, `TREATMENT`, `ANATOMY`, `DIAGNOSTIC_TEST`, `RELATED_TERM`) | API `src/common/seed/glossary-terms.catalog.ts`, `glossary-taxonomy.ts` |
| El front ya lo porta con un generador: `scripts/gen-glossary-fixture.mjs` → `fixtures/glosario.generated.ts` (`yarn mock:glossary`), y le suma el **atlas anatómico de Netter** (`data/anatomy-atlas/`: 8 regiones, 65 subregiones, 548 láminas, 3 161 entradas) vía `anatomia-atlas.generated.ts` | `fixtures/glosario.ts` (`TERMINOS = curados + TERMINOS_DE_LAMINA`) |
| La API tiene 7 ETL reales (ICD-10-CM 74 719, LOINC 109 325, RxNorm, NDC, HCPCS, NUCC) contra APIs públicas del NLM, **en inglés** y no corridos contra esta base | `tools/terminology-import/README.md` |
| Las APIs del NLM responden desde acá sin clave | `clinicaltables.nlm.nih.gov/api/icd10cm/v3/search?terms=A` → 573 códigos «A…» · `loinc_items/v3/search?terms=glucose` → 1 031 |
| En `origin/mockup` **C0 está mergeado** (#693): `DiagnosisVerification`, `DiagnosisEvidence`, `NewDiagnosisVerification`, `Condition.verification`, `shared/clinical/diagnosis-state.ts`, rejilla de la consulta con 12 casillas (modal por casilla), `analysis-order-block` (rename hecho), stub `POST /clinical/conditions/:id/verification` → 404 «Pendiente: carril C3» | worktree, `diagnosis-verification.handlers.ts` |
| **C3 (diagnóstico presuntivo → confirmar/rechazar con evidencia) NO se entregó**: no hay rama `clinica-c3`, no hay `diagnosis-verify-dialog`, `ClinicalClient` no tiene `verifyCondition` | `git branch -r`, `gh pr list`, grep |
| `diagnosis-block` hoy es **sólo un formulario de alta** (CIE-10, categoría, severidad, lateralidad, curso, inicio, duración, notas). No lista, no tabla, no verificación | `diagnosis-block.html` (223 líneas) |
| «Formulario clínico» = `specialty-form-block`: selector «Qué vas a completar» (Diagnóstico · Hoja en blanco · Alergia · Cirugía · Odontología · Laboratorio · fichas de especialidad) y las fichas estándar (43 JSON con procedencia en `seed/data/clinical-forms/`, portadas por `fichas-estandar.generated.ts`) terminan en «Completar formulario» → `FormsClient.closeInstance`. **No termina en orden ni en diagnóstico tentativo** | `specialty-form-block.{ts,html}` |
| El front ya habla con el AI service por `core/data-access/triage-ia/triage-ia.client.ts` (`HttpBackend`, sin interceptores ni mock, timeout 4 s, `catchError → null`), raíz `aiBaseUrl = '/ai'`, `proxy.conf.mjs` reescribe `/ai/` al servicio | verificado en el worktree |

## 1. Diagnóstico del problema (por qué «está mal»)

1. **El diagnóstico nace suelto.** Se registra desde una casilla, sin venir de un formulario ni de una
   pregunta. El flujo pedido lo hace nacer **al cerrar el formulario**, junto con la orden de análisis.
2. **No hay resolución.** El presuntivo (`DXV-PROVISIONAL`) nunca se confirma ni se rechaza: el contrato
   existe (C0) y el simulador responde 404. No hay tabla, no hay «linkear resultado», no hay conclusión.
3. **La IA no sabe de enfermedades ni de estudios.** Su vocabulario son 101 motivos de consulta y 70
   partes del cuerpo. Sin corpus de enfermedades/pruebas con relaciones, no puede sugerir tentativos ni
   órdenes, y aunque pudiera, el prompt de 1 813 tokens no admite un glosario profundo.

## 2. Decisiones (se toman acá; no se rediscuten en los carriles)

| # | Decisión | Por qué |
|---|---|---|
| P4-1 | **Una sola fuente de verdad del corpus: el front** (`data/glossary/` + generador), y el AI service lo **sincroniza** con `catalog:sync`, pinneado a SHA, «no editar acá». | Es el patrón que el servicio ya defiende para el motor de síntomas. Dos catálogos divergen. |
| P4-2 | **El corpus es un artefacto generado con procedencia por fila**, en **NDJSON** compatible con el perfil `conceptos` del motor de carga masiva (`code`, `display`, `definition` + columnas extendidas). | El mismo archivo sirve a tres consumidores: simulador del front, AI service y —cuando se quiera— la API real por `POST /terminology/versions/{id}/import-file`. |
| P4-3 | Tres capas, con **profundidad declarada**: (a) 70 curados revisados (verbatim del seed); (b) **capa clínica ES** de atención primaria: ~200 enfermedades CIE-10 + ~120 análisis LOINC (laboratorio e imagen), con nombre ES, sinónimos, definición clínica, resumen llano, etiquetas, **síntomas del motor** y **pruebas sugeridas**, marcadas `reviewStatus: "pending-medical-review"`; (c) **capa ancha**: las categorías de 3 caracteres de ICD-10-CM completas (~1 900) bajadas del NLM, en inglés, sin definición, `lang: "en"`. | (b) es lo que hace razonar a la IA; (c) es la cobertura completa del espacio de códigos para que nunca invente uno. Definiciones ES de (b) son texto original, como manda el seed; se marcan pendientes de revisión médica igual que la tabla de síntomas («falta que el equipo médico las revise»). **No se fabrican definiciones para (c).** |
| P4-4 | **La IA nunca decide**: propone, el catálogo filtra y **el médico confirma**. El endpoint nuevo devuelve sólo slugs del corpus (misma barrera que `CURATED_IDS`), las pruebas salen de las relaciones `DISEASE→DIAGNOSTIC_TEST` del catálogo (no del modelo), y toda respuesta lleva `disclaimer` de apoyo al profesional. El diagnóstico se crea **provisional** siempre. | Regla del servicio («alarmas y especialidades las decide el catálogo, nunca el modelo») extendida. D-1 del plan maestro. |
| P4-5 | **Recuperación, no prompt**: el corpus vive indexado en memoria (índice invertido por lemas de `engine/texto.ts`); a cada consulta bajan al prompt sólo los K candidatos relevantes (K ≤ 40) como vocabulario permitido. Sin Postgres. | 1 813 tokens ya es el catálogo entero. Postgres no está configurado y el corpus (≈2 400 términos) entra en memoria. |
| P4-6 | El flujo del front se implementa **sobre los contratos congelados de C0** (§3.3 y §3.4 del PLAN-MAESTRO): `Condition` + `verification`, `NewDiagnosisVerification` con `basedOn` (`NOTE` o `ANALYSIS` → orden/informe), `NewDiagnosticOrder` con `category`. **Este carril entrega C3** (que nadie tomó) y lo anuncia en el daily. | Cero drift de contrato. C3 es exactamente «tabla de tentativos → linkear resultado → conclusión → cerrar». |
| P4-7 | El «formulario con preguntas estándar» es el **Formulario clínico** existente (fichas estándar con procedencia). No se inventa otro cuestionario: se le agrega el **cierre** (orden + diagnóstico tentativo, sugeridos por IA). | Las 43 fichas ya son cuestionarios estándar con norma y organismo. |
| P4-8 | Lo que **no** se toca: seeds de la API, esquema, `app.routes.ts`, `core/navigation/**`, `consultation.ts` (casillas), `conceptos.ts`, tipos congelados. Lo que haga falta en un tipo congelado se declara en el feature con `// TODO C8`. | §4.3 del plan maestro y contrato de carga masiva. |

## 3. Contratos

### 3.1 Fila del corpus (`data/glossary/*.ndjson`, una fila por línea)

```json
{"code":"CIE10-J45","display":"Asma bronquial","definition":"…definición clínica ES…",
 "slug":"asma-bronquial","categoryKey":"disease","tagKeys":["respiratory","chronic"],
 "codeSystem":"icd10cm","externalCode":"J45","lang":"es",
 "esSynonyms":["asma","crisis asmática"],"plainSummaryEs":"…",
 "symptomIds":["tos","falta-de-aire","asma"],
 "relations":[{"type":"DIAGNOSTIC_TEST","targetSlug":"espirometria"},{"type":"TREATMENT","targetSlug":"salbutamol"}],
 "reviewStatus":"pending-medical-review","source":"alovida-curated-2026-09-25"}
```

- `code`, `display`, `definition` son las tres columnas del perfil `conceptos`; el resto son extensiones que
  el importador de la API ignora y el generador del front lee.
- `symptomIds` sólo admite ids del motor de síntomas (`symptom-check/sintomas.datos.ts`); el generador
  falla si uno no existe. `relations[].targetSlug` debe resolver contra el corpus completo (curados + capa
  clínica); las huérfanas se omiten con aviso, como hoy.
- La capa ancha (`cie10cm-categorias.generated.ndjson`) trae `lang: "en"`, sin `definition`, `categoryKey:
  "disease"`, `reviewStatus: "external-source"`, `source: "nlm-clinicaltables-icd10cm"`.

### 3.2 `TerminoDeGlosario` (front, generado) gana campos **opcionales**

`externalCode?: { system: string; code: string }` · `lang?: 'es' | 'en'` · `symptomIds?: readonly string[]` ·
`reviewStatus?: string` · `source?: string`. `fichaEnLinea` los publica en `properties` (ya es
`Record<string, unknown>` en el contrato): ninguna pantalla cambia de tipo.

### 3.3 AI service — `POST /v1/diagnosis/suggest` (nuevo, público como el triage, mismo CORS/rate-limit)

```json
{ "answers": [{"question":"¿Tiene fiebre?","answer":"sí, 38.5 desde hace 3 días"}],
  "symptomCodes": ["fiebre","tos"], "freeText": "…", "patient": {"ageYears": 34, "sex": "F"} }
```
→
```json
{ "source": "model" | "catalog",
  "tentativeDiagnoses": [{"slug":"neumonia","code":"J18","codeSystem":"icd10cm","label":"Neumonía",
      "score":0.82,"why":"Por fiebre, tos y dolor de pecho.",
      "suggestedTests":[{"slug":"radiografia-de-torax","code":"24627-2","codeSystem":"loinc","label":"Radiografía de tórax","category":"IMAGING"}]}],
  "suggestedOrders": [{"slug":"hemograma-completo","code":"58410-2","codeSystem":"loinc","label":"Hemograma completo","category":"LAB","forDiagnoses":["neumonia"]}],
  "disclaimer":"Apoyo al criterio médico; no es un diagnóstico. El diagnóstico nace como presuntivo y lo confirma o rechaza el profesional.",
  "knowledgeVersion":"symptom-check-bb8e00d6+anatomia-v1+glosario-v1-<sha>",
  "model":"…","providerLatencyMs":0,"usage":{} }
```
- Determinista (siempre responde): síntomas (de `symptomCodes` + motor sobre `answers`/`freeText`) →
  puntaje por enfermedad vía `symptomIds` del corpus → top-N; pruebas por relación `DIAGNOSTIC_TEST`.
- Con modelo: los top-K candidatos (recuperación) son el vocabulario del prompt; el modelo devuelve
  `{"diagnoses":[{"slug","score","why"}]}` y **todo slug fuera de los candidatos se descarta**.
- `GET /v1/glossary/catalog` → `{knowledgeVersion, counts:{terms, diseases, tests, synonyms, relations}}`.
- Sin texto persistido ni registrado (misma política que el triage). `patient` no admite identificadores.
- OpenAPI regenerado (`yarn docs:generate`); `docs:check` sin drift; pruebas con proveedor falso.

### 3.4 Front — `DiagnosisIaClient` (`core/data-access/triage-ia/diagnosis-ia.client.ts`)

Mismo patrón que `TriageIaClient`: `HttpBackend`, sin interceptores, timeout 6 s, forma validada,
`catchError → null`. El cierre del formulario funciona igual sin IA (el médico elige a mano).

### 3.5 Front — cierre del formulario y verificación (contratos C0, sin cambios)

- Al «Completar formulario»: `closeInstance` → si eligió diagnóstico: `createCondition` (nace
  `DXV-PROVISIONAL`, `encounterId`, `noteText` = «Del formulario ⟨nombre⟩») → si eligió orden:
  `requestStudy` (`category`, `encounterId`). Ambas opcionales; se ejecutan en serie y cada fallo se dice.
- Verificación: `ClinicalClient.verifyCondition(id, NewDiagnosisVerification)` → `POST
  /clinical/conditions/:id/verification`; simulador según §3.4 del plan maestro (404 · 409 si no está en
  `DXV-PROVISIONAL` · 422 sin `reasonText` **y** sin `basedOn` · 422 evidencia ajena o inexistente · 422 al
  confirmar sin fin ni curso crónico).

## 4. Carriles (secuenciales en esta sesión; cada uno cierra con commit propio)

| Carril | Repo | Qué entrega | Archivos (todos nuevos salvo los marcados ✎) | DoD |
|---|---|---|---|---|
| **D1 — Corpus masivo del glosario** | front | `data/glossary/00_README.md` (procedencia, licencias, `reviewStatus`), `enfermedades-atencion-primaria.ndjson` (~200), `analisis-frecuentes.ndjson` (~120), `cie10cm-categorias.generated.ndjson` (~1 900, NLM); `scripts/fetch-icd10cm-categories.mjs`; ✎ `scripts/gen-glossary-fixture.mjs` (lee seed + NDJSON, valida `symptomIds`/relaciones, escribe campos nuevos); ✎ `fixtures/glosario.generated.ts` (regenerado); ✎ `fixtures/glosario.ts` (`fichaEnLinea` publica `properties`); `fixtures/glosario.spec.ts` (conteos, integridad, sin slugs repetidos, todo `symptomId` existe) | `yarn mock:glossary` corre; `yarn typecheck` 0; spec del fixture y `features/glossary/*.spec.ts` verdes; la pantalla `/glossary` muestra las categorías con sus conteos nuevos (captura) |
| **D2 — AI service: capa `glosario.v1` + recuperación + `/v1/diagnosis/suggest`** | AI service | ✎ `scripts/sync-catalog.mjs` (copia además `glosario.generated.ts` y los NDJSON a `src/modules/knowledge/corpus/`, pinnea SHA); `src/modules/knowledge/{glossary-index.ts, glossary.types.ts}`; `src/modules/diagnosis/{diagnosis-core.ts, diagnosis.service.ts, diagnosis.controller.ts}`; ✎ `app.module.ts`; ✎ `triage-core.ts` (sólo `TRIAGE_KNOWLEDGE_VERSION` suma `+glosario-v1-<sha>`); `test/{glossary-index,diagnosis-core,diagnosis}.test.ts`; ✎ `docs/contracts/openapi.json`; ✎ `README.md` | `corepack yarn --ignore-engines build && node --test dist/test/*.test.js` verde (75 previas + nuevas, salida pegada); `docs:check` 0; con proveedor falso: un slug inventado por el modelo **se descarta**; determinista: «fiebre + tos + dolor de pecho» → `neumonia` entre los 3 primeros con `radiografia-de-torax` sugerida |
| **D3 — Front: Diagnóstico = tabla de tentativos → evidencia → conclusión → cierre (C3)** | front | ✎ `diagnosis-block.{ts,html,css,spec.ts}` (tabla `app-data-table`: Diagnóstico · Estado (`diagnosisStateOf`) · Evidencia · Acciones); `diagnosis-verify-dialog/**` (Confirmar/Rechazar, motivo ≤500, evidencia: orden o informe del paciente (`getPatientDiagnostics`) o nota; al confirmar: inicio + fin esperado o crónico); ✎ `clinical.client.ts` (+`verifyCondition`, sólo agregar) ; ✎ `handlers/diagnosis-verification.handlers.ts` (real, reglas §3.5) + spec; ✎ `fixtures/clinica.ts` sólo región `CondicionSimulada`/`condiciones` (`verification`) | specs del bloque, del diálogo y del handler verdes; `typecheck` 0; recorrido en navegador: registrar presuntivo → aparece «En estudio» → Confirmar con informe → «Enfermedad activa»; Rechazar → «Rechazado» (capturas) |
| **D4 — Front: el formulario termina en orden + diagnóstico tentativo, sugeridos por IA** | front | `form-conclusion-block/**` (sugerencias de IA + selector de diagnóstico (`concept-select`, target `clinical.conditions.code_concept_id`) + orden (categoría + `concept-select`)); ✎ `specialty-form-block.{ts,html,spec.ts}` (sólo incrustar el bloque antes de `app-form-actions` y encadenar las dos altas en `completar()`); `core/data-access/triage-ia/{diagnosis-ia.client.ts, diagnosis-ia.types.ts, diagnosis-ia.client.spec.ts}` | specs verdes; sin servicio (`null`) el cierre sigue funcionando a mano; con el servicio vivo (`/ai`), una ficha respondida con fiebre y tos propone `neumonia` y `radiografia-de-torax` (captura); al completar, la casilla «Diagnóstico» de la consulta cuenta uno más y «Orden de análisis» lista la orden |

**Orden de ejecución: D1 → D2 → D3 → D4.** D3 no depende de la IA; D4 depende del contrato de D2 (con
doble local si el servicio no está desplegado con el cambio). El despliegue del AI service al VPS
(`deploy/deploy-contabo.sh`) lo hace quien tenga SSH; hasta entonces el front apunta al servicio viejo y
D4 cae al camino manual.

## 5. Calidad y evidencia (reglas de la casa)

- Front: `corepack yarn typecheck`, `corepack yarn lint` (sin rojos nuevos; hay 6 preexistentes),
  `npx ng test --include=<spec> --watch=false` por carpeta (uno por vez: la suite completa da verde falso
  bajo carga). Playwright a mano con un `.mjs` suelto contra `yarn start` en el puerto **4220** (el
  runner y `pw-guard` no están); capturas en `docs/trabajo/2026-09-25-diagnostico-ia-glosario/evidencia/`
  del front.
- AI service: `corepack yarn --ignore-engines build && node --test dist/test/*.test.js` (node 24 local;
  CI en 22), `docs:check`.
- Nada «En construcción». Sin datos reales de pacientes. Sin uuids ni códigos en pantalla para el
  paciente. Identificadores en inglés, prosa en castellano.

## 6. Fuera de alcance (dicho, no escondido)

- Sembrar el corpus en la **API real** (`glossary-terms.catalog.ts` es seed: prohibido tocarlo esta
  noche). Queda el camino: el NDJSON entra por el motor de carga masiva con un sistema `icd10cm`/`loinc`.
- Revisión médica de las definiciones de la capa (b): quedan marcadas `pending-medical-review`.
- Persistencia del corpus en Postgres del AI service y embeddings: no hacen falta con ≈2 400 términos.
- Desplegar el AI service al VPS: requiere SSH que esta máquina no tiene.

## 7. Riesgos

| Riesgo | Mitigación |
|---|---|
| Marcelo retoma C3 en paralelo | Este plan y el daily lo anuncian; los archivos de C3 se tocan sólo acá; C8 (Justin) integra |
| El front paginado del glosario con ~2 400 términos | `/glossary` ya pagina por categoría y letra; la capa (c) va en inglés y se marca; se mide el tamaño de `glosario.generated.ts` (hoy 1 762 líneas; el atlas ya pesa 45 859) y el presupuesto del build (1,29 de 1,3 MB) → si se pasa, la capa (c) se carga **diferida** (`import()` en el handler) |
| Sesgo del modelo hacia el primer candidato | `temperature: 0`, `why` obligatorio, orden final por puntaje determinista + modelo, nunca sólo modelo |
