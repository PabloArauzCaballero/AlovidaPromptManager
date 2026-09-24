# Justin — cerrar el carril sin frenos

> **Para el agente que corre el carril de Justin.** Esto manda sobre la forma de trabajar del
> [carril](Noche-ReservaYCotizaciones.DirectorioYPrecios/ClicUnicoEnElDirectorioYCotizacionesPorPrecioYCercania.md)
> y del [daily](Justin-Daily-Noche-2026-09-22.md). No cambia **qué** hay que hacer, solo **cómo**:
> primero se termina el código y al final se documenta todo junto.
>
> **No deroga ninguna regla de `.claude/rules/`.** Recorta lo que esas reglas no piden: PRs de
> papeleo, mediciones repetidas y evidencia visual en cada paso.
>
> Escrito el 2026-09-24 por Pablo.

## Por qué existe este archivo

Del 22 al 24 de septiembre el carril produjo **566 líneas de código** contra **2.891 de documentos y
evidencia**. Además hubo siete PRs solo de papeleo en este repo (publicar avance, corregir avance,
registrar seguimiento). El baseline de #610 tomó un día entero y **no sumó ninguna microtarea**.
El avance quedó en **29/51**. El trabajo está bien hecho; el problema es que casi todo el tiempo se va en
reportarlo.

## Lo que falta

51 microtareas: **29 HECHO**, **6 DESCARTADO** (H4.S1.M1–M6, decisión de producto) → **quedan 16**.

Punto de partida conocido (de la
[adjudicación de #583](https://github.com/mdavila-2001/mantra-core-health/blob/mockup/docs/trabajo/2026-09-23-cierre-local-reserva-cotizaciones/evidencia/adjudicacion-51.md)):

| Bloque | Qué falta | Cómo se cierra ahora |
|---|---|---|
| H1.S2 y H2.S2 | Medición antes/después hasta cupos | **Ya está medida** en #610 (1691 → 1163 ms y 1431 → 991 ms, 10 muestras por corte). Se usa esa medición. **No se vuelve a medir.** |
| H2.S2.M1–M4 | Una lectura de cupos por médico, en paralelo, «próximo hueco» solo con semana vacía | Código + spec con `HttpTestingController`. Si el endpoint de Ender no filtra por profesional: `forkJoin` por sede, declarado. |
| H3.S2.M2–M4 | Origen para la distancia, tabla con acciones y los seis estados | Código + spec, con el doble simulado (regla 65). |
| H5.S1.M1–M2 | `lint` y `test` | El gate es **«ningún rojo nuevo en tu diff contra el baseline»**, no el verde global. |
| H6.S1.M3–M5 | Brechas, peldaño por área y `REPORTE.md` | Al final, una sola vez. |

**Paso 0, en 15 minutos y sin PR:** hacé la lista exacta de los 16 IDs pendientes cruzando la
adjudicación con el carril. Guardala en tu `PLAN.md` local y empezá por el primero.

## Las ocho reglas

### 1. Nada te frena: lo que depende de otro se simula y se sigue

- **Ender** no publicó la latencia, el filtro por profesional en `GET /scheduling/slots` o el renglón del
  menú: contrato simulado en tres niveles (regla 65), anotado en una línea del `PLAN.md`, **y seguís**.
- **Precio sin procedencia** (esperando la decisión de negocio): se muestra «precio no publicado por la
  sede», con procedencia en el `title`. El arancel médico va **en UMA**, con el rótulo «referencia del
  Colegio Médico 2025» y sin conversión. Esa decisión ya está tomada: no hay que esperar a nadie.
- **Lint global rojo (243) y 4 tests rojos de la suite:** no son tuyos. Comparás contra el baseline y
  declarás «ningún rojo nuevo».
- No se abre ninguna pregunta al equipo que frene el trabajo. Si hace falta una, se anota en la lista
  de brechas del reporte final y se sigue con el supuesto más conservador.

### 2. Cero PRs de documentación mientras trabajás

- **Prohibido** abrir PRs de «publicar avance», «corregir avance», «registrar seguimiento» o «cerrar
  verificación» en este repo hasta terminar.
- El daily y los reportes se actualizan **una vez, al final** (§8 del daily y la regla 8 de este archivo).
- Si un número publicado antes estaba mal, se corrige en el reporte final, no con un PR aparte.

### 3. Los PRs de código van por hito, no por microtarea

- Un PR por hito (H2, H3, H5), siempre a **`mockup` y a `dev`**. Nunca a `master`.
- Cuerpo del PR corto: qué IDs cierra y la salida del test focal. `PLAN.md` y `evidencia/` de texto
  sí van; **capturas no**, hasta H6.
- Cada PR se deja mergeable y se demuestra con `gh pr view` y `gh pr checks` (regla 35.2). Eso no es
  papeleo: sin eso el hito no está entregado.

### 4. La evidencia exhaustiva solo al final

- **Lo que no se posterga (regla 20.6.3):** cada microtarea se cierra corriendo su DoD, con la salida
  literal en `evidencia/` y su fila del `PLAN.md` actualizada en el momento. Eso es texto, entra en el
  PR de código del hito y cuesta segundos.
- **Lo que sí se posterga:** las capturas en 3 anchos × 2 temas, la doble revisión adversarial
  (regla 35.1) y los recorridos completos de Playwright se hacen **una sola vez**, en H6, sobre el
  código final. Solo se captura antes si el DoD de una microtarea lo pide literalmente.

### 5. No se vuelve a medir lo que ya está medido

El baseline de #610 cubre el «antes/después» de H1.S2 y H2.S2. Solo se mide de nuevo si el cambio de
H2.S2 toca el recorrido de cupos, y en ese caso **una corrida de 10 muestras, sobre el corte final**.

### 6. Solo tu carril

- Nada fuera de las 16 microtareas. Si ves otro problema, lo anotás en una línea en `PLAN.md` →
  «fuera de alcance» y seguís (skill `scope-discipline`).
- El trabajo que hizo la Mac mini (CORR-04, CORR-34, CORR-38, CORR-39 y el módulo médico, PRs #607,
  #608, #611, #612, #615 y #616) queda **registrado** en el reporte final, pero **no se sigue ni se
  amplía** desde este carril.

### 7. Una sola máquina a la vez

Antes de arrancar:

```bash
git ls-remote --heads origin 'justin/*'      # en mantra-core-health
gh pr list --author @me --state open         # PRs abiertos del carril
```

Si hay una rama `justin/*` con commits de las **últimas dos horas** que no es tuya, **no arranques**:
avisale a Justin. La Mac mini y la PC de Justin no corren el carril al mismo tiempo.

### 8. Documentar recién al terminar

Cuando los 16 IDs están en `HECHO` o `BLOQUEADO` (con el motivo concreto y qué lo destraba):

1. Evidencia final de H6: capturas 390/768/1440 × claro/oscuro miradas, recorrido de teclado y
   Playwright sobre el código final.
2. `REPORTE.md` con el avance en la primera línea, brechas y peldaño por área.
3. **Un solo PR** a este repo que actualice el daily de Justin (29/51 → número final, fila por ID) y
   agregue el registro del trabajo de la Mac mini.

## Cómo se ve «terminado»

```text
AVANCE — reserva y cotizaciones — cierre
- Hecho:      <N>/51 HECHO · 6 DESCARTADO · <M> BLOQUEADO con motivo
- Evidencia:  PRs de código <#…> (mockup y dev) · PR final de docs <#…>
- Bloqueo:    ninguno | <ID: qué lo destraba y de quién depende>
- Estado:     HECHO
- Peldaño:    VERIFIED (contra el doble) por área
```

Un `BLOQUEADO` solo vale si ya probaste el contrato simulado y el bloqueo es de producto o de
infraestructura, con nombre y apellido. «Estaba esperando a Ender» no cuenta: para eso está la regla 65.
