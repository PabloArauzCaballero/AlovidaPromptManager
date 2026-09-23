# H1.S1.M4 — Clasificación de los rojos previos (regla 80.4)

Corte `d76e3054`, sin cambios. Suite completa: `evidencia/antes/test.txt` (2 fallidos / 7 085 pasados).
Cada rojo se reprodujo aislado antes de clasificarlo.

## 1. `features/auth/register-practitioner/register-practitioner.spec.ts:2002`

«RegisterPractitioner con mockBackend › resuelve los cinco tipos canónicos de credencial desde el backend simulado»

| Corrida | Resultado |
|---|---|
| Suite completa | `Error: Test timed out in 5000ms.` (5 169 ms) |
| Aislado: `corepack yarn test --watch=false --include=src/app/features/auth/register-practitioner/register-practitioner.spec.ts` | exit 1 · `Tests 1 failed \| 96 passed (97)` · `Error: Test timed out in 5000ms.` (5 029 ms) |
| Diagnóstico, tope 60 s, solo ese test: `ng test --include=<spec> --filter "cinco tipos" --runner-config <config de diagnóstico fuera del repo con testTimeout: 60000>` | exit 0 · `✓ … resuelve los cinco tipos canónicos … 10351ms` · `Tests 1 passed \| 96 skipped (97)` |

**Causa:** el test monta el alta contra el interceptor real del mock (`provideHttpClient(withInterceptors([mockBackendInterceptor]))`,
spec:2007) y espera `fixture.whenStable()` (spec:2019). El interceptor demora cada respuesta a propósito:
`core/mock/mock-backend.interceptor.ts:251-258`, 40 ms para `/terminology`, 600 ms para la subida de
documentos, `120 + random(0..180)` ms para todo lo demás. El arranque del alta tarda ~10,4 s en asentarse
contra esa latencia simulada: más que el tope por defecto de 5 s. **No está colgado**: con más tope, la
aserción (spec:2033) pasa.

**Clase: `TEST_BUG`.** El comportamiento del componente es el esperado (la aserción pasa). Lo que no
cuadra es el presupuesto de tiempo del test frente a la latencia que el mock simula por diseño.

**Dueño:** el spec está dentro de `features/auth/register-*/**`, reservado para este carril. Entra al plan
como microtarea propia (H1.S1.M5), con su rojo ya registrado arriba, **sin tocar la aserción**.

## 2. `core/mock/handlers/insurance-analytics.handlers.spec.ts:86`

«handlers de analítica de seguros › con las primas de fábrica del catálogo, el loss ratio ya viene calculado»

| Corrida | Resultado |
|---|---|
| Suite completa | `AssertionError: expected 1 to be +0` en `expect(dashboard.kpis.coveragesWithoutPremiumCount).toBe(0)` |
| Aislado: `corepack yarn test --watch=false --include=src/app/core/mock/handlers/insurance-analytics.handlers.spec.ts` | exit 0 · `Tests 5 passed (5)` |

**Clase: `TEST_BUG`** (dependencia del orden o de estado compartido entre archivos). Reproducido: falla
sólo dentro de la suite completa y pasa aislado, con los mismos datos de fábrica. La causa concreta (qué
otro archivo deja una cobertura sin prima en el catálogo compartido) **no se investigó**: el archivo está
en `core/mock/**`, que es de Ender. Se documenta y no se toca.

**Dueño:** Ender. Para este carril es un rojo **previo y ajeno**: no bloquea la comparación del baseline,
y se vuelve a comparar en H6.S1.M2.

## 3. Rojo condicional conocido que hoy no apareció

El reporte del turno anterior registró un rojo de `accounting/resumen` que falla **sólo los lunes**.
Esta corrida es del martes 2026-09-22: no aparece. Si la regresión de H6 cae en lunes y aparece, **no es
regresión de este carril**.
