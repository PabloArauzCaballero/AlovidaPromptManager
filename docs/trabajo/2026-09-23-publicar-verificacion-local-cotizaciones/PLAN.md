# Plan — Publicar la verificación local integrada de Cotizaciones

- Fecha: 2026-09-23 · Repos afectados: `AlovidaPromptManager`, `mantra-core-health` (solo lectura) · Predecesor: `2026-09-23-publicar-avance-justin`.

## Resultado

**Actor:** Pablo y el equipo de turno.
**Dónde:** daily personal y daily de equipo del reparto nocturno.
**Estado inicial:** #581 estaba fusionado, pero la evidencia local posterior y su PR #583 no figuraban en PromptManager.
**Acción:** registrar el corte, los comandos y los límites de la verificación.
**Observable:** quien lea los dailies distingue #581 fusionado de #583 publicado, conoce las pruebas que pasaron y sabe que el carril maestro sigue en 20/51.
**Fuera:** cambiar el conteo de las 51 microtareas, afirmar un despliegue remoto o cerrar la medición de reserva.
**Kill-test:** el daily presenta #583 como despliegue o suma sus pruebas al 20/51 sin reconciliar IDs del plan original.

## H1 — Registro trazable

**CA:** Dado el daily, cuando el equipo busca el estado de Cotizaciones, entonces encuentra el SHA integrado, el PR de verificación, comandos y los límites sin recurrir al chat.
**DoD:** `git diff --check`, búsqueda de `#581` y `#583` en ambos dailies y PR de PromptManager abierto.
**Estado:** A MEDIAS

### H1.S1 — Publicar hechos sin inflar el avance

| ID | Microtarea | CA | DoD | Estado |
|---|---|---|---|---|
| H1.S1.M1 | Registrar #581 fusionado y #583 publicado en el daily de Justin | Se separa merge de despliegue y no se altera 20/51 | `rg -n '#581|#583' ...Justin-Daily...` | HECHO |
| H1.S1.M2 | Actualizar hallazgo M5 y estado Justin en el daily de equipo | El contrato corregido no queda marcado como rojo | `rg -n 'HALL-M5|#583' ...Daily-Noche...` | HECHO |
| H1.S1.M3 | Abrir PR de PromptManager | La publicación es revisable | `gh pr view <número>` | TODO |
