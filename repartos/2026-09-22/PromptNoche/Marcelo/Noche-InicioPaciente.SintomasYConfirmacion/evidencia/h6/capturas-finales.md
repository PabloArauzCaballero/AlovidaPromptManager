# H6.S1.M1 — capturas finales por viewport y tema

**Desvío declarado**: al cerrar el carril la máquina de desarrollo estaba en 1,1 GB libres (ver
`h5/regresion-3-tras-rebase.txt`, sección de memoria). Abrir un navegador y un servidor nuevos para
una ronda de capturas «desde cero» habría arriesgado otro OOM sobre una máquina compartida por al
menos tres sesiones (regla 70: la estabilidad de la máquina se prioriza sobre la velocidad). En vez
de eso, esta sección **consolida y referencia** las capturas ya tomadas y miradas microtarea por
microtarea, que siguen siendo válidas: ningún archivo de `symptom-check`, `body-map` ni
`patient-home` se tocó después de tomarlas (regla 30.4 no se activó).

## Índice de lo ya capturado y mirado

| Bloque | Dónde | Qué cubre |
|---|---|---|
| La silueta (H2) | [`evidencia/h2/capturas/`](../h2/capturas/) + [`LEEME.md`](../h2/capturas/LEEME.md) | 375/768/1440 × claro/oscuro (01-06), pecho elegido (07), escala de grises (08), foco de teclado (09) |
| El panel de texto (H3.S1) | [`evidencia/h3/capturas/`](../h3/capturas/) + [`LEEME.md`](../h3/capturas/LEEME.md) | 375/1440 sin `<details>` (01-02), texto reconocido (03) |
| El dictado (H3.S2) | [`evidencia/h3/dictado/`](../h3/dictado/) + [`LEEME.md`](../h3/dictado/LEEME.md) | Chrome: botón, ciclo completo, política de micrófono abierta · Firefox: sin botón |
| El panel retirado (H3.S3) | [`evidencia/h3/capturas/`](../h3/capturas/) (04-10) + `LEEME.md` | 375/768/1440 × claro/oscuro sin la grilla (04-09), página completa (10) |

Cada una de esas capturas fue mirada al tomarla, no sólo generada; los `LEEME.md` de cada carpeta
dicen qué se observó en cada una, línea por línea.

## No cubierto en esta ronda de cierre

- Una captura tomada específicamente el 23/09 a la hora de cierre, con el código exactamente en el
  commit final (`fb291d38` + el ajuste de `microphone=(self)`, `H3.S2.M9`). Las capturas existentes
  son de antes de ese último ajuste de cabecera de seguridad, que no cambia nada visual.
- Verificación visual del bloque «Dictar» tras `H3.S2.M9` (la política de micrófono no cambia su
  apariencia, sólo su comportamiento; ya se verificó funcionalmente en `evidencia/h3/dictado/`).
