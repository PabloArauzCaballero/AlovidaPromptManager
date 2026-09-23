# H6.S1.M4 — peldaño de evidencia por área (regla 30)

| Área | Peldaño | Evidencia que lo sostiene |
|---|---|---|
| `organisms/body-map` (P-01) | **VERIFIED** | Spec 13/13 · integrado en `symptom-check` con spec 5/5 · camino real ejercitado en Chromium (clic, teclado, escala de grises, `prefers-reduced-motion`) · capturas ×3 viewports ×2 temas miradas |
| `symptom-check` (integración silueta + panel de texto) | **VERIFIED** | Spec 20/20 (silueta 5 + área de texto 2 + dictar 4 + los ya existentes) · consola y red limpias en las capturas de H2/H3 · `sintomas.datos.ts`/`motor.ts` con diff vacío |
| `dictado.ts` / `dictado.types.ts` | **VERIFIED** | Spec 16/16 contra el doble (3 niveles: correcto, límite, inválido) · prueba real en Chromium (ciclo completo con transcripción real tras H3.S2.M9) y Firefox (ausencia correcta) |
| `security-headers.ts` (`microphone=(self)`) | **VERIFIED** | Spec 25/25 con la expectativa nueva · `curl -sI` confirma la cabecera servida · comportamiento observado en Chromium (sin warning, escucha sostenida) |
| `patient-home` (retiro de la grilla) | **VERIFIED** | Spec 11/11 · `alv-054` actualizado y typecheck+lint en 0 (no cubierto contra la maqueta real, ver «no cubierto» abajo) · capturas ×3 viewports ×2 temas + página completa, miradas · enlaces a turnos e historia comprobados presentes |
| `dialog-service.ts` / `dialog.types.ts` / `content-dialog.ts` (D-08) | **VERIFIED** | Spec 26/26 · apilamiento probado en Chromium y Firefox, foco atrapado y devuelto |
| Regresión del módulo (lint/typecheck/test/simulador/barrido de pantallas) | **TESTED**, con `VERIFIED` parcial en el barrido de clics | Ver detalle abajo |

## El barrido de clics, en detalle (por qué no es REGRESSION_VERIFIED completo)

- **Paciente** (el rol de mi carril) y **Visitador**: `VERIFIED` — limpio en las dos corridas
  (antes y después del rebase sobre `origin/mockup`).
- **Médica** y **Admin**: hallazgos preexistentes y ajenos (HALL-M6), fuera de mi alcance — no
  suben de `DISCOVERED` porque no los investigué a fondo (no es mi área) ni los until corregí.

## Por qué el trabajo cierra en `TESTED`/`VERIFIED` por área y no en `REGRESSION_VERIFIED` global

`REGRESSION_VERIFIED` exige regresión del módulo y gates aplicables **en verde**. La regresión de
unitarios quedó en verde salvo dos tests ajenos con causa demostrada (HALL-M5) y el barrido de
clics quedó en verde para mi rol pero no para Médica/Admin (HALL-M6, ajeno). Como esos dos hallazgos
no están en mi alcance ni los causé, el trabajo de esta noche se declara **HECHO por área** con los
hallazgos elevados, no como un `REGRESSION_VERIFIED` que fingiría que esos dos rojos no existen.
