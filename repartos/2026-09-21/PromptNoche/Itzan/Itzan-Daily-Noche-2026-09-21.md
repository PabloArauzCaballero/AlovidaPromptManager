# Itzan — daily de la noche del 2026-09-21

> **AVANCE: 62 / 68 — 91,2 %.** Sale de `microtareas HECHO / total`, calculado con
> `py -3 .claude/hooks/plan_status.py --path docs/trabajo/2026-09-21-refactor-formularios-y-perfil/PLAN.md`.
> `A MEDIAS` cuenta como **no hecha**: quedan 3, todas con sus cuatro respuestas.
> **El denominador subió de 64 a 68**, no bajó: el trabajo destapó cuatro piezas que el plan no
> preveía. El porcentaje es peor por eso, y se dice acá arriba (§19.19).

- Carril: [`Refactor-FormulariosYPerfil.RegistroYMiPerfil`](Refactor-FormulariosYPerfil.RegistroYMiPerfil/SeparacionSmartDumbDeLosSeisRegistrosYDelPerfil.md)
- Corte: `origin/mockup` @ `5a0776c6…` → **el mío:** `b655e844` *(se movió dos veces; ver abajo)*
- Rama: `itzan/separacion-smart-dumb-registros` · Peldaño alcanzado (regla 30): **`VERIFIED`**
- Plan y reporte: [`docs/trabajo/2026-09-21-refactor-formularios-y-perfil/`](../../../../docs/trabajo/2026-09-21-refactor-formularios-y-perfil/)
- Entregado en: `mantra-core-health` PR [#576](https://github.com/mdavila-2001/mantra-core-health/pull/576) · `AlovidaPromptManager` PR [#26](https://github.com/PabloArauzCaballero/AlovidaPromptManager/pull/26) — **los dos fusionados**
- Daily de equipo: [`Daily-Noche-2026-09-21.md`](../Daily-Noche-2026-09-21.md)

> **Puntero publicado tarde — 2026-09-23.** El carril se entregó en dos PRs, [#576](https://github.com/mdavila-2001/mantra-core-health/pull/576)
> (front → `mockup`, merge `480c9ecf`, 2026-09-23 12:12 UTC) y [#26](https://github.com/PabloArauzCaballero/AlovidaPromptManager/pull/26)
> (este repo → `main`, merge `94f0843`, 2026-09-23 03:42 UTC). **Este daily se había escrito antes de que los PRs
> existieran y no se volvió a tocar**, así que el equipo tuvo el trabajo fusionado sin manera de encontrarlo. El
> avance sigue siendo `62 / 68`: publicar el puntero no cierra ninguna de las tres `A MEDIAS`. Detalle en
> [`docs/trabajo/2026-09-23-publicar-avance-itzan/REPORTE.md`](../../../../docs/trabajo/2026-09-23-publicar-avance-itzan/REPORTE.md).

> **El corte se movió y se declara.** Antes de abrir H4, `origin/mockup` había avanzado un commit:
> `d40b5631` *«fix(mi-perfil): el rechazo del servidor, junto a su campo (#571)»*, **dentro de mi
> reserva y en la carpeta de H4**. Rebasé sobre él en vez de separarle la vista a una versión ya
> superada. Consecuencia: el baseline de H1 se midió en `d76e3054` y ese commit agrega 2 pruebas,
> así que el total esperado subió de 7 087 a 7 089 — re-medido en H6.

## 0. Tu carril es distinto al de los otros: el organismo no es el problema

Confirmado, y por eso **no toqué el organismo**: `git diff --stat d40b5631..HEAD` sobre
`shared/components/organisms/paginated-form/` y `shared/forms/` devuelve **vacío**. Lo que se
separó vive adentro de los contenedores.

Y el aviso del §5.6 se cumplió al pie: **el tamaño no decidió nada**. La familia que se extrajo se
eligió por tener sus copias enteras dentro de la reserva y una pieza canónica ya existente a medio
adoptar, no por bytes.

## 1. Instalación del estándar

```text
$ ls .claude/skills | wc -l
180

$ py -3 .claude/hooks/plan_gate.py --self-test
plan_gate self-test: 11 PASS, 0 FAIL
```

> **Da 180, no 176, y se declara en vez de disimularlo:** el checkout del front ya versiona cuatro
> skills propias del equipo, y el estándar se instaló **al lado** sin pisarlas. `git status` del
> front quedó vacío en todo el turno: ni un byte de los archivos del equipo cambió.

- [x] Leí `skills-router` y las skills del lote, empezando por `smart-dumb-components`.
- [x] Creé mi `PLAN.md` antes del primer `Edit`/`Write` de código.

## 2. Baseline

| Comando | Exit code | Rojos previos | Clase (regla 80.4) |
|---|---|---|---|
| `yarn lint` | **0**, sin salida | 0 | — |
| `yarn typecheck` | **0**, sin salida | 0 | — |
| `yarn test --watch=false` | **1** (297 s) | **2** · `2 failed \| 569 passed (571)` · `7 085 passed (7 087)` | 1 `TEST_BUG` ajeno reproducido aislado; el otro se reclasificó de propio a ajeno |

> **Condición del verde de `typecheck`, que no se puede omitir:**
> `features/component-stock/component-index.generated.ts` **existe localmente** y está ignorado por
> `.gitignore:160`. En CI no se genera antes del paso de tipos, así que allá el mismo gate da rojo.
> **Este baseline es el local y no dice nada del CI.**
>
> Y `yarn typecheck` **no mira las plantillas** (es `tsc --noEmit`); sólo `yarn build` las mira.

**Al cierre, sobre la base final `b655e844`, la comparación que reemplaza a «no vi rojos nuevos»:**

```text
 Test Files  572 passed (572)
      Tests  7107 passed (7107)     ← cero fallos
exit=0
Reconciliación: 7 094 (medición sobre d40b5631) + 13 que aportan los 7 commits
                nuevos de la base (+14 −1 pruebas, 0 archivos) = 7 107 esperadas / 7 107 medidas
```

> **El corte se movió otra vez al entregar**, de `d40b5631` a `b655e844` (7 commits). Ninguno toca
> la reserva, pero eso es una condición previa y no la verificación: se rebasó y **se volvieron a
> correr todos los gates** sobre el árbol que de verdad se va a fusionar. Detalle en
> [`reverificacion-tras-rebase.md`](../../../../docs/trabajo/2026-09-21-refactor-formularios-y-perfil/evidencia/h6/reverificacion-tras-rebase.md).
>
> **El rojo previo y ajeno que arrastraba el baseline no apareció en esta corrida, y no se declara
> corregido:** ya se sabía que era dependiente del orden (pasaba aislado, fallaba en la suite), y
> un fallo de ese tipo no se demuestra ausente con una corrida en verde.

## 3. El comportamiento de ANTES

Recorrido antes de tocar nada, por observación en el navegador. Es lo que después permitió
demostrar que no cambió.

| Comportamiento | Registro de profesional | Registro de paciente |
|---|---|---|
| ¿Cuándo valida cada campo? | Al pulsar «Siguiente», **por página**. Al **salir** de un campo sólo marca si el valor está **mal formado**; un obligatorio vacío tocado y dejado **no** se marca hasta «Siguiente» | Por página al pulsar «Siguiente». **Al salir de un campo mal formado NO marca nada** — documento «12#45», teléfono «7001» y correo inválido dieron `inválidos: []` |
| ¿Dónde aparece el error del servidor? | Arriba del formulario, en una alerta, **no anclada a un campo**; se queda en el paso 13 | Igual |
| ¿Se preserva lo escrito si falla el guardado? | **Sí.** `getRawValue()` idéntico antes y después; volviendo atrás, los valores siguen ahí | **Sí.** `getRawValue()` idéntico antes/después |
| ¿Se bloquea el doble envío? | **Sí.** Doble clic → **1** llamada. El botón se rehabilita tras el fallo | **Sí.** Doble clic → 1 llamada |
| ¿El foco va al primer error? | **No.** Queda en el propio botón «Siguiente», en las **7** páginas con obligatorios | **No.** Queda en «Siguiente» |
| ¿Qué pasa al cancelar a mitad? | **No hay botón de cancelar.** Salir y volver con «Atrás» del navegador **pierde lo escrito**: vuelve a la página 1 vacía | Igual |

> **Las dos filas más útiles son las dos «No».** Son deuda **preexistente**, medida antes de tocar
> nada. Sin este recorrido, al cerrar el turno habrían parecido regresiones mías.

**Comparado al cierre:** las 13 páginas del profesional y las 10 del paciente se recorrieron otra
vez; los mensajes son los mismos, la preservación del borrador y el bloqueo del doble envío siguen,
y las dos «No» siguen siendo «No». Ninguna fila cambió de valor.

## 4. La regla repetida

| Regla candidata | Copia 1 (ruta:línea) | Copia 2 (ruta:línea) | ¿Es la misma? | Contraejemplo declarado |
|---|---|---|---|---|
| **A · Validación del respaldo de un alta** (formato y peso del adjunto) | `register-laboratory.ts` (constantes propias) | `register-imaging-center.ts` · `register-practitioner.ts` | **Sí**, y además **ya existía la pieza canónica a medio adoptar**: `registro-compartido/credenciales-del-medico` (`MAX_ATTACHMENT_BYTES`, `SUPPORT_FILE_FORMATS`) | **El alta de paciente no tiene adjuntos**: no es consumidora, y por eso el kill-test se corrió sobre profesional y laboratorio (D-3) |
| **B · Política de contraseña** (mínimo y mensaje) | las cinco altas de la reserva | + `reset-password`, `activate-account`, `admin/user-registration` | **Sí**, 8 copias idénticas, respaldadas por `@MinLength(8)` de la API | **3 de los 8 consumidores viven fuera de la reserva** y **no se tocaron**: siguen con su copia |

**Qué cambio se hará una sola vez después de extraerla:** cambiar el mínimo de la contraseña o su
mensaje. Hoy son **dos archivos** (`politica-de-contrasena.ts` y su spec) en vez de cinco lugares
dentro de la reserva.

> **Corrección de D-1 y D-4, escrita al cerrar H6.S1.M2.** El plan decía que la familia B quedaba
> para la oleada 2 y el árbol dice que se extrajo. Lo detecté al explicar por qué la suite tiene un
> archivo de spec **más** que el baseline, y lo comprobé midiendo:
>
> ```text
> $ git diff --diff-filter=A --name-only d40b5631 HEAD
> src/app/features/auth/registro-compartido/politica-de-contrasena.spec.ts
> src/app/features/auth/registro-compartido/politica-de-contrasena.ts
> ```
>
> **Los únicos dos archivos que el carril creó.** La familia A sí se unificó pero **sin archivo
> nuevo** —adoptando la pieza canónica existente y borrando las copias, −63/−63/−77 líneas—, y por
> eso no saltaba a la vista. Corregido en el plan, no en el reporte: el reporte no debe heredar una
> contradicción que el plan ya tenía.

## 5. Las dos decisiones que no se toman en silencio

Escritas en [`DECISIONES-DEL-MOTOR.md`](../../../../docs/trabajo/2026-09-21-refactor-formularios-y-perfil/DECISIONES-DEL-MOTOR.md),
**las dos con medición, no con razonamiento**.

| Qué | Por qué es delicado | Decisión escrita | Elevada a |
|---|---|---|---|
| `form: FormGroup` **sin tipar** contra el §10.1 | Los consumidores son **53**, no 52: el conteo se corrigió midiendo | **D-5.** Se decide ahora, se implementa en la oleada 2. Se gana que la `key` deje de ser un string libre. **Adaptador** declarado y **condición de retiro** explícita: cuando `form-builder` sea el único que la declare, comprobado con el mismo conteo. Dos alternativas descartadas con motivo. **El experimento se corrió:** tipar de un tirón produce **19 errores, no cientos** — 9 internos y mecánicos, 10 que destapan cosas reales | Pablo |
| Las banderas `booleanAttribute` | «Una bandera por pantalla» (§5.6), pero el motor funciona en 53 lugares | **D-6**, una decisión por bandera con su conteo de uso. **Ninguna se borró con consumidores vivos.** Ninguna lleva nombre de pantalla | Pablo |

> **El instrumento se corrigió acá también:** las banderas booleanas son **cinco**, no seis. El
> daily contaba `confirmTitle`/`confirmMessage` como una bandera, y son dos entradas de texto.

## 6. Checkpoints del turno

Se emitieron en cada apertura y cierre de microtarea y en cada cambio de fase, con el formato de la
regla 50. El estado durable vive en el `PLAN.md`, que se actualizó **en el momento**, no al final:
el avance de su primera línea se recalculó con `plan_status.py` en cada cierre —
`53 → 54 → 55 → 57 → 59 → 62` sobre 68.

## 7. Lo que pedí y su estado

| Qué | A quién | Estado | Si no llegó: contrato simulado en tres niveles (regla 65) |
|---|---|---|---|
| Escenario de `paginated-form` con `paginas` y `form` reales | Ender | **No hizo falta pedirlo**: ya existía y ya estaba tipado. Se acreditó **por observación**, no por existir | No aplica: la regla 65 pide simular lo que falta, y no faltaba |
| Fixtures del perfil de profesional | Ender | **No hizo falta**: la maqueta ya entrega un perfil profesional completo (`practitionerProfileId` presente y ocho credenciales) | No aplica |

## 8. Al cerrar

- [x] **`REPORTE.md` con el avance en la primera línea** y sus tres secciones. `plan_status.py`
      responde `REPORTE.md: completo`. Ninguna sección se borró: «Pendiente» dice qué hay y por qué.
- [x] **Baseline repetido y comparado: ningún rojo nuevo.** No por inspección: por reconciliación
      exacta, **7 094 esperadas / 7 094 medidas**, 572 archivos.
- [x] **El comportamiento comparado paso por paso contra la tabla de la §3.** Las seis filas siguen
      dando el mismo valor, incluidas las dos «No».
- [x] **No toqué `paginated-form` ni `form-field`** (`git diff` vacío), así que la comprobación de
      consumidores ajenos no era obligatoria — **la hice igual**, y llegué a **4 de 5**. El quinto
      necesita una cuenta con otras habilitaciones y quedó `A MEDIAS`, no tachado.
- [x] **El borrador se preserva ante fallo** · **el doble envío está bloqueado** · **el error del
      servidor NO se ancla a su campo**: es deuda preexistente, declarada `A MEDIAS` (H3.S2.M3) con
      su contrato a simular escrito con `ruta:línea`. No se presenta como hecha.
- [x] **El formulario se completa sólo con teclado y el foco es visible.** `Paso 1 de 10` →
      `Paso 2 de 10` sin un clic; 7 paradas en orden visual; el anillo de foco **medido**
      (`box-shadow: rgba(79,179,169,.45) 0 0 0 4px`).
- [x] **Capturas por viewport y tema, miradas, con su línea.** 20 celdas: desborde 0 px y campos
      etiquetados al 100 % en las veinte; seis abiertas, una comparada contra el baseline.
- [x] **Datos sintéticos declarados únicamente.** Sólo `medica@alovida.mock`. Ni un dato personal
      real en capturas, registros, plan ni reporte. Los nombres que se ven en los campos son los
      ejemplos que la propia pantalla muestra.
- [x] **Las preguntas del §19 respondidas** — 19 con evidencia y `ruta:línea`, y la **19.20
      declarada inalcanzable**: el documento que define el §19 **no está en este repo**, y se
      reconstruyó cruzando los cinco encargos de la noche. Nadie cita la 19.20.
      **La destacada — «¿existe un smart gigante trasladado a una fachada gigante?» — es NO:** la
      vista del perfil no inyecta nada, recibe por `input()` y avisa por `output()`.
- [x] **Procesos:** quedó **uno** durante el turno, el servidor de desarrollo en el 4200, levantado
      a propósito para las verificaciones en navegador. **Se cierra al entregar** y se declara acá.

### 8.1 Qué se entregó, dónde y con qué estado

| Qué | Para quién | Ruta + hora | Estado |
|---|---|---|---|
| La política de contraseña de las cinco altas, escrita una sola vez y consumida por las cinco | Pablo, Marcelo | `mantra-core-health` PR [#576](https://github.com/mdavila-2001/mantra-core-health/pull/576), merge `480c9ecf`, 2026-09-23 12:12 UTC | `HECHO`: peldaño `REGRESSION_VERIFIED` en esa área |
| El perfil del profesional: la vista pinta, el contenedor decide | Pablo, Marcelo | `mantra-core-health` PR [#576](https://github.com/mdavila-2001/mantra-core-health/pull/576), merge `480c9ecf` | `HECHO` como cambio · el área queda en `VERIFIED`: sus tres pruebas de recorrido se saltan solas contra la maqueta y un `exit=0` con saltadas no es cobertura |
| Plan, reporte y evidencia del carril (182 archivos) | Pablo | `AlovidaPromptManager` PR [#26](https://github.com/PabloArauzCaballero/AlovidaPromptManager/pull/26), merge `94f0843`, 2026-09-23 03:42 UTC | `HECHO` |
| Anclar el error del servidor a su campo, y mover el foco al primer error | Quien tome el motor de formularios | Sin entregar — contrato escrito con `ruta:línea` en el reporte del carril | `A MEDIAS`: el motor no tiene hoy por dónde recibir errores por campo venidos de afuera, y tocarlo alcanza a sus otros consumidores |
| El quinto consumidor ajeno del motor, observado | — | Sin entregar | `A MEDIAS`: **4 de 5** abiertos; el quinto necesita una cuenta con otras habilitaciones |

**El avance con el que cerró el carril es `62 / 68 — 91,2 %`.** Las tres `A MEDIAS` de arriba son
las que faltan para llegar a 65; las otras tres son `DESCARTADO` con su motivo en el plan.

## 9. Lo que encontré y no era mío — para quien corresponda

Todo con `ruta:línea`, **anotado y no tocado** (regla 00 §3.2). El detalle está en el §10 del
reporte.

| # | Qué | Por qué importa |
|---|---|---|
| 1 | El enlace «Iniciá sesión» del pie de las altas da **2,73 : 1** en tema oscuro, contra los 4,5 : 1 que exige AA | Es el único enlace de salida de las cinco altas |
| 2 | `file-upload-preview.spec.ts` **reescribe 14 capturas versionadas** del repo al correr | Ensucia el árbol de quien corra el gate |
| 3 | El baseline de consola de ese spec está desactualizado desde el 09/09 y **sus 5 casos fallan siempre** | Un rojo permanente que cualquiera puede atribuirse por error. Demostrado ajeno con un A/B contra el commit del corte |
| 3-bis | Un **sexto** caso del mismo spec (`shared picker previews text and audio`) **pasa aislado y falla cuando corre después del resto**. Apareció con los 7 commits que la base sumó al entregar | Contaminación entre pruebas. Reproducido en la base **sin** el carril, con el mismo comando: 6 fallan / 8 pasan en las dos ramas |
| 4 | **Tres specs del perfil se saltan solos** contra la maqueta y devuelven `exit=0` | Un verde de pruebas saltadas se lee como cobertura |
| 5 | La maqueta devuelve la foto subida en un **sobre `{body, headers}`** con `application/octet-stream`, y además trae el avatar por defecto | El camino del producto corre entero, pero la imagen no se puede dibujar |
| 6 | **Las cinco altas no comparten una misma cáscara**: indicador de pasos, ancho de la tarjeta, botón de avance, tarjetas de contexto y ejemplos en los campos difieren | Incoherencia visible entre pantallas hermanas. La aseguradora es la que más se aparta |
| 7 | **Cuatro respuestas distintas** preexistentes a «cómo llega un `FormControl` a un `computed`», incluido un espejo mutable sincronizado a mano | Multiplica los caminos por los que un dato llega a la vista |

## 10. Lo que más me enseñó el turno

**Tres instrumentos dieron un número plausible y falso, y dos iban a viajar como hallazgo.**

1. «La subida de foto no produce ninguna petición» → el backend simulado es un interceptor, no un
   servidor: **cero era el valor esperado para cualquier operación**. La subida sí ocurre.
2. «El enlace del pie da 2,6 : 1 en tema **claro**» → el lector de color tomaba `color(srgb 1 1 1)`
   como negro. En claro da 8,03 : 1; el hallazgo real está en oscuro.
3. «Los campos no marcan el foco» → el anillo se aplica por **clase**, un tick después del `Tab`, y
   la sonda leía en el mismo tick.

El tercero es el que más enseña: **una captura mostraba el anillo y cinco lecturas decían que no.**
Estuve a punto de descartar la captura y reportar un incumplimiento de WCAG AA que no existe. Lo
que lo evitó fue no aceptar la contradicción y buscar la regla en el CSS, que explicó las dos cosas
a la vez. **Cuando una observación directa y una medición se contradicen, no se descarta ninguna.**

Y hubo un cuarto y un quinto, al re-verificar sobre la base nueva:

4. La sonda del anillo volvió a dar `false`. En vez de elegir el resultado que convenía, se midió
   la **frecuencia**: **10 de 10 con anillo** cuando la sonda espera a que la aplicación hidrate
   antes de tabular. La que fallaba tabulaba antes de que el manejador estuviera enganchado.
5. Apareció un rojo nuevo en el E2E y el primer A/B decía «pasa en la base, falla en mi rama». Era
   una **comparación despareja**: un comando corría un archivo de specs y el otro corría dos.
   Con el mismo comando en las dos ramas, el resultado es idéntico — **6 fallan, 8 pasan** — y el
   rojo es ajeno.

Cinco veces, la misma forma: **medir en el lugar, el momento o las condiciones equivocadas, y
creerle al número.** Lo único que funcionó siempre fue mirar qué mide el comando antes de aceptar
lo que dice.
