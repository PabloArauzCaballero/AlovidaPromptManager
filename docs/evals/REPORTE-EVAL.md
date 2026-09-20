# Reporte — Eval de disparo de skills

- Fecha: 2026-09-19 · Catálogo final: 176 skills · Escenarios: 352
- Pregunta que responde: **¿las `description` hacen que se cargue la skill correcta cuando alguien
  describe un problema real?**

## Resultado final (ronda 2)

```
                 Ronda 1      Ronda 2
Top-1             97.1%   →    99.1%
  directo        100.0%   →    99.4%
  oblicuo         94.3%   →    98.9%
Top-3            100.0%   →   100.0%
Fallos              10    →       3
```

Entre ambas rondas: se afilaron 24 `description` con cláusulas de frontera, se corrigieron 3
etiquetas mal puestas del set dorado (registradas en `correcciones-set-dorado.json`) y se sumaron
2 skills que la ronda 1 no cubría. Los jueces de la ronda 2 fueron nuevos, con mezcla de semilla
distinta y prohibición explícita de mirar los resultados anteriores.

### El arreglo que no arregló nada

`backend-development` ↔ `nestjs-development` **no se resolvió en la ronda 2: se dio vuelta.**
En la ronda 1 fallaba el oblicuo de `backend-development`; en la ronda 2 falló el de
`nestjs-development`. La edición movió la frontera en vez de definirla. Neto: cero.

Sin el desglose por caso, el promedio de 97.1% → 99.1% habría ocultado esto por completo. Es la
razón por la que el criterio de aceptación se fija **antes** de medir.

**Causa real:** el escenario oblicuo de `nestjs-development` es sobre *un body sin validar*, que es
territorio de DTOs y `ValidationPipe`. Al quitarle "controllers finos" para cederle las capas a
`backend-development`, la description perdió también su reivindicación sobre validación de entrada,
que nunca estuvo en disputa.

### Ronda 3 — verificación dirigida

Nueve casos: los dos lados del par más siete controles vecinos, juez nuevo.

```
nestjs-development-oblicuo   -> nestjs-development    ✓ (antes fallaba)
backend-development-oblicuo  -> backend-development   ✓ (no se revirtió)
7 controles                  -> sin cambios           ✓
```

Criterios fijados antes de ver el resultado, los tres cumplidos.

### Los 2 fallos restantes: variación, no defecto

- `database-design-directo` ("esquema de cotizaciones desde cero") — en la ronda 1 el juez acertó
  pero con confianza **media** y la misma duda anotada contra `quotations-billing`. Ninguna de las
  dos descriptions fue editada. Es un caso genuinamente ambiguo donde ambas aplican.
- `coolify-databases-backups-oblicuo` — el escenario nunca dice que la base corra en Coolify;
  elegir el gate genérico `backup-restore-dr` es defendible.

En ambos la correcta quedó segunda. **No se editó nada por ellos**: forzar una description para
ganar un caso ambiguo es sobreajustar al set dorado.

---

## Detalle de la ronda 1

```
Escenarios: 348    Jueces: 6 (ciegos, independientes)

Top-1: 97.1%   (338/348)
Top-3: 100.0%  (348/348)

  directo   n=174   top1=100.0%   top3=100.0%
  oblicuo   n=174   top1= 94.3%   top3=100.0%

Posición de la skill correcta:  1ª → 338    2ª → 9    3ª → 1    fuera del top-3 → 0
```

Ningún escenario dejó a la skill correcta fuera de las tres primeras.

## Método

Diseñado para que el resultado no se pueda inflar:

1. **Generación del set dorado** — seis agentes escribieron 2 escenarios por skill leyendo
   **únicamente el cuerpo** del `SKILL.md`, con instrucción explícita de ignorar la línea
   `description:`. Si el escenario se derivara de la description, la prueba mediría su propio eco.
2. **Dos dificultades por skill.** El `directo` usa el vocabulario del tema. El `oblicuo` describe
   un **síntoma** sin los términos que nombran a la skill, y es el que mide de verdad:
   > «dos usuarios guardaron el mismo paciente y se pisaron los datos» — en vez de «locking optimista»
3. **Control automático de fuga**: un script verificó que ningún prompt oblicuo contuviera el
   nombre de su skill ni sus tokens de 6+ caracteres. La primera corrida de un lote detectó una
   fuga real y se corrigió antes de medir.
4. **Juicio a ciegas.** Los jueces recibieron solo `{id, prompt}` y el catálogo de 174
   `nombre: description`. Sin acceso a los `SKILL.md` ni al set dorado, y con instrucción de
   ignorar el `id` (que insinúa la respuesta). Los escenarios se mezclaron entre áreas con semilla
   fija para que ningún juez viera un bloque contiguo del mismo tema.
5. **Puntuación por script** (`score.py`), no por criterio de nadie.

## Reproducir

```bash
python docs/evals/score.py          # tabla
python docs/evals/score.py --json   # para consumo automático
```

Artefactos: `catalogo.md` (entrada de los jueces) · `escenarios/` (set dorado con la respuesta
esperada) · `jueces/` (entrada ciega) · `veredictos/` (salida de cada juez).

## Los 10 fallos de top-1

En los 10 la skill correcta quedó 2ª (nueve) o 3ª (uno). Son de dos clases distintas, y la
distinción importa: **no todos son defectos de la description.**

### A. La etiqueta del set dorado era discutible o directamente errónea

| Caso | Esperaba | Eligió | Veredicto |
|---|---|---|---|
| CODEOWNERS presente pero no exige revisión | `github-repo-standards` | `github-branch-protection-rulesets` | **El juez acertó.** Hacer cumplir CODEOWNERS es de rulesets. Etiqueta mal puesta. |
| Componentes que llaman `HttpClient` adentro | `smart-dumb-components` | `frontend-data-access` | Las dos aplican. La elegida lo dice casi textual. |
| Doce botones al mismo nivel, nada resalta | `frontend-ui-design` | `visual-hierarchy-composition` | Defendible; en revisión. |
| Campo removido rompe la app mobile | `github-releases-versioning` | `github-multirepo-coordination` | Defendible; en revisión. |

### B. Frontera genuinamente difusa — corresponde afilar la description

| Caso | Par en conflicto |
|---|---|
| Delegar la lectura de 40 archivos sin llenar el contexto | `agent-orchestration` ↔ `context-thrift` |
| Delegar a algo aislado y sin permisos de escritura | `subagent-design` ↔ `context-thrift` |
| Controller de 200 líneas con reglas de negocio | `backend-development` ↔ `nestjs-development` |
| Nadie se pone de acuerdo en si la tarea está hecha | `outcome-first` ↔ `requirements-and-acceptance` |
| Pedido enorme, no sabemos por dónde cortarlo | `lane-authoring` ↔ `vertical-slicing` |
| Recordatorio duplicado o perdido al fallar el guardado | `async-messaging-events` ↔ `notifications-delivery` |

## Señal previa a la medición

Los seis generadores, sin comunicarse entre sí, predijeron los mismos clusters de solapamiento:
seguridad (`security-guardrails` / `security-testing` / `secure-code-review` / `api-pentest` /
`authz-access-control`) y diseño visual (`frontend-ui-design` / `frontend-beautiful-ui` /
`visual-hierarchy-composition` / `ui-quality-review`). La coincidencia entre agentes aislados es
señal fuerte, y la medición la confirmó parcialmente.

## No cubierto

- Esto mide el **enrutamiento por description**, no la **utilidad del contenido** de cada skill.
  Que se cargue la skill correcta no prueba que su cuerpo resuelva bien el problema.
- No se midieron **falsos positivos**: si una skill se dispara cuando no corresponde. Haría falta
  un set de escenarios negativos (pedidos que no deberían cargar ninguna skill del catálogo).
- Un solo juez por escenario. No hay acuerdo inter-juez sobre el mismo caso.
- Jueces y set dorado son del mismo modelo base; un evaluador distinto podría puntuar distinto.

## Próxima ronda

Tras afilar las fronteras de la clase B, **re-medir con jueces nuevos** sobre los mismos 348.
El riesgo a vigilar es la regresión: una description más ancha puede robarle casos a su vecina, así
que la ronda 2 no se acepta si sube el oblicuo pero baja el directo.
