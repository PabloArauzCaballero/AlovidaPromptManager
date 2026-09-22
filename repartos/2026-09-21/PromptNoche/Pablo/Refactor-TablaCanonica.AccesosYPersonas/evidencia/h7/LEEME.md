# Evidencia H7 — columnas Documento y Telefono

Corte `5a0776c6`, rama `pablo/refactor-tabla-canonica`. Ruta real
`/administration/patients`, cuenta `superadmin@alovida.mock`, viewport 1440x900.

## Cadena verificada (sin inventar campos)

| Eslabon | Evidencia |
|---|---|
| Propietario lo pidio (19/09/2026) | comentario en `PatientListItem` |
| Tipo lo declara | `profiles.types.ts:483-484` (`nationalId`, `phone`) |
| Simulador lo sirve | `core/mock/handlers/...profiles...:204-205` |
| Cliente lo mapea | `toPatientListItem` -> `{ ...limpio }`, `profiles.client.ts:1045-1048` |
| Tabla lo mostraba | NO, antes de este cambio (`patient-list.ts` solo tenia 4 columnas) |

## Spec dirigido, tres niveles

`yarn test --watch=false --include=.../patient-list.spec.ts` -> **13/13 PASS** (exit 0).
Los tres nuevos:
- `con documento y telefono en la fila, la tabla los muestra` (correcto)
- `sin documento ni telefono en la fila, la celda lo declara en vez de dejar el hueco` (limite)
- `documento vacio se trata como ausente, no como una celda en blanco` (invalido)

## Captura despues, mirada

`despues-administration-patients-1440.png`: las columnas DOCUMENTO y TELEFONO aparecen
pobladas, en la misma posicion de prioridad 2 que Nacimiento y Estado. Layout no se rompio.

## Consola

Cero errores en la pantalla `/administration/patients` (`consola-despues.log` solo trae el
log informativo de modo desarrollo de Angular). Los 2 errores de CSP vistos antes son de la
pantalla `/auth` (script inline bloqueado por CSP) y no cambiaron de cantidad al navegar:
son previos, no de este cambio, y estan fuera de mi alcance (features/admin/patients).
