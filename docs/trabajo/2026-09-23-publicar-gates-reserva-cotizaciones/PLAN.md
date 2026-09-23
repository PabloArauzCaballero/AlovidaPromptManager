# Plan — Publicar gates locales de Reserva y Cotizaciones

- Fecha: 2026-09-23 · Repos afectados: `AlovidaPromptManager` (escritura), `mantra-core-health` (solo lectura) · Predecesor: [`2026-09-23-cerrar-validacion-remota-cotizaciones/REPORTE.md`](../2026-09-23-cerrar-validacion-remota-cotizaciones/REPORTE.md).

## Resultado

**Actor:** coordinación o revisión de turno.
**Dónde:** el reporte de Justin y los dailies de reparto.
**Estado inicial:** #583 cuenta con evidencia focal y remota, pero faltaba publicar el corte de gates locales y distinguir sus rojos globales ajenos.
**Acción:** consultar la publicación de gates.
**Observable:** puede identificar comandos, resultados, alcance y los cuatro rojos que no pertenecen al diff de #583, sin llamarlos bloqueos ni alterar `29 / 51`.
**Fuera:** modificar código del frontend, corregir deuda global, alterar DNS/Coolify o adjudicar nuevos HECHO del carril.
**Kill-test:** si el reporte declara verde el lint o la suite global, si omite la cobertura exacta de los gates focalizados, o adjudica los rojos ajenos a #583, la publicación no vale.

## Alcance

- IN: registrar el corte `b7785e36` → `4c9e419f` de #583, los gates focalizados que pasaron, build, E2E limpio y clasificación de los rojos globales.
- OUT: cambiar `mantra-core-health`, ejecutar el barrido general que escribe artefactos, o resolver los cuatro tests globales ajenos.
- Decisión: `A MEDIAS` y `DECISION_REQUIRED` son seguimiento de calidad o de negocio; no son bloqueos activos de integración cuando el contrato simulado está declarado.

## H1 — Gates focalizados reproducibles

**CA:** Dado el reporte, cuando se revise el cierre de #583, entonces se puede repetir qué lint, tipo y specs focales pasaron.
**DoD:** comandos, alcances y resultados literales publicados.
**Estado:** HECHO

### H1.S1 — Ejecutar el corte de código

| ID | Microtarea | CA | DoD | Estado |
|---|---|---|---|---|
| H1.S1.M1 | Confirmar el diff y el contrato de Cotizaciones | Los archivos de los cuatro rojos globales no están en el diff de #583 | `git diff --name-only b7785e36 4c9e419f` y escaneo focal registrados | HECHO |
| H1.S1.M2 | Ejecutar gates estáticos y specs focales | No hay errores de lint en los 7 TypeScript del diff y sus pruebas pasan | lint de diff `0`; typecheck `0`; 7 archivos / 73 tests pasan | HECHO |

## H2 — Gate de entrega y navegador

**CA:** Dado el mismo corte, cuando se construye y navega en un servidor fresco, entonces las rutas Directorio y Cotizaciones no emiten errores de navegador.
**DoD:** build y E2E focal verde con servidor de este corte.
**Estado:** HECHO

### H2.S1 — Verificar el recorrido publicado

| ID | Microtarea | CA | DoD | Estado |
|---|---|---|---|---|
| H2.S1.M1 | Construir el frontend | El empaquetado termina correctamente | `corepack yarn build` → exit `0` | HECHO |
| H2.S1.M2 | Correr la navegación focal en un servidor fresco | Directorio → Cotizaciones termina sin errores de consola ni requests | 2 escenarios Playwright pasan | HECHO |
| H2.S1.M3 | Clasificar los gates globales | Los rojos globales se declaran sin adjudicarlos al diff de Justin | lint global 243 errores ajenos al foco; suite completa 4 fallos fuera del diff | HECHO |

## H3 — Publicación honesta

**CA:** Dado el daily personal o de equipo, cuando se lee el estado de Justin, entonces diferencia gates focales verdes de seguimiento global sin llamar bloqueo a ninguno.
**DoD:** ambos dailies enlazan el reporte y conservan `29 / 51`.
**Estado:** HECHO

### H3.S1 — Actualizar los registros vivos

| ID | Microtarea | CA | DoD | Estado |
|---|---|---|---|---|
| H3.S1.M1 | Publicar evidencia de gates | El reporte contiene comandos, corte y resultados | [REPORTE.md](./REPORTE.md) y `evidencia/gates-locales.md` | HECHO |
| H3.S1.M2 | Enlazar los dos dailies | El seguimiento queda visible sin cambiar el conteo | búsqueda de `publicar-gates-reserva-cotizaciones` y `29 / 51` | HECHO |

## Riesgos y límites previstos

| Riesgo | Impacto | Mitigación |
|---|---|---|
| Confundir rojo global con regresión de #583 | Se atribuye deuda ajena a Justin | Nombrar los cuatro archivos y contrastarlos contra el diff |
| Usar un servidor de desarrollo viejo | Se prueba código que no es el corte | Usar una instancia fresca del worktree de #583 |
| Convertir cobertura focal en regresión total | Se infla la garantía | Declarar alcance exacto y conservar los gates globales como seguimiento |
