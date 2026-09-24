# Plan — Cerrar la verificación remota de Cotizaciones

- Fecha: 2026-09-23 · Repos afectados: `AlovidaPromptManager` (escritura), `mantra-core-health` (solo lectura) · Predecesores: [`Justin-Daily-Noche-2026-09-22.md`](../../../repartos/2026-09-22/PromptNoche/Justin/Justin-Daily-Noche-2026-09-22.md) y [`2026-09-23-publicar-avance-justin/REPORTE.md`](../2026-09-23-publicar-avance-justin/REPORTE.md).

## Resultado

**Actor:** coordinación o revisión de turno.
**Dónde:** daily personal de Justin, daily de equipo y reporte de trabajo.
**Estado inicial:** el daily dice que el mockup público es anterior a #579 y que su despliegue está bloqueado; el recurso de Coolify ya muestra un despliegue posterior exitoso.
**Acción:** consultar el cierre publicado.
**Observable:** puede identificar el SHA desplegado, la relación con el PR #583 de Cotizaciones, la prueba remota que pasó y el límite de que el backend es simulado, sin alterar el avance publicado de `29 / 51`.
**Fuera:** modificar el frontend, DNS, configuración de Coolify, datos/precios de negocio, o los DoD históricos del carril.
**Kill-test:** si el reporte no conserva el SHA de Coolify y el resultado literal `1 passed`, o si llama API real al doble del mockup, el cierre no vale.

## Alcance

- IN: documentar el despliegue exitoso `fc8adc4`, su relación con #583 (`5dc38c9`), el E2E remoto de Cotizaciones y rectificar el bloqueo remoto obsoleto en ambos dailies.
- OUT: alterar `29 / 51`, resolver Q-16/precios sin fuente de negocio, fabricar una línea base anterior, cambiar `demo.alovidasalud.com` o desplegar otra versión.
- Decisión: el peldaño se declara `VERIFIED contra el doble` porque el E2E usó el backend simulado que expone el mockup; no es una integración con la API real ni una regresión completa.

## H1 — Evidencia remota trazable

**CA:** Dado el cierre en PromptManager, cuando alguien lo abre, entonces puede comprobar qué versión de Coolify sirvió el mockup y qué recorrido remoto pasó sin depender del chat.
**DoD:** evidencia literal del despliegue y del E2E; `git diff --check`; sincronización de instrucciones sin deriva.
**Estado:** HECHO

### H1.S1 — Capturar los hechos remotos

| ID | Microtarea | CA | DoD | Estado |
|---|---|---|---|---|
| H1.S1.M1 | Registrar el despliegue exitoso de Coolify y su SHA | El reporte relaciona #583 con una versión posterior desplegada | `evidencia/coolify-despliegue-2026-09-23.txt` conserva `fc8adc4` y `Success` | HECHO |
| H1.S1.M2 | Ejecutar el E2E público de Cotizaciones | La ruta remota responde y el escenario no consulta documentos personales | `npx playwright test playwright/cotizaciones-paciente.spec.ts --workers=1 --reporter=list` → `1 passed` | HECHO |

## H2 — Publicación sin inflar el avance

**CA:** Dado el daily de Justin o el daily de equipo, cuando se lee el cierre, entonces el bloqueo remoto ya no figura como pendiente y los pendientes reales siguen diferenciados.
**DoD:** ambos dailies enlazan este reporte; el conteo permanece `29 / 51`.
**Estado:** HECHO

### H2.S1 — Rectificar los registros vivos

| ID | Microtarea | CA | DoD | Estado |
|---|---|---|---|---|
| H2.S1.M1 | Actualizar el daily personal | No declara el mockup como bloqueado ni altera el conteo publicado | búsqueda de `fc8adc4` y `29 / 51` | HECHO |
| H2.S1.M2 | Actualizar el daily de equipo | El bloqueo de SSH no aparece como bloqueo vigente de Justin | búsqueda de `fc8adc4` y ausencia de “Mockup observado anterior a #579” | HECHO |

## Riesgos y límites previstos

| Riesgo | Impacto | Mitigación |
|---|---|---|
| Confundir un E2E contra el doble con una API real | Se sobrestima la cobertura | Declarar explícitamente el backend simulado en reporte y dailies |
| Confundir esta verificación con los pendientes originales | Se infla el avance | Mantener `29 / 51` y enumerar los DoD que aún faltan |
| El dominio `demo.alovidasalud.com` no apunta al servidor de Coolify | No es apto para esta comprobación | Usar sólo el dominio `sslip.io` que Coolify marca con DNS coincidente; no cambiar DNS |
