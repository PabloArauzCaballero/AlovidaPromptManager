# Evidencia — Gates locales de Reserva y Cotizaciones

## Corte y alcance

```text
base: b7785e36
head: 4c9e419f (PR #583)
```

El escaneo focal confirmó el contrato de Cotizaciones: precio `null` se presenta como `Precio no publicado`, la referencia de importe es `5 UMA` y la procedencia se rotula `Maqueta · referencia UMA`. No se encontró un literal numérico `Bs` en `src/app/features/account/cotizaciones`.

Los cuatro archivos que fallan en la suite total están fuera del diff `b7785e36..4c9e419f`:

```text
src/app/core/tutorials/definitions/definitions.spec.ts
src/app/features/auth/register-practitioner/register-practitioner.spec.ts
src/app/features/insurance/insurance-analytics/insurance-analytics.spec.ts
src/app/shared/components/organisms/data-table/data-table.spec.ts
```

## Gates focalizados

```text
$ corepack yarn eslint 'src/app/features/account/cotizaciones/**/*.ts' 'src/app/features/directory/**/*.ts'
exit 0

$ corepack yarn typecheck
exit 0

$ corepack yarn test --watch=false \
    --include=src/app/features/account/cotizaciones/**/*.spec.ts \
    --include=src/app/features/directory/**/*.spec.ts \
    --include=src/app/shared/components/molecules/search-result/search-result.spec.ts
Test Files  7 passed (7)
Tests       73 passed (73)
```

## Entrega y navegador

```text
$ corepack yarn build
exit 0

$ E2E_BASE_URL=http://localhost:4202 corepack yarn exec playwright test \
    playwright/cotizaciones-paciente.spec.ts \
    playwright/reserva-cotizaciones-recorrido.spec.ts \
    --workers=1 --reporter=list
2 passed (23.7s)
```

La instancia `4202` se levantó desde el worktree limpio del corte `4c9e419f`. Los dos escenarios comprobaron Cotizaciones sin documentos personales y el recorrido Directorio → Cotizaciones sin errores de consola ni requests.

## Gates globales: señal, no adjudicación

```text
$ corepack yarn lint
✖ 243 problems (243 errors, 0 warnings)
```

Todos corresponden a `@angular-eslint/prefer-on-push-component-change-detection`; el conteo en los focos `cotizaciones` y `directory` fue cero.

```text
$ corepack yarn test --watch=false
Test Files  4 failed | 573 passed (577)
Tests       4 failed | 7219 passed (7223)
```

Los cuatro tests fallidos son los listados arriba y no aparecen entre los 28 archivos modificados por #583. No se alteraron desde este carril.
